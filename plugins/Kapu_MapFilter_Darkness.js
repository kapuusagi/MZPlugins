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
 * なし。
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
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成
 */

// Note : GLSLで以下を試す。
//        gl_FragColorを設定しないシェーダーが組めるのか。
//        その場合、何が表示されるか。

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
     * @param {Object} valueStr 値文字列
     * @return {Boolean} 真偽値
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
     * @param {Object} obj データ
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
        PIXI.Filter.call(this, this._vertexSrc(), this._fragmentSrc());
        this.uniforms.sourcePoint = [0.5, 0.5];
        this.uniforms.brightness = 0.1;
        this.uniforms.boxWidth = 100;
        this.uniforms.boxHeight = 100;
        this.uniforms.minBrightness = 0.0;
        this._lightSources = [];
        this._minBrightness = 0;

        this.time = 0;
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
     */
    MapDarknessFilter.prototype.addLightSource = function(x, y, brightness) {
        this._lightSources.push({ point:[x, y], brightness:brightness });
    };

    /**
     * バーテックスシェーダーのソースを得る。
     * 
     * @return {String} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
    MapDarknessFilter.prototype._vertexSrc = function() {
        const src = null;
        return src;
    };
    /**
     * フラグメントシェーダのソースを得る。
     * 
     * @return {String} フラグメントシェーダーのソース。フラグメントシェーダーがない場合にはnull
     */
    MapDarknessFilter.prototype._fragmentSrc = function() {
        const src = 
                "precision mediump float;" +
                "" +
                "uniform sampler2D uSampler;" +
                "varying vec2 vTextureCoord;" +
                "uniform vec2 sourcePoint;" +
                "uniform float brightness;" +
                "uniform float boxWidth;" +
                "uniform float boxHeight;" +
                "uniform float time;" +
                "uniform float minBrightness;" +
                "" +
                "void main(void){" +
                "    vec4 smpColor = texture2D(uSampler, vTextureCoord);" +
                "    vec2 texturePos = vec2(vTextureCoord.x * boxWidth, vTextureCoord.y * boxHeight);" +
                "    vec2 sourcePos = vec2(sourcePoint.x, sourcePoint.y);" +
                "    float distance = distance(sourcePos, texturePos);" +
                "    float rate = 0.95 + 0.1 * sin(" + Math.PI + " * time);" +
                "    float a = clamp((1.0 - distance * rate / brightness), minBrightness, 1.0);" +
                "    vec4 rgba = smpColor * a;" +
                "    gl_FragColor = vec4(rgba.x, rgba.y, rgba.z, a);" +
                "}";
        return src;
    };
    /**
     * フィルタを適用する。
     * 
     * @param {PIXI.FilterManager} filterManager 
     * @param {PIXI.RenderTexture} input 入力レンダリングターゲット
     * @param {PIXI.RenderTexture} output 出力レンダリングターゲット
     */
    MapDarknessFilter.prototype.apply = function(filterManager, input, output) {
        this.uniforms.boxWidth = Graphics.boxWidth;
        this.uniforms.boxHeight = Graphics.boxHeight;
        this.uniforms.time = this.time;

        for (const lightSource of this._lightSources) {
            this.uniforms.sourcePoint = lightSource.point;
            this.uniforms.brightness = lightSource.brightness;
            PIXI.Filter.prototype.apply.call(this, filterManager, input, output);
        }
    };

    Object.defineProperties(MapDarknessFilter.prototype, {
        minBrightness: {
            get: function() { return this._minBrightness; },
            set: function(value) {
                if (this._minBrightness !== value) {
                    this._minBrightness = value;
                    this.uniforms.minBrightness = value / 255.0;
                }
            }
        },
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
        this.refresh();
    };


    /**
     * 光源の強さを得る。
     * 
     * @returns {number} 光源の強さ
     */
    Game_Event.prototype.lightSourceTargetBrightness = function() {
        const variableBrightness = (this._lightSourceVariableId > 0) ? $gameVariables.value(this._lightSourceVariableId) : 0;
        const searchBrightness = (this._searchLevel <= $gameParty.eventSearchLevel()) ? defaultBrightness : 0;
        const fixedBrightness = this._lightSourceFixedBrightness;
        return Math.max(variableBrightness, searchBrightness, fixedBrightness);
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
                    filter.addLightSource($gamePlayer.screenX(), $gamePlayer.screenY() - 16, $gamePlayer.lightSourceBrightness());
                }
                // 光源追加
                const events = $gameMap.events();
                for (const event of events) {
                    if (!event.isTransparent() && event.lightSourceBrightness() > 0) {
                        filter.addLightSource(event.screenX(), event.screenY() - 24, event.lightSourceBrightness());
                    }
                }
                const vehicles = $gameMap.vehicles();
                for (const vahicle of vehicles) {
                    if (!vahicle.isTransparent()) {
                        // 乗り物が表示されていたら光源セット。
                        filter.addLightSource(vahicle.screenX(), vahicle.screenY() - 24, vahicle.lightSourceBrightness());
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