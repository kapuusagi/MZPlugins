/*:ja
 * @target MZ 
 * @plugindesc コモンイベントを実行してようプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command execute
 * @text コモンイベント実行
 * @desc 指定したコモンイベントを実行する
 * 
 * @arg eventId
 * @text コモンイベントID
 * @desc 実行するコモンイベントID
 * @type common_event
 * @default 0
 * 
 * @help 
 * コモンイベントを実行してようプラグイン。
 * 独自シーンを実装したとき、インタプリタを使うために何が必要かを調べるために実装する。
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
function Scene_MyCommonEvent() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_Sandbox_CommonEvent";
    // const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "execute", args => {
        const eventId = Number(args.eventId);
        if(eventId > 0) {
            SceneManager.push(Scene_MyCommonEvent);
            SceneManager.prepareNextScene(eventId);
        }
    });

    //------------------------------------------------------------------------------
    // Scene_MyCommonEvent

    Scene_MyCommonEvent.prototype = Object.create(Scene_Message.prototype);
    Scene_MyCommonEvent.prototype.constructor = Scene_MyCommonEvent;

    Scene_MyCommonEvent.prototype.initialize = function() {
        Scene_Message.prototype.initialize.call(this);
        this._commonEventId = 0;
        this._interpreter = new Game_Interpreter();
    };

    /**
     * シーンを作成する準備をする。
     * 
     * @param {Number} eventId コモンイベントID
     */
    Scene_MyCommonEvent.prototype.prepare = function(eventId) {
        this._commonEventId = eventId || 0;
        this._interpreter.setup($dataCommonEvents[this._commonEventId].list);
    };

    /**
     * シーンで使用するリソースを作成する
     */
    Scene_MyCommonEvent.prototype.create = function() {
        this.createBackground();
        Scene_Message.prototype.create.call();
        this.createWindowLayer();
        this.createAllWindows();
    };

    /**
     * シーンの背景を作成する。
     * 
     * Game_MessageではcreateBackground()を呼んだりしないので、
     * 多分これを使わないといけない。
     */
    Scene_MyCommonEvent.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [];
        this.addChild(this._backgroundSprite);
        //this.setBackgroundOpacity(192);
    };

    /**
     * シーンを開始する。
     */
    Scene_MyCommonEvent.prototype.start = function() {
        Scene_Message.prototype.start.call(this);
    };

    /**
     * シーンを更新する。
     */
    Scene_MyCommonEvent.prototype.update = function() {
        Scene_Message.prototype.update.call(this);
        if (this._interpreter.isRunning()) {
            this._interpreter.update();
        } else {
            SceneManager.pop();
        }
    };


})();