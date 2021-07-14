/*:ja
 * @target MZ 
 * @plugindesc マップ移動拡張プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_FadeExtends
 * @orderAfter Kapu_FadeExtends
 * 
 * @command setupTransferProcessList
 * @text 場所移動処理
 * @desc 次の場所移動処理をセットアップする。このコマンドから場所移動までのコマンドはフェードアウト中に実行される。
 * 
 * 
 * @help 
 * マップ移動時の処理を拡張します。
 * ベーシックシステムでは、全画面フェードアウト->場所移動(マップロード)->全画面フェードアウトを
 * 行う仕組みになっています。
 * これに下記のような機能を追加します。
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
 * Kapu_FadeExtendsと併用する場合、フェードのエフェクトセットアップコマンドを、
 * 「場所移動処理」の前に実行すること。
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
 * Version.1.0.0 初版作成。
 */
(() => {
    const pluginName = "Kapu_MapTransfer";
    // const parameters = PluginManager.parameters(pluginName);

    
    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "setupTransferProcessList", function(args) {
        // const interpreter = this;
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
            $gameTemp.setupTransferProcessList(eventId, transferProcessList);
            this._index = nextIndex - 1;
        } else {
            // 末尾まで転送要求は無い。
            $gameTemp.clearTransferProcessList();
            this._index = this._list.length - 1;
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
        this.clearTransferProcessList();
    };

    /**
     * 転送エフェクトをクリアする。
     */
    Game_Temp.prototype.clearTransferProcessList = function() {
        this._onTransferProcessEventId = 0;
        this._onTransferProcessList = [];
    };

    /**
     * 次回の場所移動イベントをセットアップする。
     * 
     * @param {number} イベントID
     * @param {Array<object>} transferProcessList フェードアウト中に行う処理。
     */
    Game_Temp.prototype.setupTransferProcessList = function(eventId, transferProcessList) {
        this._onTransferProcessEventId = eventId;
        this._onTransferProcessList = transferProcessList;
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
        if (!this.isFading() && this._transferProcessInterpreter) {
            // フェードしていない時に実行する。
            this.processTransferList();
        }
    };

    /**
     * 転送中処理項目リストを実行する。
     */
    Scene_Map.prototype.processTransferList = function() {
        const interpreter = this._transferProcessInterpreter;
        while (interpreter.isRunning()) {
            if (interpreter.updateChild() || interpreter.updateWait()) {
                break;
            }
            if (!interpreter.executeCommand()) {
                break;
            }
            if (interpreter.checkFreeze()) {
                break;
            }
        }
    };

    const _Scene_Map_isBusy = Scene_Map.prototype.isBusy;
    /**
     * ビジーかどうかを得る。
     * 
     * @returns {boolean} ビジーの場合にはtrue, それ以外はfalse.
     */
    Scene_Map.prototype.isBusy = function() {
        return _Scene_Map_isBusy.call(this) || this.isTransferProcessRuning();
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

    const _Scene_Map_onTransferEnd = Scene_Map.prototype.onTransferEnd;
    /**
     * 転送完了時の処理を行う。
     */
    Scene_Map.prototype.onTransferEnd = function() {
        _Scene_Map_onTransferEnd.call(this);
        $gameTemp.clearTransferProcessList();
    };
})();