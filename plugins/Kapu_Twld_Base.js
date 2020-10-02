/*:ja
 * @target MZ 
 * @plugindesc TWLDベースシステムプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
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
     * スキルやアイテムを適用する。
     * 
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! Game_Action.apply
     */
    Game_Action.prototype.apply = function(target) {
        const result = target.result();
        this.subject().clearResult();
        result.clear(); // 対象の結果をクリア
        result.used = this.testApply(target); // 対象に適用可能かを調べる。
        // クリティカル判定。クリティカルしたら、問答無用で当てる。
        if (this.item().damage.critical) {
            result.critical = (Math.random() < this.itemCri(target));
        } else {
            result.critical = false;
        }
        if (result.critical) {
            result.missed = false;
            result.evaded = false;
        } else {
            result.missed = false;
            result.evaded = !this.testHit(target);
        }

        // 物理属性判定
        result.physical = this.isPhysical();
        // 吸収判定
        result.drain = this.isDrain();

        // ヒットしたかどうか
        // (適用対象でミスや回避が発生していないかどうか、ということ)
        if (result.isHit()) {
            if (this.item().damage.type > 0) {
                var value = this.makeDamageValue(target, result.critical);
                this.executeDamage(target, value);
                // this._damageValue = value;
            }
            this.item().effects.forEach(function(effect) {
                this.applyItemEffect(target, effect);
            }, this);
            this.applyItemUserEffect(target);
        }
    };

    /**
     * 当たるかどうかを判定する。
     * 
     * @param {Game_Battler} target 対象
     */
    Game_Action.prototype.testHit = function(target) {
        var subject = this.subject(); // 使用者
        var hitRate = this.itemHit(target); 
        if (this.isPhysical()) {
            var pev = target.eva // 回避率は純粋に効いてくる
                - (hitRate - 1.0) // 命中率分の補正。1.0超えた分は命中しやすくなる。
                + (target.luk - subject.luk) * 0.01; // LUKによるあたり判定(LUK高いやつは当てやすい)
            if (this.isLongRange()) {
                // 長距離の場合には相手の素早さと使用者の器用さを比較する。
                pev += this.getRelativeDiff(target.agi, subject.dex);
            } else {
                // 接近戦の場合にはDEXとAGIの合計値を比較する。
                pev += this.getRelativeDiff((target.dex + target.agi), (subject.dex + subject.agi));
            }
            return Math.random() >= pev;
        } else if (this.isMagical()) {
            var mev = target.mev // 魔法回避率は純粋に効いてくる。
                - (hitRate - 1.0) // 命中率の1.0超えた分は相手の回避率を減らす方向に効く。
                + this.getRelativeDiff(target.men, subject.men) / 2
                + (target.luk - subject.luk) * 0.01; // LUKによるあたり判定(LUK高いやつは当てやすい)
                return Math.random() >= mev;
        } else {
            return true; // その他は100%成功
        }
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
     * @param {Number} paramId パラメータID
     */
    Game_Actor.prototype.param = function(paramId) {
        let baseValue = this.paramBasePlus(paramId);
            this.paramBasePlus(paramId) *
            this.paramRate(paramId);
        baseValue += this.paramEquip(paramId);

        baseValue *= this.paramBuffRate(paramId);
        const maxValue = this.paramMax(paramId);
        const minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    };

    

})();