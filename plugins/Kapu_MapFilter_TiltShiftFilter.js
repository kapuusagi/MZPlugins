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
 * @desc ぼかしの勾配。大きくすると中心からのぼけ具合が緩やかになる。
 * @type number
 * 
 * @arg playerCenter
 * @text プレイヤーに追従させるかどうか
 * @desc trueにすると追従する。falseにすると画面中央を基準にする。
 * @type boolean
 * 
 * @param defaultBlur
 * @text デフォルトのぼかし強度
 * @desc 大きくするとぼけ具合が強くなる。
 * @type number
 * @default 30
 * 
 * @param defaultGradientBlur
 * @text デフォルトのぼかし勾配
 * @desc 大きくすると中心からのぼけ具合が緩やかになる。
 * @type number
 * @default 800
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
 * 本来のTiltShiftFilterについて。
 *   start - end で指定した直線範囲を中心として、
 *   その領域から離れるほどぼかすもののようである。
 * 
 * ■ 使用時の注意
 * デフォルトはプレイヤーの位置を中心として、上下に離れるとぼかす。
 * プラグインコマンドで playerCenter を false にすると、
 * 画面中央をぼかすようにする。
 * 
 * 残課題
 *   プレイヤー位置と画面中央がずれているときに、
 *   playerCenterを急激に切り替えると、変化が目立つ。
 * 
 * ■ プラグイン開発者向け
 * 特になし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * フィルタON/OFF
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
 * Version.0.1.0 WeakBoar氏のプラグインを元に作成。
 */
