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
        this._animationWaitCount = this.animationWaitCount(this._action);
        this._spriteset.setUseAnimationDelay(false);
        this._logWindow.showAnimation(subject, animationTargets.clone(), nextSkill.animationId);
    };

})();