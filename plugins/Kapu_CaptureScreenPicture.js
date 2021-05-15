/*:ja
 * @target MZ 
 * @plugindesc スクリーンキャプチャしてピクチャとして扱うようにする機能
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command saveScreen
 * @text キャプチャする
 * @desc 現在のスクリーンをキャプチャします。キャプチャしたデータは解放するまで保存されます。
 * 
 * @arg captureId
 * @text キャプチャID
 * @desc キャプチャした画像を管理する番号。(1以上の値にすること)
 * @type number
 * @default 0
 * @min 0
 * 
 * @arg scale
 * @text 倍率(1～100)
 * @type number
 * @default 100
 * @min 0
 * @max 100
 * 
 * @arg isSave
 * @text 保存する
 * @desc セーブデータに保存します。
 * @type boolean
 * @default false
 * 
 * @arg format
 * @text 画像形式
 * @type select
 * @default image/png
 * @option PNG
 * @value image/png
 * @option JPEG
 * @value image/jpeg
 * @parent isSave
 * 
 * @command releaseCapture
 * @text キャプチャデータを解放する。
 * @desc 指定した番号のキャプチャデータを解放します。
 * 
 * @arg captureId
 * @text キャプチャID
 * @desc キャプチャした画像を管理する番号。(1以上の値にすること)
 * @type number
 * @default 0
 * @min 0
 *
 * 
 * @command displayCaptureImage
 * @text キャプチャ画像表示
 * @desc 指定したピクチャ番号、設定でキャプチャ画像を表示する。左上起点で位置は(0,0)になる。
 * 
 * @arg captureId
 * @text キャプチャID
 * @desc キャプチャした画像を管理する番号。(1以上の値にすること)
 * @type number
 * @default 0
 * @min 0
 * 
 * @arg pictureId
 * @text ピクチャ番号
 * @desc ピクチャー番号
 * @type number
 * @default 1
 * 
 * @arg origin
 * @text 画像の原点(座標の基準位置)
 * @type select
 * @default 0
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 * 
 * @arg x
 * @text 表示位置x
 * @type number
 * @default 0
 * 
 * @arg y
 * @text 表示位置y
 * @type number
 * @default 0
 * 
 * @arg scaleH
 * @text 拡大率(幅)
 * @type number
 * @default 100
 * 
 * @arg scaleV
 * @text 拡大率(高さ)
 * @type number
 * @default 100
 * 
 * @arg opacity
 * @text 不透明度
 * @type number
 * @default 255
 * @min 0
 * @max 255
 * 
 * @arg blendMode
 * @type select
 * @default 0
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 乗算
 * @value 2
 * @option スクリーン
 * @value 3
 * 
 * @help 
 * 画面のキャプチャ機能と、表示機能を提供します。
 * 表示時に指定したピクチャ番号は、そのまま「画像の移動」などで使用することができます。
 * 
 * ■ 使用時の注意
 * セーブデータが重くなります！！
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
 * Version.1.0.0 新規作成
 */
