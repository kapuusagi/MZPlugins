/*:ja
 * @target MZ 
 * @plugindesc TWLD向けアイテムメニューUIプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem
 * @orderAfter Kapu_IndependentItem
 * 
 * @param textUse
 * @text 使用表示ラベル
 * @desc アイテム使用コマンドとして表示するテキスト。
 * @type string
 * @default 使う
 * 
 * @param textDiscard
 * @text 破棄表示ラベル
 * @desc アイテム破棄コマンドとして表示するテキスト。
 * @type string
 * @default 捨てる
 * 
 * @help 
 * TWLD向けに作成した。
 * ・メニュー画面のレイアウトを変更する。
 * ・メニュー画面からアイテム/武器/防具を洗濯したとき、
 *   捨てる操作を提供する。
 *   破棄可能条件
 *     通常アイテム/武器/防具
 *       売却可能で<disableDiscard>ノートタグが指定されていない場合
 *     重要なアイテム
 *       <enableDiscard>が指定されている場合
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * Window_ItemCategoryを使いません。
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
 *   <enableDiscard>
 *      破棄できることを明示する。
 *   <disableDiscard>
 *      破棄できないことを明示する。 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 TWLD向けに作成したものを移植して実装。動作未確認。
 */
/**
 * Window_ItemCategoryVertical
 * ベーシックシステムでは水平方向メニュー構成だったのを垂直方向にするために作成した。
 */
function Window_ItemCategoryVertical() {
    this.initialize.apply(this, arguments);
}

/**
 * Window_ItemCommand
 * アイテム選択時に表示・選択させるウィンドウ。
 */
