/*:ja
 * @target MZ 
 * @plugindesc キャラメイクでグラフィック(顔と歩行グラフィック、バトラー)選択を追加するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_CharaMake
 * @orderAfter Kapu_CharaMake
 * 
 * @param textItemNameGraphic
 * @text グラフィック名選択項目テキスト
 * @description キャラクターメイキング項目一覧で、グラフィックに相当する選択項目として表示されるテキスト
 * @type string
 * @default ビジュアル
 * 
 * @param textItemDescriptionGraphic
 * @text グラフィック名選択項目説明
 * @description 本項目がセレクト状態になったときに表示する説明テキスト
 * @type string
 * @default ビジュアルを変更します。
 * 
 * @param textItemNameDefault
 * @text デフォルト選択項目冥
 * @description リストに無い場合に表示する項目名として使用されるテキスト
 * @type string
 * @default デフォルト
 * 
 * @param charaMakeItems
 * @text キャラクタメイキング選択項目
 * @description キャラクタメイキング選択項目として使用されるコレクション。
 * @type struct<GraphicEntry>[]
 * 
 * 
 * 
 * 
 * @help 
 * キャラメイクに単純なグラフィック(顔と歩行グラフィック、バトラー)選択を追加するプラグインです。
 * 部品を組み合わせて自由にキャラメイクをするものではないです。
 * 職業のノートタグにより、選択可否条件を付けることができます。
 * 
 * 使用方法
 * 1. プラグインパラメータのcharaMakeItemsを編集して設定項目エントリを作ります。
 * 2. Kapu_ChraMakeプラグインのキャラメイクシーンを呼び出します。
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * プラグインパラメータ charaMakeItems のnoteフィールドは item.meta フィールドに展開されます。
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
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 初版作成。
 */
/*~struct~GraphicEntry:
 *
 * @param name
 * @text エントリ名
 * @description 項目の選択値名として使用される文字列
 * @type string
 * @default グラフィック
 * 
 * @param faceName
 * @text 顔グラフィックファイル名
 * @description 顔グラフィックのファイル名
 * @type file
 * @dir img/faces/
 * 
 * @param faceIndex
 * @text 顔グラフィックインデックス
 * @type number
 * @default 0
 * @min 0
 * @max 7
 * 
 * @param characterName
 * @text 歩行グラフィックファイル
 * @description 歩行グラフィックのファイル
 * @type file
 * @dir img/characters/
 * 
 * @param characterIndex
 * @text 歩行グラフィックインデックス
 * @description 歩行グラフィックファイル中のキャラクタインデックス
 * @type number
 * @default 0
 * @min 0
 * @max 7
 *
 * @param battlerName
 * @text サイドビューバトラーファイル
 * @description サイドビューバトルグラフィックファイル名
 * @type file
 * @dir img/sv_actors/
 * 
 * @param note
 * @text ノートタグ
 * @description ノートタグとして使用するテキスト
 * @type string
 * @default
 */

/**
 * グラフィック選択アイテム
 */
function Game_CharaMakeItem_Visual() {
    this.initialize(...arguments);
}

/**
 * ビジュアル選択ウィンドウ
 */
function Window_CharaMakeVisualSelection() {
    this.initialize(...arguments);
}