(() => {
    const pluginName = "Kapu_CaptureScreenPicture";
    // const parameters = PluginManager.parameters(pluginName);

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "saveScreen", args => {
        const no = Number(args.captureId) || 0;
        const scale = (Number(args.scale) || 100).clamp(0, 100);
        const format = args.format || "image/png";
        const isSave = (typeof args.isSave === "undefined") ? false : (args.isSave === "true");
        if (no > 0) {
            let bitmap = null;
            const snapBitmap = SceneManager.snap();
            if (scale !== 100) {
                const resizedBitmap = new Bitmap(snapBitmap.width * scale / 100, snapBitmap.height * scale / 100);
                resizedBitmap.blt(snapBitmap, 0, 0, snapBitmap.width, snapBitmap.height, 0 ,0, resizedBitmap.width, resizedBitmap.height);
                snapBitmap.destroy();
                bitmap = resizedBitmap;
            } else {
                bitmap = snapBitmap;
            }
            const data = (isSave) ? bitmap._canvas.toDataURL(format) : null;
            $gameTemp.setCaptureImage(no, bitmap, data);
        }
    });

    PluginManager.registerCommand(pluginName, "releaseCapture", args => {
        const no = Number(args.captureId) || 0;
        if (no > 0) {
            $gameTemp.setCaptureImage(no, null, null);
        }
    });

    PluginManager.registerCommand(pluginName, "displayCaptureImage", function(args) {
        const captureId = Number(args.captureId) || 0;
        const pictureId = Number(args.pictureId) || 0;
        const origin = Number(args.origin) || 0;
        const x = Number(args.x) || 0;
        const y = Number(args.y) || 0;
        const scaleH = Math.max(0, Number(args.scaleH) || 100);
        const scaleV = Math.max(0, Number(args.scaleV) || 100);
        const opacity = (Number(args.opacity) || 255).clamp(0, 255);
        const blendMode = (Number(args.blendMode) || 0);

        if ((captureId > 0) && (pictureId > 0)) {
            $gameScreen.showPicture(pictureId, "capture/" + captureId, origin, x, y, scaleH, scaleV, opacity, blendMode);
        }
    });

    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * Game_Tempを初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._captureImages = [];
    };

    /**
     * キャプチャ画像を保存する。
     * bitmapにnullを渡すと解放する。
     * 
     * @param {number} no 番号
     * @param {Bitmap} bitmap ビットマップ
     * @param {object} data 保存データ
     */
    Game_Temp.prototype.setCaptureImage = function(no, bitmap, data) {
        if (this._captureImages[no]) {
            const entry = this._captureImages[no];
            if (entry.bitmap) {
                entry.bitmap.destroy();
            }
        }
        this._captureImages[no] = { bitmap:bitmap, data:data }
    };

    /**
     * キャプチャ画像を取得する。
     * 
     * @param {number} no 番号
     * @returns {Bitmap} ビットマップ
     */
    Game_Temp.prototype.captureImage = function(no) {
        const entry = this._captureImages[no];
        if (entry && entry.bitmap) {
            return entry.bitmap;
        } else {
            return null;
        }
    };

    /**
     * キャプチャ画像を全てクリアする。
     */
    Game_Temp.prototype.clearAllCaptureImages = function() {
        for (const entry of this._captureImages) {
            if (entry && entry.bitmap) {
                entry.bitmap.destroy();
            }
        }
        this._captureImages = [];
    };

    /**
     * キャプチャ画像一覧を取得する。
     */
    Game_Temp.prototype.allCaptureImages = function() {
        const images = [];
        for (let i = 0; i < this._captureImages.length; i++) {
            const entry = this._captureImages[i];
            if (entry) {
                images.push({ id:i, image:entry.bitmap, data:entry.data });
            }
        }
        return images;
    };
    //------------------------------------------------------------------------------
    // Sprite_Picture
    const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    /**
     * 表示するビットマップを更新する。
     * 
     * Note: キャプチャ画像が更新されたとき、表示されなくなるため、フックして処理する。
     */
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.call(this);
        const picture = this.picture();
        if (picture) {
            const pictureName = picture.name();
            if (pictureName.startsWith("capture/") && (this.bitmap._canvas === null)) {
                // キャプチャ画像が更新された
                this.loadBitmap();
                this.visible = true;
            }
        }
    };
    //------------------------------------------------------------------------------
    // ImageManager
    const _ImageManager_loadPicture = ImageManager.loadPicture;
    /**
     * img/pictures以下のファイルをロードする。
     * 
     * @param {String} filename 画像ファイル名
     * @return {Bitmap} ビットマップオブジェクト
     */
    ImageManager.loadPicture = function(filename) {
        if (filename.startsWith("capture/")) {
            const id = filename.substr(8);
            return $gameTemp.captureImage(id);
        } else {
            return _ImageManager_loadPicture.call(this, filename);
        }
    };
    //------------------------------------------------------------------------------
    // Scene_Title
    const _Scene_Title_start = Scene_Title.prototype.start;
    /**
     * Scene_Titleを開始する。
     */
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        // タイトルに戻ったとき、キャプチャ画像は全てクリアする。
        $gameTemp.clearAllCaptureImages();
    };
    //------------------------------------------------------------------------------
    // DataManager
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    /**
     * 保存するデータを作成する。
     * @return {Object} 保存するデータ
     */
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.captureScreens = [];
        const imageEntries = $gameTemp.allCaptureImages();
        for (const imageEntry of imageEntries) {
            if (imageEntry.data !== null) {
                // 保存対象のデータのみ保存する。
                contents.captureScreens.push({
                    id : imageEntry.id,
                    imageData : imageEntry.data
                });
            }
        }
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    /**
     * 保存されたデータを展開し、メモリ上に読み出す。
     * @param {Object} contents 保存データ
     */
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        $gameTemp.clearAllCaptureImages();
        if (contents.captureScreens) {
            
            for (const entry of contents.captureScreens) {
                const id = entry.id;
                const bitmap = Bitmap.load(entry.imageData);
                $gameTemp.setCaptureImage(id, bitmap, entry.imageData);
            }
        }
    };
})();