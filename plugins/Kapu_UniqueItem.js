/*:ja
 * @target MZ 
 * @plugindesc アイテム/武器/防具にユニークフラグを付けて、同時に1つ以上入手できなくするプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Drop
 * @orderAfter Kapu_Base_Drop
 * 
 * 
 * @help 
 * アイテム/武器/防具にユニークフラグを付けて、同時に1つ以上入手できなくするプラグイン
 * 
 * ■ 使用時の注意
 * データベース上に設定された初期装備には無効です。
 * 
 * 装備イベントなどを作る場合は注意が必要です。
 * 装備イベントは通常、アイテム入手⇒アクターに装備されるで構成されますが、
 * 既にユニーク装備を入手していた場合、新たに増やすことはできなくなるので
 * 装備が増えません。結果、インタプリタで装備を指定しても装備されません。
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
 * アイテム/武器/防具
 *   <unique>
 *     ユニークアイテムであることを指定する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_UniqueItem";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_Enemy
    const _Game_Enemy_isDropcondition = Game_Enemy.prototype.isDropCondition;
    /**
     * ドロップアイテムエントリがドロップ条件を満たしているかどうかを得る。
     * 
     * @param {object} dropItemEntry ドロップアイテムエントリ
     * @returns {boolean} ドロップアイテム条件を満たしている場合にはtrue, それ以外はfalse.
     */
    Game_Enemy.prototype.isDropCondition = function(dropItemEntry) {
        if (_Game_Enemy_isDropcondition.call(this, dropItemEntry)) {
            const item = this.itemObject(dropItemEntry.kind, dropItemEntry.dataId);
            if (item.meta.unique || (!$gameParty.hasItem(item, true) && !$gameTemp.dropItems().includes(item))) {
                return true;
            }
        }
        return false;
    };
    //------------------------------------------------------------------------------
    // Game_Troop

    const _Game_Troop_isDropCondition = Game_Troop.prototype.isDropCondition;
    /**
     * ドロップ条件を満たしているかどうかを調べる。
     * 
     * @param {object} dropItemEntry ドロップアイテムエントリ
     * @returns {boolean} ドロップ可能な場合にはtrue, それ以外はfalse
     */
    Game_Troop.prototype.isDropCondition = function(dropItemEntry) {
        if(_Game_Troop_isDropCondition.call(this, dropItemEntry)) {
            const item = this.itemObject(dropItemEntry.kind, dropItemEntry.dataId);
            if (!item.meta.unique || (!$gameParty.hasItem(item, true) && !$gameTemp.dropItems().includes(item))) {
                return true;
            }
        }
        return false;
    };
    //------------------------------------------------------------------------------
    // Game_Actors
    Game_Actors.prototype.isAnyMemberEquipped = function(item) {
        for (const actor of this._data) {
            if (actor && actor.isEquipped(item)) {
                return true;
            }
        }
        return false;
    };
    //------------------------------------------------------------------------------
    // Game_Party
    const _Game_Party_gainItem = Game_Party.prototype.gainItem;
    /**
     * アイテムを加算/減算する。
     * 
     * @param {object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @param {number} amount 増減する量。
     * @param {boolean} includeEquip 装備品を含めるかどうか。
     */
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        if (item && item.meta.unique && (amount > 0)) {
            if ($gameParty.hasItem(item, false) || $gameActors.isAnyMemberEquipped(item)) {
                // 所持しているので増やさない。
                return ;
            } else {
                // 持っていない場合に1つだけ増やす。
                amount = 1;
            }
        }
        _Game_Party_gainItem.call(this, item, amount, includeEquip);
    };
})();