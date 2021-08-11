/*:ja
 * @target MZ 
 * @plugindesc 命中判定拡張用ベースプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @param debugEnable
 * @text デバッグ有効/無効
 * @desc trueにするとデバッグログを出力する。
 * @type boolean
 * @default false
 * 
 * @help 
 * コアプラグインの命中判定処理を複数のプラグインで
 * 拡張できるようにするためのプラグインです。
 * 
 * ■ 使用時の注意
 * Game_Action.applyを overwrite するメソッドとは競合します。
 * 
 * ■ プラグイン開発者向け
 * Game_Action.testCertainHit() Game_Action.testCertainEva() が追加されます。
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
 * Version.0.2.0 Game_Action.isCertainHitというメソッドが既存にあるため、そちらをうまく使うように変更
 * Version.0.1.0 Trait_Certianly_HitEvaとTwld_Baseを実現するために作成。
 */
(() => {
    const pluginName = "Kapu_Base_Hit";
    const parameters = PluginManager.parameters(pluginName);
    const debugEnable = (typeof parameters["debugEnable"] === "undefined")
            ? false : (parameters["debugEnable"] === "true");

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * このアクションをtargetに適用する。
     * 命中判定とダメージ算出、効果適用を行う。
     * 
     * @param {Game_BattlerBase} target 対象
     * !!!overwrite!!! Game_Action.apply()
     *     ダメージ計算適処理を変更するためオーバーライドする。
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
    if (debugEnable) {
        /**
         * クリティカルヒットしたかどうかを取得する。
         * 
         * @param {Game_Battler} target 対象
         * @returns {boolean} クリティカルヒットする場合にはtrue, それ以外はfalse
         */
        Game_Action.prototype.testCritical = function(target) {
            if (this.item().damage.type > 0) {
                const rate = this.itemCri(target);
                console.log("  criticalRate = " + rate);
                return Math.random() < rate;
            } else {
                return false;
            }
        };
    } else {
        /**
         * クリティカルヒットしたかどうかを取得する。
         * 
         * @param {Game_Battler} target 対象
         * @returns {boolean} クリティカルヒットする場合にはtrue, それ以外はfalse
         */
        Game_Action.prototype.testCritical = function(target) {
            if (this.item().damage.type > 0) {
                return Math.random() < this.itemCri(target);
            } else {
                return false;
            }
        };
    }
    /**
     * 確実にヒットできるかどうかを取得する。
     * 
     * @param {Game_Battler} target 対象
     * @returns {boolean} 確実にヒットする場合にはtrue, それ以外はfalse
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.testCertainHit = function(target) {
        return this.isCertainHit();
    };

    /**
     * 確実に回避できるかどうかを取得する。
     * 
     * @param {Game_Battler} target 対象
     * @returns {boolean} 確実に回避する場合にはtrue, それ以外はfalse
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.testCertainEvad = function(target) {
        return false;
    };

    /**
     * 命中できたかどうかを評価する。
     * 
     * @param {Game_Battler} target 対象
     * @returns {boolean} 命中できた場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testHit = function(target) {
        const result = target.result();
        if (this.testCertainEvad(target)) {
            result.missed = false;
            result.evaded = true;
        } else if (this.testCertainHit(target)) {
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

    if (debugEnable) {
        /**
         * ミスしたかどうかを評価する。
         * 
         * @param {Game_Battler} target 対象
         * @returns {boolean} ミスした場合にtrue, それ以外はfalse
         */
        Game_Action.prototype.testMissed = function(target) {
            const missRate = 1 - this.itemHit(target);
            console.log(" miss rate = " + missRate);
            return Math.random() < missRate;
        };
    } else {
        /**
         * ミスしたかどうかを評価する。
         * 
         * @param {Game_Battler} target 対象
         * @returns {boolean} ミスした場合にtrue, それ以外はfalse
         */
        Game_Action.prototype.testMissed = function(target) {
            const missRate = 1 - this.itemHit(target);
            return Math.random() < missRate;
        };
    }

    if (debugEnable) {
        /**
         * 回避したかどうかを評価する。
         * 
         * @param {Game_Battler} target ターゲット
         * @returns {boolean} 回避できた場合にはtrue, それ以外はfalse
         */
        Game_Action.prototype.testEvaded = function(target) {
            const rate = this.itemEva(target);
            console.log("  evaRate = " + rate);
            return Math.random() < rate;
        };
    } else {
        /**
         * 回避したかどうかを評価する。
         * 
         * @param {Game_Battler} target ターゲット
         * @returns {boolean} 回避できた場合にはtrue, それ以外はfalse
         */
        Game_Action.prototype.testEvaded = function(target) {
            return Math.random() < this.itemEva(target);
        };
    }

})();
