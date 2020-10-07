/*:ja
 * @target MZ
 * @plugindesc 道具/武器/防具を個別化する。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem
 * @orderAfter Kapu_IndependentItem
 * 
 * @param isShopRandomize
 * @text ショップ購入品性能ランダム化
 * @desc ショップでの購入品に対して、性能をランダム化するかどうかを指定します。
 * @default false
 * @type boolean
 * 
 * 
 * ■ setRandomize
 * @command setRandomize
 * @text 個別アイテム性能変動ON/OFF
 * @desc 個別アイテムの入手時 性能変動をON/OFFする。
 * 
 * @arg enabled
 * @text 有効
 * @desc 有効にするかどうか。
 * @type boolean
 * @default false
 * 
 * @help 
 * 個別アイテム入手時、一部の性能にばらつきを持たせます。
 * ばらつきを持たせられるのは以下のものです。
 * アイテム
 *    HP回復効果量/MP回復効果量
 * 武器・防具
 *    MaxHP/MaxMP/ATK/DEF/MATK/MDEF/AGI/LUK加算値
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * setRandomize
 *    ショップでの個別アイテム購入時、ばらつきを有効にするかどうか。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム
 *     <varianceEffect:value#>
 *        -value#～valueの範囲の値を効果量に加算する。
 *        効果があるのは、HP回復効果/MP回復効果の固定回復量。割合の方は変化させない。
 *        ばらつき加算結果は0以下にしない。
 *     <varianceEffect:value1#,value2#>
 *        -value#～valueの範囲の値を効果量に加算する。
 *        value1は割合。value2は固定子回復量
 *        value1は10と指定すると、±10%になる。
 *        ばらつき加算結果は0以下にしない。
 * 武器/防具
 *     <varianceParam:value#>
 *        0～valueの範囲で、全ての0でないパラメータに加算させる。
 *     <varianceParam:N=value#,...>
 *        0～valueの範囲で指定パラメータを加算する。Nはパラメータ名。
 *        Nに指定可能なものは次の通り。
 *        "MaxHP","MaxMP","ATK","DEF","MATK","MDEF","AGI","LUK"
 *        
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 
 */
