/*:ja
 * @target MZ 
 * @plugindesc 属性吸収の特性を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * 
 * @param TraitCode
 * @text 特性コード
 * @desc 特性として割り当てるID番号。(65以上で他のプラグインとぶつからないやつ)
 * @default 65
 * @type number
 * @max 999
 * @min 65
 * 
 * @help 
 * 属性吸収の特性を追加します。
 * 複数の吸収特性を持っている場合、最も高い吸収率が採用されます。
 * (クラス特性で属性1を20%吸収、装備で属性1を50%吸収の場合、
 *  属性1のスキルを受けたとき、
 *  ダメージ計算結果の50%の値を吸収値とします。)
 * 
 * ■ 注意
 * 以下のメソッドがオーバーライドされるため、競合に注意が必要です。
 * Game_Action.prototype.elementsMaxRate
 * 
 * ■ プラグイン開発者向け
 * 新規Trait を使用し、
 * Game_BattlerBase.TRAIT_ELEMENT_ABSORB を追加します。
 * 値はプラグインパラメータで指定したものになります。
 * 吸収率を、単純な特性の加算結果/乗算結果として得たい場合には
 * Game_BattlerBase.prototype.elementRate
 * を書き換えればいけます。
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
 *     <elementAbsorb:id#:data,...>
 *        吸収特性設定。dataの記述書式は次の通り。
 *        id#:rate# もしくは id#:rate%
 *        id#:属性ID
 *        rate#:吸収レート(0～, 1.0で100％吸収)
 *        rate%:吸収レート(0～, 100%で100%吸収)
 *        複数吸収設定はカンマ区切りにします。
 * 
 *     例：
 *        <elementAbsorb:1:20%,3:100%>
 *          属性ID 1 の攻撃を受けたときは20%吸収。 属性ID 3 を受けたときは100%吸収。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_Trait_ElementAbsorb";
    const parameters = PluginManager.parameters(pluginName);

    Game_BattlerBase.TRAIT_ELEMENT_ABSORB = Number(parameters['TraitCode']) || 0;

    //------------------------------------------------------------------------------
    // DataManager

    /**
     * 割合パラメータを計算する。
     * 
     * @param {String} valueStr 文字列
     */
    const _parseRate = function(valueStr) {
        if (valueStr.slice(-1) === "%") {
            return Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            return Number(valueStr);
        }
    };

    /**
     * elementAbsorb ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processElementAbsorbNoteTag = function(obj) {
        if (!obj.meta.elementAbsorb) {
            return;
        }
        const valueStr = obj.meta.elementAbsorb;
        const entries = valueStr.split(',');
        for (entry of entries) {
            const tokens = entry.split(':');
            if (tokens.length >= 2) {
                const elementId = Number(tokens[0]);
                const rate = _parseRate(tokens[1].trim());
                if (elementId && rate) {
                    obj.traits.push({ 
                        code:Game_BattlerBase.TRAIT_ELEMENT_ABSORB, 
                        dataId:elementId, 
                        value:rate
                    });
                }
            }

        }
    };

    DataManager.addNotetagParserActors(_processElementAbsorbNoteTag);
    DataManager.addNotetagParserClasses(_processElementAbsorbNoteTag);
    DataManager.addNotetagParserWeapons(_processElementAbsorbNoteTag);
    DataManager.addNotetagParserArmors(_processElementAbsorbNoteTag);
    DataManager.addNotetagParserStates(_processElementAbsorbNoteTag);
    DataManager.addNotetagParserEnemies(_processElementAbsorbNoteTag);

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    /**
     * 属性IDで指定された属性の、吸収レートを得る。
     * 吸収レートは、特性値の中で最大のものを適用する。
     * 
     * @param {Number} elementId 属性ID
     * @return {Number} 吸収レート
     */
    Game_BattlerBase.prototype.elementAbsorbRate = function(elementId) {
        return this.traitsWithId(Game_BattlerBase.TRAIT_ELEMENT_ABSORB, elementId).reduce((r, trait) => {
            if ((trait.value > 0) && (trait.value > r)) {
                return trait.value;
            } else {
                return r;
            }
        }, 0);
    };

    /**
     * このGame_BattlerBaseがelementIdで指定される属性を、吸収可能かどうかを判定して返す。
     * 
     * @param {Number} elementId 属性ID
     * @return {Boolean} 属性を吸収可能な場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isAbsorbElement = function(elementId) {
        const traits = this.traitsWithId(Game_BattlerBase.TRAIT_ELEMENT_ABSORB, elementId);
        if (traits.length > 0) {
            const isAbsorb = traits.some(trait => trait.value > 0);
            return isAbsorb;
        } else {
            return false;
        }

        return this.traitsWithId(Game_BattlerBase.TRAIT_ELEMENT_ABSORB,
             elementId).some(trait => trait.value > 0);
    }

    const _Game_BattlerBase_elementRate = Game_BattlerBase.prototype.elementRate;

    /**
     * このBattlerの属性ダメージレートを得る。
     *  
     * @param {Number} elementId 属性ID
     * @return {Number} 属性倍率。
     */
    Game_BattlerBase.prototype.elementRate = function(elementId) {
        const rate = _Game_BattlerBase_elementRate.call(this, ...arguments);
        if (this.isAbsorbElement(elementId)) {
            return -(rate * this.elementAbsorbRate(elementId));
        } else {
            return rate;
        }
    };

    /**
     * elementsで指定される属性の内、最も効果が大きな値を得る。
     * 吸収属性の効果が1つ以上あるならば、最も吸収効果が高いものが返る。
     * 
     * @param {Game_BattlerBase} target 対象
     * @param {Array<Number>} elements 属性ID配列
     * @return {Number} 値
     * 
     * !!!overwrite!!!
     */
    Game_Action.prototype.elementsMaxRate = function(target, elements) {
        if (elements.length > 0) {
            const rates = elements.map(elementId => target.elementRate(elementId));
            const minRate = Math.min(...rates);
            if (minRate < 0) {
                return minRate;
            } else {
                return Math.max(...rates);
            }
        } else {
            return 1;
        }
    };



})();