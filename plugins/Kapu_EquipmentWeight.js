/*:ja
 * @target MZ 
 * @plugindesc 装備重量プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param canEquipOverTolerance
 * @text 許容重量を超えても装備できる。
 * @desc trueを指定すると、許容重量を超えても装備できます。falseにすると、許容重量を超える場合には装備できません。
 * @type boolean
 * @default true
 * 
 * @param shareWeightTolerance
 * @text 許容重量をシェアする。
 * @desc 武器と防具で許容重量をシェアする場合にtrueを指定します。falseにすると、武器と防具で個別に重量計算します。
 * @type boolean
 * @default false
 * 
 * @param defaultActorWeaponWeightTolerance
 * @text アクター武器許容重量（デフォルト）
 * @desc アクターで武器許容重量未指定時のデフォルト装備可能重量です。
 * @type number
 * @default 100
 * 
 * @param defaultActorArmorWeightTolerance
 * @text アクター防具許容重量（デフォルト）
 * @desc アクターで武器許容重量未指定時のデフォルト装備可能重量です。
 * @type number
 * @default 100
 * 
 * @param changeEquipStyleByWeight
 * @text 装備重量により装備タイプを変える
 * @desc trueにすると、武器重量により片手持ち、両手持ちが変わります。
 * @type boolean
 * @default false
 * 
 * @param textWeight
 * @text 重量テキスト
 * @desc 重量を表す文字列。
 * @type string
 * @default 重量
 * 
 * @param textWeaponWeight
 * @text 武器重量テキスト
 * @desc 武器重量を表す文字列。
 * @type string
 * @default 武器重量
 * 
 * @param textArmorWeight
 * @text 防具重量
 * @desc 防具重量を表す文字列
 * @type string
 * @default 防具重量
 * 
 * @help 
 * アクターに装備可能重量の概念を追加し、装備品に重量を持たせます。
 * 許容重量を超えた場合の動作はプラグインパラメータに依存します。
 * 
 * 「許容重量を超えても装備できる」をtrueにすると、重量を超えた場合でも装備することができます。
 * 「許容重量を超えても装備できる」をfalseにすると、そもそも装備できません。
 * 
 * 本プラグイン単体では、特に命中率やAGIなどに補正は行いません。
 * 
 * プラグインパラメータ「装備重量により装備タイプを変える」をtrue にした場合、
 * アクターの装備可能重量により片手装備/両手装備が変わります。
 * (ただしノートタグでbothHandsが指定されている場合、必ず両手装備になります)
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * 以下のメソッドを追加。
 * 
 * Game_Battler.weaponWeightRate() : number
 *   武器重量/許容武器重量の割合を得る。
 *   1.0を超える場合には過重量。補正に使用する。
 * Game_Battler.armorWeightRate() : number
 *   防具重量/許容防具重量の割合を得る。
 *   1.0を超える場合には過重量。補正に使用する。
 * 
 * Game_Actor.weaponWeightTolerance():number
 *   アクターの許容武器重量を得る。
 * Game_Actor.armorWeightTolerance():number
 *   アクターの許容防具重量を得る。
 * Game_Actor.weightTolerance():number
 *   アクターのトータル許容重量を得る。
 * Game_Actor.equipWeaponWeights():number
 *   アクターの装備武器重量合計を得る。
 * Game_Actor.equipArmorWeights() :number
 *   アクターの装備防具重量合計を得る。
 * 
 * TextManager.weight
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <weaponWeightTolerance:value#>
 *     武器キャパシティをvalueにする。
 *     指定なしの場合、プラグインパラメータで指定した値になる。
 *   <armorWeightTolerance:value#>
 *     防具キャパシティをvalueにする。
 *     指定なしの場合、プラグインパラメータで指定した値になる。
 * 武器/防具
 *   <weight:value#>
 *     装備品の重さをvalueに設定する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_EquipmentWeight";
    const parameters = PluginManager.parameters(pluginName);

    const canEquipOverTolerance = (parameters["canEquipOverTolerance"] === undefined)
            ? true : (parameters["canEquipOverTolerance"] === "true");
    const shareWeightTolerance = (parameters["shareWeightTolerance"] === undefined)
            ? false : (parameters["shareWeightTolerance"] === "true");
    const defaultActorWeaponWeightTolerance = Math.max(0, Math.round(Number(parameters["defaultActorWeaponWeightTolerance"]) || 0));
    const defaultActorArmorWeightTolerance = Math.max(0, Math.round(Number(parameters["defaultActorArmorWeightTolerance"]) || 0));
    const changeEquipStyleByWeight = (parameters["changeEquipStyleByWeight"] === undefined)
            ? false : (parameters["changeEquipStyleByWeight"] === "true");

    const textWeight = parameters["textWeight"] || "weight";
    const textWeaponWeight = parameters["textWeaponWeight"] || "W.Weight";
    const textArmorWeight = parameters["textArmorWeight"] || "A.Weight";

    // PluginManager.registerCommand(pluginName, "Kapu_EquipWeight", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * Weapon/Armorのノートタグを解析する。
     * 
     * @param {object} obj DataWeapon/DataArmor
     */
    const _parseWeaponArmorNotetag = function(obj) {
        if (obj.meta.weight) {
            obj.weight = Math.max(0, Math.round(Number(obj.meta.weight) || 0));
        } else {
            obj.weight = 0;
        }
    };
    DataManager.addNotetagParserWeapons(_parseWeaponArmorNotetag);
    DataManager.addNotetagParserArmors(_parseWeaponArmorNotetag);
    //------------------------------------------------------------------------------
    // TextManager
    /**
     * 重量テキスト
     * 
     * @returns {string} 重量を表すテキスト
     */
    TextManager.weight = function() {
        return textWeight;
    };
    /**
     * 武器重量テキスト
     * 
     * @returns {string} 武器重量を表すテキスト
     */
    TextManager.weaponWeight = function() {
        return textWeaponWeight;
    };
    /**
     * 防具重量テキスト
     * 
     * @returns {string} 防具重量を表すテキスト
     */
    TextManager.armorWeight = function() {
        return textArmorWeight;
    };

    //------------------------------------------------------------------------------
    // Game_Battler
    /**
     * 装備重量 / 装備許容重量を取得する。
     * Note: 過重量の場合には1を超えた値になる。
     * 
     * @returns {number} 割合
     */
    Game_Battler.prototype.weaponWeightRate = function() {
        return 1;
    };

    /**
     * 装備重量 / 装備許容重量を取得する。
     * Note: 過重量の場合には1を超えた値になる。
     * 
     * @returns {number} 割合
     */
    Game_Battler.prototype.armorWeightRate = function() {
        return 1;
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._weaponWeightTolerance = defaultActorWeaponWeightTolerance;
        this._armorWeightTolerance = defaultActorArmorWeightTolerance;
    };

    const _Game_Actor_initEquips = Game_Actor.prototype.initEquips;
    /**
     * 装備を初期化する。
     * 
     * @param {Array<Number>} equips 装備品ID配列
     */
    Game_Actor.prototype.initEquips = function(equips) {
        const dataActor = this.actor();
        if (dataActor.meta.weaponWeightTolerance !== undefined) {
            this._weaponWeightTolerance = Math.max(0, Math.round(Number(dataActor.meta.weaponWeightTolerance) || 0));
        }
        if (dataActor.meta.aomorWeightTolerance !== undefined) {
            this._armorWeightTolerance = Math.max(0, Math.round(Number(dataActor.meta.aomorWeightTolerance) || 0));
        }

        _Game_Actor_initEquips.call(this, equips);
    };

    /**
     * 武器装備可能重量を得る。
     * 
     * @returns {number} 装備可能重量
     */
    Game_Actor.prototype.weaponWeightTolerance = function() {
        return this._weaponWeightTolerance;
    };

    /**
     * 防具装備可能重量を得る。
     * 
     * @returns {number} 装備可能重量
     */
    Game_Actor.prototype.armorWeightTolerance = function() {
        return this._armorWeightTolerance;
    };

    /**
     * 装備可能重量を得る。
     * 
     * @returns {number} 許容重量
     */
    Game_Actor.prototype.weightTolerance = function() {
        return this.weaponWeightTolerance() + this.armorWeightTolerance();
    };

    /**
     * 装備武器の合計重量を得る。
     * 
     * @returns {number} 装備重量合計
     */
    Game_Actor.prototype.equipWeaponWeights = function() {
        const weapons = this.weapons();
        const total = weapons.reduce((prev, weapon) => {
            const weight = (weapon) ? (weapon.weight || 0) : 0;
            return prev + weight;
        }, 0);
        return total;
        // return this.weapons().reduce((prev, weapon) => prev + (weapon) ? (weapon.weight || 0) : 0, 0);
    };

    /**
     * 装備防具の合計重量を得る。
     * 
     * @returns {number} 装備重量合計
     */
    Game_Actor.prototype.equipArmorWeights = function() {
        const armors = this.armors();
        const total = armors.reduce((prev, armor) => {
            const weight = (armor) ? (armor.weight || 0) : 0;
            return prev + weight;
        }, 0)
        return total;
        // return this.armors().reduce((prev, armor) => prev + (armor) ? (armor.weight || 0) : 0, 0);
    };

    /**
     * 装備品の合計重量を得る。
     * 
     * @returns {number} 装備重量合計
     */
    Game_Actor.prototype.equipWeights = function() {
        return this.equips().reduce((prev, equipment) => prev + (equipment) ? (equipment.weight || 0) : 0, 0);
    };

    if (!canEquipOverTolerance) {
        if (shareWeightTolerance) {
            const _Game_Actor_canEquipAtSlot = Game_Actor.prototype.canEquipAtSlot;
            /**
             * slotNoで指定されるスロットにitemが装備可能かどうかを取得する。
             * 
             * @param {number} slotNo スロット番号
             * @param {object} item DataWeaponまたはDataArmor
             * @returns {boolean} 装備可能な場合にはtrue, それ以外はfalse
             */
            Game_Actor.prototype.canEquipAtSlot = function(slotNo, item) {
                let canEquip = _Game_Actor_canEquipAtSlot.call(this, slotNo, item);
                if (canEquip) {
                    const equips = this.equips();
                    equips[slotNo] = item;
                    if (DataManager.isWeapon(item)) {
                        const totalWeight = equips.reduce((prev, equipment) => prev + (equipment && DataManager.isWeapon(equipment)) ? (equipment.weight || 0) : 0, 0);
                        canEquip = totalWeight <= this.weaponWeightTolerance();
                    } else if (DataManager.isArmor(item)) {
                        const totalWeight = equips.reduce((prev, equipment) => prev + (equipment && DataManager.isArmor(equipment)) ? (equipment.weight || 0) : 0, 0);
                        canEquip = totalWeight <= this.armorWeightTolerance();
                    }
                }
        
                return canEquip;
            };        
        } else {
            const _Game_Actor_canEquipAtSlot = Game_Actor.prototype.canEquipAtSlot;
            /**
             * slotNoで指定されるスロットにitemが装備可能かどうかを取得する。
             * 
             * @param {number} slotNo スロット番号
             * @param {object} item DataWeaponまたはDataArmor
             * @returns {boolean} 装備可能な場合にはtrue, それ以外はfalse
             */
            Game_Actor.prototype.canEquipAtSlot = function(slotNo, item) {
                let canEquip = _Game_Actor_canEquipAtSlot.call(this, slotNo, item);
                if (canEquip) {
                    const equips = this.equips();
                    equips[slotNo] = item;
                    const totalWeight = equips.reduce((prev, equipment) => prev + (equipment) ? (equipment.weight || 0) : 0, 0);
                    canEquip = totalWeight <= this.weightTolerance();
                }
                return canEquip;
            };  
        }
    }

    /**
     * 装備重量 / 装備許容重量を取得する。
     * Note: 過重量の場合には1を超えた値になる。
     * 
     * @returns {number} 割合
     */
    Game_Actor.prototype.weaponWeightRate = function() {
        const tolerance = this.weaponWeightTolerance();
        if (tolerance > 0) {
            return this.equipWeaponWeights() / tolerance;
        } else {
            return 1;
        }
    };

    /**
     * 装備重量 / 装備許容重量を取得する。
     * Note: 過重量の場合には1を超えた値になる。
     * 
     * @returns {number} 割合
     */
    Game_Actor.prototype.armorWeightRate = function() {
        const tolerance = this.armorWeightTolerance();
        if (tolerance > 0) {
            return this.equipArmorWeights() / tolerance;
        } else {
            return 1;
        }
    };

    if (changeEquipStyleByWeight) {
        const _Game_Actor_isBothHands = Game_Actor.prototype.isBothHands;
        /**
         * 両手装備かどうかを判定する。
         * 
         * @returns {boolean} 両手装備
         */
        Game_Actor.prototype.isBothHands = function() {
            const weapon = this.mainWeapon();
            const weight = (weapon) ? (weapon.weight || 0) : 0;
            if (weight > (this.weaponWeightTolerance() / 2)) {
                // 武器キャパシティの半分を超えるなら、両手持ちが必要。
                return true;
            } else {
                return _Game_Actor_isBothHands.call(this);
            }
        };

        const _Game_Actor_isNeedBothHandsItem = Game_Actor.prototype.isNeedBothHandsItem;
        /**
         * itemが両手装備必要なものかどうかを判定する。
         * 
         * @param {object} item DataWeaponを想定
         * @returns {boolean} 両手装備が必要な場合にはtrue, それ以外はfalse.
         */
        Game_Actor.prototype.isNeedBothHandsItem = function(item) {
            const weight = (item) ? (item.weight || 0) : 0;
            if (weight > (this.weaponWeightTolerance() / 2)) {
                return true;
            }
            return _Game_Actor_isNeedBothHandsItem.call(this, item);
        };
    }
})();