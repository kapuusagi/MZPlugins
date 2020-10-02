/*:ja
 * @target MZ 
 * @plugindesc 命中判定拡張用ベースプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @help 
 * コアプラグインの命中判定処理を複数のプラグインで
 * 拡張できるようにするためのプラグインです。
 * 
 * ■ 使用時の注意
 * Game_Action.applyを overwrite するメソッドとは競合します。
 * 
 * ■ プラグイン開発者向け
 * Game_Action.isCertainlyHit() が追加されます。
 * itemHit, itemEvaのメソッドは変わりません。
 * (命中率/回避率に補正を入れる系統のプラグインはそのままいけます)
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
 * Version.0.1.0 Trait_Certianly_HitEvaとTwld_Baseを実現するために作成。
 */
(() => {
    const pluginName = "Kapu_Base_Hit";

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * このアクションをtargetに適用する。
     * 命中判定とダメージ算出、効果適用を行う。
     * 
     * @param {Game_BattlerBase} target 対象
     * !!!overwrite!!!
     */
    Game_Action.prototype.apply = function(target) {
        const result = target.result();
        this.subject().clearResult();
        result.clear();
        result.used = this.testApply(target);
        if (result.used) {
            this.testHit(target);
        } else {
            result.missed = false;
            result.evaded = true;
        }
        result.physical = this.isPhysical();
        result.drain = this.isDrain();
        if (result.isHit()) {
            result.critical = this.testCritical(target);
            if (this.item().damage.type > 0) {
                const value = this.makeDamageValue(target, result.critical);
                this.executeDamage(target, value);
            }
            for (const effect of this.item().effects) {
                this.applyItemEffect(target, effect);
            }
            this.applyItemUserEffect(target);
        }
        this.updateLastTarget(target);
    };
    /**
     * クリティカルヒットしたかどうかを取得する。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} クリティカルヒットする場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testCritical = function(target) {
        if (this.item().damage.type > 0) {
            return Math.random() < this.itemCri(target);
        } else {
            return false;
        }
    };
    /**
     * 確実にヒットできるかどうかを取得する。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} 確実にヒットする場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.isCertainlyHit = function(target) {
        return false;
    };

    /**
     * 確実に回避できるかどうかを取得する。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} 確実に回避する場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.isCertainlyEvad = function(target) {
        return false;
    };

    /**
     * 命中できたかどうかを評価する。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} 命中できた場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testHit = function(target) {
        const result = target.result();
        if (this.isCertainlyEvad(target)) {
            result.missed = false;
            result.evaded = true;
        } else if (this.isCertainlyHit(target)) {
            result.missed = false;
            result.evaded = false;
        } else if (this.testMissed(target)) {
            result.missed = true;
            result.evaded = false;
        } else if (this.testEvaded(target)) {
            result.missed = false;
            result.evaded = true;
        } else {
            result.missed = false;
            result.evaded = false;
        }
    };

    /**
     * ミスしたかどうかを評価する。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} ミスした場合にtrue, それ以外はfalse
     */
    Game_Action.prototype.testMissed = function(target) {
        const missRate = 1 - this.itemHit(target);
        return Math.random() < missRate;
    };

    /**
     * 回避したかどうかを評価する。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {Boolean} 回避できた場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testEvaded = function(target) {
        return Math.random() < this.itemEva(target);
    };

})();