/*:ja
 * @target MZ 
 * @plugindesc カスタム個別アイテム入手プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_IndependentItem
 * @orderAfter Kapu_IndependentItem
 * @orderAfter Kapu_IndependentItem_Boost
 * 
 * @command gainItem
 * @text アイテム入手
 * 
 * @arg id
 * @text アイテムID
 * @desc 増やすアイテムID
 * @type item
 * @default 0
 * 
 * @arg scriptEntries
 * @text スクリプト
 * @type struct<CustomizeScriptEntry>[]
 * @default []
 * 
 * @command gainWeapon
 * @text 武器入手
 * 
 * @arg id
 * @text 武器ID
 * @desc 増やす武器ID
 * @type weapon
 * @desc item に適用するスクリプト。itemに増やした武器が格納される。eval()で処理するのでやりたい放題。
 * @default 0
 * 
 * @arg scriptEntries
 * @text スクリプト
 * @type struct<CustomizeScriptEntry>[]
 * @default []
 * 
 * @command gainArmor
 * @text 防具入手
 * @text 防具ID
 * @desc 増やす防具ID
 * @type armor
 * @default 0
 * 
 * @arg scriptEntries
 * @text スクリプト
 * @type struct<CustomizeScriptEntry>[]
 * @default []
 * 
 * @help 
 * 個別アイテム入手時、指定したスクリプトの変更を適用したものを入手します。
 * 個別アイテムでないアイテム/武器/防具が指定された場合、該当品は増加しません。
 * スクリプト例1) 最初から+2された武器を用意する。（カスタム編)
 *   DataManager.applyBoostEffect(item, "ATK", "+24:+32");
 *   item.boostCount = 2;
 *   item.maxBoostCount = Math.max(item.boostCount, item.maxBoostCount);
 *   DataManager.updateBoostItemName(item);
 * 
 *   再初期化時適用：OFF
 * 
 * スクリプト例2）名前や説明を変更する
 *   item.name = "さびた青銅の剣";
 *   item.name_org = item.name;
 *   item.description = "さびた青銅の剣\n名も無き英雄が持っていただろう剣。";
 * 
 *   再初期化時適用：ON
 * 
 * ■ 使用時の注意
 * 他のプラグインの機能を呼び出したりする場合、
 * プラグインのバージョン変更によりインタフェースが変わると、もろに影響を受けます。
 * 
 * ランダマイズ等のIndependentItem拡張プラグインを使用する場合、
 * それらの後にいれるようにします。
 * 先に入れた場合、このスクリプトの処理後に拡張プラグインの変更が適用されることになり、
 * 意図したアイテム/武器/防具にならない場合があります。
 * 
 * 個別アイテムのデータフィールドが増えるので、多用するとセーブデータのサイズが増えます。
 * 
 * ■ プラグイン開発者向け
 * なし
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * アイテム入手
 * 武器入手
 * 防具入手
 *   コマンド引数で指定したカスタマイズを適用したアイテム/武器/防具を入手します。
 *   変なフィールドを追加したりもできるでしょう。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/*~struct~CustomizeScriptEntry:
 * 
 * @param script
 * @text スクリプト
 * @desc 適用するスクリプト。itemに増やしたアイテムが格納される。eval()で処理するのでやりたい放題。
 * @type multiline_string
 * @default
 * 
 * @param applyReinitialize
 * @text 再初期化時適用する
 * @desc 再初期化時にも適用するかどうか。falseにすると、入手時のみ適用される。
 * @type boolean
 * @default true
 */
