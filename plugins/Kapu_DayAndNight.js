/*:ja
 * @target MZ
 * @plugindesc 昼夜機能プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command changeEffectEnable
 * @text エフェクトON/OFF変更
 * @desc 時間帯/天候エフェクトの有効状態を設定する。イベント処理で、天候やカラートーン操作をしたい場合にOFFにする。
 * 
 * @arg isTimeRangeEnabled
 * @text 時間帯エフェクト帯有効
 * @desc 時間帯エフェクトを有効にする場合にtrue
 * @type boolean
 * @default true
 * 
 * @arg isWeatherEnabled
 * @text 天候有効
 * @desc 天候エフェクトを有効にする場合にtrue。
 * @type boolean
 * @default true
 * 
 * @command changeTimeRange
 * @text 時間帯変更
 * @desc 時間帯を変更する。既に同じ時間帯であれば何もしない。
 * 
 * @arg timeRange
 * @text 時間帯
 * @desc 遷移先の時間帯
 * @type select
 * @default 1
 * @option 朝
 * @value 1
 * @option 昼
 * @value 2
 * @option 夕方
 * @value 3
 * @option 夜
 * @value 4
 * @option 深夜
 * @value 5
 * 
 * @arg isWait
 * @text 変更完了を待機する
 * @desc 変更完了を待機する場合にtrue, 待機しない場合にfalse.
 * @type bool
 * @default false
 * 
 * @arg duration
 * @text 変化にかけるフレーム数
 * @desc 天候のエフェクト適用にかけるフレーム数。0にすると即座に変化する。
 * @type number
 * @default 120
 * 
 * 
 * @command changeWeather
 * @text 天候変更
 * @desc 天候を変更する。既に同じ天候・強さであればなにもしない。
 * 
 * @arg weather
 * @text 天候
 * @desc 変更する天候
 * @type select
 * @default 1
 * @option 晴れ
 * @value 1
 * @option 雨
 * @value 2
 * @option 嵐
 * @value 3
 * @option 雪
 * @value 4
 * 
 * @arg power
 * @text 天候エフェクトの強さ
 * @desc 天候エフェクトの強さ
 * @type number
 * @default 1
 * 
 * @arg isWait
 * @text 変更完了を待機する
 * @desc 変更完了を待機する場合にtrue, 待機しない場合にfalse.
 * @type boolean
 * @default false
 * 
 * @arg duration
 * @text 変化にかけるフレーム数
 * @desc 天候のエフェクト適用にかけるフレーム数。0にすると即座に変化する。
 * @type number
 * @default 120
 * 
 * 
 * @param moning
 * @text 朝データ
 * @desc 朝データ
 * @type struct<TimeRangeData>
 * @default {"name":"朝","onSwitchId":"0","offSwitchId":"0","brightness":"255","colorTone":"[220,220,255,255]","encountRate":"1.00","surpriseRate":"1.00"}
 * 
 * @param noon
 * @text 昼データ
 * @desc 昼データ
 * @type struct<TimeRangeData>
 * @default {"name":"昼","onSwitchId":"0","offSwitchId":"0","brightness":"255","colorTone":"[255,255,255,255]","encountRate":"1.00","surpriseRate":"1.00"}
 * 
 * @param evening
 * @text 夕方データ
 * @desc 夕方データ
 * @type struct<TimeRangeData>
 * @default {"name":"夕方","onSwitchId":"0","offSwitchId":"0","brightness":"255","colorTone":"[255,220,180,255]","encountRate":"1.10","surpriseRate":"1.00"}
 * 
 * @param night
 * @text 夜データ
 * @desc 夜データ
 * @type struct<TimeRangeData>
 * @default {"name":"夜","onSwitchId":"0","offSwitchId":"0","brightness":"128","colorTone":"[180,180,180,255]","encountRate":"1.50","surpriseRate":"1.50"}
 * 
 * @param midNight
 * @text 深夜データ
 * @desc 深夜データ
 * @type struct<TimeRangeData>
 * @default {"name":"深夜","onSwitchId":"0","offSwitchId":"0","brightness":"64","colorTone":"[180,180,180,255]","encountRate":"2.00","surpriseRate":"2.00"}
 * 
 * @param sunny
 * @text 晴れデータ
 * @desc 晴れデータ
 * @type struct<WeatherData>
 * @default {"name":"晴れ","onSwitchId":"0","offSwitchId":"0","brightness":"255","colorTone":"[255,255,255,255]","encountRate":"1.00","surpriseRate":"1.00"}
 * 
 * @param rain
 * @text 雨天データ
 * @desc 雨天データ
 * @type struct <WeatherData>
 * @default {"name":"雨","onSwitchId":"0","offSwitchId":"0","brightness":"180","colorTone":"[255,255,255,255]","encountRate":"1.00","surpriseRate":"1.00"}
 * 
 * @param storm
 * @text 嵐データ
 * @desc 嵐データ
 * @type struct <WeatherData>
 * @default {"name":"嵐","onSwitchId":"0","offSwitchId":"0","brightness":"128","colorTone":"[255,255,255,255]","encountRate":"1.00","surpriseRate":"2.00"}
 * 
 * @param snow
 * @text 雪データ
 * @desc 雪データ
 * @type struct <WeatherData>
 * @default {"name":"雪","onSwitchId":"0","offSwitchId":"0","brightness":"200","colorTone":"[255,255,255,255]","encountRate":"1.00","surpriseRate":"1.00"}
 * 
 * 
 * @param storeTimeRangeVariableId
 * @text 時間帯変数ID
 * @desc 時間帯を格納する変数ID。格納される値は1:朝, 2:昼, 3:夕方, 4:夜, 5:深夜
 * @type variable
 * @default 0
 * 
 * @param storeWeatherVariableId
 * @text 天候変数ID
 * @desc 天候を格納する変数ID。格納される値は1:晴れ,2:雨,3:嵐,4:雪
 * @type variable
 * @default 0
 * 
 * 
 * 
 * @help 
 * 昼と夜機能を実現するためのプラグイン。
 * 以下の機能を提供する。
 * 1. 時間帯機能
 * ・朝、昼、夕方 夜、深夜の「時間帯」を持たせることができる。
 *   時間帯はマップエフェクトを主としたものになる。
 *   (TODO) 「時間帯」はプラグインコマンドを使用するか、補助プラグインにより切り替えることができる。
 *          表示を瞬間的に切り替える/フェードさせるの2つを選択できる。
 * ・「時間帯」に切り替わった時、指定したスイッチをONにすることができる。
 * ・「時間帯」から切り替わった時、指定したスイッチをOFFにすることができる。
 *   (TODO) 「時間帯」にランダムエンカウント率を絡めることができる。
 *   (TODO) 「時間帯」にランダムエンカウント時のエネミー出現ON/OFFを絡めることができる。
 * ・マップのノートタグにて、昼夜のエフェクトをかけるかどうかを設定することができる。
 * ・時間帯をプラグインパラメータで指定した変数に格納することができる。
 * 
 * 2. 天候機能
 * ・天候状態を持たせることができる。
 *   切り替えはプラグインコマンドを使用するか、補助プラグインにより切り替える。
 * ・天候状態に切り替わった時、指定したスイッチをONにすることが出来る。
 * ・天候状態から切り替わった時、指定したスイッチをOFFにすることが出来る。
 *   (TODO) 「時間帯」にランダムエンカウント率を絡めることができる。
 *   (TODO) 「時間帯」にランダムエンカウント時のエネミー出現ON/OFFを絡めることができる。
 * ・マップのノートタグにて、天候エフェクトをかけるかどうかを設定することができる。
 *   マップのノートタグにて天候エフェクトをかけるかどうかを設定することができる。
 * ・「天候」をプラグインパラメータで指定した変数に格納することができる。
 * 
 * 歩数で昼夜を切り替えたい場合には、EventAtNumberOfStepsで時間帯変更イベントを呼び出すか、
 * 補助プラグインDayAndNightByStepsを導入する。
 * 
 * 
 * 
 * ■ 使用時の注意
 * Kapu_MapFilter及びKapu_MapFilter_Darknessを使用します。
 * MapFilter_DarknessはON/OFFしないこと。OFFすると、暗闇状態が正常に反映されなくなります。
 * 
 * 
 * 画面の天候エフェクト/画面のトーン変更と競合します。
 * 
 * 
 * これはプラグインを使わなくてもインタプリタで実現できそう。というかカスタマイズしたいならインタプリタでゴリゴリ書いた方がいい。
 * 
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
 * マップ
 *   <timeRangeEffect>
 *     このマップで時間帯を表す画面効果を有効にする。
 *   <weatherEffect>
 *     このマップで天候状態を表す画面効果を有効にする。
 *   <weatherEffect:id#,id#,...>
 *     このマップのid#で指定された領域にいるとき、天候状態を表す画面効果を有効にする。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/*~struct~TimeRangeData:
 *
 * @param name
 * @text 時間帯名
 * @desc 時間帯の名前
 * @type string
 * 
 * @param onSwitchId
 * @text ONスイッチID
 * @desc 時間帯になったときONするスイッチID
 * @type switch
 * 
 * @param offSwitchId
 * @text OFFスイッチID
 * @desc 時間帯が終わったときにOFFするスイッチID
 * @type switch
 * 
 * @param brightness
 * @text 明るさ
 * @desc 時間帯に適用する明るさ
 * @type number
 * @min 0
 * @max 255
 * 
 * @param colorTone
 * @text カラートーン
 * @desc 時間帯に適用するカラートーン。R,G,B,Gray
 * @type number[]
 *
 * @param encountRate
 * @text エンカウントレート
 * @desc 時間帯に適用するエンカウントレート。1.0で変更無し。
 * @type number
 * @decimals 2
 * @min 0.00
 * 
 * @param surpriseRate
 * @text 急襲レート
 * @desc 時間帯に適用する急襲レート。1.0で変更無し。
 * @type number
 * @decimals 2
 * @min 0.00
 * 
 */
