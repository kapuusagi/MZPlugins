/*:ja
 * @target MZ 
 * @plugindesc 戦闘中の楽曲に関する拡張をするプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command setNextBattleBgm
 * @text 次の戦闘のBGMを指定する
 * @desc 次に発生する戦闘のBGMを指定します。有利不利状態、ランダム設定状態に依らず、優先されます。
 * 
 * @arg bgm
 * @text BGMデータ
 * @desc BGMデータ
 * @type struct<BgmEntry>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 * 
 * @command clearBattleBgm
 * @text 戦闘BGM指定解除
 * 
 * @command addBattleBgm
 * @text ランダムに鳴らす戦闘BGMを追加する
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
 * @text ランダムに鳴らす戦闘BGMを削除する
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
 * @command setPreemptiveBattleBgm
 * @text 戦闘BGM指定（有利状況）
 * 
 * @arg enabled
 * @text 固定のBGMを鳴らす
 * @type boolean
 * @default false
 * 
 * @arg bgm
 * @text BGMデータ
 * @desc BGMデータ
 * @type struct<BgmEntry>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 * 
 * @command setSurpriseBattleBgm
 * @text 戦闘BGM指定（不利状況）
 * 
 * @arg enabled
 * @text 固定のBGMを鳴らす。
 * @type boolean
 * @default false
 * 
 * @arg bgm
 * @text BGMデータ
 * @desc BGMデータ
 * @type struct<BgmEntry>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 * 
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
 * @desc 戦闘BGM未指定時に演奏する戦闘BGM初期値。識別子は"0","1",...と割り振られる。
 * @type struct<BgmEntry>[]
 * @default []
 * 
 * @param useBattleBgmPreemptive
 * @text 有利な状態の戦闘BGMを指定する
 * @type boolean
 * @default false
 * 
 * @param battleBgmPreemptive
 * @text 戦闘BGM（有利）
 * @desc 戦闘BGM未指定時、有利状態で演奏する戦闘BGM初期値。
 * @type struct<BgmEntry>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 * 
 * @param useBattleBgmSurprise
 * @text 不利な状態の戦闘BGMを指定する
 * @type boolean
 * @default false
 * 
 * @param battleBgmSurprise
 * @text 戦闘BGM（不利）
 * @desc 戦闘BGM未指定時、不利状態で演奏する戦闘BGM初期値。
 * @type struct<BgmEntry>
 * @default {"name":"","volume":"100","pitch":"90","pan":"0"}
 * @parent useBattleBgmSurprise
 * 
 * @help 
 * 鳴らす戦闘BGMについて、以下の拡張を行います。
 * A. 設定された候補からランダムに鳴らします。
 * B. ランダムに鳴らすかどうかを設定できます。
 * C. 有利(先制攻撃)、不利(急襲)の場合に、特定のBGMを鳴らすように設定できます。
 * 
 * 鳴らされるBGMの決定順位
 * 1. 次の戦闘BGM設定で指定されたもの。
 * 2. 有利戦闘BGM / 不利戦闘BGM の設定が有効で、有利戦闘/不利戦闘
 * 3. マップに戦闘BGMが設定されている
 * 4. ランダム選択が有効で、ランダム選択候補がある場合はその中から選択
 * 5. インタプリタコマンドで変更された戦闘BGM
 * 6. データベースで設定した戦闘BGM初期設定
 * 
 * ■ 使用時の注意
 * イベント戦闘などで、特定のBGMを鳴らしたい場合には
 * 本プラグインの、「次の戦闘のBGMを指定する」コマンドを使用してください。
 * 
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 次の戦闘のBGMを指定する
 *   次に発生した戦闘のBGMを明示的に指定します。
 *   なしにすると設定解除になります。
 *   戦闘終了により、自動的にクリアされます。
 * 
 * 戦闘BGM指定解除
 *   次の戦闘BGM指定を解除します。
 * 
 * ランダムに鳴らす戦闘BGMを追加する
 *   ランダムに鳴らす対象の戦闘BGM候補を追加します。
 * 
 * ランダムに鳴らす戦闘BGMを削除する
 *   ランダムに鳴らす対象の戦闘BGM削除します。
 * 
 * 戦闘BGMランダム機能設定
 *   ランダムに鳴らす機能の有効/無効を設定します。
 * 
 * 戦闘BGM指定（有利状況）
 *   有利な状態で開始する戦闘で、特定のBGMを鳴らすかどうかを設定します。
 * 
 * 戦闘BGM指定（不利状況）
 *   不利な状態で開始する戦闘で、特定のBGMを鳴らすかどうかを設定します。
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
 * @desc ピッチ(50～150)。100が標準
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param pan
 * @text パン
 * @desc パン(-100～100)。0が中央。
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */

