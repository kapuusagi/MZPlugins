/*:ja
 * @target MZ 
 * @plugindesc TWLD向けキャラクターメイキングプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 
 * @orderAfter 
 * 
 * @command startCharacterMaking
 * @text メイキングシーンを開始する。
 * @desc キャラクターメイキングシーンを開始します。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 編集対象のアクターID。変数、アクターIDともに未指定時は新規登録とみなして処理する。指定時は修正。
 * @type actor
 * @default 0
 * 
 * @arg variableId
 * @text 編集対象アクター変数ID
 * @desc 編集対象のアクターIDを格納する変数。変数、アクターIDともに未指定時は新規登録とみなして処理する。指定時は修正。
 * @type variable
 * @default 0
 * 
 * @arg storeVariableId
 * @text キャラメイクしたアクターID格納変数ID
 * @desc キャラメイクしたアクターIDを格納する変数。$gameTemp.selectedActorId()にも保存される。キャンセル時はいずれも0がセットされる。
 * @type variable
 * @default 0
 * 
 * @arg isCancelable
 * @text キャンセルできるかどうか
 * @desc キャンセルできる場合にはtrue, キャンセルできない場合にはfalseを指定する。
 * @type boolean
 * @default true
 * 
 * @arg itemNames
 * @text 選択可能項目
 * @desc 選択可能な項目リスト。未指定時は全項目が選択可能。
 * @type string[]
 * @default 
 * 
 * 
 * @command selectRegisteredActor
 * @text 登録済みアクター選択
 * @desc 登録済みアクターを選択する。選択したデータは指定変数にIDを格納する。未指定時は$gameTemp.selectedActorId()に格納される。
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 選択されたアクターを格納する変数。キャンセル時は0が格納される。
 * @type variable
 * @default 0
 * 
 * @arg isCancelable
 * @text キャンセルできるかどうか
 * @desc キャンセルできる場合にはtrue, キャンセルできない場合にはfalseを指定する。
 * @type boolean
 * @default true
 * 
 * @arg textHelpMessage
 * @text ヘルプメッセージ
 * @type string
 * 
 * 
 * @command deleteActor
 * @text 指定アクターのデータを削除する。
 * @desc 指定したアクターのデータを削除します。削除可能なIDとして指定したものだけが対象です。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 削除するアクターID。
 * @type actor
 * @default 0
 * 
 * @arg variableId
 * @text 変数ID
 * @desc アクターIDを格納した変数のIDを指定する。変数での指定をしない場合には0とする。
 * @type variable
 * @default 0
 * 
 * @param registableIds
 * @text ユーザーが登録/削除可能なID
 * @desc ユーザーが登録/削除可能なIDを設定する。カンマ区切りで数値を指定。ハイフンで範囲指定。例:2,4,7-12
 * @type text
 * 
 * @param textMaxRegistered
 * @text 最大数登録済みメッセージ
 * @desc 登録数が最大数の場合のメッセージ
 * @type text
 * @default 登録数が最大です。
 * 
 * @param textItemNameName
 * @text 項目名：名前
 * @desc メイキング項目名
 * @type string
 * @default 名前
 * 
 * @param textItemDescriptionName
 * @text 名前ヘルプメッセージ
 * @desc メイキングヘルプメッセージ
 * @type string
 * @default 名前を変更します。
 * 
 * @param textItemOk
 * @text OKテキスト
 * @type string
 * @default 登録
 * 
 * 
 * @param maxNameLength
 * @text 名前の最大長
 * @desc 名前入力欄の最大文字数
 * @type number
 * @default 8
 * 
 * 
 * @help 
 * キャラクターメイキングのベースシステムを提供するためのプラグイン。
 * 編集可能項目はプラグインにより拡張することを想定する。
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

function Game_CharaMakeItem() {
    this.initialize(...arguments);
}

function Game_CharaMakeItem_Name() {
    this.initialize(...arguments);
}

/**
 * キャラクターメイキング項目選択用ウィンドウ
 */
function Window_CharaMakeItemSelection() {
    this.initialize(...arguments);
}

/**
 * キャラクターメイキング項目リスト
 */
function Window_CharaMakeItemList() {
    this.initialize(...arguments);
}

/**
 * 登録済みアクターリスト
 */
function Window_RegisteredActorList() {
    this.initialize(...arguments);
}

/**
 * Scene_Twld_CharMake
 * 
 * キャラクターメイキングシーン
 */
function Scene_CharaMake() {
    this.initialize(...arguments);
}

/**
 * Scene_SelectRegisteredActor
 * 
 * 登録済みアクターを選択するシーン。
 */
function Scene_SelectRegisteredActor() {
    this.initialize(...arguments);
}

