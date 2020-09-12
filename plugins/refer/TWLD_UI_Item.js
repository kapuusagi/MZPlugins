/*:
 * @plugindesc TWLDのアイテム画面の動作について記述する。
 * @help
 *      TWLD専用。
 *      個別アイテムでパンクしたりするといやなので、
 *      その場で捨てられるようにした。
 */
var Imported = Imported || {};
Imported.TWLD_UI_Item = true;

var TWLD = TWLD || {};
TWLD.Core = TWLD.Core || {};

if (!Imported.TWLD_UI) {
    throw "This plugin must be import after TWLD_UI.js";
}


// for ESLint
if (typeof Window_ItemCategory === 'undefined') {
    var GenericCommand = {};
    var Window_CommandGeneric = {};
    var Window_ItemCategory = {};
    var Window_ItemList = {};
    var Window_Command = {};
    var Window_Help = {};
    var Window_Selectable = {};
    var TextManager = {};
    var DataManager = {};
    var Graphics = {};
    var $gameParty = {};
    var $dataItems = {};
    var $dataWeapons = {};
    var $dataArmors = {};
    var Scene_ItemBase = {};
    var Scene_Item = {};
}

// for ESLint
(function () {


    //-----------------------------------------------------------------------------
    // Window_ItemCategoryVertical
    //    現在選択されている項目は Window_ItemCategoryVertical.currentSymbol()で
    //    取得できる。
    //
    function Window_ItemCategoryVertical() {
        this.initialize.apply(this, arguments);
    }

    Window_ItemCategoryVertical.prototype = Object.create(Window_Command.prototype);
    Window_ItemCategoryVertical.prototype.constructor = Window_ItemCategoryVertical;

    /**
     * 初期化する。
     */
    Window_ItemCategoryVertical.prototype.initialize = function() {
        Window_Command.prototype.initialize.call(this, 0, 0);
    };

    /**
     * ウィンドウ幅を取得する
     * @return {Number} ウィンドウ幅
     */
    Window_ItemCategoryVertical.prototype.windowWidth = function() {
        return 340;
    };

    /**
     * 最大カラム数を取得する。
     * @return {Number} カラム数
     */
    Window_ItemCategoryVertical.prototype.maxCols = function() {
        return 1;
    };

    /**
     * 表示する行数を取得する。
     * @return {Number} 行数
     */
    Window_ItemCategoryVertical.prototype.numVisibleRows = function() {
        return 4;
    };

    /**
     * コマンドリストを作成する。
     */
    Window_ItemCategoryVertical.prototype.makeCommandList = function() {
        this.addCommand(TextManager.item,    'item');
        this.addCommand(TextManager.weapon,  'weapon');
        this.addCommand(TextManager.armor,   'armor');
        this.addCommand(TextManager.keyItem, 'keyItem');
    };

    /**
     * 項目を描画する。
     */
    Window_ItemCategoryVertical.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width - 80, align);

        // 道具個数を書きたいな
        var itemCount = 0;
        var maxItemCount = 0;
        var numLabel;
        
        switch (this.commandSymbol(index)) {
            case 'item':
                var normalItems = $gameParty.items().filter(function(item) { 
                    return item.itypeId == 1; 
                });
                itemCount = normalItems.length;
                maxItemCount = $gameParty.getIndependentItemTypeMax($dataItems[1]);
                numLabel = itemCount + '/' + maxItemCount;
                if (itemCount >= maxItemCount) {
                    this.changeTextColor(this.textColor(2));
                }
                break;
            case 'weapon':
                itemCount = $gameParty.weapons().length;
                maxItemCount = $gameParty.getIndependentItemTypeMax($dataWeapons[1]);
                numLabel = itemCount + '/' + maxItemCount;
                if (itemCount >= maxItemCount) {
                    this.changeTextColor(this.textColor(2));
                }
                break;
            case 'armor':
                itemCount = $gameParty.armors().length;
                maxItemCount = $gameParty.getIndependentItemTypeMax($dataArmors[1]);
                numLabel = itemCount + '/' + maxItemCount;
                if (itemCount >= maxItemCount) {
                    this.changeTextColor(this.textColor(2));
                }
                break;
            case 'keyItem':
                var keyItems = $gameParty.items().filter(function(item) { 
                    return item.itypeId == 0; 
                });
                itemCount = keyItems.length;
                numLabel = itemCount;
                break;
            default:
                return;
        }

        this.drawText(numLabel, rect.x + rect.width - 80, rect.y, 80, 'right');
    };


    //------------------------------------------------------------------------------
    // Window_ItemListの変更
    //
    Window_ItemList.prototype.initialize = function(x, y, width, height) {
        // YEP_ItemCoreで書き換えられてるので戻す。
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._category = 'none';
        this._data = [];
    };

    /**
     * アイテム個数を描画する。
     * 
     * @param {Data_Item} アイテム。(Weapon/Armor/Item)
     * @param {Number} x x描画位置
     * @param {Number} y y描画位置
     * @param {Number} width 幅
     */
    Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(':', x, y, width - this.textWidth('00'), 'right');
            var num = DataManager.isIndependent(item) ? 1 : $gameParty.numItems(item);
            this.drawText(num, x, y, width, 'right');
        }
    };
    /**
     * 表示カラム数を取得する。
     * 画面サイズを考慮し、ヨコ2行並べたほうが良いと考える。
     * @return {Number} カラム数
     */
    Window_ItemList.prototype.maxCols = function () {
        return 2;
    };
    
    /**
     * itemに対してOKが選択できるかを取得する。
     * アイテムリストは常に有効
     * @return {Boolean} OKが選択できる場合にはtrue, それ以外はfalse。
     */
    Window_ItemList.prototype.isEnabled = function (item) {
        // 基本的にアイテムコマンドで操作するので、nullじゃなければオッケー。
        return (item !== null);
    };

    /**
     * 表示するアイテムリストを構築する。
     */
    Window_ItemList.prototype.makeItemList = function() {
        // YEP_ItemCoreで書き換えられてるので戻す。
        this._data = $gameParty.allItems().filter(function(item) {
            return this.includes(item);
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }
    };

    //------------------------------------------------------------------------------
    // Scene_Itemの変更
    //
    // カテゴリ選択ウィンドウには、種類と、それぞれの数量を描画しよう。
    //    
    Scene_Item.prototype.create = function() {
        Scene_ItemBase.prototype.create.call(this);
        this.createHelpWindow(); // 情報表示用
        this.createCategoryWindow(); // カテゴリ選択ウィンドウ
        this.createItemWindow(); // 一覧表示用
        this.createItemCommandWindow(); // 操作選択用(使うと捨てる)
        this.createActorWindow(); // アクター選択用(これは通常消えてる)
    };

    /**
     * ヘルプウィンドウを作成する。
     */
    Scene_Item.prototype.createHelpWindow = function() {
        var height = 180; // 4行表示できるくらいの高さ
        var width = Graphics.boxWidth;
        var x = 0;
        var y = Graphics.boxHeight - height;
        this._helpWindow = new Window_Help(4, x, y, width, height);
        this._helpWindow.show();
        this.addWindow(this._helpWindow);
    };
    
    /**
     * カテゴリ選択をするウィンドウを作成する。
     */
    Scene_Item.prototype.createCategoryWindow = function() {
        this._categoryWindow = new Window_ItemCategoryVertical();
        this._categoryWindow.y = 0;
        this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
        this._categoryWindow.setHandler('itemchange', this.onCategoryItemChange.bind(this));
        this.addWindow(this._categoryWindow);
    };
    
    /**
     * アイテム一覧を表示するウィンドウを作成する。
     */
    Scene_Item.prototype.createItemWindow = function() {
        var x = this._categoryWindow.x + this._categoryWindow.width;
        var y = 0;
        var width = Graphics.boxWidth - x;
        var height = Graphics.boxHeight - this._helpWindow.height;
        this._itemWindow = new Window_ItemList(x, y, width, height);
        this._itemWindow.setHelpWindow(this._helpWindow); // _itemWindowに_helpWindowをセットして、連動して表示するようにする。
        this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this._itemWindow.setCategory(this._categoryWindow.currentSymbol());
        this.addWindow(this._itemWindow);
    };

    /**
     * アイテムに対する操作を提示するウィンドウを作成する。
     */
    Scene_Item.prototype.createItemCommandWindow = function() {
        var commandList = [];
        commandList.push(new GenericCommand('使う', 'use', true));
        commandList.push(new GenericCommand('すてる', 'scrap', true));

        var x = (Graphics.boxWidth - 240) >> 1;
        var y = (Graphics.boxHeight - 200) >> 1;
        var width = 240;
        this._itemCommandWindow = new Window_CommandGeneric(x, y, commandList, width);
        this._itemCommandWindow.setHandler('ok',     this.onItemCommandOk.bind(this));
        this._itemCommandWindow.setHandler('cancel', this.onItemCommandCancel.bind(this));
        this._itemCommandWindow.hide();
        this.addWindow(this._itemCommandWindow);
    };

    /**
     * シーンを開始する。
     */
    Scene_Item.prototype.start = function() {
        Scene_ItemBase.prototype.start.call(this);
        this._categoryWindow.activate();
    };

    /**
     * カテゴリウィンドウでOK操作がされた時に通知を受け取る。
     */
    Scene_Item.prototype.onCategoryOk = function() {
        // アイテム選択画面を有効にする。
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    };

    /**
     * 選択しているアイテムカテゴリーが変更された時に通知を受け取る。
     */
    Scene_Item.prototype.onCategoryItemChange = function() {
        this._itemWindow.setCategory(this._categoryWindow.currentSymbol());
    };
    /**
     * アイテム選択欄でOK操作されたときに通知を受け取る。
     */
    Scene_Item.prototype.onItemOk = function() {
        var item = this.item();
        this._itemCommandWindow.setCommandEnable('use', $gameParty.canUse(item));
        this._itemCommandWindow.setCommandEnable('scrap', (item.price > 0));
        this._itemCommandWindow.show();
        this._itemCommandWindow.activate();
    }

    /**
     * アイテム選択画面でキャンセル操作されたときに通知を受け取る。
     */
    Scene_Item.prototype.onItemCancel = function() {
        // アイテム選択ウィンドウを未選択にしてカテゴリ選択ウィンドウを有効にする。
        this._helpWindow.clear();
        this._itemWindow.deselect();
        this._categoryWindow.activate();
    };

    /**
     * アイテムコマンドウィンドウでOK操作されたときに通知を受け取る。
     */
    Scene_Item.prototype.onItemCommandOk = function() {
        this._itemCommandWindow.hide();
        switch (this._itemCommandWindow.currentSymbol()) {
            case 'use':
                $gameParty.setLastItem(this.item());
                this.determineItem();
                break;
            case 'scrap':
                this.scrapItem();
                break;
        }
    };

    /**
     * アイテムを捨てる。
     */
    Scene_Item.prototype.scrapItem = function() {
        var item = this.item();
        $gameParty.gainItem(item, -1, false);
        this._categoryWindow.refresh();
        this._itemWindow.refresh();
        this._itemWindow.activate();
    };

    /**
     * アイテムコマンドウィンドウでキャンセル操作されたときに通知を受け取る。
     */
    Scene_Item.prototype.onItemCommandCancel = function() {
        this._itemCommandWindow.hide();
        this._itemWindow.activate();
    };
    
    /**
     * アイテムを使用する。
     */
    Scene_Item.prototype.useItem = function() {
        Scene_ItemBase.prototype.useItem.call(this);
        this._itemWindow.refresh();
        this._categoryWindow.refresh();
    };

})();