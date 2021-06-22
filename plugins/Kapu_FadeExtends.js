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
 * @command setFadeSpeed
 * @text フェード速度設定
 * @desc フェード速度を設定する。リセットされるまで継続する。
 * 
 * @arg duration
 * @text フェード期間[フレーム数]
 * @desc フェードに要するフレーム数
 * @type number
 * @default 24
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
        $gameTemp.setFadeOutPattern(pattern);
    });

    PluginManager.registerCommand(pluginName, "setNextFadeInPattern", args => {
        const pattern = args.pattern;
        $gameTemp.setFadeInPattern(pattern);
    });

    PluginManager.registerCommand(pluginName, "setFadeSpeed", args => {
        const duration = Number(args.duration) || 0;
        $gameTemp.setFadeDuration(duration);
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
            "  float black_alpha = clamp(1.0 - sample.y + opacity / 255.0, 0.0, 1.0);" +
            // "  float rgb = sample.xyz * black_alpha;" + 
            "  gl_FragColor = vec4(0.0, 0.0, 0.0, black_alpha);" +
            // "  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);" +
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
        // this.z = -20;
        this._imageFadeFilter = new ImageFadeFilter();
        this.filters = [ this._imageFadeFilter ];
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
        this.clearFadeInPattern();
        this.clearFadeOutPattern();
        this.clearFadeDuration();
    };

    /**
     * フェードインさせるパターンを記述した画像ファイル名を設定する。
     * 
     * @param {string} patternFileName パターンファイル名
     */
    Game_Temp.prototype.setFadeInPattern = function(patternFileName) {
        this._fadeInPattern = patternFileName;
    }

    /**
     * フェードインさせるパターンをクリアする。
     */
    Game_Temp.prototype.clearFadeInPattern = function() {
        this._fadeInPattern = null;
    };

    /**
     * フェードインさせるパターンを記述した画像ファイル名を得る。
     * 
     * @returns {string} フェードインパターン名
     */
    Game_Temp.prototype.fadeInPattern = function() {
        return this._fadeInPattern;
    };

    /**
     * フェードアウトさせるパターンを記述した画像ファイル名を設定する。
     * 
     * @param {string} patternFileName フェードアウトパターン名
     */
    Game_Temp.prototype.setFadeOutPattern = function(patternFileName) {
        this._fadeOutPattern = patternFileName;
    };

    /**
     * フェードアウトさせるパターンをクリアする。
     */
    Game_Temp.prototype.clearFadeOutPattern = function() {
        this._fadeOutPattern = null;
    };

    /**
     * フェードアウトさせるパターンを記述した画像ファイル名を得る。
     * 
     * @returns {string} フェードアウトパターン名
     */
    Game_Temp.prototype.fadeOutPattern = function() {
        return this._fadeOutPattern;
    };

    /**
     * フェードのフレーム数を設定する。
     * 
     * @param {number} duration フレーム数
     */
    Game_Temp.prototype.setFadeDuration = function(duration) {
        this._fadeDuration = duration;
    };

    /**
     * フェードのフレーム数をクリアする。
     */
    Game_Temp.prototype.clearFadeDuration = function() {
        this._fadeDuration = 0;
    };

    /**
     * フェードのフレーム数を得る。
     * 
     * @returns {number} フレーム数
     */
    Game_Temp.prototype.fadeDuration = function() {
        return this._fadeDuration;
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
    
    };

    /**
     * フェード用のスプライトを作成する。
     */
    Scene_Base.prototype.createFadeSprite = function() {
        this._fadeSprite = new Sprite_ImageFade();
        this._fadeLayer.addChild(this._fadeSprite);
    };

    const _Scene_Base_startFadeIn = Scene_Base.prototype.startFadeIn;

    /**
     * フェードインを開始する。
     * 
     * @param {number} duration フェードインにかける時間[フレーム数]
     * @param {boolean} white 白からのフェードインの場合にはtrue, 黒からのフェードインの場合にはfalse
     */
    Scene_Base.prototype.startFadeIn = function(duration, white) {
        const patternFileName = $gameTemp.fadeInPattern();
        if (patternFileName) {
            const childCount = this.children.length;
            if (this.getChildIndex(this._fadeLayer) < (childCount - 1)) {
                this.removeChild(this._fadeLayer);
                this.addChild(this._fadelayer);
            }
            $gameTemp.clearFadeInPattern();
            this.removeChild(this._fadeSprite);
            this.addChild(this._fadeSprite);
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
        const patternFileName = $gameTemp.fadeOutPattern();
        if (patternFileName) {
            $gameTemp.clearFadeOutPattern();
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
        return _Scene_Base_isFading.call(this) || (this._patternFadeDuration > 0);
    };

    const _Scene_Base_fadeSpeed = Scene_Base.prototype.fadeSpeed;
    /**
     * フェード速度を得る。
     * 
     * @return {number} フェード速度[フレーム数]
     */
    Scene_Base.prototype.fadeSpeed = function() {
        const duration = $gameTemp.fadeDuration();
        return (duration > 0) ? duration :  _Scene_Base_fadeSpeed.call(this);
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
    // TODO : メソッドフック・拡張


})();