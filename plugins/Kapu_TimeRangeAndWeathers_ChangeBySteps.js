/*:ja
 * @target MZ 
 * @plugindesc マップを歩くと時間帯と天候が変わるようにするプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_TimeRangeAndWeathers
 * @orderAfter Kapu_TimeRangeAndWeathers
 * 
 * @command changeStepEnable
 * @text 歩数による変更制御ON/OFF
 * @desc 歩数による時間帯/天候制御をON/OFFします。
 * 
 * @arg isChangeTimeRange
 * @text 時間帯変更
 * @desc 歩数による時間帯変更を有効にする場合にはtrue
 * @type boolean
 * @default true
 * 
 * @arg isChangeWeather
 * @text 天候変更
 * @desc 歩数による天候変更を有効にする場合にはtrue
 * @type boolean
 * @default true
 * 
 * 
 * @param stepsOfMorning
 * @text 経過歩数(朝)
 * @desc 朝の時間帯を維持する歩数
 * @type number
 * @default 16
 * 
 * @param stepsOfNoon
 * @text 経過歩数(昼)
 * @desc 昼の時間帯を維持する歩数
 * @type number
 * @default 128
 * 
 * @param stepsOfEvening
 * @text 経過歩数(夕方)
 * @desc 夕方の時間帯を維持する歩数
 * @type number
 * @default 16
 * 
 * @param stepsOfNight
 * @text 経過歩数(夜)
 * @desc 夜の時間帯を維持する歩数
 * @type number
 * @default 48
 * 
 * @param stepsOfMidNight
 * @text 経過歩数(深夜)
 * @desc 深夜の時間帯を維持する歩数
 * @type number
 * @default 48
 * 
 * 
 * @param stepsOfWether
 * @text 天候歩数
 * @desc 天候を維持する歩数
 * @type number
 * @default 32
 * 
 * @param dayilyCommonEventId
 * @text 朝になる毎に呼び出すコモンイベント
 * @desc 朝になる毎に呼び出すコモンイベント
 * @type common_event
 * @default 0
 * 
 * @param effectDuration
 * @text エフェクト時間
 * @desc 時間帯/天候エフェクトを反映させるとき、遷移にかける時間[フレーム数]
 * @type number
 * @default 120
 * 
 * @param initialStepTimeRangeChange
 * @text 開始時ステップによる時間変更有効状態
 * @desc ニューゲーム開始時歩数による時間帯遷移を有効にする場合にはtrue
 * @type boolean
 * @default false
 * 
 * @param initialStepWeatherChange
 * @text 開始時ステップによる天候変更有効状態
 * @desc ニューゲーム開始時歩数による時間帯遷移を有効にする場合にはtrue
 * @type boolean
 * @default false
 * 
 * 
 * @help 
 * マップを歩くと時間帯と天候が変わるようにするプラグイン。
 * 朝になる毎にプラグインパラメータで指定したコモンイベントを呼び出す。
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
 * マップ
 *   <changeTimeRangeBySteps>
 *     このノートタグを指定したマップで歩行すると時間帯が移り変わる。
 *   <changeWeatherBySteps>
 *     このノートタグを指定したマップで歩行すると天候が移り変わる。
 *   <regionWeather:regionId#,weather#(power#)=weight#,weather#(power#)=weight#...>
 *     領域 regionId# のとりうる天候を指定する。複数指定可。
 *     regionId: {number} 領域ID regionId=0とすると、全領域で発生する天候。
 *     weather: {number} 天候番号(0:変更無し,1:晴れ,2:雨,3:嵐,4:雪), または天候名("none","sunny","rain","storm","snow")
 *     power: {number} 天候エフェクトの強さ
 *     weight : {number} 発生頻度。高いほど発生頻度が上がる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_TimeRangeAndWeathers_ChangeBySteps";
    const parameters = PluginManager.parameters(pluginName);
    const dayilyCommonEventId = Math.round(Number(parameters["dayilyCommonEventId"]) || 0);
    const stepsOfWether = Number(parameters["stepsOfWether"]) || 32;
    const effectDuration = Math.max(0, Math.round(parameters["effectDuration"]) || 60);
    const initialStepTimeRangeChange = (parameters["initialStepTimeRangeChange"] === undefined)
            ? false : (parameters["initialStepTimeRangeChange"] === "true");
    const initialStepWeatherChange = (parameters["initialStepWeatherChange"] === undefined)
            ? false : (parameters["initialStepWeatherChange"] === "true");


    
    $dataTimeRanges[Game_Map.TIMERANGE_MORNING].stepCount = Number(parameters["stepsOfMorning"]) || 16;
    $dataTimeRanges[Game_Map.TIMERANGE_NOON].stepCount = Number(parameters["stepsOfNoon"]) || 128;
    $dataTimeRanges[Game_Map.TIMERANGE_EVENING].stepCount = Number(parameters["stepsOfEvening"]) || 16;
    $dataTimeRanges[Game_Map.TIMERANGE_NIGHT].stepCount = Number(parameters["stepsOfNight"]) || 64;
    $dataTimeRanges[Game_Map.TIMERANGE_MIDNIGHT].stepCount = Number(parameters["stepsOfMidNight"]) || 64;

    PluginManager.registerCommand(pluginName, "changeStepEnable", args => {
        const isChangeTimeRange = (args.isChangeTimeRange === undefined)
                ? false : (args.isChangeTimeRange === "true");
        const isChangeWeather = (args.isChangeWeather === undefined)
                ? false : (args.isChangeWeather === "true");
        $gameMap.setControlTimeRangeByStep(isChangeTimeRange);
        $gameMap.setControlWeatherByStep(isChangeWeather);
    });

    /**
     * 天候エントリを得る。
     * 
     * @param {string} str エントリ文字列
     * @returns {object} 天候エントリ
     */
    const _parseWeatherEntry = function(str) {
        const pattern = /(.+)\((\d+)\)=([\d.]+)/;
        const regExp = str.match(pattern);
        if (regExp) {
            let weather;
            switch (regExp[1]) {
                case "none":
                    weather = 0;
                    break;
                case "sunny":
                    weather = Game_Map.WEATHER_SUNNY;
                    break;
                case "rain":
                    weather = Game_Map.WEATHER_RAIN;
                    break;
                case "storm":
                    weather = Game_Map.WEATHER_STORM;
                    break;
                case "snow":
                    weather = Game_Map.WEATHER_SNOW;
                    break;
                default:
                    weather = Number(regExp[1]) || 0;
                    break;
            }
            const power = Number(regExp[2]);
            const weight = Number(regExp[3]);
            return {
                weather:weather,
                power:power,
                weight:weight
            };
        }

        return null;
    };

    //------------------------------------------------------------------------------
    // Game_Map
    const _Game_Map_initialize = Game_Map.prototype.initialize;
    /**
     * Game_Mapを初期化する。
     */
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.call(this);
        this._changeTimeRangeBySteps = initialStepTimeRangeChange; // 歩行による時間帯操作が有効
        this._changeWeatherBySteps = initialStepWeatherChange; // 歩行による天候操作が有効
        this._changeTimeRangeMap = false; // 歩行による時間帯変更が有効なマップ
        this._changeWeatherMap = false; // 歩行による天候変更が有効なマップ
        this._regionWeathers = [];
    };

    /**
     * 歩数による時間帯変更操作を行うかどうかを設定する。
     * 
     * @param {boolean} isEnabled 操作を行う場合にはtrue, 行わない場合にはfalse.
     */
    Game_Map.prototype.setControlTimeRangeByStep = function(isEnabled) {
        this._changeTimeRangeBySteps = isEnabled;
    };

    /**
     * 歩数による天候操作を行うかどうかを設定する。
     * 
     * @param {boolean} isEnabled 操作を行う場合にはtrue, 行わない場合にはfalse.
     */
    Game_Map.prototype.setControlWeatherByStep = function(isEnabled) {
        this._changeWeatherBySteps = isEnabled;
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
            this._changeTimeRangeMap = $dataMap.meta.changeTimeRangeBySteps || false;
            this._changeWeatherMap = $dataMap.meta.changeWeatherBySteps || false
            this.setupRegionWeathers();
        }
    };
    /**
     * マップの天候リストをセットアップする。
     */
    Game_Map.prototype.setupRegionWeathers = function() {
        this._regionWeathers = [];
        const regExp = /<regionWeather:([^>]*)>/g;
        for (;;) {
            const match = regExp.exec($dataMap.note);
            if (match) {
                const tokens = match[1].split(",");
                if (tokens.length >= 2) {
                    const regionId = Number(tokens[0]) || 0;
                    if (regionId >= 0) {
                        this._regionWeathers[regionId] = [];
                        for (let i = 1; i < tokens.length; i++) {
                            const weatherEntry = _parseWeatherEntry(tokens[i]);
                            if (weatherEntry) {
                                this._regionWeathers[regionId].push(weatherEntry);
                            }
                        }
                    }
                }
            } else {
                break;
            }
        }
    };


    const _Game_Map_onTimeRangeEnter = Game_Map.prototype.onTimeRangeEnter;
    /**
     * 時間帯がONになるときの処理を行う。
     */
    Game_Map.prototype.onTimeRangeEnter = function() {
        _Game_Map_onTimeRangeEnter.call(this);
        if (this._timeRange === Game_Map.TIMERANGE_MORNING) {
            if (dayilyCommonEventId > 0) {
                $gameTemp.reserveCommonEvent(dayilyCommonEventId);
            }
        }
    };



    /**
     * 歩数による時間帯変更が有効かどうかを得る。
     * 
     * @returns {boolean} 有効な場合にはtrue, それ以外はfalse
     */
    Game_Map.prototype.isChangeTimeRangeMap = function() {
        return this._changeTimeRangeBySteps && this._changeTimeRangeMap;
    };

    /**
     * 時刻を維持する歩数を得る。
     * 
     * @returns {number} 歩数
     */
    Game_Map.prototype.stepCountOfTimeRange = function() {
        const timeRange = $dataTimeRanges[this._timeRange];
        return (timeRange) ? timeRange.stepCount : 0;
    };

    /**
     * 天候をランダムに変更する。
     */
    Game_Map.prototype.changeWeatherRandom = function() {
        const weathers = this.weathersOfRegion();
        if (weathers.length > 0) {
            // 天候が変更しうる
            let weightSum = 0;
            for (const weather of weathers) {
                weightSum += weather.weight;
            }
            if (weightSum > 0) {
                let value = Math.randomInt(weightSum);
                for (const weather of weathers) {
                    value -= weather.weight;
                    if (value < 0) {
                        const changeWeather = (weather.weather > 0) ? weather.weather : this._weather;
                        const power = weather.power;
                        this.changeWeather(changeWeather, power, effectDuration);
                        break;
                    }
                }
            }
        }
    };

    /**
     * 現在の位置に対応する天候リストを得る。
     * 
     * @return {Array<object>} 天候リスト
     */
    Game_Map.prototype.weathersOfRegion = function() {
        const regionId = $gamePlayer.regionId();
        const weathers = [];
        if (this._regionWeathers[regionId]) {
            for (const weather of this._regionWeathers[regionId]) {
                weathers.push(weather);
            }
        }
        if (this._regionWeathers[0]) {
            for (const weather of this._regionWeathers[0]) {
                weathers.push(weather);
            }
        }
        return weathers;
    };

    /**
     * 歩数による天候操作が有効かどうかを得る。
     * 
     * @returns {boolean} 有効な場合にはtrue, それ以外はfalse
     */
    Game_Map.prototype.isChangeWeatherMap = function() {
        return this._changeWeatherBySteps && this._changeWeatherMap;
    };

    /**
     * 天候を維持する歩数を得る。
     * 
     * @returns {number} 歩数
     */
    Game_Map.prototype.stepCountOfWeather = function() {
        return stepsOfWether;
    };

    //------------------------------------------------------------------------------
    // Game_Player
    const _Game_Player_initMembers = Game_Player.prototype.initMembers;
    /**
     * メンバーを初期化する。
     * 
     * Note: 基底クラスのコンストラクタから呼び出される。
     */
    Game_Player.prototype.initMembers = function() {
        _Game_Player_initMembers.call(this);
        this._stepCounterOfTimeRange = 0;
        this._stepCounterOfWeather = 0;
    };

    const _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
    /**
     * 移動中でない場合の更新を行う。
     * 
     * Note: 移動中でないというのは、タイルの位置までの移動中かどうか、を表す。
     *       例えば右へ2マス移動する場合を考えたとき、右へ1マス移動したところで1回以上呼び出されることになる。
     * Note: 歩数カウントもここでやる。
     * 
     * @param {boolean} wasMoving 移動したかどうか
     * @param {boolean} sceneActive シーンがアクティブかどうか。
     */
    Game_Player.prototype.updateNonmoving = function(wasMoving, sceneActive) {
        _Game_Player_updateNonmoving.call(this, wasMoving, sceneActive);
        if (wasMoving) {
            const appendCount = Math.pow(2, 4 - this.moveSpeed());
            if ($gameMap.isChangeTimeRangeMap()) {
                this._stepCounterOfTimeRange += appendCount;
                if (this._stepCounterOfTimeRange >= $gameMap.stepCountOfTimeRange()) {
                    $gameMap.changeNextTimeRange(effectDuration);
                    this._stepCounterOfTimeRange = 0;
                }
            }
            if ($gameMap.isChangeWeatherMap()) {
                this._stepCounterOfWeather += appendCount;
                if (this._stepCounterOfWeather >= $gameMap.stepCountOfWeather()) {
                    $gameMap.changeWeatherRandom();
                    this._stepCounterOfWeather = 0;
                }
            }
        }
    };

    const _Game_Player_onRegionChanged = Game_Player.prototype.onRegionChanged;
    /**
     * プレイヤーのリージョンが変わったときの処理を行う。
     */
    Game_Player.prototype.onRegionChanged = function() {
        _Game_Player_onRegionChanged.call(this);
        if ($gameMap.isChangeWeatherMap()) {
            this._stepCounterOfWeather = 0;
            $gameMap.changeWeatherRandom();
        }
    };     


})();