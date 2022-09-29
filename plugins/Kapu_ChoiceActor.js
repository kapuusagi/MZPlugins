/*:ja
 * @target MZ 
 * @plugindesc アクター選択プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 
 * @orderAfter 
 * 
 * @command choiceActor
 * @text アクター選択
 * @desc アクター選択を行います。選択時はアクターID、未選択時は指定変数に0が格納されます。選択対象アクターがいない場合も0が格納されます。
 * 
 * @arg choiceActorType
 * @type select
 * @default 1
 * @option パーティーメンバー(デフォルト)
 * @value 1
 * @option パーティー戦闘参加メンバー
 * @value 2
 * @option パーティー控えメンバー
 * @value 3
 * @option インスタンスがあるメンバー
 * @value 8
 * @option すべてのアクター(無名は除く)
 * @value 9
 * @option 特定のメンバー
 * @value 99
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 選択結果を格納する変数ID
 * @type variable
 * 
 * @arg actors
 * @text 選択対象アクター
 * @desc 選択対象として、特定のメンバーを選択したとき、候補となるメンバー
 * @type actor[]
 * @default []
 * 
 * @arg exclusionActors
 * @text 選択対象から外すアクター
 * @desc 選択対象から外すメンバーとして、特定のメンバーを選択したい場合に使用する
 * @type actor[]
 * @default []
 * 
 * @arg isCancelable
 * @text キャンセル許可
 * @desc 選択の際、キャンセル操作を許可するかどうか。
 * @type boolean
 * @default true
 * 
 * @param windowPosition
 * @text アクター選択ウィンドウ位置
 * 
 * @param windowX
 * @text X
 * @desc 選択ウィンドウの表示位置
 * @type number
 * @default 0
 * @parent windowPosition
 * 
 * @param windowY
 * @text Y
 * @desc 選択ウィンドウの表示位置
 * @type number
 * @default 0
 * @parent windowPosition
 * 
 * @param windowWidth
 * @text 幅
 * @default 720
 * @parent windowPosition
 * 
 * @param windowHeight
 * @text 高さ
 * @default 480
 * @parent windowPosition
 * 
 * @help 
 * アクター選択を提供するプラグイン。
 * イベントにて、アクターを簡単に選択できるようにする用途を想定します。
 * 戦闘中でも選択は可能にしてあるので、頑張ればメンバー変更イベントもできます。
 * (尚、戦闘時メンバー入れ替えプラグインを導入した方が楽だと思います。)
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * Window_ChoiceActorList.prototype.drawActor(index : number, actor : Game_Actor) : void 
 *     アクター選択時の選択項目の描画を行う。
 *     index : 項目番号(itemRect(index)で描画領域を取得できる)
 *     actor : アクターデータ。
 *             $gameActorsにインスタンス未生成の場合には一時的にGame_Actorを作成したものが渡されます。
 *             この一時的に作成されたデータは保存されません。
 * 
 * 
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * アクター選択
 *   アクター選択を開始します。
 *   選択時はアクターID、未選択時は指定変数に0が格納されます。
 *   選択対象アクターがいない場合、選択処理はスキップされます。
 *   この場合、0が格納されます。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <excludeChoiceActor>
 *     アクター選択で「インスタンスがあるメンバー」「すべてのアクター」が選択されたとき、
 *     選択候補から除外する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/**
 * Window_ChoiceActorList
 * アクター選択ウィンドウ
 */
function Window_ChoiceActorList() {
    this.initialize(...arguments);
}

