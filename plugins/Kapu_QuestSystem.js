/*:ja
 * @target MZ 
 * @plugindesc クエストシステム
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command acceptQuest
 * @text クエストを受ける
 * @desc パーティーが受託しているクエストに指定IDのクエストを追加します。
 * 
 * @arg variableId
 * @text クエストID(変数指定)
 * @desc クエストID(変数指定)。1以上の値を指定した場合に有効。
 * @type variable
 * @default 0
 * 
 * @arg id
 * @text クエストID
 * @desc クエストのID(変数指定がされていない場合のみ有効)
 * @type number
 * @default 0
 * 
 * @command reportQuest
 * @text クエストを完了報告する
 * @desc クエストを完了報告し、受託中リストから削除する。受けていない場合には何もしない。
 * 
 * @arg variableId
 * @text クエストID(変数指定)
 * @desc クエストID(変数指定)。1以上の値を指定した場合に有効。
 * @type variable
 * @default 0
 * 
 * @arg id
 * @text クエストID
 * @desc クエストのID(変数指定がされていない場合のみ有効)
 * @type number
 * @default 0
 * 
 * @arg loseCollectItems
 * @text 採取アイテムを減らす
 * @desc 採取が条件に含まれている場合に、採取アイテムを減らす場合はtrue。数量が足りない場合には、持っている分だけ減らす。
 * @type boolean
 * @default true
 * 
 * @arg getRewards
 * @text 報酬を得る
 * @desc 報酬を得る場合にはtrue, 取得しない場合にはfalse
 * @type boolean
 * @default true
 * 
 * @commad cancelQuest
 * @text クエストをキャンセルする
 * @desc クエストをキャンセルし、受託中リストから削除する。受けていない場合には何もしない。
 * 
 * @arg variableId
 * @text クエストID(変数指定)
 * @desc クエストID(変数指定)。1以上の値を指定した場合に有効。
 * @type variable
 * @default 0
 * 
 * @arg id
 * @text クエストID
 * @desc クエストのID(変数指定がされていない場合のみ有効)
 * @type number
 * @default 0
 * 
 * @arg payPenalty
 * @text ペナルティを払う
 * @desc キャンセル時にペナルティを払う場合にはtrue, 払わない場合にはfalse.
 * @type boolean
 * @default true
 * 
 * @arg setQuestDone
 * @text クエストを完了にする。
 * @desc 指定クエストを完了状態にする。
 * 
 * @arg variableId
 * @text クエストID(変数指定)
 * @desc クエストID(変数指定)。1以上の値を指定した場合に有効。
 * @type variable
 * @default 0
 * 
 * @arg id
 * @text クエストID
 * @desc クエストのID(変数指定がされていない場合のみ有効)
 * @type number
 * @default 0
 * 
 * 
 * @param guildRanks
 * @text ギルドランク
 * @desc ギルドランクテーブル
 * @type struct<GuildRankInfo>[]
 * @default [{"name":"-","iconIndex":"0","exp":"0"},{"name":"G","iconIndex":"0","exp":"1"},{"name":"F","iconIndex":"0","exp":"100"},{"name":"E","iconIndex":"0","exp":"300"},{"name":"D","iconIndex":"0","exp":"600"},{"name":"C","iconIndex":"0","exp":"1000"},{"name":"B","iconIndex":"0","exp":"2000"},{"name":"A","iconIndex":"0","exp":"5000"},{"name":"S","iconIndex":"0","exp":"10000"},{"name":"SS","iconIndex":"0","exp":"30000"},{"name":"SSS","iconIndex":"0","exp":"50000"},]
 * 
 * @param maxGuildExp
 * @text 最大ギルドEXP
 * @desc 1アクターあたりの最大ギルドEXP
 * @type number
 * @default 99999
 * 
 * 
 * 
 * @param textQuestTitleSubjugation
 * @text 討伐クエストタイトル書式
 * @desc 討伐クエストタイトル書式。%1にエネミー名が入る。クエスト名未指定時のみ有効
 * @type string
 * @default %1の討伐
 * 
 * @param textQuestDescSubjugation
 * @text 討伐クエスト詳細の書式
 * @desc 討伐クエスト詳細書式。%1にエネミー名が入る。クエスト詳細未指定時のみ有効
 * @type string
 * @default %1を討伐してください。
 * 
 * @param textQuestAchiveSubjugation
 * @text 討伐クエスト達成条件の書式
 * @desc 討伐クエスト達成条件の書式。%1にエネミー名、%2に数が入る。クエスト達成条件テキスト未指定時のみ有効。
 * @type string
 * @default %1を%2体討伐
 * 
 * @param textQuestTitleCollection
 * @text 採取クエストタイトル書式
 * @desc 採取クエストタイトル書式。%1に採取アイテム名が入る。クエスト名未指定時のみ有効
 * @type string
 * @default %1の採取
 * 
 * 
 * @param textQuestDescCollection
 * @text 採取クエスト詳細書式
 * @desc 採取クエスト詳細書式。%1に採取アイテム名が入る。クエスト詳細未指定時のみ有効。
 * @type string
 * @default %1を採取してください。
 * 
 * @param textQuestAchiveCollection
 * @text 採取クエスト達成条件の書式
 * @desc 採取クエスト達成条件の書式。%1に採取アイテム名、%2に数が入る。クエスト達成条件テキスト未指定時のみ有効。
 * @type string
 * @default %1を%2個収集する。
 * 
 * 
 * @help 
 * クエストシステム。
 * 
 * TODO : クエストマネージャ(QuestManager)を用意した方がいいのではないか。
 * TODO : 受託時のカスタム処理/完了時のカスタム処理を追加する。受けたときにスイッチをOFFにしたりしたいよね。
 * TODO : 完了時のコモンイベント呼び出しなど。
 * TODO : ペナルティの内容
 * TODO : 達成条件。＆で複数指定できるようにしたい。ORはやらない。
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
 * アクター
 *   <guildRank:rank#>
 *     初期ギルドランクをrank#とする。
 *   <guildExp:exp#>
 *     初期ギルドEXPをexp#とする。guildRankタグを未指定時のみ有効。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/*~struct~GuildRankInfo:
 * 
 * @param name
 * @text ギルドランク名
 * @desc ギルドランク名として表示するラベル
 * @type string
 * 
 * @param iconIndex
 * @text アイコンインデックス
 * @desc ギルドランクを表すアイコン番号。
 * @type number
 * @default 0
 * 
 * @param exp
 * @text ギルドランクEXP
 * @desc ギルドランクに到達するためのEXP
 * @type number
 * 
 * @param note
 * @text 注釈
 * @desc 注釈データ
 * @type string
 */
