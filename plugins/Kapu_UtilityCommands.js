/*:ja
 * @target MZ 
 * @plugindesc ユーティリティコマンド
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command addActorByVariable
 * @text パーティーに変数で指定したアクターを追加
 * 
 * @arg variableId
 * @text 変数ID
 * @type variable
 * @default 0
 * 
 * @arg isInitialize
 * @text 初期化する
 * @desc 装備やステータスを初期化する場合にはtrue, 初期化しない場合にはfalse.
 * @type boolean
 * @default false
 * 
 * @command removeActorByVariable
 * @text パーティーから変数で指定したアクターを外す
 * 
 * @arg variableId
 * @text 変数ID
 * @type variable
 * @default 0
 * 
 * 
 * 
 * @help 
 * 標準のコマンドだけだとちょっとアレができない、というのをカバーする。
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * 特になし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * パーティーに変数で指定したアクターを追加
 * 
 * パーティーから変数で指定したアクターを外す
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * なし。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    'use strict';
    const pluginName = "Kapu_UtilityCommands";
    const parameters = PluginManager.parameters(pluginName);

    /**
     * パーティーに変数で指定したアクターを追加
     */
    // Note: 匿名関数だと this に Game_Interpreter が渡らないことに注意。
    PluginManager.registerCommand(pluginName, "addActorByVariable", function(args) {
        const interpreter = this;
        const variableId = Number(args.variableId || 0);
        const isInitialize = (typeof args.isInitialize == "undefined") ? 0 : (args.isInitialize == "true");
        if (variableId > 0) {
            const actorId = $gameVariables.value(variableId);
            if ((actorId > 0) && (actorId < $dataActors.length)) {
                const params = [ actorId, 0, isInitialize ];
                interpreter.command129(params);
            }
        }
    });

    /**
     * パーティーから変数で指定したアクターを外す
     */
    // Note: 匿名関数だと this に Game_Interpreter が渡らないことに注意。
    PluginManager.registerCommand(pluginName, "removeActorByVariable", function(args) {
        const interpreter = this;
        const variableId = Number(args.variableId || 0);
        if (variableId > 0) {
            const actorId = $gameVariables.value(variableId);
            if ((actorId > 0) && (actorId < $dataActors.length)) {
                const params = [ actorId, 1, 0 ];
                interpreter.command129(params);
            }
        }
    });


})();