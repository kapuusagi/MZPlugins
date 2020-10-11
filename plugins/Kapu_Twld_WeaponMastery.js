/*:ja
 * @target MZ 
 * @plugindesc ウェポンマスタリープラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Twld_Base
 * 
 * @param bareHandsWmTypeId
 * @text 素手武器タイプID
 * @desc 素手の武器タイプとして使用するID
 * @type number
 * @default 0
 * 
 * @help 
 * ウェポンマスタリーのプラグイン。
 * 1回スキルなどを使用する毎に経験値が1たまり、
 * 所定の量に達するとウェポンマスタリがレベルアップする。
 * ウェポンマスタリのレベルが上がると、
 * スキル使用時のATK,HIT,MATKにボーナスが加算される。
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
 *     <weaponMastery:typeId#,level#,exp#>
 *         ウェポンマスタリーのID,レベル、経験値を指定した値にする。
 *         複数指定可能。
 * 
 * エネミー
 *     <wmLevel:level#>
 *         エネミーのウェポンマスタリレベルをlevel#にする。        
 * 
 * スキル
 *     <wmType:typeId#>
 *         このスキルが関係する、マスタリータイプに割り当てる武器タイプID。
 *         未指定時は装備品のものが適用される。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Twld_WeaponMastery";
    const parameters = PluginManager.parameters(pluginName);
    const maxWmLevel = 99;
    const bareHandsWmTypeId = Number(parameters["bareHandsWmTypeId"]) || 0;

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * typeIdで指定された武器タイプのマスタリーレベルを得る。
     * 
     * @param {Number} typeId タイプID
     * @return {Number} レベル
     */
    Game_BattlerBase.prototype.wmLevel = function(typeId) {
        return 0;
    };


    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._wm = [];
    };

    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this);
        const actor = $dataActors[actorId];

        const pattern = /<weaponMastery: *(\d+) *, *(\d+) *, *(\d+) *>/;
        for (const line of actor.note.split(/[\r\n]+/)) {
            const re = line.match(pattern);
            if (re) {
                const typeId = Number(re[1]);
                const level = Number(re[2]).clamp(0, maxWmLevel);
                const exp = Math.max(0, Number(re[3]));
                if ((typeId > 0) && (typeId < $dataSystem.weaponTypes.length)) {
                    if (this._wm[typeId]) {
                        this._wm[typeId].level = level;
                        this._wm[typeId].exp = exp;
                    } else {
                        this._wm[typeId] = { level:level, exp:exp };
                    }
                }
            }
        }
    };
    /**
     * 有効なウェポンマスタリのID列を得る。
     * レベルが1以上(使用した経験あり)のものだけ返す。
     * 
     * @return {Array<Number>} 有効なウェポンマスタリのID配列。
     */
    Game_Actor.prototype.wmTypeIds = function() {
        const wmTypeIds = [];
        for (let i = 1; i < this._wm.length; i++) {
            if (this._wm[i] && (this._wm[i].level > 0)) {
                wmTypeIds.push(i);
            } 
        }
        return wmTypeIds;
    };


    /**
     * typeIdで指定された武器タイプのマスタリーレベルを得る。
     * 
     * @param {Number} typeId タイプID
     * @return {Number} レベル
     */
    Game_Actor.prototype.wmLevel = function(typeId) {
        if ((typeId >= 0) && (typeId < $dataSystem.weaponTypes.length)) {
            if (this._wm[typeId]) {
                return this._wm[typeId].level;
            }
        }
        return 0;
    };
    /**
     * ウェポンマスタリーのEXPを得る。
     * 
     * @param {Number} typeId タイプID
     * @return {Number} 現在のEXP
     */
    Game_Actor.prototype.wmExp = function(typeId) {
        if ((typeId >= 0) && (typeId < $dataSystem.weaponTypes.length)) {
            if (this._wm[typeId]) {
                return this._wm[typeId].exp;
            }
        }
        return 0;
    };

    /**
     * 次のレベルに必要なEXP到達値を得る。
     * あとxxxじゃないので注意。
     * 
     * @param {Number} typeId 武器タイプID
     */
    Game_Actor.prototype.wmExpNext = function(typeId) {
        const wmLevel = this.wmLevel(typeId);
        return Math.pow(wmLevel + 1, 2);
    };

    /**
     * ウェポンマスタリの経験値を上げる。
     * 
     * @param {Number} typeId 武器タイプID
     * @param {Number} exp 経験値
     */
    Game_Actor.prototype.gainWmExp = function(typeId, exp) {
        if ((typeId >= 0) && (typeId < $dataSystem.weaponTypes.length)) {
            if (!this._wm[typeId]) {
                this._wm[typeId] = { level:0, exp:0 };
            }
            const nextExp = this.wmExpNext(typeId);
            this._wm[typeId].exp = (this._wm[typeId].exp + value).clamp(0, nextExp);
            if ((this._wm[typeId].level < maxWmLevel)
                    && (this._wm[typeId].exp >= nextExp)) {
                this._wm[typeId].level += 1;
                this._wm[typeId].exp = 0;
                this.refresh();
            }
        }
    };

    const _Game_Actor_useItem = Game_Actor.prototype.useItem;
    /**
     * スキルまたはアイテムを使用する。
     * 
     * @param {Object} item DataItemまたはDataSkill
     */
    Game_Actor.prototype.useItem = function(item) {
        if (DataManager.isSkill(item)) {
            let wmTypeId = Number(item.meta.wmTypeId) || 0;
            if (wmTypeId < 0) {
                const weapons = this.weapons();
                wmTypeId = (weapons.length > 0) ? weapons[0].wtypeId : bareHandsWmTypeId;
            }
            if (wmTypeId > 0) {
                this.gainWmExp(wmTypeId, 1);
            }
        }
        _Game_Actor_useItem.call(this, item);
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    const _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
    /**
     * Game_Enemyのメンバーを初期化する。
     */
    Game_Enemy.prototype.initMembers = function() {
        _Game_Enemy_initMembers.call(this);
        this._wmLevel = 0;
    };

    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    /**
     * エネミーをセットアップする。
     * 
     * @param {Number} enemyId エネミーID
     * @param {Number} x X位置
     * @param {Number} y Y位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        
        const enemy = $dataEnemies[enemyId];
        if (enemy.meta.wmLevel) {
            this._wmLevel = Math.max(0, (Number(enemy.meta.wmLevel) || 0));
        }
    };
    /**
     * typeIdで指定された武器タイプのマスタリーレベルを得る。
     * 
     * @param {Number} typeId タイプID
     * @return {Number} レベル
     */
    Game_Enemy.prototype.wmLevel = function(typeId) {
        return this._wmLevel;
    };

    if ("bareHandAtk" in Game_Actor.prototype) {
        /**
         * 素手時の攻撃力を得る。
         * 
         * @param {Number} value 値
         * @return {Number} 攻撃力
         */
        Game_Actor.prototype.bareHandAtk = function(value) {
            const wmLevel = this.wmLevel(bareHandsWmTypeId);
            return value + Math.floor(wmLevel * this.str * 0.02);
        };
    }

    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_additionalSubjectTraits = Game_Action.prototype.additionalSubjectTraits;
    /**
     * ダメージ計算時、使用者に追加で付与する特性を取得する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Array<Trait>} trait 特性オブジェクト配列
     */
    Game_Action.prototype.additionalSubjectTraits = function(target) {
        const traits = _Game_Action_additionalSubjectTraits.call(this, target);
        const item = this.item();
        if (DataManager.isSkill(item)) {
            const wmTypeId = this.itemWmTypeId(item);
            const subject = this.subject();
            const wmLevel = subject.wmLevel(wmTypeId);
            if (wmLevel > 0) {
                traits.push({
                    code: Game_BattlerBase.TRAIT_PARAM,
                    dataId: 2, // 2 is ATK
                    value: (1 + wmLevel) / 100
                });
                traits.push({
                    code: Game_BattlerBase.TRAIT_PARAM,
                    dataId: 4, // 4 is MAT
                    value: (1 + wmLevel) / 100
                });
                traits.push({
                    code: Game_BattlerBase.TRAIT_XPARAM,
                    dataId: 0, // 0 is hit.
                    value: (1 + wmLevel) / 400
                });
            }
        }

        return traits;
    };

    /**
     * スキルのウェポンマスタリータイプIDを得る。
     * 
     * @param {Object} item スキル
     */
    Game_Action.prototype.itemWmTypeId = function(item) {
        const wmType = Number(item.meta.wmType) || 0;
        if ((wmType > 0) || (wmType < $dataSystem.weaponTypes.length)) {
            return wmType;
        } else {
            const subject = this.subject();
            if (subject.isActor()) {
                const weapons = subject.weapons();
                if ((item.requiredWtypeId1 > 0)
                        && weapons.some(w => w.wtypeId === item.requiredWtypeId1)) {
                    return item.requiredWtypeId1;
                } else if ((item.requiredWtypeId2 > 0)
                        && weapons.some(w => w.wtypeId === item.requiredWtypeId2)) {
                    return item.requiredWtypeId2;
                } else if (weapons.length > 0) {
                    return weapons[0].wtypeId;
                } else {
                    return bareHandsWmTypeId;
                }
            } else {
                return bareHandsWmTypeId;
            }
        }
    };
})();