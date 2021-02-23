/*:ja
 * @target MZ 
 * @plugindesc hogehoge
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem
 * @orderAfter 
 * 
 * @command addItem
 * @text 未鑑定アイテム入手
 * @desc 指定したアイテムを鑑定が終わっていないアイテムとして入手する。
 * @arg id
 * @text アイテムID
 * @type item
 * @min 1
 * @default 1
 * @arg count
 * @text 個数
 * @min 1
 * @default 1
 * 
 * @command addWeapon
 * @text 未鑑定武器入手
 * @desc 指定した武器を鑑定が終わっていない武器として入手する。
 * @arg id
 * @text 武器ID
 * @type weapon
 * @min 1
 * @default 1
 * @arg count
 * @text 個数
 * @min 1
 * @default 1
 * 
 * @command addArmor
 * @text 未鑑定防具入手
 * @desc 指定した防具を鑑定が終わっていない防具として入手する。
 * @arg id
 * @text 防具ID
 * @type armor
 * @min 1
 * @default 1
 * @arg count
 * @text 個数
 * @min 1
 * @default 1
 * 
 * 
 * @command openShop
 * @text 鑑定ショップを開く
 * @arg appraiseLevel
 * @text 鑑定レベル
 * @desc ショップで鑑定可能なレベル。
 * @type number
 * @default 0
 * @arg clerkFileName
 * @text 定員ファイル名
 * @description 定員画像として使用する画像ファイル
 * @type string
 * 
 * 
 * @param effectCode
 * @text 鑑定エフェクトコード
 * @desc 鑑定効果を割り当てるエフェクトコード。
 * @type number
 * @default 109
 * @min 4
 * 
 * 
 * @param appraisePriceRate
 * @text 鑑定価格レート
 * @desc 鑑定価格指定が無い場合の鑑定価格算出レート。
 * @type number
 * @decimals 2
 * @default 0.20
 * @min 0.01
 * @max 1.00
 * 
 * @param minAppraisePrice
 * @text 最小鑑定価格
 * @desc 鑑定価格の最小値。これ以下になることはない。
 * @type number
 * @min 0
 * @default 0
 * 
 * @param labelAppraisal
 * @text 鑑定コマンドテキスト
 * @desc 鑑定コマンドとして表示するラベル
 * @type string
 * @default 鑑定
 * 
 * @param labelAllAppraisal
 * @text 全て鑑定コマンドテキスト
 * @desc 全て鑑定コマンドとして表示するラベル
 * @type string
 * @default 全て鑑定
 * 
 * @param labelNoAppraisal
 * @text 鑑定不可表記テキスト
 * @desc 鑑定不可の場合に表示するラベル
 * @type string
 * @default 鑑定不可
 * 
 * @param labelAppraiseResult
 * @text 鑑定結果ラベル
 * @desc 鑑定結果として表示するラベル
 * @type string
 * @default 鑑定結果
 * 
 * 
 * @help 
 * 鑑定機能を追加するプラグイン
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 未鑑定アイテム入手
 *     指定したアイテムを未鑑定アイテムとして入手する。
 * 未鑑定武器入手
 *     指定した武器を未鑑定アイテムとして入手する。
 * 未鑑定防具入手
 *     指定した防具を未鑑定アイテムとして入手する。
 * 鑑定ショップを開く
 *     鑑定ショップを開く。
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム/武器/防具
 *   <appraiseLevel:level#>
 *     被鑑定品の鑑定レベルをlevelとする。
 *     スキル/鑑定アイテムでlevelを超える品は鑑定できない。
 * 
 *   <appraisePrice:price#>
 *     被鑑定品の鑑定価格をpriceとする。
 *     0にした場合、品物の価格から自動算出される
 * 
 *   <appraiseItem:id#>
 *     このアイテムの鑑定前アイテムとして使用するアイテムのID。
 *     アイテムを入手したとき、このIDで指定したアイテムとして
 *     入手し、鑑定することで本来のアイテムを入手する。
 *     武器や防具として鑑定アイテムとして指定できない。
 * 
 * アイテム/スキル
 *   <appraiseEffect:level#>
 *     このアイテム/スキルに鑑定効果を付与する。
 *  
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 移植して実装。
 */

