/*:ja
 * @target MZ 
 * @plugindesc TWLD向け装備画面プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_EquipSlots
 * @base Kapu_Trait_Penetrate
 * @orderAfter Kapu_Trait_Penetrate
 * 
 * @param commandWindowWidth
 * @text コマンドウィンドウ幅
 * @desc コマンドウィンドウの幅。
 * @type number
 * @default 240
 * 
 * @param slotNameWidth
 * @text スロット名幅
 * @desc スロット名の幅
 * @type number
 * @default 138
 * 
 * @param textEmptySlot
 * @text 空スロット表示テキスト
 * @desc 空のスロットに表示する文字列。
 * @type string
 * @default 
 * 
 * @param changeableSlotInBattle
 * @text 戦闘中変更可能スロット
 * @desc 戦闘中変更可能なスロットタイプを指定します。
 * @type number[]
 * @default [ "1" ]
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
 * @text 属性表示項目3
 * @desc 属性表示欄3。
 * @type struct<elementEntry>[]
 * 
 * @param statusParamEntries
 * @text 追加パラメータ
 * @desc パラメータウィンドウに追加で標示するパラメータ
 * @type struct<paramEntry>[]
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
 * @param allowChangeEquipInBattle
 * @text 戦闘中に装備変更を許可する
 * @desc truenにすると、戦闘コマンドに装備変更を追加する。
 * @type boolean
 * @default false
 * 
 * @help 
 * 装備画面を提供する。
 * 
 * ■ 使用時の注意
 * なし
 * 
 * ■ プラグイン開発者向け
 * なし。
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
 * Window_EquipActor
 * アクター名と顔グラフィックを表示するウィンドウ。
 */
function Window_EquipActor() {
    this.initialize.apply(this, arguments);
}

/**
 * Window_EquipItemName
 * 
 * 装備品名を表示するウィンドウ。
 */
function Window_EquipItemName() {
    this.initialize.apply(this, arguments);
}


