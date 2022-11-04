/*:ja
 * @target MZ 
 * @plugindesc FS向けカスタマイズ
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_DisplayLevelChange
 * @orderAfter Kapu_Base_DisplayLevelChange
 * @base Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Base_DamageCalculation
 * @base Kapu_FriendlyPoint
 * @orderAfter Kapu_FriendlyPoint
 * @base Kapu_ChoiceActor
 * @orderAfter Kapu_ChoiceActor
 * 
 * @command gainFriendlyPoint
 * @text 友好度増減
 * @desc 指定アクターの単純に友好度を増減する。
 * 
 * @arg actorId
 * @text アクター
 * @desc 対象のアクター。未指定時はパーティーメンバー全員の友好度を上げる。
 * @type actor
 * @default 0
 * 
 * @arg value
 * @text 値
 * @desc 値
 * @type number
 * @default 0
 * @min -10000
 * @max 10000
 * 
 * @arg variableId
 * @text 値変数ID(変数で指定する場合)
 * @desc 値変数ID(変数で指定する場合)。変数指定が優先される。
 * @type variable
 * @default 0
 * 
 * 
 * @command gainFriendlyPointWithoutActor
 * @text 指定アクター以外の友好度を増減
 * @desc 指定アクターの友好度を上げ、それ以外にデータの存在するアクターの友好度を下げる。
 * 
 * @arg actorId
 * @text アクター
 * @desc 対象のアクター
 * @type actor
 * @default 0
 * 
 * @arg value
 * @text 値
 * @desc 値
 * @type number
 * @default 0
 * @min -10000
 * @max 10000
 * 
 * @arg variableId
 * @text 値変数ID(変数で指定する場合)
 * @desc 値変数ID(変数で指定する場合)。変数指定が優先される。
 * @type variable
 * @default 0
 * 
 * 
 * @command gainFriendlyPointAll
 * @text 全友好度増減
 * @desc 存在するアクターの友好度を増減する。
 * 
 * @arg value
 * @text 値
 * @desc 値
 * @type number
 * @default 0
 * @min -10000
 * @max 10000
 * 
 * @arg variableId
 * @text 値変数ID(変数で指定する場合)
 * @desc 値変数ID(変数で指定する場合)。変数指定が優先される。
 * @type variable
 * @default 0
 * 
 * @command changeMainActor
 * @text 主人公変更
 * @desc 友好度上昇・下降の対象になるメインアクターIDを変更します。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 主人公に割り当てるアクターID
 * @type actor
 * @default 1
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 主人公に割り当てるアクターを指定する変数ID。変数指定が優先される。
 * @type variable
 * @default 0
 * 
 * 
 * 
 * 
 * 
 * @param effectCode
 * @text 友好度加減エフェクトコード
 * @desc 友好度を加減する効果を割り当てるエフェクトコード。
 * @type number
 * @default 1004
 * @min 4
 * 
 * @param friendlyPointTpRate
 * @text 友好度TP変換レート
 * @desc 初期TP値の算出に使用する、友好度からTPへ変換するレート。友好度にこの値が乗算される。0.1だと友好度10毎に1上がる。
 * @type number
 * @decimals 3
 * @default 0.025
 * 
 * @param gainFriendlyPointRateOnBattleWin
 * @text 戦闘勝利時友好度が上昇する確率
 * @desc 戦闘に勝利した際、友好度が上昇する確率。ここで指定した確率で戦闘勝利時上昇友好度だけ上昇する。
 * @type number
 * @decimals 2
 * @min 0.00
 * @max 100.00
 * @default 100.00
 * 
 * @param gainFriendlyPointOnBattleWin
 * @text 戦闘勝利時上昇友好度
 * @desc 戦闘に勝利した際、上昇させる友好度
 * @type number
 * @default 1
 * 
 * @param displayFriendlyPoint
 * @text 友好度表示
 * 
 * @param displayFriendlyPointValue
 * @text 友好度値表示する
 * @desc trueにすると、実際の友好度数値を表示する。
 * @type boolean
 * @default true
 * @parent displayFriendlyPoint
 * 
 * @param displayFriendlyPointMin
 * @text 表示友好度下限
 * @type number
 * @default -100
 * @min -100000
 * @max 100000
 * @parent displayFriendlyPoint
 *  
 * 
 * @param displayFriendlyPointMax
 * @text 表示友好度上限
 * @type number
 * @default 100
 * @min -100000
 * @max 100000
 * @parent displayFriendlyPoint
 * 
 * @param displayFriendlyPointIconTable
 * @text アイコンテーブル
 * @desc 友好度を表示するアイコンテーブル。(0番のインデックスがデフォルト友好度時のもの、最大のインデックスが表示最大友好度のもの。中央が標準)
 * @type number[]
 * @default []
 * @parent displayFriendlyPoint
 * 
 * @param displayNegativeFriendlyPointIconTable
 * @text ネガティブアイコンテーブル
 * @desc 友好度を表示するアイコンテーブル。(0番目のインデックスが表示最低友好度のもの、最大のインデックスがデフォルト以下のもの)
 * @type number[]
 * @default []
 * @parent displayFriendlyPoint
 * 
 * @param defaultMainActorId
 * @text メインアクターID
 * @desc 友好度のデフォルトターゲット(主人公)として扱うアクターID
 * @type actor
 * @default 1
 * 
 * @param friendlyPointDamageCorrectionTable
 * @text 友好度によるダメージ補正テーブル
 * @type struct<CorrectEntry>[]
 * @default []
 * 
 * @param friendlyPointCriticalCorrectionTable
 * @text 友好度によるクリティカル率補正テーブル
 * @type struct<CorrectEntry>[]
 * @default []
 * 
 * @param friendlyPointStringTable
 * @text 友好度を文字列置換したときのテキスト
 * @type struct<FriendlyPointStringEntry>[]
 * @default []
 * 
 * @param applyCharacterGradiation
 * @text 文字にグラディエーションをかける
 * @desc 文字にグラディエーションをかけます。但し非常に重くなります。
 * @type boolean
 * @default false
 * 
 * @help 
 * FS向けの変更
 *     大前提として、No.1番のアクターは主人公で固定。
 * 
 * ・メイン主人公としてのアクターを割り当て。
 *   他のアクターはメイン主人公に対する友好度操作用コマンドを追加。
 *   $gameSystem.mainActorId()で参照できる。
 * ・レベルアップ時はランダムに上昇
 * ・クラスチェンジ時はステータス半減
 * ・友好度補正
 *   1番のアクター：パーティーメンバーとの友好度で一番高いものを採用
 *   それ以外： 1番のアクターとの友好度を採用
 *   補正
 *     友好度が高いほど初期TP増加
 *     友好度が高いほどダメージ増加
 *     友好度が低いとダメージ低下(最低時-1)
 * ・友好度状態を取得するエスケープシーケンスを追加。
 *     /FPSTR[id#] id#のアクターの友好度を表す文字列を返す。
 *     /FPICON[id#] id#のアクターの友好度を表すアイコンを描画。
 * ・習得したスキルに対応するスキルタイプは全部使用可能にする。
 * 
 * ■ 使用時の注意
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 友好度増減
 *   指定アクターの友好度を加減する。
 * 
 * 指定アクター以外の友好度を増減
 *   指定アクターを除いた、アクターの友好度を加減する。
 *   
 * 全友好度増減
 *   全アクターの友好度を加減する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム
 *   <gainFp:type#,value#>
 *      友好度上昇効果を持つアイテムとして定義する。
 *      typeが種類、valueが上昇量。
 * 
 * アクター
 *   <gainFriendlyPointRates:type=rate#,type=rate#,type=rate#,...>
 *      type# に対応する上昇レートテーブルを指定する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 動作確認
 */
