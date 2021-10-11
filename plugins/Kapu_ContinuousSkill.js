/*:ja
 * @target MZ 
 * @plugindesc 連続発動スキルプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param waitDamageAnimation
 * @text ダメージアニメーションを待つ
 * @desc 連続スキル発動時、ダメージのアニメーションが完了するのを待つ
 * @type boolean
 * @default true
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
 *   <continuousSkill:id#,rate#,consume$,resetTarget$,animationWaitCount#>
 *     このスキル発動後、続けて発動するスキルを指定する。
 *     id# : スキルID
 *     rate# : 発動率。(0～1の数値または0%～100%)
 *     consume : 
 *         trueを指定すると、スキルコストを消費する。
 *         スキルコストが払えない場合には、続けて発動できない。
 *     resetTargets :
 *         trueを指定すると、対象をリセットする。
 *         false指定時は前の対象と同じ標的になる。
 *         true指定時、対象は固定指定になることを想定している。
 *     animationWaitCount :
 *         このアニメーションのウェイト期間[フレーム数]。
 *         アニメーションが開始されてから、このフレーム数だけ経過後に
 *         apply()をコールする。
 *     
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_ContinuousSkill";
    const parameters = PluginManager.parameters(pluginName);
    
    const waitDamageAnimation = (parameters["waitDamageAnimation"] === undefined)
            ? true : (parameters["waitDamageAnimation"] === "true");

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
                const animationWaitCount = (tokens.length >= 5) ? (Number(tokens[4]) || 0) : 0;
                if ((skillId > 0) && (skillId < $dataSkills.length) && (rate > 0)) {
                    obj.continuousSkill = {
                        id : skillId,
                        rate : rate,
                        consume : consume,
                        resetTargets : resetTargets,
                        animationWaitCount : animationWaitCount
                    };
                }
            }
        }
    };
    DataManager.addNotetagParserSkills(_processNoteTag);

    //------------------------------------------------------------------------------
    // BattleManager

    const _BattleManager_initMembers = BattleManager.initMembers;
    /**
     * オブジェクトのメンバーを初期化する。
     */
    BattleManager.initMembers = function() {
        _BattleManager_initMembers.call(this);
        this._animationWaitCount = 0;
    };

    /**
     * アニメーション待機カウントを得る。
     * 
     * @param {Game_Action} action アクション
     * @returns {number} アニメーション待機カウント
     */
    BattleManager.animationWaitCount = function(action) {
        if (action) {
            const item = action.item();
            if (item.continuousSkill) {
                return Number(item.continuousSkill.animationWaitCount) || 0;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    };

    const _BattleManager_startAction = BattleManager.startAction;
    /**
     * アクターまたはエネミーのアクションを開始する。
     */
    BattleManager.startAction = function() {
        this._spriteset.setUseAnimationDelay(true);
        _BattleManager_startAction.call(this);
        this._savedActionTargets = this._targets.concat();
        this._isContinuousSkill = false;

        this._animationWaitCount = this.animationWaitCount(this._action);
    };

    const _BattleManager_updateAction = BattleManager.updateAction;
    /**
     * アクターまたはエネミーのアクションを更新する。
     */
    BattleManager.updateAction = function() {
        const nextTarget = this._targets[0];


        if (nextTarget && this._spriteset.isAnimationPlayingWithTarget(nextTarget, this._animationWaitCount)) {
            // 次の対象に対するアニメーションが表示中なので更新しない。
            return ;
        }

        if (this._action && (this._targets.length === 0) && this._action.isSkill()) {
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
        this._isContinuousSkill = true;
        // アニメーション
        const nextSkill = this._action.item();
        this._animationWaitCount = this.animationWaitCount(this._action);
        this._spriteset.setUseAnimationDelay(false);
        this._logWindow.showAnimation(subject, this._targets.clone(), nextSkill.animationId);
    };

    /**
     * 連続スキルが発動したかどうかをテストする。
     * 
     * @returns {boolean} 連続スキルが発動した場合にはtrue, それ以外はfalse.
     */
    BattleManager.testContinuousSkill = function() {
        const skill = this._action.item();
        if (skill.continuousSkill.resetTargets) {
            const subject = this._subject;
            const action = new Game_Action(subject);
            action.setSkill(skill.continuousSkill.id);
            const testTargets = action.makeTargets();
            if (!testTargets.some(target => action.testApply(target))) {
                // 適用可能な対象がいない。
                return false;
            }
        } else {
            const testTargets = this._savedActionTargets;
            const action = this._action;
            if (!testTargets.some(target => action.testApply(target))) {
                // 適用可能な対象がいない。
                return false;
            }
        }

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

    const _BattleManager_endAction = BattleManager.endAction;
    /**
     * アクターまたはエネミーのアクションが完了したときの処理を行う。
     */
    BattleManager.endAction = function() {
        this._spriteset.setUseAnimationDelay(true);
        _BattleManager_endAction.call(this);
    };

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



    if (!waitDamageAnimation) {
        /**
         * ビジーかどうかを取得する。
         * 
         * Note: 他のプラグインとめちゃくちゃ競合する。
         * 
         * @return {boolean} ビジーな場合にはtrue, それ以外はfalse.
         */
        BattleManager.isBusy = function() {
            const isMsgBusy = $gameMessage.isBusy();
            const isSpritesetBusy = !this._isContinuousSkill && this._spriteset.isBusy();
            const isLogWindowBusy = !this._isContinuousSkill && this._logWindow.isBusy();
            const isBusy = isMsgBusy || isSpritesetBusy || isLogWindowBusy;
            // if (isBusy) {
            //     console.log("busywait: msg=" + isMsgBusy + " spriteset=" + isSpritesetBusy + " log=" + isLogWindowBusy);
            // }
            return isBusy;
        };
    }

    //------------------------------------------------------------------------------
    // Spriteset_Battle
    const _Spriteset_Battle_initialize = Spriteset_Battle.prototype.initialize;
    /**
     * Spriteset_Battleを初期化する。
     */
    Spriteset_Battle.prototype.initialize = function() {
        _Spriteset_Battle_initialize.call(this);
        this._isUseDelay = true;
    };
    /**
     * targetを対象としたアニメーションが再生中かどうかを得る。
     * 
     * @param {Game_Battler} target 対象
     * @param {number} animatinWaitCount アニメーション待機時間
     * @returns {boolean} アニメーション再生中の場合にはtrue, それ以外はfalse.
     */
    Spriteset_Battle.prototype.isAnimationPlayingWithTarget = function(target, animationWaitCount) {
        return this._animationSprites.some(animationSprite => 
            animationSprite.targetObjects.includes(target)
                && ((animationWaitCount === 0) || (animationSprite.currentFrameIndex() < animationWaitCount)));
    };

    /**
     * アニメーションにディレイをつけるかどうかを設定する。
     * 
     * @param {boolean} isNoDelay ディレイを有効にする場合にはtrue, それ以外はfalse.
     */
    Spriteset_Battle.prototype.setUseAnimationDelay = function(isUseDelay) {
        this._isUseDelay = isUseDelay;
    };

    const _Spriteset_Battle_animationBaseDelay = Spriteset_Battle.prototype.animationBaseDelay;
    /**
     * アニメーションの基本ディレイを得る。
     * 
     * @returns {number} アニメーションのディレイ
     */
    Spriteset_Battle.prototype.animationBaseDelay = function() {
        return (this._isUseDelay) ? _Spriteset_Battle_animationBaseDelay.call(this) : 0;
    };

    const _Spriteset_Battle_animationNextDelay = Spriteset_Battle.prototype.animationNextDelay;
    /**
     * 複数のアニメーションを表示するときの遅延量を得る。
     * 
     * @returns {number} アニメーションのディレイ
     */
    Spriteset_Battle.prototype.animationNextDelay = function() {
        return (this._isUseDelay) ? _Spriteset_Battle_animationNextDelay.call(this) : 0;
    };

    //------------------------------------------------------------------------------
    // Sprite_Animation
    /**
     * 現在のフレームインデックスを得る。
     * 
     * @return {number} フレーム番号
     */
    Sprite_Animation.prototype.currentFrameIndex = function() {
        return this._frameIndex;
    };


})();