/*:ja
 * @target MZ
 * @plugindesc マップのFilterを管理する。MZ移植
 * @author weakboar kapuusagi
 * @url https://github.com/weakboar/mv_plugin
 * 
 * @param debugEnable
 * @text デバッグ
 * @desc trueにするとデバッグ出力する。
 * @type boolean
 * @default false
 *
 * @help
 * WeakBoar 氏の作成したMVプラグインを元に作成。
 * https://github.com/weakboar/mv_plugin
 * SceneManager._scene._spriteset.filtersに適用するフィルターを管理する。
 * Filterの各パラメータ値の設定は非対応です。
 * セーブ/ロード対応。
 * 
 * ■ 使用時の注意
 * 他のマップフィルタ関連と競合する可能性があります。
 * 
 * ■ プラグイン開発者向け
 * MapFilterManager.apply()をコールして適用すると、
 * Scene_Mapの_spritesetに適用するfiltersを上書きします。
 * そのため、他のマップフィルタ関連と競合する可能性があります。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 WeakBoar氏のMVPluginリポジトリのファイルを元に作成。
 *               動作未確認。
 */

/**
 * MapFilterManager
 * Scene_Mapに適用するフィルタを管理する静的クラス。
 */
function MapFilterManager() {
    throw new Error("This is a static class");
}

(() => {
    const pluginName = "WeakBoar_MapFilterManager";
    const parameters = PluginManager.parameters(pluginName);

    const debugEnable = (typeof parameters["debugEnable"] === "undefined")
            ? true : (parameters["debugEnable"] === "true");

    MapFilterManager._filters =[];

    /**
     * フィルタを登録する。
     * 
     * @param {String} filterName フィルタ識別名
     * @param {Method} constructionMethod 構築メソッド
     */
    MapFilterManager.registerFilter = function(filterName, constructionMethod) {
        if (this.findFilterEntry(filterName)) {
            console.error(pluginName + ":Filter already registered. " + filterName);
            return;
        }
        try {
            const instance = new constructionMethod();
            const entry = {
                active : false,
                instance : instance
            };
            this._filters.push(entry);
        }
        catch (e) {
            console.error(e);
        }
    };

    /**
     * filterNameに一致するフィルタエントリを得る。
     * 
     * @param {String} filterName フィルタ名
     * @return {Object} フィルタエントリ。該当するエントリが無い場合にはnull.
     */
    MapFilterManager.findFilterEntry = function(filterName) {
        return this._filters.find(entry => entry.name === filterName) || null;
    };

    /**
     * filterNameに対応するフィルタのインスタンスを得る。
     * 
     * @param {String} filterName フィルタ名
     * @return {Object} フィルタのインスタンス。
     */
    MapFilterManager.filter = function(filterName) {
        const entry = this.findFilterEntry(filterName);
        return entry ? entry.instance : null;
    };

    /**
     * filterNameで指定するフィルタを有効にする。
     * 
     * @param {String} filterName フィルタ名
     */
    MapFilterManager.setActive = function(filterName) {
        const entry = this.findFilterEntry(filterName);
        if (entry === null) {
            // 該当するフィルタ無し。
            console.error(pluginName + ":Filter not registered. " + filterName);
            return;
        }
        entry.active = true;
        if (debugEnable) {
            console.log(pluginName + ":Filter activated. " + filterName);
        }
    };

    /**
     * filterNameに一致するフィルタを取り除く。
     * 
     * @param {String} filterName キー名
     */
    MapFilterManager.setDeactive = function(filterName) {
        const entry = this.findFilterEntry(filterName);
        if (entry === null) {
            // 該当するフィルタ無し。
            console.error(pluginName + ":Filter not registered. " + filterName);
            return;
        }
        entry.active = false;
        if (debugEnable) {
            console.log(pluginName + ":Filter deactivated. " + filterName);
        }
    };


    /**
     * フィルタをクリアする。
     */
    MapFilterManager.clear = function() {
        for (const entry of this._filters) {
            entry.active = false;
        }
    };

    /**
     * フィルタを適用する。
     */
    MapFilterManager.update = function() {
        if (!(SceneManager._scene && SceneManager._scene === Scene_Map)) {
            if (debugEnable) {
                console.log(pluginName + ":Current scene is not Scene_Map")
            }
            return;
        }
        const filters = SceneManager._scene._spriteset.filters;
        for (const entry of this._filters) {
            if (entry.active) {
                if (!filters.include(entry.instance)) {
                    filters.push(entry.instance);
                    if (debugEnable) {
                        console.log(pluginName + ":Filter add to map. " + entry.name);
                    }
                }
            } else {
                const index = filters.indexOf(entry.instance);
                if (index >= 0) {
                    filters.splice(index, 1);
                    if (debugEnable) {
                        // もしかしたらspliceじゃ足りないかも？
                        console.log(pluginName + ":Filter remove from map. " + entry.name);
                    }
                }
            }
        }
    };
    /**
     *  セーブ/ロード時のフィルターの保存/読み込み
     */
    MapFilterManager.saveContents = function() {
        const contents = [];
        for (const entry of this._filters) {
            const saveFilterData = {
                name : entry.name,
                active : entry.active,
                uniform : {}
            };
            for (const key of entry.instance) {
                saveFilterData.uniform[key] = entry.isnstance[key];
            }
            contents.push(saveFilterData);
        }
        return contents;
    };

    /**
     * ロードしたデータを反映させる。
     * 
     * @param {Object} contents ロードデータ
     */
    MapFilterManager.loadContents = function(contents) {
        this.clear();
        for (let i = 0; i < contents.length; i++) {
            const loadFilterData = contents[i];
            const entry = this.findFilterEntry(loadFilterData.name);
            if (entry) {
                entry.active = loadFilterData.active;
                for (const key of loadFilterData.uniform) {
                    if (key in entry.instance) {
                        entry.instance[key] = loadFilterData.uniform[key];
                    }
                }
            }
        }
        this.update();
    };
    //------------------------------------------------------------------------------
    // DataManager
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    /**
     * セーブデータに入れるデータを構築する。
     * 
     * @return {Dictionary} 保存するコンテンツ
     */
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.map_filter = MapFilterManager.saveContents();
        return contents;
    };
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;

    /**
     * セーブデータから必要なコンテンツを展開する。
     * 
     * @param {Dictionary} contents コンテンツ
     */
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.map_filter) {
            MapFilterManager.loadContents(contents.map_filter);
        }
    };

    const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    /**
     * Scene_Mapで使用するSpritesetを作成する。
     */
    Scene_Map.prototype.createSpriteset = function() {
        _Scene_Map_createSpriteset.call(this);
        MapFilterManager.update();
    };

    //------------------------------------------------------------------------------
    // Scene_Boot
    // const _Scene_Boot_start = Scene_Boot.prototype.start;
    // /**
    //  * Scene_Bootを開始する。
    //  */
    // Scene_Boot.prototype.start = function () {
    //     // MapFilterManager.add("bloom");
    //     // MapFilterManager.add("tiltshift");
    //     _Scene_Boot_start.call(this);
    // };
    
    // MapFilterManager._filters["bloom"] = PIXI.filters.BloomFilter;
    // MapFilterManager._filters["tiltshift"] = PIXI.filters.TiltShiftFilter;
    // MapFilterManager._filters["grayscale"] = PIXI.filters.GrayScaleFilter;
    // MapFilterManager._filters["sepia"] = PIXI.filters.SepiaFilter;
    
})();
