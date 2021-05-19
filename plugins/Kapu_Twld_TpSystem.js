/*:ja
 * @target MZ 
 * @plugindesc Twld向けTP動作変更プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Base_DamageCalculation
 * 
 * 
 * @help 
 * Twld向けに作成した、TPの挙動を変更するプラグイン。
 * 以下のように変更します。
 * ・戦闘開始時のTPはゼロ。
 *   （他のプラグインにより変動したり、TP保留の場合にはそちらに従う。）
 * ・非戦闘中はTPが増加しない。
 * ・ダメージ計算時、TPが対象のTPに対して1高い毎に1%のボーナスが与えられます。
 * ・アクション実行時、TPが対象のTPに対して1高い毎に 0.05%のボーナスが与えられます。
 * ・アクション実行時、TPが対象のTPに対して1低い毎に 0.05%の減算ボーナスがかかります。
 * ・アクション実行時、TPが対象のTPに対して1高い毎に、0.01%クリティカル発生率が上がります。
 * 
 * ■ 使用時の注意
 * Game_Battler.initTpをオーバーライドします。
 * 
 * ■ プラグイン開発者向け
 * 特にありません。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.1 メニューでのアイテム使用時、
 *               増減対象がNaNになって正常に動かなくなる不具合を修正した。
 * Version.0.1.0 TWLD向けに作成した。
 */
(() => {
    //------------------------------------------------------------------------------
    // Game_Battler
    /**
     * TPを初期化する。
     * 既定の実装では、0～25の間の乱数値がセットされる。
     * 
     * !!!overwrite!!! Game_Battler.initTp
     */
    Game_Battler.prototype.initTp = function() {
        this.clearTp();
    };

    const _Game_Battler_gailTp = Game_Battler.prototype.gainTp;

    /**
     * TPを上昇させる。
     * 
     * @param {Number} value 上昇値
     */
    Game_Battler.prototype.gainTp = function(value) {
        if ($gameParty.inBattle()) {
            // 戦闘中のみ変動する。
            _Game_Battler_gailTp.call(this, value);
        }
    };

    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_initialize = Game_Action.prototype.initialize;
    /**
     * Game_Actionを初期化する。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {Boolean} forcing 強制実行
     */
    Game_Action.prototype.initialize = function(subject, forcing) {
        _Game_Action_initialize.call(this, subject, forcing);
        this._subjectTp = ((subject) ? subject.tp : 0) || 0;
    };


    const _Game_Action_prepare = Game_Action.prototype.prepare;
    /**
     * アクションを準備する。
     */
    Game_Action.prototype.prepare = function() {
        _Game_Action_prepare.call(this);
        // Note: TPはapply()毎に変動するため、
        //       実行(startAction)前の値を元に算出しておく。
        this._subjectTp = this.subject().tp;
    };

    /**
     * TPダメージレートを取得する。
     * 
     * @param {Game_Battler} ターゲット
     * @returns {Number} TPダメージレート
     */
    Game_Action.prototype.tpDamageRate = function(target) {
        return 1 + Math.max(0, ((this._subjectTp - target.tp) * 0.01));
    };

    const _Game_Action_multiplyDamageRate = Game_Action.prototype.multiplyDamageRate;
    /**
     * ダメージ量の乗算ボーナスレートを得る。
     * 
     * @param {Game_Battler} target ターゲット。
     * @param {Booelan} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {Number} 乗算ボーナスレート
     */
    Game_Action.prototype.multiplyDamageRate = function(target, critical) {
        const tpDamageRate = this.tpDamageRate(target);
        return _Game_Action_multiplyDamageRate.call(this, target, critical) * tpDamageRate;
    };

    const _Game_Action_itemHit = Game_Action.prototype.itemHit;
    /**
     * 命中率を得る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @returns {Number 命中率。
     */
    Game_Action.prototype.itemHit = function(target) {
        const tpHitRate = ((this._subjectTp - target.tp) * 0.005).clamp(0, 0.5);
        return _Game_Action_itemHit.call(this, target) + tpHitRate;
    };

    const _Game_Action_itemEva = Game_Action.prototype.itemEva;
    /**
     * 回避率を得る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @returns {Number} 回避率。
     */
    Game_Action.prototype.itemEva = function(target) {
        const tpEvaRate = ((target.tp - this._subjectTp) * 0.005).clamp(0, 0.5);
        return _Game_Action_itemEva.call(this, target) + tpEvaRate;
    };


    const _Game_Action_itemCri = Game_Action.prototype.itemCri;
    /**
     * このアクションのクリティカル率を得る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @returns {Number} クリティカル率(0.0～1.0）
     */
    Game_Action.prototype.itemCri = function(target) {
        const tpCriRate = ((this._subjectTp - target.tp) * 0.0025).clamp(0, 0.25);
        return _Game_Action_itemCri.call(this, target) + tpCriRate;
    };
})();