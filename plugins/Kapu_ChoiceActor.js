/*:ja
 * @target MZ 
 * @plugindesc アクター選択プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command getChoisableActorCount
 * @text 選択候補アクター数取得
 * @desc 条件指定したときに、選択可能なアクター数を取得します。選択可能かどうか、事前に分岐させたい場合に使用します。
 * 
 * @arg choiceActorType
 * @type select
 * @default 1
 * @option パーティーメンバー(デフォルト)
 * @value 1
 * @option パーティー戦闘参加メンバー
 * @value 2
 * @option パーティー控えメンバー
 * @value 3
 * @option 選択可能フラグがセットされた、パーティーにいないメンバー
 * @value 7
 * @option 選択可能フラグがセットされた、全てのメンバー
 * @value 8
 * @option 特定のメンバー
 * @value 99
 * 
 * @arg variableId
 * @text 候補数を格納する変数ID
 * @desc 候補数を格納する変数ID
 * @type variable
 * 
 * @arg actors
 * @text 選択対象アクター
 * @desc 選択対象として、特定のメンバーを選択したとき、候補となるメンバー
 * @type actor[]
 * @default []
 * 
 * @arg exclusionActors
 * @text 選択対象から外すアクター
 * @desc 選択対象から外すメンバーとして、特定のメンバーを選択したい場合に使用する
 * @type actor[]
 * @default []
 * 
 * @arg includeEval
 * @text 選択対象とするアクターの評価式。空欄で条件なし。aにアクターが入る。trueを返すと含む。
 * @type string
 * @default 
 * 
 * 
 * @command choiceActor
 * @text アクター選択
 * @desc アクター選択を行います。選択時はアクターID、未選択時は指定変数に0が格納されます。選択対象アクターがいない場合も0が格納されます。
 * 
 * @arg choiceActorType
 * @type select
 * @default 1
 * @option パーティーメンバー(デフォルト)
 * @value 1
 * @option パーティー戦闘参加メンバー
 * @value 2
 * @option パーティー控えメンバー
 * @value 3
 * @option 選択可能フラグがセットされた、パーティーにいないメンバー
 * @value 7
 * @option 選択可能フラグがセットされた、全てのメンバー
 * @value 8
 * @option 特定のメンバー
 * @value 99
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 選択結果を格納する変数ID
 * @type variable
 * 
 * @arg actors
 * @text 選択対象アクター
 * @desc 選択対象として、特定のメンバーを選択したとき、候補となるメンバー
 * @type actor[]
 * @default []
 * 
 * @arg exclusionActors
 * @text 選択対象から外すアクター
 * @desc 選択対象から外すメンバーとして、特定のメンバーを選択したい場合に使用する
 * @type actor[]
 * @default []
 * 
 * @arg includeEval
 * @text 選択対象とするアクターの評価式。空欄で条件なし。aにアクターが入る。trueを返すと含む。
 * @type string
 * @default 
 * 
 * @arg isCancelable
 * @text キャンセル許可
 * @desc 選択の際、キャンセル操作を許可するかどうか。
 * @type boolean
 * @default true
 * 
 * @arg displayInformation
 * @text 表示情報
 * @desc 選択対象として表示する情報。プラグイン拡張を想定する。
 * @type string
 * @default default
 * 
 * @param windowPosition
 * @text アクター選択ウィンドウ位置
 * 
 * @param windowX
 * @text X
 * @desc 選択ウィンドウの表示位置
 * @type number
 * @default 0
 * @parent windowPosition
 * 
 * @param windowY
 * @text Y
 * @desc 選択ウィンドウの表示位置
 * @type number
 * @default 0
 * @parent windowPosition
 * 
 * @param windowWidth
 * @text 幅
 * @default 720
 * @parent windowPosition
 * 
 * @param windowHeight
 * @text 高さ
 * @default 480
 * @parent windowPosition
 * 
 * 
 * @command setChoicable
 * @text 選択可能/不可能を設定する
 * @desc 選択可能フラグをセット/解除する。
 * 
 * @arg actorId
 * @text アクターID
 * @type actor
 * @default 0
 * 
 * @arg variableId
 * @text アクターID(変数指定)
 * @type variable
 * @default 0
 * 
 * @arg choicable
 * @text 選択可否
 * @desc 選択可能にする場合にはtrue, 選択不可にする場合にはfalse
 * @type boolean
 * @default false
 * 
 * @help 
 * アクター選択を提供するプラグイン。
 * イベントにて、アクターを簡単に選択できるようにする用途を想定します。
 * 戦闘中でも選択は可能にしてあるので、頑張ればメンバー変更イベントもできます。
 * (尚、戦闘時メンバー入れ替えプラグインを導入した方が楽だと思います。)
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * Window_ChoiceActorList.drawActor(rect :Rectangle, actor :Game_Actor, informationType :string) : boolean 
 *   アクター選択時の選択項目の描画を行う。
 *   表示内容を変更したい場合にはフックして分岐させる。
 *   描画できた場合にはtrueを返す。
 *   描画準備が整っておらず、再描画させたい場合にはfalseを返す。
 *   rect : 描画範囲
 *   actor : アクターデータ。
 *           $gameActorsにインスタンス未生成の場合には一時的にGame_Actorを作成したものが渡されます。
 *           この一時的に作成されたデータは保存されません。
 *   informationType : 表示情報タイプ。「アクター選択」コマンドで指定した表示情報のテキストが渡される。
 * Window_ChoiceActorList.drawActorDefaultCustom(actor :Game_Actor, informationType :string, x :number, y :number, width :number) : void
 *   デフォルトの描画のうち、最終段の描画をする。
 *   顔、名前、Lv, クラス、HP,MPの描画はそのままで、
 *   1項目だけ追加で表示させたい場合にフックして使用する。
 *   actor : アクターデータ。
 *           $gameActorsにインスタンス未生成の場合には一時的にGame_Actorを作成したものが渡されます。
 *           この一時的に作成されたデータは保存されません。
 *   informationType : 表示情報タイプ。「アクター選択」コマンドで指定した表示情報のテキストが渡される。
 *   x : 描画位置x
 *   y : 描画位置y
 *   width : 描画幅
 *   
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * アクター選択
 *   アクター選択を開始します。
 *   選択時はアクターID、未選択時は指定変数に0が格納されます。
 *   選択対象アクターがいない場合、選択処理はスキップされます。
 *   この場合、0が格納されます。
 * 
 * 選択可能/不可能を設定する
 *   指定したアクターに、選択可能/不可フラグを設定します。
 *   初期選択可能フラグは選択不可になっています。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <excludeChoiceActor>
 *     アクター選択で
 *       「インスタンスがあり、パーティーにいないメンバー」
 *       「インスタンスがあるメンバー」
 *       「すべてのアクター」
 *     が選択されたとき、選択候補から除外する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/**
 * Window_ChoiceActorList
 * アクター選択ウィンドウ
 */
