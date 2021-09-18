/*:ja
 * @target MZ 
 * @plugindesc TWLD向けUniqueTrait
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_UniqueTraits
 * @orderAfter Kapu_UniqueTraits
 * 
 * 
 * @help 
 * TWLD向けのUniqueTrait変更です。
 * 1. スキル習得時、該当スキルタイプを自動的に使用可能にする
 *    ベーシックシステムでは、スキルを使用するためには「スキルタイプ追加」の特性が必要です。
 *    (装備やクラスで実現する)
 *    本プラグインでは変更により、スキル習得時、アクターに対してスキルタイプを追加します。
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
 * Version.0.1.0 Kapu_Twld_Systemから分離して作成。
 */
(() => {
    // const pluginName = "Kapu_Twld_UniqueTraits";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;
    /**
     * skillIdで指定されるスキルを習得する。
     * 
     * @param {number} skillId スキルID
     */
    Game_Actor.prototype.learnSkill = function(skillId) {
        _Game_Actor_learnSkill.call(this, skillId);

        // スキルタイプが追加されていなかったら追加する。
        // 尚forget側では実装しない。
        const skill = $dataSkills[skillId];
        if (skill.stypeId > 0) {
            const stypeList = this.addedSkillTypes();
            if (!stypeList.includes(skill.stypeId)) {
                // スキルタイプが無いので追加する。
                this.addUniqueTrait("useSkillType" + skill.stypeId, {
                    code:Game_BattlerBase.TRAIT_STYPE_ADD,
                    dataId:skill.stypeId,
                    value:1,
                })
            }
        }
    };


})();