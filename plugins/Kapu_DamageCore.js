/*:ja
 * @target MZ 
 * @plugindesc ダメージ計算処理を拡張するためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * ダメージ計算処理を拡張するためのプラグイン。
 * ベーシックシステムのメソッドでは、
 * Game_Action.makeDamage()を書き換えなければ実現できない、
 * 2つ以上のプラグインは競合して導入できない。
 * 例） 「使用者によってPDR(物理ダメージレート)を軽減するプラグイン」 と
 *      「回復量に使用者の回復レートを適用するプラグイン」は
 *       いずれもmakeDamageValueを書き換えないといけないので競合する。
 * この問題を解決するため、Game_Action.makeDamage()を分割するプラグインを用意した。
 * 
 * とは言っても、ダメージ計算式はゲームバランスを司るファクターなので、
 * ホントはデザイナーがちゃんと考えないと行けないはず。
 * それぞれのプラグインでホイホイ倍率上げてったらえらいことになる。
 * 
 * 
 * ■ 使用時の注意
 * Game_Action.makeDamgeをオーバーライドするので、
 * 他のダメージ追加系プラグインでオーバーレイドしていた場合には無効です。
 * コアスクリプトがこの辺考慮してくれたら楽だったんだけど。
 * あちこちのプラグインを組み合わせて作ろうとすると、
 * コアプラグインの競合で実現できなかったりとかねぇ...。
 * 
 * ■ プラグイン開発者向け
 * Game_Action.applyDamageRate(value:number, target:Game_Battler) : number
 *     ダメージ倍率の処理を行う。
 *     プラグインで定義されたTraitで、
 *     ダメージ倍率に変更を与えたい場合にフックすることを想定します。
 * Game_Action.prototype.additionalSubjectTraits(target:Game_Battler) : Array<Taraits>
 *     ダメージ計算時、使用者に一時的に付与する特性を返す。
 *     使用者に相手の攻撃力を自動で減衰させるような特性を持たせる場合に使用する。
 * Game_Action.prototype.additionalTargetTraits(target:Game_Battler, critical:Boolean) : Array<Traits>
 *     ダメージ計算時、対象に一時的に付与する特性を返す。
 *     使用者に相手の防御力を自動で減衰させるような特性を持たせる場合に使用する。
 * Game_Action.multiplyDamageRate(target:Game_Battler, critical:Boolean) : number
 *     何かしらのダメージ倍率を乗算するためのフック用メソッド。
 *     例えばウェポンマスタリーによるダメージボーナスがあったとき、
 *     calcElementRateをフックするのはメソッドの意味合いが変わるので
 *     あんまりよろしくないのだ。
 * Game_Action.itemPdr(target:Game_Battler, critical:Boolean) : number
 *     物理ダメージレートを返す。
 *     プラグインで定義されたTraitで、
 *     物理ダメージレートを増減させたい場合にフックすることを想定します。
 * Game_Action.itemMdr(target:Game_Batter, critical:Boolean) : number
 *     魔法ダメージレートを返す。
 *     プラグインで定義されたTraitで、
 *     魔法ダメージレートを増減させたい場合にフックすることを想定します。
 * Game_Action.itemRec(target:Game_Battler) : number
 *     リカバリレートを返す。
 *     プラグインで定義されたTraitで、
 *     リカバリーレートを増減させたい場合にフックすることを想定します。
 * Game_Battler.prototype.additionalTargetTraits() : Array<Trait>
 *     ダメージ計算時、相手に一時的に付与する特性を得る。
 *     貫通効果とか、そのあたりを実現するためのインタフェース。
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
 * Version.0.2.0 ダメージ計算時、一時的に付与するTraitを設定出来るようにした。
 *               ステート付与という作戦もあるけど、
 *               データベースのリソースを使ったりするのでやめた。動作未確認
 * Version.0.1.0 ダメージ計算式に関する拡張をするため、コアプラグインを用意した。
 *               コアプラグインは競合しやすいので、あんまりやりたくないけど..。
 */
