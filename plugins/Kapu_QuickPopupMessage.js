/*:ja
 * @target MZ 
 * @plugindesc クイックポップアップメッセージプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command popupMessage
 * @text メッセージ表示
 * 
 * @arg text
 * @text メッセージ
 * @desc 表示するメッセージ。エスケープシーケンス使用可
 * @type string
 * @default
 * 
 * @arg position
 * @text 表示位置
 * @desc 表示位置
 * @type select
 * @option プレイヤー上
 * @value player
 * @option 画面左下
 * @value bottom_left
 * @option 画面中央下
 * @value bottom_center
 * @optin 画面右下
 * @value bottom_right
 * @option 画面左
 * @value left
 * @option 画面中央
 * @value center
 * @option 画面右
 * @value right
 * @default player
 * 
 * @arg motion
 * @text 動き
 * @desc メッセージの動き
 * @type select
 * @option なし
 * @value none
 * @option 下から上
 * @value bottom_to_up
 * @option 下から上(表示中停止)
 * @value bottom_to_up_with_stop
 * @option 上から下
 * @value up_to_bottom
 * @option 上から下(表示中停止)
 * @value up_to_bottom_with_stop
 * @default none
 * 
 * @param fadeInDuration
 * @text フェードイン時間
 * @desc メッセージのフェードインに要する時間[フレーム数]
 * @type number
 * @default 10
 * 
 * @param displayDuration
 * @text 表示時間
 * @desc メッセージを表示する時間[フレーム数]
 * @default 20
 * 
 * @param fadeOutDuration
 * @text フェードアウト時間
 * @desc メッセージのフェードアウトに要する時間[フレーム数]
 * @default 10
 * 
 * 
 * 
 * @param speedX
 * @text 移動速度(水平)
 * @desc motionを指定した際の水平移動速度
 * @type number
 * @decimals 1
 * @default 1.0
 * 
 * @param speedY
 * @text 移動速度(垂直)
 * @desc motionを指定した際の垂直移動速度
 * @decimals 0.5
 * @default 1.0
 * 
 * @help 
 * マップ上で所定の位置に、①行のメッセージウィンドウをポップアップさせるプラグインです。
 * ちょっとしたアイテムの入手などでの使用を想定します。
 * セーブやマップ移動、戦闘により、ポップアップ中のメッセージは消去されます。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * メッセージ表示
 *     メッセージ表示する。
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

/**
 * クイックポップアップメッセージ
 */
