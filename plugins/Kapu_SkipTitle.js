/*:ja
 * @target MZ
 * @plugindesc タイトル画面をスキップするよ。デバッグの時面倒じゃん。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 *
 * @help
 * このプラグインは Scene_Boot.startNormalGameを上書きする。
 * 
 * 使い方はプラグインをMZで有効化してONにするだけ。
 * デプロイメントする時はプラグインを削除してからやるか、
 * プラグインをOFFにすることを想定してる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 作ってみた。
 */

(() => {
    /**
     * 通常ゲームを開始する。
     * Note: startメソッドをオーバーライドするんじゃなくて、
     *       こっちをオーバーライドした。
     */
    Scene_Boot.prototype.startNormalGame = function () {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };
})();