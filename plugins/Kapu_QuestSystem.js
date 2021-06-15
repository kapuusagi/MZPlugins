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
 * 
 * @commad giveupQuest
 * @text クエストをギブアップする
 * @desc クエストをギブアップし、受託中リストから削除する。受けていない場合には何もしない。
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
 * 
 * @command setQuestDone
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
 * @command setQuestFail
 * @text クエストを失敗にする。
 * @desc 指定クエストを失敗状態にする。
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
 * @param textQuestTitleSubjugation
 * @text 討伐クエストタイトル書式
 * @desc 討伐クエストタイトル書式。%1にエネミー名が入る。クエスト名未指定時のみ有効
 * @type string
 * @default %1の討伐
 * 
 * @param textQuestAchieveSubjugation
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
 * @param textQuestAchieveCollection
 * @text 採取クエスト達成条件の書式
 * @desc 採取クエスト達成条件の書式。%1に採取アイテム名、%2に数が入る。クエスト達成条件テキスト未指定時のみ有効。
 * @type string
 * @default %1を%2個収集する。
 * 
 * @param textRewardNone
 * @text 報酬無しテキスト
 * @desc 報酬無い場合の表示用テキスト
 * @type string
 * @default なし
 * 
 * @param textDeadlineNone
 * @text 期限なしテキスト
 * @desc 受託後の期限制限がないことを表すテキスト。(期限は本プラグインでは提供しない)
 * @type string
 * @default 無期限
 * 
 * @param guildExpCoefDifficult
 * @text ギルド経験値補正(難易度高)
 * @desc 達成報酬、ペナルティ時に適用されるギルド経験値補正量(難易度高い場合)
 * @type number
 * @decimals 2
 * @default 0.50
 * 
 * @param guildExpCoefEasy
 * @text ギルド経験値補正(難易度低)
 * @desc 達成報酬、ペナルティ時に適用されるギルド経験値補正量(難易度低い場合)
 * @type number
 * @decimals 2
 * @default 0.50
 * 
 * @param penaltyGoldRate
 * @text ペナルティゴールドレート
 * @desc キャンセル時に支払うゴールドレート
 * @type number
 * @decimals 2
 * @default 0.30
 * 
 * @help 
 * クエストシステム。
 * 
 * x. 受託条件
 * 
 * x. 受託時のカスタム処理/完了時のカスタム処理。
 *   クエスト受託中だけ特定のシンボルエネミーを出したい場合など、クエスト受託時ONにするなど。
 *   エディタ作るのが面倒なので、スクリプトを実行する構造にした。
 * 
 * x. キャンセル時ペナルティ
 *   キャンセル時のペナルティは、お金とギルドEXPとした。
 *   クエストに設定されている報酬金額にプラグインパラメータで指定したゴールドレートを乗算した値を減算する。
 * 
 * ギルドランクの取得用コマンドは面倒なので用意しない。
 * 以下のようなコードで取得出来るので、標準にある、「スクリプトの値を変数に格納」で格納することを想定する。
 * ・パーティーのギルドランク(平均)
 *   $gameParty.guildRank()
 * ・指定したアクターのギルドランク
 *   const a = $gameActors.actor(id); (a) ? a.guildRank() : 0
 * ・N番目のメンバーのギルドランク
 *   $gameParty.allMembers()[no].guildRank()
 * 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * クエストの受領/達成報告/キャンセル操作をする場合には、QuestManagerのインタフェースを使用します。
 * QuestManager.acceptQuest(id:number):void
 *   idで指定したクエストを受領する。
 * QuestManager.reportQuest(id:number,loseCollectItems:boolean,getRewards:boolean):void
 *   idで指定したクエストを完了報告する。
 *   受託していない場合には何もしない。
 *   lostCollectItemsにtrueを指定すると、採取条件のアイテムを失う。falseにすると採取アイテムは減らない。
 *   getRewardsにtrueを指定すると、報酬を得る。falseにすると報酬は得ない。
 * QuestManager.giveupQuest(id:number,payPenalty:boolean):void
 *   idで指定したクエストをギブアップ報告する。
 *   受託していない場合には何もしない。
 *   payPenaltyにtrueを指定すると、ペナルティを支払う。falseにするとペナルティは支払わない。
 * QuestManager.setQuestDone(id:number):void
 *   idで指定したクエストを完了状態にする。
 *   受託していない場合には何もしない。
 * QuestManager.setQuestFail(id:number):void
 *   idで指定したクエストを失敗状態にする。
 *   受託していない場合には何もしない。
 *   既に完了しているならば失敗にできない。
 * 
 * クエストデータについての追加の処理について
 * Game_Quest.onAccept():void
 *   クエストを受託したときに呼ばれる。
 * Game_Quest.onComplete():void
 *   クエストを完了したときに呼ばれる。
 * Game_Quest.onCancel():void
 *   クエストをキャンセルしたときに呼ばれる。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * クエストを受ける
 *   指定したクエストを受領状態にします。
 *   受領可能な条件を満たしているかどうかは判定しません。
 *   既に受領済みの場合には何もしません。
 * 
 * クエストを完了報告する
 *   指定したクエストを完了報告します。
 *   受領していない場合にはなにもしません。
 *   完了条件を満たしているかどうかは判定しません。
 * 
 * クエストをギブアップする
 *   指定したクエストをギブアップします。
 *   受領していない場合には何もしません。
 * 
 * クエストを完了状態にする
 *   指定したクエストを完了状態にする。
 *   正確には、現状の討伐数、採取状態に条件を引き下げるて完了にする。
 *   依頼主が「もういいや」という場合に使用する。
 * 
 * クエストを失敗状態にする
 *   指定したクエストを失敗状態にする。
 *   時間制限や達成が出来なくなった場合に使用する。
 *   失敗状態になると、クエストの状態が更新されなくなる。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <guildRank:rank#>
 *     初期ギルドランクをrank#とする。
 *     初期ギルドEXPはギルドランクに応じた値になる。
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
 * 新しいGame_Questデータを構築する。
 * 
 * @param {number} id クエストID
 */
