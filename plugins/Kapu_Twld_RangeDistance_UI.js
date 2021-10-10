/*:ja
 * @target MZ 
 * @plugindesc RangeDistanceをTwldのシステムに適用するためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Twld_BattleSystem
 * @base Kapu_RangeDistance
 * @base Kapu_Twld_UI_Menu
 * @base Kapu_Twld_UI_Status
 * @orderAfter Kapu_Twld_BattleSystem
 * @orderAfter Kapu_RangeDistance
 * @orderAfter Kapu_Twld_UI_Menu
 * @orderAfter Kapu_Twld_UI_Status
 * @orderAfter Kapu_Twld_UI_Equip
 * 
 * @param frontIconId
 * @text 前衛アイコンID
 * @desc アクターHUDに前衛状態を表すためのアイコン
 * @type number
 * @default 0
 * 
 * @param rearIconId
 * @text 後衛アイコンID
 * @desc アクターHUDに後衛状態を表すためのアイコン
 * @type number
 * @default 0
 * 
 * @param textPosition
 * @text 位置ラベル
 * @desc 「戦闘位置」として使用するラベル。
 * @type string
 * @default 位置
 * 
 * @param textFront
 * @text 前衛ラベル
 * @desc 「前衛」として使用するテキスト。
 * @type string
 * @default 前列
 * 
 * @param textRear
 * @text 後衛ラベル
 * @desc 「後衛」として使用するテキスト。
 * @type string
 * @default 後列
 * 
 * @param textRangeDistance
 * @text 射程ラベル
 * @desc 「射程」として使用するテキスト。
 * @type string
 * @default 射程
 * 
 * @param textShortRange
 * @text 短距離文字列
 * @desc 射程「短距離」として使用するテキスト
 * @type string
 * @default 近接
 * 
 * @param textMiddleRange
 * @text 中距離文字列
 * @desc 射程「中距離」として使用するテキスト
 * @type string
 * @default 中距離
 * 
 * @param textLongRange
 * @text ロングレンジ文字列
 * @desc 射程「ロングレンジ」として使用するテキスト
 * @type string
 * @default 長距離
 * 
 * @help 
 * Kapu_RangeDistanceのUI表現をKapu_BattleSystemに適用するためのプラグイン。
 * TwldBattleSystemに入れてもいいけど、
 * そうするとロジックが複雑になってデバッグが大変＆可読性が損なわれるので分離した。
 * 
 * ・アクターの前衛/後衛は指定されたアイコンをHUDの左下に表示する。
 * ・エネミーの前衛/後衛はスケールと輝度で表現する。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Twld_RangeDistance_UI";
    const parameters = PluginManager.parameters(pluginName);
    const frontIconId = Number(parameters["frontIconId"]) || 0;
    const rearIconId = Number(parameters["rearIconId"]) || 0;
    const textPosition = parameters["textPosition"] || "Position";
    const textFront = parameters["textFront"] || "Front";
    const textRear = parameters["textRear"] || "Rear";
    const textRangeDistance = parameters["textRangeDistance"] || "Range";
    //------------------------------------------------------------------------------
    // TextManager
    TextManager._rangeDistance = [];
    TextManager._rangeDistance[Game_Action.RANGE_SHORT] = parameters["textShortRange"] || "S";
    TextManager._rangeDistance[Game_Action.RANGE_MIDDLE] = parameters["textMiddleRange"] || "M";
    TextManager._rangeDistance[Game_Action.RANGE_LONG] = parameters["textLongRange"] || "L";
    TextManager.rangeDistance = function(range) {
        return this._rangeDistance[range] || "";
    };
    // Object.defineProperties(TextManager, {
    //     rangeShort:TextManager.rangeDistance(Game_Action.RANGE_SHORT),
    //     rangeMiddle:TextManager.rangeDistance(Game_Action.RANGE_MIDDLE),
    //     rangeLong:TextManager.rangeDistance(Game_Action.RANGE_LONG)
    // });
    // Object.defineProperty(TextManager, "rangeShort", { configurable:true, get:TextManager.rangeDistance(Game_Action.RANGE_SHORT)});
    // Object.defineProperty(TextManager, "rangeMiddle", { configurable:true, get:TextManager.rangeDistance(Game_Action.RANGE_SHORT)});
    // Object.defineProperty(TextManager, "rangeLong", { configurable:true, get:TextManager.rangeDistance(Game_Action.RANGE_SHORT)});

    //------------------------------------------------------------------------------
    // Sprite_PositionIcon

    /**
     * Sprite_PositionIcon。
     * 位置上表を表示するためのアイコン。
     */
    function Sprite_PositionIcon() {
        this.initialize(...arguments);
    }
    
    Sprite_PositionIcon.prototype = Object.create(Sprite.prototype);
    Sprite_PositionIcon.prototype.constructor = Sprite_PositionIcon;
    
    /**
     * Sprite_PositionIconを初期化する。
     */
    Sprite_PositionIcon.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    };
    
    /**
     * メンバーを初期化する。
     */
    Sprite_PositionIcon.prototype.initMembers = function() {
        this._battler = null;
    };
    
    /**
     * Bitmapをロードする。
     */
    Sprite_PositionIcon.prototype.loadBitmap = function() {
        this.bitmap = ImageManager.loadSystem("IconSet");
        this.setFrame(0, 0, 0, 0);
    };
    
    /*
     * このSprite_PositionIconに関連付けるGame_Battlerを設定する。
     *
     * @param {Game_Battler} battler Game_Battlerオブジェクト。
     */
    Sprite_PositionIcon.prototype.setup = function(battler) {
        if (this._battler !== battler) {
            this._battler = battler;
        }
    };
    
    /**
     * Sprite_PositionIconを更新する。
     */
    Sprite_PositionIcon.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateFrame();
    };
    
    /**
     * アイコンインデックスを得る。
     * 
     * @returns {number} アイコンインデックス。
     */
    Sprite_PositionIcon.prototype.iconIndex = function() {
        if (this._battler) {
            return (this._battler.battlePosition() === 0) ? frontIconId : rearIconId;
        } else {
            return 0;
        }
    };
    
    /**
     * フレームを更新する。
     */
    Sprite_PositionIcon.prototype.updateFrame = function() {
        const iconIndex = this.iconIndex();
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = (iconIndex % 16) * pw;
        const sy = Math.floor(iconIndex / 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    };

    //------------------------------------------------------------------------------
    // EnemyBattlePositionColorFilter
    /**
     * EnemyBattlePositionColorFilter.
     * エネミーの位置を表示に反映させるためのカラーフィルター。
     * 後列のとき、画像の上側を黒くして見えにくくする。
     */
    function EnemyBattlePositionColorFilter() {
        this.initialize(...arguments);
    }

    EnemyBattlePositionColorFilter.prototype = Object.create(PIXI.Filter.prototype);
    EnemyBattlePositionColorFilter.prototype.constructor = EnemyBattlePositionColorFilter;

    /**
     * EnemyBattlePositionColorFilterを初期化する。
     */
    EnemyBattlePositionColorFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, null, this._fragmentSrc());
        this.uniforms.shadowRate = 0;
    };
    /**
     * 影の割合を設定する。
     * 
     * @param {number} shadowRate 影の割合(0～255。255で影最大)
     */
    EnemyBattlePositionColorFilter.prototype.setShadowRate = function(shadowRate) {
        this.uniforms.shadowRate = shadowRate.clamp(0.0, 255.0);
    };
    /**
     * 影の割合を取得する。
     * 
     * @returns {number} 影の割合(0～255。255で影最大)
     */
    EnemyBattlePositionColorFilter.prototype.shadowRate = function() {
        return this.uniforms.shadowRate;
    };
    /**
     * GLSLソースを得る。
     * 
     * @returns {string} GLSLソース。
     */
    EnemyBattlePositionColorFilter.prototype._fragmentSrc = function() {
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
    // Sprite_Enemy

    const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
    /**
     * Sprite_Enemyのメンバーを初期化する。
     */
    Sprite_Enemy.prototype.initMembers = function() {
        _Sprite_Enemy_initMembers.call(this);
        this._brightness = 255;
        this._positionColorFilter = new EnemyBattlePositionColorFilter();
        if (!this.filters) {
            this.filters = [];
        }
        this.filters.push(this._positionColorFilter);
    };
    const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
    /**
     * Sprite_Enemyを更新する。
     */
    Sprite_Enemy.prototype.update = function() {
        _Sprite_Enemy_update.call(this);
        if (this._enemy) {
            this.updateBattlePosition();
        }
    };

    /**
     * 戦闘位置に関係する表示の更新をする。
     */
    Sprite_Enemy.prototype.updateBattlePosition = function() {
        const battlePosition = this._enemy.battlePosition();

        const currentScale = this.scale.x;
        const targetScale = 1.0 - battlePosition * 0.1;
        if (currentScale < targetScale) {
            const scale = Math.min(currentScale + 0.1, targetScale);
            this.scale.x = scale;
            this.scale.y = scale;
        } else if (currentScale > targetScale) {
            const scale = Math.min(currentScale - 0.1, targetScale);
            this.scale.x = scale;
            this.scale.y = scale;
        }

        let shadowRate = this._positionColorFilter.shadowRate();
        const targetShadowRate = (battlePosition === 0) ? 0 : 255;
        if (shadowRate < targetShadowRate) {
            shadowRate = Math.min(shadowRate + 10, targetShadowRate);
        } else {
            shadowRate = Math.max(shadowRate - 10, targetShadowRate);
        }
        this._positionColorFilter.setShadowRate(shadowRate);
        this.zIndex = -battlePosition;
    };

    //------------------------------------------------------------------------------
    // Sprite_BattleHudActor
    const _Sprite_BattleHudActor_initMembers = Sprite_BattleHudActor.prototype.initMembers;

    /**
     * メンバーを初期化する。
     */
    Sprite_BattleHudActor.prototype.initMembers = function() {
        _Sprite_BattleHudActor_initMembers.call(this);
        this.createPositionSprite();
    };

    /**
     * 戦闘位置表示スプライトを作成する。
     */
    Sprite_BattleHudActor.prototype.createPositionSprite = function() {
        this._positionSprite = new Sprite_PositionIcon();
        // 左下を合わせる。
        this._positionSprite.anchor.x = 0;
        this._positionSprite.anchor.y = 1.0;
        this._positionSprite.x = -(this.statusAreaWidth() / 2 - 10);
        this.addChild(this._positionSprite);
    };

    const _Sprite_BattleHudActor_onBattlerChanged = Sprite_BattleHudActor.prototype.onBattlerChanged;

    /**
     * このスプライトに関連付けるGame_Battlerが変更されたときの処理を行う。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     */
    Sprite_BattleHudActor.prototype.onBattlerChanged = function(battler) {
        _Sprite_BattleHudActor_onBattlerChanged.call(this, battler);
        this._positionSprite.setup(battler);
        this._mainSprite.y = this.mainSpritePosition().y;
    };

    const _Sprite_BattleHudActor_mainSpritePosition = Sprite_BattleHudActor.prototype.mainSpritePosition;
    /**
     * メインスプライトの位置を得る。
     * 
     * @returns {Point} スプライトの位置
     */
    Sprite_BattleHudActor.prototype.mainSpritePosition = function() {
        let pos = _Sprite_BattleHudActor_mainSpritePosition.call(this);
        if (this._actor && this._actor.battlePosition() !== 0) {
            pos.y += 20;
        } else {
            pos.y -= 10;
        }
        return pos;
    };

    const _Sprite_BattleHudActor_updatePosition = Sprite_BattleHudActor.prototype.updatePosition;
    /**
     * 表示位置を更新する。
     * 
     * 毎フレーム ホーム位置＋オフセット位置に設定される。
     */
    Sprite_BattleHudActor.prototype.updatePosition = function() {
        _Sprite_BattleHudActor_updatePosition.call(this);
        if (this._actor) {
            const targetY = this.mainSpritePosition().y;
            const currentY = this._mainSprite.y;
            if (currentY < targetY) {
                this._mainSprite.y = Math.min(currentY + 3, targetY);
            } else if (currentY > targetY) {
                this._mainSprite.y = Math.max(currentY - 3, targetY);
            }
        }
    };

    //------------------------------------------------------------------------------
    // Spriteset_Battle

    const _Spriteset_Battle_udpate = Spriteset_Battle.prototype.update;
    /**
     * Spriteset_Battle を更新する。
     */
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_udpate.call(this);
        this.updateEnemeySpriteOrder();
    };

    /**
     * エネミースプライトの順番を更新する。
     * (更新したくないけど)
     */
    Spriteset_Battle.prototype.updateEnemeySpriteOrder = function() {
        // Zインデックスによる更新をする。
        this._battleField.sortableChildren = true;
        if (this._battleField.sortableChildren) {
            this._battleField.updateTransform();
        } else {
            // zIndexとupdateTransform()が使えないなら、Sprite.swapChildrenを使って泥臭く入れ替えをやればいい。
            // まず基準になるSpriteを得る。前衛のどれかのスプライト。
            const originSprite = this._enemySprites.find(sprite => sprite.zIndex === 0);
            // 次に戦闘位置により、位置の変更が必要なら変更する。
            for (let i = 1; i < this._enemySprites.length; i++) {
                const sprite = this._enemySprites[i];
                const index = this._battleField.children.indexOf(sprite);
                const originIndex = this._battleField.children.indexOf(originSprite);
                if ((sprite.zIndex < originSprite.zIndex) && (index > originIndex)) {
                    this._battleField.swapChildren(sprite, originSprite);
                } else if ((sprite.zIndex >= originSprite.zIndex) && (index < originIndex)) {
                    this._battleField.swapChildren(sprite, originSprite);
                }
            }
        }
    };
    //------------------------------------------------------------------------------
    // Window_MenuStatus
    const _Window_MenuStatus_drawItemStatus = Window_MenuStatus.prototype.drawItemStatus;
    /**
     * 項目のステータスを描画する。
     * 
     * @param {number} index インデックス番号
     * !!!overwrite!!! Window_MenuStatus.drawItemStatus()
     */
    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        const actor = this.actor(index);
        const rect = this.statusRect(index);
        const iconX = rect.x + rect.width - ImageManager.iconWidth - 8;
        const iconY = rect.y + 10;
        const iconIndex = (actor.battlePosition() === 0) ? frontIconId : rearIconId;
        if (iconIndex) {
            this.drawIcon(iconIndex, iconX, iconY);
        }

        _Window_MenuStatus_drawItemStatus.call(this, index);
    };

    //------------------------------------------------------------------------------
    // Window_Status
    /**
     * アクターの位置を描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画領域左上X
     * @param {number} y 描画領域左上Y
     * @param {number} width 幅
     * !!!overwrite!!! Window_Status.drawActorPosition()
     *     UI標示のため、オーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Window_Status.prototype.drawActorPosition = function(actor, x, y, width) {
        const labelWidth = Math.floor(width * 0.3);
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textPosition, x, y, labelWidth);

        const iconIndex = (actor.battlePosition() === 0) ? frontIconId : rearIconId;
        if (iconIndex) {
            const iconX = x + labelWidth + 16;
            const iconY = y + 2;
            this.drawIcon(iconIndex, iconX, iconY);
        }
        const textX = x + labelWidth + 52;
        const textWidth = width - labelWidth - 52;
        const position = (actor.battlePosition() === 0) ? textFront : textRear;
        this.resetTextColor();
        const text = position + "/" + TextManager.rangeDistance(actor.attackRangeDistance());
        this.drawText(text, textX, y, textWidth);
    };

    //------------------------------------------------------------------------------
    // Window_EquipStatus
    if (Window_EquipStatus.prototype.drawBlock1C) {
        const _Window_EquipStatus_drawBlock1C = Window_EquipStatus.prototype.drawBlock1C;
        /**
         * ステータスブロック1Cを描画する。
         * 
         * @param {number} x 描画位置x
         * @param {number} y 描画位置y
         * @param {number} width 描画幅
         */
        Window_EquipStatus.prototype.drawBlock1C = function(x, y, width) {
            _Window_EquipStatus_drawBlock1C.call(this, x, y, width);
            const actor = this._actor;
            if (!actor) {
                return;
            }
            const tempActor = this._tempActor || actor;
            const lineHeight = this.lineHeight();
            this.drawRangeDistance(actor.attackRangeDistance(), tempActor.attackRangeDistance(),
                x, y + lineHeight * 7, width);
        };
        /**
         * 整数値タイプのパラメータを描画する。
         * 
         * @param {number} value1 値1（現在値）
         * @param {number} value2 値2（装備変更値）
         * @param {number} x 描画位置x
         * @param {number} y 描画位置y
         * @param {number} width 幅
         */
        Window_EquipStatus.prototype.drawRangeDistance = function(value1, value2, x, y, width) {
            if (typeof value1 === "undefined") {
                return;
            }
            const paramWidth = Math.min(this.paramWidth(), Math.floor(width * 0.3));
            const rightArrowWidth = this.rightArrowWidth();
            const spacing = 16;
            const valueWidth = (width - paramWidth - rightArrowWidth - spacing * 3) / 2;

            this.changeTextColor(ColorManager.systemColor());
            this.drawText(textRangeDistance, x, y, paramWidth);

            const value1X = x + paramWidth + spacing;
            this.resetTextColor();
            this.drawText(TextManager.rangeDistance(value1), value1X, y, valueWidth, "center");

            if (value1 === value2) {
                return;
            }
            const arrowX = value1X + valueWidth + spacing;
            this.drawRightArrow(arrowX, y);
            if (value2 >= value1) {
                this.changeTextColor(ColorManager.powerUpColor());
            } else {
                this.changeTextColor(ColorManager.powerDownColor());
            }
            const value2X = arrowX + rightArrowWidth + spacing;
            this.drawText(TextManager.rangeDistance(value2), value2X, y, valueWidth, "center");
        };
    }
})();
