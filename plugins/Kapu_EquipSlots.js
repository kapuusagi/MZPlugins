/*:ja
 * @target MZ 
 * @plugindesc 装備スロット変更用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @help 
 * クラス毎に装備スロットを変更するためのプラグイン。UIは基本的に変更しない。
 * また、サブウェポンの概念を追加する。
 * サブウェポンは、矢や弾のような概念を提供するためのもの。SkillItemCostと組み合わせると
 * 指定した装備品を触媒として消費していく、といった仕組みができる。
 * 
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
 *   <equipSlots:type1#,type2#,...>
 *     装備品タイプをカンマ区切りで並べる。
 *     未指定時はシステムのデフォルトが使われる。
 * 
 * 武器
 *   <bothHands>
 *     この武器は両手で持つことが必要だと指定する。
 *     2番目のスロットには装備できず、2番目のスロットは使用不可とされる。
 *     ベーシックシステムではスロット封印により実現するが、面倒なのでノートタグ指定とした。
 *     二刀流、サブウェポンより優先される。
 *   <subWeaponType:id#,...>
 *     この武器を装備したとき、2番目のスロットにはid#で指定したサブウェポンのみ装備可能である。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 両手装備品、サブウェポンの概念を追加するように修正した。
 * Version.0.1.0 作成。
 */
