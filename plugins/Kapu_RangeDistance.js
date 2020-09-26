/*:ja
 * @target MZ 
 * @plugindesc 射程距離システムプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins

 * ■ setEnemyBattlePosition
 * @command setEnemyBattlePosition
 * @text エネミー戦闘位置設定
 * @desc エネミーの戦闘位置を設定する。戦闘中以外は無効。
 * 
 * @arg no
 * @text 番号
 * @desc グループ上のインデックス番号
 * @type number
 * 
 * @arg position
 * @text 位置
 * @desc 戦闘位置。
 * @type number
 * 
 * @command setActorBattlePosition
 * @text アクター戦闘位置設定
 * @desc アクターの戦闘位置を設定する。
 *
 * @arg no
 * @text 番号
 * @desc 隊列上のインデックス番号
 * @type number
 * 
 * @arg position
 * @text 位置
 * @desc 戦闘位置。
 * @type number
 * @min 0
 * @max 1
 * 
 * @param blockMoveFlagId
 * @text 戦闘位置変更効果フラグID
 * @desc 戦闘位置変更効果を防止するスペシャルフラグID
 * @type number
 * @default 100
 * @min 6
 * 
 * @param longRangeFlagId
 * @text 射程無効効果フラグID
 * @desc 射程が常にLONGRNAGEになるスペシャルフラグID
 * @type number
 * @default 101
 * @min 6
 * 
 * @param effectCode
 * @text 戦闘位置エフェクトコード
 * @desc 移動させる効果を割り当てるエフェクトコード。
 * @type number
 * @default 100
 * @min 4
 * 
 * @param moveFrontSkillId 
 * @text 前に移動コマンドスキルID
 * @desc 前に移動する先頭コマンドに割り当てるスキルID。0で未割当。
 * @default 0
 * @type skill
 * 
 * @param moveRearSkillId
 * @text 後ろに移動コマンドスキルID
 * @desc 後ろに移動する先頭コマンドに割り当てるスキルID。0で未割当。
 * @default 0
 * @type skill
 * 
 * @help
 * 戦闘時の射程距離(S/M/L)を追加します。
 * 以下の機能を提供します。
 * ・前衛/後衛の設定を追加。
 * ・戦闘中の前衛・後衛の切り替え
 * ・プラグインコマンドによる前衛・後衛の切り替え
 *   "前に移動コマンドスキルID" "後ろに移動コマンドスキルID"を指定すること。
 *   スキル対象は自分自身にする。
 * ・武器・スキルの射程の概念追加。
 *   S:前衛to前衛
 *   M:前衛to前衛/後衛 または 後衛to前衛
 *   L:前衛/後衛to前衛/後衛
 * ・効果範囲・列の追加
 *   ノートタグにrangeRowを付与すると、元からのスコープに併せて以下のように振る舞いが変わります。
 *   対象が使用者 -> 使用者＋同列
 *   対象が単体選択 -> 味方1列 or エネミー1列
 * 
 * 
 * ■ 使用時の注意
 * エネミーグループにはノートタグが設定できません（無念）。
 * エネミーグループの隊列を設定するには、
 * 戦闘開始時のイベントで列を設定することを想定しています。
 * 
 * ターゲット選択周りはほぼオーバーライドしているので、
 * 他の対象変更系プラグインと組み合わせると破綻する可能性が高いです（無念）
 * 
 * システムに関わってくるので、UI上の表示は含まれません。
 * 別途用意します。
 * 
 * ■ プラグイン開発者向け
 * Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION が定義されます。
 * Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE が定義されます。
 * Game_Action.EFFECT_MOVE_BATTLE_POSITION が定義されます。
 * 
 * 
 * $gameSystem.isBattlePositionSupported()
 *     戦闘位置がサポートされていることを表す。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム/スキル
 *   <moveToFront>
 *      前衛に移動する効果。例えばエネミーなら引き寄せとか。
 *   <moveToRear>
 *      後衛に移動する効果。例えばエネミー対象にすると、ノックバック効果になる。
 *   <range:range#>
 *      アイテム/スキルの射程を指定する。
 *      未指定時は0
 *     -1:Depends 装備品依存
 *      0:Short (前列to前列) 
 *      1:Middle (前列to後列まで / 後列to前列まで)
 *      2:Long (全部)
 *   <rangeRow>
 *      効果範囲が列であることを指定します。
 * 武器
 *   <range:range#>
 *      アイテム/スキルの射程を指定する。
 *      未指定時は0
 *      0:Short (前列to前列) 
 *      1:Middle (前列to後列まで / 後列to前列まで)
 *      2:Long (全部)
 *   <blockMovePosition>
 *      敵対者からの前衛/後衛 移動操作をブロックする。
 *   <ignoreRangeDistance>
 *      射程距離無視特性を追加する。
 * 
 * アクター/クラス/ステート/防具
 *   <blockMovePosition>
 *      敵対者からの前衛/後衛 移動操作をブロックする。
 * 
 * エネミー
 *   <blockMovePosition>
 *      敵対者からの前衛/後衛 移動操作をブロックする。
 *   <defaultRange:range#>
 *      デフォルトの射程距離をrange#とする。未指定時は0
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。まだまだ作りかけ。
 */
