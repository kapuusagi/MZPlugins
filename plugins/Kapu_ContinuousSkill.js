/*:ja
 * @target MZ 
 * @plugindesc 連続発動スキルプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @help 
 * スキル発動後、連続して別のスキルを発動させるプラグイン。
 * たぶん期待した動作はしない。
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
 * スキル
 *   <continuousSkill:id#,rate#,consume$,resetTarget$>
 *     このスキル発動後、続けて発動するスキルを指定する。
 *     id# : スキルID
 *     rate# : 発動率。(0～1の数値または0%～100%)
 *     consume : trueを指定すると、スキルコストを消費する。
 *               スキルコストが払えない場合には、続けて発動できない。
 *     resetTargets : trueを指定すると、対象をリセットする。
 *                    false指定時は前の対象と同じ標的になる。
 *                    true指定時、対象は固定指定になることを想定している。
 *     
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_ContinuousSkill";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * 値文字列からレートを得る。
     * 
     * @param {string} str 値文字列
     * @returns {number} レート文字列
     */
    const _getRate = function(str) {
        if (str.slice(-1) === "%") {
            return Number(str.slice(0, str.length - 1)) / 100.0;
        } else {
            return Number(str);
        }
    };
    /**
     * スキルのノートタグをパースする。
     * 
     * @param {object} obj DataSkill
     */
    const _processNoteTag = function(obj) {
        if (obj.meta.continuousSkill) {
            const tokens = obj.meta.continuousSkill.split(",");
            if (tokens.length > 0) {
                const skillId = Number(tokens[0]) || 0;
                const rate = (tokens.length >= 2) ? _getRate(tokens[1]) : 1;
                const consume = (tokens.length >= 3) ? (tokens[2] === "true") : false;
                const resetTargets = (tokens.length >= 4) ? (tokens[3] === "true") : false;
                if ((skillId > 0) && (skillId < $dataSkills.length) && (rate > 0)) {
                    obj.continuousSkill = {
                        id : skillId,
                        rate : rate,
                        consume : consume,
                        resetTargets : resetTargets
                    };
                }
            }
        }
    };
    DataManager.addNotetagParserSkills(_processNoteTag);

    //------------------------------------------------------------------------------
    // BattleManager
    const _BattleManager_startAction = BattleManager.startAction;
    /**
     * アクターまたはエネミーのアクションを開始する。
     */
    BattleManager.startAction = function() {
        _BattleManager_startAction.call(this);
        this._savedActionTargets = this._targets.concat();

    }

    const _BattleManager_updateAction = BattleManager.updateAction;
    /**
     * アクターまたはエネミーのアクションを更新する。
     */
    BattleManager.updateAction = function() {
        if ((this._targets.length === 0) && this._action.isSkill()) {
            // 現在のアクションがスキルで次の効果適用対象がいない。
            const skill = this._action.item();
            if (skill.continuousSkill && this.testContinuousSkill()) {
                this.startContinousSkill();
                return ;
            }
        }

        _BattleManager_updateAction.call(this);
    };

    /**
     * 連続スキルを発動する。
     */
    BattleManager.startContinousSkill = function() {
        const subject = this._subject;
        const skill = this._action.item();
        let action = null;

        // 連続スキル発動。
        if(skill.continuousSkill.resetTargets) {
            action = new Game_Action(subject);
            this._action = action;
            action.setSkill(skill.continuousSkill.id);
            this._targets = action.makeTargets(); 
        } else {
            action = this._action;
            action.setSkill(skill.continuousSkill.id);
            this._targets = this._savedActionTargets.concat();
        }

        if (skill.continuousSkill.consume) {
            subject.useItem(action.item());
        }

        // アニメーション
        this._logWindow.showAnimation(subject, this._targets.clone(), skill.animationId);
    };

    /**
     * 連続スキルが発動したかどうかをテストする。
     * 
     * @returns {boolean} 連続スキルが発動した場合にはtrue, それ以外はfalse.
     */
    BattleManager.testContinuousSkill = function() {
        const skill = this._action.item();
        const nextSkill = $dataSkills[skill.continuousSkill.id];
        if (!skill.continuousSkill.consume || this._subject.canPaySkillCost(nextSkill)) {
            const rate = skill.continuousSkill.rate;
            if (Math.random() < rate) {
                // 発動した
                return true;
            }
        }

        return false;
    }

    const _BattleManager_endBattle = BattleManager.endBattle;
    /**
     * 戦闘を終了させる。
     * 本メソッドを呼ぶと、フェーズが"battleEnd"に遷移し、次のupdate()でSceneManager.pop()がコールされる。
     * 
     * @param {number} result 戦闘結果(0:勝利 , 1:中断(逃走を含む), 2:敗北)
     */
    BattleManager.endBattle = function(result) {
        this._savedActionTargets = null;
        _BattleManager_endBattle.call(this, result);
    };
})();