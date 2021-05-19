/*:ja
 * @target MZ 
 * @plugindesc マルチライン入力を行うためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 111_InputForm
 * @orderAfter 111_InputForm
 * 
 * @command startInput
 * @text 入力開始
 * @desc 入力を開始する。
 * 
 * @arg evalText
 * @text デフォルトテキストとして使用する表か式
 * @desc 編集開始時のデフォルトテキスト。evalText未指定時にはtextが割り当てられる。
 * @type string
 * @default
 * 
 * @arg text
 * @text デフォルトテキスト
 * @desc 編集開始時のデフォルトテキスト
 * @type string
 * @default
 * 
 * @arg maxLength
 * @text 最大文字数
 * @desc 入力可能な最大文字数。0にするとプラグインパラメータで指定した文字数になる。
 * @type number
 * @default 0
 * 
 * @arg lineCount
 * @text 入力行数
 * @desc 入力行数。0にするとプラグインパラメータで指定した行数になる。
 * @type number
 * @default 0
 * 
 * @arg width
 * @text テキスト領域の幅
 * @desc テキスト領域の幅。0にするとプラグインパラメータで指定した幅になる。
 * @type number
 * @default 0
 * 
 * @arg buttonWidth
 * @text ボタンの幅
 * @desc ボタンの幅。0にするとプラグインパラメータで指定した幅になる。
 * @type number
 * @default 0
 * 
 * @arg lineHeight
 * @text ボタンの高さ
 * @desc ボタンの高さ。0にするとプラグインパラメータで指定した高さになる。
 * @type number
 * @default 40
 * 
 * @param spacing
 * @text コンポーネント間幅
 * @desc コンポーネント間のスペース
 * @type number
 * @default 20
 * 
 * @param lineCount
 * @text 行数
 * @desc 行数
 * @type number
 * @default 2
 * 
 * @param fontSize
 * @text フォントサイズ
 * @desc フォントサイズ
 * @type number
 * @default 24
 * 
 * @param textAreaWidth
 * @text テキストボックスの幅
 * @desc テキストボックスの幅
 * @type number
 * @default 600
 * 
 * @param textAreaHeight
 * @text テキストボックスの高さ
 * @desc テキストボックスの高さ
 * @type number
 * @default 120
 * 
 * @param buttonWidth
 * @text ボタン幅
 * @desc OK/キャンセルボタンの幅
 * @type number
 * @default 140
 * 
 * @param buttonHeight
 * @text ボタン高さ
 * @desc OK/キャンセルボタンの高さ
 * @type number
 * @default 60
 * 
 * @param textSubmit
 * @text OKテキスト
 * @desc OKボタンのラベルとして使用されるテキスト
 * @type string
 * @default OK
 * 
 * @param textCancel
 * @text キャンセルテキスト
 * @desc キャンセルボタンのラベルとして使用されるテキスト
 * @type string
 * @default キャンセル
 * 
 * @param maxLength
 * @text デフォルト入力可能な最大文字数
 * @desc プラグインコマンドで指定しない場合の、入力可能な最大文字数
 * @type number
 * @default 128
 * 
 * @help 
 * 111, くらむぽん様の111_InputForm.jsを元に作成。
 * 用途はカスタムプロフィールを作りたい場合くらい。
 * 値は以下の式で取得できる。
 *   $gameTemp.editingText()
 * 
 * 
 * ■ プラグイン開発者向け
 * 他のプラグインで使えるように MultiLine_TextInput モジュールを追加した。
 * 使い方
 *   (1) MultiLine_TextInputのインスタンスを作成する。
 *   (2) setHandlerメソッドで "OK" 操作、 "Cancel" 操作の処理を追加する。
 *   (3) setup()を呼び出し、パラメータを設定する。
 *   (4) create()を呼び出し、リソースを作成する。
 *   (5) start()を呼び出し、処理を開始する。
 *   (6) terminate()を呼び出し、リソースを解放する。
 * ============================================
 * プラグインコマンド
 * ============================================
 * 入力開始
 *     テキストを入力する。
 *     値は $gameTemp.editingText() で取得する。
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */

