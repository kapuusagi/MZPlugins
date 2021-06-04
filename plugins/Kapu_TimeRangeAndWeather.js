/*:ja
 * @target MZ
 * @plugindesc 昼夜機能プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Map
 * @orderAfter Kapu_Base_Map
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
 * @option 次の時間帯
 * @value -1
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
 * @command changeWeather
 * @text 天候変更
 * @desc 天候を変更する。既に同じ天候・強さであればなにもしない。
 * 
 * @arg weather
 * @text 天候
 * @desc 変更する天候
 * @type select
 * @default 1
 * @option ランダム
 * @value -1
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
 * @param morning
 * @text 朝データ
 * @desc 朝データ
 * @type struct<TimeRangeData>
 * @default {"name":"朝","onSwitchId":"0","offSwitchId":"0","brightness":"255","colorTone":"[-16,-16,0,0]","encountRate":"1.00","surpriseRate":"1.00"}
 * 
 * @param noon
 * @text 昼データ
 * @desc 昼データ
 * @type struct<TimeRangeData>
 * @default {"name":"昼","onSwitchId":"0","offSwitchId":"0","brightness":"255","colorTone":"[0,0,0,0]","encountRate":"1.00","surpriseRate":"1.00"}
 * 
 * @param evening
 * @text 夕方データ
 * @desc 夕方データ
 * @type struct<TimeRangeData>
 * @default {"name":"夕方","onSwitchId":"0","offSwitchId":"0","brightness":"255","colorTone":"[0,-32,-64,0]","encountRate":"1.10","surpriseRate":"1.00"}
 * 
 * @param night
 * @text 夜データ
 * @desc 夜データ
 * @type struct<TimeRangeData>
 * @default {"name":"夜","onSwitchId":"0","offSwitchId":"0","brightness":"128","colorTone":"[-64,-64,-64,0]","encountRate":"1.50","surpriseRate":"1.50"}
 * 
 * @param midNight
 * @text 深夜データ
 * @desc 深夜データ
 * @type struct<TimeRangeData>
 * @default {"name":"深夜","onSwitchId":"0","offSwitchId":"0","brightness":"64","colorTone":"[-64,-64,-64,0]","encountRate":"2.00","surpriseRate":"2.00"}
 * 
 * @param sunny
 * @text 晴れデータ
 * @desc 晴れデータ
 * @type struct<WeatherData>
 * @default {"name":"晴れ","onSwitchId":"0","offSwitchId":"0","brightness":"255","colorTone":"[0,0,0,0]","encountRate":"1.00","surpriseRate":"1.00"}
 * 
 * @param rain
 * @text 雨天データ
 * @desc 雨天データ
 * @type struct<WeatherData>
 * @default {"name":"雨","onSwitchId":"0","offSwitchId":"0","brightness":"180","colorTone":"[-16,-16,0,0]","encountRate":"1.00","surpriseRate":"1.00"}
 * 
 * @param storm
 * @text 嵐データ
 * @desc 嵐データ
 * @type struct<WeatherData>
 * @default {"name":"嵐","onSwitchId":"0","offSwitchId":"0","brightness":"128","colorTone":"[-16,-16,0,0]","encountRate":"1.00","surpriseRate":"2.00"}
 * 
 * @param snow
 * @text 雪データ
 * @desc 雪データ
 * @type struct<WeatherData>
 * @default {"name":"雪","onSwitchId":"0","offSwitchId":"0","brightness":"200","colorTone":"[-16,-16,-16,0]","encountRate":"1.00","surpriseRate":"1.25"}
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
 * @param storeWeatherPowerVariableId
 * @text 変更強度変数ID
 * @desc 天候の強度を格納する変数ID。
 * @type variable
 * @default 0
 * 
 * @param startTimeRangeEnable
 * @text 開始時時間帯機能有効
 * @desc ニューゲーム時に時間帯機能を有効にする場合にはtrue.
 * @type boolean
 * @default false
 * 
 * @param initialTimeRange
 * @text 開始時時間帯
 * @desc ニューゲーム時、最初に設定されている時間帯
 * @type select
 * @default 2
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
 * @param startWeatherEnable
 * @text 開始時天候機能有効
 * @desc ニューゲーム時に天候機能を有効にする場合にはtrue.
 * @type boolean
 * @default false
 * 
 * @param initialWeather
 * @text 開始時天候
 * @desc ニューゲーム時、最初に設定されている天候
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
 * @param weatherEffectDuration
 * @text 天候エフェクト遷移時間
 * @desc 領域をまたいで天候エフェクトが変わるときの遷移時間(フレーム数)
 * @type number
 * @default 30
 * 
 * @help 
 * 昼と夜機能を実現するためのプラグイン。
 * 以下の機能を提供する。
 * 1. 時間帯機能
 * ・朝、昼、夕方 夜、深夜の「時間帯」を持たせることができる。
 *   時間帯はマップエフェクトを主としたものになる。
 * ・「時間帯」はプラグインコマンドを使用するか、補助プラグインにより切り替えることができる。
 * ・「時間帯」に切り替わった時、指定したスイッチをONにすることができる。
 * ・「時間帯」から切り替わった時、指定したスイッチをOFFにすることができる。
 *   「時間帯」にランダムエンカウント率を絡めることができる。
 * ・「時間帯」に不意打ち率補正値を入れることができる。
 *   「時間帯」にランダムエンカウント時のエネミー出現ON/OFFを絡めることができる。
 * ・マップのノートタグにて、昼夜のエフェクトをかけるかどうかを設定することができる。
 * ・時間帯をプラグインパラメータで指定した変数に格納することができる。
 * 
 * 2. 天候機能
 * ・天候状態を持たせることができる。
 *   切り替えはプラグインコマンドを使用するか、補助プラグインにより切り替える。
 * ・天候状態に切り替わった時、指定したスイッチをONにすることが出来る。
 * ・天候状態から切り替わった時、指定したスイッチをOFFにすることが出来る。
 * ・「天候」に不意打ち率補正値を入れることができる。
 *   「天候」にランダムエンカウント率を絡めることができる。
 *   「天候」にランダムエンカウント時のエネミー出現ON/OFFを絡めることができる。
 * ・マップのノートタグにて、天候エフェクトをかけるかどうかを設定することができる。
 *   マップのノートタグにて天候エフェクトをかけるかどうかを設定することができる。
 * ・「天候」をプラグインパラメータで指定した変数に格納することができる。
 * 
 * 歩数で昼夜を切り替えたい場合には、EventAtNumberOfStepsで時間帯変更イベントを呼び出すか、
 * 補助プラグインを導入する。
 * 
 * ■ 使用時の注意
 * Kapu_MapFilter及びKapu_MapFilter_Darknessを使用します。
 * MapFilter_DarknessはON/OFFしないこと。OFFすると、暗闇状態が正常に反映されなくなります。
 * 画面の天候エフェクト/画面のトーンを使用します。
 * イベント等で天候・カラートーンを操作したい場合には、
 * (1)エフェクトON/OFF変更でOFFにする。
 * (2)イベントで使用するエフェクトを適用する。
 *    :
 * (3)イベントが完了したらエフェクトをONにする。
 *    (瞬間的に切り替わるのでフェードアウト->エフェクトON->フェードインを使うのが望ましい)
 * 
 * これはプラグインを使わなくてもインタプリタで実現できそう。というかカスタマイズしたいならインタプリタでゴリゴリ書いた方がいい。
 * 
 * 
 * ■ プラグイン開発者向け
 * 時間帯を表す以下の定数を追加します。
 *  Game_Map.TIMERANGE_MORNING  朝
 *  Game_Map.TIMERANGE_NOON     昼
 *  Game_Map.TIMERANGE_EVENING  夕方
 *  Game_Map.TIMERANGE_NIGHT    夜
 *  Game_Map.TIMERANGE_MIDNIGHT 深夜
 * 
 * 時間帯を変更するには
 * $gameMap.changeTimeRange(timeRange:number, duration:number) : void
 *    timeRange : 変更する時間帯
 *    duration : 変更にかける時間
 * を使用します。
 * 
 * 天候を表す以下の定数を追加します。
 *  Game_Map.WEATHER_SUNNY  晴れ(天候エフェクト"none")
 *  Game_Map.WEATHER_RAIN   雨(天候エフェクト"rain"")
 *  Game_Map.WEATHER_STORM  嵐(天候エフェクト"storm")
 *  Game_Map.WEATHER_SNOW   雪(天候エフェクト"snow"")
 * 
 * 天候を変更するには
 * $gameMap.changeWeather(weather:number, power:number, duration:number) : void
 *    weather : 変更する天気
 *    power : 天気の強さ
 *    duration : 変更にかける時間
 * を使用します。
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
 *     領域指定されていないところはidが0になる。
 * 
 * エネミー
 *   <encountTimeRanges:id#,id#,...>
 *     エンカウントする時間帯をid#,id#,..で指定した時間帯に制限する。
 *     マップのノートタグでtimeRangeEffectが指定されている場合のみ判定する。
 *   <encountWeathers:id#,id#,...>
 *     エンカウントする時間帯をid#,id#,...で指定した時間帯に制限する。
 *     マップのノートタグでweatherEffectが指定されている場合のみ判定する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
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
 * @desc 時間帯に適用するカラートーン。(R,G,B,Gray) R,G,Bは-255～255で0で変化なし。Grayは255で灰色、0で変化なし
 * @type number[]
 * @min -255
 * @max 255
 *
 * @param encountRate
 * @text エンカウントレート
 * @desc 時間帯に適用するエンカウントレート。1.0で変更無し。1未満でエンカウント率減少。
 * @type number
 * @decimals 2
 * @min 0.00
 * 
 * @param surpriseRate
 * @text 不意打ち率
 * @desc 時間帯に適用する急襲レート。1.0で変更無し。1未満で不意打ち率減少。
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
 * @desc 時間帯に適用するカラートーン。(R,G,B,Gray) R,G,Bは-255～255で0で変化なし。Grayは255で灰色、0で変化なし
 * @type number[]
 * @min -255
 * @max 255
 * 
 * @param encountRate
 * @text エンカウントレート
 * @desc 時間帯に適用するエンカウントレート。1.0で変更無し。
 * @type number
 * @decimals 2
 * @min 0.00
 * 
 * @param surpriseRate
 * @text 不意打ち率
 * @desc 時間帯に適用する急襲レート。1.0で変更無し。
 * @type number
 * @decimals 2
 * @min 0.00
 */

