/*:ja
 * @target MZ 
 * @plugindesc 成長システムプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * ■ gainGrowPoint
 * @command gainGrowPoint
 * @text 成長ポイント加算
 * @desc 指定アクターの成長ポイントを加算する。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 加算するアクターのID。
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc アクターIDを変数で指定する場合に使用する。
 * @default 0
 * @type number
 * 
 * @arg value
 * @text 増加量
 * @desc 加算する値
 * @type number
 * @min 1
 * 
 * ■ resetGrows
 * @command resetGrows
 * @text 成長リセット
 * @desc 指定アクターの育成状態をリセットする。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 加算するアクターのID。
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc アクターIDを変数で指定する場合に使用する。
 * @default 0
 * @type number
 * 
 * @param maxGrowPoint
 * @text 最大成長ポイント
 * @desc 成長ポイントの最大値
 * @type number
 * @default 999
 * @min 0
 * 
 * @param growPointAtLevelUp
 * @text レベルアップ時加算ポイント
 * @desc レベルアップ時に加算する成長ポイントの量。evalで評価するので、levelを使った計算式も可。
 * @type number
 * @default 3
 * @min 0
 * 
 * @param effectCode
 * @text 成長ポイント加算エフェクトコード
 * @desc 成長ポイントを加算する効果を割り当てるエフェクトコード。
 * @type number
 * @default 101
 * @min 4
 * 
 * @param resetEffectCode
 * @text 成長リセットするエフェクトコード
 * @desc 成長リセットをする効果を割り当てるエフェクトコード。
 * @type number
 * @default 102
 * @min 4
 * 
 * @param initialGrowPoint
 * @text 初期育成ポイント
 * @desc 育成ポイント初期値
 * @type number
 * @default 10
 * @min 0
 * 
 * @param growPointText
 * @text 成長ポイント名
 * @desc 成長ポイントの名前。UI表示などでTextManager.growPointで取得するラベルに使用する。
 * @type string
 * @default GP
 * 
 * @param enableProperty
 * @text プロパティ定義
 * @desc trueにすると、actorにプロパティgpを追加する。
 * @type boolean
 * @default false
 * 
 * @param gainGpAtEachLevelup
 * @text レベルが上がったときは必ず成長ポイント増加
 * @desc レベルアップしたとき、成長ポイントが加算されます。falseにすると、アクターの最大レベルが更新されたときだけ加算されます。
 * @type boolean
 * @default false
 *  
 * @help 
 * GP(GrowPoint)成長システムの枠を提供するプラグイン。
 * 但し本プラグイン単体では動作しない。
 * GPはレベルアップとアイテム（種）で加算し、
 * 成長UIにて任意の割り振りをしたりすることを想定する。
 * 
 * なんでこれを用意したかというと、
 * プレイヤーに「成長ポイントを何に割り振るか」という楽しみを提供するため。
 * よくある習得システムだと、
 * 「スキルはスキルポイント、ステータスはステータスポイント」と決まっていて
 * 「どっちに割り振ろうか」ということにできなかった。
 * 全体を包括してるスゴイプラグインもあるけど．．．。
 * 
 * ■ 使用時の注意
 * 本プラグインにはUIはない。UIプラグインを併せて使用すること。
 * 
 * ■ プラグイン開発者向け
 * 最大GrowPoint値を保持する Game_Actor.MAX_GROW_POINT を追加します。
 * GrowPointは Game_Actor に以下のオブジェクトとして格納しています。
 * _growPoint {
 *     current: {number} 現在値。振り分け格納な値。
 *     max: {number} 最大値。リセット時はcurrentがこの値になる。
 * };
 * 
 * 成長ポイント表示名は TextManager.growPoint で取得できる。
 * 
 * 
 * 独自の育成項目を追加するには、以下を実装します。
 * 1.Game_Actor.initMembersをフックして育成データを格納する場所を追加。
 * 2.Game_Actor.initGrowsをフックし、ノートタグを解析して初期値を設定する処理を追加。
 *   但し装備可能スキルの設定などが入ってくる場合には、
 *   initSkillsなどフックする対象を適切に選択する必要がある。
 *   （必要な場合）
 * 3.Game_Actor.usedGrowupPointをフックし、使用済みGP値の計算を追加。
 * 4.Game_Actorの適切なメソッドをフックし、育成データを反映する場所を追加。
 *   例えばMaxHPならGame_Actor.paramBaseかGame_Actor.paramPlusをフックする。
 * 5.Game_Actor.resetGrowsをフックし、育成リセットを追加。
 * 6.Game_Actor.growupItemsをフックし、育成項目を返す処理を追加
 * 7.Game_Actor.applyGrowupをフックし、育成適用処理を追加。
 * 
 * サンプルはKapu_GrowupSystem_Params等を参照。
 * 
 * その他
 * Game_Actor.grown()
 *      なんらかの育成項目が適用されたときの処理を行う。
 *      育成アイテムの更新処理を行う場合などにフックする。
 * 
 * 育成項目は Game_Actor.growupItems にて配列を返す。
 * GrowupItem = {
 *     iconIndex : {number} アイコンインデックス
 *     name : {String} 項目名
 *     type : {String} 育成タイプ。(プラグインで識別に使用する文字列)
 *     id : {number} 成長処理側で使用する識別ID
 *     cost : {number} growPointのコスト
 *     description : {String} 説明用文字列。
 * }
 * 実際の育成処理は
 * Game_Actor.prototype.applyGrowup
 * をフックして実装する。適用できたらtrueを返すこと。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * gainGrowPoint
 *     アクターの成長ポイントを加算する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *     <growPoint:max#>
 *          加入時の成長ポイント現在値と最大値をmaxで指定した値にする。
 * 
 * アイテム/スキル
 *     <growPoint:value#>
 *          使用すると、対象の成長ポイントをvalue#だけ追加する。
 *     <resetGrows>
 *          使用すると、育成状態をリセットする効果を追加する。（非戦闘中のみ適用可)
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.5.0 クラスチェンジでレベルが下がったとき、
 *               再度レベルアップでの成長ポイントを加算させるかを設定できるようにした。
 * Version.0.4.0 Lv1時のGrowPointをプラグインパラメータで用意できるようにした。
 * Version.0.3.0 使用済みGrowPointを計算するインタフェースを追加。
 *               セットアップの煩わしさを軽減する。
 * Version.0.2.0 育成状態変更時に通知を受け取るonGrownメソッドを追加。
 * Version.0.1.1 全てのスキル/アイテムに育成リセット効果が付与されていた不具合を修正した。
 * Version.0.1.0 TWLD向けコードから抜粋して移植。 
 */
