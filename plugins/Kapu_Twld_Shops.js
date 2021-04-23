/*:ja
 * @target MZ 
 * @plugindesc TWLDシステム向けに作成したショッププラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command openShop
 * @text ショップを開く
 * @desc 指定したIDのお店の売買シーンを開始します。
 *
 * @arg id
 * @text ショップID
 * @desc ショップのID番号
 * @type number
 * 
 * @arg variableId
 * @text 変数ID
 * @desc ショップを変数で指定する場合の変数番号。
 * @type variable
 * 
 * @arg mode
 * @text モード
 * @desc 店のモード
 * @type select
 * @option 購入・売却可
 * @value 0
 * @option 購入のみ
 * @value 1
 * @option 売却のみ
 * @value 2
 * 
 * @arg clerkFileName
 * @text 店員画像
 * @desc 店員として表示する画像ファイル名。既定ではコマンドウィンドウ下の方に表示される。
 * @dir img/pictures/
 * @type file
 * 
 * @arg clerkOffsetX
 * @text 店員画像表示位置X
 * @desc 店員画像を表示する位置を移動させる。10を設定すると右に10移動する。
 * @type number
 * @default 0
 * @min -10000
 * 
 * @arg clerkOffsetY
 * @text 店員画像表示位置Y
 * @desc 店員画像を表示する位置を移動させる。10を設定すると下に10移動する。
 * @type number
 * @default 0
 * @min -10000
 * 
 * 
 * 
 * @command updateShop
 * @text 品揃えを更新
 * @desc 指定したIDのお店の品揃えを更新します。0だと全ての店。
 *
 * @arg id
 * @text ショップID
 * @desc ショップのID番号。0だと全ての店。
 * @type number
 * @default 1
 * 
 * @arg variableId
 * @text 変数ID
 * @desc ショップを変数で指定する場合の変数番号。
 * @type variable
 * 
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
 * @arg variableId
 * @text 変数ID
 * @desc ショップを変数で指定する場合の変数番号。
 * @type variable
 *
 * @arg level
 * @text ショップレベル
 * @desc 設定するショップレベル。
 * @type number
 * @default 1
 * 
 * @command addItemStock
 * @text 在庫追加
 * @desc 指定したお店に在庫を追加します。
 * 
 * @arg id
 * @text ショップID
 * @desc ショップのID番号
 * @type number
 * @default 1
 * 
 * @arg variableId
 * @text 変数ID
 * @desc ショップを変数で指定する場合の変数番号。
 * @type variable
 * 
 * @arg itemId
 * @text アイテム
 * @desc 追加するアイテム
 * @type item
 * 
 * @arg weaponId
 * @text 武器
 * @desc 追加する武器
 * @type weapon
 * 
 * @arg armorId
 * @text 防具
 * @desc 追加する防具
 * @type armor
 * 
 * @arg num
 * @text 個数
 * @desc 追加する数
 * @type number
 * @min -1000
 * 
 * @arg numVariableId
 * @text 個数（変数指定）
 * @desc 追加する数
 * @type variable
 * 
 * 
 * 
 * @param labelStock
 * @text 在庫数ラベル名
 * @desc 購入品リストの在庫数表記に使用する文字列
 * @type string
 * @default 在庫
 * 
 * @param maxShopStock
 * @text 最大在庫数
 * @desc 1つの店に置ける在庫数の最大値
 * @type number
 * @default 99
 * @min 0
 * @max 9999
 * 
 * @param defaultSellingPriceRate
 * @text デフォルト売却レート
 * @desc 店に売却価格レートが指定されていないときの、売却レート
 * @type number
 * @decimals 2
 * @default 0.5
 * 
 * @param defaultTextHelpBuy
 * @text 購入時ヘルプメッセージ
 * @type string
 * @default 品物を購入します。
 * 
 * @param defaultTextHelpSell
 * @text 売却時ヘルプメッセージ
 * @type string
 * @default 所持品を売却します。
 * 
 * @param defaultTextHelpCancel
 * @text キャンセル時ヘルプメッセージ。
 * @type string
 * @default 購買を中止します。
 * 
 * @help 
 * TWLDシステム向けに作成したショップです。
 * 
 * 
 * 
 * openShopコール後、以下のメソッドで条件分岐できる。
 * $gameTemp.isShopTransacted()
 *      直前のショップ処理にて取引が行われたかどうかを取得する。
 * $gameTemp.isShopBoughtAny()
 *      直前のショップ処理にて、店からの購入が行われたかどうかを取得する。
 * $gameTemp.isShopSoldAny()
 *      直前のショップ処理にて、店への売却が行われたかどうかを取得する。
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
 * 店データにノートタグを設定できます。
 *   <helpBuy:text>
 *     購入コマンドに対するヘルプ。
 *   <helpSell:text>
 *     売却コマンドに対するヘルプ。
 *   <helpCancel:text>
 *     キャンセルコマンドに対するヘルプ。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 TWLD向けに作成したものを移植。
 */

/**
 * Shopデータ。
 * Game_Shopsが格納される。
 */
$gameShops = null;

/**
 * 店データオブジェクト
 */
function Game_Shop() {
    this.initialize(...arguments);
}
/**
 * Game_Shops.
 * Game_Shopの配列。
 */
