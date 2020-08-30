/*:ja
 * @target MZ
 * @plugindesc 道具/武器/防具を個別化する。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 *
 * @param independentItemSetting
 * @text 個別アイテム設定
 * 
 * @param independentItemCount
 * @text 個別アイテム登録可能数。
 * @desc 登録可能な個別アイテム数。0で個別アイテム所持不可。
 * @default 0
 * @type number
 * @parent independentItemSetting
 * 
 * @param independentItemStartIndex
 * @text 個別アイテム開始インデックス。
 * @desc 個別アイテム開始ID番号。通常アイテムの種類数より大きな値とする。この値が変わると、セーブデータが化ける。
 * @default 1000
 * @type number
 * @parent independentItemSetting
 * 
 * @param independentItemStockCount
 * @text 個別アイテム所持可能数
 * @desc 所持可能な個別アイテム数。
 * @default 0
 * @type number
 * @parent independentItemSetting
 * 
 * 
 * @param independentWeaponSetting
 * @text 個別武器設定
 * 
 * @param independentWeaponCount
 * @text 個別武器登録可能数。
 * @desc 登録可能な個別武器数。0で個別武器所持不可。装備品も含む。
 * @default 0
 * @type number
 * @parent independentWeaponSetting
 * 
 * @param independentWeaponStartIndex
 * @text 個別武器インデックス。
 * @desc 個別武器開始ID番号。通常武器の種類数より大きな値とすること。この値が変わると、セーブデータが化ける。
 * @default 1000
 * @type number
 * @parent independentWeaponSetting
 * 
 * @param independentWeaponStockCount
 * @text 個別武器所持可能数
 * @desc 所持可能な個別武器数。
 * @default 0
 * @type number
 * @parent independentWeaponSetting
 * 
 * 
 * @param independentArmorSetting
 * @text 個別防具設定
 * 
 * @param independentArmorCount
 * @text 個別防具登録可能数。
 * @desc 登録可能な個別防具数。0で個別防具所持不可。装備品も含む。
 * @default 0
 * @type number
 * @parent independentArmorSetting
 * 
 * @param independentArmorStartIndex
 * @text 個別防具開始インデックス。
 * @desc 個別防具開始ID番号。通常防具の種類数より大きな値とすること。この値が変わると、セーブデータが化ける。
 * @default 1000
 * @type number
 * @parent independentArmorSetting 
 * 
 * @param independentArmorStockCount
 * @text 個別防具所持可能数
 * @desc 所持可能な個別防具数。
 * @default 0
 * @type number
 * @parent independentArmorSetting
 * 
 * 
 * @help 
 * 道具/武器/防具を個別化するためのプラグイン。
 * 
 * 
 * independent***Count : 個別アイテム登録可能数
 * independent***StartIndex : データコレクション上の個別アイテム登録開始ID値。
 * independent***StockCount : パーティーとしての所持可能アイテム数。
 * 
 * independent***StockCOuntに、全てのアクターの装備可能数を加えたものが、
 * independentItemCountより小さくなるようにすること。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * <independent>
 *    アイテム/武器/防具に適用可能。
 *    入手時、個別アイテムとして加算されるものとして処理される。
 *    未定義または<independent:false>で個別無効。
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成開始
 */

