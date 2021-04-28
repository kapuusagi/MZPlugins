/*:ja
 * @target MZ 
 * @plugindesc それぞれの武器スロット毎に装備したアクションを実行できるようにする。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @orderAfter Kapu_EquipSlots
 * @orderAfter Kapu_Base_Damage_Calculation
 * 
 * @help 
 * ２刀流以上の複数武器を装備して、通常攻撃を行った際、
 * それぞれの武器による攻撃を行うようにします。
 * 
 * 計算式はこれまで通りatkが参照されますが、
 * 武器による攻撃を行った際には、その武器だけを装備した場合のパラメータや特性で計算が行われます。
 * 武器にノートタグ noAttack を付けていると、通常攻撃での武器攻撃アクションが発生しません。
 * (弓と矢に分かれている場合に、片側だけを想定します。)
 * 
 * ■ 使用時の注意
 * ダメージ計算のところに関わってくるので、
 * プラグインの順序によって、パラメータ計算が正しくない場合があります。
 * 
 * ■ プラグイン開発者向け
 * 片側装備でのATK/MATKを取得するインタフェースは用意していません。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 武器
 *   <noAttack>
 *      この武器による攻撃は行わない。
 *      常にパラメータや特性の加算対象になる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。実装してみたら意外と簡単だった。
 */
