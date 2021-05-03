/*:ja
 * @target MZ 
 * @plugindesc 戦闘開始時TPチャージ特性プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param traitXParamDid
 * @text TPチャージ特性特性ID
 * @desc TPチャージ特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 208
 * @type number
 * @max 999
 * @min 10
 * 
 * @param textTraitInitTpRate
 * @text 戦闘開始時TPチャージレート特性名
 * @desc 戦闘開始時TPチャージレート特性名
 * @type string
 * @default 戦闘開始時TP率
 * 
 * @help 
 * 戦闘開始時に所定の割合だけTPがチャージされた状態にするプラグイン。
 * チャージされる量は、ステートなどに設定した値の合計になります。
 * 
 * 複数特性を持っている場合、加算合計になります。
 * 
 * ■ 使用時の注意
 * 他のTP初期化系プラグインがあると正しく動作しない可能性があります。
 * 
 * ■ プラグイン開発者向け
 * Trait XPARAMを使用し、
 * Game_BattlerBase.TRAIT_XPARAM_DID_INITTP_RATE を追加します。
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
 *     <initTpRate:rate>
 *        rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *     <initTpRate:rateStr%>
 *        rateStr: 倍率の値。100で100%増加。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成した。
 */
(() => {
    const pluginName = "Kapu_Trait_InitialTpCharge";
    const parameters = PluginManager.parameters(pluginName);
    Game_BattlerBase.TRAIT_XPARAM_DID_INITTP_RATE = Number(parameters["traitXParamDid"]) || 0;
    if (!Game_BattlerBase.TRAIT_XPARAM_DID_INITTP_RATE) {
        console.error(pluginName + ":TRAIT_XPARAM_DID_INITTP_RATE is not valid.");
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
        if (!obj.meta.initTpRate) {
            return;
        }
        const valueStr = obj.meta.initTpRate;
        let rate;
        if (valueStr.slice(-1) === "%") {
            rate = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            rate = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_XPARAM, 
            dataId:Game_BattlerBase.TRAIT_XPARAM_DID_INITTP_RATE, 
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
    // TextManager
    if (TextManager._xparam) {
        TextManager._xparam[Game_BattlerBase.TRAIT_XPARAM_DID_INITTP_RATE] = parameters["textTraitInitTpRate"] || "";
    }
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
        const initialTp = this.initialTp();
        if (this.tp < initialTp) {
            this.setTp(initialTp);
        }
    };

    /**
     * 戦闘開始時初期TP値を得る。
     * 
     * @return {Number} 初期TP値。
     */
    Game_Battler.prototype.initialTp = function() {
        const rate = this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_INITTP_RATE).clamp(0, 1);
        return Math.floor(this.maxTp() * rate);
    };

})();