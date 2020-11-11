/*:ja
 * @target MZ 
 * @plugindesc TWLD向け装備画面プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 
 * @orderAfter 
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
 * @help 
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
 * Version.0.1.0 TWLD向けに作成したものをベースに作成。動作未確認。
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

    // ベーシックシステムでのUI要素
    //   {Window_Help} _helpWindow 装備品の説明表示
    //   {Window_EquipStatus} _statusWindow 装備したときのステータスの変化を表示する。
    //   {Window_EquipCommand} _commandWindow 装備/最適/解除などを選択するウィンドウ
    //   {Window_EquipSlot} _slotWindow 多分装備スロットと装備品を表示するウィンドウ。
    //   {Window_EquipItem} _itemWindow 変更対象のアイテムを選択させるウィンドウ

    // TWLDでの設計方針
    // ステータスがてんこ盛りなので、わかりやすいやつだけ分離したい。
    // Note:パラメータ名はTextManagerで管理した方がいいなあ。

    //------------------------------------------------------------------------------
    // Window_EquipActor
    // 

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
     * @param {Number} x 描画領域左上X
     * @param {Number} y 描画領域左上Y
     * @param {Number} width 幅
     * @param {Number} height 高さ
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
     * @param {Number} index インデックス番号
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
     * @return {Number} 選択項目数
     */
    Window_EquipSlot.prototype.maxItems = function() {
        if (this._actor) {
            var count = this._actor.equipSlots().length;
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
     * @return {Number} スロット名の幅
     */
    Window_EquipSlot.prototype.slotNameWidth = function() {
        return slotNameWidth;
    };

    /**
     * 装備品名を描画する。
     * 
     * @param {Object} item 装備アイテム(DataWeapon/DataArmor)
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 描画幅
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
     * @param {Number} index インデックス番号
     * @return {Boolan} 選択可能な場合にはtrue, それ以外はfalse
     */
    Window_EquipSlot.prototype.isEnabled = function(index) {
        if (this._actor === null) {
            return false;
        }
        var equipSlots = this._actor.equipSlots();
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
     * @param {Number} index インデックス番号
     * @return {Object} アイテムオブジェクト。未装備の場合にはnull
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
     * @param {String} slotName スロット名
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
     * @param {Object} item アイテム(nameプロパティを持つオブジェクト)
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 描画幅
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
    // Scene_EquipStatus

    /**
     * 表示を更新する。
     * 
     * !!!overwrite!!! Window_EquipStatus.refresh()
     *     表示内容を変更するため、オーバーライドする。
     */
    Window_EquipStatus.prototype.refresh = function() {
        this.contents.clear();

        // よく考えて表示しよう。
        //
        // 装備変更品選択中は、基本パラメータ以外は変動するやつだけでいいよ。
        // 装備変更品選択中でない場合、全ステータス表示にしないとあかん。
        // 装備品選択中かどうかは、this._tempActorがnullかどうかで判断できる。
    };

    // /**
    //  * 表示を更新する。
    //  */
    // Window_EquipStatus.prototype.refresh = function() {
    //     this.contents.clear();
    //     if (this._actor === null) {
    //         return;
    //     }

    //     var padding = this.standardPadding();
    //     var x = padding;
    //     var y = padding;
    //     var blockWidth = Math.floor((this.contentsWidth() - padding) / 2);

    //     // 1列目のステータスA描画
    //     this.drawBlock1(x, y);
    //     // 1列目のステータスB描画
    //     this.drawBlock2(x, y + this.lineHeight() * 6 + 8);
    //     // 2列目のステータス描画
    //     this.drawBlock3(x + blockWidth + padding, y);
    // };

    // /**
    //  * 1列目パラメータ
    //  */
    // Window_EquipStatus.prototype.drawBlock1 = function(x, y) {
    //     var lineHeight = this.lineHeight();
    //     var actor1 = this._actor;
    //     var actor2 = this._tempActor;
    //     var paramList = [
    //         { name:'HP',   get:function(a) { return a.mhp; } },
    //         { name:'MP',   get:function(a) { return a.mmp; } },
    //         { name:'ATK',  get:function(a) { return a.atk; } },
    //         { name:'MATK', get:function(a) { return a.mat; } },
    //         { name:'DEF',  get:function(a) { return a.def; } },
    //         { name:'MDEF', get:function(a) { return a.mdf; } },
    //     ];

    //     for (var i = 0; i < paramList.length; i++) {
    //         var param = paramList[i];
    //         if (param !== null) {
    //             this.drawValueParam(param, actor1, actor2, x, y + lineHeight * i);
    //         }
    //     }
    // };
    // /**
    //  * 2列目パラメータ
    //  */
    // Window_EquipStatus.prototype.drawBlock2 = function(x, y) {
    //     var lineHeight = this.lineHeight();
    //     var actor1 = this._actor;
    //     var actor2 = this._tempActor;
    //     var paramList = [
    //         { name:'STR',  get:function(a) { return a.str; } },
    //         { name:'DEX',  get:function(a) { return a.dex; } },
    //         { name:'VIT',  get:function(a) { return a.vit; } },
    //         { name:'INT',  get:function(a) { return a.int; } },
    //         { name:'AGI',  get:function(a) { return a.agi; } },
    //         { name:'LUK',  get:function(a) { return a.luk; } },
    //     ];

    //     for (var i = 0; i < paramList.length; i++) {
    //         var param = paramList[i];
    //         if (param !== null) {
    //             this.drawValueParam(param, actor1, actor2, x, y + lineHeight * i);
    //         }
    //     }
    // };
    // /**
    //  * 数値パラメータを描画する。
    //  * @param {} 表示パラメータ
    //  * @param {Game_Actor} 現在のアクター
    //  * @param {Game_Actor} 装備後アクター
    //  * @param {Number} x x位置
    //  * @param {Number} y y位置
    //  */
    // Window_EquipStatus.prototype.drawValueParam = function(param, actor1, actor2, x, y) {
    //     this.changeTextColor(this.systemColor());
    //     this.drawText(param.name, x, y, 48);
    //     this.resetTextColor();
    //     var current = param.get(actor1);
    //     this.drawText(current, x + 52, y, 80, 'right');

    //     if (actor2 !== null) {
    //         var after = param.get(actor2);
    //         if (current !== after) {
    //             // 変化があるときだけ描画
    //             this.drawRightArrow(x + 138, y);
    //             if (after > current) {
    //                 this.changeTextColor(this.powerUpColor());
    //             } else {
    //                 this.changeTextColor(this.powerDownColor());
    //             }
    //             this.drawText(after, x + 150, y, 80, 'right');
    //         }            
    //     }
    // };

    // /**
    //  * 3列目パラメータ
    //  */
    // Window_EquipStatus.prototype.drawBlock3 = function(x, y) {
    //     var lineHeight = this.lineHeight();
    //     var actor1 = this._actor;
    //     var actor2 = this._tempActor;
    //     var paramList = [
    //         { name:'PPR', get:function(a) { return a.ppr; } },
    //         { name:'PDRR', get:function(a) { return 1 - a.pdr; } },
    //         { name:'MPR', get:function(a) { return a.mpr; } },
    //         { name:'MDRR', get:function(a) { return 1 - a.mdr; } },
    //         null,
    //         { name:'HIT', get:function(a) { return a.hit; } },
    //         { name:'EVA', get:function(a) { return a.eva; } },
    //         { name:'MEVA', get:function(a) { return a.mev; } },
    //         { name:'CRI', get:function(a) { return a.cri; } },
    //         { name:'CRR', get:function(a) { return a.pcr - TWLD.Core.BasicCriticalRate; }  },
    //         { name:'MCRR', get:function(a) { return a.mcrr - TWLD.Core.BasicCriticalRate; }},
    //     ];
    //     for (var i = 0; i < paramList.length; i++) {
    //         var param = paramList[i];
    //         if (param !== null) {
    //             this.drawRateParam(param, actor1, actor2, x, y + lineHeight * i);
    //         }
    //     }
    // };

    // /**
    //  * 確率パラメータを描画する。
    //  * @param {} 表示パラメータ
    //  * @param {Game_Actor} 現在のアクター
    //  * @param {Game_Actor} 装備後アクター
    //  * @param {Number} x x位置
    //  * @param {Number} y y位置
    //  */
    // Window_EquipStatus.prototype.drawRateParam = function(param, actor1, actor2, x, y) {
    //     this.changeTextColor(this.systemColor());
    //     this.drawText(param.name, x, y, 60);
    //     this.resetTextColor();
    //     var current = Math.floor(param.get(actor1) * 100);
    //     this.drawText(current + '%', x + 64, y, 80, 'right');

    //     if (actor2 !== null) {
    //         var after = Math.floor(param.get(actor2) * 100);
    //         if (current !== after) {
    //             // 変化があるときだけ描画
    //             this.drawRightArrow(x + 180, y);
    //             if (after > current) {
    //                 this.changeTextColor(this.powerUpColor());
    //             } else {
    //                 this.changeTextColor(this.powerDownColor());
    //             }
    //             this.drawText(after + '%', x + 190, y, 80, 'right');
    //         }            
    //     }
    // };
    
    //------------------------------------------------------------------------------
    // Scene_Equip
    //
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
     * @return {Rectangle} ウィンドウ矩形領域
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
     * @return {Number} コマンドウィンドウ幅
     */
    Scene_Equip.prototype.commandWindowWidth = function() {
        return commandWindowWidth;
    };

    /**
     * アクターウィンドウの矩形領域を得る。
     * 
     * @return {Rectangle} ウィンドウ矩形領域。
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
     * @return {Rectangle} ウィンドウ矩形領域
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
        this._slotWindow.setHandler('itemchange', this.onSlotItemChange.bind(this));
        this._slotWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._slotWindow.setHandler('pageup',   this.previousActor.bind(this));    
    };

    /**
     * 装備スロットウィンドウの表示領域を得る。
     * 
     * @return {Rectangle} 表示領域
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
     * @return {Rectangle} ウィンドウ表示領域
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
     * @return {Rectangle} アイテムウィンドウ表示領域
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
            const slotName = $dataSystem.equipTypes[equipSlots[index]]
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
    
    // /**
    //  * 装備操作ウィンドウでキャンセル操作されたときに通知を受け取る。
    //  */
    // Scene_Equip.prototype.onItemCancel = function() {
    //     this._slotWindow.activate();
    //     this.refreshHelpWindow();
    //     this._itemWindow.deselect();
    //     this._equipItemNameWindow.hide();
    //     this._itemWindow.hide();
    // };

    // Scene_Equip.prototype.onItemItemChange = function() {
    //     const item = this._itemWindow.item();
    //     this._helpWindow.setItem(item);
    //     if (this._actor && this._statusWindow) {
    //         const actor = JsonEx.makeDeepCopy(this._actor);
    //         const slotId = this._slotWindow.slotId();
    //         actor.forceChangeEquip(slotId, item);
    //         this._statusWindow.setTempActor(actor);
    //     }
    // };
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

    // //------------------------------------------------------------------------------
    // // Window_ActorCommandの変更
    // //
    // TWLD.UIEquip.Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    // /**
    //  * コマンドリストを構築する。
    //  */
    // Window_ActorCommand.prototype.makeCommandList = function() {
    //     TWLD.UIEquip.Window_ActorCommand_makeCommandList.call(this);
    //     if (this._actor) this.addEquipCommand();
    // };

    // /**
    //  * 装備コマンドを追加する。
    //  */
    // Window_ActorCommand.prototype.addEquipCommand = function() {
    //     this.addCommand(TextManager.equip, 'equip', true);
    // };
    // //------------------------------------------------------------------------------
    // // Scene_Battleの変更
    // //
    // TWLD.UIEquip.Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;

    // /**
    //  * 全てのウィンドウを作成する。
    //  */
    // Scene_Battle.prototype.createAllWindows = function() {
    //     TWLD.UIEquip.Scene_Battle_createAllWindows.call(this);
    //     this.createEquipSlotWindow();
    //     this.createEquipStatusWindow();
    //     this.createEquipItemWindow();
    // };

    // TWLD.UIEquip.Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    // /**
    //  * アクターのコマンド選択用ウィンドウを作成する。
    //  */
    // Scene_Battle.prototype.createActorCommandWindow = function() {
    //     // Window_ActorCommandを作成したり、ハンドラの登録が行われたりする。
    //     TWLD.UIEquip.Scene_Battle_createActorCommandWindow.call(this);
    //     // equipハンドラの処理
    //     this._actorCommandWindow.setHandler('equip', this.commandEquip.bind(this));
    // };
    // /**
    //  * 装備スロットウィンドウを作成する。
    //  */
    // Scene_Battle.prototype.createEquipSlotWindow = function() {
    //     var x = 0;
    //     var y = this._helpWindow.height;
    //     var width = 480;
    //     var height = Graphics.boxHeight - this._helpWindow.height;
    //     this._equipSlotWindow = new Window_EquipSlot(x, y, width, height);
    //     this._equipSlotWindow.hide();
    //     this._equipSlotWindow.setHelpWindow(this._helpWindow);
    //     this._equipSlotWindow.setHandler('ok',       this.onEquipSlotOk.bind(this));
    //     this._equipSlotWindow.setHandler('cancel',   this.onEquipSlotCancel.bind(this));
    //     this.addWindow(this._equipSlotWindow);
    // };

    // /**
    //  * 装備ステータス画面を作成する。
    //  */
    // Scene_Battle.prototype.createEquipStatusWindow = function() {
    //     var x = this._equipSlotWindow.width;
    //     var y = this._helpWindow.height;
    //     var width = Graphics.boxWidth - x;
    //     var height = Graphics.boxHeight - y - this._helpWindow.height;
    //     this._equipStatusWindow = new Window_EquipStatus(x, y, width, height);
    //     this._equipStatusWindow.hide();
    //     this.addWindow(this._equipStatusWindow);

    //     this._equipSlotWindow.setStatusWindow(this._equipStatusWindow);
    // };

    // /**
    //  * 装備品選択ウィンドウを作成する。
    //  */
    // Scene_Battle.prototype.createEquipItemWindow = function() {
    //     var x = this._equipSlotWindow.x + 10;
    //     var y = this._equipSlotWindow.y + 40;
    //     var width = this._equipSlotWindow.width;
    //     var height = Graphics.boxHeight - this._helpWindow.height;
    //     this._equipItemWindow = new Window_EquipItem(x, y, width, height);
    //     this._equipItemWindow.setHelpWindow(this._helpWindow);
    //     this._equipItemWindow.setStatusWindow(this._equipStatusWindow);
    //     this._equipItemWindow.setHandler('ok',     this.onEquipItemOk.bind(this));
    //     this._equipItemWindow.setHandler('cancel', this.onEquipItemCancel.bind(this));
    //     this._equipItemWindow.hide();
    //     this.addWindow(this._equipItemWindow);
    // };

    // /**
    //  * 装備コマンドが選択された時の処理を行う。
    //  */
    // Scene_Battle.prototype.commandEquip = function() {
    //     var actor = BattleManager.actor();
    //     this._equipStatusWindow.setActor(actor);
    //     this._equipSlotWindow.setActor(actor);
    //     this._equipItemWindow.setActor(actor);
    //     this._equipStatusWindow.open();
    //     this._equipSlotWindow.open();
    //     this._equipItemWindow.open();
    //     this._equipSlotWindow.show();
    //     this._equipStatusWindow.show();
    //     this._equipItemWindow.hide();
    //     this._helpWindow.show();
    //     this._actorCommandWindow.deactivate();
    //     this._equipSlotWindow.activate();
    //     this._equipSlotWindow.select(0);
    //     this._equipChanged = false;
    // };

    // /**
    //  * 装備スロットウィンドウでOK操作された時の処理を行う。
    //  */
    // Scene_Battle.prototype.onEquipSlotOk = function() {
    //     this._equipItemWindow.show();
    //     this._equipItemWindow.select(0);
    //     this._equipStatusWindow.refresh();
    //     this._equipItemWindow.activate();
    // };

    // /**
    //  * 装備スロット画面でキャンセル操作されたときの処理を行う。
    //  */
    // Scene_Battle.prototype.onEquipSlotCancel = function() {
    //     this._equipStatusWindow.close();
    //     this._equipSlotWindow.close();
    //     this._equipItemWindow.close();
    //     this._helpWindow.hide();
    //     this._actorCommandWindow.activate();
    //     this._equipSlotWindow.deactivate();
    // };

    // /**
    //  * 装備選択ウィンドウでOK操作された時の処理を行う。
    //  */
    // Scene_Battle.prototype.onEquipItemOk = function() {
    //     SoundManager.playEquip();
    //     var actor = BattleManager.actor();
    //     actor.changeEquip(this._equipSlotWindow.index(), this._equipItemWindow.item());
    //     this._equipSlotWindow.activate();
    //     this._equipSlotWindow.refresh();
    //     this._equipItemWindow.hide();
    //     this._equipItemWindow.deselect();
    //     this._equipItemWindow.refresh();
    //     this._equipStatusWindow.refresh();
    // };

    // /**
    //  * 装備アイテム選択ウィンドウでキャンセル操作されたときの処理を行う。
    //  */
    // Scene_Battle.prototype.onEquipItemCancel = function() {
    //     this._equipItemWindow.deselect();
    //     this._equipItemWindow.hide();
    //     this._equipSlotWindow.activate();

    // };

})();