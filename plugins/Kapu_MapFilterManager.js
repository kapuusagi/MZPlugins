/*:ja
 * @target MZ
 * @plugindesc マップのFilterを管理する。
 * @author weakboar kapuusagi
 * @url https://github.com/weakboar/mv_plugin
 * 
 * @command clear
 * @text フィルタ解除
 * @desc 全てのフィルタを解除する。
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
 * MapFilterManager.registerFilter(filterName:string, constructionMethod:function) : void
 *     新しいマップフィルタを追加する。
 *     registerFilter()をコールした時点で、インスタンスが生成される。
 *     既に同名のフィルタが登録済みの場合には上書きされる。
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
 *     MapFilterManager.registerFilter("hoge", HogeFilter);
 * (3) フィルタのON/OFFをできるようにする。
 *     各プラグイン側で
 *     MapFilterManager.activate("hoge")
 *     と
 *     MapFilterManager.deactivate("hoge")
 *     をコールするようにすればいい。
 * (4) プラグインコマンドでパラメータを変更できるようにする。
 *     各プラグイン側で、
 *     MapFilterManager.filter("hoge").uniforms.XXXX = YYYY
 *     のように設定したあと、
 *     MapFilterManager.update()
 *     を呼ぶ。
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

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "clear", args => {
        MapFilterManager.clear();
    });

    MapFilterManager._filters =[];

    /**
     * フィルタを登録する。
     * 
     * @param {String} filterName フィルタ識別名
     * @param {Method} constructionMethod 構築メソッド
     */
    MapFilterManager.registerFilter = function(filterName, constructionMethod) {
        try {
            const registeredEntry = this.findFilterEntry(filterName);
            if (registeredEntry) {
                if (registeredEntry.instance.constructor === constructionMethod) {
                    return ;
                }
                console.log(pluginName + ":Filter overwrtite. " + filterName);
                entry.active = false;
                entry.instance = new constructionMethod();
            } else {
                const instance = new constructionMethod();
                const entry = {
                    active : false,
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
