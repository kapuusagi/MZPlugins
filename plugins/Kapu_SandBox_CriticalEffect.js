/*:ja
 * @target MZ
 * @plugindesc クリティカルエフェクトを変更してみるサンプル。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 *
 * @param Critical Animation ID
 * @text クリティカルアニメーションID
 * @desc クリティカル時に追加で再生するアニメーションID(追加できるの？)
 * @type animation
 * @default 0
 * 
 * プラグインコマンドはなし。
 * 
 * @help 
 * クリティカルエフェクトの変更実験
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 初版
 */
(() => {
    const pluginName = "Kapu_SandBox_CriticalEffect";
    const parameters = PluginManager.parameters(pluginName);
    const criticalAnimationId = Number(parameters["Critical Animation ID"]) || 0;

    /**
     * ダメージポップアップ用スプライトをセットアップする。
     * @param {Game_Battler} target ダメージポップアップ対象
     */
    Sprite_Damage.prototype.setup = function (target) {
        const result = target.result();
        this._critical = result.critical;
        if (result.missed || result.evaded) {
            this._colorType = 0;
            this.createMiss();
        } else if (result.hpAffected) {
            this._colorType = result.hpDamage >= 0 ? 0 : 1;
            this.createDigits(result.hpDamage);
        } else if (target.isAlive() && result.mpDamage !== 0) {
            this._colorType = result.mpDamage >= 0 ? 2 : 3;
            this.createDigits(result.mpDamage);
        }
        if (result.critical) {
            this.setupCriticalEffect();
        }
    };

    /**
     * 表示文字サイズを取得する。
     * @returns {number} 文字サイズ
     */
    Sprite_Damage.prototype.fontSize = function () {
        // クリティカル時はフォントサイズを大きくする。
        return $gameSystem.mainFontSize() + ((this._critical) ? 18 : 4);
    };

    /**
     * クリティカルによるスプライトの効果を設定する。
     * 既定の実装ではダメージ表示の色をフラッシュ効果で変えるだけ。
     */
    Sprite_Damage.prototype.setupCriticalEffect = function () {
        this._flashColor = [180, 0, 0, 250]; // R,G,B,Aらしい。
        this._flashDuration = 60;

        // 他、エフェクトを強化したいならば、Sprite_Damageにメソッドを追加して、
        // updateメソッドに実装を追加して処理する。
    };

    const _WIndow_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;

    /**
     * アクション結果を表示する。
     * 
     * BattleManagerの既定の実装では、攻撃アニメーション->判定->結果と処理している。
     * これは反射とかその辺を考慮していると考えられる。
     * クリティカル時に攻撃アニメーション自体を変更しようとしたら、
     * BattleManagerの処理から変更しないといけない。
     * @param {Game_Battler} subject 使用者
     * @param {Game_Battler} target 対象
     */
    Window_BattleLog.prototype.displayActionResults = function (subject, target) {
        const result = target.result();
        if (result.used && result.critical) {
            const criticalAnimation = $dataAnimations[criticalAnimationId];
            if (criticalAnimation) {
                $gameTemp.requestAnimation([target], criticalAnimationId, false);
            }
        }
        _WIndow_BattleLog_displayActionResults.call(this, ...arguments);
    };
})();
