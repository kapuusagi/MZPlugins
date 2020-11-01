/*:ja
 * @target MZ 
 * @plugindesc TPB基本拡張プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * TPB周りの計算式を異なるプラグインで拡張させるためのベースプラグイン。
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * 特になし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_Base_Tpb";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * スキルのキャスト時間を得る。
     * 
     * @param {Object} item スキル/アイテム
     * @return {Number} キャスト時間
     */
    Game_BattlerBase.prototype.tpbSkillCastTime = function(item) {
        return Math.max(0, -item.speed);
    };

    //------------------------------------------------------------------------------
    // Game_Battler

    /**
     * 速度からTPB速度を得る。
     * 
     * @param {Number} value 値
     * @return {Number} TPB速度。
     */
    Game_Battler.prototype.calcTpbSpeed = function(value) {
        return Math.sqrt(value) + 1;
    };

    /**
     * アクションの発動に必要な時間を得る。
     * 
     * @param {Number} delay ディレイ
     * @return {Number} 必要な時間
     */
    Game_Battler.prototype.calcCastTime = function(delay) {
        return this.calcTpbSpeed(delay) / this.tpbSpeed();
    };
    /**
     * TPB速度計算に使用する基準値を得る。
     * 
     * @return {Number} 基準値
     */
    Game_Battler.prototype.tpbSpeedParam = function() {
        return this.agi;
    };
    /**
     * TPB基準速度の計算に使用するパラメータ値を得る。
     * 
     * @return {Number} TPB基準速度の計算に使用するパラメータ。
     */
    Game_Battler.prototype.tpbBaseSpeedParam = function() {
        return this.paramBasePlus(6);
    };

    /**
     * このGame_BattlerのTPB速度を得る。
     * 
     * @return {Number} TPB速度。
     * !!!overwrite!!! Game_Battler.tpbSpeed()
     *     calcTpbSpeedを使用して計算するためにオーバーライドする。
     */
    Game_Battler.prototype.tpbSpeed = function() {
        const paramValue = this.tpbSpeedParam();
        return this.calcTpbSpeed(paramValue);
    };


    /**
     * このGame_BattlerのTPB詠唱速度を得る。
     * 
     * 魔法速度の計算だけ変更したい場合にはオーバーライドする。
     * @return {Number} TPB詠唱速度
     */
    Game_Battler.prototype.tpbCastSpeed = function() {
        return this.tpbSpeed();
    };

    /**
     * このGame_BattlerのTPB基本速度を得る。
     * 
     * @return {Number} TPB速度。
     * !!!overwrite!!! Game_Battler.tpbBasePlus()
     *     calcTpbSpeedを使用して計算するためにオーバーライドする。
     */
    Game_Battler.prototype.tpbBaseSpeed = function() {
        const baseAgility = this.tpbBaseSpeedParam();
        return this.calcTpbSpeed(baseAgility);
    };

    /**
     * キャスト時間を得る。
     * 既定の実装では以下の通り。
     * 1. 有効なアクションのspeed(負数)の合計を算出。
     *    (このとき、加算する方向のspeedは無視される)
     * 2. Sqrt(1の結果) / TPB速度を算出して返す。
     * 
     * @return {Number} キャスト時間。
     * !!!overwrite!!! Game_Battler.tpbRequiredCastTime()
     *     calcTpbSpeedを使用して計算するためにオーバーライドする。
     */
    Game_Battler.prototype.tpbRequiredCastTime = function() {
        const actions = this._actions.filter(action => action.isValid());
        const items = actions.map(action => action.item());
        let delay = 0;
        for (const item of items) {
            if (DataManager.isSkill(item)) {
                delay += this.tpbSkillCastTime(item);
            } else {
                delay += Math.max(0, -item.speed);
            }
        }
        return this.calcCastTime(delay);
    };
    /**
     * TPBキャストタイムを更新する。
     */
    Game_Battler.prototype.updateTpbCastTime = function() {
        if (this._tpbState === "casting") {
            this._tpbCastTime += this.tpbCastAcceleration();
            if (this._tpbCastTime >= this.tpbRequiredCastTime()) {
                this._tpbCastTime = this.tpbRequiredCastTime();
                this._tpbState = "ready";
            }
        }
    };
    /**
     * 詠唱時のTPB加算量を得る。
     * 
     * @return {Number} TPB加算量。
     */
    Game_Battler.prototype.tpbCastAcceleration = function() {
        const speed = this.tpbRelativeCastSpeed();
        const referenceTime = $gameParty.tpbReferenceTime();
        return speed / referenceTime;
    };
    /**
     * TPB相対速度を得る。
     * 
     * @return {Number} TPB相対速度。
     */
    Game_Battler.prototype.tpbRelativeCastSpeed = function() {
        return this.tpbCastSpeed() / $gameParty.tpbBaseSpeed();
    };
})();