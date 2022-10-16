/*:ja
 * @target MZ 
 * @plugindesc 他のマップのイベントを呼び出すプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command callMapEvent
 * @text 別マップイベントを呼び出す。
 * 
 * @arg mapId
 * @text マップID
 * @desc 呼び出すマップのID(0は現在のマップ)
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg eventId
 * @text イベントID
 * @desc 呼び出すイベントのID(0は現在のイベント)
 * @type number
 * @min 0
 * @default 1
 * 
 * @arg pageNo
 * @text ページ番号
 * @desc 呼び出すページ番号(ページ1は1, ページ2は2, ...)
 * @type number
 * @min 1
 * @default 1
 * 
 * 
 * @help 
 * プラグインコマンドで、他のマップのイベントを呼び出せるようになる。
 * コモンイベントが多くなったり、中身が大量になると、CommonEvents.json が重くなり、
 * 保存読み出しの処理負荷がかかるようになる。
 * 本プラグインでは別マップのイベントを呼び出せるようにする。
 * 
 * ■ 使用時の注意
 * イベントの消去やら、移動とかやるとおかしなことになるよ。
 * 
 * ■ プラグイン開発者向け
 * データ構造的に、pageNoはページ1が0、ページ2が1、．．．となっているが、
 * エディタ上の表記が1,2,3,...となっているので、それに併せて指定できるようにした。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * マップのイベントを実行
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

$dataTempMap = null;

(() => {
    'use strict';
    const pluginName = "Kapu_CallMapEvent";
    // const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "callMapEvent", function(args) {
        const interpreter = this;
        let mapId = Math.floor(Number(args.mapId) || 0);
        if (mapId === 0) {
            mapId = $gameMap.mapId();
        }
        let eventId = Math.floor(Number(args.eventId) || 0);
        if (eventId === 0) {
            eventId = interpreter.eventId();
        }
        const pageNo = Math.floor(Number(args.pageNo) || 1) - 1;
        if ((mapId > 0) && (eventId > 0) && (pageNo >= 0)) {
            if (mapId === $gameMap.mapId()) { // 現在のマップ
                const event = $gameMap.event(eventId)
                if (event) {
                    const id = interpreter.isOnCurrentMap() ? interpreter.eventId() : 0;
                    const dataEvent = event.event();
                    if (pageNo < dataEvent.pages.length) {
                        const list = dataEvent.pages[pageNo].list;
                        interpreter.setupChild(list, id);
                    }
                }
            } else {
                interpreter.setupCallOtherMapEvent(mapId, eventId, pageNo);
            }
        }
    });
    //------------------------------------------------------------------------------
    // Game_Interpreter

    const _Game_Interpreter_clear = Game_Interpreter.prototype.clear;
    /**
     * Game_Interpreterをクリアする。
     */
    Game_Interpreter.prototype.clear = function() {
        _Game_Interpreter_clear.call(this);
        this._callOtherMapEvent = null;
    };

    /**
     * 他のマップのイベント呼び出しをセットアップするう。
     * 
     * @param {number} mapId マップID
     * @param {number} eventId イベントID 
     * @param {number} pageNo ページ番号
     */
    Game_Interpreter.prototype.setupCallOtherMapEvent = function(mapId, eventId, pageNo) {
        this._callOtherMapEvent = {
            mapId : mapId,
            eventId : eventId,
            pageNo : pageNo
        };
        $dataTempMap = null;
        const filename = "Map%1.json".format(mapId.padZero(3));
        DataManager.loadDataFile("$dataTempMap", filename);
        this.setWaitMode("callOtherMapEvent");
    };

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    /**
     * 待機モードを更新する。
     * 
     * @returns {boolean} 待機中の場合にはtrue, 待機中で無い場合にはfalse
     */
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === "callOtherMapEvent") {
            if (this.isTempMapLoaded()) { // マップデータが読み込まれた？
                this._waitMode = "";
                if (this._callOtherMapEvent) {
                    this.callOtherMapevent();
                    this._callOtherMapEvent = null;
                }
                return false;
            } else {
                return true; // 待機中
            }
        } else {
            return _Game_Interpreter_updateWaitMode.call(this);
        }
    };

    /**
     * 一時マップを読み出せたかどうかを判定する。
     * 
     * @returns {boolean} 読み出した場合にはtrue, それ以外はfalse.
     */
    Game_Interpreter.prototype.isTempMapLoaded = function() {
        return !!$dataTempMap;
    };

    /**
     * 他のマップイベントを呼び出す。
     * 
     */
    Game_Interpreter.prototype.callOtherMapevent = function() {
        const event = $dataTempMap.events[this._callOtherMapEvent.eventId];

        const pageNo = this._callOtherMapEvent.pageNo;
        if (pageNo < event.pages.length) {
            const list = event.pages[pageNo].list;
            const id = this.isOnCurrentMap() ? this.eventId() : 0;
            this.setupChild(list, id);
        }
    };

    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();