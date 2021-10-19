/*:ja
 * @target MZ 
 * @plugindesc TPBでのターン経過処理を変更する。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @help 
 * ベーシックシステムでの動作を以下のように変更する。
 * (1) バフのターン経過による解除タイミングはステートと同じに変更
 *   ベーシックシステムでは、バトラーのアクションが全て完了したときにクリアされるが、
 *   これをステートと同じくターン終了までとする。
 *   
 * (2) ターン経過を固定のリファレンススピードによるものに固定する。
 *   ベーシックシステムではTPB速度が早い(素早さが早い)者ほど、
 *   バフ/ステートの解除が早くなっていた。
 *   これを固定長($gameParty.tpbBaseSpeed()/$gameSystem.tpbReferenceTime())で
 *   経過時間計測するように変更する。
 * 
 *   また、先頭ターン数について、ベーシックシステムではエネミーが1回以上行動したときに
 *   増加していたが、本プラグインでは前述の固時間経過時に増加する。
 * 
 * ■ 使用時の注意
 * オーバーライドメソッドが多いので競合が発生する可能性があります。
 * 
 * ■ プラグイン開発者向け
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
    // const pluginName = "Kapu_TpbTurn";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });


    //------------------------------------------------------------------------------
    // Game_Battler
    /**
     * このGame_Battlerが、ターン中の全ての行動を完了したときの処理を行う。
     * 
     * !!!overwrite!!! Game_Battler.onAllActionsEnd()
     *     バフ解除タイミングをアクション終了時ではなく、ターン終了時とするためオーバーライドする。
     */
     Game_Battler.prototype.onAllActionsEnd = function() {
        this.clearResult();
        this.removeStatesAuto(1);
        this.removeBuffsAuto();
    };

    /**
     * このGame_Battlerのターン終了時の処理を行う。
     * 
     * !!!overwrite!!! Game_Battler.onTurnEnd()
     *     バフ解除タイミングをアクション終了時ではなく、ターン終了時とするためオーバーライドする。
     */
    Game_Battler.prototype.onTurnEnd = function() {
        this.clearResult();
        this.regenerateAll();
        this.updateStateTurns();
        this.updateBuffTurns();
        this.removeStatesAuto(2);
        this.removeBuffsAuto();
    };
    //------------------------------------------------------------------------------
    // BatlteManager
    const _BattleManager_startBattle = BattleManager.startBattle;
    /**
     * 戦闘を開始する。
     */
    BattleManager.startBattle = function() {
        _BattleManager_startBattle.call(this);
        this._tpbElapseTime = 0;
    };

    const _BattleManager_updateTpb = BattleManager.updateTpb;
    /**
     * TPB周りの更新処理を行う。
     */
    BattleManager.updateTpb = function() {
        const referenceSpeed = $gameParty.tpbBaseSpeed() / $gameParty.tpbReferenceTime();
        this._tpbElapseTime += referenceSpeed;
        if (this._tpbElapseTime > 1) {
            this._tpbElapseTime = 1;
        }
        _BattleManager_updateTpb.call(this);
    }; 
    /**
     * TPBでターンが完了したかどうかを得る。
     * !!!overwrite!!! BattleManager.checkTpbTurnEnd()
     *   ターン完了を固定時間の経過で行うため、オーバーライドする。
     */
    BattleManager.checkTpbTurnEnd = function() {
        if (this._tpbElapseTime >= 1) {
            this.endTurn();
            this.endAllBattlersTurn(); // 1ターン経過時の処理(リジェネーレート適用/ステート/バフのターン処理)
        }
    };

    /**
     * Game_BattlerのTPB状態に合わせて適切な処理をする。
     * 
     * @param {Game_Battler} battler 更新するGame_Battler
     * !!!overwrite!!! BattleManager.updateTpbBattler()
     *   onTpbTurnEndの呼び出しタイミングを変更するため、オーバーライドする。
     */
    BattleManager.updateTpbBattler = function(battler) {
        if (battler.isTpbTurnEnd()) {
            battler.startTpbTurn();
            this.displayBattlerStatus(battler, false);
        } else if (battler.isTpbReady()) {
            battler.startTpbAction();
            this._actionBattlers.push(battler);
        } else if (battler.isTpbTimeout()) {
            battler.onTpbTimeout();
            this.displayBattlerStatus(battler, true);
        }
    };

})();