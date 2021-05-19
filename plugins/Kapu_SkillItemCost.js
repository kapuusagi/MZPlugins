/*:ja
 * @target MZ 
 * @plugindesc スキル使用時触媒アイテム設定プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * 
 * @help 
 * アイテム使用時に触媒アイテムを必要とするプラグイン。
 * 例えば弓装備して矢を消費するとかできる。
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * 装備品も含めて消費します。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * スキル
 *   <consumeItem:item(id#)>
 *     id#のアイテムを1つ消費する。
 *   <consumeItem:item(id#),num#>
 *     id#のアイテムをnum#数だけ消費する。
 *   <consumeItem:weapon(id#)>
 *     id#の武器を1つ消費する。
 *   <consumeItem:weapon(id#),num#>
 *     id#の武器をnum#だけ消費する。
 *   <consumeItem:equipped(id#)>
 *     id#のスロットタイプに装備したアイテムを1つ消費する。
 *   <consumeItem:equipped(id#),num#>
 *     id#のスロットタイプに装備したアイテムをnum#消費する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */
(() => {
    //const pluginName = "Kapu_SkillItemCost";
    //const parameters = PluginManager.parameters(pluginName);
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * スキルのノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processSkillNotetag = function(obj) {
        if (obj.meta.consumeItem) {
            const tokens = obj.meta.consumeItem.split(",");
            if (tokens.length >= 1) {
                let re;
                if ((re = tokens[0].match(/weapon\((\d+)\)/)) !== null) {
                    const weaponId = Number(re[1]) || 0;
                    const num = (tokens.length >= 2) ? Number(tokens[1]) : 1;
                    if ((weaponId > 0) && (weaponId < $dataWeapons.length) && (num >= 0)) {
                        obj.itemCost = { kind:2, id:weaponId, num:num };
                    }
                } else if ((re = tokens[0].match(/item\((\d+)\)/)) !== null) {
                    const itemId = Number(re[1]) || 0;
                    const num = (tokens.length >= 2) ? Number(tokens[1]) : 1;
                    if ((itemId > 0) && (itemId < $dataWeapons.length) && (num >= 0)) {
                        obj.itemCost = { kind:1, id:itemId, num:num };
                    }
                } else if ((re = tokens[0].match(/equipped\((\d+)\)/)) !== null) {
                    const equipType = Number(re[1]) || 0;
                    const num = (tokens.length >= 2) ? Number(tokens[1]) : 1;
                    if (num >= 0) {
                        obj.itemCost = { kind:100, id:equipType, num:num };
                    }
                }
            }
        }

    };
    DataManager.addNotetagParserSkills(_processSkillNotetag);


    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
    /**
     * スキルの使用コストが支払える状態かどうかを得る。
     * 
     * @param {DataSkill} skill 
     * @returns {Boolean} スキルコストが支払える場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        return _Game_BattlerBase_canPaySkillCost.call(this, skill)
                && this.canPaySkillItemCost(skill);
    };

    /**
     * スキルの触媒アイテムコストが払えるかどうかを得る。
     * 
     * @param {DataSkill} skill スキル
     * @returns {Boolean} 触媒アイテムがある場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.canPaySkillItemCost = function(skill) {
        if (this.isActor() && skill.itemCost) {
            const item = this.skillConsumeItem(skill);
            if (item) {
                // アイテム指定あり。装備しているアイテムも含めて数量計算
                const numItems = $gameParty.numItems(item) + (this.isEquipped(item) ? 1 : 0);
                return (numItems >= skill.itemCost.num);
            } else {
                // アイテム指定がないか、装備してない。
                return false;
            }
        } else {
            // アイテム指定なし。
            return true;
        }
    };

    const _Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
    /**
     * スキルのコストを払う。
     * 
     * @param {DataSkill} skill スキル
     */
    Game_BattlerBase.prototype.paySkillCost = function(skill) {
        _Game_BattlerBase_paySkillCost.call(this, skill);
        if (this.isActor() && skill.itemCost) {
            const item = this.skillConsumeItem(skill);
            if (item) {
                const num = $gameParty.numItems(item);
                if (num < skill.itemCost.num) {
                    // 所持品に足りない分は装備品を外す。
                    this.discardEquip(item);
                }
                $gameParty.loseItem(item, skill.itemCost.num);
            }
        }
    };

    /**
     * スキル使用時に消費するアイテムを得る。
     * 
     * @param {DataSkill} skill スキル
     * @returns {Object} アイテム
     */    
    Game_BattlerBase.prototype.skillConsumeItem = function(skill) {
        if (skill.itemCost.kind === 1) {
            return $dataItems[skill.itemCost.Id];
        } else if (skill.itemCost.kind === 2) {
            return $dataWeapons[skill.itemCost.Id];
        } else if (skill.itemCost.kind === 100) {
            const equipSlots = this.equipSlots();
            for (let i = 0; i < equipSlots.length; i++) {
                if (equipSlots[i] === skill.itemCost.id) {
                    // タイプ一致
                    return this.equips()[i];
                }
            }
            return null;
        } else {
            return null;
        }
    }
})();
