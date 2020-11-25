/*:ja
 * @target MZ 
 * @plugindesc GrowupSystem用のUIを提供するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * ■ startGrowupScene
 * @command startGrowupScene
 * @text 成長画面を開く
 * @desc 成長画面を開きます。
 * 
 * @param menu
 * @text メニュー
 * 
 * @param menuEnable
 * @text メニュー
 * @desc メニューに表示するかどうか。
 * @type boolean
 * @default false
 * @parent menu
 * 
 * @param menuCommandText
 * @text コマンド名
 * @desc メニューに表示するコマンド名
 * @type string
 * @default 育成
 * @parent menu
 * 
 * 
 * @param confirmMessageText
 * @text 確認メッセージ
 * @desc 確認メッセージとして表示する書式。%1は項目名、%2に育成パラメータ名、%3にコストが渡る。
 * @type string
 * @default %1(%2を%3消費)
 * 
 * @param actorPicture
 * @text アクターの画像を取得するメソッド名
 * @desc 他のプラグイン等で、Game_Actorから画像ファイル名を取得できる場合に指定する。未指定時は顔グラフィック。
 * @type string
 * 
 * @param growupOnDead
 * @text Dead中の育成可否
 * @desc Dead状態の時、育成を行うかどうか。trueにすると、Dead中でも育成できる。
 * @type boolean
 * @default false
 * 
 * @help 
 * Kapu_GrowupSystem のUI提供用プラグイン。
 * ステータス欄に表示する画像はデフォルトで顔グラフィック。
 * プラグインパラメータ actorPicture で指定したメソッド名で取得できるようにすることもできる。
 * 例）Kapu_TwldBattleSystemと組み合わせるなら、"battlePicture"とかするとよさげ。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * シーンの呼び出し
 *     SceneManager.push(Scene_Growup);
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンド
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノータグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.1 メニューコマンドへの追加メソッドを
 *               オーバーライドしていた不具合を修正した。
 * Version.0.1.0 MVでTWLD向けに作成したものから移植した。
 */
/**
 * Window_GrowupActorStatus
 * 
 * 成長画面のアクター表示をする。
 */
function Window_GrowupActorStatus() {
    this.initialize(...arguments);
}

/**
 * Window_GrowupSelect
 * 成長画面の項目選択を提供する。
 */
function Window_GrowupSelect() {
    this.initialize(...arguments);
}

/**
 * Window_ConfirmApply.
 * 適用確認メッセージウィンドウ。
 */
function Window_ConfirmApply() {
    this.initialize(...arguments);
}

/**
 * 育成シーン。
 * 成長ポイントを使用してアクターを強化する。
 */
