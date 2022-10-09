/*:ja
 * @target MZ 
 * @plugindesc ユーティリティコマンド
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command releaseParty
 * @text パーティー解散
 * 
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
 * @command choice
 * @text 選択肢を表示して結果を変数に格納する
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 選択肢の選択結果を格納する変数
 * @type variable
 * @default 0
 * 
 * @arg defaultIndex
 * @text デフォルト選択の番号
 * @type number
 * @default 0
 * @min -1
 * 
 * 
 * @arg cancelIndex
 * @text キャンセル選択の番号
 * @type number
 * @default -1
 * @min -1
 * 
 * @arg cancelable
 * @text キャンセル可能かどうか
 * @desc キャンセル操作を可能にする場合にはtrue, 禁止する場合にはfalse.
 * @type boolean
 * @default true
 * 
 * @arg position
 * @text 位置
 * @type select
 * @default 0
 * @option 左
 * @value 0
 * @option 中央
 * @value 1
 * @option 右
 * @value 2
 * 
 * @arg background
 * @text 背景
 * @default 0
 * @option 通常
 * @value 0
 * @option 枠なし
 * @value 1
 * @option 透過
 * @value 2
 * 
 * @arg selectableItems
 * @text 選択可能アイテム
 * @desc 選択肢の選択可能アイテムを格納する変数
 * @type struct<ChoiceItem>[]
 * @default []
 * 
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
 * 選択肢を表示して結果を変数に格納する
 *     選択肢を表示して結果を変数に格納する
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
/*~struct~ChoiceItem:
 *
 * @param name
 * @text 選択肢名
 * @type string
 * @default
 * 
 * @param value
 * @text 値
 * @desc この選択肢が選択された時に、変数に格納する値
 * @type number
 * @default -1
 * @min -1
 * 
 * @param eval
 * @text 条件
 * @desc この選択肢を候補にだすかどうかの条件。evalで式にする。空にすると常に選択肢に入る。
 * @type string
 * @default
 */
(() => {
    'use strict';
    const pluginName = "Kapu_UtilityCommands";
    //const parameters = PluginManager.parameters(pluginName);

    /**
     * パーティー解散
     */
    // Note: 匿名関数だと this に Game_Interpreter が渡らないことに注意。
    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "releaseParty", function(arg) {
        while ($gameParty.members().length > 0) {
            const actorId = $gameParty.members()[0].actorId();
            $gameParty.removeActor(actorId);
        }
    });

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

    const _evalCondition = function(evalStr) {
        try {
            if (evalStr) {
                return eval(evalStr) ? true : false;
            } else {
                return true;
            }
        }
        catch (e) {
            console.error("eval failure eval=" + evalStr + ":" + e);
        }

        return true;
    };

    /**
     * 選択肢を表示して結果を変数に格納する
     */
    // Note: 匿名関数だと this に Game_Interpreter が渡らないことに注意。
    PluginManager.registerCommand(pluginName, "choice", function(args) {
        const interpreter = this;
        const variableId = Number(args.variableId || 0);
        const defaultIndex = Math.floor(Number(args.defaultIndex) || -1);
        const cancelIndex = Math.floor(Number(args.cancelIndex || -1));
        const cancelable = (typeof args.cancelable == "undefined") ? true : (args.cancelable == "true");
        const position = Number(args.position) || 0;
        const background = Number(args.background) || 0;
        const selectableItems = [];
        try {
            for (const token of JSON.parse(args.selectableItems)) {
                if (token) {
                    var obj = JSON.parse(token);
                    if (_evalCondition(obj.eval)) {
                        selectableItems.push({
                            name: obj.name,
                            value: Number(obj.value),
                        });
                    }
                }
            }
        }
        catch (e) {
            console.error(e);
        }

        if (variableId > 0) { // 格納先変数は指定されている？
            if (selectableItems.length > 0) {
                const choices = selectableItems.map(item => item.name);
                const defaultType = ((defaultIndex >= 0) && (defaultIndex < selectableItems.length))
                    ? defaultIndex : 0;
                const cancelType = cancelable
                    ? (((cancelIndex >= 0) && (cancelIndex < selectableItems.length)) ? cancelIndex : -2)
                    : -1; 
                $gameMessage.setChoices(choices, defaultType, cancelType);
                $gameMessage.setChoiceBackground(background);
                $gameMessage.setChoicePositionType(position);
                $gameMessage.setChoiceCallback(n => {
                    if ((n >= 0) && (n < selectableItems.length)) {
                        $gameVariables.setValue(variableId, selectableItems[n].value);
                    } else {
                        $gameVariables.setValue(variableId, cancelIndex);
                    }
                });
                interpreter.setWaitMode("message");
            } else {
                $gameVariables.setValue(variableId, defaultIndex);
            }
        }
    });


})();