(() => {
    // const pluginName = "Kapu_AttacksOfEachWeapons";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });


    //------------------------------------------------------------------------------
    // BattleManagerの変更
    const _BattleManager_startAction = BattleManager.startAction;
    /**
     * アクターまたはエネミーのアクションを開始する。
     */
    BattleManager.startAction = function() {
        const subject = this._subject;
        const action = subject.currentAction();
        if (action.isAttack()) {
            subject.replaceCurrentAttackAction();
        }
        _BattleManager_startAction.call(this);
    };
    //------------------------------------------------------------------------------
    // Game_Battler
    Game_Battler.prototype.replaceCurrentAttackAction = function() {
        // do nothing on Game_Battler.
    };
    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._ignoreEquipSlots = [];
    };

    const _Game_Actor_equips = Game_Actor.prototype.equips;
    /**
     * このアクターが装備している装備品のコレクションを得る。
     * 未装備スロットのところにはnullが入るので注意。
     * 
     * @return {Array<Object>} 装備品(DataWeapon/DataArmor)の配列。
     */
    Game_Actor.prototype.equips = function() {
        const equips = _Game_Actor_equips.call(this);
        for (let slotNo = 0; slotNo < equips.length; slotNo++) {
            if (this._ignoreEquipSlots[slotNo]) {
                equips[slotNo] = null; // この装備は無効
            }
        }

        return equips;
    };



    /**
     * 現在の通常攻撃アクションを置きかえる。
     */
    Game_Actor.prototype.replaceCurrentAttackAction = function() {
        const action = this._actions.shift();
        if (!action.isAttack()) {
            this._actions.unshift(action);
            return ;
        } else {
            const weaponActions = this.makeWeaponAttackActions(action);
            for (let index = weaponActions.length - 1; index >= 0; index--) {
                action.unshift(weaponActions[index]);
            }
        }
    };

    /**
     * 通常攻撃武器によるアクションを作成する。
     * 
     * @param {Game_Action} action 設定されている通常攻撃アクション
     * @return {Array<Game_Action>} アクション
     */
    Game_Actor.prototype.makeWeaponAttackActions = function(action) {
        const weaponActions = [];

        if (this.hasNoWeapons()) {
            // 素手の場合 -> そのままアクションを返す。
            weaponActions.push(action);
        } else {
            const weaponSkillIds = this.weaponSkillIds();
            if (!weaponSkillIds.includes(action.item().id)) {
                // 装備武器によるアクション以外 -> そのままアクションを返す。
                // 例えば竜化して火を吐くとかね。
                weaponActions.push(action);
            } else {
                // 選択されたのは、装備武器によって設定されたアクションである。
                const equipSlots = this.equipSlots();
                for (let slotNo = 0; slotNo < equipSlots.length; slotNo++) {
                    if (equipSlots[slotNo] === 1) {
                        const skillId = this.equipWeaponSkillId(slotNo);
                        if (skillId > 0) {
                            const weaponAction = new Game_Action(this);
                            weaponAction.setSkill(skillId);
                            weaponAction.setTarget(action.targetIndex());
                            weaponAction.setWeaponSlot(slotNo);
                        }
                    }
                }
                if (weaponActions.length === 0) {
                    weaponActions.push(action);
                }
            }
        }

        if (weaponActions.length === 0) {
            weaponActions.push(action);
        }
        return weaponActions;
    };

    /**
     * 武器スキルIDリストを得る。
     * 
     * @returns {Array<number>} 武器スキルIDリスト
     */
    Game_Actor.prototype.weaponSkillIds = function() {
        const skillIds = [];
        const equipSlots = this.equipSlots();
        for (let slotNo = 0; slotNo < equipSlots.length; slotNo++) {
            if (equipSlots[slotNo] === 1) {
                const skillId = this.equipWeaponSkillId(slotNo);
                if ((skillId > 0) && !skillIds.includes(skillId)) {
                    skillIds.push();
                }
            }
        }
        if (skillIds.length === 0) {
            skillIds.push(this.attackSkillId());
        }
        return skillIds;
    };

    /**
     * 装備スロットの武器に設定されたスキルIDを得る。
     * 
     * @param {number} slotNo スロット番号
     * @returns {number} スキルID
     */
    Game_Actor.prototype.equipWeaponSkillId = function(slotNo) {
        const equips = this.equips();
        const weapon = equips[slotNo];
        if (!DataManager.isWeapon(weapon)) {
            return 0;
        } else if (weapon.meta.noAttack) {
            return 0;
        } else {
            let skillId = 1;
            for (const trait of weapon.traits) {
                if ((trait.code === Game_BattlerBase.TRAIT_ATTACK_SKILL) && (trait.dataId > skillId)) {
                    skillId = trait.dataId;
                }
            }
            return skillId;
        }
    };

    /**
     * 有効な武器スロットを設定する。
     * 
     * @param {number} validSlotNo 武器スロット番号
     */
    Game_Actor.prototype.setValidWeaponSlot = function(validSlotNo) {
        const equipSlots = this.equipSlots();
        const equips = this.equips();
        for (let slotNo = 0; slotNo < equipSlots.length; slotNo++) {
            if ((equipSlots[slotNo] === 1) && (slotNo !== validSlotNo)) {
                // 武器スロットかつ、有効とするスロット番号じゃない。
                const weapon = equips[slotNo];
                if (weapon && !weapon.meta.noAttack) {
                    this._ignoreEquipSlots[slotNo] = true;
                } else {
                    this._ignoreEquipSlots[slotNo] = false;
                }
            } else {
                this._ignoreEquipSlots[slotNo] = false;
            }
        }
    };

    /**
     * 無効スロットをクリアする。
     */
    Game_Actor.prototype.clearIgnoreSlots = function() {
        this._ignoreEquipSlots = [];
    };
    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * ターゲットのインデックス番号を得る。
     * 
     * @returns {number} ターゲットの印デックス番号
     */
    Game_Action.prototype.targetIndex = function() {
        return this._targetIndex;
    };

    const _Game_Action_clear = Game_Action.prototype.clear;
    /**
     * このアクションをクリアする。
     */
    Game_Action.prototype.clear = function() {
        _Game_Action_clear.call(this);
        this._weaponSlot = -1;
        this._isAttack = false;
    };

    const _Game_Action_setAttack = Game_Action.prototype.setAttack;
    /**
     * このアクションに通常攻撃をセットする。
     */
    Game_Action.prototype.setAttack = function() {
        _Game_Action_setAttack.call(this);
        this._isAttack = true;
    };

    const _Game_Action_setGuard = Game_Action.prototype.setGuard;
    /**
     * このアクションに防御をセットする。
     */
    Game_Action.prototype.setGuard = function() {
        _Game_Action_setGuard.call(this);
        this._isAttack = false;
    };

    const _Game_Action_setSkill = Game_Action.prototype.setSkill;
    /**
     * このアクションにスキル使用を設定する。
     * 
     * @param {Number} skillId スキルID
     */
    Game_Action.prototype.setSkill = function(skillId) {
        _Game_Action_setSkill.call(this, skillId);
        this._isAttack = false;
    };

    const _Game_Action_setItem = Game_Action.prototype.setItem;
    /**
     * このアクションにアイテム使用を設定する。
     * 
     * @param {number} itemId アイテムID
     */
    Game_Action.prototype.setItem = function(itemId) {
        _Game_Action_setItem.call(this, itemId);
        this._isAttack = false;
    };

    const _Game_Action_isAttack = Game_Action.prototype.isAttack;
    /**
     * このアクションが通常攻撃かどうかを得る。
     * 
     * @return {Boolean} 通常攻撃の場合にはtrue, それ以外はfalse.
     */
    Game_Action.prototype.isAttack = function() {
        return this._isAttack && _Game_Action_isAttack.call(this);
    };

    /**
     * 武器スロット番号を設定する。
     * 
     * @param {number} slotNo スロット番号
     */
    Game_Action.prototype.setWeaponSlot = function(slotNo) {
        this._weaponSlot = slotNo;
    };

    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    /**
     * ダメージ値を計算する。
     * 
     * @param {Game_BattlerBase} target 対象
     * @param {Boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} ダメージ値
     * !!!overwrite!!! Game_Action.makeDamageValue
     */
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        const subject = this.subject();
        if ((this._weaponSlot >= 0) && subject.isActor()) {
            subject.setValidWeaponSlot(this._weaponSlot);
        }

        _Game_Action_makeDamageValue.call(this, target, critical);

        if (subject.isActor()) {
            subject.clearIgnoreSlots();
        }
    };
})();