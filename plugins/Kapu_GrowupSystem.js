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
 * @param growPointText
 * @text 成長ポイント名
 * @desc 成長ポイントの名前
 * @type string
 * @default GP
 * 
 * @param enableProperty
 * @text プロパティ定義
 * @desc trueにすると、actorにプロパティgpを追加する。
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
 *     current: {Number} 現在値。振り分け格納な値。
 *     max: {Number} 最大値。リセット時はcurrentがこの値になる。
 * };
 * 
 * 成長ポイント表示名は TextManager.growPoint で取得できる。
 * 
 * 
 * 独自の育成項目を追加するには、以下を実装します。
 * 1.Game_Actor.initMembersをフックして育成データを格納する場所を追加。
 * 2.Game_Actor.setupをフックし、ノートタグを解析して初期値を設定する処理を追加。
 *   （必要な場合）
 * 3.Game_Actorの適切なメソッドをフックし、育成データを反映する場所を追加。
 * 　例えばMaxHPならGame_Actor.paramBaseかGame_Actor.paramPlusをフックする。
 * 4.Game_Actor.resetGrowsをフックし、育成リセットを追加。
 * 5.Game_Actor.growupItemsをフックし、育成項目を返す処理を追加
 * 6.Game_Actor.applyGrowupをフックし、育成適用処理を追加。
 * 
 * サンプルはKapu_GrowupSystem_Params等を参照。
 * 
 * 育成項目は Game_Actor.growupItems にて配列を返す。
 * GrowupItem = {
 *     iconIndex : {Number} アイコンインデックス
 *     name : {String} 項目名
 *     type : {String} 育成タイプ。(プラグインで識別に使用する文字列)
 *     id : {Number} 成長処理側で使用する識別ID
 *     cost : {Number} growPointのコスト
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
 *     <growPoint:current#/max#>
 *     <growPoint:current#,max#>
 *          加入時の成長ポイント現在値をcurrent#に、最大値をmax#で指定した値にする。
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
    const enableProperty = Boolean(parameters["enableProperty"]) || false;

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
     * @param {Object} args プラグインコマンド引数
     * @return {Number} アクターID
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
     * @param {Object} obj データオブジェクト。(DataItem/DataSkill)
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
        if (Game_Action.EFFECT_RESET_GROWS) {
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
        this._growPoint = { current : 10, max : 10 };
    };

    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const actor = $dataActors[actorId];
        if (actor.meta.growPoint) {
            const tokens = actor.meta.growPoint.split(/[,/]/);
            if (tokens.length >= 2) {
                this._growPoint.current = Matn.floor(Number(tokens[0]) || 0);
                this._growPoint.max = Math.floor(Number(tokens[1]) || 0);
            } else {
                this._gorwPoint.current = Math.floor(Number(tokens[0]) || 0);
                this._growPoint.max = this._growPoint.current;
            }
        }
        if (this._growPoint.current > this._growPoint.max) {
            this._growPoint.current = this._growPoint.max;
        }
    };

    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    /**
     * レベルアップ処理をする。
     */
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);

        // 成長ボーナス加算
        var gpPlus = this.growPointAtLevelUp(this._level);
        this.gainGrowPoint(gpPlus);
    };

    /**
     * レベルアップ時に加算するGrowPointを得る。
     * 
     * @param {Number} level レベル
     * @return {Number} 加算するGrowPoint
     */
    Game_Actor.prototype.growPointAtLevelUp = function(level) {
        return Math.floor(eval(growPointAtLevelUp) || 0);
    };

    /**
     * 現在の成長ボーナス値を得る。
     * つまり、残っているポイントね。
     * 
     * @return {Number} 現在の成長ボーナス値。
     */
    Game_Actor.prototype.growPoint = function() {
        return this._growPoint.current;
    };

    /**
     * 最大成長ボーナス値を得る。
     * つまり、使用済み＋残っているポイント。
     * 
     * @return {Number} 成長ボーナス値合計。
     */
    Game_Actor.prototype.maxGrowPoint = function() {
        return this._growPoint.max;
    };

    /**
     * 成長ポイントにvalueを加算する。
     * プラグインパラメータで指定された、最大成長ポイントは超えない。
     * 
     * @param {Number} value 加算値
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
        this.refresh();
    };

    /**
     * 育成項目を返す。
     * 
     * @return {Array<GrowupItem>} 育成項目
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
                this.refresh();
            }
        }
    };

    /**
     * 育成項目を適用する。
     * 
     * @param {GrowupItem} growupItem 育成項目
     * @return {Boolean} 適用できたかどうか。
     */
    Game_Actor.prototype.applyGrowup = function(growupItem) {
        return false;
    };

    if (enableProperty) {
        /**
         * 残りGPを表すプロパティ名
         * @constant {Number}
         */
        Object.defineProperty(Game_Actor.prototype, "gp", {
            /** @return {Number} */
            get: function() {
                return this._growPoint.current;
            },
            configurable: true
        });
        /**
         * 最大GPを表すプロパティ名
         * @constant {Number}
         */
        Object.defineProperty(Game_Actor.prototype, "maxgp", {
            /** @return {Number} */
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
     * @return {Boolean} 適用可能な場合にはtrue, それ以外はfalse
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
    Game_Action.prototype.applyItemEffectResetGrows = function(target, effect) {
        if (target.isActor()) {
            target.resetGrows();
            this.makeSuccess(target);
        }
    };
})();