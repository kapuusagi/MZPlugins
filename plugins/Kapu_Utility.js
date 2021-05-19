/*:ja
 * @target MZ 
 * @plugindesc プラグインで使用する、いくつかの拡張を提供するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @help 
 * 追加メソッド
 * ノートタグパーサー追加API。いちいちforでデータコレクションを回さなくて良いように追加。
 * DataManager.addNotetagParserActors(method:function) : void
 *     $dataActors に対するノートタグパーサーを追加する。
 * DataManager.addNotetagParserClasses(method:function) : void
 *     $dataClasses に対するノートタグパーサーを追加する。
 * DataManager.addNotetagParserItems(method:function) : void
 *     $dataItems に対するノートタグパーサーを追加する。
 * DataManager.addNotetagParserWeapons(method:function) : void
 *     $dataWeapons に対するノートタグパーサーを追加する。
 * DataManager.addNotetagParserArmors(method:function) : void
 *     $dataArmors に対するノートタグパーサーを追加する。
 * DataManager.addNotetagParserEnemies(method:function) : void
 *     $dataEnemies に対するノートタグパーサーを追加する。
 * DataManager.addNotetagParserSkills(method:function) : void
 *     $dataSkills に対するノートタグパーサーを追加する。
 * DataManager.addNotetagParserStates(method:function) : void
 *     $dataStates に対するノートタグパーサーを追加する。
 * DataManager.addNotetagParserTilesets(method:function) : void
 *     $dataTilesets に対するノートタグパーサーを追加する。
 * DataManager.addNotetagParserMaps(method:function) : void
 *     $dataMapに対するノートタグパーサーを追加する。
 * 
 * DataManager.traitsSum(traitObj:TraitObject, code:number, dataId:number) : number
 *     code, dataIdに一致するTraitの特性値の加算合計を得る。
 * 
 * DataManager.traitPi(traitObj:TraitObject, code:number, dataId:number) : number
 *     code, dataIdに一致するTraitの特性値の乗算合計を得る。
 * 
 * Game_Party.partyTraitsSum(ability:number) : number
 *     指定したパーティーアビリティIDの特性値合計を得る。
 * 
 * Game_Party.partyTraitsSumMax(abilityId:number) : number
 *     指定したパーティーアビリティIDについて、
 *     アクターそれぞれに合計をとって最大値を得る。
 *     パーティーメンバーのうち、最も高い値を
 *     適用したい場合に使用する。
 * 
 * Game_Party.partyTraitsSumMin(abilityId:number) : number
 *     指定したパーティーアビリティIDについて、
 *     アクターそれぞれに合計をとって最小値を得る。
 *     パーティーメンバーのうち、最も低い値を
 *     適用したい場合に使用する。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.3.0 Mapのノートタグ解析タイミングが正しくない不具合を修正した。
 * Version.0.2.0 $gameParty.partyTraitsSumMin()を追加した。
 *               $gameParty.partyTraitsSumMax()が上手く動作していない不具合を修正。
 * Version.0.1.1 コメント誤りを修正した。
 * Version.0.1.0 TWLDで実装したのを移植。
 */
