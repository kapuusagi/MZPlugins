/*:ja
 * @target MZ 
 * @plugindesc アクションステートプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_State
 * @orderAfter Kapu_Base_State
 * 
 * @help 
 * 条件実行ステートプラグイン。
 * 以下のようなものが実現できます。
 * ・戦闘不能時自動的に復帰させる効果を持つステート。
 * ・反撃（カウンターじゃない）ステート。
 *   カウンターはダメージを受けないアクション。ダメージを受けた上で実行されるアクション。
 * 
 * ■ 使用時の注意
 * BattleManager周りに手を入れているので、
 * 戦闘システム系プラグインと競合する可能性があります。
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
 *   <action:condition$,skillId#,target$,count#>
 *     condition$ 発動タイミング
 *       "damaged":何かしらHPダメージを受けたとき
 *       "healed":HPが回復した時
 *       "actioned":行動した時(全ての行動が終わったとき1回)
 *       "stateAdded(id,id,id,...)":
 *                  id#のステート(いずれか)が付与された時
 *       "stateRemoved(id,id.id,...)":
 *                  id#のステート(いずれか)が解除された時
 *       "dead":死亡したとき
 *     skillId#
 *       発動するスキルID
 *     target
 *       発動対象。self(ステート保持者)またはsubject(対象)
 *     count#
 *       発動回数。0で無制限。
 * 
 * スキル
 *   <effectOnly>
 *     スキル発動条件をチェックしない
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */

/**
 * Game_SubAction
 * サブアクションクラス
 */
