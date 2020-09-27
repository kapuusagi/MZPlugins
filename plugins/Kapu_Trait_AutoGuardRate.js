/*:ja
 * @target MZ 
 * @plugindesc 確率で自動ガードする特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param TraitXParamDid
 * @text 特性DID
 * @desc 特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 203
 * @type number
 * @max 999
 * @min 10
 * 
 * @help 
 * 敵対者のアクションが行われたとき、指定した確率で自動ガード処理される特性を追加します。
 * 
 * ■ 注意
 * 
 * ■ プラグイン開発者向け
 * Trait XPARAMを使用し、
 * Game_BattlerBase.TRAIT_XPARAM_DID_AUTOGUARD_RATE を追加します。
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
 *     <autoGuardRate:rate>
 *        rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *     <autoGuardRate:rateStr%>
 *        rateStr: 倍率の値。100で100%増加。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 ソースを調査していて思いついたので追加した。動作未確認。
 */
(() => {
    const pluginName = "Kapu_Trait_AutoGuardRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_XPARAM_DID_AUTOGUARD_RATE = Number(parameters["TraitXParamDid"]) || 0;

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * autoGuardRate ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processAutoGuardRateNoteTag = function(obj) {
        if (!obj.meta.autoGuardRate) {
            return;
        }
        const valueStr = obj.meta.autoGuardRate;
        let cdr;
        if (valueStr.slice(-1) === "%") {
            cdr = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            cdr = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_XPARAM, 
            dataId:Game_BattlerBase.TRAIT_XPARAM_DID_AUTOGUARD_RATE, 
            value:cdr
        });
    };

    DataManager.addNotetagParserActors(_processAutoGuardRateNoteTag);
    DataManager.addNotetagParserClasses(_processAutoGuardRateNoteTag);
    DataManager.addNotetagParserWeapons(_processAutoGuardRateNoteTag);
    DataManager.addNotetagParserArmors(_processAutoGuardRateNoteTag);
    DataManager.addNotetagParserStates(_processAutoGuardRateNoteTag);
    DataManager.addNotetagParserEnemies(_processAutoGuardRateNoteTag);

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    const _Game_BattlerBase_isGuard = Game_BattlerBase.prototype.isGuard;

    /**
     * 防御かどうかを得る。
     * 
     * @return {Boolean} 防御している場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isGuard = function() {
        const guard = _Game_BattlerBase_isGuard.call(this);
        if (guard) {
            return guard; // 防御指定されている。
        } else {
            const rate = this.xparam(Game_battlerBase.TRAIT_XPARAM_DID_AUTOGUARD_RATE);
            return (rate > 0) ? Math.random() < rate : false;
        }
    };



})();