/**
 * Window_AppraiseItemCount
 * 鑑定したアイテム名と個数を描画する。
 */
function Window_AppraiseItemCount() {
    this.initialize.apply(this, arguments);
}

/**
 * Scene_AppraiseShop
 * 鑑定のお店
 */
function Scene_AppraiseShop() {
    this.initialize.apply(this, arguments);
}

/**
 * Window_AppraiseItemList
 * 鑑定屋さんと鑑定スキルの両方で使うことを想定。
 * 鑑定スキルではsetPriceVisible(false)を設定する事。さもないと価格で制限がかかる。
 */
function Window_AppraiseItemList() {
    this.initialize.apply(this, arguments);
}
/**
 * Window_AppraiseResult
 * 鑑定結果を表示する。
 */
function Window_AppraiseResult() {
    this.initialize.apply(this, arguments);
}

/**
 * Window_AppraiseShopCommand
 * 
 * 鑑定ショップコマンド
 */
function Window_AppraiseShopCommand() {
    this.initialize(...arguments);
}


/**
 * Scene_Appraise.
 * 鑑定スキル/アイテム使用時の処理を行う。
 */
function Scene_Appraise() {
    this.initialize.apply(this, arguments);
}

(() => {
    "use strict";

    const pluginName = "Kapu_IndependentItem_Appraisal";
    const parameters = PluginManager.parameters(pluginName);

    Game_Action.EFFECT_APPRAISE = Number(parameters["effectCode"]) || 0;
    if (!Game_Action.EFFECT_APPRAISE) {
        console.error(pluginName + ":EFFECT_APPRAISE is not valid.");
    }
    /**
     * 鑑定価格レートを得る。
     * 
     * @param {String} arg パラメータとして渡された鑑定価格レート文字列
     * @return {Number} 鑑定価格レート
     */
    const _getApprisePriceRate = function(arg) {
        const rate = Number(arg);
        return Math.max(0, Math.min(1.0, rate));
    };
    const appraisePriceRate = _getApprisePriceRate(parameters["appraisePriceRate"]);

    /**
     * 最小鑑定価格を得る。
     * 
     * @param {String} arg パラメータとして渡された最小鑑定価格文字列
     * @return {Number} 最小鑑定価格
     */
    const _getMinAppraisePrice = function(arg) {
        const price = Number(arg);
        return (price > 10) ? price : 10;
    };
    const minAppraisePrice = _getMinAppraisePrice(parameters["minAppraisePrice"]);

    /**
     * 解析レベルを解析する。
     * 
     * @param {String} str 文字
     */
    const _parseAppraiseLevel = function(str) {
        const value = Math.floor((Number(str) || 0));
        if (value >= 0) {
            return value;
        } else {
            return 0;
        }
    };

    const labelNoAppraisal = parameters["labelNoAppraisal"] || "NoAppraisal";
    const labelAppraisal = parameters["labelAppraisal"] || "Appraise";
    const labelAllAppraisal = parameters["labelAllAppraisal"] || "All appraise"
    const labelAppraiseResult = parameters["labelAppraiseResult"] || "Result";

    PluginManager.registerCommand(pluginName, "addItem", args => {
        const id = Number(args.id) || 0;
        const count = Number(args.count);
        if ((id > 0) && (id < $dataItems.length) && (count > 0)) {
            const item = $dataItems[id];
            if (item) {
                $gameParty.gainAppraiseItem(item, count);
            }
        }
    });

    PluginManager.registerCommand(pluginName, "addWeapon", args => {
        const id = Number(args.id) || 0;
        const count = Number(args.count);
        if ((id > 0) && (id < $dataWeapons.length) && (count > 0)) {
            const item = $dataWeapons[id];
            if (item) {
                $gameParty.gainAppraiseItem(item, count);
            }
        }
    });

    PluginManager.registerCommand(pluginName, "addArmor", args => {
        const id = Number(args.id) || 0;
        const count = Number(args.count);
        if ((id > 0) && (id < $dataArmors) && (count > 0)) {
            const item = $dataArmors[id];
            if (item) {
                $gameParty.gainAppraiseItem(item, count);
            }
        }
    });

    PluginManager.registerCommand(pluginName, "openShop", args => {
        const alevel = Number(args.appraiseLevel) || 0;
        const clerkFileName = args.clerkFileName || "";
        SceneManager.push(Scene_AppraiseShop);
        SceneManager.prepareNextScene(alevel, clerkFileName);
    });

    /**
     * 鑑定アイテムを得る。
     * 
     * @param {String} itemStr アイテム文字列
     * @return {Data_Item} 該当するアイテムオブジェクト
     */
    const _getAppraisedItem = function(itemStr) {
        const args = itemStr.split(":");
        const id = Number(args[1]) || 0;
        if (args[0] === "item") {
            return $dataItems[id];
        } else if (args[0] === "weapon") {
            return $dataWeapons[id];
        } else if (args[0] === "armor") {
            return $dataArmors[id];
        } else {
            return null;
        }
    };
    //-------------------------------------------------------------------------
    // Scene_Boot
    if (Game_Action.EFFECT_APPRAISE) {
        const _Scene_Boot_start = Scene_Boot.prototype.start;
        /**
         * Scene_Bootを開始する。
         */
        Scene_Boot.prototype.start = function () {
            DataManager.processAppraiseItemNoteTag($dataItems);
            DataManager.processAppraiseItemNoteTag($dataSkills);

            _Scene_Boot_start.call(this);
        };
    }
    //------------------------------------------------------------------------------
    // DataManager
    if (Game_Action.EFFECT_APPRAISE) {
        /**
         * 鑑定効果アイテムのノートタグを処理する。
         * 
         * @param {Array<Object>} dataArray DataItemまたはDataSkillのコレクション
         */
        DataManager.processAppraiseItemNoteTag = function(dataArray) {
            for (let data of dataArray) {
                if (data) {
                    if (data.meta.appraiseEffect) {
                        const level = _parseAppraiseLevel(data.meta.appraiseEffect);
                        data.effects.push({
                            code: Game_Action.EFFECT_APPRAISE,
                            dataId: 0,
                            value1: level,
                            value2: 0
                        });
                    }
                }
            }
        };
    }

    /**
     * アイテムの鑑定レベルを取得する。
     * 
     * @param {Object} item アイテム/武器/防具
     * @return {number} 鑑定レベルが返る。
     */
    DataManager.getItemAppraiseLevel = function(item) {
        let level = 0;
        if (item.appraiseLevel) {
            // 鑑定すると入手できるアイテムにレベルが設定されている場合
            level = Number(item.appraiseLevel) || 0;
        } else if (item.meta.appraiseLevel) {
            // 鑑定アイテムにレベルが設定されている場合。
            level = Number(item.meta.appraiseLevel) || 0;
        }
        return level;
    };

    /**
     * itemの鑑定価格を取得する。
     * 
     * @param {Data_Item} item アイテム(Item/Weapon/Armor)
     * @return {number} 鑑定価格が返る。
     */
    DataManager.getItemAppraisePrice = function(item) {
        let price = Number(item.meta.appraisePrice);
        if (!price) {
            price = Math.floor(item.price * appraisePriceRate);
            if (price < minAppraisePrice) {
                price = minAppraisePrice; 
            }
        }
        return price;
    };



    /**
     * itemを表すIDを文字列化したものを得る。
     * 
     * @param {Data_Item} アイテム
     * @return {String} 文字列化したものを返す。
     */
    DataManager.getItemStr = function(item) {
        if (DataManager.isItem(item)) {
            return "item:" + item.id;
        } else if (DataManager.isWeapon(item)) {
            return "weapon:" + item.id;
        } else if (DataManager.isArmor(item)) {
            return "armor:" + item.id;
        } else {
            return undefined;
        }
    };


    //------------------------------------------------------------------------------
    // Game_Enemy
    const _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
    /**
     * 取得アイテムを生成する。
     * 
     * @return {Array<Data_IteM>} ドロップアイテムの配列。
     */
    Game_Enemy.prototype.makeDropItems = function() {
        const dropItems = _Game_Enemy_makeDropItems.call(this);
        const enemy = this.enemy();
        if (enemy.meta.appraiseDrop) {
            for (let i = 0; i < dropItems.length; i++) {
                const item = dropItems[i];
                if (!item.meta.appraiseItem) {
                    continue;
                }
                const id = Number(item.meta.appraiseItem);
                const appraiseItem = $dataItems[id];
                if (!appraiseItem) {
                    continue;
                }
                // 未鑑定時のアイテムが指定されてる。
                const newItem = DataManager.registerNewItem(appraiseItem);
                if (newItem) {
                    newItem.appraiseLevel = DataManager.getItemAppraiseLevel(item);
                    newItem.appraisePrice = DataManager.getItemAppraisePrice(item);
                    newItem.appraisedItem = DataManager.getItemStr(item);
                    dropItems[i] = newItem;
                }
            }
        }
        return dropItems;
    };
    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * 未鑑定アイテムを追加する。
     * 
     * @param {Object} item 追加するアイテム。ここで指定したアイテムをラップした未鑑定アイテムを入手する。
     * @param {Number} count 個数
     */
    Game_Party.prototype.gainAppraiseItem = function(item, count) {
        if ((item === null) || (count <= 0)) {
            return ;
        }
        const appraiseItemId = Number(item.meta.appraiseItem) || 0;
        if (appraiseItemId <= 0) {
            return ;
        }
        const appraiseItem = $dataItems[appraiseItemId];
        if ((appraiseItem === null)
                || !DataManager.isIndependent(appraiseItem)) {
            // アイテムが未指定か、鑑定対象アイテムが個別アイテムに設定されていない。
            return;
        }

        for (let i = 0; i < count; i++) {
            const newItem = DataManager.registerNewIndependentData(appraiseItem);
            if (newItem) {
                const container = this.itemContainer(appraiseItem);
                container[newItem.id] = 1;
                newItem.appraiseLevel = DataManager.getItemAppraiseLevel(item);
                newItem.appraisePrice = DataManager.getItemAppraisePrice(item);
                newItem.appraisedItem = DataManager.getItemStr(item);
            }
        }
    };


    /**
     * アイテムソートアルゴリズム
     * 
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
            const aa = (a.baseItemId) ? a.baseItemId : a.id;
            const bb = (b.baseItemId) ? b.baseItemId : b.id;
            return aa - bb;
        }
    };
    //------------------------------------------------------------------------------
    // Window_AppraiseItemCount

    Window_AppraiseItemCount.prototype = Object.create(Window_Base.prototype);
    Window_AppraiseItemCount.prototype.constructor = Window_AppraiseItemCount;

    /**
     * Window_AppraiseItemCountを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_AppraiseItemCount.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._item = null;
        this._actor = null;
    };

    /**
     * 使用者をセットする。
     * 
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
     * 
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
            const x = this.itemPadding();
            const y = 0;
            const width = this.contentsWidth();
            this.resetTextColor();
            const nameWidth = width - 80;
            this.drawItemName(this._item, x, y, nameWidth);
            if (DataManager.isItem(this._item)) {
                const itemCount = $gameParty.numItems(this._item);
                this.resetTextColor();
                this.drawText(itemCount, x + nameWidth, y, 40, "right");
            } else if (this._actor !== null) {
                this.drawSkillCost(this._actor, this._item, x + nameWidth, y, 40, "right");
            }
        }
    };

    /**
     * スキルコストを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Data_Skill} skill スキル
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 幅
     */
    Window_AppraiseItemCount.prototype.drawSkillCost = function(actor, skill, x, y, width) {
        let costStr = "";
        if (actor.skillHpCost) {
            const hpCost = actor.skillHpCost(skill);
            if (hpCost > 0) {
                costStr += TextManager.hpA + hpCost;
            }
        }
        const mpCost = actor.skillMpCost(skill);
        if (mpCost > 0) {
            if (costStr) {
                costStr += "/";
            }
            costStr += TextManager.mpA + mpCost;
        }
        const tpCost = actor.skillTpCost(skill);
        if (tpCost > 0) {
            if (costStr) {
                costStr += "/";
            }
            costStr += TextManager.tpA + tpCost;
        }

        this.drawText(costStr, x, y, width, "right");
    };

    //------------------------------------------------------------------------------
    // Window_AppraiseItemList
    // Note: Window_ItemListを派生させた方がいいかも。
    //       但し、アイテムカテゴリとか面倒そうではある。
    Window_AppraiseItemList.prototype = Object.create(Window_Selectable.prototype);
    Window_AppraiseItemList.prototype.constructor = Window_AppraiseItemList;

    /**
     * Window_AppraiseItemListを初期化する。
     * 
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
        const items = this._items;
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
     * 
     * @return {Number} アイテムの最大数
     */
    Window_AppraiseItemList.prototype.maxItems = function() {
        return this._items.length;
    };

    /**
     * 鑑定レベルを設定する。
     * 
     * @param {Number} level 鑑定レベル。
     */
    Window_AppraiseItemList.prototype.setAppraiseLevel = function(level) {
        this._appraiseLevel = level;
        this.refresh();
    };

    /**
     * 選択されているアイテムを得る。
     * 
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
     * 
     * @param {Boolean} visible 価格表示する場合にはtrue, それ以外はfalse.
     */
    Window_AppraiseItemList.prototype.setPriceVisiable = function(visible) {
        this._priceVisible = visible;
        this.refresh();
    };

    /**
     * 現在の選択項目が有効かどうかを判定する。
     * 
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
     * 
     * @param {Data_Item} item アイテム(Item/Weapon/Armor)
     * @return {Number} 鑑定価格
     */
    Window_AppraiseItemList.prototype.itemAppraisePrice = function(item) {
        return DataManager.getItemAppraisePrice(item);
    };

    /**
     * アイテムの鑑定レベルを得る。
     * 
     * @return {Number} 鑑定レベルが返る。未設定時は0が返る。
     */
    Window_AppraiseItemList.prototype.itemAppraiseLevel = function(item) {
        return DataManager.getItemAppraiseLevel(item);
    };

    /**
     * ヘルプメッセージを更新する。
     */
    Window_AppraiseItemList.prototype.updateHelp = function() {
        this.setHelpWindowItem(this.item());
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
        const item = this._items[index];
        const rect = this.itemRect(index);
        const priceWidth = 96;

        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
        if (this.itemAppraiseLevel(item) > this._appraiseLevel) {
            this.drawText(labelNoAppraisal,
                    rect.x + rect.width - priceWidth, rect.y, priceWidth, "right");
        } else if (this._priceVisible) {
            this.drawText(this.itemAppraisePrice(item),
                    rect.x + rect.width - priceWidth, rect.y, priceWidth, "right");
        }
        this.changePaintOpacity(true);
    };

    //------------------------------------------------------------------------------
    // Window_AppraiseResult
    Window_AppraiseResult.prototype = Object.create(Window_Selectable.prototype);
    Window_AppraiseResult.prototype.constuctor = Window_AppraiseResult;

    /**
     * Window_AppraiseResultを初期化する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域
     */
    Window_AppraiseResult.prototype.initialize = function(rect) {
        this._items = [];
        Window_Selectable.prototype.initialize.call(this, rect);
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
        const lineHeight = this.lineHeight();
        const x = this.itemPadding();
        const y = 0;

        this.drawText(labelAppraiseResult + ":", x, y, 120);
        const xpos = x + 40;
        let ypos = y + lineHeight;
        for (let i = 0; i < this._items.length; i++) {
            const item = this._items[i];
            this.drawResultItem(item, xpos, ypos);
            ypos += lineHeight;
        }
    }

    /**
     * 鑑定したアイテムを描画する。
     * 
     * @param {Data_Item} item アイテム
     * @param {Number} x x位置
     * @param {Number} y y位置
     */
    Window_AppraiseResult.prototype.drawResultItem = function(item, x, y) {
        this.resetTextColor();
        const nameWidth = this.itemPadding() + this.contentsWidth() - x;
        if (item) {
            this.drawItemName(item, x, y, nameWidth);
        }
    };


    //------------------------------------------------------------------------------
    // Scene_ItemBaseの変更
    const _Scene_ItemBase_determineItem = Scene_ItemBase.prototype.determineItem;
    /**
     * 使用するアイテムが確定した時の処理を行う。
     */
    Scene_ItemBase.prototype.determineItem = function() {
        const item = this.item();
        const user = this.user()
        if (typeof item.meta.appraiseLevel !== "undefined") {
            // 使用条件判定は？
            const appraiseLevel = Number(item.meta.appraiseLevel) || 99;
            SceneManager.push(Scene_Appraise);
            SceneManager.prepareNextScene(appraiseLevel, user, item);
        } else {
            _Scene_ItemBase_determineItem.call(this);
        }
    };

    //------------------------------------------------------------------------------
    // Scene_Appraise


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
        this.createHelpWindow();
        this.createItemCountWindow();
        this.createItemListWindow();
        this.createResultWindow();
    };

    /**
     * シーンの準備をする。
     * 
     * @param {Game_Actor} actor 使用者
     * @param {Data_Item} aitem 鑑定アイテム(Skill/Item)
     */
    Scene_Appraise.prototype.prepare = function(actor, aitem) {
        this._actor = actor;
        this._item = aitem;
        this._appraiseLevel = this.itemAppraiseLevel();
    };

    /**
     * アイテム/スキルの鑑定レベルを取得する。
     * 
     * @return {Number} 鑑定レベル。
     */
    Scene_Appraise.prototype.itemAppraiseLevel = function() {
        // 複数の鑑定レベルを持っているならば、そのうち最も高いものを返す。
        let level = 0;
        for (const effect of this._item.effects) {
            if (effect.code === Game_Action.EFFECT_APPRAISE) {
                if (effect.value1 > level) {
                    level = effect.value1;
                }
            }
        }

        return level;
    };

    /**
     * アイテムウィンドウを作成する。
     */
    Scene_Appraise.prototype.createItemCountWindow = function() {
        const rect = this.itemCountWindowRect();
        this._itemCountWindow = new Window_AppraiseItemCount(rect);
        this._itemCountWindow.setActor(this._actor);
        this._itemCountWindow.setItem(this._item);
        this.addWindow(this._itemCountWindow);
    };

    /**
     * アイテムウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     */
    Scene_Appraise.prototype.itemCountWindowRect = function() {
        const ww = 480;
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アイテムリストウィンドウを作成する。
     */
    Scene_Appraise.prototype.createItemListWindow = function() {
        const rect = this.itemListWindowRect();
        this._itemListWindow = new Window_AppraiseItemList(rect);
        this._itemListWindow.setPriceVisiable(false);
        this._itemListWindow.setAppraiseLevel(this._appraiseLevel);
        this._itemListWindow.setHandler("ok", this.onItemListWindowOk.bind(this));
        this._itemListWindow.setHandler("cancel", this.onItemListWindowCancel.bind(this));
        this._itemListWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._itemListWindow);
    };


    /**
     * アイテムリストウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域を表すRectangleオブジェクト。
     */
    Scene_Appraise.prototype.itemListWindowRect = function() {
        const rect = this.itemCountWindowRect();
        const ww = 480;
        const wy = rect.y + rect.height;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 結果ウィンドウを作成する。
     */
    Scene_Appraise.prototype.createResultWindow = function() {
        const rect = this.resultWindowRect();
        this._resultWindow = new Window_AppraiseResult(rect);
        this._resultWindow.hide();
        this._resultWindow.setHandler("ok", this.onResultWindowOkOrCancel.bind(this))
        this._resultWindow.setHandler("cancel", this.onResultWindowOkOrCancel.bind(this))
        this.addWindow(this._resultWindow);
    };

    /**
     * 結果ウィンドウをを配置するウィンドウ矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域を表すRectangleオブジェクト
     */
    Scene_Appraise.prototype.resultWindowRect = function() {
        const ww = 640;
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 280;
        return new Rectangle(wx, wy, ww, wh);
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
        const targetItem = this._itemListWindow.item();
        const appraiseItem = this._item;
        const newItem = _getAppraisedItem(targetItem.appraisedItem);
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
     * 
     * @return {Boolean} 継続可能な場合にはtrue, それ以外はfalse
     */
    Scene_Appraise.prototype.isContinuous = function() {
        if (DataManager.isItem(this._item)) {
            const itemCount = $gameParty.numItems(this._item);
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
    // Window_AppraiseShopCommand
    //

    Window_AppraiseShopCommand.prototype = Object.create(Window_Command.prototype);
    Window_AppraiseShopCommand.prototype.constructor = Window_AppraiseShopCommand;

    /**
     * 宇ウィンドウショップコマンドを
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_AppraiseShopCommand.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    /**
     * コマンドリストを作成する。
     */
    Window_AppraiseShopCommand.prototype.makeCommandList = function() {
        this.addCommand(labelAppraisal, "appraise", true);
        this.addCommand(labelAllAppraisal, "allappraise", true);
        this.addCommand(TextManager.cancel, "cancel", true);
    };

    //------------------------------------------------------------------------------
    // Game_Action
    // 
    if (Game_Action.EFFECT_APPRAISE) {
        const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
        /**
         * 効果を適用可能かどうかを判定する。
         * codeに対応する判定処理が定義されていない場合、適用可能(true)が返る。
         * 
         * @param {Game_BattlerBase} target 対象
         * @param {DataEffect} effect エフェクトデータ
         * @return {Boolean} 適用可能な場合にはtrue, それ以外はfalse
         */
        Game_Action.prototype.testItemEffect = function(target, effect) {
            if (Game_Action.EFFECT_APPRAISE
                    && (effect.code === Game_Action.EFFECT_APPRAISE)) {
                // 戦闘中以外は使用可能
                return !$gameParty.inBattle();
            } else {
                return _Game_Action_testItemEffect.call(this, target, effect);
            }
        };
    }

    //------------------------------------------------------------------------------
    // Scene_ItemBase
    // 
    if (Game_Action.EFFECT_APPRAISE) {
        const _Scene_ItemBase_determineItem = Scene_ItemBase.prototype.determineItem;
        /**
         * アイテム選択で決定操作されたときの処理を行う。
         */
        Scene_ItemBase.prototype.determineItem = function() {
            const item = this.item();
            if (item.effects.some((effect) => effect.code === Game_Action.EFFECT_APPRAISE)) {
                // シーン呼び出しする。
                SceneManager.push(Scene_Appraise);
                SceneManager.prepareNextScene(this.user(), item);
            } else {
                _Scene_ItemBase_determineItem.call(this);
            }
        };
    }
    //------------------------------------------------------------------------------
    // Scene_AppraiseShop
    // 

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
     * 
     * @param {Number} alevel 鑑定レベル。
     */
    Scene_AppraiseShop.prototype.prepare = function(alevel, filename) {
        this._appraiseLevel = alevel;
        this._clerkFileName = filename || "";
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
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this.addWindow(this._goldWindow);
    };

    /**
     * 所持金ウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     */
    Scene_AppraiseShop.prototype.goldWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);    
    }

    /**
     * コマンドウィンドウを作成する。
     */
    Scene_AppraiseShop.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_AppraiseShopCommand(rect);
        this._commandWindow.setHandler("ok",     this.onCommandOk.bind(this));
        this._commandWindow.setHandler("cancel", this.onCommandCancel.bind(this));
        this.addWindow(this._commandWindow);
    };

    /**
     * コマンドウィンドウの矩形領域を取得する。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     */
    Scene_AppraiseShop.prototype.commandWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);
        const wx = Graphics.boxWidth - ww;
        const goldWindowRect = this.goldWindowRect();
        const wy = goldWindowRect.y + goldWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 鑑定ウィンドウを作成する。
     */
    Scene_AppraiseShop.prototype.createItemListWindow = function() {
        const rect = this.itemWindowRect();
        this._itemListWindow = new Window_AppraiseItemList(rect);
        this._itemListWindow.setPriceVisiable(true);
        this._itemListWindow.setAppraiseLevel(this._appraiseLevel);
        this._itemListWindow.hide();
        this._itemListWindow.setHandler("ok", this.onItemListWindowOk.bind(this));
        this._itemListWindow.setHandler("cancel", this.onItemListWindowCancel.bind(this));
        this._itemListWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._itemListWindow);
    };

    /**
     * アイテムウィンドウ矩形領域を取得する。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     */
    Scene_AppraiseShop.prototype.itemWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 鑑定結果ウィンドウを作成する。
     */
    Scene_AppraiseShop.prototype.createResultWindow = function() {
        const rect = this.resultWindowRect();
        this._resultWindow = new Window_AppraiseResult(rect);
        this._resultWindow.hide();
        this._resultWindow.setHandler("ok", this.onResultWindowOk.bind(this))
        this._resultWindow.setHandler("cancel", this.onResultWindowCancel.bind(this))
        this.addWindow(this._resultWindow);
    };

    /**
     * 結果ウィンドウのウィンドウ矩形領域を取得する。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     */
    Scene_AppraiseShop.prototype.resultWindowRect = function() {
        return this.itemWindowRect();
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
        console.log("clerk bitmap loaded.");
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
        Scene_MenuBase.prototype.start.call(this);
        this._itemListWindow.setMonery($gameParty.gold());
        //this._goldWindow.show();
        this._commandWindow.show();
        this._commandWindow.activate();
    };

    /**
     * コマンドウィンドウでOK操作されたとき
     */
    Scene_AppraiseShop.prototype.onCommandOk = function() {
        switch (this._commandWindow.currentSymbol()) {
            case "appraise":
                this._commandWindow.deactivate();
                this._commandWindow.hide();
                this._itemListWindow.activate();
                this._itemListWindow.show();
                break;
            case "allappraise":
                this.doAllApprise();
                break;
        }
    };

    /**
     * 全部鑑定を実行する。
     */
    Scene_AppraiseShop.prototype.doAllApprise = function() {
        // 割引システム入れようかと思ったけどやめた。
        const items = [];
        const alevel = this._appraiseLevel;

        // 鑑定可能対象を集める。
        $gameParty.items().forEach(function(item) {
            if (item.appraisedItem
                    && (DataManager.getItemAppraiseLevel(item) <= alevel)) {
                items.push(item);
            }
        });

        this._appraiseItems = items;
        if (this._appraiseItems.length === 0) {
            this._commandWindow.activate();
            return;
        } else {
            this._commandWindow.deactivate();
            this.nextAppraise();
            this._resultWindow.setHandler("ok", this.onAppraiseOk.bind(this))
            this._resultWindow.setHandler("cancel", this.onAppraiseCancel.bind(this))
        }
    };

    /**
     * 次のアイテムを鑑定する。
     */
    Scene_AppraiseShop.prototype.nextAppraise = function() {
        // 最大で10個まで連続鑑定する。
        const appraisedItems = [];
        for (let i = 0; (i < 10) && (this._appraiseItems.length > 0); i++) {
            const item = this._appraiseItems[0]; // 先頭を取り出す。
            const newItem = _getAppraisedItem(item.appraisedItem);
            const price = DataManager.getItemAppraisePrice(item);
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
            this._resultWindow.setHandler("ok", this.onResultWindowOk.bind(this))
            this._resultWindow.setHandler("cancel", this.onResultWindowCancel.bind(this))
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
            this._resultWindow.setHandler("ok", this.onResultWindowOk.bind(this))
            this._resultWindow.setHandler("cancel", this.onResultWindowCancel.bind(this))
            this._itemListWindow.hide();
            this._resultWindow.hide();
            this._commandWindow.activate();
        }
    };

    /**
     * 全部鑑定中にキャンセルされた。
     */
    Scene_AppraiseShop.prototype.onAppraiseCancel = function() {
        this._resultWindow.setHandler("ok", this.onResultWindowOk.bind(this))
        this._resultWindow.setHandler("cancel", this.onResultWindowCancel.bind(this))
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
        const item = this._itemListWindow.item();
        const price = DataManager.getItemAppraisePrice(item);
        $gameParty.loseGold(price);
        const newItem = _getAppraisedItem(item.appraisedItem);
        $gameParty.loseItem(item, 1, false);
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
})();