/*:ja
 * @target MZ 
 * @plugindesc ウェポンマスタリの素手補正プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * @base Kapu_Twld_WeaponMastery
 * @orderAfter Kapu_Twld_WeaponMastery
 * 
 * @param bareHandsAtkRate
 * @text 素手時ATKレート
 * @desc 素手の時、素手のウェポンマスタリレベルをATKに加算するレート
 * @type number
 * @decimals 1
 * @default 2.0
 * 
 * @help 
 * 素手（武器未装備）時、ATKに素手ウェポンマスタリーレベルを考慮した補正を加算するプラグイン。
 * 素手（武器未装備）時に、
 *   ウェポンマスタリーレベル x 素手時ATKレート
 * の攻撃力を加算します。
 * 
 * ■ 使用時の注意
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
    const pluginName = "Kapu_Twld_WeaponMastery_BareHands";
    const parameters = PluginManager.parameters(pluginName);
    const bareHandsAtkRate = Math.max(0, Number(parameters["bareHandsAtkRate"]) || 0);

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_paramEquip = Game_Actor.prototype.paramEquip;
    /**
     * 装備品のパラメータ値合計を得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} 全装備品のパラメータ値合計
     */
    Game_Actor.prototype.paramEquip = function(paramId) {
        const value = _Game_Actor_paramEquip.call(this, paramId);
        if ((paramId === 2) && (Game_BattlerBase.WM_BARE_HANDS > 0) && this.hasNoWeapons()) {
            const wmLevel = this.wmLevel(Game_BattlerBase.WM_BARE_HANDS);
            return value + Math.floor(wmLevel * this.str * bareHandsAtkRate);
        } else {
            return value;
        }
    };



})();