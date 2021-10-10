/*:ja
 * @target MZ 
 * @plugindesc TWLD向けダメージエフェクトプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Twld_BattleSystem
 * @orderAfter Kapu_Twld_BattleSystem
 * 
 * @param damageMoveXRandom
 * @text ダメージポップアップ方向ランダム
 * @desc ダメージポップアップX方向移動をランダムにする。
 * @type boolean
 * @default false
 * 
 * @param damageMoveX
 * @text ダメージポップアップX方向移動距離
 * @desc ダメージポップさせたとき、垂直方向の移動が止まるまで、毎フレームこの値だけ水平方向に移動する。
 * @type number
 * @decimals 2
 * @default 0.00
 * @min -5.00
 * @max 5.00
 * 
 * @param multiplePopupOffsetX
 * @text 同時ポップアップオフセットX
 * @desc 連続してダメージポップアップさせるとき、前の表示からずらす水平ピクセル数。(正数で右にずれる)
 * @type number
 * @default 8
 * @min -255
 * @max 255
 * 
 * @param multiplePopupOffsetY
 * @text 同時ポップアップオフセットY
 * @desc 連続してダメージポップアップさせるとき、前の表示からずらす垂直ピクセル数。(正数で上にずれる)
 * @type number
 * @default 16
 * @min -255
 * @max 255
 * 
 * @param noDispStateIds
 * @text 付与/解除を表示させないステートID
 * @desc 付与/解除を表示させないステートID
 * @type state[]
 * @default ["1"]
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
 * @default #ffffff
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
 * @param statePopupDuration
 * @text ステートポップアップ長
 * @desc ステート追加/解除をポップアップさせる時間[フレーム数]
 * @type number
 * @default 80
 * 
 * @param textAddedBuff
 * @text 追加されたバフポップアップテキスト
 * @desc 追加されたバフポップアップテキスト。%1にパラメータ名。空にするとポップアップさせない。
 * @type string
 * @default %1上昇
 * 
 * @param colorAddedBuff
 * @text 追加バフ文字色
 * @desc 追加バフ文字色
 * @type string
 * @default #FFB000
 * @parent textAddedBuff
 * 
 * @param textAddedDebuff
 * @text 追加されたデバフポップアップテキスト
 * @desc 追加されたデバフポップアップテキスト。%1にパラメータ名。カアにするとポップアップさせない。
 * @string
 * @default %1低下
 * 
 * @param colorAddedDebuff
 * @text 追加デバフ文字色
 * @desc 追加デバフ文字色
 * @type string
 * @default #0080B0
 * @parent textAddedDebuff
 * 
 * @param textRemovedBuff
 * @text 解除されたバフ/デバフポップアップテキスト
 * @desc 解除されたバフ/デバフポップアップテキスト。%1にステート名。空にするとポップアップさせない。
 * @type string
 * @default #808080
 * @default %1通常
 * 
 * @param colorRemovedBuff
 * @text 解除バフ/デバフ文字色
 * @desc 解除バフ/デバフ文字色
 * @type string
 * @default #ffffff
 * @parent textRemovedBuff
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
 * @param textReflection
 * @text 反射メッセージ
 * @desc 反射時メッセージ。空にするとポップアップさせない。
 * @type string
 * @default Reflect!!
 * 
 * @param colorReflection
 * @text 反射文字カラー
 * @desc 反射メッセージの色
 * @type string
 * @default #ff80ff
 * @parent textReflection
 * 
 * @param textCounter
 * @text カウンターメッセージ
 * @desc カウンター時のメッセージ。空にするとポップアップさせない。
 * @type string
 * @default Counter!!
 * 
 * @param colorCounter
 * @text カウンターカラー
 * @desc カウンターメッセージの色
 * @type string
 * @default #8080ff
 * @parent textCounter
 *  
 * @param colorHpDamage
 * @text HPダメージカラー
 * @desc HPダメージ数値の色
 * @type string
 * @default #ffffff
 * 
 * @param colorHpRecover
 * @text HPリカバリーカラー
 * @desc HP回復数値の色
 * @type string
 * @default #80ff80
 * 
 * @param colorHpNoDamage
 * @text HPノーダメージカラー
 * @desc HPノーダメージ数値の色
 * @type string
 * @default #ffffff
 * 
 * @param colorMpDamage
 * @text MPダメージカラー
 * @desc MPダメージ数値の色
 * @type string
 * @default #ff8080
 * 
 * @param colorMpRecover
 * @text MPリカバリーカラー
 * @desc MP回復数値の色
 * @type string
 * @default #ff80ff
 * 
 * @param colorTpDamage
 * @text TPダメージカラー
 * @desc TPダメージ数値の色
 * @type string
 * @default #b4b440
 * 
 * @param colorTpRecover
 * @text TP回復カラー
 * @desc TP回復数値の色
 * @type string
 * @default #ffff40
 * 
 * 
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

    const multiplePopupOffsetX = Math.max(0, Math.round(Number(parameters["multiplePopupOffsetX"]) || 8));
    const multiplePopupOffsetY = Math.max(0, Math.round(Number(parameters["multiplePopupOffsetY"]) || 16));

    const colorHpDamage = parameters["colorHpDamage"] || "#ffffff";
    const colorHpRecover = parameters["colorHpRecover"] || "#80ff80";
    const colorHpNoDamage = parameters["colorHpNoDamage"] || "#ffffff";
    const colorMpDamage = parameters["colorMpDamage"] || "#ff8080";
    const colorMpRecover = parameters["colorMpRecover"] || "#ff80ff";
    const colorTpDamage = parameters["colorTpDamage"] || "#b4b440";
    const colorTpRecover = parameters["colorTpRecover"] || "#ffff40";

    const textAddedState = parameters["textAddedState"] || "";
    const colorAddedState = parameters["colorAddedState"] || "#ffffff";
    const textRemovedState = parameters["textRemovedState"] || "";
    const colorRemovedState = parameters["colorRemovedState"] || "#808080";
    const statePopupDuration = Math.max(0, Number("statePopupDuration") || 90);

    const textAddedBuff = parameters["textAddedBuff"] || "";
    const colorAddedBuff = parameters["colorAddedBuff"] || "#ffb000";
    const textAddedDebuff = parameters["textAddedDebuff"] || "";
    const colorAddedDebuff = parameters["colorAddedDebuff"] || "#0080b0"
    const textRemovedBuff = parameters["textRemovedBuff"] || "";
    const colorRemovedBuff = parameters["colorRemovedBuff"] || "#808080";

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
    const textReflection = parameters["textReflection"] || "";
    const colorReflection = parameters["colorReflection"] || "#ff80ff";
    const textCounter = parameters["textCounter"] || "";
    const colorCounter = parameters["colorCounter"] || "#8080ff"

    const damageMoveXRandom = (parameters["damageMoveXRandom"] === undefined)
            ? false : (parameters["damageMoveXRandom"] === "true");
    const damageMoveX = Number(parameters["damageMoveX"]) || 0.0;

    const noDispStateIds = [];
    try {
        const ids = JSON.parse(parameters["noDispStateIds"] || "[]").map(token => Number(token));
        for (const id of ids) {
            if (!noDispStateIds.includes(id)) {
                noDispStateIds.push(id);
            }
        }

    }
    catch (e) {
        console.error(e);
    }

    const baseY = 40;

    const _Game_Battler_initMembers = Game_Battler.prototype.initMembers;

    //------------------------------------------------------------------------------
    // Game_Battlerの変更
    /**
     * メンバーを初期化する。
     */
    Game_Battler.prototype.initMembers = function() {
        _Game_Battler_initMembers.call(this);
        this._counterPopup = false; // カウンターポップアップ
        this._reflectionPopup = false; // リフレクションポップアップ
    };

    /**
     * カウンターポップアップフラグをクリアする。
     */
    Game_Battler.prototype.clearCounterPopup = function() {
        this._counterPopup = false;
    };

    /**
     * カウンターポップアップ要求が出ているかどうかを得る。
     * 
     * @returns {boolean} 要求が出ている場合にはtrue, それ以外はfalse.
     */
    Game_Battler.prototype.isCounterPopupRequested = function() {
        return this._counterPopup || false;
    };

    /**
     * カウンターポップアップを開始する。
     */
    Game_Battler.prototype.startCounterPopup = function() {
        this._counterPopup = true;
    };

    /**
     * 反射ポップアップフラグをクリアする。
     */
    Game_Battler.prototype.clearReflectionPopup = function() {
        this._reflectionPopup = false;
    };

    /**
     * 反射ポップアップ要求が出ているかどうかを得る。
     * 
     * @returns {boolean} 反射ポップアップ要求が出ている場合にはtrue, それ以外はfalse.
     */
    Game_Battler.prototype.isReflectionPopupRequested = function() {
        return this._reflectionPopup || false;
    };

    /**
     * 反射ポップアップを開始する。
     */
    Game_Battler.prototype.startReflectionPopup = function() {
        this._reflectionPopup = true;
    };


    //------------------------------------------------------------------------------
    // Sprite_Damage
    const _Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
    /**
     * Sprite_Damageを初期化する。
     */
    Sprite_Damage.prototype.initialize = function() {
        _Sprite_Damage_initialize.call(this);
        this._displayWait = 0;
        this._stateDisplayNo = 0;
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
        this._damageXMove = this.damageXMove(target.isAlive(), result);
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
            if (result.hpDamage > 0) {
                this.createDigitsWithColor(result.hpDamage, colorHpDamage);
            } else if (result.hpDamage < 0) {
                this.createDigitsWithColor(result.hpDamage, colorHpRecover);
            } else {
                if (result.hpAffected) {
                    this.createDigitsWithColor(result.hpDamage, colorHpNoDamage);
                }
            }
            if (target.isAlive()) {
                if (result.mpDamage > 0) {
                    this.createDigitsWithColor(result.mpDamage, colorMpDamage);
                } else if (result.mpDamage < 0) {
                    this.createDigitsWithColor(result.mpDamage, colorMpRecover);
                }
                if (result.tpDamage > 0) {
                    this.createDigitsWithColor(result.tpDamage, colorTpDamage);
                } else if (result.tpDamage < 0) {
                    this.createDigitsWithColor(result.tpDamage, colorTpRecover);
                }
            }
            if (result.critical) {
                this.setupCriticalEffect();
            } else {
                this.setupNormalEffect();
            }
        }

        this.setupBufStatePopup(target);
    };

    /**
     * バフとステートの変化をポップアップさせる。
     * 
     * @param {Game_Battler} target 対象
     */
    Sprite_Damage.prototype.setupBufStatePopup = function(target) {
        const result = target.result();
        if (textRemovedState && (statePopupDuration > 0)) {
            for (const stateId of result.removedStates) {
                if (!target.isStateAffected(stateId)) {
                    this.createAddRemoveState(stateId, false);
                }
            }
        }
        if (textRemovedBuff && (statePopupDuration > 0)) {
            for (const paramId of result.addedBuffs) {
                if (!target.isBuffAffected(paramId)) {
                    this.createAddRemoveBuff(paramId, 0);
                }
            }
        }
        if (textAddedState && (statePopupDuration > 0)) {
            for (const stateId of result.addedStates) {
                if (target.isStateAffected(stateId)) {
                    this.createAddRemoveState(stateId, true);
                }
            }
        }
        if (textAddedDebuff && (statePopupDuration > 0)) {
            for (const paramId of result.addedDebuffs) {
                if (target.isDebuffAffected(paramId)) {
                    this.createAddRemoveBuff(paramId, -1);
                }
            }
        }
        if (textAddedBuff && (statePopupDuration > 0)) {
            for (const paramId of result.removedBuffs) {
                if (target.isBuffAffected(paramId)) {
                    this.createAddRemoveBuff(paramId, 1);
                }
            }
        }
    };

    /**
     * X方向移動量を得る。
     * 
     * @param {boolean} isAlive ターゲットが生存しているかどうか。
     * @param {object} result 結果
     * @returns {number} X方向移動量。
     */
    Sprite_Damage.prototype.damageXMove = function(isAlive, result) {
        // Note: 動かそうかと思ったけれど、
        //       なんか判定が上手くいかない。
        //       たぶん target.isAlive() && result.mpDamage に引っかかってる。
        if ((result.hpAffected && (result.hpDamage >= 0))
                || (isAlive && result.mpDamage >= 0)) {
            if (damageMoveXRandom) {
                return Math.random() * damageMoveX * 2 - damageMoveX;
            } else {
                return damageMoveX;
            }
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
        sprite.bitmap.fontItalic = true;
        sprite.bitmap.drawText(textMiss, 0, 0, w, h, "center");
        sprite.anchor.y = 0.5;
        sprite.dy = 0;
        sprite.opacity = 0;
        sprite.x = -3 * fadeInDuration;
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
        sprite.bitmap.fontItalic = true;
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
        sprite.bitmap.fontItalic = true;
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
        sprite.bitmap.fontItalic = true;
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
        sprite.bitmap.fontItalic = true;
        sprite.bitmap.drawText(textIneffective, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -40;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateEffective.bind(this);
    };



    /**
     * 数値スプライトを作成する。
     * 
     * @param {number} value 表示する値
     * @param {string} valueColor 値の色
     */
    Sprite_Damage.prototype.createDigitsWithColor = function(value, valueColor) {
        const string = Math.abs(value).toString();
        const h = this.fontSize();
        const w = Math.floor(h * 0.75);
        for (let i = 0; i < string.length; i++) {
            const sprite = this.createChildSprite(w, h);
            sprite.bitmap.textColor = valueColor;
            sprite.bitmap.drawText(string[i], 0, 0, w, h, "center");
            sprite.x = (i - (string.length - 1) / 2) * w;
            sprite.ry = baseY; // ry : 実数y
            sprite.dy = 10; // dy: 速度
            sprite.ay = 0.5; // ay: 加速度 
            sprite.rx = sprite.x; // rx : 実数x
            sprite.wait = this._displayWait + i * 8; // 左から順番に表示していく。
            sprite.visible = sprite.wait === 0;
            sprite.updatePosition = this.updateDigits.bind(this);
            sprite.scale.x = 0.8;
            sprite.scale.y = 0.8;
        }
        this._displayWait += 30;
        this._duration += 30;
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
     * 追加または解除されたステートのポップアップを作成する。
     * 
     * @param {number} stateId ステートID
     * @param {boolean} isAdded 追加された場合にはtrue, 解除された場合にはfalse.
     * @returns {boolean} 追加した場合にはtrue, 追加しない場合にはfalse.
     */
    Sprite_Damage.prototype.createAddRemoveState = function(stateId, isAdded) {
        const state = $dataStates[stateId];
        if (noDispStateIds.includes(stateId) || !state || !state.message1 || state.meta.noPopup) {
            return false;
        }

        const text = isAdded ? textAddedState.format(state.name) : textRemovedState.format(state.name);
        if (text.length === 0) {
            return false;
        }

        const textColor = isAdded ? colorAddedState : colorRemovedState;
        this.createBuffStateSprite(text, textColor);
        return true;
    };
    /**
     * 追加または解除されたバフのポップアップを作成する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} type タイプ(>0:バフ, <0:デバフ, 0:解除)
     * @returns {boolean} 追加した場合にはtrue, 追加しない場合にはfalse.
     */
    Sprite_Damage.prototype.createAddRemoveBuff = function(paramId, type) {
        let text = "";
        let textColor = "";
        if (type > 0) {
            text = textAddedBuff.format(TextManager.param(paramId));
            textColor = colorAddedBuff;
        } else if (type < 0) {
            text = textAddedDebuff.format(TextManager.param(paramId));
            textColor = colorAddedDebuff;
        } else {
            text = textRemovedBuff.format(TextManager.param(paramId));
            textColor = colorRemovedBuff;
        }
        if (text.length === 0) {
            return false;
        }
        this.createBuffStateSprite(text, textColor)

        return true;
    };

    /**
     * バフ・デバフのポップアップスプライトを作成する。
     * 
     * @param {string} text 文字
     * @param {string} textColor 文字色
     */
    Sprite_Damage.prototype.createBuffStateSprite = function(text, textColor) {
        const fontSize = $gameSystem.mainFontSize();
        const displayableCount = Math.max(1, Math.floor(140 / (fontSize + 8)));
        const stateWaitOffset = popupDuration - fadeInDuration
                + Math.floor(this._stateDisplayNo / displayableCount) * (statePopupDuration - 10)
                + (this._stateDisplayNo % 4) * 10 + this._displayWait;

        const h = fontSize;
        const w = Math.floor(h * text.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = textColor;
        sprite.bitmap.fontSize = fontSize;
        sprite.bitmap.drawText(text, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -10 + this._stateDisplayNo % displayableCount * 5;
        sprite.y = -140 + this._stateDisplayNo % displayableCount * (fontSize + 8);
        sprite.opacity = 0;
        sprite.ry = sprite.y;
        sprite.dy = 0;
        sprite.wait = stateWaitOffset;
        sprite.updatePosition = this.updateAddRemoveState.bind(this);
        sprite.frameCount = 0;

        this._duration += Math.max(0, statePopupDuration - fadeInDuration); // 表示長さだけ延長
        this._stateDisplayNo++;
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

        const frameCount = sprite.frameCount;
        sprite.frameCount++;

        // 上に移動
        if (frameCount < 10) {
            sprite.opacity = Math.min(255, sprite.opacity + 25);
            sprite.x += 1;
        } else if (frameCount > (statePopupDuration - 10)) { // 消す
            sprite.opacity = Math.max(0, sprite.opacity - 25);
            sprite.x += 1;
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

    //------------------------------------------------------------------------------
    // Sprite_BattlePopupText の変更
    /**
     * Sprite_BattlePopupText
     * ポップアップテキストを表示するためのスプライト。
     * Counter/Reflectionの表示を行う。
     */
    function Sprite_BattlePopupText() {
        this.initialize(...arguments);
    }

    Sprite_BattlePopupText.prototype = Object.create(Sprite.prototype);
    Sprite_BattlePopupText.prototype.constructor = Sprite_BattlePopupText;

    /**
     * Sprite_BattlePopupText を初期化する。
     */
    Sprite_BattlePopupText.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._duration = 90;
        this._frameCount = 0;
    };

    /**
     * Sprite_BattlePopupTextを破棄する。
     * 
     * @param {object} options 破棄オブション
     */
    Sprite_BattlePopupText.prototype.destroy = function(options) {
        for (const child of this.children) {
            if (child.bitmap) {
                child.bitmap.destroy();
            }
        }
        Sprite.prototype.destroy.call(this, options);
    };

    /**
     * このスプライトに描画するフォントのサイズを得る。
     * 
     * @returns {number} フォントサイズ
     */
    Sprite_BattlePopupText.prototype.fontSize = function() {
        return $gameSystem.mainFontSize() + 4;
    };

    /**
     * フォントフェースを得る。
     * 
     * @returns {string} フォントフェース
    */
     Sprite_BattlePopupText.prototype.fontFace = function() {
        return $gameSystem.numberFontFace();
    };

    /**
     * Sprite_BattlePopupTextを表示させるための準備をする。
     * 
     * @param {string} text ポップアップテキスト
     * @param {string} textColor テキストカラー
     */
    Sprite_BattlePopupText.prototype.setup = function(text, textColor) {
        const h = this.fontSize();
        const w = Math.floor(h * text.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = textColor;
        sprite.bitmap.fontItalic = true;
        sprite.bitmap.drawText(text, 0, 0, w, h, "center");
        sprite.anchor.y = 0.5;
        sprite.dy = 0;
        sprite.opacity = 0;
        sprite.x = -3 * fadeInDuration;
        sprite.y = -60;
    };

    /**
     * 子スプライトを作成する。
     * 既定の実装では、スプライト下端中央に原点、
     * 基準位置から(0,-40)の位置にスプライトを作成する。
     * 
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    Sprite_BattlePopupText.prototype.createChildSprite = function(width, height) {
        const sprite = new Sprite();
        sprite.bitmap = this.createBitmap(width, height);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.y = -40;
        sprite.ry = sprite.y;
        sprite.opacity = 0;
        this.addChild(sprite);
        return sprite;
    };
    /**
     * Bitmapを作成する。
     * 
     * @param {number} width 幅
     * @param {number} height 高さ
     * @return {Bitmap} Bitmapオブジェクト
     */
    Sprite_BattlePopupText.prototype.createBitmap = function(width, height) {
        const bitmap = new Bitmap(width, height);
        bitmap.fontFace = this.fontFace();
        bitmap.fontSize = this.fontSize();
        bitmap.outlineColor = "rgba(0, 0, 0, 0.7)";
        bitmap.outlineWidth = 4;
        return bitmap;
    };

    /**
     * Sprite_Damageを更新する。
     */
    Sprite_BattlePopupText.prototype.update = function() {
        Sprite.prototype.update.call(this);
        if (this._duration > 0) {
            this._duration--;
            for (const child of this.children) {
                this.updateChild(child);
            }
            this.visible = (this._duration > 0);
        }
    };

    /**
     * このスプライトがアニメーション中かどうかを得る。
     *
     * @returns {boolean} アニメーション中の場合にはtrue, それ以外はfalse
     */
    Sprite_BattlePopupText.prototype.isPlaying = function() {
        return this._duration > 0;
    };

    /**
     * 子スプライトを更新する。
     * 
     * @param {Sprite} sprite 子スプライト
     */
    Sprite_BattlePopupText.prototype.updateChild = function(sprite) {
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


    //------------------------------------------------------------------------------
    // Sprite_Battler の変更
    const _Sprite_Battler_setupDamagePopup = Sprite_Battler.prototype.setupDamagePopup;
    /**
     * ダメージポップアップを準備する。
     * 
     * Note: 対象のバトラーにダメージポップアップ要求がセットされている場合に
     *       Sprite_Damageを作成して情報をポップさせるように動作する。
     */
    Sprite_Battler.prototype.setupDamagePopup = function() {
        this.setupCounterPopup();
        this.setupReflectionPopup();
        _Sprite_Battler_setupDamagePopup.call(this);
    };

    /**
     * ダメージスプライトを作成する。
     * 
     * Note: ベーシックシステムでは、連続して複数のダメージを表示する場合にはちょっとずつ左上にずらす。
     * 
     * !!!overwrite!!! Sprite_Battler.createDamageSprite()
     *     多重にダメージポップアップさせるときのオフセットを調整できるようにするため、オーバーライドする。
     */
    Sprite_Battler.prototype.createDamageSprite = function() {
        const last = this._damages[this._damages.length - 1];
        const sprite = new Sprite_Damage();
        if (last) {
            // 連続表示されているのでずらす。
            sprite.x = last.x + multiplePopupOffsetX;
            sprite.y = last.y - multiplePopupOffsetY;
        } else {
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
        }
        sprite.setup(this._battler);
        this._damages.push(sprite);
        this.parent.addChild(sprite);
    };

    /**
     * カウンターポップアップを準備する。
     */
    Sprite_Battler.prototype.setupCounterPopup = function() {
        if (this._battler.isCounterPopupRequested()) {
            this.createCounterSprite();
            this._battler.clearCounterPopup();
        }
    };

    /**
     * カウンター表示スプライトを作成する。
     */
    Sprite_Battler.prototype.createCounterSprite = function() {
        if (textCounter) {
            const last = this._damages[this._damages.length - 1];
            const sprite = new Sprite_BattlePopupText();
            if (last) {
                // 連続表示されているのでずらす。
                sprite.x = last.x + multiplePopupOffsetX;
                sprite.y = last.y - multiplePopupOffsetY;
            } else {
                sprite.x = this.x + this.damageOffsetX();
                sprite.y = this.y + this.damageOffsetY();
            }
            sprite.setup(textCounter, colorCounter);
            this._damages.push(sprite);
            this.parent.addChild(sprite);
        }
    };

    /**
     * リフレクションポップアップを準備する。
     */
    Sprite_Battler.prototype.setupReflectionPopup = function() {
        if (this._battler.isReflectionPopupRequested()) {
            this.createReflectionSprite();
            this._battler.clearReflectionPopup();
        }
    };

    /**
     * 反射ポップアップを準備する。
     */
    Sprite_Battler.prototype.createReflectionSprite = function() {
        if (textReflection) {
            const last = this._damages[this._damages.length - 1];
            const sprite = new Sprite_BattlePopupText();
            if (last) {
                // 連続表示されているのでずらす。
                sprite.x = last.x + multiplePopupOffsetX;
                sprite.y = last.y - multiplePopupOffsetY;
            } else {
                sprite.x = this.x + this.damageOffsetX();
                sprite.y = this.y + this.damageOffsetY();
            }
            sprite.setup(textReflection, colorReflection);
            this._damages.push(sprite);
            this.parent.addChild(sprite);
        }
    };

    //------------------------------------------------------------------------------
    // Window_BattleLog の変更

    /**
     * HPダメージを表示する。
     * 
     * @param {Game_Battler} target 表示対象
     */
    Window_BattleLog.prototype.displayHpDamage = function(target) {
        if (target.result().hpAffected) {
            if (target.result().hpDamage > 0 && !target.result().drain) {
                this.push("performDamage", target);
            }
            if (target.result().hpDamage < 0) {
                this.push("performRecovery", target);
            }
            //this.push("addText", this.makeHpDamageText(target));
        }
    };

    /**
     * MPダメージを表示する。
     * 
     * @param {Game_Battler} target 表示対象
     */
    Window_BattleLog.prototype.displayMpDamage = function(target) {
        if (target.isAlive() && target.result().mpDamage !== 0) {
            if (target.result().mpDamage < 0) {
                this.push("performRecovery", target);
            }
            //this.push("addText", this.makeMpDamageText(target));
        }
    };

    /**
     * TPダメージを表示する。
     * 
     * @param {Game_Battler} target 表示対象
     */
    Window_BattleLog.prototype.displayTpDamage = function(target) {
        if (target.isAlive() && target.result().tpDamage !== 0) {
            if (target.result().tpDamage < 0) {
                this.push("performRecovery", target);
            }
            //this.push("addText", this.makeTpDamageText(target));
        }
    };    
    /**
     * 対象にクリティカルを表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! Window_BattleLog.displayCritical(target)
     *     クリティカル発動テキストは表示しないため、オーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Window_BattleLog.prototype.displayCritical = function(target) {
        if (!textCritical) {
            if (target.result().critical) {
                if (target.isActor()) {
                    this.push("addText", TextManager.criticalToActor);
                } else {
                    this.push("addText", TextManager.criticalToEnemy);
                }
            }            
        }
    };

    /**
     * 変化したバフを表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!Window_BattleLog.displayChangedBuffs(target)
     *     バフ/デバフのテキストメッセージは表示しないため、オーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Window_BattleLog.prototype.displayChangedBuffs = function(target) {
        const result = target.result();
        if (!textAddedBuff) {
            this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
        }
        if (!textAddedDebuff) {
            this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
        }
        if (!textRemovedBuff) {
            this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
        }
    
    };
    /**
     * 対象のステートが変化されたのを表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!Window_BattleLog.displayChangedStates(target)
     *     ステート変更のメッセージは表示しないため、オーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Window_BattleLog.prototype.displayChangedStates = function(target) {
        if (textAddedState || textRemovedState) {
            const result = target.result();
            const states = result.addedStateObjects();
            if (states.some(state => state.id === target.deathStateId())) {
                this.push("performCollapse", target);
                this.push("waitForEffect");
            }
        } else {
            this.displayAddedStates(target);
            this.displayRemovedStates(target);
        }
    };

    /**
     * ミスした表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! Window_BattleLog.displayMiss(target)
     *     バトルログにミスした表示を出さないためオーバーライドする。
     */
    Window_BattleLog.prototype.displayMiss = function(target) {
        if (textMiss) {
            if (target.result().physical) {
                this.push("performMiss", target);
            }
        } else {
            let fmt;
            if (target.result().physical) {
                const isActor = target.isActor();
                fmt = isActor ? TextManager.actorNoHit : TextManager.enemyNoHit;
                this.push("performMiss", target);
            } else {
                fmt = TextManager.actionFailure;
            }
            this.push("addText", fmt.format(target.name()));
        }
    };

    /**
     * 回避された表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! Window_BattleLog.displayEvasion(target)
     *     メッセージログに回避したメッセージを表示させないため、オーバーライドする。
     */
    Window_BattleLog.prototype.displayEvasion = function(target) {
        if (textMiss) {
            if (target.result().physical) {
                this.push("performEvasion", target);
            } else {
                this.push("performMagicEvasion", target);
            }
        } else {
            let fmt;
            if (target.result().physical) {
                fmt = TextManager.evasion;
                this.push("performEvasion", target);
            } else {
                fmt = TextManager.magicEvasion;
                this.push("performMagicEvasion", target);
            }
            this.push("addText", fmt.format(target.name()));
        }
    };
    /**
     * カウンターを表示する。
     * 
     * @param {Game_Battler} target 対象
     */
    Window_BattleLog.prototype.displayCounter = function(target) {
        this.push("performCounter", target);
        if (textCounter) {
            target.startCounterPopup();
        } else {
            this.push("addText", TextManager.counterAttack.format(target.name()));
        }
    };

    /**
     * 反射を表示する。
     * 
     * @param {Game_Battler} target 対象
     */
    Window_BattleLog.prototype.displayReflection = function(target) {
        this.push("performReflection", target);
        if (textReflection) {
            target.startReflectionPopup();
        } else {
            this.push("addText", TextManager.magicReflection.format(target.name()));
        }
    };
})();
