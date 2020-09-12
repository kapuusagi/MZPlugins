/*:ja
 * @target MZ 
 * @plugindesc パッシブステートを追加するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @help 
 * パッシブステートを追加する。
 * パッシブステート：装備・習得しているだけで付与されるステートの事。
 * 
 * 仕様
 * ・アクター、クラス、エネミー、スキル、ウェポン、アーマーに
 *   パッシブステートが付与されます。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 対象：アクター、クラス、エネミー、スキル、ウェポン、アーマー
 *     <passiveStates:id>
 *         idで指定したステートが付与されるようになる。
 *     <passiveStates:id#,id#,id#>
 *         カンマで区切られたidで指定したステートが付与されるようになる。
 *     <passiveStates:begin# to end#>
 *         begin# から end# で指定したステートが付与されるようになる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 MVのYanfly氏のYEP_AutoPassiveStates.jsを参考に作成。動作未確認。
 *               MVプロジェクトをインポートして使いたいなら、
 *               素直にYanfly氏がMZ向けにリリースしているプラグインを使った方が良いです。
 */
(() => {
    const pluginName = 'Kapu_PassiveStates';

    const _Scene_Boot_start = Scene_Boot.prototype.start;

    //------------------------------------------------------------------------------
    // Scene_Boot

    /**
     * Scene_Bootを開始する。
     */
    Scene_Boot.prototype.start = function() {
        DataManager.processPassiveState();
        _Scene_Boot_start.call(this);
    };

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * パッシブステートノートタグを処理する。
     */
    DataManager.processPassiveState = function() {
        this.processPassiveStateNotetags($dataActors);
        this.processPassiveStateNotetags($dataClasses);
        this.processPassiveStateNotetags($dataEnemies);
        this.processPassiveStateNotetags($dataSkills);
        this.processPassiveStateNotetags($dataWeapons);
        this.processPassiveStateNotetags($dataArmors);
    };

    /**
     * パッシブステートノートタグを処理する。
     * 
     * @param {Array<Object>} dataArray データコレクション
     */
    DataManager.processPassiveStateNotetags = function(dataArray) {
        const patternSingle = /^ *(\d+) *$/;
        const patternRange = /^ *(\d+) ?to ?(\d+) */;

        for (let i = 1; i < dataArray.length; i++) {
            const data = dataArray[i];

            data.passiveStates = [];

            const psEntries = data.meta.passiveStates.split(',');
            for (const psEntry of psEntries) {
                let re;
                if ((re = psEntry.match(patternSingle)) !== null) {
                    const stateId = Number(re[1]);
                    if (stateId) {
                        data.passiveStates.push(stateId);
                    }
                } else if ((re = psEntry.match(patternRange)) !== null) {
                    const begin = Number(re[1]);
                    const end = Number(re[2]);
                    for (let id = begin; id <= end; id++) {
                        data.passiveStates.push(id);
                    }
                }
            }
        }
    };

    /**
     * objからパッシブステートID配列を得る。
     * 
     * @param {Object} obj オブジェクト
     * @return {Array<Number>} パッシブステートID配列
     */
    DataManager.getPassiveStateData = function(obj) {
        if (obj && obj.passiveStates) {
            return obj.passiveStates;
        } else {
            return [];
        }
    };


    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_states = Game_BattlerBase.prototype.states;
    /**
     * このGame_Battlerのステートを返す。
     * 
     * @return {Array<DataStates>} ステート
     */
    Game_BattlerBase.prototype.states = function() {
        let states = _Game_BattlerBase_states.call(this);
        const passiveStates = this.passiveStates();
        for (let state of passiveStates) {
            if (!states.contains(state)) {
                states.push(state);
            }
        }
        return states;
    };

    const _Game_BattlerBase_isStateAffected = Game_BattlerBase.prototype.isStateAffected;

    /**
     * stateIdで指定されるステートを持っているかどうかを取得する。
     * 
     * @param {Number} stateId ステートID
     * @return {Boolean} ステートを持っている場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isStateAffected = function(stateId) {
        if (this.isPassiveStateAffected(stateId)) {
            return true;
        } else {
            return _Game_BattlerBase_isStateAffected.call(this, ...arguments);
        }
    };
    
    /**
     * パッシブステートを得る。
     * 
     * @return {Array<DataState>} パッシブステート配列。
     */
    Game_BattlerBase.prototype.passiveStates = function() {
        return this.getPassiveStateIds().map(id => $dataStates[id])
    };

    /**
     * stateIdで指定されるステートが、
     * パッシブステートとして持っているかどうかを取得する。
     * 
     * @param {Number} stateId ステートID
     * @return {Boolean} 保持しているパッシブステートに含まれる場合にはtrue,それ以外はfalse
     */
    Game_BattlerBase.prototype.isPassiveStateAffected = function(stateId) {
        return this.getPassiveStateIds().contains(stateId);
    };

    /**
     * このGame_BattlerBaseが持ってるパッシブステートID列を得る。
     * Game_Enemy, Game_Actorでそれぞれ実装する。
     * 
     * @return {Array<Number>} ステートID配列。
     */
    Game_BattlerBase.prototype.getPassiveStateIds = function() {
        return [];
    };

    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_isStateAddable = Game_Battler.prototype.isStateAddable;

    /**
     * ステートを付与可能かどうか判定する。
     * 
     * @param {Number} stateId ステートID
     * @return {Boolean} ステートを付与可能な場合にはtrue,それ以外はfalse
     */
    Game_Battler.prototype.isStateAddable = function(stateId) {
        if (this.isPassiveStateAffected(stateId)) {
            return false;
        } else {
            return _Game_Battler_isStateAddable.call(this, ...arguments);
        }
    };


    const _Game_Battler_removeState = Game_Battler.prototype.removeState;
    /**
     * ステートを取り除く。
     * 
     * @param {Number} stateId ステートID
     */
    Game_Battler.prototype.removeState = function(stateId) {
        if (!this.isPassiveStateAffected(stateId)) {
            // パッシブステートでなければ取り除く。
            _Game_Battler_removeState.call(this, ...arguments);
        }
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * このGame_BattlerBaseが持ってるパッシブステートID列を得る。
     * Game_Enemy, Game_Actorでそれぞれ実装する。
     * 
     * @return {Array<Number>} ステートID配列。
     */
    Game_Actor.prototype.getPassiveStateIds = function() {
        const stateIds = DataManager.getPassiveStateData(this.actor());
        const classPS = DataManager.getPassiveStateData(this.currentClass());
        for (let id of classPS) {
            if (!stateIds.contains(id)) {
                stateIds.push(id);
            }
        }
        const equips = this.equips();
        for (let equip of equips) {
            if (equip) {
                const equipPS = DataManager.getPassiveStateData(equip);
                for (let id of equipPS) {
                    if (!stateIds.contains(id)) {
                        stateIds.push(id);
                    }
                }
            }
        }
        const skills = this.skills();
        for (let skill of skills) {
            const skillPS = DataManager.getPassiveStateData(skill);
            for (let id of skillPS) {
                if (!stateIds.contains(id)) {
                    stateIds.push(id);
                }
            }
        }

        return stateIds;
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    if (!Game_Enemy.prototype.skills) {
        /**
         * エネミーの使用するスキルを得る。
         * 
         * @return {Array<DataSkill>} スキルデータ配列
         */
        Game_Enemy.prototype.skills = function() {
            const skillIds = [];
            const actions = this.enemy().actions;
            for (action of actions) {
                const skillId = action.skillId;
                if (!skillIds.contains(skillId)) {
                    skillIds.push(skillId);
                }
            }
            return skillIds.map(id => $dataSkills[id]);
        }
    
    }

    /**
     * このGame_BattlerBaseが持ってるパッシブステートID列を得る。
     * Game_Enemy, Game_Actorでそれぞれ実装する。
     * 
     * @return {Array<Number>} ステートID配列。
     */
    Game_Enemy.prototype.getPassiveStateIds = function() {
        const stateIds = [];
        const enemyPS = DataManager.getPassiveStateData(this.enemy());
        const skills = this.skills();
        for (let skill of skills) {
            const skillPS = DataManager.getPassiveStateData(skill);
            for (let id of skillPS) {
                if (!stateIds.contains(id)) {
                    stateIds.push(id);
                }
            }
        }

        return stateIds;
    };
})();