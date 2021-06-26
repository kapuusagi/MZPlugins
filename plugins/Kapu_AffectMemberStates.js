/*:ja
 * @target MZ 
 * @plugindesc ユニットメンバー全体に影響を与えるステートを実現する。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @help 
 * ノートタグ<affectToFriends>を指定したステートの特性が、
 * パーティーメンバー全員に及ぶようにできます。
 * ステート保持者がDeadしたときに、効果が自動的に切れるような効果を持たせたい場合に使用します。
 * ステートの効果(ターンで切れるとか動けないなど)は
 * ステートを持っているメンバーにだけ効果があります。
 * 
 * PassiveStates()とは共存するので、装備品によってパーティー全体に効果を与えたい場合には、
 * 別途ステートを定義してパッシブステートで付与する形にしましょう。
 * 
 * パーティーメンバー全員に影響を与えるステートを用意する。
 * いわゆるパーティー全体のHP+25%とかそういうの。
 * やろうと思えばクラスとか装備品とかもできそうだけれど、
 * やると命中率とかメチャクチャになので行わない。
 * 
 * 想定用途
 *   バリアー実行
 *       ステート: バリアー実行中 <affectToFreiends> ダメージ半減特性  次アクションまで効果がある、など。
 *   歌の詠唱
 *       ステート： ATK+20% 次アクションまで効果がある、など。
 * 
 * ■ 使用時の注意
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
 * ステート
 *   <affectToFriends>
 *     この特性の効果がパーティー全体に行き渡る。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_AffectMemberStates";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_traitObjects = Game_BattlerBase.prototype.traitObjects;
    /**
     * このGame_BattlerBaseの、全ての特性値を持つオブジェクトを取得する。
     * 
     * @return {Array<TraitObject>} 特性(Trait)を持つオブジェクトの配列
     */
    Game_BattlerBase.prototype.traitObjects = function() {
        const traitObjects = _Game_BattlerBase_traitObjects.call(this);
        if (this.friendsUnit) {
            // キャッシュさせる場合
            // const affectMemberStates = this.friendsUnit().affectMemberStates();
            // キャッシュさせない場合
            const affectMemberStates = this.friendsUnit().aliveMembers().reduce((prev, member) => {
                return prev.concat(member.affectMemberStates());
            }, []);
            for (const state of affectMemberStates) {
                if (!traitObjects.includes(state)) {
                    traitObjects.push(state);
                }
            }
        }
        return traitObjects;
    };

    /**
     * パーティー全体に影響のあるステートを得る。
     * 
     * @return {Array<TraitObject>} 特性オブジェクト
     */
    Game_BattlerBase.prototype.affectMemberStates = function() {
        return this.states().filter(state => state.meta.affectToFriends);
    };
})();