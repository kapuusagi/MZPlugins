/*:ja
 * @target MZ 
 * @plugindesc Twld向けに作成した戦闘システムの変更
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * ■ setBattlePicture
 * @command setBattlePicture
 * @text アクター戦闘画像設定
 * @desc 戦闘中にコマンド入力欄脇に表示するグラフィックを設定する。
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
 * Twld向けに作成した戦闘シーンのUI処理プラグイン。
 * 
 * img/hud/ActiveHud
 *     Active状態の時に表示するイメージ
 * img/hud/StatusBackground
 *     Status背景の表示
 *
 * ■ 注意事項 
 * フロントビュー固定になります。
 * 
 * ■ 開発者向け？
 * 以下のモジュールは、他のプラグインとの兼ね合いで変更できるよう、
 * 匿名メソッドから外に出している。
 * Sprite_BattleHudHpGauge
 *   UI上で、1アクターのHPゲージを表示するスプライト
 * Sprite_BattleHudMpTpGauge
 *   UI上で、1アクターのMP/TPゲージを表示するスプライト
 * Sprite_BattleHudActorName
 *   UI上で、1アクターの名前を表示するスプライト。
 * Sprite_HudStateIcons
 *   UI上で、1アクターのステートを表示するスプライト。
 * Sprite_BattleHudActor
 *   UI上で、1アクターあたりの表示をするスプライト。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <battlePicture:pictureName$>
 *        フロントビューで表示するアクターの画像。
 *        picturesフォルダの下から引っ張ってくる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/**
 * Sprite_BattleHudHpGauge
 * HPゲージ。
 */
function Sprite_BattleHudHpGauge() {
    this.initialize(...arguments);
};


/**
 * Sprite_BattleHudMpTpGauge。
 * MP/TPゲージ
 */
function Sprite_BattleHudMpTpGauge() {
    this.initialize(...arguments);
};


/**
 * Sprite_BattleHudTpgGauge。
 * TPBゲージ
 */
function Sprite_BattleHudTpgGauge() {
    this.initialize(...arguments);
};



/**
 * Sprite_BattleHudActorName。
 * Sprite_Nameから表示を変更するために派生して使う。
 */
function Sprite_BattleHudActorName() {
    this.initialize(...arguments);
};


/**
 * Sprite_HudStateIcons。
 * ステートアイコンを表示するためのスプライト。
 * 一度に4つずつ表示するために用意したが、
 * Sprite_StateIconを複数並べる方式の方がリソース節約になるかもしれない。
 */
function Sprite_HudStateIcons() {
    this.initialize(...arguments);
};


/**
 * Sprite_BattleHudActor
 * 
 * アクター情報を表示するHUD。
 */
function Sprite_BattleHudActor() {
    this.initialize(...arguments);
};

/**
 * Sprite_BattleHudPicture。
 * コマンド入力ウィンドウの脇に、でっかく表示するアクター画像のスプライト。
 */