(() => {
    const pluginName = "Kapu_RangeDistance";
    const parameters = PluginManager.parameters(pluginName);
    const moveToFrontSkillId = Number(parameters["moveFrontSkillId"]) || 0;
    const moveToRearSkillId = Number(parameters["moveRearSkillId"]) || 0;
    Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION = Number(parameters["blockMoveFlagId"]) || 0;
    Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE = Number(parameters["longRangeFlagId"]) || 0;
    Game_Action.EFFECT_MOVE_BATTLE_POSITION = Number(parameters["effectCode"]) || 0;

    PluginManager.registerCommand(pluginName, "setEnemyBattlePosition", args => {
        const no = Number(args.no) || 0;
        const position = Number(args.position) || 0;
        if ((no >= 0) && (position >= 0) && (position <= 1)) {
            if (!$gameParty.inBattle()) {
                $gameTroop.changeBattlePosition(no, position);
            }
        }
    });

    PluginManager.registerCommand(pluginName, "setActorBattlePosition", args => {
        const no = Number(args.no) || 0;
        const position = Number(args.position) || 0;
        if ((no >= 0) && (position >= 0) && (position <= 1)) {
            $gameParty.changeBattlePosition(no, position);
        }
    });

    //------------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    /**
     * Scene_Bootを開始する。
     */
    Scene_Boot.prototype.start = function () {
        DataManager.processRangeDistance();
        _Scene_Boot_start.call(this);
    };
    //------------------------------------------------------------------------------
    // DataManager

    /**
     * 戦闘位置移動効果をeffectsに追加する。
     * 
     * @param {Object} obj エフェクトを追加するオブジェクト
     * @param {Number} dataId データID
     */
    const _addEffectMoveBattlePosition = function(obj, dataId) {
        obj.effects.push({
            code: Game_Action.EFFECT_MOVE_BATTLE_POSITION,
            dataId: dataId,
            value1: 0,
            value2: 0
        });
    };

    /**
     * DataSkillのノートタグを処理する。
     * 
     * @param {Array<DataSkill>} dataArray DataSkill配列
     */
    const _processRangeDistanceSkillNotetag = function(dataArray) {
        for (let i = 1; i < dataArray.length; i++) {
            const obj = dataArray[i];
            if (!obj) {
                continue;
            }
            obj.range = 0;

            if ((i != moveToFrontSkillId) && (i != moveToRearSkillId)) {
                if (obj.meta.moveToFront) {
                    _addEffectMoveBattlePosition(obj, 0);
                } else if (obj.meta.moveToRear) {
                    _addEffectMoveBattlePosition(obj, 1);
                }
            }
            if (obj.meta.range) {
                obj.range = Number(obj.meta.range).clamp(-1, 2);
            }
        }
    };

    /**
     * $dataItemsのノートタグを処理する。
     * 
     * @param {Array<DataItem>} dataArray DataItem配列
     */
    const _processRangeDistanceItemNotetag = function(dataArray) {
        for (const obj of dataArray) {
            if (!obj) {
                continue;
            }
            obj.range = 0;

            if (obj.meta.moveToFront) {
                _addEffectMoveBattlePosition(obj, 0);
            } else if (obj.meta.moveToRear) {
                _addEffectMoveBattlePosition(obj, 1);
            }
            if (obj.meta.range) {
                obj.range = Number(obj.meta.range).clamp(-1, 2);
            }
        }
    };
    /**
     * 特性ノートタグを処理する。
     * 
     * @param {TraitObject} obj 特性(traits)を持ったオブジェクト。
     */
    const _processTraitsNoteTag = function(obj) {
        if (obj.meta.blockMovePosition) {
            obj.traits.push({ 
                code:Game_BattlerBase.TRAIT_SPECIAL_FLAG, 
                dataId:Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION, 
                value:0
            });              
        }
        if (obj.meta.ignoreRangeDistance) {
            obj.traits.push({
                code:Game_BattlerBase.TRAIT_SPECIAL_FLAG,
                dataId:Game_BattlerBase.FLAG_ID_IGNORE_RANGEDISTANCE,
                value:0
            });

        }
    };

    /**
     * $dataWeaponsのノートタグを処理する。
     * 
     * @param {Array<DataWeapon>} dataArray DataWeapon配列
     */
    const _processRangeDistanceWeaponNotetag = function(dataArray) {
        for (const obj of dataArray) {
            if (!obj) {
                continue;
            }
            obj.range = 0;

            _processTraitsNoteTag(obj);
            if (obj.meta.range) {
                obj.range = Number(obj.meta.range).clamp(-1, 2);
            }
        }
    };

    /**
     * 特性のノートタグを処理する。
     * 
     * @param {Array<Object>} dataArray データ配列 
     */
    const _processRangeDistanceTraitNotetag = function(dataArray) {
        for (const obj of dataArray) {
            if (!obj) {
                continue;
            }
            _processTraitsNoteTag(obj);
        }
    };
    /**
     * $dataEnemyのノートタグを処理する。
     * 
     * @param {Array<Object>} dataArray データ配列 
     */
    const _processRangeDistanceEnemyNotetag = function(dataArray) {
        for (const obj of dataArray) {
            if (!obj) {
                continue;
            }
            obj.defaultRange = 0;
            _processTraitsNoteTag(obj);
            if (obj.meta.defaultRange) {
                const range = Number(obj.meta.defaultRange) || 0;
                obj.defaultRange = range.clamp(0, 1);
            }

        }
    };
    /**
     * 射程データ及び移動スキルを処理する。
     */
    DataManager.processRangeDistance = function() {
        _processRangeDistanceSkillNotetag($dataSkills);
        _processRangeDistanceItemNotetag($dataItems);
        _processRangeDistanceWeaponNotetag($dataWeapons);
        _processRangeDistanceTraitNotetag($dataActors);
        _processRangeDistanceTraitNotetag($dataClasses);
        _processRangeDistanceTraitNotetag($dataStates);
        _processRangeDistanceTraitNotetag($dataArmors);
        _processRangeDistanceEnemyNotetag($dataEnemies);

        if (moveToFrontSkillId) {
            // エフェクト追加
            const skill = $dataSkills[moveToFrontSkillId];
            if (skill.scope !== 11) {
                console.error("skill: + " + skill.name + " scope is not for self.");
                skill.scope = 11; // 対象を自分自身に変更
            }
            _addEffectMoveBattlePosition(skill, 0);
        }
        if (moveToRearSkillId) {
            // エフェクト追加
            const skill = $dataSkills[moveToRearSkillId];
            if (skill.scope !== 11) {
                console.error("skill: + " + skill.name + " scope is not for self.");
                skill.scope = 11;
            }
            _addEffectMoveBattlePosition(skill, 1);
        }
    };

    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;

    /**
     * 効果を適用可能かどうかを判定する。
     * codeに対応する判定処理が定義されていない場合、適用可能(true)が返る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @param {DataEffect} effect エフェクトデータ
     * @return {Boolean} 適用可能な場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testItemEffect = function(target, effect) {
        if (effect.code === Game_Action.EFFECT_MOVE_BATTLE_POSITION) {
            if ((this.subject().isActor() !== target.isActor())
                    && target.specialFlag(Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION)) {
                // 敵対者からの移動効果は無効
                return false;
            }
            const unit = target.friendsUnit();
            if (effect.dataId === 0) {
                return unit.canMoveToFront(target.index());
            } else if (effect.dataId === 1) {
                return unit.canMoveToRear(target.index());
            } else {
                return false;
            }
        } else {
            return _Game_Action_testItemEffect.call(this, ...arguments);
        }
    };

    const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;

    /**
     * 効果を適用する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {DataEffect} effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        if (effect.code === Game_Action.EFFECT_MOVE_BATTLE_POSITION) {
            if ((this.subject().isActor() !== target.isActor())
                    && target.specialFlag(Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION)) {
                // 敵対者からの移動効果は無効
                return;
            }
            const unit = target.friendsUnit();
            if (effect.dataId === 0) {
                unit.moveToFront(target.index());
                this.makeSuccess(target);
            } else if (effect.dataId === 1) {
                unit.moveToRear(target.index());
                this.makeSuccess(target);
            }
        } else {
            _Game_Action_applyItemEffect.call(this, ...arguments);
        }
    };

    /**
     * 列を対象にしたアクションかどうかを取得する。
     * 
     * @return {Boolean} 列を対象にしたアクションの場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.isForRow = function() {
        const item = this.item();
        return item && item.meta.rangeRow;
    };

    /**
     * このアクションの射程距離を得る。
     * 
     * @return {Number} 射程距離
     */
    Game_Action.prototype.rangeDistance = function() {
        const item = this.item();
        if (item) {
            return this.subject().itemRangeDistance(item);
        } else {
            return -1;
        }
    };

    /**
     * 指定したユニットに適用する射程距離を得る。
     * 
     * @param {Game_Unit} unit ユニット
     * @return {Number} 射程距離
     */
    Game_Action.prototype.rangeDistanceForUnit = function(unit) {
        const subject = this.subject();
        if (unit.members().contains(subject)) {
            return 1; // To firendの場合には1（全員対象）
        } else {
            return this.rangeDistance() - subject.battlePosition();
        }
    };

    /**
     * 混乱時のアクション対象を得る。
     * 
     * Note: Game_Unit.randomTarget()をコールする代わりに、
     *       Game_Action.randomTargets(unit)等をコールするように変更するため、
     *       オーバーライドする。
     * @return {Array<Game_Battler} アクション対象オブジェクトの配列
     * !!!overwrite!!!
     */
    Game_Action.prototype.confusionTarget = function() {
        switch (this.subject().confusionLevel()) {
            case 1:
                return this.randomTargets(this.opponentsUnit());
            case 2:
                if (Math.randomInt(2) === 0) {
                    return this.randomTargets(this.opponentsUnit());
                } else {
                    return this.randomTargets(this.friendsUnit());
                }
            default:
                return this.randomTargets(this.friendsUnit());
        }
    };
    const _Game_Action_targetsForFriends = Game_Action.prototype.targetsForFriends;

    /**
     * 味方に対するアクション対象を得る。
     * 
     * @return {Array<Game_Battler} アクション対象オブジェクトの配列
     */
    Game_Action.prototype.targetsForFriends = function() {
        if (this.isForUser() && this.isForRow()) {
            const unit = this.friendsUnit();
            let row = this.subject().battlePosition();
            return (row === 0) ? unit.frontAliveMembers() : unit.rearAliveMembers();
        } else {
            return _Game_Action_targetsForFriends.call(this);
        }
    };
    /**
     * ランダムに対象を決める。
     * イベントコマンドによりランダムに対象選択する場合に呼ばれる。
     * !!!overwrite!!!
     */
    Game_Action.prototype.decideRandomTarget = function() {
        let target;
        if (this.isForDeadFriend()) {
            const unit = this.friendsUnit();
            const range = this.rangeDistanceForUnit(unit);
            target = unit.randomDeadTargetWithRange(this.subject(), range);
        } else if (this.isForFriend()) {
            const unit = this.friendsUnit();
            const range = this.rangeDistanceForUnit(unit);
            target = unit.randomTargetWithRange(this.subject(), range);
        } else {
            const unit = this.opponentsUnit()
            const range = this.rangeDistanceForUnit(unit);
            target = unit.randomTargetWithRange(this.subject(), range);
        }
        if (target) {
            this._targetIndex = target.index();
        } else {
            this.clear();
        }
    };

    /**
     * グループからランダムな対象を得る。
     * 
     * @param {Game_Unit} unit 対象のグループ
     * @return {Array<Game_Battler>} 対象
     * !!!overwrite!!!
     */
    Game_Action.prototype.randomTargets = function(unit) {
        const targets = [];
        const rangeDistance = this.rangeDistanceForUnit(unit);
        for (let i = 0; i < this.numTargets(); i++) {
            targets.push(unit.randomTargetWithRange(this.subject(), rangeDistance));
        }
        return targets;
    };

    /**
     * グループから死亡対象を得る。
     * 
     * @param {Game_Unit} unit 対象のグループ
     * @return {Array<Game_Battler>} 対象
     * !!!overwrite!!!
     */
    Game_Action.prototype.targetsForDead = function(unit) {
        if (this.isForOne()) {
            const rangeDistance = this.rangeDistanceForUnit(unit);
            if (this.isForRow()) {
                let row = unit.members()[this._targetIndex].battlePosition();
                if ((row > 0) && (unit.rearDeadMembers().length === 0)) {
                    row = 0;
                } else if ((row === 0) && (unit.frontDeadMembers().length === 0)) {
                    row = 1;
                }
                return (row === 0) ? unit.frontAliveMembers() : unit.rearAliveMembers();
            } else {
                return [unit.smoothDeadTargetWithRange(this._targetIndex, this.subject(), rangeDistance)];
            }
        } else {
            return unit.deadMembers();
        }
    };

    /**
     * グループから生存している対象を得る。
     * 
     * @param {Game_Unit} unit 対象のグループ
     * @return {Array<Game_Battler>} 対象
     * !!!overwrite!!!
     */
    Game_Action.prototype.targetsForAlive = function(unit) {
        if (this.isForOne()) {
            const rangeDistance = this.rangeDistanceForUnit(unit);
            if (this.isForRow()) {
                let row;
                if (this._targetIndex < 0) {
                    row = Math.RandomInt(2);
                } else {
                    row = unit.members()[this._targetIndex].battlePosition();
                }
                if ((row > 0) && unit.rearAliveMembers().length === 0) {
                    row = 0; // 後衛に誰も生存者がいない。-> 対象を前列にする。
                }
                return (row === 0) ? unit.frontAliveMembers() : unit.rearAliveMembers();
            } else {
                if (this._targetIndex < 0) {
                    return [unit.randomTargetWithRange(rangeDistance)];
                } else {
                    return [unit.smoothTargetWithRange(this._targetIndex, this.subject(), rangeDistance)];
                }
            }
        } else {
            return unit.aliveMembers();
        }
    };

    /**
     * グループから生存または死亡している対象を得る。
     * 
     * @param {Game_Unit} unit 対象のグループ
     * @return {Array<Game_Battler>} 対象
     * !!!overwrite!!!
     */
    Game_Action.prototype.targetsForDeadAndAlive = function(unit) {
        if (this.isForOne()) {
            if (this.isForRow()) {
                let row = unit.members()[this._targetIndex].battlePosition();
                if ((row > 0) && unit.rearMembers().length === 0) {
                    row = 0; // 後衛に誰も生存者がいない。-> 対象を前列にする。
                }
                return (row === 0) ? unit.frontMembers() : unit.rearMembers();
            } else {
                const rangeDistance = this.rangeDistanceForUnit(unit);
                return unit.smoothDeadAndAliveTarget(this._targetIndex, this.subject(), rangeDistance);
            }
        } else {
            return unit.members();
        }
    };

    //------------------------------------------------------------------------------
    // Game_System
    /**
     * 戦闘位置がサポートされているかどうかを返す。
     * 
     * @return {Boolean} 戦闘位置
     */
    Game_System.prototype.isBattlePositionSupported = function() {
        return true;
    };

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;

    /**
     * Game_BattlerBaseのパラメータを初期化する。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._battlePosition = 0; // 最前列
    };

    /**
     * 戦闘位置を設定する。
     * 
     * @param {Number} position 戦闘位置
     */
    Game_BattlerBase.prototype.setBattlePosition = function(position) {
        this._battlePosition = position;
    };

    /**
     * 戦闘位置を取得する。
     * 
     * @return {Number} 戦闘位置
     */
    Game_BattlerBase.prototype.battlePosition = function() {
        return this._battlePosition;
    };

    /**
     * アイテムまたはスキルの射程距離を得る。
     * 
     * @param {Object} item アイテム(DataITem)またはスキル(DataSkill)
     */
    Game_BattlerBase.prototype.itemRangeDistance = function(item) {
        if (this.specialFlag(Game_BattlerBase.FLAG_ID_SKILLLONGRANGE)) {
            return 2; // 全射程
        }
        if (item.range >= 0) {
            return item.range;
        } else {
            return this.defaultRangeDistance(item);
        }
    };

    /**
     * デフォルトレンジを得る。
     * 
     * @param {Object} item アイテム(DataITem)またはスキル(DataSkill)
     */
    Game_BattlerBase.prototype.defaultRangeDistance = function(item) {
        return 0;
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    /**
     * デフォルトレンジを得る。
     * 
     * @param {Object} item アイテム(DataITem)またはスキル(DataSkill)
     */
    Game_Enemy.prototype.defaultRangeDistance = function(item) {
        const enemy = this.enemy();
        if (enemy) {
            return enemy.defaultRange;
        } else {
            return 0;
        }
    };
    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * デフォルトレンジを得る。
     * 
     * @param {Object} item アイテム(DataITem)またはスキル(DataSkill)
     */
    Game_Actor.prototype.defaultRangeDistance = function(item) {
        // 装備武器レンジを返す。
        const ranges = this.weapons().map(item => item.range);
        if (ranges.length > 0) {
            return this.weapons().min(...ranges);
        } else {
            const bareHandSkillId = this.attackSkillId();
            const bareHandSkill = $dataSkills[bareHandSkillId];
            if (bareHandSkill.range >= 0) {
                return bareHandSkill.range;
            } else {
                return 0;
            }
        }
    };

    //------------------------------------------------------------------------------
    // Game_Unit
    /**
     * メンバーを選択する
     * 
     * @param {Number} battlePosition 戦闘位置 
     */
    Game_Unit.prototype.selectRow = function(battlePosition) {
        for (const member of this.members()) {
            if (member.battlePosition() === battlePosition) {
                member.select();
            } else {
                member.deselect();
            }
        }
    };
    /**
     * 指定されたインデックスのBattlerの戦闘ポジションを変更する。
     * 
     * @param {Number} index インデックス番号
     * @param {Number} newPosition 新しい位置。未指定時は現在の設定と切り替え。
     */
    Game_Unit.prototype.changeBattlePosition = function(index, newPosition) {
        const battler = this.members()[index];
        if (battler) {
            if (typeof newPosition === "undefined") {
                const currentPosition = battler.battlePosition();
                newPosition = (currentPosition > 0) ? 0 : 1;
            } 
            battler.setBattlePosition(newPosition);
            if ((newPosition > 0) && this.inBattle()) {
                // 後ろに下がった場合
                this.updateMembersBattlePosition();
            }
        }
    };

    /**
     * 前に移動可能かどうかを取得する。
     * 
     * @param {Number} index メンバーのインデックス番号
     * @return {Boolean} 前に移動可能な場合にはtrue, それ以外はfalse
     */
    Game_Unit.prototype.canMoveToFront = function(index) {
        // aliveメンバーが全員前衛。
        const members = this.members();
        const member = members[index];
        if (member) {
            if (member.battlePosition() !== 0) {
                return true; // 指定したアクターは後衛。
            } else if (members.every(member => member.battlePosition() === 0)) {
                return true; // 全員前衛。
            }
        }
        return false;
    };

    /**
     * 前に出る。
     * 
     * @param {Number} メンバーのインデックス番号
     */
    Game_Unit.prototype.moveToFront = function(index) {
        // Backと違ってこっちはちょっと面倒。
        if (this.canMoveToFront(index)) {
            const members = this.members();
            const member = members[index];
            if (member.battlePosition() !== 0) {
                // 指定されたアクターは後衛 -> 指定Battlerだけ移動。
                member.setBattlePosition(1);
            } else if (members.every(member => member.battlePosition() === 0)) {
                // 全員前衛時に前に出る -> 指定Battlerは前衛のままで、他は後衛に変更。
                for (let i = 0; i < members.length; i++) {
                    if (i != index) {
                        members[i].setBattlePosition(1);
                    }
                }
            }
        } 
    };

    /**
     * 後衛に移動可能かどうかを判定する。
     * 
     * @param {Number} index メンバーのインデックス番号
     * @return {Boolean} 後ろに移動可能な場合にはtrue, それ以外はfalse
     */
    Game_Unit.prototype.canMoveToRear = function(index) {
        const member = this.members()[index];
        return (member && (member.battlePosition() === 0));
    };

    /**
     * 後退する。
     * 
     * @param {Number} メンバーのインデックス番号
     */
    Game_Unit.prototype.moveToRear = function(index) {
        if (this.canMoveToRear(index)) {
            const member = this.members()[index];
            // 指定Battlerの位置を後ろに移動させて、
            // updateMembersBattlePosition()を呼ぶ。
            // すると、前衛がゼロになっていたら全員前衛に移動する。            
            member.setBattlePosition(1);
            this.updateMembersBattlePosition();
        }
    };

    /**
     * メンバーの戦闘位置を更新する。
     * 
     * 例えば前衛がゼロになったら、後衛を全部出すとかする。
     */
    Game_Unit.prototype.updateMembersBattlePosition = function() {
        if (this.frontAliveMembers().length === 0) {
            // 前衛がいなくなったら後衛を前衛に持ってくる。
            for (const member of this.rearAliveMembers()) {
                member.setBattlePosition(0);
            }
        }
    };

    /**
     * 前衛のメンバーを得る。
     * 
     * @return {Array<Game_Battler>} 前衛メンバー。
     */
    Game_Unit.prototype.frontMembers = function() {
        return this.members().filter(member => member.battlePosition() === 0);
    };

    /**
     * 前衛の生存メンバーを得る。
     * 
     * @return {Array<Game_Battler>} 前衛メンバー。
     */
    Game_Unit.prototype.frontAliveMembers = function() {
        return this.aliveMembers().filter(member => member.battlePosition() === 0);
    };

    /**
     * 前衛の死亡メンバーを得る。
     * 
     * @return {Array<Game_Battler>} 前衛メンバー
     */
    Game_Unit.prototype.frontDeadMembers = function() {
        return this.deadMembers().filter(member => member.battlePosition() === 0);
    };

    /**
     * 後衛のメンバーを得る。
     * 
     * @return {Array<Game_Battler>} 後衛メンバー。
     */
    Game_Unit.prototype.rearMembers = function() {
        return this.members().filter(member => member.battlePosition() !== 0);
    };

    /**
     * 後衛の生存メンバーを得る。
     * 
     * @return {Array<Game_Battler>} 後衛メンバー。
     */
    Game_Unit.prototype.rearAliveMembers = function() {
        return this.aliveMembers().filter(member => member.battlePosition() !== 0);
    };
    /**
     * 後衛の死亡メンバーを得る。
     * 
     * @return {Array<Game_Battler>} 後衛メンバー。
     */
    Game_Unit.prototype.rearDeadMembers = function() {
        return this.deadMembers().filter(member => member.battlePosition() !== 0);
    };

    /**
     * 射程距離内のメンバーを得る。
     * 
     * @param {Number} range 射程距離
     * @return {Array<Game_Battler>} メンバーの配列
     */
    Game_Unit.prototype.membersWithRange = function(range) {
        return this.members().filter(member => member.battlePosition() <= range);
    };

    /**
     * 射程距離内の生存メンバーを得る。
     * 
     * @param {Number} range 射程距離。
     * @return {Array<Game_Battler>} メンバーの配列
     */
    Game_Unit.prototype.aliveMembersWithRange = function(range) {
        return this.aliveMembers().filter(member => member.battlePosition() <= range);
    };

    /**
     * 射程距離内の死亡メンバーを得る。
     * 
     * @param {Number} range 射程距離。
     * @return {Array<Game_Battler>} メンバーの配列
     */
    Game_Unit.prototype.deadMembersWithRange = function(range) {
        return this.deadMembers().filter(member => member.battlePosition() <= range);
    };
    /**
     * 射程距離内メンバーの、ターゲット率の合計を得る。
     * 
     * @return {Number} ターゲット率合計
     */
    Game_Unit.prototype.tgrSumWithRange = function(range) {
        return this.aliveMembersWithRange(range).reduce((r, member) => r + member.tgr, 0);
    };

    /**
     * 射程距離を加味した、ランダムなターゲットを得る。
     * 
     * @param {Number} range 射程距離
     * @return {Game_Battler} ランダムなターゲット
     */
    Game_Unit.prototype.randomTargetWithRange = function(range) {
        let tgrRand = Math.random() * this.tgrSumWithRange(range);
        let target = null;
        for (const member of this.aliveMembersWithRange(range)) {
            tgrRand -= member.tgr;
            if (tgrRand <= 0 && !target) {
                target = member;
            }
        }
        return target;
    };

    /**
     * 射程距離を加味したランダムな死亡ターゲットを得る。
     * 
     * @param {Number} range 射程距離
     * @return {Game_Battler} ランダムな死亡ターゲット
     */
    Game_Unit.prototype.randomDeadTargetWithRange = function(range) {
        const members = this.deadMembersWithRange(range);
        return members.length ? members[Math.randomInt(members.length)] : null;
    };

    /**
     * 射程距離を加味したターゲットを得る。
     * 実際にアクションを起こそうとした際、
     * 対象が死亡していたら切り替えて使用するための対象を得るためのインタフェース。
     * 
     * @param {Number} index インデックス番号
     * @param {Number} range 射程距離
     * @return {Game_Battler} indexで指定したメンバーが生存していれば、そのメンバーが返る。
     *                        生存していなければ、生存メンバーの先頭が返る。
     */
    Game_Unit.prototype.smoothTargetWithRange = function(index, range) {
        const member = this.membersWithRange(range)[Math.max(0, index)];
        return member && member.isAlive() ? member : this.aliveMembersWithRange(range)[0];
    };

    /**
     * 指定された死亡対象を取得する。
     * 
     * @param {Number} インデックス番号
     * @param {Number} 射程距離
     * @return {Game_Battler} Game_Battlerオブジェクト。
     *         indexで指定した対象が死亡していない場合、deadMembers()の先頭が返る。
     */
    Game_Unit.prototype.smoothDeadTargetWithRange = function(index, range) {
        const member = this.membersWithRange(range)[Math.max(0, index)];
        return member && member.isDead() ? member : this.deadMembersWithRange(range)[0];
    };

    /**
     * 射程距離を加味した、生存または死亡対象を得る。
     * 
     * @param {Number} インデックス番号
     * @param {Number} 射程距離
     * @return {Game_Battler} Game_Battlerオブジェクト。
     *         indexで指定した対象が射程距離外の場合、射程距離内の先頭メンバーを得る。
     */
    Game_Unit.prototype.smoothDeadAndAliveTarget = function(index, range) {
        const member = this.membersWithRange(range)[Math.max(0, index)];
        if (member && (member.battlePosition() <= range)) {
            return member;
        } else {
            this.membersWithRange(range)[0];
        }
    };
    //------------------------------------------------------------------------------
    // BattleMamager
    const _BattleManager_endAction = BattleManager.endAction;
    /**
     * アクターまたはエネミーのアクションが完了したときの処理を行う。
     */
    BattleManager.endAction = function() {
        _BattleManager_endAction.call(this);

        // アクションが完了したら、
        // パーティー及びエネミーグループの戦闘位置を更新する。
        $gameParty.updateMembersBattlePosition();
        $gameTroop.updateMembersBattlePosition();
    };

    //------------------------------------------------------------------------------
    // Scene_Menu

    const _Scene_Menu_onFormationOk = Scene_Menu.prototype.onFormationOk;

    /**
     * Scene_Menuで、隊列変更操作にて、OK操作されたときの処理を行う。
     */
    Scene_Menu.prototype.onFormationOk = function() {
        const index = this._statusWindow.index();
        const pendingIndex = this._statusWindow.pendingIndex();
        if (pendingIndex == index) {
            $gameParty.changeBattlePosition(index);
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.redrawItem(index);
            this._statusWindow.activate();
        } else {
            _Scene_Menu_onFormationOk.call(this);
        }
    };
    //------------------------------------------------------------------------------
    // Scene_Battle
    const _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    /**
     * コマンドリストを作成する。
     */
    Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.call(this, ...arguments);
        if (this._actor) {
            const index = $gameParty.members().indexOf(this._actor);
            if (moveToFrontSkillId) {
                this.addCommand($dataSkills[moveToFrontSkillId].name, 
                    "moveToFront", $gameParty.canMoveToFront(index));
            }
            if (moveToRearSkillId) {
                this.addCommand($dataSkills[moveToRearSkillId].name,
                    "moveToRear", $gameParty.canMoveToRear(index));
            }
        }
    };
    //------------------------------------------------------------------------------
    // Window_BattleEnemy

    const _Window_BattleEnemy_initialize = Window_BattleEnemy.prototype.initialize;

    /**
     * Window_BattleEnemyを構築する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BattleEnemy.prototype.initialize = function(rect) {
        _Window_BattleEnemy_initialize.call(this, ...arguments);
        this._actionRangeDistance = 0;
    };

    /**
     * 現在の選択が選択可能かどうかを取得する。
     * 
     * @return {Boolean} 選択可能な場合にtrue, それ以外はfalse
     * !!!overwrite!!!
     */
    Window_BattleEnemy.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.enemy());
    };

    // Note: isEnabledが定義されているかはわからないが、
    //       定義されていたら呼び出すようにする。
    const _Window_BattleEnemy_isEnabled = Window_BattleEnemy.prototype.isEnabled;

    /**
     * 項目が選択可能かどうかを取得する。
     * 
     * @param {Game_Enemy} enemy 選択可否判定するエネミー
     */
    Window_BattleEnemy.prototype.isEnabled = function(enemy) {
        let enabled = this.inSubectRangeDistance(enemy);
        if (enabled && _Window_BattleEnemy_isEnabled) {
            return _Window_BattleEnemy_isEnabled.call(this, enemy);
        } else {
            return enabled;
        }
    };

    /**
     * 項目がスキルの射程内かどうかを判定する。
     * 
     * @param {Game_Enemy} enemy 選択可否判定するエネミー
     */
    Window_BattleEnemy.prototype.inSubectRangeDistance = function(enemy) {
        return enemy && (enemy.battlePosition() <= this._actionRangeDistance);
    };

    const _Window_BattleEnemy_drawItem = Window_BattleEnemy.prototype.drawItem;
    /**
     * 項目を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_BattleEnemy.prototype.drawItem = function(index) {
        const enemy = this._enemies[index];
        this.changePaintOpacity(this.isEnabled(enemy));
        _Window_BattleEnemy_drawItem.call(this, index);
    };

    const _Window_BattleEnemy_refresh = Window_BattleEnemy.prototype.refresh;
    /**
     * ウィンドウを更新する。
     */
    Window_BattleEnemy.prototype.refresh = function() {
        _Window_BattleEnemy_refresh.call(this);
        const action = BattleManager.inputtingAction();
        this._actionRangeDistance
                = (action) ? action.rangeDistanceForUnit($gameTroop) : -1;
    };

    const _Window_BattleEnemy_select = Window_BattleEnemy.prototype.select;

    /**
     * 対象のエネミーを選択する。
     * 
     * @param {Number} index インデックス番号
     * !!!overwrite!!!
     */
    Window_BattleEnemy.prototype.select = function(index) {
        Window_Selectable.prototype.select.call(this, index);

        const action = BattleManager.inputtingAction();
        if (action) {
            if (action.isForRow()) {
                $gameTroop.selectRow(this.enemy().battlePosition());
            } else {
                $gameTroop.select(this.enemy());
            }
        } else {
            $gameTroop.select(null);
        }
    };

    //------------------------------------------------------------------------------
    // Scene_BattleActor
    /**
     * 選択インデックスを設定する。
     * 
     * @param {Number} index インデックス番号
     * !!!overwrite!!!
     */
    Window_BattleActor.prototype.select = function(index) {
        Window_BattleStatus.prototype.select.call(this, index);
        const action = BattleManager.inputtingAction();
        if (action) {
            if (action.isForRow()) {
                $gameParty.selectRow(this.actor().battlePosition());
            } else {
                $gameParty.select(this.actor(index));
            }
        } else {
            $gameParty.select(null);
        }
    };
    //------------------------------------------------------------------------------
    // Scene_Battle

    const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;

    /**
     * アクターコマンドウィンドウを作成する。
     */
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.call(this);
        if (moveToFrontSkillId) {
            this._actorCommandWindow.setHandler("moveToFront", this.commandMoveToFront.bind(this));
        }
        if (moveToRearSkillId) {
            this._actorCommandWindow.setHandler("moveToRear", this.commandMoveToRear.bind(this));
        }
    };

    /**
     * moveToFront が選択された時の処理を行う。
     */
    Scene_Battle.prototype.commandMoveToFront = function() {
        const action = BattleManager.inputtingAction();
        action.setSkill(moveToFrontSkillId);
        this.onSelectAction();
    };

    /**
     * moveToRear が選択された時の処理を行う。
     */
    Scene_Battle.prototype.commandMoveToRear = function() {
        const action = BattleManager.inputtingAction();
        action.setSkill(moveToRearSkillId);
        this.onSelectAction();
    };



})();