/*:ja
 * @target MZ 
 * @plugindesc 瀕死を1回耐える特性プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param specialFlagId
 * @text フラグID
 * @desc 瀕死で1回耐える特性を割り当てるフラグID
 * @type number
 * @default 113
 * @min 6
 * 
 * @help 
 * ダメージを受けたとき、瀕死で耐える特性を追加します。
 * 
 * ■ 使用時の注意
 * なし
 * 
 * ■ プラグイン開発者向け
 * TRAIT_SPECIAL_FLAG を使用し、以下の定義を追加します。
 * Game_BattlerBase.FLAG_ID_ENDURE_DYING
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
 *     <endureDying>
 *        ダメージを受けたとき、HP１で耐えます。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Trait_EndureDying";
    const parameters = PluginManager.parameters(pluginName);
    Game_BattlerBase.FLAG_ID_ENDURE_DYING = Number(parameters["specialFlagId"]) || 0;

    if (!Game_BattlerBase.FLAG_ID_ENDURE_DYING) {
        console.error(pluginName + ":FLAG_ID_ENDURE_DYING is not valid.");
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
        if (obj.meta.endureDying) {
            obj.traits.push({
                code:Game_BattlerBase.TRAIT_SPECIAL_FLAG,
                dataId:Game_BattlerBase.FLAG_ID_ENDURE_DYING,
                value:0
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
    // Game_BattlerBase
    /**
     * 瀕死で耐えるかどうかを得る。
     * 
     * @return {Boolean} 瀕死で耐える場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isEndureDying = function() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_ENDURE_DYING);
    };

    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
    /**
     * HPを増減させ、resultデータに反映させる。
     * 
     * @param {Number} value 増減させる値
     */
    Game_Battler.prototype.gainHp = function(value) {
        if ((value < 0) && this.isEndureDying() && (this.hp > 1)) {
            value = 1 - this.hp;
        }
        _Game_Battler_gainHp.call(this, value);
    };


})();