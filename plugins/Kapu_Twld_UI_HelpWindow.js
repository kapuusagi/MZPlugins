/*:ja
 * @target MZ 
 * @plugindesc TwLD向けのヘルプウィンドウ単純拡張
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * ヘルプウィンドウを以下のように拡張します。
 * ・メッセージウィンドウと同様に、アニメーション表示させます。
 * ・メッセージウィンドウでサポートされている、以下のエスケープキャラクタを使用出来ます。
 *   \. 15フレームウェイト
 *   \| 60フレームウェイト
 *   \> 即時表示ON
 *   \< 即時表示OFF
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * なし
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_Twld_UI_HelpWindow";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    //------------------------------------------------------------------------------
    // Window_Help
    const _Window_Help_initialize =  Window_Help.prototype.initialize;
    /**
     * Window_Helpを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_Help.prototype.initialize = function(rect) {
        _Window_Help_initialize.call(this, rect);
    };

    /**
     * メンバを初期化する。
     */
    Window_Help.prototype.initMembers = function() {
        this._text = "";
        this._textState = null;
        this._textState = null;
        this._waitCount = 0;
        this.clearFlags();
    };

    /**
     * フラグをクリアする。
     */
    Window_Help.prototype.clearFlags = function() {
        this._showFast = false;
        this._lineShowFast = false;
        this._pauseSkip = false;
    };

    /**
     * 表示テキストを設定する。
     * 
     * @param {string} text テキスト
     * !!!overwrite!!! Widnow_Help.setText()
     */
    Window_Help.prototype.setText = function(text) {
        if (this._text !== text) {
            this._text = text;
            const textState = this.createTextState(this._text, 0, 0, 0);
            textState.x = this.newLineX(textState);
            textState.startX = textState.x;
            this._textState = textState;
            this.newPage(this._textState);
        }
    };
    /**
     * メッセージ改ページする。
     * 
     * @param {TextState} textState テキストステート
     */
    Window_Help.prototype.newPage = function(textState) {
        this.contents.clear();
        this.resetFontSettings();
        this.clearFlags();
        textState.x = textState.startX;
        textState.y = 0;
        textState.height = this.calcTextHeight(textState);
    };
    /**
     * 新しい行の先頭x位置を得る。
     * 
     * @param {object} textState テキストステート
     * @returns {number} x位置
     */
    Window_Help.prototype.newLineX = function(textState) {
        const margin = 4;
        return textState.rtl ? (this.innerWidth - margin) : margin;
    };

    /**
     * 表示テキストをクリアする。
     * 
     * !!!overwrite!!! Window_Help.clear()
     */
    Window_Help.prototype.clear = function() {
        this.contents.clear();
        this.initMembers();
    };

    const _Window_Help_update = Window_help.prototype.update;
    /**
     * 更新する。
     */
    Window_help.prototype.update = function() {
        _Window_Help_update.call(this);
        while (!this.isOpening() && !this.isClosing()) {
            if (this.updateWait()) {
                return ; // ウェイト継続
            } else {
                this.updateMessage();
                return ;
            }
        }
    };
    /**
     * ウェイト指定が0になるまで待機する。
     * 
     * @returns {number} ウェイト状態の場合にはtrue, それ以外はfalse.
     */
    Window_Help.prototype.updateWait = function() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        } else {
            return false;
        }
    };

    /**
     * メッセージ描画を更新する。
     */
    Window_Help.prototype.updateMessage = function() {
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
            if (this.isEndOfText(textState)) {
                this.onEndOfText();
            }
            return true;
        } else {
            return false;
        }
    };
    /**
     * 表示するべきテキストの末尾まで表示したかどうかを取得する。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} 終端の場合にはtrue, それ以外はfalse
     */
    Window_Help.prototype.isEndOfText = function(textState) {
        return textState.index >= textState.text.length;
    };
    /**
     * 改ページが必要かどうかを得る。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} 改ページが必要な場合にはtrue, それ以外はfalse
     */
    Window_Help.prototype.needsNewPage = function(textState) {
        return (
            !this.isEndOfText(textState) &&
            textState.y + textState.height > this.contents.height
        );
    };

    /**
     * 高速表示する必要があるかどうかを更新する。
     */
    Window_Help.prototype.updateShowFast = function() {
        if (this.isTriggered()) {
            this._showFast = true;
        }
    };

    /**
     * ブレーク可能かどうかを得る。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} ブレーク可能な場合にはtrue, それ以外はfalse
     */
    Window_Help.prototype.shouldBreakHere = function(textState) {
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
    Window_Help.prototype.canBreakHere = function(textState) {
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
    Window_Help.prototype.onEndOfText = function() {
        this._textState = null;
    };
    /**
     * エスケープキャラクタを処理する。
     * 
     * Note: 標準エスケープキャラクタのうち、ウェイトと行を纏めて表示ON/OFFする機能を提供する。
     * 
     * @param {string} code 文字
     * @param {object} textState テキストステート
     */
    Window_Help.prototype.processEscapeCharacter = function(code, textState) {
        switch (code) {
            case ".":
                this.startWait(15);
                break;
            case "|":
                this.startWait(60);
                break;
            case ">":
                this._lineShowFast = true;
                break;
            case "<":
                this._lineShowFast = false;
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
     * ウェイト処理を開始する。
     * 
     * @param {number} count ウェイトフレーム数
     */
    Window_Help.prototype.startWait = function(count) {
        this._waitCount = count;
    };
    /**
     * リフレッシュする。
     */
     Window_Help.prototype.refresh = function() {
        const rect = this.baseTextRect();
        this.drawTextEx(this._text, rect.x, rect.y, rect.width);
    };
})();