(() => {
    'use strict'
    const pluginName = "Kapu_ChoiceActor";
    const parameters = PluginManager.parameters(pluginName);
    const windowX = Number(parameters["windowX"]) || 0;
    const windowY = Number(parameters["windowY"]) || 0;
    const windowWidth = Number(parameters["windowWidth"]) || 0;
    const windowHeight = Number(parameters["windowHeight"]) || 0;

    const CHOICEACTOR_FROM_PARTY = 1;
    const CHOICEACTOR_FORM_BATTLEMEMBERS = 2;
    const CHOICEACTOR_FROM_NOTBATTLEMEMBERS = 3;
    const CHOICEACTOR_FROM_INSTANCE = 8;
    const CHOICEACTOR_FROM_ALL = 9;
    const CHOICEACTOR_FROM_CANDIDATES = 99;

    // Note: 匿名関数だと this に Game_Interpreter が渡らないことに注意。
    PluginManager.registerCommand(pluginName, "choiceActor", function(args) {
        const interpreter = this;

        const variableId = Number(args.variableId) || 0;
        const choiceActorType = Number(args.choiceActorType) || 1;
        let actors = [];
        try {
            actors = JSON.parse(args.actors).map(token => Number(token) || 0);
        }
        catch (e) {
            console.error(e);
        }
        let exclusionActors = [];
        try {
            exclusionActors = JSON.parse(args.exclusionActors).map(token => Number(token) || 0);
        }
        catch (e) {
            console.error(e);
        }
        const isCancelable = (typeof args.isCancelable == "undefined") ? true : args.isCancelable == "true";
        interpreter.setupChoiceActors([ variableId, choiceActorType, actors, exclusionActors, isCancelable ]);
        if ($gameMessage.isChoiceActor()) {
            interpreter.setWaitMode("message");
        }
        return true;
    });
    //------------------------------------------------------------------------------
    // Window_Message
    const _Window_Message_initMembers = Window_Message.prototype.initMembers;
    /**
     * Window_Messageのメンバを初期化する。
     */
    Window_Message.prototype.initMembers = function() {
        this._choiceActorListWindow = null;
        _Window_Message_initMembers.call(this);
    };

    /**
     * アクター選択ウィンドウを設定する。
     * 
     * @param {Window_ChoiceActorList} window ウィンドウ
     */
    Window_Message.prototype.setChoiceActorListWindow = function(window) {
        this._choiceActorListWindow = window;
    };

    const _Window_Message_isAnySubWindowActive = Window_Message.prototype.isAnySubWindowActive;
    /**
     * いずれかのサブウィンドウがアクティブかどうかを得る。
     * 
     * @returns {boolean} サブウィンドウがアクティブな場合にはtrue, それ以外はfalse.
     */
    Window_Message.prototype.isAnySubWindowActive = function() {
        return _Window_Message_isAnySubWindowActive.call(this)
                || this._choiceActorListWindow.active;
    };

    const _Window_Message_startInput = Window_Message.prototype.startInput;
    /**
     * 入力を開始する。
     * 
     * @return {boolean} 入力を開始した場合にはtrue, それ以外はfalse.
     */
    Window_Message.prototype.startInput = function() {
        if ($gameMessage.isChoiceActor()) {
            this._choiceActorListWindow.start();
            return true;
        }
        return _Window_Message_startInput.call(this);
    };

    //------------------------------------------------------------------------------
    // Window_ChoiceActorList
    Window_ChoiceActorList.prototype = Object.create(Window_Selectable.prototype);
    Window_ChoiceActorList.prototype.constructor = Window_ChoiceActorList;

    /**
     * Window_ChoiceActorListを初期化する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域
     */
    Window_ChoiceActorList.prototype.initialize = function(rect) {
        this._actors = null;
        this._redrawItemIndices = [];
        Window_Selectable.prototype.initialize.call(this, rect);
        this.createCancelButton();
        this.openness = 0;

        this.deactivate();
        this._background = 0;
        this._canRepeat = false;
    };

    /**
     * メッセージウィンドウを設定する。
     * 
     * @param {Window_Message} messageWindow メッセージウィンドウ
     */
    Window_ChoiceActorList.prototype.setMessageWindow = function(messageWindow) {
        this._messageWindow = messageWindow;
    };
    /**
     * キャンセルボタンを作製する。
     */
    Window_ChoiceActorList.prototype.createCancelButton = function() {
        if (ConfigManager.touchUI) {
            this._cancelButton = new Sprite_Button("cancel");
            this._cancelButton.visible = false;
            this.addChild(this._cancelButton);
        }
    };

    /**
     * アクター選択の入力を開始する。
     */
    Window_ChoiceActorList.prototype.start = function() {
        this._actors = $gameMessage.choiceActors();
        this.placeCancelButton();
        this.createContents();
        this.refresh();
        this.selectDefault();
        this.open();
        this.activate();
    };

    /**
     * Window_ChoiceActorListを更新する。
     */
    Window_ChoiceActorList.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateCancelButton();
    };

    /**
     * キャンセルボタンの可視状態を更新する。
     * 非タッチモードでキャンセルボタンが無い場合には更新されない。
     */
    Window_ChoiceActorList.prototype.updateCancelButton = function() {
        if (this._cancelButton) {
            this._cancelButton.visible = this.isOpen();
        }
    };

    /**
     * デフォルトを選択する。
     */
    Window_ChoiceActorList.prototype.selectDefault = function() {
        this.select(-1);
    };

    /**
     * キャンセルボタンを配置する。
     */
    Window_ChoiceActorList.prototype.placeCancelButton = function() {
        if (this._cancelButton) {
            const spacing = 8;
            const button = this._cancelButton;
            const right = this.x + this.width;
            if (right < Graphics.boxWidth - button.width + spacing) {
                button.x = this.width + spacing;
            } else {
                button.x = -button.width - spacing;
            }
            button.y = this.y;
        }
    };
    /**
     * 選択肢の項目を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_ChoiceActorList.prototype.drawItem = function(index) {
        if (!this._actors) {
            return;
        }

        const actorId = this._actors[index];
        if ($gameActors.isActorDataExists(actorId)) {
            const actor = $gameActors.actor(actorId);
            this.drawActor(index, actor);
        } else {
            const actor = new Game_Actor(actorId);
            this.drawActor(index, actor);
        }
    };

    /**
     * アクター情報を描画する。
     * 
     * @param {number} index 項目番号
     * @param {Game_Actor} actor アクター
     */
    Window_ChoiceActorList.prototype.drawActor = function(index, actor) {
        const rect = this.itemRect(index);

        let x = rect.x;
        let y = rect.y;

        const bitmap = ImageManager.loadFace(actor.faceName());
        if (bitmap.isReady()) {
            this.drawFace(actor.faceName(), actor.faceIndex(), x + 8, y + 8, 144, 144);
        } else {
            this.reserveRedraw(index);
        }

        const nameWidth = rect.width - 144 - 16 - 8;
        this.drawText(actor.name(), x + 144 + 16 + 8, y, nameWidth);

        // 他に表示するべきパラメータがあれば、ここで描画する。

    };

    /**
     * 再描画が必要であるとリザーブする。
     * 
     * @param {number} index インデックス
     */
    Window_ChoiceActorList.prototype.reserveRedraw = function(index) {
        if (!this._redrawItemIndices.includes(index)) {
            this._redrawItemIndices.push(index);
        }
    };

    /**
     * ウィンドウを更新する。
     */
    Window_ChoiceActorList.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);

        // Note: フェイスイメージなど、loading中で描画できなかった場合、
        //       ここで再描画する。
        if (this._redrawItemIndices.length > 0) {
            const indices = this._redrawItemIndices;
            this._redrawItemIndices = [];
            for (const index of indices) {
                this.redrawItem(index);
            }
        }
    }


    /**
     * 項目数を得る。
     * 
     * @return {number} 項目数。
     */
    Window_ChoiceActorList.prototype.maxItems = function() {
        return (this._actors) ? this._actors.length : 0;
    };
    /**
     * 項目の描画高を得る。
     * 
     * @returns {number} 項目の描画高さ。
     */
    Window_ChoiceActorList.prototype.itemHeight = function() {
        return Math.min(this.innerHeight, 160);
    };
    /**
     * 選択操作が可能かどうかを判定する。
     * 
     * @returns {boolean} 選択操作が可能な場合にはtrue, それ以外はfalse
     */
    Window_ChoiceActorList.prototype.isOkEnabled = function() {
        return true;
    };
    /**
     * キャンセル可能かどうかを判定する。
     * 
     * @returns {boolean} キャンセル可能な場合にはtrue, それ以外はfalse
     */
    Window_ChoiceActorList.prototype.isCancelEnabled = function() {
        return $gameMessage.isChoiceActorCancelable();
    };
    /**
     * OK操作されたときの処理を行う。
     */
    Window_ChoiceActorList.prototype.callOkHandler = function() {
        $gameMessage.onChoiceActor(this.index()); // 選択インデックスでコールバックを実行する。
        this._messageWindow.terminateMessage();
        this.close();
    };
    /**
     * キャンセル操作されたときの処理を行う。
     */
    Window_ChoiceActorList.prototype.callCancelHandler = function() {
        $gameMessage.onChoiceActor(-1); // キャンセルインデックスでコールバックを実行する。
        this._messageWindow.terminateMessage();
        this.close();
    };

    //------------------------------------------------------------------------------
    // Game_Actors
    if (!Game_Actors.prototype.isActorDataExists) { // isActorDataExistsが未定義なら追加。
        /**
         * アクターデータが存在するかどうかを取得する。
         * 
         * @param {number} actorId アクターID
         * @returns {boolean} アクターデータが存在する場合にはtrue, 存在しない場合にはfalse
         */
        Game_Actors.prototype.isActorDataExists = function(actorId) {
            return this._data[actorId] ? true : false;
        };
    }
    //------------------------------------------------------------------------------
    // Game_Message
    const _Game_Message_clear = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.call(this);
        this._choiceActorVariableId = 0;
        this._choiceActors = null;
        this._choiceActorCancelable = true;
    };
    /**
     * アクター選択をセットアップする。
     * 
     * @param {number} variableId 結果を格納する変数ID
     * @param {Array<number>} actors アクターリスト
     * @param {boolean} isCancelable キャンセル可否
     */
    Game_Message.prototype.setChoiceActors = function(variableId, actors, isCancelable) {
        this._choiceActorVariableId = variableId;
        this._choiceActors = actors;
        this._choiceActorCancelable = isCancelable;
    };

    /**
     * アクター選択中かどうかを判定する。
     * 
     * @returns {boolean}アクター選択中の場合にはtrue, それ以外はfalse.
     */
    Game_Message.prototype.isChoiceActor = function() {
        return this._choiceActors != null;
    };

    /**
     * アクター選択をキャセル可能かどうかを判定する。
     * 
     * @returns {boolean} キャンセル可能な場合にはtrue, それ以外はfalse.
     */
    Game_Message.prototype.isChoiceActorCancelable = function() {
        return this._choiceActorCancelable;
    };

    /**
     * アクター選択の選択対象リストを得る。
     * 
     * @returns {Array<number>} アクターIDリスト
     */
    Game_Message.prototype.choiceActors = function() {
        return this._choiceActors || [];
    };

    /**
     * アクター選択されたときの処理を行う。
     * 
     * @param {number} index 選択されたインデックス
     */
    Game_Message.prototype.onChoiceActor = function(index) {
        if ((this._choiceActorVariableId > 0) && this._choiceActors) {
            if ((index >= 0) && (index < this._choiceActors.length)) {
                const actorId = this._choiceActors[index];
                $gameVariables.setValue(this._choiceActorVariableId, actorId);
            } else {
                $gameVariables.setValue(this._choiceActorVariableId, 0);
            }
        }
    };

    const _Game_Message_isBusy = Game_Message.prototype.isBusy;
    /**
     * ビジーかどうかを得る。
     * 
     * @returns {boolean} ビジーの場合にはtrue, それ以外はfalse.
     */
    Game_Message.prototype.isBusy = function() {
        return _Game_Message_isBusy.call(this)
            || this.isChoiceActor();
    };

    //------------------------------------------------------------------------------
    // Game_Interpreter
    /**
     * アクター選択をセットアップする。
     * 
     * params[0] : 結果を格納する変数ID
     * params[1] : 選択タイプ(CHOICEACTOR_FROM_x)
     * params[2] : 選択候補アクター
     * params[3] : 除外アクター
     * params[4] : キャンセル許可/禁止
     * 
     * @param {Array<object>} params パラメータ
     */
    Game_Interpreter.prototype.setupChoiceActors = function(params) {
        const variableId = params[0];
        const actors = this.makeCandidateActors(params[1], params[2], params[3]);
        if (actors.length > 0) {
            const isCancelable = params[4];
            $gameMessage.setChoiceActors(variableId, actors, isCancelable);
        } else {
            $gameVariables.setValue(variableId, 0); // キャンセル
        }
    };

    /**
     * acotrIdで指定されるアクターが選択候補になり得るかどうかを判定する。
     * 
     * @param {number} actorId アクターID
     * @param {Array<number>} exclusionActors 除外アクターリスト
     * @returns {boolean} 候補になる場合にはtrue, それ以外はfalse.
     */
    const _isCandidate = function(actorId, exclusionActors) {
        if (actorId > 0) { // アクターIDは有効？
            const dataActor = $dataActors[actorId];
            if ($dataActors[dataActor.meta.excludeChoiceActor]) { // メタデータで除外指定されている？
                return false;
            }
            if (exclusionActors && exclusionActors.includes(actorId)) { // 除外リストに含まれている？
                return false;
            }

            return true;
        } else {
            return false;
        }
    }

    /**
     * 選択候補のアクターIDリストを作る
     * 
     * @param {number} choiceActorType 選択タイプ(CHOICEACTOR_FROM_x)
     * @param {number} actors アクターリスト(CHOICEACTOR_FROM_CANDIDATES時のみ有効)
     * @param {number} exclusionActors 除外アクターリスト 
     * @returns {Array<number>} アクターリスト
     */
    Game_Interpreter.prototype.makeCandidateActors = function(choiceActorType, actors, exclusionActors) {
        const canditates = [];
        switch (choiceActorType) {
            case CHOICEACTOR_FROM_INSTANCE:
                for (let actorId = 1; actorId < $dataActors.length; actorId++) {
                    if ($gameActors.isActorDataExists(actorId)) {
                        if (_isCandidate(actorId, exclusionActors)) {
                            canditates.push(actorId);
                        }
                    }
                }
                break;
            case CHOICEACTOR_FROM_ALL:
                for (let actorId = 1; actorId < $dataActors.length; actorId++) {
                    if ($gameActors.isActorDataExists(actorId)
                            || $dataActors[actorId].characterName) {
                        if (_isCandidate(actorId, exclusionActors)) {
                            canditates.push(actorId);
                        }
                    }
                }
                break;
            case CHOICEACTOR_FROM_CANDIDATES:
                for (let actorId of actors) {
                    if (actorId > 0) {
                        canditates.push(actorId);
                    }
                }
                break;
            case CHOICEACTOR_FORM_BATTLEMEMBERS:
                for (const actor of $gameParty.battleMembers()) {
                    const actorId = actor.actorId;
                    if (actorId > 0) {
                        canditates.push(actorId);
                    }
                }
                break;
            case CHOICEACTOR_FROM_NOTBATTLEMEMBERS:
                {
                    const battleMembers = $gameParty.battleMembers();
                    for (const actor of $gameParty.allMembers()) {
                        const actorId = actor.actorId;
                        if ((actorId > 0) && !battleMembers.includes(actor)) {
                            canditates.push(actorId);
                        }
                    }
                }
                break;
            case CHOICEACTOR_FROM_PARTY:
            default:
                for (const actor of $gameParty.allMembers()) {
                    const actorId = actor.actorId;
                    if (actorId > 0) {
                        canditates.push(actorId);
                    }
                }
                break;
        }

        return canditates;
    }

    //------------------------------------------------------------------------------
    // Scene_Message
    const _Scene_Message_createAllWindows = Scene_Message.prototype.createAllWindows;
    /**
     * Scene_Messageで使用するウィンドウを全て作成する。
     * 
     * Note: 派生クラスから本メソッドを呼び出し、必要なリソースを構築する必要がある。
     */
    Scene_Message.prototype.createAllWindows = function() {
        _Scene_Message_createAllWindows.call(this);
        this.createChoiceActorListWindow();
    }; 
    /**
     * アクター選択用ウィンドウを作製する。
     */
    Scene_Message.prototype.createChoiceActorListWindow = function() {
        this._choiceActorListWindow = new Window_ChoiceActorList(this.choiceActorListWindowRect());
        this.addWindow(this._choiceActorListWindow);

        // Note: associateWindowsをフックして実装するのが理想だが、
        // associateWindowsはcreateAllWindows()から呼び出されるため、
        // タイミング的に_choiceActorListWindowのインスタンスが生成されていない。
        // そのためここで設定する。
        this._choiceActorListWindow.setMessageWindow(this._messageWindow);
        this._messageWindow.setChoiceActorListWindow(this._choiceActorListWindow);
    };

    /**
     * アクター選択ウィンドウの矩形領域を得る。
     */
    Scene_Message.prototype.choiceActorListWindowRect = function() {
        return new Rectangle(windowX, windowY, windowWidth, windowHeight);
    };

    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();