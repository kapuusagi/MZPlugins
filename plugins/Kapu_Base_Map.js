/*:ja
 * @target MZ 
 * @plugindesc マップ関連のベース機能プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @param surpriseRateFast
 * @text 先制攻撃率（早）
 * @desc エネミーよりパーティーの速度が速い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.05
 * @min 0.00
 * @max 1.00
 * 
 * @param surpriseRateLate
 * @text 先制攻撃率（遅）
 * @desc エネミーよりパーティーの速度が遅い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.03
 * @min 0.00
 * @max 1.00
 *  
 * @param preemptiveRateFast
 * @text 先制攻撃率（早）
 * @desc エネミーよりパーティーの速度が速い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.05
 * @min 0.00
 * @max 1.00
 * 
 * @param preemptiveRateLate
 * @text 先制攻撃率（遅）
 * @desc エネミーよりパーティーの速度が遅い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.03
 * @min 0.00
 * @max 1.00
 * 
 * @help 
 * 本プラグイン自体にベーシックシステムからの拡張機能は無い。
 * 他のプラグインと競合を避けるために提供されます。
 * 
 * ■ 使用時の注意
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
    const pluginName = "Kapu_Base_Map";
    const parameters = PluginManager.parameters(pluginName);
    const surpriseRateLate = Math.min(1, Math.max(0, (Number(parameters["surpriseRateLate"]) || 0.05)));
    const surpriseRateFast = Math.min(surpriseRateLate, Math.max(0, (Number(parameters["surpriseRateFast"]) || 0.03)));
    const preemptiveRateFast = Math.min(1, Math.max(0, (Number(parameters["preemptiveRateFast"]) || 0.05)));
    const preemptiveRateLate = Math.min(preemptiveRateFast, Math.max(0, (Number(parameters["preemptiveRateLate"]) || 0.03)));

    //------------------------------------------------------------------------------
    // Game_Map
    /**
     * マップの基本不意打ち率を得る。
     * 
     * @returns {number} 不意打ち率
     */
    Game_Map.prototype.rateSurprise = function() {
        return 0;
    };
    /**
     * マップの基本先制率を得る。
     * 
     * @returns {number} 先制率
     */
    Game_Map.prototype.ratePreemptive = function() {
        return 0;
    };
    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * このパーティーの不意打ち率を得る。
     * 
     * @param {number} troopAgi 不意打ち率
     * @returns {number} 不意打ち率
     * !!!overwrite!!! Game_Party.rateSurprise
     */
    Game_Party.prototype.rateSurprise = function(troopAgi) {
        let rate = 0;
        if (!this.hasCancelSurprise()) {
            rate = this.agility() >= troopAgi ? surpriseRateFast : surpriseRateLate;
            rate += $gameMap.rateSurprise();
            rate += this.rateSurpriseOfParty();
        }
        return rate;
    };

    /**
     * パーティー特製による不意打ち率補正値を得る。
     * 
     * @returns {number} 不意打ち率補正値
     */
    Game_Party.prototype.rateSurpriseOfParty = function() {
        return 0;
    };

    /**
     * このパーティーの先制攻撃率を得る。
     * 
     * @param {number} troopAgi 的グループのAGI
     * @returns {number} 先制攻撃率
     * !!!overwrite!!! Game_Party.ratePreemptive
     */
    Game_Party.prototype.ratePreemptive = function(troopAgi) {
        let rate = this.agility() >= troopAgi ? preemptiveRateFast : preemptiveRateLate;
        rate += $gameMap.ratePreemptive();
        rate += this.ratePreemptiveOfParty();
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    };

    /**
     * パーティーの先制攻撃率補正値を得る。
     * 
     * @returns {number} 先制攻撃率補正値
     */
    Game_Party.prototype.ratePreemptiveOfParty = function() {
        return 0;
    };
})();