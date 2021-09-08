/*:ja
 * @target MZ 
 * @plugindesc 戦闘AIマネージャ
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_TargetManager
 * @orderAfter Kapu_TargetManager
 * 
 * @help
 * 戦闘AIを拡張できるようにするためのベースプラグイン。
 * ベーシックシステムではエネミーは、データベースで指定されたレートと確率を使用して取る行動が選択される。
 * 一方アクターの自動戦闘は、可能なアクションから取り得る行動を列挙し、評価した結果が選択される。
 * これらを統一的に処理できるようにする。
 * 
 * 思考パターン
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * 基本的な考え方
 * 全ての取り得る行動と、取り得るアクションパターンを生成する。
 * 上記の組み合わせに対して、評価値を作る（ここがAIで差別化。エネミーの時は重み付けして乱数も使おう)
 * 上記を元に行動をセットする。
 * 
 * 最も評価値が高いやつとすると、N回行動するやつらは同じ行動をすることになるなあ。
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
 * Game_BattleAIBase
 * 
 * @class
 * AIベースクラス
 */
function Game_BattleAIBase() {
    this.initialize(...arguments);
}

/**
 * Game_BattleAIEnemyDefault
 * 
 * @class
 * エネミーデフォルトAI
 */
function Game_BattleAIEnemyDefault() {
    this.initialize(...arguments);
}

/**
 * Game_BattleAIActorDefault
 * 
 * @class
 * アクターデフォルトAI
 */
function Game_BattleAIActorDefault() {
    this.initialize(...arguments);
}
/**
 * BattleAIManager
 * 
 * 戦闘AIマネージャ
 */
function BattleAIManager() {
    throw new Error("This is static class.");
}

