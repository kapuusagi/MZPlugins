/*:ja
 * @target MZ 
 * @plugindesc エネミーからのゴールドドロップレート特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * 
 * @param TraitId
 * @text 特性ID
 * @desc 特性として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 7
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
 * Version.0.1.0 TWLDで実装したのを移植。未確認。
 */
(() => {
    const pluginName = "Kapu_Trait_DropGoldRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_Party.ABILITY_DROP_GOLD_RATE = parameters['TraitId'];

    //------------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    /**
     * Scene_Bootを開始する。
     */
    Scene_Boot.prototype.start = function () {
        DataManager.processDropGoldRateTrait();
        _Scene_Boot_start.call(this);
    };

    //------------------------------------------------------------------------------
    // DataManager
    DataManager.processDropGoldRateTrait = function() {
        DataManager.processDropGoldRateTraitNotetag($dataActors);
        DataManager.processDropGoldRateTraitNotetag($dataClasses);
        DataManager.processDropGoldRateTraitNotetag($dataWeapons);
        DataManager.processDropGoldRateTraitNotetag($dataArmors);
        DataManager.processDropGoldRateTraitNotetag($dataStates);
    };

    /**
     * ドロップレートのノートタグを処理する。
     * @param {Array<Object>} dataArray データコレクション
     */
    DataManager.processDropGoldRateTraitNotetag = function(dataArray) {
        for (let obj of dataArray) {
            if (!obj || !obj.meta.dropGoldRate) {
                continue;
            }
            DataManager.addDropGoldRateTrait(obj, obj.meta.dropGoldRate);
        }
    };
    /**
     * itemの特性にvalueStrのドロップレート加算する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/Stateのいずれか。traitsを持ってるデータ
     * @param {String} valueStr 効果値
     */
    DataManager.addDropGoldRateTrait = function(obj, valueStr) {
        let dropRate;
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
     * @return {Number} ゴールドレート。
     * 
     * !!!overwrite!!!
     */
    Game_Troop.prototype.goldRate = function() {
        return $gameParty.getGoldRate();
    };
})();