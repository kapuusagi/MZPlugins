/*: @plugindesc TWLD Quest system
 * 
 * @param -> Success SE <<<<<<<<<<<<<<<<<<<<<<<
 * @desc
 *
 * @param SuccessSeFile
 * @desc 成功報告時に鳴らすSEファイル
 * @default
 * @dir audio/se
 * @type file
 * @parent -> Success SE <<<<<<<<<<<<<<<<<<<<<<< 
 * 
 * @param SuccessSeVolume
 * @desc SEファイルのボリューム
 * @default 100
 * @parent -> Success SE <<<<<<<<<<<<<<<<<<<<<<< 
 * 
 * @param SuccessSePitch
 * @desc SEファイルのピッチ
 * @default 100
 * @parent -> Success SE <<<<<<<<<<<<<<<<<<<<<<< 
 * 
 * @param -> Fail SE <<<<<<<<<<<<<<<<<<<<<<<
 * @desc
 *
 * @param FailSeFile
 * @desc ギブアップ報告時に鳴らすSEファイル
 * @default
 * @dir audio/se
 * @type file
 * @parent -> Fail SE <<<<<<<<<<<<<<<<<<<<<<< 
 * 
 * @param FailSeVolume
 * @desc SEファイルのボリューム
 * @default 100
 * @parent -> Fail SE <<<<<<<<<<<<<<<<<<<<<<< 
 * 
 * @param FailSePitch
 * @desc SEファイルのピッチ
 * @default 100
 * @parent -> Fail SE <<<<<<<<<<<<<<<<<<<<<<< 
 * 
 * @help
 * TWLDのクエストシステムを提供する。
 * 機能
 *     ・依頼請け負ったり報告したり。
 *     ・アクター毎にギルドランクあるよ
 *     ・
 * 必要なもの
 *     ・Quests.json
 *       QEditorで作成したもの。
 * ノートタグ
 *     アクター
 *            <GuildExp:exp#>
 *                   ギルドEXP初期値をexp#に設定する。
 * プラグインコマンド
 *      TWLD.Quest.Add id#
 *            id#のクエストを追加する。既に追加済みの場合には何もしない。
 *      TWLD.Quest.SetDone id#
 *            id#のクエストを完了させる。
 *      TWLD.Quest.OpenShop id#,id#,id#... [clerkFileName$]
 *            id# : クエストID
 *                  IDレンジ指定(id#-id#)可能。
 *            clerkFileName : 店員ファイル名
 */
var Imported = Imported || {};
Imported.TWLD_Quest = true;

var TWLD = TWLD || {};
TWLD.Quest = TWLD.Quest || {};

/**
 *  クエストデータ
 */
var $dataQuests = null;

// for ESLint
if (typeof Scene_MenuBase === 'undefined') {
    var Window_MenuCommand = {};
    var Window_Command = {};
    var Window_Selectable = {};
    var Window_Base = {};
    var Scene_MenuBase = {};
    var Scene_Menu = {};
    var SceneManager = {};
    var TextManager = {};
    var DataManager = {};
    var ImageManager = {};
    var AudioManager = {};
    var PluginManager = {};
    var BattleManager = {};
    var Game_Actor = {};
    var Game_Party = {};
    var Game_Interpreter = {};
    var $dataActors = {};
    var $gameParty = {};
    var $dataEnemies = {};
    var $dataItems = {};
    var $dataWeapons = {};
    var $dataArmors = {};
    var $gameSwitches = {};
    var Graphics = {};
    var Sprite = {};

    var Yanfly = {};
}

