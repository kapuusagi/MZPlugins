/*:ja
 * @target MZ 
 * @plugindesc エネミーからのアイテムドロップレート特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param TraitPartyAbilityId
 * @text 特性ID
 * @desc 特性として割り当てるID番号。(6以上で他のプラグインとぶつからないやつ)
 * @default 100
 * @type number
 * @max 999
 * @min 6
 * 
 * @help 
 * Traitにドロップレート特性を追加します。
 * ドロップレートの倍率計算が次のようになります。
 * (ドロップレート)=(パーティーメンバーの特性合計)×(ドロップ2倍特性があるなら2倍)
 * 
 * Game_Party.ABILITY_DROP_ITEM_RATEが定義されます。値はTraitIdで指定されたものになります。
 *  
 * 制限
 * その他のプラグインにより、独自のアイテムドロップ処理をやっている場合には効果がありません。
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
 *     <dropItemRate:rate>
 *        rate: ドロップ率特性の値。1.0で100％増加。0.3で30%増加。
 *     <dropItemRate:rateStr%>
 *        rateStr: ドロップ率特性の値。100で100%増加。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.1 IDデフォルト値を100に変更した。
 *               プラグインコメントにorderAfterを追加した。
 * Version.0.1.0 TWLDで実装したのを移植。
 */
(() => {
    const pluginName = "Kapu_Trait_DropItemRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_Party.ABILITY_DROP_ITEM_RATE = Number(parameters["TraitPartyAbilityId"]) || 0;

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * itemの特性にvalueStrのドロップレート加算する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/Stateのいずれか。traitsを持ってるデータ
     */
    const _processDropItemRateTrait = function(obj) {
        if (!obj.meta.dropItemRate) {
            return;
        }
        const valueStr = obj.meta.dropItemRate;
        let dropRate;
        if (valueStr.slice(-1) === "%") {
            dropRate = Number(valueStr.slice(0, valueStr.length - 1)).clamp(-500, 500) / 100.0;
        } else {
            dropRate = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
            dataId:Game_Party.ABILITY_DROP_ITEM_RATE, 
            value:dropRate
        });
    };

    DataManager.addNotetagParserActors(_processDropItemRateTrait);
    DataManager.addNotetagParserClasses(_processDropItemRateTrait);
    DataManager.addNotetagParserWeapons(_processDropItemRateTrait);
    DataManager.addNotetagParserArmors(_processDropItemRateTrait);
    DataManager.addNotetagParserStates(_processDropItemRateTrait);

    //------------------------------------------------------------------------------
    // Game_Enemy
    /**
     * ドロップレート補正倍率を得る。
     * @return {Number} ドロップレート補正倍率
     */
    Game_Party.prototype.getDropRate = function() {
        var rate = this.hasDropItemDouble() ? 2 : 1;
        return rate + this.partyTraitsSum(Game_Party.ABILITY_DROP_ITEM_RATE);
    };
    //------------------------------------------------------------------------------
    // Game_Enemy

    /**
     * アイテムドロップ率補正倍率を得る。
     * 
     * @return {Number} 補正倍率
     * !!!overwrite!!! Game_Enmy.dropItemRate
     */
    Game_Enemy.prototype.dropItemRate = function() {
        return $gameParty.getDropRate();
    };
})();