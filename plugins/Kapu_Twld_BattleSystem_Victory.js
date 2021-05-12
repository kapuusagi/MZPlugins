/*:ja
 * @target MZ 
 * @plugindesc TWLD向けの戦闘システムの勝利画面カスタマイズ
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Twld_BattleSystem
 * @orderAfter Kapu_Twld_BattleSystem
 * 
 * @param expGaugeColor1
 * @text ゲージカラー1
 * @desc ゲージカラー1の色
 * @type string
 * @default #b4ffffff
 * 
 * 
 * @param expGaugeColor2
 * @text ゲージカラー2
 * @desc ゲージカラー2の色
 * @type string
 * @default #b4ffffff
 * 
 * @param animationFrameCount
 * @text アニメーションフレーム数
 * @desc アニメーションフレーム数
 * @type number
 * @default 120
 * 
 * @param expAnimationInterval
 * @text EXPアニメーションインターバル
 * @desc EXPゲージを更新するアニメーションインターバルフレーム数。処理が重いと感じたら多くする。
 * @type number
 * @default 2
 * 
 * @param expDisplayWait
 * @text 経験値表示ウェイト
 * @desc アニメーション前の経験値表示ウェイトフレーム数
 * @type number
 * @default 120
 * 
 * @param rewardsDisplayWait
 * @text 報酬表示ウェイト
 * @desc 報酬表示ウェイトフレーム数
 * @type number
 * @default 120
 * 
 * @param rewardWindowLabelWidth
 * @text 報酬ラベル幅
 * @desc 報酬ウィンドウのラベル幅
 * @type number
 * @default 80
 * 
 * @param rewardWindowValueWidth
 * @text 報酬ウィンドウ値幅
 * @desc 報酬ウィンドウの値幅
 * @type number
 * @default 240
 * 
 * @param textExp
 * @desc 獲得EXPテキスト
 * @desc 獲得EXPテキストとして表示されるテキスト
 * @type string
 * @default EXP
 * 
 * @param textGold
 * @text 所持金テキスト
 * @desc 所持金として表示されるテキスト（単位では無い）
 * @type string
 * @default 所持金
 * 
 * @param textTreasures
 * @text トレジャーテキスト
 * @desc トレジャーとして表示されるテキスト
 * @type string
 * @default ドロップアイテム
 * 
 * @param textLevelUp
 * @text レベルアップテキスト
 * @desc EXPチャージ時にレベルが上がった時に表示する文字列
 * @type string
 * @default Level UP!
 * 
 * 
 * @param levelUpColor
 * @text レベルアップ文字列色
 * @desc レベルアップ文字列の色。RGBA
 * @type string
 * @default #ffff80ff
 * 
 * @param soundLevelUp
 * @text レベルアップ音
 * @desc レベルアップ時にならす音
 * @type struct<SoundEffect>
 * @default {}
 * 
 * 
 * @help 
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
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/*~struct~SoundEffect:
 *
 * @param name
 * @type file
 * @dir audio/se/
 * @desc 効果音のファイル名
 * @default 
 * @require 1
 *
 * @param volume
 * @type number
 * @max 100
 * @desc 効果音の音量
 * 初期値: 90
 * @default 90
 *
 * @param pitch
 * @type number
 * @min 50
 * @max 150
 * @desc 効果音のピッチ
 * 初期値: 100
 * @default 100
 *
 * @param pan
 * @type number
 * @min -100
 * @max 100
 * @desc 効果音の位相
 * 初期値: 0
 * @default 0
 *
 */
/**
 * レベルアップポップアップ用スプライト
 */
function Sprite_BattleHudLevelup() {
    this.initialize(...arguments);
}
/**
 * 経験値ゲージスプライト
 */
function Sprite_BattleHudExpGauge() {
    this.initialize(...arguments);
}

/**
 * 戦闘報酬表示ウィンドウ
 */
function Window_BattleRewards() {
    this.initialize(...arguments);
}


