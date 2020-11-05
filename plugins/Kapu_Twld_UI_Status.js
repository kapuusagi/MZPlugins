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


    
    // MVではステータス表示（一部）/スキル表示/装備表示/プロフィール表示だけであった。
    // これでいいのか？
    // 属性耐性は表示したい。1280x720レイアウトを考えると、左側or右側に表示内容選択させる方式がいいなあ。
    // レイアウトを先に決めないと作れない。

    // ・左側にステータスカテゴリ選択ウィンドウ。(ステータス1/ステータス2/装備/スキル/プロフィール)
    //   スキル選択時はスキルタイプ選択ウィンドウをオーバーラップさせる。
    //   スキル一覧は並び替えができるようにする。
    //   操作 up/down:項目切替、 ok:決定 cancel:シーン終了 pageDown:前のアクター, pageUp:次のアクター
    //   
    // ・ステータス1
    //   HP/MPやATK/DEF, STR/DEXなどの基本ステータス表示。
    //   HIT等の一部パラメータも表示できれば全部やりたいなあ。-> 表示項目を一覧にする。
    //     顔グラフィック
    //     Lv/クラス名/通り名/GP
    //     HP/MaxHP/Mp/MaxMP/MaxTP
    //     STR/DEX/VIT/INT/MEN/AGI/LUK (LUKはニコニコマークとかにしたい)
    //     ATK/DEF/DEF.Rate/MAT/MDF/MDF.Rate
    //     HIT/EVA/MEV/CRI/CEV/CDR/
    //     PEN/PDR/
    //     いっぱいあるけど全部はいらない。
    // ・ステータス2
    //     属性レート
    //     MRF/CNT/HRG/MRG/TRG/TGR/GRD/REC/PHA (0以外なら表示)
    //     ドロップレート/取得ゴールドレート/EXPレート
    // ・装備
    //     装備一覧表示
    //     ウェポンマスタリ
    // ・スキル
    //     並び替えサポート
    // コマンドウィンドウを持たせて選択させる。
    // 背景にSpriteを用意。
    

})();