/**
 * 複数行テキスト入力
 */
function MultiLine_TextInput() {
    this.initialize(...arguments);
}

/**
 * テキスト入力シーン
 */
function Scene_TextInput() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_MultiLineInput";
    const parameters = PluginManager.parameters(pluginName);
    const spacing = Math.floor(Number(parameters["spacing"]) || 20);
    const defaultLineCount = Math.floor(Number(parameters["lineCount"]) || 2);
    const fontSize = Math.floor(Number(parameters["fontSize"]) || 24);
    const defaultTextAreaWidth = Math.floor(Number(parameters["textAreaWidth"]) || 600);
    const defaultTextAreaHeight = Math.floor(Number(parameters["textAreaHeight"]) || 120);
    const defaultButtonWidth = Math.floor(Number(parameters["buttonWidth"]) || 140);
    const defaultButtonHeight = Math.floor(Number(parameters["buttonHeight"]) || 60);
    const defaultMaxLength = Math.floor(Number(parameters["maxLength"]) || 128);
    const textSubmit = parameters["textSubmit"] || "OK";
    const textCancel = parameters["textCancel"] || "Cancel";

    // Note: 匿名関数だと this に Game_Interpreter が渡らないことに注意。
    PluginManager.registerCommand(pluginName, "startInput", function(args) {
        const interpreter = this;

        let text;
        if (args.evalText) {
            try {
                text = eval(args.evalText);
            }
            catch (e) {
                console.log(e);
                text = args.text || "";
            }
        } else {
            text = "";
        }
        const lineCount = Number(args.lineCount) || 0;
        const maxLength = Number(args.maxLength) || 0;
        const width = Number(args.width) || 0;
        const buttonWidth = Number(args.buttonWidth) || 0;
        const lineHeight = Number(args.lineHeight) || 0;

        SceneManager.push(Scene_TextInput);
        SceneManager.prepareNextScene(interpreter, text, maxLength, lineCount, width, buttonWidth, lineHeight);
    });
    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._editingText = "";
    };

    /**
     * 編集したテキストを設定する。
     * 
     * @param {string} text テキスト
     */
    Game_Temp.prototype.setEditingText = function(text) {
        this._editingText = text;
    };

    /**
     * 編集したテキストを得る。
     * 
     * @returns {string} テキスト
     */
    Game_Temp.prototype.editingText = function() {
        return this._editingText;
    };

    //------------------------------------------------------------------------------
    // MultiLine_TextInput
    /**
     * MultiLine_TextInputを初期化する。
     */
    MultiLine_TextInput.prototype.initialize = function() {
        this._interpreter = null;
        this._textArea = null;
        this._submit = null;
        this._cancel = null;
        this._isPC = Utils.isNwjs();
        this._lineCount = defaultLineCount;
        this._inputText = "";
        this._maxLength = defaultMaxLength;
        this._textAreaWidth = defaultTextAreaWidth;
        this._textAreaHeight = defaultTextAreaHeight;
        this._buttonWidth = defaultButtonWidth;
        this._buttonHeight = defaultButtonHeight;

        this._handlers = {};
    };

    /**
     * 作成前のパラメータをセットアップする。
     * 
     * @param {Game_Interpreter} interpreter インタプリタオブジェクト
     * @param {string} text デフォルトのテキスト
     * @param {number} maxLength 最大長
     * @param {number} lineCount 行数
     * @param {number} width 幅
     * @param {number} buttonWidth ボタンの幅
     * @param {number} lineHeight 行の高さ
     */
    MultiLine_TextInput.prototype.setup = function(interpreter, text, maxLength, lineCount, width, buttonWidth, lineHeight) {
        this._interpreter = interpreter;
        this._inputText = text || "";
        this._maxLength = maxLength || this._maxLength;

        lineHeight = (lineHeight > 0) ? lineHeight : 40;

        this._lineCount = (lineCount > 0) ? lineCount : this._lineCount;
        this._textAreaWidth = (width > 0) ? width : this._textAreaWidth;
        this._textAreaHeight = lineHeight * this._lineCount + 16;
        this._buttonWidth = (buttonWidth > 0) ? buttonWidth : this._buttonWidth;
        this._buttonHeight = lineHeight + 16;
    };


    /**
     * テキスト長の最大値を設定する。
     * 
     * @param {number} maxLength テキスト長
     */
    MultiLine_TextInput.prototype.setMaxLength = function(maxLength) {
        this._maxLength = maxLength;
        if (this._textArea) {
            this._textArea.setAttribute("maxlength", maxLength);
        }
    };

    /**
     * テキスト長の最大を得る。
     * 
     * @returns {number} テキスト長
     */
    MultiLine_TextInput.prototype.maxLength = function() {
        return this._maxLength;
    };
    /**
     * テキストを設定する。
     * 
     * @param {string} text テキスト
     */
    MultiLine_TextInput.prototype.setText = function(text) {
        this._inputText = text;
        if (this._textArea) {
            this._textArea.value = text;
        }
    };

    /**
     * 入力されたテキスト
     * 
     * @returns {string} テキスト
     */
    MultiLine_TextInput.prototype.text = function() {
        return this._inputText;
    };


    /**
     * ハンドラを設定する。
     * 
     * @param {string} symbol シンボル
     * @param {function} handler ハンドラ
     */
    MultiLine_TextInput.prototype.setHandler = function(symbol, handler) {
        this._handlers[symbol] = handler;
    };

    /**
     * ハンドラを呼び出す
     * 
     * @param {string} symbol シンボル
     */
    MultiLine_TextInput.prototype.callHandler = function(symbol) {
        if (this._handlers[symbol]) {
            this._handlers[symbol]();
        }
    };
    

    /**
     * 作成する。
     */
    MultiLine_TextInput.prototype.create = function() {
        this.createTextArea();
        this.createSubmitButton();
        this.createCancelButton();
        this._resizeEvent = this.onScreenResize.bind(this);
        window.addEventListener("resize", this._resizeEvent, false);

        this.hide();
    };

    /**
     * テキスト領域を作成する。
     */
    MultiLine_TextInput.prototype.createTextArea = function() {
        this._textArea = document.createElement("textarea");
        this._textArea.setAttribute("id", "_111_input");
        // this._textArea.setAttribute("cols", 32);
        this._textArea.setAttribute("rows", this._lineCount);
        this._textArea.setAttribute("maxlength", this._maxLength);
        this._textArea.setAttribute("wrap", "off");
        this._textArea.setAttribute("value", "default text.");
        document.body.appendChild(this._textArea);

        this._textArea.addEventListener("mousedown", this.stopPropagation.bind(this));
        this._textArea.addEventListener("touchstart", this.stopPropagation.bind(this));
        this._textArea.addEventListener("mousedown", this.stopPropagation.bind(this));
        this._textArea.addEventListener("touchstart", this.stopPropagation.bind(this));
    };

    /**
     * OKボタンを作成する。
     */
    MultiLine_TextInput.prototype.createSubmitButton = function() {
        this._submit = document.createElement("input");
        this._submit.setAttribute("type", "submit");
        this._submit.setAttribute("id", "_111_submit");
        this._submit.setAttribute("value", textSubmit);
        document.body.appendChild(this._submit);

        this._submit.addEventListener("click", this.onOkClick.bind(this));
    };

    /**
     * キャンセルボタンを作成する。
     */
    MultiLine_TextInput.prototype.createCancelButton = function() {
        this._cancel = document.createElement("input");
        this._cancel.setAttribute("type", "submit");
        this._cancel.setAttribute("id", "_111_submit");
        this._cancel.setAttribute("value", textCancel);
        document.body.appendChild(this._cancel);

        this._cancel.addEventListener("click", this.onCancelClick.bind(this));
    };


    /**
     * 入力を開始する
     */
    MultiLine_TextInput.prototype.start = function() {
        this._textArea.value = this._inputText;
        this._textArea.focus();
        if (this._interpreter) {
            this._interpreter.setWaitMode("input_form");
        }
        Input.clear();
        Input.form_mode = true;
        this.show();
    };

    /**
     * 表示する
     */
    MultiLine_TextInput.prototype.show = function() {
        this._textArea.hidden = false;
        this._submit.hidden = false;
        this._cancel.hidden = false;
        this.updatePlace();
    };

    /**
     * 非表示にする
     */
    MultiLine_TextInput.prototype.hide = function() {
        this._textArea.hidden = true;
        this._submit.hidden = true;
        this._cancel.hidden = true;
    };

    /**
     * 位置を更新する。
     */
    MultiLine_TextInput.prototype.updatePlace = function() {
        const _canvas = document.getElementById('UpperCanvas') || document.getElementById('gameCanvas');
        const rect = _canvas.getBoundingClientRect();
        const screenX = rect.left;
        const screenY = rect.top;

        const totalHeight = this._textAreaHeight + this._buttonHeight + spacing;

        const textAreaWidth = this._textAreaWidth;
        const textAreaHeight = (totalHeight < Graphics.boxHeight)
                ? this._textAreaHeight : (Graphics.boxHeight - (this._buttonHeight + spacing));
        const buttonWidth = this._buttonWidth;
        const buttonHeight = this._buttonHeight;

        const maxWidth = Math.max(textAreaWidth, buttonWidth * 2 + spacing);
        const maxHeight = textAreaHeight + spacing + buttonHeight;
        const textAreaX = (Graphics.boxWidth - maxWidth) / 2;
        const textAreaY = (Graphics.boxHeight - maxHeight) / 2;
        this.setPosition(this._textArea, screenX, screenY, textAreaX, textAreaY, textAreaWidth, textAreaHeight, fontSize);

        const submitX = (textAreaX + textAreaWidth) - (buttonWidth + spacing + buttonWidth);
        const submitY = textAreaY + textAreaHeight + spacing;
        const submitWidth = buttonWidth;
        const submitHeight = buttonHeight;
        this.setPosition(this._submit, screenX, screenY, submitX, submitY, submitWidth, submitHeight, fontSize);
        
        const cancelX = (textAreaX + textAreaWidth) - buttonWidth;
        const cancelY = textAreaY + textAreaHeight + spacing;
        const cancelWidth = buttonWidth;
        const cancelHeight = buttonHeight;
        this.setPosition(this._cancel, screenX, screenY, cancelX, cancelY, cancelWidth, cancelHeight, fontSize);
    };

    /**
     * 位置を設定する。
     * 
     * @param {HTMLElement} element HTML要素
     * @param {number} screenX スクリーン位置x
     * @param {number} screenY スクリーン位置y
     * @param {number} x 要素を配置するx位置
     * @param {number} y 要素を配置するy位置
     * @param {number} width 要素の幅
     * @param {number} height 要素の高さ
     * @param {number} fontSize フォントサイズ
     */
    MultiLine_TextInput.prototype.setPosition = function(element, screenX, screenY, x, y, width, height, fontSize) {
        element.style.position = "absolute";
        element.style.left = screenX + x * Graphics._realScale + "px";
        element.style.top  = screenY + y * Graphics._realScale + "px";
        element.style.width = width * Graphics._realScale + "px";
        element.style.height = height * Graphics._realScale + "px";
        element.style.fontSize = fontSize * Graphics._realScale + "px";
        element.style.maxWidth =  "calc(100% - " + element.style.left + ")";
        element.style.maxHeight = "calc(100% - " + element.style.top + ")";
    };

    /**
     * 画面がリサイズされたときの処理を行う。
     */
    MultiLine_TextInput.prototype.onScreenResize = function() {
        this.updatePlace();
    };

    /**
     * イベント処理を中止するためのコールバック
     * 
     * @param {object} event イベントオブジェクト
     */
     MultiLine_TextInput.prototype.stopPropagation = function(event) {
        event.stopPropagation();
    };

    /**
     * 確定ボタンがクリックされたときの処理を行う。
     * 
     * @returns {boolean} 
     */
    MultiLine_TextInput.prototype.onOkClick = function() {
        this._inputText = this._textArea.value;
        this.callHandler("ok");
        this.hide();
        if (this._interpreter) {
            this._interpreter.setWaitMode("");
        }
        Input.form_mode = false;

        return false;
    };

    /**
     * キャンセルボタンがクリックされたときの処理を行う。
     * 
     * @returns {boolean} 
     */
    MultiLine_TextInput.prototype.onCancelClick = function() {
        this._inputText = "";
        this.callHandler("cancel");
        this.hide();
        if (this._interpreter) {
            this._interpreter.setWaitMode("");
        }
        Input.form_mode = false;
        return false;
    };


    /**
     * 終了処理する。
     */
    MultiLine_TextInput.prototype.terminate = function() {
        if (this._textArea) {
            this._textArea.remove();
            this._textArea = null;
        }
        if (this._submit) {
            this._submit.remove();
            this._submit = null;
        }
        if (this._cancel) {
            this._cancel.remove();
            this._cancel = null;
        }
        if (this._resizeEvent) {
            window.removeEventListener("resize", this._resizeEvent, false);
            this._resizeEvent = null;
        }
    };



    //------------------------------------------------------------------------------
    // Scene_TextInput
    Scene_TextInput.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_TextInput.prototype.constructor = Scene_TextInput;

    /**
     * Scene_TextInputを初期化する。
     */
    Scene_TextInput.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this, ...arguments);
        this._multiLine_TextInput = new MultiLine_TextInput();
    };

    /**
     * シーンの準備をする。
     * 
     * @param {Game_Interpreter} interpreter インタプリタオブジェクト
     * @param {string} text テキスト
     * @param {number} lineCount 入力行数
     * @param {number} width 幅
     * @param {number} buttonWidth ボタン幅
     * @param {number} lineHeight ボタン高さ
     */
    Scene_TextInput.prototype.prepare = function(interpreter, text, maxLength, lineCount, width, buttonWidth, lineHeight) {
        this._multiLine_TextInput.setup(interpreter, text, maxLength, lineCount, width, buttonWidth, lineHeight);
    };

    /**
     * シーンを作成する。
     */
    Scene_TextInput.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._multiLine_TextInput.create();
        this._multiLine_TextInput.setHandler("ok", this.onInputOk.bind(this));
        this._multiLine_TextInput.setHandler("cancel", this.onInputCancel.bind(this));
    };

    /**
     * 背景を作成する。
     * 
     * Note: シーン切り替えによる、背景ぼかしを行わないために変更する。
     */
    Scene_TextInput.prototype.createBackground = function() {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(192);
    };

    /**
     * シーンを開始する。
     */
    Scene_TextInput.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        $gameTemp.setEditingText("");
        this._multiLine_TextInput.start();
    };

    /**
     * 更新する。
     */
    Scene_TextInput.prototype.update = function() {
        // Scene_MenuBase.prototype.update.call(this);
    };

    /**
     * 入力OK操作されたときの処理を行う。
     */
    Scene_TextInput.prototype.onInputOk = function() {
        $gameTemp.setEditingText(this._multiLine_TextInput.text());
        this.popScene();
    };

    /**
     * 入力キャンセル操作されたときの処理を行う。
     */
    Scene_TextInput.prototype.onInputCancel = function() {
        $gameTemp.setEditingText("");
        this.popScene();
    };

    /**
     * シーン終了時の処理を行う。
     */
    Scene_TextInput.prototype.terminate = function() {
        Scene_MenuBase.prototype.terminate.call(this);
        this._multiLine_TextInput.terminate();
    };


    //------------------------------------------------------------------------------
    // TODO : メソッドフック

})();