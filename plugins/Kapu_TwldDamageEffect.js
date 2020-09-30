/*:ja
 * @target MZ 
 * @plugindesc TWLD向けダメージエフェクトプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * TWLD向けに作成したダメージエフェクトプラグイン。
 * 
 * @help 
 * TWLD向けに作成した、ダメージエフェクトのプラグイン。
 * 今のところダメージの数値が大きく出るとか、飛び出すとかその辺しか考慮してない。
 * エネミーにエフェクトかけたいかもね。
 * 
 * ■ 使用時の注意
 * Sprite_Damageのメソッドを多くオーバーライドしているため、
 * ダメージ表示変更に関するプラグインとは競合する可能性があります。
 * 
 * ■ プラグイン開発者向け
 * 特に暗視。
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

    //------------------------------------------------------------------------------
    // Sprite_Damage
    const _Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
    /**
     * Sprite_Damageを初期化する。
     */
    Sprite_Damage.prototype.initialize = function() {
        _Sprite_Damage_initialize.call(this);
        this._duration = 120;
        this._frameCount = 0;
    };


    const _Sprite_Damage_setup = Sprite_Damage.prototype.setup;
    /**
     * Sprite_Damageを表示させるための準備をする。
     * 
     * @param {Game_Battler} target ポップアップ対象
     */
    Sprite_Damage.prototype.setup = function(target) {
        const result = target.result();
        this._critical = result.critical;
        if (this._critical) {
            this._duration *= 2;
            this._colorType = 0; // ColorManager.damageColor()に渡る
            this.createCritical();
        }
        _Sprite_Damage_setup.call(this, target);
    };
    /**
     * Missスプライトを作成する。
     * 
     * !!!overwrite!!! Sprite_Damage.createMiss
     */
    Sprite_Damage.prototype.createMiss = function() {
        const h = this.fontSize();
        const w = Math.floor(h * 3.0);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.drawText("Miss", 0, 0, w, h, "center");
        sprite.anchor.y = 0.5;
        sprite.dy = 0;
        sprite.opacity = 0;
        sprite.x = -60;
        sprite.y = 0;
        sprite.updatePosition = this.updatePositionMiss.bind(this);
    };

    /**
     * クリティカル表示のスプライトを作成する。
     */
    Sprite_Damage.prototype.createCritical = function() {
        const h = this.fontSize();
        const w = Math.floor(h * 6.0);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.drawText("Critical", 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = 0;
        sprite.y = 0;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updatePositionCritical.bind(this);
    };
    /**
     * 数値スプライトを作成する。
     * 
     * @param {Number} value 表示する値
     * !!!overwrite!!! Sprite_Damage_createDigits
     */
    Sprite_Damage.prototype.createDigits = function(value) {
        const string = Math.abs(value).toString();
        const h = this.fontSize();
        const w = Math.floor(h * 0.75);
        for (let i = 0; i < string.length; i++) {
            const sprite = this.createChildSprite(w, h);
            sprite.bitmap.drawText(string[i], 0, 0, w, h, "center");
            sprite.x = (i - (string.length - 1) / 2) * w;
            sprite.dy = 5;
            sprite.updatePosition = this.updatePositionDigits.bind(this);
        }
    };

    /**
     * 表示文字サイズを取得する。
     * 
     * @return {Number} 文字サイズ
     * !!!overwrite!!! Sprite_Damage.fontSize()
     */
    Sprite_Damage.prototype.fontSize = function () {
        // クリティカル時はフォントサイズを大きくする。
        return $gameSystem.mainFontSize() + ((this._critical) ? 18 : 4);
    };

    /**
     * クリティカルによるスプライトの効果を設定する。
     * 既定の実装ではダメージ表示の色をフラッシュ効果で変えるだけ。
     * 
     * !!!overwrite!!! Sprite_Damage.setupCriticalEffect()
     */
    Sprite_Damage.prototype.setupCriticalEffect = function () {
        this._flashColor = [180, 0, 0, 250]; // R,G,B,Aらしい。
        this._flashDuration = this._duration;
    };

    const _Sprite_Damage_update = Sprite_Damage.prototype.update;
    /**
     * Sprite_Damageを更新する。
     */
    Sprite_Damage.prototype.update = function() {
        this._frameCount++;
        _Sprite_Damage_update.call(this);
    };

    /**
     * 子のスプライトを更新する。
     * 
     * @param {Sprite} sprite 子のスプライト
     * !!!overwrite!!! Sprite_Damage.updateChild()
     */
    Sprite_Damage.prototype.updateChild = function(sprite) {
        sprite.updatePosition(sprite);
    };

    /**
     * Miss表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。Missと書かれたスプライトが1つだけ。
     */
    Sprite_Damage.prototype.updatePositionMiss = function(sprite) {
        if (frameCount < 30) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (frameCount > 90) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }

    };

    /**
     * Critical表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。Criticalと書かれたスプライトが1つだけ。
     */
    Sprite_Damage.prototype.updatePositionCritical = function(sprite) {
        if (frameCount < 30) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (frameCount > 90) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };

    /**
     * 数値ポップアップ表示Spriteを更新する。
     * Y=-40から上に移動して、Y=0を超えたらY=0に落ちてくる。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。1つのSpriteが1桁の数値を表示している。
     */
    Sprite_Damage.prototype.updatePositionDigits = function(sprite) {
        sprite.ry += sprite.dy;
        if ((sprite.ry < 0) && (sprite.dy > 0)) {
            sprite.dy -= 0.1;
            sprite.x += 1;
        } else {
            if ((sprite.ry >= 0) && (sprite.dy != 0)) {
                sprite.dy -= 0.5;
                sprite.x += 1;
            } else {
                sprite.dy = 0;
                sprite.ry = 0;
            }
        }
        sprite.y = Math.round(sprite.ry);
        sprite.setBlendColor(this._flashColor);
    };

})();