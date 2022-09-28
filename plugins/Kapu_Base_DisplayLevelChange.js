/*:ja
 * @target MZ 
 * @plugindesc レベルアップ時の表示を変更するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 
 * @orderAfter 
 * 
 * 
 * @help 
 * ベースシステムでは、レベルアップ時の表示処理が、Game_Actor.changeExp()に内包されてしまっている。
 * そのため、スキル以外の変更を表示させようとした場合、changeExpをオーバーライドする必要があり、
 * 呼び出し順によっては他のプラグインが動作しなくなったりする。
 * 本プラグインではレベルアップ時の表示処理と、EXP増減処理を分離する。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * Game_Actor.prototype.storeCurrentStatusForDisplayLevelUp() : object
 *   レベル変更時のステータス表示をするために必要となる、現在の情報を返す。
 *   表示させたいステータス項目がある場合、このメソッドをフックして、
 *   リターンするオブジェクトのフィールドに追加する。  
 * Game_Actor.prototype.needsDisplayLevelChange(prevInfo :object, curInfo :object) : boolean
 *   EXP変更時のステータス表示をする必要があるかどうかを判定する。
 *   既定ではレベルが上がった場合のみtrueを返す。
 *   必要に応じてオーバーライドする。
 * Game_Actor.prototype.displayLevelChange = function(prevInfo :object, curInfo :object) : void
 *   EXP変更時のステータスを表示する。
 *   既定ではメッセージとして習得スキルを表示させるだけ。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
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
    //const pluginName = "Kapu_Base_DisplayLevelChange";
    //const parameters = PluginManager.parameters(pluginName);



    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * 経験値を変更する。
     * 
     * @param {number} exp 経験値
     * @param {boolean} show メッセージを表示する場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Actor.changeExp()
     *     EXP増減処理と、ステータス変化の表示を分離するためにオーバーライドする。
     */
    Game_Actor.prototype.changeExp = function(exp, show) {
        this._exp[this._classId] = Math.max(exp, 0);
        const prevStatus = this.storeCurrentStatusForDisplayLevelUp();
        while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
            this.levelUp();
        }
        while (this.currentExp() < this.currentLevelExp()) {
            this.levelDown();
        }
        if (show) {
            const curStatus = this.storeCurrentStatusForDisplayLevelUp();
            if (needsDisplayLevelChange(prevStatus, curStatus)) {
                this.displayLevelChange(prevStatus, curStatus);
            }
            this.displayLevelChange(prevStatus, curStatus);
        }
        this.refresh();
    };

    /**
     * レベルアップのための情報を収集する。
     * 
     * @returns {object} オブジェクト
     */
    Game_Actor.prototype.storeCurrentStatusForDisplayLevelUp = function() {
        const info = {
            level : this._level,
            skills : this.skills(),
            params : []
        };
        for (let paramId = 0; paramId < 8; paramId++) {
            info.params[paramId] = this.param(paramId);
        }
        return info;
    };

    /**
     * レベル変更によるステータス表示をする必要があるかどうかを判定する。
     * 
     * @param prevInfo 前の情報
     * @param curInfo 現在の情報
     */
    Game_Actor.prototype.needsDisplayLevelChange = function(prevInfo, curInfo) {
        return (curInfo.level > prevInfo.level);
    };

    /**
     * レベル変更の表示をする。
     * 
     * @param {object} prevInfo レベルアップ前のステータス 
     * @param {object} curInfo レベルアップ後のステータス
     */
    Game_Actor.prototype.displayLevelChange = function(prevInfo, /* curInfo */) {
        this.displayLevelUp(this.findNewSkills(prevInfo.skills));
    };

})();

