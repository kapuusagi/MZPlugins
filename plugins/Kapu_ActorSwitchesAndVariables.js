/*:ja
 * @target MZ 
 * @plugindesc アクターデータ毎にスイッチとフラグを追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * アクター毎に
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
    // const pluginName = "Kapu_ActorSwitchesAndVariables";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this.clearSwitches();
        this.clearVariables();
    };

    /**
     * スイッチをクリアする。
     */
    Game_Actor.prototype.clearSwitches = function() {
        this._switches = {};
    };

    /**
     * スイッチの値を設定する。
     * 
     * @param {string} idStr ID文字列
     * @param {boolean} value 値
     */
    Game_Actor.prototype.setSwitch = function(idStr, value) {
        this._switches[String(idStr)] = value ? true : false;
    };

    /**
     * スイッチの値を得る。
     * 
     * @param {string} idStr ID文字列
     * @returns {boolean} スイッチの値
     */
    Game_Actor.prototype.switch = function(idStr) {
        return !!this._switches[String(idStr)];
    };

    /**
     * 変数をクリアする。
     */
    Game_Actor.prototype.clearVariables = function() {
        this._variables = {};
    };

    /**
     * 変数の値を設定する。
     * 
     * @param {string} idStr ID文字列
     * @param {number} value アクター変数値
     */
    Game_Actor.prototype.setVariable = function(idStr, value) {
        this._variables[String(idStr)] = Math.floor(Number(value) || 0);
    };

    /**
     * アクター変数値を得る。
     * 
     * @param {string} idStr ID文字列
     * @returns {number} アクター変数値
     */
    Game_Actor.prototype.variable = function(idStr) {
        return this._variables[String(idStr)] || 0;
    };

    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張
    
    
})();