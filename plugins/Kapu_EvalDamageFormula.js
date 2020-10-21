/*:ja
 * @target MZ 
 * @plugindesc スキル使用前HP/MP/TP適用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_EvalImmidiatelyStatus
 * @orderAfter Kapu_EvalImmidiatelyStatus
 * 
 * @help 
 * ダメージ計算に、スキル使用前のHP/MP/TPを使用可能にするプラグイン。
 * スキル/アイテムのダメージ計算式にて、
 *     justHp, justMp, justTp
 * を使用可能にします。
 * 
 * ■ 使用時の注意
 * なし
 * 
 * ■ プラグイン開発者向け
 * Game_Action.evalDamageFormulaをオーバーライドします。
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
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_EvalWithImmidiatelyHpMpTp";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_setSubject = Game_Action.prototype.setSubject;
    /**
     * アクションの実行者を設定する。
     * 
     * @param {Game_Battler} subject 使用者
     */
    Game_Action.prototype.setSubject = function(subject) {
        _Game_Action_setSubject.call(this, subject);
        this._subjectHp = subject.hp;
        this._subjectMp = subject.mp;
        this._subjectTp = subject.tp;
    };
    const _Game_Action_prepare = Game_Action.prototype.prepare;
    /**
     * アクションを準備する。
     */
    Game_Action.prototype.prepare = function() {
        _Game_Action_prepare.call(this);
        const subject = this.subject();
        this._subjectHp = subject.hp;
        this._subjectMp = subject.mp;
        this._subjectTp = subject.tp;
    };

    /**
     * ダメージ計算をする。
     * アクションに設定された計算式が不正な場合、結果は0になる。
     * 
     * @param {Game_BattlerBase} target 対象
     * @return {Number} ダメージ値。
     * !!!overwrite!!! Game_Action.evalDamageFormula
     */
    Game_Action.prototype.evalDamageFormula = function(target) {
        try {
            const item = this.item();
            const a = this.subject(); // eslint-disable-line no-unused-vars
            const b = target; // eslint-disable-line no-unused-vars
            const v = $gameVariables._data; // eslint-disable-line no-unused-vars
            const justHp = this._subjectHp; // eslint-disable-line no-unused-vars
            const justMp = this._subjectMp; // eslint-disable-line no-unused-vars
            const justTp = this._subjectTp; // eslint-disable-line no-unused-vars
            const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
            const value = Math.max(eval(item.damage.formula), 0) * sign;
            return isNaN(value) ? 0 : value;
        } catch (e) {
            return 0;
        }
    };

})();