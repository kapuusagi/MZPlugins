/*:ja
 * @target MZ 
 * @plugindesc マップに適用するフィルタのサンプルプラグイン。
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
 * @command config
 * @text 設定変更
 * @desc 設定をする
 * 
 * @arg shadowRate
 * @text 影の割合(0-255)
 * @desc 影の割合を設定する。
 * @type number
 * @default 0
 * @min 0
 * @max 255
 * 
 * @help 
 * サンプルフィルタ。
 * フィルタ識別名： Sample
 * 
 * MapFilterManager.isActive(MapFilterManager.FILTER_SAMPLE) で
 * フィルタが有効かどうかを得る。
 * 
 * ■ 使用時の注意
 * ありません。
 * 
 * ■ プラグイン開発者向け
 * ありません。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * フィルタのON/OFF
 *     フィルタの有効/無効を設定する。
 * 
 * 設定変更
 *     フィルタの設定を変更する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_MapFilter_SampleFilter";
    // const parameters = PluginManager.parameters(pluginName);

    MapFilterManager.FILTER_SAMPLE = "Sample";

    PluginManager.registerCommand(pluginName, "setEnable", args => {
        const enabled = (typeof args.enabled === "undefined") 
                ? false : (typeof args.enabled === "string") ? (args.enabled === "true") : args.enabled;
        if (enabled) {
            MapFilterManager.activate(MapFilterManager.FILTER_SAMPLE);
        } else {
            MapFilterManager.deactivate(MapFilterManager.FILTER_SAMPLE);
        }
    });

    PluginManager.registerCommand(pluginName, "config", args => {
        const shadowRate = (Number(args.shadowRate) || 0).clamp(0, 255);
        MapFilterManager.filter(MapFilterManager.FILTER_SAMPLE).shadowRate = shadowRate;
    });

    //------------------------------------------------------------------------------
    // SampleFilter
    /**
     * SampleFilter
     * 動作確認をするためのフィルタ。
     */
    function SampleFilter() {
        this.initialize(...arguments);
    }

    SampleFilter.prototype = Object.create(PIXI.Filter.prototype);
    SampleFilter.prototype.constructor = SampleFilter;

    /**
     * SampleFilterを初期化する。
     */
    SampleFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._flagmentSrc());
        this.uniforms.shadowRate = 0;
    };

    /**
     * 影にする割合(0-255)
     * @constant {Number}
     */
    Object.defineProperty(SampleFilter.prototype, "shadowRate", {
        configurable:true,
        enumerable:true,
        set: function(value) { this.uniforms.shadowRate = value.clamp(0, 255); },
        get: function() { return this.uniforms.shadowRate; }
    });

    /**
     * バーテックスシェーダーのソースを得る。
     * 
     * @return {String} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
    SampleFilter.prototype._vertexSrc = function() {
        return null;
    };
    /**
     * フラグメントシェーダのソースを得る。
     * 
     * @return {String} フラグメントシェーダーのソース。フラグメントシェーダーがない場合にはnull
     */
    SampleFilter.prototype._flagmentSrc = function() {
        const src =
            "varying vec2 vTextureCoord;" +
            "uniform sampler2D uSampler;" +
            "uniform float shadowRate;" +
            "void main() {" +
            "  vec4 sample = texture2D(uSampler, vTextureCoord);" +
            "  float vertRate = clamp(1.0 - vTextureCoord.y * 2.0 + 0.5, 0.0, 1.0);" +
            "  float pictureRate = 1.0 - shadowRate / 255.0 * vertRate;" +
            "  float r = sample.r * pictureRate;" +
            "  float g = sample.g * pictureRate;" +
            "  float b = sample.b * pictureRate;" +
            "  float a = sample.a;" +
            "  gl_FragColor = vec4(r, g, b, a);" +
            "}";
        return src;
    };

    //------------------------------------------------------------------------------
    // MapFilterManager
    MapFilterManager.registerFilter(MapFilterManager.FILTER_SAMPLE, SampleFilter, [ "shadowRate" ]);

})();