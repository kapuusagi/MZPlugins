/*:ja
 * @target MZ 
 * @plugindesc 育成システム スキル習得プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * @base Kapu_Utility
 * @orderAfter kapu_Utility
 * 
 * @command addGpLearnableSkill
 * @text 習得可能スキル追加
 * @desc 指定アクターに習得可能スキルを追加する。
 * 
 * @arg actorId
 * @text アクターID
 * @desc アクターID
 * @type actor
 * 
 * @arg variableId
 * @text アクター指定（変数)
 * @desc アクターIDを格納した変数ID
 * @type variable
 * 
 * @arg skill
 * @text スキル
 * @desc 追加するスキル
 * @type skill
 * 
 * 
 * @param labelName
 * @text 習得アイテムラベル名
 * @desc 育成画面に表示する項目名。(%1にスキル名が入る)
 * @type string
 * @default %1を習得する。
 * 
 * @param effectCode
 * @text エフェクトコード
 * @desc スキル/アイテムの効果で、GP習得可能スキルを追加する効果に割り当てるコード値
 * @type number
 * @default 103
 * @min 45
 * 
 * @help 
 * GrowupSystemにて、スキル習得を可能にするためのプラグイン。
 * 
 * ■ 使用時の注意
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
 * アクター
 *     <gpLearnedSkills:id1#,id2$,...>
 *         初期状態でgpにより習得しているスキルのID列を指定する。
 *     <gpLearnableSkills:id1#,id2#,...>
 *         初期状態でgpにより習得可能なスキルのID列を指定する。
 * 
 * スキル
 *     <gpLearnable:condition$>
 *         習得条件評価式。アクターとして"a"が使用できる。
 *         他、以下のメソッドが使用可能。
 *         hasSkillType(id) : スキルタイプ id# が使用可能かどうか
 *         isLearned(id) : id#のスキルを習得しているかどうか
 *     <gpCost>
 *         習得に必要なGPコスト
 * スキル/アイテム
 *     <addGpLearn:id1#,id2#,...>
 *          使用するとGP習得可能スキルにid#で指定したスキルが追加される。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_GrowupSystem_Skills";
    const parameters = PluginManager.parameters(pluginName);
    const labelName = String(parameters["labelName"]) || "lean %1";
    Game_Action.EFFECT_ADD_GPLEARN_SKILL = Number(parameters["effectCode"]) || 0;

    if (!Game_Action.EFFECT_ADD_GPLEARN_SKILL) {
        console.error(pluginName + ":EFFECT_ADD_GPLEARN_SKILL is not valid.");
    }
    /**
     * アクターIDを得る。
     * 
     * @param {Object} args プラグインコマンド引数
     * @return {Number} アクターID
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
    PluginManager.registerCommand(pluginName, "addGpLearnableSkill", args => {
        const actorId = _getActorId(args);
        const skillId = Math.floor(Number(args.skill) || 0);
        if ((actorId > 0) || (skillId > 0)) {
            $gameActors.actor(actorId).addGpLearnableSkill(skillId);
        }
    });
    //------------------------------------------------------------------------------
    // DataManager

    /**
     * GP習得スキル追加効果を追加する。
     * 
     * @param {Object} obj データオブジェクト
     * @param {String} valueStr 値文字列
     */
    const _addGpLearnEffect = function(obj, valueStr) {
        const nums = valueStr.split(",").map(token => Math.floor((Number(token) || 0)));
        const ids = [];
        for (const num of nums) {
            if (!ids.includes(num)) {
                ids.push(num);
            }
        }
        for (const id of ids) {
            obj.effects.push({
                code: Game_Action.EFFECT_ADD_GPLEARN_SKILL,
                dataId: id,
                value1: 0,
                value2: 0
            });
        }
    };

    /**
     * ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processSkillNotetag = function(obj) {
        obj.gpCost = 0;
        if (obj.meta.gpCost) {
            obj.gpCost = Math.floor((Number(obj.meta.gpCost) || 0));
        }
        obj.gpLearnCondition = [];

        const patternGPLearnCondition = /<gpLearnable:(.+) ?>/;        
        for (const line in obj.note.split(/[\r\n]+/)) {
            let re;
            if ((re = line.match(patternGPLearnCondition)) !== null) {
                obj.gpLearnCondition.push(re[1]);
            }
        }
        if (Game_Action.EFFECT_ADD_GPLEARN_SKILL && obj.meta.addGpLearn) {
            _addGpLearnEffect(obj, obj.meta.addGpLearn);
        }
    };
    DataManager.addNotetagParserSkills(_processSkillNotetag);

    if (Game_Action.EFFECT_ADD_GPLEARN_SKILL) {
        /**
         * ノートタグを処理する。
         * 
         * @param {Object} obj データオブジェクト
         */
        const _processItemNotetag = function(obj) {
            if (obj.meta.addGpLearn) {
                _addGpLearnEffect(obj, obj.meta.addGpLearn);
            }
        };
        DataManager.addNotetagParserItems(_processItemNotetag);
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
        this._gpLearnedSkills = [];
        this._gpLearnableSkills = [];
    };
    // 2.Game_Actor.setupをフックし、ノートタグを解析して初期値を設定する処理を追加。
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        
        const actor = $dataActors[actorId];
        if (actor.meta.gpLearnedSkills) {
            const ids = actor.meta.gpLearnedSkills.split(",").map(token => Math.floor(Number(token)));
            for (const id of ids) {
                if ((id > 0) && !this.isLearnedSkill(id) && !this.isGpLearnedSkill(id)) {
                    this._gpLearnedSkills.push(id);
                }
            }
        }
        if (actor.meta.gpLearnableSkills) {
            const ids = actor.meta.gpLearnableSkills.split(",").map(token => Math.floor(Number(token)));
            for (const id of ids) {
                if ((id > 0) && !this.isLearnedSkill(id) && !this.isGpLearnedSkill(id)
                        && !this.isGpLearnableSkill(id)) {
                    this._gpLearnableSkills.push(id);
                }
            }
            this._gpLearnableSkills.sort((a, b) => a - b);
        }
        this.updateGpLearnableSkills();
    };

    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    /**
     * レベルアップ処理をする。
     */
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);
        this.updateGpLearnableSkills();
    };
    /**
     * このアクターが習得可能なスキルを更新する。
     */
    Game_Actor.prototype.updateGpLearnableSkills = function() {
        for (var skillId = 1; skillId < $dataSkills.length; skillId++) {
            var skill = $dataSkills[skillId];
            if (skill.name.length == 0) {
                continue; // 名前なしスキルは無視。
            }
            if (this.isLearnedSkill(skillId) || this.isGpLearnableSkill(skillId)) {
                continue; // 習得済み、習得可能登録済みスキル。
            }
            if (this.testGpLearnable(skill)) {
                // 習得可能
                this._gpLearnableSkills.push(skillId);
            }
        }
        this._gpLearnableSkills.sort(function (a, b) {
            return a - b;
        });
    };

    /**
     * skillが習得可能かどうかを判定する。
     * 
     * @param {Game_Skill} スキル
     * @return 習得可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.testGpLearnable = function(skill) {
        if (skill.name.length === 0) {
            return false;
        }
        if (skill.gpLearnCondition.length > 0) {
            // eslint-disable-next-line no-unused-vars
            const a = this; // conditionの判定で使用。
            const hasSkillType = (type) => this.skillTypes().includes(type);
            const isLearned = (id) => this.isLearnedSkill(id);

            try {
                return skill.gpLearnCondition.some((condition) => eval(condition))
            } catch (e) {
                return false;
            }
        } else {
            return (skill.gpCost > 0); // 条件未指定の場合にはgpCostが0以上かどうかだけ見る。
        }
    };



    /**
     * 習得済みスキルかどうかを判定する。
     * 
     * @param {Number} skillId スキルID
     * @return {Boolean} GPにて習得済みのスキルである場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isGpLearnedSkill = function (skillId) {
        return this._gpLearendSkills.includes(skillId);
    };

    /**
     * GP消費で習得可能スキルかどうかを判定する。
     * 
     * @param {Number} skillId スキルID
     * @return {Boolean} GP消費で習得可能なスキルの場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isGpLearnableSkill = function (skillId) {
        return this._gpLearnableSkills.contains(skillId);
    };

    /**
     * 習得可能スキルを追加する。
     * 
     * @param {Number} skillId スキルID
     * @return {Boolean} 追加された場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.addGpLearnableSkill = function(skillId) {
        if (!this.isGpLearnedSkill(skillId) && !this.isGpLearnableSkill(skillId)) {
            // 未習得のスキル
            this._gpLearnableSkills.push(skillId);
            this._gpLearnableSkills.sort((a, b) => a - b);
            return true;
        } else {
            return false;
        }
    };
    // 3.育成データを反映する場所を追加。
    /**
     * GrowPointを消費してスキルを習得する。
     * 
     * @param skillId スキルID
     */
    Game_Actor.prototype.learnSkillByGp = function(skillId) {
        if (this.isLearnedSkill(skillId)) {
            return; // 習得済み
        }
        if (!this.isGpLearnableSkill(skillId)) {
            return; // このアクターの習得可能リストにない。
        }
        // 該当エントリを習得可能リストから削除
        const index = this._gpLearnableSkills.indexOf(skillId);
        this._gpLearnableSkills.splice(index, 1);
        // 該当エントリをGP習得リストに追加
        this._gpLearnedSkills.push(skillId);
        // スキル習得
        this.learnSkill(skillId);
    };

    // 4.Game_Actor.resetGrowsをフックし、育成リセットを追加。
    const _Game_Actor_resetGrows = Game_Actor.prototype.resetGrows;
    /**
     * 成長リセットする。
     */
    Game_Actor.prototype.resetGrows = function() {
        _Game_Actor_resetGrows.call(this);

        for (const id of this._gpLearnedSkills) {
            this._gpLearnableSkills.push(id);
            this.forgetSkill(id);
        }
        this._gpLearnedSkills = [];
        this._gpLearnableSkills.sort((a, b) => a - b);
    };
    // 5.Game_Actor.growupItemsをフックし、育成項目を返す処理を追加
    const _Game_Actor_growupItems = Game_Actor.prototype.growupItems;
    /**
     * 育成項目を返す。
     * 
     * @return {Array<GrowupItem>} 育成項目
     */
    Game_Actor.prototype.growupItems = function() {
        const items = _Game_Actor_growupItems.call(this);
        for (const id of this._gpLearnableSkills) {
            const skill = $dataSkills[id];
            items.push({
                iconIndex : skill.iconIndex,
                name : labelName.format(skill.name),
                type : "skill",
                id : id,
                cost : skill.gpCost,
                description : skill.description
            });
        }

        return items;
    };
    // 6.Game_Actor.applyGrowupをフックし、育成適用処理を追加。
    const _Game_Actor_applyGrowup = Game_Actor.prototype.applyGrowup;
    /**
     * 育成項目を適用する。
     * 
     * @param {GrowupItem} growupItem 育成項目
     * @return {Boolean} 適用できたかどうか。
     */
    Game_Actor.prototype.applyGrowup = function(growupItem) {
        if (growupItem.type === "skill") {
            const skillId = growupItem.id;
            return this.learnSkillByGp(skillId);
        } else {
            return _Game_Actor_applyGrowup.call(this, growupItem);
        }
    };

    //------------------------------------------------------------------------------
    // Game_Action
    if (!Game_Action.EFFECT_ADD_GPLEARN_SKILL) {
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
            if (effect.code == Game_Action.EFFECT_ADD_GPLEARN_SKILL) {
                const id = effect.dataId;
                // アクターかつ、習得済み、習得可能スキルにない。
                return (target.isActor() && !target.isLearnedSkill(id) && !target.isGpLearnableSkill(id));
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
            if (effect.code === Game_Action.EFFECT_ADD_GPLEARN_SKILL) {
                this.applyItemEffectAddGpLearnSkill(target, effect);
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
        Game_Action.prototype.applyItemEffectAddGpLearnSkill = function(target, effect) {
            if (target.isActor()) {
                const id = effect.dataId;
                if (target.addGpLearnableSkill(id)) {
                    this.makeSuccess(target);
                }
            }
        };
    }

})();