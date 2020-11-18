/*:ja
 * @target MZ 
 * @plugindesc マップ用セピアフィルタ
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
 * @desc trueにするとフィルタを有効にする。
 * @type boolean
 * @default false
 * 
 * 
 * 
 * @help 
 * WeakBoar氏のMV向けソースを元に作成。
 * https://github.com/weakboar/mv_plugin
 * 
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
    const pluginName = "Kapu_MapFilter_SepiaFilter";
    // const parameters = PluginManager.parameters(pluginName);

    MapFilterManager.FILTER_SEPIA = "Sepia";

    PluginManager.registerCommand(pluginName, "setEnable", args => {
        const enabled = (typeof args.enabled === "undefined") 
                ? false : (typeof args.enabled === "string") ? (args.enabled === "true") : args.enabled;
        if (enabled) {
            MapFilterManager.activate(MapFilterManager.FILTER_SEPIA);
        } else {
            MapFilterManager.deactivate(MapFilterManager.FILTER_SEPIA);
        }
    });

    //------------------------------------------------------------------------------
    // SepiaFilter
    /**
     * SepiaFilter
     * セピアカラーにするフィルター。
     */
    function SepiaFilter() {
        this.initialize(...arguments);
    }

    SepiaFilter.prototype = Object.create(PIXI.Filter.prototype);
    SepiaFilter.prototype.constructor = SepiaFilter;

    /**
     * SepiaFilterを初期化する。
     */
    SepiaFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._fragmentSrc());

    };
    /**
     * バーテックスシェーダーのソースを得る。
     * 
     * @return {String} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
    SepiaFilter.prototype._vertexSrc = function() {
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
    SepiaFilter.prototype._fragmentSrc = function() {
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
            "const float sRedScale   = 1.07;" +
            "const float sGreenScale = 0.74;" +
            "const float sBlueScale  = 0.43;" +
            "const vec3  sepiaScale = vec3(sRedScale, sGreenScale, sBlueScale);" +
            "" +
            "void main(void){" +
            "    vec4  smpColor  = texture2D(uSampler, vTextureCoord);" +
            "    float grayColor = dot(smpColor.rgb, monochromeScale);" +
            "    vec3 monoColor = vec3(grayColor) * sepiaScale; " +
            "    smpColor = vec4(monoColor, 1.0);" +
            "    gl_FragColor = smpColor;" +
            "}";
        return src;
    };
    //------------------------------------------------------------------------------
    // MapFilterManager
    MapFilterManager.registerFilter(MapFilterManager.FILTER_SEPIA, SepiaFilter, [ ] );

})();