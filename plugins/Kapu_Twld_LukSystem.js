/*:ja
 * @target MZ 
 * @plugindesc TWLD向けLUKシステム。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command updateLuk
 * @text LUK更新
 * @desc LUKを更新する。
 * 
 * @arg target
 * @text 対象
 * @desc 更新する対象
 * @type select
 * @option 特定のアクター（ID指定）
 * @value actorId
 * @option 特定のアクター(変数指定)
 * @value variableId
 * @option 戦闘メンバー
 * @value battleMembers
 * @option パーティーメンバー
 * @value partyMembers
 * @option 全アクター
 * @value allActors
 * 
 * @arg actorId
 * @text アクターID
 * @desc 対象のアクターID
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 対象のアクターID（変数指定）
 * @type variable
 * 
 * @arg min
 * @text 下限値（省略可)
 * @desc 変動させる下限値
 * @type number
 * @min -100
 * @max 100
 * 
 * @arg max
 * @text 上限値（省略可)
 * @desc 変動させる上限値
 * @type number
 * @min -100
 * @max 100
 * 
 * @param effectCode
 * @text エフェクトコード
 * @desc LUK更新のエフェクトコードとして割り当てる値
 * @type number
 * @default 1002
 * 
 * @help 
 * TWLD向けに作成したLUKシステム。
 * LUKは0～100の値を持ち、ランダムで変動するようになります。
 * アクターのステータスは<lukBase>で指定したものに、
 * この変動値を加算値になります。
 * 変動のタイミングはレベルアップ、もしくは更新効果がある
 * アイテムまたはスキルが使用されたときになります。
 * 明示的にプラグインコマンド updateLuk を使用し、
 * LUKを更新することもできます。
 * 
 * ■ 使用時の注意
 * プロパティ luk がオーバーライドされます。
 * 
 * ■ プラグイン開発者向け
 * 特になし
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * updateLuk
 *     指定したターゲットのLUKを更新する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *     <lukBase:value#>
 *         LUKの基本値をvalueにする。
 * エネミー
 *     <lukBase:value#>
 *         LUKの基本値をvalueにする。
 *     <lukVariance:value#>
 *         LUKの加算値として±valueとする。
 * 
 * アイテム/スキル
 *     <updateLuk:min#,max#>
 *         LUKを、min～maxだけ変動させる。
 *         min/max未指定時は既定の変動量になる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成した。
 */
