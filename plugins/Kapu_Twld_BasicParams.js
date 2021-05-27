/*:ja
 * @target MZ 
 * @plugindesc TWLD向け基本パラメータプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_Base_ParamName
 * 
 * @command gainBasicParam
 * @text 基本パラメータ増減
 * @desc 基本パラメータを所定の値増減させる。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 変更するアクターのID
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc アクターを変数の値で指定する場合に指定する変数ID
 * @type number
 * 
 * @arg paramId
 * @text パラメータ
 * @desc 対象パラメータ
 * @type select
 * @option STR
 * @value 0
 * @option DEX
 * @value 1
 * @option VIT
 * @value 2
 * @option INT
 * @value 3
 * @option MEN
 * @value 4
 * @option AGI
 * @value 5
 * @option LUK
 * @value 6
 * 
 * @arg value
 * @text 値
 * @desc 設定する値
 * @type number
 * @min -10000
 * @max 10000
 * 
 * @arg valueVariableId
 * @text 値(変数指定)
 * @desc 設定する値
 * @type number
 * 
 * @param overwriteAGI
 * @text AGIを上書きする
 * @desc ベーシックシステムのAGIを上書きするかどうかを設定します。
 * @type boolean
 * @default true
 * 
 * @param overwriteLUK
 * @text LUKを上書きする
 * @desc ベーシックシステムのLUKを上書きするかどうかを設定します。
 * @type boolean
 * @default true
 * 
 * @param basicParamMax
 * @text 最大値
 * @desc 基本パラメータ最大値
 * @type number
 * @default 999
 * @min 1
 * @max 9999
 * 
 * @param basciParamTraitCode
 * @text 特性コード
 * @desc 特性加算値として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 1001
 * @type number
 * @min 65
 * @max 9999
 * 
 * @param basciParamRateTraitCode
 * @text 特性コード
 * @desc 特性乗算値として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 1002
 * @type number
 * @min 65
 * @max 9999
 * 
 * @param minBasicParamPlus
 * @text 基本パラメータ増減補正値最小値
 * @desc 基本パラメータの増減補正の最小値
 * @type number
 * @default -100
 * @min -1000
 * 
 * @param maxBasicParamAdd
 * @text 基本パラメータ増減補正値最大値
 * @desc 基本パラメータの増減補正の最大値
 * @type number
 * @default 100
 * @max 1000
 * 
 * @param basicParamAddEffectCode
 * @text 基本パラメータ加算効果コード
 * @desc 基本パラメータを恒久的に増減させる効果コード
 * @type number
 * @default 1001
 * @min 1000
 * 
 * @param paramLabel0
 * @text STR表示名
 * @desc ステータス画面などに使用するSTR表示名
 * @type string
 * @default STR
 * 
 * @param paramLabel1
 * @text DEX表示名
 * @desc ステータス画面などに使用するDEX表示名
 * @type string
 * @default DEX
 * 
 * @param paramLabel2
 * @text VIT表示名
 * @desc ステータス画面などに使用するVIT表示名
 * @type string
 * @default VIT
 * 
 * @param paramLabel3
 * @text INT表示名
 * @desc ステータス画面などに使用するINT表示名
 * @type string
 * @default INT
 * 
 * @param paramLabel4
 * @text MEN表示名
 * @desc ステータス画面などに使用するMEN表示名
 * @type string
 * @default MEN
 * 
 * @param paramLabel5
 * @text AGI表示名
 * @desc ステータス画面などに使用するAGI表示名
 * @type string
 * @default AGI
 * 
 * @param paramLabel6
 * @text LUK表示名
 * @desc ステータス画面などに使用するLUK表示名
 * @type string
 * @default LUK
 * 
 * 
 * @param textTraitBasicParamUp
 * @text 基本パラメータ加算特性(増加)
 * @desc 基本パラメータ加算特性(増加)。%1に基本パラメータ名
 * @type string
 * @default %1増加
 * 
 * @param textTraitBasicParamDown
 * @text 基本パラメータ加算特性(減少)
 * @desc 基本パラメータ加算特性(減少)。%1に基本パラメータ名
 * @type string
 * @default %1減少
 * 
 * @param textTraitBasicParamRateUp
 * @text 基本パラメータ割合特性(増加)
 * @desc 基本パラメータ割合特性(増加)。%1に基本パラメータ名
 * @type string
 * @default %1増加
 * 
 * @param textTraitBasicParamRateDown
 * @text 基本パラメータ割合特性(減少)
 * @desc 基本パラメータ割合特性(減少)。%1に基本パラメータ名
 * @type string
 * @default %1減少
 * 
 * 
 * @help 
 * TWLD向けに作成した、基本パラメータ(STR/DEX/VIT/INT/MEN/AGI/LUK)を
 * 追加するプラグイン。
 * デフォルトでは既存のAGI/LUKが上書きされます。
 * LUK/AGIの上書きを行わない場合、プラグインパラメータの
 * 「AGIを上書きする」「LUKを上書きする」をfalseに設定します。
 * 
 * ■ 使用時の注意
 * ベーシックシステムにある、AGI/LUKが上書きされます。
 * それらに作用する系統のプラグインとは競合します。
 * 
 * ■ プラグイン開発者向け
 * 基本パラメータ加算特性
 *     Game_BattlerBase.TRAIT_BASIC_PARAM を追加。
 * 基本パラメータ乗算特性
 *     Game_BattlerBase.TRAIT_BASIC_PARAM_RATE を追加。
 * 基本パラメータ恒久加減効果
 *     Game_Action.EFFECT_GAIN_BASIC_PARAM を追加。
 * 
 * TextManager.basicParam(paramId:number)
 *     パラメータラベル名を得る。
 * ============================================
 * プラグインコマンド
 * ============================================
 * gainBasicParam
 *     指定アクターの基本パラメータを増減させる。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/エネミー
 *     <basicParams:str#,dex#,vit#,int#,men#,agi#,luk#>
 * 
 *         アクター/エネミーについては1以上の値。
 *         未指定時はデフォルト値として全て20にセットされる。
 *         クラス/ウェポン/アーマーについては正負の値。
 * 
 * エネミー
 *     <basicParamsVariance:str#,dex#,vit#,int#,men#,agi#,luk#>
 * 
 *         エネミーのパラメータばらつき具合。±valueの範囲で上下する。
 * 
 * 
 * クラス/ウェポン/アーマー/ステート
 *     <str:value#>
 *     <dex:value#>
 *     <vit:value#>
 *     <int:value#>
 *     <men:value#>
 *     <agi:value#>
 *     <luk:value#>
 *         各パラメータを value# だけ加算(減算)する。
 *     <strrate:rate#>
 *     <dexrate:rate#>
 *     <vitrate:rate#>
 *     <intrate:rate#>
 *     <menrate:rate#>
 *     <agirate:rate#>
 *     <lukrate:rate#>
 *         各パラメータを rate# 割合だけ増減させる。
 *     <strrate:rate%>
 *     <dexrate:rate%>
 *     <vitrate:rate%>
 *     <intrate:rate%>
 *     <menrate:rate%>
 *     <agirate:rate%>
 *     <lukrate:rate%>
 *         各パラメータを rate の割合だけ増減させる。
 * スキル/アイテム
 *     <stradd:value#>
 *     <dexadd:value#>
 *     <vitadd:value#>
 *     <intadd:value#>
 *     <menadd:value#>
 *     <agiadd:value#>
 *     <lukadd:value#>
 *         各パラメータを value# だけ恒久的に増減させる。
 *  
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 Kapu_Base_ParamNameに対応
 * Version.0.1.0 新規作成
 */
