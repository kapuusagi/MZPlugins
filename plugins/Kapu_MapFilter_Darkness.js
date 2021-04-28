/*:ja
 * @target MZ 
 * @plugindesc マップ暗闇フィルタ
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_MapFilterManager
 * @orderAfter Kapu_MapFilterManager
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
 * @help 
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
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 
 */

// Note : GLSLで以下を試す。
//        gl_FragColorを設定しないシェーダーが組めるのか。
//        その場合、何が表示されるか。

(() => {
    const pluginName = "Kapu_MapFilter_Darkness";
    // const parameters = PluginManager.parameters(pluginName);

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
    // MapDarknessFilter
    /**
     * MapDarknessFilter
     * うまくうごくかわからん。
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
        this._lightSources = [];
    };

    /**
     * 光源をクリアする。
     */
    MapDarknessFilter.prototype.clearLightSources = function() {
        this._lightSourceBrightness = [];
    };

    /**
     * 光源を追加する。
     * 
     * @param {number} x 光源X
     * @param {number} y 光源Y
     * @param {number} brightness 輝度
     */
    MapDarknessFilter.prototype.addLightSource = function(x, y, brightness) {

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
                "varying vec2      vTextureCoord;" +
                "" +
                "const float redScale   = 0.298912;" +
                "const float greenScale = 0.586611;" +
                "const float blueScale  = 0.114478;" +
                "const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);" +
                "" +
                "void main(void){" +
                "    vec4 smpColor = texture2D(uSampler, vTextureCoord);" +
                "    float grayColor = dot(smpColor.rgb, monochromeScale);" +
                "    smpColor = vec4(vec3(grayColor), 1.0);" +
                "    gl_FragColor = smpColor;" +
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
        PIXI.Filter.prototype.apply.call(this, ...arguments);

        // let renderTarget = filterManager.getFilterTexture();
        // this._xFilter.apply(filterManager, input, renderTarget);
        // this._yFilter.apply(filterManager, renderTarget, output);
        // filterManager.returnFilterTexture(renderTarget);
    };
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
     * 光源の強さを得る。
     * 
     * @returns {number} 光源の強さ
     */
    Game_Character.prototype.lightSourceBrightness = function() {
        return this._lightSourceBrightness;
    };


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
                filter.addLightSource($gamePlayer.screenX(), $gamePlayer.screenY(), $gamePlayer.lightSourceBrightness());
                // 光源追加
                const events = $gameMap.events();
                for (const event of events) {
                    filter.addLightSource(event.screenX(), event.screenY(), event.lightSourceBrightness());
                }
                // const vehicles = $gameMap.vehicles();
                // for (const vahicle of vehicles) {
                //     // 乗り物が表示されていたら光源セット。
                // }
            }
        }
    };    
    //------------------------------------------------------------------------------
    // MapFilterManager
    MapFilterManager.registerFilter(MapFilterManager.FILTER_DARKNESS, MapDarknessFilter,
        [ ] );



})();