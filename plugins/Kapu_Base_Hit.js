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
 * Game_Action.itemCorrectSuccessRateを追加。
 * 複数の使用効果で乱数が関係する場合に、成功率補正を入れるためのメソッドを追加。
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

    /**
     * スキル/アイテム使用時の成功率補正値を得る。
     * 
     * @param {Game_Battler} target 対象
     * @returns {number} 補正値
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.itemCorrectSuccessRate = function(target) {
        return 1;
    };

    /**
     * 単一効果付与の処理を行う。
     * 
     * (効果のvalue1) × (対象の付与率) × LUKによる率) > 乱数(0.0～1.0)
     * 
     * が成立したとき、dataIdで指定されるステートが付与される。
     * 但し、ターゲットがそのステートを防止する能力を持っていた場合、ステートは付与されない点に注意。
     * 
     * 
     * @param {Game_BattlerBase} target 使用対象
     * @param {DataEffect} effect エフェクトデータ
     * !!!overwrite!!! Game_Action.itemEffectAddNormalState
     *     複数プラグインからフックし安いようにするため、オーバーライドする。
     */
    Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
        const successRate = this.stateAddSuccessRateNormal(target, effect.dataId, effect.value1);
        if (Math.random() < successRate) {
            target.addState(effect.dataId);
            this.makeSuccess(target);
        }
    };

    /**
     * ステート付与レートを得る。
     * 
     * @param {Game_Battler} target 対象
     * @param {number} stateId ステートID
     * @param {number} baseRate ベースレート
     * @returns {number} ステート付与レート
     */
    Game_Action.prototype.stateAddSuccessRateNormal = function(target, stateId, baseRate) {
        let rate = baseRate;
        if (!this.isCertainHit(target)) {
            rate *= target.stateRate(stateId);
            rate *= this.lukEffectRate(target);
        }
        rate *= this.itemCorrectSuccessRate(target);
        return rate;
    };

    /**
     * ステートを解除する処理を行う。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Effect} effect エフェクトデータ
     * !!!overwrite!!! Game_Action.itemEffectRemoveState()
     *     複数プラグインからフックし安いようにするため、オーバーライドする。
     */
    Game_Action.prototype.itemEffectRemoveState = function(target, effect) {
        const successRate = this.stateRemoveSuccessRate(target, effect.dataId, effect.value1);
        if (Math.random() < successRate) {
            target.removeState(effect.dataId);
            this.makeSuccess(target);
        }
    };

    /**
     * ステート解除の成功率を得る。
     * 
     * @param {Game_Battler} target 対象
     * @param {number} stateId ステートID
     * @param {number} baseRate ベースレート
     * @returns {number} 成功率
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.stateRemoveSuccessRate = function(target, stateId, baseRate) {
        let rate = baseRate
        rate *= this.itemCorrectSuccessRate(target);
        return rate;
    };

    /**
     * デバフを適用する。
     * 
     * @param {Game_Battler} target 対象
     * @param {Effect} effect エフェクトデータ
     * !!!overwrite!!! Game_Action.itemEffectAddDebuff
     *     複数プラグインからフックし安いようにするため、オーバーライドする。
     */
    Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
        const successRate = this.debuffAddSuccessRate(target, effect.dataId, 1);
        if (Math.random() < successRate) {
            target.addDebuff(effect.dataId, effect.value1);
            this.makeSuccess(target);
        }
    };

    /**
     * デバフ付与成功率を得る。
     * 
     * @param {Game_Battler} target 対象
     * @param {number} paramId パラメータID
     * @param {number} baseRate 基本成功率
     * @returns {number} 成功率
     */
    Game_Action.prototype.debuffAddSuccessRate = function(target, paramId, baseRate) {
        let rate = baseRate;
        rate *= target.debuffRate(paramId);
        rate *= this.lukEffectRate(target);
        rate *= this.itemCorrectSuccessRate(target);
        return rate;
    };

})();
