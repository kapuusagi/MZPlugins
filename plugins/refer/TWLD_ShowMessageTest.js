/*:
 * @plugindesc メッセージウィンドウを使ってメッセージ表示が可能かどうかを試すプラグイン。
 *             これができるならいろいろ楽になる。
 * @help
 * プラグインコマンド
 *     TWLD.Message.Show "message$"
 *          message 表示するメッセージ
 * @author kapuusagi
 */
var Imported = Imported || {};
Imported.TWLD_MessageTest = true;

var TWLD = TWLD || {};
TWLD.Msg = TWLD.Msg || {};
// for ESLint.
if (typeof Game_Temp === 'undefined') {
    var Window_Message = {};
    var Scene_MenuBase = {};
    var SceneManager = {};
    var Game_Interpreter = {};
    var $gameMessage = {};
}

(function() {
    'use strict';

    //------------------------------------------------------------------------------
    // Scene_TwldMsgTest
    // 独自シーンでメッセージウィンドウを使うためのお試しシーン。
    // 

    function Scene_TwldMsgTest() {
        this.initialize.apply(this, arguments);
    }

    Scene_TwldMsgTest.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_TwldMsgTest.prototype.constructor = Scene_TwldMsgTest;

    /**
     * シーンを初期化する。
     */
    Scene_TwldMsgTest.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._msg = '';
    };

    /**
     * シーンの作成準備をする。
     * @param {String} msg メッセージ
     */
    Scene_TwldMsgTest.prototype.prepare = function(msg) {
        this._msg = msg || 'Hello world.';
    };

    /**
     * シーンを作成する。
     */
    Scene_TwldMsgTest.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createMessageWindow();
    };

    /**
     * メッセージウィンドウを追加。
     */
    Scene_TwldMsgTest.prototype.createMessageWindow = function() {
        this._messageWindow = new Window_Message();
        this.addWindow(this._messageWindow);
        this._messageWindow.subWindows().forEach(function(window) {
            this.addWindow(window);
        }, this);
    };

    /**
     * シーンを開始する。
     */
    Scene_TwldMsgTest.prototype.start = function() {
        $gameMessage.add(this._msg);
        this._messageWindow.activate();
    };

    /**
     * 表示を更新する。
     */
    Scene_TwldMsgTest.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);

        if (!this.isBusy() && !$gameMessage.isBusy()) {
            // 表示しおわったらシーン終わり。
            this.popScene();
        }
    };
    /**
     * シーンがビジーかどうかを判定する。
     */
    Scene_TwldMsgTest.prototype.isBusy = function() {
        return ((this._messageWindow && this._messageWindow.isClosing())
                || Scene_MenuBase.prototype.isBusy.call(this));
    };

    //------------------------------------------------------------------------------
    // Game_Interpreterの変更
    // 

    TWLD.Msg.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

    /**
     * プラグインコマンドを処理する。
     * @param {String} command プラグインコマンド
     * @param {Array<String>} args 引数
     */
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        var re = command.match(/^TWLD\.Message\.(.*)/);;
        if (re !== null) {
            switch (re[1]) {
                case 'Show':
                    var msg = args[0] || 'Hello world.';
                    SceneManager.push(Scene_TwldMsgTest);
                    SceneManager.prepareNextScene(msg);
                    break;
            }
        } else {
            TWLD.Msg.Game_Interpreter_pluginCommand.call(this, command, args);
        }
    };


})();