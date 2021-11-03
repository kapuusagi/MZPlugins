/*:ja
 * @target MZ 
 * @plugindesc ステート拡張プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_State
 * @orderAfter Kapu_Base_State
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * 
 * @help 
 * ステートデータにいくつかの拡張を追加し、扱いやすくします。
 * ・ステートにバフ/デバフ属性を追加します。
 *   バフ解除、デバフ解除という処理を行う際、やりやすくなります。
 * ・行動後ステート解除について、
 *   スキルの設定により、バフ/デバフステートが解除されないようにします。
 * 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * DataStateに以下のフィールドを追加します。
 *   isBuff
 *   isDebuff
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ステート
 *   <isBuff>
 *     このステートがバフとして扱うステートであることを指定します。
 *     省略時はtrueになります。
 *   <isDebuff>
 *     このステートがデバフとして扱うステートであることを指定します。
 *     省略時はtrueになります。
 * 
 * スキル/アイテム
 *   <keepAllBuffStates>
 *     行動後自動クリアする際、全てのバフはキープされます。
 *     使用者対象のバフを重ねがけできるようにしたい場合などに、バフスキルに設定します。
 *   <keepAllDebuffStates>
 *     行動後自動クリアする際、全てのデバフはキープされます。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_StateExtends";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * ステートノートタグを処理する。
     * 
     * @param {object} obj DataState
     */
    const _processStateNotetag = function(obj) {
        obj.isBuff = (obj.meta.isBuff === undefined) ? true : Boolean(obj.meta.isBuff);
        obj.isDebuff = (obj.meta.isDebuff === undefined) ? true : Boolean(obj.meta.isDebuff);
    };

    DataManager.addNotetagParserStates(_processStateNotetag);
    
    //------------------------------------------------------------------------------
    // Game_Battler

    const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    /**
     * 戦闘開始時の処理を行う。
     * 
     * Note:このメソッドがコールされたとき、$gameParty.inBattle()はfalseを返す事に注意。
     * 
     * @param {boolean} advantageous 有利な状態かどうか
     */
    Game_Battler.prototype.onBattleStart = function(advantageous) {
        _Game_Battler_onBattleStart.call(this, advantageous);
        this._keepAutoClearStateBuffs = undefined;
        this._keepAutoClearStateDebuffs = undefined;
    };

    const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
    /**
     * 戦闘終了時の処理を行う。
     */
    Game_Battler.prototype.onBattleEnd = function() {
        _Game_Battler_onBattleEnd.call(this);
        delete this._keepAutoClearStateBuffs;
        delete this._keepAutoClearStateDebuffs;
    }; 
    const _Game_Battler_performAction = Game_Battler.prototype.performAction;
    /**
     * アクションを実行する。
     * 
     * @param {Game_Action} action 
     */
    Game_Battler.prototype.performAction = function(action) {
        _Game_Battler_performAction.call(this, action);

        const item = action.item();
        if ((this._keepAutoClearStateBuffs === undefined) || this._keepAutoClearStateBuffs) {
            this._keepAutoClearStateBuffs = (item) ? Boolean(item.meta.keepAllBuffStates) : false;
        }
        if ((this._keepAutoClearStateDebuffs === undefined) || this._keepAutoClearStateDebuffs) {
            this._keepAutoClearStateDebuffs = (item) ? Boolean(item.meta.keepAllDebuffStates) : false;
        }
    };


    const _Game_Battler_onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
    /**
     * このGame_Battlerが、ターン中の全ての行動を完了したときの処理を行う。
     */
    Game_Battler.prototype.onAllActionsEnd = function() {
        _Game_Battler_onAllActionsEnd.call(this);
        this._keepAutoClearStateBuffs = undefined;
        this._keepAutoClearStateDebuffs = undefined;
    };

    const _Game_Battler_meetsStateAutoRemoveCondition = Game_Battler.prototype.meetsStateAutoRemoveCondition;
    /**
     * stateで指定したステートが自動解除される条件を満たしているかを判定する。
     * 
     * @param {DataState} state ステート
     * @param {number} timing タイミング(1:行動終了, 2:ターン終了)
     * @returns {boolean} ステート解除タイミングであればtrue, それ以外はfalse.
     */
    Game_Battler.prototype.meetsStateAutoRemoveCondition = function(state, timing) {
        const clearBuffs = !this._keepAutoClearStateBuffs;
        const clearDebuffs = !this._keepAutoClearStateDebuffs;
        if ((timing !== 1) || (clearBuffs && state.isBuff) || (clearDebuffs && state.isDebuff)) {
            return _Game_Battler_meetsStateAutoRemoveCondition.call(this, state, timing);
        } else {
            return false;
        }

    };
    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();