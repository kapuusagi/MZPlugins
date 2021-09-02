/*:ja
 * @target MZ 
 * @plugindesc ターゲットマネージャプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @param alwaysSelectTarget
 * @text 常に対象選択する
 * @desc 戦闘時、効果対象を常に選択する場合にtrue, それ以外はfalse.
 * @type boolean
 * @default true
 * 
 * @param effectiveColor
 * @text 効果範囲色
 * @desc メニューなどでアイテム・スキル使用対象を強調表示する色
 * @type string
 * @default rgb(255,255,128)
 * 
 * @param textSelectedEnemy
 * @text 敵1体を表すテキスト
 * @type string
 * @default 敵1体
 * 
 * @param textAllEnemies
 * @text 敵全体を表すテキスト
 * @desc 敵全体を表すテキスト
 * @type string
 * @default 敵全体
 * 
 * @param textRandom1Enemy
 * @text ランダムな敵1体を表すテキスト
 * @type string
 * @default ランダムな敵1体
 * 
 * @param textRandom2Enemy
 * @text ランダムな敵2体を表すテキスト
 * @type string
 * @default ランダムな敵2体
 * 
 * @param textRandom3Enemy
 * @text ランダムな敵3体を表すテキスト
 * @type string
 * @default ランダムな敵3体
 * 
 * @param textRandom4Enemy
 * @text ランダムな敵4体を表すテキスト
 * @type string
 * @default ランダムな敵4体
 * 
 * @param textAlivedFriend
 * @text 味方単体を表すテキスト
 * @type string
 * @default 味方単体
 * 
 * @param textAllAlivedFriend
 * @text 味方全体を表すテキスト
 * @type string
 * @default 味方全体
 * 
 * @param textDeadFriend
 * @text 死亡した味方1体を表すテキスト
 * @type string
 * @default 味方単体
 * 
 * @param textAllDeadFriend
 * @text 死亡した味方全体を表すテキスト
 * @type string
 * @default 味方全体
 * 
 * @param textUser
 * @text 使用者を表すテキスト
 * @type string
 * @default 使用者
 * 
 * @param textFriend
 * @text 味方単体を表すテキスト
 * @type string
 * @default 味方単体
 * 
 * @param textAllFriends
 * @text 味方全体を表すテキスト
 * @desc 生存・死亡に依存しない。
 * @type string
 * @default 味方全体
 * 
 * @param textAllAlives
 * @text 生存している敵味方全体を表すテキスト
 * @type string
 * @default 敵味方全体
 * 
 * 
 * @help 
 * 行動対象のベースプラグイン
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * スコープエントリデータテーブルを以下のように定義してます。
 * グローバル変数 $dataItemScopes
 * 
 * 新しく選択可能ターゲットと効果範囲を定義するならば、$dataItemScopesにエントリを追加し、
 * TargetManager.makeSelectableActionTargets をフックします。
 * オブジェクト定義
 * {
 *   id: {number} // スコープID
 *   name: {string} // スコープ識別名(デバッグ用)
 *   needsSelection: {boolean} // 対象選択を行う必要があるかどうか。
 *   targetCount: {number} // 対象数
 *   
 *   // 以下はオプション。拡張して追加のフィールドを使用したい場合には、未定義の場合のデフォルトも考慮すること。
 *   forOpponent: {boolean} // 対象は敵
 *   forFriend: {boolean} // 対象は味方
 *   forAlive: {boolean} // 対象は生存メンバー
 *   forDead: {boolean} // 対象は死亡メンバー
 *   forUserOnly: {boolean} // 使用者のみ対象
 *   random: {boolean} // 対象はランダム
 *   forAll: {boolean} // 対象は敵味方全体が対象
 * }
 * 
 * TargetManager.makeSelectableActionTargets(subject:Game_Battler, item:object, isConfused:boolean) : Array<Game_ActionTargetGroup>
 *     subjectがitemを使用する時の選択可能な対象を得る。
 *     scopeを追加する場合にはこのメソッドを派生させる。
 * 
 * Game_ActionTargetGroup
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

/**
 * Game\ActionTarget
 * 
 * @class
 * 選択可能なターゲット
 */
function Game_ActionTargetGroup() {
    this.initialize(...arguments);
}

/**
 * TargetManager
 * 
 * @class
 * ターゲットマネージャ
 */
function TargetManager() {
    throw new Error("This is a static class");
}

/**
 * Window_MenuItemName
 * 
 * @class
 * アイテム名表示ウィンドウ
 */
function Window_MenuItemName() {
    this.initialize(...arguments);
}

/**
 * Window_ActionTarget
 * 
 * @class
 * アクションターゲット選択ウィンドウ
 */
function Window_ActionTarget() {
    this.initialize(...arguments);
}

$dataItemScopes = null;

