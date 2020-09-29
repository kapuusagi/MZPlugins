/*:
 * @plugindesc TWLD コアシステムプラグイン。
 * @author Kapuusagi
 * 
 * @help
 * このプラグインではTWLD用の基本システムを実現するための機能提供する。
 * プラグインコマンド
 *     TWLD.ResetActorGrows id#
 *         id#のアクターの成長状態をリセットする。
 *     TWLD.AddLearnableSkill id# skillId#
 *         id#のアクターにskillId#のスキルをGpで習得可能なものを追加する。
 *         道場などで習得させたいときに使用する。
 *     TWLD.UpdateLuk party
 *     TWLD.UpdateLuk id#
 *         パーティーメンバー全員/id#のアクターのLUKを更新する。
 * 
 * 基本パラメータ(STR/DEX/VIT/INT/MEN/AGI/LUK)の追加。
 * AGIは上書き、LUKはタームで上下する仕組み。
 * 
 * 独自Traitの追加
 *   追加しているXPARAM(Code=22)
 *     Game_BattlerBase.TRAIT_XPARAM_DID_CRR (dataId=10) クリティカルダメージ倍率加算
 *     Game_BattlerBase.TRAIT_XPARAM_DID_PPR (dataId=11) 物理貫通率
 *     Game_BattlerBase.TRAIT_XPARAM_DID_MPR (dataId=12) 魔法貫通率
 *   追加しているSPARAM(Code=23)
 *     Game_BattlerBase.TRAIT_SPARAM_DID_ATB (dataId=10) ATB速度
 *     Game_BattlerBase.TRAIT_SPARAM_DID_CASTTIME (dataId=11) キャストタイム短縮
 *   追加しているPartyAbility(Code=64)
 *     Game_Party.ABILITY_DROP_GOLD_RATE(dataId=6) ゴールド取得倍率
 *     Game_Party.ABILITY_DROP_ITEM_RATE(dataId=7) アイテムドロップレート追加
 * 
 * アイテム(スキル)エフェクトの追加 *      
 *     Game_Action.EFFECT_TWLD_BASICPARAM_ADD     990  基本パラメータ加算(種効果)
 *     Game_Action.EFFECT_TWLD_GROWPONT_ADD       991  成長ポイント加算(種効果)
 *     Game_Action.EFFECT_TWLD_LEARNABLESKILL_ADD 992  GPで習得可能スキルに追加
 *     Game_Action.EFFECT_TWLD_UPDATE_LUK         993  LUK更新(value1～value2の間の値が加算される)
 * 
 */



