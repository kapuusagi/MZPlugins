/*:ja
 * @target MZ
 * @plugindesc Canvas2D?を使ってるっぽいのでそれの調査
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @help 
 * ステータス画面に顔グラフィックやらPictureやら描画したいけど、
 * Dead時にグレースケール表示できないんですけど、問題をサクッと解決したい。
 * 
 */

(() => {
    const _Window_Base_drawFace = Window_Base.prototype.drawFace;
    Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
        this.contents.filter = "grayscale(100%)";
        _Window_Base_drawFace.call(faceName, faceIndex, x, y, width, height);
        this.contents.filter = "none";
    };
    
})();
