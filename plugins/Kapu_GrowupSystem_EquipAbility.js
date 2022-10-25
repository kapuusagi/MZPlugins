/*:ja
 * @target MZ 
 * @plugindesc 成長システムに装備アビリティを追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * @base Kapu_EquipAbility
 * @orderAfter Kapu\EquipAbility
 * 
 * @command addGpLearnableAbility
 * @text 習得可能アビリティ追加
 * @desc 指定アクターに習得可能アビリティを追加する。
 * 
 * @arg actorId
 * @text アクターID
 * @desc アクターID
 * @type actor
 * @default 0
 * 
 * @arg variableId
 * @text アクター指定（変数)
 * @desc アクターIDを格納した変数ID
 * @type variable
 * @default 0
 * 
 * @arg ability
 * @text アビリティ
 * @desc 追加するアビリティ
 * @type armor
 * @default 0
 * 
 * @param labelName
 * @text 習得アイテムラベル名
 * @desc 育成画面に表示する項目名。(%1にアビリティ名が入る)
 * @type string
 * @default %1を習得する。
 * 
 * @param effectCode
 * @text エフェクトコード
 * @desc アイテムの効果で、GP習得可能アビリティを追加する効果に割り当てるコード値
 * @type number
 * @default 112
 * @min 45
 * 
 * 
 * @help 
 * 成長システムに装備アビリティを追加します。
 * 育成ポイントを使用して装備アビリティを習得し、
 * 習得した装備アビリティを装備画面で付け替えるようにできます。
 * 
 * 習得可能アビリティは以下のいずれかの方法でアクター単位に追加されます。
 * ・レベルアップ時、現在のクラスに設定されたレベルに対応した習得可能アビリティ
 *   レベルアップしたレベル以下全てが対象になります。
 * ・アイテム使用。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 習得可能アビリティ追加
 *   指定アクターに、GP習得可能なアビリティとして指定したものを追加する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <gpLearnedAbilities:id1#,id2$,...>
 *       初期状態でgpにより習得しているアビリティのID列を指定する。
 *   <gpLearnableAbilities:id1#,id2#,...>
 *       初期状態でgpにより習得可能なアビリティのID列を指定する。
 * 
 * クラス
 *   <addGpLearnAbility:level#,abilityId#,abilityId#,...>
 *     level#に到達したとき、abilityId#で指定したアビリティを習得可能にする。
 * 
 * アーマー
 *   <gpCost>
 *       習得に必要なGPコスト
 * 
 * アイテム
 *   <addGpLearnAbility:id1#,id2#,...>
 *        使用するとGP習得可能アビリティにid#で指定したアビリティが追加される。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    'use strict';
    const pluginName = "Kapu_GrowupSystem_EquipAbility";
    const parameters = PluginManager.parameters(pluginName);

    const labelName = parameters["labelName"] || "lean %1";
    Game_Action.EFFECT_ADD_GPLEARN_ABILITY = Number(parameters["effectCode"]) || 0;
    if (!Game_Action.EFFECT_ADD_GPLEARN_ABILITY) {
        console.error(pluginName + ":EFFECT_ADD_GPLEARN_ABILITY is not valid.");
    }

    PluginManager.registerCommand(pluginName, "addGpLearnableAbility", args => {
        const actorVariableId = Number(args.variableId) || 0;
        const actorId = (actorVariableId > 0)
            ? $gameVariables.value(actorVariableId)
            : (Number(args.actorId) || 0);
        const abilityId = Math.floor(Number(args.ability) || 0);
        if ((actorId > 0) || DataManager.isAbilityId(abilityId)) {
            $gameActors.actor(actorId).addGpLearnableAbility(abilityId);
        }
    });


    //------------------------------------------------------------------------------
    // DataManager
    /**
     * クラスのノートタグを処理する。
     * 
     * @param {object} obj データオブジェクト
     */
    const _processClassNotetag = function(obj) {
        const regExp = /<addGpLearnAbility:([^>]*)>/g;
        obj.gpLearnableAbilities = [];
        for (;;) {
            const match = regExp.exec(obj.note);
            if (match) {
                const ids = match[1].split(",").map(token => Number(token) || 0);
                if ((ids.length >= 2) && (ids[0] > 0)) {
                    const level = ids[0];
                    for (let i = 1; i < ids.length; i++) {
                        const id = ids[i];
                        if (DataManager.isAbilityId(id)) {
                            obj.gpLearnableAbilities.push({ level:level, abilityId:id });
                        }
                    }
                }
            } else {
                break;
            }
        }
    };

    DataManager.addNotetagParserClasses(_processClassNotetag);

    if (Game_Action.EFFECT_ADD_GPLEARN_ABILITY) {
        /**
         * GP習得アビリティ追加効果を追加する。
         * 
         * @param {object} obj データオブジェクト
         * @param {string} valueStr 値文字列
         */
        const _addGpLearnEffect = function(obj, valueStr) {
            const nums = valueStr.split(",").map(token => Math.floor((Number(token) || 0)));
            const ids = [];
            for (const num of nums) {
                if (DataManager.isAbilityId(num) && !ids.includes(num)) {
                    ids.push(num);
                }
            }
            for (const id of ids) {
                obj.effects.push({
                    code: Game_Action.EFFECT_ADD_GPLEARN_ABILITY,
                    dataId: id,
                    value1: 0,
                    value2: 0
                });
            }
        };

        /**
         * ノートタグを処理する。
         * 
         * @param {object} obj データオブジェクト
         */
        const _processItemNotetag = function(obj) {
            if (obj.meta.addGpLearnAbility) {
                _addGpLearnEffect(obj, obj.meta.addGpLearnAbility);
            }
        };
        DataManager.addNotetagParserItems(_processItemNotetag);

        /**
         * ノートタグを処理する。
         * 
         * @param {object} obj データオブジェクト
         */
        const _processArmorNotetag = function(obj) {
            if (obj.meta.gpCost) {
                obj.gpCost = Number(obj.meta.gpCost) || 0;
            }
        };
        DataManager.addNotetagParserArmors(_processArmorNotetag);
    }
    //------------------------------------------------------------------------------
    // Game_Actor
    // 1.Game_Actor.initMembersをフックして育成データを格納する場所を追加。
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._gpLearnedAbilities = [];
        this._gpLearnableAbilities = [];
    };
    // 2.Game_Actor.initAbilitiesをフックし、ノートタグを解析して初期値を設定する処理を追加。
    //   initAbilirtiesはKapu_EquipAbilityで定義されている。
    const _Game_Actor_initAbilities = Game_Actor.prototype.initAbilities;
    /**
     * アビリティを初期化する。
     */
    Game_Actor.prototype.initAbilities = function()  {
        _Game_Actor_initAbilities.call(this);
        const actor = this.actor();
        if (actor.meta.gpLearnedAbilities) {
            const ids = actor.meta.gpLearnedAbilities.split(",").map(token => Math.floor(Number(token)));
            for (const id of ids) {
                if (DataManager.isAbilityId(id) && !this.isLearnedAbility(id) && !this.isGpLearnedAbility(id)) {
                    this._gpLearnedAbilities.push(id);
                    this.learnAbility(id);
                }
            }
        }
        if (actor.meta.gpLearnableAbilities) {
            const ids = actor.meta.gpLearnableAbilities.split(",").map(token => Math.floor(Number(token)));
            for (const id of ids) {
                if (DataManager.isAbilityId(id) && !this.isLearnedAbility(id) && !this.isGpLearnedAbility(id)
                        && !this.isGpLearnableAbility(id)) {
                    this._gpLearnableAbilities.push(id);
                }
            }
            this._gpLearnableAbilities.sort((a, b) => a - b);
        }
        this.updateGpLearnableAbilities();
    };

    // 3.Game_Actor.usedGrowupPointをフックし、使用済みGP値の計算を追加。
    const _Game_Actor_usedGrowupPoint = Game_Actor.prototype.usedGrowupPoint;
    /**
     * 使用済みGrowPointを得る。
     * 
     * @returns {number} 使用済み育成ポイント。
     */
    Game_Actor.prototype.usedGrowupPoint = function() {
        let usedPoint = _Game_Actor_usedGrowupPoint.call(this);
        for (const abilityId of this._gpLearnedAbilities) {
            const ability = $dataArmors[abilityId];
            if (ability) {
                usedPoint += ability.gpCost;
            }
        }

        return usedPoint;
    };

    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    /**
     * レベルアップ処理をする。
     */
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);

        this.updateGpLearnableAbilities();
    };
    /**
     * このアクターが習得可能なアビリティを更新する。
     * 現在のクラスで、現在のレベル以下で習得可能なアビリティを全て追加する。
     */
    Game_Actor.prototype.updateGpLearnableAbilities = function() {
        for (const learningAbility of this.currentClass().gpLearnableAbilities) {
            if (learningAbility.level <= this._level) {
                this.addGpLearnableAbility(learningAbility.abilityId);
            }
        }
    };

    /**
     * 習得済みアビリティかどうかを判定する。
     * 
     * @param {number} abilityId アビリティID
     * @returns {boolean} GPにて習得済みのアビリティである場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isGpLearnedAbility = function (abilityId) {
        return this._gpLearnedAbilities.includes(abilityId);
    };
    /**
     * GP消費で習得可能アビリティかどうかを判定する。
     * 
     * @param {number} abilityId アビリティID
     * @returns {boolean} GP消費で習得可能なアビリティの場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isGpLearnableAbility = function (abilityId) {
        return this._gpLearnableAbilities.includes(abilityId);
    };
    /**
     * 習得可能アビリティを追加する。
     * 
     * @param {number} abilityId アビリティID
     * @returns {boolean} 追加された場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.addGpLearnableAbility = function(abilityId) {
        if (!this.isGpLearnedAbility(abilityId) // GP習得済みアビリティでない？
                && !this.isGpLearnableAbility(abilityId)) { // GPで習得可能アビリティでない？
            this._gpLearnableAbilities.push(abilityId);
            this._gpLearnableAbilities.sort((a, b) => a - b);
            return true;
        } else {
            return false;
        }
    };

    // 4.育成データを反映する場所を追加。
    /**
     * GrowPointを消費してアビリティを習得する。
     * 
     * @param abilityId アビリティID
     */
    Game_Actor.prototype.learnAbilityByGp = function(abilityId) {
        // 該当エントリを習得可能リストから削除
        const index = this._gpLearnableAbilities.indexOf(abilityId);
        if (index >= 0) {
            this._gpLearnableAbilities.splice(index, 1);
            // 該当エントリをGP習得リストに追加
            this._gpLearnedAbilities.push(abilityId);
            // アビリティ習得
            this.learnAbility(abilityId);
        }
    };
    // 5.Game_Actor.resetGrowsをフックし、育成リセットを追加。
    const _Game_Actor_resetGrows = Game_Actor.prototype.resetGrows;
    /**
     * 成長リセットする。
     */
    Game_Actor.prototype.resetGrows = function() {
        _Game_Actor_resetGrows.call(this);

        for (const id of this._gpLearnedAbilities) {
            this._gpLearnableAbilities.push(id);
            this.forgetAbility(id);
        }
        this._gpLearnedAbilities = [];
        this._gpLearnableAbilities.sort((a, b) => a - b);
    };
    // 6.Game_Actor.growupItemsをフックし、育成項目を返す処理を追加
    const _Game_Actor_growupItems = Game_Actor.prototype.growupItems;
    /**
     * 育成項目を返す。
     * 
     * @returns {Array<GrowupItem>} 育成項目
     */
    Game_Actor.prototype.growupItems = function() {
        // 処理重いかも。
        const items = _Game_Actor_growupItems.call(this);
        for (const id of this._gpLearnableAbilities) {
            if (DataManager.isAbilityId(id)) {
                const ability = $dataArmors[id];
                items.push({
                    iconIndex : ability.iconIndex,
                    name : labelName.format(ability.name),
                    type : "ability",
                    id : id,
                    cost : ability.gpCost,
                    description : ability.description
                });
            }
        }

        return items;
    };
    // 7.Game_Actor.applyGrowupをフックし、育成適用処理を追加。
    const _Game_Actor_applyGrowup = Game_Actor.prototype.applyGrowup;
    /**
     * 育成項目を適用する。
     * 
     * @param {GrowupItem} growupItem 育成項目
     * @returns {boolean} 適用できたかどうか。
     */
    Game_Actor.prototype.applyGrowup = function(growupItem) {
        if (growupItem.type === "ability") {
            const abilityId = growupItem.id;
            this.learnAbilityByGp(abilityId);
            return true;
        } else {
            return _Game_Actor_applyGrowup.call(this, growupItem);
        }
    };

    //------------------------------------------------------------------------------
    // Game_Action
    if (Game_Action.EFFECT_ADD_GPLEARN_ABILITY) {
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
            if (effect.code == Game_Action.EFFECT_ADD_GPLEARN_ABILITY) {
                const id = effect.dataId;
                return (target.isActor() // アクター？
                    && !target.isLearnedAbility(id) // 習得済みアビリティでない？
                    && !target.isGpLearnableAbility(id)); // GP習得可能アビリティでない？
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
            if (effect.code === Game_Action.EFFECT_ADD_GPLEARN_ABILITY) {
                this.applyItemEffectAddGpLearnAbility(target, effect);
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
        Game_Action.prototype.applyItemEffectAddGpLearnAbility = function(target, effect) {
            if (target.isActor()) {
                const id = effect.dataId;
                if (target.addGpLearnableAbility(id)) {
                    this.makeSuccess(target);
                }
            }
        };
    }
})();