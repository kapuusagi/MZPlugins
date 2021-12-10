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
 * マップに関する以下の機能を提供します。
 * 
 * TODO : 床ステートとかやりたい。マップ上のReagionにのってると自動付与されるみたいな。Rejectで無効。
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
 *     地形タグ指定の計算式が指定されている場合、そちらが採用される。
 *     マップの床ダメージ計算式をevalにする。aに対象のバトラーが渡される。
 *     未指定の場合、プラグインパラメータで渡された固定値が使用される。
 *     ex) 固定ダメージ10
 *        <floorDamage:10>
 *     ex) 最大HPの1/10
 *        <floorDamage:a.mhp * 0.1>
 * 
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


    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張





})();