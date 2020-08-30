/*:ja
 * @target MZ
 * @plugindesc 実用上意味が無いプラグイン。調べたことや実験実装を試すためのもの。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @help 
 * 
 * 
 */

(() => {

    const _Window_Base_initialize = Window_Base.prototype.initialize;

    Window_Base.prototype.initialize = function( /* rect */) {
        _Window_Base_initialize.call(this, ...arguments);
        //this.frameVisible = false; // frame_Visibleで枠が無くなる。
        //this._contentsBackSprite.visible = false;
    };
    
})();