function Scene_Growup() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_GrowupSystem_UI";
    const parameters = PluginManager.parameters(pluginName);
    const menuEnable = (typeof parameters["menuEnable"] === "undefined")
            ? false : (parameters["menuEnable"] === "true");
    const menuCommandText = String(parameters["menuCommandText"]) || "";
    const confirmMessageText = String(parameters["confirmMessageText"]) || "%1(%2-%3)";
    const actorPicture = String(parameters["actorPicture"]) || "";
    const growupOnDead = (typeof parameters["growupOnDead"] === "undefined")
            ? false : (parameters["growupOnDead"] === "true");

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "startGrowupScene", args => {
        SceneManager.push(Scene_Growup);
    });
    //------------------------------------------------------------------------------
    // Window_GrowupActorStatus
    Window_GrowupActorStatus.prototype = Object.create(Window_Base.prototype);
    Window_GrowupActorStatus.prototype.constructor = Window_GrowupActorStatus;

    /**
     * Window_GrowupActorStatusを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_GrowupActorStatus.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._actor = null;
        // 先読みしておく。
        for (const actor of $gameParty.members()) {
            if ((actorPicture in actor) && actor[actorPicture]()) {
                ImageManager.loadPicture(actor[actorPicture]());
            }
        }
    };

    /**
     * 表示するアクターを設定する。
     * 
     * @param {Game_Actor} actor アクター
     */
    Window_GrowupActorStatus.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    /**
     * 表示を更新する。
     */
    Window_GrowupActorStatus.prototype.refresh = function() {
        this.contents.clear();
        this.drawBackgroundImage();
        this.drawStatus();
    };

    /**
     * 背景画像を描画する。
     */
    Window_GrowupActorStatus.prototype.drawBackgroundImage = function() {
        this.drawActorImage();

        this.changePaintOpacity(false);
        const statusRect = this.statusAreaRect();
        this.contents.fillRect(statusRect.x, statusRect.y, 
            statusRect.width, statusRect.height, "#000000");
        this.changePaintOpacity(true);
    };

    /**
     * ステータス表示領域の矩形領域を得る。
     * 
     * @return {Rectangle} 矩形領域。
     */
    Window_GrowupActorStatus.prototype.statusAreaRect = function() {
        const rect = this.baseTextRect();
        const w = Math.min(rect.width, 180);
        const h = Math.min(rect.height, 320);
        const x = rect.x + (rect.width - w) / 2;
        const y = rect.y + (rect.height - h);

        return new Rectangle(x, y, w, h);
    };

    /**
     * アクターの画像を描画する。
     */
    Window_GrowupActorStatus.prototype.drawActorImage = function() {
        const actor = this._actor;
        if ((actorPicture in actor) && actor[actorPicture]()) {
            this.setPaintFilter(this.actorImagePaintFilter());
            this.drawActorImagePicture();
            this.resetPaintFilter();
        } else {
            this.setPaintFilter(this.actorImagePaintFilter());
            const actor = this._actor;
            const rect = this.baseTextRect();
            this.drawFace(actor.faceName(), actor.faceIndex(),
                    rect.x, rect.y + this.itemPadding(), rect.width, 200);
            this.resetPaintFilter();
        }
    };

    /**
     * アクター画像を描画するときのフィルターを得る。
     * 
     * @return {String} 描画フィルター文字列
     */
    Window_GrowupActorStatus.prototype.actorImagePaintFilter = function() {
        if (!growupOnDead) {
            return (this._actor.isDead()) ? "grayscale(100%)" : "none";
        } else {
            return "none";
        }
    };
    /**
     * アクターの画像を描画する。
     */
    Window_GrowupActorStatus.prototype.drawActorImagePicture = function() {
        const actor = this._actor;
        const pictureName = actor[actorPicture]();
        const bitmap = ImageManager.loadPicture(pictureName);
        if (!bitmap.isReady()) {
            return;
        }
        const rect = this.baseTextRect()
        this.drawPicture(pictureName, rect.x + 2, rect.y, rect.width - 4, rect.height);
    };

    /**
     * 画像を描画する。
     * 
     * @param {String} name 画像ファイル名
     * @param {Number} x 描画領域左上 x位置
     * @param {Number} y 描画領域左上 y位置
     * @param {Number} width 描画領域幅
     * @param {Number} height 描画領域高さ
     */
    Window_GrowupActorStatus.prototype.drawPicture = function(name, x, y, width, height) {
        const bitmap = ImageManager.loadPicture(name);
        const pw = bitmap.width;
        const ph = bitmap.height;
        width = width || pw;
        height = height || ph;
        const sw = Math.min(width, pw);
        const sh = Math.min(height, ph);
        const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        const dy = y;
        const sx = (pw - sw) / 2;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
    };


    /**
     * アクターのステータスを描画する。
     */
    Window_GrowupActorStatus.prototype.drawStatus = function() {
        const rect = this.statusAreaRect();

        let x = rect.x + this.itemPadding();
        let y = rect.y + this.itemPadding();
        const width = rect.width - this.itemPadding() * 2;
        const lineHeight = this.lineHeight();
        const actor = this._actor;

        // アクター名
        this.drawActorName(actor, x, y, width);
        y += lineHeight;

        // アクターレベル
        // this.drawActorLevel(actor, x, y);
        // y += lineHeight;

        this.drawActorGrowPoint(actor, x, y, width);
        y += Math.floor(lineHeight * 1.2);

        this.contents.fontSize = $gameSystem.mainFontSize() - 8;
        for (let i = 0; i < 8; i++) {
            const paramWidth = 64;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(TextManager.param(i), x, y, paramWidth);
            this.resetTextColor();
            this.drawText(actor.param(i), x + paramWidth, y, width - paramWidth, "right");
            y += Math.floor(lineHeight * 0.8);
        }

        // 基本ステータス描画するぜ。
        // const statusX = x;
        // const statusY = y + ImageManager.faceHeight + this.itemPadding();
        // const statusWidth = this.width - this.itemPadding() * 2;
        // this.changeTextColor(this.normalColor());
        // this.drawText("基本ステータス", statusX, statusY, statusWidth);
        // statusY += this.lineHeight();

        // const statusNames = TWLD.Core.StatusNames;
        // for (let i = 0; i < 6; i++) {
        //     var paramValue =  actor.getBasicParam(i);
        //     var correct = paramValue - actor.getBasicParamBase(i); // 装備による補正値
        //     this.drawBasicParam(statusNames[i], paramValue, correct, statusX, statusY, statusWidth);
        //     statusY += this.lineHeight();
        // }
    };

    /**
     * アクター名を描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画位置左上x
     * @param {Number} y 描画位置左上y
     * @param {Number} width 幅
     */
    Window_GrowupActorStatus.prototype.drawActorName = function(actor, x, y, width) {
        this.resetFontSettings();
        this.drawText(actor.name(), x, y, width);
    };


    /**
     * レベルを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    // eslint-disable-next-line no-unused-vars
    Window_GrowupActorStatus.prototype.drawActorLevel = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize = $gameSystem.mainFontSize() - 4;
        this.drawText(TextManager.levelA, x, y + 4, 20);
        this.resetFontSettings();
        this.drawText(actor.level, x + 24, y, 32, "right");
    };
    /**
     * 成長ポイントを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_GrowupActorStatus.prototype.drawActorGrowPoint = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize = $gameSystem.mainFontSize() - 4;
        this.drawText(TextManager.growPoint, x, y + 4, 20);
        x += 24;
        this.resetFontSettings();
        this.contents.fontSize = $gameSystem.mainFontSize() + 8;
        const valueWidth = width - 24;
        this.drawText(actor.growPoint(), x, y, valueWidth, "right");
    };
    /**
     * 描画フィルターを設定する。
     * (MDNのドキュメントを見る限り、ChromeとFirefoxじゃないと動かない？)
     * 
     * @param {String} filterStr 描画フィルター文字列。
     */
    Window_GrowupActorStatus.prototype.setPaintFilter = function(filterStr) {
        this.contents.context.filter = filterStr;
    };

    /**
     * 描画フィルターをリセットする。
     */
    Window_GrowupActorStatus.prototype.resetPaintFilter = function() {
        this.contents.context.filter = "none";
    };

    //-----------------------------------------------------------------
    // Window_GrowupSelect
    //    育成項目選択ウィンドウ
    //

    Window_GrowupSelect.prototype = Object.create(Window_Selectable.prototype);
    Window_GrowupSelect.prototype.constructor = Window_GrowupSelect;

    /**
     * ウィンドウを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_GrowupSelect.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._items = [];
        this._actor = null;
    };

    /**
     * 選択されている項目を得る。
     * 
     * @return {GrowupItem} 選択されている項目。 
     */
    Window_GrowupSelect.prototype.item = function() {
        return this.itemAt(this.index());
    };

    /**
     * 指定インデックスの項目を得る。
     * 
     * @param {Number} index 
     * @return {GrowupItem} 選択されている項目。 
     */
    Window_GrowupSelect.prototype.itemAt = function(index) {
        if ((index >= 0) && (index < this._items.length)) {
            return this._items[index];
        } else {
            return null;
        }
    };

    /**
     * アクターを設定する。
     * @param {Game_Actor} actor 設定するアクター
     */
    Window_GrowupSelect.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.makeItemList();
            if (this.index() >= this._items.length) {
                this.select(0);
            }
            this.refresh();
        }
    };

    /**
     * 選択項目を更新する。
     */
    Window_GrowupSelect.prototype.makeItemList = function() {
        this._items = [];
        if (!this._actor) {
            return;
        }
        this._items = this._actor.growupItems();
        this._items.push({
            iconIndex:0,
            name:TextManager.cancel,
            type:"",
            id:"",
            cost:0,
            description:""
        });
    };

    /**
     * 項目数を得る。
     * @return {Number} 項目数
     */
    Window_GrowupSelect.prototype.maxItems = function () {
        return this._items.length;
    };

    /**
     * 現在の選択項目が有効かどうかを判定する。
     * @return 有効な場合にはtrue, それ以外はfalse
     */
    Window_GrowupSelect.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.item());
    };

    /**
     * 指定インデックスの項目を描画する。
     * 
     * @param index インデックス
     */
    Window_GrowupSelect.prototype.drawItem = function (index) {
        var item = this.itemAt(index); // GrowupItem
        if (!item) {
            return;
        }

        const rect = this.itemRect(index);

        // アイコン描画
        if (item.iconIndex >= 0) {
            this.drawIcon(item.iconIndex, rect.x, rect.y);
        }

        // 項目名描画
        this.changePaintOpacity(this.isEnabled(item));
        const gpWidth = this.textWidth(TextManager.growPoint + "-XXXX");
        const x = rect.x + 40;
        const width = Math.min(480, rect.width - this.itemPadding() - gpWidth);
        this.resetFontSettings();
        this.drawText(item.name, x, rect.y, width);

        // GPコスト描画
        if (item.cost > 0) {
            const x2 = x + width;
            const costStr = TextManager.growPoint + "-" + item.cost;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(costStr, x2, rect.y, gpWidth);
            this.changePaintOpacity(true);
        }
    };


    /**
     * ヘルプウィンドウに表示する内容を更新する。
     */
    Window_GrowupSelect.prototype.updateHelp = function() {
        Window_Selectable.prototype.updateHelp.call(this);
        this._helpWindow.setItem(this.item())
    };

    /**
     * 選択項目が有効かどうかを得る。
     * @param {GrowupItem} item 項目
     * @return {Boolean} 有効な場合にはtrue, それ以外はfalse
     */
    Window_GrowupSelect.prototype.isEnabled = function(item) {
        if (item) {
            if (item.type === "") {
                // キャンセル項目
                return true;
            }
            if (!growupOnDead && this._actor.isDead()) {
                return false;
            }
            return item.cost <= this._actor.growPoint();
        } else {
            return false;
        }
    };
    /**
     * 表示項目を更新する。
     */
    Window_GrowupSelect.prototype.refresh = function() {
        this.makeItemList();
        if (this.index() >= this._items.length) {
            this.select(this._items.length - 1);
        }
        Window_Selectable.prototype.refresh.call(this);
    };

    //-----------------------------------------------------------------
    // Window_ConfirmApply
    //     変更適用確認ウィンドウ
    //

    Window_ConfirmApply.prototype = Object.create(Window_Selectable.prototype);
    Window_ConfirmApply.prototype.constructor = Window_ConfirmApply;

    /**
     * Window_ConfirmApplyを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域。
     */
    Window_ConfirmApply.prototype.initialize = function (rect) {
        this._items = [ "", TextManager.cancel];
        Window_Selectable.prototype.initialize.call(this, rect);
        this.activate();
    };

    /**
     * 選択項目のメッセージを設定する。
     * 
     * @param {String} msg メッセージ
     */
    Window_ConfirmApply.prototype.setMessage = function(msg) {
        this._items[0] = msg;
        this.refresh();
    };
    
    /**
     * コンテンツの幅を取得する。
     * 
     * @return {Number} コンテンツの幅
     */
    Window_ConfirmApply.prototype.maxItemWidth = function() {
        var maxTextWidth = 0;
        for (var n = 0; n < this._items.length; n++) {
            var width = this.textWidth(this._items[n]);
            if (width > maxTextWidth) {
                maxTextWidth = width;
            }
        }
        return maxTextWidth;
    };

    /**
     * 最大項目数を取得する。
     * 
     * @return {Number} 最大項目数
     */
    Window_ConfirmApply.prototype.maxItems = function () {
        return this._items.length;
    };

    /**
     * 項目を描画する。
     * 
     * @param {Number} index 描画する項目のインデックス番号
     */
    Window_ConfirmApply.prototype.drawItem = function (index) {
        var rect = this.itemRect(index);
        this.resetTextColor();
        this.drawText(this._items[index], rect.x, rect.y, rect.width, "left");
        this.resetTextColor();
    };

    //------------------------------------------------------------------------------
    // Scene_Growup
    //     面倒なのでカテゴリ選択用のウィンドウは用意しないけど。
    //     習得可能スキル数が膨大になったら、いろいろ考えた方がいいなあ。


    Scene_Growup.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Growup.prototype.constructor = Scene_Growup;

    /**
     * Scene_Growupを初期化する。
     */
    Scene_Growup.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.apply(this, arguments);
    };

    /**
     * シーンに関係するオブジェクト(ウィンドウなど）を作成する。
     */
    Scene_Growup.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this); // ここでアクターがセットされる。
        this.createActorStatusWindow();
        this.createHelpWindow();
        this.createSelectWindow();
        this.createConfirmApplyWindow();
    };

    /**
     * アクターステータスウィンドウを作成する。
     */
    Scene_Growup.prototype.createActorStatusWindow = function() {
        this._actorStatusWindow = new Window_GrowupActorStatus(this.actorStatusWindowRect());
        this._actorStatusWindow.setActor(this.actor());
        this._actorStatusWindow.show();
        this._actorStatusWindow.open();
        this.addWindow(this._actorStatusWindow);
    };

    /**
     * アクターステータスのウィンドウ領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     */
    Scene_Growup.prototype.actorStatusWindowRect = function() {
        const ww = this.statusWidth();
        const wh = this.mainAreaHeight();
        const wx = 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータス領域の幅を得る。
     * 
     * @return {Number} ステータス領域の幅。
     */
    Scene_Growup.prototype.statusWidth = function() {
        return 320;
    };

    /**
     * ヘルプウィンドウを作成する。
     */
    Scene_Growup.prototype.createHelpWindow = function() {
        Scene_MenuBase.prototype.createHelpWindow.call(this);
    };

    /**
     * 項目選択画面を作成する。
     * カテゴリ分けしないけどいいのかなあ。項目多いと見づらくなるけど。
     */
    Scene_Growup.prototype.createSelectWindow = function() {
        this._selectWindow = new Window_GrowupSelect(this.selectWindowRect());
        this._selectWindow.setActor(this.actor());
        this._selectWindow.setHelpWindow(this._helpWindow);
        this._selectWindow.setHandler("ok", this.onGrowupSelectOk.bind(this));
        this._selectWindow.setHandler("cancel", this.onGrowupSelectCancel.bind(this));
        this._selectWindow.setHandler("pageup", this.nextActor.bind(this));
        this._selectWindow.setHandler("pagedown", this.previousActor.bind(this));
        this._selectWindow.select(0);
        this._selectWindow.show();
        this._selectWindow.open();

        this.addWindow(this._selectWindow);
    };

    /**
     * 選択画面のウィンドウ矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     */
    Scene_Growup.prototype.selectWindowRect = function() {
        const statusWindowRect = this.actorStatusWindowRect();
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this.mainAreaHeight();
        const wx = statusWindowRect.x + statusWindowRect.width;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };
    /**
     * 確認ウィンドウを作成する。
     */
    Scene_Growup.prototype.createConfirmApplyWindow = function() {
        this._confirmApplyWindow = new Window_ConfirmApply(this.confirmApplyWindowRect());
        this._confirmApplyWindow.hide();
        this._confirmApplyWindow.deactivate();
        this._confirmApplyWindow.setHandler("ok", this.onConfirmOK.bind(this));
        this._confirmApplyWindow.setHandler("cancel", this.onConfirmCancel.bind(this));
        this.addWindow(this._confirmApplyWindow);
    };

    /**
     * 確認ウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     */
    Scene_Growup.prototype.confirmApplyWindowRect = function() {
        const ww = 480;
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 成長項目選択画面でOK操作を受けたときに通知を受け取る。
     * 
     */
    Scene_Growup.prototype.onGrowupSelectOk = function() {
        this._selectWindow.deactivate();
        const item = this._selectWindow.item();
        if (!item.type) {
            this.popScene();
        } else {
            this._confirmApplyWindow.setMessage(this.confirmMessage(item));
            // if (item.type == "reincarnation") {
            //     this._confirmApplyWindow.setMessage(item.description);
            // } else {
            //     // GPを X 消費して XX を1ポイント上昇させる。
            //     // GPを X 消費して XX を習得する。
            //     this._confirmApplyWindow.setMessage("GPを " + item.cost + " 消費して" + item.text);
            // }
            this._confirmApplyWindow.select(0);
            this._confirmApplyWindow.show();
            this._confirmApplyWindow.activate();
        }
    };

    /**
     * 確認メッセージを得る。
     * 
     * @param {GrowupItem} item 育成項目
     */
    Scene_Growup.prototype.confirmMessage = function(item) {
        return confirmMessageText.format(item.name, TextManager.growPoint, item.cost);
    };

    /**
     * 成長項目選択画面でキャンセル操作を受けたときに通知を受け取る。
     */
    Scene_Growup.prototype.onGrowupSelectCancel = function() {
        // シーンを終了して前に戻す。
        this.popScene();
    };


    /**
     * 確認ウィンドウでOKが選択された時に通知を受け取る。
     */
    Scene_Growup.prototype.onConfirmOK = function() {
        if (this._confirmApplyWindow.index() === 0) {
            // 変更を適用する。
            var item = this._selectWindow.item();
            var actor = this.actor();
            actor.growup(item);
            this._actorStatusWindow.refresh();
            this._selectWindow.refresh();
        }
        this._confirmApplyWindow.deactivate();
        this._confirmApplyWindow.hide();
        this._selectWindow.activate();
    };

    /**
     * 確認ウィンドウでキャンセルが選択された時に通知を受け取る。
     */
    Scene_Growup.prototype.onConfirmCancel = function() {
        this._confirmApplyWindow.deactivate();
        this._confirmApplyWindow.hide();
        this._selectWindow.activate();
    };

    /**
     * シーンを開始する。
     */
    Scene_Growup.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._actorStatusWindow.show();
        this._helpWindow.show();

        this._selectWindow.activate();
    };

    /**
     * アクターが変更されたときに通知を受け取る。
     */
    Scene_Growup.prototype.onActorChange = function() {
        this._actorStatusWindow.setActor(this.actor());
        this._selectWindow.setActor(this.actor());
        this._selectWindow.activate();
    };
    /**
     * ページボタンを作成する必要があるかどうかを取得する。
     * 
     * @return {Boolean} ページボタンが必要な場合にはtrue, それ以外はfalse
     */
    Scene_Growup.prototype.needsPageButtons = function() {
        return true;
    };
    //------------------------------------------------------------------------------
    // Window_MenuCommand
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    /**
     * メニューにオリジナルコマンドを追加する。
     */
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        if (menuEnable && menuCommandText) {
            this.addCommand(menuCommandText, "growup", true);
        }
    };
    //------------------------------------------------------------------------------
    // Scene_Menu
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    /**
     * コマンドウィンドウを作成する。
     */
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("growup", this.commandPersonal.bind(this));
    };

    const _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
    /**
     * アクター選択が必要なコマンドが選択され、
     * アクターが選択された時の処理を行う。
     */
    Scene_Menu.prototype.onPersonalOk = function() {
        if (this._commandWindow.currentSymbol() === "growup") {
            SceneManager.push(Scene_Growup);
        } else {
            _Scene_Menu_onPersonalOk.call(this);
        }
    };


})();