/*:ja
 * @target MZ 
 * @plugindesc 条件パッシブステートプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_PassiveStates
 * @orderAfter Kapu_PassiveStates
 * 
 * 
 * @help 
 * パッシブステートに発動条件を付与するプラグイン。
 * 条件付きステートとかも考えたが、
 * それをすると付与と解除管理が面倒なので止めた。
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
 *     <conditionPassiveState:conditoinEval$,stateId#, stateId#,...>
 *         eval(conditionEval$)がtrueの時、stateIdのステートが付与される。
 *         1つのオブジェクトあたり、任意数指定可能。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_PassiveStatesWithCondition";

    /**
     * 条件付きパッシブステートを解析し、オブジェクトを生成する。
     * 
     * @param {String} str 解析対象の文字列
     * @return {ConditionPassiveStates} 条件付きパッシブステートオブジェクト。解析エラーの場合にはnull.
     */
    const _parseCondition = function(str) {
        const tokens = str.split(",");
        if (tokens.length > 1) {
            const states = [];
            for (let i = 1; i < tokens.length; i++) {
                const stateId = Number(tokens[i]);
                if ((stateId > 0) && !states.contains(stateId)) {
                    states.push(stateId)
                }
                if (states.length > 0) {
                    return {
                        condition : tokens[0],
                        states : states
                    };
                }
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
        obj.conditionPassiveStates = []; // No entry.
        const pattern = /<conditionPassiveState:(.*)+>/;

        const lines = item.note.split(/[\r\n]+/);
        for (line of lines) {
            const re = line.match(pattern);
            if (re) {
                const conditionPassiveState = _parseCondition(re[1]);
                if (conditionPassiveState) {
                    obj.conditionPassiveStates.push(conditionPassiveState);
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
    const _Game_BattlerBase_getObjectPassiveStateIds = Game_BattlerBase.prototype.getObjectPassiveStateIds;
    /**
     * objが持つパッシブステートを得る。
     * 
     * @param {Object} obj オブジェクト
     * @return {Array<Number>} ステートID配列
     */
    Game_BattlerBase.prototype.getObjectPassiveStateIds = function(obj) {
        const ids = _Game_BattlerBase_getObjectPassiveStateIds.call(this, obj);
        for (const condPS of obj.conditionPassiveStates) {
            try {
                if (eval(condPS)) {
                    for (const stateId of condPS.states) {
                        if (!ids.contains(stateId)) {
                            ids.push(stateId);
                        }
                    }
                }
            }
            catch (e) {
            }
        }

        return ids;
    };

})();