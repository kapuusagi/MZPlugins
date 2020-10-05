/*:ja
 * @target MZ 
 * @plugindesc ステータス画面プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @param statusPictureMethod
 * @text ステータス画像メソッド名
 * @desc アクターのステータス画像を取得するメソッド名。
 * @type string
 * 
 * @param labelClass
 * @text クラスラベル名
 * @desc クラスのラベルとして使用するテキスト。
 * @type string
 * @default クラス
 * 
 * @param labelNickName
 * @text ニックネームラベル名
 * @desc ニックネームのラベルとして使用するテキスト。
 * @type string
 * @default 通り名
 * 
 * @param displayTp
 * @text TP表示
 * @desc TPを表示する場合にはtrue, 表示しない場合にはfalse
 * @type boolean
 * @default false
 * 
 * @param status0
 * @text 表示項目1
 * @desc ステータス画面に表示する項目。
 * @type struct<displayEntry>
 * 
 * @param status1
 * @text 表示項目2
 * @desc ステータス画面に表示する項目。
 * @type struct<displayEntry>
 * 
 * @param status2
 * @text 表示項目3
 * @desc ステータス画面に表示する項目。
 * @type struct<displayEntry>
 * 
 * @param status3
 * @text 表示項目4
 * @desc ステータス画面に表示する項目。
 * @type struct<displayEntry>
 * 
 * @param param0
 * @text ページ2 パラメータ1
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param1
 * @text ページ2 パラメータ2
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param2
 * @text ページ2 パラメータ3
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param3
 * @text ページ2 パラメータ4
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param4
 * @text ページ2 パラメータ5
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param5
 * @text ページ2 パラメータ6
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param6
 * @text ページ2 パラメータ7
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param7
 * @text ページ2 パラメータ8
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param8
 * @text ページ2 パラメータ9
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param9
 * @text ページ2 パラメータ10
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param10
 * @text ページ2 パラメータ11
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param11
 * @text ページ2 パラメータ12
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param12
 * @text ページ2 パラメータ13
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param13
 * @text ページ2 パラメータ14
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param14
 * @text ページ2 パラメータ15
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param15
 * @text ページ2 パラメータ16
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param16
 * @text ページ2 パラメータ17
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param17
 * @text ページ2 パラメータ18
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param18
 * @text ページ3 パラメータ19
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param19
 * @text ページ3 パラメータ20
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param20
 * @text ページ3 パラメータ21
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param21
 * @text ページ3 パラメータ22
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param22
 * @text ページ3 パラメータ23
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param23
 * @text ページ3 パラメータ24
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param24
 * @text ページ3 パラメータ25
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param25
 * @text ページ3 パラメータ26
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param26
 * @text ページ3 パラメータ27
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param27
 * @text ページ3 パラメータ28
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param28
 * @text ページ3 パラメータ29
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param29
 * @text ページ3 パラメータ30
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param30
 * @text ページ3 パラメータ31
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param31
 * @text ページ3 パラメータ32
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param32
 * @text ページ3 パラメータ33
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param33
 * @text ページ3 パラメータ34
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param34
 * @text ページ3 パラメータ35
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @param param35
 * @text ページ3 パラメータ36
 * @desc ステータス画面に表示するパラメータ
 * @type struct<paramEntry>
 * 
 * @help 
 * ベーシックシステムのステータス画面は情報量が乏しすぎてしんどいので、
 * 情報量を増やしたプラグイン。
 * ステータス画面はゲームデザインする人が、
 * そのゲームに合わせてデザインしないと上手くいかない。
 * (プラグインで追加する要素とかもあるしね。)
 * 
 * 本プラグインでは、以下の機能を提供する。
 * ・ページ切り替えによるステータス表示項目の変更
 * ・プラグインパラメータによる、任意パラメータの表示
 *   アクターステータス欄4つ＋任意パラメータ最大36個（atkなど指定できるものに限る）
 * ・属性耐性表示
 * ・ステータス画面用画像ファイル取得プロパティ設定
 * 
 * ■ 使用時の注意
 * 他のステータス画面拡張系プラグインとは競合すると思います。
 * もしかしたらうまく拡張できる．．．かも？
 * ベーシックシステムのレイアウトを大きく変えると、
 * 表示とかがうまくいかないかもしれません。
 * 
 * ■ プラグイン開発者向け
 * 表示項目を独自に増やすには、
 * Window_StatusParams.makePages をフックし、
 * addPage()で描画メソッドを追加します。
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
 * Version.0.1.0 動作未確認。
 */
