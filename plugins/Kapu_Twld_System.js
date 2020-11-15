/*:ja
 * @target MZ 
 * @plugindesc TWLDシステムプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * @base Kapu_Base_Hit
 * @orderAfter Kapu_Base_Hit
 * @base Kapu_Twld_BasicParams
 * @orderAfter Kapu_Twld_BasicParams
 * @base Kapu_UniqueTraits
 * @base Kapu_Twld_LukSystem
 * 
 * @param passiveSkillType
 * @text パッシブスキルタイプ
 * @desc パッシブスキルとして扱うスキルタイプ
 * @type number
 * @default 0
 * 
 * @help 
 * TWLD向けに、システムの計算式や挙動を変更するプラグイン。
 * 基本的にオーバーライドメソッドで構成される。
 * 
 * 
 * 1.パラメータの計算変更
 *   MaxHP/MaxMP/ATK/DEF/MAT/MDF/AGI/LUKの計算式
 *   ベーシックシステムでは
 *       {(クラス値)+(種増減分)+(装備品)} x (特性レート) x (バフ増減レート)
 *   となっていた。これを
 *       [{(パラメータベース値計算式) + (種増加分)}x (特性によるレート) + (装備品)] x (バフ増減レート)
 *   に変更する。
 * 
 * 2.パーティーアビリティの有効判定
 *   ベーシックシステムでは死亡メンバーが持っているアビリティも対象となっていた。
 *   TWLDでは死亡メンバーを除くように変更する。
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * パッシブスキルタイプとして
 * Game_BattlerBase.PASSIVE_SKILL_TYPE を定義します。
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
    const pluginName = "Kapu_Twld_System";
    const parameters = PluginManager.parameters(pluginName);
    
    Game_BattlerBase.PASSIVE_SKILL_TYPE = Number(parameters["passiveSkillType"]) || 0;




    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * MaxHP/MaxMP/ATK/DEF/MATK/MDEFパラメータの増幅率を得る。
     * 
     * @return {Number} 増幅率
     * !!!overwrite!!! Game_BattlerBase.paramRate()
     *     基本パラメータの割合増加を加算合成に変更するため、オーバーライドする。
     */
    Game_BattlerBase.prototype.paramRate = function(paramId) {
        // 基本パラメータを乗算レートでやると、めっちゃ大きくなるのでやめる。
        const rate = this.traitsWithId(Game_BattlerBase.TRAIT_PARAM, paramId).reduce((r, trait) => {
            return r + (trait.value - 1);
        }, 1.0, this);
        return Math.max(0, rate);
    };

    //------------------------------------------------------------------------------
    // Game_Actor


    /**
     * パッシブスキルを持っているかどうかを判定する。
     * 
     * @return {Boolean} パッシブスキルを持っている場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.hasPassiveSkill = function() {
        return this.skills().some(function(skill) {
            return skill && (skill.stypeId == Game_BattlerBase.PASSIVE_SKILL_TYPE);
        });
    };
    
    const _Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;

    /**
     * skillIdで指定されるスキルを習得する。
     * 
     * @param {Number} skillId スキルID
     */
    Game_Actor.prototype.learnSkill = function(skillId) {
        _Game_Actor_learnSkill.call(this, skillId);

        // スキル並び順に登録されてなかったら末尾に追加。
        if (!this._skillOrder.includes(skillId)) {
            this._skillOrder.push(skillId);
        }
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

    //------------------------------------------------------------------------------
    // Game_Party
    
    /**
     * ablitiyIdで指定されるdataIdのパーティーアビリティを持っているかどうかを判定する。
     * 
     * Note: ベーシックシステムではアクターがDead状態でもスキルがあるかどうかを判定していた。
     * 
     * @param {Number} abilityId アビリティID
     * !!!overwrite!!! Game_Party.partyAbility()
     *     パーティーアビリティ有無は生存メンバーだけ対象にするため、オーバーライドする。
     */
    Game_Party.prototype.partyAbility = function(abilityId) {
        return this.battleMembers().some(function(actor) {
            return !actor.isDead() && actor.partyAbility(abilityId);
        });
    };



})();