(() => {
    const pluginName = "Kapu_Twld_UI_Equip";
    const parameters = PluginManager.parameters(pluginName);
    const commandWindowWidth = Number(parameters["commandWindowWidth"]) || 240;
    const slotNameWidth = Number(parameters["slotNameWidth"]) || 138;
    const textEmptySlot = parameters["textEmptySlot"] || "";
    const textAbsorb = parameters["textAbsorb"] || "(Abs)";
    const changeableSlotInBattle = [];
    try {
        const items = JSON.parse(parameters["changeableSlotInBattle"]);
        for (const item of items) {
            const slot = Number(item);
            if ((slot > 0) && !changeableSlotInBattle.includes(slot)) {
                changeableSlotInBattle.push(slot);
            }
        }
    }
    catch (e) {
        console.error(e);
    }
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
    const colorAbsorb = parameters["colorAbsorb"] || "rgb(100,255,100)";
    const colorAttenuation = parameters["colorAttenuation"] || "rgb(100,180,255)";
    const colorAmplification = parameters["colorAmplification"] || "rgb(255,64,64)";

    /**
     * 属性エントリ配列を得る。
     * 
     * @param {string} value 値
     * @returns {Array<Object>} 属性エントリ配列
     */
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
     * @param {string} value 値文字列
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

    const allowChangeEquipInBattle = (typeof parameters["allowChangeEquipInBattle"] === "undefined")
            ? false : (parameters["allowChangeEquipInBattle"] == "true");

    //------------------------------------------------------------------------------
    // Window_EquipActor

    Window_EquipActor.prototype = Object.create(Window_Base.prototype);
    Window_EquipActor.prototype.constructor = Window_EquipActor;

    /**
     * 初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_EquipActor.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._actor = null;
    };

    /**
     * アクターを設定する。
     * 
     * @param {Game_Actor} actor アクター
     */
    Window_EquipActor.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    /**
     * 描画を更新する。
     */
    Window_EquipActor.prototype.refresh = function() {
        this.contents.clear();
        const innerWidth = this.innerWidth;
        const innerHeight = this.innerHeight;
        
        const actor = this._actor;
        if (actor === null) {
            return;
        }

        this.drawActorFace(actor, 0, 0, innerWidth, innerHeight);
        this.changePaintOpacity(false);
        const name = actor.name();
        const backRectWidth = Math.min(Math.max(this.textWidth(name), ImageManager.faceWidth) + 32, innerWidth);
        const offsX = (innerWidth - backRectWidth) / 2;
        this.contents.fillRect(offsX, 0, backRectWidth, this.lineHeight(), "black");
        this.changePaintOpacity(true);
        this.resetFontSettings();
        this.drawText(actor.name(), 0, 0, innerWidth, "center");
    };

    /**
     * アクターの顔グラフィックを描画する。
     * 
     * @param {Game_Battler} actor アクター
     * @param {number} x 描画領域左上X
     * @param {number} y 描画領域左上Y
     * @param {number} width 幅
     * @param {number} height 高さ
     */    
    Window_EquipActor.prototype.drawActorFace = function(actor, x, y, width, height) {
        if (actor.isDead()) {
            this.contents.context.filter = "grayscale(100%)";
        }
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
        this.contents.context.filter = "none";
    };


    //------------------------------------------------------------------------------
    // Window_EquipSlot

    const _Window_EquipSlot_select = Window_EquipSlot.prototype.select;

    /**
     * indexを選択する。
     * 
     * @param {number} index インデックス番号
     */
    Window_EquipSlot.prototype.select = function(index) {
        _Window_EquipSlot_select.call(this, index);
        this.callHandler("itemchange");
    };
    /**
     * ウィンドウを更新する。
     * 
     * !!!overwrite!!! Window_EquipSlot.update()
     *     装備か納品選択ウィンドウにスロット番号を設定する条件を変更するため、オーバーライドする。
     */
    Window_EquipSlot.prototype.update = function() {
        Window_StatusBase.prototype.update.call(this);
        if (this._itemWindow) {
            const actor = this._actor;
            if (actor && (this.index() < actor.equipSlots().length)) {
                this._itemWindow.setSlotId(this.index());
            }
        }
    };
    /**
     * スロットウィンドウの選択項目数を得る。
     * 
     * @returns {number} 選択項目数
     */
    Window_EquipSlot.prototype.maxItems = function() {
        if (this._actor) {
            const count = this._actor.equipSlots().length;
            // 戦闘中は「全て外す」を無効化する。
            return $gameParty.inBattle() ? count : count + 1;
        }
        return 0;
    };

    /**
     * スロットウィンドウの項目を描画する。
     * @param {Index} index インデックス
     */
    Window_EquipSlot.prototype.drawItem = function(index) {
        const actor = this._actor;
        if (actor === null) {
            return;
        }
        if (index >= actor.equipSlots().length) {
            const rect = this.itemLineRect(index);
            this.drawText(TextManager.clear, rect.x, rect.y, rect.width);
        } else {
            const slotName = this.actorSlotName(actor, index);
            const item = this.itemAt(index);
            const slotNameWidth = this.slotNameWidth();
            const rect = this.itemLineRect(index);
            const itemWidth = rect.width - slotNameWidth;
            this.changeTextColor(ColorManager.systemColor());
            this.changePaintOpacity(this.isEnabled(index));
            this.drawText(slotName, rect.x, rect.y, slotNameWidth, rect.height);
            this.drawEquipItemName(item, rect.x + slotNameWidth, rect.y, itemWidth);
            this.changePaintOpacity(true);
        }
    };

    /**
     * スロット名の幅を得る。
     * 
     * @returns {number} スロット名の幅
     */
    Window_EquipSlot.prototype.slotNameWidth = function() {
        return slotNameWidth;
    };

    /**
     * 装備品名を描画する。
     * 
     * @param {object} item 装備アイテム(DataWeapon/DataArmor)
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 描画幅
     */
    Window_EquipSlot.prototype.drawEquipItemName = function(item, x, y, width) {
        if (item) {
            this.drawItemName(item, x, y, width);
        } else {
            const textMargin = ImageManager.iconWidth + 4;
            const itemWidth = Math.max(0, width - textMargin);
            this.drawText(textEmptySlot, x + textMargin, y, itemWidth);
        }
    };

    const _Window_EquipSlot_isEnabled = Window_EquipSlot.prototype.isEnabled;
    /**
     * 項目が選択可能かどうかを得る。
     * 
     * @param {number} index インデックス番号
     * @returns {boolean} 選択可能な場合にはtrue, それ以外はfalse
     */
    Window_EquipSlot.prototype.isEnabled = function(index) {
        if (this._actor === null) {
            return false;
        }
        const equipSlots = this._actor.equipSlots();
        if (index >= equipSlots.length) {
            // 戦闘中以外は全て外すとか有効。
            return $gameParty.inBattle() ? false : true;
        } else {
            const slotType = equipSlots[index];
            if ($gameParty.inBattle() && !changeableSlotInBattle.includes(slotType)) {
                // 戦闘中はのんきに装備変更できない項目
                return false;
            }
            return _Window_EquipSlot_isEnabled.call(this, index);
        }
    };

    const _Window_EquipSlot_itemAt = Window_EquipSlot.prototype.itemAt;
    /**
     * indexで指定されたスロットに装備されているアイテムを得る。
     * 
     * @param {number} index インデックス番号
     * @returns {object} アイテムオブジェクト。未装備の場合にはnull
     */
    Window_EquipSlot.prototype.itemAt = function(index) {
        if (this._actor && (index < this._actor.equips().length)) {
            return _Window_EquipSlot_itemAt.call(this, index);
        } else {
            return null;
        }
    };

    //------------------------------------------------------------------------------
    // Window_EquipItemName
    Window_EquipItemName.prototype = Object.create(Window_Base.prototype);
    Window_EquipItemName.prototype.constructor = Window_EquipItemName;

    /**
     * 初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_EquipItemName.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._slotName = null;
        this._item = null;
    };

    /**
     * 現在の装備品情報を設定する。
     * 
     * @param {string} slotName スロット名
     * @param {Data_Item} item 装備品
     */
    Window_EquipItemName.prototype.setEquipItem = function(slotName, item) {
        this._slotName = slotName;
        this._item = item;
        this.refresh();
    };

    /**
     * 描画を更新する。
     */
    Window_EquipItemName.prototype.refresh = function() {
        this.contents.clear();

        const itemWidth = this.innerWidth - slotNameWidth;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(this._slotName, 0, 0, slotNameWidth, this.lineHeight());
        this.drawEquipItemName(this._item, slotNameWidth, 0, itemWidth);
    };

    /**
     * アイテム名を描画する。
     * 
     * @param {object} item アイテム(nameプロパティを持つオブジェクト)
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 描画幅
     */
    Window_EquipItemName.prototype.drawEquipItemName = function(item, x, y, width) {
        if (item) {
            this.drawItemName(item, x, y, width);
        } else {
            const textMargin = ImageManager.iconWidth + 4;
            const itemWidth = Math.max(0, width - textMargin);
            this.drawText(textEmptySlot, x + textMargin, y, itemWidth);
        }
    };
    //------------------------------------------------------------------------------
    // Window_EquipStatus

    /**
     * 表示を更新する。
     * 
     * !!!overwrite!!! Window_EquipStatus.refresh()
     *     表示内容を変更するため、オーバーライドする。
     */
    Window_EquipStatus.prototype.refresh = function() {
        this.contents.clear();
        this.drawBlock1();
        if (!$gameParty.inBattle()) {
            this.drawBlock2();
        }
    };

    /**
     * ブロック1を描画する。
     */
    Window_EquipStatus.prototype.drawBlock1 = function() {
        const rect = this.block1Rect();
        const lineHeight = this.lineHeight();
        const spacing = 16;
        const itemWidth = Math.floor((rect.width - spacing * 3) / 3);
        const x1 = rect.x;
        const x2 = x1 + itemWidth + spacing;
        const x3 = x2 + itemWidth + spacing;
        this.drawBlock1A(x1, rect.y, itemWidth);
        this.drawBlock1B(x2, rect.y, itemWidth);
        this.drawBlock1C(x3, rect.y, itemWidth);
        this.resetTextColor();
        this.drawHorzLine(rect.x, rect.y + lineHeight * 8, rect.width);
    };


    /**
     * ステータスブロック1Aを描画する。
     * 
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 描画幅
     */
    Window_EquipStatus.prototype.drawBlock1A = function(x, y, width) {
        const actor = this._actor;
        if (!actor) {
            return;
        }
        const tempActor = this._tempActor || actor;
        const lineHeight = this.lineHeight();
        this.drawParamValue(TextManager.param(0), actor.mhp, tempActor.mhp,
                x, y + lineHeight * 0, width);
        this.drawParamValue(TextManager.param(1), actor.mmp, tempActor.mmp,
                x, y + lineHeight * 1, width);
        this.drawParamValue(TextManager.param(2), actor.atk, tempActor.atk,
                x, y + lineHeight * 2, width);
        this.drawParamRate(textPhyPenetration, actor.penetratePDR(), tempActor.penetratePDR(),
                x, y + lineHeight * 3, width);
        this.drawParamValue(TextManager.param(3), actor.def, tempActor.def,
                x, y + lineHeight * 4, width);
        this.drawParamRate(textPhyAttenuation, 1 - actor.pdr, 1 - tempActor.pdr,
                x, y + lineHeight * 5, width);
        this.drawParamRate(textHit, actor.hit, tempActor.hit,
                x, y + lineHeight * 6, width);
        this.drawParamRate(textPhyEvacuation, actor.eva, tempActor.eva,
                x, y + lineHeight * 7, width);
    };
    /**
     * ステータスブロック1Bを描画する。
     * 
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 描画幅
     */
    Window_EquipStatus.prototype.drawBlock1B = function(x, y, width) {
        const actor = this._actor;
        if (!actor) {
            return;
        }
        const tempActor = this._tempActor || actor;
        const lineHeight = this.lineHeight();
        this.drawParamValue(TextManager.tpA, actor.maxTp(), tempActor.maxTp(),
                x, y + lineHeight * 0, width);
        this.drawParamValue(TextManager.param(3), actor.mat, tempActor.mat,
                x, y + lineHeight * 2, width);
        this.drawParamRate(textMagPenetration, actor.penetrateMDR(), tempActor.penetrateMDR(),
                x, y + lineHeight * 3, width);
        this.drawParamValue(TextManager.param(4), actor.mdf, tempActor.mdf,
                x, y + lineHeight * 4, width);
        this.drawParamRate(textMagAttenuation, 1 - actor.mdr, 1 - tempActor.mdr,
                x, y + lineHeight * 5, width);
       this.drawParamRate(textMagEvacuation, actor.mev, tempActor.mev,
                x, y + lineHeight * 7, width);
    };
    /**
     * ステータスブロック1Cを描画する。
     * 
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 描画幅
     */
    Window_EquipStatus.prototype.drawBlock1C = function(x, y, width) {
        const actor = this._actor;
        if (!actor) {
            return;
        }
        const tempActor = this._tempActor || actor;
        const lineHeight = this.lineHeight();
        this.drawParamRate(textCriticalRate, actor.cri, tempActor.cri,
                x, y + lineHeight * 2, width);
        this.drawParamRate(textCriticalEvacuation, actor.cev, tempActor.cev,
                x, y + lineHeight * 3, width);
        this.drawParamRate(textPhyCriDamageRate, actor.pcdr, tempActor.pcdr, 
                x, y + lineHeight * 4, width);
        this.drawParamRate(textMagCriDamageRate, actor.mcdr, tempActor.mcdr,
                x, y + lineHeight * 5, width);
    };

    /**
     * ブロック1の描画領域を得る。
     * 
     * @returns {Rectangle} 描画領域。
     */
     Window_EquipStatus.prototype.block1Rect = function() {
        const x = 0;
        const y = 0;
        const w = this.innerWidth;
        const h = this.lineHeight() * 8 + 16;
        return new Rectangle(x, y, w, h);
     };

     /**
      * ブロック2を描画する。
      */
     Window_EquipStatus.prototype.drawBlock2 = function() {
         if (!this._actor) {
             return;
         }
         if (this._tempActor) {
            // 装備変更対象選択中はステータス差分のみ表示する。
            this.drawBlock2DiffOnly();
         } else {
            this.drawBlock2Normal();
         }
     };

     /**
      * ブロック2を描画する。
      * 
      * Note: 属性耐性レートのみ記載。
      */
     Window_EquipStatus.prototype.drawBlock2Normal = function() {
        const rect = this.block2Rect();
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
    };
    /**
     * 属性レート配列を描画する。
     * 
     * @param {number} x 描画x位置
     * @param {number} y 描画y位置
     * @param {number} width 描画幅
     * @param {Array<Object>} 属性エントリ配列
     */
    Window_EquipStatus.prototype.drawElementRates = function(x, y, width, elementEntries) {
        const lineHeight = this.lineHeight();
        for (let i = 0; i < elementEntries.length; i++) {
            const entry = elementEntries[i];
            this.drawElementRate(entry, this._actor, x, y + lineHeight * i, width);
        }
    };
    /**
     * 属性レートのパラメータを描画する。
     * 
     * @param {object} entry 属性エントリ
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 幅
     */
    Window_EquipStatus.prototype.drawElementRate = function(entry, actor, x, y, width) {
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
        const labelWidth = Math.min(this.paramWidth(), Math.floor((width - 40) * 0.3));
        this.drawText(elementName, x + 40, y, labelWidth);
        
        const valueWidth = width - 40 - labelWidth;
        const elementRate = actor.elementRate(entry.id);

        const rateStr = this.elementRateStr(elementRate);

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
     * ブロック2を描画する。
     */
    Window_EquipStatus.prototype.drawBlock2DiffOnly = function() {
        const rect = this.block2Rect();
        const lineHeight = this.lineHeight();
        const maxLineCount = Math.floor(rect.height / lineHeight);
        const spacing = 16;
        const itemWidth = Math.floor((rect.width - spacing * 3) / 3);
        const paramItems = this.diffParams();
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
    };

    /**
     * 相違があるパラメータを抽出して返す。
     * 
     * @returns {Array<Object>} 相違パラメータの配列
     */
    Window_EquipStatus.prototype.diffParams = function() {
        let paramItems = [];
        paramItems = paramItems.concat(this.diffParamsOfElements());
        paramItems = paramItems.concat(this.diffParamsOfCustom());
        return paramItems;
    };

    /**
     * 属性レートの変化パラメータを得る。
     * 
     * @returns {Array<Object>} 相違パラメータの配列
     */
    Window_EquipStatus.prototype.diffParamsOfElements = function() {
        let elementIds = [];
        elementIds = elementIds.concat(elementEntries1.map(entry => entry.id));
        elementIds = elementIds.concat(elementEntries2.map(entry => entry.id));
        elementIds = elementIds.concat(elementEntries3.map(entry => entry.id));
        elementIds = elementIds.concat(elementEntries4.map(entry => entry.id));

        const paramItems = [];
        for (const elementId of elementIds) {
            const rate1 = this._actor.elementRate(elementId);
            const rate2 = this._tempActor.elementRate(elementId);
            if (rate1 !== rate2) {
                const paramItem = {};
                paramItem.label = $dataSystem.elements[elementId];
                paramItem.value1 = this.elementRateStr(rate1);
                paramItem.value2 = this.elementRateStr(rate2);
                paramItem.color = (rate2 < rate1) ? ColorManager.powerUpColor() : ColorManager.powerDownColor();
                paramItems.push(paramItem);
            }
        }

        return paramItems;
    };

    /**
     * 属性レートを文字列に変換する。
     * 
     * @param {number} rate 割合
     * @returns {string} 割合を表す文字列
     */
    Window_EquipStatus.prototype.elementRateStr = function(rate) {
        return (rate >= 0)
            ? (Math.floor(rate * 1000) / 10) + "%"
            : ((Math.floor(-rate * 1000) / 10) + "%" + textAbsorb);
    };

    /**
     * カスタム相違パラメータを得る。
     * 
     * @returns {Array<Object>} 相違パラメータの配列
     */
    Window_EquipStatus.prototype.diffParamsOfCustom = function() {
        const paramItems = [];
        for (const paramEntry of statusParamEntries) {
            if (paramEntry.getter) {
                let value1 = this.getCustomParam(paramEntry, this._actor);
                let value2 = this.getCustomParam(paramEntry, this._tempActor);
                if (value1 !== value2) {
                    const paramItem = {};
                    if (paramEntry.valueType === "percent") {
                        paramItem.label = paramEntry.label;
                        paramItem.value1 = (Math.floor(value1 * 1000) / 10) + "%";
                        paramItem.value2 = (Math.floor(value2 * 1000) / 10) + "%";
                        paramItem.color = (value2 > value1) ? ColorManager.powerUpColor() : ColorManager.powerDownColor();
                    } else if (paramEntry.valueType === "flag") {
                        paramItem.label = "";
                        paramItem.value1 = (value1) ? paramEntry.label : "";
                        paramItem.value2 = (value2) ? paramEntry.label : "";
                        paramItem.color = (value2 && !value1) ? ColorManager.powerUpColor() : ColorManager.powerDownColor();
                    } else {
                        paramItem.label = paramEntry.label;
                        paramItem.value = (value >= 0) ? "+" + value : value;
                        paramItem.color = (value2 > value1) ? ColorManager.powerUpColor() : ColorManager.powerDownColor();
                    }
                    paramItems.push(paramItem);
                }
            }
        }

        return paramItems;
    };

    /**
     * paramEntryで指定されるパラメータを得る。
     * 
     * @param {object} paramEntry パラメータエントリ
     * @param {Game_Actor} actor アクター
     * @returns {number} 値
     */
    Window_EquipStatus.prototype.getCustomParam = function(paramEntry, actor) {
        try {
            const a = actor; // eslint-disable-line no-unused-vars
            return eval(paramEntry.getter);
        }
        catch (e) {
            return 0;
        }
    };
    /**
     * パラメータを描画する。
     * 
     * @param {object} paramItem パラメータ
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 描画幅
     */
    Window_EquipStatus.prototype.drawParamItem = function(paramItem, x, y, width) {
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        const labelWidth = Math.floor(width * 0.3);
        const rightArrowWidth = this.rightArrowWidth();
        this.drawText(paramItem.label, x, y, labelWidth);
        this.resetTextColor();
        const spacing = 16;
        const valueWidth = Math.floor((width - labelWidth - rightArrowWidth - spacing * 3) / 2);
        const value1X = x + labelWidth + spacing;
        this.drawText(paramItem.value1, value1X, y, valueWidth);
        const arrowX = value1X + valueWidth + spacing;
        this.drawRightArrow(arrowX, y);
        const value2X = arrowX + rightArrowWidth + spacing;
        this.changeTextColor(paramItem.color);
        this.drawText(paramItem.value2, value2X, y, valueWidth);
    };

     /**
      * ブロック2の描画領域を得る。
      * 
      * @returns {Rectangle} 描画領域
      */
     Window_EquipStatus.prototype.block2Rect = function() {
        const rect = this.block1Rect();
        const x = 0;
        const y = rect.y + rect.height;
        const w = this.innerWidth;
        const h = this.innerHeight - rect.height;
        return new Rectangle(x, y, w, h);
     }

    /**
     * 整数値タイプのパラメータを描画する。
     * 
     * @param {string} paramName パラメータ名
     * @param {number} value1 値1（現在値）
     * @param {number} value2 値2（装備変更値）
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 幅
     */
    Window_EquipStatus.prototype.drawParamValue = function(paramName, value1, value2, x, y, width) {
        if (typeof value1 === "undefined") {
            return;
        }
        const paramWidth = Math.min(this.paramWidth(), Math.floor(width * 0.3));
        const rightArrowWidth = this.rightArrowWidth();
        const spacing = 16;
        const valueWidth = (width - paramWidth - rightArrowWidth - spacing * 3) / 2;

        this.changeTextColor(ColorManager.systemColor());
        this.drawText(paramName, x, y, paramWidth);

        const value1X = x + paramWidth + spacing;
        this.resetTextColor();
        this.drawText(value1 + " ", value1X, y, valueWidth, "right");

        if (value1 === value2) {
            return;
        }
        const arrowX = value1X + valueWidth + spacing;
        this.drawRightArrow(arrowX, y);
        if (value2 >= value1) {
            this.changeTextColor(ColorManager.powerUpColor());
        } else {
            this.changeTextColor(ColorManager.powerDownColor());
        }
        const value2X = arrowX + rightArrowWidth + spacing;
        this.drawText(value2 + " ", value2X, y, valueWidth, "right");
    };

    /**
     * 割合タイプのパラメータを描画する。
     * 
     * @param {string} paramName パラメータ名
     * @param {number} value1 値1（現在値）
     * @param {number} value2 値2（装備変更値）
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 幅
     */
    Window_EquipStatus.prototype.drawParamRate = function(paramName, value1, value2, x, y, width) {
        if (typeof value1 === "undefined") {
            return;
        }
        const paramWidth = Math.min(this.paramWidth(), Math.floor(width * 0.3));
        const rightArrowWidth = this.rightArrowWidth();
        const spacing = 16;
        const valueWidth = (width - paramWidth - rightArrowWidth - spacing * 3) / 2;

        this.changeTextColor(ColorManager.systemColor());
        this.drawText(paramName, x, y, paramWidth);

        const value1X = x + paramWidth + spacing;
        this.resetTextColor();
        const value1Str = (Math.floor(value1 * 1000) / 10) + "%";
        this.drawText(value1Str, value1X, y, valueWidth, "right");

        if (value1 === value2) {
            return;
        }
        const arrowX = value1X + valueWidth + spacing;
        this.drawRightArrow(arrowX, y);
        if (value2 >= value1) {
            this.changeTextColor(ColorManager.powerUpColor());
        } else {
            this.changeTextColor(ColorManager.powerDownColor());
        }
        const value2X = arrowX + rightArrowWidth + spacing;
        const value2Str = (Math.floor(value2 * 1000) / 10) + "%";
        this.drawText(value2Str, value2X, y, valueWidth, "right");
    };


    /**
     * 水平ラインを描画する。
     * 
     * @param {number} x 描画x位置
     * @param {number} y 描画y位置
     * @param {number} width 幅
     */
    Window_EquipStatus.prototype.drawHorzLine = function(x, y, width) {
        this.changePaintOpacity(false);
        this.drawRect(x, y + 5, width, 5);
        this.changePaintOpacity(true);
    };

    //------------------------------------------------------------------------------
    // Scene_Equip
    /**
     * 装備画面に必要なウィンドウを作成する。
     * 
     * !!!overwrite!!! Scene_Equip.create()
     *     装備画面のレイアウト変更のため、オーバーライドする。
     */
    Scene_Equip.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createActorWindow();
        this.createHelpWindow();
        this.createStatusWindow();
        this.createCommandWindow();
        this.createSlotWindow();
        this.createItemWindow();
        this.createEquipItemNameWindow();
        this.refreshActor();
    };


    /**
     * アクターウィンドウを作成する。
     */
    Scene_Equip.prototype.createActorWindow = function() {
        const rect = this.equipActorWindowRect();
        this._actorWindow = new Window_EquipActor(rect);
        this.addWindow(this._actorWindow);
    };

    /**
     * 装備コマンドウィンドウ矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_Equip.prototype.commandWindowRect = function() {
        return new Rectangle(0, 0, 0, 0);
    }
    const _Scene_Equip_createCommandWindow = Scene_Equip.prototype.createCommandWindow;
    /**
     * コマンドウィンドウを作成する。
     */
    Scene_Equip.prototype.createCommandWindow = function() {
        _Scene_Equip_createCommandWindow.call(this);
        this._commandWindow.deactivate();
        this._commandWindow.hide();
    };
    /**
     * コマンドウィンドウ幅を得る。
     * 
     * @returns {number} コマンドウィンドウ幅
     */
    Scene_Equip.prototype.commandWindowWidth = function() {
        return commandWindowWidth;
    };

    /**
     * アクターウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     */
    Scene_Equip.prototype.equipActorWindowRect = function() {
        const ww = this.commandWindowWidth();
        const wh = 180;
        const wx = 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     * !!!overwrite!!! Scene_Equip.statusWindowRect()
     *     装備画面のレイアウト変更のため、オーバーライドする。
     */
    Scene_Equip.prototype.statusWindowRect = function() {
        const wx = this.commandWindowWidth();
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - wx;
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Equip_createSlotWindow = Scene_Equip.prototype.createSlotWindow;
    /**
     * スロットウィンドウを作成する。
     */
    Scene_Equip.prototype.createSlotWindow = function() {
        _Scene_Equip_createSlotWindow.call(this);
        this._slotWindow.setHandler("itemchange", this.onSlotItemChange.bind(this));
        this._slotWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._slotWindow.setHandler("pageup",   this.previousActor.bind(this));    
    };

    /**
     * 装備スロットウィンドウの表示領域を得る。
     * 
     * @returns {Rectangle} 表示領域
     * !!!overwrite!!! Scene_Equip_slotWindowRect
     *     装備画面レイアウト変更のため、オーバーライドする。
     */
    Scene_Equip.prototype.slotWindowRect = function() {
        const rect = this.equipActorWindowRect();
        const wx = rect.x;
        const wy = rect.y + rect.height;
        const ww = rect.width;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    };


    /**
     * 現在の装備を表示するウィンドウ
     */
    Scene_Equip.prototype.createEquipItemNameWindow = function() {
        const rect = this.equipItemNameWindowRect();
        this._equipItemNameWindow = new Window_EquipItemName(rect);
        this._equipItemNameWindow.hide();
        this.addWindow(this._equipItemNameWindow);
    };

    /**
     * 装備品名表示ウィンドウの表示領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ表示領域
     */
    Scene_Equip.prototype.equipItemNameWindowRect = function() {
        const wh = this.calcWindowHeight(1, false);
        const ww = this.commandWindowWidth();
        const wx = 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    }
    /**
     * 装備可能アイテムウィンドウの表示領域を得る。
     * 
     * @returns {Rectangle} アイテムウィンドウ表示領域
     * !!!overwrite!!! Scene_Equip.itemWindowRect()
     *     装備画面のレイアウトを変更するため、オーバーライドする。
     */
    Scene_Equip.prototype.itemWindowRect = function() {
        const rect = this.equipItemNameWindowRect();
        const wx = rect.x;
        const wy = rect.y + rect.height;
        const ww = rect.width;
        const wh = this.mainAreaBottom() - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Equip_refreshActor = Scene_Equip.prototype.refreshActor;
    /**
     * シーンの対象とするアクターが更新されたときの処理を行う。
     */
    Scene_Equip.prototype.refreshActor = function() {
        _Scene_Equip_refreshActor.call(this);
        const actor = this.actor();
        this._actorWindow.setActor(actor);
    };
        

    /**
     * スロットでOKが選択された時の処理を行う。
     * 
     * !!!overwrite!!! Scene_Equip.onSlotOk()
     *     装備画面の動作を変更するため、オーバーライドする。
     */
    Scene_Equip.prototype.onSlotOk = function() {
        const index = this._slotWindow.index();
        const actor = this.actor();
        const equipSlots = actor.equipSlots();
        if (index < equipSlots.length) {
            // 現在の装備ウィンドウと
            // アイテム選択ウィンドウを表示させ、アイテム選択ウィンドウを有効にする。
            const slotName = actor.equipSlotNames()[index];
            const equipItem = actor.equips()[index];
            this._equipItemNameWindow.setEquipItem(slotName, equipItem);
            this._equipItemNameWindow.show();
            this._itemWindow.show();
            this._itemWindow.select(0);
            this._itemWindow.activate();
        } else {
            // 全部解除してスロットウィンドウを有効化
            SoundManager.playEquip();
            actor.clearEquipments();
            this._statusWindow.refresh();
            this._slotWindow.refresh();
            this._slotWindow.activate();
        }
    };
    
    /**
     * スロットウィンドウでキャンセル操作されたときに通知を受け取る。
     * 
     * !!!overwrite!!! Scene_Equip.onSlotCancel()
     *     装備画面の動作を変更するため、オーバーライドする。
     */
    Scene_Equip.prototype.onSlotCancel = function() {
        this.popScene();
    };

    /**
     * スロットウィンドウで選択項目が変化したときに通知を受け取る。
     */
    Scene_Equip.prototype.onSlotItemChange = function() {
        this.refreshHelpWindow();
    };

    /**
     * 現在選択されているスロットの装備を元にヘルプウィンドウを更新する。
     */
    Scene_Equip.prototype.refreshHelpWindow = function() {
        const index = this._slotWindow.index();
        const actor = this.actor();
        const equipSlots = actor.equipSlots();
        if ((index >= 0) && (index < equipSlots.length)) {
            const equipItem = actor.equips()[index];
            this._helpWindow.setItem(equipItem);
        } else {
            this._helpWindow.clear();
        }
    };
    const _Scene_Equip_onItemOk = Scene_Equip.prototype.onItemOk;
    /**
     * 装備候補ウィンドウでOK操作されたときに通知を受け取る。
     */
    Scene_Equip.prototype.onItemOk = function() {
        _Scene_Equip_onItemOk.call(this);
        this.refreshHelpWindow();
    };

    const _Scene_Equip_hideItemWindow = Scene_Equip.prototype.hideItemWindow;
    /**
     * アイテムウィンドウを閉じる。
     */
    Scene_Equip.prototype.hideItemWindow = function() {
        _Scene_Equip_hideItemWindow.call(this);
        this._equipItemNameWindow.hide();
    };

    /**
     * アクターが変更された時に通知を受け取る。
     * 
     * !!!overwrite!!! Scene_Equip.onActorChange()
     *     装備画面UIの動きを変更するため、オーバーライドする。
     */
    Scene_Equip.prototype.onActorChange = function() {
        this.refreshActor();
        this.hideItemWindow();
        this._slotWindow.activate();
    };

    /**
     * シーンが開始したときの処理を行う。
     */
    Scene_Equip.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._slotWindow.select(0);
        this.refreshHelpWindow();
        this._slotWindow.activate();
    };

    //------------------------------------------------------------------------------
    // Window_ActorCommand
    if (allowChangeEquipInBattle) {
        const _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
        /**
         * コマンドリストを構築する。
         */
        Window_ActorCommand.prototype.makeCommandList = function() {
            _Window_ActorCommand_makeCommandList.call(this);
            if (this._actor) {
                this.addEquipCommand();
            }
        };

        /**
         * 装備コマンドを追加する。
         */
        Window_ActorCommand.prototype.addEquipCommand = function() {
            this.addCommand(TextManager.equip, "equip", true);
        };
    }
    //------------------------------------------------------------------------------
    // Scene_Battleの変更
    if (allowChangeEquipInBattle) {
        const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;

        /**
         * 全てのウィンドウを作成する。
         */
        Scene_Battle.prototype.createAllWindows = function() {
            _Scene_Battle_createAllWindows.call(this);
            this.createEquipSlotWindow();
            this.createEquipCurrentItemWindow();
            this.createEquipStatusWindow();
            this.createEquipItemWindow();
        };

        /**
         * 装備スロットウィンドウを作成する。
         */
        Scene_Battle.prototype.createEquipSlotWindow = function() {
            const rect = this.equipSlotWindowRect();
            this._equipSlotWindow = new Window_EquipSlot(rect);
            this._equipSlotWindow.hide();
            this._equipSlotWindow.setHelpWindow(this._helpWindow);
            this._equipSlotWindow.setHandler("ok",       this.onEquipSlotOk.bind(this));
            this._equipSlotWindow.setHandler("cancel",   this.onEquipSlotCancel.bind(this));
            this.addWindow(this._equipSlotWindow);
        };

        /**
         * 装備スロットウィンドウの矩形領域を得る。
         * 
         * @returns {Rectangle} ウィンドウ矩形領域
         */
        Scene_Battle.prototype.equipSlotWindowRect = function() {
            const rect = this.actorCommandWindowRect();
            const wx = this.isRightInputMode() ? Graphics.boxWidth - commandWindowWidth : 0;
            const wy = rect.y;
            const ww = commandWindowWidth;
            const wh = Math.min(Graphics.boxHeight - wy, this.calcWindowHeight(8, true));
            return new Rectangle(wx, wy, ww, wh);
        };

        /**
         * 現在の装備を表示するウィンドウを作成する。
         */
        Scene_Battle.prototype.createEquipCurrentItemWindow = function() {
            const rect = this.equipItemNameWindowRect();
            this._equipItemNameWindow = new Window_EquipItemName(rect);
            this._equipItemNameWindow.hide();
            this.addWindow(this._equipItemNameWindow);
        };
        /**
         * 装備品名表示ウィンドウの表示領域を得る。
         * 
         * @returns {Rectangle} ウィンドウ表示領域
         */
        Scene_Battle.prototype.equipItemNameWindowRect = function() {
            const rect = this.equipSlotWindowRect();
            const wh = this.calcWindowHeight(1, false);
            const ww = rect.width;
            const wx = rect.x;
            const wy = rect.y;
            return new Rectangle(wx, wy, ww, wh);
        };
        /**
         * 装備ステータス画面を作成する。
         */
        Scene_Battle.prototype.createEquipStatusWindow = function() {
            const rect = this.equipStatusWindowRect();
            this._equipStatusWindow = new Window_EquipStatus(rect);
            this._equipStatusWindow.hide();
            this.addWindow(this._equipStatusWindow);

            this._equipSlotWindow.setStatusWindow(this._equipStatusWindow);
        };

        /**
         * 装備ステータスウィンドウの矩形領域を得る。
         * 
         * @returns {Rectangle} ウィンドウ矩形領域
         */
        Scene_Battle.prototype.equipStatusWindowRect = function() {
            const itemWindowRect = this.itemWindowRect();
            const slotWindowRect = this.equipSlotWindowRect();
            const wx = this.isRightInputMode()
                    ? itemWindowRect.x
                    : slotWindowRect.x + slotWindowRect.width;
            const wy = itemWindowRect.y;
            const ww = this.isRightInputMode()
                    ? slotWindowRect.x - wx
                    : itemWindowRect.x + itemWindowRect.width - wx;
            const wh = Math.min(this.calcWindowHeight(8), slotWindowRect.height);

            return new Rectangle(wx, wy, ww, wh);
        };

        /**
         * 装備品選択ウィンドウを作成する。
         */
        Scene_Battle.prototype.createEquipItemWindow = function() {
            const rect = this.equipItemWindowRect();
            this._equipItemWindow = new Window_EquipItem(rect);
            this._equipItemWindow.setHelpWindow(this._helpWindow);
            this._equipItemWindow.setStatusWindow(this._equipStatusWindow);
            this._equipItemWindow.setHandler("ok",     this.onEquipItemOk.bind(this));
            this._equipItemWindow.setHandler("cancel", this.onEquipItemCancel.bind(this));
            this._equipItemWindow.hide();
            this.addWindow(this._equipItemWindow);
            this._equipSlotWindow.setItemWindow(this._equipItemWindow);

        };

        /**
         * 装備候補選択ウィンドウの表示領域を得る。
         * 
         * @returns {Rectangle} ウィンドウ矩形領域
         */
        Scene_Battle.prototype.equipItemWindowRect = function() {
            const rect = this.equipItemNameWindowRect();
            const wx = rect.x;
            const wy = rect.y + rect.height;
            const ww = commandWindowWidth;
            const wh = Math.min(Graphics.boxHeight - wy, this.calcWindowHeight(8, true));
            return new Rectangle(wx, wy, ww, wh);
        };

        const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
        /**
         * アクターのコマンド選択用ウィンドウを作成する。
         */
        Scene_Battle.prototype.createActorCommandWindow = function() {
            _Scene_Battle_createActorCommandWindow.call(this);
            // equipハンドラの処理
            this._actorCommandWindow.setHandler("equip", this.commandEquip.bind(this));
        };

        /**
         * 装備コマンドが選択された時の処理を行う。
         */
        Scene_Battle.prototype.commandEquip = function() {
            const actor = BattleManager.actor();
            this._equipStatusWindow.setActor(actor);
            this._equipSlotWindow.setActor(actor);
            this._equipItemWindow.setActor(actor);
            this._equipStatusWindow.open();
            this._equipSlotWindow.open();
            this._equipItemWindow.open();
            this._equipSlotWindow.show();
            this._equipStatusWindow.show();
            this._equipItemWindow.hide();
            this._equipItemNameWindow.hide();
            this._helpWindow.show();
            this._actorCommandWindow.deactivate();
            this._equipSlotWindow.activate();
            this._equipSlotWindow.select(0);
            this._equipChanged = false;
        };

        /**
         * 装備スロットウィンドウでOK操作された時の処理を行う。
         */
        Scene_Battle.prototype.onEquipSlotOk = function() {
            this._equipItemWindow.show();
            this._equipItemNameWindow.show();

            const index = this._equipSlotWindow.index();
            const actor = BattleManager.actor();
            const slotName = actor.equipSlotNames()[index];
            const equipItem = actor.equips()[index];
            this._equipItemNameWindow.setEquipItem(slotName, equipItem);
            this._equipItemWindow.refresh();
            this._equipItemWindow.select(0);
            this._equipStatusWindow.refresh();
            this._equipItemWindow.activate();
        };

        /**
         * 装備スロット画面でキャンセル操作されたときの処理を行う。
         */
        Scene_Battle.prototype.onEquipSlotCancel = function() {
            this._equipStatusWindow.close();
            this._equipSlotWindow.close();
            this._equipItemWindow.close();
            this._equipItemNameWindow.close();
            this._helpWindow.hide();
            this._actorCommandWindow.refresh();
            this._actorCommandWindow.activate();
            this._equipSlotWindow.deactivate();
        };

        /**
         * 装備選択ウィンドウでOK操作された時の処理を行う。
         */
        Scene_Battle.prototype.onEquipItemOk = function() {
            SoundManager.playEquip();
            const actor = BattleManager.actor();
            actor.changeEquip(this._equipSlotWindow.index(), this._equipItemWindow.item());
            this._equipSlotWindow.activate();
            this._equipSlotWindow.refresh();
            this._equipItemWindow.hide();
            this._equipItemNameWindow.hide();
            this._equipItemWindow.deselect();
            this._equipItemWindow.refresh();
            this._equipStatusWindow.refresh();
        };

        /**
         * 装備アイテム選択ウィンドウでキャンセル操作されたときの処理を行う。
         */
        Scene_Battle.prototype.onEquipItemCancel = function() {
            this._equipItemWindow.deselect();
            this._equipItemWindow.hide();
            this._equipItemNameWindow.hide();
            this._equipSlotWindow.activate();
        };

        const _Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
        /**
         * いずれかの入力ウィンドウがアクティブ（選択中）かどうかを判定する。
         * 
         * @returns {boolean} いずれかの入力ウィンドウがアクティブな場合にはtrue, それ以外はfalse
         */
        Scene_Battle.prototype.isAnyInputWindowActive = function() {
            return _Scene_Battle_isAnyInputWindowActive.call(this)
                    || this._equipItemWindow.active
                    || this._equipSlotWindow.active;
        };
    }

})();
