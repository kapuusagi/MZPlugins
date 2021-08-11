/*:ja
 * @target MZ 
 * @plugindesc バフ拡張プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * @orderAfter Kapu_Base_ParamName
 * @base Kapu_base_Hit
 * @orderAfter Kapu_Base_Hit
 * 
 * @param fixedBuffEffectCode
 * @text 固定バフエフェクトコード
 * @desc 固定バフ効果に割り当てるID。
 * @type number
 * @min 45
 * @default 107
 * 
 * @param fixedDebuffEffectCode
 * @text 固定デバフエフェクトコード
 * @desc 固定デバフ効果に割り当てるID。
 * @type number
 * @min 45
 * @default 108
 * 
 * @param stateRateBuffTraitCode
 * @text ステート割合バフ特性コード。
 * @desc ステートに付与する割合増加の特性に割り当てるコード値。
 * @type number
 * @default 104
 * @min 65
 * 
 * @param stateFixedBuffTraitCode
 * @text ステート固定バフ特性コード。
 * @desc ステートに付与する固定量増加の特性に割り当てるコード値。
 * @type number
 * @min 65
 * @default 105
 * 
 * @param buffTurnAddSpecialFlagId
 * @text バフ付与ターン数増加スペシャルフラグ
 * @desc バフ付与ターン数増加特性に割り当てるフラグ値
 * @type number
 * @min 5
 * @default 109
 * 
 * @param debuffTurnAddSpecialFlagId
 * @text デバフ付与ターン数増加スペシャルフラグ
 * @desc デバフ付与ターン数増加特性に割り当てるフラグ値
 * @type number
 * @min 5
 * @default 110
 * 
 * @param acceptBuffTurnUpSpecialFlagId
 * @text バフ付与ターン数増加スペシャルフラグ
 * @desc バフ付与ターン数増加特性に割り当てるフラグ値
 * @type number
 * @min 5
 * @default 111
 * 
 * @param acceptDebuffTurnDownSpecialFlagId
 * @text デバフ付与ターン数減少スペシャルフラグ
 * @desc デバフ付与ターン数減少特性に割り当てるフラグ値
 * @type number
 * @min 5
 * @default 112
 * 
 * 
 * @param textTraitSpecialFlagBufTurnAdd
 * @text バフターン延長特性名
 * @desc バフターン延長特性名
 * @type string
 * @default 付与バフターン数延長
 * 
 * @param textTraitSpecialFlagDebufTurnAdd
 * @text デバフターン延長特性名
 * @desc デバフターン延長特性名
 * @type string
 * @default 付与デバフターン数延長
 * 
 * @param textTraitSpecialFlagAcptBufTurnUp
 * @text 受付バフターン延長特性名
 * @desc 受付バフターン延長特性名
 * @type string
 * @default 受けたバフターン数延長
 * 
 * @param textTraitSpecialFlagDebuffTurnDown
 * @text 受付デバフターン数減少特性名
 * @desc 受付デバフターン数減少特性名
 * @type string
 * @default 受けたデバフターン数短縮
 * 
 * @help 
 * バフの拡張をするプラグイン。
 * ベーシックシステムでは、バフ段階を-2～2で上下させ、段階毎に25%の増減をする仕様であった。
 * これだとスキル効果に個性を持たせるのに不十分と考え、バフの仕様変更を行う。
 * 
 * 変更内容
 * 1. MaxHP～LUKに対するバフに関しては、効果量とターンに変更する。
 *    ベーシックシステムでの割合向上効果は、ノートタグ未指定時は割合効果量10%固定となる。
 *    割合効果量の計算も、使用したタイミングでの対象の、バフ対象基本値に対する変動量とする。
 *    無バフ時に100で、5%減少がかかった状態に対し、バフ5%減を重ねがけしても減少しない。
 *    対象ターン数だけ、長い方に上書きされる。
 * 
 * 2. ステート用のバフ追加
 *    ベーシックシステムでは最大HP割合増加などが使用出来るのでそちらでも良い。
 *    固定量増減や、レート特性の適用対象を変更している場合用に作成した。
 *    例えば装備品による増減分を、レート特性から外していた場合、
 *    バフ側で適用しないと増えない。
 *    複数のレート、加算値がある場合、いずれも和をとって適用する。
 *    また1のバフ仕様変更により、一番効果が高いものが適用されるようになるが、
 *    それとは別系統でバフ/デバフを適用したい場合にはこちらを使用する。
 * 
 * ■ 使用時の注意
 * 他のバフを変更する系統のプラグインと競合します。
 * 固定量バフに計算式を使用するとき、参照するパラメータに注意が必要です。
 * 詳細はノートタグの説明を参照。
 * 
 * 
 * ■ プラグイン開発者向け
 * なし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * <アイテム/スキル>
 *     <addRateBuff:target,rate,turns>
 *          割合バフを付与する効果を持たせる。
 *          targetで指定するパラメータにrate割合だけ加算するバフになる。
 *          複数指定可。
 *          target:MaxHP,MaxMP,ATK,DEF,MAT,MDF,AGI,LUK
 *     <addRateDebuff:target,rate,turns>
 *          割合デバフを付与する効果を持たせる。
 *          targetで指定するパラメータにrate割合だけ減算するデバフになる。
 *          複数指定可。
 *          target:MaxHP,MaxMP,ATK,DEF,MAT,MDF,AGI,LUK
 *     <addFixedBuff:target,value,turns>
 *          固定バフを付与する効果を持たせる。
 *          targetで指定するパラメータにvalueだけ加算するバフになる。
 *          <buffValue*>または<buffValue>ノートタグと組み合わせる事ができる。
 *          複数指定可。
 *          target:MaxHP,MaxMP,ATK,DEF,MAT,MDF,AGI,LUK
 *     <addFixedDebuff:target,value,turns>
 *          固定バフを付与する効果を持たせる。
 *          targetで指定するパラメータにvalueだけ減算するデバフになる。
 *          複数指定可。
 *          <buffValue*>または<buffValue>ノートタグと組み合わせる事ができる。
 *          target:MaxHP,MaxMP,ATK,DEF,MAT,MDF,AGI,LUK
 * 
 *     <buffValue0:eval$>
 *     <buffValue1:eval$>
 *          :
 *     <buffValue7:eval$>
 *         各パラメータのバフ計算式としてevalを使用する。
 * 
 *     <buffValue:eval$>
 *         バフ量の計算式としてeval$を使用する。
 * 
 *     <debuffValue0:eval$>
 *     <debuffValue1:eval$>
 *          :
 *     <debuffValue7:eval$>
 *         各パラメータのデバフ計算式としてevalを使用する。
 *         a:使用者
 *         b:対象
 *         v:変数
 *         参照パラメータに注意すること。
 *         例えば b.atk * 1.5 とすると、使用者のバフ込みの値を1.5倍した効果量になり、
 *         使用毎に効果量が激増してしまう。
 *         バフの対象になるパラメータを参照しないか、b.paramWithoutBuff(2)など、
 *         バフ無しパラメータを使うようにする。
 * 
 *     <debuffValue:eval$>
 *         デバフ量の計算式としてeval$を使用する。
 *         a:使用者
 *         b:対象
 *         v:変数
 *         参照パラメータに注意すること。
 *         例えば b.atk * 1.5 とすると、使用者のバフ込みの値を1.5倍した効果量になり、
 *         使用毎に効果量が激増してしまう。
 *         バフの対象になるパラメータを参照しないか、b.paramWithoutBuff(2)など、
 *         バフ無しパラメータを使うようにする。
 * 
 * ステート
 *     <addRateBuff:target,rate>
 *          割合バフを付与する効果を持たせる。
 *          targetで指定するパラメータにrate割合だけ加算するバフになる。
 *          複数指定可。
 *          target:MaxHP,MaxMP,ATK,DEF,MAT,MDF,AGI,LUK
 *     <addRateDebuff:target,rate>
 *          割合デバフを付与する効果を持たせる。
 *          targetで指定するパラメータにrate割合だけ減算するデバフになる。
 *          複数指定可。
 *          target:MaxHP,MaxMP,ATK,DEF,MAT,MDF,AGI,LUK
 *     <addFixedBuff:target,value>
 *          固定バフを付与する効果を持たせる。
 *          targetで指定するパラメータにvalueだけ加算するバフになる。
 *          計算式は使用出来ない。（処理が重すぎるため）
 *          複数指定可。
 *          target:MaxHP,MaxMP,ATK,DEF,MAT,MDF,AGI,LUK
 *     <addFixedDebuff:target,value>
 *          固定バフを付与する効果を持たせる。
 *          targetで指定するパラメータにvalueだけ減算するデバフになる。
 *          複数指定可。
 *          計算式は使用出来ない。（処理が重すぎるため）
 *          target:MaxHP,MaxMP,ATK,DEF,MAT,MDF,AGI,LUK
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.3.0 確率計算部分を、Kapu_Base_Hitを使用するように変更した。
 * Version.0.2.0 固定量バフ計算が誤っていた不具合を修正
 *               Kapu_Base_ParamNameに対応。
 * Version.0.1.0 新規作成。
 */

 /**
  * バフデータを表すオブジェクト
  */
