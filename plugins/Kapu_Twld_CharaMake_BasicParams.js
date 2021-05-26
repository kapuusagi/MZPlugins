/*:ja
 * @target MZ 
 * @plugindesc キャラクターメイキング項目で基本パラメータをエディットするためのプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_CharaMake
 * @orderAfter Kapu_CharaMake
 * @base Kapu_Twld_BasicParams
 * @orderAfter Kapu_Twld_BasicParams
 * 
 * @command setCharaMakeItemBasicParamsEnabled
 * @text キャラメイク項目プロフィールを有効にする。
 * @desc キャラメイク項目プロフィールを有効にする。
 * @type boolean
 * @default true
 * 
 * @arg isEnabled
 * @text 有効にする
 * @type boolean
 * @default true
 * 
 * 
 * @param itemName
 * @text キャラメイク項目名
 * @desc キャラメイク項目名として表示されるテキスト
 * @type string
 * @default パラメータ
 * 
 * @param itemDescription
 * @text キャラメイク項目ヘルプ
 * @desc キャラメイク項目名選択時のヘルプメッセージ
 * @type string
 * @default 基本パラメータを振り分けます。
 * 
 * @param sortingPoint
 * @text 振り分けポイント
 * @desc 振り分けポイント
 * @type number
 * @default 50
 * 
 * @param initialValue
 * @text 初期値(meta.basicParamsで指定されていない場合のみ) 
 * 
 * @param initialStr
 * @text STR初期値
 * @desc 振り分け前STR初期値
 * @type struct<ParamEntry>
 * @default { "min":"5", "max":"15" }
 * @parent initialValue
 * 
 * @param initialDex
 * @text DEX初期値
 * @desc 振り分け前STR初期値
 * @type struct<ParamEntry>
 * @default { "min":"5", "max":"15" }
 * @parent initialValue
 * 
 * @param initialVit
 * @text VIT初期値
 * @desc 振り分け前VIT初期値
 * @type struct<ParamEntry>
 * @default { "min":"5", "max":"15" }
 * @parent initialValue
 * 
 * @param initialInt
 * @text INT初期値
 * @desc 振り分け前INT初期値
 * @type struct<ParamEntry>
 * @default { "min":"5", "max":"15" }
 * @parent initialValue
 * 
 * @param initialMen
 * @text MEN初期値
 * @desc 振り分け前MEN初期値
 * @type struct<ParamEntry>
 * @default { "min":"5", "max":"15" }
 * @parent initialValue
 * 
 * @param initialAgi
 * @text AGI初期値
 * @desc 振り分け前AGI初期値
 * @type struct<ParamEntry>
 * @default { "min":"5", "max":"15" }
 * @parent initialValue
 * 
 * @param initialLuk
 * @text LUK初期値
 * @desc 振り分け前LUK初期値
 * @type struct<ParamEntry>
 * @default { "min":"5", "max":"15" }
 * @parent initialValue
 * 
 * @param isLukEditable
 * @text LUKを編集可能かどうか
 * @desc LUKを編集可能にする場合にはtrue, それ以外はfalse.
 * @type boolean
 * @default true
 * 
 * 
 * 
 * @param textCost
 * @text コストテキスト
 * @desc コストテキスト
 * @type string
 * @default コスト
 * 
 * @param textDetermine
 * @text 決定テキスト
 * @desc 決定テキスト
 * @type string
 * @default 決定
 * 
 * @help 
 * TWLD向けに作成した、キャラクターメイキング項目で基本パラメータをエディットするためのプラグイン。
 * 
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * キャラメイク項目プロフィールを有効にする。
 *   キャラメイク項目でプロフィール編集を有効にする。
 *   セーブデータには保存されない。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * なし。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/*~struct~ParamEntry:
 *
 * @param min
 * @text 最小値
 * @desc 最小値
 * @type number
 * 
 * @paam max
 * @text 最大値
 * @desc 最大値
 * @type number
 */
/**
 * Window_CharaMakeItem_BasicParams
 * 基本パラメータ編集ウィンドウ
 */
function Window_CharaMakeItem_BasicParams() {
    this.initialize(...arguments);
}
/**
 * Game_CharaMakeItem_BasicParams
 * 基本パラメータ編集項目
 */
function Game_CharaMakeItem_BasicParams() {
    this.initialize(...arguments);
}


