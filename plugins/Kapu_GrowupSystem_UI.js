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
 * @help 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/**
 * Window_GrowupActorStatus
 * 
 * 成長画面のアクター表示をする。
 */
function Window_GrowupActorStatus() {
    this.initialize(this, ...arguments);
}

/**
 * Window_GrowupSelect
 * 成長画面の項目選択を提供する。
 */
function Window_GrowupSelect() {
    this.initialize.apply(this, arguments);
}

/**
 * Window_ConfirmApply.
 * 適用確認メッセージウィンドウ。
 */
function Window_ConfirmApply() {
    this.initialize.apply(this, arguments);
}

/**
 * 育成シーン。
 * 成長ポイントを使用してアクターを強化する。
 */
function Scene_Growup() {
    this.initialize.apply(this, arguments);
}

(() => {
    const pluginName = "Kapu_GrowupSystem_UI";
    const parameters = PluginManager.parameters(pluginName);
    const menuEnable = Boolean(parameters["menuEnable"]) || false;
    const menuCommandText = String(parameters["menuCommandText"]) || "";

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
        this.hide();
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
        var x = this.standardPadding();
        var y = this.standardPadding();
        var actor = this._actor;
        this.contents.clear();
        this.drawActorFace(actor, x, y);
        var nameX = x + 144 + this.textPadding();
        var nameY = y;
        var nameWidth = this.contentsWidth() - nameX - this.textPadding();
        this.drawActorName(actor, nameX, nameY, nameWidth);
        var levelX = nameX;
        var levelY = nameY + this.lineHeight();
        this.drawActorLevel(actor, levelX, levelY);
        var gpX = nameX;
        var gpY = levelY + this.lineHeight();
        var gpWidth = nameWidth;
        this.drawActorGrowPoint(actor, gpX, gpY, gpWidth);

        // 基本ステータス描画するぜ。
        var statusX = x;
        var statusY = y + 144 + this.standardPadding();
        var statusWidth = this.width - this.standardPadding() * 2;
        this.changeTextColor(this.normalColor());
        this.drawText("基本ステータス", statusX, statusY, statusWidth);
        statusY += this.lineHeight();

        var statusNames = TWLD.Core.StatusNames;
        for (var i = 0; i < 6; i++) {
            var paramValue =  actor.getBasicParam(i);
            var correct = paramValue - actor.getBasicParamBase(i); // 装備による補正値
            this.drawBasicParam(statusNames[i], paramValue, correct, statusX, statusY, statusWidth);
            statusY += this.lineHeight();
        }
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
        this._items = [];
        this._actor = null;
        Window_Selectable.prototype.initialize.call(rect);
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
            return this._items[this.index()];
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
        // if (this._actor.canReincarnation()) {
        //     var rItem = new GrowupItem('reincarnation');
        //     rItem.iconIndex = TWLD.Core.ReincarnationIconIndex;
        //     rItem.text = "レベルを1に戻して再成長させる。";
        //     rItem.id = -1;
        //     rItem.gpCost = 0;
        //     rItem.description = "再成長ボーナスを得て、レベル1から育てなおします。";
        //     this._items.push(rItem);
        // }
    
        // var statusNames = TWLD.Core.StatusNames;
        // for (var i = 0; i < 6; i++) {
        //     var paramItem = new GrowupItem('basicParam');
        //     paramItem.iconIndex = TWLD.Core.BasicParamIcons[i];
        //     paramItem.text = statusNames[i] + "を1ポイント上昇させる。";
        //     paramItem.id = i;
        //     paramItem.gpCost = this._actor.getBasicParamGrowCost(i);
        //     paramItem.description = TWLD.Core.BasicParamDescriptions[i];
        //     this._items.push(paramItem);
        // }
        
        // this._actor.updateGpLearnableSkills();
        // this._actor.getGpLearnableSkills().forEach(function (skill) {
        //     var skillItem = new GrowupItem('skill');
        //     skillItem.iconIndex = skill.iconIndex,
        //     skillItem.text = skill.name + "を習得する。",
        //     skillItem.id = skill.id,
        //     skillItem.gpCost = skill.gpCost;
        //     skillItem.description = skill.description;
        //     this._items.push(skillItem);
        // }, this);
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
        const width = rect.width - this.standardPadding() - gpWidth;
        if (width >= 480) {
            width = 480;
        }
        this.changeTextColor(this.normalColor());
        this.drawText(item.text, x, rect.y, width);

        // GPコスト描画
        const x2 = x + width;
        const costStr = TextManager.growPoint + "-" + item.gpCost;
        this.changeTextColor(this.systemColor());
        this.drawText(costStr, x2, rect.y, gpWidth);
        this.changePaintOpacity(true);
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
            return item.gpCost <= this._actor.getGrowPoint();
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
        this._items = [ '', TextManager.cancel];
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
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

    // /**
    //  * コンテンツにあわせて、最適な位置/サイズに変更する。
    //  */
    // Window_ConfirmApply.prototype.setPreferredPosition = function() {
    //     var itemWidth = this.maxItemWidth();
    //     var prevWidth = this.width;
    //     var prevHeight = this.height;
    //     var width = this.padding * 2 + itemWidth;
    //     var height = this.padding * 2 + this.lineHeight() * this._items.length;
    //     var x = (Graphics.boxWidth - width) / 2;
    //     var y = (Graphics.boxHeight - height) / 2;
    //     this.move(x, y, width, height);
    //     if ((width !== prevWidth) && (height !== prevHeight)) {
    //         // ウィンドウサイズが変わったので描画バッファを再構築する。
    //         this.createContents();
    //     }
    //     Window_Selectable.prototype.refresh.call(this);
    // };
    
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
        this.drawText(this._items[index], rect.x, rect.y, rect.width, 'left');
        this.changeTextColor(this.normalColor());
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
        const wh = this.mainAreaTop();
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
        this._selectWindow.setHandler('ok', this.onGrowupSelectOk.bind(this));
        this._selectWindow.setHandler('cancel', this.onGrowupSelectCancel.bind(this));
        this._selectWindow.setHandler('pageup', this.nextActor.bind(this));
        this._selectWindow.setHandler('pagedown', this.previousActor.bind(this));
        this._selectWindow.select(0);

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
        const wx = statusWindowRect.x + statusWindowRect.y;
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
        this._confirmApplyWindow.setHandler('ok', this.onConfirmOK.bind(this));
        this._confirmApplyWindow.setHandler('cancel', this.onConfirmCancel.bind(this));
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
     * @method onGrowupSelectOk
     * @memberof Scene_Growup
     */
    Scene_Growup.prototype.onGrowupSelectOk = function() {
        this._selectWindow.deactivate();
        const item = this._selectWindow.item();
        this._confirmApplyWindow.setMessage(item.msg);
        // if (item.type == 'reincarnation') {
        //     this._confirmApplyWindow.setMessage(item.description);
        // } else {
        //     // GPを X 消費して XX を1ポイント上昇させる。
        //     // GPを X 消費して XX を習得する。
        //     this._confirmApplyWindow.setMessage("GPを " + item.gpCost + " 消費して" + item.text);
        // }
        this._confirmApplyWindow.select(0);
        this._confirmApplyWindow.show();
        this._confirmApplyWindow.activate();
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
            // switch (item.type) {
            //     case 'reincarnation':
            //         actor.reincarnation();
            //         break;
            //     case 'basicParam':
            //         var paramId = item.id;
            //         actor.growBasicParamByGp(paramId);
            //         break;
            //     case 'skill':
            //         var skillId = item.id;
            //         actor.learnSkillByGp(skillId);
            //         break;
            // }

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

    //------------------------------------------------------------------------------
    // Window_MenuCommand
    /**
     * メニューにオリジナルコマンドを追加する。
     */
    Window_MenuCommand.prototype.addOriginalCommands = function() {
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