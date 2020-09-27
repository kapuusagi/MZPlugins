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
 * @default 200
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
 * @default 100
 * @type number
 * @parent independentItemSetting
 * 
 * @param independentItemDefault
 * @text 個別アイテムデフォルト
 * @desc アイテムコレクションの個別アイテム指定デフォルト値。
 * @default false
 * @type boolean
 * @parent independentItemSetting
 * 
 * 
 * @param independentWeaponSetting
 * @text 個別武器設定
 * 
 * @param independentWeaponCount
 * @text 個別武器登録可能数。
 * @desc 登録可能な個別武器数。0で個別武器所持不可。装備品も含む。
 * @default 200
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
 * @default 100
 * @type number
 * @parent independentWeaponSetting
 * 
 * @param independentWeaponDefault
 * @text 個別武器デフォルト
 * @desc 武器コレクションの個別アイテム指定デフォルト値。
 * @default false
 * @type boolean
 * @parent independentWeaponSetting
 * 
 * 
 * @param independentArmorSetting
 * @text 個別防具設定
 * 
 * @param independentArmorCount
 * @text 個別防具登録可能数。
 * @desc 登録可能な個別防具数。0で個別防具所持不可。装備品も含む。
 * @default 200
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
 * @default 100
 * @type number
 * @parent independentArmorSetting
 *
 * @param independentArmorDefault
 * @text 個別防具デフォルト
 * @desc 防具コレクションの個別アイテム指定デフォルト値。
 * @default false
 * @type boolean
 * @parent independentArmorSetting
 * 
 * @param gainFailureEventId
 * @text アイテム加算失敗時イベントID
 * @desc 空きイベントリが無くて加算に失敗した場合に呼び出すコモンイベントID。
 * @default 0
 * @type common_event
 *  
 * @help 
 * 道具/武器/防具を個別化するためのプラグイン。
 * Yanfly氏がMVでItemCoreとしてリリースしていたプラグインの、
 * 個別アイテムを実現するための機能をMZ向けに用意したもの。
 * 名前のカスタマイズ機能だとか、ブーストカウント用のフィールドだとかは用意していない。
 * ItemCoreを使っていた他のプラグインをあんまり書き換えなくていいように、
 * IndependentItemの名前はそのまま使用した。
 * 
 * 使用する時は
 * independent***Count : 個別アイテム登録可能数
 * independent***StartIndex : データコレクション上の個別アイテム登録開始ID値。
 * independent***StockCount : パーティーとしての所持可能アイテム数。
 * 
 * independent***StockCOuntに、全てのアクターの装備可能数を加えたものが、
 * independentItemCountより小さくなるようにすること。
 * 
 * 
 * 個別アイテムデータの削除タイミングについて
 * Game_Party.gainItemでやろうとしたが、装備変更の場合など、
 * 減らしてから装備とか発生する場合に、
 * 装備する前にデータが削除されてしまうため止めた。
 * 代わりに以下のタイミングで削除される。
 *     ・セーブデータ読み出し時
 *       (保存時に未使用なら保存しない。
 *        メモリ上は、読み出し時に未使用品は復元されないことで対応する)
 *     ・新しい個別アイテム登録時、未使用IDがあれば使用する。
 *       ショップでの複数個購入時に影響が出るはず。
 * 処理が重そうなら実装を見直す。
 * 数が増えると多分影響が大きくなるんじゃ無いかな。
 * 
 * インタプリタからのgainItemで増やしたとき、
 * 所持最大数を超える場合には加算されなくなる。
 * この場合、 gainFailureEventId で指定したコモンイベントで通知をうけるか、
 * $gameTemp.isGailFailure()で結果を得られる。
 * 
 * ■ プラグイン開発者向け
 * 機能拡張するなら、以下のメソッドをフックする。
 * DataManager.initializeIndependentCommon(newItem:object, baseItem:object) : void
 *    新しい個別アイテム生成時の初期化処理を行う。(Item/Weapon/Armor)
 * DataManager.initializeIndependentItem(newItem:DataItem, baseItem:DataItem) : void 
 *    新しい個別アイテム生成時の初期化処理を行う。(item)
 * DataManager.initializeIndependentWeapon(newItem:DataWeapon, baseItem:DataWeapon) : void
 *    新しい個別アイテム生成時の初期化処理を行う。(weapon)
 * DataManager.initializeIndependentArmor(newItem:DataArmor, baseItem:DataArmor) : void
 *    新しい個別アイテム生成時の初期化処理を行う。(armor)
 * DataManager.reinitializeIndependentItem(item:object) : void
 *    itemで指定される個別アイテムを再初期化する。
 * 
 * よく使うメソッドは次の通り。
 * DataManager.isIndependent(item:object) : boolean
 *    itemが個別アイテムをサポートする種類かどうかを判定する。
 * DataManager.isIndependentItem(item:object) : boolean
 *    item自体が個別アイテムかどうかを判定する。
 * DataManager.getBaseItem(item:object) : object
 *    itemのベースアイテムを得る。
 *    itemが個別アイテムをサポートしていない場合、itemが返る。
 * ============================================
 * ノートタグ
 * ============================================
 * <independent>
 *    アイテム/武器/防具に適用可能。
 *    入手時、個別アイテムとして加算されるものとして処理される。
 *    未定義または<independent:false>で個別無効。
 * 
 * <allowCollectSell>
 *    ショップでの売却時、まとめて売ることを可能にする。
 *    例えば個別アイテムの混紡10個を一度の操作で10個売れるようにする。
 *    装備はともかく、ポーションなどはまとめて売りたいよね？
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.4.0 アイテム所持数を超えて入手できなかった場合に、
 *               コモンイベント及び条件分岐で通知する仕組みを追加した。
 *               アイテム所持可能数の処理が誤っていたので修正した。
 * Version.0.3.1 個別アイテムとして扱われない場合がある不具合を修正。
 *               個別道具が使用できない不具合を修正。
 *               装備品の一致判定が誤っていたのを修正。
 * Version.0.3.0 プラグイン拡張用に個別アイテムの再初期化メソッドを追加した。
 * Version.0.2.0 装備したときにイベントリから削除されない問題を修正した。
 *               コメント誤りを修正した。
 *               initializeIndependentXXX の引数にbaseItemを渡すように変更した。
 * Version.0.1.1 アイテム数を取得するメソッドがエラーになる問題を修正した。
 * Version.0.1.0 作成開始
 */

