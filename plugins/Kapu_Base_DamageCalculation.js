/*:ja
 * @target MZ 
 * @plugindesc ダメージ計算処理を拡張するためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @param debug
 * @text デバッグ
 * @desc ダメージ計算をデバッグするかどうか。
 * @type boolean
 * @default false
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
 * Game_Action.isElementRateApplicable(target:Game_Battler) : boolean
 * Game_Action.isDamageRateApplicable(target:Game_Battler) : boolean
 * Game_Action.isRecoveryRateApplicable(target:Game_Battler) : boolean
 * Game_Action.isCriticalApplicable(target:Game_Battler) : boolean
 * Game_Action.isVarianceApplicable(target:Game_Battler) : boolean
 * Game_Action.isGuardApplicable(target:Game_Battler) : booolean
 *     それぞれ、属性レート/ダメージレート/リカバリーレート/クリティカル/ばｒつき/ガードを適用するかどうかを判定する。
 *     スキルのダメージ計算で、余計な倍率補正をかけたくない場合にフックする。
 * Game_Action.calcBaseDamageValue(target:Game_Battler) : number
 *     アイテム/スキルを元にダメージ計算する。
 *     evalDamageFormulaは設定された式を元に計算するものなので、
 *     ダメージ基本値を計算する意味合いを明確にするため、用意した。
 *     最低1ダメージ出す、とかいった処理をフックして入れるために使用する。
 * Game_Action.applyDamageRate(value:number, target:Game_Battler) : number
 *     ダメージ倍率の処理を行う。
 *     プラグインで定義されたTraitで、
 *     ダメージ倍率に変更を与えたい場合にフックすることを想定します。
 * Game_Action.additionalSubjectTraits(target:Game_Battler) : Array<Taraits>
 *     ダメージ計算時、使用者に一時的に付与する特性を返す。
 *     使用者に相手の攻撃力を自動で減衰させるような特性を持たせる場合に使用する。
 * Game_Action.additionalTargetTraits(target:Game_Battler, critical:Boolean) : Array<Traits>
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
 * Game_Action.maxDamage(target:Game_Battler) : number
 *      最大ダメージを返す。
 *      既定ではInifinityなので制限なし。
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
 * Version.0.5.0 Game_ActionResultに属性レートを設定するようにした。
 *               属性･倍率・リカバリーレート・クリティカル・ばらつき・ガードの演算を適用するかどうかを
 *               拡張できるようにした。
 * Version.0.4.0 デバッグ用にログにデータを出力するようにした。
 *               calcBaseDamageValueメソッドを用意した。
 * Version.0.3.0 最大ダメージをmaxDamageメソッドで制限できるようにした。
 *               おくとらの限界突破みたいなのやりたいかもね。
 * Version.0.2.0 ダメージ計算時、一時的に付与するTraitを設定出来るようにした。
 *               ステート付与という作戦もあるけど、
 *               データベースのリソースを使ったりするのでやめた。
 * Version.0.1.0 ダメージ計算式に関する拡張をするため、コアプラグインを用意した。
 *               コアプラグインは競合しやすいので、あんまりやりたくないけど..。
 */
