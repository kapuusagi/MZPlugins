/*:ja
 * @target MZ 
 * @plugindesc 特定のスキルを連続使用時に、TPBコストを変化させるプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Tpb
 * @orderAfter Kapu_Base_Tpb
 * @base kapu_TpbEffects
 * @orderAfter Kapu_TpbEffects
 * 
 * @help 
 * 特定のスキルの後に実行したとき、スキルのTPBキャストタイム、コストレートを変動させることができます。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * スキル
 *   <tpbCastAfter:castTime#,skillId#,skillId#,...>
 *      skillId#で指定したスキルの後に実行した場合、
 *      キャストタイムがcastTime#になる。
 *   <tpbCostAfter:tpbCost#,skillId#,skillId#,...>
 *      skillId#で指定したスキルの後に実行した場合、
 *      キャストタイムがcastTime#になる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_TpbContinuousSkillCost";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * objのノートタグを解析する。
     * 
     * @param {DataSkill} obj 対象データ
     */
    const _parseNotetag = function(obj) {
        obj.tpbCastAfter = null;
        obj.tpbCostAfter = null;
        if (obj.meta.tpbCastAfter) {
            const numbers = obj.meta.tpbCastAfter.split(",").map(token => Math.round(Number(token) || 0));
            if (numbers.length >= 2) {
                const castTime = Math.max(0, numbers[0]);
                const skillIds = [];
                for (let i = 1; i < numbers.length; i++) {
                    const skillId = numbers[i];
                    if ((skillId > 0) && !skillIds.includes(skillId)) {
                        skillIds.push(skillId);
                    }
                }
                obj.tpbCastAfter = { castTime:castTime, skillIds:skillIds };
            }
        }

        if (obj.meta.tpbCostAfter) {
            const numbers = obj.meta.tpbCastAfter.split(",").map(token => Math.round(Number(token) || 0));
            if (numbers.length >= 2) {
                const tpbCost = Math.max(0, numbers[0]);
                const skillIds = [];
                for (let i = 1; i < numbers.length; i++) {
                    const skillId = numbers[i];
                    if ((skillId > 0) && !skillIds.includes(skillId)) {
                        skillIds.push(skillId);
                    }
                }
                obj.tpbCastAfter = { tpbCost:tpbCost, skillIds:skillIds };
            }
        }
    };
    DataManager.addNotetagParserSkills(_parseNotetag);
    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
    /**
     * メンバーを初期化する。
     */
    Game_Battler.prototype.initMembers = function() {
        _Game_Battler_initMembers.call(this);
        this._lastUseSkillId = 0;
    };

    const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    /**
     * 戦闘開始時の処理を行う。
     * 
     * Note:このメソッドがコールされたとき、$gameParty.inBattle()はfalseを返す事に注意。
     * 
     * @param {boolean} advantageous 有利な状態かどうか
     */
    Game_Battler.prototype.onBattleStart = function(advantageous) {
        _Game_Battler_onBattleStart.call(this, advantageous);
        this._lastUseSkillId = 0;
    };

    const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    /**
     * 戦闘終了時の処理を行う。
     */
    Game_Battler.prototype.onBattleEnd = function() {
        _Game_Battler_onBattleEnd.call(this);
        this._lastUseSkillId = 0;
    };
    const _Game_Battler_onRestrict = Game_Battler.prototype.onRestrict;
    /**
     * 行動不可状態時の処理を行う。
     */
    Game_Battler.prototype.onRestrict = function() {
        _Game_Battler_onRestrict.call(this);
        this._lastUseSkillId = 0;
    };

    /**
     * 最後に実行したアクションを設定する。
     * 
     * @param {Game_Action} action 最後に実行したアクション
     */
    Game_Battler.prototype.setLastUseAction = function(action) {
        if (action && action.isSkill()) {
            this._lastUseSkillId = action.item().id;
        } else {
            this._lastUseSkillId = 0;
        }
    };


    const _Game_Battler_tpbSkillCastTime = Game_Battler.prototype.tpbSkillCastTime;
    /**
     * スキルのキャスト時間を得る。
     * 
     * @param {object} item スキル/アイテム
     * @returns {number} キャスト時間
     */
    Game_Battler.prototype.tpbSkillCastTime = function(item) {
        if ((this._lastUseSkillId > 0) && item.tpbCastAfter && item.tpbCastAfter.skillIds.includes(this._lastUseSkillId)) {
            return item.tpbCastAfter.castTime;
        } else {
            return _Game_Battler_tpbSkillCastTime.call(this, item);
        }
    };

    const _Game_Battler_skillTpbCost = Game_BattlerBase.prototype.skillTpbCost;
    /**
     * スキルのTPBコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * @returns {number} TPBコスト
     */
    Game_BattlerBase.prototype.skillTpbCost = function(skill) {
        if ((this._lastUseSkillId > 0) && item.tpbCostAfter && item.tpbCostAfter.skillIds.includes(this._lastUseSkillId)) {
            return item.tpbCostAfter.tpbCost;
        } else {
            return _Game_Battler_skillTpbCost.call(skill);
        }
    };
    //------------------------------------------------------------------------------
    // BattleManager

    const _BattleManager_endAction = BattleManager.endAction;
    /**
     * アクターまたはエネミーのアクションが完了したときの処理を行う。
     */
    BattleManager.endAction = function() {
        // 最後に使用したアクションを保存する。
        this._subject.setLastUseAction(this._action);
        _BattleManager_endAction.call(this);
    };
})();