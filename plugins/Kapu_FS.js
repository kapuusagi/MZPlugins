/*:ja
 * @target MZ 
 * @plugindesc FS向けカスタマイズ
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * 
 * @help 
 * FS向けの変更
 * レベルアップ時はランダムに上昇
 * 
 * ■ 使用時の注意
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
 *   <initialParams:%d,%d,%d,%d,%d,%d,%d,%d>
 *      それぞれのパラメータの初期値
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    //const pluginName = "Kapu_FS";
    //const parameters = PluginManager.parameters(pluginName);

    /**
     * ノートタグを処理する。
     * 
     * @apram {TraitObject} obj DataActor。
     */
    const _processNotetag = function(obj) {
        obj.paramGainRate = [ 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        obj.initialParams = [0, 0, 0, 0, 0, 0, 0, 0];

        // gainRate
        if (obj.meta.paramGainRate) {
            const tokens = obj.meta.paramGainRate.split(',');
            for (let index = 0; index < tokens.length; index++) {
                const value = Math.max(0, Math.min(500, Number(tokens[index]) || 0));
                obj.paramGainRate[index] = value / 100.0;
            }
        }

        // initialValue
        if (obj.meta.initialParams) {
            const tokens = obj.meta.initialParams.split(',');
            for (let index = 0; index < tokens.length; index++) {
                const value = Math.floor(Number(tokens[index] || 0));
                obj.initialParams[index] = value;
            }
        }
    };

    DataManager.addNotetagParserActors(_processNotetag);
    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_setup = Game_Actor.prototype.setup
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const dataActor = this.actor();
        for (let paramId = 0; paramId < this._paramPlus.length; paramId++) {
            this._paramPlus[paramId] = dataActor.initialParams[paramid];
        }
        this.refresh();
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
            const newExp = Math.floor(this.currentExp() / 2);
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
        return this.currentClass().params[paramId][1];
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
            const prevValue = table[this._level - 1];
            const curValue = table[this._level];
            const gainBase = curValue - prevValue;
            const gainMaxValue = Math.floor(gainBase * this.paramGainRate(paramId) * 2.0);
            const gainValue = Math.randomInt(gainMaxValue);
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
        return dataActor.paramGainRate[paramId];
    };
    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張

})();