(function() {
    TWLD.Quest.Parameters = PluginManager.parameters('TWLD_Quest');
    TWLD.Quest.GuildRankTable = [
        { rank:0, name:"-", iconIndex:0, exp:0 }, // 
        { rank:1, name:"G", iconIndex:0, exp:1 },
        { rank:2, name:"F", iconIndex:0, exp:100 },
        { rank:3, name:"E", iconIndex:0, exp:300 },
        { rank:4, name:"D", iconIndex:0, exp:600 },
        { rank:5, name:"C", iconIndex:0, exp:1000 },
        { rank:6, name:"B", iconIndex:0, exp:2000 },
        { rank:7, name:"A", iconIndex:0, exp:5000 },
        { rank:8, name:"S", iconIndex:0, exp:10000 },
        { rank:9, name:"SS", iconIndex:0, exp:30000 },
        { rank:10, name:"SSS", iconIndex:0, exp:50000}
    ];

    TWLD.Quest.MaxGuildExp = 99999;

    TWLD.Quest.STATUS_TRYING = 0;
    TWLD.Quest.STATUS_DONE = 1;

    TWLD.Quest.QTYPE_SUBJUGATION = 1; // 討伐依頼, achieve[0]エネミーID, acieve[1]が数量
    TWLD.Quest.QTYPE_COLLECTION = 2; // 採取依頼, achieve[0]がアイテムID, achieve[1]が数量
    TWLD.Quest.QTYPE_EVENT = 3; // イベント依頼。achieve[0]がスイッチ番号

    TWLD.Quest.FailSe = {
        name:TWLD.Quest.Parameters['FailSeFile'],
        volume:TWLD.Quest.Parameters['FailSeVolume'],
        pitch:TWLD.Quest.Parameters['FailSePitch'],
        pan:0,
    };
    TWLD.Quest.SuccessSe = {
        name:TWLD.Quest.Parameters['SuccessSeFile'],
        volume:TWLD.Quest.Parameters['SuccessSeVolume'],
        pitch:TWLD.Quest.Parameters['SuccessSePitch'],
        pan:0,
    };

    /**
     * ギルドランクEXPから該当するエントリを得る。
     * @param {Number} exp ギルドEXP
     * @return {GuildRankEntry} ギルドランクエントリ
     */
    TWLD.Quest.getGuildRankEntryByExp = function(exp) {
        for (var i = TWLD.Quest.GuildRankTable.length - 1; i >= 0; i--) {
            var entry = TWLD.Quest.GuildRankTable[i];
            if (exp >= entry.exp) {
                return entry;
            }
        }

        return TWLD.Quest.GuildRankTable[0];
    };

    /**
     * ギルドランクエントリを得る。
     * @param {Number} rank ギルドランク
     * @return {GuildRankEntry} ギルドランクエントリ
     */
    TWLD.Quest.getGuildRankEntry = function(rank) {
        TWLD.Quest.GuildRankTable.forEach(function(entry) {
            if (entry.rank === rank) {
                return entry;
            }
        });
    };

    /**
     * 報酬アイテムを得る。
     * @param {RewardItem}} entry 報酬アイテムエントリ
     * @return {Item} アイテム(Item/Weapon/Armor)
     */
    TWLD.Quest.getRewardItem = function(entry) {
        if (entry.kind === 1) {
            return $dataItems[entry.dataId];
        } else if (entry.kind === 2) {
            return $dataWeapons[entry.dataId];
        } else if (entry.kind === 3) {
            return $dataArmors[entry.dataId];
        } else {
            return null;
        }
    };

    /**
     * 報酬アイテム名を得る。
     * @param {RewardItem} entry 報酬アイテムエントリ
     * @return {String} 報酬アイテム
     */
    TWLD.Quest.getRewardItemName = function(entry) {
        var item = TWLD.Quest.getRewardItem(entry);
        return (item) ? item.name : '';
    };


    /**
     * クエストを受託可能かどうか判定する。
     * @param {Game_Quest} quest クエスト
     * @return {Boolean} 受託可能な場合にはtrue, それ以外はfalse
     */
    TWLD.Quest.isEntrust = function(quest) {
        var cond = quest.entrustCondition();
        if (cond) {
            // eslint-disable-next-line 
            var guildRank = $gameParty.guildRank();
            return eval(cond) || false;
        } else {
            // 条件設定なし。
            return true;
        }

    };


    //------------------------------------------------------------------------------
    // DataManagerの変更
    // Quests.jsonを読み出して構築する。
    //
    TWLD.Quest.DataManager_loadDatabase = DataManager.loadDatabase;

    /**
     * データベースをロードする。
     */
    DataManager.loadDatabase = function() {
        TWLD.Quest.DataManager_loadDatabase.call(this);
        try {
            this.loadDataFile("$dataQuests", "Quests.json");
        }
        catch (e) {
            console.error(e);
        }
    };
    //------------------------------------------------------------------------------
    // BattleManagerの変更
    //
    TWLD.Quest.BattleManager_endBattle = BattleManager.endBattle;
    /**
     * 戦闘終了処理をする。
     * @param {Number} result 結果(0:勝利, 1:逃走などで終了。, 2:敗北)
     */
    BattleManager.endBattle = function(result) {
        // 倒したえねみーを東坡数加算する。
        $gameTroop.deadMembers().forEach(function(enemy) {
            $gameParty.addSubjugationTarget(enemy);
        });

        TWLD.Quest.BattleManager_endBattle.call(this, result);
    };


    //------------------------------------------------------------------------------
    // Game_Actorの変更
    //     ギルドランク等の追加

    TWLD.Quest.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        TWLD.Quest.Game_Actor_initMembers.call(this);
        this._guildExp = 0;
    };

    TWLD.Quest.Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このActorを指定されたactorIdのデータで初期化する。
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        TWLD.Quest.Game_Actor_setup.call(this, actorId);
        var actor = $dataActors[actorId];
        this._guildExp = Number(actor.meta.GuildExp) || 0;
    };

    /**
     * アクターのギルドEXPを得る。
     * @return {Number} ギルドEXP
     */
    Game_Actor.prototype.guildExp = function() {
        return this._guildExp;
    };

    /**
     * EXPを加算する。
     * このメソッドは単純加算するのみ。ランクによって倍率調整は外部でやること。
     * @param {Number} gainExp 加算する量
     */
    Game_Actor.prototype.gainGuildExp = function(gainExp) {
        gainExp = gainExp || 0;
        this._guildExp = (this._guildExp + gainExp).clamp(0, TWLD.Quest.MaxGuildExp);
    };

    /**
     * アクターのギルドランクを得る。
     * @return {Number} 
     */
    Game_Actor.prototype.guildRank = function() {
        var entry = TWLD.Quest.getGuildRankEntryByExp(this._guildExp);
        return entry.rank;
    };

    /**
     * ギルドランク名を得る。
     * @return {string} ギルドランク名
     */
    Game_Actor.prototype.guildRankName = function() {
        var entry = TWLD.Quest.getGuildRankEntryByExp(this._guildExp);
        return entry.name;
    };

    //------------------------------------------------------------------------------
    // Game_Questデータ
    /**
     * 新しいGame_Questデータを構築する。
     * @param {Number} id クエストID
     */
    function Game_Quest() {
        this.initialize.apply(this, arguments);
    }

    /**
     * 初期化する。
     * @param {Number} id クエストID
     */
    Game_Quest.prototype.initialize = function(id) {
        this._id = id;
        this._status = TWLD.Quest.STATUS_TRYING;
        this._value = 0; // 討伐数など。
    };

    /**
     * クエストIDを得る。
     * @return {Number} クエストID
     */
    Game_Quest.prototype.id = function() {
        return this._id;
    };

    /**
     * 経過を得る。
     * @return {Number} 現在値
     */
    Game_Quest.prototype.getElapse = function() {
        var questData = this.questData();
        if (questData) {
            if (questData.qtype === TWLD.Quest.QTYPE_SUBJUGATION) {
                return this._value;
            } else if (questData.qtype === TWLD.Quest.QTYPE_COLLECTION) {
                var itemId = questData.achieve[0];
                var item = $dataItems[itemId];
                return this.countPartyItem(item);
            }
        }
        return 0;
    };

    /**
     * baseItemで指定されたアイテムの数を数える。
     * YEP_ItemCoreで採取対象が個別アイテムの場合、正しくカウントできない問題があったため用意した。
     * @param {Data_Item} baseItem アイテム
     * @return {Number} アイテムの数
     */
    Game_Quest.prototype.countPartyItem = function(baseItem) {
        if (Imported.YEP_ItemCore) {
            if (baseItem.nonIndepdent) {
                return $gameParty.numItems(baseItem);
            } else {
                // これは個別アイテムなので、数を数える必要がある。
                var itemCount = 0;
                $gameParty.items().forEach(function(item) {
                    if (item.baseItemId) {
                        if (item.baseItemId === baseItem.id) {
                            itemCount++;
                        }
                    }
                });

                return itemCount;
            }
        } else {
            return $gameParty.numItems(baseItem);
        }
    };


    /**
     * トータルカウントを得る。
     * @return {Number} トータルカウント
     */
    Game_Quest.prototype.getTotal = function() {
        var questData = this.questData();
        if (questData) {
            if (questData.qtype === TWLD.Quest.QTYPE_SUBJUGATION) {
                return questData.achieve[1];
            } else if (questData.qtype === TWLD.Quest.QTYPE_COLLECTION) {
                return questData.achieve[1];
            }
        }
        return 0;
    };


    /**
     * クエストデータを得る。
     * @return {DataQuest} クエストデータ
     */
    Game_Quest.prototype.questData = function() {
        return $dataQuests[this._id];
    };

    /**
     * ギルドランクを得る。
     * @return {Number} ギルドランク
     */
    Game_Quest.prototype.guildRank = function() {
        var questData = this.questData();
        return (questData) ? questData.guildRank : 0;
    };

    /**
     * ギルドEXPを得る。
     * @return {Number} ギルドEXP
     */
    Game_Quest.prototype.guildExp = function() {
        var questData = this.questData();
        return (questData) ? questData.guildExp : 0;
    };

    /**
     * クエストの状態を取得する。
     * @return {Number} 状態
     */
    Game_Quest.prototype.status = function() {
        return this._status;
    };

    /**
     * 討伐対象かどうかを判定する。
     * @param {Number} enemyId エネミーID
     * @return {Boolean} 討伐対象の場合にはtrue, それ以外はfalse
     */
    Game_Quest.prototype.isSubjugationTarget = function(enemyId) {
        var questData = this.questData();
        if (questData) {
            if ((questData.qtype === TWLD.Quest.QTYPE_SUBJUGATION)
                    && (questData.achieve[0] === enemyId)) {
                return true;
            }
        }
        return false;
    };

    /**
     * 討伐数を加算する。
     * @param {Number} enemyId エネミーID
     */
    Game_Quest.prototype.incrementSubjugationTarget = function(enemyId) {
        var questData = this.questData();
        if (questData) {
            if ((questData.qtype === TWLD.Quest.QTYPE_SUBJUGATION)
                    && (questData.achieve[0] === enemyId)) {
                this._value = (this._value + 1).clamp(0, questData.achieve[1]);
            }
        }
    };

    /**
     * 受託条件を取得する。
     * @return {string} 受託条件
     */
    Game_Quest.prototype.entrustCondition = function() {
        var questData = this.questData();
        return (questData) ? questData.entrustCondition : '';
    };

    /**
     * クエスト名を得る。
     * @return {String} クエスト名
     */
    Game_Quest.prototype.name = function() {
        var questData = this.questData();
        if (questData) {
            if (questData.name) {
                return questData.name;
            } else {
                // 自動生成できるなら生成する。
                if (questData.qtype === TWLD.Quest.QTYPE_SUBJUGATION) {
                    var enemyName = this.getTargetName();
                    if (enemyName) {
                        return enemyName + 'の討伐';
                    }
                } else if (questData.qtype === TWLD.Quest.QTYPE_COLLECTION) {
                    var itemName = this.getTargetName();
                    if (itemName) {
                        return itemName + 'の採取';
                    }
                }
            }
        }
        return '';
    };

    /**
     * 説明文を得る
     * @return {String} 説明文
     */
    Game_Quest.prototype.description = function() {
        var questData = this.questData();
        if (questData) {
            if (questData.description) {
                return questData.description;
            } else {
                // 自動生成できるなら生成する。
                if (questData.qtype === TWLD.Quest.QTYPE_SUBJUGATION) {
                    var enemyName = this.getTargetName();
                    if (enemyName) {
                        return enemyName + 'を討伐してください。';
                    }
                } else if (questData.qtype === TWLD.Quest.QTYPE_COLLECTION) {
                    var itemName = this.getTargetName();
                    if (itemName) {
                        return itemName + 'を集めてきてください。';
                    }
                }
            }
        }
        return '？';
    };

    /**
     * 達成条件メッセージを得る。
     * @return {String} 達成条件メッセージ
     */
    Game_Quest.prototype.achieveText = function() {
        var questData = this.questData();
        if (questData) {
            if (questData.achieveMsg) {
                return questData.achieveMsg;
            } else {
                // 自動生成できるなら生成する。
                if (questData.qtype === TWLD.Quest.QTYPE_SUBJUGATION) {
                    var enemyName = this.getTargetName();
                    if (enemyName) {
                        var subjugationCount = this.getTotal();
                        return enemyName + 'を' + subjugationCount + '体討伐する。';
                    }
                } else if (questData.qtype === TWLD.Quest.QTYPE_COLLECTION) {
                    var itemName = this.getTargetName();
                    if (itemName) {
                        var itemCount = this.getTotal();
                        return itemName + 'を' + itemCount + '個集める。';
                    }
                }
            }
        }
        return '？';
    };

    /**
     * 報酬アイテム一覧を得る。
     * @return {Array<[Item,Number]>} 報酬アイテム一覧
     */
    Game_Quest.prototype.rewardItems = function() {
        var items = [];
        var questData = this.questData();
        if (questData) {
            questData.rewardItems.forEach(function(entry) {
                var item = TWLD.Quest.getRewardItem(entry);
                var num = entry.value;
                if ((items != null) && (num > 0)) {
                    items.push([item, num]);
                }
            });
        }
        return items;
    };

    /**
     * 報酬テキストを取得する。
     * @return {String} 報酬テキスト
     */
    Game_Quest.prototype.rewardText = function() {
        var questData = this.questData();
        if (questData) {
            if (questData.rewardMsg) {
                return questData.rewardMsg;
            } else {
                var msg = '';
                if (questData.rewardGold) {
                    msg += questData.rewardGold + TextManager.currencyUnit + '\n';
                }
                return this.rewardItems().reduce(function(prev, entry) {
                    if (prev) {
                        return prev + '\n' + entry[0].name + '×' + entry[1];
                    } else {
                        return entry[0].name + '×' + entry[1];
                    }
                }, msg);
            }
        }

        return '';
    };

    /**
     * ターゲット名を得る。
     * @return {String} ターゲット名
     */
    Game_Quest.prototype.getTargetName = function() {
        var questData = this.questData();
        if (questData.qtype === TWLD.Quest.QTYPE_SUBJUGATION) {
            var enemyId = questData.achieve[0];
            var enemy = $dataEnemies[enemyId];
            return enemy ? enemy.name : '';
        } else if (questData.qtype === TWLD.Quest.QTYPE_COLLECTION) {
            var itemId = questData.achieve[0];
            var item = $dataItems[itemId];
            return item ? item.name : '';
        } else {
            return '';
        }
    };

    /**
     * 状態を更新する。
     */
    Game_Quest.prototype.update = function() {
        var questData = this.questData();
        if (questData) {
            if (questData.qtype === TWLD.Quest.QTYPE_SUBJUGATION) {
                this._status = (this.getElapse() >= this.getTotal())
                        ? TWLD.Quest.STATUS_DONE : TWLD.Quest.STATUS_TRYING;
            } else if (questData.qtype === TWLD.Quest.QTYPE_COLLECTION) {
                this._status = (this.getElapse() >= this.getTotal())
                        ? TWLD.Quest.STATUS_DONE : TWLD.Quest.STATUS_TRYING;
            } else if (questData.qtype === TWLD.Quest.QTYPE_EVENT) {
                var switchId = questData.achieve[0];
                if (switchId) {
                    this._status = $gameSwitches.value(switchId)
                            ? TWLD.Quest.STATUS_DONE : TWLD.Quest.STATUS_TRYING;
                }
            }
        }
    };

    /**
     * 強制的に達成状態にする。
     */
    Game_Quest.prototype.done = function() {
        this._status = TWLD.Quest.STATUS_DONE;
        var questData = this.questData();
        if (questData) {
            if (questData.qtype === TWLD.Quest.QTYPE_SUBJUGATION) {
                this._value = this.getTotal();
            } else if (questData.qtype === TWLD.Quest.QTYPE_COLLECTION) {
                var lackCount = this.getTotal() - this.getElapse();
                if (lackCount > 0) {
                    var itemId = questData.achieve[0];
                    var item = $dataItems[itemId];
                    $gameParty.gainItem(item, lackCount);
                }
            } else if (questData.qtype === TWLD.Quest.QTYPE_EVENT) {
                var switchId = questData.achieve[0];
                if (switchId) {
                    $gameSwitches.setValue(switchId, true);
                }
            }
        }

    };

    /**
     * 達成済みかどうかを取得する。
     * @return {Boolean} 達成済みの場合にはtrue, それ以外はfalse
     */
    Game_Quest.prototype.isDone = function() {
        return this._status === TWLD.Quest.STATUS_DONE;
    };

    Game_Quest.prototype.rankName = function() {
        var questData = this.questData();
        if (questData) {
            var entry = TWLD.Quest.getGuildRankEntry(questData.guildRank);
            if (entry) {
                return entry.name;
            }

        }
        return '-';
    };

    /**
     * 報酬金額を得る。
     * @return {Number} 報酬金額
     */
    Game_Quest.prototype.rewardGold = function() {
        var questData = this.questData();
        return (questData) ? questData.rewardGold : 0;
    };

    /**
     * キャンセル時のペナルティ金額を得る。
     * @return {Number} ペナルティ金額
     */
    Game_Quest.prototype.penaltyGold = function() {
        var questData = this.questData();
        if (questData) {
            if (questData.rewardGold) {
                // 報酬金額が設定されている
                return Math.round(questData.rewardGold * 0.3);
            } else if (questData.guildRank) {
                // ギルドランクが指定されている。
                var entry = TWLD.Quest.getGuildRankEntry(questData.guildRank);
                return Math.floor(entry.exp * 0.5);
            }
        }
        return 0;
    };


    //------------------------------------------------------------------------------
    // Game_Partyの変更
    //     受託中クエストデータの追加。
    //     パーティギルドランクの取得インタフェース追加
    TWLD.Quest.Game_Party_initialize = Game_Party.prototype.initialize;


    /**
     * Game_Partyを初期化する。
     */
    Game_Party.prototype.initialize = function() {
        TWLD.Quest.Game_Party_initialize.call(this);
        this._quests = []; // 受領中のクエスト
    };

    /**
     * このパーティーのギルドランクを得る。
     * @return {Number} ギルドランク
     */
    Game_Party.prototype.guildRank = function() {
        var members = this.allMembers();
        var totalRank = members.reduce(function(prev, member) {
            return prev + member.guildRank();
        }, 0);
        return Math.round(totalRank / members.length);
    };

    /**
     * 新しいクエストを請け負う。
     * @param {Number} quest クエスト
     */
    Game_Party.prototype.addQuest = function(quest) {
        this._quests.push(quest); 
        quest.update();
    };

    /**
     * クエストを削除する。
     * @param {Number} id クエストID
     */
    Game_Party.prototype.removeQuest = function(id) {
        for (var i = 0; i < this._quests.length; i++) {
            if (this._quests[i].id() === id) {
                this._quests.splice(i, 1);
                return;
            }
        }
    };

    /**
     * 受領中のクエスト一覧を得る。
     * @return {Array<Game_Quest>} クエスト一覧
     */
    Game_Party.prototype.quests = function() {
        return this._quests;
    };

    /**
     * クエストの状態を更新する。
     */
    Game_Party.prototype.updateQuests = function() {
        this._quests.forEach(function(q) {
            q.update();
        });
    };

    /**
     * クエストを完了にする。
     * @param {Number} id クエストID
     */
    Game_Party.prototype.doneQuest = function(id) {
        this._quests.forEach(function(q) {
            if (q.id() === id) {
                q.done();
            }
        });
    };

    /**
     * idで指定されるクエストを受領中かどうかを判定して返す。
     * @param {Number} id クエストID
     * @return {Boolean} 受領中の場合にはtrue, それ以外はfalse
     */
    Game_Party.prototype.isTryingQuest = function(id) {
        for (var i = 0; i < this._quests.length; i++) {
            if (this._quests[i].id() === id) {
                return true;
            }
        }
        return false;
    };

    /**
     * 討伐した対象を追加する。
     * @param {Game_Enemy} enemy エネミー
     */
    Game_Party.prototype.addSubjugationTarget = function(enemy) {
        var enemyId = enemy.enemyId();
        this._quests.forEach(function(q) {
            if (q.isSubjugationTarget(enemyId)) {
                q.incrementSubjugationTarget(enemyId);
            }
        });

    };
    

    //------------------------------------------------------------------------------
    // 受領中クエストリスト
    //
    function Window_MenuQuestList() {
        this.initialize.apply(this, arguments);
    }

    Window_MenuQuestList.prototype = Object.create(Window_Command.prototype);
    Window_MenuQuestList.prototype.constructor = Window_MenuQuestList;

    /**
     * ウィンドウを初期化する。
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     */
    Window_MenuQuestList.prototype.initialize = function(x, y, width) {
        var height = Graphics.boxHeight;
        $gameParty.updateQuests(); // クエストの状態更新
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    /**
     * 最大項目数を得る。
     * @return {Number} 最大項目数
     */
    Window_MenuQuestList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * @param {Number} index インデックス（未指定の場合には現在のインデックス）
     * @return {Game_Quest} クエストデータ
     */
    Window_MenuQuestList.prototype.item = function(index) {
        if (index === undefined) {
            index = this.index();
        }
        return ((index >= 0) && (index < this._quests.length)) ? this._quests[index] : null;
    };

    /**
     * 項目を描画する。
     * @param {Number} index インデックス番号
     */
    Window_MenuQuestList.prototype.drawItem = function(index) {
        var rect = this.itemRect(index);
        var quest = this.item(index);
        if (quest) {
            var name = quest.name();
            if (quest.isDone()) {
                this.changeTextColor(this.textColor(1));
            } else {
                this.resetTextColor();
            }
            this.drawText(name, rect.x, rect.y, rect.width);
        }
    };

    /**
     * ステータスウィンドウを設定する。
     * @param {Window_QuestStatus} window クエストステータスウィンドウ
     */
    Window_MenuQuestList.prototype.setStatusWindow = function(window) {
        this._statusWindow = window;
        this.callUpdateHelp();
    };

    /**
     * 選択項目の説明を更新する。
     */
    Window_MenuQuestList.prototype.callUpdateHelp = function() {
        if (this._statusWindow) {
            this._statusWindow.setQuest(this.item());
        }
    };

    //------------------------------------------------------------------------------
    // Window_QuestStatus
    // クエスト情報を表示する。
    function Window_QuestStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestStatus.prototype = Object.create(Window_Base.prototype);
    Window_QuestStatus.prototype.constructor = Window_QuestStatus;

    /**
     * Window_QuestStatusを初期化する。
     * @param {Number} x ウィンドウx位置
     * @param {Number} y ウィンドウy位置
     * @param {Number} width ウィンドウ幅
     * @param {NNumber} height ウィンドウ高さ
     */
    Window_QuestStatus.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._quest = null;
    }

    /**
     * クエストデータを設定する。
     * @param {Game_Quest} quest クエストデータ
     */
    Window_QuestStatus.prototype.setQuest = function(quest) {
        this._quest = quest;
        this.refresh();
    }

    /**
     * 表示を更新する。
     */
    Window_QuestStatus.prototype.refresh = function() {
        var quest = this._quest;
        this.contents.clear();
        if (quest === null) {
            return;
        }

        var lineHeight = this.lineHeight();
        var contentsWidth = this.contentsWidth() - 40;

        var x = this.standardPadding();
        var y = this.standardPadding();
        // クエスト名（Window_MenuQuestListにあるからいらないかも？）
        this.drawQuestName(quest, x, y, contentsWidth);
        y += lineHeight;
        this.drawHorzLine(y + 4);
        y += 8;

        // 概要
        this.drawQuestDescription(quest, x, y);
        y += lineHeight * 3;
        this.drawHorzLine(y + 4);
        y += 8;

        // 達成条件
        this.drawQuestAchieve(quest, x, y, contentsWidth);
        y += lineHeight * 4;
        this.drawHorzLine(y + 4);
        y += 8;

        // 報酬
        this.drawQuestRewards(quest, x, y);
    };

    /**
     * ラベル幅を得る。
     * @return {Number} ラベル幅
     */
    Window_QuestStatus.prototype.labelWidth = function() {
        return 120;
    }

    /**
     * クエスト名を描画する。
     * @param {Game_Quest}} quest クエスト
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     */
    Window_QuestStatus.prototype.drawQuestName = function(quest, x, y, width) {
        var labelWidth = this.labelWidth();
        var padding = this.standardPadding();
        var rankWidth = 120;
        var nameWidth = width - padding * 2 - labelWidth - rankWidth;
        this.changeTextColor(this.systemColor());
        this.drawText('依頼名:', x, y, labelWidth);
        x += labelWidth + padding;
        this.resetTextColor();
        this.drawText(quest.name(), x, y, nameWidth);
        x += nameWidth + padding;
        this.changeTextColor(this.systemColor());
        this.drawText('Rank:', x, y, rankWidth);
        this.resetTextColor();
        var rankLabelWidth = this.textWidth('Rank:');
        x += rankLabelWidth;
        this.drawText(quest.rankName(), x, y, rankWidth - rankLabelWidth)
    };

    /**
     * 依頼内容を描画する。
     * @param {Game_Quest} quest クエスト
     * @param {Number} x x位置
     * @param {Number} y y位置
     */
    Window_QuestStatus.prototype.drawQuestDescription = function(quest, x, y) {
        var labelWidth = this.labelWidth();
        var padding = this.standardPadding();
        this.changeTextColor(this.systemColor());
        this.drawText('依頼内容:', x, y, labelWidth, 'right');
        this.resetTextColor();
        this.drawTextEx(quest.description(), x + labelWidth + padding, y);
    };

    /**
     * 達成条件を記述する。
     * @param {Game_Quest} quest クエスト
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     */
    Window_QuestStatus.prototype.drawQuestAchieve = function(quest, x, y, width) {
        var labelWidth = this.labelWidth();
        var padding = this.standardPadding();
        this.changeTextColor(this.systemColor());
        this.drawText('達成条件:', x, y, labelWidth, 'right');
        this.resetTextColor();
        this.drawTextEx(quest.achieveText(), x + labelWidth + padding, y);
        y += this.lineHeight() * 3;

        var total = quest.getTotal();
        if (total > 0) {
            var numWidth = this.textWidth('XX/XX'); 
            var name = quest.getTargetName();
            var nameWidth = this.textWidth(name) + 6;
            if ((nameWidth + numWidth) > width) {
                nameWidth = width - numWidth - 6;
            }
            var elapse = quest.getElapse();
            this.resetTextColor();
            this.drawText(name, x, y, nameWidth);
            this.drawText(elapse + '/' + total, x + nameWidth + 6, y, numWidth, 'left');
        }
    };

    /**
     * 報酬を記述する。
     * @param {Game_Quest} quest クエスト
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     */
    Window_QuestStatus.prototype.drawQuestRewards = function(quest, x, y) {
        var labelWidth = this.labelWidth();
        var padding = this.standardPadding();
        this.changeTextColor(this.systemColor());
        this.drawText('報酬:', x, y, labelWidth);
        this.resetTextColor();
        this.drawTextEx(quest.rewardText(), x + labelWidth + padding, y);
    };

    /**
     * 水平ラインを描画する。
     * @param {Number} y 描画位置y
     */
    Window_QuestStatus.prototype.drawHorzLine = function(y) {
        this.contents.paintOpacity = 48;
        this.contents.fillRect(0, y, this.contentsWidth(), 2, this.lineColor());
        this.contents.paintOpacity = 255;
    };

    /**
     * 線描画色を得る。
     * @return {Color} 線描画色
     */
    Window_QuestStatus.prototype.lineColor = function() {
        return this.normalColor();
    };
 
    //------------------------------------------------------------------------------
    // Scene_CommandQuest
    // やること
    //     受領中のクエストと状態表示

    function Scene_CommandQuest() {
        this.initialize.call(this, arguments);
    }

    Scene_CommandQuest.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_CommandQuest.prototype.constructor = Scene_CommandQuest;

    /**
     * Scene_CommandQuestを初期化する。
     */
    Scene_CommandQuest.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.apply(this, arguments);
    };

    /**
     * シーンに関係するオブジェクト（ウィンドウなど）を作成する。
     */
    Scene_CommandQuest.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createStatusWindow();
    };

    /**
     * コマンドウィンドウを作成する。
     */
    Scene_CommandQuest.prototype.createCommandWindow = function() {
        var x = 0;
        var y = 0;
        var width = 240;
        this._commandWindow = new Window_MenuQuestList(x, y, width);
        this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
        this._commandWindow.setHandler('cancel', this.onCommandCancel.bind(this));
        this._commandWindow.hide();
        this.addWindow(this._commandWindow);
    };

    /**
     * ステータスウィンドウを作成する。
     */
    Scene_CommandQuest.prototype.createStatusWindow = function() {
        var x = this._commandWindow.x + this._commandWindow.width;
        var y = 0;
        var width = Graphics.boxWidth - x;
        var height = Graphics.boxHeight;
        this._statusWindow = new Window_QuestStatus(x, y, width, height);
        this._commandWindow.setStatusWindow(this._statusWindow);
        this.addWindow(this._statusWindow);
    };

    /**
     * シーンを開始する。
     */
    Scene_CommandQuest.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._commandWindow.show();
        this._statusWindow.show();
        this._commandWindow.activate();
    };

    /**
     * コマンド画面でOK操作されたときの処理を行う。
     */
    Scene_CommandQuest.prototype.onCommandOk = function() {
        this._commandWindow.activate();

    };

    /**
     * コマンド画面でキャンセル操作をしたときの処理を行う。
     */
    Scene_CommandQuest.prototype.onCommandCancel = function() {
        this.popScene();
    };

    //------------------------------------------------------------------------------
    // Window_MenuCommand
    //    コマンドを登録する。
    TWLD.Quest.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;

    /**
     * 独自コマンドを追加する。
     */
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        TWLD.Quest.Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand('依頼', 'quest', $gameParty.quests().length > 0);
    };

    //------------------------------------------------------------------------------
    // Scene_Menu
    //     メニューにコマンド追加
    //
    TWLD.Quest.Scene_Menu_CreateCommandWindow = Scene_Menu.prototype.createCommandWindow;
    /**
     * コマンドウィンドウを作成する。
     */
    Scene_Menu.prototype.createCommandWindow = function() {
        TWLD.Quest.Scene_Menu_CreateCommandWindow.call(this);
        this._commandWindow.setHandler('quest', this.commandQuest.bind(this));
    };

    /**
     * クエストコマンドが選択されたときの処理を行う。
     */
    Scene_Menu.prototype.commandQuest = function() {
        SceneManager.push(Scene_CommandQuest);
    };

    //------------------------------------------------------------------------------
    // Window_QuestShopCommand
    //
    /**
     * 新しいWindow_QuestShopCommandを構築する。
     * @param {Number} x ウィンドウx位置
     * @param {Number} y ウィンドウy位置
     */
    function Window_QuestShopCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestShopCommand.prototype = Object.create(Window_Command.prototype);
    Window_QuestShopCommand.constructor = Window_QuestShopCommand;

    /**
     * 初期化する。
     * @param {Number} x ウィンドウx位置
     * @param {Number} y ウィンドウy位置
     */
    Window_QuestShopCommand.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
    };

    /**
     * 行数を得る。
     */
    Window_QuestShopCommand.prototype.numVisibleRows = function() {
        return 4;
    };

    /**
     * コマンドリストを構築する。
     */
    Window_QuestShopCommand.prototype.makeCommandList = function() {
        this.addCommand('受ける', 'underTake');
        this.addCommand('報告する', 'report');
        this.addCommand('ギブアップする', 'giveup');
        this.addCommand('キャンセル', 'cancel');
    };

    //------------------------------------------------------------------------------
    // Window_QuestShopUnderTakeList
    //   受けることが可能なクエスト一覧を描画する。
    //
    /**
     * Window_QuestShopUnderTakeListを構築する。
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     * @param {Array<Game_Quest>} クエストリスト
     */
    function Window_QuestShopUnderTakeList() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestShopUnderTakeList.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestShopUnderTakeList.prototype.constructor = Window_QuestShopUnderTakeList;

    /**
     * ウィンドウを初期化する。
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     * @param {Array<Game_Quest>} クエストリスト
     */
    Window_QuestShopUnderTakeList.prototype.initialize = function(x, y, width, quests) {
        var height = Graphics.boxHeight;
        $gameParty.updateQuests(); // クエストの状態更新
        this._quests = quests;
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    /**
     * 最大項目数を得る。
     * @return {Number} 最大項目数
     */
    Window_QuestShopUnderTakeList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * @param {Number} index インデックス（未指定の場合には現在のインデックス）
     * @return {Game_Quest} クエストデータ
     */
    Window_QuestShopUnderTakeList.prototype.item = function(index) {
        if (index === undefined) {
            index = this.index();
        }
        return ((index >= 0) && (index < this._quests.length)) ? this._quests[index] : null;
    };

    /**
     * 現在選択中の項目が選択可能かどうかを判定する。
     */
    Window_QuestShopUnderTakeList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.index());
    };

    /**
     * indexで指定される項目が選択可能かどうかを判定する。
     * 派生クラスはこのメソッドを実装して選択可否判定を行うこと。
     * @param {Number} index インデックス番号
     */
    // eslint-disable-next-line no-unused-vars
    Window_QuestShopUnderTakeList.prototype.isEnabled = function(index) {
        if ($gameParty.quests().length >= 3) {
            return false; // 3件以上受託中。
        }
        var quest = this.item(index);
        if ($gameParty.isTryingQuest(quest.id())) {
            return false; // 既に受託中
        }

        // 受託可否判定
        return TWLD.Quest.isEntrust(quest);
    };

    /**
     * ステータスウィンドウを設定する。
     * @param {Window_QuestStatus}} window クエストステータスウィンドウ
     */
    Window_QuestShopUnderTakeList.prototype.setStatusWindow = function(window) {
        this._statusWindow = window;
        this.callUpdateHelp();
    };

    /**
     * 選択項目の説明を更新する。
     */
    Window_QuestShopUnderTakeList.prototype.callUpdateHelp = function() {
        if (this._statusWindow) {
            var quest = this.item();
            if (quest !== null) {
                var questId = quest.id();
                if ($gameParty.isTryingQuest(questId)) {
                    // もし受領中クエストがあるなら、そっちのデータを表示する。
                    quest = $gameParty.quests().find(function(q) {
                        return q.id() === questId;
                    });
                }
                this._statusWindow.setQuest(quest);
            } else {
                this._statusWindow.setQuest(quest);
            }
        }
    };


    
    /**
     * 項目を描画する。
     * @param {Number} index インデックス番号
     */
    Window_QuestShopUnderTakeList.prototype.drawItem = function(index) {
        var rect = this.itemRect(index);
        var quest = this.item(index);
        if (quest) {
            this.changePaintOpacity(this.isEnabled(index));
            var name = quest.name();
            if (quest.isDone()) {
                this.changeTextColor(this.textColor(1));
            } else {
                this.resetTextColor();
            }
            var nameWidth = rect.width - 96;
            this.drawText(name, rect.x, rect.y, nameWidth);
            if ($gameParty.isTryingQuest(quest.id())) {
                this.changeTextColor(this.textColor(1));
                this.drawText('受託中', rect.x + nameWidth, rect.y, 96, 'right');
            }
            this.changePaintOpacity(false);
        }
    };
    //------------------------------------------------------------------------------
    // Window_QuestShopReportList
    // 
    /**
     * Window_QuestShopReportListを構築する。
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     */
    function Window_QuestShopReportList() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestShopReportList.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestShopReportList.prototype.constructor = Window_QuestShopReportList;

    /**
     * ウィンドウを初期化する。
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     */
    Window_QuestShopReportList.prototype.initialize = function(x, y, width) {
        var height = Graphics.boxHeight;
        $gameParty.updateQuests(); // クエストの状態更新
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    /**
     * 最大項目数を得る。
     * @return {Number} 最大項目数
     */
    Window_QuestShopReportList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * @param {Number} index インデックス（未指定の場合には現在のインデックス）
     * @return {Game_Quest} クエストデータ
     */
    Window_QuestShopReportList.prototype.item = function(index) {
        if (index === undefined) {
            index = this.index();
        }
        return ((index >= 0) && (index < this._quests.length)) ? this._quests[index] : null;
    };

    /**
     * 現在選択中の項目が選択可能かどうかを判定する。
     */
    Window_QuestShopReportList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.index());
    };

    /**
     * indexで指定される項目が選択可能かどうかを判定する。
     * @param {Number} index インデックス番号
     * @return {Boolean} 選択可能な場合にはtrue, それ以外はfalse
     */
    Window_QuestShopReportList.prototype.isEnabled = function(index) {
        var quest = this.item(index);
        return quest.isDone();
    };

    /**
     * ステータスウィンドウを設定する。
     * @param {Window_QuestStatus}} window クエストステータスウィンドウ
     */
    Window_QuestShopReportList.prototype.setStatusWindow = function(window) {
        this._statusWindow = window;
        this.callUpdateHelp();
    };

    /**
     * 選択項目の説明を更新する。
     */
    Window_QuestShopReportList.prototype.callUpdateHelp = function() {
        if (this._statusWindow) {
            var quest = this.item();
            this._statusWindow.setQuest(quest);
        }
    };
    
    /**
     * 項目を描画する。
     * @param {Number} index インデックス番号
     */
    Window_QuestShopReportList.prototype.drawItem = function(index) {
        var rect = this.itemRect(index);
        var quest = this.item(index);
        if (quest) {
            this.changePaintOpacity(this.isEnabled(index));
            var name = quest.name();
            if (quest.isDone()) {
                this.changeTextColor(this.textColor(1));
            } else {
                this.resetTextColor();
            }
            var nameWidth = rect.width - 96;
            this.drawText(name, rect.x, rect.y, nameWidth);

            if (quest.isDone()) {
                this.changeTextColor(this.textColor(1));
                this.drawText('報告可', rect.x + nameWidth, rect.y, 96, 'right');
            }
            this.changePaintOpacity(false);
        }
    };

    /**
     * ウィンドウを更新する。
     */
    Window_QuestShopReportList.prototype.refresh = function() {
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.refresh.call(this);
    };

    //------------------------------------------------------------------------------
    // Window_QuestShopGiveupList
    // 
    /**
     * Window_QuestShopGiveupListを構築する。
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     */
    function Window_QuestShopGiveupList() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestShopGiveupList.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestShopGiveupList.prototype.constructor = Window_QuestShopGiveupList;

    /**
     * ウィンドウを初期化する。
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     */
    Window_QuestShopGiveupList.prototype.initialize = function(x, y, width) {
        var height = Graphics.boxHeight;
        $gameParty.updateQuests(); // クエストの状態更新
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
    };

    /**
     * 最大項目数を得る。
     * @return {Number} 最大項目数
     */
    Window_QuestShopGiveupList.prototype.maxItems = function() {
        return this._quests.length;
    };

    /**
     * indexで指定された項目のクエストデータを得る。
     * @param {Number} index インデックス（未指定の場合には現在のインデックス）
     * @return {Game_Quest} クエストデータ
     */
    Window_QuestShopGiveupList.prototype.item = function(index) {
        if (index === undefined) {
            index = this.index();
        }
        return ((index >= 0) && (index < this._quests.length)) ? this._quests[index] : null;
    };

    /**
     * 現在選択中の項目が選択可能かどうかを判定する。
     */
    Window_QuestShopGiveupList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.index());
    };

    /**
     * indexで指定される項目が選択可能かどうかを判定する。
     * @param {Number} index インデックス番号
     * @return {Boolean} 選択可能な場合にはtrue, それ以外はfalse
     */
    // eslint-disable-next-line no-unused-vars
    Window_QuestShopGiveupList.prototype.isEnabled = function(index) {
        return true;
    };

    /**
     * ステータスウィンドウを設定する。
     * @param {Window_QuestStatus}} window クエストステータスウィンドウ
     */
    Window_QuestShopGiveupList.prototype.setStatusWindow = function(window) {
        this._statusWindow = window;
        this.callUpdateHelp();
    };

    /**
     * 選択項目の説明を更新する。
     */
    Window_QuestShopGiveupList.prototype.callUpdateHelp = function() {
        if (this._statusWindow) {
            var quest = this.item();
            this._statusWindow.setQuest(quest);
        }
    };
    
    /**
     * 項目を描画する。
     * @param {Number} index インデックス番号
     */
    Window_QuestShopGiveupList.prototype.drawItem = function(index) {
        var rect = this.itemRect(index);
        var quest = this.item(index);
        if (quest) {
            this.changePaintOpacity(this.isEnabled(index));
            var name = quest.name();
            if (quest.isDone()) {
                this.changeTextColor(this.textColor(1));
            } else {
                this.resetTextColor();
            }
            var nameWidth = rect.width - 96;
            this.drawText(name, rect.x, rect.y, nameWidth);

            if (quest.isDone()) {
                this.changeTextColor(this.textColor(1));
                this.drawText('報告可', rect.x + nameWidth, rect.y, 96, 'right');
            }
            this.changePaintOpacity(false);
        }
    };

    /**
     * ウィンドウを更新する。
     */
    Window_QuestShopGiveupList.prototype.refresh = function() {
        this._quests = $gameParty.quests();
        Window_Selectable.prototype.refresh.call(this);
    };

    //------------------------------------------------------------------------------
    // Window_QuestShopMessage
    // 
    function Window_QuestShopMessage() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestShopMessage.prototype = Object.create(Window_Base.prototype);
    Window_QuestShopMessage.prototype.constructor = Window_QuestShopMessage;

    /**
     * Window_QuestShopMessageを初期化する。
     * @param {Number} x ウィンドウx位置
     * @param {Number} y ウィンドウy位置
     * @param {Number} numLines 行数
     */
    Window_QuestShopMessage.prototype.initialize = function(y, numLines) {
        var height = this.fittingHeight(numLines);
        var width = Graphics.boxWidth;
        Window_Base.prototype.initialize.call(this, 0, y, width, height);
        this._text = '';
    };

    /**
     * テキストを設定する。
     * @param {String} text 表示メッセージ
     */
    Window_QuestShopMessage.prototype.setText = function(text) {
        this._text = text;
        this.refresh();
    };

    /**
     * テキストをクリアする。
     */
    Window_QuestShopMessage.prototype.clear = function() {
        this.setText('');
    };

    /**
     * 描画内容を更新する。
     */
    Window_QuestShopMessage.prototype.refresh = function() {
        this.contents.clear();
        this.drawTextEx(this._text, this.textPadding(), 0);
    };

    //------------------------------------------------------------------------------
    // Window_QuestShopConfirm
    // 
    function Window_QuestShopConfirm() {
        this.initialize.apply(this, arguments);
    }

    Window_QuestShopConfirm.prototype = Object.create(Window_Command.prototype);
    Window_QuestShopConfirm.prototype.constructor = Window_QuestShopConfirm;

    /**
     * 
     * @param {Number} x ウィンドウx位置
     * @param {Number} y ウィンドウy位置
     */
    Window_QuestShopConfirm.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
    };

    /**
     * ウィンドウ高さを得る。
     */
    Window_QuestShopConfirm.prototype.windowHeight = function() {
        return this.fittingHeight(2);
    };

    /**
     * コマンドリストを作成する。
     */
    Window_QuestShopConfirm.prototype.makeCommandList = function() {
        this.addCommand('はい', 'ok');
        this.addCommand('いいえ', 'cancel');
    };
    //------------------------------------------------------------------------------
    // Window_QuestShopRewards
    //
    function Window_QuestShopRewards() {
        this.initialize.apply(this, arguments);
    };

    Window_QuestShopRewards.prototype = Object.create(Window_Selectable.prototype);
    Window_QuestShopRewards.prototype.constructor = Window_QuestShopRewards;

    Window_QuestShopRewards.prototype.initialize = function() {
        var width = Graphics.boxWidth / 2;
        var height = Graphics.boxHeight - 100;
        var x = (Graphics.boxWidth - width) / 2;
        var y = (Graphics.boxHeight - height) / 2;
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._quest = null;
        this.refresh();
    };

    /**
     * クエストを設定する。
     * @param {Game_Quest} quest クエスト
     */
    Window_QuestShopRewards.prototype.setQuest = function(quest) {
        this._quest = quest;
        this.refresh();
    };

    /**
     * 表示内容を更新する。
     */
    Window_QuestShopRewards.prototype.refresh = function() {
        this.contents.clear();
        if (this._quest) {
            // 報酬を記述する。
            var lineHeight = this.lineHeight();
            var x = 0;
            var y = 0;
            var contentsWidth = this.contentsWidth();
            if (this._quest.rewardGold()) {
                if (Imported.YEP_CoreEngine) {
                    var goldIcon = Yanfly.Icon.Gold || 0;
                    this.drawIcon(goldIcon,  x + 2, y + 2);
                }
                this.drawText(this._quest.rewardGold() + TextManager.currencyUnit, x + 40, y, contentsWidth - 40, 'right');
                y += lineHeight;
            }
            // 後は報酬アイテム描画
            var numWidth = 80;
            var nameWidth = contentsWidth - numWidth;
            this._quest.rewardItems().forEach(function(entry) {
                var item = entry[0];
                var numItems = entry[1];
                this.drawItemName(item, x, y, nameWidth);
                this.drawText('×' + numItems, x + nameWidth, y, numWidth, 'right');
                y += lineHeight;
            }, this);
        }
    };


    //------------------------------------------------------------------------------
    // Scene_QuestShop
    //    クエストの受託と報告/取り消しを行う。
    //    QuestShopで受託できるのは3つまで。
    //
    function Scene_QuestShop() {
        this.initialize.apply(this, arguments);
    }

    Scene_QuestShop.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_QuestShop.prototype.constructor = Scene_QuestShop;

    /**
     * 初期化する。
     */
    Scene_QuestShop.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    /**
     * 作成前の設定を行う。
     * @param {Array<Number>} questIds クエストID配列
     * @param {String} clerkFileName 店員画像ファイル名。店員画像が無い場合にはnull
     */
    Scene_QuestShop.prototype.prepare = function(questIds, clerkFileName) {
        var quests = [];
        for (var i = 0; i < questIds.length; i++) {
            var id = questIds[i];
            var quest = quests.find(function(q) {
                return q.id() === id;
            });
            if (!quest) {
                quests.push(new Game_Quest(id));
            }
        }

        this._quests = quests;
        this._clerkFileName = clerkFileName || '';
    };

    /**
     * シーンを作成する。
     */
    Scene_QuestShop.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createUnderTakeListWindow();
        this.createReportListWindow();
        this.createGiveupListWindow();
        this.createStatusWindow();
        this.createMessageWindow();
        this.createConfirmWindow();
        this.createRewardsWindow();
        this.loadClerkPicture();
    };

    /**
     * ショップコマンドウィンドウを作成する。
     * ショップコマンドウィンドウは右端。
     */
    Scene_QuestShop.prototype.createCommandWindow = function() {
        var x = Graphics.boxWidth - 240;
        var y = 0;
        this._commandWindow = new Window_QuestShopCommand(x, y);
        this._commandWindow.setHandler('underTake', this.commandUnderTake.bind(this));
        this._commandWindow.setHandler('report', this.commandReport.bind(this));
        this._commandWindow.setHandler('giveup', this.commandGiveup.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this._commandWindow.deactivate();
        this._commandWindow.hide();
        this.addWindow(this._commandWindow);
    };

    /**
     * 受託クエストリストウィンドウを作成する。
     */
    Scene_QuestShop.prototype.createUnderTakeListWindow = function() {
        var x = 0;
        var y = 0;
        var width = 320;
        this._underTakeListWindow = new Window_QuestShopUnderTakeList(x, y, width, this._quests);
        this._underTakeListWindow.setHandler('ok', this.onUnderTakeListWindowOk.bind(this));
        this._underTakeListWindow.setHandler('cancel', this.onUnderTakeListWindowCancel.bind(this));
        this._underTakeListWindow.deactivate();
        this._underTakeListWindow.hide();
        this.addWindow(this._underTakeListWindow);
    };

    /**
     * 報告クエスト選択ウィンドウを作成する。
     */
    Scene_QuestShop.prototype.createReportListWindow = function() {
        var x = this._underTakeListWindow.x;
        var y = this._underTakeListWindow.y;
        var width = this._underTakeListWindow.width;
        var height = this._underTakeListWindow.height;
        this._reportListWindow = new Window_QuestShopReportList(x, y, width, height);
        this._reportListWindow.setHandler('ok', this.onReportListWindowOk.bind(this));
        this._reportListWindow.setHandler('cancel', this.onReportListWindowCancel.bind(this));
        this._reportListWindow.deactivate();
        this._reportListWindow.hide();
        this.addWindow(this._reportListWindow);
    };


    /**
     * ギブアップリストウィンドウを作成する。
     */
    Scene_QuestShop.prototype.createGiveupListWindow = function() {
        var x = this._underTakeListWindow.x;
        var y = this._underTakeListWindow.y;
        var width = this._underTakeListWindow.width;
        var height = this._underTakeListWindow.height;
        this._giveupListWindow = new Window_QuestShopGiveupList(x, y, width, height);
        this._giveupListWindow.setHandler('ok', this.onGiveupListWindowOk.bind(this));
        this._giveupListWindow.setHandler('cancel', this.onGiveupListWindowCancel.bind(this));
        this._giveupListWindow.deactivate();
        this._giveupListWindow.hide();
        this.addWindow(this._giveupListWindow);
    };

    /**
     * ステータスウィンドウを作成する。
     */
    Scene_QuestShop.prototype.createStatusWindow = function() {
        var x = this._underTakeListWindow.width;
        var y = 0;
        var width = (Graphics.boxWidth - x);
        var height = Graphics.boxHeight;
        this._statusWindow = new Window_QuestStatus(x, y, width, height);
        this._statusWindow.hide();
        this.addWindow(this._statusWindow);

        this._underTakeListWindow.setStatusWindow(this._statusWindow);
        this._reportListWindow.setStatusWindow(this._statusWindow);
        this._giveupListWindow.setStatusWindow(this._statusWindow);
    };


    /**
     * メッセージウィンドウを作成する。
     * 
     * Window_Messageを使うことも考えたが、あっちはGame_Interpreterと密接にくっついているのでやめた。
     */
    Scene_QuestShop.prototype.createMessageWindow = function() {
        var y = 0;
        var numLines = 4;
        this._messageWindow = new Window_QuestShopMessage(y, numLines);
        this._messageWindow.hide();
        this.addWindow(this._messageWindow);
    };

    /**
     * 確認ウィンドウを作成する。
     */
    Scene_QuestShop.prototype.createConfirmWindow = function() {
        var x = Graphics.boxWidth - 240;
        var y = this._messageWindow.y + this._messageWindow.height;
        this._confirmWindow = new Window_QuestShopConfirm(x, y);
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        this.addWindow(this._confirmWindow);
    };

    /**
     * 報酬表示用ウィンドウを作成する
     */
    Scene_QuestShop.prototype.createRewardsWindow = function() {
        this._rewardsWindow = new Window_QuestShopRewards();
        this._rewardsWindow.setHandler('ok', this.onRewardsOk.bind(this));
        this._rewardsWindow.setHandler('cancel', this.onRewardsOk.bind(this));
        this._rewardsWindow.hide();
        this._rewardsWindow.deactivate();
        this.addWindow(this._rewardsWindow);
    };

    /**
     * 店員のイメージを作成する。
     */
    Scene_QuestShop.prototype.loadClerkPicture = function() {
        if (this._clerkFileName) {
            this._clerkBitmap = ImageManager.loadPicture(this._clerkFileName, 0);
            if (!this._clerkBitmap.isReady()) {
                // デカいファイルだと読み出しがすぐに完了しない？
                // それともupdate()で進まないとキャッシュされない？
                // いずれにせよ初回読み出しが上手くいかない奴らがいる。
                this._clerkBitmap.addLoadListener(this.addClerkSprite.bind(this));
            } else {
                this.addClerkSprite();
            }
        }
    }

    /**
     * 店員画像を追加する。
     */
    Scene_QuestShop.prototype.addClerkSprite = function() {
        console.log('clerk bitmap loaded.');
        this._clerkSprite = new Sprite();
        this._clerkSprite.bitmap = this._clerkBitmap;
        this._clerkSprite.x = Graphics.boxWidth - this._clerkBitmap.width;
        this._clerkSprite.y = Graphics.boxHeight - this._clerkBitmap.height;
        this._backgroundSprite.addChild(this._clerkSprite);
    };

    /**
     * シーンを開始する。
     */
    Scene_QuestShop.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._commandWindow.show();
        this._commandWindow.activate();
    };

    /**
     * 受けるが選択された時の処理を行う。
     */
    Scene_QuestShop.prototype.commandUnderTake = function() {
        this._underTakeListWindow.refresh();
        this._underTakeListWindow.show();
        this._statusWindow.show();
        this._underTakeListWindow.activate();
    };

    /**
     * 報告が選択された時の処理を行う。
     */
    Scene_QuestShop.prototype.commandReport = function() {
        this._reportListWindow.refresh();
        this._reportListWindow.show();
        this._statusWindow.show();
        this._reportListWindow.activate();
    };

    /**
     * ギブアップが選択された時の処理を行う。
     */
    Scene_QuestShop.prototype.commandGiveup = function() {
        this._giveupListWindow.refresh();
        this._giveupListWindow.show();
        this._statusWindow.show();
        this._giveupListWindow.activate();
    };

    /**
     * 受託クエストリストウィンドウでOKボタンが押された
     */
    Scene_QuestShop.prototype.onUnderTakeListWindowOk = function() {
        var quest = this._underTakeListWindow.item();
        var msg = '';
        if (quest.guildRank() > $gameParty.guildRank()) {
            msg += 'パーティーのギルドランクより高い難易度です。\n';
        }
        msg += quest.name() + 'を請け負いますか？';

        this._messageWindow.setText(msg);
        this._messageWindow.show();
        this._confirmWindow.setHandler('ok', this.onUnderTakeConfirmOk.bind(this));
        this._confirmWindow.setHandler('cancel', this.onUnderTakeConfirmCancel.bind(this));
        this._confirmWindow.show();
        this._confirmWindow.activate();
    };

    /**
     * 受託クエストリストウィンドウでキャンセルボタンが押された。
     */
    Scene_QuestShop.prototype.onUnderTakeListWindowCancel = function() {
        this._underTakeListWindow.hide();
        this._statusWindow.hide();
        this._commandWindow.activate();
    };

    /**
     * 受託確認でOK操作された。
     */
    Scene_QuestShop.prototype.onUnderTakeConfirmOk = function() {
        var quest = this._underTakeListWindow.item();
        $gameParty.addQuest(new Game_Quest(quest.id())); // 受託クエスト追加
        this._underTakeListWindow.refresh();
        this._messageWindow.hide();
        this._confirmWindow.hide();
        this._underTakeListWindow.activate();
    };
    /**
     * 受託確認でキャンセル操作された。
     */
    Scene_QuestShop.prototype.onUnderTakeConfirmCancel = function() {
        this._messageWindow.hide();
        this._confirmWindow.hide();
        this._underTakeListWindow.activate();
    };


    /**
     * 報告クエスト選択ウィンドウでOK操作されたときの処理を行う。
     */
    Scene_QuestShop.prototype.onReportListWindowOk = function() {
        var quest = this._reportListWindow.item();
        var questData = quest.questData();
        if (questData.qtype === TWLD.Quest.QTYPE_COLLECTION) {
            // 採取の場合、対象アイテムを減らす。
            var itemId = questData.achieve[0];
            var itemCount = questData.achieve[1];
            var correctItem = $dataItems[itemId];
            $gameParty.loseItem(correctItem, itemCount);
        }
        if (TWLD.Quest.SuccessSe.name) {
            AudioManager.playSe(TWLD.Quest.SuccessSe);
        }
        $gameParty.removeQuest(quest.id());

        // 報酬加算処理
        this.applyRewards(quest);
        this._rewardsWindow.setQuest(quest);
        this._rewardsWindow.show();
        this._rewardsWindow.activate();
    };

    /**
     * 報告クエスト選択ウィンドウでキャンセル操作されたときの処理を行う。
     */
    Scene_QuestShop.prototype.onReportListWindowCancel = function() {
        this._statusWindow.hide();
        this._reportListWindow.hide();
        this._commandWindow.activate();
    };

    /**
     * 報酬表示ウィンドウでOKまたはキャンセル操作されたときに通知を受け取る。
     */
    Scene_QuestShop.prototype.onRewardsOk = function() {
        this._rewardsWindow.hide();
        this._rewardsWindow.deactivate();
        this._reportListWindow.refresh();
        this._reportListWindow.activate();
    };



    /**
     * ギブアップリストウィンドウでOK操作されたときの処理を行う。
     */
    Scene_QuestShop.prototype.onGiveupListWindowOk = function() {
        var quest = this._giveupListWindow.item();

        var msg = quest.name() + 'を破棄しますか？\n';
        var penaltyGold = Math.min(quest.penaltyGold(), $gameParty.gold());
        msg += 'ペナルティとして' + penaltyGold + TextManager.currencyUnit + '失います。';
        this._messageWindow.setText(msg);
        this._messageWindow.show();
        this._confirmWindow.setHandler('ok', this.onGiveupConfirmOk.bind(this));
        this._confirmWindow.setHandler('cancel', this.onGiveupConfirmCancel.bind(this));
        this._confirmWindow.show();
        this._confirmWindow.activate();
    };


    /**
     * ギブアップリストウィンドウでキャンセル操作されたときの処理を行う。
     */
    Scene_QuestShop.prototype.onGiveupListWindowCancel = function() {
        this._statusWindow.hide();
        this._giveupListWindow.hide();
        this._commandWindow.activate();
    };

    /**
     * ギブアップ確認でOK操作された。
     */
    Scene_QuestShop.prototype.onGiveupConfirmOk = function() {
        var quest = this._giveupListWindow.item();
        var penaltyGold = Math.min(quest.penaltyGold(), $gameParty.gold());

        if (TWLD.Quest.FailSe.name) {
            AudioManager.playSe(TWLD.Quest.FailSe);
        }

        // ばっきん
        if (penaltyGold) {
            $gameParty.loseGold(penaltyGold);
        }
        $gameParty.removeQuest(quest.id());
        this._messageWindow.hide();
        this._confirmWindow.hide();
        this._giveupListWindow.refresh();
        this._giveupListWindow.activate();
    };

    /**
     * ギブアップ確認ウィンドウでキャンセル操作された。
     */
    Scene_QuestShop.prototype.onGiveupConfirmCancel = function() {
        this._messageWindow.hide();
        this._confirmWindow.hide();
        this._giveupListWindow.activate();
    };

    /**
     * 報酬を適用する。
     * @param {Game_Quest} quest クエスト
     */
    Scene_QuestShop.prototype.applyRewards = function(quest) {
        // ゴールド加算
        if (quest.rewardGold() > 0) {
            $gameParty.gainGold(quest.rewardGold());
        }
        // アイテム加算
        var rewardItems = quest.rewardItems();
        rewardItems.forEach(function(entry) {
            $gameParty.gainItem(entry[0], entry[1]);
        });

        // ギルドEXP加算
        var questGuildRank = quest.guildRank();
        var guildExp = quest.guildExp();
        $gameParty.allMembers().forEach(function(actor) {
            if (questGuildRank === 0) {
                // クエストに適正ランクが指定されていない場合には
                // Expをそのまま加算する。
                actor.gainGuildExp(guildExp);
            } else {
                var rate = 1.0 + (questGuildRank - actor.guildRank()) * 0.5;
                // アクターのギルドランクより、クエストの適正ランクが低い。
                // 加算されるギルドEXPは減る。
                var exp = Math.min(Math.floor(guildExp * rate), 1);
                actor.gainGuildExp(exp);
            }
        });
    };

    //------------------------------------------------------------------------------
    // プラグインコマンドの実装
    // プラグインON/OFF
    //
    TWLD.Quest.Game_interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        var re = command.match(/^TWLD\.Quest\.(.*)/);
        if (re !== null) {
            switch (re[1]) {
                case 'Add':
                    this.addQuest(args);
                    break;
                case 'SetDone':
                    var id = args[0] || '';
                    $gameParty.doneQuest(id);
                    break;
                case 'OpenShop':
                    this.openQuestShop(args);
                    break;
            }
        } else {
            TWLD.Quest.Game_interpreter_pluginCommand.call(this, command, args);
        }
    };

    /**
     * クエストを追加する。
     * @param {Array<string>} args 引数
     */
    Game_Interpreter.prototype.addQuest = function(args) {
        var id = Number(args[0]);
        if (!id) {
            return;
        }

        if ($gameParty.isTryingQuest(id)) {
            return;
        }
        
        $gameParty.addQuest(new Game_Quest(id));
    };
    /**
     * クエストショップを開く
     * @param {Array<string>} args 引数
     */
    Game_Interpreter.prototype.openQuestShop = function(args) {
        var questIds = [];
        args[0].split(',').forEach(function(s) {
            var re;
            if ((re = s.match(/(\d+)/)) !== null) {
                questIds.push(Number(re[1]));
            } else if ((re = s.match(/(\d+)-(\d+)/)) !== null) {
                var begin = Number(re[1]);
                var end = Number(re[2]);
                for (var i = begin; i <= end; i++) {
                    questIds.push(i);
                }
            }
        });
        var clerkFileName = args[1] || '';
        SceneManager.push(Scene_QuestShop);
        SceneManager.prepareNextScene(questIds, clerkFileName);
    };


})();

