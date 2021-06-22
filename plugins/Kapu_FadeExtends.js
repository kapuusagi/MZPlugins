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
 * @desc フェード速度を設定する。フェードインするまで継続する。
 * 
 * @arg duration
 * @text フェード期間[フレーム数]
 * @desc フェードに要するフレーム数
 * @type number
 * @default 24
 * 
 * 
 * @param defaultFadeOutPattern
 * @text 既定のフェードアウトパターン
 * @desc デフォルトのフェードアウトパターンを指定する。(指定なしで通常フェード)
 * @type file
 * @dir img/pictures/
 * @default
 * 
 * @param defaultFadeInPattern
 * @text 既定のフェードインパターン
 * @desc デフォルトのフェードインパターンを指定する。(指定なしで通常フェード)
 * @type file
 * @dir img/pictures/
 * @default
 * 
 * @help 
 * フェードに画像データパターン指定によるフェードを追加します。
 * 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * $gameTemp.setFadeInPattern(patternFile : string) : void
 *     次のフェードインパターンを変更する。
 *     フェードイン要求が出たときにクリアされる。
 * 
 * $gameTemp.setFadeOutPattern(patternFile : string) : void
 *     次のフェードアウトパターンを変更する。
 *     フェードアウト要求が出たときにクリアされる。
 * 
 * $gameTemp.setFadeDuration(duration : number) : void
 *     次のフェードアウト-フェードインのフレーム数を変更する。
 *     フェードインした時にデフェオルトにリセットされる。
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

    const defaultFadeOutPattern = parameters["defaultFadeOutPattern"] || "";
    const defaultFadeInPattern = parameters["defaultFadeInPattern"] || "";

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
            this._patternName = pattern;
            this.bitmap = ImageManager.loadPicture(pattern);
            if (!this.bitmap.isReady()) {
                // キャッシュされていない場合、ロードされるまで待つ。
                this.bitmap.addLoadListener(this.onPatternLoad.bind(this));
            } else {
                this.onPatternLoad();
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
        this._fadeInPattern = defaultFadeInPattern;
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
        this._fadeOutPattern = defaultFadeOutPattern;
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
        this._fadeController = {
            isFading: null,
            update: null,
            apply: null
        }
        this._fadeProcedure = null;
        this._isFading = null;
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
    Scene_Base.prototype.startFadeIn = function(duration, white) {
        const patternFileName = $gameTemp.fadeInPattern();
        if (patternFileName) {
            $gameTemp.clearFadeInPattern();
            this.setupFadePattern(white, patternFileName);
        } else {
            this.setupFadeNormal();
        }
        $gameTemp.clearFadeDuration();
        this._fadeSign = 1;
        this._fadeDuration = duration || 30;
        this._fadeWhite = white;
        this._fadeOpacity = 255;
        this.updateColorFilter(); // 初期値反映
    };

    /**
     * 通常フェードをセットアップする。
     */
    Scene_Base.prototype.setupFadeNormal = function() {
        this._fadeController = {
            isFading: this.isFadingNormal.bind(this),
            update: this.updateFadeNormal.bind(this),
            apply: this.applyFadeNormal.bind(this)
        }
    };
    /**
     * パターンフェードをセットアップする。
     * 
     * @param {boolean} white 白からのフェードインまたは白へのフェードアウトの場合にはtrue, それ以外はfalse
     * @param {string} pattern パターンファイル名
     */
    Scene_Base.prototype.setupFadePattern = function(white, pattern) {
        const childCount = this.children.length;
        if (this.getChildIndex(this._fadeLayer) < (childCount - 1)) {
            this.removeChild(this._fadeLayer);
            this.addChild(this._fadelayer);
        }
        const blendColor = (white) ? [ 255, 255, 255, 255] : [0, 0, 0, 255];
        this._fadeSprite.setBlendColor(blendColor);
        this._fadeSprite.setPattern(pattern);
        this._fadeController = {
            isFading: this.isFadingNormal.bind(this),
            update: this.updateFadePattern.bind(this),
            apply: this.applyFadePattern.bind(this)
        }
    };


    /**
     * フェードアウトを開始する。
     * 
     * @param {number} duration フェードアウトにかける時間[フレーム数]
     * @param {boolean} white 白へのフェードインの場合にはtrue, 黒からのフェードインの場合にはfalse
     * !!!overwrite!!! Scene_Base.startFadeOut()
     *     フェード機能拡張のためオーバーライドする。
     */
    Scene_Base.prototype.startFadeOut = function(duration, white) {
        const patternFileName = $gameTemp.fadeOutPattern();
        if (patternFileName) {
            $gameTemp.clearFadeOutPattern();
            this.setupFadePattern(white, patternFileName);
        } else {
            this.setupFadeNormal();
        }
        this._fadeSign = -1;
        this._fadeDuration = duration || 30;
        this._fadeWhite = white;
        this._fadeOpacity = 0;
        this.updateColorFilter();
    };


    /**
     * フェード中かどうかを得る。
     * 
     * @returns {boolean} フェード中の場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Scene_Base_isFading()
     *     フェード処理を拡張するため、オーバーライドする。
     */
    Scene_Base.prototype.isFading = function() {
        return (this._fadeController.isFading) ? this._fadeController.isFading() : false;
    };

    /**
     * フェード中かどうかを得る。
     * 
     * @returns {boolean} フェード中の場合にはtrue, それ以外はfalse.
     */
    Scene_Base.prototype.isFadingNormal = function() {
        return (this._fadeDuration > 0);
    };


    const _Scene_Base_fadeSpeed = Scene_Base.prototype.fadeSpeed;
    /**
     * フェード速度を得る。
     * 
     * @return {number} フェード速度[フレーム数]
     * !!!overwrite!!! Scene_Base.fadeSpeed()
     *     フェードのフレーム時間を指定できるようにするため、オーバーライドする。
     */
    Scene_Base.prototype.fadeSpeed = function() {
        const duration = $gameTemp.fadeDuration();
        return (duration > 0) ? duration :  _Scene_Base_fadeSpeed.call(this);
    };

    /**
     * フェードを更新する。
     * !!!overwrite!!! Scene_Base.updateFade()
     *     フェード処理を更新するため、オーバーライドする。
     */
    Scene_Base.prototype.updateFade = function() {
        if (this._fadeController.update) {
            this._fadeController.update();
        }
    };

    /**
     * フェードを更新する。
     */
    Scene_Base.prototype.updateFadeNormal = function() {
        if (this._fadeDuration > 0) {
            const d = this._fadeDuration;
            if (this._fadeSign > 0) {
                this._fadeOpacity -= this._fadeOpacity / d;
            } else {
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
        if (this._fadecontroller.apply) {
            this._fadeController.apply();
        }
    };

    /**
     * 通常のフェード処理を適用する。
     */
    Scene_Base.prototype.applyFadeNormal = function() {
        const c = this._fadeWhite ? 255 : 0;
        const blendColor = [c, c, c, this._fadeOpacity];
        this._colorFilter.setBlendColor(blendColor);
    };

    /**
     * パターンフェードを適用する。
     */
    Scene_Base.prototype.applyFadePattern = function() {
        const c = this._fadeWhite ? 255 : 0;
        const alpha = (this._fadeOpacity >= 255) ? 255 : 0;
        const blendColor = [c, c, c, alpha];
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
        this._fadePattern = "";
    };

    /**
     * パターンでのフェードアウトを開始する。
     * 
     * @param {number} duration フェード長さ[フレーム数]
     * @param {number} pattern パターン
     */
    Game_Screen.prototype.startFadeOutWithPattern = function(duration, pattern) {
        this._fadePattern = pattern;
        this._fadeInDuration = duration;
        this._fadeOutDuration = 0;
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

    const _Game_Screen_startFadeOut = Game_Screen.prototype.startFadeOut;
    /**
     * フェードアウトを開始する。
     * 
     * @param {number} duration フレーム数
     */
    Game_Screen.prototype.startFadeOut = function(duration) {
        const pattern = $gameTemp.fadeOutPattern();
        if (pattern) {
            $gameTemp.clearFadeOutPattern();
            this.startFadeOutWithPattern(duration, pattern);
        } else {
            _Game_Screen_startFadeOut.call(this, duration);
            this._fadePattern = null;
        }
    };

    const _Game_Screen_startFadeIn = Game_Screen.prototype.startFadeIn;
    /**
     * フェードインを開始する。
     * 
     * @param {number} duration フレーム数
     */
    Game_Screen.prototype.startFadeIn = function(duration) {
        const pattern = $gameTemp.fadeInPattern();
        if (pattern) {
            $gameTemp.clearFadeInPattern();
            this.startFadeInWithPattern(duration, pattern);
        } else {
            _Game_Screen_startFadeIn.call(this, duration);
            this._fadePattern = null;
        }
        $gameTemp.clearFadeDuration();
    };

    /**
     * フェードパターン名を取得する。未指定時は空文字列。
     * 
     * @returns {string} フェードパターン名
     */
    Game_Screen.prototype.fadePattern = function() {
        return this._fadePattern || "";
    };

    const _Game_Screen_updateFadeOut = Game_Screen.prototype.updateFadeOut;
    /**
     * フェードアウト処理を更新する。
     */
    Game_Screen.prototype.updateFadeOut = function() {
        if (this._fadePattern && !this.isFadePatternLoaded) {
            return ;
        } else {
            _Game_Screen_updateFadeOut.call(this);
        }
    };

    const _Game_Screen_updateFadeIn = Game_Screen.prototype.updateFadeIn;
    /**
     * フェードイン処理を更新する。
     */
    Game_Screen.prototype.updateFadeIn = function() {
        if (this._fadePattern && !this.isFadePatternLoaded) {
            return;
        } else {
            _Game_Screen_updateFadeIn.call(this);
        }
    };

    /**
     * フェードパターンがロードされているかどうかを得る。
     * 
     * @returns {boolean} ロードされている場合にはtrue、ロードされていない場合にはfalse.
     */
    Game_Screen.prototype.isFadePatternLoaded = function() {
        if (this._fadePattern) {
            const bitmap = ImageManager.loadPicture(this._fadePattern);
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
        if (this._fadePattern) {
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
    //------------------------------------------------------------------------------
    // Scene_Interpreter
    
    const _Game_Interpreter_fadeSpeed = Game_Interpreter.prototype.fadeSpeed;
    /**
     * フェードイン/フェードアウトの速度を得る。
     * 
     * @returns {number} フレーム数
     */
    Game_Interpreter.prototype.fadeSpeed = function() {
        const duration = $gameTemp.fadeDuration();
        return (duration > 0) ? duration :  _Game_Interpreter_fadeSpeed.call(this);
    }
})();