/*:ja
 * @target MZ 
 * @plugindesc エネミーからのアイテムドロップレート特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param traitPartyAbilityId
 * @text 特性ID
 * @desc 特性として割り当てるID番号。(6以上で他のプラグインとぶつからないやつ)
 * @default 100
 * @type number
 * @max 999
 * @min 6
 * 
 * @param textTraitDropItemRate
 * @text ドロップアイテムレート名
 * @desc ドロップアイテムレート名
 * @type string
 * @default ドロップ率
 * 
 * @help 
 * Traitにドロップレート特性を追加します。
 * ドロップレートの倍率計算が次のようになります。
 * (ドロップレート)=(パーティーメンバーの特性合計)×(ドロップ2倍特性があるなら2倍)
 * 
 * 複数メンバー、複数の特性を持つ場合、それらの加算合計になります。
 *  
 * ■ 注意
 * その他のプラグインにより、
 * 独自のアイテムドロップ処理をやっている場合には効果がありません。
 * 
 * ■ プラグイン開発者向け
 * Game_Party.ABILITY_DROP_ITEM_RATEが定義されます。
 * 値はTraitIdで指定されたものになります。
 * 
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
 * Version.0.1.2 ABILITY_DROP_ITEM_RATE未指定時は動作しないように変更した。
 * Version.0.1.1 IDデフォルト値を100に変更した。
 *               プラグインコメントにorderAfterを追加した。
 * Version.0.1.0 TWLDで実装したのを移植。
 */
(() => {
    const pluginName = "Kapu_Trait_DropItemRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_Party.ABILITY_DROP_ITEM_RATE = Number(parameters["traitPartyAbilityId"]) || 0;
    if (!Game_Party.ABILITY_DROP_ITEM_RATE) {
        console.error(pluginName + ":ABILITY_DROP_ITEM_RATE is not valid.");
        return;
    }

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
    // TextManager
    if (TextManager._partyAbilities && Game_Party.ABILITY_DROP_ITEM_RATE) {
        TextManager._partyAbilities[Game_Party.ABILITY_DROP_ITEM_RATE] = {
            name:parameters["textTraitDropItemRate"] || "",
            value:TextManager.traitValueSum,
            str:TextManager.traitValueStrRate
        };
    }

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * ドロップアイテム率(加算値)を得る。
     * 
     * @return {Number} ドロップアイテム率(加算値)
     */
    Game_BattlerBase.prototype.dropItemRate = function() {
        return this.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, Game_Party.ABILITY_DROP_ITEM_RATE);
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    /**
     * ドロップレート補正倍率を得る。
     * @return {Number} ドロップレート補正倍率
     */
    Game_Party.prototype.dropItemRate = function() {
        const rate = this.hasDropItemDouble() ? 2 : 1;
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
        return $gameParty.dropItemRate();
    };
})();