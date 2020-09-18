/*:ja
 * @target MZ 
 * @plugindesc 属性攻撃時のダメージ量を割合で増加させる特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_ElementCore
 * @orderAfter Kapu_ElementCore
 * 
 * @param TraitCode
 * @text 特性コード
 * @desc 特性として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 101
 * @type number
 * @max 999
 * @min 65
 * 
 * @help 
 * 属性攻撃時のダメージ量を割合で増加させる特性を追加する。
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
 *     <elementAttackRate:id#:data,...>
 *        吸収特性設定。dataの記述書式は次の通り。
 *        id#:rate# もしくは id#:rate%
 *        id#:属性ID
 *        rate#:加算ダメージレート(0～, 1.0で変化なし)
 *        rate%:加算ダメージレート(0～, 1.0で変化なし)
 *        複数吸収設定はカンマ区切りにします。
 * 
 *     例：
 *        <elementAttackRate:1:20%,3:100%>
 *          属性ID 1 の攻撃を受けたときは20%吸収。 属性ID 3 を受けたときは100%吸収。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 思いついたので追加した。
 */
(() => {
    const pluginName = "Kapu_Trait_AttackElementRate";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_ELEMENT_ATTACK_RATE = Number(parameters['TraitCode']) || 0;

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
     * elementAbsorb ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processElementAttackRateNoteTag = function(obj) {
        if (!obj.meta.elementAttackRate) {
            return;
        }
        const valueStr = obj.meta.elementAttackRate;
        const entries = valueStr.split(',');
        for (entry of entries) {
            const tokens = entry.split(':');
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

    DataManager.addNotetagParserActors(_processElementAttackRateNoteTag);
    DataManager.addNotetagParserClasses(_processElementAttackRateNoteTag);
    DataManager.addNotetagParserWeapons(_processElementAttackRateNoteTag);
    DataManager.addNotetagParserArmors(_processElementAttackRateNoteTag);
    DataManager.addNotetagParserStates(_processElementAttackRateNoteTag);
    DataManager.addNotetagParserEnemies(_processElementAttackRateNoteTag);

    //------------------------------------------------------------------------------
    // Game_BattlerBase
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