/*:ja
 * @target MZ 
 * @plugindesc TWLD向けアイテムメニューUIプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem
 * @orderAfter Kapu_IndependentItem
 * @base Kapu_Twld_System
 * @orderAfter Kapu_Twld_System
 * @base Kapu_Base_ParamName
 * 
 * @param textInfo
 * @text 情報表示ラベル
 * @desc アイテム情報コマンドとして表示するテキスト
 * @type string
 * @default 情報
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
 * @param textUnknownInformation
 * @text 情報不明テキスト
 * @desc アイテムの情報を表示させない場合に代替表示させる文字列。
 * @type string
 * @default ???
 * 
 * @param textEffect
 * @text 効果テキスト
 * @desc 効果ラベルとして表示させる文字列
 * @type string
 * @default 効果
 * 
 * @param textPerformance
 * @text 性能テキスト
 * @desc 性能ラベルとして表示させる文字列
 * @type string
 * @default 性能
 * 
 * @param textWeaponType
 * @text 武器タイプラベル
 * @desc 武器タイプラベルとして表示する文字列
 * @type string
 * @default 種別
 * 
 * @param textWeaponTypeOther
 * @text 不明武器タイプテキスト
 * @desc 武器タイプに一致するものが無い場合のテキスト
 * @type string
 * @default その他
 * 
 * @param textArmorType
 * @text 防具タイプラベル
 * @desc 防具タイプラベルとして表示する文字列
 * @type string
 * @default 種別
 * 
 * @param textArmorTypeOther
 * @text 不明防具タイプテキスト
 * @desc 防具タイプに一致するものが無い場合のテキスト
 * @type string
 * @default その他
 * 
 * @param textLabelElement
 * @text 属性ラベルテキスト
 * @desc "属性"として表示するテキスト
 * @type string
 * @default 属性
 * 
 * @param textNoElement
 * @text 無属性ラベルテキスト
 * @desc "無属性"として表示するテキスト
 * @type string
 * @default 無
 * 
 * @param textWeaponRange
 * @text 武器レンジラベルテキスト
 * @desc 武器レンジとして表示するテキスト
 * @type string
 * @default 射程
 * 
 * @param textRangeShort
 * @text 短距離射程値テキスト
 * @desc 短距離射程を表す文字列
 * @type string
 * @default 近接
 * 
 * @param textRangeMiddle
 * @text 中距離射程値テキスト
 * @desc 中距離射程を表す文字列
 * @type string
 * @default 中距離
 * 
 * @param textRangeLong
 * @text 長距離射程値テキスト
 * @desc 長距離射程を表す文字列
 * @type string
 * @default 長距離
 * 
 * @param textHitRate
 * @text 命中率テキスト
 * @desc 命中率ラベルとして表示する文字列。
 * @type string
 * @default 基本命中率
 * 
 * @param textEquipEffect
 * @text 装備効果テキスト
 * @desc 装備効果ラベルとして表示する文字列
 * @type string
 * @default 装備効果
 * 
 * @param itemInfoWindowWidth
 * @text 情報ウィンドウ幅
 * @desc 情報ウィンドウの幅
 * @type number
 * @default 800
 * 
 * @param itemInfoWindowHeight
 * @text 情報ウィンドウ高さ
 * @desc 情報ウィンドウの幅
 * @type number
 * @default 600
 * 
 * 
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
 *   <hideInformation>
 *      情報表示させない。
 *   <hideInformationText:text$>
 *      情報表示させない場合に大体表示させるテキスト。
 *      未指定の場合にはプラグインパラメータで渡した手エキスとが使用される。
 * 
 * アイテム
 *   <effectsString:effectsString$>
 *      カンマ('<')で区切られた文字列。
 *      情報画面の効果欄に表示される。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 TWLD向けに作成したものを移植して実装。
 */
/**
 * Window_ItemCategoryVertical
 * ベーシックシステムでは水平方向メニュー構成だったのを垂直方向にするために作成した。
 */
function Window_ItemCategoryVertical() {
    this.initialize(...arguments);
}

/**
 * Window_ItemCommand
 * アイテム選択時に表示・選択させるウィンドウ。
 */
function Window_ItemCommand() {
    this.initialize(...arguments);
}