(() => {
    const pluginName = "Kapu_Twld_BasicParams";
    const parameters = PluginManager.parameters(pluginName);
    Game_BattlerBase.TRAIT_BASIC_PARAM = Number(parameters["basciParamTraitCode"]) || 0;
    Game_BattlerBase.TRAIT_BASIC_PARAM_RATE = Number(parameters["basciParamRateTraitCode"]) || 0;
    Game_BattlerBase.BASIC_PARAM_MAX = Number(parameters["basicParamMax"]) || 999;
    Game_Action.EFFECT_GAIN_BASIC_PARAM = Number(parameters["basicParamAddEffectCode"]) || 0;
    const minBasicParamPlus = Number(parameters["minBasicParamPlus"]) || 100;
    const maxBasicParamAdd = Number(parameters["maxBasicParamAdd"]) || 100;

    const overwriteAGI = (typeof parameters["overwriteAGI"] === "undefined")
            ? false : (parameters["overwriteAGI"] === "true");
    const overwriteLUK = (typeof parameters["overwriteLUK"] === "undefined")
            ? false : (parameters["overwriteLUK"] === "true");

    const textTraitBasicParamUp = parameters["textTraitBasicParamUp"] || "";
    const textTraitBasicParamDown = parameters["textTraitBasicParamDown"] || "";
    const textTraitBasicParamRateUp = parameters["textTraitBasicParamRateUp"] || "";
    const textTraitBasicParamRateDown = parameters["textTraitBasicParamRateDown"] || "";

    const paramLabels = [
        String(parameters["paramLabel0"]) || "STR",
        String(parameters["paramLabel1"]) || "DEX",
        String(parameters["paramLabel2"]) || "VIT",
        String(parameters["paramLabel3"]) || "INT",
        String(parameters["paramLabel4"]) || "MEN",
        String(parameters["paramLabel5"]) || "AGI",
        String(parameters["paramLabel6"]) || "LUK",
    ];

    if (!Game_BattlerBase.TRAIT_BASIC_PARAM) {
        console.error(pluginName + ":TRAIT_BASIC_PARAM is not valid.");
    }
    if (!Game_BattlerBase.TRAIT_BASIC_PARAM_RATE) {
        console.error(pluginName + ":TRAIT_BASIC_PARAM_RATE is not valid.");
    }
    if (!Game_Action.EFFECT_GAIN_BASIC_PARAM) {
        console.error(pluginName + ":EFFECT_GAIN_BASIC_PARAM is not valid.");
    }

    /**
     * アクターIDを得る。
     * 
     * @param {object} args 引数
     */
    const _getActorId = function(args) {
        const actorId = Number(args.actorId) || 0;
        const variableId = Number(args.variableId) || 0;
        if (actorId > 0) {
            return actorId;
        } else if (variableId > 0) {
            return $gameVariables.value(variableId);
        } else {
            return 0;
        }
    };

    /**
     * 値を得る。
     * 
     * @param {object} args 引数
     * @returns {number} 値
     */
    const _getValue = function(args) {
        const variableId = Number(valueVariable) || 0;
        const value = Number(args.value) || 0;
        if (variableId > 0) {
            return Math.floor($gameVariables.value(variableId));
        } else {
            return Math.floor(value);
        }
    };

    PluginManager.registerCommand(pluginName, "gainBasicParam", args => {
        const actorId = _getActorId(args);
        const paramId = Number(args.paramId) || 0;
        const value = _getValue(arg);
        if ((actorId > 0) && (paramId >= 0) && (paramId < 7) && (value >= 0)) {
            const actor = $gameActors.actor(actorId);
            const newValue = actor.basicParam(paramId) + value;            
            actor.addBasicParam(paramId, newValue);
        }
    });
    //------------------------------------------------------------------------------
    // DataManager

    /**
     * 値を解析して基本パラメータの特性を追加する。
     * 
     * @param {TraitObject} obj traitsをメンバに持つオブジェクト
     * @param {number} dataId データID
     * @param {string} valueStr 値文字列
     */
    const _addBasicParamTrait = function(obj, dataId, valueStr) {
        const value = Math.round((Number(valueStr) || 0));
        if (value !== 0) {
            obj.traits.push({
                code: Game_BattlerBase.TRAIT_BASIC_PARAM,
                dataId: dataId,
                value: value
            });
        }
    }

    /**
     * 基本パラメータ倍率補正特性を追加する。
     * 
     * @param {TraitObject} obj traitsをメンバに持つオブジェクト
     * @param {number} dataId データID
     * @param {string} valueStr 値文字列
     */
    const _addBasicParamRateTrait = function(obj, dataId, valueStr) {
        let rate;
        if (valueStr.slice(-1) === "%") {
            rate = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            rate = Number(valueStr);
        }
        if (rate !== 0) {
            obj.traits.push({
                code: Game_BattlerBase.TRAIT_BASIC_PARAM_RATE,
                dataId: dataId,
                value: rate
            });
        }
    };

    /**
     * 非バトラーのノートタグを処理する。
     * 
     * @apram {DataEnemy} obj オブジェクト。
     */
    const _processNonBattlerNotetag = function(obj) {
        if (Game_BattlerBase.TRAIT_BASIC_PARAM) {
            const addTagNames = [
                "str", "dex", "vit", "int", "men", "agi", "luk"
            ];
            for (let i = 0; i < addTagNames.length; i++) {
                const tag = addTagNames[i];
                if (tag in obj.meta) {
                    _addBasicParamTrait(obj, i, obj.meta[tag]);
                }
            }
        }
        if (Game_BattlerBase.TRAIT_BASIC_PARAM_RATE) {
            const rateTagNames = [
                "strrate", "dexrate", "vitrate", "intrate", "menrate", "agirate", "lukrate"
            ];
            for (let i = 0; i < rateTagNames.length; i++) {
                const tag = rateTagNames[i];
                if (tag in obj.meta) {
                    _addBasicParamRateTrait(obj, i, obj.meta[tag]);
                }
            }

        }
    };

    DataManager.addNotetagParserClasses(_processNonBattlerNotetag);
    DataManager.addNotetagParserWeapons(_processNonBattlerNotetag);
    DataManager.addNotetagParserArmors(_processNonBattlerNotetag);

    if (Game_Action.EFFECT_GAIN_BASIC_PARAM) {
        /**
         * アイテムとスキルのノートタグを処理する。
         * 
         * @param {object} obj データオブジェクト。(DataItem/DataSkill)
         */
        const _processEffectNotetag = function(obj) {
            const addTagNames = [
                "stradd", "dexadd", "vitadd", "intadd", "menadd", "agiadd", "lukadd"
            ];
            for (let i = 0; i < addTagNames.length; i++) {
                const tag = addTagNames[i];
                if (tag in obj.meta) {
                    const value = Math.floor((Number(obj.meta[tag]) || 0));
                    if (value !== 0) {
                        obj.effects.push({
                            code: Game_Action.EFFECT_GAIN_BASIC_PARAM,
                            dataId: i,
                            value1: value,
                            value2: 0
                        });
                    }
                }
            }
        };
        DataManager.addNotetagParserSkills(_processEffectNotetag);
        DataManager.addNotetagParserItems(_processEffectNotetag);
    }
    //------------------------------------------------------------------------------
    // TextManager

    /**
     * 基本パラメータに対応する名前を得る。
     * 
     * @param {number} paramId パラメータID
     */
    TextManager.basicParam = function(paramId) {
        return paramLabels[paramId] || "";
    };

    /**
     * 基本パラメータ加算特性名。
     * 
     * @param {number} dataId データID 
     * @param {number} value 値
     * @returns {string} 文字列
     */
    TextManager.traitBasicParam = function(dataId, value) {
        const fmt = (value >= 0) ? textTraitBasicParamUp : textTraitBasicParamDown;
        const paramName = this.basicParam(dataId);
        return ((fmt && paramName) ? fmt.format(paramName) : "");
    };
    /**
     * 基本パラメータ割合特性名。
     * 
     * @param {number} dataId データID
     * @param {number} value 値
     * @returns {string} 文字列
     */
    TextManager.traitBasicParamRate = function(dataId, value) {
        const fmt = (value >= 0) ? textTraitBasicParamRateUp : textTraitBasicParamRateDown;
        const paramName = this.basicParam(dataId);
        return ((fmt && paramName) ? fmt.format(paramName) : "");
    };

    if (TextManager._traitConverters && Game_BattlerBase.TRAIT_BASIC_PARAM) {
        TextManager._traitConverters[Game_BattlerBase.TRAIT_BASIC_PARAM] = {
            name:TextManager.traitBasicParam, value:TextManager.traitValueSum, str:TextManager.traitValueStrInt, baseValue:0
        };
    }
    if (TextManager._traitConverters && Game_BattlerBase.TRAIT_BASIC_PARAM_RATE) {
        TextManager._traitConverters[Game_BattlerBase.TRAIT_BASIC_PARAM_RATE] = {
            name:TextManager.traitBasicParamRate, value:TextManager.traitValueSum, str:TextManager.traitValueStrRateAbs, baseValue:0
        };
    }

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    Object.defineProperties(Game_BattlerBase.prototype, {
        str : { get: function() { return this.basicParam(0); }, configurable:true },
        dex : { get: function() { return this.basicParam(1); }, configurable:true },
        vit : { get: function() { return this.basicParam(2); }, configurable:true },
        int : { get: function() { return this.basicParam(3); }, configurable:true },
        men : { get: function() { return this.basicParam(4); }, configurable:true }
    });

    if (overwriteAGI) {
        Object.defineProperty(Game_BattlerBase.prototype, "agi", {
                get: function() { return this.basicParam(5); }, configurable:true });
    }
    if (overwriteLUK) {
        Object.defineProperty(Game_BattlerBase.prototype, "luk", {
                get: function() { return this.basicParam(6); }, configurable:true });
    }

    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    /**
     * Game_BattlerBaseのパラメータを初期化する。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._basicParams = [20, 20, 20, 20, 20, 20, 20]
        this._basicParamsAdd = [0, 0, 0, 0, 0, 0, 0];
    };

    if (overwriteAGI || overwriteLUK) {
        const _Game_BattlerBase_param = Game_BattlerBase.prototype.param;
        /**
         * パラメータを得る。
         * 
         * Note: AGI, LUKについて置き換えるためフックする。
         * @param {number} paramId パラメータID
         * @returns {number} パラメータ値
         */
        Game_BattlerBase.prototype.param = function(paramId) {
            if (overwriteAGI && (paramId === 6)) {
                return this.basicParam(5);
            } else if (overwriteLUK && (paramId === 7)) {
                return this.basicParam(6);
            } else {
                return _Game_BattlerBase_param.call(this, paramId);
            }
        };

        const _Game_BattlerBase_paramBasePlus = Game_BattlerBase.prototype.paramBasePlus
        /**
         * パラメータを得る。
         * 
         * Note: 一部のメソッドで直接呼び出されるため、フックして置き換える必要がある。
         * @param {number} paramId パラメータID
         * @returns {number} パラメータ値
         */
        Game_BattlerBase.prototype.paramBasePlus = function(paramId) {
            if (overwriteAGI && (paramId === 6)) {
                return this.basicParamBase(5);
            } else if (overwriteLUK && (paramId === 7)) {
                return this.basicParamBase(6);
            } else {
                return _Game_BattlerBase_paramBasePlus.call(this, paramId);
            }
        };
    }

    /**
     * 基本パラメータを得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} パラメータの値
     */
    Game_BattlerBase.prototype.basicParam = function(paramId) {
        const baseValue = this.basicParamBase(paramId);
        const baseValueRate = this.basicParamRate(paramId);
        const baseValuePlus = this.basicParamPlus(paramId);
        const value = Math.floor(baseValue * baseValueRate) + baseValuePlus;
        return value.clamp(this.basicParamMin(paramId), this.basicParamMax(paramId));
    };

    /**
     * 基本パラメータのベース値を得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} パラメータの値
     */
    Game_BattlerBase.prototype.basicParamBase = function(paramId) {
        return this._basicParams[paramId] + this._basicParamsAdd[paramId];
    };

    // 実行効率を上げるため、if-elseで実装を分岐する。
    if (Game_BattlerBase.TRAIT_BASIC_PARAM) {
        /**
         * 基本パラメータの装備などによる加算値の合計を得る。
         * 
         * @param {number} paramId パラメータID
         * @returns {number} パラメータの値
         */
        Game_BattlerBase.prototype.basicParamPlus = function(paramId) {
            return this.traitsSum(Game_BattlerBase.TRAIT_BASIC_PARAM, paramId);
        }
    } else {
        /**
         * 基本パラメータの装備などによる加算値の合計を得る。
         * 
         * @param {number} paramId パラメータID
         * @returns {number} パラメータの値
         */
        // eslint-disable-next-line no-unused-vars
        Game_BattlerBase.prototype.basicParamPlus = function(paramId) {
            return 0;
        }
    }
    // 実行効率を上げるため、if-elseで実装を分岐する。
    if (Game_BattlerBase.TRAIT_BASIC_PARAM_RATE) {
        /**
         * 基本パラメータ乗算レートを得る。
         * 
         * @param {number} paramId パラメータID
         * @returns {number} 基本パラメータレート
         */
        Game_BattlerBase.prototype.basicParamRate = function(paramId) {
            return Math.max(0, 1.0 + this.traitsSum(Game_BattlerBase.TRAIT_BASIC_PARAM_RATE, paramId));
        };
    } else {
        /**
         * 基本パラメータ乗算レートを得る。
         * 
         * @param {number} paramId パラメータID
         * @returns {number} 基本パラメータレート
         */
        // eslint-disable-next-line no-unused-vars
        Game_BattlerBase.prototype.basicParamRate = function(paramId) {
            return 1.0;
        };
    }

    /**
     * 基本パラメータの最小値を得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} パラメータ最大値
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.basicParamMin = function(paramId) {
        return 1;
    };
    /**
     * 基本パラメータの最大値を得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} パラメータ最大値
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.basicParamMax = function(paramId) {
        return Game_BattlerBase.BASIC_PARAM_MAX;
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);

        const actor = $dataActors[actorId];
        if (actor.meta.basicParams) {
            const tokens = actor.meta.basicParams.split(",");
            const count = Math.min(actor.basicParams.length, tokens.length);
            for (let i = 0; i < count; i++) {
                const value = Number(tokens[i]);
                if (value > 0) {
                    this._basicParams[i] = value;
                }
            }
        }
    };

    /**
     * 基本パラメータを増減する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} value 値
     */
    Game_Actor.prototype.addBasicParam = function(paramId, value) {
        if ((paramId >= 0) && (paramId < this._basicParamsPlus.length)) {
            const paramPlus = this._basicParamsPlus[paramId] + value;
            this._basicParamsPlus[paramId] = paramPlus.clamp(minBasicParamPlus, maxBasicParamAdd);
            this.refresh();
        }

    };

    /**
     * 基本パラメータ生値を取得する。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} パラメータ値
     */
    Game_Actor.prototype.basicParamRaw = function(paramId) {
        return this._basicParams[paramId];
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    /**
     * エネミーをセットアップする。
     * 
     * @param {number} enemyId エネミーID
     * @param {number} x X位置
     * @param {number} y Y位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);

        const enemy = $dataEnemies[enemyId];
        if (enemy.meta.basicParams) {
            const values = enemy.meta.basicParams.split(",").map(token => Number(token));
            const count = Math.min(this._basicParams.length, values.length);
            for (let i = 0; i < count; i++) {
                const value = values[i];
                if (value > 0) {
                    this._basicParams[i] = value;
                }
            }
        }
        if (enemy.meta.basicParamsVariance) {
            const values = enemy.meta.basicParams.split(",").map(token => Number(token));
            const count = Math.min(this._basicParams.length, values.length);
            for (let i = 0; i < count; i++) {
                const variance = values[i];
                if (variance > 0) {
                    // randomInt(variance * 2 + 1)で0～(variance*2)の正数値が返る。
                    const value = this._basicParams[i] + Math.randomInt(variance * 2 + 1) - variance;
                    this._basicParams[i] = Math.max(1, value);
                }
            }
        }
    };


    //------------------------------------------------------------------------------
    // Game_Action
    if (Game_Action.EFFECT_GAIN_BASIC_PARAM) {
        const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
        /**
         * 効果を適用可能かどうかを判定する。
         * codeに対応する判定処理が定義されていない場合、適用可能(true)が返る。
         * 
         * @param {Game_BattlerBase} target 対象
         * @param {DataEffect} effect エフェクトデータ
         * @returns {boolean} 適用可能な場合にはtrue, それ以外はfalse
         */
        Game_Action.prototype.testItemEffect = function(target, effect) {
            if (effect.code === Game_Action.EFFECT_GAIN_BASIC_PARAM) {
                const paramId = effect.dataId;
                return (target.isActor() && (target.basicParamAdd(paramId) < maxBasicParamAdd));
            } else {
                return _Game_Action_testItemEffect.call(this, target, effect);
            }
        };

        const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
        /**
         * 効果を適用する。
         * 
         * @param {Game_Battler} target ターゲット
         * @param {DataEffect} effect エフェクトデータ
         */
        Game_Action.prototype.applyItemEffect = function(target, effect) {
            if (effect.code === Game_Action.EFFECT_GAIN_BASIC_PARAM) {
                this.applyItemEffectGainBasicParam(target, effect);
            } else {
                _Game_Action_applyItemEffect.call(this, target, effect);
            }
        };

        /**
         * 効果を適用する。
         * 
         * @param {Game_Battler} target ターゲット
         * @param {DataEffect} effect エフェクトデータ
         */
        Game_Action.prototype.applyItemEffectGainBasicParam = function(target, effect) {
            if (target.isActor()) {
                const paramId = effect.dataId;
                target.addBasicParam(paramId, effect.value1);
                this.makeSuccess(target);
            }
        };
    }
})();