(() => {
    const pluginName = "Kapu_Twld_BattleSystem_Victory";
    const parameters = PluginManager.parameters(pluginName);

    const expGaugeColor1 = parameters["expGaugeColor1"] || "#ffb4ffff";
    const expGaugeColor2 = parameters["expGaugeColor2"] || "#ffb4ffff";
    const animationFrameCount = Math.floor(Number(parameters["animationFrameCount"]) || 120);
    const expAnimationInterval = Math.floor(Number(parameters["expAnimationInterval"]) || 2);
    const expDisplayWait = Math.floor(Number(parameters["expDisplayWait"]) || 120);
    const rewardsDisplayWait = Math.floor(Number(parameters["rewardsDisplayWait"]) || 120);

    const rewardWindowLabelWidth = Math.floor(Number(parameters["rewardWindowLabelWidth"]) || 80);
    const rewardWindowValueWidth = Math.floor(Number(parameters["rewardWindowValueWidth"]) || 240);
    const levelUpColor = parameters["levelUpColor"] || "#ffff80ff";
    const levelUpOutlineColor = parameters["levelUpOutlineColor"] || "#808000c8";
    const textLevelUp = parameters["textLevelUp"] || "Level UP!";
    const soundLevelUp = JSON.parse(parameters["soundLevelUp"] || "{}") || null;
    const textExp = parameters["textExp"] || "Exp";
    const textGold = parameters["textGold"] || "Money";
    const textTreasures = parameters["textTreasures"] || "Treasures";

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // Sprite_BattleHudLevelup
    Sprite_BattleHudLevelup.prototype = Object.create(Sprite.prototype);
    Sprite_BattleHudLevelup.prototype.constructor = Sprite_BattleHudLevelup;

    /**
     * Sprite_BattleHudLevelupを初期化する。
     */
    Sprite_BattleHudLevelup.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.createBitmap();
        this.anchor.x = 0.5;
        this.anchor.y = 1.0;
        this._elapse = 0;
        this._duration = 60;
    };

    /**
     * 描画用のビットマップを作成する。
     */
    Sprite_BattleHudLevelup.prototype.createBitmap = function() {
        const h = this.fontSize();
        const w = Math.floor(textLevelUp.length * h * 2);
        const bitmap = new Bitmap(w, h);
        bitmap.fontFace = this.fontFace();
        bitmap.fontSize = this.fontSize();
        bitmap.textColor = levelUpColor;
        bitmap.outlineColor = levelUpOutlineColor;
        bitmap.outlineWidth = this.outlineWidth();
        this.bitmap = bitmap;

        this.bitmap.drawText(textLevelUp, 0, 0, w, h, "center");
    };
    /**
     * Sprite_BattleHudLevelupを破棄する。
     * 
     * @param {object} options オプション
     */
    Sprite_BattleHudLevelup.prototype.destroy = function(options) {
        // bitmapはnewで確保しているため、destroy()をコールする必要がある。
        if (this.bitmap) {
            this.bitmap.destroy();
        }
        Sprite.prototype.destroy.call(this, options);
    };
    /**
     * フォントフェースを得る。
     * 
     * @returns {string} フォントフェース
     */
    Sprite_BattleHudLevelup.prototype.fontFace = function() {
        return $gameSystem.mainFontFace();
    };
    /**
     * フォントサイズを得る。
     * 
     * @returns {number} フォントサイズ
     */
    Sprite_BattleHudLevelup.prototype.fontSize = function() {
        return $gameSystem.mainFontSize() + 12;
    };

    /**
     * アウトライン幅を得る。
     * 
     * @returns {number} アウトライン幅
     */
    Sprite_BattleHudLevelup.prototype.outlineWidth = function() {
        return 8;
    };

    /**
     * セットアップする。
     */
    Sprite_BattleHudLevelup.prototype.setup = function() {
        this.x = 60;
        this.y = 0;
        this._elapse = 0;
        this._duration = 60;
        this.opacity = 0;
    };
    /**
     * 更新する。
     */
    Sprite_BattleHudLevelup.prototype.update = function() {
        if (this._duration > 0) {
            const fadeInRate = (this._elapse > 10) ? 1.0 : Math.floor(this._elapse / 10);
            const fadeOutRate = (this._duration > 10) ? 1.0 : Math.floor(this._duration / 10);
            this.opacity = Math.floor(255 * fadeInRate * fadeOutRate);
            if (this._elapse < 30) {
                this.y -= 1; // 少しうえに移動
            }

            this._duration--;
            this._elapse++;
        }
    };
    //------------------------------------------------------------------------------
    // Sprite_BattleHudExpGauge
    Sprite_BattleHudExpGauge.prototype = Object.create(Sprite.prototype);
    Sprite_BattleHudExpGauge.prototype.constructor = Sprite_BattleHudExpGauge;

    /**
     * Sprite_BattleHudExpGaugeを初期化する。
     */
    Sprite_BattleHudExpGauge.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.createBitmap();
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    };

    /**
     * メンバーを初期化する。
     */
    Sprite_BattleHudExpGauge.prototype.initMembers = function() {
        this._battler = null;
        this._prevExp = 0;
        this._currentLevel = 1;
        this._currentExp = 0;
        this._targetLevel = 1;
        this._targetExp = 0;
        this._duration = 0;
        this._updateWait = 0;
        this._animationFrameCount = 0;
        this._animationInterval = 0;
    };

    /**
     * Sprite_BattleHudExpGauge を破棄する。
     * 
     * @param {object} optins オプション
     */
    Sprite_BattleHudExpGauge.prototype.destroy = function(options) {
        if (this.bitmap) {
            this.bitmap.destroy();
        }
        Sprite.prototype.destroy.call(this, options);
    };

    /**
     * ビットマップを作成する。
     */
    Sprite_BattleHudExpGauge.prototype.createBitmap = function() {
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.bitmap = new Bitmap(width, height);
    };


    /**
     * Bitmapの幅を得る。
     * 
     * @return {number} Bitmapの幅。
     */
    Sprite_BattleHudExpGauge.prototype.bitmapWidth = function() {
        return 144;
    };

    /**
     * Bitmapの高さを得る。
     * 
     * @return {number} Bitmapの高さ。
     */
    Sprite_BattleHudExpGauge.prototype.bitmapHeight = function() {
        return 34;
    };
    /**
     * ゲージの高さを得る。
     * 
     * @return {number} ゲージの高さ。
     */
    Sprite_BattleHudExpGauge.prototype.gaugeHeight = function() {
        return 24;
    };
    /**
     * ゲージ描画のX位置を取得する。
     * 
     * @return {number} X位置
     */
    Sprite_BattleHudExpGauge.prototype.gaugeX = function() {
        return 0;
    };
    /**
     * ゲージ描画のY位置を取得する。
     * 
     * @return {number} Y位置
     */
    Sprite_BattleHudExpGauge.prototype.gaugeY = function() {
        return this.bitmapHeight() - this.gaugeHeight();
    };

    /**
     * ゲージ描画のY位置を取得する。
     * 
     * @returns {number} Y位置
     */
    Sprite_BattleHudExpGauge.prototype.labelY = function() {
        return 3;
    };
    /**
     * フォントフェースを得る。
     * 
     * @returns {string} フォントフェース。
     */
    Sprite_BattleHudExpGauge.prototype.labelFontFace = function() {
        return $gameSystem.mainFontFace();
    };
    /**
     * ラベルのフォントサイズを得る。
     * 
     * @return {Number} フォントサイズ
     */
    Sprite_BattleHudExpGauge.prototype.labelFontSize = function() {
        return $gameSystem.mainFontSize() - 2;
    };

    /**
     * 数値のフォントフェースを得る。
     * 
     * @returns {string} 数値のフォントフェース。
     */
    Sprite_BattleHudExpGauge.prototype.valueFontFace = function() {
        return $gameSystem.numberFontFace();
    };
    /**
     * 値のフォントサイズを得る。
     * 
     * @return {Number} 値のフォントサイズ。
     */
    Sprite_BattleHudExpGauge.prototype.valueFontSize = function() {
        return $gameSystem.mainFontSize() - 6;
    };

    /**
     * このSprite_Gaugeが表示するステータスをセットアップする。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     */
    Sprite_BattleHudExpGauge.prototype.setup = function(battler) {
        this._battler = battler;
        this._currentLevel = (battler) ? battler.level : 1;
        this._currentExp = (battler) ? battler.currentExp() : 0;
        this._prevExp = this._currentExp;
        this._targetExp = this._currentExp;
        this._duration = 0;
        this._updateWait = 0;
        this._animationFrameCount = 0;
        this._animationInterval = 0;
        this.updateBitmap();
        this.redraw();
    };

    /**
     * Sprite_BattleHudExpGauge を更新する。
     */
    Sprite_BattleHudExpGauge.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
    };

    /**
     * Bitmapを更新する。
     */
     Sprite_BattleHudExpGauge.prototype.updateBitmap = function() {
        if (this._battler) {
            const exp = this._battler.currentExp();
            if (this._targetExp !== exp) {
                this._targetLevel = this._battler.level;
                this._prevExp = this._currentExp;
                this._targetExp = exp;

                const diffExp = this._targetExp - this._prevExp;
                this._updateWait = (this._duration === 0) ? expDisplayWait : this._updateWait;
                this._duration = Math.min(diffExp, animationFrameCount);
                this._animationFrameCount = this._duration;
                this._animationInterval = 0;
                this.redraw();
            } else {
                this.updateGaugeAnimation();
            }
            this._battler.setExpPopupRuning(this._duration > 0);
            this.visible = this._battler.isExpPopup();
        } else {
            this.visible = false;
        }
    };

    /**
     * ゲージアニメーションを更新する。
     */
    Sprite_BattleHudExpGauge.prototype.updateGaugeAnimation = function() {
        if (this._battler && (this._duration > 0)) {
            if (this._battler.isExpPopupEndImmidiately()) {
                this._currentExp = this._targetExp;
                this.updateCurrentLevel();
                this._updateWait = 0;
                this._animationInterval = 0;
                this._duration = 0;
                this.redraw();
            } else {
                if (this._updateWait > 0) {
                    this._updateWait--;
                } else if (this._animationInterval > 0) {
                    this._animationInterval--;
                } else {
                    this._duration = Math.max(this._duration - expAnimationInterval, 0);
                    if (this._duration === 0) {
                        this._currentExp = this._targetExp;
                    } else {
                        const d = (this._targetExp - this._prevExp) / this._animationFrameCount;
                        const elapse = this._animationFrameCount - this._duration;
                        this._currentExp = Math.floor(this._prevExp + d * elapse);
                    }
                    this.updateCurrentLevel();
                    this._animationInterval = expAnimationInterval;
                    this.redraw();
                }
            }
        }
    };

    /**
     * 表示しているレベルを更新する。
     * 必要な場合、レベルアップポップアップを表示する。
     */
    Sprite_BattleHudExpGauge.prototype.updateCurrentLevel = function() {
        let level = this._currentLevel;
        for (;;) {
            if (level >= this._battler.maxLevel()) {
                break;
            } else if (this._currentExp < this._battler.expForLevel(level + 1)) {
                break;
            } else {
                level++;
            }
        }
        if (this._currentLevel !== level) {
            this.setupLevelUpSprite();
            if (soundLevelUp) {
                AudioManager.playSe(soundLevelUp);
            }
            this._currentLevel = level;
        }
    };

    /**
     * レベルアップスプライトをセットアップする。
     */
    Sprite_BattleHudExpGauge.prototype.setupLevelUpSprite = function() {
        if (!this._levelupSprite) {
            const sprite = new Sprite_BattleHudLevelup();
            this._levelupSprite = sprite;
            this.addChild(this._levelupSprite);
        }
        this._levelupSprite.setup();
    };

    /**
     * このスプライトが有効かどうかを得る。
     * 
     * @returns {boolean} スプライトが有効な場合にはtrue, それ以外はfalse.
     */
    Sprite_BattleHudExpGauge.prototype.isValid = function() {
         return true;
    };

    /**
     * 現在値を取得する。
     * 
     * @return {number} 現在値
     */
    Sprite_BattleHudExpGauge.prototype.currentValue = function() {
        if (this._battler) {
            if (this._level >= this._battler.maxLevel()) {
                return this.currentMaxValue();
            } else {
                return this._currentExp - this._battler.expForLevel(this._currentLevel);
            }
        } else {
            return 0;
        }
    };

    /**
     * ゲージの最大値を得る。
     * 
     * @return {number} 最大値
     */
    Sprite_BattleHudExpGauge.prototype.currentMaxValue = function() {
        if (this._battler) {
            const level = this._currentLevel;
            if (level >= this._battler.maxLevel()) {
                return this._battler.expForLevel(level) - this._battler.expForLevel(level - 1);
            } else {
                return this._battler.expForLevel(level + 1) - this._battler.expForLevel(level);
            }
        } else {
            return 0;
        }
    };

    /**
     * 描画するラベルを取得する。
     * 
     * @return {String} ラベル文字列。
     */
    Sprite_BattleHudExpGauge.prototype.label = function() {
        return TextManager.expA;
    };
    /**
     * ゲージ背景色を得る。
     * 
     * @returns {string} ゲージ背景色
     */
    Sprite_BattleHudExpGauge.prototype.gaugeBackColor = function() {
        return ColorManager.gaugeBackColor();
    };
    /**
     * ゲージカラー1を得る。
     * 
     * @returns {string} ゲージカラー1
     */
    Sprite_BattleHudExpGauge.prototype.gaugeColor1 = function() {
        return expGaugeColor1;
    };

    /**
     * ゲージカラー2を得る。
     * 
     * @returns {string} ゲージカラー2
     */
    Sprite_BattleHudExpGauge.prototype.gaugeColor2 = function() {
        return expGaugeColor2;
    };

    /**
     * ラベルカラーを得る。
     * 
     * @returns {string} ラベルカラー
     */
    Sprite_BattleHudExpGauge.prototype.labelColor = function() {
        return ColorManager.systemColor();
    };
    
    /**
     * アウトラインカラーを得る。
     * 
     * @returns {string} アウトラインカラー
     */
    Sprite_BattleHudExpGauge.prototype.labelOutlineColor = function() {
        return ColorManager.outlineColor();
    };
    
    /**
     * アウトラインの幅を得る。
     * 
     * @returns {number} アウトラインの幅。
     */
    Sprite_BattleHudExpGauge.prototype.labelOutlineWidth = function() {
        return 3;
    };

    /**
     * 値カラーを得る。
     * 
     * @returns {string} 値カラー
     */
    Sprite_BattleHudExpGauge.prototype.valueColor = function() {
        return ColorManager.normalColor();
    };

    /**
     * 値のアウトラインカラーを得る。
     * 
     * @returns {string} カラー
     */
    Sprite_BattleHudExpGauge.prototype.valueOutlineColor = function() {
        return "rgba(0, 0, 0, 1)";
    };
    
    /**
     * 値のアウトライン幅を得る。
     * 
     * @returns {number} アウトライン幅
     */
    Sprite_BattleHudExpGauge.prototype.valueOutlineWidth = function() {
        return 2;
    };

    /**
     * 描画する。
     */
    Sprite_BattleHudExpGauge.prototype.redraw = function() {
        this.bitmap.clear();
        const currentValue = this.currentValue();
        if (!isNaN(currentValue)) {
            this.drawGauge();
            this.drawLabel();
            if (this.isValid()) {
                this.drawValue();
            }
        }
    };
    
    /**
     * ゲージを描画する。
     */
    Sprite_BattleHudExpGauge.prototype.drawGauge = function() {
        const gaugeX = this.gaugeX();
        const gaugeY = this.bitmapHeight() - this.gaugeHeight();
        const gaugewidth = this.bitmapWidth() - gaugeX;
        const gaugeHeight = this.gaugeHeight();
        this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
    };
    
    /**
     * ゲージの矩形領域を描画する。
     * 
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    Sprite_BattleHudExpGauge.prototype.drawGaugeRect = function(x, y, width, height) {
        const rate = this.gaugeRate();
        const fillW = Math.floor((width - 2) * rate);
        const fillH = height - 2;
        const color0 = this.gaugeBackColor();
        const color1 = this.gaugeColor1();
        const color2 = this.gaugeColor2();
        this.bitmap.fillRect(x, y, width, height, color0);
        this.bitmap.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
    };
    
    /**
     * ゲージの割合を得る。
     * 
     * @returns {number} ゲージの割合。
     */
    Sprite_BattleHudExpGauge.prototype.gaugeRate = function() {
        if (this.isValid()) {
            const value = this.currentValue();
            const maxValue = this.currentMaxValue();
            return maxValue > 0 ? value / maxValue : 0;
        } else {
            return 0;
        }
    };
    
    /**
     * ラベルを描画する。
     */
    Sprite_BattleHudExpGauge.prototype.drawLabel = function() {
        const label = this.label();
        const x = this.labelOutlineWidth() / 2;
        const y = this.labelY();
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.setupLabelFont();
        this.bitmap.paintOpacity = this.labelOpacity();
        this.bitmap.drawText(label, x, y, width, height, "left");
        this.bitmap.paintOpacity = 255;
    };
    
    /**
     * ラベルのフォントをセットアップする。
     */
    Sprite_BattleHudExpGauge.prototype.setupLabelFont = function() {
        this.bitmap.fontFace = this.labelFontFace();
        this.bitmap.fontSize = this.labelFontSize();
        this.bitmap.textColor = this.labelColor();
        this.bitmap.outlineColor = this.labelOutlineColor();
        this.bitmap.outlineWidth = this.labelOutlineWidth();
    };
    
    /**
     * ラベルの透過度を得る。
     * 
     * @returns {number} 透過度
     */
    Sprite_BattleHudExpGauge.prototype.labelOpacity = function() {
        return this.isValid() ? 255 : 160;
    };
    
    /**
     * 値を描画する。
     */
    Sprite_BattleHudExpGauge.prototype.drawValue = function() {
        const currentValue = this._targetExp - this._currentExp;
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.setupValueFont();
        this.bitmap.drawText('+' + currentValue, 0, 0, width, height, "right");
    };
    
    /**
     * 値のフォントを準備する。
     */
    Sprite_BattleHudExpGauge.prototype.setupValueFont = function() {
        this.bitmap.fontFace = this.valueFontFace();
        this.bitmap.fontSize = this.valueFontSize();
        this.bitmap.textColor = this.valueColor();
        this.bitmap.outlineColor = this.valueOutlineColor();
        this.bitmap.outlineWidth = this.valueOutlineWidth();
    };
    


    //------------------------------------------------------------------------------
    // Sprite_BattleHudActor
    const _Sprite_BattleHudActor_initMembers = Sprite_BattleHudActor.prototype.initMembers;
    /**
     * メンバーを初期化する。
     */
    Sprite_BattleHudActor.prototype.initMembers = function() {
        _Sprite_BattleHudActor_initMembers.call(this);
        this.createExpGaugeSprite();
    };
    /**
     * EXPゲージスプライトを作成する。
     */
    Sprite_BattleHudActor.prototype.createExpGaugeSprite = function() {
        this._expGaugeSprite = new Sprite_BattleHudExpGauge();
        this._expGaugeSprite.x = 0;
        this._expGaugeSprite.y = -220;
        this.addChild(this._expGaugeSprite);
    };

    const _Sprite_BattleHudActor_onBattlerChanged = Sprite_BattleHudActor.prototype.onBattlerChanged;
    /**
     * このスプライトに関連付けるGame_Battlerが変更されたときの処理を行う。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     */
    Sprite_BattleHudActor.prototype.onBattlerChanged = function(battler) {
        _Sprite_BattleHudActor_onBattlerChanged.call(this, battler);
        this._expGaugeSprite.setup(battler, "exp");
    };

    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;

    /**
     * Game_Actorのメンバーを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._isExpPopupRequired = false;
        this._isExpPopupEndImmidiately = false;
        this._isExpPopupRuning = false;
    };

    /**
     * 経験値バーをポップアップするかどうかを取得する。
     */
    Game_Actor.prototype.enableExpPopup = function() {
        this._isExpPopupRequired = true;
    };

    /**
     * 経験値バーポップアップをクリアする。
     */
    Game_Actor.prototype.clearExpPopup = function() {
        this._isExpPopupRequired = false;
    };

    /**
     * 経験値バーポップアップをするかどうかを取得する。
     * 
     * @returns {boolean} 経験値バーをポップアップする場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.isExpPopup = function() {
        return this._isExpPopupRequired;
    };
    /**
     * 経験値ポップアップを即座に終了させるように設定する。
     */
    Game_Actor.prototype.setExpPopupEndImmidiately = function() {
        this._isExpPopupEndImmidiately = true;
    };
    /**
     * 経験値ポップアップを即座に終了させるかどうかを取得する。
     * 
     * @returns {boolean} 経験値ポップアップを即座に終了させる場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isExpPopupEndImmidiately = function() {
        return this._isExpPopupEndImmidiately;
    };

    /**
     * EXPポップアップが動作中かどうかを取得する。
     * 
     * @param {boolean} isRuning 動作中の場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.setExpPopupRuning = function(isRuning) {
        this._isExpPopupRuning = isRuning;
    };

    /**
     * 
     */
    Game_Actor.prototype.isExpPopupRuning = function() {
        return this._isExpPopupRuning;
    };

    const _Game_Actor_onBattleEnd = Game_Actor.prototype.onBattleEnd;
    /**
     * 戦闘終了処理を行う。
     */
    Game_Actor.prototype.onBattleEnd = function() {
        _Game_Actor_onBattleEnd.call(this);
        this._isExpPopupRequired = false;
        this._isExpPopupEndImmidiately = false;
        this._isExpPopupRuning = false;
    };

    const _Game_Actor_shouldDisplayLevelUp = Game_Actor.prototype.shouldDisplayLevelUp
    /**
     * レベルアップメッセージを表示するかどうかを取得する。
     * 
     * @returns {boolean} レベルアップメッセージを表示する場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.shouldDisplayLevelUp = function() {
        return _Game_Actor_shouldDisplayLevelUp.call(this) && !$gameParty.inBattle();
    };

    //------------------------------------------------------------------------------
    // BattleManager
    /**
     * 勝利した場合の処理を行う。
     * 
     * !!!overwrite!!! BattleManager.processVictory
     *     勝利画面を表示するためオーバーライドする。
     */
    BattleManager.processVictory = function() {
        $gameParty.allMembers().forEach(actor => actor.enableExpPopup())
        $gameParty.removeBattleStates();
        $gameParty.performVictory();
        this.playVictoryMe();
        this.replayBgmAndBgs();
        this.makeRewards();
        this.gainRewards();
        this._rewardsWindow.show();
        this._rewardsWindow.activate();
        this._rewardsWindow.setup(this._rewards);
        this._phase = "waitRewardsConfirm";
    };

    const _BattleManager_gainRewards = BattleManager.gainRewards;
    /**
     * 報酬を加算処理する。
     */
    BattleManager.gainRewards = function() {
        this._rewardsWindow.setCurrentGold($gameParty.gold())
        _BattleManager_gainRewards.call(this);
    };

    /**
     * 
     * @param {Window_Selectable} window 
     */
    BattleManager.setRewardsWindow = function(window) {
        this._rewardsWindow = window;
    };

    const _BattleManager_endBattle = BattleManager.endBattle;
    /**
     * 戦闘を終了させる。
     * 本メソッドを呼ぶと、フェーズが"battleEnd"に遷移し、次のupdate()でSceneManager.pop()がコールされる。
     * 
     * @param {Number} result 戦闘結果(0:勝利 , 1:中断(逃走を含む), 2:敗北)
     */
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.call(this, result);
        this._rewardsWindow = null;
    };

    //------------------------------------------------------------------------------
    // Window_BattleRewards
    Window_BattleRewards.prototype = Object.create(Window_Selectable.prototype);
    Window_BattleRewards.prototype.constructor = Window_BattleRewards;

    /**
     * Window_BattleRewards を初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BattleRewards.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._currentGold = $gameParty.gold();
        this._targetGold = this._currentGold;
        this._duration = 0;
        this._animationFrameCount = 0;
        this._updateWait = 0;
        this._rewards = null;
    };

    /**
     * ウィンドウがビジーかどうかを取得する。
     * 
     * @returns {boolean} ビジーの場合にはtrue, それ以外はfalse.
     */
    Window_BattleRewards.prototype.isBusy = function() {
        return (this._duration > 0);
    };
    /**
     * 現在の所持金（報酬加算前の所持金）を設定する。
     * 
     * @param {number} gold 現在の所持金
     */
    Window_BattleRewards.prototype.setCurrentGold = function(gold) {
        this._currentGold = gold;
    }
    /**
     * 報酬をセットアップする。
     * 
     * @param {object} rewards 報酬。BattleManagerのmakeRewardsで構築されたオブジェクト。
     */
    Window_BattleRewards.prototype.setup = function(rewards) {
        this._targetGold = $gameParty.gold();
        this._rewards = rewards;
        this._animationFrameCount = Math.min(this._targetGold - this._currentGold, animationFrameCount);
        this._updateWait = rewardsDisplayWait;
        this._duration = this._animationFrameCount;
        this.refresh();
    };

    /**
     * 報酬ウィンドウを更新する。
     */
    Window_BattleRewards.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        if (this._rewards) {
            if (this._updateWait > 0) {
                this._updateWait--;
            } else if (this._duration > 0) {
                // SoundManager.playCursor();
                this._duration--;
                this.refresh();
            }
        } else {
            this._duration = 0;
        }
    };

    /**
     * アニメーションを終了させる。
     */
    Window_BattleRewards.prototype.terminateAnimation = function() {
        if (this._duration > 0) {
            this._duration = 0;
            this._updateWait = 0;
            this.refresh();
        }
    };
    /**
     * タッチされたときの処理を行う。
     */
    Window_BattleRewards.prototype.onTouchOk = function() {
        // 項目選択状態によらず、完了させるためにprocessOkを呼び出す。
        this.processOk();
    };    

    /**
     * 描画を更新する。
     */
    Window_BattleRewards.prototype.refresh = function() {
        this.contents.clear();
        const lineHeight = this.lineHeight();

        const spacing = 8;
        const x = spacing;
        const width = this.innerWidth - spacing * 2;
        // const height = this.innerHeight - spacing * 2;
        
        let y = spacing;

        // ExP
        this.drawRewardExp(x, y, width);
        y += lineHeight;

        this.drawHorzLine(x + 4, y + lineHeight / 2, width - 8);
        y += lineHeight;

        // Gold
        this.drawRewardGold(x, y, width);
        y += lineHeight;

        this.drawHorzLine(x + 4, y + lineHeight / 2, width - 8);
        y += lineHeight;

        // Drop Items.
        this.drawTreasureLabel(x + 4, y, width);
        y += lineHeight;

        if (this._rewards) {
            const rewardItemX1 = x + 4;
            const rewardItemWidth = ((width - spacing) / 2)
            const rewardItemX2 = rewardItemX1 + rewardItemWidth + spacing;
            for (let index = 0; index < this._rewards.items.length; index++) {
                const rewardItem = this._rewards.items[index];
                if ((y + lineHeight) > this.innerHeight) {
                    // 表示スペースが無い。
                    break;
                }
                if ((index & 1) === 0) {
                    this.drawRewardItem(rewardItemX1, y, rewardItemWidth, rewardItem);
                } else {
                    this.drawRewardItem(rewardItemX2, y, rewardItemWidth, rewardItem);
                    y += lineHeight;
                }
            }
        }
    };

    /**
     * 所持金を描画する。
     * 
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_BattleRewards.prototype.drawRewardGold = function(x, y, width) {
        // 所持金ラベル 所持金 単位 加算値
        const spacing = 8;
        const labelWidth = rewardWindowLabelWidth;
        const gainGold = this._targetGold - this._currentGold;
        const displayRewardGold = (this._animationFrameCount > 0)
                ? Math.floor(gainGold * (this._duration / this._animationFrameCount)) : 0;
        const displayGold = this._targetGold - displayRewardGold;

        // 所持金ラベル表示
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textGold, x, y, labelWidth);

        // 所持金
        const valueX = x + labelWidth + spacing;
        const valueWidth = Math.min(rewardWindowValueWidth, width - (labelWidth + spacing));
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(displayGold, valueX, y, valueWidth, "right");

        // 単位
        const unitX = valueX + valueWidth + spacing;
        const unitWidth = this.textWidth(TextManager.currencyUnit);
        this.drawText(TextManager.currencyUnit, unitX, y, unitWidth, "left");

        // 加算量
        const leftWidth = width - (unitX + unitWidth + spacing);
        if (leftWidth < valueWidth) {
            return ;
        }
        const gainGoldX = unitX + unitWidth + spacing;
        const gainGoldWidth = Math.min(leftWidth, valueWidth);
        const gainGoldText = (displayRewardGold >= 0) ? ("+" + displayRewardGold) : String(displayRewardGold);
        this.drawText(gainGoldText, gainGoldX, y, gainGoldWidth, "right");
    };

    /**
     * 報酬EXPを描画する。
     * 
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_BattleRewards.prototype.drawRewardExp = function(x, y, width) {
        const exp = (this._rewards) ? (this._rewards.exp || 0) : 0;
        const spacing = 8;
        const labelWidth = rewardWindowLabelWidth;
        const valueX = x + labelWidth + spacing;
        const valueWidth = Math.min(rewardWindowValueWidth, width - (labelWidth + spacing));
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textExp, x, y, labelWidth);
        this.changeTextColor(ColorManager.normalColor());
        this.drawText("+" + exp, valueX, y, valueWidth, "right");
    };

    /**
     * 報酬ラベルを描画する。
     * 
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 描画幅
     */
    Window_BattleRewards.prototype.drawTreasureLabel = function(x, y, width) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textTreasures, x, y, width);
    }

    /**
     * 報酬アイテムを描画する。
     * 
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 描画幅
     * @param {object} rewardItem アイテム
     */
    Window_BattleRewards.prototype.drawRewardItem = function(x, y, width, rewardItem) {
        this.resetTextColor();
        this.drawItemName(rewardItem, x, y, width);
    };



    /**
     * 水平ラインを描画する。
     * 
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 幅
     */
    Window_BattleRewards.prototype.drawHorzLine = function(x, y, width) {
        this.drawRect(x, y, width, 5);
    };

    //------------------------------------------------------------------------------
    // Scene_Battle
    const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    /**
     * 全ウィンドウを作成する。
     */
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        this.createBattleRewardsWindow();
    };

    /**
     * 報酬ウィンドウを作成する。
     */
    Scene_Battle.prototype.createBattleRewardsWindow = function() {
        const rect = this.rewardsWindowRect();
        this._battleRewardsWindow = new Window_BattleRewards(rect);
        this._battleRewardsWindow.hide();
        this._battleRewardsWindow.deactivate();
        this._battleRewardsWindow.setHandler("ok", this.onRewardsWindowOk.bind(this));
        BattleManager.setRewardsWindow(this._battleRewardsWindow);


        this.addWindow(this._battleRewardsWindow);
    };

    /**
     * 報酬ウィンドウの矩形領域を得る。
     */
    Scene_Battle.prototype.rewardsWindowRect = function() {
        const rect = this.skillWindowRect();
        const wx = rect.x;
        const wy = 64;
        const ww = rect.width;
        const wh = rect.y + rect.height - wy;
        return new Rectangle(wx, wy, ww, wh);
    }

    /**
     * リワードウィンドウでOK操作されたときの処理を行う。
     */
    Scene_Battle.prototype.onRewardsWindowOk = function() {
        if (!this.isRewardsPopupBusy()) {
            BattleManager.endBattle();
        } else {
            this._battleRewardsWindow.terminateAnimation();
            this._battleRewardsWindow.activate();
            $gameParty.battleMembers().forEach(actor => actor.setExpPopupEndImmidiately());
        }
    };

    /**
     * 報酬ウィンドウ表示中かどうかを取得する。
     * 
     * @returns {boolean} 表示中の場合にはtrue, それ以外はfalse.
     */
    Scene_Battle.prototype.isRewardsPopupBusy = function() {
        if (this._battleRewardsWindow.isBusy()) {
            return false;
        }
        for (const actor of $gameParty.battleMembers()) {
            if (actor.isExpPopupRuning()) {
                return true;
            }
        }
        return false;
    };


    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();