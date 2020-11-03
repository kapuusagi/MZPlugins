/*:ja
 * @target MZ 
 * @plugindesc TWLD向け基本パラメータによるパラメータ補正適用プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Twld
 * @orderAfter Kapu_Base_Twld
 * @base Kapu_Twld_BasicParams
 * @orderAfter Kapu_Twld_BasicParams
 * 
 * @help 
 * TWLD向け基本パラメータによるパラメータ補正適用プラグイン。
 * VIT, INT, MENを上昇させたとき、MaxHP, MaxMPに補正をかけます。
 * 
 * ■ 使用時の注意
 * なし
 * 
 * ■ プラグイン開発者向け
 * なし
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
    //const pluginName = "Kapu_Twld_BasicParams_CorrectParams";
    //const parameters = PluginManager.parameters(pluginName);


    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_maxTpPlus = Game_BattlerBase.prototype.maxTpPlus;
    /**
     * 最大TP加算値。
     * 
     * @return {Number} 最大TP加算値。
     */
    Game_BattlerBase.prototype.maxTpPlus = function() {
        const maxTp = _Game_BattlerBase_maxTpPlus.call(this);
        return maxTp + Math.max(0, this.dex - 20);
    };

    //------------------------------------------------------------------------------
    // Game_Battler
    /**
     * TPB基準速度の計算に使用するパラメータ値を得る。
     * 
     * @return {Number} TPB基準速度の計算に使用するパラメータ。
     * !!!overwrite!!! Game_Battler.tpbMagicCastSpeedParam
     *     TPB魔法発動時のキャスト処理にDEXを使用するため、オーバーライドする。
     */
    Game_Battler.prototype.tpbMagicCastSpeedParam = function() {
        return this.dex;
    };

    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    /**
     * 基本パラメータベース値を得る。
     * 
     * @param paramId {Number} パラメータID
     * @return {Number} パラメータ値
     */
    Game_Actor.prototype.paramPlus = function(paramId) {
        const value = _Game_Actor_paramPlus.call(this, paramId);
        switch (paramId) {
            case 0: // MaxHP
                {
                    // 最大HP = (VIT * 4) + FLOOR(VIT / 5) * 7
                    const vit = Math.max(0, this.vit - 20);
                    return value + (vit * 4) + Math.floor(vit / 5) * 7;
                }
            case 1: // MaxMP
                {
                    const int = Math.max(0, this.int - 20);
                    const men = Math.max(0, this.men - 20);
                    return value + (int * 2) + Math.floor(int / 5) * 4
                            + men + Math.floor(men / 7) * 5;
                }
            case 2: // ATK
                return value;
            case 3: // DEF
                return value;
            case 4: // VIT
                return value;
            case 5: // MDF
                return value;
            case 6: // AGI
                return value;
            case 7: // LUK
                return value; // LUKを返す。
        }
        return 0;
    };


})();