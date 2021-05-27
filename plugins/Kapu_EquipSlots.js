/*:ja
 * @target MZ 
 * @plugindesc 装備スロット変更用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param etypeIdOfSubWeapon
 * @text サブウェポン時置換装備タイプ番号
 * @descサブウェポン特性(二刀流/サブウエポン必須装備)を持っている場合に、武器を装備可能にする装備タイプ番号
 * @type number
 * @default 2
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
 * クラス毎に装備スロットを変更するためのプラグイン。UIは基本的に変更しない。
 * また、サブウェポンの概念を追加する。
 * サブウェポンは、矢や弾のような概念を提供するためのもの。SkillItemCostと組み合わせると
 * 指定した装備品を触媒として消費していく、といった仕組みができる。
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
 * Version.0.3.0 盾装備部位(サブウェポンスロットと呼称した)を指定出来るように修正。
 *               二刀流のとき、盾または武器を選択装備できるようにした。
 * Version.0.2.0 両手装備品、サブウェポンの概念を追加するように修正した。
 * Version.0.1.0 作成。
 */
(() => {
    const pluginName = "Kapu_EquipSlots";
    const parameters = PluginManager.parameters(pluginName);
    const etypeIdOfSubWeapon = Number(parameters["etypeIdOfSubWeapon"]) || 2;
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
                const index = token.indexOf(':');
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
    // Scene_Boot
    if (subWeaponEquipTypeId) {
        const _Scene_Boot_start = Scene_Boot.prototype.start;
        /**
         * Scene_Bootを開始する。
         */
        Scene_Boot.prototype.start = function () {
            $dataSystem.equipTypes[subWeaponEquipTypeId] = textSubWeaponSlotName;
            _Scene_Boot_start.call(this);
        };
    }
    //------------------------------------------------------------------------------
    // Game_Actor

    /**
     * 装備を初期化する。
     * 
     * @param {Array<Number>} equips 装備品ID配列
     * !!!overwrite!!! Game_Actor.initEquips
     *     スロット構成をカスタマイズできるようにしたため、オーバーライドする。
     */
    Game_Actor.prototype.initEquips = function(equips) {
        // 装備品オブジェクト配列を作成する。
        // データベース上での指定は、$dataSystem.equipTypes準拠だからだ。
        const equipItems = [];
        const actor = this.actor();
        for (let i = 0; i < equips.length; i++) {
            const itemId = equips[i];
            if (itemId <= 0) {
                continue;
            }
             // equipsはインデックス0から始まるけど、equipTypesは1から始まるので1ずれる
            const equipType = $dataSystem.equipTypes[i + 1];
            if ((equipType === $dataSystem.equipTypes[1]) 
                    || ((i == 1) && this.isDualWield())) {
                equipItems.push($dataWeapons[itemId]);
            } else {
                equipItems.push($dataArmors[itemId]);
            }
        }
        if (actor.meta.equippedItems) {
            const tokens = actor.meta.equippedItems.split(",");
            for (const token of tokens) {
                let re;
                if ((re = token.match(/weapon\((\d+)\)/)) !== null) {
                    const id = Number(re[1]);
                    if ((id > 0) && (id < $dataWeapons.length)) {
                        equipItems.push($dataWeapons[id]);
                    }
                } else if ((re = token.match(/armor\((\d+)\)/)) !== null) {
                    const id = Number(re[1]);
                    if ((id > 0) && (id < $dataArmors.length)) {
                        equipItems.push($dataArmors[id]);
                    }
                }
            }
        }

        this._equips = [];
        const equipSlotCount = this.equipSlots().length;
        for (let i = 0; i < equipSlotCount; i++) {
            this._equips[i] = new Game_Item();
        }
        for (const equipItem of equipItems) {
            if (!equipItem) {
                continue;
            }
            const slotNo = this.equipableSlotNo(equipItem, true);
            if (slotNo >= 0) {
                // 装備させる。
                this._equips[slotNo].setEquip(DataManager.isWeapon(equipItem), equipItem.id);
            }
        }

        this.releaseUnequippableItems(true);
        this.recoverAll();
        this.refresh();
    };

    /**
     * itemを装備可能なスロット番号を得る。
     * 
     * @param {object} item アイテム(DataWeapon/DataArmor)
     * @param {boolean} emptyOnly 空きスロットを探索する場合にはtrue, それ以外はfalse.
     * @return {number} スロット番号
     */
    Game_Actor.prototype.equipableSlotNo = function(item, emptyOnly) {
        const equipTypesOfSlots = this.equipTypesOfSlots();
        for (let slotNo = 0; slotNo < equipTypesOfSlots.length; slotNo++) {
            if (equipTypesOfSlots[slotNo].includes(item.etypeId)) {
                // このスロットと装備タイプが一致。
                if (!emptyOnly || this._equips[slotNo].isNull()) {
                    return slotNo;
                }
            }
        }
        return -1;
    };

    /**
     * 両手装備かどうかを判定する。
     * 
     * @returns {boolean} 両手装備
     */
    Game_Actor.prototype.isBothHands = function() {
        const weapon = this.weapons()[0];
        return (weapon && weapon.meta.bothHands);
    };

    /**
     * メインウェポンを得る。
     * 
     * @returns {DataWeapon} メインウェポン。無い場合にはnull
     */
    Game_Actor.prototype.mainWeapon = function() {
        return this.weapons()[0]
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

    /**
     * 2番目のスロットが武器かどうかを得る。
     * 
     * @returns {boolean} 2番目のスロットが武器の場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.is2ndSlotIsWeapon = function() {
        return this.isDualWield() || this.isNeedsSubWeapon();
    };

    /**
     * 装備スロット名を得る。
     * 
     * @return {Array<string>} 装備スロット名配列
     */
    Game_Actor.prototype.equipSlotNames = function() {
        const slotNames = [];
        const equipSlots = this.currentClass().equipSlots;
        for (let slotNo = 0; slotNo < equipSlots.length; slotNo++) {
            if (equipSlots[slotNo].name) {
                slotNames.push(equipSlots[slotNo].name);
            } else {
                const etypeId = this.equipSlots()[slotNo];
                slotNames.push($dataSystem.equipTypes[etypeId]);
            }
        }
        return slotNames;
    };

    /**
     * 装備スロットタイプIDを得る。
     * 
     * @return {Array<Array<number>>} 装備可能タイプID配列
     */
    Game_Actor.prototype.equipTypesOfSlots = function() {
        const equipTypesOfSlots = this.currentClass().equipSlots.map(slot => [ slot.etypeId ]);
        if (subWeaponEquipTypeId && this.isNeedsSubWeapon()) {
            const etypeIds = equipTypesOfSlots.find(etypeIds => etypeIds.includes(etypeIdOfSubWeapon));
            if (etypeIds) {
                // サブウエポン指定の場合には完全に置換
                etypeIds[0] = subWeaponEquipTypeId;
            }
        } else if (this.isDualWield()) {
            const etypeIds = equipTypesOfSlots.find(etypeIds => etypeIds.includes(etypeIdOfSubWeapon));
            if (etypeIds) {
                etypeIds.unshift(1);
            }
        }

        return equipTypesOfSlots;
    };

    /**
     * サブウェポンスロット番号を得る。
     * 
     * @return {number} サブウェポンスロット番号
     */
    Game_Actor.prototype.subWeaponSlotNo = function() {
        const equipSlots = this.currentClass().equipSlots;
        for (let slotNo = 0; slotNo < equipSlots.length; slotNo++) {
            if (equipSlots[slotNo].etypeId === etypeIdOfSubWeapon) {
                return slotNo;
            }
        }
        return -1;
    };

    /**
     * 装備スロット配列を得る。
     * 
     * @returns {Array<Number>} 装備スロット配列。装備タイプが格納された配列が返る。
     * !!!overwrite!!! Game_Actor.equipSlots()
     *     装備スロットを動的に構築するためにオーバーライドする。
     *     これ自体はベーシックシステムとの互換性のために用意する。
     */
    Game_Actor.prototype.equipSlots = function() {
        const slots = this.currentClass().equipSlots.map(slot => slot.etypeId);
        if (subWeaponEquipTypeId && this.isNeedsSubWeapon()) {
            const replaceIndex = this.subWeaponSlotNo();
            if (replaceIndex >= 0) {
                slots[replaceIndex] = subWeaponEquipTypeId;
            }
        } else if (this.isDualWield()) {
            const replaceIndex = this.subWeaponSlotNo();
            if ((replaceIndex >= 0) && this._equips[replaceIndex].isWeapon()) {
                // リプレース対象装備箇所に武器が装備されている場合のみ名前変更
                slots[replaceIndex] = 1;
            }
        }
        return slots;
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

    /**
     * 装備を変更する。
     * パーティーの所持品にitemが無い場合には変更できない。
     * 
     * Note: クラスを変更した場合など、スロット数が変動している場合に
     *        不正なデータを返さないためにフックする。
     * 
     * @param {number} slotId スロットID
     * @param {DataItem} item 装備品(DataWeapon/DataArmor)
     * !!!overwrite!!! Game_Actor.changeEquip
     *     装備スロットに対する複数タイプサポートのためにオーバーライドする。
     */
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        if ((this._equips[slotId] === undefined) || (this._equips[slotId] === null)) {
            this._equips[slotId] = new Game_Item();
        }
        if (this.tradeItemWithParty(item, this.equips()[slotId]) 
                && (!item || this.equipTypesOfSlots()[slotId].includes(item.etypeId))) {
            this._equips[slotId].setObject(item);
            this.refresh();
        }
    };

    /**
     * 装備を変更する。
     * パーティーの所持品にitemIdで指定するアイテムが無い場合には変更できない。
     * 
     * Note: このメソッドはインタプリタによる呼び出し時に呼び出される。
     * 
     * @param {number} etypeId 装備タイプID
     * @param {number} itemId アイテムID
     * !!!overwrite!!! Game_Actor.changeEquipById
     *     装備タイプ、ID指定での要求の場合、該当スロットを適切に呼び出すためにオーバーライドする。
     */
    Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
        // プラグインコマンドからの呼び出しのみ。
        // つまり、DualWiredとか考慮されていないから、ベーシックシステムでの
        // スロット並びを考慮して装備対象アイテムを取得し、
        // 装備させる必要がある。
        const slotId = etypeId - 1;
        if (slotId === 0) {
            const weapon = $dataWeapons[itemId];
            const slotNo = this.equipableSlotNo(weapon, false);
            this.changeEquip(slotNo, weapon);
        } else {
            const armor = $dataArmors[itemId];
            const slotNo = this.equipableSlotNo(armor, false);
            this.changeEquip(slotNo, armor);
        }
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
    /**
     * 装備できないものを装備解除する。
     * 
     * @param {boolean} forcing 強制解除するかどうか。
     *                  強制解除する場合、装備品は所持品に戻らず、消失する。
     * 
     * !!!overwrite!!! Game_Actor.releaseUnequippableItems()
     *     装備品解除により、装備可能スロットが変化することがあり得るため、オーバーライドする。
     */
    Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
        for (;;) {
            const equips = this.equips();
            let changed = false;
            for (let i = 0; i < equips.length; i++) {
                const item = equips[i];
                if (!this.canEquipAtSlot(i, item)) {
                    if (!forcing) {
                        this.tradeItemWithParty(null, item);
                    }
                    this._equips[i].setObject(null);
                    changed = true;
                }
            }
            if (!changed) {
                // 取り外しがなかったら終了。
                break;
            }
        }
    };

    /**
     * slotNoで指定されるスロットにitemが装備可能かどうかを取得する。
     * 
     * @param {number} slotNo スロット番号
     * @param {object} item DataWeaponまたはDataArmor
     * @returns {boolean} 装備可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.canEquipAtSlot = function(slotNo, item) {
        const etypeIdOfSlot = this.equipTypesOfSlots();
        const etypeIds = etypeIdOfSlot[slotNo];
        const subWeaponSlotNo = this.subWeaponSlotNo();
        if (slotNo >= etypeIdOfSlot.length) {
            // スロットが減って装備不可。
            return false;
        }
        if (item) {
            if (!etypeIds.includes(item.etypeId)) {
                return false; // 装備タイプ対象外
            } else if ((slotNo === subWeaponSlotNo) && item.meta.bothHands) {
                return false; // サブウェポンスロットに両手装備品を装備
            } else if ((slotNo === subWeaponSlotNo) && this.isBothHands()) {
                // 両手の時はサブウェポンスロットを強制リジェクト。
                return false; // 両手持ち装備品装着済み。
            } else if ((slotNo === subWeaponSlotNo) && item.subWeaponTypes) {
                // サブウェポンスロットにサブウェポンを必要とする装備はできない。
                return false;
            } else {
                return this.canEquip(item);
            }
        }
        return true;
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

    //------------------------------------------------------------------------------
    // Window_EquipItem

    /**
     * itemがこのリストに含まれるかどうかを判定する。
     * 
     * Note: 候補として表示させない場合にはfalseを返す。
     * 
     * @param {object} item アイテム
     * @returns {boolean} 含まれる場合にはtrue, それ以外はfalse.
     * !!!overwrite!!! Window_EquipItem.includes
     *     所定のスロットに装備可能なタイプを複数持たせるため、オーバーライドする。
     */
    Window_EquipItem.prototype.includes = function(item) {
        if (item === null) {
            return true;
        }
        return (
            this._actor &&
            this._actor.canEquipAtSlot(this._slotId, item) &&
            this.equipTypes().includes(item.etypeId)
        );
    };

    /**
     * このスロットの装備タイプ番号を得る。
     * 
     * @return {Array<number>} 装備タイプ番号
     */
    Window_EquipItem.prototype.equipTypes = function() {
        if (this._actor && (this._slotId >= 0)) {
            return this._actor.equipTypesOfSlots()[this._slotId];
        } else {
            return [ 0 ];
        }
    }

    //------------------------------------------------------------------------------
    // Window_StatusBase
    /**
     * 装備スロット名を得る。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} index スロット番号
     * @returns {string} スロット名
     * !!!overwrite!!! Window_StatusBase.actorSlotName
     *     定義されたスロット名を返すため、オーバーライドする。
     */
    Window_StatusBase.prototype.actorSlotName = function(actor, index) {
        const name = actor.equipSlotNames()[index];
        if (name) {
            return name;
        } else {
            const etypeId = actor.equipSlots()[index];
            return $dataSystem.equipTypes[etypeId];
        }
    };
    
})();
