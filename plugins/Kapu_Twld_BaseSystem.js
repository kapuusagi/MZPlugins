/*:ja
 * @target MZ 
 * @plugindesc TWLD向け改変
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * @base Kapu_Base_Tpb
 * @orderAfter Kapu_Base_Tpb
 * @base Kapu_ElementCore
 * @orderAfter Kapu_ElementCore
 * @orderAfter Kapu_Base_Hit
 * @base Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Base_DamageCalculation
 * @base Kapu_Base_ParamName
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param traitCode
 * @text パラメータ全体にかかるレート特性のコード
 * @type number
 * @default 1003
 * 
 * @param passiveSkillType
 * @text パッシブスキルタイプ
 * @desc パッシブスキルとして扱うスキルタイプ
 * @type number
 * @default 0
 * 
 * @param basicGuardRate
 * @text 基本防御軽減量
 * @desc 防御成立時に軽減するダメージ量(%)
 * @type number
 * @decimals 2
 * @min 0.00
 * @max 1.00
 * @default 0.50
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
 * @param colorHpDead
 * @text HP色(死亡時)
 * @desc HPの色(死亡時)
 * @type string
 * @default #FF3333
 * 
 * @param colorHpDying
 * @text HP色(瀕死時)
 * @desc HPの色(瀕死時)
 * @type string
 * @default #FF8080
 * 
 * @param colorHpFull
 * @text HP色(全快時)
 * @desc HPの色(全快時)
 * @type string
 * @default #FFFFA0
 * 
 * @param colorHpNormal
 * @text HP色(全快時以外)
 * @desc HPの色(全快時以外)
 * @type string
 * @default #FFFFFF
 * 
 * @param colorMpDead
 * @text MP色(死亡時)
 * @desc MPの色(死亡時)
 * @type string
 * @default #646464
 * 
 * @param colorMpFull
 * @text MP色(全快時)
 * @desc MPの色(全快時)
 * @type string
 * @default #C880FF
 * 
 * @param colorMpNormal
 * @text MP色
 * @desc MPの色
 * @type string
 * @default #FFFFFF
 * 
 * @param colorTpDead
 * @text TP色(死亡時)
 * @desc TPの色(死亡時)
 * @type string
 * @default #646464
 * 
 * @param colorTpFull
 * @text TP色(全快時)
 * @desc TPの色(全快時)
 * @type string
 * @default #80FF80
 * 
 * @param colorTpNormal
 * @text TP色
 * @desc TPの色
 * @type string
 * @default #FFFFFF
 * 
 * @param physicalElementIds
 * @text 物理属性ID
 * @desc 物理属性として扱う属性のID
 * @type number[]
 * @default [1,2,3]
 * 
 * @param magicalElementIds
 * @text 魔法属性ID
 * @desc 魔法属性として扱う属性のID
 * @type number[]
 * @default [4,5,6,7,8,9]
 * 
 * @param subElementDamageRate
 * @text 補助属性ダメージレート
 * @desc 主属性じゃない場合のダメージ計算に使用する補正係数。
 * @type number
 * @decimals 2
 * @default 0.50
 * 
 * @param defaultPhysicalElementId
 * @text デフォルト属性(物理)
 * @desc ダメージ計算時、属性指定がなかったとき、命中タイプ「物理」に適用する属性番号
 * @type number
 * @default 0
 * 
 * @param defaultMagicalElementId
 * @text デフォルト属性(魔法)
 * @desc ダメージ計算時、属性指定がなかったとき、命中タイプ「魔法」に適用する属性番号
 * @type number
 * @default 0
 * 
 * @param defaultOtherElementId
 * @text デフォルト属性(その他)
 * @desc ダメージ計算時、属性指定がなかったとき、命中タイプ「必中」に適用する属性番号
 * @type number
 * @default 0
 * 
 * @param textTraitParamAllUp
 * @text パラメータレート特性(増加)
 * @desc パラメータレート特性。%1にパラメータ名が入る。
 * @type string
 * @default %1上昇
 * 
 * @param textTraitParamAllDown
 * @text パラメータレート特性(減少) 
 * @desc パラメータレート特性。%1にパラメータ名が入る。
 * @type string
 * @default %1減少
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
 * 5. TP上昇条件の変更
 *    ベーシックシステムではアクションがヒットしたとき、
 *    ターゲット毎に加算されていた。
 *    TWLDではアクションを行った際に、無条件でスキル毎に設定した値を
 *    加算するように変更した。
 * 
 * 6. ダメージ計算の変更
 *    物理属性、魔法属性、その他属性のそれぞれに対して計算し、PDR,MDRを適用するように変更する。
 * 
 * 7. 戦闘中行動時、アイテム･スキル対象が無い場合には何もしないようにする。
 *    (単体対象の自動切り替えは有効。射程とか入ってきた場合用)
 * 
 * 8. TP周りの挙動を変更
 *     ・戦闘開始時のTPはゼロ。
 *      （他のプラグインにより変動したり、TP保留の場合にはそちらに従う。）
 *     ・非戦闘中はTPが増加しない。
 *     ・ダメージ計算時、TPが対象のTPに対して1高い毎に1%のボーナスが与えられます。
 *     ・アクション実行時、TPが対象のTPに対して1高い毎に 0.05%のボーナスが与えられます。
 *     ・アクション実行時、TPが対象のTPに対して1低い毎に 0.05%の減算ボーナスがかかります。
 *     ・アクション実行時、TPが対象のTPに対して1高い毎に、0.01%クリティカル発生率が上がります。
 * 
 * 9.パラメータの計算変更
 *   MaxHP/MaxMP/ATK/DEF/MAT/MDF/AGI/LUKの計算式
 *   ベーシックシステムでは
 *       {(クラス値)+(種増減分)+(装備品)} x (特性レート) x (バフ増減レート)
 *   となっていた。これを
 *       [{(パラメータベース値計算式) + (種増加分)}x (特性によるレート) + (装備品)] x (バフ増減レート)
 *   に変更する。
 * 
 * 10.パーティーアビリティの有効判定
 *   ベーシックシステムでは死亡メンバーが持っているアビリティも対象となっていた。
 *   TWLDでは死亡メンバーを除くように変更する。
 * 
 * ■ 使用時の注意
 * なし。
 * 
 * ■ プラグイン開発者向け
 * Game_Actor.param()をオーバーライドします。
 * Game_Actor.paramPlus()をオーバーライドします。
 * 装備品補正値、paramEquip()は Kapu_Base_Params にて定義しています。
 * 
 * パッシブスキルタイプとして
 * Game_BattlerBase.PASSIVE_SKILL_TYPE を定義します。
 * 
 * TWLD向けの便利メソッド追加
 *   Game_BattlerBase.hasPassiveSkill() : boolean
 *     1つ以上のパッシブスキルを持っているかを判定する。
 *
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具
 *   <rateMHP:rate>
 *   <rateMMP:rate>
 *   <rateATK:rate>
 *   <rateMAT:rate>
 *   <rateDEF:rate>
 *   <rateMDF:rate>
 *   <rateAGI:rate>
 *   <rateLUK:rate>
 *     装備品も含めて割合上昇させる特性を追加する。乗算で合成されるため、1.0が基準値。
 *   <rateMHP:rate%>
 *   <rateMMP:rate%>
 *   <rateATK:rate%>
 *   <rateMAT:rate%>
 *   <rateDEF:rate%>
 *   <rateMDF:rate%>
 *   <rateAGI:rate%>
 *   <rateLUK:rate%>
 *     装備品も含めて割合上昇させる特性を追加する。乗算で合成されるため、100が基準値。
 * 
 * ステート
 *   <displayMapOnly>
 *     マップでのみステートアイコンを表示する。
 *   <displayBattleOnly>
 *     戦闘中のみステートアイコンを表示する。
 * 
 * スキル・アイテム
 *   <ignoreElementRate>
 *     ダメージ計算時、属性レートは反映しない。
 *   <ignoreDamageRate>
 *     ダメージ計算時、ダメージレート(PDR/MDR他、プラグインによるダメージレート)は反映しない。
 *   <ignoreRecoveryRate>
 *     ダメージ計算時、リカバリーレートを反映しない。
 *   <ignoreCriticalRate>
 *     ダメージ計算時、クリティカル倍率を反映しない。
 *   <ignoreVariance>
 *     ダメージ計算時、ばらつきを反映しない。
 *   <ignoreGuard>
 *     ダメージ計算時、ガードを反映しない。
 *   <physicalDamageFormula:formula$>
 *     物理ダメージ計算式として、formula$を適用する。
 *     攻撃属性に物理属性が含まれる場合に使用される。
 *   <magicalDamageFormula:formula$>
 *     魔法ダメージ計算式として、formula$を適用する。
 *     攻撃属性に魔法属性が含まれる場合に使用される。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 スキルによる回復倍率を、使用者と対象のMENを参照するようにした。
 *               TP上昇タイミングをスキル行動終了後から使用時に変更した。
 * Version.0.1.0 追加した。
 */