(() => {
    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_allTraits = Game_BattlerBase.prototype.allTraits;
    /**
     * このGame_BattlerBaseの全ての特性(Trait)を取得する。
     * 
     * @return {Array<Trait>} 特性配列
     */
    Game_Battler.prototype.allTraits = function() {
        const traits = _Game_Battler_allTraits.call(this);
        if (this._tmpTraits && this._tmpTraits.length > 0) {
            return traits.concat(this._tmpTraits);
        } else {
            return traits;
        }
    };

    /**
     * 一時付与特性を設定する。
     * 
     * @param {Trait} trait 特性オブジェクト
     */
    Game_Battler.prototype.setTempTraits = function(traits) {
        this._tmpTraits = traits;
    };

    /**
     * 一時付与特性をクリアする。
     */
    Game_Battler.prototype.clearTempTraits = function() {
        delete this._tmpTraits;
    };

    const _Game_Battler_onButtleEnd = Game_Battler.prototype.onBattleEnd
    /**
     * 戦闘終了時の処理を行う。
     */
    Game_Battler.prototype.onBattleEnd = function() {
        _Game_Battler_onButtleEnd.call(this);
        this.clearTempTraits();
    };

    /**
     * ダメージ計算時、相手に一時的に付与する特性を得る。
     * 
     * @return {Array<Trait>} 一時的に付与する特性の配列
     */
    Game_Battler.prototype.additionalTargetTraits = function() {
        return [];
    };

    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * ダメージ値を計算する。
     * 
     * @param {Game_BattlerBase} target 対象
     * @param {Boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} ダメージ値
     * !!!overwrite!!! Game_Action.makeDamageValue
     */
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        const subjectAddtionalTraits = this.additionalSubjectTraits(target);
        const targetAdditionalTraits = this.additionalTargetTraits(target, critical);
        this.subject().setTempTraits(subjectAddtionalTraits);
        target.setTempTraits(targetAdditionalTraits);

        const item = this.item();
        const baseValue = this.evalDamageFormula(target);
        let value = baseValue * this.calcElementRate(target);
        value = this.applyDamageRate(value, target, critical);
        value = this.applyRecoveryRate(value, target);
        if (critical) {
            value = this.applyCritical(value);
        }
        value = this.applyVariance(value, item.damage.variance);
        value = this.applyGuard(value, target);
        value = Math.round(value);

        target.clearTempTraits();
        this.subject().clearTempTraits();

        return value;
    };

    /**
     * ダメージ計算時、使用者に追加で付与する特性を取得する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Array<Trait>} trait 特性オブジェクト配列
     */
    Game_Action.prototype.additionalSubjectTraits = function(target) {
        return target.additionalTargetTraits();
    };
    /**
     * ダメージ計算時、対象に追加で付与する特性を取得する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @param {Array<Trait>} trait 特性オブジェクト配列
     */
    Game_Action.prototype.additionalTargetTraits = function(target, critical) {
        return this.subject().additionalTargetTraits();
    };

    /**
     * 乗算ボーナスを得る。
     * 
     * @param {Number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @param {Booelan} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} 乗算ボーナス適用後の値
     */
    Game_Action.prototype.applyDamageRate = function(value, target, critical) {
        if (this.isPhysical()) {
            value = this.applyPhysicalDamageRate(value, target, critical);
        }
        if (this.isMagical()) {
            value = this.applyMagicalDamageRate(value, target, critical);
        }
        return value * this.multiplyDamageRate(target, critical);
    };

    /**
     * 物理ダメージレートを適用する。
     * 
     * @param {Number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @param {Booelan} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} MDR適用後の値
     */
    Game_Action.prototype.applyPhysicalDamageRate = function(value, target, critical) {
        return value * Math.max(0, this.itemPdr(target, critical));
    };

    /**
     * 魔法ダメージレートを適用する。
     * 
     * @param {Number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @param {Booelan} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} MDR適用後の値
     */
    Game_Action.prototype.applyMagicalDamageRate = function(value, target, critical) {
        return value * Math.max(0, this.itemMdr(target, critical));
    };

    /**
     * ダメージ量の乗算ボーナスレートを得る。
     * (加算・乗算用)
     * 
     * @param {Game_Battler} target ターゲット。
     * @param {Booelan} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} 乗算ボーナスレート
     */
    Game_Action.prototype.multiplyDamageRate = function(target, critical) {
        return 1.0;
    };

    /**
     * リカバリレートによる効果を適用する。
     * 
     * @param {Number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @return {Number} 乗算ボーナス適用後の値。
     */
    Game_Action.prototype.applyRecoveryRate = function(value, target) {
        if (value < 0) {
            return value * this.itemRec(target)
        } else {
            return value;
        }
    };

    /**
     * 物理ダメージレートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Booelan} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} 物理ダメージレート
     */
    Game_Action.prototype.itemPdr = function(target, critical) {
        return target.pdr;
    };

    /**
     * 魔法ダメージレートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Booelan} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} 魔法ダメージレート。(0.0～、等倍は1.0)
     */
    Game_Action.prototype.itemMdr = function(target, critical) {
        return target.mdr;
    };

    /**
     * 回復レートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {Number} 回復レート(0.0～、等倍は1.0)
     */
    Game_Action.prototype.itemRec = function(target) {
        return target.rec;
    };

})();