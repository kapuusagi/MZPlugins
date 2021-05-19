/*:ja
 * @target MZ 
 * @plugindesc 最大TP加算特性プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param traitCode
 * @text 最大TP加算特性コードID
 * @desc 最大TP加算特性として割り当てるコード。(10以上で他のプラグインとぶつからないやつ)
 * @default 108
 * @type number
 * @max 999
 * @min 10
 * 
 * @param textTraitMaxTpAddUp
 * @text TP加算特性名
 * @desc TP加算特性名(増加)
 * @type string
 * @default 最大TP上昇
 * 
 * @param textTraitMaxTpAddDown
 * @text TP加算特性名
 * @desc TP加算特性名(減少)
 * @type string
 * @default 最大TP減少
 * 
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
 * Version.0.2.0 Kapu_Base_ParamNameに対応。
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_Trait_MaxTpAdd";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_MAXTP_ADD = Number(parameters["traitCode"]) || 0;
    if (!Game_BattlerBase.TRAIT_MAXTP_ADD) {
        console.error(pluginName + ":TRAIT_MAXTP_ADD is not valid.");
        return;
    }

    const textTraitMaxTpAddUp = parameters["textTraitMaxTpAddUp"] || "";
    const textTraitMaxTpAddDown = parameters["textTraitMaxTpAddDown"] || "";

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
    // TextManager
    /**
     * 最大TP加算特性名
     * 
     * @param {Number} dataId データID
     * @param {Number} value 値
     * @returns {string} 文字列
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitMaxTpAdd = function(dataId, value) {
        return (value >= 0) ? textTraitMaxTpAddUp : textTraitMaxTpAddDown;
    };
    if (TextManager._traitConverters) {
        TextManager._traitConverters[Game_BattlerBase.TRAIT_MAXTP_ADD] = {
            name:TextManager.traitMaxTpAdd, value:TextManager.traitValueSum, str:TextManager.traitValueStrInt, baseValue:0
        };
    }
    
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_maxTpAdd = Game_BattlerBase.prototype.maxTpAdd;
    /**
     * 最大TP加算値を得る。
     * 
     * @returns {Number} 最大TP加算値
     */
    Game_BattlerBase.prototype.maxTpAdd = function() {
        const maxTpAdd = _Game_BattlerBase_maxTpAdd.call(this);
        return maxTpAdd + this.traitsSumAll(Game_BattlerBase.TRAIT_MAXTP_ADD);
    };
})();
