/*:ja
 * @target MZ 
 * @plugindesc ユーティリティコマンド
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command releaseParty
 * @text パーティー解散
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
 * @command releaseEquipments
 * @text 装備を解除する。プラグイン等で同じetypeIdが複数スロットにある場合、両方解除される。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 対象のアクターID(直接指定)
 * @type actor
 * @default 0
 * 
 * @arg actorVariableId
 * @text アクターID(変数指定)
 * @desc 対象のアクターID(変数指定)
 * @type variable
 * @default 0
 * 
 * @arg etypeId
 * @text 解除する装備タイプ
 * @desc 解除する対象の装備タイプ番号。0で全て解除
 * @type number
 * @default 0
 * 
 * @arg etypeVariableId
 * @text 解除する装備タイプ(変数指定)
 * @desc 解除する対象の装備タイプ番号(変数指定)。
 * @type variable
 * @default 0
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
 * @command playSystemSe
 * @text システム効果音を鳴らす
 * 
 * @arg type
 * @text 種類
 * @desc 効果音の種類
 * @type select
 * @default 1
 * @option カーソル音
 * @value 0
 * @option 決定音
 * @value 1
 * @option キャンセル音
 * @value 2
 * @option ブザー(選択不可音)
 * @value 3
 * @option 装備音(装備変更時の音)
 * @value 4
 * @option セーブ時
 * @value 5
 * @option ロード時
 * @value 6
 * @option 戦闘開始
 * @value 7
 * @option 逃走
 * @value 8
 * @optin 敵の攻撃
 * @value 9
 * @option 敵のダメージ
 * @value 10
 * @option 敵消滅
 * @value 11
 * @option 敵消滅1
 * @value 12
 * @option 敵消滅2
 * @value 13
 * @option アクターダメージ
 * @value 14
 * @option アクター戦闘不能
 * @value 15
 * @option リカバリー
 * @value 16
 * @option ミス
 * @value 17
 * @option 回避
 * @value 18
 * @optin 魔法回避
 * @value 19
 * @option 反射
 * @value 20
 * @option ショップ(購入/売却)
 * @value 21
 * @option アイテム使用
 * @value 22
 * @option スキル使用
 * @value 23
 * 
 * @command showPictureWithActor
 * @text アクターに設定されたピクチャを表示する
 * 
 * @arg pictureId
 * @text ピクチャID
 * @type number
 * @default 1
 * @min 1
 * @max 100
 * 
 * @arg actorId
 * @text アクターID
 * @type actor
 * @default 0
 * 
 * @arg actorVariableId
 * @text アクター(変数指定)
 * @type variable
 * @default 0
 * 
 * @arg pictureMethod
 * @text 画像取得メソッド
 * @desc アクターから画像ファイルパスを取得するプロパティまたはメソッド名
 * @type string
 * @default
 * 
 * @arg origin
 * @text スプライト原点
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 * @default 0
 * 
 * @arg x
 * @text X座標
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * 
 * @arg y
 * @text Y座標
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * 
 * @arg xVariableId
 * @text X座標(変数指定)
 * @type variable
 * @default 0
 * 
 * @arg yVariableId
 * @text Y座標(変数指定)
 * @type variable
 * @default 0
 * 
 * @arg xScale
 * @text x拡大率
 * @type number
 * @min -2000
 * @max 2000
 * @default 100
 * 
 * @arg yScale
 * @text y拡大率
 * @type number
 * @min -2000
 * @max 2000
 * @default 100
 * 
 * @arg alpha
 * @text 透過率
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 * @arg synthesisMethod
 * @text 合成方法
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 乗算
 * @value 2
 * @option スクリーン
 * @value 3
 * @default 0
 * 
 * @command clearSelfSwitches
 * @text セルフスイッチの全クリア
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
 *     ベーシックシステムでは変数指定することができなかったため、追加した。
 * 
 * パーティーから変数で指定したアクターを外す
 *     ベーシックシステムでは変数指定することができなかったため、追加した。
 * 
 * 選択肢を表示して結果を変数に格納する
 *     選択肢を表示して結果を変数に格納する。
 * 
 * システム効果音を鳴らす
 *     データベースで設定した効果音を鳴らす。
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
     * 装備解除
     */
    PluginManager.registerCommand(pluginName, "releaseEquipments", args => {
        const actorVariableId = Number(args.actorVariableId) || 0;
        const actorId = (actorVariableId > 0) 
                ? $gameVariables.value(actorVariableId)
                : (Number(args.actorId) || 0);
        const etypeVariableId = Number(args.etypeVariableId) || 0;
        const etypeId = (etypeVariableId > 0) 
                ? $gameVariables.value(etypeVariableId)
                : (Number(args.etypeId) || 0);

        if ((actorId > 0) && (actorId < $dataActors.length)) {
            const actor = $gameActors.actor(actorId);
            const equips = actor.equips();
            for (let slotId = 0; slotId < equips.length; slotId++) {
                const equip = equips[slotId];
                if (equip  // 装備している？
                        && ((etypeId === 0) || (equip.etypeId === etypeId))) { // 全解除 or 装備タイプ一致
                    actor.changeEquip(slotId, null);
                }
            }
        }

    });

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

    /**
     * システム効果音を鳴らす
     */
    PluginManager.registerCommand(pluginName, "playSystemSe", args => {
        const type = Number(args.type);
        if (type >= 0) {
            SoundManager.playSystemSound(type);
        }

    });

    PluginManager.registerCommand(pluginName, "showPictureWithActor", function(args) {
        //const interpreter = this;

        const pictureId = Number(args.pictureId) || 0;
        const actorVariableId = Number(args.actorVariableId) || 0;
        const actorId = (actorVariableId > 0)
                ? $gameVariables.value(actorVariableId) : Number(args.actorId);
        const pictureMethod = args.pictureMethod || "";
        const origin = Number(args.origin);
        const xVariableId = Number(args.xVariableId) || 0;
        const yVariableId = Number(args.yVariableId) || 0;
        const x = (xVariableId > 0) ? $gameVariables.value(xVariableId) : Number(args.x);
        const y = (yVariableId > 0) ? $gameVariables.value(yVariableId) : Number(args.y);
        const xScale = Number(args.xScale) || 0;
        const yScale = Number(args.yScale) || 0;
        const alpha = (Number(args.alpha) || 0).clamp(0, 255);
        const synthesisMethod = Number(args.synthesisMethod);

        if ((pictureId > 0) && (actorId > 0) && (actorId < $dataActors.length) && pictureMethod) {
            const actor = $gameActors.actor(actorId);
            const pictureName = (typeof actor[pictureMethod] == "function")
                    ? actor[pictureMethod]() : actor[pictureMethod];
            $gameScreen.showPicture(pictureId, pictureName, origin, x, y, xScale, yScale, alpha, synthesisMethod);
        }
    });

    /**
     * 全セルフスイッチクリア
     */
    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "clearSelfSwitches", args => {
        $gameSelfSwitches.clear();
    });


})();