/*:ja
 * @target MZ 
 * @plugindesc 倍ドロップ、3倍ドロップ特性を実現するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Drop
 * @orderAfter Kapu_Base_Drop
 * 
 * @param abilityIdDoubleDrop
 * @text 2倍ドロップ特性フラグID
 * @desc 2倍ドロップ特性フラグに割り当てるID
 * @type number
 * @default 109
 * @min 6
 * 
 * @param abilityIdTripleDrop
 * @text 3倍ドロップ特性フラグID
 * @desc 3倍ドロップ特性フラグに割り当てるID
 * @type number
 * @default 110
 * @min 6
 * 
 * @param textTraitDoubleDrop
 * @text 2倍ドロップ特性名
 * @desc 2倍ドロップ特性名として使用するテキスト
 * @type string
 * @default 倍ドロ
 * 
 * @param textTraitTripleDrop
 * @text 3倍ドロップ特性名
 * @desc 3倍ドロップ特性名として使用するテキスト
 * @type string
 * @default 超ドロ
 * 
 * @help 
 * 某MMOにあったような、倍ドロップ、3倍ドロップを実現する特性を追加する。
 * エネミー討伐時、ドロップ判定を2回/3回行います。
 * 倍ドロップ/3倍ドロップの両方を持っていた場合、3倍ドロップが優先されます。
 * 処理としては、通常1回だけドロップ判定するところを、2回(または3回)ドロップ判定して
 * それぞれでドロップさせるというものです。
 * 
 * 特定のアクターが討伐したとき、とかいう判定は入らないです。
 * 
 * ■ 使用時の注意
 * ドロップ周りを変更する他のプラグインと競合するかもしれません。
 * ユニークアイテムでも複数個ドロップしてしまいます。
 * 
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
 * アクター/クラス/ステート/武器/防具
 *     <doubleDrop>
 *        2倍ドロップ特性を付与する。
 *     <tripleDrop>
 *        3倍ドロップ特性を付与する。
 * 
 *  
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Trait_MultipleDrop";
    const parameters = PluginManager.parameters(pluginName);
    
    Game_Party.ABILITY_DOUBLE_DROP = Number(parameters["abilityIdDoubleDrop"]) || 0;
    Game_Party.ABILITY_TRIPLE_DROP = Number(parameters["abilityIdTripleDrop"]) || 0;

    if (!Game_Party.ABILITY_DOUBLE_DROP) {
        console.log(pluginName + ":ABILITY_DOUBLE_DROP is not valid.");
    }
    if (!Game_Party.ABILITY_TRIPLE_DROP) {
        console.log(pluginName + ":ABILITY_TRIPLE_DROP is not valid.");
    }
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * itemの特性にvalueStrのドロップレート加算する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/Stateのいずれか。traitsを持ってるデータ
     */
    const _processDropItemRateTrait = function(obj) {
        if (Game_Party.ABILITY_DOUBLE_DROP && obj.meta.doubleDrop) {
            obj.traits.push({ 
                code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
                dataId:Game_Party.ABILITY_DOUBLE_DROP, 
                value:0
            });
        }
        if (Game_Party.ABILITY_TRIPLE_DROP && obj.meta.tripleDrop) {
            obj.traits.push({ 
                code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
                dataId:Game_Party.ABILITY_TRIPLE_DROP, 
                value:0
            });
        }
    };

    DataManager.addNotetagParserActors(_processDropItemRateTrait);
    DataManager.addNotetagParserClasses(_processDropItemRateTrait);
    DataManager.addNotetagParserWeapons(_processDropItemRateTrait);
    DataManager.addNotetagParserArmors(_processDropItemRateTrait);
    DataManager.addNotetagParserStates(_processDropItemRateTrait);
    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._partyAbilities && Game_Party.ABILITY_DOUBLE_DROP) {
        TextManager._partyAbilities[Game_Party.ABILITY_DOUBLE_DROP] = {
            name:parameters["textTraitDoubleDrop"] || "",
            value:TextManager.traitValueNone,
            str:TextManager.traitValueStrNone
        };
    }
    if (TextManager._partyAbilities && Game_Party.ABILITY_TRIPLE_DROP) {
        TextManager._partyAbilities[Game_Party.ABILITY_TRIPLE_DROP] = {
            name:parameters["textTraitTripleDrop"] || "",
            value:TextManager.traitValueNone,
            str:TextManager.traitValueStrNone
        };
    }
    //------------------------------------------------------------------------------
    // Game_Party
    const _Game_Party_dropItemLotteryCount = Game_Party.prototype.dropItemLotteryCount;
    /**
     * ドロップアイテムの抽選回数を得る。
     * 
     * @returns {number} 抽選回数
     */
    Game_Party.prototype.dropItemLotteryCount = function() {
        if (this.partyAbility(Game_Party.ABILITY_TRIPLE_DROP)) {
            return 3;
        } else if (this.partyAbility(Game_Party.ABILITY_DOUBLE_DROP)) {
            return 2;
        } else {
            return _Game_Party_dropItemLotteryCount.call(this);
        }
    };


})();
