/*:ja
 * @target MZ 
 * @plugindesc TPB速度/キャストタイム/チャージタイムの特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * 
 * @param TpbSpeedTraitId
 * @text TPB速度倍率-特性ID
 * @desc TPB速度倍率の特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 11
 * @type number
 * @max 999
 * @min 10
 * 
 * @param TpbCastSpeedTraitId
 * @text TPBキャスト速度倍率-特性ID
 * @desc TPBキャスト速度倍率の特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 12
 * @type number
 * @max 999
 * @min 10
 * 
 * @param TpbChargeSpeedTraitId
 * @text TPBチャージ速度倍率-特性ID
 * @desc TPBチャージ速度倍率の特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 13
 * @type number
 * @max 999
 * @min 10
 * 
 * 
 * @help 
 * TPB速度増減の特性を追加します。
 * TPB速度計算が次の式で行われます。
 * (TPB速度)=(基本TPB速度)×(1.0 + 特性値合計)
 * 
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
 *     <tpbCastSpeed:rate>
 *        rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *     <tpbCastSpeed:rateStr%>
 *        rateStr: 倍率の値。100で100%増加。
 * 
 *     <tpbChargeSpeed:rate>
 *        rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *     <tpbChargeSpeed:rateStr%>
 *        rateStr: 倍率の値。100で100%増加。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 TWLDでATB向けに実装したのを移植。未確認。
 */
(() => {
    const pluginName = "Kapu_Trait_TpbSpeed";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_XPARAM_DID_TPB_SPEED = Number(parameters['TpbSpeedTraitId']) || 0;
    Game_BattlerBase.TRAIT_XPARAM_DID_TPB_CASTSPEED = Number(parameters['TpbCastSpeedTraitId'] || 0);
    Game_BattlerBase.TRAIT_XPARAM_DID_TPB_CHARGESPEED = Number(parameters['TpbChargeSpeedTraitId']) || 0;

    //------------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    /**
     * Scene_Bootを開始する。
     */
    Scene_Boot.prototype.start = function () {
        DataManager.processTpbSpeedTrait();
        _Scene_Boot_start.call(this);
    };

    //------------------------------------------------------------------------------
    // DataManager
    DataManager.processTpbSpeedTrait = function() {
        DataManager.processTpbSpeedTraitNotetag($dataActors);
        DataManager.processTpbSpeedTraitNotetag($dataClasses);
        DataManager.processTpbSpeedTraitNotetag($dataWeapons);
        DataManager.processTpbSpeedTraitNotetag($dataArmors);
        DataManager.processTpbSpeedTraitNotetag($dataStates);
        DataManager.processTpbSpeedTraitNotetag($dataEnemies);
    };

    /**
     * クリティカルレートのノートタグを処理する。
     * @param {Array<Object>} dataArray データコレクション
     */
    DataManager.processTpbSpeedTraitNotetag = function(dataArray) {
        for (let obj of dataArray) {
            if (!obj) {
                continue;
            }
            if (obj.meta.tpbSpeed) {
                DataManager.addTpbSpeedTrait(obj, obj.meta.tpbSpeed);
            }
            if (obj.meta.tpbCastSpeed) {
                DataManager.addTpbCastSpeedTrait(obj, obj.meta.tpbCastSpeed);
            }
            if (obj.meta.tpbChargeSpeed) {
                DataManager.addTpbCastSpeedTrait(obj, obj.meta.tpbChargeSpeed);
            }
        }
    };
    /**
     * itemの特性にvalueStrのTPB速度倍率を加減する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     * @param {String} valueStr 効果値
     */
    DataManager.addTpbSpeedTrait = function(obj, valueStr) {
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

    /**
     * itemの特性にvalueStrのTPB速度倍率を加減する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     * @param {String} valueStr 効果値
     */
    DataManager.addTpbCastSpeedTrait = function(obj, valueStr) {
        let speed;
        if (valueStr.slice(-1) === "%") {
            speed = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            speed = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_XPARAM, 
            dataId:Game_BattlerBase.TRAIT_XPARAM_DID_TPB_CASTSPEED, 
            value:speed
        });
    };

    /**
     * itemの特性にvalueStrのTPB速度倍率を加減する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     * @param {String} valueStr 効果値
     */
    DataManager.addTpbChargeSpeedTrait = function(obj, valueStr) {
        let speed;
        if (valueStr.slice(-1) === "%") {
            speed = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            speed = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_XPARAM, 
            dataId:Game_BattlerBase.TRAIT_XPARAM_DID_TPB_CHARGESPEED, 
            value:speed
        });
    };

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_Battler_tpbSpeed = Game_Battler.prototype.tpbSpeed;

    /**
     * このGame_BattlerのTPB速度を得る。
     * ベースパラメータからのTPB速度計算式を変更したいならば、本メソッドをオーバーライドする。
     * 
     * @return {Number} TPB速度。
     */
    Game_Battler.prototype.tpbSpeed = function() {
        let speed = _Game_Battler_tpbSpeed.call(this);
        const rate = 1.0 + this.traitsSum(Game_Battler.TRAIT_XPARAM, Game_Battler.TRAIT_XPARAM_DID_TPB_SPEED);
        return speed * Math.max(rate, 0);
    };
    /**
     * TPBチャージ状態を更新する。
     * 
     * !!!overwrite!!!
     */
    Game_Battler.prototype.updateTpbChargeTime = function() {
        if (this._tpbState === "charging") {
            const rate = 1.0
                + this.traitsSum(Game_BattlerBase.TRAIT_XPARAM,
                     Game_BattlerBase.TRAIT_XPARAM_DID_TPB_CHARGESPEED);
            this._tpbChargeTime += (this.tpbAcceleration() * Math.max(rate, 0));
            if (this._tpbChargeTime >= 1) {
                this._tpbChargeTime = 1;
                this.onTpbCharged();
            }
        }
    };

    /**
     * TPBキャストタイムを更新する。
     * 
     * !!!overwrite!!!
     */
    Game_Battler.prototype.updateTpbCastTime = function() {
        if (this._tpbState === "casting") {
            const rate = 1.0
                + this.traitsSum(Game_BattlerBase.TRAIT_XPARAM,
                     Game_BattlerBase.TRAIT_XPARAM_DID_TPB_CASTSPEED);
            this._tpbCastTime += (this.tpbAcceleration() * rate);
            if (this._tpbCastTime >= this.tpbRequiredCastTime()) {
                this._tpbCastTime = this.tpbRequiredCastTime();
                this._tpbState = "ready";
            }
        }
    };
})();