function Window_ChoiceActorList() {
    this.initialize(...arguments);
}

(() => {
    'use strict';
    const pluginName = "Kapu_ChoiceActor";
    const parameters = PluginManager.parameters(pluginName);
    const windowX = Number(parameters["windowX"]) || 0;
    const windowY = Number(parameters["windowY"]) || 0;
    const windowWidth = Number(parameters["windowWidth"]) || 0;
    const windowHeight = Number(parameters["windowHeight"]) || 0;

    const CHOICEACTOR_FROM_PARTY = 1;
    const CHOICEACTOR_FORM_BATTLEMEMBERS = 2;
    const CHOICEACTOR_FROM_NOTBATTLEMEMBERS = 3;
    const CHOICEACTOR_FROM_CHOICABLE_WITHOUT_PARTY = 7;
    const CHOICEACTOR_FROM_CHOICABLE = 8;
    const CHOICEACTOR_FROM_CANDIDATES = 99;

    /**
     * 選択可能アクター数取得
     */
    PluginManager.registerCommand(pluginName, "getChoisableActorCount", function(args) {
        const interpreter = this;

        const variableId = Number(args.variableId) || 0;
        const choiceActorType = Number(args.choiceActorType) || CHOICEACTOR_FROM_PARTY;
        let actors = [];
        try {
            actors = JSON.parse(args.actors).map(token => Number(token) || 0);
        }
        catch (e) {
            console.error(e);
        }
        let exclusionActors = [];
        try {
            exclusionActors = JSON.parse(args.exclusionActors).map(token => Number(token) || 0);
        }
        catch (e) {
            console.error(e);
        }
        const includeEval = args.includeEval || "";
        if (variableId > 0) {
            const choisableActors = interpreter.makeCandidateActors(choiceActorType, actors, exclusionActors, includeEval);
            $gameVariables.setValue(variableId, choisableActors.length);
        }
    });

    /**
     * アクター選択
     */
    // Note: 匿名関数だと this に Game_Interpreter が渡らないことに注意。
    PluginManager.registerCommand(pluginName, "choiceActor", function(args) {
        const interpreter = this;

        const variableId = Number(args.variableId) || 0;
        const choiceActorType = Number(args.choiceActorType) || CHOICEACTOR_FROM_PARTY;
        let actors = [];
        try {
            actors = JSON.parse(args.actors).map(token => Number(token) || 0);
        }
        catch (e) {
            console.error(e);
        }
        let exclusionActors = [];
        try {
            exclusionActors = JSON.parse(args.exclusionActors).map(token => Number(token) || 0);
        }
        catch (e) {
            console.error(e);
        }
        const isCancelable = (typeof args.isCancelable == "undefined") ? true : args.isCancelable == "true";
        const includeEval = args.includeEval || "";
        const displayInformation = args.displayInformation || "default";
        interpreter.setupChoiceActors([ variableId, choiceActorType, actors, exclusionActors, isCancelable, displayInformation, includeEval ]);
        if ($gameMessage.isChoiceActor()) {
            interpreter.setWaitMode("message");
        }
        return true;
    });

    const _getActorId = function(actorId, variableId) {
        if (actorId > 0) {
            return actorId;
        } else if (variableId > 0) {
            return $gameVariables.value(variableId);
        } else {
            return 0;
        }
    };

    /**
     * 選択可能/不可能を設定する
     */
    PluginManager.registerCommand(pluginName, "setChoicable", function(args) {
        let actorId = _getActorId(Number(args.actorId), Number(args.variableId));
        const choicable = (typeof args.choicable == "undefined") ? false : (args.choicable == "true");
        if ((actorId > 0) && (actorId < $dataActors.length)) {
            if ($gameActors.isActorDataExists(actorId)) {
                const actor = $gameActors.actor(actorId);
                actor.setChoicableActor(choicable);
            }
        }
    });
    //------------------------------------------------------------------------------
    // Window_Message
    const _Window_Message_initMembers = Window_Message.prototype.initMembers;
    /**
     * Window_Messageのメンバを初期化する。
     */
    Window_Message.prototype.initMembers = function() {
        this._choiceActorListWindow = null;
        _Window_Message_initMembers.call(this);
    };

    /**
     * アクター選択ウィンドウを設定する。
     * 
     * @param {Window_ChoiceActorList} window ウィンドウ
     */
    Window_Message.prototype.setChoiceActorListWindow = function(window) {
        this._choiceActorListWindow = window;
    };

    const _Window_Message_isAnySubWindowActive = Window_Message.prototype.isAnySubWindowActive;
    /**
     * いずれかのサブウィンドウがアクティブかどうかを得る。
     * 
     * @returns {boolean} サブウィンドウがアクティブな場合にはtrue, それ以外はfalse.
     */
    Window_Message.prototype.isAnySubWindowActive = function() {
        return _Window_Message_isAnySubWindowActive.call(this)
                || this._choiceActorListWindow.active;
    };

    const _Window_Message_startInput = Window_Message.prototype.startInput;
    /**
     * 入力を開始する。
     * 
     * @return {boolean} 入力を開始した場合にはtrue, それ以外はfalse.
     */
    Window_Message.prototype.startInput = function() {
        if ($gameMessage.isChoiceActor()) {
            this._choiceActorListWindow.start();
            return true;
        }
        return _Window_Message_startInput.call(this);
    };

    //------------------------------------------------------------------------------
    // Window_ChoiceActorList
    Window_ChoiceActorList.prototype = Object.create(Window_Selectable.prototype);
    Window_ChoiceActorList.prototype.constructor = Window_ChoiceActorList;

    /**
     * Window_ChoiceActorListを初期化する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域
     */
    Window_ChoiceActorList.prototype.initialize = function(rect) {
        this._actors = null;
        this._redrawItemIndices = [];
        Window_Selectable.prototype.initialize.call(this, rect);
        this.createCancelButton();
        this.openness = 0;

        this.deactivate();
        this._background = 0;
        this._canRepeat = false;
    };

    /**
     * メッセージウィンドウを設定する。
     * 
     * @param {Window_Message} messageWindow メッセージウィンドウ
     */
    Window_ChoiceActorList.prototype.setMessageWindow = function(messageWindow) {
        this._messageWindow = messageWindow;
    };
    /**
     * キャンセルボタンを作製する。
     */
    Window_ChoiceActorList.prototype.createCancelButton = function() {
        if (ConfigManager.touchUI) {
            this._cancelButton = new Sprite_Button("cancel");
            this._cancelButton.visible = false;
            this.addChild(this._cancelButton);
        }
    };

    /**
     * アクター選択の入力を開始する。
     */
    Window_ChoiceActorList.prototype.start = function() {
        this._actors = $gameMessage.choiceActors();
        this.placeCancelButton();
        this.createContents();
        this.refresh();
        this.selectDefault();
        this.open();
        this.activate();
    };

    /**
     * Window_ChoiceActorListを更新する。
     */
    Window_ChoiceActorList.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateCancelButton();
    };

    /**
     * キャンセルボタンの可視状態を更新する。
     * 非タッチモードでキャンセルボタンが無い場合には更新されない。
     */
    Window_ChoiceActorList.prototype.updateCancelButton = function() {
        if (this._cancelButton) {
            this._cancelButton.visible = this.isOpen();
        }
    };

    /**
     * デフォルトを選択する。
     */
    Window_ChoiceActorList.prototype.selectDefault = function() {
        this.select(-1);
    };

    /**
     * キャンセルボタンを配置する。
     */
    Window_ChoiceActorList.prototype.placeCancelButton = function() {
        if (this._cancelButton) {
            const spacing = 8;
            const button = this._cancelButton;
            const right = this.x + this.width;
            if (right < Graphics.boxWidth - button.width + spacing) {
                button.x = this.width + spacing;
            } else {
                button.x = -button.width - spacing;
            }
            button.y = this.y;
        }
    };
    /**
     * 選択肢の項目を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_ChoiceActorList.prototype.drawItem = function(index) {
        if (!this._actors) {
            return;
        }

        const informationType = $gameMessage.choiceActorInformationType();
        const rect = this.itemRect(index);
        const actorId = this._actors[index];
        if ($gameActors.isActorDataExists(actorId)) {
            const actor = $gameActors.actor(actorId);
            if (!this.drawActor(rect, actor, informationType)) {
                this.reserveRedraw(index);
            }
        } else {
            const actor = new Game_Actor(actorId);
            if (this.drawActor(rect, actor, informationType)) {
                this.reserveRedraw(index);
            }
        }
    };

    /**
     * アクター情報を描画する。
     * 
     * @param {Rectangle} rect 描画領域
     * @param {Game_Actor} actor アクター
     * @param {string} informationType 表示情報タイプ
     * @return {boolean} 描画完了した場合にtrue, それ以外はfalse.
     */
    Window_ChoiceActorList.prototype.drawActor = function(rect, actor, informationType) {
        switch (informationType) {
            case "default":
            default:
                return this.drawActorDefault(rect, actor, informationType);
        }
    };

    /**
     * 単純なアクター情報を描画する。
     * 
     * @param {Rectangle} rect 描画領域
     * @param {Game_Actor} actor アクター
     * @param {string} informationType 表示情報タイプ
     * @returns {boolean} 描画完了した場合にtrue, それ以外はfalse.
     */
    Window_ChoiceActorList.prototype.drawActorDefault = function(rect, actor, informationType) {
        const inset = 8;
        let x = rect.x;
        let y = rect.y;

        const bitmap = ImageManager.loadFace(actor.faceName());
        if (bitmap.isReady()) {
            this.drawFace(actor.faceName(), actor.faceIndex(), x + inset, y + inset, 144, 144);
        } else {
            return false;
        }

        const lineHeight = this.lineHeight();
        const padding = 8;
        x += 144 + inset * 2 + padding;
        y += inset;
        const itemAreaWidth = rect.width - 144 - padding - inset * 2

        this.resetFontSettings();

        // 1段目：アクター名
        const nameWidth = itemAreaWidth;
        this.drawText(actor.name(), x, y, nameWidth);

        y += lineHeight;

        // 2段目：レベルとクラス
        const levelWidth = Math.min(120, Math.floor(itemAreaWidth * 0.4))
        this.drawActorLevel(actor, x, y, levelWidth);
        const classWidth = itemAreaWidth - padding - levelWidth;
        this.drawActorClass(actor, x + levelWidth + padding, y, classWidth);

        y += lineHeight;

        // 3段目：現在HP, 現在MP
        const hpWidth = Math.min(160, itemAreaWidth * 0.5 - padding);
        this.drawActorHp(actor, x, y, hpWidth);
        const mpWidth = Math.min(160, itemAreaWidth * 0.5 - padding);
        this.drawActorMp(actor, x + hpWidth + padding, y, mpWidth);

        y += lineHeight;
        // 4段目：カスタム
        this.drawActorDefaultCustom(actor, informationType, x, y, itemAreaWidth);

        return true;
    };

    /**
     * 単純なアクター情報の最終行を描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {string} informationType 表示情報タイプ
     * @param {number} x 描画位置X
     * @param {number} y 描画位置Y
     * @param {number} width 幅
     */
    Window_ChoiceActorList.prototype.drawActorDefaultCustom = function(/* actor , informationType, x, y, width */) {
        // do nothing.
    };

    /**
     * アクターの現在レベルを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画位置X
     * @param {number} y 描画位置Y
     * @param {number} width 描画幅
     */
    Window_ChoiceActorList.prototype.drawActorLevel = function(actor, x, y, width) {
        const paramWidth = Math.floor(width * 0.3);
        const currentValueWidth = width - paramWidth - 16;

        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        
        this.drawText(TextManager.levelA, x, y + 8, paramWidth, "left");
        x += paramWidth;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.contents.fontFace = $gameSystem.numberFontFace();
        this.drawText(actor.level, x, y, currentValueWidth, "right");
    };

    /**
     * アクターの現在のクラスを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画位置X
     * @param {number} y 描画位置Y
     * @param {number} width 描画幅
     */
    Window_ChoiceActorList.prototype.drawActorClass = function(actor, x, y, width) {
        this.resetTextColor();
        this.drawText(actor.currentClass().name, x, y, width);
    };

    /**
     * アクターの現在HPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画位置X
     * @param {number} y 描画位置Y
     * @param {number} width 描画幅
     */
    Window_ChoiceActorList.prototype.drawActorHp = function(actor, x, y, width) {
        const paramWidth = Math.floor(width * 0.3);
        const currentValueWidth = width - paramWidth - 16;

        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        
        this.drawText(TextManager.hpA, x, y + 8, paramWidth, "left");
        x += paramWidth;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.contents.fontFace = $gameSystem.numberFontFace();
        this.drawText(actor.hp, x, y, currentValueWidth, "right");
    };

    /**
     * アクターの現在MPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画位置X
     * @param {number} y 描画位置Y
     * @param {number} width 描画幅
     */
    Window_ChoiceActorList.prototype.drawActorMp = function(actor, x, y, width) {
        const paramWidth = Math.floor(width * 0.3);
        const currentValueWidth = width - paramWidth - 16;

        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        
        this.drawText(TextManager.mpA, x, y + 8, paramWidth, "left");
        x += paramWidth;
        this.changeTextColor(ColorManager.mpColor(actor));
        this.contents.fontFace = $gameSystem.numberFontFace();
        this.drawText(actor.mp, x, y, currentValueWidth, "right");
    };

    /**
     * 再描画が必要であるとリザーブする。
     * 
     * @param {number} index インデックス
     */
    Window_ChoiceActorList.prototype.reserveRedraw = function(index) {
        if (!this._redrawItemIndices.includes(index)) {
            this._redrawItemIndices.push(index);
        }
    };

    /**
     * ウィンドウを更新する。
     */
    Window_ChoiceActorList.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);

        // Note: フェイスイメージなど、loading中で描画できなかった場合、
        //       ここで再描画する。
        if (this._redrawItemIndices.length > 0) {
            const indices = this._redrawItemIndices;
            this._redrawItemIndices = [];
            for (const index of indices) {
                this.redrawItem(index);
            }
        }
    }


    /**
     * 項目数を得る。
     * 
     * @return {number} 項目数。
     */
    Window_ChoiceActorList.prototype.maxItems = function() {
        return (this._actors) ? this._actors.length : 0;
    };
    /**
     * 項目の描画高を得る。
     * 
     * @returns {number} 項目の描画高さ。
     */
    Window_ChoiceActorList.prototype.itemHeight = function() {
        return Math.min(this.innerHeight, 160);
    };
    /**
     * 選択操作が可能かどうかを判定する。
     * 
     * @returns {boolean} 選択操作が可能な場合にはtrue, それ以外はfalse
     */
    Window_ChoiceActorList.prototype.isOkEnabled = function() {
        return true;
    };
    /**
     * キャンセル可能かどうかを判定する。
     * 
     * @returns {boolean} キャンセル可能な場合にはtrue, それ以外はfalse
     */
    Window_ChoiceActorList.prototype.isCancelEnabled = function() {
        return $gameMessage.isChoiceActorCancelable();
    };
    /**
     * OK操作されたときの処理を行う。
     */
    Window_ChoiceActorList.prototype.callOkHandler = function() {
        $gameMessage.onChoiceActor(this.index()); // 選択インデックスでコールバックを実行する。
        this._messageWindow.terminateMessage();
        this.close();
    };
    /**
     * キャンセル操作されたときの処理を行う。
     */
    Window_ChoiceActorList.prototype.callCancelHandler = function() {
        $gameMessage.onChoiceActor(-1); // キャンセルインデックスでコールバックを実行する。
        this._messageWindow.terminateMessage();
        this.close();
    };
    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._choicableActor = false;
    };

    /**
     * アクター選択可能かどうかを設定する。
     * 
     * @param {boolean} choicable アクター選択可能な場合にはtrue, 選択不可な場合にはfalse.
     */
    Game_Actor.prototype.setChoicableActor = function(choicable) {
        this._choicableActor = choicable;
    };

    /**
     * アクター選択可能かどうかを取得する。
     * 
     * @returns {boolean} アクター選択可能な場合にはtrue, 選択不可な場合にはfalse.
     */
    Game_Actor.prototype.choicableActor = function() {
        return this._choicableActor;
    };
    //------------------------------------------------------------------------------
    // Game_Actors
    if (!Game_Actors.prototype.isActorDataExists) { // isActorDataExistsが未定義なら追加。
        /**
         * アクターデータが存在するかどうかを取得する。
         * 
         * @param {number} actorId アクターID
         * @returns {boolean} アクターデータが存在する場合にはtrue, 存在しない場合にはfalse
         */
        Game_Actors.prototype.isActorDataExists = function(actorId) {
            return this._data[actorId] ? true : false;
        };
    }
    //------------------------------------------------------------------------------
    // Game_Message
    const _Game_Message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.call(this);
        this._choiceActorVariableId = 0;
        this._choiceActors = null;
        this._choiceActorCancelable = true;
        this._choiceActorInformationType = "default";
    };
    /**
     * アクター選択をセットアップする。
     * 
     * @param {number} variableId 結果を格納する変数ID
     * @param {Array<number>} actors アクターリスト
     * @param {boolean} isCancelable キャンセル可否
     * @param {string} informationType 情報タイプ
     */
    Game_Message.prototype.setChoiceActors = function(variableId, actors, isCancelable, informationType) {
        this._choiceActorVariableId = variableId;
        this._choiceActors = actors;
        this._choiceActorCancelable = isCancelable;
        this._choiceActorInformationType = informationType;
    };

    /**
     * アクター選択中かどうかを判定する。
     * 
     * @returns {boolean}アクター選択中の場合にはtrue, それ以外はfalse.
     */
    Game_Message.prototype.isChoiceActor = function() {
        return this._choiceActors != null;
    };

    /**
     * アクター選択をキャセル可能かどうかを判定する。
     * 
     * @returns {boolean} キャンセル可能な場合にはtrue, それ以外はfalse.
     */
    Game_Message.prototype.isChoiceActorCancelable = function() {
        return this._choiceActorCancelable;
    };

    /**
     * アクター選択の選択対象リストを得る。
     * 
     * @returns {Array<number>} アクターIDリスト
     */
    Game_Message.prototype.choiceActors = function() {
        return this._choiceActors || [];
    };

    /**
     * アクター選択の情報タイプを得る。
     * 
     * @returns {string} 情報タイプ
     */
    Game_Message.prototype.choiceActorInformationType = function() {
        return this._choiceActorInformationType;
    };

    /**
     * アクター選択されたときの処理を行う。
     * 
     * @param {number} index 選択されたインデックス
     */
    Game_Message.prototype.onChoiceActor = function(index) {
        if ((this._choiceActorVariableId > 0) && this._choiceActors) {
            if ((index >= 0) && (index < this._choiceActors.length)) {
                const actorId = this._choiceActors[index];
                $gameVariables.setValue(this._choiceActorVariableId, actorId);
            } else {
                $gameVariables.setValue(this._choiceActorVariableId, 0);
            }
        }
    };

    const _Game_Message_isBusy = Game_Message.prototype.isBusy;
    /**
     * ビジーかどうかを得る。
     * 
     * @returns {boolean} ビジーの場合にはtrue, それ以外はfalse.
     */
    Game_Message.prototype.isBusy = function() {
        return _Game_Message_isBusy.call(this)
            || this.isChoiceActor();
    };

    //------------------------------------------------------------------------------
    // Game_Interpreter
    /**
     * アクター選択をセットアップする。
     * 
     * params[0] : {number} 結果を格納する変数ID
     * params[1] : {number} 選択タイプ(CHOICEACTOR_FROM_x)
     * params[2] : {Array<number>} 選択候補アクターID配列
     * params[3] : {Array<number>} 除外アクターID配列
     * params[4] : {boolean} キャンセル許可/禁止
     * params[5] : {string} 表示情報種類
     * params[6] : {string} 含むかどうか判定する評価式(null可)
     * 
     * @param {Array<object>} params パラメータ
     */
    Game_Interpreter.prototype.setupChoiceActors = function(params) {
        const variableId = params[0];
        const actors = this.makeCandidateActors(params[1], params[2], params[3], params[6]);
        if (actors.length > 0) {
            const isCancelable = params[4];
            const informationType = params[5];
            $gameMessage.setChoiceActors(variableId, actors, isCancelable, informationType);
        } else {
            $gameVariables.setValue(variableId, 0); // キャンセル
        }
    };

    /**
     * acotrIdで指定されるアクターが選択候補になり得るかどうかを判定する。
     * 
     * @param {number} actorId アクターID
     * @param {Array<number>} exclusionActors 除外アクターリスト
     * @returns {boolean} 候補になる場合にはtrue, それ以外はfalse.
     */
    const _isCandidate = function(actorId, exclusionActors) {
        if (actorId > 0) { // アクターIDは有効？
            if (exclusionActors && exclusionActors.includes(actorId)) { // 除外リストに含まれている？
                return false;
            }

            return true;
        } else {
            return false;
        }
    };

    /**
     * メンバーに含むかどうかを判定する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {string} includeEval 含むかどうかの評価式
     * @returns 
     */
    const _evalIncludes = function(actor, includeEval) {
        if (includeEval) { // 評価式は空で無い？
            try {
                // eslint-disable-next-line no-unused-vars
                const a = actor;
                return eval(includeEval) ? true : false;
            }
            catch {
                return false;
            }
        } else {
            return true;
        }
    };

    /**
     * 選択候補のアクターIDリストを作る
     * 
     * @param {number} choiceActorType 選択タイプ(CHOICEACTOR_FROM_x)
     * @param {number} actors アクターリスト(CHOICEACTOR_FROM_CANDIDATES時のみ有効)
     * @param {number} exclusionActors 除外アクターリスト 
     * @param {string} includeEval 含むかどうかの判定式(nullの場合は常に含む)
     * @returns {Array<number>} アクターリスト
     */
    Game_Interpreter.prototype.makeCandidateActors = function(choiceActorType, actors, exclusionActors, includeEval) {
        const canditates = [];
        switch (choiceActorType) {
            case CHOICEACTOR_FROM_CHOICABLE:
                for (let actorId = 1; actorId < $dataActors.length; actorId++) {
                    if ($gameActors.isActorDataExists(actorId)) {
                        const actor = $gameActors.actor(actorId);
                        if (actor.choicableActor() 
                                && _isCandidate(actorId, exclusionActors)
                                && _evalIncludes(actor, includeEval)) {
                            canditates.push(actorId);
                        }
                    }
                }
                break;
            case CHOICEACTOR_FROM_CHOICABLE_WITHOUT_PARTY:
                for (let actorId = 1; actorId < $dataActors.length; actorId++) {
                    if ($gameActors.isActorDataExists(actorId)
                            && !$gameParty.allMembers().some((actor) => actor.actorId() == actorId)) {
                        const actor = $gameActors.actor(actorId);
                        if (actor.choicableActor()
                                && _isCandidate(actorId, exclusionActors)
                                && _evalIncludes(actor, includeEval)) {
                            canditates.push(actorId);
                        }
                    }
                }
                break;
            case CHOICEACTOR_FROM_CANDIDATES:
                for (let actorId of actors) {
                    if (actorId > 0) {
                        const actor = $gameActors.actor(actorId);
                        if (_evalIncludes(actor, includeEval)) {
                            canditates.push(actorId);
                        }
                    }
                }
                break;
            case CHOICEACTOR_FORM_BATTLEMEMBERS:
                for (const actor of $gameParty.battleMembers()) {
                    const actorId = actor.actorId();
                    if (_isCandidate(actorId, exclusionActors)
                            && _evalIncludes(actor, includeEval)) {
                        canditates.push(actorId);
                    }
                }
                break;
            case CHOICEACTOR_FROM_NOTBATTLEMEMBERS:
                {
                    const battleMembers = $gameParty.battleMembers();
                    for (const actor of $gameParty.allMembers()) {
                        const actorId = actor.actorId();
                        if (!battleMembers.includes(actor)
                                && _isCandidate(actorId, exclusionActors)
                                && _evalIncludes(actor, includeEval)) {
                            canditates.push(actorId);
                        }
                    }
                }
                break;
            case CHOICEACTOR_FROM_PARTY:
            default:
                for (const actor of $gameParty.allMembers()) {
                    const actorId = actor.actorId();
                    if (_isCandidate(actorId, exclusionActors)
                            && _evalIncludes(actor, includeEval)) {
                        canditates.push(actorId);
                    }
                }
                break;
        }

        return canditates;
    }

    //------------------------------------------------------------------------------
    // Scene_Message
    const _Scene_Message_createAllWindows = Scene_Message.prototype.createAllWindows;
    /**
     * Scene_Messageで使用するウィンドウを全て作成する。
     * 
     * Note: 派生クラスから本メソッドを呼び出し、必要なリソースを構築する必要がある。
     */
    Scene_Message.prototype.createAllWindows = function() {
        _Scene_Message_createAllWindows.call(this);
        this.createChoiceActorListWindow();
    }; 
    /**
     * アクター選択用ウィンドウを作製する。
     */
    Scene_Message.prototype.createChoiceActorListWindow = function() {
        this._choiceActorListWindow = new Window_ChoiceActorList(this.choiceActorListWindowRect());
        this.addWindow(this._choiceActorListWindow);

        // Note: associateWindowsをフックして実装するのが理想だが、
        // associateWindowsはcreateAllWindows()から呼び出されるため、
        // タイミング的に_choiceActorListWindowのインスタンスが生成されていない。
        // そのためここで設定する。
        this._choiceActorListWindow.setMessageWindow(this._messageWindow);
        this._messageWindow.setChoiceActorListWindow(this._choiceActorListWindow);
    };

    /**
     * アクター選択ウィンドウの矩形領域を得る。
     */
    Scene_Message.prototype.choiceActorListWindowRect = function() {
        return new Rectangle(windowX, windowY, windowWidth, windowHeight);
    };

    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();