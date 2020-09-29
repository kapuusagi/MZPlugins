/*:ja
 * @target MZ 
 * @plugindesc GrowupSystemのTwld向けカスタマイズ。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * 
 * 
 * @help 
 * GrowupSystemのTwld向けカスタマイズ。
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
    const pluginName = "TODO:拡張子なしのプラグインファイル名。ファイル名変更すると動かなくなるのはどうなの？";
    const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
        // TODO : コマンドの処理。
        // パラメータメンバは @argで指定した名前でアクセスできる。
    });

    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張

    /**
     * レベルアップ時に加算するGrowPointを得る。
     * 
     * @param {Number} level レベル
     * @return {Number} 加算するGrowPoint
     */
    Game_Actor.prototype.growPointAtLevelUp = function(level) {
        return 3 + Math.min(6, Math.floor(this._level / 20));
    };


})();