(() => {
    const pluginName = "Kapu_CharaMake_ActorGraphic";
    const parameters = PluginManager.parameters(pluginName);
    const textItemNameGraphic = parameters["textItemNameGraphic"] || "Graphic";
    const textItemDescriptionGraphic = parameters["textItemDescriptionGraphic"] || "Select graphic.";
    const textItemNameDefault = parameters["textItemNameDefault"] || "default";
    const graphicItems = [];
    try {
        const entries = JSON.parse(parameters["charaMakeItems"]).map(str => JSON.parse(str));
        for (entry of entries) {
            // noteフィールドを展開する。
            if (entry.node) {
                DataManager.extractMetadata(entry);
            } else {
                entry.note = "";
                entry.meta = {};
            }
            graphicItems.push(entry);
        }
    }
    catch (e) {
        console.log(e);
    }

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
        items.push(new Game_CharaMakeItem_Visual());
        return items;
    };    
    //------------------------------------------------------------------------------
    // Window_CharaMakeVisualSelection
    Window_CharaMakeVisualSelection.prototype = Object.create(Window_CharaMakeItemSelection.prototype);
    Window_CharaMakeVisualSelection.prototype.constructor = Window_CharaMakeVisualSelection;

    /**
     * ウィンドウを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_CharaMakeVisualSelection.prototype.initialize = function(rect) {
        Window_CharaMakeItemSelection.prototype.initialize.call(this, rect);
    };

    /**
     * 最大カラム数を得る。
     * 
     * @return {Number} カラム数
     */
    Window_CharaMakeVisualSelection.prototype.maxCols = function() {
        return Math.floor(this.innerWidth / 160);
    };
    /**
     * 項目の描画高を得る。
     * 
     * @return {Number} 項目の描画高さ。
     */
    Window_CharaMakeVisualSelection.prototype.itemHeight = function() {
        return 160;
    };

    /**
     * アイテムリストを設定する。
     * 
     * @param {Array<object>} items アイテムリスト (objectにnameメンバを持つこと)
     */
    Window_CharaMakeVisualSelection.prototype.setItems = function(items) {
        for (const item of items) {
            if (item.faceName) {
                ImageManager.loadFace(item.faceName);
            }
            if (item.characterName) {
                ImageManager.loadCharacter(item.characterName);
            }
        }
        Window_CharaMakeItemSelection.prototype.setItems.call(this, items);
    };

    /**
     * 項目を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_CharaMakeVisualSelection.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        const item = this._items[index];

        this.resetFontSettings();

        // DrawFace
        const faceX = rect.x + (rect.width - ImageManager.faceWidth) / 2;
        const faceY = rect.y;
        this.drawFace(item.faceName, item.faceIndex, faceX, faceY);

        // DrawCharacter
        const characterX = rect.x + rect.width - 24 - this.lineHeight();
        const characterY = rect.y + rect.height;
        this.drawCharacter(item.characterName, item.characterIndex, characterX, characterY);

        // 名前背景
        const nameX = rect.x;
        const nameY = rect.y + rect.height - this.lineHeight();
        this.changePaintOpacity(false);
        this.changeTextColor(ColorManager.itemBackColor1());
        this.changeOutlineColor(ColorManager.itemBackColor2());
        this.drawRect(nameX, nameY, rect.width, this.lineHeight());
        this.resetTextColor();
        this.changePaintOpacity(true);

        // 名前
        this.makeFontSmaller();
        this.drawText(item.name, nameX, nameY, rect.width);
    };
    /**
     * 選択項目の説明を更新する。
     * 
     * _helpWindowに表示する項目を更新する。
     * _helpWindowが設定されていない場合、本メソッドはコールされない。
     * 派生クラスでは必要に応じてフック/オーバーライドする。
     */
    Window_CharaMakeVisualSelection.prototype.updateHelp = function() {
        Window_Selectable.prototype.updateHelp.call(this);
        if (this._helpWindow !== null) {
            const item = this.item();
            const helpText = (item && item.description) ? item.description : "";
            this._helpWindow.setText(helpText);
        }
    };
    //------------------------------------------------------------------------------
    // Game_CharaMakeItem_Visual
    Game_CharaMakeItem_Visual.prototype = Object.create(Game_CharaMakeItem.prototype);
    Game_CharaMakeItem_Visual.prototype.constructor = Game_CharaMakeItem_Visual;

    /**
     * Game_CharaMakeItem_Visualを初期化する。
     */
    Game_CharaMakeItem_Visual.prototype.initialize = function() {
        Game_CharaMakeItem.prototype.initialize.call(this, ...arguments);
    };

    /**
     * この項目の識別名を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Visual.prototype.name = function() {
        return textItemNameGraphic;
    };
    /**
     * この項目の説明を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Visual.prototype.description = function() {
        return textItemDescriptionGraphic;
    };

    /**
     * 選択・編集用のウィンドウを作成する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     * @param {Window_Help} helpWindow ヘルプウィンドウ
     * @returns {Window_Selectable} ウィンドウ(Window_Selectableの派生クラス)
     */
    // eslint-disable-next-line no-unused-vars
    Game_CharaMakeItem_Visual.prototype.createSelectWindows = function(rect, helpWindow) {
        const window = new Window_CharaMakeVisualSelection(rect);
        window.setItems(this.items())
        return {
            selectWindow: window,
            windows: null,
            sprites: null
        } ;
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
    Game_CharaMakeItem_Visual.prototype.setCurrent = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        const items = selectWindow.items();
        let index = 0;
        while (index < items.length) {
            const item = items[index];
            if ((item.faceName === actor.faceName())
                    && (item.faceIndex === actor.faceIndex())
                    && (item.characterName === actor.characterName())
                    && (item.characterIndex === actor.characterIndex())
                    && (item.battlerName === actor.battlerName())) {
                break;
            }
            index++;
        }

        if (index < items.length) {
            selectWindow.select(index);
        } else {
            items.unshift({
                name: actor.name() || textItemNameDefault,
                characterName: actor.characterName(),
                characterIndex: actor.characterIndex(),
                faceName: actor.faceName(),
                faceIndex: actor.faceIndex(),
                battlerName: actor.battlerName()
            });
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
    Game_CharaMakeItem_Visual.prototype.apply = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        const item = selectWindow.item();
        actor.setCharacterImage(item.characterName, item.characterIndex);
        actor.setFaceImage(item.faceName, item.faceIndex);
        actor.setBattlerImage(item.battlerName);
    };

    /**
     * アイテム一覧を得る。
     * 
     * @return {Array<object>} アイテム一覧
     */
    Game_CharaMakeItem_Visual.prototype.items = function() {
        return graphicItems;
    };


})();