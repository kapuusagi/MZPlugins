/*:ja
 * @target MZ 
 * @plugindesc ダメージリミット特性プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Base_DamageCalculation
 * 
 * @param defaultMaxDamage
 * @text デフォルト最大ダメージ
 * @desc 特性なし時の最大ダメージ
 * @type number
 * @default 9999
 * 
 * @param traitCode
 * @text 特性コード
 * @desc 特性として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @type number
 * @default 103
 * @min 65
 * 
 * @help 
 * 発生するダメージに制限を付け、特性により変更できるようにするプラグインです。
 * 例えば通常の最大ダメージは9999だとしても、特性がにより一時的に99999に
 * 変更したりできます。
 * 
 * ■ 使用時の注意
 * なし
 * 
 * ■ プラグイン開発者向け
 * Game_Action.maxDamage()をオーバーライドします。
 * Game_BattlerBase.TRAIT_DAMAGE_LIMIT を追加します。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具/エネミー/アイテム/スキル
 *     <damageLimit:value#>
 *         ダメージリミットを最大value#にする。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成した。
 */
(() => {
    const pluginName = "Kapu_Trait_DamageLimit";
    const parameters = PluginManager.parameters(pluginName);

    const defaultMaxDamage = Number(parameters["defaultMaxDamage"]) || 9999;
    Game_BattlerBase.TRAIT_DAMAGE_LIMIT = Number(parameters["traitCode"]) || 0;

    if (!Game_BattlerBase.TRAIT_DAMAGE_LIMIT) {
        console.error(pluginName + ":TRAIT_DAMAGE_LIMIT is not valid.");
        return ;
    }
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processNoteTag = function(obj) {
        if (obj.meta.damageLimit) {
            const damageLimit = Number(obj.meta.damageLimit) || 0;
            if (damageLimit > 0) {
                obj.traits.push({ 
                    code: Game_BattlerBase.TRAIT_DAMAGE_LIMIT, 
                    dataId: 0, 
                    value: damageLimit
                });
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
    // Game_BattlerBase
    /**
     * ダメージリミットを得る。
     * 
     * @return {Number} ダメージリミット
     * !!!overwrite!!! Game_BattlerBase.maxDamage()
     */
    Game_BattlerBase.prototype.maxDamage = function() {
        const traits = this.traits(Game_BattlerBase.TRAIT_DAMAGE_LIMIT);
        return traits.reduce((r, trait) => Math.max(trait.value, r), 0);
    };

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * 最大ダメージを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {Number} 最大ダメージ
     * !!!overwrite!!!
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.maxDamage = function(target) {
        const subject = this.subject();
        const item = this.item();
        const subjectMaxDamage = subject.maxDamage();
        if (item.meta.damageLimit) {
            const limit = Number(item.meta.damageLimit) || defaultMaxDamage;
            return Math.max(subjectMaxDamage, limit);
        } else {
            return Math.max(subjectMaxDamage, defaultMaxDamage);
        }
    };

})();