function Game_Shops() {
    this.initialize(...arguments);
}
/**
 * Window_TwldShopwCommand
 * TwldShopのコマンドウィンドウ。
 */
function Window_TwldShopCommand() {
    this.initialize(...arguments);
}

/**
 * Window_TwldShopBuy
 * 
 * 店売り品のウィンドウ。
 */
function Window_TwldShopBuy() {
    this.initialize(...arguments);
}

/**
 * Window_TwldShopItemCategory
 * 
 * ウィンドウショップのアイテムカテゴリ選択ウィンドウ
 */
function Window_TwldShopItemCategory() {
    this.initialize(...arguments);
}

/**
 * Window_TwldShopNumber
 * 
 * 数値入力用ウィンドウ
 */
function Window_TwldShopNumber() {
    this.initialize(...arguments);
}

/**
 * Scene_TwldShop.
 * 
 * 店の処理をするシーン。
 */
function Scene_TwldShop() {
    this.initialize(...arguments);
}



(() => {
    "use strict";

    const pluginName = "Kapu_Twld_Shops";
    const parameters = PluginManager.parameters(pluginName);

    const labelStock = String(parameters["labelStock"]) || "Stock";
    const maxShopStock = Number(parameters["maxShopStock"]) || 99;
    const defaultSellingPriceRate = (Number(parameters["defaultSellingPriceRate"]) || 0.5).clamp(0, 1.0);
    const defaultTextHelpBuy = parameters["defaultTextHelpBuy"] || "";
    const defaultTextHelpSell = parameters["defaultTextHelpSell"] || "";
    const defaultTextHelpCancel = parameters["defaultTextHelpCancel"] || "";

    /**
     * ショップIDを得る。
     * 
     * @param {Object} args 
     */
    const _getShopId = function(args) {
        const shopId = Number(args.id) || 0;
        const variableId = Number(args.variableId) || 0;
        if (shopId > 0) {
            return shopId;
        } else if (variableId > 0) {
            return $gameVariables.value(variableId);
        } else {
            return 0;
        }
    };

    PluginManager.registerCommand(pluginName, "openShop", args => {
        const id = _getShopId(args);
        let clerkFileName = String(args.clerkFileName) || "";
        if (clerkFileName.includes("/")) {
            if (clerkFileName.startsWith("pictures/")) {
                clerkFileName = clerkFileName.substr(9);
            } else {
                clerkFileName = "";
            }
        }
        const clerkOffsetX = Number(args.clerkOffsetX) || 0;
        const clerkOffsetY = Number(args.clerkOffsetY) || 0;
        const mode = Number(args.mode) || Game_Shop.SHOP_MODE_SELL_AND_PURCHASE;
        if (id && id < $dataShops.length) {
            SceneManager.push(Scene_TwldShop);
            SceneManager.prepareNextScene(id, mode, clerkFileName, clerkOffsetX, clerkOffsetY);
        }
    });
    
    PluginManager.registerCommand(pluginName, "updateShop", args => {
        const id = _getShopId(args);
        if ((id >= 0) && id < $dataShops.length) {
            $gameShops.updateShopItems(id);
        }
    });

    PluginManager.registerCommand(pluginName, "setShopLevel", args => {
        const id = _getShopId(args);
        const level = Number(args.level) || 0;
        if (id && id < $dataShops.length) {
            $gameShops.setShopLevel(id, level);
        }
    });

    /**
     * 数を得る。
     * 
     * @param {Object} args 引数
     */
    const _getNum = function(args) {
        const num = Number(args.num) || 0;
        const numVariableId = Number(args.numVariableId) || 0;
        if (num > 0) {
            return num;
        } else if (numVariableId > 0) {
            return $gameVariables[numVariableId];
        } else {
            return 0;
        }
    };

    PluginManager.registerCommand(pluginName, "addItemStock", args => {
        const id = _getShopId(args);
        const itemId = Number(args.itemId) || 0;
        const weaponId = Number(args.weaponId) || 0;
        const armorId = Number(args.armorId) || 0;
        const num = _getNum(args);
        if (id && id < $dataShops.length) {
            const shop = $gameShops.shop(id);
            if (shop) {
                if ((itemId > 0) && (num !== 0)) {
                    shop.gainItemStock(itemId, 1, num);
                }
                if ((weaponId > 0) && (num !== 0)) {
                    shop.gainItemStock(weaponId, 2, num);
                }
                if ((armorId > 0) && (num !== 0)) {
                    shop.gainItemStock(armorId, 3, num);
                }
            }
        }
    });

    Game_Shop.SHOP_MODE_SELL_AND_PURCHASE = 0;
    Game_Shop.SHOP_MODE_PURCHASE_ONLY = 1;
    Game_Shop.SHOP_MODE_SELL_ONLY = 2;


    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._isBoughtAny = false;
        this._isSoldAny = false;
    };

    /**
     * ショップでの取引有無状態をリセットする。
     */
    Game_Temp.prototype.resetShopTransaction = function() {
        this._isBoughtAny = false;
        this._isSoldAny = false;
    };
    /**
     * 取引があったかどうかを判定して取得する。
     * 
     * @return {Boolean} 取引があった場合にはtrue, 取引が無かった場合にはfalse
     */
    Game_Temp.prototype.isShopTransacted = function() {
        return this.isBoughtAny() || this.isSoldAny();
    };


    /**
     * 店からの購入があったかどうかを判定して取得する。
     * 
     * @return {Boolean} 購入があった場合にはtrue, 購入が無かった場合にはfalse.
     */
    Game_Temp.prototype.isShopBoughtAny = function() {
        return this._isBoughtAny;
    };

    /**
     * 店からの購入があったことを設定する。
     */
    Game_Temp.prototype.setShopBoughtAny = function() {
        this._isBoughtAny = true;
    };

    /**
     * 店への売却があったかどうかを判定して取得する。
     * 
     * @return {Boolean} 売却があった場合にはtrue, 売却がなかった場合にはfalse
     */
    Game_Temp.prototype.isShopSoldAny = function() {
        return this._isSoldAny;
    };

    /**
     * 店への売却があったことを設定する。
     */
    Game_Temp.prototype.setShopSoldAny = function() {
        this._isSoldAny = true;
    };


    //------------------------------------------------------------------------------
    // Scene_Shop
    // 取引有無フラグだけ操作する。

    const _Scene_Shop_start = Scene_Shop.prototype.start;
    /**
     * Scene_Shopを開始する。
     */
    Scene_Shop.prototype.start = function() {
        _Scene_Shop_start.call(this);
        $gameTemp.resetShopTransaction();
    };

    const _Scene_Shop_doBuy = Scene_Shop.prototype.doBuy;
    /**
     * 購入処理をする。
     * 
     * @param {Number} number 個数
     */
    Scene_Shop.prototype.doBuy = function(number) {
        _Scene_Shop_doBuy.call(this, number);
        $gameTemp.setShopBoughtAny();
    };

    const _Scene_Shop_doSell = Scene_Shop.prototype.doSell;
    /**
     * 売却処理をする。
     * 
     * @param {Number} number 個数
     */
    Scene_Shop.prototype.doSell = function(number) {
        _Scene_Shop_doSell.call(this, number);
        $gameTemp.setShopSoldAny();
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
        const shops = contents.shops;
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
     * Game_Shopオブジェクトを初期化する。
     * 
     */
    Game_Shop.prototype.initialize = function() {
        this._id = 0; // Data shop id
        this._level = 1; // Shop Level
        this._transactionAmount = 0; // 取引金額
        this._itemList = [];
    };

    /**
     * 店データをセットアップする。
     * 
     * @param {Number} id ショップID
     */
    Game_Shop.prototype.setup = function(id) {
        const shop = $dataShops[id];
        this._id = id;
        this._level = shop.level;
        this._transactionAmount = 0;
        this.updateItems();
    };

    /**
     * この店の情報を提供するデータを取得する。
     * 
     * @return {Data_Shop} 店データ
     */
    Game_Shop.prototype.shop = function() {
        return $dataShops[this._id];
    }

    /**
     * ショップレベルを返す。
     * 
     * @return {Number} ショップレベル。
     */
    Game_Shop.prototype.level = function() {
        return this._level;
    };

    /**
     * ショップレベルを設定する。
     * 
     * @param {Number} level ショップレベル
     */
    Game_Shop.prototype.setLevel = function(level) {
        this._level = level;
    }

    /**
     * 総取引金額を得る。
     * 
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
        const dataShop = this.shop();
        if (dataShop) {
            for (const itemEntry of dataShop.itemList) {
                if (this.testItemCondition(itemEntry)) {
                    // 条件が設定されてないか、条件が有効。
                    const numItems = this.addStockCount(itemEntry);
                    this.gainItemStock(itemEntry.id, itemEntry.kind, numItems);
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
     * 追加する在庫数を得る。
     * 
     * @param {ItemEntry} itemEntry アイテムエントリ
     */
    Game_Shop.prototype.addStockCount = function(itemEntry) {
        const variance = itemEntry.maxCount - itemEntry.minCount;
        return Math.randomInt(variance + 1) + itemEntry.minCount;
    };

    /**
     * アイテム追加条件をテストする。
     * 
     * @param {ItemEntry} itemEntry アイテム
     * @return {Boolean} 有効な場合にはtrue, 無効な場合にはfalse
     */
    Game_Shop.prototype.testItemCondition = function(itemEntry) {
        if (itemEntry) {
            // eslint-disable-next-line no-unused-vars 
            const shopLevel = this.level();
            // eslint-disable-next-line no-unused-vars
            const tm = this.transactionAmount();
            return !itemEntry.condition || eval(itemEntry.condition);
        } else {
            return false;
        }
    };

    /**
     * id,kindで指定される品を販売品にnumItemsだけ追加する。
     * 
     * @param {Number} id アイテムID
     * @param {Number} kind アイテム種類。(1:Item, 2:Weapon, 3:Armor)
     * @param {Number} numItems 数量
     */
    Game_Shop.prototype.gainItemStock = function(id, kind, numItems) {
        const entry = this._itemList.find(e => (e.id == id) && (e.kind == kind));
        if (entry) {
            entry.numItems = (entry.numItems + numItems).clamp(0, maxShopStock);
            if (entry.numItems === 0) {
                // 在庫数がゼロになったら、エントリは削除
                this._itemList.splice(this._itemList.indexOf(entry), 1);
            }
        } else if (numItems > 0) {
            this._itemList.push({
                id : id,
                kind : kind,
                numItems : numItems
            });
        }
    };

    /**
     * 販売品の種類数を取得する。
     * 
     * @return {Number} 販売品の項目数
     */
    Game_Shop.prototype.itemCount = function() {
        return this._itemList.length;
    };

    /**
     * indexで指定されるアイテムを得る。
     * 
     * @param {Number} index インデックス番号
     * @return {Data_Item} アイテム。該当する項目がない場合にはnull
     */
    Game_Shop.prototype.itemAt = function(index) {
        const itemEntry = this._itemList[index];
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
     * この店からの購入価格を得る。
     * 
     * @param {Data_Item} item アイテム
     * @return {Number} 価格
     */
    Game_Shop.prototype.buyingPrice = function(item) {
        const itemEntry = this.getItemEntryByItem(item);
        if (itemEntry) {
            if (itemEntry.buyingPrice > 0) {
                return itemEntry.buyingPrice;
            }
        }
        const rate = this.buyingPriceRate();
        return Math.floor(item.price * rate);
    };

    /**
     * この店からの購入価格レートを取得する。
     * 
     * @return {Number} 販売価格レート(1.0で等倍)
     */
    Game_Shop.prototype.buyingPriceRate = function() {
        return this.shop().buyingPriceRate || 1;
    };

    /**
     * この店への売却価格を得る。
     * 
     * @param {Data_Item} item アイテム
     * @return {Number} 売却価格
     */
    Game_Shop.prototype.sellingPrice = function(item) {
        const itemEntry = this.getItemEntryByItem(item);
        if (itemEntry) {
            if (itemEntry.sellingPrice > 0) {
                return itemEntry.sellingPrice;
            }
        }
        const rate = this.sellingPriceRate();
        return Math.floor(item.price * rate);
    };

    /**
     * この店への売却価格レートを取得する。
     * 
     * @param {Number} 売却価格レート(1.0で等倍)
     */
    Game_Shop.prototype.sellingPriceRate = function() {
        return this.shop().sellingPriceRate || defaultSellingPriceRate;
    };

    /**
     * アイテムエントリを得る。
     * 
     * @param {Object} item アイテム
     * @return {ItemEntry} アイテムエントリ
     */
    Game_Shop.prototype.getItemEntryByItem = function(item) {
        const dataShop = this.shop();
        let kind = 0;
        if (DataManager.isItem(item)) {
            kind = 1;
        } else if (DataManager.isWeapon(item)) {
            kind = 2;
        } else if (DataManager.isArmor(item)) {
            kind = 3;
        }
        const id = item.id;
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
        let kind = 0;
        if (DataManager.isItem(item)) {
            kind = 1;
        } else if (DataManager.isWeapon(item)) {
            kind = 2;
        } else if (DataManager.isArmor(item)) {
            kind = 3;
        }
        const id = item.id;
        return this._itemList.find(function(ie) {
            return (ie.kind === kind) && (ie.id === id);
        });
    };

    /**
     * 店から購入する。
     * 
     * @param {Data_Item} item 購入アイテム
     * @param {Number} num 数量
     */
    Game_Shop.prototype.buyItem = function(item, num) {
        const stokEntry = this.getStokEntry(item);
        if (stokEntry) {
            const totalPrice = this.buyingPrice(item) * num;
            this.gainTransactionAmount(totalPrice);
            stokEntry.numItems -= num;
            if (stokEntry.numItems <= 0) {
                const index = this._itemList.indexOf(stokEntry);
                this._itemList.splice(index, 1);
            }
        }
    };

    /**
     * 店に売却する。
     * 
     * @param {Data_Item}} item 売却アイテム
     * @param {Number} num 数量
     */
    Game_Shop.prototype.sellItem = function(item, num) {
        if (DataManager.isItem(item)) {
            // 通常アイテムで扱いがあるものならば、在庫を増やす。
            const stokEntry = this.getStokEntry(item);
            if (stokEntry) {
                stokEntry.numItems += num;
            } else {
                // 扱い品なら補充。
                const itemEntry = this.getItemEntryByItem(item);
                if (itemEntry) {
                    this._itemList.push({
                        id : itemEntry.id,
                        kind : itemEntry.kind,
                        numItems : num
                    });
                }
            }
        }

        const totalPrice = this.sellingPrice(item) * num;
        this.gainTransactionAmount(totalPrice);
    };

    /**
     * 取引金額を加算する。
     * 
     * @param {Number} price 金額
     */
    Game_Shop.prototype.gainTransactionAmount = function(price) {
        // 加算してってオーバーフローしないように、
        // パーティー所持金最大までしか加算されないようにする。
        if (price > 0) {
            const t = this._transactionAmount + price;
            this._transactionAmount = t.clamp(0, $gameParty.maxGold());
        }
    }

    /**
     * アイテムの在庫数を得る。
     * 
     * @param {Data_Item} item アイテム
     * @return {Number} アイテムの在庫数
     */
    Game_Shop.prototype.stok = function(item) {
        const itemEntry = this.getStokEntry(item);
        return (itemEntry) ? itemEntry.numItems : 0;
    };


    //------------------------------------------------------------------------------
    // Game_Shops
    //
    /**
     * Game_Shopsオブジェクトを初期化する。
     */
    Game_Shops.prototype.initialize = function() {
        this._shopData = [];
    };

    /**
     * ショップデータを取得する。
     * idで指定されている店が未作成なら、作成して返す。
     * 
     * @param {Number} id 店ID
     */
    Game_Shops.prototype.shop = function(id) {
        if (!this._shopData[id]) {
            // 店が作られてない。
            const shop = new Game_Shop();
            shop.setup(id);
            this._shopData[id] = shop;
        }
        return this._shopData[id];
    };

    /**
     * ショップデータを更新する。
     * 未作成のショップは更新されない。
     * 
     * @param {Number} id 更新対象の店ID。0は存在する店全部。
     */
    Game_Shops.prototype.updateShopItems = function(id) {
        if (id) {
            const shop = this._shopData[id];
            if (shop !== null) {
                // 作成済みの場合のみ更新する。
                shop.updateItems();
            }
        } else {
            for (const shop of this._shopData[id]) {
                if (shop) {
                    // 作成済みのショップデータのみ更新する。
                    shop.updateItems();
                }
            }
        }
    };

    /**
     * 店のレベルを設定する。
     * 
     * @param {Number} id 店ID
     * @param {Number} level 店レベル
     */
    Game_Shops.prototype.setShopLevel = function(id, level) {
        const shop = this.shop(id);
        shop.setLevel(level);
    };

    /**
     * 店のレベルを取得する。
     * 
     * @param {Number} id 店ID
     * @return {Number} 店レベル
     */
    Game_Shops.prototype.shopLevel = function(id) {
        const shop = this.shop(id);
        return shop.level();
    };

    /**
     * 店の品数を得る。
     * 
     * @param {Number} id 店ID
     * @return {Number} 品数
     */
    Game_Shops.prototype.shopItemCount = function(id) {
        const shop = this.shop(id);
        return shop.itemCount();
    };

    //------------------------------------------------------------------------------
    // Window_TwldShopBuy
    //    販売品一覧
    Window_TwldShopBuy.prototype = Object.create(Window_Selectable.prototype);
    Window_TwldShopBuy.prototype.constructor = Window_TwldShopBuy;
    
    /**
     * Window_TwldShopBuyを構築する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域。
     * @param {Game_Shop} ショップデータ
     */
    Window_TwldShopBuy.prototype.initialize = function(rect, shop) {
        this._shop = shop;
        this._money = 0;
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
        this.select(0);
    };

    /**
     * ヘルプメッセージを更新する。
     */
    Window_TwldShopBuy.prototype.updateHelp = function() {
        Window_Selectable.prototype.updateHelp.call(this);
        this._helpWindow.setItem(this.item());
    }

    /**
     * 最大項目数を得る。
     * 
     * @return {Number} 最大項目数
     */
    Window_TwldShopBuy.prototype.maxItems = function() {
        return this._shop.itemCount();
    };

    /**
     * 選択されているアイテムを得る。
     * 
     * @return {Game_Item} アイテム。未選択時はnull。
     */
    Window_TwldShopBuy.prototype.item = function() {
        return this._shop.itemAt(this.index());
    };

    /**
     * 所持金をセットする。
     * 
     * @param {Number} money 所持金
     */
    Window_TwldShopBuy.prototype.setMoney = function(money) {
        this._money = money;
        this.refresh();
    };

    /**
     * 在庫数を得る。
     * 
     * @param {Data_Item} item アイテム
     * @return {Number} 在庫数
     */
    Window_TwldShopBuy.prototype.stok = function(item) {
        return this._shop.stok(item);
    };

    /**
     * 価格を取得する。
     * 
     * @param {Data_Item}} item アイテム
     * @return {Number} 価格
     */
    Window_TwldShopBuy.prototype.price = function(item) {
        return this._shop.buyingPrice(item);
    };

    /**
     * itemが選択可能かどうかを判定する。
     * 
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
        Window_Selectable.prototype.refresh.call(this);
        if (this.index() >= this.maxItems()) {
            this.select(this.maxItems() - 1);
        }
        this.drawAllItems();
    };

    /**
     * 項目を描画する。
     * 
     * @param {Number}} index インデックス
     */
    Window_TwldShopBuy.prototype.drawItem = function(index) {
        const item = this._shop.itemAt(index);
        if (item) {
            const rect = this.itemRect(index);
            const priceWidth = 128 + this.textWidth(this.currencyUnit());
            const numWidth = 64;
            const padding = this.itemPadding();
            const nameWidth = rect.width - numWidth - priceWidth - padding * 2;
            rect.width -= this.itemPadding();
            this.changePaintOpacity(this.isEnabled(item));

            let x = rect.x;
            this.drawItemName(item, x, rect.y, nameWidth);
            x += nameWidth + padding;
            this.drawText(labelStock + ":" + this.stok(item), x, rect.y, numWidth, "right");
            x += numWidth + padding;
            this.drawCurrencyValue(this.price(item), this.currencyUnit(), x, rect.y, priceWidth);
            this.changePaintOpacity(true);
        }
    };

    /**
     * 所持金の単位を得る。
     * 
     * @returns {string} 所持金の単位
     */
     Window_TwldShopBuy.prototype.currencyUnit = function() {
        return TextManager.currencyUnit;
    };


    //------------------------------------------------------------------------------
    // Window_TwldShopCommand


    Window_TwldShopCommand.prototype = Object.create(Window_Command.prototype);
    Window_TwldShopCommand.prototype.constructor = Window_TwldShopCommand;

    /**
     * Window_TwldShopCommandを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_TwldShopCommand.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this._buyable = true;
        this._sellable = true;
        this._shopData = null;
    };

    /**
     * ショップデータを設定する。
     * 
     * @param {Data_Shop} shopData ショップデータ
     */
    Window_TwldShopCommand.prototype.setShop = function(shopData) {
        this._shopData = shopData;
    };

    /**
     * 購入可能かどうかを取得する。
     * 
     * @param {Boolean} enabled 購入可能かどうか
     */
    Window_TwldShopCommand.prototype.setBuyable = function(enabled) {
        this._buyable = enabled;
        this.refresh();
    };
    /**
     * 売却可能かどうかを取得する。
     * 
     * @param {Boolean} enabled 売却可能かどうか
     */
    Window_TwldShopCommand.prototype.setSellable = function(enabled) {
        this._sellable = enabled;
        this.refresh();
    };

    /**
     * 最大カラム数を得る。
     * 
     * @return {Number} カラムス
     */
    Window_TwldShopCommand.prototype.maxCols = function() {
        return 1;
    };

    /**
     * コマンドリストを構築する。
     */
    Window_TwldShopCommand.prototype.makeCommandList = function() {
        this.addCommand(TextManager.buy, "buy", this._buyable);
        this.addCommand(TextManager.sell, "sell", this._sellable)
        this.addCommand(TextManager.cancel, "cancel", true);
    };

    /**
     * ヘルプメッセージを更新する。
     */
    Window_TwldShopCommand.prototype.updateHelp = function() {
        Window_Command.prototype.updateHelp.call(this);
        this._helpWindow.setText(this.helpText(this.currentSymbol()));
    };

    /**
     * ヘルプテキストを取得する。
     * 
     * @param {string} symbol シンボル
     * @returns {string} テキスト
     */
    Window_TwldShopCommand.prototype.helpText = function(symbol) {
        if (this._shopData == null) {
            return "";
        } else {
            switch (symbol) {
                case "buy":
                    return this._shopData.meta.helpBuy || defaultTextHelpBuy;
                case "sell":
                    return this._shopData.meta.helpSell || defaultTextHelpSell;
                case "cancel":
                    return this._shopData.meta.helpCancel || defaultTextHelpCancel;
                default:
                    return "";
                    
            }
        }
    }
    //------------------------------------------------------------------------------
    // Window_TwldShopItemCategory
    Window_TwldShopItemCategory.prototype = Object.create(Window_Command.prototype);
    Window_TwldShopItemCategory.prototype.constructor = Window_TwldShopItemCategory;

    /**
     * Window_TwldShopItemCategoryを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_TwldShopItemCategory.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    /**
     * ヘルプメッセージを更新する処理を呼び出す。
     */
    Window_TwldShopItemCategory.prototype.callUpdateHelp = function() {
        Window_Selectable.prototype.callUpdateHelp.call(this);
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    };

    /**
     * このカテゴリに関係する、アイテムリストウィンドウを設定する。
     * 
     * @param {Window_ItemList} itemWindow アイテムリストウィンドウ
     */
    Window_TwldShopItemCategory.prototype.setItemWindow = function(itemWindow) {
        this._itemWindow = itemWindow;
    }

    /**
     * 最大カラム数を得る。
     * 
     * @return {Number} カラムス
     */
    Window_TwldShopItemCategory.prototype.maxCols = function() {
        return 1;
    };

    /**
     * コマンドリストを構築する。
     */
    Window_TwldShopItemCategory.prototype.makeCommandList = function() {
        this.addCommand(TextManager.item, "item", true);
        this.addCommand(TextManager.weapon, "weapon", true);
        this.addCommand(TextManager.armor, "armor", true);
        this.addCommand(TextManager.keyItem, "keyItem", true);
    };
    //------------------------------------------------------------------------------
    // Window_TwldShopNumber
    // ボタン位置だけ変更する。
    Window_TwldShopNumber.prototype = Object.create(Window_ShopNumber.prototype);
    Window_TwldShopNumber.prototype.constructor = Window_TwldShopNumber;

    /**
     * Window_TwldShopNumberを初期化する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域
     */
    Window_TwldShopNumber.prototype.initialize = function(rect) {
        Window_ShopNumber.prototype.initialize.call(this, rect);
    };
    /**
     * アイテム名表示位置Yを得る。
     * 
     * @return {Number} アイテム名表示位置Y
     */
    Window_TwldShopNumber.prototype.itemNameY = function() {
        return this.baseTextRect().y + this.itemPadding();
    };

    /**
     * 合計金額表示位置Yを得る。
     * 
     * @return {Number} 合計金額表示位置Y
     */
    Window_TwldShopNumber.prototype.totalPriceY = function() {
        return Math.floor(this.itemNameY() + this.lineHeight() * 2);
    };

    /**
     * ボタンのY位置を得る。
     * 
     * @return {Number} ボタンのY位置
     */
    Window_TwldShopNumber.prototype.buttonY = function() {
        return Math.floor(this.totalPriceY() + this.lineHeight() + 10);
    };

    //------------------------------------------------------------------------------
    // Scene_TwldShop
    // ショップの処理をする。
    //
    Scene_TwldShop.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_TwldShop.prototype.constructor = Scene_TwldShop;
        
    /**
     * Scene_TwldShopを初期化する。
     */
    Scene_TwldShop.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    /**
     * シーンを作成する準備をする。
     * 
     * @param {Number} id 店ID番号
     * @param {Number} mode ショップモード
     * @param {String} clerkFileName 店員画像ファイル名。店員画像が無い場合にはnull
     * @param {Number} clerkOffsetX 店員画像表示オフセットX
     * @param {Number} clerkOffsetY 店員画像表示オフセットY
     */
    Scene_TwldShop.prototype.prepare = function(id, mode, clerkFileName, clerkOffsetX, clerkOffsetY) {
        this._shop = $gameShops.shop(id); // Game_Shopオブジェクト
        this._mode = mode;
        this._clerkFileName = clerkFileName || "";
        this._clerkOffsetX = clerkOffsetX || 0;
        this._clerkOffsetY = clerkOffsetY || 0;
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
     * ウィンドウレイヤーを構築する。
     */
    Scene_TwldShop.prototype.createWindowLayer = function() {
        this.createClerkLayer();
        Scene_MenuBase.prototype.createWindowLayer.call(this);
    };

    /**
     * 店員画像描画用レイヤーを追加する。
     */
    Scene_TwldShop.prototype.createClerkLayer = function() {
        this._clerkLayer = new Sprite();
        this.addChild(this._clerkLayer);
    };

    /**
     * ヘルプウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    };

    /**
     * 所持金ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createGoldWindow = function() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    };

    /**
     * 所持金ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.goldWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };
    /**
     * コマンドウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_TwldShopCommand(rect);
        
        const buyable = this.buyable();

        const sellable = (this._mode === Game_Shop.SHOP_MODE_SELL_AND_PURCHASE)
                || (this._mode === Game_Shop.SHOP_MODE_SELL_ONLY);
        this._commandWindow.setBuyable(buyable);
        this._commandWindow.setSellable(sellable);
        this._commandWindow.setHandler("ok",     this.onCommandOk.bind(this));
        this._commandWindow.setHandler("cancel", this.onCommandCancel.bind(this));
        this.addWindow(this._commandWindow);

        this._commandWindow.setShop(this._shop.shop());
        this._commandWindow.setHelpWindow(this._helpWindow);
    };

    /**
     * 購入可能かどうかを取得する。
     * 
     * @return {Boolean} 購入可能な場合にはtrue, 購入できない場合にはfalse
     */
    Scene_TwldShop.prototype.buyable = function() {
        if (this._shop.itemCount() === 0) {
            return false;
        }
        return (this._mode === Game_Shop.SHOP_MODE_SELL_AND_PURCHASE)
                || (this._mode === Game_Shop.SHOP_MODE_PURCHASE_ONLY);

    };

    /**
     * コマンドウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     */
    Scene_TwldShop.prototype.commandWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);
        const wx = Graphics.boxWidth - ww;
        const goldWindowRect = this.goldWindowRect();
        const wy = goldWindowRect.y + goldWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 購入ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createBuyWindow = function() {
        this._buyWindow = new Window_TwldShopBuy(this.twldShopBuyWindowRect(), this._shop);
        this._buyWindow.setHelpWindow(this._helpWindow);
        this._buyWindow.hide();
        this._buyWindow.setHandler("ok", this.onBuyOk.bind(this));
        this._buyWindow.setHandler("cancel", this.onBuyCancel.bind(this));
        this.addWindow(this._buyWindow);
    };

    /**
     * Window_TwldShopBuyWindowの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     */
    Scene_TwldShop.prototype.twldShopBuyWindowRect = function() {
        const goldWindowRect = this.goldWindowRect();
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight() - goldWindowRect.height;
        const wy = goldWindowRect.y + goldWindowRect.height;
        const wx = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 売却アイテム選択用ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createSellWindow = function() {
        const rect = this.sellWindowRect();
        this._sellWindow = new Window_ShopSell(rect);
        this._sellWindow.setHelpWindow(this._helpWindow);
        this._sellWindow.hide();
        this._sellWindow.setHandler("ok", this.onSellOk.bind(this));
        this._sellWindow.setHandler("cancel", this.onSellCancel.bind(this));
        this.addWindow(this._sellWindow);
    };

    /**
     * 売却ウィンドウの位置を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     */
    Scene_TwldShop.prototype.sellWindowRect = function() {
        const goldWindowRect = this.goldWindowRect();
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight() - goldWindowRect.height;
        const wy = goldWindowRect.y + goldWindowRect.height;
        const wx = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 売却物品のカテゴリ選択ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createCategoryWindow = function() {
        const rect = this.twldShopItemCategoryWindowRect();
        this._categoryWindow = new Window_TwldShopItemCategory(rect);
        this._categoryWindow.setItemWindow(this._sellWindow);
        this._categoryWindow.deactivate();
        this._categoryWindow.hide();
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
        this.addWindow(this._categoryWindow);
    };

    /**
     * アイテムカテゴリウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     */
    Scene_TwldShop.prototype.twldShopItemCategoryWindowRect = function() {
        const commandWindowRect = this.commandWindowRect();
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(4, true);
        const wx = Graphics.boxWidth - ww;
        const wy = commandWindowRect.y + commandWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 数値入力ウィンドウを作成する。
     */
    Scene_TwldShop.prototype.createNumberWindow = function() {
        const rect = this.numberWindowRect();
        this._numberWindow = new Window_TwldShopNumber(rect);
        this._numberWindow.hide();
        this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
        this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    };

    /**
     * 数値入力ウィンドウの矩形領域を得る。
     */
    Scene_TwldShop.prototype.numberWindowRect = function() {
        const ww = 450;
        const wh = (ConfigManager.touchUI) 
                ? this.calcWindowHeight(4, true) 
                : this.calcWindowHeight(3, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = this.mainAreaTop() + (this.mainAreaHeight() - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
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
     * 
     * とりあえず右下に置いてみよう。
     * バランス悪かったら変更する。
     */
    Scene_TwldShop.prototype.addClerkSprite = function() {
        this._clerkSprite = new Sprite();
        this._clerkSprite.bitmap = this._clerkBitmap;
        this._clerkSprite.anchor.x = 0.5;
        this._clerkSprite.anchor.y = 1.0;
        const baseX = Graphics.boxWidth - (this.mainCommandWidth() / 2);
        const baseY = this.isBottomHelpMode() ? this.helpAreaTop() : Graphics.boxHeight;
        this._clerkSprite.x = baseX + this._clerkOffsetX;
        this._clerkSprite.y = baseY + this._clerkOffsetY;
        this._clerkLayer.addChild(this._clerkSprite);
    };


    /**
     * 購入可能な最大数を得る。
     */
    Scene_TwldShop.prototype.maxBuy = function() {
        const item = this._item;
        // 持てる最大数
        const canHaveMax = this.canHaveMax(item);
        // 在庫数
        const stok = this._shop.stok(item);
        const max = Math.min(canHaveMax, stok);
        const price = this.buyingPrice();
        if (price > 0) {
            return Math.min(max, Math.floor(this.money() / price));
        } else {
            return max;
        }
    };

    /**
     * 所持できる最大数を得る。
     * 
     * @param {Data_Item} item アイテム
     */
    Scene_TwldShop.prototype.canHaveMax = function(item) {
        return $gameParty.maxItems(item) - $gameParty.numItems(item);
    };


    /**
     * 最大売却数を取得する。
     * 
     * @return {Number} 最大売却数
     */
    Scene_TwldShop.prototype.maxSell = function() {
        return $gameParty.numItems(this._item);
    }

    /**
     * 所持金を得る。
     * 
     * @return {Number} 所持金
     */
    Scene_TwldShop.prototype.money = function() {
        return this._goldWindow.value();
    };


    /**
     * 所持金単位を得る。
     * 
     * @return {String} 所持金の単位。
     */
    Scene_TwldShop.prototype.currencyUnit = function() {
        return this._goldWindow.currencyUnit();
    };

    /**
     * 購入金額を得る。
     * 
     * @return {Number} 購入金額
     */
    Scene_TwldShop.prototype.buyingPrice = function() {
        return this._buyWindow.price(this._item);
    };
    
    /**
     * 売却金額を得る。
     * 
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
        $gameTemp.resetShopTransaction();
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
            case "buy":
                this._commandWindow.deactivate();
                this._helpWindow.setItem(this._buyWindow.item());
                this._buyWindow.setMoney(this.money());
                this._buyWindow.refresh();
                this._buyWindow.show();
                this._buyWindow.activate();
                break;
            case "sell":
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
            case "buy":
                this.doBuy(this._numberWindow.number());
                break;
            case "sell":
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
     * 
     * @param {Number}} number 数量
     */
    Scene_TwldShop.prototype.doBuy = function(number) {
        const totalPrice = number * this.buyingPrice();
        $gameParty.loseGold(totalPrice);
        $gameParty.gainItem(this._item, number);
        this._shop.buyItem(this._item, number);
        $gameTemp.setShopBoughtAny();
    };

    /**
     * 売却処理する。
     * 
     * @param {Number} number 数量
     */
    Scene_TwldShop.prototype.doSell = function(number) {
        const totalPrice = number * this.sellingPrice();
        $gameParty.gainGold(totalPrice);
        $gameParty.loseItem(this._item, number);
        this._shop.sellItem(this._item, number);
        $gameTemp.setShopSoldAny();
    };

    /**
     * 1回の購入処理が終わったときの処理を行う。
     */
    Scene_TwldShop.prototype.onTransactionEnd = function() {
        this._numberWindow.hide();
        switch (this._commandWindow.currentSymbol()) {
            case "buy":
                this._commandWindow.setBuyable(this.buyable());
                this._commandWindow.refresh();
                this._buyWindow.refresh();
                this._buyWindow.activate();
                break;
            case "sell":
                this._sellWindow.refresh();
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
            case "buy":
                this._buyWindow.activate();
                break;
            case "sell":
                this._sellWindow.activate();
                break;
        }
    };
})();