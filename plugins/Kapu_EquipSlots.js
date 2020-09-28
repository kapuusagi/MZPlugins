/*:ja
 * @target MZ 
 * @plugindesc 装備スロット変更用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @help 
 * 装備スロット変更用プラグイン。UIは変えない。
 * 
 * ■ 使用時の注意
 * ありません。
 * 
 * ■ プラグイン開発者向け
 * ありません。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * クラス
 *     <equipSlots:type1#,type2#,...>
 *           装備品タイプをカンマ区切りで並べる。
 *           未指定時はシステムのデフォルトが使われる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_EquipSlots";
    const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
        // TODO : コマンドの処理。
        // パラメータメンバは @argで指定した名前でアクセスできる。
    });

    /**
     * 装備スロットのノートタグを処理する。
     * 
     * @param {Object} obj DataClassノートタグ
     */
    const _processEquipSlotsNoteTag = function(obj) {
        obj.equipSlots = [];
        if (obj.meta.equipSlots) {
            const tokens = obj.meta.equipSlots.split(',');
            for (const token of tokens) {
                const equipType = Number(token);
                if ((equipType > 0) && (equipType < $dataSystem.equipTypes.length)) {
                    obj.equipSlots.push(equipType);
                }
            }
        }
        if (obj.equipSlots.length == 0) {
            // 装備スロットが無い場合にはデフォルトを設定する。
            for (const equipType of $dataSystem.equipTypes) {
                obj.equipSlots.push(equipType);
            }
        }
    };

    DataManager.addNotetagParserClasses(_processEquipSlotsNoteTag);


    //------------------------------------------------------------------------------
    // Game_Actor

    /**
     * 装備を初期化する。
     * 
     * @param {Array<Number>} equips 装備品ID配列
     * !!!overwrite!!!
     */
    Game_Actor.prototype.initEquips = function(equips) {
        // 装備品オブジェクト配列を作成する。
        // データベース上での指定は、$dataSystem.equipTypes準拠だからだ。
        const equipItems = [];
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

        const equipSlots = this.equipSlots();
        this._equips = [];
        for (let i = 0; i < equipSlots.length; i++) {
            this._equips[i] = new Game_Item();
        }
        for (const equipItem of equipItms) {
            if (!equipItem) {
                continue;
            }
            const equipType = equipItem.etypeId;
            // 装備可能な未装備スロットを探す。
            // 装備可能スロットを探して
            let slotNo = -1;
            for (let i = 0; i < equipSlots.length; i++) {
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
     * 装備スロット配列を得る。
     * 
     * @return {Array<Number>} 装備スロット配列。装備タイプが格納された配列が返る。
     */
    Game_Actor.prototype.equipSlots = function() {
        const slots = this.currentClass().equipSlots.slice();
        if ((slots.length >= 2) && this.isDualWield()) {
            slots[1] = 1;
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

})();