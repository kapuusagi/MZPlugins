/*:ja
 * @target MZ 
 * @plugindesc TWLD向けLUKシステムのHIT適用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Hit
 * @orderAfter Kapu_Base_Hit
 * @base Kapu_Twld_LukSystem
 * @orderAfter Kapu_Twld_LukSystem
 * 
 * @help 
 * TWLD向けLUKシステムを命中判定に適用するプラグイン。
 * 
 * ■ 使用時の注意
 * なし
 * 
 * ■ プラグイン開発者向け
 * なし
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成した。
 */
(() => {
    //const pluginName = "Kapu_Twld_LukSystem_Hit";
    //const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_itemCri = Game_Action.prototype.itemCri;
    /** 
     * クリティカル発生率を返す。
     * 
     * @param {Game_Battler} target
     * @returns {Number} クリティカル率(0.0～1.0、1.0で100％発生)が返る。
     */
    Game_Action.prototype.itemCri = function(target) {
        const rate = _Game_Action_itemCri.call(this, target);
        return rate + (this.lukEffectRate(target) - 1);
    };

    const _Game_Action_itemHit = Game_Action.prototype.itemHit;
    /**
     * 命中率を得る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @returns {Number} 命中率。
     */
    Game_Action.prototype.itemHit = function(target) {
        const rate = _Game_Action_itemHit.call(this, target)
        return rate + (this.lukEffectRate(target) - 1);
    };

})();
