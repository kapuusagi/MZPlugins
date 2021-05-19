/*:ja
 * @target MZ 
 * @plugindesc TWLD向けに作成した属性処理。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_ElementCore
 * @orderAfter Kapu_ElementCore
 * @orderAfter Kapu_Trait_ElementAbsorb
 * 
 * @param physicalElementIds
 * @text 物理属性ID
 * @desc 物理属性として処理する属性ID
 * @type number[]
 * 
 * @param magicalElementIds
 * @text 魔法属性ID
 * @desc 魔法属性として処理する属性ID
 * @type number[]
 * 
 * 
 * @help 
 * TWLD向けに作成した属性処理。
 * ベーシックシステムでは複合属性の場合に、最も効果の高い倍率が適用された。
 * TWLDでは以下のように変更する。
 * 
 * ・属性無効判定
 *   複数属性を対象にした場合、全属性に対して無効である場合に0になる。
 * ・複数の属性を持つ場合は平均化
 *   打は無効にするけど、斬は50％くらい効くよ、の場合には平均化して25％になる。
 * ・複数属性時のダメージ/吸収ボーナス加算
 *   2つ以上の属性で割り増し(>100%)があった場合、
 *   割り増し量に応じたボーナスを加える。
 * 
 * 例
 * 属性なし Result 100% (Bonus:100%)
 * Element1 -150% Result -150% (Bonus:100%)
 * Element1 -100% Result -100% (Bonus:100%)
 * Element1 -20% Result -20% (Bonus:100%)
 * Element1 0% Result 0% (Bonus:100%)
 * Element1 20% Result 20% (Bonus:100%)
 * Element1 100% Result 100% (Bonus:100%)
 * Element1 150% Result 150% (Bonus:100%)
 * Element1 -150%  Element2 -150% Result -165.1% (Bonus:110%)
 * Element1 -150%  Element2 -100% Result -125% (Bonus:100%)
 * Element1 -150%  Element2 -20% Result -85% (Bonus:100%)
 * Element1 -150%  Element2 0% Result -75% (Bonus:100%)
 * Element1 -150%  Element2 20% Result -65% (Bonus:100%)
 * Element1 -150%  Element2 100% Result -25% (Bonus:100%)
 * Element1 -150%  Element2 150% Result 0% (Bonus:100%)
 * Element1 -100%  Element2 -150% Result -125% (Bonus:100%)
 * Element1 -100%  Element2 -100% Result -100% (Bonus:100%)
 * Element1 -100%  Element2 -20% Result -60% (Bonus:100%)
 * Element1 -100%  Element2 0% Result -50% (Bonus:100%)
 * Element1 -100%  Element2 20% Result -40% (Bonus:100%)
 * Element1 -100%  Element2 100% Result 0% (Bonus:100%)
 * Element1 -100%  Element2 150% Result 25% (Bonus:100%)
 * Element1 -20%  Element2 -150% Result -85% (Bonus:100%)
 * Element1 -20%  Element2 -100% Result -60% (Bonus:100%)
 * Element1 -20%  Element2 -20% Result -20% (Bonus:100%)
 * Element1 -20%  Element2 0% Result -10% (Bonus:100%)
 * Element1 -20%  Element2 20% Result 0% (Bonus:100%)
 * Element1 -20%  Element2 100% Result 40% (Bonus:100%)
 * Element1 -20%  Element2 150% Result 65% (Bonus:100%)
 * Element1 0%  Element2 -150% Result -75% (Bonus:100%)
 * Element1 0%  Element2 -100% Result -50% (Bonus:100%)
 * Element1 0%  Element2 -20% Result -10% (Bonus:100%)
 * Element1 0%  Element2 0% Result 0% (Bonus:100%)
 * Element1 0%  Element2 20% Result 10% (Bonus:100%)
 * Element1 0%  Element2 100% Result 50% (Bonus:100%)
 * Element1 0%  Element2 150% Result 75% (Bonus:100%)
 * Element1 20%  Element2 -150% Result -65% (Bonus:100%)
 * Element1 20%  Element2 -100% Result -40% (Bonus:100%)
 * Element1 20%  Element2 -20% Result 0% (Bonus:100%)
 * Element1 20%  Element2 0% Result 10% (Bonus:100%)
 * Element1 20%  Element2 20% Result 20% (Bonus:100%)
 * Element1 20%  Element2 100% Result 60% (Bonus:100%)
 * Element1 20%  Element2 150% Result 85% (Bonus:100%)
 * Element1 100%  Element2 -150% Result -25% (Bonus:100%)
 * Element1 100%  Element2 -100% Result 0% (Bonus:100%)
 * Element1 100%  Element2 -20% Result 40% (Bonus:100%)
 * Element1 100%  Element2 0% Result 50% (Bonus:100%)
 * Element1 100%  Element2 20% Result 60% (Bonus:100%)
 * Element1 100%  Element2 100% Result 100% (Bonus:100%)
 * Element1 100%  Element2 150% Result 125% (Bonus:100%)
 * Element1 150%  Element2 -150% Result 0% (Bonus:100%)
 * Element1 150%  Element2 -100% Result 25% (Bonus:100%)
 * Element1 150%  Element2 -20% Result 65% (Bonus:100%)
 * Element1 150%  Element2 0% Result 75% (Bonus:100%)
 * Element1 150%  Element2 20% Result 85% (Bonus:100%)
 * Element1 150%  Element2 100% Result 125% (Bonus:100%)
 * Element1 150%  Element2 120% Result 144.4% (Bonus:107%)
 * Element1 150%  Element2 150% Result 165% (Bonus:110%)
 *  
 * 
 * ■ 使用時の注意
 * 吸収属性を正しく処理するには、Kapu_Trait_ElementAbsorbの後にする。
 * 他の吸収属性プラグインを使用する場合、実装方法次第で競合する。
 * 
 * ■ プラグイン開発者向け
 * ありません。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Twld_Elements";
    const parameters = PluginManager.parameters(pluginName);

    const physicalElementIds = [];
    try {
        for (const numStr of JSON.parse(parameters["physicalElementIds"])) {
            const id = Number(numStr) || 0;
            if ((id >= 0) && !physicalElementIds.includes(id)) {
                physicalElementIds.push(id);
            }
        }
    }
    catch (e) {
        console.error(e);
    }

    const magicalElementIds = [];
    try {
        for (const numStr of JSON.parse(parameters["magicalElementIds"])) {
            const id = Number(numStr) || 0;
            if ((id > 0) && !physicalElementIds.includes(id) && !magicalElementIds.includes(id)) {
                magicalElementIds.push(id);
            }
        }
    } catch (e) {
        console.error(e);
    }

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * elementIdで指定される属性が、物理属性かどうかを取得する。
     * 
     * @param {Number} elementId 属性ID
     * @returns {Boolean} 物理属性の場合にはtrue, それ以外はfalse
     */
    DataManager.isPhysicalElement = function(elementId) {
        return physicalElementIds.includes(elementId);
    };

    /**
     * elementIdで指定される属性が、魔法属性かどうかを取得する。
     * 
     * @param {Number} elementId 属性ID
     * @returns {Boolean} 魔法属性の場合にはtrue, それ以外はfalse
     */
    DataManager.isMagicalElement = function(elementId) {
        return magicalElementIds.includes(elementId);
    };

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * 複数属性指定時のレート配列を受け取り、適用するレートを返す。
     * 
     * @param {Array<Number>} elements 属性ID配列。
     * @param {Array<Number>} elementRates IDに対応した倍率。elementRates[elementId]で値がとれる。
     * !!!overwrite!!! Game_Action.getApplyElementRate()
     */
    Game_Action.prototype.getApplyElementRate = function(elements, elementRates) {
        if (elements.length === 0) {
            // 無属性は除く。
            return 1;
        }

        const rates = [];

        let damageBonusDigit = 0;
        let damageBonus = 1;
        let absorbBonusDigit = 0;
        let absorbBonus = 1;

        for (const elementId of elements) {
            const rate = elementRates[elementId];
            rates.push(rate);
            if (rate > 1) {
                damageBonusDigit++;
                damageBonus += (rate - 1.0) * 0.1;
            } else if (rate < -1) {
                absorbBonusDigit++;
                absorbBonus += (Math.abs(rate) - 1.0) * 0.1;
            }
        }

        const damageRateAvg = (rates.length > 0)
                ? rates.reduce((r, rate) => r + rate, 0) / rates.length
                : 0;
        const bonusRate = (damageRateAvg >= 0)
                ? Math.pow(damageBonus, damageBonusDigit - 1)
                : Math.pow(absorbBonus, absorbBonusDigit - 1);
        return damageRateAvg * bonusRate;
    };

})();