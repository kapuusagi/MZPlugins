/*:ja
 * @target MZ 
 * @plugindesc TWLD向けの基本パラメータと装備重量を絡めるプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Twld_BasicParams
 * @orderAfter Kapu_Twld_BasicParams
 * @base Kapu_Base_Hit
 * @orderAfter Kapu_Base_Hit
 * @base Kapu_EquipmentWeight
 * @orderAfter Kapu_EquipmentWeight
 * 
 * @help 
 * 装備許容重量が次の値になります。
 *   (武器装備許容重量) = STR * 2
 *   (防具装備許容重量) = VIT * 2
 * 
 * 装備重量により、以下の効果がでるようになります。
 * ・防具装備重量が許容重量を超えると、その分だけAGIが減少します。
 *   軽い分には影響ありません。
 * ・武器装備重量が許容重量を超えると、その分だけ命中率が低下します。
 *   軽い分には影響ありません。
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
 * なし。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_Twld_BasicParams_EquipmentWeight";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_BattlerBase_param = Game_BattlerBase.prototype.param;
    /**
     * パラメータを得る。
     * 
     * Note: AGI, LUKについて置き換えるためフックする。
     * @param {number} paramId パラメータID
     * @returns {number} パラメータ値
     */
    Game_BattlerBase.prototype.param = function(paramId) {
        let value = _Game_BattlerBase_param.call(this, paramId);
        if (paramId === 6) {
            const rate = (1 / this.armorWeightRate()).clamp(0, 1);
            value = Math.round(value / rate);
        }
        return value;
    };
    /**
     * 武器装備可能重量を得る。
     * 
     * @returns {number} 装備可能重量
     * !!!overwrite!!! Game_Actor.weaponWeightTolerance()
     *    武器装備許容重量の計算を変更するためオーバーライドする。
     */
    Game_Actor.prototype.weaponWeightTolerance = function() {
        return this.str * 2;
    };

    /**
     * 防具装備可能重量を得る。
     * 
     * @returns {number} 装備可能重量
     * !!!overwrite!!! Game_Actor.armorWeightTolerance()
     *   防具装備許容重量の計算を変更するためオーバーライドする。
     */
    Game_Actor.prototype.armorWeightTolerance = function() {
        return this.vit * 2;
    };
    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_itemHit = Game_Action.prototype.itemHit;
    /**
     * 命中率を得る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @returns {number} 命中率。
     */
    Game_Action.prototype.itemHit = function(target) {
        const hitrate = _Game_Action_itemHit.call(this, target);
        const rate = (1 / this.subject().weaponWeightRate()).clamp(0, 1);
        return hitrate * rate;
    };
})();