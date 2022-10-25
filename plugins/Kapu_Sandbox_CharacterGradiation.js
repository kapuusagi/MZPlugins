/*:ja
 * @target MZ 
 * @plugindesc 全ての文字をグラディエーションレンダリングさせるためのプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 
 * @orderAfter 
 * 
 * 
 * @help 
 * 文字のレンダリングがすごく重くなると思う。
 * ウィンドウの文字表示だとか、ダメージの文字表示だとか関係無しに、
 * 全部グラディエーションさせる。
 * 
 * MDNのドキュメントを見る限り、グラディエーションオブジェクトは
 * 絶対座標を指定しないといけない都合上、
 * 描画位置により細かく作り直しが必要になるみたい。
 * 
 * ■ 使用時の注意
 * レンダリング処理がすごく重くなる（はず）。
 * それとも、PCのスペックがよければ問題ないレベルに落ち着くか？
 * 
 * ■ プラグイン開発者向け
 * textColorにgradiationを入れるのは止めておこう。
 * 描画座標に絶対座標が入る関係で、ろくなことにならない。
 * 
 * システム的にがっつりなので、ものによってグラディエーションさせたりさせなかったりするのはきつそう。
 * ウィンドウの文字全部 -> Window_Base.drawText()
 * スプライト関係 -> 各スプライトで各々のcontentsに描画処理しているので簡単にはいかない。
 *     ベースシステムで使用しているのは、 Sprite_Gauge, Sprite_Name, Sprite_Timer, Sprite_Damage くらい。
 *     あらかじめペイントソフトで、グラディエーションのシミュレートをしておくべき。
 * 
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
    'use strict';
    // const pluginName = "Kau_Sandbox_CharacterGradiation";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    //------------------------------------------------------------------------------
    // Bitmap
    /**
     * 文字の本体部分を描画する。
     * 
     * @param {string} text 文字列
     * @param {number} tx X位置
     * @param {number} ty Y位置
     * @param {number} maxWidth 最大幅
     * !!!overwrite!!! Bitmap._drawTextBody
     *     文字をグラディエーションさせるため、オーバーライドする。
     */
    Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth) {
        const context = this.context;
        const size = context.measureText(text);
        const gradiation = context.createLinearGradient(0, ty, 0, ty + size.height);
        gradiation.addColorStop(0, "white");
        gradiation.addColorStop(0.25, this.textColor);
        gradiation.addColorStop(0.60, this.textColor);
        gradiation.addColorStop(0.80, "#C8C8C8");
        gradiation.addColorStop(0.00, "darkgray");
        context.fillStyle = gradiation;
        context.fillText(text, tx, ty, maxWidth);
    };

})();



