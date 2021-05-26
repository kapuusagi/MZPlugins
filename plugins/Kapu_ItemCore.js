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
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム/武器/防具
 *   <maxItems:num#>
 *      アイテムの所持可能数をnum#で指定した数量とする。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成開始
 */
(() => {
    DataManager.ITEM_KIND_ITEM = 1; // アイテム種類がアイテム
    DataManager.ITEM_KIND_WEAPON = 2; // アイテム種類が武器
    DataManager.ITEM_KIND_ARMOR = 3; // アイテム種類が防具
    DataManager.ITEM_KIND_SKILL = 101; // アイテム種類がスキル

    //-------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        // Add kind field.
        DataManager.setItemKind($dataSkills, DataManager.ITEM_KIND_SKILL);
        DataManager.setItemKind($dataItems, DataManager.ITEM_KIND_ITEM);
        DataManager.setItemKind($dataWeapons, DataManager.ITEM_KIND_WEAPON);
        DataManager.setItemKind($dataArmors, DataManager.ITEM_KIND_ARMOR);
        _Scene_Boot_start.call(this);
    };

    //-------------------------------------------------------------------------
    // DataManager

    /**
     * データコレクションに itemKindフィールドを追加する。
     * 
     * @param {Array<Object>} dataArray データアレー
     * @param {number} kind 設定する値。
     */
    DataManager.setItemKind = function(dataArray, kind) {
        for (let item of dataArray) {
            if (item) {
                item.itemKind = kind;
            }
        }
    };

    const _DataManager_isSkill = DataManager.isSkill;
    /**
     * スキルかどうかを判定する。
     * 
     * @param {object} item 判定対象のオブジェクト。
     * @returns {boolean} スキルの場合にはtrue, それ以外はfalse.
     */
    DataManager.isSkill = function(item) {
        if (item && item.itemKind) {
            return item.itemKind === DataManager.ITEM_KIND_SKILL;
        } else {
            return _DataManager_isSkill.call(this, item);
        }
    };

    const _DataManager_isItem = DataManager.isItem;
    /**
     * itemがアイテムかどうかを判定する。
     * 
     * @param {object} item アイテム
     * @returns {boolean} アイテムの場合にはtrue, それ以外はfalse.
     */
    DataManager.isItem = function(item) {
        // itemKind が設定済みの場合、itemKindで識別する。
        if (item && item.itemKind) {
            return item.itemKind === DataManager.ITEM_KIND_ITEM;
        } else {
            return _DataManager_isItem.call(this, item);
        }
    };
    
    const _DataManager_isWeapon = DataManager.isWeapon;
    /**
     * itemが武器かどうかを判定する。
     * 
     * @param {object} item アイテム
     * @returns {boolean} 武器の場合にはtrue, それ以外はfalse
     */
    DataManager.isWeapon = function(item) {
        if (item && item.itemKind) {
            return item.itemKind === DataManager.ITEM_KIND_WEAPON;
        } else {
            return _DataManager_isWeapon.call(this, item);
        }
    };

    const _DataManager_isArmor = DataManager.isArmor;
    /**
     * itemが防具かどうかを判定する。
     * 
     * @param {object} item アイテム
     * @returns {boolean} 防具の場合にはtrue, それ以外はfalse
     */
    DataManager.isArmor = function(item) {
        if (item && item.itemKind) {
            return item.itemKind === DataManager.ITEM_KIND_ARMOR;
        } else {
            return _DataManager_isArmor.call(this, item);
        }
    };

    //-------------------------------------------------------------------------
    // Game_Party

    /**
     * itemで指定されるアイテムを装備しているかどうかを判定する。
     * @param {object} item アイテム(DataWeapon/DataArmor)
     * @returns {boolean} 装備している場合にはtrue, それ以外はfalse
     */
    Game_Party.prototype.isAnyMemberEquipped = function(item) {
        return this.members().some(actor => actor.isEquipped(item));
    };
    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * アイテムの所持最大数を得る。
     * 
     * @param {object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @returns {number} 最大所持数
     * !!!overwrite!!! Game_Party.maxItems()
     *     maxItemsノートタグ指定を可能にするため、オーバーライドする。
     */
    Game_Party.prototype.maxItems = function(item) {
        if (item.meta.maxItems) {
            return Math.max(1, Math.floor(Number(item.meta.maxItems) || 1));
        } else {
            return 99;
        }
    };
})();
