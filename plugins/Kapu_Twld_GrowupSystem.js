/*:ja
 * @target MZ 
 * @plugindesc GrowupSystemのTwld向けカスタマイズ。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * @base Kapu_Twld_BasicParams_Growup
 * @orderAfter Kapu_Twld_BasicParams_Growup
 * @base Kapu_GrowupSystem_UI
 * @orderAfter Kapu_GrowupSystem_UI
 * 
 * 
 * 
 * @param canReincarnateAtMenu
 * @text 育成メニューから転生可能
 * @desc 育成メニューから転生可能にする場合にtrueを指定します。
 * @type boolean
 * @default true
 * 
 * @param reincarnationIconId
 * @text 転生アイコンID
 * @desc 育成メニューに表示する場合に使用するアイコンID
 * @type number
 * @default 0
 * 
 * @param reincarnationLabel
 * @text 転生ラベル
 * @desc 育成メニューに表示する場合のラベル
 * @type string
 * @default 再育成する
 * 
 * @param reincarnationDescription
 * @text 転生説明
 * @desc 育成メニューに表示する場合の説明
 * @type string
 * @default ボーナスを得てレベル1から再育成します。
 * 
 * @help 
 * GrowupSystemのTwld向けカスタマイズ。
 * ・レベルアップ時の育成ポイント加算量変更。
 * ・育成画面に描画する項目の変更
 * 育成に転生要素とボーナスを追加する。
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
 *     <keepOnReincarnation>
 *         育成での習得スキルのみ対象。
 *         転生時にスキル習得済みにする。
 *         
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Twld_GrowupSystem";
    const parameters = PluginManager.parameters(pluginName);
    const canReincarnateAtMenu = (typeof parameters["canReincarnateAtMenu"] === "undefined")
            ? false : (parameters["canReincarnateAtMenu"] === "true");
    const reincarnationIconId = Number(parameters["reincarnationIconId"]) || 0;
    const reincarnationLabel = String(parameters["reincarnationLabel"]) || "";
    const reincarnationDescription = String(parameters["reincarnationDescription"]) || 0;

    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._reincarnationCount = 0;
        this._basicParamsReBonus = [0, 0, 0, 0, 0, 0, 0];
    };

    /**
     * レベルアップ時に加算するGrowPointを得る。
     * 
     * @param {Number} level レベル
     * @return {Number} 加算するGrowPoint
     * !!!overwrite!!! Game_Actor.growPointAtLevelUp()
     */
    Game_Actor.prototype.growPointAtLevelUp = function(level) {
        return 3 + Math.min(6, Math.floor(level / 20));
    };

    /**
     * 転生カウントを得る。
     * 
     * @return {Number} 転生回数
     */
    Game_Actor.prototype.reincarnationCount = function() {
        return this._reincarnationCount;
    };
    /**
     * 転生可能かどうかを返す。
     * 
     * @return {Boolean} 転生可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.canReincarnation = function() {
        return this.isMaxLevel();
    };

    /**
     * 転生する。
     * 転生は最大レベルの時だけ使用可能。
     */
    Game_Actor.prototype.reincarnation = function() {
        if (!this.canReincarnation()) {
            return; // 条件満たしてない。
        }

        // GPで習得したスキルを一部を除いて全部永久習得にする。
        if (this._gpLearnedSkills) {
            for (const skillId of this._gpLearnedSkills) {
                const skill = $dataSkills[skillId];
                if (skill.meta.keepOnReincarnation) {
                    // このスキルは転生時に習得済み(恒久習得)にする。
                } else {
                    // このスキルは転生時に習得可能状態にする。
                    this._gpLearnableSkills.push(skillId);
                    this.forgetSkill(skillId);
                }
            }
            this._gpLearnedSkills = [];
        }
        
        // 基本パラメータはボーナスに加算する。ボーナスの最大は200。
        for (let i = 0; i < this._basicParamsGrown.length; i++) {
            const addBonus = Math.floor(this._basicParamsGrown[i] / 10);
            const newValue = this._basicParamsReBonus[i] + addBonus;
            this._basicParamsReBonus[i] = newValue.clamp(0, 200);
        }

        // 育成ボーナスをレベルアップ分だけ引き、リセットする。
        this._growPoint.max -= 484; // Lv2~Lv99まであげたときのボーナス合計値-10。10はボーナスとして残す。

        // レベルを1に戻す。
        this.changeLevel(1, false);
        this._reincarnationCount++;

        // 育成リセット
        this.resetGrows();
    };

    const _Game_Actor_basicParamBase = Game_Actor.prototype.basicParamBase;
    /**
     * 基本パラメータを得る。
     * 
     * @param {Number} paramId パラメータID
     * @return {Number} パラメータの値
     */
    Game_Actor.prototype.basicParamBase = function(paramId) {
        return _Game_Actor_basicParamBase.call(this, paramId)
                + this._basicParamsReBonus[paramId];
    };

    if (canReincarnateAtMenu) {
        const _Game_Actor_growupItems = Game_Actor.prototype.growupItems;
        /**
         * 育成項目を返す。
         * 
         * @return {Array<GrowupItem>} 育成項目
         */
        Game_Actor.prototype.growupItems = function() {
            const items = [];
            if (this.canReincarnation()) {
                items.push({
                    iconIndex : reincarnationIconId,
                    name : reincarnationLabel,
                    type : "reincarnation",
                    id : 0,
                    cost : 0,
                    description : reincarnationDescription
                });
            }
            return items.concat(_Game_Actor_growupItems.call(this));
        };

        const _Game_Actor_applyGrowup = Game_Actor.prototype.applyGrowup;
        /**
         * 育成項目を適用する。
         * 
         * @param {GrowupItem} growupItem 育成項目
         * @return {Boolean} 適用できたかどうか。
         */
        Game_Actor.prototype.applyGrowup = function(growupItem) {
            if (growupItem.type === "reincarnation") {
                this.reincarnation();
                return true;
            } else {
                return _Game_Actor_applyGrowup.call(this, growupItem);
            }
        }
    }
    //------------------------------------------------------------------------------
    // Window_GrowupActorStatus

    /**
     * アクターのステータスを描画する。
     * !!!overwrite!!! Window_GrowupActorStatus.drawStatus()
     */
    Window_GrowupActorStatus.prototype.drawStatus = function() {
        const rect = this.statusAreaRect();

        let x = rect.x + this.itemPadding();
        let y = rect.y + this.itemPadding();
        const width = rect.width - this.itemPadding() * 2;
        const lineHeight = this.lineHeight();
        const actor = this._actor;

        // アクター名
        this.drawActorName(actor, x, y, width);
        y += lineHeight;

        this.drawActorGrowPoint(actor, x, y, width);
        y += Math.floor(lineHeight * 1.2);

        this.contents.fontSize = $gameSystem.mainFontSize() - 8;
        for (let i = 0; i < 2; i++) {
            const paramWidth = 64;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(TextManager.param(i), x, y, paramWidth);
            this.resetTextColor();
            this.drawText(actor.param(i), x + paramWidth, y, width - paramWidth, "right");
            y += Math.floor(lineHeight * 0.8);
        }

        // 基本ステータス描画
        for (let i = 0; i < 6; i++) {
            const paramWidth = 64;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(TextManager.basicParam(i), x, y, paramWidth);
            this.resetTextColor();
            this.drawText(actor.basicParam(i), x + paramWidth, y, width - paramWidth, "right");
            y += Math.floor(lineHeight * 0.8);
        }
    };
})();