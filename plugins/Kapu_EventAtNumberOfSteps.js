/*:ja
 * @target MZ 
 * @plugindesc 歩数を元にコモンイベントを呼び出すプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command registerEvent
 * @text 歩数イベント登録
 * @desc 歩数イベントを登録する。
 * 
 * @arg id
 * @text 歩数イベントID
 * @desc 歩数イベントID
 * @type number
 * @default 0
 * 
 * @arg data
 * @text 歩数イベントデータ
 * @desc 歩数イベントデータ
 * @type struct<StepEvent>
 * @default {"commonEventId":"0","stepCount":"0","isOnce":"false","mapIds":"[]","switchId":"0","isWalk":"false","isInBoat":"false","isInShip":"false","isInAirship":"false"}
 * 
 * 
 * @command removeEvent
 * @text 歩数イベント削除
 * @desc 歩数イベントを削除する。
 * 
 * @arg id
 * @text 歩数イベントID
 * @desc 歩数イベントID
 * @type number
 * @default 0
 * 
 * 
 * @command getCounter
 * @text カウンタ値取得
 * @desc カウンタの値を取得する。
 * 
 * @arg id
 * @text 歩数イベントID
 * @desc 歩数イベントID
 * @type number
 * @default 0
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 格納する変数のID
 * @type variable
 * @default 0
 * 
 * @command gainCounter
 * @text カウンタ値加算
 * @desc カウンタの値を増減する。0～イベント歩数の範囲を超えることはない。
 * 
 * 
 * @arg id
 * @text 歩数イベントID
 * @desc 歩数イベントID
 * @type number
 * @default 0
 * 
 * @arg count
 * @text カウンタ増減値
 * @desc カウンタを増減する値。
 * @type number
 * @default 0
 * @min -9999
 * @max 9999
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 格納する変数のID。
 * @type variable
 * @default 0
 * 
 * 
 * @param initialEvents
 * @text 初期歩数イベント
 * @desc ゲームを最初から開始したときに、予めセットする歩数イベント。idは1から順に割り振られる。
 * @type struct<StepEvent>[]
 * @default []
 * 
 * @help 
 * 以下の機能を提供する。
 * ・所定の歩数を歩いたとき、指定されたコモンイベントを呼び出すことができる。
 * ・歩数イベントをプラグインコマンドにより動的に登録/削除できる。
 * ・歩数カウントは以下の条件でカウントアップを制御することができる。
 *      ・指定したマップの時
 *      ・指定したスイッチがONの時
 *      ・歩行中
 *      ・船乗船中
 *      ・大型船乗船中
 *      ・飛行船乗船中
 * ・イベント中(インタプリタ処理中)は歩数カウントは増減しない。
 * ・プラグインコマンドにより、イベントのための歩数カウントを取得することができる。
 * ・プラグインコマンドにより、イベントのための歩数カウントを増減することができる。
 * 
 * 
 * ■ 使用時の注意
 * 1歩移動する毎に処理が入るので、たくさん登録すると処理が重くなります。
 * 
 * ■ プラグイン開発者向け
 * $gamePlayer.stepEvent(id:number,onlyExists:boolean) : Game_StepEvent により、
 * 指定したIDの歩数イベントを取得出来ます。
 * $gamePlayer.removeStepEvent(id:number):void により
 * 指定したIDの歩数イベントを削除出来ます。
 * $gamePlayer.clearAllStepEvents():void により、
 * 全ての歩数イベントを削除できます。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 歩数イベント登録
 *   歩数イベントを登録する。
 * 
 * 歩数イベント削除
 *   歩数イベントを削除する。指定したIDのイベントが未登録の場合には何もしない。
 * 
 * カウンタ値取得
 *   指定したIDの歩数イベントについて、現在のカウンタ値を取得します。
 * 
 * カウンタ増減値
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */
/*~struct~StepEvent:
 *
 * @param commonEventId
 * @text コモンイベントID
 * @desc 呼び出すコモンイベントID  
 * @type common_event
 * @default 0
 * 
 * @param stepCountVariableId
 * @text 歩数条件(変数)
 * @desc 歩数条件を変数で与えます。イベント登録後、変数の値を変更しても反映されません。
 * @type variable
 * @default 0
 * 
 * @param stepCount
 * @text 歩数条件(固定値) 
 * @desc 歩数条件を固定値で与えます。変数指定が無い場合のみ有効。
 * @type number
 * @default 1
 * @min 0
 * 
 * @param isOnce
 * @text 1回のみ
 * @desc 歩数を満たしたとき、1回のみ呼び出す場合にはtrue, 0から再カウントする場合にはfalse.
 * @type boolean
 * @default false
 * 
 * 
 * @param mapIds
 * @text マップID条件
 * @desc マップIDが指定したものである時にカウントする。未指定時は条件判定しない。
 * @type number[]
 * @default []
 * 
 * @param switchId
 * @text スイッチ条件
 * @desc スイッチがONの時に歩数カウントする。未指定時は条件判定しない。
 * @type switch
 * @default 0
 * 
 * @param isWalk
 * @text 歩行時カウント
 * @desc 歩行/ダッシュ時に歩数カウントする。未指定時は条件判定しない。
 * @type boolean
 * @default false
 * 
 * @param isInBoat
 * @text 小型船乗船時カウント
 * @desc 小型船に乗船時に歩数カウントする。未指定時は条件判定しない。
 * @type boolean
 * @default false
 * 
 * @param isInShip
 * @text 船乗船時カウント
 * @desc 船に乗船時に歩数カウントする。未指定時は条件判定しない。
 * @type boolean
 * @default false
 * 
 * @param isInAirship
 * @text 飛行船乗船時カウント
 * @desc 飛行船に乗船時に歩数カウントする。未指定時は条件判定しない。
 * @type boolean
 * @default false
 */
