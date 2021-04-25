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
 * Version.0.4.0 パッシブステートを検索・取得する対象として、習得済みスキルIDリストでなく、
 *               skills()で取得した対象とするように修正した。
 * Version.0.3.1 パッシブステートで装備可能品を増やしている場合に、
 *               装備初期化時に装備可能品が反映されない不具合を修正した。
 * Version.0.3.0 負荷低減のため、パッシブステートをキャッシュする構造に変更した。
 *               条件付きパッシブステートはやめたのでシンプルな構造に戻した。
 * Version.0.2.0 条件付きパッシブステートを実現するため、構造を変更した。
 *               Kapu_Utilityを使用してパースするように変更した。
 *               ノートタグ書式<passiveStates: begin# to end#>は削除した。
 * Version.0.1.0 MVのYanfly氏のYEP_AutoPassiveStates.jsを参考に作成。
 *               MVプロジェクトをインポートして使いたいなら、
 *               素直にYanfly氏がMZ向けにリリースしている
 *               Visustellaプラグインを使った方が良いです。
 */
(() => {
    //const pluginName = "Kapu_PassiveStates";


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
                if (!obj.passiveStates.includes(id)) {
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
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    /**
     * Game_BattlerBaseのパラメータを初期化する。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._passiveStateIds = [];
    };

    const _Game_Actor_initEquips = Game_Actor.prototype.initEquips;
    /**
     * 装備を初期化する。
     * 
     * @param {Array<Number>} equips 装備品ID配列
     */
    Game_Actor.prototype.initEquips = function(equips) {
        this.updatePassiveStates();
        _Game_Actor_initEquips.call(this, equips);
    };

    const _Game_BattlerBase_states = Game_BattlerBase.prototype.states;
    /**
     * このGame_Battlerのステートを返す。
     * 
     * @return {Array<DataState>} ステート
     */
    Game_BattlerBase.prototype.states = function() {
        let states = _Game_BattlerBase_states.call(this);
        for (const state of this.passiveStates()) {
            if (!states.includes(state)) {
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
        return this._passiveStateIds.map(id => $dataStates[id])
    };

    /**
     * stateIdで指定されるステートが、
     * パッシブステートとして持っているかどうかを取得する。
     * 
     * @param {Number} stateId ステートID
     * @return {Boolean} 保持しているパッシブステートに含まれる場合にはtrue,それ以外はfalse
     */
    Game_BattlerBase.prototype.isPassiveStateAffected = function(stateId) {
        return this._passiveStateIds.includes(stateId);
    };

    /**
     * パッシブステートを更新する。
     */
    Game_BattlerBase.prototype.updatePassiveStates = function() {
        const stateIds = [];
        const passiveStateObjects = this.passiveStateObjects();
        for (const obj of passiveStateObjects) {
            for (const id of obj.passiveStates) {
                if (!stateIds.includes(id)) {
                    stateIds.push(id);
                }
            }
        }
        this._passiveStateIds = stateIds;
    }
    /**
     * パッシブステートデータを持ったオブジェクトを返す。
     * Game_Actor/Game_Enemyにて、本メソッドを実装してオブジェクトを返すようにする。
     * 
     * @return {Array<Object>} パッシブステートデータを持ったオブジェクト
     */
    Game_BattlerBase.prototype.passiveStateObjects = function() {
        return [];
    };

    const _Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
    /**
     * 更新する
     */
    Game_BattlerBase.prototype.refresh = function() {
        this.updatePassiveStates();
        _Game_BattlerBase_refresh.call(this);
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
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        this.updatePassiveStates();
        if (this._passiveStateIds.length > 0) {
            this.recoverAll(); // ステート付与されてたら更新
        }
    };

    /**
     * パッシブステートデータを持ったオブジェクトを返す。
     * 
     * @return {Array<Object>} パッシブステートデータを持ったオブジェクト
     */
    Game_Actor.prototype.passiveStateObjects = function() {
        if (this._callPassiveStateObjects) {
            // Note: this.skills()を呼ぶと、特性によるスキル追加を取得するため、以下の処理がコールされる。
            //       1. 装備品などの特性によって使用可能になっているスキルを調べるため、
            //          traits()が呼ばれる。
            //       2. traitsが、特性を持つオブジェクトを取得するため、states() を呼び出す。
            //       3. states()にてパッシブステートを取得する為、passiveStates()を呼び出す。
            //       4. passiveStates()がpassiveStateObjects()を呼び出す。
            //       5. passiveStateObjects()からskills()を呼ぶと1に戻るのでスタックオーバーフローする。
            // そのため、_callPassiveStateObjects フラグをセットすることで、循環呼び出しを防ぐ。
            return [];
        }
        this._callPassiveStateObjects = true;
        
        const psObjs = [];
        const actor = this.actor();
        if (actor.passiveStates.length > 0) {
            psObjs.push(actor);
        }
        const currentClass = this.currentClass(); 
        if (currentClass.passiveStates.length > 0) {
            psObjs.push(currentClass);
        }
        for (const equip of this.equips()) {
            if (equip && (equip.passiveStates.length > 0)) {
                psObjs.push(equip);
            }
        }
        const skills = this.skills();
        for (const skill of skills) {
            if (skill && (skill.passiveStates.length > 0)) {
                psObjs.push(skill);
            }
        }

        delete this._callPassiveStateObjects;
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
        this.updatePassiveStates();
        if (this._passiveStateIds.length > 0) {
            this.recoverAll();
        }
    };
    /**
     * パッシブステートデータを持ったオブジェクトを返す。
     * 
     * @return {Array<Object>} パッシブステートデータを持ったオブジェクト
     */
    Game_Enemy.prototype.passiveStateObjects = function() {
        const psObjs = [];
        const enemy = this.enemy();
        if (enemy.passiveStates.length > 0) {
            psObjs.push(enemy);
        }
        for (const enemyAction of enemy.actions) {
            const skillId = enemyAction.skillId;
            if (skillId) {
                const skill = $dataSkills[skillId];
                if (skill.passiveStates.length > 0) {
                    psObjs.push(skill);
                }
            }
        }

        return psObjs;
    };
})();