function Window_QuickPopupMessage() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_QuickPopupMessage";
    const parameters = PluginManager.parameters(pluginName);
    const fadeInDuration = Math.max(0, (Number(parameters["fadeInDuration"]) || 0));
    const displayDuration = Math.max(0, (Number(parameters["displayDuration"]) || 0));
    const fadeOutDuration = Math.max(0, (Number(parameters["fadeOutDuration"]) || 0));
    const popupTotalDuration = fadeInDuration + displayDuration + fadeOutDuration;

    // const speedX = Math.max(0, (Number(parameters["speedX"]) || 0));
    const speedY = Math.max(0, (Number(parameters["speedY"]) || 0));

    PluginManager.registerCommand(pluginName, "popupMessage", args => {
        const text = args.text;
        const position = args.position || "none";
        const motion = args.motion || "none";
        if (text) { 
            $gameTemp.reserveQuickPopupMessage({
                text:text,
                position:position,
                motion:motion
            });
        }
    });
    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._quickPopupMessages = [];
    };

    /**
     * クイックポップアップメッセージを予約する。
     * 
     * @param {object} messageEntry クイックポップアップメッセージエントリ
     */
    Game_Temp.prototype.reserveQuickPopupMessage = function(messageEntry) {
        this._quickPopupMessages.push(messageEntry);
    };
    /**
     * クイックポップアップメッセージキューからエントリを得る。
     * 
     * @returns {object} クイックポップアップメッセージエントリ。データが無い場合にはnull.
     */
    Game_Temp.prototype.quickPopupMessage = function() {
        return this._quickPopupMessages.shift();
    };

    //------------------------------------------------------------------------------
    // Window_QuickPopupMessage
    Window_QuickPopupMessage.prototype = Object.create(Window_Base.prototype);
    Window_QuickPopupMessage.prototype.constructor = Window_QuickPopupMessage;

    /**
     * Window_QuickPopupMessageを構築する。
     * 
     * @param {object} messageEntry メッセージエントリ
     */
    Window_QuickPopupMessage.prototype.initialize = function(messageEntry) {
        const height = this.fittingHeight(1);
        this._messageEntry = messageEntry;
        const rect = new Rectangle(0, 0, Graphics.boxWidth, height);
        Window_Base.prototype.initialize.call(this, rect);
        const width = this.textWidth(text) + 32;
        let initialX = 0;
        let initialY = 0;
        switch (messageEntry.position) {
            case "player":
                initialX = $gamePlayer.x;
                initialY = $gamePlayer.y;
                break;
            case "left":
                initialX = 0;
                initialY = Graphics.boxHeight / 2;
                break;
            case "center":
                initialX = (Graphics.boxWidth - width) / 2;
                initialY = Graphics.boxHeight / 2;
                break;
            case "right":
                initialX = Graphics.boxWidth - width;
                initialY = Graphics.boxHeight / 2;
                break;
            case "bottom_left":
                initialX = Graphics.boxWidth;
                initialY = Graphics.boxHeight - height;
                break;
            case "bottom_center":
                initialX = (Graphics.boxWidth - width) / 2;
                initialY = Graphics.boxHeight - height;
                break;
            case "bottom_right":
                initialX = Graphics.boxWidth - width;
                initialY = Graphics.boxHeight - height;
                break;
        }

        this.move(initialX, initialY, width + 32, height);
        this._initialX = initialX;
        this._initialY = initialY;
        this._duration = 0;

        this.frameVisible = false; // フレーム無し
        this.opacity = 0; // 非表示
        this.visible = true;
        this.active = false;

        this.refresh();
    };

    /**
     * 描画する
     */
    Window_QuickPopupMessage.prototype.refresh = function() {
        const rect = this.baseTextRect();
        this.contents.clear();
        this.drawTextEx(this._text, rect.x, rect.y, rect.width);
    };

    /**
     * 更新する。
     */
    Window_QuickPopupMessage.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._duration < popupTotalDuration) {
            const fiDur = this._duration.clamp(0, fadeInDuration);
            const disDur = (this._duration - fiDur).clamp(0, displayDuration);
            const foDur = (this._duration - fiDur - disDur).clamp(0, fadeOutDuration);
            let rx = 0;
            let ry = 0;
            switch (this._messageEntry.motion) {
                case "bottom_to_up":
                    rx = this._initialX;
                    ry = this._initialY - speedY * this._duration;
                    break;
                case "bottom_to_up_with_stop":
                    rx = this._initialX;
                    ry = this._initialY - speedY * (fiDur + foDur);
                    break;
                case "up_to_bottom":
                    rx = this._initialX;
                    ry = this._initialY + speedY * this._duration;
                    break;
                case "up_to_bottom_with_stop":
                    rx = this._initialX;
                    ry = this._initialY + speedY * (fiDur + foDur);
                    break;
                default:
                    rx = this._initialX;
                    ry = this._initialY;
                    break;
            }
            this.x = Math.round(rx);
            this.y = Math.round(ry);

            if (fiDur < fadeInDuration) {
                this.opacity = 255 * (fiDur + 1) / fadeInDuration;
            } else if (disDur < displayDuration) {
                this.opacity = 255;
            } else {
                this.opacity = (fadeOutDuration - foDur - 1) / fadeOutDuration * 255;
            }
            this._duration++;
        }
    };
    /**
     * このウィンドウがビジーかどうかを得る。
     * 
     * @returns {boolean} ビジーの場合にはtrue, それ以外はfalse.
     */
    Window_QuickPopupMessage.prototype.isBusy = function() {
        return this._duration < popupTotalDuration;
    };


    //------------------------------------------------------------------------------
    // Scene_Map

    const _Scene_Map_createWindowLayer = Scene_Map.prototype.createWindowLayer;
    /**
     * ウィンドウレイヤーを作成する。
     */
    Scene_Map.prototype.createWindowLayer = function() {
        this.createQuickPopupMessageWindowLayer();
        _Scene_Map_createWindowLayer.call(this);
    };
    /**
     * クイックポップアップメッセージウィンドウレイヤーを構築する。
     */
    Scene_Map.prototype.createQuickPopupMessageWindowLayer = function() {
        this._qpmWindowLayer = new WindowLayer();
        this._qpmWindowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
        this._qpmWindowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
        this.addChild(this._qpmWindowLayer);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    /**
     * Scene_Mapを更新する。
     */
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateQuickPopupMessage();
    };

    /**
     * クイックポップアップメッセージを更新する。
     */
    Scene_Map.prototype.updateQuickPopupMessage = function() {
        const messageEntry = $gameTemp.quickPopupMessage();
        if (messageEntry) {
            // もしかしたら重くてうっとなるかも？
            const window = new Window_QuickPopupMessage(messageEntry);
            this._qpmWindowLayer.addChild(window);
        }
        // たぶんupdateはコールされているはずなので、表示が終わったやつから破棄していく。
        while (this._qpmWindowLayer.children.length > 0) {
            const qpmWindow = this._qpmWindowLayer.children[0];
            if (qpmWindow.isBusy()) {
                // まだ表示中
                break;
            } else {
                this._qpmWindowLayer.removeChild(qpmWindow);
                qpmWindow.destroy();
            }
        }
    };

})();