/*:ja
 * @target MZ 
 * @plugindesc 個別アイテムに強化機能を追加するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem_Blacksmith
 * @orderAfter Kapu_IndependentItem_Blacksmith
 * 
 * @command openShop
 * @text 強化屋を開く
 * @desc 強化店を開きます。
 * 
 * @arg maxBoost
 * @text 最大強化レベル
 * @desc この強化屋で強化可能な最大レベル。強化段階より高いと成功率が
 * @type number
 * @default 1
 * 
 * @arg smithLevel
 * @text 鍛冶屋レベル
 * @desc 強化成功率に関係する。
 * @type number
 * @default 0
 * 
 * @arg clerkFileName
 * @text 店員画像
 * @desc 店員として表示する画像ファイル名。既定ではコマンドウィンドウ下の方に表示される。
 * @dir pictures
 * @type file
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
 * @param textBoost
 * @text ショップ強化コマンド
 * @desc ショップに表示する強化メニューとして表示する文字列。
 * @type string 
 * @default 強化
 * 
 * @param textResetBoost
 * @text ショップリセット強化コマンド
 * @desc ショップに表示する強化リセットメニューとして表示する文字列。
 * @type string
 * @default 強化リセット
 * 
 * @param textReinitialize
 * @text ショップ再初期化コマンド
 * @desc ショップに表示する再初期化メニューとして表示する文字列。
 * @type string
 * @default 打ち直し
 * 
 * @param textInsufficientSkillLevel
 * @text 技能不足テキスト
 * @desc スキルレベルが足りない場合に表示する文字列。
 * @type string
 * @default 技量不足
 * 
 * @param textBoostItem
 * @text 強化アイテムテキスト
 * @desc 強化アイテム項目名として表示する文字列。
 * @type string
 * @default 強化アイテム
 * 
 * @param textCatalystItem
 * @text 強化素材テキスト
 * @desc 強化素材項目冥として表示する文字列。
 * @type string
 * @default 強化素材
 * 
 * @param textSuccessRate
 * @text 成功率ラベル
 * @desc 成功率ラベルとして表示する文字列。
 * @type string
 * @default 成功率
 * 
 * @param textConfirmResetBoost
 * @text 強化リセット確認テキスト
 * @desc 強化リセット実行前確認に表示する文字列。(%1にアイテム名前)
 * @type string
 * @default %1の強化リセットを行う
 * 
 * @param textConfirmReinitialize
 * @text 打ち直し確認テキスト
 * @desc 打ち直し実行前に表示する文字列。(%1にアイテム名)
 * @type string
 * @default %1の打ち直しを行う
 * 
 * @param resetBoostAnimationId
 * @text 強化リセットアニメーション
 * @type animation
 * @default 0
 * 
 * @param reinitializeAnimationId
 * @text 打ち直しアニメーション
 * @type animation
 * @default 0
 * 
 * @param boostSuccessAnimationId
 * @text 強化成功時アニメーション
 * @type animation
 * @default 0
 * 
 * @param boostFailureAnimationId
 * @text 強化失敗時アニメーション
 * @type animation
 * @default 0
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
 *   traitsフィールドのメンバを変更することで実現する。
 *   
 * 
 * 
 *   
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
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
 *     key$=value$をカンマ(,)で区切る。
 *     key及びvalueの書式はboostの追加プラグインに依存。
 *   <boostCondition:evaluation%>
 *     適用可否を判定する処理。未指定時は常に適用可能。
 *     以下のものが参照可能
 *       equipment : 装備品
 *       item : 素材アイテム
 *       isWeapon : 武器の場合にtrue, それ以外はfalse 
 *       iSArmor : 防具の場合にtrue, それ以外はfalse.
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */

 /**
  * 鍛冶屋コマンド
  */
function Window_BlacksmithShopCommand() {
    this.initialize(...arguments);
}

/**
 * 鍛冶屋シーン
 */
function Scene_BlacksmithShop() {
    this.initialize(...arguments);
}

Scene_BlacksmithShop.SHOP_MODE_BOOST = 0;
Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST = 1;
Scene_BlacksmithShop.SHOP_MODE_REINITIALIZE = 2;

/**
 * Window_BlacksmithItemList
 * 
 * 強化対象アイテムリストウィンドウ
 */
function Window_BlacksmithItemList() {
    this.initialize(...arguments);
}
/**
 * Window_BlacksmithCatalystList
 * 
 * 強化素材リスト表示ウィンドウ
 */
function Window_BlacksmithCatalystList() {
    this.initialize(...arguments);
}

/**
 * Window_BlacksmithNumberInput
 * 
 * 使用する触媒個数を入力するためのウィンドウ。
 * Window_NumberInputベースで作成する。
 * 成功率などは別ウィンドウで表示する。
 */
function Window_BlacksmithNumberInput() {
    this.initialize.apply(this, arguments);
}

/**
 * Window_BlacksmithConfirm
 * 
 * リセット時に実行確認をするためのウィンドウ
 */
function Window_BlacksmithConfirm() {
    this.initialize(...arguments);
}


/**
 * Window_BlacksmithCatalystItem
 * 
 * 選択されているアイテムと触媒を表示するウィンドウ。
 * 個数と強化成功率を表示する。
 */
function Window_BlacksmithCatalystItem() {
    this.initialize.apply(this, arguments);
}

