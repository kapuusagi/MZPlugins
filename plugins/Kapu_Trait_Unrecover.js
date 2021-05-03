/*:ja
 * @target MZ 
 * @plugindesc 回復不可特性プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param unrecoveryTraitCode
 * @text フラグID
 * @desc 回復不可特性に割り当てるフラグID
 * @type number
 * @min 65
 * @default 106
 * 
 * @param textTraitUnrecover
 * @text 回復不能特性名
 * @desc 回復不能特性名。%1に回復不可能対象名
 * @type string
 * @default %1回復不能
 * 
 * @help 
 * 回復不可能効果を及ぼす特性を追加するプラグイン。
 * 例えば「HP回復不可」状態を実現することができる。
 * 
 * 全回復操作の場合には本特性は無視される。
 * 
 * ■ 使用時の注意
 * スキル・アイテムによる回復効果が0になります。
 * 吸収スキルは回復対象に回復不可を持っている場合、吸収効果が無効になります。
 * 
 * ■ プラグイン開発者向け
 * なし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具/エネミー
 *     <unrecoverAll>
 *         HP/MP回復不可
 *     <unrecoverHp>
 *         HP回復不可
 *     <unrecoverMp>
 *         MP回復不可
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_Trait_Unrecover";
    const parameters = PluginManager.parameters(pluginName);
    const textTraitUnrecover = parameters["textTraitUnrecover"] || "";

    Game_BattlerBase.TRAIT_UNRECOVER = Number(parameters["unrecoveryTraitCode"]) || 0;
    if (!Game_BattlerBase.TRAIT_UNRECOVER) {
        console.error(pluginName + ":TRAIT_UNRECOVER is not valid.");
        return;
    }

    Game_BattlerBase.UNRECOVER_HP = 1;
    Game_BattlerBase.UNRECOVER_MP = 2;

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * 回復不可特性を追加する。
     * 
     * @param {Object} obj オブジェクト
     * @param {Number} target 対象
     */
    const _addUnrecoverTrait = function(obj, target) {
        const t = obj.traits.find((trait) => (trait.code === Game_BattlerBase.TRAIT_UNRECOVER) && (trait.dataId === target));
        if (!t) {
            obj.traits.push({
                code:Game_BattlerBase.TRAIT_UNRECOVER, 
                dataId:target,
                value:0
            });
        }
    };
    /**
     * ノートタグを処理する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        if (obj.meta.unrecoverAll) {
            _addUnrecoverTrait(obj, Game_BattlerBase.UNRECOVER_HP);
            _addUnrecoverTrait(obj, Game_BattlerBase.UNRECOVER_MP);
        }
        if (obj.meta.unrecoverHp) {
            _addUnrecoverTrait(obj, Game_BattlerBase.UNRECOVER_HP);
        }
        if (obj.meta.unrecoverMp) {
            _addUnrecoverTrait(obj, Game_BattlerBase.UNRECOVER_MP);
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
    /**
     * 回復不能ターゲット名を得る。
     * 
     * @param {number} dataId データID
     * @returns {string} ターゲット名
     */
    TextManager.unrecoverTarget = function(dataId) {
        switch (dataId) {
            case 1:
                return TextManager.hpA;
            case 2:
                return TextManager.mpA;
            default:
                return "";
        }
    }
    TextManager.traitUnrecover = function(dataId) {
        const fmt = textTraitUnrecover || "";
        let targetName = this.unrecoverTarget(dataId);
        return ((fmt && targetName) ? (fmt.format(targetName)) : "");
    };
    if (TextManager._traitConverters && Game_BattlerBase.TRAIT_UNRECOVER) {
        TextManager._traitConverters[Game_BattlerBase.TRAIT_UNRECOVER] = {
            name:TextManager.traitUnrecover, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue:0
        };
    }
    
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * targetを回復可能かどうかを調べる
     * 
     * @param {Number} target 対象
     */
    Game_BattlerBase.prototype.isUnrecover = function(target) {
        return this.traits(Game_BattlerBase.TRAIT_UNRECOVER).some(
            trait => trait.dataId === target
        );
    };

    /**
     * HPが回復可能かどうかを得る。
     * 
     * @return {Boolean} 回復できる場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isUnrecoverHp = function() {
        return this.isUnrecover(Game_BattlerBase.UNRECOVER_HP);
    };

    /**
     * MPが回復可能かどうかを得る。
     * 
     * @return {Boolean} 回復できる場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isUnrecoverMp = function() {
        return this.isUnrecover(Game_BattlerBase.UNRECOVER_MP);
    };
    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
    /**
     * HPを増減させ、resultデータに反映させる。
     * 
     * @param {Number} value 増減させる値
     */
    Game_Battler.prototype.gainHp = function(value) {
        if ((value > 0) && this.isUnrecoverHp()) {
            value = 0;
        }
        _Game_Battler_gainHp.call(this, value);
    };

    const _Game_Battler_gainMp = Game_Battler.prototype.gainMp;
    /**
     * MPを増減させ、resultデータに反映させる。
     * 
     * @param {Number} value 増減させる値
     */
    Game_Battler.prototype.gainMp = function(value) {
        if ((value > 0) && this.isUnrecoverMp()) {
            value = 0;
        }
        _Game_Battler_gainMp.call(this, value);
    };


})();