function Game_SubAction() {
    this.initialize(...arguments);       
} 
(() => {
    // const pluginName = "Kapu_ActionState";
    // const parameters = PluginManager.parameters(pluginName);

    const _TARGET_SELF = 1;
    const _TARGET_SUBJECT = 2;
    const _RAISE_DAMAGED = 1;
    const _RAISE_HEALED = 2;
    const _RAISE_ACTIONED = 3;
    const _RAISE_STATE_ADDED = 4;
    const _RAISE_STATE_REMOVED = 5;
    const _RAISE_DEAD = 6;

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * strをパースしてStateActionオブジェクトを構築する。
     * 
     * @param {String} str 文字列
     * @returns {Object} StateActionオブジェクト
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
            } else if (tokens[0] === "actioned") {
                when = _RAISE_ACTIONED;
            } else if (tokens[0] === "dead") {
                when = _RAISE_DEAD;
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
                    stateIds:stateIds,
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
     * @returns {Boolean} ステートアクションの残りカウントが無い場合にはtrue, それ以外はfalse.
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
     * @returns {Array<DataState>} ステート配列
     */
    Game_BattlerBase.prototype.stateActions = function() {
        return this.states().filter(state => state.action !== null);
    };

    const _Game_BattlerBase_isClearStateByDie = Game_BattlerBase.prototype.isClearStateByDie;
    /**
     * 戦闘不能時クリアするステートかどうかを判定する。
     * 
     * @param {Number} stateId ステートID
     * @returns {Boolean} 戦闘不能時クリアステートの場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isClearStateByDie = function(stateId) {
        const state = $dataStates[stateId];
        if (state.action && (state.action.when === _RAISE_DEAD)) {
            return false;
        }

        return _Game_BattlerBase_isClearStateByDie.call(this, stateId);
    };

    //------------------------------------------------------------------------------
    // Game_Battler
    /**
     * 結果にマッチするアクションを得る。
     * 
     * @returns {Array<Game_SubAction>} サブアクション配列
     */
    Game_Battler.prototype.makeSubActionOfMeetsResult = function(subject) {
        const result = this.result();
        const stateActions = this.stateActions();
        const actions = [];
        for (const stateAction of stateActions) {
            if (this.meetsStateActionOfResult(stateAction, result)) {
                const subAction = this.makeSubAction(stateAction, subject);
                if (subAction) {
                    actions.push(subAction);
                }
            }
        }

        return actions;
    };
    /**
     * 行動終了時のサブアクションを得る。
     * 
     * @returns {Array<Game_SubAction>} サブアクション配列
     */
    Game_Battler.prototype.makeSubActionOfActionEnd = function() {
        const stateActions = this.stateActions();
        const actions = [];
        for (const stateAction of stateActions) {
            if (stateAction.action.when === _RAISE_ACTIONED) {
                const subAction = this.makeSubAction(stateAction, this);
                if (subAction) {
                    actions.push(subAction);
                }
            }
        }

        return actions;
    };

    /**
     * Dead条件のサブアクションを作成する。
     * 
     * @returns {Array<Game_SubAction>} サブアクション配列
     */
    Game_Battler.prototype.makeSubActionOfDeadCondtion = function() {
        const stateActions = this.stateActions();
        const actions = [];
        for (const stateAction of stateActions) {
            if (stateAction.action.when === _RAISE_DEAD) {
                const subAction = this.makeSubAction(stateAction, this);
                if (subAction) {
                    actions.push(subAction);
                }
            }
        }

        return actions;
    };

    /**
     * StateActionの実行カウントを更新する。
     * 
     * @param {Number} stateId ステートID
     */
    Game_Battler.prototype.updateStateActionCount = function(stateId) {
        const stateAction = $dataStates[stateId];
        if (stateAction && stateAction.action && (stateAction.action.count > 0)) {
            this.decreaseStateActionCount(stateId);
            if (this.isStateActionNoLeft(stateId)) {
                this.eraseState(stateId);
            }
        }
    };

    /**
     * サブアクションを構築する。
     * 
     * @param {DataState} stateAction StateActionデータ
     * @param {Game_Battler} subject スキル使用者（該当するものがいない場合にはnull）
     * @returns {Game_SubAction} サブアクション。サブアクション実行条件を満たさない場合にはnull.
     */
    Game_Battler.prototype.makeSubAction = function(stateAction, subject) {
        const action = new Game_SubAction(this);
        const skillId = (stateAction.action.skillId === 1)
                ? this.attackSkillId() : stateAction.action.skillId;
        const skill = $dataSkills[skillId];
        action.setItemObject(skill);
        if (action.isForOpponent() && (this === subject)) {
            // このアクションは敵対者向けのアクションなので、
            // 自分に追撃は発動しない。
            return null;
        }
        const targets = this.stateActionTargets(stateAction, subject);
        if ((targets === null) || (targets.length === 0)) {
            return null;
        }
        if (!((stateAction.action.when === _RAISE_DEAD)
                || skill.meta.effectOnly || action.isValid())) {
            return null;
        }
        action.setTargets(targets);
        action.setStateActionId(stateAction.id);
        return action;
    };

    /**
     * ステートが含まれるかどうかを判定する。
     * 
     * @param {Array<Number>} ids 一致対象のステート
     * @param {Number} stateIds ステートIDの配列
     * @returns {Boolean} ステートが含まれる場合にはtrue, それ以外はfalse
     */
    const _stateIncludes = function(ids, stateIds) {
        for (const stateId of stateIds) {
            if (ids.includes(stateId)) {
                return true;
            }
        }

        return false;
    };

    /**
     * stateActionの発動条件に、resultが一致するかどうかを判定する。
     * 
     * @returns {Boolean} 一致した場合にはtrue, それ以外はfalse
     */
    Game_Battler.prototype.meetsStateActionOfResult = function(stateAction, result) {
        return ((stateAction.action.when === _RAISE_DAMAGED) && (result.hpDamage > 0))
                || ((stateAction.action.when === _RAISE_HEALED) && (result.hpDamage < 0))
                || ((stateAction.action.when === _RAISE_STATE_ADDED) && _stateIncludes(stateAction.action.stateIds))
                || ((stateAction.action.when === _RAISE_STATE_REMOVED) && _stateIncludes(stateAction.action.stateIds));
    };

    /**
     * ステートアクションの対象を得る。
     * 
     * @param {DataState} stateAction アクション
     * @param {Game_Battler} subject 使用者
     * @returns {Game_Battler} 使用者
     */
    Game_Battler.prototype.stateActionTargets = function(stateAction, subject) {
        switch (stateAction.action.target) {
            case _TARGET_SELF:
                return [ this ];
            case _TARGET_SUBJECT:
                return [ subject ];
            default:
                return null;
        }
    };

    //------------------------------------------------------------------------------
    // Game_SubAction

    Game_SubAction.prototype = Object.create(Game_Action.prototype);
    Game_SubAction.prototype.constructor = Game_SubAction;

    /**
     * Game_SubActionを初期化する。
     * 
     * @param {Game_Battler} subject 使用者
     */
    Game_SubAction.prototype.initialize = function(subject) {
        Game_Action.prototype.initialize.call(this, subject, false);
    };

    /**
     * このアクションをクリアする。
     */
    Game_SubAction.prototype.clear = function() {
        Game_Action.prototype.clear.call(this);
        this._targets = null;
        this._stateActionId = 0;
    };

    /**
     * ターゲットを設定する。
     * 
     * @param {Array<Game_Battler>} targets ターゲット
     */
    Game_SubAction.prototype.setTargets = function(targets) {
        this._targets = targets;
    };

    /**
     * ターゲットを取得する。
     * 
     * @returns {Array<Game_Battler>} ターゲット
     */
    Game_SubAction.prototype.targets = function() {
        return this._targets;
    };

    /**
     * ステートアクションIDを設定する。
     * 
     * @param {Number} id ID
     */
    Game_SubAction.prototype.setStateActionId = function(id) {
        this._stateActionId = id;
    };

    /**
     * ステートアクションIDを得る。
     * 
     * @returns {Number} ステートアクションID
     */
    Game_SubAction.prototype.stateActionId = function() {
        return this._stateActionId;
    };

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
        this._lastTarget = null;
        _BattleManager_invokeAction.call(this, subject, target);

        /* ダメージが入った/回復した/ステート付与/ステート解除 時の処理はここ */
        this._subActions = this._lastTarget.makeSubActionOfMeetsResult(subject);
        if ((this._subActions.length === 0) && this._lastTarget.isDead()) {
            this._subActions = this._lastTarget.makeSubActionOfDeadCondtion();
        }
        if (this._subActions.length > 0) {
            this._subActionCallBack = BattleManager.endSubActionOnInvokeAction;
            const subAction = this._subActions.shift();
            this.invokeSubAction(subAction);
        }
    };
    /**
     * 通常アクション（使用者から対象）を処理する。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! BattleManager.invokeNormalAction()
     *     最終ターゲットを保存するため、オーバーライドする。
     */
    BattleManager.invokeNormalAction = function(subject, target) {
        const realTarget = this.applySubstitute(target);
        this._action.apply(realTarget);
        this._logWindow.displayActionResults(subject, realTarget);
        this._lastTarget = realTarget;
    };

    /**
     * カウンター（対象から使用者）を処理する。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! BattleManager.invokeCounterAttack()
     *     最終ターゲットを保存するため、オーバーライドする。
     */
    BattleManager.invokeCounterAttack = function(subject, target) {
        const action = new Game_Action(target);
        action.setAttack();
        action.apply(subject);
        this._logWindow.displayCounter(target);
        this._logWindow.displayActionResults(target, subject);
        this._lastTarget = target;
    };

    /**
     * 魔法反射（対象から使用者）を処理する。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! BattleManager.invokeMagicReflection()
     *     最終ターゲットを保存するため、オーバーライドする。
     */
    BattleManager.invokeMagicReflection = function(subject, target) {
        this._action._reflectionTarget = target;
        this._logWindow.displayReflection(target);
        this._action.apply(subject);
        this._logWindow.displayActionResults(target, subject);
        this._lastTarget = target;
    };


    /**
     * サブアクションが全て完了時の処理を行う。
     */
    BattleManager.endSubActionOnInvokeAction = function() {
        this._phase = "action";
    };

    /**
     * サブアクションを実行する。
     * 
     * @param {Game_SubAction} subAction サブアクション
     */
    BattleManager.invokeSubAction = function(subAction) {
        const subject = subAction.subject();
        const targets = subAction.targets();
        subAction.prepare();
        subject.useItem(subAction.item());
        subject.updateStateActionCount(subAction.stateActionId());
        subAction.applyGlobal();
        this._logWindow.startAction(subject, subAction, targets);
        this._subAction = subAction;
        this._subActionTargets = targets;
        this._phase = "subAction";
    };

    const _BattleManager_updatePhase = BattleManager.updatePhase;
    /**
     * フェーズを更新する。
     * 
     * @param {Boolean} timeActive アクティブの場合にはtrue, それ以外はfalse
     */
    BattleManager.updatePhase = function(timeActive) {
        if (this._phase === "subAction") {
            this.updateSubAction();
        } else {
            _BattleManager_updatePhase.call(this, timeActive);
        }
    };

    /**
     * サブアクションを更新する。
     */
    BattleManager.updateSubAction = function() {
        this._logWindow.push("pushBaseLine");
        const subject = this._subAction.subject();
        const targets = this._subActionTargets;
        if (targets.length > 0) {
            const target = targets.shift();
            this._subAction.apply(target);
            this._logWindow.displayActionResults(subject, target);
            this._logWindow.push("pushBaseLine");
        } else {
            if (this._subActions.length > 0) {
                const subAction = this._subActions.shift();
                this.invokeSubAction(subAction);
            } else {
                this.endSubAction();
            }
        }
    };

    /**
     * サブアクションを終了する。
     */
    BattleManager.endSubAction = function() {
        this._subAction = null;
        this._subActionCallBack();
    };

    const _BattleManager_endAction = BattleManager.endAction;
    /**
     * アクターまたはエネミーのアクションが完了したときの処理を行う。
     */
    BattleManager.endAction = function() {
        // 行動終了時の判定はここ。
        const subject = this._subject;
        this._subActions = subject.makeSubActionOfActionEnd();
        if (this._subActions.length === 0) {
            this._subActions = this.deadMemberSubActions();
        }
        if (this._subActions.length > 0) {
            this._subActionCallBack = BattleManager.endSubActionOnEndAction;
            const subAction = this._subActions.shift();
            this.invokeSubAction(subAction);
        } else {
            _BattleManager_endAction.call(this);
        }
    };

    /**
     * 行動終了時のサブアクションが完了したときの処理を行う。
     */
    BattleManager.endSubActionOnEndAction = function() {
        this._subActions = this.deadMemberSubActions();
        if (this._subActions.length > 0) {
            const subAction = this._subActions.shift();
            this.invokeSubAction(subAction);
        } else {
            _BattleManager_endAction.call(this);
        }
    };

    /**
     * 死亡条件のサブアクションを作成する。
     * 
     * @returns {Array<Game_SubAction>} サブアクション配列
     */
    BattleManager.deadMemberSubActions = function() {
        for (const member of $gameParty.members()) {
            if (member.isDead()) {
                const actions = member.makeSubActionOfDeadCondtion();
                if (actions.length > 0) {
                    return actions;
                }
            }
        }
        for (const member of $gameTroop.members()) {
            if (member.isDead()) {
                const actions = member.makeSubActionOfDeadCondtion();
                if (actions.length > 0) {
                    return actions;
                }
            }
        }
        return [];
    };

    const _BattleManager_checkBattleEnd = BattleManager.checkBattleEnd;
    /**
     * 戦闘終了かどうかを判定する。
     * 
     * @returns {Boolean} 戦闘終了の場合にはtrue, それ以外はfalse
     */
    BattleManager.checkBattleEnd = function() {
        if (this._phase === "subAction") {
            return false;
        } else {
            return _BattleManager_checkBattleEnd.call(this);
        }
    };

})();
