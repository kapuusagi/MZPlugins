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
 * @type struct<CharaMakeSkillSelecter>[]
 * 
 * @help 
 * キャラメイク時にスキルセットを選択して習得できるようにするプラグイン。
 * 本プラグイン1つで複数のスキルセットを選択できるようになります。
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * 特になし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/*~struct~CharaMakeSkillSelecter:
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

    const skillSelectionSets = [];
    try {
        const charaMakeItemLists = JSON.parse(parameters["itemLists"]).map(str => JSON.parse(str));
        for (const charaMakeItemList of charaMakeItemLists) {
            charaMakeItemList.isSelectableAtFirst = (typeof charaMakeItemList.isSelectableAtFirst === "undefined")
                    ? true : (charaMakeItemList.isSelectableAtFirst === "true");
            if (charaMakeItemList.skillSets) {
                const skillSets = JSON.parse(charaMakeItemList.skillSets).map(str => JSON.parse(str));
                for (const skillSet of skillSets) {
                    if (skillSet.skills) {
                        skillSet.skills = JSON.parse(skillSet.skills).map(str => Number(str));
                    } else {
                        skillSet.skills = [];
                    }
                }
                charaMakeItemList.skillSets = skillSets;
            } else {
                charaMakeItemList.skillSets = [];
            }
            skillSelectionSets.push(charaMakeItemList);
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
        for (let i = 0; i < skillSelectionSets.length; i++) {
            const skillSelectionSet = skillSelectionSets[i];
            items.push(new Game_CharaMakeItem_Skills(i, skillSelectionSet));
        }
        return items;
    };
    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * Game_Tempを初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._charaMakeSelectingSkills = [];
    };
    /**
     * キャラクターメイキングのスキルセット中の選択インデックス。
     * 
     * @param {number} no スキルセット番号
     * @returns {number} スキルセット中の選択インデックス
     */
    Game_Temp.prototype.charaMakeSelectingSkill = function(no) {
        return this._charaMakeSelectingSkills[no] || 0;
    };
    /**
     * キャラクターメイキングのスキルセット中の選択インデックスを設定する。
     * 
     * @param {number} no スキルセット番号
     * @param {number} index スキルセット中の選択インデックス
     */
    Game_Temp.prototype.setCharaMakeSelectingSkill = function(no, index) {
        this._charaMakeSelectingSkills[no] = index;
    };

    //------------------------------------------------------------------------------
    // Scene_CharaMake
    const _Scene_CharaMake_start = Scene_CharaMake.prototype.start;
    /**
     * シーンを開始する。
     */
    Scene_CharaMake.prototype.start = function() {
        _Scene_CharaMake_start.call(this);
        for (let i = 0; i < skillSelectionSets.length; i++) {
            $gameTemp.setCharaMakeSelectingSkill(i, -1);
        }
    };

    const _Scene_CharaMake_onCharaMakeComplete = Scene_CharaMake.prototype.onCharaMakeComplete;
    /**
     * キャラクターメイキングを完了操作した場合の処理を行う。
     */
    Scene_CharaMake.prototype.onCharaMakeComplete = function() {
        const actor = $gameActors.actor(this._actorId);
        /* アクターにスキルを適用する */
        for (let i = 0; i < skillSelectionSets.length; i++) {
            const skillSelection = skillSelectionSets[i];
            const selectedIndex = $gameTemp.charaMakeSelectingSkill(i);
            if ((selectedIndex >= 0) && (selectedIndex < skillSelection.skillSets.length)) {
                const skillIds = skillSelection.skillSets[selectedIndex].skills;
                for (const skillId of skillIds) {
                    actor.learnSkill(skillId);
                }
            }
        }
        _Scene_CharaMake_onCharaMakeComplete.call(this);
    };
    //------------------------------------------------------------------------------
    // Game_CharaMakeItem_Skills
    Game_CharaMakeItem_Skills.prototype = Object.create(Game_CharaMakeItem.prototype);
    Game_CharaMakeItem_Skills.prototype.constructor = Game_CharaMakeItem_Skills;

    /**
     * Game_CharaMakeItem_Skills を初期化する。
     * 
     * @param {number} スキルセット番号
     * @param {CharaMakeSkillSelecter} skillSelectionSet スキル選択セット
     */
    Game_CharaMakeItem_Skills.prototype.initialize = function(no, skillSelectionSet) {
        this._skillSetNo = no;
        this._skillSelectionSet = skillSelectionSet;
        Game_CharaMakeItem.prototype.initialize.call(this, ...arguments);
    };

    /**
     * この項目の識別名を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Skills.prototype.name = function() {
        return this._skillSelectionSet.name || "";
    };
    /**
     * この項目の説明を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Skills.prototype.description = function() {
        return this._skillSelectionSet.description || "";
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
        return !isModify || this._skillSelectionSet.isSelectableAtFirst;
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
        const selectedIndex = $gameTemp.charaMakeSelectingSkill(this._skillSetNo);
        if (selectedIndex < items.length) {
            selectWindow.select(selectedIndex);
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
        const selectedIndex = selectWindow.index();
        $gameTemp.setCharaMakeSelectingSkill(this._skillSetNo, selectedIndex);
    };

    /**
     * アイテム一覧を得る。
     * 
     * @return {Array<object>} アイテム一覧
     */
    Game_CharaMakeItem_Skills.prototype.items = function() {
        return this._skillSelectionSet.skillSets.concat();
    };
})();