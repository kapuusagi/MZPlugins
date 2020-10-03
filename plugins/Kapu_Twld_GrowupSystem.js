/*:ja
 * @target MZ 
 * @plugindesc GrowupSystemのTwld向けカスタマイズ。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * @base Kapu_GrowupSystem_UI
 * @orderAfter Kapu_GrowupSystem
 * 
 * @help 
 * GrowupSystemのTwld向けカスタマイズ。
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
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_TwldGrowupSystem";
    const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
        // TODO : コマンドの処理。
        // パラメータメンバは @argで指定した名前でアクセスできる。
    });

    //------------------------------------------------------------------------------
    // Game_Actor

    /**
     * レベルアップ時に加算するGrowPointを得る。
     * 
     * @param {Number} level レベル
     * @return {Number} 加算するGrowPoint
     */
    Game_Actor.prototype.growPointAtLevelUp = function(level) {
        return 3 + Math.min(6, Math.floor(level / 20));
    };
    //------------------------------------------------------------------------------
    // Window_GrowupActorStatus

    /**
     * アクターのステータスを描画する。
     * !!!overwrite!!!
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

        // アクターレベル
        // this.drawActorLevel(actor, x, y);
        // y += lineHeight;

        this.drawActorGrowPoint(actor, x, y, width);
        y += Math.floor(lineHeight * 1.2);

        // this.contents.fontSize = $gameSystem.mainFontSize() - 8;
        // for (let i = 0; i < 8; i++) {
        //     const paramWidth = 64;
        //     this.changeTextColor(ColorManager.systemColor());
        //     this.drawText(TextManager.param(i), x, y, paramWidth);
        //     this.resetTextColor();
        //     this.drawText(actor.param(i), x + paramWidth, y, width - paramWidth, "right");
        //     y += Math.floor(lineHeight * 0.8);
        // }

        // 基本ステータス描画するぜ。
        // const statusX = x;
        // const statusY = y + ImageManager.faceHeight + this.itemPadding();
        // const statusWidth = this.width - this.itemPadding() * 2;
        // this.changeTextColor(this.normalColor());
        // this.drawText("基本ステータス", statusX, statusY, statusWidth);
        // statusY += this.lineHeight();

        // const statusNames = TWLD.Core.StatusNames;
        // for (let i = 0; i < 6; i++) {
        //     var paramValue =  actor.getBasicParam(i);
        //     var correct = paramValue - actor.getBasicParamBase(i); // 装備による補正値
        //     this.drawBasicParam(statusNames[i], paramValue, correct, statusX, statusY, statusWidth);
        //     statusY += this.lineHeight();
        // }
    };
})();