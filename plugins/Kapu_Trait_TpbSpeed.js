/*:ja
 * @target MZ 
 * @plugindesc TPB速度/キャストタイム/チャージタイムの特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param traitXParamDid
 * @text TPB速度倍率-特性ID
 * @desc TPB速度倍率の特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 11
 * @type number
 * @max 999
 * @min 10
 * 
 * @help 
 * TPB速度増減の特性を追加します。非TPBでは意味がありません。
 * TPB速度計算が次の式で行われます。
 * (TPB速度)=(基本TPB速度)×(1.0 + 特性値合計)
 * 
 * 複数特性を持つ場合、加算合計になります。
 * 
 * ■ 注意
 * 
 * ■ プラグイン開発者向け
 * Trait XPARAMを使用し、
 * Game_BattlerBase.TRAIT_XPARAM_DID_TPB_SPEED を追加します。
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
 *     <tpbSpeed:rate>
 *        rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *     <tpbSpeed:rateStr%>
 *        rateStr: 倍率の値。100で100%増加。
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.2 ID未指定時に機能を無効化するように変更した。
 * Version.0.1.1 プラグインコメントをorderAfterに変更した。
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_Trait_TpbSpeed";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_XPARAM_DID_TPB_SPEED = Number(parameters["traitXParamDid"]) || 0;
    if (!Game_BattlerBase.TRAIT_XPARAM_DID_TPB_SPEED) {
        console.error(pluginName + ":TRAIT_XPARAM_DID_TPB_SPEED is not valid.");
        return;
    }

    //------------------------------------------------------------------------------
    // DataManager


    /**
     * itemの特性にvalueStrのTPB速度倍率を加減する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        if (!obj.meta.tpbSpeed) {
            return;
        }
        const valueStr = obj.meta.tpbSpeed;
        let speed;
        if (valueStr.slice(-1) === "%") {
            speed = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            speed = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_XPARAM, 
            dataId:Game_BattlerBase.TRAIT_XPARAM_DID_TPB_SPEED, 
            value:speed
        });
    };

    DataManager.addNotetagParserActors(_processNotetag);
    DataManager.addNotetagParserClasses(_processNotetag);
    DataManager.addNotetagParserWeapons(_processNotetag);
    DataManager.addNotetagParserArmors(_processNotetag);
    DataManager.addNotetagParserStates(_processNotetag);
    DataManager.addNotetagParserEnemies(_processNotetag);

    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_tpbSpeed = Game_Battler.prototype.tpbSpeed;

    /**
     * このGame_BattlerのTPB速度を得る。
     * ベースパラメータからのTPB速度計算式を変更したいならば、本メソッドをオーバーライドする。
     * 
     * @return {Number} TPB速度。
     */
    Game_Battler.prototype.tpbSpeed = function() {
        let speed = _Game_Battler_tpbSpeed.call(this);
        const rate = 1.0 + this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_TPB_SPEED);
        return speed * Math.max(rate, 0);
    };

})();