/*:ja
 * @target MZ 
 * @plugindesc パラメータ育成プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * 
 * @param growupItem0
 * @text MaxHP
 * @type struct<growupItemEntry>
 * @default { "enabled":"true", "growRate":"30", "costRate":"1", "iconIndex":"0", "name":"MaxHPを上げる。", "description":"MaxHPが向上します。" }
 * 
 * @param growupItem1
 * @text MaxMP
 * @type struct<growupItemEntry>
 * @default { "enabled":"true", "growRate":"10", "costRate":"1", "iconIndex":"0", "name":"MaxMPを上げる。", "description":"MaxMPが向上します。" }
 * 
 * @param growupItem2
 * @text ATK
 * @type struct<growupItemEntry>
 * @default { "enabled":"true", "growRate":"5", "costRate":"1", "iconIndex":"0", "name":"ATKを上げる。", "description":"ATKが向上します。" }
 * 
 * @param growupItem3
 * @text DEF
 * @type struct<growupItemEntry>
 * @default { "enabled":"true", "growRate":"3", "costRate":"1", "iconIndex":"0", "name":"DEFを上げる。", "description":"DEFが向上します。" }
 * 
 * @param growupItem4
 * @text MAT
 * @type struct<growupItemEntry>
 * @default { "enabled":"true", "growRate":"5", "costRate":"1", "iconIndex":"0", "name":"MATを上げる。", "description":"MATが向上します。" }
 * 
 * @param growupItem5
 * @text MDF
 * @type struct<growupItemEntry>
 * @default { "enabled":"true", "growRate":"3", "costRate":"1", "iconIndex":"0", "name":"MDFを上げる。", "description":"MDFが向上します。" }
 * 
 * @param growupItem6
 * @text AGI
 * @type struct<growupItemEntry>
 * @default { "enabled":"true", "growRate":"1", "costRate":"1", "iconIndex":"0", "name":"AGIを上げる。", "description":"AGIが向上します。" }
 * 
 * 
 * @param growupItem7
 * @text LUK
 * @type struct<growupItemEntry>
 * @default { "enabled":"true", "growRate":"1", "costRate":"1", "iconIndex":"0", "name":"LUKを上げる。", "description":"LUKが向上します。" }
 * 
 * 
 * @help 
 * MaxHP/MaxMP/ATK/DEF/MAT/MDF/AGI/LUKをGPで育成させるためのプラグイン
 * 
 * ■ 使用時の注意
 * ありません。
 * 
 * ■ プラグイン開発者向け
 * ありません。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 基本パラメータを拡張するためのプラグイン。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *     <gpParams:value#,value#,...>
 *          GPで割り振った初期値
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.2.0 GrowupSystem Version.0.3.0に対応した。
 * Version.0.1.1 プラグインパラメータのenabledが効いていない不具合を修正した。
 * Version.0.1.0 GrowupSystemテスト用に作成。
 */
/*~struct~growupItemEntry:
 *
 * @param enabled
 * @text 育成対象
 * @desc 育成対象とする場合にはtrue, しない場合はfalseにする。
 * @type boolean
 *
 * @param growRate
 * @text 成長レート
 * @desc 1割り振る毎に加算する値。
 * @type number
 * @default 1
 * @min 1
 * @parent luk
 * 
 * @param costRate
 * @text コストレート
 * @desc 1割り振る毎に増加するコストレート。2にすると、0->1はコスト1、1->2はコスト1+1*2=3になる
 * @type number
 * @default 1
 * @min 0
 * 
 * @param iconIndex
 * @text アイコンインデックス
 * @desc 育成画面に表示するアイコン番号
 * @type number
 * @default 0
 * @min 0
 * 
 * @param name
 * @text 育成項目名
 * @desc 育成画面で表示する名前。
 * @type string
 * 
 * @param description
 * @text 説明
 * @desc 育成画面に表示する説明。
 * @type string
 */
