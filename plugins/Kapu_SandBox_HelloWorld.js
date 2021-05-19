/*:ja
 * @target MZ
 * @plugindesc Hello Worldプラグイン
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
 * @default "Hello world"
 * 
 * @help 
 * プラグインコマンドでメッセージを表示するだけのプラグイン。
 * プラグイン作成時にメッセージウィンドウが使えるのかどうかを調べる目的のもの。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 初版
 */
(() => {
    "use strict"

    const pluginName = "Kapu_SandBox_HelloWorld";

    PluginManager.registerCommand(pluginName, "Message", args => {
        if (args.msg) {
            $gameMessage.add(args.msg);
        } else {
            $gameMessage.add("Hello world.");
        }
    });



})();