(() => {
    const pluginName = "Kapu_IndependentItem_Boost";
    const parameters = PluginManager.parameters(pluginName);

    const defaultMaxBoostCount = Number(parameters["defaultMaxBoostCount"]) || 0;
    const defaultBoostPriceRate = Number(parameters["defaultBoostPriceRate"]) || 0;
    const minBoostPrice = Number(parameters["minBoostPrice"]) || 0;

    const textBoost = parameters["textBoost"] || "Boost";
    const textResetBoost = parameters["textResetBoost"] || "Reset boost";
    const textReinitialize = parameters["textReinitialize"] || "reinitialize";
    const textInsufficientSkillLevel = parameters["textInsufficientSkillLevel"] | "Unboostable";
    const textBoostItem = parameters["textBoostItem"] || "BoostItem";
    const textCatalystItem = parameters["textCatalystItem"] || "CatalystItem";
    const textSuccessRate = parameters["textSuccessRate"] || "SuccessRate";
    const textConfirmResetBoost = parameters["textConfirmResetBoost"] || ""; 
    const textConfirmReinitialize = parameters["textConfirmReinitialize"] || "";
    
    const resetBoostAnimationId = Number(parameters["resetBoostAnimationId"]) || 0;
    const reinitializeAnimationId = Number(parameters["reinitializeAnimationId"]) || 0;
    const boostSuccessAnimationId = Number(parameters["boostSuccessAnimationId"]) || 0;
    const boostFailureAnimationId = Number(parameters["boostFailureAnimationId"]) || 0;



    /**
     * レート文字列から率を取得する。
     * 
     * @param {string} str 成功率文字列
     * @param {number} min 最小値
     * @param {number} max 最大値
     * @return {number} 率(min～max)
     */
    const _parseRate = function(str, min, max) {
        let rate = 0.0;
        if (str.slice(-1) === "%") {
            rate = Number(str.slice(0, valueStr.length - 1)) / 100.0;
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

    PluginManager.registerCommand(pluginName, "openShop", args => {
        // TODO : コマンドの処理。
        // パラメータメンバは @argで指定した名前でアクセスできる。
        const maxBoost = Number(args.maxBoost) || 0;
        const smithLevel = Number(args.smithLevel) || 0;
        let clerkFileName = String(args.clerkFileName) || "";
        if (clerkFileName.includes("/")) {
            if (clerkFileName.startsWith("pictures/")) {
                clerkFileName = clerkFileName.substr(9);
            } else {
                clerkFileName = "";
            }
        }
        const clerkOffsetX = Number(args.clerkOffsetX) || 0;
        const clerkOffsetY = Number(args.clerkOffsetY) || 0;


        SceneManager.push(Scene_BlacksmithShop);
        SceneManager.prepareNextScene(maxBoost, smithLevel, clerkFileName, clerkOffsetX, clerkOffsetY);
    });


    /**
     * 最大ブーストカウントをパースする
     * 
     * @param {string} str 最大ブースト可能数
     * @return {number} 最大ブーストカウント[最小：最大]
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
     * @return {Array<object>} 強化効果配列
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
        const patternBoostEffect = /<boostEffect[ :]?(.+)/;

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
        const baseItem = DataManager.getBaseItem(weapon);
        weapon.boostCount = 0; // 強化段階リセット
        weapon.traits = JsonEx.makeDeepCopy(baseItem.traits);
        weapon.name = baseItem.name;
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
        const baseItem = DataManager.getBaseItem(armor);
        armor.boostCount = 0; // 強化段階リセット
        armor.traits = JsonEx.makeDeepCopy(baseItem.traits);
        armor.name = baseItem.name;
    };

    /**
     * 強化成功率を得る。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     * @param {number} userLevel 強化実行レベル
     * @param {object} catalystItem 素材アイテム。DataItem
     * @param {number} catalystItemCount 使用する素材アイテム数
     * @return {number} 強化成功率(minSuccessRate ～ 1.0)
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

    };

    /**
     * 強化アイテムの名前を更新する。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     */
    DataManager.updateBoostItemName = function(item) {
        const baseItem = DataManager.getBaseItem(item);
        const prefix = item.namePrefix || "";
        let postfix = item.namePostfix || "";
        if (!postfix) {
            postfix = "+" + item.boostCount;
        }
        item.name = prefix + baseItem.name + postfix;
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
    DataManager.addBoostTraist = function(item, code, dataId, value) {
        const trait = item.traits.find(function(t) {
            return (t.code == code) && (t.dataId == dataId);
        });
        if (trait !== null) {
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
     * @return {number} 打ち直し費用
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
     * @return {number} 打ち直し費用
     */
    DataManager.getResetBoostPrice = function(item) {
        return Math.floor(item.boostPrice / 2).clamp(minBoostPrice, $gameParty.maxGold());
    };

    /**
     * 打ち直し費用を得る。
     * 
     * @param {object} item 強化対象アイテム。DataWeapon/DataArmorのいずれか。
     * @return {number} 打ち直し費用
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

    //------------------------------------------------------------------------------
    // Window_BlacksmithShopCommand
    Window_BlacksmithShopCommand.prototype = Object.create(Window_Command.prototype);
    Window_BlacksmithShopCommand.prototype.constructor = Window_BlacksmithShopCommand;

    /**
     * ウィンドウ矩形領域
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BlacksmithShopCommand.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    /**
    * コマンドリストを作成する。
    */
    Window_BlacksmithShopCommand.prototype.makeCommandList = function() {
        this.addCommand(textBoost, "boost");
        this.addCommand(textResetBoost, "reset-boost");
        this.addCommand(textReinitialize, "reinitialize");
        this.addCommand(TextManager.cancel, "cancel");
    };
    //------------------------------------------------------------------------------
    // Window_BlacksmithItemList
    Window_BlacksmithItemList.prototype = Object.create(Window_Selectable.prototype);
    Window_BlacksmithItemList.prototype.constructor = Window_BlacksmithItemList;

    /**
     * 強化対象のアイテムリストを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     * @param {Array<object>} items アイテムリスト
     */
    Window_BlacksmithItemList.prototype.initialize = function(rect, items) {
        this._items = items;
        this._smithLevel = 0;
        this._money = 0;
        this._maxBoostCount = 0;
        this._mode = Scene_BlacksmithShop.SHOP_MODE_BOOST;
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
        this.select(0);
    };

    /**
     * 鍛冶屋レベルを設定する。
     * 
     * @param {number} level レベル
     */
    Window_BlacksmithItemList.prototype.setSmithLevel = function(level) {
        this._smithLevel = level;
        this.refresh();
    }

    /**
     * 最大強化回数を設定する。
     * 
     * @param {number} maxBoostCount 最大強化回数
     */
    Window_BlacksmithItemList.prototype.setMaxBoostCount = function(maxBoostCount) {
        this._maxBoostCount = maxBoostCount;
        this.refresh();
    };

    /**
     * ショップモードを設定する。
     * 
     * @param {number} mode ショップモード(Scene_Shop.SHOP_MODE_～)
     */
    Window_BlacksmithItemList.prototype.setShopMode = function(mode) {
        if (this._mode !== mode) {
            this._mode = mode;
            this.refresh();
        }
    };

    /**
     * アイテム数を得る。
     * 
     * @return {number} アイテム数
     */
    Window_BlacksmithItemList.prototype.maxItems = function() {
        return this._items ? this._items.length : 1;
    };

    /**
     * 選択されているアイテムを得る。
     * 
     * @return {object} アイテム
     */
    Window_BlacksmithItemList.prototype.item = function() {
        return this._items[this.index()];
    };

    /**
     * 所持金を設定する。
     * 
     * @param {number} money 所持金
     */
    Window_BlacksmithItemList.prototype.setMoney = function(money) {
        this._money = money;
        this.refresh();
    };

    /**
     * 現在選択している項目が選択可能かどうかを判定して返す。
     * 
     * @return {Boolean} 選択可能な場合にはtrue, 選択できない場合にはfalse
     */
    Window_BlacksmithItemList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this._items[this.index()]);
    };

    /**
     * itemで指定される項目が有効かどうかを判定して返す。
     * 
     * @param {object} アイテム
     * @return {boolean} 有効な場合にはtrue, 無効な場合にはfalse
     */
    Window_BlacksmithItemList.prototype.isEnabled = function(item) {
        if (item) {
            if (this._mode === Scene_BlacksmithShop.SHOP_MODE_BOOST) {
                return (this.price(item) <= this._money) && this.isBoostable(item);
            } else if (this._mode === Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST) {
                return (this.price(item) <= this._money) && (item.boostCount);
            } else {
                return this.price(item) <= this._money;
            }
        }
        return false;
    };
    /**
     * ブースト可能かどうかを判定する。
     * 
     * @param {object} アイテム
     * @return {boolean} ブースト可能な場合にはtrue, それ以外はfalse
     */
    Window_BlacksmithItemList.prototype.isBoostable = function(item) {
        const nextBoostCount = (item.boostCount || 0) + 1;
        return (nextBoostCount <= this._maxBoostCount);
    };

    /**
     * itemで指定されるアイテムの価格を得る。
     * @param {Data_Item} item アイテム
     * @return {Number} 価格が返る。
     */
    Window_BlacksmithItemList.prototype.price = function(item) {
        switch (this._mode) {
            case Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST:
                return DataManager.getResetBoostPrice(item);
            case Scene_BlacksmithShop.SHOP_MODE_REINITIALIZE:
                return DataManager.getResetPrice(item);
            case Scene_BlacksmithShop.SHOP_MODE_BOOST:
            default:
                return DataManager.getBoostPrice(item);
        }
    };

    /**
     * 更新する。
     */
    Window_BlacksmithItemList.prototype.refresh = function() {
        this.createContents();
        this.drawAllItems();
    };

    /**
     * indexで指定される項目を描画する。
     * 
     * @param {Number} index インデックス
     */
    Window_BlacksmithItemList.prototype.drawItem = function(index) {
        const item = this._items[index];
        if (!item) {
            return;
        }

        const rect = this.itemRect(index);
        const rateWidth = 160;
        const priceWidth = 128 + this.textWidth(this.currencyUnit());
        const padding = this.itemPadding();
        rect.width -= this.itemPadding();
        let x = rect.x;
        const nameWidth = rect.width - priceWidth - rateWidth - padding * 2;
        
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, nameWidth);
        x += nameWidth + padding;
        this.resetTextColor();
        if ((this._mode === Scene_BlacksmithShop.SHOP_MODE_BOOST)
                && !this.isBoostable(item)) {
            const textWidth = rect.width - x;
            this.drawText(textInsufficientSkillLevel, x, rect.y, textWidth, "right");
        } else {
            const rate = (this._mode === Scene_BlacksmithShop.SHOP_MODE_BOOST)
                    ? DataManager.getBoostSuccessRate(item, this._smithLevel, null, 1)
                    : 1.0;
            this.drawSuccessRate(textSuccessRate, rate, x, rect.y, rateWidth);
            x += rateWidth + padding;
            this.drawCurrencyValue(this.price(item), this.currencyUnit(), x, rect.y, priceWidth);
        }
        this.changePaintOpacity(true);
    };

    /**
     * 成功率「成功率:xx%」を描画する。
     * 
     * @param {string} label ラベル文字列
     * @param {number} rate 成功率(0～1.0)
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
     Window_BlacksmithItemList.prototype.drawSuccessRate = function(label, rate, x, y, width) {
        const valueWidth = 56;
        const labelWidth = width - valueWidth;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(label + ":", x, y, labelWidth);
        this.resetTextColor();
        const rateStr = Math.floor(rate * 100) + "%";
        this.drawText(rateStr, x + labelWidth, y, valueWidth, "right");
    };

    /**
     * 所持金の単位を得る。
     * 
     * @returns {string} 所持金の単位
     */
     Window_BlacksmithItemList.prototype.currencyUnit = function() {
        return TextManager.currencyUnit;
    };

    //------------------------------------------------------------------------------
    // Window_BlacksmithCatalystList
    Window_BlacksmithCatalystList.prototype = Object.create(Window_Selectable.prototype);
    Window_BlacksmithCatalystList.prototype.constructor = Window_BlacksmithCatalystList;

    /**
     * Window_BlacksmithCatalystListを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BlacksmithCatalystList.prototype.initialize = function(rect) {
        this._targetItem = null; // 強化対象のアイテム
        this._data = [];
        Window_Selectable.prototype.initialize.call(this, rect);
    };

    /**
     * ターゲットアイテムを設定する。
     * 
     * @param {Data_Item} item 強化対象のアイテム
     */
    Window_BlacksmithCatalystList.prototype.setTargetItem = function(item) {
        if (this._targetItem !== item) {
            this._targetItem = item;
            this.refresh();
        }
    };

    /**
     * 最大カラム数を取得する。
     * 
     * @return {Number} カラム数
     */
    Window_BlacksmithCatalystList.prototype.maxCols = function() {
        return 1;
    };

    /**
     * 最大項目数を取得する。
     * 
     * @return {Number} 最大項目数
     */
    Window_BlacksmithCatalystList.prototype.maxItems = function() {
        return this._data ? this._data.length : 1;
    };

    /**
     * 現在選択されているアイテムを取得する。
     * 
     * @return {Data_Item} 触媒アイテム。
     */
    Window_BlacksmithCatalystList.prototype.item = function() {
        const index = this.index();
        return this._data && (index >= 0) ? this._data[index] : null;
    };

    /**
     * 現在選択している項目が選択可能かどうかを判定する。
     * 
     * @return {boolean} 現在選択している項目が選択可能な場合にはtrue。
     */
    Window_BlacksmithCatalystList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.item());
    };

    /**
     * itemで指定される項目が適用可能かどうかを判定する。
     * 
     * @param {object} item 対象のアイテム
     * @return {boolean} 適用可能な場合にはtrue, それ以外はfalse
     */
    Window_BlacksmithCatalystList.prototype.isEnabled = function(item) {
        if (!item) {
            return false;
        }
        if (item.meta.boostCondition) {
            // eslint-disable-next-line no-unused-vars
            const equipment = this._targetItem;
            // eslint-disable-next-line no-unused-vars
            const isWeapon = DataManager.isWeapon(item);
            // eslint-disable-next-line no-unused-vars
            const isArmor = DataManager.isArmor(item);
            return eval(item.meta.boostCondition) || false;
        } else {
            return true; // 条件ないなら全て可
        }
    };

    /**
     * 触媒アイテムリストを構築する。
     */
    Window_BlacksmithCatalystList.prototype.makeItemList = function() {
        this._data = [];
        $gameParty.items().forEach(function(item) {
            if (item.boostEffects && (item.boostEffects.length > 0)
                    && !DataManager.isIndependent(item)) {
                // ブーストエフェクトが1つ以上存在する。
                this._data.push(item);
            }
        }, this);
        if (this._data.length === 0) {
            this._data.push(null);
        }
    };

    /**
     * アイテムを描画する。
     * 
     * @param {number} index 項目インデックス
     */
    Window_BlacksmithCatalystList.prototype.drawItem = function(index) {
        const item = this._data[index];
        if (item) {
            const numberWidth = this.textWidth("000");
            const rect = this.itemRect(index);
            rect.width -= this.itemPadding(); // たぶん全部使おうとするとあふれる。
            this.changePaintOpacity(this.isEnabled(item));
            const nameWidth = rect.width - numberWidth;
            this.drawItemName(item, rect.x, rect.y, nameWidth);
            this.resetTextColor();
            this.drawItemNumber(item, rect.x + nameWidth, rect.y, numberWidth);
            this.changePaintOpacity(true);
        }
    };

    /**
     * アイテムの数量を描画する。
     * 
     * @param {object} item アイテム
     * @param {number} x 描画x位置
     * @param {number} y 描画y位置
     * @param {number} width 描画幅
     */
    Window_BlacksmithCatalystList.prototype.drawItemNumber = function(item, x, y, width) {
        const itemCount = $gameParty.numItems(item);
        this.drawText(itemCount, x, y, width, "right");
    };

    /**
     * 更新する。
     */
    Window_BlacksmithCatalystList.prototype.refresh = function() {
        this.createContents();
        this.makeItemList();
        this.drawAllItems();
    };

    //------------------------------------------------------------------------------
    // Window_BlacksmithNumberInput
    //

    Window_BlacksmithNumberInput.prototype = Object.create(Window_NumberInput.prototype);
    Window_BlacksmithNumberInput.prototype.constructor = Window_BlacksmithNumberInput;

    /**
     * Window_BlacksmithNumberInputを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BlacksmithNumberInput.prototype.initialize = function(rect) {
        this._max = 0;
        Window_ShopNumber.prototype.initialize.call(this, rect);
    };

    /**
     * 入力値の最大値を設定する。
     * 
     * @param {number} max 最大値
     */
    Window_BlacksmithNumberInput.prototype.setMaximum = function(max) {
        this._max = max;
        this._number = this._number.clamp(0, this._max);
        this.refresh();
    };

    /**
     * 値をセットする。
     * 
     * @param {number} number 数値
     */
    Window_BlacksmithNumberInput.prototype.setNumber = function(number) {
        this._number = number.clamp(0, this._max);
        if (this.active && this._catalystWindow) {
            this._catalystWindow.setCatalystItemCount(this.number());
        }
        this.refresh();
    };

    /**
     * 値を取得する
     * 
     * @returns {number} 値
     */
    Window_BlacksmithNumberInput.prototype.number = function() {
        return this._number;
    };

    

    /**
     * 入力を開始する。
     */
    Window_BlacksmithNumberInput.prototype.start = function() {
        this._maxDigits = this.maxDigits();
        this.updatePlacement();
        this.placeButtons();
        this.createContents();
        this.refresh();
        this.open();
        this.activate();
        this.select(0);
        this.visible = true;
        for (const button of this._buttons) {
            button.visible = true;
        }
        this.select(this.maxItems() - 1);
    };

    /**
     * 位置を更新する。
     */
     Window_BlacksmithNumberInput.prototype.updatePlacement = function() {
         /* Do nothing. */
    };

    /**
     * 最大桁数を得る。
     * 
     * @return {number} 最大桁数
     */
    Window_BlacksmithNumberInput.prototype.maxDigits = function() {
        let digit = 1;
        let tmp = this._max;
        while (tmp >= 10) {
            tmp /= 10;
            digit++;
        }

        return digit;
    };

    /**
     * 数値変更処理を行う。
     * 
     * Note: キャンセル処理を追加するためにフックする。
     */
    Window_BlacksmithNumberInput.prototype.processDigitChange = function() {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated("cancel")) {
                this.processCancel();
            }
        }
        Window_NumberInput.prototype.processDigitChange.call(this);
    };

    /**
     * 値を変更する。
     * 
     * @param {boolean} up 上げる場合にはtrue, 下げる場合にはfalse
     */
    Window_BlacksmithNumberInput.prototype.changeDigit = function(up) {
        if (up && (this._number === this._max)) {
            // 最大値指定状態で増加操作の場合、最小値にする。
            this._number = 1;
        } else if (!up && (this._number === 1)) {
            // 最小値指定状態で減少操作の場合、最大値にする。
            this._number = this._max;
        } else {
            const index = this.index();
            const place = Math.pow(10, this._maxDigits - 1 - index);
            if (up) {
                this._number += place;
            } else {
                this._number -= place;
            }
            if (this._number < 1) {
                this._number = 1;
            } else if (this._number > this._max) {
                this._number = this._max;
            }
        }

        if (this.active && this._catalystWindow) {
            this._catalystWindow.setCatalystItemCount(this.number());
        }
        
        this.refresh();
        this.playCursorSound();
    };

    /**
     * OK処理を行う。
     */
     Window_BlacksmithNumberInput.prototype.processOk = function() {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    };

    /**
     * 成功率を表示するウィンドウを設定する。
     * 
     * @param {Window_BlacksmithCatalystItem} window 成功率を表示するウィンドウ
     */
    Window_BlacksmithNumberInput.prototype.setCatalystWindow = function(window) {
        this._catalystWindow = window;
    };

    //------------------------------------------------------------------------------
    // Window_BlacksmithCatalystItem
    // 選択されているアイテムと触媒を表示するウィンドウ。
    // 個数と強化成功率を表示する。


    Window_BlacksmithCatalystItem.prototype = Object.create(Window_Base.prototype);
    Window_BlacksmithCatalystItem.prototype.constructor = Window_BlacksmithCatalystItem;

    /**
     * Window_BlacksmithCatalystItem を初期化する。
     * 
     * @param {Rectangle} rect 
     */
    Window_BlacksmithCatalystItem.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._targetItem = null;
        this._catalystItem = null;
        this._catalystItemCount = 1;
        this._smithLevel = 0;
    };

    /**
     * 鍛冶屋レベルを設定する。
     * 
     * @param {Number} level 鍛冶屋レベル
     */
     Window_BlacksmithCatalystItem.prototype.setSmithLevel = function(level) {
        this._smithLevel = level;
        this.refresh();
    }

    /**
     * 強化対象アイテムを設定する。
     * 
     * @param {Object} item 強化対象アイテム(DataWeapon/DataArmor)
     */
    Window_BlacksmithCatalystItem.prototype.setTargetItem = function(item) {
        this._targetItem = item;
        this.refresh();
    };

    /**
     * 触媒アイテムと数量を設定する。
     * 
     * @param {object} item 触媒アイテム
     * @param {number} count 数量
     */
     Window_BlacksmithCatalystItem.prototype.setCatalystItem = function(item, count) {
        this._catalystItem = item;
        this._catalystItemCount = count;
        this.refresh();
    };

    /**
     * 触媒アイテムの数量を設定する。
     * 
     * @param {number} count 触媒アイテムの数量
     */
    Window_BlacksmithCatalystItem.prototype.setCatalystItemCount = function(count) {
        this._catalystItemCount = count;
        this.refresh();
    };

    /**
     * 表示を更新する。
     */
     Window_BlacksmithCatalystItem.prototype.refresh = function() {
        this.contents.clear();
        const x = this.itemPadding();
        let y = 0;
        const lineHeight = this.lineHeight();
        const contentsWidth = this.contentsWidth();
 
        // 1行目 強化アイテム
        this.changeTextColor(this.systemColor());
        this.drawText(textBoostItem, x, y, 120);
        this.drawText(":", x + 120, y, 20);
        if (this._targetItem) {
            this.resetTextColor();
            this.drawItemName(this._targetItem, x + 140, y, contentsWidth - 140);
        }
        y += lineHeight;

        // 2行目触媒
        this.changeTextColor(this.systemColor());
        this.drawText(textCatalystItem, x, y, 120);
        this.drawText(":", x + 120, y, 20);
        if (this._catalystItem) {
            this.resetTextColor();
            this.drawItemName(this._catalystItem, x + 140, y, contentsWidth - 140);
        }
        y += lineHeight;

        // 3行目 成功確率と効果記述
        // 強化素材の詳細はdescriptionでもいいかも。
        this.changeTextColor(this.systemColor());
        this.drawText(textSuccessRate, x, y, 120);
        this.drawText(":", x + 120, y, 20);
        if (this._catalystItem) {
            const rate = DataManager.getBoostSuccessRate(this._targetItem, this._smithLevel, this._catalystItem, this._catalystItemCount);
            const rateStr = Math.floor(rate * 100) + "%";
            this.resetTextColor();
            this.drawText(rateStr, x + 140, y, contentsWidth - 140);
        }
    };
    //------------------------------------------------------------------------------
    // Window_BlacksmithConfirm
    Window_BlacksmithConfirm.prototype = Object.create(Window_Selectable.prototype);
    Window_BlacksmithConfirm.prototype.constructor = Window_BlacksmithConfirm;

    /**
     * Window_BlacksmithConfirm を初期化する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域
     */
     Window_BlacksmithConfirm.prototype.initialize = function(rect) {
        this._items = [ "", TextManager.cancel ];
        Window_Selectable.prototype.initialize.call(this, rect);
    };

    /**
     * メッセージを表示する。
     */
     Window_BlacksmithConfirm.prototype.setMessage = function(msg) {
        this._items[0] = msg;
        this.refresh();
    };

    /**
     * 最大項目数を取得する。
     * @return {Number} 最大項目数
     */
     Window_BlacksmithConfirm.prototype.maxItems = function() {
        return this._items.length;
    };

    /**
     * 項目を描画する。
     * 
     * @param {Number} index 描画する項目のインデックス番号
     */
     Window_BlacksmithConfirm.prototype.drawItem = function (index) {
        const rect = this.itemRect(index);
        this.resetTextColor();
        this.drawText(this._items[index], rect.x, rect.y, rect.width, "left");
        this.changeTextColor(ColorManager.normalColor());
    };

    //------------------------------------------------------------------------------
    // Scene_BlacksmithShop
    //
    Scene_BlacksmithShop.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_BlacksmithShop.prototype.constructor = Scene_BlacksmithShop;

    /**
     * シーンを初期化する。
     */
    Scene_BlacksmithShop.initialize = function() {
        this._mode = Scene_BlacksmithShop.SHOP_MODE_BOOST;
        Scene_MenuBase.prototype.initialize.call();
    };

    /**
     * 作成前の準備をする。
     * 
     * @param {Number} maxBoost この鍛冶屋が対応できる最大ブースト数
     * @param {Number} smithLevel この鍛冶屋の技能レベル。高いほど成功しやすい。
     * @param {String} clerkFileName  店員の画像として使うファイル名
     * @param {Number} 店員画像表示オフセットX
     * @param {Number} 店員画像表示オフセットY
     */
    Scene_BlacksmithShop.prototype.prepare = function(maxBoost, smithLevel, clerkFileName, clerkOffsetX, clerkOffsetY) {
        this._maxBoost = maxBoost;
        this._smithLevel = smithLevel;
        this._clerkFileName = clerkFileName;
        this._clerkOffsetX = clerkOffsetX || 0;
        this._clerkOffsetY = clerkOffsetY || 0;
    };

    /**
     * シーンを作成する。
     */
    Scene_BlacksmithShop.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createItemWindow();
        this.createCatalystWindow();
        this.createConfirmWindow();
        this.createSelectedItemWindow();
        this.createNumberInputWindow();
        this.createAnimationTarget();
        this.loadClerkPicture();
    };

    /**
     * ウィンドウレイヤーを構築する。
     */
     Scene_BlacksmithShop.prototype.createWindowLayer = function() {
        this.createClerkLayer();
        Scene_MenuBase.prototype.createWindowLayer.call(this);
    };

    /**
     * 店員画像描画用レイヤーを追加する。
     */
     Scene_BlacksmithShop.prototype.createClerkLayer = function() {
        this._clerkLayer = new Sprite();
        this.addChild(this._clerkLayer);
    };

    /**
     * ヘルプウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    };

    /**
     * 所持金表示ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createGoldWindow = function() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    };

    /**
     * 所持金ウィンドウを作成する。
     */
        Scene_BlacksmithShop.prototype.goldWindowRect = function() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * コマンドウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_BlacksmithShopCommand(rect);
        this._commandWindow.setHandler("boost", this.onCommandBoost.bind(this));
        this._commandWindow.setHandler("reset-boost", this.onCommandResetBoost.bind(this));
        this._commandWindow.setHandler("reinitialize", this.onCommandReinitialize.bind(this));
        this._commandWindow.setHandler("cancel", this.onCommandCancel.bind(this));
        this.addWindow(this._commandWindow);
    };

    /**
     * コマンドウィンドウの矩形領域を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.commandWindowRect = function() {
        const rect = this.goldWindowRect();
        const wx = rect.x;
        const wy = rect.y + rect.height;
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(4, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 強化品リストウィンドウを開く。
     */
    Scene_BlacksmithShop.prototype.createItemWindow = function() {
        // アイテム一覧を作るぜ。
        this.makeBoostableItemList();

        const rect = this.itemWindowRect();
        this._itemWindow = new Window_BlacksmithItemList(rect, this._items);
        this._itemWindow.setMaxBoostCount(this._maxBoost);
        this._itemWindow.setSmithLevel(this._smithLevel);
        this._itemWindow.hide();
        this._itemWindow.setHandler("ok", this.onItemWindowOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemWindowCancel.bind(this));
        this._itemWindow.setHandler("itemchange", this.onItemWindowItemChange.bind(this));
        this.addWindow(this._itemWindow);
    };

    /**
     * アイテムウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.itemWindowRect = function() {
        const goldWindowRect = this.goldWindowRect();
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight() - goldWindowRect.height;
        const wy = goldWindowRect.y + goldWindowRect.height;
        const wx = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 触媒選択ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createCatalystWindow = function() {
        const rect = this.catalystWindowRect();
        this._catalystWindow = new Window_BlacksmithCatalystList(rect);
        this._catalystWindow.setHandler("ok", this.onCatalystOk.bind(this));
        this._catalystWindow.setHandler("cancel", this.onCatalystCancel.bind(this));
        this._catalystWindow.setHandler("itemchange", this.onCatalystItemChange.bind(this));
        this._catalystWindow.hide();
        this.addWindow(this._catalystWindow);
    };

    /**
     * 素材リストウィンドウを作成する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.catalystWindowRect = function() {
        const rect = this.itemWindowRect();
        const ww = rect.width / 2;
        const wh = rect.height;
        const wx = rect.x + ww;
        const wy = rect.y;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 確認ウィンドウの矩形領域を作成する。
     * 
     * @return {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.createConfirmWindow = function() {
        const rect = this.confirmWindowRect();
        this._confirmWindow = new Window_BlacksmithConfirm(rect);
        this._confirmWindow.setHandler("ok", this.onConfirmOk.bind(this));
        this._confirmWindow.setHandler("cancel", this.onConfirmCancel.bind(this));
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        this.addWindow(this._confirmWindow);
    };

    /**
     * 確認ウィンドウの矩形領域を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.confirmWindowRect = function() {
        const ww = 480;
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 強化アイテムと素材表示ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createSelectedItemWindow = function() {
        const rect = this.selectedItemWindowRect();
        this._selectedItemWindow = new Window_BlacksmithCatalystItem(rect);
        this._selectedItemWindow.setSmithLevel(this._smithLevel);
        this._selectedItemWindow.hide();
        this.addWindow(this._selectedItemWindow);
    };

    /**
     * 強化対象と素材を表示するウィンドウ矩形領域を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.selectedItemWindowRect = function() {
        const ww = 480;
        const wh = this.calcWindowHeight(3, false);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 200;
        return new Rectangle(wx, wy, ww, wh);
    };



    /**
     * 数量入力ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createNumberInputWindow = function() {
        const rect = this.numberInputWindowRect();
        this._numberInputWindow = new Window_BlacksmithNumberInput(rect);
        this._numberInputWindow.hide();
        this._numberInputWindow.setHandler("ok", this.onNumberInputOk.bind(this));
        this._numberInputWindow.setHandler("cancel", this.onNumberInputCancel.bind(this));
        this._numberInputWindow.setHandler("itemchange", this.onNumberInputItemChange.bind(this));
        this.addWindow(this._numberInputWindow);

        this._numberInputWindow.setCatalystWindow(this._selectedItemWindow);
    };

    /**
     * 数値入力ウィンドウ矩形領域を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_BlacksmithShop.prototype.numberInputWindowRect = function() {
        const rect = this.selectedItemWindowRect();
        const wx = rect.x;
        const wy = rect.y + rect.height;
        const ww = 240;
        const wh = this.calcWindowHeight(1, true) + 52;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アニメーション表示用のターゲットを作成する。
     * これでいいのか分からんけどやってみよう。
     */
    Scene_BlacksmithShop.prototype.createAnimationTarget = function() {
        this._animationTargetSprite = new Sprite();
        this._animationTargetSprite.x = Graphics.boxWidth / 2;
        this._animationTargetSprite.y = Graphics.boxHeight / 2;
        this._animationTargetSprite.setFrame(0, 0, 0, 0);
        this.addChild(this._animationTargetSprite);

        this._animationSprite = null; // 実際にアニメーションさせてるスプライト(アニメーション中のみ存在)
    };

    /**
     * 店員用画像をロードする。
     */
    Scene_BlacksmithShop.prototype.loadClerkPicture = function() {
        if (this._clerkFileName) {
            this._clerkBitmap = ImageManager.loadPicture(this._clerkFileName, 0);
            if (!this._clerkBitmap.isReady()) {
                this._clerkBitmap.addLoadListener(this.addClerkSprite.bind(this));
            } else {
                this.addClerkSprite();
            }
        }
    };

    /**
     * 店員表示用スプライトを追加する。
     */
    Scene_BlacksmithShop.prototype.addClerkSprite = function() {
        this._clerkSprite = new Sprite();
        this._clerkSprite.bitmap = this._clerkBitmap;
        this._clerkSprite.anchor.x = 0.5;
        this._clerkSprite.anchor.y = 1.0;
        const baseX = Graphics.boxWidth - (this.mainCommandWidth() / 2);
        const baseY = this.isBottomHelpMode() ? this.helpAreaTop() : Graphics.boxHeight;
        this._clerkSprite.x = baseX + this._clerkOffsetX;
        this._clerkSprite.y = baseY + this._clerkOffsetY;
        this._clerkLayer.addChild(this._clerkSprite);
    };

    /**
     * 強化対象のアイテム一覧を作成する。
     * この鍛冶屋レベルによってフィルタはしない。
     * (鍛冶屋レベルが足りないやつは、リストに表示して技量不足、と表示させる)
     */
    Scene_BlacksmithShop.prototype.makeBoostableItemList = function() {
        this._items = [];
        $gameParty.weapons().forEach(function(weapon) {
            if (DataManager.isBoostableItem(weapon)) {
                this._items.push(weapon);
            }
        }, this);
        $gameParty.armors().forEach(function(armor) {
            if (DataManager.isBoostableItem(armor)) {
                this._items.push(armor);
            }
        }, this);
    };

    /**
     * 所持金を取得する。
     * @return {Number} 所持金
     */
    Scene_BlacksmithShop.prototype.money = function() {
        return $gameParty.gold();
    };

    /**
     * シーンを開始する。
     */
    Scene_BlacksmithShop.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        // コマンドウィンドウをアクティブ化
        this._helpWindow.show();
        this._commandWindow.show();
        this._commandWindow.activate();
    };

    /**
     * シーンを更新する。
     */
     Scene_BlacksmithShop.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (this._animationSprite) {
            // アニメーション開始済み。
            if (!this._animationSprite.isPlaying()) {
                // アニメーション再生終了。
                this.removeChild(this._animationSprite);
                this._animationSprite.destroy();
                this._animationSprite = null;
            }
        }
    };

    /**
     * コマンドウィンドウで強化が選択されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCommandBoost = function() {
        this._mode = Scene_BlacksmithShop.SHOP_MODE_BOOST;
        this._itemWindow.setShopMode(this._mode);
        this._itemWindow.setMoney(this.money());
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.show();
        this._itemWindow.activate();
    };

    /**
     * コマンドウィンドウで強化リセットが選択されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCommandResetBoost = function() {
        this._mode = Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST;
        this._itemWindow.setShopMode(this._mode);
        this._itemWindow.setMoney(this.money());
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.show();
        this._itemWindow.activate();
    };

    /**
     * コマンドウィンドウで打ち直しが選択されたときに通知を受けとる。
     */
    Scene_BlacksmithShop.prototype.onCommandReinitialize = function() {
        this._mode = Scene_BlacksmithShop.SHOP_MODE_REINITIALIZE;
        this._itemWindow.setShopMode(this._mode);
        this._itemWindow.setMoney(this.money());
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.show();
        this._itemWindow.activate();
    };

    /**
     * アイテムウィンドウでOK操作されたとき。
     */
    Scene_BlacksmithShop.prototype.onItemWindowOk = function() {
        const item = this._itemWindow.item();
        switch (this._mode) {
            case Scene_BlacksmithShop.SHOP_MODE_BOOST:
                // 強化時
                this._itemWindow.deactivate();
                this._catalystWindow.setTargetItem(this._itemWindow.item());
                this._catalystWindow.select(0);
                this._helpWindow.setItem(this._catalystWindow.item());
                this._catalystWindow.show();
                this._catalystWindow.activate();
                break;
            case Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST:
                // 確認してOKなら強化リセット
                this._confirmWindow.setMessage(textConfirmResetBoost.format(item.name));
                this._confirmWindow.deselect(); // 未選択状態にする。
                this._confirmWindow.activate();
                this._confirmWindow.show();
                break;
            case Scene_BlacksmithShop.SHOP_MODE_REINITIALIZE:
                // 確認してOKなら打ち直し。
                this._confirmWindow.setMessage(textConfirmReinitialize.format(item.name));
                this._confirmWindow.deselect(); // 未選択状態にする。
                this._confirmWindow.activate();
                this._confirmWindow.show();
                break;
        }

    };

    /**
     * アイテムウィンドウでキャンセル操作されたとき。
     */
    Scene_BlacksmithShop.prototype.onItemWindowCancel = function() {
        // アイテムウィンドウを消去してコマンドウィンドウをアクティブ化
        this._itemWindow.hide();
        this._itemWindow.deactivate();
        this._commandWindow.activate();
        this._helpWindow.clear();
    };

    /**
     * アイテムウィンドウで項目が変更されたとき。
     */
    Scene_BlacksmithShop.prototype.onItemWindowItemChange = function() {
        this._helpWindow.setItem(this._itemWindow.item());
    };

    /**
     * コマンドウィンドウでキャンセル操作されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCommandCancel = function() {
        this.popScene();
    };

    /**
     * 触媒選択ウィンドウでOK操作されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCatalystOk = function() {
        this._selectedItemWindow.setTargetItem(this._itemWindow.item());
        const catalystItem = this._catalystWindow.item();
        this._selectedItemWindow.setCatalystItem(catalystItem, 1);
        this._numberInputWindow.setMaximum($gameParty.numItems(catalystItem));
        this._numberInputWindow.setNumber(1);
        this._selectedItemWindow.show();
        this._numberInputWindow.start();
    };

    /**
     * 触媒選択ウィンドウでキャンセル操作されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCatalystCancel = function() {
        this._catalystWindow.hide();
        this._catalystWindow.deactivate();
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.activate();
    };

    /**
     * 触媒選択ウィンドウで選択項目が変化したときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCatalystItemChange = function() {
        this._helpWindow.setItem(this._catalystWindow.item());
    };

    /**
     * 確認ウィンドウでOKが選択された時の処理を行う。
     */
    Scene_BlacksmithShop.prototype.onConfirmOk = function() {
        // Goldを消費して処理する。
        const item = this._itemWindow.item();
        const price = this._itemWindow.price(item);

        // シャリーン
        SoundManager.playShop();
        $gameParty.loseGold(price);

        // アニメーション再生 アニメーション待ちって無かったはず。
        if (this._mode === Scene_BlacksmithShop.SHOP_MODE_RESET_BOOST) {
            this.startAnimation(this.resetBoostAnimationId());
            DataManager.resetBoost(item); // 強化リセット
        } else if (this._mode === Scene_BlacksmithShop.SHOP_MODE_REINITIALIZE) {
            this.startAnimation(this.reinitializeAnimationId());
            DataManager.reinitializeIndependentItem(item); // 全リセット
        }

        // 表示更新する。
        this._helpWindow.refresh();
        this._goldWindow.refresh();
        this._itemWindow.refresh();
        // 確認ウィンドウは消去してアイテム選択ウィンドウをアクティブ化
        this._confirmWindow.hide();
        this._itemWindow.activate();
    };


    /**
     * animationIdで指定されるアニメーションを表示する。
     * @param {Number} animationId アニメーションID(0以下を指定すると表示しない)
     */
    Scene_BlacksmithShop.prototype.startAnimation = function(animationId) {
        if (animationId <= 0) {
            return;
        }
        const sprite = new Sprite_Animation();
        const targetSprites = [this._animationTargetSprite];
        sprite.targetObjects = targetSprites;
        const animation = $dataAnimations[animationId];
        sprite.setup(targetSprites, animation, false, 0, null);
        this._animationSprite = sprite;
        this.addChild(sprite);
    };

    /**
     * シーンがビジーかどうかを判定して返す。
     * 
     * @return {Boolean} ビジーの場合にはtrue,それ以外はfalse
     */
    Scene_BlacksmithShop.prototype.isBusy = function() {
        if (this._animationSprite && this._animationTargetSprite.isAnimationPlaying()) {
            return true;
        }
        return Scene_MenuBase.prototype.isBusy.call(this);
    };

    /**
     * 確認ウィンドウでキャンセル操作された
     */
    Scene_BlacksmithShop.prototype.onConfirmCancel = function() {
        // 確認ウィンドウを消して、対象アイテム選択に戻る。
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        this._itemWindow.activate();
    };

    /**
     * 数値入力にてOK操作された
     */
    Scene_BlacksmithShop.prototype.onNumberInputOk = function() {
        // 強化実行処理
        const targetItem = this._itemWindow.item();
        const catalystItem = this._catalystWindow.item();
        const smithLevel = this._smithLevel;
        const itemCount = this._numberInputWindow.number();
        const price = DataManager.getBoostPrice(targetItem);
        const rate = DataManager.getBoostSuccessRate(targetItem, smithLevel, catalystItem, itemCount);

        // シャリーン
        $gameParty.loseGold(price);
        $gameParty.loseItem(catalystItem, itemCount);
        const success = Math.random() <= rate;
        if (success) {
            this.startAnimation(this.boostSuccessAnimationId());
            DataManager.boostIndependentItem(targetItem, catalystItem);
        } else {
            this.startAnimation(this.boostFailureAnimationId());
        }

        // 数値選択ウィンドウ、アイテム表示、触媒ウィンドウを閉じて、
        // 対象選択ウィンドウに戻す。
        this._numberInputWindow.hide();
        this._selectedItemWindow.hide();
        this._catalystWindow.refresh();
        this._catalystWindow.hide();
        this._goldWindow.refresh();
        this._itemWindow.refresh();
        this._helpWindow.setItem(this._itemWindow.item());
        this._itemWindow.activate();
    };

    /**
     * 数値入力にてキャンセルされた。
     */
    Scene_BlacksmithShop.prototype.onNumberInputCancel = function() {
        // 数値入力ウィンドウを閉じて、触媒選択ウィンドウに戻る。
        this._selectedItemWindow.hide();
        this._numberInputWindow.hide();
        this._catalystWindow.activate();
    };

    /**
     * 数値入力にて選択数が変わった。
     */
    Scene_BlacksmithShop.prototype.onNumberInputItemChange = function() {
        this._selectedItemWindow.setCatalystItem(this._catalystWindow.item(), this._numberInputWindow.number());
    };

    /**
     * 強化リセット時に表示するアニメーションIDを取得する。
     * 
     * @returns {number} アニメーションID
     */
    Scene_BlacksmithShop.prototype.resetBoostAnimationId = function() {
        return resetBoostAnimationId;
    };

    /**
     * 打ち直し時に表示するアニメーションIDを取得する。
     * 
     * @returns {number} アニメーションID
     */
    Scene_BlacksmithShop.prototype.reinitializeAnimationId = function() {
        return reinitializeAnimationId;
    };

    /**
     * 強化成功時のアニメーションIDを取得する。
     * 
     * @returns {number} アニメーションID
     */
    Scene_BlacksmithShop.prototype.boostSuccessAnimationId = function() {
        return boostSuccessAnimationId;
    };

    /**
     * 強化失敗時のアニメーションIDを取得する
     * 
     * @returns {number} アニメーションID
     */
    Scene_BlacksmithShop.prototype.boostFailureAnimationId = function() {
        return boostFailureAnimationId;
    };


})();