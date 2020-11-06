/*:ja
 * @target MZ 
 * @plugindesc アクションステートプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * 
 * @help 
 * 条件実行ステートプラグイン。
 * 
 * ■ 使用時の注意
 * 
 * 
 * ■ プラグイン開発者向け
 * 戦闘中N回復活するようなスペシャル機能を実現するならどうするか。
 * 
 * (1) 戦闘開始時ステート自動ステート付与を追加。
 *     -> 戦闘開始時ステート付与特性(AddStateOnBattleStartプラグイン)
 *        traiatオブジェクトを取得してmetaを検索すればよい。
 * (2) ステートに対して発動条件判定をして、該当するならば、発動処理
 *     -> 条件発動アクション ステートプラグインを作る。(本プラグイン)
 * (3) カウント減らす。カウントがゼロになるとステート解除。
 *     -> 条件発動アクション ステートプラグインを作る(本プラグイン)
 * 
 * アクションの発動判定はBattleManagerでresultを元に判定すると良さそう。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ステート
 *     <action:condition$,skillId#,target$,count#>
 *          condition$ 発動タイミング
 *              "damaged":何かしらHPダメージを受けたとき
 *              "healed":HPが回復した時
 *              "actioned":行動した時(全ての行動が終わったとき1回)
 *              "stateAdded(id,id,id,...)":
 *                  id#のステート(いずれか)が付与された時
 *              "stateRemoved(id,id.id,...)":
 *                  id#のステート(いずれか)が解除された時
 *          skillId#
 *              発動するスキルID
 *          target
 *              発動対象。self(ステート保持者)またはsubject(対象)
 *          count#
 *              発動回数。0で無制限。
 * 
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。つくりかけ
 */
(() => {
    // const pluginName = "Kapu_ActionState";
    // const parameters = PluginManager.parameters(pluginName);

    const _RAISE_DAMAGED = 1;
    const _RAISE_HEALED = 2;
    const _RAISE_ACTIONED = 3;
    const _RAISE_STATE_ADDED = 4;
    const _RAISE_STATE_REMOVED = 5;

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * strをパースしてStateActionオブジェクトを構築する。
     * 
     * @param {String} str 文字列
     * @return {Object} StateActionオブジェクト
     */
    const _parseAction = function(str) {
        const tokens = str.split(",");
        if (tokens.length < 4) {
            return null;
        }
        const skillId = Number(tokens[1]);
        const target = [null, "self", "subject"].indexOf(tokens[2]);
        const count = Number(tokens[3]);
        if ((skillId > 0) && (skillId < $dataSkills.length) && (target > 0) && (count >= 0)) {
            let when = 0;
            let stateIds = [];
            let re;
            if (tokens[0] === "damaged") {
                when = _RAISE_DAMAGED;
            } else if (tokens[0] === "healed") {
                when = _RAISE_HEALED;
            } else if (tokens[0] === "actiond") {
                when = _RAISE_ACTIONED;
            } else if ((re = tokens[0].match(/stateAdded\(([\d,]+)\)/)) !== null) {
                when = _RAISE_STATE_ADDED;
                const ids = re[1].split(",").map(token => Number(token) || 0);
                for (const id of ids) {
                    if ((id > 0) && (id < $dataStates.length) && !stateIds.includes(id)) {
                        stateIds.push(id);
                    }
                }
            } else if ((re = tokens[0].match(/stateRemoved\(([\d,]+)\)/)) !== null) {
                when = _RAISE_STATE_REMOVED;
                for (const id of ids) {
                    if ((id > 0) && (id < $dataStates.length) && !stateIds.includes(id)) {
                        stateIds.push(id);
                    }
                }
            }
            if (when > 0) {
                return {
                    when:when,
                    stateId:stateId,
                    skillId:skillId,
                    target:target,
                    count:count
                };
            }
        }
        return null;
    };
    /**
     * ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processNoteTag = function(obj) {
        obj.action = null;
        obj.removeByActionCount = false;
        if (obj.meta.action) {
            obj.action = _parseAction(obj.meta.action);
            if (obj.action && obj.action.count > 0) {
                obj.removeByActionCount = true;
            }
        }
    };

    DataManager.addNotetagParserActors(_processNoteTag);
    DataManager.addNotetagParserClasses(_processNoteTag);
    DataManager.addNotetagParserWeapons(_processNoteTag);
    DataManager.addNotetagParserArmors(_processNoteTag);
    DataManager.addNotetagParserStates(_processNoteTag);
    DataManager.addNotetagParserEnemies(_processNoteTag);

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_clearStates = Game_BattlerBase.prototype.clearStates;
    /**
     * このGame_BattlerBaseのステートをクリアする。
     */
    Game_BattlerBase.prototype.clearStates = function() {
        _Game_BattlerBase_clearStates.call(this);
        this._stateRaiseCounts = {};
    };

    const _Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
    /**
     * このGame_BattlerBaseからstateIdで指定されるステートを取り除く。
     * _statesと_stateTurnsに対する操作を行う。
     * 
     * @param {Number} stateId ステートID
     */
    Game_BattlerBase.prototype.eraseState = function(stateId) {
        _Game_BattlerBase_eraseState.call(this, stateId);
        delete this._stateRaiseCounts[stateId];
    };

    const _Game_BattlerBase_resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;
    /**
     * 指定したステートのカウンタをリセットする。
     * 
     * @param {Number} stateId ステートID
     */
    Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
        _Game_BattlerBase_resetStateCounts.call(this, stateId);
        const state = $dataStates[stateId];
        this._stateRaiseCounts[stateId] = state.action ? state.action.count : 0;
    };

    /**
     * ステートアクションの残りカウントがなくなったかどうかを取得する。
     * 
     * @param {Number} stateId ステートID
     * @return {Boolean} ステートアクションの残りカウントが無い場合にはtrue, それ以外はfalse.
     */
    Game_BattlerBase.prototype.isStateActionNoLeft = function(stateId) {
        return this._stateRaiseCounts[stateId] === 0;
    };

    /**
     * ステートアクションのカウントを減算する。
     * 
     * @param {Number} stateId ステートID
     */
    Game_BattlerBase.prototype.decreaseStateActionCount = function(stateId) {
        this._stateRaiseCounts[stateId]--;
    };

    /**
     * このGame_BattlerBaseのStateActionを持ったステートを返す。
     * 
     * @return {Array<DataState>} ステート配列
     */
    Game_BattlerBase.stateActions = function() {
        return this.states().filter(state => state.action !== null);
    };

    //------------------------------------------------------------------------------
    // Game_Battler

    //------------------------------------------------------------------------------
    // BattleManager
    const _BattleManager_invokeAction = BattleManager.invokeAction;
    
    /**
     * アクションを実行する。
     * 
     * @param {Game_BattlerBase} subject 使用者
     * @param {Game_BattlerBase} target 対象
     */
    BattleManager.invokeAction = function(subject, target) {
        _BattleManager_invokeAction.call(this, subject, target);

        /* ダメージが入った/回復した/ステート付与/ステート解除 時の処理はここ */
    };


    const _BattleManager_endAction = BattleManager.endAction;
    /**
     * アクターまたはエネミーのアクションが完了したときの処理を行う。
     */
    BattleManager.endAction = function() {
        // 行動終了時の判定はここ。

        _BattleManager_endAction.call(this);
    };

})();