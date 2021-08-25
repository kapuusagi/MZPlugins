/*:ja
 * @target MZ 
 * @plugindesc 戦闘に関するユーティリティプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Drop
 * @orderAfter Kapu_Base_Drop
 * 
 * @command setupNextBattle
 * @text 次の戦闘の設定
 * @desc 次の戦闘の設定をする。
 * 
 * @arg preemptiveMode
 * @text 戦闘の有利/不利条件設定
 * @desc 戦闘の有利/不利条件を設定する。
 * @type select
 * @option 有利不利なし
 * @value none
 * @option 有利確定
 * @value preemptive
 * @option 不利確定
 * @value surprise
 * @option ランダム
 * @value random
 * 
 * @arg additionalRewardItems
 * @text 追加の報酬
 * @desc 戦闘勝利時に得られるアイテムとして加算するもの
 * @type struct<ItemEntry>[]
 * @default []
 * 
 * @arg additionalRewardGoldMin
 * @text 追加のゴールド最小値
 * @desc 戦闘勝利時に得られるゴールドに加算する値の最小値
 * @type number
 * @default 0
 * 
 * @arg additionalRewardGoldMax
 * @text 追加のゴールド最大値
 * @desc 戦闘勝利時に得られるゴールドに加算する値の最大値
 * @type number
 * @default 0
 * 
 * @arg additionalRewardExpMin
 * @text 追加のEXP最小値
 * @desc 戦闘勝利時に得られるEXPに加算する値の最小値
 * @type number
 * @default 0
 * 
 * @arg additionalRewardExpMax
 * @text 追加のEXP最大値
 * @desc 戦闘勝利時に得られるEXPに加算する値の最大値
 * @type number
 * @default 0
 * 
 * @command addRewards
 * @text 戦闘報酬追加
 * @desc 次（現在の）戦闘報酬を追加する。
 * @arg additionalRewardItems
 * @text 追加の報酬
 * @desc 戦闘勝利時に得られるアイテムとして加算するもの
 * @type struct<ItemEntry>[]
 * @default []
 * 
 * @arg additionalRewardGoldMin
 * @text 追加のゴールド最小値
 * @desc 戦闘勝利時に得られるゴールドに加算する値の最小値
 * @type number
 * @default 0
 * 
 * @arg additionalRewardGoldMax
 * @text 追加のゴールド最大値
 * @desc 戦闘勝利時に得られるゴールドに加算する値の最大値
 * @type number
 * @default 0
 * 
 * @arg additionalRewardExpMin
 * @text 追加のEXP最小値
 * @desc 戦闘勝利時に得られるEXPに加算する値の最小値
 * @type number
 * @default 0
 * 
 * @arg additionalRewardExpMax
 * @text 追加のEXP最大値
 * @desc 戦闘勝利時に得られるEXPに加算する値の最大値
 * @type number
 * @default 0
 * 
 * @help 
 * もっといいプラグインはいっぱいあるのでそちらを使おう！
 * 
 * 提供する機能
 *   ・イベントによる戦闘要求に有利/不利条件を設定する。
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
/*~struct~ItemEntry:
 *
 * @param itemId
 * @text アイテム指定
 * @type item
 * @default 0
 * 
 * @param weaponId
 * @text 武器指定
 * @type weapon
 * @default 0
 * 
 * @param armorId
 * @text 防具指定
 * @type armor
 * @default 0
 *
 * @param rate
 * @text ドロップレート
 * @type number
 * @decimals 2
 * @default 100.00
 * @min 0.00
 * @max 100.00
 * 
 */

(() => {
    const pluginName = "Kapu_BattleSystem_Utils";
    // const parameters = PluginManager.parameters(pluginName);

    /**
     * argsのフィールドを解析し、報酬を追加する。
     * 
     * @param {object} args パラメータオブジェクト
     */
    const _addRewardItems = function(args) {
        const goldMin = Math.max(0, Math.round(Number(args.additionalRewardGoldMin) || 0));
        const goldMax = Math.max(goldMin, Math.round(Number(args.additionalRewardGoldMax) || 0));
        const gold = Math.randomInt(goldMax - goldMin + 1) + goldMin;
        $gameTemp.addAdditionalRewardGold(gold);

        const expMin = Math.max(0, Math.round(Number(args.additionalRewardExpMin) || 0))
        const expMax = Math.max(expMin, Math.round(Number(args.additionalRewardExpMax) || 0));
        const exp = Math.randomInt(expMax - expMin + 1) + expMin;
        $gameTemp.addAdditionalRewardExp(exp);

        try {
            const entries = JSON.parse(args.additionalRewardItems || "[]").map(str => JSON.parse(str));
            for (const entry of entries) {
                let kind = 0;
                let id = 0;
                const itemId = Number(entry.itemId);
                const weaponId = Number(entry.weaponId);
                const armorId = Number(entry.armorId);
                if (itemId > 0) {
                    kind = 1;
                    id = itemId;
                } else if (weaponId > 0) {
                    kind = 2;
                    id = weaponId;
                } else if (armorId > 0) {
                    kind = 3;
                    id = armorId;
                }
                const rate = (Number(entry.rate) || 0).clamp(0, 100) / 100.0;
                if ((kind > 0) && (id > 0)) {
                    $gameTemp.addAdditionalRewardItem({
                        kind:kind,
                        dataId:id,
                        denominator:(1/rate)
                    });
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    };


    PluginManager.registerCommand(pluginName, "setupNextBattle", args => {
        const preemptiveMode = (args.preemptiveMode || "none");
        $gameTemp.setNextBattlePreemptiveMode(preemptiveMode);

        _addRewardItems(args);
    });
    PluginManager.registerCommand(pluginName, "addRewards", args => {
        _addRewardItems(args);
    });

    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this.clearNextBattleSettings();
    };
    /**
     * 次戦闘に関する設定をクリアする。
     */
    Game_Temp.prototype.clearNextBattleSettings = function() {
        this._nextBattlePreemptiveMode = "none";
    };

    /**
     * 次の戦闘の有利/不利モードを設定する。
     * 
     * @param {string} mode 動作モード
     */
    Game_Temp.prototype.setNextBattlePreemptiveMode = function(mode) {
        this._nextBattlePreemptiveMode = mode;
    };


    //------------------------------------------------------------------------------
    // BattleManager
    const _BattleManager_initMembers = BattleManager.initMembers;
    /**
     * オブジェクトのメンバーを初期化する。
     */
    BattleManager.initMembers = function() {
        _BattleManager_initMembers.call(this);
        switch ($gameTemp.nextBattlePreemptiveMode()) {
            case "preemptive":
                this._preemptive = true;
                this._surprise = false;
                break;
            case "surprise":
                this._preemptive = false;
                this._surprise = true;
                break;
            case "random":
                this._preemptive = Math.random() < this.ratePreemptive();
                if (!this._preemptive) {
                    this._surprise = Math.random() < this.rateSurprise();
                }
                break;
            default:
                // do nothing.
                break;
        }
        $gameTemp.clearNextBattleSettings();
    };

})();
