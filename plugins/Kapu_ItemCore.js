/*:ja
 * @target MZ
 * @plugindesc 道具/武器/防具に関していくつかのAPIを追加する。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 *
 * 
 * @help 
 * 道具/武器/防具に関していくつかのAPIを追加する。
 * 
 * 道具/武器/防具データには以下のフィールドを追加する。
 * itemKind : 種類。(ベースシステムでの種類と同じ。)
 * 
 * メソッドオーバーライド
 * DataManager.isItem - includesの代わりにitemKindによる判定に変更
 * DataManager.isWeapon - includesの代わりにitemKindによる判定に変更
 * DataManager.isArmor - includesの代わりにitemKindによる判定に変更
 * 
 * Game_Party.prototype.isAnyMemberEquipped - Game_Actor.isEquippedをコールするように変更。
 * 
 * コレクションとincludes()による判定から、item自身のitemkindを使う判定に変更。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成開始
 */
(() => {

    //-------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_start.call(this);
        // Add kind field.
        DataManager.setItemKind($dataItems, DataManager.ITEM_KIND_ITEM);
        DataManager.setItemKind($dataWeapons, DataManager.ITEM_KIND_WEAPON);
        DataManager.setItemKind($dataArmors, DataManager.ITEM_KIND_ARMOR);
    };

    //-------------------------------------------------------------------------
    // DataManager

    DataManager.ITEM_KIND_ITEM = 1; // アイテム種類がアイテム
    DataManager.ITEM_KIND_WEAPON = 2; // アイテム種類が武器
    DataManager.ITEM_KIND_ARMOR = 3; // アイテム種類が防具

    /**
     * データコレクションに itemKindフィールドを追加する。
     * 
     * @param {Array<Object>} dataArray データアレー
     * @param {Number} kind 設定する値。
     */
    DataManager.setItemKind = function(dataArray, kind) {
        for (let item of dataArray) {
            if (item) {
                item.itemKind = kind;
            }
        }
    };

    /**
     * itemがアイテムかどうかを判定する。
     * 
     * @param {Object} item アイテム
     * @return {Boolean} アイテムの場合にはtrue, それ以外はfalse.
     */
    DataManager.isItem = function(item) {
        return item && item.itemKind &&  item.itemKind === DataManager.ITEM_KIND_ITEM;
    };
    
    /**
     * itemが武器かどうかを判定する。
     * 
     * @param {Object} item アイテム
     * @return {Boolean} 武器の場合にはtrue, それ以外はfalse
     */
    DataManager.isWeapon = function(item) {
        return item && item.itemKind && item.itemKind === DataManager.ITEM_KIND_WEAPON;
    };

    /**
     * itemが防具かどうかを判定する。
     * 
     * @param {Object} item アイテム
     * @return {Boolean} 防具の場合にはtrue, それ以外はfalse
     */
    DataManager.isArmor = function(item) {
        return item && item.itemKind && item.itemKind === DataManager.ITEM_KIND_ARMOR;
    };

    //-------------------------------------------------------------------------
    // Game_Party

    /**
     * itemで指定されるアイテムを装備しているかどうかを判定する。
     * @param {Object} item アイテム(DataWeapon/DataArmor)
     * @return {Boolean} 装備している場合にはtrue, それ以外はfalse
     */
    Game_Party.prototype.isAnyMemberEquipped = function(item) {
        return this.members().some(actor => actor.isEquipped(item));
    };

})();
