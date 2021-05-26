/*:ja
 * @target MZ 
 * @plugindesc グラフィックエントリにbattlePictureを拡張するためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_CharaMake_ActorGraphic
 * @orderAfter Kapu_CharaMake_ActorGraphic
 * @base Kapu_Twld_BattleSystem
 * @orderAfter Kapu_Twld_BattleSystem
 * 
 * @help
 * グラフィックエントリにbattlePictureを拡張する。
 * 
 * 
 * ■ 使用時の注意
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
 * CharaMake_AutoGraphicの charaMakeItems の note に以下を追加する。
 * <battlePicture: pictureName$>
 *   戦闘ピクチャ名を指定する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    //------------------------------------------------------------------------------
    // Window_CharaMakeVisualSelection

    const _Window_CharaMakeVisualSelection_initialize = Window_CharaMakeVisualSelection.prototype.initialize;
    /**
     * Window_CharaMakeVisualSelectionを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_CharaMakeVisualSelection.prototype.initialize = function(rect) {
        this._battlePictureSprite = null;
        _Window_CharaMakeVisualSelection_initialize.call(this, rect);
    };

    /**
     * 戦闘ピクチャを設定する。
     * 
     * @param {number} index インデックス番号
     */
    Window_CharaMakeVisualSelection.prototype.setBattlePictureSprite = function(sprite) {
        this._battlePictureSprite = sprite;
        this.reselect();
    };


    const _Window_CharaMakeVisualSelection_select = Window_CharaMakeVisualSelection.prototype.select;
    /**
     * 項目を選択する。
     * 
     * @param {number} index インデックス番号
     */
    Window_CharaMakeVisualSelection.prototype.select = function(index) {
        _Window_CharaMakeVisualSelection_select.call(this, index);
        if (this._battlePictureSprite !== null) {
            const item = this.item();
            const pictureName = (item) ? item.battlePicture : "";
            this._battlePictureSprite.setPictureName(pictureName);
        }
    };

    //------------------------------------------------------------------------------
    // Game_CharaMakeItem_Visual

    const _Game_CharaMakeItem_Visual_createSelectWindows = Game_CharaMakeItem_Visual.prototype.createSelectWindows;
    /**
     * 選択・編集用のウィンドウを作成する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     * @param {Window_Help} helpWindow ヘルプウィンドウ
     * @param {Game_Actor} actor アクター
     * @returns {object} ウィンドウ類
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Visual.prototype.createSelectWindows = function(rect, helpWindow, actor) {
        const windowEntry = _Game_CharaMakeItem_Visual_createSelectWindows.call(this, rect, helpWindow, actor);
        const battlePictureSprite = new Sprite_CharaMake_Picture();
        battlePictureSprite.anchor.x = 0.5;
        battlePictureSprite.anchor.y = 1.0;
        battlePictureSprite.x = Graphics.boxWidth - 200;
        battlePictureSprite.y = Graphics.boxHeight;

        const selectBattlePictureSprite = new Sprite_CharaMake_Picture();
        selectBattlePictureSprite.anchor.x = 0.5;
        selectBattlePictureSprite.anchor.y = 1.0;
        selectBattlePictureSprite.x = Graphics.boxWidth - 200;
        selectBattlePictureSprite.y = Graphics.boxHeight;

        windowEntry.selectWindow.setBattlePictureSprite(selectBattlePictureSprite);

        if (windowEntry.sprites === null) {
            windowEntry.sprites = [];
        }
        windowEntry.sprites.push(battlePictureSprite);
        windowEntry.sprites.push(selectBattlePictureSprite);
        windowEntry.battlePictureSprite = battlePictureSprite;
        windowEntry.selectBattlePictureSprite = selectBattlePictureSprite;

        return windowEntry;
    };

    const _Game_CharaMakeItem_Visual_setCurrent = Game_CharaMakeItem_Visual.prototype.setCurrent;
    /**
     * 現在のアクターの情報を反映させる
     * 
     * Note: キャラメイク操作で初期値を設定するために呼び出される。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Visual.prototype.setCurrent = function(windowEntry, actor) {
        _Game_CharaMakeItem_Visual_setCurrent.call(this, windowEntry, actor);
    };

    const _Game_CharaMakeItem_Visual_apply = Game_CharaMakeItem_Visual.prototype.apply;
    /**
     * 編集中の設定を反映させる。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     * @param {Game_Actor} acotr アクター
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Visual.prototype.apply = function(windowEntry, actor) {
        _Game_CharaMakeItem_Visual_apply.call(this, windowEntry, actor);
        const selectWindow = windowEntry.selectWindow;
        const item = selectWindow.item();
        actor.setBattlePicture(item.battlePicture);
        windowEntry.battlePictureSprite.setPictureName(actor.battlePicture());
    };

    const _Game_CharaMakeItem_Visual_createDefaultEntry = Game_CharaMakeItem_Visual.prototype.createDefaultEntry;
    /**
     * デフォルトのグラフィックエントリを作成する。
     * 
     * @param {Game_Actor} actor アクター
     * @returns {object} 画像エントリ
     */
    Game_CharaMakeItem_Visual.prototype.createDefaultEntry = function(actor) {
        const entry = _Game_CharaMakeItem_Visual_createDefaultEntry.call(this, actor);
        entry.battlePicture = actor.battlePicture();
        return entry;
    };

    const _Game_CharaMakeItem_Visual_items = Game_CharaMakeItem_Visual.prototype.items;
    /**
     * アイテム一覧を得る。
     * 
     * @returns {Array<object>} アイテム一覧
     */
    Game_CharaMakeItem_Visual.prototype.items = function() {
        const items = _Game_CharaMakeItem_Visual_items.call(this);
        for (const item of items) {
            if (!item.battlePicture) {
                item.battlePicture = item.meta.battlePicture || "";
            }
        }
        return items.concat();
    };
    const _Game_CharaMakeItem_Visual_startSelectin = Game_CharaMakeItem_Visual.prototype.startSelection;
    /**
     * 選択開始時の処理を行う。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     */
    Game_CharaMakeItem_Visual.prototype.startSelection = function(windowEntry) {
        _Game_CharaMakeItem_Visual_startSelectin.call(this, windowEntry);
        windowEntry.battlePictureSprite.visible = false;
        windowEntry.selectBattlePictureSprite.visible = true;
    };

    const _Game_CharaMakeItem_Visual_endSelection = Game_CharaMakeItem_Visual.prototype.endSelection;
    /**
     * 選択終了時の処理を行う。
     * 
     * @param {object} windowEntry createSelectWindow()で返したウィンドウ
     */
    Game_CharaMakeItem_Visual.prototype.endSelection = function(windowEntry) {
        _Game_CharaMakeItem_Visual_endSelection.call(this, windowEntry);
        windowEntry.battlePictureSprite.visible = true;
        windowEntry.selectBattlePictureSprite.visible = false;
    };
})();
