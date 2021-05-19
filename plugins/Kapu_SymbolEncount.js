/*:ja
 * @target MZ 
 * @plugindesc シンボルエンカウントのためのプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command setupNextBattle
 * @text 次の戦闘の設定
 * @desc 次の戦闘の設定をする。
 * 
 * @arg preemptiveMode
 * @text 戦闘の有利/不利条件設定
 * @desc 戦闘の有利/不利条件を設定する。
 * @type select
 * @option 有利不利なし
 * @value none
 * @option 有利確定
 * @value preemptive
 * @option 不利確定
 * @option surprise
 * @option ランダム
 * @option random
 * 
 * 
 * @help 
 * もっといいプラグインはいっぱいあるのでそちらを使おう！
 * 
 * 提供する機能
 *   ・イベントによる戦闘要求に有利/不利条件を設定する。
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
    const pluginName = "Kapu_SymbolEncount";
    // const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "setupNextBattle", args => {
        const preemptiveMode = (args.preemptiveMode || "none");
        $gameTemp.setNextBattlePreemptiveMode(preemptiveMode);
    });
    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._nextBattlePreemptiveMode = "none";
    };

    /**
     * 次戦闘での有利/不利動作を設定する。
     * 
     * @returns {string}
     */
    Game_Temp.prototype.nextBattlePreemptiveMode = function() {
        return this._nextBattlePreemptiveMode;
    };

    /**
     * 次戦闘に関する設定をクリアする。
     */
    Game_Temp.prototype.clearNextBattleSettings = function() {
        this._nextBattlePreemptiveMode = "none";
    };
    //------------------------------------------------------------------------------
    // BattleManager
    const _BattleManager_initMembers = BattleManager.initMembers;
    /**
     * オブジェクトのメンバーを初期化する。
     */
    BattleManager.initMembers = function() {
        _BattleManager_initMembers.call(this);
        switch ($gameTemp.nextBattlePreemptiveMode()) {
            case "preemptive":
                this._preemptive = true;
                this._surprise = false;
                break;
            case "surprise":
                this._preemptive = false;
                this._surprise = true;
                break;
            case "random":
                this._preemptive = Math.random() < this.ratePreemptive();
                if (!this._preemptive) {
                    this._surprise = Math.random() < this.rateSurprise();
                }
                break;
            default:
                // do nothing.
                break;
        }
        $gameTemp.clearNextBattleSettings();
    };

})();