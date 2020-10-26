/*:ja
 * @target MZ 
 * @plugindesc TWLD向け改変
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * @orderAfter Kapu_Base_Hit
 * @orderAfter Kapu_Base_DamageCalculation
 * 
 * @param actorParameter
 * @text アクターパラメータ
 * @desc アクターのパラメータ
 * 
 * @param actorParamMax0
 * @text MaxHP最大値
 * @desc アクターの最大HPのとりうる最大値。
 * @type number
 * @default 9999
 * @parent actorParameter
 * 
 * @param actorParamMax1
 * @text MaxMP最大値
 * @desc アクターの最大MPのとりうる最大値。
 * @type number
 * @default 9999
 * @parent actorParameter
 * 
 * @param actorParamMax2
 * @text ATK最大値
 * @desc アクターのATKのとりうる最大値。
 * @type number
 * @default 9999
 * @parent actorParameter
 * 
 * @param actorParamMax3
 * @text DEF最大値
 * @desc アクターのDEFのとりうる最大値。
 * @type number
 * @default 9999
 * @parent actorParameter
 * 
 * @param actorParamMax4
 * @text MAT最大値
 * @desc アクターのMATのとりうる最大値。
 * @type number
 * @default 9999
 * @parent actorParameter
 * 
 * @param actorParamMax5
 * @text MDF最大値
 * @desc アクターのMDFのとりうる最大値。
 * @type number
 * @default 9999
 * @parent actorParameter
 * 
 * @param actorParamMax6
 * @text AGI最大値
 * @desc アクターのAGIのとりうる最大値。
 * @type number
 * @default 999
 * @parent actorParameter
 * 
 * @param actorParamMax7
 * @text LUK最大値
 * @desc アクターのLUKのとりうる最大値。
 * @type number
 * @default 999
 * @parent actorParameter
 * 
 * @param enemyParameter
 * @text エネミーパラメータ
 * @desc エネミーのパラメータ
 * 
 * @param enemyParamMax0
 * @text MaxHP最大値
 * @desc エネミーの最大HPのとりうる最大値。
 * @type number
 * @default 999999
 * @parent enemyParameter
 * 
 * @param enemyParamMax1
 * @text MaxMP最大値
 * @desc エネミーの最大MPのとりうる最大値。
 * @type number
 * @default 9999
 * @parent enemyParameter
 * 
 * @param enemyParamMax2
 * @text ATK最大値
 * @desc エネミーのATKのとりうる最大値。
 * @type number
 * @default 9999
 * @parent enemyParameter
 * 
 * @param enemyParamMax3
 * @text DEF最大値
 * @desc エネミーのDEFのとりうる最大値。
 * @type number
 * @default 9999
 * @parent enemyParameter
 * 
 * @param enemyParamMax4
 * @text MAT最大値
 * @desc エネミーのMATのとりうる最大値。
 * @type number
 * @default 9999
 * @parent enemyParameter
 * 
 * @param enemyParamMax5
 * @text MDF最大値
 * @desc エネミーのMDFのとりうる最大値。
 * @type number
 * @default 9999
 * @parent enemyParameter
 * 
 * @param enemyParamMax6
 * @text AGI最大値
 * @desc エネミーのAGIのとりうる最大値。
 * @type number
 * @default 999
 * @parent enemyParameter
 * 
 * @param enemyParamMax7
 * @text LUK最大値
 * @desc LUKのとりうる最大値。
 * @type number
 * @default 999
 * @parent enemyParameter
 * 
 * @help 
 * ベーシックシステムのTWLD向け変更を行うプラグインです。
 * 各Trait系プラグインによる変更前に適用するものを全て入れます。
 * 1．装備品による増加分の取り扱い変更
 *     基本パラメータの計算において、MaxHP/MaxMP/ATK/DEF/MAT/MDF/AG/LUKの
 *     乗算レート対象から装備品を外します。（バフ分はコレまで通り）
 * 
 * 2. 命中判定の扱い変更
 *     クリティカルの発生有無を最初に判定するように変更します。
 *     クリティカルが発生した場合、必ず命中するようになります。
 *     だからクリティカル率もりもり上げよう。
 * 
 * 3. アクター/エネミーのパラメータ最大値の制限
 *     面倒なのでプラグインパラメータにはしない。
 *     
 * 4．TPB速度の算出式変更
 *     
 * 
 * ■ 使用時の注意
 * なし。
 * 
 * ■ プラグイン開発者向け
 * Game_Actor.param()をオーバーライドします。
 * Game_Actor.paramPlus()をオーバーライドします。
 * 装備品補正値、paramEquip()は Kapu_Base_Params にて定義しています。
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
 * Version.0.2.0 スキルによる回復倍率を、使用者と対象のMENを参照するようにした。動作未確認。
 * Version.0.1.0 追加した。
 */
