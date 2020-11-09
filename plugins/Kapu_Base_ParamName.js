
/*:ja
 * @target MZ 
 * @plugindesc パラメータ名プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @param xparam2
 * @text 会心率ラベル
 * @desc 「会心率」として使用するラベル
 * @type string
 * @default 会心
 * 
 * @param xparam3
 * @text 会心回避率ラベル
 * @desc 「会心回避率」として使用するラベル
 * @type string
 * @default 会心回避
 * 
 * @param xparam4
 * @text 魔法回避率ラベル
 * @desc 「魔法回避率」として使用するラベル
 * @type string
 * @default 魔法回避
 * 
 * @param xparam5
 * @text 魔法反射率ラベル
 * @desc 「魔法反射率」として使用するラベル
 * @type string
 * @default 魔法反射
 * 
 * @param xparam6
 * @text カウンター率ラベル
 * @desc 「カウンター率」として使用するラベル
 * @type string
 * @default カウンター
 * 
 * @param xparam7
 * @text HP自動回復率ラベル
 * @desc 「HP自動回復率」として使用するラベル
 * @type string
 * @default HP自動回復
 * 
 * @param xparam8
 * @text MP自動回復率ラベル
 * @desc 「MP自動回復率」として使用するラベル
 * @type string
 * @default MP自動回復
 * 
 * @param xparam9
 * @text TP自動回復率ラベル
 * @desc 「TP自動回復率」として使用するラベル
 * @type string
 * @default TP自動回復
 * 
 * @param sparam0
 * @text 狙われ率ラベル
 * @desc 「狙われ率」として使用するラベル
 * @type string
 * @default 狙われ率
 * 
 * @param sparam1
 * @text 防御時ダメージ軽減率ラベル
 * @desc 「防御時ダメージ軽減率」として使用するラベル
 * @type string
 * @default 防御時ダメージ軽減率
 * 
 * @param sparam2
 * @text 回復率ラベル
 * @desc 「回復率」として使用するラベル
 * @type string
 * @default 回復率
 * 
 * @param sparam3
 * @text アイテム効果率ラベル
 * @desc 「アイテム効果率」として使用するラベル
 * @type string
 * @default アイテム効果率
 * 
 * @param sparam4
 * @text MPコストレートラベル
 * @desc 「MPコストレート」として使用するラベル
 * @type string
 * @default MPコストレート
 * 
 * @param sparam5
 * @text TPチャージ率ラベル
 * @desc 「TPチャージ率」として使用するラベル
 * @type string
 * @default TPチャージ率
 * 
 * @param sparam6
 * @text 物理ダメージレートラベル
 * @desc 「物理ダメージレート」として使用するラベル
 * @type string
 * @default 物理ダメージレート
 * 
 * @param sparam7
 * @text 魔法ダメージレートラベル
 * @desc 「魔法ダメージレート」として使用するラベル
 * @type string
 * @default 魔法ダメージレート
 * 
 * @param sparam8
 * @text 床ダメージレートラベル
 * @desc 「床ダメージレート」として使用するラベル
 * @type string
 * @default 床ダメージレート
 * 
 * @param sparam9
 * @text 経験値取得レートラベル
 * @desc 「経験値取得レート」として使用するラベル
 * @type string
 * @default 経験値取得レート
 * 
 * @param enableProperty
 * @text プロパティ定義する
 * @desc trueにすると、TextManager.hitなどでテキストにアクセスrできるようにする。
 * @type boolean
 * @default false
 * 
 * @help 
 * CEVなどのパラメータをUIに表示しようとしたとき、
 * 統一的に扱うようにするためのプラグインです。
 * HP/MP/TPなどの主要パラメータはデータベース上で定義されていますが、
 * CEVなどの一部パラメータは定義されていません。
 * 本プラグインではそれらのパラメータを定義します。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
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
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Base_ParamName";
    const parameters = PluginManager.parameters(pluginName);
    const enableProperty = (typeof parameters["enableProperty"] === "undefined")
            ? false : (parameters["enableProperty"] === "true");

    //------------------------------------------------------------------------------
    // TextManager

    TextManager._xparam = [];
    /**
     * XParamタイプパラメータのラベルを得る。
     * 
     * @param {Number} id XParam DID
     * @return {String} テキスト
     */
    TextManager.xparam = function(id) {
        // HITとEVAはparamで定義したやつが使用できるのでそちらを使う。
        if (id === 0) {
            return TextManager.param(8);
        } else if (id === 1) {
            return TextManager.param(9);
        } else {
            return this._xparam[id] || "";
        }
    };
    for (let i = 2; i < 10; i++) {
        TextManager._xparam[i] = parameters["xparam" + i] || "";
    }

    TextManager._sparam = [];
    /**
     * SParamタイプパラメータのラベルを得る。
     * 
     * @param {Number} id SParam DID
     * @return {String} テキスト
     */
    TextManager.sparam = function(id) {
        return this._sparam[id];
    };
    for (let i = 0; i < 10; i++) {
        TextManager._sparam[i] = parameters["sparam" + i] || "";
    }

    if (enableProperty) {
        Object.defineProperties(TextManager, {
            /** 最大HPを表すテキスト @constant {String} */
            mhp : TextManager.param(0),
            /** 最大MPを表すテキスト @constant {String} */
            mmp : TextManager.param(1),
            /** 攻撃力を表すテキスト @constant {String} */
            atk : TextManager.param(2),
            /** 防御力を表すテキスト @constant {String} */
            def : TextManager.param(3),
            /** 魔法攻撃力を表すテキスト @constant {String} */
            mat : TextManager.param(4),
            /** 魔法防御力を表すテキスト @constant {String} */
            mdf : TextManager.param(5),
            /** 敏捷を表すテキスト @constant {String} */
            agi : TextManager.param(6),
            /** 運を表すテキスト @constant {String} */
            luk : TextManager.param(7),
            /** 命中率を表すテキスト @constant {String} */
            hit : TextManager.param(8),
            /** 物理回避率を表すテキスト @constant {String} */
            eva : TextManager.param(9),
            /** 会心率を表すテキスト @constant {String} */
            cri : TextManager.xparam(2),
            /** 会心回避率を表すテキスト @constant {String} */
            cev : TextManager.xparam(3),
            /** 魔法回避率を表すテキスト @constant {String} */
            mev : TextManager.xparam(4),
            /** 魔法反射率を表すテキスト @constant {String} */
            mrf : TextManager.xparam(5),
            /** カウンター率を表すテキスト @constant {String} */
            cnt : TextManager.xparam(6),
            /** HP自動回復率を表すテキスト @constant {String} */
            hrg : TextManager.xparam(7),
            /** MP自動回復率を表すテキスト @constant {String} */
            mrg : TextManager.xparam(8),
            /** TP自動回復率を表すテキスト @constant {String} */
            trg : TextManager.xparam(9),
            /** ターゲット率を表すテキスト @constant {String} */
            tgr : TextManager.sparam(0),
            /** 防御時ダメージ軽減率を表すテキスト @constant {String} */
            grd : TextManager.sparam(1),
            /** 回復率を表すテキスト @constant {String} */
            rec : TextManager.sparam(2),
            /** アイテム効果率を表すテキスト @constant {String} */
            pha : TextManager.sparam(3),
            /** MPコストレートを表すテキスト @constant {String} */
            mcr : TextManager.sparam(4),
            /** TPコストレートを表すテキスト @constant {String} */
            tcr : TextManager.sparam(5),
            /** 物理被ダメージ率を表すテキスト @constant {String} */
            pdr : TextManager.sparam(6),
            /** 魔法被ダメージ率を表すテキスト @constant {String} */
            mdr : TextManager.sparam(7),
            /** 床被ダメージ率を表すテキスト @constant {String} */
            fdr : TextManager.sparam(8),
            /** 経験値取得率を表すテキスト @constant {String} */
            exr : TextManager.sparam(9),
        });
    }
})();

