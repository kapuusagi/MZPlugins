/*:ja
 * @target MZ 
 * @plugindesc フェードエフェクトの拡張
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Scene
 * 
 * @command setNextFadeOutPattern
 * @text 次のフェードアウト処理パターンを設定する。
 * 
 * @arg mode
 * @text 処理パターン
 * @desc フェードパターン
 * @type select
 * @option 通常
 * @value normal
 * @option パターン
 * @value pattern
 * @option ピクセレート
 * @value pixelate
 * @option ディゾルブ
 * @value dissolve
 * @default normal
 * 
 * @arg patternFile
 * @text パターン
 * @desc パターンファイル名。未指定で全面一律にフェードアウトさせる。
 * @type file
 * @dir img/fadepatterns/
 * 
 * @arg duration
 * @text フェード時間
 * @desc フェードに要する時間[フレーム数]
 * @type number
 * @default 24
 * 
 * @arg color
 * @text フェード色(R,G,B)
 * @desc フェードアウトさせる色。
 * @type number[]
 * @default [0,0,0]
 * 
 * @arg zoom
 * @text ズーム倍率
 * @desc ズーム倍率
 * @type number
 * @decimals 2
 * @default 1.00
 * 
 * 
 * @command setNextFadeInPattern
 * @text 次のフェードイン処理パターンを設定する。
 * 
 * @arg mode
 * @text 処理パターン
 * @desc フェードパターン
 * @type select
 * @option 通常
 * @value normal
 * @option パターン
 * @value pattern
 * @option ピクセレート
 * @value pixelate
 * @option ディゾルブ
 * @value dissolve
 * @default normal
 * 
 * @arg patternFile
 * @text パターン
 * @desc パターンファイル名。未指定で全面一律にフェードインさせる。
 * @type file
 * @dir img/fadepatterns/
 * 
 * @arg duration
 * @text フェード時間
 * @desc フェードに要する時間[フレーム数]
 * @type number
 * @default 24
 * 
 * @arg color
 * @text フェード色(R,G,B)
 * @desc フェードアウトさせる色。
 * @type number[]
 * @default [0,0,0]
 * 
 * @arg zoom
 * @text ズーム倍率
 * @type number
 * @decimals 2
 * @default 1.00
 * 
 * @param defaultFadeOutMode
 * @text 既定のフェードアウト処理パターン
 * @desc 既定のフェードアウトパターン
 * @type select
 * @option 通常
 * @value normal
 * @option パターン
 * @value pattern
 * @option ピクセレート
 * @value pixelate
 * @option ディゾルブ
 * @value dissolve
 * @default normal
 * 
 * @param defaultFadeOutPattern
 * @text 既定のフェードアウトパターン
 * @desc デフォルトのフェードアウトパターンを指定する。(指定なしで通常フェード)
 * @type file
 * @dir img/fadepatterns/
 * @default
 * 
 * @param defaultFadeOutDuration
 * @text 既定のフェードアウト時間
 * @desc 規定のフェードアウト時間[フレーム数]
 * @type number
 * @default 0
 * 
 * @param defaultFadeInMode
 * @text 既定のフェードイン処理パターン
 * @desc 既定のフェードインパターン
 * @type select
 * @option 通常
 * @value normal
 * @option パターン
 * @value pattern
 * @option ピクセレート
 * @value pixelate
 * @option ディゾルブ
 * @value dissolve
 * @default normal
 * 
 * @param defaultFadeInPattern
 * @text 既定のフェードインパターン
 * @desc デフォルトのフェードインパターンを指定する。(指定なしで通常フェード)
 * @type file
 * @dir img/fadepatterns/
 * @default
 * 
 * @param defaultFadeInDuration
 * @text 既定のフェードイン時間
 * @desc 既定のフェードイン時間[フレーム数]
 * @type number
 * @default 0
 * 
 * @noteDir img/fadepatterns/
 * 
 * @help 
 * フェードに画像データパターン指定によるフェードを追加します。
 * 
 * フィルタの一部は下記を元に作成しました。
 * PIXI.filter PixelateFilter
 * https://github.com/pixijs/filters/tree/main/filters/pixelate/src
 * 
 * ■ 使用時の注意
 * ディゾルブ指定時は、フェードイン前、フェードアウト後共にディゾルブ指定してください。
 * ディゾルブ時の遷移時間はフェードアウト時の遷移時間が使用されます。
 * 
 * ■ プラグイン開発者向け
 * 現在の構造だと、フェードパターンを増やす毎に Game_Screen 及び Scene_Message (マップと戦闘) の処理が重くなっていく。
 * これはあまりよろしくない。
 * フェードモード
 *   Game_Screen.FADE_MODE_NORMAL
 *     ベーシックシステムで実装されている通常のフェードパターン
 *   Game_Screen.FADE_MODE_PATTERN
 *     画像によりフェード具合を指定するパターン
 *   Game_Screen.FADE_MODE_PIXELATE
 *     ピクセレート(モザイクみたいなの)による遷移パターン
 *   Game_Screen.FADE_MODE_DISSOLVE
 *     ディゾルブによる遷移パターン
 * 
 * $gameTemp.setupNextFadeIn(pattern : object) : void
 *     次のフェードインパターンを変更する。
 *     フェードイン要求が出たときにクリアされる。
 *     patternに指定するオブジェクトは後述
 * $gameTemp.setupNextFadeOut(pattern : object) : void
 *     次のフェードアウトパターンを変更する。
 *     フェードアウト要求が出たときにクリアされる。
 *     patternに指定するオブジェクトは後述
 * patternに指定するオブジェクト
 *     {
 *         mode: {string} フェードモード。(Game_Screen.FADE_MODE～を指定する。)
 *         duration: {number} フェードにかける時間[フレーム数]
 *         color: {Array<number>} フェードする色。R,G,Bの3要素指定。
 *         (その他) modeに因る。
 *     }
 * 
 * フェードパターンを拡張するときにフィールドを追加する場合、
 * 保存されても問題ないオブジェクト(数値矢文字列)にすること。
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
 * Version.0.1.0 初版作成。
 */

