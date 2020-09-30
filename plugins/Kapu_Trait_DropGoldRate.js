/*:ja
 * @target MZ 
 * @plugindesc エネミーからのゴールドドロップレート特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param TraitPartyAbilityId
 * @text パーティー特性DID
 * @desc 特性として割り当てるID番号。(6以上で他のプラグインとぶつからないやつ)
 * @default 101
 * @type number
 * @max 999
 * @min 6
 * 
 * @help 
 * Traitにドロップレート特性を追加します。
 * ドロップレートの倍率計算が次のようになります。
 * (ゴールドレート)=(パーティーメンバーの特性合計)×(ゴールド2倍特性があるなら2倍)
 * 
 * Game_Party.ABILITY_DROP_GOLD_RATEが定義されます。値はTraitIdで指定されたものになります。
 *  
 * 制限
 * その他のプラグインにより、独自のゴールド算出処理をやっている場合には効果がありません。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具
 *     <dropGoldRate:rate>
 *        rate: Gold倍率の値。1.0で100％増加。0.3で30%増加。
 *     <dropGoldRate:rateStr%>
 *        rateStr: Gold倍率の値。100で100%増加。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.2 ABILITY_DROP_GOLD_RATE未指定時は動作しないように変更した。
 * Version.0.1.1 IDデフォルト値を101に変更した。
 *               プラグインコメントにorderAfterを追加した。
 * Version.0.1.0 TWLDで実装したのを移植。
 */
(() => {
    const pluginName = "Kapu_Trait_DropGoldRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_Party.ABILITY_DROP_GOLD_RATE = Number(parameters["TraitPartyAbilityId"]) || 0;
    if (!Game_Party.ABILITY_DROP_GOLD_RATE) {
        console.error(pluginName + ":ABILITY_DROP_GOLD_RATE is not valid.");
        return;
    }

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * ドロップレートのノートタグを処理する。
     * @param {Object} obj データ
     */
    const _processCriticalDamageRateNoteTag = function(obj) {
        if (!obj.meta.dropGoldRate) {
            return;
        }
        const valueStr = obj.meta.dropGoldRate;
        if (valueStr.slice(-1) === "%") {
            dropRate = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            dropRate = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
            dataId:Game_Party.ABILITY_DROP_GOLD_RATE, 
            value:dropRate
        });
    };

    DataManager.addNotetagParserActors(_processCriticalDamageRateNoteTag);
    DataManager.addNotetagParserClasses(_processCriticalDamageRateNoteTag);
    DataManager.addNotetagParserWeapons(_processCriticalDamageRateNoteTag);
    DataManager.addNotetagParserArmors(_processCriticalDamageRateNoteTag);
    DataManager.addNotetagParserStates(_processCriticalDamageRateNoteTag);


    //------------------------------------------------------------------------------
    // Game_Party
    
    /**
     * 取得金額倍率を得る。
     *  
     * @return {Number} 取得金額倍率
     */
    Game_Party.prototype.getGoldRate = function() {
        var rate = this.hasGoldDouble() ? 2 : 1;
        return rate + this.partyTraitsSum(Game_Party.ABILITY_DROP_GOLD_RATE);
    };

    //------------------------------------------------------------------------------
    // Game_Troop

    /**
     * ゴールドレートを得る。
     * 
     * @return {Number} ゴールドレート。
     * !!!overwrite!!! Game_Troop.goldRate
     */
    Game_Troop.prototype.goldRate = function() {
        return $gameParty.getGoldRate();
    };
})();