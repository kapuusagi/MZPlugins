/*:ja
 * @target MZ 
 * @plugindesc Kapu_ContinuousSkillをTargetManagerに反映させるためのプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_ContinuousSkill
 * @orderAfter Kapu_Targetmanager
 * 
 * @help 
 * Kapu_ContinuousSkillをTargetManagerに反映させるためのプラグイン。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * ============================================
 * ノートタグ
 * ============================================
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_ContinuousSkill_TargetManager";

    //------------------------------------------------------------------------------
    // BattleManager
    /**
     * 連続スキルを発動する。
     * !!!overwrite!!! BattleManager.startContinuousSkill
     *     発動処理のアニメーションと適用対象を分割するため、オーバーライドする。
     */
     BattleManager.startContinousSkill = function() {
        const subject = this._subject;
        const skill = this._action.item();
        let action = null;
        let animationTargets = null;

        // 連続スキル発動。
        if(skill.continuousSkill.resetTargets) {
            action = new Game_Action(subject);
            action.setSkill(skill.continuousSkill.id);
            animationTargets = action.makeTargets();
            this._targets = action.makeEffectiveTargets();
            this._action = action; 
        } else {
            action = this._action;
            animationTargets = action.makeTargets();
            this._action.setSkill(skill.continuousSkill.id);
            this._targets = this._savedActionTargets.concat();
        }

        if (skill.continuousSkill.consume) {
            subject.useItem(action.item());
        }

        this._isContinuousSkill = true;
        // アニメーション
        const nextSkill = this._action.item();
        this._logWindow.showAnimation(subject, animationTargets.clone(), nextSkill.animationId);
    };
    //------------------------------------------------------------------------------
    // BattleManager
    // /**
    //  * ビジーかどうかを取得する。
    //  * 
    //  * @return {boolean} ビジーな場合にはtrue, それ以外はfalse.
    //  */
    //  BattleManager.isBusy = function() {
    //     // Note : 実験
    //     //     (1) this._spriteset.isBusy()をコメントアウトすると、
    //     //         全然待たなくなる。


    //     // return (
    //     //     $gameMessage.isBusy() ||
    //     //     this._spriteset.isBusy() ||
    //     //     this._logWindow.isBusy()
    //     // );

    //     const isMsgBusy = $gameMessage.isBusy();

    //     // spritesetBusyを抜くと一度に全部表示される。そのため不可。
    //     const isSpritesetBusy = this._spriteset.isBusy();
    //     // const isSpritesetBusy = false;

    //     // this._logWindow.isBusy()を抜くと、最初のアクションと次のアクションが重なって表示される。
    //     const isLogWindowBusy = this._logWindow.isBusy();
    //     //const isLogWindowBusy = (this._phase !== "action") && this._logWindow.isBusy();

    //     const isBusy = isMsgBusy || isSpritesetBusy || isLogWindowBusy;
    //     // if (isBusy) {
    //     //     console.log("Busy:msg=" + isMsgBusy + " spriteset=" + isSpritesetBusy + " logWindow=" + isLogWindowBusy);
    //     // }

    //     return isBusy;
    // };

    // /**
    //  * ビジーかどうかを判定する。
    //  * 
    //  * @return {boolean} ビジーな場合にはtrue, それ以外はfalse
    //  */
    // Spriteset_Battle.prototype.isBusy = function() {
    //     const isAnimationPlaying = this.isAnimationPlaying();
    //     const isAnyoneMoving = this.isAnyoneMoving();

    //     return isAnimationPlaying || isAnyoneMoving;
    // };
    // /**
    //  * アニメーションを再生中かどうかを取得する。
    //  * @return {boolean} アニメーションを再生中の場合にはtrue, それ以外はfalse.
    //  */
    // Spriteset_Base.prototype.isAnimationPlaying = function() {
    //     return this._animationSprites.some(sprite => sprite.isPlaying());
    //     // if (this._animationSprites.length > 0) {
    //     //     console.log("aniSprite=" + this._animationSprites.length);
    //     //     return true;
    //     // } else {
    //     //     return false;
    //     // }
    //     // return this._animationSprites.length > 0;
    // };
})();