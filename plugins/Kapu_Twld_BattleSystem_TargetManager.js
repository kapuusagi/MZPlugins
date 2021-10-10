/*:ja
 * @target MZ 
 * @plugindesc Kapu_Twld_BattleSystemにKapu_TargetManagerを組み合わせるための補助プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_TargetManager
 * @orderAfter Kapu_TargetManager
 * @base Kapu_Twld_BattleSystem
 * @orderAfter Kapu_twld_BattleSystem
 * 
 * 
 * @help 
 * Kapu_Twld_BattleSystemにKapu_TargetManagerを組み合わせるための補助プラグイン。
 * 以下の問題に対応する。
 *   ・戦闘中アクター選択処理UIの矛盾解消。
 *     Kapu_TargetManagerでは戦闘中の対象選択に Window_BattleActionTarget を使用し、
 *     Window_BattleActor は使用しないようになっている。
 *     一方、Kapu_Twld_BattleSystem では Window_BattleActor にアクター画像は表示せず、
 *     単純に名前を並べて必要なタイミングで対象選択させる仕組みになっている。
 *   ・
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
    // const pluginName = "Kapu_Twld_BattleSystem_TargetManager";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Window_BattleActor
    /**
     * 選択インデックスを設定する。
     * 
     * @param {number} index インデックス番号
     */
    // eslint-disable-next-line no-unused-vars
    Window_BattleActor.prototype.select = function(index) {
    };

    //------------------------------------------------------------------------------
    // Scene_Battle
    /**
     * スキル使用対象選択用のアクター選択ウィンドウを作成する。
     * 
     * !!!overwrite!!! Scene_Battle.createActorWindow()
     *     そのため、アイテム・スキル使用対象のアクターウィンドウを表示させないようにするため、オーバーライドする。
     */
    Scene_Battle.prototype.createActorWindow = function() {
        const rect = this.actorWindowRect();
        this._actorWindow = new Window_BattleActor(rect);
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        //this.addWindow(this._actorWindow);
    };
})();