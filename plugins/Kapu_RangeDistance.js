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
 * @min 
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
 * @type number
 * 
 * @param moveRearSkillId
 * @text 後ろに移動コマンドスキルID
 * @desc 後ろに移動する先頭コマンドに割り当てるスキルID。0で未割当。
 * @default 0
 * @type number
 * 
 * @help
 * 戦闘時の射程距離(S/M/L)を追加します。
 * 以下の機能を提供します。
 * ・前衛/後衛の設定を追加。
 * ・戦闘中の前衛・後衛の切り替え
 * ・プラグインコマンドによる前衛・後衛の切り替え
 *   '前に移動コマンドスキルID' '後ろに移動コマンドスキルID'を指定すること。
 *   スキル対象は自分自身にする。
 * ・武器・スキルの射程の概念追加。
 *   S:前衛to前衛
 *   M:前衛to前衛/後衛 または 後衛to前衛
 *   L:前衛/後衛to前衛/後衛
 * ・効果範囲・列の追加
 * 
 * 残りのTODO:
 *     選択対象にレンジを考慮
 *     武器・スキルレンジ
 *     列の効果範囲の追加。(前列/後列/任意の1列)
 *     特性によるスキルレンジ無視
 * 
 * ■ 使用時の注意
 * エネミーグループにはノートタグが設定できません（無念）。
 * エネミーグループの隊列を設定するには、
 * 戦闘開始時のイベントで設定することを想定しています。
 * 
 * ■ プラグイン開発者向け
 * Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION が定義されます。
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
 *     -1:装備品依存
 *      0:Short (前列to前列) 
 *      1:Middle (前列to後列まで / 後列to前列まで)
 *      2:Long (全部)
 * 
 * 武器
 *   <range:range#>
 *      アイテム/スキルの射程を指定する。
 *      未指定時は0
 *      0:Short (前列to前列) 
 *      1:Middle (前列to後列まで / 後列to前列まで)
 *      2:Long (全部)
 * アクター/クラス/ステート/武器/防具/エネミー
 *   <blockMovePosition>
 *      敵対者からの前衛/後衛 移動操作をブロックする。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。まだまだ作りかけ。
 */
(() => {
    const pluginName = 'Kapu_RangeDistance';
    const parameters = PluginManager.parameters(pluginName);
    const moveToFrontSkillId = Number(parameters['moveFrontSkillId']) || 0;
    const moveToRearSkillId = Number(parameters['moveRearSkillId']) || 0;
    Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION = Number(parameters['blockMoveFlagId']) || 0;
    Game_Action.EFFECT_MOVE_BATTLE_POSITION = Number(parameters['effectCode']) || 0;

    PluginManager.registerCommand(pluginName, 'setEnemyBattlePosition', args => {
        const no = Number(args.no) || 0;
        const position = Number(args.position) || 0;
        if ((no >= 0) && (position >= 0) && (position <= 1)) {
            if (!$gameParty.inBattle()) {
                $gameTroop.changeBattlePosition(no, position);
            }
        }
    });

    PluginManager.registerCommand(pluginName, 'setActorBattlePosition', args => {
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
     * 敵対者からの前衛/後衛移動操作をブロックする特性を追加する。
     * 
     * @param {Object} obj 追加するオブジェクト 
     */
    const _addBlockMovePositionTrait = function(obj) {
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_SPECIAL_FLAG, 
            dataId:Game_BattlerBase.FLAG_ID_BLOCK_MOVE_BATTLEPOSITION, 
            value:0
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

            if (obj.meta.range) {
                obj.range = Number(obj.meta.range).clamp(0, 2);
            }
            if (obj.meta.blockMovePosition) {
                _addBlockMovePositionTrait(obj);                
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
            if (obj.meta.blockMovePosition) {
                _addBlockMovePositionTrait(obj);                
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
        _processRangeDistanceTraitNotetag($dataEnemies);

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
            const skill = $dataSkills[moveToFrontSkillId];
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
            if (target.isActor()) {
                const index = $gameParty.members().indexOf(target);
                if (effect.dataId === 0) {
                    return $gameParty.canMoveToFront(index);
                } else if (effect.dataId === 1) {
                    return $gaeParty.canMoveToRear(index);
                } else {
                    return false;
                }
            } else {
                const index = $gameTroop.members().indexOf(target);
                if (effect.dataId === 0) {
                    return $gameTroop.canMoveToFront(index);
                } else if (effect.dataId === 1) {
                    return $gameTroop.canMoveToRear(index);
                } else {
                    return false;
                }
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
            if (target.isActor()) {
                const index = $gameParty.members().indexOf(target);
                if (effect.dataId === 0) {
                    $gameParty.moveToFront(index);
                } else if (effect.dataId === 1) {
                    $gaeParty.moveToRear(index);
                }
            } else {
                const index = $gameTroop.members().indexOf(target);
                if (effect.dataId === 0) {
                    $gameTroop.moveToFront(index);
                } else if (effect.dataId === 1) {
                    $gameTroop.moveToRear(index);
                }
            }
        } else {
            _Game_Action_applyItemEffect.call(this, ...arguments);
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

    //------------------------------------------------------------------------------
    // Game_Unit

    /**
     * 指定されたインデックスのBattlerの戦闘ポジションを変更する。
     * 
     * @param {Number} index インデックス番号
     * @param {Number} newPosition 新しい位置。未指定時は現在の設定と切り替え。
     */
    Game_Unit.prototype.changeBattlePosition = function(index, newPosition) {
        const battler = this.members(index);
        if (battler) {
            if (typeof newPosition === 'undefined') {
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
        if (this.canMoveToFront()) {
            const members = this.members();
            const member = members[index];
            if (member.battlePosition() !== 0) {
                // 誰かが既に前衛 -> 指定Battlerだけ前衛にする。
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
        return this.members().filter(member => member.battlePosition() !== 0);
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
                    "moveToFront", $gameParty.canMoveToRear(index));
            }
            if (moveToRearSkillId) {
                this.addCommand($dataSkills[moveToRearSkillId].name,
                    "moveToRear", $gameParty.canMoveToRear(index));
            }
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
            this._actorCommandWindow.setHandler('moveToFront', this.commandMoveToFront.bind(this));
        }
        if (moveToRearSkillId) {
            this._actorCommandWindow.setHandler('moveToRear', this.commandMoveToRear.bind(this));
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