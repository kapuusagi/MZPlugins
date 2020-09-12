/*:ja
 * @target MZ 
 * @plugindesc プラグインで使用する、いくつかの拡張を提供するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @help 
 * 追加メソッド
 * Game_Party.partyTraitsSum
 *     指定したパーティーアビリティIDの特性値合計を得る。
 * Game_Party.partyTraitsSumMax
 *     指定したパーティーアビリティIDについて、
 *     アクターそれぞれに合計をとって最大値を得る。
 *     パーティーメンバーのうち、最も高い値を
 *     適用したい場合に使用する。
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
 * Version.0.1.0 TWLDで実装したのを移植。未確認。
 */
(() => {
    //------------------------------------------------------------------------------
    // Game_Party
    //

    /**
     * abilityIdで指定される特性値のパーティーメンバー合計を得る。
     * 
     * @param {Number} abilityId アビリティID(Game_Party.PARTY_ABILITY)
     */
    Game_Party.prototype.partyTraitsSum = function(abilityId) {
        return this.battleMembers().reduce(function(prev, actor) {
            if (!actor.isDead()) {
                return prev + actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, abilityId);
            } else {
                return prev;
            }
        }, 0);
    };

    /**
     * abilityIdで指定される特性値のパーティーでの最大値を得る。
     * 
     * @param {Number} abilityId アビリティID(Game_Party.PARTY_ABILITY)
     * @return {Number} 最大値
     */
    Game_Party.prototype.partyTraitsSumMax = function(abilityId) {
        return this.battleMembers().max(function(actor) {
            return actor.traitsSum(Game_BattlerBase.TRAIT_PARTY_ABILITY, abilityId);
        });
    };
})();