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






    TWLD.Core.BasicParamIcons = [ -1, -1, -1, -1, -1, -1 ];
    TWLD.Core.ReincarnationIconIndex = -1;
    TWLD.Core.PhysicalElements = [ 1,2,3 ]; // 打,斬,突
    TWLD.Core.BasicCriticalRate = 1.5; // クリティカル倍率基本値





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
                if ((re = line.match(patternWM)) !== null) {
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


            enemy.WM = 1;
            enemy.uniqueTraits = [];

            var noteLines = enemy.note.split(/[\r\n]+/);
            noteLines.forEach(function(line) {
                var re, i;
                if ((re = line.match(patternBasicParamRandom)) !== null) {
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
        
        var patternElementIds = /<ElementIds[ :]+(.+) ?>/;

        for (var n = 1; n < skills.length; n++) {
            var skill = skills[n];

            skill.elementIds = [];
            if (skill.damage.elementId > 0) {
                skill.elementIds.push(skill.damage.elementId);
            }
            skill.hpCost = Number(skill.meta.hpCost) || 0;
            skill.hpCostRate = Number(skill.meta.hpCostRate) || 0;
            skill.mpCostRate = Number(skill.meta.mpCostRate) || 0;
            skill.wmTypeId = Number(skill.meta.wmType) || 0;
            skill.range = Game_Item.RANGE_SHORT; // short range.

            var noteLines = skill.note.split(/[\r\n]+/);
            noteLines.forEach(function (line) {
                var re;
                if ((re = line.match(patternElementIds)) !== null) {
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



    //------------------------------------------------------------------------------
    // Game_BattlerBase
    //

























    





    //------------------------------------------------------------------------------
    // Game_Actor
    //     basicParams : 基本パラメータ。(base, grown, addメンバを持つ)
    //     growPoint   : 成長処理用振り分けボーナス値
    //                   
    //





    /**
     * プロフィール用のデータを用意する。
     */
    Game_Actor.prototype.setupProfile = function(actorId) {
        var actor = $dataActors[actorId];
        this._profilePictureName = actor.profilePicture;
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
     * 装備品パラメータによる加算値合計を取得する。
     * 
     * @param {Number} paramId パラメータID
     */
    Game_Actor.prototype.getBasicParamCorrectByEquips = function (paramId) {
        var equips = this.equips();
        return equips.reduce(function (prev, equipItem) {
            return prev + ((equipItem !== null) ? equipItem.basicParams[paramId].add : 0);
        }, 0);
    };




    //------------------------------------------------------------------------------
    // Game_Enemy
    //











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
     * 
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
    // Scene_Battleのヘルプウィンドウ変更
    // 
    Scene_Battle.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Help(3);
        this._helpWindow.visible = false;
        this.addWindow(this._helpWindow);
    };

})();//EOF
