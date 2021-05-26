/*:ja
 * @target MZ 
 * @plugindesc キャストタイムに対する特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Tpb
 * @orderAfter Kapu_Base_Tpb
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param traitXParamDid
 * @text キャストタイム倍率-特性ID
 * @desc キャストタイムの特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 202
 * @type number
 * @max 999
 * @min 10
 * 
 * @param traitXParamDidMagical
 * @text 魔法キャストタイム倍率-特性ID
 * @desc 魔法キャストタイムの特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 209
 * @type number
 * @max 999
 * @min 10
 * 
 * @param textTraitCastTime
 * @text キャストタイム特性
 * @desc キャストタイム特性
 * @type string
 * @default キャストタイム
 * 
 * @param textTraitMagicCastTime
 * @text 魔法キャストタイム特性
 * @desc 魔法キャストタイム特性
 * @type string
 * @default 魔法キャストタイム
 * 
 * @help 
 * キャストタイムの特性を追加します。
 * 以下のように作用します。
 * 非TPB
 *    速度補正が負数の場合、本特性の割合が乗算されます。
 *    speed=-100, castTimeRate=2.0だと、発動までの速度補正が-200になります。
 *    速度補正が正数（加速）の場合、本特性は無効です。
 * TPB
 *    速度補正が負数の場合、本特性の割合が乗算されます。
 *    speed=-100, castTimeRate=2.0だと、発動までの速度補正が-200になります。
 *    速度補正が正数（加速）の場合、本特性は無効です。
 *    
 * 
 * Trait XPARAMを使用し、
 * Game_BattlerBase.TRAIT_XPARAM_DID_CASTTIME_RATE を追加します。
 * 値はプラグインパラメータで指定したものになります。
 * 
 * 複数の特性を持つ場合、加算合計になります。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具/エネミー
 *   <castTimeRate:rate>
 *     rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *           詠唱時間を短くするには負数を指定する。
 *   <castTimeRate:rateStr%>
 *     rateStr: 倍率の値。100で100%増加。0.3で30%増加。
 *           詠唱時間を短くするには負数を指定する。
 *   <magicCastTimeRate:rate>
 *     rate: 倍率の値。1.0で100％増加。0.3で30%増加。
 *           詠唱時間を短くするには負数を指定する。
 *   <magicCastTimeRate:rateStr%>
 *     rateStr: 倍率の値。100で100%増加。0.3で30%増加。
 *           詠唱時間を短くするには負数を指定する。
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.3.0 Kapu_Base_ParamNameに対応
 * Version.0.2.0 魔法キャストタイムレートと、
 *               魔法以外のキャストタイムレートを
 *               設定できるように変更した。
 * Version.0.1.2 TRAIT_XPARAM_DID_CASTTIME_RATE未指定時は
 *               ログに出力して動作しないように変更した。
 * Version.0.1.1 IDのデフォルト値を変更した。
 *               プラグインコメントにorderAfterを追加した。
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_Trait_CastTime";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_XPARAM_DID_CASTTIME_RATE = Number(parameters["traitXParamDid"]) || 0;
    Game_BattlerBase.TRAIT_XPARAM_DID_MAGIC_CASTTIME_RATE = Number(parameters["traitXParamDidMagical"]) || 0;
    if (!Game_BattlerBase.TRAIT_XPARAM_DID_CASTTIME_RATE) {
        console.log(pluginName + ":TRAIT_XPARAM_DID_CASTTIME_RATE is not valid.");
    }
    if (!Game_BattlerBase.TRAIT_XPARAM_DID_MAGIC_CASTTIME_RATE) {
        console.log(pluginName + ":TRAIT_XPARAM_DID_MAGIC_CASTTIME_RATE is not valid.");
    }

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * 文字列を解析してレートを得る。
     * 
     * @param {String} valueStr 文字列
     * @returns {number} 値
     */
    const _getRate = function(valueStr) {
        if (valueStr.slice(-1) === "%") {
            return Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            return Number(valueStr);
        }
    };

    /**
     * itemの特性にvalueStrのキャストタイム倍率を加減する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        if (Game_BattlerBase.TRAIT_XPARAM_DID_CASTTIME_RATE && obj.meta.castTimeRate) {
            const speed = _getRate(obj.meta.castTimeRate);
            obj.traits.push({ 
                code:Game_BattlerBase.TRAIT_XPARAM, 
                dataId:Game_BattlerBase.TRAIT_XPARAM_DID_CASTTIME_RATE, 
                value:speed
            });
        }
        if (Game_BattlerBase.TRAIT_XPARAM_DID_MAGIC_CASTTIME_RATE && obj.meta.magicCastTimeRate) {
            const speed = _getRate(obj.meta.magicCastTimeRate);
            obj.traits.push({ 
                code:Game_BattlerBase.TRAIT_XPARAM, 
                dataId:Game_BattlerBase.TRAIT_XPARAM_DID_MAGIC_CASTTIME_RATE, 
                value:speed
            });
        }
    };

    DataManager.addNotetagParserActors(_processNotetag);
    DataManager.addNotetagParserClasses(_processNotetag);
    DataManager.addNotetagParserWeapons(_processNotetag);
    DataManager.addNotetagParserArmors(_processNotetag);
    DataManager.addNotetagParserStates(_processNotetag);
    DataManager.addNotetagParserEnemies(_processNotetag);

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    if (Game_BattlerBase.TRAIT_XPARAM_DID_CASTTIME_RATE) {
        if (TextManager._xparam) {
            TextManager._xparam[Game_BattlerBase.TRAIT_XPARAM_DID_CASTTIME_RATE] = parameters["textTraitCastTime"] || "";
        }
        /**
         * キャストタイム時間レートを得る。
         * 
         * @returns {number} キャストタイム時間レート
         */
        Game_BattlerBase.prototype.castTimeRate = function() {
            return Math.max(0, 1.0 + this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_CASTTIME_RATE));
        };
    } else {
        /**
         * キャストタイム時間レートを得る。
         * 
         * @returns {number} キャストタイム時間レート
         */
        Game_BattlerBase.prototype.castTimeRate = function() {
            return 1;
        };
    }

    if (Game_BattlerBase.TRAIT_XPARAM_DID_MAGIC_CASTTIME_RATE) {
        if (TextManager._xparam) {
            TextManager._xparam[Game_BattlerBase.TRAIT_XPARAM_DID_MAGIC_CASTTIME_RATE] = parameters["textTraitMagicCastTime"] || "";
        }
        /**
         * 魔法キャストタイム時間レートを得る。
         * 
         * @returns {number} 魔法キャストタイム時間レート
         */
        Game_BattlerBase.prototype.magicCastTimeRate = function() {
            return Math.max(0, 1.0 + this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_MAGIC_CASTTIME_RATE));
        };
    } else {
        /**
         * 魔法キャストタイム時間レートを得る。
         * 
         * @returns {number} 魔法キャストタイム時間レート
         */
        Game_BattlerBase.prototype.magicCastTimeRate = function() {
            return 1;
        }
    }

    const _Game_BattlerBase_tpbSkillCastTime = Game_BattlerBase.prototype.tpbSkillCastTime;
    /**
     * スキルのキャスト時間を得る。
     * 
     * @param {object} item スキル/アイテム
     * @returns {number} キャスト時間
     */
    Game_BattlerBase.prototype.tpbSkillCastTime = function(item) {
        const castTime = _Game_BattlerBase_tpbSkillCastTime.call(this, item);
        if ($dataSystem.magicSkills.includes(item.stypeId)) {
            // 魔法スキルかどうか
            return castTime * this.magicCastTimeRate();
        } else {
            // その他
            return castTime * this.castTimeRate();
        }
    };

    const _Game_Action_speed = Game_Action.prototype.speed;

    /**
     * このアクションの速度を得る。
     * 
     * @returns {number} アクションの速度
     */
    Game_Action.prototype.speed = function() {
        let speed = _Game_Action_speed.call(this);
        if (this.item()) {
            const itemSpeed = this.item().speed;
            if (itemSpeed < 0) {
                // 計算式がわかりにくいが、_Game_Action_speedをコールした時点で、
                // item().speed分だけ減算されている。
                // そのため、1.0に対して加算される量だけ更に引くようにする。
                // 例）補正なし -> diff_rate = 0 となり、speedは変化しない。
                // 例）即時実行(-1.0以下) -> diff_rate = -1.0となり、speed += itemSpeed * -1.0
                //                            (itemSpeedは負数なので、ちょうどabs(itemSpeed)分加算される）
                // 例）遅延1.5 -> diff_rate = 1.5となり、speed += itemSpeed * 1.5
                //                            (itemSpeedは負数なので、ちょうどabs(itemSpeed)*1.5分減算される）
                const subject = this.subject();
                const diff_rate = Math.max(-1.0, subject.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_CASTTIME_RATE));
                speed += itemSpeed * diff_rate;
            }
        }
        return speed;
    };
})();
