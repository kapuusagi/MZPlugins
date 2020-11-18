/*:ja
 * @target MZ 
 * @plugindesc MapFilterにTiltShiftFilterを適用するプラグイン
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
 * @desc フィルタの設定を変更する。
 * 
 * @arg blur
 * @text ぼかし強度
 * @desc ぼかしの強度。大きくするとぼけ具合が強くなる。
 * @type number
 * 
 * @arg gradientBlur
 * @text ぼかしの勾配
 * @desc ぼかしの勾配。大きくすると急激にぼける。
 * @type number
 * 
 * 
 * @help 
 * Scene_MapにPIXI.Filters.TiltShiftFilterを適用するプラグイン。
 * WeakBoar氏のMV向けソースを元に作成。
 * https://github.com/weakboar/mv_plugin
 * 
 * オリジナルフィルタのPIXIソースは下記URLのものを参考にした。
 * https://pixijs.io/pixi-filters/docs/filters_tilt-shift_src_TiltShiftFilter.js.html#line24
 * 
 *
 * オリジナルフィルタのGLSLソースは EvanWallace 氏の作成したものである。
 * Evan Wallace氏 : http://madebyevan.com/
 * https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js
 * https://github.com/evanw/glfx.js/blob/master/src/filters/common.js
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * Note：
 * アクターの一を中心にしてぼかすように若干変更を加えるようにしたいなあ。
 * あとぼかしの中心位置をずらす機能。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * フィルタON/OFF
 *     フィルタの有効/無効を設定する。
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 WeakBoar氏のプラグインを元に作成。動作未確認。
 */
