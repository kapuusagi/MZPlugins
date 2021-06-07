/*:ja
 * @target MZ 
 * @plugindesc プレイヤー位置を中心に、固定長の円形表示範囲にするプラグイン
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
 *  
 * @help 
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
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_MapFilter_CircleFade";
    // const parameters = PluginManager.parameters(pluginName);

    MapFilterManager.FILTER_CIRCLEFADE = "CircleFade"

    PluginManager.registerCommand(pluginName, "setEnable", args => {
        const enabled = (args.enabled === undefined) ? false : (args.enabled === "true");
        if (enabled) {
            MapFilterManager.activate(MapFilterManager.FILTER_CIRCLEFADE);
        } else {
            MapFilterManager.deactivate(MapFilterManager.FILTER_CIRCLEFADE);
        }
    });

    //------------------------------------------------------------------------------
    // MapCircleFadeFilter
    function MapCircleFadeFilter() {
        this.initialize(...arguments);
    }

    MapCircleFadeFilter.prototype = Object.create(PIXI.Filter.prototype);
    MapCircleFadeFilter.prototype.constructor = MapCircleFadeFilter;

    /**
     * MapCircleFadeFilterを初期化する。
     */
    MapCircleFadeFilter.prototypeinitialize = function() {
        PIXI.Filter.call(this, this._vertexSrc(), this._fragmentSrc());
        this.uniforms.sourcePoint = [0.5, 0.5];
        this.uniforms.displayRange = 255;
        this.uniforms.boxWidth = 100;
        this.uniforms.boxHeight = 100;
    };

    /**
     * バーテックスシェーダーのソースを得る。
     * 
     * @returns {string} バーテックシェーダーのソース。バーテックスシェーダーがない場合にはnull.
     */
    MapCircleFadeFilter.prototype._vertexSrc = function() {
        return null;
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
    MapCircleFadeFilter.prototype._fragmentSrc = function() {
        const src = 
                "precision mediump float;" +
                "" +
                "uniform sampler2D uSampler;" +
                "varying vec2 vTextureCoord;" +
                "uniform vec2 sourcePoint;" +
                "uniform float displayRange;" +
                "uniform float boxWidth;" +
                "uniform float boxHeight;" +
                "" +
                "void main(void){" +
                "    vec4 smpColor = texture2D(uSampler, vTextureCoord);" +
                "    vec2 texturePos = vec2(vTextureCoord.x * boxWidth, vTextureCoord.y * boxHeight);" +
                "    vec2 sourcePos = vec2(sourcePoint.x, sourcePoint.y);" +
                "    float distance = distance(sourcePos, texturePos);" +
                "    float a = cos(" + Math.PI + " * clamp(distance / (max(boxWidth, boxHeight) * 2 * displayRange / 255)), 0.0, 1.0));" +
                "    vec4 rgba = smpColor * a;" +
                "    gl_FragColor = vec4(rgba.x, rgba.y, rgba.z, 1.0);" +
                "}";
        return src;
    };
    Object.defineProperties(MapCircleFadeFilter.prototype, {
        /**
         * 光源座標
         * @constant {number[2]}
         */
        sourcePoint: {
            get: function() { return this.uniforms.sourcePoint; },
            set: function(value) { this.uniforms.sourcePoint = value; }
        },
        /**
         * 表示範囲(0～255)
         * @constant {number}
         */
        displayRange: {
            get: function() { return this.uniforms.displayRange; },
            set: function(value) { this.uniforms.displayRange = value; }
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
    });
    //------------------------------------------------------------------------------
    // Scene_Map
    const _Scene_Map_initialize = Scene_Map.prototype.initialize;
    /**
     * Scene_Mapを初期化する。
     */
    Scene_Map.prototype.initialize = function() {
        _Scene_Map_initialize.call(this);
        this._circleFilterDisplayRange = 255;
        this._circleFilterDuration = 0;
        this._circleFilterDisplayRangeTarget = this._circleFilterDisplayRange;
    };
    const _Scene_Map_start = Scene_Map.prototype.start;
    /**
     * Scene_Mapを開始する。
     */
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        filter.boxWidth = Graphics.boxWidth;
        filter.boxHeight = Graphics.boxHeight;
    };

    const _Scene_Map_isFade = Scene_Map.prototype.isFade;
    /**
     * フェード処理中かどうかを得る。
     * 
     * @returns {boolean} フェード処理中の場合にはtrue, それ以外はfalse
     */
    Scene_Map.prototype.isFade = function() {
        return _Scene_Map_isFade.call(this) || (this._circleFilterDuration > 0);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    /**
     * Scene_Mapを更新する。
     */
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateCircleFilterDisplayRange();
    };

    /**
     * 表示範囲を更新する。
     */
    Scene_Map.prototype.updateCircleFilterDisplayRange = function() {
        if (this._circleFilterDuration > 0) {
            const d = this._circleFilterDuration;
            this._circleFilterDisplayRange = this._circleFilterDisplayRange * (d - 1) / d +  this._circleFilterDisplayRangeTarget / d;
            this._circleFilterDuration--;
        }
    };

    /**
     * 丸がどんどん縮まって黒になるフェードアウト処理を開始する。
     * 
    * @param {umber} duration フェードインにかける時間[フレーム数]
     */
    Scene_Map.prototype.startCircleFadeOut = function(duration) {
        this._circleFilterDuration = duration;
        this._circleFilterDisplayRange = 255;
        this._circleFilterDisplayRangeTarget = 0;
    };

    /**
     * 丸からどんどん広がって表示されるフェードイン処理を開始する。
     * 
    * @param {umber} duration フェードインにかける時間[フレーム数]
     */
    Scene_Map.prototype.startCircleFadeIn = function(duration) {
        this._circleFilterDuration = duration;
        this._circleFilterDisplayRange = 0;
        this._circleFilterDisplayRangeTarget = 255;
    };

    const _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    /**
     * メインの更新処理をする。
     */
    Scene_Map.prototype.updateMain = function() {
        _Scene_Map_updateMain.call(this);
        if (MapFilterManager.isActive(MapFilterManager.FILTER_CIRCLEFADE)) {
            const filter = MapFilterManager.filter(MapFilterManager.FILTER_CIRCLEFADE);
            if (filter) {
                const x = ($gamePlayer.isTransparent())
                        ? Graphics.boxWidth / 2
                        : $gamePlayer.screenX() + $gameMap.tileWidth() / 2;
                const y = ($gamePlayer.isTransparent())
                        ? Graphics.boxHeight / 2
                        : $gamePlayer.screenY - $gameMap.tileHeight() / 2
                filter.sourcePoint = [ x, y];
                filter.displayRange = this._circleFilterDisplayRange;
            }
        }
    };
    //------------------------------------------------------------------------------
    // MapFilterManager
    MapFilterManager.registerFilter(MapFilterManager.FILTER_CIRCLEFADE, MapCircleFadeFilter,
        [ ] );
    MapFilterManager.activate(MapFilterManager.FILTER_CIRCLEFADE);
})();