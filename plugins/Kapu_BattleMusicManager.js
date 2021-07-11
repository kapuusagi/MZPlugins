/*:ja
 * @target MZ 
 * @plugindesc 戦闘中の楽曲に関する拡張をするプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command clearBattleBgm
 * @text 戦闘BGM指定解除
 * 
 * @command addBattleBgm
 * @text 戦闘BGMを追加する
 * 
 * @arg name 
 * @text 識別名
 * @desc 削除時に使用する識別名
 * @type string
 * 
 * @arg bgm
 * @text BGMデータ
 * @desc BGMデータ
 * @type struct<BgmEntry>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 * 
 * @command removeBattleBgm
 * @text 戦闘BGMを削除する。
 * 
 * @arg name 
 * @text 識別名
 * @desc 削除時に使用する識別名
 * @type string
 * 
 * @command randomizeBattleBgm
 * @text 戦闘BGMランダム機能設定
 * 
 * @arg enabled
 * @text 有効
 * @desc 有効にするかどうか
 * @type boolean
 * @default true
 * 
 * 
 * @param randomizeBattleBgm
 * @text 戦闘BGMランダマイズ状態初期値
 * @desc 戦闘BGMランダマイズ状態初期値（NewGame時の初期値）
 * @type boolean
 * @default true
 * 
 * @param battleBgms
 * @text 戦闘BGM（ランダム）
 * @desc 戦闘BGM未指定時に演奏する戦闘BGM。識別子は"0","1",...と割り振られる。
 * @type struct<BgmEntry>[]
 * @default []
 * 
 * 
 * @help 
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
 * マップ
 *   <battleBgm:name$,volume#,pitch#,pan#>
 *     マップでエンカウントしたときのBGMをname, volume, pitch, panにする。
 *     複数指定した場合にはランダムで選択される。
 *     name : {string} BGM名 audio/bgm/ 下のファイル名
 *     volume : {number} ボリューム(0～100)
 *     pitch : {number} ピッチ(50～150)
 *     pan : {number} パン(-100～100)
 *     volume, pitch, panは省略可能。
 *     省略した場合 ボリュームは90, ピッチは100，パンは0になる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/*~struct~BgmEntry:
 *
 * @param name
 * @text BGMファイル名
 * @desc BGMファイル名
 * @type file
 * @dir audio/bgm/
 * 
 * @param volume
 * @text 音量
 * @desc 音量(0～100)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param pitch
 * @text ピッチ
 * @desc ピッチ(50～150)
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param pan
 * @text パン
 * @desc パン(-100～100)
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */

