/*:ja
 * @target MZ 
 * @plugindesc ランダムエンカウント率特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param traitPartyAbilityId
 * @text パーティー特性DID
 * @desc 特性として割り当てるID番号。(6以上で他のプラグインとぶつからないやつ)
 * @default 108
 * @type number
 * @max 9999
 * @min 6
 * 
 * @param minimumRandomEncountRate
 * @text 最小ランダムエンカウント率
 * @desc ランダムエンカウント率の最小値
 * @type number
 * @default 0.01
 * @decimals 2
 * @min 0.00
 * @max 1.00
 * 
 * @param textTraitRandomEncountRate
 * @text ランダムエンカウント率特性名
 * @desc ランダムエンカウント率特性名
 * @type string
 * @default エンカウント率
 * 
 * 
 * @help 
 * Traitにランダムエンカウント率特性を追加します。
 * ベーシックシステムではマップごとにエンカウント歩数が設定されており、
 * 特定のタイミングでエンカウント歩数が更新されます。
 * 
 * 本特性はこのエンカウント歩数に作用し、エンカウント率補正特性を実現します。
 * ランダムエンカウント時のみ有効。
 * パーティー中に本特性を複数所持していた場合、加算合計になります。
 * 
 * Game_Party.ABILITY_RANDOMENCOUNT_RATE が定義されます。
 * 値はTraitIdで指定されたものになります。
 * 特性を複数持っていた場合、加算合計になります。
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
 *   <rencountRate:rate>
 *     rate: エンカウント倍率の値。0で標準。0.5でエンカウント率+50%, -0.5でエンカウント率半減
 *   <rencountRate:rateStr%>
 *     rateStr: エンカウント率の値。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 コードを調べていて思いついたので追加。
 */
(() => {
    const pluginName = "Kapu_Trait_RandomEncountRate";
    const parameters = PluginManager.parameters(pluginName);
    const minimumRandomEncountRate = (Number(parameters["minimumRandomEncountRate"]) || 0).clamp(0, 1.0);

    Game_Party.ABILITY_RANDOMENCOUNT_RATE = Number(parameters["traitPartyAbilityId"]) || 0;
    if (!Game_Party.ABILITY_RANDOMENCOUNT_RATE) {
        console.error(pluginName + ":ABILITY_RANDOMENCOUNT_RATE is not valid.");
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

    if (Game_Party.ABILITY_RANDOMENCOUNT_RATE) {
        /**
         * ノートタグを処理する。
         * 
         * @param {Object} obj データ
         */
        const _processNoteTag = function(obj) {
            if (!obj.meta.rencountRate) {
                return;
            }
            const rate = _parseRate(obj.meta.rencountRate);
            obj.traits.push({ 
                code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
                dataId:Game_Party.ABILITY_RANDOMENCOUNT_RATE, 
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
    if (TextManager._partyAbilities && Game_Party.ABILITY_RANDOMENCOUNT_RATE) {
        TextManager._partyAbilities[Game_Party.ABILITY_RANDOMENCOUNT_RATE] = {
            name: parameters["textTraitRandomEncountRate"] || "",
            value: TextManager.traitValueSum,
            str: TextManager.traitValueStrRate
        };
    }

    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * エンカウント率を得る。
     * 
     * @returns {Number} エンカウント率
     */
    Game_Party.prototype.randomEncountRate = function() {
        return Math.max(minimumRandomEncountRate, 1.0 + this.partyTraitsSum(Game_Party.ABILITY_RANDOMENCOUNT_RATE));
    };

    //------------------------------------------------------------------------------
    // Game_Player
    const _Game_Player_makeEncounterCount = Game_Player.prototype.makeEncounterCount;
    /**
     * エンカウントするまでのカウンタを作成する。
     * 
     * Note: エンカウント数がどんどん減っていき、0になるとエンカウントする仕組み。
     */
    Game_Player.prototype.makeEncounterCount = function() {
        _Game_Player_makeEncounterCount.call(this);
        const encountRate = $gameParty.randomEncountRate();
        if (encountRate > 0) {
            this._encounterCount = Math.floor(this._encounterCount / encountRate);
        } else {
            this._encounterCount = Number.MAX_SAFE_INTEGER;
        }
    };
})();