(() => {
    const pluginName = "Kapu_TargetManager";
    const parameters = PluginManager.parameters(pluginName);
    const alwaysSelectTarget = (parameters["alwaysSelectTarget"] === undefined)
            ? true : parameters["alwaysSelectTarget"] === "true";
    const effectiveColor = parameters["effectiveColor"] || "rgb(255,255,128)";

    const textSelectedEnemy = parameters["textSelectedEnemy"] || "One enemy";
    const textAllEnemies = parameters["textAllEnemies"] || "All enemies";
    const textRandom1Enemy = parameters["textRandom1Enemy"] || "One random enemy";
    const textRandom2Enemy = parameters["textRandom2Enemy"] || "Two random enemies";
    const textRandom3Enemy = parameters["textRandom3Enemy"] || "Three random enemies";
    const textRandom4Enemy = parameters["textRandom4Enemy"] || "Four random enemies";
    const textAlivedFriend = parameters["textAlivedFriend"] || "One friend";
    const textAllAlivedFriend = parameters["textAllAlivedFriend"] || "All friend";
    const textDeadFriend = parameters["textDeadFriend"] || "One friend";
    const textAllDeadFriend = parameters["textAllDeadFriend"] || "All friend";
    const textUser = parameters["textUser"] || "User";
    const textFriend = parameters["textFriend"] || "One friend";
    const textAllFriends = parameters["textAllFriends"] || "All friends";
    const textAllAlives = parameters["textAllAlives"] || "All";



    TargetManager.TARGET_COUNT_ALL = -1;

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    /**
     * スコープエントリ配列。
     * needsSelectionとtargetCountだけ定義し、
     * それ以外はtrueを返す項目だけ定義する。
     * falseの項目はundefinedとすることで拡張しても互換性が維持されるようにする。 */
    $dataItemScopes = [
        null,
        { id:1, name:textSelectedEnemy, needsSelection:true, targetCount:1,
            forOpponent:true, forAlive:true },
        { id:2, name:textAllEnemies, needsSelection:false, targetCount:TargetManager.TARGET_COUNT_ALL,
            forOpponent:true, forAlive:true, forAll:true },
        { id:3, name:textRandom1Enemy, needsSelection:false, targetCount:1,
            forOpponent:true, forAlive:true, random:true },
        { id:4, name:textRandom2Enemy, needsSelection:false, targetCount:2,
            forOpponent:true, forAlive:true, random:true },
        { id:5, name:textRandom3Enemy, needsSelection:false, targetCount:3,
            forOpponent:true, forAlive:true, random:true },
        { id:6, name:textRandom4Enemy, needsSelection:false, targetCount:4,
            forOpponent:true, forAlive:true, random:true },
        { id:7, name:textAlivedFriend, needsSelection:true, targetCount:1,
            forFriend:true, forAlive:true },
        { id:8, name:textAllAlivedFriend, needsSelection:false, targetCount:TargetManager.TARGET_COUNT_ALL,
            forFriend:true, forAlive:true, forAll:true },
        { id:9, name:textDeadFriend, needsSelection:true, targetCount:1,
            forFriend:true, forDead:true },
        { id:10, name:textAllDeadFriend, needsSelection:false, targetCount:TargetManager.TARGET_COUNT_ALL,
            forFriend:true, forDead:true, forAll:true },
        { id:11, name:textUser, needsSelection:false, targetCount:1,
            forFriend:true, forAlive:true, forUserOnly:true, },
        { id:12, name:textFriend, needsSelection:true, targetCount:1,
            forFriend:true, forAlive:true, forDead:true },
        { id:13, name:textAllFriends, needsSelection:false, targetCount:TargetManager.TARGET_COUNT_ALL,
            forFriend:true, forAlive:true, forDead:true, forAll:true },
        { id:14, name:textAllAlives, needsSelection:false, targetCount:TargetManager.TARGET_COUNT_ALL,
            forOpponent:true, forFriend:true,forEveryone:true, forAlive:true, forAll:true },
    ];

    // アクションには、「効果範囲」と「対象」がある。
    // 更に周囲に対するもの、という考え方もある。

    //------------------------------------------------------------------------------
    // ColorManager
    /**
     * 効果範囲を表す色を得る。
     * 
     * @returns {string} 効果範囲を表す色
     */
    ColorManager.effectiveColor = function() {
        return effectiveColor;
    };


    //------------------------------------------------------------------------------
    // TextManager
    /**
     * スコープ名を得る。
     * 
     * Note:アイテムやスキルの情報を表示する際、効果範囲を表現するために使用する。
     * 
     * @param {number} scope スコープ
     * @returns {string} スコープ名
     */
    TextManager.scopeName = function(scope) {
        if ((scope > 0) && (scope < $dataItemScopes.length)) {
            const scopeInfo = $dataItemScopes[scope];
            return (scopeInfo) ? (scopeInfo.name || "") : "";
        } else {
            return "";
        }
    };
    
    //------------------------------------------------------------------------------
    // Game_ActionTargetGroup
    /**
     * 初期化する。
     * 
     * @param {number} targetIndex ターゲットID
     * @param {string} name 選択項目名
     * @param {Array<Game_Battler>} mainTargets メインターゲット
     * @param {Array<Game_Battler>} members 効果対象メンバー(メインターゲットと同じであればnull可)
     */
    Game_ActionTargetGroup.prototype.initialize = function(targetIndex, name, mainTargets, members) {
        this._targetIndex = targetIndex;
        this._name = name || "";
        this._mainTargets = mainTargets || [];
        this._members = members || mainTargets || [];
    };

    /**
     * ターゲットインデックスを得る。
     * Note: Game_Actionに持たせるアクション対象識別用インデックス
     * 
     * @returns {number} ターゲットインデックス
     */
    Game_ActionTargetGroup.prototype.targetIndex = function() {
        return this._targetIndex;
    };

    /**
     * ターゲットグループ名を得る。
     * 
     * Note: 使用対象選択時、表示名として使用する。
     * 
     * @returns {string} ターゲットグループ名
     */
    Game_ActionTargetGroup.prototype.name = function() {
        return this._name;
    };

    /**
     * ターゲットのメンバーを得る。
     * 
     * @returns {Array<Game_Battler>} メンバー 
     */
    Game_ActionTargetGroup.prototype.members = function() {
        return this._members.slice();
    };

    /**
     * battlerがメインターゲットかどうかを得る。
     * 
     * @param {Game_Battler} battler 対象
     */
    Game_ActionTargetGroup.prototype.isMainTarget = function(battler) {
        return this._mainTargets.includes(battler);
    };


    //------------------------------------------------------------------------------
    // TargetManager
    /**
     * subjectがitem を使用する時の、選択可能な対象を得る。
     * 
     * @param {Game_Battelr} subject 
     * @param {object} item アイテムまたはスキル
     * @param {boolean} isconfused 混乱しているかどうか
     * @returns {Array<Game_ActionTargetGroup>} 選択可能な対象
     */
    TargetManager.makeSelectableActionTargets = function(subject, item, isConfused) {
        switch (item.scope) {
            case 1: // selected opponent one.
                return this.makeSelectableActionTargetsSelectedOpponent(subject, item, isConfused);
            case 2: // all opponents.
                return this.makeSelectableActionTargetsAllOpponents(subject, item, isConfused);
            case 3: // random one opponent
            case 4: // random two opponents
            case 5: // random three opponents
            case 6: // random four opponents
                return this.makeSelectableActionTargetsRandomOpponents(subject, item, isConfused);
            case 7: // selected alived friend
            case 9: // selected dead friend
            case 12: // selected friend
                return this.makeSelectableActionTargetsOneFriend(subject, item, isConfused);
            case 8: // all alived friends
            case 10: // all dead friend
            case 13: // all friends
                return this.makeSelectableActionTargetsAllFriends(subject, item, isConfused);
            case 11: // user
                return this.makeSelectableActionTargetsUser(subject, item, isConfused);
            case 14: // all alived
                return this.makeSelectableActionTargetsAll(subject, item, isConfused);
        }


    };

    /**
     * subjectがitem()を使用する時の、ターゲット可能なメンバーリストを得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @returns {Array<Game_Battler>} メンバー
     */
    TargetManager.opponentMembers = function(subject, item) {
        const scopeInfo = this.scopeInfo(item.scope);
        const isAlive = !!scopeInfo.forAlive;
        const isDead = !!scopeInfo.forDead;
        return subject.opponentsUnit().members().filter(
            member => ((member.isAlive() && isAlive) || (member.isDead() && isDead))
                && TargetManager.isTargetable(subject, member, item));
    };
    /**
     * subjectがitemを使用する時の、ターゲット可能な味方メンバーリストを得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @returns {Array<Game_Battler>} メンバー
     */
    TargetManager.friendMembers = function(subject, item) {
        const scopeInfo = this.scopeInfo(item.scope);
        const isAlive = !!scopeInfo.forAlive;
        const isDead = !!scopeInfo.forDead;
        return subject.friendsUnit().members().filter(
            member => ((member.isAlive() && isAlive) || (member.isDead() && isDead))
                && TargetManager.isTargetable(subject, member, item));
    };


    /**
     * 選択した敵対者1体の場合の、選択可能な対象を得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @param {boolean} isConfused 混乱しているかどうか。
     * @returns {Array<Game_ActionTargetGroup>} 選択可能メンバー
     */
    TargetManager.makeSelectableActionTargetsSelectedOpponent = function(subject, item, isConfused) {
        const selectable = [];
        let targetIndex = 0;
        const opponentMembers = this.opponentMembers(subject, item);
        for (const member of opponentMembers) {
            const effectiveMembers = this.itemEffectiveMembers(subject, item, member);
            selectable.push(new Game_ActionTargetGroup(targetIndex, member.name(), [ member ], effectiveMembers));
            targetIndex++;
        }

        targetIndex = 1000;
        if (isConfused) {
            // 混乱しているときは味方も対象
            const friendMembers = this.friendMembers(subject, item);
            for (const member of friendMembers) {
                const effectiveMembers = this.itemEffectiveMembers(subject, item, member);
                selectable.push(new Game_ActionTargetGroup(targetIndex, member.name, [ member ], effectiveMembers));
                targetIndex++;
            }
        }
        return selectable;
    };

    /**
     * ランダムな敵対者N体の場合の、選択可能な対象を得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @param {boolean} isConfused 混乱しているかどうか。
     * @returns {Array<Game_ActionTargetGroup>} 選択可能メンバー
     */
    TargetManager.makeSelectableActionTargetsRandomOpponents = function(subject, item, isConfused) {
        const selectable = [];
        const scopeInfo = this.scopeInfo(item.scope);
        const opponentMembers = this.opponentMembers(subject, item);
        if (isConfused) {
            const friendMembers = this.friendMembers(subject, item);
            const targetMembers = opponentMembers.concat(friendMembers);
            selectable.push(new Game_ActionTargetGroup(0, scopeInfo.name, targetMembers, targetMembers));
        } else {
            selectable.push(new Game_ActionTargetGroup(0, scopeInfo.name, opponentMembers, opponentMembers));
        }
        return selectable;
    };

    /**
     * 敵全体を対象とした場合の、選択可能な対象を得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @param {boolean} isConfused 混乱しているかどうか。
     * @returns {Array<Game_ActionTargetGroup>} 選択可能メンバー
     */
    TargetManager.makeSelectableActionTargetsAllOpponents = function(subject, item, isConfused) {
        const scopeInfo = this.scopeInfo(item.scope);
        const selectable = [];

        const opponentMembers = this.opponentMembers(subject, item);
        selectable.push(new Game_ActionTargetGroup(0, scopeInfo.name, opponentMembers, opponentMembers));
        if (isConfused) {
            const friendMembers = this.friendMembers(subject, item).filter(member => member !== subject);
            selectable.push(new Game_ActionTargetGroup(1000, scopeInfo.name, friendMembers, friendMembers));
        }

        return selectable;
    };

    /**
     * 味方1体を対象とした場合の、選択可能な対象を得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @param {boolean} isConfused 混乱しているかどうか。
     * @returns {Array<Game_ActionTargetGroup>} 選択可能メンバー
     */
    TargetManager.makeSelectableActionTargetsOneFriend = function(subject, item, isConfused) {
        const selectable = [];
        let targetIndex = 0;
        const friendMembers = this.friendMembers(subject, item);
        for (const friend of friendMembers) {
            const effectiveTargets = this.itemEffectiveMembers(subject, item, friend);
            selectable.push(new Game_ActionTargetGroup(targetIndex, friend.name(), [ friend ], effectiveTargets));
            targetIndex++;
        }

        targetIndex = 1000;
        if (isConfused) {
            const opponentMembers = this.opponentMembers(subject, item);
            for (const opponent of opponentMembers) {
                const effectiveTargets = this.itemEffectiveMembers(subject, item, opponent);
                selectable.push(new Game_ActionTargetGroup(targetIndex, opponent.name(), [ opponent ], effectiveTargets));
                targetIndex++;
            }
        }
        return selectable;
    };

    /**
     * 味方全体を対象とした場合の、選択可能な対象を得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @param {boolean} isConfused 混乱しているかどうか。
     * @returns {Array<Game_ActionTargetGroup>} 選択可能メンバー
     */
    TargetManager.makeSelectableActionTargetsAllFriends = function(subject, item, isConfused) {
        const scopeInfo = this.scopeInfo(item.scope);
        const selectable = [];

        const friendMembers = this.friendMembers(subject, item);
        selectable.push(new Game_ActionTargetGroup(0, scopeInfo.name, friendMembers, friendMembers));
        if (isConfused) {
            const opponentMembers = this.opponentMembers(subject, item);
            selectable.push(new Game_ActionTargetGroup(1000, scopeInfo.name, opponentMembers, opponentMembers));
        }

        return selectable;
    };

    /**
     * 使用者を対象とした場合の、選択可能な対象を得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @param {boolean} isConfused 混乱しているかどうか。
     * @returns {Array<Game_ActionTargetGroup>} 選択可能メンバー
     */
    // eslint-disable-next-line no-unused-vars
    TargetManager.makeSelectableActionTargetsUser = function(subject, item, isConfused) {
        const scopeInfo = this.scopeInfo(item.scope);
        return [ new Game_ActionTargetGroup(-1, scopeInfo.name, [ subject ], [ subject ])];
    };

    /**
     * 敵味方全体を対象とした場合の、選択可能な対象を得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @param {boolean} isConfused 混乱しているかどうか。
     * @returns {Array<Game_ActionTargetGroup>} 選択可能メンバー
     */
    // eslint-disable-next-line no-unused-vars
    TargetManager.makeSelectableActionTargetsAll = function(subject, item , isConfused) {
        const scopeInfo = this.scopeInfo(item.scope);
        const friendMembers = this.friendMembers(subject, item);
        const opponentMembers = this.opponentMembers(subject, item);
        const allMembers = friendMembers.concat(opponentMembers);

        return [ new Game_ActionTargetGroup(-1, scopeInfo.name, allMembers, allMembers)];

    };

    /**
     * subjectがitemを使用する際、targetを対象にできるかどうかを判定する。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {Game_Battler} target 判定対象
     * @param {object} item DataItem/DataSkill
     * @return {boolean] itemの対象に出来る場合にはtrue, それ以外はfalse.
     */
    // eslint-disable-next-line no-unused-vars
    TargetManager.isTargetable = function(subject, target, item) {
        return true;
    };

    /**
     * ターゲットを得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item アイテムまたはスキル
     * @param {number} targetIndex ターゲットインデックス。(-1は未指定)
     * @param {isForce} アクションを強制指定しているかどうか。
     * @returns {Array<Game_Battler>} 選択可能な対象
     */
    TargetManager.makeActionTargets = function(subject, item, targetIndex, isForce) {
        if (subject.isConfused() && !isForce) {
            // 混乱時の候補
            return this.makeActionTargetsConfused(subject, item);
        } else {
            return this.makeActionTargetsNormal(subject, item, targetIndex, isForce)
        }
    };

    /**
     * 混乱時のアクションターゲットを作成する。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item DataItem/DataSkill
     * @returns {Array<Game_Battler>} ターゲット
     */
    TargetManager.makeActionTargetsConfused = function(subject, item) {
        // 選択可能対象からランダムで選択して選定する。
        const selectableTargets = this.makeSelectableActionTargets(subject, item, true);
        if (selectableTargets.length === 0) {
            // アクション可能な対象なし。
            return [];
        }
        const scopeInfo = this.scopeInfo(item.scope);
        if (scopeInfo.random) {
            // ランダム対象
            const groupSel = Math.randomInt(selectableTargets.length + 1);
            const selectedGroup = selectableTargets[groupSel];
            return this.pickRandomTargets(selectedGroup, scopeInfo.targetCount);
        } else {
            // 何かしらを選択するタイプ
            // 選択対象をランダムで選んで実行。
            const groupSel = Math.randomInt(selectableTargets.length + 1);
            const selectedGroup = selectableTargets[groupSel];
            return selectedGroup.members();
        }
    };

    /**
     * 
     * @param {Game_ActionTargetGroup} group グループ
     * @param {number} targetCount 
     * @returns {Array<Game_Battler>} アクション対象
     */
    TargetManager.pickRandomTargets = function(group, targetCount) {
        const targets = [];
        const targetCandidates = group.members();
        for (let i = 0; i < targetCount; i++) {
            const randomSel = Math.randomInt(targetCandidates.length + 1);
            const targetBattler = targetCandidates[randomSel];
            for (const member of this.itemEffectiveMembers(subject, item, targetBattler)) {
                targets.push(member);
            }
        }
        return targets;
    }

    /**
     * アクションターゲットを得る。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item DataItem/DataSkill
     * @param {number} targetIndex ターゲットインデックス
     * @param {boolean} isForce 強制行動かどうか
     * @returns {Array<Game_Battler>} 対象
     */
    TargetManager.makeActionTargetsNormal = function(subject, item, targetIndex, isForce) {
        const selectableGroups = this.makeSelectableActionTargets(subject, item, false);
        let selectedGroup = selectableGroups.find(selectableTarget => selectableTarget.targetIndex() === targetIndex);
        if (!selectedGroup) {
            // 選択した対象がいない。 -> デフォルトターゲットを設定
            selectedGroup = selectableGroups[0];
        }
        if (selectedGroup) {
            // 対象あり。
            const scopeInfo = this.scopeInfo(item.scope);
            if (scopeInfo.random) {
                // ランダムなのを選出して返す。
                return this.pickRandomTargets(selectedGroup, scopeInfo.targetCount);
            } else {
                return selectedGroup.members();
            }
        } else {
            // 対象なし。
            return [];
        }
    };

    /**
     * subjectがitemをtargetに使用した時の効果範囲を得る。
     * (全体を指定する場合は対象外)
     * 
     * @param {Game_Battler} subject 使用者
     * @param {object} item DataItem/DataWeapon
     * @param {Game_Battler} target 対象
     * @returns {Array<Game_Battler>} 効果範囲になる対象
     */
    // eslint-disable-next-line no-unused-vars
    TargetManager.itemEffectiveMembers = function(subject, item, target) {
        return [ target ];
    };



    /**
     * スコープ情報を得る。
     * 
     * @param {number} scopeId スコープID
     * @returns {object} スコープ情報
     */
    TargetManager.scopeInfo = function(scopeId) {
        return $dataItemScopes[scopeId] || $dataItemScopes[1];
    };

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * 選択可能グループリストを構築する。
     * 
     * @returns {Array<Game_ActionTargetGroup>} 選択可能グループリスト
     */
    Game_Action.prototype.makeSelectableActionTargets = function() {
        const subject = this.subject();
        const item = this.item();
        if (item && subject) {
            return TargetManager.makeSelectableActionTargets(subject, item, false);
        } else {
            return [];
        }
    };
    /**
     * 設定された対象と現在の状態を踏まえた、実際のアクションの対象を作成する。
     * 
     * Note: BattleManager.startActionにて、アクションの対象を取得するために使用される。
     * @returns {Arrah<Game_Battler>} 対象
     * !!!overwrite!!! Game_Action.makeTargets()
     *     ターゲット部分の扱いを変更するため、オーバーライドする。 
     */
    Game_Action.prototype.makeTargets = function() {
        const targets = TargetManager.makeActionTargets(this.subject(), this.item(), this._targetIndex, this._forcing);
        // 繰返し実行分だけ加算。(1つの対象に複数回適用する場合に使用する)
        return this.repeatTargets(targets);
    };
    /**
     * このアクションが敵対者を対象に対するものかどうかを判定する。
     * 
     * @return {boolean} 敵対者を対象にするものの場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.isForOpponent
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.isForOpponent = function() {
        const scopeInfo = TargetManager.scopeInfo(this.item().scope);
        return !!scopeInfo.forOpponent;
    };

    /**
     * このアクションが味方を対象に対するものかどうかを判定する。
     * 
     * @return {boolean} 味方を対象にするものの場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.isForFriend
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.isForFriend = function() {
        const scopeInfo = TargetManager.scopeInfo(this.item().scope);
        return !!scopeInfo.forFriend;
    };

    /**
     * このアクションが敵味方全体を対象に対するものかどうかを判定する。
     * 
     * @return {boolean} 敵味方全体を対象にするものの場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.isForEveryone
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.isForEveryone = function() {
        const scopeInfo = TargetManager.scopeInfo(this.item().scope);
        return !!scopeInfo.forEveryone;
    };

    /**
     * 生存している味方のみを対象に対するものかどうかを判定する。
     * 
     * @return {boolean} 生存している味方を対象にするものの場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.isForAliveFriend
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.isForAliveFriend = function() {
        const scopeInfo = TargetManager.scopeInfo(this.item().scope);
        return (scopeInfo.forAlive && !scopeInfo.forDead) && scopeInfo.forFriend;
    };

    /**
     * 死亡している味方のいみを対象に対するものかどうかを判定する。
     * 
     * @return {boolean} 死亡している味方を対象にするものの場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.isForDeadFriend
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.isForDeadFriend = function() {
        const scopeInfo = TargetManager.scopeInfo(this.item().scope);
        return (!scopeInfo.forAlive && scopeInfo.forDead && scopeInfo.forFriend);
    };

    /**
     * 使用者だけを対象に対するものかどうかを判定する。
     * 
     * @return {boolean} 使用者を対象にするものの場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.isForUser
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.isForUser = function() {
        const scopeInfo = TargetManager.scopeInfo(this.item().scope);
        return !!scopeInfo.forUserOnly;
    };

    /**
     * 単体を対象に対するものかどうかを判定する。
     * 
     * @return {boolean} 単体を対象にするものの場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.isForOne
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.isForOne = function() {
        const scopeInfo = TargetManager.scopeInfo(this.item().scope);
        return (scopeInfo.targetCount === 1);
    };

    /**
     * 対象がランダムかどうかを判定する。
     * 
     * @return {boolean} 対象がランダムの場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.isForRandom
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.isForRandom = function() {
        const scopeInfo = TargetManager.scopeInfo(this.item().scope);
        return !!scopeInfo.random;
    };

    /**
     * 対象全体を対象に対するものかどうかを判定する。
     * 
     * @return {boolean} 全体を対象にするものの場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.isForAll
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.isForAll = function() {
        return this.checkItemScope([2, 8, 10, 13, 14]);
    };

    /**
     * 対象を選択する必要があるかどうかを判定する。
     * 
     * @return {boolean} 選択する必要がある場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.needsSelection
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.needsSelection = function() {
        if (alwaysSelectTarget) {
            return true;
        } else {
            const scopeInfo = TargetManager.scopeInfo(this.item().scope);
            return !!scopeInfo.needsSelection;
        }
    };

    /**
     * ランダム対象のターゲット数を得る
     * 
     * @return {number} ターゲット数
     * !!!overwrite!!! Game_Action.numTargets
     *     スコープ情報を参照するため、オーバーライドする。
     */
    Game_Action.prototype.numTargets = function() {
        const scopeInfo = TargetManager.scopeInfo(this.item().scope);
        return scopeInfo.random ? (scopeInfo.targetCount || 0) : 0;
    };

    /**
     * ランダムに対象を決める。
     * イベントコマンドによりランダムに対象選択する場合に呼ばれる。
     * 
     * Note: ランダムに対象を選択し、_targetIndexを格納する。
     */
    Game_Action.prototype.decideRandomTarget = function() {
        const selectableGroups = TargetManager.makeSelectableActionTargets(this.subject(), this.item(), false);
        const groupSel = Math.randomInt(selectableGroups.length + 1);
        const selectedGroup = selectableGroups[groupSel];
        if (selectedGroup) {
            this._targetIndex = selectedGroup.targetIndex();
        } else {
            this._targetIndex = -1;
        }
    };
    //------------------------------------------------------------------------------
    // Window_ActionTarget
    // アクションターゲット選択ウィンドウ
    Window_ActionTarget.prototype = Object.create(Window_Selectable.prototype);
    Window_ActionTarget.prototype.constructor = Window_ActionTarget;

    /**
     * Window_ActionTargetを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_ActionTarget.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._targetGroups = [];
    };

    /**
     * 選択対象リストを設定する。
     * 
     * @param {Array<Game_ActionTargetGroup>} targetGroups ターゲットグループ選択リスト
     */
    Window_ActionTarget.prototype.setTargetGroups = function(targetGroups) {
        this._targetGroups = targetGroups || [];
        this.refresh();
    };

    /**
     * アクターウィンドウを設定する。
     * 
     * @param {Window_MenuStatus} actorWindow アクターウィンドウ
     */
    Window_ActionTarget.prototype.setActorWindow = function(actorWindow) {
        this._actorWindow = actorWindow;
        this.callUpdateHelp();
    };

    /**
     * 項目数を得る。
     * 
     * @return {number} 項目数。
     */
    Window_ActionTarget.prototype.maxItems = function() {
        return this._targetGroups.length;
    };

    /**
     * ヘルプの更新処理を呼び出す。
     */
    Window_ActionTarget.prototype.callUpdateHelp = function() {
        Window_Selectable.prototype.callUpdateHelp.call(this);
        // 現在の選択状態をUIに反映させる。
        $gameParty.select(null);
        $gameTroop.select(null);
        const group = this.item();
        if (group) {
            for (const member of group.members()) {
                member.select();
            }
        }
        if (group && this._actorWindow) {
            const indics = [];
            const members = $gameParty.members();
            for (let i = 0; i < members.length; i++) {
                if (members[i].isSelected()) {
                    indics.push(i);
                }
            }
            // 効果対象アクターを選択状態にする。
            this._actorWindow.setEffectiveTargets(indics);
        }
    };
    /**
     * ウィンドウを表示状態にする。
     */
    Window_ActionTarget.prototype.show = function() {
        this.refresh();
        this.forceSelect(0);
        $gameTemp.clearTouchState();
        Window_Selectable.prototype.show.call(this);
    };
    /**
     * ウィンドウを非表示にする。
     */
    Window_ActionTarget.prototype.hide = function() {
        Window_Selectable.prototype.hide.call(this);
        $gameParty.select(null);
        $gameTroop.select(null);
    };

    /**
     * 選択されている項目を得る。
     * 
     * @returns {Game_ActionTargetGroup} 選択対象
     */
    Window_ActionTarget.prototype.item = function() {
        return this.itemAt(this.index());
    }

    /**
     * indexの位置にある選択対象を得る。
     * 
     * @param {number} index インデックス
     * @returns {Game_ActionTargetGroup} 選択対象
     */
    Window_ActionTarget.prototype.itemAt = function(index) {
        return ((index >= 0) && (index < this._targetGroups.length))
                ? this._targetGroups[index] : null;
    };

    /**
     * 現在の選択が選択可能かどうかを取得する。
     * 
     * TODO: 選択出来ない項目も表示する場合に使用する。
     * @return {boolean} 選択可能な場合にはture, 選択不可な場合にはfalse
     */
    Window_ActionTarget.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.itemAt(this.index()));
    };

    /**
     * グループが選択可能かどうかを得る。
     * 
     * @param {Game_ActionTargetGroup} group 
     * @returns {boolean} 選択可能な場合にはture, 選択不可な場合にはfalse
     */
    Window_ActionTarget.prototype.isEnabled = function(group) {
        return (group.members().length > 0);
    };
    /**
     * タッチ操作を処理する
     */
    Window_ActionTarget.prototype.processTouch = function() {
        Window_Selectable.prototype.processTouch.call(this);
        if (this.isOpenAndActive()) {
            // 画面上のSprite_Battlerをタッチすると、$gameTemp.touchTarget()がセットされる。
            // $gameTemp.touchTargetを含む選択可能グループが存在するならば、
            // これを選択状態にする。
            const target = $gameTemp.touchTarget();
            if (target) {
                const selectedGroup = this.item();
                if (!selectedGroup || !selectedGroup.isMainTarget(target)) {
                    // 選択されているグループがないか、
                    // 選択されているグループのメンバーでない。 
                    for (let i = 0; i < this._targetGroups.length; i++) {
                        const group = this._targetGroups[i];
                        if (group.isMainTarget(target)) {
                            this.select(i);
                            if ($gameTemp.touchState() === "click") {
                                this.processOk();
                            }
                        }
                    }
                }
                $gameTemp.clearTouchState();
            }
        }
    };

    /**
     * 項目を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_ActionTarget.prototype.drawItem = function(index) {
        const group = this.itemAt(index);
        if (group) {
            const rect = this.itemRect(index);
            this.changePaintOpacity(this.isEnabled(group));
            this.drawText(group.name(), rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };

    //------------------------------------------------------------------------------
    // Scene_Battleの変更

    const _Scene_Battle_destroy = Scene_Battle.prototype.destroy;
    /**
     * Scene_Battleを破棄する。
     * 
     * Note: _actorWindow, _enemyWindowを Container.children から切り離しているため、
     *       個別にdestroy()を呼ぶ必要がある。
     */
    Scene_Battle.prototype.destroy = function() {
        _Scene_Battle_destroy.call(this);
        if (this._actorWindow) {
            this._actorWindow.destroy();
        }
        if(this._enemyWindow) {
            this._enemyWindow.destroy();
        }
    };

    /**
     * スキル使用対象選択用のアクター選択ウィンドウを作成する。
     * 
     * !!!overwrite!!! Scene_Battle.createActorWindow()
     *     アイテム・スキル使用対象のアクターウィンドウを表示させないようにするため、オーバーライドする。
     */
    Scene_Battle.prototype.createActorWindow = function() {
        const rect = this.actorWindowRect();
        this._actorWindow = new Window_BattleActor(rect);
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        //this.addWindow(this._actorWindow);
    };
    /**
     * エネミー選択ウィンドウを作成する。
     * 
     * !!!overwrite!!! Scene_Battle.createActorWindow()
     *     アイテム・スキル使用対象のアクターウィンドウを表示させないようにするため、オーバーライドする。
     */
    Scene_Battle.prototype.createEnemyWindow = function() {
        const rect = this.enemyWindowRect();
        this._enemyWindow = new Window_BattleEnemy(rect);
        this._enemyWindow.setHandler("ok", this.onEnemyOk.bind(this));
        this._enemyWindow.setHandler("cancel", this.onEnemyCancel.bind(this));
        //this.addWindow(this._enemyWindow);

        this.createActionTargetWindow();
    };

    /**
     * アクションターゲットウィンドウを作成する。
     */
    Scene_Battle.prototype.createActionTargetWindow = function() {
        const rect = this.enemyWindowRect();
        this._actionTargetWindow = new Window_ActionTarget(rect);
        this._actionTargetWindow.setHandler("ok", this.onActionTargetOk.bind(this));
        this._actionTargetWindow.setHandler("cancel", this.onActionTargetCancel.bind(this));
        this._actionTargetWindow.setActorWindow(this._actorWindow);
        this.addWindow(this._actionTargetWindow);
    };

    /**
     * アクションターゲットウィンドウを表示するウィンドウ矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_Battle.prototype.actionTargetWindowRect = function() {
        return this.enemyWindowRect();
    };

    const _Scene_Battle_hideSubInputWindows = Scene_Battle.prototype.hideSubInputWindows;
    /**
     * サブ入力ウィンドウを非表示にする。
     */
    Scene_Battle.prototype.hideSubInputWindows = function() {
        _Scene_Battle_hideSubInputWindows.call(this);
        this._actionTargetWindow.deactivate();
        this._actionTargetWindow.hide();
    };

    /**
     * アクター選択を開始する。
     * 
     * !!!overwrite!!! Scene_Battle.startActorSelection
     *     アイテム・スキル使用対象の選択処理置き換えのため、オーバーライドする。
     */
    Scene_Battle.prototype.startActorSelection = function() {
        this._actionTargetWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actionTargetWindow.setHandler("cancel", this.onActorCancel.bind(this));
        this.startActionTargetSelection();
    };

    /**
     * アクターでOKが選択されたときの処理を行う。
     * 
     * !!!overwrite!!! Scene_Battle.onActorOk
     *     アイテム・スキル使用対象の選択処理置き換えのため、オーバーライドする。
     */
    Scene_Battle.prototype.onActorOk = function() {
        this.onActionTargetOk();
        this.hideSubInputWindows();
        this.selectNextCommand();
    };

    /**
     * アクター選択でキャンセル操作されたときの処理を行う。
     * 
     * !!!overwrite!!! Scene_Battle.onActorCancel
     *     アイテム・スキル使用対象の選択処理置き換えのため、オーバーライドする。
     */
    Scene_Battle.prototype.onActorCancel = function() {
        this.onActionTargetCancel();
        this._actionTargetWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case "attack":
                this._statusWindow.show();
                this._actorCommandWindow.activate();
                break;
            case "skill":
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case "item":
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    };
    /**
     * エネミー選択を開始する。
     */
    Scene_Battle.prototype.startEnemySelection = function() {
        this._actionTargetWindow.setHandler("ok", this.onEnemyOk.bind(this));
        this._actionTargetWindow.setHandler("cancel", this.onEnemyCancel.bind(this));
        this.startActionTargetSelection();
    };
    /**
     * エネミー選択でOK操作されたときの処理を行う。
     */
    Scene_Battle.prototype.onEnemyOk = function() {
        this.onActionTargetOk();
        this.hideSubInputWindows();
        this.selectNextCommand();
    };

    /**
     * エネミー選択でキャンセル操作されたときの処理を行う。
     */
    Scene_Battle.prototype.onEnemyCancel = function() {
        this.onActionTargetCancel();
        this._actionTargetWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case "attack":
                this._statusWindow.show();
                this._actorCommandWindow.activate();
                break;
            case "skill":
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case "item":
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    };

    /**
     * アクションターゲット選択を開始する。
     */
    Scene_Battle.prototype.startActionTargetSelection = function() {
        const action = BattleManager.inputtingAction();
        const groups = action.makeSelectableActionTargets();
        this._actionTargetWindow.setTargetGroups(groups);
        this._actionTargetWindow.show();
        this._actionTargetWindow.select(0);
        this._actionTargetWindow.activate();
        this._statusWindow.hide(); // ステータスウィンドウは隠す
    };

    /**
     * アクション対象が選択完了したときの処理を行う。
     */
    Scene_Battle.prototype.onActionTargetOk = function() {
        const action = BattleManager.inputtingAction();
        const selectedGroup = this._actionTargetWindow.item();
        action.setTarget(selectedGroup.targetIndex());
    };

    /**
     * アクション対象選択がキャンセルされたときの処理を行う。
     */
    Scene_Battle.prototype.onActionTargetCancel = function() {
        // なにかあれば
    };

    const _Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
    /**
     * いずれかの入力ウィンドウがアクティブ（選択中）かどうかを判定する。
     * 
     * @return {boolean} いずれかの入力ウィンドウがアクティブな場合にはtrue, それ以外はfalse
     */
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        return _Scene_Battle_isAnyInputWindowActive.call(this)
            || this._actionTargetWindow.active;
    };
    //------------------------------------------------------------------------------
    // Window_MenuStatus
    /**
     * 効果対象のインデックスを設定する。
     * 
     * @param {Array<number>} indics 対象のインデックス
     */
    Window_MenuStatus.prototype.setEffectiveTargets = function(indics) {
        this._effectiveIndics = indics;
        this.refresh();
    };

    /**
     * 効果対象のインデクスをクリアする。
     */
    Window_MenuStatus.prototype.clearEffectiveTargets = function() {
        this._effectiveIndics = null;
        this.refresh();
    };

    const _Window_MenuStatus_drawItem = Window_MenuStatus.prototype.drawItem;
    /**
     * 項目を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_MenuStatus.prototype.drawItem = function(index) {
        this.drawEffectiveBackground(index);
        _Window_MenuStatus_drawItem.call(this, index);
    };

    /**
     * 効果対象バックグラウンドを設定する。
     * 
     * @param {number} index 描画対象インデックス
     */
    Window_MenuStatus.prototype.drawEffectiveBackground = function(index) {
        if (this._effectiveIndics && this._effectiveIndics.includes(index)) {
            const rect = this.itemRect(index);
            const color = ColorManager.effectiveColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
    };
    //------------------------------------------------------------------------------
    // Window_BattleActor
    /**
     * 効果対象のインデックスを設定する。
     * 
     * @param {Array<number>} indics 対象のインデックス
     */
    Window_BattleActor.prototype.setEffectiveTargets = function(indics) {
        this._effectiveIndics = indics;
        this.refresh();
    };

    /**
     * 効果対象のインデクスをクリアする。
     */
    Window_BattleActor.prototype.clearEffectiveTargets = function() {
        this._effectiveIndics = null;
        this.refresh();
    };    
    const _Window_BattleActor_drawItem = Window_BattleActor.prototype.drawItem;
    /**
     * 項目を描画する。
     * 
     * @param {number} index インデックス
     */
    Window_BattleActor.prototype.drawItem = function(index) {
        this.drawEffectiveBackground(index);
        _Window_BattleActor_drawItem.call(this, index);
    };
    /**
     * 効果対象バックグラウンドを設定する。
     * 
     * @param {number} index 描画対象インデックス
     */
    Window_BattleActor.prototype.drawEffectiveBackground = function(index) {
        if (this._effectiveIndics && this._effectiveIndics.includes(index)) {
            const rect = this.itemRect(index);
            const color = ColorManager.effectiveColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
    };
    //------------------------------------------------------------------------------
    // Window_MenuItemName
    Window_MenuItemName.prototype = Object.create(Window_Base.prototype);
    Window_MenuItemName.prototype.constructor = Window_MenuItemName;

    /**
     * Window_MenuItemName
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_MenuItemName.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._item = null;
    };
    /**
     * アイテムを設定する。
     * 
     * @param {object} item アイテム。(DataItem/DataWeapon/DataArmor/DataSkill)
     */
    Window_MenuItemName.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };

    /**
     * 表示をクリアする。
     */
    Window_MenuItemName.prototype.clear = function() {
        this._item = null;
        this.refresh();
    };

    /**
     * コンテンツを再描画する。
     */
    Window_MenuItemName.prototype.refresh = function() {
        const rect = this.baseTextRect();
        this.contents.clear();
        if (this._item) {
            this.drawItemName(this._item, rect.x, rect.y, rect.width);
        }
    };

    //------------------------------------------------------------------------------
    // Scene_ItemBase
    // Note: 対象アクター選択時の処理を変更するためオーバーライドする。

    const _Scene_ItemBase_createActorWindow = Scene_ItemBase.prototype.createActorWindow;
    /**
     * アクター選択ウィンドウを作成する。
     * 
     * Note: スキルやアイテムの使用対象を選択するためのウィンドウ。
     */
    Scene_ItemBase.prototype.createActorWindow = function() {
        _Scene_ItemBase_createActorWindow.call(this);
        this.createItemNameWindow();
        this.createActionTargetWindow();
    };

    /**
     * アイテム名ウィンドウを作成する。
     */
    Scene_ItemBase.prototype.createItemNameWindow = function() {
        const rect = this.itemNameWindowRect();
        this._itemNameWindow = new Window_MenuItemName(rect);
        this.addWindow(this._itemNameWindow);
        this._itemNameWindow.hide();
        this._itemNameWindow.deactivate();
    };
    /**
     * アイテム名表示欄のウィンドウ矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ区経路結城
     */
    Scene_ItemBase.prototype.itemNameWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wx = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wy = Math.min(this.mainAreaTop(), this.helpAreaTop());
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 対象選択ウィンドウを作成する。
     */
    Scene_ItemBase.prototype.createActionTargetWindow = function() {
        const rect = this.actionTargetWindowRect();
        this._actionTargetWindow = new Window_ActionTarget(rect);
        this._actionTargetWindow.setHandler("ok", this.onActionTargetOk.bind(this));
        this._actionTargetWindow.setHandler("cancel", this.onActionTargetCancel.bind(this));
        this.addWindow(this._actionTargetWindow);
        this._actionTargetWindow.setActorWindow(this._actorWindow);
        this._actionTargetWindow.hide();
        this._actionTargetWindow.deactivate();
    };

    /**
     * 対象選択ウィンドウのウィンドウ領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_ItemBase.prototype.actionTargetWindowRect = function() {
        const rect = this.itemNameWindowRect();
        const wx = rect.x;
        const wy = rect.y + rect.height;
        const ww = rect.width;
        const memberDisplayHeight = this.calcWindowHeight($gameParty.members().length, true);
        const wh = Math.min((this.mainAreaHeight() - rect.wh), memberDisplayHeight);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アイテム選択で決定操作されたときの処理を行う。
     * 
     * !!!overwrite!!! Scene_ItemBase.determineItem
     *     対象選択を置き換えるためオーバーライドする。
     */
    Scene_ItemBase.prototype.determineItem = function() {
        const action = new Game_Action(this.user()); // アイテムのときはnullが返るし、skillの時はアクターが返る。
        const item = this.item();
        action.setItemObject(item);
        if (action.isForFriend()) {
            this.showActorWindow();
            //this._actorWindow.selectForItem(this.item());
        } else {
            this.useItem();
            this.activateItemWindow();
        }
    };    

    /**
     * アクター選択ウィンドウを表示する。
     * !!!overwrite!!! Scne_ItemBase.showActorWindow
     *     対象選択を置き換えるためオーバーライドする。
     */
    Scene_ItemBase.prototype.showActorWindow = function() {
        const item = this.item();
        const scopeInfo = TargetManager.scopeInfo(item.scope);
        if (DataManager.isItem(item) && scopeInfo.forUserOnly) {
            const actionTargets = [];
            for (const member of $gameParty.movableMembers()) {
                const selectableTargets = TargetManager.makeSelectableActionTargets(member, item);
                for (const selectableTarget of selectableTargets) {
                    actionTargets.push(selectableTarget);
                }
            }
            this._actionTargetWindow.setTargetGroups(actionTargets);
        } else {
            const actionTargets = TargetManager.makeSelectableActionTargets(this.user(), item);
            this._actionTargetWindow.setTargetGroups(actionTargets);
        }

        this._itemWindow.setItem(item);
        this._itemWindow.show();
        this._actionTargetWindow.show();
        this._actorWindow.show();
        this._actionTargetWindow.activate();
    };
    /**
     * アクター選択ウィンドウを隠す
     * !!!overwrite!!! Scene_ItemBase.hideActorWindow
     *     対象選択を置き換えるためオーバーライドする。
     */
    Scene_ItemBase.prototype.hideActorWindow = function() {
        this._itemWindow.hide();
        this._actionTargetWindow.hide();
        this._actorWindow.hide();
        this._actionTargetWindow.deactivate();
    };
    /**
     * アクター選択ウィンドウがアクティブかどうかを得る。
     * 
     * @returns {boolean} アクティブな場合にはtrue, それ以外はfalse.
     * !!!overwrite!!! Scene_ItemBase.isActorWindowActive
     *     対象選択を置き換えるためオーバーライドする。
     */
    Scene_ItemBase.prototype.isActorWindowActive = function() {
        return this._actionTargetWindow && this._actionTargetWindow.active;
    };

    /**
     * アクターでOK操作されたときの処理を行う。
     */
    Scene_ItemBase.prototype.onActionTargetOk = function() {
        if (this.canUse()) {
            this.useItem();
        } else {
            SoundManager.playBuzzer();
        }
    };
    /**
     * 使用対象アクター選択でキャンセル操作されたときの処理を行う。
     */
    Scene_ItemBase.prototype.onActionTargetCancel = function() {
        this.hideActorWindow();
        this.activateItemWindow();
    };
    /**
     * アイテムの対象となるアクターを得る。
     * 
     * @returns {Array<Game_Actor>} アクター
     * !!!overwrite!!! Scene_ItemBase.itemTargetActors
     *     アイテム・スキル対象を置き換えるためオーバーライドする。
     */
    Scene_ItemBase.prototype.itemTargetActors = function() {
        const group = this._actionTargetWindow.item();
        return group.members();
    };
    /**
     * スキルまたはアイテムを使用可能かどうかを判定する。
     * 
     * @return {boolean} 使用可能な場合にはtrue, 使用できない場合にはfalse.
     * !!!overwrite!!! Scene_ItemBase.canUse
     *     アイテム・スキル対象を置き換えるためオーバーライドする。
     */
    Scene_ItemBase.prototype.canUse = function() {
        // すげえ面倒。
        const item = this.item();
        const scopeInfo = TargetManager.scopeInfo(item.scope);
        if (DataManager.isItem(item) && scopeInfo.forUserOnly) {
            // メンバー全体に対して、使用可能かどうかを判定をする必要がある。
            for (const user of $gameParty.movableMembers()) {
                if (user.canUse(item) && this.isItemEffectsValidWithUser(user)) {
                    return true;
                }
            }
            // 全メンバー使っても効果なし。
            return false;
        } else {
            return this.isItemEffectsValidWithUser(this.user());
        }
    };

    /**
     * subjectが使用したときに、何らかの効果を持っているかどうかを取得する。
     * 
     * @param {Game_Battler} subject 使用者
     * @returns {boolean} 何らかの効果を持っている場合にはtrue, それ以外はfalse.
     */
    Scene_ItemBase.prototype.isItemEffectsValidWithUser = function(subject) {
        const action = new Game_Action(subject);
        action.setItemObject(this.item());
        return this.itemTargetActors().some(target => action.testApply(target));
    };


    /**
     * アイテムを適用する
     * 
     * !!!overwrite!!! Scene_ItemBase.applyItem
     *     アイテム・スキル対象を置き換えるためオーバーライドする。
     */
    Scene_ItemBase.prototype.applyItem = function() {
        const item = this.item();
        const scopeInfo = TargetManager.scopeInfo(item.scope);
        let user = null;
        if (DataManager.isItem(item) && scopeInfo.forUserOnly) {
            const group = _actionTargetWindow.item();
            for (const member of $gameParty.movableMembers()) {
                if (group.isMainTarget(member)) {
                    user = member;
                    break;
                }
            }
        } else {
            user = this.user();
        }

        const action = new Game_Action(user);
        action.setItemObject(item);
        for (const target of this.itemTargetActors()) {
            for (let i = 0; i < action.numRepeats(); i++) {
                action.apply(target);
            }
        }
        action.applyGlobal();
    };

})();