/*:ja
 * @target MZ 
 * @plugindesc マップ暗闇フィルタ
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_MapFilterManager
 * @orderAfter Kapu_MapFilterManager
 * @orderAfter Kapu_Base_ParamName
 * 
 * @command setEnable
 * @text フィルタON/OFF
 * @desc フィルタのON/OFFを設定する。
 * 
 * @arg enabled
 * @text 有効にする
 * @desc 有効にする場合にはtrue, それ以外はfalse
 * @type boolean
 * @default false
 * 
 * 
 * @command setFilterBrightness
 * @text 暗闇輝度変更
 * @desc 暗闇の輝度を変更する。
 * 
 * @arg brightness
 * @text 輝度
 * @desc 輝度(0～255)。255にすると全表示。0にすると範囲外が真っ暗。
 * @type number
 * @default 0
 * @min 0
 * @max 255
 * 
 * @arg duration
 * @text 変更時間
 * @desc 変更に要する時間。単位はフレーム数。0にすると即座に適用。
 * @type number
 * @default 0
 * 
 * @arg isWait
 * @text 変更を待つ
 * @desc 変更を待つ場合にはtrue, 待たない場合にはfalse
 * @type boolean
 * @default true
 * 
 * @command changeEventBrightness
 * @text イベントの光源強度変更
 * @desc イベントの光源強度を変更する。（マップを切り替えると設定は消える。切り替えても保持したいならば、ノートタグと変数を使用すること）
 * 
 * @arg eventId
 * @text イベントID
 * @desc イベントID
 * @type number
 * @default 0
 * 
 * @arg variableId
 * @text 光源の強さとして使用する変数ID
 * @desc 光源の強さとして使用する変数ID (マップを切り替えると設定は破棄されることに注意)
 * @type variableId
 * @default 0
 * 
 * @arg brightness
 * @text 光源の強さ
 * @desc 光源の強さ。変数が指定されている場合には変数が優先される。
 * @type number
 * @default 0
 * @min 0
 * 
 * 
 * 
 * @command changeVehicleBrightness
 * @text 乗り物光源量設定
 * @desc 乗り物の光源量をデフォルトから変更する。(光源量は保存される)
 * 
 * @arg type
 * @text 乗り物タイプ
 * @desc 設定する乗り物のタイプ
 * @type select
 * @option 小型船
 * @value boat
 * @option 大型船
 * @value ship
 * @option 飛行船
 * @option airship
 * 
 * @arg brightnessGetOff
 * @text 光源の強さ（非乗船時）
 * @desc 非乗船時、マップに表示されるときの光源の強さ。-1で変更無し。
 * @type number
 * @default 0
 * @min -1
* 
 * @arg brightnessGetOn
 * @text 光源の強さ（非乗船時）
 * @desc 乗船時、マップに表示されるときの光源の強さ。-1で変更無し。
 * @type number
 * @default 0
 * @min -1
 * 
 * @arg immidiately
 * @text 即座に適用
 * @desc 光源強度を即座に適用する場合にはtrue,ふわっと切り替わるようにするならfalse
 * @type boolean
 * @default false
 * 
 * 
 * 
 * @param defaultBrightness
 * @text 輝度
 * @desc アクター標準時の輝度と、サーチ時のターゲット輝度
 * @type number
 * @default 64
 * 
 * @param eventSearchAbilityId
 * @text ターゲット探索アビリティID
 * @desc ターゲット探索アビリティID
 * @type number
 * @default 105
 * 
 * @param textTraitEventSearch
 * @text イベントサーチ特性名
 * @desc イベントサーチ特性名
 * @type string
 * @default 探知
 * 
 * @param lightBrightnessAbilityId
 * @text パーティー光源輝度アビリティID
 * @desc パーティー光源輝度アビリティID
 * @type number
 * @default 106
 * 
 * @param textTraitLightBrightness
 * @text パーティー光源特性名
 * @desc パーティー光源特性名
 * @type string
 * @default 照明
 * 
 * @param brightnessOfBoatGetOff
 * @text ボートの光源の強さ(非乗船時)
 * @desc ボートの光源の強さ(非乗船時)
 * @type number
 * @default 0
 * 
 * @param brightnessOfBoatGetOn
 * @text ボートの光源の強さ(乗船時)
 * @desc ボートの光源の強さ(乗船時)
 * @type number
 * @default 256
 * 
 * @param brightnessOfShipGetOff
 * @text 船の光源の強さ(非乗船時)
 * @desc 船の光源の強さ(非乗船時)
 * @type number
 * @default 0
 * 
 * @param brightnessOfShipGetOn
 * @text 船の光源の強さ(乗船時)
 * @desc 船の光源の強さ(乗船時)
 * @type number
 * @default 384
 * 
 * @param brightnessOfAirshipGetOff
 * @text 飛行船の光源の強さ(非乗船時)
 * @desc 飛行船の光源の強さ(非乗船時)
 * @type number
 * @default 0
 * 
 * @param brightnessOfAirshipGetOn
 * @text 飛行船の光源の強さ(乗船時)
 * @desc 飛行船の光源の強さ(乗船時)
 * @type number
 * @default 512
 * 
 * @help 
 * プレイヤーと指定したイベントの周囲だけ見えるようにするプラグインです。
 * 光が届かない場所で、プレイヤーの視界を制限するような仕組みを実現するためのものです。
 * 
 * ■ 使用時の注意
 * あんまり試していないけれど、光源が多くなると処理が重くなる(当たり前)。
 * 
 * ■ プラグイン開発者向け
 * なし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * フィルタのON/OFF
 *     フィルタの有効/無効を設定する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/武器/防具/ステート
 *   <searchLevel:level#>
 *     暗闇フィルタ有効時のサーチレベルをlevel#に設定する。
 *   <lightBrightness:brightness#>
 *     暗闇フィルタ上のパーティーを中心とした照明範囲をbrightness#に設定する。
 * イベント
 *   <lightSource:brightness#>
 *     暗闇フィルタ上で、このイベントをbrightnessの輝度で光らせる。
 *   <lightSource:\v[id#]>
 *     暗闇フィルタ上で、このイベントをid#の変数値の輝度で光らせる。
 *   <searchLevel:level#>
 *     暗闇フィルタ有効時、発見されるかどうかのレベル。
 *     パーティーのサーチレベル以下のものだけ、ピックアップされる。
 *   <lightSourceColor:r#,g#,b#>
 *     光源の色。r,g,bともに0～255の範囲。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.3.0 フィルタ順によっては正しく描画されない不具合を修正した。
 *               描画範囲外の光源はレンダリングから外すようにした。
 * Version.0.2.0 光源色を設定できるようにした。
 * Version.0.1.0 新規作成
 */
