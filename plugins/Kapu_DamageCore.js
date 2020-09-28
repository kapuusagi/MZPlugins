/*:ja
 * @target MZ 
 * @plugindesc ダメージ計算処理を拡張するためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * ダメージ計算処理を拡張するためのプラグイン。
 * ベーシックシステムのメソッドでは、makeDamageを書き換えなければ実現できない
 * 2つ以上のプラグインが競合して導入できない。
 * 例） 「使用者によってPDR(物理ダメージレート)を軽減するプラグイン」 と
 *      「回復量に使用者の回復レートを適用するプラグイン」は
 *       いずれもmakeDamageValueを書き換えないといけないので競合する。
 * 
 * ■ 使用時の注意
 * Game_Action.makeDamgeをオーバーライドするので、
 * 他のダメージ追加系プラグインでオーバーレイドしていた場合には無効です。
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

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * ダメージ値を計算する。
     * 
     * @param {Game_BattlerBase} target 対象
     * @param {Boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} ダメージ値
     */
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        const item = this.item();
        const baseValue = this.evalDamageFormula(target);
        let value = baseValue * this.calcElementRate(target);
        value = this.applyMultiplyDamageRate(value, target);
        if (critical) {
            value = this.applyCritical(value);
        }
        value = this.applyVariance(value, item.damage.variance);
        value = this.applyGuard(value, target);
        value = Math.round(value);
        return value;
    };
    /**
     * 乗算ボーナスを得る。
     * 
     * @param {Number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @return {Number} 乗算ボーナス適用後の値
     */
    Game_Action.prototype.applyMultiplyDamageRate = function(value, target) {
        if (this.isPhysical()) {
            value *= this.itemPdr(target);
        }
        if (this.isMagical()) {
            value *= this.itemMdr(target);
        }
        if (baseValue < 0) {
            value *= this.itemRec(target)
        }
        return value * this.multiplyBonusRate();
    };

    /**
     * ダメージ量の乗算ボーナスレートを得る。
     * 
     * @return {Number} 乗算ボーナスレート
     */
    Game_Action.prototype.multiplyBonusRate = function() {
        return 1.0;
    };

    /**
     * 物理ダメージレートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {Number} 物理ダメージレート
     */
    Game_Action.prototype.itemPdr = function(target) {
        return target.pdr;
    };

    /**
     * 魔法ダメージレートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {Number} 魔法ダメージレート。
     */
    Game_Action.prototype.itemMdr = function(target) {
        return target.mdr;
    };

    /**
     * 回復レートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {Number} 回復レート
     */
    Game_Action.prototype.itemRec = function(target) {
        return target.rec;
    };

})();