/**
 * Scene_UnregisterActor
 * 
 * アクターの登録削除を行う。
 */
function Scene_UnregisterActor() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_CharaMake";
    const parameters = PluginManager.parameters(pluginName);

    /**
     * 登録ID列を解析する。
     * 
     * @param {string} text 
     */
    const _parseRegistableIds = function(text) {
        const ids = [];
        if (text) {
            const tokens = text.split(',');
            for (const token of tokens) {
                nums = token.split('-');
                if (nums.length == 1) {
                    const actorId = Number(token) || 0;
                    if ((actorId > 0) && !ids.includes(actorId)) {
                        ids.push(actorId);
                    }
                } else {
                    const beginId = Number(nums[0]) || 0;
                    const endId = Number(nums[1]) || 0;
                    if ((beginId > 0) && (endId > 0)) {
                        for (let id = beginId; id <= endId; id++) {
                            if (!ids.includes(id)) {
                                ids.push(id);
                            }
                        }
                    }
                }
            }
        }

        return ids;
    };

    const registeableIds = _parseRegistableIds(parameters["registableIds"]);

    const textMaxRegistered = parameters["textMaxRegistered"] || "Registable actors are maximum.";
    const textItemNameName = parameters["textItemNameName"] || "Name";
    const textItemDescriptionName = parameters["textItemDescriptionName"] || "Change actor name.";
    const textItemOk = parameters["textItemOk"] || "登録";
    const maxNameLength = Number(parameters["maxNameLength"]) || 8;

    /**
     * 対象のアクターIDを得る。
     * 
     * @param {Array<object>} args 引数
     */
    const _getTargetActorId = function (args) {
        const variableId = Number(args.variableId) || 0;
        if (variableId > 0) {
            const id = $gameVariables.value(variableId);
            if ((id > 0) && (id < $dataActors.length)) {
                return id;
            }
        }

        return Number(args.actorId) || 0;
    };

    const _parseItemNames = function(itemNamesStr) {
        const itemNames = [];
        try {
            const obj = JsonEx.parse(itemNamesStr);
            for (str of obj) {
                itemNames.push(str);
            }
        }
        catch (e) {
            /* do nothing. */
        }
        return itemNames;
    }

    PluginManager.registerCommand(pluginName, "startCharacterMaking", args => {
        if ($gameParty.inBattle()) {
            return ;
        }


        const storeVariableId = Number(args.storeVariableId) || 0;
        const isCancelable = (typeof(args.isCancelable) == "undefined") ? false
                : (args.isCancelable == "true");
        const itemNames = _parseItemNames(args.itemNames);
        const targetActorId = _getTargetActorId(args);
        if (targetActorId == 0) {
            const actorId = $gameActors.registableActorId();
            if (actorId > 0) {
                SceneManager.push(Scene_CharaMake);
                SceneManager.prepareNextScene(actorId, storeVariableId, isCancelable, itemNames);
            } else {
                // 空きエントリが無い
                $gameMessage.add(textMaxRegistered);
            }
        } else {
            const actorId = targetActorId;
            if (actorId < $dataActors.length) {
                // アクター指定ありで有効なアクターID
                SceneManager.push(Scene_CharaMake);
                SceneManager.prepareNextScene(actorId, storeVariableId);
            }
        }        
    });

    PluginManager.registerCommand(pluginName, "selectRegisteredActor", args => {
        if ($gameActors.registeredActorIds().length == 0) {
            return ;
        }

        const variableId = Number(args.variableId) || 0;
        const isCancelable = (typeof(args.isCancelable) == "undefined") ? false
                : (args.isCancelable == "true");
        const textHelpMessage = args.textHelpMessage || "";
       
        if ((variableId >= 0) && (variableId < $dataSystem.variables.length)) {
            SceneManager.push(Scene_SelectRegisteredActor);
            SceneManager.prepareNextScene(variableId, isCancelable, textHelpMessage);
        }
    });

    PluginManager.registerCommand(pluginName, "deleteActor", args => {
        if ($gameParty.inBattle()) {
            return ;
        }

        const actorId = _getTargetActorId(args);
        if ($gameActors.isDeletableActor(actorId)) {
            // 有効なアクターID
            $gameActors.deleteActorData(actorId);
        }
    });

    //------------------------------------------------------------------------------
    // DataManager

    DataManager._charaMakeItems = null;

    /**
     * キャラクターメイキングアイテムを取得する。
     * 
     * @param {Array<string>} 項目冥配列
     * @return {Array<Game_CharaMakeItem>} キャラクターメイキング項目
     */
    DataManager.charaMakeItems = function(itemNames) {
        if (this._charaMakeItems == null) {
            this._charaMakeItems = this.createCharaMakeItems();
        }
        if (itemNames && (itemNames.length > 0)) {
            return this._charaMakeItems.filter(item => itemNames.includes(item.name()));
        } else {
            return this._charaMakeItems;
        }
    };

    /**
     * キャラクターメイキング項目を取得する。
     * キャラメイク項目を拡張する場合、このメソッドをフックして値を配列に加えて返す。
     * 
     * @return {Array<Game_CharaMakeItem>} キャラクターメイキング項目
     */
    DataManager.createCharaMakeItems = function() {
        const items = [];
        items.push(new Game_CharaMakeItem_Name());
        /* TODO : Impliments. */

        return items;
    };

    //------------------------------------------------------------------------------
    // Game_CharaMakeItem
    /**
     * 初期化する。
     */
    Game_CharaMakeItem.prototype.initialize = function() {
    };

    /**
     * この項目の識別名を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem.prototype.name = function() {
        return "";
    };

    /**
     * この項目の説明を取得する。
     * 
     * @return {string} 説明
     */
    Game_CharaMakeItem.prototype.description = function() {
        return "";
    };

    /**
     * 選択・編集用のウィンドウを作成する。
     * 
     * @param {Scene_Base} s
     * @param {Rectangle} rect ウィンドウ矩形領域
     * @returns {object} 追加するウィンドウ
     *                   {
     *                       selectWindow : {Window_Selectable}
     *                       windows : {Array<Window_Base>}
     *                   }
     */
    Game_CharaMakeItem.prototype.createSelectWindows = function(rect) {
        const window = new Window_CharaMakeItemSelection(rect);
        window.setItems(this.items())
        return {
            selectWindow: window,
            windows: null
        } ;
    };

    /**
     * 編集中のテキストを得る。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @return {string} 編集項目の選択値(テキスト)
     */
    Game_CharaMakeItem.prototype.editingText = function(windowEntry) {
        const window = windowEntry.selectWindow;
        return window.item().name;
    };

    /**
     * 現在のアクターの情報を反映させる
     * 
     * Note: キャラメイク操作で初期値を設定するために呼び出される。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem.prototype.setCurrent = function(windowEntry, actor) {

    };

    /**
     * 編集中の設定を反映させる。
     * 
     * Note: キャラメイク操作で確定操作されたときに呼び出される。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem.prototype.apply = function(windowEntry, actor) {

    };

    /**
     * 選択開始時の処理を行う。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     */
    Game_CharaMakeItem.prototype.startSelection = function(windowEntry) {
        const selectWindow = windowEntry.selectWindow;
        selectWindow.activate();
        selectWindow.show();
        for (const window of windowEntry.windows) {
            window.show();
        }
    };

    /**
     * 選択終了時の処理を行う。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     */
    Game_CharaMakeItem.prototype.endSelection = function(windowEntry) {
        const selectWindow = windowEntry.selectWindow;
        selectWindow.deactivate();
        selectWindow.hide();
        for (const window of windowEntry.windows) {
            window.hide();
        }
    };

    /**
     * アイテム一覧を得る。
     * 
     * TODO: 選択可能な項目を得る。
     * 
     * @return {Array<object>} アイテム一覧
     */
    Game_CharaMakeItem.prototype.items = function() {
        return [];
    };

    /**
     * 既定のウィンドウの高さを計算して取得する。
     * 
     * @param {Number} numLines 表示する文字の行数
     * @param {Boolean} selectable 選択可能なウィンドウかどうか。
     */
    Game_CharaMakeItem.prototype.calcWindowHeight = function(numLines, selectable) {
        return Scene_Base.prototype.calcWindowHeight(numLines, selectable);
    };


    //------------------------------------------------------------------------------
    // Game_CharaMakeItem_Name
    Game_CharaMakeItem_Name.prototype = Object.create(Game_CharaMakeItem.prototype);
    Game_CharaMakeItem_Name.prototype.constructor = Game_CharaMakeItem_Name;

    /**
     * 初期化する。
     */
    Game_CharaMakeItem_Name.prototype.initialize = function() {

    };
    /**
     * この項目の識別名を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Name.prototype.name = function() {
        return textItemNameName;
    };

    /**
     * この項目の説明を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Name.prototype.description = function() {
        return textItemDescriptionName;
    };
    /**
     * 編集中のテキストを得る。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @return {string} 編集項目の選択値(テキスト)
     */
    Game_CharaMakeItem_Name.prototype.editingText = function(windowEntry) {
        const windowNameEdit = windowEntry.windows[0];
        return windowNameEdit.name();
    };

    /**
     * 選択・編集用のウィンドウを作成する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     * @returns {Window_Selectable} ウィンドウ(Window_Selectableの派生クラス)
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Name.prototype.createSelectWindows = function(rect) {
        const editWindowRect = this.editWindowRect();
        const editWindow = new Window_NameEdit(editWindowRect);
        const inputWindowRect = this.inputWindowRect();
        const inputWindow = new Window_NameInput(inputWindowRect);
        inputWindow.setEditWindow(editWindow);
    
        return {
            selectWindow: inputWindow,
            windows: [ editWindow ]
        };
    };

    /**
     * 編集ウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Game_CharaMakeItem_Name.prototype.editWindowRect = function() {
        const inputWindowHeight = this.calcWindowHeight(9, true);
        const padding = $gameSystem.windowPadding();
        const ww = 600;
        const wh = ImageManager.faceHeight + padding * 2;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 入力ウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Game_CharaMakeItem_Name.prototype.inputWindowRect = function() {
        const rect = this.editWindowRect();
        const wx = rect.x;
        const wy = rect.y + rect.height + 8;
        const ww = rect.width;
        const wh = this.calcWindowHeight(9, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 現在のアクターの情報を反映させる
     * 
     * Note: キャラメイク操作で初期値を設定するために呼び出される。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    Game_CharaMakeItem_Name.prototype.setCurrent = function(windowEntry, actor) {
        const windowNameEdit = windowEntry.windows[0];
        windowNameEdit.setup(actor, maxNameLength);
    };

    /**
     * 編集中の設定を反映させる。
     * 
     * Note: キャラメイク操作で確定操作されたときに呼び出される。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    Game_CharaMakeItem_Name.prototype.apply = function(windowEntry, actor) {
        const windowNameEdit = windowEntry.windows[0];
        actor.setName(windowNameEdit.name());
    };

    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     * 
     * Note: メンバー追加のためフックする。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this, ...arguments);
        this._selectedActorId = 0;
    };

    /**
     * 選択されたアクターIDを設定する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Temp.prototype.setSelectedActorId = function(actorId) {
        this._selectedActorId = actorId;
    };

    /**
     * 選択されたアクターIDを取得する。
     * 
     * @returns {number} アクターID
     */
    Game_Temp.prototype.setSelectedActorId = function() {
        return this._selectedActorId;
    };


    //------------------------------------------------------------------------------
    // Game_Actors
    /**
     * アクターデータが存在するかどうかを取得する。
     * 
     * @param {Number} actorId アクターID
     * @return {Boolean} アクターデータが存在する場合にはtrue, 存在しない場合にはfalse
     */
    Game_Actors.prototype.isActorDataExists = function(actorId) {
        return this._data[actorId] ? true : false;
    };

    /**
     * 登録可能IDのうち、登録済みのアクターIDを取得する。
     * 
     * @returns {Array<number>} アクターIDの配列
     */
    Game_Actors.prototype.registeredActorIds = function() {
        const ids = [];
        for (const id of registeableIds) {
            if (this.isActorDataExists(id)) {
                ids.push(id);
            }
        }
        return ids;
    };

    /**
     * 登録可能なアクターIDを得る。
     * 
     * @return {number} アクターID。登録可能なアクターIDが無い場合には0が返る。
     */
    Game_Actors.prototype.registableActorId = function() {
        for (const actorId of registeableIds) {
            if ((actorId > 0) && (actorId < $dataActors.length)
                    && !this.isActorDataExists(actorId)) {
                return actorId;
            }
        }

        return 0;
    };

    /**
     * アクターデータを消去する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actors.prototype.deleteActorData = function(actorId) {
        if (this.isActorDataExists(actorId) && registeableIds.includes(actorId)) {
            const actor = this.actor(actorId);
            if ($gameParty.includes(actor)) {
                /* このIDのメンバーを外す。 */
                $gameParty.remveActor(actorId);
            }
            /* 装備を外す。 */
            actor.clearEquipments();

            delete this._data[actorId];
        }
    };


    /**
     * 指定IDのアクターが削除可能なエントリかどうかを取得する。
     * 
     * @param {number} actorId アクターID
     * @returns {boolean} 削除可能なエントリの場合にはtrue, それ以外はfalse.
     */
    Game_Actors.prototype.isDeletableActor = function(actorId) {
        if ((actorId > 0) && registeableIds.includes(actorId)
                && this.isActorDataExists(actorId)) {
            const memberIds = $gameParty.allMembers().map(member => member.actorId());
            if (!memberIds.includes(actorId)) {
                return true;
            }
        }

        return false;
    };
    //------------------------------------------------------------------------------
    // Window_CharaMakeItemSelection
    Window_CharaMakeItemSelection.prototype = Object.create(Window_Selectable.prototype);
    Window_CharaMakeItemSelection.prototype.constructor = Window_CharaMakeItemSelection;

    /**
     * ウィンドウを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_CharaMakeItemSelection.prototype.initialize = function(rect) {
        this._items = [];
        Window_Selectable.prototype.initialize.call(this, rect);
    };

    /**
     * アイテムリストを設定する。
     * 
     * @param {Array<object>} items アイテムリスト (objectにnameメンバを持つこと)
     */
    Window_CharaMakeItemSelection.prototype.setItems = function(items) {
        this._items = items;
        this.refresh();
    };

    /**
     * 現在のアイテムを得る。
     * 
     * @returns {object} アイテム
     */
    Window_CharaMakeItemSelection.prototype.item = function() {
        const index = this.index();
        return ((index >= 0) && (index < this._items.length)) ? this._items[index] : null;
    };


    /**
     * 項目数を得る。
     * 
     * @return {Number} 項目数。
     * Note: 派生クラスでは選択項目数を与えるために実装する。
     */
    Window_CharaMakeItemSelection.prototype.maxItems = function() {
        return this._items.length || 0;
    };

    /**
     * 項目を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_CharaMakeItemSelection.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        const item = this._items[index];
        this.drawText(item.name, rect.x, rect.y, rect.width);
    };


    //------------------------------------------------------------------------------
    // Window_CharaMakeItemList
    Window_CharaMakeItemList.prototype = Object.create(Window_Selectable.prototype);
    Window_CharaMakeItemList.prototype.constructor = Window_CharaMakeItemList;

    /**
     * Window_CharaMakeItemListを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_CharaMakeItemList.prototype.initialize = function(rect) {
        this._isCancelEnabled = true;
        this._items = [];
        this._valueGetter = null;
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
        this.select(0);
    };

    /**
     * キャンセル操作が可能かどうかを設定する。
     * 
     * @param {boolean} isCancelable キャンセル可能な場合にはtrue, それ以外はfalse
     */
    Window_CharaMakeItemList.prototype.setCancelEnabled = function(isCancelable) {
        this._isCancelEnabled = isCancelable;
    };
    /**
     * キャンセル操作が可能かどうかを取得する。
     * 
     * @returns {boolean} キャンセル可能な場合にはtrue, それ以外はfalse
     */
    Window_CharaMakeItemList.prototype.isCancelEnabled = function() {
        return this._isCancelEnabled && this.isHandled("cancel");
    };

    /**
     * キャラメイク項目を設定する。
     * 
     * @param {Array<Game_CharaMakeItem>} items キャラメイク項目
     */
    Window_CharaMakeItemList.prototype.setCharaMakeItems = function(items) {
        this._items = items || [];
        this.refresh();
    };

    /**
     * 値取得関数を設定する。
     * 
     * @param {function} getter 値取得関数(getter(item:object) : string)
     */
    Window_CharaMakeItemList.prototype.setValueGetter = function(getter) {
        this._valueGetter = getter;
        this.refresh();
    };

    /**
     * 項目数を得る。
     * 
     * @return {Number} 項目数。
     * Note: 派生クラスでは選択項目数を与えるために実装する。
     */
    Window_CharaMakeItemList.prototype.maxItems = function() {
        return (this._items.length || 0) + 1;
    };
    /**
     * 選択項目を得る。
     * 
     * @return {Game_CharaMakeItem} 項目
     */
    Window_CharaMakeItemList.prototype.item = function() {
        const index = this.index();
        return ((index >= 0) && (index < this._items.length)) ? this._items[index] : null;
    }

    /**
     * 項目を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_CharaMakeItemList.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        if (index < this._items.length) {
            const item = this._items[index];
            let text = item.name();
            if (this._valueGetter) {
                text += ":" + this._valueGetter(item);
            }
            this.drawText(text, rect.x, rect.y, rect.width, "left");
        } else {
            if (index === (this._items.length)) {
                this.drawText(textItemOk, rect.x, rect.y, rect.width, "left");
            }
        }
    };



    //------------------------------------------------------------------------------
    // Window_RegisteredActorList
    Window_RegisteredActorList.prototype = Object.create(Window_Selectable.prototype);
    Window_RegisteredActorList.prototype.constructor = Window_RegisteredActorList;

    /**
     * Window_RegisteredActorList を初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_RegisteredActorList.prototype.initialize = function(rect) {
        this._isCancelEnabled = true;
        this._registeredActorIds = $gameActors.registeredActorIds();
        this._statusWindow = null;
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    };

    /**
     * キャンセル操作が可能かどうかを設定する。
     * 
     * @param {boolean} isCancelable キャンセル可能な場合にはtrue, それ以外はfalse
     */
    Window_RegisteredActorList.prototype.setCancelEnabled = function(isCancelable) {
        this._isCancelEnabled = isCancelable;
    };
    /**
     * キャンセル操作が可能かどうかを取得する。
     * 
     * @returns {boolean} キャンセル可能な場合にはtrue, それ以外はfalse
     */
    Window_RegisteredActorList.prototype.isCancelEnabled = function() {
        return this._isCancelEnabled && this.isHandled("cancel");
    };

    /**
     * 選択されているアクターを得る。
     * 
     * @returns {Game_Actor} アクター
     */
    Window_RegisteredActorList.prototype.actor = function() {
        const actorId = this.actorId();
        return (actorId > 0) ? $gameActors.actor(actorId) : null;
    };

    /**
     * 選択されているアクターIDを得る。
     * 
     * @return {number} 選択されているアクターのIDを得る。未選択の場合には0が返る。
     */
    Window_RegisteredActorList.prototype.actorId = function() {
        const index = this.index();
        if ((index >= 0) && (index < this._registeredActorIds.length)) {
            return this._registeredActorIds[index];
        } else {
            return 0;
        }

    };

    /**
     * 項目数を得る。
     * 
     * @return {Number} 項目数。
     */
    Window_RegisteredActorList.prototype.maxItems = function() {
        return this._registeredActorIds.length;
    };

    /**
     * ステータスウィンドウを設定する。
     * 
     * @param {Window_Status} statusWindow ステータスウィンドウ
     */
    Window_RegisteredActorList.prototype.setStatusWindow = function(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    };

    /**
     * ヘルプの更新処理を呼び出す。
     */
    Window_RegisteredActorList.prototype.callUpdateHelp = function() {
        if (this.active && this._statusWindow) {
            this._statusWindow.setActor(this.actor());
        }
    };

    Window_RegisteredActorList.prototype.drawAllItems = function() {
        const topIndex = this.topIndex();
        for (let i = 0; i < this.maxVisibleItems(); i++) {
            const index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItemBackground(index);
                this.drawItem(index);
            }
        }
    };
    /**
     * 項目を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_RegisteredActorList.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        const actorId = this._registeredActorIds[index];
        const actor = (actorId > 0) ? $gameActors.actor(actorId) : null;
        if (actor) {
            this.drawText(actor.name(), rect.x, rect.y, rect.width);
        }
    };

    //------------------------------------------------------------------------------
    // Scene_CharaMake

    Scene_CharaMake.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_CharaMake.prototype.constructor = Scene_CharaMake;

    /**
     * シーンを初期化する。
     */
    Scene_CharaMake.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this, ...arguments);
        this._actorId = 0;
        this._isEditCompleted = false;
        this._isModify = false;
        this._storeVariableId = 0;
        this._itemNames = [];
        this._windowEntries = [];
    };

    /**
     * シーンを準備する。
     * 
     * @param {number} actorId アクターID。未指定時は0
     * @param {number} storeVariableId 格納変数ID。編集したアクターIDを格納する変数ID
     * @param {boolean} isCancelable キャンセル可能かどうか
     * @param {Array<string>} itemNames 選択可能項目
     */
    Scene_CharaMake.prototype.prepare = function(actorId, storeVariableId, isCancelable, itemNames) {
        this._actorId = actorId;
        this._storeVariableId = storeVariableId;
        this._isCancelEnabled = isCancelable;
        this._itemNames = itemNames;
    };

    /**
     * シーンに必要なリソースを構築する。
     */
    Scene_CharaMake.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this, ...arguments);
        this._items = DataManager.charaMakeItems(this._itemNames);
        this.createCharaMakeItemListWindow();
        const rect = this.selectWindowRect();
        this._windowEntries = [];
        const actor = $gameActors.actor(this._actorId);
        for (const item of this._items) {
            const windowEntry = item.createSelectWindows(rect);
            windowEntry.item = item;
            // 初期化
            item.setCurrent(windowEntry, actor);
            // ハンドラ設定
            windowEntry.selectWindow.setHandler("ok", this.onSelectWindowOk.bind(this));
            // 非表示設定にする。
            this.addWindow(windowEntry.selectWindow);
            windowEntry.selectWindow.hide();
            windowEntry.selectWindow.deactivate();
            if (windowEntry.windows) {
                for (const window of windowEntry.windows) {
                    window.hide();
                    window.deactivate();
                    this.addWindow(window);
                }
            }

            this._windowEntries.push(windowEntry);
        }
    };

    /**
     * 選択ウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} 選択ウィンドウの矩形領域
     */
    Scene_CharaMake.prototype.selectWindowRect = function() {
        const rect = this.charaMakeItemListWindowRect();
        const wx = rect.x + 20;
        const wy = rect.y + 20;
        const ww = Graphics.boxWidth - wx;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * キャラクターメイキング項目選択ウィンドウを作成する。
     */
    Scene_CharaMake.prototype.createCharaMakeItemListWindow = function() {
        const rect = this.charaMakeItemListWindowRect();
        this._itemWindow = new Window_CharaMakeItemList(rect);
        this._itemWindow.setCancelEnabled(this._isCancelEnabled);
        this._itemWindow.setCharaMakeItems(this._items);
        this._itemWindow.setValueGetter(this.editingValue.bind(this));
        this._itemWindow.setHandler("ok", this.onItemListOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemListCancel.bind(this));
        this.addWindow(this._itemWindow);
    };

    /**
     * 項目の設定値を得る。
     * 
     * @param {object} item アイテム
     * @returns {string} 設定値
     */
    Scene_CharaMake.prototype.editingValue = function(item) {
        const windowEntry = this._windowEntries.find(entry => entry.item === item);
        if (windowEntry != null) {
            return item.editingText(windowEntry);
        } else {
            return "";
        }
    };

    /**
     * キャラクターメイキング項目選択ウィンドウの矩形領域を取得する。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     */
    Scene_CharaMake.prototype.charaMakeItemListWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * コマンドウィンドウ幅を取得する。
     * 
     * @return {Number} コマンドウィンドウ幅
     */
    Scene_CharaMake.prototype.mainCommandWidth = function() {
        return 320;
    };

    /**
     * シーンを開始する。
     */
    Scene_CharaMake.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this, ...arguments);

        $gameTemp.setSelectedActorId(0);
        if (this._storeVariableId > 0) {
            $gameVariables.setValue(this._storeVariableId, 0);
        }

        if (this._actorId > 0) {
            this._isModify =  $gameActors.isActorDataExists(this._actorId);
        } else {
            this.popScene();
        }

        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
    };

    /**
     * 選択ウィンドウでOK操作されたときの処理を行う。
     */
    Scene_CharaMake.prototype.onSelectWindowOk = function() {
        const item = this._itemWindow.item();
        const windowEntry = this._windowEntries.find(entry => entry.item === item);
        if (windowEntry) {
            item.endSelection(windowEntry);
        }
        this._itemWindow.refresh();
        this._itemWindow.activate();
    };


    /**
     * 項目リストでOK操作された時の処理を行う。
     */
    Scene_CharaMake.prototype.onItemListOk = function() {
        const index = this._itemWindow.index();
        if (index < this._items.length) {
            const charaMakeItem = this._itemWindow.item();
            if (charaMakeItem) {
                const item = this._itemWindow.item();
                const windowEntry = this._windowEntries.find(entry => entry.item === item);
                if (windowEntry) {
                    item.startSelection(windowEntry);
                } else {
                    /* 該当エントリなし => バグ */
                    this._itemWindow.activate();
                }
            } else {
                /* 未選択状態でOK操作 => バグ */
                this._itemWindow.activate();
            }
        } else {
            const actor = $gameActors.actor(this._actorId);
            for (const item of this._items) {
                const windowEntry = this._windowEntries.find(entry => entry.item === item);
                item.apply(windowEntry, actor);
            }

            this._isEditCompleted = (actor.name().length > 0);
            this.popScene();
        }
    };


    /**
     * 項目リストでキャンセル操作された時の処理を行う。
     */
    Scene_CharaMake.prototype.onItemListCancel = function() {
        this._isEditCompleted = false;
        this.popScene();
    };

    /**
     * シーンの終了処理を行う。
     */
    Scene_CharaMake.prototype.terminate = function() {
        Scene_MenuBase.prototype.terminate.call(this, ...arguments);

        const actorId = (this._isEditCompleted) ? this._actorId : 0;
        if (!this._isEditCompleted) {
            if (!this._isModify) {
                /* 新規登録でキャンセルされた場合
                 * 一時的に作成したデータを消去する。 */
                $gameActors.deleteActorData(this._actorId);
            }
        }
        if (this._storeVariableId > 0) {
            $gameVariables.setValue(this._storeVariableId, actorId);
        }
        $gameTemp.setSelectedActorId(actorId);

    };

    //------------------------------------------------------------------------------
    // Scene_SelectRegisteredActor
    Scene_SelectRegisteredActor.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_SelectRegisteredActor.prototype.constructor = Scene_SelectRegisteredActor;

    /**
     * シーンを初期化する。
     */
    Scene_SelectRegisteredActor.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this, ...arguments);
        this._variableId = 0;
        this._isCancelEnabled = true;
    };

    /**
     * シーンを作成する。
     */
    Scene_SelectRegisteredActor.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createStatusWindow();
        this.createActorListWindow();
    };

    /**
     * ヘルプウィンドウを作成する。
     */
    Scene_SelectRegisteredActor.prototype.createHelpWindow = function() {
        Scene_MenuBase.prototype.createHelpWindow.call(this);
        this._helpWindow.setText(this._helpMessage);
    };

    /**
     * ステータスウィンドウを作成する。
     */
    Scene_SelectRegisteredActor.prototype.createStatusWindow = function() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_Status(rect);
        this._statusWindow.hide();
        this._statusWindow.deactivate();
        this.addWindow(this._statusWindow);
    };

    /**
     * ステータスウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     */
    Scene_SelectRegisteredActor.prototype.statusWindowRect = function() {
        const wx = this.mainCommandWidth();
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - wx;
        const wh = this.mainAreaBottom() - this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アクターリストウィンドウを作成する。
     */
    Scene_SelectRegisteredActor.prototype.createActorListWindow = function() {
        const rect = this.actorListWindowRect();
        this._listWindow = new Window_RegisteredActorList(rect);
        this._listWindow.setCancelEnabled(this._isCancelEnabled);
        this._listWindow.hide();
        this._listWindow.deactivate();
        this._listWindow.setStatusWindow(this._statusWindow);

        this._listWindow.setHandler("ok", this.onListWindowOk.bind(this));
        this._listWindow.setHandler("cancel", this.onListWindowCancel.bind(this));

        this.addWindow(this._listWindow);
    };

    /**
     * アクターリストウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     */
    Scene_SelectRegisteredActor.prototype.actorListWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaBottom() - wy;

        return new Rectangle(wx, wy, ww, wh);
    };


    /**
     * シーンを準備する。
     * 
     * @param {number} variableId 変数番号
     * @param {boolean} isCancelable キャンセル可能かどうか
     * @param {string} helpMessage ヘルプウィンドウに表示するメッセージ
     */
    Scene_SelectRegisteredActor.prototype.prepare = function(variableId, isCancelable, helpMessage) {
        this._variableId = variableId;
        this._isCancelEnabled = isCancelable;
        this._helpMessage = helpMessage;
    };

    /**
     * シーンを開始する。
     */
    Scene_SelectRegisteredActor.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this, ...arguments);
        $gameTemp.setSelectedActorId(0);
        if (this._variableId > 0) {
            $gameVariables.setValue(this._variableId, 0);
        }

        this._listWindow.show();
        this._statusWindow.show();
        this._listWindow.activate();
    };

    /**
     * アクターリストウィンドウでOK操作されたときの処理を行う。
     */
    Scene_SelectRegisteredActor.prototype.onListWindowOk = function() {
        const actorId = this._listWindow.actorId();
        $gameTemp.setSelectedActorId(actorId);
        if (this._variableId > 0) {
            $gameVariables.setValue(this._variableId, actorId);
        }
        this.popScene();
    };

    /**
     * アクターリストウィンドウでキャンセル操作されたときの処理を行う。
     */
    Scene_SelectRegisteredActor.prototype.onListWindowCancel = function() {
        $gameTemp.setSelectedActorId(0);
        if (this._variableId > 0) {
            $gameVariables.setValue(this._variableId, 0);
        }
        this.popScene();
    };

    //------------------------------------------------------------------------------
    // Scene_UnregisterActor
    Scene_UnregisterActor.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_UnregisterActor.prototype.constructor = Scene_UnregisterActor;

    /**
     * Scene_UnregisterActor を初期化する。
     */
    Scene_UnregisterActor.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this, ...arguments);
        this._actorId = 0;
    };

    /**
     * シーンを準備する。
     * 
     * @param actorId {number} アクターID。未指定時は0
     */
    Scene_UnregisterActor.prototype.prepare = function(actorId) {
        this._actorId = actorId;
    };

    /**
     * Scene_UnregisterActor を開始する。
     */
    Scene_UnregisterActor.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this, ...arguments);

        if (this._actorId > 0) {
            if (registableIds.includes(this._actorId) 
                    && this.isActorDataExists(this._actorId)) {
                // 登録対象IDかつ、対象データが存在する。
                // 確認画面に移動する。

            } else {
                // 指定されたアクターのデータは既に無い。
                this.popScene();
            }
        } else {
            // 選択画面に移動する。

        }

        this.popScene();
    };

    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張
})();