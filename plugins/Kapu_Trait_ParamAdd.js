/*:ja
 * @target MZ 
 * @plugindesc パラメータ単純加算特性プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param traitCode
 * @desc 特性コード
 * @text 単純加算特性に割り当てるコード。
 * @type number
 * @default 107
 * 
 * @param textTraitParamAddUp
 * @text 単純加算特性名
 * @desc 単純加算特性名(加算)。%1にパラメータ名。
 * @type string
 * @default %1増加
 * 
 * @param textTraitParamAddDown
 * @text 単純加算特性名
 * @desc 単純加算特性名(減少)。%1にパラメータ名。
 * @type string
 * @default %1減少
 * 
 * @help 
 * ベーシックシステムでは、パラメータを単純加算できるのは装備品だけである。
 * 本プラグインではアクターやクラス、ステートにパラメータを単純加算する特性を追加する。
 * 主な用途としては、ステートにHP固定量増加をつける場合などになる。
 * 
 * 本特性はクラスやバフのHP割合上昇の対象になる。
 * 
 * ■ 使用時の注意
 * なし。
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
 * アクター/クラス/ステート
 *   <paramAdd:entry$,entry$,...>
 *     entry$書式
 *       target=value
 *         targetにvalueだけ加算する。
 *         targetは"MaxHP","MaxMP","ATK","DEF","MAT","MDF","AGI","LUK"が指定できる。
 *         valueは整数値のみ。
 * 
 *     ※武器/防具/エネミーは直接パラメータを操作できるので対象から外している。
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 初版作成。
 */
(() => {
    const pluginName = "Kapu_Trait_ParamAdd";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_PARAM_ADD = Number(parameters["traitCode"]) || 0;
    if (!Game_BattlerBase.TRAIT_PARAM_ADD) {
        console.error(pluginName + ":TRAIT_PARAM_ADD is not valid.");
        return;
    }

    const textTraitParamAddUp = parameters["textTraitParamAddUp"] || "";
    const textTraitParamAddDown = parameters["textTraitParamAddDown"] || "";

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * ノートタグを処理する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        if (!obj.meta.paramAdd) {
            return;
        }

        const params = ["MaxHP", "MaxMP", "ATK", "DEF", "MAT", "MDF", "AGI", "LUK" ];
        const addParams = [0, 0, 0, 0, 0, 0, 0, 0];
        const tokens = obj.meta.paramAdd.split(",");
        for (const token of tokens) {
            const keyval = token.split("=");
            if (keyval.length >= 2) {
                const paramIndex = params.indexOf(keyval[0].trim());
                const value = Math.round(Number(keyval[1]) || 0);
                if ((paramIndex >= 0) && (paramIndex < addParams.length) && (value !== 0)) {
                    addParams[paramIndex] += value;
                }
            }
        }
        for (let paramId = 0; paramId < addParams.length; paramId++) {
            if (addParams[paramId] !== 0) {
                obj.traits.push({ 
                    code:Game_BattlerBase.TRAIT_PARAM_ADD, 
                    dataId:paramId, 
                    value:addParams[paramId]
                });
            }
        }
    };

    DataManager.addNotetagParserActors(_processNotetag);
    DataManager.addNotetagParserClasses(_processNotetag);
    DataManager.addNotetagParserStates(_processNotetag);
    //------------------------------------------------------------------------------
    // TextManager
    TextManager.traitParamAdd = function(dataId, value) {
        const fmt = (value >= 0) ? textTraitParamAddUp : textTraitParamAddDown;
        const paramName = TextManager.param(dataId);
        return ((fmt && paramName) ? fmt.format(paramName) : "");
    };
    if (TextManager._traitConverters) {
        TextManager._traitConverters[Game_BattlerBase.TRAIT_PARAM_ADD] = {
            name:TextManager.traitParamAdd, value:TextManager.traitValueSum, str:TextManager.traitValueStrInt, baseValue:0
        };
    }
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_paramPlus = Game_BattlerBase.prototype.paramPlus;
    /**
     * 基本パラメータの加算値を得る。
     * 
     * @param {Number} paramId パラメータID
     * @returns {Number} パラメータの値
     */
    Game_BattlerBase.prototype.paramPlus = function(paramId) {
        const paramValue = _Game_BattlerBase_paramPlus.call(this, paramId);
        const paramAdd = this.traitsSum(Game_BattlerBase.TRAIT_PARAM_ADD, paramId);
        return paramValue + paramAdd;
    };

})();