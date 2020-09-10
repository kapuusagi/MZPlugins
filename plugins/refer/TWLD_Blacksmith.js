/*:
 * @plugindesc  TWLD向けに構築した鍛冶システムのプラグイン
 * @author kapuusagi
 * 
 * @param BoostSuccessAnimationId
 * @type number
 * @desc 強化成功時に表示させるアニメーションID
 * @default 0
 * 
 * @param BoostFailureAnimationId
 * @type number
 * @desc 強化失敗時に表示させるアニメーションID
 * @default 0
 * 
 * @param ResetBoostAnimationId
 * @type number
 * @desc 強化リセット時に表示させるアニメーションID
 * @default 0
 * 
 * @param ReinitializeAnimationId
 * @type number
 * @desc 再初期化時に表示させるアニメーションID
 * @default 0
 * 
 * @help
 *   Yanfly氏のItemCoreエンジンと個別アイテムの有効化が必要。
 * 
 *  仕様
 *     ・個別アイテムを強化(boost)できる
 *       成功率は強化段階が上がるごとに低くなる。
 *       更に適用する触媒と鍛冶屋レベルにより変化する。
 *       腕の悪い（レベルが低い）鍛冶屋だと、自分のレベルより高い強化段階をしようとすると成功率落ちるよ。
 *       腕の良い（レベルが高い）鍛冶屋だと、自分のレベルより低い強化段階では成功率上がるよ。
 *       触媒によって成功率変わるよ。
 *       最低成功率5%としたよ。
 *     ・強化量は触媒アイテムのノートタグで指定する。
 *     ・お店では強化・リセット・打ち直し（ランダマイズをやりなおす）ができる。
 *     ・ぼふん(失敗)時に消失も考えたけど、今時厳しすぎるので止めた
 *  プラグインコマンド
 *     TWLD.Blacksmith.OpenShop [ maxBoost# [ smithlevel#  [ clerk$ ] ] ]
 *         maxBoost# : 最大強化数
 *         smithLevel# : 鍛冶屋レベル。高いほど成功しやすくなる。ブースト数より低いと成功率下がる。
 *         clerk$ : 店員画像
 *     アイテムに適用するノートタグ
 *         <BoostEffect:effect$>
 *             強化効果
 *             effect$:適用した時の効果を記載する。複数効果を持たせる場合にはカンマ(,)区切りで指定する。
 *                     強化触媒アイテムは、1つ以上のエフェクトを持たせる必要がある。
 *                     書式
 *                         パラメータ名 ±数値[%]
 *                     パラメータ名は以下のものが指定できる。
 *                          HP, MP, ATK, MATK, DEF, MDEF, CRI, CRR, HIT, 
 * 
 *         <BoostCondition:eval$>
 *               触媒適用条件
 *               1つの触媒につき、1つだけ設定出来る。
 *               未設定時は常に適用可能と判定される。
 *             eval$:アイテムに適用可能かを判定する判定式。
 * 
 *         <BoostSuccessRate:rate#>
 *         <BoostSuccessRate:rate#%>
 *               基本強化成功率
 *               未指定時は1.0(基本成功率100%)
 *             rate#: 基本成功率(数値表現:0.1～1.0)
 *             rate#%: 基本成功率(割合表現:0%～100%)
 * 
 *     武器・防具に適用するノートタグ
 *         <BoostPrice:price#,rate#>
 *         <BoostPrice:price#,rate#%>
 *               強化費用。
 *               強化の価格計算式参照。
 *               省略時は価格が武器・防具の価格。変動率が1.5
 *             price#:強化1回に必要な費用の基本値。
 *             rate#:ブース回数による変動率
 *             rate#%:ブース回数による変動率
 *         <BoostSuccessRate:rate>
 *         <BoostSuccessRate:rate%>
 *               基本強化成功率
 *               未指定時は1.0(基本成功率100%)
 *             rate: 基本成功率(実数表現:0.0～1.0)
 *             rate%: 基本成功率(割合表現:0%～100%)
 *         <BoostDifficulty:num#>
 *               強化難易度
 *               未指定時は0
 *             num#:強化難易度
 * 強化の価格計算式
 *     FLOOR(強化1回に必要な費用の基本値 * POW(価格変動率,次の強化レベル))
 *     ex) 強化1回に必要な費用の基本値 = 100
 *         価格変動率 = 1.5
 *         2->3への強化の場合
 *         費用 = FLOOR(100 * POW(1.5,3)) = 337
 * 強化成功率の計算
 *      設定してある武器・防具の基本成功率に対して、以下の補正が加えられる。
 *      ・強化段階が上がるごとに1割減少する。    
 *      ・(強化段階+強化難易度) > (スミスレベル)の場合、
 *        差分 * 5%減少する。
 *      ・素材アイテムの成功率が乗算される。
 *        素材アイテムを1個増やす毎に向上する。
 *      但し強化成功率の最低保証値として0.005(0.5%)とする。
 *      計算式で書くと
 *        ((基本成功率) - (スミスレベルと難易度による補正)) * (触媒アイテム補正)
 *            基本成功率： 武器・防具の強化成功率 * (1.0 - 現在のブースト回数)
 *            スミスレベルと難易度による補正：
 *                        「スミスレベル＜(強化難易度+ブースト回数)」の場合のみ
 *                        ((強化難易度 + ブースト回数) - スミスレベル) * 0.05
 *            触媒アイテム補正：
 *                        触媒アイテムの強化成功率 * (0.5 + 0.5 * 触媒アイテム使用数)
 *      ex) 武器・防具の強化成功率 0.7 (70%)
 *          強化難易度：3
 *          触媒アイテムの強化成功率：0.8 (80%)
 *          触媒アイテム使用数：2個
 *          スミスレベル： 4
 *          強化段階：2->3
 * 
 *             基本成功率 = 0.7 * (1.0 - 2 * 0.1) = 0.56
 *             スミスレベルと難易度による補正 = (3 + 2 - 4) * 0.05 = 0.05
 *             触媒アイテム補正 = 0.8 * (0.5 + 0.5 * 2) = 1.2
 *             
 *             強化成功率： (0.56 - 0.05) * 1.2 = 0.61 (61%)
 */
var Imported = Imported || {};
Imported.TWLD_Blacksmith = true;

var TWLD = TWLD || {};
TWLD.BS = TWLD.BS || {};

if (!Imported.YEP_ItemCore) {
    throw 'This plugin needs YEP_ItemCore';
}

// for ESLint
if (typeof DataManager === 'undefined') {
    var DataManager = {};
    var TextManager = {};
    var SoundManager = {};
    var SceneManager = {};
    var ItemManager = {};
    var ImageManager = {};
    var PluginManager = {};
    var Scene_MenuBase = {};
    var Window_Command = {};
    var Window_Selectable = {};
    var Window_Gold = {};
    var Window_Help = {};
    var Window_Base = {};
    var Sprite_Base = {};
    var Game_Interpreter = {};
    var $gameParty = {};
    var $dataItems = {};
    var $dataWeapons = {};
    var $dataArmors = {};
    var $dataAnimations = {};
    var Graphics = {};
    var Sprite_Button = {};
    var TouchInput = {};
    var Input = {};
    var Sprite = {};
    var Game_BattlerBase = {};
}