(() => {
    const pluginName = "Kapu_Base_DamageCalculation";
    const parameters = PluginManager.parameters(pluginName);
    const isDebug = (typeof parameters["debug"] === "undefined")
            ? false : (parameters["debug"] === "true");

    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_allTraits = Game_BattlerBase.prototype.allTraits;
    /**
     * このGame_BattlerBaseの全ての特性(Trait)を取得する。
     * 
     * @returns {Array<Trait>} 特性配列
     */
    Game_Battler.prototype.allTraits = function() {
        let traits = _Game_Battler_allTraits.call(this);
        if (this._tmpUserTraits && (this._tmpUserTraits.length > 0)) {
            traits = traits.concat(this._tmpUserTraits);
        }
        if (this._tmpTargetTraits && (this._tmpTargetTraits.length > 0)) {
            traits = traits.concat(this._tmpTargetTraits);
        }

        return traits;
    };

    /**
     * 使用者一時付与特性を設定する。
     * 
     * @param {Array<Trait>} traits 特性オブジェクト
     */
    Game_Battler.prototype.setTempUserTraits = function(traits) {
        this._tmpUserTraits = traits;
    };

    /**
     * 使用者一時付与特性をクリアする。
     */
    Game_Battler.prototype.clearTempUserTraits = function() {
        delete this._tmpUserTraits;
    };

    /**
     * 対象一時特性を設定する。
     * 
     * @param {Array<Trait>} traits 特性オブジェクト
     */
    Game_Battler.prototype.setTempTargetTraits = function(traits) {
        this._tmpTargetTraits = traits;
    };

    /**
     * 対象一時特性をクリアする。
     */
    Game_Battler.prototype.clearTempTargetTraits = function() {
        delete this._tmpTargetTraits;
    };

    const _Game_Battler_onButtleEnd = Game_Battler.prototype.onBattleEnd
    /**
     * 戦闘終了時の処理を行う。
     */
    Game_Battler.prototype.onBattleEnd = function() {
        _Game_Battler_onButtleEnd.call(this);
        this.clearTempUserTraits();
        this.clearTempTargetTraits();
    };

    /**
     * ダメージ計算時、相手に一時的に付与する特性を得る。
     * 
     * @returns {Array<Trait>} 一時的に付与する特性の配列
     */
    Game_Battler.prototype.additionalTargetTraits = function() {
        return [];
    };
    //------------------------------------------------------------------------------
    // Game_ActionResult
    const _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    /**
     * Game_ActionResultをリセットする。
     */
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear.call(this);
        this.elementRate = 1.0;
    };
    //------------------------------------------------------------------------------
    // Game_Action
    if (isDebug) {
        /**
         * ダメージ値を計算する。
         * 
         * @param {Game_BattlerBase} target 対象
         * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
         * @returns {number} ダメージ値
         * !!!overwrite!!! Game_Action.makeDamageValue
         */
        Game_Action.prototype.makeDamageValue = function(target, critical) {
            const result = target.result();

            const subjectAddtionalTraits = this.additionalSubjectTraits(target);
            const targetAdditionalTraits = this.additionalTargetTraits(target, critical);
            this.subject().setTempUserTraits(subjectAddtionalTraits);
            target.setTempTargetTraits(targetAdditionalTraits);

            const item = this.item();
            const baseValue = this.calcBaseDamageValue(target);
            let value = baseValue;
            console.log(this.subject().name() + " --(" + item.name + ")--> " + target.name());
            console.log("  eval:" + item.damage.formula + "=" + baseValue);
            if (this.isElementRateApplicable(target)) {
                value = value * elementRate;
                const elementRate = this.calcElementRate(target);
                result.elementRate = elementRate;
                    console.log("  elementRate:" + elementRate);
            } else {
                result.elementRate = 1;
            }

            if (this.isDamageRateApplicable(target)) {
                value = this.applyDamageRate(value, target, critical);
                console.log("  -> applyDamageRate() = " + value);
            }

            if (this.isRecoveryRateApplicable(target)) {
                value = this.applyRecoveryRate(value, target);
                console.log("  -> applyRecoveryRate() = " + value);
            }
            if (critical && this.isCriticalApplicable(target)) {
                value = this.applyCritical(value);
                console.log("  -> applyCritical() = " + value);
            }
            if (this.isVarianceApplicable(target)) {
                value = this.applyVariance(value, item.damage.variance);
                console.log("  -> applyVariance() = " + value);
            }
            if (this.isGuardApplicable(target)) {
                value = this.applyGuard(value, target);
                console.log("  -> applyGuard() = " + value);
            }
            value = Math.round(value);

            target.clearTempTargetTraits();
            this.subject().clearTempUserTraits();
            const maxDamage = this.maxDamage(target);
            const clampedValue = value.clamp(-maxDamage, maxDamage)
            console.log("  -> result = " + clampedValue);
            return clampedValue;
        };
    } else {
        /**
         * ダメージ値を計算する。
         * 
         * @param {Game_BattlerBase} target 対象
         * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
         * @returns {number} ダメージ値
         * !!!overwrite!!! Game_Action.makeDamageValue
         */
        Game_Action.prototype.makeDamageValue = function(target, critical) {
            const result = target.result();
            const subjectAddtionalTraits = this.additionalSubjectTraits(target);
            const targetAdditionalTraits = this.additionalTargetTraits(target, critical);
            this.subject().setTempUserTraits(subjectAddtionalTraits);
            target.setTempTargetTraits(targetAdditionalTraits);

            const item = this.item();
            const baseValue = this.calcBaseDamageValue(target);
            if (this.isElementRateApplicable(target)) {
                const elementRate = this.calcElementRate(target);
                result.elementRate = elementRate;
            } else {
                result.elementRate = 1;
            }
            let value = baseValue * elementRate;
            if (this.isDamageRateApplicable(target)) {
                value = this.applyDamageRate(value, target, critical);
            }
            if (this.isRecoveryRateApplicable(target)) {
                value = this.applyRecoveryRate(value, target);
            }
            if (critical && this.isCriticalApplicable(target)) {
                value = this.applyCritical(value);
            }
            if (this.isVarianceApplicable(target)) {
                value = this.applyVariance(value, item.damage.variance);
            }
            if (this.isGuardApplicable(target)) {
                value = this.applyGuard(value, target);
            }
            value = Math.round(value);

            target.clearTempTargetTraits();
            this.subject().clearTempUserTraits();
            const maxDamage = this.maxDamage(target);
            return value.clamp(-maxDamage, maxDamage)
        };
    }

    /**
     * 属性レートを適用するかどうかを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isElementRateApplicable = function(target) {
        return true;
    };

    /**
     * ダメージレートを適用するかどうかを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isDamageRateApplicable = function(target) {
        return true;
    };
    /**
     * リカバリーレートを適用するかどうかを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isRecoveryRateApplicable = function(target) {
        return true;
    };

    /**
     * クリティカルを適用するかどうかを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isCriticalApplicable = function(target) {
        return true;
    };
    /**
     * ばらつきを適用するかどうかを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isVarianceApplicable = function(target) {
        return true;
    };

    /**
     * ガードを適用するかどうかを得る。
     * 
     * @param {Game_Battler} ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isGuardApplicable = function(target) {
        return true;
    };

    /**
     * ベースとなるダメージ値を計算する。
     * 
     * @param {Game_Battler} target 対象
     */
    Game_Action.prototype.calcBaseDamageValue = function(target) {
        return this.evalDamageFormula(target);
    };


    /**
     * 最大ダメージを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @returns {number} 最大ダメージ
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.maxDamage = function(target) {
        return Infinity;
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
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @param {Array<Trait>} trait 特性オブジェクト配列
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.additionalTargetTraits = function(target, critical) {
        return this.subject().additionalTargetTraits();
    };

    /**
     * 乗算ボーナスを得る。
     * 
     * @param {number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} 乗算ボーナス適用後の値
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
     * @param {number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} MDR適用後の値
     */
    Game_Action.prototype.applyPhysicalDamageRate = function(value, target, critical) {
        return value * Math.max(0, this.itemPdr(target, critical));
    };

    /**
     * 魔法ダメージレートを適用する。
     * 
     * @param {number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} MDR適用後の値
     */
    Game_Action.prototype.applyMagicalDamageRate = function(value, target, critical) {
        return value * Math.max(0, this.itemMdr(target, critical));
    };

    /**
     * ダメージ量の乗算ボーナスレートを得る。
     * (加算・乗算用)
     * 
     * @param {Game_Battler} target ターゲット。
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} 乗算ボーナスレート
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.multiplyDamageRate = function(target, critical) {
        return 1.0;
    };

    /**
     * リカバリレートによる効果を適用する。
     * 
     * @param {number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @returns {number} 乗算ボーナス適用後の値。
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
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} 物理ダメージレート
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.itemPdr = function(target, critical) {
        return target.pdr;
    };

    /**
     * 魔法ダメージレートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} 魔法ダメージレート。(0.0～、等倍は1.0)
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.itemMdr = function(target, critical) {
        return target.mdr;
    };

    /**
     * 回復レートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @returns {number} 回復レート(0.0～、等倍は1.0)
     */
    Game_Action.prototype.itemRec = function(target) {
        return target.rec;
    };

})();
