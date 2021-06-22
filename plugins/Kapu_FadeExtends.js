/*:ja
 * @target MZ 
 * @plugindesc フェードエフェクトの拡張
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command setNextFadeOutPattern
 * @text 次の移動/先頭開始時フェードアウト処理パターンを設定する。
 * 
 * @arg patternFile
 * @text パターン
 * @desc パターンファイル名。未指定で全面一律にフェードアウトさせる。
 * @type file
 * @dir img/pictures/
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
 * 
 * @command setNextFadeInPattern
 * @text 次の移動/戦闘開始時フェードイン処理パターンを設定する。
 * 
 * @arg patternFile
 * @text パターン
 * @desc パターンファイル名。未指定で全面一律にフェードインさせる。
 * @type file
 * @dir img/pictures/
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
 * 
 * @param defaultFadeOutPattern
 * @text 既定のフェードアウトパターン
 * @desc デフォルトのフェードアウトパターンを指定する。(指定なしで通常フェード)
 * @type file
 * @dir img/pictures/
 * @default
 * 
 * @param defaultFadeOutDuration
 * @text 既定のフェードアウト時間
 * @desc 規定のフェードアウト時間[フレーム数]
 * @type number
 * @default 0
 * 
 * @param defaultFadeInPattern
 * @text 既定のフェードインパターン
 * @desc デフォルトのフェードインパターンを指定する。(指定なしで通常フェード)
 * @type file
 * @dir img/pictures/
 * @default
 * 
 * @param defaultFadeInDuration
 * @text 既定のフェードイン時間
 * @desc 既定のフェードイン時間[フレーム数]
 * @type number
 * @default 0
 * 
 * @help 
 * フェードに画像データパターン指定によるフェードを追加します。
 * 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * フェードモード
 *   Game_Screen.FADE_MODE_NORMAL
 *     ベーシックシステムで実装されている通常のフェードパターン
 *   Game_Screen.FADE_MODE_PATTERN
 *     画像によりフェード具合を指定するパターン
 * 
 * $gameTemp.setFadeInPattern(pattern : object) : void
 *     次のフェードインパターンを変更する。
 *     フェードイン要求が出たときにクリアされる。
 *     patternに指定するオブジェクトは後述
 * $gameTemp.setFadeOutPattern(pattern : object) : void
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
 * Version.0.1.0 動作未確認。
 */

