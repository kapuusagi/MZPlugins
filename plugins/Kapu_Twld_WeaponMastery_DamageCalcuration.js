/*:ja
 * @target MZ 
 * @plugindesc ウェポンマスタリの攻撃力補正プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Twld
 * @orderAfter Kapu_Base_Twld
 * @base Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Base_DamageCalculation
 * @base Kapu_Base_Hit
 * @orderAfter Kapu_Base_Hit
 * @base Kapu_Twld_WeaponMastery
 * @orderAfter Kapu_Twld_WeaponMastery
 * @orderAfter Kapu_Trait_CriticalDamageRate
 * 
 * @param correctRateTable
 * @text 補正値テーブル
 * @desc 補正値のテーブル。重複したウェポンマスタリタイプをテーブルにのせた場合、後に載せたものが優先される。
 * @type struct<CollectEntry>[]
 * @default []
 * 
 * 
 * @help 
 * ウェポンマスタリレベルをダメージ倍率に適用するプラグイン。
 * 補正はダメージ計算時のみ適用され、ステータス画面には反映されない。
 *
 *  
 * HITはベーシックシステムで加算合計である。
 * つまり、hitCorrectRate=0.0025, WMLevel100とした場合、
 * 命中判定でのHITが25%上昇する。
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
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/*~struct~CollectEntry:
 *
 * @param wmTypeId
 * @text ウェポンマスタリタイプ
 * @desc ウェポンマスタリタイプ番号を指定する。重複した番号をテーブルにのせた場合、後に載せたものが優先される。
 *
 * @param atkRate
 * @text 攻撃力補正値
 * @desc ウェポンマスタリレベル1あたりのATK補正値。0で補正無し。0.01とすると1レベル毎に1％上がる。
 * @type number
 * @decimals 2
 * @default 0
 * 
 * @param matRate
 * @text 魔法攻撃力補正値
 * @desc ウェポンマスタリレベル1あたりのMAT補正値。0で補正無し。0.01とすると1レベル毎に1％上がる。
 * @type number
 * @decimals 2
 * @default 0
 * 
 * @param hitRate
 * @text 命中補正値
 * @desc ウェポンマスタリレベル1あたりのHIT補正値。0で補正無し。0.01とすると1レベル毎に1％上がる。
 * @type number
 * @decimals 3
 * @default 0
 * 
 * @param criRate
 * @text クリティカル補正値
 * @desc ウェポンマスタリレベル1あたりのATK補正値（割合）。0で補正無し。0.01とすると1レベル毎に1％上がる。
 * @type number
 * @decimals 2
 * @default 0
 * 
 * @param cdrRate
 * @text クリティカルダメージレート補正値
 * @desc ウェポンマスタリレベル1あたりのATK補正値（割合）。0で補正無し。0.01とすると1レベル毎に1％上がる。
 * @type number
 * @decimals 2
 * @default 0
 * 
 */


(() => {
    const pluginName = "Kapu_Twld_WeaponMastery_DamageCalculation";
    const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    if (!Game_BattlerBase.TRAIT_PARAM_RATE_ALL) {
        console.error("TRAIT_PARAM_RATE_ALL not available.")
    }

    const wmStatusCorrectionValues = [];
    try {
        const array = JSON.parse(parameters["correctRateTable"]).map(line => JSON.parse(line));
        for (const entry of array) {
            entry.wmTypeId = Number(entry.wmTypeId) || 0;
            entry.atkRate = Number(entry.AtkRate) || 0;
            entry.matRate = Number(entry.matRate) || 0;
            entry.hitRate = Number(entry.hitRate) || 0;
            entry.criRate = Number(entry.criRate) || 0;
            entry.cdrRate = Number(entry.cdrRate) || 0;
            wmStatusCorrectionValues[entry.wmTypeId] = entry;
        }
    }
    catch (ex) {
        console.error(ex);
    }

    //------------------------------------------------------------------------------
    // Game_Action
    const _Game_Action_additionalSubjectTraits = Game_Action.prototype.additionalSubjectTraits;
    /**
     * ダメージ計算時、使用者に追加で付与する特性を取得する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Array<Trait>} trait 特性オブジェクト配列
     */
    Game_Action.prototype.additionalSubjectTraits = function(target) {
        const traits = _Game_Action_additionalSubjectTraits.call(this, target);
        const item = this.item();
        if (DataManager.isSkill(item)) {
            const wmTypeId = this.itemWmTypeId(item);
            const subject = this.subject();
            const wmLevel = subject.wmLevel(wmTypeId);
            const wmCorrectValues = wmStatusCorrectionValues[wmTypeId];
            if (wmCorrectValues & (wmLevel > 0)) {
                if (wmCorrectValues.atkRate > 0) {
                    traits.push({
                        code: Game_BattlerBase.TRAIT_PARAM_RATE_ALL,
                        dataId: 2, // atk
                        value: (1 + wmLevel * wmCorrectValues.atkRate)
                    });
                }
                if (wmCorrectValues.matRate > 0) {
                    traits.push({
                        code: Game_BattlerBase.TRAIT_PARAM_RATE_ALL,
                        dataId: 4, // mat
                        value: (1 + wmLevel * wmCorrectValues.matRate)
                    });
                }
                if (wmCorrectValues.hitRate > 0) {
                    traits.push({
                        code: Game_BattlerBase.TRAIT_XPARAM,
                        dataId: 0, // hit
                        value: wmLevel * wmCorrectValues.hi
                    });
                }
                if (wmCorrectValues.criRate > 0) {
                    traits.push({
                        code: Game_BattlerBase.TRAIT_XPARAM,
                        dataId: 2, // cri
                        value: wmLevel * wmCorrectValues.hitRate
                    });
                }
                if ((wmCorrectValues.cdrRate > 0) && Game_BattlerBase.TRAIT_XPARAM_DID_CDR) {
                    traits.push({
                        code: Game_BattlerBase.TRAIT_XPARAM,
                        dataId: Game_BattlerBase.TRAIT_XPARAM_DID_CDR,
                        value: wmLevel * wmCorrectValues.cdrRate
                    });
                }
            }
        }

        return traits;
    };

    const _Game_Action_itemCorrectSuccessRate = Game_Action.prototype.itemCorrectSuccessRate;
    /**
     * スキル/アイテム使用時の成功率補正値を得る。
     * 
     * @param {Game_Battler} target 対象
     * @returns {number} 補正値
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.itemCorrectSuccessRate = function(target) {
        let rate = _Game_Action_itemCorrectSuccessRate.call(this, target);
        if (DataManager.isSkill(item)) {
            const wmTypeId = this.itemWmTypeId(item);
            const subject = this.subject();
            const wmLevel = subject.wmLevel(wmTypeId);
            const wmCorrectValues = wmStatusCorrectionValues[wmTypeId];
            if (wmCorrectValues & (wmLevel > 0)) {
                rate += (wmLevel * wmCorrectValues.hitRate);
            }
        }

        return rate;
    };
})();