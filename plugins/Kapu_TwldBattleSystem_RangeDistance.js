/*:ja
 * @target MZ 
 * @plugindesc RangeDistanceをTwldBattleSystemに適用するためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_BattleSystem
 * @base Kapu_RangeDistance
 * @orderAfter Kapu_BattleSystem
 * @orderAfter Kapu_RangeDistance
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
    const pluginName = "Kapu_TwldBattleSystem_RangeDistance";
    const parameters = PluginManager.parameters(pluginName);
    const frontIconId = Number(parameters['frontIconId']) || 0;
    const backIconId = Number(parameters['rearIconId']) || 0;

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
     * @return {Number} アイコンインデックス。
     */
    Sprite_PositionIcon.prototype.iconIndex = function() {
        if (this._battler) {
            return (this._battler.battlePosition() === 0) ? frontIconId : backIconId;
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
     * @param {Number} shadowRate 影の割合(0～255。255で影最大)
     */
    EnemyBattlePositionColorFilter.prototype.setShadowRate = function(shadowRate) {
        this.uniforms.shadowRate = shadowRate.clamp(0.0, 255.0);
    };
    /**
     * 影の割合を取得する。
     * 
     * @return {Number} 影の割合(0～255。255で影最大)
     */
    EnemyBattlePositionColorFilter.prototype.shadowRate = function() {
        return this.uniforms.shadowRate;
    };
    /**
     * GLSLソースを得る。
     * 
     * @return {String} GLSLソース。
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
     * @return {Point} スプライトの位置
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

})();