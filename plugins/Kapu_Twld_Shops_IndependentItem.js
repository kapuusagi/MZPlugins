/*:ja
 * @target MZ 
 * @plugindesc TwldShopsのIndependentItem向け修正
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem
 * @base Kapu_Twld_Shops
 * @orderAfter Kapu_IndependentItem
 * @orderAfter Kapu_Twld_Shops
 * 
 * @help 
 * TwldShopsをIndependentItemに対応させるためのプラグインです。
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
    const pluginName = "Kapu_TwldShops_IndependentItem";
    const parameters = PluginManager.parameters(pluginName);


    //------------------------------------------------------------------------------
    // Game_Shop
    /**
     * アイテムエントリを得る。
     * 
     * @param {Object} item アイテム
     * @return {ItemEntry} アイテムエントリ
     * !!!overwrite!!! Game_Shop.getItemEntryByItem
     */
    Game_Shop.prototype.getItemEntryByItem = function(item) {
        const dataShop = this.shopData();
        let kind = 0;
        if (DataManager.isItem(item)) {
            kind = 1;
        } else if (DataManager.isWeapon(item)) {
            kind = 2;
        } else if (DataManager.isArmor(item)) {
            kind = 3;
        }
        const id = item.baseItemId || item.id;
        return dataShop.itemList.find(function(ie) {
            return (ie.kind === kind) && (ie.id === id);
        });
    };
    /**
     * 在庫品エントリを得る。
     * 
     * @param {Data_Item} item アイテム
     * @return {ItemEntry} 在庫品エントリ
     */
    Game_Shop.prototype.getStokEntry = function(item) {
        var kind = 0;
        if (DataManager.isItem(item)) {
            kind = 1;
        } else if (DataManager.isWeapon(item)) {
            kind = 2;
        } else if (DataManager.isArmor(item)) {
            kind = 3;
        }
        var id = item.baseItemId || item.id;
        return this._itemList.find(function(ie) {
            return (ie.kind === kind) && (ie.id === id);
        });
    };
    /**
     * 所持できる最大数を得る。
     * 
     * @param {Data_Item} item アイテム
     * !!!overwrite!!! Scene_TwldShop_canHaveMax
     */
    Scene_TwldShop.prototype.canHaveMax = function(item) {
        if (DataManager.isIndependent(item)) {
            if (DataManager.isItem(item)) {
                return $gameParty.maxItems(item) - $gameParty.numItems(item);
            } else if (DataManager.isWeapon(item)) {
                // 個別武器は1個ずつ
                return 1;
            } else if (DataManager.isArmor(item)) {
                // 個別防具は1個ずつ
                return 1;
            }
        } else {
            return $gameParty.maxItems(item) - $gameParty.numItems(item);
        }
    };
    /**
     * 最大売却数を取得する。
     * 
     * @return {Number} 最大売却数
     * !!!overwrite!!! Scene_TwldShop.maxSell
     */
    Scene_TwldShop.prototype.maxSell = function() {
        if (DataManager.isIndependent(this._item)) {
            return 1;
        } else {
            return $gameParty.numItems(this._item);
        }
    }
})();