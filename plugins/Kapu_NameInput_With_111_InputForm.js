/*:ja
 * @target MZ 
 * @plugindesc NameInputを変更し、111氏作成のフォームを使用するようにする。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 111_InputForm
 * @orderAfter 111_InputForm
 * 
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
(() => {

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
        this._input = document.createElement("input");
        this._input.setAttribute("id", "_111_input");
        this._input.hidden = false;
        this._input.setAttribute("value", this._name);
        document.body.appendChild(this._input);

        // 送信するイベント
        this._input.addEventListener("keydown" , this.onKeyDown.bind(this));
        this._input.addEventListener("mousedown", this.onHandleInputEvent.bind(this)); // 裏のゲーム画面のクリック暴発を防ぐ
        this._input.addEventListener("touchstart", this.onHandleInputEvent.bind(this)); // iOSでclickイベント取れない対策
        
    };

    /**
     * 決定要素を構築する。
     */
    Window_NameInput.prototype.createSubmitElement = function() {
        this._submit = document.createElement("input");
        this._submit.hidden = false;
        this._submit.setAttribute("type", "submit");
        this._submit.setAttribute("id", "_111_submit");
        this._submit.setAttribute("value", "決定");
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
        if (!this._input.hidden) {
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
        this._input.hidden = false;
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
        this._input.hidden = true;
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
            this._input.setAttribute("maxlength", maxLength);
            this._input.value = this._editWindow.name();
        }

        // 多分これがactivate()本来のメソッド
        this._input.focus();

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
        if (this._input) {
            this._input.remove();
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

        const screen_x = rect.left;
        const screen_y = rect.top;

        const target_x = this._elementPosition.x;
        const target_y = this._elementPosition.y;
        const unit_font_size = $gameSystem.mainFontSize();
        const button_x = this._elementPosition.x;
        const button_y = this._elementPosition.y + this.height + 10;

        this._input.postionAdjust([screen_x,screen_y] , [target_x, target_y], unit_font_size);
        this._submit.postionAdjust([screen_x,screen_y] , [target_x + button_x,target_y + button_y], unit_font_size);
    };

    /**
     * HTML要素でキーが押されたときの処理を行う。
     * 
     * @param {object} e イベントオブジェクト
     */
    Window_NameInput.prototype.onKeyDown = function(e) {
        if (!this._input.hidden) {
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
        if (this._input.value) {
            if (this._editWindow) {
                this._editWindow.setName(this._input.value);
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
        if (this._input) {
            this._input.blur();
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

    


    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();