/*:ja
 * @target MZ 
 * @plugindesc 射程距離システムプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @orderAfter Kapu_Base_ParamName
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_TargetManager
 * @orderAfter Kapu_TargetManager
 * 
 * @command setEnemyBattlePosition
 * @text エネミー戦闘位置設定
 * @desc エネミーの戦闘位置を設定する。戦闘中以外は無効。
 * 
 * @arg no
 * @text 番号
 * @desc グループ上のエネミー番号(1～x)
 * @type number
 * @min 1
 * 
 * @arg position
 * @text 位置
 * @desc 戦闘位置。
 * @type select
 * @option 前衛
 * @value 0
 * @option 後衛
 * @value 1
 * @default 1
 * 
 * @command setActorBattlePosition
 * @text アクター戦闘位置設定
 * @desc アクターの戦闘位置を設定する。
 *
 * @arg no
 * @text 番号
 * @desc 隊列上のインデックス番号
 * @type number
 * 
 * @arg position
 * @text 位置
 * @desc 戦闘位置。
 * @type select
 * @option 前衛
 * @value 0
 * @option 後衛
 * @value 1
 * @default 1
 * 
 * @param scopeIdSelectedRowOpponents
 * @text 敵1列を表すスコープID
 * @type number
 * @min 100
 * @default 101
 * 
 * @param textScopeSelectedRowOpponents
 * @text 敵1列を表すテキスト
 * @type string
 * @default 敵1列
 * @parent scopeIdSelectedRowOpponents
 * 
 * @param scopeIdFrontRowOpponents
 * @text 敵前衛を表すスコープID
 * @type number
 * @min 100
 * @default 102
 * 
 * @param textScopeFrontRowOpponents
 * @text 敵前衛を表す文字列
 * @type string
 * @default 敵前衛
 * @parent scopeIdFrontRowOpponents
 * 
 * @param scopeIdSelectedAlivedRowFriends
 * @text 生存している味方1列を表すスコープID
 * @type number
 * @min 100
 * @default 103
 * 
 * @param textScopeSelectedAlivedRowFriends
 * @text 生存している味方1列を表す文字列
 * @type string
 * @default 味方1列
 * @parent scopeIdSelectedAlivedRowFriends
 * 
 * @param scopeIdFrontAlivedRowFriends
 * @text 生存している味方前衛を表すスコープID
 * @type number
 * @min 100
 * @default 104
 * 
 * @param textScopeFrontAlivedRowFriends
 * @text 生存している味方前衛を表す文字列
 * @type string
 * @default 味方前衛
 * @parent scopeIdFrontAlivedRowFriends
 * 
 * @param scopeIdSelectedDeadRowFriends
 * @text 死亡している味方1列を表すスコープID
 * @type number
 * @min 100
 * @default 105
 * 
 * @param textScopeSelectedDeadRowFriends
 * @text 死亡しているる味方1列を表す文字列
 * @type string
 * @default 味方1列
 * @parent scopeIdSelectedDeadRowFriends
 * 
 * @param scopeIdSelectedRowFriends
 * @text 味方1列を表すスコープID
 * @type number
 * @min 100
 * @default 106
 * 
 * @param textScopeSelectedRowFriends
 * @text る味方1列を表す文字列
 * @type string
 * @default 味方1列
 * @parent scopeIdSelectedRowFriends
 * 
 * @param scopeIdSelfAlivedRowFriends
 * @text 生存している自分と同じ列を表すスコープID
 * @type number
 * @min 100
 * @default 107
 * 
 * @param textScopeSelfAlivedRowFriends
 * @text 自分と同じ列を表す文字列
 * @type string
 * @default 同列
 * @parent scopeIdSelfAlivedRowFriends
 * 
 * @param scopeIdRandomOpponent
 * @text 指定列のランダムな敵対者1体を対象にするスコープID
 * @type number
 * @min 100
 * @default 108
 * 
 * @param textScopeRandomOpponent
 * @text 指定列のランダムな敵対者を表す文字列
 * @type text
 * @default ランダムな敵1体
 * @parent scopeIdRandomOpponent
 * 
 * @param scopeIdRandom2Opponents
 * @text 指定列のランダムな敵対者2体を対象にするスコープID
 * @type number
 * @min 100
 * @default 109
 * 
 * @param textScopeRandom2Opponents
 * @text 指定列のランダムな敵対者2体を表す文字列
 * @type text
 * @default ランダムな敵2体
 * @parent scopeIdRandom2Opponents
 * 
 * @param scopeIdRandom3Opponents
 * @text 指定列のランダムな敵対者3体を対象にするスコープID
 * @type number
 * @min 100
 * @default 110
 * 
 * @param textScopeRandom3Opponents
 * @text 指定列のランダムな敵対者3体を表す文字列
 * @type text
 * @default ランダムな敵3体
 * @parent scopeIdRandom3Opponents
 * 
 * @param scopeIdRandom4Opponents
 * @text 指定列のランダムな敵対者4体を対象にするスコープID
 * @type number
 * @min 100
 * @default 111
 * 
 * @param textScopeRandom4Opponents
 * @text 指定列のランダムな敵対者4体を表す文字列
 * @type text
 * @default ランダムな敵4体
 * @parent scopeIdRandom4Opponents
 * 
 * @param scopeIdRandomOpponentAtFront
 * @text 前列のランダムな敵対者1体を対象にするスコープID
 * @type number
 * @min 100
 * @default 112
 * 
 * @param textScopeRandomOpponentAtFront
 * @text 前列のランダムな敵対者を表す文字列
 * @type text
 * @default 前列のランダムな敵1体
 * @parent scopeIdRandomOpponentAtFront
 * 
 * @param scopeIdRandom2OpponentsAtFront
 * @text 前列のランダムな敵対者2体を対象にするスコープID
 * @type number
 * @min 100
 * @default 113
 * 
 * @param textScopeRandom2OpponentsAtFront
 * @text 前列のランダムな敵対者2体を表す文字列
 * @type text
 * @default 前列のランダムな敵2体
 * @parent scopeIdRandom2OpponentsAtFront
 * 
 * @param scopeIdRandom3OpponentsAtFront
 * @text 前列のランダムな敵対者3体を対象にするスコープID
 * @type number
 * @min 100
 * @default 114
 * 
 * @param textScopeRandom3OpponentsAtFront
 * @text 前列のランダムな敵対者3体を表す文字列
 * @type text
 * @default 前列のランダムな敵3体
 * @parent scopeIdRandom3OpponentsAtFront
 * 
 * @param scopeIdRandom4OpponentsAtFront
 * @text 前列のランダムな敵対者4体を対象にするスコープID
 * @type number
 * @min 100
 * @default 115
 * 
 * @param textScopeRandom4OpponentsAtFront
 * @text 前列のランダムな敵対者4体を表す文字列
 * @type text
 * @default 前列のランダムな敵4体
 * @parent scopeIdRandom4OpponentsAtFront
 * 
 * 
 * @param textTargetRowOpponents
 * @text 敵対者列を対象としたターゲット名。
 * @desc 敵対者列列を対象としたターゲット名。%1に列番号(1,2,..)が入る
 * @type string
 * @default 敵%1列目
 * 
 * @param textTargetRowFriends
 * @text 味方列を対象としたターゲット名。
 * @desc 味方列列を対象としたターゲット名。%1に列番号(1,2,..)が入る
 * @type string
 * @default 味方%1列目
 * 
 * @param blockMoveFlagId
 * @text 戦闘位置変更効果フラグID
 * @desc 戦闘位置変更効果を防止するスペシャルフラグID
 * @type number
 * @default 100
 * @min 6
 * 
 * @param longRangeFlagId
 * @text 射程無効効果フラグID
 * @desc 射程が常にLONGRNAGEになるスペシャルフラグID
 * @type number
 * @default 101
 * @min 6
 * 
 * @param effectCode
 * @text 戦闘位置エフェクトコード
 * @desc 移動させる効果を割り当てるエフェクトコード。
 * @type number
 * @default 100
 * @min 4
 * 
 * @param moveFrontSkillId 
 * @text 前に移動コマンドスキルID
 * @desc 前に移動する先頭コマンドに割り当てるスキルID。0で未割当。
 * @default 0
 * @type skill
 * 
 * @param moveRearSkillId
 * @text 後ろに移動コマンドスキルID
 * @desc 後ろに移動する先頭コマンドに割り当てるスキルID。0で未割当。
 * @default 0
 * @type skill
 * 
 * @param textTraitBlockMovePosition
 * @text 戦闘位置移動効果防止特性名
 * @desc 戦闘位置移動効果防止特性名
 * @type string
 * @default 隊列移動防御
 * 
 * @param textTraitIgnoreRangeDistance
 * @text 戦闘距離射程無視特性名
 * @desc 戦闘距離射程無視特性名
 * @type string
 * @default 射程無視
 * 
 * @help
 * 戦闘時の射程距離(S/M/L)を追加します。
 * 以下の機能を提供します。
 * ・前衛/後衛の設定を追加。
 * ・戦闘中の前衛・後衛の切り替え
 * ・プラグインコマンドによる前衛・後衛の切り替え
 *   "前に移動コマンドスキルID" "後ろに移動コマンドスキルID"を指定すること。
 *   スキル対象は自分自身にする。
 * ・武器・スキルの射程の概念追加。
 *   S:前衛to前衛
 *   M:前衛to前衛/後衛 または 後衛to前衛
 *   L:前衛/後衛to前衛/後衛
 * ・効果範囲・列の追加
 *   ノートタグにrangeRowを付与すると、元からのスコープに併せて以下のように振る舞いが変わります。
 *   対象が使用者 -> 使用者＋同列
 *   対象が味方1体 -> 味方1列
 *   対象が単体選択 -> 味方1列 or エネミー1列
 *   対象がランダム1~4体 -> 指定した列のランダム1~4体
 * 
 * 
 * ■ 使用時の注意
 * エネミーグループにはノートタグが設定できません（無念）。
 * エネミーグループの隊列を設定するには、
 * 戦闘開始時のイベントで列を設定することを想定しています。
 * 
 * ターゲット選択周りはほぼオーバーライドしているので、
 * 他の対象変更系プラグインと組み合わせると破綻する可能性が高いです（無念）
 * 
 * システムに関わってくるので、UI上の表示は含まれません。
 * 別途用意します。
 * 
 * ■ プラグイン開発者向け
 * Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION が定義されます。
 * Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE が定義されます。
 * Game_Action.EFFECT_MOVE_BATTLE_POSITION が定義されます。
 * 
 * 
 * $gameSystem.isBattlePositionSupported()
 *     戦闘位置がサポートされていることを表す。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * setEnemyBattlePosition
 *    エネミーの戦闘位置を変更する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム/スキル
 *   <moveToFront:rate#>
 *      前衛に移動する効果。例えばエネミーなら引き寄せとか。
 *      rate#の割合で発生する。rate#を指定しない場合には100%発生する。
 *   <moveToRear:rate#>
 *      後衛に移動する効果。例えばエネミー対象にすると、ノックバック効果になる。
 *      rate#の割合で発生する。rate#を指定しない場合には100%発生する。
 *   <range:range#>
 *      アイテム/スキルの射程を指定する。
 *      未指定時は0
 *     -1:depends 装備品依存
 *      0:short (前列to前列) 
 *      1:middle (前列to後列まで / 後列to前列まで)
 *      2:long (全部)
 * 
 *   <rangeRow>
 *      効果範囲が列であることを指定します。
 *      元々のスコープは単体にしておく必要があります。
 *   <rangeRow:front>
 *      効果範囲が前衛のみであることを指定します。
 *      元々のスコープは単体にしておく必要があります。
 * 武器
 *   <range:range#>
 *      アイテム/スキルの射程を指定する。
 *      未指定時は0
 *      0:short (前列to前列) 
 *      1:middle (前列to後列まで / 後列to前列まで)
 *      2:long (全部)
 *      
 *   <blockMovePosition>
 *      敵対者からの前衛/後衛 移動操作をブロックする。
 *   <ignoreRangeDistance>
 *      射程距離無視特性を追加する。
 * 
 * アクター/クラス/ステート/防具
 *   <blockMovePosition>
 *      敵対者からの前衛/後衛 移動操作をブロックする。
 *   <ignoreRangeDistance>
 *      射程距離無視特性を追加する。
 * 
 * エネミー
 *   <blockMovePosition>
 *      敵対者からの前衛/後衛 移動操作をブロックする。
 *   <ignoreRangeDistance>
 *      射程距離無視特性を追加する。
 *   <defaultRange:range#>
 *      デフォルトの射程距離をrange#とする。未指定時は0
 * 
 * ターン0のイベント先頭行コメントに
 *      # SetBattlePosition id# position#
 * とすると、戦闘開始時に位置を指定できるようになる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.6.0 Kapu_TargetManagerを使用するように変更。
 * Version.0.5.0 Kapu_Base_ParamNameに対応
 * Version.0.4.0 エネミーグループのターン0イベントにコメントを記述することで、戦闘位置を設定できるようにした。
 * Version.0.3.0 ステータス表示用に、Game_BattlerBaseに通常攻撃射程を得るインタフェースを追加した。
 * Version.0.2.0 射程2のスキル使用時はカウンターを受けないようにした。
 * Version.0.1.1 各特性について、ID未指定時は動作しないように変更した。
 * Version.0.1.0 作成した。
 */