(() => {
    const pluginName = "Kapu_Base_Twld";
    const parameters = PluginManager.parameters(pluginName);

    const actorParamMax = [];
    for (let i = 0; i < 8; i++) {
        actorParamMax[i] = Number(parameters["actorParamMax" + i]) || 9999;
    }
    const enemyParamMax = [];
    for (let i = 0; i < 8; i++) {
        enemyParamMax[i] = Number(parameters["enemyParamMax" + i]) || ((i === 0) ? 999999 : 9999);
    }

    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * このGame_BattlerのTPB速度を得る。
     * ベースパラメータからのTPB速度計算式を変更したいならば、本メソッドをオーバーライドする。
     * 
     * @return {Number} TPB速度。
     */
    Game_Battler.prototype.tpbSpeed = function() {
        return 10 + ((this.agi - 20) * 0.2).clamp(0, 15);
    };

    /**
     * このGame_BattlerのTPB基準速度。
     * 
     * @return {Number} TPBベース速度
     */
    Game_Battler.prototype.tpbBaseSpeed = function() {
        return 25;
    };
    /**
     * キャスト時間を得る。
     * 既定の実装では以下の通り。
     * 1. 有効なアクションのspeed(負数)の合計を算出。
     *    (このとき、加算する方向のspeedは無視される)
     * 2. Sqrt(1の結果) / TPB速度を算出して返す。
     * 
     * @return {Number} キャスト時間
     */
    Game_Battler.prototype.tpbRequiredCastTime = function() {
        const actions = this._actions.filter(action => action.isValid());
        const items = actions.map(action => action.item());
        const delay = items.reduce((r, item) => r + Math.max(0, -item.speed), 0);
        return delay / this.tpbSpeed();
    };
    /**
     * パラメータを得る。
     * 
     * Note: 装備品増加分には特性によるレートボーナスを適用外とするため、
     *       オーバーライドする。
     * 
     * @param {Number} paramId パラメータID
     * !!!overwrite!!! Game_Actor.param
     */
    Game_Actor.prototype.param = function(paramId) {
        let baseValue = this.paramBasePlus(paramId)
                *  this.paramRate(paramId) + this.paramEquip(paramId);
        const value = baseValue * this.paramBuffRate(paramId);
        const maxValue = this.paramMax(paramId);
        const minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    };

    /**
     * 基本パラメータ加算値を得る。
     * 
     * Note: 装備品増加分には特性によるレートボーナスを適用外とするため、
     *       オーバーライドする。
     * 
     * @param {Number} paramId パラメータID
     * @return {Number} 加算値
     * !!!overwrite!!! Game_Actor.paramPlus()
     */
    Game_Actor.prototype.paramPlus = function(paramId) {
        return Game_Battler.prototype.paramPlus.call(this, paramId);
    };

    /**
     * パラメータの最大値を得る。
     * 
     * @return {Number} パラメータ最大値。
     * !!!overwrite!!! Game_Actor.paramMax()
     */
    Game_Actor.prototype.paramMax = function(paramId) {
        return actorParamMax[paramId];
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    /**
     * パラメータの最大値を得る。
     * 
     * @return {Number} パラメータ最大値。
     * !!!overwrite!!! Game_Enemy.paramMax()
     */
    Game_Enemy.prototype.paramMax = function(paramId) {
        return enemyParamMax[paramId];
    };

    //------------------------------------------------------------------------------
    // Game_Action

    /**
     * このアクションをtargetに適用する。
     * 命中判定とダメージ算出、効果適用を行う。
     * 
     * @param {Game_BattlerBase} target 対象
     * !!!overwrite!!!
     */
    Game_Action.prototype.apply = function(target) {
        const result = target.result();
        this.subject().clearResult();
        result.clear();
        result.used = this.testApply(target);
        if (result.used) {
            this.testHit(target);
        } else {
            result.missed = false;
            result.evaded = true;
        }
        result.physical = this.isPhysical();
        result.drain = this.isDrain();
        if (result.isHit()) {
            if (this.item().damage.type > 0) {
                result.critical = Math.random() < this.itemCri(target);
                const value = this.makeDamageValue(target, result.critical);
                this.executeDamage(target, value);
            }
            for (const effect of this.item().effects) {
                this.applyItemEffect(target, effect);
            }
            this.applyItemUserEffect(target);
        }
        this.updateLastTarget(target);
    };

    /**
     * 命中できたかどうかを評価する。
     * 
     * @param {Game_Battler} target 対象
     * @return {Boolean} 命中できた場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.testHit
     */
    Game_Action.prototype.testHit = function(target) {
        const result = target.result();
        if (this.isCertainlyEvad(target)) {
            result.missed = false;
            result.evaded = true;
            result.critical = false;
        } else if (this.isCertainlyHit(target)) {
            result.missed = false;
            result.evaded = false;
            result.critical = false;
        } else if (this.testCritical(target)) {
            result.missed = false;
            result.evaded = false;
            result.critical = true;
        } else if (this.testMissed(target)) {
            result.missed = true;
            result.evaded = false;
            result.critical = false;
        } else if (this.testEvaded(target)) {
            result.missed = false;
            result.evaded = true;
            result.critical = false;
        } else {
            result.missed = false;
            result.evaded = false;
            result.critical = false;
        }
    };
    /**
     * 回復レートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {Number} 回復レート(0.0～、等倍は1.0)
     * !!!overwrite!!! Game_Action.itemRec()
     */
    Game_Action.prototype.itemRec = function(target) {
        if (this.isSkill() && this.isRecover()) {
            // スキルの場合には使用者のRECと平均化する。
            const subject = this.subject();
            return (subject.rec + target.rec) * 0.5;
        } else {
            // スキル以外の場合には対象のRECだけ使用する。
            return target.rec;
        }
    };
})();