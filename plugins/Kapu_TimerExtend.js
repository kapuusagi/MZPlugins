/*:ja
 * @target MZ 
 * @plugindesc タイマー拡張プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command getActiveTimeInFrames
 * @text アクティブ時間[フレーム]を取得
 * @desc アクティブ時間をフレーム単位で取得します。厳密な差分をとりたい場合に使用します。
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 値を格納する変数のID
 * @type variable
 * @default 0
 * 
 * 
 * @command getActiveTime
 * @text アクティブ時間[秒]を取得
 * @desc アクティブ時間を秒単位で取得します。厳密な差分が不要な場合に使用します。
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 値を格納する変数のID
 * @type variable
 * @default 0
 * 
 * 
 * @command addTimerEvent
 * @text タイマーイベント追加
 * @desc タイマーイベントを追加する。
 * 
 * @arg id
 * @text イベントID
 * @desc 消去するイベントID
 * @type number
 * @default 0
 * 
 * @arg commonEventId
 * @text コモンイベントID
 * @desc 呼び出すコモンイベントID
 * @type common_event
 * @default 0
 * 
 * @arg seconds
 * @text インターバル時間
 * @desc イベントを呼び出すインターバル時間[秒]
 * @type number
 * @default 60
 * @min 1
 * 
 * @arg isOnce
 * @text 1回のみ呼び出す
 * @desc 1回だけ呼び出す場合にtrue
 * @type boolean
 * @default false
 * 
 * @arg stopInEvents
 * @text イベント中は歩進しない
 * @desc イベント中はカウンタを歩進させない場合にはtrue
 * @type boolean
 * @default false
 * 
 * 
 * @command removeTimerEvent
 * @text タイマーイベント削除
 * @desc タイマーイベントを削除する。
 * 
 * @arg id
 * @text イベントID
 * @desc 消去するイベントID
 * @type number
 * @default 0
 * 
 * 
 * @help 
 * タイマーを拡張し、以下の機能を提供します。
 * ・アクティブ経過時間の取得(マップと戦闘のアクティブ時間だけを合計したもの)
 *   
 * ショップ選択やメニュー選択中は歩進しません。
 * 
 * 一定時間経過でコモンイベントを呼び出す機能の追加。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * プレイ時間を取得するインタフェースは $gameSystem.playtime() がありますが、
 * こちらはシーンの準備中やメニュー画面を開いている間も歩進する。
 * 一方$gameTimerにはマップと戦闘シーンがアクティブな間だけ歩進するタイマーだが、
 * 純粋に経過時間を取得するインタフェースはない。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * アクティブ時間[フレーム]を取得
 *   アクティブ時間をフレーム数単位で取得する。
 * アクティブ時間[秒]を取得
 *   アクティブ時間を秒単位で取得する。
 * タイマーイベント追加
 *   タイマーイベントを追加/変更する。
 *   変更する場合にはカウンタがリセットされる。
 * タイマーイベント削除
 *   タイマーイベントを削除する。
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
    const pluginName = "Kapu_timerExtend";
    // const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "getActiveTimeInFrames", args => {
        const variableId = Number(args.variableId) || 0;
        if (variableId > 0) {
            $gameVariables.setValue(variableId, $gameTimer.activeTimeInFrames());
        }
    });

    PluginManager.registerCommand(pluginName, "getActiveTime", args => {
        const variableId = Number(args.variableId) || 0;
        if (variableId > 0) {
            $gameVariables.setValue(variableId, $gameTimer.activeTime());
        }
    });
    PluginManager.registerCommand(pluginName, "addTimerEvent", args => {
        const id = Math.round(Number(args.id) || 0);
        const commonEventId = Math.round(Number(args.commonEventId) || 0);
        const seconds = Math.max(1, Math.round(Number(args.seconds) || 1));
        const isOnce = (args.isOnce === undefined) ? false : (args.isOnce === "true");
        const stopInEvents = (args.stopInEvents === undefined) ? false : (args.stopInEvents === "true");
        if ((id > 0) && (commonEventId > 0)) {
            $gameTimer.addTimerEvent(id, commonEventId, seconds, isOnce, stopInEvents);
        }
    });
    PluginManager.registerCommand(pluginName, "removeTimerEvent", args => {
        const id = Math.round(Number(args.id) || 0);
        if (id > 0) {
            $gameTimer.removeTimerEvent(id);
        }
    });

    //------------------------------------------------------------------------------
    // Game_Timer
    const _Game_Timer_initialize = Game_Timer.prototype.initialize;
    /**
     * Game_Timerを初期化する。
     */
    Game_Timer.prototype.initialize = function() {
        _Game_Timer_initialize.call(this);
        this._activeTimeInFrames = 0;
        this._timerEvents = [];
    };

    /**
     * 
     * @param {number} id タイマーID
     * @param {number} commonEventId コモンイベントID
     * @param {number} seconds インターバル時間
     * @param {number} isOnce 1回のみ呼び出すかどうか
     * @param {number} stopInEvents イベント実行中は歩進させない場合はtrue
     */
    Game_Timer.prototype.addTimerEvent = function(id, commonEventId, seconds, isOnce, stopInEvents) {
        const event = this._timerEvents.find(e => e.id === id);
        if (event) {
            event.commonEventId = commonEventId;
            event.initialFrameCount = seconds * 60;
            event.frameCount = event.initialFrameCount;
            event.isOnce = isOnce;
            event.stopInEvents = stopInEvents;
        } else {
            const initialFarmeCount = seconds * 60;
            this._timerEvents.push({
                id : id,
                commonEventId : commonEventId,
                initialFrameCount : initialFarmeCount,
                frameCount : initialFarmeCount,
                isOnce : isOnce,
                stopInEvents : stopInEvents
            });
        }
    };

    /**
     * タイマーイベントを消去する。
     * 
     * @param {number} id イベントID
     */
    Game_Timer.prototype.removeTimerEvent = function(id) {
        for (let i = 0; i < this._timerEvents.length; i++) {
            const timerEvent = this._timerEvents[i];
            if (timerEvent.id === id) {
                this._timerEvents.splice(i, 1);
                break;
            }

        }
    };

    const _Game_Timer_update = Game_Timer.prototype.update;
    /**
     * タイマーを更新する。
     * 
     * @param {boolean} sceneActive 
     */
    Game_Timer.prototype.update = function(sceneActive) {
        _Game_Timer_update.call(this, sceneActive);
        if (sceneActive) {
            this._activeTimeInFrames++;
            this.updateTimerEvents();
        }
    };

    /**
     * タイマーイベントを更新する。
     */
    Game_Timer.prototype.updateTimerEvents = function() {
        const isEventRunning = $gameMap.isEventRunning() || $gameTroop.isEventRunning();
        for (const timerEvent of this._timerEvents) {
            if ((timerEvent.frameCount > 0) && (!timerEvent.stopInEvents || !isEventRunning)) {
                timerEvent.frameCount--;
                if (timerEvent.frameCount === 0) {
                    if (timerEvent.commonEventId > 0) {
                        reserveCommonEvent(timerEvent.commonEventId);
                    }
                    if (!timerEvent.isOnce) {
                        // 再カウントする。
                        timerEvent.frameCount = timerEvent.initialFarmeCount;
                    }
                }
            }
        }

        // アクティブでないタイマーイベントは削除
        for (let i = this._timerEvents.length - 1; i >= 0; i--) {
            const timerEvent = this._timerEvents[i];
            if ((timerEvent.frameCount === 0) || (timerEvent.commonEventId === 0)) {
                // このイベントは無効
                this._timerEvents.splice(i, 1);
            }
        }
    };


    /**
     * アクティブ時間[フレーム]を得る。
     * 
     * @returns {number} アクティブ時間[フレーム]
     */
    Game_Timer.prototype.activeTimeInFrames = function() {
        return this._activeTimeInFrames;
    };

    /**
     * アクティブ時間[秒]を得る。
     * 
     * @returns {number} アクティブ時間[秒]
     */
    Game_Timer.prototype.activeTime = function() {
        return this._activeTimeInFrames / 60;
    };

})();