(() => {
    const pluginName = "Kapu_FadeExtends";
    const parameters = PluginManager.parameters(pluginName);

    Game_Screen.FADE_MODE_NORMAL = "normal";
    Game_Screen.FADE_MODE_PATTERN = "pattern";

    const defaultFadeOutPattern = parameters["defaultFadeOutPattern"] || "";
    const defaultFadeOutMode = defaultFadeOutPattern ? Game_Screen.FADE_MODE_PATTERN : Game_Screen.FADE_MODE_NORMAL;
    const defaultFadeOutDuration = Math.round(Number(parameters["defaultFadeOutDuration"]) || 0);
    const defaultFadeInPattern = parameters["defaultFadeInPattern"] || "";
    const defaultFadeInMode = defaultFadeInPattern ? Game_Screen.FADE_MODE_PATTERN : Game_Screen.FADE_MODE_NORMAL;
    const defaultFadeInDuration = Math.round(Number(parameters["defaultFadeInDuration"]) || 0);


    PluginManager.registerCommand(pluginName, "setNextFadeOutPattern", args => {
        const patternFile = args.patternFile;
        const mode = (patternFile) ? Game_Screen.FADE_MODE_PATTERN : Game_Screen.FADE_MODE_NORMAL;
        const duration = Math.round(Number(args.duration) || 0);
        const color = JSON.parse(args.color).map(token => Number(token) || 0);
        while (color.length < 3) {
            color.push(0);
        }

        $gameTemp.setFadeOutPattern({
            mode: mode,
            pattern: patternFile,
            duration: duration,
            color:color
        });
    });

    PluginManager.registerCommand(pluginName, "setNextFadeInPattern", args => {
        const patternFile = args.patternFile;
        const mode = (patternFile) ? Game_Screen.FADE_MODE_PATTERN : Game_Screen.FADE_MODE_NORMAL;
        const duration = Math.round(Number(args.duration) || 0);
        const color = JSON.parse(args.color).map(token => Number(token) || 0);
        while (color.length < 3) {
            color.push(0);
        }
        $gameTemp.setFadeInPattern({
            mode: mode,
            pattern: patternFile,
            duration: duration,
            color:color
        });
    });

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
            pattern: defaultFadeOutDuration,
            duration: defaultFadeOutDuration,
            color: [0, 0, 0, 255]
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
            color: [0, 0, 0, 255]
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
            "  float black_alpha = clamp(1.0 - sample.y + opacity / 255.0, 0.0, 1.0);" +
            "  vec3 rgb = blendColor.xyz * blend_alpha;" +
            "  gl_FragColor = vec4(rgb.x, rgb.y, rgb.z, black_alpha);" +
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
            if (this.bitmap) {
                console.log("release bitmap." + this._patternName);
                this.bitmap.destroy(); // Note:ImageManagerでloadしたやつをdestroy()していいのか？
            }
            this._patternName = pattern;
            if (this._patternName) {
                this.bitmap = ImageManager.loadPicture(pattern);
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
            this.scale.x = Graphics.boxWidth / this.bitmap.width;
            this.scale.y = Graphics.boxHeight / this.bitmap.height;
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
            color: [0,0,0]
        };
        this._fadeColor = [0,0,0,255];
        this.createFadeLayer();
        this.createFadeSprite();
    };

    /**
     * フェード用スプライトを配置するレイヤーを作成する。
     */
    Scene_Base.prototype.createFadeLayer = function() {
        this._fadeLayer = new Sprite();
        this._fadeLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
        this._fadeLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
        this.addChild(fadeLayer);
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
            case Game_Screen.FADE_MODE_NORMAL:
                this.setupfadeNormal();
                break;
            case Game_Screen.FADE_MODE_PATTERN:
                this.setupFadePattern()
                break;
            default:
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
            this.addChild(this._fadelayer);
        }
        this._fadeSprite.setBlendColor(this._fadeColor);
        this._fadeSprite.setPattern(this._fadePattern.pattern || "");
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
            case Game_Screen.FADE_MODE_NORMAL:
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
            if (this._fadeSign > 0) { // フェードイン どんどん0に近づく
                this._fadeOpacity -= this._fadeOpacity / d;
            } else { // フェードアウト どんどん255に近づく
                this._fadeOpacity += (255 - this._fadeOpacity) / d;
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
     * カラーフィルタを更新する。
     * !!!overwrite!!! Scene_Base_updateColorFilter
     *     フェードの処理を拡張するためオーバーライドする。
     */
    Scene_Base.prototype.updateColorFilter = function() {
        switch (this._fadePattern.mode) {
            case Game_Screen.FADE_MODE_PATTERN:
                this.applyFadePattern();
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
            color: [0,0,0]
        };
    };

    /**
     * パターンでのフェードインを開始する。
     * 
     * @param {number} duration フェード長さ[フレーム数]
     * @param {number} pattern パターン
     */
    Game_Screen.prototype.startFadeInWithPattern = function(duration, pattern) {
        this._fadePattern = pattern;
        this._fadeOutDuration = duration;
        this._fadeInDuration = 0;
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
        this.setupFade();
    };

    /**
     * フェードを準備する。
     */
    Game_Screen.prototype.setupFade = function() {

    };

    /**
     * フェードパターン名を取得する。未指定時は空文字列。
     * 
     * @returns {string} フェードパターン名
     */
    Game_Screen.prototype.fadePattern = function() {
        return this._fadePattern.pattern || "";
    };

    const _Game_Screen_updateFadeOut = Game_Screen.prototype.updateFadeOut;
    /**
     * フェードアウト処理を更新する。
     */
    Game_Screen.prototype.updateFadeOut = function() {
        switch (this._fadePattern.mode) {
            case Game_Screen.FADE_MODE_PATTERN:
                if (this.isFadePatternLoaded()) {
                    _Game_Screen_updateFadeOut.call(this);
                }
                break;
            case Game_Screen.FADE_MODE_NORMAL:
            default:
                _Game_Screen_updateFadeOut.call(this);
                break;
        }
    };

    const _Game_Screen_updateFadeIn = Game_Screen.prototype.updateFadeIn;
    /**
     * フェードイン処理を更新する。
     */
    Game_Screen.prototype.updateFadeIn = function() {
        switch (this._fadePattern.mode) {
            case Game_Screen.FADE_MODE_PATTERN:
                if (this.isFadePatternLoaded()) {
                    _Game_Screen_updateFadeIn.call(this);
                }
                break;
            case Game_Screen.FADE_MODE_NORMAL:
            default:
                _Game_Screen_updateFadeIn.call(this);
                break;
        }
    };

    /**
     * フェードパターンがロードされているかどうかを得る。
     * 
     * @returns {boolean} ロードされている場合にはtrue、ロードされていない場合にはfalse.
     */
    Game_Screen.prototype.isFadePatternLoaded = function() {
        if (this._fadePattern.pattern) {
            const bitmap = ImageManager.loadPicture(this._fadePattern.pattern);
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
    //------------------------------------------------------------------------------
    // Spriteset_Base
    const _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    /**
     * 上位レイヤーを構築する。
     */
    Spriteset_Base.prototype.createUpperLayer = function() {
        _Spriteset_Base_createUpperLayer.call(this);
        this.createFadeLayer();
        this.createFadeSprite();
    };
    /**
     * フェード用スプライトを配置するレイヤーを作成する。
     */
     Scene_Base.prototype.createFadeLayer = function() {
        this._fadeLayer = new Sprite();
        this.addChild(this._fadeLayer);
    };

    /**
     * フェードスプライトを生成する。
     */
    Spriteset_Base.prototype.createFadeSprite = function() {
        this._fadeSprite = new Sprite_ImageFade();
        this._fadeLayer.addChild(this._fadeSprite);
    };

    /**
     * オーバーオールフィルタを更新する。
     * 
     * !!!overwrite!!! Spriteset_Base.updateOverallFilters
     *     パターンフェード時の処理を分岐させるため、オーバーライドする。
     */
    Spriteset_Base.prototype.updateOverallFilters = function() {
        const filter = this._overallColorFilter;
        filter.setBlendColor($gameScreen.flashColor());

        const pattern = $gameScreen.fadePattern;
        if (pattern) {
            filter.setBrightness(255);
        } else {
            filter.setBrightness($gameScreen.brightness());
        }

        this._fadeSprite.setPattern(pattern);
        if (pattern) {
            this._fadeSprite.setFadeOpacity(255 - $gameScreen.brightness); // フェードパターンを描画する。
        } else {
            this._fadeSprite.setFadeOpacity(0); // 完全透過して表示させない。
        }
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
        return _Scene_Map_isReady && ($gameScreen && $gameScreen.isFadeReady());
    };
    

})();