/*:ja
 * @target MZ 
 * @plugindesc TWLD基本パラメータ育成プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * @base Kapu_Twld_BasicParams
 * @orderAfter Kapu_Twld_BasicParams
 * 
 * @param growupItem0
 * @text STR育成項目
 * @desc STR育成項目
 * @type struct<growupItem>
 * @default { "enabled":"true", "iconIndex":"0", "name":"STRを上昇させる。", "description":"物理ダメージ量に影響します。" }
 * 
 * @param growupItem1
 * @text DEX育成項目
 * @desc DEX育成項目
 * @type struct<growupItem>
 * @default { "enabled":"true", "iconIndex":"0", "name":"DEXを上昇させる。", "description":"命中率(接近/遠距離)とクリティカル率に影響します。" }
 * 
 * @param growupItem2
 * @text VIT育成項目
 * @desc VIT育成項目
 * @type struct<growupItem>
 * @default { "enabled":"true", "iconIndex":"0", "name":"VITを上昇させる。", "description":"最大HPと物理/魔法被ダメージ量に影響します。" }
 * 
 * @param growupItem3
 * @text INT育成項目
 * @desc INT育成項目
 * @type struct<growupItem>
 * @default { "enabled":"true", "iconIndex":"0", "name":"INTを上昇させる。", "description":"最大MPと魔法ダメージ量および魔法被ダメージ量に影響します。" }
 * 
 * @param growupItem4
 * @text MEN育成項目
 * @desc MEN育成項目
 * @type struct<growupItem>
 * @default { "enabled":"true", "iconIndex":"0", "name":"MENを上昇させる。", "description":"最大MPと魔法被ダメージ量に影響します。" }
 * 
 * @param growupItem5
 * @text AGI育成項目
 * @desc AGI育成項目
 * @type struct<growupItem>
 * @default { "enabled":"true", "iconIndex":"0", "name":"AGIを上昇させる。", "description":"命中率(接近)と回避率および行動順に影響します。" }
 * 
 * @param growupItem6
 * @text LUK育成項目
 * @desc LUK育成項目
 * @type struct<growupItem>
 * @default { "enabled":"true", "iconIndex":"0", "name":"LUKを上昇させる。", "description":"様々な要素に影響します。" }
 * 
 * @help 
 * TWLD向けに作成した、基本パラメータ(STR/DEX/VIT/INT/MEN/AGI)を成長システムと結合させるプラグイン。
 * 
 * 
 * ■ 使用時の注意
 * 特になし。
 * 
 * ■ プラグイン開発者向け
 * 特になし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 特になし。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *     <basicParamsGrown:str#,dex#,vit#,int#,men#,agi#>
 * 
 *         アクターの割り振り済み育成値。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 作成した。
 */
/*~struct~growupItem:
 *
 * @param enabled
 * @text 育成可否
 * @desc trueを指定すると育成可能、falseで育成項目になりません。
 * @type boolean
 *
 * @param iconIndex
 * @text アイコンインデックス
 * @type number
 * 
 * @param name
 * @text 項目名
 * @desc 育成項目に表示する名前
 * 
 * @param description
 * @text 説明用文字列
 * @desc 育成項目選択時に表示する文字列
 * 
 */
