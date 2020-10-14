/*:ja
 * @target MZ 
 * @plugindesc TWLD命中判定適用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Twld_BasicParams
 * @orderAfter Kapu_Twld_BasicParams
 * @base Kapu_Base_Hit
 * @orderAfter Kapu_Base_Hit
 * 
 * 
 * @help 
 * TWLDの基本パラメータを命中判定に適用するプラグイン。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アイテム/スキル
 *     <longRange>
 *         物理命中判定で、DEXのみを使用する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    //const pluginName = "Kapu_Twld_BasicParams_Hit";
    //const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * ミスしたかどうかを評価する。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} ミスした場合にtrue, それ以外はfalse
     */
    Game_Action.prototype.testMissed = function(target) {
        return false;
    };
    /**
     * 回避したかどうかを評価する。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {Boolean} 回避できた場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testEvaded = function(target) {
        if (this.isPhysical()) {
            return this.testEvaPhysical(target);
        } else if (this.isMagical()) {
            return this.testEvaMagical(target);
        } else {
            return false; // その他は回避されない。
        }
    };

    /**
     * このスキルがロングレンジかどうかを得る。
     * 
     * @return {Boolean} ロングレンジの場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.isLongRangeItem = function() {
        return this.item().meta.longRange;
    };


    /**
     * 物理攻撃時の回避判定を行う。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} 命中した場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testEvaPhysical = function(target) {
        const subject = this.subject();
        let pev = target.eva; // 回避率は純粋に効いてくる
        pev += (1.0 - this.itemHit(target));// 命中率分の補正。1.0超えた分は回避しにくくなる。
        if (this.isLongRangeItem(target) > 1) {
            // 長距離の場合には相手の素早さと使用者の器用さを比較する。
            pev += this.relativeDiffRate(target.agi, subject.dex);
        } else {
            // 接近戦の場合にはDEXとAGIの合計値を比較する。
            pev += this.relativeDiffRate((target.dex + target.agi), (subject.dex + subject.agi));
        }
        return Math.random() <= pev;
    };

    /**
     * 魔法攻撃時の回避判定を行う。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} 命中した場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testEvaMagical = function(target) {
        const subject = this.subject();
        let mev = target.mev; // 魔法回避率は純粋に効いてくる。
        mev += (1.0 - this.itemHit(target)); // 命中率の1.0超えると回避しにくくなる。
        mev += (this.relativeDiffRate(target.men, subject.men) / 2);
        return Math.random() <= mev;
    };

    const _Game_Action_itemCri = Game_Action.prototype.itemCri;

    /** 
     * クリティカル発生率を返す。
     * 
     * @param {Game_Battler} target
     * @return {Number} クリティカル率(0.0～1.0、1.0で100％発生)が返る。
     */
    Game_Action.prototype.itemCri = function(target) {
        const rate = _Game_Action_itemCri.call(this, target);
        if (this.item().damage.critical && this.isPhysical()) {
            // 物理の場合にはDEXが効いてくる。
            // この計算式だと、対象より技量が2倍以上あると確率が100％になってしまうので
            // clampにより加算値が0.0～0.5の範囲に収まるようにする。
            const subject = this.subject();
            const addRate = this.relativeDiffRate(subject.dex, target.dex).clamp(0, 0.5);
            return rate + addRate;
        } else {
            return rate;
        }
    };

    /**
     * 相対的な補正値を得る。
     * 一方の値に対してもう一方の値が大きいほど、補正値が大きくなる。
     * 
     * なかなかえげつない計算式になっていて、
     * ターゲットの値 > (使用者の値x2)
     * だと1.0になる。
     * 逆に
     * (ターゲットの値x2) < 使用者の値)
     * だと-1.0になる。
     * 
     * 例）使用者 25 ターゲット35 -> 補正値 (35 - 25) / 25 = 0.4
     *     使用者 82 ターゲット92 -> 補正値 (92 - 82) / 82 = 0.12
     * 
     * 小さい側の値が大きくなるほど、差分によるレートの差が出にくくなるようにした。
     * あと使用者より2倍速い相手にそう簡単に当てられないでしょ？という考えによる。
     * 
     * @param {Number} targetVal ターゲットの値
     * @param {Number} subjectVal 使用者の値
     * @return {Number} 相対補正値
     */

    Game_Action.prototype.relativeDiffRate = function(targetVal, subjectVal) {
        const diff = targetVal - subjectVal;
        const min = Math.max(1, Math.min(targetVal, subjectVal)); // 1以上の値になるように。ゼロ除算防止
        return (diff / min);
    };



})();