/*:ja
 * @target MZ 
 * @plugindesc キャラメイクで性別選択を追加するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_CharaMake
 * @orderAfter Kapu_CharaMake
 * @base Kapu_BattlerGender
 * @orderAfter Kapu_BattlerGender
 * 
 * @command setCharaMakeItemClassesEnabled
 * @text キャラメイク項目性別を有効にする。
 * @desc キャラメイク項目性別を有効にする。
 * @type boolean
 * @default true
 * 
 * @arg isEnabled
 * @text 有効にする
 * @type boolean
 * @default true
 * 
 *  
 * @param isSelectableAtFirst
 * @text 初期時のみ選択可能とする
 * @desc 初回作成時のみ選択可能にする場合にはtrueにします。
 * @type boolean
 * @default true
 * 
 * 
 * @param textItemNameGender
 * @text 性別選択項目テキスト
 * @desc キャラクターメイキング項目一覧で、性別に相当する選択項目として表示されるテキスト
 * @type string
 * @default 性別
 * 
 * @param textItemDescriptionGender
 * @text 性別名選択項目説明
 * @desc 本項目がセレクト状態になったときに表示する説明テキスト
 * @type string
 * @default 性別を変更します。
 * 
 * 
 * @help 
 * キャラメイクに単純な性別選択を追加するプラグインです。
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
 * ありません。

 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 初版作成。
 */

/**
 * 性別選択アイテム
 */
 function Game_CharaMakeItem_Gender() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_CharaMake_BattlerGender";
    const parameters = PluginManager.parameters(pluginName);
    const textItemNameGender = parameters["textItemNameGender"] || "Class";
    const textItemDescriptionGender = parameters["textItemDescriptionGender"] || "Select classs.";
    const isSelectableAtFirst = (typeof parameters["isSelectableAtFirst"] === "undefined")
            ? true : (parameters["isSelectableAtFirst"] === "true");

    const CHARAMAKEITEM_GENDER = "gender";

    PluginManager.registerCommand(pluginName, "setCharaMakeItemGenderEnabled", args => {
        const isEnabled = (typeof args.isEnabled === "undefined")
                ? true : (args.isEnabled === "true");
        $gameTemp.setCharaMakeItemEnabled(CHARAMAKEITEM_GENDER, isEnabled);
    });


    //------------------------------------------------------------------------------
    // DataManager
    const _DataManager_createCharaMakeItems = DataManager.createCharaMakeItems;
    /**
     * キャラクターメイキング項目を取得する。
     * キャラメイク項目を拡張する場合、このメソッドをフックして値を配列に加えて返す。
     * 
     * @returns {Array<Game_CharaMakeItem>} キャラクターメイキング項目
     */
    DataManager.createCharaMakeItems = function() {
        const items = _DataManager_createCharaMakeItems.call(this);
        if ($gameTemp.isCharaMakeItemEnabled(CHARAMAKEITEM_GENDER)) {
            items.push(new Game_CharaMakeItem_Gender());
        }
        return items;
    };
    //------------------------------------------------------------------------------
    // Game_CharaMakeItem_Gender
    Game_CharaMakeItem_Gender.prototype = Object.create(Game_CharaMakeItem.prototype);
    Game_CharaMakeItem_Gender.prototype.constructor = Game_CharaMakeItem_Gender;

    /**
     * Game_CharaMakeItem_Genderを初期化する。
     */
    Game_CharaMakeItem_Gender.prototype.initialize = function() {
        Game_CharaMakeItem.prototype.initialize.call(this, ...arguments);
    };

    /**
     * この項目の識別名を取得する。
     * 
     * @returns {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Gender.prototype.name = function() {
        return textItemNameGender;
    };
    /**
     * この項目の説明を取得する。
     * 
     * @returns {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Gender.prototype.description = function() {
        return textItemDescriptionGender;
    };

    /**
     * アクターに適用可能な項目かどうかを取得する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Boolean} 既存データの変更の場合にはtrue、それ以外はfalse
     * @returns 適用できる項目の場合にはtrue, それ以外はfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Gender.prototype.canApply = function(actor, isModify) {
        return !isModify || isSelectableAtFirst;
    };

    /**
     * 現在のアクターの情報を反映させる
     * 
     * Note: キャラメイク操作で初期値を設定するために呼び出される。
     * 
     * @param {Object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Gender.prototype.setCurrent = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        const gender = actor.gender;
        const items = selectWindow.items();
        let index = 0;
        while (index < items.length) {
            if (items[index].name === gender) {
                break;
            }
            index++;
        }
        if (index < items.length) {
            selectWindow.select(index);
        }
    };

    /**
     * 編集中の設定を反映させる。
     * 
     * @param {Object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Gender.prototype.apply = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        const item = selectWindow.item();
        actor.changeGender(item.name);
    };
    /**
     * アイテム一覧を得る。
     * 
     * @returns {Array<object>} アイテム一覧
     */
    Game_CharaMakeItem_Gender.prototype.items = function() {
        return [
            { name:TextManager.genderMale, },
            { name:TextManager.genderFemale, },
            { name:TextManager.genderOther }
        ];
    };

})();
