/*:ja
 * @target MZ 
 * @plugindesc TWLDコアシステムプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * T.World向けに、ベーシックシステムの計算式等を変更するプラグイン。
 * 
 * ■ 使用時の注意
 * 
 * 
 * ■ プラグイン開発者向け
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
    const pluginName = "Kapu_TwldCore";
    const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
        // TODO : コマンドの処理。
        // パラメータメンバは @argで指定した名前でアクセスできる。
    });

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * スキルやアイテムを適用する。
     * @param {Game_Battler} target 対象
     */
    Game_Action.prototype.apply = function(target) {
        var result = target.result(); // Game_ActionResultオブジェクト
        this.subject().clearResult(); // 使用者側の結果をクリア？？
        result.clear(); // 対象の結果をクリア
        result.used = this.testApply(target); // 対象に適用可能かを調べる。(戦闘不能の相手にダメージ与えるとかないよね。)

        // クリティカル判定。クリティカルしたら、問答無用で当てる。
        if (this.item().damage.critical) {
            result.critical = (Math.random() < this.itemCri(target));
        } else {
            result.critical = false;
        }
        if (!result.critical) {
            result.missed = false;
            result.evaded = !this.testHit(target);
        } else {
            result.missed = false;
            result.evaded = false;
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
                this._damageValue = value;
            }
            this.item().effects.forEach(function(effect) {
                this.applyItemEffect(target, effect);
            }, this);
            this.applyItemUserEffect(target);
        }
    };

    /**
     * ダメージを計算する。
     * 
     * @param {Game_BattlerBase} target 効果対象
     * @param {Boolean} ciritical クリティカルかどうか
     * @return {Number} ダメージ量。回復の場合には負数になる。
     */
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        var item = this.item();
        var baseValue = this.evalDamageFormula(target);
        var value = baseValue * this.calcElementRate(target);
        if (this.isPhysical()) {
            // 物理被ダメージレート
            // var pdr = target.pdr;
            // if (pdr < 1) {
            //     // 物理貫通率だけ加算して、最大で1.0倍まで戻せる。
            //     pdr = Math.min(1, pdr + this.subject().ppr);
            // }
            value *= this.itemPdr(target); // 物理被ダメージレートを乗算。
        } else if (this.isMagical()) {
            // 魔法被ダメージレート
            // var mdr = target.mdr;
            // if (mdr < 1) {
            //     // 魔法貫通率だけ加算して、最大で1.0倍まで戻せる。
            //     mdr = Math.min(1, mdr + this.subject().mpr);
            // }
            value *= this.itemMdr(target); // 魔法被ダメージレートを乗算
        }
        if (baseValue < 0) {
            // 回復量UPは使用者とターゲットのを足して平均する。（ベースシステムは対象のみ）
            // アイテム適用時（itemEffectRecoverHPなど）は使用者の能力は関係ないのでrec値は適用しない。
            //value *= (this.subject().rec + target.rec) * 0.5; // 除算より乗算がよい。
            value *= this.itemRec(target);
        }
        if (critical) {
            value = this.applyCritical(value); // クリティカル倍率を適用。
        }
        value = this.applyVariance(value, item.damage.variance);
        value = this.applyGuard(value, target);
        value = Math.round(value);
        return value;
    };
    /**
     * 物理ダメージレートを得る。
     * 
     * @param {Game_Battler} target 対象
     * @return {Number} 物理ダメージレート
     */
    Game_Action.prototype.itemPdr = function(target) {
        return target.pdr;
    };

    /**
     * 魔法ダメージレートを得る。
     * 
     * @param {Game_Battler} target 対象
     * @return {Number} 魔法ダメージレート
     */
    Game_Action.prototype.itemMdr = function(target) {
        return target.mdr;
    };
    /**
     * リカバリーレートを得る。
     * 
     * @param {Game_Battler} target 対象
     * @return {Number} リカバリレート
     */
    Game_Action.prototype.itemRec = function(target) {
        return target.rec;
    }
})();