(() => {
    const pluginName = "Kapu_Twld_LukSystem";
    const parameters = PluginManager.parameters(pluginName);

    Game_Action.EFFECT_UPDATE_LUK = Number(parameters["effectCode"]) || 0;
    if (!Game_Action.EFFECT_UPDATE_LUK) {
        console.error(pluginName + ":EFFECT_UPDATE_LUK is not valid.");
    }

    const _getTargets = function(arg) {
        if (arg.target === "actorId") {
            const actorId = Number(arg.actorId) || 0;
            if (actorId) {
                return [$gameActors.actor(actorId)];
            }
        } else if (arg.target === "variableId") {
            const variableId = Number(arg.variableId) || 0;
            if (variableId > 0) {
                const id = $gameVariables.value(variableId);
                const actor = $gameActors.actor(id);
                if (actor) {
                    return [actor];
                }
            }
        } else if (arg.target === "battleMembers") {
            return $gameParty.battleMembers();
        } else if (arg.target === "partyMembers") {
            return $gameParty.allMembers();
        } else if (arg.target === "allActors") {
            const targets = [];
            // インスタンスが生成されているターゲットだけ対象にする。
            for (const actor of $gameActors._data) {
                if (actor) {
                    targets.push(actor);
                }
            }

            return targets;
        }
        return [];
    };

    PluginManager.registerCommand(pluginName, "updateLuk", args => {
        const targets = _getTargets(args);
        const min = Number(args.min) || undefined;
        const max = Number(args.max) || undefined;
        for (const target of targets) {
            target.updateLuk(min, max);            
        }
    });

    //------------------------------------------------------------------------------
    // DataManager
    if (Game_Action.EFFECT_UPDATE_LUK) {
        /**
         * ノートタグを処理する。
         * 
         * @param {Object} obj データオブジェクト。(DataItem/DataSkill)
         */
        const _processNotetag = function(obj) {
            if (!obj.meta.updateLuk) {
                return;
            }
            const values = obj.meta.updateLuk.split(",").map(token => Math.floor(Number(token)));
            if ((values.length === 2) && !isNaN(values[0]) && !isNaN(values[1])) {
                const min = Math.min(values[0], values[1]);
                const max = Math.max(values[0], values[1]);
                if ((max - min) > 0) {
                    obj.effects.push({
                        code: Game_Action.EFFECT_UPDATE_LUK,
                        dataId: 1,
                        value1: min,
                        value2: max
                    });
                }
            } else {
                obj.effects.push({
                    code: Game_Action.EFFECT_UPDATE_LUK,
                    dataId: 0,
                    value1: 0,
                    value2: 0
                })
            }
        };

        DataManager.addNotetagParserSkills(_processNotetag);
        DataManager.addNotetagParserItems(_processNotetag);
    }

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    /**
     * Game_BattlerBaseのパラメータを初期化する。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._luk = { base:50, variance:0 };
    };
    /**
     * LUK値を得る。
     * 
     * @constant {Number}
     */
    Object.defineProperty(Game_BattlerBase.prototype, "luk", {
        /** @returns {Number} */
        get: function() { return this.getLuk(); },
        configurable:true,
    });

    const _Game_BattlerBase_param = Game_BattlerBase.prototype.param;
    /**
     * パラメータを得る。
     * 
     * @param {Number} paramId パラメータID
     */
    Game_BattlerBase.prototype.param = function(paramId) {
        if (paramId === 7) {
            return this.getLuk();
        } else {
            return _Game_BattlerBase_param.call(this, paramId);
        }
    };

    const _Game_BattlerBase_paramBasePlus = Game_BattlerBase.prototype.paramBasePlus;
    /**
     * ベース値を得る。
     * バフやステートの特性による変動を除外した値を指す。
     * 既定の実装では以下の通り。
     * 
     * @param {Number} paramId パラメータID
     */
    Game_BattlerBase.prototype.paramBasePlus = function(paramId) {
        if (paramId === 7) {
            return this.getLuk();
        } else {
            return _Game_BattlerBase_paramBasePlus.call(this, paramId);
        }
    };    

    /**
     * LUK値を得る。
     * 
     * @returns {Number} LUK値
     */
    Game_BattlerBase.prototype.getLuk = function() {
        const baseValue = this._luk.base + this._luk.variance + this.getLukPlus();
        // バフによる加算は±25まで。
        const buffPlus = (Math.floor(25 * this.paramBuffRate(7)) - 25).clamp(-25, 25);
        const value = Math.floor(baseValue + buffPlus);
        return value.clamp(0, 100);
    };
    /**
     * LUKの加算値を得る。
     * 
     * @returns {Number} 加算値
     */
    Game_BattlerBase.prototype.getLukPlus = function() {
        return 0;
    };
    /**
     * LUK値を更新する。
     * 未指定時、現在LUK変動値が低いほど上がりやすくなり、高いほど低くなりやすくなる。
     * 
     * @param {Number} min 補正最小値(省略可) 省略時は変動量を1/10した値。
     * @param {Number} max 補正最大値(省略可) 省略時はmin+10の値
     */
    Game_BattlerBase.prototype.updateLuk = function(min, max) {
        if ((typeof(min) === "undefined") || isNaN(min)) {
            min = (-5 - Math.floor(this._luk.variance / 10));
        }
        if ((typeof(max) === "undefined") || isNaN(max)) {
            max = min + 10;
        }
        const variance = max - min;
        const correct = Math.randomInt(variance + 1) + min;
        if (correct !== 0) {
            this._luk.variance += correct;
            this.refresh();
        }
    };

    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const actor = $dataActors[actorId];
        if (actor.meta.lukBase) {
            this._luk.base = Math.floor((Number(enemy.meta.lukBase) || 0));
        }
        this.updateLuk();
    };
    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    /**
     * レベルアップ処理をする。
     */
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);
        this.updateLuk();
    };
    /**
     * LUKの加算値を得る。
     * 
     * @returns {Number} 加算値
     */
    Game_Actor.prototype.getLukPlus = function() {
        const equips = this.equips();
        return equips.reduce((r, equipItem) => (equipItem) ? r + equipItem.params[7] : r, 0);
    };
    //------------------------------------------------------------------------------
    // Game_Enemy
    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    /**
     * エネミーをセットアップする。
     * 
     * @param {Number} enemyId エネミーID
     * @param {Number} x X位置
     * @param {Number} y Y位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        const enemy = $dataEnemies[enemyId];
        if (enemy.meta.lukBase) {
            this._luk.base = Math.floor((Number(enemy.meta.lukBase) || 0));
        }
        if (enemy.meta.lukVariance) {
            const variance = Math.floor((Number(enemy.meta.lukVariance) || 0));
            this._luk.variance = Math.randomInt(variance * 2 + 1) - variance;
        }
    };


    /**
     * LUK値を得る。
     * 
     * @returns {Number} LUK値
     */
    Game_Enemy.prototype.getLuk = function() {
        return this._luk;
    };
    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * LUKの差分による確率上昇効果を得る。
     * LUK値は0～100なので、1ポイント差分による影響度を上げ、対象より1多い毎に0.5%差が出る。。
     * 
     * @param {Game_Battler} target 対象
     * @returns {Number} 確率上昇効果
     * !!!overwrite!!!
     */
    Game_Action.prototype.lukEffectRate = function(target) {
        return Math.max(0.0, 1.0 + (this.subject().luk - target.luk) * 0.005);
    };

    if (Game_Action.EFFECT_GAIN_GROWPOINT) {
        const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
        /**
         * 効果を適用する。
         * 
         * @param {Game_Battler} target ターゲット
         * @param {DataEffect} effect エフェクトデータ
         */
        Game_Action.prototype.applyItemEffect = function(target, effect) {
            if (effect.code === Game_Action.EFFECT_UPDATE_LUK) {
                this.applyItemEffectUpdateLuk(target, effect);
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
        Game_Action.prototype.applyItemEffectUpdateLuk = function(target, effect) {
            if (effect.dataId === 0) {
                // 既定の範囲で更新
                target.updateLuk();
            } else {
                // value1～value2の範囲で変動
                target.updateLuk(effect.value1, effect.value2);
            }
            this.makeSuccess(target);
        };
    }
})();