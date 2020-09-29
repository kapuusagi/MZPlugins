/*:ja
 * @target MZ 
 * @plugindesc 防御貫通特性プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_DamageCore
 * @orderAfter kapu_DamageCore
 *
 * @param TraitXParamDidDEFPR
 * @text DEFPR特性DID
 * @desc DEFPR特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 204
 * @type number
 * @max 999
 * @min 10
 * 
 * @param TraitXParamDidPDRPR
 * @text PDRPR特性DID
 * @desc PDRPR特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 205
 * @type number
 * @max 999
 * @min 10
 * 
 * @param TraitXParamDidMDFPR
 * @text MDFPR特性DID
 * @desc MDFPR特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 206
 * @type number
 * @max 999
 * @min 10
 * 
 * @param TraitXParamDidMDRPR
 * @text MDRPR特性DID
 * @desc MDRPR特性として割り当てるID番号。(10以上で他のプラグインとぶつからないやつ)
 * @default 207
 * @type number
 * @max 999
 * @min 10
 * 
 * 
 * @help 
 * 防御貫通特性を追加するプラグイン。
 * 装備品などの貫通値は加算合計になる。
 * 
 * 防御貫通が高ければ、メ○ルスライムも一撃だ！みたいな武器を用意する場合に使用する。
 * エネミーをバターのように切り裂くとかね。
 * 
 * ■ 使用時の注意
 * 他のPDR/MDRに作用するプラグインとの順番によっては、正しく作用しません。
 * 
 * ■ プラグイン開発者向け
 * Trait XPARAMを使用し、以下の定義を追加します。
 * Game_BattlerBase.TRAIT_XPARAM_DID_DEFPR
 * Game_BattlerBase.TRAIT_XPARAM_DID_MDFPR
 * Game_BattlerBase.TRAIT_XPARAM_DID_PDRPR
 * Game_BattlerBase.TRAIT_XPARAM_DID_MDRPR
 * 値はプラグインパラメータで指定したものになります。
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
 *     <penDEF:rate>
 *        rate: DEF減衰倍率の値。1.0で100％増加。0.3で30%増加。
 *     <penDEF:rateStr%>
 *        rateStr: DEF減衰倍率の値。100で100%増加。
 * 
 *     <penPDR:rate>
 *        rate: PDR減衰倍率の値。1.0で100％増加。0.3で30%増加。
 *     <penPDR:rateStr%>
 *        rateStr: PDR減衰倍率の値。100で100%増加。
 * 
 *     <penMDF:rate>
 *        rate: MDF減衰倍率の値。1.0で100％増加。0.3で30%増加。
 *     <penMDF:rateStr%>
 *        rateStr: MDF減衰倍率の値。100で100%増加。
 *
 *     <penMPR:rate>
 *        rate: MDF減衰倍率の値。1.0で100％増加。0.3で30%増加。
 *     <penMPR:rateStr%>
 *        rateStr: MDF減衰倍率の値。100で100%増加。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 TWLD_Coreから移植。動作未確認。
 */
