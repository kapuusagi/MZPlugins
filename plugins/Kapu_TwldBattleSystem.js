/*:ja
 * @target MZ 
 * @plugindesc Twld向けに作成した戦闘システムの変更
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * ■ setFvBattler
 * @command setFvBattler
 * @text アクター戦闘グラフィック設定
 * @desc 戦闘中に表示するグラフィックを設定する。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 変更するアクターのID
 * @type actor
 * 
 * @arg fileName
 * @text ファイル名
 * @desc 設定する画像ファイル
 * @type file
 * @dir pictures
 * 
 * @param maxBattleMembers
 * @text 最大戦闘参加人数
 * @desc 戦闘に参加可能な人数の最大値。
 * @default 6
 * @type number
 * @min 1
 * @max 6
 * 
 * @param ui
 * @text UI
 * 
 * @param tpbCastLabel
 * @text キャスト中ラベル
 * @desc キャスト中、TPBゲージに表示する文字。
 * @default Casting
 * @type string
 * @parent ui
 * 
 * @param labelHpFontSize
 * @text ラベルフォントサイズ
 * @desc HPゲージのラベルフォントサイズ
 * @default 24
 * @parent ui
 * 
 * @param valueHpFontSize
 * @text 値フォントサイズ
 * @desc HPゲージの値フォントサイズ
 * @default 16
 * @parent ui
 * 
 * @param labelFontSize
 * @text ラベルフォントサイズ
 * @desc ゲージのラベルフォントサイズ
 * @default 12
 * @parent ui
 * 
 * @param valueFontSize
 * @text 値フォントサイズ
 * @desc ゲージの値フォントサイズ
 * @default 12
 * @parent ui
 * 
 * @requiredAssets img/hud/ActiveHud
 * 
 * @help 
 * 
 * img/hud/ActiveHud
 *     Active状態の時に表示するイメージ
 * img/hud/StatusBackground
 *     Status背景の表示
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <fvBattlerName:pictureName$>
 *        フロントビューで表示するアクターの画像。picturesフォルダの下から引っ張ってくる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = 'Kapu_TwldBattleSystem';
    const parameters = PluginManager.parameters(pluginName);
    const maxBattleMembers = Number(parameters['maxBattleMembers']) || 4;
    const tpbCastLabel = parameters['tpbCastLabel'] || 'Casting';
    const gaugeLabelHpFontSize = parameters['labelHpFontSize'] || 16;
    const gaugeValueHpFontSize = parameters['valueHpFontSize'] || 24;
    const gaugeLabelFontSize = parameters['labelFontSize'] || 12;
    const gaugeValueFontSize = parameters['valueFontSize'] || 12;

    PluginManager.registerCommand(pluginName, 'setFvBattler', args => {
        const actorId = args.actorId;
        const fileName = args.fileName;
        if (actorId) {
            $gameActors.actor(actorId).setFvBattlerName(fileName);
        }
    });
    //------------------------------------------------------------------------------
    // Game_System
    /**
     * 戦闘システムがサイドビューかどうかを判定する。
     * TwldBattleSystemはフロントビュー固定。
     * 
     * @return {Boolean} サイドビューの場合にはtrue, それ以外はfalse
     */
    Game_System.prototype.isSideView = function() {
        return false;
    };
    //------------------------------------------------------------------------------
    // Game_Battler

    /**
     * TPBキャスト中かどうかを判定する。
     * 
     * @return {Boolean} TPBキャスト中の場合にはtrue, それ以外はfalse
     */
    Game_Battler.prototype.isTpbCasting = function() {
        return (this._tpbState === 'casting');
    };

    /**
     * TPBキャストタイムを得る。
     * 
     * @return {Number} TPBキャストタイム
     */
    Game_Battler.prototype.tpbCastTime = function() {
        return this._tpbCastTime;
    };

    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;

    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this, ...arguments);
        this._fvBattlerName = '';
    };
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, ...arguments);
        const actor = $dataActors[actorId];
        if (actor.meta.fvBattlerName) {
            this.setFvBattlerName(actor.meta.fvBattlerName);
        }
    };

    /**
     * フロントビュー戦闘グラフィックファイル名を取得する。
     * 
     * @return {String} フロントビュー戦闘グラフィックファイル名。
     */
    Game_Actor.prototype.fvBattlerName = function() {
        return this._fvBattlerName;
    };

    /**
     * フロントビュー戦闘グラフィックファイル名を設定する。
     * 
     * @param {String} pictureName フロントビュー戦闘グラフィックファイル名。
     */
    Game_Actor.prototype.setFvBattlerName = function(pictureName) {
        this._fvBattlerName = pictureName;
        $gameTemp.requestBattleRefresh();
    };

    /**
     * 戦闘グラフィックのスプライトを表示するかどうかを取得する。
     * isSpriteVisibleがtrueになっていないと、ダメージポップアップは表示されない。
     * 
     * @return {Boolean} スプライトを表示する場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isSpriteVisible = function() {
        return true;
    };

    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * 最大戦闘参加メンバー数を得る。
     * @return {Number} 最大戦闘参加メンバー数が返る。
     */
    Game_Party.prototype.maxBattleMembers = function() {
        return maxBattleMembers;
    };

    //------------------------------------------------------------------------------
    // Window_HudItemName
    /**
     * Window_HudItemName。
     * スキル/アイテム名表示用ウィンドウ。
     * 用意しないと何の対象を選択しているのかわからん。
     */
    function Window_HudItemName() {
        this.initialize(...arguments);
    }

    Window_HudItemName.prototype = Object.create(Window_Base.prototype);
    Window_HudItemName.prototype.constructor = Window_HudItemName;

    /**
     * Window_HudItemName を初期化する。
     * 
     * @param {Rectangle} rect Rectangleオブジェクト
     */
    Window_HudItemName.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._item = null;
    };

    /**
     * アイテムを設定する。
     * 
     * @param {Object} item アイテム。(DataItem/DataWeapon/DataArmor/DataSkill)
     */
    Window_HudItemName.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };

    /**
     * 表示をクリアする。
     */
    Window_HudItemName.prototype.clear = function() {
        this._item = null;
        this.refresh();
    };

    /**
     * コンテンツを再描画する。
     */
    Window_HudItemName.prototype.refresh = function() {
        const rect = this.baseTextRect();
        this.contents.clear();
        if (this._item) {
            this.drawItemName(this._item, rect.x, rect.y, rect.width);
        }
    };

    //------------------------------------------------------------------------------
    // Sprite_Gauge

    const _SpriteGauge_currentValue = Sprite_Gauge.prototype.currentValue;
    Sprite_Gauge.prototype.label = function() {
        switch (this._statusType) {
            case "hp":
                return TextManager.hpA;
            case "mp":
                return TextManager.mpA;
            case "tp":
                return TextManager.tpA;
            default:
                return "";
        }
    };

    const _Sprite_Gauge_currentValue = Sprite_Gauge.prototype.currentValue;

    /**
     * 現在値を更新する。
     * 
     */
    Sprite_Gauge.prototype.currentValue = function() {
        if (this._battler && this._statusType === 'time' && this._battler.isTpbCasting()) {
            return this._battler.tpbCastTime();
        } else {
            return _Sprite_Gauge_currentValue.call(this);
        }
    }; 

    const _Sprite_Gauge_gaugeColor1 = Sprite_Gauge.prototype.gaugeColor1;

    /**
     * ゲージカラー1を得る。
     * 
     * @return {string} カラー
     */
    Sprite_Gauge.prototype.gaugeColor1 = function() {
        if (this._battler && this._statusType === 'time' && this._battler.isTpbCasting()) {
            return ColorManager.tpGaugeColor2();
        } else {
            return _Sprite_Gauge_gaugeColor1.call(this);
        }
    };

    const _Sprite_Gauge_gaugeColor2 = Sprite_Gauge.prototype.gaugeColor2;

    /**
     * ゲージカラー2を得る。
     * 
     * @return {String} カラー
     */
    Sprite_Gauge.prototype.gaugeColor2 = function() {
        if (this._battler && this._statusType === 'time' && this._battler.isTpbCasting()) {
            return ColorManager.mpGaugeColor2();
        } else {
            return _Sprite_Gauge_gaugeColor2.call(this);
        }
    };

    /**
     * ゲージを再描画する。
     * 
     * !!!overwrite!!!
     */
    Sprite_Gauge.prototype.redraw = function() {
        this.bitmap.clear();
        const currentValue = this.currentValue();
        if (!isNaN(currentValue)) {
            this.drawGauge();
            if (this._statusType !== "time") {
                this.drawLabel();
                if (this.isValid()) {
                    this.drawValue();
                }
            } else {
                this.drawTpbTimeLabel();
            }
        }
    };

    /**
     * TPB timeゲージのラベルを描画する。
     */
    Sprite_Gauge.prototype.drawTpbTimeLabel = function() {
        const label = this.tpbTimeLabel();
        if (label === null) {
            return ;
        }
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.setupValueFont();
        this.bitmap.drawText(label, 0, 0, width, height, 'center');
    };

    /**
     * TPBタイムラベルの文字を得る。
     * 
     * @return {String} TPBタイムラベル
     */
    Sprite_Gauge.prototype.tpbTimeLabel = function() {
        if (this._battler.isTpbCasting()) {
            return tpbCastLabel;
        }
        return null;
    }

    /**
     * ゲージのフラッシュ表示を更新する。
     * 
     * !!!overwrite!!!
     */
    Sprite_Gauge.prototype.updateFlashing = function() {
        if (this._statusType === "time") {
            this._flashingCount++;
            if (this._battler.isInputting()) {
                if (this._flashingCount % 30 < 15) {
                    this.setBlendColor(this.flashingColor1());
                } else {
                    this.setBlendColor(this.flashingColor2());
                }
            } else if (this._battler.isTpbCasting()) {
                if (this._flashingCount % 30 < 15) {
                    this.setBlendColor(this.flashingCastColor1());
                } else {
                    this.setBlendColor(this.flashingCastColor2());
                }
            } else {
                this.setBlendColor([0, 0, 0, 0]);
            }
        }
    };

    /**
     * キャスト中ゲージフラッシュカラー1を得る。
     * 
     * @return {Array<Number>} フラッシュカラー1
     */
    Sprite_Gauge.prototype.flashingCastColor1 = function() {
        return [255, 255, 255, 64];
    };

    /**
     * キャスト中ゲージフラッシュカラー2を得る。
     * 
     * @return {Array<Number>} フラッシュカラー2
     */
    Sprite_Gauge.prototype.flashingCastColor2 = function() {
        return [128, 128, 128, 48];
    };

    /**
     * 値を描画する。
     * 
     * !!!overwrite!!!
     */
    Sprite_Gauge.prototype.drawValue = function() {
        const currentValue = this.currentValue();
        const maxValue = this.currentMaxValue();
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.setupValueFont();
        const txt = String(currentValue).padStart(4) + '/' + String(maxValue).padStart(4);
        this.bitmap.drawText(txt, 0, 0, width, height, "right");
    };

    //------------------------------------------------------------------------------
    // Sprite_HpGauge
    /**
     * Sprite_HpGauge
     * HPゲージ。
     */
    function Sprite_HpGauge() {
        this.initialize(...arguments);
    };

    Sprite_HpGauge.prototype = Object.create(Sprite_Gauge.prototype);
    Sprite_HpGauge.prototype.constructor = Sprite_HpGauge;

    /**
     * Sprite_HpGaugeを初期化する。
     */
    Sprite_HpGauge.prototype.initialize = function() {
        Sprite_Gauge.prototype.initialize.call(this);
    };
    /**
     * ラベルのフォントサイズを得る。
     * 
     * @return {Number} フォントサイズ
     */
    Sprite_HpGauge.prototype.labelFontSize = function() {
        return gaugeValueHpFontSize;
    };

    /**
     * ゲージ描画のX位置を取得する。
     * 
     * @return {Number} X位置
     */
    Sprite_HpGauge.prototype.gaugeX = function() {
        return 16;
    };

    /**
     * ラベルのフォントサイズを得る。
     * 
     * @return {Number} フォントサイズ
     */
    Sprite_HpGauge.prototype.labelFontSize = function() {
        return gaugeLabelHpFontSize;
    };

    /**
     * 値のフォントサイズを得る。
     * 
     * @return {Number} 値のフォントサイズ。
     */
    Sprite_HpGauge.prototype.valueFontSize = function() {
        return 24;
    };

    /**
     * 
     */
    Sprite_HpGauge.prototype.maxValueFontSize = function() {
        return valueFontSize;
    };

    /**
     * 値を描画する。
     * 
     * !!!overwrite!!!
     */
    Sprite_HpGauge.prototype.drawValue = function() {
        const currentValue = this.currentValue();
        const maxValue = this.currentMaxValue();
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.setupValueFont();
        const maxWidth = 48;
        this.bitmap.drawText(String(currentValue).padStart(4), 0, 0, width - maxWidth, height, "right");
        this.setupMaxValueFont();
        this.bitmap.drawText('/' + String(currentValue).padStart(4), width - maxWidth, 0, maxWidth, height, 'right');
    };

    /**
     * 最大値表示用フォントをセットアップする。
     */
    Sprite_HpGauge.prototype.setupMaxValueFont = function() {
        this.bitmap.fontFace = this.valueFontFace();
        this.bitmap.fontSize = this.valueFontSize() - 8;
        this.bitmap.textColor = this.valueColor();
        this.bitmap.outlineColor = this.valueOutlineColor();
        this.bitmap.outlineWidth = this.valueOutlineWidth();
    };
    //------------------------------------------------------------------------------
    // Sprite_MpTpGauge
    /**
     * Sprite_MpTpGauge。
     * MP/TPゲージ
     */
    function Sprite_MpTpGauge() {
        this.initialize(...arguments);
    };

    Sprite_MpTpGauge.prototype = Object.create(Sprite_Gauge.prototype);
    Sprite_MpTpGauge.prototype.constructor = Sprite_MpTpGauge;

    /**
     * Sprite_MpGaugeを初期化する。
     */
    Sprite_MpTpGauge.prototype.initialize = function() {
        Sprite_Gauge.prototype.initialize.call(this);
    };

    /**
     * Bitmapの幅を得る。
     * 
     * @return {Number} Bitmapの幅。
     */
    Sprite_MpTpGauge.prototype.bitmapWidth = function() {
        return 96;
    };

    /**
     * Bitmapの高さを得る。
     * 
     * @return {Number} Bitmapの高さ。
     */
    Sprite_MpTpGauge.prototype.bitmapHeight = function() {
        return 12;
    };

    /**
     * ゲージの高さを得る。
     * 
     * @return {Number} ゲージの高さ。
     */
    Sprite_MpTpGauge.prototype.gaugeHeight = function() {
        return 8;
    };

    /**
     * ラベルのフォントサイズを得る。
     * 
     * @return {Number} フォントサイズ
     */
    Sprite_MpTpGauge.prototype.labelFontSize = function() {
        return gaugeLabelFontSize;
    };

    /**
     * 値のフォントサイズを得る。
     * 
     * @return {Number} 値のフォントサイズ。
     */
    Sprite_MpTpGauge.prototype.valueFontSize = function() {
        return gaugeValueFontSize;
    };

    /**
     * ゲージ描画のX位置を取得する。
     * 
     * @return {Number} X位置
     */
    Sprite_Gauge.prototype.gaugeX = function() {
        return 16;
    };    
    //------------------------------------------------------------------------------
    // Sprite_TpbGauge
    /**
     * Sprite_TpbGauge。
     * TPBゲージ
     */
    function Sprite_TpbGauge() {
        this.initialize(...arguments);
    };

    Sprite_TpbGauge.prototype = Object.create(Sprite_Gauge.prototype);
    Sprite_TpbGauge.prototype.constructor = Sprite_TpbGauge;

    /**
     * Sprite_TpbGaugeを初期化する。
     */
    Sprite_TpbGauge.prototype.initialize = function() {
        Sprite_Gauge.prototype.initialize.call(this);
    };

    /**
     * Bitmapの幅を得る。
     * 
     * @return {Number} Bitmapの幅。
     */
    Sprite_TpbGauge.prototype.bitmapWidth = function() {
        return 96;
    };

    /**
     * Bitmapの高さを得る。
     * 
     * @return {Number} Bitmapの高さ。
     */
    Sprite_TpbGauge.prototype.bitmapHeight = function() {
        return 12;
    };

    /**
     * ゲージ描画のX位置を取得する。
     * 
     * @return {Number} X位置
     */
    Sprite_TpbGauge.prototype.gaugeX = function() {
        return 0;
    };

    /**
     * ゲージの高さを得る。
     * 
     * @return {Number} ゲージの高さ。
     */
    Sprite_TpbGauge.prototype.gaugeHeight = function() {
        return 8;
    };

    /**
     * ラベルのフォントサイズを得る。
     * 
     * @return {Number} フォントサイズ
     */
    Sprite_TpbGauge.prototype.labelFontSize = function() {
        return gaugeLabelFontSize;
    };

    /**
     * 値のフォントサイズを得る。
     * 
     * @return {Number} 値のフォントサイズ。
     */
    Sprite_TpbGauge.prototype.valueFontSize = function() {
        return gaugeValueFontSize;
    };
    //------------------------------------------------------------------------------
    // Sprite_ActorName

    /**
     * Sprite_ActorName。
     */
    function Sprite_ActorName() {
        this.initialize(...arguments);
    };

    Sprite_ActorName.prototype = Object.create(Sprite_Name.prototype);
    Sprite_ActorName.prototype.constructor = Sprite_ActorName;

    Sprite_ActorName.prototype.initialize = function() {
        Sprite_Name.prototype.initialize.call(this);
    };

    /**
     * ビットマップの高さを得る。
     * 
     * @return {Number} Bitmapの高さ
     */
    Sprite_ActorName.prototype.bitmapHeight = function() {
        return 18;
    };    
    /**
     * Sprite_Nameの名前表示用フォントサイズを得る。
     * 
     * @return {Number} 名前表示用フォントサイズ。
     */
    Sprite_ActorName.prototype.fontSize = function() {
        return 16;
    };

    //------------------------------------------------------------------------------
    // Sprite_HudStateIcons
    function Sprite_HudStateIcons() {
        this.initialize(...arguments);
    };

    Sprite_HudStateIcons.prototype = Object.create(Sprite.prototype);
    Sprite_HudStateIcons.prototype.constructor = Sprite_HudStateIcons;

    Sprite_HudStateIcons.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    };

    Sprite_HudStateIcons.prototype.initMembers = function() {
        this._battler = null;
        this._animationCount = 0;
        this._iconIndex = 0;
        this.anchor.x = 0;
        this.anchor.y = 0.5;
    };

    Sprite_HudStateIcons.prototype.destroy = function() {
        Sprite.prototype.destroy.call(this);
        if (this._iconBitmap) {
            this._iconBitmap.destroy();
        }
    };

    Sprite_HudStateIcons.prototype.loadBitmap = function() {
        this.bitmap = new Bitmap(ImageManager.iconWidth * 4 + 6, ImageManager.iconHeight);
        this._iconBitmap = ImageManager.loadSystem("IconSet");
    };

    Sprite_HudStateIcons.prototype.setup = function(battler) {
        if (this._battler !== battler) {
            this._battler = battler;
            this._animationCount = this.animationWait();
        }
    };

    Sprite_HudStateIcons.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updateIcon();
            this._animationCount = 0;
        }
    };

    Sprite_HudStateIcons.prototype.animationWait = function() {
        return 40;
    };

    Sprite_HudStateIcons.prototype.updateIcon = function() {
        const icons = [];
        if (this.shouldDisplay()) {
            icons.push(...this._battler.allIcons());
        }
        this.bitmap.clear();
        if (icons.length > 0) {
            this._iconIndex += 4;
            if (this._iconIndex > icons.length) {
                this._iconIndex = 0;
            }
            for (let i = 0; i < 4; i++) {
                const iconIndex = icons[this._iconIndex + i];
                if (iconIndex) {
                    this.drawIcon(iconIndex, i);
                }
            }

        } else {
            this._animationIndex = 0;
        }
    };

    Sprite_HudStateIcons.prototype.drawIcon = function(iconIndex, drawIndex) {
        // 所定のアイコンをbltでコピーしていく。
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = (iconIndex % 16) * pw;
        const sy = Math.floor(iconIndex / 16) * ph;
        const dx = (pw + 2) * drawIndex;
        const dy = 0;
        this.bitmap.blt(this._iconBitmap, sx, sy, pw, ph, dx, dy);
    };

    Sprite_HudStateIcons.prototype.shouldDisplay = function() {
        const battler = this._battler;
        return battler && (battler.isActor() || battler.isAlive());
    };


    //------------------------------------------------------------------------------
    // Sprite_ActorHud

    /**
     * Sprite_ActorHud
     * 
     * アクター情報を表示するHUD。
     */
    function Sprite_ActorHud() {
        this.initialize(...arguments);
    };

    Sprite_ActorHud.prototype = Object.create(Sprite_Battler.prototype);
    Sprite_ActorHud.prototype.constructor = Sprite_ActorHud;

    /**
     * Sprite_ActorHudを初期化する。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト。
     */
    Sprite_ActorHud.prototype.initialize = function(battler) {
        Sprite_Battler.prototype.initialize.call(this, battler);
        this._actor = null;
        this._faceName = null;
        this._faceIndex = -1;
        this._activeSelAdd = 2;
        this.setFrame(0, 0, statusAreaWidth, statusAreaHeight);
    };

    /**
     * メンバーを初期化する。
     */
    Sprite_ActorHud.prototype.initMembers = function() {
        Sprite_Battler.prototype.initMembers.call(this);
        this.createActiveSelSprite();
        this.createFvBattlerSprite();
        this.createStatusBackSprite();
        this.createNameSprite();
        this.createGaugeSprites();
        this.createStateIconSprite();
    };

    /**
     * 入力アクティブになったときに表示するスプライトをロードする。
     */
    Sprite_ActorHud.prototype.createActiveSelSprite = function() {
        this._activeSelSprite = new Sprite();
        try {
            this._activeSelSprite.bitmap = ImageManager.loadBitmap('img/hud/', 'ActiveHud');
            this._activeSelSprite.x = 0;
            this._activeSelSprite.y = 6;
        }
        catch (e) {
            this._activeSelSprite.x = 0;
            this._activeSelSprite.y = 0;
        }
        this._activeSelSprite.anchor.x = 0.5;
        this._activeSelSprite.anchor.y = 1;
        this._activeSelSprite.opacity = 0;
        this.addChild(this._activeSelSprite);
    };

    /**
     * FVアクタースプライトを作成する。
     */
    Sprite_ActorHud.prototype.createFvBattlerSprite = function() {
        this._mainSprite = new Sprite();
        this._mainSprite.anchor.x = 0.5; // 原点XはSprite中央
        this._mainSprite.anchor.y = 1; // 原点YはSprite下端
        this.addChild(this._mainSprite);
    };

    /**
     * ステータスの背景に表示するスプライトを作成する。
     */
    Sprite_ActorHud.prototype.createStatusBackSprite = function() {
        this._statusBackSprite = new Sprite();
        this._statusBackSprite.bitmap = ImageManager.loadBitmap('img/hud/', 'StatusBackground')
        this._statusBackSprite.anchor.x = 0.5;
        this._statusBackSprite.anchor.y = 1;
        this._statusBackSprite.x = 0;
        this._statusBackSprite.y = 16;
        this._statusBackSprite.opacity = 128;
        this.addChild(this._statusBackSprite);
    };

    /**
     * アクター名スプライトを作成する。
     */
    Sprite_ActorHud.prototype.createNameSprite = function() {
        const sprite = new Sprite_ActorName();
        sprite.x = -statusAreaWidth / 2;
        sprite.y = -88;
        this._nameSprite = sprite;
        this.addChild(this._nameSprite);
    };

    /**
     * ゲージスプライトを作成する。
     */
    Sprite_ActorHud.prototype.createGaugeSprites = function() {
        // HPゲージ
        this._hpGaugeSprite = new Sprite_HpGauge();
        this._hpGaugeSprite.x = -64;
        this._hpGaugeSprite.y = -72;
        this.addChild(this._hpGaugeSprite);

        // MPゲージ
        this._mpGaugeSprite = new Sprite_MpTpGauge();
        this._mpGaugeSprite.x = -32;
        this._mpGaugeSprite.y = -48;
        this.addChild(this._mpGaugeSprite);

        // TPゲージ
        this._tpGaugeSprite = new Sprite_MpTpGauge();
        this._tpGaugeSprite.x = -32;
        this._tpGaugeSprite.y = -32;
        this.addChild(this._tpGaugeSprite);

        // TPBゲージ
        this._tpbGaugeSprite = new Sprite_TpbGauge();
        this._tpbGaugeSprite.x = -32;
        this._tpbGaugeSprite.y = -16;
        this.addChild(this._tpbGaugeSprite);
        if (!BattleManager.isTpb()) {
            // ターン制の場合にはTPBゲージを表示しない。
            this._tpbGaugeSprite.visible = false;
        }
    };

    /**
     * ステータスアイコンスプライトを作成する。
     */
    Sprite_ActorHud.prototype.createStateIconSprite = function() {
        const sprite = new Sprite_HudStateIcons();
        sprite.x = -(statusAreaWidth / 2);
        sprite.y = -statusAreaHeight;
        this._stateIconSprite = sprite;
        this.addChild(sprite);
    };



    /**
     * メインのスプライトを取得する。
     * 
     * @return {Sprite} メインのスプライト
     */
    Sprite_ActorHud.prototype.mainSprite = function() {
        return this._mainSprite;
    };

    /**
     * このスプライトに関連付けるGame_Battlerオブジェクトを構築する。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト。
     */
    Sprite_ActorHud.prototype.setBattler = function(battler) {
        Sprite_Battler.prototype.setBattler.call(this, battler);
        if (battler !== this._actor) {
            this._actor = battler;
            if (battler) {
                this.setHudPosition(battler.index());
                this._nameSprite.setup(battler);
                this._hpGaugeSprite.setup(battler, 'hp');
                this._mpGaugeSprite.setup(battler, 'mp');
                this._tpGaugeSprite.setup(battler, 'tp');
                this._tpbGaugeSprite.setup(battler, 'time');
                this._stateIconSprite.setup(battler);
            } else {
                this._mainSprite.bitmap = null;
            }
        }
    };

    /**
     * このスプライトに関連付けられているGame_Actorオブジェクトを取得する。
     * 
     * @return {Game_Actor} Game_Actorオブジェクト。関連付けられていない場合にはnull.
     */
    Sprite_ActorHud.prototype.actor = function() {
        return this._actor;
    };

    const statusAreaWidth = 160;
    const statusAreaPadding = 16;
    const statusAreaHeight = 220;
    const statusPictureLeftY = 40;

    /**
     * HUDの位置を得る。
     * 
     * @param {Number} index 位置
     */
    Sprite_ActorHud.prototype.setHudPosition = function(index) {
        const battleMemberCount = $gameParty.battleMembers().length;
        const totalStatusAreaWidth = statusAreaWidth * battleMemberCount + statusAreaPadding + (battleMemberCount - 1);
        const baseX = (Graphics.boxWidth - totalStatusAreaWidth) / 2
        const offsetX = (statusAreaWidth + statusAreaPadding) * index;
        const x = baseX + offsetX + statusAreaWidth / 2;
        const y = Graphics.boxHeight;
        this.setHome(x, y);
    };

    /**
     * HUDを更新する。
     */
    Sprite_ActorHud.prototype.update = function() {
        Sprite_Battler.prototype.update.call(this);
        this.updateSelecting();
    };

    /**
     * 選択状態表示を更新する。
     */
    Sprite_ActorHud.prototype.updateSelecting = function() {
        if (this._battler && this._battler.isInputting()) {
            this._activeSelSprite.opacity += this._activeSelAdd;
            if (this._activeSelSprite.opacity >= 128) {
                this._activeSelSprite.opacity = 128;
                this._activeSelAdd = -2;
            } else if (this._activeSelSprite.opacity <= 32) {
                this._activeSelSprite.opacity = 32;
                this._activeSelAdd = 2;
            }
        } else {
            this._activeSelCount = 0;
            this._activeSelSprite.opacity = 0;
        }
    };

    /**
     * このSpriteの可視状態を更新する。
     */
    Sprite_ActorHud.prototype.updateVisibility = function() {
        Sprite_Battler.prototype.updateVisibility.call(this);
        if (this._battler && this._battler.isInputting()) {
            this._activeSelSprite.visible = true;
        } else {
            this._activeSelSprite.visible = false;
        }
    };

    /**
     * Bitmapを更新する。
     * Sprite_Battler.update()からコールされる。
     */
    Sprite_ActorHud.prototype.updateBitmap = function() {
        Sprite_Battler.prototype.updateBitmap.call(this);

        const faceName = this._actor.faceName();
        const faceIndex = this._actor.faceIndex();
        if ((faceName !== this._faceName) || (faceIndex !== this._faceIndex)) {
            this.loadMainSpriteBitmapFace(faceName, faceIndex);
        }
    };

    // Sprite_ActorHud.prototype.hitTest = function(x, y) {
    //     const rect = new Rectangle(
    //         -this.anchor.x * this.width,
    //         -this.anchor.y * this.height,
    //         this.width,
    //         this.height
    //     );
    //     const isHit = rect.contains(x, y);
    //     if (!isHit) {
    //         const actorName = this._actor ? this._actor.name() : "";
    //         console.log(actorName + " point=(" + x + "," + y + ") rect=(" + rect.x + "," + rect.y + "," + rect.width + "," + rect.height + ")");
    //     }
    //     return isHit;
    // };

    /**
     * Faceをメインスプライト画像として読み出す。
     * 
     * @param {String} faceName 顔グラフィックファイル名
     * @param {Number} faceIndex 顔グラフィックファイル中のインデックス番号
     */
    Sprite_ActorHud.prototype.loadMainSpriteBitmapFace = function(faceName, faceIndex) {
        this._mainSprite.bitmap = ImageManager.loadFace(faceName, faceIndex);
        const pw = ImageManager.faceWidth;
        const ph = ImageManager.faceHeight;
        const cw = Math.min(pw, statusAreaWidth);
        const ch = Math.min(ph, statusAreaHeight);
        const cx = (faceIndex % 4) * pw + Math.min(0, (statusAreaWidth - cw) / 2) + 1;
        const cy = Math.floor(faceIndex / 4) * ph + Math.min(0, (statusAreaHeight - ch) / 2);

        this._mainSprite.x = 0;
        this._mainSprite.y = -(statusAreaHeight - ph);

        this._mainSprite.setFrame(cx, cy, cw, ch);
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    };

    /**
     * フレーム（表示領域）を更新する。
     */
    Sprite_ActorHud.prototype.updateFrame = function() {
        Sprite_Battler.prototype.updateFrame.call(this);
    };

    /**
     * ダメージポップアップ位置Yを取得する。
     * 
     * @return {Number} ポップアップ位置y
     */
    Sprite_ActorHud.prototype.damageOffsetY = function() {
        return ImageManager.faceHeight - statusAreaHeight;
    };

    //------------------------------------------------------------------------------
    // Spriteset_Battle

    const _Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors;

    /**
     * アクターのスプライトを作成する。
     */
    Spriteset_Battle.prototype.createActors = function() {
        _Spriteset_Battle_createActors.call(this, ...arguments);
        this._actorHudSprites = [];
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            const sprite = new Sprite_ActorHud();
            this._actorHudSprites.push(sprite);
            this._battleField.addChild(sprite);
        }
    };

    const _Spriteset_Battle_updateActors = Spriteset_Battle.prototype.updateActors;
    /**
     * アクターのスプライトを更新する。
     */
    Spriteset_Battle.prototype.updateActors = function() {
        _Spriteset_Battle_updateActors.call(this, ...arguments);

        const members = $gameParty.battleMembers();
        for (let i = 0; i < this._actorHudSprites.length; i++) {
            this._actorHudSprites[i].setBattler(members[i]);
        }
    };

    const _Spriteset_Battle_findTargetSprite = Spriteset_Battle.prototype.findTargetSprite;
    /**
     * ターゲットに対応するSpriteを取得する。
     * 派生クラスにて実装する事。
     * 
     * @param {Object} target ターゲット(Game_BattlerBaseオブジェクト)
     * @return {Sprite} 対象のスプライト
     */
    Spriteset_Battle.prototype.findTargetSprite = function(target) {
        const targetSprite = _Spriteset_Battle_findTargetSprite.call(this, target);
        if (targetSprite) {
            return targetSprite;
        } else {
            const targetHud = this._actorHudSprites.find(sprite => sprite.checkBattler(target));
            if (targetHud) {
                return targetHud.mainSprite();
            } else {
                return undefined;
            }
        }
    };

    const _Spriteset_Battle_isEffecting = Spriteset_Battle.prototype.isEffecting;

    /**
     * エフェクト処理中かどうかを判定する。
     * 
     * @return {Boolean} エフェクト処理中の場合にはtrue, それ以外はfalse
     */
    Spriteset_Battle.prototype.isEffecting = function() {
        // return _Spriteset_Battle_isEffecting.call(this) 
        //     || this._actorHudSprites.some(sprite => sprite.isEffecting());
        return _Spriteset_Battle_isEffecting.call(this);
    };

    //------------------------------------------------------------------------------
    // Scene_Battle
    //     _statusWindow, _actorWindow は使用しない。

    const _Scene_Battle_create = Scene_Battle.prototype.create;

    /**
     * Scene_Battleを作成する。
     * 
     * 表示するオブジェクトの生成などを行う。
     */
    Scene_Battle.prototype.create = function() {
        _Scene_Battle_create.call(this);
        this.createHudItemNameWindow();
    };

    /**
     * アイテム名表示ウィンドウを作成する。
     */
    Scene_Battle.prototype.createHudItemNameWindow = function() {
        const x = this._skillWindow.x;
        const y = this._skillWindow.y - 64;
        const rect = new Rectangle(x, y, 320, 64);
        this._itemNameWindow = new Window_HudItemName(rect);
        this._itemNameWindow.hide();
        this.addChild(this._itemNameWindow);
    };


    /**
     * ステータスウィンドウを作成する。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.createStatusWindow = function() {
    };

    /**
     * スキル使用対象選択用のアクター選択ウィンドウを作成する。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.createActorWindow = function() {
    };
        
    /**
     * Scene_Battleを開始する。
     * 
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.start = function() {
        Scene_Message.prototype.start.call(this);
        BattleManager.playBattleBgm();
        BattleManager.startBattle();
        this.startFadeIn(this.fadeSpeed(), false);
    };
    /**
     * Scene_Battleを一時停止する
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.stop = function() {
        Scene_Message.prototype.stop.call(this);
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        } else {
            this.startFadeOut(this.fadeSpeed(), false);
        }
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    };

    const _Scene_Battle_update = Scene_Battle.prototype.update;

    /**
     * Scene_Battle の更新処理を行う。
     */
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        this.updateActorSelecting();
    };

    /**
     * アクター選択の処理を更新する。
     */
    Scene_Battle.prototype.updateActorSelecting = function() {
        if (!this._actorSelecting) {
            return;
        }

        if (Input.isRepeated("left")) {
            if (this._selectingActorIndex > 0) {
                SoundManager.playCursor();
                this._selectingActorIndex--;
                $gameParty.select(this.selectingActor());
            }
        } else if (Input.isRepeated("right")) {
            if (this._selectingActorIndex < ($gameParty.battleMembers().length - 1)) {
                SoundManager.playCursor();
                this._selectingActorIndex++;
                $gameParty.select(this.selectingActor());
            }
        } else if (Input.isRepeated("ok")) {
            SoundManager.playOk();
            this.onActorOk();
        } else if (Input.isRepeated("cancel")) {
            SoundManager.playCancel();
            this.onActorCancel();
        } else if ($gameTemp.touchTarget() != null) {
            this.processTouchActorSelection();
        } else if (TouchInput.isCancelled()) {
            SoundManager.playCancel();
            this.onActorCancel();
        }
    };

    /**
     * アクター選択中のタッチ操作を処理する。
     * 
     * ウィンドウを表示しないなら仕方ないね！
     */
    Scene_Battle.prototype.processTouchActorSelection = function() {
        const target = $gameTemp.touchTarget();
        const battleMembers = $gameParty.battleMembers();
        console.log("touched : " + target.name());
        if (battleMembers.contains(target)) {
            this._selectingActorIndex = battleMembers.indexOf(target);
            $gameParty.select(target);
            if ($gameTemp.touchState() === "click") {
                this.onActorOk();
            }
        }

        $gameTemp.clearTouchState();
    };

    /**
     * 選択中のアクターを取得する。
     * 
     * @return {Game_Actor} 選択中のアクター。未選択時はnull
     */
    Scene_Battle.prototype.selectingActor = function() {
        if (this._selectingActorIndex >= 0) {
            return $gameParty.battleMembers()[this._selectingActorIndex];
        }

        return null;
    };

    /**
     * ステータスウィンドウの表示状態を更新する。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.updateStatusWindowVisibility = function() {
    };


    /**
     * エネミーウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} エネミーウィンドウの矩形領域。
     */
    Scene_Battle.prototype.enemyWindowRect = function() {
        const ww = Graphics.boxWidth - 192;
        const wh = this.windowAreaHeight();
        const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * パーティーコマンド選択を開始する。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.startPartyCommandSelection = function() {
        this._actorCommandWindow.setup(null);
        this._actorCommandWindow.close();
        this._partyCommandWindow.setup();
    };
    
    /**
     * アクターコマンド選択を開始する。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.startActorCommandSelection = function() {
        this._partyCommandWindow.close();
        this._actorCommandWindow.show();
        this._actorCommandWindow.setup(BattleManager.actor());
    };

    /**
     * スキルが選択されたときの処理を行う。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.commandSkill = function() {
        this._skillWindow.setActor(BattleManager.actor());
        this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
        this._actorCommandWindow.hide();
    };
    /**
     * アイテムが選択されたときの処理を行う。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.commandItem = function() {
        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
        this._actorCommandWindow.hide();
    };

    /**
     * エネミー選択を開始する。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.startEnemySelection = function() {
        this._enemyWindow.refresh();
        this._enemyWindow.show();
        this._enemyWindow.select(0);
        this._enemyWindow.activate();
    };
    /**
     * エネミー選択/スキル選択/アイテム選択でキャンセル操作されたときの処理を行う。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.onEnemyCancel = function() {
        this._enemyWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case "attack":
                this._actorCommandWindow.activate();
                break;
            case "skill":
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case "item":
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    };


    /**
     * スキル選択でキャンセル操作された時の処理を行う。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.onSkillCancel = function() {
        this._skillWindow.hide();
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    };

    /**
     * アイテム選択ウィンドウでキャンセル操作されたときの処理を行う。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.onItemCancel = function() {
        this._itemWindow.hide();
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    };
    /**
     * コマンド選択が完了したときの処理を行う。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.endCommandSelection = function() {
        this.closeCommandWindows();
        this.hideSubInputWindows();
    };

    /**
     * サブ入力ウィンドウを非表示にする。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.hideSubInputWindows = function() {
        this._enemyWindow.deactivate();
        this._skillWindow.deactivate();
        this._itemWindow.deactivate();
        this._enemyWindow.hide();
        this._skillWindow.hide();
        this._itemWindow.hide();
    };

    const _Scene_Battle_startEnemySelection = Scene_Battle.prototype.startEnemySelection;

    /**
     * エネミー選択を開始する。
     */
    Scene_Battle.prototype.startEnemySelection = function() {
        _Scene_Battle_startEnemySelection.call(this);
        const action = BattleManager.inputtingAction();
        const item = action.item();
        if (item !== null) {
            this._itemNameWindow.setItem(item);
            this._itemNameWindow.show();
        }
    };

    const _Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;

    /**
     * エネミー選択でOKされたときの処理を行う。
     */
    Scene_Battle.prototype.onEnemyOk = function() {
        _Scene_Battle_onEnemyOk.call(this);
        this._itemNameWindow.hide();
    };

    const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    /**
     * エネミー選択でキャンセル操作されたときの処理を行う。
     */
    Scene_Battle.prototype.onEnemyCancel = function() {
        _Scene_Battle_onEnemyCancel.call(this);
        this._itemNameWindow.hide();
    };

    /**
     * アクター選択を開始する。
     */
    Scene_Battle.prototype.startActorSelection = function() {
        this._skillWindow.hide();
        this._itemWindow.hide();
        const action = BattleManager.inputtingAction();
        const item = action.item();
        if (item !== null) {
            this._itemNameWindow.setItem(item);
            this._itemNameWindow.show();
        }
        this._actorSelecting = true;
        this._selectingActorIndex = $gameTemp.lastActionData(4); // 4:Last target actor Id. 
        if (this._selectingActorIndex >= $gameParty.battleMembers().length) {
            this._selectingActorIndex = 0;
        }
        $gameTemp.clearTouchState();
    };

    /**
     * アクター選択でOKが選択されたときの処理を行う。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.onActorOk = function() {
        $gameParty.select(null);
        this._actorSelecting = false;
        this._itemNameWindow.hide();
        const action = BattleManager.inputtingAction();
        action.setTarget(this._selectingActorIndex);
        this.hideSubInputWindows();
        this.selectNextCommand();
    };
    
    /**
     * アクター選択でキャンセルされたときの処理を行う。
     * 
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.onActorCancel = function() {
        $gameParty.select(null);
        this._actorSelecting = false;
        this._itemNameWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case "skill":
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case "item":
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    };

    /**
     * いずれかの入力ウィンドウがアクティブ（選択中）かどうかを判定する。
     * 
     * @return {Boolean} いずれかの入力ウィンドウがアクティブな場合にはtrue, それ以外はfalse
     */
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        return (this._partyCommandWindow.active 
            || this._actorCommandWindow.active
            || this._skillWindow.active
            || this._itemWindow.active
            || this._enemyWindow.active
            || this._actorSelecting
        );
    };
})();