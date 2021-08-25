/*:ja
 * @target MZ 
 * @plugindesc ウェポンマスタリタイプのキャストタイム補正プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Twld_WeaponMastery
 * @orderAfter Kapu_Twld_WeaponMastery
 * @base Kapu_Base_Tpb
 * @orderAfter Kapu_Base_Tpb
 * 
 * @param maxReductionRate
 * @text 最大削減量
 * @desc ウェポンマスタリにより削減したとき、短縮限度とする割合 (0:削減なし～1.0:全部なし)
 * @type number
 * @decimals 2
 * @default 0.50
 * @min 0.00
 * @max 1.00
 * 
 * @param reductionRate
 * @text 削減レート
 * @desc ウェポンマスタリレベルが1上がる毎に短縮可能なチャージタイムの割合
 * @type number
 * @decimals 2
 * @default 0.01
 * 
 * 
 * @help 
 * ウェポンマスタリのレベルが上がる毎に、キャストタイムを短縮する機能を提供します。
 * スキルのキャストタイムを
 *     ウェポンマスタリーレベル x 削減レート
 * だけ削減します。
 * 但し、最大削減量を超えて削減されることはありません。
 * 削減量は、スキル個別指定（ノートタグ）とデフォルト指定（プラグインパラメータ）の
 * 2つで指定できます。
 * ノートタグが指定されている場合には、そちらが優先されます。
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
 *   <wmCastReductionRateMax:rate>
 *     ウェポンマスタリレベルによるキャストタイム短縮上限値
 *     ここで指定した割合(0.5なら50%)以上は短縮されない。
 *   <wmCastReductionRate:rate>
 *     ウェポンマスタリレベル1あたりで、短縮可能なチャージタイム。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Twld_WeaponMastery_CastTime";
    const parameters = PluginManager.parameters(pluginName);
    const maxReductionRate = Math.max(0, Number(parameters["maxReductionRate"]) || 0);
    const reductionRate = Math.max(0, Number(parameters["reductionRate"]) || 0);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_tpbSkillCastTime = Game_Battler.prototype.tpbSkillCastTime;
    /**
     * スキルのキャスト時間を得る。
     * 
     * @param {object} item スキル/アイテム
     * @returns {number} キャスト時間
     */
    Game_Battler.prototype.tpbSkillCastTime = function(item) {
        let castTime = _Game_Battler_tpbSkillCastTime.call(this, item);
        const wmTypeId = this.itemWmTypeId(item);
        if (wmTypeId > 0) {
            const maxRate = (item.meta.wmCastReductionRateMax === undefined)
                    ? maxReductionRate : (Number(item.meta.wmCastReductionRateMax) || 0);
            const rate = (item.meta.wmCastReductionRate === undefined)
                    ? reductionRate : (Number(item.meta.wmCastReductionRate) || 0) ;
            const wmLevel = this.wmLevel(wmTypeId);
            castTime = Math.round(castTime * (1.0 - Math.min(maxRate, wmLevel * rate)));
        }
        return castTime;
    };

})();