function Game_Quest() {
    this.initialize(...arguments);
}

/**
 * QuestManager
 * 
 * 受託処理/報告処理を行う。
 */
function QuestManager() {
    throw new Error("This is a static class");
}



(() => {
    const pluginName = "Kapu_QuestSystem";
    const parameters = PluginManager.parameters(pluginName);
    const maxGuildExp = Math.max(0, Number(parameters["maxGuildExp"]) || 999999);
    const textQuestTitleSubjugation = parameters["textQuestTitleSubjugation"] || "Subjugation %1";
    const textQuestAchieveSubjugation = parameters["textQuestAchieveSubjugation"] || "Subjugation %1 x %2";
    const textQuestTitleCollection = parameters["textQuestTitleCollection"] || "Collect %1";
    const textQuestAchieveCollection = parameters["textQuestAchieveCollection"] || "Collect %1 x %2";
    const textDeadlineNone = parameters["textDeadlineNone"] || "No deadline";
    const guildExpCoefDifficult = Math.max(0, (Number(parameters["guildExpCoefDifficult"]) || 0));
    const guildExpCoefEasy = (Number(parameters["guildExpCoefEasy"]) || 0).clamp(0, 1.0);
    const penaltyGoldRate = (Number(parameters["penaltyGoldRate"]) || 0.3).clamp(0.01, 1.0);

    Game_Quest.STATUS_TRYING = 0;
    Game_Quest.STATUS_DONE = 1;
    Game_Quest.STATUS_FAIL = 2;

    Game_Quest.ACHIEVE_SUBJUGATION = 1; // 討伐条件 value1:マップID(未使用) value2エネミーID:, value3:討伐数
    Game_Quest.ACHIEVE_COLLECTION = 2; // 採取条件 value1:種類(1:アイテム,2:武器,3:防具), value2:ID, value3:数量
    Game_Quest.ACHIEVE_EVENT = 3; // イベント条件 value1:スイッチID, value2:スイッチ状態(0:ON, 1:OFF)



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
            if (!$gameParty.isAcceptQuest(id)) {
                QuestManager.acceptQuest(id);
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
            QuestManager.reportQuest(id, loseCollectItems, getRewards);
        }

    });

    PluginManager.registerCommand(pluginName, "giveupQuest", args => {
        const id = _getQuestId(args);
        const payPenalty = (args.payPenalty === undefined)
                ? true : (args.payPenalty === "true");
        if (id > 0) {
            QuestManager.giveupQuest(id, payPenalty);
        }
    });

    PluginManager.prototype.registerCommand(pluginName, "setQuestDone", args => {
        const id = _getQuestId(args);
        if (id > 0) {
            QuestManager.setQuestDone(id);
        }
    });

    PluginManager.prototype.registerCommand(pluginName, "setQuestFail", args => {
        const id = _getQuestId(args);
        if (id > 0) {
            QuestManager.setQuestFail(id);
        }
    })

    //------------------------------------------------------------------------------
    // DataManager
    DataManager._databaseFiles.push({ name:"$dataQuests", src:"Quests.json" });

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

    /**
     * ギルドランクに対応するランク情報を得る。
     * 
     * @param {number} rank ギルドランク
     * @returns {GuildRankInfo} ギルドランク情報。該当エントリが無い場合には一番低いランクが返る。
     */
    DataManager.guildRankByRank = function(rank) {
        const rankInfo = this._guildRanks.find(gr => gr.rank === rank);
        return (rankInfo) ? rankInfo : this._guildRanks[0];
    };

    /**
     * 種類とIDからアイテムを得る。
     * 
     * @param {number} kind 種類
     * @param {number} id ID
     * @returns {object} アイテム
     */
    const _targetItem = function(kind, id) {
        switch (kind) {
            case 1:
                return $gameItems[id] || null;
            case 2:
                return $gameWeapons[id] || null;
            case 3:
                return $gameArmors[id] || null;
            default:
                return null;
        }
    };

    /**
     * 種類とIDからアイテム名を得る。
     * 
     * @param {number} kind 種類
     * @param {number} id ID
     * @returns {string} アイテム名
     */
    const _targetItemName = function(kind, id) {
        const item = _targetItem(kind, id);
        return (item) ? item.name : "";
    };

    /**
     * 達成条件概要を得る。
     * 
     * @param {DataAchieve} achieve 達成条件
     * @returns {string} 概要文字列
     */
    const _getAchieveOverviewText = function(achieve) {
        switch (achieve.type) {
            case Game_Quest.ACHIEVE_SUBJUGATION:
                return textQuestTitleSubjugation.format($dataEnemies[achieve.value2]);
            case Game_Quest.ACHIEVE_COLLECTION:
                return textQuestTitleCollection.format(_targetItemName(achieve.value1, achieve.value2));
            case Game_Quest.ACHIEVE_EVENT:
                return $dataSystem.switches[achieve.value1] || "";
            default:
                return "";
        }
    };

    /**
     * クエスト詳細文字列を得る。
     * 
     * @param {Array<DataAchieve>} achieves 達成条件リスト
     * @returns {string} 概要文字列
     */
    const _generateQuestDescription = function(achieves) {
        let description = "";
        for (const achieve of achieves) {
            const overviewText = _getAchieveOverviewText(achieve);
            if (overviewText) {
                if (description) {
                    description = description + "," + overviewText;
                } else {
                    description = overviewText;
                }
            }
        }
        return description;
    };
    /**
     * 達成条件概要を得る。
     * 
     * @param {DataAchieve} achieve 達成条件
     * @returns {string} 概要文字列
     */
    const _getAchieveText = function(achieve) {
        switch (achieve.type) {
            case Game_Quest.ACHIEVE_SUBJUGATION:
                return textQuestAchieveSubjugation.format($dataEnemies[achieve.value2]);
            case Game_Quest.ACHIEVE_COLLECTION:
                return textQuestAchieveCollection.format(_targetItemName(achieve.value1, achieve.value2));
            case Game_Quest.ACHIEVE_EVENT:
                return $dataSystem.switches[achieve.value1] || "";
            default:
                return "";
        }
    };
    /**
     * クエスト達成条件文字列を得る。
     * 
     * @param {Array<DataAchieve>} achieves 達成条件リスト
     * @returns {string} 達成条件文字列
     */
    const _generateAchieveMessage = function(achieves) {
        let message = "";
        for (const achieve of achieves) {
            const text = _getAchieveText(achieve);
            if (text) {
                if (message) {
                    message = message + "," + text;
                } else {
                    message = text;
                }
            }
        }
        return message;
    };

    /**
     * 報酬メッセージを生成する
     * 
     * @param {number} gold ゴールド
     * @param {number} exp 経験値
     * @param {Array<object>} items アイテム配列
     * @return {string} 報酬メッセージ
     */
    const _generateRewardMessage = function(gold, exp, rewardItems) {
        let message = "";
        if (gold > 0) {
            message = gold + TextManager.currencyUnit;
        }
        if (exp > 0) {
            if (message) {
                message = message + ", " + TextManager.expA + " " + exp;
            } else {
                message = TextManager.expA + " " + exp;
            }
        }
        for (const rewardItem of rewardItems) {
            const itemName = _targetItemName(rewardItem.kind, rewardItem.dataId);
            if (itemName) {
                if (message) {
                    message = message + ", " + itemName + "\u00d7" + rewardItem.value;
                } else {
                    message = itemName + "\u00d7" + rewardItem.value;
                }
            }
        }

        return message || textRewardNone;
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
        // 倒したえねみーの討伐数を加算する。
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
     * ギルドEXPを加算する。
     * 
     * Note: このメソッドは単純加算するのみ。適正ランク/不適正ランクなどによる、
     *       倍率調整は呼び出し元で実施することを想定する。。
     * 
     * @param {number} guildExp 加算する量
     */
    Game_Actor.prototype.gainGuildExp = function(guildExp) {
        this._guildExp = (this._guildExp + guildExp).clamp(0, maxGuildExp);
    };

    /**
     * ギルドEXPを減らす。
     * 
     * @param {number} guildExp ギルドEXP
     */
    Game_Actor.prototype.loseGuildExp = function(guildExp) {
        this.gainGuildExp(-guildExp);
    };


    /**
     * アクターのギルドランクを得る。
     * 
     * @returns {number} ギルドランク番号
     */
    Game_Actor.prototype.guildRank = function() {
        const rankInfo = DataManager.guildRankByExp(this._guildExp);
        return rankInfo.rank;
    };

    /**
     * ギルドランク名を得る。
     * 
     * @returns {string} ギルドランク名
     */
    Game_Actor.prototype.guildRankName = function() {
        const rankInfo = DataManager.getGuildRankEntryByExp(this._guildExp);
        return rankInfo.name;
    };
    //------------------------------------------------------------------------------
    // Game_Quest

    /**
     * 初期化する。
     * 
     * @param {number} id クエストID
     */
     Game_Quest.prototype.initialize = function(id) {
        this._id = id;
        this._status = Game_Quest.STATUS_TRYING;
        this.initAchieves();
    };

    /**
     * 達成条件データを初期化する。
     */
    Game_Quest.prototype.initAchieves = function() {
        this._achieves = [];
        const dataQuest = this.dataQuest();
        for (const achieve of dataQuest.achieves) {
            this.addAchieve(achieve);
        }
    };

    /**
     * 達成条件を追加する。
     * 
     * @param {object} achieve 達成条件
     * @returns {boolean} 達成条件を追加した場合にはtrue, それ以外はfalse
     */
    Game_Quest.prototype.addAchieve = function(achieve) {
        switch (achieve.type) {
            case Game_Quest.ACHIEVE_SUBJUGATION:
                {
                    const entry = this._achieves.find(a => (a.type === achieve.type) && (a.value1 === achieve.value1) && (a.value2 === achieve.value2));
                    if (entry) {
                        // 既に登録済みの達成条件がある。討伐数を加算。
                        entry.value3 += achieve.value3;
                        return true;
                    } else {
                        return this.registerNewAchieve(achieve);
                    }
                }
            case Game_Quest.ACHIEVE_COLLECTION:
                {
                    const entry = this._achieves.find(a => (a.type === achieve.type) && (a.value1 === achieve.value1) && (a.value2 === achieve.value2));
                    if (entry) {
                        // 既に登録済みの達成条件がある。採取数を加算。
                        entry.value3 += achieve.value3;
                        return true;
                    } else {
                        return this.registerNewAchieve(achieve);
                    }
                }
            case Game_Quest.ACHIEVE_EVENT:
                {
                    const entry = this._achieves.find(a => (a.type === achieve.type) && (a.value1 == achieve.value1));
                    if (entry) {
                        // 同じイベント条件がある。達成条件の状態を上書き。
                        entry.value2 = achieve.value2;
                        return true;
                    } else {
                        return this.registerNewAchieve(achieve);
                    }
                }
            default:
                return false;
        }
    };

    /**
     * 達成条件を新規登録する。
     * 
     * Note: 予め同じターゲットの達成条件が無いことを確認する事。
     * 
     * @param {object} achieve 達成条件
     * @returns {boolean} 達成条件を追加した場合にはtrue, それ以外はfalse
     */
    Game_Quest.prototype.registerNewAchieve = function(achieve) {
        this._achieves.push({
            type:achieve.type,
            value1:achieve.value1,
            value2:achieve.value2,
            value3:achieve.value3,
            current:0
        });
        return true;
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
     * クエストデータを得る。
     * 
     * @returns {DataQuest} クエストデータ
     */
    Game_Quest.prototype.dataQuest = function() {
        return $dataQuests[this._id];
    };


    /**
     * クエスト名を得る。
     * 
     * @returns {string} クエスト名
     */
    Game_Quest.prototype.name = function() {
        const dataQuest = this.dataQuest();
        if (dataQuest) {
            if (!dataQuest.name && (dataQuest.achieves.length > 0)) {
                dataQuest.name = _getAchieveOverviewText(dataQuest.achieves[0]);
            }
            return dataQuest.name;
        }
        return "";
    };

    /**
     * 説明文を得る。
     * 
     * @returns {string} 説明文
     */
    Game_Quest.prototype.description = function() {
        const dataQuest = this.dataQuest();
        if (dataQuest) {
            if (!dataQuest.description && (dataQuest.achieves.length > 0)) {
                dataQuest.description = _generateQuestDescription(dataQuest.achieves);
            }
            return dataQuest.description;
        }
        return "";
    };

    /**
     * 達成条件メッセージを得る。
     * 
     * @returns {string} 達成条件メッセージ
     */
    Game_Quest.prototype.achieveText = function() {
        const dataQuest = this.dataQuest();
        if (dataQuest) {
            if (!dataQuest.achieveMsg && (questdata.achieves.length > 0)) {
                dataQuest.achieveMsg = _generateAchieveMessage(dataQuest.achieves);
            }
            return questdata.achieveMsg;
        }
        return "";
    };

    /**
     * 報酬テキストを取得する。
     * 
     * @returns {string} 報酬テキスト
     */
    Game_Quest.prototype.rewardText = function() {
        const dataQuest = this.dataQuest();
        if (dataQuest) {
            if (!dataQuest.rewardMsg) {
                dataQuest.rewardMsg = _generateRewardMessage(dataQuest.rewardGold, dataQuest.rewardExp, dataQuest.rewardItems);
            }
            return dataQuest.rewardMsg;
        }
        return "";
    };
    /**
     * このクエストの適正ギルドランクを得る。
     * 
     * @returns {number} ギルドランク
     */
    Game_Quest.prototype.guildRank = function() {
        const dataQuest = this.dataQuest();
        return (dataQuest) ? dataQuest.guildRank : 0;
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
     * 達成条件の数を得る。
     * 
     * Note: 個別の達成条件状態を取得する際に使用する。状態自体はachieveStatus()を使用する。 
     * 
     * @returns {number} 達成条件の数
     */
    Game_Quest.prototype.achieveCount = function() {
        return this._achieves.length;
    };
    /**
     * 討伐の達成条件を得る。
     * 
     * @returns {Array<object>} 達成条件 
     */
    Game_Quest.prototype.collectionAchieves = function() {
        return this._achieves.filter(achieve => achieve.type === Game_Quest.ACHIEVE_SUBJUGATION);
    };


    /**
     * 採取の達成条件を得る。
     * 
     * @returns {Array<object>} 達成条件 
     */
    Game_Quest.prototype.collectionAchieves = function() {
        return this._achieves.filter(achieve => achieve.type === Game_Quest.ACHIEVE_COLLECTION);
    };
    /**
     * イベントの達成条件を得る。
     * 
     * @returns {Array<object>} 達成条件 
     */
    Game_Quest.prototype.collectionAchieves = function() {
        return this._achieves.filter(achieve => achieve.type === Game_Quest.ACHIEVE_EVENT);
    };


    /**
     * 達成条件のステータスを得る。
     * 
     * Note : 返すオブジェクトの詳細は次の通り
     *        {
     *             text : {string} 達成条件文字列(xxxxをyyyy討伐とか)
     *             status : {number} Game_Quest.STATUS_xxx
     *             current : {number} 現在値
     *             total : {number} 目標値
     *        }
     * 
     * @param {number} no 達成条件インデックス
     * @returns {object} 達成条件状態。noが不正な場合にはnull.
     */
    Game_Quest.prototype.achieveStatus = function(no) {
        const achieve = this._achieves[no];
        if (achieve) {
            const status =  this.isAchieveDone(achieve) ? Game_Quest.STATUS_DONE 
                    : (this.isFail() ? Game_Quest.STATUS_FAIL : Game_Quest.STATUS_TRYING);
            const current = this.achieveCurrent(achieve);
            const total = this.achieveTotal(achieve);
            return {
                text: _getAchieveText(achieve),
                status:status,
                current:current,
                total:total
            };
        } else {
            return null;
        }
    };

    /**
     * 達成条件の達成状態を得る。
     * 
     * @param {object} achieve 達成条件オブジェクト
     * @returns {boolean} 達成条件を満たしている場合にはtrue, 満たしていない場合にはfalse.
     */
    Game_Quest.prototype.isAchieveDone = function(achieve) {
        switch (achieve.type) {
            case Game_Quest.ACHIEVE_SUBJUGATION:
                return (achieve.current >= achieve.value3);
            case Game_Quest.ACHIEVE_COLLECTION:
                {
                    const item = _targetItem(achieve.value1, achieve.value2);
                    return ($gameParty.numItems(item) >= achieve.value3);
                }
            case Game_Quest.ACHIEVE_EVENT:
                {
                    const switchId = achieve.value1;
                    const condition = achieve.value2 === 0;
                    return ($gameSwitches.value(switchId) === condition);
                }
            default:
                return false;
        }
    };

    /**
     * 達成条件の現在のカウントを得る。
     * 
     * @param {object} achieve 達成条件オブジェクト
     * @returns {number} 現在のカウント
     */
    Game_Quest.prototype.achieveCurrent = function(achieve) {
        switch (achieve.type) {
            case Game_Quest.ACHIEVE_SUBJUGATION:
                return achieve.current;
            case Game_Quest.ACHIEVE_COLLECTION:
                {
                    const item = _targetItem(achieve.value1, achieve.value2);
                    return $gameParty.numItems(item);
                }
            case Game_Quest.ACHIEVE_EVENT:
                {
                    const switchId = achieve.value1;
                    const condition = achieve.value2 === 0;
                    return ($gameSwitches.value(switchId) === condition) ? 1 : 0;
                }
            default:
                return 0;
        }
    };

    /**
     * 達成条件のトータルカウントを得る。
     * 
     * @param {object} achieve 達成条件
     * @returns {number} トータルカウント
     */
    Game_Quest.prototype.achieveTotal = function(achieve) {
        switch (achieve.type) {
            case Game_Quest.ACHIEVE_SUBJUGATION:
                return achieve.value3;
            case Game_Quest.ACHIEVE_COLLECTION:
                return achieve.value3;
            case Game_Quest.ACHIEVE_EVENT:
                return 1;
            default:
                return 0;
        }
    };

    /**
     * enemyIdで指定されるエネミーが、このクエストの討伐対象かどうかを判定する。
     * 
     * @param {number} enemyId エネミーID
     * @returns {boolean} 討伐対象の場合にはtrue, それ以外はfalse
     */
    Game_Quest.prototype.isSubjugationTarget = function(enemyId) {
        return this._achieves.some(achieve => (achieve.type === Game_Quest.ACHIEVE_SUBJUGATION) && (achieve.value2 === enemyId));
    };

    /**
     * 討伐数を加算する。
     * enemyIdを対象とした討伐クエストが無い場合には何も変化しない。
     * 
     * @param {number} enemyId エネミーID
     */
    Game_Quest.prototype.incrementSubjugationTarget = function(enemyId) {
        if (this._status === Game_Quest.STATUS_TRYING) {
            for (const achieve of this._achieves) {
                if ((achieve.type === Game_Quest.ACHIEVE_SUBJUGATION)
                        && (achieve.value2 === enemyId)
                        && (achieve.current < achieve.value3)) {
                    achieve.current++;
                    break;
                }
            }
        }
    };

    /**
     * 受託条件を取得する。
     * 
     * @returns {string} 受託条件
     */
    Game_Quest.prototype.entrustCondition = function() {
        const dataQuest = this.dataQuest();
        return (dataQuest) ? dataQuest.entrustCondition : "";
    };

    /**
     * 報酬アイテム一覧を得る。
     * 
     * @returns {Array<[object,number]>} 報酬アイテム一覧。objectはDataItem/DataWeapon/DataArmorのいずれかが入る。
     */
    Game_Quest.prototype.rewardItems = function() {
        const items = [];
        const dataQuest = this.dataQuest();
        if (dataQuest) {
            dataQuest.rewardItems.forEach(function(entry) {
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
     * 報酬を作成する。
     * 
     * @returns {object} 報酬
     */
    Game_Quest.prototype.makeRewards = function() {
        const guildExp = this.rewardGuildExp();
        const exp = this.rewardExp();
        const gold = this.rewardGold();
        const items = this.rewardItems();
        return {
            guildExp:guildExp,
            exp:exp,
            gold:gold,
            items:items
        }
    };
    /**
     * このクエストのギルドEXPを得る。
     * 
     * @returns {number} ギルドEXP
     */
    Game_Quest.prototype.rewardGuildExp = function() {
        const dataQuest = this.dataQuest();
        return (dataQuest) ? dataQuest.guildExp : 0;
    };

    /**
     * このクエストの報酬経験値を得る。
     * 
     * @returns {number} 経験値
     */
    Game_Quest.prototype.rewardExp = function() {
        const dataQuest = this.dataQuest();
        return (dataQuest) ? dataQuest.rewardExp : 0;
    };
    /**
     * このクエストの報酬ゴールドを得る。
     * 
     * @returns {number} 報酬ゴールド
     */
    Game_Quest.prototype.rewardGold = function() {
        const dataQuest = this.dataQuest();
        return (dataQuest) ? dataQuest.rewardGold : 0;
    };

    /**
     * 報酬アイテムを得る。
     * 
     * @returns {Array<object>} 報酬アイテム
     */
    Game_Quest.prototype.rewardItems = function() {
        const items = [];
        const dataQuest = this.dataQuest();
        if (dataQuest) {
            for (const rewardItem of dataQuest.rewardItems) {
                const item = _targetItemName(rewardItem.kind, rewardItem.dataId);
                for (let i = 0; i < rewardItem.value; i++) {
                    items.push(item);
                }
            }
        }
        return items;
    };

    /**
     * このクエストを失敗状態にする。
     * 
     * Note:既に完了/失敗状態の場合には変化しない。
     */
    Game_Quest.prototype.setFail = function() {
        if (this._status === Game_Quest.STATUS_TRYING) {
            this._status = Game_Quest.STATUS_FAIL;
        }
    };

    /**
     * 状態を更新する。
     */
    Game_Quest.prototype.refresh = function() {
        if (this._status !== Game_Quest.STATUS_FAIL) {
            const isTrying = this._achieves.some(achieve => !this.isAchieveDone(achieve));
            this._status = isTrying ? Game_Quest.STATUS_TRYING : Game_Quest.STATUS_DONE;
        }
    };

    /**
     * 強制的に達成状態にする。
     */
    Game_Quest.prototype.done = function() {
        if (this._status !== Game_Quest.STATUS_FAIL) {
            this._status = Game_Quest.STATUS_DONE;
            for (const achieve of this._achieves) {
                this.setAchieveDone(achieve);
            }
            this.refresh();
        }
    };

    /**
     * noで指定された達成条件を満たすように達成条件を変更する。
     * 
     * @param {object} achieve 達成条件オブジェクト
     */
    Game_Quest.prototype.setAchieveDone = function(achieve) {
        switch (achieve.type) {
            case Game_Quest.ACHIEVE_SUBJUGATION:
                achieve.value3 = achieve.current;
                break;
            case Game_Quest.ACHIEVE_COLLECTION:
                {
                    const item = _targetItem(achieve.value1, achieve.value2);
                    const numItems = $gameParty.numItems(item);
                    if (numItems < achieve.value3) {
                        achieve.value3 = numItems;
                    }
                }
                break;
            case Game_Quest.ACHIEVE_EVENT:
                {
                    achieve.value2 = $gameSwitches.value(achieve.value1) ? 0 : 1;
                }
                break;
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
     * 失敗したかどうかを取得する。
     * 
     * @returns {boolean} 失敗した場合にはtrue, それ以外はfalse
     */
    Game_Quest.prototype.isFail = function() {
        return this._status === Game_Quest.STATUS_FAIL;
    };

    /**
     * ランク名を得る。
     * 
     * @returns {string} ランク名
     */
    Game_Quest.prototype.rankName = function() {
        const dataQuest = this.dataQuest();
        if (dataQuest) {
            const rankInfo = DataManager.guildRank(dataQuest.guildRank);
            if (rankInfo) {
                return rankInof.name;
            }
        }
        return "";
    };

    /**
     * キャンセル時のペナルティ金額を得る。
     * 
     * @returns {number} ペナルティ金額
     */
    Game_Quest.prototype.penaltyGold = function() {
        const dataQuest = this.dataQuest();
        if (dataQuest) {
            if (dataQuest.rewardGold) {
                // 報酬金額が設定されている
                return Math.round(dataQuest.rewardGold * this.penaltyGoldRate());
            } else if (dataQuest.guildRank) {
                // ギルドランクが指定されている。
                const rankInfo = DataManager.guildrank(dataQuest.guildRank);
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
        return penaltyGoldRate;
    };

    /**
     * 受託時の処理を行う。
     */
    Game_Quest.prototype.onAccept = function() {
        const dataQuest = this.dataQuest();
        if (dataQuest && dataQuest.onAccept) {
            try {
                eval(dataQuest.onAccept);
            }
            catch (e) {
                console.error("quest:id=" + dataQuest.id + ", name=" + dataQuest.name);
                console.error(e);
            }
        }
    };

    /**
     * 完了時の処理を行う。
     */
    Game_Quest.prototype.onComplete = function() {
        const dataQuest = this.dataQuest();
        if (dataQuest && dataQuest.onComplete) {
            try {
                eval(dataQuest.onComplete);
            }
            catch (e) {
                console.error("quest:id=" + dataQuest.id + ", name=" + dataQuest.name);
                console.error(e);
            }
        }
    };

    /**
     * ギブアップ時の処理を行う。
     */
    Game_Quest.prototype.onGiveup = function() {
        const dataQuest = this.dataQuest();
        if (dataQuest && dataQuest.onCancel) {
            try {
                eval(dataQuest.onCancel);
            }
            catch (e) {
                console.error("quest:id=" + dataQuest.id + ", name=" + dataQuest.name);
                console.error(e);
            }
        }
    };

    /**
     * 制限時間テキストを得る。
     * 
     * @returns {string} 制限時間テキスト
     */
    Game_Quest.prototype.deadlineText = function() {
        return textDeadlineNone;
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
     * このパーティーのギルドランク名を得る。
     * 
     * @returns {string} ギルドランク名
     */
    Game_Party.prototype.guildRankName = function() {
        const guildRank = this.guildRank();
        const rankInfo = DataManager.guildRankByRank(guildRank);
        return rankInfo.name;
    };

    /**
     * 新しいクエストを請け負う。
     * 
     * @param {number} quest クエスト
     */
    Game_Party.prototype.addQuest = function(quest) {
        this._quests.push(quest); 
        quest.refresh();
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
    Game_Party.prototype.refreshQuests = function() {
        for (const quest of this._quests) {
            quest.refresh();
        }
    };

    /**
     * idで指定されるクエストを受領中かどうかを判定して返す。
     * 
     * @param {number} id クエストID
     * @returns {boolean} 請負中の場合にはtrue, それ以外はfalse
     */
    Game_Party.prototype.isAcceptQuest = function(id) {
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
            q.incrementSubjugationTarget(enemyId);
        });
    };

    //------------------------------------------------------------------------------
    // QuestManager
    /**
     * idで指定されるクエストが有効かどうかを得る。
     * 
     * @param {number} id クエストID
     * @returns {boolean} 有効なクエストな場合にはtrue, それ以外はfalse
     */
    QuestManager.isValidQuest = function(id) {
        const quest = $dataQuests[id];
        if (quest) {
            // クエスト名が設定されていて、達成条件が1つ以上存在するなら有効であると判定する。
            return quest.name && (quest.achieves.length > 0);
        }
        return false;
    };
    /**
     * クエストが受託可能かどうかを判定する。
     * 
     * @param {number} クエストID
     * @returns {boolean} 受託可能な場合にはtrue, それ以外はfalse.
     */
    QuestManager.canAcceptQuest = function(id) {
        if (this.isValidQuest(id)) {
            const dataQuest = $dataQuests[id];
            return this.testEntrustCondition(dataQuest);
        }
        return false;
    };

    /**
     * 指定されたクエストを受けるとこができるかどうかテストする。
     * 
     * @param {DataQuest} dataQuest クエストデータ
     * @returns {boolean} 受託可能ならばtrue, 受託できないならばfalse.
     */
    QuestManager.testEntrustCondition = function(dataQuest) {
        const condition = dataQuest.entrustCondition();
        if (condition) {
            const quest = dataQuest; // eslint-disable-line no-unused-vars
            const guildRank = this.guildRank(); // eslint-disable-line no-unused-vars
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
     * idで指定されるクエストを受託する。
     * 
     * @param {number} id クエストID
     */
    QuestManager.acceptQuest = function(id) {
        if (this.canAcceptQuest(id)) {
            const quest = new Game_Quest(id);
            $gameParty.addQuest(quest);
            quest.onAccept();
        }
    };

    /**
     * idで指定されるクエストが報告可能かどうかを判定する。
     * 
     * @param {number} id クエストID
     * @return {boolean} 報告可能な場合にはtrue, それ以外はfalse
     */
    QuestManager.canReportQuest = function(id) {
        const quest = $gameParty.quests().find(q => q.id() === id);
        return (quest && quest.isDone());
    };

    /**
     * クエストを報告する。
     * 
     * Note: 完了状態かどうかは判定されない。呼び出し元で判定すること。
     * 
     * @param {number} id クエストID
     * @param {number} loseQuestItems 収集アイテムを減らす場合にはtrue
     * @param {boolean} getRewards 報酬を加算する場合にはtrue, 加算しない場合にはfalse
     */
    QuestManager.reportQuest = function(id, loseQuestItems, getRewards) {
        const quest = $gameParty.quests().find(q => q.id() === id);
        if (quest) {
            if (loseQuestItems) {
                this.loseQuestItems(quest);
            }
            if (getRewards) {
                this.gainQuestRewards(quest);
            } else {
                this._rewards = null;
            }
            quest.onComplete();
            this.removeQuest(id);
        }
    };

    /**
     * idで指定されるクエストの採取アイテムを減らす
     * 
     * @param {Game_Quest} クエスト
     */
    QuestManager.loseQuestItems = function(quest) {
        if (quest) {
            const achieves = quest.collectionAchieves();
            for (const achieve of achieves) {
                const item = _targetItemName(achieve.value1, achieve.value2);
                if (item) {
                    $gameParty.loseItem(item, achieve.value3, false);
                }
            }
        }
    };

    /**
     * クエスト報酬を得る。
     * 
     * @param {Game_Quest} quest クエスト
     */
    QuestManager.gainQuestRewards = function(quest) {
        if (quest) {
            const rewards = quest.makeRewards();
            this.gainQuestRewardGuildExp(quest.guildRank(), rewards.guildExp);
            this.gainRewardGold(rewards.gold);
            this.gainRewardExp(rewards.exp);
            this.gainRewardItems(rewards.items);
            this._rewards = rewards;
        }
    };

    /**
     * 報酬オブジェクトを得る。
     * 
     * @returns {object} 報酬オブジェクト
     */
    QuestManager.lastRewards = function() {
        return this._rewards;
    };

    /**
     * クエスト報酬のギルドEXPを加算する。
     * 
     * @param {number} guildRank クエストの適正ギルドランク
     * @param {number} guildExp ギルドEXP
     */
    QuestManager.gainQuestRewardGuildExp = function(guildRank, guildExp) {
        // ギルドランク補正をかけて、加算していく
        for (const actor of $gameParty.allMembers()) {
            const gainExp = this.correctGuildExp(actor.guildRank(), guildRank, guildExp);
            actor.gainGuildExp(gainExp);
        }
    };

    /**
     * クエスト報酬のEXPを加算する。
     * 
     * @param {number} exp 経験値
     */
    QuestManager.gainRewardExp = function(exp) {
        for (const actor of $gameParty.allMembers()) {
            actor.gainExp(exp);
        }
    };
    /**
     * 達成報酬のゴールドを加算する。
     * 
     * @param {number} gold 増やす金額
     */
    QuestManager.gainRewardGold = function(gold) {
        if (gold) {
            $gameParty.gainGold(gold);
        }
    };
    /**
     * アイテムを加算する。
     * 
     * @param {Array<object>} items アイテム
     */
    QuestManager.gainRewardItems = function(items) {
        for (const item of items) {
            $gameParty.gainItem(item, 1, false);
        }
    };

    /**
     * ギルド経験値の補正値を得る。
     * 
     * @param {number} actorGuildRank アクターのギルドランク
     * @param {number} questGuildRank クエストのギルドランク
     * @param {number} guildExp クエストのギルド経験値
     * @returns {number} ギルド経験値
     */
    QuestManager.correctGuildExp = function(actorGuildRank, questGuildRank, guildExp) {
        if (questGuildRank === 0) {
            // クエストに適正ギルドランク指定がない。 -> そのまま返す。
            return guildExp;
        } else {
            if (actorGuildRank < (questGuildRank - 1)) {
                // 適正ランクより2つ以上低い(困難なのを達成)
                const baseCoef = Math.max(1, 1 + guildExpCoefDifficult);
                const difficultLevel = questGuildRank - 1 - actorGuildRank;
                return Math.max(1, Math.round(guildExp * Math.pow(baseCoef, difficultLevel)));
            } else if (actorGuildRank > (questGuildRank + 1)) {
                // 適正ランクより2つ以上高い(簡単なのを達成)
                const baseCoef = (1.0 - guildExpCoefEasy).clamp(0, 1.0);
                const easyLevel = actorGuildRank - questGuildRank - 1;
                return Math.max(1, Math.round(guildExp * Math.pow(baseCoef, easyLevel)));
            } else {
                // 適正ランクの前後は補正なし。
                return guildExp;
            }
        }
    };



    /**
     * 指定IDのクエストを報告可能状態(done)にする。
     * 
     * @param {number} id クエストID
     */
    QuestManager.setQuestDone = function(id) {
        const quests = $gameParty.quests().filter(q => q.id() === id);
        for (const quest of quests) {
            quest.done();
        }
    };
    /**
     * 指定IDのクエストを失敗状態(faile)にする。
     * 
     * @param {number} id クエストID
     */
     QuestManager.setQuestDone = function(id) {
        const quests = $gameParty.quests().filter(q => q.id() === id);
        for (const quest of quests) {
            quest.setFail();
        }
    };

    /**
     * idで指定されるクエストをギブアップする。
     * 
     * @param {number} id クエストID
     * @param {boolean} payPenalty ペナルティを払うかどうか
     */
    QuestManager.giveupQuest = function(id, payPenalty) {
        const quests = $gameParty.quests().filter(q => q.id() === id);
        for (const quest of quests) {
            if (payPenalty) {
                this.payPenalty(quest);
            }
            quest.onGiveup();
            $gameParty.removeQuest(id);
        }
    };

    /**
     * ペナルティを支払う。
     * 
     * @param {Game_Quest} quest クエスト
     */
    QuestManager.payPenalty = function(quest) {
        if (quest) {
            // 所持金以上のものは撮られない
            this.payPenaltyGold(quest.penaltyGold());
            // ギルドEXPを減らす
            this.payPenaltyGuildExp(quest.guildRank(), quest.guildExp());
        }
    };

    /**
     * ペナルティ金額を払う。
     * 
     * @param {number} gold ペナルティ金額
     */
    QuestManager.payPenaltyGold = function(gold) {
        const penaltyGold = Math.min(gold, $gameParty.gold());
        if (penaltyGold) {
            this.loseGold(penaltyGold);
        }
    };

    /**
     * ペナルティとしてギルド経験値を払う。
     * 
     * @param {number} guildRank ペナルティ金額
     * @param {number} guildExp ペナルティ経験値
     */
    QuestManager.payPenaltyGuildExp = function(guildRank, guildExp) {
        if (guildExp) {
            // ギルドランク補正をかけて、減算していく
            for (const actor of $gameParty.allMembers()) {
                const loseGuildExp = this.correctGuildExp(actor.guildRank(), guildRank, guildExp);
                actor.loseGuildExp(loseGuildExp);
            }
        }
    };

})();