(() => {
    //------------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    /**
     * Scene_Bootを開始する。
     */
    Scene_Boot.prototype.start = function () {
        DataManager.processGenericNotetags();
        _Scene_Boot_start.call(this);
    };
    //------------------------------------------------------------------------------
    // Scene_Map
    const _Scene_Map_onTransferEnd = Scene_Map.prototype.onTransferEnd;
    /**
     * 転送完了時の処理を行う。
     */
    Scene_Map.prototype.onTransferEnd = function() {
        _Scene_Map_onTransferEnd.call(this);
        DataManager.processMapNotetag();
    };


    //------------------------------------------------------------------------------
    // DataManager
    DataManager._noteTagParserActors = [];
    DataManager._noteTagParserClasses = [];
    DataManager._noteTagParserItems = [];
    DataManager._noteTagParserWeapons = [];
    DataManager._noteTagParserArmors = [];
    DataManager._noteTagParserEnemies = [];
    DataManager._noteTagParserSkills = [];
    DataManager._noteTagParserStates = [];
    DataManager._noteTagParserTilesets = [];
    DataManager._noteTagParserTroops = [];
    DataManager._noteTagParserMaps = [];

    /**
     * $dataActorsのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataActorが渡される。
     */
    DataManager.addNotetagParserActors = function(method) {
        this._noteTagParserActors.push(method);
    };

    /**
     * $dataClassesのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataClassが渡される。
     */
    DataManager.addNotetagParserClasses = function(method) {
        this._noteTagParserClasses.push(method);
    };

    /**
     * $dataItemsのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataItemが渡される。
     */
    DataManager.addNotetagParserItems = function(method) {
        this._noteTagParserItems.push(method);
    };

    /**
     * $dataWeaponsのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataWeaponが渡される。
     */
    DataManager.addNotetagParserWeapons = function(method) {
        this._noteTagParserWeapons.push(method);
    };

    /**
     * $dataArmorsのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataArmorが渡される。
     */
    DataManager.addNotetagParserArmors = function(method) {
        this._noteTagParserArmors.push(method);
    };

    /**
     * $dataEnemiesのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataEnemyが渡される。
     */
    DataManager.addNotetagParserEnemies = function(method) {
        this._noteTagParserEnemies.push(method);
    };

    /**
     * $dataSkillsのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataSkillが渡される。
     */
    DataManager.addNotetagParserSkills = function(method) {
        this._noteTagParserSkills.push(method);
    };

    /**
     * $dataStatesのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataStateが渡される。
     */
    DataManager.addNotetagParserStates = function(method) {
        this._noteTagParserStates.push(method);
    };

    /**
     * $dataTilesetsのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataTilesetが渡される。
     */
    DataManager.addNotetagParserTilesets = function(method) {
        this._noteTagParserTilesets.push(method);
    };

    /**
     * $dataTroopsのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataTroopが渡される。
     */
    DataManager.addNotetagParserTroops = function(method) {
        this._noteTagParserTroops.push(method);
    };

    /**
     * マップのノートタグパーサーを追加する。
     * 
     * @param {function} method メソッド。第1引数としてDataMapが渡される。
     */
    DataManager.addNotetagParserMaps = function(method) {
        this._noteTagParserMaps.push(method);
    };

    /**
     * 一般的なノートタグ処理を行う。
     */
    DataManager.processGenericNotetags = function() {
        DataManager.processGenericNotetagsCollections($dataActors, this._noteTagParserActors);
        DataManager.processGenericNotetagsCollections($dataClasses, this._noteTagParserClasses);
        DataManager.processGenericNotetagsCollections($dataItems, this._noteTagParserItems);
        DataManager.processGenericNotetagsCollections($dataWeapons, this._noteTagParserWeapons);
        DataManager.processGenericNotetagsCollections($dataArmors, this._noteTagParserArmors);
        DataManager.processGenericNotetagsCollections($dataEnemies, this._noteTagParserEnemies);
        DataManager.processGenericNotetagsCollections($dataSkills, this._noteTagParserSkills);
        DataManager.processGenericNotetagsCollections($dataStates, this._noteTagParserStates);
        DataManager.processGenericNotetagsCollections($dataTilesets, this._noteTagParserTilesets);
        DataManager.processGenericNotetagsCollections($dataTroops, this._noteTagParserTroops);
    };


    /**
     * データコレクションのノートタグを処理する。
     * 
     * @param {Array<Object>} dataArray データコレクション。メンバにnoteとmetaを持つ。
     * @param {Array<Function>} methods メソッドのコレクション。
     */
    DataManager.processGenericNotetagsCollections = function(dataArray, methods) {
        if (methods.length === 0) {
            return;
        }
        for (let i = 1; i < dataArray.length; i++) {
            obj = dataArray[i];
            if (!obj) {
                continue;
            }
            try {
                for (let method of methods) {
                    method.call(this, obj);
                }
            }
            catch (e) {
                console.error("Notetag parse fail. [name:" + obj.name + "]");
                console.error(e);
            }
        }
    };

    /**
     * マップのノートタグを処理する。
     */
    DataManager.processMapNotetag = function() {
        const methods = this._noteTagParserMaps;
        if (methods.length === 0) {
            return;
        }
        try {
            for (let method of methods) {
                method.call(this, $dataMap);
            }
        }
        catch (e) {
            console.error("Notetag parse fail. [name:" + $dataMap.displayName + "]");
            console.error(e);
        }
    };




    /**
     * traitObjから、codeとparamIdを持つものの合計を得る。
     * 
     * @param {TraitObject} traitObj traitsをメンバに持つオブジェクト
     * @param {Number} code Game_BattlerBase.TRAIT_～を指定する。
     * @param {Number} dataId パラメータID
     * @returns valueの合計値が返る。
     */
    DataManager.traitsSum = function(traitObj, code, dataId) {
        const traits = traitObj.traits;
        return traits.reduce((r, trait) => {
            if ((trait.code === code) && (trait.dataId == dataId)) {
                return r + trait.value;
            } else {
                return r;
            }
        }, 0);
    };
    /**
     * traitObjから、codeとparamIdを持つものの乗算値合計を得る。
     * 
     * @param {TraitObject} traitObj traitsをメンバに持つオブジェクト
     * @param {Number} code Game_BattlerBase.TRAIT_～を指定する。
     * @param {Number} dataId パラメータID
     * @returns valueの乗算合計値が返る。
     */
    DataManager.traitsPi = function(traitObj, code, dataId) {
        const traits = traitObj.traits;
        return traits.reduce((r, trait) => {
            if ((trait.code === code) && (trait.dataId == dataId)) {
                return r * trait.value;
            } else {
                return r;
            }
        }, 1);
    };

    //------------------------------------------------------------------------------
    // Game_Party

    /**
     * abilityIdで指定される特性値のパーティーメンバー合計を得る。
     * 
     * @param {Number} abilityId アビリティID(Game_Party.PARTY_ABILITY)
     */
    Game_Party.prototype.partyTraitsSum = function(abilityId) {
        return this.battleMembers().reduce(function(prev, actor) {
            if (!actor.isDead()) {
                return prev + actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, abilityId);
            } else {
                return prev;
            }
        }, 0);
    };

    /**
     * abilityIdで指定される特性値のパーティーでの最大値を得る。
     * 増加効果の最大値を得たい場合に使用する。
     * 
     * @param {Number} abilityId アビリティID(Game_Party.PARTY_ABILITY)
     * @returns {Number} 最大値
     */
    Game_Party.prototype.partyTraitsSumMax = function(abilityId) {
        return this.members().reduce(
            (r, actor) => Math.max(r, actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, abilityId)), 0);
    };
    /**
     * abilityIdで指定される特性値のパーティーでの最小値を得る。
     * 減算効果の最大を得たい場合に使用する。
     * 
     * @param {Number} abilityId アビリティID(Game_Party.PARTY_ABILITY)
     * @returns {Number} 最大値
     */
    Game_Party.prototype.partyTraitsSumMin = function(abilityId) {
        return this.members().reduce(
            (r, actor) => Math.min(r, actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, abilityId)), 0);
    };
})();