(() => {
    const pluginName = "Kapu_RangeDistance";
    const parameters = PluginManager.parameters(pluginName);
    const moveToFrontSkillId = Number(parameters["moveFrontSkillId"]) || 0;
    const moveToRearSkillId = Number(parameters["moveRearSkillId"]) || 0;
    Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION = Number(parameters["blockMoveFlagId"]) || 0;
    Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE = Number(parameters["longRangeFlagId"]) || 0;
    Game_Action.EFFECT_MOVE_BATTLE_POSITION = Number(parameters["effectCode"]) || 0;

    if (!Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION) {
        console.error(pluginName + ":FLAG_ID_BLOCK_MOVE_BATTLEPOSITION is not valid.");
    }
    if (!Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE) {
        console.error(pluginName + ":FLAG_ID_IGNORE_RANGEDISTANCE is not valid.");
    }
    if (!Game_Action.EFFECT_MOVE_BATTLE_POSITION) {
        console.error(pluginName + ":EFFECT_MOVE_BATTLE_POSITION is not valid.");
    }

    const textTargetRowOpponents = parameters["textTargetRowOpponents"] || "Enemies at %1 row";
    const textTargetRowFriends = parameters["textTargetRowFriends"] || "Friends at %1 row";

    Game_Action.RANGE_SHORT = 0;
    Game_Action.RANGE_MIDDLE = 1;
    Game_Action.RANGE_LONG = 2;
    Game_Action.RANGE_DEPENDS = -1;

    {
        let scopeId = 0;

        scopeId = Math.round(Number(parameters["scopeIdSelectedRowOpponents"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_SELECTED_ROW_OPPONENTS = scopeId;
            const text = parameters["textScopeSelectedRowOpponents"] || "One row enemies";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:true, targetCount:TargetManager.TARGET_COUNT_ALL,
                forOpponent:true, forAlive:true, 
            };
        } else {
            throw new Error("SCOPE_SELECTED_ROW_OPPONENTS not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdFrontRowOpponents"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_FRONT_OPPONENTS = scopeId;
            const text = parameters["textScopeFrontRowOpponents"] || "Front enemies";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:false, targetCount:TargetManager.TARGET_COUNT_ALL,
                forOpponent:true, forAlive:true, 
            };
        } else {
            throw new Error("SCOPE_FRONT_OPPONENTS not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdSelectedAlivedRowFriends"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_ALIVED_ROW_FRIENDS = scopeId;
            const text = parameters["textScopeSelectedAlivedRowFriends"] || "Row friends";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:true, targetCount:TargetManager.TARGET_COUNT_ALL,
                forFriend:true, forAlive:true, 
            };
        } else {
            throw new Error("SCOPE_ALIVED_ROW_FRIENDS not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdFrontAlivedRowFriends"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_ALIVED_FRONT_FRIENDS = scopeId;
            const text = parameters["textScopeFrontAlivedRowFriends"] || "Front friends";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:false, targetCount:TargetManager.TARGET_COUNT_ALL,
                forFriend:true, forAlive:true, 
            };
        } else {
            throw new Error("SCOPE_ALIVED_FRONT_FRIENDS not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdSelectedDeadRowFriends"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_DEAD_ROW_FRIENDS = scopeId;
            const text = parameters["textScopeSelectedDeadRowFriends"] || "Row friends";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:true, targetCount:TargetManager.TARGET_COUNT_ALL,
                forFriend:true, forDead:true, 
            };
        } else {
            throw new Error("SCOPE_DEAD_ROW_FRIENDS not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdSelectedRowFriends"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_ROW_FRIENDS = scopeId;
            const text = parameters["textScopeSelectedRowFriends"] || "Row friends";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:true, targetCount:TargetManager.TARGET_COUNT_ALL,
                forFriend:true, forAlive:true, forDead:true, 
            };
        } else {
            throw new Error("SCOPE_ROW_FRIENDS not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdSelfAlivedRowFriends"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_ALIVED_SAME_ROW_FRIENDS = scopeId;
            const text = parameters["textScopeSelfAlivedRowFriends"] || "Same row friends";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:false, targetCount:TargetManager.TARGET_COUNT_ALL,
                forFriend:true, forAlive:true, 
            };
        } else {
            throw new Error("SCOPE_ALIVED_SAME_ROW_FRIENDS not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdRandomOpponent"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_RANDOME_1_OPPONENT_IN_ROW = scopeId;
            const text = parameters["textScopeRandomOpponent"] || "Random 1 opponent";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:true, targetCount:1,
                forOpponent:true, forAlive:true, random:true
            };
        } else {
            throw new Error("SCOPE_RANDOME_1_OPPONENT_IN_ROW not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdRandom2Opponents"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_RANDOME_2_OPPONENTS_IN_ROW = scopeId;
            const text = parameters["textScopeRandom2Opponents"] || "Random 2 opponents";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:true, targetCount:2,
                forOpponent:true, forAlive:true, random:true,
            };
        } else {
            throw new Error("SCOPE_RANDOME_2_OPPONENTS_IN_ROW not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdRandom3Opponents"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_RANDOME_3_OPPONENTS_IN_ROW = scopeId;
            const text = parameters["textScopeRandom3Opponents"] || "Random 3 opponents";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:true, targetCount:3,
                forOpponent:true, forAlive:true, random:true,
            };
        } else {
            throw new Error("SCOPE_RANDOME_3_OPPONENTS_IN_ROW not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdRandom4Opponents"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_RANDOME_4_OPPONENTS_IN_ROW = scopeId;
            const text = parameters["textScopeRandom4Opponents"] || "Random 4 opponents";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:true, targetCount:4,
                forOpponent:true, forAlive:true, random:true,
            };
        } else {
            throw new Error("SCOPE_RANDOME_4_OPPONENTS_IN_ROW not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdRandomOpponentAtFront"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_RANDOME_1_OPPONENT_IN_FRONT_ROW = scopeId;
            const text = parameters["textScopeRandomOpponentAtFront"] || "Random 1 opponent";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:false, targetCount:1,
                forOpponent:true, forAlive:true, random:true
            };
        } else {
            throw new Error("SCOPE_RANDOME_1_OPPONENT_IN_FRONT_ROW not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdRandom2OpponentsAtFront"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_RANDOME_2_OPPONENTS_IN_FRONT_ROW = scopeId;
            const text = parameters["textScopeRandom2OpponentsAtFront"] || "Random 2 opponents";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:false, targetCount:2,
                forOpponent:true, forAlive:true, random:true,
            };
        } else {
            throw new Error("SCOPE_RANDOME_2_OPPONENTS_IN_FRONT_ROW not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdRandom3OpponentsAtFront"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_RANDOME_3_OPPONENTS_IN_FRONT_ROW = scopeId;
            const text = parameters["textScopeRandom3OpponentsAtFront"] || "Random 3 opponents";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:false, targetCount:3,
                forOpponent:true, forAlive:true, random:true,
            };
        } else {
            throw new Error("SCOPE_RANDOME_2_OPPONENTS_IN_FRONT_ROW not valid.");
        }

        scopeId = Math.round(Number(parameters["scopeIdRandom4OpponentsAtFront"]) || 0);
        if ((scopeId > 100) && !$dataItemScopes[scopeId]) {
            TargetManager.SCOPE_RANDOME_4_OPPONENTS_IN_FRONT_ROW = scopeId;
            const text = parameters["textScopeRandom4OpponentsAtFront"] || "Random 4 opponents";
            $dataItemScopes[scopeId] = {
                id:scopeId, name:text, needsSelection:false, targetCount:4,
                forOpponent:true, forAlive:true, random:true,
            };
        } else {
            throw new Error("SCOPE_RANDOME_2_OPPONENTS_IN_FRONT_ROW not valid.");
        }
    }


    PluginManager.registerCommand(pluginName, "setEnemyBattlePosition", args => {
        const no = Number(args.no) || 1;
        const position = Number(args.position) || 0;
        if ((no > 0) && (position >= 0) && (position <= 1)) {
            if ($gameParty.inBattle()) {
                const index = no - 1;
                $gameTroop.changeBattlePosition(index, position);
            }
        }
    });

    PluginManager.registerCommand(pluginName, "setActorBattlePosition", args => {
        const no = Number(args.no) || 0;
        const position = Number(args.position) || 0;
        if ((no >= 0) && (position >= 0) && (position <= 1)) {
            $gameParty.changeBattlePosition(no, position);
        }
    });


    //------------------------------------------------------------------------------
    // DataManager
    /**
     * 戦闘位置移動効果をeffectsに追加する。
     * 
     * @param {object} obj エフェクトを追加するオブジェクト
     * @param {number} dataId データID
     * @param {number} rate 発生確率
     */
     const _addEffectMoveBattlePosition = function(obj, dataId, rate) {
        if (Game_Action.EFFECT_MOVE_BATTLE_POSITION) {
            obj.effects.push({
                code: Game_Action.EFFECT_MOVE_BATTLE_POSITION,
                dataId: dataId,
                value1: rate,
                value2: 0
            });
        }
    };

    /**
     * レンジ文字列からレンジ値を得る。
     * 
     * @param {string} rangeStr レンジ文字列
     * @returns {number} レンジ 
     */
    const _getRange = function(rangeStr) {
        const num = Number(rangeStr);
        if (!isNaN(num)) {
            return Math.round(num);
        } else {
            switch (rangeStr) {
                case "short":
                    return Game_Action.RANGE_SHORT;
                case "middle":
                    return Game_Action.RANGE_MIDDLE;
                case "long":
                    return Game_Action.RANGE_LONG;
                case "depends":
                    return Game_Action.RANGE_DEPENDS;
                default:
                    return Game_Action.RANGE_SHORT;
            }
        }
    };

    /**
     * スコープによりレンジを設定する。
     * 
     * @param {number} scope スコープ
     * @param {number} defaultRange デフォルトレンジ
     * @returns {number} レンジ
     */
    const _getRangeByScope = function(scope, defaultRange) {
        switch (scope) {
            case TargetManager.SCOPE_ALL_OPPONENTS:
            case TargetManager.SCOPE_SELECTED_ROW_OPPONENTS:
            case TargetManager.SCOPE_RANDOME_1_OPPONENT:
            case TargetManager.SCOPE_RANDOME_2_OPPONENTS:
            case TargetManager.SCOPE_RANDOME_3_OPPONENTS:
            case TargetManager.SCOPE_RANDOME_4_OPPONENTS:
                return Game_Action.RANGE_LONG;
            case TargetManager.SCOPE_FRONT_OPPONENTS:
            case TargetManager.SCOPE_RANDOME_1_OPPONENT_IN_FRONT_ROW:
            case TargetManager.SCOPE_RANDOME_2_OPPONENTS_IN_FRONT_ROW:
            case TargetManager.SCOPE_RANDOME_3_OPPONENTS_IN_FRONT_ROW:
            case TargetManager.SCOPE_RANDOME_4_OPPONENTS_IN_FRONT_ROW:
                return Game_Action.RANGE_MIDDLE;
            default:
                return defaultRange;
        }
    }

    /**
     * scopeに関係するノートタグを処理する。
     * 
     * @param {object} obj DataItem/DataSkill
     */
    const _processScopeNoteTag = function(obj) {
        if (obj.meta.rangeRow) {
            // RAW指定があったとき、元のスコープ設定に合わせて切り替える。
            switch (obj.scope) {
                case TargetManager.SCOPE_ONE_OPPONENTS: // selected opponent one.
                    if (obj.meta.rangeRow === "front") {
                        obj.scope = TargetManager.SCOPE_FRONT_OPPONENTS;
                    } else {
                        obj.scope = TargetManager.SCOPE_SELECTED_ROW_OPPONENTS;
                    }
                    break;
                case TargetManager.SCOPE_RANDOME_1_OPPONENT: // random one opponent
                    if (obj.meta.rangeRow === "front") {
                        obj.scope = TargetManager.SCOPE_RANDOME_1_OPPONENT_IN_FRONT_ROW;
                    } else {
                        obj.scope = TargetManager.SCOPE_RANDOME_1_OPPONENT_IN_ROW;
                    }
                    break;
                case TargetManager.SCOPE_RANDOME_2_OPPONENTS: // random two opponents
                    if (obj.meta.rangeRow === "front") {
                        obj.scope = TargetManager.SCOPE_RANDOME_2_OPPONENTS_IN_FRONT_ROW;
                    } else {
                        obj.scope = TargetManager.SCOPE_RANDOME_2_OPPONENTS_IN_ROW;
                    }
                    break;
                case TargetManager.SCOPE_RANDOME_3_OPPONENTS: // random three opponents
                    if (obj.meta.rangeRow === "front") {
                        obj.scope = TargetManager.SCOPE_RANDOME_3_OPPONENTS_IN_FRONT_ROW;
                    } else {
                        obj.scope = TargetManager.SCOPE_RANDOME_3_OPPONENTS_IN_ROW;
                    }
                    break;
                case TargetManager.SCOPE_RANDOME_4_OPPONENTS: // random four opponents
                    if (obj.meta.rangeRow === "front") {
                        obj.scope = TargetManager.SCOPE_RANDOME_4_OPPONENTS_IN_FRONT_ROW;
                    } else {
                        obj.scope = TargetManager.SCOPE_RANDOME_4_OPPONENTS_IN_ROW;
                    }
                    break;
                case TargetManager.SCOPE_ALIVED_FRIEND: // selected alived friend
                    if (obj.meta.rangeRow === "front") {
                        obj.scope = TargetManager.SCOPE_ALIVED_FRONT_FRIENDS;
                    } else {
                        obj.scope = TargetManager.SCOPE_ALIVED_ROW_FRIENDS;
                    }
                    break;
                case TargetManager.SCOPE_DEAD_FRIEND: // selected dead friend
                    obj.scope = TargetManager.SCOPE_DEAD_ROW_FRIENDS;
                    break;
                case TargetManager.SCOPE_FRIEND: // selected friend
                    obj.scope = TargetManager.SCOPE_ROW_FRIENDS;
                    break;
                case TargetManager.SCOPE_USER_ONLY: // user
                    obj.scope = TargetManager.SCOPE_ALIVED_SAME_ROW_FRIENDS;
                    break;
            }
        }
    };


    /**
     * objのノートタグを処理する。
     * 
     * @param {obj} obj DataSkill
     */
    const _processSkillNoteTag = function(obj) {
        _processScopeNoteTag(obj);

        obj.range = Game_Action.RANGE_DEPENDS;
        if ((obj.id != moveToFrontSkillId) && (obj.id != moveToRearSkillId)) {
            if (obj.meta.moveToFront) {
                const rate = Number(obj.meta.moveToFront) || 1.0;
                _addEffectMoveBattlePosition(obj, 0, rate);
            } else if (obj.meta.moveToRear) {
                const rate = Number(obj.meta.moveToRear) || 1.0;
                _addEffectMoveBattlePosition(obj, 1, rate);
            }
        }
        if (obj.meta.range) {
            obj.range = _getRange(obj.meta.range).clamp(-1, 2);
        } else {
            // スコープによりデフォルトを決める。
            obj.range = _getRangeByScope(obj.scope, obj.range);
        }
    };
    DataManager.addNotetagParserSkills(_processSkillNoteTag);

    /**
     * $dataItemsのノートタグを処理する。
     * 
     * @param {object} obj DataItem
     */
     const _processItemNoteTag = function(obj) {
        _processScopeNoteTag(obj);
        obj.range = Game_Action.RANGE_SHORT;
        if (obj.meta.range) {
            obj.range = _getRange(obj.meta.range).clamp(-1, 2);
        } else {
            // スコープによりデフォルトを決める。
            obj.range = _getRangeByScope(obj.scope, obj.range);
        }

        if (obj.meta.moveToFront) {
            const rate = Number(obj.meta.moveToFront) || 1.0;
            _addEffectMoveBattlePosition(obj, 0, rate);
        } else if (obj.meta.moveToRear) {
            const rate = Number(obj.meta.moveToRear) || 1.0;
            _addEffectMoveBattlePosition(obj, 1, rate);
        }
    };
    DataManager.addNotetagParserItems(_processItemNoteTag);



    /**
     * 特性ノートタグを処理する。
     * 
     * @param {TraitObject} obj 特性(traits)を持ったオブジェクト。
     */
     const _processTraitsNoteTag = function(obj) {
        if (obj.meta.blockMovePosition && Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION) {
            obj.traits.push({ 
                code:Game_BattlerBase.TRAIT_SPECIAL_FLAG, 
                dataId:Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION, 
                value:0
            });              
        }
        if (obj.meta.ignoreRangeDistance && Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE) {
            obj.traits.push({
                code:Game_BattlerBase.TRAIT_SPECIAL_FLAG,
                dataId:Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE,
                value:0
            });

        }
    };
    DataManager.addNotetagParserActors(_processTraitsNoteTag);
    DataManager.addNotetagParserClasses(_processTraitsNoteTag);
    DataManager.addNotetagParserArmors(_processTraitsNoteTag);
    DataManager.addNotetagParserStates(_processTraitsNoteTag);

    
    /**
     * $dataWeaponsのノートタグを処理する。
     * 
     * @param {object} obj DataWeapon
     */
     const _processWeaponNotetag = function(obj) {
        obj.range = 0;
        if (obj.meta.range) {
            obj.range = _getRange(obj.meta.range).clamp(-1, 2);
        }
        
        _processTraitsNoteTag(obj);
    };
    DataManager.addNotetagParserWeapons(_processWeaponNotetag);

    /**
     * $dataEnemyのノートタグを処理する。
     * 
     * @param {object} obj DataEnemy
     */
     const _processEnemyNotetag = function(obj) {
        obj.defaultRange = Game_Action.RANGE_SHORT;
        _processTraitsNoteTag(obj);
        if (obj.meta.defaultRange) {
            obj.defaultRange = _getRange(obj.meta.defaultRange).clamp(0, 1);
        }
    };
    DataManager.addNotetagParserEnemies(_processEnemyNotetag);
    //------------------------------------------------------------------------------
    // Scene_Boot

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    /**
     * Scene_Bootを開始する。
     */
    Scene_Boot.prototype.start = function () {
        if (moveToFrontSkillId) {
            // エフェクト追加
            const skill = $dataSkills[moveToFrontSkillId];
            if (skill.scope !== TargetManager.SCOPE_USER_ONLY) {
                console.error("skill: + " + skill.name + " scope is not for self.");
                skill.scope = TargetManager.SCOPE_USER_ONLY; // 対象を自分自身に変更
            }
            _addEffectMoveBattlePosition(skill, 0, 1.0);
        }
        if (moveToRearSkillId) {
            // エフェクト追加
            const skill = $dataSkills[moveToRearSkillId];
            if (skill.scope !== 11) {
                console.error("skill: + " + skill.name + " scope is not for self.");
                skill.scope = TargetManager.SCOPE_USER_ONLY;
            }
            _addEffectMoveBattlePosition(skill, 1, 1.0);
        }
        _Scene_Boot_start.call(this);
    };
    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._specialFlags && Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION) {
        TextManager._specialFlags[Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION] = parameters["textTraitBlockMovePosition"] || "";
    }
    if (TextManager._specialFlags && Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE) {
        TextManager._specialFlags[Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE] = parameters["textTraitIgnoreRangeDistance"] || "";
    }
    //------------------------------------------------------------------------------
    // TargetManager
    const _TargetManager_isTargetable = TargetManager.isTargetable;

    /**
     * subjectがitemを使用する際、targetを対象にできるかどうかを判定する。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {Game_Battler} target 判定対象
     * @param {object} item DataItem/DataSkill
     * @return {boolean] itemの対象に出来る場合にはtrue, それ以外はfalse.
     */
    // eslint-disable-next-line no-unused-vars
    TargetManager.isTargetable = function(subject, target, item) {
        return _TargetManager_isTargetable.call(this, subject, target, item)
                && this.isReachTarget(subject, target, item);
    };

    /**
     * スキルまたはアイテムが相手に届くかどうかを得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {Game_Battler} target 判定対象
     * @param {object} item DataItem/DataSkill
     * @return {boolean] itemの対象に出来る場合にはtrue, それ以外はfalse.
     */
    TargetManager.isReachTarget = function(subject, target, item) {
        if ((subject.isActor() && target.isActor())
                || (subject.isEnemy() && target.isEnemy())) {
            // 同じパーティー内なら射程距離の判定はしない。
            return true;
        } else {
            // 敵対者の場合のみ判定する。
            const rangeDistance = subject.itemRangeDistance(item) - subject.battlePosition();
            return (target.battlePosition() <= rangeDistance);
        }
    };

    const _TargetManager_makeSelectableActionTargets = TargetManager.makeSelectableActionTargets;
    /**
     * subjectがitem を使用する時の、選択可能な対象を得る。
     * 
     * @param {Game_Battelr} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @returns {Array<Game_ActionTargetGroup>} 選択可能な対象
     */
    TargetManager.makeSelectableActionTargets = function(subject, item) {
        switch (subject.itemScope(item)) {
            case TargetManager.SCOPE_SELECTED_ROW_OPPONENTS:
            case TargetManager.SCOPE_RANDOME_1_OPPONENT_IN_ROW:
            case TargetManager.SCOPE_RANDOME_2_OPPONENTS_IN_ROW:
            case TargetManager.SCOPE_RANDOME_3_OPPONENTS_IN_ROW:
            case TargetManager.SCOPE_RANDOME_4_OPPONENTS_IN_ROW:
                return this.makeSelectableActionTargetsRowOpponents(subject, item);
            case TargetManager.SCOPE_FRONT_OPPONENTS:
            case TargetManager.SCOPE_RANDOME_1_OPPONENT_IN_FRONT_ROW:
            case TargetManager.SCOPE_RANDOME_2_OPPONENTS_IN_FRONT_ROW:
            case TargetManager.SCOPE_RANDOME_3_OPPONENTS_IN_FRONT_ROW:
            case TargetManager.SCOPE_RANDOME_4_OPPONENTS_IN_FRONT_ROW:
                return this.makeSelectableActionTargetsFrontOpponents(subject, item);
            case TargetManager.SCOPE_ALIVED_ROW_FRIENDS:
            case TargetManager.SCOPE_DEAD_ROW_FRIENDS:
            case TargetManager.SCOPE_ROW_FRIENDS:
                return this.makeSelectableActionTargetsRowFriends(subject, item);
            case TargetManager.SCOPE_ALIVED_FRONT_FRIENDS:
                return this.makeSelectableActionTargetsFrontFriends(subject, item);
            case TargetManager.SCOPE_ALIVED_SAME_ROW_FRIENDS:
                return this.makeSelectableActionTargetsSameRowFriends(subject, item);
            default:
                return _TargetManager_makeSelectableActionTargets.call(this, subject, item);
        }
    };

    /**
     * 敵1列を対象とする場合の選択可能な対象を得る。
     * 
     * @param {Game_Battelr} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @returns {Array<Game_ActionTargetGroup>} 選択可能な対象
     */
    TargetManager.makeSelectableActionTargetsRowOpponents = function(subject, item) {
        const selectable = [];

        const opponentMembers = this.opponentMembers(subject).filter(member => TargetManager.isTargetable(subject, member, item));
        for (let row = 0; row < 12; row++) {
            const rowMembers = opponentMembers.filter(member => member.battlePosition() === row);
            if (rowMembers.length === 0) {
                break;
            }
            const name = textTargetRowOpponents.format(row + 1);
            selectable.push(new Game_ActionTargetGroup(subject, row, name, rowMembers, rowMembers, true));
        }
        const friendMembers = this.friendMembers(subject);
        for (let row = 0; row < 12; row++) {
            const rowMembers = friendMembers.filter(member => member.battlePosition() === row);
            if (rowMembers.length === 0) {
                break;
            }

            const targetMembers = rowMembers.filter(member => TargetManager.isTargetable(subject, member, item));
            const name = textTargetRowFriends.format(row + 1);
            selectable.push(new Game_ActionTargetGroup(subject, row + 1000, name, targetMembers, targetMembers, false));
        }
        return selectable;
    };
    /**
     * 敵前衛を対象とする場合の選択可能な対象を得る。
     * 
     * @param {Game_Battelr} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @returns {Array<Game_ActionTargetGroup>} 選択可能な対象
     */
    TargetManager.makeSelectableActionTargetsFrontOpponents = function(subject, item) {
        const selectable = [];
        const scopeInfo = TargetManager.scopeInfo(subject.itemScope(item));

        {
            const opponentMembers = this.opponentMembers(subject).filter(member => TargetManager.isTargetable(subject, member, item));
            const rowMembers = opponentMembers.filter(member => member.battlePosition() === 0);
            if (rowMembers.length > 0) {
                selectable.push(new Game_ActionTargetGroup(subject, 0, scopeInfo.name, rowMembers, rowMembers, true));
            }
        }
        {
            const friendMembers = this.friendMembers(subject).filter(member => TargetManager.isTargetable(subject, member, item));
            const rowMembers = friendMembers.filter(member => member.battlePosition() === 0);
            if (rowMembers.length > 0) {
                selectable.push(new Game_ActionTargetGroup(subject, 1000, scopeInfo.name, rowMembers, rowMembers, false));
            }
        }
        return selectable;
    };
    /**
     * 味方1列を対象とする場合の選択可能な対象を得る。
     * 
     * @param {Game_Battelr} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @returns {Array<Game_ActionTargetGroup>} 選択可能な対象
     */
    TargetManager.makeSelectableActionTargetsRowFriends = function(subject, item) {
        const selectable = [];

        const friendMembers = this.friendMembers(subject);
        for (let row = 0; row < 12; row++) {
            const rowMembers = friendMembers.filter(member => member.battlePosition() === row);
            if (rowMembers.length === 0) {
                break;
            }
            const targetMembers = rowMembers.filter(member => TargetManager.isTargetable(subject, member, item));
            const name = textTargetRowFriends.format(row + 1);
            selectable.push(new Game_ActionTargetGroup(subject, row, name, targetMembers, targetMembers, true));
        }
        const opponentMembers = this.opponentMembers(subject).filter(member => TargetManager.isTargetable(subject, member, item));
        for (let row = 0; row < 12; row++) {
            const rowMembers = opponentMembers.filter(member => member.battlePosition() === row);
            if (rowMembers.length === 0) {
                break;
            }
            const name = textTargetRowOpponents.format(row + 1);
            selectable.push(new Game_ActionTargetGroup(subject, row + 1000, name, rowMembers, rowMembers, false));
        }
        return selectable;
    };

    /**
     * 味方前衛を対象とする場合の選択可能な対象を得る。
     * 
     * @param {Game_Battelr} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @returns {Array<Game_ActionTargetGroup>} 選択可能な対象
     */
    TargetManager.makeSelectableActionTargetsFrontFriends = function(subject, item) {
        const selectable = [];
        const scopeInfo = TargetManager.scopeInfo(subject.itemScope(item));

        {
            const friendMembers = this.friendMembers(subject).filter(member => TargetManager.isTargetable(subject, member, item));
            const rowMembers = friendMembers.filter(member => member.battlePosition() === 0);
            if (rowMembers.length > 0) {
                selectable.push(new Game_ActionTargetGroup(subject, 0, scopeInfo.name, rowMembers, rowMembers, true));
            }
        }
        {
            const opponentMembers = this.opponentMembers(subject).filter(member => TargetManager.isTargetable(subject, member, item));
            const rowMembers = opponentMembers.filter(member => member.battlePosition() === 0);
            if (rowMembers.length > 0) {
                selectable.push(new Game_ActionTargetGroup(subject, 1000, scopeInfo.name, rowMembers, rowMembers, false));
            }
        }
        return selectable;
    };
    /**
     * 味方同列を対象とする場合の選択可能な対象を得る。
     * 
     * @param {Game_Battelr} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @returns {Array<Game_ActionTargetGroup>} 選択可能な対象
     */
    TargetManager.makeSelectableActionTargetsSameRowFriends = function(subject, item) {
        const selectable = [];
        const scopeInfo = TargetManager.scopeInfo(subject.itemScope(item));

        const friendMembers = this.friendMembers(subject).filter(member => TargetManager.isTargetable(subject, member, item));
        const rowMembers = friendMembers.filter(member => member.battlePosition() === subject.battlePosition());
        selectable.push(new Game_ActionTargetGroup(subject, 0, scopeInfo.name, rowMembers, rowMembers, true));
        return selectable;
    };

    //------------------------------------------------------------------------------
    // Game_Action

    if (Game_Action.EFFECT_MOVE_BATTLE_POSITION) {
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
            if (effect.code === Game_Action.EFFECT_MOVE_BATTLE_POSITION) {
                const unit = target.friendsUnit();
                if (effect.dataId === 0) {
                    return unit.canMoveToFront(target.index());
                } else if (effect.dataId === 1) {
                    return unit.canMoveToRear(target.index());
                } else {
                    return false;
                }
            } else {
                return _Game_Action_testItemEffect.call(this, ...arguments);
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
            if (effect.code === Game_Action.EFFECT_MOVE_BATTLE_POSITION) {
                if ((this.subject().isActor() !== target.isActor())
                        && target.canBlockMoveBattlePosition()) {
                    // 敵対者からの移動効果は無効
                    return;
                }
                if (Math.random() < effect.value1) {
                    const unit = target.friendsUnit();
                    if (effect.dataId === 0) {
                        unit.moveToFront(target.index());
                        this.makeSuccess(target);
                    } else if (effect.dataId === 1) {
                        unit.moveToRear(target.index());
                        this.makeSuccess(target);
                    }
                }
            } else {
                _Game_Action_applyItemEffect.call(this, ...arguments);
            }
        };
    }

    /**
     * このアクションの射程距離を得る。
     * 
     * @returns {number} 射程距離
     */
    Game_Action.prototype.itemRangeDistance = function() {
        const item = this.item();
        if (item) {
            return this.subject().itemRangeDistance(item);
        } else {
            return -1;
        }
    };

    const _Game_Action_itemCnt = Game_Action.prototype.itemCnt;
    /**
     * このアクションに対するtargetのカウンター率を得る。
     * 
     * Note: 遠距離攻撃時はカウンター無効とするため、メソッドをフックする。
     * @param {Game_Battler} target ターゲット
     */
    Game_Action.prototype.itemCnt = function(target) {
        if (this.itemRangeDistance() > 1) {
            return 0;
        } else {
            return _Game_Action_itemCnt.call(this, target);
        }
    };
    //------------------------------------------------------------------------------
    // Game_System
    /**
     * 戦闘位置がサポートされているかどうかを返す。
     * 
     * @returns {boolean} 戦闘位置
     */
    Game_System.prototype.isBattlePositionSupported = function() {
        return true;
    };

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;

    /**
     * Game_BattlerBaseのパラメータを初期化する。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._battlePosition = 0; // 最前列
    };

    /**
     * 戦闘位置を設定する。
     * 
     * @param {number} position 戦闘位置
     */
    Game_BattlerBase.prototype.setBattlePosition = function(position) {
        this._battlePosition = position;
    };

    /**
     * 戦闘位置を取得する。
     * 
     * @returns {number} 戦闘位置
     */
    Game_BattlerBase.prototype.battlePosition = function() {
        return this._battlePosition;
    };

    /**
     * アイテムまたはスキルの射程距離を得る。
     * 
     * @param {object} item アイテム(DataITem)またはスキル(DataSkill)
     */
    Game_BattlerBase.prototype.itemRangeDistance = function(item) {
        if (this.isIgnoreRangeDistance()) {
            return Game_Action.RANGE_LONG; // 全射程
        }
        if (item.range >= 0) {
            return item.range;
        } else {
            return this.defaultRangeDistance(item);
        }
    };

    /**
     * このGame_Battlerが射程距離を無視するかどうかを取得する。
     * 
     * @returns {boolean} 射程距離を無視する場合にはtrue, それ以外はfalse.
     */
    Game_BattlerBase.prototype.isIgnoreRangeDistance = function() {
        if (Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE) {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE);
        } else {
            return false;
        }
    };

    /**
     * デフォルトレンジを得る。
     * 
     * @param {object} item アイテム(DataITem)またはスキル(DataSkill)
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.defaultRangeDistance = function(item) {
        return Game_Action.RANGE_SHORT;
    };

    /**
     * 通常攻撃射程を得る
     * 
     * @returns {number} 通常攻撃射程
     */
    Game_BattlerBase.prototype.attackRangeDistance = function() {
        const attackSkillId = this.attackSkillId();
        const attackSkill = $dataSkills[attackSkillId];
        return this.itemRangeDistance(attackSkill);
    };

    /**
     * 戦闘位置移動がブロックできるかどうかを取得する。
     * 
     * @returns {boolean} 戦闘位置移動がブロックできる場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.canBlockMoveBattlePosition = function() {
        if (Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION) {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION);
        } else {
            return false;
        }
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    /**
     * デフォルトレンジを得る。
     * 
     * @param {object} item アイテム(DataITem)またはスキル(DataSkill)
     */
    // eslint-disable-next-line no-unused-vars
    Game_Enemy.prototype.defaultRangeDistance = function(item) {
        const enemy = this.enemy();
        if (enemy) {
            return enemy.defaultRange;
        } else {
            return Game_Action.RANGE_SHORT;
        }
    };
    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * デフォルトレンジを得る。
     * 
     * @param {object} item アイテム(DataITem)またはスキル(DataSkill)
     */
    // eslint-disable-next-line no-unused-vars
    Game_Actor.prototype.defaultRangeDistance = function(item) {
        // 装備武器レンジを返す。
        const ranges = this.weapons().map(item => item.range);
        if (ranges.length > 0) {
            // 複数武器持っていたら、短いのに合わせる。
            // じゃないと届かないよね。
            return Math.min(...ranges);
        } else {
            const bareHandSkillId = this.attackSkillId();
            const bareHandSkill = $dataSkills[bareHandSkillId];
            if (bareHandSkill.range >= 0) {
                return bareHandSkill.range;
            } else {
                return Game_Action.RANGE_SHORT;
            }
        }
    };

    //------------------------------------------------------------------------------
    // Game_Unit
    /**
     * 指定されたインデックスのBattlerの戦闘ポジションを変更する。
     * 
     * @param {number} index インデックス番号
     * @param {number} newPosition 新しい位置。未指定時は現在の設定と切り替え。
     */
    Game_Unit.prototype.changeBattlePosition = function(index, newPosition) {
        const battler = this.members()[index];
        if (battler) {
            if (typeof newPosition === "undefined") {
                const currentPosition = battler.battlePosition();
                newPosition = (currentPosition > 0) ? 0 : 1;
            } 
            battler.setBattlePosition(newPosition);
            if ((newPosition > 0) && this.inBattle()) {
                // 後ろに下がった場合
                this.updateMembersBattlePosition();
            }
        }
    };

    /**
     * 前に移動可能かどうかを取得する。
     * 
     * @param {number} index メンバーのインデックス番号
     * @returns {boolean} 前に移動可能な場合にはtrue, それ以外はfalse
     */
    Game_Unit.prototype.canMoveToFront = function(index) {
        // aliveメンバーが全員前衛。
        const members = this.members();
        const member = members[index];
        if (member) {
            if (member.battlePosition() !== 0) {
                return true; // 指定したアクターは後衛。
            } else if (members.every(member => member.battlePosition() === 0)) {
                return true; // 全員前衛。
            }
        }
        return false;
    };

    /**
     * 前に出る。
     * 
     * @param {number} メンバーのインデックス番号
     */
    Game_Unit.prototype.moveToFront = function(index) {
        // Backと違ってこっちはちょっと面倒。
        if (this.canMoveToFront(index)) {
            const members = this.members();
            const member = members[index];
            if (member.battlePosition() !== 0) {
                // 指定されたアクターは後衛 -> 指定Battlerだけ前衛に移動。
                member.setBattlePosition(0);
            } else if (members.every(member => member.battlePosition() === 0)) {
                // 全員前衛時に前に出る -> 指定Battlerは前衛のままで、他は後衛に変更。
                for (let i = 0; i < members.length; i++) {
                    if (i != index) {
                        members[i].setBattlePosition(1);
                    }
                }
            }
        } 
    };

    /**
     * 後衛に移動可能かどうかを判定する。
     * 
     * @param {number} index メンバーのインデックス番号
     * @returns {boolean} 後ろに移動可能な場合にはtrue, それ以外はfalse
     */
    Game_Unit.prototype.canMoveToRear = function(index) {
        const member = this.members()[index];
        return (member && (member.battlePosition() === 0));
    };

    /**
     * 後退する。
     * 
     * @param {number} メンバーのインデックス番号
     */
    Game_Unit.prototype.moveToRear = function(index) {
        if (this.canMoveToRear(index)) {
            const member = this.members()[index];
            // 指定Battlerの位置を後ろに移動させて、
            // updateMembersBattlePosition()を呼ぶ。
            // すると、前衛がゼロになっていたら全員前衛に移動する。            
            member.setBattlePosition(1);
            this.updateMembersBattlePosition();
        }
    };

    /**
     * メンバーの戦闘位置を更新する。
     * 
     * 例えば前衛がゼロになったら、後衛を全部出すとかする。
     */
    Game_Unit.prototype.updateMembersBattlePosition = function() {
        if (this.frontAliveMembers().length === 0) {
            // 前衛がいなくなったら後衛を前衛に持ってくる。
            for (const member of this.rearMembers()) {
                member.setBattlePosition(0);
            }
        }
    };

    /**
     * 前衛のメンバーを得る。
     * 
     * @returns {Array<Game_Battler>} 前衛メンバー。
     */
    Game_Unit.prototype.frontMembers = function() {
        return this.members().filter(member => member.battlePosition() === 0);
    };

    /**
     * 前衛の生存メンバーを得る。
     * 
     * @returns {Array<Game_Battler>} 前衛メンバー。
     */
    Game_Unit.prototype.frontAliveMembers = function() {
        return this.aliveMembers().filter(member => member.battlePosition() === 0);
    };

    /**
     * 前衛の死亡メンバーを得る。
     * 
     * @returns {Array<Game_Battler>} 前衛メンバー
     */
    Game_Unit.prototype.frontDeadMembers = function() {
        return this.deadMembers().filter(member => member.battlePosition() === 0);
    };

    /**
     * 後衛のメンバーを得る。
     * 
     * @returns {Array<Game_Battler>} 後衛メンバー。
     */
    Game_Unit.prototype.rearMembers = function() {
        return this.members().filter(member => member.battlePosition() !== 0);
    };

    /**
     * 後衛の生存メンバーを得る。
     * 
     * @returns {Array<Game_Battler>} 後衛メンバー。
     */
    Game_Unit.prototype.rearAliveMembers = function() {
        return this.aliveMembers().filter(member => member.battlePosition() !== 0);
    };
    /**
     * 後衛の死亡メンバーを得る。
     * 
     * @returns {Array<Game_Battler>} 後衛メンバー。
     */
    Game_Unit.prototype.rearDeadMembers = function() {
        return this.deadMembers().filter(member => member.battlePosition() !== 0);
    };

    //------------------------------------------------------------------------------
    // Game_Troop
    const _Game_Troop_setup = Game_Troop.prototype.setup;
    /**
     * エネミーグループをセットアップする。
     * 
     * @param {number} troopId エネミーグループID
     */
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.call(this, troopId);
        const eventPage = this.getFirstTurnEventPage();
        if (eventPage) {
            for (let index = 0; index < eventPage.list.length; index++) {
                const eventData = eventPage.list[index];
                if ((eventData.code !== 108) && (eventData.code !== 408)) {
                    break;
                } else if (eventData.parameters[0].startsWith("#")) {
                    const note = eventData.parameters[0].substr(1).trim();
                    const preprocessParamLists = note.split(",").map(token => token.split(/ +/));
                    for (const preprocessParams of preprocessParamLists) {
                        this.doPreprocessSetting(preprocessParams)
                    }
                }
            }
        }
    };
    /**
     * ターン先頭のイベントページを得る。
     * 
     * @returns {object} ページデータ。該当ページが無い場合にはnull.
     */
    Game_Troop.prototype.getFirstTurnEventPage = function() {
        const troop = this.troop();
        for (let index = 0; index < troop.pages.length; index++) {
            const page = troop.pages[index];
            const conditions = page.conditions;
            if (conditions.turnValid && (conditions.turnA === 0) && (conditions.turnB === 0) && !conditions.turnEnding) {
                return page;
            }
        }

        return null;
    };
    /**
     * 戦闘開始前処理をする。
     * 
     * @param {Array<string>} params 
     */
    Game_Troop.prototype.doPreprocessSetting = function(params) {
        switch (params[0]) {
            case "SetBattlePosition":
                {
                    const id = Number(params[1]) || 0;
                    const position = Number(params[2]) || 0;
                    if (id > 0) {
                        const enemy = this.members()[id - 1];
                        if (enemy) {
                            enemy.setBattlePosition(position);
                        }
                    }
                }
                break;
        }
    };


    //------------------------------------------------------------------------------
    // BattleMamager
    const _BattleManager_endAction = BattleManager.endAction;
    /**
     * アクターまたはエネミーのアクションが完了したときの処理を行う。
     */
    BattleManager.endAction = function() {
        _BattleManager_endAction.call(this);

        // アクションが完了したら、
        // パーティー及びエネミーグループの戦闘位置を更新する。
        $gameParty.updateMembersBattlePosition();
        $gameTroop.updateMembersBattlePosition();
    };

    //------------------------------------------------------------------------------
    // Scene_Menu

    const _Scene_Menu_onFormationOk = Scene_Menu.prototype.onFormationOk;

    /**
     * Scene_Menuで、隊列変更操作にて、OK操作されたときの処理を行う。
     */
    Scene_Menu.prototype.onFormationOk = function() {
        const index = this._statusWindow.index();
        const pendingIndex = this._statusWindow.pendingIndex();
        if (pendingIndex == index) {
            $gameParty.changeBattlePosition(index);
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.redrawItem(index);
            this._statusWindow.activate();
        } else {
            _Scene_Menu_onFormationOk.call(this);
        }
    };
    //------------------------------------------------------------------------------
    // Scene_Battle
    const _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    /**
     * コマンドリストを作成する。
     */
    Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.call(this, ...arguments);
        if (this._actor) {
            const index = $gameParty.members().indexOf(this._actor);
            if (moveToFrontSkillId) {
                this.addCommand($dataSkills[moveToFrontSkillId].name, 
                    "moveToFront", $gameParty.canMoveToFront(index));
            }
            if (moveToRearSkillId) {
                this.addCommand($dataSkills[moveToRearSkillId].name,
                    "moveToRear", $gameParty.canMoveToRear(index));
            }
        }
    };

    //------------------------------------------------------------------------------
    // Scene_Battle

    const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;

    /**
     * アクターコマンドウィンドウを作成する。
     */
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.call(this);
        if (moveToFrontSkillId) {
            this._actorCommandWindow.setHandler("moveToFront", this.commandMoveToFront.bind(this));
        }
        if (moveToRearSkillId) {
            this._actorCommandWindow.setHandler("moveToRear", this.commandMoveToRear.bind(this));
        }
    };

    /**
     * moveToFront が選択された時の処理を行う。
     */
    Scene_Battle.prototype.commandMoveToFront = function() {
        const action = BattleManager.inputtingAction();
        action.setSkill(moveToFrontSkillId);
        this.onSelectAction();
    };

    /**
     * moveToRear が選択された時の処理を行う。
     */
    Scene_Battle.prototype.commandMoveToRear = function() {
        const action = BattleManager.inputtingAction();
        action.setSkill(moveToRearSkillId);
        this.onSelectAction();
    };



})();