(() => {
    const pluginName = "Kapu_TimeRangeAndWeather";

    Game_Map.TIMERANGE_MORNING = 1; // 朝
    Game_Map.TIMERANGE_NOON = 2; // 昼
    Game_Map.TIMERANGE_EVENING = 3; // 夕方
    Game_Map.TIMERANGE_NIGHT = 4; // 夜
    Game_Map.TIMERANGE_MIDNIGHT = 5; // 深夜

    Game_Map.WEATHER_SUNNY = 1; // 晴れ(天候エフェクト"none")
    Game_Map.WEATHER_RAIN = 2; // 雨(天候エフェクト"rain"")
    Game_Map.WEATHER_STORM = 3; // 嵐(天候エフェクト"storm")
    Game_Map.WEATHER_SNOW = 4; // 雪(天候エフェクト"snow"")

    const parameters = PluginManager.parameters(pluginName);
    const storeTimeRangeVariableId = Number(parameters["storeTimeRangeVariableId"]) || 0;
    const storeWeatherVariableId = Number(parameters["storeWeatherVariableId"]) || 0;
    const storeWeatherPowerVariableId = Number(parameters["storeWeatherPowerVariableId"]) || 0;
    const startTimeRangeEnable = (parameters["startTimeRangeEnable"] === undefined)
            ? false : (parameters["startTimeRangeEnable"] === "true");
    const initialTimeRange = Number(parameters["initialTimeRange"]) || Game_Map.TIMERANGE_NOON;
    const startWeatherEnable = (parameters["startWeatherEnable"] === undefined)
            ? false : (parameters["startWeatherEnable"] === "true");
    const initialWeather = Number(parameters["initialWeather"]) || Game_Map.WEATHER_SUNNY;
    const weatherEffectDuration = Number(parameters["weatherEffectDuration"]) || 30;

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
            const colorTone = JSON.parse(obj.colorTone).map(str => (Number(str) || 0).clamp(-255, 255));
            while (colorTone.length < 4) {
                colorTone.push(255);
            }
            if (colorTone[3] < 0) {
                colorTone[3] = 0;
            }
            const encountRate = Math.max(0, Number(obj.encountRate) || 1);
            const surpriseRate = Math.max(0, Number(obj.surpriseRate) || 1);

            return {
                id:id,
                name:obj.name,
                onSwitchId:onSwitchId,
                offSwitchId:offSwitchId,
                brightness:brightness,
                colorTone:colorTone,
                encountRate:encountRate,
                surpriseRate:surpriseRate
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
                colorTone:[0,0,0,0],
                encountRate:1,
                surpriseRate:1
            };
        }
    };
    const timeRangeEntries = [ null ];
    timeRangeEntries[1] = _parseTimeRangeData(1, parameters["morning"] || "{}");
    timeRangeEntries[2] = _parseTimeRangeData(2, parameters["noon"] || "{}");
    timeRangeEntries[3] = _parseTimeRangeData(3, parameters["evening"] || "{}");
    timeRangeEntries[4] = _parseTimeRangeData(4, parameters["night"] || "{}");
    timeRangeEntries[5] = _parseTimeRangeData(5, parameters["midNight"] || "{}");

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
            const colorTone = JSON.parse(obj.colorTone).map(str => (Number(str) || 0).clamp(-255,255));
            while (colorTone.length < 4) {
                colorTone.push(0);
            }
            if (colorTone[3] < 0) {
                colorTone[3] = 0;
            }
            const encountRate = Math.max(0, Number(obj.encountRate) || 1);
            const surpriseRate = Math.max(0, Number(obj.surpriseRate) || 1);

            return {
                id:id,
                name:obj.name,
                type:type,
                onSwitchId:onSwitchId,
                offSwitchId:offSwitchId,
                brightness:brightness,
                colorTone:colorTone,
                encountRate:encountRate,
                surpriseRate:surpriseRate
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
                colorTone:[255,255,255,255],
                encountRate:1,
                surpriseRate:1
            };
        }
    };

    const weatherEntries = [ null, ];
    weatherEntries.push(_parseWeatherData(1, "none", parameters["sunny"] || "{}"));
    weatherEntries.push(_parseWeatherData(2, "rain", parameters["rain"] || "{}"));
    weatherEntries.push(_parseWeatherData(3, "storm", parameters["storm"] || "{}"));
    weatherEntries.push(_parseWeatherData(4, "snow", parameters["snow"] || "{}"));


    // Note: Game_Interpreterのインスタンスを得るため、ラムダ式は使用しない。
    PluginManager.registerCommand(pluginName, "changeTimeRange", function(args) {
        const interpreter = this;
        const timeRange = Number(args.timeRange) || Game_Map.TIMERANGE_NOON;
        const duration = Number(args.duration) || 120;
        if (timeRange < 0) {
            // 次の時間帯
            $gameMap.changeNextTimeRange(duration);
        } else {
            $gameMap.changeTimeRange(timeRange, duration);
        }
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
        if (weather < 0) {
            // ランダム
            const randomWeather = Math.randomInt(5);
            if (randomWeather > 0) {
                $gameMap.changeWeather(randomWeather, power, duration);
            }
        } else {
            $gameMap.changeWeather(weather, power, duration);
        }
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

    /**
     * エネミーデータの遭遇時間帯データを初期化する。
     * 
     * Note: 予めノートタグを処理する方法も考えたが、
     *       起動時のパフォーマンス低下を下げるため、遅延評価で行うこととした。
     *       遭遇判定処理で一度計算したら、後はキャッシュされる。
     * 
     * @param {DataEnemy} enemy エネミー
     */
    const _initEnemyTimeRanges = function(enemy) {
        enemy.encountTimeRanges = [];
        if (enemy.meta.encountTimeRanges) {
            const timeRanges = enemy.meta.encountTimeRanges.split(",").map(token => Number(token) || 0);
            for (const timeRange of timeRanges) {
                if ((timeRange > 0) && !enemy.encountTimeRanges.includes(timeRange)) {
                    enemy.encountTimeRanges.push(timeRange);
                }
            }
        }
    };
    /**
     * エネミーデータの遭遇天候データを初期化する。
     * 
     * Note: 予めノートタグを処理する方法も考えたが、
     *       起動時のパフォーマンス低下を下げるため、遅延評価で行うこととした。
     *       遭遇判定処理で一度計算したら、後はキャッシュされる。
     * 
     */
    const _initEnemyWeathers = function(enemy) {
        enemy.encountWeathers = [];
        if (enemy.meta.encountWeathers) {
            const weathers = enemy.meta.encountWeathers.split(",").map(token => Number(token) || 0);
            for (const weather of weathers) {
                if ((weather > 0) && !enemy.encountWeathers.includes(weather)) {
                    enemy.encountWeathers.push(weather);
                }
            }
        }
    };
    //------------------------------------------------------------------------------
    // DataManager
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    /**
     * New Gameをセットアップする。
     */
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        // 設定されているスイッチ状態を初期化する。
        const timeRange = timeRangeEntries[initialTimeRange];
        if (timeRange && (timeRange.onSwitchId > 0)) {
            $gameSwitches.setValue(timeRange.onSwitchId, true);
        }
        if (storeTimeRangeVariableId > 0) {
            $gameVariables.setValue(storeTimeRangeVariableId, initialTimeRange)
        }
        const weather = weatherEntries[initialWeather];
        if (weather && (weather.onSwitchId > 0)) {
            $gameSwitches.setValue(weather.onSwitchId, true);
        }
        if (storeWeatherVariableId > 0) {
            $gameVariables.setValue(storeWeatherVariableId, initialWeather);
        }
        if (storeWeatherPowerVariableId > 0) {
            $gameVariables.setValue(storeWeatherPowerVariableId, 0);
        }
    };
    //------------------------------------------------------------------------------
    // Game_Map
    //

    const _Game_Map_initialize = Game_Map.prototype.initialize;
    /**
     * Game_Mapを初期化する。
     */
    Game_Map.prototype.initialize = function() {
        _Game_Map_initialize.call(this);
        this._isMapTimeRangeEnabled = true; // マップのノートタグによってON/OFFされるフラグ
        this._isTimeRangeEnabled = startTimeRangeEnable; // システム全体のコントロール
        this._isMapWeatherEnabled = true;// マップのノートタグによってON/OFFされるフラグ
        this._isWeatherEnabled = startWeatherEnable; // システム全体のコントロール
        this._timeRange = initialTimeRange;
        this._weather = initialWeather;
        this._weatherPower = 1; // 天候の強さ
        this._weatherEffectRegions = []; // 天候ON/OFF領域ID
        this._weatherEnableAtRegion = true; // 領域による天候ON/OFF状態
    };
    /**
     * 次の時間帯に遷移させる。
     * 
     * @param {number} duration 変化にかけるフレーム数
     */
    Game_Map.prototype.changeNextTimeRange = function(duration) {
        const nextTimeRange =  (this._timeRange === Game_Map.TIMERANGE_MIDNIGHT)
                ? Game_Map.TIMERANGE_MORNING : (this._timeRange + 1);
        this.changeTimeRange(nextTimeRange, duration);
    };

    /**
     * 時間帯を変更する。
     * 
     * @param {number} timeRange 時間帯
     * @param {number} duration 変化にかける時間[フレーム数]。0にすると即座に適用
     */
    Game_Map.prototype.changeTimeRange = function(timeRange, duration) {
        if (timeRangeEntries[timeRange]) {
            if (this._timeRange !== timeRange) {
                this.onTimeRangeLeave()
                this._timeRange = timeRange;
                this.onTimeRangeEnter();
                this.applyTimeRangeAndWeatherEffects(duration);
            }
        }
    };

    /**
     * 現在の時間帯を得る。
     * 
     * @returns {number} 時間帯
     */
    Game_Map.prototype.timeRange = function() {
        return this._timeRange;
    };

    /**
     * 天候を変更する。
     * 
     * @param {number} weather 
     * @param {number} power 
     * @param {boolean} duration 変化にかける時間[フレーム数]。0にすると即座に適用
     */
    Game_Map.prototype.changeWeather = function(weather, power, duration) {
        if (weatherEntries[weather]) {
            if ((weather !== Game_Map.WEATHER_SUNNY) && (power <= 0)) {
                power = 1;
            }
            if ((this._weather !== weather) || (this._weatherPower !== power)) {
                this.onWeatherLeave();
                this._weather = weather;
                this._weatherPower = power;
                this.onWeatherEnter();
                this.applyTimeRangeAndWeatherEffects(duration);
            }
        }
    };

    /**
     * 天候を得る。
     * 
     * @returns {number} 天候
     */
    Game_Map.prototype.weather = function() {
        return this._weather;
    };
    /**
     * 天候の強さを得る。
     * 
     * @returns {number} 天候の強さ
     */
    Game_Map.prototype.weatherPower = function() {
        return this._weatherPower;
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
        if (storeWeatherPowerVariableId > 0) {
            const value = this._weatherPower;
            $gameVariables.setValue(storeWeatherPowerVariableId, value);
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
        this._isMapTimeRangeEnabled = $dataMap.meta.timeRangeEffect || false;
        const weatherEffect = $dataMap.meta.weatherEffect;
        if (weatherEffect) {
            this._isMapWeatherEnabled = true;
            this._weatherEffectRegions = [];
            if (typeof weatherEffect === "string") {
                const ids = weatherEffect.split(",").map(str => Number(str) || 0);
                for (const id of ids) {
                    if (!this._weatherEffectRegions.includes(id)) {
                        this._weatherEffectRegions.push(id);
                    }
                }
                if (!this._weatherEffectRegions.includes(0)) {
                    this._weatherEffectRegions.push(0);
                }
            }
        } else {
            this._isMapWeatherEnabled = false;
            this._weatherEffectRegions = [];
        }
        this.applyTimeRangeAndWeatherEffects(0);
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
        let colorTone = null; // nullで変化させない。
        let brightness = -1; // -1で変化させない。
        let weatherType = null; // nullで変化させない
        let weatherPower = 0;
        if (this._isTimeRangeEnabled) {
            if (this._isMapTimeRangeEnabled) {
                const timeRange = this.currentTimeRange();
                if (timeRange) {
                    brightness = timeRange.brightness;
                    colorTone = timeRange.colorTone.clone();
                }
            } else {
                brightness = 255;
                colorTone = [0, 0, 0, 0];
            }
        }
        if (this._isWeatherEnabled) {
            if (this._isMapWeatherEnabled) {
                // 天候有効マップ
                const weather = this.currentWeather();
                if (weather) {
                    if (brightness >= 0) {
                        brightness = Math.round(brightness * weather.brightness / 255);
                    } else {
                        brightness = weather.brightness;
                    }
                    weatherType = weather.type;
                    weatherPower = this._weatherPower;
                    if (colorTone) {
                        for (let i = 0; i < 4; i++) {
                            colorTone[i] = Math.round((colorTone[i] + weather.colorTone[i]) / 2);
                        }
                    } else {
                        colorTone = weather.colorTone.clone();
                    }
                }
            } else {
                // 天候無効マップ
                weatherType = "none";
                weatherPower = 0;
                if (brightness < 0) {
                    brightness = 255;
                }
            }
        }
        if (weatherType) {
            $gameScreen.changeWeather(weatherType, weatherPower, duration);
        }
        if (brightness >= 0) {
            $gameScreen.changeDarknessFilterBrightness(brightness, duration);
        }
        if (colorTone) {
            $gameScreen.startTint(colorTone, duration);
        }
    };

    /**
     * 現在の時間帯データを得る。
     * 
     * @returns {object} 時間帯データ
     */
    Game_Map.prototype.currentTimeRange = function() {
        return timeRangeEntries[this._timeRange];
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

    /**
     * 領域による天候状態を更新する。
     * 
     * @param {number} regionId 領域ID
     */
    Game_Map.prototype.setWeatherRegion = function(regionId) {
        const isEnabled = (this._weatherEffectRegions.length > 0)
                ? this._weatherEffectRegions.includes(regionId) : true;
        if (this._weatherEnableAtRegion !== isEnabled) {
            this._weatherEnableAtRegion = isEnabled;
            this.applyTimeRangeAndWeatherEffects(weatherEffectDuration);
        }
    };

    const _Game_Map_rateSurprise = Game_Map.prototype.rateSurprise;
    /**
     * マップの基本不意打ち率を得る。
     * 
     * @returns {number} 不意打ち率
     */
    Game_Map.prototype.rateSurprise = function() {
        return _Game_Map_rateSurprise.call(this) + this.rateSurpriseTimeRange() + this.rateSurpriseWeather();
    }; 

    /**
     * 時間帯による不意打ち率補正値を得る。
     * 
     * @returns {number} 不意打ち率
     */
    Game_Map.prototype.rateSurpriseTimeRange = function() {
        const timeRange = this.currentTimeRange();
        return (this._isMapTimeRangeEnabled && timeRange) ? timeRange.surpriseRate : 0;
    };

    /**
     * 天候による不意打ち率補正値を得る。
     * 
     * @returns {number} 不意打ち率
     */
    Game_Map.prototype.rateSurpriseWeather = function() {
        const weather = this.currentWeather();
        return (this._isMapWeatherEnabled && weather) ? weather.surpriseRate : 0;
    };

    const _Game_Map_encounterProgressValue = Game_Map.prototype.encounterProgressValue;
    /**
     * ランダムエンカウント進捗度を得る。
     * 
     * @param {number} x アクターのx位置
     * @param {number} y アクターのy位置
     * @returns {number} 進捗度
     */
    Game_Map.prototype.encounterProgressValue = function(x, y) {
        return _Game_Map_encounterProgressValue.call(this, x, y)
                * this.encounterProgressValueOfWeather()
                * this.encounterProgressValueOfTimeRange();
    };

    /**
     * 時間帯によるエンカウント率補正値を得る。
     * 
     * @returns {number} エンカウント率補正率
     */
    Game_Map.prototype.encounterProgressValueOfTimeRange = function() {
        const timeRange = this.currentTimeRange();
        return (timeRange) ? timeRange.encountRate : 1;
    };

    /**
     * 時間帯によるエンカウント率補正値を得る。
     * 
     * @returns {number} エンカウント率補正率
     */
    Game_Map.prototype.encounterProgressValueOfWeather = function() {
        const weather = this.currentWeather();
        return (weather) ? weather.encountRate : 1;
    };

    const _Game_Map_isEncountToEnemy = Game_Map.prototype.isEncountToEnemy;
    /**
     * enemyIdで指定されるエネミーと遭遇するかどうかを判定する。
     * 
     * @param {number} enemyId エネミーID
     * @returns {boolean} 遭遇する場合にはtrue, 遭遇しない場合にはfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_Map.prototype.isEncountToEnemy = function(enemyId) {
        return _Game_Map_isEncountToEnemy.call(this, enemyId)
                && this.isEnemyEncountTimeRange(enemyId)
                && this.isEnemyEncountWeather(enemyId);
    };

    /**
     * 時間帯条件でエンカウントするかどうかを得る。
     * 
     * @param {number} enemyId エネミーID
     * @returns {boolean} エンカウントする場合にはtrue, エンカウントしない場合にはfalse
     */
    Game_Map.prototype.isEnemyEncountTimeRange = function(enemyId) {
        if (this._isTimeRangeEnabled && this._isMapTimeRangeEnabled) {
            const enemy = $dataEnemies[enemyId];
            if (enemy) {
                if (!enemy.encountTimeRanges) {
                    _initEnemyTimeRanges(enemy);
                }
                if ((enemy.encountTimeRanges.length > 0) && !enemy.encountTimeRanges.includes(this._timeRange)) {
                    // 遭遇する時間帯が指定されていて、該当する時間帯でない。
                    return false;
                } else {
                    // 時間帯が未指定か、該当する時間帯である。
                    return true;
                }
            } else {
                return false; // エネミーデータ無し。
            }
        } else {
            return true;
        }
    };
    /**
     * 天候条件でエンカウントするかどうかを得る。
     * 
     * @param {number} enemyId エネミーID
     * @returns {boolean} エンカウントする場合にはtrue, エンカウントしない場合にはfalse
     */
    Game_Map.prototype.isEnemyEncountWeather = function(enemyId) {
        if (this._isWeatherEnabled && this._isMapWeatherEnabled) {
            const enemy = $dataEnemies[enemyId];
            if (enemy) {
                if (!enemy.encountWeathers) {
                    _initEnemyWeathers(enemy);
                }
                if ((enemy.encountWeathers.length > 0) && !enemy.encountWeathers.includes(this._weather)) {
                    // 遭遇する天候が指定されていて、該当する天候。
                    return false;
                } else {
                    // 時間帯が未指定か、該当する時間帯である。
                    return true;
                }
            } else {
                return false; // エネミーデータなし
            }
        } else {
            return true;
        }
    };
    //------------------------------------------------------------------------------
    // Game_Player
    const _Game_Player_onRegionChanged = Game_Player.prototype.onRegionChanged;
    /**
     * プレイヤーのリージョンが変わったときの処理を行う。
     */
    Game_Player.prototype.onRegionChanged = function() {
        _Game_Player_onRegionChanged.call(this);
        $gameMap.setWeatherRegion(this.regionId());
    };
    //------------------------------------------------------------------------------
    // Game_Enemy
    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    /**
     * エネミーをセットアップする。
     * 
     * @param {number} enemyId エネミーID
     * @param {number} x X位置
     * @param {number} y Y位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        if (!$gameMap.isEnemyEncountTimeRange(enemyId) || !$gameMap.isEnemyEncountWeather(enemyId)) {
            // 時間帯・天候条件が合わないので参加しない。
            this.hide();
        }
    };
})();