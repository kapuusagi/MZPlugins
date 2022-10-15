/*:ja
 * @target MZ 
 * @plugindesc アクターデータ毎にスイッチとフラグを追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command setSwitch
 * @text アクタースイッチ設定
 * @desc 指定したアクターのスイッチの状態を設定する。
 * 
 * @arg actorId
 * @text 設定対象のアクター
 * @desc 設定対象のアクター。
 * @type actor
 * @default 0
 * 
 * @arg actorVariableId
 * @text 設定対象のアクター(変数指定)
 * @desc 設定対象のアクターを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * @arg switchName
 * @text アクタースイッチ名
 * @desc 設定するアクタースイッチの名前
 * @type string
 * @default 
 * 
 * @arg switchId
 * @text スイッチID
 * @desc 設定する値を格納したスイッチID
 * @type switch
 * @default 0
 * 
 * @arg isOn
 * @text スイッチ値
 * @desc スイッチIDが0の場合に設定値として使用される。
 * @type boolean
 * @default false
 * 
 * 
 * @command getSwitch
 * @text アクタースイッチ取得
 * @desc 指定したアクターのアクタースイッチを取得する。
 * 
 * @arg actorId
 * @text 取得対象のアクター
 * @desc 取得対象のアクター。
 * @type actor
 * @default 0
 * 
 * @arg actorVariableId
 * @text 取得対象のアクター(変数指定)
 * @desc 取得対象のアクターを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * @arg switchName
 * @text アクタースイッチ名
 * @desc 取得するアクタースイッチの名前
 * @type string
 * @default 
 * 
 * @arg switchId
 * @text スイッチID
 * @desc 取得した値を格納するスイッチID
 * @type switch
 * @default 0
 * 
 * 
 * @command setVariable
 * @text アクター変数設定
 * 
 * @arg actorId
 * @text 設定対象のアクター
 * @desc 設定対象のアクター。
 * @type actor
 * @default 0
 * 
 * @arg actorVariableId
 * @text 設定対象のアクター(変数指定)
 * @desc 設定対象のアクターを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * @arg variableName
 * @text アクター変数名
 * @desc 設定するアクター変数の名前
 * @type string
 * @default 
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 設定する値を格納した変数ID
 * @type variable
 * @default 0
 * 
 * @arg value
 * @text 値
 * @desc 変数IDが0の場合に、アクター変数の設定値として使用される。
 * @type number
 * @default 0
 * 
 * 
 * @command getVariable
 * @text アクター変数取得
 * 
 * @arg actorId
 * @text 取得対象のアクター
 * @desc 取得対象のアクター。
 * @type actor
 * @default 0
 * 
 * @arg actorVariableId
 * @text 取得対象のアクター(変数指定)
 * @desc 取得対象のアクターを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * @arg variableName
 * @text アクター変数名
 * @desc 取得するアクター変数の名前
 * @type string
 * @default 
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 値を格納する変数ID
 * @type variable
 * @default 0
 * 
 * 
 * @help 
 * アクター毎にスイッチと変数データを付与します。
 * 基本的に"スクリプト"によるアクセスを想定します。
 * アクターデータを初期化すると、該当するアクターのスイッチとフラグは消えます。
 * 
 * エスケープキャラクタに以下のものを追加します。
 * \AV[id#,variableName$] - id#のアクターのvariableName$で指定される変数の値に置換されます。
 * 
 * 
 * スイッチの設定
 *     $gameActors.actor(id).setSwitch("スイッチ名", 値);
 * スイッチの参照
 *     $gameActors.actor(id).switch("スイッチ名")
 * 変数の設定
 *     $gameActors.actor(id).setVariable("変数名", 値);
 * 変数の取得
 *     $gameActors.actor(id).variable("変数名");
 * 
 * ■ 使用時の注意
 * アクタースイッチの初期値は false です。
 * アクター変数の初期値は 0 です。
 * 
 * ■ プラグイン開発者向け
 * 特になし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * アクタースイッチ設定
 *   指定したアクターの指定した名前のスイッチ状態を、指定した値に設定する。
 * アクタースイッチ取得
 *   指定したアクターの指定した名前のスイッチ状態を、指定したスイッチに取得する。
 * 
 * アクター変数設定
 *   指定したアクターの指定した名前の変数を、指定した値に設定する。
 * アクター変数取得
 *   指定したアクターの指定した名前の変数を、指定した変数に取得する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    'use strict';
    const pluginName = "Kapu_ActorSwitchesAndVariables";
    // const parameters = PluginManager.parameters(pluginName);

    /**
     * アクターIDを得る。
     * 
     * @param {string} variableIdStr 変数ID
     * @param {string} idStr ID文字列
     * @returns {number} アクターID
     */
    const _getActorId = function(variableIdStr, idStr) {
        const variableId = Number(variableIdStr);
        if (variableId > 0) {
            return $gameVariables.value(variableId);
        } else {
            return Number(idStr);
        }
    };

    /**
     * スイッチの値を得る。
     * 
     * @param {strng} switchIdStr スイッチID文字列。
     * @param {string} isOnStr スイッチ状態文字列。true or false.
     * @returns {boolean} スイッチの値
     */
    const _getSwitchState = function(switchIdStr, isOnStr) {
        const switchId = Number(switchIdStr);
        if (switchId > 0) {
            return $gameSwitches.value(switchId);
        } else {
            return (typeof isOnStr == "undefined") ? false : (isOnStr == "true");
        }
    };

    PluginManager.registerCommand(pluginName, "setSwitch", args => {
        const actorId = _getActorId(args.actorVariableId, args.variableId);
        const switchName = args.switchName || "";
        const switchState = _getSwitchState(args.switchId, args.isOn);
        if ((actorId > 0) && switchName ) {
            $gameActors.actor(actorId).setSwitch(switchName, switchState);
        }
    });
    PluginManager.registerCommand(pluginName, "getSwitch", args => {
        const actorId = _getActorId(args.actorVariableId, args.variableId);
        const switchName = args.switchName || "";
        const switchId = Number(args.switchId);
        if ((actorId > 0) && switchName && (switchId > 0) ) {
            const switchState = $gameActors.actor(actorId).switch(switchName);
            $gameSwitches.setValue(switchId, switchState);
        }
    });

    const _getVariableValue = function(idStr, valueStr) {
        const id = Number(idStr);
        if (id > 0) {
            return $gameVariables.value(id);
        } else {
            return Math.round(Number(valueStr) || 0);
        }
    };

    PluginManager.registerCommand(pluginName, "setVariable", args => {
        const actorId = _getActorId(args.actorVariableId, args.variableId);
        const variableName = args.variableName || "";
        const value = _getVariableValue(args.variableId, args.value);
        if ((actorId > 0) && variableName ) {
            $gameActors.actor(actorId).setVariable(variableName, value);
        }
    });

    PluginManager.registerCommand(pluginName, "getVariable", args => {
        const actorId = _getActorId(args.actorVariableId, args.variableId);
        const variableName = args.variableName || "";
        const variableId = Number(args.variableId);
        if ((actorId > 0) && (variableId > 0) && variableName) {
            const value = $gameActors.actor(actorId).variable(variableName);
            $gameVariables.setValue(variableId, value);
        }
    });
    //------------------------------------------------------------------------------
    // Game_System
    const _Game_System_initialize = Game_System.prototype.initialize;
    /**
     * Game_Systemを初期化する。
     */
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._actorSwitchIdTable = {};
        this._actorVariableIdTable = {};
    };

    /**
     * テーブルに含まれないIDを返す。
     * 
     * @param {Dictionary<string,number>} table IDテーブル
     * @returns {number} 新しいID
     */
    const _generate_id = function(table) {
        let newId = 1;
        for (const key in table) {
            if (table[key]>= newId) {
                newId = table[key] + 1;
            }
        }
        return newId;
    };


    /**
     * スイッチ名に対応するアクタースイッチIDを得る。
     * 
     * @param {string} switchName スイッチ名
     * @returns {number} アクタースイッチID
     */
    Game_System.prototype.actorSwitchId = function(switchName) {
        const id = this._actorSwitchIdTable[switchName];
        if (id > 0) {
            return id;
        } else {
            const newId = _generate_id(this._actorSwitchIdTable);
            this._actorSwitchIdTable[switchName] = newId;
            return newId;
        }
    };
    /**
     * アクタースイッチIDテーブルを得る。
     * 
     * @returns [Dictionary<string,number>] アクタースイッチテーブル
     */
    Game_System.prototype.actorSwitchIds = function() {
        return this._actorSwitchIdTable;
    };
    /**
     * 変数名に対応するアクター変数IDを得る。
     * 
     * @param {string} variableName 変数名
     * @returns {number} アクター変数ID
     */
    Game_System.prototype.actorVariableId = function(variableName) {
        const id = this._actorVariableIdTable[variableName];
        if (id > 0) {
            return id;
        } else {
            const newId = _generate_id(this._actorVariableIdTable);
            this._actorVariableIdTable[variableName] = newId;
            return newId;
        }
    };

    /**
     * アクター変数IDテーブル
     * 
     * @returns {Dictionary<string,number>} アクター変数IDテーブル
     */
    Game_System.prototype.actorVariableIds = function() {
        return this._actorVariableIdTable;
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this.clearSwitches();
        this.clearVariables();
    };

    /**
     * スイッチをクリアする。
     */
    Game_Actor.prototype.clearSwitches = function() {
        this._switches = [];
    };

    /**
     * スイッチの値を設定する。
     * 
     * @param {string} idName ID名
     * @param {boolean} value 値
     */
    Game_Actor.prototype.setSwitch = function(idName, value) {
        const id = $gameSystem.actorSwitchId(idName);
        this._switches[id] = value ? true : false;
    };

    /**
     * スイッチの値を得る。
     * 
     * @param {string} idName ID名
     * @returns {boolean} スイッチの値
     */
    Game_Actor.prototype.switch = function(idName) {
        const id = $gameSystem.actorSwitchId(idName);
        return !!this._switches[id];
    };

    /**
     * 変数をクリアする。
     */
    Game_Actor.prototype.clearVariables = function() {
        this._variables = [];
    };

    /**
     * 変数の値を設定する。
     * 
     * @param {string} idName ID名
     * @param {number} value アクター変数値
     */
    Game_Actor.prototype.setVariable = function(idName, value) {
        const id = $gameSystem.actorVariableId(idName);
        this._variables[id] = Math.floor(Number(value) || 0);
    };

    /**
     * アクター変数値を得る。
     * 
     * @param {string} idName ID名
     * @returns {number} アクター変数値
     */
    Game_Actor.prototype.variable = function(idName) {
        const id = $gameSystem.actorVariableId(idName);
        return this._variables[id] || 0;
    };

    //------------------------------------------------------------------------------
    // Window＿Base

    const _actorVariable = function(p1, p2) {
        const actorId = parseInt(p1);
        let variableName = p2 || "";
        if (variableName.startsWith("\"") && variableName.endsWith("\"")) {
            variableName = variableName.slice(1, variableName.length - 1);
        }
        if (variableName.startsWith("'") && variableName.endsWith("'")) {
            variableName = variableName.slice(1, variableName.length - 1);
        }
        if ((actorId > 0) && variableName) {
            return String($gameActors.actor(actorId).variable(variableName));
        } else {
            return "";
        }
    };

    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    /**
     * エスケープキャラクタを変換する。
     * 
     * @param {string} text テキスト
     * @returns {string} 置換済みテキスト
     */
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        text = text.replace(/\x1bAV\[(\d+),([^\]]+)\]/gi, (_, p1, p2) =>
            _actorVariable(p1, p2)
        );
        return text;
    };


    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張
    
    
})();