function Window_ItemCommand() {
    this.initialize.apply(this, arguments);
}
(() => {
    const pluginName = "Kapu_Twld_UI_MenuItem";
    const parameters = PluginManager.parameters(pluginName);
    const textUse = parameters["textUse"] || "Use";
    const textDiscard = parameters["textDiscard"] || "Discard";

    //-----------------------------------------------------------------------------
    // Window_ItemCategoryVertical
    //
    Window_ItemCategoryVertical.prototype = Object.create(Window_Command.prototype);
    Window_ItemCategoryVertical.prototype.constructor = Window_ItemCategoryVertical;

    /**
     * 初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域。
     */
    Window_ItemCategoryVertical.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    /**
     * 最大カラム数を取得する。
     * 
     * @return {Number} カラム数
     */
    Window_ItemCategoryVertical.prototype.maxCols = function() {
        return 1;
    };

    /**
     * 表示する行数を取得する。
     * 
     * @return {Number} 行数
     */
    Window_ItemCategoryVertical.prototype.numVisibleRows = function() {
        return 4;
    };

    /**
     * 更新処理を行う。
     */
    Window_ItemCategoryVertical.prototype.update = function() {
        Window_Command.prototype.update.call(this);
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    }

    /**
     * コマンドリストを作成する。
     */
    Window_ItemCategoryVertical.prototype.makeCommandList = function() {
        if (this.needsCommand("item")) {
            this.addCommand(TextManager.item, "item");
        }
        if (this.needsCommand("weapon")) {
            this.addCommand(TextManager.weapon, "weapon");
        }
        if (this.needsCommand("armor")) {
            this.addCommand(TextManager.armor, "armor");
        }
        if (this.needsCommand("keyItem")) {
            this.addCommand(TextManager.keyItem, "keyItem");
        }
    };

    /**
     * コマンド選択対象として必要かどうかを得る。
     * 
     * @param {String} name 種類名
     * @return {Boolean} 選択対象として必要な場合にはtrue, それ以外はfalse
     */
    Window_ItemCategoryVertical.prototype.needsCommand = function(name) {
        const table = ["item", "weapon", "armor", "keyItem"];
        const index = table.indexOf(name);
        if (index >= 0) {
            return $dataSystem.itemCategories[index];
        }
        return true;
    };

    /**
     * アイテムウィンドウを設定する。
     * 
     * @param {Window_ItemList} itemWindow アイテム一覧表示ウィンドウ
     */
    Window_ItemCategoryVertical.prototype.setItemWindow = function(itemWindow) {
        this._itemWindow = itemWindow;
    };

    /**
     * 選択が必要かどうかを得る。
     * 
     * @return {Boolean} 選択が必要な場合にはtrue, それ以外はfalse
     */
    Window_ItemCategoryVertical.prototype.needsSelection = function() {
        return this.maxItems() >= 2;
    };

    /**
     * 項目を描画する。
     * 
     * Note: 各カテゴリ毎の種類数を表示するため、自訴すする。
     */
    Window_ItemCategoryVertical.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        const numWidth = 80;
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width - numWidth, align);

        // 道具種類数を書く
        const x = rect.x + rect.width - numWidth;        
        switch (this.commandSymbol(index)) {
            case 'item':
                this.drawNormalItemCount(x, rect.y, numWidth);
                break;
            case 'weapon':
                this.drawWeaponItemCount(x, rect.y, numWidth);
                break;
            case 'armor':
                this.drawArmorItemCount(x, rect.y, numWidth);
                break;
            case 'keyItem':
                // キーアイテムは個数表示しない。
                break;
            default:
                return;
        }
    };

    /**
     * 通常アイテム個数を表示する。
     * 
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 幅
     */
    Window_ItemCategoryVertical.prototype.drawNormalItemCount = function(x, y, width) {
        const normaIndependentlItems = $gameParty.items().filter((item) => {
            return DataManager.isIndependentItem(item) && (item.itypeId == 1); 
        });
        const itemCount = normaIndependentlItems.length;
        const maxItemCount = $gameParty.maxItemInventoryCount();
        const numLabel = itemCount + '/' + maxItemCount;
        if (itemCount >= maxItemCount) {
            this.changeTextColor(ColorManager.textColor(2));
        }
        this.drawText(numLabel, x, y, width, 'right');
    };
    /**
     * 武器個数を表示する。
     * 
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 幅
     */
    Window_ItemCategoryVertical.prototype.drawWeaponItemCount = function(x, y, width) {
        const independentWeapons = $gameParty.weapons().filter((weapon) => DataManager.isIndependentItem(weapon));
        const itemCount = independentWeapons.length;
        const maxItemCount = $gameParty.maxWeaponInventoryCount();
        const numLabel = itemCount + '/' + maxItemCount;
        if (itemCount >= maxItemCount) {
            this.changeTextColor(ColorManager.textColor(2));
        }
        this.drawText(numLabel, x, y, width, 'right');
    };

    /**
     * 防具個数を表示する。
     * 
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 幅
     */
    Window_ItemCategoryVertical.prototype.drawArmorItemCount = function(x, y, width) {
        const independentArmors = $gameParty.armors().filter((armor) => DataManager.isIndependentItem(armor));
        const itemCount = independentArmors.length;
        const maxItemCount = $gameParty.maxArmorInventoryCount();
        const numLabel = itemCount + '/' + maxItemCount;
        if (itemCount >= maxItemCount) {
            this.changeTextColor(this.textColor(2));
        }
        this.drawText(numLabel, x, y, width, 'right');
    };

    //------------------------------------------------------------------------------
    // Window_ItemList
    //
    /**
     * itemに対してOKが選択できるかを取得する。
     * アイテムリストは常に有効。
     * 
     * @return {Boolean} OKが選択できる場合にはtrue, それ以外はfalse。
     * !!!overwrite!!! Window_ItemList.isEnabled()
     *     使うかどうかの選択を別ウィンドウで行うため、オーバーライドする。
     */
    Window_ItemList.prototype.isEnabled = function (item) {
        // 基本的にアイテムコマンドで操作するので、nullじゃなければオッケー。
        return (item !== null);
    };

    //------------------------------------------------------------------------------
    // Scene_ItemCommand
    Window_ItemCommand.prototype = Object.create(Window_Command.prototype);
    Window_ItemCommand.prototype.constructor = Window_ItemCommand;

    /**
     * Window_ItemCommandを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_ItemCommand.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this._item = null;
    };

    /**
     * アイテムを得る。
     * 
     * @return {Object} item アイテム
     */
    Window_ItemCommand.prototype.item = function() {
        return this._item;
    };

    /**
     * アイテムを設定する。
     * 
     * @param {Object} item アイテム
     */
    Window_ItemCommand.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };

    /**
     * コマンドリストを作成する。
     */
    Window_ItemCommand.prototype.makeCommandList = function() {
        if (this._item) {
            this.addCommand(textUse, "use", $gameParty.canUse(this._item));
            this.addCommand(textDiscard, "discard", this.canDiscard(this._item));
        }
    };

    /**
     * itemを破棄可能かどうかを取得する。
     * 
     * @param {Object} item アイテム
     */
    Window_ItemCommand.prototype.canDiscard = function(item) {
        if (item.meta.enableDiscard) {
            return true;
        } else if (item.meta.disableDiscard) {
            return false;
        } else {
            if (DataManager.isItem(item) && (item.itypeId === 0)) {
                return false;
            } else {
                // 売却可能かどうかで判定する。
                return (item.price > 0);
            }
        }
    };

    //------------------------------------------------------------------------------
    // Scene_Item
    const _Scene_Item_create = Scene_Item.prototype.create;
    /**
     * Scene_Itemを初期化する。
     */
    Scene_Item.prototype.create = function() {
        _Scene_Item_create.call(this);
        this.createItemCommandWindow(); // 操作選択用
    };
    
    /**
     * カテゴリ選択をするウィンドウを作成する。
     * 
     * !!!overwrite!!! Scene_Item.createCategoryWindow
     *     カテゴリウィンドウとして、Window_ItemCategoryVerticalを使用するため、オーバーライドする。
     */
    Scene_Item.prototype.createCategoryWindow = function() {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_ItemCategoryVertical(rect);
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    };

    /**
     * カテゴリウィンドウのウィンドウ矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     * !!!overwrite!!! Scene_Item.categoryWindowRect
     *     カテゴリウィンドウのレイアウト変更のため、オーバーライドする。
     */
    Scene_Item.prototype.categoryWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this.commandWindowWidth();
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * コマンドウィンドウ幅を得る。
     * 
     * @return {Number} コマンドウィンドウ幅
     */
    Scene_Item.prototype.commandWindowWidth = function() {
        return 340;
    };
    

    /**
     * アイテム一覧ウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     * !!!overwrite!!! Scene_Item.itemWindowRect()
     *     ウィンドウレイアウト変更のため、オーバーライドする。
     */
    Scene_Item.prototype.itemWindowRect = function() {
        const wx = this._categoryWindow.x + this._categoryWindow.width;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - wx;
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アイテムに対する操作を提示するウィンドウを作成する。
     */
    Scene_Item.prototype.createItemCommandWindow = function() {
        const rect = this.itemCommandWindowRect();
        this._itemCommandWindow = new Window_ItemCommand(rect);
        this._itemCommandWindow.setHandler('ok',     this.onItemCommandOk.bind(this));
        this._itemCommandWindow.setHandler('cancel', this.onItemCommandCancel.bind(this));
        this._itemCommandWindow.hide();
        this.addWindow(this._itemCommandWindow);
    };

    /**
     * アイテムコマンドウィンドウのウィンドウ矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     */
    Scene_Item.prototype.itemCommandWindowRect = function() {
        const ww = this.commandWindowWidth();
        const wh = this.calcWindowHeight(2, true);
        const itemWindowRect = this.itemWindowRect();
        const wx = (Graphics.boxWidth - this.commandWindowWidth()) / 2;
        const wy = itemWindowRect.y + (itemWindowRect.height - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
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
     * アイテム選択で決定操作されたときの処理を行う。
     * 
     * !!!overwrite!!! Scene_Item.onItemOk()
     *     OK操作されたとき、アイテムに対するコマンドを表示するため、オーバーライドする。
     */
    Scene_Item.prototype.onItemOk = function() {
        const item = this.item();
        this._itemCommandWindow.setItem(item);
        this._itemCommandWindow.show();
        this._itemCommandWindow.activate();
    };

    /**
     * アイテムコマンドウィンドウでOK操作されたときに通知を受け取る。
     */
    Scene_Item.prototype.onItemCommandOk = function() {
        this._itemCommandWindow.hide();
        switch (this._itemCommandWindow.currentSymbol()) {
            case 'use':
                $gameParty.setLastItem(this.item());
                this.determineItem(); // メソッドの意味合い的におかしいけど、このままにする。
                break;
            case 'discard':
                this.discardItem();
                break;
        }
    };

    /**
     * アイテムを捨てる。
     */
    Scene_Item.prototype.discardItem = function() {
        const item = this.item();
        $gameParty.loseItem(item, 1, false);
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


    const _Scene_Item_useItem = Scene_Item.prototype.useItem;
    /**
     * アイテムを使用する。
     */
    Scene_Item.prototype.useItem = function() {
        _Scene_Item_useItem.call(this);
        // カテゴリウィンドウをリフレッシュする。
        this._itemCommandWindow.hide();
        this._categoryWindow.refresh();
    };

    const _Scene_Item_onActorCancel = Scene_ItemBase.prototype.onActorCancel;
    /**
     * 使用対象アクター選択でキャンセル操作されたときの処理を行う。
     */
    Scene_ItemBase.prototype.onActorCancel = function() {
        _Scene_Item_onActorCancel.call(this);
        this._itemCommandWindow.hide();
    };
})();