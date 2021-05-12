/*:ja
 * @target MZ 
 * @plugindesc hogehoge
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command captureScreen
 * @text キャプチャ設定する
 * @desc スクリーンのキャプチャ要求をセットします。
 * 
 * @help 
 * 画面をキャプチャして、指定ピクチャIDのピクチャを構築します。
 * 次の手順で使用します。
 *   1. プラグインコマンド「キャプチャ設定する」を呼び出します。
 *   2. 画像を指定せずに「ピクチャの表示」を実行します。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
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
    const pluginName = "Kapu_CaptureScreenPicture";
    // const parameters = PluginManager.parameters(pluginName);

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "captureScreen", args => {
        $gameTemp.
    });
    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * Game_Temp を初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._isCaptureRequired = false;
    };
    /**
     * キャプチャ要求が出ているかどうかを得る。
     * 
     * @returns {boolean} キャプチャ要求が出ている場合にはtrue, それ以外はfalse.
     */
    Game_Temp.prototype.isCaptureRequired = function() {
        return this._isCaptureRequired;
    };
    /**
     * キャプチャ要求を出すかどうかを設定する。
     * 
     * @param {boolean} isRequired キャプチャ要求を出す場合にはtrue, それ以外はfalse
     */
    Game_Temp.prototype.setCaptureRequired = function(isRequired) {
        this._isCaptureRequired = isRequired;
    };

    //------------------------------------------------------------------------------
    // Game_Picture
    
    //------------------------------------------------------------------------------
    // Sprite_Picture
})();