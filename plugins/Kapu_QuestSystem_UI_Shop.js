/*:ja
 * @target MZ 
 * @plugindesc クエストシステムのショップUIを提供するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_QuestSystem_UI
 * @orderAfter Kapu_QuestSystem_UI
 * @base Kapu_UI_Window_SimpleMessage
 * @orderAfter Kapu_UI_Window_SimpleMessage
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
 * @arg clerkFileName
 * @text 店員ファイル名
 * @desc 店員ファイル名
 * @type file
 * @dir img/pictures/
 * @default 
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
 * @param textMessageRankUp
 * @text ランクアップメッセージ
 * @desc ランクアップしたときのメッセージ。%1にアクター名、%2に前のランク、%3に現在のランクが入る。
 * @type string
 * @default %1のギルドランクが%2から%3に上がった！
 * 
 * @param textMessageRankDown
 * @text ランクダウンメッセージ
 * @desc ランクダウンしたときのメッセージ。%1にアクター名、%2に前のランク、%3に現在のランクが入る。
 * @type string
 * @default %1のギルドランクが%2から%3に下がってしまった．．。
 * 
 * @param textMessageLostGold
 * @text ゴールド失ったメッセージ
 * @desc ゴールドを失ったときのメッセージ。%1にゴールド、%2に単位が入る。
 * @type string
 * @default %1%2失った！
 * 
 * 
 * TODO:プラグインコマンドでクエスト受注選択したい。クエストIDを変数に格納
 * TODO:クエスト報告選択したい。クエストIDを変数に格納
 * TODO:クエスト破棄選択したい。クエストIDを変数に格納
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

    const textShopAccept = parameters["textShopAccept"] || "Accept";
    const textShopReport = parameters["textShopReport"] || "Report";
    const textShopGiveup = parameters["textShopGiveup"] || "Giveup";

    const textStatusTrying = parameters["textStatusTrying"] || "Trying";
    const textStatusDone = parameters["textStatusDone"] || "Done";
    const textYes = parameters["textYes"] || "Yes";
    const textMessageConfirmRank1 = parameters["textMessageConfirmRank1"] || "This is difficult for this party.";
    const textMessageConfirmRank2 = parameters["textMessageConfirmRank2"] || "Do you accept %1?";
    const textMessageConfirmGiveup = parameters["textMessageConfirmGiveup"] || "Giveup %1?";
    const textMessageLostGold = parameters["textMessageLostGold"] || "Lose %1%2.";
    const textMessageRankUp = parameters["textMessageRankUp"] || "%1's rank up %2 to %3!";
    const textMessageRankDown = parameters["textMessageRankDown"] || "%1's rank down %2 to %3.";


    PluginManager.registerCommand(pluginName, "startQuestShop", args => {
        const ids = JSON.parse(args.questIds).map(str => Number(str) || 0);
        const clerkFileName = args.clerkFileName || "";
        const clerkOffsetX = Number(args.clerkOffsetX) || 0;
        const clerkOffsetY = Number(args.clerkOffsetY) || 0;
        const questIds = [];
        for (const id of ids) {
            if ((id > 0) && !questIds.includes(id)) {
                questIds.push(id);
            }
        }
        SceneManager.push(Scene_QuestShop);
        SceneManager.prepareNextScene(questIds, clerkFileName, clerkOffsetX, clerkOffsetY);
    });



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
     * @returns {number} 最大項目数
     */
    Window_QuestShopUnderTakeList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * 
     * @param {number} index インデックス（未指定の場合には現在のインデックス）
     * @returns {Game_Quest} クエストデータ
     */
    Window_QuestShopUnderTakeList.prototype.quest = function(index) {
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
     * @param {number} index インデックス番号
     * @returns {boolean} 選択可能な場合にはtrue, それ以外はfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Window_QuestShopUnderTakeList.prototype.isEnabled = function(index) {
        if ($gameParty.quests().length >= 3) {
            return false; // 3件以上受託中。
        }
        const quest = this.quest(index);
        if ($gameParty.isAcceptQuest(quest.id())) {
            return false; // 既に受託中
        }

        // 受託可否判定
        return QuestManager.canAcceptQuest(quest.id());
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
            let quest = this.quest();
            if (quest !== null) {
                const questId = quest.id();
                if ($gameParty.isAcceptQuest(questId)) {
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
     * @param {number} index インデックス番号
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
            if ($gameParty.isAcceptQuest(quest.id())) {
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
    Window_QuestShopReportList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * 
     * @param {number} index インデックス（未指定の場合には現在のインデックス）
     * @returns {Game_Quest} クエストデータ
     */
    Window_QuestShopReportList.prototype.quest = function(index) {
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
     * @param {number} index インデックス番号
     * @returns {boolean} 選択可能な場合にはtrue, それ以外はfalse
     */
    Window_QuestShopReportList.prototype.isEnabled = function(index) {
        const quest = this.quest(index);
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
            const quest = this.quest();
            this._statusWindow.setQuest(quest);
        }
    };
    
    /**
     * 項目を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_QuestShopReportList.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        const quest = this.quest(index);
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
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_QuestShopGiveupList.prototype.initialize = function(x, y, width) {
        const height = Graphics.boxHeight;
        $gameParty.refreshQuests(); // クエストの状態更新
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    /**
     * 最大項目数を得る。
     * 
     * @returns {number} 最大項目数
     */
    Window_QuestShopGiveupList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * 
     * @param {number} index インデックス（未指定の場合には現在のインデックス）
     * @returns {Game_Quest} クエストデータ
     */
    Window_QuestShopGiveupList.prototype.quest = function(index) {
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
     * @param {number} index インデックス番号
     * @returns {boolean} 選択可能な場合にはtrue, それ以外はfalse
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
            const quest = this.quest();
            this._statusWindow.setQuest(quest);
        }
    };
    
    /**
     * 項目を描画する。
     * @param {number} index インデックス番号
     */
    Window_QuestShopGiveupList.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        const quest = this.quest(index);
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
        this._rewards = null;
        this.refresh();
    };

    /**
     * 報酬を設定する。
     * 
     * @param {object} rewards 報酬
     */
    Window_QuestShopRewards.prototype.setRewards = function(rewards) {
        this._rewards = rewards;
        this.refresh();
    };


    /**
     * 表示内容を更新する。
     */
    Window_QuestShopRewards.prototype.refresh = function() {
        this.contents.clear();
        const rewards = this._rewards;
        if (rewards) {
            const lineHeight = this.lineHeight();
            const x = 0;
            let y = 0;
            const contentsWidth = this.contentsWidth();
            // 報酬を記述する。
            if (rewards.exp > 0) {
                this.drawText(TextManager.expA + rewards.exp, x + 40, y, contentsWidth);
            }
            if (rewards.gold > 0) {
                this.drawText(reward.gold + TextManager.currencyUnit, x + 40, y, contentsWidth - 40, "right");
                y += lineHeight;
            }

            // 後は報酬アイテム描画
            const numWidth = 80;
            const nameWidth = contentsWidth - numWidth;
            const reportedItems = [];
            for (const item of rewards.items) {
                if (!reportedItems.includes(item)) {
                    const count = items.filter(i => i === item).length;
                    this.drawItemName(item, x, y, nameWidth);
                    this.drawText("\u00d7" + count, x + nameWidth, y, numWidth, "right");
                    y += lineHeight;
                    reportedItems.push(item);
                }
            }
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
     * @param {number} clerkOffsetX 店員画像表示オフセットX
     * @param {number} clerkOffsetY 店員画像表示オフセットY
     */
    Scene_QuestShop.prototype.prepare = function(questIds, clerkFileName, clerkOffsetX, clerkOffsetY) {
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
        this._clerkOffsetX = clerkOffsetX || 0;
        this._clerkOffsetY = clerkOffsetY || 0;
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
     * ウィンドウレイヤーを構築する。
     */
    Scene_QuestShop.prototype.createWindowLayer = function() {
        this.createClerkLayer();
        Scene_MenuBase.prototype.createWindowLayer.call(this);
    };

    /**
     * 店員画像描画用レイヤーを追加する。
     */
    Scene_QuestShop.prototype.createClerkLayer = function() {
        this._clerkLayer = new Sprite();
        this.addChild(this._clerkLayer);
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
        this._messageWindow = new Window_SimpleMessage(rect);
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
        this._clerkSprite.anchor.x = 0.5;
        this._clerkSprite.anchor.y = 1.0;
        const baseX = Graphics.boxWidth - (this.mainCommandWidth() / 2);
        const baseY = this.isBottomHelpMode() ? this.helpAreaTop() : Graphics.boxHeight;
        this._clerkSprite.x = baseX + this._clerkOffsetX;
        this._clerkSprite.y = baseY + this._clerkOffsetY;
        this._clerkLayer.addChild(this._clerkSprite);
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
        const quest = this._underTakeListWindow.quest();

        if (quest.guildRank() > $gameParty.guildRank()) {
            $gameMessage.add(textMessageConfirmRank1);
        }
        $gameMessage.add(textMessageConfirmRank2.format(quest.name()));

        this._messageWindow.setHandler("ok", this.onUnderTakeMessageOk.bind(this));
        this._messageWindow.show();
        this._messageWindow.actiate();
        this._messageWindow.show();
        this._confirmWindow.setHandler("ok", this.onUnderTakeConfirmOk.bind(this));
        this._confirmWindow.setHandler("cancel", this.onUnderTakeConfirmCancel.bind(this));
        this._confirmWindow.show();
    };

    /**
     * クエスト内容について、メッセージウィンドウの表示が完了した
     */
    Scene_QuestShop.prototype.onUnderTakeMessageOk = function() {
        this._messageWindow.deactivate();
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
        const quest = this._underTakeListWindow.quest();
        QuestManager.acceptQuest(quest.id()); // 受託クエスト追加
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
        const quest = this._reportListWindow.quest();
        if (successSe.name) {
            AudioManager.playSe(successSe);
        }

        const partyMembers = $gameParty.allMembers();
        const lastState = {
            guildranks: partyMembers.map(member => member.guildRankName())
        };

        // 報酬加算処理
        QuestManager.reportQuest(quest.id(), true, true);

        for (let i = 0; i < partyMembers.length; i++) {
            const member = partyMembers[i];
            const lastRankName = lastState.guildRanks[i];
            const rankName = member.guildRankName();
            if (rankName !== lastRankName) {
                $gameMessage.add(textMessageRankUp.format(member.name(), lastRankName, rankName));
            }
        }

        this._rewardsWindow.setRewards(QuestManager.lastRewards());
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

        if ($gameMessage.isBusy()) {
            this._messageWindow.setHandler("ok", this.onReportMessageOk.bind());
            this._messageWindow.show();
            this._messageWindow.activate();
        } else {
            this._reportListWindow.refresh();
            this._reportListWindow.activate();
        }
    };

    /**
     * 報告時のメッセージウィンドウでメッセージ表示が完了したときの処理を行う。
     */
    Scene_QuestShop.prototype.onReportMessageOk = function() {
        this._messageWindow.deactivate();
        this._messageWindow.hide();
        this._reportListWindow.refresh();
        this._reportListWindow.activate();
    };



    /**
     * ギブアップリストウィンドウでOK操作されたときの処理を行う。
     */
    Scene_QuestShop.prototype.onGiveupListWindowOk = function() {
        const quest = this._giveupListWindow.quest();

        $gameMessage.add(textMessageConfirmGiveup.format(quest.name()));
        this._messageWindow.setHandler("ok", this.onGiveupConfirmMessageOk.bind(this));
        this._messageWindow.activate();
        this._messageWindow.show();
        this._confirmWindow.setHandler("ok", this.onGiveupConfirmOk.bind(this));
        this._confirmWindow.setHandler("cancel", this.onGiveupConfirmCancel.bind(this));
        this._confirmWindow.show();
    };

    /**
     * ギブアップについてのメッセージ表示が完了した時に通知を受け取る。
     */
    Scene_QuestShop.prototype.onGiveupConfirmMessageOk = function() {
        this._messageWindow.deactivate();
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
        const quest = this._giveupListWindow.quest();

        if (failSe.name) {
            AudioManager.playSe(failSe);
        }

        const partyMembers = $gameParty.allMembers();
        const lastState = {
            gold:$gameParty.gold(),
            memberRanks: partyMembers.map(member => member.guildRankName())
        };
        QuestManager.giveupQuest(quest.id(), true);
        this._messageWindow.hide();
        this._confirmWindow.hide();

        if ($gameParty.gold() < lastState.gold) {
            const lostGold = lastState.gold() - $gameParty.gold();
            $gameMessage.push(textMessageLostGold.format(lostGold, TextManager.currencyUnit));
        }
        for (let i = 0; i < partyMembers.length; i++) {
            const member = partyMembers[i];
            const rankName = member.guildRankName();
            const lastRankName = lastState.memberRanks[i];
            if (rankName !== lastRankName) {
                $gameMessage.push(textMessageRankDown.format(member.name(), lastRankName, rankName))
            }
        }

        if ($gameMessage.isBusy()) {
            this._messageWindow.setHandler("ok", this.onGiveupResultMessageOk.bind(this));
            this._messageWindow.show();
            this._messageWindow.activate();
        } else {
            this._giveupListWindow.refresh();
            this._giveupListWindow.activate();
        }
    };

    /**
     * ギブアップ後のメッセージ表示が完了したときに通知を受け取る。
     */
    Scene_QuestShop.prototype.onGiveupResultMessageOk = function() {
        this._messageWindow.deactivate();
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
