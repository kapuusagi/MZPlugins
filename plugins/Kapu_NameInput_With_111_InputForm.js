/*:ja
 * @target MZ 
 * @plugindesc NameInputを変更し、111氏作成のフォームを使用するようにする。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 111_InputForm
 * @orderAfter 111_InputForm
 * 
 * @param fontSize
 * @text フォントサイズ
 * @desc フォントサイズ
 * @type number
 * @default 24
 * 
 * 
 * @param textBoxWidth
 * @text テキストボックスの幅
 * @desc テキストボックスの幅を指定する。
 * @type number
 * @default 200
 * 
 * @param buttonWidth
 * @text 確定/キャンセルボタンの幅
 * @desc 確定/キャンセルボタンの幅を指定する。
 * @type number
 * @default 80
 * 
 * @param buttonHeight
 * @text テキストボックスとボタンの高さ
 * @desc テキストボックスとボタンの高さを指定する。
 * @type number
 * @default 60
 * 
 * @param spacing
 * @text コンポーネント間幅
 * @desc コンポーネント間のスペース
 * @type number
 * @default 20
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
 * @default 16
 *  
 * @help 
 * アクターの名前入力を、InputFormを使用して行うように変更するプラグインです。
 * 
 * ■ 必要なプラグイン
 * 神無月サスケ (原案:111、くらむぼん)様作 111_InputForms.js プラグインが必要。
 * https://plugin.fungamemake.com/archives/2601
 * プラグインの導入方法についてはムノクラ氏のドキュメントに従うとよい。
 * https://fungamemake.com/archives/11428
 * 
 * ■ 使用時の注意
 * 名前を入力したいだけならば、InputForms.jsプラグインだけでもよい。
 * 本プラグインは名前入力に使用しているWindow自体を変更してしまうため、
 * 他のプラグインで名前入力ウィンドウを使っている場合には問題が発生する。
 * 
 * ■ プラグイン開発者向け
 * Window_NameInput及びWindow_NameEditのメソッドを上書き/削除して対応した。
 * Window_NameEditは常に非表示で、変更前の名前取得用＆変更後の名前取得用の入れ物として動作させる。
 * Window_NameInputは下記のように変更した。
 *     ・初期化時に入力用HTML要素/決定用HTML要素を作成。
 *       デフォルトでは表示
 *       Window_NameInput自体は長さゼロとして、表示されないようにした。
 *     ・show/hideをオーバーライドし、
 *       入力用HTML要素/決定用HTML要素を表示/非表示を切り替える構造に変更。
 *     ・activate/deactivateをオーバーライドし、
 *       フォーカスを入れる/外す処理に変更。
 * 
 * 
 * 他のプラグインで使えるように Simple_TextInput モジュールを追加した。
 * 使い方
 *   (1) MultiLine_TextInputのインスタンスを作成する。
 *   (2) setHandlerメソッドで "OK" 操作、 "Cancel" 操作の処理を追加する。
 *   (3) setup()を呼び出し、パラメータを設定する。
 *   (4) create()を呼び出し、リソースを作成する。
 *   (5) start()を呼び出し、処理を開始する。
 *   (6) terminate()を呼び出し、リソースを解放する。 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * ありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 111_InputForm.js Ver.2020/08/22 との組み合わせにて動作確認。
 */

/**
 * 1行テキスト入力。
 */
function Simple_TextInput() {
    this.initialize(...arguments);
}