(() => {
    const pluginName = "Kapu_GrowupSystem_Params";
    const parameters = PluginManager.parameters(pluginName);

    const growupItemEntries = [];
    for (let i = 0; i < 8; i++) {
        const growupItem = JSON.parse(parameters["growupItem" + i]);
        growupItem.enabled = (typeof growupItem.enabled === "undefined") 
                ? false : (growupItem.enabled === "true");
        growupItem.growRate = Number(growupItem.growRate) || 1;
        growupItem.costRate = Number(growupItem.costRate) || 0;
        growupItem.iconIndex = Number(growupItem.iconIndex) || 0;
        growupItemEntries.push(growupItem);
    }

    //------------------------------------------------------------------------------
    // Game_Actor

    // 1.Game_Actor.initMembersをフックして育成データを格納する場所を追加。
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._gpParams = [0, 0, 0, 0, 0, 0, 0, 0];
    };

    // 2.Game_Actor.initGrows()をフックし、ノートタグを解析して初期値を設定する処理を追加。
    const _Game_Actor_initGrows = Game_Actor.prototype.initGrows;
    /**
     * 育成状態を初期化する。
     */
    Game_Actor.prototype.initGrows = function() {
        _Game_Actor_initGrows.call(this);
        
        const actor = this.actor();
        if (actor.meta.gpParams) {
            const tokens = actor.meta.gpParams.split(",");
            const count = Math.min(tokens.length, this._gpParams.length);
            for (let i = 0; i < count;  i++) {
                // 0以上(Math.max)の整数値(Math.floor)を格納する。
                this._gpParams[i] = Math.max(0, Math.floor(Number(tokens[i]) || 0));
            }
        }
    };

    // 3.Game_Actor.usedGrowupPointをフックし、使用済みGP値の計算を追加。
    const _Game_Actor_usedGrowupPoint = Game_Actor.prototype.usedGrowupPoint;
    /**
     * 使用済みGrowPointを得る。
     * 
     * @returns {number} 使用済み育成ポイント。
     */
    Game_Actor.prototype.usedGrowupPoint = function() {
        let usedPoint = _Game_Actor_usedGrowupPoint.call(this);
        for (let paramId = 0; paramId < this._gpParams.length; paramId++) {
            const paramValue = this._gpParams[paramId];
            for (let i = 0; i < paramValue; i++) {
                usedPoint = this.calcGrowupParamCost(i, growupItemEntries[paramId].costRate)
            }
        }
        return usedPoint;
    };

    // 4.Game_Actorの適切なメソッドをフックし、育成データを反映する場所を追加。
    const _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    /**
     * 基本パラメータベース値を得る。
     * 
     * @param paramId {number} パラメータID
     * @returns {number} パラメータ値
     */
    Game_Actor.prototype.paramBase = function(paramId) {
        return _Game_Actor_paramBase.call(this, paramId) + this.gpParam(paramId);
    };

    /**
     * GPによるパラメータ加算値を得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} GP加算パラメータ値
     */
    Game_Actor.prototype.gpParam = function(paramId) {
        return Math.floor(this._gpParams[paramId] * growupItemEntries[paramId].growRate);
    };

    // 5.Game_Actor.resetGrowsをフックし、育成リセットを追加。
    const _Game_Actor_resetGrows = Game_Actor.prototype.resetGrows;
    /**
     * 成長リセットする。
     */
    Game_Actor.prototype.resetGrows = function() {
        _Game_Actor_resetGrows.call(this);
        for (let i = 0; i < this._gpParams.length; i++) {
            this._gpParams[i] = 0;
        }
    };

    // 6.Game_Actor.growupItemsをフックし、育成項目を返す処理を追加
    const _Game_Actor_growupItems = Game_Actor.prototype.growupItems;
    /**
     * 育成項目を返す。
     * 
     * @returns {Array<GrowupItem>} 育成項目
     */
    Game_Actor.prototype.growupItems = function() {
        const items = _Game_Actor_growupItems.call(this);
        for (let i = 0; i < this._gpParams.length; i++) {
            const entry = growupItemEntries[i];
            if (entry.enabled && this.gpParamGrowable(i)) {
                items.push({
                    iconIndex : entry.iconIndex,
                    name : entry.name,
                    type : "param",
                    id : i,
                    cost : this.gpParamCost(i),
                    description : entry.description
                });
            }
        }

        return items;
    };

    /**
     * パラメータを育成可能かどうかを判定する。
     * 
     * @param {number} paramId パラメータID
     */
    Game_Actor.prototype.gpParamGrowable = function(paramId) {
        return (this.gpParam(paramId) <  this.paramMax(paramId));
    };

    /**
     * パラメータ育成に必要なコストを得る。
     * 
     * @param {number} paramId パラメータID
     * @returns {number} コスト
     */
    Game_Actor.prototype.gpParamCost = function(paramId) {
        return this.calcGrowupParamCost(this._gpParams[paramId], growupItemEntries[paramId].costRate);
    };

    /**
     * パラメータ育成に必要なコストを計算する。
     * 
     * @param {number} currentValue 現在値
     * @param {number} rate コスト上昇レート
     * @returns {number} コスト
     */
    Game_Actor.prototype.calcGrowupParamCost = function(currentValue, rate) {
        return 1 + Math.floor(currentValue * rate);
    };

    // 7.Game_Actor.applyGrowupをフックし、育成適用処理を追加。
    const _Game_Actor_applyGrowup = Game_Actor.prototype.applyGrowup;
    /**
     * 育成項目を適用する。
     * 
     * @param {GrowupItem} growupItem 育成項目
     * @returns {boolean} 適用できたかどうか。
     */
    Game_Actor.prototype.applyGrowup = function(growupItem) {
        if (growupItem.type === "param") {
            const paramId = growupItem.id;
            this._gpParams[paramId] += 1;
            return true;
        } else {
            return _Game_Actor_applyGrowup.call(this, growupItem);
        }
    };
})();
