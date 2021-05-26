/*:ja
 * @target MZ 
 * @plugindesc ドロップ処理のベースプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Drop
 * @orderAfter Kapu_Base_Drop
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
        this.clearDropItems();
        this.clearAdditionalRewards();
    };
    /**
     * ドロップアイテム一覧をクリアする。
     */
    Game_Temp.prototype.clearDropItems = function() {
        this._dropItems = [];
    };

    /**
     * ドロップアイテムを追加する。
     * 
     * @param {object} item DataItem/DataWeapon/DataArmor
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
     * 追加のドロップアイテムをクリアする。
     */
    Game_Temp.prototype.clearAdditionalRewards = function() {
        this._additionalGold = 0;
        this._additionalExp = 0;
        this._additionalDropItems = [];
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
     * 追加のドロップアイテムを登録する。
     * 
     * @param {object} 報酬アイテムエントリ(kind, dataId, denominatorを持つオブジェクト)
     */
    Game_Temp.prototype.addAdditionalRewardItems = function(item) {
        this._additionalDropItems.push(item);
    };


    /**
     * 追加のドロップアイテムを得る。
     * 
     * @returns {Array<Object>} 追加のドロップアイテム
     */
    Game_Temp.prototype.additionalRewardItems = function() {
        return this._additionalDropItems;
    };

    /**
     * 報酬ゴールドを増やす。
     * 
     * @param {number} gold ゴールド
     */
    Game_Temp.prototype.addAdditionalRewardGold = function(gold) {
        this._additionalGold = this._additionalGold + (gold || 0);
    };

    /**
     * 追加の報酬金額を得る。
     * 
     * @returns {number} ゴールド
     */
    Game_Temp.prototype.additionalRewardGold = function() {
        return this._additionalGold;
    };

    /**
     * 報酬EXPを増やす。
     * 
     * @param {number} exp EXP
     */
    Game_Temp.prototype.addAdditionalRewardExp = function(exp) {
        this._additionalExp = this._additionalExp + (exp || 0);
    };

    /**
     * 追加の報酬EXPを得る。
     * 
     * @returns {number} EXP
     */
    Game_Temp.prototype.additionalRewardExp = function() {
        return this._additionalExp;
    };


    //------------------------------------------------------------------------------
    // BattleManager

    const _BattleManager_endBattle = BattleManager.endBattle;
    /**
     * 戦闘を終了させる。
     * 本メソッドを呼ぶと、フェーズが"battleEnd"に遷移し、次のupdate()でSceneManager.pop()がコールされる。
     * 
     * @param {number} result 戦闘結果(0:勝利 , 1:中断(逃走を含む), 2:敗北)
     */
    BattleManager.endBattle = function(result) {
        $gameTemp.clearDropItems();
        $gameTemp.clearAdditionalRewards();
        _BattleManager_endBattle.call(this, result);
    };


    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * ドロップアイテムの抽選回数を得る。
     * 
     * @returns {number} 抽選回数
     */
    Game_Party.prototype.dropItemLotteryCount = function() {
        return 1;
    };
    /**
     * ドロップレート補正倍率を得る。
     * @returns {number} ドロップレート補正倍率
     */
    Game_Party.prototype.dropItemRate = function() {
        return this.hasDropItemDouble() ? 2 : 1;
    };
    
    /**
     * 取得金額倍率を得る。
     *  
     * @returns {number} 取得金額倍率
     */
    Game_Party.prototype.dropGoldRate = function() {
        return this.hasGoldDouble() ? 2 : 1;
    };    
    //------------------------------------------------------------------------------
    // Game_Troop
    /**
     * ゴールドレートを得る。
     * 
     * @returns {number} ゴールドレート。
     * !!!overwrite!!! Game_Troop.goldRate
     */
    Game_Troop.prototype.goldRate = function() {
        return $gameParty.dropGoldRate();
    };
    /**
     * ゴールドレートを得る。
     * 
     * @returns {number} ゴールドレート。
     * !!!overwrite!!! Game_Troop.goldRate
     */
    Game_Troop.prototype.goldRate = function() {
        return $gameParty.dropGoldRate();
    };

    /**
     * 経験値の合計を得る。
     * 
     * Note: 逃走したエネミーはdeadしていないので計上されない。
     * 
     * @returns {number} 経験値の合計
     */
    Game_Troop.prototype.expTotal = function() {
        const exp = this.deadMembers().reduce((r, enemy) => r + enemy.exp(), 0) 
                + $gameTemp.additionalRewardExp();
        return Math.max(0, exp);
    };

    /**
     * ゴールドの合計を得る。
     * 
     * Note: 逃走したエネミーはdeadしていないので計上されない。
     * 
     * @returns {number} ゴールド合計
     */
    Game_Troop.prototype.goldTotal = function() {
        const members = this.deadMembers();
        const gold = members.reduce((r, enemy) => r + enemy.gold(), 0) * this.goldRate()
                + $gameTemp.additionalRewardGold();

        if (gold < 0) {
            return Math.max(-$gameParty.gold(), gold);
        } else {
            return gold;
        }
    };

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
        const itemEntries = $gameTemp.additionalRewardItems();
        const tryCount = $gameParty.dropItemLotteryCount();
        if (itemEntries.length > 0) {
            const rate = $gameParty.dropItemRate();
            for (const dropItemEntry of itemEntries) {
                if (this.isDropCondition(dropItemEntry)) {
                    for (let i = 0; i < tryCount; i++) {
                        if (this.lotteryDropItem(dropItemEntry, rate)) {
                            const dropItem = this.itemObject(dropItemEntry.kind, dropItemEntry.dataId);
                            $gameTemp.addDropItem(dropItem);
                            items.push(dropItem);
                        }
                    }
                }
            }
        }
        return items;
    };

    /**
     * ドロップ条件を満たしているかどうかを調べる。
     * 
     * @param {object} dropItemEntry ドロップアイテムエントリ
     * @returns {boolean} ドロップ可能な場合にはtrue, それ以外はfalse
     */
    Game_Troop.prototype.isDropCondition = function(dropItemEntry) {
        return (dropItemEntry.kind > 0);
    };

    /**
     * ドロップしたかどうかを判定する。
     * 
     * @param {object} dropItemEntry ドロップアイテムエントリ
     * @param {number} rate ドロップアイテムレート
     * @returns {boolean} ドロップした場合にはtrue, それ以外はfalse.
     */
    Game_Troop.prototype.lotteryDropItem = function(dropItemEntry, rate) {
        return Math.random() * dropItemEntry.denominator < rate;
    };    
    /**
     * kind, dataIdで指定されるアイテムを得る。
     * 
     * Note: Game_Enemyと二重定義になっていてよろしくない。
     * 
     * @param {number} kind アイテム種類(1:道具,2:武器,3:防具)
     * @param {number} dataId データID
     * @return {object} アイテムデータ(DataItem/DataWeapon/DataArmor)。
     * kind,dataIdに相当するデータが無い場合にはnullが返る。
     */
    Game_Troop.prototype.itemObject = function(kind, dataId) {
        if (kind === 1) {
            return $dataItems[dataId];
        } else if (kind === 2) {
            return $dataWeapons[dataId];
        } else if (kind === 3) {
            return $dataArmors[dataId];
        } else {
            return null;
        }
    };
  

    //------------------------------------------------------------------------------
    // Game_Enemy
    /**
     * アイテムドロップ率補正倍率を得る。
     * 
     * @returns {number} 補正倍率
     * !!!overwrite!!! Game_Enmy.dropItemRate
     */
    Game_Enemy.prototype.dropItemRate = function() {
        return $gameParty.dropItemRate();
    };
    /**
     * このエネミー討伐時のドロップアイテムを作成する。
     * 
     * @return {Array<Object>} DataItem/DataWeapon/DataArmorの配列。
     * !!!overwrite!!! Game_Enemy.makeDropItems
     */
    Game_Enemy.prototype.makeDropItems = function() {
        const items = [];
        const rate = this.dropItemRate();
        const tryCount = $gameParty.dropItemLotteryCount();
        const dropItemEntries = this.dropItemEntries();
        for (const dropItemEntry of dropItemEntries) {
            if (this.isDropCondition(dropItemEntry)) {
                for (let i = 0; i < tryCount; i++) {
                    if (this.lotteryDropItem(dropItemEntry, rate)) {
                        const dropItem = this.itemObject(dropItemEntry.kind, dropItemEntry.dataId);
                        if (dropItem != null) {
                            $gameTemp.addDropItem(dropItem);
                            items.push(dropItem);
                        }
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
     *       dataId : {number} アイテム/武器/防具のID
     *       denominator : {number} ドロップ倍率の母数(1/255とかの255に相当)
     *       kind : {number} ドロップアイテム種類
     * 
     * @returns {Array<Object>} ドロップアイテムエントリ
     */
    Game_Enemy.prototype.dropItemEntries = function() {
        return this.enemy().dropItems
    };

    /**
     * ドロップアイテムエントリがドロップ条件を満たしているかどうかを得る。
     * 
     * @param {object} dropItemEntry ドロップアイテムエントリ
     * @returns {boolean} ドロップアイテム条件を満たしている場合にはtrue, それ以外はfalse.
     */
    Game_Enemy.prototype.isDropCondition = function(dropItemEntry) {
        return (dropItemEntry.kind > 0);
    };
    /**
     * ドロップしたかどうかを判定する。
     * 
     * @param {object} dropItemEntry ドロップアイテムエントリ
     * @param {number} rate ドロップアイテムレート
     * @returns {boolean} ドロップした場合にはtrue, それ以外はfalse.
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
