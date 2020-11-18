/*:ja
 * @target MZ 
 * @plugindesc 陽光みたいなのを適用するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_MapFilterManager
 * @orderAfter KapuMapFilterManager
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
 * @desc フィルタの設定を変更する。
 * 
 * @arg angle
 * @text 角度
 * @desc 入射角。parallelが有効な場合のみ
 * @type number
 * @min -60
 * @max 60
 * 
 * 
 * @arg gain
 * @text ゲイン
 * @desc ゲイン量
 * @type number
 * @decimals 2
 * @min 0.00
 * @max 1.00
 * 
 * @arg lacunarity
 * @text 空隙性 
 * @desc 隙間に関するもの。小さくするほど光が太くなる。
 * @type number
 * @decimals 2
 * @min 0.00
 * @max 5.00
 * 
 * 
 * @help 
 * 
 * GLSLのオリジナルソースは Alain Galvan 氏のものである。
 * Alain Galvan
 * https://codepen.io/alaingalvan 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * Note
 * 以下の設定をできるようにしたい。
 * parallelのON/OFF
 * center位置(parallel無効時のみ効果)
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * フィルタON/OFF
 *   フィルタの有効/無効を設定する。
 * 
 * 設定変更
 *   フィルタの設定を変更する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 PIXI.Filtersを元に新規作成。
 */
