/*:ja
 * @target MZ 
 * @plugindesc TWLD向けダメージエフェクトプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @param damageMoveX
 * @text ダメージポップアップX方向移動距離
 * @desc ダメージポップさせたとき、垂直方向の移動が止まるまで、毎フレームこの値だけ水平方向に移動する。
 * @type number
 * @decimals 2
 * @default 0.50
 * 
 * @param fadeInDuration
 * @text フェードイン期間
 * @desc フェードイン期間
 * @type number
 * @default 30
 * 
 * @param popupDuration
 * @text ダメージポップアップ期間
 * @desc ダメージポップアップさせる時間[フレーム数]
 * @type number
 * @default 60
 * 
 * @param fadeOutDuration
 * @text フェードアウト期間
 * @desc フェードアウト期間
 * @type number
 * @default 30
 * 
 * @param textAddedState
 * @text 追加されたステートポップアップテキスト
 * @desc 追加されたステートポップアップテキスト。%1にステート名。空にするとポップアップさせない。
 * @type string
 * @default +%1
 * 
 * @param colorAddedState
 * @text 追加ステート文字色
 * @desc 追加ステート文字色
 * @type string
 * @parent textAddedState
 * 
 * 
 * @param textRemovedState
 * @text 解除されたステートポップアップテキスト
 * @desc 解除されたステートポップアップテキスト。%1にステート名。空にするとポップアップさせない。
 * @type string
 * @default #808080
 * @default -%1
 * 
 * @param colorRemovedState
 * @text 解除ステート文字色
 * @desc 解除ステート文字色
 * @type string
 * @default #ffffff
 * @parent textRemovedState
 * 
 * @param textEffective
 * @text 効果的メッセージ
 * @desc 効果が増加したときにポップアップさせるメッセージ。ポップアップさせない場合には空文字列
 * @type string
 * @default Effective!
 * 
 * @param effectiveRate
 * @text 効果的判定レート
 * @desc 属性レートが定義されていて、この値より大きい場合に効果的メッセージをポップアップさせる。
 * @type number
 * @decimals 2
 * @default 1.50
 * @min 1.00
 * @parent textEffective
 * 
 * @param colorEffective
 * @text 効果有りメッセージカラー
 * @desc 効果的メッセージの色
 * @type string
 * @default #ff8000
 * @parent textEffective
 *
 * @param textIneffective
 * @text 効果なしメッセージ
 * @desc 効果が減衰したときにポップアップさせるメッセージ。ポップアップさせない場合には空文字列
 * @type string
 * @default Ineffective!
 * 
 * @param colorIneffective
 * @text 効果なし文字カラー
 * @desc 効果なし文字の色
 * @type string
 * @default #0080ff
 * @parent textIneffective
 * 
 * @param ineffectiveRate
 * @text 効果なしレート
 * @desc 属性レートが定義されていて、0以上でこの値より小さい場合に効果無いメッセージをポップアップする
 * @type number
 * @decimals 2
 * @default 0.50
 * @min 0.00
 * @max 1.00
 * @parent textIneffective
 * 
 * @param textAbsorb
 * @text 吸収メッセージ
 * @desc 吸収効果が発動したときにポップアップさせるメッセージ。ポップアップさせない場合には空文字列
 * @type string
 * @default absorb
 * 
 * @param colorAbsorb
 * @text 吸収文字カラー
 * @desc 吸収文字の色
 * @type string
 * @default #ff80ff
 * @parent textAbsorb 
 * 
 * @param textMiss
 * @text ミス時メッセージ
 * @desc アクションがミスしたときにポップアップさせるメッセージ。ポップアップさせない場合には空文字列
 * @type string
 * @defaut Miss!
 * 
 * @param colorMiss
 * @text ミス時文字カラー
 * @desc ミス時メッセージの色
 * @type string
 * @default #ffffff
 * @parent textMiss
 * 
 * @param textCritical
 * @text クリティカル時メッセージ
 * @desc アクションがクリティカルしたときにポップアップさせるメッセージ。ポップアップさせない場合には空文字列
 * @type string
 * @default Critical!
 * 
 * @param colorCritical
 * @text クリティカル時文字カラー
 * @desc クリティカル時メッセージの色
 * @type string
 * @default #ffffff
 * @parent textCritical
 *  
 * @help 
 * TWLD向けに作成した、ダメージエフェクトのプラグイン。
 * ダメージエフェクトは色々考えるため、設定の幅を持たせて色々できるようにするよりは、
 * ハードコーディングしてまるっと切り替える方が良いと考える。
 * (本格的にやろうとすると、イージングなどの設定が入ってきて面倒になる)
 * 
 * ・ダメージ数値は下から弧を描くように飛びだします。
 *   高さが停止位置になるまで、左または右にスライドさせることができます。
 * ・クリティカルポップアップ
 *   左から40ピクセル移動フェードイン -> 停止 -> 右に90ピクセル移動＆フェードアウト
 * ・ミスポップアップ
 *   左から40ピクセル移動フェードイン -> 停止 -> 右に90ピクセル移動＆フェードアウト
 * ・吸収/効果的/効果なしメッセージポップアップ
 *   左から90ピクセル移動フェードイン -> 停止 -> 右に90ピクセル移動＆フェードアウト
 * ・ステートの付与/解除ポップアップ
 *   高さ60の位置から120まで移動 ＆ 徐々にフェードイン＆フェードアウト
 * 
 * 
 * ■ 使用時の注意
 * Sprite_Damageのメソッドを多くオーバーライドしているため、
 * ダメージ表示変更に関するプラグインとは競合する可能性があります。
 * 
 * ■ プラグイン開発者向け
 * 特になし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ステート
 *   <noPopup>
 *     ステートが付与/解除されたとき、ポップアップさせない場合に指定する。
 *     (ステートポップアップさせたくない場合、付与時メッセージを空にすることでも表示しなくなる)
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成した。
 */
