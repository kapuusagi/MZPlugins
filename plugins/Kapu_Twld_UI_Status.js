/*:ja
 * @target MZ 
 * @plugindesc TWLD向けステータス画面UIプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 
 * @orderAfter 
 * 
 * 
 * @help 
 * TWLD向けステータス画面UIプラグイン。
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

/**
 * Window_StatusActor.
 * ステータス画面でアクター情報を表示する。
 */
function Window_StatusActor() {
    this.initialize(...arguments);
}

(() => {
    //const pluginName = "Kapu_Twld_StatusUI";
    //const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Window_StatusActor
    Window_StatusActor.prototype = Object.create(Window_Base.prototype);
    Window_StatusActor.prototype.constuctor = Window_StatusActor;

    //------------------------------------------------------------------------------
    // 


    // コマンドウィンドウを持たせて選択させる。
    // 背景にSpriteを用意。
    
    // MVではステータス表示（一部）/スキル表示/装備表示/プロフィール表示だけであった。
    // これでいいのか？
    // 属性耐性は表示したい。1280x720レイアウトを考えると、左側or右側に表示内容選択させる方式がいいなあ。
    // レイアウトを先に決めないと作れない。
    
    

})();