/*:ja
 * @target MZ 
 * @plugindesc Twld向けに作成した戦闘システムの変更
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command setBattlePicture
 * @text アクター戦闘画像設定
 * @desc 戦闘中にコマンド入力欄脇に表示するグラフィックを設定する。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 変更するアクターのID
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc アクターを変数の値で指定する場合に指定する変数ID
 * @type number
 * 
 * @arg fileName
 * @text ファイル名
 * @desc 設定する画像ファイル
 * @type file
 * @dir img/pictures/
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
 * @text HPラベルフォントサイズ
 * @desc HPゲージのラベルフォントサイズ
 * @default 16
 * @type number
 * @parent ui
 * 
 * @param valueHpFontSize
 * @text HP値フォントサイズ
 * @desc HPゲージの値フォントサイズ
 * @default 24
 * @type number
 * @parent ui
 * 
 * @param labelFontSize
 * @text MP/TPラベルフォントサイズ
 * @desc MP/TPゲージのラベルフォントサイズ
 * @default 12
 * @type number
 * @parent ui
 * 
 * @param valueFontSize
 * @text MP/TP値フォントサイズ
 * @desc MP/TPゲージの値フォントサイズ
 * @default 12
 * @type number
 * @parent ui
 * 
 * @param displayMaxValue
 * @text MP/TP最大値表示
 * @desc trueにするとMP/TP数値で最大値を表示する。
 * @type boolean
 * @default true
 * @parent ui
 * 
 * @param layout
 * @text レイアウト設定
 * 
 * @param listWindowWidth
 * @text リストウィンドウ幅
 * @desc リストウィンドウの幅。
 * @default 816
 * @type number
 * @parent layout
 * 
 * @param commandWindowX
 * @text コマンドウィンドウ位置X
 * @desc コマンドウィンドウの水平位置
 * @default 1068
 * @type number
 * @parent layout
 * 
 * @param commandWindowWidth
 * @text コマンドウィンドウ幅
 * @desc コマンドウィンドウの幅
 * @default 192
 * @type number
 * @parent layout
 * 
 * @param commandWindowRowCount
 * @text コマンドウィンドウの行数
 * @desc コマンドウィンドウの行数。画面を超えるようなサイズを指定した場合、表示可能範囲に制限される。
 * @type number
 * @default 4
 * @parent layout
 * 
 * @param statusAreaWidth
 * @text ステータスエリア幅
 * @desc 1アクターのステータスエリアの幅
 * @default 160
 * @type number
 * @parent layout
 * 
 * @param statusAreaPadding
 * @text ステータスエリアのパディング
 * @desc アクターHUD間の幅
 * @default 16
 * @type number
 * @parent layout
 * 
 * @param statusAreaHeight
 * @text ステータスエリア高さ
 * @desc 1アクターのステータスエリアの高さ
 * @default 220
 * @type number
 * @parent layout
 * 
 * @param statusAreaOffsetX
 * @text ステータスエリア位置X
 * @desc ステータスエリアの水平位置
 * @default 60
 * @type number
 * @parent layout
 * 
 * @param enemyAreaOffsetX
 * @text エネミーエリア位置X
 * @desc エネミーエリアの水平位置X
 * @default 162
 * @type number
 * @parent layout
 * 
 * @param displayEnemyGauge
 * @text エネミーゲージを表示する
 * @desc trueにするとエネミーのHP/TPBゲージを表示するようになります。
 * @type boolean
 * @default true
 *
 * @param useBattlePicture
 * @text アクターHUDにBattlePictureを使用する。
 * @desc アクターHUDにBattlePictureを使用する。falseにすると顔グラフィックを使用する。
 * @type boolean
 * @default false
 * 
 * @param pictureYOffset
 * @text Yオフセット
 * @desc アクターHUDに表示するBattlePicture上端からのオフセット。
 * @type number
 * @default 0
 * @parent useBattlePicture
 * 
 * @param pictureDisplayHeight
 * @text Y表示高
 * @desc アクターHUDに表示するBattlePictureの表示する高さ。
 * @type number
 * @default 400
 * @parent useBattlePicture
 * 
 * @param pictureZoom
 * @text 表示倍率
 * @desc アクターHUDに表示するBattlePicutureの表示倍率
 * @type number
 * @decimals 2
 * @default 1.00
 * @parent useBattlePicture
 * 
 * @param pictureMethod
 * @text メソッド名
 * @desc 画像データ名をactorから取得するためのメソッド/プロパティ名
 * @type string
 * @default battlePicture
 * @parent useBattlePicture
 * 
 * 
 * @param enableInputtingZoom
 * @text 入力中ズーム動作
 * @desc コマンド入力中、対象アクターをズーム表示させる。
 * @type boolean
 * @default false
 *  
 *  
 * @requiredAssets img/hud/ActiveHud
 * 
 * @help 
 * Twld向けに作成した戦闘シーンのUI処理プラグイン。
 * 
 * GLSLソースで使用しているRGB<->HSL変換は
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
 * Version.0.1.0 TWLD向けに新規作成した。
 */
/**
 * Sprite_BattleHudHpGauge
 * 
 * @class
 * HPゲージ。
 */
function Sprite_BattleHudHpGauge() {
    this.initialize(...arguments);
}


/**
 * Sprite_BattleHudMpTpGauge。
 * @class
 * MP/TPゲージ
 */
function Sprite_BattleHudMpTpGauge() {
    this.initialize(...arguments);
}


/**
 * Sprite_BattleHudTpbGauge。
 * @class
 * TPBゲージ
 */
function Sprite_BattleHudTpbGauge() {
    this.initialize(...arguments);
}



/**
 * Sprite_BattleHudActorName。
 * @class
 * Sprite_Nameから表示を変更するために派生して使う。
 */
function Sprite_BattleHudActorName() {
    this.initialize(...arguments);
}


/**
 * Sprite_HudStateIcons。
 * @class
 * ステートアイコンを表示するためのスプライト。
 * 一度に4つずつ表示するために用意したが、
 * Sprite_StateIconを複数並べる方式の方がリソース節約になるかもしれない。
 */