(() => {
    const pluginName = "Kapu_Twld_BaseSystem";
    const parameters = PluginManager.parameters(pluginName);

    const actorParamMax = [];
    for (let i = 0; i < 8; i++) {
        actorParamMax[i] = Number(parameters["actorParamMax" + i]) || 9999;
    }
    const enemyParamMax = [];
    for (let i = 0; i < 8; i++) {
        enemyParamMax[i] = Number(parameters["enemyParamMax" + i]) || ((i === 0) ? 999999 : 9999);
    }

    Game_BattlerBase.TRAIT_PARAM_RATE_ALL = Number(parameters["traitCode"]) || 0;
    if (!Game_BattlerBase.TRAIT_PARAM_RATE_ALL) {
        console.error(pluginName + " TRAIT_PARAM_RATE_ALL is not valid.");
    }

    const defaultPhysicalElementId = Math.round(Number(parameters["defaultPhysicalElementId"]) || 0);
    const defaultMagicalElementId = Math.round(Number(parameters["defaultMagicalElementId"]) || 0);
    const defaultOtherElemntId = Math.round(Number(parameters["defaultOtherElemntId"]) || 0);

    const basicGuardRate = (Number(parameters["basicGuardRate"]) || 0).clamp(0, 1);

    const colorHpDead = parameters["colorHpDead"] || "#FF8000";
    const colorHpDying = parameters["colorHpDying"] || "#FF8040";
    const colorHpFull = parameters["colorHpFull"] || "#FFFFA0";
    const colorHpNormal = parameters["colorHpNormal"] || "#FFFFFF";
    const colorMpDead = parameters["colorMpDead"] || "#646464";
    const colorMpFull = parameters["colorMpFull"] || "#80C8FF";
    const colorMpNormal = parameters["colorMpNormal"] || "#FFFFFF";
    const colorTpDead = parameters["colorTpDead"] || "#646464";
    const colorTpFull = parameters["colorTpFull"] || "#80FF80";
    const colorTpNormal = parameters["colorTpNormal"] || "#FFFFFF";

    const textTraitParamAllUp = parameters["textTraitParamAllUp"] || "";
    const textTraitParamAllDown = parameters["textTraitParamAllDown"] || "";

    const _parseIds = function(str) {
        try {
            if (str) {
                const ids = [];
                const numbers = JSON.parse(str).map(token => Number(token) || 0);
                for (const n of numbers) {
                    if (!ids.includes(n)) {
                        ids.push(n);
                    }
                }
                return ids;
            } else {
                return [];
            }
        }
        catch (e) {
            console.error("parseIds() : " + e);
        }

    };

    const physicalElementIds = [];
    {
        const ids = _parseIds(parameters["physicalElementIds"]);
        for (const id of ids) {
            physicalElementIds.push(id);
        }
    }
    const magicalElementIds = [];
    {
        const ids = _parseIds(parameters["magicalElementIds"]);
        for (const id of ids) {
            if (!physicalElementIds.includes(id)) {
                magicalElementIds.push(id);
            }
        }
    }
    const subElementDamageRate = Number(parameters["subElementDamageRate"]) || 0.50;
    //------------------------------------------------------------------------------
    // DataManager
    if (Game_BattlerBase.TRAIT_PARAM_RATE_ALL) {
        /**
         * 割合を得る。
         * 
         * @param {string} str 文字列
         * @returns {number} 割合を得る。
         */
        const _getRate = function(str) {
            if (str.slice(-1) === "%") {
                return Number(str.slice(0, str.length - 1)) / 100.0;
            } else {
                return Number(str);
            }
        };
        /**
         * ノートタグを処理する。
         * @param {object} obj データ
         */
        const _processNoteTag = function(obj) {
            const noteTags = [ "rateMHP", "rateMMP", "rateATK", "rateMAT", "rateDEF", "rateMDF", "rateAGI", "rateLUK" ];
            for (let paramId = 0; paramId < noteTags.length; paramId++) {
                const noteTag = noteTags[paramId];
                if (obj.meta[noteTag] !== undefined) {
                    const rate = _getRate(obj.meta[noteTag]);
                    if (rate >= 0) {
                        obj.traits.push({
                            code:Game_BattlerBase.TRAIT_PARAM_RATE_ALL,
                            dataId:paramId,
                            value:rate
                        })
                    }
                }
            }
        };

        DataManager.addNotetagParserActors(_processNoteTag);
        DataManager.addNotetagParserClasses(_processNoteTag);
        DataManager.addNotetagParserWeapons(_processNoteTag);
        DataManager.addNotetagParserArmors(_processNoteTag);
        DataManager.addNotetagParserStates(_processNoteTag);
    }

    /**
     * 物理属性かどうかを得る。
     * 
     * @param {number} elementId 属性ID
     * @returns {boolean} 物理属性の場合にはtrue, それ以外はfalse.
     */
    DataManager.isPhysicalElement = function(elementId) {
        return physicalElementIds.includes(elementId);
    };

    /**
     * 魔法属性かどうかを得る。
     * 
     * @param {number} elementId 属性ID
     * @returns {boolean} 魔法属性の場合にはtrue, それ以外はfalse.
     */
    DataManager.isMagicalElement = function(elementId) {
        return magicalElementIds.includes(elementId);
    };
    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._traitConverters) {
        // パラメータ特性バフを乗算から加算に変更しているので修正する。
        TextManager._traitConverters[Game_BattlerBase.TRAIT_PARAM].value = TextManager.traitValueSum;
    }

    //------------------------------------------------------------------------------
    // ColorManager
    /**
     * HP数値描画色を得る。
     * 
     * @param {Game_Actor} actor アクター
     * @returns {string} 色
     */
    ColorManager.hpColor = function(actor) {
        if (!actor) {
            return colorHpNormal;
        } else if (actor.isDead()) {
            return colorHpDead;
        } else if (actor.isDying()) {
            return colorHpDying; // 瀕死時文字カラー
        } else if (actor.hp >= actor.mhp) {
            return colorHpFull;
        } else {
            return colorHpNormal;
        }
    };

    /**
     * MP数値描画色を得る。
     * 
     * @param {Game_Actor} actor アクター
     * @returns {string} 色
     */
    ColorManager.mpColor = function(actor) {
        if (!actor) {
            return colorMpNormal;
        } else if (actor.isDead()) {
            return colorMpDead;
        } else if (actor.mp >= actor.mmp) {
            return colorMpFull;
        } else {
            return colorMpNormal;
        }
    };

    /**
     * TP数値色を得る。
     * 
     * @param {Game_Actor} actor アクター
     * @return {string} TP色
     */
    ColorManager.tpColor = function(actor) {
        if (!actor) {
            return colorTpNormal;
        } else if (actor.isDead()) {
            return colorTpDead;
        } else if (actor.tp >= actor.maxTp()) {
            return colorTpFull;
        } else {
            return colorTpNormal;
        }
    };
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    Game_BattlerBase.PASSIVE_SKILL_TYPE = Number(parameters["passiveSkillType"]) || 0;

    /**
     * MaxHP/MaxMP/ATK/DEF/MATK/MDEFパラメータの増幅率を得る。
     * 
     * @returns {number} 増幅率
     * !!!overwrite!!! Game_BattlerBase.paramRate()
     *     基本パラメータの割合増加を加算合成に変更するため、オーバーライドする。
     */
     Game_BattlerBase.prototype.paramRate = function(paramId) {
        // 基本パラメータを乗算レートでやると、めっちゃ大きくなるのでやめる。
        const rate = this.traitsWithId(Game_BattlerBase.TRAIT_PARAM, paramId).reduce((r, trait) => {
            return r + (trait.value - 1);
        }, 1.0, this);
        return Math.max(0, rate);
    };

    /**
     * ステートのアイコンIDを得る。
     * 
     * @return {Array<Number>} ステートのアイコンID配列
     */
    Game_BattlerBase.prototype.stateIcons = function() {
        if ($gameParty.inBattle()) {
                return this.states()
                    .filter(state => !state.meta.displayMapOnly)
                    .map(state => state.iconIndex)
                    .filter(iconIndex => iconIndex > 0);
        } else {
            return this.states()
                .filter(state => state.meta.displayBattleOnly)
                .map(state => state.iconIndex)
                .filter(iconIndex => iconIndex > 0);
        }
    };
    //------------------------------------------------------------------------------
    // Game_Battler
    /**
     * TPを初期化する。
     * 既定の実装では、0～25の間の乱数値がセットされる。
     * 
     * !!!overwrite!!! Game_Battler.initTp
     *     初期TPを乱数でなく、ゼロとするためオーバーライドする。
     */
     Game_Battler.prototype.initTp = function() {
        this.clearTp();
    };

    const _Game_Battler_gailTp = Game_Battler.prototype.gainTp;

    /**
     * TPを上昇させる。
     * 
     * @param {number} value 上昇値
     */
    Game_Battler.prototype.gainTp = function(value) {
        if ($gameParty.inBattle()) {
            // 戦闘中のみ変動する。
            _Game_Battler_gailTp.call(this, value);
        }
    };

    const _Game_Battler_addState = Game_Battler.prototype.addState;
    /**
     * ステートを付与する。但しステート防止がある場合には付与されない。
     * 
     * @param {number} stateId ステートID
     */
    Game_Battler.prototype.addState = function(stateId) {
        _Game_Battler_addState.call(this, stateId);
        if (this.isDead()) {
            // DeadするとHP,MPはゼロになる。
            if (this.tp > 0) {
                this.clearTp();
            }
            if (this.mp > 0) {
                this.setMp(0);
            }
        }
    };

    /**
     * TPB計算のための元パラメータからTPB速度を計算する。
     * 
     * @param {number} value パラメータ値
     * @returns {number} TPB速度値
     * !!!overwrite!!! Game_Battler.paramToTpbSpeed()
     *     TPB計算のための元パラメータからTPB速度を計算する。
     */
    Game_Battler.prototype.paramToTpbSpeed = function(value) {
        return (10 + (value - 20) * 0.2).clamp(0, 15);
    };

    /**
     * アクションの発動に必要な時間を得る。
     * 
     * @param {number} delay ディレイ
     * @returns {number} 必要な時間
     * !!!overwrite!!! Game_Battler.calcCastTime()
     *     キャスト時間の計算を単純にするため、オーバーライドする。
     */
    Game_Battler.prototype.calcCastTime = function(delay) {
        return delay * 0.03;
        //return (delay > 0) ? (10 + (delay - 20) * 0.2) / this.tpbSpeed() : 0;
    };

    /**
     * TPB基準速度の計算に使用するパラメータ値を得る。
     * 
     * @returns {number} TPB基準速度の計算に使用するパラメータ。
     * !!!overwrite!!!! Game_Battler.tpbBaseSpeedParam()
     *     バフ適用外のパラメータを元に計算するため、オーバーライドする。
     */
    Game_Battler.prototype.tpbBaseSpeedParam = function() {
        return this.paramWithoutBuff(6);
    };
    /**
     * このGame_BattlerのTPB詠唱速度を得る。
     *
     * @returns {number} TPB詠唱速度
     * !!!overwrite!!! Game_Battler.tpbCastSpeed()
     *     魔法速度の計算だけ変更するためオーバーライドする。
     */
    Game_Battler.prototype.tpbCastSpeed = function() {
        const actions = this._actions.filter(action => action.isValid());
        const items = actions.map(action => action.item());
        if (items.some(item => DataManager.isSkill(item) && $dataSystem.magicSkills.includes(item.stypeId))) {
            // 魔法アクション時
            return this.tpbMagicCastSpeed();
        } else {
            return this.tpbOtherCastSpeed();
        }
    };

    /**
     * このGame_BattlerのTPB魔法詠唱速度を得る。
     * 
     * @returns {number} TPB魔法詠唱速度
     */
    Game_Battler.prototype.tpbMagicCastSpeed = function() {
        const paramValue = this.tpbMagicCastSpeedParam();
        return this.calcTpbSpeed(paramValue);
    };

    /**
     * このGame_BattlerのTPB詠唱速度を得る。
     * 
     * @returns {number} TPB詠唱速度
     */
    Game_Battler.prototype.tpbOtherCastSpeed = function() {
        const paramValue = this.tpbSpeedParam();
        return this.calcTpbSpeed(paramValue);
    };
    /**
     * TPB基準速度の計算に使用するパラメータ値を得る。
     * 
     * @returns {number} TPB基準速度の計算に使用するパラメータ。
     */
    Game_Battler.prototype.tpbMagicCastSpeedParam = function() {
        return this.agi;
    };
    /**
     * 行動によるTP上昇量を得る。
     * 
     * @param {object} item DataItem/DataSKill
     * @returns {number} TP上昇量
     */
    Game_Battler.prototype.actionTpValue = function(item) {
        return item.tpGain;
    };

    const _Game_Battler_useItem = Game_Battler.prototype.useItem;
    /**
     * スキルまたはアイテムを使用する。
     * 
     * @param {object} item DataItemまたはDataSkill
     */
    Game_Battler.prototype.useItem = function(item) {
        _Game_Battler_useItem.call(this, item);
        const value = Math.floor(this.actionTpValue(item) * this.tcr);
        this.gainSilentTp(value);
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    /**
     * パッシブスキルを持っているかどうかを判定する。
     * 
     * @returns {boolean} パッシブスキルを持っている場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.hasPassiveSkill = function() {
        return this.skills().some(function(skill) {
            return skill && (skill.stypeId == Game_BattlerBase.PASSIVE_SKILL_TYPE);
        });
    };

    /**
     * パラメータのバフ/デバフ適用前のベース値を得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} バフ/デバフ適用前のベース値
     * !!!overwrite!!! Game_BattlerBase.paramWithoutBuff()
     *     装備品増加分にはTraitによるレートボーナスを適用外とするため、オーバーライドする。
     */
    Game_Actor.prototype.paramWithoutBuff = function(paramId) {
        return (this.paramBasePlus(paramId) * this.paramRate(paramId) + this.paramEquip(paramId)) * this.paramRateAll(paramId);
    };

    if (Game_BattlerBase.TRAIT_PARAM_RATE_ALL) {
        TextManager.traitParamRateAll = function(dataId, value) {
            const fmt = (value >= 0) ? textTraitParamAllUp : textTraitParamAllDown;
            const paramName = this.param(dataId);
            return ((fmt && paramName) ? fmt.format(paramName) : "");
        };
        TextManager._traitConverters[Game_BattlerBase.TRAIT_PARAM_RATE_ALL] = {
            name: TextManager.traitParamRateAll,
            value: TextManager.traitValuePi,
            str: TextManager.traitValueStrRate,
            baseValue: 1
        };



        /**
         * パラメータレート2を得る。
         * 
         * @param {number} paramId パラメータ番号
         * @returns {number} 全体パラメータレート
         */
        Game_Actor.prototype.paramRateAll = function(paramId) {
            return this.traitsPi(Game_BattlerBase.TRAIT_PARAM_RATE_ALL, paramId);
        };
    } else {
        /**
         * パラメータレート2を得る。
         * 
         * @param {number} paramId パラメータ番号
         * @returns {number} 全体パラメータレート
         */
        // eslint-disable-next-line no-unused-vars
        Game_Actor.prototype.paramRateAll = function(paramId) {
            return 1;
        };
    }

    /**
     * 基本パラメータ加算値を得る。
     * 
     * Note: 装備品増加分には特性によるレートボーナスを適用外とするため、
     *       オーバーライドする。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} 加算値
     * !!!overwrite!!! Game_Actor.paramPlus()
     *     装備品増加分を増加レート特性から除外するため、オーバーライドする。
     */
    Game_Actor.prototype.paramPlus = function(paramId) {
        return Game_Battler.prototype.paramPlus.call(this, paramId);
    };

    /**
     * パラメータの最大値を得る。
     * 
     * @returns {number} パラメータ最大値。
     * !!!overwrite!!! Game_Actor.paramMax()
     *     パラメータ最大値を返すためにオーバーライドする。
     */
    Game_Actor.prototype.paramMax = function(paramId) {
        return actorParamMax[paramId];
    };

    //------------------------------------------------------------------------------
    // Game_Enemy
    /**
     * パラメータの最大値を得る。
     * 
     * @returns {number} パラメータ最大値。
     * !!!overwrite!!! Game_Enemy.paramMax()
     *     パラメータ最大値を返すためにオーバーライドする。
     */
    Game_Enemy.prototype.paramMax = function(paramId) {
        return enemyParamMax[paramId];
    };

    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_initialize = Game_Action.prototype.initialize;
    /**
     * Game_Actionを初期化する。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {boolean} forcing 強制実行
     */
    Game_Action.prototype.initialize = function(subject, forcing) {
        _Game_Action_initialize.call(this, subject, forcing);
        this._subjectTp = ((subject) ? subject.tp : 0) || 0;
    };


    const _Game_Action_prepare = Game_Action.prototype.prepare;
    /**
     * アクションを準備する。
     */
    Game_Action.prototype.prepare = function() {
        _Game_Action_prepare.call(this);
        // Note: TPはapply()毎に変動するため、
        //       実行(startAction)前の値を元に算出しておく。
        this._subjectTp = this.subject().tp;
    };

    /**
     * TPダメージレートを取得する。
     * 
     * @param {Game_Battler} ターゲット
     * @returns {number} TPダメージレート
     */
    Game_Action.prototype.tpDamageRate = function(target) {
        return 1 + Math.max(0, ((this._subjectTp - target.tp) * 0.01));
    };

    const _Game_Action_multiplyDamageRate = Game_Action.prototype.multiplyDamageRate;
    /**
     * ダメージ量の乗算ボーナスレートを得る。
     * 
     * @param {Game_Battler} target ターゲット。
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} 乗算ボーナスレート
     */
    Game_Action.prototype.multiplyDamageRate = function(target, critical) {
        const tpDamageRate = this.tpDamageRate(target);
        return _Game_Action_multiplyDamageRate.call(this, target, critical) * tpDamageRate;
    };

    const _Game_Action_itemHit = Game_Action.prototype.itemHit;
    /**
     * 命中率を得る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @returns {number} 命中率。
     */
    Game_Action.prototype.itemHit = function(target) {
        const tpHitRate = ((this._subjectTp - target.tp) * 0.005).clamp(0, 0.5);
        return _Game_Action_itemHit.call(this, target) + tpHitRate;
    };

    const _Game_Action_itemEva = Game_Action.prototype.itemEva;
    /**
     * 回避率を得る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @returns {number} 回避率。
     */
    Game_Action.prototype.itemEva = function(target) {
        const tpEvaRate = ((target.tp - this._subjectTp) * 0.005).clamp(0, 0.5);
        return _Game_Action_itemEva.call(this, target) + tpEvaRate;
    };


    const _Game_Action_itemCri = Game_Action.prototype.itemCri;
    /**
     * このアクションのクリティカル率を得る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @returns {number} クリティカル率(0.0～1.0）
     */
    Game_Action.prototype.itemCri = function(target) {
        const tpCriRate = ((this._subjectTp - target.tp) * 0.0025).clamp(0, 0.25);
        return _Game_Action_itemCri.call(this, target) + tpCriRate;
    };

    /**
     * このアクションをtargetに適用する。
     * 命中判定とダメージ算出、効果適用を行う。
     * 
     * @param {Game_BattlerBase} target 対象
     * !!!overwrite!!! Game_Action.apply()
     *     クリティカル判定時、命中するように変更したためオーバーライドする。
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
     * @returns {boolean} 命中できた場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_Action.testHit
     *     クリティカル判定時、命中するように変更したためオーバーライドする。
     */
    Game_Action.prototype.testHit = function(target) {
        const result = target.result();
        if (this.testCertainEvad(target)) {
            result.missed = false;
            result.evaded = true;
            result.critical = false;
        } else if (this.testCertainHit(target)) {
            result.missed = false;
            result.evaded = false;
            result.critical = this.testCritical(target);
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
     * ダメージ値を計算する。
     * 
     * @param {Game_BattlerBase} target 対象
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} ダメージ値
     * !!!overwrite!!! Game_Action.makeDamageValue
     *     PDR,MDRと属性レートの計算変更のため、オーバーライドする
     */
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        const subjectAddtionalTraits = this.additionalSubjectTraits(target);
        const targetAdditionalTraits = this.additionalTargetTraits(target, critical);
        this.subject().setTempUserTraits(subjectAddtionalTraits);
        target.setTempTargetTraits(targetAdditionalTraits);

        const item = this.item();

        let value = 0;
        if (this.isElementRateApplicable(target)) {
            value = this.makeDamageValueWithElements(target, critical);
        } else {
            value = this.makeDamageValueWithoutElements(target, critical);
        }
        if (this.isDamageRateApplicable(target)) {
            value = this.applyDamageRate(value, target, critical);
        }
        if (this.isRecoveryRateApplicable(target)) {
            value = this.applyRecoveryRate(value, target);
        }
        if (critical && this.isCriticalApplicable(target)) {
            value = this.applyCritical(value);
        }
        if (this.isVarianceApplicable(target)) {
            value = this.applyVariance(value, item.damage.variance);
        }
        if (this.isGuardApplicable(target)) {
            target.result().isGuard = target.isGuard();
            value = this.applyGuard(value, target);
        }
        value = Math.round(value);

        target.clearTempTargetTraits();
        this.subject().clearTempUserTraits();
        const maxDamage = this.maxDamage(target);
        return value.clamp(-maxDamage, maxDamage)
    };

    /**
     * 属性計算有効時の基本ダメージを計算する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {boolean} critical クリティカルかどうか
     * @returns {number} ダメージ
     */
    Game_Action.prototype.makeDamageValueWithElements = function(target, critical) {
        const elementIds = this.elementIds();
        if (elementIds.length === 0) {
            // 属性なし。
            if (this.isPhysical() && (defaultPhysicalElementId > 0)) {
                elementIds.push(defaultPhysicalElementId);
            } else if (this.isMagical() && (defaultMagicalElementId > 0)) {
                elementIds.push(defaultMagicalElementId);
            } else if (defaultOtherElemntId > 0) {
                elementIds.push(defaultOtherElemntId);
            }
        }
        const phyElementIds = elementIds.filter(id => DataManager.isPhysicalElement(id));
        const magElementIds = elementIds.filter(id => DataManager.isMagicalElement(id));
        const otherElementIds = elementIds.filter(id => !DataManager.isPhysicalElement(id) && !DataManager.isMagicalElement(id));

        const phyElementRate = this.elementsMaxRate(target, phyElementIds);
        const magElementRate = this.elementsMaxRate(target, magElementIds);
        const otherElementRate = this.elementsMaxRate(target, otherElementIds);

        const phyBaseDamageValue = (phyElementIds.length > 0) ? this.calcPhysicalDamageValue(target) : 0;
        const magBaseDamageValue = (magElementIds.length > 0) ? this.calcMagicalDamageValue(target) : 0;
        const otherBaseDamageValue = ((elementIds.length === 0) || (otherElementIds.length > 0)) ?  this.calcOtherDamageValue(target) : 0;

        let phyDamageValue = phyBaseDamageValue * phyElementRate;
        let magDamageValue = magBaseDamageValue * magElementRate;
        let otherDamageValue = otherBaseDamageValue * otherElementRate;
        if (this.isDamageRateApplicable(target)) {
            phyDamageValue = this.applyPhysicalDamageRate(phyDamageValue, target, critical);
            magDamageValue = this.applyMagicalDamageRate(magDamageValue, target, critical);
        }
        
        const pureDamageValue = phyDamageValue + magDamageValue + otherDamageValue;
        const value = phyDamageValue + magDamageValue + otherDamageValue;
        const result = target.result();
        result.elementRate = (pureDamageValue !== 0) ? (value / pureDamageValue) : 1;
        return value;
    };

    /**
     * 属性計算無効時の基本ダメージを計算する
     * 
     * @param {Game_Battler} target ターゲット
     * @param {boolean} critical クリティカルかどうか
     * @returns {number} ダメージ
     */
    Game_Action.prototype.makeDamageValueWithoutElements = function(target, critical) {
        let value = this.evalDamageFormula(target);
        const result = target.result();
        result.elementRate = 1;
        if (this.isDamageRateApplicable(target)) {
            if (this.isPhysical()) {
                value = this.applyPhysicalDamageRate(value, target, critical);
            } else if (this.isMagical()) {
                value = this.applyMagicalDamageRate(value, target, critical);
            }
        }
        return value;
    };

    /**
     * ガードの有無によるダメージ変動を適用する。
     * 
     * @param {number} damage ダメージ計算値
     * @param {Game_BattlerBase} target 適用対象
     * @return {number} ダメージ量が返る。
     * !!!overwrite!!! Game_Action.applyGuard(damage, target)
     *     ガード適用時のレート計算変更のため、オーバーライドする。
     */
    Game_Action.prototype.applyGuard = function(damage, target) {
        if ((damage > 0) && target.isGuard()) {
            // Guard 適用
            const damageCoef = (1 - basicGuardRate) / target.grd;
            return damage * damageCoef;
        } else {
            return damage;
        }
    };    

    /**
     * 属性レートを適用するかどうかを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     * !!!overwrite!!! Game_Action.isElementRateApplicable
     *     メタデータにより適用・不適用を設定できるようにするためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isElementRateApplicable = function(target) {
        const item = this.item();
        if (item.meta.ignoreElementRate) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * ダメージレートを適用するかどうかを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     * !!!overwrite!!! Game_Action.isDamageRateApplicable
     *     メタデータにより適用・不適用を設定できるようにするためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isDamageRateApplicable = function(target) {
        const item = this.item();
        if (item.meta.ignoreDamageRate) {
            return false;
        } else {
            return true;
        }
    };
    /**
     * リカバリーレートを適用するかどうかを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     * !!!overwrite!!! Game_Action.isRecoveryRateApplicable
     *     メタデータにより適用・不適用を設定できるようにするためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isRecoveryRateApplicable = function(target) {
        const item = this.item();
        if (item.meta.ignoreRecoveryRate) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * クリティカルを適用するかどうかを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     * !!!overwrite!!! Game_Action.isCriticalApplicable
     *     メタデータにより適用・不適用を設定できるようにするためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isCriticalApplicable = function(target) {
        const item = this.item();
        if (item.meta.ignoreCriticalRate) {
            return false;
        } else {
            return true;
        }
    };
    /**
     * ばらつきを適用するかどうかを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     * !!!overwrite!!! Game_Action.isVarianceApplicable
     *     メタデータにより適用・不適用を設定できるようにするためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isVarianceApplicable = function(target) {
        const item = this.item();
        if (item.meta.ignoreVariance) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * ガードを適用するかどうかを得る。
     * 
     * @param {Game_Battler} ターゲット
     * @return {boolean} 適用する場合にはtrue, 適用しない場合にはfalse.
     * !!!overwrite!!! Game_Action.isGuardApplicable
     *     メタデータにより適用・不適用を設定できるようにするためオーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.isGuardApplicable = function(target) {
        const item = this.item();
        if (item.meta.ignoreGuard) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * ベースとなるダメージ値を計算する。
     * 
     * @param {Game_Battler} target 対象
     */
    Game_Action.prototype.calcBaseDamageValue = function(target) {
        return this.evalDamageFormula(target);
    };

    /**
     * 乗算ボーナスを得る。
     * 
     * @param {number} value 基本ダメージ値
     * @param {Game_Battler} target ターゲット。
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} 乗算ボーナス適用後の値
     * !!!overwrite!!! Game_Action.applyDamageRate()
     *     PDR, MDRは物理属性分ダメージ、魔法属性分ダメージに対してかけるようにするため、オーバーライドする。
     */
    Game_Action.prototype.applyDamageRate = function(value, target, critical) {
        return value * this.multiplyDamageRate(target, critical);
    };    

    /**
     * 式を評価してダメージを計算する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {string} formula 計算式
     */
    Game_Action.prototype.evalDamageFormulaWithFormula = function(target, formula) {
        try {
            const item = this.item();
            const a = this.subject(); // eslint-disable-line no-unused-vars
            const b = target; // eslint-disable-line no-unused-vars
            const v = $gameVariables._data; // eslint-disable-line no-unused-vars
            const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
            const value = Math.max(eval(formula), 0) * sign;
            return isNaN(value) ? 0 : value;
        } catch (e) {
            return 0;
        }
    };

    /**
     * 物理属性ダメージを計算する。
     * 
     * @param {Game_Battler} target ターゲット
     * @returns {number} ダメージ値
     */
    Game_Action.prototype.calcPhysicalDamageValue = function(target) {
        const item = this.item();
        if (item.meta.physicalDamageFormula) {
            return this.evalDamageFormulaWithFormula(target, item.meta.physicalDamageFormula);
        } else if (this.isPhysical()) {
            return this.evalDamageFormula(target);
        } else {
            // 補助攻撃属性の計算式が与えられていない。
            if (this.isMagical()) {
                return this.calcMagicalDamageValue(target) * subElementDamageRate;
            } else {
                // 10%とする。
                return this.calcOtherDamageValue(target) * subElementDamageRate;
            }
        }
    };



    /**
     * 魔法属性ダメージを計算する。
     * 
     * @param {Game_Battler} target ターゲット
     * @returns {number} ダメージ値
     */
    Game_Action.prototype.calcMagicalDamageValue = function(target) {
        const item = this.item();
        if (item.meta.magicalDamageFormula) {
            return this.evalDamageFormulaWithFormula(target, item.meta.magicalDamageFormula);
        } else if (this.isMagical()) {
            return this.evalDamageFormula(target);
        } else {
            // 補助攻撃属性の計算式が与えられていない。 -> 他属性での計算式を適用し、係数をかける
            if (this.isPhysical()) {
                return this.calcPhysicalDamageValue(target) * subElementDamageRate;
            } else {
                return this.calcOtherDamageValue(target) * subElementDamageRate;
            }
        }
    };

    /**
     * その他の属性ダメージを計算する。
     * 
     * @param {Game_Battler} target ターゲット
     * @returns {number} ダメージ値
     */
    Game_Action.prototype.calcOtherDamageValue = function(target) {
        const item = this.item();
        if (item.meta.otherDamageFormula) {
            return this.evalDamageFormulaWithFormula(target, item.meta.otherDamageFormula);
        } else if (!this.isPhysical() && !this.isMagical()) {
            return this.evalDamageFormula(target);
        } else {
            // 補助攻撃属性の計算式が与えられていない。 -> 他属性での計算式を適用し、係数をかける
            if (this.isPhysical()) {
                return this.calcPhysicalDamageValue(target) * subElementDamageRate;
            } else if (this.isMagical()) {
                return this.calcMagicalDamageValue(target) * subElementDamageRate;
            }
        }
    };


    /**
     * 回復レートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @returns {number} 回復レート(0.0～、等倍は1.0)
     * !!!overwrite!!! Game_Action.itemRec()
     *     回復レートにスキル使用者のレートと平均を取るため、オーバーライドする。
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
    /**
     * HPダメージを適用する。
     * 
     * @param {Game_Battler} target 対象
     * @param {number} value ダメージ値
     * !!!overwrite!!! Game_Action.executeDamage()
     *     ダメージ0以上でonDamageを呼び出すようにするため、オーバーライドする。
     */
    Game_Action.prototype.executeHpDamage = function(target, value) {
        if (this.isDrain()) {
            value = Math.min(target.hp, value);
        }
        this.makeSuccess(target);
        target.gainHp(-value);
        if (value >= 0) {
            target.onDamage(value);
        }
        this.gainDrainedHp(value);
    };
    /**
     * ユーザーエフェクトを適用する。
     * 既定ではTPの加算処理を行う。
     * 
     * @param {Game_Battler} 対象
     * !!!overwrite!!!
     *     TP加算は効果を及ぼした数じゃなくて、行動1回につき、1回加算するように変更するため、
     *     オーバーライドする。
     */
    Game_Action.prototype.applyItemUserEffect = function(/*target*/) {
        // const value = Math.floor(this.item().tpGain * this.subject().tcr);
        // this.subject().gainSilentTp(value);
    };


    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * ablitiyIdで指定されるdataIdのパーティーアビリティを持っているかどうかを判定する。
     * 
     * Note: ベーシックシステムではアクターがDead状態でもスキルがあるかどうかを判定していた。
     * 
     * @param {number} abilityId アビリティID
     * !!!overwrite!!! Game_Party.partyAbility()
     *     パーティーアビリティ有無は生存メンバーだけ対象にするため、オーバーライドする。
     */
    Game_Party.prototype.partyAbility = function(abilityId) {
        return this.battleMembers().some(function(actor) {
            return !actor.isDead() && actor.partyAbility(abilityId);
        });
    };

})();
