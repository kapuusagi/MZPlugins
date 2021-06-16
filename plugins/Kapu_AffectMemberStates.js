/*:ja
 * @target MZ 
 * @plugindesc ユニットメンバー全体に影響を与えるステートを実現する。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @param useCache
 * @text キャッシュ方式で実装する。
 * @type boolean
 * @desc キャッシュさせるとCPU負荷は減るけどバグがあるかも。キャッシュさせないとCPU負荷が重いけど間違いない。
 * @default false
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
    const pluginName = "Kapu_AffectMemberStates";
    const parameters = PluginManager.parameters(pluginName);
    const useCache = (parameters["useCache"] === undefined) ? false : (parameters["useCache"] === "true");

    //------------------------------------------------------------------------------
    // Game_Unit
    if (useCache) {
        const _Game_Unit_initialize = Game_Unit.prototype.initialize;
        /**
         * Game_Unitを初期化する。
         * 
         * Note: デザイン的に見ると、Game_Unitにキャッシュするやり方はあまり推奨されないようだ。
         */
        Game_Unit.prototype.initialize = function() {
            _Game_Unit_initialize.call(this);
            this._affectMemberStates = [];
        };

        /**
         * メンバー全体に影響するステートを得る。
         * 
         * @returns {Array<DataStates>} メンバー全体に影響するステート
         */
        Game_Unit.prototype.affectMemberStates = function() {
            return this._affectMemberStates.map(id => $dataStates[id]);
        };

        /**
         * メンバー全体に影響するステートを更新する。
         */
        Game_Unit.prototype.updateAffectMemberStates = function() {
            const affectMemberStates = [];
            // 全パーティーメンバーの、メンバー全体効果ステートを収集してキャッシュする。
            for (const member of this.aliveMembers()) {
                const states = member.affectMemberStates();
                for (const state of states) {
                    if (state && !affectMemberStates.includes(state.id)) {
                        affectMemberStates.push(state.id);
                    }
                }
            }
            // ソートして計算しやすくする。
            affectMemberStates.sort((a, b) => (a - b));

            // 配列の相違を確認する。
            const needsRefresh = this.isAffectMemberstatesChanged(affectMemberStates);

            // メンバー全体に影響するステートを更新する。
            this._affectMemberStates = affectMemberStates;

            if (needsRefresh) {
                this.members().forEach(member => member.refresh());
            }
        };

        /**
         * メンバーに影響のあるステートに変化があるかどうかを判定する。
         * 
         * @param {Array<number>} affectMemberStates メンバーに効果があるステートID集
         * @returns {boolean} 変更があった場合にはtrue, それ以外はfalse
         */
        Game_Unit.prototype.isAffectMemberstatesChanged = function(affectMemberStates) {
            if (this._affectMemberStates.length !== affectMemberStates.length) {
                return true;
            } else {
                // 先頭から一致していることを確認
                for (let i = 0; i < this._affectMemberStates.length; i++) {
                    if (this._affectMemberStates[i] !== affectMemberStates[i]) {
                        return true;
                    }
                }

                return false;
            }
        };
    }

    //------------------------------------------------------------------------------
    // Game_Party
    if (useCache) {
        const _Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
        /**
         * スタートメンバーをセットアップする。
         */
        Game_Party.prototype.setupStartingMembers = function() {
            _Game_Party_setupStartingMembers.call(this);
            this.updateAffectMemberStates();
            this.members().forEach(member => member.recoverAll());
        };

        const _Game_Party_addActor = Game_Party.prototype.addActor;
        /**
         * 指定IDのアクターをメンバーに加える。
         * 
         * @param {number} actorId アクターID
         */
        Game_Party.prototype.addActor = function(actorId) {
            _Game_Party_addActor.call(this, actorId);
            this.updateAffectMemberStates();
        };
        
        const _Game_Party_removeActor = Game_Party.prototype.removeActor;
        /**
         * 指定IDのアクターをメンバーから外す。
         * 
         * @param {number} actorId アクターID
         */
        Game_Party.prototype.removeActor = function(actorId) {
            _Game_Party_removeActor.call(this, actorId);
            this.updateAffectMemberStates();
        };
    }

    //------------------------------------------------------------------------------
    // Game_Troop
    if (useCache) {
        const _Game_Troop_setup = Game_Troop.prototype.setup;
        /**
         * エネミーグループをセットアップする。
         * 
         * @param {number} troopId エネミーグループID
         */
        Game_Troop.prototype.setup = function(troopId) {
            _Game_Troop_setup.call(this, troopId);
            this.updateAffectMemberStates();
            this.members().forEach(member => member.recoverAll());
        };
    }
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    if (useCache) {
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
                const affectMemberStates = this.friendsUnit().affectMemberStates();
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

        const _Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
        /**
         * 更新する
         * 
         * Note: recoverAll()がコールされるときは呼び出されないことに注意。
         */
        Game_BattlerBase.prototype.refresh = function() {
            _Game_BattlerBase_refresh.call(this);
            if (this.friendsUnit) {
                this.friendsUnit().updateAffectMemberStates();
            }
        };

        const _Game_BattlerBase_recoverAll = Game_BattlerBase.prototype.recoverAll;
        /**
         * 全状態を回復させる。
         * 
         * 本メソッドからはrefresh()がコールされない。
         */
        Game_BattlerBase.prototype.recoverAll = function() {
            _Game_BattlerBase_recoverAll.call(this);
            if (this.friendsUnit) {
                this.friendsUnit().updateAffectMemberStates();
            }
        };
    } else {
        // キャッシュさせない場合の実装
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

        // Note: パーティーメンバーの変更が入ったか、
        //        ステートの変化があったときにrefreshしたいなあ。
        
        // const _Game_BattlerBase_refresh = Game_BattlerBase.prototype.refresh;
        // /**
        //  * 更新する
        //  * 
        //  * Note: recoverAll()がコールされるときは呼び出されないことに注意。
        //  */
        // Game_BattlerBase.prototype.refresh = function() {
        //     _Game_BattlerBase_refresh.call(this);
        //     if (this.friendsUnit) {
        //         // Note: 循環するので×
        //         this.friendsUnit().aliveMembers().filter(member !== this).forEach(member => member.refresh());
        //     }
        // };

        // const _Game_BattlerBase_recoverAll = Game_BattlerBase.prototype.recoverAll;
        // /**
        //  * 全状態を回復させる。
        //  * 
        //  * 本メソッドからはrefresh()がコールされない。
        //  */
        // Game_BattlerBase.prototype.recoverAll = function() {
        //     _Game_BattlerBase_recoverAll.call(this);
        //     if (this.friendsUnit) {
        //         // Note: 循環するので×
        //         this.friendsUnit().aliveMembers().filter(member !== this).forEach(member => member.refresh());
        //     }
        // };
    }


})();