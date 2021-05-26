/*:ja
 * @target MZ
 * @plugindesc マップのFilterを管理する。
 * @author weakboar kapuusagi
 * @url https://github.com/weakboar/mv_plugin
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @command clear
 * @text フィルタ解除
 * @desc 全てのフィルタを解除する。
 * 
 * @command allActivate
 * @text 全体を有効にする
 * @desc 全てのフィルタを有効にする。
 * 
 * @command allDeactivate
 * @text 全体を無効にする
 * @desc 全てのフィルタを無効にする。
 *
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
 * Scene_Mapで使用されるspritesetのfilterに追加したり削除したりする。
 * 
 * 
 * ■ 使用時の注意
 * 他のマップフィルタ関連と競合する可能性があります。
 * 
 * ■ プラグイン開発者向け
 * 指定可能なのは、PIXI.Filterの派生クラス。
 * ベーシックシステムのソースだと、rmmz_core.js にあるColorFilterが単純でよろしい。
 * 
 * 新規マップフィルタプラグインを追加する際に便利に使えるようにするためのマネージャ。
 * 
 * MapFilterManager.registerFilter(filterName:string, constructionMethod:function, saveProperties : Array<string>) : void
 *     新しいマップフィルタを追加する。
 *     registerFilter()をコールした時点で、インスタンスが生成される。
 *     既に同名のフィルタが登録済みの場合には上書きされる。
 *     savePropertiesに渡したプロパティ名配列はセーブファイルに保存される。
 *     保存するパラメータが無いならば空の配列を渡す。
 * 
 * MapFilterManager.filter(filterName:string):Filter
 *     指定したフィルタのインスタンスを得る。
 *     各マップフィルタプラグインで、設定値を適用するために使用する。
 * 
 * MapFilterManager.activate(filterName:string):void
 *     指定したフィルタを有効にする。
 * 
 * MapFilterManager.deactivate(filterName:string):void
 *     指定したフィルタを無効にする。
 * 
 * MapFilterManager.clear()
 *     フィルタを全て無効にする。
 * 
 * 
 * カスタムなフィルタを追加するならば...
 * (1) PIXI.Filterを派生したクラスを作成する。
 *     rmmz_core.jsのColorFilterが参考になる。
 * (2) MapFilterManager.filterに登録する。
 *     MapFilterManager.registerFilter("hoge", HogeFilter, ["param"]);
 * (3) 取得/設定するプロパティを実装する。
 *     Object.defineProperty(HogeFilter.prototype, "param" { ... });
 * (4) フィルタのON/OFFをできるようにする。
 *     各プラグイン側で
 *     MapFilterManager.activate("hoge")
 *     と
 *     MapFilterManager.deactivate("hoge")
 *     をコールするようにすればいい。
 * (5) プラグインコマンドでパラメータを変更できるようにする。
 *     各プラグイン側で、
 *     MapFilterManager.filter("hoge").uniforms.XXXX = YYYY
 *     のように設定したあと、
 *     MapFilterManager.update()
 *     を呼ぶ。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * フィルタ解除
 *     全てのマップフィルタをOFFにする。
 * 全体を有効にする
 *     全てのマップフィルタの適用を解除する。
 * 全体を無効にする
 *     マップフィルタの適用を有効にする。
 *     ONになっているフィルタが適用される。
 * ============================================
 * ノートタグ
 * ============================================
 * マップ
 *   <mapFilters:filterNames=state$,..>
 *     filterNamesで指定したフィルタをstate$にする。
 *     state$に指定可能なのは"on"または"off"。それ以外は前のマップを引き継ぐ。
 *   <enableMapFilters>
 *     マップに移動したとき、フィルタを全て有効にする。
 *     同マップ中で有効にしたい場合、プラグインコマンドを使用すること。
 *   <disableMapFilters>
 *     マップに移動したとき、フィルタを全て無効にする。
 *     同マップ中で有効にしたい場合、プラグインコマンドを使用すること。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 セーブデータからの復帰時、フィルタへの値設定で
 *               エラーが出た場合には例外でログ出力するようにした。
 * Version.0.1.0 WeakBoar氏のMVPluginリポジトリのファイルを元に作成。
 */

