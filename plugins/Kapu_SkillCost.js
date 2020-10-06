/*:ja
 * @target MZ 
 * @plugindesc スキルコストプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param traitSParamDid
 * @text HPコストレートデータID
 * @desc HPコストを増加減する特性に割り当てるデータID
 * @type number
 * @default 101
 * 
 * @help 
 * ベーシックシステムでのスキルコストは
 * シンプルにMPコスト(mpCost)及びTPコスト(tpCost)になっています。
 * これをちょっくら拡張します。
 * 
 * ■ 使用時の注意
 * hpRateCost = 100% かつ、hpCost > 0にすると、現在HPを超えるため、
 * スキルは使用出来ません。(※HPコストレート特性により、消費HPが低減される場合は除く。)
 * 
 * ■ プラグイン開発者向け
 * DataSkillに以下のフィールドが追加されます。
 *    hpCost, hpRateCost, mhpRateCost
 *    mpRateCost, mhpRateCost,
 *    tpRateCost, mtpRateCost
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
 *     <hpCostRate:rate#> 
 *        スキルのHPコストをrate#倍にする。(1で100%)
 *     <hpCostRate:rate%>
 *        スキルのHPコストをrate%にする。(100で100%)
 * 
 * スキル
 *     <hpCost:value#>
 *     <hpRateCost:value#>
 *     <mhpRatecost:value#>
 *     <mpRateCost:value#>
 *     <mmpRateCost:value#>
 *     <tpRateCost:value#>
 *     <mtpRateCost:value#>
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "";
    const parameters = PluginManager.parameters(pluginName);
    Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE = Number(parameters[traitSParamDid]) || 0;

    if (!Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE) {
        console.error(pluginName + ":TRAIT_SPARAM_DID_HPCOST_RATE is not valid.");
    }
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * 割合パラメータを計算する。
     * 
     * @param {String} valueStr 文字列
     */
    const _parseRate = function(valueStr) {
        if (valueStr.slice(-1) === "%") {
            return Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            return Number(valueStr);
        }
    };

    if (Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE) {
        /**
         * ノートタグを処理する。
         * 
         * @param {Object} obj データオブジェクト
         */
        const _processNoteTag = function(obj) {
            if (!obj.meta.hpCostRate) {
                return;
            }
            const rate = _parseRate(obj.meta.hpCostRate);
            if (rate >= 0) {
                obj.traits.push({
                    code: Game_BattlerBase.TRAIT_SPARAM,
                    dataId: Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE,
                    value: rate
                });
            }
        };

        DataManager.addNotetagParserActors(_processNoteTag);
        DataManager.addNotetagParserClasses(_processNoteTag);
        DataManager.addNotetagParserWeapons(_processNoteTag);
        DataManager.addNotetagParserArmors(_processNoteTag);
        DataManager.addNotetagParserStates(_processNoteTag);
        DataManager.addNotetagParserEnemies(_processNoteTag);
    }

    /**
     * アイテムのノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processSkillNotetag = function(obj) {
        obj.hpCost = 0;
        if (obj.meta.hpCost) {
            obj.hpCost = Math.max(0, Math.floor((Number(obj.meta.hpCost) || 0)));
        }
        obj.hpRateCost = 0;
        if (obj.meta.hpRateCost) {
            obj.hpRateCost = _parseRate(obj.meta.hpRateCost);
        }
        obj.mhpRateCost = 0;
        if (obj.meta.mhpRateCost) {
            obj.mhpRateCost = _parseRate(obj.meta.hpRateCost);
        }
        obj.mpRateCost = 0;
        if (obj.meta.mpRateCost) {
            obj.mpRateCost = _parseRate(obj.meta.mpRateCost);
        }
        obj.mmpRateCost = 0;
        if (obj.meta.mmpRateCost) {
            obj.mmpRateCost = _parseRate(obj.meta.mmpRateCost);
        }
        obj.tpRateCost = 0;
        if (obj.meta.tpRateCost) {
            obj.tpRateCost = _parseRate(obj.meta.tpRateCost);
        }
        obj.mtpRateCost = 0;
        if (obj.meta.mtpRateCost) {
            obj.mtpRateCost = _parseRate(obj.meta.mtpRateCost);
        }
    };


    DataManager.addNotetagParserSkills(_processSkillNotetag);


    //------------------------------------------------------------------------------
    /**
     * スキルのHPコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * @return {Number] HPコスト
     */
    Game_BattlerBase.prototype.skillHpCost = function(skill) {
        return Math.floor(skill.hpCost + this.hp * skill.hpRateCost + this.mhp * skill.mhpRateCost) * this.hcr;
    };
    // Game_BattlerBase
    /**
     * スキルのMPコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * !!!overwrite!!! Game_BattlerBase.skillMpCost
     */
    Game_BattlerBase.prototype.skillMpCost = function(skill) {
        return Math.floor(skill.mpCost + this.mp * skill.tpRateCost + this.mmp * skill.mmpRateCost);
    };

    /**
     * スキルのTPコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * !!!overwrite!!! Game_BattlerBase.skillTpCost()
     */
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        return Math.floor(skill.tpCost + this.tp * skill.tpRateCost + this.maxTp() * skill.mtpRateCost);
    };
    const _Game_BattlerBas_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
    /**
     * スキルの使用コストが支払える状態かどうかを得る。
     * 
     * @param {DataSkill} skill 
     * @return {Boolean} スキルコストが支払える場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        return _Game_BattlerBas_canPaySkillCost.call(this, skill)
                && this._hp > this.skillHpCost(skill);
    };

    const _Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
    /**
     * スキルのコストを払う。
     * 
     * @param {DataSkill} skill スキル
     */
    Game_BattlerBase.prototype.paySkillCost = function(skill) {
        // TODO: HPを100％消費したとき、どうなるのか確認が必要。
        //       Deadしてスキル効果が発動しないなら、ここでコストを払うのはまずい。
        _Game_BattlerBase_paySkillCost.call(this);
        const newHp = Math.max(0, this._hp - this.skillHpCost(skill));
        this.setHp(newHp);
    };
    //------------------------------------------------------------------------------
    // Game_Action

})();