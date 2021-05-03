/*:ja
 * @target MZ 
 * @plugindesc 属性攻撃時のダメージ量を割合で増加させる特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_ElementCore
 * @orderAfter Kapu_ElementCore
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param traitCode
 * @text 特性コード
 * @desc 特性として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 109
 * @type number
 * @max 999
 * @min 65
 * 
 * @param textTraitElementAttackRateUp
 * @text 攻撃時属性ダメージレート増加特性(増加)
 * @desc 攻撃時属性ダメージレート増加特性(増加)。%1に属性名が入る。
 * @type string
 * @default %1属性効果上昇
 * 
 * @param textTraitElementAttackRateDown
 * @text 攻撃時属性ダメージレート増加特性(減少)
 * @desc 攻撃時属性ダメージレート増加特性(減少)。%1に属性名が入る。
 * @type string
 * @default %1属性効果減少
 * 
 * @help 
 * 属性攻撃時のダメージ量を割合で増加させる特性を追加する。
 * ベーシックシステムではターゲットの賊例ダメージレートを操作する特性は存在するが、
 * 使用者の特性として、特定の属性のダメージレートを向上させるものではない。
 * 本特性では使用者の特性として、
 * 例えば「火属性だけダメージが2割増加する」というようなものを追加できるようになる。
 * 
 * 複数の特性を持つ場合は 乗算合計 になる。
 * 
 * 
 * ■ プラグイン開発者向け
 * 新規Trait を使用し、
 * Game_BattlerBase.TRAIT_ELEMENT_ATTACK_RATE を追加します。
 * 値はプラグインパラメータで指定したものになります。
 * 例えば、一時的に火属性のダメージだけ増加させたい、という場合に使用できます。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具/エネミー
 *   <elementAttackRate:id#:data,...>
 *     吸収特性設定。dataの記述書式は次の通り。
 *       id#:rate# もしくは id#:rate%
 *       id#:属性ID
 *       rate#:加算ダメージレート(0～, 1.0で変化なし)
 *       rate%:加算ダメージレート(0～, 1.0で変化なし)
 *     複数吸収設定はカンマ区切りにします。
 * 
 *     例：
 *        <elementAttackRate:1:20%,3:100%>
 *          属性ID 1 の効果は20%の威力になり、属性ID 3 の効果は100%の威力になる。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 Kapu_Base_ParamName に対応。
 * Version.0.1.1 TRAIT_ELEMENT_ATTACK_RATE未指定時は
 *               ログに出力して動作しないように変更した。
 * Version.0.1.0 思いついたので追加した。
 */
(() => {
    const pluginName = "Kapu_Trait_AttackElementRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_ELEMENT_ATTACK_RATE = Number(parameters["traitCode"]) || 0;
    if (!Game_BattlerBase.TRAIT_ELEMENT_ATTACK_RATE) {
        console.error(pluginName + ":TRAIT_ELEMENT_ATTACK_RATE is not valid.");
        return;
    }

    const textTraitElementAttackRateUp = parameters["textTraitElementAttackRateUp"] || "";
    const textTraitElementAttackRateDown = parameters["textTraitElementAttackRateDown"] || "";

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * 割合パラメータを計算する。
     * 
     * @param {String} valueStr 文字列
     */
    const _parseRate = function(valueStr) {
        if (valueStr.slice(-1) === "%") {
            return Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            return Number(valueStr);
        }
    };

    /**
     * ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processNoteTag = function(obj) {
        if (!obj.meta.elementAttackRate) {
            return;
        }
        const valueStr = obj.meta.elementAttackRate;
        const entries = valueStr.split(",");
        for (entry of entries) {
            const tokens = entry.split(":");
            if (tokens.length >= 2) {
                const elementId = Number(tokens[0]);
                const rate = _parseRate(tokens[1].trim());
                if (elementId && rate) {
                    obj.traits.push({ 
                        code:Game_BattlerBase.TRAIT_ELEMENT_ATTACK_RATE, 
                        dataId:elementId, 
                        value:rate
                    });
                }
            }
        }
    };

    DataManager.addNotetagParserActors(_processNoteTag);
    DataManager.addNotetagParserClasses(_processNoteTag);
    DataManager.addNotetagParserWeapons(_processNoteTag);
    DataManager.addNotetagParserArmors(_processNoteTag);
    DataManager.addNotetagParserStates(_processNoteTag);
    DataManager.addNotetagParserEnemies(_processNoteTag);
    //------------------------------------------------------------------------------
    // TextManager
    TextManager.traitElementAttackRate = function(dataId, value) {
        const fmt = (value >= 0) ? textTraitElementAttackRateUp : textTraitElementAttackRateDown;
        const elementName = this.elementName(dataId);
        return ((fmt && elementName) ? fmt.format(elementName) : "");
    };
    if (TextManager._traitConverters) {
        TextManager._traitConverters[Game_BattlerBase.TRAIT_ELEMENT_ATTACK_RATE] = {
            name:TextManager.traitElementAttackRate, value:TextManager.traitValuePi, str:TextManager.traitValueStrRateAbs, baseValue:1
        };
    }

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * 攻撃時補正値を得る。
     * 
     * @param {Number} elementId 属性ID
     * @return {Number} 属性レート
     */
    Game_BattlerBase.prototype.elementAttackRate = function(elementId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_ATTACK_RATE, elementId);
    };

    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_singleElementRate = Game_Action.prototype.singleElementRate;

    /**
     * 対象に対する単一の属性効果を得る。
     * 
     * @param {Game_BattlerBase} target 
     * @param {Number} elementId 属性ID
     * @return {Number} 属性倍率
     */
    Game_Action.prototype.singleElementRate = function(target, elementId) {
        let rate = _Game_Action_singleElementRate.call(this, ...arguments);
        rate *= this.subject().elementAttackRate(elementId);
        return rate;
    };
})();