(() => {
    const pluginName = "Kapu_BattleMusicManager";
    const parameters = PluginManager.parameters(pluginName);

    const randomizeBattleBgm = (parameters["randomizeBattleBgm"] === undefined)
            ? false : (parameters["randomizeBattleBgm"] === "true");

    const _fixBattleBgmObject = function(obj) {
        if (obj) {
            if (!obj.name) {
                obj.name = "";
            }
            obj.volume = (Number(obj.volume) || 90).clamp(0, 100);
            obj.pitch = (Number(obj.pitch) || 100).clamp(50, 150);
            obj.pan = (Number(obj.pan) || 0).clamp(-100, 100);
        }
    };

    const useBattleBgmPreemptive = (parameters["useBattleBgmPreemptive"] === undefined)
            ? false : (parameters["useBattleBgmPreemptive"] === "true");
    const battleBgmPreemptive = JSON.parse(parameters["battleBgmPreemptive"]);
    _fixBattleBgmObject(battleBgmPreemptive);

    const useBattleBgmSurprise = (parameters["useBattleBgmSurprise"] === undefined)
            ? false : (parameters["useBattleBgmSurprise"] === "true");
    const battleBgmSurprise = (parameters["battleBgmSurprise"])
            ? JSON.parse(parameters["battleBgmSurprise"])
            : { name:"", volume:100, pitch:90, pan:100 };
    _fixBattleBgmObject(battleBgmSurprise);

    const battleBgms = [];
    try {
        const entries = JSON.parse(parameters["battleBgms"]).map(str => JSON.parse(str));
        for (const entry of entries) {
            if (entry.name) {
                _fixBattleBgmObject(entry);
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

    PluginManager.registerCommand(pluginName, "setPreemptiveBattleBgm", args => {
        const enabled = (args.enabled === undefined) ? false : (args.enabled === "true");
        try {
            const bgm = (enabled) ? JSON.parse(args.bgm) : null;
            if (enabled && bgm.name) {
                $dataSystem.setBattleBgmPreemptive(bgm)
            }
        }
        catch (e) {
            console.error(e);
        }
    });

    PluginManager.registerCommand(pluginName, "setSurpriseBattleBgm", args => {
        const enabled = (args.enabled === undefined) ? false : (args.enabled === "true");
        try {
            const bgm = (enabled) ? JSON.parse(args.bgm) : null;
            if (enabled && bgm.name) {
                $dataSystem.setBattleBgmSurprise(bgm)
            }
        }
        catch (e) {
            console.error(e);
        }
    });

    PluginManager.registerCommand(pluginName, "setNextBattleBgm", args=> {
        try {
            const bgm = JSON.parse(args.bgm);
            if (bgm.name) {
                $gameSystem.setNextBattleBgm(bgm);
            } else {
                $gameSystem.setNextBattleBgm(null);
            }
        }
        catch (e) {
            console.error(e);
        }

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
     * 
     * Note : ベーシックシステムで用意されている、戦闘時の曲設定は _battleBgm フィールドになる。
     *        これは初期値nullで、プラグインコマンドで設定されるたものが保持される。
     */
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._battleBgmPreemptive = (useBattleBgmPreemptive) ? battleBgmPreemptive : null;
        this._battleBgmSurprise = (useBattleBgmSurprise) ? battleBgmSurprise : null;

        this._isRandomizeBattleBgm = randomizeBattleBgm;
        this._randomBattleBgms = {};
        for (let i = 0; i < battleBgms.length; i++) {
            this._randomBattleBgms[String(i)] = battleBgms[i];
        }
        this.clearNextBattleBgm();
    };

    /**
     * 先制したときの戦闘BGMを設定する。
     * 
     * @param {Bgm} bgm 
     */
    Game_System.prototype.setBattleBgmPreemptive = function(bgm) {
        this._battleBgmPreemptive = bgm;
    };

    /**
     * 強襲されたときの戦闘BGMを設定する。
     * 
     * @param {Bgm} bgm 
     */
    Game_System.prototype.setBattleBgmSurprise = function(bgm) {
        this._battleBgmSurprise = bgm;
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
        this._prioerityNextBattleBgm = null;
    };

    /**
     * 次の戦闘BGMを設定する。
     * 
     * @param {Bgm} bgm BGM (nullで解除)
     */
    Game_System.prototype.setNextBattleBgm = function(bgm) {
        this._prioerityNextBattleBgm = bgm;
    };

    /**
     * 戦闘BGMをセットアップする。
     * 
     * Note: BattleManager.setup()からコールされるので、
     *       この時点では有利状態・不利状態は分からない。
     */
    Game_System.prototype.setupNextBattleBgm = function() {
        if (this._prioerityNextBattleBgm) {
            // 優先BGMが設定されているので処理しない。
        } else {
            const bgm = $gameMap.battleBgm();
            if (bgm) { // マップに戦闘BGMが設定されている？
                this._nextBattleBgm = bgm; // マップに設定されたBGMを優先する。
            } else if (this._isRandomizeBattleBgm) { // ランダムにならす設定が有効？
                const randomBattleBgms = this.randomBattleBgms();
                if (randomBattleBgms.length > 0) {
                    const index = Math.randomInt(randomBattleBgms.length);
                    this._nextBattleBgm = randomBattleBgms[index];
                } else {
                    this._nextBattleBgm = null;
                }
            } else {
                this._nextBattleBgm = null;
            }
        }
    };

    const _Game_System_battleBgm = Game_System.prototype.battleBgm;
    /**
     * 戦闘BGMを得る。
     * 
     * @note 呼び出されるタイミングの都合上、有利戦闘か不利戦闘かの判定は
     *       この時点でしかわからない。
     * 
     * @returns {object} BGMデータ。未指定時はnull
     */
    Game_System.prototype.battleBgm = function() {
        if (this._prioerityNextBattleBgm) {
            return this._prioerityNextBattleBgm;
        } if (BattleManager.isPreemptive() &&  this._battleBgmPreemptive) {
            // 有利戦闘で曲設定あり。
            return this._battleBgmPreemptive;
        } else if (BattleManager.isSurprise() && this._battleBgmSurprise) {
            // 不利戦闘で曲設定有り
            return this._battleBgmSurprise;
        } else if (this._nextBattleBgm) {
            return this._nextBattleBgm;
        } else {
            // スクリプトで設定されたBGMなどが返る。
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

    /**
     * 戦闘が有利な状態で開始されているかどうかを得る。
     * 
     * @returns {boolean] 有利な状態で開始されている場合にはtrue, それ以外はfalse
     */
    BattleManager.isPreemptive = function() {
        return this._preemptive;
    };
    /**
     * 戦闘が不利な状態で開始されているかどうかを得る。
     * 
     * @returns {boolean} 不利な状態で開始されている場合にはtrue, それ以外はfalse.
     */
    BattleManager.isSurprise = function() {
        return this._surprise;
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