/**
 * Window_ItemInfo
 * アイテム情報を表示するウィンドウ
 */
function Window_ItemInfo() {
    this.initialize(...arguments);
}
(() => {
    const pluginName = "Kapu_Twld_UI_MenuItem";
    const parameters = PluginManager.parameters(pluginName);
    const textInfo = parameters["textInfo"] || "Info";
    const textUse = parameters["textUse"] || "Use";
    const textDiscard = parameters["textDiscard"] || "Discard";
    const textUnknownInformation = parameters["textUnknownInformation"] || "???";
    const textEffect = parameters["textEffect"] || "Effects";
    const textPerformance = parameters["textPerformance"] || "Performance";
    const textWeaponType = parameters["textWeaponType"] || "type";
    const textArmorType = parameters["textArmorType"] || "type";
    const textWeaponTypeOther = parameters["textWeaponTypeOther"] || "?";
    const textArmorTypeOther = parameters["textArmorTypeOther"] || "?";
    const textLabelElement = parameters["textLabelElement"] || "EL";
    const textNoElement = parameters["textNoElement"] || "-";
    const textWeaponRange = parameters["textWeaponRange"] || "Range";
    const textRangeShort = parameters["textRangeShort"] || "Short";
    const textRangeMiddle = parameters["textRangeMiddle"] || "Middle";
    const textRangeLong = parameters["textRangeLong"] || "Long";
    const textHitRate = parameters["textHitRate"] || "HitRate";
    const textEquipEffect = parameters["textEquipEffect"] || "Equip Effects";
    const itemInfoWindowWidth = Math.floor(Number(parameters["itemInfoWindowWidth"]) || 800);
    const itemInfoWindowHeight = Math.floor(Number(parameters["itemInfoWindowHeight"]) || 640);

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
            case "item":
                this.drawNormalItemCount(x, rect.y, numWidth);
                break;
            case "weapon":
                this.drawWeaponItemCount(x, rect.y, numWidth);
                break;
            case "armor":
                this.drawArmorItemCount(x, rect.y, numWidth);
                break;
            case "keyItem":
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
        const numLabel = itemCount + "/" + maxItemCount;
        if (itemCount >= maxItemCount) {
            this.changeTextColor(ColorManager.textColor(2));
        }
        this.drawText(numLabel, x, y, width, "right");
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
        const numLabel = itemCount + "/" + maxItemCount;
        if (itemCount >= maxItemCount) {
            this.changeTextColor(ColorManager.textColor(2));
        }
        this.drawText(numLabel, x, y, width, "right");
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
        const numLabel = itemCount + "/" + maxItemCount;
        if (itemCount >= maxItemCount) {
            this.changeTextColor(this.textColor(2));
        }
        this.drawText(numLabel, x, y, width, "right");
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
            this.addCommand(textInfo, "info", true);
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
    // Window_ItemInfo

    Window_ItemInfo.prototype = Object.create(Window_Selectable.prototype);
    Window_ItemInfo.prototype.constructor = Window_ItemInfo;

    /**
     * Window_ItemInfoを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_ItemInfo.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._item = null;
    };

    /**
     * アイテムを設定する。
     * 
     * @param {object} item アイテム
     */
    Window_ItemInfo.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };

    /**
     * タッチされたときの処理を行う。
     */
    Window_ItemInfo.prototype.onTouchOk = function() {
        // 項目選択状態によらず、完了させるためにprocessOkを呼び出す。
        this.processOk();
    };

    /**
     * 項目間のスペースを得る。
     * 
     * @returns {number} 項目間のスペース
     */
    Window_ItemInfo.prototype.spacing = function() {
        return 8;
    };

    /**
     * 表示を更新する。
     */
    Window_ItemInfo.prototype.refresh = function() {
        this.contents.clear();
        const item = this._item;
        if (!item) {
            return ;
        }
        const spacing = this.spacing();
        const lineHeight = this.lineHeight();
        const x = spacing;
        let y = spacing;
        const width = this.innerWidth - spacing * 2;
        
        // アイテム名
        this.drawItemName(item, x, y, width);
        y += lineHeight;
        this.drawHorzLine(x, y + (lineHeight / 2), width);
        y += lineHeight;

        // 説明
        const descY = this.innerHeight - lineHeight * 3;
        this.drawHorzLine(x, descY + (lineHeight / 2), width);
        const descriptionRect = new Rectangle(x, descY + lineHeight, width, lineHeight * 3);
        this.drawDescriptionBlock(item, descriptionRect);

        const infoY = y;
        const infoHeight = descY - infoY;
        const infoRect = new Rectangle(x, infoY, width, infoHeight);
        this.drawInformationBlock(item, infoRect);
    };

    /**
     * 説明を描画する。
     * 
     * @param {object} item アイテム
     * @param {Rectangle} rect 描画領域
     */
    Window_ItemInfo.prototype.drawDescriptionBlock = function(item, rect) {
        this.drawTextEx(item.description, rect.x, rect.y, rect.width);
    };

    /**
     * 情報を描画する。
     * 
     * @param {object} item アイテム
     * @param {Rectangle} rect 描画領域
     */
    Window_ItemInfo.prototype.drawInformationBlock = function(item, rect) {
        if (DataManager.isItem(item)) {
            this.drawItemInformation(item, rect);
        } else if (DataManager.isWeapon(item)) {
            this.drawWeaponInformation(item, rect);
        } else if (DataManager.isArmor(item)) {
            this.drawArmorInformation(item, rect);
        }
    };

    /**
     * アイテムの情報を描画する。
     * 
     * @param {object} item アイテム
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_ItemInfo.prototype.drawItemInformation = function(item, rect) {
        const lineHeight = this.lineHeight();

        let x = rect.x;
        let y = rect.y;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textEffect, x, y, rect.width, "left");
        y += lineHeight;

        const effectRect = new Rectangle(x, y, rect.width, rect.height - lineHeight);
        this.drawItemEffects(item, effectRect);
    };

    /**
     * アイテム効果を描画する。
     * 
     * @param {DataItem} item アイテム効果
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_ItemInfo.prototype.drawItemEffects = function(item, rect) {
        if (item.meta.hideInformation) {
            this.resetTextColor();
            const hideText = item.meta.hideInformationText || textUnknownInformation;
            this.drawText(hideText, rect.x, rect.y, rect.width);
        } else {
            const padding = this.itemPadding();
            let x = rect.x;
            let y = rect.y;
            this.resetTextColor();
            const effectsString = item.meta.effectsString || "";
            const effectStrings = effectsString.split(',').map(s => s.trim());
            for (const effectText of effectStrings) {
                const textWidth = this.textWidth(effectText);
                if ((x + textWidth) > rect.width) {
                    // 次の行に改行
                    x = rect.x;
                    y += lineHeight;
                    if ((y + lineHeight) > (rect.y + rect.height)) {
                        break; // これ以上表示できない。
                    }
                }
                const w = Math.min(textWidth, rect.width);
                this.drawText(effectText, x, y, w);
                x += (w + padding);
            }
        }
    };
    /**
     * 武器の情報を描画する
     * 
     * @param {object} item アイテム
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_ItemInfo.prototype.drawWeaponInformation = function(item, rect) {
        const lineHeight = this.lineHeight();

        let x = rect.x;
        let y = rect.y;
        // 属性と射程
        this.drawWeaponBasicInformation(item, x, y, rect.width);
        y += lineHeight;

        // 基本性能
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textPerformance, x, y, rect.width, "left");
        y += lineHeight;

        this.drawItemPerformance(item, x, y, rect.width);
        y += lineHeight * 2;

        // 補助情報を表示する。
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textEquipEffect, x, y, rect.width);
        y += lineHeight;
        this.drawEquipEffects(item, x, y, rect.width, (rect.y + rect.height) - y);
    };

    /**
     * 武器基本情報を描画する。
     * 
     * @param {object} item DataWeapon/DataArmor
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_ItemInfo.prototype.drawWeaponBasicInformation = function(item, x, y, width) {
        const xLimit = x + width;
        const padding = this.itemPadding();
        // 種類
        const typeWidth = 140;
        if ((x + typeWidth) <= xLimit) {
            this.drawWeaponType(item, x, y, typeWidth);
            x += typeWidth + padding;
        }

        // 属性
        const elementWidth = 160;
        if ((x + elementWidth) <= xLimit) {
            this.drawWeaponElement(item, x, y, elementWidth);
            x += elementWidth + padding;
        }

        // 射程距離
        const rangeWidth = 140;
        if ((x + rangeWidth) <= xLimit) {
            this.drawWeaponRange(item, x, y, rangeWidth);
            x += rangeWidth + padding;
        }

        // 基本命中率
        const hitRateWidth = 140;
        if ((x + hitRateWidth) <= xLimit) {
            this.drawWeaponHitRate(item, x, y, hitRateWidth);
            x += hitRateWidth + padding;
        }
    };

    /**
     * 武器タイプを描画する。
     * 
     * @param {DataWeapon} item 武器
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 描画幅
     */
    Window_ItemInfo.prototype.drawWeaponType = function(item, x, y, width) {
        const textLabel = textWeaponType + ":";
        const labelWidth = Math.min(this.textWidth(textLabel), width / 2);
        const valueWidth = width - labelWidth;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textLabel, x, y, labelWidth);
        const wTypeStr = TextManager.weaponTypeName(item.wtypeId) || textWeaponTypeOther;
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(wTypeStr, x + labelWidth, y, valueWidth);
    };

    /**
     * 武器属性を描画する。
     * 
     * @param {DataWeapon} item 武器
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 描画幅
     */
     Window_ItemInfo.prototype.drawWeaponElement = function(item, x, y, width) {
        const elementLabel = textLabelElement + ":";
        const labelWidth = Math.min(this.textWidth(textLabelElement), width / 2);
        const valueWidth = width - labelWidth;

        this.changeTextColor(ColorManager.systemColor());
        this.drawText(elementLabel, x, y, labelWidth);
        this.changeTextColor(ColorManager.normalColor());
        const elementIds = this.weaponElementIds(item);
        if (elementIds.length > 0) {
            const elementStr = elementIds.reduce((prev, id) => prev + ($dataSystem.elements[id] || ""), "");
            this.drawText(elementStr, x + labelWidth, y, valueWidth);
        } else {
            this.drawText(textNoElement, x + labelWidth, y, valueWidth);
        }
    };

    /**
     * 武器の属性を得る。
     * 
     * @param {DataWeapon} item 武器
     * @return {Array<number>} 属性配列
     */
    Window_ItemInfo.prototype.weaponElementIds = function(item) {
        const weaponSkillId = this.weaponSkillId(item);
        const elementIds = [];
        if (weaponSkillId > 0) {
            // 武器スキルが設定されている。
            const skill = $dataSkills[weaponSkillId];
            if (skill.damage.elementIds) {
                for (const id of skill.damage.elementIds) {
                    elementIds.push(id);
                }
            } else {
                elementIds.push(skill.damage.elementId);
            }
            if (skill.meta.onlySkillElements) {
                elementIds.sort();
                return elementIds;
            }
        }
        
        for (const traits of item.traits) {
            if (traits.code === Game_BattlerBase.TRAIT_ATTACK_ELEMENT) {
                if (!elementIds.includes(traits.dataId)) {
                    elementIds.push(traits.dataId);
                }
            }
        }

        elementIds.sort();
        return elementIds;
    };

    /**
     * 武器スキルIDを取得する。
     * 
     * @param {DataWeapon} item 武器
     * @returns {number} スキルID
     */
    Window_ItemInfo.prototype.weaponSkillId = function(item) {
        let weaponSkillId = 1;
        for (const traits of item.traits) {
            if (traits.code === Game_BattlerBase.TRAIT_ATTACK_SKILL) {
                if (traits.dataId > weaponSkillId) {
                    weaponSkillId = traits.dataId;
                }
            }
        }
        return weaponSkillId;
    };
    /**
     * 武器レンジを描画する。
     * 武器レンジ(Kapu_RangeDistance)が適用されていない場合には何も描画しない。
     * 
     * @param {DataWeapon} item 武器
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_ItemInfo.prototype.drawWeaponRange = function(item, x, y, width) {
        if (typeof item.range === "undefined") {
            // 射程距離プラグインは導入されていないので非表示
            return ;
        }

        const weaponSkillId = this.weaponSkillId(item);
        const skill = $dataSkills[weaponSkillId];
        let range = 0;
        this.resetTextColor();
        if (skill.range >= 0) {
            range = skill.range;
        } else {
            range = item.range;
        }
        let rangeText;
        switch (range) {
            case Game_Action.RANGE_SHORT:
                rangeText = textRangeShort;
                break;
            case Game_Action.RANGE_MIDDLE:
                rangeText = textRangeMiddle;
                break;
            case Game_Action.RANGE_LONG:
                rangeText = textRangeLong;
                break;
            default:
                rangeText = "-";
                break;
        }

        const labelText = textWeaponRange + ":";
        const labelWidth = Math.min(this.textWidth(labelText), width / 2);
        const valueWidth = width - labelWidth;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(labelText, x, y, labelWidth);
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(rangeText, x + labelWidth, y, valueWidth);
    };

    /**
     * 武器のヒットレートを描画する。
     * 
     * @param {DataWeapon} item 武器
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_ItemInfo.prototype.drawWeaponHitRate = function(item, x, y, width) {
        // スキルを引っ張ってきて、successRateを出す。
        const weaponSkillId = this.weaponSkillId(item);
        const skill = $dataSkills[weaponSkillId];
        const hitRate = skill.successRate;

        const labelText = textHitRate + ":";
        const labelWidth = Math.min(this.textWidth(labelText), width / 2);
        const valueWidth = width - labelWidth;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(labelText, x, y, labelWidth);
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(hitRate + "%", x + labelWidth, y, valueWidth);
    };

    /**
     * 武器/防具の性能(基本パラメータ)を描画する。
     * 
     * @param {object} item DataWeapon/DataArmor
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_ItemInfo.prototype.drawItemPerformance = function(item, x, y, width) {
        const padding = this.itemPadding();
        const offs = 40;
        const itemWidth = (width - padding * 3 - offs) / 5;

        const x1 = x + offs;
        const x2 = x1 + itemWidth + padding;
        const x3 = x2 + itemWidth + padding;
        const x4 = x3 + itemWidth + padding;
        const y1 = y;
        const y2 = y + this.lineHeight();
        this.drawItemParam(item, 2, x1, y1, itemWidth); // ATK
        this.drawItemParam(item, 4, x2, y1, itemWidth); // MAT
        this.drawItemParam(item, 0, x3, y1, itemWidth); // MaxHP
        this.drawItemParam(item, 1, x4, y1, itemWidth); // MaxMP
        this.drawItemParam(item, 3, x1, y2, itemWidth); // DEF
        this.drawItemParam(item, 5, x2, y2, itemWidth); // MDF
        this.drawItemParam(item, 6, x3, y2, itemWidth); // AGI
        this.drawItemParam(item, 7, x4, y2, itemWidth); // LUK
    };
    /**
     * 武器/防具のパラメータを描画する。
     * 
     * @param {object} item DataWeapon/DataArmor
     * @param {number} paramId パラメータID
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_ItemInfo.prototype.drawItemParam = function(item, paramId, x, y, width) {
        const value = item.params[paramId];
        const padding = this.itemPadding();
        const labelText = TextManager.param(paramId); 
        const labelWidth = Math.max(this.textWidth(labelText), (width - padding) / 2);
        const valueWidth = width - labelWidth - padding;
        this.changePaintOpacity(value !== 0);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(labelText, x, y, labelWidth);
        this.changePaintOpacity(true);
        if (value === 0) {
            return ; // 値が無い場合には表示しない。
        }
        const c = (value >= 0) ? ColorManager.normalColor() : ColorManager.powerDownColor();
        this.changeTextColor(c);
        const valueText = (value > 0) ? "+" + value : String(value);
        this.drawText(valueText, x + labelWidth + padding, y, valueWidth, "right");
    };

    /**
     * 装備効果を描画する。
     * 
     * @param {object} item DataArmor/DataWeapon
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    Window_ItemInfo.prototype.drawEquipEffects = function(item, x, y, width, height) {
        if (item.meta.hideInformation) {
            this.resetTextColor();
            const hideText = item.meta.hideInformationText || textUnknownInformation;
            this.drawText(hideText, rect.x, rect.y, rect.width);
        } else {
            const equipEffects = this.displayEquipEffects(item);
            const padding = this.itemPadding();
            const lineHeight = this.lineHeight();
            const xoffs = 40;
            const columnWidth = (width - xoffs - padding * 2) / 3;
            const effectX = x + xoffs;
            const xLimit = x + width;
            const effectWidth = width - xoffs;
            let dispX = effectX;
            let dispY = y;
            for (const equipEffect of equipEffects) {
                const textEffectName = equipEffect.name;
                const textEffectValue = (equipEffect.value) ? ("(" + equipEffect.value + ")") : "";

                let labelWidth = (equipEffect.name) ? this.textWidth(textEffectName) : 0;
                let valueWidth =  (equipEffect.value) ? this.textWidth(textEffectValue) : 0;
                const textWidth = labelWidth + valueWidth;
                if ((dispX + textWidth) > xLimit) {
                    dispX = effectX;
                    dispY += lineHeight;
                    if ((dispY + lineHeight) > (y + height)) {
                        break; // これ以上表示できない。
                    }
                }
                if (textWidth > effectWidth) {
                    // そもそも収まりきらない場合には、長さを短くする必要あり。
                    labelWidth = Math.floor(effectWidth * labelWidth / textWidth);
                    valueWidth = Math.floor(effectWidth * valueWidth / textWidth);
                }
                if (textEffectName) {
                    this.changeTextColor(ColorManager.systemColor());
                    this.drawText(textEffectName, dispX, dispY, labelWidth);
                }
                if (textEffectValue) {
                    const c = equipEffect.valueColor || ColorManager.normalColor();
                    this.changeTextColor(c);
                    this.drawText(textEffectValue, dispX + labelWidth, dispY, valueWidth);
                }
                dispX += Math.ceil(textWidth / columnWidth) * (columnWidth + padding);
            }
        }
    };

    /**
     * 装備効果を取得する。
     * 
     * @param {object} item DataWeapon/DataArmor
     * @returns {Array<object>} 表示効果の配列。
     *                         {
     *                              name:{string}, // 項目文字列
     *                              value:{string} // 値文字列
     *                              valueColor:{string} // 値のカラー
     *                         }
     */
    Window_ItemInfo.prototype.displayEquipEffects = function(item) {
        const displayEffects = this.displayEquipEffectsOfTraits(item);
        return displayEffects;
    };

    /**
     * 武器/防具の特性による効果文字列を得る。
     * 
     * @param {object} item DataWeapon/DataArmor
     * @returns {Array<object>} 効果配列
     */
    Window_ItemInfo.prototype.displayEquipEffectsOfTraits = function(item) {
        const displayEffects = [];

        const traits = item.traits.concat();
        traits.sort((a, b) => (a.code !== b.code) ? (a.code - b.code) : (a.dataId - b.dataId));

        while (traits.length > 0) {
            // 先頭から同じ特性値の数を数える。
            const code = traits[0].code;
            const dataId = traits[0].dataId;
            let count = 1;
            for (let i = 1; i < traits.length; i++) {
                if ((traits[i].code === code) && (traits[i].dataId === dataId)) {
                    count++;
                } else {
                    break;
                }
            }
            // 同じ特性だけ引っ張り出す。
            const targetTraits = traits.splice(0, count);

            if ((DataManager.isWeapon(item) && this.isIgnoreWeaponTrait(code, dataId))
                    || (DataManager.isArmor(item) && this.isIgnoreArmorTrait(code, dataId))) {
                continue;
            }


            // 特性値を表示に追加
            const baseValue = TextManager.traitBaseValue(code);
            const value = TextManager.traitValue(targetTraits) - baseValue;
            const name = TextManager.traitName(code, dataId, value);
            if (name) {
                // 名前が設定され、変化がある場合のみ表示
                const valueStr = TextManager.traitValueStr(code, dataId, value);
                displayEffects.push({
                    name: name,
                    value: valueStr,
                });
            }
        }

        return displayEffects;
    };

    Window_ItemInfo.prototype.isIgnoreWeaponTrait = function(code, dataId) {
        if (((code === Game_BattlerBase.TRAIT_XPARAM) && (dataId === 0))
                || (code === Game_BattlerBase.TRAIT_ATTACK_ELEMENT)
                || (code === Game_BattlerBase.TRAIT_ATTACK_SKILL)) {
            return true;
        }
        return false;
    };


    /**
     * 防具の情報を描画する。
     * 
     * @param {object} item アイテム
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_ItemInfo.prototype.drawArmorInformation = function(item, rect) {
        // 加減算ステータスを表示する。
        const lineHeight = this.lineHeight();

        let x = rect.x;
        let y = rect.y;
        // 種類など
        this.drawArmorBasicInformation(item, x, y, rect.width);
        y += lineHeight;

        // 基本性能
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textPerformance, x, y, rect.width, "left");
        y += lineHeight;

        this.drawItemPerformance(item, x, y, rect.width);
        y += lineHeight * 2;

        // 補助情報を表示する。
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textEquipEffect, x, y, rect.width);
        y += lineHeight;
        this.drawEquipEffects(item, x, y, rect.width, (rect.y + rect.height) - y);
    };

    /**
     * 防具の基本情報を描画する。
     * 
     * @param {object} item DataArmor
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_ItemInfo.prototype.drawArmorBasicInformation = function(item, x, y, width) {
        const xLimit = x + width;
        const padding = this.itemPadding();
        // 種類
        const typeWidth = 140;
        if ((x + typeWidth) <= xLimit) {
            this.drawArmorType(item, x, y, typeWidth);
            x += typeWidth + padding;
        }
    };

    /**
     * 防具タイプを描画する。
     * 
     * @param {DataArmor} item DataArmor
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_ItemInfo.prototype.drawArmorType = function(item, x, y, width) {
        const textLabel = textArmorType + ":";
        const labelWidth = Math.min(this.textWidth(textLabel), width / 2);
        const valueWidth = width - labelWidth;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textLabel, x, y, labelWidth);
        const aTypeStr = TextManager.armorTypeName(item.atypeId) || textArmorTypeOther;
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(aTypeStr, x + labelWidth, y, valueWidth);
    };

    /**
     * 防具の特性として表示しない特性かどうかを得る。
     * 
     * @param {number} code コード
     * @param {number} dataId データID
     * @returns {boolean} 防具の特性として表示しない場合にはtrue, それ以外はfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Window_ItemInfo.prototype.isIgnoreArmorTrait = function(code, dataId) {
        return false;
    };

    /**
     * 水平ラインを描画する。
     * 
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_ItemInfo.prototype.drawHorzLine = function(x, y, width) {
        this.drawRect(x, y, width, 5);
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
        this.createItemInfoWindow();
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
     * アイテム情報ウィンドウを作成する。
     */
    Scene_Item.prototype.createItemInfoWindow = function() {
        const rect = this.itemInfoWindowRect();
        this._itemInfoWindow = new Window_ItemInfo(rect);
        this._itemInfoWindow.hide();
        this._itemInfoWindow.deactivate();
        this._itemInfoWindow.setHandler("ok", this.onItemInfoOkCancel.bind(this));
        this._itemInfoWindow.setHandler("cancel", this.onItemInfoOkCancel.bind(this));
        this.addWindow(this._itemInfoWindow);
    };

    /**
     * アイテム情報ウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     */
    Scene_Item.prototype.itemInfoWindowRect = function() {
        const ww = itemInfoWindowWidth;
        const wh = itemInfoWindowHeight;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
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
        this._itemCommandWindow.setHandler("ok",     this.onItemCommandOk.bind(this));
        this._itemCommandWindow.setHandler("cancel", this.onItemCommandCancel.bind(this));
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
        const wh = this.calcWindowHeight(3, true);
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
            case "info":
                this._itemInfoWindow.setItem(this.item());
                this._itemInfoWindow.show();
                this._itemInfoWindow.activate();
                break;
            case "use":
                $gameParty.setLastItem(this.item());
                this.determineItem(); // メソッドの意味合い的におかしいけど、このままにする。
                break;
            case "discard":
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
    Scene_Item.prototype.onActorCancel = function() {
        _Scene_Item_onActorCancel.call(this);
        this._itemCommandWindow.hide();
    };

    /**
     * アイテム情報ウィンドウでOK/キャンセル操作されたときの処理を行う。
     */
    Scene_Item.prototype.onItemInfoOkCancel = function() {
        this._itemInfoWindow.hide();
        this._itemInfoWindow.deactivate();
        this._itemCommandWindow.show();
        this._itemCommandWindow.activate();
    };
})();