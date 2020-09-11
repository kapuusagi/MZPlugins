/*:ja
 * @target MZ 
 * @plugindesc クリティカルダメージ倍率の特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * 
 * @param TraitId
 * @text 特性ID
 * @desc 特性として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 10
 * @type number
 * @max 999
 * @min 10
 * 
 * @param BasicRate
 * @text クリティカル時のダメージ倍率基本値。
 * @desc クリティカルダメージ計算時に使用される倍率です。
 * @type number
 * @decimals 2
 * 
 * @help 
 * クリティカルダメージ倍率増減の特性を追加します。
 * クリティカルダメージ計算が次の式で行われます。
 *   (クリティカルダメージ) = (ダメージ) × {(BasicRate) + (特性による加減量)}
 * 但し、基本ダメージを下回ることはありません。
 * 
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
 * Version.0.1.0 TWLDで実装したのを移植。未確認。
 */
(() => {
    const pluginName = "Kapu_Trait_CriticalDamageRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_XPARAM_DID_CDR = Number(parameters['TraitId']) || 0;
    const basicCriticalRate = Number(parameters['BasicRate']) || 0;

    //------------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    /**
     * Scene_Bootを開始する。
     */
    Scene_Boot.prototype.start = function () {
        DataManager.processCriticalDamageRateTrait();
        _Scene_Boot_start.call(this);
    };

    //------------------------------------------------------------------------------
    // DataManager
    DataManager.processCriticalDamageRateTrait = function() {
        DataManager.processCriticalDamageRateTraitNotetag($dataActors);
        DataManager.processCriticalDamageRateTraitNotetag($dataClasses);
        DataManager.processCriticalDamageRateTraitNotetag($dataWeapons);
        DataManager.processCriticalDamageRateTraitNotetag($dataArmors);
        DataManager.processCriticalDamageRateTraitNotetag($dataStates);
        DataManager.processCriticalDamageRateTraitNotetag($dataEnemies);
    };

    /**
     * クリティカルレートのノートタグを処理する。
     * @param {Array<Object>} dataArray データコレクション
     */
    DataManager.processCriticalDamageRateTraitNotetag = function(dataArray) {
        for (let obj of dataArray) {
            if (!obj || !obj.meta.criticalDamageRate) {
                continue;
            }
            DataManager.addCriticalDamageRateTrait(obj, obj.meta.criticalDamageRate);
        }
    };
    /**
     * itemの特性にvalueStrのクリティカルダメージ加算する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     * @param {String} valueStr 効果値
     */
    DataManager.addCriticalDamageRateTrait = function(obj, valueStr) {
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
     * !!!overwrite!!!
     * 
     * @param {Number} damage ダメージ
     * @return {Number} クリティカル適用後のダメージ
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
        return (rate > 1) ? Math.round(damage.rate) : damage;
    };



})();