/*:ja
 * @target MZ 
 * @plugindesc シンプルなメッセージウィンドウを提供する
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * シンプルなメッセージウィンドウを提供する。
 * 本プラグイン単独では意味が無い。
 * 
 * ベーシックシステムで提供されるWindow_SimpleMessageは非常に高機能であるが、
 * マップイベントなどで使用するため、使用する側で大量のウィンドウを作成する必要がある。
 * もしくはScene_MenuBaseではなく、Scene_MessageBaseを派生させることになる。
 * 
 * $gameMessage.add(text:string)で文字を追加すれば、
 * うまいこと表示してくれるよ、なウィンドウ。
 * 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */

/**
 * 単純なメッセージウィンドウを提供するクラス。
 */
function Window_SimpleMessage() {
    this.initialize(...arguments);
}


(() => {
    // const pluginName = "Kapu_UI_Window_SimpleMessage";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });


    //------------------------------------------------------------------------------
    // Window_SimpleMessage
    Window_SimpleMessage.prototype = Object.create(Window_Base.prototype);
    Window_SimpleMessage.prototype.constructor = Window_SimpleMessage;
    
    /**
     * Window_SimpleMessageを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_SimpleMessage.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.initMembers();
    };
    /**
     * Window_SimpleMessageのメンバを初期化する。
     */
    Window_SimpleMessage.prototype.initMembers = function() {
        this._background = 0;
        this._positionType = 2;
        this._waitCount = 0;
        this._textState = null;
        this.clearFlags();
    };

    
    /**
     * フラグをクリアする。
     */
    Window_SimpleMessage.prototype.clearFlags = function() {
        this._showFast = false;
        this._lineShowFast = false;
        this._pauseSkip = false;
    };
    
    /**
     * メッセージウィンドウを更新する。
     */
    Window_SimpleMessage.prototype.update = function() {
        this.checkToNotClose();
        Window_Base.prototype.update.call(this);
        while (!this.isOpening() && !this.isClosing()) {
            if (this.updateWait()) {
                return;
            } else if (this.updateInput()) {
                return;
            } else if (this.updateMessage()) {
                return;
            } else if (this.canStart()) {
                this.startMessage();
            } else {
                return;
            }
        }
    };
    
    /**
     * 閉じるべきでないかどうかを調べ、処理する。
     */
    Window_SimpleMessage.prototype.checkToNotClose = function() {
        if (this.isOpen() && this.isClosing() && this.doesContinue()) {
            this.open();
        }
    };
    
    /**
     * メッセージ表示が可能かどうかを取得する。
     * @return {boolean} メッセージ表示が可能な場合にはtrue, それ以外はfalse
     */
    Window_SimpleMessage.prototype.canStart = function() {
        return $gameMessage.hasText() && !$gameMessage.scrollMode();
    };
    
    /**
     * メッセージ表示を開始する。
     */
    Window_SimpleMessage.prototype.startMessage = function() {
        const text = $gameMessage.allText();
        const textState = this.createTextState(text, 0, 0, 0);
        textState.x = this.newLineX(textState);
        textState.startX = textState.x;
        this._textState = textState;
        this.newPage(this._textState);
        this.open();
        this._nameBoxWindow.start();
    };
    /**
     * 新しい行の先頭x位置を得る。
     * 
     * @param {object} textState テキストステート
     * @returns {number} x位置
     */
    Window_SimpleMessage.prototype.newLineX = function(textState) {
        const faceExists = $gameMessage.faceName() !== "";
        const faceWidth = ImageManager.faceWidth;
        const spacing = 20;
        const margin = faceExists ? faceWidth + spacing : 4;
        return textState.rtl ? this.innerWidth - margin : margin;
    };
    
    /**
     * メッセージ表示を終了する。
     */
    Window_SimpleMessage.prototype.terminateMessage = function() {
        this.close();
        $gameMessage.clear();
    };
    
    /**
     * ウェイト指定が0になるまで待機する。
     * 
     * @returns {number} ウェイト状態の場合にはtrue, それ以外はfalse.
     */
    Window_SimpleMessage.prototype.updateWait = function() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        } else {
            return false;
        }
    };
    
    
    /**
     * 入力を更新する。
     */
    Window_SimpleMessage.prototype.updateInput = function() {
        if (this.pause) {
            if (this.isTriggered()) {
                Input.update();
                this.pause = false;
                if (!this._textState) {
                    this.terminateMessage();
                }
            }
            return true;
        }
        return false;
    };
    
    /**
     * メッセージ描画を更新する。
     * 
     * @returns {boolean} メッセージ描画状態を継続する場合にはtrue, それ以外はfalse
     */
    Window_SimpleMessage.prototype.updateMessage = function() {
        const textState = this._textState;
        if (textState) {
            while (!this.isEndOfText(textState)) {
                if (this.needsNewPage(textState)) {
                    this.newPage(textState);
                }
                this.updateShowFast();
                this.processCharacter(textState);
                if (this.shouldBreakHere(textState)) {
                    break;
                }
            }
            this.flushTextState(textState);
            if (this.isEndOfText(textState) && !this.pause) {
                this.onEndOfText();
            }
            return true;
        } else {
            return false;
        }
    };
    
    /**
     * ブレーク可能かどうかを得る。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} ブレーク可能な場合にはtrue, それ以外はfalse
     */
    Window_SimpleMessage.prototype.shouldBreakHere = function(textState) {
        if (this.canBreakHere(textState)) {
            if (!this._showFast && !this._lineShowFast) {
                return true;
            }
            if (this.pause || this._waitCount > 0) {
                return true;
            }
        }
        return false;
    };
    
    /**
     * ブレーク可能な位置かどうかを得る。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} ブレーク可能な位置の場合にはtrue, それ以外はfalse
     */
    Window_SimpleMessage.prototype.canBreakHere = function(textState) {
        if (!this.isEndOfText(textState)) {
            const c = textState.text[textState.index];
            if (c.charCodeAt(0) >= 0xdc00 && c.charCodeAt(0) <= 0xdfff) {
                // surrogate pair
                return false;
            }
            if (textState.rtl && c.charCodeAt(0) > 0x20) {
                return false;
            }
        }
        return true;
    };
    
    /**
     * テキスト表示が終了したときの処理を行う。
     */
    Window_SimpleMessage.prototype.onEndOfText = function() {
        if (!this.startInput()) {
            if (!this._pauseSkip) {
                this.startPause();
            } else {
                this.terminateMessage();
            }
        }
        this._textState = null;
    };

    /**
     * 何かしらの入力操作を受け付けたかどうかを得る。
     * 
     * @returns {boolean} 入力操作を受け付けた場合にはtrue, それ以外はfalse.
     */    
    Window_SimpleMessage.prototype.isTriggered = function() {
        return (
            Input.isRepeated("ok") ||
            Input.isRepeated("cancel") ||
            TouchInput.isRepeated()
        );
    };
    /**
     * 継続して表示するかどうかを得る。
     * 
     * @returns {boolean} 継続して表示する場合にはtrue, それ以外はfalse.
     */
    Window_SimpleMessage.prototype.doesContinue = function() {
        return (
            $gameMessage.hasText() &&
            !$gameMessage.scrollMode()
        );
    };
    
    /**
     * 高速表示する必要があるかどうかを更新する。
     */
    Window_SimpleMessage.prototype.updateShowFast = function() {
        if (this.isTriggered()) {
            this._showFast = true;
        }
    };
    
    /**
     * メッセージ改ページする。
     * 
     * @param {TextState} textState テキストステート
     */
    Window_SimpleMessage.prototype.newPage = function(textState) {
        this.contents.clear();
        this.resetFontSettings();
        this.clearFlags();
        textState.x = textState.startX;
        textState.y = 0;
        textState.height = this.calcTextHeight(textState);
    };
    
    /**
     * 制御文字を処理する。
     * 
     * @param {object} textState TextStateオブジェクト
     * @param {string} c 制御文字
     */    
    Window_SimpleMessage.prototype.processControlCharacter = function(textState, c) {
        Window_Base.prototype.processControlCharacter.call(this, textState, c);
        if (c === "\f") {
            this.processNewPage(textState);
        }
    };
    
    /**
     * 改行を処理する。
     * 
     * @param {TextState} textState テキストステート
     */
    Window_SimpleMessage.prototype.processNewLine = function(textState) {
        this._lineShowFast = false;
        Window_Base.prototype.processNewLine.call(this, textState);
        if (this.needsNewPage(textState)) {
            this.startPause();
        }
    };
    
    /**
     * 改ページ処理する。
     * 
     * @param {object} textState TextStateオブジェクト
     */
    Window_SimpleMessage.prototype.processNewPage = function(textState) {
        if (textState.text[textState.index] === "\n") {
            textState.index++;
        }
        textState.y = this.contents.height;
        this.startPause();
    };
    
    /**
     * 表示するべきテキストの末尾まで表示したかどうかを取得する。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} 終端の場合にはtrue, それ以外はfalse
     */
    Window_SimpleMessage.prototype.isEndOfText = function(textState) {
        return textState.index >= textState.text.length;
    };
    
    /**
     * 改ページが必要かどうかを得る。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} 改ページが必要な場合にはtrue, それ以外はfalse
     */
    Window_SimpleMessage.prototype.needsNewPage = function(textState) {
        return (
            !this.isEndOfText(textState) &&
            textState.y + textState.height > this.contents.height
        );
    };
    /**
     * エスケープキャラクタを処理する。
     * 
     * Note: 以下のエスケープキャラクタはサポートしない。
     *       $ ： ゴールドウィンドウ表示
     * 
     * @param {string} code コード
     * @param {object} textState TextStateオブジェクト
     */    
    Window_SimpleMessage.prototype.processEscapeCharacter = function(code, textState) {
        switch (code) {
            case ".":
                this.startWait(15);
                break;
            case "|":
                this.startWait(60);
                break;
            case "!":
                this.startPause();
                break;
            case ">":
                this._lineShowFast = true;
                break;
            case "<":
                this._lineShowFast = false;
                break;
            case "^":
                this._pauseSkip = true;
                break;
            default:
                Window_Base.prototype.processEscapeCharacter.call(
                    this,
                    code,
                    textState
                );
                break;
        }
    };
    /**
     * ウェイトを開始する。
     * 
     * @param {number} count 待機フレーム数
     */
    Window_SimpleMessage.prototype.startWait = function(count) {
        this._waitCount = count;
    };
    /**
     * PAUSEを開始する。
     */    
    Window_SimpleMessage.prototype.startPause = function() {
        this.startWait(10);
        this.pause = true;
    };
    

})();