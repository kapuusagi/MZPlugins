/*:ja
 * @target MZ 
 * @plugindesc スキル装備選択プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_EquipSlot
 * @orderAfter Kapu_EquipSlot
 * 
 * @param skillSlotTypes
 * @text スキルスロットタイプ
 * @desc スキルスロットタイプリスト。どのスロット番号に、どのスキルタイプをセット可能とするかを指定します。
 * @type EqukipSkilSlot
 * @default []
 * 
 * @help 
 * 指定した装備スロットタイプの装備対象を、習得済みのスキルから選択するものとします。
 * 習得済みスキルのうち、<equipSkill> ノートタグを付けられたスキルは、
 * 装備スロットに装備することで使用可能になります。
 * 
 * 使用方法
 *   (1) 装備対象のスキルにノートタグ <equipSkill> を付けます。
 *   (2) 装備タイプを適当に作ります。
 *   (3) 本プラグインパラメータの「スキルスロットタイプ」に(2)で指定した装備タイプを設定します。
 *       このとき、その装備タイプに装備可能なスキルタイプを「装備可能スキルタイプID」で設定します。
 * 
 * 通常のスキル習得操作により、<equipSkill>ノートタグを付けられたスキルは自動で装備スキルとして習得されます。
 * 装備スキルは装備したときに初めて有効になります。
 * 
 * ■ 使用時の注意
 * 
 * 
 * ■ プラグイン開発者向け
 * Game_Actor.equipableSkills() : Array<DataSkill>
 *   装備可能スキル一覧を得る。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし。
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * スキル
 *   <equipSkill>
 *     装備により効果を発揮するスキル
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/*~struct~EqukipSkilSlot
 * 
 * @param etypeId
 * @text スロットタイプ番号
 * @desc 装備可能にするスロットタイプ番号
 * @type number
 *
 * @param stypeIds
 * @text 装備可能スキルタイプID
 * @desc 装備可能なスキルタイプID配列
 * @type number[]
 */
