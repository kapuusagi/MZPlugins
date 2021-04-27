/*:ja
 * @target MZ 
 * @plugindesc キャラメイクでクラス(職業)選択を追加するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_CharaMake
 * @orderAfter Kapu_CharaMake
 * 
 * @param isSelectableAtFirst
 * @text 初期時のみ選択可能とする
 * @desc 初回作成時のみ選択可能にする場合にはtrueにします。
 * @type boolean
 * @default true
 * 
 * @param textItemNameClass
 * @text クラス名選択項目テキスト
 * @description キャラクターメイキング項目一覧で、クラスに相当する選択項目として表示されるテキスト
 * @type string
 * @default クラス
 * 
 * @param textItemDescriptionClass
 * @text クラス名選択項目説明
 * @description 本項目がセレクト状態になったときに表示する説明テキスト
 * @type string
 * @default クラスを変更します。
 * 
 * 
 * @help 
 * キャラメイクに単純なクラス(職業)選択を追加するプラグインです。
 * 職業のノートタグにより、選択可否条件を付けることができます。
 * 
 * ■ 使用時の注意
 * 特になし。
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
 *   <charaMakeSelectable: condition$>
 *      条件conditionがtrueを返す場合に選択可能にする。
 *      未指定時は常に選択不可
 *      無条件で選択可能にするならば、
 *          <charaMakeSelectable>
 *          <charaMakeSelectable: true>
 *      とする。
 *      スイッチで条件を付けたいならば
 *          <charaMakeSelectable: $gameSwitches.value(12)>
 *      などとする。上記の例は12番のスイッチがONの時に選択可能を表す。
 *   <charaMakeDescription: text$>
 *      キャラクターメイキングの項目選択時に表示する説明文
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 初版作成。
 */

/**
 * クラス選択アイテム
 */
function Game_CharaMakeItem_Class() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_CharaMake_Classes";
    const parameters = PluginManager.parameters(pluginName);
    const textItemNameClass = parameters["textItemNameClass"] || "Class";
    const textItemDescriptionClass = parameters["textItemDescriptionClass"] || "Select classs.";
    const isSelectableAtFirst = (typeof parameters["isSelectableAtFirst"] === "undefined")
            ? true : (parameters["isSelectableAtFirst"] === "true");
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
        items.push(new Game_CharaMakeItem_Class());
        return items;
    };
    //------------------------------------------------------------------------------
    // Game_CharaMakeItem_Class
    Game_CharaMakeItem_Class.prototype = Object.create(Game_CharaMakeItem.prototype);
    Game_CharaMakeItem_Class.prototype.constructor = Game_CharaMakeItem_Class;

    /**
     * Game_CharaMakeItem_Classを初期化する。
     */
    Game_CharaMakeItem_Class.prototype.initialize = function() {
        Game_CharaMakeItem.prototype.initialize.call(this, ...arguments);
    };

    /**
     * この項目の識別名を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Class.prototype.name = function() {
        return textItemNameClass;
    };
    /**
     * この項目の説明を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Class.prototype.description = function() {
        return textItemDescriptionClass;
    };

    /**
     * アクターに適用可能な項目かどうかを取得する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {boolean} 既存データの変更の場合にはtrue、それ以外はfalse
     * @returns 適用できる項目の場合にはtrue, それ以外はfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Class.prototype.canApply = function(actor, isModify) {
        return !isModify || isSelectableAtFirst;
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
    Game_CharaMakeItem_Class.prototype.setCurrent = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        const currentClass = actor.currentClass();
        const items = selectWindow.items();
        let index = 0;
        while (index < items.length) {
            if (items[index].id === currentClass.id) {
                break;
            }
            index++;
        }
        if (index < $dataClasses.length) {
            selectWindow.select(index);
        } else {
            const classEntry = this.generateClassEntry(currentClass);
            items.unshift(classEntry);
            selectWindow.setItems(items);
            selectWindow.select(0);
        }
    };

    /**
     * 編集中の設定を反映させる。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Class.prototype.apply = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        const classEntry = selectWindow.item();
        actor.changeClass(classEntry.id, true);
    };
    /**
     * アイテム一覧を得る。
     * 
     * @return {Array<object>} アイテム一覧
     */
    Game_CharaMakeItem_Class.prototype.items = function() {
        const items = [];
        for (let i = 1; i < $dataClasses.length; i++) {
            const dataClass = $dataClasses[i];
            if (dataClass !== null) {
                if (dataClass.meta.charaMakeSelectable) {
                    try {
                        if (eval(dataClass.meta.charaMakeSelectable)) {
                            const classEntry = this.generateClassEntry(dataClass);
                            items.push(classEntry);
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
        }
        return items;
    };

    /**
     * クラスエントリを生成する。
     * 
     * @param {DataClass} dataClass クラスデータ
     * @returns {object} クラスエントリオブジェクト
     */
    Game_CharaMakeItem_Class.prototype.generateClassEntry = function(dataClass) {
        return {
            id: dataClass.id,
            name: dataClass.name,
            description: dataClass.meta.charaMakeDescription || ""
        };
    };
})();