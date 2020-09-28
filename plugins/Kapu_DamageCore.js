/*:ja
 * @target MZ 
 * @plugindesc ダメージ計算処理を拡張するためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * ダメージ計算処理を拡張するためのプラグイン。
 * ベーシックシステムのメソッドでは、
 * Game_Action.makeDamage()を書き換えなければ実現できない、
 * 2つ以上のプラグインは競合して導入できない。
 * 例） 「使用者によってPDR(物理ダメージレート)を軽減するプラグイン」 と
 *      「回復量に使用者の回復レートを適用するプラグイン」は
 *       いずれもmakeDamageValueを書き換えないといけないので競合する。
 * この問題を解決するため、Game_Action.makeDamage()を分割するプラグインを用意した。
 * 
 * とは言っても、ダメージ計算式はゲームバランスを司るファクターなので、
 * ホントはデザイナーがちゃんと考えないと行けないはず。
 * それぞれのプラグインでホイホイ倍率上げてったらえらいことになる。
 * 
 * 
 * ■ 使用時の注意
 * Game_Action.makeDamgeをオーバーライドするので、
 * 他のダメージ追加系プラグインでオーバーレイドしていた場合には無効です。
 * コアスクリプトがこの辺考慮してくれたら楽だったんだけど。
 * あちこちのプラグインを組み合わせて作ろうとすると、
 * コアプラグインの競合で実現できなかったりとかねぇ...。
 * 
 * ■ プラグイン開発者向け
 * Game_Action.applyDamageRate(value:number, target:Game_Battler) : number
 *     ダメージ倍率の処理を行う。
 *     プラグインで定義されたTraitで、
 *     ダメージ倍率に変更を与えたい場合にフックすることを想定します。
 * Game_Action.multiplyDamageRate(target) : number
 *     何かしらのダメージ倍率を乗算するためのフック用メソッド。
 *     例えばウェポンマスタリーによるダメージボーナスがあったとき、
 *     calcElementRateをフックするのはメソッドの意味合いが変わるので
 *     あんまりよろしくないのだ。
 * Game_Action.itemPdr(target:Game_Battler) : number
 *     物理ダメージレートを返す。
 *     プラグインで定義されたTraitで、
 *     物理ダメージレートを増減させたい場合にフックすることを想定します。
 * Game_Action.itemMdr(target:Game_Batter) : number
 *     魔法ダメージレートを返す。
 *     プラグインで定義されたTraitで、
 *     魔法ダメージレートを増減させたい場合にフックすることを想定します。
 * Game_Action.itemRec(target:Game_Battler) : number
 *     リカバリレートを返す。
 *     プラグインで定義されたTraitで、
 *     リカバリーレートを増減させたい場合にフックすることを想定します。
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
 * Version.0.1.0 ダメージ計算式に関する拡張をするため、コアプラグインを用意した。
 *               コアプラグインは競合しやすいので、あんまりやりたくないけど..。
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
        value = this.applyDamageRate(value, target);
        value = this.applyRecoveryRate(value, target);
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
    Game_Action.prototype.applyDamageRate = function(value, target) {
        if (this.isPhysical()) {
            value *= this.itemPdr(target);
        }
        if (this.isMagical()) {
            value *= this.itemMdr(target);
        }
        return value * this.multiplyDamageRate();
    };

    /**
     * ダメージ量の乗算ボーナスレートを得る。
     * (加算・乗算用)
     * 
     * @return {Number} 乗算ボーナスレート
     */
    Game_Action.prototype.multiplyDamageRate = function() {
        return 1.0;
    };

    /**
     * リカバリレートによる効果を適用する。
     * 
     * @param {Number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @return {Number} 乗算ボーナス適用後の値。
     */
    Game_Action.prototype.applyRecoveryRate = function(value, target) {
        if (value < 0) {
            return value * this.itemRec(target)
        } else {
            return value;
        }
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