(() => {
    const pluginName = "Kapu_IndependentItem";
    const parameters = PluginManager.parameters(pluginName);
    const independentItemCount = parameters['independentItemCount'] || 0;
    const independentItemStartIndex = parameters['independentItemStartIndex'] || 1000;
    const independentItemStockCount = parameters['independentItemStockCount'] || 200;
    const independentWeaponCount = parameters['independentWeaponCount'] || 0;
    const independentWeaponStartIndex = parameters['independentWeaponStartIndex'] || 1000;
    const independentWeaponStockCount = parameters['independentWeaponStockCount'] || 200;
    const independentArmorCount = parameters['independentArmorCount'] || 0;
    const independentArmorStartIndex = parameters['independentArmorStartIndex'] || 1000;
    const independentArmorStockCount = parameters['independentArmorStockCount'] || 200;

    //-------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_start.call(this);
    };
    //-------------------------------------------------------------------------
    // DataManager

    const _DataManager_loadDatabase = DataManager.loadDatabase;
    /**
     * データベースをロードする。
     */
    DataManager.loadDatabase = function () {
        _DataManager_loadDatabase.call(this, ...arguments);
        if ($dataItems.length >= independentItemStartIndex) {
            throw new Error('independentItemStartIndex is illegal. (< $dataItem.length)');
        }
        if ($dataWeapons.length >= independentWeaponStartIndex) {
            throw new Error('independentWeaponStartIndex is illegal. (< $dataWeapons.length');
        }
        if ($dataArmors.length >= independentArmorStartIndex) {
            throw new Error('independentArmorStartIndex is illegal. (< $dataArmors.length');
        }
    };

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        _DataManager_createGameObjects.call(this);
    };

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    /**
     * セーブデータを構築する。
     */
    DataManager.makeSaveContents = function () {
        let contents = _DataManager_makeSaveContents.call(this, ...arguments);
        this._baseItemCount = $dataItems.length;
        contents.independentItems = DataManager.makeSaveDataArray(
            $dataItems, independentItemStartIndex, independentItemCount);
        this._baseWeaponCount = $dataWeapons.length;
        contents.independentWeapons = DataManager.makeSaveDataArray(
            $dataWeapons, independentWeaponStartIndex, independentWeaponCount);
        this._baseArmorCount = $dataArmors.length;
        contents.independentArmors = DataManager.makeSaveDataArray(
            $dataArmors, independentArmorStartIndex, independentArmorCount);
        return contents;
    };

    /**
     * 保存データ配列を作成する。
     * 
     * @param {Array<DataObject>} dataArray データコレクション
     * @param {Number} startIndex 個別データ開始インデックス。
     * @param {Number} maxCount 個別データ数
     * @return {Array<DataObject>} 保存データ配列。
     */
    DataManager.makeSaveDataArray = function(dataArray, startIndex, maxCount) {
        let saveDataContents = [];

        if ((startIndex > 0) && (maxCount > 0)) {
            for (let i = 0; i < maxCount; i++) {
                const item = dataArray[startIndex + i];
                if (item) {
                    saveDataContents.push(item);
                }
            }
        }
        return saveDataContents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    /**
     * セーブデータを展開する。
     * @param {Object} contents 保存コンテンツ
     */
    DataManager.extractSaveContents = function(contents) {
        DataManager.extractSaveDataArray(contents.independentItems, $dataItems, 
            independentItemStartIndex, independentItemCount);
        DataManager.extractSaveDataArray(contents.independentWeapons, $dataWeapons,
            independentWeaponStartIndex, independentWeaponCount);
        DataManager.extractSaveDataArray(contents.independentArmors, $dataArmors,
            independentArmorStartIndex, independentArmorCount);
    };

    /**
     * 保存されたデータをデータ配列に展開する。
     * 
     * @param {Array<DataObject>} saveDataContents データコレクション
     * @param {Array<DataObject>} dataArray 保存データ配列。
     * @param {Number} startIndex 個別データ数
     * @param {Number} maxCount 保存データ配列。
     */
    DataManager.extractSaveDataArray = function(saveDataContents, dataArray, startIndex, maxCount) {
        if (!saveDataContents || (startIndex == 0) || (maxCount == 0)) {
            return ;
        }

        for (const data of saveDataContents) {
            const id = data.id;
            if ((id >= startIndex) && (id < (startIndex + maxCount))) {
                dataArray[id] = data;
            }
        }
    };

    /**
     * アイテムの種類が個別アイテムかどうかを取得する。
     * @param {Object} item アイテム。(DataItem/DataWeapon/DataArmor)
     * @return {Boolean} 個別アイテムの場合にはtrue, それ以外はfalse.
     */
    DataManager.isIndependent = function(item) {
        if (!item) {
            return false; // データなし。
        }
        if (!item.independent && !item.baseItemId) {
            return false; // 個別アイテムでない。
        }
        if (DataManager.isBattleTest()) {
            return false; // 戦闘テストでは個別アイテム無効。
        }

        return true;
    };

    /**
     * 個別アイテムかどうかを判定する。
     * @param {Object} item アイテムオブジェクト(DataItem/DataWeapon/DataArmor)
     */
    DataManager.isIndependentItem = function(item) {
        return (item && item.baseItemId);
    }

    /**
     * 新しい個別アイテムを登録する。
     * 
     * @param {Object} baseItem ベースとするアイテムオブジェクト(DataItem/DataWeapon/DataArmor)
     * @return {Object} 登録された新しいアイテム。登録できなかった場合にはnull.
     */
    DataManager.registerNewIndependentData = function(baseItem) {
        if (DataManager.isItem(baseItem)) {
            return DataManager.registerNewIndependentItem(baseItem);
        } else if (DataManager.isWeapon(baseItem)) {
            return DataManager.registerNewIndependentWeapon(baseItem);
        } else if (DataManager.isArmor(baseItem)) {
            return DataManager.registerNewIndependentArmor(baseItem);
        } else {
            return null;
        }
    };

    /**
     * 新しいアイテムを登録する。所持数コンテナは変更しない。
     * @param {DataItem} baseItem ベースアイテム
     * @return {DataItem} 登録したデータのインスタンス。
     */
    DataManager.registerNewIndependentItem = function(baseItem) {
        const newItemId = DataManager.getBlankId($dataItems,
            independentItemStartIndex, independentItemCount);
        if (newItemId > 0) {
            const newItem = DataManager.createIndependentItem(newItemId, baseItem);
            $dataItems[newItemId] = newItem;
            return newItem;
        } else {
            return null;
        }
    };

    /**
     * newItemIdを割り当てた新しい個別武器を作成する。データベースへは登録しない。
     * @param {Number} newItemId 新しい個別アイテムに割り当てるID。
     * @param {DataArmor} item ベースアイテム
     * @return {DataArmor} 作成した個別武器オブジェクト。
     */
    DataManager.createIndependentItem = function(newItemId, item) {
        const baseItem = DataManager.getBaseItem(item);
        let newItem = JsonEx.makeDeepCopy(baseItem);
        newItem.id = newItemId;
        newItem.baseItemId = baseItem.id;
        DataManager.initializeIndependentItem(newItemId);
        return newItem;
    };
 
    /**
     * 新しい個別アイテムを初期化する。
     * 他のプラグインでフックし、個別アイテムを使って使用したい機能を実現することを想定する。
     * @param {DataItem} newItem 新しい個別アイテム
     */
    DataManager.initializeIndependentItem = function(newItem) {

    };

    /**
     * 新しい武器を登録する。所持数コンテナは変更しない。
     * @param {DataWeapon} baseItem ベースアイテム
     * @return {DataWeapon} 登録したデータのインスタンス。
     */
    DataManager.registerNewIndependentWeapon = function(baseItem) {
        const newItemId = DataManager.getBlankId($dataWeapons,
            independentWeaponStartIndex, independentWeaponCount);
        if (newItemId > 0) {
            const newItem = DataManager.createIndependentWeapon(newItemId, baseItem);
            $dataWeapons[newItemId] = newItem;
            return newItem;
        } else {
            return null;
        }
    };

    /**
     * newItemIdを割り当てた新しい個別武器を作成する。データベースへは登録しない。
     * @param {Number} newItemId 新しい個別アイテムに割り当てるID。
     * @param {DataArmor} item ベースアイテム
     * @return {DataArmor} 作成した個別武器オブジェクト。
     */
    DataManager.createIndependentWeapon = function(newItemId, item) {
        const baseItem = DataManager.getBaseItem(item);
        let newItem = JsonEx.makeDeepCopy(baseItem);
        newItem.id = newItemId;
        newItem.baseItemId = baseItem.id;
        DataManager.initializeIndependentWeapon(newItemId);
        return newItem;
    };

    /**
     * 新しい個別武器を初期化する。
     * 他のプラグインでフックし、個別武器を使って使用したい機能を実現することを想定する。
     * @param {DataArmor} newWeapon 新しい個別武器
     */
    DataManager.initializeIndependentWeapon = function(newWeapon) {

    };

    /**
     * 新しい防具を登録する。所持数コンテナは変更しない。
     * @param {DataArmor} baseItem ベースアイテム
     * @return {DataArmor} 登録したデータのインスタンス。
     */
    DataManager.registerNewIndependentArmor = function(baseItem) {
        const newItemId = DataManager.getBlankId($dataArmors,
            independentArmorStartIndex, independentArmorCount);
        if (newItemId > 0) {
            const newItem = DataManager.createIndependentArmor(newItemId, baseItem);
            $dataArmors[newItemId] = newItem;
            return newItem;
        } else {
            return null;
        }
    };

    /**
     * newItemIdを割り当てた新しい個別防具を作成する。データベースへは登録しない。
     * @param {Number} newItemId 新しい個別アイテムに割り当てるID。
     * @param {DataArmor} item ベースアイテム
     * @return {DataArmor} 作成した個別防具オブジェクト。
     */
    DataManager.createIndependentArmor = function(newItemId, item) {
        const baseItem = DataManager.getBaseItem(item);
        let newItem = JsonEx.makeDeepCopy(baseItem);
        newItem.id = newItemId;
        newItem.baseItemId = (baseItem.baseItemId) ? baseItem.baseItemId : baseItem.id;
        DataManager.initializeIndependentArmor(newItemId);
        return newItem;
    };

    /**
     * 新しい個別防具を初期化する。
     * 他のプラグインでフックし、個別防具を使って使用したい機能を実現することを想定する。
     * @param {DataArmor} newArmor 新しい個別防具
     */
    DataManager.initializeIndependentArmor = function(newArmor) {

    };

    /**
     * 指定したデータコレクションの空きIDを得る。
     * @param {Array<Object>} dataArray データコレクション
     * @param {Number} startIndex 開始インデックス
     * @param {Number} maxCount 最大数
     * @return {Number} インデックス番号。空きがない場合には-1
     */
    DataManager.getBlankId = function(dataArray, startIndex, maxCount) {
        if (startIndex > 0) {
            for (let i = 0; i < maxCount; i++) {
                const id = startIndex + i;
                let item = $dataArray[id];
                if (!item) {
                    return id;
                }
            }
        }
        return -1;
    };

    /**
     * 個別アイテムのデータを削除する。
     * アイテム数コンテナは操作しない。
     * アイテムが使用中/装備中の場合には何もしない。
     * @param {DataItem} item アイテム(DataItem/DataWeapon/DataArmor)
     */
    DataManager.unregisterIndependentData = function(item) {
        if (!DataManager.isIndependentItem(item)) {
            return;
        }
        if (DataManager.isIndependentItemUsed(item)) {
            return ;
        }
        let container = DataManager.getDataCollection(item);
        if (container) {
            delete container[item.id];
        }
    };

    /**
     * itemで指定したオブジェクトを格納するコレクションを取得する。
     * 
     * @param {Object} item アイテムオブジェクト
     * @return {Array<Object>} データオブジェクトを格納するコレクションを得る。
     * 該当するコレクションが無い場合にはnull
     */
    DataManager.getDataCollection = function(item) {
        if (DataManager.isItem(baseItem)) {
            return $dataItems;
        } else if (DataManager.isWeapon(baseItem)) {
            return $dataWeapons;
        } else if (DataManager.isArmor(baseItem)) {
            return $dataArmors;
        } else {
            return null;
        }
    };

    /**
     * ベースアイテムを取得する。
     * itemが個別アイテムでない場合にはitemが返る。
     * @param {Object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @return {Object} ベースアイテムオブジェクト(DataItem/DataWeapon/DataArmor)。
     */
    DataManager.getBaseItem = function(item) {
        if (item && item.baseItemId) {
            const dataArray = DataManager.getDataCollection(item);
            return $dataArray[item.baseItemId];
        } else {
            return item;
        }
    };

    /**
     * この個別アイテムが使用されているかどうかを取得する。
     * 
     * 既定の実装では、アイテムイベントリと装備品のいずれかに存在している場合にtrueを返す。
     * 他の場所(倉庫機能実装とか)に保管される場合には、本メソッドに使用判定を追加すること。
     * 
     * @param {Object} item アイテムオブジェクト(DataItem/DataWeapon/DataArmor)
     * @return {Boolean} 使用されている場合にはtrue, それ以外はfalse
     */
    DataManager.isIndependentItemUsed = function(item) {
        if (!DataManager.isIndependentItem(item)) {
            return false;
        }
        if ($gameParty.numItems(item) > 0) {
            return true;
        }

        // 装備しているかどうかをチェックする。
        for (let id = 1; id < $dataActors.length; id++) {
            if (!$dataActors.isActorDataExists(id)) {
                continue;
            }
            let actor = $dataActors.actor(id);
            if (actor.equips().contains(item)) {
                return true;
            }
        }

        return false;
    };

    //-------------------------------------------------------------------------
    // Game_Actors

    /**
     * アクターデータが存在するかどうかを取得する。
     * 
     * @param {Number} actorId アクターID
     * @return {Boolean} アクターデータが存在する場合にはtrue, 存在しない場合にはfalse
     */
    Game_Actors.prototype.isActorDataExists = function(actorId) {
        return this._data[actorId] ? true : false;
    };

    //-------------------------------------------------------------------------
    // Game_Party
    //

    const _Game_Party_gainItem = Game_Party.prototype.gainItem;

    /**
     * 指定されたアイテムを増減させる。
     * 個別アイテムは登録可能数を超えて追加することはできない。
     * 
     * @param {Object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @param {Number} amount 増減する量。
     * @param {Boolean} includeEquip 装備品も対象にするかどうか。
     */
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        if (DataManager.isIndependent(item)) {
            this.gainIndependentItem(item, amount, includeEquip);
        } else {
            _Game_Party_gainItem.call(this, ...arguments);
        }
    };

    /**
     * 指定されたアイテムを増減させる。
     * 個別アイテムは登録可能数を超えて追加することはできない。
     * 
     * @param {Object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @param {Number} amount 増減する量。
     * @param {Boolean} includeEquip 装備品も対象にするかどうか。
     */
    Game_Party.prototype.gainIndependentItem = function(item, amount, includeEquip = false) {
        if (amount > 0) {
            for (let i = 0; i < amount; i++) {
                const newItem = registerNewIndependentData(item);
                if (newItem) {
                    let container = this.itemContainer(item); // newItemじゃなくてitemを渡して効率化
                    container[newItem.id] = 1;
                }
            }
        } else if (amount < 0) {
            const loseCount = Math.abs(amount);
            for (let i = 0; i < amount; i++) {
                if (DataManager.isIndependentItem(item.baseItemId)) {
                    // 個別アイテム明示
                    this.removeIndependentItem(item);
                } else if (DataManager.isIndependent(item)) {
                    // ベースアイテム指定。
                    const independentItem = this.getMatchingIndependentItem(item, false);
                    if (independentItem) {
                        this.removeIndependentItem(independentItem);
                    } else if (includeEquip) {
                        // TODO : 装備品を含む場合、装備外して削除する。

                    }
                } else {
                    // ベースアイテムを減らす?ここにくることあるのかな。
                    this.removeBaseItem(item, includeEquip);
                }
            }
        }
    };

    /**
     * 個別アイテムを削除する。
     * 
     * @param {DataItem} item アイテム(DataItem/DataWeapon/DataArmor)
     */
    Game_Party.prototype.removeIndependentItem = function(item) {
        var container = this.itemContainer(item);
        container[item.id]--;
        if (container[item.id] <= 0) {
            delete container[item.id];
            if (!DataManager.isIndependentItemUsed(item)) {
                // アイテムが使われていない。
                // 登録削除する。
                DataManager.unregisterIndependentData(item);
            }
        }
    };

    /**
     * baseItemに一致する個別アイテムのインスタンスを取得する。
     * 
     * @param {DataItem} baseItem ベースアイテム(DataItem/DataWeapon/DataArmor)
     * @param {Boolean} includeEquip 装備品を対象にするかどうか
     */
    Game_Party.prototype.getMatchingIndependentItem = function(baseItem, includeEquip = false) {
        if (!baseItem) {
            return null;
        }
        const inventory = Game_Party.getInventory(item);
        const baseItemId = baseItem.id;
        for (let item of inventory) {
            if (!DataManager.isIndependentItem(item)) {
                continue;
            }
            if (item.baseItemId !== baseItemId) {
                continue;
            }
            if (includeEquip) {
                return item;
            } else if (!this.isItemEquipped(item)) {
                return item;
            }
        }
        return null;

    };

    /**
     * itemに対応するイベントリを取得する。
     * @param {DataItem} item アイテム(DataItem/DataWeapon/DataArmor)
     * @return {Array<Object>} イベントリ。アイテム/武器/防具のいずれでも無い場合にはnull.
     */
    Game_Party.prototype.getInventory = function(item) {
        if (DataManager.isItem(item)) {
            return this.items();
        } else if (DataManager.isWeapon(item)) {
            return this.weapons();
        } else if (DataManager.isArmor(item)) {
            return this.armors();
        } else {
            return null;
        }
    };
      

})();