/*~struct~displayEntry:
 *
 * @param enabled
 * @desc 有効にする場合にはtrue, それ以外はfalse
 * @type boolean
 * @default false
 * 
 * @param name
 * @text 項目名
 * @desc 表示項目名
 * @type string
 * @default
 * 
 * @param propertyName
 * @text プロパティ名
 * @desc プロパティ名
 * @type string
 * @default
 * 
 * @param alignment
 * @text アライメント
 * @desc 値の描画方法
 * @type select
 * @option 左寄せ
 * @value left
 * @option センタリング
 * @value center
 * @option 右寄せ
 * @value right
 * @default right
 * 
 */
/*~struct~paramEntry:
 *
 * @param enabled
 * @text 有効
 * @desc 有効にする場合にはtrue, それ以外はfalse
 * @type boolean
 * @default false
 * 
 * @param name
 * @text 名前
 * @desc パラメータの表示名
 * @type string
 * @default
 * 
 * @param propertyName
 * @text プロパティ名
 * @desc 値を取得するプロパティ名。(atk等)
 * @type string
 * @default
 * 
 * @param type
 * @text タイプ
 * @desc パラメータタイプ
 * @type select
 * @option 整数
 * @value int
 * @option 割合
 * @value rate
 * @parent param0
 * @default int
 */

