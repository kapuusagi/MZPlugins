/*:ja
 * @target MZ 
 * @plugindesc ファストトラベル機能用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @command registerTravelPosition
 * @text 地点登録
 * @desc ファストトラベル位置を登録する。既に登録済みの場合には上書きする。
 * 
 * @arg id
 * @text 登録地点ID
 * @desc 登録地点を表すユニークな番号。（1以上の値を指定する)
 * @type number
 * @default 0
 * 
 * @arg name
 * @text 表示名。未指定時は現在のマップ名
 * @type string
 * @default
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
 * @min -1
 * 
 * @arg condition
 * @text 移動可能条件
 * @desc 移動可能条件として評価する式。evalで評価される。未指定時は移動許可。$gameSwitches.value(12)などで、所定のスイッチがONかどうかを使用出来る。
 * @type string
 * @default
 * 
 * @arg overwrite
 * @text 登録済みの場合に上書きする
 * @desc 既に同ID情報が登録済みの場合に上書きする場合にはtrue, 上書きしない場合はfalse
 * @type boolean
 * @default false
 * 
 * @arg enableToActor
 * @text パーティーメンバーに移動可能を設定する。
 * @desc 現在のパーティーメンバーに移動可能をセットします。
 * @type boolean
 * @default true
 * 
 * @command removeFastTravelPosition
 * @text 地点削除
 * @desc ファストトラベル地点を削除する。地形が変わって移動出来なくなった場合などに使用する。
 * 
 * @arg id
 * @text ファストトラベル地点ID指定
 * @desc IDで指定する場合。
 * 
 * @arg name
 * @text ファストトラベル地点名前指定
 * @desc 名前で指定する場合
 * 
 * 
 * @command setFastTravelPositionEnable
 * @text アクターのファストトラベル位置有効/無効設定
 * @desc 指定アクターのファストトラベル位置を有効または無効化する。
 * 
 * @arg id
 * @text ファストトラベル地点ID指定
 * @desc IDで指定する場合。
 * 
 * @arg name
 * @text ファストトラベル地点名前指定
 * @desc 名前で指定する場合
 * 
 * @arg target
 * @text 対象
 * @desc 有効/無効を設定する
 * @type select
 * @default partyMembers
 * @option 指定したアクター
 * @value actor
 * @optin パーティーメンバー全員
 * @value partyMembers
 * @option 存在する全てのキャラクター
 * @value allActors
 * 
 * @arg actorId
 * @text 対象のアクター
 * @desc 対象のアクター。対象を指定したアクターにした場合のみ有効
 * @type actor
 * @default 0
 * 
 * @arg variableId
 * @text 対象のアクター(変数指定)
 * @desc 対象のアクターを変数で指定する。対象を指定したアクターにした場合のみ有効
 * @type variable
 * @default 0
 * 
 * @arg enabled
 * @text 有効にする
 * @desc 有効にする場合にはtrue, 無効にする場合にはfalse
 * @type boolean
 * @default true
 * 
 * 
 * @command selectFastTravelPosition
 * @text ファストトラベル位置選択
 * @desc ファストトラベル位置を選択する。選択された位置は、プラグインパラメータで与えた変数に格納される。
 * 
 * @arg callCommonEvent
 * @text コモンイベントを呼び出す
 * @desc 選択完了時にコモンイベントを呼び出す。
 * @type boolean
 * @default false
 * 
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
 * @desc 選択完了時に呼び出すコモンイベントID
 * @type common_event
 * @default 0
 * 
 * @param effectCode
 * @text ファストトラベルエフェクトコード
 * @desc ファストトラベル効果を割り当てるエフェクトコード。
 * @type number
 * @default 110
 * @min 4
 * 
 * @param fastTravelCondition
 * @text ファストトラベル条件
 * @desc ファストトラベル可能かどうかを判定する条件式。evalで評価される。$gameSwitches.value(no)などを指定する。
 * @type string
 * @default
 * 
 * @help 
 * ファストトラベルに必要な、「地点登録」と「地点選択」を行う機能を追加します。
 * 実際の移動処理はカスタマイズしたいので、地点選択はマップID/座標を変数に格納し、
 * 指定されたコモンイベントを呼び出すものとしています。
 * 
 * 
 * ファストトラベル可否条件はパーティーメンバー個別に保持されます。
 * ファストトラベル位置情報はパーティ自体が保持します。
 * 
 * 
 * 
 * ■ 使用時の注意
 * プラグインコマンド「ファストトラベル位置選択」はマップイベントからの呼び出しを想定しており、
 * 無条件で選択画面が表示されます。
 * そのため、ファストトラベル不可マップでも使用できてしまいます。
 * 
 * ■ プラグイン開発者向け
 * ファストトラベル位置オブジェクト
 * {
 *    id : {number} 1以上の管理インデックスです。
 *    name : {string} 識別名(選択対象として表示されます。)
 *    mapId : {number} マップID
 *    x : {number} x位置
 *    y : {number} y位置
 *    condition : {string} 移動可能条件(eval()で評価されます)
 * }
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 戦闘中に呼び出してもファストトラベル先選択は出来ません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム/スキル
 *   <effectFastTravel>
 *      アイテム使用時の効果として、ファストトラベル効果を与える。
 *      ファストトラベル先選択時、プラグインパラメータで指定したコモンイベントが呼び出される。
 *   <effectFastTravel:id#>
 *      アイテム使用時の効果として、ファストトラベル効果を与える。
 *      ファストトラベル先選択時、id#で指定したコモンイベントが呼び出される。
 * 
 * マップ
 *   <canUseFastTravel>
 *      ファストトラベル使用可能マップ。別途プラグインパラメータのfastTravelConditionが評価される。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */
