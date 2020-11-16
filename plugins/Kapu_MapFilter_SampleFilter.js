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
 * 
 * @help 
 * サンプルフィルタ
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
    const pluginName = "Kapu_MapFilter_SampleFilter";
    // const parameters = PluginManager.parameters(pluginName);

    const filterName = "Sample";

    PluginManager.registerCommand(pluginName, "setEnable", args => {
        const enabled = (typeof args.enabled === "undefined") 
                ? false : (typeof args.enabled === "string") ? (args.enabled === "true") : args.enabled;
        if (enabled) {
            MapFilterManager.activate(filterName);
        } else {
            MapFilterManager.deactivate(filterName);
        }
        // TODO : コマンドの処理。
        // パラメータメンバは @argで指定した名前でアクセスできる。
    });

    PluginManager.registerCommand(pluginName, "config", args => {
        const shadowRate = (Number(args.shadowRate) || 0).clamp(0, 255);
        MapFilterManager.filter(filterName).setShadowRate(shadowRate);
    });

    //------------------------------------------------------------------------------
    // SampleFilter
    function SampleFilter() {
        this.initialize(...arguments);
    }

    SampleFilter.prototype = Object.create(PIXI.Filter.prototype);
    SampleFilter.prototype.constructor = SampleFilter;

    SampleFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._flagmentSrc());
        this.uniforms.shadowRate = 0;
    };

    /**
     * 影の割合を設定する。
     * 
     * @param {Number} shadowRate 影の割合(0～255。255で影最大)
     */
    SampleFilter.prototype.setShadowRate = function(shadowRate) {
        this.uniforms.shadowRate = shadowRate.clamp(0.0, 255.0);
    };
    /**
     * 影の割合を取得する。
     * 
     * @return {Number} 影の割合(0～255。255で影最大)
     */
    SampleFilter.prototype.shadowRate = function() {
        return this.uniforms.shadowRate;
    };

    /**
     * バーテックスシェーダーのソースを得る。
     * 
     * @return {String} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
    SampleFilter.prototype._vertexSrc = function() {
        return null;
    };
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
    MapFilterManager.registerFilter(filterName, SampleFilter);

    /*
    * (3) フィルタのON/OFFをできるようにする。
    *     各プラグイン側で
    *     MapFilterManager.activate("hoge")
    *     と
    *     MapFilterManager.deactivate("hoge")
    *     をコールするようにすればいい。
    * (4) プラグインコマンドでパラメータを変更できるようにする。
    * */


})();