/*~struct~<MoveData>:
 *
 * もしある程度設定できるようにするなら、このような構造体かなあ。
 *
 * @param color
 * @text 文字(数字)色
 * @desc 文字の色。
 * @type string
 *
 * @param x
 * @text 表示開始位置x
 * @desc スプライト(セット)の表示開始位置。エネミーorアクターの表示基準位置を原点としたオフセット。右方向が＋
 * @type number
 * 
 * @param y
 * @text 表示開始位置y
 * @desc スプライト(セット)の表示開始位置。エネミーorアクターの表示基準位置を原点としたオフセット。下方向が＋
 * @type number
 * 
 * @param waitFrames
 * @text ウェイト数
 * @desc 更新しないフレーム数。このフレーム数だけ経過するまでは、スプライトは表示されない。
 * @type number
 * 
 * @param fadeInFrames
 * @text フェードインフレーム数
 * @desc フェードインさせるフレーム数。このフレーム数でフェードインさせる。
 * @type number
 * 
 * @param displayFrames
 * @text 表示フレーム数
 * @desc 表示をキープするフレーム数。このフレーム数だけ表示させる。
 * @type number;
 * 
 * @param fadeOutFrames
 * @text フェードアウトフレーム数
 * @desc フェードアウトさせるフレーム数。このフレーム数でフェードアウトさせる。
 * @type number
 * 
 * @param moveOperation
 * @text 移動タイプ
 * @desc スプライトの移動タイプ
 * @type select
 * @option 停止
 * @value none
 * @option 左から右
 * @value leftToRight
 * @option 下から上
 * @value bottomToUp
 * @option 飛び出す
 * @value popOut
 * 
 */
