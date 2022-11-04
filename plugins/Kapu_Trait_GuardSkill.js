/*:ja
 * @target MZ 
 * @plugindesc 防御のスキルを置き換えるプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param traitCode
 * @text 特性コード
 * @desc 特性として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 110
 * @type number
 * @max 999
 * @min 65
 * 
 * @param displaySkillNameInstedOfBuard
 * @text 防御コマンドの代わりにスキル名を表示する
 * @type boolean
 * @default false
 * 
 * 
 * @help 
 * 防御のスキルを置き換える特性を追加します。
 * ベースシステムにおける、攻撃スキルの設定と似たようなものになります。
 * 特性により、「すごい防御スキルを使用可能にしたい場合」に使用します。
 * 
 * ■ 使用時の注意
 * 複数の防御スキルID特性を持っていた場合、値の最も大きなスキルが適用されます。
 * 
 * ■ プラグイン開発者向け
 * なし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/武器/防具/ステート/エネミー
 *   <guardSkillId:id#>
 *     防御時のスキルをid#で指定したものに変更する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    'use strict';
    const pluginName = "Kapu_Trait_GuardSkill";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_GUARD_SKILL = Number(parameters["traitCode"]) || 0;
    if (!Game_BattlerBase.TRAIT_GUARD_SKILL) {
        console.error(pluginName + ":TRAIT_GUARD_SKILL is not valid.");
        return;
    }

    const displaySkillNameInstedOfBuard = (typeof parameters["displaySkillNameInstedOfBuard"] === "undefined")
            ? false : (parameters["displaySkillNameInstedOfBuard"] === "true");

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * ノートタグを処理する。
     * 
     * @param {object} obj データオブジェクト
     */
     const _processNoteTag = function(obj) {
        if (obj.meta.guardSkillId) {
            const skillId = Math.round(Number(obj.meta.guardSkillId) || 0);
            if (skillId > 0) {
                obj.traits.push({
                    code:Game_BattlerBase.TRAIT_GUARD_SKILL,
                    dataId:skillId,
                    value:0
                });
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
    const _Game_BattlerBase_guardSkillId = Game_BattlerBase.prototype.guardSkillId;
    /**
     * 防御スキルIDを得る。
     * 
     * @returns {number} 防御スキルID
     */
    Game_BattlerBase.prototype.guardSkillId = function() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_GUARD_SKILL);
        if (set.length > 0) {
            const skillId = Math.max(...set);
            if ((skillId > 0) && (skillId < $dataSkills.length)) {
                return skillId;
            }
        }
        return _Game_BattlerBase_guardSkillId.call(this);
    };
    //------------------------------------------------------------------------------
    // Window_ActorCommand
    if (displaySkillNameInstedOfBuard) {
        /**
         * 防御コマンドを追加する。
         * !!!overwrite!!! Window_ActorCommand.addGuardCommand()
         *     防御コマンド表示名を変更するため、オーバーライドする。
         */
        Window_ActorCommand.prototype.addGuardCommand = function() {
            const skillId = this._actor.guardSkillId();
            const commandName = ($dataSkills[skillId] && $dataSkills[skillId].name)
            ? $dataSkills[skillId].name
            : TextManager.guard;

            this.addCommand(commandName, "guard", this._actor.canGuard());
        };
    }


})();