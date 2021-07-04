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

    const battleBgms = [];
    try {
        const entries = Json.parse(parameters["battleBgms"]).map(str => JSON.parse(str));
        for (const entry of entries) {
            if (entry.name) {
                entry.volume = (Number(entry.volume) || 90).clamp(0, 100);
                entry.pitch = (Number(entry.pitch) || 100).clamp(50, 150);
                entry.pane = (Number(entry.pane) || 0).clamp(-100, 100);
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

    //------------------------------------------------------------------------------
    // Game_Map

    const _Game_Map_setup = Game_Map.prototype.setup;
    /**
     * マップをセットアップする。
     * 
     * @param {number} mapId マップID
     */
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        this.setupBattleBgms();
    };

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
        this._randomBattleBgms = {};
        for (let i = 0; i < battleBgms.length; i++) {
            this._randomBattleBgms[String(i)] = battleBgms[i];
        }
    };

    /**
     * 戦闘BGM指定を解除する。
     */
    Game_System.prototype.clearBattleBgm = function() {
        this._battleBgm = null;
    };

    /**
     * 戦闘BGMを設定する。
     * 
     * @param {string} name BGMファイル名
     * @param {number} volume ボリューム
     * @param {number} pitch ピッチ
     * @param {number} pan パン
     */
    Game_System.prototype.setBattleBgm = function(name, volume, pitch, pan) {
        if (name) {
            this._battleBgm = {
                name:name,
                volume:volume,
                pitch:pitch,
                pan:pan
            }
        } else {
            this._battleBgm = null;
        }
    };

    /**
     * 戦闘BGMを得る。
     * 
     * @returns {object} BGMデータ。未指定時はnull
     * !!!overwrite!!! Game_System.battleBgm()
     *     戦闘BGMエントリの取得方法を変更するため、オーバーライドする。
     */
    Game_System.prototype.battleBgm = function() {
        if (this._battleBgm) {
            return this._battleBgm;
        } else {
            const bgm = $gameMap.battleBgm();
            if (bgm) {
                return bgm;
            } else {
                const randomBattleBgms = this.randomBattleBgms();
                if (randomBattleBgms.length > 0) {
                    const index = Math.randomInt(randomBattleBgms.length);
                    return randomBattleBgms[index];
                } else {
                    return $dataSystem.battleBgm;
                }
            }
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
})();