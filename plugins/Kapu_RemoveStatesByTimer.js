/*:ja
 * @target MZ 
 * @plugindesc 時間経過によるステート解除プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @help 
 * 時間経過によりステートを解除する機能を追加します。
 * タイマーはマップ及び戦闘中にシーンがアクティブな間経過します。
 * メニュー表示中はタイマーが止まります。
 * 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ステート
 *   <removeByTime:sec#>
 *     sec#だけ時間が経過すると解除される。
 *   <resetTimerMode:mode$>
 *     ステートが付与されたときの動作をmodeにする。
 *     本プラグインでサポートしているのは以下の通り
 *     reset : removeByTimeで指定した時間にリセットする。
 *     add : removeByTimeで指定した時間を加算する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_RemovestatesByTimer";
    // const parameters = PluginManager.parameters(pluginName);
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_clearStates = Game_BattlerBase.prototype.clearStates;
    /**
     * このGame_BattlerBaseのステートをクリアする。
     */
    Game_BattlerBase.prototype.clearStates = function() {
        _Game_BattlerBase_clearStates.call(this);
        this._stateTimers = {};
    };

    const _Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
    /**
     * このGame_BattlerBaseからstateIdで指定されるステートを取り除く。
     * _statesと_stateTurnsに対する操作を行う。
     * 
     * @param {number} stateId ステートID
     */
    Game_BattlerBase.prototype.eraseState = function(stateId) {
        _Game_BattlerBase_eraseState.call(this, stateId);
        delete this._stateTimers[stateId];
    };

    const _Game_BattlerBase_resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;    
    /**
     * 指定したステートのカウンタをリセットする。
     * 
     * @param {number} stateId ステートID
     */
    Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
        _Game_BattlerBase_resetStateCounts.call(this, stateId);

        const state = $dataStates[stateId];
        if (state.meta.removeByTime) {
            const timerPeriod = Math.max(0, Math.round(Number(state.meta.removeByTime) || 0));
            if (state.meta.resetTimerMode === "add") {
                this._stateTimers[stateId] = (this._stateTimers[stateId] || 0) + timerPeriod;
            } else {
                this._stateTimers[stateId] = timerPeriod;
            }
        } else {
            this._stateTimers[stateId] = 0;
        }
    };

    /**
     * 時間経過により、指定したステートが解除可能かどうかを得る。
     * 
     * @param {number} stateId ステートID
     * @returns {boolean} 時間経過で解除可能な場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isStateTimerExpired = function(stateId) {
        return this._stateTimers[stateId] === 0;
    };


    //------------------------------------------------------------------------------
    // Game_Battler
    /**
     * 時間制限のあるステートを更新する。
     */
    Game_Battler.prototype.updateTimeLimitedStates = function() {
        for (const state of this.states()) {
            if (state.meta.removeByTime) {
                if (this._stateTimers[state.id] > 0) {
                    this._stateTimers[state.id]--;
                    if (this._stateTimers[state.id] === 0) {
                        this.removeState(state.id);
                    }
                }
            }
        }
    };
    //------------------------------------------------------------------------------
    // Game_Unit
    /**
     * 時間制限ありステートを更新する。
     */
    Game_Unit.prototype.updateTimeLimitedStates = function() {
        for (const member of this.allMembers()) {
            member.updateTimeLimitedStates();
        }
    };


    //------------------------------------------------------------------------------
    // Game_Timer
    const _Game_Timer_initialize = Game_Timer.prototype.initialize;
    /**
     * Game_Timerを初期化する。
     */
    Game_Timer.prototype.initialize = function() {
        _Game_Timer_initialize.call(this);
        this._removeStatesTimerFrames = 60;
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
            this._removeStatesTimerFrames--;
            if (this._removeStatesTimerFrames === 0) {
                this.updateTimeLimitedStates();
                this._removeStatesTimerFrames = 60;
            }
        }
    };

    /**
     * 時間制限ステートを更新する。
     */
    Game_Timer.prototype.updateTimeLimitedStates = function() {
        $gameParty.updateTimeLimitedStates();
        if ($gameParty.inBattle()) {
            $gameTroop.updateTimeLimitedStates();
        }
    };
})();