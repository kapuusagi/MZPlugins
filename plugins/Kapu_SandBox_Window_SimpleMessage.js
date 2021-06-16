/*:ja
 * @target MZ 
 * @plugindesc 単純メッセージウィンドウのテストコード
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_UI_Window_SimpleMessage
 * @orderAfter Kapu_UI_Window_SimpleMessage
 * 
 * @command startScene
 * @text テストシーン呼び出し
 * 
 * @arg text
 * @text テキスト
 * @desc 表示するメッセージ
 * @type multiline_string
 * @default ハロー・ワールド\nこれはテストメッセージです。
 * 
 * @help 
 * 
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
(() => {
    const pluginName = "Kapu_SandBox_Window_SimpleMessage";
    // const parameters = PluginManager.parameters(pluginName);

    /**
     * シンプルメッセージウィンドウテストシーン
     */
    function Scene_SimpleMssageWindowTest() {
        this.initialize(...arguments);
    }

    PluginManager.registerCommand(pluginName, "startScene", args => {
        const text = args.text || "";
        SceneManager.push(Scene_SimpleMssageWindowTest);
        SceneManager.prepareNextScene(text);
    });

    //------------------------------------------------------------------------------
    // Scene_SimpleMssageWindowTest
    Scene_SimpleMssageWindowTest.prototype = Object.create(Scene_Base.prototype);
    Scene_SimpleMssageWindowTest.prototype.constructor = Scene_SimpleMssageWindowTest;

    /**
     * Scene_SimpleMssageWindowTestを初期化する。
     */
    Scene_SimpleMssageWindowTest.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
        this._text = "";
    };

    /**
     * シーンの準備をする。
     * 
     * @param {string} text 文字列
     */
    Scene_SimpleMssageWindowTest.prototype.prepare = function(text) {
        this._text = text;
    };

    /**
     * シーンのリソースを作成する。
     */
    Scene_SimpleMssageWindowTest.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createMessageWindow();
    };

    /**
     * メッセージウィンドウを作成する。
     */
    Scene_SimpleMssageWindowTest.prototype.createMessageWindow = function() {
        const rect = this.messageWindowRect();
        this._messageWindow = new Window_SimpleMessage(rect);
        this._messageWindow.hide();
        this.addWindow(this._messageWindow);
    };

    /**
     * メッセージウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_SimpleMssageWindowTest.prototype.messageWindowRect = function() {
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(4, false);
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * シーンを開始する。
     */
    Scene_SimpleMssageWindowTest.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        if (this._text) {
            $gameMessage.push(this._text);
        }
    };

    /**
     * 更新処理を行う。
     */
    Scene_SimpleMssageWindowTest.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        if (!$gameMessage.isBusy()) {
            this.popScene();
        }
    };

})();