(() => {
    const pluginName = "Kapu_Trait_Penetrate";
    const parameters = PluginManager.parameters(pluginName);
    Game_BattlerBase.TRAIT_XPARAM_DID_DEFPR = Number(parameters['TraitXParamDidDEFPR']) || 0;
    Game_BattlerBase.TRAIT_XPARAM_DID_MDFPR = Number(parameters['TraitXParamDidPDRPR']) || 0;
    Game_BattlerBase.TRAIT_XPARAM_DID_PDRPR = Number(parameters['TraitXParamDidMDFPR']) || 0;
    Game_BattlerBase.TRAIT_XPARAM_DID_MDRPR = Number(parameters['TraitXParamDidMDRPR']) || 0;
   
    //------------------------------------------------------------------------------
    // DataManager
    const _addRateTrait = function(traitDid, valueStr) {
        let rate;
        if (valueStr.slice(-1) === "%") {
            rate = Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            rate = Number(valueStr);
        }
        obj.traits.push({ 
            code:Game_BattlerBase.TRAIT_XPARAM, 
            dataId:traitDid, 
            value:rate
        });
    };

    /**
     * Penetrate ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processPenetrateRateNoteTag = function(obj) {
        if (!obj.meta.criticalDamageRate) {
            return;
        }
        if (obj.meta.penDEF) {
            _addRateTrait(Game_BattlerBase.TRAIT_XPARAM_DID_DEFPR, obj.meta.penDEF);
        }
        if (obj.meta.penPDR) {
            _addRateTrait(Game_BattlerBase.TRAIT_XPARAM_DID_PDRPR, obj.meta.penPDR);
        }
        if (obj.meta.penMDF) {
            _addRateTrait(Game_BattlerBase.TRAIT_XPARAM_DID_MDFPR, obj.meta.penMDF);
        }
        if (obj.meta.penMDR) {
            _addRateTrait(Game_BattlerBase.TRAIT_XPARAM_DID_MDRPR, obj.meta.penMDR);
        }

    };

    DataManager.addNotetagParserActors(_processPenetrateRateNoteTag);
    DataManager.addNotetagParserClasses(_processPenetrateRateNoteTag);
    DataManager.addNotetagParserWeapons(_processPenetrateRateNoteTag);
    DataManager.addNotetagParserArmors(_processPenetrateRateNoteTag);
    DataManager.addNotetagParserStates(_processPenetrateRateNoteTag);
    DataManager.addNotetagParserEnemies(_processPenetrateRateNoteTag);
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * DEF貫通率を得る。
     * 
     * @return {Number} DEF貫通率
     */
    Game_BattlerBase.prototype.penetrateDEF = function() {
        return this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_DEFPR);
    };

    /**
     * PDR貫通率を得る。
     * 
     * @return {Number} DEF貫通率
     */
    Game_BattlerBase.prototype.penetratePDR = function() {
        return this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_PDRPR);
    };


    /**
     * MDF貫通率を得る。
     * 
     * @return {Number} MDF貫通率
     */
    Game_BattlerBase.prototype.penetrateMDF = function() {
        return this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_MDFPR);
    };

    /**
     * MDR貫通率を得る。
     * 
     * @return {Number} MDR貫通率
     */
    Game_BattlerBase.prototype.penetrateMDR = function() {
        return this.xparam(Game_BattlerBase.TRAIT_XPARAM_DID_MDFPR);
    }


    //------------------------------------------------------------------------------
    // Game_Action

    const _Game_Action_additionalTargetTraits = Game_Action.prototype.additionalTargetTraits;
    /**
     * ダメージ計算時、対象に追加で付与する特性を取得する。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Boolean} critical クリティカルかどうか
     * @param {Array<Trait>} trait 特性オブジェクト配列
     */
    Game_Action.prototype.additionalTargetTraits = function(target, critical) {
        const traits = _Game_Action_additionalTargetTraits.call(this, target, critical);
        const subject = this.subject();
        const pendef = subject.penetrateDEF().clamp(0, 1);
        const penmdf = subject.penetrateMDF().clamp(0, 1);
        if (pendef) {
            traits.push({
                code : Game_BattlerBase.TRAIT_PARAM,
                dataId : 3, // 3 is DEF.
                value : 1.0 - pendef, // 0 indicates 0 percent.
            });
        }
        if (penmdf) {
            traits.push({
                code : Game_BattlerBase.TRAIT_PARAM,
                dataId : 4, // 4 is MDEF.
                value : 1.0 - penmdf, // 0 indicates 0 percent.
            });
        }
    };

    const _Game_Action_itemPdr = Game_Action.prototype.itemPdr;
    /**
     * 物理ダメージレートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Booelan} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} 物理ダメージレート
     */
    Game_Action.prototype.itemPdr = function(target, critical) {
        let pdr = _Game_Action_itemPdr(target, critical);
        if (pdr < 1) {
            // 物理貫通率だけ加算して、最大で1.0倍まで戻せる。
            return (1, pdr + this.subject().penetratePDR()).clamp(0, 1);
        } else {
            return pdr;
        }
    };

    const _Game_Action_itemMdr = Game_Action.prototype.itemMdr;
    /**
     * 魔法ダメージレートを得る。
     * 
     * @param {Game_Battler} target ターゲット
     * @param {Booelan} critical クリティカルの場合にはtrue, それ以外はfalse
     * @return {Number} 魔法ダメージレート。(0.0～、等倍は1.0)
     */
    Game_Action.prototype.itemMdr = function(target, critical) {
        let mdr = _Game_Action_itemMdr(target, critical);
        if (mdr < 1) {
            // 魔法貫通率だけ加算して、最大で1.0倍まで戻せる。
            return (mdr + this.subject().penetrateMDR()).clamp(0, 1);
        } else {
            return mdr;
        }
    };    
})();