/*:ja
 * @target MZ 
 * @plugindesc Scene拡張用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * ベーシックシステムのScene拡張用プラグイン。本プラグイン単独では何も動作しない。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * SceneManager.hideWindowLayer() : void
 *   ウィンドウレイヤーを非表示にする。ウィンドウレイヤーが無い場合には何もしない。
 * SceneManager.showWindowLayer() : void
 *   ウィンドウレイヤーを表示状態にする。ウィンドウレイヤーが無い場合には何もしない。
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
    // const pluginName = "Kapu_Base_Scene";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Scene_Base
    /**
     * ウィンドウレイヤーを非表示にする。
     */
    Scene_Base.prototype.hideWindowLayer = function() {
        if (this._windowLayer) {
            this._windowLayer.visible = false;
        }
    };

    /**
     * ウィンドウレイヤーを表示させる。
     */
    Scene_Base.prototype.showWindowLayer = function() {
        if (this._windowLayer) {
            this._windowLayer.visible = true;
        }
    };

    /**
     * ウィンドウレイヤーが表示される状態かどうかを得る。
     * 
     * Note: ウィンドウレイヤーが作成されていない場合にはfalseが返る。
     * 
     * @returns {boolean} ウィンドウレイヤーが表示される場合にはtrue, それ以外はfalse.
     */
    Scene_Base.prototype.isWindowlayerVisble = function() {
        return (this._windowLayer) ? this._windowLayer.visible : false;
    };

    //------------------------------------------------------------------------------
    // SceneManager
    /**
     * ウィンドウレイヤーを非表示にする。
     */
    SceneManager.hideWindowLayer = function() {
        if (this._scene) {
            this._scene.hideWindowLayer();
        }
    };

    /**
     * ウィンドウレイヤーを表示させる。
     */
    SceneManager.showWindowlayer = function() {
        if (this._scene) {
            this._scene.showWindowLayer();
        }
    };


})();