/**
 * Game_StepEvent
 * 歩数イベント
 */
function Game_StepEvent() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_EventAtNumberOfSteps";
    const parameters = PluginManager.parameters(pluginName);

    /**
     * eventにeventDataが保持するパラメータをセットアップする。
     * 
     * @param {object} event イベント
     * @param {object} eventData イベントデータ
     */
    const _setupStepEvents = function(event, eventData) {
        const commonEventId = Number(eventData.commonEventId) || 0;
        const stepCountVariableId = Number(eventData.stepCountVariableId) || 0;
        const stepCount = (stepCountVariableId > 0) 
                ? $gameVariables.value(stepCountVariableId) : (Number(eventData.stepCount) || 0);
        const isOnce = (eventData.isOnce === undefined)
                ? false : (eventData.isOnce === "true");
        const mapIds = JSON.parse(eventData.mapIds).map(str => Number(str) || 0);
        const switchId = Number(eventData.switchId);
        const isWalk = (eventData.isWalk === undefined) ? false : (eventData.isWalk === "true");
        const isInBoat = (eventData.isInBoat === undefined) ? false : (eventData.isInBoat === "true");
        const isInShip = (eventData.isInShip === undefined) ? false : (eventData.isInShip === "true");
        const isInAirship = (eventData.isInAirship === undefined) ? false : (eventData.isInAirship === "true");
        event.setup(commonEventId, stepCount, isOnce);
        event.setMapIds(mapIds);
        event.setSwitchId(switchId);
        event.setWalk(isWalk);
        event.setInBoat(isInBoat);
        event.setInShip(isInShip);
        event.setInAirship(isInAirship);
    };

    PluginManager.registerCommand(pluginName, "registerEvent", args => {
        const id = Number(args.id) || 0;
        if ((id > 0) && args.data) {
            try {
                const event = $gamePlayer.stepEvent(id, false);
                if (event) {
                    const eventData = JSON.parse(args.data);
                    _setupStepEvents(event, eventData);
                }
            }
            catch (e) {
                console.error(e);
            }
        }
    });

    PluginManager.registerCommand(pluginName, "removeEvent", args => {
        const id = Number(args.id) || 0;
        if (id > 0) {
            $gamePlayer.removeStepEvent(id);
        }
    });

    PluginManager.registerCommand(pluginName, "getCounter", args => {
        const id = Number(args.id) || 0;
        const variableId = Number(args.variableId) || 0;
        if ((id > 0) && (variableId > 0)) {
            const event = $gamePlayer.stepEvent(id, true);
            const stepCount =  (event) ? event.stepCount() : 0;
            $gameVariables.setValue(variableId, stepCount);
        }
    });

    PluginManager.registerCommand(pluginName, "gainCounter", args => {
        const id = Number(args.id) || 0;
        if (id > 0) {
            const count = Number(args.count) || 0;
            const variableId = Number(args.variableId) || 0;
            const gainCount =  count + ((variableId > 0) ? $gameVariables.value(variableId) : 0);
            const event = $gamePlayer.stepEvent(id);
            if (event) {
                event.gainStepCount(gainCount);
            }
        }
        
    });
    //------------------------------------------------------------------------------
    // Game_StepEvent
    /**
     * Game_StepEventを初期化する。
     * 
     * @param {number} id ID番号
     */
    Game_StepEvent.prototype.initialize = function(id) {
        this._id = id;
        this._stepCount = 0; // 現在の歩数
        this._commonEventId = 0;
        this._commonEventReserved = false; // コモンイベントを呼び出したかどうか
        this._isOnce = false;
        this.clearCondition();
    };

    /**
     * ステップイベントIDを得る。
     * 
     * @returns {number} ID
     */
    Game_StepEvent.prototype.id = function() {
        return this._id;
    };

    /**
     * 現在の歩数を得る。
     * 
     * @returns {number} 歩数
     */
    Game_StepEvent.prototype.stepCount = function() {
        return this._stepCount;
    };

    /**
     * ステップカウントを増減させる。
     * 
     * @param {number} value 増減する値
     */
    Game_StepEvent.prototype.gainStepCount = function(value) {
        this._stepCount = (this._stepCount + value).clamp(0, this._condition.stepCount);
    };

    /**
     * 条件をクリアする。
     */
    Game_StepEvent.prototype.clearCondition = function() {
        this._condition = {
            stepCount : 0,
            mapIds : [],
            switchId : 0,
            isWalk : false,
            isInBoat : false,
            isInShip : false,
            isInAirship : false
        };
    };

    /**
     * セットアップする。
     * 
     * @param {number} commonEventId コモンイベントID
     * @param {number} stepCount ステップカウント
     * @param {boolean} isOnce 1回のみ呼び出しの場合にはtrue, それ以外はfalse.
     */
    Game_StepEvent.prototype.setup = function(commonEventId, stepCount, isOnce) {
        this.clearCondition();
        this._commonEventId = commonEventId;
        this._condition.stepCount = stepCount;
        this._isOnce = isOnce;
        this.resetCounter();
    };

    /**
     * カウンターをリセットする。
     */
    Game_StepEvent.prototype.resetCounter = function() {
        this._commonEventReserved = false;
        this._stepCount = 0;
    };

    /**
     * マップID条件を設定する。
     * 
     * @param {number} mapIds マップID
     */
    Game_StepEvent.prototype.setMapIds = function(mapIds) {
        this._condition.mapIds = mapIds;
        this.resetCounter();
    };
    /**
     * スイッチON時条件を設定する。
     * 
     * @param {number} switchId スイッチID
     */
    Game_StepEvent.prototype.setSwitchId = function(switchId) {
        if (this._condition.switchId !== switchId) {
            this._condition.switchId = switchId;
            this.resetCounter();
        }
    };
    /**
     * 歩行中カウントするかどうかを設定する。
     * 
     * @param {boolean} isWalk 歩行中カウントする場合にtrue, 
     */
    Game_StepEvent.prototype.setWalk = function(isWalk) {
        if (this._condition.isWalk !== isWalk) {
            this._condition.isWalk = isWalk;
            this.resetCounter();
        }
    };

    /**
     * 小型船乗船中にカウントするかどうかを設定する。
     * 
     * @param {boolean} isInBoat 小型船乗船中にカウントする場合にtrue
     */
    Game_StepEvent.prototype.setInBoat = function(isInBoat) {
        if (this._condition.isInBoat != isInBoat) {
            this._condition.isInBoat = isInBoat;
            this.resetCounter();
        }
    };

    /**
     * 船乗船中にカウントするかどうかを設定する。
     * 
     * @param {boolean} isInBoat 船乗船中にカウントする場合にtrue
     */
    Game_StepEvent.prototype.setInShip = function(isInShip) {
        if (this._condition.isInShip !== isInShip) {
            this._condition.isInShip = isInShip;
            this.resetCounter();
        }
    };

    /**
     * 飛行船乗船中にカウントするかどうかを設定する。
     * 
     * @param {boolean} isInBoat 飛行船乗船中にカウントする場合にtrue
     */
    Game_StepEvent.prototype.setInAirship = function(isInAirship) {
        if (this._condition.isInAirship !== isInAirship) {
            this._condition.isInAirship = isInAirship;
            this.resetCounter();
        }
    };

    /**
     * Game_StepEventを更新する。
     * 
     * Note： 所定の歩数になったら、設定されたコモンイベントを呼び出す。
     */
    Game_StepEvent.prototype.update = function() {
        if (this.isValid() && this.meetsStepCondition()) {
            if (!this._commonEventReserved) {
                this._stepCount++;
                if (this._stepCount >= this._condition.stepCount) {
                    $gameTemp.reserveCommonEvent(this._commonEventId);
                    this._commonEventReserved = true;
                    if (!this._isOnce) {
                        this.resetCounter();
                    }
                }
            } else {
                if (this._isOnce) {
                    this.clearCondition();
                    this._commonEventId = 0;
                    this._isOnce = false;
                }
            }
        }
    };

    /**
     * このイベントが有効かどうかを判定する。
     * 
     * @returns {boolean} 有効な場合にはtrue, それ以外はfalse.
     */
    Game_StepEvent.prototype.isValid = function() {
        return (this._condition.stepCount > 0) && (this._commonEventId > 0);
    };

    /**
     * 歩数加算条件を満たすかどうかを取得する。
     * 
     * @return {boolean} 条件を満たす場合にはtrue, それ以外はfalse.
     */
    Game_StepEvent.prototype.meetsStepCondition = function() {
        const condition = this._condition;
        if ((condition.mapIds.length > 0) && !condition.mapIds.includes($gameMap.id())) {
            return false; // マップIDが指定されたものでない。
        } else if (condition.switchId && !$gameSwitches.value(commonEvent.switchId)) {
            return false; // スイッチIDが指定されており、該当スイッチがOFF
        } else if (!this.meetsMoveTypeCondition()) {
            return false; // 移動タイプが一致しない。
        } else {
            return true;
        }
    }
    /**
     * 移動タイプによる歩数加算条件を満たすかどうかを取得する。
     * 
     * @returns {boolean} 条件を満たす場合にはtrue, それ以外はfalse.
     */
    Game_StepEvent.prototype.meetsMoveTypeCondition = function() {
        const condition = this._condition;
        if (condition.isWalk || condition.isInBoat || condition.isInShip || condition.isInAirship) {
            // いずれかの条件がセットされている。
            if ((condition.isWalk && !$gamePlayer.isInVehicle())
                    || (condition.isInBoat && $gamePlayer.isInBoat())
                    || (condition.isInShip && $gamePlayer.isInShip())
                    || (condition.isInAirship && $gamePlayer.isInAirship())) {
                return true;
            } else {
                return false;
            }
        } else {
            // いずれの条件もセットされていない。
            return true;
        }
    };

    //------------------------------------------------------------------------------
    // Game_Player

    const _Game_Player_initMembers = Game_Player.prototype.initMembers;
    /**
     * メンバーを初期化する。
     * 
     * Note: 基底クラスのコンストラクタから呼び出される。
     */
    Game_Player.prototype.initMembers = function() {
        _Game_Player_initMembers.call(this);
        this.initStepEvents();
    };

    /**
     * 歩数イベントを初期化する。
     * 
     * Note: プラグインパラメータで指定された歩数イベントもセットされる。
     */
    Game_Player.prototype.initStepEvents = function() {
        this._stepEvents = [];

        try {
            const eventEntries = JSON.parse(parameters["initialEvents"]).map(str => JSON.parse(str));
            for (let i = 0; i < eventEntries.length; i++) {
                const eventData = eventEntries[i];
                const id = i + 1;
                const event = this.stepEvent(id, false);
                _setupStepEvents(event, eventData);
            }
            _setupStepEvents
        }
        catch (e) {
            console.error(e);
        }
    };

    /**
     * 歩数イベントオブジェクトを得る。
     * 
     * @param {number} id ステップイベントID
     * @param {boolean} onlyExists イベントが存在する場合のみ取得する場合にはtrue, それ以外はfalse.
     * @returns {Game_StepEvent} 歩数イベントオブジェクト
     */
    Game_Player.prototype.stepEvent = function(id, onlyExists) {
        if (id > 0) {
            const eventEntry = this._stepEvents.find(stepEvent => stepEvent.id() === id);
            if (eventEntry) {
                return eventEntry;
            } else if (!onlyExists) {
                const newEventEntry = new Game_StepEvent(id);
                this._stepEvents.push(newEventEntry);
                return newEventEntry;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    /**
     * 歩数イベントを削除する。
     * 
     * @param {number} id ステップイベントID
     */
    Game_Player.prototype.removeStepEvent = function(id) {
        for (let i = 0; i < this._stepEvents.length; i++) {
            const eventEntry = this._stepEvents[i];
            if (eventEntry.id() === id) {
                this._stepEvents.splice(i, 1);
                break;
            }
        }
    };

    /**
     * 全ての歩数イベントを削除する。
     */
    Game_Player.prototype.clearAllStepEvents = function() {
        this._stepEvents = [];
    };

    const _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
    /**
     * 移動中でない場合の更新を行う。
     * 
     * @param {boolean} wasMoving 移動したかどうか
     * @param {boolean} sceneActive シーンがアクティブかどうか。
     */
    Game_Player.prototype.updateNonmoving = function(wasMoving, sceneActive) {
        _Game_Player_updateNonmoving.call(this, wasMoving, sceneActive);
        if (!$gameMap.isEventRunning() && wasMoving) {
            // 1歩移動したのでステップイベントを更新する。
            for (const stepEvent of this._stepEvents) {
                stepEvent.update();
            }
            // 無効なイベントデータは削除。
            for (let i = this._stepEvents.length - 1; i >= 0; i--) {
                if (!this._stepEvents[i].isValid()) {
                    this._stepEvents.splice(i, 1);
                }
            }
        }
    };

})();