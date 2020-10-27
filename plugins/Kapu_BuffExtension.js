/*:ja
 * @target MZ 
 * @plugindesc バフ拡張プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_Params
 * @orderAfter Kapu_Base_Params
 * 
 * @param maxBuffLevel
 * @text 割合レート最大バフレベル
 * @desc 割合レート最大バフレベル。この段階までは上がる。
 * @type number
 * @default 2
 * 
 * @param maxDebuffLevel
 * @text 割合レート最大デバフレベル
 * @desc 割合レート最大デバフレベル。この段階までは上がる。
 * @type number
 * @default 2
 * 
 * @param buffRate0
 * @text 最大HPバフレート
 * @desc バフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param buffRate1
 * @text 最大MPバフレート
 * @desc バフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param buffRate2
 * @text ATKバフレート
 * @desc バフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param buffRate3
 * @text DEFバフレート
 * @desc バフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param buffRate4
 * @text MATバフレート
 * @desc バフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param buffRate5
 * @text MDFバフレート
 * @desc バフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param buffRate6
 * @text AGIバフレート
 * @desc バフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param buffRate7
 * @text LUKバフレート
 * @desc バフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param debuffRate0
 * @text 最大HPデバフレート
 * @desc デバフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param debuffRate1
 * @text 最大MPデバフレート
 * @desc デバフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param debuffRate2
 * @text ATKデバフレート
 * @desc デバフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param debuffRate3
 * @text DEFデバフレート
 * @desc デバフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param debuffRate4
 * @text MATデバフレート
 * @desc デバフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param debuffRate5
 * @text MDFデバフレート
 * @desc デバフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param debuffRate6
 * @text AGIデバフレート
 * @desc デバフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param debuffRate7
 * @text LUKデバフレート
 * @desc デバフ段階が1段階上がる毎に上昇させる割合レート。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * 
 * @help 
 * バフの拡張をするプラグイン。
 * ベーシックシステムでは、バフ段階を-2～2で上下させ、段階毎に25%の増減をする仕様であった。
 * これだとスキル効果に個性を持たせるのに不十分と考え、バフの仕様変更を行う。
 * 
 * ■ 使用時の注意
 * 他のバフを変更する系統のプラグインと競合します。
 * 
 * ■ プラグイン開発者向け
 * なし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
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

 /**
  * バフデータを表すオブジェクト
  */