/**
 * ファストトラベル選択ウィンドウ
 */
function Window_FastTravelList() {
    this.initialize(...arguments);
}

/**
 * ファストトラベル位置選択シーン
 */
function Scene_SelectFastTravelPosition() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_FastTravel";
    const parameters = PluginManager.parameters(pluginName);
    const mapVariableId = Math.round(Number(parameters["mapVariableId"]) || 0);
    const xVariableId = Math.round(Number(parameters["xVariableId"]) || 0);
    const yVariableId = Math.round(Number(parameters["yVariableId"]) || 0);
    const commonEventId = Math.round(Number(parameters["commonEventId"]) || 0);
    const fastTravelCondition = parameters["fastTravelCondition"] || "";

    Game_Action.EFFECT_FASTTRAVEL = Math.round(Number(parameters["effectCode"]) || 0);
    if (!Game_Action.EFFECT_FASTTRAVEL) {
        console.error(pluginName + ":EFFECT_FASTTRAVEL is not valid.");
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
        console.log(pluginName + ":commonEventId is incorrect. id=" + commonEventId);
    }

    PluginManager.registerCommand(pluginName, "registerTravelPosition", args => {
        const id = Math.round(Number(args.id));
        if (id > 0) {
            const overwrite = (args.overwrite === undefined) ? false : (args.overwrite === "true");
            if (overwrite && $gameParty.isFastTravelPositionRegistered(id)) {
                // 既に登録済み。
                return ;
            } else {
                // 未登録
                const mapId = Number(args.mapId) || $gameMap.mapId();
                const name = args.name || $gameMap.displayName();
                const x = (Number(args.x) >= 0) ? Number(args.x) : $gamePlayer.x;
                const y = (Number(args.y) >= 0) ? Number(args.y) : $gamePlayer.y;
                const condition = args.condition || "";
                $gameParty.registerFastTravelPosition({
                    id : id,
                    mapId : mapId,
                    name: name,
                    x: x,
                    y: y,
                    condition: condition
                });
            }

            const enableToActor = (args.enableToActor === undefined) ? true : (args.enableToActor === "true");
            if (enableToActor) {
                $gameParty.setFastTravelPositionEnable(id, true);
            }
        }
    });

    const _parseTravelPointNo = function(args) {
        const name = args.name || "";
        if (name) {
            const entry = $gameParty.fastTravelPositions().find(entry => entry.name === name);
            if (entry) {
                return entry.id;
            }
        }
        return Math.round(NUmber(args.id) || 0);
    };

    PluginManager.registerCommand(pluginName, "removeFastTravelPosition", args => {
        const id = _parseTravelPointNo(args);
        if (id > 0) {
            $gameParty.unregisterFastTravelPosition(id);
        }
    });

    const _parseActorId = function(args) {
        const variableId = Number(args.variableId);
        if (variableId > 0) {
            const id = $gameVariables.value(variableId);
            if ((id > 0) && (id < $dataActors.length)) {
                return id;
            }
        } else {
            return Number(args.actorId);
        }
    }

    PluginManager.registerCommand(pluginName, "setFastTravelPositionEnable", args => {
        const id = _parseTravelPointNo(args);
        if (id > 0) {
            const enabled = (args.enabled === undefined) ? true : (args.enabled === "true");
            switch (args.target) {
                case "actor":
                    {
                        const actorId = _parseActorId(args);
                        const actor = $gameActors.actor(actorId);
                        if (actor) {
                            actor.setFastTravelPositionEnable(id, enabled);
                        }
                    }
                    break;
                case "partyMembers":
                    $gameParty.setFastTravelPositionEnable(id, enabled);
                    break;
                case "allActors":
                    $gameActors.setFastTravelPositionEnable(id, enabled);
                    break;
            }

        }

    });

    PluginManager.registerCommand(pluginName, "selectFastTravelPosition", args => {
        const callCommonEvent = (args.callCommonEvent === undefined)
            ? false : (args.callCommonEvent === "true");
        const eventId = (callCommonEvent) ? commonEventId : 0;

        SceneManager.push(Scene_SelectFastTravelPosition);
        SceneManager.prepareNextScene($gameParty.allMembers(), mapVariableId, xVariableId, yVariableId, eventId, null);
    });



    //-------------------------------------------------------------------------
    // DataManager
    if (Game_Action.EFFECT_FASTTRAVEL) {
        /**
         * ノートタグを処理する。
         * 
         * @param {object} obj データ
         */
         const _processNoteTag = function(obj) {
            if (obj.meta.effectFastTravel) {
                const eventId = (typeof obj.meta.effectFastTravel === "boolean")
                        ? commonEventId : Number(obj.meta.effectFastTravel);
                obj.effects.push({
                    code: Game_Action.EFFECT_FASTTRAVEL,
                    dataId: eventId,
                    value1: 0,
                    value2: 0
                });
            }
        };
        DataManager.addNotetagParserItems(_processNoteTag);
        DataManager.addNotetagParserSkills(_processNoteTag);
    }

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._fastTravelPositions = [];
    };

    /**
     * 移動可能位置の移動可否を設定する。
     * 
     * @param {number} travelPositionId 移動位置番号
     * @param {boolean} enabled 移動可能な場合にはtrue
     */
    Game_Actor.prototype.setFastTravelPositionEnable = function(travelPositionId, enabled) {
        this._fastTravelPositions[travelPositionId] = enabled;
    };

    /**
     * ファストトラベル位置への移動可否を設定する。
     * 
     * @param {number} travelPositionId 移動位置番号
     * @returns {boolean} 移動
     */
    Game_Actor.prototype.canFastTravel = function(travelPositionId) {
        return this._fastTravelPositions[travelPositionId] || false;
    };

    if (Game_Action.EFFECT_FASTTRAVEL) {
        const _Game_Actor_meetsUsableItemConditions = Game_Actor.prototype.meetsUsableItemConditions;
        /**
         * 使用可能な条件かどうかを判定する。
         * 
         * @param {object} item DataItem/DataSkill
         * @returns {boolean} 使用可能な場合にはtrue, それ以外はfalse.
         */
        Game_Actor.prototype.meetsUsableItemConditions = function(item) {
            if (this.testFastTravel(item) && !$gameParty.canPerformFastTravel()) {
                // ファストトラベル効果があって、戦闘中かファストトラベル出来ないマップにいる。
                if (item.effects.length === 1) {
                    // ファストトラベル効果しかない。
                    return false;
                }
            }
            return _Game_Actor_meetsUsableItemConditions.call(this, item);
        };
    
        /**
         * itemで指定されるアイテムまたはスキルがファストトラベル効果を持つかどうかを得る。
         * 
         * @param {object} item DataItem/DataSkill
         * @returns {boolean} ファストトラベル効果がある場合にはtrue, それ以外はfalse.
         */
        Game_Actor.prototype.testFastTravel = function(item) {
            return item.effects.some(
                effect => effect && effect.code === Game_Action.EFFECT_FASTTRAVEL
            );
        };
    }
    //------------------------------------------------------------------------------
    // Game_Party
    const _Game_Party_initialize = Game_Party.prototype.initialize;
    /**
     * Game_Partyを初期化する。
     */
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.call(this);
        this._fastTravelPositions = [];
    };

    /**
     * ファストトラベル可能かどうかを判定する。
     * 
     * @returns {boolean} ファストトラベル可能な場合にはtrue, それ以外はfalse.
     */
    Game_Party.prototype.canPerformFastTravel = function() {
        return !$gameParty.inBattle() & $gameMap.canUseFastTravel();
    };

    /**
     * ファストトラベル位置を登録する。
     * 
     * @param {object} travelPosition ファストトラベル位置情報
     */
    Game_Party.prototype.registerFastTravelPosition = function(travelPosition) {
        if (travelPosition.id > 0) {
            this._fastTravelPositions[travelPosition.id] = travelPosition;
        }
    };

    /**
     * パーティーメンバーのファストトラベル位置への移動可否を設定する。
     * 
     * @param {number} travelPosition ファストトラベル位置No
     * @param {boolean} enabled ファストトラベル可能かどうか
     */
    Game_Party.prototype.setFastTravelPositionEnable = function(travelPosition, enabled) {
        this.allMembers().forEach(member => member.setFastTravelPositionEnable(travelPosition, enabled));
    };

    /**
     * ファストトラベル位置を削除する。
     * 
     * @param {object} travelPositionId ファストトラベル位置No
     */
    Game_Party.prototype.unregisterFastTravelPosition = function(travelPositionId) {
        if (travelPositionId > 0) {
            delete this._fastTravelPositions[travelPositionId];
        }
    };

    /**
     * 指定ＩＤのファストトラベル位置が登録済みかどうかを得る。
     * 
     * @param {number} travelPositionId ファストトラベル位置No
     * @returns {boolean} 登録済みの場合にはtrue, それ以外はfalse
     */
    Game_Party.prototype.isFastTravelPositionRegistered = function(travelPositionId) {
        return ((travelPositionId > 0) && this._fastTravelPositions[travelPositionId]) ? true : false;
    };

    /**
     * ファストトラベル位置一覧を得る。
     * 
     * @returns {Array<Object>} ファストトラベル位置一覧
     */
    Game_Party.prototype.fastTravelPositions = function() {
        const travelPositions = [];
        for (const travelPosition of this._fastTravelPositions) {
            if (travelPosition) {
                travelPositions.push(travelPosition);
            }
        }
        return travelPositions;
    };


    /**
     * ファストトラベル位置への移動が可能かどうかを判定する。
     * 
     * @param {number} travelPositionId ファストトラベル位置No
     */
    Game_Party.prototype.canFastTravel = function(travelPositionId) {
        return this._allMembers().some(member => member.canFastTravel(travelPositionId));
    };

    //------------------------------------------------------------------------------
    // Game_Actors
    /**
     * 既存メンバーのファストトラベル位置への移動可否を設定する。
     * 
     * @param {number} travelPosition ファストトラベル位置No
     * @param {boolean} enabled ファストトラベル可能かどうか
     */
    Game_Actors.prototype.setFastTravelPositionEnable = function(travelPosition, enabled) {
        for (const actor of this._data) {
            if (actor) {
                actor.setFastTravelPositionEnable(travelPosition, enabled);
            }
        }
    };

    //------------------------------------------------------------------------------
    // Game_Map
    /**
     * ファストトラベル可能かどうかを得る。
     * 
     * @returns {boolean} ファストトラベル可能な場合にはtrue, それ以外はfalse.
     */
    Game_Map.prototype.canUseFastTravel = function() {
        if ($dataMap.meta.canUseFastTravel) {
            return this.testFastTravelCondition();
        } else {
            return false;
        }
    };
    /**
     * ファストトラベル条件をテストする。
     * 
     * @returns {boolean} ファストトラベル条件
     */
    Game_Map.prototype.testFastTravelCondition = function() {
        if (fastTravelCondition) {
            try {
                return eval(fastTravelCondition);
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
    // Window_FastTravelList
    Window_FastTravelList.prototype = Object.create(Window_Selectable.prototype);
    Window_FastTravelList.prototype.constructor = Window_FastTravelList;

    /**
     * Window_FastTravelListを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_FastTravelList.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._fastTravelPositions = [];
        this._actors = [];
    };

    /**
     * ファストトラベル位置を設定する。
     * 
     * @param {Array<Object>} positions 位置
     */
    Window_FastTravelList.prototype.setFastTravelPositions = function(positions) {
        this._fastTravelPositions = positions;
        this.refresh();
    };


    /**
     * 対象のアクター一覧を設定するう。
     * 
     * @param {Array<Game_Actor>} actors アクター一覧
     */
    Window_FastTravelList.prototype.setActors = function(actors) {
        this._actors = actors;
        this.refresh();
    }

    /**
     * 選択されているアイテムを得る。
     * 
     * @returns {object} 選択されているアイテム。
     */
    Window_FastTravelList.prototype.item = function() {
        return this.itemAt(this.index());
    };

    /**
     * indexで指定された項目を得る。
     * 
     * @param {number} index インデックス番号
     * @returns {object} 項目。indexが範囲外の場合にはnull.
     */
    Window_FastTravelList.prototype.itemAt = function(index) {
        return ((index >= 0) && (index < this._fastTravelPositions.length)) ? this._fastTravelPositions[index] : null;
    };

    /**
     * 項目数を得る。
     * 
     * @returns {number} 項目数。
     */
    Window_FastTravelList.prototype.maxItems = function() {
        return this._fastTravelPositions.length;
    };
    /**
     * 現在の選択が選択可能かどうかを取得する。
     * 
     * @returns {boolean} 選択可能な場合にはture, 選択不可な場合にはfalse
     */
    Window_FastTravelList.prototype.isCurrentItemEnabled = function() {
        const item = this.itemAt(this.index());
        return (item) ? this.isEnabled(item) : false;
    };

    /**
     * indexで指定される項目が有効かどうかを判定する。
     * 
     * @param {object} item 項目
     * @returns {boolean} 有効な場合にはtrue, それ以外はfalse
     */
    Window_FastTravelList.prototype.isEnabled = function(item) {
        if (this._actors.length > 0) {
            return this._actors.some(a => a.canFastTravel(item.id));
        } else {
            return true;
        }
    };

    /**
     * 項目を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_FastTravelList.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        if ((index >= 0) && (index < this._fastTravelPositions.length)) {
            const ftp = this._fastTravelPositions[index];
            const canTravel = (this._actors.length > 0)
                    ? this._actors.some(a => a.canFastTravel(ftp.id)) : true;
            this.changePaintOpacity(canTravel);
            this.drawText(ftp.name, rect.x, rect.y, rect.width, "left");
            this.changePaintOpacity(false);
        }
    };
    //------------------------------------------------------------------------------
    // Scene_SelectFastTravelPosition

    Scene_SelectFastTravelPosition.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_SelectFastTravelPosition.prototype.constructor = Scene_SelectFastTravelPosition;

    /**
     * Scene_SelectFastTravelPositionを初期化する。
     */
    Scene_SelectFastTravelPosition.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._actors = [];
        this._mapVariableId = 0;
        this._xVariableId = 0;
        this._yVariableId = 0;
        this._commonEventId = 0;
        this._item = null;
    };

    /**
     * シーンの準備をする。
     * 
     * @param {Array<Game_Actor>} 対象アクター
     * @param {number} mapVariableId マップ格納変数ID
     * @param {number} xVariableId x格納変数ID
     * @param {number} yVariableId y格納変数ID
     * @param {number} commonEventId コモンイベントID
     * @param {object} item DataItem または DataSkill. 該当なしの場合にはnull
     */
    Scene_SelectFastTravelPosition.prototype.prepare = function(actors, mapVariableId, xVariableId, yVariableId, commonEventId, item) {
        this._actors = actors;
        this._mapVariableId = mapVariableId;
        this._xVariableId = xVariableId;
        this._yVariableId = yVariableId;
        this._commonEventId = commonEventId;
        this._item = item;
    };
    /**
     * 背景を作成する。
     */
    Scene_SelectFastTravelPosition.prototype.createBackground = function() {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(255);
    };

    /**
     * Scene_SelectFastTravelPositionに必要なリソースを作成する。
     */
    Scene_SelectFastTravelPosition.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createItemList();
        this.createListWindow();
    };

    /**
     * アイテムリストを構築する
     */
    Scene_SelectFastTravelPosition.prototype.createItemList = function() {
        this._fastTravelPositions = [];
        const fastTravelPositions = $gameParty.fastTravelPositions();
        for (const fastTravelPosition of fastTravelPositions) {
            if (this.canFastTravelCondition(fastTravelPosition)) {
                this._fastTravelPositions.push(fastTravelPosition);
            }
        }
    };

    /**
     * ファストトラベル位置が、選択可能条件を満たしているかどうかを判定する。
     * 
     * @param {object} fastTravelPosition ファストトラベル位置エントリ
     * @returns {boolean} 条件を満たしている場合にはtrue, それ以外はfalse
     */
    Scene_SelectFastTravelPosition.prototype.canFastTravelCondition = function(fastTravelPosition) {
        if (fastTravelPosition.condition) {
            try {
                if (eval(fastTravelPosition.condition)) {
                    return true;
                } else {
                    return false;
                }
            }
            catch (e) {
                console.log(e);
                return false;
            }
        } else {
            return true;
        }
    };

    /**
     * リストウィンドウを構築する
     */
    Scene_SelectFastTravelPosition.prototype.createListWindow = function() {
        const rect = this.listWindowRect();
        this._listWindow = new Window_FastTravelList(rect);
        this._listWindow.setFastTravelPositions(this._fastTravelPositions);
        this._listWindow.setActors(this._actors);
        this._listWindow.setHandler("ok", this.onListWindowOk.bind(this));
        this._listWindow.setHandler("cancel", this.onListWindowCancel.bind(this));
        this.addWindow(this._listWindow);

        this._listWindow.hide();
        this._listWindow.deactivate();
    };

    /**
     * リストウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_SelectFastTravelPosition.prototype.listWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * シーンを開始する。
     */
    Scene_SelectFastTravelPosition.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);

        // 変数設定
        if (this._mapVariableId) {
            $gameVariables.setValue(this._mapVariableId, 0);
        }
        if (this._xVariableId) {
            $gameVariables.setValue(this._xVariableId, 0);
        }
        if (this._yVariableId) {
            $gameVariables.setValue(this._yVariableId, 0);
        }

        this._listWindow.show();
        this._listWindow.activate();
    };

    /**
     * リストウィンドウでOK操作されたときの処理を行う。
     */
    Scene_SelectFastTravelPosition.prototype.onListWindowOk = function() {
        this._listWindow.hide();
        const fastTravelPosition = this._listWindow.item();
        if (fastTravelPosition) {
            // 変数設定
            if (this._mapVariableId) {
                $gameVariables.setValue(this._mapVariableId, fastTravelPosition.mapId);
            }
            if (this._xVariableId) {
                $gameVariables.setValue(this._xVariableId, fastTravelPosition.x);
            }
            if (this._yVariableId) {
                $gameVariables.setValue(this._yVariableId, fastTravelPosition.y);
            }
            if (this._commonEventId) {
                $gameTemp.reserveCommonEvent(this._commonEventId);
            }

            if (this._item && (this._actors.length > 0)) {
                // 使用可能なユーザーがジャンプする。
                const actor = this._actors.find(a => a.canFastTravel(fastTravelPosition.id));
                // スキルまたはアイテムを使う。
                actor.useItem(this._item);
            }
        }

        if (fastTravelPosition && this._commonEventId) {
            SceneManager.goto(Scene_Map);
        } else {
            this.popScene();
        }
    };
    /**
     * リストウィンドウでキャンセル操作されたときの処理を行う。
     */
    Scene_SelectFastTravelPosition.prototype.onListWindowCancel = function() {
        this._listWindow.hide();

        this.popScene();
    };

    //------------------------------------------------------------------------------
    // Scene_ItemBase
    // 
    if (Game_Action.EFFECT_FASTTRAVEL) {
        const _Scene_ItemBase_determineItem = Scene_ItemBase.prototype.determineItem;
        /**
         * アイテム選択で決定操作されたときの処理を行う。
         */
        Scene_ItemBase.prototype.determineItem = function() {
            const item = this.item();
            if (this.testFastTravel(item)) {
                // 使用可能な状態 -> シーン呼び出しする。
                SceneManager.push(Scene_SelectFastTravelPosition);
                const fastTravelEffect = item.effects.find(effect => effect && effect.code === Game_Action.EFFECT_FASTTRAVEL);
                const eventId = fastTravelEffect.dataId;
                if (DataManager.isSkill(item)) {
                    SceneManager.prepareNextScene([this.user()], mapVariableId, xVariableId, yVariableId, eventId, item);
                } else {
                    SceneManager.prepareNextScene($gameParty.allMembers(), mapVariableId, xVariableId, yVariableId, eventId, item);
                }
            } else {
                _Scene_ItemBase_determineItem.call(this);
            }
        };
        /**
         * itemにファストトラベル効果があるかを判定する。
         * 
         * @param {object} item DataItem/DataSkill
         * @returns {boolean} ファストトラベル効果がある場合にはtrue, それ以外はfalse.
         */
        Scene_ItemBase.prototype.testFastTravel = function(item) {
            const hasFastTravelEffect = item.effects.some(
                effect => effect && effect.code === Game_Action.EFFECT_FASTTRAVEL
            );
            if (hasFastTravelEffect) {
                return $gameParty.canPerformFastTravel();
            } else {
                return false;
            }
        };
    }

})();
