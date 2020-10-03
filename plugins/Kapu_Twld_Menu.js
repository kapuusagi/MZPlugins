/*:ja
 * @target MZ 
 * @plugindesc TWLD向けメニュープラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Twld_BattleSystem
 * @orderAfter Kapu_Twld_BattleSystem
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
 * Version.0.1.0 TWLD向けに作成した。
 */

 function Sprite_MenuStatusActor() {
     this.initialize(...arguments);
 };
(() => {
    const pluginName = "Kapu_Twld_Menu";
    const parameters = PluginManager.parameters(pluginName);

    const statusY = 260;

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
     * @return {Number} カラム数
     * !!!overwrite!!!
     */
    Window_MenuStatus.prototype.maxCols = function() {
        return Math.min($gameParty.members().length, $gameParty.maxBattleMembers());
    };
    /**
     * 有効な行数を得る。
     * 
     * @return {Number} 行数
     * !!!overwrite!!! Window_MenuStatus.numVisibleRows 
     */
    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 1;
    };

    /**
     * 項目の画像を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_MenuStatus.prototype.drawItemImage = function(index) {
        const actor = this.actor(index);
        if (actor.battlePicture()) {
            this.drawItemImageBattlePicture(index);
        } else {
            this.drawItemImageFace(index);
        }

        const rect = this.itemRect(index);
        this.changePaintOpacity(false);
        const statusRect = this.statusRect(index);
        this.contents.fillRect(statusRect.x, statusRect.y, statusRect.width, statusRect.height, "#000000");
        this.changePaintOpacity(true);
    };

    /**
     * 画像を描画する。
     * 
     * @param {Number} 項目のインデックス番号
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
        this.drawPicture(pictureName, rect.x + 2, rect.y, rect.width - 4, rect.height);
        this.resetPaintFilter();
    };

    /**
     * 画像を描画する。
     * 
     * @param {String} name 画像ファイル名
     * @param {Number} x 描画領域左上 x位置
     * @param {Number} y 描画領域左上 y位置
     * @param {Number} width 描画領域幅
     * @param {Number} height 描画領域高さ
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
     * @param {Number} index 項目のインデックス番号
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
     * @param {Number} x 描画領域左上X
     * @param {Number} y 描画領域左上Y
     * @param {Number} width 幅
     * @param {Number} height 高さ
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
     * @param {String} filterStr 描画フィルター文字列。
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
     * 
     * @param {Number} index インデックス番号
     * @return {Rectangle} ステータス領域の矩形領域
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
     * @param {Number} index インデックス番号
     * !!!overwrite!!! Window_MenuStatus.drawItemStatus()
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
        this.drawGauge("hp", actor.hp, actor.mhp, x, y + 32, width, 12);

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
        this.drawGauge("mp", actor.mp, actor.mmp, x, y + 32, width, 16);

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
     * クラス名と通り名を描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画左上位置X
     * @param {Number} y 描画左上位置Y
     * @param {Number} width 幅
     */
    Window_MenuStatus.prototype.drawActorClassAndNickName = function(actor, x, y, width) {
        this.resetFontSettings();
        if (actor.nickname()) {
            // ニックネーム指定がある。
            this.contents.fontSize = $gameSystem.mainFontSize() - 12;
            this.drawText(actor.nickname(), x, y, width);
            this.drawText(actor.currentClass().name, x, y + 20, width);
        } else {
            // ニックネーム指定がない。
            this.contents.fontSize = $gameSystem.mainFontSize() - 8;
            this.drawText(actor.currentClass().name, x, y + 10, width);
        }
    };

    /**
     * レベルを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
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
     * @param {String} type ゲージタイプ。("hp" または "mp")
     * @param {Number} current 現在値
     * @param {Number} max 最大値
     * @param {Number} x ゲージ左上位置x
     * @param {Number} y ゲージ左上位置y
     * @param {Number} width 幅
     * @param {Number} height 高さ
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
     * @param {Object} gaugeData ゲージデータ。rate, backColor, color1, color2メンバを持つ。
     * @param {Number} x ゲージ左上位置x
     * @param {Number} y ゲージ左上位置y
     * @param {Number} width 幅
     * @param {Number} height 高さ
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

    const paramWidth = 36;
    const currentValueWidth = 56;
    const maxValueWidth = 40;
    /**
     * ゲージのテキストを描画する。
     * 
     * @param {Object} data データ
     * @param {Number} x ラベル左上位置 x
     * @param {Number} y ラベル左上位置 y
     * @param {Number} width 幅
     */
    Window_MenuStatus.prototype.drawGaugeText = function(data, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(data.label, x, y + 10, paramWidth, "left");
        x += paramWidth;
        this.changeTextColor(data.color);
        this.contents.fontSize = $gameSystem.mainFontSize() + 8;
        this.drawText(data.current, x, y, currentValueWidth, "right");
        x += currentValueWidth;
        this.contents.fontSize = $gameSystem.mainFontSize() - 2;
        this.drawText("/", x, y + 12, 16, "center");
        x += 16;
        this.contents.fontSize = $gameSystem.mainFontSize() - 4;
        this.drawText(data.max, x, y + 12, maxValueWidth, "right");
    };

    /**
     * ステータスアイコンを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
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
    // Scene_Menu
    /**
     * コマンドウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     * !!!overwrite!!! Scene_Menu.commandWindowRect
     */
    Scene_Menu.prototype.commandWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.goldWindowRect().height;
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };
    
    /**
     * 所持金ウィンドウを表示する矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     * !!!overwrite!!! Scene_Menu.goldWindowRect
     */
    Scene_Menu.prototype.goldWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaBottom() - wh;
        return new Rectangle(wx, wy, ww, wh);
    };
    /**
     * ステータスウィンドウを表示する矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Menu_statusWindowRect
     */
    Scene_Menu.prototype.statusWindowRect = function() {
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight();
        const wx = 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };



})();