/*~struct~WeatherData:
 *
 * @param name
 * @text 天候名
 * @desc 天候の名前
 * @type string
 * 
 * @param onSwitchId
 * @text ONスイッチID
 * @desc 時間帯になったときONするスイッチID
 * @type switch
 * 
 * @param offSwitchId
 * @text OFFスイッチID
 * @desc 時間帯が終わったときにOFFするスイッチID
 * @type switch
 * 
 * @param brightness
 * @text 輝度
 * @desc 輝度
 * @type number
 * @min 0
 * @max 255
 *
 * @param colorTone
 * @text カラートーン
 * @desc 時間帯に適用するカラートーン。R,G,B,Gray
 * @type number[]
 * 
 * @param encountRate
 * @text エンカウントレート
 * @desc 時間帯に適用するエンカウントレート。1.0で変更無し。
 * @type number
 * @decimals 2
 * @min 0.00
 * 
 * @param surpriseRate
 * @text 急襲レート
 * @desc 時間帯に適用する急襲レート。1.0で変更無し。
 * @type number
 * @decimals 2
 * @min 0.00
 */

(() => {
    const pluginName = "Kapu_DayAndNight";
    const parameters = PluginManager.parameters(pluginName);
    const storeTimeRangeVariableId = Number(parameters["storeTimeRangeVariableId"]) || 0;
    const storeWeatherVariableId = Number(parameters["storeWeatherVariableId"] || 0);
    const timeRangeEntries = [ null ];

    /**
     * 時間帯データを分析する。
     * 
     * @param {number} id 番号
     * @param {string} str パラメータ文字列
     * @returns {TimeRangeData} 時間帯データ
     */
    const _parseTimeRangeData = function(id, str) {
        try {
            const obj = JSON.parse(str);
            const onSwitchId = Number(obj.onSwitchId) || 0;
            const offSwitchId = Number(obj.offSwitchId) || 0;
            const brightness = (Number(obj.brightness) || 0).clamp(0, 255);
            const colorTone = JSON.parse(obj.colorTone).map(str => Number(str) || 0);
            while (colorTone.length < 4) {
                colorTone.push(255);
            }

            return {
                id:id,
                name:obj.name,
                onSwitchId:onSwitchId,
                offSwitchId:offSwitchId,
                brightness:brightness,
                colorTone:colorTone
            };
        }
        catch (e) {
            console.error(e);
            return { 
                id:id,
                name:"",
                onSwitchId:0,
                offSwitchId:0,
                brightness:255,
                colorTone:[255,255,255,255]
            };
        }
    };
   
    timeRangeEntries[1].push( _parseTimeRangeData(1, parameters["moning"] || "{}"));
    timeRangeEntries[2].push( _parseTimeRangeData(2, parameters["noon"] || "{}"));
    timeRangeEntries[3].push( _parseTimeRangeData(3, parameters["evening"] || "{}"));
    timeRangeEntries[4].push( _parseTimeRangeData(4, parameters["night"] || "{}"));
    timeRangeEntries[5].push( _parseTimeRangeData(5, parameters["midNight"] || "{}"));

    const weatherEntries = [ null, ];
    /**
     * 時間帯データを分析する。
     * 
     * @param {number} id 番号
     * @param {number} type タイプ
     * @param {string} str パラメータ文字列
     * @returns {WeatherData} 時間帯データ
     */
     const _parseWeatherData = function(id, type, str) {
        try {
            const obj = JSON.parse(str);
            const onSwitchId = Number(obj.onSwitchId) || 0;
            const offSwitchId = Number(obj.offSwitchId) || 0;
            const brightness = (Number(obj.brightness) || 0).clamp(0, 255);
            const colorTone = JSON.parse(obj.colorTone).map(str => Number(str) || 0);
            while (colorTone.length < 4) {
                colorTone.push(255);
            }

            return {
                id:id,
                name:obj.name,
                type:type,
                onSwitchId:onSwitchId,
                offSwitchId:offSwitchId,
                brightness:brightness,
                colorTone:colorTone
            };
        }
        catch (e) {
            console.error(e);
            return { 
                id:id,
                name:"",
                type:type,
                onSwitchId:0,
                offSwitchId:0,
                brightness:255,
                colorTone:[255,255,255,255]
            };
        }
    };

    weatherEntries.push(_parseWeatherData(1, "none", parameters["sunny"] || "{}"));
    weatherEntries.push(_parseWeatherData(2, "rain", parameters["rain"] || "{}"));
    weatherEntries.push(_parseWeatherData(3, "storm", parameters["storm"] || "{}"));
    weatherEntries.push(_parseWeatherData(4, "snow", parameters["snow"] || "{}"));


    // Note: Game_Interpreterのインスタンスを得るため、ラムダ式は使用しない。
    PluginManager.registerCommand(pluginName, "changeTimeRange", function(args) {
        const interpreter = this;
        const timeRange = Number(args.timeRange) || Game_Map.TIMERANGE_NOON;
        const duration = Number(args.duration) || 120;
        $gameMap.changeTimeRange(timeRange, duration);
        const isWait = (args.isWait === undefined) ? false : (args.isWait === "true");
        if (isWait) {
            interpreter.wait(duration);
        }
    });

    // Note: Game_Interpreterのインスタンスを得るため、ラムダ式は使用しない。
    PluginManager.registerCommand(pluginName, "changeWeather", function(args) {
        const interpreter = this;
        const weather = Number(args.weather) || Game_Map.WEATHER_SUNNY;
        const power = Number(args.power) || 1;
        const duration = Number(args.duration) || 120;
        $gameMap.changeWeather(weather, power, duration);
        const isWait = (args.isWait === undefined) ? false : (args.isWait === "true");
        if (isWait) {
            interpreter.wait(duration);
        }
    });

    PluginManager.registerCommand(pluginName, "changeEffectEnable", args => {
        const isTimeRangeEnabled = (args.isTimeRangeEnabled === undefined) ? false : (args.isTimeRangeEnabled === "true");
        const isWeatherEnabled = (args.isWeatherEnabled === undefined) ? false : (args.isWeatherEnabled === "true");
        $gameMap.setTimeRangeEnable(isTimeRangeEnabled);
        $gameMap.setWeatherEnable(isWeatherEnabled);
    });


    //------------------------------------------------------------------------------
    // Game_Map
    //
    Game_Map.TIMERANGE_MONING = 1; // 朝
    Game_Map.TIMERANGE_NOON = 2; // 昼
    Game_Map.TIMERANGE_EVENING = 3; // 夕方
    Game_Map.TIMERANGE_NIGHT = 4; // 夜
    Game_Map.TIMERANGE_MIDNIGHT = 5; // 深夜

    Game_Map.WEATHER_SUNNY = 1; // 晴れ(天候エフェクト"none")
    Game_Map.WEATHER_RAIN = 2; // 雨(天候エフェクト"rain"")
    Game_Map.WEATHER_STORM = 3; // 嵐(天候エフェクト"storm")
    Game_Map.WEATHER_SNOW = 4; // 天候(天候エフェクト"snow"")

    const _Game_Map_initialize = Game_Map.prototype.initialize;
    /**
     * Game_Mapを初期化する。
     */
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.call(this);
        this._isTimeRangeEffectEnabled = true; // マップのノートタグによってON/OFFされるフラグ
        this._isTimeRangeEnabled = true; // システム全体のコントロール
        this._isWeatherEffectEnabled = true;// マップのノートタグによってON/OFFされるフラグ
        this._isWeatherEnabled = true; // システム全体のコントロール
        this._timeRange = Game_Map.TIMERANGE_NOON; // 日中
        this._weather = Game_Map.WEATHER_SUNNY; // 晴れ
        this._weatherPower = 1; // 天候の強さ
        this._weatherEffectRegions = []; // 天候ON/OFF領域ID
        this._weatherEnableAtRegion = true; // 領域による天候ON/OFF状態
        this.onTimeRangeEnter();
        this.onWeatherEnter();
        this.applyTimeRangeAndWeatherEffects(0);
    };

    /**
     * 時間帯を変更する。
     * 
     * @param {number} timeRange 時間帯
     * @param {number} duration 変化にかける時間[フレーム数]。0にすると即座に適用
     */
    Game_Map.prototype.changeTimeRange = function(timeRange, duration) {
        if (this._timeRange !== timeRange) {
            this.onTimeRangeLeave()
            this._timeRange = timeRange;
            this.onTimeRangeEnter();
            this.applyTimeRangeAndWeatherEffects(duration);
        }
    };

    /**
     * 天候を変更する。
     * 
     * @param {number} weather 
     * @param {number} power 
     * @param {boolean} duration 変化にかける時間[フレーム数]。0にすると即座に適用
     */
    Game_Map.prototype.changeWeather = function(weather, power, duration) {
        if ((this._weather !== weather) || (this._weatherPower !== power)) {
            this.onWeatherLeave();
            this._weather = weather;
            this._weatherPower = power;
            this.onWeatherEnter();
            this.applyTimeRangeAndWeatherEffects(duration);
        }
    };

    /**
     * 時間帯がONになるときの処理を行う。
     */
    Game_Map.prototype.onTimeRangeEnter = function() {
        const timeRange = timeRangeEntries[this._timeRange];
        if (timeRange) {
            if (timeRange.onSwitchId > 0) {
                $gameSwitches.setValue(timeRange.onSwitchId, true);
            }
        } else {
            // ここに来てはいけない
            console.error(pluginName + ":Unknown time range. " + this._timeRange);
        }
        if (storeTimeRangeVariableId > 0) {
            const value = (timeRange) ? timeRange.id : 0;
            $gameVariables.setValue(storeTimeRangeVariableId, value);
        }
    };

    /**
     * 時間帯がOFFになるときの処理を行う。
     */
    Game_Map.prototype.onTimeRangeLeave = function() {
        const timeRange = timeRangeEntries[this._timeRange];
        if (timeRange) {
            if (timeRange.offSwitchId > 0) {
                $gameSwitches.setValue(timeRange.offSwitchId, false);
            }
        }
    };
    /**
     * 天候がONになるときの処理を行う。
     */
    Game_Map.prototype.onWeatherEnter = function() {
        const weather = weatherEntries[this._weather];
        if (weather) {
            if (weather.onSwitchId > 0) {
                $gameSwitches.setValue(weather.onSwitchId, true);
            }
        } else {
            // ここに来てはいけない
            console.error(pluginName + ":Unknown weather. " + this._weather);
        }
        if (storeWeatherVariableId > 0) {
            const value = (weather) ? weather.id : 0;
            $gameVariables.setValue(storeWeatherVariableId, value);
        }
    };

    /**
     * 天候がOFFになるときの処理を行う。
     */
    Game_Map.prototype.onWeatherLeave = function() {
        const weather = weatherEntries[this._weather];
        if (weather) {
            if (weather.offSwitchId > 0) {
                $gameSwitches.setValue(weather.offSwitchId, false);
            }
        }
    };



    /**
     * 時間帯エフェクトを適用するかどうかを得る。
     * 
     * @returns {number} 適用する場合にはtrue, それ以外はfalse
     */
    Game_Map.prototype.isApplyTimeRangeEffects = function() {
        return this._isTimeRangeEffectEnabled && this._isTimeRangeEnabled;
    };

    /**
     * 天候エフェクトを適用するかどうかを得る。
     * 
     * @returns {number} 適用する場合にはtrue, それ以外はfalse.
     */
    Game_Map.prototype.isApplyWeatherEffects = function() {
        return this._isWeatherEnabled && this._isTimeRangeEnabled;
    };

    const _Game_Map_setup = Game_Map.prototype.setup;
    /**
     * マップをセットアップする。
     * 
     * @param {number} mapId マップID
     */
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        if ($dataMap) {
            this.setupTimeRangeAndWeatherEffects();
        }
    };

    /**
     * 時間帯と天候エフェクトの有効/無効をセットアップする。
     */
    Game_Map.prototype.setupTimeRangeAndWeatherEffects = function() {
        this._isTimeRangeEffectEnabled = $dataMap.meta.timeRangeEffect || false;
        const weatherEffect = $dataMap.meta.weatherEffect;
        if (weatherEffect) {
            this._isWeatherEffectEnabled = true;
            this._weatherEffectRegions = [];
            if (typeof weatherEffect === "string") {
                const ids = weatherEffect.split(",").map(str => Number(str) || 0);
                for (const id of ids) {
                    if (!this._weatherEffectRegions.includes(id)) {
                        this._weatherEffectRegions.push(id);
                    }
                }
            }
        } else {
            this._isWeatherEffectEnabled = false;
            this._weatherEffectRegions = [];
        }
    };

    /**
     * マップの時間帯機能が有効かどうかを得る。
     * 
     * @returns {boolean} 時間帯機能が有効な場合にはtrue, それ以外はfalse
     */
    Game_Map.prototype.isTimeRangeEnabled = function() {
        return this._isTimeRangeEnabled;
    };

    /**
     * マップの時間帯機能が有効かどうかを設定する。
     * 
     * Note: 設定は保存される。
     * Note: マップが日付・天候エフェクト有効な場合に、エフェクトを欠けたくない時にfalseに設定する。
     * 
     * @param {boolean} isEnabled 時間帯機能が有効な場合にはtrue, それ以外はfalse
     */
    Game_Map.prototype.setTimeRangeEnable = function(isEnabled) {
        if (this._isTimeRangeEnabled !== isEnabled) {
            this._isTimeRangeEnabled = isEnabled;
            if (this._isTimeRangeEnabled) {
                this.applyTimeRangeAndWeatherEffects(0);
            }
        }
    };

    /**
     * マップの天候機能が有効かどうかを取得する。
     * 
     * @returns {boolean} 天候機能が有効な場合にはtrue, それ以外はfalse.
     */
    Game_Map.prototype.isWeatherEnabled = function() {
        return this._isWeatherEnabled;
    };

    /**
     * マップの天候機能が有効かどうかを設定する。
     * 
     * Note: 設定は保存される。
     * Note: マップが日付・天候エフェクト有効な場合に、エフェクトを欠けたくない時にfalseに設定する。
     * 
     * @param {boolean} isEnabled 天候機能が有効な場合にはtrue, それ以外はfalse.
     */
    Game_Map.prototype.setWeatherEnable = function(isEnabled) {
        if (this._isWeatherEnabled !== isEnabled) {
            this._isWeatherEnabled = isEnabled;
            if (this._isWeatherEnabled) {
                this.applyTimeRangeAndWeatherEffects(0);
            }
        }
    };


    /**
     * 時間帯と天候エフェクトを反映させる。
     * 
     * @param {number} duration 変化に要する時間[フレーム数]。0で即座に適用。
     */
    Game_Map.prototype.applyTimeRangeAndWeatherEffects = function(duration) {
        let colorTone = null;
        if (this.isApplyTimeRangeEffects()) {
            const timeRange = timeRangeEntries[this._timeRange];
            if (timeRange) {
                const brightness = timeRange.brightness;
                colorTone = timeRange.colorTone.clone();
                $gameScreen.changeDarknessFilterBrightness(brightness, duration);
            }
        }
        if (this.isApplyWeatherEffects()) {
            const weather = this.currentWeather();
            if (weather) {
                const brightness = Math.round(brightness * weather.brightness / 255);
                const type = weather.type;
                const power = this._weatherPower;
                if (colorTone) {
                    for (let i = 0; i < 4; i++) {
                        colorTone[i] = Math.round((colorTone[i] + weather.colorTone[i]) / 2);
                    }
                } else {
                    colorTone = weather.colorTone.clone();
                }
                $gameScreen.changeWeather(type, power, duration);
            }
        }
        if (colorTone) {
            $gameScreen.startTint(colorTone, duration);
        }
    };

    /**
     * 適用するべき現在の天候を得る。
     * 
     * @returns {object} 天候データ
     */
    Game_Map.prototype.currentWeather = function() {
        if (this._weatherEnableAtRegion) {
            return weatherEntries[this._weather];
        } else {
            return weatherEntries[Game_Map.WEATHER_SUNNY];
        }
    };

    const _Game_Map_refresh = Game_Map.prototype.refresh;
    /**
     * マップの状態をを更新する。
     */
    Game_Map.prototype.refresh = function() {
        _Game_Map_refresh.call(this);
        this.applyTimeRangeAndWeatherEffects(0);
    };

    const _Game_Map_update = Game_Map.prototype.update;

    /**
     * Game_Mapを更新する。
     * 
     * @param {boolean} sceneActive シーンがアクティブかどうか
     */
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.call(this, sceneActive);
        this.updateWeatherRegion();
    };
    /**
     * 領域による天候状態を更新する。
     */
    Game_Map.prototype.updateWeatherRegion = function() {
        const isEnabled = (this._weatherEffectRegions.length > 0)
                ? this._weatherEffectRegions.includes($gamePlayer.regionId())
                : true;
        if (this._weatherEnableAtRegion !== isEnabled) {
            this._weatherEnableAtRegion = isEnabled;
            this.applyTimeRangeAndWeatherEffects(0);
        }
    };
})();