(() => {
    const pluginName = "Kapu_MapFilter_TiltShiftFilter";
    // const parameters = PluginManager.parameters(pluginName);

    MapFilterManager.FILTER_TILTSHIFT = "TiltShift";

    PluginManager.registerCommand(pluginName, "setEnable", args => {
        const enabled = (typeof args.enabled === "undefined") 
                ? false : (typeof args.enabled === "string") ? (args.enabled === "true") : args.enabled;
        if (enabled) {
            MapFilterManager.activate(MapFilterManager.FILTER_TILTSHIFT);
        } else {
            MapFilterManager.deactivate(MapFilterManager.FILTER_TILTSHIFT);
        }
    });

    PluginManager.registerCommand(pluginName, "config", args => {
        const blur = Number(args.blur);
        const gradientBlur = Number(args.gradientBlur);
        if (blur >= 0) {
            MapFilterManager.filter(MapFilterManager.FILTER_TILTSHIFT).blur = blur;
        }
        if (gradientBlur >= 0) {
            MapFilterManager.filter(MapFilterManager.FILTER_TILTSHIFT).gradientBlur = gradientBlur;
        }
    });


    //------------------------------------------------------------------------------
    // TiltShiftAxisFilter
    /**
     * TiltShiftAxisFilter
     * 
     * Note: 軸に対するフィルタソース。なんでXYに分けてるのかはよく分からん。
     */
    function TiltShiftAxisFilter() {
        this.initialize(...arguments);
    }
    TiltShiftAxisFilter.prototype = Object.create(PIXI.Filter.prototype);
    TiltShiftAxisFilter.prototype.constructor = TiltShiftAxisFilter;

    /**
     * TiltShiftAxisFilterを 初期化する。
     */
    TiltShiftAxisFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._flagmentSrc());
        this.uniforms.blur = 30;
        this.uniforms.gradientBlur = 600;
        this.uniforms.start = new PIXI.Point(0, Graphics.height / 2);
        this.uniforms.end = new PIXI.Point(Graphics.width, Graphics.height / 2);
        this.uniforms.delta = new PIXI.Point(30, 30);
        this.uniforms.texSize = new PIXI.Point(window.innerWidth, window.innerHeight);

        this.updateDelta();
    };

    /**
     * フィルタのdelta値を更新する。
     * このメソッドはX,Yフィルタにてオーバーライドする。
     */
    TiltShiftAxisFilter.prototype.updateDelta = function() {
        this.uniforms.delta.x = 0;
        this.uniforms.delta.y = 0;    
    };

    /**
     * バーテックスシェーダーソースを得る。
     * 
     * @return {String} バーテックスシェーダーソース
     */
    TiltShiftAxisFilter.prototype._vertexSrc = function() {
        // WeakBore氏のソースではバーテックスシェーダーを設定しているが、
        // Evan氏のソースではバーテックスシェーダーはnullを渡している。

        // const src = 
        //     "#define GLSLIFY 1" +
        //     "" +
        //     "attribute vec2 aVertexPosition;" +
        //     "attribute vec2 aTextureCoord;" +
        //     "uniform mat3 projectionMatrix;" +
        //     "" + 
        //     "varying vec2 vTextureCoord;" + 
        //     "" + 
        //     "void main(void)" + 
        //     "{" +
        //     "    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);" +
        //     "    vTextureCoord = aTextureCoord;" +
        //     "}"
        const src = null;
        return src;
    };

    /**
     * フラグメントシェーダーソースを得る。
     * 
     * @return {String} フラグメントシェーダーソース
     */
    TiltShiftAxisFilter.prototype._fragmentSrc = function() {
        const src =
            "uniform sampler2D texture;" +
            "uniform float blurRadius;" +
            "uniform float gradientRadius;" +
            "uniform vec2 start;" +
            "uniform vec2 end;" +
            "uniform vec2 delta;" +
            "uniform vec2 texSize;" +
            "varying vec2 texCoord;" +
            "" +
            "  float random(vec3 scale, float seed) {" +
            "    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);" +
            "  }" +
            "" +
            "void main() {" +
            "  vec4 color = vec4(0.0);" +
            "  float total = 0.0;" +
            "  " +
            "  float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);" +
            "  " +
            "  vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));" +
            "  float radius = smoothstep(0.0, 1.0, abs(dot(texCoord * texSize - start, normal)) / gradientRadius) * blurRadius;" +
            "  for (float t = -30.0; t <= 30.0; t++) {" +
            "    float percent = (t + offset - 0.5) / 30.0;" +
            "    float weight = 1.0 - abs(percent);" +
            "    vec4 sample = texture2D(texture, texCoord + delta / texSize * percent * radius);" +
            "    " +
            "    sample.rgb *= sample.a;" +
            "    " +
            "    color += sample * weight;" +
            "    total += weight;" +
            "  }" +
            "  " +
            "  gl_FragColor = color / total;" +
            "  " +
            "  gl_FragColor.rgb /= gl_FragColor.a + 0.00001;" +
            "}"
        return src;
    };

    Object.defineProperties(TiltShiftAxisFilter.prototype, {
        /**
         * Blurフィルタの強さ
         *
         * @member {number}
         */
        blur: {
            get: function () {
                return this.uniforms.blur;
            },
            set: function (value) {
                this.uniforms.blur = value;
            }
        },

        /**
         * Blurフィルタの勾配の強さ。
         *
         * @member {number}
         */
        gradientBlur: {
            get: function ()
            {
                return this.uniforms.gradientBlur;
            },
            set: function (value)
            {
                this.uniforms.gradientBlur = value;
            }
        },

        /**
         * エフェクトを開始するXの値。
         *
         * @member {PIXI.Point}
         */
        start: {
            get: function ()
            {
                return this.uniforms.start;
            },
            set: function (value)
            {
                this.uniforms.start = value;
                this.updateDelta();
            }
        },

        /**
         * エフェクトを停止するXの値。
         *
         * @member {PIXI.Point}
         */
        end: {
            get: function ()
            {
                return this.uniforms.end;
            },
            set: function (value)
            {
                this.uniforms.end = value;
                this.updateDelta();
            }
        },

        /**
         * テクスチャサイズ
         *
         * @member {PIXI.Point}
         */
        texSize: {
            get: function ()
            {
                return this.uniforms.texSize;
            },
            set: function (value)
            {
                this.uniforms.texSize = value;
            }
        }
    });

    //------------------------------------------------------------------------------
    // TiltShiftXFilter
    /**
     * TiltShiftXFilter.
     * 
     */
    function TiltShiftXFilter() {
        this.initialize(...arguments);
        
    }

    TiltShiftXFilter.prototype = Object.create(TiltShiftAxisFilter.prototype);
    TiltShiftXFilter.prototype.constructor = TiltShiftXFilter;

    
    TiltShiftXFilter.prototype.initialize = function() {
        TiltShiftAxisFilter.prototype.initialize.call(this);
    };

    /**
     * フィルタのdelta値を更新する。
     */
    TiltShiftXFilter.prototype.updateDelta = function() {
        const dx = this.uniforms.end.x - this.uniforms.start.x;
        const dy = this.uniforms.end.y - this.uniforms.start.y;
        const d = Math.sqrt(dx * dx + dy * dy);
    
        this.uniforms.delta.x = dx / d;
        this.uniforms.delta.y = dy / d;
    };
    //------------------------------------------------------------------------------
    // TiltShiftYFilter
    /**
     * A TiltShiftYFilter.
     *
     * @class
     * @extends PIXI.TiltShiftAxisFilter
     */
    function TiltShiftYFilter() {
        this.initialize(...arguments);
    }

    TiltShiftYFilter.prototype = Object.create(TiltShiftAxisFilter.prototype);
    TiltShiftYFilter.prototype.constructor = TiltShiftYFilter;

    TiltShiftYFilter.prototype.initialize = function() {
        TiltShiftAxisFilter.prototype.initialize.call(this);
    };

    /**
     * フィルタのdelta値を更新する。
     */
    TiltShiftYFilter.prototype.updateDelta = function() {
        const dx = this.uniforms.end.x - this.uniforms.start.x;
        const dy = this.uniforms.end.y - this.uniforms.start.y;
        const d = Math.sqrt(dx * dx + dy * dy);
    
        this.uniforms.delta.x = -dy / d;
        this.uniforms.delta.y = dx / d;
    };
    //------------------------------------------------------------------------------
    // TiltShiftFilter
    /**
     * TiltShiftFilter
     * マップのぼかしをするためのフィルタ
     */
    function MapTiltShiftFilter() {
        this.initialize(...arguments);
    }

    MapTiltShiftFilter.prototype = Object.create(PIXI.Filter.prototype);
    MapTiltShiftFilter.prototype.constructor = MapTiltShiftFilter;

    /**
     * MapTiltShiftFilterを初期化する。
     */
    MapTiltShiftFilter.prototype.initialize = function() {
        PIXI.Filter.call(this);
        this._xFilter = new TiltShiftXFilter();
        this._yFilter = new TiltShiftYFilter();
    };

    MapTiltShiftFilter.prototype = Object.create(PIXI.Filter.prototype);
    MapTiltShiftFilter.prototype.constructor = TiltShiftFilter;

    /**
     * 
     * @param {PIXI.FilterManager} filterManager 
     * @param {PIXI.RenderTexture} input 入力レンダリングターゲット
     * @param {PIXI.RenderTexture} output 出力レンダリングターゲット
     */
    MapTiltShiftFilter.prototype.apply = function(filterManager, input, output) {
        const renderTarget = filterManager.getRenderTarget(true);
        this._xFilter.texSize = new PIXI.Point(renderTarget.size.width, renderTarget.size.height);
        this._yFilter.texSize = new PIXI.Point(renderTarget.size.width, renderTarget.size.height);
    
        this._xFilter.apply(filterManager, input, renderTarget, true);
        this._yFilter.apply(filterManager, renderTarget, output, false);
    
        filterManager.returnRenderTarget(renderTarget);


        // Note どっちか1つだけ生かしてみル場合には？
        // this._xFilter.texSize = new PIXI.Point(renderTarget.size.width, renderTarget.size.height);
        // this._xFilter.apply(filterManager, input, output, false);

    };

    Object.defineProperties(MapTiltShiftFilter.prototype, {
        /**
         * Blurの強さ
         *
         * @member {number}
         */
        blur: {
            get: function ()
            {
                return this._xFilter.blur;
            },
            set: function (value)
            {
                this._xFilter.blur = value;
                this._yFilter.blur = value;
            }
        },

        /**
         * Blurをかける勾配の強さ
         *
         * @member {number}
         */
        gradientBlur: {
            get: function ()
            {
                return this._xFilter.gradientBlur;
            },
            set: function (value)
            {
                this._xFilter.gradientBlur = value;
                this._yFilter.gradientBlur = value;
            }
        },

        /**
         * Y開始位置？？？
         *
         * @member {PIXI.Point}
         */
        start: {
            get: function ()
            {
                return this._xFilter.start;
            },
            set: function (value)
            {
                this._xFilter.start = value;
                this._yFilter.start = value;
            }
        },

        /**
         * エフェクト終了位置。
         *
         * @member {PIXI.Point}
         */
        end: {
            get: function ()
            {
                return this.tiltShiftXFilter.end;
            },
            set: function (value)
            {
                this._xFilter.end = value;
                this._yFilter.end = value;
            }
        }
    });

    //------------------------------------------------------------------------------
    // MapFilterManager
    MapFilterManager.registerFilter(MapFilterManager.FILTER_TILTSHIFT, MapTiltShiftFilter,
        [ "blur", "gradientBlur"] );

})();