(() => {
    const pluginName = "Kapu_Twld_DamageEffect";
    const parameters = PluginManager.parameters(pluginName);

    const fadeInDuration = Math.max(0, Math.round(Number(parameters["fadeInDuration"]) || 30));
    const popupDuration = Math.max(30, Math.round(Number(parameters["popupDuration"]) || 60));
    const fadeOutDuration = Math.max(0, Math.round(Number(parameters["fadeOutDuration"]) || 30));
    const textAddedState = parameters["textAddedState"] || "";
    const colorAddedState = parameters["colorAddedState"] || "#ffffff";
    const textRemovedState = parameters["textRemovedState"] || "";
    const colorRemovedState = parameters["colorRemovedState"] || "";
    const textEffective = parameters["textEffective"] || "";
    const colorEffective = parameters["colorEffective"] || "#ff8000";
    const effectiveRate = Math.max((Number(parameters["effectiveRate"]) || 1.3), 1);
    const textIneffective = parameters["textIneffective"] || "";
    const colorIneffective = parameters["colorIneffective"] || "#0080ff";
    const ineffectiveRate = (Number(parameters["ineffectiveRate"]) || 0).clamp(0, 1);
    const textAbsorb = parameters["textAbsorb"] || "";
    const colorAbsorb = parameters["colorAbsorb"] || "#ff80ff";
    const textMiss = parameters["textMiss"] || "";
    const colorMiss = parameters["colorMiss"] || "#ffffff";
    const textCritical = parameters["textCritical"] || "";
    const colorCritical = parameters["colorCritical"] || "#ffffff";

    const damageMoveX = Number(parameters["damageMoveX"]) || 0.0;

    const baseY = 40;

    //------------------------------------------------------------------------------
    // Sprite_Damage
    const _Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
    /**
     * Sprite_Damageを初期化する。
     */
    Sprite_Damage.prototype.initialize = function() {
        _Sprite_Damage_initialize.call(this);
        this._duration = fadeInDuration + popupDuration + fadeOutDuration;
        this._frameCount = 0;
    };


    /**
     * Sprite_Damageを表示させるための準備をする。
     * 
     * @param {Game_Battler} target ポップアップ対象
     * !!!overwrite!!! Sprite_Damage.setup
     */
    Sprite_Damage.prototype.setup = function(target) {
        const result = target.result();
        this._critical = result.critical;
        if (this._critical && textCritical) {
            this._colorType = 0; // ColorManager.damageColor()の引数に渡る
                                 // Sprite_Damage.createBitmap()で
                                 // bitmap.textColor に ColorManager.damageColor(_colorType)として
                                 // 設定される。
            this.createCritical();
        }
        this._damageXMove = this.damageXMove(target);
        if ((result.missed || result.evaded) && textMiss) {
            this._colorType = 0;
            this.createMiss();
        } else {
            // 効果的かどうかをポップアップさせる。
            if ((result.hpAffected) && (result.hpDamage < 0) && (result.elementRate < 0) && textAbsorb) {
                this.createAbsorb();
            } else if ((result.elementRate > 0) && (result.elementRate < ineffectiveRate) && textIneffective) {
                this.createIneffective();
            } else if ((result.elementRate > effectiveRate) && textEffective) {
                this.createEffective();
            }
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
        if (textAddedState) {
            for (const state of result.addedStates) {
                // state : ステートID
                this.createAddRemoveState(state, true);
            }
        }
        if (textRemovedState) {
            for (const state of result.removedStates) {
                // state : ステートID
                this.createAddRemoveState(state, false);
            }
        }

    };

    /**
     * X方向移動量を得る。
     * 
     * @param {Game_Battler} target ポップアップ対象
     * @returns {number} X方向移動量。
     */
    Sprite_Damage.prototype.damageXMove = function(target) {
        const result = target.result();
        // Note: 動かそうかと思ったけれど、
        //       なんか判定が上手くいかない。
        //       たぶん target.isAlive() && result.mpDamage に引っかかってる。
        if ((result.hpAffected && (result.hpDamage >= 0))
                /* || (target.isAlive() && result.mpDamage >= 0) */) {
            return damageMoveX;
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
        const w = Math.floor(h * textMiss.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = colorMiss;
        sprite.bitmap.drawText(textMiss, 0, 0, w, h, "center");
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
        const w = Math.floor(h * textCritical.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.TextColor = colorCritical;
        sprite.bitmap.drawText(textCritical, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -40;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateCritical.bind(this);
    };

    /**
     * 吸収表示のスプライトを作成する。
     */
    Sprite_Damage.prototype.createAbsorb = function() {
        const h = this.fontSize();
        const w = Math.floor(h * textAbsorb.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = colorAbsorb;
        sprite.bitmap.drawText(textAbsorb, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -40;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateAbsorb.bind(this);
    };

    /**
     * 効果的表示のスプライトを作成する。
     */
    Sprite_Damage.prototype.createEffective = function() {
        const h = this.fontSize();
        const w = Math.floor(h * textEffective.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = colorEffective;
        sprite.bitmap.drawText(textEffective, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -40;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateEffective.bind(this);
    };

    /**
     * 効果的表示のスプライトを作成する。
     */
    Sprite_Damage.prototype.createIneffective = function() {
        const h = this.fontSize();
        const w = Math.floor(h * textIneffective.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = colorIneffective;
        sprite.bitmap.drawText(textIneffective, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -40;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateEffective.bind(this);
    };

    /**
     * 追加または解除されたステートのポップアップを作成する。
     * 
     * @param {number} stateId ステートID
     * @param {boolean} isAdded 追加された場合にはtrue, 解除された場合にはfalse
     */
    Sprite_Damage.prototype.createAddRemoveState = function(stateId, isAdded) {
        const state = $dataStates[stateId];
        if (!state || !state.message1 || state.meta.noPopup) {
            return ;
        }
        const text = isAdded ? textAddedState.format(state.name) : textRemovedState.format(state.name);
        if (text.length == 0) {
            return ;
        }
        const h = this.fontSize();
        const w = Math.floor(h * text.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = isAdded ? colorAddedState : colorRemovedState;
        sprite.bitmap.drawText(text, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = 0;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.wait = this._duration - fadeOutDuration;
        sprite.updatePosition = this.updateAddRemoveState.bind(this);

        this._duration += fadeOutDuration;
    };

    /**
     * 数値スプライトを作成する。
     * 
     * @param {number} value 表示する値
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
            sprite.ry = baseY; // ry : 実数y
            sprite.dy = 10; // dy: 速度
            sprite.ay = 0.5; // ay: 加速度 
            sprite.rx = sprite.x; // rx : 実数x
            sprite.wait = i * 8; // 左から順番に表示していく。
            sprite.visible = sprite.wait === 0;
            sprite.updatePosition = this.updateDigits.bind(this);
            sprite.scale.x = 0.8;
            sprite.scale.y = 0.8;
        }
    };

    /**
     * 表示文字サイズを取得する。
     * 
     * @returns {number} 文字サイズ
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
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + popupDuration)) {
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
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + popupDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };

    /**
     * 吸収表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。
     */
    Sprite_Damage.prototype.updateAbsorb = function(sprite) {
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + fadeOutDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };

    /**
     * 効果的表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。
     */
    Sprite_Damage.prototype.updateEffective = function(sprite) {
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + fadeOutDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };

    /**
     * 効果なし表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。
     */
    Sprite_Damage.prototype.updateIneffective = function(sprite) {
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + popupDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };

    /**
     * ステート付与/解除ポップアップ表示Spriteを更新する。
     * Y=-60から上に移動する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。1つのSpriteが1桁の数値を表示している。
     */
    Sprite_Damage.prototype.updateAddRemoveState = function(sprite) {
        if (sprite.wait > 0) {
            sprite.wait--;
            return;
        }
        sprite.y -= 1;
        const moveFrameCount = -60 - sprite.y;

        // 上に移動
        if (moveFrameCount < 10) {
            sprite.opacity = Math.min(255, sprite.opacity + 25);
        } else if (moveFrameCount > 50) { // 消す
            sprite.opacity = Math.max(0, sprite.opacity - 25);
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

        if (this._frameCount > (fadeInDuration + popupDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 25);
            }
            sprite.x += 3;
        }
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