(() => {
    const pluginName = "Kapu_IndependentItem_GainGustomized";
    // const parameters = PluginManager.parameters(pluginName);

    const _parseScriptArg = function(arg) {
        if (arg) {
            const scriptStrings = JSON.parse(arg);
            const scriptEntries = [];
            for (const scriptString of scriptStrings) {
                const scriptEntry = JSON.parse(scriptString);
                scriptEntry.applyReinitialize = (scriptEntry.applyReinitialize === "true");
                scriptEntries.push(scriptEntry);
            }
            return (scriptEntries.length > 0) ? scriptEntries : null;
        } else {
            return null;
        }
    };

    PluginManager.registerCommand(pluginName, "gainItem", args => {
        const id = Math.round(Number(args.id) || 0);
        if ((id > 0) && $dataItems[id]) {
            const baseItem = $dataItems[id];
            if (DataManager.isIndependent(baseItem)) {
                const scriptEntries = _parseScriptArg(args.scripts);
                $gameTemp.setIndependentItemCustomizeScripts(scriptEntries);
                $gameParty.gainItem(baseItem, 1, false);
            }
        } 
    });
    PluginManager.registerCommand(pluginName, "gainWeapon", args => {
        const id = Math.round(Number(args.id) || 0);
        if ((id > 0) && $dataWeapons[id]) {
            const baseItem = $dataWeapons[id];
            if (DataManager.isIndependent(baseItem)) {
                const scriptEntries = _parseScriptArg(args.scripts);
                $gameTemp.setIndependentItemCustomizeScripts(scriptEntries);
                $gameParty.gainItem(baseItem, 1, false);
            }
        }
    });
    PluginManager.registerCommand(pluginName, "gainArmor", args => {
        const id = Math.round(Number(args.id) || 0);
        if ((id > 0) && $dataArmors[id]) {
            const scriptEntries = _parseScriptArg(args.scripts);
            $gameTemp.setIndependentItemCustomizeScripts(scriptEntries);
            $gameParty.gainItem(baseItem, 1, false);
        }
    });

    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this.clearIndependentItemCustomizeScripts();
    };

    /**
     * 個別アイテムカスタマイズスクリプトをクリアする。
     */
    Game_Temp.prototype.clearIndependentItemCustomizeScripts = function() {
        delete this._indenendentItemCustomizeScripts;
    };

    /**
     * 個別アイテムカスタマイズスクリプトをセットする。
     * 
     * @param {Array<object>} scriptEntries 個別アイテムカスタマイズスクリプト
     */
    Game_Temp.prototype.setIndependentItemCustomizeScripts = function(scriptEntries) {
        this._indenendentItemCustomizeScripts = scriptEntries;
    };

    /**
     * 個別アイテムカスタマイズスクリプトを取得する。
     * 
     * @returns {Array<object>} 個別アイテムカスタマイズスクリプト
     */
    Game_Temp.prototype.indenendentItemCustomizeScripts = function() {
        return this._indenendentItemCustomizeScripts || null;
    };

    //------------------------------------------------------------------------------
    // DataManager
    const _DataManager_registerNewIndependentData = DataManager.registerNewIndependentData;
    /**
     * 新しい個別アイテム(DataItem/DataWeapon/DataArmor)を登録する。
     * baseItemで指定されたアイテムに合わせ、適切なデータコレクションに登録するように処理を行う。
     * 
     * @param {object} baseItem ベースとするアイテムオブジェクト(DataItem/DataWeapon/DataArmor)
     * @returns {object} 登録された新しいアイテム。登録できなかった場合にはnull.
     */
    DataManager.registerNewIndependentData = function(baseItem) {
        const newItem = _DataManager_registerNewIndependentData.call(this, baseItem);

        const scriptEntries = $gameTemp.indenendentItemCustomizeScripts();
        if (newItem && scriptEntries) {
            this.applyIndependentItemCustomize(newItem, scriptEntries);
        }
        $gameTemp.clearIndependentItemCustomizeScripts();

        return newItem;
    };

    const _DataManager_reinitializeIndependentItem = DataManager.reinitializeIndependentItem;

    /**
     * 個別アイテムの性能を再初期化する。
     * id以外のベースアイテムが持つパラメータは全て再初期化される。
     * 
     * @param {object} item アイテム (DataItem/DataWeapon/DataArmor)
     */
    DataManager.reinitializeIndependentItem = function(item) {
        _DataManager_reinitializeIndependentItem.call(this, item);

        if (item.customizedScripts) {
            const scriptEntries = item.customizedScripts.map(scriptText => {
                return {
                    script: scriptText,
                    applyReinitialize: true
                };
            });
            this.applyIndependentItemCustomize(newItem, scriptEntries);
        }
    };

    /**
     * itemにscriptsを適用する。
     * 
     * @param {object} targetItem DataItem/DataWeapon/DataArmor
     * @param {Array<object>} scriptEntries スクリプト
     */
    DataManager.applyIndependentItemCustomize = function(targetItem, scriptEntries) {
        const customizedScripts = [];
        for (const scriptEntry of scriptEntries) {
            if (scriptEntry.script) {
                try {
                    const item = targetItem; // eslint-disable-line no-unused-vars
                    eval(scriptEntry.script);
                }
                catch (e) {
                    console.log(script);
                    console.error(e);
                }
                if (scriptEntry.applyReinitialize) {
                    customizedScripts.push(scriptEntry.script);
                }
            }
        }
        if (customizedScripts.length > 0) {
            // カスタマイズしたスクリプトを保存し、
            // 次回初期化時にも適用する。
            targetItem.customizedScripts = customizedScripts;
        }
    };

    if (DataManager.resetBoost) {
        const _DataManager_resetBoost = DataManager.resetBoost;
        /**
         * 強化状態をリセットする。
         * 
         * @param {object} item アイテム
         */
        DataManager.resetBoost = function(item) {
            _DataManager_resetBoost.call(this, item);
            if (item.customizedScripts) {
                const scriptEntries = item.customizedScripts.map(scriptText => {
                    return {
                        script: scriptText,
                        applyReinitialize: true
                    };
                });
                this.applyIndependentItemCustomize(newItem, scriptEntries);
            }
        };
    }


})();