(() => {
    const pluginName = "Kapu_MapFilter_GodrayFilter";
    // const parameters = PluginManager.parameters(pluginName);

    MapFilterManager.FILTER_GODRAY = "Godray";

    PluginManager.registerCommand(pluginName, "setEnable", args => {
        const enabled = (typeof args.enabled === "undefined") 
                ? false : (typeof args.enabled === "string") ? (args.enabled === "true") : args.enabled;
        if (enabled) {
            MapFilterManager.activate(MapFilterManager.FILTER_GODRAY);
        } else {
            MapFilterManager.deactivate(MapFilterManager.FILTER_GODRAY);
        }
    });

    PluginManager.registerCommand(pluginName, "config", args => {
        const angle = Number(args.angle);
        const gain = Number(args.gain);
        const lacunarity = Number(args.lacunarity);
        if ((angle >= -60) && (angle <= 60)) {
            MapFilterManager.filter(MapFilterManager.FILTER_GODRAY).angle = angle;
        }
        if (gain >= 0) {
            MapFilterManager.filter(MapFilterManager.FILTER_GODRAY).gain = gain;
        }
        if (lacunarity >= 0) {
            MapFilterManager.filter(MapFilterManager.FILTER_GODRAY).lacunarity = lacunarity;
        }
    });

    //------------------------------------------------------------------------------
    // GodrayFilter
    function GodrayFilter() {
        this.initialize(...arguments);
    }

    GodrayFilter.prototype = Object.create(PIXI.Filter.prototype);
    GodrayFilter.prototype.constructor = GodrayFilter;
    /**
     * GodrayFilter を 初期化する。
     */
    GodrayFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._fragmentSrc());
        this.uniforms.dimensions = new Float32Array(2);

        this._angleLight = new PIXI.Point();
        this._angle = 30;
        this.parallel = true;
        this.center = [0, 0];
        this.time = 0;

        this.uniforms.lacunarity = 2.5;
        this.uniforms.gain = 0.5;
    };
    /**
     * バーテックスシェーダーソースを得る。
     * 
     * @return {String} バーテックスシェーダーソース
     */
    GodrayFilter.prototype._vertexSrc = function() {
        return null;
    };
    /**
     * フラグメントシェーダーソースを得る。
     * 
     * @return {String} フラグメントシェーダーソース
     */
    GodrayFilter.prototype._fragmentSrc = function() {
        const src = 
            "varying vec2 vTextureCoord;" +
            "uniform sampler2D uSampler;" +
            "uniform vec4 filterArea;" +
            "uniform vec2 dimensions;" +
            "" +
            "uniform vec2 light;" +
            "uniform bool parallel;" +
            "uniform float aspect;" +
            "" +
            "uniform float gain;" +
            "uniform float lacunarity;" +
            "uniform float time;" +
            "" +
            "vec3 mod289(vec3 x)" +
            "{" +
            "    return x - floor(x * (1.0 / 289.0)) * 289.0;" +
            "}" +
            "vec4 mod289(vec4 x)" +
            "{" +
            "    return x - floor(x * (1.0 / 289.0)) * 289.0;" +
            "}" +
            "vec4 permute(vec4 x)" +
            "{" +
            "    return mod289(((x * 34.0) + 1.0) * x);" +
            "}" +
            "vec4 taylorInvSqrt(vec4 r)" +
            "{" +
            "    return 1.79284291400159 - 0.85373472095314 * r;" +
            "}" +
            "vec3 fade(vec3 t)" +
            "{" +
            "    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);" +
            "}" +
            "float pnoise(vec3 P, vec3 rep)" +
            "{" +
            "    vec3 Pi0 = mod(floor(P), rep);" +
            "    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);" +
            "    Pi0 = mod289(Pi0);" +
            "    Pi1 = mod289(Pi1);" +
            "    vec3 Pf0 = fract(P);" +
            "    vec3 Pf1 = Pf0 - vec3(1.0);" +
            "    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);" +
            "    vec4 iy = vec4(Pi0.yy, Pi1.yy);" +
            "    vec4 iz0 = Pi0.zzzz;" +
            "    vec4 iz1 = Pi1.zzzz;" +
            "    vec4 ixy = permute(permute(ix) + iy);" +
            "    vec4 ixy0 = permute(ixy + iz0);" +
            "    vec4 ixy1 = permute(ixy + iz1);" +
            "    vec4 gx0 = ixy0 * (1.0 / 7.0);" +
            "    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;" +
            "    gx0 = fract(gx0);" +
            "    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);" +
            "    vec4 sz0 = step(gz0, vec4(0.0));" +
            "    gx0 -= sz0 * (step(0.0, gx0) - 0.5);" +
            "    gy0 -= sz0 * (step(0.0, gy0) - 0.5);" +
            "    vec4 gx1 = ixy1 * (1.0 / 7.0);" +
            "    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;" +
            "    gx1 = fract(gx1);" +
            "    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);" +
            "    vec4 sz1 = step(gz1, vec4(0.0));" +
            "    gx1 -= sz1 * (step(0.0, gx1) - 0.5);" +
            "    gy1 -= sz1 * (step(0.0, gy1) - 0.5);" +
            "    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);" +
            "    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);" +
            "    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);" +
            "    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);" +
            "    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);" +
            "    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);" +
            "    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);" +
            "    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);" +
            "    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));" +
            "    g000 *= norm0.x;" +
            "    g010 *= norm0.y;" +
            "    g100 *= norm0.z;" +
            "    g110 *= norm0.w;" +
            "    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));" +
            "    g001 *= norm1.x;" +
            "    g011 *= norm1.y;" +
            "    g101 *= norm1.z;" +
            "    g111 *= norm1.w;" +
            "    float n000 = dot(g000, Pf0);" +
            "    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));" +
            "    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));" +
            "    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));" +
            "    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));" +
            "    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));" +
            "    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));" +
            "    float n111 = dot(g111, Pf1);" +
            "    vec3 fade_xyz = fade(Pf0);" +
            "    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);" +
            "    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);" +
            "    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);" +
            "    return 2.2 * n_xyz;" +
            "}" +
            "float turb(vec3 P, vec3 rep, float lacunarity, float gain)" +
            "{" +
            "    float sum = 0.0;" +
            "    float sc = 1.0;" +
            "    float totalgain = 1.0;" +
            "    for (float i = 0.0; i < 6.0; i++)" +
            "    {" +
            "        sum += totalgain * pnoise(P * sc, rep);" +
            "        sc *= lacunarity;" +
            "        totalgain *= gain;" +
            "    }" +
            "    return abs(sum);" +
            "}" +
            "" +
            "void main(void) {" +
            "    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;" +
            "" +
            "    float d;" +
            "" +
            "    if (parallel) {" +
            "        float _cos = light.x;" +
            "        float _sin = light.y;" +
            "        d = (_cos * coord.x) + (_sin * coord.y * aspect);" +
            "    } else {" +
            "        float dx = coord.x - light.x / dimensions.x;" +
            "        float dy = (coord.y - light.y / dimensions.y) * aspect;" +
            "        float dis = sqrt(dx * dx + dy * dy) + 0.00001;" +
            "        d = dy / dis;" +
            "    }" +
            "" +
            "    vec3 dir = vec3(d, d, 0.0);" +
            "" +
            "    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);" +
            "    noise = mix(noise, 0.0, 0.3);" +
            "    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);" +
            "    mist.a = 1.0;" +
            "" +
            "    gl_FragColor = texture2D(uSampler, vTextureCoord) + mist;" +
            "}";

        return src;
    };

    /**
     * フィルタを適用する。
     * 
     * @param {PIXI.FilterManager} filterManager フィルタマネージャ
     * @param {PIXI.RenderTarget} input 入力レンダリングターゲット
     * @param {PIXI.RenderTarget} output  出力レンダリングターゲット
     * @param {Boolean} clear 出力をクリアする場合にはtrue, それ以外はfalse
     */
    GodrayFilter.prototype.apply = function(filterManager, input, output, clear) {
        const {width, height} = input.filterFrame;
        this.uniforms.light = this.parallel ? this._angleLight : this.center;
        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;
        this.uniforms.time = this.time;
        filterManager.applyFilter(this, input, output, clear);
    };

    Object.defineProperties(GodrayFilter.prototype, {
        /**
         * 角度
         * 
         * @member {Number}
         */
        angle: {
            get: function() { return this._angle; },
            set: function(value) {
                this._angle = value;
                const radians = value * DEG_TO_RAD;
                this._angleLight.x = Math.cos(radians);
                this._angleLight.y = Math.sin(radians);
            }
        },
        /**
         * ゲイン
         * 
         * @member {Number}
         */
        gain: {
            get: function() { return this.uniforms.gain; },
            set: function(value) { this.uniforms.gain = value; }
        },
        /**
         * 隙間
         * 
         * @member {Number}
         */
        lacunarity: {
            get: function() { return this.uniforms.lacunarity; },
            set: function(value) { this.uniforms.lacunarity = value; }
        }

    });

    //------------------------------------------------------------------------------
    // MapFilterManager
    MapFilterManager.registerFilter(MapFilterManager.FILTER_GODRAY, GodrayFilter,
        [ "angle", "gain", "lacunarity"] );



})();