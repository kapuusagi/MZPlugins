/*:ja
 * @target MZ 
 * @plugindesc TWLDシステム向けに作成したショッププラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * ■ openShop
 * @command openShop
 * @text ショップを開く
 * @desc 指定したIDのお店の売買シーンを開始します。
 *
 * @arg id
 * @text ショップID
 * @desc ショップのID番号
 * @type number
 * @default 1
 * 
 * @arg ckerkFileName
 * @text 店員画像
 * @desc 店員として表示する画像ファイル名。
 * @type file
 * @dir pictures
 * 
 * ■ updateShop
 * @command updateShop
 * @text 品揃えを更新
 * @desc 指定したIDのお店の品揃えを更新します。
 *
 * @arg id
 * @text ショップID
 * @desc ショップのID番号
 * @type number
 * @default 1
 * 
 * ■ setShopLevel
 * @command setShopLevel
 * @text お店のレベルを設定
 * @desc お店のレベルを設定します。
 *
 * @arg id
 * @text ショップID
 * @desc ショップのID番号
 * @type number
 * @default 1
 * 
 * @arg level
 * @text ショップレベル
 * @desc 設定するショップレベル。
 * @type number
 * @default 1
 * 
 * @help 
 * TWLDシステム向けに作成したショップです。
 * 
 * 
 * 
 * openShopコール後、以下のメソッドで条件分岐できる。
 * TWLD.Shop.isTransacted()
 *      直前のショップ処理にて取引が行われたかどうかを取得する。
 * TWLD.Shop.isBoughtAny()
 *      直前のショップ処理にて、購入が行われたかどうかを取得する。
 * TWLD.Shop.isSoldAny()
 *      直前のショップ処理にて、売却が行われたかどうかを取得する。
 * 
 * ■プラグイン開発者向け
 * 
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * openShop
 *     ショップのシーンを開始する。
 * updateShop
 *     ショップの品揃えを更新する。
 * setShopLevel
 *     ショップレベルを設定する。
 *     ショップの繁栄度として使用するもので、
 *     ショップレベルは品物の入荷条件に使用される。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 TWLD向けに作成したものを移植。レイアウト未調整。
 */
TWLD = TWLD || {};
TWLD.Shop = TWLD.Shop || {};