/**
 * Questデータ
 * Quests.json展開先
 */
$dataQuests = null;
/**
 * 動的に変わるQuestデータ
 * Game_Questsが格納される
 */
$gameQuests = null;

/**
 * 新しいGame_Questデータを構築する。
 * 
 * @param {number} id クエストID
 */
function Game_Quest() {
    this.initialize(...arguments);
}




(() => {
    const pluginName = "Kapu_QuestSystem";
    const parameters = PluginManager.parameters(pluginName);
    const maxGuildExp = Math.max(0, Number(parameters["maxGuildExp"]) || 999999);
    const textQuestTitleSubjugation = parameters["textQuestTitleSubjugation"] || "Subjugation %1";
    const textQuestDescSubjugation = parameters["textQuestDescSubjugation"] || "Please %1 to death.";
    const textQuestAchiveSubjugation = parameters["textQuestAchiveSubjugation"] || "Subjugation %1 x %2";
    const textQuestTitleCollection = parameters["textQuestTitleCollection"] || "Collect %1";
    const textQuestDescCollection = parameters["textQuestDescCollection"] || "Please collect %1.";
    const textQuestAchiveCollection = parameters["textQuestAchiveCollection"] || "Collect %1 x %2";

    DataManager._guildRanks = [];
    
    try {
        const ranks = JSON.parse(parameters["guildRanks"] || "[]").map(str => JSON.parse(str));
        for (let rank of ranks) {
            rank.exp = Math.round(Number(rank.exp) || 0).clamp(0, maxGuildExp);
            rank.iconIndex = Math.round(Number(rank.iconIndex) || 0);
            if (rank.note) {
                DataManager.extractMetadata(rank);
            } else {
                rank.meta = {};
            }
            DataManager._guildRanks.push(rank);
        }
        DataManager._guildRanks.sort((a, b) => a.exp - b.exp);
        let rank = 0;
        for (const rankInfo of DataManager._guildRanks) {
            rankInfo.rank = rank;
            rank++;
        }
    }
    catch (e) {
        console.log(e);
    }


    /**
     * クエストIDを得る。
     * 
     * @param {object} args コマンド引数
     * @returns {number} ID
     */
    const _getQuestId = function(args) {
        const variableId = Number(args.variableId) || 0;
        if (variableId > 0) {
            const value = $gameVariables.value(variableId);
            if ((value > 0) && (value < $dataQuests.length)) {
                return value;
            }
        }
        const id = Number(args.id) || 0;
        return ((id > 0) && (id < $dataQuests.length)) ? id : 0;
    };

    PluginManager.registerCommand(pluginName, "acceptQuest", args => {
        const id = _getQuestId(args);
        if (id > 0) {
            if (!$gameParty.isTryingQuest(id)) {
                $gameParty.addQuest(new Game_Quest(id));
            }
        }
    });

    PluginManager.registerCommand(pluginName, "reportQuest", args => {
        const id = _getQuestId(args);
        const loseCollectItems = (args.loseCollectItems === undefined)
                ? true : (args.loseCollectItems === "true");
        const getRewards = (args.getRewards === undefined)
                ? true : (args.getRewards === "true");
        if (id > 0) {
            $gameParty.reportQuest(id, loseCollectItems, getRewards);
        }

    });

    PluginManager.registerCommand(pluginName, "cancelQuest", args => {
        const id = _getQuestId(args);
        const payPenalty = (args.payPenalty === undefined)
                ? true : (args.payPenalty === "true");
        if (id > 0) {
            $gameParty.giveupQuest(id, payPenalty);
        }

    });

    PluginManager.prototype.registerCommand(pluginName, "setQuestDone", args => {
        const id = _getQuestId(args);
        if (id > 0) {
            $gameParty.doneQuest(id);
        }
    });

    //------------------------------------------------------------------------------
    // DataManager
    DataManager._databaseFiles.push({ name:"$dataQuests", src:"Quests.json" });

    const _DataManager_createGameObjects = DataManager.createGameObjects;
    /**
     * 必要なオブジェクトを構築する。
     */
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $gameQuests = new Game_Quests();
    };

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;

    /**
     * セーブデータに入れるデータを構築する。
     * 
     * @returns {Dictionary} 保存するコンテンツ
     */
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.quests = $gameQuests;
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    /**
     * セーブデータから必要なコンテンツを展開する。
     * 
     * @param {Dictionary} contents コンテンツ
     */
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, ...arguments);
        const quests = contents.quests;
        if (quests) {
            $gameQuests = quests;
        }
    };    


    /**
     * ギルドランク情報を得る。
     * 
     * @param {number} no インデックス番号
     * @returns {GuildRankInfo} ギルドランク情報。noが範囲外の場合にはnull.
     */
    DataManager.guildRank = function(no) {
        if ((no >= 0) || (no < this._guildRanks.length)) {
            return this._guildRanks[no];
        } else {
            return null;
        }
    }
    /**
     * expに対応したギルドランク情報を得る。
     * 
     * @param {number} exp 経験値
     * @returns {GuildRankInfo} ギルドランク情報。該当エントリが無い場合には一番低いランクが返る。
     */
    DataManager.guildRankByExp = function(exp) {
        for (let i = this._guildRanks.length - 1; i >= 0; i--) {
            const entry = this._guildRanks[i];
            if (exp >= entry.exp) {
                return entry;
            }
        }

        return this._guildRanks[0];
    };
    //------------------------------------------------------------------------------
    // BattleManager
    const _BattleManager_endBattle = BattleManager.endBattle;
    /**
     * 戦闘終了処理をする。
     * 
     * @param {number} result 結果(0:勝利, 1:逃走などで終了。, 2:敗北)
     */
    BattleManager.endBattle = function(result) {
        // 倒したえねみーを東坡数加算する。
        $gameTroop.deadMembers().forEach(function(enemy) {
            $gameParty.addSubjugationTarget(enemy);
        });

        _BattleManager_endBattle.call(this, result);
    };
    //------------------------------------------------------------------------------
    // Game_Actorの変更
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._guildExp = 0;
    };
    const _Game_Actor_setup = Game_Actor.prototype.setup;

    /**
     * このアクターを初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const actor = this.actor();
        if (actor.meta.guildRank) {
            const guildRank = Number(actor.meta.guildRank) || 0;
            const rankInfo = DataManager.guildRank(guildRank);
            this._guildExp = rankInfo.exp;
        } else if (actor.meta.guildExp) {
            this._guildExp = Math.max(0, Math.round(Number(actor.meta.guildExp) || 0));
        }
    };
    /**
     * アクターのギルドEXPを得る。
     * 
     * @returns {number} ギルドEXP
     */
     Game_Actor.prototype.guildExp = function() {
        return this._guildExp;
    };

    /**
     * EXPを加算する。
     * 
     * Note: このメソッドは単純加算するのみ。適正ランク/不適正ランクなどによる、
     *       倍率調整は呼び出し元で実施することを想定する。。
     * 
     * @param {number} gainExp 加算する量
     */
    Game_Actor.prototype.gainGuildExp = function(gainExp) {
        gainExp = Math.max(0, gainExp || 0);
        this._guildExp = (this._guildExp + gainExp).clamp(0, maxGuildExp);
    };

    /**
     * アクターのギルドランクを得る。
     * 
     * @returns {number} 
     */
    Game_Actor.prototype.guildRank = function() {
        const rankInfo = DataManager.guildRankByExp(this._guildExp);
        return rankInfo.rank;
    };

    /**
     * ギルドランク名を得る。
     * @returns {string} ギルドランク名
     */
    Game_Actor.prototype.guildRankName = function() {
        const rankInfo = DataManager.getGuildRankEntryByExp(this._guildExp);
        return rankInfo.name;
    };
    //------------------------------------------------------------------------------
    // Game_Quest

    Game_Quest.STATUS_TRYING = 0;
    Game_Quest.STATUS_DONE = 1;

    Game_Quest.QTYPE_SUBJUGATION = 1; // 討伐依頼, achieve[0]エネミーID, acieve[1]が数量
    Game_Quest.QTYPE_COLLECTION = 2; // 採取依頼, achieve[0]がアイテムID, achieve[1]が数量
    Game_Quest.QTYPE_EVENT = 3; // イベント依頼。achieve[0]がスイッチ番号

    /**
     * 初期化する。
     * 
     * @param {number} id クエストID
     */
     Game_Quest.prototype.initialize = function(id) {
        this._id = id;
        this._status = Game_Quest.STATUS_TRYING;
        this._value = 0; // 討伐数など。
    };

    /**
     * クエストIDを得る。
     * 
     * @returns {number} クエストID
     */
    Game_Quest.prototype.id = function() {
        return this._id;
    };

    /**
     * 経過を得る。
     * 
     * @returns {number} 現在値
     */
    Game_Quest.prototype.getElapse = function() {
        const questData = this.questData();
        if (questData) {
            if (questData.qtype === Game_Quest.QTYPE_SUBJUGATION) {
                return this._value;
            } else if (questData.qtype === Game_Quest.QTYPE_COLLECTION) {
                const itemId = questData.achieve[0];
                const item = $dataItems[itemId];
                return this.countPartyItem(item);
            }
        }
        return 0;
    };

    /**
     * itemで指定されたアイテムの数を数える。
     * YEP_ItemCoreで採取対象が個別アイテムの場合、正しくカウントできない問題があったため用意した。
     * 
     * @param {object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @returns {number} アイテムの数
     */
    Game_Quest.prototype.countPartyItem = function(baseItem) {
        return $gameParty.numItems(baseItem);
    };


    /**
     * トータルカウントを得る。
     * 
     * ・討伐クエストの場合：総討伐数
     * ・採取クエストの場合：総採取数
     * ・上記以外：0
     * 
     * @returns {number} トータルカウント
     */
    Game_Quest.prototype.getTotal = function() {
        const questData = this.questData();
        if (questData) {
            if (questData.qtype === Game_Quest.QTYPE_SUBJUGATION) {
                return questData.achieve[1];
            } else if (questData.qtype === Game_Quest.QTYPE_COLLECTION) {
                return questData.achieve[1];
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    };


    /**
     * クエストデータを得る。
     * 
     * @returns {DataQuest} クエストデータ
     */
    Game_Quest.prototype.questData = function() {
        return $dataQuests[this._id];
    };

    /**
     * このクエストの適正ギルドランクを得る。
     * 
     * @returns {number} ギルドランク
     */
    Game_Quest.prototype.guildRank = function() {
        const questData = this.questData();
        return (questData) ? questData.guildRank : 0;
    };

    /**
     * このクエストのギルドEXPを得る。
     * 
     * @returns {number} ギルドEXP
     */
    Game_Quest.prototype.guildExp = function() {
        const questData = this.questData();
        return (questData) ? questData.guildExp : 0;
    };

    /**
     * クエストの状態を取得する。
     * 
     * @returns {number} 状態(Game_Quest.STATUS_xxxx が返る。)
     */
    Game_Quest.prototype.status = function() {
        return this._status;
    };

    /**
     * 討伐対象かどうかを判定する。
     * 
     * @param {number} enemyId エネミーID
     * @returns {boolean} 討伐対象の場合にはtrue, それ以外はfalse
     */
    Game_Quest.prototype.isSubjugationTarget = function(enemyId) {
        const questData = this.questData();
        if (questData) {
            if ((questData.qtype === Game_Quest.QTYPE_SUBJUGATION)
                    && (questData.achieve[0] === enemyId)) {
                return true;
            }
        }
        return false;
    };

    /**
     * 討伐数を加算する。
     * 
     * @param {number} enemyId エネミーID
     */
    Game_Quest.prototype.incrementSubjugationTarget = function(enemyId) {
        const questData = this.questData();
        if (questData) {
            if ((questData.qtype === Game_Quest.QTYPE_SUBJUGATION)
                    && (questData.achieve[0] === enemyId)) {
                this._value = (this._value + 1).clamp(0, questData.achieve[1]);
            }
        }
    };

    /**
     * 受託条件を取得する。
     * 
     * @returns {string} 受託条件
     */
    Game_Quest.prototype.entrustCondition = function() {
        const questData = this.questData();
        return (questData) ? questData.entrustCondition : "";
    };

    /**
     * クエスト名を得る。
     * 
     * @returns {string} クエスト名
     */
    Game_Quest.prototype.name = function() {
        const questData = this.questData();
        if (questData) {
            if (questData.name) {
                return questData.name;
            } else {
                // 自動生成できるなら生成する。
                if (questData.qtype === Game_Quest.QTYPE_SUBJUGATION) {
                    const enemyName = this.targetName();
                    if (enemyName) {
                        return textQuestTitleSubjugation.format(enemyName);
                    }
                } else if (questData.qtype === Game_Quest.QTYPE_COLLECTION) {
                    const itemName = this.targetName();
                    if (itemName) {
                        return textQuestTitleCollection.format(itemName);
                    }
                }
            }
        }
        return "";
    };

    /**
     * 説明文を得る。
     * 
     * @returns {string} 説明文
     */
    Game_Quest.prototype.description = function() {
        const questData = this.questData();
        if (questData) {
            if (questData.description) {
                return questData.description;
            } else {
                // 自動生成できるなら生成する。
                if (questData.qtype === Game_Quest.QTYPE_SUBJUGATION) {
                    const enemyName = this.targetName();
                    if (enemyName) {
                        return textQuestDescSubjugation.format(enemyName);
                    }
                } else if (questData.qtype === Game_Quest.QTYPE_COLLECTION) {
                    const itemName = this.targetName();
                    if (itemName) {
                        return textQuestDescCollection.format(itemName);
                    }
                }
            }
        }
        return "?";
    };

    /**
     * 達成条件メッセージを得る。
     * 
     * @returns {String} 達成条件メッセージ
     */
    Game_Quest.prototype.achieveText = function() {
        const questData = this.questData();
        if (questData) {
            if (questData.achieveMsg) {
                return questData.achieveMsg;
            } else {
                // 自動生成できるなら生成する。
                if (questData.qtype === Game_Quest.QTYPE_SUBJUGATION) {
                    const enemyName = this.targetName();
                    if (enemyName) {
                        const count = this.getTotal();
                        return textQuestAchiveSubjugation.format(enemyName, count);
                    }
                } else if (questData.qtype === Game_Quest.QTYPE_COLLECTION) {
                    const itemName = this.targetName();
                    if (itemName) {
                        const itemCount = this.getTotal();
                        return textQuestAchiveCollection.format(itemName, itemCount);
                    }
                }
            }
        }
        return "";
    };

    /**
     * 報酬アイテム一覧を得る。
     * 
     * @returns {Array<[object,number]>} 報酬アイテム一覧。objectはDataItem/DataWeapon/DataArmorのいずれかが入る。
     */
    Game_Quest.prototype.rewardItems = function() {
        const items = [];
        const questData = this.questData();
        if (questData) {
            questData.rewardItems.forEach(function(entry) {
                const item = this.getRewardItem(entry);
                const num = entry.value;
                if ((items != null) && (num > 0)) {
                    items.push([item, num]);
                }
            }, this);
        }
        return items;
    };

    /**
     * 報酬アイテムを得る。
     * 
     * @param {RewardItem}} entry 報酬アイテムエントリ
     * @returns {object} アイテム(DataItem/DataWeapon/DataArmor)
     */
     Game_Quest.prototype.getRewardItem = function(entry) {
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
     * 報酬テキストを取得する。
     * 
     * @returns {string} 報酬テキスト
     */
    Game_Quest.prototype.rewardText = function() {
        const questData = this.questData();
        if (questData) {
            if (questData.rewardMsg) {
                return questData.rewardMsg;
            } else {
                let msg = "";
                if (questData.rewardGold) {
                    msg += questData.rewardGold + TextManager.currencyUnit + "\n";
                }
                return this.rewardItems().reduce(function(prev, entry) {
                    if (prev) {
                        return prev + "\n" + entry[0].name + "\u00d7" + entry[1];
                    } else {
                        return entry[0].name + "\u00d7" + entry[1];
                    }
                }, msg);
            }
        }

        return "";
    };

    /**
     * ターゲット名を得る。
     * 
     * @returns {string} ターゲット名
     */
    Game_Quest.prototype.targetName = function() {
        const questData = this.questData();
        if (questData.qtype === Game_Quest.QTYPE_SUBJUGATION) {
            const enemyId = questData.achieve[0];
            const enemy = $dataEnemies[enemyId];
            return enemy ? enemy.name : "";
        } else if (questData.qtype === Game_Quest.QTYPE_COLLECTION) {
            const itemId = questData.achieve[0];
            const item = $dataItems[itemId];
            return item ? item.name : "";
        } else {
            return "";
        }
    };

    /**
     * 状態を更新する。
     */
    Game_Quest.prototype.update = function() {
        const questData = this.questData();
        if (questData) {
            if (questData.qtype === GameQuest.QTYPE_SUBJUGATION) {
                this._status = (this.getElapse() >= this.getTotal())
                        ? Game_Quest.STATUS_DONE : Game_Quest.STATUS_TRYING;
            } else if (questData.qtype === Game_Quest.QTYPE_COLLECTION) {
                this._status = (this.getElapse() >= this.getTotal())
                        ? Game_Quest.STATUS_DONE : Game_Quest.STATUS_TRYING;
            } else if (questData.qtype === Game_Quest.QTYPE_EVENT) {
                const switchId = questData.achieve[0];
                if (switchId) {
                    this._status = $gameSwitches.value(switchId)
                            ? Game_Quest.STATUS_DONE : Game_Quest.STATUS_TRYING;
                }
            }
        }
    };

    /**
     * 強制的に達成状態にする。
     * 
     * 討伐数加算。
     * 所持数加算。
     */
    Game_Quest.prototype.done = function() {
        this._status = Game_Quest.STATUS_DONE;
        const questData = this.questData();
        if (questData) {
            if (questData.qtype === Game_Quest.QTYPE_SUBJUGATION) {
                this._value = this.getTotal();
            } else if (questData.qtype === Game_Quest.QTYPE_COLLECTION) {
                const lackCount = this.getTotal() - this.getElapse();
                if (lackCount > 0) {
                    const itemId = questData.achieve[0];
                    const item = $dataItems[itemId];
                    $gameParty.gainItem(item, lackCount);
                }
            } else if (questData.qtype === Game_Quest.QTYPE_EVENT) {
                const switchId = questData.achieve[0];
                if (switchId) {
                    $gameSwitches.setValue(switchId, true);
                }
            }
        }
    };

    /**
     * 達成済みかどうかを取得する。
     * 
     * @returns {boolean} 達成済みの場合にはtrue, それ以外はfalse
     */
    Game_Quest.prototype.isDone = function() {
        return this._status === Game_Quest.STATUS_DONE;
    };

    /**
     * ランク名を得る。
     * 
     * @returns {string} ランク名
     */
    Game_Quest.prototype.rankName = function() {
        const questData = this.questData();
        if (questData) {
            const rankInfo = DataManager.guildRank(questData.guildRank);
            if (rankInfo) {
                return rankInof.name;
            }
        }
        return "";
    };

    /**
     * 報酬金額を得る。
     * 
     * @returns {number} 報酬金額
     */
    Game_Quest.prototype.rewardGold = function() {
        const questData = this.questData();
        return (questData) ? questData.rewardGold : 0;
    };

    /**
     * キャンセル時のペナルティ金額を得る。
     * 
     * @returns {number} ペナルティ金額
     */
    Game_Quest.prototype.penaltyGold = function() {
        const questData = this.questData();
        if (questData) {
            if (questData.rewardGold) {
                // 報酬金額が設定されている
                return Math.round(questData.rewardGold * this.penaltyGoldRate());
            } else if (questData.guildRank) {
                // ギルドランクが指定されている。
                const rankInfo = DataManager.guildrank(questData.guildRank);
                return Math.floor(rankInfo.exp * this.penaltyGoldRate());
            }
        }
        return 0;
    };

    /**
     * ペナルティー金額レートを得る。
     * 
     * @returns {number} ペナルティ金額レート
     */
    Game_Quest.prototype.penaltyGoldRate = function() {
        return 0.3;
    };

    //------------------------------------------------------------------------------
    // Game_Party
    const _Game_Party_initialize = Game_Party.prototype.initialize;
    /**
     * Game_Partyを初期化する。
     */
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.call(this);
        this._quests = []; // 受領中のクエスト
    };


    /**
     * クエストが受託可能かどうかを判定する。
     * 
     * @param {Game_Quest} quest クエスト
     * @returns {boolean} 受託可能な場合にはtrue, それ以外はfalse.
     */
    Game_Party.prototype.canAcceptQuest = function(quest) {
        const condition = quest.entrustCondition();
        if (condition) {
            const guildRank = $gameParty.guildRank(); // eslint-disable-line no-unused-vars
            try {
                return eval(condition);
            }
            catch (e) {
                console.log(e);
                return false;
            }
        } else {
            return true; // 条件設定なし。
        }

    };

    /**
     * このパーティーのギルドランクを得る。
     * 
     * @returns {number} ギルドランク
     */
    Game_Party.prototype.guildRank = function() {
        const members = this.allMembers();
        const totalRank = members.reduce(function(prev, member) {
            return prev + member.guildRank();
        }, 0);
        return Math.floor(totalRank / members.length);
    };

    /**
     * 新しいクエストを請け負う。
     * 
     * @param {number} quest クエスト
     */
    Game_Party.prototype.addQuest = function(quest) {
        this._quests.push(quest); 
        quest.update();
    };

    /**
     * クエストを削除する。
     * 
     * @param {number} id クエストID
     */
    Game_Party.prototype.removeQuest = function(id) {
        for (let i = 0; i < this._quests.length; i++) {
            if (this._quests[i].id() === id) {
                this._quests.splice(i, 1);
                return;
            }
        }
    };

    /**
     * idで指定されるクエストの採取アイテムを減らす
     * 
     * @param {number} id クエストID
     */
    Game_Party.prototype.loseQuestCollectItems = function(id) {
        const quest = this._quests.find(q => q.id === id);
        if (quest) {
            const questData = quest.questData();
            if (questData.qtype === Game_Quest.QTYPE_COLLECTION) {
                // 採取の場合、対象アイテムを減らす。
                const itemId = questData.achieve[0];
                const itemCount = questData.achieve[1];
                const correctItem = $dataItems[itemId];
                $gameParty.loseItem(correctItem, itemCount, true);
            }
        }
    };

    /**
     * クエスト報酬を得る。
     * 
     * @param {number} id クエストID
     */
    Game_Party.prototype.gainQuestRewards = function(id) {
        const quest = this._quests.find(q => q.id === id);
        if (quest) {
            if (quest.rewardGold() > 0) {
                this.gainGold(quest.rewardGold());
            }
            // アイテム加算
            const rewardItems = quest.rewardItems();
            rewardItems.forEach(function(entry) {
                $gameParty.gainItem(entry[0], entry[1]);
            });
    
            // ギルドEXP加算
            const questGuildRank = quest.guildRank();
            const guildExp = quest.guildExp();
            $gameParty.allMembers().forEach(function(actor) {
                if (questGuildRank === 0) {
                    // クエストに適正ランクが指定されていない場合には
                    // Expをそのまま加算する。
                    actor.gainGuildExp(guildExp);
                } else {
                    const rate = 1.0 + (questGuildRank - actor.guildRank()) * 0.5;
                    // アクターのギルドランクより、クエストの適正ランクが低い。
                    // 加算されるギルドEXPは減る。
                    const exp = Math.min(Math.floor(guildExp * rate), 1);
                    actor.gainGuildExp(exp);
                }
            });
        }
    };

    /**
     * クエストを報告する。
     * 
     * Note: 完了状態かどうかは判定されていないしない。
     * 
     * @param {number} id クエストID
     * @param {number} loseCollectItems 収集アイテムを減らす場合にはtrue
     * @param {boolean} getRewards 報酬を加算する場合にはtrue, 加算しない場合にはfalse
     */
    Game_Party.prototype.reportQuest = function(id, loseCollectItems, getRewards) {
        if (this.isTryingQuest(id)) {
            if (loseCollectItems) {
                this.loseQuestCollectItems(id);
            }
            if (getRewards) {
                this.gainQuestRewards(id);
            }
            this.removeQuest(id);
        }

    };

    /**
     * クエストペナルティを支払う
     * 
     * @param {number} id クエストID
     */
    Game_Party.prototype.payQuestPenalty = function(id) {
        const quest = this._quests.find(q => q.id === id);
        if (quest) {
            const penaltyGold = Math.min(quest.penaltyGold(), $gameParty.gold());
            if (penaltyGold) {
                this.loseGold(penaltyGold);
            }
        }
    };

    /**
     * idで指定されるクエストをギブアップする。
     * 
     * @param {number} id クエストID
     * @param {boolean} payPenalty ペナルティを払うかどうか
     */
    Game_Party.prototype.giveupQuest = function(id, payPenalty) {
        if (this.isTryingQuest(id)) {
            if (payPenalty) {
                this.payQuestPenalty();
            }
            this.removeQuest(id);
        }
    };

    /**
     * 受領中のクエスト一覧を得る。
     * 
     * @returns {Array<Game_Quest>} クエスト一覧
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
     * 
     * @param {number} id クエストID
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
     * 
     * @param {number} id クエストID
     * @returns {boolean} 請負中の場合にはtrue, それ以外はfalse
     */
    Game_Party.prototype.isTryingQuest = function(id) {
        for (let i = 0; i < this._quests.length; i++) {
            if (this._quests[i].id() === id) {
                return true;
            }
        }
        return false;
    };

    /**
     * 討伐した対象を追加する。
     * 
     * @param {Game_Enemy} enemy エネミー
     */
    Game_Party.prototype.addSubjugationTarget = function(enemy) {
        const enemyId = enemy.enemyId();
        this._quests.forEach(function(q) {
            if (q.isSubjugationTarget(enemyId)) {
                q.incrementSubjugationTarget(enemyId);
            }
        });
    };


})();
