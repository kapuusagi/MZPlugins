/*:ja
 * @target MZ 
 * @plugindesc Kapu_CharaMakeプラグインにGrowupSystemを結合させるプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_CharaMake
 * @orderAfter Kapu_CharaMake
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * 
 * @param minimum
 * @text 最小値
 * @desc 初期値として付与する成長ポイントの最小値
 * @type number
 * @default 5
 * 
 * @param maximum 
 * @text 最大値
 * @desc 初期値として付与する成長ポイントの最大値
 * @type number
 * @default 15
 * 
 * @param isRetryable
 * @text 再挑戦可能
 * @desc キャラメイク画面で、成長ポイントの引き直しを可能にするかどうか。
 * @type boolean
 * @default true
 * 
 * @param isSoundsCursor
 * @text カーソル音を鳴らす
 * @desc 成長ポイントが更新されるときにカーソル音を鳴らすかどうか。
 * @type boolean
 * @default true
 * 
 * @param textItemNameGrowPoint
 * @text 成長ポイント項目テキスト
 * @description キャラクターメイキング項目一覧で、成長ポイントに相当する選択項目として表示されるテキスト
 * @type string
 * @default GP
 * 
 * @param textItemDescriptionGrowPoint
 * @text 成長ポイント項目説明
 * @description 本項目がセレクト状態になったときに表示する説明テキスト
 * @type string
 * @default GP初期値を取得し直します。
 * 
 * @help 
 * GrowPoint最大値の初期値として、乱数を与えられるようにします。
 * 成長ポイントをランダムに更新し、成長ポイントを確定させるものです。、
 * 本プラグインでは育成ポイントの振り分け機能は提供しません。
 * 必要であれば、キャラメイク完了時に振り分けシーンを呼び出すようにスクリプトを組んでください。
 * 
 * ■ 使用上の注意点
 * GrowPointシステムの仕様上の制約から、使用済みGP ＋ （min～maxの間のランダム値）になるように
 * 動作します。
 * 
 * そのため、他のキャラメイク項目にて、GrowPointの振り分けを行わないこと。
 * 振り分けを行った場合、本項目を選択毎にGPが更新されるので、
 * 無限にGP増殖ができてしまいます。
 * 
 * 同様にLv2以上でのキャラメイクはやらないこと。
 * 
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * なし。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 初版作成。
 */
/**
 * Game_CharaMakeItem_GrowPoint
 * 成長ポイントのキャラメイク項目
 */
function Game_CharaMakeItem_GrowPoint() {
    this.initialize(...arguments);
}

/**
 * 成長ポイント選択ウィンドウ
 */
