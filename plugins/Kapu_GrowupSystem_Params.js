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
 * @param maxHP
 * @text 最大HP
 * 
 * @param growRate0
 * @text MaxHP成長レート
 * @desc 1割り振る毎に加算する最大HPの値。
 * @type number
 * @default 30
 * @min 1
 * @parent maxHP
 * 
 * @param growCostRate0
 * @text MaxHPコストレート
 * @desc 1割り振る毎に増加するコストレート。2にすると、0->1はコスト1、1->2はコスト1+1*2=3になる
 * @type number
 * @default 1
 * @min 1
 * @parent maxHP
 * 
 * @param iconIndex0
 * @text アイコンインデックス
 * @desc 育成画面に表示するアイコン番号
 * @type number
 * @default 0
 * @min 0
 * @parent maxHP
 * 
 * @param itemName0
 * @text 育成項目名
 * @desc 育成画面で表示する名前
 * @type string
 * @default 最大HPを上げる。
 * @parent maxHP
 * 
 * @param itemDescription0
 * @text 説明
 * @desc 育成画面に表示する説明
 * @type string
 * @default 最大HPが上昇します。
 * @parent maxHP
 * 
 * @param maxMP
 * @text 最大MP
 * 
 * @param growRate1
 * @text maxMP成長レート
 * @desc 1割り振る毎に加算する最大MPの値。
 * @type number
 * @default 10
 * @min 1
 * @parent maxMP
 * 
 * @param growCostRate1
 * @text maxMPコストレート
 * @desc 1割り振る毎に増加するコストレート。2にすると、0->1はコスト1、1->2はコスト1+1*2=3になる
 * @type number
 * @default 1
 * @min 1
 * @parent maxMP
 * 
 * @param iconIndex1
 * @text アイコンインデックス
 * @desc 育成画面に表示するアイコン番号
 * @type number
 * @default 0
 * @min 0
 * @parent maxMP
 * 
 * @param itemName1
 * @text 育成項目名
 * @desc 育成画面で表示する名前
 * @type string
 * @default 最大MPが上昇します。
 * @parent maxMP
 * 
 * @param itemDescription1
 * @text 説明
 * @desc 育成画面に表示する項目名
 * @type string
 * @default 最大MPが向上します。
 * @parent maxMP
 *  
 * @param atk
 * @text ATK
 * 
 * @param growRate2
 * @text ATK成長レート
 * @desc 1割り振る毎に加算するATKの値。
 * @type number
 * @default 5
 * @min 1
 * @parent atk
 * 
 * @param growCostRate2
 * @text atkコストレート
 * @desc 1割り振る毎に増加するコストレート。2にすると、0->1はコスト1、1->2はコスト1+1*2=3になる
 * @type number
 * @default 1
 * @min 1
 * @parent atk
 * 
 * @param iconIndex2
 * @text アイコンインデックス
 * @desc 育成画面に表示するアイコン番号
 * @type number
 * @default 0
 * @min 0
 * @parent atk
 * 
 * @param itemName2
 * @text 育成項目名
 * @desc 育成画面で表示する名前
 * @type string
 * @default ATKが上昇します。
 * @parent atk
 * 
 * @param itemDescription2
 * @text 説明
 * @desc 育成画面に表示する項目名
 * @type string
 * @default ATKが向上します。
 * @parent atk
 * 
 * @param def
 * @text DEF
 * 
 * @param growRate3
 * @text DEF成長レート
 * @desc 1割り振る毎に加算するDEFの値。
 * @type number
 * @default 3
 * @min 1
 * @parent def
 * 
 * @param growCostRate3
 * @text defコストレート
 * @desc 1割り振る毎に増加するコストレート。2にすると、0->1はコスト1、1->2はコスト1+1*2=3になる
 * @type number
 * @default 1
 * @min 1
 * @parent def
 * 
 * @param iconIndex3
 * @text アイコンインデックス
 * @desc 育成画面に表示するアイコン番号
 * @type number
 * @default 0
 * @min 0
 * @parent def
 * 
 * @param itemName3
 * @text 育成項目名
 * @desc 育成画面で表示する名前
 * @type string
 * @default DEFが上昇します。
 * @parent def
 * 
 * @param itemDescription3
 * @text 説明
 * @desc 育成画面に表示する項目名
 * @type string
 * @default DEFが向上します。
 * @parent def
 * 
 * @param mat
 * @text MAT
 * 
 * @param growRate4
 * @text MAT成長レート
 * @desc 1割り振る毎に加算するMATの値。
 * @type number
 * @default 5
 * @min 1
 * @parent mat
 * 
 * @param growCostRate4
 * @text matコストレート
 * @desc 1割り振る毎に増加するコストレート。2にすると、0->1はコスト1、1->2はコスト1+1*2=3になる
 * @type number
 * @default 1
 * @min 1
 * @parent mat
 * 
 * @param iconIndex4
 * @text アイコンインデックス
 * @desc 育成画面に表示するアイコン番号
 * @type number
 * @default 0
 * @min 0
 * @parent mat
 * 
 * @param itemName4
 * @text 育成項目名
 * @desc 育成画面で表示する名前
 * @type string
 * @default MATが上昇します。
 * @parent mat
 * 
 * @param itemDescription4
 * @text 説明
 * @desc 育成画面に表示する項目名
 * @type string
 * @default MATが向上します。
 * @parent mat
 * 
 * @param mdf
 * @text MDF
 * 
 * @param growRate5
 * @text MDF成長レート
 * @desc 1割り振る毎に加算するMDFの値。
 * @type number
 * @default 3
 * @min 1
 * @parent mdf
 * 
 * @param growCostRate5
 * @text mdfコストレート
 * @desc 1割り振る毎に増加するコストレート。2にすると、0->1はコスト1、1->2はコスト1+1*2=3になる
 * @type number
 * @default 1
 * @min 1
 * @parent mdf
 * 
 * @param iconIndex5
 * @text アイコンインデックス
 * @desc 育成画面に表示するアイコン番号
 * @type number
 * @default 0
 * @min 0
 * @parent mdf
 * 
 * @param itemName5
 * @text 育成項目名
 * @desc 育成画面で表示する名前
 * @type string
 * @default MDFが上昇します。
 * @parent mdf
 * 
 * @param itemDescription5
 * @text 説明
 * @desc 育成画面に表示する項目名
 * @type string
 * @default MDFが向上します。
 * @parent mdf
 * 
 * @param agi
 * @text AGI
 * 
 * @param growRate6
 * @text AGI成長レート
 * @desc 1割り振る毎に加算するAGIの値。
 * @type number
 * @default 1
 * @min 1
 * @parent agi
 * 
 * @param growCostRate6
 * @text agiコストレート
 * @desc 1割り振る毎に増加するコストレート。2にすると、0->1はコスト1、1->2はコスト1+1*2=3になる
 * @type number
 * @default 1
 * @min 1
 * @parent agi
 * 
 * @param iconIndex6
 * @text アイコンインデックス
 * @desc 育成画面に表示するアイコン番号
 * @type number
 * @default 0
 * @min 0
 * @parent agi
 * 
 * @param itemName6
 * @text 育成項目名
 * @desc 育成画面で表示する名前
 * @type string
 * @default AGIが上昇します。
 * @parent agi
 * 
 * @param itemDescription6
 * @text 説明
 * @desc 育成画面に表示する項目名
 * @type string
 * @default AGIが向上します。
 * @parent agi
 * 
 * @param luk
 * @text LUK
 * 
 * @param growRate7
 * @text LUK成長レート
 * @desc 1割り振る毎に加算するLUKの値。
 * @type number
 * @default 1
 * @min 1
 * @parent luk
 * 
 * @param growCostRate7
 * @text lukコストレート
 * @desc 1割り振る毎に増加するコストレート。2にすると、0->1はコスト1、1->2はコスト1+1*2=3になる
 * @type number
 * @default 1
 * @min 1
 * @parent luk
 * 
 * @param iconIndex7
 * @text アイコンインデックス
 * @desc 育成画面に表示するアイコン番号
 * @type number
 * @default 0
 * @min 0
 * @parent luk
 * 
 * @param itemName7
 * @text 育成項目名
 * @desc 育成画面で表示する名前
 * @type string
 * @default LUKが上昇します。
 * @parent luk
 * 
 * @param itemDescription7
 * @text 説明
 * @desc 育成画面に表示する項目名
 * @type string
 * @default LUKが向上します。
 * @parent luk
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
 * Version.0.1.0 GrowupSystemテスト用に作成。
 */