(() => {
    const pluginName = "Kapu_NameInput_With_111_InputForm";
    const parameters = PluginManager.parameters(pluginName);

    const defaultTextBoxWidth = Math.floor(Number(parameters["textBoxWidth"]) || 200);
    const defaultButtonWidth = Math.floor(Number(parameters["buttonWidth"]) || 80);
    const defaultButtonHeight = Math.floor(Number(parameters["buttonHeight"]) || 60);
    const spacing = Math.floor(Number(parameters["spacing"]) || 20);
    const fontSize = Math.floor(Number(parameters["fontSize"]) || 24);
    const defaultMaxLength = Math.floor(Number(parameters["maxLength"]) || 16);
    const textSubmit = parameters["textSubmit"] || "OK";
    const textCancel = parameters["textCancel"] || "Cancel";

    //------------------------------------------------------------------------------
    // Simple_TextInput
    Simple_TextInput.prototype.initialize = function() {
        this._interpreter = null;
        this._isCancelEnabled = true;
        this._textBox = null;
        this._submit = null;
        this._cancel = null;
        this._isPC = Utils.isNwjs();
        this._inputText = "";
        this._maxLength = defaultMaxLength;
        this._textBoxWidth = defaultTextBoxWidth;
        this._textBoxHeight = defaultButtonHeight;
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
     * @param {number} width 幅
     * @param {number} buttonWidth ボタンの幅
     * @param {number} lineHeight 行の高さ
     * @param {boolean} isCancelEnabled キャンセル操作可能かどうか
     */
    Simple_TextInput.prototype.setup = function(interpreter, text, maxLength, width, buttonWidth, lineHeight, isCancelEnabled) {
        this._interpreter = interpreter;
        this._inputText = text || "";
        this._maxLength = maxLength || this._maxLength;

        lineHeight = (lineHeight > 0) ? lineHeight : 40;

        this._lineCount = (lineCount > 0) ? lineCount : this._lineCount;
        this._textBoxWidth = (width > 0) ? width : this._textBoxWidth;
        this._textBoxHeight = lineHeight + 16;
        this._buttonWidth = (buttonWidth > 0) ? buttonWidth : this._buttonWidth;
        this._buttonHeight = lineHeight + 16;

        this._isCancelEnabled = isCancelEnabled;
    };

    /**
     * ハンドラを設定する。
     * 
     * @param {string} symbol シンボル
     * @param {function} handler ハンドラ
     */
    Simple_TextInput.prototype.setHandler = function(symbol, handler) {
        this._handlers[symbol] = handler;
    };
    /**
     * ハンドラを呼び出す
     * 
     * @param {string} symbol シンボル
     */
    Simple_TextInput.prototype.callHandler = function(symbol) {
        if (this._handlers[symbol]) {
            this._handlers[symbol]();
        }
    };
    /**
     * 作成する。
     */
    Simple_TextInput.prototype.create = function() {
        this.createTextBox();
        this.createSubmitButton();
        this.createCancelButton();
        this._resizeEvent = this.onScreenResize.bind(this);
        window.addEventListener("resize", this._resizeEvent, false);

        this.hide();
    };

    /**
     * テキスト領域を作成する。
     */
    Simple_TextInput.prototype.createTextBox = function() {
        this._textBox = document.createElement("input");
        this._textBox.setAttribute("id", "_111_input");
        this._textBox.setAttribute("maxlength", this._maxLength);
        this._textBox.setAttribute("value", "default text.");
        document.body.appendChild(this._textBox);

        this._textBox.addEventListener("mousedown", this.stopPropagation.bind(this));
        this._textBox.addEventListener("touchstart", this.stopPropagation.bind(this));
        this._textBox.addEventListener("mousedown", this.stopPropagation.bind(this));
        this._textBox.addEventListener("touchstart", this.stopPropagation.bind(this));
    };

    /**
     * OKボタンを作成する。
     */
    Simple_TextInput.prototype.createSubmitButton = function() {
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
    Simple_TextInput.prototype.createCancelButton = function() {
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
    Simple_TextInput.prototype.start = function() {
        this._textBox.value = this._inputText;
        this._textBox.focus();
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
    Simple_TextInput.prototype.show = function() {
        this._textBox.hidden = false;
        this._submit.hidden = false;
        if (this._isCancelEnabled) {
            this._cancel.hidden = false;
        }
        this.updatePlace();
    };

    /**
     * 非表示にする
     */
    Simple_TextInput.prototype.hide = function() {
        this._textBox.hidden = true;
        this._submit.hidden = true;
        this._cancel.hidden = true;
    };

    /**
     * 位置を更新する。
     */
    Simple_TextInput.prototype.updatePlace = function() {
        const _canvas = document.getElementById('UpperCanvas') || document.getElementById('gameCanvas');
        const rect = _canvas.getBoundingClientRect();
        const screenX = rect.left;
        const screenY = rect.top;

        const totalHeight = this._textBoxHeight + this._buttonHeight + spacing;

        const textBoxWidth = this._textBoxWidth;
        const textBoxHeight = (totalHeight < Graphics.boxHeight)
                ? this._textBoxHeight : (Graphics.boxHeight - (this._buttonHeight + spacing));
        const buttonWidth = this._buttonWidth;
        const buttonHeight = this._buttonHeight;

        const maxWidth = Math.max(textBoxWidth, buttonWidth * 2 + spacing);
        const maxHeight = textBoxHeight + spacing + buttonHeight;
        const textBoxX = (Graphics.boxWidth - maxWidth) / 2;
        const textBoxY = (Graphics.boxHeight - maxHeight) / 2;
        this.setPosition(this._textBox, screenX, screenY, textBoxX, textBoxY, textBoxWidth, textBoxHeight, fontSize);

        const submitX = (textBoxX + textBoxWidth) - (buttonWidth + spacing + buttonWidth);
        const submitY = textBoxY + textBoxHeight + spacing;
        const submitWidth = buttonWidth;
        const submitHeight = buttonHeight;
        this.setPosition(this._submit, screenX, screenY, submitX, submitY, submitWidth, submitHeight, fontSize);
        
        const cancelX = (textBoxX + textBoxWidth) - buttonWidth;
        const cancelY = textBoxY + textBoxHeight + spacing;
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
    Simple_TextInput.prototype.setPosition = function(element, screenX, screenY, x, y, width, height, fontSize) {
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
    Simple_TextInput.prototype.onScreenResize = function() {
        this.updatePlace();
    };

    /**
     * イベント処理を中止するためのコールバック
     * 
     * @param {object} event イベントオブジェクト
     */
    Simple_TextInput.prototype.stopPropagation = function(event) {
        event.stopPropagation();
    };

    /**
     * 確定ボタンがクリックされたときの処理を行う。
     * 
     * @returns {boolean} 
     */
    Simple_TextInput.prototype.onOkClick = function() {
        this._inputText = this._textBox.value;
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
    Simple_TextInput.prototype.onCancelClick = function() {
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
    Simple_TextInput.prototype.terminate = function() {
        if (this._textBox) {
            this._textBox.remove();
            this._textBox = null;
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

    /**
     * テキストを設定する。
     * 
     * @param {string} text テキスト
     */
    Simple_TextInput.prototype.setText = function(text) {
        this._inputText = text;
        if (this._textBox) {
            this._textBox.value = text;
        }
    };

    /**
     * 入力されたテキスト
     * 
     * @returns {string} テキスト
     */
    Simple_TextInput.prototype.text = function() {
        return this._inputText;
    };




    
    //------------------------------------------------------------------------------
    // Window_NameInput
    //   名前入力ウィンドウ

    const _Window_NameInput_initialize = Window_NameInput.prototype.initialize;

    /**
     * Window_NameInputを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_NameInput.prototype.initialize = function(rect) {
        _Window_NameInput_initialize.call(this, new Rectangle(0, 0, 0, 0));
        this._elementPosition = rect;
        this._is_pc = Utils.isNwjs();
        this.createInputElement();
        this.createSubmitElement();
        this.adjustElementPosition();

        this._resizeEvent = this.adjustElementPosition.bind(this);
        window.addEventListener("resize", this._resizeEvent, false);

        this._initialized = true;
    };

    /**
     * 入力要素を構築する。
     */
    Window_NameInput.prototype.createInputElement = function() {
        this._textBox = document.createElement("input");
        this._textBox.setAttribute("id", "_111_input");
        this._textBox.hidden = false;
        this._textBox.setAttribute("value", this._name);
        document.body.appendChild(this._textBox);

        // 送信するイベント
        this._textBox.addEventListener("keydown" , this.onKeyDown.bind(this));
        this._textBox.addEventListener("mousedown", this.onHandleInputEvent.bind(this)); // 裏のゲーム画面のクリック暴発を防ぐ
        this._textBox.addEventListener("touchstart", this.onHandleInputEvent.bind(this)); // iOSでclickイベント取れない対策
        
    };

    /**
     * 決定要素を構築する。
     */
    Window_NameInput.prototype.createSubmitElement = function() {
        this._submit = document.createElement("input");
        this._submit.hidden = false;
        this._submit.setAttribute("type", "submit");
        this._submit.setAttribute("id", "_111_submit");
        this._submit.setAttribute("value", textSubmit);
        document.body.appendChild(this._submit);

        this._submit.addEventListener("mousedown", this.onHandleInputEvent.bind(this)); // 裏のゲーム画面のクリック暴発を防ぐ
        this._submit.addEventListener("touchstart", this.onHandleInputEvent.bind(this)); // iOSでclickイベント取れない対策
        this._submit.addEventListener("click" , this.onClick.bind(this)); // 
    };

    /**
     * フォームのイベントを処理する。
     * 
     * @param {object} event イベントオブジェクト
     */
    Window_NameInput.prototype.onHandleInputEvent = function(event) {
        if (!this._textBox.hidden) {
            // 入力フォーム表示中はイベントを伝播させない。
            event.stopPropagation();
        }
    };

    /**
     * ウィンドウを表示する。
     * 
     * !!!overwrite!!! Window_NameInput.show()
     *     ウィンドウではなく、入力用フォームの表示・非表示を
     *     コントロールするためオーバーライドする。
     */
    Window_NameInput.prototype.show = function() {
        this._textBox.hidden = false;
        this._submit.hidden = false;
    };


    /**
     * ウィンドウを隠す
     * 
     * !!!overwrite!!! Window_NameInput.hide()
     *     ウィンドウではなく、入力用フォームの表示・非表示を
     *     コントロールするためオーバーライドする。
     */
    Window_NameInput.prototype.hide = function() {
        this._textBox.hidden = true;
        this._submit.hidden = true;
    };

    /**
     * ウィンドウをアクティブ化し、入力を受け取るようにする。
     */
    Window_NameInput.prototype.activate = function() {
        if (!this._initialized) {
            return;
        }
        Window_Selectable.prototype.activate.call(this);

        /* Init */
        if (this._editWindow) {
            const maxLength = this._editWindow.maxLength()
            this._textBox.setAttribute("maxlength", maxLength);
            this._textBox.value = this._editWindow.name();
        }

        // 多分これがactivate()本来のメソッド
        this._textBox.focus();

        /* call start(). */
        Input.clear();
        Input.form_mode = true;
    };

    const _Window_NameInput_destroy = Window_NameInput.prototype.destroy;
    /**
     * ウィンドウを破棄する。
     */
    Window_NameInput.prototype.destroy = function() {
        _Window_NameInput_destroy.call(this);
        if (this._textBox) {
            this._textBox.remove();
        }
        if (this._submit) {
            this._submit.remove();
        }
        if (this._resizeEvent) {
            window.removeEventListener("resize", this._resizeEvent, false);
        }
    };


    /**
     * 要素の位置を調整する。
     */
    Window_NameInput.prototype.adjustElementPosition = function() {
        const canvas = document.getElementById("UpperCanvas") || document.getElementById("gameCanvas");
        const rect = canvas.getBoundingClientRect();

        const screenX = rect.left;
        const screenY = rect.top;

        const maxWidth = Math.max(defaultTextBoxWidth, defaultButtonWidth);
        const totalHeight = buttonHeight + 32 + spacing;
        const textBoxX = (Graphics.boxWidth - maxWidth) / 2;
        const textBoxY = (Graphics.boxHeight - totalHeight) / 2;
        const textBoxWidth = defaultTextBoxWidth;
        const textBoxHeight = defaultButtonHeight;
        const buttonX = textBoxX + maxWidth - defaultButtonWidth;
        const buttonY = textBoxY + textBoxHeight + spacing;
        const buttonWidth = defaultButtonWidth;
        const buttonHeight = defaultButtonHeight;

        this.setElementPosition(this._textBox, screenX, screenY, textBoxX, textBoxY, textBoxWidth, textBoxHeight, fontSize);
        this.setElementPosition(this._submit, screenX, screenY, buttonX, buttonY, buttonWidth, buttonHeight, fontSize)
    };

    /**
     * 要素の位置を設定する。
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
     Window_NameInput.prototype.setElementPosition = function(element, screenX, screenY, x, y, width, height, fontSize) {
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
     * HTML要素でキーが押されたときの処理を行う。
     * 
     * @param {object} e イベントオブジェクト
     */
    Window_NameInput.prototype.onKeyDown = function(e) {
        if (!this._textBox.hidden) {
            if (e.keyCode === 13){ // 決定キーで送信
                Input.clear();
                this.onSuccess();
                // 親へのイベント伝播を止める（documentのkeydownが反応しないように）
                e.stopPropagation();
            } else {
                // 他のイベントは無視。
            }
        }
    };

    /**
     * HTML要素のSubmitボタンがクリックされたときの処理を行う。
     * 
     * @returns {boolean} 送信完了の場合にはtrue, キャンセル時はfalse.
     *                    送信完了するとページを閉じる処理が行われるからfalseを返さないといけないはず。
     */
    Window_NameInput.prototype.onClick = function(){ // 送信ボタンクリック
        this.onSuccess();
        return false;
    };

    /**
     * 入力完了を処理する。
     */
    Window_NameInput.prototype.onSuccess = function() {
        SoundManager.playOk();
        if (this._textBox.value) {
            if (this._editWindow) {
                this._editWindow.setName(this._textBox.value);
            }
        }

        Input.form_mode = false;
        this.deactivate();
        this.callOkHandler();
    };

    /**
     * ウィンドウを非アクティブ化し、入力を受け取らないようにする。
     */
    Window_NameInput.prototype.deactivate = function() {
        Window_Selectable.prototype.deactivate.call(this);

        // フォーカスを外す
        if (this._textBox) {
            this._textBox.blur();
        }
        Input.form_mode = false;
    };

    /**
     * キャンセル処理を行う。
     * 
     * !!!overwrite!!! Window_NameInput.processCancel()
     *     既定では一文字削除の処理が実装されているが、
     *     入力キャンセルに変更する。
     */
    Window_NameInput.prototype.processCancel = function() {
        SoundManager.playCancel();
        this.deactivate();
        this.callOkHandler();
    };

    //------------------------------------------------------------------------------
    // Window_NameEdit
    const _Window_NameEdit_initialize = Window_NameEdit.prototype.initialize;

    /**
     * Window_NameEdit を初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_NameEdit.prototype.initialize = function(rect) {
        _Window_NameEdit_initialize.call(this, rect);
        this.active = false;
        this.visible = false;
    };

    /**
     * 最大入力文字数を得る。
     * 
     * @returns {number} 最大入力文字数
     */
    Window_NameEdit.prototype.maxLength = function() {
        return this._maxLength || 0;
    };

    /**
     * ウィンドウを表示する。
     * 
     * !!!overwrite!!! Window_NameEdit.show()
     *     ウィンドウを表示させないため、オーバーライドする。
     */
    Window_NameEdit.prototype.show = function() {
    };

    /**
     * 名前を設定する。
     * 
     * @param {string} name 名前
     */
    Window_NameEdit.prototype.setName = function(name) {
        this._name = name;
        this.refresh();
    };


})();