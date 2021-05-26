/*:ja
 * @target MZ 
 * @plugindesc ステート拡張基本プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_State
 * @orderAfter Kapu_Base_State
 * 
 * 
 * @help 
 * ステート拡張基本プラグイン。
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * Game_BattlerBase.isClearStateByDie(id:number) : void
 *     idで指定されるステートが、
 *     戦闘不能時にクリアされるものであるかを判定する。
 *     戦闘不能時にクリアしたくないステートがある場合、
 *     フックしてfalseを返すようにする。
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
 * Version.0.1.0 新規作成。
 */
(() => {
    // const pluginName = "Kapu_Base_State";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * このGame_BattlerBaseで指定されるアクター/エネミーを戦闘不能にする。
     * !!!overwrite!!! Game_BattlerBase.die()
     *     死亡時のステートクリア/非クリアを設定できるようにするためオーバーライドする。
     */
    Game_BattlerBase.prototype.die = function() {
        this._hp = 0;
        const states = this.states();
        for (const state of states) {
            if (this.isClearStateByDie(state.id)) {
                this.eraseState(state.id);
            }
        }
        this.clearBuffs();
    };

    /**
     * 戦闘不能時クリアするステートかどうかを判定する。
     * 
     * @param {number} stateId ステートID
     * @returns {boolean} 戦闘不能時クリアステートの場合にはtrue, それ以外はfalse
     */
    // eslint-disable-next-line no-unused-vars
    Game_BattlerBase.prototype.isClearStateByDie = function(stateId) {
        return true;
    };

})();
