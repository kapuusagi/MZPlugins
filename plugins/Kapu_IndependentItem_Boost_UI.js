/*:ja
 * @target MZ 
 * @plugindesc IndependentItem_BoostプラグインのUI実装
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem
 * @orderAfter Kapu_IndependentItem
 * @base Kapu_IndependentItem_Boost
 * @orderAfter Kapu_IndependentItem_Boost
 * 
 * @command openShop
 * @text 強化屋を開く
 * @desc 強化店を開きます。
 * 
 * @arg maxBoost
 * @text 最大強化レベル
 * @desc この強化屋で強化可能な最大レベル。強化段階より高いと成功率が
 * @type number
 * @default 1
 * 
 * @arg smithLevel
 * @text 鍛冶屋レベル
 * @desc 強化成功率に関係する。
 * @type number
 * @default 0
 * 
 * @arg clerkFileName
 * @text 店員画像
 * @desc 店員として表示する画像ファイル名。既定ではコマンドウィンドウ下の方に表示される。
 * @type file
 * @dir img/pictures/
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
 * @arg enableResetBoost
 * @text 強化リセット有効
 * @type boolean
 * @default true
 * 
 * @arg enableReinitialize
 * @text 再初期化有効
 * @type boolean
 * @default true
 * 
 * @arg enableRename
 * @text 命名有効
 * @type boolean
 * @default true
 * 
 * @arg textHelpBoost
 * @text 強化ヘルプテキスト
 * @type multiline_string
 * @default
 * 
 * @arg textHelpResetBoost
 * @text 強化リセットヘルプテキスト
 * @type multiline_string
 * @default
 * 
 * @arg textHelpReinitialize
 * @text 再初期化ヘルプテキスト
 * @type multiline_string
 * @default
 * 
 * @arg textHelpRename
 * @text リネームヘルプテキスト
 * @type multiline_string
 * @default
 * 
 * @arg textHelpCancel
 * @text キャンセルヘルプテキスト
 * @type multiline_string
 * 
 * 
 * @param maxItemNameWidth
 * @text リネームウィンドウ入力文字数最大
 * @type number
 * @default 16
 * 
 * 
 * @param textBoost
 * @text ショップ強化コマンド
 * @desc ショップに表示する強化メニューとして表示する文字列。
 * @type string 
 * @default 強化
 * 
 * @param textResetBoost
 * @text ショップリセット強化コマンド
 * @desc ショップに表示する強化リセットメニューとして表示する文字列。
 * @type string
 * @default 強化リセット
 * 
 * @param textReinitialize
 * @text ショップ再初期化コマンド
 * @desc ショップに表示する再初期化メニューとして表示する文字列。
 * @type string
 * @default 打ち直し
 * 
 * @param textRename
 * @text リネームコマンド
 * @desc ショップに表示するリネームメニューとして表示する文字列。
 * @type string
 * @default 命名
 * 
 * @param textBoostCount
 * @text 強化回数テキスト
 * @desc 強化回数として表示するラベル
 * @type string
 * @default 強化回数
 * 
 * @param textMaxBoosted
 * @text 最大強化済みテキスト
 * @desc 最大強化済みであることを表示するラベル
 * @type string
 * @default 最大
 * 
 * @param textInsufficientSkillLevel
 * @text 技能不足テキスト
 * @desc スキルレベルが足りない場合に表示する文字列。
 * @type string
 * @default 技量不足
 * 
 * @param textBoostItem
 * @text 強化アイテムテキスト
 * @desc 強化アイテム項目名として表示する文字列。
 * @type string
 * @default 強化アイテム
 * 
 * @param textCatalystItem
 * @text 強化素材テキスト
 * @desc 強化素材項目冥として表示する文字列。
 * @type string
 * @default 強化素材
 * 
 * @param textSuccessRate
 * @text 成功率ラベル
 * @desc 成功率ラベルとして表示する文字列。
 * @type string
 * @default 成功率
 * 
 * @param textConfirmResetBoost
 * @text 強化リセット確認テキスト
 * @desc 強化リセット実行前確認に表示する文字列。(%1にアイテム名前)
 * @type string
 * @default %1の強化リセットを行う
 * 
 * @param textConfirmReinitialize
 * @text 打ち直し確認テキスト
 * @desc 打ち直し実行前に表示する文字列。(%1にアイテム名)
 * @type string
 * @default %1の打ち直しを行う
 * 
 * @param defaultTextHelpBoost
 * @text 強化コマンドのヘルプメッセージ
 * @type string
 * @default 装備品を強化します。
 * 
 * @param defaultTextHelpResetBoost
 * @text 強化リセットコマンドのヘルプメッセージ
 * @type string
 * @default 装備品の強化状態をリセットします。
 * 
 * @param defaultTextHelpReinitialize
 * @text 打ち直しコマンドのヘルプメッセージ
 * @type string
 * @default 装備品を打ち直します。
 * 
 * @param defaultTextHelpRename
 * @text 命名コマンドのヘルプメッセージ
 * @type string
 * @default 装備品に名前を付けます。
 * 
 * @param defaultTextHelpCancel
 * @text キャンセルコマンドのヘルプメッセージ
 * @type string
 * @default 店を出ます。
 * 
 * @param resetBoostAnimationId
 * @text 強化リセットアニメーション
 * @type animation
 * @default 0
 * 
 * @param reinitializeAnimationId
 * @text 打ち直しアニメーション
 * @type animation
 * @default 0
 * 
 * @param boostSuccessAnimationId
 * @text 強化成功時アニメーション
 * @type animation
 * @default 0
 * 
 * @param boostFailureAnimationId
 * @text 強化失敗時アニメーション
 * @type animation
 * @default 0
 * 
 * @help 
 * BoostプラグインのUIを提供します。
 * プラグインコマンド openShop/店を開く にて、強化店を開きます。
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * 特になし。
 *   
 * ============================================
 * プラグインコマンド
 * ============================================
 * openShop/強化店を開く
 *    強化店を開きます。
 *    戦闘中は呼び出しても何も起こりません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 武器/防具
 *   <disableRename>
 *     武器/防具をリネームできないように指定します。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作確認。
 */


 /**
  * 鍛冶屋コマンド
  */
  function Window_BlacksmithShopCommand() {
    this.initialize(...arguments);
}

/**
 * 鍛冶屋シーン
 */
function Scene_BlacksmithShop() {
    this.initialize(...arguments);
}

Scene_BlacksmithShop.SHOP_MODE_BOOST = 0;
Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST = 1;
Scene_BlacksmithShop.SHOP_MODE_REINITIALIZE = 2;
Scene_BlacksmithShop.SHOP_MODE_RENAME = 3;

/**
 * Window_BlacksmithItemList
 * 
 * 強化対象アイテムリストウィンドウ
 */
function Window_BlacksmithItemList() {
    this.initialize(...arguments);
}
/**
 * Window_BlacksmithCatalystList
 * 
 * 強化素材リスト表示ウィンドウ
 */
function Window_BlacksmithCatalystList() {
    this.initialize(...arguments);
}

/**
 * Window_BlacksmithNumberInput
 * 
 * 使用する触媒個数を入力するためのウィンドウ。
 * Window_NumberInputベースで作成する。
 * 成功率などは別ウィンドウで表示する。
 */
function Window_BlacksmithNumberInput() {
    this.initialize(...arguments);
}

/**
 * Window_BlacksmithConfirm
 * 
 * リセット時に実行確認をするためのウィンドウ
 */
function Window_BlacksmithConfirm() {
    this.initialize(...arguments);
}


/**
 * Window_BlacksmithCatalystItem
 * 
 * 選択されているアイテムと触媒を表示するウィンドウ。
 * 個数と強化成功率を表示する。
 */
function Window_BlacksmithCatalystItem() {
    this.initialize(...arguments);
}

/**
 * 名前エディットウィンドウ
 */
function Window_BlacksmithNameEdit() {
    this.initialize(...arguments);
}


