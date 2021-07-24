/*:ja
 * @target MZ 
 * @plugindesc 装備スロット変更用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Equip
 * @orderAfter Kapu_Base_Equip
 * 
 * @param subWeaponEquipTypeId
 * @text サブウェポン武器タイプID
 * @desc サブウェポンに割り当てる武器タイプID
 * @type number
 * @default 100
 * 
 * @param textSubWeaponSlotName
 * @text サブウェポンスロット名
 * @desc サブウェポンに割り当てるスロット名
 * @type string
 * @default 武器
 * 
 * @help 
 * 装備スロットの機能を変更するプラグイン。
 * 以下の機能を提供します。
 * ・クラス毎に装備スロットを設定可能になります。
 *   
 * ・二刀流特性を持っているとき、武器または盾を装備選択可能になります。
 *   ベーシックシステムでは二刀流特性があるとき、盾は装備できません。
 *   二刀流特性を追加すると、盾が装備できなくなるという問題を回避します。
 *   
 * ・サブウェポン指定された武器を装備した場合に、盾スロットに相当するところを
 *   専用のサブウェポン装備スロットに変更します。
 *   弓と矢で別々な装備を用意したいような機能を実現します。
 *    サブウェポンは、矢や弾のような概念を提供するためのもの。SkillItemCostと組み合わせると
 *    指定した装備品を触媒として消費していく、といった仕組みができる。
 *   <subWeaponType>ノートタグ参照。
 * 
 * ・両手装備武器を明示することができるようになります。
 *   <bothHands>ノートタグ参照。
 * 
 *      
 * ヒント：
 *   弓矢セットで1つの武器の場合 -> bothHands推奨。
 *   弓と矢がそれぞれ別 -> 弓に subWeaponType を指定し、
 *                       矢の武器タイプを 弓で指定したid#のどれか にした上でsubWeapon をセット
 *   片手用クロスボウだとか暗器だとかは考慮してない。
 * 
 * ■ 使用時の注意
 * ありません。
 * 
 * ■ プラグイン開発者向け
 * ベーシックシステムでは装備タイプ番号がユニーク前提の設計になっており、
 * 複数のスロットで同タイプ適用可能にするにはかなり広範囲に変更を加える必要がある。
 * 
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <equippedItems:entry,entry,...>
 *     初期装備品を指定する。
 *     entryは以下のように指定する。
 *       "weapon(id)": id#の武器
 *       "armor(id)":  id#の防具
 * 
 *   未指定時はデータベースでアクターに設定された装備品が適用される。
 * クラス
 *   <equipSlots:type1#,type2,...>
 *   <equipSlots:type1#:name1$,type2#:name2$,...>
 *     装備品タイプをカンマ区切りで並べる。
 *     未指定時はシステムのデフォルトが使われる。
 *     装備名省略時はシステムのデフォルトが使われる。
 * 
 * 
 * 武器
 *   <bothHands>
 *     この武器は両手で持つことが必要だと指定する。
 *     「サブウェポン時置換装備タイプ番号」には装備できず、該当スロットは使用不可とされる。
 *     ベーシックシステムではスロット封印により実現するが、面倒なのでノートタグ指定とした。
 *     二刀流、サブウェポンより優先される。
 *   <subWeaponType:id#,...>
 *     この武器を装備したとき、サブウェポン時置換装備タイプ番号に指定したスロットには、
 *     id#で指定したサブウェポンのみ装備可能である。
 *
 *   <subWeapon>
 *     この武器がサブウェポンであることを指定する。
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.4.0 Kapu_Base_Equipにコア部分を分離した。
 * Version.0.3.0 盾装備部位(サブウェポンスロットと呼称した)を指定出来るように修正。
 *               二刀流のとき、盾または武器を選択装備できるようにした。
 * Version.0.2.0 両手装備品、サブウェポンの概念を追加するように修正した。
 * Version.0.1.0 作成。
 */
