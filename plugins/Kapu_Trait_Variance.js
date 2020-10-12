/*:ja
 * @target MZ 
 * @plugindesc ばらつき制約特性プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param traitSParamDid
 * @text 特性コード値
 * @desc ばらつき特性コードに割り当てるデータID
 * @type number
 * @default 103
 * 
 * @param enableProperty
 * @text プロパティ定義
 * @desc trueにすると、プロパティ値としてvarirateが追加されます。
 * @type boolean
 * @default false
 * 
 * @help 
 * ばらつき制約特性を提供するプラグイン。
 * デフォルトの特性に加え、使用者の本特性分だけばらつきに制約を持たせます。
 * この特性の値が高いと、オリジナルのばらつきに対して結果が大きくなります。
 * 一方、特性の値が低いと、オリジナルのばらつきに対して結果が小さくなります。
 * 例）ダメージ100で標準ばらつき20の場合
 *    ばらつき特性=1.0(等倍) -> 80～120
 *    ばらつき特性=2.0(2倍)  -> 40～120
 *    ばらつき特性=0(ばらつきなし) -> 120
 * 
 * えこのエクヴィリーで思い出したんだあ。
 * 
 * ■ 使用時の注意
 * 0％で最大効果が出るように、ばらつきに関する結果が一部変わります。
 * 
 * Game_Action.applyVariance()をオーバーライドします。
 * ばらつきに関するプラグインと競合する可能性があります。
 * 
 * ■ プラグイン開発者向け
 * パラメータSPARAMを使用し、 Game_BattlerBase.TRAIT_SPARAM_DID_VARIANCE_RATE が追加されます。
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
 *     <varianceRate:rate>
 *        rate: 倍率の値。1.0で変動なし。0でばらつきゼロ。2.0でばらつき2倍。
 *     <varianceRate:rateStr%>
 *        rateStr: 倍率の値。100で変動なし。0でばらつきゼロ、200でばらつき2倍。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 追加した。
 */
(() => {
    const pluginName = "Kapu_Trait_Variance";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_SPARAM_DID_VARIANCE_RATE = Number(parameters["traitSParamDid"]) || 0;
    const enableProperty = (typeof parameters["enableProperty"] === "undefined")
            ? false : (parameters["enableProperty"] === "true");

    if (!Game_BattlerBase.TRAIT_SPARAM_DID_VARIANCE_RATE) {
        console.error(pluginName + ":TRAIT_SPARAM_DID_VARIANCE_RATE is not valid.");
        return ;
    }

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * ノートタグを処理する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        if (!obj.meta.varianceRate) {
            return;
        }
        const valueStr = obj.meta.varianceRate;
        let rate;
        if (valueStr.slice(-1) === "%") {
            rate = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            rate = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_SPARAM, 
            dataId:Game_BattlerBase.TRAIT_SPARAM_DID_VARIANCE_RATE, 
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

    /**
     * 変動レートを得る。
     * 
     * @return {Number} 変動レート。
     */
    Game_BattlerBase.prototype.varianceRate = function() {
        return this.sparam(Game_BattlerBase.TRAIT_SPARAM_DID_VARIANCE_RATE);
    };

    if (enableProperty) {
        /**
         * ばらつきレート
         * 
         * @const {Number}
         */
        Object.defineProperty(Game_BattlerBase.prototype, "varirate", {
            /** @return {Number} */
            get: function() { return this.varianceRate(); },
            configurable:true
        });
    }

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * ばらつきを適用する。
     * 
     * @param {Number} damage ダメージ値
     * @param {Number} variance ばらつき(1で1％ばらつく)
     * @return {Number} ばらつき適用後のダメージ
     * !!!overwrite!!! Game_Action.applyVariance()
     */
    Game_Action.prototype.applyVariance = function(damage, variance) {
        // ampがばらつき最大値
        const subject = this.subject();
        const amp = Math.floor(Math.max((Math.abs(damage) * variance) / 100, 0));
        const v = Math.randomInt(amp * 2 + 1) * subject.varianceRate();
        if (damage >= 0) {
            return Math.max(damage + amp - v, 0);
        } else {
            return Math.min(damage - amp + v, 0);
        }
    };

})();