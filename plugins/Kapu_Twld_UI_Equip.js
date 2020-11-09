/*:ja
 * @target MZ 
 * @plugindesc TWLD向け装備画面プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base 
 * @orderAfter 
 * 
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
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    // const pluginName = "Kapu_Twld_UI_Equip";
    // const parameters = PluginManager.parameters(pluginName);

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
    // TODO : メソッドフック・拡張

    // //------------------------------------------------------------------------------
    // // Window_EquipActor
    // // 
    // function Window_EquipActor() {
    //     this.initialize.apply(this, arguments);
    // }

    // Window_EquipActor.prototype = Object.create(Window_Base.prototype);
    // Window_EquipActor.prototype.constructor = Window_EquipActor;

    // /**
    //  * 初期化する。
    //  */
    // Window_EquipActor.prototype.initialize = function(x, y, width, height) {
    //     Window_Base.prototype.initialize.call(this, x, y, width, height);
    //     this._actor = null;
    // };

    // /**
    //  * アクターを設定する
    //  * @param {Game_Actor} actor アクター
    //  */
    // Window_EquipActor.prototype.setActor = function(actor) {
    //     if (this._actor !== actor) {
    //         this._actor = actor;
    //         this.refresh();
    //     }
    // }


    // /**
    //  * 描画を更新する。
    //  */
    // Window_EquipActor.prototype.refresh = function() {
    //     var x = this.standardPadding();
    //     var y = this.standardPadding();
    //     this.contents.clear();

    //     var actor = this._actor;
    //     if (actor === null) {
    //         return;
    //     }
    //     this.drawActorFace(actor, x, y);
    //     this.drawActorName(actor, x + 150, y, 150);
    // };


    // //------------------------------------------------------------------------------
    // // Window_EquipSlotの変更
    // //
    // /**
    //  * スロットウィンドウの選択項目数を得る。
    //  * @return {Number} 選択項目数
    //  */
    // Window_EquipSlot.prototype.maxItems = function() {
    //     if (this._actor) {
    //         var count = this._actor.equipSlots().length;
    //         // 戦闘中は「全て外す」を無効化する。
    //         return $gameParty.inBattle() ? count : count + 1;
    //     }
    //     return 0;
    // };
    // /**
    //  * スロットウィンドウの項目を描画する。
    //  * @param {Index} index インデックス
    //  */
    // Window_EquipSlot.prototype.drawItem = function(index) {
    //     var actor = this._actor;
    //     if (actor === null) {
    //         return;
    //     }

    //     var rect = this.itemRectForText(index);
    //     var x = rect.x;
    //     var y = rect.y;

    //     var equipSlots = actor.equipSlots();
    //     var equips = actor.equips();
    //     this.changePaintOpacity(this.isEnabled(index));
    //     if (index < equipSlots.length) {
    //         this.changeTextColor(this.systemColor());
    //         // スロット名
    //         this.changeTextColor(this.systemColor());
    //         var slotName = $dataSystem.equipTypes[equipSlots[index]];
    //         this.drawText(slotName, x, y, 120);
    //         this.drawText(':', x + 120, y, 16);

    //         // 装備品名称
    //         var equipItem = equips[index];
    //         var x3 = x + 140;
    //         var nameWidth = x + rect.width - x3;
    //         if (equipItem) {
    //             this.changeTextColor(this.itemNameColor(equipItem));
    //             this.drawItemName(equipItem, x3, y, nameWidth);
    //         } else {
    //             this.resetTextColor();
    //             this.drawText('(なし)', x3, y, nameWidth, 'left');
    //         }
    //     } else {
    //         this.drawText(TextManager.clear, x, y, rect.width);
    //     }
    //     this.changePaintOpacity(true);
    // };
    // /**
    //  * indexで指定される項目が有効かどうかを判定する。
    //  * @param {Number} index インデックス
    //  * @return {Boolan} 有効な場合にはtrue, それ以外はfalse
    //  */
    // Window_EquipSlot.prototype.isEnabled = function(index) {
    //     if (this._actor === null) {
    //         return false;
    //     }
    //     var equipSlots = this._actor.equipSlots();
    //     if (index >= equipSlots.length) {
    //         // 戦闘中以外は全て外すとか有効。
    //         return $gameParty.inBattle() ? false : true;
    //     }

    //     var slotType = equipSlots[index];
    //     if ($gameParty.inBattle() && (slotType !== 1)) {
    //         return false;
    //     }

    //     return true;
    // };

    // /**
    //  * 現在選択されている項目の装備品を得る。
    //  * @return {Data_Item} 装備品。但し外すの項目であったり、未装備のスロットではnullが返る。
    //  */
    // Window_EquipSlot.prototype.item = function() {
    //     if (this._actor) {
    //         var equips = this._actor.equips();
    //         if (this.index() < equips.length) {
    //             return equips[this.index()];
    //         }
    //     }
    //     return null;
    // };

    // /**
    //  * 選択されているスロット番号を得る。
    //  * @return {Number} スロット番号
    //  */
    // Window_EquipSlot.prototype.slotId = function() {
    //     if (this._actor) {
    //         var equips = this._actor.equips();
    //         var index = this.index();
    //         if (index < equips.length) {
    //             return index;
    //         }
    //     }
    //     return -1;
    // };
    
    // //------------------------------------------------------------------------------
    // // Window_EquipCurrent
    // // 
    // function Window_EquipCurrent() {
    //     this.initialize.apply(this, arguments);
    // }

    // Window_EquipCurrent.prototype = Object.create(Window_Base.prototype);
    // Window_EquipCurrent.prototype.constructor = Window_EquipCurrent;

    // /**
    //  * 初期化する。
    //  */
    // Window_EquipCurrent.prototype.initialize = function(x, y, width, height) {
    //     Window_Base.prototype.initialize.call(this, x, y, width, height);
    //     this._slotName = null;
    //     this._item = null;
    // };

    // /**
    //  * 現在の装備品情報を設定する。
    //  * @param {String} slotName スロット名
    //  * @param {Data_Item} item 装備品
    //  */
    // Window_EquipCurrent.prototype.setEquipItem = function(slotName, item) {
    //     this._slotName = slotName;
    //     this._item = item;
    //     this.refresh();
    // };

    // /**
    //  * 描画を更新する。
    //  */
    // Window_EquipCurrent.prototype.refresh = function() {
    //     var x = this.standardPadding();
    //     var y = 0;
    //     this.contents.clear();
    //     this.changeTextColor(this.systemColor());
    //     // スロット名
    //     this.changeTextColor(this.systemColor());
    //     this.drawText(this._slotName, x, y, 120);
    //     this.drawText(':', x + 120, y, 16);

    //     // 装備品アイコン
    //     var equipItem = this._item;
    //     if (equipItem && (equipItem.iconIndex >= 0)) {
    //         var x2 = x + 140;
    //         if (equipItem.iconIndex >= 0) {
    //             this.drawIcon(equipItem.iconIndex, x2 + 2, y + 2);
    //         }
    //     }

    //     // 装備品名称
    //     var x3 = x + 180;
    //     var nameWidth = x + this.contentsWidth() - x3;
    //     if (equipItem) {
    //         this.drawItemName(equipItem, x3, y, nameWidth);
    //     } else {
    //         this.resetTextColor();
    //         this.drawText('(なし)', x3, y, nameWidth, 'left');
    //     }
    // };


    // //------------------------------------------------------------------------------
    // // Scene_EquipStatusの変更
    // //
    // /**
    //  * WIndow_EquipStatusを初期化する。
    //  * レイアウトはシーン側で指定したいのでオーバーライド。
    //  * @param {Number} x x位置
    //  * @param {Number} y y位置
    //  * @param {Number} width ウィンドウ幅
    //  * @param {Number} height ウィンドウ高さ
    //  */
    // Window_EquipStatus.prototype.initialize = function(x, y, width, height) {
    //     Window_Base.prototype.initialize.call(this, x, y, width, height);
    //     this._actor = null;
    //     this._tempActor = null;
    //     this.refresh();
    // };

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
    
    // //------------------------------------------------------------------------------
    // // Scene_Equipの変更
    // //
    // Scene_Equip.prototype.create = function() {
    //     Scene_MenuBase.prototype.create.call(this);
    //     this.createActorWindow();
    //     this.createHelpWindow();
    //     this.createSlotWindow();
    //     this.createStatusWindow();
    //     this.createCurrentEquipWindow();
    //     this.createItemWindow();

    //     this.refreshActor();
    // };

    // /**
    //  * アクターウィンドウを作成する。
    //  */
    // Scene_Equip.prototype.createActorWindow = function() {
    //     var x = 0;
    //     var y = 0;
    //     var width = 480;
    //     var height = 182;
    //     this._actorWindow = new Window_EquipActor(x, y, width, height);
    //     this.addWindow(this._actorWindow);
    // };

    // /**
    //  * ヘルプウィンドウを作成する。
    //  */
    // Scene_Equip.prototype.createHelpWindow = function() {
    //     var height = 180;
    //     var width = Graphics.boxWidth;
    //     var x = 0;
    //     var y = Graphics.boxHeight - height;
    //     this._helpWindow = new Window_Help(4, x, y, width, height);
    //     this.addWindow(this._helpWindow);
    // };
    
    // /**
    //  * ステータスウィンドウを作成する。
    //  */
    // Scene_Equip.prototype.createStatusWindow = function() {
    //     var x = this._actorWindow.width;
    //     var y = 0;
    //     var width = Graphics.boxWidth - x;
    //     var height = Graphics.boxHeight - y - this._helpWindow.height;
    //     this._statusWindow = new Window_EquipStatus(x, y, width, height);
    //     this.addWindow(this._statusWindow);
    // };

    // /**
    //  * スロットウィンドウを作成する。
    //  */
    // Scene_Equip.prototype.createSlotWindow = function() {
    //     var x = 0;
    //     var y = this._actorWindow.height;
    //     var width = this._actorWindow.width;
    //     var height = Graphics.boxHeight - y - this._helpWindow.height;
    //     this._slotWindow = new Window_EquipSlot(x, y, width, height);
    //     this._slotWindow.setHandler('ok',       this.onSlotOk.bind(this));
    //     this._slotWindow.setHandler('cancel',   this.onSlotCancel.bind(this));
    //     this._slotWindow.setHandler('itemchange', this.onSlotItemChange.bind(this));
    //     this._slotWindow.setHandler('pagedown', this.nextActor.bind(this));
    //     this._slotWindow.setHandler('pageup',   this.previousActor.bind(this));    
    //     this.addWindow(this._slotWindow);
    // };

    // /**
    //  * 現在の装備を表示するウィンドウ
    //  */
    // Scene_Equip.prototype.createCurrentEquipWindow = function() {
    //     var x = 10;
    //     var y = 4;
    //     var width = this._actorWindow.width;
    //     var height = 108;
    //     this._currentEquipWindow = new Window_EquipCurrent(x, y, width, height);
    //     this._currentEquipWindow.hide();
    //     this.addWindow(this._currentEquipWindow);
    // };

    // /**
    //  * アイテム選択画面を構築する。
    //  */
    // Scene_Equip.prototype.createItemWindow = function() {
    //     var x = 10;
    //     var y = this._currentEquipWindow.y + this._currentEquipWindow.height;
    //     var width = this._actorWindow.width;
    //     var height = Graphics.boxHeight - y - this._helpWindow.height;
    //     this._itemWindow = new Window_EquipItem(x, y, width, height);
    //     this._itemWindow.setHelpWindow(this._helpWindow);
    //     this._itemWindow.setStatusWindow(this._statusWindow);
    //     this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    //     this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    //     this._itemWindow.setHandler('itemchange', this.onItemItemChange.bind(this));
    //     this._itemWindow.hide();
    //     this.addWindow(this._itemWindow);
    // };
    // /**
    //  * シーンの対象とするアクターが更新されたときの処理を行う。
    //  */
    // Scene_Equip.prototype.refreshActor = function() {
    //     var actor = this.actor();
    //     this._actorWindow.setActor(actor);
    //     this._statusWindow.setActor(actor);
    //     this._slotWindow.setActor(actor);
    //     this._itemWindow.setActor(actor);
    // };
        

    // /**
    //  * スロットでOKが選択された時の処理を行う。
    //  */
    // Scene_Equip.prototype.onSlotOk = function() {
    //     var index = this._slotWindow.index();
    //     var actor = this.actor();
    //     var equipSlots = actor.equipSlots();
    //     if (index < equipSlots.length) {
    //         // 現在の装備ウィンドウと
    //         // アイテム選択ウィンドウを表示させ、アイテム選択ウィンドウを有効にする。
    //         var slotName = $dataSystem.equipTypes[equipSlots[index]]
    //         var equipItem = actor.equips()[index];
    //         this._currentEquipWindow.setEquipItem(slotName, equipItem);
    //         this._currentEquipWindow.show();
    //         Yanfly.Equip.Window_EquipItem_setSlotId.call(this._itemWindow, index);
    //         this._itemWindow.setSlotId(index);
    //         this._itemWindow.show();
    //         this._itemWindow.select(0);
    //         this._itemWindow.activate();
    //     } else {
    //         // 全部解除してスロットウィンドウを有効化
    //         SoundManager.playEquip();
    //         actor.clearEquipments();
    //         this._statusWindow.refresh();
    //         this._slotWindow.refresh();
    //         this._slotWindow.activate();
    //     }
    // };
    
    // /**
    //  * スロットウィンドウでキャンセル操作されたときに通知を受け取る。
    //  */
    // Scene_Equip.prototype.onSlotCancel = function() {
    //     this.popScene();
    // };

    // /**
    //  * スロットウィンドウで選択項目が変化したときに通知を受け取る。
    //  */
    // Scene_Equip.prototype.onSlotItemChange = function() {
    //     this.refreshHelpWindow();
    // };

    // /**
    //  * 現在選択されているスロットの装備を元にヘルプウィンドウを更新する。
    //  */
    // Scene_Equip.prototype.refreshHelpWindow = function() {
    //     var index = this._slotWindow.index();
    //     var actor = this.actor();
    //     var equipSlots = actor.equipSlots();
    //     if ((index >= 0) && (index < equipSlots.length)) {
    //         var equipItem = actor.equips()[index];
    //         this._helpWindow.setItem(equipItem);
    //     } else {
    //         this._helpWindow.clear();
    //     }
    // };
      
    // /**
    //  * 装備候補ウィンドウでOK操作されたときに通知を受け取る。
    //  */
    // Scene_Equip.prototype.onItemOk = function() {
    //     SoundManager.playEquip();
    //     this.actor().changeEquip(this._slotWindow.index(), this._itemWindow.item());
    //     this.refreshHelpWindow();
    //     this._slotWindow.activate();
    //     this._slotWindow.refresh();
    //     this._itemWindow.deselect();
    //     this._itemWindow.refresh();
    //     this._statusWindow.refresh();
    //     this._currentEquipWindow.hide(); 
    //     this._itemWindow.hide();
    // };
    
    // /**
    //  * 装備操作ウィンドウでキャンセル操作されたときに通知を受け取る。
    //  */
    // Scene_Equip.prototype.onItemCancel = function() {
    //     this._slotWindow.activate();
    //     this.refreshHelpWindow();
    //     this._itemWindow.deselect();
    //     this._currentEquipWindow.hide();
    //     this._itemWindow.hide();
    // };

    // Scene_Equip.prototype.onItemItemChange = function() {
    //     var item = this._itemWindow.item();
    //     this._helpWindow.setItem(item);
    //     if (this._actor && this._statusWindow) {
    //         var actor = JsonEx.makeDeepCopy(this._actor);
    //         var slotId = this._slotWindow.slotId();
    //         actor.forceChangeEquip(slotId, item);
    //         this._statusWindow.setTempActor(actor);
    //     }
    // };
    // /**
    //  * アクターが変更された時に通知を受け取る。
    //  */
    // Scene_Equip.prototype.onActorChange = function() {
    //     this.refreshActor();
    //     this._slotWindow.activate();
    // };

    // /**
    //  * シーンが開始したときの処理を行う。
    //  */
    // Scene_Equip.prototype.start = function() {
    //     Scene_MenuBase.prototype.start.call(this);
    //     this._slotWindow.select(0);
    //     this.refreshHelpWindow();
    //     this._slotWindow.activate();
    // };
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