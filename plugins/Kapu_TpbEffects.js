/*:ja
 * @target MZ 
 * @plugindesc TPBに対する効果を追加するためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_Base_ParamName
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
 * @param blockTpbLoseFlagId
 * @text TPBゲージの減少防止特性フラグID
 * @desc TPBゲージの減少を防ぐ特性に割り当てるフラグID
 * @type number
 * @default 108
 * 
 * @param defaultTpbCost
 * @text 標準TPBコスト
 * @desc ノートタグ未指定時のTPBコスト値。
 * @type number
 * @default 1.00
 * @decimals 2
 * @min 0
 * @max 1
 * 
 * @param textTraitBlockTpbCastBreak
 * @text TPBブレーク防止特性名
 * @desc TPBブレーク防止特性名
 * @type string
 * @default ブレーク防止
 * 
 * @param textTraitBlockTpbLose
 * @text TPB減少効果防止
 * @desc TPB減少効果防止
 * @type string
 * @default 行動遅延防止
 * 
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
 * TPBゲージ周りを操作するメソッドを追加してあります。
 * Game_Battler.gainTpbChargeTime(value:number) : void
 *     TPBゲージをvalueだけ増減させる。
 * Game_Battler.gainTpbCastTime(value:number) : void
 *     TPBキャストゲージをvalueだけ増減させる。
 * Game_Battler.breakTpbCast() : void
 *     TPBキャストを解除する。
 * 
 * 効果をブロックするかどうかは上記メソッドの外で行います。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具/エネミー
 *   <blockTpbCastBreak>
 *      キャストブレーク特性を追加する。
 *   <blockTpbLose>
 *      TPBゲージ減少を防ぐ特性を追加する。
 * 
 * スキル/アイテム
 *   <gainTpbChargeTime:rate#,value#>
 *       TPBゲージを増減する効果を追加。成功率rate#
 *   <gainTpbChargeTime:value#>
 *       TPBゲージをvalue#増減する効果を追加。
 * 
 *   <gainTpbCastTime:rate#,value#>
 *       TPBキャスト時間をvalue#増減する効果を追加。成功率rate#
 *   <gainTpbCastTime:value#>
 *       TPBキャスト時間をvalue#増減する効果を追加。
 *   
 *   <breakTpbCast:rate#>
 *       キャストブレーク効果をrate#の割合で発動。
 *   <tpbCost:cost#>
 *       このスキル/アイテム使用時のTPB消費をcost#にする。
 *       cost#は0.0～1.0の範囲。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.3.0 Kapu_Base_ParamName に対応
 * Version.0.2.0 行動終了時のTPB減少量を指定できるようにした。
 * Version.0.1.0 作成した。
 */
