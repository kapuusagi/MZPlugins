/*:
 * @target MZ
 * @plugindesc クリティカルエフェクトを変更してみるサンプル。
 * @author kapuusagi
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
    /**
     * ダメージポップアップ用スプライトをセットアップする。
     * @param {Game_Battler} target ダメージポップアップ対象
     */
    Sprite_Damage.prototype.setup = function(target) {
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
     * @return {Number} 文字サイズ
     */
    Sprite_Damage.prototype.fontSize = function() {
        // クリティカル時はフォントサイズを大きくする。
        return $gameSystem.mainFontSize() + ((this._critical) ? 18 : 4);
    };

    /**
     * クリティカルによるスプライトの効果を設定する。
     * 既定の実装ではダメージ表示の色をフラッシュ効果で変えるだけ。
     */
    Sprite_Damage.prototype.setupCriticalEffect = function() {
        this._flashColor = [180, 0, 0, 250]; // R,G,B,Aらしい。
        this._flashDuration = 60;

        // 他、エフェクトを強化したいならば、Sprite_Damageにメソッドを追加して、
        // updateメソッドに実装を追加して処理する。
    };

    /*
    Window_BattleLog.prototype.showNormalAnimation = function(
        targets, animationId, mirror
    ) {
        const criticalTargets = 


        const animation = $dataAnimations[animationId];
        if (animation) {
            $gameTemp.requestAnimation(targets, animationId, mirror);
        }
    };
    */




})();