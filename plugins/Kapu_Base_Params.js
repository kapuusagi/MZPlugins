/*:ja
 * @target MZ 
 * @plugindesc パラメータ拡張ベースプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @help 
 * 基本パラメータを拡張可能にするためのプラグイン。
 * ベーシックシステムからの動作変更は無い。
 * 
 * ■ 使用時の注意
 * ありません。
 * 
 * ■ プラグイン開発者向け
 * Game_Actor.param()
 *     基本パラメータを得る。
 *     特性による乗算から装備品を除外したい場合などはオーバーライドする。
 * Game_Actor.paramEquipValue()
 *     装備品による加減算値を変更したい場合にはフックする。
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
 * Version.0.1.0 Trait_EquipPerformance実装のため追加。
 */
(() => {
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * パラメータを得る。
     * 
     * @param {Number} paramId パラメータID
     * !!!overwrite!!! Game_BattlerBase.param
     */
    Game_BattlerBase.prototype.param = function(paramId) {
        const baseValue = this.paramWithoutBuff(paramId);
        const value = this.applyBuff(paramId, baseValue);
        const maxValue = this.paramMax(paramId);
        const minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    };

    /**
     * パラメータのバフ/デバフ適用前のベース値を得る。
     * 
     * @param {Number} paramId パラメータID
     * @return {Number} バフ/デバフ適用前のベース値
     */
    Game_BattlerBase.prototype.paramWithoutBuff = function(paramId) {
        return this.paramBasePlus(paramId) * this.paramRate(paramId);
    };

    /**
     * バフを適用する。
     * 
     * @param {Number} paramId パラメータID
     * @param {Number} baseValue バフの適用元のベース値
     * @return {Number} バフを適用した後の値。
     */
    Game_BattlerBase.prototype.applyBuff = function(paramId, baseValue) {
        return baseValue * this.paramBuffRate(paramId);
    };




    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * 基本パラメータ加算値を得る。
     * クラスのベース値を除いた、種による加算値と装備品による加算値の合計を返す。
     * 
     * @param {Number} paramId パラメータID
     * @return {Number} 加算値
     * !!!overwrite!!!
     */
    Game_Actor.prototype.paramPlus = function(paramId) {
        return Game_Battler.prototype.paramPlus.call(this, paramId)
                + this.paramEquip(paramId);
    };

    /**
     * 装備品のパラメータ値合計を得る。
     * 
     * @param {Number} paramId パラメータID
     * @return {Number} 全装備品のパラメータ値合計
     */
    Game_Actor.prototype.paramEquip = function(paramId) {
        return this.equips().reduce((r, equipItem) => {
            return (equipItem) ? (r + this.paramEquipValue(equipItem, paramId)) : r;
        }, 0, this);
    };

    /**
     * 装備品の基本パラメータ値を得る。
     * 
     * @param {Object} equipItem 装備品
     * @param {Number} paramId パラメータID
     * @return {Number} 装備品のパラメータ値
     */
    Game_Actor.prototype.paramEquipValue = function(equipItem, paramId) {
        return equipItem.params[paramId];
    };

})();