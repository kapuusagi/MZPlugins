/*:ja
 * @target MZ 
 * @plugindesc TWLDベースシステムプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * @base Kapu_Base_Hit
 * @orderAfter Kapu_Base_Hit
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
 * 
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

    // /**
    //  * 当たるかどうかを判定する。
    //  * 
    //  * @param {Game_Battler} target 対象
    //  */
    // Game_Action.prototype.testHit = function(target) {
    //     if (this.isPhysical()) {
    //         return this.testHitPhysical(target);
    //         // var pev = target.eva // 回避率は純粋に効いてくる
    //         //     - (hitRate - 1.0) // 命中率分の補正。1.0超えた分は命中しやすくなる。
    //         //     + (target.luk - subject.luk) * 0.01; // LUKによるあたり判定(LUK高いやつは当てやすい)
    //         // if (this.isLongRange()) {
    //         //     // 長距離の場合には相手の素早さと使用者の器用さを比較する。
    //         //     pev += this.getRelativeDiff(target.agi, subject.dex);
    //         // } else {
    //         //     // 接近戦の場合にはDEXとAGIの合計値を比較する。
    //         //     pev += this.getRelativeDiff((target.dex + target.agi), (subject.dex + subject.agi));
    //         // }
    //         // return Math.random() >= pev;
    //     } else if (this.isMagical()) {
    //         return this.testHitMagical(target);
    //         // var mev = target.mev // 魔法回避率は純粋に効いてくる。
    //         //     - (hitRate - 1.0) // 命中率の1.0超えた分は相手の回避率を減らす方向に効く。
    //         //     + this.getRelativeDiff(target.men, subject.men) / 2
    //         //     + (target.luk - subject.luk) * 0.01; // LUKによるあたり判定(LUK高いやつは当てやすい)
    //         //     return Math.random() >= mev;
    //     } else {
    //         return true; // その他は100%成功
    //     }
    // };

    // /**
    //  * 物理攻撃時の命中判定を行う。
    //  * 
    //  * @param {Game_Battler} target 対象
    //  * @return {Boolean} 命中した場合にはtrue, それ以外はfalse
    //  */
    // Game_Action.prototype.testHitPhysical = function(target) {
    //     const hitRate = this.itemHit(target); 
    //     const evaRate = this.itemEva(target);
    //     const hitRate = hitRate - evaRate;
    //     return Math.random() < hitRate;
    // };

    // /**
    //  * 魔法攻撃時の命中判定を行う。
    //  * 
    //  * @param {Game_Battler} target 対象
    //  * @return {Boolean} 命中した場合にはtrue, それ以外はfalse
    //  */
    // Game_Action.prototype.testHitMagical = function(target) {
    //     const hitRate = this.itemHit(target); 
    //     const evaRate = this.itemEva(target);
    //     const hitRate = hitRate - evaRate;
    //     return Math.random() < hitRate;
    // };

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
        var rate = 1.0;
        this.traitsWithId(Game_BattlerBase.TRAIT_PARAM, paramId).forEach(function(trait) {
            rate += (trait.value - 1.0)
        });

        return Math.max(0.1, rate);
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
    

})();