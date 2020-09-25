/*:ja
 * @target MZ 
 * @plugindesc ランダムエンカウント時の先制攻撃率特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param TraitId
 * @text パーティー特性DID
 * @desc 特性として割り当てるID番号。(6以上で他のプラグインとぶつからないやつ)
 * @default 8
 * @type number
 * @max 999
 * @min 6
 * 
 * @help 
 * Traitに先制攻撃率加算を追加します。
 * 先制攻撃率が以下のように変更されます。
 * (先制攻撃率) = {(基本先制攻撃率) + (先制攻撃率加算値)} * (先制攻撃率向上特性がある場合には4倍)
 * 
 * あと、たぶんランダムエンカウント時のみ有効なはず。
 * 
 * ベーシックシステムには先制攻撃率向上がありますが、固定（4倍）となっているため、個性を持たせられません。
 * 
 * Game_Party.ABILITY_PREEMPTIVE_RATE が定義されます。値はTraitIdで指定されたものになります。
 *  
 * 制限
 * その他のプラグインにより、独自の先制攻撃率処理をやっている場合には効果がありません。
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
 *     <preemptiveRate:rate>
 *        rate: Gold倍率の値。1.0で100％増加。0.3で30%増加。
 *     <preemptiveRate:rateStr%>
 *        rateStr: Gold倍率の値。100で100%増加。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 コードを調べていて思いついたので追加。動作未確認。
 */
(() => {
    const pluginName = "Kapu_Trait_PreemptiveRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_Party.ABILITY_PREEMPTIVE_RATE = Number(parameters["TraitId"]) || 0;

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * ドロップレートのノートタグを処理する。
     * @param {Object} obj データ
     */
    const _processCriticalDamageRateNoteTag = function(obj) {
        if (!obj.meta.preemptiveRate) {
            return;
        }
        const valueStr = obj.meta.preemptiveRate;
        let rate;
        if (valueStr.slice(-1) === "%") {
            rate = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            rate = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
            dataId:Game_Party.ABILITY_PREEMPTIVE_RATE, 
            value:rate
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
     * このパーティーの先制攻撃率を得る。
     * 
     * @param {Number} troopAgi 的グループのAGI
     * @return {Number} 先制攻撃率
     * !!!overwrite!!!
     */
    Game_Party.prototype.ratePreemptive = function(troopAgi) {
        let rate = this.agility() >= troopAgi ? 0.05 : 0.03;
        rate += this.partyTraitsSum(Game_Party.ABILITY_PREEMPTIVE_RATE);
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    };
})();