function Game_Buff() {
    this.initialize(...arguments);
};
(() => {
    const pluginName = "Kapu_Buff_Extension";
    const parameters = PluginManager.parameters(pluginName);

    const maxBuffLevel = Number(parameters["maxBuffLevel"]) || 2;
    const minBuffLevel = -Number(parameters["maxDebuffLevel"]) || -2;

    const buffRates = [];
    for (let i = 0; i < 8; i++) {
        const rate = Number(parameters["buffRate" + i]) || 0.25;
        buffRates.push(rate);
    }

    const debuffRates = [];
    for (let i = 0; i < 8; i++) {
        const rate = Number(parameters["debuffRate" + i]) || 0.25;
        debuffRates.push(rate);
    }


    //------------------------------------------------------------------------------
    // Game_Buff
    /**
     * Game_Buffオブジェクトを初期化する。
     */
    Game_Buff.prototype.initialize = function() {
        this.clear();
    };

    /**
     * バフをクリアする。
     */
    Game_Buff.prototype.clear = function() {
        this._level = 0;
        this._value = 0;
        this._turns = 0;
    };

    /**
     * バフレベルを得る。
     * 
     * @return {Number} バフレベル
     */
    Game_Buff.prototype.buffLevel = function() {
        return this._level;
    };

    /**
     * バフの乗算レートを得る。
     * 
     * @param {Number} baseBuffRate ベースのバフレート
     * @param {Number} baseDebuffRate ベースのデバフレート
     * @return {Number} バフレート(0.0～)が返る。(1.0で等倍)
     */
    Game_Buff.prototype.buffRate = function(baseBuffRate, baseDebuffRate) {
        if (this._level >= 0) {
            return 1.0 + this._level * baseBuffRate;
        } else {
            return Math.max(0, 1.0 + this._level * baseDebuffRate)s;
        }
    };

    /**
     * バフ固定量加減算値を得る。
     * 
     * @return {Number} 固定量加減算値。
     */
    Game_Buff.prototype.buffAdd = function() {
        return this._value;
    };

    /**
     * バフかどうかを得る。
     * 
     * @return {Boolean} バフの場合にはtrue, それ以外はfalse。
     */
    Game_Buff.prototype.isBuff = function() {
        return (this._level > 0) || (this._value > 0);
    };

    /**
     * デバフかどうかを得る。
     * 
     * @return {Boolean} デバフの場合にはtrue, それ以外はfalse。
     */
    Game_Buff.prototype.isDebuff = function() {
        return (this._level < 0) || (this._value < 0);
    };

    /**
     * バフレベルを加減する。
     * 
     * @param {Number} level 上限させるレベル
     */
    Game_Buff.prototype.gainBuffLevel = function(level) {
        if (level > 0) {
            if (this.isDebuffAffected()) {
                this._level += level;
                if (this._level >= 0) {
                    // デバフを打ち消したので固定加算値もクリアする。
                    this._value = 0;
                }
            } else {
                this._level += level;
            }
        } else if (level < 0) {
            if (this.isBuffAffected()) {
                this._level += level;
                if (this._level < 0) {
                    // バフを打ち消したので固定加算値もクリアする。
                    this._value = 0;
                }
            } else {
                this._level += level;
            }
        }
    };

    /**
     * このバフが効果を及ぼす残りターン数を得る。
     * 
     * @return {Number} 残りターン数
     */
    Game_Buff.prototype.turns = function() {
        return this._turns;
    };

    /**
     * このバフの残りターン数を設定する。
     * 
     * @param {Number} turns ターン数
     */
    Game_Buff.prototype.setTurns = function(turns) {
        this._turns = turns;
    };

    /**
     * このバフの残りターン数を加減する。
     * 
     * @param {Number} turns ターン数
     */
    Game_Buff.prototype.gainTurns = function(turns) {
        this._turns = Math.max(0, this._turns + turns);
    };

    /**
     * 効果ターンを更新する。ｓｓ
     */
    Game_Buff.prototype.updateTurns = function() {
        if (this._turns > 0) {
            this._turns--;
        }
    };

    /**
     * バフを適用する。
     * 
     * @param {Number} baseValue バフ適用前の値
     * @param {Number} baseBuffRate ベースのバフレート
     * @param {Number} baseDebuffRate ベースのデバフレート
     * @return {Number} バフ適用後の値。
     */
    Game_Buff.prototype.applyBuff = function(baseValue, baseBuffRate, baseDebuffRate) {
        return baseValue * this.buffRate(baseBuffRate, baseDebuffRate) + this._value;
    };

    

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * バフを適用する。
     * 
     * Note:バフデータ構造変更のためオーバーライドする。
     * 
     * @param {Number} paramId パラメータID
     * @param {Number} baseValue バフの適用元のベース値
     * @return {Number} バフを適用した後の値。
     * !!!overwrite!!! Game_BattlerBase.applyBuff()
     */
    Game_BattlerBase.prototype.applyBuff = function(paramId, baseValue) {
        const buffRate = buffRates[paramId];
        const debuffRate = debuffRates[paramId];
        return this._buffs[paramId].applyBuff(baseValue, buffRate, debuffRate);
    };

    /**
     * バフをクリアする。
     * 
     * Note:バフデータ構造変更のためオーバーライドする。
     * !!!overwrite!!! Game_BattlerBase.clearBuffs()
     */
    Game_BattlerBase.prototype.clearBuffs = function() {
        for (let i = 0; i < 8; i++) {
            this._buffs[i] = new Game_Buff();
        }
    };
    /**
     * バフを消去する。
     * 
     * Note:バフデータ構造変更のためオーバーライドする。
     * @param {Number} paramId パラメータID
     * !!!overwrite!!! Game_BattlerBase.eraseBuff()
     */
    Game_BattlerBase.prototype.eraseBuff = function(paramId) {
        this._buffs[paramId].clear();
    };
    /**
     * バフ段階を得る。
     * 
     * Note:バフデータ構造変更のためオーバーライドする。
     * @param {Number} paramId パラメータID
     * @return {Number} バフ段階
     * !!!overwrite!!! Game_BattlerBase.buff()
     */
    Game_BattlerBase.prototype.buff = function(paramId) {
        return this._buffs[paramId].buffLevel();
    };

    /**
     * バフが適用されているかどうかを判定する。
     * 
     * Note:バフデータ構造変更のためオーバーライドする。
     * @param {Number} paramId パラメータID
     * @return {Boolean} バフが適用されている場合にはtrue, それ以外はfalse.
     * !!!overwrite!!! Game_BattlerBase.isBuffAffected()
     */
    Game_BattlerBase.prototype.isBuffAffected = function(paramId) {
        return this._buffs[paramId].isBuff();
    };

    /**
     * デバフが適用されているかどうかを得る。
     * 
     * Note:バフデータ構造変更のためオーバーライドする。
     * @param {Number} paramId パラメータID
     * @return {Boolean} デバフが適用されている場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_BattlerBase.isDebuffAffected()
     */
    Game_BattlerBase.prototype.isDebuffAffected = function(paramId) {
        return this._buffs[paramId].isDebuff();
    };
    /**
     * バフまたはデバフが適用されているかどうかを取得する。
     * 
     * Note:バフデータ構造変更のためオーバーライドする。
     * @param {Number} paramId パラメータID
     * @return {Boolean} バフまたはデバフが適用されている場合にはtrue, それ以外はfalse.
     * !!!overwrite!!! Game_BattlerBase.isBuffOrDebuffAffected
     */
    Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId) {
        const buff = this._buffs[paramId];
        return buff.isBuff() || buff.isDebuff();
    };
    /**
     * バフ段階が最大かどうかを判定する。
     * 
     * Note:バフデータ構造変更のためオーバーライドする。
     * @param {Number} paramId パラメータID
     * @return {Boolean} 最大減適用されている場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_BattlerBase.isMaxBuffAffected
     */
    Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
        return this._buffs[paramId].buffLevel() === maxBuffLevel;
    };

    /**
     * デバフ段階が最大かどうかを判定する。
     * 
     * Note:バフデータ構造変更のためオーバーライドする。
     * @param {Number} paramId パラメータID
     * @return {Boolean} 最大減適用されている場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_BattlerBase.isMaxDebuffAffected()
     */
    Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
        return this._buffs[paramId].buffLevel() === minBuffLevel;
    };



    /**
     * バフが適用されているかどうかを判定する。
     * 
     * @param {Number} paramId パラメータID
     * @return {Boolean} バフが適用されている場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isBuffAffected = function(paramId) {
        return Game_BattlerBase.prototype.isBuffAffected.call(this, paramId)
                || (this._buffsAdd[paramId] > 0);
    };

    const _Game_BattlerBase_isDebuffAffected = Game_BattlerBase.prototype.isDebuffAffected;
    /**
     * デバフが適用されているかどうかを得る。
     * 
     * Note: 割合バフと固定量バフを元に計算するため、オーバーライドする。
     * @param {Number} paramId パラメータID
     * @return {Boolean} デバフが適用されている場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isDebuffAffected = function(paramId) {
        return _Game_BattlerBase_isDebuffAffected.call(this, paramId)
                || (this._buffsAdd[paramId] < 0);
    };
    /**
     * バフまたはデバフが適用されているかどうかを取得する。
     * 
     * Note: 割合バフと固定量バフを元に計算するため、オーバーライドする。
     * 
     * @param {Number} paramId パラメータID
     * @return {Boolean} バフまたはデバフが適用されている場合にはtrue, それ以外はfalse 
     * !!!overwrite!!! GameBattlerBase.isBuffOrDebuffAffected()
     */
    Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId) {
        const value = this.paramWithoutBuff(paramId);
        const buffedValue = this.applyBuff(paramId, value);
        return (buffedValue !== value);
    };

    /**
     * バフを1段階引き上げる。
     * 
     * Note: 割合バフと固定量バフを元に計算するため、オーバーライドする。
     * @param {Number} paramId パラメータID
     * !!!overwrite!!! Game_BattlerBase.increaseBuff()
     */
    Game_BattlerBase.prototype.increaseBuff = function(paramId) {
        if (!this.isMaxBuffAffected(paramId)) {
            this._buffs[paramId].gainBuffLevel(1);
        }
    };

    /**
     * バフを1段階引き下げる。
     * 
     * Note: 割合バフと固定量バフを元に計算するため、オーバーライドする。
     * @param {Number} paramId パラメータID
     * !!!overwrite!!! Game_BattlerBase.decreaseBuff()
     */
    Game_BattlerBase.prototype.decreaseBuff = function(paramId) {
        if (!this.isMaxDebuffAffected(paramId)) {
            this._buffs[paramId].gainBuffLevel(-1);
        }
    };

    /**
     * バフターンを上書きする。
     * 
     * Note: 割合バフと固定量バフを元に計算するため、オーバーライドする。
     * @param {Number} paramId パラメータID
     * @param {Number} turns ターン数
     * !!!overwrite!!! Game_BattlerBase.overwriteBuffTurns()
     */
    Game_BattlerBase.prototype.overwriteBuffTurns = function(paramId, turns) {
        const buff = this._buffs[paramId];
        if (buff.turns() < turns) {
            buff.setTurns(turns);
        }
    };

    /**
     * バフの効果ターンが切れたかどうかを取得する。
     * 
     * Note: 割合バフと固定量バフを元に計算するため、オーバーライドする。
     * @param {Number} paramId パラメータID
     * @return {Boolean} 切れた場合にはtrue, それ以外はfalse
     * !!!overwrite!!! Game_BattlerBase.isBuffExpired
     */
    Game_BattlerBase.prototype.isBuffExpired = function(paramId) {
        const buff = this._buffs[paramId];
        return buff.turns() === 0;
    };

    /**
     * バフの効果ターンを更新する。
     * 
     * Note: 割合バフと固定量バフを元に計算するため、オーバーライドする。
     * !!!Game_BattlerBase.updateBuffTurns!!!
     */
    Game_BattlerBase.prototype.updateBuffTurns = function() {
        for (let i = 0; i < this._buffTurns.length; i++) {
            this._buffs[i].updateTurns();
        }
    };

    /**
     * バフアイコンを得る。
     * 
     * @return {Array<Number>} バフのアイコン配列
     */
    Game_BattlerBase.prototype.buffIcons = function() {
        const icons = [];
        for (let i = 0; i < this._buffs.length; i++) {
            if (this.isBuffOrDebuffAffected(i)) {
                icons.push(this.buffIconIndex(this._buffs[i].buffLevel(), i));
            }
        }
        return icons;
    };

    /**
     * バフのアイコン番号を得る。
     * 
     * @param {Number} buffLevel バフレベル
     * @param {Number} paramId パラメータID
     * @return {Number} アイコン番号。
     */
    Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
        const buff = this._buffs[paramId];
        if (buff.isBuff()) {
            return Game_BattlerBase.ICON_BUFF_START + paramId;
        } else if (buff.isDebuff()) {
            return Game_BattlerBase.ICON_DEBUFF_START + paramId;
        } else {
            return 0;
        }
    };

    //------------------------------------------------------------------------------
    // Game_Battler


    //------------------------------------------------------------------------------
    // Game_Action
    /**
     * バフを適用する。
     * 
     * @param {Game_Battler} target 対象
     * @param {Effect} effect エフェクトデータ
     */
    Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
        target.addBuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    };

    /**
     * バフを適用する。
     * 
     * @param {Game_Battler} target 対象
     * @param {Effect} effect エフェクトデータ
     */
    Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
        let chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addDebuff(effect.dataId, effect.value1);
            this.makeSuccess(target);
        }
    };

})();