(() => {
    const pluginName = "Kapu_BattleMusicManager";
    const parameters = PluginManager.parameters(pluginName);

    const randomizeBattleBgm = (typeof parameters["randomizeBattleBgm"] === undefined)
            ? false : parameters["randomizeBattleBgm"] === "true";

    const battleBgms = [];
    try {
        const entries = JSON.parse(parameters["battleBgms"]).map(str => JSON.parse(str));
        for (const entry of entries) {
            if (entry.name) {
                entry.volume = (Number(entry.volume) || 90).clamp(0, 100);
                entry.pitch = (Number(entry.pitch) || 100).clamp(50, 150);
                entry.pan = (Number(entry.pan) || 0).clamp(-100, 100);
                battleBgms.push(entry);
            }
        }
    }
    catch (e) {
        console.error(e);
    }


    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "clearBattleBgm", args => {
        $gameSystem.clearBattleBgm();
    });

    PluginManager.registerCommand(pluginName, "addBattleBgm", args => {
        const name = args.name;
        try {
            const bgm = JSON.parse(args.bgm);
            if (name && bgm.name) {
                bgm.volume = (Number(bgm.volume) || 90).clamp(0, 100);
                bgm.pitch = (Number(bgm.pitch) || 100).clamp(50, 150);
                bgm.pan = (Number(bgm.pan) || 0).clamp(-100, 100);
                $gameSystem.addRandomBattleBgm(name, bgm);
            }
        }
        catch (e) {
            console.error(e);
        }

    });

    PluginManager.registerCommand(pluginName, "removeBattleBgm", args => {
        const name = args.name;
        if (name) {
            $gameSystem.removeRandomBattleBgm(name);
        }
    });

    PluginManager.registerCommand(pluginName, "randomizeBattleBgm", args => {
        const enabled = (args.enabled === undefined) ? true : args.enabled === "true";
        $gameSystem.setRandomizeBattleBgm(enabled);
    });

    //------------------------------------------------------------------------------
    // Game_Map

    /**
     * マップでのBGM初期化
     */
    Game_Map.prototype.setupBattleBgms = function() {
        $dataMap.battleBgms = [];

        const regExp = /<battleBgm:([^>]*)>/g;
        for (;;) {
            const match = regExp.exec($dataMap.note);
            if (match) {
                const params = match[1].split(",");
                if ((params.length >= 1) && params[0]) {
                    const name = params[0];
                    const volume = (Number(params[1]) || 90).clamp(0, 100);
                    const pitch = (Number(params[2]) || 100).clamp(50, 150);
                    const pan = (Number(params[3]) || 0).clamp(-100, 100);
                    $dataMap.battleBgms.push({
                        name:name,
                        volume:volume,
                        pitch:pitch,
                        pan:pan
                    });
                }
            } else {
                break;
            }
        }
    };

    /**
     * マップの戦闘BGMを得る。
     * 
     * @returns {object} BGMエントリ
     */
    Game_Map.prototype.battleBgm = function() {
        if (!$dataMap.battleBgms) {
            this.setupBattleBgms();
        }
        const bgms = $dataMap.battleBgms;
        if (bgms.length > 0) {
            const index = Math.randomInt(bgms.length);
            return bgms[index];
        } else {
            return null;
        }
    };
    //------------------------------------------------------------------------------
    // Game_System

    const _Game_System_initialize = Game_System.prototype.initialize;
    /**
     * Game_Systemを初期化する。
     */
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._isRandomizeBattleBgm = randomizeBattleBgm;
        this._randomBattleBgms = {};
        for (let i = 0; i < battleBgms.length; i++) {
            this._randomBattleBgms[String(i)] = battleBgms[i];
        }
        this.clearNextBattleBgm();
    };

    /**
     * 戦闘BGMランダマイズを設定する。
     * 
     * @param {boolean} enabled ランダマイズを有効にする場合にはtrue, それ以外はfalse.
     */
    Game_System.prototype.setRandomizeBattleBgm = function(enabled) {
        this._isRandomizeBattleBgm = enabled;
    };

    /**
     * 戦闘BGMランダマイズが有効かどうかを得る。
     * 
     * @returns {boolean} ランダマイズを有効にする場合にはtrue, それ以外はfalse.
     */
    Game_System.prototype.isRandomizeBattleBgm = function() {
        return this._isRandomizeBattleBgm;
    };

    /**
     * 次の戦闘BGMをクリアする。
     */
    Game_System.prototype.clearNextBattleBgm = function() {
        this._nextBattleBgm = null;
    };

    /**
     * 戦闘BGMをセットアップする。
     */
    Game_System.prototype.setupNextBattleBgm = function() {
        if (this._isRandomizeBattleBgm) {
            const bgm = $gameMap.battleBgm();
            if (bgm) {
                this._nextBattleBgm = bgm;
            } else {
                const randomBattleBgms = this.randomBattleBgms();
                if (randomBattleBgms.length > 0) {
                    const index = Math.randomInt(randomBattleBgms.length);
                    this._nextBattleBgm = randomBattleBgms[index];
                } else {
                    this._nextBattleBgm = this._battleBgm ?? $dataSystem.battleBgm;
                }
            }
        } else {
            this._nextBattleBgm = null;
        }
    };

    const _Game_System_battleBgm = Game_System.prototype.battleBgm;
    /**
     * 戦闘BGMを得る。
     * 
     * @returns {object} BGMデータ。未指定時はnull
     */
    Game_System.prototype.battleBgm = function() {
        if (this._nextBattleBgm) {
            return this._nextBattleBgm;
        } else {
            return _Game_System_battleBgm.call(this);
        }
    };

    /**
     * ランダムで選択されるBGMを追加する。
     * 
     * @param {string} name エントリ名
     * @param {object} bgm BGMエントリ
     */
    Game_System.prototype.addRandomBattleBgm = function(name, bgm) {
        if (name && bgm && bgm.name) {
            this._randomBattleBgms[name] = bgm;
        }
    };

    /**
     * ランダムで選択されるBGMを削除する。
     * 
     * @param {string} name エントリ名
     */
    Game_System.prototype.removeRandomBattleBgm = function(name) {
        if (this._randomBattleBgms[name]) {
            delete this._randomBattleBgms[name];
        }
    };

    /**
     * 戦闘BGMエントリを得る。
     * 
     * @returns {Array<object>} 戦闘BGMリスト
     */
    Game_System.prototype.randomBattleBgms = function() {
        return Object.values(this._randomBattleBgms);
    };

    //------------------------------------------------------------------------------
    // BattleManager
    const _BattleManager_setup = BattleManager.setup;
    /**
     * 戦闘シーンを開始するための準備を行う。
     * 
     * @param {number} troopId エネミーグループID
     * @param {boolean} canEscape 逃走可能な場合にtrue 
     * @param {boolean} canLose 敗北できる場合にtrue
     */
    BattleManager.setup = function(troopId, canEscape, canLose) {
        $gameSystem.setupNextBattleBgm();
        _BattleManager_setup.call(this, troopId, canEscape, canLose);
    };

    const _BattleManager_endBattle = BattleManager.endBattle;
    /**
     * 戦闘を終了させる。
     * 本メソッドを呼ぶと、フェーズが"battleEnd"に遷移し、次のupdate()でSceneManager.pop()がコールされる。
     * 
     * @param {number} result 戦闘結果(0:勝利 , 1:中断(逃走を含む), 2:敗北)
     */
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.call(this, result);
        $gameSystem.clearNextBattleBgm();
    };

})();