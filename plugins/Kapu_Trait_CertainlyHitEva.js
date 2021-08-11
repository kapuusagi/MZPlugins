/*:ja
 * @target MZ 
 * @plugindesc 必ず命中特性プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Hit
 * @orderAfter Kapu_Base_Hit
 * 
 * @param specialFlagIdPhyHit
 * @text 物理必中ヒットフラグID
 * @desc 物理必中特性を割り当てるフラグID
 * @type number
 * @default 103
 * @min 6
 * 
 * @param specialFlagIdMagHit
 * @text 魔法必中ヒットフラグID
 * @desc 魔法必中特性を割り当てるフラグID
 * @type number
 * @default 104
 * @min 6
 * 
 * @param specialFlagIdPhyEva
 * @text 物理回避ヒットフラグID
 * @desc 物理回避特性を割り当てるフラグID
 * @type number
 * @default 105
 * @min 6
 * 
 * @param specialFlagIdMagEva
 * @text 魔法回避ヒットフラグID
 * @desc 魔法回避特性を割り当てるフラグID
 * @type number
 * @default 106
 * @min 6
 * 
 * @param textTraitCertainlyHitPhy
 * @text 物理スキル確定命中特性
 * @desc 物理スキル確定命中特性
 * @type string
 * @default 物理必中
 * 
 * @param textTraitCertainlyHitMag
 * @text 魔法スキル確定命中特性
 * @desc 魔法スキル確定命中特性
 * @type string
 * @default 魔法必中
 * 
 * @param textTraitCertainlyEvaPhy
 * @text 物理完全回避特性
 * @desc 物理完全回避特性
 * @type string
 * @default 物理完全回避
 * 
 * @param textTraitCertainlyEvaMag
 * @text 魔法完全回避特性
 * @desc 魔法完全回避特性
 * @type string
 * @default 魔法完全回避
 * 
 * @help 
 * 攻撃・スキル使用時に必ず命中/回避する特性を追加します。
 * HPダメージを与えるもの、MPダメージを与えるアイテム/スキル/武器攻撃が対象になります。
 * 使用者が必中、受け側が確実回避を持っている場合、回避が優先されます。
 * 完全回避は非ダメージスキルに適用されない。（適用すると回復スキルも回避するため)
 * 
 * ■ 使用時の注意
 * Game_ActionのitemHit/itemEvaを変更します。
 * 
 * ■ プラグイン開発者向け
 * TRAIT_SPECIAL_FLAG を使用し、以下の定義を追加します。
 * Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_PHY
 * Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_MAG
 * Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_PHY
 * Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_MAG
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具/エネミー
 *     <certainlyPhyHit>
 *         物理必中特性を追加する。
 *     <certainlyMagHit>
 *         魔法必中特性を追加する。
 *     <certainlyPhyEva>
 *         物理回避特性を追加する。
 *     <certainlyMagEva>
 *         魔法回避特性を追加する。
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 Game_ActionにはisCertainHitというメソッドがあるため、メソッド名を変更した。
 * Version.0.1.0 新規追加。
 */
