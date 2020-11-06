/*:ja
 * @target MZ 
 * @plugindesc 最大TP加算特性プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * 
 * @param traitCode
 * @text 最大TP加算特性コードID
 * @desc 最大TP加算特性として割り当てるコード。(10以上で他のプラグインとぶつからないやつ)
 * @default 108
 * @type number
 * @max 999
 * @min 10
 *  
 * @help 
 * 最大TP加算特性を追加するプラグイン。
 * 複数特性を持つ場合、乗算合計になります。
 * 
 * ■ 使用時の注意
 * 加算合計じゃないので注意。
 * 
 * ■ プラグイン開発者向け
 * Trait SPARAMを使用し、
 * Game_BattlerBase.TRAIT_MAXTP_ADD を追加します。
 * 値はプラグインパラメータで指定したものになります。
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
 *     <maxTpAdd:value>
 *        value: 加算/減算値。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成した。
 */
(() => {
    const pluginName = "Kapu_Trait_MaxTpAdd";
    const parameters = PluginManager.parameters(pluginName);


    Game_BattlerBase.TRAIT_MAXTP_ADD = Number(parameters["traitCode"]) || 0;
    if (!Game_BattlerBase.TRAIT_MAXTP_ADD) {
        console.error(pluginName + ":TRAIT_MAXTP_ADD is not valid.");
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
        if (obj.meta.maxTpAdd) {
            const value = Math.floor((Number(obj.meta.maxTpAdd) || 0));
            if (value !== 0) {
                obj.traits.push({ 
                    code:Game_BattlerBase.TRAIT_MAXTP_ADD, 
                    dataId:0, 
                    value:value
                });
            }
            return;
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
    const _Game_BattlerBase_maxTpAdd = Game_BattlerBase.prototype.maxTpAdd;
    /**
     * 最大TP加算値を得る。
     * 
     * @return {Number} 最大TP加算値
     */
    Game_BattlerBase.prototype.maxTpAdd = function() {
        const maxTpAdd = _Game_BattlerBase_maxTpAdd.call(this);
        return maxTpAdd + this.traitsSumAll(Game_BattlerBase.TRAIT_MAXTP_ADD);
    };
})();