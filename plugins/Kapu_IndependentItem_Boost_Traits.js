/*:ja
 * @target MZ 
 * @plugindesc 個別アイテム強化の特性拡張プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem_Boost
 * @orderAfter Kapu_IndependentItem_Boost
 * 
 * @help 
 * 本プラグイン単独では特性追加はありません。
 * 必ず Kapu_Trait_xxxx とセットで導入が必要です。
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
 *         CDR クリティカルダメージレート(Kapu_trait_CriticalDamageRateが必要)
 *         TPAdd 最大TP加算(Kapu_Trait_MaxTpAddが必要)
 *         DEFPR DEF貫通率(Kapu_Trait_Penetrateが必要)
 *         MDFPR MDF貫通率(Kapu_Trait_Penetrateが必要)
 *         PDRPR PDR貫通率(Kapu_Trait_Penetrateが必要)
 *         MDRPR MDR貫通率(Kapu_Trait_Penetrateが必要)
 * 
 *         Variance ばらつき度(Kapu_Trait_Varianceが必要)
 *         ElementAttackRate(id#) 攻撃属性レート(Kapu_ElementCoreが必要)
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
    // const pluginName = "Kapu_IndependentItem_Boost_Traits";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

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
        {
            let re;
            if (Game_BattlerBase.TRAIT_ELEMENT_ATTACK_RATE
                    && (re = key.match(/ElementAttackRate\((\d+)\)/)) !== null) {
                const elementId = Number(re[1]) || 0;
                if (elementId > 0) {
                    DataManager.addBoostTraitMultiple(item, Game_BattlerBase.TRAIT_ELEMENT_ATTACK_RATE, elementId,
                        DataManager.getBoostValueReal(value));
                }

                return ;
            }
        }

        switch (key) {
            case "CDR":
                if (Game_BattlerBase.TRAIT_XPARAM_DID_CDR) {
                    DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_CDR,
                            DataManager.getBoostValueReal(value));
                }
                break;
            case "TPAdd":
                if (Game_BattlerBase.TRAIT_MAXTP_ADD) {
                    DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_MAXTP_ADD, 0,
                            DataManager.getBoostValueInt(value));
                }
                break;
            case "DEFPR":
                if (Game_BattlerBase.TRAIT_XPARAM_DID_DEFPR) {
                    DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_DEFPR,
                            DataManager.getBoostValueReal(value));
                }
                break;
            case "MDFPR":
                if (Game_BattlerBase.TRAIT_XPARAM_DID_MDFPR) {
                    DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_MDFPR,
                            DataManager.getBoostValueReal(value));
                }
                break;
            case "PDRPR":
                if (Game_BattlerBase.TRAIT_XPARAM_DID_PDRPR) {
                    DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_PDRPR,
                        DataManager.getBoostValueReal(value));
                }
                break;
            case "MDRPR":
                if (Game_BattlerBase.TRAIT_XPARAM_DID_MDRPR) {
                    DataManager.addBoostTraitSum(item, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_MDRPR,
                            DataManager.getBoostValueReal(value));
                }
                break;
            case "Variance":
                if (Game_BattlerBase.TRAIT_SPARAM_DID_VARIANCE_RATE) {
                    DataManager.addBoostTraitMultiple(item, Game_BattlerBase.TRAIT_SPARAM, Game_BattlerBase.TRAIT_SPARAM_DID_VARIANCE_RATE,
                            DataManager.getBoostValueReal(value));
                }
                break;
            default:
                _DataManager_applyBoostEffect.call(this, item, key, value);
                break;
        }
    };

})();
