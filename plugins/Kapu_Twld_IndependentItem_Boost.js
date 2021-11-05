/*:ja
 * @target MZ 
 * @plugindesc TWLD向け強化項目プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem_Boost
 * @orderAfter Kapu_IndependentItem_Boost
 * 
 * @param basicParamMin
 * @text 基本パラメータ補正下限
 * @desc 基本パラメータ(STR/DEX/VIT/INT/MEN/AGI/LUK)の補正値下限
 * @type number
 * @default -999
 * 
 * 
 * @help 
 * TWLD向けに追加した特製を強化項目として付与できるようにするプラグイン。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム
 *   ノートタグについては Kapu_IndependentItem_Boost を参照
 * 
 *     本プラグインで追加実装されたkeyは次の通り。
 *         STR 装備品のSTR加算・減算 (Kapu_Twld_BasicParamsが必要)
 *         DEX 装備品のDEX加算・減算 (Kapu_Twld_BasicParamsが必要)
 *         VIT 装備品のVIT加算・減算 (Kapu_Twld_BasicParamsが必要)
 *         INT 装備品のINT加算・減算 (Kapu_Twld_BasicParamsが必要)
 *         MEN 装備品のMEN加算・減算 (Kapu_Twld_BasicParamsが必要)
 *         AGI 装備品のAGI加算・減算 (Kapu_Twld_BasicParamsが必要)
 *             ※元々のAGIにも適用されます。
 *         LUK 装備品のLUK加算・減算 (Kapu_Twld_BasicParamsが必要)
 *             ※元々のAGIにも適用されます。
 * 
 *     その他のkey及びvalueの書式はboostの追加プラグインに依存。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Twld_IndependentItem_Boost";
    const parameters = PluginManager.parameters(pluginName);

    const basicParamMin = (parameters["basicParamMin"] === undefined)
            ? -999 : Math.round(Number(parameters["basicParamMin"]) || 0);

    //------------------------------------------------------------------------------
    // DataManager
    const _DataManager_applyBoostEffect = DataManager.applyBoostEffect;
    /**
     * 強化項目を適用する。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     * @param {string} key 強化項目名
     * @param {string} value 強化値
     */
    // eslint-disable-next-line no-unused-vars
    DataManager.applyBoostEffect = function(item, key, value) {
        if (Game_BattlerBase.TRAIT_BASIC_PARAM) {
            if (key === "STR") {
                DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_BASIC_PARAM, 0,
                    DataManager.getBoostValueInt(value), basicParamMin);
                return;
            } else if (key === "DEX") {
                DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_BASIC_PARAM, 1,
                    DataManager.getBoostValueInt(value), basicParamMin);
                return;
            } else if (key === "VIT") {
                DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_BASIC_PARAM, 2,
                    DataManager.getBoostValueInt(value), basicParamMin);
                return;
            } else if (key === "INT") {
                DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_BASIC_PARAM, 3,
                    DataManager.getBoostValueInt(value), basicParamMin);
                return;
            } else if (key === "MEN") {
                DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_BASIC_PARAM, 4,
                    DataManager.getBoostValueInt(value), basicParamMin);
                return;
            } else if (key === "AGI") {
                const gainNum = DataManager.getBoostValueInt(value);
                DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_BASIC_PARAM, 5,
                    gainNum, basicParamMin);
                _DataManager_applyBoostEffect.call(this, item, key, String(gainNum));
                return;
            } else if (key === "LUK") {
                const gainNum = DataManager.getBoostValueInt(value);
                DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_BASIC_PARAM, 6,
                    gainNum, basicParamMin);
                _DataManager_applyBoostEffect.call(this, item, key, String(gainNum));
                return;
            }
        }

        _DataManager_applyBoostEffect.call(this, item, key, value);
    };
})();