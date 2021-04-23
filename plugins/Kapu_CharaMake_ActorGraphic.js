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
 * 
 * 
 * @param charaMakeItems
 * @text キャラクタメイキング選択項目
 * @description キャラクタメイキング選択項目として使用されるコレクション。
 * @type struct<GraphicEntry>[]
 * 
 * 
 * @help 
 * キャラメイクに単純なグラフィック(顔と歩行グラフィック、バトラー)選択を追加するプラグインです。
 * 部品を組み合わせて自由にキャラメイクをするものではないです。
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
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
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
 * @dir img/battlers/
 */

/**
 * グラフィック選択アイテム
 */
function Game_CharaMakeItem_Graphic() {
    this.initialize(...arguments);
}

/**
 * ビジュアル選択ウィンドウ
 */
function Window_CharaMakeVisualSelection() {
    this.initialize(...arguments);
}


(() => {
    const pluginName = "Kapu_CharaMake_Graphic";
    const parameters = PluginManager.parameters(pluginName);
    const textItemNameGraphic = parameters["textItemNameGraphic"] || "Graphic";
    const textItemDescriptionGraphic = parameters["textItemDescriptionGraphic"] || "Select graphic.";
    const graphicItems = [];
    try {
        const entries = JSON.parse(parameters["charaMakeItems"]).map(str => JSON.parse(str));
        for (entry of entries) {
            // TODO: もしかしたらcharacterName, faceName, battlerNameからフォルダパスを取り除かないといけないかも。
            // @fileで渡すとフォルダ名が含まれてた気がする。

            graphicItems.push(entry);
        }
    }
    catch (e) {
        console.log(e);
    }
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
     * 項目を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_CharaMakeVisualSelection.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        const item = this._items[index];

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
        this.changeTextColor(ColorManager.itemBackColor1());
        this.changeOutlineColor(ColorManager.itemBackColor2());
        this.drawRect(nameX, nameY, rect.width, this.lineHeight());
        this.resetTextColor();

        // 名前
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
    // Game_CharaMakeItem_Graphic
    Game_CharaMakeItem_Graphic.prototype = Object.create(Game_CharaMakeItem.prototype);
    Game_CharaMakeItem_Graphic.prototype.constructor = Game_CharaMakeItem_Graphic;

    /**
     * Game_CharaMakeItem_Graphicを初期化する。
     */
    Game_CharaMakeItem_Graphic.prototype.initialize = function() {
        Game_CharaMakeItem.prototype.initialize.call(this, ...arguments);
    };

    /**
     * この項目の識別名を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Graphic.prototype.name = function() {
        return textItemNameGraphic;
    };
    /**
     * この項目の説明を取得する。
     * 
     * @return {string} キャラクターメイキングの項目名として使用される。
     */
    Game_CharaMakeItem_Graphic.prototype.description = function() {
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
    Game_CharaMakeItem_Graphic.prototype.createSelectWindows = function(rect, helpWindow) {
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
    Game_CharaMakeItem_Graphic.prototype.setCurrent = function(windowEntry, actor) {
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
                name: actor.name() || "Custom",
                characterName: actor.characterName(),
                characterIndex: actor.characterIndex(),
                faceName: actor.faceName(),
                faceIndex: actor.faceIndex(),
                batterName: actor.batterName()
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
    Game_CharaMakeItem_Graphic.prototype.apply = function(windowEntry, actor) {
        const selectWindow = windowEntry.selectWindow;
        const item = selectWindow.item();
        actor.setCharacterImage(item.characterName, item.characterIndex);
        acotr.setFaceImage(item.faceName, item.faceIndex);
        actor.setBattlerImage(item.battlerName);
    };

    /**
     * アイテム一覧を得る。
     * 
     * @return {Array<object>} アイテム一覧
     */
    Game_CharaMakeItem_Graphic.prototype.items = function() {
        return graphicItems;
    };


})();