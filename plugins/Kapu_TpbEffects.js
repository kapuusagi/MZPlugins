/*:ja
 * @target MZ 
 * @plugindesc TPBに対する効果を追加するためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param chargeTimeGainEffectCode
 * @text チャージタイム加減算効果コード
 * @desc チャージタイムを加減する効果に割り当てるコード。
 * @type number
 * @default 104
 * 
 * @param castTimeGainEffectCode
 * @text キャストタイム加減算効果コード
 * @desc キャストタイムを加減する効果に割り当てるコード。
 * @type number
 * @default 105
 * 
 * @param breakTpbCastEffectCode
 * @text キャスト中のアクションキャンセル効果コード
 * @desc キャスト中のアクションをキャンセルさせる効果に割り当てるコード。
 * @type number
 * @default 106
 * 
 * @param blockBreakTpbCastFlagId
 * @text キャストブレーク防止特性に割り当てるフラグID
 * @desc キャストブレークを防止する特性に割り当てるフラグID
 * @type number
 * @default 107
 * 
 * @help 
 * TPBに関して、以下の機能を追加します。
 * ・TPBゲージ加算/減算効果の追加。
 * ・TPBキャストゲージ加算/減算効果の追加。
 * ・TPBキャストブレーク効果の追加。
 *   併せてブロック特性の追加。
 * 
 * 
 * ■ 使用時の注意
 * TPBを操作する系統のプラグインと合体させると競合します。
 * 同じようなことは皆考えてるはず。
 * 
 * 
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具/エネミー
 *   <blockCastBreak>
 *      キャストブレーク特性を追加する。
 * 
 * スキル/アイテム
 *   <>
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_TpbEffect";
    const parameters = PluginManager.parameters(pluginName);
    Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME = Number(parameters["chargeTimeGainEffectCode"]) || 0;
    Game_Action.EFFECT_GAIN_TPB_CAST_TIME = Number(parameters["castTimeGainEffectCode"]) || 0;
    Game_Action.EFFECT_BREAK_TPB_CASTING = Number(parameters["breakTpbCastEffectCode"]) || 0;
    Game_BattlerBase.FLAG_ID_BLOCK_CAST_BREAK = Number(parameters["blockBreakTpbCastFlagId"]) || 0;

    if (!Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME) {
        console.error(pluginName + ":EFFECT_GAIN_TPB_CHARGE_TIME is not valid.");
    }
    if (!Game_Action.EFFECT_GAIN_TPB_CAST_TIME) {
        console.error(pluginName + ":EFFECT_GAIN_TPB_CAST_TIME is not valid.");
    }
    if (!Game_Action.EFFECT_BREAK_TPB_CASTING) {
        console.error(pluginName + ":EFFECT_BREAK_TPB_CASTING is not valid.");
    }
    //------------------------------------------------------------------------------
    // DataManager
    if (Game_BattlerBase.FLAG_ID_BLOCK_CAST_BREAK) {
        /**
         * itemの特性にvalueStrのキャストタイム倍率を加減する特性を追加する。
         * 
         * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
         */
        const _processNotetag = function(obj) {
            if (obj.meta.blockCastBreak) {
                obj.traits.push({ 
                    code:Game_BattlerBase.TRAIT_SPECIAL_FLAG, 
                    dataId:Game_BattlerBase.FLAG_ID_BLOCK_CAST_BREAK, 
                    value:0
                });
            }
        };

        DataManager.addNotetagParserActors(_processNotetag);
        DataManager.addNotetagParserClasses(_processNotetag);
        DataManager.addNotetagParserWeapons(_processNotetag);
        DataManager.addNotetagParserArmors(_processNotetag);
        DataManager.addNotetagParserStates(_processNotetag);
        DataManager.addNotetagParserEnemies(_processNotetag);
    }

    /**
     * strを解析し、レートを得る。
     * 
     * @param {String} str 文字列
     * @return レートを得る。
     */
    const _getRate = function(str) {
        if (str.slice(-1) === "%") {
            return (Number(str.slice(0, str.length - 1)) / 100.0) || 0;
        } else {
            return Number(str) || 0;
        }
    };


    /**
     * アイテムとスキルのノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト。(DataItem/DataSkill)
     */
    const _processEffectNotetag = function(obj) {
        if (Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME && obj.meta.gainTpbChargeTime) {
            const values = obj.meta.gainTpbChargeTime.split(",").map(token => _getRate(token));
            const value1 = (values.length >= 2) ? values[0] : 1.0;
            const value2 = (values.length >= 2) ? values[1] : values[0];
            if (value2 > 0) {
                obj.effects.push({
                    code: Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME,
                    dataId:0,
                    value1:value1,
                    value2:value2
                });
            }
        }
        if (Game_Action.EFFECT_GAIN_TPB_CAST_TIME && obj.meta.gainTpbCastTime) {
            obj.effects.push({
                code: Game_Action.EFFECT_GAIN_TPB_CAST_TIME,
                dataId:0,
                value1:value1,
                value2:value2
            });
        }
        if (Game_Action.EFFECT_BREAK_TPB_CASTING && obj.meta.breakTpbCast) {
            const value = _getRate(obj.meta.breakTpbCast);
            if (value > 0) {
                obj.effects.push({
                    code: Game_Action.EFFECT_BREAK_TPB_CASTING,
                    dataId:0,
                    value1:value,
                    value2:0
                });
            }
        }
    };
    DataManager.addNotetagParserSkills(_processEffectNotetag);
    DataManager.addNotetagParserItems(_processEffectNotetag);
    //------------------------------------------------------------------------------
    // Game_Battler

    /**
     * TPBをvalueだけチャージする。
     * 1.0以上にすると行動が回ってくる。
     * チャージ中（キャストなどでない）場合にしか効果無い。
     * 
     * @param {Number} value 値
     */
    Game_Battler.prototype.gainTpbChargeTime = function(value1) {
        if (this.canMove() && this.isAlive() && (this._tpbState === "charging")) {
            const t = this._tpbChargeTime + value;
            this._tpbChargeTime = Math.max(0, t);
        }
    };
    
    /**
     * キャストタイムをvalueだけチャージする。
     * 
     * @param {Number} value チャージ時間。
     */
    Game_Battler.prototype.gainTpbCastTime = function(value) {
        if (this._tpbState === "casting") {
            const t = this._tpbCastTime + value;
            if (t < 0) {
                this._tpbCastTime = 0;
                this.breakTpbCast();
            } else {
                this._tpbCastTime = Math.max(0, t);
            }
        }
    };

    /**
     * キャストをブレークする。
     * 妨害スキル等の効果用。
     */
    Game_Battler.prototype.breakTpbCast = function() {
        if (this._tpbState === "casting") {
            if (Game_BattlerBase.FLAG_ID_BLOCK_CAST_BREAK
                    && this.specialFlag(Game_BattlerBase.FLAG_ID_BLOCK_CAST_BREAK)) {
                // キャストブレーク無効
                return;
            }
            this._tpbCastTime = 0;
            this._tpbState = "charging";
        }
    };

    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
    /**
     * 効果を適用可能かどうかを判定する。
     * codeに対応する判定処理が定義されていない場合、適用可能(true)が返る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @param {DataEffect} effect エフェクトデータ
     * @return {Boolean} 適用可能な場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testItemEffect = function(target, effect) {
        if ((Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME && (effect.code === Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME))
                || (Game_Action.EFFECT_GAIN_TPB_CAST_TIME && (effect.code === Game_Action.EFFECT_GAIN_TPB_CAST_TIME))
                || (Game_Action.EFFECT_BREAK_TPB_CASTING && (effect.code === Game_Action.EFFECT_BREAK_TPB_CASTING))) {
            return $gameParty.inBattle() && BattleManager.isTpb();
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
        if (Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME && (effect.code === Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME)) {
            this.applyItemEffectGainTpbChargeTime(target, effect);
        } else if (Game_Action.EFFECT_GAIN_TPB_CAST_TIME && (effect.code === Game_Action.EFFECT_GAIN_TPB_CAST_TIME)) {
            this.applyItemEffectGainTpbCastTime(target, effect);
        } else if (Game_Action.EFFECT_BREAK_TPB_CASTING && (effect.code === Game_Action.EFFECT_BREAK_TPB_CASTING)) {
            this.applyItemEffectBreakTpbCasting(target, effect);
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
    Game_Action.prototype.applyItemEffectGainTpbChargeTime = function(target, effect) {
        let chance = effect.value1;
        if (!this.isCertainHit()) {
            chance *= target.lukEffectRate(target);
        }
        if (Math.random() < chance) {
            target.gainTpbChargeTime(effect.value2);
            this.makeSuccess(target);
        }
    };
    /**
     * 効果を適用する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {DataEffect} effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffectGainTpbCastTime = function(target, effect) {
        let chance = effect.value1;
        if (!this.isCertainHit()) {
            chance *= target.lukEffectRate(target);
        }
        if (Math.random() < chance) {
            target.gainTpbCastTime(effect.value2);
            this.makeSuccess(target);
        }
    };
    /**
     * 効果を適用する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {DataEffect} effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffectBreakTpbCasting = function(target, effect) {
        let chance = effect.value1;
        if (!this.isCertainHit()) {
            chance *= target.lukEffectRate(target);
        }
        if (Math.random() < chance) {
            target.breakTpbCast(effect.value2);
            this.makeSuccess(target);
        }
    };

})();