(() => {
    const pluginName = "Kapu_IndependentItem_Boost_UI";
    const parameters = PluginManager.parameters(pluginName);

    const textBoost = parameters["textBoost"] || "Boost";
    const textResetBoost = parameters["textResetBoost"] || "Reset boost";
    const textReinitialize = parameters["textReinitialize"] || "Reinitialize";
    const textRename = parameters["textRename"] || "Rename";
    const textInsufficientSkillLevel = parameters["textInsufficientSkillLevel"] || "Unboostable";
    const textBoostItem = parameters["textBoostItem"] || "BoostItem";
    const textCatalystItem = parameters["textCatalystItem"] || "CatalystItem";
    const textSuccessRate = parameters["textSuccessRate"] || "SuccessRate";
    const textConfirmResetBoost = parameters["textConfirmResetBoost"] || ""; 
    const textConfirmReinitialize = parameters["textConfirmReinitialize"] || "";
    const textBoostCount = parameters["textBoostCount"] || "Boost";
    const textMaxBoosted = parameters["textMaxBoosted"] || "MAX";
    const defaultTextHelpBoost = parameters["defaultTextHelpBoost"] || "";
    const defaultTextHelpResetBoost = parameters["defaultTextHelpResetBoost"] || "";
    const defaultTextHelpReinitialize = parameters["defaultTextHelpReinitialize"] || "";
    const defaultTextHelpRename = parameters["defaultTextHelpRename"] || "";
    const defaultTextHelpCancel = parameters["defaultTextHelpCancel"] || "";
    const maxItemNameWidth = (Number(parameters["maxItemNameWidth"]) > 0)
            ? Number(parameters["maxItemNameWidth"]) : 16;
    
    const resetBoostAnimationId = Number(parameters["resetBoostAnimationId"]) || 0;
    const reinitializeAnimationId = Number(parameters["reinitializeAnimationId"]) || 0;
    const boostSuccessAnimationId = Number(parameters["boostSuccessAnimationId"]) || 0;
    const boostFailureAnimationId = Number(parameters["boostFailureAnimationId"]) || 0;


    PluginManager.registerCommand(pluginName, "openShop", args => {
        if ($gameParty.inBattle()) {
            console.error("Could not open shop in battle.");
            return ;
        }

        const clerkFileName = String(args.clerkFileName) || "";
        const enableResetBoost = (typeof args.enableResetBoost === "undefined")
                ? false : (args.enableResetBoost === "true");
        const enableReinitialize = (typeof args.enableReinitialize === "undefined")
                ? false : (args.enableReinitialize === "true");
        const enableRename = (typeof args.enableRename === "undefined")
                ? false : (args.enableRename === "true");
        const sceneShopArgs = {
            maxBoost : Number(args.maxBoost) || 0,
            smithLevel : Number(args.smithLevel) || 0,
            clerkFileName : clerkFileName,
            clerkOffsetX : Number(args.clerkOffsetX) || 0,
            clerkOffsetY : Number(args.clerkOffsetY) || 0,
            enableResetBoost : enableResetBoost,
            enableReinitialize : enableReinitialize,
            enableRename : enableRename
        };
        sceneShopArgs.msgs = {
            textHelpBoost: args.textHelpBoost || "",
            textHelpResetBoost: args.textHelpResetBoost || "",
            textHelpReinitialize: args.textHelpReinitialize || "",
            textHelpRename: args.textHelpRename || "",
            textHelpCancel: args.textHelpCancel || ""
        }

        SceneManager.push(Scene_BlacksmithShop);
        SceneManager.prepareNextScene(sceneShopArgs);
    });


    //------------------------------------------------------------------------------
    // Window_BlacksmithShopCommand
    Window_BlacksmithShopCommand.prototype = Object.create(Window_Command.prototype);
    Window_BlacksmithShopCommand.prototype.constructor = Window_BlacksmithShopCommand;

    /**
     * ウィンドウ矩形領域
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BlacksmithShopCommand.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this._textHelpBoost = "";
        this._textHelpResetBoost = "";
        this._textHelpReinitialize = "";
        this._textHelpRename = "";
        this._textHelpCancel = "";
        this._enableResetBoost = false;
        this._enableReinitialize = false;
        this._enableRename = false;
        this.refresh();
    };

    /**
    * コマンドリストを作成する。
    */
    Window_BlacksmithShopCommand.prototype.makeCommandList = function() {
        this.addCommand(textBoost, "boost");
        if (this._enableResetBoost) {
            this.addCommand(textResetBoost, "reset-boost");
        }
        if (this._enableReinitialize) {
            this.addCommand(textReinitialize, "reinitialize");
        }
        if (this._enableRename) {
            this.addCommand(textRename, "rename");
        }
        this.addCommand(TextManager.cancel, "cancel");
    };

    /**
     * ヘルプメッセージを更新する。
     */
    Window_BlacksmithShopCommand.prototype.updateHelp = function() {
        Window_Command.prototype.updateHelp.call(this);
        this._helpWindow.setText(this.helpText(this.currentSymbol()));
    };

    /**
     * ヘルプテキストを取得する。
     * 
     * @param {string} symbol シンボル
     * @returns {string} テキスト
     */
    Window_BlacksmithShopCommand.prototype.helpText = function(symbol) {
        switch (symbol) {
            case "boost":
                return this._textHelpBoost || "";
            case "reset-boost":
                return this._textHelpResetBoost || "";
            case "reinitialize":
                return this._textHelpReinitialize || "";
            case "rename":
                return this._textHelpRename || "";
            case "cancel":
                return this._textHelpCancel || "";
            default:
                return "";
        }
    };

    /**
     * 強化コマンドに対応するヘルプメッセージを設定する。
     * 
     * @param {string} text ヘルプメッセージ
     */
    Window_BlacksmithShopCommand.prototype.setHelpTextBoost = function(text) {
        this._textHelpBoost = text;
        this.callUpdateHelp();
    };

    /**
     * 強化リセットコマンドに対応するヘルプメッセージを設定する。
     * 
     * @param {string} text ヘルプメッセージ
     */
    Window_BlacksmithShopCommand.prototype.setHelpTextResetBoost = function(text) {
        this._textHelpResetBoost = text;
        this.callUpdateHelp();
    };

    /**
     * 再初期化を有効にするかどうかを設定する。
     * 
     * @param {boolean} enabled 有効にする場合にはtrue, それ以外はfalse
     */
    Window_BlacksmithShopCommand.prototype.setReinitializeEnable = function(enabled) {
        this._enableReinitialize = enabled;
        this.refresh();
    };
    /**
     * 強化リセットを有効にするかどうかを設定する。
     * 
     * @param {boolean} enabled 有効にする場合にはtrue, それ以外はfalse
     */
    Window_BlacksmithShopCommand.prototype.setResetBoostEnable = function(enabled) {
        this._enableResetBoost = enabled;
        this.refresh();
    };

    /**
     * リネームを有効にするかどうかを設定する。
     * 
     * @param {boolean} enabled 有効にする場合にはtrue, それ以外はfalse
     */
    Window_BlacksmithShopCommand.prototype.setRenameEnable = function(enabled) {
        this._enableRename = enabled;
        this.refresh();
    };

    /**
     * 再初期化コマンドに対応するヘルプメッセージを設定する。
     * 
     * @param {string} text ヘルプメッセージ
     */
    Window_BlacksmithShopCommand.prototype.setHelpTextReinitialize = function(text) {
        this._textHelpReinitialize = text;
        this.callUpdateHelp();
    };

    /**
     * リネームコマンドに対応するヘルプメッセージを設定する。
     * 
     * @param {strng} text ヘルプメッセージ
     */
    Window_BlacksmithShopCommand.prototype.setHelpRename = function(text) {
        this._textHelpRename = text;
        this.callUpdateHelp();
    };

    /**
     * キャンセルコマンドに対応するヘルプメッセージを設定する。
     * 
     * @param {string} text ヘルプメッセージ
     */
    Window_BlacksmithShopCommand.prototype.setHelpTextCancel = function(text) {
        this._textHelpCancel = text;
        this.callUpdateHelp();
    };



    //------------------------------------------------------------------------------
    // Window_BlacksmithItemList
    Window_BlacksmithItemList.prototype = Object.create(Window_Selectable.prototype);
    Window_BlacksmithItemList.prototype.constructor = Window_BlacksmithItemList;

    /**
     * 強化対象のアイテムリストを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     * @param {Array<object>} items アイテムリスト
     */
    Window_BlacksmithItemList.prototype.initialize = function(rect, items) {
        this._items = items;
        this._smithLevel = 0;
        this._money = 0;
        this._maxBoostCount = 0;
        this._mode = Scene_BlacksmithShop.SHOP_MODE_BOOST;
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
        this.select(0);
    };

    /**
     * 鍛冶屋レベルを設定する。
     * 
     * @param {number} level レベル
     */
    Window_BlacksmithItemList.prototype.setSmithLevel = function(level) {
        this._smithLevel = level;
        this.refresh();
    }

    /**
     * 最大強化回数を設定する。
     * 
     * @param {number} maxBoostCount 最大強化回数
     */
    Window_BlacksmithItemList.prototype.setMaxBoostCount = function(maxBoostCount) {
        this._maxBoostCount = maxBoostCount;
        this.refresh();
    };

    /**
     * ショップモードを設定する。
     * 
     * @param {number} mode ショップモード(Scene_Shop.SHOP_MODE_～)
     */
    Window_BlacksmithItemList.prototype.setShopMode = function(mode) {
        if (this._mode !== mode) {
            this._mode = mode;
            this.refresh();
        }
    };

    /**
     * アイテム数を得る。
     * 
     * @returns {number} アイテム数
     */
    Window_BlacksmithItemList.prototype.maxItems = function() {
        return this._items ? this._items.length : 1;
    };

    /**
     * 選択されているアイテムを得る。
     * 
     * @returns {object} アイテム
     */
    Window_BlacksmithItemList.prototype.item = function() {
        return this._items[this.index()];
    };

    /**
     * 指定インデックスの項目を得る。
     * 
     * @param {number} index インデックス番号
     * @returns {object} 項目
     */
    Window_BlacksmithItemList.prototype.itemAt = function(index) {
        return ((index >= 0) && (index < this._items.length)) ? this._items[index] : null;
    };

    /**
     * 所持金を設定する。
     * 
     * @param {number} money 所持金
     */
    Window_BlacksmithItemList.prototype.setMoney = function(money) {
        this._money = money;
        this.refresh();
    };

    /**
     * 現在選択している項目が選択可能かどうかを判定して返す。
     * 
     * @returns {boolean} 選択可能な場合にはtrue, 選択できない場合にはfalse
     */
    Window_BlacksmithItemList.prototype.isCurrentItemEnabled = function() {
        const item = this.itemAt(this.index());
        return (item) ? this.isEnabled(item) : false;
    };

    /**
     * itemで指定される項目が有効かどうかを判定して返す。
     * 
     * @param {object} アイテム
     * @returns {boolean} 有効な場合にはtrue, 無効な場合にはfalse
     */
    Window_BlacksmithItemList.prototype.isEnabled = function(item) {
        if (item) {
            if ((this._mode === Scene_BlacksmithShop.SHOP_MODE_RENAME) && (item.meta.disableRename)) {
                return false;
            }


            if (this._mode === Scene_BlacksmithShop.SHOP_MODE_BOOST) {
                return (this.price(item) <= this._money) && DataManager.isBoostableItem(item)
                        && (item.boostCount < this._maxBoostCount);
            } else if (this._mode === Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST) {
                return (this.price(item) <= this._money) && (item.boostCount);
            } else {
                return this.price(item) <= this._money;
            }
        }
        return false;
    };
    /**
     * itemで指定されるアイテムの価格を得る。
     * 
     * @param {Data_Item} item アイテム
     * @returns {number} 価格が返る。
     */
    Window_BlacksmithItemList.prototype.price = function(item) {
        switch (this._mode) {
            case Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST:
                return DataManager.getResetBoostPrice(item);
            case Scene_BlacksmithShop.SHOP_MODE_REINITIALIZE:
                return DataManager.getResetPrice(item);
            case Scene_BlacksmithShop.SHOP_MODE_BOOST:
            default:
                return DataManager.getBoostPrice(item);
        }
    };

    /**
     * 更新する。
     */
    Window_BlacksmithItemList.prototype.refresh = function() {
        this.createContents();
        this.drawAllItems();
    };

    /**
     * indexで指定される項目を描画する。
     * 
     * @param {number} index インデックス
     */
    Window_BlacksmithItemList.prototype.drawItem = function(index) {
        const item = this._items[index];
        if (!item) {
            return;
        }

        const rect = this.itemRect(index);
        const boostCountWidth = 180;
        const rateWidth = 160;
        const priceWidth = 128 + this.textWidth(this.currencyUnit());
        const padding = this.itemPadding();
        rect.width -= this.itemPadding();
        let x = rect.x;
        const nameWidth = rect.width - boostCountWidth - priceWidth - rateWidth - padding * 3;
        
        this.changePaintOpacity(this.isEnabled(item));
        if (this._mode === Scene_BlacksmithShop.SHOP_MODE_RENAME) {
            this.drawItemName(item, rect.x, rect.y, nameWidth);
        } else {
            this.drawItemName(item, rect.x, rect.y, nameWidth);
            x += nameWidth + padding;
            this.drawBoostCount(item, x, rect.y, boostCountWidth);
            x += boostCountWidth + padding;
            this.resetTextColor();
            if ((this._mode === Scene_BlacksmithShop.SHOP_MODE_BOOST)
                    && (!DataManager.isBoostableItem(item) || (item.boostCount >= this._maxBoostCount))) {
                const textWidth = rect.width - x;
                this.drawText(textInsufficientSkillLevel, x, rect.y, textWidth, "right");
            } else {
                const rate = (this._mode === Scene_BlacksmithShop.SHOP_MODE_BOOST)
                        ? DataManager.getBoostSuccessRate(item, this._smithLevel, null, 1)
                        : 1.0;
                this.drawSuccessRate(textSuccessRate, rate, x, rect.y, rateWidth);
                x += rateWidth + padding;
                this.drawCurrencyValue(this.price(item), this.currencyUnit(), x, rect.y, priceWidth);
            }
        }
        this.changePaintOpacity(true);
    };

    /**
     * 強化回数を描画する。
     * 現在強化回数/最大強化回数で表示する。
     * 
     * @param {object} item 強化対象アイテム(DataArmor/DataWeapon)
     * @param {number} x 描画x位置
     * @param {number} y 描画y位置
     * @param {number} width 幅
     */
     Window_BlacksmithItemList.prototype.drawBoostCount = function(item, x, y, width) {
        const labelWidth = 64;
        const valueWidth = (width - 20 - labelWidth) / 2;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textBoostCount, x, y, labelWidth);
        x += labelWidth;
        this.resetTextColor();
        if (item.boostCount >= item.maxBoostCount) {
            this.drawText(textMaxBoosted, x, y, width - labelWidth);
        } else {
            this.drawText(item.boostCount, x, y, valueWidth, "right");
            x += valueWidth;
            this.drawText("/", x, y, 20, "center");
            x += 20;
            this.drawText(item.maxBoostCount, x, y, valueWidth, "right");
        }
    };

    /**
     * 成功率「成功率:xx%」を描画する。
     * 
     * @param {string} label ラベル文字列
     * @param {number} rate 成功率(0～1.0)
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
     Window_BlacksmithItemList.prototype.drawSuccessRate = function(label, rate, x, y, width) {
        const valueWidth = 56;
        const labelWidth = width - valueWidth;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(label + ":", x, y, labelWidth);
        this.resetTextColor();
        const rateStr = Math.floor(rate * 100) + "%";
        this.drawText(rateStr, x + labelWidth, y, valueWidth, "right");
    };

    /**
     * 所持金の単位を得る。
     * 
     * @returns {string} 所持金の単位
     */
    Window_BlacksmithItemList.prototype.currencyUnit = function() {
        return TextManager.currencyUnit;
    };

    /**
     * ヘルプメッセージを更新する。
     */
    Window_BlacksmithItemList.prototype.updateHelp = function() {
        this.setHelpWindowItem(this.item());
    };

    //------------------------------------------------------------------------------
    // Window_BlacksmithCatalystList
    Window_BlacksmithCatalystList.prototype = Object.create(Window_Selectable.prototype);
    Window_BlacksmithCatalystList.prototype.constructor = Window_BlacksmithCatalystList;

    /**
     * Window_BlacksmithCatalystListを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BlacksmithCatalystList.prototype.initialize = function(rect) {
        this._targetItem = null; // 強化対象のアイテム
        this._data = [];
        Window_Selectable.prototype.initialize.call(this, rect);
    };

    /**
     * ターゲットアイテムを設定する。
     * 
     * @param {Data_Item} item 強化対象のアイテム
     */
    Window_BlacksmithCatalystList.prototype.setTargetItem = function(item) {
        if (this._targetItem !== item) {
            this._targetItem = item;
            this.refresh();
        }
    };

    /**
     * 最大カラム数を取得する。
     * 
     * @returns {number} カラム数
     */
    Window_BlacksmithCatalystList.prototype.maxCols = function() {
        return 1;
    };

    /**
     * 最大項目数を取得する。
     * 
     * @returns {number} 最大項目数
     */
    Window_BlacksmithCatalystList.prototype.maxItems = function() {
        return this._data ? this._data.length : 1;
    };

    /**
     * 現在選択されているアイテムを取得する。
     * 
     * @returns {Data_Item} 触媒アイテム。
     */
    Window_BlacksmithCatalystList.prototype.item = function() {
        const index = this.index();
        return this._data && (index >= 0) ? this._data[index] : null;
    };

    /**
     * 現在選択している項目が選択可能かどうかを判定する。
     * 
     * @returns {boolean} 現在選択している項目が選択可能な場合にはtrue。
     */
    Window_BlacksmithCatalystList.prototype.isCurrentItemEnabled = function() {
        const item = this.item();
        return (item) ? this.isEnabled(item) : false;
    };

    /**
     * itemで指定される項目が適用可能かどうかを判定する。
     * 
     * @param {object} item 対象のアイテム
     * @returns {boolean} 適用可能な場合にはtrue, それ以外はfalse
     */
    Window_BlacksmithCatalystList.prototype.isEnabled = function(item) {
        if (!item) {
            return false;
        }
        return DataManager.isBoostCatalystApplicable(item, this._targetItem);
    };

    /**
     * 触媒アイテムリストを構築する。
     */
    Window_BlacksmithCatalystList.prototype.makeItemList = function() {
        this._data = [];
        $gameParty.items().forEach(function(item) {
            if (item.boostEffects && (item.boostEffects.length > 0)
                    && !DataManager.isIndependent(item)) {
                // ブーストエフェクトが1つ以上存在する。
                this._data.push(item);
            }
        }, this);
        if (this._data.length === 0) {
            this._data.push(null);
        }
    };

    /**
     * アイテムを描画する。
     * 
     * @param {number} index 項目インデックス
     */
    Window_BlacksmithCatalystList.prototype.drawItem = function(index) {
        const item = this._data[index];
        if (item) {
            const rateWidth = 160;
            const numberWidth = this.textWidth("000");
            const padding = this.itemPadding();
            const rect = this.itemRect(index);
            const nameWidth = rect.width - 20 - rateWidth - numberWidth - (padding * 3);

            let x = rect.x;
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, x, rect.y, nameWidth);
            x += (nameWidth + padding)
            this.resetTextColor();
            const rate = item.boostSuccessRate;
            this.drawSuccessRate(rate, x, rect.y, rateWidth);
            x += rateWidth + padding;

            this.drawText(":", x, rect.y, 20);
            x += 20;
            this.drawItemNumber(item, x, rect.y, numberWidth);
            this.changePaintOpacity(true);
        }
    };

    /**
     * 成功率「成功率:xx%」を描画する。
     * 
     * @param {number} rate 成功率(0～1.0)
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_BlacksmithCatalystList.prototype.drawSuccessRate = function(rate, x, y, width) {
        const valueWidth = 56;
        const labelWidth = width - valueWidth - this.itemPadding();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textSuccessRate, x, y, labelWidth);
         
        const rateStr = Math.floor(rate * 100) + "%";
        const textColor = (rate > 1.0) ? ColorManager.powerUpColor()
                : ((rate < 1.0) ? ColorManager.powerDownColor() : ColorManager.normalColor());
        this.changeTextColor(textColor);
        const valueText = this.multiplicationSign() + rateStr;
        this.drawText(valueText, x + labelWidth + this.itemPadding(), y, valueWidth, "left");
        this.resetTextColor();
    };

    /**
     * アイテムの数量を描画する。
     * 
     * @param {object} item アイテム
     * @param {number} x 描画x位置
     * @param {number} y 描画y位置
     * @param {number} width 描画幅
     */
    Window_BlacksmithCatalystList.prototype.drawItemNumber = function(item, x, y, width) {
        const itemCount = $gameParty.numItems(item);
        this.drawText(itemCount, x, y, width, "right");
    };


    /**
     * 個数の符号を得る
     * 
     * @returns {string} 個数の符号
     */
     Window_BlacksmithCatalystList.prototype.multiplicationSign = function() {
        return "\u00d7";
    };

    /**
     * 更新する。
     */
    Window_BlacksmithCatalystList.prototype.refresh = function() {
        this.createContents();
        this.makeItemList();
        this.drawAllItems();
    };

    /**
     * ヘルプメッセージを更新する。
     */
    Window_BlacksmithCatalystList.prototype.updateHelp = function() {
        this.setHelpWindowItem(this.item());
    };

    //------------------------------------------------------------------------------
    // Window_BlacksmithNumberInput
    //

    Window_BlacksmithNumberInput.prototype = Object.create(Window_NumberInput.prototype);
    Window_BlacksmithNumberInput.prototype.constructor = Window_BlacksmithNumberInput;

    /**
     * Window_BlacksmithNumberInputを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BlacksmithNumberInput.prototype.initialize = function(rect) {
        this._max = 0;
        Window_NumberInput.prototype.initialize.call(this);
        this.move(rect.x, rect.y, rect.width, rect.height);
    };

    /**
     * 入力値の最大値を設定する。
     * 
     * @param {number} max 最大値
     */
    Window_BlacksmithNumberInput.prototype.setMaximum = function(max) {
        this._max = max;
        this._number = this._number.clamp(0, this._max);
        this.refresh();
    };

    /**
     * 値をセットする。
     * 
     * @param {number} number 数値
     */
    Window_BlacksmithNumberInput.prototype.setNumber = function(number) {
        this._number = number.clamp(0, this._max);
        if (this.active && this._catalystWindow) {
            this._catalystWindow.setCatalystItemCount(this.number());
        }
        this.refresh();
    };

    /**
     * 値を取得する
     * 
     * @returns {number} 値
     */
    Window_BlacksmithNumberInput.prototype.number = function() {
        return this._number;
    };

    

    /**
     * 入力を開始する。
     */
    Window_BlacksmithNumberInput.prototype.start = function() {
        this._maxDigits = this.maxDigits();
        this.updatePlacement();
        this.placeButtons();
        this.createContents();
        this.refresh();
        this.open();
        this.activate();
        this.select(0);
        this.visible = true;
        for (const button of this._buttons) {
            button.visible = true;
        }
        this.select(this.maxItems() - 1);
    };

    /**
     * 位置を更新する。
     */
     Window_BlacksmithNumberInput.prototype.updatePlacement = function() {
         /* Do nothing. */
    };

    /**
     * 最大桁数を得る。
     * 
     * @returns {number} 最大桁数
     */
    Window_BlacksmithNumberInput.prototype.maxDigits = function() {
        let digit = 1;
        let tmp = this._max;
        while (tmp >= 10) {
            tmp /= 10;
            digit++;
        }

        return digit;
    };
    
    /**
     * キャンセル操作が有効かどうかを取得する。
     * 
     * @returns {boolean} キャンセル操作が有効な場合にはtrue, それ以外はfalse.
     * !!!overwrite!!! Window_NumberInput.isCancelEnabled
     *     キャンセル操作を有効にするため、オーバーライドする。
     */
    Window_BlacksmithNumberInput.prototype.isCancelEnabled = function() {
        return true;
    };

    /**
     * 値を変更する。
     * 
     * @param {boolean} up 上げる場合にはtrue, 下げる場合にはfalse
     */
    Window_BlacksmithNumberInput.prototype.changeDigit = function(up) {
        if (up && (this._number === this._max)) {
            // 最大値指定状態で増加操作の場合、最小値にする。
            this._number = 1;
        } else if (!up && (this._number === 1)) {
            // 最小値指定状態で減少操作の場合、最大値にする。
            this._number = this._max;
        } else {
            const index = this.index();
            const place = Math.pow(10, this._maxDigits - 1 - index);
            if (up) {
                this._number += place;
            } else {
                this._number -= place;
            }
            if (this._number < 1) {
                this._number = 1;
            } else if (this._number > this._max) {
                this._number = this._max;
            }
        }

        if (this.active && this._catalystWindow) {
            this._catalystWindow.setCatalystItemCount(this.number());
        }
        
        this.refresh();
        this.playCursorSound();
    };

    /**
     * OK処理を行う。
     */
     Window_BlacksmithNumberInput.prototype.processOk = function() {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    };

    /**
     * 成功率を表示するウィンドウを設定する。
     * 
     * @param {Window_BlacksmithCatalystItem} window 成功率を表示するウィンドウ
     */
    Window_BlacksmithNumberInput.prototype.setCatalystWindow = function(window) {
        this._catalystWindow = window;
    };

    //------------------------------------------------------------------------------
    // Window_BlacksmithCatalystItem
    // 選択されているアイテムと触媒を表示するウィンドウ。
    // 個数と強化成功率を表示する。


    Window_BlacksmithCatalystItem.prototype = Object.create(Window_Base.prototype);
    Window_BlacksmithCatalystItem.prototype.constructor = Window_BlacksmithCatalystItem;

    /**
     * Window_BlacksmithCatalystItem を初期化する。
     * 
     * @param {Rectangle} rect 
     */
    Window_BlacksmithCatalystItem.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._targetItem = null;
        this._catalystItem = null;
        this._catalystItemCount = 1;
        this._smithLevel = 0;
    };

    /**
     * 鍛冶屋レベルを設定する。
     * 
     * @param {number} level 鍛冶屋レベル
     */
     Window_BlacksmithCatalystItem.prototype.setSmithLevel = function(level) {
        this._smithLevel = level;
        this.refresh();
    }

    /**
     * 強化対象アイテムを設定する。
     * 
     * @param {object} item 強化対象アイテム(DataWeapon/DataArmor)
     */
    Window_BlacksmithCatalystItem.prototype.setTargetItem = function(item) {
        this._targetItem = item;
        this.refresh();
    };

    /**
     * 触媒アイテムと数量を設定する。
     * 
     * @param {object} item 触媒アイテム
     * @param {number} count 数量
     */
     Window_BlacksmithCatalystItem.prototype.setCatalystItem = function(item, count) {
        this._catalystItem = item;
        this._catalystItemCount = count;
        this.refresh();
    };

    /**
     * 触媒アイテムの数量を設定する。
     * 
     * @param {number} count 触媒アイテムの数量
     */
    Window_BlacksmithCatalystItem.prototype.setCatalystItemCount = function(count) {
        this._catalystItemCount = count;
        this.refresh();
    };

    /**
     * 表示を更新する。
     */
     Window_BlacksmithCatalystItem.prototype.refresh = function() {
        this.contents.clear();
        const x = this.itemPadding();
        let y = 0;
        const lineHeight = this.lineHeight();
        const contentsWidth = this.contentsWidth();
 
        // 1行目 強化アイテム
        this.changeTextColor(this.systemColor());
        this.drawText(textBoostItem, x, y, 120);
        this.drawText(":", x + 120, y, 20);
        if (this._targetItem) {
            this.resetTextColor();
            this.drawItemName(this._targetItem, x + 140, y, contentsWidth - 140);
        }
        y += lineHeight;

        // 2行目触媒
        this.changeTextColor(this.systemColor());
        this.drawText(textCatalystItem, x, y, 120);
        this.drawText(":", x + 120, y, 20);
        if (this._catalystItem) {
            this.resetTextColor();
            this.drawItemName(this._catalystItem, x + 140, y, contentsWidth - 140);
        }
        y += lineHeight;

        // 3行目 成功確率と効果記述
        // 強化素材の詳細はdescriptionでもいいかも。
        this.changeTextColor(this.systemColor());
        this.drawText(textSuccessRate, x, y, 120);
        this.drawText(":", x + 120, y, 20);
        if (this._catalystItem) {
            const rate = DataManager.getBoostSuccessRate(this._targetItem, this._smithLevel, this._catalystItem, this._catalystItemCount);
            const rateStr = Math.floor(rate * 100) + "%";
            this.resetTextColor();
            this.drawText(rateStr, x + 140, y, contentsWidth - 140);
        }
    };
    //------------------------------------------------------------------------------
    // Window_BlacksmithConfirm
    Window_BlacksmithConfirm.prototype = Object.create(Window_Selectable.prototype);
    Window_BlacksmithConfirm.prototype.constructor = Window_BlacksmithConfirm;

    /**
     * Window_BlacksmithConfirm を初期化する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域
     */
     Window_BlacksmithConfirm.prototype.initialize = function(rect) {
        this._items = [ "", TextManager.cancel ];
        Window_Selectable.prototype.initialize.call(this, rect);
    };

    /**
     * メッセージを表示する。
     */
     Window_BlacksmithConfirm.prototype.setMessage = function(msg) {
        this._items[0] = msg;
        this.refresh();
    };

    /**
     * 最大項目数を取得する。
     * @returns {number} 最大項目数
     */
    Window_BlacksmithConfirm.prototype.maxItems = function() {
        return this._items.length;
    };


    /**
     * 項目を描画する。
     * 
     * @param {number} index 描画する項目のインデックス番号
     */
     Window_BlacksmithConfirm.prototype.drawItem = function (index) {
        const rect = this.itemRect(index);
        const padding = this.itemPadding();
        this.resetTextColor();
        this.drawText(this._items[index], rect.x + padding, rect.y, rect.width - padding * 2, "left");
        this.changeTextColor(ColorManager.normalColor());
    };

    /**
     * OK処理を行う。
     */
    Window_BlacksmithConfirm.prototype.processOk = function() {
        if (this.index() == 0) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else {
            SoundManager.playCancel();
            this.updateInputData();
            this.deactivate();
            this.callCancelHandler();
        }
    };

    //------------------------------------------------------------------------------
    // 
    Window_BlacksmithNameEdit.prototype = Object.create(Window_NameEdit.prototype);
    Window_BlacksmithNameEdit.prototype.constructor = Window_BlacksmithNameEdit;

    /**
     * Window_BlacksmithNameEditウィンドウを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BlacksmithNameEdit.prototype.initialize = function(rect) {
        Window_NameEdit.prototype.initialize.call(this, rect);
    };


    /**
     * 名前入力ウィンドウを初期化する。
     * 
     * @param {object} item リネーム対象の名前。DataWeapon/DataArmor
     * @param {number} maxLength 最大長
     */
    Window_BlacksmithNameEdit.prototype.setup = function(item, maxLength) {
        this._maxLength = maxLength;
        this._name = item.name_org.slice(0, this._maxLength);
        this._index = this._name.length;
        this._defaultName = this._name;
        this.refresh();
    };

    /**
     * UIを描画する。
     */
    Window_BlacksmithNameEdit.prototype.refresh = function() {
        this.contents.clear();
        for (let i = 0; i < this._maxLength; i++) {
            this.drawUnderline(i);
        }
        for (let j = 0; j < this._name.length; j++) {
            this.drawChar(j);
        }
        const rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    };

    //------------------------------------------------------------------------------
    // Scene_BlacksmithShop
    //
    Scene_BlacksmithShop.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_BlacksmithShop.prototype.constructor = Scene_BlacksmithShop;

    /**
     * シーンを初期化する。
     */
    Scene_BlacksmithShop.initialize = function() {
        this._mode = Scene_BlacksmithShop.SHOP_MODE_BOOST;
        this._msgs = {};
        Scene_MenuBase.prototype.initialize.call();
    };

    /**
     * 作成前の準備をする。
     * 
     * @param {number} maxBoost この鍛冶屋が対応できる最大ブースト数
     * @param {number} smithLevel この鍛冶屋の技能レベル。高いほど成功しやすい。
     * @param {string} clerkFileName  店員の画像として使うファイル名
     * @param {number} clerkOffsetX 店員画像表示オフセットX
     * @param {number} clerkOffsetY 店員画像表示オフセットY
     * @param {object} msgs メッセージディクショナリ
     * 
     * @param {object} sceneShopArgs シーンのパラメータ
     *                               maxBoost : boolean この鍛冶屋で強化可能な最大レベル。
     *                               smithLevel : number
     */
    Scene_BlacksmithShop.prototype.prepare = function(sceneShopArgs) {
        this._maxBoost = sceneShopArgs.maxBoost;
        this._smithLevel = sceneShopArgs.smithLevel;
        this._clerkFileName = sceneShopArgs.clerkFileName;
        this._clerkOffsetX = sceneShopArgs.clerkOffsetX;
        this._clerkOffsetY = sceneShopArgs.clerkOffsetY;
        this._enableResetBoost = sceneShopArgs.enableResetBoost;
        this._enableReinitialize = sceneShopArgs.enableReinitialize;
        this._enableRename = sceneShopArgs.enableRename;
        this._msgs = sceneShopArgs.msgs;
    };

    /**
     * シーンを作成する。
     */
    Scene_BlacksmithShop.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createItemWindow();
        this.createCatalystWindow();
        this.createConfirmWindow();
        this.createSelectedItemWindow();
        this.createNumberInputWindow();
        this.createNameEditWindow();
        this.createNameInputWindow();
        this.createAnimationTarget();
        this.loadClerkPicture();
    };

    /**
     * ウィンドウレイヤーを構築する。
     */
     Scene_BlacksmithShop.prototype.createWindowLayer = function() {
        this.createClerkLayer();
        Scene_MenuBase.prototype.createWindowLayer.call(this);
    };

    /**
     * 店員画像描画用レイヤーを追加する。
     */
     Scene_BlacksmithShop.prototype.createClerkLayer = function() {
        this._clerkLayer = new Sprite();
        this.addChild(this._clerkLayer);
    };

    /**
     * ヘルプウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    };

    /**
     * 所持金表示ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createGoldWindow = function() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    };

    /**
     * 所持金ウィンドウを作成する。
     */
        Scene_BlacksmithShop.prototype.goldWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * コマンドウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_BlacksmithShopCommand(rect);
        this._commandWindow.setHandler("boost", this.onCommandBoost.bind(this));
        this._commandWindow.setHandler("reset-boost", this.onCommandResetBoost.bind(this));
        this._commandWindow.setHandler("reinitialize", this.onCommandReinitialize.bind(this));
        this._commandWindow.setHandler("rename", this.onCommandRename.bind(this));
        this._commandWindow.setHandler("cancel", this.onCommandCancel.bind(this));
        this.addWindow(this._commandWindow);

        this._commandWindow.setResetBoostEnable(this._enableResetBoost);
        this._commandWindow.setReinitializeEnable(this._enableReinitialize);
        this._commandWindow.setRenameEnable(this._enableRename);
        this._commandWindow.setHelpWindow(this._helpWindow);
        this._commandWindow.setHelpTextBoost(this._msgs["textHelpBoost"] || defaultTextHelpBoost);
        this._commandWindow.setHelpTextResetBoost(this._msgs["textHelpResetBoost"] || defaultTextHelpResetBoost);
        this._commandWindow.setHelpTextReinitialize(this._msgs["textHelpReinitialize"] || defaultTextHelpReinitialize);
        this._commandWindow.setHelpRename(this._msgs["textHelpRename"] || defaultTextHelpRename);
        this._commandWindow.setHelpTextCancel(this._msgs["textHelpCancel"] || defaultTextHelpCancel);
    };

    /**
     * コマンドウィンドウの矩形領域を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.commandWindowRect = function() {
        const rect = this.goldWindowRect();
        const wx = rect.x;
        const wy = rect.y + rect.height;
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(5, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 強化品リストウィンドウを開く。
     */
    Scene_BlacksmithShop.prototype.createItemWindow = function() {
        // アイテム一覧を作るぜ。
        this.makeBoostableItemList();

        const rect = this.itemWindowRect();
        this._itemWindow = new Window_BlacksmithItemList(rect, this._items);
        this._itemWindow.setMaxBoostCount(this._maxBoost);
        this._itemWindow.setSmithLevel(this._smithLevel);
        this._itemWindow.hide();
        this._itemWindow.setHandler("ok", this.onItemWindowOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemWindowCancel.bind(this));
        this._itemWindow.setHandler("itemchange", this.onItemWindowItemChange.bind(this));
        this.addWindow(this._itemWindow);

        this._itemWindow.setHelpWindow(this._helpWindow);
    };

    /**
     * アイテムウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.itemWindowRect = function() {
        const goldWindowRect = this.goldWindowRect();
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight() - goldWindowRect.height;
        const wy = goldWindowRect.y + goldWindowRect.height;
        const wx = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 触媒選択ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createCatalystWindow = function() {
        const rect = this.catalystWindowRect();
        this._catalystWindow = new Window_BlacksmithCatalystList(rect);
        this._catalystWindow.setHandler("ok", this.onCatalystOk.bind(this));
        this._catalystWindow.setHandler("cancel", this.onCatalystCancel.bind(this));
        this._catalystWindow.setHandler("itemchange", this.onCatalystItemChange.bind(this));
        this._catalystWindow.hide();
        this.addWindow(this._catalystWindow);

        this._catalystWindow.setHelpWindow(this._helpWindow);
    };

    /**
     * 素材リストウィンドウを作成する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.catalystWindowRect = function() {
        const rect = this.itemWindowRect();
        const ww = rect.width / 2;
        const wh = rect.height;
        const wx = rect.x + ww;
        const wy = rect.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 確認ウィンドウの矩形領域を作成する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.createConfirmWindow = function() {
        const rect = this.confirmWindowRect();
        this._confirmWindow = new Window_BlacksmithConfirm(rect);
        this._confirmWindow.setHandler("ok", this.onConfirmOk.bind(this));
        this._confirmWindow.setHandler("cancel", this.onConfirmCancel.bind(this));
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        this.addWindow(this._confirmWindow);
    };

    /**
     * 確認ウィンドウの矩形領域を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.confirmWindowRect = function() {
        const ww = 480;
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 強化アイテムと素材表示ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createSelectedItemWindow = function() {
        const rect = this.selectedItemWindowRect();
        this._selectedItemWindow = new Window_BlacksmithCatalystItem(rect);
        this._selectedItemWindow.setSmithLevel(this._smithLevel);
        this._selectedItemWindow.hide();
        this.addWindow(this._selectedItemWindow);
    };

    /**
     * 強化対象と素材を表示するウィンドウ矩形領域を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.selectedItemWindowRect = function() {
        const ww = 480;
        const wh = this.calcWindowHeight(3, false);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 200;
        return new Rectangle(wx, wy, ww, wh);
    };



    /**
     * 数量入力ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createNumberInputWindow = function() {
        const rect = this.numberInputWindowRect();
        this._numberInputWindow = new Window_BlacksmithNumberInput(rect);
        this._numberInputWindow.hide();
        this._numberInputWindow.setHandler("ok", this.onNumberInputOk.bind(this));
        this._numberInputWindow.setHandler("cancel", this.onNumberInputCancel.bind(this));
        this.addWindow(this._numberInputWindow);

        this._numberInputWindow.setCatalystWindow(this._selectedItemWindow);
    };

    /**
     * 数値入力ウィンドウ矩形領域を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.numberInputWindowRect = function() {
        const rect = this.selectedItemWindowRect();
        const wx = rect.x;
        const wy = rect.y + rect.height;
        const ww = 240;
        const wh = this.calcWindowHeight(1, true) + 52;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 編集ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createNameEditWindow = function() {
        const rect = this.nameEditWindowRect();
        this._editWindow = new Window_BlacksmithNameEdit(rect);
        this._editWindow.hide();
        this._editWindow.deactivate();
        this.addWindow(this._editWindow);
    };

    /**
     * 編集ウィンドウのウィンドウ矩形領域を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域 
     */
    Scene_BlacksmithShop.prototype.nameEditWindowRect = function() {
        const inputWindowHeight = this.calcWindowHeight(9, true);
        const padding = $gameSystem.windowPadding();
        const ww = 600;
        const wh = ImageManager.faceHeight + padding * 2;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 入力ウィンドウを初期化する。
     */
    Scene_BlacksmithShop.prototype.createNameInputWindow = function() {
        const rect = this.nameInputWindowRect();
        this._inputWindow = new Window_NameInput(rect);
        this._inputWindow.setEditWindow(this._editWindow);
        this._inputWindow.setHandler("ok", this.onInputNameOk.bind(this));
        this._inputWindow.hide();
        this._inputWindow.deactivate();
        this.addWindow(this._inputWindow);
    };

    /**
     * 入力ウィンドウの矩形領域を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.nameInputWindowRect = function() {
        const wx = this._editWindow.x;
        const wy = this._editWindow.y + this._editWindow.height + 8;
        const ww = this._editWindow.width;
        const wh = this.calcWindowHeight(9, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 入力ウィンドウでOKが選択された時の処理を行う。
     */
    Scene_BlacksmithShop.prototype.onInputNameOk = function() {
        const targetItem = this._itemWindow.item();
        targetItem.name_org = this._editWindow.name();
        DataManager.updateBoostItemName(targetItem);
        this._editWindow.hide();
        this._editWindow.deactivate();
        this._inputWindow.hide();
        this._inputWindow.deactivate();
        this._itemWindow.activate();
        this._itemWindow.refresh();
    };


    /**
     * アニメーション表示用のターゲットを作成する。
     * これでいいのか分からんけどやってみよう。
     */
    Scene_BlacksmithShop.prototype.createAnimationTarget = function() {
        this._animationTargetSprite = new Sprite();
        this._animationTargetSprite.x = Graphics.boxWidth / 2;
        this._animationTargetSprite.y = Graphics.boxHeight / 2;
        this._animationTargetSprite.setFrame(0, 0, 0, 0);
        this.addChild(this._animationTargetSprite);

        this._animationSprite = null; // 実際にアニメーションさせてるスプライト(アニメーション中のみ存在)
    };

    /**
     * 店員用画像をロードする。
     */
    Scene_BlacksmithShop.prototype.loadClerkPicture = function() {
        if (this._clerkFileName) {
            this._clerkBitmap = ImageManager.loadPicture(this._clerkFileName, 0);
            if (!this._clerkBitmap.isReady()) {
                this._clerkBitmap.addLoadListener(this.addClerkSprite.bind(this));
            } else {
                this.addClerkSprite();
            }
        }
    };

    /**
     * 店員表示用スプライトを追加する。
     */
    Scene_BlacksmithShop.prototype.addClerkSprite = function() {
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
     * 強化対象のアイテム一覧を作成する。
     * この鍛冶屋レベルによってフィルタはしない。
     * (鍛冶屋レベルが足りないやつは、リストに表示して技量不足、と表示させる)
     */
    Scene_BlacksmithShop.prototype.makeBoostableItemList = function() {
        this._items = [];
        $gameParty.weapons().forEach(function(weapon) {
            if (DataManager.isBoostableItem(weapon)) {
                this._items.push(weapon);
            }
        }, this);
        $gameParty.armors().forEach(function(armor) {
            if (DataManager.isBoostableItem(armor)) {
                this._items.push(armor);
            }
        }, this);
    };

    /**
     * 所持金を取得する。
     * @returns {number} 所持金
     */
    Scene_BlacksmithShop.prototype.money = function() {
        return $gameParty.gold();
    };

    /**
     * シーンを開始する。
     */
    Scene_BlacksmithShop.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        // コマンドウィンドウをアクティブ化
        this._helpWindow.show();
        this._commandWindow.show();
        this._commandWindow.activate();
    };

    /**
     * シーンを更新する。
     */
     Scene_BlacksmithShop.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (this._animationSprite) {
            // アニメーション開始済み。
            if (!this._animationSprite.isPlaying()) {
                // アニメーション再生終了。
                this.removeChild(this._animationSprite);
                this._animationSprite.destroy();
                this._animationSprite = null;
            }
        }
    };

    /**
     * コマンドウィンドウで強化が選択されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCommandBoost = function() {
        this._mode = Scene_BlacksmithShop.SHOP_MODE_BOOST;
        this._itemWindow.setShopMode(this._mode);
        this._itemWindow.setMoney(this.money());
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.show();
        this._itemWindow.activate();
    };

    /**
     * コマンドウィンドウで強化リセットが選択されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCommandResetBoost = function() {
        this._mode = Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST;
        this._itemWindow.setShopMode(this._mode);
        this._itemWindow.setMoney(this.money());
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.show();
        this._itemWindow.activate();
    };

    /**
     * コマンドウィンドウで打ち直しが選択されたときに通知を受けとる。
     */
    Scene_BlacksmithShop.prototype.onCommandReinitialize = function() {
        this._mode = Scene_BlacksmithShop.SHOP_MODE_REINITIALIZE;
        this._itemWindow.setShopMode(this._mode);
        this._itemWindow.setMoney(this.money());
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.show();
        this._itemWindow.activate();
    };

    /**
     * コマンドウィンドウで命名が選択されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCommandRename = function() {
        this._mode = Scene_BlacksmithShop.SHOP_MODE_RENAME;
        this._itemWindow.setShopMode(this._mode);
        this._itemWindow.setMoney(this.money());
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.show();
        this._itemWindow.activate();
    };

    /**
     * アイテムウィンドウでOK操作されたとき。
     */
    Scene_BlacksmithShop.prototype.onItemWindowOk = function() {
        const item = this._itemWindow.item();
        switch (this._mode) {
            case Scene_BlacksmithShop.SHOP_MODE_BOOST:
                // 強化時
                this._itemWindow.deactivate();
                this._catalystWindow.setTargetItem(this._itemWindow.item());
                this._catalystWindow.select(0);
                this._helpWindow.setItem(this._catalystWindow.item());
                this._catalystWindow.show();
                this._catalystWindow.activate();
                break;
            case Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST:
                // 確認してOKなら強化リセット
                this._confirmWindow.setMessage(textConfirmResetBoost.format(item.name));
                this._confirmWindow.select(1); // キャンセルを選択状態にする。
                this._confirmWindow.activate();
                this._confirmWindow.show();
                break;
            case Scene_BlacksmithShop.SHOP_MODE_REINITIALIZE:
                // 確認してOKなら打ち直し。
                this._confirmWindow.setMessage(textConfirmReinitialize.format(item.name));
                this._confirmWindow.select(1); // キャンセルを選択状態にする。
                this._confirmWindow.activate();
                this._confirmWindow.show();
                break;
            case Scene_BlacksmithShop.SHOP_MODE_RENAME:
                // リネーム：リネーム用ウィンドウにセットしてアクティブ化
                this._editWindow.setup(this._itemWindow.item(), maxItemNameWidth);
                this._editWindow.show();
                this._inputWindow.show();
                this._inputWindow.activate();
                break;
            default:
                console.error("unknown blacksmith mode. " + this._mode);
                this._itemWindow.activate();
                break;
        }

    };

    /**
     * アイテムウィンドウでキャンセル操作されたとき。
     */
    Scene_BlacksmithShop.prototype.onItemWindowCancel = function() {
        // アイテムウィンドウを消去してコマンドウィンドウをアクティブ化
        this._itemWindow.hide();
        this._itemWindow.deactivate();
        this._commandWindow.activate();
        this._helpWindow.clear();
    };

    /**
     * アイテムウィンドウで項目が変更されたとき。
     */
    Scene_BlacksmithShop.prototype.onItemWindowItemChange = function() {
        this._helpWindow.setItem(this._itemWindow.item());
    };

    /**
     * コマンドウィンドウでキャンセル操作されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCommandCancel = function() {
        this.popScene();
    };

    /**
     * 触媒選択ウィンドウでOK操作されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCatalystOk = function() {
        this._selectedItemWindow.setTargetItem(this._itemWindow.item());
        const catalystItem = this._catalystWindow.item();
        this._selectedItemWindow.setCatalystItem(catalystItem, 1);
        this._numberInputWindow.setMaximum($gameParty.numItems(catalystItem));
        this._numberInputWindow.setNumber(1);
        this._selectedItemWindow.show();
        this._numberInputWindow.start();
    };

    /**
     * 触媒選択ウィンドウでキャンセル操作されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCatalystCancel = function() {
        this._catalystWindow.hide();
        this._catalystWindow.deactivate();
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.activate();
    };

    /**
     * 触媒選択ウィンドウで選択項目が変化したときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCatalystItemChange = function() {
        this._helpWindow.setItem(this._catalystWindow.item());
    };

    /**
     * 確認ウィンドウでOKが選択された時の処理を行う。
     */
    Scene_BlacksmithShop.prototype.onConfirmOk = function() {
        // Goldを消費して処理する。
        const item = this._itemWindow.item();
        const price = this._itemWindow.price(item);

        // シャリーン
        SoundManager.playShop();
        $gameParty.loseGold(price);

        // アニメーション再生 アニメーション待ちって無かったはず。
        if (this._mode === Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST) {
            this.startAnimation(this.resetBoostAnimationId());
            DataManager.resetBoost(item); // 強化リセット
        } else if (this._mode === Scene_BlacksmithShop.SHOP_MODE_REINITIALIZE) {
            this.startAnimation(this.reinitializeAnimationId());
            DataManager.reinitializeIndependentItem(item); // 全リセット
        }

        // 表示更新する。
        this._helpWindow.refresh();
        this._goldWindow.refresh();
        this._itemWindow.refresh();
        // 確認ウィンドウは消去してアイテム選択ウィンドウをアクティブ化
        this._confirmWindow.hide();
        this._itemWindow.activate();
    };


    /**
     * animationIdで指定されるアニメーションを表示する。
     * @param {number} animationId アニメーションID(0以下を指定すると表示しない)
     */
    Scene_BlacksmithShop.prototype.startAnimation = function(animationId) {
        if (animationId <= 0) {
            return;
        }
        const sprite = new Sprite_Animation();
        const targetSprites = [this._animationTargetSprite];
        sprite.targetObjects = targetSprites;
        const animation = $dataAnimations[animationId];
        sprite.setup(targetSprites, animation, false, 0, null);
        this._animationSprite = sprite;
        this.addChild(sprite);
    };

    /**
     * シーンがビジーかどうかを判定して返す。
     * 
     * @returns {boolean} ビジーの場合にはtrue,それ以外はfalse
     */
    Scene_BlacksmithShop.prototype.isBusy = function() {
        if (this._animationSprite && this._animationTargetSprite.isAnimationPlaying()) {
            return true;
        }
        return Scene_MenuBase.prototype.isBusy.call(this);
    };

    /**
     * 確認ウィンドウでキャンセル操作された
     */
    Scene_BlacksmithShop.prototype.onConfirmCancel = function() {
        // 確認ウィンドウを消して、対象アイテム選択に戻る。
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        this._itemWindow.activate();
    };

    /**
     * 数値入力にてOK操作された
     */
    Scene_BlacksmithShop.prototype.onNumberInputOk = function() {
        // 強化実行処理
        const targetItem = this._itemWindow.item();
        const catalystItem = this._catalystWindow.item();
        const smithLevel = this._smithLevel;
        const itemCount = this._numberInputWindow.number();
        const price = DataManager.getBoostPrice(targetItem);
        const rate = DataManager.getBoostSuccessRate(targetItem, smithLevel, catalystItem, itemCount);

        // シャリーン
        $gameParty.loseGold(price);
        $gameParty.loseItem(catalystItem, itemCount);
        const success = Math.random() <= rate;
        if (success) {
            this.startAnimation(this.boostSuccessAnimationId());
            DataManager.boostIndependentItem(targetItem, catalystItem);
        } else {
            this.startAnimation(this.boostFailureAnimationId());
        }

        // 数値選択ウィンドウ、アイテム表示、触媒ウィンドウを閉じて、
        // 対象選択ウィンドウに戻す。
        this._numberInputWindow.hide();
        this._selectedItemWindow.hide();
        this._catalystWindow.refresh();
        this._catalystWindow.hide();
        this._goldWindow.refresh();
        this._itemWindow.refresh();
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.activate();
    };

    /**
     * 数値入力にてキャンセルされた。
     */
    Scene_BlacksmithShop.prototype.onNumberInputCancel = function() {
        // 数値入力ウィンドウを閉じて、触媒選択ウィンドウに戻る。
        this._selectedItemWindow.hide();
        this._numberInputWindow.hide();
        this._catalystWindow.activate();
    };

    /**
     * 数値入力にて選択数が変わった。
     */
    Scene_BlacksmithShop.prototype.onNumberInputItemChange = function() {
        this._selectedItemWindow.setCatalystItem(this._catalystWindow.item(), this._numberInputWindow.number());
    };

    /**
     * 強化リセット時に表示するアニメーションIDを取得する。
     * 
     * @returns {number} アニメーションID
     */
    Scene_BlacksmithShop.prototype.resetBoostAnimationId = function() {
        return resetBoostAnimationId;
    };

    /**
     * 打ち直し時に表示するアニメーションIDを取得する。
     * 
     * @returns {number} アニメーションID
     */
    Scene_BlacksmithShop.prototype.reinitializeAnimationId = function() {
        return reinitializeAnimationId;
    };

    /**
     * 強化成功時のアニメーションIDを取得する。
     * 
     * @returns {number} アニメーションID
     */
    Scene_BlacksmithShop.prototype.boostSuccessAnimationId = function() {
        return boostSuccessAnimationId;
    };

    /**
     * 強化失敗時のアニメーションIDを取得する
     * 
     * @returns {number} アニメーションID
     */
    Scene_BlacksmithShop.prototype.boostFailureAnimationId = function() {
        return boostFailureAnimationId;
    };


})();