(function() {
    TWLD.BS.Parameters = PluginManager.parameters('TWLD_Blacksmith');

    TWLD.BS.SHOP_MODE_BOOST = 0;
    TWLD.BS.SHOP_MODE_RESET_BOOST = 1;
    TWLD.BS.SHOP_MODE_REINITIALIZE = 2;

    TWLD.BS.EFFECT_HP = 1;
    TWLD.BS.EFFECT_MP = 2;
    TWLD.BS.EFFECT_ATK = 3;
    TWLD.BS.EFFECT_MATK = 4;
    TWLD.BS.EFFECT_DEF = 5;
    TWLD.BS.EFFECT_MDEF = 6;
    TWLD.BS.EFFECT_CRI = 7;
    TWLD.BS.EFFECT_CRR = 8;
    TWLD.BS.EFFECT_HIT = 9;
    TWLD.BS.EFFECT_PPR = 10;
    TWLD.BS.EFFECT_MPR = 11;

    TWLD.BS.BoostEffectTable = [
        { id:TWLD.BS.EFFECT_HP, name:'HP', type:0 },
        { id:TWLD.BS.EFFECT_MP, name:'MP', type:0 },
        { id:TWLD.BS.EFFECT_ATK, name:'ATK', type:0 },
        { id:TWLD.BS.EFFECT_MATK, name:'MATK', type:0 },
        { id:TWLD.BS.EFFECT_DEF, name:'DEF', type:0 },
        { id:TWLD.BS.EFFECT_MDF, name:'MDEF', type:0 },
        { id:TWLD.BS.EFFECT_CRI, name:'CRI', type:1 }, // type:1はレート
        { id:TWLD.BS.EFFECT_CRR, name:'CRR', type:1 }, // type:1はレート
        { id:TWLD.BS.EFFECT_HIT, name:'HIT', type:1 }, // type:1はレート。
        { id:TWLD.BS.EFFECT_PPR, name:'PPR', type:1 }, // type:1はレート
        { id:TWLD.BS.EFFECT_MPR, name:'MPR', type:1 } // type:1はレート
    ];

    TWLD.BS.BoostSuccessAnimationId = Number(TWLD.BS.Parameters['BoostSuccessAnimationId']) || 0;
    TWLD.BS.BoostFailureAnimationId = Number(TWLD.BS.Parameters['BoostFailureAnimationId']) || 0;
    TWLD.BS.ResetBoostAnimationId = Number(TWLD.BS.Parameters['ResetBoostAnimationId']) || 0;
    TWLD.BS.ReinitializeAnimationId = Number(TWLD.BS.Parameters['ReinitializeAnimationId']) || 0;

    TWLD.BS.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    /**
     * ブースト可能かどうかを判定する
     * 
     * @param {Data_Item} item アイテム
     * @return {Boolean} ブースト可能な場合にはtrue, それ以外はfalseが返る。
     */
    TWLD.BS.isBoostableItem = function(item) {
        // 個別アイテムかつ未鑑定ではない。
        return DataManager.isIndependent(item);
    };

    /**
     * 強化に必要な価格を得る。
     * @param {Data_Item} item アイテム
     * @return {Number} 価格
     */
    TWLD.BS.getBoostPrice = function(item) {
        var nextBoostCount = (item.boostCount || 0) + 1;
        var price = Math.floor(item.boostPrice * Math.pow(item.boostPriceRate, nextBoostCount));
        return price.clamp(10, $gameParty.maxGold());
    };

    /**
     * 強化リセットに必要な価格を得る。
     * @param {Data_Item} item アイテム
     * @return {Number} 価格
     */
    TWLD.BS.getBoostResetPrice = function(item) {
        return Math.floor(item.boostPrice / 2).clamp(10, $gameParty.maxGold());
    };

    /**
     * 打ち直しに必要な価格を得る。
     * @param {Data_Item} item アイテム
     * @return {Number} 価格
     */
    TWLD.BS.getResetPrice = function(item) {
        var price = Math.floor(item.boostPrice * (1.0 + item.boostCount * 0.1));
        return price.clamp(10, $gameParty.maxGold());
    };


    /**
     * 強化成功率を得る。
     * @param {Data_Item} item ターゲットアイテム
     * @param {Number} smithLevel 鍛冶屋レベル
     * @param {itemCount} itemCount 素材アイテム数
     * @return {Number} 強化成功率
     */
    TWLD.BS.getBoostRate = function(item, smithLevel, catalystItem, catalystItemCount) {
        var boostCount = item.boostCount || 0;
        var rate = item.boostSuccessRate * (1.0 - boostCount * 0.1);
        var difficulty = item.boostDifficulty + boostCount - smithLevel;
        if (difficulty > 0) {
            rate -= difficulty * 0.05;
        }
        if (catalystItem) {
            catalystItemCount = catalystItemCount || 1;
            rate *= catalystItem.boostSuccessRate * (0.5 + 0.5 * catalystItemCount);
        }
        return rate.clamp(0.005, 1.0);
    };

    /**
     * 文字列を値に変換する。
     * @param {String} valueStr 文字列
     * @return {Number} 値が返る。
     */
    TWLD.BS.getParamValue = function(valueStr) {
        if (valueStr.slice(-1) === "%") {
            return Number(valueStr.slice(0, valueStr.length - 1) * 0.01);
        } else {
            return Number(valueStr) || 0;
        }
    };

    /**
     * 指定された特性を加算/追加する。
     * @param {Data_Item} item 追加対象のアイテム
     * @param {Number} code コード
     * @param {Number} dataId データID
     * @param {Number} value 加算値
     */
    TWLD.BS.addTrait = function(item, code, dataId, value) {
        var trait = item.traits.find(function(t) {
            return t.code == code && t.dataId == dataId;
        });
        if (trait !== null) {
            trait.value += value;
        } else {
            // 無い場合には新規追加。
            item.traits.push({ code:code, dataId:dataId, value:value });
        }
    }
    //---------------------------------------------------------------------
    // BoostEffect
    // 強化効果を現すオブジェクト。
    /**
     * ブーストエフェクト
     * @param {Number} id エフェクトID
     * @param {Number} value 値
     */
    function BoostEffect(id, value) {
        this.id = id;
        this.value = value;
    }

    //---------------------------------------------------------------------
    // DataManagerの変更
    // 

    /**
     */
    DataManager.isDatabaseLoaded = function() {
        if (!TWLD.BS.DataManager_isDatabaseLoaded.call(this)) {
            return false;
        }

        this.twldBsProcessItemNotetags($dataItems);
        this.twldBsProcessEquipNotetags($dataWeapons);
        this.twldBsProcessEquipNotetags($dataArmors);

        return true;
    };

    /**
     * アイテムのノートタグを処理する。
     * @param {Array<Data_Item>} アイテム配列(Item)
     */
    DataManager.twldBsProcessItemNotetags = function(items) {
        var patternBoostEffect = /<BoostEffect[ :]?(.+)/;
        var patternBoostCondition = /<BoostCondition[ :]?(.+)+/;
        var patternBoostSuccessRate = /<BoostSuccessRate[ :]+(\d+\.?\d*%?) *>/;

        for (var n = 1; n < items.length; n++) {
            var item = items[n];
            item.boostEffects = [];
            item.boostSuccessRate = 1.0;
            item.boostCondition = null;

            var noteLines = item.note.split(/[\r\n]+/);
            noteLines.forEach(function(line) {
                var re;
                if ((re = line.match(patternBoostEffect)) !== null) {
                    DataManager.parseBoostEffect(item, re[1]);
                } else if ((re = line.match(patternBoostCondition)) !== null) {
                    item.boostCondition = re[1].trim();
                } else if ((re = line.match(patternBoostSuccessRate))) {
                    item.boostSuccessRate = Math.max(0, TWLD.BS.getParamValue(re[1]));
                }
            });
        }
    };


    /**
     * ブーストエフェクトを解析して設定する。
     * @param {Data_Item} item アイテムデータ
     * @param {String} str 効果
     */
    DataManager.parseBoostEffect = function(item, str) {
        str.split(',').forEach(function(effectStr) {
            var re = effectStr.match(/([a-zA-Z]+) *([+-]?\d+\.?\d*%?)/);
            var paramName = re[1];
            for (var i = 0; i < TWLD.BS.BoostEffectTable.length; i++) {
                var paramType = TWLD.BS.BoostEffectTable[i];
                if (paramName === paramType.name) {
                    var paramValue = TWLD.BS.getParamValue(re[2]);    
                    if (paramType.type !== 1) {
                        paramValue = Math.floor(paramValue); // 整数のみ。
                    }                
                    var effect = item.boostEffects.find(function(ef) {
                        return ef.id == paramType.id;
                    });
                    if (effect) {
                        // 該当するIDの効果が既に登録済みなら値を加算する。
                        effect.value += paramValue;
                    } else {
                        effect = new BoostEffect(paramType.id, paramValue);
                        item.boostEffects.push(effect);
                    }
                    break;
                }
            }
        });
    };

    /**
     * 装備品のノートタグを処理する。
     * @param {Array<Data_Item>} アイテム配列(Weapon/Armor)
     */
    DataManager.twldBsProcessEquipNotetags = function(equipments) {
        var patternBoostPrice = /<BoostPrice[ :]+([\d]+)[ ,]+(\d+\.?\d*%?) *>/;
        var patternBoostSuccessRate = /<BoostSuccessRate[ :]+(\d+\.?\d*%?) *>/;
        var patternBoostDifficulty = /<BoostDifficulty[ :]+(\d+) *>/;

        for (var n = 1; n < equipments.length; n++) {
            var equipment = equipments[n];
            equipment.boostPrice = equipment.price;
            equipment.boostPriceRate = 1.5;
            equipment.boostSuccessRate = 1.0;
            equipment.boostDifficulty = 0;

            var noteLines = equipment.note.split(/[\r\n]+/);
            noteLines.forEach(function(line) {
                var re;
                if ((re = line.match(patternBoostPrice)) !== null) {
                    equipment.boostPrice = Math.max(0, Number(re[1]));
                    equipment.boostPriceRate = Math.max(1, Number(re[2]));
                } else if ((re = line.match(patternBoostSuccessRate)) !== null) {
                    equipment.boostSuccessRate = Math.max(0, TWLD.BS.getParamValue(re[1]));
                } else if ((re = line.match(patternBoostDifficulty)) !== null) {
                    equipment.boostDifficulty = Number(re[1]);
                }
            });
        }
    };

    //---------------------------------------------------------------------
    // Window_Helpの変更
    //
    TWLD.BS.Window_Help_refreshItem = Window_Help.prototype.refreshItem;

    /**
     * 道具の説明を描画する。
     */
    Window_Help.prototype.refreshItem = function(item) {
        if (item.boostEffects && (item.boostEffects.length > 0)) {
            this.refreshCatalystItem(item);
        } else {
            TWLD.BS.Window_Help_refreshItem.call(this, item);
        }
    }

    /**
     * 強化素材の説明を描画する。
     * @param {Data_Item} item アイテム
     */
    Window_Help.prototype.refreshCatalystItem = function(item) {
        // もし使用回数とかあるならここで描画処理を実装する。今のところは予定無し。
        var padding = this.standardPadding();
        var x = padding;
        var y = 0;
        var ypos = 0;
        var lineHeihgt = this.lineHeight();
        var contentsWidth = this.contentsWidth();
        if (this._numLines >= 3) {
            this.changeTextColor(this.systemColor());
            this.drawText('(強化素材)', x, y, 120);
            this.drawBoostEffect(item, x + 124, y, contentsWidth - x - 124);
            ypos += lineHeihgt;
        }
        var text = item.description || '';
        this.drawTextEx(text, x, ypos, contentsWidth);
    };

    /**
     * ブースト効果を記載描画する。
     * @param {Data_Item} item アイテム
     * @param {Number} x 表示位置x
     * @param {Number} y 表示位置y
     * @param {Number} width 幅
     */
    Window_Help.prototype.drawBoostEffect = function(item, x, y, width) {
        var xpos = x;
        for (var i = 0; i < item.boostEffects.length; i++) {
            var effect = item.boostEffects[i];
            var paramType = TWLD.BS.BoostEffectTable.find(function(pt) {
                return pt.id == effect.id;
            })
            if (paramType) {
                if (paramType.type === 0) { // 単純加減
                    var numText = (effect.value >= 0) ? (paramType.name + '+' + effect.value) : (paramType.name + effect.value);
                    this.drawText(numText, xpos, y, width);
                    xpos += this.textWidth(numText) + 4;
                } else if (paramType.type === 1) { // レート
                    var percent = Math.floor(effect.value * 100);
                    var rateText = paramType.name + ((percent > 0) ? ('+' + percent + '%') : (percent + '%'));
                    this.drawText(rateText, xpos, y, width);
                    xpos += this.textWidth(rateText) + 4;
                }
            }
        }
    };

    //---------------------------------------------------------------------
    // ItemManagerの変更
    //
    /**
     * 強化リセット処理
     * @param {Data_Item} item アイテム
     */
    ItemManager.resetBoost = function(item) {
        var baseItem = DataManager.getBaseItem(item);
        // 基本パラメータを初期化
        for (var i = 0; i < item.params.length; i++) {
            item.params[i] = item.initialParams[i];
        }
        for (var j = 0; j < item.basicParams.length; j++) {
            item.basicParams[j] = item.initialBasicParams[j];
        }

        // エフェクトを初期化。
        item.traits = [].concat(baseItem.traits);
        // ブーストカウントリセット
        item.boostCount = 0;
        // 名前リセット
        this.updateItemName(item);
    };

    /**
     * 強化する。
     * @param {Data_Item} item 強化対象のアイテム
     * @param {Data_Item} catalystItem 素材アイテム
     */
    ItemManager.boostItem = function(item, catalystItem) {
        // 効果適用
        for (var i = 0; i < catalystItem.boostEffects.length; i++) {
            var be = catalystItem.boostEffects[i];
            switch (be.id) {
                case TWLD.BS.EFFECT_HP:
                    item.params[0] += be.value;
                    break;
                case TWLD.BS.EFFECT_MP:
                    item.params[1] += be.value;
                    break;
                case TWLD.BS.EFFECT_ATK:
                    item.params[2] += be.value;
                    break;
                case TWLD.BS.EFFECT_DEF:
                    item.params[3] += be.value;
                    break;
                case TWLD.BS.EFFECT_MDEF:
                    item.params[4] += be.value;
                    break;
                case TWLD.BS.EFFECT_CRI:
                    TWLD.BS.addTrait(item, Game_BattlerBase.TRAIT_XPARAM,
                         2, be.value);
                    break;
                case TWLD.BS.EFFECT_CRR:
                    TWLD.BS.addTrait(item, Game_BattlerBase.TRAIT_XPARAM,
                         Game_BattlerBase.TRAIT_XPARAM_DID_CRR, be.value);
                    break;
                case TWLD.BS.EFFECT_HIT:
                    TWLD.BS.addTrait(item, Game_BattlerBase.TRAIT_XPARAM,
                         0, be.value);
                    break;
                case TWLD.BS.EFFECT_PPR:
                    TWLD.BS.addTrait(item, Game_BattlerBase.TRAIT_XPARAM,
                         Game_BattlerBase.TRAIT_XPARAM_DID_PPR, be.value);
                    break;
                case TWLD.BS.EFFECT_MPR:
                    TWLD.BS.addTrait(item, Game_BattlerBase.TRAIT_XPARAM,
                         Game_BattlerBase.TRAIT_XPARAM_DID_MPR, be.value);
                    break;
            }
        }

        // ブーストカウント加算
        this.increaseItemBoostCount(item, 1);
    };

    //---------------------------------------------------------------------
    // Window_BsShopCommand
    //
    function Window_BsShopCommand() {
        this.initialize.apply(this, arguments);
    }

    Window_BsShopCommand.prototype = Object.create(Window_Command.prototype);
    Window_BsShopCommand.prototype.constructor = Window_BsShopCommand;

    /**
     * 初期化する。
     * @param {Number} x ウィンドウx位置
     * @param {Number} y ウィンドウy位置
     * @param {Number} width ウィンドウ幅
     */
    Window_BsShopCommand.prototype.initialize = function(x, y, width) {
        this._windowWidth = width || 240;
        Window_Command.prototype.initialize.call(this, x, y);
    };

    /**
     * ウィンドウ幅を取得する。
     * @return {Number} ウィンドウ幅
     */
    Window_BsShopCommand.prototype.windowWidth = function() {
        return this._windowWidth;
    };

    /**
     * 最大カラム数を取得する。
     * @return {Number} カラム数
     */
    Window_BsShopCommand.prototype.maxCols = function() {
        return 1;
    };

    /**
     * 有効行数を取得する。
     * @return {Number} 有効行数
     */
    Window_BsShopCommand.prototype.numVisibleRows = function() {
        return 4;
    };

    /**
     * コマンドリストを作成する。
     */
    Window_BsShopCommand.prototype.makeCommandList = function() {
        this.addCommand('強化', 'boost');
        this.addCommand('強化リセット', 'reset-boost');
        this.addCommand('打ち直し', 'reinitialize');
        this.addCommand(TextManager.cancel, 'cancel');
    };

    //---------------------------------------------------------------------
    // Window_BsItemList
    //
    function Window_BsItemList() {
        this.initialize.apply(this, arguments);
    }

    Window_BsItemList.prototype = Object.create(Window_Selectable.prototype);
    Window_BsItemList.prototype.constructor = Window_BsItemList;

    Window_BsItemList.prototype.initialize = function(x, y, height, items) {
        var width = this.windowWidth();
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._items = items;
        this._smithLevel = 5;
        this._money = 0;
        this._maxBoostCount = 0;
        this._mode = TWLD.BS.SHOP_MODE_BOOST;
        this.refresh();
        this.select(0);
    };

    /**
     * 鍛冶屋レベルを設定する。
     * @param {Number} 鍛冶屋レベル
     */
    Window_BsItemList.prototype.setSmithLevel = function(level) {
        this._smithLevel = level;
        this.refresh();
    }

    /**
     * 最大ブーストカウントを設定する。
     * @param {Number} maxCount 最大ブーストカウント
     */
    Window_BsItemList.prototype.setMaxBoostCount = function(maxCount) {
        this._maxBoostCount = maxCount;
        this.refresh();
    };

    /**
     * ショップモードを設定する。
     * ショップモードにより、表示価格だとかOK判定が変わるため、
     * 外部から設定するようにした。
     * @param {Number} ショップモード。
     */
    Window_BsItemList.prototype.setShopMode = function(mode) {
        if (this._mode !== mode) {
            this._mode = mode;
            this.refresh();
        }
    };

    /**
     * ウィンドウ幅を取得する。
     * @return {Number} ウィンドウ幅
     */
    Window_BsItemList.prototype.windowWidth = function() {
        return 456;
    };

    /**
     * アイテム数を得る。
     * @return {Number} アイテム数
     */
    Window_BsItemList.prototype.maxItems = function() {
        return this._items ? this._items.length : 1;
    };

    /**
     * 選択されているアイテムを得る。
     * @return {Data_Item} アイテム
     */
    Window_BsItemList.prototype.item = function() {
        return this._items[this.index()];
    };

    /**
     * 所持金を設定する。
     * @param {Number} money 所持金
     */
    Window_BsItemList.prototype.setMoney = function(money) {
        this._money = money;
        this.refresh();
    }

    /**
     * 現在選択している項目が選択可能かどうかを判定して返す。
     * @return {Boolean} 選択可能な場合にはtrue, 選択できない場合にはfalse
     */
    Window_BsItemList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this._items[this.index()]);
    };

    /**
     * itemで指定される項目が有効かどうかを判定して返す。
     * @param {Data_Item} アイテム
     * @return {Boolean} 有効な場合にはtrue, 無効な場合にはfalse
     */
    Window_BsItemList.prototype.isEnabled = function(item) {
        if (item) {
            if (this._mode === TWLD.BS.SHOP_MODE_BOOST) {
                return (this.price(item) <= this._money)
                        && this.isBoostable(item);
            } else if (this._mode === TWLD.BS.SHOP_MODE_RESET_BOOST) {
                return (this.price(item) <= this._money)
                        && (item.boostCount )
            } else {
                return this.price(item) <= this._money;
            }
        }
        return false;
    };

    /**
     * ブースト可能かどうかを判定する。
     * @param {Data_Item} アイテム
     * @return {Boolean} ブースト可能な場合にはtrue, それ以外はfalse
     */
    Window_BsItemList.prototype.isBoostable = function(item) {
        var nextBoostCount = (item.boostCount || 0) + 1;
        return (nextBoostCount <= this._maxBoostCount);
    };

    /**
     * itemで指定されるアイテムの価格を得る。
     * @param {Data_Item} item アイテム
     * @return {Number} 価格が返る。
     */
    Window_BsItemList.prototype.price = function(item) {
        switch (this._mode) {
            case TWLD.BS.SHOP_MODE_RESET_BOOST:
                return TWLD.BS.getBoostResetPrice(item);
            case TWLD.BS.SHOP_MODE_REINITIALIZE:
                return TWLD.BS.getResetPrice(item);
            case TWLD.BS.SHOP_MODE_BOOST:
            default:
                return TWLD.BS.getBoostPrice(item);
        }
    };

    /**
     * 更新する。
     */
    Window_BsItemList.prototype.refresh = function() {
        this.createContents();
        this.drawAllItems();
    };

    /**
     * indexで指定される項目を描画する。
     * @param {Number} index インデックス
     */
    Window_BsItemList.prototype.drawItem = function(index) {
        var item = this._items[index];
        if (!item) {
            return;
        }

        var rect = this.itemRect(index);
        var rateWidth = 56;
        var priceWidth = 96;
        rect.width -= this.textPadding();
        var x = rect.x;
        var nameWidth = rect.width - priceWidth - rateWidth;
        
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, nameWidth);
        this.resetTextColor();
        if ((this._mode === TWLD.BS.SHOP_MODE_BOOST)
                && !this.isBoostable(item)) {
            this.drawText('技量不足', x + nameWidth, rect.y, rateWidth + priceWidth, 'right');
        } else {
            var rateStr;
            if (this._mode === TWLD.BS.SHOP_MODE_BOOST) {
                rateStr = Math.floor(TWLD.BS.getBoostRate(item, this._smithLevel, null, 1) * 100) + '%';
            } else {
                rateStr = '100%'; // 強化リセット、やりなおしは100%成功する。
            }
            this.drawText(rateStr, x + nameWidth, rect.y, rateWidth, 'right');
            this.drawText(this.price(item), x + nameWidth + rateWidth, rect.y, priceWidth, 'right');
        }
        this.changePaintOpacity(true);
    };

    //---------------------------------------------------------------------
    // Window_BsCatalystList
    //
    //
    /**
     * Window_BsCatalystList
     * 強化に使用する触媒アイテムを洗濯するウィンドウ。
     */
    function Window_BsCatalystList() {
        this.initialize.apply(this, arguments);
    }

    Window_BsCatalystList.prototype = Object.create(Window_Selectable.prototype);
    Window_BsCatalystList.prototype.constructor = Window_BsCatalystList;

    /**
     * Window_BsCatalystListを初期化する。
     */
    Window_BsCatalystList.prototype.initialize = function(x, y, width, height) {
        this._targetItem = null; // 強化対象のアイテム
        this._data = [];
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    };

    /**
     * ターゲットアイテムを設定する。
     * @param {Data_Item} item 強化対象のアイテム
     */
    Window_BsCatalystList.prototype.setTargetItem = function(item) {
        if (this._targetItem !== item) {
            this._targetItem = item;
            this.refresh();
        }
    };

    /**
     * 最大カラム数を取得する。
     * @return {Number} カラム数
     */
    Window_BsCatalystList.prototype.maxCols = function() {
        return 1;
    };

    /**
     * 最大項目数を取得する。
     * @return {Number} 最大項目数
     */
    Window_BsCatalystList.prototype.maxItems = function() {
        return this._data ? this._data.length : 1;
    };

    /**
     * 現在選択されているアイテムを取得する。
     * @return {Data_Item} 触媒アイテム。
     */
    Window_BsCatalystList.prototype.item = function() {
        var index = this.index();
        return this._data && (index >= 0) ? this._data[index] : null;
    };

    /**
     * 現在選択している項目が選択可能かどうかを判定する。
     * @return {Boolean} 現在選択している項目が選択可能な場合にはtrue。
     */
    Window_BsCatalystList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.item());
    };

    /**
     * itemで指定される項目が適用可能かどうかを判定する。
     * @param {Data_Item} item 対象のアイテム
     * @return {Boolean} 適用可能な場合にはtrue, それ以外はfalse
     */
    Window_BsCatalystList.prototype.isEnabled = function(item) {
        if (!item) {
            return false;
        }
        if (item.boostCondition) {
            // eslint-disable-next-line no-unused-vars
            var isWeapon = DataManager.isWeapon(item);
            // eslint-disable-next-line no-unused-vars
            var isArmor = DataManager.isArmor(item);
            return eval(item.boostCondition) || false;
        } else {
            return true; // 条件ないなら全て可
        }
    };

    /**
     * 触媒アイテムリストを構築する。
     */
    Window_BsCatalystList.prototype.makeItemList = function() {
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
     * @param {Number} index 項目インデックス
     */
    Window_BsCatalystList.prototype.drawItem = function(index) {
        var item = this._data[index];
        if (item) {
            var numberWidth = this.textWidth('000');
            var rect = this.itemRect(index);
            rect.width -= this.textPadding(); // たぶん全部使おうとするとあふれる。
            this.changePaintOpacity(this.isEnabled(item));
            var nameWidth = rect.width - numberWidth;
            this.drawItemName(item, rect.x, rect.y, nameWidth);
            this.resetTextColor();
            this.drawItemNumber(item, rect.x + nameWidth, rect.y, numberWidth);
            this.changePaintOpacity(true);
        }
    };

    /**
     * アイテムの数量を描画する。
     * @param {Data_Item} アイテム
     * @param {Number} x 描画x位置
     * @param {Number} y 描画y位置
     * @param {Number} 描画幅
     */
    Window_BsCatalystList.prototype.drawItemNumber = function(item, x, y, width) {
        var itemCount = $gameParty.numItems(item);
        this.drawText(itemCount, x, y, width, 'right');
    };

    /**
     * 更新する。
     */
    Window_BsCatalystList.prototype.refresh = function() {
        this.createContents();
        this.makeItemList();
        this.drawAllItems();
    };

    //---------------------------------------------------------------------
    // Window_BsNumberInput
    // 使用する触媒個数を入力するためのウィンドウ
    //
    function Window_BsNumberInput() {
        this.initialize.apply(this, arguments);
    }

    Window_BsNumberInput.prototype = Object.create(Window_Selectable.prototype);
    Window_BsNumberInput.prototype.constructor = Window_BsNumberInput;

    Window_BsNumberInput.prototype.initialize = function(x, y) {
        var width = 120;
        var height = 72;
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._number = 1;
        this._maxNumber = 1;
        //this.openness = 0;
        this.createButtons();
    };

    /**
     * ボタンを作成する。
     */
    Window_BsNumberInput.prototype.createButtons = function() {
        var bitmap = ImageManager.loadSystem('ButtonSet');
        var buttonWidth = 48;
        var buttonHeight = 48;
        this._buttons = [];
        for (var i = 0; i < 3; i++) {
            var button = new Sprite_Button();
            var x = buttonWidth * [1, 2, 4][i];
            var w = buttonWidth * (i === 2 ? 2 : 1);
            button.bitmap = bitmap;
            button.setColdFrame(x, 0, w, buttonHeight);
            button.setHotFrame(x, buttonHeight, w, buttonHeight);
            button.visible = false;
            this._buttons.push(button);
            this.addChild(button);
        }
        this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
        this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
        this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
    };

    /**
     * 最大値を設定する。
     * @param {Number} number 数値
     */
    Window_BsNumberInput.prototype.setMaximum = function(number) {
        this._maxNumber = number;
        if (this._number >= this._maxNumber) {
            this._number = this._maxNumber;
        }
        this.refresh();
    };

    /**
     * 現在の数量を設定する。
     * @param {Number} num 数量
     */
    Window_BsNumberInput.prototype.setNumber = function(num) {
        this._number = num.clamp(1, this._maxNumber);
        this.refresh();
    }

    /**
     * 現在値を取得する。
     * @return {Number} 現在値
     */
    Window_BsNumberInput.prototype.number = function() {
        return this._number;
    };

    /**
     * 数値入力ウィンドウをアクティブ化して入力を開始する。
     */
    Window_BsNumberInput.prototype.start = function() {
        this._number = this._number.clamp(1, this._maxNumber);
        this.placeButtons();
        this.updateButtonsVisibility();
        this.createContents();
        this.refresh();
        this.show();
        this.activate();
        this.select(1);
    };



    /**
     * 最大カラム数を取得する。
     * @return {Number} 最大カラム数
     */
    Window_BsNumberInput.prototype.maxCols = function() {
        return 2; // 1～99まで
    };

    /**
     * 最大項目数を取得する。
     * @return {Number} 最大項目数
     */
    Window_BsNumberInput.prototype.maxItems = function() {
        return 2;
    }

    /**
     * 項目の表示間隔を取得する。
     * @return {Number} 表示間隔
     */
    Window_BsNumberInput.prototype.spacing = function() {
        return 0;
    };

    /**
     * 項目の幅を取得する。
     * @retrn {Number} 項目の幅
     */
    Window_BsNumberInput.prototype.itemWidth = function() {
        return 32;
    };

    /**
     * ボタンを配置する。
     */
    Window_BsNumberInput.prototype.placeButtons = function() {
        var numButtons = this._buttons.length;
        var spacing = 16;
        var totalWidth = -spacing;
        for (var i = 0; i < numButtons; i++) {
            totalWidth += this._buttons[i].width + spacing;
        }
        var x = (this.width - totalWidth) / 2;
        for (var j = 0; j < numButtons; j++) {
            var button = this._buttons[j];
            button.x = x;
            button.y = this.height + 8;
            x += button.width + spacing;
        }
    };

    /**
     * ボタン表示を適用する。
     * タッチ操作されてたらボタン表示、キーボードなどの操作をうけてたらボタン消去。
     */
    Window_BsNumberInput.prototype.updateButtonsVisibility = function() {
        this.setButtonsVisible((TouchInput.date > Input.date));
    };

    /**
     * ボタン可視状態を設定する。
     * @param {Boolean} isVisible 表示させる場合にはtrue, 隠す場合にはfalse
     */
    Window_BsNumberInput.prototype.setButtonsVisible = function(isVisible) {
        for (var i = 0; i < this._buttons.length; i++) {
            this._buttons[i].visible = isVisible;
        }
    };

    /**
     * 更新処理を行う。
     */
    Window_BsNumberInput.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.processDigitChange();
    };

    /**
     * 数値入力処理を更新する。
     */
    Window_BsNumberInput.prototype.processDigitChange = function() {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated('up')) {
                this.changeDigit(true);
            } else if (Input.isRepeated('down')) {
                this.changeDigit(false);
            }
        }
    };

    /**
     * 数値入力を更新する。
     * @param {Boolean} isUp 加算操作ならtrue, 減算操作ならfalse
     */
    Window_BsNumberInput.prototype.changeDigit = function(isUp) {
        var oldValue = this._number;
        var index = this.index();
        var baseCount = Math.pow(10, this.maxCols() - index - 1);
        var newNumber = (isUp) ? (this._number + baseCount) : (this._number - baseCount);
        this._number = newNumber.clamp(1, this._maxNumber);
        this.refresh();
        SoundManager.playCursor();
        if (oldValue !== this._number) {
            this.callHandler('itemchange');
        }
    };

    /**
     * タッチによるOKが有効かどうかを判定する。
     * @return {Number} 有効な場合にはtrue, それ以外はfalse
     */
    Window_BsNumberInput.prototype.isTouchOkEnabled = function() {
        return false;
    };

    /**
     * キャンセル操作が有効かどうかを判定する。
     * @return {Boolean} キャンセル操作が有効な場合にはtrue, それ以外はfalse
     */
    Window_BsNumberInput.prototype.isCancelEnabled = function() {
        return true;
    };

    /**
     * OK操作がトリガーされているかどうかを判定する。
     * @return {Boolean} OK操作されている場合。
     */
    Window_BsNumberInput.prototype.isOkTriggered = function() {
        return Input.isTriggered('ok');
    };

    /**
     * 項目を描画する。
     * @param {Number} index インデックス
     */
    Window_BsNumberInput.prototype.drawItem = function(index) {
        var rect = this.itemRect(index);
        var align = 'center';
        var s = this._number.padZero(this.maxCols());
        var c = s.slice(index, index + 1);
        this.resetTextColor();
        this.drawText(c, rect.x, rect.y, rect.width, align);
    };

    /**
     * Upボタンがクリックされた時の処理を行う。
     */
    Window_BsNumberInput.prototype.onButtonUp = function() {
        this.changeDigit(true);
    };

    /**
     * Downボタンがクリックされた時の処理を行う。
     */
    Window_BsNumberInput.prototype.onButtonDown = function() {
        this.changeDigit(false);
    };

    /**
     * OKボタンがクリックされた時の処理を行う。
     */
    Window_BsNumberInput.prototype.onButtonOk = function() {
        this.processOk();
        this.setButtonsVisible(false);
    }

    //---------------------------------------------------------------------
    // Window_BsSelectedItem
    // 選択されているアイテムと触媒を表示するウィンドウ。
    // 個数とか強化レートを出す。
    function Window_BsSelectedItem() {
        this.initialize.apply(this, arguments);
    }

    Window_BsSelectedItem.prototype = Object.create(Window_Base.prototype);
    Window_BsSelectedItem.prototype.constructor = Window_BsSelectedItem;

    Window_BsSelectedItem.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(x, y, width, height);
        this._targetItem = null;
        this._catalystItem = null;
        this._catalystItemCount = 1;
        this._smithLevel = 5;
    };

    /**
     * 鍛冶屋レベルを設定する。
     * @param {Number} level 鍛冶屋レベル
     */
    Window_BsSelectedItem.prototype.setSmithLevel = function(level) {
        this._smithLevel = level;
        this.refresh();
    }

    Window_BsSelectedItem.prototype.setTargetItem = function(item) {
        this._targetItem = item;
        this.refresh();
    };

    /**
     * 触媒アイテムと数量を設定する。
     * @param {Data_Item} item 触媒アイテム
     * @param {Number} count 数量
     */
    Window_BsSelectedItem.prototype.setCatalystItem = function(item, count) {
        this._catalystItem = item;
        this._catalystItemCount = count;
        this.refresh();
    };

    /**
     * 表示を更新する。
     */
    Window_BsSelectedItem.prototype.refresh = function() {
        this.contents.clear();
        var x = this.textPadding();
        var y = 0;
        var lineHeight = this.lineHeight();
        var contentsWidth = this.contentsWidth();

        // 1行目 強化アイテム
        this.changeTextColor(this.systemColor());
        this.drawText('強化アイテム', x, y, 120);
        this.drawText(':', x + 120, y, 20);
        if (this._targetItem) {
            this.resetTextColor();
            this.drawItemName(this._targetItem, x + 140, y, contentsWidth - 140);
        }
        y += lineHeight;

        // 2行目触媒
        this.changeTextColor(this.systemColor());
        this.drawText('強化素材', x, y, 120);
        this.drawText(':', x + 120, y, 20);
        if (this._catalystItem) {
            this.resetTextColor();
            this.drawItemName(this._catalystItem, x + 140, y, contentsWidth - 140);
        }
        y += lineHeight;

        // 3行目 成功確率と効果記述
        // 強化素材の詳細はdescriptionでもいいかも。
        this.changeTextColor(this.systemColor());
        this.drawText('成功率', x, y, 120);
        this.drawText(':', x + 120, y, 20);
        if (this._catalystItem) {
            var rate = TWLD.BS.getBoostRate(this._targetItem, this._smithLevel, this._catalystItem, this._catalystItemCount);
            var rateStr = Math.floor(rate * 100) + '%';
            this.resetTextColor();
            this.drawText(rateStr, x + 140, y, contentsWidth - 140);
        }
    };

    //---------------------------------------------------------------------
    // Window_BsConfirm
    // リセット確認用ウィンドウ。確認したいよね。
    function Window_BsConfirm() {
        this.initialize.apply(this, arguments);
    }

    Window_BsConfirm.prototype = Object.create(Window_Selectable.prototype);
    Window_BsConfirm.prototype.constructor = Window_BsConfirm;

    /**
     * Window_BsConfirmを初期化する。
     */
    Window_BsConfirm.prototype.initialize = function(x, y, width, height) {
        this._items = [ '', TextManager.cancel ];
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    };

    /**
     * メッセージを表示する。
     */
    Window_BsConfirm.prototype.setMessage = function(msg) {
        this._items[0] = msg;
        this.refresh();
    };

    /**
     * 最大項目数を取得する。
     * @return {Number} 最大項目数
     */
    Window_BsConfirm.prototype.maxItems = function() {
        return this._items.length;
    };

    /**
     * 項目を描画する。
     * @param {Number} index 描画する項目のインデックス番号
     */
    Window_BsConfirm.prototype.drawItem = function (index) {
        var rect = this.itemRect(index);
        this.resetTextColor();
        this.drawText(this._items[index], rect.x, rect.y, rect.width, 'left');
        this.changeTextColor(this.normalColor());
    };



    //---------------------------------------------------------------------
    // Scene_BlacksmithShop
    //
    function Scene_BlacksmithShop() {
        this.initialize.apply(this, arguments);
        this._mode = TWLD.BS.SHOP_MODE_BOOST;
    }

    Scene_BlacksmithShop.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_BlacksmithShop.prototype.constructor = Scene_BlacksmithShop;

    /**
     * シーンを初期化する。
     */
    Scene_BlacksmithShop.initialize = function() {
        Scene_MenuBase.prototype.initialize.call();
    };

    /**
     * 作成前の準備をする。
     * @param {Number} maxBoost この鍛冶屋が対応できる最大ブースト数
     * @param {Number} smithLevel この鍛冶屋の技能レベル。高いほど成功しやすい。
     * @param {String} clerkFileName  店員の画像として使うファイル名
     */
    Scene_BlacksmithShop.prototype.prepare = function(maxBoost, smithLevel, clerkFileName) {
        this._maxBoost = maxBoost;
        this._smithLevel = smithLevel;
        this._clerkFileName = clerkFileName;
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
     * ヘルプウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createHelpWindow = function() {
        this._helpWindow = new Window_Help(4); // 基本情報、基本加算値, descriptionまで。
        this.addWindow(this._helpWindow);
    };

    /**
     * 所持金表示ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createGoldWindow = function() {
        this._goldWindow = new Window_Gold(0, this._helpWindow.height);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this.addWindow(this._goldWindow);
    };

    /**
     * コマンドウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createCommandWindow = function() {
        var x = this._goldWindow.x;
        var y = this._goldWindow.y + this._goldWindow.height;
        var width = this._goldWindow.x;
        this._commandWindow = new Window_BsShopCommand(x, y, width);
        this._commandWindow.setHandler('boost', this.onCommandBoost.bind(this));
        this._commandWindow.setHandler('reset-boost', this.onCommandResetBoost.bind(this));
        this._commandWindow.setHandler('reinitialize', this.onCommandReinitialize.bind(this));
        this._commandWindow.setHandler('cancel', this.onCommandCancel.bind(this));
        this.addWindow(this._commandWindow);
    };

    /**
     * 強化品リストウィンドウを開く。
     */
    Scene_BlacksmithShop.prototype.createItemWindow = function() {
        // アイテム一覧を作るぜ。
        this.makeBoostableItemList();
        var y = this._helpWindow.height;
        var height = Graphics.boxHeight - y;
        this._itemWindow = new Window_BsItemList(0, y, height, this._items);
        this._itemWindow.setMaxBoostCount(this._maxBoost);
        this._itemWindow.setSmithLevel(this._smithLevel);
        this._itemWindow.hide();
        this._itemWindow.setHandler('ok', this.onItemWindowOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemWindowCancel.bind(this));
        this._itemWindow.setHandler('itemchange', this.onItemWindowItemChange.bind(this));
        this.addWindow(this._itemWindow);
    };

    /**
     * 触媒選択ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createCatalystWindow = function() {
        var x = this._itemWindow.x + this._itemWindow.width;
        var y = this._helpWindow.height;
        var width = Graphics.boxWidth - x - this._goldWindow.width;
        var height = Graphics.boxHeight - y;
        this._catalystWindow = new Window_BsCatalystList(x, y, width, height);
        this._catalystWindow.setHandler('ok', this.onCatalystOk.bind(this));
        this._catalystWindow.setHandler('cancel', this.onCatalystCancel.bind(this));
        this._catalystWindow.setHandler('itemchange', this.onCatalystItemChange.bind(this));
        this._catalystWindow.hide();
        this.addWindow(this._catalystWindow);
    };

    Scene_BlacksmithShop.prototype.createConfirmWindow = function() {
        var width = 480;
        var height = 120;
        var x = (Graphics.boxWidth - width) / 2;
        var y = (Graphics.boxHeight - height) / 2;
        this._confirmWindow = new Window_BsConfirm(x, y, width, height);
        this._confirmWindow.setHandler('ok', this.onConfirmOk.bind(this));
        this._confirmWindow.setHandler('cancel', this.onConfirmCancel.bind(this));
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        this.addWindow(this._confirmWindow);
    };

    /**
     * 強化アイテムと素材表示ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createSelectedItemWindow = function() {
        var width = 480;
        var height = 140; // 3行表示するくらい。
        var x = (Graphics.boxWidth - width) / 2;
        var y = 200;
        this._selectedItemWindow = new Window_BsSelectedItem(x, y, width, height);
        this._selectedItemWindow.setSmithLevel(this._smithLevel);
        this._selectedItemWindow.hide();
        this.addWindow(this._selectedItemWindow);
    };

    /**
     * 数量入力ウィンドウを作成する。
     */
    Scene_BlacksmithShop.prototype.createNumberInputWindow = function() {
        var x = this._selectedItemWindow.x;
        var y = this._selectedItemWindow.y + this._selectedItemWindow.height;
        this._numberInputWindow = new Window_BsNumberInput(x, y);
        this._numberInputWindow.hide();
        this._numberInputWindow.setHandler('ok', this.onNumberInputOk.bind(this));
        this._numberInputWindow.setHandler('cancel', this.onNumberInputCancel.bind(this));
        this._numberInputWindow.setHandler('itemchange', this.onNumberInputItemChange.bind(this));
        this.addWindow(this._numberInputWindow);
    };

    /**
     * アニメーション表示用のターゲットを作成する。
     * これでいいのか分からんけどやってみよう。
     */
    Scene_BlacksmithShop.prototype.createAnimationTarget = function() {
        this._animationTarget = new Sprite_Base();
        this._animationTarget.x = Graphics.boxWidth / 2;
        this._animationTarget.y = Graphics.boxHeight / 2;
        this.addChild(this._animationTarget);
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
        console.log('clerk bitmap loaded.');
        this._clerkSprite = new Sprite();
        this._clerkSprite.bitmap = this._clerkBitmap;
        this._clerkSprite.x = Graphics.boxWidth - this._clerkBitmap.width;
        this._clerkSprite.y = Graphics.boxHeight - this._clerkBitmap.height;
        this._backgroundSprite.addChild(this._clerkSprite);
    };

    /**
     * 強化対象のアイテム一覧を作成する。
     * この鍛冶屋レベルによってフィルタはしない。
     * (鍛冶屋レベルが足りないやつは、リストに表示して技量不足、と表示させる)
     */
    Scene_BlacksmithShop.prototype.makeBoostableItemList = function() {
        this._items = [];
        $gameParty.weapons().forEach(function(weapon) {
            if (TWLD.BS.isBoostableItem(weapon)) {
                this._items.push(weapon);
            }
        }, this);
        $gameParty.armors().forEach(function(armor) {
            if (TWLD.BS.isBoostableItem(armor)) {
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
        // コマンドウィンドウをアクティブ化
        this._helpWindow.show();
        this._commandWindow.show();
        this._commandWindow.activate();
    };

    /**
     * コマンドウィンドウで強化が選択されたときに通知を受け取る。
     */
    Scene_BlacksmithShop.prototype.onCommandBoost = function() {
        this._mode = TWLD.BS.SHOP_MODE_BOOST;
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
        this._mode = TWLD.BS.SHOP_MODE_RESET_BOOST;
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
        this._mode = TWLD.BS.SHOP_MODE_REINITIALIZE;
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
        var item = this._itemWindow.item();
        switch (this._mode) {
            case TWLD.BS.SHOP_MODE_BOOST:
                // 強化時
                this._itemWindow.deactivate();
                this._catalystWindow.setTargetItem(this._itemWindow.item());
                this._catalystWindow.select(0);
                this._helpWindow.setItem(this._catalystWindow.item());
                this._catalystWindow.show();
                this._catalystWindow.activate();
                break;
            case TWLD.BS.SHOP_MODE_RESET_BOOST:
                // 確認してOKなら強化リセット
                this._confirmWindow.setMessage(item.name + 'の強化リセットを行う');
                this._confirmWindow.deselect(); // 未選択状態にする。
                this._confirmWindow.activate();
                this._confirmWindow.show();
                break;
            case TWLD.BS.SHOP_MODE_REINITIALIZE:
                // 確認してOKなら打ち直し。
                this._confirmWindow.setMessage(item.name + 'の打ち直し行う');
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
        var catalystItem = this._catalystWindow.item();
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
        var item = this._itemWindow.item();
        var price = this._itemWindow.price(item);

        // シャリーン
        SoundManager.playShop();
        $gameParty.loseGold(price);

        // アニメーション再生 アニメーション待ちって無かったはず。
        if (this._mode === TWLD.BS.SHOP_MODE_RESET_BOOST) {
            this.startAnimation(TWLD.BS.ResetBoostAnimationId);
            ItemManager.resetBoost(item); // 強化
        } else if (this._mode === TWLD.BS.SHOP_MODE_REINITIALIZE) {
            this.startAnimation(TWLD.BS.ReinitializeAnimationId);
            ItemManager.resetBoost(item); // 強化リセット
            var baseItem = DataManager.getBaseItem(item);
            ItemManager.randomizeInitialStats(baseItem, item);
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
        var animation = $dataAnimations[animationId];
        this._animationTarget.startAnimation(animation, false, 0);
    };

    /**
     * シーンがビジーかどうかを判定して返す。
     * @return {Boolean} ビジーの場合にはtrue,それ以外はfalse
     */
    Scene_BlacksmithShop.prototype.isBusy = function() {
        return this._animationTarget.isAnimationPlaying()
                || Scene_MenuBase.prototype.isBusy();
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
        var targetItem = this._itemWindow.item();
        var catalystItem = this._catalystWindow.item();
        var smithLevel = this._smithLevel;
        var itemCount = this._numberInputWindow.number();
        var price = TWLD.BS.getBoostPrice(targetItem);
        var rate = TWLD.BS.getBoostRate(targetItem, smithLevel, catalystItem, itemCount);

        // シャリーン
        $gameParty.loseGold(price);
        $gameParty.loseItem(catalystItem, itemCount);
        var success = Math.random() <= rate;
        if (success) {
            this.startAnimation(TWLD.BS.BoostSuccessAnimationId);
            ItemManager.boostItem(targetItem, catalystItem);
        } else {
            this.startAnimation(TWLD.BS.BoostFailureAnimationId);
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


    //---------------------------------------------------------------------
    // プラグインコマンドの実装 
    //
    TWLD.BS.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

    /**
     * プラグインコマンドを処理する。
     * @param {String} command
     * @param {Array<String>} 引数。プラグインコマンド呼び出し時、
     *                        スペース区切りか何かで渡されたものが入ってる。
     */
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        var re = command.match(/^TWLD\.Blacksmith\.(.*)/);
        if (re !== null) {
            switch (re[1]) {
                case 'OpenShop':
                    var maxBoost = Number(args[0]) || 10;
                    var smithLevel = Number(args[1]) || 5;
                    var clerkFileName = args[2] || '';
                    SceneManager.push(Scene_BlacksmithShop);
                    SceneManager.prepareNextScene(maxBoost, smithLevel, clerkFileName);
                    break;
            }
        } else {
            TWLD.BS.Game_Interpreter_pluginCommand.call(this, command, args);
        }
    };



})();