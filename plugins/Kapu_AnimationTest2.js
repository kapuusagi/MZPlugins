/*:
 * @target MZ
 * @plugindesc 独自シーンを使った場合のアニメーションテスト その2。
 * @author kapuusagi
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
 * Sceneを使う実験プラグイン。
 * プラグイン作成時にアニメーションが使えるのかどうかを調べる目的のもの。
 * その2は Sprite ベースでやれるかのお試し。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 初版
 */

(() => {
    'use strict'

    const pluginName = 'Kapu_AnimationTest2';

    PluginManager.registerCommand(pluginName, 'runAnimation', args => {
        const animationId = args.animationId || 0;
        const mirror = args.mirror || false;
        SceneManager.push(Scene_RunAnimation2);
        SceneManager.prepareNextScene(animationId, mirror);
    });

    /**
     * アニメーション表示シーン。
     */
    function Scene_RunAnimation2() {
        this.initialize(...arguments);
    }

    Scene_RunAnimation2.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_RunAnimation2.prototype.constructor = Scene_RunAnimation2;

    /**
     * Scene_RunAnimationを初期化する。
     */
    Scene_RunAnimation2.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._animationId = 0;
        this._mirror = false;
    };

    /**
     * シーンの準備をする。
     * @param {Number} アニメーションID
     * @param {Boolean} 反転させるかどうか。
     */
    Scene_RunAnimation2.prototype.prepare = function(animationId, mirror) {
        this._animationId = animationId;
        this._mirror = mirror;
    };

    /**
     * シーンを作成する。
     */
    Scene_RunAnimation2.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createTargetSprite();
    };

    /**
     * アニメーションターゲットスプライトを作成する。
     */
    Scene_RunAnimation2.prototype.createTargetSprite = function() {
        const width = 0;
        const height = 0;
        this._targetSprite = new Sprite();
        this._targetSprite.x = Graphics.boxWidth / 2;
        this._targetSprite.y = Graphics.boxHeight / 2;
        this._targetSprite.setFrame(0, 0, width, height);
        this.addChild(this._targetSprite);
    };

    /**
     * シーンを開始する。
     */
    Scene_RunAnimation2.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this.startAnimation();
    };

    /**
     * アニメーションを開始する。
     */
    Scene_RunAnimation2.prototype.startAnimation = function() {
        const sprite = new Sprite_Animation();
        const targetSprites = [ this._targetSprite ];
        sprite.targetObjects = targetSprites;
        const animation = $dataAnimations[this._animationId];
        sprite.setup(targetSprites, animation, this._mirror, 0, null);
        this._animationSprite = sprite;
        this.addChild(sprite);
    };

    /**
     * シーンを更新する。
     */
    Scene_RunAnimation2.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        if (!this._animationSprite.isPlaying()) {
            this.removeChild(this._animationSprite);
            this._animationSprite.destroy();
            this._animationSprite = null;
            // アニメーション再生終了。
            SceneManager.pop();
        }
    };

    /**
     * ビジーかどうかを判定する。
     * @return {Boolean} ビジーの場合にはtrue, それ以外はfalse.
     */
    Scene_RunAnimation2.prototype.isBusy = function() {
        if (this._animationSprite) {
            return this._animationSprite.isPlaying();
        } else {
            return false;
        }
    };

 })();