(() => {
    const pluginName = "Kapu_GrowupSystem_Params";
    const parameters = PluginManager.parameters(pluginName);

    const growupItemEntries = [];
    for (let i = 0; i < 8; i++) {
        const key = "growRate" + i;
        const rate = Math.max(1, Number(parameters[key]) || 1);
        const costRate = Math.max(0, Number(parameters["growCostRate" + i]) || 0);
        const iconIndex = String(parameters["iconIndex" + i]) || 0;
        const name = String(parameters["itemName" + i]) || ("Up " + TextManager.param(i));
        const description = String(parameters["itemDescription" + i]) || "";
        growupItemEntries.push({
            rate : rate,
            costRate : costRate,
            iconIndex : iconIndex,
            name : name,
            description : description,
        });
    }

    //------------------------------------------------------------------------------
    // DataManager

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

    // 2.Game_Actor.setupをフックし、ノートタグを解析して初期値を設定する処理を追加。
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        
        const actor = $dataActors[actorId];
        if (actor.meta.gpParams) {
            const tokens = actor.meta.gpParams.split(',');
            const count = Math.min(tokens.length, this._gpParams.length);
            for (let i = 0; i < count;  i++) {
                // 0以上(Math.max)の整数値(Math.floor)を格納する。
                this._gpParams[i] = Math.max(0, Math.floor(Number(tokens[i]) || 0));
            }
        }
    };

    // 3.Game_Actorの適切なメソッドをフックし、育成データを反映する場所を追加。
    const _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    /**
     * 基本パラメータベース値を得る。
     * 
     * @param paramId {Number} パラメータID
     * @return {Number} パラメータ値
     */
    Game_Actor.prototype.paramBase = function(paramId) {
        return _Game_Actor_paramBase.call(this, paramId) + this.gpParam(paramId);
    };

    /**
     * GPによるパラメータ加算値を得る。
     * 
     * @param {Number} paramId パラメータID
     * @return {Number} GP加算パラメータ値
     */
    Game_Actor.prototype.gpParam = function(paramId) {
        return Math.floor(this._gpParams[paramId] * growupItemEntries[paramId].rate);
    };

    // 4.Game_Actor.resetGrowsをフックし、育成リセットを追加。
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

    // 5.Game_Actor.growupItemsをフックし、育成項目を返す処理を追加
    const _Game_Actor_growupItems = Game_Actor.prototype.growupItems;
    /**
     * 育成項目を返す。
     * 
     * @return {Array<GrowupItem>} 育成項目
     */
    Game_Actor.prototype.growupItems = function() {
        const items = _Game_Actor_growupItems.call(this);
        for (let i = 0; i < this._gpParams.length; i++) {
            if (this.gpParamGrowable(i)) {
                const entry = growupItemEntries[i];
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
     * @param {Number} paramId パラメータID
     */
    Game_Actor.prototype.gpParamGrowable = function(paramId) {
        return (this.gpParam(paramId) <  this.paramMax(paramId));
    };

    /**
     * パラメータ育成に必要なコストを得る。
     * 
     * @param {Number} paramId パラメータID
     * @return {Number} コスト
     */
    Game_Actor.prototype.gpParamCost = function(paramId) {
        return 1 + Math.floor(this._gpParams[paramId] * growupItemEntries[paramId].costRate);
    };

    // 6.Game_Actor.applyGrowupをフックし、育成適用処理を追加。
    const _Game_Actor_applyGrowup = Game_Actor.prototype.applyGrowup;
    /**
     * 育成項目を適用する。
     * 
     * @param {GrowupItem} growupItem 育成項目
     * @return {Boolean} 適用できたかどうか。
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