/*:ja
 * @target MZ 
 * @plugindesc 装備品のパラメータ拡張プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * 
 * @help 
 * 装備品のパラメータについて、以下の拡張を行います。
 * ・装備品のパラメータ値として、任意の計算式を指定できるようにします。
 *   例えば持っている所持金が多いほど攻撃力が大きい、というような武器を作ることができます。
 *   
 * ・装備時の計算式として、任意の計算式を指定できるようにします。
 *   例えばアクターのHPを攻撃力に反映するような武器を作ることができます。
 * 
 * ■ 使用時の注意
 * 計算式に重いものを入れると、全体的に重くなる可能性があります。
 * (プラグインに依る。)
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 武器・防具
 *   <mhpExtends:eval$>
 *   <mmpExtends:eval$>
 *   <atkExtends:eval$>
 *   <matExtends:eval$>
 *   <defExtends:eval$>
 *   <mdfExtends:eval$>
 *   <agiExtends:eval$>
 *   <lukExtends:eval$>
 *     それぞれのパラメータをeval$で指定した式の値だけ加算する。
 *     vに変数配列が入る。
 *   <mhpEquipEval:eval$>
 *   <mmpEquipEval:eval$>
 *   <atkEquipEval:eval$>
 *   <matEquipEval:eval$>
 *   <defEquipEval:eval$>
 *   <mdfEquipEval:eval$>
 *   <agiEquipEval:eval$>
 *   <lukEquipEval:eval$>
 *      それぞれのパラメータをeval$で指定した式で計算する。
 *      aに装備者(Game_Actor), param にアイテムの装備値、vに変数配列が入る。
 *      paramにはmhpExtends/mmpExtends/atkExtends/matExtends/defExtends/mdfExtends/agiExtends/lukExtendsが
 *      反映された値が入る。
 * 
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_EquipParam_Extends";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * Weapon/Armorのノートタグを解析する。
     * 
     * @param {object} obj DataWeapon/DataArmor
     */
    const _parseWeaponArmorNotetag = function(obj) {
        obj.paramExtends = [];
        obj.paramEquipEvals = [];

        const metaKeyExtends = [
            "mhpExtends", "mmpExtends", "atkExtends", "matExtends", 
            "defExtends", "mdfExtends", "agiExtends", "lukExtends"
        ];
        for (let i = 0; i < metaKeyExtends.length; i++) {
            const key = metaKeyExtends[i];
            if (obj.meta[key] !== undefined) {
                obj.paramExtends[i] = obj.meta[key] || undefined;
            }
        }

        const metaKeyEquipEvals = [
            "mhpEquipEval", "mmpEquipEval", "atkEquipEval", "matEquipEval", 
            "defEquipEval", "mdfEquipEval", "agiEquipEval", "lukEquipEval"
        ];
        for (let i = 0; i < metaKeyEquipEvals.length; i++) {
            const key = metaKeyEquipEvals[i];
            if (obj.meta[key] !== undefined) {
                obj.paramEquipEvals[i] = obj.meta[key] || undefined;
            }
        }
    };
    DataManager.addNotetagParserWeapons(_parseWeaponArmorNotetag);
    DataManager.addNotetagParserArmors(_parseWeaponArmorNotetag);

    const _DataManager_itemEquipParam = DataManager.itemEquipParam;
    /**
     * 装備品の基本パラメータ値を得る。
     * 
     * @param {object} equipItem 装備品
     * @param {number} paramId パラメータID
     * @returns {number} 装備品のパラメータ値
     */
    DataManager.itemEquipParam = function(equipItem, paramId) {
        const baseValue = _DataManager_itemEquipParam.call(this, equipItem, paramId);
        const extendsValue = this.itemEquipParamExtends(equipItem.paramExtends[paramId]);
        return baseValue + extendsValue;
    };

    /**
     * 拡張パラメータ値を返す。
     * 
     * @param {object} paramExtend 
     * @returns {number} 値
     */
    DataManager.itemEquipParamExtends = function(paramExtend) {
        if (paramExtend) {
            try {
                const v = $gameVariables._data; // eslint-disable-line no-unused-vars
                return Math.round(eval(paramExtend)) || 0;
            }
            catch (e) {
                return 0;
            }

        } else {
            return 0;
        }
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_paramEquipValue = Game_Actor.prototype.paramEquipValue;
    /**
     * 装備品の基本パラメータ値を得る。
     * 
     * @param {object} equipItem 装備品
     * @param {number} paramId パラメータID
     * @returns {number} 装備品のパラメータ値
     */
    Game_Actor.prototype.paramEquipValue = function(equipItem, paramId) {
        const param = _Game_Actor_paramEquipValue.call(this, equipItem, paramId);
        if (equipItem.paramEquipEvals[paramId]) {
            try {
                const a = this; // eslint-disable-line no-unused-vars
                const v = $gameVariables._data; // eslint-disable-line no-unused-vars
                return Math.round(eval(equipItem.paramEquipEvals[paramId])) || 0;
            }
            catch (e) {
                return param;
            }
        } else {
            return param;
        }
    };
})();