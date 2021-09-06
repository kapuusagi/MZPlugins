/*:ja
 * @target MZ 
 * @plugindesc クエストシステムのUIを提供するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_QuestSystem
 * @orderAfter Kapu_QuestSystem
 * @base Kapu_UI_Window_SimpleMessage
 * @orderAfter Kapu_UI_Window_SimpleMessage
 * 
 * @command startMenuScene
 * @text 受託クエスト一覧を開く
 * @desc 受託クエスト一覧を表示するシーンを開始します。
 * 
 * 
 * @param textLabelQuestName
 * @text 依頼名テキスト
 * @desc 依頼名ラベルとして使用される文字列
 * @type string
 * @default 依頼名
 * 
 * @param textLabelRank
 * @text ランクラベルテキスト
 * @desc ランクラベルとして使用される文字列
 * @type string
 * @default 推奨ランク
 * 
 * @param textNoProperRank
 * @text 推奨ランクなしテキスト
 * @desc 推奨ランクが無い場合に表示するテキスト
 * @type string
 * @default 全て
 * 
 * @param textLabelDeadline
 * @text 期日ラベルテキスト
 * @desc 期日ラベルとして使用される文字列
 * @type string
 * @default 期日
 * 
 * @param textNoDeadline
 * @text 期日なしテキスト
 * @desc 期日が無い場合に使用される文字列
 * @type string
 * @default 無期限
 * 
 * 
 * 
 * @param textLabelDesc
 * @text 詳細ラベルテキスト
 * @desc 詳細ラベルとして使用される文字列
 * @type string
 * @default 依頼内容
 * 
 * @param textLabelAchieve
 * @text 達成条件ラベルテキスト
 * @desc 達成条件ラベルとして使用される文字列
 * @type string
 * @default 達成条件
 * 
 * @param textLabelRewards
 * @text 報酬ラベルテキスト
 * @desc 報酬ラベルとして使用される文字列
 * @type string
 * @default 報酬
 * 
 * @param enableMenuList
 * @text メニューから呼び出せる。
 * @desc メニューからクエストリストを選択して表示できるようにする。
 * @type boolean
 * @default true
 * 
 * @param textMenuQuestList
 * @text メニュー項目名
 * @desc メニュー項目名として表示する文字列。
 * @type string
 * @default 依頼
 * @parent enableMenuList
 * 
 * @param menuCondition
 * @text メニュー項目を有効にする条件
 * @desc メニュー項目を有効にする条件。eval()で評価される。
 * @type string
 * @default true
 * @parent enableMenuList
 * 
 * 
 * @param colorAchieveDone
 * @text 達成したクエストの色
 * @desc 達成したクエストの色
 * @type string
 * @default rgb(128,255,255)
 * 
 * @param colorQuestDone
 * @text 成功したクエストの色
 * @desc 成功したクエストの色
 * @type string
 * @default rgb(128,255,255)
 * 
 * @param colorQuestFail
 * @text 失敗したクエストの色
 * @desc 失敗したクエストの色
 * @type string
 * @default rgb(255,0,0)
 * 
 * 
 * 
 * @help 
 * Kapu_QuestSystemの受託状態を確認するためのユーザーインタフェースプラグインになります。
 * メニュー画面から選択できるようにする(メニュー画面から呼び出せるをON)か、
 * プラグインコマンド「受託クエスト一覧を開く」を選択します。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 受託クエスト一覧を開く
 *   現在受託しているクエストの状態を表示する画面を開きます。
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
 * Window_MenuQuestList
 * クエストリストウィンドウ。メニュー画面にてクエスト一覧を表示する。
 */
 function Window_MenuQuestList() {
    this.initialize(...arguments);
}

/**
 * Window_QuestStatus
 * クエストステータスウィンドウ。クエストの情報を表示する。
 * メニュー及びショップにて、クエストの状態を表示するために使用される。
 */
function Window_QuestStatus() {
    this.initialize(...arguments);
}

/**
 * Scene_MenuQuest
 * 受領中のクエストと状態表示するシーン。
 */
 function Scene_MenuQuest() {
    this.initialize(...arguments);
}