(() => {
    "use strict"

    const pluginName = "Kapu_IndependentItem_Randomize"

    const parameters = PluginManager.parameters(pluginName);
    const isShopRandomize = (typeof parameters["isShopRandomize"])
            ? false : (parameters["isShopRandomize"] === "true");

    PluginManager.registerCommand(pluginName, "setRandomize", args => {
        const enabled = (typeof args.enabled === "undefined")
                ? false : (args.enabled === "true");
        $gameTemp.setIndependentItemRandomize(enabled);
    });

    //-------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;

    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this, ...arguments);
        this._isIndependentItemRandomize = true;
    };

    /**
     * 個別アイテムの性能ランダム化を有効にするかどうかを設定する。
     * 
     * @param {Boolean} enabled 有効にするかどうか。
     */
    Game_Temp.prototype.setIndependentItemRandomize = function(enabled) {
        this._isIndependentItemRandomize = enabled;
    };

    /**
     * 個別アイテムの性能ランダム化が有効かどうかを取得する。
     * 
     * @return {Boolean} 有効にする場合にはtrue, それ以外はfalse
     */
    Game_Temp.prototype.independentItemRandomize = function() {
        return this._isIndependentItemRandomize || false;
    };

    //-------------------------------------------------------------------------
    // Scene_Shop

    if (!isShopRandomize) {
        const _Scene_Shop_doBuy = Scene_Shop.prototype.doBuy;
        /**
         * 購入処理をする。
         * 
         * @param {Number} number 個数
         */
        Scene_Shop.prototype.doBuy = function(number) {
            const prevEnabled = $gameTemp.independentItemRandomize();
            $gameTemp.setIndependentItemRandomize(false);
            _Scene_Shop_doBuy.call(this, ...arguments);
            $gameTemp.setIndependentItemRandomize(prevEnabled); // 元に戻す。
        };
    }



    //-------------------------------------------------------------------------
    // DataManager

    const _DataManager_initializeIndependentItem = DataManager.initializeIndependentItem;

    /**
     * 新しい個別アイテムを初期化する。
     * 他のプラグインでフックし、個別アイテムを使って使用したい機能を実現することを想定する。
     * 
     * @param {DataItem} newItem 新しい個別アイテム
     * @param {DataItem} baseItem 元となるアイテムデータ
     */
    DataManager.initializeIndependentItem = function(newItem, baseItem) {
        _DataManager_initializeIndependentItem.call(this, ...arguments);
        if ($gameTemp.independentItemRandomize()) {
            DataManager.randomizeEffectPerformance(newItem, baseItem);
        }
    };

    const _DataManager_initializeIndependentWeapon = DataManager.initializeIndependentWeapon;
    /**
     * 新しい個別武器を初期化する。
     * 他のプラグインでフックし、個別武器を使って使用したい機能を実現することを想定する。
     * 
     * @param {DataWeapon} newWeapon 新しい個別武器
     * @param {DataWeapon} baseWeapon ベース武器データ
     */
    DataManager.initializeIndependentWeapon = function(newWeapon, baseWeapon) {
        _DataManager_initializeIndependentWeapon.call(this, ...arguments);
        if ($gameTemp.independentItemRandomize()) {
            DataManager.randomizeEquipPerformance(newWeapon, baseWeapon);
        }
    };

    const _DataManager_initializeIndependentArmor = DataManager.initializeIndependentArmor;
    /**
     * 新しい個別防具を初期化する。
     * 他のプラグインでフックし、個別防具を使って使用したい機能を実現することを想定する。
     * 
     * @param {DataArmor} newArmor 新しい個別防具
     * @param {DataArmor} baseArmor ベース防具データ
     */
    DataManager.initializeIndependentArmor = function(newArmor, baseArmor) {
        _DataManager_initializeIndependentArmor.call(this, ...arguments);
        if ($gameTemp.independentItemRandomize()) {
            DataManager.randomizeEquipPerformance(newArmor, baseArmor);
        }
    };

    /**
     * itemで指定される個別アイテムの性能を、ベースアイテムのデータを元にばらつきを与える。
     * 
     * @param {object} item 個別アイテム(DataItem/DataWeapon/DataArmor)
     */
    DataManager.randomizeIndependenetItem = function(item) {
        if (DataManager.isIndependentItem(item)) {
            const baseItem = DataManager.getBaseItem(item);
            if (DataManager.isItem(item)) {
                DataManager.randomizeEffectPerformance(item, baseItem);
            } else if (DataManager.isWeapon(item)) {
                DataManager.randomizeEquipPerformance(item, baseItem);
            } else if (DataManager.isArmor(item)) {
                DataManager.randomizeEquipPerformance(item, baseItem);
            }
        }
    };


    /**
     * varianceEffectを解析する。
     * 
     * @param {String} varianceStr varianceEffectノートタグの値
     * @return {object} 効果変動量オブジェクト
     */
    const _parseVarianceEffect = function(varianceStr) {
        const tokens = varianceStr.split(",");
        let v1 = 0;
        let v2 = 0;
        if (tokens.length == 1) {
            v2 = (tokens.length >= 1) ? (Number(tokens[0]) || 0) : 0;
        } else {
            v1 = (tokens.length >= 1) ? (Number(tokens[0]) || 0) : 0;
            v2 = (tokens.length >= 2) ? (Number(tokens[1]) || 0) : 0;
        }
        return { value1:v1, value2:v2 };
    };

    /**
     * 効果量に変動分を加味した値を計算して返す。
     * 
     * @param {Number} baseValue ベース値
     * @param {Number} variance 変動量
     * @return {Number} 効果量。
     */
    const _calcEffectValue = function(baseValue, variance) {
        if ((baseValue === 0) || (variance === 0)) {
            return baseValue; // 変動なし。
        } else {
            const varianceValue = Math.floor((variance * 2 + 1) * Math.random()) - variance;
            const value = baseValue + varianceValue;
            return (value > 0) ? value : 0;
        }
    };


    /**
     * 効果をランダムに増加させる。
     * 
     * @param {DataItem} item アイテム
     * @param {DataItem} baseItem ベースアイテム
     */
    DataManager.randomizeEffectPerformance = function(item, baseItem) {
        if (!baseItem.meta.varianceEffect) {
            return ;
        }
        const varianceEffect = _parseVarianceEffect(baseItem.meta.varianceEffect);
        for (const effect of item.effects) {
            if ((effect.code === Game_Action.EFFECT_RECOVER_HP)
                    || (effect.code === Game_Action.EFFECT_RECOVER_MP)) {
                const baseValue1 = Math.round(effect.value1 * 100);
                const value1 = _calcEffectValue(baseValue1, varianceEffect.value1);
                effect.value1 = (value1 / 100).toFixed(2);
                effect.value2 = _calcEffectValue(effect.value2, varianceEffect.value2);
            }
        }
    };

    /**
     * varianceParamのタグ値を解析する。
     * 
     * @param {String} varianceStr 
     * @return {Array<Number>} 配列データ
     */
    const _parseVarianceParam = function(varianceStr) {
        const varianceParam = [ 0, 0, 0, 0, 0, 0, 0 , 0];
        const singleNumber = Number(varianceStr);
        if (singleNumber) {
            for (let i = 0; i < varianceParam.length; i++) {
                varianceParam[i] = singleNumber;
            }
        } else {
            const paramArray = [ "MaxHP", "MaxMP", "ATK", "DEF", "MATK", "MDEF", "AGI", "LUK"];
            for (const token of varianceStr.split(",")) {
                const arg = token.split("=");
                if (arg.length > 1) {
                    const index = paramArray.indexOf(arg[0]);
                    const variance = Number(arg[1]);
                    if (index >= 0) {
                        varianceParam[index] = variance;
                    }
                } 
            }
        }

        return varianceParam;
    };
    /**
     * 性能に変動分を加味した値を計算して返す。
     * 
     * @param {Number} baseValue ベース値
     * @param {Number} variance 変動量
     * @return {Number} 効果量。
     */
    const _calcParamValue = function(baseValue, variance) {
        if (variance === 0) {
            return baseValue; // 変動なし。
        } else {
            const varianceValue = Math.floor((variance * 2 + 1) * Math.random()) - variance;
           return (baseValue + varianceValue);
        }
    };
    /**
     * 武器性能をランダムに変動させる。
     * 変動効果が適用されるのはparamのパラメータのみ。traitsは影響させない。
     * 
     * @param {object} item アイテム
     * @param {object} baseItem ベースアイテム
     */
    DataManager.randomizeEquipPerformance = function(item, baseItem) {
        if (!baseItem.meta.varianceParam) {
            return;
        }
        const varianceParam = _parseVarianceParam(baseItem.meta.varianceParam);
        for (let i = 0; i < 8; ++i) {
            item.params[i] = _calcParamValue(baseItem.params[i], varianceParam[i]);
        }
    };

})();