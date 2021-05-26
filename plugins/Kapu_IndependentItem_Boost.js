/*:ja
 * @target MZ 
 * @plugindesc 個別アイテムに強化機能を追加するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem
 * @orderAfter Kapu_IndependentItem
 * 
 * 
 * @param defaultMaxBoostCount
 * @text 最大ブーストカウント
 * @desc 最大ブーストカウントのデフォルト値。武器/防具個別のmaxBoostCountノートタグを指定しない場合に適用される。
 * @type number
 * @default 0
 * @min 0
 * 
 * @param minBoostPrice
 * @text 強化費用の最低値
 * @desc 強化費用の最小値
 * @type number
 * @default 10
 * @min 0
 * 
 * @param defaultBoostPriceRate
 * @text 強化費用デフォルト値
 * @desc 強化費用未指定時、費用算出に使用する値。対象品の価格に対する割合で指定する。
 * @type number
 * @decimals 2
 * @default 0.50
 * @min 0
 * 
 * @param defaultGainBoostPriceRate
 * @text 強化費用増加率
 * @desc 強化をする毎に変化する費用の割合
 * @type number
 * @default 0.1
 * @min 0
 * 
 * 
 * @param minSuccessRate
 * @text 最小強化成功率
 * @desc 最小強化成功率。(0.0～1.0)
 * @type number
 * @default 0.05
 * @decimals 2
 * @min 0.00
 * @max 1.00
 * 
 * 
 * @help 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 1. カスタム強化機能の実現方法について
 * 1.1. 特定の特性を効果により付与できるようにするには
 *     DataManager.applyBoostEffect(item:object, key:string, value:string):void を
 *     フックして処理を追加する。
 * 
 * 1.2. trait以外を使用した強化をしていた場合
 *   DataManager.resetIndependentWeaponBoost
 *     フックして武器の強化をリセットする処理を追加する。
 *   DataManager.resetIndependentArmorBoost
 *     フックして防具の強化をリセットする処理を追加する。
 * 2. 強化処理の実現方法について
 * ・Weapon/Armorに以下のフィールドを追加。
 *   (a) boostCount 強化回数
 *   (b) maxBoostCount 最大強化回数
 * ・強化の実現方法
 *   params及びtraitsフィールドのメンバを変更することで実現する。
 *   他のパラメータを変更するように機能追加する場合には、以下のようにフックする。
 *   DataManager.initializeIndependentWeapon
 *   DataManager.initializeIndependentArmor
 *      個別アイテム生成直後のパラメータ初期値をバックアップする。
 *   DataManager.resetIndependentWeaponBoost
 *   DataManager.resetIndependentArmorBoost
 *      保存したパラメータ初期値を適用する。
 * 
 *   
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 武器・防具
 *   強化対象武器・防具として適用されるには、個別アイテム強化回数が設定されていること。
 *   <boostPrice:price#>
 *     1回の強化実行に必要になる価格。未指定の場合には装備品の価格が適用される。
 *   <boostPriceRate:rate#>
 *     強化1回毎に上昇する費用の割合。(0.1で1割増加)
 *   <boostSuccessRate:rate#>
 *     初回成功率(0.0～1.0を指定する)。未指定時は1.0になる。
 *   <boostSuccessRate:rate%>
 *     初回成功率(0.0～100.0を指定する)。未指定時は100.0になる。
 *   <boostDifficulty:level#>
 *     強化難易度。高いほど成功率が低下する。
 *     未指定時は0になる。
 *   <maxBoostCount:count#>
 *     強化ブースト回数
 *   <maxBoostCount:min#-max#>
 *     強化ブーストを上限と下限の範囲でランダム設定。
 * 
 * アイテム
 *   強化素材アイテムとして、boostEffectが必須。
 *   <boostSuccessRate:rate#>
 *     初回成功率(0.0～1.0を指定する)。未指定時は1.0になる。
 *   <boostSuccessRate:rate%>
 *     初回成功率(0.0～100.0を指定する)。未指定時は100.0になる。
 *   <boostEffect:args%>
 *     args書式
 *     key$ または key$=value$ をカンマ(,)で区切る。
 *     本プラグインで実装済みのkeyは次の通り。
 *         MHP 最大HP
 *         MMP 最大MP
 *         ATK 攻撃力
 *         DEF 防御力
 *         MAT 魔法攻撃力
 *         MDF 魔法防御力
 *         AGI 素早さ
 *         LUK 運
 *         HIT 命中率(1.0が+100%であることに注意。)
 *         EVA 回避率(1.0が+100%であることに注意。)
 *         CRI クリティカル率(1.0が+100%であることに注意。)
 *         CEV クリティカル回避率(1.0が+100%であることに注意。)
 *         MEV 魔法回避率(1.0が+100%であることに注意。)
 *         MRF 魔法反射率(1.0が+100%であることに注意。)
 *         CNT 反撃率(1.0が+100%であることに注意。)
 *         HRG HP回復率(1.0が+100%であることに注意。)
 *         MRG MP回復率(1.0が+100%であることに注意。)
 *         TRG TP回復率(1.0が+100%であることに注意。)
 *         TGR 被ターゲット率(1.0が+100%であることに注意。)
 *         GRD ガード時軽減率(1.0が+100%であることに注意。)
 *         REC リカバリ率(1.0が+100%であることに注意。)
 *         PHA アイテム使用効果補正率(1.0が+100%であることに注意。)
 *         MCR MPコストレート(1.0が+100%であることに注意。)
 *         TCR TPチャージレート(1.0が+100%であることに注意。)
 *         PDR 物理被ダメージレート(1.0が+100%であることに注意。)
 *         MDR 魔法被ダメージレート(1.0が+100%であることに注意。)
 *         FDR 床被ダメージレート(1.0が+100%であることに注意。)
 *         EXR 経験値レート(1.0が+100%であることに注意。)
 *         
 *     valueで指定できる書式は次の通り。
 *         value#     value#固定値だけパラメータを増加させる。
 *         min#:max#  min#～max#の範囲のランダム値だけパラメータを増加させる。
 * 
 *     その他のkey及びvalueの書式はboostの追加プラグインに依存。
 *     例)
 *         <boostEffect:ATK=+12,DEF=+4>
 *   <boostCondition:evaluation%>
 *     適用可否を判定する処理。未指定時は常に適用可能。
 *     以下のものが参照可能
 *       equipment : 装備品
 *       item : 素材アイテム
 *       isWeapon : 武器の場合にtrue, それ以外はfalse 
 *       isArmor : 防具の場合にtrue, それ以外はfalse.
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作確認。
 */