(() => {
    const pluginName = "Kapu_TpbEffects";
    const parameters = PluginManager.parameters(pluginName);
    Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME = Number(parameters["chargeTimeGainEffectCode"]) || 0;
    Game_Action.EFFECT_GAIN_TPB_CAST_TIME = Number(parameters["castTimeGainEffectCode"]) || 0;
    Game_Action.EFFECT_BREAK_TPB_CASTING = Number(parameters["breakTpbCastEffectCode"]) || 0;
    Game_BattlerBase.FLAG_ID_BLOCK_TPB_CAST_BREAK = Number(parameters["blockBreakTpbCastFlagId"]) || 0;
    Game_BattlerBase.FLAG_ID_BLOCK_TPB_LOSE = Number(parameters["blockTpbLoseFlagId"]) || 0;
    const defaultTpbCost = (Number(parameters["defaultTpbCost"]) || 1.0);

    if (!Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME) {
        console.error(pluginName + ":EFFECT_GAIN_TPB_CHARGE_TIME is not valid.");
    }
    if (!Game_Action.EFFECT_GAIN_TPB_CAST_TIME) {
        console.error(pluginName + ":EFFECT_GAIN_TPB_CAST_TIME is not valid.");
    }
    if (!Game_Action.EFFECT_BREAK_TPB_CASTING) {
        console.error(pluginName + ":EFFECT_BREAK_TPB_CASTING is not valid.");
    }
    if (!Game_BattlerBase.FLAG_ID_BLOCK_TPB_CAST_BREAK) {
        console.error(pluginName + ":FLAG_ID_BLOCK_TPB_CAST_BREAK is not valid.");
    }
    if (!Game_BattlerBase.FLAG_ID_BLOCK_TPB_LOSE) {
        console.error(pluginName + ":FLAG_ID_BLOCK_TPB_LOSE is not valid.");
    }

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * ノートタグを処理する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        if (Game_BattlerBase.FLAG_ID_BLOCK_TPB_CAST_BREAK && obj.meta.blockTpbCastBreak) {
            obj.traits.push({ 
                code: Game_BattlerBase.TRAIT_SPECIAL_FLAG, 
                dataId: Game_BattlerBase.FLAG_ID_BLOCK_TPB_CAST_BREAK, 
                value: 0
            });
        }
        if (Game_BattlerBase.FLAG_ID_BLOCK_TPB_LOSE && obj.meta.blockTpbLose) {
            obj.traits.push({
                code: Game_BattlerBase.TRAIT_SPECIAL_FLAG,
                dataId: Game_BattlerBase.FLAG_ID_BLOCK_TPB_LOSE,
                value: 0
            });
        }
    };

    DataManager.addNotetagParserActors(_processNotetag);
    DataManager.addNotetagParserClasses(_processNotetag);
    DataManager.addNotetagParserWeapons(_processNotetag);
    DataManager.addNotetagParserArmors(_processNotetag);
    DataManager.addNotetagParserStates(_processNotetag);
    DataManager.addNotetagParserEnemies(_processNotetag);

    /**
     * strを解析し、レートを得る。
     * 
     * @param {string} str 文字列
     * @returns レートを得る。
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
     * @param {object} obj データオブジェクト。(DataItem/DataSkill)
     */
    const _processEffectNotetag = function(obj) {
        if (Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME && obj.meta.gainTpbChargeTime) {
            const values = obj.meta.gainTpbChargeTime.split(",").map(token => _getRate(token));
            const value1 = (values.length >= 2) ? values[0] : 1.0;
            const value2 = (values.length >= 2) ? values[1] : values[0];
            if (value2 !== 0) {
                obj.effects.push({
                    code: Game_Action.EFFECT_GAIN_TPB_CHARGE_TIME,
                    dataId:0,
                    value1:value1,
                    value2:value2
                });
            }
        }
        if (Game_Action.EFFECT_GAIN_TPB_CAST_TIME && obj.meta.gainTpbCastTime) {
            const values = obj.meta.gainTpbCastTime.split(",").map(token => _getRate(token));
            const value1 = (values.length >= 2) ? values[0] : 1.0;
            const value2 = (values.length >= 2) ? values[1] : values[0];
            if (value2 !== 0) {
                obj.effects.push({
                    code: Game_Action.EFFECT_GAIN_TPB_CAST_TIME,
                    dataId:0,
                    value1:value1,
                    value2:value2
                });
            }
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
    // TextManager
    if (TextManager._specialFlags && Game_BattlerBase.FLAG_ID_BLOCK_TPB_CAST_BREAK) {
        TextManager._specialFlags[Game_BattlerBase.FLAG_ID_BLOCK_TPB_CAST_BREAK] = parameters["textTraitBlockTpbCastBreak"] || "";
    }
    if (TextManager._specialFlags && Game_BattlerBase.FLAG_ID_BLOCK_TPB_LOSE) {
        TextManager._specialFlags[Game_BattlerBase.FLAG_ID_BLOCK_TPB_LOSE] = parameters["textTraitBlockTpbLose"] || "";
    }
    
    
    //------------------------------------------------------------------------------
    // Game_BattlerBase

    /**
     * スキルのTPBコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * @returns {number} TPBコスト
     */
    Game_BattlerBase.prototype.skillTpbCost = function(skill) {
        if (skill.meta.tpbCost) {
            return Math.max(0, (Number(skill.meta.tpbCost) || 0));
        } else {
            return this.defaultTpbCost();
        }
    };
    /**
     * TPBコストを得る。
     * 
     * @param {object} item 
     * @returns {number} TPBコスト(0～1)を得る。
     */
    Game_BattlerBase.prototype.tpbCost = function(item) {
        if (DataManager.isSkill(item)) {
            return this.skillTpbCost(item);
        } else if (DataManager.isItem(item)) {
            if (item.meta.tpbCost) {
                return Math.max(0, (Number(item.meta.tpbCost) || 0));
            } else {
                return defaultTpbCost;
            }
        } else {
            return defaultTpbCost;
        }
    };

    /**
     * デフォルトのTPBコストを得る。
     * 
     * @returns {number} デフォルトのTPBコスト
     */
    Game_BattlerBase.prototype.defaultTpbCost = function() {
        return defaultTpbCost;
    };
    //------------------------------------------------------------------------------
    // Game_Battler
    if (Game_BattlerBase.FLAG_ID_BLOCK_TPB_LOSE) {
        /**
         * TPB減少効果を防ぐかどうかを取得する。
         * 
         * @returns {boolean} TPB減少効果を防ぐ場合にはtrue, それ以外はfalse
         */
        Game_Battler.prototype.blockTpbLose = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_BLOCK_TPB_LOSE);
        };
    } else {
        /**
         * TPB減少効果を防ぐかどうかを取得する。
         * 
         * @returns {boolean} TPB減少効果を防ぐ場合にはtrue, それ以外はfalse
         */
        Game_Battler.prototype.blockTpbLose = function() {
            return false;
        };
    }
    if (Game_BattlerBase.FLAG_ID_BLOCK_TPB_CAST_BREAK) {
        /**
         * TPBキャストブレークを防ぐかどうかを取得する。
         * 
         * @returns {boolean} キャストブレークを防ぐ場合にはtrue, それ以外はfalse
         */
        Game_Battler.prototype.blockTpbCastBreak = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_BLOCK_TPB_CAST_BREAK);
        };
    } else {
        /**
         * TPBキャストブレークを防ぐかどうかを取得する。
         * 
         * @returns {boolean} キャストブレークを防ぐ場合にはtrue, それ以外はfalse
         */
        Game_Battler.prototype.blockTpbCastBreak = function() {
            return false;
        };
    }

    /**
     * TPBをvalueだけチャージする。
     * 1.0以上にすると行動が回ってくる。
     * チャージ中（キャストなどでない）場合にしか効果無い。
     * 
     * @param {number} value 値
     */
    Game_Battler.prototype.gainTpbChargeTime = function(value) {
        if (this.canMove() && this.isAlive() && (this._tpbState === "charging")) {
            const t = this._tpbChargeTime + value;
            this._tpbChargeTime = Math.max(0, t);
        }
    };
    
    /**
     * キャストタイムをvalueだけチャージする。
     * 
     * @param {number} value チャージ時間。
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
            this._tpbCastTime = 0;
            this._tpbState = "charging";
        }
    };
    const _Game_Battler_makeActions = Game_Battler.prototype.makeActions;
    /**
     * アクションを作成する。
     */
    Game_Battler.prototype.makeActions = function() {
        _Game_Battler_makeActions.call(this);
        this._tpbConsumeTime = 0;
    };

    const _Game_Battler_performActionStart = Game_Battler.prototype.performActionStart;
    /**
     * アクションを実行する。
     * 
     * @param {Game_Action} action 
     */
    Game_Battler.prototype.performActionStart = function(action) {
        _Game_Battler_performActionStart.call(this, action);
        this._tpbConsumeTime += this.tpbCost(action.item());
    };

    /**
     * TPBチャージタイムを消費する。
     * 
     * @param {number} time 消費するTPB時間
     */
    Game_Battler.prototype.consumeTpbChargeTime = function() {
        this._tpbState = "charging";
        this._tpbChargeTime = Math.max(0, this._tpbChargeTime - this._tpbConsumeTime);
        this._tpbConsumeTime = 0;
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
     * @returns {boolean} 適用可能な場合にはtrue, それ以外はfalse
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
        if ((effect.value2 < 0) && target.blockTpbLose()) {
            return;
        }
        let chance = effect.value1;
        if (!this.isCertainHit()) {
            chance *= this.lukEffectRate(target);
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
        if ((effect.value2 < 0) && target.blockTpbLose()) {
            return;
        }
        let chance = effect.value1;
        if (!this.isCertainHit()) {
            chance *= this.lukEffectRate(target);
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
        if (target.blockTpbCastBreak()) {
            return;
        }
        let chance = effect.value1;
        if (!this.isCertainHit()) {
            chance *= this.lukEffectRate(target);
        }
        if (Math.random() < chance) {
            target.breakTpbCast(effect.value2);
            this.makeSuccess(target);
        }
    };


    //------------------------------------------------------------------------------
    // BattleManager
    /**
     * 全てのアクションの終了処理をする。
     * 
     * Note: clearTpbChargeTime()をコールする代わりに、consumeTpbChargeTimeをコールするため、
     *       メソッドをオーバーライドする。
     * 
     * @param {Game_Battler} battler アクション使用者
     * !!!overwrite!!! BattleManager.endBattlerActions()
     */
    BattleManager.endBattlerActions = function(battler) {
        battler.setActionState(this.isTpb() ? "undecided" : "done");
        battler.onAllActionsEnd();
        battler.consumeTpbChargeTime();
        this.displayBattlerStatus(battler, true);
    };

})();
