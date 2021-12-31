/*:ja
 * @target MZ 
 * @plugindesc マップユーティリティ
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Map
 * @orderAfter Kapu_Base_Map
 * 
 * @param defaultStepsForTurn
 * @text マップ上で1ターン経過と見なす歩数のデフォルト値
 * @desc マップ上で1ターン経過と見なす歩数を指定します。マップのノートタグがあればそちらが優先されます。
 * @type number
 * @default 20
 * 
 * @param defaultFloorDamage
 * @text ダメージ床によるダメージデフォルト値
 * @desc ダメージ床に接触したとき、計算に使用する床ダメージ値を指定します。マップのノートタグがあればそちらが優先されます。
 * @default 10
 * 
 * @help 
 * マップに関する以下の機能を提供する。
 * ・ダメージ床によるダメージ計算に柔軟製を持たせる拡張。
 *   例えば針の山と溶岩があったとき、溶岩の方がダメージが大きくなるようにできる。
 *   <floorDamage>ノートタグ参照
 * ・床ステート(床に固定)
 *   地形に移動したとき、指定した床ステートが一時的に付与される。
 *   別な地形に移動すると解除される。
 *   <floorStates>ノートタグ参照。
 *   例えば結界エリアでは、スキルがしようできない、といった事が出来る。
 *   エネミーにも効果がある。
 *   飛行する乗り物に乗っているときは効果が無い。
 * ・床ステート(付与)
 *   地形に移動したとき、指定した床ステートが付与される。
 *   別な地形に移動しても解除されない。
 *   例えば毒の沼地に入ると、全員毒が付与されるような仕組みが出来る。
 *   <floorAppendStates>ノートタグ参照
 *   エネミーにも効果がある。
 *   飛行する乗り物に乗っているときは効果が無い。
 * 
 * 床ステートは移動毎にノートタグを解析して取得する実装にしてある。
 * 重いようならば見直しが必要。
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
 * マップ
 *   <floorDamage%d:eval$>
 *     マップの地形タグ%dに一致する地形の床ダメージ計算式をeval$にする。
 *     未指定の場合、マップの床ダメージ計算式タグまたはプラグインパラメータで指定した固定値が採用される。
 *     aに対象のバトラーが渡される。
 *     ex) 地形タグ7の固定ダメージ10
 *        <floorDamage1:10>
 *     ex) 地形タグ4は全損
 *        <floorDamage4:a.mhp>
 *   <floorDamage:eval$>
 *     地形タグ指定の計算式が指定されていないダメージ床での計算式。
 *     マップの床ダメージ計算式をevalにする。aに対象のバトラーが渡される。
 *     未指定の場合、プラグインパラメータで渡された固定値が使用される。
 *     ex) 固定ダメージ10
 *        <floorDamage:10>
 *     ex) 最大HPの1/10
 *        <floorDamage:a.mhp * 0.1>
 *   <floorStates%d:id1#,id2#,...>
 *     マップの地形タグ%dに一致する地形にいるとき、id1#,id2#,...のステートを付与する。
 *     プレイヤーが別の地形に移動すると、ステートは解除される。
 *   <floorStates:id1#,id2#,...>
 *     地形タグ指定のステートが指定されていない場合に、id1#,id2#,...のステートを付与する。
 *     但し、ステート無効されているステートは除く。
 *     プレイヤーが別の地形に移動すると、ステートは解除される。
 *   <mapStates:id1#,id2#,..>
 *     このマップにいる間、id1#,id2#,...のステートを付与する。
 *     但し、ステート無効されているステートは除く。
 *     プレイヤーが別のマップに移動すると、ステートは解除される。
 *   <floorAppendStates%d:id1#,id2#,...>
 *     マップの地形タグ%dに一致する地形に移動した時、id1#,id2#,...のステートを付与する。
 *     但し、ステート無効されているステートは除く。
 *     別の地形に移動しても解除されない。
 *   <floorAppendStates:id1#,id2#,...>
 *     地形タグ指定のステートが指定されていない場合に移動したとき、id1#,id2#,...のステートを付与する。
 *     但し、ステート無効されているステートは除く。
 *     別の地形に移動しても解除されない。
 *   <mapAppendStates:id1#,id2#,..>
 *     このマップに移動したとき、id1#,id2#,...のステートを付与する。
 *     但し、ステート無効されているステートは除く。
 *     別のマップに移動しても解除されない。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "KapuMapUtility";
    const parameters = PluginManager.parameters(pluginName);

    const defaultStepsForTurn = Math.max(1, Math.floor(Number(parameters["defaultStepsForTurn"] || 0)));
    const defaultFloorDamage = Math.max(1, Math.floor(Number(parameters["defaultFloorDamage"] || 0)));

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // Game_Map

    /**
     * このマップで1ターン経過と見なす歩数を得る。
     * 
     * @returns {number} 1ターン経過と見なす歩数。
     */
    Game_Map.prototype.stepsForTurn = function() {
        if (!this._stepsForTurn) {
            if ($dataMap && ($dataMap.meta.stepsForTurn !== undefined)) {
                this._stepsForTurn = Math.max(1, Math.floor(Number($dataMap.meta.stepsForTurn) || 0));
            } else {
                this._stepsForTurn = defaultStepsForTurn;
            }
        }
        return this._stepsForTurn;
    };

    /**
     * ダメージ床の基本ダメージを得る。
     * 
     * @param {number} x キャラクターx位置
     * @param {number} y キャラクターy位置
     * @param {Game_Battler} battler 対象のGame_Battler
     * @returns {number} 基本ダメージ
     */
    Game_Map.prototype.evalBasicFloorDamage = function(x, y, battler) {
        if (battler && this.this.isValid(x, y)) {
            const terrainTag = this.terrainTag(x, y); // 地形タグ
            if ($dataMap && ($dataMap.meta["floorDamage" + terrainTag])) {
                // 地形タグによるダメージ計算指定がある。
                const formula = $dataMap.meta["floorDamage" + terrainTag];
                try {
                    const a = battler; // eslint-disable-line no-unused-vars
                    const value = eval(formula);
                    return isNaN(value) ? 0 : value;
                }
                catch (e) {
                    console.error(e);
                    return defaultFloorDamage;
                }
            } else if ($dataMap && $dataMap.meta.floorDamage) {
                // マップにダメージ計算指定がある
                const formula = $dataMap.meta.floorDamage;
                try {
                    const value = eval(formula);
                    return isNaN(value) ? 0 : value;
                }
                catch (e) {
                    console.error(e);
                    return defaultFloorDamage;
                }
            } else {
                // 地形タグによるダメージ計算指定がない
                return defaultFloorDamage;
            }
        } else {
            return defaultFloorDamage;
        }
    };

    /**
     * 床によって付与されるステートを得る。
     * 
     * @param {number} x キャラクターx位置
     * @param {number} y キャラクターy位置
     * @returns {Array<number>} ステートID配列
     */
    Game_Map.prototype.floorStates = function(x, y) {
        const stateIds = [];
        if (this.this.isValid(x, y)) {
            const terrainTag = this.terrainTag(x, y); // 地形タグ
            if ($dataMap && ($dataMap.meta["floorStates" + terrainTag])) {
                const str = $dataMap.meta["floorStates" + terrainTag];
                const ids = str.split(',').map(token => Number(token));
                for (const id of ids) {
                    if ((id > 0) && !stateIds.includes(id)) {
                        stateIds.push(id);
                    }
                }
            } else if ($dataMap && $dataMap.meta.floorStates) {
                const str = $dataMap.meta.floorStates;
                const ids = str.split(',').map(token => Number(token));
                for (const id of ids) {
                    if ((id > 0) && !stateIds.includes(id)) {
                        stateIds.push(id);
                    }
                }
            }

            if ($dataMap && $dataMap.meta.mapStates) {
                const str = $dataMap.meta.mapStates;
                const ids = str.split(',').map(token => Number(token));
                for (const id of ids) {
                    if ((id > 0) && !stateIds.includes(id)) {
                        stateIds.push(id);
                    }
                }
            }
        }
        return stateIds;
    };

    /**
     * 床によって付与されるステートを得る。
     * 
     * @param {number} x キャラクターx位置
     * @param {number} y キャラクターy位置
     * @returns {Array<number>} ステートID配列
     */
    Game_Map.prototype.floorAppendStates = function(x, y) {
        const stateIds = [];
        if (this.this.isValid(x, y)) {
            const terrainTag = this.terrainTag(x, y); // 地形タグ
            if ($dataMap && ($dataMap.meta["floorAppendStates" + terrainTag])) {
                const str = $dataMap.meta["floorAppendStates" + terrainTag];
                const ids = str.split(',').map(token => Number(token));
                for (const id of ids) {
                    if ((id > 0) && !stateIds.includes(id)) {
                        stateIds.push(id);
                    }
                }
            } else if ($dataMap && $dataMap.meta.floorAppendStates) {
                const str = $dataMap.meta.floorAppendStates;
                const ids = str.split(',').map(token => Number(token));
                for (const id of ids) {
                    if ((id > 0) && !stateIds.includes(id)) {
                        stateIds.push(id);
                    }
                }
            }
            if ($dataMap && $dataMap.meta.mapAppendStates) {
                const str = $dataMap.meta.mapAppendStates;
                const ids = str.split(',').map(token => Number(token));
                for (const id of ids) {
                    if ((id > 0) && !stateIds.includes(id)) {
                        stateIds.push(id);
                    }
                }
            }
        }
        return stateIds;
    };
    //------------------------------------------------------------------------------
    // Game_Player
    /**
     * ダメージ床の基本ダメージ値を得る。
     * 
     * @param {Game_Battler} battler 
     * @returns {number} 基本ダメージ
     */
    Game_Player.prototype.evalBasicFloorDamage = function(battler) {
        return $gameMap.evalBasicFloorDamage(this.x, this.y, battler);
    };

    /**
     * 床によって付与されるステートを得る。
     * 
     * @returns {Array<number>} ステートID配列
     */
    Game_Player.prototype.floorStates = function() {
        return $gameMap.floorStates(this.x, this.y);
    };

    /**
     * 床によって付与されるステートを得る。
     * 
     * @returns {Array<number>} ステートID配列
     */
    Game_Player.prototype.floorAppendStates = function() {
        return $gameMap.floorAppendStates(this.x, this.y);
    };

    /**
     * 床ステートが付与される条件かどうかを判定する。
     * 
     * @returns {boolean} 床ステートが有効な場合にはture, それ以外はfalse.
     */
    Game_Player.prototype.isEffectFloorState = function() {
        return !this.isInAirship();        
    }    
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    /**
     * Game_BattlerBaseのパラメータを初期化する。
     * Game_Enemy, Game_Battlerで独自パラメータを追加する場合、本メソッドをフックする。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this.clearFloorStates();
    };

    /**
     * 床ステートを解除する。
     */
    Game_BattlerBase.prototype.clearFloorStates = function() {
        this._floorStates = [];
    };

    /**
     * 床によるステートIDをセットする。
     * 
     * @param {Array<number>} stateIds ステートID配列
     */
    Game_BattlerBase.prototype.setFloorStates = function(stateIds) {
        this._floorStates = [];
        for (const stateId of stateIds) {
            if (!this.isStateResist(stateId)) {
                this._floorStates.push(stateId);
            }
        }
    };

    const _Game_BattlerBase_isStateAffected = Game_BattlerBase.prototype.isStateAffected;
    /**
     * stateIdで指定されるステートを持っているかどうかを取得する。
     * 
     * @param {number} stateId ステートID
     * @return {boolean} ステートを持っている場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isStateAffected = function(stateId) {
        return _Game_BattlerBase_isStateAffected.call(this, stateId)
                || (this._floorStates.includes(stateId));
    };

    /**
     * 床によって一時的に付与されているステートを取得する。
     * 
     * @returns {Array<object>} stateIds ステート配列
     */
    Game_BattlerBase.prototype.floorStates = function() {
        return this._floorStates.map(id => $dataStates[id]);
    };

    const _Game_BattlerBase_states = Game_BattlerBase.prototype.states;
    /**
     * このGame_Battlerのステートを返す。
     * 
     * @return {Array<DataState>} ステート配列
     */
    Game_BattlerBase.prototype.states = function() {
        const states = _Game_BattlerBase_states.call(this);
        const floorStates = this.floorStates();
        for (const state of floorStates) {
            if (!states.includes(state)) {
                states.push(state);
            }
        }
        return states;
    }; 
    //------------------------------------------------------------------------------
    // Game_Enemy
    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    /**
     * エネミーをセットアップする。
     * 
     * @param {number} enemyId エネミーID
     * @param {number} x X位置
     * @param {number} y Y位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);

        if ($gamePlayer.isEffectFloorState()) {
            // 床ステートを反映さえる。
            this.setFloorStates($gamePlayer.floorStates());
            const stateIds = $gamePlayer.floorAppendStates();
            for (const stateId of stateIds) {
                if (!this.isStateResist(stateId)) {
                    this.addState(stateId);
                }
            }
        }
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * 1ターンとして扱う歩数。
     * マップ上でこの歩数だけ歩くと、ターン終了処理が呼ばれる。
     * 
     * @returns {number} 歩数
     * !!!overwrite!!! Game_Actor.stepsForTurn()
     *     1ターンとして扱う歩数を変更するためオーバーライドする。
     */
    Game_Actor.prototype.stepsForTurn = function() {
        return $gameMap.stepsForTurn();
    };

    /**
     * 基本床ダメージ量を得る。
     * 
     * @returns {number} 床ダメージ量
     * !!!overwrite!!! Game_Actor.basicFloorDamage()
     *     床ダメージ計算を変更するため、オーバーライドする。
     */
    Game_Actor.prototype.basicFloorDamage = function() {
        return $gamePlayer.evalBasicFloorDamage(this);
    };

    const _Game_Actor_checkFloorEffect = Game_Actor.prototype.checkFloorEffect;
    /**
     * 床のエフェクトをチェックする。
     */
    Game_Actor.prototype.checkFloorEffect = function() {
        _Game_Actor_checkFloorEffect.call(this);

        if ($gamePlayer.isEffectFloorState()) {
            // 床の上にのっているときだけ効果があるステートを更新
            this.setFloorStates($gamePlayer.floorStates());
            // 床の上にのったときに付与されるステートを更新
            const stateIds = $gamePlayer.floorAppendStates();
            for (const stateId of stateIds) {
                if (!this.isStateResist(stateId)) {
                    this.addState(stateId);
                }
            }
        } else {
            // 床の上にのっているときだけ効果があるステートを解除
            this.clearFloorStates();
        }
    };

    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張





})();