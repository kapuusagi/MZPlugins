/*:ja
 * @target MZ 
 * @plugindesc TWLD向けステータス画面UIプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Twld
 * @orderAfter Kapu_Base_Twld
 * @orderAfter Kapu_UserSkillOrder
 * @base Kapu_Twld_WeaponMastery
 * @base Kapu_GrowupSystem
 * 
 * @param statusLabelWidth
 * @text ラベル幅
 * @desc ラベルの幅。
 * @type number
 * @default 48
 * 
 * @param enableProfile
 * @text プロフィールを専用画面にする
 * @desc trueにすると、プロフィールを専用ウィンドウで提供する。
 * @type boolean
 * @default false
 * 
 * @param textClassName
 * @text クラス名ラベル
 * @desc 「クラス名」として使用するラベル。
 * @type string
 * @default クラス
 * 
 * @param textNickname
 * @text ニックネームラベル
 * @desc 「ニックネーム」として使用するラベル。
 * @type string
 * @default 通り名
 * 
 * @param textGuildRank
 * @text ギルド欄ラベル
 * @desc 「ギルドランク」として使用するラベル。
 * @type string
 * @default ギルドランク
 * 
 * @param textMaxTp
 * @text 最大Tp
 * @desc 「最大TP」として使用するラベル。
 * @type string
 * @default 最大TP
 * 
 * @param textPassiveSkill
 * @text パッシブスキルラベル
 * @desc 「パッシブスキル」として使用するラベル。
 * @type string
 * @default パッシブスキル
 * 
 * @param textStatus1
 * @text ステータスウィンドウ1ラベル
 * @desc 「基本パラメータ表示」として使用するラベル
 * @type string
 * @default 基本パラメータ
 * 
 * @param textStatus2
 * @text ステータスウィンドウ2ラベル
 * @desc 「属性耐性・特性」として使用するラベル
 * @desc string
 * @default 属性耐性・特性
 * 
 * @param textStatus3
 * @text ステータスウィンドウ3ラベル
 * @desc 「装備標示」として使用されるラベル。
 * @desc string
 * @default ページ3
 * 
 * @param textProfile
 * @text プロフィールラベル
 * @desc 「プロフィール」として使用するラベル。
 * @type string
 * @default プロフィール
 * 
 * @param textPhyPenetration
 * @text 物理貫通率ラベル
 * @desc 「物理貫通率」として使用するラベル。
 * @type string
 * @default 物理貫通
 * 
 * @param textPhyAttenuation
 * @text 物理減衰ラベル
 * @desc 「物理減衰」として使用するラベル。
 * @type string
 * @default 物理減衰
 * 
 * @param textHit
 * @text 基本命中ラベル
 * @desc 「基本命中」として使用するラベル。
 * @type string
 * @default 基本命中
 * 
 * @param textPhyEvacuation
 * @text 物理回避ラベル
 * @desc 「物理回避」として使用するラベル。
 * @type string
 * @default 物理回避
 * 
 * @param textMagPenetration
 * @text 魔法貫通ラベル
 * @desc 「魔法貫通」として使用するラベル。
 * @type string
 * @default 魔法貫通
 * 
 * @param textMagAttenuation
 * @text 魔法減衰ラベル
 * @desc 「魔法減衰」として使用するラベル。
 * @type string
 * @default 魔法減衰
 * 
 * @param textMagEvacuation
 * @text 魔法回避ラベル
 * @desc 「魔法回避」として使用するラベル。
 * @type string
 * @default 魔法回避
 * 
 * @param textCriticalRate
 * @text 会心率ラベル
 * @desc 「会心率」として使用するラベル。
 * @type string
 * @default クリティカル率
 * 
 * @param textCriticalEvacuation
 * @text 会心回避ラベル
 * @desc 「会心回避」として使用するラベル。
 * @type string
 * @default クリティカル回避
 * 
 * @param textPhyCriDamageRate
 * @text クリティカル倍率（物）ラベル
 * @desc 「クリティカル倍率（物）」として使用するラベル。
 * @type string
 * @default クリティカル倍率（物）
 * 
 * @param textMagCriDamageRate
 * @text クリティカル倍率（魔）ラベル
 * @desc 「クリティカル倍率（魔）」として使用するラベル。
 * @type string
 * @default クリティカル倍率（魔）
 * 
 * @param textAbsorb
 * @text 吸収属性を表すテキスト
 * @desc 吸収属性を表すテキスト
 * @type string
 * @default 吸収
 * 
 * @param statusPictureMethod
 * @text ステータス画像メソッド名
 * @desc アクターのステータス画像を取得するメソッドまたはプロパティ名。
 * @type string
 * 
 * @param commandWindowWidth
 * @text コマンド幅
 * @desc コマンドウィンドウ領域の幅
 * @type number
 * @default 240
 * 
 * @param elementEntries1
 * @text 属性表示項目1
 * @desc 属性表示欄1。
 * @type struct<elementEntry>[]
 * 
 * @param elementEntries2
 * @text 属性表示項目2
 * @desc 属性表示欄2。
 * @type struct<elementEntry>[]
 * 
 * @param elementEntries3
 * @text 属性表示項目3
 * @desc 属性表示欄3。
 * @type struct<elementEntry>[]
 * 
 * @param elementEntries4
 * @text 属性表示項目4
 * @desc 属性表示欄4。
 * @type struct<elementEntry>[]
 * 
 * @param statusParamEntries
 * @text 追加パラメータ
 * @desc パラメータウィンドウに追加で標示するパラメータ
 * @type struct<paramEntry>[]
 * 
 * @param textEmptySlot
 * @text 空スロット表示テキスト
 * @desc 空のスロットに表示する文字列。
 * @type string
 * @default 
 * 
 * @param colorAbsorb
 * @text 吸収カラー
 * @desc 吸収属性の文字の描画に使用する色
 * @type string
 * @default rgb(100,255,100)
 *  
 * @param colorAttenuation
 * @text 減衰カラー
 * @desc 減衰属性の文字の描画に使用する色
 * @type string
 * @default rgb(100,180,255)
 *  
 * @param colorAmplification
 * @text 増幅カラー
 * @desc 増幅属性の文字の描画に使用する色
 * @type string
 * @default rgb(255,64,64)
 * 
 * @param weaponMasteryIcons
 * @text ウェポンマスタリアイコン
 * @desc ウェポンマスタリーで使用するアイコン。
 * @type number[]
 * @default []
 * 
 * @param wmGaugeColor1
 * @text WMゲージカラー1
 * @desc ウェポンマスタリゲージカラー1
 * @type string
 * @default rgb(40, 100, 40)
 * 
 * @param wmGaugeColor2
 * @text WMゲージカラー2
 * @desc ウェポンマスタリゲージカラー2
 * @type string
 * @default rgb(128, 255, 128)
 * 
 * @param displayWeaponMasteries
 * @text 表示ウェポンマスタリー
 * @desc 表示するウェポンマスタリータイプIDを配列で指定します。
 * @type number[]
 * @default []
 *  
 * @help 
 * TWLD向けステータス画面UIプラグイン。
 * 
 * ■ 使用時の注意
 * 特にありません。
 * 
 * ■ プラグイン開発者向け
 * 特にありません。
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
 * Version.0.2.0 Kapu_BattlerGenderに対応
 * Version.0.1.1 装備が無いときの文字色が正しくない不具合を修正した。
 * Version.0.1.0 TWLD向けに作成したものをベースに作成。
 */
/*~struct~elementEntry:
 *
 * @param id
 * @text 属性ID
 * @desc 標示する属性のID
 * @type number
 * 
 * @param iconId
 * @text アイコンID
 * @desc 属性に対応するアイコンID
 * @type number
 */
/*~struct~paramEntry:
 *
 * @param label
 * @text ラベル
 * @desc パラメータラベルとして使用するテキスト。
 * @type string
 * 
 * @param getter
 * @text 取得メソッド
 * @desc パラメータを取得する方法。(actor.cnt等)
 * @type string
 * 
 * @param valueType
 * @text 値タイプ
 * @desc 値の標示タイプ
 * @type select
 * @option 割合
 * @value percent
 * @option 値
 * @value value
 * @option フラグ
 * @value flag
 * 
 */

/**
 * Window_StatusCategory
 * ステータスのカテゴリ選択を提供するウィンドウ
 */
function Window_StatusCategory() {
    this.initialize(...arguments);
}

/**
 * スキルタイプ選択画面
 */
function Window_StatusSkillType() {
    this.initialize(...arguments);
}

/**
 * Window_StatusProfile
 * パラメータ情報表示
 */