/*~struct~CorrectEntry:
 *
 * @param friendlyPoint
 * @text 友好度
 * @type number
 * @min -10000
 * @max 10000
 * @default 0
 * 
 * @param correctRate
 * @text 補正量。
 * @desc 補正量。友好度の時に適用する補正値[%]。100が等倍加算。
 * @type number
 * @default 0.00
 * @min -100.00
 * @max 10000.00
 * @decimals 2
 *
 */
/*~struct~FriendlyPointStringEntry:
 *
 * @param friendlyPoint
 * @text 友好度下限値
 * @desc この文字列表現を採用する、友好度の下限。
 * @type number
 * @min -10000
 * @max 10000
 * @default 0
 * 
 * @param fpString
 * @text 友好度表現
 * @desc 友好度を表す文字列。
 * @type string
 * @default 普通
 */
(() => {
    'use strict';
    const pluginName = "Kapu_FS_BaseSystem";
    const parameters = PluginManager.parameters(pluginName);

    Game_Action.EFFECT_GAIN_FP = Number(parameters["effectCode"]) || 0;
    const friendlyPointTpRate = Math.abs(Number(parameters["friendlyPointTpRate"] || 0.0));
    const gainFriendlyPointRateOnBattleWin = (Number(parameters["gainFriendlyPointRateOnBattleWin"] || 0) || 0) / 100.0;
    const gainFriendlyPointOnBattleWin = Math.floor(Number(parameters["gainFriendlyPointOnBattleWin"] || 0));

    const displayFriendlyPointMin = Number(parameters["displayFriendlyPointMin"] || 0).clamp(
        Game_Actor.FRIENDLY_POINT_MIN, Game_Actor.FRIENDLY_POINT_DEFAULT);
    const displayFriendlyPointMax = Number(parameters["displayFriendlyPointMax"] || 0).clamp(
        Game_Actor.FRIENDLY_POINT_DEFAULT, Game_Actor.FRIENDLY_POINT_MAX);
    const defaultMainActorId = Math.floor(Number(parameters["defaultMainActorId"]) || 0);

    const displayFriendlyPointValue = (typeof parameters["displayFriendlyPointValue"] == "undefined")
            ? true : (parameters["displayFriendlyPointValue"] == "true");

    const applyCharacterGradiation = (typeof parameters["applyCharacterGradiation"] == "undefined")
            ? false : (parameters["applyCharacterGradiation"] == "true");

    /**
     * paramを解析して、アイコン番号テーブルを得る。
     * 
     * @param {string} param パラメータ
     * @returns {Array<number>} アイコンインデックス配列
     */
    const _parseFriendlyIconTable = function(param) {
        try {
            if (param) {
                return JSON.parse(param || "[]").map((token) => Number(token || 0) || 0);
            }
        }
        catch (e) {
            console.error("Parse displayFriendlyPointIconTable failure:" + e);
        }

        return [];
    };

    const displayFriendlyPointIconTable = _parseFriendlyIconTable(parameters["displayFriendlyPointIconTable"]);
    const displayNegativeFriendlyPointIconTable = _parseFriendlyIconTable(parameters["displayNegativeFriendlyPointIconTable"]);
    /**
     * 有効度に対応したアイコンIDを得る。
     * 
     * @param {number} fp 有効度
     * @returns {number} アイコンID
     */
    const _getFriendlyPointIconId = function(fp) {
        // デフォルトより上か？
        const iconTable = (fp >= Game_Actor.FRIENDLY_POINT_DEFAULT)
            ? displayFriendlyPointIconTable : displayNegativeFriendlyPointIconTable;
        const range = (fp >= Game_Actor.FRIENDLY_POINT_DEFAULT)
            ? displayFriendlyPointMax - Game_Actor.FRIENDLY_POINT_DEFAULT
            : Game_Actor.FRIENDLY_POINT_DEFAULT - displayFriendlyPointMin;
        const gaugeValue = (fp >= Game_Actor.FRIENDLY_POINT_DEFAULT)
            ? (fp - Game_Actor.FRIENDLY_POINT_DEFAULT)
            : (fp - displayFriendlyPointMin);
        const limitIconIndex = (fp >= Game_Actor.FRIENDLY_POINT_DEFAULT)
            ? (iconTable.length - 1) : 0;
        const isOverRange = (fp >= Game_Actor.FRIENDLY_POINT_DEFAULT)
            ? (fp >= displayFriendlyPointMax) : (fp < displayFriendlyPointMin);

        if (iconTable.length == 0) { // 表示アイコンテーブルなし？
            return 0;
        } else {
            if (range == 0) { // 表示範囲なし？
                return iconTable[0];
            } else {
                if (isOverRange) {
                    return iconTable[limitIconIndex];
                } else {
                    const position = gaugeValue / range;
                    const iconIndex = Math.round((iconTable.length - 1) * position);
                    return iconTable[iconIndex];
                }
            }
        }
    };

    /**
     * テーブルに補正値エントリを追加する。
     * 
     * @param {Array<CorrectEntry>} table 
     * @param {object} entry エントリー
     */
    const _addFpEntry = function(table, entry) {
        for (let i = 0; i < table.length; i++) {
            if (entry.friendlyPoint < table[i].friendlyPoint) {
                table.splice(i, 0, entry);
                return ;
            }
        }

        table.push(entry);
    };
    /**
     * 補正値パラメータテーブル文字列を解釈する。
     * 
     * @param {string} arg 補正値テーブルパラメータ文字列
     * @returns {Array<CorrectEntry} テーブル
     */
    const _parseCorrentEntries = function(arg) {
        const table = [];
        try {
            if (arg) {
                for (const token of JSON.parse(arg)) {
                    const obj = JSON.parse(token);
                    const fp = Number(obj.friendlyPoint) || 0;
                    const rate = (Number(obj.correctRate) || 0.00) / 100.0;
                    const entry = {
                        friendlyPoint : fp,
                        correctRate : rate
                    };
                    _addFpEntry(table, entry);
                }
            }
        }
        catch (e) {
            console.error("_parseCorrectEntries failure:" + e);
        }
        return table;
    };

    /**
     * 補正値を得る。
     * 
     * @param {Array<CorrectEntry>} table 補正値テーブル
     * @param {number} fp 友好度
     * @returns {number} 補正値
     */
    const _getCorrectRate = function(table, fp) {
        if (table.length === 0) {
            return 0.0;
        }

        let i = table.length - 1;
        while ((i >= 0) && (fp < table[i].friendlyPoint)) {
            i--;
        }
        const prevIndex = i;
        const nextIndex = i + 1;

        const prevEntry = table[prevIndex];
        const nextEntry = table[nextIndex];

        if (prevEntry) {
            if (nextEntry) {
                const prevFp = prevEntry.friendlyPoint
                const range = nextEntry.friendlyPoint - prevFp;
                const rateRange = nextEntry.correctRate - prevEntry.correctRate;
                if (range > 0) {
                    return prevEntry.correctRate + (fp - prevFp) / range * rateRange;
                } else {
                    return prevEntry.correctRate;
                }
            } else {
                return prevEntry.correctRate;
            }
        } else {
            if (nextEntry) {
                return nextEntry.correctRate;
            } else {
                return 0;
            }
        }
    };

    const friendlyPointDamageCorrectionTable = _parseCorrentEntries(parameters["friendlyPointDamageCorrectionTable"]);
    const friendlyPointCriticalCorrectionTable = _parseCorrentEntries(parameters["friendlyPointCriticalCorrectionTable"]);

    /**
     * 友好度文字列テーブルを得る。
     * 
     * @param {string} paramStr パラメータ文字列
     * @returns {Array<FriendlyPointStringEntry>} 友好度文字列テーブル
     */
    const _parseFriendlyPointStringTable = function(paramStr) {
        const table = [];
        try {
            if (paramStr) {
                const tokens = JSON.parse(paramStr);
                for (const token of tokens) {
                    const obj = JSON.parse(token);
                    const fp = Number(obj.friendlyPoint);
                    const text = obj.fpString;
                    const entry = {
                        friendlyPoint: fp,
                        fpString: text
                    };
                    _addFpEntry(table, entry);
                }
            }
        }
        catch (e) {
            console.error("_parseFriendlyPointStringTable failure : " + e);
        }
        return table;
    };

    const friendlyPointStringTable = _parseFriendlyPointStringTable(parameters["friendlyPointStringTable"]);

    /**
     * 友好度上昇
     */
    PluginManager.registerCommand(pluginName, "gainFriendlyPoint", args => {
        const actorId = Number(args.actorId);
        const variableId = Math.floor(Number(args.variableId) || 0);
        const value = (variableId > 0) ? $gameVariables.value(variableId) : Math.floor(Number(args.value));
        if ((actorId > 0) && (actorId !== $gameSystem.mainActorId()) 
                && $gameActors.isActorDataExists(actorId) && (value != 0)) {
            const actor = $gameActors.actor(actorId);
            actor.gainFriendlyPoint($gameSystem.mainActorId(), value);
        } else if (value !== 0) {
            for (const actor of $gameParty.members()) {
                if (actor.actorId() !== $gameSystem.mainActorId()) {
                    actor.gainFriendlyPoint($gameSystem.mainActorId(), value);
                }
            }
        }
    });
    PluginManager.registerCommand(pluginName, "gainFriendlyPointWithoutActor", args => {
        const excludeActorId = Number(args.actorId);
        const variableId = Math.floor(Number(args.variableId) || 0);
        const value = (variableId > 0) ? $gameVariables.value(variableId) : Math.floor(Number(args.value));
        if ((actorId > 0) && (value !== 0)) {
            for (let actorId = 1; actorId < $dataActors.length; actorId++) {
                if ((actorId !== $gameSystem.mainActorId()) && (actorId !== excludeActorId) && $gameActors.isActorDataExists(actorId)) {
                    const actor = $gameActors.actor(actorId);
                    actor.gainFriendlyPoint($gameSystem.mainActorId(), value);
                }
            }
        }
    });
    PluginManager.registerCommand(pluginName, "gainFriendlyPointAll", args => {
        const variableId = Math.floor(Number(args.variableId) || 0);
        const value = (variableId > 0) ? $gameVariables.value(variableId) : Math.floor(Number(args.value));
        if (value != 0) {
            for (let actorId = 1; actorId < $dataActors.length; actorId++) {
                if ((actorId != $gameSystem.mainActorId()) && $gameActors.isActorDataExists(actorId)) {
                    const actor = $gameActors.actor(actorId);
                    actor.gainFriendlyPoint(1, value);
                }
            }
        }
    });
    PluginManager.registerCommand(pluginName, "changeMainActor", args => {
        const variableId = Math.floor(Number(args.variableId) || 0);
        const actorId = (variableId > 0) 
                ? $gameVariables.value(variableId) : Math.floor(Number(args.actorId) || 0);
        if ((actorId >= 0) && (actorId < $dataActors.length)) {
            $gameSystme.setMainActorId(actorId);
        }

    });


    /**
     * 友好度を得る。
     * メインアクターの場合、パーティーメンバーとの友好度の平均値を返す。
     * それ以外のアクターの場合、メインアクターとの友好度を返す。
     * 
     * @param {Game_Actor} actor アクター
     * @returns {number} 友好度
     */
    const _getFriendlyPoint = function(actor) {
        if (actor.isActor()) {
            if (actor.actorId() == $gameSystem.mainActorId()) { // メインアクターか？
                const maxFp = $gameParty.allMembers().reduce((prev, actor) => Math.max(prev, actor.friendlyPoint(1)), 0);
                return maxFp;
            } else {
                return actor.friendlyPoint(1);
            }
        } else {
            return 0;
        }
    };

    //------------------------------------------------------------------------------
    // TextManager

    TextManager.getFriendlyPointString = function(fp) {
        let index = friendlyPointStringTable.length - 1;
        while (index >= 0) {
            if (fp >= friendlyPointStringTable[index].friendlyPoint) {
                break;
            }
            index--;
        }
        if (index < 0) {
            index = 0;
        }

        const entry = friendlyPointStringTable[index];
        if (entry) {
            return entry.fpString;
        }
        return "-";
    };


    //------------------------------------------------------------------------------
    // DataManager
    /**
     * アイテムのノートタグを処理する。
     * 
     * @param {object} obj データオブジェクト。(DataItem)
     */
     const _processItemNotetag = function(obj) {
        if (Game_Action.EFFECT_GAIN_FP && obj.meta.gainFp) {
            const tokens = obj.meta.gainFp.split(',');
            if (tokens.length >= 2) {
                const type = Math.floor(Number(tokens[0]) || 0);
                const value = Math.floor(Number(tokens[1]) || 0);
                obj.effects.push({
                    code: Game_Action.EFFECT_GAIN_FP,
                    dataid: 0,
                    value1: type,
                    value2: value
                });
            }
        }
    };
    DataManager.addNotetagParserItems(_processItemNotetag);

    /**
     * アクターのノートタグを処理する。
     * 
     * @param {object} obj データオブジェクト(DataActor)
     */
    const _processActorNotetag = function(obj) {
        obj.gainFriendlyPointRates = [];
        if (obj.meta.gainFriendlyPointRates) {
            for (const field of obj.meta.gainFriendlyPointRates.split(',')) {
                const tokens = field.split('=');
                if (tokens.length >= 2) {
                    const type = Number(tokens[0].trim()) || 0;
                    const rate = Number(tokens[1].trim()) || 0;
                    obj.gainFriendlyPointRates[type] = rate;
                }
            }
        }
    };
    DataManager.addNotetagParserActors(_processActorNotetag);

    //------------------------------------------------------------------------------
    // Game_System
    const _Game_System_initialize = Game_System.prototype.initialize;
    /**
     * Game_Systemを初期化する。
     */
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._mainActorId = defaultMainActorId;
    };

    /**
     * メインアクターIDを設定する。
     * 
     * @param {number} id ID
     */
    Game_System.prototype.setMainActorId = function(id) {
        this._mainActorId = id;
    };

    /**
     * メインアクターIDを取得する。
     * 
     * @returns {number} アクターID
     */
    Game_System.prototype.mainActorId = function() {
        return this._mainActorId;
    };
    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_changeClass = Game_Actor.prototype.changeClass;
    /**
     * クラスを変更する。
     * 
     * @param {number} classId クラスID
     * @param {boolean} keepExp 経験値を保持するか。
     *                          保持する場合、クラス毎に経験値が保持される。つまりジョブレベルね。
     */
    Game_Actor.prototype.changeClass = function(classId, keepExp) {
        if (this._gpLearnableSkills) {
            this._gpLearnableSkills = []; // GrowupSystemで習得可能状態なスキルは全てリセットする。
        }

        _Game_Actor_changeClass.call(this, classId, keepExp);
    };
    /**
     * レベル変更の表示をする。
     * 
     * @param {object} prevInfo レベルアップ前のステータス 
     * @param {object} curInfo レベルアップ後のステータス
     * !!!overwrite!!! Game_Actor.displayLevelChange()
     *     レベル変更時の表示をカスタマイズするため変更する。
     */
    Game_Actor.prototype.displayLevelChange = function(prevInfo, curInfo) {
        const newSkills = this.findNewSkills(prevInfo.skills);

        const text = TextManager.levelUp.format(
            this._name,
            TextManager.level,
            this._level
        );
        $gameMessage.newPage();
        $gameMessage.add(text);
        for (let paramId = 0; paramId < 8; paramId++) {
            const prevVal = prevInfo.params[paramId];
            const newVal = curInfo.params[paramId];
            if (newVal > prevVal) {
                $gameMessage.add(TextManager.param(paramId) + " +" + (newVal - prevVal));
            }
        }
        for (const skill of newSkills) {
            $gameMessage.add(TextManager.obtainSkill.format(skill.name));
        }        
    };
    /**
     * TPを初期化する。
     * 既定の実装では、0～25の間の乱数値がセットされる。
     * 
     * !!!overwrite!!! Game_Battler.initTp
     *     初期TPを乱数でなく、ゼロとするためオーバーライドする。
     */
    Game_Actor.prototype.initTp = function() {
        this.clearTp();
        const fp = _getFriendlyPoint(this);
        const initialTp = Math.max(0, Math.floor(fp * friendlyPointTpRate));
        this.setTp(Math.randomInt(initialTp));
    };
    /**
     * levelに対応する経験値を得る。
     * 
     * @param {number} level レベル
     * @returns {number} 経験値
     * !!!overwrite!!! Game_Actor.expForLevel()
     *     EXP計算式を変更するため、オーバーライドする。
     */
    Game_Actor.prototype.expForLevel = function(level) {
        const c = this.currentClass();
        const basis = c.expParams[0];
        const extra = c.expParams[1];
        const acc_a = c.expParams[2];
        const acc_b = c.expParams[3];

        const basisRate = (1 + (basis - 30) / 40) * 16;
        const baseRate = 2.75;
        const accARate = baseRate + (acc_a - 30) / 400.0;
        const accBRate = 2.0 + (acc_b - 30) / 80.0;

        return Math.floor(
            Math.pow((level - 1), accARate) * basisRate + extra * Math.pow((level - 1), accBRate)
        );
    };    

    const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    /**
     * 基本パラメータベース値を得る。
     * 
     * @param paramId {number} パラメータID
     * @returns {number} パラメータ値
     */
    Game_Actor.prototype.paramPlus = function(paramId) {
        const value = _Game_Actor_paramPlus.call(this, paramId);
        switch (paramId) {
            case 0: // MaxHP
                {
                    const vit = Math.max(0, this.vit - 20);
                    return value + vit * 3 + (vit >> 3) * 10;
                }
            case 1: // MaxMP
                {
                    const int = Math.max(0, this.int - 20);
                    const men = Math.max(0, this.men - 20);
                    const intmen = int + men;
                    return value + (intmen >> 2) + (intmen >> 3) * 4;
                }
            case 2: // ATK
                {
                    const str = Math.max(0, this.str - 20);
                    return value + str + (str >> 3) * 5;
                }
            case 3: // DEF
                {
                    const vit = Math.max(0, this.vit - 20);
                    return value + vit + (vit >> 3) * 3;
                }
            case 4: // MAT
                {
                    const int = Math.max(0, this.int - 20);
                    return value + int + (int >> 3) * 5;
                }
            case 5: // MDF
                {
                    const men = Math.max(0, this.men - 20);
                    return value + men + (men >> 3) * 3;
                }
            case 6: // AGI
                return value;
            case 7: // LUK
                return value; // LUKを返す。
            default:
                return value;
        }
    };

    /**
     * 育成コストを計算する。
     * 
     * @param {number} currentValue 現在値
     * @returns {number} 育成コスト
     * !!!overwrite!!! Game_Actor.calcGrowupBasicParamCost()
     *     育成コストを変更するため、オーバーライドする。
     */
    Game_Actor.prototype.calcGrowupBasicParamCost = function(currentValue) {
        return 5 + Math.floor(currentValue / 8);
    };


    /**
     * 武器装備可能重量を得る。
     * 
     * @returns {number} 装備可能重量
     * !!!overwrite!!! Game_Actor.weaponWeightTolerance()
     *     武器装備可能重量計算式を変更するため、オーバーライドする。
     */
    Game_Actor.prototype.weaponWeightTolerance = function() {
        return this.str;
    };

    /**
     * 防具装備可能重量を得る。
     * 
     * @returns {number} 装備可能重量
     * !!!overwrite!!! Game_Actor.armorWeightTolerance()
     *     防具装備可能重量計算式を変更するため、オーバーライドする。
     */
    Game_Actor.prototype.armorWeightTolerance = function() {
        return this.vit;
    };

    /**
     * 友好度上昇レート
     * 
     * @param {number} type 種類
     * @returns {number} 上昇レート
     */
    Game_Actor.prototype.gainFriendlyPointRate = function(type) {
        const dataActor = this.actor();
        if ((type >= 0) && (type < dataActor.gainFriendlyPointRates.length)) {
            return dataActor.gainFriendlyPointRates[type] || 0;
        } else {
            return 0.0;
        }
    };
    /**
     * このアクターが使用可能なスキルタイプを得る。
     * 
     * @returns {Array<number>} スキルIDリスト
     * !!!overwrite!!! Game_Actor.skillTypes()
     *     使用可能なスキルから、使用可能なスキルタイプを逆算するように変更する。
     */
    Game_Actor.prototype.skillTypes = function() {
        const skills = this.skills();
        const skillTypes = [];
        for (const skill of skills) {
            if ((skill.stypeId > 0) && !skillTypes.includes(skill.stypeId)) {
                skillTypes.push(skill.stypeId);
            }
        }
        skillTypes.sort((a, b) => a - b);
        return skillTypes;
    };
    //------------------------------------------------------------------------------
    // BattleManager
    const _BattleManager_endBattle = BattleManager.endBattle;
    /**
     * 戦闘を終了させる。
     * 本メソッドを呼ぶと、フェーズが"battleEnd"に遷移し、次のupdate()でSceneManager.pop()がコールされる。
     * 
     * @param {number} result 戦闘結果(0:勝利 , 1:中断(逃走を含む), 2:敗北)
     */
    BattleManager.endBattle = function(result) {
        if (result == 0) { // 勝利時？
            for (const actor of $gameParty.allMembers()) {
                if (!actor.isDead() && (actor.actorId() != $gameSystem.mainActorId())) {
                    if (Math.random() < gainFriendlyPointRateOnBattleWin) {
                        actor.gainFriendlyPoint($gameSystem.mainActorId(), gainFriendlyPointOnBattleWin);
                    }
                }
            }
        }
        _BattleManager_endBattle.call(this, result);
    };
    //------------------------------------------------------------------------------
    // Game_Action

    const _Game_Action_multiplyDamageRate = Game_Action.prototype.multiplyDamageRate;
    /**
     * ダメージ量の乗算ボーナスレートを得る。
     * (加算・乗算用)
     * 
     * @param {Game_Battler} target ターゲット。
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} 乗算ボーナスレート
     */
    Game_Action.prototype.multiplyDamageRate = function(target, critical) {
        let rate = _Game_Action_multiplyDamageRate.call(this, target, critical);
        const subject = this.subject();
        const fp = _getFriendlyPoint(subject);
        const correctRate = _getCorrectRate(friendlyPointDamageCorrectionTable, fp);
        return Math.max(0, rate + correctRate);
    };
    const _Game_Action_itemCri = Game_Action.prototype.itemCri;
    /**
     * このアクションのクリティカル率を得る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @returns {number} クリティカル率(0.0～1.0）
     */
    Game_Action.prototype.itemCri = function(target) {
        const subject = this.subject();
        const fp = _getFriendlyPoint(subject);
        const correctRate = _getCorrectRate(friendlyPointCriticalCorrectionTable, fp);
        return Math.max(0, _Game_Action_itemCri.call(this, target) + correctRate);
    };

    const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
    /**
     * 効果を適用可能かどうかを判定する。
     * codeに対応する判定処理が定義されていない場合、適用可能(true)が返る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @param {DataEffect} effect エフェクトデータ
     * @returns {boolean} 適用可能な場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testItemEffect = function(target, effect) {
        if (Game_Action.EFFECT_GAIN_FP
                && (effect.code === Game_Action.EFFECT_GAIN_FP)) {
            return (target.isActor() 
                    && (target.friendlyPoint($gameSystem.mainActorId()) < Game_Actor.FRIENDLY_POINT_MAX)
                    && (target.gainFriendlyPointRate(effect.value1) !== 0));
        } else {
            return _Game_Action_testItemEffect.call(this, target, effect);
        }
    };

    const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    /**
     * 効果を適用する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {DataEffect} effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        if (Game_Action.EFFECT_GAIN_FP
                && (effect.code === Game_Action.EFFECT_GAIN_FP)) {
            this.applyItemEffectGainFp(target, effect);
        } else {
            _Game_Action_applyItemEffect.call(this, target, effect);
        }
    };

    /**
     * 友好度上昇効果を適用する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {DataEffect} effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffectGainFp = function(target, effect) {
        if (target.isActor()) {
            const rate = target.gainFriendlyPointRate(effect.value1);
            const value = Math.floor(effect.value2 * rate);
            target.gainFriendlyPoint($gameSystem.mainActorId(), value);

            this.makeSuccess(target);
        }
    };

    //------------------------------------------------------------------------------
    // Window_ChoiceActorList
    const _Window_ChoiceActorList_drawActorDefaultCustom = Window_ChoiceActorList.prototype.drawActorDefaultCustom;
    /**
     * 単純なアクター情報の最終行を描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {string} informationType 表示情報タイプ
     * @param {number} x 描画位置X
     * @param {number} y 描画位置Y
     * @param {number} width 幅
     */
    Window_ChoiceActorList.prototype.drawActorDefaultCustom = function(actor , informationType, x, y, width) {
        _Window_ChoiceActorList_drawActorDefaultCustom.call(this, ...arguments);
        if (informationType == "fp") {
            if (actor.actorId() != 1) {

                const fp = _getFriendlyPoint(actor);

                const labelWidth = Math.min(48, (width - 40) * 0.3);
                const paramWidth = Math.min(120, width - 40 - labelWidth - 8);
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(TextManager.friendlyPointA, x, y, labelWidth);

                if (displayFriendlyPointValue) {
                    this.changeTextColor(ColorManager.paramchangeTextColor(fp - Game_Actor.FRIENDLY_POINT_DEFAULT));
                    this.drawText(fp, x + labelWidth + 8, y, paramWidth, "right");

                    const iconId = _getFriendlyPointIconId(fp);
                    if (iconId >= 0) {
                        this.drawIcon(iconId, x + labelWidth + 16 + paramWidth, y + 2);
                    }
                } else {
                    const iconId = _getFriendlyPointIconId(fp);
                    if (iconId >= 0) {
                        this.drawIcon(iconId, x + labelWidth + 16, y + 2);
                    }
                }
            }
        }
    };

    //------------------------------------------------------------------------------
    // Window_Status
    if (Window_Status.prototype.drawActorGuildRank) {
        /**
         * ギルドランクの代わりに友好度を表示する。
         * 
         * @param {Game_Actor} actor アクター
         * @param {number} x 描画領域左上x
         * @param {number} y 描画領域左上y
         * @param {number} width 幅
         */
        Window_Status.prototype.drawActorGuildRank = function(actor, x, y, width) {
            if (actor.actorId() != 1) {
                const fp = _getFriendlyPoint(actor);

                const labelWidth = Math.min(48, (width - 40) * 0.3);
                const paramWidth = Math.min(120, width - 40 - labelWidth - 8);
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(TextManager.friendlyPointA, x, y, labelWidth);

                if (displayFriendlyPointValue) {
                    this.changeTextColor(ColorManager.normalColor());
                    this.drawText(fp, x + labelWidth + 8, y, paramWidth, "right");

                    const iconId = _getFriendlyPointIconId(fp);
                    if (iconId >= 0) {
                        this.drawIcon(iconId, x + labelWidth + 16 + paramWidth, y + 2);
                    }
                } else {
                    const iconId = _getFriendlyPointIconId(fp);
                    if (iconId >= 0) {
                        this.drawIcon(iconId, x + labelWidth + 16, y + 2);
                    }
                }
            }
        };
    }

    //------------------------------------------------------------------------------
    // Window_Base
    /**
     * actorIdの友好度を表す文字列を得る。
     * 
     * @param {number} actorId アクターID
     * @returns {string} 文字列
     */
    const _getFriendlyPointStringOfActor = function(actorId) {
        const actor = $gameActors.actor(actorId);
        if (actor && (actor.actorId() !== $gameSystem.mainActorId())) {
            const fp = _getFriendlyPoint(actor);
            return TextManager.getFriendlyPointString(fp);
        } else {
            return "-";
        }
    };


    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    /**
     * エスケープキャラクタを変換する。
     * 
     * @param {string} text テキスト
     * @returns {string} 置換済みテキスト
     */
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        // eslint-disable-next-line no-control-regex
        text = text.replace(/\x1bFPSTR\[(\d+)\]/gi, (_, p1) =>
            _getFriendlyPointStringOfActor(parseInt(p1))
        );
        return text;
    };

    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    /**
     * エスケープキャラクタを処理する。
     * 
     * @param {string} code エスケープキャラクタ
     * @param {TextState} textState テキストステートオブジェクト
     */
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        if (code === "FPICON") {
            const id = this.obtainEscapeParam(textState);
            const actor = $gameActors.actor(id);
            if (actor && (actor.actorId() !== $gameSystem.mainActorId())) {
                const fp = _getFriendlyPoint(actor);
                const iconId = _getFriendlyPointIconId(fp);
                this.processDrawIcon(iconId, textState);
            }
        } else {
            _Window_Base_processEscapeCharacter.call(this, code, textState);
        }
    };
    
    //------------------------------------------------------------------------------
    // Bitmap
    if (applyCharacterGradiation) {
        /**
         * 文字の本体部分を描画する。
         * 
         * @param {string} text 文字列
         * @param {number} tx X位置
         * @param {number} ty Y位置
         * @param {number} maxWidth 最大幅
         * !!!overwrite!!! Bitmap._drawTextBody
         *     文字をグラディエーションさせるため、オーバーライドする。
         */
        Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth) {
            const context = this.context;
            const size = context.measureText(text);
            const y0 = ty - size.actualBoundingBoxAscent;
            const y1 = ty + size.actualBoundingBoxDescent;
            const gradiation = context.createLinearGradient(0, y0, 0, y1);
            gradiation.addColorStop(0, "darkgray");
            gradiation.addColorStop(0.25, this.textColor);
            gradiation.addColorStop(0.60, "white");
            gradiation.addColorStop(0.70, "darkgray");
            gradiation.addColorStop(0.90, this.textColor);
            gradiation.addColorStop(1.00, "darkgray");
            context.fillStyle = gradiation;
            context.fillText(text, tx, ty, maxWidth);
        };
    }

    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張

})();