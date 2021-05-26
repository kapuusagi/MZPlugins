/*:ja
 * @target MZ 
 * @plugindesc マップGrayscaleフィルタ
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_MapFilterManager
 * @orderAfter Kapu_MapFilterManager
 * 
 * @command setEnable
 * @text フィルタON/OFF
 * @desc フィルタのON/OFFを設定する。
 * 
 * @arg enabled
 * @text 有効にする
 * @desc 有効にする場合にはtrue, それ以外はfalse
 * @type boolean
 * @default false
 * 
 * @help 
 * WeakBoar氏のMV向けソースを元に作成。
 * https://github.com/weakboar/mv_plugin
 * 
 * ■ 使用時の注意
 * なし。
 * 
 * ■ プラグイン開発者向け
 * なし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * フィルタのON/OFF
 *     フィルタの有効/無効を設定する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 WeakBoar氏のMV向けプラグインを元に作成。
 */
(() => {
    const pluginName = "Kapu_MapFilter_GrayscaleFilter";
    // const parameters = PluginManager.parameters(pluginName);

    MapFilterManager.FILTER_GRAYSCALE = "GrayScale";

    /**
     * 真偽値を得る。
     * 
     * @param {object} valueStr 値文字列
     * @returns {boolean} 真偽値
     */
    const _parseBoolean = function(valueStr) {
        if (typeof valueStr === "undefined") {
            return undefined;
        } else if (typeof valueStr === "string") {
            if (valueStr) {
                return valueStr === "true";
            } else {
                return undefined;
            }
        } else {
            return Boolean(valueStr);
        }
    };
    PluginManager.registerCommand(pluginName, "setEnable", args => {
        const enabled = _parseBoolean(args.enabled);
        if (enabled) {
            MapFilterManager.activate(MapFilterManager.FILTER_GRAYSCALE);
        } else {
            MapFilterManager.deactivate(MapFilterManager.FILTER_GRAYSCALE);
        }
    });

    //------------------------------------------------------------------------------
    // GrayscaleFilter
    /**
     * GrayscaleFilter
     * グレースケールにするフィルター。
     */
    function GrayscaleFilter() {
        this.initialize(...arguments);
    }

    GrayscaleFilter.prototype = Object.create(PIXI.Filter.prototype);
    GrayscaleFilter.prototype.constructor = GrayscaleFilter;

    /**
     * GrayscaleFilterを初期化する。
     */
    GrayscaleFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._fragmentSrc());
    };
        /**
     * バーテックスシェーダーのソースを得る。
     * 
     * @returns {String} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
    GrayscaleFilter.prototype._vertexSrc = function() {
        const src = null;
        return src;
    };
    /**
     * フラグメントシェーダのソースを得る。
     * 
     * @returns {String} フラグメントシェーダーのソース。フラグメントシェーダーがない場合にはnull
     */
    GrayscaleFilter.prototype._fragmentSrc = function() {
        const src = 
                "precision mediump float;" +
                "" +
                "uniform sampler2D uSampler;" +
                "varying vec2      vTextureCoord;" +
                "" +
                "const float redScale   = 0.298912;" +
                "const float greenScale = 0.586611;" +
                "const float blueScale  = 0.114478;" +
                "const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);" +
                "" +
                "void main(void){" +
                "    vec4 smpColor = texture2D(uSampler, vTextureCoord);" +
                "    float grayColor = dot(smpColor.rgb, monochromeScale);" +
                "    smpColor = vec4(vec3(grayColor), 1.0);" +
                "    gl_FragColor = smpColor;" +
                "}";
        return src;
    };

    //------------------------------------------------------------------------------
    // MapFilterManager
    MapFilterManager.registerFilter(MapFilterManager.FILTER_GRAYSCALE, GrayscaleFilter,
        [ ] );



})();