function Game_Buff() {
    this.initialize(...arguments);
}
(() => {
    const pluginName = "Kapu_BuffExtension";
    const parameters = PluginManager.parameters(pluginName);
    Game_Action.EFFECT_ADD_BUFF_FIXED = Number(parameters["fixedBuffEffectCode"]) || 0;
    Game_Action.EFFECT_ADD_DEBUFF_FIXED = Number(parameters["fixedDebuffEffectCode"]) || 0;
    Game_BattlerBase.TRAIT_STATE_RATEBUFF = Number(parameters["stateRateBuffTraitCode"]) || 0;
    Game_BattlerBase.TRAIT_STATE_FIXEDBUFF = Number(parameters["stateFixedBuffTraitCode"]) || 0;
    Game_BattlerBase.FLAG_ID_BUFFTURN_ADD = Number(parameters["buffTurnAddSpecialFlagId"]) || 0;
    Game_BattlerBase.FLAG_ID_DEBUFFTURN_ADD = Number(parameters["debuffTurnAddSpecialFlagId"]) || 0;
    Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP = Number(parameters["acceptBuffTurnUpSpecialFlagId"]) || 0;
    Game_BattlerBase.FLAG_ID_ACPT_DEBUFFTURN_DOWN = Number(parameters["acceptDebuffTurnDownSpecialFlagId"]) || 0;

    if (!Game_Action.EFFECT_ADD_BUFF_FIXED) {
        console.error(pluginName + ":EFFECT_ADD_BUFF_FIXED is not valid.");
    }
    if (!Game_Action.EFFECT_ADD_DEBUFF_FIXED) {
        console.error(pluginName + ":EFFECT_ADD_DEBUFF_FIXED is not valid.");
    }
    if (!Game_BattlerBase.TRAIT_STATE_RATEBUFF) {
        console.error(pluginName + ":TRAIT_STATE_RATEBUFF is not valid.");
    }
    if (!Game_BattlerBase.TRAIT_STATE_FIXEDBUFF) {
        console.error(pluginName + ":TRAIT_STATE_FIXEDBUFF is not valid.");
    }
    if (!Game_BattlerBase.FLAG_ID_BUFFTURN_ADD) {
        console.error(pluginName + ":FLAG_ID_BUFFTURN_ADD is not valid.");
    }
    if (!Game_BattlerBase.FLAG_ID_DEBUFFTURN_ADD) {
        console.error(pluginName + ":FLAG_ID_DEBUFFTURN_ADD is not valid.");
    }
    if (!Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP) {
        console.error(pluginName + ":FLAG_ID_ACPT_BUFFTURN_UP is not valid.");
    }
    if (!Game_BattlerBase.FLAG_ID_ACPT_DEBUFFTURN_DOWN) {
        console.error(pluginName + ":FLAG_ID_ACPT_DEBUFFTURN_DOWN is not valid.");
    }

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * 割合を得る。
     * 
     * @param {number} valueStr 割合を表す文字列
     * @returns {number} 割合の値
     */
    const _getRate = function(valueStr) {
        if (valueStr.slice(-1) === "%") {
            return Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            return Number(valueStr);
        }
    };

    /**
     * エフェクトを追加する。
     * 
     * @param {object} obj DataItemまたはDataSkill
     * @param {number} code コード
     * @param {number} dataId データID
     * @param {number} value1 値1
     * @param {number} value2 値2
     */
    const _addEffect = function(obj, code, dataId, value1, value2) {
        if (code) {
            obj.effects.push({
                code: code,
                dataId: dataId,
                value1: value1,
                value2:value2
            });
        }
    };

    /**
     * ノートタグを処理する。
     * 
     * @param {object} obj データオブジェクト
     */
    const _processEffectNoteTag = function(obj) {
        // ノートタグを処理する。
        const effectTargets = ["MaxHP", "MaxMP", "ATK", "DEF", "MAT", "MDF", "AGI", "LUK"];
        const patternRateBuff = /<addRateBuff:([a-zA-Z]+) *, *(\d+\.?\d+%?) *, *(\d+) *>/;
        const patternRateDebuff = /<addRateDebuff:([a-zA-Z]+) *, *(\d+\.?\d+%?) *, *(\d+) *>/;
        const patternFixedBuff = /<addFixedBuff:([a-zA-Z]+) *, *(\d+) *, *(\d+) *>/;
        const patternFixedDebuff = /<addFixedDebuff:([a-zA-Z]+) *, *(\d+) *, *(\d+) *>/;

        const lines = obj.note.split(/[\r\n]+/);
        for (line of lines) {
            let re;
            if ((re = line.match(patternRateBuff)) !== null) {
                const target = effectTargets.indexOf(re[1]);
                const rate = _getRate(re[2]);
                const turns = Number(re[3]) || 0;
                if ((target >= 0) && (rate >= 0) && (turns > 0)) {
                    _addEffect(obj, Game_Action.EFFECT_ADD_BUFF, target, turns, rate);
                }
            } else if ((re = line.match(patternRateDebuff)) !== null) {
                const target = effectTargets.indexOf(re[1]);
                const rate = _getRate(re[2]);
                const turns = Number(re[3]) || 0;
                if ((target >= 0) && (rate >= 0) && (turns > 0)) {
                    _addEffect(obj, Game_Action.EFFECT_ADD_DEBUFF, target, turns, rate);
                }
            } else if ((re = line.match(patternFixedBuff)) !== null) {
                const target = effectTargets.indexOf(re[1]);
                const value = Number(re[2]) || 0;
                const turns = Number(re[3]) || 0;
                if ((target >= 0) && (value >= 0) && (turns > 0)) {
                    _addEffect(obj, Game_Action.EFFECT_ADD_BUFF_FIXED, target, turns, value);
                }
            } else if ((re = line.match(patternFixedDebuff)) !== null) {
                const target = effectTargets.indexOf(re[1]);
                const value = Number(re[2]) || 0;
                const turns = Number(re[3]) || 0;
                if ((target >= 0) && (value >= 0) && (turns > 0)) {
                    _addEffect(obj, Game_Action.EFFECT_ADD_DEBUFF_FIXED, target, turns, value);
                }
            }
        }
    };
    DataManager.addNotetagParserSkills(_processEffectNoteTag);
    DataManager.addNotetagParserItems(_processEffectNoteTag);

    /**
     * 特性を追加する。
     * 
     * @param {object} obj データオブジェクト。
     * @param {number} code コード
     * @param {number} dataId データID
     * @param {number} value 値
     */
    const _addTrait = function(obj, code, dataId, value) {
        if (code) {
            obj.traits.push({
                code:code,
                dataId:dataId,
                value:value
            })
        }
    };

    /**
     * ノートタグを処理する。
     * 
     * @param {object} obj データオブジェクト
     */
    const _processStateNoteTag = function(obj) {
        // ノートタグを処理する。
        const effectTargets = ["MaxHP", "MaxMP", "ATK", "DEF", "MAT", "MDF", "AGI", "LUK"];
        const patternRateBuff = /<addRateBuff:([a-zA-Z]+) *, *(\d+\.?\d+%?) *>/;
        const patternRateDebuff = /<addRateDebuff:([a-zA-Z]+) *, *(\d+\.?\d+%?) *>/;
        const patternFixedBuff = /<addFixedBuff:([a-zA-Z]+) *, *(\d+) *>/;
        const patternFixedDebuff = /<addFixedDebuff:([a-zA-Z]+) *, *(\d+) *>/;

        const lines = obj.note.split(/[\r\n]+/);
        for (line of lines) {
            let re;
            if ((re = line.match(patternRateBuff)) !== null) {
                const target = effectTargets.indexOf(re[1]);
                const rate = _getRate(re[2]);
                if ((target >= 0) && (rate > 0)) {
                    _addTrait(obj, Game_BattlerBase.TRAIT_STATE_RATEBUFF, target, rate);
                }
            } else if ((re = line.match(patternRateDebuff)) !== null) {
                const target = effectTargets.indexOf(re[1]);
                const rate = _getRate(re[2]);
                if ((target >= 0) && (rate > 0)) {
                    _addTrait(obj, Game_BattlerBase.TRAIT_STATE_RATEBUFF, target, -rate);
                }
            } else if ((re = line.match(patternFixedBuff)) !== null) {
                const target = effectTargets.indexOf(re[1]);
                const value = Number(re[2]) || 0;
                if ((target >= 0) && (value > 0)) {
                    _addTrait(obj, Game_BattlerBase.TRAIT_STATE_FIXEDBUFF, target, value);
                }
            } else if ((re = line.match(patternFixedDebuff)) !== null) {
                const target = effectTargets.indexOf(re[1]);
                const value = Number(re[2]) || 0;
                if ((target >= 0) && (value > 0)) {
                    _addTrait(obj, Game_BattlerBase.TRAIT_STATE_FIXEDBUFF, target, -value);
                }
            }
        }

        _processTraitNoteTag(obj);
    };
    DataManager.addNotetagParserStates(_processStateNoteTag);
    /**
     * ノートタグを処理する。
     * 
     * @param {object} obj データオブジェクト
     */
    const _processTraitNoteTag = function(obj) {
        if (Game_BattlerBase.FLAG_ID_BUFFTURN_ADD && obj.meta.buffTurnAdd) {
            _addTrait(obj, Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP,
                    Game_BattlerBase.FLAG_ID_BUFFTURN_ADD, 0);
        }
        if (Game_BattlerBase.FLAG_ID_DEBUFFTURN_ADD && obj.meta.debuffTurnAdd) {
            _addTrait(obj, Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP,
                    Game_BattlerBase.FLAG_ID_DEBUFFTURN_ADD, 0);
        }
        if (Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP && obj.meta.acceptBuffTurnUp) {
            _addTrait(obj, Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP,
                    Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP, 0);
        }
        if (Game_BattlerBase.FLAG_ID_ACPT_DEBUFFTURN_DOWN && obj.meta.acceptBuffTurnDown) {
            _addTrait(obj, Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP,
                    Game_BattlerBase.FLAG_ID_ACPT_DEBUFFTURN_DOWN, 0);
        }
    };
    DataManager.addNotetagParserActors(_processTraitNoteTag);
    DataManager.addNotetagParserClasses(_processTraitNoteTag);
    DataManager.addNotetagParserWeapons(_processTraitNoteTag);
    DataManager.addNotetagParserArmors(_processTraitNoteTag);
    DataManager.addNotetagParserEnemies(_processTraitNoteTag);

    //------------------------------------------------------------------------------
    // TextManager
    if (Game_BattlerBase.TRAIT_STATE_RATEBUFF && TextManager._traitConverters) {
        TextManager._traitConverters[Game_BattlerBase.TRAIT_STATE_RATEBUFF] = {
            name:TextManager.traitParam, value:TextManager.traitValueSum, str:TextManager.traitValueStrRateAbs, baseValue:0
        };
    }
    if (Game_BattlerBase.TRAIT_STATE_FIXEDBUFF && TextManager._traitConverters) {
        TextManager._traitConverters[Game_BattlerBase.TRAIT_STATE_FIXEDBUFF] = {
            name:TextManager.traitParam, value:TextManager.traitValueSum, str:TextManager.traitValueStrInt, baseValue:0
        };
    }
    if (TextManager._specialFlags) {
        if (Game_BattlerBase.FLAG_ID_BUFFTURN_ADD) {
            TextManager._specialFlags[Game_BattlerBase.FLAG_ID_BUFFTURN_ADD] = parameters["textTraitSpecialFlagBufTurnAdd"] || "";
        }
        if (Game_BattlerBase.FLAG_ID_DEBUFFTURN_ADD) {
            TextManager._specialFlags[Game_BattlerBase.FLAG_ID_DEBUFFTURN_ADD] = parameters["textTraitSpecialFlagDebufTurnAdd"] || "";
        }
        if (Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP) {
            TextManager._specialFlags[Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP] = parameters["textTraitSpecialFlagAcptBufTurnUp"] || "";
        }
        if (Game_BattlerBase.FLAG_ID_ACPT_DEBUFFTURN_DOWN) {
            TextManager._specialFlags[Game_BattlerBase.FLAG_ID_ACPT_DEBUFFTURN_DOWN] = parameters["textTraitSpecialFlagDebuffTurnDown"] || "";
        }
    }

    //------------------------------------------------------------------------------
    // Game_Buff
    /**
     * Game_Buffオブジェクトを初期化する。
     */
    Game_Buff.prototype.initialize = function() {
        this.clear();
    };

    /**
     * バフをクリアする。
     */
    Game_Buff.prototype.clear = function() {
        this._rate = 0;
        this._value = 0;
        this._turns = 0;
    };

    /**
     * バフ乗算レートを設定する。
     * 
     * @param {number} rate レート
     */
    Game_Buff.prototype.setRate = function(rate) {
        if (rate > 0) {
            if (this.isDebuff()) {
                this.clear();
            } else if (rate > this._rate) {
                this._rate = rate;
            }
        } else if (rate < 0) {
            if (this.isBuff()) {
                this.clear();
            } else if (rate < this._rate) {
                this._rate = rate;
            }
        }
    };

    /**
     * バフ乗算レートを得る。
     * 
     * @returns {number} レート
     */
    Game_Buff.prototype.rate = function() {
        return this._rate;
    };

    /**
     * バフ加減算値を得る。
     * 
     * @returns {number} 固定量加減算値。
     */
    Game_Buff.prototype.value = function() {
        return this._value;
    };

    /**
     * 固定加減量を設定する。
     * 
     * @param {number} value 固定加減量
     */
    Game_Buff.prototype.setValue = function(value) {
        if (value > 0) {
            if (this.isDebuff()) {
                this.clear();
            } else if (value > this._value) {
                this._value = value;
            }
        } else if (value < 0) {
            if (this.isBuff()) {
                this.clear();
            } else if (value < this._value) {
                this._value = value;
            }
        }
    };

    /**
     * バフかどうかを得る。
     * 
     * @returns {boolean} バフの場合にはtrue, それ以外はfalse。
     */
    Game_Buff.prototype.isBuff = function() {
        return (this._rate > 0) || (this._value > 0);
    };

    /**
     * デバフかどうかを得る。
     * 
     * @returns {boolean} デバフの場合にはtrue, それ以外はfalse。
     */
    Game_Buff.prototype.isDebuff = function() {
        return (this._rate < 0) || (this._value < 0);
    };

    /**
     * このバフが効果を及ぼす残りターン数を得る。
     * 
     * @returns {number} 残りターン数
     */
    Game_Buff.prototype.turns = function() {
        return this._turns;
    };

    /**
     * このバフの残りターン数を設定する。
     * 
     * @param {number} turns ターン数
     */
    Game_Buff.prototype.setTurns = function(turns) {
        this._turns = turns;
    };

    /**
     * このバフの残りターン数を加減する。
     * 
     * @param {number} turns ターン数
     */
    Game_Buff.prototype.gainTurns = function(turns) {
        this._turns = Math.max(0, this._turns + turns);
    };

    /**
     * 効果ターンを更新する。
     */
    Game_Buff.prototype.updateTurns = function() {
        if (this._turns > 0) {
            this._turns--;
        }
    };

    /**
     * 
     * @param {number} baseValue ベース値
     * @returns {number} バフによる加算値
     */
    Game_Buff.prototype.calcBuffValue = function(baseValue) {
        if (this.isBuff()) {
            return Math.max(Math.round(baseValue * this._rate), this._value);
        } else if (this.isDebuff()) {
            return Math.min(Math.round(baseValue * this._rate), this._value);
        } else {
            return 0;
        }
    };

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * 基本パラメータの バフに依る乗算レート。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} パラメータレート
     * !!!overwrite!!! Game_BattlerBase.paramBuffRate()
     *     バフデータ構造変更のためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
        return 1;
    };
    /**
     * バフを適用する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} baseValue バフの適用元のベース値
     * @returns {number} バフを適用した後の値。
     * !!!overwrite!!! Game_BattlerBase.applyBuff()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.applyBuff = function(paramId, baseValue) {
        const buffValue = this._buffs[paramId].calcBuffValue(baseValue);
        const stateBuffValue = this.stateBuff(paramId, baseValue);/* ステートによるバフ加算量 */
        return baseValue + buffValue + stateBuffValue;
    };

    /**
     * ステートバフの加減量を得る。
     * 
     * @param {number} paramId パラメータID 
     * @param {number} baseValue ベース値
     * @returns {number} 加減する値。
     */
    Game_BattlerBase.prototype.stateBuff = function(paramId, baseValue) {
        const rate = this.traitsSum(Game_BattlerBase.TRAIT_STATE_RATEBUFF, paramId);
        const fixedValue = this.traitsSum(Game_BattlerBase.TRAIT_STATE_FIXEDBUFF, paramId);
        return Math.round(baseValue * rate) + fixedValue;
    };


    /**
     * バフをクリアする。
     * 
     * !!!overwrite!!! Game_BattlerBase.clearBuffs()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.clearBuffs = function() {
        if (!this._buffs) {
            this._buffs = [];
        }
        for (let i = 0; i < 8; i++) {
            if (this._buffs[i]) {
                this._buffs[i].clear();
            } else {
                this._buffs[i] = new Game_Buff();
            }
        }
    };
    /**
     * バフを消去する。
     * 
     * @param {number} paramId パラメータID
     * !!!overwrite!!! Game_BattlerBase.eraseBuff()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.eraseBuff = function(paramId) {
        this._buffs[paramId].clear();
    };
    /**
     * バフ段階を得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} バフ段階
     * !!!overwrite!!! Game_BattlerBase.buff()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.buff = function(paramId) {
        if (this._buffs[paramId].isBuff()) {
            return 1;
        } else if (this._buffs[paramId].isDebuff()) {
            return -1;
        } else {
            return 0;
        }
    };

    /**
     * バフが適用されているかどうかを判定する。
     * 
     * @param {number} paramId パラメータID
     * @returns {boolean} バフが適用されている場合にはtrue, それ以外はfalse.
     * !!!overwrite!!! Game_BattlerBase.isBuffAffected()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.isBuffAffected = function(paramId) {
        return this._buffs[paramId].isBuff();
    };

    /**
     * デバフが適用されているかどうかを得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {boolean} デバフが適用されている場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_BattlerBase.isDebuffAffected()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.isDebuffAffected = function(paramId) {
        return this._buffs[paramId].isDebuff();
    };
    /**
     * バフまたはデバフが適用されているかどうかを取得する。
     * 
     * @param {number} paramId パラメータID
     * @returns {boolean} バフまたはデバフが適用されている場合にはtrue, それ以外はfalse.
     * !!!overwrite!!! Game_BattlerBase.isBuffOrDebuffAffected()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId) {
        const buff = this._buffs[paramId];
        return buff.isBuff() || buff.isDebuff();
    };
    /**
     * バフ段階が最大かどうかを判定する。
     * 
     * @param {number} paramId パラメータID
     * @returns {boolean} 最大減適用されている場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_BattlerBase.isMaxBuffAffected()
     *     バフデータ構造変更のためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
        return false;
    };

    /**
     * デバフ段階が最大かどうかを判定する。
     * 
     * @param {number} paramId パラメータID
     * @returns {boolean} 最大減適用されている場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_BattlerBase.isMaxDebuffAffected()
     *     バフデータ構造変更のためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
        return false;
    };

    /**
     * バフを1段階引き上げる。
     * 
     * @param {number} paramId パラメータID
     * !!!overwrite!!! Game_BattlerBase.increaseBuff()
     *     バフデータ構造変更のためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.increaseBuff = function(paramId) {
        console.error("increaseBuff is ignored.");
    };

    /**
     * バフを1段階引き下げる。
     * 
     * @param {number} paramId パラメータID
     * !!!overwrite!!! Game_BattlerBase.decreaseBuff()
     *     バフデータ構造変更のためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.decreaseBuff = function(paramId) {
        console.error("decreaseBuff is ignored.");
    };

    /**
     * 割合バフ/デバフを設定する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} rate 効果量。(rate>0:バフ  rate<0:デバフ)
     */
    Game_BattlerBase.prototype.setRateBuff = function(paramId, rate) {
        this._buffs[paramId].setRate(rate);
    };

    /**
     * 固定量バフ/デバフを設定する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} value 効果量(value>0:バフ、value<0:デバフ)
     */
    Game_BattlerBase.prototype.setFixedBuff = function(paramId, value) {
        this._buffs[paramId].setValue(value);
    };



    /**
     * バフターンを上書きする。
     * 
     * @param {number} paramId パラメータID
     * @param {number} turns ターン数
     * !!!overwrite!!! Game_BattlerBase.overwriteBuffTurns()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.overwriteBuffTurns = function(paramId, turns) {
        const buff = this._buffs[paramId];
        if (buff.turns() < turns) {
            buff.setTurns(turns);
        }
    };

    /**
     * バフの効果ターンが切れたかどうかを取得する。
     * 
     * @param {number} paramId パラメータID
     * @returns {boolean} 切れた場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_BattlerBase.isBuffExpired()
     *     割合バフと固定量バフを元に計算するため、オーバーライドする。
     */
    Game_BattlerBase.prototype.isBuffExpired = function(paramId) {
        const buff = this._buffs[paramId];
        return buff.turns() === 0;
    };

    /**
     * バフの効果ターンを更新する。
     * 
     * !!!overwrite!!! Game_BattlerBase.updateBuffTurns()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.updateBuffTurns = function() {
        for (let i = 0; i < this._buffs.length; i++) {
            this._buffs[i].updateTurns();
        }
    };

    /**
     * バフアイコンを得る。
     * 
     * @returns {Array<Number>} バフのアイコン配列
     * !!!overwrite!!! Game_BattlerBase.buffIcons()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.buffIcons = function() {
        const icons = [];
        for (let i = 0; i < this._buffs.length; i++) {
            if (this.isBuffOrDebuffAffected(i)) {
                const level = this._buffs[i].isBuff() ? 1 : -1;
                icons.push(this.buffIconIndex(level, i));
            }
        }
        return icons;
    };

    /**
     * バフのアイコン番号を得る。
     * 
     * @param {number} buffLevel バフレベル
     * @param {number} paramId パラメータID
     * @returns {number} アイコン番号。
     * !!!overwrite!!! Game_BattlerBase.buffIcons()
     *     バフデータ構造変更のためオーバーライドする。
     */
    Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
        const buff = this._buffs[paramId];
        if (buff.isBuff()) {
            return Game_BattlerBase.ICON_BUFF_START + paramId;
        } else if (buff.isDebuff()) {
            return Game_BattlerBase.ICON_DEBUFF_START + paramId;
        } else {
            return 0;
        }
    };

    if (Game_BattlerBase.FLAG_ID_BUFFTURN_ADD) {
        /**
         * バフを付与する時のターンボーナスを得る。
         * 
         * @returns {number} 加算するターン数
         */
        Game_BattlerBase.prototype.giveBuffTurnBonus = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_BUFFTURN_ADD) ? 1 : 0;
        };
    } else {
        /**
         * バフを付与する時のターンボーナスを得る。
         * 
         * @returns {number} 加算するターン数
         */
        Game_BattlerBase.prototype.giveBuffTurnBonus = function() {
            return 0;
        };
    }

    if (Game_BattlerBase.FLAG_ID_DEBUFFTURN_ADD) {
        /**
         * デバフを付与する時のターンボーナスを得る。
         * 
         * @returns {number} 加算するターン数
         */
        Game_BattlerBase.prototype.giveDebuffTurnBonus = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_DEBUFFTURN_ADD) ? 1 : 0;
        };
    } else {
        /**
         * デバフを付与する時のターンボーナスを得る。
         * 
         * @returns {number} 加算するターン数
         */
        Game_BattlerBase.prototype.giveDebuffTurnBonus = function() {
            return 0;
        };
    }

    if (Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP) {
        /**
         * バフを受けるときのターンボーナスを得る。
         * 
         * @returns {number} 加算するターン数
         */
        Game_BattlerBase.prototype.acceptBuffTurnBonus = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_ACPT_BUFFTURN_UP) ? 1 : 0;
        };
    } else {
        /**
         * バフを受けるときのターンボーナスを得る。
         * 
         * @returns {number} 加算するターン数
         */
        Game_BattlerBase.prototype.acceptBuffTurnBonus = function() {
            return 0;
        };
    }
    if (Game_BattlerBase.FLAG_ID_ACPT_DEBUFFTURN_DOWN) {
        /**
         * デバフを受けるときのターンボーナスを得る。
         * 
         * @returns {number} 加算するターン数
         */
        Game_BattlerBase.prototype.acceptDebuffTurnBonus = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_ACPT_DEBUFFTURN_DOWN) ? -1 : 0;
        };
    } else {
        /**
         * デバフを受けるときのターンボーナスを得る。
         * 
         * @returns {number} 加算するターン数
         */
        Game_BattlerBase.prototype.acceptDebuffTurnBonus = function() {
            return 0;
        };
    }


    //------------------------------------------------------------------------------
    // Game_Battler
    /**
     * バフを付与する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} turns 効果ターン 
     * !!!overwrite!!! Game_Battler.addBuff()
     *     バフデータ構造変更のためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_Battler.prototype.addBuff = function(paramId, turns) {
        console.error("Game_Battler.addBuff() is ignored.");
    };

    /**
     * デバフを付与する。
     * 
     * Note:バフデータ構造変更のためオーバーライドする。
     * @param {number} paramId パラメータID
     * @param {number} turns 効果ターン数
     */
    // eslint-disable-next-line no-unused-vars
    Game_Battler.prototype.addDebuff = function(paramId, turns) {
        console.error("Game_Battler.addDebuff() is ignored.");
    };

    /**
     * 固定割合のバフを付与する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} rate 割合。
     * @param {number} turns ターン数
     */
    Game_Battler.prototype.addRateBuff = function(paramId, rate, turns) {
        if (this.isAlive()) {
            this.setRateBuff(paramId, rate);
            if (this.isBuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedBuff(paramId);
            this.refresh();
        }
    };
    /**
     * 固定割合のデバフを付与する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} rate 割合。
     * @param {number} turns ターン数
     */
    Game_Battler.prototype.addRateDebuff = function(paramId, rate, turns) {
        if (this.isAlive()) {
            this.setRateBuff(paramId, -rate);
            if (this.isDebuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedDebuff(paramId);
            this.refresh();
        }
    };
    /**
     * 固定量割合のバフを付与する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} value 値(
     * @param {number} turns ターン数
     */
    Game_Battler.prototype.addFixedBuff = function(paramId, value, turns) {
        if (this.isAlive()) {
            this.setFixedBuff(paramId, value);
            if (this.isBuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedBuff(paramId);
            this.refresh();
        }
    };
    /**
     * 固定量割合のバフまたはデバフを付与する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} value 値(value>0:バフ、value<0:デバフ)
     * @param {number} turns ターン数
     */
    Game_Battler.prototype.addFixedDebuff = function(paramId, value, turns) {
        if (this.isAlive()) {
            this.setFixedBuff(paramId, -value);
            if (this.isDebuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedDebuff(paramId);
            this.refresh();
        }
    };

    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    /**
     * 効果を適用する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {DataEffect} effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        if (Game_Action.EFFECT_ADD_BUFF_FIXED
                && (effect.code === Game_Action.EFFECT_ADD_BUFF_FIXED)) {
            this.itemEffectAddBuffFixed(target, effect);
        } else if (Game_Action.EFFECT_ADD_DEBUFF_FIXED
                && (effect.code === Game_Action.EFFECT_ADD_DEBUFF_FIXED)) {
                    this.itemEffectAddDebuffFixed(target, effect);
        } else {
            _Game_Action_applyItemEffect.call(this, target, effect);
        }
    };    
    /**
     * バフを適用する。
     * 
     * @param {Game_Battler} target 対象
     * @param {Effect} effect エフェクトデータ
     * !!!overwrite!!! Game_Action.itemEffectAddBuff()
     *     バフ構造変更のため、オーバーライドする。
     */
    Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
        const turns = this.itemBuffTurns(target, effect.value1);
        const rate = effect.value2 || 0.25; // 0.25はベーシックシステムのデフォルト
        target.addRateBuff(effect.dataId, rate, turns);
        this.makeSuccess(target);
    };

    /**
     * バフを適用する。
     * 
     * @param {Game_Battler} target 対象
     * @param {Effect} effect エフェクトデータ
     * !!!overwrite!!! Game_Action.itemEffectAddDebuff()
     *     バフ構造変更のため、オーバーライドする。
     */
    Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
        const successRate = this.debuffAddSuccessRate(target, effect.dataId, 1);
        if (Math.random() < successRate) {
            const turns = this.itemDebuffTurns(target, effect.value1);
            const rate = effect.value2 || 0.25; // 0.25はベーシックシステムのデフォルト
            target.addRateDebuff(effect.dataId, rate, turns);
            this.makeSuccess(target);
        }
    };

    /**
     * 固定量バフを適用する。
     * 
     * @param {Game_Battler} target 対象
     * @param {Effect} effect エフェクトデータ
     */
    Game_Action.prototype.itemEffectAddBuffFixed = function(target, effect) {
        const turns = this.itemBuffTurns(target, effect.value1);
        const buffValue = this.itemBuffValue(target, effect.dataId, effect.value2)
        target.addFixedBuff(effect.dataId, buffValue, turns);
        this.makeSuccess(target);
    };

    /**
     * バフ量を計算する。
     * 
     * @param {Game_Battler} target 対象
     * @param {number} paramId パラメータID
     * @param {number} value 指定された固定値
     */
    Game_Action.prototype.itemBuffValue = function(target, paramId, value) {
        const item = this.item();
        const evalStr = item.meta["buffValue" + paramId] || item.meta.buffValue;
        if (evalStr) {
            try {
                const a = this.subject(); // eslint-disable-line no-unused-vars
                const b = target; // eslint-disable-line no-unused-vars
                const v = $gameVariables._data; // eslint-disable-line no-unused-vars
                return Math.max(0, Math.round(eval(evalStr)));
            }
            catch (e) {
                console.error(e);
            }
        }
        return value;
    };

    /**
     * 固定量デバフを適用する。
     * 
     * @param {Game_Battler} target 対象
     * @param {Effect} effect エフェクトデータ
     */
    Game_Action.prototype.itemEffectAddDebuffFixed = function(target, effect) {
        const successRate = this.debuffAddSuccessRate(target, effect.dataId, 1);
        if (Math.random() < successRate) {
            const turns = this.itemDebuffTurns(target, effect.value1);
            const buffValue = this.itemDebuffValue(target, effect.dataId, effect.value2)
            target.addFixedDebuff(effect.dataId, buffValue, turns);
            this.makeSuccess(target);
        }
    };
    /**
     * デバフ量を計算する。
     * 
     * @param {Game_Battler} target 対象
     * @param {number} paramId パラメータID
     * @param {number} value 指定された固定値
     */
    Game_Action.prototype.itemDebuffValue = function(target, paramId, value) {
        const item = this.item();
        const evalStr = item.meta["debuffValue" + paramId] || item.meta.debuffValue;
        if (evalStr) {
            try {
                const a = this.subject(); // eslint-disable-line no-unused-vars
                const b = target; // eslint-disable-line no-unused-vars
                const v = $gameVariables._data; // eslint-disable-line no-unused-vars
                return Math.max(0, Math.round(eval(evalStr)));
            }
            catch (e) {
                console.error(e);
            }
        }
        return value;
    };

    /**
     * バフターン数を得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {number} turns 基本ターン数
     * @returns {number} 効果ターン数が返る。
     */
    Game_Action.prototype.itemBuffTurns = function(target, turns) {
        const subject = this.subject();
        turns += subject.giveBuffTurnBonus();
        turns += target.acceptBuffTurnBonus();
        return Math.max(1, turns);
    };

    /**
     * デバフターン数を得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {number} turns 基本ターン数
     * @returns {number} 効果ターン数が返る。
     */
    Game_Action.prototype.itemDebuffTurns = function(target, turns) {
        const subject = this.subject();
        turns += subject.giveDebuffTurnBonus();
        turns += target.acceptDebuffTurnBonus();
        return Math.max(1, turns);
    };


})();