(() => {
    const pluginName = "Kapu_MapFilter_TiltShiftFilter";
    const parameters = PluginManager.parameters(pluginName);
    const defaultBlur = Number(parameters["defaultBlur"]) || 30;
    const defaultGradientBlur = Number(parameters["defaultGradientBlur"]) || 800;

    MapFilterManager.FILTER_TILTSHIFT = "TiltShift";

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
            MapFilterManager.activate(MapFilterManager.FILTER_TILTSHIFT);
        } else {
            MapFilterManager.deactivate(MapFilterManager.FILTER_TILTSHIFT);
        }
    });

    PluginManager.registerCommand(pluginName, "config", args => {
        const blur = (args.blur) ? Number(args.blur) : undefined;
        const gradientBlur = (args.gradientBlur) ? Number(args.gradientBlur) : undefined;
        const isPlayerCenter = _parseBoolean(args.playerCenter);
        if (blur >= 0) {
            MapFilterManager.filter(MapFilterManager.FILTER_TILTSHIFT).blur = blur;
        }
        if (gradientBlur >= 0) {
            MapFilterManager.filter(MapFilterManager.FILTER_TILTSHIFT).gradientBlur = gradientBlur;
        }
        if (typeof isPlayerCenter !== "undefined") {
            MapFilterManager.filter(MapFilterManager.FILTER_TILTSHIFT).playerCenter = isPlayerCenter;
        } 
    });


    //------------------------------------------------------------------------------
    // TiltShiftAxisFilter
    /**
     * TiltShiftAxisFilter
     * 
     * Note: 軸に対するフィルタソース。
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
        PIXI.Filter.call(this, this._vertexSrc(), this._fragmentSrc());
        this.uniforms.blur = defaultBlur;
        this.uniforms.gradientBlur = defaultGradientBlur;
        this.uniforms.start = new PIXI.Point(0, 360); // 暫定値
        this.uniforms.end = new PIXI.Point(1280, 360); // 暫定値
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
     * @returns {String} バーテックスシェーダーソース
     */
    TiltShiftAxisFilter.prototype._vertexSrc = function() {
        const src = null;
        return src;
    };

    /**
     * フラグメントシェーダーソースを得る。
     * 
     * @returns {String} フラグメントシェーダーソース
     */
    TiltShiftAxisFilter.prototype._fragmentSrc = function() {
        const src =
            "varying vec2 vTextureCoord;" +
            "" +
            "uniform sampler2D uSampler;" +
            "uniform float blur;" +
            "uniform float gradientBlur;" +
            "uniform vec2 start;" +
            "uniform vec2 end;" +
            "uniform vec2 delta;" +
            "uniform vec2 texSize;" +
            "" +
            "float random(vec3 scale, float seed)" +
            "{" +
            "    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);" +
            "}" +
            "" +
            "void main(void)" +
            "{" +
            "    vec4 color = vec4(0.0);" +
            "    float total = 0.0;" +
            "" +
            "    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);" +
            "    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));" +
            "    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;" +
            "" +
            "    for (float t = -30.0; t <= 30.0; t++)" +
            "    {" +
            "        float percent = (t + offset - 0.5) / 30.0;" +
            "        float weight = 1.0 - abs(percent);" +
            "        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);" +
            "        sample.rgb *= sample.a;" +
            "        color += sample * weight;" +
            "        total += weight;" +
            "    }" +
            "" +
            "    color /= total;" +
            "    color.rgb /= color.a + 0.00001;" +
            "" +
            "    gl_FragColor = color;" +
            "}";
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
     * 水平方向TiltShiftFilter.
     */
    function TiltShiftXFilter() {
        this.initialize(...arguments);
    }

    TiltShiftXFilter.prototype = Object.create(TiltShiftAxisFilter.prototype);
    TiltShiftXFilter.prototype.constructor = TiltShiftXFilter;

    /**
     * TiltShiftXFilterを初期化する。
     */    
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
     * TiltShiftYFilter
     * 垂直方向TiltShiftFilter
     */
    function TiltShiftYFilter() {
        this.initialize(...arguments);
    }

    TiltShiftYFilter.prototype = Object.create(TiltShiftAxisFilter.prototype);
    TiltShiftYFilter.prototype.constructor = TiltShiftYFilter;

    /**
     * TiltShiftYFilterを初期化する。
     */
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
    // MapTiltShiftFilter
    /**
     * MapTiltShiftFilter
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
        this._isPlayerCenter = true;
        this._centerY = 0;
    };

    /**
     * フィルタを適用する。
     * 
     * @param {PIXI.FilterManager} filterManager 
     * @param {PIXI.RenderTexture} input 入力レンダリングターゲット
     * @param {PIXI.RenderTexture} output 出力レンダリングターゲット
     */
    MapTiltShiftFilter.prototype.apply = function(filterManager, input, output) {
        let renderTarget = filterManager.getFilterTexture();
        this._xFilter.apply(filterManager, input, renderTarget);
        this._yFilter.apply(filterManager, renderTarget, output);
        filterManager.returnFilterTexture(renderTarget);
    };

    /**
     * 更新する。
     */
    MapTiltShiftFilter.prototype.updatePoint = function() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;

        const y = (this._isPlayerCenter) ? this._centerY : (height / 2);

        const startPoint = new PIXI.Point(0, y);
        const endPoint = new PIXI.Point(width, y);

        this._xFilter.start = startPoint;
        this._yFilter.start = startPoint;
        this._xFilter.end = endPoint;
        this._yFilter.end = endPoint;
    };

    /**
     * ぼかしの中央を設定する。
     * 
     * @param {number} y 中央位置
     */
    MapTiltShiftFilter.prototype.setCenterY = function(y) {
        this._centerY = y;
        this.updatePoint();
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
            set: function (value) {
                this._xFilter.gradientBlur = value;
                this._yFilter.gradientBlur = value;
            }
        },

        /**
         * プレイヤーに追従させるかどうか。
         * 
         * @returns {boolean}
         */
        playerCenter: {
            get: function() { 
                return this._isPlayerCenter; 
            },
            set: function(value) {
                this._isPlayerCenter = value;
            }
        }


    });
    //------------------------------------------------------------------------------
    // MapFilterManager
    const _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    /**
     * メインの更新処理をする。
     */
    Scene_Map.prototype.updateMain = function() {
        _Scene_Map_updateMain.call(this);
        const filter = MapFilterManager.filter(MapFilterManager.FILTER_TILTSHIFT);
        if (filter) {
            const y = $gamePlayer.screenY();
            filter.setCenterY(y);
        }
    };

    //------------------------------------------------------------------------------
    // MapFilterManager
    MapFilterManager.registerFilter(MapFilterManager.FILTER_TILTSHIFT, MapTiltShiftFilter,
        [ "blur", "gradientBlur", "playerCenter"] );
})();
