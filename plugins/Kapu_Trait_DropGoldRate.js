/*:ja
 * @target MZ 
 * @plugindesc エネミーからのゴールドドロップレート特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_Base_ParamName
 * @base Kapu_Base_Drop
 * @orderAfter Kapu_Base_Drop
 * 
 * @param traitPartyAbilityId
 * @text パーティー特性DID
 * @desc 特性として割り当てるID番号。(6以上で他のプラグインとぶつからないやつ)
 * @default 101
 * @type number
 * @max 999
 * @min 6
 * 
 * @param textTraitDropGoldRate
 * @text ゴールドドロップ量増加特性
 * @desc ゴールドドロップ量増加特性
 * @type string
 * @default ゴールド取得率
 * 
 * 
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
 * 複数メンバー、複数の特性を持つ場合、それらの加算合計になります。
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
 * Version.0.4.0 Kapu_Base_Dropを使用するように変更。
 * Version.0.3.0 Kapu_Base_ParamName に対応
 * Version.0.2.0 特性値を取得するインタフェースを追加。
 * Version.0.1.2 ABILITY_DROP_GOLD_RATE未指定時は動作しないように変更した。
 * Version.0.1.1 IDデフォルト値を101に変更した。
 *               プラグインコメントにorderAfterを追加した。
 * Version.0.1.0 TWLDで実装したのを移植。
 */
(() => {
    const pluginName = "Kapu_Trait_DropGoldRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_Party.ABILITY_DROP_GOLD_RATE = Number(parameters["traitPartyAbilityId"]) || 0;
    if (!Game_Party.ABILITY_DROP_GOLD_RATE) {
        console.error(pluginName + ":ABILITY_DROP_GOLD_RATE is not valid.");
        return;
    }

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * ノートタグを処理する。
     * 
     * @param {Object} obj データ
     */
    const _processNoteTag = function(obj) {
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

    DataManager.addNotetagParserActors(_processNoteTag);
    DataManager.addNotetagParserClasses(_processNoteTag);
    DataManager.addNotetagParserWeapons(_processNoteTag);
    DataManager.addNotetagParserArmors(_processNoteTag);
    DataManager.addNotetagParserStates(_processNoteTag);
    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._partyAbilities && Game_Party.ABILITY_DROP_GOLD_RATE) {
        TextManager._partyAbilities[Game_Party.ABILITY_DROP_GOLD_RATE] = {
            name:parameters["textTraitDropGoldRate"] || "",
            value:TextManager.traitValueSum,
            str:TextManager.traitValueStrRate
        };
    }
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * 取得金額倍率を得る。
     * 
     * @returns {Number} 取得金額倍率。
     */
    Game_BattlerBase.prototype.dropGoldRate = function() {
        return this.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, Game_Party.ABILITY_DROP_GOLD_RATE);
    };


    //------------------------------------------------------------------------------
    // Game_Party
    const _Game_Party_dropGoldRate = Game_Party.prototype.dropGoldRate;
    /**
     * 取得金額倍率を得る。
     *  
     * @returns {Number} 取得金額倍率
     */
    Game_Party.prototype.dropGoldRate = function() {
        const rate = _Game_Party_dropGoldRate.call(this);
        return rate + this.partyTraitsSum(Game_Party.ABILITY_DROP_GOLD_RATE);
    };



})();