function Sprite_HudStateIcons() {
    this.initialize(...arguments);
}


/**
 * Sprite_BattleHudActor
 * @class
 * アクター情報を表示するHUD。
 */
function Sprite_BattleHudActor() {
    this.initialize(...arguments);
}

/**
 * Sprite_BattleHudPicture。
 * @class
 * コマンド入力ウィンドウの脇に、でっかく表示するアクター画像のスプライト。
 */
function Sprite_BattleHudPicture() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_Twld_BattleSystem";
    const parameters = PluginManager.parameters(pluginName);
    const maxBattleMembers = Number(parameters["maxBattleMembers"]) || 4;
    const tpbCastLabel = parameters["tpbCastLabel"] || "Casting";
    const gaugeLabelHpFontSize = Number(parameters["labelHpFontSize"]) || 16;
    const gaugeValueHpFontSize = Number(parameters["valueHpFontSize"]) || 24;
    const gaugeLabelFontSize = Number(parameters["labelFontSize"]) || 12;
    const gaugeValueFontSize = Number(parameters["valueFontSize"]) || 12;
    const displayMaxValue = (parameters["displayMaxValue"] === undefined)
            ? true : (parameters["displayMaxValue"] === "true");

    const displayEnemyGauge = (parameters["displayEnemyGauge"] === undefined)
            ? false : (parameters["displayEnemyGauge"] === "true");

    const listWindowWidth = Number(parameters["listWindowWidth"]) || 816;
    const commandWindowX = Number(parameters["commandWindowX"]) || 1068;
    const commandWindowWidth = Number(parameters["commandWindowWidth"]) || 192;
    const commandWindowRowCount = Number(parameters["commandWindowRowCount"]) || 4;
    const statusAreaWidth = Number(parameters["statusAreaWidth"]) || 160;
    const statusAreaPadding = Number(parameters["statusAreaPadding"]) || 16;
    const statusAreaHeight = Number(parameters["statusAreaHeight"]) || 220;
    const statusAreaOffsetX = Number(parameters["statusAreaOffsetX"]) || 192;
    const enemyAreaOffsetX = Number(parameters["enemyAreaOffsetX"]) || 162;
    const useBattlePicture = (parameters["useBattlePicture"] === undefined)
            ? false : (parameters["useBattlePicture"] === "true");
    const pictureYOffset = Number(parameters["pictureYOffset"]) || 0;
    const pictureDisplayHeight = Number(parameters["pictureDisplayHeight"]) || 400;
    const pictureZoom = Number(parameters["pictureZoom"]) || 1;
    const pictureMethod = parameters["pictureMethod"] || "battlePicture";
    const enableInputtingZoom = (parameters["enableInputtingZoom"] === undefined)
            ? false : (parameters["enableInputtingZoom"] === "true");

    /**
     * アクターIDを得る。
     * 
     * @param {object} args 引数
     */
    const _getActorId = function(args) {
        const actorId = Number(args.actorId) || 0;
        const variableId = Number(args.variableId) || 0;
        if (actorId > 0) {
            return actorId;
        } else if (variableId > 0) {
            return $gameVariables.value(variableId);
        } else {
            return 0;
        }
    };

    PluginManager.registerCommand(pluginName, "setBattlePicture", args => {
        const actorId = _getActorId(args);
        let fileName = args.fileName;
        if (actorId) {
            $gameActors.actor(actorId).setBattlePicture(fileName);
        }
    });

    /**
     * TPBキャスト中ゲージ色1を得る。
     * 
     * @returns {string} CSSスタイルの色データ
     */
    ColorManager.tpbCastGaugeColor1 = function() {
        return ColorManager.mpGaugeColor2();
    };
    /**
     * TPBキャスト中ゲージ色2を得る。
     * 
     * @returns {string} CSSスタイルの色データ
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
     * @returns {boolean} サイドビューの場合にはtrue, それ以外はfalse
     */
    Game_System.prototype.isSideView = function() {
        return false;
    };
    //------------------------------------------------------------------------------
    // Game_Battler

    /**
     * TPBキャスト中かどうかを判定する。
     * 
     * @returns {boolean} TPBキャスト中の場合にはtrue, それ以外はfalse
     */
    Game_Battler.prototype.isTpbCasting = function() {
        return (this._tpbState === "casting");
    };

    /**
     * TPBキャストタイムを得る。
     * 
     * @returns {number} TPBキャストタイム
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
     * @param {number} actorId アクターID
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
     * @returns {string} フロントビュー戦闘グラフィックファイル名。
     */
    Game_Actor.prototype.battlePicture = function() {
        return this._battlePicture;
    };

    /**
     * フロントビュー戦画像ファイル名を設定する。
     * 
     * @param {string} pictureName フロントビュー戦闘グラフィックファイル名。
     */
    Game_Actor.prototype.setBattlePicture = function(pictureName) {
        this._battlePicture = pictureName;
        $gameTemp.requestBattleRefresh();
    };

    /**
     * 戦闘グラフィックのスプライトを表示するかどうかを取得する。
     * isSpriteVisibleがtrueになっていないと、ダメージポップアップは表示されない。
     * 
     * @returns {boolean} スプライトを表示する場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isSpriteVisible = function() {
        return true;
    };

    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * 最大戦闘参加メンバー数を得る。
     * @returns {number} 最大戦闘参加メンバー数が返る。
     */
    Game_Party.prototype.maxBattleMembers = function() {
        return maxBattleMembers;
    };

    //------------------------------------------------------------------------------
    // Window_HudItemName
    /**
     * Window_HudItemName。
     * 
     * @class
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
     * @param {object} item アイテム。(DataItem/DataWeapon/DataArmor/DataSkill)
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
     * @param {number} index インデックス番号
     */
    Window_BattleActor.prototype.drawItem = function(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        this.drawActorName(actor, rect.x, rect.y, rect.width);
    };

    /**
     * 最大カラム数を得る。
     * 
     * @returns {number} 最大カラム数
     */
    Window_BattleActor.prototype.maxCols = function() {
        return 1;
    };

    /**
     * 1項目の高さを得る。
     * 
     * @returns {number} 1項目の高さ。
     */
    Window_BattleStatus.prototype.itemHeight = function() {
        return this.lineHeight();
    };

    /**
     * 最大行数を得る。
     * 
     * @returns {number} 最大行数。
     */
    Window_BattleActor.prototype.maxRows = function() {
        return this.innerHeight / this.itemHeight();
    };

    /**
     * 行スペースを得る。
     * 
     * @returns {number} 行スペース
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
     * @returns {number} 最大カラム数
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
    // Sprite_BattleHudHpGauge
    Sprite_BattleHudHpGauge.prototype = Object.create(Sprite_Gauge.prototype);
    Sprite_BattleHudHpGauge.prototype.constructor = Sprite_BattleHudHpGauge;
    

    /**
     * Sprite_BattleHudHpGaugeを初期化する。
     */
    Sprite_BattleHudHpGauge.prototype.initialize = function() {
        Sprite_Gauge.prototype.initialize.call(this);
        this._drawValue = true;
    };

    /**
     * このSprite_Gaugeが表示するステータスをセットアップする。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     * @param {string} statusType 表示するステータスタイプ。(既定の実装では'hp', 'mp', 'tp', 'time'のいずれか)
     */
    Sprite_BattleHudHpGauge.prototype.setup = function(battler, statusType) {
        Sprite_Gauge.prototype.setup.call(this, battler, statusType);
        this.startAnimation();
    };

    /**
     * 値を描画するかどうかを設定する。
     * 
     * @param {boolean} isDraw 値を描画するかどうか
     */
    Sprite_BattleHudHpGauge.prototype.setDrawValue = function(isDraw) {
        if (this._drawValue !== isDraw) {
            this._drawValue = isDraw;
            this.redraw();
        }
    };
    /**
     * ラベルのフォントサイズを得る。
     * 
     * @returns {number} フォントサイズ
     */
    Sprite_BattleHudHpGauge.prototype.labelFontSize = function() {
        return gaugeLabelHpFontSize;
    };

    /**
     * ゲージ描画のX位置を取得する。
     * 
     * @returns {number} X位置
     */
    Sprite_BattleHudHpGauge.prototype.gaugeX = function() {
        return 16;
    };

    /**
     * 値のフォントサイズを得る。
     * 
     * @returns {number} 値のフォントサイズ。
     */
    Sprite_BattleHudHpGauge.prototype.valueFontSize = function() {
        return gaugeValueHpFontSize;
    };

    /**
     * ラベルを描画する。
     */
    Sprite_BattleHudHpGauge.prototype.drawLabel = function() {
        const label = this.label();
        const x = this.labelOutlineWidth() / 2;
        const y = this.labelY();
        const labelWidth = (this.bitmapWidth() - 16) * 0.2; // 最大で20%を使用する。
        const height = this.bitmapHeight();
        this.setupLabelFont();
        this.bitmap.paintOpacity = this.labelOpacity();
        this.bitmap.drawText(label, x, y, labelWidth, height, "left");
        this.bitmap.paintOpacity = 255;
    };

    /**
     * 値を描画する。
     */
    Sprite_BattleHudHpGauge.prototype.drawValue = function() {
        const currentValue = this.currentValue();
        const maxValue = this.currentMaxValue();
        const width = this.bitmapWidth();
        let x = Math.round((width - 16) * 0.2);
        const valueWidth = Math.round((width - 16 - x) * 0.7);
        const maxValueWidth = Math.round((width - 16 - x) * 0.3);
        const height = this.bitmapHeight();
        this.setupValueFont();
        this.bitmap.drawText(currentValue,
                x, 0, valueWidth, height, "right");
        x += valueWidth;
        this.setupMaxValueFont();
        const maxValueY = this.labelY();
        this.bitmap.drawText("/", x, maxValueY, 16, height, "center");
        x += 16;
        this.bitmap.drawText(maxValue, x, maxValueY, maxValueWidth, height, "right");
    };

    /**
     * 最大値表示用フォントをセットアップする。
     */
    Sprite_BattleHudHpGauge.prototype.setupMaxValueFont = function() {
        this.bitmap.fontFace = this.valueFontFace();
        this.bitmap.fontSize = this.labelFontSize();
        this.bitmap.textColor = this.valueColor();
        this.bitmap.outlineColor = this.valueOutlineColor();
        this.bitmap.outlineWidth = this.valueOutlineWidth();
    };

    /**
     * ゲージを再描画する。
     */
    Sprite_BattleHudHpGauge.prototype.redraw = function() {
        this.bitmap.clear();
        const currentValue = this.currentValue();
        if (!isNaN(currentValue)) {
            this.drawGauge();
            this.drawLabel();
            if (this._drawValue && this.isValid()) {
                this.drawValue();
            }
        }
    };
    /**
     * ターゲット値を更新する。
     * 
     * @param {number} value 現在値
     * @param {number} maxValue 最大値
     */
     Sprite_BattleHudHpGauge.prototype.updateTargetValue = function(value, maxValue) {
        this._targetValue = value;
        this._targetMaxValue = maxValue;
        if (isNaN(this._value)) {
            this._value = value;
            this._maxValue = maxValue;
            this.redraw();
        } else {
            this._duration = this.smoothness();
        }
    };
    /**
     * アニメーションを開始する。
     */
    Sprite_BattleHudHpGauge.prototype.startAnimation = function() {
        // ゲージアニメーションの更新は、_duration が0より大きい値にセットされているときだけである。
        // ダメージポップアップ要求が出ているときだけ更新してみる。
        this._duration = this.smoothness();
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
     * @returns {number} Bitmapの幅。
     */
    Sprite_BattleHudMpTpGauge.prototype.bitmapWidth = function() {
        return 96;
    };

    /**
     * Bitmapの高さを得る。
     * 
     * @returns {number} Bitmapの高さ。
     */
    Sprite_BattleHudMpTpGauge.prototype.bitmapHeight = function() {
        return 18;
    };

    /**
     * ゲージの高さを得る。
     * 
     * @returns {number} ゲージの高さ。
     */
    Sprite_BattleHudMpTpGauge.prototype.gaugeHeight = function() {
        return 8;
    };

    /**
     * ラベルのフォントサイズを得る。
     * 
     * @returns {number} フォントサイズ
     */
    Sprite_BattleHudMpTpGauge.prototype.labelFontSize = function() {
        return gaugeLabelFontSize;
    };

    /**
     * 値のフォントサイズを得る。
     * 
     * @returns {number} 値のフォントサイズ。
     */
    Sprite_BattleHudMpTpGauge.prototype.valueFontSize = function() {
        return gaugeValueFontSize;
    };

    /**
     * ゲージ描画のX位置を取得する。
     * 
     * @returns {number} X位置
     */
    Sprite_BattleHudMpTpGauge.prototype.gaugeX = function() {
        return 16;
    };
    /**
     * ラベルを描画する。
     */
    Sprite_BattleHudMpTpGauge.prototype.drawLabel = function() {
        const label = this.label();
        const x = this.labelOutlineWidth() / 2;
        const y = this.labelY();
        const labelWidth = (this.bitmapWidth() - 16) * 0.2; // 最大で20%を使用する。
        const height = this.bitmapHeight();
        this.setupLabelFont();
        this.bitmap.paintOpacity = this.labelOpacity();
        this.bitmap.drawText(label, x, y, labelWidth, height, "left");
        this.bitmap.paintOpacity = 255;
    };


    /**
     * 値を描画する。
     */
    Sprite_BattleHudMpTpGauge.prototype.drawValue = function() {
        const currentValue = this.currentValue();
        const width = this.bitmapWidth();
        let x = Math.round((this.width - 16) * 0.2);
        const height = this.bitmapHeight();
        this.setupValueFont();
        if (displayMaxValue) {
            const maxValue = this.currentMaxValue();
            const valueWidth = (width - x - 16) / 2;
            this.bitmap.drawText(currentValue, x, 0, valueWidth, height, "right");
            x += valueWidth;
            this.bitmap.drawText("/", x, 0, 16, height, "center");
            x += 16;
            this.bitmap.drawText(maxValue, x, 0, valueWidth, height, "right");
        } else{
            const valueWidth = width - x;
            this.bitmap.drawText(currentValue, x, 0, valueWidth, height, "right");
        }
    };

    //------------------------------------------------------------------------------
    // Sprite_BattleHudTpbGauge
    Sprite_BattleHudTpbGauge.prototype = Object.create(Sprite_Gauge.prototype);
    Sprite_BattleHudTpbGauge.prototype.constructor = Sprite_BattleHudTpbGauge;

    /**
     * Sprite_BattleHudTpbGaugeを初期化する。
     */
    Sprite_BattleHudTpbGauge.prototype.initialize = function() {
        Sprite_Gauge.prototype.initialize.call(this);
    };

    /**
     * Bitmapの幅を得る。
     * 
     * @returns {number} Bitmapの幅。
     */
    Sprite_BattleHudTpbGauge.prototype.bitmapWidth = function() {
        return 96;
    };

    /**
     * Bitmapの高さを得る。
     * 
     * @returns {number} Bitmapの高さ。
     */
    Sprite_BattleHudTpbGauge.prototype.bitmapHeight = function() {
        return 12;
    };

    /**
     * ゲージ描画のX位置を取得する。
     * 
     * @returns {number} X位置
     */
    Sprite_BattleHudTpbGauge.prototype.gaugeX = function() {
        return 0;
    };

    /**
     * ゲージの高さを得る。
     * 
     * @returns {number} ゲージの高さ。
     */
    Sprite_BattleHudTpbGauge.prototype.gaugeHeight = function() {
        return 8;
    };

    /**
     * ラベルのフォントサイズを得る。
     * 
     * @returns {number} フォントサイズ
     */
    Sprite_BattleHudTpbGauge.prototype.labelFontSize = function() {
        return gaugeLabelFontSize;
    };

    /**
     * 値のフォントサイズを得る。
     * 
     * @returns {number} 値のフォントサイズ。
     */
    Sprite_BattleHudTpbGauge.prototype.valueFontSize = function() {
        return gaugeValueFontSize;
    };

    /**
     * 現在値を取得する。
     * 
     * @returns {number} 現在値。
     */
    Sprite_BattleHudTpbGauge.prototype.currentValue = function() {
        if (this._battler && this._statusType === "time" && this._battler.isTpbCasting()) {
            return this._battler.tpbCastTime();
        } else {
            return Sprite_Gauge.prototype.currentValue.call(this);
        }
    };
    /**
     * 現在のゲージ最大値を得る。
     * 
     * @returns {number} ゲージ最大値
     */ 
    Sprite_BattleHudTpbGauge.prototype.currentMaxValue = function() {
        if (this._battler && this._statusType === "time" && this._battler.isTpbCasting()) {
            return this._battler.tpbRequiredCastTime();
        } else {
            return Sprite_Gauge.prototype.currentMaxValue.call(this);
        }
    };

    /**
     * ゲージカラー1を得る。
     * 
     * @returns {string} カラー
     */
    Sprite_BattleHudTpbGauge.prototype.gaugeColor1 = function() {
        if (this._battler && this._statusType === "time" && this._battler.isTpbCasting()) {
            return ColorManager.tpbCastGaugeColor1();
        } else {
            return Sprite_Gauge.prototype.gaugeColor1.call(this);
        }
    };

    /**
     * ゲージカラー2を得る。
     * 
     * @returns {string} カラー
     */
    Sprite_BattleHudTpbGauge.prototype.gaugeColor2 = function() {
        if (this._battler && this._statusType === "time" && this._battler.isTpbCasting()) {
            return ColorManager.tbpCastGaugeColor2();
        } else {
            return Sprite_Gauge.prototype.gaugeColor2.call(this);
        }
    };
    /**
     * ゲージを再描画する。
     */
    Sprite_BattleHudTpbGauge.prototype.redraw = function() {
        this.bitmap.clear();
        const currentValue = this.currentValue();
        if (!isNaN(currentValue)) {
            this.drawGauge();
            this.drawLabel();
        }
    };

    /**
     * TPB timeゲージのラベルを描画する。
     */
    Sprite_BattleHudTpbGauge.prototype.drawLabel = function() {
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
     * @returns {string} TPBタイムラベル
     */
    Sprite_BattleHudTpbGauge.prototype.tpbTimeLabel = function() {
        if (this._battler.isTpbCasting()) {
            return tpbCastLabel;
        } else {
            return null;
        }
    }

    /**
     * ゲージのフラッシュ表示を更新する。
     */
    Sprite_BattleHudTpbGauge.prototype.updateFlashing = function() {
        this._flashingCount++;
        if (this.isFlashing()) {
            if (this._flashingCount % 30 < 15) {
                this.setBlendColor(this.flashingColor1());
            } else {
                this.setBlendColor(this.flashingColor2());
            }
        } else {
            this.setBlendColor([0, 0, 0, 0]);
        }
    };

    /**
     * フラッシュ処理が必要かどうかを取得する。
     * 
     * @returns {boolean} フラッシュが必要な場合にはtrue, それ以外はfalse
     */
    Sprite_BattleHudTpbGauge.prototype.isFlashing = function() {
        return this._battler && (this._battler.isInputting() || this._battler.isTpbCasting());
    };

    /**
     * フラッシュカラー1を得る。
     * 
     * @returns {Array<Number>} フラッシュカラーの配列
     */
    Sprite_BattleHudTpbGauge.prototype.flashingColor1 = function() {
        if (this._battler.isTpbCasting()) {
            return this.flashingCastColor1();
        } else {
            return Sprite_Gauge.prototype.flashingColor1()
        }
    };

    /**
     * フラッシュカラー2を得る。
     * 
     * @returns {Array<Number>} フラッシュカラーの配列
     */
    Sprite_BattleHudTpbGauge.prototype.flashingColor2 = function() {
        if (this._battler.isTpbCasting()) {
            return this.flashingCastColor2();
        } else {
            return Sprite_Gauge.prototype.flashingColor2()
        }
    };

    /**
     * キャスト中ゲージフラッシュカラー1を得る。
     * 
     * @returns {Array<Number>} フラッシュカラー1
     */
    Sprite_BattleHudTpbGauge.prototype.flashingCastColor1 = function() {
        return [255, 255, 255, 64];
    };

    /**
     * キャスト中ゲージフラッシュカラー2を得る。
     * 
     * @returns {Array<Number>} フラッシュカラー2
     */
    Sprite_BattleHudTpbGauge.prototype.flashingCastColor2 = function() {
        return [128, 128, 128, 48];
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
     * @returns {number} Bitmapの高さ
     */
    Sprite_BattleHudActorName.prototype.bitmapHeight = function() {
        return 18;
    };    
    /**
     * Sprite_Nameの名前表示用フォントサイズを得る。
     * 
     * @returns {number} 名前表示用フォントサイズ。
     */
    Sprite_BattleHudActorName.prototype.fontSize = function() {
        return 16;
    };

    /**
     * テキスト描画色を取得する。
     * 
     * @returns {string} 描画色
     */
    Sprite_BattleHudActorName.prototype.textColor = function() {
        if (this._battler && (this._battler.isDead() || this._battler.isDying())) {
            return ColorManager.hpColor(this._battler);
        } else {
            return ColorManager.normalColor();
        }
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
        // bitmapはnewで構築しているので解放が必要。
        // iconBitmapはImageManager経由なのでそちらで上手いこと管理してくれる。
        if (this.bitmap) {
            this.bitmap.destroy();
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
            if (this._iconIndex >= icons.length) {
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
     * @param {number} iconIndex 描画するアイコンのインデックス
     * @param {number} drawIndex 書き込み先位置(0~3)
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
     * @returns {boolean} 表示するべき場合にはtrue, それ以外はfalse.
     */
    Sprite_HudStateIcons.prototype.shouldDisplay = function() {
        const battler = this._battler;
        return battler && (battler.isActor() || battler.isAlive());
    };

    //------------------------------------------------------------------------------
    // Sprite_Enemy
    const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
    /**
     * Sprite_Enemyのメンバーを初期化する。
     */
    Sprite_Enemy.prototype.initMembers = function() {
        _Sprite_Enemy_initMembers.call(this);
        this.createHpGaugeSprite();
        this.createTpbGaugeSprite();
    };
    /**
     * ステートアイコンスプライトを作成する。
     */
    Sprite_Enemy.prototype.createStateIconSprite = function() {
        this._stateIconSprite = new Sprite_HudStateIcons();
        this._stateIconSprite.anchor.x = 0.5;
        this._stateIconSprite.anchor.y = 0.5;
        this.addChild(this._stateIconSprite);
    };

    /**
     * HPゲージスプライトを作成する。
     */
    Sprite_Enemy.prototype.createHpGaugeSprite = function() {
        this._hpGaugeSprite = new Sprite_BattleHudHpGauge();
        this._hpGaugeSprite.setDrawValue(false);
        this._hpGaugeSprite.anchor.x = 0.5;
        this._hpGaugeSprite.anchor.y = 0.5;
        this._hpGaugeSprite.y = 0;
        this.addChild(this._hpGaugeSprite);
    };

    /**
     * TPBゲージスプライトを作成する。
     */
    Sprite_Enemy.prototype.createTpbGaugeSprite = function() {
        this._tpbGaugeSprite = new Sprite_BattleHudTpbGauge();
        this._tpbGaugeSprite.anchor.x = 0.5;
        this._tpbGaugeSprite.anchor.y = 0.5;
        this._tpbGaugeSprite.y = 20;
        this.addChild(this._tpbGaugeSprite);
    };

    const _Sprite_Enemy_setHome = Sprite_Enemy.prototype.setHome;
    /**
     * ホーム位置を設定する。
     * 
     * @param {number} x X位置
     * @param {number} y Y位置
     */
    Sprite_Enemy.prototype.setHome = function(x, y) {
        _Sprite_Enemy_setHome.call(this, x + enemyAreaOffsetX, y);
    };

    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    /**
     * このSprite_Enemyが表現するエネミーを設定する。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     */
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        this._hpGaugeSprite.setup(battler, "hp");
        if (BattleManager.isTpb()) {
            this._tpbGaugeSprite.setup(battler, "time");
        }
    };

    const _Sprite_Enemy_updateVisibility = Sprite_Enemy.prototype.updateVisibility;
    /**
     * このSpriteの可視状態を更新する。
     */
    Sprite_Enemy.prototype.updateVisibility = function() {
        _Sprite_Enemy_updateVisibility.call(this);
        if (this.isGaugeVisible()) {
            if (BattleManager.isTpb()) {
                this._tpbGaugeSprite.visible = true;
            }
            this._hpGaugeSprite.visible = true;
        } else {
            if (BattleManager.isTpb()) {
                this._tpbGaugeSprite.visible = false;
            }
            this._hpGaugeSprite.visible = false;
        }
    };

    /**
     * ゲージが可視状態かどうかを取得する。
     * 
     * @returns {boolean} 可視状態の場合にはtrue, それ以外はfalse
     */
    Sprite_Enemy.prototype.isGaugeVisible = function() {
        return displayEnemyGauge && this._battler && this._battler.isSpriteVisible()
                && BattleManager.isInputting();
    };

    const _Sprite_Enemy_createDamageSprite = Sprite_Enemy.prototype.createDamageSprite;
    /**
     * ダメージスプライトを作成する。
     */
    Sprite_Enemy.prototype.createDamageSprite = function() {
        _Sprite_Enemy_createDamageSprite.call(this);
        if (this.isGaugeVisible()) {
            this._hpGaugeSprite.startAnimation();
        }
    };
    //------------------------------------------------------------------------------
    // Sprite_BattleHudActor
    // アクター情報を表示するHUD。
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
        this._faceName = "";
        this._faceIndex = -1;
        this._battlePictureName = "";
        this._activeSelAdd = 2;
        this._brightness = 255;
        this._scale = 1000; // 0.1%単位
        this._targetScale  = 1000; // 0.1%単位
        this.setFrame(0, 0, this.statusAreaWidth(), this.statusAreaHeight());
    };
    /**
     * ステータス領域の幅を得る。
     * 
     * @returns {number} ステータス領域の幅
     */
    Sprite_BattleHudActor.prototype.statusAreaWidth = function() {
        return statusAreaWidth;
    };

    /**
     * ステータス領域の高さを得る。
     * 
     * @returns {number} ステータスエリアの高さ
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
        this._mainSprite.baseScale = 1;
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
        this._tpbGaugeSprite = new Sprite_BattleHudTpbGauge();
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
     * @returns {Sprite} メインのスプライト
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
     * @returns {Game_Actor} Game_Actorオブジェクト。関連付けられていない場合にはnull.
     */
    Sprite_BattleHudActor.prototype.actor = function() {
        return this._actor;
    };

    /**
     * HUDの位置を得る。
     * 
     * @param {number} index 位置
     */
    Sprite_BattleHudActor.prototype.setHudPosition = function(index) {
        const battleMemberCount = $gameParty.battleMembers().length;
        const width = statusAreaWidth;
        const padding = statusAreaPadding;
        const maxStatusAreaWidth = (width + padding) * maxBattleMembers - statusAreaPadding;
        const totalStatusAreaWidth = (width + padding) * battleMemberCount - statusAreaPadding;
        const baseX = statusAreaOffsetX;
        const memberCountOffsetX = (maxStatusAreaWidth - totalStatusAreaWidth) / 2;
        const x = baseX + memberCountOffsetX + (width + padding) * index + width / 2;
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

        if (enableInputtingZoom) {
            if (this._scale < this._targetScale) {
                this._scale = Math.min(this._targetScale, this._scale + 2);
            } else if (this._scale > this._targetScale) {
                this._scale = Math.max(this._targetScale, this._scale - 2);
            }
            if (this._scale === this._targetScale) {
                if (this._battler && (this._battler.isInputting() || this._battler.isSelected())) {
                    this._targetScale = (this._targetScale !== 1000) ? 1000 : 1100;
                } else {
                    this._targetScale = 1000;
                }
            }
            const scale = this._mainSprite.baseScale * this._scale / 1000.0;
            this._mainSprite.scale.x = scale;
            this._mainSprite.scale.y = scale;
        } else {
            const scale = this._mainSprite.baseScale * this._scale / 1000.0;
            this._mainSprite.scale.x = scale;
            this._mainSprite.scale.y = scale;
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
     * @returns {object} 色補正
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
     * @returns {number} 彩度補正値(0～255)
     */
    Sprite_BattleHudActor.prototype.mainSpriteSaturation = function() {
        return (this._actor.isDead()) ? 0 : 255;
    };

    /**
     * メインスプライトの輝度補正値を取得する。
     * 
     * @returns {number} 輝度(0～255)
     */
    Sprite_BattleHudActor.prototype.mainSpriteBrightness = function() {
        return (this._actor.isDead()) ? 128 : 255;
    };
    /**
     * メインスプライトの不透明度を得る。
     * 
     * @returns {number} 不透明度(0～255)
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
        if (useBattlePicture) {
            const battlePictureName = (typeof this._actor[pictureMethod] === "function") 
                    ? this._actor[pictureMethod]() : this._actor[pictureMethod];
            if (battlePictureName !== this._battlePictureName) {
                this.loadMainSpriteBitmapBattlePicture(battlePictureName);
            }
        } else {
            const faceName = this._actor.faceName();
            const faceIndex = this._actor.faceIndex();
            if ((faceName !== this._faceName) || (faceIndex !== this._faceIndex)) {
                this.loadMainSpriteBitmapFace(faceName, faceIndex);
            }
        }
    };

    /**
     * 戦闘ピクチャをメインスプライト画像として読み出す。
     * 
     * @param {string} battlePictureName 戦闘ピクチャ名
     */
    Sprite_BattleHudActor.prototype.loadMainSpriteBitmapBattlePicture = function(battlePictureName) {
        const bitmap = ImageManager.loadPicture(battlePictureName);
        this._mainSprite.bitmap = bitmap;
        if (bitmap.isReady()) {
            this.onBattlePictureLoaded();
        } else {
            bitmap.addLoadListener(this.onBattlePictureLoaded.bind(this));
        }
        this._battlePictureName = battlePictureName;
    }

    /**
     * 戦闘画像がロードされたときの処理を行う。
     */
    Sprite_BattleHudActor.prototype.onBattlePictureLoaded = function() {
        const pw = this._mainSprite.bitmap.width;

        // 表示可能最大幅
        const maxWidth = (statusAreaWidth + statusAreaPadding) / pictureZoom;

        const displayWidth = Math.min(pw, maxWidth);
        const displayOffsetX = (pw - displayWidth) / 2;
        this._mainSprite.setFrame(displayOffsetX, pictureYOffset, displayWidth, pictureDisplayHeight);
        this._mainSprite.baseScale = pictureZoom;

        const pos = this.mainSpritePosition();
        this._mainSprite.x = pos.x;
        this._mainSprite.y = pos.y;
    };


    /**
     * Faceをメインスプライト画像として読み出す。
     * 
     * @param {string} faceName 顔グラフィックファイル名
     * @param {number} faceIndex 顔グラフィックファイル中のインデックス番号
     */
    Sprite_BattleHudActor.prototype.loadMainSpriteBitmapFace = function(faceName, faceIndex) {
        this._mainSprite.bitmap = ImageManager.loadFace(faceName, faceIndex);
        const pw = ImageManager.faceWidth;
        const ph = ImageManager.faceHeight;
        const cw = Math.min(pw, this.statusAreaWidth());
        const ch = Math.min(ph, this.statusAreaHeight());
        const cx = (faceIndex % 4) * pw + Math.min(0, (this.statusAreaWidth() - cw) / 2);
        const cy = Math.floor(faceIndex / 4) * ph + Math.min(0, (this.statusAreaHeight() - ch) / 2);

        this._mainSprite.setFrame(cx, cy, cw, ch);
        this._faceName = faceName;
        this._faceIndex = faceIndex;
        this._mainSprite.baseScale = 1;

        const pos = this.mainSpritePosition();
        this._mainSprite.x = pos.x;
        this._mainSprite.y = pos.y;
    };


    /**
     * メインスプライトの位置を得る。
     * 
     * @returns {Point} スプライトの位置
     */
    Sprite_BattleHudActor.prototype.mainSpritePosition = function() {
        const x = 0;
        let y = -this.statusAreaHeight();

        if (useBattlePicture && this._mainSprite.bitmap) {
            const displayHeight = pictureDisplayHeight * pictureZoom;
            y += Math.round(displayHeight).clamp(200, 400) - 60;
        } else {
            y += ImageManager.faceHeight;
        }

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
     * @returns {number} ポップアップ位置y
     */
    Sprite_BattleHudActor.prototype.damageOffsetY = function() {
        return ImageManager.faceHeight - this.statusAreaHeight() - 60;
    };

    const _Sprite_BattleHudActor_createDamageSprite = Sprite_BattleHudActor.prototype.createDamageSprite;
    /**
     * ダメージスプライトを構築する。
     */
    Sprite_BattleHudActor.prototype.createDamageSprite = function() {
        _Sprite_BattleHudActor_createDamageSprite.call(this);

        if (this._hpGaugeSprite.visible) {
            this._hpGaugeSprite.startAnimation();
        }
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
    }

    DisplayBattlePictureFilter.prototype = Object.create(PIXI.Filter.prototype);
    DisplayBattlePictureFilter.prototype.constructor = DisplayBattlePictureFilter;

    /**
     * DisplayBattlePictureFilterを初期化する。
     */
    DisplayBattlePictureFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, null, this._fragmentSrc());
        this.uniforms.zeroX = 900.0;
        this.uniforms.validWidth = 100.0;
        this.uniforms.zeroY = 540.0;
        this.uniforms.validHeight = 40.0;
    };

    /**
     * 表示を行う水平方向位置を得る。
     * 
     * @param {number} x 画面上のX位置
     */
    DisplayBattlePictureFilter.prototype.setValidX = function(x) {
        this.uniforms.zeroX = Number(x) || 0;
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
            "uniform float zeroX;" +
            "uniform float validWidth;" +
            "uniform float zeroY;" +
            "uniform float validHeight;" +
            "void main() {" +
            "  vec4 sample = texture2D(uSampler, vTextureCoord);" +
            "  float rateH = clamp((gl_FragCoord.x - zeroX) / validWidth, 0.0, 1.0);" +
            "  float rateV = 1.0 - clamp((gl_FragCoord.y - zeroY) / validHeight, 0.0, 1.0);" +
            "  float rate = min(rateH, rateV);" +
            "  vec3 rgb = sample.rgb * rate;" +
            "  float a = sample.a * rate;" +
            "  gl_FragColor = vec4(rgb, a);" +
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
    }

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
     * @param {number} saturation 色差変更値
     */
    BattleHudActorFilter.prototype.setSaturation = function(saturation) {
        this.uniforms.saturation = saturation.clamp(0, +255.0);
    };

    /**
     * 色差を取得する。
     * 
     * @returns {number} 色差変更値
     */
    BattleHudActorFilter.prototype.saturation = function() {
        return this.uniforms.saturation;
    };

    /**
     * 輝度補正値を設定する。
     * 
     * @param {number} brightness 輝度
     */
    BattleHudActorFilter.prototype.setBrightness = function(brightness) {
        this.uniforms.brightness = brightness.clamp(0, 255.0);
    };

    /**
     * 輝度補正値を得る。
     * 
     * @returns {number} 輝度補正値
     */
    BattleHudActorFilter.prototype.brightness = function() {
        return this.uniforms.brightness;
    };

    /**
     * フラグメントシェーダーソースを得る。
     * 
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
     * @returns {Bitmap} Bitmapオブジェクト。表示する画像がない場合にはnull
     */
    Sprite_BattleHudPicture.prototype.loadBattlePicture = function() {
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

        this._hudBaseSprite = new Sprite();
        this._battleField.addChild(this._hudBaseSprite);

        // battlePictureはHUDSpriteより後ろ、エネミーの前なので、
        // Sprite_BattleHudActorより先に追加する。
        // childAtでもいいけど、無駄に計算量増やす必要は無い。
        this._actorPictureSprites = [];
        for (let i = 0; i < maxBattleMembers; i++) {
            const sprite = new Sprite_BattleHudPicture();
            this._actorPictureSprites.push(sprite);
            this._hudBaseSprite.addChild(sprite);
        }
        this._actorHudSprites = [];
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            const sprite = new Sprite_BattleHudActor();
            this._actorHudSprites.push(sprite);
            this._hudBaseSprite.addChild(sprite);
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
     * @param {object} target ターゲット(Game_BattlerBaseオブジェクト)
     * @returns {Sprite} 対象のスプライト
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

    const _Scene_Battle_destroy = Scene_Battle.prototype.destroy;
    /**
     * シーンを破棄する。
     * 
     * Note: _statusWindowのインスタンスは Container.childrenから切り離しているため、
     *       個別に開放する。
     */
    Scene_Battle.prototype.destroy = function() {
        _Scene_Battle_destroy.call(this);
        if (this._statusWindow) {
            this._statusWindow.destroy();
        }
        if (this._actorWindow) {
            this._actorWindow.destroy();
        }
    };
    /**
     * スキル使用対象選択用のアクター選択ウィンドウを作成する。
     * 
     * !!!overwrite!!! Scene_Battle.createActorWindow()
     *     アイテム・スキル使用対象のアクターウィンドウを表示させないようにするため、オーバーライドする。
     */
     Scene_Battle.prototype.createActorWindow = function() {
        const rect = this.actorWindowRect();
        this._actorWindow = new Window_BattleActor(rect);
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        //this.addWindow(this._actorWindow);
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
     * @returns {Rectangle} ヘルプウィンドウの表示領域を表すRectangle.
     * !!!overwrite!!! Game_Battle_helpWindowRect
     *     レイアウト変更のため、オーバーライドする。
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
     * @returns {Rectangle} ウィンドウ矩形領域。
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
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Game_Battle.statusWindowRect
     *     レイアウト変更のため、オーバーライドする。
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
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.partyCommandWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.partyCommandWindowRect = function() {
        const itemNameRect = this.itemNameWindowRect();
        const ww = commandWindowWidth;
        const wh = this.windowAreaHeight();
        const wx = commandWindowX;
        const wy = itemNameRect.y + itemNameRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アクターコマンドの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.actorCommandWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.actorCommandWindowRect = function() {
        const itemWindowRect = this.itemNameWindowRect();
        const wx = commandWindowX;
        const wy = itemWindowRect.y + itemWindowRect.height;
        const ww = commandWindowWidth;
        const needsHeight = this.calcWindowHeight(commandWindowRowCount, true);
        const allowHeight = Graphics.boxHeight - wy;
        const wh = Math.min(needsHeight, allowHeight);
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Base_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    /**
     * アクターコマンドウィンドウ(_actorCommandWindow)を作成する。
     * 
     * Note: ベーシックシステムでは、ウィンドウ作成時にyが上書きされているため、
     *       レイアウトを変えるためにフックする。
     */
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Base_createActorCommandWindow.call(this);
        this._actorCommandWindow.y = this.actorCommandWindowRect().y;
    };

    /**
     * スキルウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.skillWindowRect
     *     レイアウト変更のため、オーバーライドする。
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
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.logWindowRect
     *     レイアウト変更のため、オーバーライドする。
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
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.itemNameWindowRect
     *     レイアウト変更のため、オーバーライドする。
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
     * !!!overwrite!!! Scene_Battle.createStatusWindow
     *     ステータスウィンドウを表示しないようにするため、オーバーライドする。
     *     _statusWindowエントリを無くすとオーバーライドする箇所が増えるので
     *     作成だけして更新しないようにした。
     */
    Scene_Battle.prototype.createStatusWindow = function() {
        const rect = this.statusWindowRect();
        const statusWindow = new Window_BattleStatus(rect);
        //this.addWindow(statusWindow);
        this._statusWindow = statusWindow;
    };

    /**
     * アクター選択ウィンドウのウィンドウ位置を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.actorWindowRect
     *     レイアウト変更のため、オーバーライドする。
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
     * @returns {Rectangle} エネミーウィンドウの矩形領域。
     * !!!overwrite!!! Scene_Battle.enemyWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.enemyWindowRect = function() {
        const itemNameWindowRect = this.itemNameWindowRect();
        const ww = commandWindowWidth;
        const wh = this.windowAreaHeight();
        const wx = commandWindowX;
        const wy = itemNameWindowRect.y + itemNameWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };


    const _Scene_Battle_update = Scene_Battle.prototype.update;
    /**
     * Scene_Battle の更新処理を行う。
     */
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        // Note: 何かしら更新処理が必要であればここでやる。
    };

    /**
     * ステータスウィンドウの表示状態を更新する。
     * 
     * !!!overwrite!!! Scene_Battle.updateStatusWindowVisibility
     *     _statusWindowは使用しないため、負荷低減のためオーバーライドする。
     */
    Scene_Battle.prototype.updateStatusWindowVisibility = function() {
    };



    const _Scene_Battle_hideSubInputWindows = Scene_Battle.prototype.hideSubInputWindows;
    /**
     * サブ入力ウィンドウを非表示にする。
     */
    Scene_Battle.prototype.hideSubInputWindows = function() {
        _Scene_Battle_hideSubInputWindows.call(this);
        // アイテム名ウィンドウを隠す
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
     * @returns {boolean} いずれかの入力ウィンドウがアクティブな場合にはtrue, それ以外はfalse
     */
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        return _Scene_Battle_isAnyInputWindowActive.call(this);
    };
})();