(() => {
    const pluginName = "Kapu_QuestSystem_UI";
    const parameters = PluginManager.parameters(pluginName);
    const textLabelQuestName = parameters["textLabelQuestName"] || "Name";
    const textLabelRank = parameters["textLabelRank"] || "Rank";
    const textNoProperRank = parameters["textNoProperRank"] || "All";
    const textLabelDeadline = parameters["textLabelDeadline"] || "Deadline";
    const textNoDeadline = parameters["textNoDeadline"] || "None";
    const textLabelDesc = parameters["textLabelDesc"] || "Description";
    const textLabelAchieve = parameters["textLabelAchieve"] || "Achive";
    const textLabelRewards = parameters["textLabelRewards"] || "Rewards";
    const enableMenuList = (parameters["enableMenuList"] === undefined)
            ? true : (parameters["enableMenuList"] === "true");
    const textMenuQuestList = parameters["textMenuQuestList"] || "Quests";
    const menuCondition = parameters["menuCondition"] || "";


    const colorAchieveDone = parameters["colorAchieveDone"] || "rgb(128,255,255)";
    const colorQuestDone = parameters["colorQuestDone"] || "rgb(128,255,255)";
    const colorQuestFail = parameters["colorQuestFail"] || "rgb(255,0,0)";

    PluginManager.registerCommand(pluginName, "startMenuScene", args => { // eslint-disable-line no-unused-vars
        SceneManager.push(Scene_MenuQuest);
    });


    //------------------------------------------------------------------------------
    // Window_MenuQuestList

    Window_MenuQuestList.prototype = Object.create(Window_Command.prototype);
    Window_MenuQuestList.prototype.constructor = Window_MenuQuestList;

    /**
     * ウィンドウを初期化する
     * 
     * @param {Rectangle} rect
     */
    Window_MenuQuestList.prototype.initialize = function(rect) {
        $gameParty.refreshQuests(); // クエストの状態更新
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    };

    /**
     * 最大項目数を得る。
     * 
     * @returns {number} 最大項目数
     */
    Window_MenuQuestList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * 
     * @param {number} index インデックス（未指定の場合には現在のインデックス）
     * @returns {Game_Quest} クエストデータ
     */
    Window_MenuQuestList.prototype.questAt = function(index) {
        if (index === undefined) {
            index = this.index();
        }
        return ((index >= 0) && (index < this._quests.length)) ? this._quests[index] : null;
    };

    /**
     * 現在選択されているクエストデータを得る。
     * 
     * @returns {Game_Quest} クエストデータ
     */
    Window_MenuQuestList.prototype.quest = function() {
        return this.questAt(this.index());
    };

    /**
     * 項目を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_MenuQuestList.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        const quest = this.questAt(index);
        if (quest) {
            const name = quest.name();
            if (quest.isDone()) {
                this.changeTextColor(colorQuestDone);
            } else if (quest.isFail()) {
                this.changeTextColor(colorQuestFail)
            } else {
                this.resetTextColor();
            }
            this.drawText(name, rect.x, rect.y, rect.width);
        }
    };

    /**
     * ステータスウィンドウを設定する。
     * 
     * @param {Window_QuestStatus} window クエストステータスウィンドウ
     */
    Window_MenuQuestList.prototype.setStatusWindow = function(window) {
        this._statusWindow = window;
        this.callUpdateHelp();
    };
    /**
     * 現在選択中の項目が選択可能かどうかを得る。
     * 
     * @returns {boolean} 選択可能な場合にはtrue, 選択不可の場合にはfalse
     */
    Window_MenuQuestList.prototype.isCurrentItemEnabled = function() {
        const quest = this.quest();
        return (quest) ? true : false;
    };

    /**
     * 選択項目の説明を更新する。
     */
    Window_MenuQuestList.prototype.callUpdateHelp = function() {
        if (this._statusWindow) {
            const quest = this.quest();
            if (quest) {
                quest.refresh();
            }

            const prevQuest = this._statusWindow.quest();
            const prevQuestId = prevQuest ? prevQuest.id() : 0;
            const newQuestId = quest ? quest.id() : 0;
            this._statusWindow.setQuest(quest);
            if (prevQuestId !== newQuestId) {
                this._statusWindow.setPage(1);
            }
        }
    };
    //------------------------------------------------------------------------------
    // Window_QuestStatus
    Window_QuestStatus.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestStatus.prototype.constructor = Window_QuestStatus;

    /**
     * Window_QuestStatusを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_QuestStatus.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._quest = null;
        this._pageIndex = 0;
    };

    /**
     * クエストデータを設定する。
     * 
     * @param {Game_Quest} quest クエストデータ
     */
    Window_QuestStatus.prototype.setQuest = function(quest) {
        const prevQuestId = (this._quest) ? this._quest.id() : 0;
        const newQuestId = (quest) ? quest.id() : 0;
        if (prevQuestId !== newQuestId) {
            // 異なるクエストを表示するのでペジインデックスをリセットする。
            this._pageIndex = 0;
        }
        this._quest = quest;
        this.refresh();
    };

    /**
     * クエストデータを取得する。
     * 
     * @returns {Game_Quest} クエストデータ
     */
    Window_QuestStatus.prototype.quest = function() {
        return this._quest;
    };

    /**
     * ページインデックスを得る。
     * 
     * @returns {number} ページインデックス
     */
    Window_QuestStatus.prototype.pageIndex = function() {
        return this._pageIndex;
    };

    /**
     * ページインデックスをリセットする。
     */
    Window_QuestStatus.prototype.resetPage = function() {
        this._pageIndex = 0;
        this.refresh();
    };

    /**
     * ページインデックスを設定する。
     * 
     * @param {number} pageIndex ページ番号
     */
    Window_QuestStatus.prototype.setPage = function(pageIndex) {
        if (this._pageIndex !== pageIndex) {
            this._pageIndex = pageIndex;
            this.refresh();
        }
    };

    /**
     * ページインデックスを変更する。
     */
    Window_QuestStatus.prototype.nextPage = function() {
        const prevPageIndex = this._pageIndex;
        const pageIndex = (this._pageIndex + 1);
        if (pageIndex >= this.maxPages()) {
            this._pageIndex = 0;
        } else {
            this._pageIndex = pageIndex;
        }
        if (this._pageIndex !== prevPageIndex) {
            this.refresh();
        }
    };

    /**
     * 最大ページ数を得る。
     */
    Window_QuestStatus.prototype.maxPages = function() {
        return 2;
    };

    /**
     * 表示を更新する。
     */
    Window_QuestStatus.prototype.refresh = function() {
        this.contents.clear();

        const quest = this._quest;
        if (quest === null) {
            return;
        }

        const lineHeight = this.lineHeight();
        const contentsWidth = this.contentsWidth() - 40;

        const x = this.itemPadding();
        let y = this.itemPadding();

        // クエスト名などの基本情報(2行)
        this.drawBasicBlock(quest, x, y, contentsWidth);
        y += lineHeight * 2;
        this.drawHorzLine(y + 4);
        y += 8;

        const height = this.contentsHeight() - y;
        this.drawPage(this._pageIndex, quest, x, y, contentsWidth, height);
    };


    /**
     * ラベル幅を得る。
     * 
     * @returns {number} ラベル幅
     */
    Window_QuestStatus.prototype.labelWidth = function() {
        return 120;
    };

    /**
     * クエスト名ブロックを描画する。
     * 
     * @param {Game_Quest}} quest クエスト
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_QuestStatus.prototype.drawBasicBlock = function(quest, x, y, width) {
        const lineHeight = this.lineHeight();
        const padding = this.itemPadding();
        // サクッと書く
        this.drawQuestName(quest, x, y, width);

        const rankY = y + lineHeight;
        const rankWidth = (width - padding) / 2;
        this.drawQuestGuildRank(quest, x, rankY, rankWidth);

        const deadLineX = x + rankWidth + padding;
        const deadLineY = rankY;
        const deadLineWidth = rankWidth;
        this.drawQuestDeadline(quest, deadLineX, deadLineY, deadLineWidth);
    };

    /**
     * ページを描画する。
     * 
     * @param {number} page ページ番号
     * @param {Game_Quest} quest クエスト
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    Window_QuestStatus.prototype.drawPage = function(page, quest, x, y, width, height) {
        if (page === 0) {
            this.drawPage0(quest, x, y, width, height);
        } else if (page === 1) {
            this.drawPage1(quest, x, y, width, height);
        }
    };

    /**
     * クエストを描画する。
     * 
     * @param {Game_Quest} quest クエスト
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    // eslint-disable-next-line no-unused-vars
    Window_QuestStatus.prototype.drawPage0 = function(quest, x, y, width, height) {
        const lineHeight = this.lineHeight();
        // 概要(2行)
        this.drawQuestDescription(quest, x, y, width);
        y += lineHeight * 2;
        this.drawHorzLine(y + 4);
        y += 8;

        // 達成条件(3行)
        this.drawQuestAchieveMsg(quest, x, y, width);
        y += lineHeight * 3;
        this.drawHorzLine(y + 4);
        y += 8;

        // 報酬(3行)
        this.drawQuestRewardsMsg(quest, x, y);
    };
    /**
     * クエストを描画する。
     * 
     * @param {Game_Quest} quest クエスト
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    // eslint-disable-next-line no-unused-vars
    Window_QuestStatus.prototype.drawPage1 = function(quest, x, y, width, height) {
        const lineHeight = this.lineHeight();

        // 概要(2行)
        this.drawQuestDescription(quest, x, y, width);
        y += lineHeight * 2;
        this.drawHorzLine(y + 4);
        y += 8;

        // 報酬(3行)
        this.drawQuestRewardsMsg(quest, x, y);
        y += lineHeight * 3;
        this.drawHorzLine(y + 4);
        y += 8;

        // 達成条件(状態)を詳細に書く
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textLabelAchieve + ":", x, y, width);
        y += lineHeight;
        for (let no = 0; no < quest.achieveCount(); no++) {
            const achieveStatus = quest.achieveStatus(no);
            if (achieveStatus) {
                // 達成条件文字列(text)と達成条件状態を書く。
                this.drawQuestAchieveStatus(achieveStatus, x, y, width);
                y += lineHeight;
            }
        }
    };

    /**
     * クエスト名を描画する。
     *
     * @param {Game_Quest} quest クエスト
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_QuestStatus.prototype.drawQuestName = function(quest, x, y, width) {
        const labelWidth = this.labelWidth();
        const padding = this.itemPadding();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textLabelQuestName + ":", x, y, labelWidth, "right");
        this.resetTextColor();
        const nameX = x + labelWidth + padding;
        const nameWidth = width - labelWidth - padding;
        this.drawText(quest.name(), nameX, y, nameWidth);
    };

    /**
     * クエストのギルドランクを描画する。
     * 
     * @param {Game_Quest} quest  クエストデータ
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_QuestStatus.prototype.drawQuestGuildRank = function(quest, x, y, width) {
        const labelWidth = this.labelWidth();
        const padding = this.itemPadding();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textLabelRank + ":", x, y, labelWidth, "right");
        this.resetTextColor();
        const rankX = x + labelWidth + padding;
        const rankWidth = width - labelWidth - padding;
        if (quest.guildRank() > 0) {
            this.drawText(quest.rankName(), rankX, y, rankWidth);
        } else {
            this.drawText(textNoProperRank, rankX, y, rankWidth);
        }
    };

    /**
     * クエストの期日を描画する。
     * 
     * @param {Game_Quest} quest  クエストデータ
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_QuestStatus.prototype.drawQuestDeadline = function(quest, x, y, width) {
        const labelWidth = this.labelWidth();
        const padding = this.itemPadding();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textLabelDeadline + ":", x, y, labelWidth, "right");
        this.resetTextColor();
        const deadlineX = x + labelWidth + padding;
        const deadlineWidth = width - labelWidth - padding;
        const deadlineText = quest.deadlineText();
        if (deadlineText) {
            this.drawText(deadlineText, deadlineX, y, deadlineWidth);
        } else {
            this.drawText(textNoDeadline, deadlineX, y, deadlineWidth);
        }
    };

    /**
     * 依頼内容を描画する。
     * 
     * @param {Game_Quest} quest クエスト
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 描画幅
     */
    Window_QuestStatus.prototype.drawQuestDescription = function(quest, x, y, width) {
        const labelWidth = this.labelWidth();
        const padding = this.itemPadding();
        this.changeTextColor(ColorManager.systemColor());
        const text = textLabelDesc + ":";
        this.drawText(text, x, y, labelWidth, "right");
        this.resetTextColor();
        const descWidth = width - labelWidth - padding;
        this.drawTextEx(quest.description(), x + labelWidth + padding, y, descWidth);
    };

    /**
     * 依頼の達成条件文を描画する。
     * 
     * @param {Game_Quest} quest クエスト
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 描画幅
     */
    Window_QuestStatus.prototype.drawQuestAchieveMsg = function(quest, x, y, width) {
        const labelWidth = this.labelWidth();
        const padding = this.itemPadding();
        this.changeTextColor(ColorManager.systemColor());
        const text = textLabelAchieve + ":";
        this.drawText(text, x, y, labelWidth, "right");
        this.resetTextColor();
        const msgWidth = width - labelWidth - padding;
        this.drawTextEx(quest.achieveText(), x + labelWidth + padding, y, msgWidth);
    };

    /**
     * 依頼の報酬文を描画する。
     * 
     * @param {Game_Quest} quest クエスト
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 描画幅
     */
    Window_QuestStatus.prototype.drawQuestRewardsMsg = function(quest, x, y, width) {
        const labelWidth = this.labelWidth();
        const padding = this.itemPadding();
        this.changeTextColor(ColorManager.systemColor());
        const text = textLabelRewards + ":";
        this.drawText(text, x, y, labelWidth, "right");
        this.resetTextColor();
        const msgWidth = width - labelWidth - padding;
        this.drawTextEx(quest.rewardText(), x + labelWidth + padding, y, msgWidth);
    };

    /**
     * 達成条件ステータスを描画する。
     * 
     * @param {object} status 達成条件ステータスオブジェクト
     * @param {number} x x値 
     * @param {number} y y値
     * @param {number} width 幅 
     */
    Window_QuestStatus.prototype.drawQuestAchieveStatus = function(status, x, y, width) {
        const countWidth = Math.min(this.textWidth("xxx/xxx"), width * 0.4);
        if (status.status === Game_Quest.STATUS_DONE) {
            this.changeTextColor(colorAchieveDone);
        } else if (status.status === Game_Quest.STATUS_FAIL) {
            this.changeTextColor(colorQuestFail);
        } else {
            this.resetTextColor();
        }
        const padding = this.itemPadding();
        const textWidth = width - countWidth - padding;
        this.drawText(status.text, x, y, textWidth);
        const countX = x + textWidth + padding;
        const countText = status.current + "/" + status.total;
        this.drawText(countText, countX, y, countWidth, "right");
    };

    /**
     * 水平ラインを描画する。
     * @param {number} y 描画位置y
     */
    Window_QuestStatus.prototype.drawHorzLine = function(y) {
        this.contents.paintOpacity = 48;
        this.contents.fillRect(0, y, this.contentsWidth(), 2, this.lineColor());
        this.contents.paintOpacity = 255;
    };

    /**
     * 線描画色を得る。
     * 
     * @returns {Color} 線描画色
     */
    Window_QuestStatus.prototype.lineColor = function() {
        return ColorManager.normalColor();
    };
     //------------------------------------------------------------------------------
    // Scene_MenuQuest
    //     

    Scene_MenuQuest.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_MenuQuest.prototype.constructor = Scene_MenuQuest;

    /**
     * Scene_MenuQuestを初期化する。
     */
    Scene_MenuQuest.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.apply(this, arguments);
    };

    /**
     * シーンに関係するオブジェクト（ウィンドウなど）を作成する。
     */
    Scene_MenuQuest.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createStatusWindow();
    };

    /**
     * コマンドウィンドウを作成する。
     */
    Scene_MenuQuest.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_MenuQuestList(rect);
        this._commandWindow.setHandler("ok", this.onCommandOk.bind(this));
        this._commandWindow.setHandler("cancel", this.onCommandCancel.bind(this));
        this._commandWindow.hide();
        this.addWindow(this._commandWindow);
    };
    /**
     * コマンドウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_MenuQuest.prototype.commandWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = Graphics.boxHeight - this.mainAreaTop();
        const wx = 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスウィンドウを作成する。
     */
    Scene_MenuQuest.prototype.createStatusWindow = function() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_QuestStatus(rect);
        this._commandWindow.setStatusWindow(this._statusWindow);
        this.addWindow(this._statusWindow);
    };
    /**
     * ステータスウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ステータスウィンドウ矩形領域
     */
    Scene_MenuQuest.prototype.statusWindowRect = function() {
        const rect = this.commandWindowRect();
        const ww = Graphics.boxWidth - rect.width;
        const wh = rect.height;
        const wx = rect.width;
        const wy = rect.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * シーンを開始する。
     */
    Scene_MenuQuest.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._commandWindow.show();
        this._statusWindow.show();
        this._commandWindow.activate();
    };

    /**
     * コマンド画面でOK操作されたときの処理を行う。
     */
    Scene_MenuQuest.prototype.onCommandOk = function() {
        this._statusWindow.nextPage();
        this._commandWindow.activate();
    };

    /**
     * コマンド画面でキャンセル操作をしたときの処理を行う。
     */
    Scene_MenuQuest.prototype.onCommandCancel = function() {
        this.popScene();
    };

    //------------------------------------------------------------------------------
    // Window_MenuCommand
    if (enableMenuList) {
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        /**
         * メニューにオリジナルコマンドを追加する。
         * 
         * プラグインで必要に応じてフックする。
         */
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.call(this);

            let isMenuEnabled = ($gameParty.quests().length > 0);
            if (isMenuEnabled && menuCondition) {
                try {
                    isMenuEnabled = eval(menuCondition);
                }
                catch (e) {
                    console.log(e);
                    isMenuEnabled = true;
                }
            }

            this.addCommand(textMenuQuestList, "quest", isMenuEnabled);
        };
    }

    //------------------------------------------------------------------------------
    // Scene_Menu
    if (enableMenuList) {
        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        /**
         * コマンドウィンドウを作成する。
         */
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.call(this);
            this._commandWindow.setHandler("quest", this.commandQuest.bind(this));
        };

        /**
         * クエストコマンドが選択されたときの処理を行う。
         */
        Scene_Menu.prototype.commandQuest = function() {
            SceneManager.push(Scene_MenuQuest);
        };
    }
})();
