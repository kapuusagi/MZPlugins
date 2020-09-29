/*:ja
 * @target MZ 
 * @plugindesc TWLDコアシステムプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * TWLD向けに、ベーシックシステムの計算式等を変更するプラグイン。
 * 
 * 1.アクション適用判定の変更
 *    
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
                this._damageValue = value;
            }
            this.item().effects.forEach(function(effect) {
                this.applyItemEffect(target, effect);
            }, this);
            this.applyItemUserEffect(target);
        }
    };

})();