(() => {
    const pluginName = "Kapu_Twld_BasicParams_Growup";
    const parameters = PluginManager.parameters(pluginName);

    const growupItems = [];
    for (let i = 0; i < 7; i++) {
        const item = JSON.parse(parameters["growupItem" + i]);
        item.enabled = (typeof item.enabled === "undefined")
                ? false : (item.enabled === "true");
        item.iconIndex = Number(item.iconIndex);
        growupItems.push(item);
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
        this.initBasicParamsGrown();
    };

    /**
     * 育成パラメータを初期化する。
     */
    Game_Actor.prototype.initBasicParamsGrown = function() {
        this._basicParamsGrown = [0, 0, 0, 0, 0, 0, 0];
    };

    // 2.Game_Actor.initGrowsをフックし、ノートタグを解析して初期値を設定する処理を追加。
    const _Game_Actor_initGrows = Game_Actor.prototype.initGrows;
    /**
     * 育成状態を初期化する。
     */
    Game_Actor.prototype.initGrows = function() {
        _Game_Actor_initGrows.call(this);
        const actor = this.actor();
        if (actor.meta.basicParamsGrown) {
            const tokens = actor.meta.basicParamsGrown.split(",");
            const count = Math.min(this._basicParamsGrown.length, tokens.length);
            for (let i = 0; i < count; i++) {
                const value = Number(tokens[i]);
                if (!isNaN(value)) {
                    this._basicParamsGrown[i] = value;
                }
            }
        }
    };

    // 3.Game_Actor.usedGrowupPointをフックし、使用済みGP値の計算を追加。
    const _Game_Actor_usedGrowupPoint = Game_Actor.prototype.usedGrowupPoint;
    /**
     * 使用済みGrowPointを得る。
     * 
     * @returns {Number} 使用済み育成ポイント。
     */
    Game_Actor.prototype.usedGrowupPoint = function() {
        let usedPoint = _Game_Actor_usedGrowupPoint.call(this);
        for (let paramId = 0; paramId < this._basicParamsGrown.length; paramId++) {
            const paramValue = this._basicParamsGrown[paramId];
            for (let i = 0; i < paramValue; i++) {
                usedPoint += this.calcGrowupBasicParamCost(i);
            }
        }

        return usedPoint;
    };

    // 4.Game_Actorの適切なメソッドをフックし、育成データを反映する場所を追加。
    const _Game_Actor_basicParamBase = Game_BattlerBase.prototype.basicParamBase;
    /**
     * 基本パラメータを得る。
     * 
     * @param {Number} paramId パラメータID
     * @returns {Number} パラメータの値
     */
    Game_Actor.prototype.basicParamBase = function(paramId) {
        return _Game_Actor_basicParamBase.call(this, paramId)
                + this._basicParamsGrown[paramId];
    };

    // 5.Game_Actor.resetGrowsをフックし、育成リセットを追加。
    const _Game_Actor_resetGrows = Game_Actor.prototype.resetGrows;
    /**
     * 成長リセットする。
     */
    Game_Actor.prototype.resetGrows = function() {
        _Game_Actor_resetGrows.call(this);
        this.initBasicParamsGrown();
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
        for (let i = 0; i < growupItems.length; i++) {
            const item = growupItems[i];
            if (item.enabled && this.isBasicParamGrowupable(i)) {
                items.push({
                    iconIndex: item.iconIndex,
                    name: item.name,
                    type: "basicParam",
                    id : i,
                    cost : this.gpBasicParamCost(i),
                    description : item.description,
                });

            }
        }

        return items;
    };

    /**
     * paramIdで指定される基本パラメータが育成可能かどうかを取得する。
     * 
     * @param {Number} paramId パラメータID
     * @returns {Boolean} 育成可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isBasicParamGrowupable = function(paramId) {
        return this._basicParamsGrown[paramId] < this.basicParamMax(paramId);
    };

    /**
     * 育成コストを取得する。
     * 
     * @param {Number} paramId パラメータID
     * @returns {Number} 育成コスト
     */
    Game_Actor.prototype.gpBasicParamCost = function(paramId) {
        const value = this._basicParamsGrown[paramId];
        return this.calcGrowupBasicParamCost(value);
    };

    /**
     * 育成コストを計算する。
     * 
     * @param {Number} currentValue 現在値
     * @returns {Number} 育成コスト
     */
    Game_Actor.prototype.calcGrowupBasicParamCost = function(currentValue) {
        return Math.max(1, Math.floor(currentValue / 20))
    };

    // 7.Game_Actor.applyGrowupをフックし、育成適用処理を追加。
    const _Game_Actor_applyGrowup = Game_Actor.prototype.applyGrowup;
    /**
     * 育成項目を適用する。
     * 
     * @param {GrowupItem} growupItem 育成項目
     * @returns {Boolean} 適用できたかどうか。
     */
    Game_Actor.prototype.applyGrowup = function(growupItem) {
        if (growupItem.type === "basicParam") {
            const paramId = growupItem.id;
            this._basicParamsGrown[paramId] += 1;
            return true;
        } else {
            return _Game_Actor_applyGrowup.call(this, growupItem);
        }
    };

})();