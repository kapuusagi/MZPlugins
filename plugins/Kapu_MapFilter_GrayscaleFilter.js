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
 * @help 
 * WeakBoar氏のMV向けソースを元に作成。
 * https://github.com/weakboar/mv_plugin
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
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
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 WeakBoar氏のMV向けプラグインを元に作成。動作未確認。
 */
(() => {
    const pluginName = "Kapu_MapFilter_GrayscaleFilter";
    // const parameters = PluginManager.parameters(pluginName);

    MapFilterManager.FILTER_GRAYSCALE = "GrayScale";


    PluginManager.registerCommand(pluginName, "setEnable", args => {
        const enabled = (typeof args.enabled === "undefined") 
                ? false : (typeof args.enabled === "string") ? (args.enabled === "true") : args.enabled;
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
    function GrayscaleFilter {
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
     * @return {String} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
    GrayscaleFilter.prototype._vertexSrc = function() {
        // const src = 
        //     "#define GLSLIFY 1" +
        //     "attribute vec2 aVertexPosition;" +
        //     "attribute vec2 aTextureCoord;" +
        //     "" +
        //     "uniform mat3 projectionMatrix;" +
        //     "" +
        //     "varying vec2 vTextureCoord;" +
        //     "" +
        //     "void main(void)" +
        //     "{" +
        //     "    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);" +
        //     "    vTextureCoord = aTextureCoord;" +
        //     "}";
        const src = null;
        return src;
    };
    /**
     * フラグメントシェーダのソースを得る。
     * 
     * @return {String} フラグメントシェーダーのソース。フラグメントシェーダーがない場合にはnull
     */
    GrayscaleFilter.prototype._fragmentSrc = function() {
        const src = 
                "precision mediump float;" +
                "#define GLSLIFY 1" +
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