/*:ja
 * @target MZ 
 * @plugindesc エスケープキャラクタ拡張
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * エスケープキャラクタに以下のものを追加します。
 * 
 * \ClassName [id#] - id#のクラス名に置換します。
 * \EVAL[formula$] - formula$を評価した結果に置換します。例) $gameVariables.value(1)|
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
(() => {
    'use strict';
    // const pluginName = "Kapu_EscapeCharacterExtends";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // TextManager
    TextManager.className = function(id) {
        if ((id > 0) && (id < $dataClasses.length)) {
            return $dataClasses[id].name;
        } else {
            return "";
        }
    };

    //------------------------------------------------------------------------------
    // Window_Base
    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    /**
     * エスケープキャラクタを処理する。
     * 
     * @param {string} code エスケープキャラクタ
     * @param {TextState} textState テキストステートオブジェクト
     */
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        switch (code) {
            default:
                _Window_Base_processEscapeCharacter.call(this, code, textState);
                break;
        }
    };

    /**
     * argを評価した結果の文字列を返す。
     * 
     * @param {string} arg パラメータとして検出した文字列
     * @returns 
     */
    const _evalString = function(arg) {
        try {
            return String(eval(arg)) || "";
        }
        catch (e) {
            console.error("eval(" + arg + ") failure. :" + e);
        }
        return "";
    };

    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    /**
     * エスケープキャラクタを変換する。
     * 
     * @param {string} text テキスト
     * @returns {string} 置換済みテキスト
     */
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        // \Vや\Nなどの処理
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        // eslint-disable-next-line no-control-regex
        text = text.replace(/\x1bClassName\[(\d+)\]/gi, (_, p1) =>
            TextManager.className(parseInt(p1))
        );
        // eslint-disable-next-line no-control-regex
        text = text.replace(/\x1bEVAL\[([^\]]+)\]/gi, (_, p1) =>
            _evalString(p1)
        );
        
        return text;
    };




})();