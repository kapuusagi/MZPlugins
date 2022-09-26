/*:ja
 * @target MZ 
 * @plugindesc アクション(アイテム/スキル)の一時ステート付与プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * 
 * @help 
 * スキル/アイテムに一時的に付与されるステートを設定するプラグイン。
 * 例えばDEF0%ステートを作って、スキルに一時付与ステートとして設定すると、
 * 防御力無視スキルになります。
 * DamageCalculationにも似たような機能がありますが、あちらは特性(Trait)の付与で、
 * TRAIT系プラグインの機能を実現するためのものになります。
 *
 * このプラグインで実現するようなスキルの例
 *    対象の防御力を無視するスキル
 *    クリティカル率が高いスキル。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * Game_Action.apply()をフックし、apply実行前にステートを付与し、
 * apply実行後にステートを解除します。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * スキル/アイテム
 *   <userTempStates:id#,id#,...>
 *     スキル使用中、使用者に付与するステート
 *   <targetTempStates:id#,id#,...>
 *     スキル使用中、対象者に付与するステート
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_ActionTemporaryStates";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * ノートタグを処理する。
     * 
     * @param {object} obj オブジェクト
     */
    const _processNoteTag = function(obj) {
        if (obj.meta.userTempStates) {
            const stateIds = [];
            const ids = obj.meta.userTempStates.split(',').map(token => Number(token));
            for (const id of ids) {
                if ((id > 0) && (id < $dataStates.length) && !stateIds.includes(id)) {
                    stateIds.push(id);
                }
            }
            if (stateIds.length > 0) {
                obj.userStateIds = stateIds;
            }
        }
        if (obj.meta.targetTempStates) {
            const stateIds = [];
            const ids = obj.meta.targetTempStates.split(',').map(token => Number(token));
            for (const id of ids) {
                if ((id > 0) && (id < $dataStates.length) && !stateIds.includes(id)) {
                    stateIds.push(id);
                }
            }
            if (stateIds.length > 0) {
                obj.targetStateIds = stateIds;
            }
        }

    };
    DataManager.addNotetagParserItems(_processNoteTag);
    DataManager.addNotetagParserSkills(_processNoteTag);

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    const _Game_BattlerBase_states = Game_BattlerBase.prototype.states;
    /**
     * このGame_Battlerのステートを返す。
     * 
     * @returns {Array<DataState>} ステート
     */
    Game_BattlerBase.prototype.states = function() {
        const states = _Game_BattlerBase_states.call(this);
        for (const state of this.actionTempStates()) {
            if (!states.includes(state)) {
                states.push(state);
            }
        }
        return states;
    };

    /**
     * 行動者の一時ステートを設定する。
     * 
     * @param {Array<number>} stateIds ステートID配列
     */
    Game_BattlerBase.prototype.setActionUserStates = function(stateIds) {
        this._actionUserStateIds = stateIds;
    };

    /**
     * 行動者の一時ステートをクリアする。
     */
    Game_BattlerBase.prototype.clearActionUserStates = function() {
        delete this._actionUserStateIds;
    };

    /**
     * 行動対象の一時ステートを設定する。
     * 
     * @param {Array<number>} stateIds ステートID配列
     */
    Game_BattlerBase.prototype.setActionTargetStates = function(stateIds) {
        this._actionTargetStateIds = stateIds;
    };

    /**
     * 行動対象の一時ステートをクリアする。
     */
    Game_BattlerBase.prototype.clearActionTargetStates = function() {
        delete this._actionTargetStateIds;
    };

    /**
     * 行動時一時ステートを得る。
     * 
     * @returns {Array<object>} ステート配列
     */
    Game_BattlerBase.prototype.actionTempStates = function() {
        const stateIds = (this._actionUserStateIds) ? this._actionUserStateIds : [];
        return stateIds.concat(((this._actionTargetStateIds) ? this._actionTargetStateIds : [])).map(id => $dataStates[id]);
    }

    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_removeBattleStates = Game_Battler.prototype.removeBattleStates;
    /**
     * 戦闘中のみのステートを解除する。
     */
    Game_Battler.prototype.removeBattleStates = function() {
        _Game_Battler_removeBattleStates.call(this);
        // 多分ここでステートが残ってることはないけど念のため
        this.clearActionUserStates();
        this.clearActionTargetStates();
    };
    //------------------------------------------------------------------------------
    // Game_Action

    /**
     * 使用者に一時的に付与するステートを得る。
     * 
     * @returns {Array<number>} ステートID配列
     */
    Game_Action.prototype.userStateIds = function() {
        const item = this.item();
        return (item.userStateIds) ? item.userStateIds : [];
    };

    /**
     * 対象に一時的に付与するステートを得る。
     * 
     * @returns {Array<number>} ステートID配列
     */
    Game_Action.prototype.targetStateIds = function() {
        const item = this.item();
        return (item.targetStateIds) ? item.targetStateIds : [];
    };

    const _Game_Action_apply = Game_Action.prototype.apply;
    /**
     * このアクションをtargetに適用する。
     * 命中判定とダメージ算出、効果適用を行う。
     * 
     * @param {Game_BattlerBase} target 対象
     */
    Game_Action.prototype.apply = function(target) {
        const subject = this.subject();
        subject.setActionUserStates(this.userStateIds());
        target.setActionTargetStates(this.targetStateIds());

        _Game_Action_apply.call(this, target);

        subject.clearActionUserStates();
        target.clearActionTargetStates();
    };
  
})();