(() => {
    const pluginName = "Kapu_EquipSkill";
    const parameters = PluginManager.parameters(pluginName);
    const skillSlotTypes = [];
    try {
        const entries = JSON.parse(parameters["skillSlotTypes"]).map(str => JSON.parse(str));
        for (const entry of entries) {
            const etypeId = Number(entry.etypeId);
            const stypeIds = [];
            const ids = JSON.parse(entry.stypeIds).map(str => Number(str) || 0);
            for (const id of ids) {
                if ((id > 0) && !stypeIds.includes(id)) {
                    stypeIds.push(id);
                }
            }
            skillSlotTypes[etypeId] = stypeIds;
        }
    }
    catch (e) {
        console.error(e);
    }

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // Game_BattlerBase


    const _Game_BattlerBase_canEquip = Game_BattlerBase.prototype.canEquip;
    /**
     * itemが装備可能かどうかを取得する。
     * 
     * @param {Object} item アイテム
     * @return {Boolean} 装備可能な場合にはtrue, それ以外はfalseが返る。
     */
    Game_BattlerBase.prototype.canEquip = function(item) {
        if (item && DataManager.isSkill(item)) {
            return this.canEquipSkill(item);
        } else {
            return _Game_BattlerBase_canEquip.call(this, item);
        }
    };

    /**
     * スキルが装備可能かどうかを判定する。
     * 
     * @param {DataSkill} skill スキル
     * @returns {Boolean} 装備可能な場合にはtrue, それ以外はfalse.
     */
    Game_BattlerBase.prototype.canEquipSkill = function(skill) {
        if (skill.meta.equipSkill) {
            const etypeIds = skillSlotTypes.filter(sst => sst && sst.stypeIds.includes(skill.stypeId)).map(sst => sst.etypeId)
            return etypeIds.some(etypeId => this.isEquipTypeSealed(etypeId));
        } else {
            return false;
        }
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._equipableSkills = [];
    };

    const _Game_Acotr_learnSkill = Game_Actor.prototype.learnSkill;
    /**
     * スキルを習得する。
     * 
     * @param {Number} skillId スキルID
     */
    Game_Actor.prototype.learnSkill = function(skillId) {
        if (!this.isLearnedSkill(skillId)) {
            const skill = $dataSkills[skillid];
            if (skill.meta.equipSkill) {
                this._equipableSkills.push(skillId);
                this._equipableSkills.sort((a, b) => a - b);
            } else {
                _Game_Acotr_learnSkill.call(this, skillId);
            }
        }
    };

    const _Game_Actor_forgetSkill = Game_Actor.prototype.forgetSkill;

    /**
     * スキルを忘れる。
     * 
     * @param {Number} skillId スキルID
     */
    Game_Actor.prototype.forgetSkill = function(skillId) {
        _Game_Actor_forgetSkill.call(this, skillId);
        if (this._equipableSkills.includes(skillId)) {
            this._equipableSkills.remove(skillId);
            this.refresh();
        }
    };

    const _Game_Actor_isLearnedSkill = Game_Actor.prototype.isLearnedSkill;
    /**
     * skillIのスキルdが習得済みスキルかどうかを判定する。
     * 
     * Note: 習得済みかどうかを判定する。Traitにより追加されたスキルは含まれない。
     * 
     * @param {Number} skillId スキルID
     * @return {Boolean} 習得済みの場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.isLearnedSkill = function(skillId) {
        return this._equipableSkills.includes(skillid) || _Game_Actor_isLearnedSkill.call(tis, skillId);
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
        const equips = this.equips();
        for (const equip of equips) {
            if (DataManager.isSkill(equip) && !skills.includes(equip)) {
                skills.push(equip);
            }
        }

        return skills;
    };

    /**
     * 装備可能なスキル一覧を得る。
     * 
     * @return {Array<DataSkills>} スキル一覧
     */
    Game_Actor.prototype.equipableSkills = function() {
        const skills = [];
        for (const skillId of this._equipableSkills) {
            const skill = $dataSkills[skillId];
            if (skill && !skills.includes(skillId)) {
                skills.push(skill);
            }
        }
        return skills;
    };

    const _Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    /**
     * 装備を変更する。
     * パーティーの所持品にitemが無い場合には変更できない。
     * 
     * @param {Number} slotId スロットID
     * @param {DataItem} item 装備品(DataWeapon/DataArmor)
     */
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        const slots = this.equipSlots();
        const etypeId = slots[slotId];
        if (skillSlotTypes[etypeId]) {
            if (DataManager.isSkill(item) && (skillSlotTypes[etypeId].includes(item.stypeId))) {
                this._equips[slotId].setObject(item);
                this.refresh();
            }
        } else {
            _Game_Actor_changeEquip.call(this, slotId, item);
        }
    };

    const _Game_Actor_canEquipAtSlot = Game_Actor.prototype.canEquipAtSlot;
    /**
     * slotNoで指定されるスロットにitemが装備可能かどうかを取得する。
     * 
     * Note: releaseUnequippableItems()対策。
     *       ベーシックシステムでは上記メソッドをオーバーライドする必要がでてきて競合しやすい
     * 
     * @param {Number} slotNo スロット番号
     * @param {Object} item DataWeaponまたはDataArmor
     * @returns {Boolean} 装備可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.canEquipAtSlot = function(slotNo, item) {
        const etypeId = this.equipSlots()[slotNo];
        if (skillSlotTypes[etypeId]) {
            // スキルを装備するスロットである。
            if (item) {
                return DataManager.isSkill(item) && skillSlotTypes[etypeId].includes(item.stypeId);
            } else {
                return true;
            }
        } else {
            return _Game_Actor_canEquipAtSlot.call(this, slotNo, item);
        }
    };
    
    //------------------------------------------------------------------------------
    // Window_EquipItem
    const _Window_EquipItem_makeItemList = Window_EquipItem.prototype.makeItemList;
    /**
     * 表示するアイテムリストを構築する。
     * 
     * Note: 全てのアイテム($gameParty.allItems())に対して、includes(item)を呼び出してtrueを返すものをリストにする。
     *       派生クラスでは何のリストにしているのか、includes()のメソッドに注意すること。
     */
    Window_EquipItem.prototype.makeItemList = function() {
        if (this.isEquipSkillSlot()) {
            if (this._actor) {
                this._data = this._actor.equipableSkills().filter(skill => this.includes(skill));
                this._data.push(null);
            } else {
                this._data = [null];
            }
        } else {
            _Window_EquipItem_makeItemList.call();
        }
    };

    /**
     * スキル装備スロットかどうかを得る。ｓ
     * 
     * @returns {Boolean} スキル装備スロットの場合にはtrue, それ以外はfalse.
     */
    Window_EquipItem.prototype.isEquipSkillSlot = function() {
        return skillSlotTypes[this.etypeid()] ? true : false;
    };

    /**
     * 装備可能なスキルタイプID配列を得る。
     * 
     * @returns {Array<number>} 装備可能なスキルタイプIDリスト
     */
    Window_EquipItem.prototype.stypeIds = function() {
        return skillSlotTypes[this.etypeid()] || [];
    };

    const _Window_EquipItem_includes = Window_EquipItem.prototype.includes;
    /**
     * itemがこのリストに含まれるべきかどうかを判定する。
     * 
     * @param {Object} item アイテム
     * @returns {Boolean} 含まれる場合にはtrue, それ以外はfalse.
     */
    Window_EquipItem.prototype.includes = function(item) {
        if (DataManager.isSkill(item)) {
            return this.stypeIds().includes(item.stypeId) && !this.isEquippedSkill(item);
        } else {
            return _Window_EquipItem_includes.call(this);   
        }
    };

    /**
     * 装備しているスキルかどうかを得る。
     * 
     * @param {Object} skill スキル
     * @returns {Boolean} 装備している場合にはtrue, それ以外はfalse
     */
    Window_EquipItem.prototype.isEquippedSkill = function(skill) {
        if (this._actor) {
            return this._actor.isEquipped(skill);
        } else {
            return false;
        }
    };
})();