(() => {
    'use strict';

    const pluginName = 'Kapu_TwldShops';

    PluginManager.registerCommand(pluginName, 'openShop', args => {
        id = Number(args.id) || 0;
        if (id && id < $dataShops.length) {
            TWLD.Shop.isBoughtAny = false;
            TWLD.Shop.isSoldAny = false;
            SceneManager.push(Scene_TwldShop);
            SceneManager.prepareNextScene(args.id, args.clerkFileName);
        }
    });
    
    PluginManager.registerCommand(pluginName, 'updateShop', args => {
        $gameShops.updateShopItems(args.id);
    });

    PluginManager.registerCommand(pluginName, 'setShopLevel', args => {

    });

    TWLD.Shop.SHOP_MODE_SELL_AND_PURCHASE = 0;
    TWLD.Shop.SHOP_MODE_SELL_ONLY = 1;
    TWLD.Shop.SHOP_MODE_PURCHASE_ONLY = 2;


    TWLD.Shop._isBoughtAny = false;
    TWLD.Shop._isSoldAny = false;

    /**
     * 取引があったかどうかを判定して取得する。
     * @return {Boolean} 取引があった場合にはtrue, 取引が無かった場合にはfalse
     */
    TWLD.Shop.isTransacted = function() {
        return TWLD.Shop.isBoughtAny() || TWLD.Shop.isSoldAny();
    };

    /**
     * 購入があったかどうかを判定して取得する。
     * @return {Boolean} 購入があった場合にはtrue, 購入が無かった場合にはfalse.
     */
    TWLD.Shop.isBoughtAny = function() {
        return TWLD.Shop._isBoughtAny;
    };

    /**
     * 売却があったかどうかを判定して取得する。
     * @return {Boolean} 売却があった場合にはtrue, 売却がなかった場合にはfalse
     */
    TWLD.Shop.isSoldAny = function() {
        return TWLD.Shop._isSoldAny;
    };

    //------------------------------------------------------------------------------
    // DataManager
    DataManager._databaseFiles.push({ name:"$dataShops", src:"Shops.json" });

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;

    /**
     * セーブデータに入れるデータを構築する。
     * 
     * @return {Dictionary} 保存するコンテンツ
     */
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.shops = $gameShops;
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;

    /**
     * セーブデータから必要なコンテンツを展開する。
     * 
     * @param {Dictionary} contents コンテンツ
     */
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, ...arguments);
        var shops = contents.shops;
        if (shops) {
            $gameShops = shops;
        }
    };
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    /**
     * 必要なオブジェクトを構築する。
     */
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $gameShops = new Game_Shops();
    };

    //------------------------------------------------------------------------------
    // Game_Shop
    //
    /**
     * 店データ
     * @param {Number} id 店ID
     */
    function Game_Shop(id) {
        this._id = id; // Data shop id
        this._level = 1; // Shop Level
        this._transactionAmount = 0; // 取引金額
        this._itemList = [];
    }

    /**
     * 店データをセットアップする。
     * @param {Number} id ショップID
     */
    Game_Shop.prototype.setupShop = function(id) {
        var dataShop = $dataShops[id];
        this._id = id;
        this._level = dataShop.level;
        this._transactionAmount = 0;
        this.updateItems();
    };

    /**
     * この店の情報を提供するデータを取得する。
     * @return {Data_Shop} 店データ
     */
    Game_Shop.prototype.shopData = function() {
        return $dataShops[this._id];
    }

    /**
     * ショップレベルを返す。
     * @return {Number} ショップレベル。
     */
    Game_Shop.prototype.level = function() {
        return this._level;
    };

    /**
     * ショップレベルを設定する。
     * @param {Number} level ショップレベル
     */
    Game_Shop.prototype.setLevel = function(level) {
        this._level = level;
    }

    /**
     * 総取引金額を得る。
     * @return {Number} 総取引金額
     */
    Game_Shop.prototype.transactionAmount = function() {
        return this._transactionAmount;
    };

    /**
     * 商品を更新する。
     */
    Game_Shop.prototype.updateItems = function() {
        this._itemList = [];
        var dataShop = this.shopData();
        if (dataShop) {
            for (var i = 0; i < dataShop.itemList.length; i++) {
                var itemEntry = dataShop.itemList[i];
                if (this.testItemCondition(itemEntry)) {
                    // 条件が設定されてないか、条件が有効。
                    var numItems = Math.round(Math.random() * (itemEntry.maxCount - itemEntry.minCount) + itemEntry.minCount);
                    this.addItem(itemEntry.id, itemEntry.kind, numItems);
                }
            }
        }
        this._itemList.sort(function(a, b) {
            if (a.kind != b.kind) {
                return a.kind - b.kind;
            } else {
                return a.id - b.id;
            }
        });
    };

    /**
     * アイテム追加条件をテストする。
     * @param {ItemEntry} itemEntry アイテム
     * @return {Boolean} 有効な場合にはtrue, 無効な場合にはfalse
     */
    Game_Shop.prototype.testItemCondition = function(itemEntry) {
        if (itemEntry) {
            // eslint-disable-next-line no-unused-vars 
            var shopLevel = this.level();
            // eslint-disable-next-line no-unused-vars
            var tm = this.transactionAmount();
            return !itemEntry.condition || eval(itemEntry.condition);
        } else {
            return false;
        }
    };

    /**
     * id,kindで指定される品を販売品にnumItemsだけ追加する。
     * @param {Number} id アイテムID
     * @param {Number} kind アイテム種類。(1:Item, 2:Weapon, 3:Armor)
     * @param {Number} numItems 数量
     */
    Game_Shop.prototype.addItem = function(id, kind, numItems) {
        if (kind === 1) {
            var entry = this._itemList.find(function(e) {
                return (e.id == id) && (e.kind == kind);
            });
            if (entry) {
                entry.numItems = (entry.numItems + numItems).clamp(0, 99);
            } else {
                this._itemList.push({
                    id : id,
                    kind : kind,
                    numItems : numItems
                });
            }
        } else {
            for (var i = 0; i < numItems; i++) {
                this._itemList.push({
                    id : id,
                    kind : kind,
                    numItems : 1
                });
            }
        }
    };

    /**
     * 販売品の種類数を取得する。
     * @return {Number} 販売品の項目数
     */
    Game_Shop.prototype.itemCount = function() {
        return this._itemList.length;
    };

    /**
     * indexで指定されるアイテムを得る。
     * @param {Number} index インデックス番号
     * @return {Data_Item} アイテム。該当する項目がない場合にはnull
     */
    Game_Shop.prototype.item = function(index) {
        var itemEntry = this._itemList[index];
        if (itemEntry) {
            switch (itemEntry.kind) {
                case 1:
                    return $dataItems[itemEntry.id];
                case 2:
                    return $dataWeapons[itemEntry.id];
                case 3:
                    return $dataArmors[itemEntry.id];
            }
        }

        return null;
    };

    /**
     * 販売価格を得る
     * @param {Data_Item} item アイテム
     * @return {Number} 価格
     */
    Game_Shop.prototype.buyingPrice = function(item) {
        var itemEntry = this.getItemEntryByItem(item);
        if (itemEntry) {
            if (itemEntry.buyingPrice > 0) {
                return itemEntry.buyingPrice;
            }
        }
        var rate = this.shopData().buyingPriceRate || 1;
        return Math.floor(item.price * rate);
    };

    /**
     * 販売価格を得る。
     * @param {Data_Item} item アイテム
     * @return {Number} 販売価格
     */
    Game_Shop.prototype.sellingPrice = function(item) {
        var itemEntry = this.getItemEntryByItem(item);
        if (itemEntry) {
            if (itemEntry.sellingPrice > 0) {
                return itemEntry.sellingPrice;
            }
        }
        var rate = this.shopData().sellingPriceRate || 0.5;
        return Math.floor(item.price * rate);
    };

    /**
     * アイテムエントリを得る。
     * @param {*} item アイテム
     */
    Game_Shop.prototype.getItemEntryByItem = function(item) {
        var dataShop = this.shopData();
        var kind = 0;
        if (DataManager.isItem(item)) {
            kind = 1;
        } else if (DataManager.isWeapon(item)) {
            kind = 2;
        } else if (DataManager.isArmor(item)) {
            kind = 3;
        }
        var id = item.baseItemId || item.id;
        return dataShop.itemList.find(function(ie) {
            return (ie.kind === kind) && (ie.id === id);
        });
    };

    /**
     * 在庫品エントリを得る。
     * @param {Data_Item}} item アイテム
     * @return {*} 在庫品エントリ
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
     * 店から購入する。
     * @param {Data_Item} item 購入アイテム
     * @param {Number} num 数量
     */
    Game_Shop.prototype.buyItem = function(item, num) {
        var stokEntry = this.getStokEntry(item);
        if (stokEntry) {
            var totalPrice = this.buyingPrice(item) * num;
            this.gainTransactionAmount(totalPrice);
            stokEntry.numItems -= num;
            if (stokEntry.numItems <= 0) {
                var index = this._itemList.indexOf(stokEntry);
                this._itemList.splice(index, 1);
            }
        }
    };

    /**
     * 店に売却する。
     * @param {Data_Item}} item 売却アイテム
     * @param {Number} num 数量
     */
    Game_Shop.prototype.sellItem = function(item, num) {
        if (DataManager.isItem(item)) {
            // 通常アイテムで扱いがあるものならば、在庫を増やす。
            var stokEntry = this.getStokEntry(item);
            if (stokEntry) {
                stokEntry.numItems += num;
            } else {
                // 扱い品なら補充。
                var itemEntry = this.getItemEntryByItem(item);
                if (itemEntry) {
                    this._itemList.push({
                        id : itemEntry.id,
                        kind : itemEntry.kind,
                        numItems : num
                    });
                }
            }
        }

        var totalPrice = this.sellingPrice(item) * num;
        this.gainTransactionAmount(totalPrice);
    };

    /**
     * 取引金額を加算する。
     * @param {Number} price 金額
     */
    Game_Shop.prototype.gainTransactionAmount = function(price) {
        // 加算してってオーバーフローしないようにね。
        // めちゃくちゃ大きな値がいきなり指定されてオーバーフローする可能性あるけど、
        // そんなことまずないだろうと想定してみ視する。
        if (price > 0) {
            var t = this._transactionAmount + price;
            this._transactionAmount = t.clamp(0, $gameParty.maxGold());
        }
    }

    /**
     * アイテムの在庫数を得る。
     * @param {Data_Item} item アイテム
     * @return {Number} アイテムの在庫数
     */
    Game_Shop.prototype.stok = function(item) {
        var kind = 0;
        if (DataManager.isItem(item)) {
            kind = 1;
        } else if (DataManager.isWeapon(item)) {
            kind = 2;
        } else if (DataManager.isArmor(item)) {
            kind = 3;
        }
        var id = DataManager.isIndependent(item.id) ? item.baseItemId : item.id;
        var itemEntry = this._itemList.find(function(ie) {
            return (ie.id == id) && (ie.kind == kind);
        });
        return (itemEntry) ? itemEntry.numItems : 0;
    };


    //------------------------------------------------------------------------------
    // Game_Shops
    //
    function Game_Shops() {
        this.initialize.apply(this);
    }

    /**
     * Game_Shopsオブジェクトを初期化する。
     */
    Game_Shops.prototype.initialize = function() {
        this._shopData = [];
    };

    /**
     * ショップデータを取得する。
     * idで指定されている店が未作成なら、作成して返す。
     * @param {Number} id 店ID
     */
    Game_Shops.prototype.getShop = function(id) {
        if (!this._shopData[id]) {
            // 店が作られてない。
            this._shopData[id] = new Game_Shop(id);
            this._shopData[id].setupShop(id);
        }
        return this._shopData[id];
    };

    /**
     * ショップデータを更新する。
     * 未作成のショップは更新されない。
     * @param {Number} id 更新対象の店ID。0は存在する店全部。
     */
    Game_Shops.prototype.updateShopItems = function(id) {
        if (id) {
            var shop = this._shopData[id];
            if (shop !== null) {
                // 作成済みの場合のみ更新する。
                shop.updateItems();
            }
        } else {
            for (var i = 1; i < this._shopData; i++) {
                if (this._shopData[id]) {
                    // 作成済みのショップデータのみ更新する。
                    this._shopData[id].updateItems();
                }
            }
        }
    };

    /**
     * 店のレベルを設定する。
     * @param {Number}} id 店ID
     * @param {Number} level 店レベル
     */
    Game_Shops.prototype.setShopLevel = function(id, level) {
        var shop = this.getShop(id);
        shop.setLevel(level);
    };

    //------------------------------------------------------------------------------
    // Window_TwldShopBuy
    //    販売品一覧
    function Window_TwldShopBuy() {
        this.initialize.apply(this, arguments);
    }

    Window_TwldShopBuy.prototype = Object.create(Window_Selectable.prototype);
    Window_TwldShopBuy.prototype.constructor = Window_TwldShopBuy;

    /**
     * Window_TwldShopBuyを構築する。
     * @param {Number} x ウィンドウx位置
     * @param {Number} y ウィンドウy位置
     * @param {Number} width ウィンドウ幅
     * @param {Number} height 高さ
     * @param {Game_Shop} shop ショップ
     */
    Window_TwldShopBuy.prototype.initialize = function(x, y, width, height, shop) {
        this._shop = shop;
        this._money = 0;
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.select(0);
    };

    /**
     * ウィンドウ幅を得る。
     * @return {Number} ウィンドウ幅
     */
    Window_TwldShopBuy.prototype.windowWidth = function() {
        return 456;
    };

    /**
     * 最大項目数を得る。
     * @return {Number} 最大項目数
     */
    Window_TwldShopBuy.prototype.maxItems = function() {
        return this._shop.itemCount();
    };

    /**
     * 選択されているアイテムを得る。
     * @return {Game_Item} アイテム。未選択時はnull。
     */
    Window_TwldShopBuy.prototype.item = function() {
        return this._shop.item(this.index());
    };

    /**
     * 所持金をセットする。
     * @param {Number} money 所持金
     */
    Window_TwldShopBuy.prototype.setMoney = function(money) {
        this._money = money;
        this.refresh();
    };

    /**
     * 在庫数を得る。
     * @param {Data_Item} item アイテム
     * @return {Number} 在庫数
     */
    Window_TwldShopBuy.prototype.stok = function(item) {
        return this._shop.stok(item);
    };

    /**
     * 価格を取得する。
     * @param {Data_Item}} item アイテム
     * @return {Number} 価格
     */
    Window_TwldShopBuy.prototype.price = function(item) {
        return this._shop.buyingPrice(item);
    };

    /**
     * itemが選択可能かどうかを判定する。
     * @param {Data_Item}} item アイテム
     * @return {Boolean} 選択可能な場合にはtrue, それ以外はfalse
     */
    Window_TwldShopBuy.prototype.isEnabled = function(item) {
        return (item && (this.price(item) <= this._money)
                && !$gameParty.hasMaxItems(item));
    };

    /**
     * 更新する。
     */
    Window_TwldShopBuy.prototype.refresh = function() {
        this.contents.clear();
        if (this.index() >= this.maxItems()) {
            this.select(this.maxItems() - 1);
        }
        this.drawAllItems();
    };

    /**
     * 項目を描画する。
     * @param {Number}} index インデックス
     */
    Window_TwldShopBuy.prototype.drawItem = function(index) {
        var item = this._shop.item(index);
        if (item) {
            var rect = this.itemRect(index);
            var priceWidth = 96;
            var numWidth = 64;
            var nameWidth = rect.width - numWidth - priceWidth;
            rect.width -= this.textPadding();
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, nameWidth);
            this.drawText('在庫:' + this.stok(item), rect.x + nameWidth, rect.y, numWidth, 'right');
            this.drawText(this.price(item), rect.x + nameWidth + numWidth,
                          rect.y, priceWidth, 'right');
            this.changePaintOpacity(true);
        }
    };


    //------------------------------------------------------------------------------
    // Scene_TwldShop
    // ショップの処理をする。
    //
    function Scene_TwldShop() {
        this.initialize.apply(this,arguments);
    }

    Scene_TwldShop.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_TwldShop.prototype.constructor = Scene_TwldShop;

    Scene_TwldShop.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    /**
     * シーンを作成する準備をする。
     * @param {Number} id 店ID番号
     * @param {Number} mode ショップモード
     * @param {String} clerkFileName 店員画像ファイル名。店員画像が無い場合にはnull
     */
    Scene_TwldShop.prototype.prepare = function(id, mode, clerkFileName) {
        this._shop = $gameShops.getShop(id); // Game_Shopオブジェクト
        this._mode = mode;
        this._clerkFileName = clerkFileName || '';
    };

    /**
     * シーンを作成する。
     */
    Scene_TwldShop.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createBuyWindow();
        this.createSellWindow();
        this.createCategoryWindow();
        this.createNumberWindow();
        this.loadClerkPicture();
    };

    /**
     * ヘルプウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Help(3);
        this.addWindow(this._helpWindow);
    };

    /**
     * 所持金ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createGoldWindow = function() {
        var x = 0; // xはウィンドウ作成後に移動させる。暫定で0。
        var y = this._helpWindow.height;
        this._goldWindow = new Window_Gold(x, y);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this.addWindow(this._goldWindow);
    };
    /**
     * コマンドウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createCommandWindow = function() {
        var commandList = [];
        commandList.push(new GenericCommand(TextManager.buy, 'buy', this.isEnableBuy()));
        commandList.push(new GenericCommand(TextManager.sell, 'sell', this.isEnableSell()));
        commandList.push(new GenericCommand(TextManager.cancel, 'cancel', true));

        var x = this._goldWindow.x;
        var y = this._goldWindow.y + this._goldWindow.height;
        var width = this._goldWindow.width;
        this._commandWindow = new Window_CommandGeneric(x, y, commandList, width);
        this._commandWindow.setHandler('ok',     this.onCommandOk.bind(this));
        this._commandWindow.setHandler('cancel', this.onCommandCancel.bind(this));
        this.addWindow(this._commandWindow);
    };

    /**
     * 購入ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createBuyWindow = function() {
        var x = 0;
        var y = this._helpWindow.height;
        var width = 456;
        var height = Graphics.boxHeight - y;
        this._buyWindow = new Window_TwldShopBuy(x, y, width, height, this._shop);
        this._buyWindow.hide();
        this._buyWindow.setHandler('ok', this.onBuyOk.bind(this));
        this._buyWindow.setHandler('cancel', this.onBuyCancel.bind(this));
        this._buyWindow.setHandler('itemchange', this.onBuyItemChange.bind(this));
        this.addWindow(this._buyWindow);
    };

    /**
     * 売却アイテム選択用ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createSellWindow = function() {
        var x = 0;
        var y = this._helpWindow.height;
        var width = Graphics.boxWidth - this._commandWindow.width;
        var height = Graphics.boxHeight - y;
        this._sellWindow = new Window_ShopSell(x, y, width, height);
        this._sellWindow.hide();
        this._sellWindow.setHandler('ok', this.onSellOk.bind(this));
        this._sellWindow.setHandler('cancel', this.onSellCancel.bind(this));
        this._sellWindow.setHandler('itemchange', this.onSellItemChange.bind(this));
        this.addWindow(this._sellWindow);
    };

    /**
     * 売却物品のカテゴリ選択ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createCategoryWindow = function() {
        var commandList = [];
        commandList.push(new GenericCommand(TextManager.item, 'item', true));
        commandList.push(new GenericCommand(TextManager.weapon, 'weapon', true));
        commandList.push(new GenericCommand(TextManager.armor, 'armor', true));
        commandList.push(new GenericCommand(TextManager.keyItem, 'keyItem', true));

        var x = this._commandWindow.x;
        var y = this._commandWindow.y + this._commandWindow.height;
        var width = 240;
        this._categoryWindow = new Window_CommandGeneric(x, y, commandList, width);
        this._categoryWindow.deactivate();
        this._categoryWindow.hide();
        this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
        this._categoryWindow.setHandler('itemchange', this.onCategoryItemChange.bind(this));
        this.addWindow(this._categoryWindow);
    };

    /**
     * 数値入力ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createNumberWindow = function() {
        var x = 0;
        var y = 0;
        var height = 240;
        this._numberWindow = new Window_ShopNumber(x, y, height);
        this._numberWindow.x = (Graphics.boxWidth - this._numberWindow.width) / 2;
        this._numberWindow.y = (Graphics.boxHeight - this._numberWindow.height) / 2;
        this._numberWindow.hide();
        this._numberWindow.setHandler('ok', this.onNumberOk.bind(this));
        this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    };

    /**
     * 店員のイメージを作成する。
     */
    Scene_TwldShop.prototype.loadClerkPicture = function() {
        if (this._clerkFileName) {
            this._clerkBitmap = ImageManager.loadPicture(this._clerkFileName, 0);
            if (!this._clerkBitmap.isReady()) {
                // デカいファイルだと読み出しがすぐに完了しない？
                // それともupdate()で進まないとキャッシュされない？
                // いずれにせよ初回読み出しが上手くいかない奴らがいる。
                this._clerkBitmap.addLoadListener(this.addClerkSprite.bind(this));
            } else {
                this.addClerkSprite();
            }
        }
    }

    /**
     * 店員画像を追加する。
     */
    Scene_TwldShop.prototype.addClerkSprite = function() {
        console.log('clerk bitmap loaded.');
        this._clerkSprite = new Sprite();
        this._clerkSprite.bitmap = this._clerkBitmap;
        this._clerkSprite.x = Graphics.boxWidth - this._clerkBitmap.width;
        this._clerkSprite.y = Graphics.boxHeight - this._clerkBitmap.height;
        this._backgroundSprite.addChild(this._clerkSprite);
    };
    /**
     * 購入操作が可能かどうかを判定する。
     * @return {Boolean} 購入操作ができる場合にはtrue, できない場合にはfalse
     */
    Scene_TwldShop.prototype.isEnableBuy = function() {
        return ((this._mode === TWLD.Sh.SHOP_MODE_SELL_AND_PURCHASE)
                || (this._mode === TWLD.Sh.SHOP_MODE_PURCHASE_ONLY));
    };

    /**
     * 販売操作が可能かどうかを判定する。
     * @return {Boolean} 売却操作ができる場合にはtrue, できない場合にはfalse
     */
    Scene_TwldShop.prototype.isEnableSell = function() {
        return ((this._mode === TWLD.Sh.SHOP_MODE_SELL_AND_PURCHASE)
                || (this._mode === TWLD.Sh.SHOP_MODE_SELL_ONLY));
    };

    /**
     * 購入可能な最大数を得る。
     */
    Scene_TwldShop.prototype.maxBuy = function() {
        var item = this._item;
        // 持てる最大数
        var canHaveMax = this.canHaveMax(item);
        // 在庫数
        var stok = this._shop.stok(item);
        var max = Math.min(canHaveMax, stok);
        var price = this.buyingPrice();
        if (price > 0) {
            return Math.min(max, Math.floor(this.money() / price));
        } else {
            return max;
        }
    };

    /**
     * 所持できる最大数を得る。
     * @param {Data_Item} item アイテム
     */
    Scene_TwldShop.prototype.canHaveMax = function(item) {
        if (DataManager.isIndependent(item)) {
            if (DataManager.isItem(item)) {
                return $gameParty.getIndependentItemTypeMax(item)
                        - $gameParty.getIndependentItemTypeCur(item);
            } else if (DataManager.isWeapon(item)) {
                return 1;
            } else if (DataManager.isArmor(item)) {
                return 1;
            }
        } else {
            return $gameParty.maxItems(item) - $gameParty.numItems(item);
        }
    };


    /**
     * 最大売却数を取得する。
     * @return {Number} 最大売却数
     */
    Scene_TwldShop.prototype.maxSell = function() {
        if (DataManager.isIndependent(this._item)) {
            return 1;
        } else {
            return $gameParty.numItems(this._item);
        }
    }

    /**
     * 所持金を得る。
     * @return {Number} 所持金
     */
    Scene_TwldShop.prototype.money = function() {
        return this._goldWindow.value();
    };


    /**
     * 所持金単位を得る。
     * @return {String} 所持金の単位。
     */
    Scene_TwldShop.prototype.currencyUnit = function() {
        return this._goldWindow.currencyUnit();
    };

    /**
     * 購入金額を得る。
     * @return {Number} 購入金額
     */
    Scene_TwldShop.prototype.buyingPrice = function() {
        return this._buyWindow.price(this._item);
    };
    
    /**
     * 売却金額を得る。
     * @return {Number} 売却金額
     */
    Scene_TwldShop.prototype.sellingPrice = function() {
        return this._shop.sellingPrice(this._item);
    };

    /**
     * シーンを開始する。
     */
    Scene_TwldShop.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._goldWindow.refresh();
        this._helpWindow.show();
        this._goldWindow.show();
        this._commandWindow.show();
        this._commandWindow.activate();
    };

    /**
     * コマンドウィンドウでOK操作をされたときの処理を行う。
     */
    Scene_TwldShop.prototype.onCommandOk = function() {
        switch (this._commandWindow.currentSymbol()) {
            case 'buy':
                this._commandWindow.deactivate();
                this._helpWindow.setItem(this._buyWindow.item());
                this._buyWindow.setMoney(this.money());
                this._buyWindow.refresh();
                this._buyWindow.show();
                this._buyWindow.activate();
                break;
            case 'sell':
                this._commandWindow.deactivate();
                this._sellWindow.setCategory(this._categoryWindow.currentSymbol());
                this._sellWindow.show();
                this._sellWindow.deactivate();
                this._categoryWindow.show();
                this._categoryWindow.activate();
                break;
        }
    };

    /**
     * コマンドウィンドウでキャンセル操作をされたときの処理を行う。
     */
    Scene_TwldShop.prototype.onCommandCancel = function() {
        this.popScene();
    };

    /**
     * 購入品選択ウィンドウでOK操作されたときの処理を行う。
     */
    Scene_TwldShop.prototype.onBuyOk = function() {
        this._buyWindow.deactivate();
        this._item = this._buyWindow.item();
        this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
    };


    /**
     * 購入品選択ウィンドウでキャンセル操作されたときの処理を行う。
     */
    Scene_TwldShop.prototype.onBuyCancel = function() {
        this._helpWindow.clear();
        this._buyWindow.deactivate();
        this._buyWindow.hide();
        this._commandWindow.activate();

    };

    /**
     * 購入品選択ウィンドウで項目の選択が変更されたときの処理を行う。
     */
    Scene_TwldShop.prototype.onBuyItemChange = function() {
        this._helpWindow.setItem(this._buyWindow.item());
    };

    /**
     * 売却品カテゴリ選択画面でOK操作された時の処理を行う。
     */
    Scene_TwldShop.prototype.onCategoryOk = function() {
        // 販売品カテゴリウィンドウを消去し、
        // 販売品選択ウィンドウをアクティブ化
        this._categoryWindow.deactivate();
        this._sellWindow.select(0);
        this._helpWindow.setItem(this._sellWindow.item());
        this._sellWindow.activate();
    };

    /**
     * 売却品カテゴリ選択画面でキャンセル操作された時の処理を行う。
     */
    Scene_TwldShop.prototype.onCategoryCancel = function() {
        // 販売品選択ウィンドウ及び販売品カテゴリウィンドウを消去し、
        // コマンドウィンドウをアクティブ化
        this._categoryWindow.deactivate();
        this._sellWindow.hide();
        this._categoryWindow.hide();
        this._commandWindow.activate();
    };

    /**
     * 売却品カテゴリ選択画面で選択が変更されたときの処理を行う。
     */
    Scene_TwldShop.prototype.onCategoryItemChange = function() {
        this._sellWindow.setCategory(this._categoryWindow.currentSymbol());
    };

    /**
     * 売却品選択画面でOKボタンが押された時の処理を行う。
     */
    Scene_TwldShop.prototype.onSellOk = function() {
        // 販売数量選択画面を表示する。
        this._item = this._sellWindow.item();
        this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();    
    };

    /**
     * 売却品選択画面でCancelボタンが押された時の処理を行う。
     */
    Scene_TwldShop.prototype.onSellCancel = function() {
        // カテゴリウィンドウを表示してアクティブ化
        this._helpWindow.clear();
        this._categoryWindow.show();
        this._sellWindow.deactivate();
        this._categoryWindow.activate();
    };

    /**
     * 売却画面で選択項目が変更されたときの処理を行う。
     */
    Scene_TwldShop.prototype.onSellItemChange = function() {
        this._helpWindow.setItem(this._sellWindow.item());
    };

    /**
     * 数量選択でOK操作されたときの処理を行う。
     */
    Scene_TwldShop.prototype.onNumberOk = function() {
        // シャリーン
        SoundManager.playShop();
        switch (this._commandWindow.currentSymbol()) {
            case 'buy':
                this.doBuy(this._numberWindow.number());
                break;
            case 'sell':
                this.doSell(this._numberWindow.number());
                break;
        }
        this._numberWindow.hide();
        this._numberWindow.deactivate();
        this._goldWindow.refresh();
        this.onTransactionEnd();
    };

    /**
     * 数量選択でキャンセル操作されたときの処理を行う。
     */
    Scene_TwldShop.prototype.onNumberCancel = function() {
        this.onTransactionCancel();
    };

    /**
     * 購入処理する。
     * @param {Number}} number 数量
     */
    Scene_TwldShop.prototype.doBuy = function(number) {
        var totalPrice = number * this.buyingPrice();
        $gameParty.loseGold(totalPrice);
        $gameParty.gainItem(this._item, number);
        this._shop.buyItem(this._item, number);
        TWLD.isBoughtAny = true;
    };

    /**
     * 売却処理する。
     * @param {Number} number 数量
     */
    Scene_TwldShop.prototype.doSell = function(number) {
        var totalPrice = number * this.sellingPrice();
        $gameParty.gainGold(totalPrice);
        $gameParty.loseItem(this._item, number);
        this._shop.sellItem(this._item, number);
        TWLD.Sh.isSoldAny = true;
    };

    /**
     * 1回の購入処理が終わったときの処理を行う。
     */
    Scene_TwldShop.prototype.onTransactionEnd = function() {
        this._numberWindow.hide();
        switch (this._commandWindow.currentSymbol()) {
            case 'buy':
                this._buyWindow.refresh();
                this._helpWindow.setItme(this._buyWindow.item());
                this._buyWindow.activate();
                break;
            case 'sell':
                this._sellWindow.refresh();
                this._helpWindow.setItem(this._sellWindow.item());
                this._sellWindow.activate();
                break;
        }
    };

    /**
     * 数値入力がキャンセルされた時の処理を行う。
     */
    Scene_TwldShop.prototype.onTransactionCancel = function() {
        this._numberWindow.hide();
        switch (this._commandWindow.currentSymbol()) {
            case 'buy':
                this._buyWindow.activate();
                break;
            case 'sell':
                this._sellWindow.activate();
                break;
        }
    };
})();