/*:ja
 * @target MZ 
 * @plugindesc 基本パラメータによるダメージ計算補正プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Trait_Penetrate
 * @base Kapu_Twld_BasicParams
 * @orderAfter Kapu_Twld_BasicParams
 * 
 * 
 * @help 
 * 基本パラメータによるダメージ計算式プロパティを追加。
 *     atkcoef, defcoef, matcoef, mdfcoef
 * 補正値
 * ・STRが高いほどatkcoefが上がる。
 * ・INTが高いほどmatcoefが上がる
 * ・VITが高いほどvitcoefが上がる。
 * ・MDFが高いほどmdfcoefが上がる。
 * 
 * 
 * Penetrate特性が有効な場合
 * ・STRが30以上あるとき、貫通特性ボーナス。
 * ・INTが30以上あるとき、貫通特性ボーナス。
 * 
 * ■ 使用時の注意
 * Trait_Penetrateを使う場合、Trait_Penetrateより後に導入する必要があります。
 * 
 * ■ プラグイン開発者向け
 * ありません。
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
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Twld_BasicParams_DamageCalculation";

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    Object.defineProperties(Game_BattlerBase.prototype, {
        /**
         * PDR(物理被ダメージレート)
         * 
         * @constant {Number}
         * !!!overwrite!!! Game_BattlerBase.pdr
         */
        pdr : {
            /** @return {Number} */
            get: function() { return this.physicalDamageRate(); },
            configurable:true
        },
        /**
         * MDR(魔法被ダメージレート)
         * 
         * @constant {Number}
         * !!!overwrite!!! Game_BattlerBase.mdr
         */
        mdr : {
            /** @return {Number} */
            get: function() { return this.magicalDamegeRate(); },
            configurable:true
        },
        /** 
         * 攻撃計算式補正値。
         * データベースの計算式を簡単に書くために用意する。
         * 
         * @constant {Numbr}
         */  
        atkcoef: {
            /** @return {Number} */
            get: function() { return this.getPhysicalAttackRate(); },
            configurable:true 
        },
        /**
         * 防御力計算式補正式
         * データベースの計算式を簡単に書くために用意する。
         * 
         * @constant {Number}
         */
        defcoef: {
            /** @return {Number} */
            get: function() { return this.getPhysicalDefenceRate(); },
            configurable:true
        },
        /** 
         * 魔法攻撃力計算式補正値
         * データベースの計算式を簡単に書くために用意する。
         * 
         * @constant {Number}
         */
        matcoef: {
            /** @return {Number} */
            get: function() { return this.getMagicalAttackRate(); },
            configurable:true 
        },
        /** 
         * 魔法防御力計算式補正式
         * データベースの計算式を簡単に書くために用意する。
         * 
         * @constant {Number}
         */
        mdfcoef: {
            /** @return {Number} */
            get : function() { return this.getMagicalDefenceRate(); },
            configurable:true
        }        
    });

    if ("penetratePDR" in Game_BattlerBase.prototype) {
        const _Game_BattlerBase_penetratePDR = Game_BattlerBase.prototype.penetratePDR;
        /**
         * PDR貫通率を得る。
         * 
         * @return {Number} DEF貫通率(0～1.0)
         */
        Game_BattlerBase.prototype.penetratePDR = function() {
            // STRが30より高いと、1高い毎に0.5％貫通する。(最大25%)
            return _Game_BattlerBase_penetratePDR.call(this) + ((this.str - 30) * 0.005).clamp(0, 0.25);
        };
    }
    if ("penetrateMDR" in Game_BattlerBase.prototype) {
        const _Game_BattlerBase_penetrateMDR = Game_BattlerBase.prototype.penetrateMDR;
        /**
         * MDR貫通率を得る。
         * 
         * @return {Number} MDR貫通率(0～1.0)
         */
        Game_BattlerBase.prototype.penetrateMDR = function() {
            // INTが30より高いと、1高い毎に0.5％貫通する。(最大25%)
            return _Game_BattlerBase_penetrateMDR.call(this) + ((this.int - 30) * 0.005).clamp(0, 0.25);
        };        
    }

    /**
     * 物理攻撃力補正値を得る。
     * @return {Number} 物理攻撃力補正値(倍率)
     */
    Game_BattlerBase.prototype.getPhysicalAttackRate = function() {
        // 物理攻撃補正
        const str = this.str;
        if (str < 20) {
            // STRが20以下の場合、1の差が5％の影響を与える。
            return str * 0.05;
        } else if (str < 40) {
            // STRが20以上、40未満の場合、1向上毎に5%向上する。
            return 1.0 + (str - 20) * 0.05;
        } else if (str < 140) {
            // STRが40以上、80未満の場合、1向上毎に2.5%向上する。
            return 2.0 + (str - 40) * 0.025;
        } else {
            // STRが80以上の場合、1向上毎に1%向上する。
            return 3.0 + (str - 80) * 0.01;
        }
    };

    /**
     * 物理防御力補正値を得る。
     * @return {Number} 物理防御力補正値(倍率)
     */
    Game_BattlerBase.prototype.getPhysicalDefenceRate = function() {
        // 物理防御補正
        //   VITが20以上で1向上毎に4%の影響を与える。
        return 1.0 + Math.max(0, (this.vit - 20) * 0.04);
    };

    /**
     * 魔法攻撃力補正値を得る。
     * 
     * @return {Number} 補正値(倍率)
     */
    Game_BattlerBase.prototype.getMagicalAttackRate = function() {
        // 魔法攻撃補正
        const int = this.int;
        if (int < 20) {
            // INTが10未満の場合、1低いごとに2.5%効果が減少する。
            return 0.5 + int * 0.025;
        } else if (int < 35) {
            // INTが20以上、35未満の場合、1向上毎に3%効果が上昇する。
            return 1.0 + (int - 20) * 0.03;
        } else if (int < 55) {
            // INTが35以上55未満の場合、1向上毎に4%効果が上昇する。
            return 1.45 + (int - 35) * 0.04;
        } else if (int < 80) {
            // INTが55以上80未満の場合、1向上毎に5%効果が上昇する。
            return 2.25 + (int - 55) * 0.05;
        } else {
            // INTが140以上の場合、1向上毎に7％効果が上昇する。
            return 3.5 + (int - 80) * 0.07;
        }
    };

    /**
     * 魔法防御力補正値値を得る。 
     * @return {Number} 魔法防御力補正値(倍率)
     */
    Game_BattlerBase.prototype.getMagicalDefenceRate = function() {
        // 魔法防御補正
        //   VITが20以上で1向上毎に2%の影響を与える。
        //   MENが20以上で1向上毎に4%の影響を与える。
        return 1.0
            + Math.max(0, (this.vit - 20) * 0.02)
            + Math.max(0, (this.men - 20) * 0.04);
    };

    /**
     * PDR値(物理被ダメージレート)を得る。
     * 
     * @return {Number} PDR値(1.0で等倍)
     */
    Game_BattlerBase.prototype.physicalDamageRate = function() {
        let rate = this.sparam(6);
        // VITが20以上の時、1上げる毎に0.5%軽減する。
        rate -= Math.max(0, this.vit - 20) * 0.005;
        return Math.max(0, rate);
    };

    /**
     * MDR値(魔法被ダメージレート)を得る。
     * 
     * @return {Number} MDR値(1.0で等倍)
     */
    Game_BattlerBase.prototype.magicalDamegeRate = function() {
        let rate = this.sparam(7); // ベーシックシステムのMDR
        // VITが20以上の場合、VITを1上げる毎に0.25%軽減する。
        rate -= Math.max(0, ((this.vit - 20) * 0.0025));
        // MENが20以上の場合、MENを1上げる毎に0.5%軽減する。
        rate -= Math.max(0, ((this.men - 20) * 0.005));
        return Math.max(0, rate);
    };



})();