function Window_StatusProfile() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_Twld_UI_Status";
    const parameters = PluginManager.parameters(pluginName);

    const enableProfile = (typeof parameters["enableProfile"] === "undefined") 
            ? false : (parameters["enableProfile"] === "true");

    const statusLabelWidth = Number(parameters["statusLabelWidth"]) || 80;
    const textClassName = parameters["textClassName"] || "Class";
    const textNickname = parameters["textNickname"] || "Nickname";
    const textPassiveSkill = parameters["textPassiveSkill"] || "PassiveSkill";
    const textGuildRank = parameters["textGuildRank"] || "GuildRank";
    const textMaxTp = parameters["textMaxTp"] || "MaxTP";
    const textStatus1 = parameters["textStatus1"] || "Page.1";
    const textStatus2 = parameters["textStatus2"] || "Page.2";
    const textStatus3 = parameters["textStatus3"] || "Page.3";
    const textProfile = parameters["textProfile"] || "Profile";
    const textPhyPenetration = parameters["textPhyPenetration"] || "P.PEN";
    const textPhyAttenuation = parameters["textPhyAttenuation"] || "DEF.RATE";
    const textHit = parameters["textHit"] || "HIT";
    const textPhyEvacuation = parameters["textPhyEvacuation"] || "P.EVA";
    const textMagPenetration = parameters["textMagPenetration"] || "M.PEN";
    const textMagAttenuation = parameters["textMagAttenuation"] || "MDF.RATE";
    const textMagEvacuation = parameters["textMagEvacuation"] || "M.EVA";
    const textCriticalRate = parameters["textCriticalRate"] || "CRI";
    const textCriticalEvacuation = parameters["textCriticalEvacuation"] || "CEV";
    const textPhyCriDamageRate = parameters["textPhyCriDamageRate"] || "P.CDR";
    const textMagCriDamageRate = parameters["textMagCriDamageRate"] || "M.CDR";
    const textEmptySlot = parameters["textEmptySlot"] || "";
    const textAbsorb = parameters["textAbsorb"] || "(Abs)";
    const colorAbsorb = parameters["colorAbsorb"] || "rgb(100,255,100)";
    const colorAttenuation = parameters["colorAttenuation"] || "rgb(100,180,255)";
    const colorAmplification = parameters["colorAmplification"] || "rgb(255,64,64)";
    const wmGaugeColor1 = parameters["wmGaugeColor1"] || "rgb(40, 100, 40)";
    const wmGaugeColor2 = parameters["wmGaugeColor2"] || "rgb(128, 255, 128)";
    const statusPictureMethod = String(parameters["statusPictureMethod"]) || "";
    const commandWindowWidth = Number(parameters["commandWindowWidth"]) || 240;

    const _parseElementEntries = function(value) {
        const list = [];
        if (value) {
            try {
                const items = JSON.parse(value);
                for (const item of items) {
                    const elementEntry = JSON.parse(item);
                    elementEntry.id = Number(elementEntry.id);
                    elementEntry.iconId = Number(elementEntry.iconId);
                    list.push(elementEntry);
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        return list;
    }

    const elementEntries1 = _parseElementEntries(parameters["elementEntries1"]);
    const elementEntries2 = _parseElementEntries(parameters["elementEntries2"]);
    const elementEntries3 = _parseElementEntries(parameters["elementEntries3"]);
    const elementEntries4 = _parseElementEntries(parameters["elementEntries4"]);

    /**
     * ステータスに表示するカスタムパラメータを得る。
     * 
     * @param {String} value 値文字列
     * @returns {Array<StatusParamEntry>} カスタムパラメータエントリ
     */
    const _parseStatusParamEntries = function(value) {
        const list = [];
        if (value) {
            try {
                const items = JSON.parse(value);
                for (const item of items) {
                    const entry = JSON.parse(item);
                    list.push(entry);
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        return list;
    };

    const statusParamEntries = _parseStatusParamEntries(parameters["statusParamEntries"]);
    /**
     * 整数値配列を得る。
     * 
     * @param {String} value 値文字列
     * @returns {Array<Number>} 値配列
     */
    const _parseIntegerArray = function(value) {
        const array = [];
        if (value) {
            try {
                const args = JSON.parse(value);
                for (const arg of args) {
                    const id = Number(arg) || 0;
                    array.push(id);
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        return array;
    };
    const weaponMasteryIcons = _parseIntegerArray(parameters["weaponMasteryIcons"]);
    const displayWeaponMasteries = _parseIntegerArray(parameters["displayWeaponMasteries"]);
    
    //-----------------------------------------------------------------------------
    // Window_StatusCategory

    Window_StatusCategory.prototype = Object.create(Window_Command.prototype);
    Window_StatusCategory.prototype.constructor = Window_StatusCategory;

    /**
     * Window_StatusCategoryを初期化する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域
     */
    Window_StatusCategory.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };

    /**
     * ウィンドウのカラム数を取得する。
     * @returns {Number} カラム数
     */
    Window_StatusCategory.prototype.maxCols = function() {
        return 1;
    };

    /**
     * ウィンドウの表示行数を取得する。
     * @returns {Number} 表示行数
     */
    Window_StatusCategory.prototype.numVisibleRows = function() {
        return 4;
    };

    /**
     * コマンドリストを作成する。
     */
    Window_StatusCategory.prototype.makeCommandList = function() {
        this.addCommand(textStatus1, "status1");
        this.addCommand(textStatus2, "status2");
        this.addCommand(textStatus3, "status3");
        if (enableProfile) {
            this.addCommand(textProfile, "profile");
        }
        this.addCommand(TextManager.skill, "skill");
    };

    /**
     * indexで指定される項目を選択する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_StatusCategory.prototype.select = function(index) {
        Window_Command.prototype.select.call(this, index);
        this.callHandler("itemChange");
    };

    //------------------------------------------------------------------------------
    // Window_Status
    /**
     * ウィンドウを更新する。
     */
    Window_Status.prototype.refresh = function() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this.contents) {
            this.drawHeader();
            this.drawBlock1();
            this.drawBlock2();
            if (!enableProfile) {
                this.drawBlock3();
            }
        }
    };
    /**
     * ヘッダを描画する。
     */
    Window_Status.prototype.drawHeader = function() {
        const rect = this.headerRect();
        const lineHeight = this.lineHeight();
        this.resetFontSettings();
        this.drawText(textStatus1, rect.x, rect.y, rect.width, "right");
        this.drawHorzLine(rect.x, rect.y + lineHeight, rect.width);
    };

    /**
     * ヘッダの矩形領域を得る。
     * 
     * @returns {Rectangle} ヘッダ矩形領域。
     */
    Window_Status.prototype.headerRect = function() {
        const x = 0;
        const y = 0;
        const w = this.innerWidth;
        const h = this.lineHeight() + 16;
        return new Rectangle(x, y, w, h);
    };

    /**
     * ブロック1を描画する。
     */
    Window_Status.prototype.drawBlock1 = function() {
        const rect = this.block1Rect();
        const actor = this._actor;
        if (actor) {
            const spacing = 16;
            const lineHeight = this.lineHeight();
            const textWidth = Math.floor((rect.width - 172 - spacing * 3) / 3);
            this.resetFontSettings();
            this.drawActorFace(actor, rect.x, rect.y, 160, 160);
            const x1 = rect.x + 172;
            const x2 = x1 + textWidth + spacing;
            const x3 = x2 + textWidth + spacing;
            const y1 = rect.y;
            const y2 = y1 + lineHeight;
            const y3 = y2 + lineHeight;
            const y4 = y3 + lineHeight;
            const y6 = y4 + lineHeight * 2;
            const statesWidth = rect.width - x2;
            this.drawText(actor.name(), x1, y1, textWidth, "left");
            this.drawActorStates(actor, x2, y1, statesWidth);
            this.drawActorClass(actor, x1, y2, textWidth);
            this.drawActorNickname(actor, x2, y2, textWidth);
            this.drawActorPosition(actor, x3, y2, textWidth);
            this.drawActorLevel(actor, x1, y3, textWidth);
            this.drawActorGrowPoint(actor, x2, y3, textWidth);
            this.drawActorGuildRank(actor, x3, y3, textWidth);
            this.drawActorHp(actor, x1, y4 + 8, textWidth);
            this.drawActorMp(actor, x2, y4 + 8, textWidth);
            this.drawActorTp(actor, x3, y4 + 8, textWidth);
            this.drawActorExp(actor, x1, y6, textWidth);
            this.drawActorNext(actor, x2, y6, textWidth);
        }
        this.drawHorzLine(rect.x, rect.y + this.lineHeight() * 6, rect.width);
    };

    /**
     * 装備の描画領域を得る。
     * 
     * @returns {Rectangle} プロフィール描画領域。
     */
    Window_Status.prototype.block1Rect = function() {
        const x = 0;
        const y = this.lineHeight() + 16;
        const w = this.innerWidth;
        const h = this.lineHeight() * 6 + 16;
        return new Rectangle(x, y, w, h);
    };

    /**
     * ブロック2を描画する。
     */
    Window_Status.prototype.drawBlock2 = function() {
        const actor = this._actor;
        if (actor) {
            const rect = this.block2Rect();
            const spacing = 16;
            const lineHeight = this.lineHeight();
            const textWidth = (rect.width - spacing * 3) / 4;
            const lineCount = Math.floor(rect.height / lineHeight);

            const noEquipActor = JsonEx.makeDeepCopy(this._actor);
            const slots = noEquipActor.equipSlots();
            for (let slot = 0; slot < slots.length; slot++) {
                noEquipActor.forceChangeEquip(slot, null);
            }
            noEquipActor.clearStates();

            let x = rect.x;
            this.drawBlock2A(actor, noEquipActor, x, rect.y, textWidth, lineCount);
            x += (textWidth + spacing);
            this.drawBlock2B(actor, noEquipActor, x, rect.y, textWidth, lineCount);
            x += (textWidth + spacing);
            this.drawBlock2C(actor, noEquipActor, x, rect.y, textWidth, lineCount);
            x += (textWidth + spacing);
            this.drawBlock2D(actor, noEquipActor, x, rect.y, textWidth, lineCount);
        }
    };

    /**
     * 2-Aを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Game_Actor} noEquipActor 未装備アクター
     * @param {Number} x 描画開始x位置
     * @param {Number} y 描画開始y位置
     * @param {Number} width 幅
     * @param {Number} maxLineCount 最大行数
     */
    // eslint-disable-next-line no-unused-vars
    Window_Status.prototype.drawBlock2A = function(actor, noEquipActor, x, y, width, maxLineCount) {
        const lineHeight = this.lineHeight();
        if (maxLineCount >= 1) {
            this.drawParamValue(TextManager.basicParam(0), actor.str, noEquipActor.str,
                    x, y + lineHeight * 0, width);
        }
        if (maxLineCount >= 2) {
            this.drawParamValue(TextManager.basicParam(1), actor.dex, noEquipActor.dex,
                    x, y + lineHeight * 1, width);
        }
        if (maxLineCount >= 3) {
            this.drawParamValue(TextManager.basicParam(2), actor.vit, noEquipActor.vit,
                    x, y + lineHeight * 2, width);
        }
        if (maxLineCount >= 4) {
            this.drawParamValue(TextManager.basicParam(3), actor.int, noEquipActor.int,
                    x, y + lineHeight * 3, width);
        }
        if (maxLineCount >= 5) {
            this.drawParamValue(TextManager.basicParam(4), actor.men, noEquipActor.men,
                    x, y + lineHeight * 4, width);
        }
        if (maxLineCount >= 6) {
            this.drawParamValue(TextManager.param(6), actor.agi, noEquipActor.agi,
                    x, y + lineHeight * 5, width);
        }
        if (maxLineCount >= 7) {
            this.drawParamValue(TextManager.param(7), actor.luk, noEquipActor.luk,
                    x, y + lineHeight * 6, width);
        }
    };

    /**
     * 2-Bを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Game_Actor} noEquipActor 未装備アクター
     * @param {Number} x 描画開始x位置
     * @param {Number} y 描画開始y位置
     * @param {Number} width 幅
     * @param {Number} maxLineCount 最大行数
     */
    // eslint-disable-next-line no-unused-vars
    Window_Status.prototype.drawBlock2B = function(actor, noEquipActor, x, y, width, maxLineCount) {
        const lineHeight = this.lineHeight();
        if (maxLineCount >= 1) {
            this.drawParamValue(TextManager.param(2), actor.atk, noEquipActor.atk,
                    x, y + lineHeight * 0, width);
        }
        if ((maxLineCount >= 2) && ("penetratePDR" in actor)) {
            this.drawParamRate(textPhyPenetration, actor.penetratePDR(), noEquipActor.penetratePDR(),
                    x, y + lineHeight * 1, width);
        }
        if (maxLineCount >= 3) {
            this.drawParamValue(TextManager.param(3), actor.def, noEquipActor.def,
                    x, y + lineHeight * 2, width);
        }
        if (maxLineCount >= 4) {
            this.drawParamRate(textPhyAttenuation, 1 - actor.pdr, 1 - noEquipActor.pdr,
                    x, y + lineHeight * 3, width);
        }
        if (maxLineCount >= 5) {
            this.drawParamRate(textHit, actor.hit, noEquipActor.hit,
                x, y + lineHeight * 4, width);
        }
        if (maxLineCount >= 6) {
            this.drawParamRate(textPhyEvacuation, actor.eva, noEquipActor.eva,
                    x, y + lineHeight * 5, width);
        }
    };

    /**
     * 2-Cを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Game_Actor} noEquipActor 未装備アクター
     * @param {Number} x 描画開始x位置
     * @param {Number} y 描画開始y位置
     * @param {Number} width 幅
     * @param {Number} maxLineCount 最大行数
     */
    // eslint-disable-next-line no-unused-vars
    Window_Status.prototype.drawBlock2C = function(actor, noEquipActor, x, y, width, maxLineCount) {
        const lineHeight = this.lineHeight();
        if (maxLineCount >= 1) {
            this.drawParamValue(TextManager.param(3), actor.mat, noEquipActor.mat,
                    x, y + lineHeight * 0, width);
        }
        if ((maxLineCount >= 2) && ("penetrateMDR" in actor)) {
            this.drawParamRate(textMagPenetration, actor.penetrateMDR(), noEquipActor.penetrateMDR(),
                    x, y + lineHeight * 1, width);
        }
        if (maxLineCount >= 3) {
            this.drawParamValue(TextManager.param(4), actor.mdf, noEquipActor.mdf,
                    x, y + lineHeight * 2, width);
        }
        if (maxLineCount >= 4) {
            this.drawParamRate(textMagAttenuation, 1 - actor.mdr, 1 - noEquipActor.mdr,
                    x, y + lineHeight * 3, width);
        }
        if (maxLineCount >= 6) {
            this.drawParamRate(textMagEvacuation, actor.mev, noEquipActor.mev,
                    x, y + lineHeight * 5, width);
        }
    };
    /**
     * 2-Dを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Game_Actor} noEquipActor 未装備アクター
     * @param {Number} x 描画開始x位置
     * @param {Number} y 描画開始y位置
     * @param {Number} width 幅
     * @param {Number} maxLineCount 最大行数
     */
    // eslint-disable-next-line no-unused-vars
    Window_Status.prototype.drawBlock2D = function(actor, noEquipActor, x, y, width, maxLineCount) {
        // CRI/CEV/CDR
        const lineHeight = this.lineHeight();
        this.drawParamRate(textCriticalRate, actor.cri, noEquipActor.cri,
                x, y + lineHeight * 0, width);
        this.drawParamRate(textCriticalEvacuation, actor.cev, noEquipActor.cev,
                x, y + lineHeight * 1, width);
        this.drawParamRate(textPhyCriDamageRate, actor.pcdr, noEquipActor.pcdr, 
                x, y + lineHeight * 2, width);
        this.drawParamRate(textMagCriDamageRate, actor.mcdr, noEquipActor.mcdr,
                x, y + lineHeight * 3, width);
    };

    /**
     * 整数値タイプのパラメータを描画する。
     * 
     * @param {String} paramName パラメータ名
     * @param {Number} value1 値1（現在値）
     * @param {Number} value2 値2（未装備値）
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawParamValue = function(paramName, value1, value2, x, y, width) {
        if (typeof value1 === "undefined") {
            return;
        }
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(paramName, x, y, statusLabelWidth);
        const valueWidth = Math.floor((width - statusLabelWidth) * 0.5);
        this.resetTextColor();
        this.drawText(value1, x + statusLabelWidth, y, valueWidth, "right");
        const diff = value1 - value2;
        if (diff === 0) {
            return;
        }
        this.contents.fontSize -= 8;
        const diffStr = "(" + ((diff > 0) ? "+" : "") + diff + ")";
        this.changePaintOpacity(false);
        this.drawText(diffStr, x + statusLabelWidth + valueWidth, y + 2, valueWidth, "left");
        this.changePaintOpacity(true);
    };

    /**
     * 割合タイプのパラメータを描画する。
     * 
     * @param {String} paramName パラメータ名
     * @param {Number} value1 値1（現在値）
     * @param {Number} value2 値2（未装備値）
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawParamRate = function(paramName, value1, value2, x, y, width) {
        if (typeof value1 === "undefined") {
            return;
        }
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(paramName, x, y, statusLabelWidth);
        const valueWidth = Math.floor((width - statusLabelWidth) * 0.5);
        this.resetTextColor();
        const rateStr = Math.floor(value1 * 1000) / 10;
        this.drawText(rateStr, x + statusLabelWidth, y, valueWidth, "right");
        const charWidth = this.textWidth("%");
        this.drawText("%", x + statusLabelWidth + valueWidth, y, charWidth);
        const diff = value1 - value2;
        if (diff === 0) {
            return;
        }
        this.contents.fontSize -= 8;
        const diffRateStr = Math.floor(diff * 1000) / 10;
        const diffStr = "(" + ((diff > 0) ? "+" : "") + diffRateStr + "%)";
        this.changePaintOpacity(false);
        this.drawText(diffStr, x + statusLabelWidth + valueWidth + charWidth, y + 2,
             valueWidth - charWidth, "left");
        this.changePaintOpacity(true);
    };
    /**
     * ブロック2の描画領域を得る。
     * 
     * @returns {Rectangle} 描画領域。
     */
    Window_Status.prototype.block2Rect = function() {
        const block1Rect = this.block1Rect();
        const block3Rect = this.block3Rect();
        const x = 0;
        const y = block1Rect.y + block1Rect.height;
        const w = this.innerWidth;
        const h = block3Rect.y - y;
        return new Rectangle(x, y, w, h);
    };

    /**
     * ブロック3を描画する。
     */
    Window_Status.prototype.drawBlock3 = function() {
        const rect = this.block3Rect();
        this.drawHorzLine(rect.x, rect.y, rect.width);

        const actor = this._actor;
        if (actor) {
            this.drawTextEx(actor.profile(), rect.x, rect.y + 16, rect.width);
        }
    };

    /**
     * ブロック3の描画領域を得る。
     * Block3はプロフィール
     * 
     * @returns {Rectangle} 描画領域。
     */
    Window_Status.prototype.block3Rect = function() {
        const w = this.innerWidth;
        const h = (enableProfile) ? 0 : (this.lineHeight() * 2 + 16);
        const x = 0;
        const y = this.innerHeight - h;
        return new Rectangle(x, y, w, h);
    };

    /**
     * 水平ラインを描画する。
     * 
     * @param {Number} x 描画x位置
     * @param {Number} y 描画y位置
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawHorzLine = function(x, y, width) {
        this.changePaintOpacity(false);
        this.drawRect(x, y + 5, width, 5);
        this.changePaintOpacity(true);
    };

    /**
     * レベルを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    // eslint-disable-next-line no-unused-vars
    Window_Status.prototype.drawActorLevel = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.levelA, x, y, statusLabelWidth);
        this.resetTextColor();
        const valueWidth = Math.min(this.textWidth("000"), width - statusLabelWidth);
        this.drawText(actor.level, x + statusLabelWidth, y, valueWidth, "right");
    };
    /**
     * 育成ポイントを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorGrowPoint = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.growPoint, x, y, statusLabelWidth);
        this.resetTextColor();
        const valueWidth = Math.min(this.textWidth("000"), width - statusLabelWidth);
        this.drawText(actor.growPoint(), x + statusLabelWidth, y, valueWidth, "right");
    };
    /**
     * ギルドランクを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorGuildRank = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textGuildRank, x, y, statusLabelWidth);
        this.resetTextColor();
        const valueWidth = Math.min(this.textWidth("000"), width - statusLabelWidth);
        this.drawText("-", x + statusLabelWidth, y, valueWidth, "right");
    };
    /**
     * EXPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorExp = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.exp, x, y, statusLabelWidth);
        this.resetTextColor();
        const valueWidth = width - statusLabelWidth;
        this.drawText(this.expTotalValue(), x + statusLabelWidth, y, valueWidth, "right");
    };
    /**
     * NextExpを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorNext = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        const expNext = TextManager.expNext.format(TextManager.level);
        this.drawText(expNext, x, y, statusLabelWidth);
        this.resetTextColor();
        const valueWidth = width - statusLabelWidth;
        this.drawText(this.expNextValue(), x + statusLabelWidth, y, valueWidth, "right");
    };
    
    /**
     * アクターのHPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorHp = function(actor, x, y, width) {
        // ゲージ描画
        const current = actor.hp;
        const max = actor.mhp;
        const gaugeData = {
            rate:((max > 0) ? current / max : 0),
            backColor:ColorManager.gaugeBackColor(),
            color1:ColorManager.hpGaugeColor1(),
            color2:ColorManager.hpGaugeColor2()
        };
        const spacing = 16;
        const labelWidth = Math.floor(width * 0.2);
        const gaugeX = x + labelWidth + spacing;
        const gaugeWidth = width - labelWidth - spacing;
        this.drawGaugeRect(gaugeData, gaugeX, y + 24, gaugeWidth, 12);
        
        // テキスト描画
        const data = {
            label:TextManager.hpA,
            color:ColorManager.hpColor(actor),
            current:current,
            max:max
        };
        this.drawGaugeText(data, x, y, width);
    };

    /**
     * アクターのMPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorMp = function(actor, x, y, width) {
        // ゲージ描画
        const current = actor.mp;
        const max = actor.mmp;
        const gaugeData = {
            rate:((max > 0) ? current / max : 0),
            backColor:ColorManager.gaugeBackColor(),
            color1:ColorManager.mpGaugeColor1(),
            color2:ColorManager.mpGaugeColor2()
        };
        const spacing = 16;
        const labelWidth = Math.floor(width * 0.2);
        const gaugeX = x + labelWidth + spacing;
        const gaugeWidth = width - labelWidth - spacing;
        this.drawGaugeRect(gaugeData, gaugeX, y + 24, gaugeWidth, 12);
        // テキスト描画
        const data = {
            label:TextManager.mpA,
            color:ColorManager.mpColor(actor),
            current:current,
            max:max
        };
        this.drawGaugeText(data, x, y, width);
    };

    /**
     * アクターのTPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上x
     * @param {Number} y 描画領域左上y
     * @param {Number} width 幅
     */
    // eslint-disable-next-line no-unused-vars
    Window_Status.prototype.drawActorTp = function(actor, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(textMaxTp, x, y + 8, statusLabelWidth, "left");
        const valueWidth = this.textWidth("000");
        this.changeTextColor(ColorManager.tpColor(actor));
        this.contents.fontSize = $gameSystem.mainFontSize() + 8;
        this.drawText(actor.maxTp(), x + statusLabelWidth + 16, y, valueWidth, "right");
    };


    /**
     * ゲージを描画する。
     * 
     * @param {Object} gaugeData ゲージデータ。rate, backColor, color1, color2メンバを持つ。
     * @param {Number} x ゲージ左上位置x
     * @param {Number} y ゲージ左上位置y
     * @param {Number} width 幅
     * @param {Number} height 高さ
     */
    Window_Status.prototype.drawGaugeRect = function(gaugeData, x, y, width, height) {
        const rate = gaugeData.rate;
        const fillW = Math.floor((width - 2) * rate);
        const fillH = height - 2;
        const color0 = gaugeData.backColor;
        const color1 = gaugeData.color1;
        const color2 = gaugeData.color2;
        this.contents.fillRect(x, y, width, height, color0);
        this.contents.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
    };

    /**
     * ゲージのテキストを描画する。
     * 
     * @param {Object} data データ
     * @param {Number} x ラベル左上位置 x
     * @param {Number} y ラベル左上位置 y
     * @param {Number} width 幅
     */
    // eslint-disable-next-line no-unused-vars
    Window_Status.prototype.drawGaugeText = function(data, x, y, width) {
        const paramWidth = Math.floor(width * 0.2);
        const maxValueWidth = Math.floor(width * 0.3);
        const currentValueWidth = width - paramWidth - maxValueWidth - 16;

        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(data.label, x, y + 8, paramWidth, "left");
        x += paramWidth;
        this.changeTextColor(data.color);
        this.contents.fontSize = $gameSystem.mainFontSize() + 8;
        this.drawText(data.current, x, y, currentValueWidth, "right");
        x += currentValueWidth;
        this.contents.fontSize = $gameSystem.mainFontSize() - 2;
        this.drawText("/", x, y + 8, 16, "center");
        x += 16;
        this.contents.fontSize = $gameSystem.mainFontSize() + 8;
        this.drawText(data.max, x, y, maxValueWidth, "right");
    };
    /**
     * アクターの顔グラフィックを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上X
     * @param {Number} y 描画領域左上Y
     * @param {Number} width 幅
     * @param {Number} height 高さ
     */
    Window_Status.prototype.drawActorFace = function(actor, x, y, width, height) {
        if (actor.isDead()) {
            this.contents.context.filter = "grayscale(100%)";
        }
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
        this.contents.context.filter = "none";
    };

    /**
     * アクターのクラスを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上X
     * @param {Number} y 描画領域左上Y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorClass = function(actor, x, y, width) {
        const displayClassName = actor.currentClass().name + ((actor.gender) ? ("\u30fb" + actor.gender) : "");
        if (textClassName && statusLabelWidth) {
            // ニックネームラベル描画あり
            const spacing = 8;
            const nameWidth = width - statusLabelWidth - spacing;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(textClassName, x, y, statusLabelWidth);
            this.resetTextColor();
            this.drawText(displayClassName, x + statusLabelWidth + spacing, y, nameWidth, "left");
        } else {
            // ニックネーム描画なし。
            this.drawText(displayClassName, x, y, width, "left");
        }
    };

    /**
     * アクターのニックネームを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上X
     * @param {Number} y 描画領域左上Y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorNickname = function(actor, x, y, width) {
        const nickName = actor.nickname();
        if (nickName) {
            if (textNickname && statusLabelWidth) {
                // ニックネームラベル描画あり
                const spacing = 8;
                const nameWidth = width - statusLabelWidth - spacing;
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(textNickname, x, y, statusLabelWidth);
                this.resetTextColor();
                this.drawText(actor.nickname(), x + statusLabelWidth + spacing, y, nameWidth, "left");
            } else {
                // ニックネームラベル描画なし。
                this.drawText(actor.nickname(), x, y, textWidth, "left");
            }
        }
    };

    /**
     * アクターの位置を描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上X
     * @param {Number} y 描画領域左上Y
     * @param {Number} width 幅
     */
    // eslint-disable-next-line no-unused-vars
    Window_Status.prototype.drawActorPosition = function(actor, x, w, width) {
        // 何かあれば
    };

    /**
     * アクターのステートを標示する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画領域左上X
     * @param {Number} y 描画領域左上Y
     * @param {Number} width 幅
     */
    Window_Status.prototype.drawActorStates = function(actor, x, y, width) {
        const icons = actor.stateIcons();
        let i = 0;
        const iconOffsetX = (36 - ImageManager.iconWidth) / 2;
        const iconOffsetY = (this.lineHeight() - ImageManager.iconWidth) / 2;
        const drawWidth = ImageManager.iconWidth + 2;
        for (let offset = 0; (offset + drawWidth) <= width; offset += drawWidth) {
            this.drawIcon(icons[i], x + offset + iconOffsetX, y + iconOffsetY);
            i++;
        }
    };

    /**
     * ステータスラベルの幅を得る。
     * 
     * @returns {Number} ステータスラベルの幅
     */
    Window_Status.prototype.statusLabelWidth = function() {
        return statusLabelWidth;
    };

    //------------------------------------------------------------------------------
    // Window_StatusParams
    Window_StatusParams.prototype.refresh = function() {
        if (this.contents) {
            this.contents.clear();
            this.drawHeader();
            this.drawBlock1();
            this.drawBlock2();
        }
    };
    /**
     * ヘッダを描画する。
     */
    Window_StatusParams.prototype.drawHeader = function() {
        const rect = this.headerRect();
        const lineHeight = this.lineHeight();
        this.resetFontSettings();
        this.drawText(textStatus2, rect.x, rect.y, rect.width, "right");
        this.drawHorzLine(rect.x, rect.y + lineHeight, rect.width);
    };

    /**
     * ヘッダの矩形領域を得る。
     * 
     * @returns {Rectangle} ヘッダ矩形領域。
     */
    Window_StatusParams.prototype.headerRect = function() {
        const x = 0;
        const y = 0;
        const w = this.innerWidth;
        const h = this.lineHeight() + 16;
        return new Rectangle(x, y, w, h);
    };

    /**
     * ブロック1を描画する。
     */
    Window_StatusParams.prototype.drawBlock1 = function() {
        const rect = this.block1Rect();
        const actor = this._actor;
        if (actor) {
            const spacing = 16;
            const itemWidth = Math.floor((rect.width - spacing * 4) / 4);
            const x1 = rect.x;
            const x2 = x1 + itemWidth + spacing;
            const x3 = x2 + itemWidth + spacing;
            const x4 = x3 + itemWidth + spacing;
            this.drawElementRates(x1, rect.y, itemWidth, elementEntries1);
            this.drawElementRates(x2, rect.y, itemWidth, elementEntries2);
            this.drawElementRates(x3, rect.y, itemWidth, elementEntries3);
            this.drawElementRates(x4, rect.y, itemWidth, elementEntries4);
        }
        this.drawHorzLine(rect.x, rect.y + this.lineHeight() * 5, rect.width)
    };

    /**
     * 属性レート配列を描画する。
     * 
     * @param {Number} x 描画x位置
     * @param {Number} y 描画y位置
     * @param {Number} width 描画幅
     * @param {Array<Object>} 属性エントリ配列
     */
    Window_StatusParams.prototype.drawElementRates = function(x, y, width, elementEntries) {
        const lineHeight = this.lineHeight();
        for (let i = 0; i < elementEntries.length; i++) {
            const entry = elementEntries[i];
            this.drawElementRate(entry, this._actor, x, y + lineHeight * i, width);
        }
    };
    /**
     * 属性レートのパラメータを描画する。
     * 
     * @param {Object} entry 属性エントリ
     * @param {Game_Actor} actor アクター
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 幅
     */
    Window_StatusParams.prototype.drawElementRate = function(entry, actor, x, y, width) {
        if (!actor) {
            return;
        }
        if ((entry.id <= 0) && (entry.id >= $dataSystem.elements.length)) {
            return;
        }

        this.drawIcon(entry.iconId, x, y);

        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        const elementName = $dataSystem.elements[entry.id];
        const labelWidth = Math.min(statusLabelWidth, Math.floor((width - 40) * 0.3));
        this.drawText(elementName, x + 40, y, labelWidth);
        
        const valueWidth = width - 40 - labelWidth;
        const elementRate = actor.elementRate(entry.id);

        const rateStr = (elementRate >= 0)
                ? (Math.floor(elementRate * 1000) / 10) + "%"
                : ((Math.floor(-elementRate * 1000) / 10) + "%" + textAbsorb);

        if (elementRate < 0) {
            this.changeTextColor(colorAbsorb);
        } else if (elementRate === 0) {
            this.changePaintOpacity(false);
        } else if (elementRate < 1) {
            this.changeTextColor(colorAttenuation);
        } else if (elementRate > 1) {
            this.changeTextColor(colorAmplification);
        } else {
            this.resetTextColor();
        }
        this.drawText(rateStr, x + 40 + labelWidth, y, valueWidth);
        this.changePaintOpacity(true);
    };
    /**
     * ブロック1の描画領域を得る。
     * 
     * @returns {Rectangle} プロフィール描画領域。
     */
    Window_StatusParams.prototype.block1Rect = function() {
        const x = 0;
        const y = this.lineHeight() + 16;
        const w = this.innerWidth;
        const h = this.lineHeight() * 5 + 16;
        return new Rectangle(x, y, w, h);
    };

    /**
     * ブロック2を描画する。
     */
    Window_StatusParams.prototype.drawBlock2 = function() {
        const actor = this._actor;
        if (actor) {
            const lineHeight = this.lineHeight();
            const rect = this.block2Rect();
            const maxLineCount = Math.floor(rect.height / lineHeight);
            const spacing = 16;
            const itemWidth = Math.floor((rect.width - spacing * 4) / 4);

            const paramItems = this.actorParams(actor);
            let x = rect.x;
            let line = 0;
            for (const paramItem of paramItems) {
                this.drawParamItem(paramItem, x, rect.y + lineHeight * line, itemWidth);
                x += (itemWidth + spacing);
                if (x >= (rect.x + rect.width)) {
                    x = rect.x;
                    line++;
                    if (line >= maxLineCount) {
                        break; // これ以上表示できない。
                    }
                }
            }
        }
    };

    /**
     * アクターのパラメータ一覧を得る。
     * 
     * @param {Game_Actor} actor アクター
     * @returns {Array<Object>} パラメータ一覧
     */
    Window_StatusParams.prototype.actorParams = function(actor) {
        //     MRF/CNT/HRG/MRG/TRG/TGR/GRD/REC/PHA (0以外なら表示)
        //     ドロップレート/取得ゴールドレート/EXPレート
        const paramItems = [];
        for (const paramEntry of statusParamEntries) {
            if (paramEntry.getter) {
                const a = actor; // eslint-disable-line no-unused-vars
                let value = eval(paramEntry.getter);
                if (value !== 0) {
                    const paramItem = {};
                    paramItem.label = paramEntry.label;
                    if (paramEntry.valueType === "percent") {
                        const rateStr = (Math.floor(value * 1000) / 10) + "%"
                        paramItem.value = (value >= 0) ? "+" + rateStr : rateStr;
                    } else if (paramEntry.valueType === "flag") {
                        paramItem.value = "";
                    } else {
                        paramItem.value = (value >= 0) ? "+" + value : value;
                    }
                    paramItems.push(paramItem);
                }
            }
        }

        return paramItems;
    };



    /**
     * パラメータを描画する。
     * 
     * @param {Object} paramItem パラメータ
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 描画幅
     */
    Window_StatusParams.prototype.drawParamItem = function(paramItem, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(paramItem.label, x, y, statusLabelWidth);
        this.resetTextColor();
        const valueWidth = width - statusLabelWidth - 16;
        this.drawText(paramItem.value, x + statusLabelWidth + 16, y, valueWidth);
    };
    /**
     * ブロック2の描画領域を得る。
     * 
     * @returns {Rectangle} 描画領域。
     */
    Window_StatusParams.prototype.block2Rect = function() {
        const rect = this.block1Rect();
        const x = 0;
        const y = rect.y + rect.height;
        const w = this.innerWidth;
        const h = this.innerHeight - y;
        return new Rectangle(x, y, w, h);
    };
    /**
     * 水平ラインを描画する。
     * 
     * @param {Number} x 描画x位置
     * @param {Number} y 描画y位置
     * @param {Number} width 幅
     */
    Window_StatusParams.prototype.drawHorzLine = function(x, y, width) {
        this.changePaintOpacity(false);
        this.drawRect(x, y + 5, width, 5);
        this.changePaintOpacity(true);
    };

    //------------------------------------------------------------------------------
    // Window_StatusEquip
    /**
     * Window_Status_Equipを描画する。
     */
    Window_StatusEquip.prototype.refresh = function() {
        if (this.contents) {
            this.contents.clear();
            this.drawHeader();
            this.drawEquip();
            this.drawWeaponMasteries();
        }
    };

    /**
     * ヘッダを描画する。
     */
    Window_StatusEquip.prototype.drawHeader = function() {
        const rect = this.headerRect();
        const lineHeight = this.lineHeight();
        this.resetFontSettings();
        this.drawText(textStatus3, rect.x, rect.y, rect.width, "right");
        this.drawHorzLine(rect.x, rect.y + lineHeight, rect.width);
    };
    /**
     * ヘッダの矩形領域を得る。
     * 
     * @returns {Rectangle} ヘッダ矩形領域。
     */
    Window_StatusEquip.prototype.headerRect = function() {
        const x = 0;
        const y = 0;
        const w = this.innerWidth;
        const h = this.lineHeight() + 16;
        return new Rectangle(x, y, w, h);
    };
    /**
     * 装備の描画領域を得る。
     */
    Window_StatusEquip.prototype.drawEquip = function() {
        const lineHeight = this.lineHeight();
        const rect = this.equipRect();
        const actor = this._actor;
        if (actor) {
            // 装備一覧を描画する。
            const slots = actor.equipSlots();
            const equips = actor.equips();
            for (let i = 0; i < slots.length; i++) {
                const slotName = $dataSystem.equipTypes[slots[i]];
                this.drawEquipSlot(slotName, equips[i], rect.x, rect.y + lineHeight * i, rect.width);
            }
        }

        this.drawHorzLine(rect.x, rect.y + lineHeight * 8, rect.width);
    };

    /**
     * 装備スロットを描画する。
     * 
     * @param {String} スロット名
     * @param {Object} item 装備品(DataWeapon/DataArmor)
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 描画幅
     */
    Window_StatusEquip.prototype.drawEquipSlot = function(slotName, item, x, y, width) {
        const spacing = 16;
        const labelWidth = Math.min(statusLabelWidth, Math.floor(width * 0.3));
        const nameWidth = width - labelWidth - spacing;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(slotName, x, y, labelWidth, this.lineHeight());
        this.drawEquipItemName(item, x + labelWidth + spacing, y, nameWidth);
    };

    /**
     * 装備品名を描画する。
     * 
     * @param {Object} item アイテム(DataWeapon/DataSKill)
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 描画幅
     */
    Window_StatusEquip.prototype.drawEquipItemName = function(item, x, y, width) {
        if (item) {
            this.drawItemName(item, x, y, width);
        } else {
            const textMargin = ImageManager.iconWidth + 4;
            const itemWidth = Math.max(0, width - textMargin);
            this.resetTextColor();
            this.drawText(textEmptySlot, x + textMargin, y, itemWidth);
        }
    };

    /**
     * 装備の描画領域を得る。
     * 
     * @returns {Rectangle} プロフィール描画領域。
     */
    Window_StatusEquip.prototype.equipRect = function() {
        const x = 0;
        const y = this.lineHeight() + 16;
        const w = this.innerWidth;
        const h = this.lineHeight() * 8 + 16;
        return new Rectangle(x, y, w, h);
    };

    /**
     * ウェポンマスタリを描画する。
     */
    Window_StatusEquip.prototype.drawWeaponMasteries = function() {
        const actor = this._actor;
        if (actor) {
            const rect = this.weaponMasteryRect();
            const lineHeight = this.lineHeight();
            const lineCount = Math.floor(rect.height / lineHeight);
            const spacing = 16;
            const itemWidth = Math.floor((rect.width - spacing * 3) / 3);
            const wms = this.displayWeaponMasteries(actor);
            let column = 0;
            let line = 0;
            let x = rect.x;
            for (const wm of wms) {
                this.drawWeaponMastery(wm, x, rect.y + lineHeight * line, itemWidth);
                line++;
                if (line > lineCount) {
                    column++;
                    x += (itemWidth + spacing);
                    if (column >= 3) {
                        break;
                    }
                }
            }
        }
    };

    /**
     * ウェポンマスタリーを描画する。
     * 
     * @param {Object} wm ウェポンマスタリー
     * @param {Number} x 描画x位置
     * @param {Number} y 描画y位置
     * @param {Number} width 描画幅
     */
    Window_StatusEquip.prototype.drawWeaponMastery = function(wm, x, y, width) {
        const lineHeight = this.lineHeight();
        if (wm.iconId) {
            const iconX = x;
            const iconY = y + (lineHeight - ImageManager.iconHeight) / 2;
            this.drawIcon(wm.iconId, iconX, iconY);
        }

        const labelWidth = Math.floor((width - ImageManager.iconWidth - 4) * 0.5);
        const levelWidth = width - labelWidth - 4;
        const x1 = x + ImageManager.iconWidth + 4;
        const x2 = x1 + labelWidth;

        // ゲージ描画
        const rate = (wm.expNext !== 0) ? wm.exp / wm.expNext : 0;
        const gaugeHeight = Math.floor(lineHeight * 0.4);
        const gaugeY = y + lineHeight - gaugeHeight;
        this.drawExpGauge(rate, x2, gaugeY, levelWidth, gaugeHeight);


        // 名前
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(wm.name, x1, y, labelWidth);

        // Lv描画
        this.resetTextColor();
        this.drawText(TextManager.levelA + " " + wm.level, x2, y, levelWidth, "right");
    };

    /**
     * ゲージを描画する。
     * 
     * @param {Number} rate 割合
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 描画幅
     * @param {Number} height 描画高
     */
    Window_StatusEquip.prototype.drawExpGauge = function(rate, x, y, width, height) {
        const fillW = Math.floor((width - 2) * rate);
        const fillH = height - 2;
        const color0 = ColorManager.gaugeBackColor();
        const color1 = wmGaugeColor1;
        const color2 = wmGaugeColor2;
        this.contents.fillRect(x, y, width, height, color0);
        this.contents.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
    };

    /**
     * 標示するウェポンマスタリーを得る。
     * 
     * @param {Game_Actor} actor 
     * @returns {Array<Object>} 標示するウェポンマスタリデータの配列。
     */
    Window_StatusEquip.prototype.displayWeaponMasteries = function(actor) {
        const wms = [];
        for (let id of displayWeaponMasteries) {
            const level = actor.wmLevel(id);
            if (level > 0) {
                const iconId = weaponMasteryIcons[id - 1] || 0;
                const name = $dataSystem.weaponTypes[id];
                const exp = actor.wmExp(id);
                const expNext = actor.wmExpNext(id);
                wms.push({
                    id:id,
                    iconId:iconId,
                    name:name,
                    level:level,
                    exp:exp,
                    expNext:expNext
                });
            }
        }
        return wms;
    };

    /**
     * ウェポンマスタリの描画領域を得る。
     * 
     * @returns {Rectangle} 描画領域。
     */
    Window_StatusEquip.prototype.weaponMasteryRect = function() {
        const rect = this.equipRect();
        const x = 0;
        const y = rect.y + rect.height;
        const w = this.innerWidth;
        const h = this.innerHeight - y;
        return new Rectangle(x, y, w, h);
    };
    /**
     * 水平ラインを描画する。
     * 
     * @param {Number} x 描画x位置
     * @param {Number} y 描画y位置
     * @param {Number} width 幅
     */
    Window_StatusEquip.prototype.drawHorzLine = function(x, y, width) {
        this.changePaintOpacity(false);
        this.drawRect(x, y + 5, width, 5);
        this.changePaintOpacity(true);
    };

    //------------------------------------------------------------------------------
    // Window_StatusSkillType
    // 
    Window_StatusSkillType.prototype = Object.create(Window_Command.prototype);
    Window_StatusSkillType.prototype.constructor = Window_StatusSkillType;

    /**
     * Window_StatusSkillTypeを初期化する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域
     */
    Window_StatusSkillType.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this._actor = null;
    };

    /**
     * アクターを設定する。
     */
    Window_StatusSkillType.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.selectLast();
        }
    };
    
    /**
     * コマンドリストを構築する。
     */
    Window_StatusSkillType.prototype.makeCommandList = function() {
        if (this._actor) {
            const skillTypes = this._actor.addedSkillTypes();
            skillTypes.sort(function(a, b) {
                return a - b;
            });
            for (const stypeId of skillTypes) {
                if (stypeId > 0) {
                    const name = $dataSystem.skillTypes[stypeId];
                    this.addCommand(name, "skill", true, stypeId);
                }
            }
            
            // 更にパッシブスキルを追加
            if (this._actor.hasPassiveSkill()) {
                const stypeId = Game_BattlerBase.PASSIVE_SKILL_TYPE || 0;
                this.addCommand(textPassiveSkill, "passive", true, stypeId);
            }
        }
    };

    /**
     * スキルタイプを更新する。
     */
    Window_StatusSkillType.prototype.update = function() {
        Window_Command.prototype.update.call(this);
        if (this._skillWindow) {
            this._skillWindow.setStypeId(this.currentExt());
        }
    };

    /**
     * 関連するスキルウィンドウを設定する。
     * 
     * @param {Window_StatusSkillList} スキルウィンドウ
     */
    Window_StatusSkillType.prototype.setSkillWindow = function(skillWindow) {
        this._skillWindow = skillWindow;
    };

    /**
     * 最後の選択項目を再選択する。
     */
    Window_StatusSkillType.prototype.selectLast = function() {
        // 特にないので先頭に戻す。
        this.select(0);
    };

    //------------------------------------------------------------------------------
    // Window_StatusProfile
    Window_StatusProfile.prototype = Object.create(Window_Base.prototype);
    Window_StatusProfile.prototype.constructor = Window_StatusProfile;

    /**
     * Window_StatusProfileを初期化する。
     * 
     * @param {Rectangle} ウィンドウ矩形領域
     */
    Window_StatusProfile.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._actor = null;
    };
    /**
     * アクターを設定する。
     * 
     * @param {Game_Actor} actor アクター
     */
    Window_StatusProfile.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    /**
     * コンテンツを更新する。
     */
    Window_StatusProfile.prototype.refresh = function() {
        if (this.contents) {
            this.contents.clear();
            this.drawHeader();
            this.drawProfile();
        }
    };

    /**
     * ヘッダを描画する。
     */
    Window_StatusProfile.prototype.drawHeader = function() {
        const rect = this.headerRect();
        const lineHeight = this.lineHeight();
        this.resetFontSettings();
        this.drawText(textProfile, rect.x, rect.y, rect.width, "right");
        this.drawHorzLine(rect.x, rect.y + lineHeight, rect.width);
    };
    /**
     * ヘッダの矩形領域を得る。
     * 
     * @returns {Rectangle} ヘッダ矩形領域。
     */
    Window_StatusProfile.prototype.headerRect = function() {
        const x = 0;
        const y = 0;
        const w = this.innerWidth;
        const h = this.lineHeight() + 16;
        return new Rectangle(x, y, w, h);
    };
    /**
     * プロフォールを描画する。
     * 
     * Note:プロフィールを拡張するなら、このメソッドをフックするかオーバーライドする。
     */
    Window_StatusProfile.prototype.drawProfile = function() {
        const rect = this.profileRect();
        const actor = this._actor;
        this.drawTextEx(actor.profile(), rect.x, rect.y, rect.width);
    };

    /**
     * プロフィールの描画領域を得る。
     * 
     * @returns {Rectangle} プロフィール描画領域。
     */
    Window_StatusProfile.prototype.profileRect = function() {
        const x = 0;
        const y = this.lineHeight() + 16;
        const w = this.innerWidth;
        const h = this.innerHeight - y;
        return new Rectangle(x, y, w, h);
    };
    /**
     * 水平ラインを描画する。
     * 
     * @param {Number} x 描画x位置
     * @param {Number} y 描画y位置
     * @param {Number} width 幅
     */
    Window_StatusProfile.prototype.drawHorzLine = function(x, y, width) {
        this.changePaintOpacity(false);
        this.drawRect(x, y + 5, width, 5);
        this.changePaintOpacity(true);
    };

    //------------------------------------------------------------------------------
    // Sprite_StatusBackgroundPicture
    /**
     * Sprite_StatusBackgroundPicture
     * 
     * ステータス画面背景用画像表示スプライト
     */
    function Sprite_StatusBackgroundPicture() {
        this.initialize(...arguments);
    }

    Sprite_StatusBackgroundPicture.prototype = Object.create(Sprite.prototype);
    Sprite_StatusBackgroundPicture.prototype.constructor = Sprite_StatusBackgroundPicture;

    /**
     * Sprite_StatusBackgroundPictureを初期化する。
     */
    Sprite_StatusBackgroundPicture.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._actor = null;
        this._pictureName = "";
        this._displayArea = new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.anchor.x = 1.0; // 右端基準
        this.anchor.y = 1.0; // 下基準
        this.update();
    };

    /**
     * アクターを設定する。
     * 
     * @param {Game_Actor} アクター
     */
    Sprite_StatusBackgroundPicture.prototype.setActor = function(actor) {
        this._actor = actor;
    };

    /**
     * このスプライトの画面に対する配置・表示可能領域を設定する。
     * 
     * @param {Rectangle} rect 表示領域
     */
    Sprite_StatusBackgroundPicture.prototype.setDisplayArea = function(rect) {
        this._displayArea = rect;
    };

    /**
     * 更新する。
     */
    Sprite_StatusBackgroundPicture.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        if (this.visible) {
            this.updatePosition();
        }
    };

    /**
     * アクターの画像ファイル名を得る。
     * 
     * @returns {String} 画像ファイル名。未設定または設定されていない場合には空文字列。
     */
    Sprite_StatusBackgroundPicture.prototype.pictureName = function() {
        const actor = this._actor;
        if (actor && statusPictureMethod) {
            const typeStr = typeof actor[statusPictureMethod];
            if (typeStr === "function") {
                const pictureName = actor[statusPictureMethod]();
                if (pictureName) {
                    return pictureName;
                }
            } else if (typeStr === "string" ) {
                const pictureName = actor[statusPictureMethod];
                if (pictureName) {
                    return pictureName;
                }
            }
        }
        return "";
    };

    /**
     * 画像を更新する。
     */
    Sprite_StatusBackgroundPicture.prototype.updateBitmap = function() {
        const pictureName = this.pictureName();
        if (pictureName) {
            if (this._pictureName !== pictureName) {
                this._pictureName = pictureName;
                this.bitmap = ImageManager.loadPicture(this._pictureName);
            }
            this.visible = true;
        } else {
            this._pictureName = "";
            this.bitmap = null;
            this.visible = false;
        }
    };

    /**
     * 位置を更新する。
     */
    Sprite_StatusBackgroundPicture.prototype.updatePosition = function() {
        if (!this.bitmap) {
            return;
        }

        // y は下基準
        const dispWidth = Math.min(this._displayArea.width, this.bitmap.width);
        const displayHeight = Math.min(this._displayArea.height, this.bitmap.height);
        const dispX = (this.bitmap.width - dispWidth) / 2;
        const dispY = 0;
        this.setFrame(dispX, dispY, dispWidth, displayHeight);

        // 右下揃えで配置する。
        this.x = this._displayArea.x + this._displayArea.width;
        this.y = this._displayArea.y + this._displayArea.height;
    };


    //------------------------------------------------------------------------------
    // Scene_Status
    //
    
    /**
     * シーンを作成する。
     * !!!overwrite!!! Scene_Status.create()
     *     ステータス画面を変更するため、オーバーライドする。
     */
    Scene_Status.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createStatusCategoryWindow();
        this.createStatusWindow();
        this.createStatusParamsWindow();
        this.createStatusEquipWindow();
        this.createStatusSkillTypeWindow();
        this.createStatusSkillWindow();
        this.createStatusProfileWindow();
        this.createBackgroundImage();
    };

    /**
     * ウィンドウレイヤーを作成する。
     */
    Scene_Status.prototype.createWindowLayer = function() {
        this.createBackgroundImageLayer();
        Scene_MenuBase.prototype.createWindowLayer.call(this);
    };

    /**
     * 背景画像用レイヤーを作成する。
     */
    Scene_Status.prototype.createBackgroundImageLayer = function() {
        this._backgroundImageLayer = new Sprite();
        this.addChild(this._backgroundImageLayer);
    };

    /**
     * ヘルプウィンドウを作成する。
     */
    Scene_Status.prototype.createHelpWindow = function() {
        Scene_MenuBase.prototype.createHelpWindow.call(this);
        this._helpWindow.hide();
    };
    /**
     * ヘルプウィンドウの高さを得る。
     * 
     * @returns {Number} ヘルプウィンドウの高さ
     * !!!overwrite!!! Scene_Status.helpAreaHeight()
     *     ヘルプウィンドウを使用するのでオーバーライドする。
     */
    Scene_Status.prototype.helpAreaHeight = function() {
        return Scene_MenuBase.prototype.helpAreaHeight.call(this);
    };
    /**
     * ステータス種類ウィンドウを作成する。
     */
    Scene_Status.prototype.createStatusCategoryWindow = function() {
        const rect = this.statusCategoryWindowRect();
        this._categoryWindow = new Window_StatusCategory(rect);
        this._categoryWindow.setHandler("ok", this.onStatusCategoryWindowOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
        this._categoryWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._categoryWindow.setHandler("pageup", this.previousActor.bind(this));
        this._categoryWindow.setHandler("itemChange", this.onStatusCategoryWindowItemChange.bind(this));
        
        this.addWindow(this._categoryWindow);
    };

    /**
     * ステータスカテゴリウィンドウの表示領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     */
    Scene_Status.prototype.statusCategoryWindowRect = function() {
        let lineCount = 4;
        if (enableProfile) {
            lineCount++;
        }
        const ww = this.commandWindowWidth();
        const wh = this.calcWindowHeight(lineCount, true);
        const wx = 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };
    /**
     * コマンドウィンドウ幅を得る。
     * 
     * @returns {Number} コマンドウィンドウ幅。
     */
    Scene_Status.prototype.commandWindowWidth = function() {
        return commandWindowWidth;
    };

    /**
     * アクター情報ウィンドウを作成する。
     * 
     * !!!overwrite!!! Scene_Status.createStatusWindow()
     *     ステータス画面変更のため、オーバーライドする。
     *     ベーシックシステムでは本ウィンドウに入力受付していた。
     *     しかし、本プラグインでは別ウィンドウが受け付けるので、
     *     このウィンドウにコールバックを登録することはしない。
     */
    Scene_Status.prototype.createStatusWindow = function() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_Status(rect);
        this.addWindow(this._statusWindow);
    };

    /**
     * ステータスウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Status.statusWindowRect()
     *     ステータス画面のレイアウト変更のため、オーバーライドする。
     */
    Scene_Status.prototype.statusWindowRect = function() {
        const rect = this.statusCategoryWindowRect();
        const wx = rect.x + rect.width;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - wx;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * パラメータ表示ウィンドウの表示領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Status.statusParamsWindowRect()
     *     ステータス画面のレイアウト変更のため、オーバーライドする。
     */
    Scene_Status.prototype.statusParamsWindowRect = function() {
        const rect = this.statusCategoryWindowRect();
        const wx = rect.x + rect.width;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - wx;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータス装備ウィンドウの表示領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     * !!!overwrite!!! Scene_Status.statusParamsWindowRect()
     *     ステータス画面のレイアウト変更のため、オーバーライドする。
     */
    Scene_Status.prototype.statusEquipWindowRect = function() {
        const rect = this.statusCategoryWindowRect();
        const wx = rect.x + rect.width;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - wx;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    }

    /**
     * スキルタイプウィンドウを作成する。
     */
    Scene_Status.prototype.createStatusSkillTypeWindow = function() {
        const rect = this.statusSkillTypeWindowRect();
        this._statusSkillTypeWindow = new Window_StatusSkillType(rect);
        this._statusSkillTypeWindow.setHandler("ok", this.onSkillTypeWindowOk.bind(this));
        this._statusSkillTypeWindow.setHandler("cancel", this.onSkillTypeWindowCancel.bind(this));
        this._statusSkillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._statusSkillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
        this._statusSkillTypeWindow.deactivate();
        this._statusSkillTypeWindow.hide();
        this._statusSkillTypeWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._statusSkillTypeWindow);
    };

    /**
     * スキルタイプウィンドウの表示領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     */
    Scene_Status.prototype.statusSkillTypeWindowRect = function() {
        const rect = this.statusCategoryWindowRect();
        const wx = rect.x;
        const wy = rect.y + rect.height;
        const ww = rect.width;
        const wh = this.calcWindowHeight(4, true);
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * スキルウィンドウを作成する。 
     */
    Scene_Status.prototype.createStatusSkillWindow = function() {
        const rect = this.skillListWindowRect();
        this._statusSkillListWindow = new Window_SkillList(rect);
        this._statusSkillListWindow.isEnabled = function( /* item */) { return true; }
        this._statusSkillListWindow.setHandler("ok", this.onSkillListWindowOk.bind(this));
        this._statusSkillListWindow.setHandler("cancel", this.onSkillListWindowCancel.bind(this));
        this._statusSkillListWindow.setHelpWindow(this._helpWindow);
        this._statusSkillListWindow.deactivate();
        this._statusSkillListWindow.hide();

        this._statusSkillTypeWindow.setSkillWindow(this._statusSkillListWindow);

        this.addWindow(this._statusSkillListWindow);
    };

    /**
     * スキル一覧のウィンドウ表示領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ表示領域。
     */
    Scene_Status.prototype.skillListWindowRect = function() {
        const rect = this.statusCategoryWindowRect();
        const wx = rect.x + rect.width;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - wx;
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータス種類ウィンドウで更新要求があったときに通知を受け取る。
     */
    Scene_Status.prototype.onStatusCategoryWindowItemChange = function() {
        // 表示するステータス画面の切り替え。
        this.hideDetailWindows();
        switch (this._categoryWindow.currentSymbol()) {
            case "status1":
                this._statusWindow.show();
                break;
            case "status2":
                this._statusParamsWindow.show();
                break;
            case "status3":
                this._statusEquipWindow.show();
                break;
            case "profile":
                this._statusProfileWindow.show();
                break;
            case "skill":
                this._statusSkillTypeWindow.show();
                this._statusSkillListWindow.show();
                this._helpWindow.show();
                break;
        }
    };
    /**
     * 詳細ウィンドウを全て隠す
     */
    Scene_Status.prototype.hideDetailWindows = function() {
        this._statusWindow.hide();
        this._statusParamsWindow.hide();
        this._statusEquipWindow.hide();
        this._statusSkillTypeWindow.hide();
        this._statusSkillListWindow.hide();
        this._helpWindow.hide();
        this._statusProfileWindow.hide();
    };
    /**
     * スキルタイプ選択画面で、OKボタンが押された時に通知を受け取る。
     */
    Scene_Status.prototype.onSkillTypeWindowOk = function() {
        this._statusSkillListWindow.activate();
        this._statusSkillListWindow.select(0);
    };

    /**
     * スキルタイプ選択画面でキャンセルボタンが押された時に通知を受け取る。
     */
    Scene_Status.prototype.onSkillTypeWindowCancel = function() {
        this._categoryWindow.activate();
    };

    /**
     * スキルリスト画面でOKボタンが押された時に通知を受け取る。
     */
    Scene_Status.prototype.onSkillListWindowOk = function() {
        if (this._statusSkillListWindow.setPendingIndex) {
            const pendingIndex = this._statusSkillListWindow.getPendingIndex();
            if (pendingIndex === -1) {
                // 未選択
                this._statusSkillListWindow.setPendingIndex(this._statusSkillListWindow.index());
                this._statusSkillListWindow.activate();
            } else {
                const index = this._statusSkillListWindow.index();
                if (index === pendingIndex) {
                    // スキル使用はしない。
                    this._statusSkillListWindow.setPendingIndex(-1);
                } else {
                    const srcItem = this._statusSkillListWindow.itemAt(pendingIndex);
                    const dstItem = this._statusSkillListWindow.itemAt(index);
                    if (srcItem && dstItem) {
                        this._actor.swapSkillOrder(srcItem.id, dstItem.id);
                    }
                    this._statusSkillListWindow.setPendingIndex(-1);
                    this._statusSkillListWindow.refresh();
                }
            }
        }
        // スキルリスト画面を引き続きアクティブ状態にする。
        this._statusSkillListWindow.activate();
    };

    /**
     * スキルリスト画面でキャンセルボタンが押された時に通知を受け取る。
     */
    Scene_Status.prototype.onSkillListWindowCancel = function() {
        this._statusSkillListWindow.setPendingIndex(-1);
        this._statusSkillTypeWindow.activate();
    };


    /**
     * アクタープロフィールウィンドウを作成する。
     */
    Scene_Status.prototype.createStatusProfileWindow = function() {
        const rect = this.profileWindowRect();
        this._statusProfileWindow = new Window_StatusProfile(rect);
        this._statusProfileWindow.hide();
        this.addWindow(this._statusProfileWindow);
    };

    /**
     * プロフィールウィンドウの表示領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     * !!!overwrite!!! Scene_Status.profileWindowRect()
     *     ステータス画面変更のため、オーバーライドする。
     */
    Scene_Status.prototype.profileWindowRect = function() {
        const rect = this.statusCategoryWindowRect();
        const wx = rect.x + rect.width;
        const wy = this.buttonAreaBottom();
        const ww = Graphics.boxWidth - wx;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    };


    /**
     * バックグラウンドイメージ表示用スプライトを作成する。
     */
    Scene_Status.prototype.createBackgroundImage = function() {
        this._backgroundImage = new Sprite_StatusBackgroundPicture();
        this._backgroundImage.setDisplayArea(this.backgroundDisplayArea());
        this._backgroundImageLayer.addChild(this._backgroundImage);
    };

    /**
     * 背景画像の表示エリアを得る。
     * 
     * @returns {Rectangle} 表示領域。
     */
    Scene_Status.prototype.backgroundDisplayArea = function() {
        const rect = this.statusCategoryWindowRect();
        const wx = rect.x + rect.width + 16;
        const wy = 16;
        const ww = Graphics.boxWidth - wx - 16;
        const wh = Graphics.boxHeight - 16;
        return new Rectangle(wx, wy, ww, wh);
    };




    /**
     * ステータス種類ウィンドウでOK操作がされたときに通知を受け取る。
     */
    Scene_Status.prototype.onStatusCategoryWindowOk = function() {
        switch (this._categoryWindow.currentSymbol()) {
            case "status3":
                // 装備画面でOKが押されたら、装備シーンに移る
                SceneManager.push(Scene_Equip);
                break;
            case "skill":
                this._statusSkillTypeWindow.activate();
                break;
            default:
                this._categoryWindow.activate();
                break;
        }
    };   
    
    /**
     * シーンを開始する。
     */
    Scene_Status.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);

        // activeの制御
        this._categoryWindow.select(0); // これでウィンドウの表示/非表示が更新される。
        this._categoryWindow.show();
        this._categoryWindow.activate();

        // 現在のアクター情報を元に更新する。
        this.refreshActor();
    };

    /**
     * 表示するアクターの情報を更新する。
     * 
     * !!!overwrite!!! Scene_Status.refreshActor()
     *     ステータス画面レイアウト変更のため、オーバーライドする。
     */
    Scene_Status.prototype.refreshActor = function() {
        const actor = this.actor();
        this._statusWindow.setActor(actor);
        this._statusParamsWindow.setActor(actor);
        this._statusEquipWindow.setActor(actor);
        this._statusSkillTypeWindow.setActor(actor);
        this._statusSkillListWindow.setActor(actor);
        //this._helpWindow.setActor(actor);
        this._statusProfileWindow.setActor(actor);
        this._backgroundImage.setActor(actor);
        this._statusSkillListWindow.deactivate();
        this._statusSkillTypeWindow.deactivate();
        this._categoryWindow.activate();
    };

    /**
     * アクターが変更されたときの処理をおこなう。
     * 
     * !!!overwrite!!! Scene_Status.onActorChange()
     *     _statusWindowではなく、_categoryWindowをアクティブにするため、オーバーライドする。
     */
    Scene_Status.prototype.onActorChange = function() {
        this.refreshActor();
        this._categoryWindow.activate();
    };
})();