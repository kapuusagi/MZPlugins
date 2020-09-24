/*:ja
 * @target MZ 
 * @plugindesc プラグインで使用する、いくつかの拡張を提供するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @help 
 * 追加メソッド
 * ノートタグパーサー追加API。いちいちforでデータコレクションを回さなくて良いように追加。
 * DataManager.addNotetagParserActors(method:function)
 * DataManager.addNotetagParserClasses(method:function)
 * DataManager.addNotetagParserItems(method:function)
 * DataManager.addNotetagParserWeapons(method:function)
 * DataManager.addNotetagParserArmors
 * DataManager.addNotetagParserEnemies
 * DataManager.addNotetagParserSkills
 * DataManager.addNotetagParserStates
 * DataManager.addNotetagParserTilesets
 * 
 * 
 * DataManager.traitsSum(traitObj:TraitObject, code:number, dataId:number)
 *     code, dataIdに一致するTraitの特性値の加算合計を得る。
 * 
 * DataManager.traitPi(traitObj:TraitObject, code:number, dataId:number)
 *     code, dataIdに一致するTraitの特性値の乗算合計を得る。
 * 
 * Game_Party.partyTraitsSum(ability:number)
 *     指定したパーティーアビリティIDの特性値合計を得る。
 * 
 * Game_Party.partyTraitsSumMax(abilityId:number)
 *     指定したパーティーアビリティIDについて、
 *     アクターそれぞれに合計をとって最大値を得る。
 *     パーティーメンバーのうち、最も高い値を
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
            for (let method of methods) {
                method.call(this, obj);
            }
        }
    };




    /**
     * traitObjから、codeとparamIdを持つものの合計を得る。
     * 
     * @param {TraitObject} traitObj traitsをメンバに持つオブジェクト
     * @param {Number} code Game_BattlerBase.TRAIT_～を指定する。
     * @param {Number} dataId パラメータID
     * @return valueの合計値が返る。
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
     * @return valueの乗算合計値が返る。
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
    // Game_BattlerBase

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
     * 
     * @param {Number} abilityId アビリティID(Game_Party.PARTY_ABILITY)
     * @return {Number} 最大値
     */
    Game_Party.prototype.partyTraitsSumMax = function(abilityId) {
        return this.battleMembers().max(function(actor) {
            return actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, abilityId);
        });
    };
})();