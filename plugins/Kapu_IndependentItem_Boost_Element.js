/*:ja
 * @target MZ 
 * @plugindesc 個別アイテム強化の属性付与/消去プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem_Boost
 * @orderAfter Kapu_IndependentItem_Boost
 * 
 * 
 * @help 
 * 個別アイテムの強化に、属性を操作する効果を追加するプラグイン。
 * 
 * ■ 使用時の注意
 * 属性周りを変更している場合には正しく動作しません。
 * 
 * ■ プラグイン開発者向け
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
 *         ElementRate(elementId#) 
 *            属性被ダメージ率
 *            value$は属性耐性として使用される。
 *         AddAttackElement
 *            攻撃属性付与
 *            value$は属性IDとして使用される。
 *         RemoveAttackElement
 *            攻撃属性削除
 *            value$は属性IDとして使用される。
 *            ALLにすると全て
 *         
 *         
 *     valueで指定できる書式は次の通り。
 *         value#     value#固定値だけパラメータを増加させる。
 *         min#:max#  min#～max#の範囲のランダム値だけパラメータを増加させる。
 * 
 *     その他のkey及びvalueの書式はboostの追加プラグインに依存。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_IndependentItem_Boost_Element";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    //------------------------------------------------------------------------------
    // DataManager
    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張
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
        const pattern = /ElementRate\((\d+)\)/;
        if (key.match(pattern)) {
            const elementId = Number(RegExp.$1);
            const value = DataManager.getBoostValueReal(value);
            DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId, value);
        } else {
            switch (key) {
                case "AddAttackElement":
                    {
                        const elementId = Math.floor(Number(value) || 0);
                        if (elementId > 0) {
                            DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_ATTACK_ELEMENT, elementId, 0);
                        }
                    }
                    break;
                case "RemoveAttackElement":
                    if (value === "ALL") {
                        const traits = item.traits;
                        for (let index = traits.length - 1; index >= 0; index--) {
                            const trait = traits[index];
                            if (trait.code === Game_BattlerBase.TRAIT_ATTACK_ELEMENT) {
                                traits.splice(index, 1);
                            }
                        }
                    } else {
                        const elementId = Math.floor(Number(value) || 0);
                        const traits = item.traits;
                        for (let index = traits.length - 1; index >= 0; index--) {
                            const trait = traits[index];
                            if ((trait.code === Game_BattlerBase.TRAIT_ATTACK_ELEMENT) && (trait.dataId === elementId)) {
                                traits.splice(index, 1);
                            }
                        }
                    }
                    break;
                default:
                    _DataManager_applyBoostEffect.call(this, item, key, value);
                    break;
            }
        }
    };

})();
