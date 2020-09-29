/*:ja
 * @target MZ 
 * @plugindesc クリティカル時、DEF/MDEFを貫通させるためのプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_DamageCore
 * @orderAfter Kapu_DamageCore
 * 
 * @help 
 * クリティカル発生時、対象のDEF/MDEFをゼロとした状態でダメージ計算されるようにするプラグイン。
 * 物理ダメージレート(PDR)と魔法ダメージレート(MDR)はそのまま効果が残ります。
 * 
 * ■ 使用時の注意
 * ありません。
 * 
 * ■ プラグイン開発者向け
 * ありません。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 DamageCoreの拡張サンプルとして作成。
 */
(() => {
    //------------------------------------------------------------------------------
    // Game_Action

    const _Game_Action_additionalTargetTraits = Game_Action.prototype.additionalTargetTraits;
    /**
     * ダメージ計算時、対象に追加で付与する特性を取得する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Boolean} critical クリティカルかどうか
     * @param {Array<Trait>} trait 特性オブジェクト配列
     */
    Game_Action.prototype.additionalTargetTraits = function(target, critical) {
        const traits = _Game_Action_additionalTargetTraits.call(this, target, critical);
        if (critical) {
            traits.push({
                code : Game_BattlerBase.TRAIT_PARAM,
                dataId : 3, // 3 is DEF.
                value : 0, // 0 indicates 0 percent.
            });
            traits.push({
                code : Game_BattlerBase.TRAIT_PARAM,
                dataId : 5, // 5 is MDEF.
                value : 0, // 0 indicates 0 percent.
            });
        }
        return traits;
    };
})();