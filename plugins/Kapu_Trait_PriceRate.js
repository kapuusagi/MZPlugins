/*:ja
 * @target MZ 
 * @plugindesc 価格レート特性プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_Base_ParamName
 * 
 * @command enableTrait
 * @text レートを有効にする
 * @desc レート特性有効/無効を設定する。開始/ロード時はtrueにリセットされる。
 * 
 * @arg enableBuyingPriceRateTrait
 * @text 購入価格レート特性有効
 * @desc trueにすると購入価格レート特性によるレートが有効になる。
 * @type boolean
 * @default true
 * 
 * @arg enableSellingPriceRateTrait
 * @text 売却価格レート特性有効
 * @desc trueにすると売却価格レート特性によるレートが有効になる。
 * @type boolean
 * @default true
 * 
 * @param enableDefaultSellingPriceRate
 * @text 基本売却レート有効
 * @desc 基本売却レートを有効にするかどうか。有効にするとオーバーライドされる。
 * @type boolean
 * @default false
 * 
 * @param basicSellingPriceRate
 * @text 基本売却レート
 * @desc 店頭売却時の基本売却レート。
 * @type number
 * @decimals 2
 * @default 0.50
 * @parent enableDefaultSellingPriceRate
 * 
 * 
 * @param buyingPriceRateTraitPartyAbilityId
 * @text 購入価格レート特性ID
 * @desc 購入価格レート特性に割り当てるパーティーアビリティID
 * @type number
 * @min 6
 * @default 102
 * 
 * @param sellingPriceRateTraitPartyAbilityId
 * @text 売却価格レート特性ID
 * @desc 売却価格レート特性に割り当てるパーティーアビリティID
 * @type number
 * @min 6
 * @default 103
 * 
 * @param textTraitBuyingPriceRate
 * @text 購入金額レート特性名
 * @desc 購入金額レート特性名
 * @type string
 * @default 購入金額
 * 
 * @param textTraitSellingPriceRate
 * @text 売却金額レート特性名
 * @desc 売却金額レート特性名
 * @type string
 * @default 売却金額
 * 
 * 
 * @help 
 * ベーシックシステム店頭での購入・売却レートに影響する特性を追加するプラグイン。
 * 購入・売却レート特性を一時的に無効にしたい場合、
 * ショップの呼び出しの前に、プラグインコマンドで特性無効に設定します。
 * 
 * ■ 使用時の注意
 * 他の価格操作系プラグインと競合する可能性があります。
 * 購入価格レートを低く、売却価格レートを高めにすると、購入価格より売却価格が上になり、
 * 資金の無限増殖ができるようになる可能性があります。
 * 
 * 1人のアクターが複数特性を持つ場合、加算合計になります。
 * パーティー内にこの特性を複数持つメンバーがいた場合、最も効果が大きい特性値が適用されます。
 * (購入価格レートは最も低いメンバーの値、売却価格レートは最も高いメンバーの値。)
 * 
 * 
 * ゲームバランスを崩壊させかねないので、倍率設定は注意ください。
 * 
 * ■ プラグイン開発者向け
 * Game_Temp.enableBuyingPriceRateTrait() : Boolean
 *     購入価格レート特性が有効かどうかを得る。
 * Game_Temp.enableSellingPriceRateTrait() : Boolean
 *     売却価格レート特性が有効かどうかを得る。
 * Game_Party.buyingPriceRate() : Number
 *     購入価格レート(0.0～1.0)を得る。
 * Game_Party.sellingPriceRate() : Number
 *     売却価格レート(0.0～1.0)を得る。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * enableTrait
 *     購入/売却価格レート特性を適用するかどうかを設定する。
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具
 *     <buyingPriceRate:rate>
 *         rate: 購入価格倍率値の値。
 *               0.1で-10％。つまり1割引。10パーセット♪10パーセント♪10パーセント引き～♪
 *     <buyingPriceRate:rateStr%>
 *          rateStr: 購入価格倍率値の値。
 *                   10で-10％。
 *     <sellingPriceRate:rate>
 *         rate: 売却価格倍率の値。
 *               0.1で+10%、つまり1割増し。
 *     <sellingPriceRate:rateStr%>
 *          rateStr: 購入価格倍率の値。
 *                   10で+10%。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 Kapu_Base_ParamNameに対応
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_Trait_PriceRate";
    const parameters = PluginManager.parameters(pluginName);

    enableDefaultSellingPriceRate = (typeof parameters["enableDefaultSellingPriceRate"] === "undefined")
            ? false : (parameters["enableDefaultSellingPriceRate"] === "true");
    basicSellingPriceRate = Number(parameters["basicSellingPriceRate"]) || 0;

    Game_Party.ABILITY_BUYING_PRICE_RATE = Number(parameters["buyingPriceRateTraitPartyAbilityId"]) || 0;
    Game_Party.ABILITY_SELLING_PRICE_RATE = Number(parameters["sellingPriceRateTraitPartyAbilityId"]) || 0;

    if (!Game_Party.ABILITY_BUYING_PRICE_RATE) {
        console.error(pluginName + ":ABILITY_BUYING_PRICE_RATE is not valid.");
    }
    if (!Game_Party.ABILITY_SELLING_PRICE_RATE) {
        console.error(pluginName + ":ABILITY_SELLING_PRICE_RATE is not valid.");
    }

    /**
     * ブール値を得る。
     * 
     * @param {object} str 引数
     * @returns {boolean} ブール値
     */
    const _getBoolean = function(str) {
        switch (typeof str) {
            case "undefined":
                return false;
            case "boolean":
                return str;
            case "str":
                return str === "true";
            default:
                return false;
        }
    }

    PluginManager.registerCommand(pluginName, "enableTrait", args => {
        const buyingEnable = _getBoolean(args.enableBuyingPriceRateTrait);
        const sellingEnable = _getBoolean(args.enableSellingPriceRateTrait)
        $gameTemp.setEnableBuyingPriceRateTrait(buyingEnable);
        $gameTemp.setEnableSellingPriceRateTrait(sellingEnable);
    });
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * 割合を得る。
     * 
     * @param {string} str 文字列
     * @returns {number} 割合を得る。
     */
    const _getRate = function(str) {
        if (str.slice(-1) === "%") {
            return Number(str.slice(0, str.length - 1)) / 100.0;
        } else {
            return Number(str);
        }
    };
    /**
     * ノートタグを処理する。
     * @param {object} obj データ
     */
    const _processNoteTag = function(obj) {
        if (obj.meta.buyingPriceRate) {
            const rate = _getRate(obj.meta.buyingPriceRate);
            if (rate !== 0) {
                obj.traits.push({ 
                    code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
                    dataId:Game_Party.ABILITY_BUYING_PRICE_RATE, 
                    value:rate
                });
            }
        }
        if (obj.meta.sellingPriceRate) {
            const rate = _getRate(obj.meta.sellingPriceRate);
            if (rate !== 0) {
                obj.traits.push({
                    code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
                    dataId:Game_Party.ABILITY_SELLING_PRICE_RATE, 
                    value:rate
                });
            }
        }
    };

    DataManager.addNotetagParserActors(_processNoteTag);
    DataManager.addNotetagParserClasses(_processNoteTag);
    DataManager.addNotetagParserWeapons(_processNoteTag);
    DataManager.addNotetagParserArmors(_processNoteTag);
    DataManager.addNotetagParserStates(_processNoteTag);
    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._partyAbilities && Game_Party.ABILITY_BUYING_PRICE_RATE) {
        TextManager._partyAbilities[Game_Party.ABILITY_BUYING_PRICE_RATE] = {
            name:parameters["textTraitBuyingPriceRate"] || "",
            value:TextManager.traitValueSum,
            str:TextManager.traitValueStrRate
        };
    }
    if (TextManager._partyAbilities && Game_Party.ABILITY_SELLING_PRICE_RATE) {
        TextManager._partyAbilities[Game_Party.ABILITY_SELLING_PRICE_RATE] = {
            name:parameters["textTraitSellingPriceRate"] || "",
            value:TextManager.traitValueSum,
            str:TextManager.traitValueStrRate
        };
    }
    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * Game_Tempを初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._enableBuyingPriceRateTrait = true;
        this._enableSellingPriceRateTrait = true;
    };

    /**
     * 購入価格レート特性が有効かどうかを取得する。
     * 
     * @returns {boolean} 価格レート特性が有効な場合にはtrue, それ以外はfalse.
     */
    Game_Temp.prototype.enableBuyingPriceRateTrait = function() {
        return this._enableBuyingPriceRateTrait;
    };

    /**
     * 購入価格レート特性の有効/無効を設定する。
     * 
     * @param {boolean} enabled 有効にする場合にはtrue, それ以外はfalse
     */
    Game_Temp.prototype.setEnableBuyingPriceRateTrait = function(enabled) {
        this._enableBuyingPriceRateTrait = enabled;
    };

    /**
     * 売却価格レート特性が有効かどうかを取得する。
     * 
     * @returns {boolean} 価格レート特性が有効な場合にはtrue, それ以外はfalse.
     */
    Game_Temp.prototype.enableSellingPriceRateTrait = function() {
        return this._enableSellingPriceRateTrait;
    };

    /**
     * 売却価格レート特性の有効/無効を設定する。
     * 
     * @param {boolean} enabled 有効にする場合にはtrue, それ以外はfalse
     */
    Game_Temp.prototype.setEnableSellingPriceRateTrait = function(enabled) {
        this._enableSellingPriceRateTrait = enabled;
    };

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * 購入価格レート
     * 
     * @returns {number} 購入価格レート
     */
    Game_BattlerBase.prototype.buyingPriceRate = function() {
        return this.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, Game_Party.ABILITY_BUYING_PRICE_RATE);
    };

    /**
     * 売却価格レート
     * 
     * @returns {number} 売却価格レート。
     */
    Game_BattlerBase.prototype.sellingPriceRate = function() {
        return this.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, Game_Party.ABILITY_SELLING_PRICE_RATE);
    };

    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * 購入価格レートを得る。
     * 
     * @returns {number} 購入価格レート
     */
    Game_Party.prototype.buyingPriceRate = function() {
        const discountRate = this.partyTraitsSumMax(Game_Party.ABILITY_BUYING_PRICE_RATE);
        return Math.max(0, 1 - discountRate);
    };

    /**
     * 売却価格レートを得る。
     * 
     * @returns {number} 売却価格レート
     */
    Game_Party.prototype.sellingPriceRate = function() {
        return Math.max(0, 1 + this.partyTraitsSumMax(Game_Party.ABILITY_SELLING_PRICE_RATE));
    };


    //------------------------------------------------------------------------------
    // Window_ShopBuy
    // Note: 購入価格はウィンドウから持ってくるので、こちらで処理する必要がある。
    //       Scene_Shopで適用すると、店頭表示価格と、購入価格が一致してない問題が発生する。
    const _Window_ShopBuy_price = Window_ShopBuy.prototype.price;
    /**
     * 購入価格を得る。
     * 
     * @param {object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @returns {number} 購入価格
     */
    Window_ShopBuy.prototype.price = function(item) {
        const price = _Window_ShopBuy_price.call(this, item);
        if ($gameTemp.enableBuyingPriceRateTrait()) {
            return Math.floor(price * $gameParty.buyingPriceRate());
        } else {
            return price;
        }
    };


    //------------------------------------------------------------------------------
    // Scene_Shop
    // Note: 店頭表示価格があるため、売却価格はこちらで処理する必要がある。
    
    if (enableDefaultSellingPriceRate) {
        /**
         * 売却価格を得る。
         * 
         * @returns {number} 売却価格
         */
        Scene_Shop.prototype.sellingPrice = function() {
            let sellingPrice = this._item.price * basicSellingPriceRate;
            if ($gameTemp.enableSellingPriceRateTrait()) {
                sellingPrice *= $gameParty.sellingPriceRate();
            }
            return Math.floor(sellingPrice);
        };
    } else {
        const _Scene_Shop_sellingPrice = Scene_Shop.prototype.sellingPrice;
        /**
         * 売却価格を得る。
         * 
         * @returns {number} 売却価格
         */
        Scene_Shop.prototype.sellingPrice = function() {
            const price = _Scene_Shop_sellingPrice.call(this);
            if ($gameTemp.enableSellingPriceRateTrait()) {
                return Math.floor(price * $gameParty.sellingPriceRate());
            } else {
                return price;
            }
        };
    }

})();
