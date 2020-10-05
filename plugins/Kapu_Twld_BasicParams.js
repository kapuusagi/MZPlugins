/*:ja
 * @target MZ 
 * @plugindesc TWLD向け基本パラメータプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param basciParamTraitCode
 * @text 特性コード
 * @desc 特性加算値として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 1001
 * @type number
 * @min 65
 * @max 9999
 * 
 * @help 
 * TWLD向けに作成した、基本パラメータ(STR/DEX/VIT/INT/MEN/AGI/LUK)を追加するプラグイン。
 * 既存のAGI/LUKは挙動変更のために動作が変わります。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 基本パラメータ加算特性
 *     Game_BattlerBase.TRAIT_BASIC_PARAM を追加。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/エネミー
 *     <basicParams:str#,dex#,vit#,int#,men#,agi#>
 * 
 *         アクター/エネミーについては1以上の値。
 *         未指定時はデフォルト値として全て20二セットされる。
 *         クラス/ウェポン/アーマーについては正負の値。
 * 
 * エネミー
 *     <basicParamsVariance:str#,dex#,vit#,int#,men#,agi#>
 * 
 *         エネミーのパラメータばらつき具合。±valueの範囲で上下する。
 * 
 * 
 * クラス/ウェポン/アーマー/ステート
 *     <str:value#>
 *     <dex:value#>
 *     <vit:value#>
 *     <int:value#>
 *     <men:value#>
 *     <agi:value#>
 *     <luk:value#>
 *         各パラメータを value# だけ加算(減算)する。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。作りかけ
 */
(() => {
    const pluginName = "Kapu_Twld_BasicParams";
    const parameters = PluginManager.parameters(pluginName);
    Game_BattlerBase.TRAIT_BASIC_PARAM = Number(parameters["basciParamTraitCode"]) || 0;

    if (!Game_BattlerBase.TRAIT_BASIC_PARAM) {
        console.error(pluginName + ":TRAIT_BASIC_PARAM is not valid.");
    }


    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // DataManager


    /**
     * 非バトラーのノートタグを処理する。
     * 
     * @apram {DataEnemy} obj オブジェクト。
     */
    const _processNonBattlerNotetag = function(obj) {
        if (Game_BattlerBase.TRAIT_BASIC_PARAM) {
            if (obj.meta.str) {
                _addBasicParamTrait(obj, obj.meta.str);
            }
            if (obj.meta.dex) {
                _addBasicParamTrait(obj, obj.meta.dex);
            }
            if (obj.meta.int) {
                _addBasicParamTrait(obj, obj.meta.int);
            }
            if (obj.meta.men) {
                _addBasicParamTrait(obj, obj.meta.men);
            }
            if (obj.meta.agi) {
                _addBasicParamTrait(obj, obj.meta.agi);
            }
            if (obj.meta.luk) {
                _addBasicParamTrait(obj, obj.meta.luk);
            }
        }
    };

    DataManager.addNotetagClasses(_processNonBattlerNotetag);
    DataManager.addNotetagParserWeapons(_processNonBattlerNotetag);
    DataManager.addNotetagParserArmors(_processNonBattlerNotetag);
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    /**
     * Game_BattlerBaseのパラメータを初期化する。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._basicParams = [20, 20, 20, 20, 20, 20]
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);

        const actor = $dataActors[actorId];
        if (actor.meta.basicParams) {
            const tokens = actor.meta.basicParams.split(",");
            const count = Math.min(actor.basicParams.length, tokens.length);
            for (let i = 0; i < count; i++) {
                const value = Number(tokens[i]);
                if (value > 0) {
                    this._basicParams[i] = value;
                }
            }
        }
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    /**
     * エネミーをセットアップする。
     * 
     * @param {Number} enemyId エネミーID
     * @param {Number} x X位置
     * @param {Number} y Y位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);

        const enemy = $dataEnemis[enemyId];
        if (enemy.meta.basicParams) {
            const tokens = enemy.meta.basicParams.split(",");
            const count = Math.min(enemy.basicParams.length, tokens.length);
            for (let i = 0; i < count; i++) {
                const value = Number(tokens[i]);
                if (value > 0) {
                    this._basicParams[i] = value;
                }
            }
        }
        if (enemy.meta.basicParamsVariance) {
            const tokens = enemy.meta.basicParams.split(",");
            const count = Math.min(enemy.basicParams.length, tokens.length);
            for (let i = 0; i < count; i++) {
                const variance = Number(tokens[i]);
                if (variance > 0) {
                    // randomInt(variance * 2 + 1)で0～(variance*2)の正数値が返る。
                    const value = this._basicParams[i] + Math.randomInt(variance * 2 + 1) - variance;
                    this._basicParams[i] = Math.max(1, value);
                }
            }
        }
    };









})();