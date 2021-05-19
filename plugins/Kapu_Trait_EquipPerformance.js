/*:ja
 * @target MZ 
 * @plugindesc 武器/防具性能特性プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param weaponPerformanceTraitCode
 * @text 特性コード
 * @desc 特性として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 101
 * @type number
 * @max 999
 * @min 65
 * 
 * @param armorPerformanceTraitCode
 * @text 特性コード
 * @desc 特性として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 102
 * @type number
 * @max 999
 * @min 65
 * 
 * @param applyRelativeOnly
 * @text 対象ステータスを絞る
 * @desc trueにすると武器レートはATK/MATのみ、防具レートはDEF/MDFのみを変動させます。
 * @default false
 * @type boolean
 * 
 * @param textTraitWeaponPerformance
 * @text 武器性能強化特性
 * @desc 武器性能強化特性文字列。%1に武器タイプ名
 * @type string
 * @default %1性能強化
 * 
 * @param textTraitArmorPerformance
 * @text 防具性能強化特性。
 * @desc 防具性能強化特性文字列。%1に防具タイプ名
 * @type string
 * @default %1性能強化
 * 
 * @help 
 * 特定の武器タイプ/防具タイプを装備したとき、
 * その装備品の基本パラメータ性能(MaxHP/MaxMP/ATK/DEF/MAT/MDF/LUK/AGI)を
 * 増減させるプラグイン。
 * ウェポンマスタリなどに使用することを想定します。
 * 同じ武器(防具)タイプの特性を複数持っていた場合、レートは加算合計になります。
 * 
 * ■ 使用時の注意
 * 特にありません。
 * 
 * ■ プラグイン開発者向け
 * Game_BattlerBase.TRAIT_WEAPON_PERFORMANCE 及び
 * Game_BattlerBase.TRAIT_ARMOR_PERFORMANCE を追加します。
 * 値はプラグインパラメータで指定したものになります。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/防具
 *     <weaponPerf:type#,rate>
 *        type: 武器タイプ
 *        rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *        複数指定可
 *     <weaponPerf:type#,rateStr%>
 *        type: 武器タイプ
 *        rateStr: 倍率の値。100で100%増加。
 *        複数指定可
 *     <armorPerf:type#,rate>
 *        type: 防具タイプ
 *        rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *        複数指定可
 *     <armorPerf:type#,rateStr%>
 *        type: 防具タイプ
 *        rateStr: 倍率の値。100で100%増加。
 *        複数指定可
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 Kapu_Base_ParamNameに対応
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_Trait_EquipPerformance";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_WEAPON_PERFORMANCE = Number(parameters["weaponPerformanceTraitCode"]) || 0;
    Game_BattlerBase.TRAIT_ARMOR_PERFORMANCE = Number(parameters["armorPerformanceTraitCode"]) || 0;
    const applyRelativeOnly = (typeof parameters["applyRelativeOnly"] === "undefined")
            ? false : (parameters["applyRelativeOnly"] === "true");

    if (!Game_BattlerBase.TRAIT_WEAPON_PERFORMANCE) {
        console.error(pluginName + ":TRAIT_WEPON_PERFORMANCE is not valid.");
    }
    if (!Game_BattlerBase.TRAIT_ARMOR_PERFORMANCE) {
        console.error(pluginName + ":TRAIT_ARMOR_PERFORMANCE is not valid.")
    }


    //------------------------------------------------------------------------------
    // DataManager

    /**
     * 割合パラメータを計算する。
     * 
     * @param {String} valueStr 文字列
     */
    const _parseRate = function(valueStr) {
        if (valueStr.slice(-1) === "%") {
            return Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            return Number(valueStr);
        }
    };
    /**
     * ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processNoteTag = function(obj) {
        const patternWeapon = /<weaponPerf[: ]+(\d+),([+-]?\d+\.?\d+%?).*>/;
        const patternArmor = /<armorPerf[: ]+(\d+),([+-]?\d+\.?\d+%?).*>/;
        const lines = obj.note.split(/[\r\n]+/);
        for (line of lines) {
            let re = null;
            if (Game_BattlerBase.TRAIT_WEAPON_PERFORMANCE
                    && ((re = line.match(patternWeapon)) !== null)) {
                const type = Number(re[1]);
                const rate = _parseRate(re[2]);
                if (type > 0) {
                    obj.traits.push({
                        code:Game_BattlerBase.TRAIT_WEAPON_PERFORMANCE,
                        dataId:type,
                        value:rate
                    });
                }
            } else if (Game_BattlerBase.TRAIT_ARMOR_PERFORMANCE
                    && ((re = line.match(patternArmor)) !== null)) {
                const type = Number(re[1]);
                const rate = _parseRate(re[2]);
                if (type > 0) {
                    obj.traits.push({
                        code:Game_BattlerBase.TRAIT_ARMOR_PERFORMANCE,
                        dataId:type,
                        value:rate
                    });
                }
            }
        }
    };
    DataManager.addNotetagParserActors(_processNoteTag);
    DataManager.addNotetagParserClasses(_processNoteTag);
    DataManager.addNotetagParserArmors(_processNoteTag);
    DataManager.addNotetagParserStates(_processNoteTag);
    //------------------------------------------------------------------------------
    // TextManager
    if (Game_BattlerBase.TRAIT_WEAPON_PERFORMANCE) {
        const textTraitWeaponPerformance = parameters["textTraitWeaponPerformance"] || "";
        /**
         * 武器性能強化特性文字列を得る。
         * 
         * @param {number} dataId データID
         * @returns {string} 文字列
         */
        TextManager.traitWeaponPerformance = function(dataId) {
            const fmt = textTraitWeaponPerformance;
            const wtypeStr = this.weaponTypeName(dataId);
            if (fmt && wtypeStr) {
                return fmt.format(wtypeStr);
            } else {
                return "";
            }
        };
        if (TextManager._traitConverters) {
            TextManager._traitConverters[Game_BattlerBase.TRAIT_WEAPON_PERFORMANCE] = {
                name:TextManager.traitWeaponPerformance, value:TextManager.traitValueSum, str:TextManager.traitValueStrRate, baseValue:1
            };
        }
    }
    if (Game_BattlerBase.TRAIT_ARMOR_PERFORMANCE) {
        const textTraitArmorPerformance = parameters["textTraitArmorPerformance"] || "";

        /**
         * 防具特性強化文字列を得る。
         * 
         * @param {number} dataId データID
         * @returns {string} 文字列
         */
        TextManager.traitArmorPerformance = function(dataId) {
            const fmt = textTraitArmorPerformance;
            const atypeStr = this.armorTypeName(dataId);
            if (fmt && atypeStr) {
                return fmt.format(atypeStr);
            } else {
                return "";
            }
        };
        if (TextManager._traitConverters) {
            TextManager._traitConverters[Game_BattlerBase.TRAIT_WEAPON_PERFORMANCE] = {
                name:TextManager.traitArmorPerformance, value:TextManager.traitValueSum, str:TextManager.traitValueStrRate, baseValue:1
            };
        }
    }

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_paramEquipValue = Game_Actor.prototype.paramEquipValue;

    /**
     * 装備品の基本パラメータ値を得る。
     * 
     * @param {Object} equipItem 装備品
     * @param {Number} paramId パラメータID
     * @returns {Number} 装備品のパラメータ値
     */
    Game_Actor.prototype.paramEquipValue = function(equipItem, paramId) {
        const equipValue = _Game_Actor_paramEquipValue.call(this, equipItem, paramId);
        if (DataManager.isWeapon(equipItem)
                && (!applyRelativeOnly || [2,4].includes(paramId))) {
            const rate = this.paramEquipValueRateWeapon(equipItem.wtypeId);
            return Math.floor(equipValue * rate);
        } else if (DataManager.isArmor(equipItem)
                && (!applyRelativeOnly || [3,5].includes(paramId))) {
            const rate = this.paramEquipValueRateArmor(equipItem.atypeId);
            return Math.floor(equipValue * rate);
        } else {
            return equipValue;
        }
    };

    if (Game_BattlerBase.TRAIT_WEAPON_PERFORMANCE) {
        /**
         * 武器の性能可変レートを得る。
         * 
         * @param {Number} wtypeId 武器タイプ
         * @returns {Number} 変動レート
         */
        Game_Actor.prototype.paramEquipValueRateWeapon = function(wtypeId) {
            return Math.max(0, 1.0 + this.traitsSum(Game_BattlerBase.TRAIT_WEAPON_PERFORMANCE, wtypeId));
        };
    } else {
        /**
         * 武器の性能可変レートを得る。
         * 
         * @param {Number} wtypeId 武器タイプ
         * @returns {Number} 変動レート
         */
        // eslint-disable-next-line no-unused-vars
        Game_Actor.prototype.paramEquipValueRateWeapon = function(wtypeId) {
            return 1;
        };
    }

    if (Game_BattlerBase.TRAIT_ARMOR_PERFORMANCE) {
        /**
         * 防具の性能可変レートを得る。
         * 
         * @param {Number} wtype 武器タイプ
         * @returns {Number} 変動レート
         */
        Game_Actor.prototype.paramEquipValueRateArmor = function(atypeId) {
            return Math.max(0, 1.0 + this.traitsSum(Game_BattlerBase.TRAIT_ARMOR_PERFORMANCE, atypeId));
        };
    } else {
        /**
         * 防具の性能可変レートを得る。
         * 
         * @param {Number} wtype 武器タイプ
         * @returns {Number} 変動レート
         */
        // eslint-disable-next-line no-unused-vars
        Game_Actor.prototype.paramEquipValueRateArmor = function(atypeId) {
            return 1;
        };
    }





})();