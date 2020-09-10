/*:
 * @plugindesc TWLDの鑑定システム
 * TWLDでの運用を想定する。
 * @author kapuusagi
 * @help
 * 未鑑定アイテムを入手して、鑑定アイテムまたは鑑定ショップにて鑑定するまで
 * 実際のアイテムは入手できない機能を提供する。
 * ベーシックシステムでもたくさんのアイテムエントリとコモンイベントを駆使すればできるんだけど。
 * アイテムエントリがもったいないので自作した。
 * Yanfly氏のItemCoreエンジンと個別アイテムの有効化が必要。
 * 仕様
 *     ・TWLD.Appraisal.AddItemで追加したアイテムを未鑑定アイテムとして所持品に追加する。
 *     ・鑑定対象には鑑定レベルが設定されており、鑑定レベルが高いアイテム/スキル/ショップでのみ
 *       鑑定ができる。
 *     ・エネミードロップ品はノートタグを指定することで、未鑑定アイテムとして入手できる。
 * 
 * プラグインコマンド
 *     TWLD.Appraisal.OpenShop [level# [clerk-filename$]]
 *          鑑定屋さんを表示する。
 *          level# : 鑑定レベル。指定したレベル以下のものしか鑑定できない。
 *          clerk-filename : 店員画像ファイル(img/pictures以下のファイルを指定します。)
 *     TWLD.Appraisal.AddItem type$:actualItemId#
 *          actualItemIdを所持品に追加。
 *          type$は item / weapon / armor のいずれかを指定可能。
 *          荷物いっぱいだと追加できないよ。
 *          actualItemIdに指定する側には、<AppraisedItemをつけよう>
 *          AppraisedItem指定されたItemカテゴリのアイテムとして追加される。(ここ重要)
 *          ArmorとかでもItemカテゴリのやつで追加されるので注意してね。
 * ノートタグ
 *     アイテム/武器/防具
 *         <noAppraisal>
 *            このアイテムは入手時に未鑑定にならない。
 *         <AppraiseLevel:level#>
 *             鑑定可能レベルをeval$にする。
 *             未指定時はどんなものでも鑑定可。
 *         <AppraisePrice:value#>
 *             鑑定価格をvalue#にする。
 *         <AppraiseItem:id#>
 *             未鑑定状態だと、同カテゴリのid#のIDになる。
 *     アイテム/スキル
 *         <Appraise:level#>
 *            使用すると鑑定できる。
 *            level#を未指定にすると、鑑定レベル99以下のものを全て鑑定できる。
 *     エネミー
 *         <AppraiseDrop>
 *            ドロップアイテムのうち、ドロップアイテムにAppraiseItemが指定されている場合に、
 *            未鑑定品を取得する。
 *            つまり、未鑑定品をドロップさせるには、エネミーのノートタグに
 *            AppraiseDropをつけ、ドロップアイテムのノートタグに
 *            <AppraiseItem:id#>のタグをつける。
 *            すると、アイテムテーブルのid#のアイテムが入手するようになり、
 *            鑑定するとid#のアイテムが得られる。
 * @note 
 * TWLD_UIより後にいれる。
 * 動作仕様
 * ・個別アイテム入手時、ArraisalがONだと蜜柑亭状態で入手する。 
 * 
 * ・装備画面やアイテム一覧での表示名を「？？？」にする。
 * ・未鑑定品はヘルプメッセージを「未鑑定品」にする。
 * ・未鑑定品は使えない。
 * ・未鑑定品は装備できない。
 * ・アイテム保持条件に引っかからない。
 * 
 * ・鑑定操作は専用のシーンを用意して対応する。
 *   鑑定価格とかつける？
 * 
 * ・鑑定アイテムと鑑定ショップは別にする。
 * 
 * 分散して機能実装すると、何回も同じメソッドつけたり同じ判定したりでいやだなあ。
 */
var Imported = Imported || {};
Imported.TWLD_Appraisal = true;

var TWLD = TWLD || {};
TWLD.Core = TWLD.Core || {};

if (!Imported.TWLD_UI) {
    throw "This plugin must be import after TWLD_UI.js";
}


// for ESLint
if (typeof Window_ItemCategory === 'undefined') {
    var Game_Interpreter = {};
    var SceneManager = {};
    var DataManager = {};
    var TextManager = {};
    var Scene_MenuBase = {};
    var Scene_ItemBase = {};
    var SoundManager = {};

    var Window_Base = {};
    var Window_Gold = {};
    var GenericCommand = {};
    var Window_CommandGeneric = {};
    var Window_Selectable = {};
    var Window_Simple= {};
    var ImageManager = {};
    var Game_Party = {};
    var Game_Enemy = {};

    var $gameParty = {};
    var $dataWeapons = {};
    var $dataArmors = {};
    var $dataItems = {};
    var $gameSystem = {};

    var Graphics = {};
    var Sprite = {};
}


