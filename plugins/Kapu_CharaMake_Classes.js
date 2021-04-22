/*:ja
 * @target MZ 
 * @plugindesc キャラメイクでクラス(職業)選択を追加するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_CharaMake
 * @orderAfter Kapu_CharaMake
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
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
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
        const index = items.indexOf(currentClass);
        if (index >= 0) {
            selectWindow.select(index);
        } else {
            items.unshift(currentClass);
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
        const dataClass = selectWindow.item();
        const classId = dataClass.id;
        actor.changeClass(classId, true);
    };
    /**
     * アイテム一覧を得る。
     * 
     * @return {Array<object>} アイテム一覧
     */
    Game_CharaMakeItem_Class.prototype.items = function() {
        const items = []
        for (const dataClass of $dataClasses) {
            if (dataClass.meta.charaMakeSelectable) {
                try {
                    if (eval(dataClass.meta.charaMakeSelectable)) {
                        items.push(dataClass);
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
        return [];
    };
})();