/*:ja
 * @target MZ 
 * @plugindesc 個別アイテム強化の重量拡張プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem_Boost
 * @orderAfter Kapu_IndependentItem_Boost
 * @base Kapu_EquipmentWeight
 * @orderAfter Kapu_EquipmentWeight
 * 
 * @help 
 * 本プラグイン単独では特性追加はありません。
 * 
 * ■ 使用時の注意
 * なし。
 * 
 * ■ プラグイン開発者向け
 * なし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム
 *   <boostEffect:args%>
 *     args書式
 *     key$ または key$=value$ をカンマ(,)で区切る。
 *     本プラグインで追加実装されたkeyは次の通り。
 *         Weight 重量。valueで指定した値だけ加算する。+1なら重量+1、-1なら重量-1。
 *                最大で1まで減らせる。
 * 
 *     valueで指定できる書式は次の通り。
 *         value#     value#固定値だけパラメータを増加させる。
 *         min#:max#  min#～max#の範囲のランダム値だけパラメータを増加させる。
 * 
 *     その他のkey及びvalueの書式はboostの追加プラグインに依存。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_IndependentItem_Boost_EquipWeight";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // DataManager
    const _DataManager_resetIndependentWeaponBoost = DataManager.resetIndependentWeaponBoost;
    /**
     * 個別武器の強化状態を初期化する。
     * 
     * @param {DataWeapon} weapon 武器
     */
    DataManager.resetIndependentWeaponBoost = function(weapon) {
        _DataManager_resetIndependentWeaponBoost.call(this, weapon);
        const baseWeapon = DataManager.getBaseItem(item);
        if (baseWeapon) {
            weapon.weight = baseWeapon.weight;
        }
    };

    const _DataManager_resetIndependentArmorBoost = DataManager.resetIndependentArmorBoost;
    /**
     * 個別防具の強化状態を初期化する。
     * 
     * @param {DataArmor} armor 防具
     */
    DataManager.resetIndependentArmorBoost = function(armor) {
        _DataManager_resetIndependentArmorBoost.call(this, armor);
        const baseArmor = DataManager.getBaseItem(item);
        if (baseArmor) {
            armor.weight = baseArmor.weight;
        }
    };
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
        switch (key) {
            case "Weight":
                if (item.weight !== undefined) {
                    item.weight = Math.max(1, item.weight + DataManager.getBoostValueInt(value));
                }
                break;
            default:
                _DataManager_applyBoostEffect.call(this, item, key, value);
                break;
        }
    };

})();
