/*:ja
 * @target MZ
 * @plugindesc シーンを使うサンプル。ついでにメッセージ表示するよ。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 *
 * =================================================================
 * プラグインコマンド
 * =================================================================
 * ■ Message
 * @command Message
 * @text メッセージ
 * @desc 引数で指定したメッセージを表示する。
 * 
 * @arg msg
 * @text メッセージ
 * @desc 表示するメッセージ
 * @type string
 * @default 'Hello world'
 * 
 * 
 * @help 
 * Sceneを使う実験プラグイン。
 * プラグイン作成時にメッセージウィンドウが使えるのかどうかを調べる目的のもの。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 初版
 */
(() => {
    'use strict'

    const pluginName = 'Kapu_HelloScene';

    PluginManager.registerCommand(pluginName, 'Message', args => {
        const msg = args.msg || 'Hello world';
        SceneManager.push(Scene_HelloWorld);
        SceneManager.prepareNextScene(args.msg);
    });


    // ------------------------------------------------------------
    // define scene
    // ------------------------------------------------------------
    function Scene_HelloWorld() {
        this.initialize(...arguments);
    }

    Scene_HelloWorld.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_HelloWorld.prototype.constructor = Scene_HelloWorld;

    /**
     * Scene_HelloWorldを初期化する。
     */
    Scene_HelloWorld.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
        this._msg = '';
    };

    /**
     * シーンの準備をする。
     * @param {String} msg メッセージ
     */
    Scene_HelloWorld.prototype.prepare = function (msg) {
        this._msg = msg || '';
    };

    /**
     * シーンを作成する。
     */
    Scene_HelloWorld.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createMessageWindow();
    };

    /**
     * メッセージウィンドウを作成する。
     */
    Scene_HelloWorld.prototype.createMessageWindow = function () {
        // この実装は乱暴できたない。
        // Window_Messageは高機能過ぎるので、
        // もうちょっと楽に使えるタイプのやつを用意した方がいいかも。

        const windowWidth = Graphics.boxWidth
        const windowHeight = Window_Base.prototype.fittingHeight(4);
        const rect = new Rectangle(0, 0, windowWidth, windowHeight);
        this._messageWindow = new Window_Message(rect);
        this._messageWindow.terminateMessage = this.onTerminateMessage.bind(this);
        this.addWindow(this._messageWindow);

        // メッセージボックス用サブウィンドウ
        // 所持金表示ウィンドウ
        this._goldWindow = new Window_Gold(rect);
        this._goldWindow.openness = 0;
        this.addWindow(this._goldWindow);
        this._messageWindow.setGoldWindow(this._goldWindow);
        // 名前欄ウィンドウ
        this._nameBoxWindow = new Window_NameBox();
        this._nameBoxWindow.setMessageWindow(this._messageWindow);
        this.addWindow(this._nameBoxWindow);
        this._messageWindow.setNameBoxWindow(this._nameBoxWindow);
        // 選択肢ウィンドウ
        this._choiceListWindow = new Window_ChoiceList();
        this._choiceListWindow.setMessageWindow(this._messageWindow);
        this.addWindow(this._choiceListWindow);
        this._messageWindow.setChoiceListWindow(this._choiceListWindow);
        // 番号入力ウィンドウ
        this._numberInputWindow = new Window_NumberInput();
        this._numberInputWindow.setMessageWindow(this._messageWindow);
        this.addWindow(this._numberInputWindow);
        this._messageWindow.setNumberInputWindow(this._numberInputWindow);
        // イベントアイテムウィンドウ
        this._eventItemWindow = new Window_EventItem(rect);
        this._eventItemWindow.setMessageWindow(this._messageWindow);
        this.addWindow(this._eventItemWindow);
        this._messageWindow.setEventItemWindow(this._eventItemWindow);
    };

    /**
     * メッセージ表示が完了したときの処理を行う。
     */
    Scene_HelloWorld.prototype.onTerminateMessage = function () {
        Window_Message.prototype.terminateMessage.call(this._messageWindow);
        SceneManager.pop()
    };

    /**
     * シーンを開始する。
     */
    Scene_HelloWorld.prototype.start = function () {
        Scene_MenuBase.prototype.start.call(this);
        $gameMessage.add(this._msg);
    };

    /**
     * シーンを更新する。
     */
    Scene_HelloWorld.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
    };

    /**
     * ビジーかどうかを判定する。
     */
    Scene_HelloWorld.prototype.isBusy = function () {
        return this.isMessageWindowClosing();
    };

    /**
     * メッセージウィンドウがクローズ処理中かどうかを取得する。
     * @return {Boolean} クローズ処理中の場合にはtrue, それ以外はfalse
     */
    Scene_HelloWorld.prototype.isMessageWindowClosing = function () {
        return this._messageWindow.isClosing();
    };


})();