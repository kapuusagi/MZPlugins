/*:ja
 * @target MZ 
 * @plugindesc ウェポンマスタリのスキルコスト反映プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Twld_WeaponMastery
 * @orderAfter Kapu_Twld_WeaponMastery
 * @base Kapu_SkillCost
 * @orderAfter Kapu_SkillCost
 * 
 * 
 * @help 
 * ウェポンマスタリをスキルコストに反映させるプラグイン。
 * スキル使用時のHP/MP/TPコストを
 *     ウェポンマスタリレベル x コスト削減レート
 * だけ削減します。
 * 削減量はノートタグにて指定します。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * スキル
 *   <wmHPCostReductionRateMax:rate>
 *      ウェポンマスタリレベルによるコスト削減可能な最大値
 *   <wmHPCostReductionRate:rate>
 *      ウェポンマスタリレベルによるコスト削減レート
 *   <wmMPCostReductionRateMax:rate>
 *      ウェポンマスタリレベルによるコスト削減可能な最大値
 *   <wmMPCostReductionRate:rate>
 *      ウェポンマスタリレベルによるコスト削減レート
 *   <wmTPCostReductionRateMax:rate>
 *      ウェポンマスタリレベルによるコスト削減可能な最大値
 *   <wmTPCostReductionRate:rate>
 *      ウェポンマスタリレベルによるコスト削減レート
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_skillHpCost = Game_BattlerBase.prototype.skillHpCost;
    /**
     * スキルのHPコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * @returns {number} HPコスト
     */
    Game_BattlerBase.prototype.skillHpCost = function(skill) {
        let cost = _Game_BattlerBase_skillHpCost.call(this, skill);
        if (cost > 0) {
            const wmTypeId = this.itemWmTypeId(skill);
            if (wmTypeId > 0) {
                const maxRate = Number(item.meta.wmHPCostReductionRateMax || 0);
                const rate = Number(item.meta.wmHPCostReductionRate) || 0;
                const wmLevel = this.wmLevel(wmTypeId);
                cost = Math.max(1, Math.round(cost * Math.max(maxRate, 1.0 - rate * wmLevel)));
            }
        }
        return cost;
    };

    const _Game_BattlerBase_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
    /**
     * スキルのMPコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * !!!overwrite!!! Game_BattlerBase.skillMpCost
     */
    Game_BattlerBase.prototype.skillMpCost = function(skill) {
        let cost = _Game_BattlerBase_skillMpCost.call(this, skill);
        if (cost > 0) {
            const wmTypeId = this.itemWmTypeId(skill);
            if (wmTypeId > 0) {
                const maxRate = Number(item.meta.wmMPCostReductionRateMax || 0);
                const rate = Number(item.meta.wmMPCostReductionRate) || 0;
                const wmLevel = this.wmLevel(wmTypeId);
                cost = Math.max(1, Math.round(cost * Math.max(maxRate, 1.0 - rate * wmLevel)));
            }
        }
        return cost;
    };

    const _Game_BattlerBase_skillTpCost = Game_BattlerBase.prototype.skillTpCost;
    /**
     * スキルのTPコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * !!!overwrite!!! Game_BattlerBase.skillTpCost()
     */
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        let cost = _Game_BattlerBase_skillTpCost.call(this, skill);
        if (cost > 0) {
            const wmTypeId = this.itemWmTypeId(skill);
            if (wmTypeId > 0) {
                const maxRate = Number(item.meta.wmTPCostReductionRateMax || 0);
                const rate = Number(item.meta.wmTPCostReductionRate) || 0;
                const wmLevel = this.wmLevel(wmTypeId);
                cost = Math.max(1, Math.round(cost * Math.max(maxRate, 1.0 - rate * wmLevel)));
            }
        }
        return cost;
    };

})();