(() => {
    const pluginName = "Kapu_IndependentItem";
    const parameters = PluginManager.parameters(pluginName);
    const independentItemCount = Number(parameters["independentItemCount"]) || 0;
    const independentItemStartIndex = Number(parameters["independentItemStartIndex"]) || 1000;
    const independentItemStockCount = Number(parameters["independentItemStockCount"]) || 200;
    const independentItemDefault = Boolean(parameters["independentItemDefault"]) || false;
    const independentWeaponCount = Number(parameters["independentWeaponCount"]) || 0;
    const independentWeaponStartIndex = Number(parameters["independentWeaponStartIndex"]) || 1000;
    const independentWeaponStockCount = Number(parameters["independentWeaponStockCount"]) || 200;
    const independentWeaponDefault = Boolean(parameters["independentWeaponDefault"]) || false;
    const independentArmorCount = Number(parameters["independentArmorCount"]) || 0;
    const independentArmorStartIndex = Number(parameters["independentArmorStartIndex"]) || 1000;
    const independentArmorStockCount = Number(parameters["independentArmorStockCount"]) || 200;
    const independentArmorDefault = Boolean(parameters["independentArmorDefault"]) || false;
    const gainFailureEventId = Number(parameters["gainFailureEventId"]) || 0;

    //-------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    /**
     * Scene_Bootを開始する。
     */
    Scene_Boot.prototype.start = function () {
        if ($dataItems.length >= independentItemStartIndex) {
            throw new Error("independentItemStartIndex is illegal. (< $dataItem.length)");
        }
        DataManager.processIndependentNotetag($dataItems, independentItemDefault);
        if ($dataWeapons.length >= independentWeaponStartIndex) {
            throw new Error("independentWeaponStartIndex is illegal. (< $dataWeapons.length");
        }
        DataManager.processIndependentNotetag($dataWeapons, independentWeaponDefault);
        if ($dataArmors.length >= independentArmorStartIndex) {
            throw new Error("independentArmorStartIndex is illegal. (< $dataArmors.length");
        }
        DataManager.processIndependentNotetag($dataArmors, independentArmorDefault);

        _Scene_Boot_start.call(this);
    };
    //-------------------------------------------------------------------------
    // DataManager

    /**
     * 個別アイテムノートタグを処理する。
     * 
     * @param {Array<Object>} dataArray データ配列
     * @param {Boolean} independent 個別アイテムかどうかのデフォルト値。
     */
    DataManager.processIndependentNotetag = function(dataArray, independent) {
        for (let item of dataArray) {
            if (item) {
                if (!item.meta.independent) {
                    item.meta.independent = independent;
                }
            }
        }

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
                if (item && DataManager.isIndependentItemUsed(item)) {
                    saveDataContents.push(item);
                }
            }
        }
        return saveDataContents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    /**
     * セーブデータを展開する。
     * 
     * @param {Object} contents 保存コンテンツ
     */
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, ...arguments);
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
     * アイテムが個別アイテムとして扱うものかどうかを取得する。
     * 
     * @param {Object} item ベースまたは個別アイテム。(DataItem/DataWeapon/DataArmor)
     * @return {Boolean} 個別アイテムの場合にはtrue, それ以外はfalse.
     */
    DataManager.isIndependent = function(item) {
        if (!item) {
            return false; // データなし。
        }
        if (DataManager.isBattleTest()) {
            return false; // 戦闘テストでは個別アイテム無効。
        }
        if (!item.meta.independent) {
            return false; // 個別アイテムでない。
        }

        return true;
    };

    /**
     * itemが個別アイテムかどうかを判定する。
     * 
     * @param {Object} item ベースアイテムまたは個別アイテム(DataItem/DataWeapon/DataArmor)
     * @return {Boolean} 個別アイテムの場合にはtrue, それ以外はfalse
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
     * 
     * @param {DataItem} item ベースアイテムまたは個別アイテム
     * @return {DataItem} 登録したデータのインスタンス。
     */
    DataManager.registerNewIndependentItem = function(item) {
        const baseItem = DataManager.getBaseItem(item);
        const newItemId = DataManager.getUnusedId($dataItems,
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
     * 新しい個別アイテム/個別武器/個別防具を初期化する。
     * 全ての項目で共通の処理を行う。
     * 他のプラグインでフックし、個別アイテムを使って使用したい機能を実現することを想定する。
     * 
     * @param {DataItem} newItem 新しい個別アイテム
     * @param {DataItem} baseItem ベースアイテム
     */
    DataManager.initializeIndependentCommon = function(newItem, baseItem) {

    };

    /**
     * newItemIdを割り当てた新しい個別アイテムを作成する。データベースへは登録しない。
     * 
     * @param {Number} newItemId 新しい個別アイテムに割り当てるID。
     * @param {DataItem} baseItem ベースアイテム(DataItem)
     * @return {DataItem} 作成した個別アイテムオブジェクト。
     */
    DataManager.createIndependentItem = function(newItemId, baseItem) {
        let newItem = JsonEx.makeDeepCopy(baseItem);
        newItem.id = newItemId;
        newItem.baseItemId = baseItem.id;
        newItem.note = "";
        DataManager.initializeIndependentCommon(newItem, baseItem);
        DataManager.initializeIndependentItem(newItem, baseItem);
        return newItem;
    };
 
    /**
     * 新しい個別アイテムを初期化する。
     * 他のプラグインでフックし、個別アイテムを使って使用したい機能を実現することを想定する。
     * 
     * @param {DataItem} newItem 新しい個別アイテム
     * @param {DataItem} baseItem 元となるアイテムデータ
     */
    DataManager.initializeIndependentItem = function(newItem, baseItem) {

    };

    /**
     * 新しい武器を登録する。所持数コンテナは変更しない。
     * 
     * @param {DataWeapon} item ベースアイテム/個別アイテム
     * @return {DataWeapon} 登録したデータのインスタンス。
     */
    DataManager.registerNewIndependentWeapon = function(item) {
        const baseItem = DataManager.getBaseItem(item);
        const newItemId = DataManager.getUnusedId($dataWeapons,
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
     * newItemIdを割り当てた新しい個別武器を作成する。
     * データベースへは登録しない。
     * 
     * @param {Number} newItemId 新しい個別アイテムに割り当てるID。
     * @param {DataWeapon} baseItem ベースアイテム
     * @return {DataWeapon} 作成した個別武器オブジェクト。
     */
    DataManager.createIndependentWeapon = function(newItemId, baseItem) {
        let newItem = JsonEx.makeDeepCopy(baseItem);
        newItem.id = newItemId;
        newItem.baseItemId = baseItem.id;
        newItem.note = "";
        DataManager.initializeIndependentCommon(newItem, baseItem);
        DataManager.initializeIndependentWeapon(newItem, baseItem);
        return newItem;
    };

    /**
     * 新しい個別武器を初期化する。
     * 他のプラグインでフックし、個別武器を使って使用したい機能を実現することを想定する。
     * 
     * @param {DataWeapon} newWeapon 新しい個別武器
     * @param {DataWeapon} baseWeapon ベース武器データ
     */
    DataManager.initializeIndependentWeapon = function(newWeapon, baseWeapon) {

    };

    /**
     * 新しい防具を登録する。所持数コンテナは変更しない。
     * 
     * @param {DataArmor} item ベースアイテムまたは個別アイテム
     * @return {DataArmor} 登録したデータのインスタンス。
     */
    DataManager.registerNewIndependentArmor = function(item) {
        const baseItem = DataManager.getBaseItem(item);
        const newItemId = DataManager.getUnusedId($dataArmors,
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
     * 
     * @param {Number} newItemId 新しい個別アイテムに割り当てるID。
     * @param {DataArmor} baseItem ベースアイテム
     * @return {DataArmor} 作成した個別防具オブジェクト。
     */
    DataManager.createIndependentArmor = function(newItemId, baseItem) {
        let newItem = JsonEx.makeDeepCopy(baseItem);
        newItem.id = newItemId;
        newItem.baseItemId = baseItem.id;
        newItem.note = "";
        DataManager.initializeIndependentCommon(newItem, baseItem);
        DataManager.initializeIndependentArmor(newItem, baseItem);
        return newItem;
    };

    /**
     * 新しい個別防具を初期化する。
     * 他のプラグインでフックし、個別防具を使って使用したい機能を実現することを想定する。
     * @param {DataArmor} newArmor 新しい個別防具
     * @param {DataArmor} baseArmor ベース防具データ
     */
    DataManager.initializeIndependentArmor = function(newArmor, baseArmor) {

    };

    /**
     * 指定したデータコレクションの空きIDを得る。
     * 
     * @param {Array<Object>} dataArray データコレクション
     * @param {Number} startIndex 開始インデックス
     * @param {Number} maxCount 最大数
     * @return {Number} インデックス番号。空きがない場合には-1
     */
    DataManager.getUnusedId = function(dataArray, startIndex, maxCount) {
        if (startIndex > 0) {
            for (let i = 0; i < maxCount; i++) {
                const id = startIndex + i;
                let item = dataArray[id];
                if (!item || !DataManager.isIndependentItemUsed(item)) {
                    // 割り当てが無いか、このアイテムは空きである。
                    return id;
                }
            }
        }
        return -1;
    };

    /**
     * itemで指定したオブジェクトを格納するコレクションを取得する。
     * 
     * @param {Object} item ベースアイテム/個別アイテム
     * @return {Array<Object>} データオブジェクトを格納するコレクションを得る。
     * 該当するコレクションが無い場合にはnull
     */
    DataManager.getDataCollection = function(item) {
        if (DataManager.isItem(item)) {
            return $dataItems;
        } else if (DataManager.isWeapon(item)) {
            return $dataWeapons;
        } else if (DataManager.isArmor(item)) {
            return $dataArmors;
        } else {
            return null;
        }
    };

    /**
     * ベースアイテムを取得する。
     * itemが個別アイテムでない場合にはitemが返る。
     * 
     * @param {Object} item ベースアイテム/個別アイテム(DataItem/DataWeapon/DataArmor)
     * @return {Object} ベースアイテムオブジェクト(DataItem/DataWeapon/DataArmor)。
     */
    DataManager.getBaseItem = function(item) {
        if (item && item.baseItemId) {
            const dataArray = DataManager.getDataCollection(item);
            return dataArray[item.baseItemId];
        } else {
            return item;
        }
    };

    /**
     * この個別アイテムが使用されているかどうかを取得する。
     * 
     * 既定の実装では、アイテムイベントリとアクターデータ(パーティー外も含む)の装備品の
     * いずれかに存在している場合にtrueを返す。
     * 他の場所(倉庫機能実装とか)に保管される場合には、本メソッドに使用判定を追加すること。
     * 
     * @param {Object} independentItem 個別アイテムオブジェクト(DataItem/DataWeapon/DataArmor)
     * @return {Boolean} 使用されている場合にはtrue, それ以外はfalse
     */
    DataManager.isIndependentItemUsed = function(independentItem) {
        if (!DataManager.isIndependentItem(independentItem)) {
            return false;
        }
        if ($gameParty.numItems(independentItem) > 0) {
            return true;
        }

        // 装備しているかどうかをチェックする。
        for (let id = 1; id < $dataActors.length; id++) {
            if (!$gameActors.isActorDataExists(id)) {
                continue;
            }
            let actor = $gameActors.actor(id);
            if (actor.isEquipped(independentItem)) {
                return true;
            }
        }

        return false;
    };

    /**
     * baseItemに一致する個別アイテムのインスタンスを得る。
     * 
     * @param {DataItem} baseItem ベースアイテム(DataItem/DataWeapon/DataArmor)
     * @param {Boolean} includeEquip 装備品を対象にするかどうか
     * @return {DataItem} 個別アイテム(DataItem/DataWeapon/DataArmor)
     */
    DataManager.getMatchingIndependentItem = function(baseItem, includeEquip = false) {
        const partyIndependentItem = $gameParty.getMatchingIndependentItem(baseItem, includeEquip);
        if (partyIndependentItem) {
            return partyIndependentItem;
        } else if (includeEquip) {
            // アクターが装備しているかどうかをチェックする。
            for (let id = 1; id < $dataActors.length; id++) {
                if (!$gameActors.isActorDataExists(id)) {
                    continue;
                }
                let actor = $gameActors.actor(id);
                const equippedItem = actor.equips().find(item => {
                    if (item) {
                        return false;
                    }
                    return (item.baseItemId && (item.baseItemId === baseItem.id));
                });
                if (equippedItem) {
                    return equippedItem;
                }
            }
        }
        return null;
    };
    /***
     * newItemのデータをbaseItemのデータで上書きする。
     * 上書きされるのはid以外のbaseItemで持っているメンバー全て。traitも含めて再設定される。
     * 
     * @param {Object} 新しいアイテム
     * @param {Object} ベースアイテム
     */
    const _resetIndependentItemData = function(item, baseItem) {
        for (const key of Object.keys(baseItem)) {
            if (key !== "id") {
                delete item[key];
            }
        }
        for (const key of Object.keys(baseItem)) {
            if (key !== "id") {
                item[key] = JsonEx.makeDeepCopy(baseItem[key]);
            }
        }
    };

    /**
     * 個別アイテムの性能を再初期化する。
     * id以外のベースアイテムが持つパラメータは全て再初期化される。
     * 
     * @param {Object} item アイテム (DataItem/DataWeapon/DataArmor)
     */
    DataManager.reinitializeIndependentItem = function(item) {
        if (!DataManager.isIndependentItem(item)) {
            return;
        }
        const baseItem = DataManager.getBaseItem(item);
        _resetIndependentItemData(item, baseItem);
        DataManager.initializeIndependentCommon(item, baseItem);
        if (DataManager.isItem(item)) {
            DataManager.initializeIndependentItem(item, baseItem);
        } else if (DataManager.isWeapon(item)) {
            DataManager.initializeIndependentWeapon(item, baseItem);
        } else if (DataManager.isArmor(item)) {
            DataManager.initializeIndependentArmor(item, baseItem);
        }
    };

    /**
     * ベースアイテムが一致してるかどうかを取得する。
     * 
     * @param {Object} item1 アイテム
     * @param {Object} item2 アイテム
     * 
     * @return {Boolean} 一致している場合にはtrue, それ以外はfalse
     */
    DataManager.isBaseItemMatch = function(item1, item2) {
        if ((DataManager.isItem(item1) !== DataManager.isItem(item2))
                || (DataManager.isWeapon(item1) !== DataManager.isWeapon(item2))
                || (DataManager.isArmor(item1) !== DataManager.isArmor(item2))) {
            return false;
        }
        const baseItemId1 = item1.baseItemId || item1.id;
        const baseItemId2 = item2.baseItemId || item2.id;
        return baseItemId1 === baseItemId2;
    };

    //-------------------------------------------------------------------------
    // Game_Temp
    _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._gainItemFailure = false;
    };
    /**
     * インタプリタからの要求でアイテムの加算に成功したかどうかを設定する。
     * 
     * @param {Boolean} isFailure 加算に失敗した場合にはtrue, それ以外はfalse
     */
    Game_Temp.prototype.setItemGainFailure = function(isFailure) {
        this._gailItemFailure = isFailure;
        if (isFailure && gainFailureEventId) {
            if (!this._commonEventQueue.contains(gainFailureEventId)) {
                this.reserveCommonEvent(gainFailureEventId);
            }
        }
    };
    /**
     * インタプリタからの要求でアイテムの加算に成功したかどうかを取得する。
     * 
     * @return {Boolean} 加算に失敗した場合にはtrue, それ以外はfalse
     */
    Game_Temp.prototype.isItemGainFailure = function() {
        return this._gailItemFailure;
    };

    //-------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_isEquipped = Game_Actor.prototype.isEquipped;
    /**
     * アクターが指定された装備を装備中かどうかを判定する。
     * 
     * @param {Object} item 装備品(DataWeapon/DataArmor)
     * @return {Boolean} 装備中の場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.isEquipped = function(item) {
        if (DataManager.isIndependent(item) && !item.baseItemid) {
            // 個別アイテムのベースアイテムが指定された場合、
            // IDが一致しているものを持っているかどうかで判定する。
            return (this.findEquippedSlot(item) >= 0);
        } else {
            // それ以外はインスタンスの一致判定
            return _Game_Actor_isEquipped.call(this, ...arguments);
        }
    };

    const _Game_Actor_discardEquip = Game_Actor.prototype.discardEquip;

    /**
     * アクターの装備品を捨てる。
     * 
     * @param {Object} item 装備品(DataWeapon/DataArmor)
     */
    Game_Actor.prototype.discardEquip = function(item) {
        if (DataManager.isIndependent(item) && !item.baseItemid) {
            // 個別アイテムのベースアイテムが指定された場合、
            // IDが一致しているものを削除する。
            const slotId = this.findEquippedSlot(item);
            if (slotId >= 0) {
                this._equips[slotId].setObject(null);
            }
        } else {
            _Game_Actor_discardEquip.call(this, ...arguments);
        }
    };

    /**
     * 装備中スロット番号を得る。
     * 
     * @param {Object} baseItem ベースアイテム(DataWeapon/DataArmor)
     * @return {Number} 装備中スロット番号。該当するものが無い場合には-1。
     */
    Game_Actor.prototype.findEquippedSlot = function(baseItem) {
        const equips = this.equips();
        for (let slotId = 0; slotId < equips.length; slotId++) {
            const equippedItem = equips[slotId];
            if (!equippedItem) {
                continue;
            }
            if (DataManager.isBaseItemMatch(equippedItem, baseItem)) {
                return slotId;
            }
        }
        return -1;
    };

    const _Game_Actor_changeEquipById = Game_Actor.prototype.changeEquipById;

    /**
     * 装備を変更する。
     * パーティーの所持品にitemIdで指定するアイテムが無い場合には変更できない。
     * 
     * @param {Number} etypeId 装備タイプID
     * @param {Number} itemId アイテムID
     */
    Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
        const slotId = etypeId - 1;
        const dataCollections = (this.equipSlots()[slotId] === 1) ? $dataWeapons : $dataArmors;
        const baseItem = dataCollections[itemId];
        if (DataManager.isIndependent(baseItem)) {
            const independentItem = $gameParty.getMatchingIndependentItem(baseItem, false);
            if (independentItem) {
                // 該当装備品があった
                this.changeEquip(slotId, independentItem);
            }
        } else {
            _Game_Actor_changeEquipById.call(this, ...arguments);
        }
    };



    //-------------------------------------------------------------------------
    // Game_Item
    //
    const _GameItem_setEquip = Game_Item.prototype.setEquip;

    /**
     * itemIdで指定される装備品をセットする。
     * 
     * @param {Boolean} isWeapon 武器かどうか
     * @param {Number} itemId アイテムID(装備なしは0) 
     */
    Game_Item.prototype.setEquip = function(isWeapon, itemId) {
        if (itemId === 0) {
            _GameItem_setEquip.call(this, ...arguments);
            return;
        }
        if (isWeapon && (itemId < independentWeaponStartIndex)
                && DataManager.isIndependent($dataWeapons[itemId])) {
            const independentWeapon = DataManager.registerNewIndependentWeapon($dataWeapons[itemId]);
            const newItemId = independentWeapon ? independentWeapon.id : 0;
            _GameItem_setEquip.call(this, isWeapon, newItemId);
        } else if (!isWeapon && (itemId < independentArmorStartIndex)
                && DataManager.isIndependent($dataArmors[itemId])) {
            const independentArmor = DataManager.registerNewIndependentArmor($dataArmors[itemId]);
            const newItemId = independentArmor ? independentArmor.id : 0;
            _GameItem_setEquip.call(this, isWeapon, newItemId);
        } else {
            _GameItem_setEquip.call(this, ...arguments);
        }
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
     * @param {Object} item  ベースアイテム/個別アイテム(DataItem/DataWeapon/DataArmor)
     * @param {Number} amount 増減する量。
     * @param {Boolean} includeEquip 装備品も対象にするかどうか。
     */
    Game_Party.prototype.gainIndependentItem = function(item, amount, includeEquip = false) {
        if (amount > 0) {
            for (let i = 0; i < amount; i++) {
                const newItem = DataManager.registerNewIndependentData(item);
                if (newItem) {
                    let container = this.itemContainer(item); // newItemじゃなくてitemを渡して効率化
                    container[newItem.id] = 1;
                }
            }
        } else if (amount < 0) {
            const loseCount = Math.abs(amount);
            for (let i = 0; i < loseCount; i++) {
                if (DataManager.isIndependentItem(item)) {
                    // 個別アイテム明示
                    this.removeIndependentItemFromInventory(item);
                } else if (DataManager.isIndependent(item)) {
                    // 個別アイテムと設定されたベースアイテム指定。
                    const independentItem = this.getMatchingIndependentItem(item, false);
                    if (independentItem) {
                        this.removeIndependentItemFromInventory(independentItem);
                    } else if (includeEquip) {
                        // 装備品を含む場合、装備外して削除する。
                        this.discardEquip(item, 1);
                    }
                }
            }
        }
    };

    /**
     * 個別アイテムをイベントリから削除する。
     * 
     * @param {DataItem} independentItem 個別アイテム(DataItem/DataWeapon/DataArmor)
     */
    Game_Party.prototype.removeIndependentItemFromInventory = function(independentItem) {
        var container = this.itemContainer(independentItem);
        container[independentItem.id]--;
        if (container[independentItem.id] <= 0) {
            delete container[independentItem.id];
        }
    };


    /**
     * パーティーが所持する、baseItemに一致する個別アイテムのインスタンスを取得する。
     * パーティーに参加していないアクターの個別アイテムのインスタンスは検索されない。
     * パーティーに参加していないアクターの個別アイテムも含めて検索する場合、
     * DataManager.getMatchingIndependentItemを使用すること。
     * 
     * @param {DataItem} baseItem ベースアイテム(DataItem/DataWeapon/DataArmor)
     * @param {Boolean} includeEquip 装備品を対象にするかどうか
     * @return {DataItem} 個別アイテム(DataItem/DataWeapon/DataArmor)
     */
    Game_Party.prototype.getMatchingIndependentItem = function(baseItem, includeEquip = false) {
        if (!baseItem) {
            return null;
        }
        const container = this.itemCollections(baseItem);
        const baseItemId = baseItem.id;
        for (let item of container) {
            if (!DataManager.isIndependentItem(item)) {
                continue;
            }
            if (item.baseItemId !== baseItemId) {
                continue;
            }
            if (includeEquip) {
                return item;
            } else if (!this.isAnyMemberEquipped(item)) {
                return item;
            }
        }
        return null;
    };

    /**
     * itemと同じ種類のアイテムについて、パーティーが所持しているコレクションを得る。
     * itemが武器なら、weapons()が返る。
     * 
     * @param {Object} item ベース/個別アイテム(DataItem/DataWeapon/DataArmor)
     * @return {Array<Object>}
     */
    Game_Party.prototype.itemCollections = function(item) {
        if (DataManager.isItem(item)) {
            return this.items();
        } else if (DataManager.isWeapon(item)) {
            return this.weapons();
        } else if (DataManager.isArmor(item)) {
            return this.armors();
        }

        return null;
    };

    const _Game_Party_items = Game_Party.prototype.items;

    /**
     * パーティーが所持しているアイテムのコレクションを得る。
     * 
     * @return {Array<DataItem>} パーティー所持品の配列
     */
    Game_Party.prototype.items = function () {
        let results = _Game_Party_items.call(this);
        results.sort(this.independentItemSort);
        return results;
    };
    
    const _Game_Party_weapons = Game_Party.prototype.weapons;

    /**
     * パーティーが所持している武器のコレクションを得る。
     * 装備中のものは含まれない。
     * 
     * @return {Array<DataWeapon>} 武器のコレクション
     */
    Game_Party.prototype.weapons = function() {
        var results = _Game_Party_weapons.call(this);
        results.sort(this.independentItemSort);
        return results;
    };
    
    const _Game_Party_armors = Game_Party.prototype.armors;

    /**
     * パーティーが所持している防具のコレクションを得る。
     * 装備中のものは含まれない。
     * 
     * @return {Array<DataArmor>} 防具のコレクション
     */
    Game_Party.prototype.armors = function() {
        var results = _Game_Party_armors.call(this);
        results.sort(this.independentItemSort);
        return results;
    };
    
    /**
     * アイテムを返す際のソートメソッド。
     * 
     * 必要に応じてオーバーライドすること。
     * 
     * @param {Object} item1 アイテム(DataItem/DataWeapon/DataArmor)
     * @param {Object} item2 アイテム(DataItem/DataWeapon/DataArmor)
     * @return {Number} item1がitem2より前の場合には負数、item1がitem2より後の場合には正数、同値なら0。
     */
    Game_Party.prototype.independentItemSort = function(item1, item2) {
        const id1 = (item1.baseItemId) ? item1.baseItemId : item1.id;
        const id2 = (item2.baseItemId) ? item2.baseItemId : item2.id;
        if (id1 < id2) {
            return -1;
        } else if (id1 > id2) {
            return 1;
        } else {
            return 0;
        }
    };
    
    const _Game_Party_maxItems = Game_Party.prototype.maxItems;

    /**
     * パーティーが所持可能なitemの数を得る。
     *
     * @param {Object} item アイテム
     * @return {Number} 所持可能な最大数。
     */
    Game_Party.prototype.maxItems = function(item) {
        if (DataManager.isIndependent(item)) {
            return this.getMaxIndependentItemCount(item);
        } else {
            return _Game_Party_maxItems.call(this, ...arguments);
        }
    };

    const _Game_Party_numItems = Game_Party.prototype.numItems;

    /**
     * アイテムの所持数を得る。
     * 
     * 個別アイテムの場合、ベースアイテムが指定された場合には
     * マッチする個別アイテムの合計を返す。
     * 非個別アイテムまたは個別アイテムのインスタンスが指定された場合には
     * 所持数を返す。
     * 
     * イベントや判定で、～のアイテムをxx個持っているか？の判定でうまく処理出来るようにするため、
     * このような実装とした。
     * 
     * @param {Object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @return {Number} アイテムの所持数
     */
    Game_Party.prototype.numItems = function(item) {
        if (DataManager.isIndependent(item) && !item.baseItemId) {
            // 個別アイテムのベースアイテムが指定された場合。
            // カウントして返す。
            return this.getMathingItemCount(item);
        } else {
            return _Game_Party_numItems.call(this, ...arguments);
        }
    };

    /**
     * baseItemに一致するアイテム数を得る。
     * アクターの装備品は含まない。
     * 
     * @param {Object} baseItem ベースアイテム(DataItem/DataWeapon/DataArmor)
     * @return {Number} 個別アイテムの数
     */
    Game_Party.prototype.getMathingItemCount = function(baseItem) {
        const items = this.itemCollections(baseItem);
        // 種類は一致しているので、id, baseItemIdだけ見れば良い。
        const baseItemId = baseItem.id;
        let numItems = 0;
        for (const item of items) {
            if (!item) {
                continue;
            }
            if ((item.id === baseItemId) || (item.baseItemId && (item.baseItemId === baseItemId))) {
                numItems++;
            }
        }
        return numItems;
    };

    /**
     * 最大アイテム数を得る。
     * 
     * @param {Object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @return {Number} 最大アイテム数
     */
    Game_Party.prototype.getMaxIndependentItemCount = function(item) {
        const specifiedMaxCount = _Game_Party_maxItems.call(item); // データベース上で指定されている最大数
        const baseItem = DataManager.getBaseItem(item);
        if (DataManager.isItem(baseItem)) {
            const itemInventoryCount = this.useableItemInventoryCount() + this.numItems(baseItem);
            return Math.min(specifiedMaxCount, itemInventoryCount);
        } else if (DataManager.isWeapon(baseItem)) {
            const itemInventoryCount = this.useableWeaponInventoryCount() + this.numItems(baseItem);
            return Math.min(specifiedMaxCount, itemInventoryCount);
        } else if (DataManager.isArmor(baseItem)) {
            const itemInventoryCount = this.useableArmorInventoryCount() + this.numItems(baseItem);
            return Math.min(specifiedMaxCount, itemInventoryCount);
        } else {
            return 0;
        }
    };

    const _Game_Party_hasItem = Game_Party.prototype.hasItem;
    /**
     * itemで指定されるアイテムを持っているかどうか判定する。
     * 
     * @param {Object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @param {Boolean} includeEquip 装備品も含めて検索する場合にはtrue, それ以外はfalse
     * @return {Boolean} アイテムを持っている場合にはtrue, それ以外はfalse.
     */
    Game_Party.prototype.hasItem = function (item, includeEquip) {
        if (DataManager.isIndependent(item)) {
            const baseItem = DataManager.getBaseItem(item);
            var independentItem = this.getMatchingIndependentItem(baseItem, includeEquip);
            return (independentItem !== null);
        } else {
            return _Game_Party_hasItem.call(this, ...arguments);
        }
    };

    const _Game_Party_isAnyMemberEquipped = Game_Party.prototype.isAnyMemberEquipped;
    /**
     * itemで指定されるアイテムを装備しているかどうかを判定する。
     * ベーススクリプトにて、オブジェクトの一致判定がベタ書きされていたのでフックする。
     * 
     * @param {Object} item アイテム(DataWeapon/DataArmor)
     * @return {Boolean} 装備している場合にはtrue, それ以外はfalse
     */
    Game_Party.prototype.isAnyMemberEquipped = function(item) {
        if (DataManager.isIndependent(item)) {
            // Note: ベーススクリプトの処理がID一致をべた書きしてるので、
            //       Game_Actor.isEquipped()をコールして調べるように変更する。
            return this.members().some(actor => actor.isEquipped(item));
        } else {
            return _Game_Party_isAnyMemberEquipped.call(this, ...arguments);
        }
    };

    /**
     * イベントリにある個別アイテムのリストを得る。
     * 
     * @return {Array<DataItem>} 個別アイテムのリスト
     */
    Game_Party.prototype.independentItems = function() {
        return this.items().filter(item => DataManager.isIndependentItem(item));
    };

    /**
     * イベントリにある個別武器のリストを得る。
     * 
     * @return {Array<DataWeapon>} 個別武器のリスト
     */
    Game_Party.prototype.independentWeapons = function() {
        return this.weapons().filter(weapon => DataManager.isIndependentItem(weapon));
    };

    /**
     * イベントリにある個別防具のリストを得る。
     * 
     * @return {Array<DataArmor>} 個別防具のリスト
     */
    Game_Party.prototype.independentArmors = function() {
        return this.armors().filter(armor => DataManager.isIndependentItem(armor));
    };

    /**
     * 使用可能な個別アイテムのイベントリ数を得る。
     * 
     * @return {Number} イベントリ数
     */

    Game_Party.prototype.useableItemInventoryCount = function() {
        return independentItemStockCount - this.independentItems().length;
    };

    /**
     * 使用可能な個別武器のイベントリ数を得る。
     * 
     * @return {Number} イベントリ数
     */

    Game_Party.prototype.useableWeaponInventoryCount = function() {
        return independentWeaponStockCount - this.independentWeapons().length;
    };

    /**
     * 使用可能な個別防具のイベントリ数を得る。
     * 
     * @return {Number} イベントリ数
     */
    Game_Party.prototype.useableArmorInventoryCount = function() {
        return independentArmorStockCount - this.independentArmors().length;
    };

    //-------------------------------------------------------------------------
    /**
     * アイテムの増減コマンドを処理する。
     * 
     * @param {Object} params パラメータ
     * !!!overwrite!!!
     */
    Game_Interpreter.prototype.command126 = function(params) {
        let value = this.operateValue(params[1], params[2], params[3]);
        this.commandGainItem($dataItems[params[0]], value, false);
        return true;
    };

    /**
     * 武器の増減コマンドを処理する。
     * 
     * @param {Object} params パラメータ
     * !!!overwrite!!!
     */
    Game_Interpreter.prototype.command127 = function(params) {
        let value = this.operateValue(params[1], params[2], params[3]);
        this.commandGainItem($dataWeapons[params[0]], value, params[4]);
        return true;
    };

    /**
     * 防具の増減コマンドを処理する。
     * 
     * @param {Object} params パラメータ
     * !!!overwrite!!!
     */
    Game_Interpreter.prototype.command128 = function(params) {
        let value = this.operateValue(params[1], params[2], params[3]);
        this.commandGainItem($dataArmors[params[0]], value, params[4]);
        return true;
    };


    /**
     * アイテム増減コマンドを処理する。
     * 
     * @param {Object} item アイテムデータ(DataItem/DataWeapon/DataArmor)
     * @param {Number} value 増減する値
     * @param {Boolean} includesEquip 装備を品を含めるかどうか。
     */
    Game_Interpreter.prototype.commandGainItem = function(item, value, includesEquip) {
        const maxAppendCount = $gameParty.maxItems(item) - $gameParty.numItems(item);
        const isGainFailure = (value > 0) && (value > maxAppendCount);
        if (isGainFailure) {
            value = maxAppendCount;
        }
        $gameTemp.setItemGainFailure(isGainFailure);
        if (value !== 0) {
            $gameParty.gainItem(item, value, includesEquip);
        }
    };

    //-------------------------------------------------------------------------
    // Secene_Shop

    const _Scene_Shop_maxSell = Scene_Shop.prototype.maxSell;
    
    /**
     * 最大売却可能数を取得する。
     * @return {Number} 最大売却可能数
     */
    Scene_Shop.prototype.maxSell = function() {
        const item = this._item;
        if (DataManager.isIndependent(item) && item.baseItemid) {
            // 個別アイテムが指定された場合
            const baseItem = DataManager.getBaseItem(item);
            if (item.meta.allowCollectSell) {
                return $gameParty.numItems(baseItem);
            } else {
                return 1;
            }
        }

        return _Scene_Shop_maxSell.call(this);
    };
        
})();