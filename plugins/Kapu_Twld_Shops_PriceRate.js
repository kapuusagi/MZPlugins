/*:ja
 * @target MZ 
 * @plugindesc TWLD ShopのPriceRate対応プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Twld_Shops
 * @orderAfter Kapu_Twld_Shops
 * @base Kapu_Trait_PriceRate
 * @orderAfter Kapu_Trait_PriceRate
 * 
 * 
 * @help 
 * Twld_ShopsにTrait_PriceRateを適用するプラグイン。
 * 
 * ■ 使用時の注意
 * なし
 * 
 * ■ プラグイン開発者向け
 * なし
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグを処理する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 追加した。
 */
(() => {
    //const pluginName = "Kapu_Twld_Shops_PriceRate";
    //const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_Shop

    const _Game_Shop_buyingPriceRate = Game_Shop.prototype.buyingPriceRate;
    /**
     * この店からの購入価格レートを取得する。
     * 
     * @return {Number} 販売価格レート(1.0で等倍)
     */
    Game_Shop.prototype.buyingPriceRate = function() {
        const rate = _Game_Shop_buyingPriceRate.call(this);
        if ($gameTemp.enableBuyingPriceRateTrait()) {
            return rate * $gameParty.buyingPriceRate();
        } else {
            return rate;
        }
    };

    const _Game_Shop_sellingPriceRate = Game_Shop.prototype.sellingPriceRate;
    /**
     * この店への売却価格レートを取得する。
     * 
     * @param {Number} 売却価格レート(1.0で等倍)
     */
    Game_Shop.prototype.sellingPriceRate = function() {
        const rate = _Game_Shop_sellingPriceRate.call(this);
        if ($gameTemp.enableSellingPriceRateTrait()) {
            return rate * $gameParty.sellingPriceRate();
        } else {
            return rate;
        }
    };
})();