/*:ja
 * @target MZ 
 * @plugindesc TWLDベースシステムプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * @base Kapu_Base_Hit
 * @orderAfter Kapu_Base_Hit
 * @base Kapu_Twld_BasicParams
 * 
 * @param passiveSkillType
 * @text パッシブスキルタイプ
 * @desc パッシブスキルとして扱うスキルタイプ
 * @type number
 * @default 0
 * 
 * @help 
 * TWLD向けに、ベーシックシステムの計算式や挙動を変更するプラグイン。
 * 基本的にオーバーライドメソッドで構成される。
 * 
 * 1.アクション適用判定の変更
 *    クリティカル発生時は確実に命中とする。
 *    miss判定はせず、evadのみ結果を格納する。但し命中したかどうかはHITとEVAを考慮する。
 * 
 * 2.パラメータの計算変更
 *   MaxHP/MaxMP/ATK/DEF/MAT/MDF/AGI/LUKの計算式
 *   ベーシックシステムでは
 *       {(クラス値)+(種増減分)+(装備品)} x (特性レート) x (バフ増減レート)
 *   となっていた。これを
 *       [{(クラス値)+(種増減分)} x (特性レート) + (装備品)] x (バフ増減レート)
 *   に変更する。
 * 
 * ■ 使用時の注意
 * 
 * 
 * ■ プラグイン開発者向け
 * パッシブスキルタイプとして
 * Game_BattlerBase.PASSIVE_SKILL_TYPE を定義します。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム/スキル
 *     <longRange>
 *         物理命中判定で、DEXのみを使用する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Twld_Base";
    const parameters = PluginManager.parameters(pluginName);
    
    Game_BattlerBase.PASSIVE_SKILL_TYPE = Number(parameters['passiveSkillType']) || 0;



    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    //------------------------------------------------------------------------------
    // Game_Action

    /**
     * このアクションをtargetに適用する。
     * 命中判定とダメージ算出、効果適用を行う。
     * 
     * @param {Game_BattlerBase} target 対象
     * !!!overwrite!!!
     */
    Game_Action.prototype.apply = function(target) {
        const result = target.result();
        this.subject().clearResult();
        result.clear();
        result.used = this.testApply(target);
        if (result.used) {
            this.testHit(target);
        } else {
            result.missed = false;
            result.evaded = true;
        }
        result.physical = this.isPhysical();
        result.drain = this.isDrain();
        if (result.isHit()) {
            if (this.item().damage.type > 0) {
                result.critical = Math.random() < this.itemCri(target);
                const value = this.makeDamageValue(target, result.critical);
                this.executeDamage(target, value);
            }
            for (const effect of this.item().effects) {
                this.applyItemEffect(target, effect);
            }
            this.applyItemUserEffect(target);
        }
        this.updateLastTarget(target);
    };

    /**
     * 命中できたかどうかを評価する。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} 命中できた場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.testHit
     */
    Game_Action.prototype.testHit = function(target) {
        const result = target.result();
        if (this.isCertainlyEvad(target)) {
            result.missed = false;
            result.evaded = true;
            result.critical = false;
        } else if (this.isCertainlyHit(target)) {
            result.missed = false;
            result.evaded = false;
            result.critical = false;
        } else if (this.testCritical(target)) {
            result.missed = false;
            result.evaded = false;
            result.critical = true;
        } else if (this.testMissed(target)) {
            result.missed = true;
            result.evaded = false;
            result.critical = false;
        } else if (this.testEvaded(target)) {
            result.missed = false;
            result.evaded = true;
            result.critical = false;
        } else {
            result.missed = false;
            result.evaded = false;
            result.critical = false;
        }
    };

    /** 
     * クリティカル発生率を返す。
     * 
     * @param {Game_Battler} target
     * @return {Number} クリティカル率(0.0～1.0、1.0で100％発生)が返る。
     * !!!overwrite!!! Game_Action.itemCri()
     */
    Game_Action.prototype.itemCri = function(target) {
        const subject = this.subject(); // 使用者
        let rate = subject.cri  - target.cev + (subject.luk - target.luk) * 0.01 / 2;
        if (this.isPhysical()) {
            // 物理の場合にはDEXが効いてくる。
            // この計算式だと、対象より技量が2倍以上あると確率が100％になってしまうので
            // clampにより加算値が0.0～0.5の範囲に収まるようにする。
            const addRate = this.relativeDiffRate(subject.dex, target.dex);
            rate += addRate.clamp(0, 0.5);
        }
        rate *= this.lukEffectRate(target);
        return rate;
    };

    /**
     * ミスしたかどうかを評価する。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} ミスした場合にtrue, それ以外はfalse
     */
    Game_Action.prototype.testMissed = function(target) {
        return false;
    };
    /**
     * 回避したかどうかを評価する。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {Boolean} 回避できた場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testEvaded = function(target) {
        if (this.isPhysical()) {
            return this.testEvaPhysical(target);
        } else if (this.isMagical()) {
            return this.testEvaMagical(target);
        } else {
            return true; // その他は100%成功
        }
    };

    /**
     * このスキルがロングレンジかどうかを得る。
     * 
     * @return {Boolean} ロングレンジの場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.isLongRangeItem = function() {
        return this.item().meta.longRange;
    };


    /**
     * 物理攻撃時の回避判定を行う。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} 命中した場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testEvaPhysical = function(target) {
        let pev = target.eva; // 回避率は純粋に効いてくる
        pev += (1.0 - this.itemHit(target));// 命中率分の補正。1.0超えた分は回避しにくくなる。
        pev += this.lukEffeectRate(target); // LUKによる補正
        if (this.isLongRangeItem(target) > 1) {
            // 長距離の場合には相手の素早さと使用者の器用さを比較する。
            pev += this.relativeDiffRate(target.agi, subject.dex);
        } else {
            // 接近戦の場合にはDEXとAGIの合計値を比較する。
            pev += this.relativeDiffRate((target.dex + target.agi), (subject.dex + subject.agi));
        }
        return Math.random() <= pev;
    };

    /**
     * 魔法攻撃時の回避判定を行う。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} 命中した場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testEvaMagical = function(target) {
        let mev = target.mev; // 魔法回避率は純粋に効いてくる。
        mev += (1.0 - this.itemHit(target)); // 命中率の1.0超えると回避しにくくなる。
        mev += this.lukEffeectRate(target);
        mev += (this.relativeDiffRate(target.men, subject.men) / 2);
        return Math.random() >= mev;
    };
    /**
     * 相対的な補正値を得る。
     * 一方の値に対してもう一方の値が大きいほど、補正値が大きくなる。
     * 
     * なかなかえげつない計算式になっていて、
     * ターゲットの値 > (使用者の値x2)
     * だと1.0になる。
     * 逆に
     * (ターゲットの値x2) < 使用者の値)
     * だと-1.0になる。
     * 
     * 例）使用者 25 ターゲット35 -> 補正値 (35 - 25) / 25 = 0.4
     *     使用者 82 ターゲット92 -> 補正値 (92 - 82) / 82 = 0.12
     * 
     * 小さい側の値が大きくなるほど、差分によるレートの差が出にくくなるようにした。
     * あと使用者より2倍速い相手にそう簡単に当てられないでしょ？という考えによる。
     * 
     * @param {Number} targetVal ターゲットの値
     * @param {Number} subjectVal 使用者の値
     * @return {Number} 相対補正値
     */

    Game_Action.prototype.relativeDiffRate = function(targetVal, subjectVal) {
        const diff = targetVal - subjectVal;
        const min = Math.max(1, Math.min(targetVal, subjectVal)); // 1以上の値になるように。ゼロ除算防止
        return (diff / min);
    };

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * MaxHP/MaxMP/ATK/DEF/MATK/MDEFパラメータの増幅率を得る。
     * 
     * @return {Number} 増幅率
     * !!!overwrite!!! Game_BattlerBase.paramRate()
     */
    Game_BattlerBase.prototype.paramRate = function(paramId) {
        // 基本パラメータを乗算レートでやると、めっちゃ大きくなるのでやめる。
        // 
        const rate = this.traitsWithId(Game_BattlerBase.TRAIT_PARAM, paramId).reduce((r, trait) => {
            return r + (trait.value - 1);
        }, 1.0, this);
        return Math.max(0, rate);
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * パッシブスキルを持っているかどうかを判定する。
     * @return パッシブスキルを持っている場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.hasPassiveSkill = function() {
        return this.skills().some(function(skill) {
            return skill && (skill.stypeId == Game_BattlerBase.PASSIVE_SKILL_TYPE);
        });
    };

    /**
     * パラメータを得る。
     * 
     * Note: 装備品増加分には特性によるレートボーナスを適用外とするため、
     *       オーバーライドする。
     * 
     * @param {Number} paramId パラメータID
     * !!!overwrite!!! Game_Actor.param
     */
    Game_Actor.prototype.param = function(paramId) {
        let baseValue = this.paramBasePlus(paramId)
                *  this.paramRate(paramId) + this.paramEquip(paramId);
        const value = baseValue * this.paramBuffRate(paramId);
        const maxValue = this.paramMax(paramId);
        const minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    };

    /**
     * 基本パラメータ加算値を得る。
     * 
     * Note: 装備品増加分には特性によるレートボーナスを適用外とするため、
     *       オーバーライドする。
     * 
     * @param {Number} paramId パラメータID
     * @return {Number} 加算値
     * !!!overwrite!!! Game_Actor.paramPlus()
     */
    Game_Actor.prototype.paramPlus = function(paramId) {
        return Game_Battler.prototype.paramPlus.call(this, paramId);
    };
    
    /**
     * ablitiyIdで指定されるdataIdのパーティーアビリティを持っているかどうかを判定する。
     * 
     * @param {Number} abilityId アビリティID
     * !!!overwrite!!! Game_Party.partyAbility
     */
    Game_Party.prototype.partyAbility = function(abilityId) {
        return this.battleMembers().some(function(actor) {
            return !actor.isDead() && actor.partyAbility(abilityId);
        });
    };
})();