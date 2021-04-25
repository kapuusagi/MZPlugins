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
 * 
 * @help 
 * 111, くらむぽん様の111_InputForm.jsを元に作成。
 * 用途はカスタムプロフィールを作りたい場合くらい。
 * 値は以下の式で取得できる。
 *   $gameTemp.editingText()
 * 
 * 
 * ■ プラグイン開発者向け
 * 
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

function Scene_TextInput() {
    this.initialize(...arguments);
}


(() => {
    const pluginName = "Kapu_MultiLineInput";
    const parameters = PluginManager.parameters(pluginName);
    const spacing = Number(parameters["spacing"]) || 20;
    const defaultLineCount = Number(parameters["lineCount"]) || 2;
    const fontSize = Number(parameters["fontSize"]) || 24;
    const defaultTextAreaWidth = Number(parameters["textAreaWidth"]) || 600;
    const defaultTextAreaHeight = Number(parameters["textAreaHeight"]) || 120;
    const defaultButtonWidth = Number(parameters["buttonWidth"]) || 140;
    const defaultButtonHeight = Number(parameters["buttonHeight"]) || 60;
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
        const width = Number(args.width) || 0;
        const buttonWidth = Number(args.buttonWidth) || 0;
        const lineHeight = Number(args.lineHeight) || 0;

        SceneManager.push(Scene_TextInput);
        SceneManager.prepareNextScene(interpreter, text, lineCount, width, buttonWidth, lineHeight);
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
    // Scene_TextInput
    Scene_TextInput.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_TextInput.prototype.constructor = Scene_TextInput;

    /**
     * Scene_TextInputを初期化する。
     */
    Scene_TextInput.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this, ...arguments);
        this._interpreter = null;
        this._textArea = null;
        this._submit = null;
        this._isPC = Utils.isNwjs();
        this._lineCount = defaultLineCount;
        this._inputText = "";
        this._textAreaWidth = defaultTextAreaWidth;
        this._textAreaHeight = defaultTextAreaHeight;
        this._buttonWidth = defaultButtonWidth;
        this._buttonHeight = defaultButtonHeight;
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
    Scene_TextInput.prototype.prepare = function(interpreter, text, lineCount, width, buttonWidth, lineHeight) {
        this._interpreter = interpreter;
        this._inputText = text || "";

        lineHeight = (lineHeight > 0) ? lineHeight : 40;

        this._lineCount = (lineCount > 0) ? lineCount : this._lineCount;
        this._textAreaWidth = (width > 0) ? width : this._textAreaWidth;
        this._textAreaHeight = lineHeight * this._lineCount + 32;
        this._buttonWidth = (buttonWidth > 0) ? buttonWidth : this._buttonWidth;
        this._buttonHeight = lineHeight + 32;
    };

    /**
     * シーンを作成する。
     */
    Scene_TextInput.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createTextArea();
        this.createSubmitButton();
        this.createCancelButton();
        this._resizeEvent = this.onScreenResize.bind(this);
        window.addEventListener("resize", this._resizeEvent, false);
    };

    /**
     * テキスト領域を作成する。
     */
    Scene_TextInput.prototype.createTextArea = function() {
        this._textArea = document.createElement("textarea");
        this._textArea.setAttribute("id", "_111_input");
        // this._textArea.setAttribute("cols", 32);
        this._textArea.setAttribute("rows", this._lineCount);
        this._textArea.setAttribute("maxlength", 128);
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
    Scene_TextInput.prototype.createSubmitButton = function() {
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
    Scene_TextInput.prototype.createCancelButton = function() {
        this._cancel = document.createElement("input");
        this._cancel.setAttribute("type", "submit");
        this._cancel.setAttribute("id", "_111_submit");
        this._cancel.setAttribute("value", textCancel);
        document.body.appendChild(this._cancel);

        this._cancel.addEventListener("click", this.onCancelClick.bind(this));
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

        this._textArea.value = this._inputText;
        this._timerCounter = 0;
        this._textArea.focus();
        this._interpreter.setWaitMode("input_form");
        Input.clear();
        Input.form_mode = true;
        this.updatePlace();
    };

    /**
     * 更新する。
     */
    Scene_TextInput.prototype.update = function() {
        // Scene_MenuBase.prototype.update.call(this);
        // this._timerCounter++;
        // if (this._timerCounter >= 180) {
        //     this.popScene();
        // }
    };

    /**
     * 位置を更新する。
     */
    Scene_TextInput.prototype.updatePlace = function() {
        const _canvas = document.getElementById('UpperCanvas') || document.getElementById('gameCanvas');
        const rect = _canvas.getBoundingClientRect();
        const screen_x = rect.left;
        const screen_y = rect.top;

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
        this.setPosition(this._textArea, screen_x, screen_y, textAreaX, textAreaY, textAreaWidth, textAreaHeight, fontSize);

        const submitX = (textAreaX + textAreaWidth) - (buttonWidth + spacing + buttonWidth);
        const submitY = textAreaY + textAreaHeight + spacing;
        const submitWidth = buttonWidth;
        const submitHeight = buttonHeight;
        this.setPosition(this._submit, screen_x, screen_y, submitX, submitY, submitWidth, submitHeight, fontSize);
        
        const cancelX = (textAreaX + textAreaWidth) - buttonWidth;
        const cancelY = textAreaY + textAreaHeight + spacing;
        const cancelWidth = buttonWidth;
        const cancelHeight = buttonHeight;
        this.setPosition(this._cancel, screen_x, screen_y, cancelX, cancelY, cancelWidth, cancelHeight, fontSize);
    };

    /**
     * 位置を設定する。
     * 
     * @param {HTMLElement} element HTML要素
     * @param {number} screen_x スクリーン位置x
     * @param {number} screen_y スクリーン位置y
     * @param {number} x 要素を配置するx位置
     * @param {number} y 要素を配置するy位置
     * @param {number} width 要素の幅
     * @param {number} height 要素の高さ
     * @param {number} font_size フォントサイズ
     */
    Scene_TextInput.prototype.setPosition = function(element, screen_x, screen_y, x, y, width, height, font_size) {
        element.style.position = "absolute";
        element.style.left = screen_x + x * Graphics._realScale + "px";
        element.style.top  = screen_y + y * Graphics._realScale + "px";
        element.style.width = width * Graphics._realScale + "px";
        element.style.height = height * Graphics._realScale + "px";
        element.style.fontSize = font_size * Graphics._realScale + "px";
        element.style.maxWidth =  "calc(100% - " + element.style.left + ")";
        element.style.maxHeight = "calc(100% - " + element.style.top + ")";
    };

    /**
     * シーン終了時の処理を行う。
     */
    Scene_TextInput.prototype.terminate = function() {
        Scene_MenuBase.prototype.terminate.call(this);
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
        if (this._interpreter) {
            this._interpreter.setWaitMode("");
        }
        Input.form_mode = false;
    };

    /**
     * 画面がリサイズされたときの処理を行う。
     */
    Scene_TextInput.prototype.onScreenResize = function() {
        this.updatePlace();
    };

    /**
     * イベント処理を中止するためのコールバック
     * 
     * @param {object} event イベントオブジェクト
     */
    Scene_TextInput.prototype.stopPropagation = function(event) {
        event.stopPropagation();
    };

    /**
     * 確定ボタンがクリックされたときの処理を行う。
     * 
     * @returns {boolean} 
     */
    Scene_TextInput.prototype.onOkClick = function() {
        const value = this._textArea.value;
        $gameTemp.setEditingText(value);
        this.popScene();
        return false;
    };

    /**
     * キャンセルボタンがクリックされたときの処理を行う。
     * 
     * @returns {boolean} 
     */
    Scene_TextInput.prototype.onCancelClick = function() {
        $gameTemp.setEditingText("");
        this.popScene();
        return false;
    };

    //------------------------------------------------------------------------------
    // TODO : メソッドフック

})();