(() => {
    const pluginName = "Kapu_BasicStatusUI";
    const parameters = PluginManager.parameters(pluginName);
    const statusPictureMethod = String(parameters["statusPictureMethod"]) || "";
    const labelClassText = String(parameters["labelClass"]) || "Class";
    const labelNickNameText = String(parameters["labelNickName"]) || "NickName";
    const displayTp = Boolean(parameters["displayTp"]) || false;
    const labelWidth1 = 64;
    const labelWidth2 = 32;
    const labelWidth3 = 96;

    const statusBlock4Items = [];
    for (let i = 0; i < 4; i++) {
        const statusEntry = JSON.parse(parameters["status" + i]);
        statusBlock4Items.push(statusEntry);
    }
    const customParams = [];
    for (let i = 0; i < 36; i++) {
        const paramEntry = JSON.parse(parameters["param" + i]);
        customParams.push(paramEntry);
    }

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    //------------------------------------------------------------------------------
    // Window_Status

    const _Window_Status_processHandling = Window_Status.prototype.processHandling;

    /**
     * 入力検出処理を行う。
     */
    Window_Status.prototype.processHandling = function() {
        if (this.isOpenAndActive()) {
            if (this.isHandled("up") && Input.isTriggered("up")) {
                return this.processButton("up");
            }
            if (this.isHandled("down") && Input.isTriggered("down")) {
                return this.processButton("down");
            }
            if (this.isHandled("left") && Input.isTriggered("left")) {
                return this.processButton("left");
            }
            if (this.isHandled("right") && Input.isTriggered("right")) {
                return this.processButton("right");
            }
        }

        return _Window_Status_processHandling.call(this);
    };

    /**
     * 左ボタン押下を処理する。
     * 
     * @param {String} symbol 呼び出すハンドラのシンボル
     */
    Window_Status.prototype.processButton = function(symbol) {
        this.playCursorSound();
        this.updateInputData();
        this.deactivate();
        this.callHandler(symbol);
    };

    /**
     * ウィンドウを更新する。
     * 
     * !!!overwrite!!!
     */
    Window_Status.prototype.refresh = function() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this._actor) {
            this.drawBackgroundImage();
            this.drawStatus();
        }
    };

    /**
     * 背景画像を描画する。
     */
    Window_Status.prototype.drawBackgroundImage = function() {
        const actor = this._actor;
        if ((statusPictureMethod in actor) && actor[statusPictureMethod]()) {
            this.drawActorPicture();
        } else {
            const y = this.block2Y();
            this.drawActorFace(actor, 12, y);    
        }
    };

    /**
     * 画像を描画する。
     * 
     * @param {Number} 項目のインデックス番号
     */
    Window_Status.prototype.drawActorPicture = function() {
        const actor = this._actor;
        const pictureName = actor[statusPictureMethod]();
        const bitmap = ImageManager.loadPicture(pictureName);
        if (!bitmap.isReady()) {
            return;
        }

        if (actor.isDead()) {
            this.setPaintFilter("grayscale(100%)");
        } else {
            this.setPaintFilter("none");
        }
        this.changePaintOpacity(actor.isBattleMember())
        const height = this.baseTextRect().height;
        this.drawPicture(pictureName, 0, 0, 200, height);
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
    Window_Status.prototype.drawPicture = function(name, x, y, width, height) {
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

    const _Window_Status_drawActorFace = Window_MenuStatus.prototype.drawActorFace;
    /**
     * アクターの顔グラフィックを描画する。
     * 
     * @param {Game_Battler} actor アクター
     * @param {Number} x 描画領域左上X
     * @param {Number} y 描画領域左上Y
     * @param {Number} width 幅
     * @param {Number} height 高さ
     */
    Window_Status.prototype.drawActorFace = function(actor, x, y, width, height) {
        if (actor.isDead()) {
            this.setPaintFilter("grayscale(100%)");
        } else {
            this.setPaintFilter("none");
        }
        _Window_Status_drawActorFace.call(this, actor, x, y, width, height);
        this.resetPaintFilter();
    };


    /**
     * ブロック1を描画する。
     * 
     * !!!overwrite!!! Window_Status_drawBlock1
     */
    Window_Status.prototype.drawStatus = function() {
        const x = 220;
        const y = 6;
        const lineHeight = this.lineHeight();
        this.drawStatusBlock1(x, y);
        const y2 = y + 92;
        this.drawStatusBlock2(x, y2);
        this.drawStates(x + 240, y2);
        const y3 = y2 + this.lineHeight();
        this.drawStatusBlock3(x + 240, y3);
        this.drawStatusBlock4(x + 560, y3);
    };

    /**
     * ステータスブロック1を描画する。
     * アクター名、クラス名、ニックネームを描画する。
     * 
     * @param {Number} x 描画範囲左上位置x
     * @param {Number} y 描画範囲左上位置y
     */
    Window_Status.prototype.drawStatusBlock1 = function(x, y) {
        const lineHeight = this.lineHeight();
        this.drawActorName(this._actor, x, y, 168);
        const y2 = Math.round(y + lineHeight * 1.4);
        this.drawActorClass(this._actor, x, y2, 270);
        x += 276;
        if (this._actor.nickname()) {
            this.drawActorNickname(this._actor, x, y2, 270);
        }
    };

    /**
     * アクター名を描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上位置x
     * @param {Number} y 描画領域左上位置y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorName = function(actor, x, y, width) {
        this.contents.fontSize = $gameSystem.mainFontSize() + 8;
        Window_StatusBase.prototype.drawActorName.call(this, actor, x, y, width);
    };

    /**
     * アクターのクラスを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上位置x
     * @param {Number} y 描画領域左上位置y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorClass = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(labelClassText, x, y, labelWidth1);
        this.resetFontSettings();
        const valueX = x + labelWidth1 + 8;
        const valueWidth = width - labelWidth1 - 8;
        Window_StatusBase.prototype.drawActorClass.call(this, actor, valueX, y, valueWidth);
    };

    /**
     * アクターのニックネームを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上位置x
     * @param {Number} y 描画領域左上位置y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorNickname = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(labelNickNameText, x, y, labelWidth1);
        this.resetFontSettings();
        const valueX = x + labelWidth1 + 8;
        const valueWidth = width - labelWidth1 - 8;
        Window_StatusBase.prototype.drawActorNickname.call(this, actor, valueX, y, valueWidth);
    };

    /**
     * 描画フィルターを設定する。
     * (MDNのドキュメントを見る限り、ChromeとFirefoxじゃないと動かない？)
     * 
     * @param {String} filterStr 描画フィルター文字列。
     */
    Window_Status.prototype.setPaintFilter = function(filterStr) {
        this.contents.context.filter = filterStr;
    };

    /**
     * 描画フィルターをリセットする。
     */
    Window_Status.prototype.resetPaintFilter = function() {
        this.contents.context.filter = "none";
    };

    /**
     * ステートを描画する。
     * 
     * @param {Number} x 描画位置左上x
     * @param {Number} y 描画位置左上y
     */
    Window_Status.prototype.drawStates = function(x, y) {
        const rect = this.baseTextRect();
        const icons = this._actor.allIcons();
        const iconPadding = 4;
        const drawOffset = ImageManager.iconWidth + iconPadding;
        const iconCount = Math.floor((rect.width - x) / drawOffset);
        const drawCount = Math.min(iconCount, icons.length);
        for (let i = 0; i < drawCount; i++) {
            this.drawIcon(icons[i], x, y);
            x += drawOffset;
        }
    };
    /**
     * ステータスブロック2を描画する。
     * 
     * @param {Number} x 描画位置左上x
     * @param {Number} y 描画位置左上y
     */
    Window_Status.prototype.drawStatusBlock2 = function(x, y) {
        const lineHeight = Math.floor(this.lineHeight() * 1.4);
        this.drawActorLevel(this._actor, x, y, 168);
        y += lineHeight;
        this.drawActorHp(this._actor, x, y, 168);
        y += lineHeight;
        this.drawActorMp(this._actor, x, y, 168);
        y += lineHeight;
        if (displayTp) {
            this.drawActorTp(this._actor, x, y, 168);
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
    Window_Status.prototype.drawActorLevel = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize = $gameSystem.mainFontSize() - 4;
        this.drawText(TextManager.levelA, x, y + 4, labelWidth2);
        this.resetFontSettings();
        this.drawText(actor.level, x + labelWidth2, y, 32, "right");
    };

    /**
     * アクターのHPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorHp = function(actor, x, y, width) {
        // ゲージ描画
        const current = actor.hp;
        const max = actor.mhp;
        const gaugeData = {
            rate:((max > 0) ? current / max : 0),
            backColor:ColorManager.gaugeBackColor(),
            color1:ColorManager.hpGaugeColor1(),
            color2:ColorManager.hpGaugeColor2()
        };
        this.drawGaugeRect(gaugeData,
                x + labelWidth2, y + 24, width - labelWidth2, 12);
        // テキスト描画
        const data = {
            label:TextManager.hpA,
            color:ColorManager.hpColor(actor),
            current:current,
            max:max
        };
        this.drawGaugeText(data, x, y, width);
    };

    /**
     * アクターのMPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorMp = function(actor, x, y, width) {
        // ゲージ描画
        const current = actor.mp;
        const max = actor.mmp;
        const gaugeData = {
            rate:((max > 0) ? current / max : 0),
            backColor:ColorManager.gaugeBackColor(),
            color1:ColorManager.mpGaugeColor1(),
            color2:ColorManager.mpGaugeColor2()
        };
        this.drawGaugeRect(gaugeData,
                x + labelWidth2, y + 24, width - labelWidth2, 12);
        // テキスト描画
        const data = {
            label:TextManager.mpA,
            color:ColorManager.mpColor(actor),
            current:current,
            max:max
        };
        this.drawGaugeText(data, x, y, width);
    };

    /**
     * アクターのTPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorTp = function(actor, x, y, width) {
        // ゲージ描画
        const current = actor.tp;
        const max = actor.maxTp();
        const gaugeData = {
            rate:((max > 0) ? current / max : 0),
            backColor:ColorManager.gaugeBackColor(),
            color1:ColorManager.tpGaugeColor1(),
            color2:ColorManager.tpGaugeColor2()
        };
        this.drawGaugeRect(gaugeData,
                x + labelWidth2, y + 24, width - labelWidth2, 12);
        // テキスト描画
        const data = {
            label:TextManager.tpA,
            color:ColorManager.tpColor(actor),
            current:current,
            max:max
        };
        this.drawGaugeText(data, x, y, width);
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
    Window_Status.prototype.drawGaugeRect = function(gaugeData, x, y, width, height) {
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
    const currentValueWidth = 72;
    const maxValueWidth = 52;
    /**
     * ゲージのテキストを描画する。
     * 
     * @param {Object} data データ
     * @param {Number} x ラベル左上位置 x
     * @param {Number} y ラベル左上位置 y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawGaugeText = function(data, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(data.label, x, y + 8, paramWidth, "left");
        x += paramWidth;
        this.changeTextColor(data.color);
        this.contents.fontSize = $gameSystem.mainFontSize() + 8;
        this.drawText(data.current, x, y, currentValueWidth, "right");
        x += currentValueWidth;
        this.contents.fontSize = $gameSystem.mainFontSize() - 2;
        this.drawText("/", x, y + 8, 16, "center");
        x += 16;
        this.contents.fontSize = $gameSystem.mainFontSize() - 4;
        this.drawText(data.max, x, y + 8, maxValueWidth, "right");
    };

    /**
     * ステータスブロック1を描画する。
     * アクター名、クラス名、ニックネームを描画する。
     * 
     * @param {Number} x 描画範囲左上位置x
     * @param {Number} y 描画範囲左上位置y
     */
    Window_Status.prototype.drawStatusBlock3 = function(x, y) {
        const lineHeight = this.lineHeight();

        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        const labelNext = TextManager.expNext.format(TextManager.level);
        this.drawText(labelNext, x, y, 240, "left");
        y += lineHeight;
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(this.expNextValue(), x, y, 240, "right");
        y += lineHeight + 10;
        this.changeTextColor(ColorManager.systemColor());
        const labelTotal = TextManager.expTotal.format(TextManager.exp);
        this.drawText(labelTotal, x, y, 240, "left");
        y += lineHeight;
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(this.expTotalValue(), x, y, 240, "right");
        y += lineHeight;
    };

    /**
     * ステータスブロック4を描画する。
     * アクター名、クラス名、ニックネームを描画する。
     * 
     * @param {Number} x 描画範囲左上位置x
     * @param {Number} y 描画範囲左上位置y
     */
    Window_Status.prototype.drawStatusBlock4 = function(x, y) {
        const lineHeight = this.lineHeight();
        const actor = this._actor;
        const valueX = x + labelWidth3 + 16
        const valueWidth = 240 - labelWidth3 - 16;
        for (let i = 0; i < 4; i++) {
            const item = statusBlock4Items[i];
            if (item.enabled && item.name && item.propertyName && (item.propertyName in actor)) {
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(item.name, x, y, labelWidth3);
                const value = actor[item.propertyName];
                this.changeTextColor(ColorManager.normalColor());
                this.drawText(value, valueX, y, valueWidth, item.alignment);
            }
            y += lineHeight;
        }
    };

    //------------------------------------------------------------------------------
    // Window_StatusParams

    const _Window_StatusParams_initialize = Window_StatusParams.prototype.initialize;
    /**
     * Window_StatusParamsを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_StatusParams.prototype.initialize = function(rect) {
        _Window_StatusParams_initialize.call(this, rect);
        this._pageNumber = 0;
        this._pages = [];
        this.makePages();
    };

    /**
     * ページを追加する。
     * ステータスページを追加する場合にはmakePagesをフックする。
     */
    Window_StatusParams.prototype.makePages = function() {
        this.addPage(this.drawParamPage.bind(this), null);
        if (this.customParamExists(0, 18)) {
            this.addPage(this.drawCustomizeParamPage.bind(this), 0);
        }
        if (this.customParamExists(18, 18)) {
            this.addPage(this.drawCustomizeParamPage.bind(this), 18);
        }
        const elementCount = $dataSystem.elements.length - 1;
        const elementPageCount = Math.ceil(elementCount / 18);
        for (let i = 0; i < elementPageCount; i++) {
            this.addPage(this.drawElementRatePage.bind(this), i * 18 + 1);
        }
    };

    /**
     * begin - (begin + length - 1)間に有効な表示パラメータがあるかどうかを取得する。
     * 
     * @param {Number} begin 開始インデックス
     * @param {Number} length チェック範囲の数
     * @return {Boolean} パラメータが存在する場合にはtrue, それ以外はfalse.
     */
    Window_StatusParams.prototype.customParamExists = function(begin, length) {
        for (let i = begin; i < (begin + length); i++) {
            const item = customParams[i];
            if (this.isCustomParamEnabled(item)) {
                return true;
            }
            return false;
        }
    };

    /**
     * カスタムパラメータが有効かどうかを取得する。
     * 
     * @param {Object} item カスタムパラメータオブジェクト
     * @return {Boolean} カスタムパラメータが有効な場合にはtrue, それ以外はfalse.
     */
    Window_StatusParams.prototype.isCustomParamEnabled = function(item) {
        return item.enabled && item.name && (item.propertyName in Game_Actor.prototype);
    };

    /**
     * ページを追加する。
     * 
     * @param {Function} method メソッド
     * @param {Object} arg メソッドに渡すパラメータ
     */
    Window_StatusParams.prototype.addPage = function(method, arg) {
        this._pages.push({ method:method, arg:arg });
    };

    /**
     * ページ数を得る。
     * 
     * @return {Number} ページ数
     */
    Window_StatusParams.prototype.pageCount = function() {
        return this._pages.length;
    };

    /**
     * ページ番号を設定する。
     * 
     * @param {Number} pageNumber ページ番号
     */
    Window_StatusParams.prototype.setPage = function(pageNumber) {
        if (this._pageNumber !== pageNumber) {
            this._pageNumber = pageNumber;
            this.refresh();
        }
    };

    /**
     * ページ番号を得る。
     * 
     * @return {Number} ページ番号
     */
    Window_StatusParams.prototype.page = function() {
        return this._pageNumber;
    }

    /**
     * Window_StatusParamsを描画する。
     */
    Window_StatusParams.prototype.paint = function() {
        this.hideAdditionalSprites();
        if (this.contents) {
            this.contents.clear();
            this.contentsBack.clear();
            this.drawPage();
        }
    };

    /**
     * ページを描画する。
     */
    Window_StatusParams.prototype.drawPage = function() {
        const entry = this._pages[this._pageNumber];
        entry.method(entry.arg);
    };
    /**
     * パラメータページを描画する。
     * 
     * @param {Object} arg 引数
     */
    Window_StatusParams.prototype.drawParamPage = function(arg) {
        const rect = this.baseTextRect();
        const padding = this.itemPadding();
        const x1 = rect.x + padding;
        const width = Math.min(160, rect.width / 2 - padding * 8);
        const height = this.lineHeight();
        let paramId = 0;
        for (let i = 0; i < 6; i++) {
            const y = rect.y + height * i;
            this.drawParam(paramId, x1, y, width);
            paramId++;
        }
        const x2 = x1 + width + padding * 4;
        for (let i = 0; i < 2; i++) {
            const y = rect.y + height * i;
            this.drawParam(paramId, x2, y, width);
            paramId++;
        }
    };
    /**
     * パラメータを描画する。
     * 
     * @param {Number} paramId パラメータID
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_StatusParams.prototype.drawParam = function(paramId, x, y, width) {
        const name = TextManager.param(paramId);
        const value = this._actor.param(paramId);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, x, y, 72);
        this.resetTextColor();
        this.drawText(value, x + 80, y, width - 72, "right");
    };
    /**
     * カスタマイズパラメータページを描画する。
     * 
     * @param {Object} arg 引数。表示開始するカスタムパラメータID。
     */
    Window_StatusParams.prototype.drawCustomizeParamPage = function(arg) {
        const rect = this.baseTextRect();
        const padding = this.itemPadding();
        const x1 = rect.x + padding;
        const width = Math.min(160, rect.width / 3 - padding * 6);
        const height = this.lineHeight();
        let id = arg;
        for (let i = 0; i < 6; i++) {
            const item = customParams[id];
            const y = rect.y + height * i;
            if (this.isCustomParamEnabled(item)) {
                this.drawCustomizeParam(item, x1, y, width);
            }
            id++;
        }
        const x2 = x1 + width + padding * 4;
        for (let i = 0; i < 6; i++) {
            const item = customParams[id];
            const y = rect.y + height * i;
            if (this.isCustomParamEnabled(item)) {
                this.drawCustomizeParam(item, x2, y, width);
            }
            id++;
        }
        const x3 = x2 + width + padding * 4;
        for (let i = 0; i < 6; i++) {
            const item = customParams[id];
            const y = rect.y + height * i;
            if (this.isCustomParamEnabled(item)) {
                this.drawCustomizeParam(item, x3, y, width);
            }
            id++;
        }
    };
    /**
     * カスタム項目を描画する。
     * 
     * @param {Object} item アイテム
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_StatusParams.prototype.drawCustomizeParam = function(item, x, y, width) {
        const name = item.name;
        const value = this._actor[item.propertyName];
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, x, y, 56);
        this.resetTextColor();
        if (item.type === "int") {
            this.drawText(value, x + 64, y, width - 80, "right");
        } else if (item.type === "rate") {
            const rateStr = (Math.round(value * 1000) / 10);
            this.drawText(rateStr, x + 64, y, width - 80, "right");
            this.drawText("%", x + 64 + (width - 80) + 6, y, 16, "left");
        }
    };
    /**
     * エレメントレートを描画する。
     * 
     * @param {Object} arg 引数。表示開始する属性ID。
     */
    Window_StatusParams.prototype.drawElementRatePage = function(arg) {
        const rect = this.baseTextRect();
        const padding = this.itemPadding();
        const x1 = rect.x + padding;
        const width = Math.min(160, rect.width / 3 - padding * 6);
        const height = this.lineHeight();
        let id = arg;
        for (let i = 0; i < 6; i++) {
            if (id >= ($dataSystem.elements.length - 1)) {
                break;
            }
            const name = $dataSystem.elements[id];
            const rate = this._actor.elementRate(id);
            const y = rect.y + height * i;
            this.drawElementRate(name, rate, x1, y, width);
            id++;
        }
        const x2 = x1 + width + padding * 4;
        for (let i = 0; i < 6; i++) {
            if (id >= ($dataSystem.elements.length - 1)) {
                break;
            }
            const name = $dataSystem.elements[id];
            const rate = this._actor.elementRate(id);
            const y = rect.y + height * i;
            this.drawElementRate(name, rate, x2, y, width);
            id++;
        }
        const x3 = x2 + width + padding * 4;
        for (let i = 0; i < 6; i++) {
            if (id >= ($dataSystem.elements.length - 1)) {
                break;
            }
            const name = $dataSystem.elements[id];
            const rate = this._actor.elementRate(id);
            const y = rect.y + height * i;
            this.drawElementRate(name, rate, x3, y, width);
            id++;
        }
    };
    /**
     * エレメントレートを描画する。
     * 
     * @param {String} name 属性名
     * @param {Number} rate レート
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_StatusParams.prototype.drawElementRate = function(name, rate, x, y, width) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, x, y, 56);
        this.resetTextColor();
        const rateStr = (Math.round(rate * 1000) / 10);
        this.drawText(rateStr, x + 64, y, width - 80, "right");
        this.drawText("%", x + 64 + (width - 80) + 6, y, 16, "left");
    };

    //------------------------------------------------------------------------------
    // Scene_Status
    const _Scene_Status_createStatusWindow = Scene_Status.prototype.createStatusWindow;
    /**
     * ステータスウィンドウを作成する。
     * ステータスウィンドウはアクターの基本ステータス（顔グラフィックやレベルなど）を表示するウィンドウ。
     */
    Scene_Status.prototype.createStatusWindow = function() {
        _Scene_Status_createStatusWindow.call(this);
        this._statusWindow.setHandler("up", this.onPreviousPage.bind(this));
        this._statusWindow.setHandler("left", this.onPreviousPage.bind(this));
        this._statusWindow.setHandler("down", this.onNextPage.bind(this));
        this._statusWindow.setHandler("right", this.onNextPage.bind(this));
    };
    const _Scene_Status_createButtons = Scene_Status.prototype.createButtons;
    /**
     * ボタンを作成する。
     */
    Scene_Status.prototype.createButtons = function() {
        _Scene_Status_createButtons.call(this);
        if (ConfigManager.touchUI) {
            // ステータスページ切り替えボタン追加するよ
            this.createChangePageButtons();
        }
    };

    /**
     * ページ切り替えボタンを作成する。
     */
    Scene_Status.prototype.createChangePageButtons = function() {
        this._leftButton = new Sprite_Button("up");
        this._leftButton.x = 120;
        this._leftButton.y = this.buttonY();
        this._rightButton = new Sprite_Button("down");
        this._rightButton.x = this._leftButton.x + this._leftButton.width + 4;
        this._rightButton.y = this.buttonY();
        this.addWindow(this._leftButton);
        this.addWindow(this._rightButton);
        this._leftButton.setClickHandler(this.onPreviousPage.bind(this));
        this._rightButton.setClickHandler(this.onNextPage.bind(this));
    };

    /**
     * パラメータ表示領域の幅を得る。
     * 
     * @return {Number} パラメータ表示領域の幅
     */
    Scene_Status.prototype.statusParamsWidth = function() {
        return 720;
    };

    /**
     * 前のページを描画する。
     */
    Scene_Status.prototype.onPreviousPage = function() {
        let page = this._statusParamsWindow.page() - 1;
        if (page < 0) {
            page = this._statusParamsWindow.pageCount() - 1;
        }
        this._statusParamsWindow.setPage(page);
        this._statusWindow.activate();
    };

    /**
     * 次のページを描画する。
     */
    Scene_Status.prototype.onNextPage = function() {
        let page = this._statusParamsWindow.page() + 1;
        if (page >= this._statusParamsWindow.pageCount()) {
            page = 0;
        }
        this._statusParamsWindow.setPage(page);
        this._statusWindow.activate();
    };

})();