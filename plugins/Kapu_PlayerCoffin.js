/*:ja
 * @target MZ 
 * @plugindesc マップ歩行時、Deadメンバーの表示を変更するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command setCoffinImage
 * @text 棺桶歩行グラフィックスを設定する。
 * 
 * @arg acotrId 
 * @text アクターID
 * @desc アクターID
 * @type actor
 * @default 0
 * 
 * @arg variableId
 * @text アクター指定変数ID
 * @desc アクターIDを格納した変数番号
 * @type variable
 * @default 0
 * 
 * @arg characterName
 * @text 棺桶画像
 * @desc 棺桶画像歩行グラフィック
 * @type file
 * @dir img/characters/
 * 
 * @arg characterIndex
 * @text デフォルト棺桶画像インデックス
 * @desc デフォルト棺桶画像インデックス
 * @type number
 * @min 0
 * @max 7
 * @default 0
 * 
 * @param defaultCoffinCharacter
 * @text デフォルト棺桶画像
 * @desc デフォルト棺桶画像歩行グラフィック
 * @type file
 * @dir img/characters/
 * 
 * @param defaultCoffinCharacterIndex
 * @text デフォルト棺桶画像インデックス
 * @desc デフォルト棺桶画像インデックス
 * @type number
 * @min 0
 * @max 7
 * @default 0
 * 
 * @help 
 * 以下の機能を追加します。
 * ・Dead時に特定の歩行グラフィックを表示します。
 * ・アクターが動けない場合に歩行グラフィックをステップさせません。
 * ・Deadしているメンバーは後ろに表示されます。
 *   (パーティーの並び順は変わりません)
 * 
 * 
 * ■ 使用時の注意
 * パーティーメンバーに関係するプラグインと競合する可能性があります。
 * 例えば同行者を設定できるプラグインとか。
 * 
 * ■ プラグイン開発者向け
 * Game_Player, Game_Followerの画像が切り替わるのは
 * $gamePlayer.refresh()がコールされたときになるため、
 * 特定の状態が変わったときに $gamePlayer.refresh()を呼ぶ必要があります。
 * そのため、ステートが変わったときに動けるかどうかやDeadしているかどうかを調べ、
 * $gamePlayer.refresh()を呼び出しています。
 * 
 * アニメーションさせない動作は、updatePattern()をフックすることで実装しています。
 * 乗り物に乗っているとき、Game_Player/Game_Followerは透過状態になるので、
 * 乗り物のアニメーションが止まるということはないです。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 棺桶歩行グラフィックスを設定する。
 *   指定したアクターに対して、棺桶時の歩行グラフィック画像を設定します。
 *     
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <coffinCharacter:character$,index#>
 *     アクターの棺桶グラフィックとして、character$というファイル名のindex#の歩行グラフィックを使用します。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_PlayerCoffin";
    const parameters = PluginManager.parameters(pluginName);

    const defaultCoffinCharacter = parameters["defaultCoffinCharacter"] || "";
    const defaultCoffinCharacterIndex = (Math.round(Number(parameters["defaultCoffinCharacterIndex"]) || 0)).clamp(0,7);

    /**
     * アクターIDを得る。
     * 
     * @param {object} args プラグインコマンド引数
     * @returns {number} アクターID
     */
     const _getActorId = function(args) {
        const actorId = Number(args.actorId) || 0;
        const variableId = Number(args.variableId) || 0;
        if (actorId > 0) {
            return actorId;
        } else if (variableId > 0) {
            return $gameVariables.value(variableId);
        } else {
            return 0;
        }
    };

    PluginManager.registerCommand(pluginName, "setCoffinImage", args => {
        const actorId = _getActorId(args);
        const characterName = args.characterName || "";
        const characterIndex = args.characterIndex;
        if (actorId > 0) {
            const actor = $gameActors.actor(actorId);
            actor.setCoffinCharacterImage(characterName, characterIndex);
        }
    });

    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._coffinCharacterName = defaultCoffinCharacter;
        this._coffinCharacterIndex = defaultCoffinCharacterIndex;
    };

    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const actor = $dataActors[actorId];
        if (actor.meta.coffinCharacterName) {
            const tokens = actor.meta.coffinCharacterName.split(",");
            if (tokens.length >= 2) {
                this._coffinCharacterName = tokens[0];
                this._coffinCharacterIndex = (Math.round(Number(tokens[1]) || 0)).clamp(0, 7);
            }
        }
    };

    const _Game_Actor_characterName = Game_Actor.prototype.characterName;
    /**
     * 歩行グラフィックファイル名を得る。
     * 
     * @return {string} 歩行グラフィックファイル名
     */
    Game_Actor.prototype.characterName = function() {
        if (this.isDead() && this._coffinCharacterName) {
            return this._coffinCharacterName;
        } else {
            return _Game_Actor_characterName.call(this);
        }
    };

    const _Game_Actor_characterIndex = Game_Actor.prototype.characterIndex;
    /**
     * 歩行グラフィックのインデックスを得る。
     * 
     * @return {number} 歩行グラフィックのインデックス番号。
     */
    Game_Actor.prototype.characterIndex = function() {
        if (this.isDead() && this._coffinCharacterName) {
            return this._coffinCharacterIndex;
        } else {
            return _Game_Actor_characterIndex.call(this);
        }
    };

    /**
     * 棺桶歩行グラフィックを設定する。
     * 
     * @param {string} characterName 歩行グラフィックファイル名
     * @param {number} characterIndex 歩行グラフィックインデックス
     */
    Game_Actor.prototype.setCoffinCharacterImage = function(characterName, characterIndex) {
        this._coffinCharacterName = characterName;
        this._coffinCharacterIndex = characterIndex;
    };

    const _Game_Actor_die =  Game_Actor.prototype.die;
    /**
     * このGame_Actorで指定されるアクターを戦闘不能にする。
     */
    Game_Actor.prototype.die = function() {
        _Game_Actor_die.call(this);
        $gamePlayer.refresh(); // 生存状態が変わったので、表示キャラクターを更新するため、refresh()をコールする。
    };

    const _Game_Actor_revive = Game_Actor.prototype.revive;
    /**
     * このGame_Actorで指定されるアクターを復活させる。
     */
    Game_Actor.prototype.revive = function() {
        _Game_Actor_revive.call(this);
        $gamePlayer.refresh(); // 生存状態が変わったので、表示キャラクターを更新するため、refresh()をコールする。
    };

    const _Game_Actor_addState = Game_Actor.prototype.addState;
    /**
     * ステートを付与する。但しステート防止がある場合には付与されない。
     * 
     * @param {number} stateId ステートID
     */
    Game_Actor.prototype.addState = function(stateId) {
        const prevCanMove = this.canMove();
        _Game_Actor_addState.call(this, stateId);
        if (prevCanMove !== this.canMove()) {
            $gamePlayer.refresh(); // 動く状態が変わったので表示キャラクターを更新するため、refresh()をコールする。
        }
    };


    const _Game_Actor_recoverAll = Game_Actor.prototype.recoverAll;
    /**
     * 全状態を回復させる。
     */
    Game_Actor.prototype.recoverAll = function() {
        const prevCanMove = this.canMove();
        _Game_Actor_recoverAll.call(this);
        if (prevCanMove !== this.canMove()) {
            $gamePlayer.refresh(); // 動く状態が変わったので表示キャラクターを更新するため、refresh()をコールする。
        }
    };


    const _Game_Actor_eraseState = Game_Actor.prototype.eraseState;
    /**
     * 指定されたステートを解除する。
     * 
     * @param {number} stateId ステートID
     */
    Game_Actor.prototype.eraseState = function(stateId) {
        const prevCanMove = this.canMove();
        _Game_Actor_eraseState.call(this, stateId);
        if (prevCanMove !== this.canMove()) {
            $gamePlayer.refresh(); // 動く状態が変わったので表示キャラクターを更新するため、refresh()をコールする。
        }
    }

    //------------------------------------------------------------------------------
    // Game_Party

    const _Game_Party_leader = Game_Party.prototype.leader;
    /**
     * リーダーを得る。
     * 
     * @returns {Game_Actor} リーダー
     */
    Game_Party.prototype.leader = function() {
        const leader = _Game_Party_leader.call(this);
        if (leader && leader.isDead()) {
            // それ以外で生存しているメンバーを返す。
            const aliveMemberTop = this.battleMembers().find(member => member.isAlive() && (member !== leader));
            if (aliveMemberTop) {
                return aliveMemberTop;
            }
        }
        return this.battleMembers()[0];
    };

    /**
     * マップ上に表示する順序でメンバーを得る。
     * 
     * @return {Array<Game_Actor>} メンバー一覧
     */
    Game_Party.prototype.mapMembers = function() {
        const members = this.battleMembers();
        const leader = this.leader();
        members.sort((a, b) => {
            if (a === leader) {
                return -1; // aがリーダーならaが先。
            } else if (b === leader) {
                return 1; // bがリーダーならbが先。
            } else {
                // どっちもリーダーじゃない。
                if (a.isAlive()) {
                    return -1; // aが生存しているならaが先
                } else {
                    // aはdead
                    if (b.isAlive()) {
                        return 1; // bが生存しているならaが先
                    } else {
                        return -1; // 両方deadなので順番を変えない。
                    }
                }
            }
        });
        return members;
    };
    //------------------------------------------------------------------------------
    // Game_Player

    const _Game_Player_initMembers = Game_Player.prototype.initMembers;
    /**
     * メンバーを初期化する。
     */
    Game_Player.prototype.initMembers = function() {
        _Game_Player_initMembers.call(this);
        this._canWalkAnim = true;
    };

    const _Game_Player_refresh =  Game_Player.prototype.refresh;

    /**
     * 更新する。
     */
    Game_Player.prototype.refresh = function() {
        _Game_Player_refresh.call(this);
        const actor = $gameParty.leader();
        this._canWalkAnim = actor.canMove();
    };

    const _Game_Player_updatePattern = Game_Player.prototype.updatePattern;
    /**
     * パターンを更新する。
     */
    Game_Player.prototype.updatePattern = function() {
        if (!this._canWalkAnim) {
            this.resetPattern();
        } else {
            _Game_Player_updatePattern.call(this);
        }
    };

    //------------------------------------------------------------------------------
    // Game_Follower

    const _Game_Follower_initMembers = Game_Follower.prototype.initMembers;
    /**
     * Game_Playerのメンバーを更新する。
     */
    Game_Follower.prototype.initMembers = function() {
        _Game_Follower_initMembers.call(this);
        this._canWalkAnim = true;
    };

    /**
     * このフォロワーに対応するActorを得る。
     * 
     * @returns {Game_Actor} アクター
     * !!!overwrite!!! Game_Follower.actor
     *     生存している順番にするためオーバーライドする。
     */
    Game_Follower.prototype.actor = function() {
        return $gameParty.mapMembers()[this._memberIndex];
    };

    const _Game_Follower_refresh = Game_Follower.prototype.refresh;
    /**
     * Game_Followerオブジェクトを更新する。
     */
    Game_Follower.prototype.refresh = function() {
        _Game_Follower_refresh.call(this);
        const actor = this.actor();
        if (actor) {
            this._canWalkAnim = actor.canMove();
        }
    };

    const _Game_Follower_updatePattern = Game_Follower.prototype.updatePattern;
    /**
     * アニメーションパターンを更新する。
     */
    Game_Follower.prototype.updatePattern = function() {
        if (!this._canWalkAnim) {
            this.resetPattern();
        } else {
            _Game_Follower_updatePattern.call(this);
        }
    }

})();