(function() {

    /**
     * TRAITTの追加(あれば)
     */



    //var params = PluginManager.parameters('TWLD_Core');



    // 定数。他のプラグインと衝突するなら変更する事。
    // grep で EFFECT_を検索して調べれば良い。
    Game_Action.EFFECT_TWLD_BASICPARAM_ADD = 990;
    Game_Action.EFFECT_TWLD_GROWPONT_ADD = 991;
    Game_Action.EFFECT_TWLD_LEARNABLESKILL_ADD = 992;
    Game_Action.EFFECT_TWLD_UPDATE_LUK = 993;

    TWLD.Core.StatusNames = [ "STR", "DEX", "VIT", "INT", "MEN", "AGI" ];
    TWLD.Core.BasicParamIcons = [ -1, -1, -1, -1, -1, -1 ];
    TWLD.Core.ReincarnationIconIndex = -1;
    TWLD.Core.PhysicalElements = [ 1,2,3 ]; // 打,斬,突
    TWLD.Core.BasicCriticalRate = 1.5; // クリティカル倍率基本値

    TWLD.Core.BasicParamDescriptions = [
        "物理ダメージ量に影響します。", // STR
        "命中率(接近/遠距離)とクリティカル率に影響します。", // DEX
        "最大HPと物理/魔法被ダメージ量に影響します。", // VIT
        "最大MPと魔法ダメージ量および魔法被ダメージ量に影響します。", // INT
        "最大MPと魔法被ダメージ量に影響します。", // MEn
        "命中率(接近)と回避率および行動順に影響します。", // AGI
    ];

    /**
     * クリティカルアニメーションID
     */
    TWLD.Core.CriticalAnimationId = -1;

    /**
     * ウェポンマスタリーアイコン番号。
     * $dataSystemにデータの置き場がない(メタデータで指定できない)ので、ハードコーディングする。
     * 武器タイプテーブルを使うので、名前だけなら$dataSystem.waponTypes[wmTypeId]で取得できる。
     */
    TWLD.Core.WMIcons = [
        -1, // Empty
        122, // 格闘
        112, // 短剣
        113, // 剣
        123, // 槍
        136, // 刀
        118, // 弓
        115, // 斧
        116, // 鞭
        112, // 杖
        137, // 魔道具
        326, // 神聖魔法
        324, // 破壊魔法
        327, // 竜言語魔法
        328 // 古代魔法
    ];


    TWLD.Core.getActor = function(arg) {
        var re;
        var actorId;
        if ((re = arg.match(/^(\d+)$/)) != null) {
            actorId = Number(re[1]);
            return $gameActors.actor(actorId);
        } else if ((re = arg.match(/variable\[(\d+)\]/)) != null) {
            actorId = $gameVariables.value(Number(re[1]));
            return $gameActors.actor(actorId);
        } else {
            return null;
        }
    };

    /**
     * ウェポンマスタりのレベルアップに必用な経験値を得る。
     * @param {Number} level 現在のレベル
     * @return {Number} 必用経験値。
     */
    TWLD.Core.getWMNextExp = function(level) {
        return Math.pow(level + 1, 2);
    };

    /**
     * 物理属性かどうかを判定する。
     * @param {Number} elementId 属性ID
     * @return {Boolean} 物理属性の場合にture, それ以外はfalse
     */
    TWLD.Core.isPhysicalElement = function(elementId) {
        return TWLD.Core.PhysicalElements.contains(elementId);
    };

    // DataManager
    TWLD.Core.DatabaseLoaded = false;
    TWLD.Core.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!TWLD.Core.DataManager_isDatabaseLoaded.call(this)) {
            return false;
        }
        if (!TWLD.Core.DatabaseLoaded) {
            DataManager.twldActorNotetags($dataActors);
            DataManager.twldEnemyNotetags($dataEnemies);
            DataManager.twldClassNotetags($dataClasses);
            DataManager.twldEquipNotetags($dataWeapons);
            DataManager.twldEquipNotetags($dataArmors);
            DataManager.twldStateNotetags($dataStates);
            DataManager.twldItemNotetags($dataItems);
            DataManager.twldSkillNotetags($dataSkills);
            TWLD.Core.DatabaseLoaded = true;
        }

        return true;
    };

    /**
     * Actorのノートタグを解析して初期値をセットする。
     * @param {Array<Game_Actor>} アクターデータ配列 
     */
    DataManager.twldActorNotetags = function(actors) {
        var patternBasicParam = /<BasicParam[ :]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+) *>/;
        var patternBasicParamGrown = /<BasicParamGrown[ :]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+) *>/;
        var patternGrowPoint =  /<GrowPoint[ :]+([+-]?\d+)[ ,/]+([+-]?\d+) ?>/;
        var patternLearnedSkills = /<LearnedSkills[ :]+([\d,]+) *>/;
        var patternLearnableSkills = /<LearnableSkills[ :]+([\d,]+) *>/;
        var patternWM = /<WeaponMastery[ :]+(\d+)[ ]+(\d+)[ ]+(\d+) *>/;
        var patternUniqueTrait = /<UniqueTrait[ :]+(\d+)[ ]+(\d+)[ ]+(\d+) *>/;
        var patternTrait = /<Trait[ :]+(\d+)[ ]+(\d+)[ ]+(\d+) *>/;
        var patternProfilePicture = /<ProfilePicture[ :]+(.*)>/;
        
        for (var n = 1; n < actors.length; n++) {
            var actor = actors[n];

            actor.basicParams = [
                { base:1, grown:0 }, // STR
                { base:1, grown:0 }, // DEX
                { base:1, grown:0 }, // VIT
                { base:1, grown:0 }, // INT
                { base:1, grown:0 }, // MEN
                { base:1, grown:0 }, // AGI
            ];
            actor.initialLuk = 50;
            actor.growPoint = {
                current : 10,
                max : 10
            };

            actor.gpLearnedSkills = [];
            actor.gpLearnableSkills = [];
            actor.WM = [];
            actor.uniqueTraits = [];
            actor.profilePicture = "";

            var noteLines = actor.note.split(/[\r\n]+/);
            noteLines.forEach(function(line) {
                var re, i;
                if ((re = line.match(patternBasicParam)) !== null) {
                    for (i = 0; i < 6; i++) {
                        actor.basicParams[i].base = Number(re[i + 1]).clamp(1, 999);
                    }
                    actor.initialLuk = Number(re[6]);
                } else if ((re = line.match(patternBasicParamGrown)) !== null) {
                    for (i = 0; i < 6; i++) {
                        actor.basicParams[i].grown = Number(re[i + 1]).clamp(0, 999);
                    }
                } else if ((re = line.match(patternGrowPoint)) !== null) {
                    actor.growPoint.max = Number(re[2]).clamp(0, 999);
                    actor.growPoint.current = Number(re[1]).clamp(0, actor.growPoint.max);
                } else if ((re = line.match(patternLearnedSkills)) !== null) {
                    re[1].split(/[ ,]/).forEach(function (arg) {
                        if (arg && !actor.gpLearnedSkills.contains(arg)) {
                            actor.gpLearnedSkills.push(Number(arg));
                        }
                    });
                } else if ((re = line.match(patternLearnableSkills)) !== null) {
                    re[1].split(/[ ,]/).forEach(function (arg) {
                        if (arg && !actor.gpLearnableSkills.contains(arg)) {
                            actor.gpLearnableSkills.push(Number(arg));
                        }
                    });
                } else if ((re = line.match(patternWM)) !== null) {
                    var wmTypeId = Number(re[1]);
                    if ((wmTypeId >= 0) && (wmTypeId < $dataSystem.weapontypes.length)) {
                        var wmLevel = Number(re[2]).clamp(1, 99);
                        actor.WM.add({
                            id : wmTypeId,
                            level : wmLevel,
                            exp : Number(re[3]).clamp(0, TWLD.Core.getWMNextExp(wmLevel))
                        });
                    }
                } else if ((re = line.match(patternUniqueTrait) !== null)) {
                    var uniqueTrait = {
                        code:Number(re[1]), dataId:Number(re[2]), value:Number(re[3])
                    };
                    actor.uniqueTraits.push(uniqueTrait);
                } else if ((re = line.match(patternTrait) !== null)) {
                    var trait = {
                        code:Number(re[1]), dataId:Number(re[2]), value:Number(re[3])
                    };
                    actor.traits.push(trait);
                } else if ((re = line.match(patternProfilePicture)) !== null) {
                    actor.profilePicture = re[1].trim();
                }
            });
        }
    };

    /**
     * エネミーのデータにあるノートタグを解釈して処理する。
     * 
     * @param {Array<Game_Enemy>} enemies エネミーデータ
     */
    DataManager.twldEnemyNotetags = function(enemies) {
        var patternBasicParam = /<BasicParam[ :]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+) *>/;
        var patternBasicParamRandom = /<BasicParam.Random[ :]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+) *>/;
        var patternWM = /<WeaponMastery[ :]+(\d+) *>/;
        var patternUniqueTrait = /<UniqueTrait[ :]+(\d+)[ ]+(\d+)[ ]+(\d+) *>/;
        var patternTrait = /<Trait[ :]+(\d+)[ ]+(\d+)[ ]+(\d+) *>/;
        var patternElementAbsorb = /<ElementAbsorb[ :]+(\d+)[ ,](\d+\.?\d*%?) */;

        for (var n = 1; n < enemies.length; n++) {
            var enemy = enemies[n];

            enemy.basicParams = [
                { base:10, random:0 }, // STR
                { base:10, random:0 }, // DEX
                { base:10, random:0 }, // VIT
                { base:10, random:0 }, // INT
                { base:10, random:0 }, // MEN
                { base:10, random:0 }, // AGI
                { base:50, random:10 }, // LUK
            ];
            enemy.WM = 1;
            enemy.uniqueTraits = [];

            var noteLines = enemy.note.split(/[\r\n]+/);
            noteLines.forEach(function(line) {
                var re, i;
                if ((re = line.match(patternBasicParam)) !== null) {
                    for (i = 0; i < 7; i++) {
                        enemy.basicParams[i].base = Number(re[i + 1]).clamp(1, 999);
                    }
                } else if ((re = line.match(patternBasicParamRandom)) !== null) {
                    for (i = 0; i < 7; i++) {
                        enemy.basicParam[i].random = Number(re[i + 1].clamp(1, 999));
                    }
                } else if ((re = line.match(patternWM)) !== null) {
                    enemy.WM = Number(re[1]).clamp(1, 99);
                } else if ((re = line.match(patternUniqueTrait) !== null)) {
                    var uniqueTrait = {
                        code:Number(re[1]), dataId:Number(re[2]), value:Number(re[3])
                    };
                    enemy.uniqueTraits.push(uniqueTrait);
                } else if ((re = line.match(patternTrait) !== null)) {
                    var trait = {
                        code:Number(re[1]), dataId:Number(re[2]), value:Number(re[3])
                    };
                    enemy.traits.push(trait);
                }
            });

        }
    };

    /**
     * クラスのノートタグを解析する。
     * @param {Array<Data_Class>} クラスデータ
     */
    DataManager.twldClassNotetags = function(classes) {
        var patternTrait = /<Trait[ :]+(\d+)[ ]+(\d+)[ ]+(\d+) *>/;

        for (var n = 1; n < classes.length; n++) {
            var classData = classes[n];

            var noteLines = classData.note.split(/[\r\n]+/);
            noteLines.forEach(function (line) {
                var re;
                if ((re = line.match(patternTrait) !== null)) {
                    var trait = {
                        code:Number(re[1]), dataId:Number(re[2]), value:Number(re[3])
                    };
                    classData.traits.push(trait);
                }
            });

        }
    };

    /**
     * 装備品のノートタグを解析する。
     * @param {Array<Data_Item>} items アイテムデータ配列
     */
    DataManager.twldEquipNotetags = function(items) {
        var patternCorrect = /<BasicParam.Correct[ :]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+) *>/;
        var patternParamRequired = /<BasicParam.Required[ :]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+) *>/;
        var patternRequired = /<Required[ ,:]+(.+)?>/;
        var patternDropRate = /<DropRate[ :]+([+-]?\d+\.?\d*%?) *>/;
        var patternCriticalRate = /<CriticalRate[ :]+([+-]?\d+\.?\d*%?) *>/;
        var patternTrait = /<Trait[ :]+(\d+)[ ]+(\d+)[ ]+(\d+) *>/;
        var patternElementAbsorb = /<ElementAbsorb[ :]+(\d+)[ ,](\d+\.?\d*%?) */;

        for (var n = 1; n < items.length; n++) {
            var item = items[n];

            item.basicParams = [
                { add:0, req:0 }, // STR
                { add:0, req:0 }, // DEX
                { add:0, req:0 }, // VIT
                { add:0, req:0 }, // INT
                { add:0, req:0 }, // MEN
                { add:0, req:0 }, // AGI
            ];
            item.equipCondition = null;

            var noteLines = item.note.split(/[\r\n]+/);
            noteLines.forEach(function (line) {
                var re, i;
                if ((re = line.match(patternCorrect)) !== null) {
                    for (i = 0; i < 6; i++) {
                        item.basicParams[i].add = Number(re[i + 1]).clamp(-999, 999);
                    }
                } else if ((re = line.match(patternParamRequired)) !== null) {
                    for (i = 0; i < 6; i++) {
                        item.basicParams[i].req = Number(re[i + 1]).clamp(0, 999);
                    }
                } else if ((re = line.match(patternRequired)) !== null) {
                    item.equipCondition = re[1].trim();
                } else if ((re = line.match(patternTrait) !== null)) {
                    var trait = {
                        code:Number(re[1]), dataId:Number(re[2]), value:Number(re[3])
                    };
                    item.traits.push(trait);
                }
            });
        }
    };

    /**
     * ステートのノートタグを解析する。
     * @param {Array<Game_State>} states ステートデータ
     */
    DataManager.twldStateNotetags = function(states) {
        var patternAdd = /<BasicParam.Add[ :]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+)[ ,]+([+-]?\d+) *>/;
        var patternRate = /<BasicParam.Rate[ :]+([+-]?\d+\.?\d*)[ ,]+([+-]?\d+\.?\d*)[ ,]+([+-]?\d+\.?\d*)[ ,]+([+-]?\d+\.?\d*)[ ,]+([+-]?\d+\.?\d*)[ ,]+([+-]?\d+\.?\d*) *>/;
        var patternDropRate = /<DropRate[ :]+([+-]?\d+\.?\d*%?) *>/;
        var patternCriticalRate = /<CriticalRate[ :]+([+-]?\d+\.?\d*%?) *>/;
        var patternTrait = /<Trait[ :]+(\d+)[ ]+(\d+)[ ]+(\d+) *>/;
        var patternElementAbsorb = /<ElementAbsorb[ :]+(\d+)[ ,](\d+\.?\d*%?) */;

        for (var n = 1; n < states.length; n++) {
            var state = states[n];

            state.basicParams = [
                { add:0, rate:0 }, // STR
                { add:0, rate:0 }, // DEX
                { add:0, rate:0 }, // VIT
                { add:0, rate:0 }, // INT
                { add:0, rate:0 }, // MEN
                { add:0, rate:0 }, // AGI
            ];

            var noteLines = state.note.split(/[\r\n]+/);
            noteLines.forEach(function (line) {
                var re, i;
                if ((re = line.match(patternAdd)) !== null) {
                    for (i = 0; i < 6; i++) {
                        state.basicParams[i].add = Number(re[i + 1]);
                    }
                } else if ((re = line.match(patternRate)) !== null) {
                    for (i = 0; i < 6; i++) {
                        state.basicParams[i].rate = Number(re[i + 1]);
                    }
                } else if ((re = line.match(patternTrait) !== null)) {
                    var trait = {
                        code:Number(re[1]), dataId:Number(re[2]), value:Number(re[3])
                    };
                    state.traits.push(trait);
                }
            });
        }
    };

    





    /**
     * アイテムのノートタグを解析する。
     * 
     * @param {Array<game_Item>} items アイテムデータ
     */
    DataManager.twldItemNotetags = function(items) {
        var patternBasicParamAdd = /<BasicParam.Add[ :]+([a-zA-Z]+)[ ]*([+-]?\d+) ?>/;
        var patternGrowPointAdd = /<GrowPoint.Add[ :]+([+-]?\d+) ?>/;
        var patternLearnableSkills = /<LearnableSkills.Add[ :]+([\d,]+) ?>/;
        var patternUpdateLuk = /<UpdateLuk[ :]+([+-]?\d+)[, ]+([+-]?\d+) ?>/;
        for (var n = 1; n < items.length; n++) {
            var item = items[n];

            var noteLines = item.note.split(/[\r\n]+/);
            noteLines.forEach(function (line) {
                var re;
                if ((re = line.match(patternBasicParamAdd)) != null) {
                    var paramId = DataManager.twldGetParamId(re[1]);
                    if (paramId >= 0) {
                        item.effects.push({
                            code: Game_Action.EFFECT_TWLD_BASICPARAM_ADD,
                            value1: Number(re[2]),
                            value2: 0,
                            paramId: paramId
                        });
                    }
                } else if ((re = line.match(patternLearnableSkills)) !== null) {
                    re[1].split(/[ ,]/).forEach(function (val) {
                        if ((val.length > 0) && (val >= 0) && (val <= $dataSkills.length)) {
                            item.effects.push({
                                code: Game_Action.EFFECT_TWLD_LEARNABLESKILL_ADD,
                                value1: Number(val),
                                value2: 0,
                            });
                        }
                    });
                } else if ((re = line.match(patternUpdateLuk)) !== null) {
                    item.effects.push({
                        code: Game_Action.EFFECT_TWLD_UPDATE_LUK,
                        value1: Number(re[1]),
                        value2: Number(re[2]),
                    });
                }
            });
        }
    };

    /**
     * スキルのノートタグを解析する。
     * @param {Array<Data_Item>} skills スキルデータ
     */
    DataManager.twldSkillNotetags = function(skills) {
        var patternGpCost = /<GpCost[ :]+([+-]?\d+) ?/;
        var patternGPLearnCondition = /<GpLearnable[ :]+(.+)?>/;
        var patternElementIds = /<ElementIds[ :]+(.+) ?>/;

        for (var n = 1; n < skills.length; n++) {
            var skill = skills[n];

            skill.elementIds = [];
            if (skill.damage.elementId > 0) {
                skill.elementIds.push(skill.damage.elementId);
            }
            skill.gpCost = 0;
            skill.gpLearnCondition = [];
            skill.hpCost = Number(skill.meta.hpCost) || 0;
            skill.hpCostRate = Number(skill.meta.hpCostRate) || 0;
            skill.mpCostRate = Number(skill.meta.mpCostRate) || 0;
            skill.wmTypeId = Number(skill.meta.wmType) || 0;
            skill.range = Game_Item.RANGE_SHORT; // short range.

            var noteLines = skill.note.split(/[\r\n]+/);
            noteLines.forEach(function (line) {
                var re;
                if ((re = line.match(patternGpCost)) !== null) {
                    skill.gpCost = Number(re[1]).clamp(0, 999);
                } else if ((re = line.match(patternGPLearnCondition)) !== null) {
                    skill.gpLearnCondition.push(re[1].trim());
                } else if ((re = line.match(patternElementIds)) !== null) {
                    re[1].trim().split(',').forEach(function(s) {
                        var eid = Number(s);
                        if (eid) {
                            skill.elementIds.push(eid);
                        }
                    });
                }
            });
        }
    };

    /**
     * paramNameからparamIdを得る。
     * @return {Numbr} パラメータID。paramNameに該当するものが無い場合には-1
     */
    DataManager.twldGetParamId = function(paramName) {
        switch(paramName) {
            case "str": 
                return 0;
            case "dex":
                return 1;
            case "vit":
                return 2;
            case "int":
                return 3;
            case "men":
                return 4;
            case "agi":
                return 5;
            default:
                break;
        }
    };

    //------------------------------------------------------------------------------
    // Sprite_Damageの変更
    //
    /**
     * ダメージスプライトをセットアップする。
     * @param {Game_BattlerBase} target ターゲット
     */
    Sprite_Damage.prototype.setup = function(target) {
        var result = target.result();
        if (result.missed || result.evaded) {
            this.createMiss();
        } else if (result.hpAffected) {
            this.createDigits(0, result.hpDamage);
        } else if (target.isAlive() && result.mpDamage !== 0) {
            this.createDigits(2, result.mpDamage);
        }
        if (result.critical) {
            if (TWLD.Core.CriticalAnimationId > 0) {
                this.startAnimation(TWLD.Core.CriticalAnimationId , false, 0);
            }
            this.setupCriticalEffect();
        }
    };    
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    //
    TWLD.Core.Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;

    /**
     * Game_BattlerBaseを初期化する。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        TWLD.Core.Game_BattlerBase_initMembers.call(this);
        this.initUniqueTraits();
    };

    Object.defineProperties(Game_BattlerBase.prototype, {
        str : { get: function() { return this.getBasicParam(0); }, configurable:true },
        dex : { get: function() { return this.getBasicParam(1); }, configurable:true },
        vit : { get: function() { return this.getBasicParam(2); }, configurable:true },
        int : { get: function() { return this.getBasicParam(3); }, configurable:true },
        men : { get: function() { return this.getBasicParam(4); }, configurable:true },
        agi : { get: function() { return this.getBasicParam(5); }, configurable:true }, // 再定義
        luk : { get: function() { return this.getLuk(); }, configurable:true }, // 再定義
        pdr : { get: function() { return this.getPhysicalDamageRate(); }, configurable:true}, // 再定義
        mdr : { get: function() { return this.getMagicalDamegeRate(); }, configurable:true }, // 再定義
        ppr: { get: function() { return this.getPhysicalPenetrationRate(); }, configurable:true },
        mpr: { get: function() { return this.getMagicalPenetrationRate(); }, configurable:true },
        /** 攻撃計算式補正値 */  
        atkcoef: { get: function() { return this.getPhysicalAttackRate(); }, configurable:true },
        /** 防御力計算式補正式 */
        defcoef: { get: function() { return this.getPhysicalDefenceRate(); }, configurable:true },
        /** 魔法攻撃力計算式補正値 */
        matkcoef: { get: function() { return this.getMagicalAttackRate(); }, configurable:true },
        /** 魔法防御力計算式補正式 */
        mdefcoef: { get : function() { return this.getMagicalDefenceRate(); }, configurable:true }
    });

    /**
     * 固有の特性を初期化する。
     */
    Game_BattlerBase.prototype.initUniqueTraits = function() {
        this._uniqueTraits = [];
    };

    /**
     * 物理防御貫通率を取得する。
     * 
     * @return {Number} 物理防御貫通率。
     */
    Game_BattlerBase.prototype.getPhysicalPenetrationRate = function() {
        var rate = Math.max(0, this.str - 30) * 0.01;
        rate += this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_PPR);
        return rate;
    };

    /**
     * 魔法防御貫通率を取得する。
     * 
     * @return {Number} 魔法防御貫通率。
     */
    Game_BattlerBase.prototype.getMagicalPenetrationRate = function() {
        var rate = Math.max(0, this.int - 30) * 0.01;
        rate += this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_MPR);
        return rate;
    };

    /**
     * ATK/DEF/MATK/MDEFパラメータを得る。
     * @return {Number} パラメータ
     */
    Game_BattlerBase.prototype.param = function(paramId) {
        var value = this.paramBase(paramId) * this.paramRate(paramId)
        value += this.paramPlus(paramId);
        value *= this.paramBuffRate(paramId);
        var maxValue = this.paramMax(paramId);
        var minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    };

    /**
     * ATK/DEF/MATK/MDEFパラメータの増幅率を得る。
     * @return {Number} 増幅率
     */
    Game_BattlerBase.prototype.paramRate = function(paramId) {
        // 基本パラメータを乗算レートでやると、めっちゃ大きくなるのでやめる。
        var rate = 1.0;
        this.traitsWithId(Game_BattlerBase.TRAIT_PARAM, paramId).forEach(function(trait) {
            rate += (trait.value - 1.0)
        });

        return Math.max(0.1, rate);
    };

    /**
     * 物理攻撃力補正値を得る。
     * @return {Number} 物理攻撃力補正値(倍率)
     */
    Game_BattlerBase.prototype.getPhysicalAttackRate = function() {
        // 物理攻撃補正
        var str = this.str;
        if (str < 10) {
            // STRが10以下の場合、1の差が6％の影響を与える。
            return 0.4 + str * 0.06;
        } else if (str < 30) {
            // STRが10以上、30未満の場合、1向上毎に5%向上する。
            return 1.0 + (str - 10) * 0.05;
        } else if (str < 70) {
            // STRが30以上、70未満の場合、1向上毎に2.5%向上する。
            return 2.0 + (str - 30) * 0.025;
        } else {
            // STRが70以上の場合、1向上毎に1.25%向上する。
            return 3.0 + (str - 70) * 0.0125;
        }
    };

    /**
     * 物理防御力補正値を得る。
     * @return {Number} 物理防御力補正値(倍率)
     */
    Game_BattlerBase.prototype.getPhysicalDefenceRate = function() {
        // 物理防御補正
        //   VITが10以上で1向上毎に4%の影響を与える。
        return 1.0 + Math.max(0, (this.vit - 10) * 0.04);
    };

    /**
     * 魔法攻撃力補正値を得る。
     * @return {Number} 補正値(倍率)
     */
    Game_BattlerBase.prototype.getMagicalAttackRate = function() {
        // 魔法攻撃補正
        var int = this.int;
        if (int < 10) {
            // INTが10未満の場合、1低いごとに5%効果が減少する。
            return 1.0 + (int - 10) * 0.05;
        } else if (int < 25) {
            // INTが10以上、25未満の場合、1向上毎に3%効果が上昇する。
            return 1.0 + (int - 10) * 0.03;
        } else if (int < 45) {
            // INTが25以上45未満の場合、1向上毎に4%効果が上昇する。
            return 1.45 + (int - 25) * 0.04;
        } else if (int < 70) {
            // INTが45以上70未満の場合、1向上毎に5%効果が上昇する。
            return 2.25 + (int - 45) * 0.05;
        } else {
            // INTが70以上の場合、1向上毎に7％効果が上昇する。
            return 2.25 + (int - 70) * 0.07;
        }
    };

    /**
     * 魔法防御力補正値値を得る。 
     * @return {Number} 魔法防御力補正値(倍率)
     */
    Game_BattlerBase.prototype.getMagicalDefenceRate = function() {
        // 魔法防御補正
        //   VITが10以上で1向上毎に2%の影響を与える。
        //   MENが10以上で1向上毎に4%の影響を与える。
        return 1.0
            + Math.max(0, (this.vit - 10) * 0.02)
            + Math.max(0, (this.men - 10) * 0.04);
    };


    /**
     * 物理被ダメ倍率を得る。
     * @return {Number} 物理被ダメ倍率。
     */
    Game_BattlerBase.prototype.getPhysicalDamageRate = function() {
        var rate = this.sparam(6);
        // 物理ダメージ軽減率
        // VITが10以上の場合、1上げる毎に0.5%軽減する。
        var reduce =  Math.max(0, this.vit - 10) * 0.005;
        return Math.max(0, rate - reduce);
    };

    /**
     * 魔法被ダメ倍率を得る。
     * @return {Number} 魔法被ダメ倍率
     */
    Game_BattlerBase.prototype.getMagicalDamegeRate = function() {
        var rate = this.sparam(7);
        // 魔法ダメージ軽減率
        // VITが10以上の場合、VITが1上げる毎に0.25%軽減する。
        // MENが10以上の場合、MENが1上げる毎に0.5%軽減する。
        var reduce = Math.max(0, (this.vit - 10) * 0.0025 + (this.men - 10) * 0.005);
        return Math.max(0, rate - reduce);
    };

    /**
     * 基本パラメータを得る。
     * @param {Number} paramId パラメータID
     * @return {Number} パラメータ値
     */
    Game_BattlerBase.prototype.getBasicParam = function(paramId) {
        var value = this.getBasicParamBase(paramId) * (this.getBasicParamRate(paramId))
            + this.getBasicParamCorrectByEquips(paramId) + this.getBasicParamCorrectByStates(paramId);
        return Math.round(Math.floor(value).clamp(1, 999));
    };

    /**
     * 基本パラメータベース値を取得する。
     * 
     * @param {Number} paramId パラメータID
     * @return {Number} ベース値が返る。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.getBasicParamBase = function(paramId) {
        return 1;
    };

    /**
     * LUK値を取得する。
     * @return {Number} LUK値
     */
    Game_BattlerBase.prototype.getLuk = function() {
        return 50;
    }


    /**
     * 武器熟練度レベルを得る。
     * @param {Number} wmTypeId ウェポンマスタリータイプID
     * @return レベルが返る。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.getWMLevel = function(wmTypeId) {
        return 0;
    };

    /**
     * 武器熟練度レベルを得る。
     * @param {Game_Object} item 使用するアイテム。スキルかもしれない。
     * @return レベルが返る。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.getWMLevel = function(item) {
        return 1;
    }

    /**
     * 基本パラメータの倍率補正を得る。
     * @return {Number} 倍率補正値
     */
    Game_BattlerBase.prototype.getBasicParamRate = function(paramId) {
        return this.getBasicParamRateByStates(paramId);
    };

    /**
     * 基本パラメータのステートによる倍率補正を得る。
     * @return {Number} 倍率補正値
     */
    Game_BattlerBase.prototype.getBasicParamRateByStates = function(paramId) {
        return this.states().reduce(function(prev, state) {
            return prev + state.basicParams[paramId].rate;
        }, 1.0);
    };

    /**
     * 基本パラメータの装備品による補正値合計を取得する。
     * @param {Number} paramId パラメータID
     * @return 補正値。
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.getBasicParamCorrectByEquips = function(paramId) {
        return 0;
    };

    /**
     * ステートによる基本パラメータの加算補正値を得る。
     * 
     * @param {Number} paramId パラメータ番号
     * @return 加算補正値が返る。
     */
    Game_BattlerBase.prototype.getBasicParamCorrectByStates = function(paramId) {
        // ステートから算出する。
        return this.states().reduce(function(prev, state) {
            return prev + state.basicParams[paramId].add;
        }, 0);
    };

    TWLD.Core.Game_BattlerBase_canEquip = Game_BattlerBase.prototype.canEquip;

    /**
     * 装備可能かどうかを判定する。
     * @param {Data_Item} item Weapon または Armor
     */
    Game_BattlerBase.prototype.canEquip = function(item) {
        if (!TWLD.Core.Game_BattlerBase_canEquip.call(this, item)) {
            return false;
        }
        for (var i = 0; i < 6; i++) {
            if (this.getBasicParamBase(i) < item.basicParams[i].req) {
                return false;
            }
        }
        // eslint-disable-next-line no-unused-vars
        var actor = this; // used at eval)
        if (item.equipCondition && !eval(item.equipCondition)) {
            return false;
        }

        return true;
    };
    /**
     * skillを使用するためのHPコストを取得する。
     * @param {Data_Item} skill スキル
     * @return HPコストが返る。
     */
    Game_BattlerBase.prototype.skillHpCost = function(skill) {
        return skill.hpCost + Math.floor(this.mhp * skill.hpCostRate);
    };
    /**
     * skillを使用するためのMPコストを取得する。
     * @return MPコストが返る。
     */
    Game_BattlerBase.prototype.skillMpCost = function(skill) {
        return Math.floor((skill.mpCost + this.mmp * skill.mpCostRate) * this.mcr);
    };
    /**
     * スキルのTPコストを取得する。
     * @param {Game_Skill} skill スキル
     * @return TPコストが返る。
     */
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        return skill.tpCost;
    };
    /**
     * スキルのコストを払えるかを判定する。
     * canUse判定の先で呼ばれる。
     * @param {Game_Skill} skill スキル
     * @return {Boolean} 払える場合にはtrue, 払えない場合にはfalse
     */
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        return this._hp > this.skillHpCost(skill)
                && this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
    };

    /**
     * スキルを使用したコストを消費する。
     */
    Game_BattlerBase.prototype.paySkillCost = function(skill) {
        this._hp -= this.skillHpCost(skill);
        if (this._hp < 0) {
            this._hp = 1; // 
        }
        this._mp -= this.skillMpCost(skill);
        this._tp -= this.skillTpCost(skill);
    };

    

    TWLD.Core.Game_BattlerBase_allTraits = Game_BattlerBase.prototype.allTraits;    
    /**
     * 全ての特性を返す。
     * @return {Array<Trait>} 全ての特性値を格納した配列を返す。
     */
    Game_BattlerBase.prototype.allTraits = function() {
        return TWLD.Core.Game_BattlerBase_allTraits.call(this).concat(this._uniqueTraits);
    };

    //------------------------------------------------------------------------------
    // WeaponMastery
    //
    /**
     * 新しいWeaponMasteryを構築する
     * @param [Number] wmTypeId タイプ番号
     */
    function WeaponMastery(wmTypeId) {
        this.wmTypeId = wmTypeId || 1;
        this.level = 0; // レベル
        this.exp = 0; // EXP
        this.nextExp = 1; // TWLD.Core.getWMNextExp(0) = 4;
    }

    //------------------------------------------------------------------------------
    // Game_Actor
    //     basicParams : 基本パラメータ。(base, grown, addメンバを持つ)
    //     growPoint   : 成長処理用振り分けボーナス値
    //                   
    //
    TWLD.Core.Game_Actor_initMembers = Game_Actor.prototype.initMembers;

    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        TWLD.Core.Game_Actor_initMembers.call(this);
        this.initBasicParams();
        this.initWeaponMastaries();
        this._profilePictureName = "";
    };

    /**
     * 基本パラメータを初期化する。
     */
    Game_Actor.prototype.initBasicParams = function() {
        this._basicParams = [
            { base:1, grown:0, add:0, rbonus:0 }, // STR
            { base:1, grown:0, add:0, rbonus:0 }, // DEX
            { base:1, grown:0, add:0, rbonus:0 }, // VIT
            { base:1, grown:0, add:0, rbonus:0 }, // INT
            { base:1, grown:0, add:0, rbonus:0 }, // MEN
            { base:1, grown:0, add:0, rbonus:0 }, // AGI
        ];
        this._lukBase = 50;
        this._lukAdd = 0;
        this._growPoint = {
            current : 10,
            max : 10
        };
        this._gpLearnedSkills = [];
        this._gpLearnableSkills = [];
        this._reincarnationCount = 0;
    };

    /**
     * ウェポンマスタリーのパラメータを初期化する。
     */
    Game_Actor.prototype.initWeaponMastaries = function() {
        this._WM = [];
        // とりあえずID分だけ追加。
        for (var i = 0; i < $dataSystem.weaponTypes.length; i++) {
            this._WM.push(new WeaponMastery(i));
        }
    };

    TWLD.Core.Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このActorを指定されたactorIdのデータで初期化する。
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        TWLD.Core.Game_Actor_setup.call(this, actorId);
        this.setupBasicParams(actorId);
        this.setupWeaponMastery(actorId);
        this.setupProfile(actorId);
        this.setupUniqueTraits(actorId);
    };

    /**
     * このActorを指定されたactorIdのデータで初期化する。
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setupBasicParams = function(actorId) {
        var actor = $dataActors[actorId];
        for (var i = 0; i < 6; i++) {
            this._basicParams[i].base = actor.basicParams[i].base;
            this._basicParams[i].grown = actor.basicParams[i].grown;
            this._basicParams[i].add = 0;
            this._basicParams[i].rbonus = 0;
        }
        this._lukBase = actor.initialLuk;
        this._lukAdd = 0;
        this._growPoint.current = actor.growPoint.current;
        this._growPoint.max = actor.growPoint.max;
        this._reincarnationCount = 0;

        // 習得済みスキル
        this._gpLearnedSkills = [];
        actor.gpLearnedSkills.forEach(function(skillId) {
            if (!this.isLearnedSkill(skillId)) {
                this._gpLearnedSkills.add(skillId);
                this.learnSkill(skillId);
            }
        });
        this._gpLearnedSkills.sort(function(a, b) {
            return a - b;
        });

        // 習得可能スキル
        this._gpLearnableSkills = [];
        actor.gpLearnableSkills.forEach(function(skillId) {
            if (!this.isLearnedSkill(skillId) && !this.isGpLearnableSkill(skillId)) {
                this._gpLearnableSkills.add(skillId);
            }
        });
        this._gpLearnableSkills.sort(function(a, b) {
            return a - b;
        });
        // 習得可能スキルを更新する。
        this.updateGpLearnableSkills();
    };

    /**
     * ウェポンマスタりを設定する。
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setupWeaponMastery = function(actorId) {
        var actor = $dataActors[actorId];
        for (var i = 0; i < actor.WM.length; i++) {
            var wmInitial = actor.WM;
            var wm = this.getWeaponMastery(wmInitial.id);
            if (wm !== null) {
                wm.level = wmInitial.level;
                wm.exp = wmInitial.exp;
                wm.nextExp =  TWLD.Core.getWMNextExp(wmInitial.level);
            }
        }
    };

    /**
     * プロフィール用のデータを用意する。
     */
    Game_Actor.prototype.setupProfile = function(actorId) {
        var actor = $dataActors[actorId];
        this._profilePictureName = actor.profilePicture;
    };

    /**
     * 固有特性をセットアップする。
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setupUniqueTraits = function(actorId) {
        var actor = $dataActors[actorId];
        this.initUniqueTraits();
        for (var i = 0; i < actor.uniqueTraits.length; i++) {
            this.addUniqueTrait(actor.uniqueTraits[i]);
        }
    };


    /**
     * プロフィール用の画像データ名を設定する。
     * @param {String} filename プロフィール画像用のデータ名。設定なしはnull
     */
    Game_Actor.prototype.setProfilePictureName = function(filename) {
        this._profilePictureName = filename;
    };

    /**
     * プロフィール用の画像データ名を取得する。
     * @return {String} プロフィール画像用のデータ名。設定なしはnull
     */
    Game_Actor.prototype.getProfilePictureName = function() {
        return (this._profilePictureName.length > 0) ? this._profilePictureName : null;
    };







    /**
     * 武器熟練度レベルを得る。
     * @param {Number} wmTypeId ウェポンマスタリータイプID
     * @return {Number} 武器熟練度レベル
     */
    Game_Actor.prototype.getWMLevel = function(wmTypeId) {
        var wm = this.getWeaponMastery(wmTypeId);
        return (wm !== null) ? wm.level : 0;
    }

    /**
     * 武器熟練度Expを得る。
     * @param {Number} wmTypeId ウェポンマスタりタイプID
     * @return {Number} 熟練度Exp
     */
    Game_Actor.prototype.getWMExp = function(wmTypeId) {
        var wm = this.getWeaponMastery(wmTypeId);
        return (wm !== null) ? wm.exp : 0;
    };

    /**
     * 武器熟練度レベルアップするためのExpを得る。
     * @param {Number} wmTypeId ウェポンマスタりタイプID
     * @return {Number} レベルアップに必用なExp
     */
    Game_Actor.prototype.getWMNextExp = function(wmTypeId) {
        var wm = this.getWeaponMastery(wmTypeId);
        return (wm !== null) ? wm.nextExp : 0;
    };

    /**
     * 武器熟練度の経験値を増やす。
     * @param {Number} wmType ウェポンマスタりタイプID
     * @param {Number} exp 加算するEXP
     */
    Game_Actor.prototype.gainWMExp = function(wmTypeId, exp) {
        var wm = this.getWeaponMastery(wmTypeId);
        if ((exp > 0) && (wm !== null)) {
            wm.exp += exp;
            if (wm.exp >= wm.nextExp) {
                if (wm.level < 99) {
                    wm.level++;
                    wm.exp = 0;
                    wm.nextExp = TWLD.Core.getWMNextExp(wm.level);
                } else {
                    wm.exp = wm.nextExp; // 上限を超えることはない。
                }
            }
        }
    };

    /**
     * skillを使用するためのHPコストを取得する。
     * @param {Data_Item} skill スキル
     * @return HPコストが返る。
     */
    Game_Actor.prototype.skillHpCost = function(skill)
    {
        var cost = Game_BattlerBase.prototype.skillHpCost.call(this, skill);
        if (cost > 1) {
            var wmTypeId = skill.wmTypeId;
            if (wmTypeId > 0) {
                var level = this.getWMLevel(wmTypeId);
                cost -= Math.floor(cost * (level + 1) * 0.005); // Lv100で最大50%軽減する。
            }
        }

        return cost;
    }

    TWLD.Core.Game_Actor_skillMpCost = Game_Actor.prototype.skillMpCost;

    /**
     * skillを使用するためのMPコストを取得する。
     * @param {Data_Item} skill スキル
     * @return MPコストが返る。
     */
    Game_Actor.prototype.skillMpCost = function(skill) {
        var cost = TWLD.Core.Game_Actor_skillMpCost.call(this, skill);
        if (cost > 1) {
            var wmTypeId = skill.wmTypeId;
            if (wmTypeId > 0) {
                var level = this.getWMLevel(wmTypeId);
                cost -= Math.floor(cost * (level + 1) * 0.005); // Lv100で最大50%軽減する。
            }
        }

        return cost;
    };

    TWLD.Core.Game_Actor_skillTpCost = Game_Actor.prototype.skillTpCost;

    /**
     * skillを使用するためのTPコストを取得する。
     * @param {Data_Item} skill スキル
     * @return TPコストが返る。
     */
    Game_Actor.prototype.skillTpCost = function(skill) {
        var cost = TWLD.Core.Game_Actor_skillTpCost.call(this, skill);
        if (cost > 1) {
            var wmTypeId = skill.wmTypeId;
            if (wmTypeId > 0) {
                var level = this.getWMLevel(wmTypeId);
                cost -= Math.floor(cost * (level + 1) * 0.005); // Lv100で最大50%軽減する。
            }
        }

        return cost;
    };

    TWLD.Core.Game_Actor_useItem = Game_Actor.prototype.useItem;

    /**
     * item(スキルまたは道具)を使用する。
     * @param {Data_Item} item アイテム
     */
    Game_Actor.prototype.useItem = function(item) {
        TWLD.Core.Game_Actor_useItem.call(this, item);
        if (DataManager.isSkill(item)) {
            var wmTypeId = item.wmTypeId;
            if (!wmTypeId || (wmTypeId < 0)) {
                var weapons = this.weapons();
                wmTypeId = (weapons.length > 0) ? weapons[0].wtypeId : 1;
            }
            this.gainWMExp(wmTypeId, 1);
        }
    };

    /**
     * typeIdに対応するウェポンマスタりを取得する。
     * 該当するIDがない場合には追加して返す。
     * @param {Number} typeId 武器タイプID(省略時はインデックス0のを返す)
     * @return {Game_Object} ウェポンマスタりオブジェクト。typeIdが不正(負数)な場合にはnull
     */
    Game_Actor.prototype.getWeaponMastery = function(typeId) {
        typeId = typeId || 0;
        if (typeId < 0) {
            return null;
        } else {
            if (typeof this._WM[typeId] === 'undefined') {
                this._WM = new WeaponMastery(typeId);
            }
            return this._WM[typeId];
        }
    };

    /**
     * ウェポンマスタリーのデータを返す。
     * @return {Array<WeaponMastery>} ウェポンマスタリーデータ(習得しているやつのみ。未着手は返さない) 
     */
    Game_Actor.prototype.getWeaponMasteries = function() {
        var ret = [];
        for (var i = 1; i < this._WM.length; i++) {
            var wm = this._WM[i];
            if (wm && ((wm.level > 0) || (wm.exp > 0))) {
                ret.push(wm);
            }
        }
        return ret;
    };

    /**
     * 装備している武器のウェポンマスタリーレベルを得る。
     * @return {Number} マスタリーレベル。
     */
    Game_Actor.prototype.getEquipWMLevel = function() {
        var level = (this._WM[0]) ? this._WM[0].level : 1;
        this.weapons().forEach(function(weapon) {
            var wm = this.getWeaponMastery(weapon.wTypeId);
            if ((wm != null) && (wm.level > level)) {
                level = wm.level;
            }
        });
        return level;
    };


    /**
     * 基本パラメータのベース値を取得する。
     * @param {Number} paramId パラメータID
     * @return {Number} ベース値
     */
    Game_Actor.prototype.paramBase = function(paramId) {
        // ベース値は現在のクラスとレベルのテーブルから得られる値になる。
        var value = this.currentClass().params[paramId][this._level];
        value += Game_BattlerBase.prototype.paramPlus.call(this, paramId); // 種加算値

        // 基本パラメータによる補正値を返す。
        switch (paramId) {
            case 0: // 最大HP
                // 最大HP = (VIT * 4) + FLOOR(VIT / 5) * 7
                var vit = this.vit;
                value += (vit * 4) + Math.floor(vit / 5) * 7;
                break;
            case 1: // 最大MP
                var int = this.int;
                var men = this.men;
                value += (int * 2) + Math.floor(int / 5) * 4;
                value += men + Math.floor(men / 7) * 5;
                break;
            case 2: // ATK
                if (this.hasNoWeapons()) {
                    // 素手の場合、WMとSTRでATKにボーナスを与える。
                    var wm = this.getWeaponMastery(this.bareHandsElementId());
                    value += Math.floor(wm.level * this.str * 0.02);
                }
                break;
        }

        return value;
    };


    /**
     * パラメータの加算値を得る。
     * 
     * 既定の実装では種加算値と装備品加算値を返していたが、
     * 種加算分は装備なしでも効果あるのでparamBaseに適用すべきと考える。
     * そのため、アクターでは装備加算値だけ返すようにした。
     * @return {Number} パラメータ加算値
     */
    Game_Actor.prototype.paramPlus = function(paramId) {
        return this.equips().reduce(function(prev, item) {
            return prev + ((item) ? item.params[paramId] : 0);
        }, 0);
    };

    TWLD.Core.Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    /**
     * レベルアップ処理をする。
     */
    Game_Actor.prototype.levelUp = function() {
        TWLD.Core.Game_Actor_levelUp.call(this);
        // // 成長ボーナス加算
        // var gpPlus = 3 + Math.min(6, Math.floor(this._level / 20));
        // this.addGrowPoint(gpPlus);
        // 習得可能スキルを更新する。
        this.updateGpLearnableSkills();
    };

    /**
     * LUK値を得る。
     * @return {Number} LUK値
     */
    Game_Actor.prototype.getLuk = function() {
        return Number(this.getLukBase() + this.getLukAdd()).clamp(1, 100);
    };

    /**
     * Lukパラメータの基本値を得る。
     * @return {Number} Lukパラメータ基本値
     */
    Game_Actor.prototype.getLukBase = function() {
        return this._lukBase;
    };

    /**
     * Lukパラメータの補正値を得る。
     * @return {Number} LUKパラメータ補正値
     */
    Game_Actor.prototype.getLukAdd = function() {
        var equips = this.equips();
        return equips.reduce(function(prev, equipItem) {
            return (equipItem) ? (prev + equipItem.params[7]) : prev;
        }, this._lukAdd);
    };

    /**
     * LUK値を更新する。
     * デフォルトの更新処理は、低いほど上がりやすくなり、高いほど低くなりやすくなる。
     * @param {Number} min 補正最小値(省略可)
     * @param {Number} max 補正最大値(省略可)
     */
    Game_Actor.prototype.updateLuk = function(min, max) {
        min = min || (this._lukAdd / 10);
        max = max || (min + 10);
        var fluctuationRange = max - min;
        var correct = Math.floor(fluctuationRange * Math.random() - min);
        if (correct !== 0) {
            this._lukAdd += correct;
            this.refresh();
        }
    };

    /**
     * このアクターが習得可能なスキルを更新する。
     */
    Game_Actor.prototype.updateGpLearnableSkills = function() {
        for (var skillId = 1; skillId < $dataSkills.length; skillId++) {
            var skill = $dataSkills[skillId];
            if (skill.name.length == 0) {
                continue; // 名前なしスキルは無視。
            }
            if (this.isLearnedSkill(skillId) || this.isGpLearnableSkill(skillId)) {
                continue; // 習得済み、習得可能登録済みスキル。
            }
            if (this.testGpLearnable(skill)) {
                // 習得可能
                this._gpLearnableSkills.push(skillId);
            }
        }
        this._gpLearnableSkills.sort(function (a, b) {
            return a - b;
        });
    };

    /**
     * skillが習得可能かどうかを判定する。
     * @param {Game_Skill} スキル
     * @return 習得可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.testGpLearnable = function(skill) {
        if (skill.name.length === 0) {
            return false;
        }
        if (skill.gpLearnCondition.length > 0) {
            // eslint-disable-next-line no-unused-vars
            var actor = this; // conditionの判定で使用。
            // eslint-disable-next-line no-unused-vars
            var wml = (skill.wmTypeId > 0) ? this.getWMLevel(skill.wmTypeId) : 0;

            return skill.gpLearnCondition.some(function(condition) {
                return eval(condition);
            });
        } else {
            return (skill.gpCost > 0); // 条件未指定の場合にはgpCostが0以上かどうかだけ見る。
        }
    };

    /**
     * GPで習得可能なスキル一覧を得る。
     * @return {Array<Game_Skill>} 習得可能スキル一覧が返る。
     */
    Game_Actor.prototype.getGpLearnableSkills = function() {
        var list = [];
        this._gpLearnableSkills.forEach(function(skillId) {
            if (!list.contains($dataSkills[skillId])) {
                list.push($dataSkills[skillId]);
            }
        });
        return list;
    };

    /**
     * 習得済みスキルかどうかを判定する。
     */
    Game_Actor.prototype.isGpLearnedSkill = function (skillId) {
        return this._gpLearendSkills.contains(skillId);
    };

    /**
     * GP消費で習得可能スキルかどうかを判定する。
     */
    Game_Actor.prototype.isGpLearnableSkill = function (skillId) {
        return this._gpLearnableSkills.contains(skillId);
    };

    /**
     * 習得可能スキルを追加する。
     */
    Game_Actor.prototype.addGpLearnableSkill = function(skillId) {
        if (!this.isGpLearnedSkill(skillId) && !this.isGpLearnableSkill(skillId)) {
            // 未習得のスキル
            this._gpLearnableSkills.push(skillId);
        }
        this._gpLearnableSkills.sort(function (a, b) {
            return a - b;
        });
    };


    /**
     * GrowPointを消費してスキルを習得する。
     * 
     * @param skillId スキルID
     */
    Game_Actor.prototype.learnSkillByGp = function(skillId) {
        if (this.isLearnedSkill(skillId)) {
            return; // 習得済み
        }
        if (!this.isGpLearnableSkill(skillId)) {
            return; // このアクターの習得可能リストにない。
        }
        var skill = $dataSkills[skillId];
        if (skill.gpCost > this._growPoint.current) {
            return; // 必要なGPが現在値より多い
        }

        this._growPoint.current -= skill.gpCost;
        // 該当エントリを習得可能リストから削除
        var index = this._gpLearnableSkills.indexOf(skillId);
        this._gpLearnableSkills.splice(index, 1);
        // 該当エントリをGP習得リストに追加
        this._gpLearnedSkills.push(skillId);
        this.learnSkill(skillId);
    };

    TWLD.Core.Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;

    /**
     * skillIdで指定されるスキルを習得する。
     * @param {Number} skillId スキルID
     */
    Game_Actor.prototype.learnSkill = function(skillId) {
        TWLD.Core.Game_Actor_learnSkill.call(this, skillId);

        // スキル並び順に登録されてなかったら末尾に追加。
        if (!this._skillOrder.contains(skillId)) {
            this._skillOrder.push(skillId);
        }
        // スキルタイプが追加されていなかったら追加する。
        // 尚forget側では実装しない。
        var skill = $dataSkills[skillId];
        if (skill.stypeId > 0) {
            var stypeList = this.addedSkillTypes();
            if (!stypeList.contains(skill.stypeId)) {
                // スキルタイプが無いので追加する。
                this._uniqueTraits.push({
                    code:Game_BattlerBase.TRAIT_STYPE_ADD,
                    dataId:skill.stypeId,
                    value:1,
                });
            }
        }
    };

    /**
     * 転生回数を得る。
     * @return {Number} 転生回数
     */
    Game_Actor.prototype.getReincarnationCount = function() {
        return this._reincarnationCount;
    };
    /**
     * 転生する。
     * 転生は最大レベルの時だけ使用可能。
     */
    Game_Actor.prototype.reincarnation = function() {
        if (!this.canReincarnation()) {
            return; // 条件満たしてない。
        }

        // Gpで習得したスキルを全部永久習得にする。
        this._gpLearnedSkills = [];
        
        // 基本パラメータはボーナスに加算して0にする。
        // baseとadd(種増加分)はそのままにする。
        for (var i = 0; i < 6; i++) {
            var param = this._basicParams[i];
            var addBonus = Math.floor(param.grown / 10);
            param.rbonus = (param.rbonus + addBonus).clamp(0, 200); // rbonusの加算値は最大で200まで
            param.grown = 0;
        }

        // 育成ボーナスをレベルアップ分だけ引き、リセットする。
        this._growPoint.max -= 484; // Lv2~Lv99まであげたときのボーナス合計値-10。10はボーナスとして残す。
        this._growPoint.current = this._growPoint.max;

        // レベルを1に戻す。
        this.changeLevel(1, false);
        this._reincarnationCount++;

        // 装備できないアイテムは外す。
        this.releaseUnequippableItems();
    };

    /**
     * 転生可能かどうかを返す。
     * @return {Boolean} 転生可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.canReincarnation = function() {
        return this.isMaxLevel();
    };

    Game_Actor.prototype.getGrowPoint = function() {
        return this._growPoint.current;
    };

    /**
     * 最大成長ボーナス値を得る。
     * つまり、使用済み＋残っているポイントね。
     * @return {Number} 成長ボーナス値合計。
     */
    Game_Actor.prototype.getMaxGrowPoint = function() {
        return this._growPoint.max;
    };




    /**
     * paramIdで指定される基本パラメータにvalue値を加算する。
     * @param {Number} paramId パラメータ番号
     * @param {Number} value 加減する値
     */
    Game_Actor.addBasicParam = function(paramId, value) {
        var param = this._basicParams[paramId];
        var addValue = Math.min(200 - param.add, value); // 基本パラメータの種加算は+200まで。
        if (addValue > 0) {
            this._basicParams[paramId].add += value;
            this.refresh();
        }
    };

    /**
     * 指定した基本パラメータの値を得る。
     * (アクター基本値＋振り分け済みの値＋種による加算値)の合計が返る。
     * @param {paramId} パラメータ番号
     */
    Game_Actor.prototype.getBasicParamBase = function(paramId) {
        var param = this._basicParams[paramId];
        return param.base + param.grown + param.add + param.rbonus;
    };

    /**
     * 1ポイント加算するためのGPコストを取得する。
     * @param {Number} paramId パラメータID
     * @return {Number} 必要GPコストが返る。
     */
    Game_Actor.prototype.getBasicParamGrowCost = function(paramId) {
        var value = this._basicParams[paramId].grown + this._basicParams[paramId].rbonus + 1;
        return Math.max(1, Math.floor(value/20));
    };

    /**
     * GPを消費して1ポイント加算する。
     * @param {Number} paramId パラメータID
     */
    Game_Actor.prototype.growBasicParamByGp = function(paramId) {
        var gpCost = this.getBasicParamGrowCost(paramId);
        if (this._growPoint.current < gpCost) {
            return; // GP足りない。
        }

        this._growPoint.current -= gpCost;
        this._basicParams[paramId].grown += 1;
        this.refresh();
    };

    /**
     * 装備品パラメータによる加算値合計を取得する。
     * @param {Number} paramId パラメータID
     */
    Game_Actor.prototype.getBasicParamCorrectByEquips = function (paramId) {
        var equips = this.equips();
        return equips.reduce(function (prev, equipItem) {
            return prev + ((equipItem !== null) ? equipItem.basicParams[paramId].add : 0);
        }, 0);
    };

    /**
     * 振り分け値を初期化する。
     */
    Game_Actor.prototype.resetGrows = function() {
        for (var i = 0; i < 6; i++) {
            this._basicParams[i].grown = 0;
        }
        // スキルのリセット。面倒だけどスキル習得で取得したやつだけリセットする。
        this._learnedSkills.forEach(function (skillId) {
            this._gpLearnableSkills.push(skillId);
            this.forgetSkill(skillId);
        });
        this._learnedSkills = [];

        //this._growPoint.current = this._growPoint.max;
        // 装備できないアイテムは外す。
        this.releaseUnequippableItems();
        this.refresh();
    };

    /**
     * 種アイテムによる加算値を全てクリアする。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.clearBasicParamAdd = function(actorId) {
        var actor = $gameActors.actor(actorId);
        for (var i = 0; i < 6; i++) {
            actor.basicParams[i].add = 0;
        }

        this.refresh();
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    //

    TWLD.Core.Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
    /**
     * エネミーのパラメータフィールドを初期化する。
     */
    Game_Enemy.prototype.initMembers = function() {
        TWLD.Core.Game_Enemy_initMembers.call(this);
        this._basicParams = [ 10, 10, 10, 10, 10, 10 ];
        this._luk = 50;
    };

    TWLD.Core.Game_Enemy_setup = Game_Enemy.prototype.setup;
    /**
     * エネミーをセットアップする。
     * @param {Number} enemyId エネミーID
     * @param {Number} x X表示位置
     * @param {Number} y y表示位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        TWLD.Core.Game_Enemy_setup.call(this, enemyId, x, y);

        this.setupBasicParams(enemyId);
        this.setupUniqueTraits(enemyId);
    };

    /**
     * エネミーの基本パラメータをセットアップする。
     * @param {Number} enemyId エネミーID
     */
    Game_Enemy.prototype.setupBasicParams = function(enemyId) {
        var enemyData = $dataEnemies[enemyId];
        this.basicParams = [ ];
        for (var i = 0; i < 6; i++) {
            var param = enemyData.basicParams[i];
            var paramValue = param.base;
            if (param.random !== 0) {
                paramValue += (param.random * Math.random() - (param.random >> 1));
            }
            this.basicParams.push(
                { base:paramValue.clamp(1,999) }
            );
        }
        var luk =  enemyData.basicParams[6].base;
        if (enemyData.basicParams[6].random) {
            luk += (enemyData.basicParams[6].random * Math.random() - (enemyData.basicParams[6].random >> 1))
        }
        this._luk = luk.clamp(1,100);
    };

    /**
     * 固有特性をセットアップする。
     * @param {Number} エネミーID
     */
    Game_Enemy.prototype.setupUniqueTraits = function(enemyId) {
        var enemyData = $dataEnemies[enemyId];
        this.initUniqueTraits();
        for (var i = 0; i < enemyData.uniqueTraits.length; i++) {
            this.addUniqueTrait(enemyData.uniqueTraits[i]);
        }

    };

    /**
     * LUK値を返す。
     * @return {Number} LUK値
     */
    Game_Enemy.prototype.getLuk = function() {
        return this._luk;
    };

    /**
     * 基本パラメータのベース値を取得する。
     * @param paramId パラメータID
     * @return {Number} ベース値
     */
    Game_Enemy.prototype.getBasicParamBase = function(paramId) {
        // データベースにあるエネミーデータを返す。
        return this.basicParams[paramId].base;
    };

    /**
     * 武器熟練度レベルを得る。
     * @param {Number} wmTypeId ウェポンマスタりータイプID
     * @return {Number} 武器熟練度レベル
     */
    // eslint-disable-next-line no-unused-vars
    Game_Enemy.prototype.getWMLevel = function(wmTypeId) {
        return Number(this.enemy().WM) || 1;
    };

    /**
     * 攻撃属性を得る。
     * 既定の実装では空が返る可能性があったが、設定したIDまたは素手を返すようにした。
     * @return {Array<Number>} 攻撃属性ID配列。
     */
    Game_Enemy.prototype.attackElements = function() {
        var set = Game_BattlerBase.prototype.attackElements.call(this);
        if (set.length == 0) {
            var elementId = Number(this.enemy().meta.attackElement);
            if (elementId && (elementId > 0)) {
                set.push(elementId);
            } else {
                set.push(TWLD.Core.PhysicalElements[0]);
            }
        }
        return set;
    };
    
    
    //------------------------------------------------------------------------------
    // Game_Item
    /**
     * 長距離タイプかどうかを判定する。
     * @return 
     */
    Game_Item.prototype.isLongRange = function() {
        var range = this.object().range;
        if (range && (range === Game_Action.RANGE_LONG)) {
            return true;
        } else {
            return false; // rangeが未定義の場合も含む。
        }
    };


    //------------------------------------------------------------------------------
    // Game_Action
    //
    TWLD.Core.Game_Action_clear = Game_Action.prototype.clear;
    /**
     * クリアする。
     */
    Game_Action.prototype.clear = function() {
        TWLD.Core.Game_Action_clear.call(this);
        this._damageValue = 0;
    };

    /**
     * ダメージ値を得る。
     * @return {Number} ダメージ値
     */
    Game_Action.prototype.damageValue = function() {
        return this._damageValue;
    };

    TWLD.Core.Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;

    /**
     * このアクションを適用する。
     * 
     * @param {Game_BattlerBase} target ターゲット
     * @oaram effect エフェクトデータオブジェクト
     */
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        switch (effect.code) {
            case Game_Action.EFFECT_TWLD_BASICPARAM_ADD:
                this.applyItemEffectBasicParamAdd(target, effect);
                break;
            case Game_Action.EFFECT_TWLD_LEARNABLESKILL_ADD:
                this.applyItemEffectLearnableSkillAdd(target, effect);
                break;
            case Game_Action.EFFECT_TWLD_UPDATE_LUK:
                this.applyItemEffectUpdateLuk(target, effect);
                break;
            default:
                TWLD.Core.Game_Action_applyItemEffect.call(this, target, effect);
                break;
        }
    };





    /**
     * 基本パラメータを加算するアイテム適用処理を行う。
     * @param {Game_BattlerBase} target ターゲット
     * @param effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffectBasicParamAdd = function(target, effect) {
        target.addBasicParam(effect.paramId, effect.value1);
        this.makeSuccess(target);
    };

    /**
     * 習得可能スキルを追加するアイテム適用処理を行う。
     * @param {Game_BattlerBase} target ターゲット
     * @param effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffectLearnableSkillAdd = function(target, effect) {
        target.addGpLearnableSkill(effect.value1);
        this.makeSuccess(target);
    };

    /**
     * LUKを更新する効果を処理する。
     * @param {Game_BattlerBase} target ターゲット
     * @param effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffectUpdateLuk = function(target, effect) {
        target.updateLuk(effect.value1, effect.value2);
        this.makeSuccess(target);
    };

    TWLD.Core.Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;

    /**
     * アイテムが適用可能かどうかをテストする。
     * 
     * @return {Boolean} 適用可能な場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testItemEffect = function(target, effect) {
        switch (effect.code) {
            case Game_Action.EFFECT_TWLD_BASICPARAM_ADD:
                var param = target.basicParams[effect.paramId];
                return ((effect.value1 !== 0) && ((param.add) ? (param.add < 999) : false));
            case Game_Action.EFFECT_TWLD_LEARNABLESKILL_ADD:
                var skillId = effect.value1;
                return !target.isLearnedSkill(skillId) && !target.isGpLearnableSkill(skillId);
            case Game_Action.EFFECT_TWLD_UPDATE_LUK:
                return true;
            default:
                return TWLD.Core.Game_Action_testItemEffect.call(this, target, effect);
        }
    };



    /**
     * 属性による与ダメージ倍率を計算する。
     * @param {Game_BattlerBase} target 行動対象
     * @return {Number} 与ダメージ倍率
     */
    Game_Action.prototype.calcElementRate = function(target) {
        if (this.isPhysical()) {
            // 物理行動
            return this.getPhysicalElementRate(target);
        } else if (this.isMagical()) {
            // 魔法行動
            return this.getMagicalElementRate(target);
        } else {
            // 上記以外
            return this.getOtherElementRate(target);
        }
    };

    /**
     * 物理攻撃属性ID列を得る。
     * @return {Array<Number>} 物理攻撃属性ID配列
     */
    Game_Action.prototype.getPhysicalAttackElementIds = function() {
        // このelementIdsに物理属性が含まれていない
        //    attackElements()に含まれている物理属性を追加する。
        // このelementIdsに物理属性が含まれている。(=指定されてる,属性の上書き)
        //    elementIdsの物理属性を返す。
        var item = this.item();
        var elementIds = [];
        if (item.elementIds) {
            // elementIdsを持ってる。
            item.elementIds.forEach(function(id) {
                if (!elementIds.contains(id) && TWLD.Core.isPhysicalElement(id)) {
                    elementIds.push(id);
                }
            });
            if (elementIds.length == 0) {
                // attackElements()に含まれている物理属性を追加する。
                this.subject().attackElements().forEach(function(id) {
                    if (!elementIds.contains(id) && TWLD.Core.isPhysicalElement(id)) {
                        elementIds.push(id);
                    }
                });
            }            
        } else {
            // elementIdsが無い場合、elementIdが指定されていれば使用する。
            if (item.damage.elementId > 0) {
                if (TWLD.Core.isPhysicalElement(item.damage.elementId)) {
                    elementIds.push(item.damage.elementId);
                }
            } else {
                // attackElements()に含まれている物理属性を追加する。
                this.subject().attackElements().forEach(function(id) {
                    if (!elementIds.contains(id) && TWLD.Core.isPhysicalElement(id)) {
                        elementIds.push(id);
                    }
                });
            }
        }
        return elementIds;
    };

    /**
     * 魔法攻撃属性配列を得る。
     * @return {Array<Number>} ID配列
     */
    Game_Action.prototype.getMagicalAttackElementIds = function() {
        // このelementIdsに魔法属性が含まれていない。
        //    attackElements()に含まれている魔法属性を追加する。
        // このelementIdsに魔法属性が含まれている。(=指定されてる、属性の上書き) 
        //    elementIdsの魔法属性を返す。
        var item = this.item();
        var elementIds = [];
        if (item.elementIds) {
            // elementIdsを持ってる。
            item.elementIds.forEach(function(id) {
                if (!elementIds.contains(id) && !TWLD.Core.isPhysicalElement(id)) {
                    elementIds.push(id);
                }
            });
            if (elementIds.length == 0) {
                // attackElements()に含まれている物理属性を追加する。
                this.subject().attackElements().forEach(function(id) {
                    if (!elementIds.contains(id) && !TWLD.Core.isPhysicalElement(id)) {
                        elementIds.push(id);
                    }
                });
            }            
        } else {
            // elementIdsが無い場合、elementIdが指定されていれば使用する。
            if (item.damage.elementId > 0) {
                if (!TWLD.Core.isPhysicalElement(item.damage.elementId)) {
                    elementIds.push(item.damage.elementId);
                }
            }
        }
        return elementIds;
    };

    /**
     * 物理時の属性補正値を取得する。
     * @param {Game_BattlerBase} target 行動対象
     * @return {Number} 補正値
     */
    Game_Action.prototype.getPhysicalElementRate = function(target) {
        // 考え方が非常にむつかしくなってるので少し整理する。
        var physElementIds = this.getPhysicalAttackElementIds();
        if (physElementIds.length === 0) {
            physElementIds.push(TWLD.Core.PhysicalElements[0]);
        }

        // 物理の有効度は加算して平均とる。
        var physRate = physElementIds.reduce(function(prev, id) {
            var targetRate = target.elementRate(id);
            var x = Math.abs(prev) * Math.abs(targetRate);
            return ((prev >= 0) && (targetRate >= 0)) ? x : -x;
        }, 1) / physElementIds.length;

        var magElementIds = this.getMagicalAttackElementIds();
        var magRate = magElementIds.reduce(function(prev, element) {
            // 魔法属性倍率を乗算する
            var targetRate = target.elementRate(element);
            var x = Math.abs(prev) * Math.abs(targetRate);
            return ((prev >= 0) && (targetRate >= 0)) ? x : -x;
        }, 1) - 1.0;

        var wmRate = (1.0 + this.getWMDamageBonusRate()); // ウェポンマスタり補正値。
        return (physRate + magRate) * wmRate;
    };

    /**
     * 魔法の属性補正値を取得する。
     * @param {Game_BattlerBase} target 行動対象
     * @return {Number} 補正値
     */
    Game_Action.prototype.getMagicalElementRate = function(target) {
        // 魔法の場合は設定されている属性IDをまるっと持ってくればいい。
        var item = this.item();
        var elementIds = [];
        if (item.elementIds) {
            elementIds = item.elementIds;
        } else if (item.damage.elementId > 0) {
            elementIds.push(item.damage.elementId);
        }
        var magRate = elementIds.reduce(function(prev, element) {
            // 魔法属性倍率を乗算する。
            var targetRate = target.elementRate(element);
            var x = Math.abs(prev) * Math.abs(targetRate);
            return ((prev >= 0) && (targetRate >= 0)) ? x : -x;
        }, 1.0)

        var wmRate = (1.0 + this.getWMDamageBonusRate()); // ウェポンマスタり補正値。
        return magRate * wmRate;
    };

    /**
     * 物理でも魔法でもない場合の属性補正値を取得する。
     * @param {Game_BattlerBase} target 行動対象
     * @return {Number} 補正値
     */
    Game_Action.prototype.getOtherElementRate = function(target) {
        if (this.item().damage.elementId < 0) {
            return 1.0; // 属性なし。
        } else {
            return target.elementRate(this.item().damage.elementId);
        }
    };

    /**
     * 適用するウェポンマスタリータイプを得る。
     * @return {Number} ウェポンマスタリータイプ
     */
    Game_Action.prototype.getWMType = function() {
        var item = this.item();
        if (!DataManager.isSkill(item)) {
            return 0;
        } else {
            var wmTypeId = item.wmTypeId;
            if (wmTypeId > 0) {
                // 適用するウェポンマスタリータイプが指定されている。
                return wmTypeId;
            } else {
                // 適用するウェポンマスタリータイプが指定されていない。
                if (this.subject().isActor()) {
                    var weapons = this.subject().weapons();
                   return (weapons.length > 0) ? weapons[0].wtypeId : 1;
                } else {
                    return 1;
                }
            }
        }
    };

    /**
     * ウェポンマスタリーによるボーナスを得る。
     * @return ボーナス値。
     */
    Game_Action.prototype.getWMDamageBonusRate = function() {
        var wmTypeId = this.getWMType();
        var wmLevel = this.subject().getWMLevel(wmTypeId);
        return wmLevel * 0.005; // レベル * 0.5%
    };

    /**
     * HITボーナスを得る。
     * @return ボーナス値
     */
    Game_Action.prototype.getWMHitBonus = function() {
        var wmTypeId = this.getWMType();
        var wmLevel = this.subject().getWMLevel(wmTypeId);
        return wmLevel * 0.002; // レベル * 0.2%
    };




    /**
     * ロングレンジスキルかどうかを判定して返す。
     */
    Game_Action.prototype.isLongRange = function() {
        // スキルにロングレンジ属性がついているかどうかで判定する。
        if (this.isSkill()) {
            return this.item().range === Game_Item.RANGE_LONG
        } else {
            return false;
        }
    };

    /**
     * 当たるかどうかを判定する。 
     * @param {Game_BattlerBase} target ターゲット
     * @return 成功した場合にはtrue,それ以外はfalse
     */
    Game_Action.prototype.testHit = function(target) {
        var subject = this.subject(); // 使用者
        var hitRate = this.itemHit(target); // 基本命中率(スキルの使いやすさ)
        if (this.isPhysical()) {
            var pev = target.eva // 回避率は純粋に効いてくる
                - (hitRate - 1.0) // 命中率分の補正。1.0超えた分は命中しやすくなる。
                + (target.luk - subject.luk) * 0.01; // LUKによるあたり判定(LUK高いやつは当てやすい)
            if (this.isLongRange()) {
                // 長距離の場合には相手の素早さと使用者の器用さを比較する。
                pev += this.getRelativeDiff(target.agi, subject.dex);
            } else {
                // 接近戦の場合にはDEXとAGIの合計値を比較する。
                pev += this.getRelativeDiff((target.dex + target.agi), (subject.dex + subject.agi));
            }
            return Math.random() >= pev;
        } else if (this.isMagical()) {
            var mev = target.mev // 魔法回避率は純粋に効いてくる。
                - (hitRate - 1.0) // 命中率の1.0超えた分は相手の回避率を減らす方向に効く。
                + this.getRelativeDiff(target.men, subject.men) / 2
                + (target.luk - subject.luk) * 0.01; // LUKによるあたり判定(LUK高いやつは当てやすい)
                return Math.random() >= mev;
        } else {
            return true; // その他は100%成功
        }
    };

    TWLD.Core.Game_Action_itemHit = Game_Action.prototype.itemHit;
    /**
     * 当てる確率を得る。
     * 物理アクションの場合：対象の物理命中率を返す。
     * 魔法アクションの場合：対象の魔法命中率を返す。
     * 
     * @return 当てる確率 
     */
    Game_Action.prototype.itemHit = function(target) {
        var rate = TWLD.Core.Game_Action_itemHit.call(this, target);
        rate += this.getWMHitBonus();
        return rate;
    };

    /**
     * 相対的な補正値を得る。
     * 一方の値に対してもう一方の値が大きいほど、補正値が大きくなる。
     * 
     * @param {Number} left 左辺値
     * @param {Number} right 右辺値
     * @return 相対補正値
     */
    Game_Action.prototype.getRelativeDiff = function(left, right) {
        var diff = left - right;
        return diff /= Math.min(left, right);
    };

    /** 
     * クリティカル発生率を返す。
     * @param {Game_Battler} target
     * @return クリティカル率(0.0～1.0、1.0で100％発生)が返る。
     */
    Game_Action.prototype.itemCri = function(target) {
        var subject = this.subject(); // 使用者
        var rate = subject.cri  - target.cev + (subject.luk - target.luk) * 0.01 / 2;
        if (this.isPhysical()) {
            // 物理の場合にはDEXが効いてくる。
            // この計算式だと、対象より技量が2倍以上あると確率が100％になってしまうので
            // clampにより加算値が0.0～0.5の範囲に収まるようにする。
            var dexadd = (subject.dex - target.dex) / Math.min(subject.dex, target.dex);
            rate += dexadd.clamp(0, 0.5);
        }
        rate *= this.lukEffectRate(target);
        return rate;
    };




    /**
     * LUKによる補正値を計算する。
     * 使用者よりターゲットの運が高いとマイナスの補正値になる。
     * 使用者よりターゲットの運が低いとプラスの補正値になる。
     * 
     * TWLDでのLUK値は0～100なので、1ポイント差分による影響度を上げるため、計算式を変更している。
     * 
     * @param {Game_battlerBase} target 使用対象
     * @return 0.0～の補正値。
     */
    Game_Action.prototype.lukEffectRate = function(target) {
        return Math.max(1.0 + (this.subject().luk - target.luk) * 0.005, 0.0);
    };

    //------------------------------------------------------------------------------
    // Game_Party
    //
    /**
     * 戦闘参加メンバーでabilityIdで指定される特性を持っているメンバーがいるかどうかを判定する。
     * 
     * @note 既定の実装ではメンバーの生存状態に関係なかったが、生存オンリーとした。
     * @param {Number} abilityId アビリティID(Game_Party.PARTY_ABILITY)
     * @return 持っている場合にはtrue ,それ以外はfalse
     */
    Game_Party.prototype.partyAbility = function(abilityId) {
        return this.battleMembers().some(function(actor) {
            return !actor.isDead() && actor.partyAbility(abilityId);
        });
    };





    //------------------------------------------------------------------------------
    // BattleManager
    //

    TWLD.Core.BattleManager_startBattle = BattleManager.startBattle;

    /**
     * 戦闘を開始する。
     */
    BattleManager.startBattle = function() {
        TWLD.Core.BattleManager_startBattle.call(this);
        this._maxDamage = 0;
    };

    TWLD.Core.BattleManager_invokeAction = BattleManager.invokeAction;

    /**
     * アクションを実行する。
     * @param {Game_BattlerBase} subject 実行者
     * @param {Game_BattlerBase} target 対象
     */
    BattleManager.invokeAction = function(subject, target) {
        TWLD.Core.BattleManager_invokeAction.call(this, subject, target);
        if (subject.isActor()) {
            var damageValue = this._action.damageValue();
            this._maxDamage = Math.max(this._maxDamage, Math.abs(damageValue));
        }
    };

    TWLD.Core.BattleManager_makeRewards = BattleManager.makeRewards;
    /**
     * 戦闘報酬(gold/exp/item)を作成する。
     */
    BattleManager.makeRewards = function() {
        TWLD.Core.BattleManager_makeRewards.call(this);
        var baseExp = this._rewards.exp;
        var bonusRate = this.maxDamageBonus();
        this._rewards.bonusRate = bonusRate;
        this._rewards.baseExp = baseExp;
        this._rewards.exp = Math.floor(baseExp * (1 + bonusRate));
    };

    /**
     * 最大ダメージボーナスを加味したレートを得る。
     * @return {Number} ボーナスレート。
     */
    BattleManager.maxDamageBonus = function() {
        return this._maxDamage / 100;
    };

    /**
     * EXPを加算する。
     */
    BattleManager.gainExp = function() {
        // Note: ここでEXPを除算するのはシステムによってはいただけない。
        //       なぜならRewardsで表示している場合があるからだ。
        var exp = this._rewards.exp;
        var eachExp = Math.floor(exp * (1.0 - ($gameParty.battleMembers().length - 1) * 0.15));
        $gameParty.battleMembers().forEach(function(actor) {
            if (!actor.isDead()) {
                actor.gainExp(eachExp);
            }
        });
    };




    //------------------------------------------------------------------------------
    // Game_Interpreter
    //
    TWLD.Core.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        TWLD.Core.Game_Interpreter_pluginCommand.call(this, command, args);
        if (/^TWLD\./.test(command)) {
            switch (command) {
                case 'TWLD.ResetActorGrows':
                    this.resetActorGrows(args);
                    break;
                case 'TWLD.AddLearnableSkill':
                    this.addActorLearnableSkill(args);
                    break;
                case 'TWLD.UpdateLuk':
                    this.updateLuk(args);
                    break;
            }
        }
    };

    /**
     * 指定されたアクターの育成状態をリセットする。
     * @param {Array} args パラメータ
     */
    Game_Interpreter.prototype.resetActorGrows = function(args) {
        var actor =TWLD.Core.getActor(args[0]);
        if (!actor) {
            return;
        }
        actor.resetGrows();
    };

    /**
     * アクターに習得可能スキルを追加する。
     * @param {Array} args パラメータ
     */
    Game_Interpreter.prototype.addActorLearnableSkill = function(args) {
        var actor = TWLD.Core.getActor(args[0]);
        if (!actor) {
            return;
        }
        var skillId = Number(args[1]);
        if ((skillId < 0) || (skillId >= $dataSkills.length)) {
            return;
        }
        actor.addGpLearnableSkill(skillId);
    };

    /**
     * LUKを更新する。
     * @param {Array} args パラメータ
     */
    Game_Interpreter.prototype.updateLuk = function(args) {
        var actor;
        var target = args[0] || '';
        if (target.match(/party/i)) {
            $gameParty.allMembers().forEach(function(actor) {
                actor.updateLuk();
            });
        } else if ((actor = TWLD.Core.getActor(args[0])) !== null) {
            actor.updateLuk();
        }
    };


    //------------------------------------------------------------------------------
    // Window_Base
    //    複数のウィンドウで使うメソッドはこちらで定義しておく。

    /**
     * TPゲージカラー2を得る。
     * @return {Color} TPゲージカラー2
     */
    Window_Base.prototype.tpGaugeColor2 = function() {
        return this.textColor(28);
    };
    
    /**
     * 基本パラメータ(STR/DEX/VIT/INT/MEN/AGI)を描画する。
     * @param {String} name パラメータ名
     * @param {Number} current 現在値
     * @param {Number} correct 補正値
     * @param {Number} x 水平位置
     * @param {Number} y 垂直位置
     * @param {Number} width 描画幅
     */
    Window_Base.prototype.drawBasicParam = function(name, current, correct, x, y, width) {
        this.resetTextColor();
        var labelWidth = this.textWidth(name) + 16;
        var valueWidth = this.textWidth('000');
        var correctWidth = this.textWidth(' (+000)');
        if ((labelWidth + valueWidth + correctWidth) < width) {
            this.changeTextColor(this.systemColor());
            this.drawText(name, x, y, labelWidth);
            this.resetTextColor();
            var text = ('   ' + current).slice(-3) + ' (' + ('    ' + correct).slice(-4) + ')';
            this.drawText(text, x + labelWidth, y, width - labelWidth, 'left');
        } else if ((labelWidth + valueWidth) < width) {
            this.changeTextColor(this.systemColor());
            this.drawText(name, x, y, labelWidth);
            this.resetTextColor();
            this.drawText(current, x + labelWidth, y, width - labelWidth, 'left');
        } else if (valueWidth < width) {
            this.resetTextColor();
            this.drawText(current, x + labelWidth, y, valueWidth, 'right');
        } else {
            // 描画領域不足。
        }
    };
    

    /**
     * GPを表示する。
     * @param {Game_Actor} actor アクター
     * @param {Number} x X位置
     * @param {Number} y Y位置
     * @param {Number} width 描画範囲の幅
     */
     // eslint-disable-next-line no-unused-vars
    Window_Base.prototype.drawActorGrowPoint = function(actor, x, y, width) {
        this.changeTextColor(this.systemColor());
        this.drawText("GP", x, y, 48);
        this.changeTextColor(this.normalColor());
        this.drawText(actor.getGrowPoint(), x + 56, y, 64, 'right');
    };
    /**
     * 次のレベルまでのEXPを描画する。
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x位置
     * @param {Number} y 描画領域左上y位置
     * @param {Number} width 幅
     */
    Window_Base.prototype.drawActorNextExp = function(actor, x, y, width) {
        var label = TextManager.expNext.format(TextManager.level);
        var labelWidth = this.textWidth(label);
        var expWidth = this.textWidth('------');
        var nextExp = actor.nextRequiredExp();
        if (actor.isMaxLevel()) {
            nextExp = '-------';
        }
        if ((width - expWidth) > labelWidth) {
            // ラベルを表示するスペースがある。
            this.changeTextColor(this.systemColor());
            this.drawText(label, x, y, labelWidth);
            this.resetTextColor();
            this.drawText(nextExp, x + labelWidth, y, width - labelWidth, 'right');
        } else {
            this.resetTextColor();
            this.drawText(nextExp, x, y, width, 'right');
        }
    };
    //------------------------------------------------------------------------------
    // Window_Help
    // 表示内容もりっと書き換えたい。
    //
    /**
     * ウィンドウを作成する。
     * ベースシステムでは上に固定表示だったので変更した。
     * @param {Number} numLines 行数。省略時は2行分
     * @param {Number} x ウィンドウx位置。省略時は0
     * @param {Number} y ウィンドウy位置。省略時は0
     * @param {Number} width ウィンドウ幅。省略時は画面の横幅目一杯
     * @param {Number} height ウィンドウ高さ。省略時は行数とfittingHeightで算出する。
     */
    Window_Help.prototype.initialize = function(numLines, x, y, width, height) {
        x = x || 0;
        y = y || 0;
        width = width || Graphics.boxWidth;
        height = height || this.fittingHeight(numLines || 2);
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._numLines = numLines || 2;
        this._text = '';
        this._actor = null;
        this._item = null;
    };

    /**
     * アクターを設定する。
     * @param {Game_Actor} actor アクター
     */
    Window_Help.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.clear();
        }
    }
    
    /**
     * 表示メッセージを設定する。
     * @param {String} text メッセージ
     */
    Window_Help.prototype.setText = function(text) {
        if (this._text !== text) {
            this._text = text;
            this._item = null;
            this.refresh();
        }
    };
    
    /**
     * 説明する対象の項目を設定する。
     * @param {Data_Item} item アイテム。descriptionメンバがあれば良い。
     */
    Window_Help.prototype.setItem = function(item) {
        if (this._item != item) {
            this._text = item ? item.description : '';
            this._item = item;
            this.refresh();
        }
    };
    
    /**
     * コンテンツを再描画する。
     */
    Window_Help.prototype.refresh = function() {
        this.contents.clear();
        if ((this._numLines <= 2) || (this._item == null)) {
            this.drawTextEx(this._text, this.textPadding(), 0);
        } else {
            // 種類別に詳細表示しよう。
            var item = this._item;
            if (DataManager.isSkill(item)) {
                this.refreshSkill(item);
            } else if (DataManager.isItem(item)) {
                this.refreshItem(item);
            } else if (DataManager.isWeapon(item)) {
                this.refreshWeapon(item);
            } else if (DataManager.isArmor(item)) {
                this.refreshArmor(item);
            } else {
                this.drawTextEx(item.description, this.textPadding(), 0);
            }
        }
    };

    /**
     * スキルの説明を描画する。
     * 既定の実装はdescriptionを描画するのみ。
     * @param {Data_Skill} スキルデータ
     */
    Window_Help.prototype.refreshSkill = function(item) {
        var padding = this.standardPadding();
        var x = padding;
        var y = padding;
        var text = item.description || '';
        this.drawTextEx(text, x, y, this.contentsWidth());
    };

    /**
     * 道具の説明を描画する。
     * 既定の実装は単純なdescription表示にする。
     * TWLD_UI側で必要に応じて書き換える。
     */
    Window_Help.prototype.refreshItem = function(item) {
        var padding = this.standardPadding();
        var x = padding;
        var y = padding;
        var text = item.description || '';
        this.drawTextEx(text, x, y, this.contentsWidth());
    };

    /**
     * 武器の説明を描画する。
     * 既定の実装は単純なdescription表示にする。
     * TWLD_UI側で必要に応じて書き換える。
     */
    Window_Help.prototype.refreshWeapon = function(item) {
        var padding = this.standardPadding();
        var x = padding;
        var y = padding;
        var text = item.description || '';
        this.drawTextEx(text, x, y, this.contentsWidth());
    };

    /**
     * 防具の説明を描画する。
     * 既定の実装は単純なdescription表示にする。
     * TWLD_UI側で必要に応じて書き換える。
     */
    Window_Help.prototype.refreshArmor = function(item) {
        var padding = this.standardPadding();
        var x = padding;
        var y = padding;
        var text = item.description || '';
        this.drawTextEx(text, x, y, this.contentsWidth());
    };

   








    //------------------------------------------------------------------------------
    // Scene_Menu
    //     メニューにコマンド追加
    //
    TWLD.Core.Scene_Menu_CreateCommandWindow = Scene_Menu.prototype.createCommandWindow;
    /**
     * コマンドウィンドウを作成する。
     */
    Scene_Menu.prototype.createCommandWindow = function() {
        TWLD.Core.Scene_Menu_CreateCommandWindow.call(this);
        this._commandWindow.setHandler('growup', this.commandPersonal.bind(this));
    };


    TWLD.Core.Scene_Menu_commandPersonal = Scene_Menu.prototype.commandPersonal;

    /**
     * アクター選択が必用なコマンドが選択された時に通知を受け取る。
     * 通常はフックする必要はないんだけど、パーティー人数で対象が1名ならサクッとやった方がいいよね。
     */
    Scene_Menu.prototype.commandPersonal = function() {
        if ($gameParty.size() == 1) {
            // 選択が自明なので選択をスキップする。
            $gameParty.setMenuActor($gameParty.members()[0]);
            this.onPersonalOk();
        } else {
            TWLD.Core.Scene_Menu_commandPersonal.call(this);
        }
    };


    TWLD.Core.Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
    /**
     * メニューでアクターが選択された時に通知を受け取る。
     */
    Scene_Menu.prototype.onPersonalOk = function() {
        switch (this._commandWindow.currentSymbol()) {
            case 'growup':
                SceneManager.push(Scene_Growup);
                break;
            default:
                TWLD.Core.Scene_Menu_onPersonalOk.call(this);
                break;
        }
    };

    //------------------------------------------------------------------------------
    // Window_MenuCommand
    //    コマンドを登録する。
    TWLD.Core.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;

    /**
     * 独自コマンドを追加する。
     */
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        TWLD.Core.Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand('育成', 'growup', true);
    };

    //------------------------------------------------------------------------------
    // Scene_Battleのヘルプウィンドウ変更
    // 
    Scene_Battle.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Help(3);
        this._helpWindow.visible = false;
        this.addWindow(this._helpWindow);
    };

})();//EOF
