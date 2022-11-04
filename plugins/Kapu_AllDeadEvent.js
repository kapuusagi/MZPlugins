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
 * 
 * @param reviveAtBattleLoseSwitchId
 * @text 戦闘敗北時に復活させるかどうかを制御するスイッチ
 * @desc 戦闘で敗北可能設定されて敗北したとき、復活させるかどうかを制御するスイッチ。設定なしだと無条件で復活させる。
 * @type switch
 * @default 0
 * 
 * @help 
 * 全滅時に特定のコモンイベントを実行するようにするプラグインです。
 * 戦闘中に全滅した場合、敗北可能に設定していた場合は呼び出されません。
 * 
 * コモンイベントを呼び出す前に、フェードアウトします。
 * コモンイベントにて、復帰処理を行った後、適切にフェードイン処理を呼び出す必要があります。
 * 
 * 動作としては次のようになります。
 * a) ランダムエンカウントでの戦闘全滅時
 *     全滅時イベントが設定されている → フェードアウト後、マップに戻ってコモンイベント呼び出し。
 *     全滅時イベントが設定されていない → ゲームオーバー
 * b) イベントでの全滅時(ダメージを与えるコマンドで全滅させた場合)
 *     全滅時イベントが設定されている → イベント処理継続後、全滅イベント呼び出し
 *     全滅時イベントが設定されていない → イベント処理継続後、ゲームオーバー
 * c) イベントからの戦闘で全滅時
 *     敗北許可設定されている
 *         → 戦闘敗北時に復活させるかどうかの制御スイッチ未設定 → 全メンバーがHP1で復活して敗北時処理を実行。
 *         → 戦闘敗北時に復活させるかどうかの制御スイッチがON → 全メンバーがHP1で復活して敗北時処理を実行。
 *         → 戦闘敗北時に復活させるかどうかの制御スイッチがOFF → 敗北時処理を実行。メンバーが全滅したままであれば、そのまま全滅イベントが呼び出される。
 *     敗北許可設定されていない
 *         → 全滅時イベントが設定されている → マップに戻ってコモンイベント呼び出し
 *         → 全滅時イベントが設定されていない → マップに戻ってゲームオーバー
 * 
 * d) アイテム使用での全滅時(パーティーメンバーにダメージを与えるアイテム使用など)
 *      aと同じ
 * 
 * e) 床ダメージでの全滅時
 *     aと同じ
 * 
 * 
 * 
 * ■ 使用時の注意
 * 全滅イベントでは、以下のいずれかを行う必要があります。
 * ・1名以上のパーティーメンバーを復帰させる。
 * ・パーティーメンバーを0にする。
 * ・全滅イベントを0(設定無し)にする。
 * 上記をやらない場合、延々と全滅イベントが呼び出され、復帰しなくなります。
 * 
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
 * Version.1.0.0 動作確認。
 */
(() => {
    'use strict';
    const pluginName = "Kapu_AllDeadEvent";
    const parameters = PluginManager.parameters(pluginName);

    const defaultAllDeadEventId = Math.floor(parameters["defaultAllDeadEventId"]);
    const reviveAtBattleLoseSwitchId = Number(parameters["reviveAtBattleLoseSwitchId"]) || 0;

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
    /**
     * 現在実行中のイベントを強制終了する。
     */
    Game_Map.prototype.terminateCurrentEvent = function() {
        if (this._interpreter.isRunning()) {
            this._interpreter.terminate();
        }
    };

    const _Game_Map_setupStartingEvent = Game_Map.prototype.setupStartingEvent;
    /**
     * 次に実行するイベントをセットアップする。
     * 
     * @returns {boolean} 次に実行するイベントがある場合にはtrue, それ以外はfalse.
     */
    Game_Map.prototype.setupStartingEvent = function() {
        if (this.setupAllDeadEvent()) {
            return true;
        } else {
            return _Game_Map_setupStartingEvent.call(this);
        }
    };

    /**
     * 全滅イベントをセットアップする。
     * 
     * @note 次のイベントをセットアップする(setupStartingEvent())際に呼び出される。
     * @returns {boolean} 次に実行するイベントがある場合にはtrue, それ以外はfalse.
     */
    Game_Map.prototype.setupAllDeadEvent = function() {
        if ($gameParty.isAllDead() // 全滅？
                && ($gameSystem.allDeadEventId() > 0)) { // 全滅イベントが有効？
            const event = $dataCommonEvents[$gameSystem.allDeadEventId()];
            if (event) {
                $gameScreen.startFadeOut(10); //フェードアウトさせる
                this._interpreter.setup(event.list);
                return true;
            }
        }

        return false;
    };
    //------------------------------------------------------------------------------
    // Scene_Base
    const _Scene_Base_checkGameover = Scene_Base.prototype.checkGameover;

    /**
     * ゲームオーバーを確認する。
     */
    Scene_Base.prototype.checkGameover = function() {
        if ($gameParty.isAllDead() && ($gameSystem.allDeadEventId() > 0)) {
            if (SceneManager._scene && SceneManager._scene.constructor !== Scene_Map) { // Scene_Mapでない？
                $gameScreen.startFadeOut(10); //フェードアウトさせる
                SceneManager.goto(Scene_Map); // マップに戻る。
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
                if ((reviveAtBattleLoseSwitchId === 0) // 戦闘敗北時復活制御スイッチが未設定？
                        || $gameSwitches.value(reviveAtBattleLoseSwitchId)) { // 戦闘敗北時復活制御スイッチがON？
                    $gameParty.reviveBattleMembers();
                }
                SceneManager.pop();
            } else {
                if ($gameSystem.allDeadEventId() > 0) {
                    $gameMap.terminateCurrentEvent(); // イベント実行中なら強制終了。
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
})();