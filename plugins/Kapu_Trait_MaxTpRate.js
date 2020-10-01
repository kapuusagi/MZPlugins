/*:ja
 * @target MZ 
 * @plugindesc 最大TPレート特性プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param TraitSParamDid
 * @text 最大TPレート特性DiD
 * @desc 最大TPレート特性として割り当てるDID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 100
 * @type number
 * @max 999
 * @min 10
 *  
 * @help 
 * 最大TPレート特性を追加するプラグイン。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * Trait SPARAMを使用し、
 * Game_BattlerBase.TRAIT_SPARAM_DID_MAXTP_RATE を追加します。
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
 *     <maxTpRate:rate>
 *        rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *     <maxTpRate:rateStr%>
 *        rateStr: 倍率の値。100で100%増加。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成した。
 */
(() => {
    const pluginName = "Kapu_Trait_MaxTpRate";
    const parameters = PluginManager.parameters(pluginName);


    Game_BattlerBase.TRAIT_SPARAM_DID_MAXTP_RATE = Number(parameters["TraitSParamDid"]) || 0;
    if (!Game_BattlerBase.TRAIT_SPARAM_DID_MAXTP_RATE) {
        console.error(pluginName + ":TRAIT_SPARAM_DID_MAXTP_RATE is not valid.");
        return;
    }

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * itemの特性にvalueStrの最大TP倍率を加減する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        if (!obj.meta.maxTpRate) {
            return;
        }
        const valueStr = obj.meta.maxTpRate;
        let rate;
        if (valueStr.slice(-1) === "%") {
            rate = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            rate = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_SPARAM, 
            dataId:Game_BattlerBase.TRAIT_SPARAM_DID_MAXTP_RATE, 
            value:rate
        });
    };

    DataManager.addNotetagParserActors(_processNotetag);
    DataManager.addNotetagParserClasses(_processNotetag);
    DataManager.addNotetagParserWeapons(_processNotetag);
    DataManager.addNotetagParserArmors(_processNotetag);
    DataManager.addNotetagParserStates(_processNotetag);
    DataManager.addNotetagParserEnemies(_processNotetag);
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_maxTp = Game_BattlerBase.prototype.maxTp;
    /**
     * 最大TPを得る。
     * @return {Number} TP最大値
     */
    Game_BattlerBase.prototype.maxTp = function() {
        const maxTp = _Game_BattlerBase_maxTp.call(this);
        return Math.floor(maxTp * this.maxTpRate());
    };

    /**
     * 最大TPレートを得る。
     * 
     * @return {Number} 最大TPレート
     */
    Game_BattlerBase.prototype.maxTpRate = function() {
        return this.sparam(Game_BattlerBase.TRAIT_SPARAM_DID_MAXTP_RATE);
    };
})();