function Window_CharaMakeItem_GrowPoint() {
    this.initialize(...arguments);
}
(() => {
    const pluginName = "Kapu_CharaMake_GrowupSystem";
    const parameters = PluginManager.parameters(pluginName);
    const isRetryable = (typeof parameters["isRetryable"] === "undefined")
            ? true : (parameters["isRetryable"] !== "false");
    const isSoundsCursor = (typeof parameters["isSoundsCursor"] === "undefined")
            ? true : (parameters["isSoundsCursor"] !== "false");

    const growPointMin = Math.floor(Number(parameters["minimum"]) || 0);
    const growPointMax = Math.floor(Number(parameters["maximum"]) || 10);
    const textItemNameGrowPoint = parameters["textItemNameGrowPoint"] || "GP";
    const textItemDescriptionGrowPoint = parameters["textItemDescriptionGrowPoint"] = "Update GP";

    if ((growPointMin > growPointMax) || (growPointMin < 0) || (growPointMax < 0)) {
        throw "minimum or maximum is incorrect.";
    }

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    //------------------------------------------------------------------------------
    // DataManager
    if (isRetryable) {
        const _DataManager_createCharaMakeItems = DataManager.createCharaMakeItems;
        /**
         * キャラクターメイキング項目を取得する。
         * キャラメイク項目を拡張する場合、このメソッドをフックして値を配列に加えて返す。
         * 
         * @return {Array<Game_CharaMakeItem>} キャラクターメイキング項目
         */
        DataManager.createCharaMakeItems = function() {
            const items = _DataManager_createCharaMakeItems.call(this);
            items.push(new Game_CharaMakeItem_GrowPoint());
            return items;
        };
    }
    //------------------------------------------------------------------------------
    // Game_Actorの変更
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);

        const dataActor = this.actor();
        if (!dataActor.meta.growPoint) {
            // ノートタグでgrowPointが未指定の場合のみランダム
            const usedGrowPoint = this.maxGrowPoint() - this.growPoint();
            const growPoint = usedGrowPoint + growPointMin + Math.randomInt(growPointMax - growPointMin + 1) ;
            const diff = growPoint - this.maxGrowPoint();
            this.gainGrowPoint(diff);
        }
    };

    //------------------------------------------------------------------------------
    // Window_CharaMakeItem_GrowPoint
    Window_CharaMakeItem_GrowPoint.prototype = Object.create(Window_Selectable.prototype);
    Window_CharaMakeItem_GrowPoint.prototype.constructor = Window_CharaMakeItem_GrowPoint;

    /**
     * Window_CharaMakeItem_GrowPointを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_CharaMakeItem_GrowPoint.prototype.initialize = function(rect) {
        this._growPoint = 0;
        this._minimum = 0;
        this._maximum = 0;
        this._updateGrowPoint = false;
        this._updateFrameCount = 0;
        Window_Selectable.prototype.initialize.call(this, rect);
    };

    /**
     * セットアップする。
     * 
     * @param {number} minimum 最小値
     * @param {number} maximum 最大値
     */
    Window_CharaMakeItem_GrowPoint.prototype.setup = function(minimum, maximum) {
        this._minimum = minimum;
        this._maximum = maximum;
        this._growPoint = this._growPoint.clamp(this._minimum, this._maximum);
        this._updateFrameCount = 0;
        this.refresh();
    };

    /**
     * 開始する
     */
    Window_CharaMakeItem_GrowPoint.prototype.start = function() {
        this._updateFrameCount = 0;
        this._updateGrowPoint = true;
    }

    /**
     * 更新する。
     */
    Window_CharaMakeItem_GrowPoint.prototype.update = function() {
        if (this._updateGrowPoint) {
            this.updateGrowPoint();
        }
        Window_Selectable.prototype.update.call(this);
        if (this._updateGrowPoint && (this._updateFrameCount === 0)) {
            this.updateGrowPoint();
            this.refresh();
        }
    };
    /**
     * 成長ポイントを更新する。
     */
    Window_CharaMakeItem_GrowPoint.prototype.updateGrowPoint = function() {
        this._updateFrameCount++;
        if (this._updateFrameCount >= 6) {
            // 100ミリ秒経過したら更新
            if (isSoundsCursor) {
                SoundManager.playCursor();
            }
            this._growPoint = Math.randomInt(this._maximum - this._minimum + 1) + this._minimum;
            this._updateFrameCount = 0;
        }
    };

    /**
     * タッチされたときの処理を行う。
     */
    Window_CharaMakeItem_GrowPoint.prototype.onTouchOk = function() {
        // Note: refreshされてカーソルが定まらないのでサクッとOKを呼び出す。
        this.processOk();
    };
    

    /**
     * 育成ポイントを設定する。
     * 
     * @param {number} growPoint 成長ポイント
     */
    Window_CharaMakeItem_GrowPoint.prototype.setGrowPoint = function(growPoint) {
        this._growPoint = growPoint.clamp(this._minimum, this._maximum);
        this.refresh();
    };

    /**
     * 育成ポイントを得る。
     * 
     * @returns {number} 育成ポイント
     */
    Window_CharaMakeItem_GrowPoint.prototype.growPoint = function() {
        return this._growPoint;
    };

    /**
     * OK処理する。
     */
    Window_CharaMakeItem_GrowPoint.prototype.processOk = function() {
        this._updateGrowPoint = false;
        Window_Selectable.prototype.processOk.call(this);
    };

    /**
     * キャンセル処理する。
     */
    Window_CharaMakeItem_GrowPoint.prototype.processCancel = function() {
        this._updateGrowPoint = false;
        Window_Selectable.prototype.processCancel.call(this);
    };


    /**
     * ウィンドウの表示を更新する。
     */
    Window_CharaMakeItem_GrowPoint.prototype.refresh = function() {
        this.contents.clear();
        this.makeFontBigger();
        const w = this.innerWidth;
        const h = this.innerHeight;
        const valueHeight = this.contents.fontSize;
        const valueWidth = this.textWidth(String(this._maximum));
        const x = (w - valueWidth) / 2;
        const y = (h - valueHeight) / 2;
        this.drawText(String(this._growPoint), x, y, valueWidth, "right");
        this.resetFontSettings();
    };

    //------------------------------------------------------------------------------
    // Game_CharaMakeItem_GrowPoint
    Game_CharaMakeItem_GrowPoint.prototype = Object.create(Game_CharaMakeItem.prototype);
    Game_CharaMakeItem_GrowPoint.prototype.constructor = Game_CharaMakeItem_GrowPoint;

    /**
     * Game_CharaMakeItem_GrowPointを初期化する。
     */
    Game_CharaMakeItem_GrowPoint.prototype.initialize = function() {
    };

    /**
     * この項目の識別名を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_GrowPoint.prototype.name = function() {
        return textItemNameGrowPoint || "";
    };

    /**
     * この項目の説明を取得する。
     * 
     * @return {string} 説明
     */
    Game_CharaMakeItem_GrowPoint.prototype.description = function() {
        return textItemDescriptionGrowPoint || "";
    };
    /**
     * アクターに適用可能な項目かどうかを取得する。
     * 成長ポイントは、初回のみ編集可能とする。
     * 
     * @param {Game_Actor} actor アクター
     * @param {boolean} 既存データの変更の場合にはtrue、それ以外はfalse
     * @returns 適用できる項目の場合にはtrue, それ以外はfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_GrowPoint.prototype.canApply = function(actor, isModify) {
        return !isModify;
    };
    /**
     * 編集中のテキストを得る。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @return {string} 編集項目の選択値(テキスト)
     */
    Game_CharaMakeItem_GrowPoint.prototype.editingText = function(windowEntry) {
        const selectWindow = windowEntry.selectWindow;
        return String(selectWindow.growPoint());
    };
    /**
     * 選択・編集用のウィンドウを作成する。
     * 
     * @param {Scene_Base} s
     * @param {Rectangle} rect ウィンドウ矩形領域
     * @param {Window_Help} helpWindow ヘルプウィンドウ
     * @returns {object} 追加するウィンドウ
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_GrowPoint.prototype.createSelectWindows = function(rect, helpWindow) {
        const ww = (rect.width < 200) ? rect.width : 200;
        const wh = 80;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = rect.y;
        const windowRect = new Rectangle(wx, wy, ww, wh);
        const window = new Window_CharaMakeItem_GrowPoint(windowRect);
        window.deactivate();
        window.hide();
        return {
            selectWindow: window,
            windows: null,
            infoWindows: null,
            sprites: null
        } ;
    };
    /**
     * 現在のアクターの情報を反映させる
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_GrowPoint.prototype.setCurrent = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;

        const usedGrowPoint = actor.maxGrowPoint() - actor.growPoint();
        const minimum = usedGrowPoint + growPointMin;
        const maximum = usedGrowPoint + growPointMax;
        selectWindow.setup(minimum, maximum);
        selectWindow.setGrowPoint(actor.maxGrowPoint());
    };

    /**
     * 編集中の設定を反映させる。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_GrowPoint.prototype.apply = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        const growPoint = selectWindow.growPoint();
        const diff = growPoint - actor.maxGrowPoint();
        actor.gainGrowPoint(diff);
        
    };
    /**
     * 選択開始時の処理を行う。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     */
    Game_CharaMakeItem_GrowPoint.prototype.startSelection = function(windowEntry) {
        Game_CharaMakeItem.prototype.startSelection.call(this, windowEntry);
        const selectWindow = windowEntry.selectWindow;
        selectWindow.start();
    };
    
})();