/*:ja
 * @target MZ 
 * @plugindesc フェードエフェクトの拡張
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command setNextFadeOutPattern
 * @text 次の移動/先頭開始時フェードアウト処理パターンを設定する。
 * 
 * @arg pattern
 * @text パターン
 * @desc パターンファイル名。未指定で全面一律にフェードアウトさせる。
 * @type file
 * @dir img/pictures/
 * 
 * @command setNextFadeInPattern
 * @text 次の移動/戦闘開始時フェードイン処理パターンを設定する。
 * 
 * @arg pattern
 * @text パターン
 * @desc パターンファイル名。未指定で全面一律にフェードインさせる。
 * @type file
 * @dir img/pictures/
 * 
 * 
 * 
 * 
 * @help 
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
    const pluginName = "Kapu_FadeExtends";
    // const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "setNextFadeOutPattern", args => {
        const pattern = args.pattern;
        $gameTemp.setSceneFadeOutPattern(pattern);
    });

    PluginManager.registerCommand(pluginName, "setNextFadeoutPattern", args => {
        const pattern = args.pattern;
        $gameTemp.setSceneFadeInPattern(pattern);
    });

    // TODO : Scene_Base と Spriteset_Base, Game_Screen,  を拡張する。

    //------------------------------------------------------------------------------
    // ImageFadeFilter
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
        this.uniforms.opacity = 0; // 黒の割合
    };

    /**
     * 影の割合(0-255) 0で影響なし。255で全部黒。
     * 
     * @constant {number} 
     */
     Object.defineProperty(ImageFadeFilter.prototype, "opacity", {
        configurable:true,
        enumerable:true,
        set: function(value) { this.uniforms.opacity = value.clamp(0, 255); },
        get: function() { return this.uniforms.opacity; }
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
            "void main() {" +
            "  vec4 sample = texture2D(uSampler, vTextureCoord);" +
            "  float black_alpha = clamp(1.0 - sample.a + opacity / 255.0, 0.0, 1.0);" +
            "  vec3 rgb = sample.xyz * black_alpha; " + 
            "  gl_FragColor = vec4(rgb.x, rgb.y, rgb.z, black_alpha);" +
            "}";
        return src;
    };
    //------------------------------------------------------------------------------
    // Sprite_ImageFade
    function Sprite_ImageFade() {
        this.initialize(...arguments);
    }

    Sprite_ImageFade.prototype = Object.create(Sprite.object);
    Sprite_ImageFade.prototype.constructor = Sprite_ImageFade;

    /**
     * 初期化する。
     */
    Sprite_ImageFade.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.z = -20;
        this._imageFadeFilter = new ImageFadeFilter();
        this._colorFilter = [ this._imageFadeFilter ];
    };

    /**
     * パターンを設定する。
     * 
     * @param {string} pattern パターン名
     */
    Sprite_ImageFade.prototype.setPattern = function(pattern) {
        this.bitmap = ImageManager.loadPicture(pattern);
        if (!this.bitmap.isReady()) {
            // キャッシュされていない場合、ロードされるまで待つ。
            this.bitmap.addLoadListener(this.onPatternLoad.bind(this));
        } else {
            this.onPatternLoad();
        }
    };

    /**
     * パターンが読み込まれた時の処理を行う。
     */
    Sprite_ImageFade.prototype.onPatternLoad = function() {
        if (this.bitmap && this.bitmap.isReady()) {
            // センタリングする。
            this.x = Graphcis.boxWidth / 2;
            this.y = Graphics.boxHeight / 2;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            var xratio = Graphics.boxWidth / this.bitmap.width;
            var yratio = Graphics.boxHeight / this.bitmap.height;
            this.scale.x = xratio;
            this.scale.y = yratio;
        }
    };

    /**
     * フェードの割合を設定する。
     * 
     * @param {number} opacity 黒の割合(0:透明, 255:黒)
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
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this.clearSceneFadeInPattern();
        this.clearSceneFadeOutPattern();
    };

    /**
     * フェードインさせるパターンを記述した画像ファイル名を設定する。
     * 
     * @param {string} patternFileName パターンファイル名
     */
    Game_Temp.prototype.setSceneFadeInPattern = function(patternFileName) {
        this._sceneFadeInPattern = patternFileName || null;
    }

    /**
     * フェードインさせるパターンをクリアする。
     */
    Game_Temp.prototype.clearSceneFadeInPattern = function() {
        this._sceneFadeInPattern = null;
    };

    /**
     * フェードインさせるパターンを記述した画像ファイル名を得る。
     * 
     * @returns {string} フェードインパターン名
     */
    Game_Temp.prototype.sceneFadeInPattern = function() {
        return this._sceneFadeInPattern();
    };

    /**
     * フェードアウトさせるパターンを記述した画像ファイル名を設定する。
     * 
     * @param {string} patternFileName フェードアウトパターン名
     */
    Game_Temp.prototype.setSceneFadeOutPattern = function(patternFileName) {
        this._sceneFadeOutPattern = patternFileName | null;
    };

    /**
     * フェードアウトさせるパターンをクリアする。
     */
    Game_Temp.prototype.clearSceneFadeOutPattern = function() {
        this._sceneFadeOutPattern = null;
    };

    /**
     * フェードアウトさせるパターンを記述した画像ファイル名を得る。
     * 
     * @returns {string} フェードアウトパターン名
     */
    Game_Temp.prototype.sceneFadeOutPattern = function() {
        return this._sceneFadeOutPattern();
    };

    //------------------------------------------------------------------------------
    // Scene_Base
    const _Scene_Base_initialize = Scene_Base.prototype.initialize;
    /**
     * Scene_Baseを初期化する。
     */
    Scene_Base.prototype.initialize = function() {
        _Scene_Base_initialize.call(this);
        this._patternFadeDuration = 0;
        this._patternFadeOpacity = 0;
        this._patternFadeSign = 0;
        this.createFadeSprite();
    };

    /**
     * フェード用のスプライトを作成する。
     */
    Scene_Base.prototype.createFadeSprite = function() {
        this._fadeSprite = new Sprite_ImageFade();
        this.addChild(this._fadeSprite);
    };

    const _Scene_Base_startFadeIn = Scene_Base.prototype.startFadeIn;

    /**
     * フェードインを開始する。
     * 
     * @param {number} duration フェードインにかける時間[フレーム数]
     * @param {boolean} white 白からのフェードインの場合にはtrue, 黒からのフェードインの場合にはfalse
     */
    Scene_Base.prototype.startFadeIn = function(duration, white) {
        const patternFileName = $gameTemp.sceneFadeInPattern();
        if (patternFileName) {
            $gameTemp.clearSceneFadeInPattern();
            this._fadeSprite.setPattern(patternFileName);
            this._patternFadeSign = 1;
            this._patternFadeOpacity = 255;
            this._patternFadeDuration = duration;
            this.updatePatternFade();
        } else {
            _Scene_Base_startFadeIn.call(this, duration, white);
        }
    };

    const _Scene_Base_startFadeout = Scene_Base.prototype.startFadeOut;
    /**
     * フェードアウトを開始する。
     * 
     * @param {number} duration フェードアウトにかける時間[フレーム数]
     * @param {boolean} white 白へのフェードインの場合にはtrue, 黒からのフェードインの場合にはfalse
     */
    Scene_Base.prototype.startFadeOut = function(duration, white) {
        const patternFileName = $gameTemp.sceneFadeInPattern();
        if (patternFileName) {
            $gameTemp.clearSceneFadeOutPattern();
            this._fadeSprite.setPattern(patternFileName);
            this._patternFadeSign = -1;
            this._patternFadeOpacity = 0;
            this._patternFadeDuration = duration;
            this.updatePatternFade();
        } else {
            _Scene_Base_startFadeout.call(this, duration, white);
        }
    };


    const _Scene_Base_isFading = Scene_Base.prototype.isFading;
    /**
     * フェード中かどうかを得る。
     * 
     * @returns {boolean} フェード中の場合にはtrue, それ以外はfalse
     */
    Scene_Base.prototype.isFading = function() {
        return _Scene_Base_isFading.call(this) && (this._patternFadeDuration > 0);
    };
    const _Scene_Base_update = Scene_Base.prototype.update;
    /**
     * シーンを更新する。
     */
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);
        this.updatePatternFade();
    };
    /**
     * フェードを更新する。
     */
     Scene_Base.prototype.updatePatternFade = function() {
        if (this._patternFadeDuration > 0) {
            if (this._fadeSprite.bitmap.isReady()) {
                const d = this._patternFadeDuration;
                if (this._patternFadeSign > 0) {
                    this._patternFadeOpacity -= this._patternFadeOpacity / d;
                } else {
                    this._patternFadeOpacity += (255 - this._patternFadeOpacity) / d;
                }
                this._patternFadeDuration--;
            }
        }
        this._fadeSprite.setFadeOpacity(this._patternFadeOpacity);
    };

    //------------------------------------------------------------------------------
    // Game_Screen


    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張



    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();