(() => {
    const pluginName = "Kapu_Trait_CertainlyHitEva";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_PHY = Number(parameters["specialFlagIdPhyHit"]) || 0;
    Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_MAG = Number(parameters["specialFlagIdMagHit"]) || 0;
    Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_PHY = Number(parameters["specialFlagIdPhyEva"]) || 0;
    Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_MAG = Number(parameters["specialFlagIdMagEva"]) || 0;

    if (!Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_PHY) {
        console.error(pluginName + ":FLAG_ID_CERTAINLY_HIT_PHY is not valid.");
    }
    if (!Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_MAG) {
        console.error(pluginName + ":FLAG_ID_CERTAINLY_HIT_MAG is not valid.");
    }
    if (!Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_PHY) {
        console.error(pluginName + ":FLAG_ID_CERTAINLY_EVA_PHY is not valid.");
    }
    if (!Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_MAG) {
        console.error(pluginName + ":FLAG_ID_CERTAINLY_EVA_MAG is not valid.");
    }
    //------------------------------------------------------------------------------
    // DataManager

    /**
     * ノートタグを処理する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        if (obj.meta.certainlyPhyHit && Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_PHY) {
            obj.traits.push({
                code:Game_BattlerBase.TRAIT_SPECIAL_FLAG,
                dataId:Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_PHY,
                value:0
            });
        } 
        if (obj.meta.certainlyMagHit && Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_MAG) {
            obj.traits.push({
                code:Game_BattlerBase.TRAIT_SPECIAL_FLAG,
                dataId:Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_MAG,
                value:0
            });
        }
        if (obj.meta.certainlyPhyEva && Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_PHY) {
            obj.traits.push({
                code:Game_BattlerBase.TRAIT_SPECIAL_FLAG,
                dataId:Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_PHY,
                value:0
            });
        }
        if (obj.meta.certainlyMagEva && Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_MAG) {
            obj.traits.push({
                code:Game_BattlerBase.TRAIT_SPECIAL_FLAG,
                dataId:Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_MAG,
                value:0
            });
        }
    };

    DataManager.addNotetagParserActors(_processNotetag);
    DataManager.addNotetagParserClasses(_processNotetag);
    DataManager.addNotetagParserWeapons(_processNotetag);
    DataManager.addNotetagParserArmors(_processNotetag);
    DataManager.addNotetagParserStates(_processNotetag);
    DataManager.addNotetagParserEnemies(_processNotetag);
    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._specialFlags && Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_PHY) {
        TextManager._specialFlags[Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_PHY] = parameters["textTraitCertainlyHitPhy"] || "";
    }
    if (TextManager._specialFlags && Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_MAG) {
        TextManager._specialFlags[Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_MAG] = parameters["textTraitCertainlyHitMag"] || "";
    }
    if (TextManager._specialFlags && Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_PHY) {
        TextManager._specialFlags[Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_PHY] = parameters["textTraitCertainlyEvaPhy"] || "";
    }
    if (TextManager._specialFlags && Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_MAG) {
        TextManager._specialFlags[Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_MAG] = parameters["textTraitCertainlyEvaMag"] || "";
    }

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    if (Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_PHY) {
        /**
         * 物理攻撃/スキルが確実にヒットするかどうかを取得する。
         * 
         * @returns {boolean} 確実にヒットする場合にはtrue, それ以外はfalse
         */
        Game_BattlerBase.prototype.testCertainPhyHit = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_PHY);
        };
    } else {
        /**
         * 物理攻撃/スキルが確実にヒットするかどうかを取得する。
         * 
         * @returns {boolean} 確実にヒットする場合にはtrue, それ以外はfalse
         */
        Game_BattlerBase.prototype.testCertainPhyHit = function() {
            return false;
        };
    }

    if (Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_MAG) {
        /**
         * 魔法攻撃/スキルが確実にヒットするかどうかを取得する。
         * 
         * @returns {boolean} 確実にヒットする場合にはtrue, それ以外はfalse.
         */
        Game_BattlerBase.prototype.testCertainMagHit = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_CERTAINLY_HIT_MAG);
        };

    } else {
        /**
         * 魔法攻撃/スキルが確実にヒットするかどうかを取得する。
         * 
         * @returns {boolean} 確実にヒットする場合にはtrue, それ以外はfalse.
         */
        Game_BattlerBase.prototype.testCertainMagHit = function() {
            return false;
        };
    }

    if (Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_PHY) {
        /**
         * 物理攻撃を確実に回避するかどうかを取得する。
         * 
         * @returns {boolean} 確実に回避する場合にはtrue, それ以外はfalse.
         */
        Game_BattlerBase.prototype.testCertainPhyEvad = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_PHY);
        };
    } else {
        /**
         * 物理攻撃を確実に回避するかどうかを取得する。
         * 
         * @returns {boolean} 確実に回避する場合にはtrue, それ以外はfalse.
         */
        Game_BattlerBase.prototype.testCertainPhyEvad = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_PHY);
        };
    }

    if (Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_MAG) {
        /**
         * 魔法攻撃を確実に回避するかどうかを取得する。
         * 
         * @returns {boolean} 確実に回避する場合にはtrue, それ以外はfalse.
         */
        Game_BattlerBase.prototype.testCertainMagEvad = function() {
            return this.specialFlag(Game_BattlerBase.FLAG_ID_CERTAINLY_EVA_MAG);
        };
    } else {
        /**
         * 魔法攻撃を確実に回避するかどうかを取得する。
         * 
         * @returns {boolean} 確実に回避する場合にはtrue, それ以外はfalse.
         */
        Game_BattlerBase.prototype.testCertainMagEvad = function() {
            return false;
        };
    }


    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_testCertainHit = Game_Action.prototype.testCertainHit;
    /**
     * 確実にヒットできるかどうかを取得する。
     * 
     * @param {Game_Battler} target 対象
     * @returns {boolean} 確実にヒットする場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testCertainHit = function(target) {
        return (this.isPhysical() && this.subject().testCertainPhyHit())
                || (this.isMagical() && this.subject().testCertainMagHit())
                || _Game_Action_testCertainHit.call(this, target);
    };

    /**
     * 確実に回避できるかどうかを取得する。
     * 
     * @param {Game_Battler} target 対象
     * @returns {boolean} 確実に回避する場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testCertainEvad = function(target) {
        if (this.isDamage()) {
            if (this.isPhysical() && target.testCertainPhyEvad()) {
                return true;
            } else if (this.isMagical() && target.testCertainMagEvad()) {
                return true;
            }

            return _Game_Action_testCertainHit.call(this, target);
        }
    };
})();