(() => {
    const pluginName = "Kapu_MapFilter_Darkness";
    const parameters = PluginManager.parameters(pluginName);
    const defaultBrightness = Number(parameters["defaultBrightness"]) || 64;
    
    Game_Party.ABILITY_EVENT_SEARCH = parameters["eventSearchAbilityId"] || 0;
    if (!Game_Party.ABILITY_EVENT_SEARCH) {
        console.log("Game_Party.ABILITY_EVENT_SEARCH is not valid.");
    }
    Game_Party.ABILITY_LIGHT_BRIGHTNESS = parameters["lightBrightnessAbilityId"] || 0;
    if (!Game_Party.ABILITY_LIGHT_BRIGHTNESS) {
        console.log("Game_Party.ABILITY_LIGHT_BRIGHTNESS is not valid.");
    }

    MapFilterManager.FILTER_DARKNESS = "Darkness";

    /**
     * 真偽値を得る。
     * 
     * @param {object} valueStr 値文字列
     * @returns {boolean} 真偽値
     */
    const _parseBoolean = function(valueStr) {
        if (typeof valueStr === "undefined") {
            return undefined;
        } else if (typeof valueStr === "string") {
            if (valueStr) {
                return valueStr === "true";
            } else {
                return undefined;
            }
        } else {
            return Boolean(valueStr);
        }
    };
    PluginManager.registerCommand(pluginName, "setEnable", args => {
        const enabled = _parseBoolean(args.enabled);
        if (enabled) {
            MapFilterManager.activate(MapFilterManager.FILTER_DARKNESS);
        } else {
            MapFilterManager.deactivate(MapFilterManager.FILTER_DARKNESS);
        }
    });

    PluginManager.registerCommand(pluginName, "setFilterBrightness", function(args) {
        const interpreter = this;
        const brightness = Math.round(Number(args.brightness) || 0).clamp(0, 255);
        const duration = Number(args.duration) || 0;
        const isWait = (args.isWait === undefined) ? false : (args.isWait === "true");
        $gameScreen.changeDarknessFilterBrightness(brightness, duration);
        if (isWait) {
            interpreter.wait(duration);
        }
    });

    PluginManager.registerCommand(pluginName, "changeEventBrightness", args => {
        const eventId = Number(args.eventId) || 0;
        const event = $gameMap.event(eventId);
        if (event) {
            const variableId = Number(args.variableId) || 0;
            const brightness = Number(args.brightness) || 0;
            const immidiately = (args.immidiately === undefined) ? false : (args.immidiately === "true");
            event.changeLightSourceBrightness(variableId, brightness, immidiately);
        }
    });

    PluginManager.registerCommand(pluginName, "changeVehicleBrightness", args => {
        const type = args.type || "none";
        const vehicle = $gameMap.vehicle(type);
        if (vehicle) {
            const brightnessGetOff = Number(args.brightnessGetOff) || -1;
            if (brightnessGetOff >= 0) {
                vehicle.setLightSourceBrightnessGetOff(brightnessGetOff);
            }
            const brightnessGetOn = Number(args.brightnessGetOn) || -1;
            if (brightnessGetOn >= 0) {
                vehicle.setLightSourceBrightnessGetOn(brightnessGetOn);
            }
        }

    });

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * ノートタグを処理する。
     * 
     * @param {object} obj データ
     */
     const _processNoteTag = function(obj) {
        if (Game_Party.ABILITY_EVENT_SEARCH && obj.meta.searchLevel) {
            const searchLevel = Math.floor(Number(obj.meta.searchLevel) || 0);
            if (searchLevel > 0) {
                obj.traits.push({ 
                    code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
                    dataId:Game_Party.ABILITY_EVENT_SEARCH, 
                    value:searchLevel
                });
            }
        }
        if (Game_Party.ABILITY_LIGHT_BRIGHTNESS && obj.meta.lightBrightness) {
            const brightness = Math.floor(Number(obj.meta.lightBrightness));
            if (brightness > 0) {
                obj.traits.push({ 
                    code:Game_BattlerBase.TRAIT_PARTY_ABILITY, 
                    dataId:Game_Party.ABILITY_LIGHT_BRIGHTNESS, 
                    value:brightness
                });
            }
        }
    };

    DataManager.addNotetagParserActors(_processNoteTag);
    DataManager.addNotetagParserClasses(_processNoteTag);
    DataManager.addNotetagParserWeapons(_processNoteTag);
    DataManager.addNotetagParserArmors(_processNoteTag);
    DataManager.addNotetagParserStates(_processNoteTag);

    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._partyAbilities && Game_Party.ABILITY_EVENT_SEARCH) {
        TextManager._partyAbilities[Game_Party.ABILITY_EVENT_SEARCH] = {
            name: parameters["textTraitEventSearch"] || "",
            value: TextManager.traitValueMax,
            str: TextManager.traitValueInt
        };
    }
    if (TextManager._partyAbilities && Game_Party.ABILITY_LIGHT_BRIGHTNESS) {
        TextManager._partyAbilities[Game_Party.ABILITY_LIGHT_BRIGHTNESS] = {
            name: parameters["textTraitLightBrightness"] || "",
            value: TextManager.traitValueMax,
            str: TextManager.traitValueInt
        };
    }
    //------------------------------------------------------------------------------
    // DarknessBackgroundFilter
    /**
     * 背景を描画する。
     * 最小輝度を表現するフィルタ。
     */
    function DarknessBackgroundFilter() {
        this.initialize(...arguments);  
    }

    DarknessBackgroundFilter.prototype = Object.create(PIXI.Filter.prototype);
    DarknessBackgroundFilter.prototype.constructor = DarknessBackgroundFilter;

    /**
     * DarknessBackgroundFilterを初期化する。
     */
    DarknessBackgroundFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._fragmentSrc());
        this.uniforms.brightness = 0.0;
        this._brightness = 0;


    };
    Object.defineProperties(DarknessBackgroundFilter.prototype, {
        /**
         * 輝度(0～255)
         */
        brightness: {
            get: function() { return this._brightness; },
            set: function(value) {
                if (this._brightness !== value) {
                    this._brightness = value;
                    this.uniforms.brightness = (value / 255.0).clamp(0.0, 1.0);
                }
            }
        },
    });

    /**
     * バーテックスシェーダーのソースを得る。
     * 
     * @returns {string} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
    DarknessBackgroundFilter.prototype._vertexSrc = function() {
        const src = null;
        return src;
    };
    /**
     * フラグメントシェーダのソースを得る。
     * 
     * @returns {string} フラグメントシェーダーのソース。フラグメントシェーダーがない場合にはnull
     */
    DarknessBackgroundFilter.prototype._fragmentSrc = function() {
        const src = 
                "precision mediump float;" +
                "" +
                "uniform sampler2D uSampler;" +
                "varying vec2 vTextureCoord;" +
                "uniform float brightness;" +
                "" +
                "void main(void){" +
                "    vec4 smpColor = texture2D(uSampler, vTextureCoord);" +
                "    vec4 rgba = smpColor * brightness;" +
                "    gl_FragColor = vec4(rgba.x, rgba.y, rgba.z, 1.0);" +
                "}";
        return src;
    };    
    //------------------------------------------------------------------------------
    // DarknessLightSourceFilter
    /**
     * 暗闇中の光源をレンダリングするためのフィルタ
     */
    function DarknessLightSourceFilter() {
        this.initialize(...arguments);
    }

    DarknessLightSourceFilter.prototype = Object.create(PIXI.Filter.prototype);
    DarknessLightSourceFilter.prototype.constructor = DarknessLightSourceFilter;

    /**
     * DarknessLightSourceFilterを初期化する。
     */
    DarknessLightSourceFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._fragmentSrc());
        this.uniforms.sourcePoint = [0.5, 0.5];
        this.uniforms.brightness = 0.1;
        this.uniforms.lightColor = [255,255,255,255];
        this.uniforms.boxWidth = 100;
        this.uniforms.boxHeight = 100;
    };
    /**
     * バーテックスシェーダーのソースを得る。
     * 
     * @returns {string} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
     DarknessLightSourceFilter.prototype._vertexSrc = function() {
        const src = null;
        return src;
    };
    /**
     * フラグメントシェーダのソースを得る。
     * 
     * Note : 光源輝度(brightness)を単純な照らせる範囲として扱い、
     *        光源中央からの距離(distance)を超えると見えなくなる（a=0)
     *        境界部分は今のところ線形(傾き1)でぼかしている。
     * 
     * 
     * @returns {string} フラグメントシェーダーのソース。フラグメントシェーダーがない場合にはnull
     */
     DarknessLightSourceFilter.prototype._fragmentSrc = function() {
        const src = 
                "precision mediump float;" +
                "" +
                "uniform sampler2D uSampler;" +
                "varying vec2 vTextureCoord;" +
                "uniform vec2 sourcePoint;" +
                "uniform float brightness;" +
                "uniform vec4 lightColor;" +
                "uniform float boxWidth;" +
                "uniform float boxHeight;" +
                "uniform float time;" +
                "" +
                "void main(void){" +
                "    vec4 smpColor = texture2D(uSampler, vTextureCoord);" +
                "    vec2 texturePos = vec2(vTextureCoord.x * boxWidth, vTextureCoord.y * boxHeight);" +
                "    vec2 sourcePos = vec2(sourcePoint.x, sourcePoint.y);" +
                "    float distance = distance(sourcePos, texturePos) * (0.95 + 0.1 * sin(" + Math.PI + " * time));" +
                "    float a = cos(" + Math.PI + " * clamp(distance / brightness, 0.0, 1.0));" +
                "    vec4 rgba = smpColor * a * lightColor / 255.0;" +
                "    gl_FragColor = vec4(rgba.x, rgba.y, rgba.z, a);" +
                "}";
        return src;
    };
    Object.defineProperties(DarknessLightSourceFilter.prototype, {
        /**
         * 光源座標
         * @constant {number[2]}
         */
        sourcePoint: {
            get: function() { return this.uniforms.sourcePoint; },
            set: function(value) { this.uniforms.sourcePoint = value; }
        },
        /**
         * 光源輝度(1～255)
         * @constant {number}
         */
        brightness: {
            get: function() { return this.uniforms.brightness; },
            set: function(value) { this.uniforms.brightness = Math.max(1, value); }
        },
        /**
         * 光源の色
         * Array<number> [R,G,B,A]
         * 各0～255
         * @constant {number}
         */
        lightColor: {
            get: function() { return this.uniforms.lightColor; },
            set: function(value) { this.uniforms.lightColor = value; }
        },
        /**
         * 画面の幅
         * @constant {number}
         */
        boxWidth: {
            get: function() { return this.uniforms.boxWidth; },
            set: function(value) { this.uniforms.boxWidth = value; }
        },

        /**
         * 画面の高さ
         * @constant {number}
         */
        boxHeight: {
            get: function() { return this.uniforms.boxHeight; },
            set: function(value) { this.uniforms.boxHeight = value; }
        },

        /**
         * 時間[sec]
         * @constant {number}
         */
        time: {
            get: function() { return this.uniforms.time;},
            set: function(value) { this.uniforms.time = value; }
        }





    });
    //------------------------------------------------------------------------------
    // MapDarknessFilter
    /**
     * MapDarknessFilter
     */
    function MapDarknessFilter() {
        this.initialize(...arguments);
    }

    MapDarknessFilter.prototype = Object.create(PIXI.Filter.prototype);
    MapDarknessFilter.prototype.constructor = MapDarknessFilter;

    /**
     * MapDarknessFilterを初期化する。
     */
    MapDarknessFilter.prototype.initialize = function() {
        PIXI.Filter.call(this);
        this._lightSources = [];
        this._backgroundFilter = new DarknessBackgroundFilter();
        this._backgroundFilter.brightness = 0;
        this._lightSourceFilter = new DarknessLightSourceFilter();

        this._time = 0;
    };

    /**
     * 光源をクリアする。
     */
    MapDarknessFilter.prototype.clearLightSources = function() {
        this._lightSources = [];
    };

    /**
     * 光源を追加する。
     * 
     * @param {number} x 光源X
     * @param {number} y 光源Y
     * @param {number} brightness 輝度
     * @param {Array<Number>} 光源の色
     */
    MapDarknessFilter.prototype.addLightSource = function(x, y, brightness, color) {
        this._lightSources.push({ point:[x, y], brightness:brightness, color:color });
    };

    /**
     * フィルタを適用する。
     * 
     * @param {PIXI.FilterManager} filterManager 
     * @param {PIXI.RenderTexture} input 入力レンダリングターゲット
     * @param {PIXI.RenderTexture} output 出力レンダリングターゲット
     */
    MapDarknessFilter.prototype.apply = function(filterManager, input, output) {
        // まず背景をレンダリングする。
        this._backgroundFilter.apply(filterManager, input, output);

        this._lightSourceFilter.boxWidth = Graphics.boxWidth;
        this._lightSourceFilter.boxHeight = Graphics.boxHeight;
        this._lightSourceFilter.time = this._time;

        for (const lightSource of this._lightSources) {
            this._lightSourceFilter.sourcePoint = lightSource.point;
            this._lightSourceFilter.brightness = lightSource.brightness;
            this._lightSourceFilter.lightColor = lightSource.color;
            this._lightSourceFilter.apply(filterManager, input, output);
        }
    };

    Object.defineProperties(MapDarknessFilter.prototype, {
        /**
         * 輝度(0～255)
         * @constant {number}
         */
        minBrightness: {
            get: function() { return this._backgroundFilter.brightness; },
            set: function(value) {
                if (this._backgroundFilter.brightness !== value) {
                    this._backgroundFilter.brightness = value;
                }
            }
        },
        /**
         * 時間[sec]
         * @constant {number}
         */
        time: {
            get: function() { return this._time; },
            set: function(value) { this._time = value; }
        }
    });
    //------------------------------------------------------------------------------
    // Game_Character
    const _Game_Character_initMembers = Game_Character.prototype.initMembers;
    /**
     * Game_Characterのメンバを初期化する。
     */
    Game_Character.prototype.initMembers = function() {
        _Game_Character_initMembers.call(this);
        this._lightSourceBrightness = 0;
        this._lightSourceColor = [255, 255, 255, 0];
    };

    /**
     * 光源の強さ設定する。
     * 
     * @param {number} brightness 輝度
     */
    Game_Character.prototype.setLightBrightness = function(brightness) {
        this._lightSourceBrightness = brightness;
    };

    /**
     * 現在の光源の強さを得る。
     * 
     * Note: 現在の光源の強さは、フレーム毎に光源の強さに近づくようになっている。
     * 
     * @returns {number} 光源の強さ
     */
    Game_Character.prototype.lightSourceBrightness = function() {
        return this._lightSourceBrightness;
    };

    const _Game_Character_update = Game_Character.prototype.update;
    /**
     * 更新する。
     */
    Game_Character.prototype.update = function() {
        _Game_Character_update.call(this);
        this.updateLightSource();
    };

    /**
     * 強さを更新する。
     */
    Game_Character.prototype.updateLightSource = function() {
        const targetBrightness = this.lightSourceTargetBrightness();
        if (this._lightSourceBrightness < targetBrightness) {
            this._lightSourceBrightness++;
        } else if (this._lightSourceBrightness > targetBrightness) {
            this._lightSourceBrightness--;
        }
    };

    /**
     * 光源の強さを得る。
     * 
     * @returns {number} 光源の強さ
     */
    Game_Character.prototype.lightSourceTargetBrightness = function() {
        return this._lightSourceBrightness;
    };

    /**
     * 光源の色を得る。
     * 
     * @returns {Array<Number>} 光源の色
     */
    Game_Character.prototype.lightSourceColor = function() {
        return this._lightSourceColor;
    };

    /**
     * 光源レンダリング位置にあるかどうかを得る。
     * 
     * @returns {boolean} 光源レンダリング位置にある場合にはtrue, それ以外はfalse.
     */
    Game_Character.prototype.isLightSourceRenderPosition = function() {
        const x = this.screenX();
        const y = this.screenY();
        const brightness = this.lightSourceBrightness();
        return (((x + brightness) >= 0) && ((x - brightness) <= Graphics.boxWidth)
                && ((y + brightness) >= 0) && ((y - brightness) <= Graphics.boxHeight));
    };

    //------------------------------------------------------------------------------
    // Game_Event
    const _Game_Event_initMembers = Game_Event.prototype.initMembers;
    /**
     * Game_Eventオブジェクトのメンバを初期化する。
     */
    Game_Event.prototype.initMembers = function() {
        _Game_Event_initMembers.call(this);
        this._searchLevel = 9999;
    };

    const _Game_Event_initialize = Game_Event.prototype.initialize;
    /**
     * Game_Eventオブジェクトを初期化する
     * 
     * @param {number} mapId マップID
     * @param {number} eventId イベントID
     */
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        this.initLightSourceBrightness();
    };

    /**
     * 光源を初期化する。
     */
    Game_Event.prototype.initLightSourceBrightness = function() {
        const event = this.event();
        if (event.meta.lightSource) {
            let variableId = 0;
            let brightness = 0;
            if (event.meta.lightSource.match(/\\v\[(\d+)\]/)) {
                variableId = Number(RegExp.$1);
            } else {
                brightness = Number(event.meta.lightSource);
            }
            this.changeLightSourceBrightness(variableId, brightness, true);
        } else {
            this.changeLightSourceBrightness(0, 0, true);
        }
        if (event.meta.searchLevel) {
            this._searchLevel = Math.floor(Number(event.meta.searchLevel) || 9999);
        }
        if (event.meta.lightSourceColor) {
            const array = event.meta.lightSourceColor.split(",").map(str => Number(str));
            const r = Number(array[0] || 255).clamp(0, 255);
            const g = Number(array[1] || 255).clamp(0, 255);
            const b = Number(array[2] || 255).clamp(0, 255);
            this._lightSourceColor = [r, g, b, 255];
        }
        this.refresh();
    };


    /**
     * 光源の強さを得る。
     * 
     * @returns {number} 光源の強さ
     */
    Game_Event.prototype.lightSourceTargetBrightness = function() {
        if (this._erased) {
            return 0;
        } else {
            const variableBrightness = (this._lightSourceVariableId > 0) ? $gameVariables.value(this._lightSourceVariableId) : 0;
            const searchBrightness = (this._searchLevel <= $gameParty.eventSearchLevel()) ? defaultBrightness : 0;
            const fixedBrightness = this._lightSourceFixedBrightness;
            return Math.max(variableBrightness, searchBrightness, fixedBrightness);
        }
    };

    /**
     * 光源の強さを設定する。
     * 
     * @param {number} variableId 変数ID
     * @param {number} brightness 輝度
     * @param {boolean} immidiately 即座に変更する場合にはtrue, それ以外はfalse
     */
    Game_Event.prototype.changeLightSourceBrightness = function(variableId, brightness, immidiately) {
        this._lightSourceVariableId = variableId;
        this._lightSourceFixedBrightness = brightness;
        if (immidiately) {
            const targetBrightness = this.lightSourceTargetBrightness();
            this.setLightBrightness(targetBrightness);
        }
    };

    //------------------------------------------------------------------------------
    // Game_Player
    /**
     * 光源の強さを得る。
     * 
     * @returns {number} 光源の強さ
     */
    Game_Player.prototype.lightSourceTargetBrightness = function() {
        return $gameParty.lightBrightness();
    };

    //------------------------------------------------------------------------------
    // Game_Vehicle
    const _Game_Vehicle_initialize = Game_Vehicle.prototype.initialize;
    /**
     * Game_Vehicleを初期化する。
     * 
     * @param {string} type タイプ("boat", "ship", "airship")
     */
    Game_Vehicle.prototype.initialize = function(type) {
        _Game_Vehicle_initialize.call(this, type);
        this.initLightSourceBrightness();
    };

    /**
     * 光源の強さを初期化する。
     */
    Game_Vehicle.prototype.initLightSourceBrightness = function() {
        let getOffBrightness = 0;
        let getOnBrightness = 0;
        switch (this._type) {
            case "boat":
                getOffBrightness = Number(parameters["brightnessOfBoatGetOff"]) || 0;
                getOnBrightness = Number(parameters["brightnessOfBoatGetOn"]) || 256;
                break;
            case "ship":
                getOffBrightness = Number(parameters["brightnessOfShipGetOff"]) || 0;
                getOnBrightness = Number(parameters["brightnessOfShipGetOn"]) || 384;
                break;
            case "airship":
                getOffBrightness = Number(parameters["brightnessOfAirshipGetOff"]) || 0;
                getOnBrightness = Number(parameters["brightnessOfAirshipGetOn"]) || 512;
                break;
        }
        this._lightSourceBrightnessGetOff = getOffBrightness;
        this._lightSourceBrightnessGetOn = getOnBrightness;
    };

    /**
     * 光源の強さを得る。
     * 
     * @returns {number} 光源の強さ
     */
    Game_Vehicle.prototype.lightSourceTargetBrightness = function() {
        if (this._driving) {
            return this._lightSourceBrightnessGetOn;
        } else {
            return this._lightSourceBrightnessGetOff;
        }
    };

    /**
     * 光源の強さを設定する。
     * 
     * @param {number} brightnessGetOff 非乗船時輝度 
     */
    Game_Vehicle.prototype.setLightSourceBrightnessGetOff = function(brightnessGetOff) {
        this._lightSourceBrightnessGetOff = brightnessGetOff;
    };

    /**
     * 光源の強さを設定する。
     * 
     * @param {number} brightnessGetOn 乗船時輝度
     */
     Game_Vehicle.prototype.setLightSourceBrightnessGetOn = function(brightnessGetOn) {
        this._lightSourceBrightnessGetOn = brightnessGetOn;
    };



    //------------------------------------------------------------------------------
    // Game_Party
    if (Game_Party.ABILITY_EVENT_SEARCH) {
        /**
         * サーチレベルを得る。
         * 
         * @returns {number} サーチレベル。
         */
        Game_Party.prototype.eventSearchLevel = function() {
            return this.partyTraitsSumMax(Game_Party.ABILITY_EVENT_SEARCH);
        };
    } else {
        /**
         * サーチレベルを得る。
         * 
         * @returns {number} サーチレベル。
         */
        Game_Party.prototype.eventSearchLevel = function() {
            return 0;
        };
    }
    if (Game_Party.ABILITY_LIGHT_BRIGHTNESS) {
        /**
         * 暗闇探索時の輝度を得る。
         */
        Game_Party.prototype.lightBrightness = function() {
            return Math.max(this.partyTraitsSumMax(Game_Party.ABILITY_LIGHT_BRIGHTNESS), defaultBrightness);
        };
    } else {
        /**
         * 暗闇探索時の輝度を得る。
         */
         Game_Party.prototype.lightBrightness = function() {
            return defaultBrightness;
        };
    }
    //------------------------------------------------------------------------------
    // Game_Screen
    const _Game_Screen_clear = Game_Screen.prototype.clear;
    /**
     * 各種パラメータを初期化する。
     */
    Game_Screen.prototype.clear = function() {
        _Game_Screen_clear.call(this);
        this.clearDarkness();
    };

    /**
     * 暗闇フィルタ用輝度を設定する。
     * 
     * @returns {number} 輝度
     */
    Game_Screen.prototype.darknessFilterBrightness = function() {
        return this._darknessFilterBrightness;
    };

    /**
     * 暗闇エフェクトをクリアする。
     */
    Game_Screen.prototype.clearDarkness = function() {
        this._darknessFilterBrightness = 255;
        this._darknessFilterBrightnessTarget = 255;
        this._darknessFilterBrightnessDuration = 0;
    };
    const _Game_Screen_update = Game_Screen.prototype.update;
    /**
     * Game_Screenを更新する。
     * 
     * Note: 画面エフェクトの遷移などを処理する。
     */
    Game_Screen.prototype.update = function() {
        _Game_Screen_update.call(this);
        this.updateDarknessFilterBrightness();
    };

    /**
     * 暗闇フィルタの暗闇具合を変更する。
     * 
     * @param {number} brightness 輝度(255で全表示、0で黒)
     * @param {number} duration 遷移に要する時間[フレーム数]。0で即時適用
     */
    Game_Screen.prototype.changeDarknessFilterBrightness = function(brightness, duration) {
        this._darknessFilterBrightnessTarget = brightness;
        this._darknessFilterBrightnessDuration = duration;
        if (duration === 0) {
            this._darknessFilterBrightness = brightness;
        }        
    };

    /**
     * 暗闇フィルタ用輝度パラメータを更新する。
     */
    Game_Screen.prototype.updateDarknessFilterBrightness = function() {
        if (this._darknessFilterBrightnessDuration > 0) {
            const d = this._darknessFilterBrightnessDuration;
            this._darknessFilterBrightness = (this._darknessFilterBrightness * (d - 1) + this._darknessFilterBrightnessTarget) / d;
            this._darknessFilterBrightnessDuration--;
        }
    };

    //------------------------------------------------------------------------------
    // Spriteset_Map
    const _Spriteset_Map_initialize = Spriteset_Map.prototype.initialize;
    /**
     * Spriteset_Mapを初期化する。
     */
    Spriteset_Map.prototype.initialize = function() {
        _Spriteset_Map_initialize.call(this);
        this._darknessFilter = MapFilterManager.filter(MapFilterManager.FILTER_DARKNESS);
    };

    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    /**
     * マップのスプライトセットを更新する。
     */
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        this.updateDarknessFilter();
    };

    /**
     * 暗闇フィルタの暗闇の明るさを更新する。
     */
    Spriteset_Map.prototype.updateDarknessFilter = function() {
        if (this._darknessFilter) {
            this._darknessFilter.minBrightness = $gameScreen.darknessFilterBrightness();
        }
    };
    //------------------------------------------------------------------------------
    // Scene_Map
    const _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    /**
     * メインの更新処理をする。
     */
    Scene_Map.prototype.updateMain = function() {
        _Scene_Map_updateMain.call(this);
        if (MapFilterManager.isActive(MapFilterManager.FILTER_DARKNESS)) {
            const filter = MapFilterManager.filter(MapFilterManager.FILTER_DARKNESS);
            if (filter) {
                filter.clearLightSources();
                if (!$gamePlayer.isTransparent() && $gamePlayer.isLightSourceRenderPosition()) {
                    filter.addLightSource($gamePlayer.screenX(), $gamePlayer.screenY() - 16, 
                            $gamePlayer.lightSourceBrightness(), $gamePlayer.lightSourceColor());
                }
                // 光源追加
                const events = $gameMap.events();
                for (const event of events) {
                    if (!event.isTransparent() && (event.lightSourceBrightness() > 0) && event.isLightSourceRenderPosition()) {
                        filter.addLightSource(event.screenX(), event.screenY() - 24, 
                                event.lightSourceBrightness(), event.lightSourceColor());
                    }
                }
                const vehicles = $gameMap.vehicles();
                for (const vahicle of vehicles) {
                    if (!vahicle.isTransparent() && vahicle.isLightSourceRenderPosition()) {
                        // 乗り物が表示されていたら光源セット。
                        filter.addLightSource(vahicle.screenX(), vahicle.screenY() - 24,
                                vahicle.lightSourceBrightness(), vahicle.lightSourceColor());
                    }
                }
            }
        }
    };

    //------------------------------------------------------------------------------
    // MapFilterManager
    MapFilterManager.registerFilter(MapFilterManager.FILTER_DARKNESS, MapDarknessFilter,
        [ ] );
    MapFilterManager.activate(MapFilterManager.FILTER_DARKNESS);


})();