(() => {
    const pluginName = "Kapu_IndependentItem_Boost";
    const parameters = PluginManager.parameters(pluginName);

    const defaultMaxBoostCount = Number(parameters["defaultMaxBoostCount"]) || 0;
    const defaultBoostPriceRate = Number(parameters["defaultBoostPriceRate"]) || 0;
    const minBoostPrice = Number(parameters["minBoostPrice"]) || 0;

    /**
     * レート文字列から率を取得する。
     * 
     * @param {string} str 成功率文字列
     * @param {number} min 最小値
     * @param {number} max 最大値
     * @returns {number} 率(min～max)
     */
    const _parseRate = function(str, min, max) {
        let rate = 0.0;
        if (str.slice(-1) === "%") {
            rate = Number(str.slice(0, str.length - 1)) / 100.0;
        } else {
            rate = Number(str);
        }
        if (rate < min) {
            return min;
        } else if (rate > max) {
            return max;
        } else {
            return rate;
        }
    }
    const minSuccessRate = _parseRate(parameters["minSuccessRate"], 0, 1);

    /**
     * 増加レートを取得する。
     * 
     * @param {string} str 文字
     */
    const _parseBoostPriceRate = function(str) {
        const number = Number(str);
        if (number > 0) {
            return 1 + number;
        } else {
            return 1;
        }
    };

    const defaultGainBoostPriceRate = _parseBoostPriceRate(parameters["defaultGainBoostPriceRate"]);

    /**
     * 最大ブーストカウントをパースする
     * 
     * @param {string} str 最大ブースト可能数
     * @returns {number} 最大ブーストカウント[最小：最大]
     */
    const _getMaxBoostCount = function(str) {
        const index = str.indexOf("-");
        if (index > 0) {
            const min = Number(str.substr(0, index).trim());
            const max = Number(str.substr(index + 1).trim());
            const variance = max - min;
            const count = Math.randomInt(variance + 1) + min;
            if (count > 0) {
                return count;
            } else {
                return 0;
            }
        } else {
            const count = Number(str);
            if (count > 0) {
                return count;
            } else {
                return 0;
            }
        }
    };


    /**
     * 武器・防具のノートタグを処理する。
     * 
     * @param {Array<Object>} dataCollection DataWeapon/DataArmorのコレクション
     */
    const _processEquipsNotetags = function(dataCollection) {

        for (let i = 1; i < dataCollection.length; i++) {
            const equipment = dataCollection[i];
            equipment.boostCount = 0;
            equipment.maxBoostCount = 0;
            equipment.boostPrice = equipment.price * defaultBoostPriceRate;
            equipment.boostSuccessRate = 1.0;
            equipment.boostDifficulty = 0;
            if (equipment.meta.boostPrice) {
                equipment.boostPrice = _parseBoostPrice(equipment.meta.boostPrice);
            }
            if (equipment.meta.boostSuccessRate) {
                equipment.boostSuccessRate = _parseRate(equipment.meta.boostSuccessRate, minSuccessRate, 1.0);
            }
            if (equipment.meta.boostDifficulty) {
                equipment.boostDifficulty = Number(equipment.meta.boostDifficulty) || 0;
            }
        }
    };

    /**
     * 強化効果をパースする。
     * 書式
     *     (強化項目1),(強化項目2),...,(強化項目N)
     * 
     * @param {string} str 文字列
     * @returns {Array<object>} 強化効果配列
     */
    const _parseBoostEffect = function(str) {
        const effects = [];
        const tokens = str.split(",");
        for (let i = 0; i < tokens.length; i++) {
            const index = tokens[i].indexOf("=")
            if (index >= 0) {
                const key = tokens[i].substr(0, index).trim();
                const value = tokens[i].substr(index + 1).trim();
                effects.push({ key:key, value:value });
            } else {
                const key = tokens[i].trim();
                const value = "";
                effects.push({ key:key, value:value });
            }
        }

        return effects;
    };

    /**
     * アイテムのノートタグを処理する。
     * 
     * @param {Array<Object>} dataCollection DataItemのコレクション
     */
    const _processItemNotetags = function(dataCollection) {
        const patternBoostEffect = /<boostEffect[ :]?(.+)>/;

        for (let i = 1; i < dataCollection.length; i++) {
            const item = dataCollection[i];
            item.boostEffects = [];
            item.boostSuccessRate = 1.0;

            if (item.meta.boostSuccessRate) {
                item.boostSuccessRate = _parseRate(item.meta.boostSuccessRate, minSuccessRate, 1.0);
            }
            const noteLines = item.note.split(/[\r\n]+/);
            noteLines.forEach(function(line) {
                let re;
                if ((re = line.match(patternBoostEffect)) !== null) {
                    const effects = _parseBoostEffect(re[1]);
                    item.boostEffects = item.boostEffects.concat(effects);
                }
            });
        }
    };


    //-------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    /**
     * Scene_Bootを開始する。
     */
    Scene_Boot.prototype.start = function () {
        _processEquipsNotetags($dataWeapons);
        _processEquipsNotetags($dataArmors);
        _processItemNotetags($dataItems)

        _Scene_Boot_start.call(this);
    };
    //------------------------------------------------------------------------------
    // DataManager

    const _DataManager_initializeIndependentWeapon = DataManager.initializeIndependentWeapon;
    /**
     * 新しい個別武器を初期化する。
     * 
     * @param {DataWeapon} newWeapon 新しい個別武器
     * @param {DataWeapon} baseWeapon ベース武器データ
     */
    // eslint-disable-next-line no-unused-vars
    DataManager.initializeIndependentWeapon = function(newWeapon, baseWeapon) {
        _DataManager_initializeIndependentWeapon.call(this, newWeapon, baseWeapon);
        newWeapon.name_org = newWeapon.name;
        newWeapon.traits_org = JsonEx.makeDeepCopy(newWeapon.traits);
        newWeapon.params_org = JsonEx.makeDeepCopy(newWeapon.params);

        newWeapon.boostCount = 0;
        if (baseWeapon.meta.maxBoostCount) {
            newWeapon.maxBoostCount = _getMaxBoostCount(baseWeapon.meta.maxBoostCount);
        } else {
            newWeapon.maxBoostCount = defaultMaxBoostCount;
        }
        DataManager.resetIndependentWeaponBoost(newWeapon);
    };

    /**
     * 強化状態をリセットする。
     * 
     * @param {object} item アイテム
     */
    DataManager.resetBoost = function(item) {
        if (DataManager.isWeapon(item)) {
            DataManager.resetIndependentWeaponBoost(item);
        } else if (DataManager.isArmor(item)) {
            DataManager.resetIndependentArmorBoost(item);
        }
    };

    /**
     * 個別武器の強化状態を初期化する。
     * 
     * @param {DataWeapon} weapon 武器
     */
    DataManager.resetIndependentWeaponBoost = function(weapon) {
        weapon.boostCount = 0; // 強化段階リセット
        weapon.traits = JsonEx.makeDeepCopy(weapon.traits_org);
        weapon.params = JsonEx.makeDeepCopy(weapon.params_org);
        weapon.name = weapon.name_org;
    };

    const _DataManager_initializeIndependentArmor = DataManager.initializeIndependentArmor;
    /**
     * 新しい個別防具を初期化する。
     * 
     * @param {DataArmor} newArmor 新しい個別防具
     * @param {DataArmor} baseArmor ベース防具データ
     */
    // eslint-disable-next-line no-unused-vars
    DataManager.initializeIndependentArmor = function(newArmor, baseArmor) {
        _DataManager_initializeIndependentArmor.call(this, newArmor, baseArmor);
        newArmor.name_org = newArmor.name;
        newArmor.traits_org = JsonEx.makeDeepCopy(newArmor.traits);
        newArmor.params_org = JsonEx.makeDeepCopy(newArmor.params);

        newArmor.boostCount = 0;
        if (baseArmor.meta.maxBoostCount) {
            newArmor.maxBoostCount = _getMaxBoostCount(baseArmor.meta.maxBoostCount);
        } else {
            newArmor.maxBoostCount = defaultMaxBoostCount;
        }
        DataManager.resetIndependentArmorBoost(newArmor);
    };

    /**
     * 個別防具の強化状態を初期化する。
     * 
     * @param {DataArmor} armor 防具
     */
    DataManager.resetIndependentArmorBoost = function(armor) {
        armor.boostCount = 0; // 強化段階リセット
        armor.traits = JsonEx.makeDeepCopy(armor.traits_org);
        armor.params = JsonEx.makeDeepCopy(armor.params_org);
        armor.name = armor.name_org;
    };

    /**
     * 強化成功率を得る。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     * @param {number} userLevel 強化実行レベル
     * @param {object} catalystItem 素材アイテム。DataItem
     * @param {number} catalystItemCount 使用する素材アイテム数
     * @returns {number} 強化成功率(minSuccessRate ～ 1.0)
     */
    DataManager.getBoostSuccessRate = function(item, userLevel, catalystItem, catalystItemCount) {
        const boostCount = item.boostCount || 0;
        const skillRate = Math.max(0.01, 1.0 - ((item.boostDifficulty + boostCount - userLevel) * 0.05));
        let rate = item.boostSuccessRate * (1.0 - boostCount * 0.1) * skillRate;
        if (catalystItem) {
            catalystItemCount = catalystItemCount || 1;
            rate *= catalystItem.boostSuccessRate * (0.5 + 0.5 * catalystItemCount);
        }
        return rate.clamp(minSuccessRate, 1.0);
    };

    /**
     * 強化を行う。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     * @param {object} catalystItem 素材アイテム。DataItem
     */
    DataManager.boostIndependentItem = function(item, catalystItem) {
        if (!DataManager.isIndependentItem(item)) {
            // 個別アイテムではない
            return ;
        }

        for (const boostEffect of catalystItem.boostEffects) {
            DataManager.applyBoostEffect(item, boostEffect.key, boostEffect.value);

        }
        item.boostCount++;
        DataManager.updateBoostItemName(item);
    };

    /**
     * 強化項目を適用する。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     * @param {string} key 強化項目名
     * @param {string} value 強化値
     */
    // eslint-disable-next-line no-unused-vars
    DataManager.applyBoostEffect = function(item, key, value) {
        switch (key) {
            case "MHP":
                item.params[0] += DataManager.getBoostValueInt(value);
                break;
            case "MMP":
                item.params[1] += DataManager.getBoostValueInt(value);
                break;
            case "ATK":
                item.params[2] += DataManager.getBoostValueInt(value);
                break;
            case "DEF":
                item.params[3] += DataManager.getBoostValueInt(value);
                break;
            case "MAT":
                item.params[4] += DataManager.getBoostValueInt(value);
                break;
            case "MDF":
                item.params[5] += DataManager.getBoostValueInt(value);
                break;
            case "AGI":
                item.params[6] += DataManager.getBoostValueInt(value);
                break;
            case "LUK":
                item.params[7] += DataManager.getBoostValueInt(value);
                break;
            case "HIT":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_XPARAM, 0,
                    DataManager.getBoostValueReal(value));
                break;
            case "EVA":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_XPARAM, 1,
                    DataManager.getBoostValueReal(value));
                break;
            case "CRI":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_XPARAM, 2,
                    DataManager.getBoostValueReal(value));
                break;
            case "CEV":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_XPARAM, 3,
                    DataManager.getBoostValueReal(value));
                break;
            case "MEV":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_XPARAM, 4,
                    DataManager.getBoostValueReal(value));
                break;
            case "MRF":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_XPARAM, 5,
                    DataManager.getBoostValueReal(value));
                break;
            case "CNT":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_XPARAM, 6,
                    DataManager.getBoostValueReal(value));
                break;
            case "HRG":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_XPARAM, 7,
                    DataManager.getBoostValueReal(value));
                break;
            case "MRG":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_XPARAM, 8,
                    DataManager.getBoostValueReal(value));
                break;
            case "TRG":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_XPARAM, 9,
                    DataManager.getBoostValueReal(value));
                break;
            case "TGR":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_SPARAM, 0,
                    DataManager.getBoostValueReal(value));
                break;
            case "GRD":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_SPARAM, 1,
                    DataManager.getBoostValueReal(value));
                break;
            case "REC":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_SPARAM, 2,
                    DataManager.getBoostValueReal(value));
                break;
            case "PHA":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_SPARAM, 3,
                    DataManager.getBoostValueReal(value));
                break;
            case "MCR":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_SPARAM, 4,
                    DataManager.getBoostValueReal(value));
                break;
            case "TCR":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_SPARAM, 5,
                    DataManager.getBoostValueReal(value));
                break;
            case "PDR":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_SPARAM, 6,
                    DataManager.getBoostValueReal(value));
                break;
            case "MDR":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_SPARAM, 7,
                    DataManager.getBoostValueReal(value));
                break;
            case "FDR":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_SPARAM, 8,
                    DataManager.getBoostValueReal(value));
                break;
            case "EXR":
                DataManager.addBoostTrait(item, Game_BattlerBase.TRAIT_SPARAM, 9,
                    DataManager.getBoostValueReal(value));
                break;
        }

    };

    /**
     * 整数の強化値を得る。
     * Note : valueStrでフォローしている書式は次の通り。
     *     value#
     *     min#:max#
     * 
     * @param {string} valueStr 
     * @returns {number} ブースト値
     */
    DataManager.getBoostValueInt = function(valueStr) {
        return Math.round(DataManager.getBoostValueReal(valueStr));
    };

    
    /**
     * 実数の強化値を得る。
     * Note : valueStrでフォローしている書式は次の通り。
     *     value#
     *     min#:max#
     * 
     * 小数点以下2桁で丸めるように処理する。
     * 
     * @param {string} valueStr 
     * @returns {number} ブースト値
     */
     DataManager.getBoostValueReal = function(valueStr) {
        const tokens = valueStr.split(":");
        let realValue;
        if (tokens.length >= 2) {
            const min = Number(tokens[0]);
            const max = Number(tokens[1]);
            if (isNaN(min)) {
                if (isNaN(max)) {
                    realValue = 0;
                } else {
                    realValue = max; // maxだけ有効値
                }
            } else {
                if (isNaN(max)) {
                    realValue = Math.floor(min); // minだけ有効値
                } else {
                    realValue = min + (max - min) * Math.random();
                }
            }
        } else {
            const value = Number(tokens[0]);
            if (isNaN(value)) {
                realValue = 0;
            } else {
                realValue = value;
            }
        }
        return Math.round(realValue * 100) / 100;
    };

    /**
     * 強化アイテムの名前を更新する。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     */
    DataManager.updateBoostItemName = function(item) {
        const prefix = item.namePrefix || "";
        let postfix = item.namePostfix || "";
        if (!postfix && (item.boostCount > 0)) {
            postfix = "+" + item.boostCount;
        }
        item.name = prefix + item.name_org + postfix;
    };

    /**
     * アイテムに特性を追加する。
     * 既に同じ内容の特性を持っている場合には加算する。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     * @param {number} code 特性コード
     * @param {number} dataId データID
     * @param {number} value 値
     */
    DataManager.addBoostTrait = function(item, code, dataId, value) {
        const trait = item.traits.find(function(t) {
            return (t.code == code) && (t.dataId == dataId);
        });
        if (trait) {
            trait.value += value;
        } else {
            // 無い場合には新規追加。
            item.traits.push({ code:code, dataId:dataId, value:value });
        }
    };

    /**
     * 強化費用を得る。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     * @returns {number} 打ち直し費用
     */
    DataManager.getBoostPrice = function(item) {
        const nextBoostCount = (item.boostCount || 0) + 1;
        const priceRate = (item.meta.boostPriceRate)
                ? _parseBoostPriceRate(item.meta.boostPriceRate)
                : defaultGainBoostPriceRate;
        const price = Math.floor(item.boostPrice * Math.pow(priceRate, nextBoostCount));
        return price.clamp(minBoostPrice, $gameParty.maxGold());
    };



    /**
     * 強化リセット費用を得る。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     * @returns {number} 打ち直し費用
     */
    DataManager.getResetBoostPrice = function(item) {
        return Math.floor(item.boostPrice / 2).clamp(minBoostPrice, $gameParty.maxGold());
    };

    /**
     * 打ち直し費用を得る。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     * @returns {number} 打ち直し費用
     */
    DataManager.getResetPrice = function(item) {
        const price = Math.floor(item.boostPrice * (1.0 + item.boostCount * 0.1));
        return price.clamp(minBoostPrice, $gameParty.maxGold());
    };

    /**
     * 強化可能なアイテムかどうかを取得する。
     * 
     * @param {object} item 対象のアイテム(DataWeapon/DataArmor)
     * @returns {boolean} 強化可能なアイテムの場合にはtrue, それ以外はfalse.
     */
    DataManager.isBoostableItem = function(item) {
        if (item.maxBoostCount) {
            return DataManager.isIndependentItem(item) 
                    && (item.boostCount < item.maxBoostCount);
        } else {
            return false;
        }
    };

    /**
     * 素材を適用可能かどうかを取得する。
     * 
     * @param {object} item 素材アイテム
     * @param {object} equipment 装備品(DataWeapon/DataArmor)
     * @returns {boolean} 適用可能な場合にはtrue, 適用できない場合にはfalse.
     */
    DataManager.isBoostCatalystApplicable = function(item, equipment) {
        if (item.meta.boostCondition) {
            // eslint-disable-next-line no-unused-vars
            const isWeapon = DataManager.isWeapon(equipment);
            // eslint-disable-next-line no-unused-vars
            const isArmor = DataManager.isArmor(equipment);
            return eval(item.meta.boostCondition) || false;
        } else {
            return true; // 条件ないなら全て可
        }
    }
})();
