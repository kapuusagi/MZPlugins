/*:ja
 * @target MZ 
 * @plugindesc 条件ステートプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @help 
 * 条件によりステートを付与するプラグイン。
 * 当初パッシブステートに条件を付けれる方向で実装したが、
 * パフォーマンスが悪すぎたのでやめた。
 * 
 * ■ 使用時の注意
 * 特にありません。
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
 * アクター、クラス、エネミー、スキル、ウェポン、アーマー
 *     <conditionState:conditoinEval$,stateId#, stateId#,...>
 *         eval(conditionEval$)がtrueの時、stateIdのステートが付与される。
 *         1つのオブジェクトあたり、任意数指定可能。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */
(() => {
    //const pluginName = "Kapu_StatesWithCondition";

    /**
     * 条件付きパッシブステートを解析し、オブジェクトを生成する。
     * 
     * @param {String} str 解析対象の文字列
     * @return {ConditionState} 条件付きパッシブステートオブジェクト。解析エラーの場合にはnull.
     */
    const _parseCondition = function(str) {
        const tokens = str.split(",");
        if (tokens.length > 1) {
            const states = [];
            for (let i = 1; i < tokens.length; i++) {
                const stateId = Number(tokens[i]);
                if ((stateId > 0) && !states.includes(stateId)) {
                    states.push(stateId)
                }
            }
            if (states.length > 0) {
                return {
                    condition : tokens[0],
                    states : states
                };
            }
        }

        return null;
    };

    /**
     * ノートタグを処理する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        obj.conditionStates = []; // No entry.
        const pattern = /<conditionState:(.*)+>/;

        const lines = obj.note.split(/[\r\n]+/);
        for (line of lines) {
            const re = line.match(pattern);
            if (re) {
                const conditionState = _parseCondition(re[1]);
                if (conditionState) {
                    obj.conditionStates.push(conditionState);
                }
            }
        }
    };
    DataManager.addNotetagParserActors(_processNotetag);
    DataManager.addNotetagParserClasses(_processNotetag);
    DataManager.addNotetagParserEnemies(_processNotetag);
    DataManager.addNotetagParserSkills(_processNotetag);
    DataManager.addNotetagParserWeapons(_processNotetag);
    DataManager.addNotetagParserArmors(_processNotetag);

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    /**
     * Game_BattlerBaseのパラメータを初期化する。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._conditionStateIds = [];
    };

    const _Game_BattlerBase_states = Game_BattlerBase.prototype.states;
    /**
     * このGame_Battlerのステートを返す。
     * 
     * @return {Array<DataState>} ステート
     */
    Game_BattlerBase.prototype.states = function() {
        let states = _Game_BattlerBase_states.call(this);
        for (const state of this.conditionStates()) {
            if (!states.includes(state)) {
                states.push(state);
            }
        }
        return states;
    };

    /**
     * 条件付きステートを得る。
     * 
     * @return {Array<DataState>} 条件付きステート
     */
    Game_BattlerBase.prototype.conditionStates = function() {
        return this._conditionStateIds.map(id => $dataStates[id]);
    };

    const _Game_BattlerBase_isStateAffected = Game_BattlerBase.prototype.isStateAffected;
    /**
     * stateIdで指定されるステートを持っているかどうかを取得する。
     * 
     * @param {Number} stateId ステートID
     * @return {Boolean} ステートを持っている場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isStateAffected = function(stateId) {
        if (this.isConditionStateAffected(stateId)) {
            return true;
        } else {
            return _Game_BattlerBase_isStateAffected.call(this, ...arguments);
        }
    };

    /**
     * stateIdで指定されるステートを持っているかどうかを取得する。
     * 
     * @param {Number} stateId ステートID
     * @return {Boolean} ステートを持っている場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isConditionStateAffected = function(stateId) {
        return this._conditionStateIds.includes(stateId);
    };

    /**
     * 条件付きステートを更新する。
     */
    Game_BattlerBase.prototype.updateConditionStates = function() {
        const stateIds = [];
        for (const obj of this.conditionStateObjects()) {
            for (const conditionState of obj.conditionStates) {
                try {
                    const a = this;
                    if (eval(conditionState.condition)) {
                        for (const stateId of conditionState.states) {
                            if (!stateIds.includes(stateId)) {
                                stateIds.push(stateId);
                            }
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        this._conditionStateIds = stateIds;
    };

    /**
     * 条件付きステートを持ったオブジェクトを返す。
     * Game_Actor/Game_Enemyにて、本メソッドを実装してオブジェクトを返すようにする。
     * 
     * @return {Array<Object>} 条件付きステートデータを持ったオブジェクト
     */
    Game_BattlerBase.prototype.conditionStateObjects = function() {
        return [];
    };

    const _Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
    /**
     * 更新する
     */
    Game_BattlerBase.prototype.refresh = function() {
        this.updateConditionStates();
        _Game_BattlerBase_refresh.call(this);
    };

    const _Game_BattlerBase_recoverAll = Game_BattlerBase.prototype.recoverAll;
    /**
     * 全状態を回復させる。
     */
    Game_BattlerBase.prototype.recoverAll = function() {
        _Game_BattlerBase_recoverAll.call(this);
        // 調べた限り、recoverAllではrefreshはコールされないので、
        // 別途コンディションステートを更新する必要がある。
        this.updateConditionStates();
    };
    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        this.updateConditionStates();
        if (this._conditionStateIds.length > 0) {
            this.recoverAll();
        }
    };

    /**
     * 条件付きステートデータを持ったオブジェクトを返す。
     * 
     * @return {Array<Object>} 条件付きステートデータを持ったオブジェクト
     */
    Game_Actor.prototype.conditionStateObjects = function() {
        const psObjs = [];
        const actor = this.actor();
        if (actor.conditionStates.length > 0) {
            psObjs.push(actor);
        }
        const currentClass = this.currentClass(); 
        if (currentClass.conditionStates.length > 0) {
            psObjs.push(currentClass);
        }
        for (const equip of this.equips()) {
            if (equip && (equip.conditionStates.length > 0)) {
                psObjs.push(equip);
            }
        }
        // Note: this.skills()を呼ぶと、特性によるスキル追加を取得するため、
        //       traits() -> states() -> passiveStates() -> ... passiveStateObjects()
        //       と呼ばれて循環し、スタックオーバーフローする。
        //       そのため、_skillsを参照し、対象を追加する。
        const skillIds = this._skills;
        for (let skillId of skillIds) {
            const skill = $dataSkills[skillId];
            if (skill && (skill.conditionStates.length > 0)) {
                psObjs.push(skill);
            }
        }
        return psObjs;
    };
    //------------------------------------------------------------------------------
    // Game_Enemy

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    /**
     * エネミーをセットアップする。
     * 
     * @param {Number} enemyId エネミーID
     * @param {Number} x X位置
     * @param {Number} y Y位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        this.updateConditionStates();
        if (this._conditionStateIds.length > 0) {
            this.recoverAll();
        }
    };
    /**
     * パッシブステートデータを持ったオブジェクトを返す。
     * 
     * @return {Array<Object>} パッシブステートデータを持ったオブジェクト
     */
    Game_Enemy.prototype.conditionStateObjects = function() {
        const psObjs = [];
        const enemy = this.enemy();
        if (enemy.conditionStates.length > 0) {
            psObjs.push(enemy);
        }
        for (const enemyAction of enemy.actions) {
            const skillId = enemyAction.skillId;
            if (skillId) {
                const skill = $dataSkills[skillId];
                if (skill.conditionStates.length > 0) {
                    psObjs.push(skill);
                }
            }
        }

        return psObjs;
    };


    

})();