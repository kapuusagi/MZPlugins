/*:ja
 * @target MZ 
 * @plugindesc 時間帯/天候による不意打ち率抑制特性プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_TimeRangeAndWeather
 * @orderAfter Kapu_TimeRangeAndWeather
 * 
 * @param abilityReliefTimeRangeSurprise
 * @text 時間帯による不意打ち率軽減特性アビリティID
 * @type number
 * @defalt 111
 * 
 * @param textTraitReliefTimeRangeSurprise
 * @text 特性名
 * @desc TextManagerで管理する特性名
 * @type string
 * @default 時間帯による不意打ち軽減
 * 
 * @param abilityReliefWeatherSurprise
 * @text 天候による不意打ち率軽減特性アビリティID
 * @type number
 * @default 112
 * 
 * @param textTraitReliefWeatherSurprise
 * @text 特性名
 * @desc TextManagerで管理する特性名
 * @type string
 * @default 天候による不意打ち軽減
 * 
 * @help 
 * 時間帯・天候による不意打ち率が増加するのを防ぐ特性を追加するプラグイン。
 * 不意打ち率軽減効果は、パーティー内の全ての特性値の合計だけ軽減します。
 * ただし、天候による不意打ち率補正は1.0以下になりません。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/武器/防具/ステート
 *   <reliefTimeRangeSurpriseRate:rate#>
 *   <reliefTimeRangeSurpriseRate:rate>
 *     時間帯による不意打ち率抑制効果をrateに設定する。
 * 
 *   <reliefWeatherSurpriseRate:rate#>
 *   <reliefWeatherSurpriseRate:rate>
 *     天候による不意打ち率抑制効果をrateに設定する。
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_TimeRangeAndWeather_Traits";
    const parameters = PluginManager.parameters(pluginName);

    Game_Party.ABILITY_RELIEF_TIMERANGE_SURPRISE = Number(parameters["abilityReliefTimeRangeSurprise"]) || 0;
    if (!Game_Party.ABILITY_RELIEF_TIMERANGE_SURPRISE) {
        console.error(pluginName + ":ABILITY_RELIEF_TIMERANGE_SURPRISE is not valid.");
    }
    Game_Party.ABILITY_RELIEF_WEATHER_SURPRISE = Number(parameters["abilityReliefWeatherSurprise"]) || 0;
    if (!Game_Party.ABILITY_RELIEF_WEATHER_SURPRISE) {
        console.error(pluginName + ":ABILITY_RELIEF_WEATHER_SURPRISE is not valid.");
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

    if (Game_Party.ABILITY_RELIEF_TIMERANGE_SURPRISE || Game_Party.ABILITY_RELIEF_WEATHER_SURPRISE) {
        /**
         * ノートタグを処理する。
         * 
         * @param {object} obj データ
         */
        const _processNoteTag = function(obj) {
            if (Game_Party.ABILITY_RELIEF_TIMERANGE_SURPRISE
                    && obj.meta.reliefTimeRangeSurpriseRate) {
                const rate = _parseRate(obj.meta.reliefTimeRangeSurpriseRate);
                obj.traits.push({
                    code:Game_BattlerBase.TRAIT_PARTY_ABILITY,
                    dataId:Game_Party.ABILITY_RELIEF_TIMERANGE_SURPRISE,
                    value:rate
                });
            }
            if (Game_Party.ABILITY_RELIEF_WEATHER_SURPRISE
                    && obj.meta.reliefWeatherSurpriseRate) {
                const rate = _parseRate(obj.meta.reliefWeatherSurpriseRate);
                obj.traits.push({
                    code:Game_BattlerBase.TRAIT_PARTY_ABILITY,
                    dataId:Game_Party.ABILITY_RELIEF_WEATHER_SURPRISE,
                    value:rate
                });
            }
        };

        DataManager.addNotetagParserActors(_processNoteTag);
        DataManager.addNotetagParserClasses(_processNoteTag);
        DataManager.addNotetagParserWeapons(_processNoteTag);
        DataManager.addNotetagParserArmors(_processNoteTag);
        DataManager.addNotetagParserStates(_processNoteTag);
    }
    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._partyAbilities && Game_Party.ABILITY_RELIEF_TIMERANGE_SURPRISE) {
        TextManager._partyAbilities[Game_Party.ABILITY_RELIEF_TIMERANGE_SURPRISE] = {
            name: parameters["textTraitReliefTimeRangeSurprise"] || "",
            value: TextManager.traitValueSum,
            str: TextManager.traitValueStrRate
        };
    }
    if (TextManager._partyAbilities && Game_Party.ABILITY_RELIEF_WEATHER_SURPRISE) {
        TextManager._partyAbilities[Game_Party.ABILITY_RELIEF_WEATHER_SURPRISE] = {
            name: parameters["textTraitReliefWeatherSurprise"] || "",
            value: TextManager.traitValueSum,
            str: TextManager.traitValueStrRate
        };
    }
    //------------------------------------------------------------------------------
    // Game_Party
    if (Game_Party.ABILITY_RELIEF_TIMERANGE_SURPRISE) {
        /**
         * パーティー特製による不意打ち率軽減補正値を得る。
         * 
         * @returns {number} 不意打ち率補正値
         */
        Game_Party.prototype.reliefTimeRangeSurpriseRate = function() {
            return this.partyTraitsSum(Game_Party.ABILITY_RELIEF_TIMERANGE_SURPRISE);
        };
    } else {
        /**
         * パーティー特製による不意打ち率軽減補正値を得る。
         * 
         * @returns {number} 不意打ち率補正値
         */
        Game_Party.prototype.reliefTimeRangeSurpriseRate = function() {
            return 0;
        };
    }
    if (Game_Party.ABILITY_RELIEF_WEATHER_SURPRISE) {
        /**
         * パーティー特性による不意打ち率軽減補正値を得る。
         * 
         * @returns {number} 不意打ち率補正値
         */
        Game_Party.prototype.reliefWeatherSurpriseRate = function() {
            return this.partyTraitsSum(Game_Party.ABILITY_RELIEF_WEATHER_SURPRISE);
        };

    } else {
        /**
         * パーティー特性による不意打ち率軽減補正値を得る。
         * 
         * @returns {number} 不意打ち率補正値
         */
        Game_Party.prototype.reliefWeatherSurpriseRate = function() {
            return 0;
        };
    }
    //------------------------------------------------------------------------------
    // Game_Map

    const _Game_Map_rateSurpriseTimeRange = Game_Map.prototype.rateSurpriseTimeRange;
    /**
     * 時間帯による不意打ち率補正値を得る。
     * 
     * @returns {number} 不意打ち率
     */
    Game_Map.prototype.rateSurpriseTimeRange = function() {
        const rate = _Game_Map_rateSurpriseTimeRange.call(this);
        const reliefRate = $gameParty.reliefTimeRangeSurpriseRate();
        return Math.max(1, rate - reliefRate);
    };

    const _Game_Map_rateSurpriseWeather = Game_Map.prototype.rateSurpriseWeather;
    /**
     * 天候による不意打ち率補正値を得る。
     * 
     * @returns {number} 不意打ち率
     */
    Game_Map.prototype.rateSurpriseWeather = function() {
        const rate = _Game_Map_rateSurpriseWeather.call(this);
        const reliefRate = $gameParty.reliefWeatherSurpriseRate();
        return Math.max(1, rate - reliefRate);
    };

})();