(() => {
    const pluginName = "Kapu_BattleAIManager";
    const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // Game_BattleAIBase
    Game_BattleAIBase.prototype.initialize = function() {

    };

    /**
     * アクター/エネミー毎に保持する、戦闘AI学習データを作成する。
     * Note:ここで構築したデータはセーブデータに保存される。
     * 
     * @returns {object} 学習AIデータ(あれば)
     */
    Game_BattleAIBase.prototype.createStudyData = function() {
        return {};
    };
    /**
     * 学習データデータ名を得る。
     * 例えば「みんながんばれ」と「がしがしいこうぜ」でエネミーに対する共通の学習レベルを持たせたい場合など、
     * ここで同じデータ名を返すようにする。
     * 
     * Note: 学習データを持たせない場合には空文字列を返す。
     * 
     * @returns {string} データ名
     */
    Game_BattleAIBase.prototype.studyDataName = function() {
        return "";
    };

    /**
     * このAIにて、最適な行動を取る。
     * 
     * @param {Array<Game_Action} actionList 設定対象のアクション
     * @param {Array<DataActionEntry>} useableActions 実行可能なアクションリスト
     * @param {object} studyData 学習データ
     */
    Game_BattleAIBase.prototype.setupActions = function(actionList, useableActions, studyData) {
        if (actionList.length === 0) {
            return;
        }
        const subject = actionList[0].subject();

        // subjectが実行可能な行動を列挙する。
        const selectableActionList = this.selectableActions(subject, useableActions);

        for (let i = 0; i < actionList.length; i++) {
            const action = actionList[i];
            actionList[i] = this.selectAction(action, selectableActionList, studyData);
        }
    };

    /**
     * アクションを選択する。
     * 
     * @param {Game_Action} action 設定対象アクション
     * @param {List<DataActionEntry>} selectableActions 選択可能アクションを得る。
     * @param {object} studyData 学習データ
     * @retuns {Game_Action} 設定したアクション。actionを返してもいいし、別なアクションを構築してもいい。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattleAIBase.prototype.setupAction = function(action, selectableActions, studyData) {
        action.setAttack();
        return action;
    };

    /**
     * AIによって選択可能なアクション候補を得る。
     * 
     * @param {Array<DataActionEntry>} actionList アクションリスト
     * @retuns {Array<DataActionEntry} アクションリスト
     */
    Game_BattleAIBase.prototype.selectableActions = function(subject, actionList) {
        return actionList.filter(actionEntry => this.isActionValid(subject, actionEntry));
    };

    /**
     * アクションが使用可能かどうかを判定する。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {DataActionEntry} actionEntry アクションエントリ
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattleAIBase.prototype.isActionValid = function(subject, actionEntry) {
        return true;
    };

    /**
     * アクションのアイテムを得る。
     * 
     * @param {DataActionEntry} actionEntry アクションエントリ
     * @returns {object} DataItem/DataSkill
     */
    Game_BattleAIBase.prototype.actionItem = function(actionEntry) {
        if (actionEntry.skillId > 0) {
            return $dataSkills[actionEntry.skillId];
        } else if (actionEntry.itemId > 0) {
            return $dataItems[actionEntry.itemId];
        } else {
            return null;
        }
    };

    //------------------------------------------------------------------------------
    // BattleAIEnemyDefault
    Game_BattleAIEnemyDefault.prototype = Object.create(Game_BattleAIBase.prototype);
    Game_BattleAIEnemyDefault.prototype.constructor = Game_BattleAIEnemyDefault;

    /**
     * 初期化する。
     */
    Game_BattleAIEnemyDefault.prototype.initialize = function() {
        Game_BattleAIBase.prototype.initialize.call(this);

    };
    /**
     * AIによって選択可能なアクション候補を得る。
     * 
     * Note: アクションリストから、最大のレーティングより3つ以上低いものは除外する。
     * 
     * @param {Array<DataActionEntry>} actionList アクションリスト
     * @retuns {Array<DataActionEntry} アクションリスト
     */
    Game_BattleAIEnemyDefault.prototype.selectableActions = function(subject, actionList) {
        const list = Game_BattleAIBase.prototype.selectableActions.call(this, subject, actionList);
        const ratingMax = Math.max(...actionList.map(a => a.rating || 0));
        const ratingZero = ratingMax - 3;
        return list.filter(a => a.rating > ratingZero);
    };
    /**
     * アクションを選択する。
     * 
     * @param {Game_Action} action 設定対象アクション
     * @param {List<DataActionEntry>} selectableActions 選択可能アクション。
     * @param {object} studyData 学習データ
     * @retuns {Game_Action} 設定したアクション。actionを返してもいいし、別なアクションを構築してもいい。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattleAIEnemyDefault.prototype.setupAction = function(action, selectableActions, studyData) {
        const actionEntry = this.selectActionByRating(selectableActions)
        if (actionEntry) {
            if (actionEntry.skillId) {
                action.setSkill(actionEntry.skillId);
            } else if (actionEntry.itemId) {
                action.setItem(actionEntry, itemId);
            } else {
                action.clear();
            }
        } else {
            action.clear();
        }
        return action;
    };

    /**
     * ratingを元に行動を選択する。
     * 
     * @param {List<DataActionEntry>} selectableActions 選択可能アクション。 
     * @returns {DataActionEntry} アクションエントリ
     */
    Game_BattleAIEnemyDefault.prototype.selectActionByRating = function(selectableActions) {
        const ratingMax = Math.max(...selectableActions.map(a => a.rating || 0));
        const ratingZero = ratingMax - 3;
        const sum = selectableActions.reduce((r, a) => r + a.rating - ratingZero, 0);
        if (sum > 0) {
            let value = Math.randomInt(sum);
            for (const actionEntry of selectableActions) {
                value -= actionEntry.rating - ratingZero;
                if (value < 0) {
                    return actionEntry;
                }
            }
        } else {
            return null;
        }
    };

    //------------------------------------------------------------------------------
    // BattleAIActorDefault
    Game_BattleAIActorDefault.prototype = Object.create(Game_BattlerAIBase.prototype);
    Game_BattleAIActorDefault.prototype.constructor = Game_BattleAIActorDefault;

    /**
     * 初期化する。
     */
    Game_BattleAIActorDefault.prototype.initialize = function() {
        Game_BattleAIBase.prototype.initialize.call(this);
    };

    /**
     * アクションを選択する。
     * 
     * @param {Game_Action} action 設定対象アクション
     * @param {List<DataActionEntry>} selectableActions 選択可能アクション。
     * @param {object} studyData 学習データ
     * @retuns {Game_Action} 設定したアクション。actionを返してもいいし、別なアクションを構築してもいい。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattleAIActorDefault.prototype.setupAction = function(action, selectableActions, studyData) {
        const candidateActions = [];

        for (const actionEntry of this.selectableActions) {
            const a = new Game_Action(this);
            if (actionEntry.skillId) {
                a.setSkill(actionEntry.skillId);
            } else if (actionEntry.itemId) {
                a.setItem(actionEntry.itemId);
            } else {
                continue;
            }
            candidateActions.push(a);
        }

        // 評価してセットする。
        let selectedAction = action;
        let mostEvalValue = Number.MIN_VALUE;
        for (const candidateAction of candidateActions) {
            const evalValue = candidateAction.evaluate();
            if (evalValue > mostEvalValue) {
                mostEvalValue = evalValue;
                selectedAction = candidateAction;
            }
        }
        return selectedAction;
    };


    //------------------------------------------------------------------------------
    // BattleAIManager
    BattleAIManager.aiEntries = {};
    BattleAIManager.AI_NAME_ENEMY_DEFAULT = "ai-enemy-default";
    BattleAIManager.AI_NAME_ACTOR_DEFAULT = "ai-actor-default";
    BattleAIManager[AI_NAME_ENEMY_DEFAULT] = new Game_BattleAIEnemyDefault();
    BattleAIManager[AI_NAME_ACTOR_DEFAULT] = new Game_BattleAIActorDefault();

    /**
     * 戦闘AIを登録する。
     */
    BattleAIManager.registerAI = function(aiName, game_ai) {
        this.aiEntries[aiName] = game_ai;
    };

    /**
     * 指定したAIを得る。
     * 
     * @param {string} aiName AI名
     * @returns {Game_BattleAI}
     */
    BattleAIManager.getAI = function(aiName) {
        return this.aiEntries[aiName];
    };


    
    
    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
    /**
     * メンバーを初期化する。
     */
    Game_Battler.prototype.initMembers = function() {
        _Game_Battler_initMembers.call(this);
        this._aiName = "";
        this._aiStudyData = {};
    };

    /**
     * 戦闘AIを設定する。
     * 
     * @param {string} aiName 戦闘AI名
     */
    Game_Battler.prototype.setBattleAI = function(aiName) {
        const battleAI = BattleAIManager.getAI(this._aiName);
        if (battleAI) {
            if (this._aiName !== aiName) {
                this._aiName = aiName;
    
                const studyDataName = battleAI.studyDataName();
                if (studyDataName && !this._aiStudyData[studyDataName]) {
                    this._aiStudyData[studyDataName] = battleAI.createStudyData();
                }
            }
        }
    };

    /**
     * 戦闘AIを取得する。
     * 
     * @returns {string} 戦闘AI名
     */
    Game_Battler.prototype.battleAI = function() {
        return this._aiName;
    };


    //------------------------------------------------------------------------------
    // Game_Enemy
    const _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
    /**
     * メンバーを初期化する。
     */
    Game_Enemy.prototype.initMembers = function() {
        _Game_Enemy_initMembers.call(this);
        this._aiName = BattleAIManager.AI_NAME_ENEMY_DEFAULT;
    };

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    /**
     * エネミーをセットアップする。
     * 
     * @param {number} enemyId エネミーID
     * @param {number} x X位置
     * @param {number} y Y位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);

        const battleAI = BattleAIManager.getAI(this._aiName);
        const studyDataName = battleAI.studyDataName();
        if (studyDataName && !this._aiStudyData[studyDataName]) {
            this._aiStudyData[studyDataName] = battleAI.createStudyData();
        }

        const dataEnemy = this.enemy();
        if (dataEnemy.meta.battleAI) {
            this.setBattleAI(dataEnemy.meta.battleAI);
        }
    };

    /**
     * エネミーの行動選択をする。
     * 複数回行動する場合、その回数分だけ行動選択される。
     * 
     * @param {Array<DataEnemyAction>} actionList エネミーアクションリスト
     * !!!overwrite!!! Game_Enemy.selectAllActions()
     *     戦闘行動の選択をカスタマイズできるようにするため、オーバーライドする。
     */
    Game_Enemy.prototype.selectAllActions = function(actionList) {
        let battleAI = BattleAIManager.getAI(this.battleAI());
        if (!battleAI) {
            battleAI = BattleAIManager.getAI(BattleAIManager.AI_NAME_ENEMY_DEFAULT);
        }
        const studyData = this._aiStudyData[battleAI.studyDataName()];

        battleAI.setupActions(this._actions, actionList, studyData);
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * メンバーを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._aiName = BattleAIManager.AI_NAME_ACTOR_DEFAULT;
    };
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const battleAI = BattleAIManager.getAI(this._aiName);
        const studyDataName = battleAI.studyDataName();
        if (studyDataName && !this._aiStudyData[studyDataName]) {
            this._aiStudyData[studyDataName] = battleAI.createStudyData();
        }

        const dataActor = this.actor();
        if (dataActor.meta.battleAI) {
            this.setBattleAI(dataActor.meta.battleAI);
        }
    };

    /**
     * 自動戦闘にてアイテムを使うかどうかを得る。
     * 
     * @returns {boolean} アイテムを使う場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.useItemInAutoBattle = function() {
        return false;
    };

    /**
     * 自動戦闘で使用するアイテムを返す。
     * 
     * @retuns {Array<DataItem>} アイテム
     */
    Game_Actor.prototype.useableItemsInAutoBattle = function() {
        return $gameParty.items().filter(item => this.canUse(item));
    };

    /**
     * 自動戦闘行動を作成する。
     * 
     * !!!overwrite!!! Game_Actor.makeAutoBattleActions()
     *     戦闘行動の選択をカスタマイズできるようにするため、オーバーライドする。
     */
    Game_Actor.prototype.makeAutoBattleActions = function() {
        const list = [];
        // 通常攻撃を追加
        list.push({ skillId:this.attackSkillId() });

        // 使用可能なスキルを追加。
        for (const skill of this.usableSkills()) {
            list.push({ skillId:skill.id });
        }

        if (this.useItemInAutoBattle()) {
            // アイテムを追加
            for (const item of this.useableItemsInAutoBattle()) {
                list.push({ itemId:item.id });
            }
        }

        let battleAI = BattleAIManager.getAI(this.battleAI());
        if (!battleAI) {
            battleAI = BattleAIManager.getAI(BattleAIManager.AI_NAME_ACTOR_DEFAULT);
        }
        const studyData = this._aiStudyData[battleAI.studyDataName()];

        battleAI.setupActions(this._actions, actionList, studyData);

        this.setActionState("waiting");
        return ;
    };
})();