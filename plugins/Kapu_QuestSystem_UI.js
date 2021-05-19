/*:ja
 * @target MZ 
 * @plugindesc クエストシステムのUIを提供するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_QuestSystem
 * @orderAfter Kapu_QuestSystem
 * 
 * @command startMenuScene
 * @text 受託クエスト一覧を開く
 * @desc 受託クエスト一覧を表示するシーンを開始します。
 * 
 * @command startQuestShop
 * @text クエストショップを開く
 * @desc クエストショップのシーンを開始します。
 * 
 * @arg questIds
 * @text 受託可能クエストリスト
 * @desc 受託可能クエストリスト
 * @type number[]
 * @default []
 * 
 * @arg cleakFileName
 * @text 店員ファイル名
 * @desc 店員ファイル名
 * @type file
 * @dir img/pictures/
 * @default 
 * 
 * 
 * @param successSe
 * @text 成功時音
 * @desc クエスト達成時に鳴らす音
 * @type struct<SoundEffect>
 * @default {"name":"","volume":"90","pitch":"100","pan":"100"}
 * 
 * @param failSe
 * @text 失敗時音
 * @desc クエスト失敗時に鳴らず音
 * @type struct<SoundEffect>
 * @default {"name":"","volume":"90","pitch":"100","pan":"100"}
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
 * @default ランク
 * 
 * @param textLabelDesc
 * @text 詳細ラベルテキスト
 * @desc 詳細ラベルとして使用される文字列
 * @type string
 * @default 依頼内容
 * 
 * @param textLabelAchive
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
 * 
 * @param textShopAccept
 * @text クエストショップの受託コマンド
 * @desc 受けるコマンドとして表示される文字列
 * @type string
 * @default 受ける
 * 
 * @param textShopReport
 * @text クエストショップ報告コマンド
 * @desc 報告コマンドとして表示される文字列
 * @type string
 * @default 報告する
 * 
 * @param textShopGiveup
 * @text クエストショップ断念コマンド
 * @desc 断念コマンドとして表示される文字列
 * @type string
 * @default ギブアップする
 * 
 * 
 * @param textStatusTrying
 * @text 受託中状態テキスト
 * @desc 受託状態を表す文字列。
 * @type string
 * @default 請負中
 * 
 * @param textStatusDone
 * @text 報告可能状態テキスト
 * @desc 報告可能な状態を表す文字列
 * @type string
 * @default 報告可
 * 
 * @param textYes
 * @text 選択肢のOKテキスト
 * @desc 選択肢のOKテキスト
 * @type string
 * @default はい
 * 
 * @param textMessageConfirmRank1
 * @text 確認テキスト
 * @desc 確認テキスト
 * @type string
 * @default パーティーのギルドランクより高い難易度です。
 * 
 * @param textMessageConfirmRank2
 * @text 確認テキスト
 * @desc 確認テキスト。%1にクエスト名
 * @type string
 * @default %1を請け負いますか？
 * 
 * @param textMessageConfirmGiveup
 * @text ギブアップ確認テキスト
 * @desc ギブアップ確認テキスト。%1にクエスト名が入る
 * @type string
 * @default %1をギブアップしますか？
 * 
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
/*~struct~SoundEffect:
 *
 * @param name
 * @type file
 * @dir audio/se/
 * @desc 効果音のファイル名
 * @default 
 * @require 1
 *
 * @param volume
 * @type number
 * @max 100
 * @desc 効果音の音量
 * 初期値: 90
 * @default 90
 *
 * @param pitch
 * @type number
 * @min 50
 * @max 150
 * @desc 効果音のピッチ
 * 初期値: 100
 * @default 100
 *
 * @param pan
 * @type number
 * @min -100
 * @max 100
 * @desc 効果音の位相
 * 初期値: 0
 * @default 0
 *
 */

/**
 * Window_MenuQuestList
 * クエストリストウィンドウ
 */
 function Window_MenuQuestList() {
    this.initialize(...arguments);
}

/**
 * Window_QuestStatus
 * クエストステータスウィンドウ
 */
function Window_QuestStatus() {
    this.initialize(...arguments);
}

/**
 * Scene_MenuQuest
 * 受領中のクエストと状態表示
 */
 function Scene_MenuQuest() {
    this.initialize(...arguments);
}

/**
 * Window_QuestShopCommand
 * クエスト店のコマンドウィンドウ
 */
function Window_QuestShopCommand() {
    this.initialize(...arguments);
}
/**
 * Window_QuestShopUnderTaskList
 * 請け負うことが可能なクエスト一覧を表示するウィンドウ
 */
function Window_QuestShopUnderTakeList() {
    this.initialize(...arguments);
}
/**
 * Window_QuestShopReportList
 * 報告可能なクエスト一覧を表示・選択するウィンドウ
 */
function Window_QuestShopReportList() {
    this.initialize(...arguments);
}

/**
 * Window_QuestShopMessage
 * クエストショップメッセージウィンドウ
 */
function Window_QuestShopMessage() {
    this.initialize(...arguments);
}


/**
 * Window_QuestShopGiveupList
 * ギブアップするクエストを表示・選択するウィンドウ
 */
