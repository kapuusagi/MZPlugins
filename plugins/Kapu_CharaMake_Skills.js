/*:ja
 * @target MZ 
 * @plugindesc キャラメイク・スキルプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_CharaMake
 * @orderAfter Kapu_CharaMake
 * 
 * @param itemLists
 * @text 選択項目セット
 * @description 1セットあたり、1つの選択項目になる。
 * @type struct<CharaMakeSkillSetGroup>[]
 * 
 * @help 
 * キャラメイク時にスキルセットを選択して習得できるようにするプラグイン。
 * 本プラグイン1つで複数のスキルセットを選択できるようになります。
 * 
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * 特になし。
 * 
 * Game_Actor
 *    +- CharaMakeSkillSetGroup[N]
 *           +- CharaMakeSkillSet[N] ここから選択する。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 動作確認。
 */
/*~struct~CharaMakeSkillSetGroup:
 *
 * @param name
 * @text 選択項目名
 * @description 選択項目名として使用されるテキスト
 * @type string
 * @default 選択項目
 * 
 * @param description
 * @text 選択項目の説明
 * @description 選択項目の説明として使用されるテキスト
 * @type string
 * @default スキルセットを選択します。
 *
 * @param isSelectableAtFirst
 * @text 初期時のみ選択可能とする
 * @desc 初回作成時のみ選択可能にする場合にはtrueにします。
 * @type boolean
 * @default true
 * 
 * @param skillSets
 * @text 選択可能な項目
 * @description この選択項目で選択可能なスキルセット
 * @type struct<CharaMakeSkillSet>[]
 * @default []
 * 
 */
/*~struct~CharaMakeSkillSet:
 * 
 * @param name
 * @text 名前
 * @description
 * @type string
 * @default 選択肢 
 * 
 * @param description
 * @text 説明
 * @description 項目の説明
 * @type string
 * @default 選択肢の説明
 * 
 * @param skills
 * @text スキル
 * @description このスキルセットを選択した際に習得可能なスキルの配列。
 * @type skill[]
 * @default []
 */

/**
 * 名前を設定・変更するキャラクターメイキング項目を表すオブジェクト。
 */
