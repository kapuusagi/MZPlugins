/*:ja
 * @target MZ 
 * @plugindesc hogehoge
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command captureScreen
 * @text キャプチャ設定する
 * @desc スクリーンのキャプチャ要求をセットします。一度「ピクチャの表示」をするとクリアされます。
 *
 * @command captureScreenOff
 * @text キャプチャ設定解除
 * @desc スクリーンのキャプチャ要求をクリアします。
 * 
 * @help 
 * Yoji Ojima氏の TextPicture.js を参考にして作成。
 * 画面をキャプチャして、指定ピクチャIDのピクチャを構築します。
 * 次の手順で使用します。
 *   1. プラグインコマンド「キャプチャ設定する」を呼び出します。
 *   2. 画像を指定せずに「ピクチャの表示」を実行します。
 * 
 * ■ 使用時の注意
 * 他のピクチャを使ったプラグインと併用する場合には、「ピクチャの表示」をする前に
 * キャプチャ要求をクリアしておく必要があります。
 * これをやらない場合、リソースが正しく開放されなくなります。
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * キャプチャ設定する
 *   次に画像未指定で「ピクチャの表示」を行ったとき、画面をキャプチャします。
 *   1度キャプチャすると要求がクリアされます。
 * 
 * キャプチャ設定解除
 *   画像をキャプチャする要求をクリアします。
 *   キャプチャ要求されていない場合には変化ありません。
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
(() => {
    const pluginName = "Kapu_CaptureScreenPicture";
    // const parameters = PluginManager.parameters(pluginName);

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "captureScreen", args => {
        $gameTemp.setCaptureRequired();
    });
    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "captureScreenOff", args => {
        $gameTemp.clearCaptureRequired();
    });
    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * Game_Temp を初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._captureId = 1;
        this._captureRequiredId = 0;
    };
    /**
     * キャプチャ要求が出ているかどうかを得る。
     * 
     * @returns {number} キャプチャ要求が出ている場合には1以上のID番号。それ以外は0
     */
    Game_Temp.prototype.captureRequiredId = function() {
        return this._captureRequiredId;
    };
    /**
     * キャプチャ要求をクリアする。
     */
    Game_Temp.prototype.clearCaptureRequired = function() {
        this._captureRequiredId = 0;
    };
    /**
     * キャプチャ要求をセットする。
     */
    Game_Temp.prototype.setCaptureRequired = function() {
        this._captureRequiredId = this._captureId;
        this._captureId++;
        if (this._captureId >= 1000) {
            this._captureId = 1;
        }
    };

    //------------------------------------------------------------------------------
    // Game_Picture
    const _Game_Picture_initBasic = Game_Picture.prototype.initBasic;
    /**
     * Game_Pictureの基本情報を初期化する。
     */
    Game_Picture.prototype.initBasic = function() {
        _Game_Picture_initBasic.call(this);
        this._captureRequiredId = 0;
    };

    const _Game_Picture_show = Game_Picture.prototype.show;
    /**
     * ピクチャを表示する。
     * 
     * @param {string} name "img/pictures/"下のファイル名
     * @param {number} origin 画像上の基準位置(0:左上, 1:画像中央)
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} scaleX 水平方向拡大倍率
     * @param {number} scaleY 垂直方向拡大倍率
     * @param {number} opacity 輝度
     * @param {number} blendMode ブレンドモード
     */
    // prettier-ignore
    Game_Picture.prototype.show = function(name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
        _Game_Picture_show.call(this, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
        const captureRequiredId = $gameTemp.captureRequiredId();
        if ((this._name === "") && (captureRequiredId > 0)) {
            this._captureRequiredId = captureRequiredId;
            $gameTemp.clearCaptureRequired();
        }
    };

    /**
     * キャプチャ要求IDを得る。
     * 
     * @returns {number} キャプチャ要求ID
     */
    Game_Picture.prototype.captureRequiredId = function() {
        return this._captureRequiredId;
    };

    //------------------------------------------------------------------------------
    // Sprite_Picture
    const _Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
    /**
     * Sprite_Pictureを初期化する。
     * 
     * @param {number} pictureId ピクチャID
     */
    Sprite_Picture.prototype.initialize = function(pictureId) {
        _Sprite_Picture_initialize.call(this, pictureId);
        this._captureRequiredId = 0;
        this._screenCaptureBitmap = null;
    };

    const _Sprite_Picture_destroy = Sprite_Picture.prototype.destroy;
    /**
     * Sprite_Pictureを破棄する。
     */
    Sprite_Picture.prototype.destroy = function() {
        if (this._screenCaptureBitmap) {
            this._screenCaptureBitmap.destroy();
            this._screenCaptureBitmap = null;
        }
        _Sprite_Picture_destroy.apply(this, arguments);
    };

    const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    /**
     * 表示するBitmapを更新する。
     */
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.call(this, ...arguments);
        const picture = this.picture();
        const captureRequiredId = picture.captureRequiredId();
        if (this._captureRequiredId !== captureRequiredId) {
            if (this._screenCaptureBitmap) {
                this._screenCaptureBitmap.destroy();
                this._screenCaptureBitmap = null;
            }
            if (captureRequiredId > 0) {
                // 要求がでているときはスナップする。
                this._screenCaptureBitmap = SceneManager.snap();
                this.bitmap = this._screenCaptureBitmap;
            }
            this._captureRequiredId = captureRequiredId;
        } else {
            if (this.bitmap !== this._screenCaptureBitmap) {
                // 表示ビットマップが異なるのでリソースを開放する。
                this._screenCaptureBitmap.destroy();
                this._screenCaptureBitmap = null;
            }
        }
    };
})();