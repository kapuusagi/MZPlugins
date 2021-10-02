/*:ja
 * @target MZ 
 * @plugindesc 育成システム スキル習得プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
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
 *   <gpLearnedSkills:id1#,id2$,...>
 *       初期状態でgpにより習得しているスキルのID列を指定する。
 *   <gpLearnableSkills:id1#,id2#,...>
 *       初期状態でgpにより習得可能なスキルのID列を指定する。
 * 
 * クラス
 *   <addGpLearn:level#,skillId#,skillId#,...>
 *      level#に達したとき、skillId#のアビリティをGPで習得可能にする。
 *      複数指定可。詳細な習得可能条件は設定できない。
 *  
 * スキル
 *   <gpLearnable:condition$>
 *       習得条件評価式。アクターとして"a"が使用できる。
 *       他、以下のメソッドが使用可能。
 *       hasSkillType(id) : スキルタイプ id# が使用可能かどうか
 *       isLearned(id) : id#のスキルを習得しているかどうか
 *       hasItem(id) : アイテム id# を持っているかどうか。
 *                     習得しても消費されはしない。
 *       hasWeapon(id) : 武器 id# を持っているかどうか。
 *       hasArmor(id) : 防具 id# を持っているかどうか。
 *       1つのスキルに複数指定可で、複数指定した場合、どれか1つを満たした場合に習得可能スキルに追加される。
 *   <gpCost>
 *       習得に必要なGPコスト
 *   <keepOnResetGrown>
 *       育成リセット時に習得可能スキルとして維持するかどうか。
 * スキル/アイテム
 *   <addGpLearn:id1#,id2#,...>
 *        使用するとGP習得可能スキルにid#で指定したスキルが追加される。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.3.0 クラスに<addGpLearn>ノートタグを追加し、
 *               単純にレベルアップでGP習得可能スキルを登録する仕組みを用意した。
 * Version.0.2.0 GrowupSystem Version.0.3.0に対応した。
 *               ノートタグで習得済みスキルが正しく処理されていない不具合を修正した。
 * Version.0.1.0 TWLD向けに作成したものをベースに作成。
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
     * @param {object} args プラグインコマンド引数
     * @returns {number} アクターID
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
     * クラスのノートタグを処理する。
     * 
     * @param {object} obj データオブジェクト
     */
    const _processClassNotetag = function(obj) {
        const regExp = /<addGpLearn:([^>]*)>/g;
        obj.gpLearnableSkills = [];
        for (;;) {
            const match = regExp.exec(obj.note);
            if (match) {
                const ids = match[1].split(",").map(token => Number(token) || 0);
                if ((ids.length >= 2) && (ids[0] > 0)) {
                    const level = ids[0];
                    for (let i = 1; i < ids.length; i++) {
                        const id = ids[i];
                        obj.gpLearnableSkills.push({ level:level, skillId:id });
                    }
                }
            } else {
                break;
            }
        }

    };

    DataManager.addNotetagParserClasses(_processClassNotetag);

    /**
     * GP習得スキル追加効果を追加する。
     * 
     * @param {object} obj データオブジェクト
     * @param {string} valueStr 値文字列
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
     * @param {object} obj データオブジェクト
     */
    const _processSkillNotetag = function(obj) {
        obj.gpCost = 0;
        if (obj.meta.gpCost) {
            obj.gpCost = Math.floor((Number(obj.meta.gpCost) || 0));
        }
        obj.gpLearnCondition = [];

        const patternGPLearnCondition = /<gpLearnable:(.+) ?>/;  
        for (const line of obj.note.split(/[\r\n]+/)) {
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
         * @param {object} obj データオブジェクト
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
    // 2.Game_Actor.initSkillsをフックし、ノートタグを解析して初期値を設定する処理を追加。
    const _Game_Actor_initSkills = Game_Actor.prototype.initSkills;
    /**
     * スキルを初期化する。
     */
    Game_Actor.prototype.initSkills = function() {
        _Game_Actor_initSkills.call(this);

        const actor = this.actor();
        if (actor.meta.gpLearnedSkills) {
            const ids = actor.meta.gpLearnedSkills.split(",").map(token => Math.floor(Number(token)));
            for (const id of ids) {
                if ((id > 0) && (id < $dataSkills.length) && !this.isLearnedSkill(id) && !this.isGpLearnedSkill(id)) {
                    this._gpLearnedSkills.push(id);
                    this.learnSkill(id);
                }
            }
        }
        if (actor.meta.gpLearnableSkills) {
            const ids = actor.meta.gpLearnableSkills.split(",").map(token => Math.floor(Number(token)));
            for (const id of ids) {
                if ((id > 0) && (id < $dataSkills.length) && !this.isLearnedSkill(id) && !this.isGpLearnedSkill(id)
                        && !this.isGpLearnableSkill(id)) {
                    this._gpLearnableSkills.push(id);
                }
            }
            this._gpLearnableSkills.sort((a, b) => a - b);
        }
        this.updateGpLearnableSkills();
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
        for (const skillId of this._gpLearnedSkills) {
            const skill = $dataSkills[skillId];
            usedPoint += skill.gpCost;
        }

        return usedPoint;
    };

    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    /**
     * レベルアップ処理をする。
     */
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);
        for (const learningSkill of this.currentClass().gpLearnableSkills) {
            if (learningSkill.level === this._level) {
                this.addGpLearnableSkill(learningSkill.skillId);
            }
        }
        this.updateGpLearnableSkills();
    };
    /**
     * このアクターが習得可能なスキルを更新する。
     */
    Game_Actor.prototype.updateGpLearnableSkills = function() {
        for (let skillId = 1; skillId < $dataSkills.length; skillId++) {
            const skill = $dataSkills[skillId];
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
     * @returns 習得可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.testGpLearnable = function(skill) {
        if (skill.name.length === 0) {
            return false;
        }
        if (skill.gpLearnCondition.length > 0) {
            const a = this;  // eslint-disable-line no-unused-vars
            const hasSkillType = (type) => this.skillTypes().includes(type); // eslint-disable-line no-unused-vars
            const isLearned = (id) => this.isLearnedSkill(id); // eslint-disable-line no-unused-vars
            const hasItem = (id) => $gameParty.hasItem($dataItems[id]) ; // eslint-disable-line no-unused-vars
            const hasWeapon = (id) => $gameParty.hasItem($dataWeapons[id]); // eslint-disable-line no-unused-vars
            const hasArmor = (id) => $gameParty.hasItem($dataArmors[id]); // eslint-disable-line no-unused-vars
            const v = $gameVariables._data; // eslint-disable-line no-unused-vars

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
     * @param {number} skillId スキルID
     * @returns {boolean} GPにて習得済みのスキルである場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isGpLearnedSkill = function (skillId) {
        return this._gpLearnedSkills.includes(skillId);
    };

    /**
     * GP消費で習得可能スキルかどうかを判定する。
     * 
     * @param {number} skillId スキルID
     * @returns {boolean} GP消費で習得可能なスキルの場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isGpLearnableSkill = function (skillId) {
        return this._gpLearnableSkills.contains(skillId);
    };

    /**
     * 習得可能スキルを追加する。
     * 
     * @param {number} skillId スキルID
     * @returns {boolean} 追加された場合にはtrue, それ以外はfalse.
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
    // 4.育成データを反映する場所を追加。
    /**
     * GrowPointを消費してスキルを習得する。
     * 
     * @param skillId スキルID
     */
    Game_Actor.prototype.learnSkillByGp = function(skillId) {
        // 該当エントリを習得可能リストから削除
        const index = this._gpLearnableSkills.indexOf(skillId);
        if (index >= 0) {
            this._gpLearnableSkills.splice(index, 1);
            // 該当エントリをGP習得リストに追加
            this._gpLearnedSkills.push(skillId);
            // スキル習得
            this.learnSkill(skillId);
        }
    };

    // 5.Game_Actor.resetGrowsをフックし、育成リセットを追加。
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

        // リセット時、キープされるスキルだけ習得可能スキルに渡す。
        const gpLearnableSkills = [];
        for (const id of this._gpLearnableSkills) {
            const skill = $dataSkills[id];
            if (skill.meta.keepOnResetGrown) {
                gpLearnableSkills.push(id);
            }
        }
        this._gpLearnableSkills = gpLearnableSkills;
        this._gpLearnableSkills.sort((a, b) => a - b);
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
        this.updateGpLearnableSkills();
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
    // 7.Game_Actor.applyGrowupをフックし、育成適用処理を追加。
    const _Game_Actor_applyGrowup = Game_Actor.prototype.applyGrowup;
    /**
     * 育成項目を適用する。
     * 
     * @param {GrowupItem} growupItem 育成項目
     * @returns {boolean} 適用できたかどうか。
     */
    Game_Actor.prototype.applyGrowup = function(growupItem) {
        if (growupItem.type === "skill") {
            const skillId = growupItem.id;
            this.learnSkillByGp(skillId);
            this.updateGpLearnableSkills();
            return true;
        } else {
            return _Game_Actor_applyGrowup.call(this, growupItem);
        }
    };

    const _Game_Actor_onGrown = Game_Actor.prototype.onGrown;
    /**
     * 成長処理が行われたときの処理を行う。
     */
    Game_Actor.prototype.onGrown = function() {
        _Game_Actor_onGrown.call(this);
        this.updateGpLearnableSkills();
    };

    //------------------------------------------------------------------------------
    // Game_Action
    if (Game_Action.EFFECT_ADD_GPLEARN_SKILL) {
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
            if (effect.code == Game_Action.EFFECT_ADD_GPLEARN_SKILL) {
                const id = effect.dataId;
                const stype = $dataSkills[id].stypeId;
                // アクターかつ、習得済み、習得可能スキルにない。
                // かつスキルタイプがサポートされている。
                return (target.isActor() && !target.isLearnedSkill(id) 
                    && !target.isGpLearnableSkill(id)
                    && ((stype === 0) || (target.skillTypes().includes(stype))));
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
