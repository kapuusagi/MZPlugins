/*:ja
 * @target MZ 
 * @plugindesc 装備に関する機能拡張を行えるようにするためのベースプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @param etypeIdOfSubWeapon
 * @text サブウェポン時置換装備タイプ番号
 * @descサブウェポン特性(二刀流/サブウエポン必須装備)を持っている場合に、武器を装備可能にする装備タイプ番号
 * @type number
 * @default 2
 * 
 * @help 
 * 装備に関する機能拡張を行えるようにするためのベースプラグイン。
 * 本プラグイン単体ではベーシックシステムの動作は変わらない。
 * 
 * ■ 使用時の注意
 * 装備スロット関係の拡張プラグインと競合します。
 * 
 * ■ プラグイン開発者向け
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 EquipSlotで競合が発生しそうだったのでコア部分を分離し、新規作成。
 */

(() => {
    const pluginName = "Kapu_Base_Equip";
    const parameters = PluginManager.parameters(pluginName);
    
    const etypeIdOfSubWeapon = Number(parameters["etypeIdOfSubWeapon"]) || 2;

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._equipSlots = [];
        this._subWeaponSlotNo = -1;
        this.refreshEquipSlots();
    };

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
        const equipItems = this.initialEquipments(equips);

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
                const isWeapon = DataManager.isWeapon(equipItem);
                if (isWeapon || DataManager.isArmor(equipItem)) {
                    // 装備品の場合にはsetEquipを使用して装備させる。
                    this._equips[slotNo].setEquip(isWeapon, equipItem.id);
                } else {
                    // それ以外はsetObjectを使用して装備させる。
                    this._equips[slotNo].setObject(equipItem);
                }
            }
        }

        this.releaseUnequippableItems(true);
        this.recoverAll();
        this.refresh();
    };

    /**
     * アクターの初期装備を得る。
     * 
     * @param {Array<number>} 装備品ID配列。（種類はシステムの装備スロット番号に依存）
     * @return {Array<object>} 初期装備アイテム配列
     */
    Game_Actor.prototype.initialEquipments = function(equips) {
        const items = [];
        for (let i = 0; i < equips.length; i++) {
            const itemId = equips[i];
            if (itemId <= 0) {
                continue;
            }
             // equipsはインデックス0から始まるけど、equipTypesは1から始まるので1ずれる
            const equipType = $dataSystem.equipTypes[i + 1];
            if ((equipType === $dataSystem.equipTypes[1]) 
                    || ((i == 1) && this.isDualWield())) {
                items.push($dataWeapons[itemId]);
            } else {
                items.push($dataArmors[itemId]);
            }
        }
        return items;
    };


    /**
     * ベースの装備スロット情報を得る。
     * 
     * @returns {Array<object>} ベースの装備スロット情報
     */
    Game_Actor.prototype.baseEquipSlots = function() {
        const equipSlots = [];
        for (let slotNo = 0; slotNo < $dataSystem.equipTypes.length; slotNo++) {
            const etypeId = slotNo + 1;
            equipSlots.push({
                name:"",
                etypeId:etypeId
            });
        }
        return equipSlots;
    };

    /**
     * 装備スロットを更新する。
     * 
     * Note: 装備品変更によりスロット状態が変わるならばここで処理する
     */
    Game_Actor.prototype.refreshEquipSlots = function() {
        this._equipSlots = this.baseEquipSlots();
        this._subWeaponSlotNo = this.findSubWeaponSlotNo();
    };

    /**
     * サブウェポンに割り当てるスロット番号を得る。
     * 
     * @return {number} サブウェポンスロット番号
     */
    Game_Actor.prototype.findSubWeaponSlotNo = function() {
        for (let slotNo = 0; slotNo < this._equipSlots.length; slotNo++) {
            if (this._equipSlots[slotNo].etypeId === etypeIdOfSubWeapon) {
                return slotNo;
            }
        }
        return -1;
    };

    /**
     * 装備を初期化する。
     * 
     * @param {Array<Number>} equips 装備品ID配列
     * !!!overwrite!!! Game_Actor.initEquips
     *   装備初期化処理を拡張できるようにするため、オーバーライドする。
     */
    Game_Actor.prototype.initEquips = function(equips) {
        this.refreshEquipSlots();

        const slots = this.equipSlots();
        const maxSlots = slots.length;
        this._equips = [];
        for (let i = 0; i < maxSlots; i++) {
            this._equips[i] = new Game_Item();
        }
        for (let j = 0; j < equips.length; j++) {
            if (j < maxSlots) {
                this._equips[j].setEquip(slots[j] === 1, equips[j]);
            }
        }
        this.releaseUnequippableItems(true);
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
     * 装備スロット名を得る。
     * 
     * @return {Array<string>} 装備スロット名配列
     */
    Game_Actor.prototype.equipSlotNames = function() {
        const slotNames = [];
        for (let slotNo = 0; slotNo < this._equipSlots.length; slotNo++) {
            if (this._equipSlots[slotNo].name) {
                slotNames.push(this._equipSlots[slotNo].name);
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
        const equipTypesOfSlots = [];
        for (let slotNo = 0; slotNo < this._equipSlots.length; slotNo++) {
            equipTypesOfSlots.push(this.equipTypesOfSlotAt(slotNo));
        }
        return equipTypesOfSlots;
    };

    /**
     * slotNoで指定されるスロットの装備可能タイプを得る。
     * 
     * @param {number} slotNo スロット番号
     * @returns {Array<number>} 装備タイプID配列
     */
    Game_Actor.prototype.equipTypesOfSlotAt = function(slotNo) {
        if (slotNo === this.subWeaponSlotNo()) {
            return this.equipTypesOfSubWeaponSlot(slotNo);
        } else {
            return [ this._equipSlots[slotNo].etypeId ];
        }
    };

    /**
     * サブウェポンスロットに装備可能な装備タイプを得る。
     * 
     * @param {number} slotNo スロット番号
     * @returns {Array<number>} 装備タイプID配列
     */
    Game_Actor.prototype.equipTypesOfSubWeaponSlot = function(slotNo) {
        if (this.isDualWield()) {
            return this.equipTypesOfSubWeaponSlotDualWired(slotNo);
        } else {
            return [ this._equipSlots[slotNo].etypeId ];
        }
    };

    /**
     * 二刀流時のサブウェポンスロットに装備可能な装備タイプを得る。
     * 
     * @param {number} slotNo スロット番号
     * @returns {Array<number>} 装備タイプID配列
     */
    // eslint-disable-next-line no-unused-vars
    Game_Actor.prototype.equipTypesOfSubWeaponSlotDualWired = function(slotNo) {
        return [ 1 ];
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
        const slots = this._equipSlots.map(slot => slot.etypeId);
        const subWeaponSlotNo = this.subWeaponSlotNo();
        if (subWeaponSlotNo >= 0) {
            slots[subWeaponSlotNo] = this.subWeaponEquipTypeId();
        }
        return slots;
    };

    /**
     * サブウェポンスロットの装備タイプ番号を得る。
     * 
     * @return {number} 装備タイプ番号
     */
    Game_Actor.prototype.subWeaponEquipTypeId = function() {
        if (this.isDualWield()) {
            return this.subWeaponEquiptypeIdDualWired(); 
        } else {
            return etypeIdOfSubWeapon;
        }
    };
    /**
     * サブウェポンスロット番号を得る。
     * 
     * @return {number} サブウェポンスロット番号
     */
    Game_Actor.prototype.subWeaponSlotNo = function() {
        return this._subWeaponSlotNo;
    };

    /**
     * 二刀流時のサブウェポンスロットの装備タイプ番号を得る。
     * 
     * @returns {number} 装備タイプ番号
     */
    Game_Actor.prototype.subWeaponEquiptypeIdDualWired = function() {
        return 1; // 二刀流の場合には武器を返す。
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
        if (this.canEquipAtSlot(slotId, item)) {
            if (this.tradeItemWithParty(item, this.equips()[slotId])) {
                this._equips[slotId].setObject(item);
                this.refresh();
            }
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
            this.refreshEquipSlots();
            const equips = this.equips();
            let changed = false;
            for (let slotNo = 0; slotNo < equips.length; slotNo++) {
                const item = equips[slotNo];
                if (!this.canEquipAtSlot(slotNo, item)) {
                    if (!forcing) {
                        this.tradeItemWithParty(null, item);
                    }
                    this._equips[slotNo].setObject(null);
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
     * メインウェポンを得る。
     * 
     * @returns {DataWeapon} メインウェポン。無い場合にはnull
     */
    Game_Actor.prototype.mainWeapon = function() {
        return this.weapons()[0]
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
        if (slotNo >= etypeIdOfSlot.length) {
            // スロットが減って装備不可。
            return false;
        }
        if (item) {
            if (!etypeIds.includes(item.etypeId)) {
                return false; // 装備タイプ対象外
            } else {
                return this.canEquip(item);
            }
        } else {
            return true;
        }
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
        return actor.equipSlotNames()[index];
    };    
})();