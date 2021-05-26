/*:ja
 * @target MZ 
 * @plugindesc 戦闘開始時、初回TPBがたまった状態にする特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param specialFlagId
 * @text ファストアタックフラグID
 * @desc 戦闘開始時、初回のTPBがたまった状態にするスペシャルフラグID
 * @type number
 * @default 102
 * @min 6
 * 
 * @param textTraitFirstAction
 * @text 先制行動特性名
 * @desc 先制行動特性名
 * @type string
 * @default 戦闘時先制行動
 * 
 * 
 * @help 
 * 戦闘開始時、初回のTPGがたまった状態にする特性を追加します。
 * 
 * TRAIT_SPECIAL_FLAG を使用し、
 * Game_BattlerBase.FLAG_ID_FAST_ACTION を追加します。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具/エネミー
 *     <fastAction>
 *        戦闘開始時、TPBがチャージされた状態にする特性を追加する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 Kapu_Base_ParamName に対応
 * Version.0.1.1 FLAG_ID_FAST_ACTION無効時、動作しないように変更した。
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_Trait_TpbFastAction";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.FLAG_ID_FAST_ACTION = Number(parameters["specialFlagId"]) || 0;

    if (!Game_BattlerBase.FLAG_ID_FAST_ACTION) {
        console.error(pluginName + ":FLAG_ID_FAST_ACTION is not valid.");
        return;
    }

    //------------------------------------------------------------------------------
    // DataManager


    /**
     * ノートタグを処理する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        if (obj.meta.fastAction) {
            obj.traits.push({
                code : Game_BattlerBase.TRAIT_SPECIAL_FLAG,
                dataId : Game_BattlerBase.FLAG_ID_FAST_ACTION,
                value : 0
            });

        }
    };

    DataManager.addNotetagParserActors(_processNotetag);
    DataManager.addNotetagParserClasses(_processNotetag);
    DataManager.addNotetagParserWeapons(_processNotetag);
    DataManager.addNotetagParserArmors(_processNotetag);
    DataManager.addNotetagParserStates(_processNotetag);
    DataManager.addNotetagParserEnemies(_processNotetag);
    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._specialFlags && Game_BattlerBase.FLAG_ID_FAST_ACTION) {
        TextManager._specialFlags[Game_BattlerBase.FLAG_ID_FAST_ACTION] = parameters["textTraitFirstAction"] || "";
    }

    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_initTpbChargeTime = Game_Battler.prototype.initTpbChargeTime;
    /**
     * TPB値を初期化する。
     * 
     * @param {boolean} advantageous 有利な状態かどうか
     */
    Game_Battler.prototype.initTpbChargeTime = function(advantageous) {
        _Game_Battler_initTpbChargeTime.call(this, advantageous);
        if (this.specialFlag(Game_BattlerBase.FLAG_ID_FAST_ACTION)) {
            this._tpbChargeTime = 1;
        }
    };
})();
