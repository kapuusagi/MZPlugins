/*:ja
 * @target MZ 
 * @plugindesc スキルタイプ別にスキルコスト特性プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_SkillCost
 * 
 * 
 * @help 
 * スキルタイプ別にスキルコストを増加減する特性を追加するプラグイン。
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


})();