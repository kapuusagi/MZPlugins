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
 * @param defaultBrightness
 * @text 輝度
 * @desc アクター標準時の輝度と、サーチ時のターゲット輝度
 * @type number
 * @default 64
 * 
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
 * Version.0.2.0 光源色を設定できるようにした。
 * Version.0.1.0 新規作成
 */
(() => {
    const pluginName = "Kapu_MapFilter_Darkness";
    const parameters = PluginManager.parameters(pluginName);
    const defaultBrightness = parameters["defaultBrightness"] || 64;
    
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
                "    float a = clamp((1.0 - distance / brightness), 0.0, 1.0);" +
                "    vec4 rgba = smpColor * a * lightColor / 255.0;" +
                "    gl_FragColor = vec4(rgba.x, rgba.y, rgba.z, a);" +
                "}";
        return src;
    };
    Object.defineProperties(DarknessLightSourceFilter.prototype, {
        /**
         * 光源座標
         */
        sourcePoint: {
            get: function() { return this.uniforms.sourcePoint; },
            set: function(value) { this.uniforms.sourcePoint = value; }
        },
        /**
         * 光源輝度(1～255)
         */
        brightness: {
            get: function() { return this.uniforms.brightness; },
            set: function(value) { this.uniforms.brightness = Math.max(1, value); }
        },
        /**
         * 光源の色
         * Array<number> [R,G,B,A]
         * 各0～255
         */
        lightColor: {
            get: function() { return this.uniforms.lightColor; },
            set: function(value) { this.uniforms.lightColor = value; }
        },
        /**
         * 画面の幅
         */
        boxWidth: {
            get: function() { return this.uniforms.boxWidth; },
            set: function(value) { this.uniforms.boxWidth = value; }
        },

        /**
         * 画面の高さ
         */
        boxHeight: {
            get: function() { return this.uniforms.boxHeight; },
            set: function(value) { this.uniforms.boxHeight = value; }
        },

        /**
         * 時間[sec]
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
        minBrightness: {
            get: function() { return this._minBrightness; },
            set: function(value) {
                if (this._)
                if (this._backgroundFilter.brightness !== value) {
                    this._backgroundFilter.brightness = value;
                }
            }
        },
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
     * 光源の強さを得る。
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
        const event = this.event();
        if (event.meta.lightSource) {
            if (event.meta.lightSource.match(/\\v\[(\d+)\]/)) {
                const variableId = Number(RegExp.$1);
                this._lightSourceVariableId = RegExp.$1;
                const brightness = $gameVariables.value(variableId);
                this.setLightBrightness(brightness, true);
                this._lightSourceFixedBrightness = 0;
            } else {
                const brightness = Number(event.meta.lightSource);
                this._lightSourceVariableId = 0;
                this.setLightBrightness(brightness, true);
                this._lightSourceFixedBrightness = brightness;
            }
        } else {
            this._lightSourceVariableId = 0;
            this._lightSourceFixedBrightness = 0;
        }
        if (event.meta.searchLevel) {
            this._searchLevel = Math.floor(Number(event.meta.searchLevel) || 9999);
        }
        if (event.meta.lightSourceColor) {
            const array = event.meta.lightSourceColor.split(',').map(str => Number(str));
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
    // MapFilterManager
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
                if (!$gamePlayer.isTransparent()) {
                    filter.addLightSource($gamePlayer.screenX(), $gamePlayer.screenY() - 16, 
                            $gamePlayer.lightSourceBrightness(), $gamePlayer.lightSourceColor());
                }
                // 光源追加
                const events = $gameMap.events();
                for (const event of events) {
                    if (!event.isTransparent() && event.lightSourceBrightness() > 0) {
                        filter.addLightSource(event.screenX(), event.screenY() - 24, 
                                event.lightSourceBrightness(), event.lightSourceColor());
                    }
                }
                const vehicles = $gameMap.vehicles();
                for (const vahicle of vehicles) {
                    if (!vahicle.isTransparent()) {
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
        [ "minBrightness" ] );



})();