(() => {
    const pluginName = "Kapu_GrowupSystem";
    const parameters = PluginManager.parameters(pluginName);
    Game_Actor.MAX_GROW_POINT = Number(parameters["maxGrowPoint"]) || 999;
    Game_Action.EFFECT_GAIN_GROWPOINT = Number(parameters["effectCode"]) || 0;
    Game_Action.EFFECT_RESET_GROWS = Number(parameters["resetEffectCode"]) || 0;
    const growPointAtLevelUp = parameters["growPointAtLevelUp"] || 0;
    const growPointText = String(parameters["growPointText"]) || "GP";
    const enableProperty = (typeof parameters["enableProperty"] === "undefined")
            ? false : (parameters["enableProperty"] === "true");
    const initialGrowPoint = Number(parameters["initialGrowPoint"]) || 10;
    const gainGpAtEachLevelup = (parameters["gainGpAtEachLevelup"] === undefined)
            ? false : (parameters["gainGpAtEachLevelup"] === "true");

    Object.defineProperty(TextManager, "growPoint", { get: () => growPointText, configurable:true});

    if (!Game_Action.EFFECT_GAIN_GROWPOINT) {
        console.error(pluginName + ":EFFECT_GAIN_GROWPOINT is not valid.");
    }
    if (!Game_Action.EFFECT_RESET_GROWS) {
        console.error(pluginName + ":EFFECT_RESET_GROWS is not valid.");
    }

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


    PluginManager.registerCommand(pluginName, "gainGrowPoint", args => {
        const actorId = _getActorId(args);
        const value = Math.floor(Number(args.value) || 0);
        if ((actorId > 0) && (value > 0)) {
            const actor = $gameActors.actor(actorId);
            if (actor) {
                actor.gainGrowPoint(value);
            }
        }
    });

    PluginManager.registerCommand(pluginName, "resetGrows", args => {
        const actorId = _getActorId(args) || 0;
        if (actorId > 0) {
            const actor = $gameActors.actor(actorId);
            if (actor) {
                actor.resetGrows();
            }
        }
    });

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * ノートタグを処理する。
     * 
     * @param {object} obj データオブジェクト。(DataItem/DataSkill)
     */
    const _processNotetag = function(obj) {
        if (Game_Action.EFFECT_GAIN_GROWPOINT && obj.meta.growPoint) {
            const value = Math.floor(Number(obj.meta.growPoint) || 0);
            if (value > 0) {
                obj.effects.push({
                    code: Game_Action.EFFECT_GAIN_GROWPOINT,
                    dataId: 0,
                    value1: value,
                    value2: 0
                });
            }
        }
        if (Game_Action.EFFECT_RESET_GROWS && obj.meta.resetGrows) {
            obj.effects.push({
                code: Game_Action.EFFECT_RESET_GROWS,
                dataId: 0,
                value1: 0,
                value2: 0
            });
        }
    };

    DataManager.addNotetagParserSkills(_processNotetag);
    DataManager.addNotetagParserItems(_processNotetag);

    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._growPoint = { current : 0, max : 0 };
        this._gotGpLevel = this._level;
    };

    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);

        this.initGrows();

        const actor = $dataActors[actorId];
        const growPoint = Math.floor(Number(actor.meta.growPoint)) || initialGrowPoint;
        const usedGrowPoint = this.usedGrowupPoint();
        const calcGrowPoint = this.growPointOfLevel();
        this._growPoint.max = Math.max(usedGrowPoint + growPoint, calcGrowPoint).clamp(0, Game_Actor.MAX_GROW_POINT);
        this._growPoint.current = Math.max(0, this._growPoint.max - usedGrowPoint);
        this._gotGpLevel = this._level;
    };

    /**
     * 現在のレベルに対応するGrowPoint合計値を計算する。
     * 
     * Note: Lvアップ毎にランダムで増減する拡張もあり得るため、
     *       setup()時の初期値を計算する時だけ使用する。
     * 
     * @returns {number} 育成ポイント合計
     */
    Game_Actor.prototype.growPointOfLevel = function() {
        let value = initialGrowPoint;
        for (let lv = 2; lv <= this.level; lv++) {
            value += this.growPointAtLevelUp(lv);
        }

        return value.clamp(0, Game_Actor.MAX_GROW_POINT);
    };

    /**
     * 育成状態を初期化する。
     */
    Game_Actor.prototype.initGrows = function() {
    };

    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    /**
     * レベルアップ処理をする。
     */
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);

        if (gainGpAtEachLevelup || (this._level > this._gotGpLevel)) {
            const gpPlus = this.growPointAtLevelUp(this._level);
            this.gainGrowPoint(gpPlus);
            this._gotGpLevel = this._level;
        }

        // 成長ボーナス加算

    };

    /**
     * レベルアップ時に加算するGrowPointを得る。
     * 
     * @param {number} level レベル
     * @returns {number} 加算するGrowPoint
     */
    // eslint-disable-next-line no-unused-vars
    Game_Actor.prototype.growPointAtLevelUp = function(level) {
        return Math.floor(eval(growPointAtLevelUp) || 0);
    };

    /**
     * 現在の成長ボーナス値を得る。
     * つまり、残っているポイントね。
     * 
     * @returns {number} 現在の成長ボーナス値。
     */
    Game_Actor.prototype.growPoint = function() {
        return this._growPoint.current;
    };

    /**
     * 使用済みGrowPointを得る。
     * setup()時に、使用済みGrowPointを計算するために使用される。
     * 
     * @returns {number} 使用済み育成ポイント。
     */
    Game_Actor.prototype.usedGrowupPoint = function() {
        return 0;
    };

    /**
     * 最大成長ボーナス値を得る。
     * つまり、使用済み＋残っているポイント。
     * 
     * @returns {number} 成長ボーナス値合計。
     */
    Game_Actor.prototype.maxGrowPoint = function() {
        return this._growPoint.max;
    };

    /**
     * 成長ポイントにvalueを加算する。
     * プラグインパラメータで指定された、最大成長ポイントは超えない。
     * 
     * @param {number} value 加算値
     */
    Game_Actor.prototype.gainGrowPoint = function(value) {
        const gainValue = Math.min(Game_Actor.MAX_GROW_POINT - this._growPoint.max, value);
        if (gainValue) {
            this._growPoint.current += gainValue;
            this._growPoint.max += gainValue;
        }
    };

    /**
     * 成長リセットする。
     * 
     * 本システムを使った拡張プラグインにて、
     * 本メソッドをフックしてリセット処理を実装すること。
     */
    Game_Actor.prototype.resetGrows = function() {
        this._growPoint.current = this._growPoint.max;
        this.releaseUnequippableItems();
        this.onGrown();
        this.refresh();
    };

    /**
     * 育成項目を返す。
     * 
     * @returns {Array<GrowupItem>} 育成項目
     */
    Game_Actor.prototype.growupItems = function() {
        return [];
    };

    /**
     * 育成する。
     * 
     * @param {GrowupItem} growupItem 育成項目
     */
    Game_Actor.prototype.growup = function(growupItem) {
        if (growupItem.cost <= this.growPoint()) {
            if (this.applyGrowup(growupItem)) {
                this._growPoint.current -= growupItem.cost;
                this.onGrown();
                this.refresh();
            }
        }
    };

    /**
     * 成長処理が行われたときの処理を行う。
     */
    Game_Actor.prototype.onGrown = function() {

    };

    /**
     * 育成項目を適用する。
     * 
     * @param {GrowupItem} growupItem 育成項目
     * @returns {boolean} 適用できたかどうか。
     */
    // eslint-disable-next-line no-unused-vars
    Game_Actor.prototype.applyGrowup = function(growupItem) {
        return false;
    };

    if (enableProperty) {
        /**
         * 残りGPを表すプロパティ名
         * @constant {number}
         */
        Object.defineProperty(Game_Actor.prototype, "gp", {
            /** @returns {number} */
            get: function() {
                return this._growPoint.current;
            },
            configurable: true
        });
        /**
         * 最大GPを表すプロパティ名
         * @constant {number}
         */
        Object.defineProperty(Game_Actor.prototype, "maxgp", {
            /** @returns {number} */
            get: function() {
                return this._growPoint.max;
            },
            configurable: true
        });
    }

    //------------------------------------------------------------------------------
    // Game_Action

    const _Game_Action_testItemEffect = Game_Action.prototype.testItemEffect;
    /**
     * 効果を適用可能かどうかを判定する。
     * codeに対応する判定処理が定義されていない場合、適用可能(true)が返る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @param {DataEffect} effect エフェクトデータ
     * @returns {boolean} 適用可能な場合にはtrue, それ以外はfalse
     */
    Game_Action.prototype.testItemEffect = function(target, effect) {
        if (Game_Action.EFFECT_GAIN_GROWPOINT
                && (effect.code === Game_Action.EFFECT_GAIN_GROWPOINT)) {
            return (target.isActor() && (target.maxGrowPoint() < Game_Actor.MAX_GROW_POINT));
        } else if (Game_Action.EFFECT_RESET_GROWS
                && (effect.code === Game_Action.EFFECT_RESET_GROWS)) {
            return !$gameParty.inBattle() && target.isActor()
                    && (target.growPoint() < target.maxGrowPoint());
        } else {
            return _Game_Action_testItemEffect.call(this, target, effect);
        }
    };

    const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    /**
     * 効果を適用する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {DataEffect} effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        if (Game_Action.EFFECT_RESET_GROWS
                && (effect.code === Game_Action.EFFECT_GAIN_GROWPOINT)) {
            this.applyItemEffectGainGrowPoint(target, effect);
        } else if (Game_Action.EFFECT_RESET_GROWS
                && (effect.code === Game_Action.EFFECT_RESET_GROWS)) {
            this.applyItemEffectResetGrows(target, effect);
        } else {
            _Game_Action_applyItemEffect.call(this, target, effect);
        }
    };

    /**
     * 効果を適用する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {DataEffect} effect エフェクトデータ
     */
    Game_Action.prototype.applyItemEffectGainGrowPoint = function(target, effect) {
        if (target.isActor()) {
            target.gainGrowPoint(effect.value1);
            this.makeSuccess(target);
        }
    };
    /**
     * 効果を適用する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {DataEffect} effect エフェクトデータ
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.applyItemEffectResetGrows = function(target, effect) {
        if (target.isActor()) {
            target.resetGrows();
            this.makeSuccess(target);
        }
    };
})();