function Window_QuestShopGiveupList() {
    this.initialize(...arguments);
}

/**
 * Window_QuestShopConfirm
 * 確認ウィンドウ
 */
function Window_QuestShopConfirm() {
    this.initialize(...arguments);
}
/**
 * Window_QuestShopRewards
 * 報酬表示ウィンドウ
 */
function Window_QuestShopRewards() {
    this.initialize(...arguments);
}

/**
 * Scene_QuestShop
 * 
 */
function Scene_QuestShop() {
    this.initialize(...arguments);
}
(() => {
    const pluginName = "Kapu_QuestSystem_UI";
    const parameters = PluginManager.parameters(pluginName);
    const failSe = JSON.parse(parameters["failSe"] || "{}");
    const successSe = JSON.parse(parameters["successSe"] || "{}");
    const textLabelQuestName = parameters["textLabelQuestName"] || "Name";
    const textLabelRank = parameters["textLabelRank"] || "Rank";
    const textLabelDesc = parameters["textLabelDesc"] || "Description";
    const textLabelAchive = parameters["textLabelAchive"] || "Achive";
    const textLabelRewards = parameters["textLabelRewards"] || "Rewards";
    const enableMenuList = (parameters["enableMenuList"] === undefined)
            ? true : (parameters["enableMenuList"] === "true");
    const textMenuQuestList = parameters["textMenuQuestList"] || "Quests";
    const menuCondition = parameters["menuCondition"] || "";

    const textShopAccept = parameters["textShopGiveup"] || "Accept";
    const textShopReport = parameters["textShopReport"] || "Report";
    const textShopGiveup = parameters["textShopGiveup"] || "Giveup";

    const textStatusTrying = parameters["textStatusTrying"] || "Trying";
    const textStatusDone = parameters["textStatusDone"] || "Done";
    const textYes = parameters["textYes"] || "Yes";
    const textMessageConfirmRank1 = parameters["textMessageConfirmRank1"] || "This is difficult for this party.";
    const textMessageConfirmRank2 = parameters["textMessageConfirmRank2"] || "Do you accept %1?";
    const textMessageConfirmGiveup = parameters["textMessageConfirmGiveup"] || "Giveup %1?";

    PluginManager.registerCommand(pluginName, "startMenuScene", args => { // eslint-disable-line no-unused-vars
        SceneManager.push(Scene_MenuQuest);
    });

    PluginManager.registerCommand(pluginName, "startQuestShop", args => {
        const ids = JSON.parse(args.questIds).map(str => Number(str) || 0);
        const clerkFileName = args.clerkFileName || "";
        const questIds = [];
        for (const id of ids) {
            if ((id > 0) && !questIds.includes(id)) {
                questIds.push(id);
            }
        }
        SceneManager.push(Scene_QuestShop);
        SceneManager.prepareNextScene(questIds, clerkFileName);
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
        $gameParty.updateQuests(); // クエストの状態更新
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    };

    /**
     * 最大項目数を得る。
     * 
     * @returns {Number} 最大項目数
     */
    Window_MenuQuestList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * 
     * @param {Number} index インデックス（未指定の場合には現在のインデックス）
     * @returns {Game_Quest} クエストデータ
     */
    Window_MenuQuestList.prototype.item = function(index) {
        if (index === undefined) {
            index = this.index();
        }
        return ((index >= 0) && (index < this._quests.length)) ? this._quests[index] : null;
    };

    /**
     * 項目を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_MenuQuestList.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        const quest = this.item(index);
        if (quest) {
            const name = quest.name();
            if (quest.isDone()) {
                this.changeTextColor(ColorManager.textColor(1));
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
     * 選択項目の説明を更新する。
     */
    Window_MenuQuestList.prototype.callUpdateHelp = function() {
        if (this._statusWindow) {
            this._statusWindow.setQuest(this.item());
        }
    };
    //------------------------------------------------------------------------------
    // Window_QuestStatus
    Window_QuestStatus.prototype = Object.create(Window_Base.prototype);
    Window_QuestStatus.prototype.constructor = Window_QuestStatus;

    /**
     * Window_QuestStatusを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_QuestStatus.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._quest = null;
    };

    /**
     * クエストデータを設定する。
     * 
     * @param {Game_Quest} quest クエストデータ
     */
    Window_QuestStatus.prototype.setQuest = function(quest) {
        this._quest = quest;
        this.refresh();
    }

    /**
     * 表示を更新する。
     */
    Window_QuestStatus.prototype.refresh = function() {
        const quest = this._quest;
        this.contents.clear();
        if (quest === null) {
            return;
        }

        const lineHeight = this.lineHeight();
        const contentsWidth = this.contentsWidth() - 40;

        const x = this.itemPadding();
        let y = this.itemPadding();
        // クエスト名（Window_MenuQuestListにあるからいらないかも？）
        this.drawQuestName(quest, x, y, contentsWidth);
        y += lineHeight;
        this.drawHorzLine(y + 4);
        y += 8;

        // 概要
        this.drawQuestDescription(quest, x, y);
        y += lineHeight * 3;
        this.drawHorzLine(y + 4);
        y += 8;

        // 達成条件
        this.drawQuestAchieve(quest, x, y, contentsWidth);
        y += lineHeight * 4;
        this.drawHorzLine(y + 4);
        y += 8;

        // 報酬
        this.drawQuestRewards(quest, x, y);
    };

    /**
     * ラベル幅を得る。
     * 
     * @returns {Number} ラベル幅
     */
    Window_QuestStatus.prototype.labelWidth = function() {
        return 120;
    };

    /**
     * クエスト名を描画する。
     * 
     * @param {Game_Quest}} quest クエスト
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     */
    Window_QuestStatus.prototype.drawQuestName = function(quest, x, y, width) {
        const labelWidth = this.labelWidth();
        const padding = this.itemPadding();
        const rankWidth = 120;
        const nameWidth = width - padding * 2 - labelWidth - rankWidth;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textLabelQuestName + ":", x, y, labelWidth);
        x += labelWidth + padding;
        this.resetTextColor();
        this.drawText(quest.name(), x, y, nameWidth);
        x += nameWidth + padding;
        this.changeTextColor(ColorManager.systemColor());

        const labelRank = textLabelRank + ":";
        this.drawText(labelRank, x, y, rankWidth);
        this.resetTextColor();
        const rankLabelWidth = this.textWidth(labelRank);
        x += rankLabelWidth;
        this.drawText(quest.rankName(), x, y, rankWidth - rankLabelWidth)
    };

    /**
     * 依頼内容を描画する。
     * 
     * @param {Game_Quest} quest クエスト
     * @param {Number} x x位置
     * @param {Number} y y位置
     */
    Window_QuestStatus.prototype.drawQuestDescription = function(quest, x, y) {
        const labelWidth = this.labelWidth();
        const padding = this.itemPadding();
        this.changeTextColor(ColorManager.systemColor());
        const text = textLabelDesc + ":";
        this.drawText(text, x, y, labelWidth, "right");
        this.resetTextColor();
        this.drawTextEx(quest.description(), x + labelWidth + padding, y);
    };

    /**
     * 達成条件を記述する。
     * 
     * @param {Game_Quest} quest クエスト
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     */
    Window_QuestStatus.prototype.drawQuestAchieve = function(quest, x, y, width) {
        const labelWidth = this.labelWidth();
        const padding = this.itemPadding();
        this.changeTextColor(ColorManager.systemColor());
        const text = textLabelAchive + ":";
        this.drawText(text, x, y, labelWidth, "right");
        this.resetTextColor();
        this.drawTextEx(quest.achieveText(), x + labelWidth + padding, y);
        y += this.lineHeight() * 3;

        const total = quest.getTotal();
        if (total > 0) {
            const numWidth = this.textWidth("XX/XX"); 
            const name = quest.getTargetName();
            let nameWidth = this.textWidth(name) + 6;
            if ((nameWidth + numWidth) > width) {
                nameWidth = width - numWidth - 6;
            }
            const elapse = quest.getElapse();
            this.resetTextColor();
            this.drawText(name, x, y, nameWidth);
            this.drawText(elapse + "/" + total, x + nameWidth + 6, y, numWidth, "left");
        }
    };

    /**
     * 報酬を記述する。
     * 
     * @param {Game_Quest} quest クエスト
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     */
    Window_QuestStatus.prototype.drawQuestRewards = function(quest, x, y) {
        const labelWidth = this.labelWidth();
        const padding = this.itemPadding();
        this.changeTextColor(ColorManager.systemColor());
        const text = textLabelRewards + ":";
        this.drawText(text, x, y, labelWidth);
        this.resetTextColor();
        this.drawTextEx(quest.rewardText(), x + labelWidth + padding, y);
    };

    /**
     * 水平ラインを描画する。
     * @param {Number} y 描画位置y
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
    Scene_MenuBase.prototype.commandWindowRect = function() {
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
    Scene_MenuBase.prototype.statusWindowRect = function() {
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
    //------------------------------------------------------------------------------
    // Window_QuestShopCommand
    Window_QuestShopCommand.prototype = Object.create(Window_Command.prototype);
    Window_QuestShopCommand.constructor = Window_QuestShopCommand;

    /**
     * 初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_QuestShopCommand.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    /**
     * 行数を得る。
     */
    Window_QuestShopCommand.prototype.numVisibleRows = function() {
        return 4;
    };

    /**
     * コマンドリストを構築する。
     */
    Window_QuestShopCommand.prototype.makeCommandList = function() {
        this.addCommand(textShopAccept, "accept");
        this.addCommand(textShopReport, "report");
        this.addCommand(textShopGiveup, "giveup");
        this.addCommand(TextManager.cancel, "cancel");
    };

    //------------------------------------------------------------------------------
    // Window_QuestShopUnderTaskList
    Window_QuestShopUnderTakeList.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestShopUnderTakeList.prototype.constructor = Window_QuestShopUnderTakeList;

    /**
     * ウィンドウを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_QuestShopUnderTakeList.prototype.initialize = function(rect) {
        $gameParty.updateQuests(); // クエストの状態更新
        this._quests = [];
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    };

    /**
     * 受託可能クエストリストを設定する
     * 
     * @param {Array<Game_Quest>} quests クエスト一覧
     */
    Window_QuestShopUnderTakeList.prototype.setQuests = function(quests) {
        this._quests = quests;
        this.refresh();
    };

    /**
     * 最大項目数を得る。
     * 
     * @returns {Number} 最大項目数
     */
    Window_QuestShopUnderTakeList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * 
     * @param {Number} index インデックス（未指定の場合には現在のインデックス）
     * @returns {Game_Quest} クエストデータ
     */
    Window_QuestShopUnderTakeList.prototype.item = function(index) {
        if (index === undefined) {
            index = this.index();
        }
        return ((index >= 0) && (index < this._quests.length)) ? this._quests[index] : null;
    };

    /**
     * 現在選択中の項目が選択可能かどうかを判定する。
     */
    Window_QuestShopUnderTakeList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.index());
    };

    /**
     * indexで指定される項目が選択可能かどうかを判定する。
     * 派生クラスはこのメソッドを実装して選択可否判定を行うこと。
     * 
     * @param {Number} index インデックス番号
     * @returns {Boolean} 選択可能な場合にはtrue, それ以外はfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Window_QuestShopUnderTakeList.prototype.isEnabled = function(index) {
        if ($gameParty.quests().length >= 3) {
            return false; // 3件以上受託中。
        }
        const quest = this.item(index);
        if ($gameParty.isTryingQuest(quest.id())) {
            return false; // 既に受託中
        }

        // 受託可否判定
        return $gameParty.canAcceptQuest(quest);
    };

    /**
     * ステータスウィンドウを設定する。
     * @param {Window_QuestStatus}} window クエストステータスウィンドウ
     */
    Window_QuestShopUnderTakeList.prototype.setStatusWindow = function(window) {
        this._statusWindow = window;
        this.callUpdateHelp();
    };

    /**
     * 選択項目の説明を更新する。
     */
    Window_QuestShopUnderTakeList.prototype.callUpdateHelp = function() {
        if (this._statusWindow) {
            let quest = this.item();
            if (quest !== null) {
                const questId = quest.id();
                if ($gameParty.isTryingQuest(questId)) {
                    // もし受領中クエストがあるなら、そっちのデータを表示する。
                    quest = $gameParty.quests().find(function(q) {
                        return q.id() === questId;
                    });
                }
                this._statusWindow.setQuest(quest);
            } else {
                this._statusWindow.setQuest(quest);
            }
        }
    };
    
    /**
     * 項目を描画する。
     * @param {Number} index インデックス番号
     */
    Window_QuestShopUnderTakeList.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        const quest = this.item(index);
        if (quest) {
            this.changePaintOpacity(this.isEnabled(index));
            const name = quest.name();
            if (quest.isDone()) {
                this.changeTextColor(ColorManager.textColor(1));
            } else {
                this.resetTextColor();
            }
            const nameWidth = rect.width - 96;
            this.drawText(name, rect.x, rect.y, nameWidth);
            if ($gameParty.isTryingQuest(quest.id())) {
                this.changeTextColor(ColorManager.textColor(1));
                this.drawText(textStatusTrying, rect.x + nameWidth, rect.y, 96, "right");
            }
            this.changePaintOpacity(false);
        }
    };
    //------------------------------------------------------------------------------
    // Window_QuestShopReportList
    Window_QuestShopReportList.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestShopReportList.prototype.constructor = Window_QuestShopReportList;

    /**
     * ウィンドウを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_QuestShopReportList.prototype.initialize = function(rect) {
        $gameParty.updateQuests(); // クエストの状態更新
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    };

    /**
     * 最大項目数を得る。
     * 
     * @returns {Number} 最大項目数
     */
    Window_QuestShopReportList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * 
     * @param {Number} index インデックス（未指定の場合には現在のインデックス）
     * @returns {Game_Quest} クエストデータ
     */
    Window_QuestShopReportList.prototype.item = function(index) {
        if (index === undefined) {
            index = this.index();
        }
        return ((index >= 0) && (index < this._quests.length)) ? this._quests[index] : null;
    };

    /**
     * 現在選択中の項目が選択可能かどうかを判定する。
     */
    Window_QuestShopReportList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.index());
    };

    /**
     * indexで指定される項目が選択可能かどうかを判定する。
     * 
     * @param {Number} index インデックス番号
     * @returns {Boolean} 選択可能な場合にはtrue, それ以外はfalse
     */
    Window_QuestShopReportList.prototype.isEnabled = function(index) {
        const quest = this.item(index);
        return quest.isDone();
    };

    /**
     * ステータスウィンドウを設定する。
     * 
     * @param {Window_QuestStatus}} window クエストステータスウィンドウ
     */
    Window_QuestShopReportList.prototype.setStatusWindow = function(window) {
        this._statusWindow = window;
        this.callUpdateHelp();
    };

    /**
     * 選択項目の説明を更新する。
     */
    Window_QuestShopReportList.prototype.callUpdateHelp = function() {
        if (this._statusWindow) {
            const quest = this.item();
            this._statusWindow.setQuest(quest);
        }
    };
    
    /**
     * 項目を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_QuestShopReportList.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        const quest = this.item(index);
        if (quest) {
            this.changePaintOpacity(this.isEnabled(index));
            const name = quest.name();
            if (quest.isDone()) {
                this.changeTextColor(ColorManager.textColor(1));
            } else {
                this.resetTextColor();
            }
            const nameWidth = rect.width - 96;
            this.drawText(name, rect.x, rect.y, nameWidth);

            if (quest.isDone()) {
                this.changeTextColor(ColorManager.textColor(1));
                this.drawText(textStatusDone, rect.x + nameWidth, rect.y, 96, "right");
            }
            this.changePaintOpacity(false);
        }
    };

    /**
     * ウィンドウを更新する。
     */
    Window_QuestShopReportList.prototype.refresh = function() {
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.refresh.call(this);
    };

    //------------------------------------------------------------------------------
    // Window_QuestShopGiveupList
    Window_QuestShopGiveupList.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestShopGiveupList.prototype.constructor = Window_QuestShopGiveupList;

    /**
     * ウィンドウを初期化する。
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     */
    Window_QuestShopGiveupList.prototype.initialize = function(x, y, width) {
        const height = Graphics.boxHeight;
        $gameParty.updateQuests(); // クエストの状態更新
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    /**
     * 最大項目数を得る。
     * 
     * @returns {Number} 最大項目数
     */
    Window_QuestShopGiveupList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * 
     * @param {Number} index インデックス（未指定の場合には現在のインデックス）
     * @returns {Game_Quest} クエストデータ
     */
    Window_QuestShopGiveupList.prototype.item = function(index) {
        if (index === undefined) {
            index = this.index();
        }
        return ((index >= 0) && (index < this._quests.length)) ? this._quests[index] : null;
    };

    /**
     * 現在選択中の項目が選択可能かどうかを判定する。
     */
    Window_QuestShopGiveupList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.index());
    };

    /**
     * indexで指定される項目が選択可能かどうかを判定する。
     * @param {Number} index インデックス番号
     * @returns {Boolean} 選択可能な場合にはtrue, それ以外はfalse
     */
    // eslint-disable-next-line no-unused-vars
    Window_QuestShopGiveupList.prototype.isEnabled = function(index) {
        return true;
    };

    /**
     * ステータスウィンドウを設定する。
     * @param {Window_QuestStatus}} window クエストステータスウィンドウ
     */
    Window_QuestShopGiveupList.prototype.setStatusWindow = function(window) {
        this._statusWindow = window;
        this.callUpdateHelp();
    };

    /**
     * 選択項目の説明を更新する。
     */
    Window_QuestShopGiveupList.prototype.callUpdateHelp = function() {
        if (this._statusWindow) {
            const quest = this.item();
            this._statusWindow.setQuest(quest);
        }
    };
    
    /**
     * 項目を描画する。
     * @param {Number} index インデックス番号
     */
    Window_QuestShopGiveupList.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        const quest = this.item(index);
        if (quest) {
            this.changePaintOpacity(this.isEnabled(index));
            const name = quest.name();
            if (quest.isDone()) {
                this.changeTextColor(this.textColor(1));
            } else {
                this.resetTextColor();
            }
            const nameWidth = rect.width - 96;
            this.drawText(name, rect.x, rect.y, nameWidth);

            if (quest.isDone()) {
                this.changeTextColor(this.textColor(1));
                this.drawText(textStatusDone, rect.x + nameWidth, rect.y, 96, "right");
            }
            this.changePaintOpacity(false);
        }
    };

    /**
     * ウィンドウを更新する。
     */
    Window_QuestShopGiveupList.prototype.refresh = function() {
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.refresh.call(this);
    };

    //------------------------------------------------------------------------------
    // Window_QuestShopMessage

    Window_QuestShopMessage.prototype = Object.create(Window_Base.prototype);
    Window_QuestShopMessage.prototype.constructor = Window_QuestShopMessage;

    /**
     * Window_QuestShopMessageを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_QuestShopMessage.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._text = "";
    };

    /**
     * テキストを設定する。
     * @param {String} text 表示メッセージ
     */
    Window_QuestShopMessage.prototype.setText = function(text) {
        this._text = text;
        this.refresh();
    };

    /**
     * テキストをクリアする。
     */
    Window_QuestShopMessage.prototype.clear = function() {
        this.setText("");
    };

    /**
     * 描画内容を更新する。
     */
    Window_QuestShopMessage.prototype.refresh = function() {
        this.contents.clear();
        this.drawTextEx(this._text, this.textPadding(), 0);
    };
    //------------------------------------------------------------------------------
    // Window_QuestShopConfirm

    Window_QuestShopConfirm.prototype = Object.create(Window_Command.prototype);
    Window_QuestShopConfirm.prototype.constructor = Window_QuestShopConfirm;

    /**
     * Window_QuestShopConfirmを初期化する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域
     */
    Window_QuestShopConfirm.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    /**
     * ウィンドウ高さを得る。
     */
    Window_QuestShopConfirm.prototype.windowHeight = function() {
        return this.fittingHeight(2);
    };

    /**
     * コマンドリストを作成する。
     */
    Window_QuestShopConfirm.prototype.makeCommandList = function() {
        this.addCommand(textYes, "ok");
        this.addCommand(TextManager.cancel, "cancel");
    };
    //------------------------------------------------------------------------------
    // Window_QuestShopRewards
    Window_QuestShopRewards.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestShopRewards.prototype.constructor = Window_QuestShopRewards;

    /**
     * Window_QuestShopRewardsを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_QuestShopRewards.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this,rect);
        this._quest = null;
        this.refresh();
    };

    /**
     * クエストを設定する。
     * 
     * @param {Game_Quest} quest クエスト
     */
    Window_QuestShopRewards.prototype.setQuest = function(quest) {
        this._quest = quest;
        this.refresh();
    };

    /**
     * 表示内容を更新する。
     */
    Window_QuestShopRewards.prototype.refresh = function() {
        this.contents.clear();
        if (this._quest) {
            // 報酬を記述する。
            const lineHeight = this.lineHeight();
            const x = 0;
            let y = 0;
            const contentsWidth = this.contentsWidth();
            if (this._quest.rewardGold()) {
                this.drawText(this._quest.rewardGold() + TextManager.currencyUnit, x + 40, y, contentsWidth - 40, "right");
                y += lineHeight;
            }
            // 後は報酬アイテム描画
            const numWidth = 80;
            const nameWidth = contentsWidth - numWidth;
            this._quest.rewardItems().forEach(function(entry) {
                const item = entry[0];
                const numItems = entry[1];
                this.drawItemName(item, x, y, nameWidth);
                this.drawText("×" + numItems, x + nameWidth, y, numWidth, "right");
                y += lineHeight;
            }, this);
        }
    };


    //------------------------------------------------------------------------------
    // Scene_QuestShop
    Scene_QuestShop.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_QuestShop.prototype.constructor = Scene_QuestShop;

    /**
     * 初期化する。
     */
    Scene_QuestShop.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    /**
     * 作成前の設定を行う。
     * 
     * @param {Array<Number>} questIds クエストID配列
     * @param {string} clerkFileName 店員画像ファイル名。店員画像が無い場合にはnull
     */
    Scene_QuestShop.prototype.prepare = function(questIds, clerkFileName) {
        const quests = [];
        for (let i = 0; i < questIds.length; i++) {
            const id = questIds[i];
            const quest = quests.find(function(q) {
                return q.id() === id;
            });
            if (!quest) {
                quests.push(new Game_Quest(id));
            }
        }

        this._quests = quests;
        this._clerkFileName = clerkFileName || "";
    };

    /**
     * シーンを作成する。
     */
    Scene_QuestShop.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createUnderTakeListWindow();
        this.createReportListWindow();
        this.createGiveupListWindow();
        this.createStatusWindow();
        this.createMessageWindow();
        this.createConfirmWindow();
        this.createRewardsWindow();
        this.loadClerkPicture();
    };

    /**
     * ショップコマンドウィンドウを作成する。
     * ショップコマンドウィンドウは右端。
     */
    Scene_QuestShop.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_QuestShopCommand(rect);
        this._commandWindow.setHandler("accept", this.commandUnderTake.bind(this));
        this._commandWindow.setHandler("report", this.commandReport.bind(this));
        this._commandWindow.setHandler("giveup", this.commandGiveup.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this._commandWindow.deactivate();
        this._commandWindow.hide();
        this.addWindow(this._commandWindow);
    };

    /**
     * コマンドウィンドウの矩形領域を得る。
     * 
     * @returns {rectangle} ウィンドウ矩形領域
     */
    Scene_QuestShop.prototype.commandWindowRect = function() {
        const wx = Graphics.boxWidth - this.mainCommandWidth();
        const wy = this.mainAreaTop();
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(4, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 受託クエストリストウィンドウを作成する。
     */
    Scene_QuestShop.prototype.createUnderTakeListWindow = function() {
        const rect = this.underTakeListWindowRect();
        this._underTakeListWindow = new Window_QuestShopUnderTakeList(rect);
        this._underTakeListWindow.setQuests(this._quests);
        this._underTakeListWindow.setHandler("ok", this.onUnderTakeListWindowOk.bind(this));
        this._underTakeListWindow.setHandler("cancel", this.onUnderTakeListWindowCancel.bind(this));
        this._underTakeListWindow.deactivate();
        this._underTakeListWindow.hide();
        this.addWindow(this._underTakeListWindow);
    };
    
    /**
     * 受託可能クエストリストのウィンドウ矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_QuestShop.prototype.underTakeListWindowRect = function() {
        const wx = 0;
        const wy = 0;
        const ww = 320;
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 報告クエスト選択ウィンドウを作成する。
     */
    Scene_QuestShop.prototype.createReportListWindow = function() {
        const rect = this.reportListWindowRect();
        this._reportListWindow = new Window_QuestShopReportList(rect);
        this._reportListWindow.setHandler("ok", this.onReportListWindowOk.bind(this));
        this._reportListWindow.setHandler("cancel", this.onReportListWindowCancel.bind(this));
        this._reportListWindow.deactivate();
        this._reportListWindow.hide();
        this.addWindow(this._reportListWindow);
    };

    /**
     * 報告クエストリストの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_QuestShop.prototype.reportListWindowRect = function() {
        return this.underTakeListWindowRect();
    };

    /**
     * ギブアップリストウィンドウを作成する。
     */
    Scene_QuestShop.prototype.createGiveupListWindow = function() {
        const rect = this.giveupListWindowRect();
        this._giveupListWindow = new Window_QuestShopGiveupList(rect);
        this._giveupListWindow.setHandler("ok", this.onGiveupListWindowOk.bind(this));
        this._giveupListWindow.setHandler("cancel", this.onGiveupListWindowCancel.bind(this));
        this._giveupListWindow.deactivate();
        this._giveupListWindow.hide();
        this.addWindow(this._giveupListWindow);
    };

    /**
     * ギブアップリストのウィンドウ矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_QuestShop.prototype.giveupListWindowRect = function() {
        return this.underTakeListWindowRect();
    };

    /**
     * ステータスウィンドウを作成する。
     */
    Scene_QuestShop.prototype.createStatusWindow = function() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_QuestStatus(rect);
        this._statusWindow.hide();
        this.addWindow(this._statusWindow);

        this._underTakeListWindow.setStatusWindow(this._statusWindow);
        this._reportListWindow.setStatusWindow(this._statusWindow);
        this._giveupListWindow.setStatusWindow(this._statusWindow);
    };
    /**
     * ステータスウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_QuestShop.prototype.statusWindowRect = function() {
        const rect = this.underTakeListWindowRect();
        const wx = rect.width;
        const wy = 0;
        const ww = (Graphics.boxWidth - wx);
        const wh = Graphics.boxHeight;
        return new Rectangle(wx, wy, ww, wh);
    };


    /**
     * メッセージウィンドウを作成する。
     * 
     * Window_Messageを使うことも考えたが、あっちはGame_Interpreterと密接にくっついているのでやめた。
     */
    Scene_QuestShop.prototype.createMessageWindow = function() {
        const rect = this.messageWindowRect();
        this._messageWindow = new Window_QuestShopMessage(rect);
        this._messageWindow.hide();
        this.addWindow(this._messageWindow);
    };

    /**
     * メッセージウィンドウのウィンドウ矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_QuestShop.prototype.messageWindowRect = function() {
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(4, false) + 8;
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 確認ウィンドウを作成する。
     */
    Scene_QuestShop.prototype.createConfirmWindow = function() {
        const x = Graphics.boxWidth - 240;
        const y = this._messageWindow.y + this._messageWindow.height;
        this._confirmWindow = new Window_QuestShopConfirm(x, y);
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        this.addWindow(this._confirmWindow);
    };

    /**
     * 確認ウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_QuestShop.prototype.confirmWindowRect = function() {
        const ww = 240;
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 報酬表示用ウィンドウを作成する
     */
    Scene_QuestShop.prototype.createRewardsWindow = function() {
        const rect = this.questRewardWindowRect();
        this._rewardsWindow = new Window_QuestShopRewards(rect);
        this._rewardsWindow.setHandler("ok", this.onRewardsOk.bind(this));
        this._rewardsWindow.setHandler("cancel", this.onRewardsOk.bind(this));
        this._rewardsWindow.hide();
        this._rewardsWindow.deactivate();
        this.addWindow(this._rewardsWindow);
    };

    /**
     * 報酬ウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_QuestShop.prototype.questRewardWindowRect = function() {
        const ww = Graphics.boxWidth / 2;
        const wh = Graphics.boxHeight - this.mainAreaTop() - 100;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 店員のイメージを作成する。
     */
    Scene_QuestShop.prototype.loadClerkPicture = function() {
        if (this._clerkFileName) {
            this._clerkBitmap = ImageManager.loadPicture(this._clerkFileName, 0);
            if (!this._clerkBitmap.isReady()) {
                // まだ読み込みが完了していない。
                this._clerkBitmap.addLoadListener(this.addClerkSprite.bind(this));
            } else {
                // 予め読まれていた
                this.addClerkSprite();
            }
        }
    };

    /**
     * 店員画像を追加する。
     */
    Scene_QuestShop.prototype.addClerkSprite = function() {
        this._clerkSprite = new Sprite();
        this._clerkSprite.bitmap = this._clerkBitmap;
        this._clerkSprite.x = Graphics.boxWidth - this._clerkBitmap.width;
        this._clerkSprite.y = Graphics.boxHeight - this._clerkBitmap.height;
        this._backgroundSprite.addChild(this._clerkSprite);
    };

    /**
     * シーンを開始する。
     */
    Scene_QuestShop.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._commandWindow.show();
        this._commandWindow.activate();
    };

    /**
     * 受けるが選択された時の処理を行う。
     */
    Scene_QuestShop.prototype.commandUnderTake = function() {
        this._underTakeListWindow.refresh();
        this._underTakeListWindow.show();
        this._statusWindow.show();
        this._underTakeListWindow.activate();
    };

    /**
     * 報告が選択された時の処理を行う。
     */
    Scene_QuestShop.prototype.commandReport = function() {
        this._reportListWindow.refresh();
        this._reportListWindow.show();
        this._statusWindow.show();
        this._reportListWindow.activate();
    };

    /**
     * ギブアップが選択された時の処理を行う。
     */
    Scene_QuestShop.prototype.commandGiveup = function() {
        this._giveupListWindow.refresh();
        this._giveupListWindow.show();
        this._statusWindow.show();
        this._giveupListWindow.activate();
    };

    /**
     * 受託クエストリストウィンドウでOKボタンが押された
     */
    Scene_QuestShop.prototype.onUnderTakeListWindowOk = function() {
        const quest = this._underTakeListWindow.item();

        let msg = "";
        if (quest.guildRank() > $gameParty.guildRank()) {
            msg += textMessageConfirmRank1 + "\n";
        }
        msg += textMessageConfirmRank2.format(quest.name());

        this._messageWindow.setText(msg);
        this._messageWindow.show();
        this._confirmWindow.setHandler("ok", this.onUnderTakeConfirmOk.bind(this));
        this._confirmWindow.setHandler("cancel", this.onUnderTakeConfirmCancel.bind(this));
        this._confirmWindow.show();
        this._confirmWindow.activate();
    };

    /**
     * 受託クエストリストウィンドウでキャンセルボタンが押された。
     */
    Scene_QuestShop.prototype.onUnderTakeListWindowCancel = function() {
        this._underTakeListWindow.hide();
        this._statusWindow.hide();
        this._commandWindow.activate();
    };

    /**
     * 受託確認でOK操作された。
     */
    Scene_QuestShop.prototype.onUnderTakeConfirmOk = function() {
        const quest = this._underTakeListWindow.item();
        $gameParty.addQuest(new Game_Quest(quest.id())); // 受託クエスト追加
        this._underTakeListWindow.refresh();
        this._messageWindow.hide();
        this._confirmWindow.hide();
        this._underTakeListWindow.activate();
    };
    /**
     * 受託確認でキャンセル操作された。
     */
    Scene_QuestShop.prototype.onUnderTakeConfirmCancel = function() {
        this._messageWindow.hide();
        this._confirmWindow.hide();
        this._underTakeListWindow.activate();
    };


    /**
     * 報告クエスト選択ウィンドウでOK操作されたときの処理を行う。
     */
    Scene_QuestShop.prototype.onReportListWindowOk = function() {
        const quest = this._reportListWindow.item();
        if (successSe.name) {
            AudioManager.playSe(successSe);
        }

        // 報酬加算処理
        this._rewardsWindow.setQuest(quest);
        $gameParty.reportQuest(quest.id(), true, true);
        this._rewardsWindow.show();
        this._rewardsWindow.activate();
    };

    /**
     * 報告クエスト選択ウィンドウでキャンセル操作されたときの処理を行う。
     */
    Scene_QuestShop.prototype.onReportListWindowCancel = function() {
        this._statusWindow.hide();
        this._reportListWindow.hide();
        this._commandWindow.activate();
    };

    /**
     * 報酬表示ウィンドウでOKまたはキャンセル操作されたときに通知を受け取る。
     */
    Scene_QuestShop.prototype.onRewardsOk = function() {
        this._rewardsWindow.hide();
        this._rewardsWindow.deactivate();
        this._reportListWindow.refresh();
        this._reportListWindow.activate();
    };



    /**
     * ギブアップリストウィンドウでOK操作されたときの処理を行う。
     */
    Scene_QuestShop.prototype.onGiveupListWindowOk = function() {
        const quest = this._giveupListWindow.item();

        let msg = textMessageConfirmGiveup.format(quest.name());
        this._messageWindow.setText(msg);
        this._messageWindow.show();
        this._confirmWindow.setHandler("ok", this.onGiveupConfirmOk.bind(this));
        this._confirmWindow.setHandler("cancel", this.onGiveupConfirmCancel.bind(this));
        this._confirmWindow.show();
        this._confirmWindow.activate();
    };


    /**
     * ギブアップリストウィンドウでキャンセル操作されたときの処理を行う。
     */
    Scene_QuestShop.prototype.onGiveupListWindowCancel = function() {
        this._statusWindow.hide();
        this._giveupListWindow.hide();
        this._commandWindow.activate();
    };

    /**
     * ギブアップ確認でOK操作された。
     */
    Scene_QuestShop.prototype.onGiveupConfirmOk = function() {
        const quest = this._giveupListWindow.item();

        if (failSe.name) {
            AudioManager.playSe(failSe);
        }

        $gameParty.giveupQuest(quest.id());
        this._messageWindow.hide();
        this._confirmWindow.hide();
        this._giveupListWindow.refresh();
        this._giveupListWindow.activate();
    };

    /**
     * ギブアップ確認ウィンドウでキャンセル操作された。
     */
    Scene_QuestShop.prototype.onGiveupConfirmCancel = function() {
        this._messageWindow.hide();
        this._confirmWindow.hide();
        this._giveupListWindow.activate();
    };



})();
