/*:ja
 * @target MZ 
 * @plugindesc FS向けメニュープラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_FS_BattleSystem
 * @orderAfter Kapu_FS_BattleSystem
 * 
 * @param picutreYOffs
 * @text 画像Yオフセット
 * @desc メニュー画面に表示するアクター画像（立ち絵）のオフセット。
 * @type number
 * @default 0
 * @min -500
 * @max 500
 * 
 * @help 
 * メニュー表示をするためのプラグイン。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
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
 * Version.0.1.0 FS向けに作成した。
 */


(() => {
    const pluginName = "Kapu_FS_UI_Menu";
    const parameters = PluginManager.parameters(pluginName);

    const statusY = 260;
    const picutreYOffs = Number(parameters["picutreYOffs"]) || 0;

    //------------------------------------------------------------------------------
    // Window_MenuStatus
    const _Window_MenuStatus_loadFaceImages = Window_MenuStatus.prototype.loadFaceImages;
    /**
     * 顔グラフィックをロードする。
     * 
     * 予めImageManager.loadPicture()しておくことで、
     * 描画処理時にloadFaceしてもすぐにBitmapのインスタンスにアクセルできるようにする。
     */
    Window_MenuStatus.prototype.loadFaceImages = function() {
        _Window_MenuStatus_loadFaceImages.call(this);
        for (const actor of $gameParty.members()) {
            if (actor.battlePicture()) {
                ImageManager.loadPicture(actor.battlePicture());
            }
        }
    };

    /**
     * 最大カラム数を得る。
     * 
     * @returns {number} カラム数
     * !!!overwrite!!! Window_MenuStatus.maxCols()
     *     メニューのカラム数を動的に設定するためにオーバーライドする。
     */
    Window_MenuStatus.prototype.maxCols = function() {
        return Math.min($gameParty.members().length, $gameParty.maxBattleMembers());
    };
    /**
     * 有効な行数を得る。
     * 
     * @returns {number} 行数
     * !!!overwrite!!! Window_MenuStatus.numVisibleRows 
     *     メニューのレイアウト変更のため、オーバーライドする。
     */
    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 1;
    };

    /**
     * 項目の画像を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_MenuStatus.prototype.drawItemImage = function(index) {
        const actor = this.actor(index);
        if (actor.battlePicture()) {
            this.drawItemImageBattlePicture(index);
        } else {
            this.drawItemImageFace(index);
        }

        this.changePaintOpacity(false);
        const statusRect = this.statusRect(index);
        this.contents.fillRect(statusRect.x, statusRect.y, statusRect.width, statusRect.height, "#000000");
        this.changePaintOpacity(true);
    };

    /**
     * 画像を描画する。
     * 
     * @param {number} 項目のインデックス番号
     */
    Window_MenuStatus.prototype.drawItemImageBattlePicture = function(index) {
        const actor = this.actor(index);
        const pictureName = actor.battlePicture();
        const bitmap = ImageManager.loadPicture(pictureName);
        if (!bitmap.isReady()) {
            return;
        }

        const rect = this.itemRect(index);
        if (actor.isDead()) {
            this.setPaintFilter("grayscale(100%)");
        } else {
            this.setPaintFilter("none");
        }
        this.changePaintOpacity(actor.isBattleMember())
        this.drawPicture(pictureName, rect.x + 2, rect.y + picutreYOffs, rect.width - 4, rect.height);
        this.resetPaintFilter();
    };

    /**
     * 画像を描画する。
     * 
     * @param {string} name 画像ファイル名
     * @param {number} x 描画領域左上 x位置
     * @param {number} y 描画領域左上 y位置
     * @param {number} width 描画領域幅
     * @param {number} height 描画領域高さ
     */
    Window_MenuStatus.prototype.drawPicture = function(name, x, y, width, height) {
        const bitmap = ImageManager.loadPicture(name);
        const pw = bitmap.width;
        const ph = bitmap.height;
        width = width || pw;
        height = height || ph;
        const sw = Math.min(width, pw);
        const sh = Math.min(height, ph);
        const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        const dy = y;
        const sx = (pw - sw) / 2;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
    };

    /**
     * 画像を描画する
     * 
     * @param {number} index 項目のインデックス番号
     */
    Window_MenuStatus.prototype.drawItemImageFace = function(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        this.drawActorFace(actor, rect.x, rect.y, rect.width, 320);
    };

    const _Window_MenuStatus_drawActorFace = Window_MenuStatus.prototype.drawActorFace;
     
    /**
     * アクターの顔グラフィックを描画する。
     * 
     * @param {Game_Battler} actor アクター
     * @param {number} x 描画領域左上X
     * @param {number} y 描画領域左上Y
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    Window_MenuStatus.prototype.drawActorFace = function(actor, x, y, width, height) {
        if (actor.isDead()) {
            this.setPaintFilter("grayscale(100%)");
        } else {
            this.setPaintFilter("none");
        }
        _Window_MenuStatus_drawActorFace.call(this, actor, x, y, width, height);
        this.resetPaintFilter();
    };

    /**
     * 描画フィルターを設定する。
     * (MDNのドキュメントを見る限り、ChromeとFirefoxじゃないと動かない？)
     * 
     * @param {string} filterStr 描画フィルター文字列。
     */
    Window_MenuStatus.prototype.setPaintFilter = function(filterStr) {
        this.contents.context.filter = filterStr;
    };

    /**
     * 描画フィルターをリセットする。
     */
    Window_MenuStatus.prototype.resetPaintFilter = function() {
        this.contents.context.filter = "none";
    };

    /**
     * ステータス矩形領域を得る。
     * 
     * @param {number} index インデックス番号
     * @returns {Rectangle} ステータス領域の矩形領域
     */
    Window_MenuStatus.prototype.statusRect = function(index) {
        const itemRect = this.itemRect(index);
        const w = Math.min(180, itemRect.width);
        const x = itemRect.x + (itemRect.width - w) / 2;
        const y = itemRect.y + statusY;
        const h = itemRect.height - y;
        return new Rectangle(x, y, w, h);
    };
    /**
     * 項目のステータスを描画する。
     * 
     * @param {number} index インデックス番号
     * !!!overwrite!!! Window_MenuStatus.drawItemStatus()
     *     表示内容を変更するためオーバーライドする。
     */
    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        const actor = this.actor(index);
        const rect = this.statusRect(index);
        const width = rect.width - 16;
        const x = rect.x + 8;
        let y = rect.y + 10;
        const lineHeight = this.lineHeight();

        // 通り名
        this.drawActorClassAndNickName(actor, x, y, width - 40);
        y += Math.floor(lineHeight * 1.5);

        // 名前
        this.resetFontSettings();
        this.drawActorName(actor, x, y, width);
        y += lineHeight;

        // レベル
        this.drawActorLevel(actor, x, y, width);
        y += lineHeight;

        // HPゲージ
        const gaugeX = x + 32;
        const gaugeWidth = width - 32;
        this.drawGauge("hp", actor.hp, actor.mhp, gaugeX, y + 32, gaugeWidth, 12);

        // HP
        {
            const data = {
                label:TextManager.hpA,
                color:ColorManager.hpColor(actor),
                current:actor.hp,
                max:actor.mhp
            };
            this.drawGaugeText(data, x, y, width);
        }
        y += lineHeight * 2;

        // MPゲージ
        this.drawGauge("mp", actor.mp, actor.mmp, gaugeX, y + 32, gaugeWidth, 16);

        // MP
        {
            const data = {
                label:TextManager.mpA,
                color:ColorManager.mpColor(actor),
                current:actor.mp,
                max:actor.mmp
            };
            this.drawGaugeText(data, x, y, width);
        }
        y += lineHeight * 2;

        // TPはTWLDでは表示しない。

        // ステートアイコン
        this.drawStateIcons(actor, x, y, width);
        y += lineHeight * 2;
    };
    /**
     * アクター名を描画する。
     * 
     * @param {Game_Actor} actor Game_Actorオブジェクト
     * @param {number} x X位置
     * @param {number} y Y位置
     * @param {number} width 幅
     */
    Window_MenuStatus.prototype.drawActorName = function(actor, x, y, width) {
        width = width || 168;
        if (actor.isDead() || actor.isDying()) {
            this.changeTextColor(ColorManager.hpColor(actor));
        }
        this.drawText(actor.name(), x, y, width);
    };

    /**
     * クラス名と通り名を描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画左上位置X
     * @param {number} y 描画左上位置Y
     * @param {number} width 幅
     */
    Window_MenuStatus.prototype.drawActorClassAndNickName = function(actor, x, y, width) {
        this.resetFontSettings();
        const displayClassName = actor.currentClass().name + ((actor.gender) ? ("\u30fb" + actor.gender) : "");
        if (actor.nickname()) {
            // ニックネーム指定がある。
            this.contents.fontSize = $gameSystem.mainFontSize() - 12;
            this.drawText(actor.nickname(), x, y, width);
            this.drawText(displayClassName, x, y + 20, width);
        } else {
            // ニックネーム指定がない。
            this.contents.fontSize = $gameSystem.mainFontSize() - 8;
            this.drawText(displayClassName, x, y + 10, width);
        }
    };

    /**
     * レベルを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画領域左上x
     * @param {number} y 描画領域左上y
     * @param {number} width 幅
     */
    // eslint-disable-next-line no-unused-vars
    Window_MenuStatus.prototype.drawActorLevel = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize = $gameSystem.mainFontSize() - 4;
        this.drawText(TextManager.levelA, x, y + 4, 20);
        this.resetFontSettings();
        this.drawText(actor.level, x + 24, y, 32, "right");
    };


    /**
     * ゲージを描画する。
     * 
     * @param {string} type ゲージタイプ。("hp" または "mp")
     * @param {number} current 現在値
     * @param {number} max 最大値
     * @param {number} x ゲージ左上位置x
     * @param {number} y ゲージ左上位置y
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    Window_MenuStatus.prototype.drawGauge = function(type, current, max, x, y, width, height) {
        switch (type) {
            case "hp":
                {
                    const gaugeData = {
                        rate:((max > 0) ? current / max : 0),
                        backColor:ColorManager.gaugeBackColor(),
                        color1:ColorManager.hpGaugeColor1(),
                        color2:ColorManager.hpGaugeColor2()
                    };
                    this.drawGaugeRect(gaugeData, x, y, width, height);
                }
                break;
            case "mp":
                {
                    const gaugeData = {
                        rate:((max > 0) ? current / max : 0),
                        backColor:ColorManager.gaugeBackColor(),
                        color1:ColorManager.mpGaugeColor1(),
                        color2:ColorManager.mpGaugeColor2()
                    };
                    this.drawGaugeRect(gaugeData, x, y, width, height);
                }
                break;
        }

    };

    /**
     * ゲージを描画する。
     * 
     * @param {object} gaugeData ゲージデータ。rate, backColor, color1, color2メンバを持つ。
     * @param {number} x ゲージ左上位置x
     * @param {number} y ゲージ左上位置y
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    Window_MenuStatus.prototype.drawGaugeRect = function(gaugeData, x, y, width, height) {
        const rate = gaugeData.rate;
        const fillW = Math.floor((width - 2) * rate);
        const fillH = height - 2;
        const color0 = gaugeData.backColor;
        const color1 = gaugeData.color1;
        const color2 = gaugeData.color2;
        this.contents.fillRect(x, y, width, height, color0);
        this.contents.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
    };

    /**
     * ゲージのテキストを描画する。
     * 
     * @param {object} data データ
     * @param {number} x ラベル左上位置 x
     * @param {number} y ラベル左上位置 y
     * @param {number} width 幅
     */
    // eslint-disable-next-line no-unused-vars
    Window_MenuStatus.prototype.drawGaugeText = function(data, x, y, width) {
        const paramWidth = Math.floor(width * 0.2);
        const maxValueWidth = Math.floor(width * 0.3);
        const currentValueWidth = width - paramWidth - maxValueWidth - 16;

        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(data.label, x, y + 10, paramWidth, "left");
        x += paramWidth;
        this.changeTextColor(data.color);
        this.contents.fontFace = $gameSystem.numberFontFace();
        this.contents.fontSize = $gameSystem.mainFontSize() + 8;
        this.drawText(data.current, x, y, currentValueWidth, "right");
        x += currentValueWidth;
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = $gameSystem.mainFontSize() - 2;
        this.drawText("/", x, y + 12, 16, "center");
        x += 16;
        this.contents.fontFace = $gameSystem.numberFontFace();
        this.contents.fontSize = $gameSystem.mainFontSize() - 4;
        this.drawText(data.max, x, y + 12, maxValueWidth, "right");
    };

    /**
     * ステータスアイコンを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画領域左上x
     * @param {number} y 描画領域左上y
     * @param {number} width 幅
     */
    Window_MenuStatus.prototype.drawStateIcons = function(actor, x, y, width) {
        const icons = actor.allIcons();
        const padding = 2;
        const hIconCount = Math.floor(width / (ImageManager.iconWidth + padding));
        const drawIconCount = Math.min(hIconCount * 2, icons.length);

        let hIcons = 0;
        let iconX = x;
        let iconY = y;
        for (let i = 0; i < drawIconCount; i++) {
            this.drawIcon(icons[i], iconX, iconY);
            hIcons++;
            if (hIcons >= hIconCount) {
                iconX = x;
                iconY += (ImageManager.iconHeight + 2);
                hIcons = 0;
            } else {
                iconX += (ImageManager.iconHeight + 2);
            }
        }
    };
    //------------------------------------------------------------------------------
    // Window_Help
    const _Window_Help_initialize =  Window_Help.prototype.initialize;
    /**
     * Window_Helpを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_Help.prototype.initialize = function(rect) {
        _Window_Help_initialize.call(this, rect);
        this.initMembers();
        this._clearRequired = false;
    };

    /**
     * メンバを初期化する。
     */
    Window_Help.prototype.initMembers = function() {
        this._textState = null;
        this._waitCount = 0;
        this.clearFlags();
    };

    /**
     * フラグをクリアする。
     */
    Window_Help.prototype.clearFlags = function() {
        this._showFast = false;
        this._lineShowFast = false;
        this._pauseSkip = false;
    };

    /**
     * 表示テキストを設定する。
     * 
     * @param {string} text テキスト
     * !!!overwrite!!! Widnow_Help.setText()
     */
    Window_Help.prototype.setText = function(text) {
        if (this._text !== text) {
            this._text = text;
            const textState = this.createTextState(text, 0, 0, 0);
            textState.x = this.newLineX(textState);
            textState.startX = textState.x;
            this._textState = textState;
            this.newPage(this._textState);
        }
        this._clearRequired = false;
    };
    /**
     * メッセージ改ページする。
     * 
     * @param {TextState} textState テキストステート
     */
    Window_Help.prototype.newPage = function(textState) {
        this.contents.clear();
        this.resetFontSettings();
        this.clearFlags();
        textState.x = textState.startX;
        textState.y = 0;
        textState.height = this.calcTextHeight(textState);
    };
    /**
     * 新しい行の先頭x位置を得る。
     * 
     * @param {object} textState テキストステート
     * @returns {number} x位置
     */
    Window_Help.prototype.newLineX = function(textState) {
        const margin = 4;
        return textState.rtl ? (this.innerWidth - margin) : margin;
    };

    /**
     * 表示テキストをクリアする。
     * 
     * !!!overwrite!!! Window_Help.clear()
     *     Window_Selectable.updateHelpからclear()が呼ばれて、ウィンドウがメッセージ表示途中でクリアされ、
     *     正しく表示されなくなるためオーバーライドする。
     *     代わりにclearRequiredフラグをセットし、update()の中でコンテンツのクリアを行うようにする。
     *     ヘルプメッセージを表示する制御をしている場合、clear()の後にsetText()が呼ばれるので、
     *     setTextが呼ばれた場合にはclearRequiredフラグは解除する。
     *     異なるテキストを表示する場合にはウィンドウがクリアされるし、
     *     同じテキストを表示するならば変更はなくメッセージ表示が継続される。
     *     
     */
    Window_Help.prototype.clear = function() {
        this._clearRequired = true;
    };

    const _Window_Help_update = Window_Help.prototype.update;
    /**
     * 更新する。
     */
    Window_Help.prototype.update = function() {
        _Window_Help_update.call(this);
        if (this._clearRequired) {
            this.contents.clear();
        }
        while (!this.isOpening() && !this.isClosing()) {
            if (this.updateWait()) {
                return ; // ウェイト継続
            } else {
                this.updateMessage();
                return ;
            }
        }
    };
    /**
     * ウェイト指定が0になるまで待機する。
     * 
     * @returns {number} ウェイト状態の場合にはtrue, それ以外はfalse.
     */
    Window_Help.prototype.updateWait = function() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        } else {
            return false;
        }
    };

    /**
     * メッセージ描画を更新する。
     */
    Window_Help.prototype.updateMessage = function() {
        const textState = this._textState;
        if (textState) {
            while (!this.isEndOfText(textState)) {
                if (this.needsNewPage(textState)) {
                    this.newPage(textState);
                }
                this.updateShowFast();
                this.processCharacter(textState);
                if (this.shouldBreakHere(textState)) {
                    break;
                }
            }
            this.flushTextState(textState);
            if (this.isEndOfText(textState)) {
                this.onEndOfText();
            }
            return true;
        } else {
            return false;
        }
    };
    /**
     * 表示するべきテキストの末尾まで表示したかどうかを取得する。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} 終端の場合にはtrue, それ以外はfalse
     */
    Window_Help.prototype.isEndOfText = function(textState) {
        return textState.index >= textState.text.length;
    };
    /**
     * 改ページが必要かどうかを得る。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} 改ページが必要な場合にはtrue, それ以外はfalse
     */
    Window_Help.prototype.needsNewPage = function(textState) {
        return (
            !this.isEndOfText(textState) &&
            textState.y + textState.height > this.contents.height
        );
    };

    /**
     * 高速表示する必要があるかどうかを更新する。
     */
    Window_Help.prototype.updateShowFast = function() {
        if (this.isTriggered()) {
            this._showFast = true;
        }
    };
    /**
     * トリガーされているかどうかを得る。
     * 
     * @returns {boolean} トリガーされていたらtrue, それ以外はfalse.
     */
    Window_Help.prototype.isTriggered = function() {
        if (this.active) {
            return (
                Input.isRepeated("ok") ||
                Input.isRepeated("cancel") ||
                TouchInput.isRepeated()
            );
        } else {
            return true;
        }
    };
    /**
     * ブレーク可能かどうかを得る。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} ブレーク可能な場合にはtrue, それ以外はfalse
     */
    Window_Help.prototype.shouldBreakHere = function(textState) {
        if (this.canBreakHere(textState)) {
            if (!this._showFast && !this._lineShowFast) {
                return true;
            }
            if (this.pause || this._waitCount > 0) {
                return true;
            }
        }
        return false;
    };
    /**
     * ブレーク可能な位置かどうかを得る。
     * 
     * @param {object} textState テキストステート
     * @returns {boolean} ブレーク可能な位置の場合にはtrue, それ以外はfalse
     */
    Window_Help.prototype.canBreakHere = function(textState) {
        if (!this.isEndOfText(textState)) {
            const c = textState.text[textState.index];
            if (c.charCodeAt(0) >= 0xdc00 && c.charCodeAt(0) <= 0xdfff) {
                // surrogate pair
                return false;
            }
            if (textState.rtl && c.charCodeAt(0) > 0x20) {
                return false;
            }
        }
        return true;
    };
    /**
     * テキスト表示が終了したときの処理を行う。
     */
    Window_Help.prototype.onEndOfText = function() {
        this._textState = null;
    };
    /**
     * エスケープキャラクタを処理する。
     * 
     * Note: 標準エスケープキャラクタのうち、ウェイトと行を纏めて表示ON/OFFする機能を提供する。
     * 
     * @param {string} code 文字
     * @param {object} textState テキストステート
     */
    Window_Help.prototype.processEscapeCharacter = function(code, textState) {
        switch (code) {
            case ">":
                this._lineShowFast = true;
                break;
            case "<":
                this._lineShowFast = false;
                break;
            default:
                Window_Base.prototype.processEscapeCharacter.call(
                    this,
                    code,
                    textState
                );
                break;
        }
    };
    /**
     * ウェイト処理を開始する。
     * 
     * @param {number} count ウェイトフレーム数
     */
    Window_Help.prototype.startWait = function(count) {
        this._waitCount = count;
    };
    /**
     * リフレッシュする。
     */
    Window_Help.prototype.refresh = function() {
        // Do nothing.
    };

})();