/**
 * MapFilterManager
 * Scene_Mapに適用するフィルタを管理する静的クラス。
 */
function MapFilterManager() {
    throw new Error("This is a static class");
}

(() => {
    const pluginName = "Kapu_MapFilterManager";
    const parameters = PluginManager.parameters(pluginName);

    const debugEnable = (typeof parameters["debugEnable"] === "undefined")
            ? true : (parameters["debugEnable"] === "true");

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "clear", args => {
        MapFilterManager.clear();
    });

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "allActivate", args => {
        MapFilterManager.globalActivate();
    });

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "allDeactive", args => {
        MapFilterManager.globalDeactivate();
    });

    //------------------------------------------------------------------------------
    // MapFilterManager

    MapFilterManager._filters =[];
    MapFilterManager._globalEnable = true;
    MapFilterManager._frameCount = 0;

    /**
     * フィルタを登録する。
     * 
     * @param {String} filterName フィルタ識別名
     * @param {Method} constructionMethod 構築メソッド
     * @param {Array<String>} saveProperties 保存プロパティ名
     */
    MapFilterManager.registerFilter = function(filterName, constructionMethod, saveProperties) {
        try {
            const registeredEntry = this.findFilterEntry(filterName);
            if (registeredEntry) {
                if (registeredEntry.instance.constructor === constructionMethod) {
                    return ;
                }
                console.log(pluginName + ":Filter overwrtite. " + filterName);
                entry.active = false;
                entry.instance = new constructionMethod();
                entry.saveProperties = saveProperties;
            } else {
                const instance = new constructionMethod();
                const entry = {
                    name: filterName,
                    active : false,
                    saveProperties : saveProperties,
                    instance : instance
                };
                this._filters.push(entry);
                if (debugEnable) {
                    console.log(pluginName + ":Filter registered. " + filterName);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    };


    /**
     * filterNameに一致するフィルタエントリを得る。
     * 
     * @param {String} filterName フィルタ名
     * @returns {object} フィルタエントリ。該当するエントリが無い場合にはnull.
     */
    MapFilterManager.findFilterEntry = function(filterName) {
        return this._filters.find(entry => entry.name === filterName) || null;
    };

    /**
     * filterNameに対応するフィルタのインスタンスを得る。
     * 
     * @param {String} filterName フィルタ名
     * @returns {object} フィルタのインスタンス。
     */
    MapFilterManager.filter = function(filterName) {
        const entry = this.findFilterEntry(filterName);
        return entry ? entry.instance : null;
    };

    /**
     * フィルタ全体に対する有効設定をする。
     */
    MapFilterManager.globalActivate = function() {
        this._globalEnable = true;
        this.update();
    };

    /**
     * フィルタ全体に対する無効設定をする。
     */
    MapFilterManager.globalDeactivate = function() {
        this._globalEnable = false;
        this.update();
    };

    /**
     * フィルタ全体に対する有効/無効を取得する。
     * 
     * @returns {boolean} フィルタ全体に対して有効な場合にはtrue, それ以外はfalse
     */
    MapFilterManager.isGlobalActive = function() {
        return this._globalEnable;
    };

    /**
     * filterNameで指定するフィルタを有効にする。
     * 
     * @param {String} filterName フィルタ名
     */
    MapFilterManager.activate = function(filterName) {
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
        this.update();
    };

    /**
     * filterNameに一致するフィルタを取り除く。
     * 
     * @param {String} filterName キー名
     */
    MapFilterManager.deactivate = function(filterName) {
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
        this.update();
    };

    /**
     * fileNameで指定したフィルタが有効かどうかを判定する。
     * 
     * @param {String} filterName 
     * @returns {boolean} 有効な場合にはtrue, それ以外はfalse
     */
    MapFilterManager.isActive = function(filterName) {
        const entry = this.findFilterEntry(filterName);
        return (entry && entry.active);
    };


    /**
     * フィルタをクリアする。
     */
    MapFilterManager.clear = function() {
        for (const entry of this._filters) {
            entry.active = false;
        }
        this.update();
    };

    /**
     * フィルタを適用する。
     */
    MapFilterManager.update = function() {
        // Note: "_"付いたメンバに外部からアクセスするのでよろしくない。
        if (!(SceneManager._scene && SceneManager._scene.constructor === Scene_Map)) {
            if (debugEnable) {
                console.log(pluginName + ":Current scene is not Scene_Map")
            }
            return;
        }
        const filters = SceneManager._scene._spriteset.filters;
        for (const entry of this._filters) {
            if (this._globalEnable && entry.active) {
                if (!filters.includes(entry.instance)) {
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
     * 時間を初期化する。
     */
    MapFilterManager.initTime = function() {
        this._frameCount = 0;
    }

    /**
     * フィルタのtimeパラメータを更新する。
     * 
     * @param {boolean} sceneActive シーンがアクティブかどうか
     */
    MapFilterManager.updateTime = function(sceneActive) {
        if (sceneActive) {
            this._frameCount++;
            if (this._frameCount >= 3600) {
                this._frameCount = 0;
            }
            const time = this._frameCount / 60;
            for (const entry of this._filters) {
                if (this._globalEnable && entry.active) {
                    if ("time" in entry.instance) {
                        entry.instance.time = time;
                    }
                }
            }
        }
    };
    /**
     *  セーブ/ロード時のフィルターの保存/読み込み
     */
    MapFilterManager.saveContents = function() {
        const contents = {};
        contents.globalEnable = this._globalEnable;
        contents.filters = [];
        for (const entry of this._filters) {
            const saveFilterData = {
                name : entry.name,
                active : entry.active,
                properties : {}
            };
            for (const key of entry.saveProperties) {
                saveFilterData.properties[key] = entry.instance[key];
            }
            contents.filters.push(saveFilterData);
        }
        return contents;
    };

    /**
     * ロードしたデータを反映させる。
     * 
     * @param {object} contents ロードデータ
     */
    MapFilterManager.loadContents = function(contents) {
        this.clear();
        this._globalEnable = contents.globalEnable;
        for (let i = 0; i < contents.filters.length; i++) {
            const loadFilterData = contents.filters[i];
            const entry = this.findFilterEntry(loadFilterData.name);
            if (entry) {
                entry.active = loadFilterData.active;
                for (const key of entry.saveProperties) {
                    try {
                        if ((key in entry.instance) 
                                && (key in loadFilterData.properties)) {
                            entry.instance[key] = loadFilterData.properties[key];
                        }
                    }
                    catch (e) {
                        console.error(entry.filterName + ":Set " + key + " error. " + loadFilterData.properties[key]);
                    }
                }
            }
        }
        this.update();
    };
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * データマップをパースする。
     * 
     * @param {DataMap} dataMap データマップ
     */
    const _parseNotetag = function(dataMap) {
        if (dataMap.meta.mapFilters) {
            MapFilterManager.clear();
            const entries = dataMap.meta.mapFilters.split(",");
            for (const entry of entries) {
                const tokens = entry.split("=");
                if (tokens.length >= 2) {
                    const filterName = tokens[0].trim();
                    const state = tokens[1].trim();
                    if (state === "on") {
                        MapFilterManager.activate(filterName);
                    } else if (state === "off") {
                        MapFilterManager.deactivate(filterName);
                    }
                }
            }
        } else if (dataMap.meta.enableFilters) {
            MapFilterManager.globalActivate(true);
        } else if (dataMap.meta.disableFilters) {
            MapFilterManager.globalDeactivate(false);
        }
    };

    DataManager.addNotetagParserMaps(_parseNotetag);

    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    /**
     * セーブデータに入れるデータを構築する。
     * 
     * @returns {Dictionary} 保存するコンテンツ
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

    //------------------------------------------------------------------------------
    // Scene_Map
    const _Scene_Map_create = Scene_Map.prototype.create;
    /**
     * Scene_Mapを構築する
     */
    Scene_Map.prototype.create = function() {
        MapFilterManager.initTime();
        _Scene_Map_create.call(this);
    };

    const _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    /**
     * Scene_Mapで使用するSpritesetを作成する。
     */
    Scene_Map.prototype.createSpriteset = function() {
        _Scene_Map_createSpriteset.call(this);
        MapFilterManager.update();
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    /**
     * Scene_Mapを更新する。
     */
    Scene_Map.prototype.update = function() {
        MapFilterManager.updateTime(this.isActive());
        _Scene_Map_update.call(this);
    };

})();
