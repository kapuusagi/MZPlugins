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
 * @orderAfter Kapu_Base_Params
 * 
 * @command gainWmExp
 * @text ウェポンマスタリEXPを上げる
 * @desc ウェポンマスタリのEXPを加算します。
 * 
 * @arg target
 * @text 対象
 * @desc 上昇させる対象
 * @option アクター指定
 * @value actorId
 * @option アクター指定(変数)
 * @value variableId
 * @value パーティー全体
 * @value allMembers
 * 
 * @arg actorId
 * @text アクター指定時の対象
 * @desc アクター指定を選択したときの対象
 * @type actor
 * 
 * @arg variableId
 * @text アクター指定(変数)時の変数ID
 * @desc アクター指定(変数)時の変数ID
 * @type variable
 *
 * @arg wmTypeId
 * @text ウェポンマスタリタイプID
 * @desc ウェポンマスタリのタイプ値。
 * @type number
 * @default 1
 * @min 1
 * 
 * @arg exp
 * @text 加算する経験値
 * @desc 加算する経験値を指定します。
 * @type number
 * @default 1
 * @min 1
 * 
 * @param maxWmLevel
 * @text 最大レベル
 * @desc ウェポンマスタリの最大レベル。
 * @type number
 * @default 99
 * @min 1
 * 
 * @param bareHandsWmTypeId
 * @text 素手武器タイプID
 * @desc 素手の武器タイプとして使用するID
 * @type number
 * @default 0
 * 
 * @param gainWmExpEffectCode
 * @text エフェクトコード
 * @desc ウェポンマスタリーEXPを加算するエフェクトコード
 * @type number
 * @default 1003
 * @min 65
 * 
 * @param debugEnable
 * @text デバッグ
 * @desc trueにすると、デバッグログ出力をする。
 * @type boolean
 * @default false
 * 
 * @help 
 * ウェポンマスタリーのプラグイン。
 * 1回スキルなどを使用する毎に経験値が1たまり、
 * 所定の量に達するとウェポンマスタリがレベルアップする。
 * ウェポンマスタリのレベルが上がると、
 * スキル使用時のATK,HIT,MATにボーナスが加算される。
 * 
 * ■ 使用時の注意
 * なし。
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンド使うより、スクリプト挿入の方が楽よ。
 * 
 * 特定のアクターのウェポンマスタリ タイプ7のEXPを80上げる
 *     $gameActor.actor(actorId).gainWmExp(7, 80);
 * パーティーメンバ3人目のウェポンマスタリ タイプ7のEXPを80上げる
 *     $gameParty.allMembers()[3].gainWmExp(7, 80);
 * 全パーティーメンバーのウェポンマスタリ タイプ7のEXPを80上げる
 *     for (const member of $gameParty.allMembers()) {
 *         member.gainWmExp(7, 80);
 *     }
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
 *     <wmTypeId:typeId#>
 *         このスキルが関係する、マスタリータイプに割り当てる武器タイプID。
 *         未指定時は装備品のものが適用される。
 *     <wmExp:value#>
 *         スキル使用時のウェポンマスタリー経験値を指定する。
 *         省略時は1になる。
 * 
 * アイテム/スキル
 *     <gainWmExp:wmTypeId#,exp#,exprate#>
 *          使用すると、対象のウェポンマスタリーEXPを
 *          exp#(固定量)+(exprate#)割合だけ上昇させる。

 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Twld_WeaponMastery";
    const parameters = PluginManager.parameters(pluginName);
    const maxWmLevel = Number(parameters["maxWmLevel"]) || 99;
    const bareHandsWmTypeId = Number(parameters["bareHandsWmTypeId"]) || 0;
    const debugEnable = (typeof parameters["debugEnable"] === "undefined")
            ? false : (parameters["debugEnable"] === "true");

    Game_Action.EFFECT_GAIN_WM_EXP = Number(parameters["gainWmExpEffectCode"]) || 0;

    if (!Game_Action.EFFECT_GAIN_WM_EXP) {
        console.error(pluginName + ":EFFECT_GAIN_WM_EXP is not valid.");
    }

    /**
     * プラグインコマンドの対象を得る。
     * 
     * @param {Object} args プラグインコマンド引数
     * @return {Array<Game_Actor>} 対象のGame_Actorオブジェクト
     */
    const _getTargets = function(args) {
        switch (args.target) {
            case "actorId":
                {
                    const actorId = Number(args.actorId) || 0;
                    if (actorId > 0) {
                        const actor = $gameActors.actor(actorId)
                        if (actor) {
                            return [actor];
                        }
                    }
                }
                break;
            case "variableId":
                {
                    const variableId = Number(args.variableId) || 0;
                    if (variableId > 0) {
                        const actor = $gameActors.actor($gameVariables.value(variableId));
                        if (actor) {
                            return [actor];
                        }
                    }
                }
                break;
            case "allMembers":
                return $gameParty.allMembers();
        }

        return [];
    };

    PluginManager.registerCommand(pluginName, "gainWmExp", args => {
        const targets = _getTargets(args);
        const wmTypeId = Number(args.wmTypeId);
        const exp = Number(args.exp) || 0;
        if ((targets.length > 0) && (wmTypeId > 0) && (wmTypeId < $dataSystem.weaponTypes.length) && (exp > 0)) {
            for (const target of targets) {
                target.gainWmExp()
            }

        }

    });
    //------------------------------------------------------------------------------
    // DataManager
    if (Game_Action.EFFECT_GAIN_WM_EXP) {
        /**
         * 値文字列からレートを得る。
         * 
         * @param {String} str 値文字列
         * @return {Number} レート文字列
         */
        const _getRate = function(str) {
            if (str.slice(-1) === "%") {
                return Number(str.slice(0, str.length - 1)) / 100.0;
            } else {
                return Number(str);
            }
    
        };
        /**
         * ノートタグを処理する。
         * 
         * @param {Object} obj データオブジェクト。(DataItem/DataSkill)
         */
        const _processNotetag = function(obj) {
            if (obj.meta.gainWmExp) {
                const tokens = obj.meta.gainWmExp.split(",");
                if (tokens.length >= 3) {
                    const wmTypeId = Math.floor((Number(tokens[0]) || 0));
                    const exp = Math.floor((Number(tokens[1]) || 0));
                    const expRate = _getRate(tokens[2]);
                    if ((wmTypeId > 0) && (wmTypeId < $dataSystem.weaponTypes.length)
                            && ((exp > 0) || (expRate > 0))) {
                        obj.effects.push({
                            code: Game_Action.EFFECT_GAIN_WM_EXP,
                            dataId: wmTypeId,
                            value1: exp,
                            value2: expRate
                        });
                    }
                }

            }
        };

        DataManager.addNotetagParserSkills(_processNotetag);
        DataManager.addNotetagParserItems(_processNotetag);
    }


    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * typeIdで指定された武器タイプのマスタリーレベルを得る。
     * 
     * @param {Number} typeId タイプID
     * @return {Number} レベル
     */
    // eslint-disable-next-line no-unused-vars
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
        _Game_Actor_setup.call(this, actorId);
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
            if (debugEnable) {
                console.log(this.name() + ": GainWmExp type=" + typeId + " exp=" + exp + " current=" + this._wm[typeId].exp + "/" + nextExp);
            }
            this._wm[typeId].exp = (this._wm[typeId].exp + exp).clamp(0, nextExp);
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
                this.gainWmExp(wmTypeId, this.skillWmExp(item));
            }
        }
        _Game_Actor_useItem.call(this, item);
    };

    /**
     * スキル使用時のウェポンマスタリーEXPを取得する。
     * 
     * @param {DataSkill} skill スキル 
     * @return {Number} ウェポンマスタリーEXP
     */
    Game_Actor.prototype.skillWmExp = function(skill) {
        if (skill.meta.wmExp) {
            const exp = Math.floor((Number(skill.meta.wmExp) || 0));
            if (exp > 0) {
                return exp;
            }
        }
        return 1;
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
    // eslint-disable-next-line no-unused-vars
    Game_Enemy.prototype.wmLevel = function(typeId) {
        return this._wmLevel;
    };

    if ("paramEquip" in Game_Actor.prototype) {
        const _Game_Actor_paramEquip = Game_Actor.prototype.paramEquip;
        /**
         * 装備品のパラメータ値合計を得る。
         * 
         * @param {Number} paramId パラメータID
         * @return {Number} 全装備品のパラメータ値合計
         */
        Game_Actor.prototype.paramEquip = function(paramId) {
            const value = _Game_Actor_paramEquip.call(this, paramId);
            if ((paramId === 2) && (bareHandsWmTypeId > 0) && this.hasNoWeapons()) {
                const wmLevel = this.wmLevel(bareHandsWmTypeId);
                return value + Math.floor(wmLevel * this.str * 0.02);
            } else {
                return value;
            }
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

    if (Game_Action.EFFECT_GAIN_WM_EXP) {
        const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
        /**
         * 効果を適用する。
         * 
         * @param {Game_Battler} target ターゲット
         * @param {DataEffect} effect エフェクトデータ
         */
        Game_Action.prototype.applyItemEffect = function(target, effect) {
            if (effect.code === Game_Action.EFFECT_GAIN_WM_EXP) {
                this.applyItemEffectGainWmExp(target, effect);
            } else if (Game_Action.EFFECT_RESET_GROWS
                    && (effect.code === Game_Action.EFFECT_RESET_GROWS)) {
                this.applyItemEffectResetGrows(target, effect);
            } else {
                _Game_Action_applyItemEffect.call(this, target, effect);
            }
        };
    
        /**
         * 効果を適用する。
         * 
         * @param {Game_Battler} target ターゲット
         * @param {DataEffect} effect エフェクトデータ
         */
        Game_Action.prototype.applyItemEffectGainWmExp = function(target, effect) {
            if (target.isActor()) {
                const wmTypeId = effect.dataId;
                const exp = effect.value1 + effect.value2 * target.wmExpNext(wmTypeId);
                target.gainWmExp(wmTypeId, exp);
                this.makeSuccess(target);
            }
        };
    
    }

})();