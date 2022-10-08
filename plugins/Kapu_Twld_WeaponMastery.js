/*:ja
 * @target MZ 
 * @plugindesc ウェポンマスタリープラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
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
 * ウェポンマスタリー機能を提供するプラグイン。
 * 武器タイプがそのままウェポンマスタリーとなり、
 * その武器での攻撃/スキル使用により、経験値がたまり、
 * 所定の量に達するとウェポンマスタリがレベルアップする。
 * ウェポンマスタリのレベルが上がると、
 * スキル使用時のATK,HIT,MATにボーナスが加算される。
 * 
 * 本プラグインでは1回のアクション実行で、経験値が1溜まる。
 * 
 * 武器での攻撃、スキル使用はいずれもスキルデータが参照される。
 * スキルデータに明示的にウェポンマスタリーID (wmTypeId)を指定することで、
 * そのスキルを使ったときにボーナス参照/経験値加算される武器タイプを指定できる。
 * 
 * 表示用の機能は別プラグインで提供することとした。
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
    Game_BattlerBase.WM_BARE_HANDS = Number(parameters["bareHandsWmTypeId"]) || 0;
    const debugEnable = (typeof parameters["debugEnable"] === "undefined")
            ? false : (parameters["debugEnable"] === "true");

    Game_Action.EFFECT_GAIN_WM_EXP = Number(parameters["gainWmExpEffectCode"]) || 0;

    if (!Game_Action.EFFECT_GAIN_WM_EXP) {
        console.error(pluginName + ":EFFECT_GAIN_WM_EXP is not valid.");
    }

    /**
     * プラグインコマンドの対象を得る。
     * 
     * @param {object} args プラグインコマンド引数
     * @returns {Array<Game_Actor>} 対象のGame_Actorオブジェクト
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
         * @param {string} str 値文字列
         * @returns {number} レート文字列
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
         * @param {object} obj データオブジェクト。(DataItem/DataSkill)
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
     * @param {number} typeId タイプID
     * @returns {number} レベル
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.wmLevel = function(typeId) {
        return 0;
    };

    /**
     * itemのウェポンマスタリタイプ番号を得る。
     * 
     * @param {object} item DataItem / DataSkill
     * @returns {number} ウェポンマスタリタイプ番号。該当するものが無い場合には0
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.itemWmTypeId = function(item) {
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
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const actor = $dataActors[actorId];

        const pattern = /<weaponMastery:(.*)>/;
        for (const line of actor.note.split(/[\r\n]+/)) {
            const re = line.match(pattern);
            if (re) {
                const tokens = re[1].split(",");
                if (tokens.length >= 2) {
                    const typeId = (tokens.length >= 1) ? Number(tokens[0]) : 0;
                    const level = (tokens.length >= 2) ? Number(tokens[1]).clamp(0, maxWmLevel) : 0;
                    const exp = (tokens.length >= 3) ? Math.max(0, Number(tokens[2])) : 0;
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
        }
    };
    /**
     * 有効なウェポンマスタリのID列を得る。
     * レベルが1以上(使用した経験あり)のものだけ返す。
     * 
     * @returns {Array<Number>} 有効なウェポンマスタリのID配列。
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
     * itemのウェポンマスタリタイプ番号を得る。
     * 
     * @param {object} item DataItem / DataSkill
     * @returns {number} ウェポンマスタリタイプ番号。該当するものが無い場合には0
     */
    Game_Actor.prototype.itemWmTypeId = function(item) {
        const wmType = Number(item.meta.wmType) || 0;
        if ((wmType > 0) || (wmType < $dataSystem.weaponTypes.length)) {
            return wmType;
        } else {
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
                return Game_BattlerBase.WM_BARE_HANDS;
            }
        }
    };

    /**
     * typeIdで指定された武器タイプのマスタリーレベルを得る。
     * 
     * @param {number} typeId タイプID
     * @returns {number} レベル
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
     * @param {number} typeId タイプID
     * @returns {number} 現在のEXP
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
     * @param {number} typeId 武器タイプID
     */
    Game_Actor.prototype.wmExpNext = function(typeId) {
        const wmLevel = this.wmLevel(typeId);
        return Math.pow(wmLevel + 1, 2);
    };

    /**
     * ウェポンマスタリの経験値を上げる。
     * 
     * @param {number} typeId 武器タイプID
     * @param {number} exp 経験値
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
     * @param {object} item DataItemまたはDataSkill
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
     * @returns {number} ウェポンマスタリーEXP
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

    const _Game_Actor_isWtypeEquipped = Game_Actor.prototype.isWtypeEquipped;
    /**
     * 指定された武器タイプを装備しているかどうかを判定する。
     * 
     * @param {number} wtypeId 武器タイプID
     * @returns {boolean} 装備している場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.isWtypeEquipped = function(wtypeId) {
        let isEquipped = _Game_Actor_isWtypeEquipped.call(wTypeId);
        if (!isEquipped && (wtypeId === bareHandsWmTypeId) && this.hasNoWeapons()) {
            // 素手武器タイプの場合、武器未装備の場合でも使用可能とする。
            isEquipped = true;
        }
        return isEquipped;
    }

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
     * @param {number} enemyId エネミーID
     * @param {number} x X位置
     * @param {number} y Y位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        
        const enemy = $dataEnemies[enemyId];
        if (enemy.meta.wmLevel) {
            this._wmLevel = Math.max(0, (Number(enemy.meta.wmLevel) || 0));
        }
    };
    /**
     * itemのウェポンマスタリタイプ番号を得る。
     * 
     * @param {object} item DataItem / DataSkill
     * @returns {number} ウェポンマスタリタイプ番号。該当するものが無い場合には0
     */
    Game_Enemy.prototype.itemWmTypeId = function(item) {
        if (DataManager.isSkill(item)) {
            const wmType = Number(item.meta.wmType) || 0;
            if ((wmType > 0) || (wmType < $dataSystem.weaponTypes.length)) {
                return wmType;
            } else {
                return Game_BattlerBase.WM_BARE_HANDS;
            }
        } else {
            return 0;
        }
    };    
    /**
     * typeIdで指定された武器タイプのマスタリーレベルを得る。
     * 
     * @param {number} typeId タイプID
     * @returns {number} レベル
     */
    // eslint-disable-next-line no-unused-vars
    Game_Enemy.prototype.wmLevel = function(typeId) {
        return this._wmLevel;
    };

    /**
     * スキルのウェポンマスタリータイプIDを得る。
     * 
     * @param {object} item スキル
     */
    Game_Action.prototype.itemWmTypeId = function(item) {
        const subject = this.subject();
        return subject.itemWmTypeId(item);
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
