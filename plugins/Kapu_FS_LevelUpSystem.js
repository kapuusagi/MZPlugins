/*:ja
 * @target MZ 
 * @plugindesc FS向けのレベルアップシステム
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @param varianceRate
 * @text 変動レート
 * @desc パラメータの変動レート。±% の変動幅を持たせる。
 * @type number
 * @min 0.00
 * @max 100.00
 * @decimals 2
 * @default 50.00
 * 
 * 
 * 
 * 
 * @help 
 * FS向けのレベルアップシステム。
 * レベルアップ時、ジョブのパラメータテーブルを元に計算した上昇量を算出し、ランダムに値を上げる。
 * HP～LUKのパラメータは
 *   (パラメータ基本値) + 加算値
 * で計算している。
 * パラメータ上昇量の計算は、テーブル上の現在の位置から、
 * 直近で低い値と高い値を元に、その間のレベル差で割って計算される。
 * これにより、全パラメータを指定しなくても良いようにした。
 * 
 * クラスチェンジを行った際、レベルを保存（ジョブ毎にレベルを保持）しない場合、
 * パラメータを半分にするようにした。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * パラメータの管理はparamPlusを使用している。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <paramGainRate:%d,%d,%d,%d,%d,%d,%d,%d>
 *      それぞれのパラメータの上昇レート。(0～500, 0で成長しない。500で5倍成長)
 *      省略した場合には全部100(1.0倍)になる。
 *      MaxHP, MaxMP, ATK, DEF, MAT,MDEF, AGI, LUK の順
 *   <initialParams:%d,%d,%d,%d,%d,%d,%d,%d>
 *      それぞれのパラメータの初期値
 *      MaxHP, MaxMP, ATK, DEF, MAT,MDEF, AGI, LUK の順
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    'use strict';
    const pluginName = "Kapu_FS_LevelUpSystem";
    const parameters = PluginManager.parameters(pluginName);

    const varianceRate = (Number(parameters["varianceRate"] || 0) || 0).clamp(0, 100) / 100.0;

    //PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
        // TODO : コマンドの処理。
        // パラメータメンバは @argで指定した名前でアクセスできる。
    //});

    /**
     * paramGainRateを解析して、パラメータ上昇レートを得る。
     * 
     * @param {string} paramStr パラメータ文字列
     * @returns {Array<number>} 上昇レート
     */
    const _parseParamGainRate = function(paramStr) {
        const paramGainRate = [ 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        try {
            if (paramStr) {
                const tokens = paramStr.split(',');
                for (let index = 0; index < tokens.length; index++) {
                    const value = Math.max(0, Math.min(500, Number(tokens[index]) || 0));
                    paramGainRate[index] = value / 100.0;
                }
            }
        }
        catch (e) {
            console.error("parse paramGainRate error : " + e);
        }

        return paramGainRate;
    };

    /**
     * initialParamsメタデータを解析して、初期値配列を得る。
     * 
     * @param {string} paramStr initialParams文字列
     * @returns {Array<number>} 初期値配列
     */
    const _getInitialParams = function(paramStr) {
        const initialParams = [0, 0, 0, 0, 0, 0, 0, 0];
        try {
            if (paramStr) {
                const tokens = paramStr.split(',');
                for (let index = 0; index < tokens.length; index++) {
                    const value = Math.max(0, Math.floor(Number(tokens[index] || 0)));
                    initialParams[index] = value;
                }
            }
        }
        catch (e) {
            console.error("initialParams parse error :" + e)
        }

        return initialParams;
    };
    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const dataActor = this.actor();
        const initialParams = _getInitialParams(dataActor.meta.initialParams);
        for (let paramId = 0; paramId < this._paramPlus.length; paramId++) {
            this._paramPlus[paramId] = initialParams[paramId];
        }
        this.refresh();
        this.recoverAll();
    };
    const _Game_Actor_changeClass = Game_Actor.prototype.changeClass;
    /**
     * クラスを変更する。
     * 
     * @param {number} classId クラスID
     * @param {boolean} keepExp 経験値を保持するか。
     *                          保持する場合、クラス毎に経験値が保持される。つまりジョブレベルね。
     */
    Game_Actor.prototype.changeClass = function(classId, keepExp) {
        _Game_Actor_changeClass.call(this, classId, keepExp);
        if (!keepExp) {
            const newLevel = Math.max(1, Math.floor(this._level / 2));
            const newExp = this.expForLevel(newLevel);
            this.changeExp(newExp, false);
            for (let paramId = 0; paramId < this._paramPlus.length; paramId++) {
                this._paramPlus[paramId] = Math.floor(this._paramPlus[paramId] / 2);
            }
            this.refresh();
        }
    };
    /**
     * 基本パラメータベース値を得る。
     * 
     * @param paramId {number} パラメータID
     * @return {number} パラメータ値
     * !!!overwrite!!! Game_Actor.paramBase()
     *     常にレベル1でのパラメータを返すように変更する。
     */
    Game_Actor.prototype.paramBase = function(paramId) {
        switch (paramId) {
            case 0: // MaxHp
            case 2: // Atk
            case 3: // Def
            case 4: // Mat
            case 5: // Mdf
            case 6: // Agi
            case 7: // Luk
                return 1;
            case 1: // MaxMp
            default:
                return 0;
        }
    };

    /**
     * curLevelの位置からみて、
     * curLevel未満の直近で高い値(valueA)とレベル(levelA)を取得し、
     * curLevel以上でvalueAより大きい最も小さい値(valueB)とレベル(levelB)を取得し、
     * その差分から1レベルあたり上昇量(実数)を得る。
     * 
     * @param {Array<number>} table パラメータテーブル
     * @param {number} curLevel 現在のレベル
     * @param {number} maxLevel 最大レベル
     * @returns {object} 上昇量オブジェクト
     */
    const _getGainBase = function(table, curLevel, maxLevel) {
        let levelA = Math.max(1, curLevel - 1);
        let valueA = table[levelA];
        
        // 現在のレベルより直近の、一番値が高いlevelとvalueをえる。
        for (let level = curLevel - 1; level > 0; level--) {
            if (table[level] > valueA) {
                levelA = level;
                valueA = table[level];
                break;
            }
        }


        let levelB = undefined;
        let valueB = undefined;
        for (let level = curLevel + 1; level < maxLevel; level++) {
            if (table[level] > valueA) {
                levelB = level;
                valueB = table[level];
                break;
            }
        }

        return ((valueB > valueA) && (levelB > levelA))
            ? (valueB - valueA) / (levelB - levelA) : 0;
    };

    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    /**
     * レベルアップ処理をする。
     */
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);

        // 種加算値を成長曲線を元にランダムで増やす。

        const dataClass = this.currentClass();
        for (let paramId = 0; paramId < dataClass.params.length; paramId++) {
            const table = dataClass.params[paramId];

            const gainBase = _getGainBase(table, this._level, this.maxLevel()) * this.paramGainRate(paramId);
            let gainValue;
            if (gainBase > 0) {
                if (varianceRate > 0.0) {
                        const gainMaxValue = Math.round(gainBase * (1.0 + varianceRate));
                        const gainMinValue = Math.round(gainBase * (1.0 - varianceRate));
                    gainValue = Math.round(gainMinValue + Math.random() * gainMaxValue - gainMinValue);
                } else {
                    gainValue = Math.round(gainBase);
                }
            }
            
            if (gainValue > 0) {
                this.addParam(paramId, gainValue);
            }
        }
    };

    /**
     * パラメータ上昇レート(0～5.0)を得る。
     * 
     * @param {number} paramId パラメータID
     */
    Game_Actor.prototype.paramGainRate = function(paramId) {
        const dataActor = this.actor();
        if (!dataActor.paramGainRate) {
            dataActor.paramGainRate = _parseParamGainRate(dataActor.meta.paramGainRate);
        }
        return dataActor.paramGainRate[paramId];
    };
    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();