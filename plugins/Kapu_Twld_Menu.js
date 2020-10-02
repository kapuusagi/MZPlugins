/*:ja
 * @target MZ 
 * @plugindesc TWLD向けメニュープラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Twld_BattleSystem
 * @orderAfter Kapu_Twld_BattleSystem
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

 function Sprite_MenuStatusActor() {
     this.initialize(...arguments);
 };
(() => {
    const pluginName = "Kapu_Twld_Menu";
    const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // ActorColorFilter
    /**
     * ActorColorFilter
     * カラーフィルター。
     */
    function ActorColorFilter() {
        this.initialize(...arguments);
    };

    ActorColorFilter.prototype = Object.create(PIXI.Filter.prototype);
    ActorColorFilter.prototype.constructor = ActorColorFilter;

    /**
     * ActorColorFilterを初期化する。
     */
    ActorColorFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, null, this._fragmentSrc());
        this.uniforms.saturation = 255;
        this.uniforms.brightness = 255;
    };

    /**
     * 色差を設定する。
     * 
     * @param {Number} saturation 色差変更値
     */
    ActorColorFilter.prototype.setSaturation = function(saturation) {
        this.uniforms.saturation = saturation.clamp(0, +255.0);
    };

    /**
     * 色差を取得する。
     * 
     * @return {Number} 色差変更値
     */
    ActorColorFilter.prototype.saturation = function() {
        return this.uniforms.saturation;
    };

    /**
     * 輝度補正値を設定する。
     * 
     * @param {Number} brightness 輝度
     */
    ActorColorFilter.prototype.setBrightness = function(brightness) {
        this.uniforms.brightness = brightness.clamp(0, 255.0);
    };

    /**
     * 輝度補正値を得る。
     * 
     * @return {Number} 輝度補正値
     */
    ActorColorFilter.prototype.brightness = function() {
        return this.uniforms.brightness;
    };

    /**
     * フラグメントシェーダーソースを得る。
     * 
     */
    ActorColorFilter.prototype._fragmentSrc = function() {
        // GLSLよくわからん。
        // gl_FragCoordはピクセル毎に更新されるっぽい。
        const src =
            "varying vec2 vTextureCoord;" +
            "uniform sampler2D uSampler;" +
            "uniform float saturation;" +
            "uniform float brightness;" +
            "vec3 rgbToHsl(vec3 rgb) {" +
            "  float r = rgb.r;" +
            "  float g = rgb.g;" +
            "  float b = rgb.b;" +
            "  float cmin = min(r, min(g, b));" +
            "  float cmax = max(r, max(g, b));" +
            "  float h = 0.0;" +
            "  float s = 0.0;" +
            "  float l = (cmin + cmax) / 2.0;" +
            "  float delta = cmax - cmin;" +
            "  if (delta > 0.0) {" +
            "    if (r == cmax) {" +
            "      h = mod((g - b) / delta + 6.0, 6.0) / 6.0;" +
            "    } else if (g == cmax) {" +
            "      h = ((b - r) / delta + 2.0) / 6.0;" +
            "    } else {" +
            "      h = ((r - g) / delta + 4.0) / 6.0;" +
            "    }" +
            "    if (l < 1.0) {" +
            "      s = delta / (1.0 - abs(2.0 * l - 1.0));" +
            "    }" +
            "  }" +
            "  return vec3(h, s, l);" +
            "}" +
            "vec3 hslToRgb(vec3 hsl) {" +
            "  float h = hsl.x;" +
            "  float s = hsl.y;" +
            "  float l = hsl.z;" +
            "  float c = (1.0 - abs(2.0 * l - 1.0)) * s;" +
            "  float x = c * (1.0 - abs((mod(h * 6.0, 2.0)) - 1.0));" +
            "  float m = l - c / 2.0;" +
            "  float cm = c + m;" +
            "  float xm = x + m;" +
            "  if (h < 1.0 / 6.0) {" +
            "    return vec3(cm, xm, m);" +
            "  } else if (h < 2.0 / 6.0) {" +
            "    return vec3(xm, cm, m);" +
            "  } else if (h < 3.0 / 6.0) {" +
            "    return vec3(m, cm, xm);" +
            "  } else if (h < 4.0 / 6.0) {" +
            "    return vec3(m, xm, cm);" +
            "  } else if (h < 5.0 / 6.0) {" +
            "    return vec3(xm, m, cm);" +
            "  } else {" +
            "    return vec3(cm, m, xm);" +
            "  }" +
            "}" +
            "void main() {" +
            "  vec4 sample = texture2D(uSampler, vTextureCoord);" +
            "  vec3 hsl = rgbToHsl(sample.rgb);" +
            "  hsl.y = clamp(hsl.y * saturation / 255.0, 0.0, 1.0);" +
            "  hsl.z = clamp(hsl.z * brightness / 255.0, 0.0, 1.0);" +
            "  vec3 rgb = hslToRgb(hsl);" +
            "  float r = rgb.r;" +
            "  float g = rgb.g;" +
            "  float b = rgb.b;" +
            "  float a = sample.a;" +
            "  gl_FragColor = vec4(r, g, b, a);" +
            "}";
        return src;
    };

    //------------------------------------------------------------------------------
    // Sprite_MenuStatusActor
    // Note : Spriteだとなんかうまくやれる気がしない。
    //        多分スクロールとかその辺で引っかかる。
    Sprite_MenuStatusActor.prototype = Object.create(Sprite.prototype);
    Sprite_MenuStatusActor.prototype.constructor = Sprite_MenuStatusActor;

    /**
     * Sprite_MenuStatusActorを初期化する。
     */
    Sprite_MenuStatusActor.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this, ...arguments);
        this.anchor.x = 0.5;
        this.anchor.y = 1.0; // 下基準
        this.x = Graphics.boxWidth; // 右端
        this.y = Graphics.boxHeight; // 下端を揃える。
        this._actor = null;
        this._pictureName = "";
        this._faceName = "";
        this._faceIndex = -1;
        this._colorFilter = new ActorColorFilter();
        this._maxFrameWidth = ImageManager.faceWidth;
        this._maxFrameHeight = 680;
        this._baseX = 0;
        this._baseY = 0;
        this.filters = [];
        this.filters.push(this._colorFilter)
    };

    /**
     * 最大サイズを設定する。
     * 
     * @param {Number} width 幅
     * @param {Number} height 高さ
     */
    Sprite_MenuStatusActor.prototype.setMaxSize = function(width, height) {
        this._maxFrameWidth = width;
        this._maxFrameHeight = height;
    };

    /**
     * ベース位置を設定する。
     * 
     * @param {Number} x X位置
     * @param {Number} y Y位置
     */
    Sprite_MenuStatusActor.prototype.setBasePosition = function(x, y) {
        this._baseX = x;
        this._baseY = y;
    };

    /**
     * このスプライトが表示するGame_Battlerを設定する。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     */
    Sprite_MenuStatusActor.prototype.setup = function(battler) {
        if (battler !== this._actor) {
            this._actor = battler;
        }
    };

    /**
     * Sprite_MenuStatusActorを更新する。
     */
    Sprite_MenuStatusActor.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updateFrame();
        this.updateOpacity();
        this.updateSaturation();
        this.updateVisibility();
        this.updatePosition();
    };

    /**
     * Bitmapを更新する。
     */
    Sprite_MenuStatusActor.prototype.updateBitmap = function() {
        if (this._actor) {
            const pictureName = this.pictureName(this._actor);
            if (pcitureName) {
                if (this._pictureName !== pictureName) {
                    this._pictureName = pictureName;
                    this._faceName = "";
                    this._faceIndex = 0;
                    this.bitmap = this.loadPicture();
                    this.opacity = this.targetOpacity();
                    this._colorFilter.setSaturation(this.targetSaturation());
                }
            } else {
                const faceName = this._actor.faceName();
                if (this._faceName !== faceName) {
                    this._pictureName = "";
                    this._faceName = faceName;
                    this._faceIndex = this._actor.faceIndex();
                    this.bitmap = this.loadFace();
                    this.opacity = 0;
                    this.opacity = this.targetOpacity();
                    this._colorFilter.setSaturation(this.targetSaturation());
                }
            }
        } else {
            this.bitmap = null;
        }
    };

    /**
     * 画像ファイル名を得る。
     * 
     * @param {Game_Battler} battler 表示するアクター
     */
    Sprite_MenuStatusActor.prototype.pictureName = function(battler) {
        if (("battlePicture" in battler) && battler.battlePicture()) {
            return battler.battlePicture();
        } else {
            return "";
        }
    };

    /**
     * Pictureをロードする。
     * 
     * @return {Bitmap} Bitmapオブジェクト。表示する画像がない場合にはnull
     */
    Sprite_MenuStatusActor.prototype.loadPicture = function() {
        if (this._pictureName) {
            try {
                return ImageManager.loadPicture(this._pictureName);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        } else {
            return null;
        }
    };

    /**
     * フレーム(表示領域)を更新する。
     */
    Sprite_MenuStatusActor.prototype.updateFrame = function() {
        if (this._bitmap) {
            if (this._pictureName) {
                const width = Math.min(this.bitmap.width, this._maxFrameWidth);
                const height = Math.min(this.bitmap.height, this._maxFrameHeight);
                const x = (this.bitmap.width - width) / 2;
                const y = (this.bitmap.height - height) / 2;
                this.setFrame(x, y, width, height);
            } else {
                const width = Math.min(ImageManager.faceWidth, this._maxFrameWidth);
                const height = Math.min(ImageManager.faceHeight, this._maxFrameHeight);
                const baseX = (this._faceIndex % 4) * ImageManager.faceWidth;
                const baseY = Math.floor(this._faceIndex / 4) * ImageManager.faceHeight;
                const xoffs = (ImageManager.faceWidth - width) / 2;
                const yoffs = (this.bitmap.height - height) / 2;
                this.setFrame(baseX + xoffs, baseY + yoffs, width, height);
            }
        }
    };

    /**
     * 透過度を更新する。
     */
    Sprite_MenuStatusActor.prototype.updateOpacity = function() {
        if (this._actor) {
            const targetOpacity = this._actor.isBattleMember() ? 255 : 168;
            const opacity = this.opacity;
            if (opacity > targetOpacity) {
                this.opacity = Math.max(opacity - 10, targetOpacity);
            } else if (opacity < targetOpacity) {
                this.opacity = Math.min(opacity + 50, targetOpacity);
            }
        }
    };

    /**
     * 表示するべき輝度を得る。
     */
    Sprite_MenuStatusActor.prototype.displayOpacity = function() {
        if (this._actor.isDead()) {
            return 128;
        } else if (this._actor.isBattleMember()) {
            return 255;
        } else {
            return 180;
        }
    };

    /**
     * 彩度を更新する。
     */
    Sprite_MenuStatusActor.prototype.updateSaturation = function() {
        if (this._actor) {
            const targetSaturation = this.targetSaturation();
            let saturation = this._colorFilter.saturation();
            if (saturation > targetSaturation) {
                saturation = Math.max(saturation - 10, targetSaturation);
            } else if (saturation < targetSaturation) {
                saturation = Math.min(saturation + 25, targetSaturation);
            }
            this._colorFilter.setSaturation(saturation);
        }
    };

    /**
     * 表示する彩度を得る。
     * 
     * @return {Number} 彩度
     */
    Sprite_MenuStatusActor.prototype.targetSaturation = function() {
        return (this._actor.isDead()) ? 0 : 255;
    };

    /**
     * 可視状態を更新する。
     */
    Sprite_MenuStatusActor.prototype.updateVisibility = function() {
        this.visible = (this._actor !== null);
    };

    /**
     * 位置を更新する。
     */
    Sprite_MenuStatusActor.prototype.updatePosition = function() {
        if (this.bitmap) {
            if (this._frame.height < this._maxFrameHeight) {
                this.y = this._baseY - (this._maxFrameHeight - this._frame.height);
            } else {
                this.y = this._baseY;
            }
        }
    };

    //------------------------------------------------------------------------------
    // Window_MenuStatus
    const _Window_MenuStatus_loadFaceImages = Window_MenuStatus.prototype.loadFaceImages;
    /**
     * 顔グラフィックをロードする。
     * 
    * 予めImageManager.loadPicture()しておくことで、
    * 描画処理時にloadFaceしてもすぐにBitmapのインスタンスにアクセルできるようにする。
     */
    Window_MenuStatus.prototype.loadFaceImages = function() {
        _Window_MenuStatus_loadFaceImages.call(this);
        // for (const actor of $gameParty.members()) {
        //     if (("profilePicture" in actor) && actor.profilePicture()) {
        //         ImageManager.loadPicture(actor.profilePicture());
        //     } else if (("battlePicture" in actor) && actor.battlePicture()) {
        //         ImageManager.loadPicture(actor.battlePicture());
        //     }
        // }
    };
    /**
     * 有効な行数を得る。
     * 
     * @return {Number} 行数
     * !!!overwrite!!! Window_MenuStatus.numVisibleRows 
     */
    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 1;
    };

    /**
     * 項目の画像を描画する。
     * 
     * @param {Number} index インデックス番号
     * !!!overwrite!!!
     */
    Window_MenuStatus.prototype.drawItemImage = function(index) {
        const actor = this.actor(index);
        if (("battlePicture" in actor) && actor.battlePicture()) {
            this.drawItemImagePicture(index, actor.battlePicture());
        } else {
            this.drawItemImageFace(index);
        }
    };

    /**
     * 項目の画像を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_MenuStatus.prototype.drawItemImage = function(index) {
        const actor = this.actor(index);
        const key = "actor" + index;
        const sprite = this.createInnerSprite(key, Sprite_MenuStatusActor);
        const rect = this.itemRect(index)
        sprite.setup(actor);
        sprite.setBasePosition(rect.x + rect.width / 2, rect.y + rect.height);
        sprite.setMaxSize(rect.width, rect.height);
        sprite.show();
        // const rect = this.itemRect(index);
        // const width = ImageManager.faceWidth;
        // const height = rect.height - 2;
        // this.changePaintOpacity(actor.isBattleMember());
        // this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
        // this.changePaintOpacity(true);
    };

    // /**
    //  * 画像を描画する。
    //  * 
    //  * @param {Number} 項目のインデックス番号
    //  * @param {String} 画像ファイル名
    //  */
    // Window_MenuStatus.prototype.drawItemImagePicture = function(index, pictureName) {
    //     const bitmap = ImageManager.loadPicture(pictureName);
    //     if (!bitmap.isReady()) {
    //         bitmap.addLoadListener(this.refresh.bind());
    //         return;
    //     }

    //     const actor = this.actor(index);




    //     const rect = this.itemRect(index);
    //     this.changePaintOpacity(actor.isBattleMember());
    //     this.drawPicture(pictureName, rect.x + 1, rect.y + 1, width, height, 'center', 'bottom');
    //     this.changePaintOpacity(true);
    // };


    //------------------------------------------------------------------------------
    // Scene_Menu
    /**
     * コマンドウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     * !!!overwrite!!! Scene_Menu.commandWindowRect
     */
    Scene_Menu.prototype.commandWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.goldWindowRect().height;
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };
    /**
     * 所持金ウィンドウを表示する矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     * !!!overwrite!!! Scene_Menu.goldWindowRect
     */
    Scene_Menu.prototype.goldWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaBottom() - wh;
        return new Rectangle(wx, wy, ww, wh);
    };
    /**
     * ステータスウィンドウを表示する矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Menu_statusWindowRect
     */
    Scene_Menu.prototype.statusWindowRect = function() {
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight();
        const wx = 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };



})();