(() => {
    const pluginName = "Kapu_FadeExtends";
    const parameters = PluginManager.parameters(pluginName);

    Game_Screen.FADE_MODE_NORMAL = "normal";
    Game_Screen.FADE_MODE_PATTERN = "pattern";
    Game_Screen.FADE_MODE_PIXELATE = "pixelate";
    Game_Screen.FADE_MODE_DISSOLVE = "dissolve";

    const defaultFadeOutMode = parameters["defaultFadeOutMode"] || Game_Screen.FADE_MODE_NORMAL;
    const defaultFadeOutPattern = parameters["defaultFadeOutPattern"] || "";
    const defaultFadeOutDuration = Math.round(Number(parameters["defaultFadeOutDuration"]) || 0);

    const defaultFadeInMode = parameters["defaultFadeInMode"] || Game_Screen.FADE_MODE_NORMAL;
    const defaultFadeInPattern = parameters["defaultFadeInPattern"] || "";
    const defaultFadeInDuration = Math.round(Number(parameters["defaultFadeInDuration"]) || 0);


    PluginManager.registerCommand(pluginName, "setNextFadeOutPattern", args => {
        const patternFile = args.patternFile;
        const mode = args.mode || Game_Screen.FADE_MODE_NORMAL;
        const duration = Math.round(Number(args.duration) || 0);
        const color = JSON.parse(args.color).map(token => Number(token) || 0);
        while (color.length < 3) {
            color.push(0);
        }
        const zoom = (args.zoom === undefined) ? 1.0 : Number(args.zoom);

        $gameTemp.setupNextFadeOut({
            mode: mode,
            pattern: patternFile,
            duration: duration,
            color:color,
            zoom:zoom
        });
    });

    PluginManager.registerCommand(pluginName, "setNextFadeInPattern", args => {
        const patternFile = args.patternFile;
        const mode = args.mode || Game_Screen.FADE_MODE_NORMAL;
        const duration = Math.round(Number(args.duration) || 0);
        const color = JSON.parse(args.color).map(token => Number(token) || 0);
        const zoom = (args.zoom === undefined) ? 1.0 : Number(args.zoom);
        while (color.length < 3) {
            color.push(0);
        }
        $gameTemp.setupNextFadeIn({
            mode: mode,
            pattern: patternFile,
            duration: duration,
            color:color,
            zoom:zoom
        });
    });
    //------------------------------------------------------------------------------
    // ImageManager
    /**
     * フェードパターンをロードする。
     * 
     * @param {string} filename ディレクトリ、拡張子を除いたファイル名
     * @returns {Bitmap} Bitmapオブジェクト
     */
    ImageManager.loadFadePattern = function(filename) {
        return this.loadBitmap("img/fadepatterns/", filename);
    };
    //------------------------------------------------------------------------------
    // SceneManager
    /**
     * ディゾルブ用画像用のスナップショットを更新する。
     */
    SceneManager.snapForDissolve = function() {
        if (this._dissolveBitmap) {
            this._dissolveBitmap.destroy();
        }
        this._dissolveBitmap = this.snap();
    };

    /**
     * ディゾルブ用画像を得る。
     * 
     * @returns {Bitmap} Bitmapオブジェクト
     */
    SceneManager.dissolveBitmap = function() {
        return this._dissolveBitmap;
    };

    /**
     * ディゾルブ用画像を開放する。
     */
    SceneManager.releaseDissolveBitmap = function() {
        if (this._dissolveBitmap) {
            this._dissolveBitmap.destroy();
        }
        this._dissolveBitmap = null;
    };

    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this.clearFadeInPattern();
        this.clearFadeOutPattern();
    };

    /**
     * フェードアウトさせるパターンをクリアする。
     */
    Game_Temp.prototype.clearFadeOutPattern = function() {
        this._fadeOutPattern = {
            mode: defaultFadeOutMode,
            pattern: defaultFadeOutPattern,
            duration: defaultFadeOutDuration,
            color: [0, 0, 0, 255],
            zoom:1
        }
    };

    /**
     * フェードインさせるパターンをクリアする。
     */
    Game_Temp.prototype.clearFadeInPattern = function() {
        this._fadeInPattern = {
            mode: defaultFadeInMode,
            pattern: defaultFadeInPattern,
            duration: defaultFadeInDuration,
            color: [0, 0, 0, 255],
            zoom:1
        }
    };

    /**
     * 次のフェードアウト処理に適用するパラメータを設定する。
     * 
     * @param {object} pattern フェードアウトパターン
     */
    Game_Temp.prototype.setupNextFadeOut = function(pattern) {
        this._fadeOutPattern = pattern;
    };
    /**
     * 次のフェードイン処理に適用するパラメータを設定する。
     * 
     * @param {object} pattern フェードインパターン
     */
    Game_Temp.prototype.setupNextFadeIn = function(pattern) {
        this._fadeInPattern = pattern;
    };

    /**
     * フェードインさせるパターンを得る。
     * 
     * @returns {object} フェードインパターン
     */
    Game_Temp.prototype.fadeInPattern = function() {
        return this._fadeInPattern;
    };

    /**
     * フェードアウトさせるパターンを得る。
     * 
     * @returns {string} フェードアウトパターン名
     */
    Game_Temp.prototype.fadeOutPattern = function() {
        return this._fadeOutPattern;
    };

    //------------------------------------------------------------------------------
    // PixelateFilter
    function PixelateFadeFilter() {
        this.initialize(...arguments);
    }

    PixelateFadeFilter.prototype = Object.create(PIXI.Filter.prototype);
    PixelateFadeFilter.prototype.constructor = PixelateFadeFilter;

    /**
     * PixelateFadeFilterを初期化する。
     */
    PixelateFadeFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._fragmentSrc());
        this.uniforms.size = 1.0;
        this.uniforms.areaSize = [ 1, 1 ]; // dummy.
    };

    /**
     * サイズ [x,y]
     * 
     * @constant {number}  
     */
    Object.defineProperty(PixelateFadeFilter.prototype, "size", {
        configurable:true,
        enumerable:true,
        set: function(value) {  this.uniforms.size = value; },
        get: function() { return this.uniforms.size; }
    });

    /**
     * バーテックスシェーダーのソースを得る。
     * 
     * @returns {string} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
    PixelateFadeFilter.prototype._vertexSrc = function() {
        return null;
    };
    /**
     * フラグメントシェーダのソースを得る。
     * 
     * @returns {string} フラグメントシェーダーのソース。フラグメントシェーダーがない場合にはnull
     */
    PixelateFadeFilter.prototype._fragmentSrc = function() {
        const src =
            "varying vec2 vTextureCoord;" +
            "uniform sampler2D uSampler;" +
            "uniform float size;" +
            "uniform vec2 areaSize;" +
            "" +
            "void main(void) {" +
            "    if (size > 1.0) {" +
            "        vec2 coord = vTextureCoord.xy * areaSize.xy;" +
            "        coord = floor( coord / size ) * size;" +
            "        coord /= areaSize.xy;" +
            "        gl_FragColor = texture2D(uSampler, coord);" +
            "    } else {" +
            "        gl_FragColor = texture2D(uSampler, vTextureCoord);" +
            "    }" +
            "}";
        return src;
    };

    /**
     * このフィルタの描画対象サイズを設定する。
     * 
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    PixelateFadeFilter.prototype.setAreaSize = function(width, height) {
        const curSize = this.uniforms.areaSize;
        if ((curSize[0] !== width) || (curSize[1] !== height)) {
            this.uniforms.areaSize = [ width, height];
        }
    };

    /**
     * フィルタを適用する。
     * 
     * @param {PIXI.FilterManager} filterManager 
     * @param {PIXI.RenderTexture} input 入力レンダリングターゲット
     * @param {PIXI.RenderTexture} output 出力レンダリングターゲット
     */
    PixelateFadeFilter.prototype.apply = function(filterManager, input, output) {
        PIXI.Filter.prototype.apply.call(this, filterManager, input, output);
    };
    //------------------------------------------------------------------------------
    // ImageFadeFilter
    /**
     * イメージパターンフィルタ
     * 
     */
    function ImageFadeFilter() {
        this.initialize(...arguments);
    }

    ImageFadeFilter.prototype = Object.create(PIXI.Filter.prototype);
    ImageFadeFilter.prototype.constructor = ImageFadeFilter;

    /**
     * SampleFilterを初期化する。
     */
    ImageFadeFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._fragmentSrc());
        this.uniforms.opacity = 0; // フェード色の割合
        this.uniforms.blendColor = [0, 0, 0, 255]; // 黒へのフェード
    };

    /**
     * 影の割合(0-255) 0で影響なし。255で全部黒。
     * 
     * @constant {number} 
     */
    Object.defineProperty(ImageFadeFilter.prototype, "opacity", {
        configurable:true,
        enumerable:true,
        set: function(value) { this.uniforms.opacity = value.clamp(0.0, 255.0); },
        get: function() { return this.uniforms.opacity; }
    });
    /**
     * 影の割合(0-255) 0で影響なし。255で全部黒。
     * 
     * @constant {number} 
     */
    Object.defineProperty(ImageFadeFilter.prototype, "blendColor", {
        configurable:true,
        enumerable:true,
        set: function(value) { this.uniforms.blendColor = value; },
        get: function() { return this.uniforms.blendColor; }
    });

    /**
     * バーテックスシェーダーのソースを得る。
     * 
     * @returns {string} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
    ImageFadeFilter.prototype._vertexSrc = function() {
        return null;
    };
    /**
     * フラグメントシェーダのソースを得る。
     * 
     * @returns {string} フラグメントシェーダーのソース。フラグメントシェーダーがない場合にはnull
     */
    ImageFadeFilter.prototype._fragmentSrc = function() {
        const src =
            "varying vec2 vTextureCoord;" +
            "uniform sampler2D uSampler;" +
            "uniform float opacity;" +
            "uniform vec4 blendColor;" +
            "void main() {" +
            "  vec4 sample = texture2D(uSampler, vTextureCoord);" +
            "  float alpha = clamp(opacity / 255.0 * 2.0 - sample.y, 0.0, 1.0);" +
            "  vec3 rgb = blendColor.xyz / 255.0 * alpha;" +
            "  gl_FragColor = vec4(rgb.x, rgb.y, rgb.z, alpha);" +
            "}";
        return src;
    };
    //------------------------------------------------------------------------------
    // Sprite_ImageFade
    function Sprite_ImageFade() {
        this.initialize(...arguments);
    }

    Sprite_ImageFade.prototype = Object.create(Sprite.prototype);
    Sprite_ImageFade.prototype.constructor = Sprite_ImageFade;

    /**
     * 初期化する。
     */
    Sprite_ImageFade.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._patternName = "";
        this._imageFadeFilter = new ImageFadeFilter();
        this.filters = [ this._imageFadeFilter ];
    };

    /**
     * ブレンドカラーを設定する。
     * 
     * @param {Array<number>} color カラー([R,G,B,A])
     */
    Sprite_ImageFade.prototype.setBlendColor = function(color) {
        this._imageFadeFilter.blendColor = color;
    };

    /**
     * パターンを設定する。
     * 
     * @param {string} pattern パターン名
     */
    Sprite_ImageFade.prototype.setPattern = function(pattern) {
        if (this._patternName != pattern) {
            this._patternName = pattern;
            if (this._patternName) {
                this.bitmap = ImageManager.loadFadePattern(this._patternName);
                if (!this.bitmap.isReady()) {
                    // キャッシュされていない場合、ロードされるまで待つ。
                    this.bitmap.addLoadListener(this.onPatternLoad.bind(this));
                } else {
                    this.onPatternLoad();
                }
            } else {
                this.bitmap = null;
            }
        }
    };

    /**
     * パターンが読み込まれた時の処理を行う。
     */
    Sprite_ImageFade.prototype.onPatternLoad = function() {
        if (this.bitmap && this.bitmap.isReady()) {
            // センタリングする。
            this.x = Graphics.boxWidth / 2;
            this.y = Graphics.boxHeight / 2;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            // 全体を覆うように縮小・拡大する。
            this.scale.x = (Graphics.width + 20) / this.bitmap.width;
            this.scale.y = (Graphics.height + 20) / this.bitmap.height;
        }
    };

    /**
     * フェードの割合を設定する。
     * 
     * @param {number} opacity 黒の割合(0:透明, 255:フェード色)
     */
    Sprite_ImageFade.prototype.setFadeOpacity = function(opacity) {
        this._imageFadeFilter.opacity = opacity;
    };

    /**
     * このフェードスプライトが動作可能状態かどうかを得る。
     * 
     * @returns {boolean} 動作可能な場合にはtrue, それ以外はfalse
     */
    Sprite_ImageFade.prototype.isReady = function() {
        return (this.bitmap) ? this.bitmap.isReady() : false;
    };


    //------------------------------------------------------------------------------
    // Scene_Base
    const _Scene_Base_initialize = Scene_Base.prototype.initialize;
    /**
     * Scene_Baseを初期化する。
     */
    Scene_Base.prototype.initialize = function() {
        _Scene_Base_initialize.call(this);
        this._fadePattern = {
            mode: Game_Screen.FADE_MODE_NORMAL,
            pattern: "",
            duration: 24,
            color: [0,0,0],
            zoom:1
        };
        this._fadeColor = [0,0,0,255];
        this._fadeZoomTarget = 1;
        this.createFadeLayer();
        this.createFadeSprite();
    };

    const _Scene_Base_createColorFilter = Scene_Base.prototype.createColorFilter;
    /**
     * カラーフィルタを作成する。
     */
    Scene_Base.prototype.createColorFilter = function() {
        _Scene_Base_createColorFilter.call(this);
        this._pixelateFilter = new PixelateFadeFilter();
        this.filters.push(this._pixelateFilter);
    };
    /**
     * フェード用スプライトを配置するレイヤーを作成する。
     */
    Scene_Base.prototype.createFadeLayer = function() {
        this._fadeLayer = new Sprite();
        this._fadeLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
        this._fadeLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
        this.addChild(this._fadeLayer);
    };

    /**
     * フェード用のスプライトを作成する。
     */
    Scene_Base.prototype.createFadeSprite = function() {
        this._fadeSprite = new Sprite_ImageFade();
        this._fadeLayer.addChild(this._fadeSprite);
    };

    /**
     * フェードインを開始する。
     * 
     * @param {number} duration フェードインにかける時間[フレーム数]
     * @param {boolean} white 白からのフェードインの場合にはtrue, 黒からのフェードインの場合にはfalse
     * !!!overwrite!!! Scene_Base.startFadeIn
     *     フェード機能拡張のためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Scene_Base.prototype.startFadeIn = function(duration, white) {
        this._fadePattern = $gameTemp.fadeInPattern();
        $gameTemp.clearFadeInPattern();
        this._fadeSign = 1;
        this._fadeDuration = this._fadePattern.duration || duration || 30;
        this._fadeOpacity = 255;
        this._fadeZoomTarget = this._fadePattern.zoom || 1;
        if (this._fadePattern.color) {
            const c = this._fadePattern.color;
            this._fadeColor = [c[0], c[1], c[2], 255];
        } else {
            this._fadeColor = (white) ? [255, 255, 255, 255] : [0, 0, 0, 255];
        }
        this.setupFade();
        this.updateColorFilter(); // 初期値反映
    };

    /**
     * フェードアウトを開始する。
     * 
     * @param {number} duration フェードアウトにかける時間[フレーム数]
     * @param {boolean} white 白へのフェードインの場合にはtrue, 黒からのフェードインの場合にはfalse
     * !!!overwrite!!! Scene_Base.startFadeOut()
     *     フェード機能拡張のためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Scene_Base.prototype.startFadeOut = function(duration, white) {
        this._fadePattern = $gameTemp.fadeOutPattern();
        $gameTemp.clearFadeOutPattern();
        this._fadeSign = -1;
        this._fadeDuration = this._fadePattern.duration || duration || 30;
        this._fadeOpacity = 0;
        this._fadeZoomTarget = this._fadePattern.zoom || 1;
        if (this._fadePattern.color) {
            const c = this._fadePattern.color;
            this._fadeColor = [c[0], c[1], c[2], 255];
        } else {
            this._fadeColor = (white) ? [255, 255, 255, 255] : [0, 0, 0, 255];
        }
        this.setupFade();
        this.updateColorFilter();
    };

    /**
     * フェードをセットアップする。
     */
    Scene_Base.prototype.setupFade = function() {
        switch (this._fadePattern.mode) {
            case Game_Screen.FADE_MODE_PATTERN:
                this.setupFadePattern()
                break;
            case Game_Screen.FADE_MODE_DISSOLVE:
                this.setupDissolve();
                break;
            case Game_Screen.FADE_MODE_NORMAL:
            default:
                this.setupFadeNormal();
                break;
        }
    };

    /**
     * 通常フェードをセットアップする。
     */
    Scene_Base.prototype.setupFadeNormal = function() {
        // Do nothing.
    };

    /**
     * パターンフェードをセットアップする。
     */
    Scene_Base.prototype.setupFadePattern = function() {
        const childCount = this.children.length;
        if (this.getChildIndex(this._fadeLayer) < (childCount - 1)) {
            this.removeChild(this._fadeLayer);
            this.addChild(this._fadeLayer);
        }
        this._fadeSprite.setBlendColor(this._fadeColor);
        this._fadeSprite.setPattern(this._fadePattern.pattern || "");
    };

    /**
     * ディゾルブをセットアップする。
     */
    Scene_Base.prototype.setupDissolve = function() {
        const childCount = this.children.length;
        if (this.getChildIndex(this._fadeLayer) < (childCount - 1)) {
            this.removeChild(this._fadeLayer);
            this.addChild(this._fadeLayer);
        }
        if (this._fadeSign < 0) {
            // フェードアウト
            SceneManager.hideWindowLayer();
            SceneManager.snapForDissolve();
            SceneManager.showWindowLayer();
        } else {
            // フェードイン
            const bitmap = SceneManager.dissolveBitmap();
            const sprite = new Sprite();
            sprite.x = Graphics.boxWidth / 2;
            sprite.y = Graphics.boxHeight / 2;
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.z = -20; // 手前
            sprite.bitmap = bitmap;
            this._dissolveSprite = sprite;
            this._fadeLayer.addChild(this._dissolveSprite);
        }
    };

    /**
     * フェード中かどうかを得る。
     * 
     * @returns {boolean} フェード中の場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Scene_Base_isFading()
     *     フェード処理を拡張するため、オーバーライドする。
     */
    Scene_Base.prototype.isFading = function() {
        switch (this._fadePattern) {
            case Game_Screen.FADE_MODE_NORMAL:
            case Game_Screen.FADE_MODE_PATTERN:
            case Game_Screen.FADE_MODE_PIXELATE:
            case Game_Screen.FADE_MODE_DISSOLVE:
            default:
                return this.isFadingNormal();
        }
    };

    /**
     * フェード中かどうかを得る。
     * 
     * @returns {boolean} フェード中の場合にはtrue, それ以外はfalse.
     */
    Scene_Base.prototype.isFadingNormal = function() {
        return (this._fadeDuration > 0);
    };

    /**
     * フェードを更新する。
     * !!!overwrite!!! Scene_Base.updateFade()
     *     フェード処理を更新するため、オーバーライドする。
     */
    Scene_Base.prototype.updateFade = function() {
        switch (this._fadePattern.mode) {
            case Game_Screen.FADE_MODE_PATTERN:
                this.updateFadePattern();
                break;
            case Game_Screen.FADE_MODE_DISSOLVE:
                this.updateDissolve();
                break;
            case Game_Screen.FADE_MODE_NORMAL:
            case Game_Screen.FADE_MODE_PIXELATE:
            default:
                this.updateFadeNormal();
                break;
        }
    };

    /**
     * フェードを更新する。
     */
    Scene_Base.prototype.updateFadeNormal = function() {
        if (this._fadeDuration > 0) {
            const d = this._fadeDuration;
            if (this._fadeSign > 0) { // フェードイン
                this._fadeOpacity -= this._fadeOpacity / d; // どんどん0に近づく
            } else {
                this._fadeOpacity += (255 - this._fadeOpacity) / d; // どんどん255に近づく
            }
            this._fadeDuration--;
        }
    };

    /**
     * パターンフェードを更新する。
     */
    Scene_Base.prototype.updateFadePattern = function() {
        if (this._fadeSprite.isReady()) {
            this.updateFadeNormal();
        }
    };

    /**
     * ディゾルブを更新する。
     */
    Scene_Base.prototype.updateDissolve = function() {
        if (this._fadeDuration > 0) {
            if (this._fadeSign > 0) { // フェードイン
                const d = this._fadeDuration;
                this._fadeOpacity -= this._fadeOpacity / d;
                if (this._fadeOpacity <= 0) {
                    this._fadeLayer.removeChild(this._dissolveSprite);
                    this._dissolveSprite.destroy();
                    delete this._dissolveSprite;
                    SceneManager.releaseDissolveBitmap();
                }
            } else {
                this._fadeOpacity = 255;
            }
            this._fadeDuration--;
        }
    };

    /**
     * カラーフィルタを更新する。
     * !!!overwrite!!! Scene_Base_updateColorFilter
     *     フェードの処理を拡張するためオーバーライドする。
     */
    Scene_Base.prototype.updateColorFilter = function() {
        this._pixelateFilter.setAreaSize(Graphics.boxWidth, Graphics.boxHeight);
        switch (this._fadePattern.mode) {
            case Game_Screen.FADE_MODE_PATTERN:
                this.applyFadePattern();
                break;
            case Game_Screen.FADE_MODE_PIXELATE:
                this.applyFadePixelate();
                break;
            case Game_Screen.FADE_MODE_DISSOLVE:
                this.applyDissolve();
                break;
            case Game_Screen.FADE_MODE_NORMAL:
            default:
                this.applyFadeNormal();
                break;
        }
    };

    /**
     * 通常のフェード処理を適用する。
     */
    Scene_Base.prototype.applyFadeNormal = function() {
        const c = this._fadeColor;
        const blendColor = [c[0], c[1], c[2], this._fadeOpacity];
        this._colorFilter.setBlendColor(blendColor);
        this._fadeSprite.setPattern("");

        if (this._fadeZoomTarget !== 1) {
            const zoomX = $gamePlayer.screenX();
            const zoomY = $gamePlayer.screenY() - 24;
            const scale = 1.0 + (this._fadeZoomTarget - 1.0) * this._fadeOpacity / 255.0;
            $gameScreen.setZoom(zoomX, zoomY, scale);
        }
    };

    /**
     * パターンフェードを適用する。
     */
    Scene_Base.prototype.applyFadePattern = function() {
        const c = this._fadeColor;
        const alpha = (this._fadeOpacity >= 255) ? 255 : 0;
        const blendColor = [c[0], c[1], c[2], alpha];
        this._colorFilter.setBlendColor(blendColor);
        this._fadeSprite.setFadeOpacity(this._fadeOpacity);
        if (this._fadeZoomTarget !== 1) {
            const zoomX = $gamePlayer.screenX();
            const zoomY = $gamePlayer.screenY() - 24;
            const scale = 1.0 + (this._fadeZoomTarget - 1.0) * this._fadeOpacity / 255.0;
            $gameScreen.setZoom(zoomX, zoomY, scale);
        }
    };

    /**
     * Pixelateフェードを適用する。
     */
    Scene_Base.prototype.applyFadePixelate = function() {
        const c = this._fadeColor;
        const blendColor = [c[0], c[1], c[2], this._fadeOpacity];
        this._colorFilter.setBlendColor(blendColor);
        this._fadeSprite.setPattern("");
        const value = (this._fadeOpacity / 10).clamp(1, 25);
        this._pixelateFilter.size = value;
        if (this._fadeZoomTarget !== 1) {
            const zoomX = $gamePlayer.screenX();
            const zoomY = $gamePlayer.screenY() - 24;
            const scale = 1.0 + (this._fadeZoomTarget - 1.0) * this._fadeOpacity / 255.0;
            $gameScreen.setZoom(zoomX, zoomY, scale);
        }
    };

    /**
     * Dissolveを適用する。
     */
    Scene_Base.prototype.applyDissolve = function() {
        if (this._dissolveSprite) {
            this._dissolveSprite.opacity = this._fadeOpacity;

            if (this._fadeZoomTarget !== 1) {
                const scale = 1.0 + (this._fadeZoomTarget - 1.0) * (255 - this._fadeOpacity) / 255.0;
                this._dissolveSprite.scale.x = scale;
                this._dissolveSprite.scale.y = scale;
    
                // プレイヤー中心に倍率変更するため、ズームした分だけスプライトの表示位置をずらす。
                const zoomX = $gamePlayer.screenX() - Graphics.boxWidth / 2;
                const zoomY = $gamePlayer.screenY() - 24 - Graphics.boxHeight / 2;
                this._dissolveSprite.x = Graphics.boxWidth / 2 + Math.round(-zoomX * (scale - 1));
                this._dissolveSprite.y = Graphics.boxHeight / 2 + Math.round(-zoomY * (scale - 1));            
            }
        }
    };

    //------------------------------------------------------------------------------
    // Game_Screen

    const _Game_Screen_clearFade = Game_Screen.prototype.clearFade;
    /**
     * フェード状態をクリアする。
     */
    Game_Screen.prototype.clearFade = function() {
        _Game_Screen_clearFade.call(this);
        this._fadePattern = {
            mode: Game_Screen.FADE_MODE_NORMAL,
            pattern: "",
            duration: 24,
            color: [0,0,0],
            zoom:1
        };
        this._fadeOpacity = 0; // 0でスプライトセット表示、255でfadeColorにフェードアウト
        this._fadeColor = [0,0,0,255];
        this._dissolveOpacity = 0; // ディゾルブ画像の不透明度(255で表示、0で表示完了)
        this._dissolveZoom = 1.0; // ディゾルブ画像のズーム倍率
    };

    /**
     * フェードアウトを開始する。
     * 
     * @param {number} duration フレーム数
     * !!!overwrite!!! Game_Screen.startFadeOut
     *     フェードアウトを拡張するため、オーバーライドする。
     */
    Game_Screen.prototype.startFadeOut = function(duration) {
        this._fadePattern = $gameTemp.fadeOutPattern();
        $gameTemp.clearFadeOutPattern();
        this._fadeOutDuration = this._fadePattern.duration || duration;
        this._fadeInDuration = 0;
        if (this._fadePattern.color) {
            const c = this._fadePattern.color;
            this._fadeColor = [c[0], c[1], c[2], 255];
        } else {
            this._fadeColor = [0,0,0,255];
        }
        this.setupFade();
    };

    /**
     * フェードインを開始する。
     * 
     * @param {number} duration フレーム数
     * !!!overwrite!!! Game_Screen.startFadeIn
     *     フェードアウトを拡張するため、オーバーライドする。
     */
    Game_Screen.prototype.startFadeIn = function(duration) {
        this._fadePattern = $gameTemp.fadeInPattern();
        $gameTemp.clearFadeInPattern();
        this._fadeOutDuration = 0;
        this._fadeInDuration = this._fadePattern.duration || duration;
        if (this._fadePattern.color) {
            const c = this._fadePattern.color;
            this._fadeColor = [c[0], c[1], c[2], 255];
        } else {
            this._fadeColor = [0,0,0,255];
        }
        this.setupFade();
    };

    /**
     * フェードを準備する。
     */
    Game_Screen.prototype.setupFade = function() {
        switch (this._fadePattern.mode) {
            case Game_Screen.FADE_MODE_DISSOLVE:
                this.setupDissolve();
                break;
        }
    };

    /**
     * ディゾルブを準備する。
     */
    Game_Screen.prototype.setupDissolve = function() {
        if (this._fadeOutDuration > 0) {
            SceneManager.hideWindowLayer();
            SceneManager.snapForDissolve();
            SceneManager.showWindowLayer();
            this._dissolveOpacity = 255;
            this._dissolveZoom = 1.0;
        }
    };

    /**
     * フェードパターン名を取得する。未指定時は空文字列。
     * 
     * @returns {string} フェードパターン名
     */
    Game_Screen.prototype.fadePattern = function() {
        return this._fadePattern.pattern || "";
    };

    /**
     * フェードカラーを取得する。
     * 
     * @returns {Array<number>} フェードカラー
     */
    Game_Screen.prototype.fadeColor = function() {
        return this._fadeColor;
    };

    /**
     * フェードの輝度を取得する。
     * 
     * @returns {number} フェードの輝度
     */
    Game_Screen.prototype.fadeOpacity = function() {
        return this._fadeOpacity;
    };

    const _Game_Screen_updateFadeOut = Game_Screen.prototype.updateFadeOut;
    /**
     * フェードアウト処理を更新する。
     */
    Game_Screen.prototype.updateFadeOut = function() {
        switch (this._fadePattern.mode) {
            case Game_Screen.FADE_MODE_PATTERN:
                this.updateFadeOutPattern();
                break;
            case Game_Screen.FADE_MODE_DISSOLVE:
                this.updateDissolveOut();
                break;
            case Game_Screen.FADE_MODE_PIXELATE:
            case Game_Screen.FADE_MODE_NORMAL:
            default:
                this.updateFadeOutNormal();
                break;
        }
    };

    /**
     * 通常のフェードアウト処理を更新する。
     */
    Game_Screen.prototype.updateFadeOutNormal = function() {
        const changeZoom = (this._fadeOutDuration > 0) && (this._fadePattern.zoom !== 1);
        _Game_Screen_updateFadeOut.call(this);
        if (changeZoom) {
            this._zoomX = $gamePlayer.screenX();
            this._zoomY = $gamePlayer.screenY() - 24;
            this._zoomScale = 1.0 + (this._fadePattern.zoom - 1.0) * (255 - this._brightness) / 255;
        }
    };

    /**
     * ディゾルブアウトを更新する。
     */
    Game_Screen.prototype.updateDissolveOut = function() {
        if (this._fadeOutDuration > 0) {
            this._fadeOutDuration--;
        }
    };

    /**
     * パターンでのフェードイン/アウト処理を更新する。
     */
    Game_Screen.prototype.updateFadeOutPattern = function() {
        if (this._fadeOutDuration > 0) {
            if (this.isFadePatternLoaded()) {
                const d = this._fadeOutDuration;
                this._fadeOpacity = (this._fadeOpacity * (d - 1) + 255) / d;
                this._fadeOutDuration--;
            }
            this._brightness = 255; // overallフィルタに対する輝度設定値はそのまま。
            if (this._fadePattern.zoom !== 1) {
                this._zoomX = $gamePlayer.screenX();
                this._zoomY = $gamePlayer.screenY();
                this._zoomScale = 1.0 + (this._fadePattern.zoom - 1.0) * this._fadeOpacity / 255;
            }
        }
    };

    const _Game_Screen_updateFadeIn = Game_Screen.prototype.updateFadeIn;
    /**
     * フェードイン処理を更新する。
     */
    Game_Screen.prototype.updateFadeIn = function() {
        switch (this._fadePattern.mode) {
            case Game_Screen.FADE_MODE_PATTERN:
                this.updateFadeInPattern();
                break;
            case Game_Screen.FADE_MODE_DISSOLVE:
                this.updateDissolveIn();
                break;
            case Game_Screen.FADE_MODE_PIXELATE:
            case Game_Screen.FADE_MODE_NORMAL:
            default:
                this.updateFadeInNormal();
                break;
        }
    };

    /**
     * 通常のフェードイン/アウト処理を更新する。
     */
    Game_Screen.prototype.updateFadeInNormal = function() {
        const changeZoom = (this._fadeInDuration > 0) && (this._fadePattern.zoom !== 1);
        _Game_Screen_updateFadeIn.call(this);
        if (changeZoom) {
            this._zoomX = $gamePlayer.screenX();
            this._zoomY = $gamePlayer.screenY() - 24;
            this._zoomScale = 1.0 + (this._fadePattern.zoom - 1.0) * (255 - this._brightness) / 255;
        }
    };

    /**
     * パターンでのフェードイン/アウト処理を更新する。
     */
    Game_Screen.prototype.updateFadeInPattern = function() {
        if (this._fadeInDuration > 0) {
            if (this.isFadePatternLoaded()) {
                const d = this._fadeInDuration;
                this._fadeOpacity = (this._fadeOpacity * (d - 1)) / d;
                this._fadeInDuration--;
            }
            this._brightness = 255; // overallフィルタに対する輝度設定値はそのまま。
            if (this._fadePattern.zoom !== 1) {
                this._zoomX = $gamePlayer.screenX();
                this._zoomY = $gamePlayer.screenY();
                this._zoomScale = 1.0 + (this._fadePattern.zoom - 1.0) * this._fadeOpacity / 255;
            }
        }
    };

    /**
     * ディゾルブインを更新する。
     */
    Game_Screen.prototype.updateDissolveIn = function() {
        if (this._fadeInDuration > 0) {
            const d = this._fadeInDuration;
            this._dissolveOpacity = (this._dissolveOpacity * (d - 1)) / d;
            this._dissolveZoom = 1.0 + (this._fadePattern.zoom - 1) * (255 - this._dissolveOpacity) / 255;
            this._fadeInDuration--;
        }
    };

    /**
     * フェードパターンがロードされているかどうかを得る。
     * 
     * @returns {boolean} ロードされている場合にはtrue、ロードされていない場合にはfalse.
     */
    Game_Screen.prototype.isFadePatternLoaded = function() {
        if (this._fadePattern.pattern) {
            const bitmap = ImageManager.loadFadePattern(this._fadePattern.pattern);
            return bitmap.isReady();
        } else {
            return false;
        }
    };

    /**
     * フェードが準備できているかどうかを得る。
     * 
     * @returns {boolean} フェードが準備出来ている場合にはtrue, それ以外はfalse.
     */
    Game_Screen.prototype.isFadeReady = function() {
        if (this._fadePattern.mode === Game_Screen.FADE_MODE_PATTERN) {
            return this.isFadePatternLoaded();
        } else {
            return true;
        }
    };

    /**
     * フェードモードを得る。
     * 
     * @returns {string} フェードモード。(Game_Screen.FADE_MODE_～)
     */
    Game_Screen.prototype.fadeMode = function() {
        return this._fadePattern.mode;
    };

    /**
     * フェードのPixelateサイズを得る。
     * 
     * @returns [number] Pixelateのサイズ
     */
    Game_Screen.prototype.fadePixelateSize = function() {
        if (this._fadePattern.mode === Game_Screen.FADE_MODE_PIXELATE) {
            return ((255 - this._brightness) / 10).clamp(1, 25)
        } else {
            return 1;
        }
    };

    /**
     * ディゾルブのの割合を得る。
     * 
     * @returns {number} ディゾルブの割合(0～255, 0で次の画像、255は前の画像)
     */
    Game_Screen.prototype.dissolveOpacity = function() {
        return this._dissolveOpacity;
    };

    /**
     * ディゾルブ用のズーム倍率を得る。
     * 
     * @returns {number} ズーム倍率
     */
    Game_Screen.prototype.dissolveZoom = function() {
        return this._dissolveZoom;
    };
    //------------------------------------------------------------------------------
    // Spriteset_Base
    const _Spriteset_Base_createOverallFilters = Spriteset_Base.prototype.createOverallFilters;
    /**
     * オーバーオールフィルタ(全体を覆うフィルター)を作成する。
     */
    Spriteset_Base.prototype.createOverallFilters = function() {
        _Spriteset_Base_createOverallFilters.call(this);
        this._pixelateFilter = new PixelateFadeFilter();
        this.filters.push(this._pixelateFilter);
    };

    const _Spriteset_updateOverallFilters = Spriteset_Base.prototype.updateOverallFilters;
    /**
     * オーバーオールフィルタを更新する。
     */
    Spriteset_Base.prototype.updateOverallFilters = function() {
        _Spriteset_updateOverallFilters.call(this);
        const fadePixelSize = $gameScreen.fadePixelateSize();
        this._pixelateFilter.setAreaSize(Graphics.boxWidth, Graphics.boxHeight);
        this._pixelateFilter.size = fadePixelSize;
    };
    //------------------------------------------------------------------------------
    // Scene_Message
    const _Scene_Message_createWindowLayer = Scene_Message.prototype.createWindowLayer;
    /**
     * ウィンドウレイヤーを作成する。
     */
    Scene_Message.prototype.createWindowLayer = function() {
        this.createSpritesetFadeLayer();
        _Scene_Message_createWindowLayer.call(this);
    };

    /**
     * スプライトセット用のフェードレイヤーを作成する。
     * 
     * Note：このレイヤーはWindowLayerの下に配置されるため、
     *       フェードした状態でもウィンドウは表示される。
     */
    Scene_Message.prototype.createSpritesetFadeLayer = function() {
        this._spritesetFadeLayer = new Sprite();
        this._spritesetFadeLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
        this._spritesetFadeLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
        this.addChild(this._spritesetFadeLayer);
        this._spritesetFadeSprite = new Sprite_ImageFade();
        this._spritesetFadeLayer.addChild(this._spritesetFadeSprite);
    };

    const _Scene_Message_update = Scene_Message.prototype.update;

    /**
     * Scene_Messageを更新する。
     */
    Scene_Message.prototype.update = function() {
        _Scene_Message_update.call(this);
        this.updateSpritesetFade();
        this.updateSpritesetDissolve();
    };

    /**
     * Spriteset用フェードを更新する。
     */
    Scene_Message.prototype.updateSpritesetFade = function() {
        this._spritesetFadeSprite.setPattern($gameScreen.fadePattern());
        this._spritesetFadeSprite.setFadeOpacity($gameScreen.fadeOpacity());
        this._spritesetFadeSprite.setBlendColor($gameScreen.fadeColor());
    };

    /**
     * Spriteset用ディゾルブを更新する。
     */
    Scene_Message.prototype.updateSpritesetDissolve = function() {
        const dissolveOpacity = $gameScreen.dissolveOpacity();
        if (dissolveOpacity > 0) {
            if (!this._ssetDissolveSprite) {
                this._ssetDissolveSprite = this.createDissolveSprite();
                this._spritesetFadeLayer.addChild(this._ssetDissolveSprite);
                this._ssetDissolveSprite.x = Graphics.boxWidth / 2;
                this._ssetDissolveSprite.y = Graphics.boxHeight / 2;
            }
            this._ssetDissolveSprite.opacity = dissolveOpacity;
        } else {
            if (this._ssetDissolveSprite) {
                this._spritesetFadeLayer.removeChild(this._ssetDissolveSprite);
                this._ssetDissolveSprite.destroy();
                delete this._ssetDissolveSprite;
                SceneManager.releaseDissolveBitmap();
            }
        }
        if (this._ssetDissolveSprite) {
            const scale = $gameScreen.dissolveZoom();
            this._ssetDissolveSprite.scale.x = scale;
            this._ssetDissolveSprite.scale.y = scale;
            // プレイヤー中心に倍率変更するため、ズームした分だけスプライトの表示位置をずらす。
            const zoomX = $gamePlayer.screenX() - Graphics.boxWidth / 2;
            const zoomY = $gamePlayer.screenY() - 24 - Graphics.boxHeight / 2;
            this._ssetDissolveSprite.x = Graphics.boxWidth / 2 + Math.round(-zoomX * (scale - 1));
            this._ssetDissolveSprite.y = Graphics.boxHeight / 2 + Math.round(-zoomY * (scale - 1));            
        }
    };

    /**
     * ディゾルブ用のスプライトを作成する。
     * 
     * @returns {Sprite} スプライト
     */
    Scene_Message.prototype.createDissolveSprite = function() {
        const bitmap = SceneManager.dissolveBitmap();
        const sprite = new Sprite();
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.z = -20; // 手前
        sprite.bitmap = bitmap;
        return sprite;
    };

    //------------------------------------------------------------------------------
    // Scene_Map
    const _Scene_Map_isReady = Scene_Map.prototype.isReady;
    /**
     * シーンの準備ができたかどうかを得る。
     * 
     * @returns {boolean} シーンの準備が出来ている場合にはtrue, それ以外はfalse.
     */
    Scene_Map.prototype.isReady = function() {
        return _Scene_Map_isReady.call(this) && ($gameScreen && $gameScreen.isFadeReady());
    };

    //------------------------------------------------------------------------------
    // Game_Interpreter
    
    /**
     * 画面をフェードアウトさせる。
     * 
     * @returns {boolean} コマンドを処理した場合にはtrue, それ以外はfalse.
     * !!!overwrite!!! Game_Interpreter.command221
     *     フェード完了まで待つフレーム数が変更になるためオーバーライドする。
     */
    Game_Interpreter.prototype.command221 = function() {
        if ($gameMessage.isBusy()) {
            return false;
        }
        const fadePattern = $gameTemp.fadeOutPattern();
        const duration = fadePattern.duration || this.fadeSpeed();
        $gameScreen.startFadeOut(duration);
        this.wait(duration);
        return true;
    };

    // Fadein Screen
    /**
     * 画面をフェードインさせる。
     * 
     * @returns {boolean} コマンドを処理した場合にはtrue, それ以外はfalse.
     * !!!overwrite!!! Game_Interpreter.command221
     *     フェード完了まで待つフレーム数が変更になるためオーバーライドする。
     */
    Game_Interpreter.prototype.command222 = function() {
        if ($gameMessage.isBusy()) {
            return false;
        }
        const fadePattern = $gameTemp.fadeInPattern();
        const duration = fadePattern.duration || this.fadeSpeed();
        $gameScreen.startFadeIn(duration);
        this.wait(duration);
        return true;
    };
})();