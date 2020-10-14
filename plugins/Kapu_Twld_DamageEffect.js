/*:ja
 * @target MZ 
 * @plugindesc TWLD向けダメージエフェクトプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
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
 * Version.0.1.0 作成した。
 */
(() => {

    const baseY = 40;

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


    /**
     * Sprite_Damageを表示させるための準備をする。
     * 
     * @param {Game_Battler} target ポップアップ対象
     * !!!overwrite!!!
     */
    Sprite_Damage.prototype.setup = function(target) {
        const result = target.result();
        this._critical = result.critical;
        if (this._critical) {
            this._colorType = 0; // ColorManager.damageColor()に渡る
            this.createCritical();
        }
        this._damageXMove = this.damageXMove(target);
        if (result.missed || result.evaded) {
            this._colorType = 0;
            this.createMiss();
        } else {
            if (result.hpAffected) {
                this._colorType = result.hpDamage >= 0 ? 0 : 1;
                this.createDigits(result.hpDamage);
            } else if (target.isAlive() && result.mpDamage !== 0) {
                this._colorType = result.mpDamage >= 0 ? 2 : 3;
                this.createDigits(result.mpDamage);
                this.setupNormalEffect();
            }
            if (result.critical) {
                this.setupCriticalEffect();
            } else {
                this.setupNormalEffect();
            }
        }
    };

    /**
     * X方向移動量を得る。
     * 
     * @param {Game_Battler} target ポップアップ対象
     * @return {Number} X方向移動量。
     */
    Sprite_Damage.prototype.damageXMove = function(target) {
        const result = target.result();
        // Note: 動かそうかと思ったけれど、
        //       なんか判定が上手くいかない。
        //       たぶん target.isAlive() && result.mpDamage に引っかかってる。
        if ((result.hpAffected && (result.hpDamage >= 0))
                /* || (target.isAlive() && result.mpDamage >= 0) */) {
            return 0.5;
        } else {
            return 0;
        }

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
        sprite.y = -40;
        sprite.updatePosition = this.updateMiss.bind(this);
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
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateCritical.bind(this);
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
            sprite.ry = baseY;
            sprite.dy = 10;
            sprite.ay = 0.5;
            sprite.rx = sprite.x;
            sprite.wait = i * 8;
            sprite.visible = sprite.wait === 0;
            sprite.updatePosition = this.updateDigits.bind(this);
            sprite.scale.x = 0.8;
            sprite.scale.y = 0.8;
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
        return $gameSystem.mainFontSize() + ((this._critical) ? 20 : 10);
    };

    /**
     * 通常ダメージのエフェクトを準備する。
     */
    Sprite_Damage.prototype.setupNormalEffect = function() {
        this._flashColor = [160, 160, 160, 200];
        this._flashDuration = 40;
    };

    /**
     * クリティカルによるスプライトの効果を設定する。
     * 
     * !!!overwrite!!! Sprite_Damage.setupCriticalEffect()
     */
    Sprite_Damage.prototype.setupCriticalEffect = function () {
        this._flashColor = [180, 0, 0, 200];
        this._flashDuration = 40;
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
    Sprite_Damage.prototype.updateMiss = function(sprite) {
        if (this._frameCount < 30) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > 90) {
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
    Sprite_Damage.prototype.updateCritical = function(sprite) {
        if (this._frameCount < 30) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > 90) {
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
    Sprite_Damage.prototype.updateDigits = function(sprite) {
        if (sprite.wait > 0) {
            sprite.wait--;
            return;
        }
        sprite.visible = true;

        sprite.ry -= sprite.dy;
        sprite.dy -= sprite.ay; // 減速するよ


        if ((sprite.ry > baseY) && (sprite.dy < 0)) {
            sprite.ry = baseY;
        } else {
            sprite.rx += this._damageXMove;
            sprite.scale.x += 0.01;
            sprite.scale.y += 0.01;
        }

        sprite.x = Math.round(sprite.rx);
        sprite.y = Math.round(sprite.ry);
        sprite.setBlendColor(this._flashColor);
    };

    /**
     * 点滅カラーを更新する
     * 点滅カラー配列のアルファ値を変更することで点滅を実現する。
     */
    Sprite_Damage.prototype.updateFlash = function() {
        if (this._flashDuration > 20) {
            this._flashColor[3] -= 10;
            this._flashDuration--;
        } else if (this._flashDuration > 0) {
            this._flashColor[3] += 10;
            this._flashDuration--;
        } else if (this._flashDuration == 0) {
            this._flashDuration = 40;
        }
    };

})();