function Sprite_BattleHudPicture() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_TwldBattleSystem";
    const parameters = PluginManager.parameters(pluginName);
    const maxBattleMembers = Number(parameters["maxBattleMembers"]) || 4;
    const tpbCastLabel = parameters["tpbCastLabel"] || "Casting";
    const gaugeLabelHpFontSize = parameters["labelHpFontSize"] || 16;
    const gaugeValueHpFontSize = parameters["valueHpFontSize"] || 24;
    const gaugeLabelFontSize = parameters["labelFontSize"] || 12;
    const gaugeValueFontSize = parameters["valueFontSize"] || 12;


    const listWindowWidth = 816;
    const commandWindowX = 1068;
    const commandWindowWidth = 192;
    const statusAreaWidth = 160;
    const statusAreaPadding = 16;
    const statusAreaHeight = 220;

    PluginManager.registerCommand(pluginName, "setBattlePicture", args => {
        const actorId = args.actorId;
        const fileName = args.fileName;
        if (actorId) {
            $gameActors.actor(actorId).setBattlePicture(fileName);
        }
    });

    /**
     * TPBキャスト中ゲージ色1を得る。
     * 
     * @return {String} CSSスタイルの色データ
     */
    ColorManager.tpbCastGaugeColor1 = function() {
        return ColorManager.mpGaugeColor2();
    };
    /**
     * TPBキャスト中ゲージ色2を得る。
     * 
     * @return {String} CSSスタイルの色データ
     */
    ColorManager.tbpCastGaugeColor2 = function() {
        return ColorManager.mpGaugeColor2();
    };
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
        return (this._tpbState === "casting");
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
        this._battlePicture = "";
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
        if (actor.meta.battlePicture) {
            this.setBattlePicture(actor.meta.battlePicture);
        }
    };

    /**
     * フロントビュー画像ファイル名を取得する。
     * 
     * @return {String} フロントビュー戦闘グラフィックファイル名。
     */
    Game_Actor.prototype.battlePicture = function() {
        return this._battlePicture;
    };

    /**
     * フロントビュー戦画像ファイル名を設定する。
     * 
     * @param {String} pictureName フロントビュー戦闘グラフィックファイル名。
     */
    Game_Actor.prototype.setBattlePicture = function(pictureName) {
        this._battlePicture = pictureName;
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
    // Window_BattleActor の変更
    const _Window_BattleActor_initialize = Window_BattleActor.prototype.initialize;

    /**
     * Window_BattleActorを初期化する。
     * 
     * Note: フレームとウィンドウ背景を表示するためにフックする。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BattleActor.prototype.initialize = function(rect) {
        _Window_BattleActor_initialize.call(this, rect);
        this.frameVisible = true;
        this._bitmapsReady = 255;
    };
    /**
     * 項目を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_BattleActor.prototype.drawItem = function(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        this.drawActorName(actor, rect.x, rect.y, rect.width);
    };

    /**
     * 最大カラム数を得る。
     * 
     * @return {Number} 最大カラム数
     */
    Window_BattleActor.prototype.maxCols = function() {
        return 1;
    };

    /**
     * 1項目の高さを得る。
     * 
     * @return {Number} 1項目の高さ。
     */
    Window_BattleStatus.prototype.itemHeight = function() {
        return this.lineHeight();
    };

    /**
     * 最大行数を得る。
     * 
     * @return {Number} 最大行数。
     */
    Window_BattleActor.prototype.maxRows = function() {
        return this.innerHeight / this.itemHeight();
    };

    /**
     * 行スペースを得る。
     * 
     * @return {Number} 行スペース
     */
    Window_BattleActor.prototype.rowSpacing = function() {
        return 4;
    };

    const _Window_BattleActor_processCursorMove = Window_BattleActor.prototype.processCursorMove;
    /**
     * カーソルの移動を処理する。
     */
    Window_BattleActor.prototype.processCursorMove = function() {
        if (this.isCursorMovable()) {
            if (Input.isRepeated("right")) {
                this.cursorDown(Input.isTriggered("right"));
                return;
            } else if (Input.isRepeated("left")) {
                this.cursorUp(Input.isTriggered("left"));
                return;
            }
        } 
        return _Window_BattleActor_processCursorMove.call(this);
    };

    //------------------------------------------------------------------------------
    // Window_BattleEnemy の変更
    /**
     * 最大カラム数を得る。
     * 
     * @return {Number} 最大カラム数
     */
    Window_BattleEnemy.prototype.maxCols = function() {
        return 1;
    };

    const _Window_BattleEnemy_processCursorMove = Window_BattleEnemy.prototype.processCursorMove;

    /**
     * カーソルの移動を処理する。
     */
    Window_BattleEnemy.prototype.processCursorMove = function() {
        if (this.isCursorMovable()) {
            if (Input.isRepeated("right")) {
                this.cursorDown(Input.isTriggered("right"));
                return;
            } else if (Input.isRepeated("left")) {
                this.cursorUp(Input.isTriggered("left"));
                return;
            }
        } 
        return _Window_BattleEnemy_processCursorMove.call(this);
    };
    //------------------------------------------------------------------------------
    // Sprite_Gauge

    const _Sprite_Gauge_currentValue = Sprite_Gauge.prototype.currentValue;

    /**
     * 現在値を更新する。
     * 
     * キャスト中はキャストゲージを表示するため、オーバーライドする。
     */
    Sprite_Gauge.prototype.currentValue = function() {
        if (this._battler && this._statusType === "time" && this._battler.isTpbCasting()) {
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
        if (this._battler && this._statusType === "time" && this._battler.isTpbCasting()) {
            return ColorManager.tpbCastGaugeColor1();
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
        if (this._battler && this._statusType === "time" && this._battler.isTpbCasting()) {
            return ColorManager.tbpCastGaugeColor2();
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
        this.bitmap.drawText(label, 0, 0, width, height, "center");
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
        const txt = String(currentValue).padStart(4) + "/" + String(maxValue).padStart(4);
        this.bitmap.drawText(txt, 0, 0, width, height, "right");
    };

    //------------------------------------------------------------------------------
    // Sprite_BattleHudHpGauge
    Sprite_BattleHudHpGauge.prototype = Object.create(Sprite_Gauge.prototype);
    Sprite_BattleHudHpGauge.prototype.constructor = Sprite_BattleHudHpGauge;
    

    /**
     * Sprite_BattleHudHpGaugeを初期化する。
     */
    Sprite_BattleHudHpGauge.prototype.initialize = function() {
        Sprite_Gauge.prototype.initialize.call(this);
    };
    /**
     * ラベルのフォントサイズを得る。
     * 
     * @return {Number} フォントサイズ
     */
    Sprite_BattleHudHpGauge.prototype.labelFontSize = function() {
        return gaugeValueHpFontSize;
    };

    /**
     * ゲージ描画のX位置を取得する。
     * 
     * @return {Number} X位置
     */
    Sprite_BattleHudHpGauge.prototype.gaugeX = function() {
        return 16;
    };

    /**
     * ラベルのフォントサイズを得る。
     * 
     * @return {Number} フォントサイズ
     */
    Sprite_BattleHudHpGauge.prototype.labelFontSize = function() {
        return gaugeLabelHpFontSize;
    };

    /**
     * 値のフォントサイズを得る。
     * 
     * @return {Number} 値のフォントサイズ。
     */
    Sprite_BattleHudHpGauge.prototype.valueFontSize = function() {
        return 24;
    };

    /**
     * 
     */
    Sprite_BattleHudHpGauge.prototype.maxValueFontSize = function() {
        return valueFontSize;
    };

    /**
     * 値を描画する。
     * 
     * !!!overwrite!!!
     */
    Sprite_BattleHudHpGauge.prototype.drawValue = function() {
        const currentValue = this.currentValue();
        const maxValue = this.currentMaxValue();
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.setupValueFont();
        const maxWidth = 48;
        this.bitmap.drawText(String(currentValue).padStart(4), 0, 0, width - maxWidth, height, "right");
        this.setupMaxValueFont();
        this.bitmap.drawText("/" + String(currentValue).padStart(4), width - maxWidth, 0, maxWidth, height, "right");
    };

    /**
     * 最大値表示用フォントをセットアップする。
     */
    Sprite_BattleHudHpGauge.prototype.setupMaxValueFont = function() {
        this.bitmap.fontFace = this.valueFontFace();
        this.bitmap.fontSize = this.valueFontSize() - 8;
        this.bitmap.textColor = this.valueColor();
        this.bitmap.outlineColor = this.valueOutlineColor();
        this.bitmap.outlineWidth = this.valueOutlineWidth();
    };
    //------------------------------------------------------------------------------
    // Sprite_BattleHudMpTpGauge
    Sprite_BattleHudMpTpGauge.prototype = Object.create(Sprite_Gauge.prototype);
    Sprite_BattleHudMpTpGauge.prototype.constructor = Sprite_BattleHudMpTpGauge;    

    /**
     * Sprite_MpGaugeを初期化する。
     */
    Sprite_BattleHudMpTpGauge.prototype.initialize = function() {
        Sprite_Gauge.prototype.initialize.call(this);
    };

    /**
     * Bitmapの幅を得る。
     * 
     * @return {Number} Bitmapの幅。
     */
    Sprite_BattleHudMpTpGauge.prototype.bitmapWidth = function() {
        return 96;
    };

    /**
     * Bitmapの高さを得る。
     * 
     * @return {Number} Bitmapの高さ。
     */
    Sprite_BattleHudMpTpGauge.prototype.bitmapHeight = function() {
        return 12;
    };

    /**
     * ゲージの高さを得る。
     * 
     * @return {Number} ゲージの高さ。
     */
    Sprite_BattleHudMpTpGauge.prototype.gaugeHeight = function() {
        return 8;
    };

    /**
     * ラベルのフォントサイズを得る。
     * 
     * @return {Number} フォントサイズ
     */
    Sprite_BattleHudMpTpGauge.prototype.labelFontSize = function() {
        return gaugeLabelFontSize;
    };

    /**
     * 値のフォントサイズを得る。
     * 
     * @return {Number} 値のフォントサイズ。
     */
    Sprite_BattleHudMpTpGauge.prototype.valueFontSize = function() {
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
    // Sprite_BattleHudTpgGauge
    Sprite_BattleHudTpgGauge.prototype = Object.create(Sprite_Gauge.prototype);
    Sprite_BattleHudTpgGauge.prototype.constructor = Sprite_BattleHudTpgGauge;

    /**
     * Sprite_BattleHudTpgGaugeを初期化する。
     */
    Sprite_BattleHudTpgGauge.prototype.initialize = function() {
        Sprite_Gauge.prototype.initialize.call(this);
    };

    /**
     * Bitmapの幅を得る。
     * 
     * @return {Number} Bitmapの幅。
     */
    Sprite_BattleHudTpgGauge.prototype.bitmapWidth = function() {
        return 96;
    };

    /**
     * Bitmapの高さを得る。
     * 
     * @return {Number} Bitmapの高さ。
     */
    Sprite_BattleHudTpgGauge.prototype.bitmapHeight = function() {
        return 12;
    };

    /**
     * ゲージ描画のX位置を取得する。
     * 
     * @return {Number} X位置
     */
    Sprite_BattleHudTpgGauge.prototype.gaugeX = function() {
        return 0;
    };

    /**
     * ゲージの高さを得る。
     * 
     * @return {Number} ゲージの高さ。
     */
    Sprite_BattleHudTpgGauge.prototype.gaugeHeight = function() {
        return 8;
    };

    /**
     * ラベルのフォントサイズを得る。
     * 
     * @return {Number} フォントサイズ
     */
    Sprite_BattleHudTpgGauge.prototype.labelFontSize = function() {
        return gaugeLabelFontSize;
    };

    /**
     * 値のフォントサイズを得る。
     * 
     * @return {Number} 値のフォントサイズ。
     */
    Sprite_BattleHudTpgGauge.prototype.valueFontSize = function() {
        return gaugeValueFontSize;
    };
    //------------------------------------------------------------------------------
    // Sprite_BattleHudActorName
    Sprite_BattleHudActorName.prototype = Object.create(Sprite_Name.prototype);
    Sprite_BattleHudActorName.prototype.constructor = Sprite_BattleHudActorName;    

    /**
     * Sprite_BattleHudActorNameを初期化する。
     */
    Sprite_BattleHudActorName.prototype.initialize = function() {
        Sprite_Name.prototype.initialize.call(this);
    };

    /**
     * ビットマップの高さを得る。
     * 
     * @return {Number} Bitmapの高さ
     */
    Sprite_BattleHudActorName.prototype.bitmapHeight = function() {
        return 18;
    };    
    /**
     * Sprite_Nameの名前表示用フォントサイズを得る。
     * 
     * @return {Number} 名前表示用フォントサイズ。
     */
    Sprite_BattleHudActorName.prototype.fontSize = function() {
        return 16;
    };

    //------------------------------------------------------------------------------
    // Sprite_HudStateIcons
    
    Sprite_HudStateIcons.prototype = Object.create(Sprite.prototype);
    Sprite_HudStateIcons.prototype.constructor = Sprite_HudStateIcons;
    
    /**
     * Sprite_HudStateIconsを初期化する。
     */
    Sprite_HudStateIcons.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    };

    /**
     * Sprite_HudStateIconsのメンバを初期化する。
     */
    Sprite_HudStateIcons.prototype.initMembers = function() {
        this._battler = null;
        this._animationCount = 0;
        this._iconIndex = 0;
        this.anchor.x = 0;
        this.anchor.y = 0.5;
    };

    /**
     * Sprite_HudStateIconsを破棄する。
     */
    Sprite_HudStateIcons.prototype.destroy = function() {
        Sprite.prototype.destroy.call(this);
        if (this._iconBitmap) {
            this._iconBitmap.destroy();
        }
    };

    /**
     * IconSetのBitmapをロードする。
     */
    Sprite_HudStateIcons.prototype.loadBitmap = function() {
        this.bitmap = new Bitmap(ImageManager.iconWidth * 4 + 6, ImageManager.iconHeight);
        this._iconBitmap = ImageManager.loadSystem("IconSet");
    };

    /**
     * このスプライトに関連付けるGame_Battlerオブジェクトを設定する。
     * 
     * @param {Game_Battler} battler ステートを表示するGame_Battlerオブジェクト
     */
    Sprite_HudStateIcons.prototype.setup = function(battler) {
        if (this._battler !== battler) {
            this._battler = battler;
            this._animationCount = this.animationWait();
        }
    };

    /**
     * Sprite_HudStateIcons を更新する。
     */
    Sprite_HudStateIcons.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updateIcon();
            this._animationCount = 0;
        }
    };

    /**
     * アニメーションを表示するフレーム数。
     */
    Sprite_HudStateIcons.prototype.animationWait = function() {
        return 40;
    };

    /**
     * 表示するアイコンを切り替えて更新する。
     */
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

    /**
     * アイコンを描画する。
     * 
     * @param {Number} iconIndex 描画するアイコンのインデックス
     * @param {Number} drawIndex 書き込み先位置(0~3)
     */
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

    /**
     * このスプライトを表示するべきかどうかを取得する。
     * 
     * @return {Boolean} 表示するべき場合にはtrue, それ以外はfalse.
     */
    Sprite_HudStateIcons.prototype.shouldDisplay = function() {
        const battler = this._battler;
        return battler && (battler.isActor() || battler.isAlive());
    };

    //------------------------------------------------------------------------------
    // Sprite_Enemy

    /**
     * ステートアイコンスプライトを作成する。
     */
    Sprite_Enemy.prototype.createStateIconSprite = function() {
        this._stateIconSprite = new Sprite_HudStateIcons();
        this._stateIconSprite.anchor.x = 0.5;
        this._stateIconSprite.anchor.y = 0.5;
        this.addChild(this._stateIconSprite);
    };

    const _Sprite_Enemy_setHome = Sprite_Enemy.prototype.setHome;
    /**
     * ホーム位置を設定する。
     * 
     * @param {Number} x X位置
     * @param {Number} y Y位置
     */
    Sprite_Enemy.prototype.setHome = function(x, y) {
        const offsetX = (Graphics.boxWidth - 816) / 2;
        const offsetY = (Graphics.boxHeight - 624) / 2;
        _Sprite_Enemy_setHome.call(this, x + offsetX, y + offsetY);
    };

    //------------------------------------------------------------------------------
    // Sprite_BattleHudActor
    Sprite_BattleHudActor.prototype = Object.create(Sprite_Battler.prototype);
    Sprite_BattleHudActor.prototype.constructor = Sprite_BattleHudActor;
    
    
    /**
     * Sprite_BattleHudActorを初期化する。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト。
     */
    Sprite_BattleHudActor.prototype.initialize = function(battler) {
        Sprite_Battler.prototype.initialize.call(this, battler);
        this._actor = null;
        this._faceName = null;
        this._faceIndex = -1;
        this._activeSelAdd = 2;
        this._brightness = 255;
        this.setFrame(0, 0, this.statusAreaWidth(), this.statusAreaHeight());
    };

    /**
     * ステータス領域の幅を得る。
     * 
     * @return {Number} ステータス領域の幅
     */
    Sprite_BattleHudActor.prototype.statusAreaWidth = function() {
        return statusAreaWidth;
    };

    /**
     * ステータス領域の高さを得る。
     * 
     * @return {Number} ステータスエリアの高さ
     */
    Sprite_BattleHudActor.prototype.statusAreaHeight = function() {
        return statusAreaHeight;
    };

    /**
     * メンバーを初期化する。
     */
    Sprite_BattleHudActor.prototype.initMembers = function() {
        Sprite_Battler.prototype.initMembers.call(this);
        this.createActiveSelSprite();
        this.createMainSprite();
        this.createStatusBackSprite();
        this.createNameSprite();
        this.createGaugeSprites();
        this.createStateIconSprite();
    };

    /**
     * 入力アクティブになったときに表示するスプライトをロードする。
     */
    Sprite_BattleHudActor.prototype.createActiveSelSprite = function() {
        this._activeSelSprite = new Sprite();
        try {
            this._activeSelSprite.bitmap = ImageManager.loadBitmap("img/hud/", "ActiveHud");
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
     * メインスプライトを作成する。
     * メインスプライトはHUDを構成する各スプライトを乗せる（addChild)する
     * ベースになるスプライト。
     */
    Sprite_BattleHudActor.prototype.createMainSprite = function() {
        this._mainSprite = new Sprite();
        this._mainSprite.anchor.x = 0.5; // 原点XはSprite中央
        this._mainSprite.anchor.y = 1; // 原点YはSprite下端
        if (!this._mainSprite.filters) {
            this._mainSprite.filters = [];
        }
        this._mainSpriteFilter = new BattleHudActorFilter();
        this._mainSprite.filters.push(this._mainSpriteFilter);
        this.addChild(this._mainSprite);
    };

    /**
     * ステータスの背景に表示するスプライトを作成する。
     */
    Sprite_BattleHudActor.prototype.createStatusBackSprite = function() {
        this._statusBackSprite = new Sprite();
        this._statusBackSprite.bitmap = ImageManager.loadBitmap("img/hud/", "StatusBackground")
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
    Sprite_BattleHudActor.prototype.createNameSprite = function() {
        const sprite = new Sprite_BattleHudActorName();
        sprite.x = -statusAreaWidth / 2;
        sprite.y = -88;
        this._nameSprite = sprite;
        this.addChild(this._nameSprite);
    };

    /**
     * ゲージスプライトを作成する。
     */
    Sprite_BattleHudActor.prototype.createGaugeSprites = function() {
        // HPゲージ
        this._hpGaugeSprite = new Sprite_BattleHudHpGauge();
        this._hpGaugeSprite.x = -64;
        this._hpGaugeSprite.y = -72;
        this.addChild(this._hpGaugeSprite);

        // MPゲージ
        this._mpGaugeSprite = new Sprite_BattleHudMpTpGauge();
        this._mpGaugeSprite.x = -32;
        this._mpGaugeSprite.y = -48;
        this.addChild(this._mpGaugeSprite);

        // TPゲージ
        this._tpGaugeSprite = new Sprite_BattleHudMpTpGauge();
        this._tpGaugeSprite.x = -32;
        this._tpGaugeSprite.y = -32;
        this.addChild(this._tpGaugeSprite);

        // TPBゲージ
        this._tpbGaugeSprite = new Sprite_BattleHudTpgGauge();
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
    Sprite_BattleHudActor.prototype.createStateIconSprite = function() {
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
    Sprite_BattleHudActor.prototype.mainSprite = function() {
        return this._mainSprite;
    };

    /**
     * このスプライトに関連付けるGame_Battlerオブジェクトを構築する。
     * このメソッドは Spriteset_Battle.update()から、
     * 毎フレームコールされる実装になっている。
     * パフォーマンス低下を防ぐため、拡張する場合には onBattlerChangedをフックする。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト。
     */
    Sprite_BattleHudActor.prototype.setBattler = function(battler) {
        Sprite_Battler.prototype.setBattler.call(this, battler);
        if (battler !== this._actor) {
            this._actor = battler;
            this.onBattlerChanged(battler);
        }
    };

    /**
     * このスプライトに関連付けるGame_Battlerが変更されたときの処理を行う。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     */
    Sprite_BattleHudActor.prototype.onBattlerChanged = function(battler) {
        if (battler) {
            this.setHudPosition(battler.index());
            this._nameSprite.setup(battler);
            this._hpGaugeSprite.setup(battler, "hp");
            this._mpGaugeSprite.setup(battler, "mp");
            this._tpGaugeSprite.setup(battler, "tp");
            this._tpbGaugeSprite.setup(battler, "time");
            this._stateIconSprite.setup(battler);
            const condition = this.mainSpriteColorCondition();
            this._mainSpriteFilter.setSaturation(condition.saturation);
            this._mainSpriteFilter.setBrightness(condition.brightness);
            this._mainSprite.opacity = condition.opacity;
        } else {
            this._mainSprite.bitmap = null;
        }
    };

    /**
     * このスプライトに関連付けられているGame_Actorオブジェクトを取得する。
     * 
     * @return {Game_Actor} Game_Actorオブジェクト。関連付けられていない場合にはnull.
     */
    Sprite_BattleHudActor.prototype.actor = function() {
        return this._actor;
    };

    /**
     * HUDの位置を得る。
     * 
     * @param {Number} index 位置
     */
    Sprite_BattleHudActor.prototype.setHudPosition = function(index) {
        const battleMemberCount = $gameParty.battleMembers().length;
        const totalStatusAreaWidth = statusAreaWidth * battleMemberCount + statusAreaPadding + (battleMemberCount - 1);
        const baseX = (Graphics.boxWidth - totalStatusAreaWidth) / 2
        const offsetX = (statusAreaWidth + statusAreaPadding) * index;
        const x = baseX + offsetX; // + statusAreaWidth / 2;
        const y = Graphics.boxHeight;
        this.setHome(x, y);
    };

    /**
     * HUDを更新する。
     */
    Sprite_BattleHudActor.prototype.update = function() {
        Sprite_Battler.prototype.update.call(this);
        this.updateSelecting();
        this.updateColor();
    };

    /**
     * 選択状態表示を更新する。
     */
    Sprite_BattleHudActor.prototype.updateSelecting = function() {
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
     * ステートに合わせて色を変更する。
     */
    Sprite_BattleHudActor.prototype.updateColor = function() {
        if (this._battler) {
            // 彩度
            const targetCondition = this.mainSpriteColorCondition();
            let saturation = this._mainSpriteFilter.saturation();
            if (saturation > targetCondition.saturation) {
                saturation = Math.max(saturation - 10, targetCondition.saturation);
            } else if (saturation < targetCondition.saturation) {
                saturation = Math.min(saturation + 50, targetCondition.saturation);
            }
            this._mainSpriteFilter.setSaturation(saturation);

            // 輝度
            let brightness = this._mainSpriteFilter.brightness();
            if (brightness > targetCondition.brightness) {
                brightness = Math.max(brightness - 10, targetCondition.brightness);
            } else if (brightness < targetCondition.brightness) {
                brightness = Math.min(brightness + 50, targetCondition.brightness);
            }
            this._mainSpriteFilter.setBrightness(brightness);

            // 不透明度
            const opacity = this._mainSprite.opacity;
            if (opacity > targetCondition.opacity) {
                this._mainSprite.opacity = Math.max(opacity - 10, targetCondition.opacity);
            } else if (opacity < targetCondition.opacity) {
                this._mainSprite.opacity = Math.min(opacity + 50, targetCondition.opacity);
            }
        }
    };

    /**
     * メインスプライトの色補正を得る。
     * 
     * @return {Object} 色補正
     */
    Sprite_BattleHudActor.prototype.mainSpriteColorCondition = function() {
        return {
            saturation : this.mainSpriteSaturation(),
            brightness : this.mainSpriteBrightness(),
            opacity : this.mainSpriteOpacity(),
        };
    };

    /**
     * メインスプライトの彩度補正値を得る。
     * 
     * @return {Number} 彩度補正値(0～255)
     */
    Sprite_BattleHudActor.prototype.mainSpriteSaturation = function() {
        return (this._actor.isDead()) ? 0 : 255;
    };

    /**
     * メインスプライトの輝度補正値を取得する。
     * 
     * @return {Number} 輝度(0～255)
     */
    Sprite_BattleHudActor.prototype.mainSpriteBrightness = function() {
        return (this._actor.isDead()) ? 128 : 255;
    };
    /**
     * メインスプライトの不透明度を得る。
     * 
     * @return {Number} 不透明度(0～255)
     */
    Sprite_BattleHudActor.prototype.mainSpriteOpacity = function() {
        return 255;
    };

    /**
     * このSpriteの可視状態を更新する。
     */
    Sprite_BattleHudActor.prototype.updateVisibility = function() {
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
    Sprite_BattleHudActor.prototype.updateBitmap = function() {
        Sprite_Battler.prototype.updateBitmap.call(this);
        const faceName = this._actor.faceName();
        const faceIndex = this._actor.faceIndex();
        if ((faceName !== this._faceName) || (faceIndex !== this._faceIndex)) {
            this.loadMainSpriteBitmapFace(faceName, faceIndex);
        }
    };

    /**
     * Faceをメインスプライト画像として読み出す。
     * 
     * @param {String} faceName 顔グラフィックファイル名
     * @param {Number} faceIndex 顔グラフィックファイル中のインデックス番号
     */
    Sprite_BattleHudActor.prototype.loadMainSpriteBitmapFace = function(faceName, faceIndex) {
        this._mainSprite.bitmap = ImageManager.loadFace(faceName, faceIndex);
        const pw = ImageManager.faceWidth;
        const ph = ImageManager.faceHeight;
        const cw = Math.min(pw, this.statusAreaWidth());
        const ch = Math.min(ph, this.statusAreaHeight());
        const cx = (faceIndex % 4) * pw + Math.min(0, (this.statusAreaWidth() - cw) / 2) + 1;
        const cy = Math.floor(faceIndex / 4) * ph + Math.min(0, (this.statusAreaHeight() - ch) / 2);

        const pos = this.mainSpritePosition();
        this._mainSprite.x = pos.x;
        this._mainSprite.y = pos.y;

        this._mainSprite.setFrame(cx, cy, cw, ch);
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    };


    /**
     * メインスプライトの位置を得る。
     * 
     * @return {Point} スプライトの位置
     */
    Sprite_BattleHudActor.prototype.mainSpritePosition = function() {
        const x = 0;
        const y = -(this.statusAreaHeight() - ImageManager.faceHeight);
        return new Point(x, y);
    };

    /**
     * フレーム（表示領域）を更新する。
     */
    Sprite_BattleHudActor.prototype.updateFrame = function() {
        Sprite_Battler.prototype.updateFrame.call(this);
    };

    /**
     * ダメージポップアップ位置Yを取得する。
     * 
     * @return {Number} ポップアップ位置y
     */
    Sprite_BattleHudActor.prototype.damageOffsetY = function() {
        return ImageManager.faceHeight - this.statusAreaHeight();
    };
    //------------------------------------------------------------------------------
    // DisplayBattlePictureFilter
    /**
     * DisplayBattlePictureFilter。
     * カラーフィルター。
     * 画面上の指定したX位置を境界として、左側を非表示、右側を表示させる。
     * 画面上の指定したY位置を境界として、上側を表示、下側を非表示にする。
     */
    function DisplayBattlePictureFilter() {
        this.initialize(...arguments);
    };

    DisplayBattlePictureFilter.prototype = Object.create(PIXI.Filter.prototype);
    DisplayBattlePictureFilter.prototype.constructor = DisplayBattlePictureFilter;

    /**
     * DisplayBattlePictureFilterを初期化する。
     */
    DisplayBattlePictureFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, null, this._fragmentSrc());
        this.uniforms.validX = 1000.0;
        this.uniforms.zeroX = 900.0;
        this.uniforms.validWidth = 100.0;
        this.uniforms.validY = 680.0;
        this.uniforms.zeroY = 720.0;
        this.uniforms.validHeight = 40.0;
    };

    /**
     * 表示を行う水平方向位置を得る。
     * 
     * @param {Number} x 画面上のX位置
     */
    DisplayBattlePictureFilter.prototype.setValidX = function(x) {
        this.uniforms.validX = Number(x) || 0;
        this.uniforms.zeroX = this.uniforms.validX - this.uniforms.validWidth;
    }

    /**
     * フラグメントシェーダーソースを得る。
     */
    DisplayBattlePictureFilter.prototype._fragmentSrc = function() {
        // GLSLよくわからん。
        // gl_FragCoordはピクセル毎に更新されるっぽい。
        const src =
            "varying vec2 vTextureCoord;" +
            "uniform sampler2D uSampler;" +
            "uniform float validX;" +
            "uniform float zeroX;" +
            "uniform float validWidth;" +
            "uniform float validY;" +
            "uniform float zeroY;" +
            "uniform float validHeight;" +
            "float getRateX(float x) {" +
            "  if (x > validX) {" +
            "    return 1.0;" +
            "  } else if (x > zeroX) {" +
            "    return ((x - zeroX) / validWidth);" +
            "  } else {" +
            "    return 0.0;" +
            "  }" +
            "}" +
            "float getRateY(float y) {" +
            "  if (y < validY) {" +
            "    return 1.0;" +
            "  } else if (y < zeroY) {" +
            "    return ((zeroY - y) / validHeight);" +
            "  } else {" +
            "    return 0.0;" +
            "  }" +
            "}" +
            "float getRate(float x, float y) {" +
            "  return min(getRateX(x), getRateY(y));" +
            "}" +
            "void main() {" +
            "  vec4 sample = texture2D(uSampler, vTextureCoord);" +
            "  float rate = getRate(gl_FragCoord.x, gl_FragCoord.y);" +
            "  float r = sample.r * rate;" +
            "  float g = sample.g * rate;" +
            "  float b = sample.b * rate;" +
            "  float a = sample.a * rate;" +
            "  gl_FragColor = vec4(r, g, b, a);" +
            "}";
        return src;
    };

    //------------------------------------------------------------------------------
    // BattleHudActorFilter
    /**
     * BattleHudActorFilter
     * カラーフィルター。
     */
    function BattleHudActorFilter() {
        this.initialize(...arguments);
    };

    BattleHudActorFilter.prototype = Object.create(PIXI.Filter.prototype);
    BattleHudActorFilter.prototype.constructor = BattleHudActorFilter;

    /**
     * BattleHudActorFilterを初期化する。
     */
    BattleHudActorFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, null, this._fragmentSrc());
        this.uniforms.saturation = 255;
        this.uniforms.brightness = 255;
    };

    /**
     * 色差を設定する。
     * 
     * @param {Number} saturation 色差変更値
     */
    BattleHudActorFilter.prototype.setSaturation = function(saturation) {
        this.uniforms.saturation = saturation.clamp(0, +255.0);
    };

    /**
     * 色差を取得する。
     * 
     * @return {Number} 色差変更値
     */
    BattleHudActorFilter.prototype.saturation = function() {
        return this.uniforms.saturation;
    };

    /**
     * 輝度補正値を設定する。
     * 
     * @param {Number} brightness 輝度
     */
    BattleHudActorFilter.prototype.setBrightness = function(brightness) {
        this.uniforms.brightness = brightness.clamp(0, 255.0);
    };

    /**
     * 輝度補正値を得る。
     * 
     * @return {Number} 輝度補正値
     */
    BattleHudActorFilter.prototype.brightness = function() {
        return this.uniforms.brightness;
    };

    /**
     * フラグメントシェーダーソースを得る。
     */
    BattleHudActorFilter.prototype._fragmentSrc = function() {
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
    // Sprite_BattleHudPicture
    Sprite_BattleHudPicture.prototype = Object.create(Sprite.prototype);
    Sprite_BattleHudPicture.prototype.constructor = Sprite_BattleHudPicture;

    /**
     * Sprite_BattleHudPictureを初期化する。
     */
    Sprite_BattleHudPicture.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this, ...arguments);
        this.anchor.x = 0.5;
        this.anchor.y = 1.0; // 下基準
        this.x = Graphics.boxWidth; // 右端
        this.y = Graphics.boxHeight; // 下端を揃える。
        this._battler = null;
        this._pictureName = "";
        this._horizontalAlphaFilter = new DisplayBattlePictureFilter();
        this.filters = [];
        this.filters.push(this._horizontalAlphaFilter)
    };

    /**
     * このスプライトが表示するGame_Battlerを設定する。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     */
    Sprite_BattleHudPicture.prototype.setBattler = function(battler) {
        if (battler !== this._battler) {
            this._battler = battler;
        }
    };

    /**
     * Sprite_BattleHudPictureを更新する。
     */
    Sprite_BattleHudPicture.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updateVisibility();
        this.updateMovement();
    };

    /**
     * Bitmapを更新する。
     */
    Sprite_BattleHudPicture.prototype.updateBitmap = function() {
        if (this._battler) {
            const pictureName = this._battler.battlePicture();
            if (this._pictureName !== pictureName) {
                this._pictureName = pictureName;
                this.bitmap = this.loadBattlePicture();
                // 画像が変更されたら透過状態にする。コマンド選択中に変更されてもふわっと出てくる（はず）
                this.opacity = 0;
            }
        } else {
            this.bitmap = null;
        }
    };

    /**
     * コマンド選択中に表示するがぞうをロードする。
     * 
     * @return {Bitmap} Bitmapオブジェクト。表示する画像がない場合にはnull
     */
    Sprite_BattleHudPicture.prototype.loadBattlePicture = function() {
        if (this._pictureName) {
            try {
                return ImageManager.loadPicture(this._pictureName);
                // const bitmap = new Bitmap(640, 800);
                // bitmap.fillAll("black");
                // return bitmap;
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
     * 表示状態を更新する。
     */
    Sprite_BattleHudPicture.prototype.updateVisibility = function() {
        if (this._battler) {
            if (this._battler.isInputting()) {
                // コマンド入力中は表示。
                this.visible = true;
            } else {
                // コマンド入力キャンセルor入力完了しても、
                // ふわっと消えるようにする。
                if ((this.opacity < 32) || (this.x >= Graphics.boxWidth)) {
                    this.visible = false;
                }
            }
        } else {
            this.visible = false;
        }
    };

    /**
     * 表示の移動を処理する。
     */
    Sprite_BattleHudPicture.prototype.updateMovement = function() {
        if (this._battler) {
            const distance = 240;
            const movePos = Graphics.boxWidth - distance;
            const addCount = Math.max(1, Math.floor(distance / 20));
            if (this._battler.isInputting()) {
                if (this.x > movePos) {
                    this.x -= addCount;
                }
                if (this.opacity < 255) {
                    this.opacity += 10;
                    if (this.opacity >= 255) {
                        this.opacity = 255;
                    }
                }
            } else {
                if (this.x < Graphics.boxWidth) {
                    this.x += addCount;
                }
                if (this.opacity > 0) {
                    this.opacity -= 25;
                    if (this.opacity < 0) {
                        this.opacity = 0;
                    }
                }
            }
            if (this.bitmap != null) {
                if (this.bitmap.height < (Graphics.boxHeight - 180)) {
                    this.y = 180 + this.bitmap.height;
                } else {
                    this.y = Graphics.boxHeight;
                }
            } else {
                this.y = Graphics.boxHeight;
            }
        } else {
            this.x = Graphics.boxWidth;
            this.y = Graphics.boxHeight;
            this.opacity = 0;
        }
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
            const sprite = new Sprite_BattleHudActor();
            this._actorHudSprites.push(sprite);
            this._battleField.addChild(sprite);
        }

        const insertIndex = this._baseSprite.getChildIndex(this._battleField);
        this._actorPictureSprites = [];
        for (let i = 0; i < maxBattleMembers; i++) {
            const sprite = new Sprite_BattleHudPicture();
            this._actorPictureSprites.push(sprite);
            if (insertIndex >= 0) {
                this._baseSprite.addChildAt(sprite, insertIndex);
            } else {
                this._baseSprite.addChild(sprite);
            }
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
        for (let i = 0; i < this._actorPictureSprites.length; i++) {
            this._actorPictureSprites[i].setBattler(members[i]);
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
        const rect = this.itemNameWindowRect();
        this._itemNameWindow = new Window_HudItemName(rect);
        this._itemNameWindow.hide();
        this.addChild(this._itemNameWindow);
    };

    /**
     * ヘルプウィンドウの表示領域を取得する。
     * 
     * @return {Rectangle} ヘルプウィンドウの表示領域を表すRectangle.
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.helpWindowRect = function() {
        const ww = Math.min(816, Graphics.boxWidth);
        const wh = this.helpAreaHeight();
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = this.helpAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * メッセージウィンドウの位置を取得する。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     */
    Scene_Message.prototype.messageWindowRect = function() {
        const ww = Math.min(816, Graphics.boxWidth);
        const wh = this.calcWindowHeight(4, false) + 8;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスウィンドウ矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.statusWindowRect = function() {
        const extra = 10;
        const ww = listWindowWidth;
        const wh = this.windowAreaHeight() + extra;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = Graphics.boxHeight - wh + extra - 4;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * パーティーコマンドの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.partyCommandWindowRect = function() {
        const itemNameRect = this.itemNameWindowRect();
        const ww = commandWindowWidth;;
        const wh = this.windowAreaHeight();
        const wx = commandWindowX;
        const wy = itemNameRect.y + itemNameRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アクターコマンドの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.actorCommandWindowRect = function() {
        const itemWindowRect = this.itemNameWindowRect();
        const ww = commandWindowWidth;
        const wh = this.windowAreaHeight();
        const wx = commandWindowX;
        const wy = itemWindowRect.y + itemWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Base_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    /**
     * アクターコマンドウィンドウ(_actorCommandWindow)を作成する。
     * 
     * Note: ベーシックシステムでは、ウィンドウ作成時にyが上書きされているため、
     *       レイアウトを変えるためにフックする必要がある。
     */
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Base_createActorCommandWindow.call(this);
        this._actorCommandWindow.y = this.actorCommandWindowRect().y;
    };


    /**
     * スキルウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.skillWindowRect = function() {
        const itemNameRect = this.itemNameWindowRect();
        const ww = Math.min(Graphics.boxWidth, 816);
        const wh = this.windowAreaHeight();
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = itemNameRect.y + itemNameRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ログウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.logWindowRect = function() {
        const ww = Math.min(816, Graphics.boxWidth);
        const wh = this.calcWindowHeight(10, false);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アイテム名表示の矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.itemNameWindowRect = function() {
        const width = 240;
        const height = 64;
        const x = Graphics.boxWidth - width;
        const y = 180;
        return new Rectangle(x, y, width, height);
    };

    /**
     * ステータスウィンドウを作成する。
     * 
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.createStatusWindow = function() {
    };

    /**
     * アクター選択ウィンドウのウィンドウ位置を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.actorWindowRect = function() {
        const itemNameWindowRect = this.itemNameWindowRect();
        const ww = commandWindowWidth;
        const wh = this.windowAreaHeight();
        const wx = commandWindowX;
        const wy = itemNameWindowRect.y + itemNameWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * エネミーウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} エネミーウィンドウの矩形領域。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.enemyWindowRect = function() {
        const itemNameWindowRect = this.itemNameWindowRect();
        const ww = commandWindowWidth;
        const wh = this.windowAreaHeight();
        const wx = commandWindowX;
        const wy = itemNameWindowRect.y + itemNameWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * Scene_Battleを開始する。
     * 
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
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
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
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
    };

    /**
     * ステータスウィンドウの表示状態を更新する。
     * 
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.updateStatusWindowVisibility = function() {
    };



    /**
     * パーティーコマンド選択を開始する。
     * 
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
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
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
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
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
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
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
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
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
     *      他、対象を視認しやすいよう、アイテムウィンドウ/スキルウィンドウを非表示にする。
     *        
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.startEnemySelection = function() {
        this._itemWindow.hide();
        this._skillWindow.hide();
        this._enemyWindow.refresh();
        this._enemyWindow.show();
        this._enemyWindow.select(0);
        this._enemyWindow.activate();
    };
    /**
     * エネミー選択/スキル選択/アイテム選択でキャンセル操作されたときの処理を行う。
     * 
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
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
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
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
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
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
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
     * !!!overwrite!!!
     */
    Scene_Battle.prototype.endCommandSelection = function() {
        this.closeCommandWindows();
        this.hideSubInputWindows();
    };

    const _Scene_Battle_hideSubInputWindows = Scene_Battle.prototype.hideSubInputWindows;

    /**
     * サブ入力ウィンドウを非表示にする。
     */
    Scene_Battle.prototype.hideSubInputWindows = function() {
        _Scene_Battle_hideSubInputWindows.call(this);
        this._itemNameWindow.hide();
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

    const _Scene_Battle_startActorSelection = Scene_Battle.prototype.startActorSelection;

    /**
     * アクター選択を開始する。
     */
    Scene_Battle.prototype.startActorSelection = function() {
        _Scene_Battle_startActorSelection.call(this);
        this._skillWindow.hide();
        this._itemWindow.hide();
        const action = BattleManager.inputtingAction();
        const item = action.item();
        if (item !== null) {
            this._itemNameWindow.setItem(item);
            this._itemNameWindow.show();
        }
    };

    const _Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk;

    /**
     * アクター選択でOKが選択されたときの処理を行う。
     */
    Scene_Battle.prototype.onActorOk = function() {
        _Scene_Battle_onActorOk.call(this);
        $gameParty.select(null);
        this._actorSelecting = false;
        this._itemNameWindow.hide();
    };

    const _Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
    
    /**
     * アクター選択でキャンセルされたときの処理を行う。
     */
    Scene_Battle.prototype.onActorCancel = function() {
        this._itemNameWindow.hide();
        _Scene_Battle_onActorCancel.call(this);
    };

    const _Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;

    /**
     * いずれかの入力ウィンドウがアクティブ（選択中）かどうかを判定する。
     * 
     * @return {Boolean} いずれかの入力ウィンドウがアクティブな場合にはtrue, それ以外はfalse
     */
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        return _Scene_Battle_isAnyInputWindowActive.call(this);
    };
})();