function Game_CharaMakeItem_Skills() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_CharaMake_Skills";
    const parameters = PluginManager.parameters(pluginName);

    const charaMakeSkillSetGroups = [];
    try {
        const groups = JSON.parse(parameters["itemLists"]).map(str => JSON.parse(str));
        for (const group of groups) {
            group.isSelectableAtFirst = (typeof group.isSelectableAtFirst === "undefined")
                    ? true : (group.isSelectableAtFirst === "true");
            if (group.skillSets) {
                const skillSets = JSON.parse(group.skillSets).map(str => JSON.parse(str));
                for (const skillSet of skillSets) {
                    if (skillSet.skills) {
                        skillSet.skills = JSON.parse(skillSet.skills).map(str => Number(str));
                    } else {
                        skillSet.skills = [];
                    }
                }
                group.skillSets = skillSets;
            } else {
                group.skillSets = [];
            }
            charaMakeSkillSetGroups.push(group);
        }
        console.log("");
    }
    catch (e) {
        console.log(e);
    }

    //------------------------------------------------------------------------------
    // DataManager
    const _DataManager_createCharaMakeItems = DataManager.createCharaMakeItems;
    /**
     * キャラクターメイキング項目を取得する。
     * キャラメイク項目を拡張する場合、このメソッドをフックして値を配列に加えて返す。
     * 
     * @return {Array<Game_CharaMakeItem>} キャラクターメイキング項目
     */
    DataManager.createCharaMakeItems = function() {
        const items = _DataManager_createCharaMakeItems.call(this);
        for (let groupNo = 0; groupNo < charaMakeSkillSetGroups.length; groupNo++) {
            items.push(new Game_CharaMakeItem_Skills(groupNo));
        }
        return items;
    };
    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._selectedSkillSet = [];
    };

    /**
     * groupNoで選択されているスキルセット番号を得る。
     * 
     * @param {number} groupNo スキルセットグループ番号
     * @returns スキルセット番号
     */
    Game_Actor.prototype.skillSetNo = function(groupNo) {
        return this._selectedSkillSet[groupNo] || -1;
    };

    /**
     * groupNoで選択されているスキルセット番号をnoに設定する。
     * 
     * @param {number} groupNo スキルセットグループ番号
     * @param {number} no スキルセット番号
     */
    Game_Actor.prototype.setSkillSetNo = function(groupNo, no) {
        this._selectedSkillSet[groupNo] = no;
        this.refresh();
    }

    /**
     * groupNoで選択されているスキルセットを得る。
     * 
     * @param {number} groupNo スキルセットグループ番号
     * @returns {Array<DataSkill>} スキル配列
     */
    Game_Actor.prototype.skillSetSkills = function(groupNo) {
        return this.skillSetSkillIds(groupNo).map(id => $dataSkills[id]);
    };

    /**
     * groupNoで選択されているスキルセットのID配列を得る。
     * 
     * @param {number} groupNo スキルグループ番号
     * @returns {Array<number>} スキルID配列
     */
    Game_Actor.prototype.skillSetSkillIds = function(groupNo) {
        const no = this.skillSetNo(groupNo);
        if ((no >= 0) && (no < charaMakeSkillSetGroups[groupNo].skillSets.length)) {
            const skillSets = charaMakeSkillSetGroups[groupNo].skillSets[no];
            return skillSets.skills;
        } else {
            return [];
        }
    };

    const _Game_Actor_isLearnedSkill = Game_Actor.prototype.isLearnedSkill;
    /**
     * skillIのスキルdが習得済みスキルかどうかを判定する。
     * 
     * @param {Number} skillId スキルID
     * @return {Boolean} 習得済みの場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.isLearnedSkill = function(skillId) {
        if (_Game_Actor_isLearnedSkill.call(this, skillId)) {
            return true;
        } else {
            // スキルセットに含まれるかどうかを調べる。
            for (let groupNo = 0; groupNo < charaMakeSkillSetGroups.length; groupNo++) {
                const skillIds = this.skillSetSkillIds(groupNo);
                if (skillIds.includes(skillId)) {
                    return true;
                }
            }
            return false;
        }
    };

    const _Game_Actor_skills = Game_Actor.prototype.skills;
    /**
     * アクターが使用可能なスキル一覧を得る。
     * Traitによって追加されているスキルも含まれる。
     * 
     * @return {Array<DataSkill>} スキル一覧
     */
    Game_Actor.prototype.skills = function() {
        const skills = _Game_Actor_skills.call(this);
        for (let groupNo = 0; groupNo < charaMakeSkillSetGroups.length; groupNo++) {
            const selectedSkills = this.skillSetSkills(groupNo);
            for (const skill of selectedSkills) {
                if (skill && !skills.includes(skill)) {
                    skills.push(skill);
                }
            }
        }

        return skills;
    };
    //------------------------------------------------------------------------------
    // Game_CharaMakeItem_Skills
    Game_CharaMakeItem_Skills.prototype = Object.create(Game_CharaMakeItem.prototype);
    Game_CharaMakeItem_Skills.prototype.constructor = Game_CharaMakeItem_Skills;

    /**
     * Game_CharaMakeItem_Skills を初期化する。
     * 
     * @param {number} スキルセットグループ番号
     */
    Game_CharaMakeItem_Skills.prototype.initialize = function(groupNo) {
        this._groupNo = groupNo;
        this._skillSelectionSet = charaMakeSkillSetGroups[groupNo];
        Game_CharaMakeItem.prototype.initialize.call(this, ...arguments);
    };

    /**
     * この項目の識別名を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Skills.prototype.name = function() {
        const group =  this.skillSetGroup();
        return group.name || "";
    };
    /**
     * この項目の説明を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Skills.prototype.description = function() {
        const group =  this.skillSetGroup();
        return group.description || "";
    };

    /**
     * アクターに適用可能な項目かどうかを取得する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {boolean} 既存データの変更の場合にはtrue、それ以外はfalse
     * @returns 適用できる項目の場合にはtrue, それ以外はfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Skills.prototype.canApply = function(actor, isModify) {
        const group =  this.skillSetGroup();
        return !isModify || group.isSelectableAtFirst;
    };

    /**
     * 現在のアクターの情報を反映させる
     * 
     * Note: キャラメイク操作で初期値を設定するために呼び出される。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Skills.prototype.setCurrent = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        const items = selectWindow.items();
        const no = actor.skillSetNo(this._groupNo);
        if ((no >= 0) && (no < items.length)) {
            selectWindow.select(no);
        } else {
            selectWindow.deselect();
        }
    };

    /**
     * 編集中の設定を反映させる。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Skills.prototype.apply = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        actor.setSkillSetNo(this._groupNo, selectWindow.index());
    };

    /**
     * 項目一覧を得る。
     * 
     * @return {Array<object>} 項目一覧
     */
    Game_CharaMakeItem_Skills.prototype.items = function() {
        const group =  this.skillSetGroup();
        return group.skillSets.concat();
    };

    /**
     * スキルセットグループを得る。
     * 
     * @returns {CharaMakeSkillSetGroup} スキルセットグループ
     */
    Game_CharaMakeItem_Skills.prototype.skillSetGroup = function() {
        return charaMakeSkillSetGroups[this._groupNo];
    }
})();