/*:ja
 * @target MZ 
 * @plugindesc 全滅時のイベントを追加するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command changeEvent
 * @text 全滅時に呼び出すイベントを変更する
 * 
 * @arg eventId
 * @text イベントID
 * @desc 全滅時に呼び出すコモンイベント。0にするとベースシステムの敗北処理になります。
 * @type common_event
 * @default 0
 * 
 * @param defaultAllDeadEventId
 * @text 全滅時呼び出すコモンイベントの初期値。
 * @desc ゲームスタート時に設定される、全滅時に呼び出すコモンイベント。0にするとベースシステムの敗北処理になります。
 * @type common_event
 * @default 0
 * 
 * @help 
 * 全滅時に特定のコモンイベントを実行するようにするプラグインです。
 * 戦闘中に全滅した場合、敗北可能に設定していた場合は呼び出されません。
 * 
 * <Note>
 * イベント処理中に全滅すると、こっちのイベントが優先されるので、
 * 期待した動作をしないかも。
 * 
 * ■ 使用時の注意
 * BattleManager.updateBattleEnd()をオーバーライドする系統のプラグインと競合します。
 * プラグインにより、全滅処理が追加されている場合、
 * このプラグインで設定したイベントが呼び出されない場合があります。
 * 
 * 
 * ■ プラグイン開発者向け
 * Scene_Mapでない時は、Scene_Mapに戻るまでSceneManager.pop()で戻す。
 * Scene_Mapからは$gameMap.update(sceneActive)が呼び出されるので、
 * その中で全滅判定時のコモンイベントを処理する。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 全滅時に呼び出すイベントを変更する。
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
(() => {
    'use strict';
    const pluginName = "Kapu_AllDeadEvent";
    const parameters = PluginManager.parameters(pluginName);

    const defaultAllDeadEventId = Math.floor(parameters["defaultAllDeadEventId"]);

    PluginManager.registerCommand(pluginName, "changeEvent", args => {
        const eventId = Math.floor(Number(args.eventId) || 0);
        if ((eventId >= 0) && (eventId < $dataCommonEvents.length)) {
            $gameSystem.setAllDeadEventId(eventId);
        }
    });
    //------------------------------------------------------------------------------
    // Game_System

    const _Game_System_initialize = Game_System.prototype.initialize;
    /**
     * Game_Systemを初期化する。
     */
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._allDeadEventId = defaultAllDeadEventId;
    };
    /**
     * 全滅時に呼び出すイベントIDを設定する。
     * 
     * @param {number} eventId イベントID
     */
    Game_System.prototype.setAllDeadEventId = function(eventId) {
        this._allDeadEventId = eventId;
    };
    /**
     * 全滅時に呼び出すイベントIDを得る。
     * 
     * @returns {number} 全滅時イベントID
     */
    Game_System.prototype.allDeadEventId = function() {
        return this._allDeadEventId;
    };

    //------------------------------------------------------------------------------
    // Game_Map
    const _Game_Map_initialize = Game_Map.prototype.initialize;
    /**
     * Game_Mapを初期化する。
     */
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.call(this);
        this._allDeadEventInterpreter = null;
    };

    const _Game_Map_update = Game_Map.prototype.update;
    /**
     * Game_Mapを更新する。
     * 
     * @param {boolean} sceneActive シーンがアクティブかどうか
     */
    Game_Map.prototype.update = function(sceneActive) {
        if (sceneActive) {
            this.updateAllDeadEvent();
        }
        _Game_Map_update.call(this, sceneActive);
    };

    /**
     * 全滅時実行イベントを更新する。
     */
    Game_Map.prototype.updateAllDeadEvent = function() {
        if ($gameParty.isAllDead()) {
            if ($gameSystem.allDeadEventId() > 0) { // 全滅時実行イベントが設定されている？
                if (this._allDeadEventInterpreter == null) {
                    const dataCommonEvent = $dataCommonEvents[$gameSystem.allDeadEventId];
                    this._allDeadEventInterpreter = new Game_Interpreter()
                    this._allDeadEventInterpreter.setup(dataCommonEvent.list);
                }
            } else {
                SceneManager.goto(Scene_Gameover); // ゲームオーバーにする。
            }
        }
    };
    const _Game_Map_updateInterpreter = Game_Map.prototype.updateInterpreter;

    /**
     * 実行中のインタプリタを更新する。
     * 
     * 全滅時イベント実行中は、他のインタプリタを更新しない。
     */
    Game_Map.prototype.updateInterpreter = function() {
        if (this._allDeadEventInterpreter) { // 全滅時イベント実行中？
            if (this._allDeadEventInterpreter.isRunning()) {
                this._allDeadEventInterpreter.update();
            } else {
                if ($gameParty.isAllDead()) {
                    // 動作完了しているが、isAllDead()条件を満たしたままなので、ハングアップ
                    SceneManager.goto(Scene_Gameover); // ゲームオーバーにする。
                } else {
                    this._allDeadEventInterpreter = null; // 全滅時実行イベントを終了。
                }
            }
        } else {
            _Game_Map_updateInterpreter.call(this);            
        }

    };

    const _Game_Map_updateEvents = Game_Map.prototype.updateEvents;
    /**
     * イベントを更新する。
     * 
     * @note 全滅時イベントが実行中、イベントのトリガ判定を行わない。
     */
    Game_Map.prototype.updateEvents = function() {
        if (!this._allDeadEventInterpreter) { // 全滅時イベントは実行中でない？
            _Game_Map_updateEvents.call(this);
        }
    };


    //------------------------------------------------------------------------------
    // Scene_Base
    const _Scene_Base_checkGameover = Scene_Base.prototype.checkGameover;

    /**
     * ゲームオーバーを確認する。
     */
    Scene_Base.prototype.checkGameover = function() {
        if ($gameParty.isAllDead() && ($gameSystem.allDeadEventId() > 0)) {
            if (SceneManager._scene && SceneManager._scene.constructor !== SceneMap) { // Scene_Mapでない？
                $gameScreen.startFadeOut(10); //フェードアウトさせる
                SceneManager.pop(); // 前のシーンに戻す。
            }
        } else {
            _Scene_Base_checkGameover.call(this);            
        }
    };
    //------------------------------------------------------------------------------
    // BattleManager
    /**
     * 戦闘終了時の更新処理を行う。
     * 
     * @note 状況にあわせて遷移先を切り替える。
     * !!!overwrite!!! BattleManager.updateBattleEnd()
     *     全滅時の遷移先を変更するため、オーバーライドする。
     */
    BattleManager.updateBattleEnd = function() {
        if (this.isBattleTest()) {
            AudioManager.stopBgm();
            SceneManager.exit();
        } else if (!this._escaped && $gameParty.isAllDead()) {
            if (this._canLose) {
                $gameParty.reviveBattleMembers();
                SceneManager.pop();
            } else {
                if ($gameSystem.allDeadEventId() > 0) {
                    $gameScreen.startFadeOut(10); //フェードアウトさせる
                    SceneManager.pop(); // マップに戻る
                } else {
                    SceneManager.goto(Scene_Gameover);
                }
            }
        } else {
            SceneManager.pop();
        }
        this._phase = "";
    };    


    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();