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
 *              damaged:何かしらダメージを受けたとき
 *              healed:回復した時
 *              actioned:行動した時(全ての行動が終わったとき1回)
 *              stateAdded(id,id,id,...):
 *                  id#のステート(いずれか)が付与された時
 *              stateRemoved(id,id.id,...):
 *                  id#のステート(いずれか)が解除された時
 *          skillId#
 *              発動するスキルID
 *          target
 *              発動対象。self(ステート保持者)またはsubject(対象)
 *          count#
 *              発動回数。0で無制限。
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
        const tokens = str.split(',');
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
                const ids = re[1].split(',').map(token => Number(token) || 0);
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
    // Game_Battler




})();