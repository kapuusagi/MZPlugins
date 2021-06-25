/*:ja
 * @target MZ 
 * @plugindesc マップ移動拡張プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_FadeExtends
 * @orderAfter Kapu_FadeExtends
 * 
 * @command setupTransferEffect
 * @text 場所移動準備
 * @desc 次の場所移動処理をセットアップする。このコマンドから場所移動までのコマンドはフェードアウト中に実行される！！
 * 
 * @arg effect
 * @text エフェクト
 * @desc 場所移動処理時のエフェクト
 * @default fade
 * @type select
 * @option フェードアウト/フェードイン
 * @value fade
 * @option ディゾルブ
 * @value dissolve
 * 
 * @arg fadeOutPattern
 * @text フェードアウトパターン
 * @desc フェードアウトする画像パターン。未指定時は全体を一律にフェードアウトさせる。
 * @type file
 * @dir img/fadepatterns/
 * @default
 * 
 * @arg fadeOutDuration
 * @text フェードアウト時間
 * @desc フェードアウトにかける時間[フレーム数]
 * @type number
 * @default 24
 *
 * @arg fadeInPattern
 * @text フェードインパターン
 * @desc フェードインする画像パターン。魅して維持は全体を一律にフェードインさせる。
 * @type file
 * @dir img/fadepatterns/
 * @default
 * 
 * @param fadeInDuration
 * @text フェードイン時間
 * @desc フェードインにかける時間[フレーム数]
 * @type number
 * @default 24
 * 
 * 
 * @help 
 * マップ移動時の処理を拡張します。
 * ベーシックシステムでは、全画面フェードアウト->場所移動(マップロード)->全画面フェードアウトを
 * 行う仕組みになっています。
 * これに下記のような機能を追加します。
 * ・場所移動時のエフェクト選択
 *   "フェードアウト/フェードイン" : ベーシックシステムで提供される機能
 *   "ディゾルブ" : 移動前の表示から、移動後のマップに徐々に切り替わる機能
 * ・フェードアウト中にインタプリタのコマンドを実行する機能
 *   プラグインコマンド「場所移動準備」を呼び出してから、同じイベントページ内で次に「場所移動」を実行するまでの
 *   命令コードが実行されます。
 *   ※実行されるマップは移動前の位置になります。
 *   ユーザー入力待ちとか入れないこと。(普通はいれない)
 * 
 * 何がうれしいの？
 *   これまで
 *      フェードアウト
 *      何かしらの処理ごにょごにょ
 *      場所移動
 *      フェードイン
 *   このプラグイン
 *      場所移動セットアップ
 *      ごにょごにょ
 *      場所移動
 *  
 * 相変わらずごにょごにょしないといけないけれど、フェードインもれを防ぐことができる。
 * 何かしらの処理ごにょごにょを入れなければこれまでと同じ。
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
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_MapTransfer";
    const parameters = PluginManager.parameters(pluginName);
    const dissolveSpeed = Number(parameters["dissolveSpeed"]) || 48;

    
    PluginManager.registerCommand(pluginName, "setupTransferEffect", function(args) {
        const interpreter = this;

        interpreter._isTransferProcessReserved = true;


        const effect = args.effect || "fade";
        const fadeOutPattern = args.fadeOutPattern || "";
        const fadeOutDuration = Math.round(Number(args.fadeOutDuration) || 0);
        const fadeInPattern = args.fadeInPattern || "";
        const fadeInDuration = Math.round(Number(args.fadeInDuration) || 0);
        const eventId = this.isOnCurrentMap() ? this._eventId : 0;
        const transferProcessList = [];

        let nextIndex = this._index + 1;
        while (nextIndex < this._list.length) {
            const code = this._list[nextIndex].code;
            if (code === 201) {
                // 場所移動コード
                break;
            } else {
                // このコマンドは場所移動コードでない。
                transferProcessList.push(this._list[nextIndex]);
                nextIndex++;
            }
        }

        if (nextIndex < this._list.length) {
            const trasferEffect = [ effect, fadeOutPattern, fadeOutDuration,  fadeInPattern, fadeInDuration];
            $gameTemp.setupTransferEffect(trasferEffect, eventId, transferProcessList);
            this._index = nextIndex - 1;
        } else {
            // 末尾まで転送要求は無い。
            $gameTemp.clearTransferEffect();
            this._index = this._list.length - 1;
        }

    });
    //------------------------------------------------------------------------------
    // Game_Temp
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        this.clearTransferProcessList();
    };

    /**
     * 転送エフェクトをクリアする。
     */
    Game_Temp.prototype.clearTransferEffect = function() {
        this._mapTransferEffect = "fade";
        this._onTransferProcessEventId = 0;
        this._onTransferProcessList = [];
    };

    /**
     * 次回の場所移動イベントをセットアップする。
     * 
     * @param {Array<string>} effect 転送エフェクト
     * @param {number} イベントID
     * @param {Array<object>} transferProcessList フェードアウト中に行う処理。
     */
    Game_Temp.prototype.setupTransferEffect = function(effect, eventId, transferProcessList) {
        this._mapTransferEffect = effect;
        this._onTransferProcessEventId = eventId;
        this._onTransferProcessList = transferProcessList;
    };

    /**
     * マップ転送エフェクトを得る。
     * 
     * @return {Array<string>} エフェクト種類
     */
    Game_Temp.prototype.mapTransferEffect = function() {
        return this._mapTransferEffect;
    };

    /**
     * 場所移動中実行インタプリタに設定するイベントIDを得る。
     * 
     * @returns {number} イベントID
     */
    Game_Temp.prototype.onTransferEventId = function() {
        return this._onTransferProcessEventId;
    };

    /**
     * 場所移動でフェードアウト中に実行するコマンドリストを得る。
     * 
     * @returns {Array<object>} 場所移動でフェードアウト中に実行するコマンド
     */
    Game_Temp.prototype.onTransferProcessList = function() {
        return this._onTransferProcessList;
    };
    //------------------------------------------------------------------------------
    // SceneManager
    /**
     * ディゾルブ用画像用のスナップショットを更新する。
     */
    SceneManager.snapForDissolve = function() {
        if (this._dissolveBitmap) {
            this._dissolveBitmap.destroy();
        }
        this._dissolveBitmap = this.snap();
    };

    /**
     * ディゾルブ用画像を得る。
     * 
     * @returns {Bitmap} Bitmapオブジェクト
     */
    SceneManager.dissolveBitmap = function() {
        return this._dissolveBitmap;
    };

    /**
     * ディゾルブ用画像を開放する。
     */
    SceneManager.releaseDissolveBitmap = function() {
        if (this._dissolveBitmap) {
            this._dissolveBitmap.destroy();
        }
        this._dissolveBitmap = null;
    };


    //------------------------------------------------------------------------------
    // Scene_Base

    /**
     * ディゾルブアウトをセットアップする。
     * 
     * Note: 画面全面にキャプチャした画像を表示する。
     */
    Scene_Base.prototype.setupDissolveOut = function() {
        if (this._windowLayer) {
            this._windowLayer.visible = false;
        }
        SceneManager.snapForDissolve();
        if (this._windowLayer) {
            this._windowLayer.visible = true;
        }
        const bitmap = SceneManager.dissolveBitmap();
        const sprite = new Sprite();
        sprite.x = (Graphics.boxWidth - bitmap.width) / 2;
        sprite.y = (Graphics.boxHeight - bitmap.height) / 2
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.z = -20; // 手前
        sprite.bitmap = bitmap;
        this.addChild(sprite);
    };

    /**
     * ディゾルブインをセットアップする。
     * 
     * @param {number} speed 変更時間[フレーム数] 
     */
    Scene_Base.prototype.setupDissolveIn = function(speed) {
        const bitmap = SceneManager.dissolveBitmap();
        if (bitmap) {
            const sprite = new Sprite();
            sprite.x = (Graphics.boxWidth - bitmap.width) / 2;
            sprite.y = (Graphics.boxHeight - bitmap.height) / 2
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.z = -20; // 手前
            sprite.bitmap = bitmap;
            this._dissolveSprite = sprite;
            this.addChild(sprite);
            this._dissolveDuration = speed;
        }
    };

    const _Scene_Base_update = Scene_Base.prototype.update;
    /**
     * シーンを更新する。
     */
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);
        this.updateDissolve();
    };

    /**
     * ディゾルブ処理を更新する。
     */
    Scene_Base.prototype.updateDissolve = function() {
        if (this._dissolveDuration > 0) {
            if (this._dissolveSprite) {
                let opacity = this._dissolveSprite.opacity;
                const d = this._dissolveDuration;
                opacity -= opacity / d;
                if (opacity === 0) {
                    SceneManager.releaseDissolveBitmap();
                    this._dissolveSprite.bitmap = null;
                    this._dissolveSprite.destroy();
                    this._dissolveSprite = null;
                } else {
                    this._dissolveSprite.opacity = opacity;
                }
            }
            this._dissolveDuration--;
        }
    };
    //------------------------------------------------------------------------------
    // Scene_Map
 
    const _Scene_Map_update = Scene_Map.prototype.update;
    /**
     * Scene_Mapを更新する。
     */
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateTransferInterpreter();
    };

    /**
     * 転送中イベントインタプリタを更新する。
     */
    Scene_Map.prototype.updateTransferInterpreter = function() {
        if (!this.isFade() && this._transferProcessInterpreter) {
            // フェードしていない時に実行する。
            this._transferProcessInterpreter.update();
        }
    };

    const _Scene_Map_isBusy = Scene_Map.prototype.isBusy;
    /**
     * ビジーかどうかを得る。
     * 
     * @returns {boolean} ビジーの場合にはtrue, それ以外はfalse.
     */
    Scene_Map.prototype.isBusy = function() {
        return _Scene_Map_isBusy.call(this) && this.isTransferProcessRuning();
    };

    /**
     * 転送中処理インタプリタが動作中かどうかを得る。
     * 
     * @returns {boolean} 動作中の場合にはtrue, それ以外はfalse
     */
    Scene_Map.prototype.isTransferProcessRuning = function() {
        return this._transferProcessInterpreter && this._transferProcessInterpreter.isRunning();
    };

    const _Scene_Map_stop = Scene_Map.prototype.stop;
    /**
     * Scene_Mapを停止するときの処理を行う。
     * 
     * Note: gotoされた場合に停止するために呼び出される。
     */
    Scene_Map.prototype.stop = function() {
        _Scene_Map_stop.call(this);
        if (SceneManager.isNextScene(Scene_Map)) {
            const list = $gameTemp.onTransferProcessList();
            if (list.length > 0) {
                // フェードアウト中に処理したいことがあれば、ここでセットアップする。
                const eventId = $gameTemp.onTransferEventId();
                this._transferProcessInterpreter = new Game_Interpreter();
                this._transferProcessInterpreter.setup(list, eventId);
            }
        }
    };    

    const _Scene_Map_fadeInForTransfer = Scene_Map.prototype.fadeInForTransfer;
    /**
     * 場所移動のためにフェードインさせる。
     * 
     * Note: 全画面を黒または白に変化させる。
     */
    Scene_Map.prototype.fadeInForTransfer = function() {
        const effect = $gameTemp.mapTransferEffect();
        switch (effect[0]) {
            case "dissolve":
                this.setupDissolveIn(dissolveSpeed);
                break;
            default:
                {
                    const fadeType = $gamePlayer.fadeType();
                    if ((fadeType === 0) || (fadeType === 1)) {
                        const pattern = effect[1];
                        const mode = (pattern) ? Game_Screen.FADE_MODE_PATTERN : Game_Screen.FADE_MODE_NORMAL;
                        const duration = effect[2];
                        const color = (fadeType === 1) ? [255,255,255,255] : [0,0,0,255];
                        gameTemp.setupNextFadeIn({
                            mode:mode,
                            pattern:pattern,
                            duration:duration,
                            color:color
                        });
                    }
                    _Scene_Map_fadeInForTransfer.call(this);
                }
                break;
        }
    };

    const _Scene_Map_fadeOutForTransfer = Scene_Map.prototype.fadeOutForTransfer;
    /**
     * 場所移動のためにフェードアウトさせる。
     * 
     * Note: 全画面を黒または白に変化させる。
     */
    Scene_Map.prototype.fadeOutForTransfer = function() {
        const effect = $gameTemp.mapTransferEffect();
        switch (effect[0]) {
            case "dissolve":
                this.setupDissolveOut();
                break;
            default:
                {
                    const fadeType = $gamePlayer.fadeType();
                    if ((fadeType === 0) || (fadeType === 1)) {
                        const pattern = effect[3];
                        const mode = (pattern) ? Game_Screen.FADE_MODE_PATTERN : Game_Screen.FADE_MODE_NORMAL;
                        const duration = effect[4];
                        const color = (fadeType === 1) ? [255,255,255,255] : [0,0,0,255];
                        gameTemp.setupNextFadeOut({
                            mode:mode,
                            pattern:pattern,
                            duration:duration,
                            color:color
                        });
                    }
                    _Scene_Map_fadeOutForTransfer.call(this);
                }
                break;
        }
    };

    const _Scene_Map_onTransferEnd = Scene_Map.prototype.onTransferEnd;
    /**
     * 転送完了時の処理を行う。
     */
    Scene_Map.prototype.onTransferEnd = function() {
        _Scene_Map_onTransferEnd.call(this);
        $gameTemp.clearTransferEffect();
    };
})();