/*:ja
 * @target MZ 
 * @plugindesc TWLDコアシステムプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * 
 * ■ 使用時の注意
 * 
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
    const pluginName = 'Kapu_TwldCore';
    const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, 'TODO:コマンド。@commsndで指定したやつ', args => {
        // TODO : コマンドの処理。
        // パラメータメンバは @argで指定した名前でアクセスできる。
    });

    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();