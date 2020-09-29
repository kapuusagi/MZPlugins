/*:ja
 * @target MZ 
 * @plugindesc 戦闘開始時、初回TPBがたまった状態にする特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param specialFlagId
 * @text ファストアタックフラグID
 * @desc 戦闘開始時、初回のTPBがたまった状態にするスペシャルフラグID
 * @type number
 * @default 100
 * @min 6
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
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_Trait_FastAction";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.FLAG_ID_FAST_ACTION = Number(parameters["specialFlagId"]) || 0;

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
                code : Game_BattlerBase.Game_BattlerBase.TRAIT_SPECIAL_FLAG,
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
    // Game_Battler

    const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    /**
     * 戦闘開始時の処理を行う。
     * 
     * @param {Boolean} advantageous 有利な状態かどうか
     */
    Game_Battler.prototype.onBattleStart = function(advantageous) {
        _Game_Battler_onBattleStart.call(this, advantageous);
        if (this.specialFlag(Game_BattlerBase.FLAG_ID_FAST_ACTION)) {
            this.this._tpbChargeTime = 1;
        }

    };
})();