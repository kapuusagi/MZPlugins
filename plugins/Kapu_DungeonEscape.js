/*:ja
 * @target MZ 
 * @plugindesc ダンジョンエスケーププラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @command registerEscapePosition
 * @text 地点登録
 * @desc エスケープ位置を登録する。既に登録済みの場合には上書きする。
 * 
 * @arg id
 * @text 登録地点ID
 * @desc 登録地点を表すユニークな番号。（1以上の値を指定する)
 * @type number
 * @default 0
 * 
 * @arg mapId
 * @text マップID.未指定時(0)は現在のマップID
 * @type number
 * @default 0
 * 
 * @arg x
 * @text x位置
 * @desc x位置。未指定時は現在のマップ位置
 * @type number
 * @default -1
 * @min -1
 * 
 * @arg y
 * @type number
 * @text y位置
 * @desc y位置。未指定時は現在のマップ位置
 * @default -1
 * @min -1 * 
 * 
 * @command clearEscapePosition
 * @text エスケープ地点クリア
 * @desc エスケープ地点をクリアする。ダンジョンから出たときなどに使用する。エスケープ実行時にクリアされる。
 * 
 * @command escape
 * @text エスケープ実行
 * @desc プラグインパラメータで格納した地点にエスケープ位置を格納する。未登録状態の場合、マップID格納変数に0が格納される。
 * 
 * @arg callCommonEvent
 * @text コモンイベントを呼び出す。
 * @desc プラグインパラメータで指定しているコモンイベントを呼び出す。
 * @type boolean
 * @default true
 * 
 * @param mapVariableId
 * @text マップID格納変数
 * @desc マップIDを格納する変数。
 * @type variable
 * @default 0
 * 
 * @param xVariableId
 * @text x位置格納変数
 * @desc x位置を格納する変数
 * @type variable
 * @default 0
 * 
 * @param yVariableId
 * @text y位置格納変数
 * @desc y位置を格納する変数
 * @type variable
 * @default 0
 * 
 * @param commonEventId
 * @text コモンイベントID
 * @desc エスケープ実行時に呼び出すコモンイベントID
 * @type common_event
 * @default 0
 * 
 * @param effectCode
 * @text エスケープエフェクトコード
 * @desc エスケープ効果を割り当てるエフェクトコード。
 * @type number
 * @default 111
 * @min 4
 * 
 * @param escapeCondition
 * @text エスケープ条件
 * @desc エスケープ可能かどうかを判定する条件式。evalで評価される。$gameSwitches.value(no)などを指定する。
 * @type string
 * @default
 * 
 * 
 * @help 
 * 某リレ○トみたいなのを実現する。
 * プラグインコマンドで復帰場所を保存し、
 * プラグインコマンド又はアイテム/スキル使用時の効果で復帰させると、保存場所に戻れる。
 * (戻る処理自体はコモンイベントなどで実装する必要がある。)
 * 
 * 
 * ルー○と違ってスクリプトでも容易に実現可能なんだけれど、
 * せっかくFastTravelプラグインを作ったのでこちらも実装することにした。
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
 * アイテム/スキル
 *   <effectDungeonEscape>
 *     ダンジョンエスケープ効果を付与する。
 * 
 * 
 * マップ
 *   <canUseEscape>
 *     エスケープ効果のアイテム/スキルを使用可能とする。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_DungeonEscape";
    const parameters = PluginManager.parameters(pluginName);
    const mapVariableId = Math.round(Number(parameters["mapVariableId"]) || 0);
    const xVariableId = Math.round(Number(parameters["xVariableId"]) || 0);
    const yVariableId = Math.round(Number(parameters["yVariableId"]) || 0);
    const commonEventId = Math.round(Number(parameters["commonEventId"]) || 0);
    const escapeCondition = parameters["escapeCondition"] || "";

    Game_Action.EFFECT_DUNGEONESCAPE = Math.round(Number(parameters["effectCode"]) || 0);
    if (!Game_Action.EFFECT_DUNGEONESCAPE) {
        console.error(pluginName + ":EFFECT_DUNGEONESCAPE is not valid.");
    }
    if (mapVariableId <= 0) {
        console.error(pluginName + ":mapVariableId is incorrect. id=" + mapVariableId);
    }
    if (xVariableId <= 0) {
        console.error(pluginName + ":xVariableId is incorrect. id=" + xVariableId);
    }
    if (yVariableId <= 0) {
        console.error(pluginName + ":yVariableId is incorrect. id=" + yVariableId);
    }
    if (commonEventId <= 0) {
        console.error(pluginName + ":commonEventId is incorrect. id=" + commonEventId);
    }


    PluginManager.registerCommand(pluginName, "registerEscapePosition", args => {
        const mapId = Number(args.mapId) || $gameMap.mapId();
        const x = (Number(args.x) >= 0) ? Number(args.x) : $gamePlayer.x;
        const y = (Number(args.y) >= 0) ? Number(args.y) : $gamePlayer.y;
        $gameParty.setEscapePosition(mapId, x, y);
    });

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "clearEscapePosition", args => {
        $gameParty.clearEscapePosition();
    });

    PluginManager.registerCommand(pluginName, "escape", args => {
        const callCommonEvent = (args.callCommonEvent === undefined)
                ? true : (args.callCommonEvent === "true");
        $gameParty.restoreEscapePosition();
        $gameParty.clearEscapePosition();
        if (callCommonEvent && (commonEventId > 0)) {
            $gameTemp.reserveCommonEvent(this._commonEventId);
        }
    });

    //-------------------------------------------------------------------------
    // DataManager
    if (Game_Action.EFFECT_DUNGEONESCAPE) {
        /**
         * ノートタグを処理する。
         * 
         * @param {Object} obj データ
         */
         const _processNoteTag = function(obj) {
            if (obj.meta.effectDungeonEscape) {
                obj.effects.push({
                    code: Game_Action.EFFECT_DUNGEONESCAPE,
                    dataId: 0,
                    value1: 0,
                    value2: 0
                });
            }
        };
        DataManager.addNotetagParserItems(_processNoteTag);
        DataManager.addNotetagParserSkills(_processNoteTag);
    }



    //------------------------------------------------------------------------------
    // Game_Party
    const _Game_Party_initialize = Game_Party.prototype.initialize;
    /**
     * Game_Partyを初期化する。
     */
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.call(this);
        this._escapePosition = [];
    };

    /**
     * エスケープ位置を設定する。
     * 
     * @param {Number} mapId マップID
     * @param {Number} x x位置
     * @param {Number} y ｙ位置
     */
    Game_Party.prototype.setEscapePosition = function(mapId, x, y) {
        this._escapePosition[0] = mapId;
        this._escapePosition[1] = x;
        this._escapePosition[2] = y;
    };

    /**
     * エスケープ位置をクリアする。
     */
    Game_Party.prototype.clearEscapePosition = function() {
        this._escapePosition = [];
    };

    /**
     * エスケープ位置を変数に復帰させる。
     */
    Game_Party.prototype.restoreEscapePosition = function() {
        if (mapVariableId > 0) {
            const mapId = this._escapePosition[0] || 0;
            $gameVariables.setValue(mapVariableId, mapId);
        }
        if (xVariableId > 0) {
            const x = this._escapePosition[1] || -1;
            $gameVariables.setValue(xVariableId, x);
        }
        if (yVariableId > 0) {
            const y = this._escapePosition[2] || -1;
            $gameVariables.setValue(yVariableId, y);
        }
    };
    //------------------------------------------------------------------------------
    // Game_Map
    /**
     * エスケープ可能かどうかを得る。
     * 
     * @returns {Boolean} エスケープ可能な場合にはtrue, それ以外はfalse.
     */
     Game_Map.prototype.canUseEscape = function() {
        if ($dataMap.meta.canUseEscape) {
            return this.testEscapeCondition();
        } else {
            return false;
        }
    };
    /**
     * エスケープ条件をテストする。
     * 
     * @returns {Boolean} エスケープ条件
     */
    Game_Map.prototype.testEscapeCondition = function() {
        if (escapeCondition) {
            try {
                return eval(escapeCondition);
            }
            catch (e) {
                console.log(e);
                return false;
            }
        } else {
            return true; // 未指定時は許可
        }
    };
    //------------------------------------------------------------------------------
    // Game_Action
    // 
    if (Game_Action.EFFECT_DUNGEONESCAPE) {
        const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
        /**
         * 効果を適用可能かどうかを判定する。
         * codeに対応する判定処理が定義されていない場合、適用可能(true)が返る。
         * 
         * @param {Game_BattlerBase} target 対象
         * @param {DataEffect} effect エフェクトデータ
         * @returns {Boolean} 適用可能な場合にはtrue, それ以外はfalse
         */
        Game_Action.prototype.testItemEffect = function(target, effect) {
            if (effect.code === Game_Action.EFFECT_DUNGEONESCAPE) {
                // 戦闘中以外かつ、現在のマップがエスケープ可能
                return !$gameParty.inBattle() && $gameMap.canUseEscape();
            } else {
                return _Game_Action_testItemEffect.call(this, target, effect);
            }
        };


    }
    //------------------------------------------------------------------------------
    // Scene_ItemBase
    // 
    if (Game_Action.EFFECT_DUNGEONESCAPE) {
        const _Scene_ItemBase_determineItem = Scene_ItemBase.prototype.determineItem;
        /**
         * アイテム選択で決定操作されたときの処理を行う。
         */
        Scene_ItemBase.prototype.determineItem = function() {
            const item = this.item();
            if (item.effects.some((effect) => effect.code === Game_Action.EFFECT_DUNGEONESCAPE)) {
                if (!$gameParty.inBattle() && $gameMap.canUseEscape()) {
                    // 使用可能な状態 -> シーン呼び出しする。
                    // コモンイベントを呼び出して終わり。
                    this.useDungeonEscapeItem();
                } else {
                    SoundManager.playBuzzer();
                    this.activateItemWindow();
                }
            } else {
                _Scene_ItemBase_determineItem.call(this);
            }
        };

        /**
         * ダンジョンエスケープ効果のあるアイテムを使用する。
         */
        Scene_ItemBase.prototype.useDungeonEscapeItem = function() {
            this.playSeForItem();
            this.user().useItem(this.item());
            $gameParty.restoreEscapePosition();
            if (commonEventId) {
                $gameTemp.reserveCommonEvent(commonEventId);
            }
            this.checkCommonEvent();
        };
    }

})();