(() => {
    // const pluginName = "Kapu_EquipSlots";
    // const parameters = PluginManager.parameters(pluginName);


    /**
     * 装備スロットのノートタグを処理する。
     * 
     * @param {Object} obj DataClassノートタグ
     */
    const _processEquipSlotsNoteTag = function(obj) {
        obj.equipSlots = [];
        if (obj.meta.equipSlots) {
            const tokens = obj.meta.equipSlots.split(",");
            for (const token of tokens) {
                const equipType = Number(token);
                if ((equipType > 0) && (equipType < $dataSystem.equipTypes.length)) {
                    obj.equipSlots.push(equipType);
                }
            }
        }
        if (obj.equipSlots.length == 0) {
            // 装備スロットが無い場合にはデフォルトを設定する。
            for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
                obj.equipSlots.push(i);
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
        if (obj.meta.subWeaponType) {
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
    };
    DataManager.addNotetagParserWeapons(_processWeaponNoteTag);
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * 武器が装備可能かどうかを取得する。
     * 
     * @param {Object} item DataWeaponオブジェクト
     * @return {Boolean} 装備可能な場合にはtrue, それ以外はfalseが返る。
     * !!!overwrite!!! Game_BattlerBase.canEquipWeapon()
     *     装備可能条件からwtypeを外すためにオーバーライドする。
     *     wtypeをスロット毎に動的に変更し、他のプラグインで派生した際にも判定が使えるようにするため。
     */
    Game_BattlerBase.prototype.canEquipWeapon = function(item) {
        return (
            //this.isEquipWtypeOk(item.wtypeId) &&
            !this.isEquipTypeSealed(item.etypeId)
        );
    };
    //------------------------------------------------------------------------------
    // Game_Actor

    /**
     * 装備を初期化する。
     * 
     * @param {Array<Number>} equips 装備品ID配列
     * !!!overwrite!!! Game_Actor.initEquips
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
        for (let i = 0; i < equipSlots.length; i++) {
            this._equips[i] = new Game_Item();
        }
        for (const equipItem of equipItems) {
            if (!equipItem) {
                continue;
            }
            const equipType = equipItem.etypeId;
            // 装備可能な未装備スロットを探す。
            // 装備可能スロットを探して装備させる
            let slotNo = -1;
            for (let i = 0; i < equipSlots.length; i++) {
                const equipSlots = this.equipSlots();
                if ((equipSlots[i] === equipType) && this._equips[i].isNull()) {
                    slotNo = i;
                    break;
                }
            }
            if (slotNo < 0) {
                // 装備可能な空きスロットがない。
                continue;
            }

            // 装備させる。
            this._equips[slotNo].setEquip(DataManager.isWeapon(equipItem), equipItem.id);
        }

        this.releaseUnequippableItems(true);
        this.recoverAll();
        this.refresh();
    };

    /**
     * 両手装備かどうかを判定する。
     * 
     * @return {Boolean} 両手装備
     */
    Game_Actor.prototype.isBothHands = function() {
        const weapon = this.weapons()[0];
        return (weapon && weapon.meta.bothHands);
    };

    /**
     * サブウエポンが必要かどうかを判定する。
     * 
     * @return {Boolean} サブウェポンの場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isNeedsSubWeapon = function() {
        return (this.subWeaponTypes() !== null);
    };

    /**
     * サブウェポンタイプを得る。
     * 
     * @return {Array<Number>} サブウエポンタイプ。サブウェポンが無い場合にはnull.
     */
    Game_Actor.prototype.subWeaponTypes = function() {
        const weapon = this.weapons()[0];
        return (weapon && weapon.subWeaponTypes) ? weapon.subWeaponTypes : null;
    };

    /**
     * 2番目のスロットが武器かどうかを得る。
     * 
     * @return {Boolean} 2番目のスロットが武器の場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.is2ndSlotIsWeapon = function() {
        return this.isDualWield() || this.isNeedsSubWeapon();
    };

    /**
     * 装備スロット配列を得る。
     * 
     * @return {Array<Number>} 装備スロット配列。装備タイプが格納された配列が返る。
     */
    Game_Actor.prototype.equipSlots = function() {
        const slots = this.currentClass().equipSlots.slice();
        if (slots.length >= 2) {
            if (this.isBothHands()) {
                // do nothing.
            } else if (this.isNeedsSubWeapon()) {
                slots[1] = 1;
            } else if (this.isDualWield()) {
                slots[1] = 1;
            }
        }
        return slots;
    };

    const _Game_Actor_equips = Game_Actor.prototype.equips;
    /**
     * このアクターが装備している装備品のコレクションを得る。
     * クラスを変更した場合など、スロット数が変動している場合にエンプティなデータを返さないためにフックする。
     * 
     * @return {Array<Object>} 装備品(DataWeapon/DataArmor)の配列。
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
     * クラスを変更した場合など、スロット数が変動している場合に
     * エンプティなデータを返さないためにフックする。
     * 
     * @param {Number} slotId スロットID
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
     * クラスを変更した場合など、スロット数が変動している場合に
     * エンプティなデータを返さないためにフックする。
     * 
     * @param {Number} slotId スロット番号
     * @param {Object} item アイテム
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
     * @param {Boolean} forcing 強制解除するかどうか。
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
     * @param {Number} slotNo スロット番号
     * @param {Object} item DataWeaponまたはDataArmor
     * @return {Boolean} 装備可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.canEquipAtSlot = function(slotNo, item) {
        const slots = this.equipSlots();
        const etypeId = slots[slotNo];
        if (item) {
            if (!this.canEquip(item)) {
                return false; // 通常の条件判定満たさず。
            } else if (item.etypeId !== etypeId) { 
                return false; // 装備タイプ対象外
            } else if ((slotNo === 1) && item.meta.bothHands) {
                return false; // スロット1に両手装備品
            } else if ((slotNo === 1) && this.isBothHand()) {
                // 両手の時は2番目のスロットを強制リジェクト。もうちょっとうまいことやりたいね。
                // これで判定しちゃうと、1番目の装備を外さないといけないから面倒かも。
                return false; // 両手持ち装備品装着済み。
            } else if ((slotNo === 1) && this.isNeedsSubWeapon()) {
                // サブウェポン指定。
                if (!DataManager.isWeapon(item)) {
                    return false;
                } else if (!this.subWeaponTypes().includes(item.wtypeId)) {
                    return false;
                }
            } else if (etypeId === 1) {
                // 武器指定 wtypeIdをチェックする。
                if (!DataManager.isWeapon(item)) {
                    return false;
                } else if (!this.this.isEquipWtypeOk(item.wtypeId)) {
                    return false;
                }
            }
        }
        return true;
    };

    //------------------------------------------------------------------------------
    // Window_EquipItem

    /**
     * itemが含まれるかどうかを判定する。
     * 
     * @param {Object} item アイテム
     */
    Window_EquipItem.prototype.includes = function(item) {
        if (item === null) {
            return true;
        }
        if (this._slotId >= 0) {
            return (this._actor && this._actor.canEquipAtSlot(this._slotId, item));
        } else {
            return false;
        }
    };
})();