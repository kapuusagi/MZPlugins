/*:ja
 * @target MZ
 * @plugindesc 独自シーンを使った場合のアニメーションテスト。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 *
 * =================================================================
 * プラグインコマンド
 * =================================================================
 * ■ runAnimation
 * @command runAnimation
 * @text アニメーション表示
 * @desc 所定のアニメーションを表示する。
 * 
 * @arg animationId
 * @text アニメーション
 * @desc 表示するアニメーション
 * @type animation
 * 
 * @arg mirror
 * @text 反転
 * @desc 反転させるかどうか。
 * @type boolean
 * @default false
 * 
 * 
 * @help 
 * Sceneを使う実験プラグイン その1。
 * プラグイン作成時にアニメーションが使えるのかどうかを調べる目的のもの。
 * その1は Spriteset_Baseを使った実現方法。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 初版
 */

(() => {
    "use strict"

    const pluginName = "Kapu_SandBox_Animation";

    PluginManager.registerCommand(pluginName, "runAnimation", args => {
        const animationId = args.animationId || 0;
        const mirror = args.mirror || false;
        SceneManager.push(Scene_RunAnimation);
        SceneManager.prepareNextScene(animationId, mirror);
    });

    /**
     * Spriteset_RunAnimation。
     * 
     * Spriteset_Baseのロジックを使ってアニメーションを表示させるためのもの。
     */
    function Spriteset_RunAnimation() {
        this.initialize(...arguments);
    };

    Spriteset_RunAnimation.prototype = Object.create(Spriteset_Base.prototype);
    Spriteset_RunAnimation.prototype.constructor = Spriteset_RunAnimation;

    Spriteset_RunAnimation.prototype.initialize = function () {
        Spriteset_Base.prototype.initialize.call(this);
    };

    /**
     * 下位レイヤーを構築する。
     */
    Spriteset_RunAnimation.prototype.createLowerLayer = function () {
        Spriteset_Base.prototype.createLowerLayer.call(this);
        this._blackScreen.visible = false; // ブラックスクリーンは使用しないので無効化。
        this.createTargetSprite();
        this.createEffectsContainer();
    };

    /**
     * ターゲットスプライトを作成する。
     */
    Spriteset_RunAnimation.prototype.createTargetSprite = function () {
        // なんだかよくわからないけど、画面サイズと同じサイズのターゲットSpriteを用意して
        // よくわからんオフセットを設定すると位置的に上手くいくみたい。なんでだ？
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        this._centerSprite = new Sprite();
        this._centerSprite.x = Graphics.boxWidth / 2;
        this._centerSprite.y = Graphics.boxHeight / 2 + height / 2;
        this._centerSprite.bitmap = new Bitmap(width, height);
        this._centerSprite.setFrame(0, 0, width, height);
        this._baseSprite.addChild(this._centerSprite);
    };

    /**
     * エフェクトコンテナを構築する。
     */
    Spriteset_RunAnimation.prototype.createEffectsContainer = function () {
        this._effectsContainer = new Sprite();
        this._baseSprite.addChild(this._effectsContainer);
    };

    /**
     * アニメーションさせる対象のスプライトを得る。
     * @return {Sprite} アニメーション対象のスプライト
     */
    Spriteset_RunAnimation.prototype.findTargetSprite = function ( /* target */) {
        return this._centerSprite;
    };

    /**
     * アニメーション表示シーン。
     */
    function Scene_RunAnimation() {
        this.initialize(...arguments);
    }

    Scene_RunAnimation.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_RunAnimation.prototype.constructor = Scene_RunAnimation;

    /**
     * Scene_RunAnimationを初期化する。
     */
    Scene_RunAnimation.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
        this._animationId = 0;
        this._mirror = false;
    };

    /**
     * シーンの準備をする。
     * @param {Number} アニメーションID
     * @param {Boolean} 反転させるかどうか。
     */
    Scene_RunAnimation.prototype.prepare = function (animationId, mirror) {
        this._animationId = animationId;
        this._mirror = mirror;
    };

    /**
     * シーンを作成する。
     */
    Scene_RunAnimation.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this._spritesetRunAnimation = new Spriteset_RunAnimation();
        this.addChild(this._spritesetRunAnimation);
    };

    /**
     * シーンを開始する。
     */
    Scene_RunAnimation.prototype.start = function () {
        Scene_MenuBase.prototype.start.call(this);
        $gameTemp.requestAnimation([this._spritesetRunAnimation], this._animationId, this._mirror);
    };

    /**
     * シーンを更新する。
     */
    Scene_RunAnimation.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (!this._spritesetRunAnimation.isAnimationPlaying()) {
            SceneManager.pop();
        }
    };

    /**
     * ビジーかどうかを判定する。
     */
    Scene_RunAnimation.prototype.isBusy = function () {
        return this._spritesetRunAnimation.isAnimationPlaying();
    };

})();