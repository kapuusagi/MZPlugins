/*:ja
 * @target MZ 
 * @plugindesc クリティカルダメージ倍率の特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param TraitXParamDid
 * @text 特性DID
 * @desc 特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 200
 * @type number
 * @max 999
 * @min 10
 * 
 * @param BasicRate
 * @text ダメージ倍率基本値。
 * @desc クリティカルダメージ計算時に使用される倍率です。
 * @type number
 * @default 3
 * @min 1.00
 * @decimals 2
 * 
 * @help 
 * クリティカルダメージ倍率増減の特性を追加します。
 * クリティカルダメージ計算が次の式で行われます。
 *   (クリティカルダメージ) = (ダメージ) × {(BasicRate) + (特性による加減量)}
 * 但し、基本ダメージを下回ることはありません。
 * 
 * ■ 注意
 * applyCriticalをオーバーライドするため、
 * 他のプラグインでのクリティカル計算式を変更している場合には、
 * 競合に注意する必要があります。
 * 
 * ■ プラグイン開発者向け
 * Trait XPARAMを使用し、
 * Game_BattlerBase.TRAIT_XPARAM_DID_CDR を追加します。
 * 値はプラグインパラメータで指定したものになります。
 * 
 * その他の要素でクリティカルダメージ倍率を加算したい場合には、
 * Game_BattlerBase.prototype.getPhysicalCriticalRate
 * Game_BattlerBase.prototype.getMagicalCriticalRate
 * をフックして倍率に加算すれば変更できます。
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
 *     <criticalDamageRate:rate>
 *        rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *     <criticalDamageRate:rateStr%>
 *        rateStr: 倍率の値。100で100%増加。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.1 デフォルト値を変更した。
 *               プラグインコメントにorderAfterを追加した。
 * Version.0.2.0 ノートタグの処理をKapu_Utilityのコールバックでやるように変更した。
 * Version.0.1.0 TWLDで実装したのを移植。
 */
(() => {
    const pluginName = "Kapu_Trait_CriticalDamageRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_XPARAM_DID_CDR = Number(parameters["TraitXParamDid"]) || 0;
    const basicCriticalRate = Number(parameters["BasicRate"]) || 0;

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * criticalDamageRate ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processCriticalDamageRateNoteTag = function(obj) {
        if (!obj.meta.criticalDamageRate) {
            return;
        }
        const valueStr = obj.meta.criticalDamageRate;
        let cdr;
        if (valueStr.slice(-1) === "%") {
            cdr = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            cdr = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_XPARAM, 
            dataId:Game_BattlerBase.TRAIT_XPARAM_DID_CDR, 
            value:cdr
        });
    };

    DataManager.addNotetagParserActors(_processCriticalDamageRateNoteTag);
    DataManager.addNotetagParserClasses(_processCriticalDamageRateNoteTag);
    DataManager.addNotetagParserWeapons(_processCriticalDamageRateNoteTag);
    DataManager.addNotetagParserArmors(_processCriticalDamageRateNoteTag);
    DataManager.addNotetagParserStates(_processCriticalDamageRateNoteTag);
    DataManager.addNotetagParserEnemies(_processCriticalDamageRateNoteTag);

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    Object.defineProperties(Game_BattlerBase.prototype, {
        /**
         * 物理クリティカルダメージレート(PhysicalCriticalDamageRate)
         * @const {Number}
         */
        pcdr: {
            /** @return {Number} */
            get: function() {
                return this.getPhysicalCriticalRate();
            },
            configurable: true
        },
        /**
         * 魔法クリティカルダメージレート(MagicalCriticalDamageRate)
         * @const {Number} 
         */
        mcdr: {
            /** @return {Number} */
            get: function() {
                return this.getMagicalCriticalRate();
            },
            configurable: true
        },
    });

    /**
     * 物理攻撃のクリティカル倍率を取得する。
     * @return {Number} クリティカル倍率。
     */
    Game_BattlerBase.prototype.getPhysicalCriticalRate = function () {
        return basicCriticalRate + this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_CDR);
    };

    /**
     * 魔法攻撃のクリティカル倍率を取得する。
     * @return {Number} クリティカル倍率。
     */
    Game_BattlerBase.prototype.getMagicalCriticalRate = function() {
        return basicCriticalRate + this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_CDR);
    };

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * クリティカルを適用する。
     * 
     * Note: クリティカル時のダメージ倍率計算式を変更するため、オーバーライドする。
     * 
     * @param {Number} damage ダメージ
     * @return {Number} クリティカル適用後のダメージ
     * !!!overwrite!!! Game_Action.applyCritical
     */
    Game_Action.prototype.applyCritical = function(damage) {
        const subject = this.subject();
        let rate;
        if (this.isPhysical()) {
            rate = subject.pcdr;
        } else if (this.isMagical()) {
            rate = subject.mcdr;
        } else {
            rate = basicCriticalRate;
        }
        return (rate > 1) ? Math.round(damage * rate) : damage;
    };



})();