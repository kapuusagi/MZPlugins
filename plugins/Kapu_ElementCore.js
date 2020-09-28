/*:ja
 * @target MZ 
 * @plugindesc 属性処理についてのいくつかの拡張を行うプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @help 
 * 属性処理について、以下の拡張を行います。
 * ・スキルに複数属性を持たせる。(elementIdsノートタグ参照。)
 * ・異なるプラグインで競合しにくくするメソッド変更。（プラグイン開発者向けを参照）
 * 
 * ■ 注意
 * 以下のメソッドがオーバーライドされるため、競合に注意が必要です。
 * Game_Action.prototype.elementRate
 * Game_Action.prototype.elementsMaxRate
 * 
 * ■ プラグイン開発者向け
 * $dataSkill, $Items, $dataWeaponsのdamageにelementIdsフィールドを追加します。
 * Game_Action.elementRateをオーバーライドします。
 * Game_Action.elementsMaxRateをオーバーライドします。
 * Game_Action.getApplyElementRateを追加します。
 * 複数属性指定時のレート配列を受け取り、適用するレートを返します。
 * 乗算結果を返したい場合にはこのメソッドをオーバーライドすれば済みます。
 * Game_Action.singleElementRateを追加します。
 * 使用者から対象への1つの属性倍率を操作する場合、このメソッドをフックすれば済みます。
 * 
 * 複数属性適用時の演算処理は、ベーシックシステムにあわせて最大の効果量を返すようにしてありますが、
 * 乗算結果にしたい場合にはelementsMaxRateをオーバーライドします。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 武器/スキル
 *     <elementIds:id#>
 *     <elementIds:id#,id#,id#...>
 *         複数属性を適用します。
 *
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_ElementCore";
    const parameters = PluginManager.parameters(pluginName);


    //------------------------------------------------------------------------------
    // DataManager
    /**
     * elementAbsorb ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processElementIdsNotetag = function(obj) {
        if (!"damage" in obj) {
            return;
        }
        obj.damage.elementIds = [];
        if (obj.damage.elementId > 0) {
            obj.damage.elementIds.push(obj.damage.elementId);
        }

        if (!obj.meta.elementIds) {
            return;
        }
        const valueStr = obj.meta.elementIds;
        const tokens = valueStr.split(",");
        for (token of tokens) {
            const elementId = Number(token);
            if (elementId) {
                obj.damage.elementIds.push(elementId);
            }
        }
        if ((obj.damage.elementId < 0) && (obj.damage.elementIds.length > 0)) {
            obj.damage.elementId = Math.min(...obj.damage.elementIds);
        }
    };
    DataManager.addNotetagParserSkills(_processElementIdsNotetag);
    DataManager.addNotetagParserItems(_processElementIdsNotetag);

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * 属性による効果倍率を得る。
     * 
     * @param {Game_BattlerBase} target ターゲット
     * @return {Number} 効果倍率
     * !!!overwrite!!! Game_Action.calcElementRate
     */
    Game_Action.prototype.calcElementRate = function(target) {
        const item = this.item();
        const elements = (item.damage.elementIds.length > 0) 
            ? item.damage.elementIds : this.subject().attackElements();
        return this.elementsMaxRate(target, elements);
    };

    /**
     * 複数属性による効果倍率を得る。
     * 既定の実装では単純に最大値のレートを返す。
     * 
     * @param {Game_BattlerBase} target ターゲット
     * @return {Number} 効果倍率
     * !!!overwrite!!! Game_Action.elementsMaxRate
     */
    Game_Action.prototype.elementsMaxRate = function(target, elements) {
        const elementRates = new Array($dataSystem.elements.length).fill(0);
        for (elementId of elements) {
            elementRates[elementId] = this.singleElementRate(target, elementId);
        }
        return this.getApplyElementRate(elements, elementRates);
    };

    /**
     * 複数属性指定時のレート配列を受け取り、適用するレートを返す。
     * 
     * @param {Array<Number>} elements 属性ID配列。
     * @param {Array<Number>} elementRates IDに対応した倍率。elementRates[elementId]で値がとれる。
     */
    Game_Action.prototype.getApplyElementRate = function(elements, elementRates) {
        return Math.max(...elementRates);
    };

    /**
     * 単一の属性効果を得る。
     * 
     * @param {Game_BattlerBase} target 
     * @param {Number} elementId 属性ID
     * @return {Number} 属性倍率
     */
    Game_Action.prototype.singleElementRate = function(target, elementId) {
        return target.elementRate(elementId);
    };
})();