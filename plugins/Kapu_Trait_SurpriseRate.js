/*:ja
 * @target MZ 
 * @plugindesc ランダムエンカウント時の不意打ち率特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param traitPartyAbilityId
 * @text パーティー特性DID
 * @desc 特性として割り当てるID番号。(6以上で他のプラグインとぶつからないやつ)
 * @default 107
 * @type number
 * @max 9999
 * @min 6
 * 
 * @param surpriseRateFast
 * @text 先制攻撃率（早）
 * @desc エネミーよりパーティーの速度が速い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.05
 * @min 0.00
 * @max 1.00
 * 
 * @param surpriseRateLate
 * @text 先制攻撃率（遅）
 * @desc エネミーよりパーティーの速度が遅い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.03
 * @min 0.00
 * @max 1.00
 *  
 * @param textTraitSurpriseRate
 * @text 不意打ち率特性名
 * @desc 不意打ち率特性名
 * @type string
 * @default 不意打ち率
 * 
 * @help 
 * Traitに不意打ち算を追加します。
 * 不意打ち率が以下のように変更されます。
 * (不意打ち率) = {(基本不意打ち率) + (不意打ち率加算値)} * (不意打ち防止特性がある場合には0倍)
 * 
 * ランダムエンカウント時のみ有効。
 * ベーシックシステムでは、イベントで戦闘を行う場合、
 * 「ランダム戦闘と同じ」となっていても先制攻撃判定されない。
 * 
 * 複数メンバー、複数特性を持つ場合には加算合計になります。
 * 
 * ベーシックシステムには不意打ち防止がありますが、
 * 完全無効となっているため、個性を持たせられません。
 * 
 * Game_Party.ABILITY_SURPRISE_RATE が定義されます。
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
 *   <surpriseRate:rate>
 *     rate: 不意打ち率の値。1.0で100％増加。0.3で30%増加。
 *   <surpriseRate:rateStr%>
 *     rateStr: 不意打ち率の値。100で100%増加。
 * マップ
 *   <surpriseRate:rate>
 *     rate: マップの不意打ち率の値。1.0で100%
 *   <surpriseRate:rateStr%>
 *     rateStr: マップの不意打ち率の値。100で100%。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 PreemptiveRateと逆のものがなかったので追加。
 */
(() => {
    const pluginName = "Kapu_Trait_SurpriseRate";
    const parameters = PluginManager.parameters(pluginName);

    const surpriseRateLate = Math.min(1, Math.max(0, (Number(parameters["surpriseRateLate"]) || 0.05)));
    const surpriseRateFast = Math.min(surpriseRateLate, Math.max(0, (Number(parameters["surpriseRateFast"]) || 0.03)));

    Game_Party.ABILITY_SURPRISE_RATE = Number(parameters["traitPartyAbilityId"]) || 0;
    if (!Game_Party.ABILITY_SURPRISE_RATE) {
        console.error(pluginName + ":ABILITY_SURPRISE_RATE is not valid.");
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
    if (Game_Party.ABILITY_SURPRISE_RATE) {
        /**
         * ノートタグを処理する。
         * 
         * @param {object} obj データ
         */
        const _processNoteTag = function(obj) {
            if (!obj.meta.surpriseRate) {
                return;
            }
            const rate = _parseRate(obj.meta.surpriseRate)
            obj.traits.push({ 
                code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
                dataId:Game_Party.ABILITY_SURPRISE_RATE, 
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
    if (TextManager._partyAbilities && Game_Party.ABILITY_SURPRISE_RATE) {
        TextManager._partyAbilities[Game_Party.ABILITY_SURPRISE_RATE] = {
            name: parameters["textTraitSurpriseRate"] || "",
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
        if ($dataMap.meta.surpriseRate) {
            this._rateSurprise = _parseRate($dataMap.meta.surpriseRate);
        } else {
            this._rateSurprise = 0.0;
        }
    };

    /**
     * マップの基本不意打ち率を得る。
     * 
     * @param {number} rate 不意打ち率
     */
    Game_Map.prototype.setRateSurprise = function(rate) {
        this._rateSurprise = rate;
    };

    /**
     * マップの基本不意打ち率を得る。
     * 
     * @returns {number} 不意打ち率
     */
    Game_Map.prototype.rateSurprise = function() {
        return this._rateSurprise;
    };
    
    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * このパーティーの不意打ち率を得る。
     * 
     * @param {number} troopAgi 不意打ち率
     * @returns {number} 不意打ち率
     * !!!overwrite!!! Game_Party.rateSurprise
     */
    Game_Party.prototype.rateSurprise = function(troopAgi) {
        let rate = 0;
        if (!this.hasCancelSurprise()) {
            rate = this.agility() >= troopAgi ? surpriseRateFast : surpriseRateLate;
            rate += $gameMap.surpriseRate();
            rate += this.partyTraitsSum(Game_Party.ABILITY_SURPRISE_RATE);
        }
        return rate;
    };



})();

