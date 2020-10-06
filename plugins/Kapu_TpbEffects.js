/*:ja
 * @target MZ 
 * @plugindesc TPBに対する効果を追加するためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 
 * @orderAfter 
 * 
 * 
 * @help 
 * 
 * ■ 使用時の注意
 * TPBを操作する系統のプラグインと合体させると競合します。
 * 同じようなことは考えてるはず。
 * 
 * 
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_TpbEffect";
    const parameters = PluginManager.parameters(pluginName);



    //------------------------------------------------------------------------------
    // Game_Battler

    /**
     * TPBをvalueだけチャージする。
     * 1.0以上にすると行動が回ってくる。
     * チャージ中（キャストなどでない）場合にしか効果無い。
     * 
     * @param {Number} value 値
     */
    Game_Battler.prototype.gainTpbChargeTime = function(value) {
        if (this.canMove() && this.isAlive() && (this._tpbState === "charging")) {
            this._tpbChargeTime += value;
        }
    };
    
    /**
     * キャストタイムをvalueだけチャージする。
     * 
     * @param {Number} value チャージ時間。
     */
    Game_Battler.prototype.gainTpbCastTime = function(value) {
        if (this._tpbState === "casting") {
            this._tpbCastTime += value;
        }
    };

    /**
     * キャストタイムをチャージし、スキル発動可能状態にする。
     * Note:チャージするだけ。updateTpbにてチャージ完了になる。
     */
    Game_Battler.prototype.chageTpbCastTime = function() {
        if (this._tpbState === "casting") {
            this._tpbCastTime = this.tpbRequiredCastTime()
        }
    };

    /**
     * キャストをキャンセルする。
     * 妨害スキル等の効果用。
     */
    Game_Battler.prototype.cancelTpbCast = function() {
        if (this._tpbState === "casting") {
            this._tpbCastTime = 0;
            this._tpbState = "charging";
        }
    };


})();