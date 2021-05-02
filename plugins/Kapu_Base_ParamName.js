
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
 * 
 * @param textTraitElementRateUp
 * @text 属性耐性向上
 * @desc 属性耐性向上テキスト。%1に属性名が入る。
 * @type string
 * @default %1耐性向上
 * 
 * @param textTraitElementRateDown
 * @text 属性耐性低下
 * @desc 属性耐性低下テキスト。%1に属性名が入る。
 * @type string
 * @default %1耐性低下
 * 
 * @param textTraitDebuffRate
 * @text パラメータデバフ受付率
 * @desc デバフ受付率特性テキスト。%1にパラメータ名が入る。
 * @type string
 * @default %1減少率
 * 
 * @param textTraitStateRateUp
 * @text ステート受付率(耐性強化)
 * @desc ステート受付率(耐性強化)テキスト
 * @type string
 * @default %1耐性強化
 * 
 * @param textTraitStateRateDown
 * @text ステート受付率(耐性弱化)
 * @desc ステート受付率(耐性弱化)テキスト
 * @type string
 * @default %1耐性悪化
 * 
 * @param textTraitStateResist
 * @text ステート防止
 * @desc ステート防止特性テキスト。%1にパラメータ名が入る
 * @type string
 * @default %1防止
 * 
 * @param textTraitParamUp
 * @text パラメータレート特性(増加)
 * @desc パラメータレート特性。%1にパラメータ名が入る。
 * @type string
 * @default %1上昇
 * 
 * @param textTraitParamDown
 * @text パラメータレート特性(減少) 
 * @desc パラメータレート特性。%1にパラメータ名が入る。
 * @type string
 * @default %1減少
 * 
 * @param textTraitAttackElement
 * @text 攻撃属性付与特性
 * @desc 攻撃属性付与特性。%1に属性名が入る。
 * @type string
 * @default 攻撃属性%1付与
 * 
 * @param textTraitAttackState
 * @text 攻撃時ステート付与特性文字列
 * @desc 攻撃時ステート付与特性文字列。%1にステート名が入る。
 * @type string
 * @default 攻撃時%1付与
 * 
 * @param textTraitAttackSpeed
 * @text 攻撃速度補正テキスト。
 * @desc 攻撃速度補正テキスト。
 * @type string
 * @default 攻撃速度補正
 * 
 * @param textTraitAttackTimes
 * @text 攻撃回数テキスト
 * @desc 攻撃回数テキスト
 * @type string
 * @default 攻撃回数補正テキスト
 * 
 * @param textTraitAttackSkill
 * @text 攻撃スキルテキスト
 * @desc 攻撃スキルテキスト。%1にスキル名
 * @type string
 * @default 通常攻撃を%1に変更
 * 
 * @param textTraitStypeAdd
 * @text スキルタイプ追加
 * @desc スキルタイプ追加特性。%1にスキルタイプ名
 * @type string
 * @default %1追加
 * 
 * @param textTraitStypeSeal
 * @text スキルタイプ封印
 * @desc スキルタイプ封印特性。%1にスキルタイプ名。
 * @type string
 * @default %1使用不可
 * 
 * @param textTraitSkillAdd
 * @text スキル追加
 * @desc スキル追加特性。%1にスキル名
 * @type string
 * @default %1使用可
 * 
 * @param textTraitSkillSeal
 * @text スキル封印特性
 * @desc スキル封印特性。%1にスキルタイプ名
 * @type string
 * @default %1使用不可
 * 
 * @param textTraitEquipWtype
 * @text 装備武器タイプ追加特性
 * @desc 装備武器タイプ追加特性。%1に武器タイプ名
 * @type string 
 * @default %1装備可
 * 
 * @param textTraitEquipAtype
 * @text 装備防具タイプ追加特性
 * @desc 装備防具タイプ追加特性。%1に武器タイプ名
 * @type string 
 * @default %1装備可
 * 
 * @param textTraitEquipLock
 * @text 装備変更不可特性
 * @desc 装備変更不可特性。%1に装備箇所名
 * @type string 
 * @default %1装備変更不可
 * 
 * @param textTraitEquipSeal
 * @text 装備不可特性
 * @desc 装備不可特性。%1に装備可署名
 * @type string 
 * @default %1装備不可
 * 
 * @param textTraitSlotType
 * @text 装備タイプ変更特性
 * @desc 装備タイプ変更特性。%1に変更先装備タイプ名
 * @type string
 * @default %1に変更
 * 
 * @param textSlotType0
 * @text スロットタイプ0
 * @desc スロットタイプ0の文字列
 * @type string
 * @default
 * 
 * @param textSlotType1
 * @text スロットタイプ1
 * @desc スロットタイプ1の文字列
 * @type string
 * @default 二刀流
 * 
 * @param textTraitActionPlus
 * @text 行動回数追加特性
 * @desc 行動回数追加特性
 * @type string
 * @default 行動回数追加
 * 
 * @param textSpecialFlag0
 * @text スペシャルフラグ0
 * @desc スペシャルフラグ0テキスト。(自動戦闘)
 * @type string
 * @default 自動戦闘
 * 
 * @param textSpecialFlag1
 * @text スペシャルフラグ1
 * @desc スペシャルフラグ1テキスト。(防御)
 * @type string
 * @default 防御
 * 
 * 
 * @param textSpecialFlag2
 * @text スペシャルフラグ2
 * @desc スペシャルフラグ2テキスト。(身代わり)
 * @type string
 * @default 身代わり
 * 
 * @param textCollapseType
 * @text 崩壊タイプ
 * @desc 崩壊タイプテキスト
 * @type string
 * @default 崩壊タイプ変更
 * 
 * @param textPartyAbility0
 * @text パーティーアビリティ0
 * @desc パーティーアビリティ0(ランダムエンカウント率半減)
 * @type string
 * @default ランダムエンカウント率半減
 * 
 * @param textPartyAbility1
 * @text パーティーアビリティ1
 * @desc パーティーアビリティ1(ランダムエンカウント無し)
 * @type string
 * @default ランダムエンカウントなし
 * 
 * @param textPartyAbility2
 * @text パーティーアビリティ2
 * @desc パーティーアビリティ2(不意打ち防止)
 * @type string
 * @default 不意打ち防止
 * 
 * @param textPartyAbility3
 * @text パーティーアビリティ3
 * @desc パーティーアビリティ3(先制攻撃率上昇)
 * @type string
 * @default 先制攻撃率上昇
 * 
 * @param textPartyAbility4
 * @text パーティーアビリティ4
 * @desc パーティーアビリティ4(取得金額2倍)
 * @type string
 * @default 取得金額アップ
 * 
 * @param textPartyAbility5
 * @text パーティーアビリティ5
 * @desc パーティーアビリティ5(ドロップ率2倍)
 * @type string
 * @default ドロップ率アップ
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
 * TextManagerにメソッドを追加しています。
 * TextManager.traitsValue(traits:Array<Trait>) : number
 *     Trait配列から特性値を得る。
 * TextManager.traitName(code:number, dataId:number, value:number) : string
 *     特性名を得る。
 * TextManager.traitValueStr(code:number, dataId:number, value:number) : string
 *     特性値を文字列に変換する。
 * 
 * Traitを実装した場合、以下のエントリに追加すれば上記インタフェースが使用できます。
 * TextManager._traitConverters[code] = {
 *     name: {function(dataId:number, value:number) : string} 特性名を取得する関数
 *     value: {function(traits:Array<trait>) : number} 特性値を取得する関数
 *     str: {function(dataId:number, value:number) : string} 特性値を文字列化する関数
 *     baseValue : {number} 特性を持っていない場合の基準値(増減量を計算するためのもの)
 * };
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
    const textTraitElementRateUp = parameters["textTraitElementRateUp"] || "";
    const textTraitElementRateDown = parameters["textTraitElementRateDown"] || "";
    const textTraitDebuffRate = parameters["textTraitDebuffRate"] || "";
    const textTraitStateRateUp = parameters["textTraitStateRateUp"] || "";
    const textTraitStateRateDown = parameters["textTraitStateRateUp"] || "";
    const textTraitStateResist = parameters["textTraitStateResist"] || "";
    const textTraitParamUp = parameters["textTraitParamUp"] || "";
    const textTraitParamDown = parameters["textTraitParamDown"] || "";
    const textTraitAttackElement = parameters["textTraitAttackElement"] || "";
    const textTraitAttackState = parameters["textTraitAttackState"] || "";
    const textTraitAttackSpeed = parameters["textTraitAttackSpeed"] || "";
    const textTraitAttackTimes = parameters["textTraitAttackTimes"] || "";
    const textTraitAttackSkill = parameters["textTraitAttackSkill"] || "";
    const textTraitStypeAdd = parameters["textTraitStypeAdd"] || "";
    const textTraitStypeSeal = parameters["textTraitStypeSeal"] || "";
    const textTraitSkillAdd = parameters["textTraitSkillAdd"] || "";
    const textTraitSkillSeal = parameters["textTraitSkillSeal"] || "";
    const textTraitEquipWtype = parameters["textTraitEquipWtype"] || "";
    const textTraitEquipAtype = parameters["textTraitEquipAtype"] || "";
    const textTraitEquipLock = parameters["textTraitEquipLock"] || "";
    const textTraitEquipSeal = parameters["textTraitEquipSeal"] || "";
    const textTraitSlotType = parameters["textTraitSlotType"] || "";
    const textTraitActionPlus = parameters["textTraitActionPlus"] || "";
    const textCollapseType = parameters["textCollapseType"] || "";

    //------------------------------------------------------------------------------
    // TextManager

    TextManager._xparam = [];
    for (let i = 2; i < 10; i++) {
        TextManager._xparam[i] = parameters["xparam" + i] || "";
    }

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

    /**
     * 属性名を得る。
     * 
     * @param {number} id 属性ID
     * @returns {string} 属性名
     */
    TextManager.elementName = function(id) {
        return $dataSystem.elements[id] || "";
    };

    /**
     * ステート名を得る。
     * 
     * @param {number} id ステートID
     * @returns {string} ステート名
     */
    TextManager.stateName = function(id) {
        return ($dataStates[id]) ? ($dataStates[id].name) : "";
    };

    /**
     * スキル名を得る。
     * 
     * @param {number} id スキルID
     * @returns {string} スキル名
     */
    TextManager.skillName = function(id) {
        return ($dataSkills[id]) ? ($dataSkills[id.name]) : "";
    };


    /**
     * スキルタイプ名文字列を得る。
     * 
     * @param {number} id スキルタイプID
     * @returns {string} スキルタイプ名
     */
    TextManager.skillTypeName = function(id) {
        return $dataSystem.skillTypes[id] || "";
    };

    /**
     * 武器タイプ名を得る。
     * 
     * @param {number} id 武器タイプID
     * @returns {string} 武器タイプ名
     */
    TextManager.weaponTypeName = function(id) {
        return $dataSystem.weaponTypes[id] || "";
    };
    /**
     * 防具タイプ名を得る。
     * 
     * @param {number} id 防具タイプID
     * @returns {string} 防具タイプ名
     */
    TextManager.armorTypeName = function(id) {
        return $dataSystem.armorTypes[id] || "";
    };

    /**
     * 装備タイプ名を得る。
     * 
     * @param {number} id スロットタイプID
     * @returns {string} 文字列
     */
    TextManager.equipTypeName = function(id) {
        return $dataSystem.equipTypes[id] || "";
    };

    /**
     * 属性防御特性のテキストを得る。
     * 
     * @param {number} dataId データID
     * @param {number} value 値
     * @returns {string} 文字列
     */
    TextManager.traitElementRate = function(dataId, value) {
        const fmt = (value >= 0) ? textTraitElementRateUp : textTraitElementRateDown;
        const elementName = this.elementName(dataId);
        return ((fmt && elementName) ? fmt.format(elementName) : "");
    };
    /**
     * デバフ受付率特性テキスト
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitDebuffRate = function(dataId) {
        const fmt = textTraitDebuffRate;
        const paramName = this.param(dataId);
        return ((fmt && paramName) ?  fmt.format(paramName) : "");
    };

    /**
     * ステート受付率テキスト
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitStateRate = function(dataId, value) {
        const fmt = (value >= 0) ? textTraitStateRateUp : textTraitStateRateDown;
        const stateName = this.stateName(dataId);
        return ((fmt && stateName) ? fmt.format(stateName) : "");
    };
    /**
     * ステート防止テキスト
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitStateResist = function(dataId) {
        const fmt = textTraitStateResist;
        const stateName = this.stateName(dataId);
        return ((fmt && stateName) ?  fmt.format(stateName) : "");
    };

    /**
     * パラメータレート特性文字列を得る。
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitParam = function(dataId, value) {
        const fmt = (value >= 0) ? textTraitParamUp : textTraitParamDown;
        const paramName = this.param(dataId);
        return ((fmt && paramName) ? fmt.format(paramName) : "");
    };

    /**
     * 攻撃属性付与特性文字列を得る。
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitAttackElement = function(dataId) {
        const fmt = textTraitAttackElement;
        const elementName = this.elementName(dataId);
        return ((fmt && elementName) ? fmt.format(elementName) : "");
    };

    /**
     * 攻撃時ステート付与特性文字列を得る。
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitAttackState = function(dataId) {
        const fmt = textTraitAttackState;
        const stateName = this.stateName(dataId);
        return ((fmt && stateName) ? fmt.format(stateName) : "");
    };

    /**
     * 攻撃速度特性名
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitAttakSpeed = function(dataId) {
        return textTraitAttackSpeed;
    };

    /**
     * 攻撃回数特性名
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitAttackTimes = function(dataId) {
        return textTraitAttackTimes;
    };

    /**
     * 攻撃スキル変更特性名
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitAttackSkill = function(dataId) {
        const fmt = textTraitAttackSkill;
        const skillName = this.skillName(dataId);
        return ((fmt && skillName) ? fmt.format(skillName) : "");
    };

    /**
     * スキルタイプ追加特性
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitStypeAdd = function(dataId) {
        const fmt = textTraitStypeAdd;
        const stypeName = this.skillTypeName(dataId);
        return ((fmt && stypeName) ? fmt.format() : "");
    };

    /**
     * スキルタイプ封印特性
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitStypeSeal = function(dataId) {
        const fmt = textTraitStypeSeal;
        const stypeName = this.skillTypeName(dataId);
        return ((fmt && stypeName) ? fmt.format() : "");
    };

    /**
     * スキル追加特性
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitSkillAdd = function(dataId) {
        const fmt = textTraitSkillAdd;
        const skillName = this.skillName(dataId);
        return ((fmt && skillName) ? fmt.format(skillName) : "");
    };

    /**
     * スキル封印特性
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitSkillSeal = function(dataId) {
        const fmt = textTraitSkillSeal;
        const skillName = this.skillName(dataId);
        return ((fmt && skillName) ? fmt.format(skillName) : "");
    };

    /**
     * 装備武器タイプ追加
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitEquipWtype = function(dataId) {
        const fmt = textTraitEquipWtype;
        const wtypeName = this.weaponTypeName(dataId);
        return ((fmt && wtypeName) ? fmt.format(wtypeName) : "");
    };
    /**
     * 装備防具タイプ追加
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitEquipAtype = function(dataId) {
        const fmt = textTraitEquipAtype;
        const atypeName = this.armorTypeName(dataId);
        return ((fmt && atypeName) ? fmt.format(atypeName) : "");
    };

    /**
     * 装備ロック
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitEquipLock = function(dataId) {
        const fmt = textTraitEquipLock;
        const etypeName = this.equipTypeName(dataId);
        return ((fmt && etypeName) ? fmt.format(etypeName) : "");
    };
    /**
     * 装備封印
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    TextManager.traitEquipSeal = function(dataId) {
        const fmt = textTraitEquipSeal;
        const etypeName = this.equipTypeName(dataId);
        return ((fmt && etypeName) ? fmt.format(etypeName) : "");
    };

    TextManager._slotTypes = [];
    TextManager._slotTypes[0] = parameters["textSlotType0"];
    TextManager._slotTypes[1] = parameters["textSlotType1"];

    /**
     * スロットタイプ名
     * 
     * @param {number} id 装備タイプID
     * @returns {string} 文字列
     */
    TextManager.slotTypeName = function(id) {
        return this._slotTypes[id] || "";
    };

    /**
     * スロットタイプ変更
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitSlotType = function(dataId) {
        const fmt = textTraitSlotType;
        const slotTypeName = this.slotTypeName(dataId);
        return ((fmt & slotTypeName) ? fmt.format(slotTypeName) : "");
    };


    /**
     * 行動回数加算特性
     * 
     * @param {number} dataId データID
     * @returns {string} 文字列
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitActionPlus = function(dataId) {
        return textTraitActionPlus;
    };

    TextManager._specialFlags = [];
    TextManager._specialFlags[0] = parameters["textSpecialFlag0"];
    TextManager._specialFlags[1] = parameters["textSpecialFlag1"];
    TextManager._specialFlags[2] = parameters["textSpecialFlag2"];

    /**
     * スペシャルフラグ特性
     * 
     * @param {number} dataId データID
     * @returns {string} スペシャルフラグ特性
     */
    TextManager.traitSpecialflag = function(dataId) {
        return this._specialFlags[dataId] || "";
    };

    /**
     * 崩壊状態特性
     * 
     * @param {number} dataId データID
     * @returns {string} スペシャルフラグ特性
     */
    // eslint-disable-next-line
    TextManager.traitCollapseType = function(dataId) {
        return textCollapseType;
    };

    TextManager._partyAbilityName = [];
    TextManager._partyAbilityName[0] = parameters["textPartyAbility0"] || "";
    TextManager._partyAbilityName[1] = parameters["textPartyAbility1"] || "";
    TextManager._partyAbilityName[2] = parameters["textPartyAbility2"] || "";
    TextManager._partyAbilityName[3] = parameters["textPartyAbility3"] || "";
    TextManager._partyAbilityName[4] = parameters["textPartyAbility4"] || "";
    TextManager._partyAbilityName[5] = parameters["textPartyAbility5"] || "";

    /**
     * パーティーアビリティ特性
     * 
     * @param {number} dataId データID
     * @return {string} パーティーアビリティ名
     */
    TextManager.traitPartyAbility = function(dataId) {
        return this._partyAbilityName[dataId] || "";
    };

    /**
     * 値の乗算合計を得る。
     * 
     * @param {Array<traits>} traits 特性配列
     * @returns {number} 値
     */
    TextManager.traitValuePi = function(traits) {
        return traits.reduce((prev, t) => prev * t.value, 1);
    };
    /**
     * 値の加算合計を得る。
     * 
     * @param {Array<traits>} traits 特性配列
     * @returns {number} 値
     */
    TextManager.traitValueSum = function(traits) {
        return traits.reduce((prev, t) => prev + t.value, 0);
    };

    /**
     * 値の数を得る。
     * 
     * @param {Array<traits>} traits 特性配列
     * @returns {number} 値
     */
    TextManager.traitValueCount = function(traits) {
        return traits.length;
    };

    /**
     * 値の最大値を得る。
     * 
     * @param {Array<traits>} traits 特性配列
     * @returns {number} 値
     */
    TextManager.traitValueMax = function(traits) {
        return traits.reduce((prev, t) => Math.max(prev, t.value), 0);
    };

    /**
     * スペシャルフラグの値を得る。
     * 
     * @param {Array<traits>} traits 特性配列
     * @returns {number} 値
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitValueSpecialFlag = function(traits) {
        return 0;
    };

    /**
     * パーティーアビリティの値を得る。
     * 
     * @param {Array<traits>} traits 特性配列
     * @returns {number} 値
     */
    TextManager.traitValuePartyAbility = function(traits) {
        const dataId = traits[0].dataId;
        switch (dataId) {
            case Game_Party.ABILITY_ENCOUNTER_HALF:
            case Game_Party.ABILITY_ENCOUNTER_NONE:
            case Game_Party.ABILITY_CANCEL_SURPRISE:
            case Game_Party.ABILITY_RAISE_PREEMPTIVE:
            case Game_Party.ABILITY_GOLD_DOUBLE:
            case Game_Party.ABILITY_DROP_ITEM_DOUBLE:
            default:
                return 0;
        }
    };

    /**
     * 0 を返す。
     * 
     * @param {Array<traits>} traits 特性配列
     * @returns {number} 値
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitValueNone = function(traits) {
        return 0;
    };
    /**
     * 値文字列を得る。
     * 
     * @param {number} dataId データID
     * @param {number} value 値
     * @returns {string} 値文字列
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitValueStrInt = function(dataId, value) {
        return (value >= 0) ? ("+" + value) : (String(value));
    };

    /**
     * 割合文字列を得る。
     * 
     * @param {number} dataId データID
     * @param {number} value 値
     * @returns {string} 値文字列
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitValueStrRate = function(dataId, value) {
        const rate = Math.floor(value * 1000) / 100;
        return ((rate >= 0) ? ("+" + rate + "%") : (rate + "%"));
    };

    /**
     * スペシャルフラグ値を得る。
     * 
     * @param {number} dataId データID
     * @param {number} value 値
     * @returns {string} スペシャルフラグ値
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitValueStrSpecialFlag = function(dataId, value) {
        return "";
    };

    /**
     * パーティーアビリティの値を得る。
     * 
     * @param {number} dataId データID
     * @param {number} value 値
     * @returns {string} パーティーアビリティの値文字列を得る。
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitValueStrPartyAbility = function(dataId, value) {
        switch (dataId) {
            case Game_Party.ABILITY_ENCOUNTER_HALF:
            case Game_Party.ABILITY_ENCOUNTER_NONE:
            case Game_Party.ABILITY_CANCEL_SURPRISE:
            case Game_Party.ABILITY_RAISE_PREEMPTIVE:
            case Game_Party.ABILITY_GOLD_DOUBLE:
            case Game_Party.ABILITY_DROP_ITEM_DOUBLE:
            default:
                return "";
        }
    };
    /**
     * 空文字列を返す。
     * 
     * @param {number} dataId データID
     * @param {number} value 値
     * @returns {string} 値文字列
     */
    // eslint-disable-next-line no-unused-vars
    TextManager.traitValueStrNone = function(dataId, value) {
        return "";
    };


    TextManager._traitConverters = [];
    TextManager._traitConverters[Game_BattlerBase.TRAIT_ELEMENT_RATE] = {
        name: TextManager.traitElementRate, value: TextManager.traitValuePi, str: TextManager.traitValueStrRate, baseValue: 1
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_DEBUFF_RATE] = {
        name: TextManager.traitDebuffRate, value: TextManager.traitValuePi, str: TextManager.traitValueStrRate, baseValue: 1
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_STATE_RATE] = {
        name:TextManager.traitStateRate, value:TextManager.traitValuePi, str:TextManager.traitValueStrRate, baseValue:1
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_STATE_RESIST] = {
        name:TextManager.traitStateResist, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue:0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_PARAM] = {
        name:TextManager.traitParam, value:TextManager.traitValuePi, str:TextManager.traitValueStrRate, baseValue:0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_XPARAM] = {
        name:TextManager.xparam, value:TextManager.traitValueSum, str:TextManager.traitValueStrRate, baseValue:0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_SPARAM] = {
        name:TextManager.sparam, value:TextManager.traitValuePi, str:TextManager.traitValueStrRate, baseValue:1
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_ATTACK_ELEMENT] = {
        name:TextManager.traitAttackElement, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue:0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_ATTACK_STATE] = {
        name:TextManager.traitAttackState, value:TextManager.traitValueSum, str:TextManager.traitValueStrRate, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_ATTACK_SPEED] = {
        name:TextManager.traitAttakSpeed, value:TextManager.traitValueSum, str:TextManager.traitValueStrInt, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_ATTACK_TIMES] = {
        name:TextManager.traitAttackTimes, value:TextManager.traitValueCount, str:TextManager.traitValueStrInt, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_ATTACK_SKILL] = {
        name:TextManager.traitAttackSkill, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_STYPE_ADD] = {
        name:TextManager.traitStypeAdd, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_STYPE_SEAL] = {
        name:TextManager.traitStypeSeal, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_SKILL_ADD] = {
        name:TextManager.traitSkillAdd, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_SKILL_SEAL] = {
        name:TextManager.traitSkillSeal, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_EQUIP_WTYPE] = {
        name:TextManager.traitEquipWtype, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_EQUIP_ATYPE] = {
        name:TextManager.traitEquipAtyp, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_EQUIP_LOCK] = {
        name:TextManager.traitEquipLock, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_EQUIP_SEAL] = {
        name:TextManager.traitEquipSeal, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_SLOT_TYPE] = {
        name:TextManager.traitSlotType, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_ACTION_PLUS] = {
        name:TextManager.traitActionPlus, value:TextManager.traitValueCount, str:TextManager.traitValueStrInt, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_SPECIAL_FLAG] = {
        name:TextManager.traitSpecialflag, value:TextManager.traitValueSpecialFlag, str:TextManager.traitValueStrSpecialFlag, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_COLLAPSE_TYPE] = {
        name:TextManager.traitCollapseType, value:TextManager.traitValueNone, str:TextManager.traitValueStrNone, baseValue: 0
    };
    TextManager._traitConverters[Game_BattlerBase.TRAIT_PARTY_ABILITY] = {
        name:TextManager.traitPartyAbility, value:TextManager.traitValuePartyAbility, str:TextManager.traitValueStrPartyAbility, baseValue: 0
    };

    /**
     * 特性を表す文字列を得る。
     * 
     * @param {number} code コード
     * @param {number} dataId データID
     * @param {number} value 値
     */
    TextManager.traitName = function(code, dataId, value) {
        const converter = this._traitConverters[code];
        if (converter) {
            return converter.name.call(this, dataId, value);
        } else {
            return "";
        }
    };

    /**
     * 特性値文字列を得る。
     * 
     * @param {number} code 特性コード
     * @param {number} dataId 特性データID
     * @param {number} value 特性値
     * @returns {string} 特性値文字列
     */
    TextManager.traitValueStr = function(code, dataId, value) {
        const converter = this._traitConverters[code];
        if (converter) {
            return converter.str.call(this, dataId, value);
        } else {
            return "";
        }
    };

    /**
     * ベース値を得る。
     * 
     * @param {number} code コード
     * @returns {number} ベース値
     */
    TextManager.traitBaseValue = function(code) {
        const converter = this._traitConverters[code];
        if (converter) {
            return converter.baseValue;
        } else {
            return 0;
        }
    };

    /**
     * 特性値を得る。
     * 異なる特性値が混在する場合、先頭の特性値に一致するものだけを対象とする。
     * 
     * @param {Array<Trait>} traits 特性配列
     * @returns {number} 値を得る。
     */
    TextManager.traitValue = function(traits) {
        if (traits.length === 0) {
            return 0;
        } else {
            const code = traits[0].code;
            const dataId = traits[0].dataId;
            const converter = this._traitConverters[code];
            if (converter) {
                return converter.value.call(this, traits.filter(t => (t.code === code) && (t.dataId === dataId)));
            } else {
                return 0;
            }
        }
    };






})();