TWLD.Ap = TWLD.Ap || {};

// for ESLint
(function () {
    'use strict';

    /**
     * itemの鑑定レベルを取得する。
     * @param {Data_Item} item アイテム(Item/Weapon/Armor)
     * @return {number} 鑑定レベルが返る。
     */
    TWLD.Ap.getItemAppraiseLevel = function(item) {
        if (item.appraiseLevel) {
            return item.appraiseLevel;
        }
        return Number(item.meta.AppraiseLevel) || 0;
    };

    /**
     * itemの鑑定価格を取得する。
     * @param {Data_Item} item アイテム(Item/Weapon/Armor)
     * @return {number} 鑑定価格が返る。
     */
    TWLD.Ap.getItemAppraisePrice = function(item) {
        if (item.appraisePrice) {
            return item.appraisePrice;
        }
        var price = Number(item.meta.AppraisePrice);
        if (!price) {
            price = Math.floor(item.price * 0.2); // 価格の20%
            if (price < 10) {
                price = 10; // 最低10にしよう。
            }
        }
        return price;
    };

    /**
     * アイテムを得る。
     * @param {String} itemStr アイテム文字列
     * @return {Data_Item} 該当するアイテムオブジェクト
     */
    TWLD.Ap.getAppraisedItem = function(itemStr) {
        var args = itemStr.split(':');
        var id = Number(args[1]) || 0;
        if (args[0] === 'item') {
            return $dataItems[id];
        } else if (args[0] === 'weapon') {
            return $dataWeapons[id];
        } else if (args[0] === 'armor') {
            return $dataArmors[id];
        } else {
            return null;
        }
    };

    /**
     * itemを表すもIDを文字列化したものを得る。
     * @param {Data_Item} アイテム
     * @return {String} 文字列化したものを返す。
     */
    TWLD.Ap.getItemStr = function(item) {
        if (DataManager.isItem(item)) {
            return "item:" + item.id;
        } else if (DataManager.isWeapon(item)) {
            return "weapon:" + item.id;
        } else if (DataManager.isArmor(item)) {
            return "armor:" + item.id;
        } else {
            return undefined;
        }
    }

    //------------------------------------------------------------------------------
    // Game_Enemyの変更
    //
    TWLD.Ap.Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
    /**
     * 取得アイテムを生成する。
     * @return {Array<Data_IteM>} ドロップアイテムの配列。
     */
    Game_Enemy.prototype.makeDropItems = function() {
        var dropItems = TWLD.Ap.Game_Enemy_makeDropItems.call(this);
        var enemy = this.enemy();
        if (enemy.meta.AppraiseDrop) {
            for (var i = 0; i < dropItems.length; i++) {
                var item = dropItems[i];
                if (!item.AppraiseItem) {
                    continue;
                }
                var id = Number(item.AppraiseItem);
                var appraiseItem = $dataItems[id];
                if (!appraiseItem) {
                    continue;
                }
                // 未鑑定時のアイテムが指定されてる。
                var newItem = DataManager.registerNewItem(appraiseItem);
                if (newItem.id != appraiseItem.id) {
                    newItem.appraisedItem = TWLD.Ap.getItemStr(item);
                    DataManager.setAppraiseItem(newItem, item);
                    dropItems[i] = newItem;
                }
            }
        }
        return dropItems;
    };

    //------------------------------------------------------------------------------
    // DataManagerの変更
    //

    /**
     * itemにacutalItemで指定された鑑定ステータスをセットする。
     * @param {Data_Item} item アイテム
     * @param {Data_Item} actualItem 鑑定して得られる実際のアイテム
     */
    DataManager.setAppraiseItem = function(item, actualItem) {
        item.appraiseLevel = TWLD.Ap.getItemAppraiseLevel(actualItem);
        item.appraisePrice = TWLD.Ap.getItemAppraisePrice(actualItem);
    };

    //------------------------------------------------------------------------------
    // Game_Partyの変更
    //


    /**
     * 未鑑定アイテムを追加する。
     * @param {String} itemStr 鑑定した結果出てくるアイテム
     */
    Game_Party.prototype.addAppraiseItem = function(itemStr) {
        var actualItem = TWLD.Ap.getAppraisedItem(itemStr);
        var id = Number(actualItem.meta.AppraiseItem) || 0;
        if (id <= 0) {
            return ;
        }
        var appraiseItem = $dataItems[id];
        if ((appraiseItem === null) || (actualItem === null) 
                || !DataManager.isIndependent(appraiseItem)) {
            // アイテムが未指定か、鑑定対象アイテムが個別アイテムに設定されていない。
            return;
        }

        var newItems = this.gainIndependentItem(appraiseItem, 1);
        if (newItems && (newItems.length == 1)) {
            var newItem = newItems[0];
            DataManager.setAppraiseItem(newItem, actualItem);
            newItem.appraisedItem = itemStr;
            if ($gameSystem.addToItemBook) {
                $gameSystem.addToItemBook('item', appraiseItem.id);
            }
        }
    };


    /**
     * アイテムソートアルゴリズム
     * @param {Data_Item} a アイテムA
     * @param {Data_Item} b アイテムB
     * @return {Number} アイテムAがアイテムBより前にある場合には負数。
     * アイテムAがアイテムBより後にある場合には正数。
     * それ以外は0が返る。
     */
    Game_Party.prototype.independentItemSort = function (a, b) {
        if (!a.appraisedItems && b.appraisedItem) {
            return -1; // aは鑑定済み。bは未完邸
        } else if (a.appraisedItems && !b.appraisedItems) {
            return 1; // aは未完邸、bは鑑定済み。
        } else {
            var aa = (a.baseItemId) ? a.baseItemId : a.id;
            var bb = (b.baseItemId) ? b.baseItemId : b.id;
            return aa - bb;
        }
    };


    //------------------------------------------------------------------------------
    // Window_AppraiseItemCount
    // 鑑定したアイテム名と個数を描画する。
    //
    function Window_AppraiseItemCount() {
        this.initialize.apply(this, arguments);
    }

    Window_AppraiseItemCount.prototype = Object.create(Window_Base.prototype);
    Window_AppraiseItemCount.prototype.constructor = Window_AppraiseItemCount;

    Window_AppraiseItemCount.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._item = null;
        this._actor = null;
    };

    /**
     * 使用者をセットする。
     * @param {Game_Actor} アクター
     */
    Window_AppraiseItemCount.prototype.setActor = function(actor) {
        if (this._actor != null) {
            this._actor = actor;
            this.refresh();
        }
    }

    /**
     * アイテムを設定する。
     * @param {Data_Item} item アイテム(Item/Weapon/Armor)
     */
    Window_AppraiseItemCount.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };

    /**
     * 表示内容を更新する。
     */
    Window_AppraiseItemCount.prototype.refresh = function() {
        this.contents.clear();
        if (this._item) {
            var x = this.textPadding();
            var y = 0;
            var width = this.contentsWidth();
            this.resetTextColor();
            var nameWidth = width - 80;
            this.drawItemName(this._item, x, y, nameWidth);
            if (DataManager.isItem(this._item)) {
                var itemCount = $gameParty.numItems(this._item);
                this.resetTextColor();
                this.drawText(itemCount, x + nameWidth, y, 40, 'right');
            } else if (this._actor !== null) {
                this.drawSkillCost(this._actor, this._item, x + nameWidth, y, 40, 'right');
            }
        }
    };
    /**
     * スキルコストを描画する。
     * @param {Game_Actor} actor アクター
     * @param {Data_Skill} skill スキル
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 幅
     */
    Window_AppraiseItemCount.prototype.drawSkillCost = function(actor, skill, x, y, width) {
        var costStr = '';
        var hpCost = actor.skillHpCost(skill);
        if (hpCost > 0) {
            costStr += 'HP' + hpCost;
        }
        var mpCost = actor.skillMpCost(skill);
        if (mpCost > 0) {
            if (costStr) {
                costStr += '/';
            }
            costStr += 'MP' + mpCost;
        }
        var tpCost = actor.skillTpCost(skill);
        if (tpCost > 0) {
            if (costStr) {
                costStr += '/';
            }
            costStr += 'TP' + tpCost;
        }

        this.drawText(costStr, x, y, width, 'right');
    };
    

    //------------------------------------------------------------------------------
    // Window_AppraiseItemList
    // 鑑定屋さんと鑑定スキルの両方で使うことを想定。
    // 鑑定スキルではsetPriceVisible(false)を設定する事。さもないと価格で制限がかかる。
    // 
    function Window_AppraiseItemList() {
        this.initialize.apply(this, arguments);
    }

    Window_AppraiseItemList.prototype = Object.create(Window_Selectable.prototype);
    Window_AppraiseItemList.prototype.constructor = Window_AppraiseItemList;

    /**
     * Window_AppraiseItemListを初期化する。
     * @param {Number} x ウィンドウx位置
     * @param {Number} y ウィンドウy位置
     * @param {Number} width ウィンドウ幅
     * @param {Number} height ウィンドウ高さ
     */
    Window_AppraiseItemList.prototype.initialize = function(x, y, width, height) {
        this.makeItemList();
        this._monery = 0;
        this._priceVisible = true;
        this._appraiseLevel = 0;
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.select(0);
    };

    /**
     * 対象候補リストを作成する。
     */
    Window_AppraiseItemList.prototype.makeItemList = function() {
        this._items = [];
        var items = this._items;
        // Item.
        $gameParty.items().forEach(function(item) {
            if (item.appraisedItem) {
                items.push(item);
            }
        });
        // Weapon
        $gameParty.weapons().forEach(function(weapon) {
            if (weapon.appraisedItem) {
                items.push(weapon);
            }
        });
        // Armor
        $gameParty.armors().forEach(function(armor) {
            if (armor.appraisedItem) {
                items.push(armor);
            }
        });
    };

    /**
     * アイテムの最大数を取得する。
     * @return {Number} アイテムの最大数
     */
    Window_AppraiseItemList.prototype.maxItems = function() {
        return this._items.length;
    };

    /**
     * 鑑定レベルを設定する。
     * @param {Number} level 鑑定レベル。
     */
    Window_AppraiseItemList.prototype.setAppraiseLevel = function(level) {
        this._items.appraiseLevel = level;
        this.refresh();
    };

    /**
     * 選択されているアイテムを得る。
     * @return {Data_Item} アイテム(Item/Weapon/Armor)
     */
    Window_AppraiseItemList.prototype.item = function() {
        return this._items[this.index()];
    };

    /**
     * 現在の所持金を設定する。
     * @param {Number} monery 所持金
     */
    Window_AppraiseItemList.prototype.setMonery = function(money) {
        this._monery = money;
        this.refresh();
    };

    /**
     * 価格表示をするかどうかを設定する。
     * @param {Boolean} visible 価格表示する場合にはtrue, それ以外はfalse.
     */
    Window_AppraiseItemList.prototype.setPriceVisiable = function(visible) {
        this._priceVisible = visible;
        this.refresh();
    };

    /**
     * 現在の選択項目が有効かどうかを判定する。
     * @return {Boolean} 有効な場合にはtrue, それ以外はfalse
     */
    Window_AppraiseItemList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this._items[this.index()]);
    };

    /**
     * itemが有効かどうかを判定する。
     */
    Window_AppraiseItemList.prototype.isEnabled = function(item) {
        if (!item || !item.appraisedItem) {
            return false;
        }
        if (this._priceVisible && (this.itemAppraisePrice(item) > this._monery)) {
            return false;
        } else if (this.itemAppraiseLevel(item) > this._appraiseLevel) {
            return false;
        }
        return true;
    };

    /**
     * itemの鑑定価格を取得する。
     * @param {Data_Item} item アイテム(Item/Weapon/Armor)
     * @return {Number} 鑑定価格
     */
    Window_AppraiseItemList.prototype.itemAppraisePrice = function(item) {
        return TWLD.Ap.getItemAppraisePrice(item);
    };

    /**
     * アイテムの鑑定レベルを得る。
     * @return {Number} 鑑定レベルが返る。未設定時は0が返る。
     */
    Window_AppraiseItemList.prototype.itemAppraiseLevel = function(item) {
        return TWLD.Ap.getItemAppraiseLevel(item);
    };



    /**
     * 描画を更新する。
     */
    Window_AppraiseItemList.prototype.refresh = function() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    /**
     * アイテムを描画する。
     * @param {Number} index インデックス番号
     */
    Window_AppraiseItemList.prototype.drawItem = function(index) {
        var item = this._items[index];
        var rect = this.itemRect(index);
        var priceWidth = 96;

        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
        if (this.itemAppraiseLevel(item) > this._appraiseLevel) {
            this.drawText('鑑定不可',
                    rect.x + rect.width - priceWidth, rect.y, priceWidth, 'right');
        } else if (this._priceVisible) {
            this.drawText(this.itemAppraisePrice(item),
                    rect.x + rect.width - priceWidth, rect.y, priceWidth, 'right');
        }
        this.changePaintOpacity(true);
    };

    //------------------------------------------------------------------------------
    // Window_AppraiseResult
    //
    /**
     * Window_AppraiseResult
     * 鑑定結果を表示する。
     */
    function Window_AppraiseResult() {
        this.initialize.apply(this, arguments);
    }

    Window_AppraiseResult.prototype = Object.create(Window_Simple.prototype);
    Window_AppraiseResult.prototype.constuctor = Window_AppraiseResult;

    /**
     * Window_AppraiseResultを初期化する。
     * @param {Number} x ウィンドウx位置
     * @param {Number} y ウィンドウy位置
     * @param {Number} width ウィンドウ幅
     * @param {Number} height ウィンドウ高さ
     */
    Window_AppraiseResult.prototype.initialize = function(x, y, width, height) {
        this._items = [];
        Window_Simple.prototype.initialize.call(this, x, y, width, height);
    };

    /**
     * アイテムを設定する。
     * @param {Game_Actor} item アイテム
     */
    Window_AppraiseResult.prototype.setItem = function(item) {
        this._items = [ item ];
        this.refresh();
    };

    /**
     * アイテムを設定する。
     * @param {Array<Data_Item>} items アイテム
     */
    Window_AppraiseResult.prototype.setItems = function(items) {
        this._items = items;
        this.refresh();

    }

    /**
     * 表示を更新する。
     */
    Window_AppraiseResult.prototype.refresh = function() {
        this.contents.clear();
        if ((this._items === null) || (this._items.length === 0)) {
            return;
        }
        var lineHeight = this.lineHeight();
        var x = this.textPadding();
        var y = 0;

        this.drawText('鑑定結果:', x, y, 120);
        var xpos = x + 40;
        var ypos = y + lineHeight;
        for (var i = 0; i < this._items.length; i++) {
            var item = this._items[i];
            this.drawResultItem(item, xpos, ypos);
            ypos += lineHeight;
        }
    }

    /**
     * 鑑定したアイテムを描画する。
     * @param {Data_Item} item アイテム
     * @param {Number} x x位置
     * @param {Number} y y位置
     */
    Window_AppraiseResult.prototype.drawResultItem = function(item, x, y) {
        this.resetTextColor();
        var nameWidth = this.standardPadding() + this.contentsWidth() - x;
        if (item) {
            this.drawItemName(item, x, y, nameWidth);
        }
    };


    //------------------------------------------------------------------------------
    // Scene_ItemBaseの変更
    TWLD.Ap.Scene_ItemBase_determineItem = Scene_ItemBase.prototype.determineItem;
    /**
     * 使用するアイテムが確定した時の処理を行う。
     */
    Scene_ItemBase.prototype.determineItem = function() {
        var item = this.item();
        var user = this.user()
        if (typeof item.meta.Appraise !== 'undefined') {
            // 使用条件判定は？
            var appraiseLevel = Number(item.meta.Appraise) || 99;
            SceneManager.push(Scene_Appraise);
            SceneManager.prepareNextScene(appraiseLevel, user, item);
        } else {
            TWLD.Ap.Scene_ItemBase_determineItem.call(this);
        }
    };

    //------------------------------------------------------------------------------
    // Scene_Appraise
    // 鑑定スキル/アイテム使用時の処理を行う。
    //
    function Scene_Appraise() {
        this.initialize.apply(this, arguments);
    }

    Scene_Appraise.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Appraise.prototype.constructor = Scene_Appraise;

    Scene_Appraise.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    }

    /**
     * シーンを作成する。
     */
    Scene_Appraise.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createItemCountWindow();
        this.createItemListWindow();
        this.createResultWindow();
    };

    /**
     * シーンの準備をする。
     * @param {Number} alevel 鑑定レベル。
     * @param {Game_Actor} actor 使用者
     * @param {Data_Item} aitem 鑑定アイテム(Skill/Item)
     */
    Scene_Appraise.prototype.prepare = function(alevel, actor, aitem) {
        this._appraiseLevel = alevel;
        this._actor = actor;
        this._item = aitem;
    };

    /**
     * アイテムウィンドウを作成する。
     */
    Scene_Appraise.prototype.createItemCountWindow = function() {
        var width = 480;
        var height = 80;
        var x = Graphics.boxWidth - width;
        var y = 0;
        this._itemCountWindow = new Window_AppraiseItemCount(x, y, width, height);
        this._itemCountWindow.setActor(this._actor);
        this._itemCountWindow.setItem(this._item);
        this.addWindow(this._itemCountWindow);
    };

    /**
     * アイテムリストウィンドウを作成する。
     */
    Scene_Appraise.prototype.createItemListWindow = function() {
        var width = 480;
        var x = (Graphics.boxWidth - width) / 2;
        var y = this._itemCountWindow.height;
        var height = Graphics.boxHeight - y - 60;
        this._itemListWindow = new Window_AppraiseItemList(x, y, width, height);
        this._itemListWindow.setPriceVisiable(false);
        this._itemListWindow.setAppraiseLevel(this._appraiseLevel);
        this._itemListWindow.setHandler('ok', this.onItemListWindowOk.bind(this));
        this._itemListWindow.setHandler('cancel', this.onItemListWindowCancel.bind(this));
        this.addWindow(this._itemListWindow);
    };

    /**
     * 結果ウィンドウを作成する。
     */
    Scene_Appraise.prototype.createResultWindow = function() {
        var width = 640;
        var height = 108;
        var x = (Graphics.boxWidth - width) / 2;
        var y = 280;
        this._resultWindow = new Window_AppraiseResult(x, y, width, height);
        this._resultWindow.hide();
        this._resultWindow.setHandler('ok', this.onResultWindowOkOrCancel.bind(this))
        this._resultWindow.setHandler('cancel', this.onResultWindowOkOrCancel.bind(this))
        this.addWindow(this._resultWindow);
    };

    /**
     * シーンを開始する。
     */
    Scene_Appraise.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._itemCountWindow.show();
        this._itemListWindow.activate();
        this._itemListWindow.show();
    };

    /**
     * アイテムウィンドウでOK操作された
     */
    Scene_Appraise.prototype.onItemListWindowOk = function() {
        var targetItem = this._itemListWindow.item();
        var appraiseItem = this._item;
        var newItem = TWLD.Ap.getAppraisedItem(targetItem.appraisedItem);
        SoundManager.playRecovery();
        this._actor.useItem(appraiseItem); // 消費する。
        $gameParty.loseItem(targetItem, 1); // 対象消失
        if (newItem !== null) {
            $gameParty.gainItem(newItem, 1);
        }
        this._itemCountWindow.refresh();
        this._itemListWindow.refresh();
        this._resultWindow.setItem(newItem);
        this._itemListWindow.deactivate();
        this._resultWindow.activate();
        this._resultWindow.show();
    };

    /**
     * アイテムウィンドウでキャンセル操作された
     */
    Scene_Appraise.prototype.onItemListWindowCancel = function() {
        this.popScene();
    };

    /**
     * 結果ウィンドウでOKまたはキャンセル操作された。
     */
    Scene_Appraise.prototype.onResultWindowOkOrCancel = function() {
        if (this.isContinuous()) {
            this._resultWindow.deactivate();
            this._resultWindow.hide();
            this._itemListWindow.show();
            this._itemListWindow.activate();
        } else {
            this.popScene();
        }
    };

    /**
     * 継続可能かどうかを判定する。
     * @return {Boolean} 継続可能な場合にはtrue, それ以外はfalse
     */
    Scene_Appraise.prototype.isContinuous = function() {
        if (DataManager.isItem(this._item)) {
            var itemCount = $gameParty.numItems(this._item);
            if (itemCount <= 0) {
                return false;
            }
        } else if (DataManager.isSkill(this._item)) {
            // アクターが継続して使用可能かどうかかを調べる。
            return this._actor.canUse(this._item)
        }

        return true;
    };

    //------------------------------------------------------------------------------
    // Scene_AppraiseShop
    // 鑑定のお店


    function Scene_AppraiseShop() {
        this.initialize.apply(this, arguments);
    }

    Scene_AppraiseShop.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_AppraiseShop.constructor = Scene_AppraiseShop;

    /**
     * シーンを初期化する。
     */
    Scene_AppraiseShop.prototype.initialize = function() {
        this._appraiseLevel = 0;
        Scene_MenuBase.prototype.initialize.call(this);
    }

    /**
     * シーンの作成準備をする。
     * @param {Number} alevel 鑑定レベル。
     */
    Scene_AppraiseShop.prototype.prepare = function(alevel, filename) {
        this._appraiseLevel = alevel;
        this._clerkFileName = filename || '';
    };

    /**
     * シーンを作成する。
     */
    Scene_AppraiseShop.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createItemListWindow();
        this.createResultWindow();
        this.loadClerkPicture();
    };

    /**
     * 所持金ウィンドウを作成する。
     */
    Scene_AppraiseShop.prototype.createGoldWindow = function() {
        var x = 0; // xはウィンドウ作成後に移動させる。暫定で0。
        var y = this._helpWindow.height;
        this._goldWindow = new Window_Gold(x, y);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this.addWindow(this._goldWindow);
    };

    /**
     * コマンドウィンドウを作成する。
     */
    Scene_AppraiseShop.prototype.createCommandWindow = function() {
        var commandList = [];
        commandList.push(new GenericCommand('鑑定', 'appraise', true));
        commandList.push(new GenericCommand('全て鑑定', 'allappraise', true));
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
     * 鑑定ウィンドウを作成する。
     */
    Scene_AppraiseShop.prototype.createItemListWindow = function() {
        var x = 0;
        var y = this._helpWindow.height;
        var width = 456; // 通常のショップと揃える
        var height = Graphics.boxHeight - this._helpWindow.height;
        this._itemListWindow = new Window_AppraiseItemList(x, y, width, height);
        this._itemListWindow.setPriceVisiable(true);
        this._itemListWindow.setAppraiseLevel(this._appraiseLevel);
        this._itemListWindow.hide();
        this._itemListWindow.setHandler('ok', this.onItemListWindowOk.bind(this));
        this._itemListWindow.setHandler('cancel', this.onItemListWindowCancel.bind(this));
        this.addWindow(this._itemListWindow);
    };

    /**
     * 鑑定結果ウィンドウを作成する。
     */
    Scene_AppraiseShop.prototype.createResultWindow = function() {
        var x = this._itemListWindow.width;
        var y = this._helpWindow.height;
        var width = Graphics.boxWidth - this._goldWindow.width - this._itemListWindow.width;
        var height = Graphics.boxHeight - this._helpWindow.height;
        this._resultWindow = new Window_AppraiseResult(x, y, width, height);
        this._resultWindow.hide();
        this._resultWindow.setHandler('ok', this.onResultWindowOk.bind(this))
        this._resultWindow.setHandler('cancel', this.onResultWindowCancel.bind(this))
        this.addWindow(this._resultWindow);
    };
    /**
     * 店員のイメージを作成する。
     */
    Scene_AppraiseShop.prototype.loadClerkPicture = function() {
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
    Scene_AppraiseShop.prototype.addClerkSprite = function() {
        console.log('clerk bitmap loaded.');
        this._clerkSprite = new Sprite();
        this._clerkSprite.bitmap = this._clerkBitmap;
        this._clerkSprite.x = Graphics.boxWidth - this._clerkBitmap.width;
        this._clerkSprite.y = Graphics.boxHeight - this._clerkBitmap.height;
        this._backgroundSprite.addChild(this._clerkSprite);
    };

    /**
     * シーンを開始する。
     */
    Scene_AppraiseShop.prototype.start = function() {
        this._itemListWindow.setMonery($gameParty.gold());
        this._goldWindow.show();
        this._commandWindow.show();
        this._commandWindow.activate();
    };

    /**
     * コマンドウィンドウでOK操作されたとき
     */
    Scene_AppraiseShop.prototype.onCommandOk = function() {
        switch (this._commandWindow.currentSymbol()) {
            case 'appraise':
                this._commandWindow.deactivate();
                this._commandWindow.hide();
                this._itemListWindow.activate();
                this._itemListWindow.show();
                break;
            case 'allappraise':
                this.doAllApprise();
                break;

        }
    };

    /**
     * 全部鑑定を実行する。
     */
    Scene_AppraiseShop.prototype.doAllApprise = function() {
        // 割引システム入れようかと思ったけどやめた。
        var items = [];
        var alevel = this._appraiseLevel;

        // 鑑定可能対象を集める。
        $gameParty.items().forEach(function(item) {
            if (item.appraisedItem
                    && (TWLD.Ap.getItemAppraiseLevel(item) < alevel)) {
                items.push(item);
            }
        });
        $gameParty.weapons().forEach(function(weapon) {
            if (weapon.appraisedItem
                    && (TWLD.Ap.getItemAppraiseLevel(weapon) < alevel)) {
                items.push(weapon);
            }
        });
        $gameParty.armors().forEach(function(armor) {
            if (armor.appraisedItem
                    && (TWLD.Ap.getItemAppraiseLevel(armor) < alevel)) {
                items.push(armor);
            }
        });
        this._appraiseItems = items;
        if (this._appraiseItems.length === 0) {
            this._commandWindow.activate();
            return;
        } else {
            this._commandWindow.deactivate();
            this.nextAppraise();
            this._resultWindow.setHandler('ok', this.onAppraiseOk.bind(this))
            this._resultWindow.setHandler('cancel', this.onAppraiseCancel.bind(this))
        }
    };

    /**
     * 次のアイテムを鑑定する。
     */
    Scene_AppraiseShop.prototype.nextAppraise = function() {
        // 最大で10個まで連続鑑定する。
        var appraisedItems = [];
        for (var i = 0; (i < 10) && (this._appraiseItems.length > 0); i++) {
            var item = this._appraiseItems[0]; // 先頭を取り出す。
            var newItem = TWLD.Ap.getAppraisedItem(item.appraisedItem);
            var price = TWLD.Ap.getItemAppraisePrice(item);
            if ($gameParty.gold() < price) {
                break;
            }
            this._appraiseItems.shift();
            $gameParty.loseGold(price);
            $gameParty.loseItem(item, 1);
            if (newItem) {
                $gameParty.gainItem(newItem, 1);
            }
            appraisedItems.push(newItem);
        }
        if (appraisedItems.length > 0) {
            // 鑑定品一覧を表示する。
            SoundManager.playShop();
            this._itemListWindow.setMonery($gameParty.gold());
            this._itemListWindow.refresh();
            this._goldWindow.refresh();
            this._resultWindow.setItems(appraisedItems);
            this._resultWindow.activate();
            this._itemListWindow.show();
            this._resultWindow.show();
        } else {
            // 残りを鑑定するためのお金が足りなかった。
            this._resultWindow.setHandler('ok', this.onResultWindowOk.bind(this))
            this._resultWindow.setHandler('cancel', this.onResultWindowCancel.bind(this))
            this._resultWindow.hide();
            this._itemListWindow.hide();
            this._commandWindow.show();
            this._commandWindow.activate();
            return;
        }
    };

    /**
     * 全部鑑定画面でOKボタンが押された
     */
    Scene_AppraiseShop.prototype.onAppraiseOk = function() {
        if (this._appraiseItems.length > 0) {
            this.nextAppraise();
        } else {
            this._resultWindow.setHandler('ok', this.onResultWindowOk.bind(this))
            this._resultWindow.setHandler('cancel', this.onResultWindowCancel.bind(this))
            this._itemListWindow.hide();
            this._resultWindow.hide();
            this._commandWindow.activate();
        }
    };

    /**
     * 全部鑑定中にキャンセルされた。
     */
    Scene_AppraiseShop.prototype.onAppraiseCancel = function() {
        this._resultWindow.setHandler('ok', this.onResultWindowOk.bind(this))
        this._resultWindow.setHandler('cancel', this.onResultWindowCancel.bind(this))
        this._itemListWindow.hide();
        this._resultWindow.hide();
        this._commandWindow.activate();
    };

    /**
     * コマンドウィンドウでキャンセル操作されたとき
     */
    Scene_AppraiseShop.prototype.onCommandCancel = function() {
        this.popScene();
    };

    /**
     * アイテムウィンドウでOk操作された
     */
    Scene_AppraiseShop.prototype.onItemListWindowOk = function() {
        SoundManager.playShop();
        var item = this._itemListWindow.item();
        var price = TWLD.Ap.getItemAppraisePrice(item);
        $gameParty.loseGold(price);
        var newItem = TWLD.Ap.getAppraisedItem(item.appraisedItem);
        $gameParty.loseItem(item);
        if (newItem) {
            $gameParty.gainItem(newItem, 1);
        }

        this._itemListWindow.setMonery($gameParty.gold());
        this._goldWindow.refresh();
        this._resultWindow.setItem(newItem);
        this._itemListWindow.activate();
        this._resultWindow.deactivate();
        this._resultWindow.show();
    };

    /**
     * アイテムウィンドウでキャンセル操作された。
     */
    Scene_AppraiseShop.prototype.onItemListWindowCancel = function() {
        // アイテムウィンドウを閉じて、コマンド選択を表示する。
        this._itemListWindow.deactivate();
        this._itemListWindow.hide();
        this._commandWindow.show();
        this._commandWindow.activate();
        this._resultWindow.deactivate();
        this._resultWindow.hide();
    };

    /**
     * 結果ウィンドウでOK操作された
     */
    Scene_AppraiseShop.prototype.onResultWindowOk = function() {
        this._resultWindow.hide();
        this._resultWindow.deactivate();
        this._itemListWindow.activate();
    };

    /**
     * 結果ウィンドウでキャンセル操作された 
     */
    Scene_AppraiseShop.prototype.onResultWindowCancel = function() {
        this._resultWindow.hide();
        this._resultWindow.deactivate();
        this._itemListWindow.activate();
    };


    //------------------------------------------------------------------------------
    // プラグインコマンドの実装
    // プラグインON/OFF
    //
    TWLD.Ap.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        var re = command.match(/^TWLD\.Appraisal\.(.*)/);
        if (re !== null) {
            switch (re[1]) {
                case 'AddItem':
                    $gameParty.addAppraiseItem(args[0]);
                    break;
                case 'OpenShop':
                    var alevel = Number(args[0]) || 0;
                    var clerkFileName = args[1] || '';
                    SceneManager.push(Scene_AppraiseShop);
                    SceneManager.prepareNextScene(alevel, clerkFileName);
                    break;
            }
        } else {
            TWLD.Ap.Game_Interpreter_pluginCommand.call(this, command, args);
        }
    };

})();