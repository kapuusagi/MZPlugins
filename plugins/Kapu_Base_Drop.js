/*:ja
 * @target MZ 
 * @plugindesc ドロップ処理のベースプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * ドロップ処理に関して、複数の拡張をできるようにするためのベースプラグイン。
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
    // const pluginName = "Kapu_Base_Drop";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._dropItems = [];
    };
    /**
     * ドロップアイテムを追加する。
     * 
     * @param {Object} item DataItem/DataWeapon/DataArmor
     */
    Game_Temp.prototype.addDropItem = function(item) {
        this._dropItems.push(item);
    };
    /**
     * ドロップアイテム一覧を得る。
     * 
     * Note: このメソッドが返すインスタンスを操作しても、
     *       戦闘で得られる報酬アイテムには影響しない。
     * 
     * @returns {Array<Object>} ドロップアイテム配列
     */
    Game_Temp.prototype.dropItems = function() {
        return this._dropItems;
    };

    /**
     * ドロップアイテム一覧をクリアする。
     */
    Game_Temp.prototype.clearDropItems = function() {
        this._dropItems = [];
    };

    //------------------------------------------------------------------------------
    // BattleManager

    const _BattleManager_endBattle = BattleManager.endBattle;
    /**
     * 戦闘を終了させる。
     * 本メソッドを呼ぶと、フェーズが"battleEnd"に遷移し、次のupdate()でSceneManager.pop()がコールされる。
     * 
     * @param {Number} result 戦闘結果(0:勝利 , 1:中断(逃走を含む), 2:敗北)
     */
    BattleManager.endBattle = function(result) {
        $gameTemp.clearDropItems();
        _BattleManager_endBattle.call(this, result);
    };
    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * ドロップアイテムの抽選回数を得る。
     * 
     * @returns {Number} 抽選回数
     */
    Game_Party.prototype.dropItemLotteryCount = function() {
        return 1;
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    /**
     * このエネミー討伐時のドロップアイテムを作成する。
     * 
     * @return {Array<Object>} DataItem/DataWeapon/DataArmorの配列。
     * !!!overwrite!!! Game_Enemy.makeDropItems
     */
    Game_Enemy.prototype.makeDropItems = function() {
        const items = [];
        const rate = this.dropItemRate();
        const tryCount = $gameParty.dropTimeLotteryCount();
        const dropItemEntries = this.dropItemEntries();
        for (const dropItemEntry of dropItemEntries) {
            if (this.isDropCondition(dropItemEntry)) {
                for (let i = 0; i < tryCount; i++) {
                    if (this.lotteryDropItem(di, rate)) {
                        const dropItem = this.itemObject(di.kind, di.dataId);
                        $gameTemp.addDropItem(dropItem);
                        items.push(dropItem);
                    }
                }
            }
        }
        return items;
    };

    /**
     * ドロップアイテムエントリを得る。
     * 
     * Note: ベーシックシステムでは以下のフィールドを持ったオブジェクトの配列になる。
     *       dataId : {Number} アイテム/武器/防具のID
     *       denominator : {Number} ドロップ倍率の母数(1/255とかの255に相当)
     *       kind : {Number} ドロップアイテム種類
     * 
     * @returns {Array<Object>} ドロップアイテムエントリ
     */
    Game_Enemy.prototype.dropItemEntries = function() {
        return this.enemy().dropItems
    };

    /**
     * ドロップアイテムエントリがドロップ条件を満たしているかどうかを得る。
     * 
     * @param {Object} dropItemEntry ドロップアイテムエントリ
     * @returns {Boolean} ドロップアイテム条件を満たしている場合にはtrue, それ以外はfalse.
     */
    Game_Enemy.prototype.isDropCondition = function(dropItemEntry) {
        return (dropItemEntry.kind > 0);
    };

    /**
     * ドロップしたかどうかを判定する。
     * 
     * @param {Object} dropItemEntry ドロップアイテムエントリ
     * @param {Number} rate ドロップアイテムレート
     * @returns {Boolean} ドロップした場合にはtrue, それ以外はfalse.
     */
    Game_Enemy.prototype.lotteryDropItem = function(dropItemEntry, rate) {
        return Math.random() * dropItemEntry.denominator < rate;
    };

    /**
     * 追加のドロップアイテムを得る。
     * 
     * @returns {Array<Object>} DataItem/DataWeapon/DataArmor の配列
     */
    Game_Enemy.prototype.additionalDropItems = function() {
        return [];
    };


})();