/*:ja
 * @target MZ 
 * @plugindesc Genderにステートのブロック及び自動付与をするプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_BattlerGender
 * @orderAfter Kapu_BattlerGender
 * 
 * 
 * @help 
 * Genderにステートのブロック及び自動付与をするプラグイン。
 * 例えば、魅了ステートに対して
 *   <maleRate:2.0>
 *   <femaleRate:0.25>
 * とノートタグを指定すれば、男性はかかりやすくなり、女性はかかりにくくなります。
 * また、
 *   <maleRate:0>
 * などとすれば、男性はステートをブロックするようになります。
 * 
 * 
 * 性別パッシブステートを有効にすれば、性別によって差異をつけることもできます。
 * 例えば特定の属性ダメージレートを上げたりとか。
 * 
 * ■ 使用時の注意
 * statesをフックするので重くなる。。
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ステート
 *   <maleRate:rate#>
 *     対象が男性の時に rate# だけ付与されやすくなる。
 *     例えば2.0を指定すると、付与率が2倍になる。
 *   <femaleRate:rate#>
 *     対象が女性の時に rate# だけ付与されやすくなる。
 *     例えば2.0を指定すると、付与率が2倍になる。
 *   <malePassive>
 *     対象が男性の場合、自動付与される。
 *     maleRateが指定されている場合には無視される。
 *   <femalePassive>
 *     対象が女性の場合、自動付与される。
 *     femaleRateが指定されている場合には無視される。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_battlerGender_States";
    // const parameters = PluginManager.parameters(pluginName);

    const malePassiveStates = [];
    const femalePassiveStates = [];
    const bothPassiveStates = [];

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * 割合パラメータを計算する。
     * 
     * @param {string} valueStr 文字列
     */
     const _parseRate = function(valueStr) {
        if (valueStr.slice(-1) === "%") {
            return Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            return Number(valueStr);
        }
    };    
    /**
     * ステートのノートタグをパースする。
     * 
     * @param {object} obj DataState
     */
    const _parseStateNotetag = function(obj) {
        if (obj.meta.maleRate) {
            obj.maleRate = _parseRate(obj.meta.maleRate);
        } else if (obj.meta.malePassive) {
            obj.maleRate = 1;
            if (!malePassiveStates.includes(obj.id)) {
                malePassiveStates.push(obj.id);
            }
        } else {
            obj.maleRate = 1;
        }
        if (obj.meta.femaleRate) {
            obj.femaleRate = _parseRate(obj.meta.femaleRate);
        } else if (obj.meta.femalePassive) {
            obj.femaleRate = 1;
            if (!femalePassiveStates.includes(obj.id)) {
                femalePassiveStates.push(obj.id);
            }
        } else {
            obj.femaleRate = 1;
        }

        if ((obj.maleRate === 1) && (obj.femaleRate === 1)
                && (obj.meta.malePassive || obj.meta.femalePassive)) {
            // レートが指定されていない場合で、いずれかの性別にパッシブ指定されている。
            if (!bothPassiveStates.includes(obj.id)) {
                bothPassiveStates.push(obj.id);
            }
        }
    };

    DataManager.addNotetagParserStates(_parseStateNotetag);


    //------------------------------------------------------------------------------
    // Game_BattlerBase
    const _Game_BattlerBase_states = Game_BattlerBase.prototype.states;
    /**
     * このGame_Battlerのステートを返す。
     * 
     * @returns {Array<DataState>} ステート
     */
    Game_BattlerBase.prototype.states = function() {
        let states = _Game_BattlerBase_states.call(this);
        for (const state of this.genderPassiveStates()) {
            if (!states.includes(state)) {
                states.push(state);
            }
        }
        return states;
    };


    const _Game_BattlerBase_stateRate = Game_BattlerBase.prototype.stateRate;
    /**
     * ステート受付けレートを得る。
     * 低いほどステートが付与されにくい。
     * 
     * @param {number} stateId ステートID
     * @return {number} ステート受付率
     */
    Game_BattlerBase.prototype.stateRate = function(stateId) {
        let rate = _Game_BattlerBase_stateRate.call(this, stateId);
        const state = $dataStates[stateId];
        if (state) {
            if (this.isMale()) {
                rate *= state.maleRate;
            }
            if (this.isFemale()) {
                rate *= state.femaleRate;
            }
        }
        return rate;
    };

    const _Game_BattlerBase_isStateResist = Game_BattlerBase.prototype.isStateResist;
    /**
     * ステートを受け付けないかどうかを判定する。
     * 
     * @param {number} stateId ステートID
     * @return {boolean} ステートを受け付けない場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isStateResist = function(stateId) {
        let isResist = _Game_BattlerBase_isStateResist.call(this, stateId);
        if (!isResist) {
            const state = $dataStates[stateId];
            if ((this.isMale() && (state.maleRate === 0))
                    || (this.isFemale() && (state.femaleRate === 0))) {
                isResist = true;
            }
        }
        return isResist;
    };

    const _Game_BattlerBase_isStateAffected = Game_BattlerBase.prototype.isStateAffected;
    /**
     * stateIdで指定されるステートを持っているかどうかを取得する。
     * 
     * @param {number} stateId ステートID
     * @returns {boolean} ステートを持っている場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isStateAffected = function(stateId) {
        if (this.isGenderPassiveStateAffected(stateId)) {
            return true;
        } else {
            return _Game_BattlerBase_isStateAffected.call(this, ...arguments);
        }
    };
    
    /**
     * パッシブステートを得る。
     * 
     * @returns {Array<DataState>} パッシブステート配列。
     */
    Game_BattlerBase.prototype.genderPassiveStates = function() {
        switch (this._gender) {
            case Game_BattlerBase.GENDER_OTHER:
                return [];
            case Game_BattlerBase.GENDER_MALE:
                return malePassiveStates.map(id => $dataStates[id]);
            case Game_BattlerBase.GENDER_FEMALE:
                return femalePassiveStates.map(id => $dataStates[id]);
            case Game_BattlerBase.GENDER_BOTH:
                return bothPassiveStates.map(id => $dataStates[id]);
            default:
                return [];
        }
    };
    /**
     * stateIdで指定されるステートが、
     * パッシブステートとして持っているかどうかを取得する。
     * 
     * @param {number} stateId ステートID
     * @returns {boolean} 保持しているパッシブステートに含まれる場合にはtrue,それ以外はfalse
     */
    Game_BattlerBase.prototype.isGenderPassiveStateAffected = function(stateId) {
        return this._passiveStateIds.includes(stateId);
    };
    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_isStateAddable = Game_Battler.prototype.isStateAddable;

    /**
     * ステートを付与可能かどうか判定する。
     * 
     * @param {number} stateId ステートID
     * @returns {boolean} ステートを付与可能な場合にはtrue,それ以外はfalse
     */
    Game_Battler.prototype.isStateAddable = function(stateId) {
        if (this.isGenderPassiveStateAffected(stateId)) {
            return false;
        } else {
            return _Game_Battler_isStateAddable.call(this, ...arguments);
        }
    };


    const _Game_Battler_removeState = Game_Battler.prototype.removeState;
    /**
     * ステートを取り除く。
     * 
     * @param {number} stateId ステートID
     */
    Game_Battler.prototype.removeState = function(stateId) {
        if (!this.isGenderPassiveStateAffected(stateId)) {
            // パッシブステートでなければ取り除く。
            _Game_Battler_removeState.call(this, ...arguments);
        }
    };
})();