/*:ja
 * @target MZ
 * @plugindesc ノートタグのお試し処理。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 *
 * 
 * @help 
 * ノートタグのお試し処理。
 * MZではDataManagerのメソッドで処理を実装、Scene_Boot.start時に解析する、というデザインが標準らしい。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 作成開始
 */

(() => {
    const pluginName = "Kapu_NotetagTest";

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_start.call(this);
        DataManager.processSampleNoteTag();
    };

    /**
     * サンプルノートタグを処理する。
     */
    DataManager.processSampleNoteTag = function () {
        for (let item of $dataItems) {
            if (!item) {
                continue;
            }

            // TODO : ノートタグの処理。

            for (let line of item.note.split(/[\r\n]+/)) {

            }

        }
    };



})();