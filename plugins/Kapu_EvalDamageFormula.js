/*:ja
 * @target MZ 
 * @plugindesc スキル使用前HP/MP/TP適用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @help 
 * ダメージ計算に、スキル使用前のHP/MP/TPを使用可能にするプラグイン。
 * スキル/アイテムのダメージ計算式にて、
 *     justHp, justMp, justTp
 * を使用可能にします。
 * ベーシックシステムでは、スキル計算式適用時の hp, mp, tpは、
 * スキルコストを消費した後の値が格納されています。
 * そのため、MP全消費＆使用時のMP残量に合わせて威力を増大させたい、という場合に、
 * 正しい計算ができません。
 * 本プラグインを導入すると、justMpを使用してスキル発動時のMPを参照できます。
 * 
 * ■ 使用時の注意
 * なし
 * 
 * ■ プラグイン開発者向け
 * なし
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
 * Version.0.1.0 新規作成。
 */
(() => {
    // const pluginName = "Kapu_EvalWithImmidiatelyHpMpTp";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
    /**
     * メンバーを初期化する。
     */
    Game_Battler.prototype.initMembers = function() {
        _Game_Battler_initMembers.call(this);
        this._justHp = undefined;
        this._justMp = undefined;
        this._justTp = undefined;
    };

    /**
     * 直前のHPを設定する。
     * 
     * @param {number} hp HP
     */
    Game_Battler.prototype.setJustHp = function(hp) {
        this._justHp = hp;
    };

    /**
     * 直前のMPを設定する。
     * 
     * @param {number} mp MP
     */
    Game_Battler.prototype.setJustMp = function(mp) {
        this._justMp = mp;
    };
    /**
     * 直前のTPを設定する。
     * 
     * @param {number} tp TP
     */
    Game_Battler.prototype.setJustTp = function(tp) {
        this._justTp = tp;
    };

    Object.defineProperties(Game_Battler.prototype, {
        justHp : { configurable:true, get: function() { return this._justHp || this.hp; } },
        justMp : { configurable:true, get: function() { return this._justMp || this.mp; } },
        justTp : { configurable:true, get: function() { return this._justTp || this.tp; } }
    });

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

    const _Game_Action_evalDamageFormula = Game_Action.prototype.evalDamageFormula;
    /**
     * ダメージ計算をする。
     * アクションに設定された計算式が不正な場合、結果は0になる。
     * 
     * @param {Game_BattlerBase} target 対象
     * @returns {number} ダメージ値。
     */
    Game_Action.prototype.evalDamageFormula = function(target) {
        const subject = this.subject();
        subject.setJustHp(this._subjectHp);
        subject.setJustMp(this._subjectMp);
        subject.setJustTp(this._subjectTp);
        return _Game_Action_evalDamageFormula.call(this, target);
    };

})();
