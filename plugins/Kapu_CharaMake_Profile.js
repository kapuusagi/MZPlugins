/*:ja
 * @target MZ 
 * @plugindesc キャラメイクプロフィールエディットプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_CharaMake
 * @orderAfter Kapu_CharaMake
 * @base Kapu_MultiLineInput
 * @orderAfter Kapu_MultiLineInput
 * 
 * @command setCharaMakeItemProfileEnabled
 * @text キャラメイク項目プロフィールを有効にする。
 * @desc キャラメイク項目プロフィールを有効にする。
 * @type boolean
 * @default true
 * 
 * @arg isEnabled
 * @text 有効にする
 * @type boolean
 * @default true
 * 
 * 
 * 
 * @param textItemNameProfile
 * @text プロフィール編集項目テキスト
 * @description キャラクターメイキング項目一覧で、プロフィール編集に相当する選択項目として表示されるテキスト
 * @type string
 * @default プロフィール
 * 
 * @param textItemDescriptionProfile
 * @text プロフィール編集項目説明
 * @description 本項目がセレクト状態になったときに表示する説明テキスト
 * @type string
 * @default プロフィールを編集します。
 *  
 * @help 
 * キャラクターメイキングプラグインのプロフィールエディット用拡張
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */

/**
 * クラス選択アイテム
 */
function Game_CharaMakeItem_Profile() {
    this.initialize(...arguments);
}
(() => {
    const pluginName = "Kapu_CharaMake_Profile";
    const parameters = PluginManager.parameters(pluginName);
    const textItemNameProfile = parameters["textItemNameProfile"] || "Edit Profile";
    const textItemDescriptionProfile = parameters["textItemDescriptionProfile"] || "Edit profile.";

    const CHARAMAKEITEM_PROFILE = "profile";

    PluginManager.registerCommand(pluginName, "setCharaMakeItemProfileEnabled", args => {
        const isEnabled = (typeof args.isEnabled === "undefined")
                ? true : (args.isEnabled === "true");
        $gameTemp.setCharaMakeItemEnabled(CHARAMAKEITEM_PROFILE, isEnabled);
    });

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
        if ($gameTemp.isCharaMakeItemEnabled(CHARAMAKEITEM_PROFILE)) {
            items.push(new Game_CharaMakeItem_Profile());
        }
        return items;
    };
    //------------------------------------------------------------------------------
    // Window_CharaMake_Profile
    function Window_CharaMake_Profile() {
        this.initialize(...arguments);
    }
    Window_CharaMake_Profile.prototype = Object.create(Window_Selectable.prototype);
    Window_CharaMake_Profile.prototype.constructor = Window_CharaMake_Profile;

    /**
     * Window_CharaMake_Profile を初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     * @param {MultiLine_TextInput} textInput テキスト入力
     */
    Window_CharaMake_Profile.prototype.initialize = function(rect, textInput) {
        Window_Selectable.prototype.initialize.call(this, rect);
        
        textInput.setHandler("ok", this.onTextInputOk.bind(this));
        textInput.setHandler("cancel", this.onTextInputCancel.bind(this));
    };

    /**
     * テキスト入力でOK操作されたときの処理を行う。
     */
    Window_CharaMake_Profile.prototype.onTextInputOk = function() {
        SoundManager.playOk();
        this.callHandler("ok");
    };

    /**
     * テキスト入力でキャンセル操作されたときの処理を行う。
     */
    Window_CharaMake_Profile.prototype.onTextInputCancel = function() {
        SoundManager.playCancel();
        this.callHandler("cancel");
    };

    //------------------------------------------------------------------------------
    // Game_CharaMakeItem_Profile
    Game_CharaMakeItem_Profile.prototype = Object.create(Game_CharaMakeItem.prototype);
    Game_CharaMakeItem_Profile.prototype.constructor = Game_CharaMakeItem_Profile;

    /**
     * 初期化する。
     */
    Game_CharaMakeItem_Profile.prototype.initialize = function() {
        Game_CharaMakeItem.prototype.initialize.call(this, ...arguments);

    };

    /**
     * この項目の識別名を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Profile.prototype.name = function() {
        return textItemNameProfile;
    };
    /**
     * この項目の説明を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Profile.prototype.description = function() {
        return textItemDescriptionProfile;
    };

    /**
     * 編集中のテキストを得る。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @return {string} 編集項目の選択値(テキスト)
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Profile.prototype.editingText = function(windowEntry) {
        return "";
    };

    /**
     * 選択・編集用のウィンドウを作成する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     * @param {Window_Help} helpWindow ヘルプウィンドウ
     * @param {Game_Actor} actor アクター
     * @returns {object} ウィンドウ類
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Profile.prototype.createSelectWindows = function(rect, helpWindow, actor) {
        const textInput = new MultiLine_TextInput();
        textInput.setup(null, "", 128, 2, 0, 0, 0);
        textInput.create();
        textInput.hide();

        const selectWindow = new Window_CharaMake_Profile(rect, textInput);
        selectWindow.hide();
        selectWindow.deactivate();
        return {
            selectWindow: selectWindow,
            windows: null,
            infoWindows: null,
            sprites: null,
            textInput: textInput
        };
    };

    /**
     * 現在のアクターの情報を反映させる
     * 
     * Note: キャラメイク操作で初期値を設定するために呼び出される。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    Game_CharaMakeItem_Profile.prototype.setCurrent = function(windowEntry, actor) {
        const textInput = windowEntry.textInput;
        textInput.setText(actor.profile());
    };

    /**
     * 編集中の設定を反映させる。
     * 
     * Note: キャラメイク操作で確定操作されたときに呼び出される。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    Game_CharaMakeItem_Profile.prototype.apply = function(windowEntry, actor) {
        const textInput = windowEntry.textInput;
        actor.setProfile(textInput.text());
    };

    /**
     * 選択開始時の処理を行う。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     */
    Game_CharaMakeItem_Profile.prototype.startSelection = function(windowEntry) {
        windowEntry.selectWindow.hide();
        const textInput = windowEntry.textInput;
        textInput.start();
    };

    /**
     * 選択終了時の処理を行う。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Profile.prototype.endSelection = function(windowEntry) {
        // Do nothing. 
    };

    /**
     * リソースの破棄処理を行う。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     */
    Game_CharaMakeItem_Profile.prototype.terminateSelection = function(windowEntry) {
        const textInput = windowEntry.textInput;
        textInput.terminate();
    };
})();