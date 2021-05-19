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
 * @arg additionalRewardItems
 * @text 追加の報酬
 * @desc 戦闘勝利時に得られるアイテムとして加算するもの
 * @type struct<ItemEntry>[]
 * @default []
 * 
 * @arg additionalRewardGold
 * @text 追加のゴールド
 * @desc 戦闘勝利時に得られるゴールドに加算する値
 * @type number
 * @default 0
 * 
 * @arg additionalRewardExp
 * @text 追加のEXP
 * @desc 戦闘勝利時に得られるEXPに加算する値
 * @type number
 * @default 0
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
/*~struct~ItemEntry:
 *
 * @param item
 * @text アイテム指定
 * @type item
 * @default 0
 * 
 * @param weapon
 * @text 武器指定
 * @type weapon
 * @default 0
 * 
 * 
 * @param armor
 * @text 防具指定
 * @type armor
 * @default 0
 *
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
        this.clearAdditionalDropItems();
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

    /**
     * 追加のドロップアイテムを登録する。
     * 
     * @param {Object} DataItem/DataWeapon/DataArmo
     */
    Game_Temp.prototype.addAdditionalDropItems = function(item) {
        this._additionalDropItems.push(item);
    };

    /**
     * 追加のドロップアイテムをクリアする。
     */
    Game_Temp.prototype.clearAdditionalDropItems = function() {
        this._additionalDropItems = [];
    };

    /**
     * 追加のドロップアイテムを得る。
     * 
     * @returns {Array<Object>} 追加のドロップアイテム
     */
    Game_Temp.prototype.additionalDropItems = function() {
        return this._additionalDropItems;
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
    const _BattleManager_endBattle = BattleManager.endBattle;
    /**
     * 戦闘を終了させる。
     * 本メソッドを呼ぶと、フェーズが"battleEnd"に遷移し、次のupdate()でSceneManager.pop()がコールされる。
     * 
     * @param {Number} result 戦闘結果(0:勝利 , 1:中断(逃走を含む), 2:敗北)
     */
    BattleManager.endBattle = function(result) {
        $gameTemp.clearAdditionalDropItems();
        _BattleManager_endBattle.call(this, result);
    };
    //------------------------------------------------------------------------------
    // Game_Troop
    const _Game_Troop_makeDropItems = Game_Troop.prototype.makeDropItems;
    /**
     * ドロップアイテムを作成する。
     * 
     * Note: 本メソッド呼び出しにより、乱数評価が行われる。
     * Note: 逃走したエネミーはdeadしていないので計上されない。
     * 
     * @returns {Array<object>} DataItem/DataWeapon/DataArmorの配列。
     */
    Game_Troop.prototype.makeDropItems = function() {
        const items = _Game_Troop_makeDropItems.call(this);
        return items.concat($gameTemp.additionalDropItems());
    };
})();
