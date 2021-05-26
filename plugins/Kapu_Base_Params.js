/*:ja
 * @target MZ 
 * @plugindesc パラメータ拡張ベースプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @param defaultMaxTp
 * @text デフォルト最大TP値。
 * @desc TPのデフォルト値。
 * @type number
 * @default 100
 * @min 0
 * 
 * @param damageTpGainRateMax
 * @text ダメージTP上昇レート最大
 * @desc ダメージを受けたときのTP上昇量の、最大TPに対する割合。
 * @type number
 * @decimals 2
 * @default 0.50
 * @min 0.00
 * @max 1.00
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
 * Game_BattlerBase.maxTpPlus()
 *     最大TP基本値を拡張する場合にフックする。
 *     割合増加の対象になる。
 * 
 * Game_BattlerBase.maxTpRate()
 *     最大TP基本値を拡張する場合にフックする。
 *     最大TP割合を変更する場合にフックする。
 * 
 * Game_BattlerBase.maxTpAdd()
 *     最大TP基本値を拡張する場合にフックする。
 *     最大TPに加算され、割合増加の対象にならない。
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
 * Version.0.2.0 最大TPを拡張するために、
 *               最大TP周りのメソッドを追加した。
 * Version.0.1.0 Trait_EquipPerformance実装のため追加。
 */
(() => {
    const pluginName = "Kapu_Base_Param";
    const parameters = PluginManager.parameters(pluginName);

    const defaultMaxTp = Number(parameters["defaultMaxTp"]) || 100;
    const damageTpGainRateMax = (Number(parameters["damageTpGainRateMax"]) || 0.5).clamp(0, 1);

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * 最大TPを得る。
     * 
     * 以下の計算で算出される。
     *     (maxTpBase + maxTpPlus) * maxTpRate + maxTpAdd
     * 
     * @returns {number} TP最大値
     * !!!overwrite!!! Game_BattlerBase.maxTp()
     *     最大TPを拡張しやすくするため、オーバーライドする。
     */
    Game_BattlerBase.prototype.maxTp = function() {
        const baseValue = this.maxTpBase() + this.maxTpPlus();
        const rate = this.maxTpRate();
        return Math.floor(baseValue * rate + this.maxTpAdd());
    };

    /**
     * 最大TP値デフォルトを得る。
     * 
     * @returns {number} 最大TP値デフォルト値。
     */
    Game_BattlerBase.prototype.maxTpBase = function() {
        return defaultMaxTp;
    };

    /**
     * 最大TP加算値。
     * 
     * @returns {number} 最大TP加算値。
     */
    Game_BattlerBase.prototype.maxTpPlus = function() {
        return 0;
    };

    /**
     * 最大TPレートを得る。
     * 
     * @returns {number} 最大TPレート。
     */
    Game_BattlerBase.prototype.maxTpRate = function() {
        return 1;
    };

    /**
     * 最大TP加算値を得る。
     * 
     * @returns {number} 最大TP加算値。
     */
    Game_BattlerBase.prototype.maxTpAdd = function() {
        return 0;
    };


    /**
     * パラメータを得る。
     * 
     * @param {number} paramId パラメータID
     * !!!overwrite!!! Game_BattlerBase.param
     *     パラメータを拡張しやすくするため、オーバーライドする。
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
     * @param {number} paramId パラメータID
     * @returns {number} バフ/デバフ適用前のベース値
     */
    Game_BattlerBase.prototype.paramWithoutBuff = function(paramId) {
        return this.paramBasePlus(paramId) * this.paramRate(paramId);
    };

    /**
     * バフを適用する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} baseValue バフの適用元のベース値
     * @returns {number} バフを適用した後の値。
     */
    Game_BattlerBase.prototype.applyBuff = function(paramId, baseValue) {
        return baseValue * this.paramBuffRate(paramId);
    };

    //------------------------------------------------------------------------------
    // Game_Battler

    /**
     * TPをリジェネレートする。
     */
    Game_Battler.prototype.regenerateTp = function() {
        const value = Math.floor(this.maxTp() * this.trg);
        this.gainSilentTp(value);
    };

    /**
     * ダメージによるTPチャージ処理を行う。
     * 
     * @param {number} damageRate ダメージレート。最大HPに対する割合
     * !!!overwrite!!! Game_Battler.changeTpByDamage()
     *      TP最大値が変更になることに従いオーバーライドする。
     */
    Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
        const max = this.maxTp() * damageTpGainRateMax;
        const value = Math.floor(max * damageRate * this.tcr);
        this.gainSilentTp(value);
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * 基本パラメータ加算値を得る。
     * クラスのベース値を除いた、種による加算値と装備品による加算値の合計を返す。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} 加算値
     * !!!overwrite!!!
     *     装備品の加算量合計をメソッドとして分離するため、オーバーライドする。
     */
    Game_Actor.prototype.paramPlus = function(paramId) {
        return Game_Battler.prototype.paramPlus.call(this, paramId)
                + this.paramEquip(paramId);
    };

    /**
     * 装備品のパラメータ値合計を得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} 全装備品のパラメータ値合計
     */
    Game_Actor.prototype.paramEquip = function(paramId) {
        return this.equips().reduce((r, equipItem) => {
            return (equipItem) ? (r + this.paramEquipValue(equipItem, paramId)) : r;
        }, 0, this);
    };

    /**
     * 装備品の基本パラメータ値を得る。
     * 
     * @param {object} equipItem 装備品
     * @param {number} paramId パラメータID
     * @returns {number} 装備品のパラメータ値
     */
    Game_Actor.prototype.paramEquipValue = function(equipItem, paramId) {
        return equipItem.params[paramId];
    };

})();