(() => {
    const pluginName = "Kapu_Twld_CharaMake_BasicParams";
    const parameters = PluginManager.parameters(pluginName);
    const itemName = parameters["itemName"] || "Basic Parameters";
    const itemDescription = parameters["itemDescription"] || "Customize basic parameters.";
    const isLukEditable = (typeof parameters["isLukEditable"] === "undefined")
            ? true : (parameters["isLukEditable"] === "true");
    const textCost = parameters["textCost"] || "Cost";
    const textDetermine = parameters["textDetermine"] || "OK";

    const sortingPoint = Math.floor(Number(parameters["sortingPoint"]) || 50);

    const CHARAMAKEITEM_BASICPARAMS = "basicParams";

    PluginManager.registerCommand(pluginName, "setCharaMakeItemBasicParamsEnabled", args => {
        const isEnabled = (typeof args.isEnabled === "undefined")
                ? true : (args.isEnabled === "true");
        $gameTemp.setCharaMakeItemEnabled(CHARAMAKEITEM_BASICPARAMS, isEnabled);
    });

    //------------------------------------------------------------------------------
    // DataManager
    const _DataManager_createCharaMakeItems = DataManager.createCharaMakeItems;
    /**
     * キャラクターメイキング項目を取得する。
     * キャラメイク項目を拡張する場合、このメソッドをフックして値を配列に加えて返す。
     * 
     * @returns {Array<Game_CharaMakeItem>} キャラクターメイキング項目
     */
    DataManager.createCharaMakeItems = function() {
        const items = _DataManager_createCharaMakeItems.call(this);
        if ($gameTemp.isCharaMakeItemEnabled(CHARAMAKEITEM_BASICPARAMS)) {
            items.push(new Game_CharaMakeItem_BasicParams());
        }
        return items;
    };
    //------------------------------------------------------------------------------
    // Window_CharaMakeItem_BasicParams
    Window_CharaMakeItem_BasicParams.prototype = Object.create(Window_Selectable.prototype);
    Window_CharaMakeItem_BasicParams.prototype.constructor = Window_CharaMakeItem_BasicParams;

    /**
     * Window_CharaMakeItem_BasicParamsを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_CharaMakeItem_BasicParams.prototype.initialize = function(rect) {
        this._actor = null;
        this._basicParamsOrg = [];
        this._customizedParams = [];
        this._customizedParamsConfirmed = [];
        this._sortingPoint = 0;
        Window_Selectable.prototype.initialize.call(this, rect);
    };

    /**
     * セットアップする。
     * 
     * @param {Game_Actor} actor アクター
     */
    Window_CharaMakeItem_BasicParams.prototype.setup = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            for (let i = 0; i < actor._basicParams.length; i++) {
                this._basicParamsOrg[i] = actor._basicParams[i];
                this._customizedParams[i] = 0;
                this._customizedParamsConfirmed[i] = 0;
            }
            this._sortingPoint = sortingPoint;
            this.refresh();
        } 
    };

    /**
     * OK処理する。
     */
    Window_CharaMakeItem_BasicParams.prototype.processOk = function() {
        const index = this.index();
        if (index < 0) {
            // Do nothing.
        } else if (index < (this.paramCount() * 2)) {
            // 減算と加算
            const paramNo = Math.floor(index / 2);
            if (index & 1) {
                // 加算
                if (this._sortingPoint >= this.paramCost(paramNo)) {
                    this._sortingPoint -= this.paramCost(paramNo);
                    this._customizedParams[paramNo]++;
                    this.playOkSound();
                } else {
                    this.playBuzzerSound();
                }
            } else {
                // 減算
                if (this._customizedParams[paramNo] > 0) {
                    this._customizedParams[paramNo]--;
                    this._sortingPoint += this.paramCost(paramNo);
                    this.playOkSound();
                } else {
                    this.playBuzzerSound();
                }
            }
        } else {
            for (let i = 0; i < this._customizedParams.length; i++) {
                this._customizedParamsConfirmed[i] = this._customizedParams[i];
            }
            Window_Selectable.prototype.processOk.call(this);
        }
        this.refresh();
    };

    /**
     * キャンセル処理をする。
     */
    Window_CharaMakeItem_BasicParams.prototype.processCancel = function() {
        for (let i = 0; i < this._customizedParams.length; i++) {
            this._customizedParams[i] = this._customizedParamsConfirmed[i];
        }
        this.refresh();
        Window_Selectable.prototype.processCancel.call(this);
    };

    /**
     * 基本パラメータ配列を得る。
     * 
     * @returns {Array<number>} 基本パラメータ配列
     */
    Window_CharaMakeItem_BasicParams.prototype.basicParams = function() {
        const basicParams = [];
        for (let i = 0; i < this._basicParamsOrg.length; i++) {
            basicParams[i] = this._basicParamsOrg[i] + this._customizedParams[i];
        }
        return basicParams;
    };

    /**
     * 項目数を得る。
     * 
     * @returns {number} 項目数。
     */
    Window_CharaMakeItem_BasicParams.prototype.maxItems = function() {
        return this.paramCount() * 2 + 1; // パラメータ毎にUP/DOWN と 確定ボタン  
    };

    /**
     * 振り分け対象のパラメータ数を得る。
     * 
     * @returns {number} パラメータ数
     */
    Window_CharaMakeItem_BasicParams.prototype.paramCount = function() {
        return (isLukEditable) ? 7 : 6;
    };

    /**
     * 指定項目の描画領域を得る
     * 
     * @param {number} index インデックス番号
     * @returns {Rectangle} 矩形領域
     */
    Window_CharaMakeItem_BasicParams.prototype.itemRect = function(index) {
        const inset = this.inset();
        const itemWidth = this.itemWidth();
        const itemHeight = this.itemHeight();
        if (index >= (this.paramCount() * 2)) {
            // 決定ボタン(右下に配置)
            const wx = this.innerWidth - (inset + itemWidth);
            const wy = this.innerHeight - (inset + itemHeight);
            const ww = itemWidth;
            const wh = itemHeight;
            return new Rectangle(wx, wy, ww, wh);
        } else {
            // 項目上下ボタン
            const paramNo = Math.floor(index / 2);
            const wx = (index & 1) ? this.buttonUpX() : this.buttonDownX();
            const wy = this.buttonY(paramNo);
            const ww = itemWidth;
            const wh = itemHeight;
            return new Rectangle(wx, wy, ww, wh);
        }
    };

    /**
     * 現在の選択項目が有効かどうかを得る。
     * 
     */
    Window_CharaMakeItem_BasicParams.prototype.isCurrentItemEnabled = function() {
        return this.isItemEnabled(this.index());
    };

    /**
     * パラメータ振り分けコストを得る。
     * 
     * @param {number} index インデックス番号
     * @returns {number} パラメータ振り分けコスト
     */
    Window_CharaMakeItem_BasicParams.prototype.paramCost = function(index) {
        return this._customizedParams[index] + 1;
    };

    /**
     * 項目が有効かどうかを得る。
     * 
     * @param {number} index インデックス番号
     * @returns {boolean} 項目が有効な場合にはtrue, それ以外はfalse.
     */
    Window_CharaMakeItem_BasicParams.prototype.isItemEnabled = function(index) {
        if (index < 0) {
            return false;
        } else if (index < (this.paramCount() * 2)) {
            const paramNo = Math.floor(index / 2);
            if (index & 1) {
                // Up ボタン
                const cost = this.paramCost(paramNo);
                return (this._sortingPoint >= cost);
            } else {
                // Down ボタン
                return (this._customizedParams[paramNo] > 0);
            }
        } else {
            return true;
        }
    };

    /**
     * インセットを得る。
     * 
     * @returns {number} インセット
     */
    Window_CharaMakeItem_BasicParams.prototype.inset = function() {
        return 24;
    };

    /**
     * 減少ボタンのX位置を得る。
     * 
     * @returns {number} X位置
     */
    Window_CharaMakeItem_BasicParams.prototype.buttonDownX = function() {
        return this.valueX() - (this.itemWidth() - this.colSpacing());
    };

    /**
     * 値のx位置を得る。
     * 
     * @returns {number} 値のx位置
     */
    Window_CharaMakeItem_BasicParams.prototype.valueX = function() {
        return this.buttonUpX() - (this.colSpacing() + this.valueWidth());
    };

    /**
     * パラメータのY位置を得る。
     * 
     * @param {number} paramNo パラメータ番号
     * @returns {number} Y位置
     */
    Window_CharaMakeItem_BasicParams.prototype.buttonY = function(paramNo) {
        return paramNo * (this.lineHeight() + this.rowSpacing()) + this.lineHeight() + this.rowSpacing();
    };

    /**
     * 値の表示幅を得る。
     * 
     * @returns {number} 値幅
     */
    Window_CharaMakeItem_BasicParams.prototype.valueWidth = function() {
        return 72;
    };

    /**
     * 増加ボタンのx位置を得る
     * 
     * @returns {number} x位置
     */
    Window_CharaMakeItem_BasicParams.prototype.buttonUpX = function() {
        return this.innerWidth - (this.inset() + this.itemWidth());
    };


    /**
     * 項目の幅を得る。
     * 
     * @returns {number} 項目の幅
     */
    Window_CharaMakeItem_BasicParams.prototype.itemWidth = function() {
        return 80;
    };

    /**
     * 項目の高さ
     * 
     * @returns {number} 項目の高さを得る。
     */
    Window_CharaMakeItem_BasicParams.prototype.itemHeight = function() {
        return this.lineHeight();
    };

    /**
     * 行間のスペースを得る。
     * 
     * @returns {number} 行間スペース
     */
    Window_CharaMakeItem_BasicParams.prototype.rowSpacing = function() {
        return 12;
    };

    /**
     * 最大カラム数を得る。
     * 
     * @returns {number} カラム数
     */
    Window_CharaMakeItem_BasicParams.prototype.maxCols = function() {
        return 2;
    };

    /**
     * コンテンツの高さを得る。
     * 
     * @returns {number} コンテンツの高さ。
     */
    Window_CharaMakeItem_BasicParams.prototype.contentsHeight = function() {
        return this.innerHeight;
    };

    /**
     * 項目を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_CharaMakeItem_BasicParams.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        if (index < (this.paramCount() * 2)) {
            const text = (index & 1) ? "\u2192" : "\u2190";
            this.changePaintOpacity(this.isItemEnabled(index));
            this.drawText(text, rect.x, rect.y, rect.width, "center");
            this.changePaintOpacity(true);
        } else {
            this.drawText(textDetermine, rect.x, rect.y, rect.width, "center");
        }
    };

    /**
     * 全ての項目を描画する。
     */
    Window_CharaMakeItem_BasicParams.prototype.drawAllItems = function() {
        this.drawCurrentParams();
        Window_Selectable.prototype.drawAllItems.call(this);
    };

    /**
     * 現在の項目を描画する。
     */
    Window_CharaMakeItem_BasicParams.prototype.drawCurrentParams = function() {
        // 振り分けポイント描画
        this.drawSortingParam();

        // パラメータ名と現在地描画
        const valueX = this.valueX();
        const labelX = 16;
        const labelWidth = 120;
        const spacing = this.colSpacing();
        const valueWidth = this.valueWidth();
        const paramCount = this.paramCount();
        const currentValueX = labelX + labelWidth + spacing;
        const currentValueWidth = this.buttonDownX() - spacing - currentValueX;
        for (let paramNo = 0; paramNo < paramCount; paramNo++) {
            const y = this.buttonY(paramNo);
            const label = TextManager.basicParam(paramNo);
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(label, labelX, y, labelWidth);
            const c = (this._customizedParams[paramNo] > 0) ? ColorManager.powerUpColor() : ColorManager.normalColor();
            this.changeTextColor(c);
            const currentValue = this._basicParamsOrg[paramNo] + this._customizedParams[paramNo];
            this.drawText(currentValue, currentValueX, y, currentValueWidth, "right");
            const valueStr = "+" + this._customizedParams[paramNo];
            this.changeTextColor(ColorManager.normalColor());
            this.drawText(valueStr, valueX, y, valueWidth, "right");
        }
    };

    /**
     * 振り分けパラメータを得る。
     */
    Window_CharaMakeItem_BasicParams.prototype.drawSortingParam = function() {
        let x = this.innerWidth - 320;
        const y = 0;
        const colSpacing = this.colSpacing();
        const labelWidth = 120;
        const labelX = x;
        const valueWidth = (this.innerWidth - labelX - labelWidth - colSpacing * 3 - 64) / 2;
        this.changeTextColor(ColorManager.systemColor())
        this.drawText(textCost, labelX, y, labelWidth);

        const currentValueX = labelX + labelWidth + colSpacing;
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(this._sortingPoint, currentValueX, y, valueWidth, "right");
        const charX = currentValueX + valueWidth + colSpacing;
        this.drawText("/", charX, y, 24);
        const maxValueX = charX + 24 + colSpacing;
        this.drawText(sortingPoint, maxValueX, y, valueWidth, "right");
    };

    //------------------------------------------------------------------------------
    // Game_CharaMakeItem_BasicParams
    Game_CharaMakeItem_BasicParams.prototype = Object.create(Game_CharaMakeItem.prototype);
    Game_CharaMakeItem_BasicParams.prototype.constructor = Game_CharaMakeItem_BasicParams;

    /**
     * 初期化する。
     */
    Game_CharaMakeItem_BasicParams.prototype.initialize = function() {
        Game_CharaMakeItem.prototype.initialize.call(this, ...arguments);
    };

    /**
     * この項目の識別名を取得する。
     * 
     * @returns {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_BasicParams.prototype.name = function() {
        return itemName;
    };
    /**
     * この項目の説明を取得する。
     * 
     * @returns {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_BasicParams.prototype.description = function() {
        return itemDescription;
    };
    /**
     * アクターに適用可能な項目かどうかを取得する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {boolean} 既存データの変更の場合にはtrue、それ以外はfalse
     * @returns {boolean} 適用できる項目の場合にはtrue, それ以外はfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_BasicParams.prototype.canApply = function(actor, isModify) {
        return !isModify;
    };
    /**
     * 選択・編集用のウィンドウを作成する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     * @param {Window_Help} helpWindow ヘルプウィンドウ
     * @param {Game_Actor} actor アクター
     * @returns {object} 追加するウィンドウ
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_BasicParams.prototype.createSelectWindows = function(rect, helpWindow, actor) {
        const wx = rect.x;
        const wy = rect.y;
        const ww = 480;
        const wh = 480;
        const windowRect = new Rectangle(wx, wy, ww, wh);
        const window = new Window_CharaMakeItem_BasicParams(windowRect);
        return {
            selectWindow: window,
            windows: null,
            infoWindows: null,
            sprites: null
        }
    };

    /**
     * 編集中のテキストを得る。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @returns {string} 編集項目の選択値(テキスト)
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_BasicParams.prototype.editingText = function(windowEntry) {
        return "";  
    };

    /**
     * 現在のアクターの情報を反映させる
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    Game_CharaMakeItem_BasicParams.prototype.setCurrent = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        selectWindow.setup(actor);
    };

    /**
     * 編集中の設定を反映させる。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    Game_CharaMakeItem_BasicParams.prototype.apply = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        const params = selectWindow.basicParams();
        for (let i = 0; i < params.length; i++) {
            actor._basicParams[i] = params[i];
        }
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * initialValueStrをパースしてランダマイズしたパラメータを返す。
     * 
     * @param {string} initialValueStr 初期値文字列
     * @returns {number} 値
     */
    const _randamizeBasicParam = function(initialValueStr) {
        let value = 10;
        try {
            entry = JSON.parse(initialValueStr);
            if (entry.min && entry.max) {
                const min = Math.floor(entry.min);
                const max = Math.floor(entry.max);
                value = Math.randomInt(max - min + 1) + min;
            }
        }
        catch (e) {
            console.log(e);
        }
        return value;
    };

    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const actor = this.actor();
        if (!actor.meta.basicParams) {
            // meta.basicParams未指定時、初期値をランダムに設定
            this._basicParams[0] = _randamizeBasicParam(parameters["initialStr"] || "{}");
            this._basicParams[1] = _randamizeBasicParam(parameters["initialDex"] || "{}");
            this._basicParams[2] = _randamizeBasicParam(parameters["initialVit"] || "{}");
            this._basicParams[3] = _randamizeBasicParam(parameters["initialInt"] || "{}");
            this._basicParams[4] = _randamizeBasicParam(parameters["initialMen"] || "{}");
            this._basicParams[5] = _randamizeBasicParam(parameters["initialAgi"] || "{}");
            this._basicParams[6] = _randamizeBasicParam(parameters["initialLuk"] || "{}");
        }
    };


})();