(() => {
    const pluginName = "Kapu_EquipSlots";
    const parameters = PluginManager.parameters(pluginName);
    const subWeaponEquipTypeId = Number(parameters["subWeaponEquipTypeId"]) || 0;
    const textSubWeaponSlotName = parameters["textSubWeaponSlotName"] || "Weapon";
    if (!subWeaponEquipTypeId) {
        console.error(pluginName + ":Sub weapon type id incorrect.");
    }


    /**
     * 装備スロットのノートタグを処理する。
     * 
     * @param {object} obj DataClassノートタグ
     */
    const _processEquipSlotsNoteTag = function(obj) {
        obj.equipSlots = [];
        if (obj.meta.equipSlots) {
            const tokens = obj.meta.equipSlots.split(",");
            for (const token of tokens) {
                let equipType = 0;
                let name = "";
                const index = token.indexOf(":");
                if (index > 0) {
                    equipType = Number(token.substr(0, index));
                    name = token.substr(index + 1).trim();
                } else {
                    equipType = Number(token);
                    name = ""; // Use default.
                }
                if ((equipType > 0) && (equipType < $dataSystem.equipTypes.length)) {
                    obj.equipSlots.push({
                        etypeId:equipType, name:name
                    });
                }
            }
        }
        if (obj.equipSlots.length == 0) {
            // 装備スロットが無い場合にはデフォルトを設定する。
            for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
                obj.equipSlots.push({
                    etypeId:i, name:""
                });
            }
        }
    };

    DataManager.addNotetagParserClasses(_processEquipSlotsNoteTag);

    /**
     * 武器のノートタグを処理する。
     * 
     * @param {DataWeapon} obj DataWeaponオブジェクト
     */
    const _processWeaponNoteTag = function(obj) {
        if (subWeaponEquipTypeId && obj.meta.subWeaponType) {
            const ids = obj.meta.subWeaponType.split(",").map(token => Number(token));
            const swt = [];
            for (const id of ids) {
                if ((id > 0) && !swt.includes(id)) {
                    swt.push(id);
                }
            }
            if (swt.length > 0) {
                obj.subWeaponTypes = swt;
            }
        }
        if (subWeaponEquipTypeId && obj.meta.subWeapon) {
            obj.etypeId = subWeaponEquipTypeId;
        }
    };
    DataManager.addNotetagParserWeapons(_processWeaponNoteTag);

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_baseEquipSlots = Game_Actor.prototype.baseEquipSlots;
    /**
     * ベースの装備スロット情報を得る。
     * 
     * @returns {Array<object>} ベースの装備スロット情報
     */
    Game_Actor.prototype.baseEquipSlots = function() {
        const dataClass = this.currentClass();
        if (dataClass) {
            const equipSlots = dataClass.equipSlots.slice();
            if (equipSlots.length > 0) {
                return equipSlots;
            }
        }
        return _Game_Actor_baseEquipSlots.call(this);
    };

    const _Game_Actor_initialEquipments = Game_Actor.prototype.initialEquipments;
    /**
     * アクターの初期装備を得る。
     * 
     * @param {Array<number>} 装備品ID配列。（種類はシステムの装備スロット番号に依存）
     * @return {Array<object>} 初期装備アイテム配列
     */
    Game_Actor.prototype.initialEquipments = function(equips) {
        const items = _Game_Actor_initialEquipments.call(this, equips);

        const actor = this.actor();
        if (actor.meta.equippedItems) {
            const tokens = actor.meta.equippedItems.split(",");
            for (const token of tokens) {
                let re;
                if ((re = token.match(/weapon\((\d+)\)/)) !== null) {
                    const id = Number(re[1]);
                    if ((id > 0) && (id < $dataWeapons.length)) {
                        items.push($dataWeapons[id]);
                    }
                } else if ((re = token.match(/armor\((\d+)\)/)) !== null) {
                    const id = Number(re[1]);
                    if ((id > 0) && (id < $dataArmors.length)) {
                        items.push($dataArmors[id]);
                    }
                }
            }
        }

        return items;
    };

    const _Game_Actor_equipSlotNameAt = Game_Actor.prototype.equipSlotNameAt;
    /**
     * 指定スロット番号のスロット名を得る。
     * 
     * @param {number} slotNo スロット番号
     * @returns {string} スロット名
     */
    Game_Actor.prototype.equipSlotNameAt = function(slotNo) {
        if ((slotNo == this.subWeaponSlotNo()) && this.isNeedsSubWeapon()) {
            return textSubWeaponSlotName;
        } else {
            return _Game_Actor_equipSlotNameAt.call(this, slotNo);
        }
    };
    /**
     * 両手装備かどうかを判定する。
     * 
     * @returns {boolean} 両手装備
     */
    Game_Actor.prototype.isBothHands = function() {
        const weapon = this.mainWeapon();
        return (weapon && weapon.meta.bothHands);
    };

    /**
     * サブウエポンが必要かどうかを判定する。
     * 
     * @returns {boolean} サブウェポンの場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isNeedsSubWeapon = function() {
        const weapon = this.mainWeapon();
        return (weapon && weapon.subWeaponTypes)
    };

    /**
     * サブウェポンタイプを得る。
     * 
     * @returns {Array<Number>} サブウエポンタイプ。サブウェポンが無い場合にはnull.
     */
    Game_Actor.prototype.subWeaponTypes = function() {
        const weapon = this.mainWeapon();
        return (weapon && weapon.subWeaponTypes) ? weapon.subWeaponTypes : [];
    };

    const _Game_Actor_equipTypesOfSubWeaponSlot = Game_Actor.prototype.equipTypesOfSubWeaponSlot;
    /**
     * サブウェポンスロットに装備可能な装備タイプを得る。
     * 
     * @param {number} slotNo スロット番号
     * @returns {Array<number>} 装備タイプID配列
     */
    Game_Actor.prototype.equipTypesOfSubWeaponSlot = function(slotNo) {
        if (this.isNeedsSubWeapon()) {
            return [ subWeaponEquipTypeId ];
        } else {
            return _Game_Actor_equipTypesOfSubWeaponSlot.call(this, slotNo);
        }
    };

    /**
     * 二刀流時のサブウェポンスロットに装備可能な装備タイプを得る。
     * 
     * @param {number} slotNo スロット番号
     * @returns {Array<number>} 装備タイプID配列
     * !!!overwrite!!! Game_Actor.equipTypesOfSubWeaponSlotDualWired
     *     二刀流時、防具と洗濯装備できるようにするためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_Actor.prototype.equipTypesOfSubWeaponSlotDualWired = function(slotNo) {
        return [ 1, this._equipSlots[slotNo].etypeId ];
    };


    const _Game_Actor_subWeaponEquipTypeId = Game_Actor.prototype.subWeaponEquipTypeId;
    /**
     * サブウェポンスロットの装備タイプ番号を得る。
     * 
     * @return {number} 装備タイプ番号
     */
    Game_Actor.prototype.subWeaponEquipTypeId = function() {
        if (this.isNeedsSubWeapon()) {
            return subWeaponEquipTypeId;
        } else {
            return _Game_Actor_subWeaponEquipTypeId.call(this);
        }
    };

    /**
     * 二刀流時のサブウェポンスロットの装備タイプ番号を得る。
     * 
     * @returns {number} 装備タイプ番号
     * !!!overwrite!!! Game_Actor.subWeaponEquiptypeIdDualWired
     *      二刀流の時は、武器を装備しているときだけ武器装備スロットタイプを返す。
     */
    Game_Actor.prototype.subWeaponEquiptypeIdDualWired = function() {
        const subWeaponSlotNo = this.subWeaponSlotNo();
        if (subWeaponSlotNo >= 0) {
            return this._equips[subWeaponSlotNo].isWeapon()
                    ? 1 : this._equipSlots[subWeaponSlotNo].etypeId;
        } else {
            return 1;
        }
    };

    const _Game_Actor_equips = Game_Actor.prototype.equips;
    /**
     * このアクターが装備している装備品のコレクションを得る。
     * 
     * Note:クラスを変更した場合など、スロット数が変動している場合にエンプティなデータを返さないためにフックする。
     * 
     * @returns {Array<Object>} 装備品(DataWeapon/DataArmor)の配列。
     */
    Game_Actor.prototype.equips = function() {
        for (let i = 0; i < this.currentClass().equipSlots.length; i++) {
            if ((this._equips[i] === undefined) || (this._equips[i] === null)) {
                this._equips[i] = new Game_Item();
            }
        }
        return _Game_Actor_equips.call(this); // _equipsが返る。(はず)
    };

    const _Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    /**
     * 装備を変更する。
     * パーティーの所持品にitemが無い場合には変更できない。
     * 
     * Note: クラスを変更した場合など、スロット数が変動している場合に
     *        不正なデータを返さないためにフックする。
     * 
     * @param {number} slotId スロットID
     * @param {DataItem} item 装備品(DataWeapon/DataArmor)
     */
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        if ((this._equips[slotId] === undefined) || (this._equips[slotId] === null)) {
            this._equips[slotId] = new Game_Item();
        }
        _Game_Actor_changeEquip.call(this, slotId, item);
    };
    const _Game_Actor_forceChangeEquip = Game_Actor.prototype.forceChangeEquip;
    /**
     * 装備を変更する。
     * 所持品は減らない。
     * 装備画面での、装備変更による値の変化を表示するため等に使用される。
     * 
     * Note:クラスを変更した場合など、スロット数が変動している場合に
     *      エンプティなデータを返さないためにフックする。
     * 
     * @param {number} slotId スロット番号
     * @param {object} item アイテム
     */
    Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
        if ((this._equips[slotId] === undefined) || (this._equips[slotId] === null)) {
            this._equips[slotId] = new Game_Item();
        }
        _Game_Actor_forceChangeEquip.call(this, slotId, item);
    };

    const _Game_Actor_canEquipAtSlot = Game_Actor.prototype.canEquipAtSlot;
    /**
     * slotNoで指定されるスロットにitemが装備可能かどうかを取得する。
     * 
     * @param {number} slotNo スロット番号
     * @param {object} item DataWeaponまたはDataArmor
     * @returns {boolean} 装備可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.canEquipAtSlot = function(slotNo, item) {
        if (item && (slotNo === this.subWeaponSlotNo())) {
            if (this.isBothHands()) {
                // 両手の時はサブウェポンスロットを強制リジェクト。
                return false;
            }
            if (item.meta.bothHands) {
                // サブウェポンスロットに両手装備品を装備
                return false;
            }
            if (item.subWeaponTypes) {
                // サブウェポンスロットにサブウェポンを必要とする装備はできない。
                return false;
            }
        }

        return _Game_Actor_canEquipAtSlot.call(this, slotNo, item);
    };

    const _Game_Actor_isEquipWtypeOk = Game_Actor.prototype.isEquipWtypeOk;
    /**
     * 装備可能な武器タイプかどうかを判定する。
     * 
     * @param {number} wtypeId 武器タイプID
     * @returns {boolean} 装備可能な武器タイプの場合にはtrue, それ以外はfalseが返る。
     */
    Game_Actor.prototype.isEquipWtypeOk = function(wtypeId) {
        return _Game_Actor_isEquipWtypeOk.call(this, wtypeId)
                || this.subWeaponTypes().includes(wtypeId);
    };

    const _Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
    /**
     * slotIdで指定されるスロットが、装備変更可能かどうかを取得する。
     * 
     * @param {number} slotId スロット番号
     * @returns {boolean} 装備変更可能な場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.isEquipChangeOk = function(slotId) {
        return _Game_Actor_isEquipChangeOk.call(this, slotId)
                && ((slotId !== this.subWeaponSlotNo()) || !this.isBothHands());
    };




    
})();
