/*:ja
 * @target MZ 
 * @plugindesc ランダムエンカウント時の先制攻撃率特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param traitPartyAbilityId
 * @text パーティー特性DID
 * @desc 特性として割り当てるID番号。(6以上で他のプラグインとぶつからないやつ)
 * @default 104
 * @type number
 * @max 9999
 * @min 6
 * 
 * @param preemptiveRateFast
 * @text 先制攻撃率（早）
 * @desc エネミーよりパーティーの速度が速い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.05
 * @min 0.00
 * @max 1.00
 * 
 * @param preemptiveRateLate
 * @text 先制攻撃率（遅）
 * @desc エネミーよりパーティーの速度が遅い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.03
 * @min 0.00
 * @max 1.00
 * 
 * @param textTraitPreemptiveRate
 * @text 先制攻撃率特性名
 * @desc 先制攻撃率特性名
 * @type string
 * @default 先制攻撃率
 * 
 * @help 
 * Traitに先制攻撃率加算を追加します。
 * 先制攻撃率が以下のように変更されます。
 * (先制攻撃率) = {(基本先制攻撃率) + (先制攻撃率加算値)} * (先制攻撃率向上特性がある場合には4倍)
 * 
 * ランダムエンカウント時のみ有効。
 * ベーシックシステムでは、イベントで戦闘を行う場合、
 * 「ランダム戦闘と同じ」となっていても先制攻撃判定されない。
 * 
 * 複数メンバー、複数特性を持つ場合には加算合計になります。
 * 
 * ベーシックシステムには先制攻撃率向上がありますが、
 * 固定（4倍）となっているため、個性を持たせられません。
 * 
 * Game_Party.ABILITY_PREEMPTIVE_RATE が定義されます。
 * 値はTraitIdで指定されたものになります。
 * 特性を複数持っていた場合、加算合計になります。
 *  
 * 制限
 * その他のプラグインにより、独自の先制攻撃率処理を
 * やっている場合には効果がありません。
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
 *   <preemptiveRate:rate>
 *     rate: 先制攻撃倍率の値。1.0で100％増加。0.3で30%増加。
 *   <preemptiveRate:rateStr%>
 *     rateStr: 先制攻撃倍率の値。100で100%増加。
 * マップ
 *   <preemptiveRate:rate>
 *     rate: マップの先制攻撃倍率の値。1.0で100%
 *   <preemptiveRate:rateStr%>
 *     rateStr: マップの先制攻撃倍率の値。100で100%。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 コードを調べていて思いついたので追加。
 */
(() => {
    const pluginName = "Kapu_Trait_PreemptiveRate";
    const parameters = PluginManager.parameters(pluginName);

    const preemptiveRateFast = Math.min(1, Math.max(0, (Number(parameters["preemptiveRateFast"]) || 0.05)));
    const preemptiveRateLate = Math.min(preemptiveRateFast, Math.max(0, (Number(parameters["preemptiveRateLate"]) || 0.03)));

    Game_Party.ABILITY_PREEMPTIVE_RATE = Number(parameters["traitPartyAbilityId"]) || 0;
    if (!Game_Party.ABILITY_PREEMPTIVE_RATE) {
        console.error(pluginName + ":ABILITY_PREEMPTIVE_RATE is not valid.");
    }

    //------------------------------------------------------------------------------
    // DataManager
    const _parseRate = function(valueStr) {
        if (valueStr.slice(-1) === "%") {
            return Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            return Number(valueStr);
        }
    };

    if (Game_Party.ABILITY_PREEMPTIVE_RATE) {
        /**
         * ノートタグを処理する。
         * 
         * @param {object} obj データ
         */
        const _processNoteTag = function(obj) {
            if (!obj.meta.preemptiveRate) {
                return;
            }
            const rate = _parseRate(obj.meta.preemptiveRate);
            obj.traits.push({ 
                code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
                dataId:Game_Party.ABILITY_PREEMPTIVE_RATE, 
                value:rate
            });
        };

        DataManager.addNotetagParserActors(_processNoteTag);
        DataManager.addNotetagParserClasses(_processNoteTag);
        DataManager.addNotetagParserWeapons(_processNoteTag);
        DataManager.addNotetagParserArmors(_processNoteTag);
        DataManager.addNotetagParserStates(_processNoteTag);
    }

    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._partyAbilities && Game_Party.ABILITY_PREEMPTIVE_RATE) {
        TextManager._partyAbilities[Game_Party.ABILITY_PREEMPTIVE_RATE] = {
            name: parameters["textTraitPreemptiveRate"] || "",
            value: TextManager.traitValueSum,
            str: TextManager.traitValueStrRate
        };
    }
    //------------------------------------------------------------------------------
    // Game_Map
    const _Game_Map_setup = Game_Map.prototype.setup;
    /**
     * マップをセットアップする。
     * 
     * @param {number} mapId マップID
     */
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        if ($dataMap.meta.preemptiveRate) {
            this._ratePreemptive = _parseRate($dataMap.meta.preemptiveRate);
        } else {
            this._ratePreemptive = 0.0;
        }
    };

    /**
     * マップの基本先制率を得る。
     * 
     * @param {number} rate 先制率
     */
    Game_Map.prototype.setRatePreemptive = function(rate) {
        this._ratePreemptive = rate;
    };

    /**
     * マップの基本先制率を得る。
     * 
     * @returns {number} 先制率
     */
    Game_Map.prototype.ratePreemptive = function() {
        return this._ratePreemptive;
    };

    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * このパーティーの先制攻撃率を得る。
     * 
     * @param {number} troopAgi 的グループのAGI
     * @returns {number} 先制攻撃率
     * !!!overwrite!!!
     */
    Game_Party.prototype.ratePreemptive = function(troopAgi) {
        let rate = this.agility() >= troopAgi ? preemptiveRateFast : preemptiveRateLate;
        rate += $gameMap.ratePreemptive();
        if (Game_Party.ABILITY_PREEMPTIVE_RATE) {
            rate += this.partyTraitsSum(Game_Party.ABILITY_PREEMPTIVE_RATE);
        }
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    };
})();
