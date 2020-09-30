/*:ja
 * @target MZ 
 * @plugindesc パッシブステートを追加するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
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
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 条件付きパッシブステートを実現するため、構造を変更した。
 *               Kapu_Utilityを使用してパースするように変更した。
 *               ノートタグ書式<passiveStates: begin# to end#>は削除した。
 * Version.0.1.0 MVのYanfly氏のYEP_AutoPassiveStates.jsを参考に作成。
 *               MVプロジェクトをインポートして使いたいなら、
 *               素直にYanfly氏がMZ向けにリリースしている
 *               Visustellaプラグインを使った方が良いです。
 */
(() => {
    const pluginName = "Kapu_PassiveStates";


    //------------------------------------------------------------------------------
    // DataManager

    /**
     * ノートタグを処理する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        obj.passiveStates = [];

        if (!obj.meta.passiveStates) {
            return;
        }
        for (const token of obj.meta.passiveStates.split(",")) {
            const id = Number(token);
            if (id > 0) {
                if (!obj.passiveStates.contains(id)) {
                    obj.passiveStates.push(id);
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
    const _Game_BattlerBase_states = Game_BattlerBase.prototype.states;
    
    /**
     * このGame_Battlerのステートを返す。
     * 
     * @return {Array<DataState>} ステート
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
     * 
     * @return {Array<Number>} ステートID配列。
     */
    Game_BattlerBase.prototype.getPassiveStateIds = function() {
        const passiveStateObjects = this.passiveStateObjects();
        const stateIds = [];
        for (const psObj of passiveStateObjects) {
            const ids = this.getObjectPassiveStateIds(psObj);
            for (const id of ids) {
                if (!stateIds.contains(id)) {
                    stateIds.push(id);
                }
            }
        }
        return stateIds;
    };

    /**
     * objが持つパッシブステートを得る。
     * 
     * @param {Object} obj 
     * @return {Array<Number>} ステートID配列
     */
    Game_BattlerBase.prototype.getObjectPassiveStateIds = function(obj) {
        if (obj && obj.passiveStates) {
            return obj.passiveStates;
        } else {
            return [];
        }
    };

    /**
     * パッシブステートデータを持ったオブジェクトを返す。
     * Game_Actor/Game_Enemyにて、本メソッドを実装してオブジェクトを返すようにする。
     * 
     * @return {Array<Object>} パッシブステートデータを持ったオブジェクト
     */
    Game_BattlerBase.prototype.passiveStateObjects = function() {
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
     * パッシブステートデータを持ったオブジェクトを返す。
     * 
     * @return {Array<Object>} パッシブステートデータを持ったオブジェクト
     */
    Game_Actor.prototype.passiveStateObjects = function() {
        const psObjs = [];
        const actor = this.actor();
        psObjs.push(this.actor());
        const currentClass = this.currentClass(); 
        psObjs.push(currentClass);
        for (const equip of this.equips()) {
            if (equip) {
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
            if (skill) {
                psObjs.push(skill);
            }
        }
        return psObjs;
    };

    //------------------------------------------------------------------------------
    // Game_Enemy

    /**
     * パッシブステートデータを持ったオブジェクトを返す。
     * 
     * @return {Array<Object>} パッシブステートデータを持ったオブジェクト
     */
    Game_Enemy.prototype.passiveStateObjects = function() {
        const psObjs = [];
        const enemy = this.enemy();
        psObjs.push(enemy);
        for (const enemyAction of enemy.actions) {
            const skillId = enemyAction.skillId;
            if (skillId) {
                const skill = $dataSkills[skillId];
                psObjs.push(skill);
            }
        }

        return psObjs;
    };
})();