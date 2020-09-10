/*:
 * @plugindesc TWLDのステータス画面
 * @help
 *      TWLDのステータス画面を提供する。
 *      装備とかスキルとか全て確認できるべき、という前提で構築した。
 *      あとTWLDでは独自パラメータを用意した関係で、
 *      他のプラグインを使うのが難しいというのもあった。
 * 
 */
var Imported = Imported || {};
Imported.TWLD_UI_Equip = true;

if (!Imported.TWLD_UI) {
    throw "This plugin must be import after TWLD_UI.js";
}

var TWLD = TWLD || {};
TWLD.Core = TWLD.Core || {};


if (typeof Window_Command === 'undefined') {
    var Window_Base = {};
    var Window_Help = {};
    var Window_Command = {};
    var Window_Selectable = {};

    var Scene_Status = {};
    var Scene_MenuBase = {};
    var Scene_Equip = {};

    var $dataSystem = {};

    var TextManager = {};
    var ImageManager = {};
    var SceneManager = {};

    var Utils = {};
    var Graphics = {};
}

(function() {
    'use strict';

    //------------------------------------------------------------------------------
    // Window_StatusActor
    //
    /**
     * Window_StatusActor
     * ステータス画面でアクター情報を表示する。
     */
    function Window_StatusActor() {
        this.initialize.apply(this, arguments);
    }

    Window_StatusActor.prototype = Object.create(Window_Base.prototype);
    Window_StatusActor.prototype.constuctor = Window_StatusActor;

    /**
     * Window_StatusActorを初期化する。
     */
    Window_StatusActor.prototype.initialize = function(x, y, width, height) {
        this._actor = null;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };

    /**
     * アクターを設定する。
     * @param {Game_Actor} actor アクター
     */
    Window_StatusActor.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    /**
     * 表示を更新する。
     */
    Window_StatusActor.prototype.refresh = function() {
        var actor = this._actor;
        this.contents.clear();
        var padding = this.standardPadding();
        var lineHeight = this.lineHeight();
        
        // 顔描いたりステータス文字描画したりする。
        // |        | Name    Class             |
        // |        | Lv      NickName          |
        // |        | StatusIcon                |
        // |  Face  | HP      GP     (再成長x回) |
        // |        | MP      EXP               |
        // |        | TP      NEXT              |
        var x = padding;
        var y = padding;
        //var faceOffsetY = (this.contentsHeight() - Window_Base._faceHeight) / 2;
        var faceOffsetY = 40;
        this.drawActorFace(actor, x, y + faceOffsetY, Window_Base._faceWidth, Window_Base.faceHeight);
        var x1 = x + Window_Base._faceWidth + padding;
        var nameWidth = 240;
        this.drawActorName(actor, x1, y, nameWidth);
        this.drawActorLevel(actor, x1, y + lineHeight);
        var iconWidth = x + this.contentsWidth() - x1;
        this.drawActorIcons(actor, x1, y + lineHeight * 2, iconWidth);
        this.drawActorHp(actor, x1, y + lineHeight * 3, nameWidth);
        this.drawActorMp(actor, x1, y + lineHeight * 4, nameWidth);
        this.drawActorTp(actor, x1, y + lineHeight * 5, nameWidth);

        var x2 = x1 + nameWidth + padding;
        this.drawActorClass(actor, x2, y, nameWidth);
        this.drawActorNickname(actor, x2, y + lineHeight, expWidth);
        this.drawActorGrowPoint(actor, x2, y + lineHeight *3, 120);
        var rcnt = actor.getReincarnationCount();
        if (rcnt > 0) {
            var rcountText = "(再成長" + rcnt + "回)";
            this.changeTextColor(this.systemColor());
            this.drawText(rcountText, x2 + 120, y + lineHeight * 3, 120, 'left');
        }

        this.changeTextColor(this.systemColor());
        var expLabel = TextManager.expTotal.format(TextManager.exp);
        var nextLabel = TextManager.expNext.format(TextManager.level);
        this.drawText(expLabel, x2, y + lineHeight * 4);
        this.drawText(nextLabel, x2, y + lineHeight * 5);
        this.resetTextColor();

        var x3 = x2 + nameWidth + padding;
        var expWidth = Math.min(x + this.contentsWidth() - x3, 160);

        var expText = actor.currentExp();
        var nextText = actor.nextRequiredExp();
        if (actor.isMaxLevel()) {
            expText = '------';
            nextText = '-------';
        }
        this.drawText(expText, x2 + 120, y + lineHeight * 4, expWidth, 'right');
        this.drawText(nextText, x2 + 120, y + lineHeight * 5, expWidth, 'right');

        // ギルドランク
        if (Imported.TWLD_Quest)
        {
            var x3 = this.contentsWidth() - 240;
            this.changeTextColor(this.systemColor());
            this.drawText("ギルドランク:", x3, y, 180, 'right');
            this.resetTextColor();
            this.drawText(actor.guildRankName(), x3 + 180, y, 60);
        }
    };

    //-----------------------------------------------------------------------------
    // Window_StatusCategory
    //

    /**
     * ステータスのカテゴリ選択を行う。
     */
    function Window_StatusCategory() {
        this.initialize.apply(this, arguments);
    }

    Window_StatusCategory.prototype = Object.create(Window_Command.prototype);
    Window_StatusCategory.prototype.constructor = Window_StatusCategory;

    /**
     * Window_StatusCategoryを初期化する。
     */
    Window_StatusCategory.prototype.initialize = function(x, y) {
        Window_Command.prototype.initialize.call(this, x, y);
    };

    /**
     * ウィンドウ幅を取得する。
     * @return {Number} ウィンドウ幅
     */
    Window_StatusCategory.prototype.windowWidth = function() {
        return 240;
    };

    /**
     * ウィンドウのカラム数を取得する。
     * @return {Number} カラム数
     */
    Window_StatusCategory.prototype.maxCols = function() {
        return 1;
    };

    /**
     * ウィンドウの表示行数を取得する。
     * @return {Number} 表示行数
     */
    Window_StatusCategory.prototype.numVisibleRows = function() {
        return 4;
    };
    /**
     * ウィンドウの高さを取得する。
     * @return {Number} ウィンドウの高さ
     */
    Window_StatusCategory.prototype.windowHeight = function() {
        return 300;
    };

    /**
     * コマンドリストを作成する。
     */
    Window_StatusCategory.prototype.makeCommandList = function() {
        this.addCommand(TextManager.status, 'status');
        this.addCommand(TextManager.equip, 'equip');
        this.addCommand(TextManager.skill, 'skill');
        this.addCommand("プロフィール", 'profile');
    };

    //------------------------------------------------------------------------------
    // Window_StatusParam
    // 
    /**
     * Window_StatusParam
     * パラメータ情報表示
     */
    function Window_StatusParam() {
        this.initialize.apply(this, arguments);
    }

    Window_StatusParam.prototype = Object.create(Window_Base.prototype);
    Window_StatusParam.prototype.constructor = Window_StatusParam;

    /**
     * 新しいWindow_StatusParamを構築する。
     */
    Window_StatusParam.initialize = function(x, y, width, height) {
        this._actor = null;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };
    /**
     * アクターを設定する。
     * @param {Game_Actor} actor アクター
     */
    Window_StatusParam.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    /**
     * 表示を更新する。
     */
    Window_StatusParam.prototype.refresh = function() {
        var actor = this._actor;
        this.contents.clear();
        
        // 基本パラメータ                           熟練度 
        // STR   12(+2)   ATK    128 (+78)  HIT     (Icon)LvX ゲージ
        // DEX    7       DEF     43 (+22)  CRI     (Icon)LvX ゲージ
        // VIT    6       PDR     0%        CDR      :
        // INT    5(+1)                     
        // MEN    8(+2)   MATK    15        
        // AGI    9       MDEF    24        
        // LUK    7       MDR   -20%
        this.drawBasicParameters(actor);
        this.drawWeponMasteries(actor);
    };

    /**
     * 基本パラメータを描画する
     */
    Window_StatusParam.prototype.drawBasicParameters = function(actor) {
        var padding = this.standardPadding();
        var lineHeight = this.lineHeight();
        var x = padding;
        var y = padding;
        this.changeTextColor(this.systemColor());
        this.drawText("ステータス", x, y, 320);

        var basicParamList = [
            { name:'STR', current:actor.str, base:actor.getBasicParamBase(0) },
            { name:'DEX', current:actor.dex, base:actor.getBasicParamBase(1) },
            { name:'VIT', current:actor.vit, base:actor.getBasicParamBase(2) },
            { name:'INT', current:actor.int, base:actor.getBasicParamBase(3) },
            { name:'MEN', current:actor.men, base:actor.getBasicParamBase(4) },
            { name:'AGI', current:actor.agi, base:actor.getBasicParamBase(5) },
            { name:'LUK', current:actor.getLuk(), base:actor.getLuk() }
        ];
        var y1 = y + lineHeight;
        for (var i = 0; i < basicParamList.length; i++) {
            var bp = basicParamList[i];
            var appendVal = bp.current - bp.base;
            this.drawBasicParameter(bp.name, bp.current, appendVal, x, y1 + lineHeight * i);
        }

        var x2 = x + 220;
        var atk = actor.param(2);
        var baseAtk = actor.paramBase(2);
        this.drawBasicParameter('ATK', atk, atk - baseAtk, x2, y1 + lineHeight * 0);
        this.drawRate('PPR', actor.ppr, x2, y1 + lineHeight * 1);
        var def = actor.param(3);
        var baseDef = actor.paramBase(3);
        this.drawBasicParameter('DEF', def, def - baseDef, x2, y1 + lineHeight * 2);
        this.drawRate('PDRR', 1 - actor.pdr, x2, y1 + lineHeight * 3);

        var matk = actor.param(4);
        var baseMatk = actor.paramBase(4);
        this.drawBasicParameter('MATK', matk, matk - baseMatk, x2, y1 + lineHeight * 5);
        this.drawRate('MPR', actor.mpr, x2, y1 + lineHeight * 6);
        var mdef = actor.param(5);
        var baseMdef = actor.paramBase(5);
        this.drawBasicParameter('MDEF', mdef, mdef - baseMdef, x2, y1 + lineHeight * 7);
        this.drawRate('MDRR', 1 - actor.mdr, x2, y1 + lineHeight * 8);

        var x3 = x2 + 220;
        var rParamList = [
            { name:'HIT', rate:actor.hit },
            { name:'EVA', rate:actor.eva },
            { name:'MEVA', rate:actor.mev },
            { name:'CRI', rate:actor.cri }, 
            { name:'CRR', rate:actor.pcr - TWLD.Core.BasicCriticalRate }, // 標準倍率は1.5なので差分を引く。
            { name:'MCRR', rate:actor.mcrr - TWLD.Core.BasicCriticalRate }, // 標準倍率は1.5なので差分を引く。
        ];
        for (var l = 0; l < rParamList.length; l++) {
            var rp = rParamList[l];
            this.drawRate(rp.name, rp.rate, x3, y1 + lineHeight * l);
        }
    }

    /**
     * ウェポンマスタリー欄を描画する。
     */
    Window_StatusParam.prototype.drawWeponMasteries = function(actor) {
        var padding = this.standardPadding();
        var lineHeight = this.lineHeight();
        var x = padding + 680;
        var y = padding;

        // マスタリーの表示(こりゃ面倒だ)
        var wms = actor.getWeaponMasteries();
        this.changeTextColor(this.systemColor());
        this.drawText("ウェポンマスタリー", x, y, 320);
        var xpos = x;
        var ypos = y + lineHeight;
        for (var i = 0; i < wms.length; i++) {
            // ウェポンマスタリーを描画
            var wm = wms[i];
            this.drawWeaponMastery(wm, xpos, ypos);
            ypos += lineHeight;
            if ((ypos + lineHeight) > (this.height - padding)) {
                ypos = y + lineHeight;
                xpos += 220;
            }
        }
    };




    //------------------------------------------------------------------------------
    // Window_StatusEquip
    // 
    /**
     * Window_StatusEquip
     * 装備表示
     */
    function Window_StatusEquip() {
        this.initialize.apply(this, arguments);
    }

    Window_StatusEquip.prototype = Object.create(Window_Base.prototype);
    Window_StatusEquip.prototype.constructor = Window_StatusEquip;

    /**
     * 新しいWindow_StatusEquipを構築する。
     */
    Window_StatusEquip.initialize = function(x, y, width, height) {
        this._actor = null;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };
    /**
     * アクターを設定する。
     * @param {Game_Actor} actor アクター
     */
    Window_StatusEquip.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    };

    /**
     * 表示を更新する。
     */
    Window_StatusEquip.prototype.refresh = function() {
        var actor = this._actor;
        var padding = this.standardPadding();
        var lineHight = this.lineHeight();
        this.contents.clear();
        
        // 装備一覧を描画する。
        var equipSlots = actor.equipSlots();
        var equips = actor.equips();
        var x = padding;
        var y = padding;
        for (var i = 0; i < equipSlots.length; i++) {
            var slotName = $dataSystem.equipTypes[equipSlots[i]];
            this.drawEquipItem(slotName, equips[i], x, y + lineHight * i);
        }
    };

    /**
     * 装備品情報を描画する。
     * @param {String} slotName
     * @param {Game_item} equipItem 装備品(未装備の場合にはnull)
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     */
    Window_StatusEquip.prototype.drawEquipItem = function(slotName, equipItem, x, y) {
        // スロット名
        this.changeTextColor(this.systemColor());
        this.drawText(slotName, x, y, 120);
        this.drawText(':', x + 120, y, 16);

        // 装備品アイコン
        if (equipItem && (equipItem.iconIndex >= 0)) {
            var x2 = x + 140;
            if (equipItem.iconIndex >= 0) {
                this.drawIcon(equipItem.iconIndex, x2 + 2, y + 2);
            }
        }

        // 装備品名称
        var x3 = x + 180;
        if (equipItem) {
            this.changeTextColor(this.itemNameColor(equipItem));
            this.drawText(equipItem.name, x3, y, 320, 'left');
        } else {
            this.resetTextColor();
            this.drawText('(なし)', x3, y, 320, 'left');
        }

        // 装備品の情報テキトーに。
        if (equipItem) {
            // 装備効果を列挙する。
            // 差分でいいのかなあ。
            var paramNameTable = ['HP', 'MP', 'ATK', 'DEF', 'MAT', 'MDEF'];
            var upgradeText = '';
            for (var i = 0; i < 6; i++) {
                var pup = equipItem.params[i] - equipItem.initialParams[i];
                if (pup > 0) {
                    upgradeText += paramNameTable[i] + '+' + pup + ' ';
                } else if (pup < 0) {
                    upgradeText += paramNameTable[i] + '' + pup + ' ';
                }
            }
            var bParamNameTable = ['STR', 'DEX', 'VIT', 'INT', 'MEN', 'AGI'];
            for (var j = 0; j < 6; j++) {
                var bpup = equipItem.basicParams[j] - equipItem.initialBasicParams[j];
                if (bpup > 0) {
                    upgradeText += bParamNameTable[j] + '+' + pup + ' ';
                } else if (bpup < 0) {
                    upgradeText += bParamNameTable[j] + '' + pup + ' ';
                }
            }
            if (upgradeText.length > 0) {
                this.changeTextColor(this.itemNameColor(equipItem));
                var x4 = x3 + 330;
                var textWidth = x + this.contentsWidth() - x4;
                this.drawText(upgradeText, x4, y, textWidth, 'left');
            }
        }
    };

    //------------------------------------------------------------------------------
    // Window_StatusSkillType
    // 

    /**
     * スキルタイプ選択画面
     */
    function Window_StatusSkillType() {
        this.initialize.apply(this, arguments);
    }
    
    Window_StatusSkillType.prototype = Object.create(Window_Command.prototype);
    Window_StatusSkillType.prototype.constructor = Window_StatusSkillType;

    /**
     * Window_StatusSkillTypeを初期化する。
     * @param {Number} x ウィンドウx位置
     * @param {Number} y ウィンドウy位置
     * @param {Number} width ウィンドウ幅
     * @param {Number} height ウィンドウ高さ
     */
    Window_StatusSkillType.prototype.initialize = function(x, y, width, height) {
        this._windowWidth = width;
        this._windowHeight = height;
        Window_Command.prototype.initialize.call(this, x, y);
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
     * ウィンドウ幅
     */
    Window_StatusSkillType.prototype.windowWidth = function() {
        return this._windowWidth;
    };

    /**
     * なにやってんだか意味分かんねーけど、Window_Commandのコンストラクタから
     * こいつが呼ばれて高さが設定される。
     * つまり、コンストラクタでheight渡す意味ねー。
     * @return {Number} ウィンドウの幅を返す。
     */
    Window_StatusSkillType.prototype.windowHeight = function() {
        return this._windowHeight;
    };
    /**
     * 有効な行数を取得する。
     */
    // Window_StatusSkillType.prototype.numVisibleRows = function() {
    //     return 4;
    // };
    
    /**
     * コマンドリストを構築する。
     */
    Window_StatusSkillType.prototype.makeCommandList = function() {
        if (this._actor) {
            var skillTypes = this._actor.addedSkillTypes();
            skillTypes.sort(function(a, b) {
                return a - b;
            });
            skillTypes.forEach(function(stypeId) {
                if (stypeId > 0) {
                    var name = $dataSystem.skillTypes[stypeId];
                    this.addCommand(name, 'skill', true, stypeId);
                }
            }, this);
            
            // 更にパッシブスキルを追加
            if (this._actor.hasPassiveSkill()) {
                this.addCommand("パッシブ", 'passive', true, 0);
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

    //-----------------------------------------------------------------------------
    // Window_StatusSkillList
    //

    /**
     * 選択されている種類のSkill一覧を表示する。
     * type=0はパッシブを表示する。
     */
    function Window_StatusSkillList() {
        this.initialize.apply(this, arguments);
    }

    Window_StatusSkillList.prototype = Object.create(Window_Selectable.prototype);
    Window_StatusSkillList.prototype.constructor = Window_StatusSkillList;

    /**
     * Window_StatusSkillListを初期化する。
     */
    Window_StatusSkillList.prototype.initialize = function(x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
        this._stypeId = 0;
        this._data = [];
        this._pendingIndex = -1;
    };

    /**
     * ペンディングインデックスを設定する。
     * @param {Number} index ペンディングインデックス
     */
    Window_StatusSkillList.prototype.setPendingIndex = function(index) {
        if (this._pendingIndex !== index) {
            this._pendingIndex = index;
            this.refresh();
        }
    };

    /**
     * ペンディングインデックスを取得する。
     */
    Window_StatusSkillList.prototype.getPendingIndex = function() {
        return this._pendingIndex;
    };


    /**
     * indexに対応する項目を取得する。
     * @param {Number} index インデックス
     * @return {Game_Skill} スキル
     */
    Window_StatusSkillList.prototype.getItem = function(index) {
        if (this._data) {
            if ((index >= 0) && (index < this._data.length)) {
                return this._data[index];
            }

        }
        return null;
    };

    /**
     * アクターを設定する。
     */
    Window_StatusSkillList.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this._pendingIndex = -1;
            this.refresh();
            this.resetScroll();
        }
    };

    /**
     * 表示するスキルタイプを設定する。
     */
    Window_StatusSkillList.prototype.setStypeId = function(stypeId) {
        if (this._stypeId !== stypeId) {
            this._stypeId = stypeId;
            this.refresh();
            this.resetScroll();
        }
    };

    /**
     * 最大カラム数
     */
    Window_StatusSkillList.prototype.maxCols = function() {
        return 2;
    };

    /**
     * スキル間のスペース
     */
    Window_StatusSkillList.prototype.spacing = function() {
        return 48;
    };

    /**
     * 最大アイテム数を取得する。
     * @return {Number} 最大アイテム数
     */
    Window_StatusSkillList.prototype.maxItems = function() {
        return this._data ? this._data.length : 1;
    };

    /**
     * 選択されている項目を取得する。
     * @return {Data_Item} スキル
     */
    Window_StatusSkillList.prototype.item = function() {
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    };

    /**
     * 現在選択中の項目が有効かどうかを取得する。
     * @return {Boolean} 有効な場合にはtrue, それ以外はfalse
     */
    Window_StatusSkillList.prototype.isCurrentItemEnabled = function() {
        return true;
    };

    /**
     * 項目一覧を作成する。
     */
    Window_StatusSkillList.prototype.makeItemList = function() {
        if (this._actor) {
            var stypeId = this._stypeId;
            if (stypeId >= 0) {
                this._data = this._actor.skillsWithOrder().filter(function(item) {
                    return item && (item.stypeId == stypeId);
                });
            }
        }
    };

    /**
     * 最後に選択されていた項目を再選択する。
     */
    Window_StatusSkillList.prototype.selectLast = function() {
        this.select(0);
    };

    /**
     * 項目を描画する。
     */
    Window_StatusSkillList.prototype.drawItem = function(index) {
        var rect = this.itemRect(index);
        if (index == this._pendingIndex) {
            // 並び替え用の項目は背景色を設定
            var color = this.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
        var skill = this._data[index];
        if (skill) {
            this.drawItemName(skill, rect.x, rect.y, rect.width);
        }
    };

    /**
     * ヘルプウィンドウに説明用項目を設定する。
     */
    Window_StatusSkillList.prototype.updateHelp = function() {
        this.setHelpWindowItem(this.item());
    };

    /**
     * 表示を更新する。
     */
    Window_StatusSkillList.prototype.refresh = function() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    //------------------------------------------------------------------------------
    // Window_StatusProfile
    // 
    /**
     * Window_StatusProfile
     * パラメータ情報表示
     */
    function Window_StatusProfile() {
        this.initialize.apply(this, arguments);
    }

    Window_StatusProfile.prototype = Object.create(Window_Base.prototype);
    Window_StatusProfile.prototype.constructor = Window_StatusProfile;

    /**
     * 新しいWindow_StatusProfileを構築する。
     */
    Window_StatusProfile.initialize = function(x, y, width, height) {
        this._actor = null;
        this._imageReservationId = Utils.generateRuntimeId();
        this._profileBitmap = null;
        this._textEnable = true;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };
    /**
     * アクターを設定する。
     * @param {Game_Actor} actor アクター
     */
    Window_StatusProfile.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this._textEnable = true;
            this.refresh();
        }
    };

    /**
     * テキスト描画をするかどうかを設定する。
     * @param {Boolean} enabled 描画する場合にはtrue, それ以外はfalse
     */
    Window_StatusProfile.prototype.setTextEnable = function(enabled) {
        this._textEnable = enabled;
    };

    /**
     * テキスト描画を行うかどうか
     * @return {Boolean} テキストを描画する場合にはtrue,それ以外はfalse
     */
    Window_StatusProfile.prototype.isTextEnable = function() {
        return this._textEnable;
    };




    /**
     * プロフィール画面を更新する。
     * refresh()でやればよさそうだが、Bitmapのロードが遅延するのか、上手くレンダリングされなかった。
     */
    Window_StatusProfile.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        var actor = this._actor;
        this.contents.clear();
        var padding = this.standardPadding();

        // もし立ち絵が組み込まれているならば、
        // 読み出して設定する。
        if (this._profileBitmap) {
            this.drawProfileImage(this._profileBitmap);
        }
        
        // プロフィール文字列を描画する。
        if ((this._profileBitmap === null) || this._textEnable) {
            // プロフィール用画像が無いか、テキスト描画が有効な場合、
            var x = padding;
            var y = padding;
            this.drawTextEx(actor.profile(), x, y);
        }
    };

    /**
     * 表示を更新する。
     */
    Window_StatusProfile.prototype.refresh = function() {
        var actor = this._actor;
        // もし立ち絵が組み込まれているならば、
        // 読み出して設定する。
        var profilePictureName = actor.getProfilePictureName();
        if (profilePictureName !== null) {
            try {
                // イメージをロードする。
                this._profileBitmap = ImageManager.reservePicture(
                        profilePictureName, this._imageReservationId);
            }
            catch (e) {
                console.log(e);
                this._profileBitmap = null;
            }
        } else {
            this._profileBitmap = null;
        }

        this.update();
    };

    /**
     * プロフィール画像を描画する。
     * @param {Bitmap} bitmap プロフィール用画像
     */
    Window_StatusProfile.prototype.drawProfileImage = function(bitmap) {
        this.changePaintOpacity(!this._textEnable);
        var sx = 0;
        var sy = 0;
        var padding = this.standardPadding();
        var sw = Math.min(this.contentsWidth(), bitmap.width);
        var sh = Math.min(this.contentsHeight(), bitmap.height);
        var dx = padding;
        var dy = padding;
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
        this.changePaintOpacity(true);
    };

    /**
     * 予約リソースを開放する。
     */
    Window_StatusProfile.prototype.releaseReservation = function() {
        ImageManager.releaseReservation(this._imageReservationId);
    };


    //------------------------------------------------------------------------------
    // Scene_Statusの変更
    //
    
    /**
     * シーンを作成する。
     */
    Scene_Status.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createStatusCategoryWindow();
        this.createStatusActorWindow();
        this.createStatusParamWindow();
        this.createStatusEquipWindow();
        this.createStatusSkillWindow();
        this.createStatusProfileWindow();
    };
    /**
     * ステータス種類ウィンドウを作成する。
     */
    Scene_Status.prototype.createStatusCategoryWindow = function() {
        this._categoryWindow = new Window_StatusCategory(0, 0);
        this._categoryWindow.setHandler('itemchange', this.onStatusCategoryWindowItemChange.bind(this));
        this._categoryWindow.setHandler('ok', this.onStatusCategoryWindowOk.bind(this));
        this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
        this._categoryWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._categoryWindow.setHandler('pageup', this.previousActor.bind(this));
        
        this.addWindow(this._categoryWindow);
    };

    /**
     * アクター情報ウィンドウを作成する。
     */
    Scene_Status.prototype.createStatusActorWindow = function() {
        var x = this._categoryWindow.width;
        var y = 0;
        var width = Graphics.boxWidth - x;
        var height = 300;
        this._actorWindow = new Window_StatusActor(x, y, width, height);
        this.addWindow(this._actorWindow);
    };

    /**
     * アクターパラメータ表示ウィンドウを作成する。
     */
    Scene_Status.prototype.createStatusParamWindow = function() {
        var x = 0;
        var y = Math.max(this._categoryWindow.height, this._actorWindow.height);
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight - y;
        this._paramWindow = new Window_StatusParam(x, y, width, height);
        this._paramWindow.hide();
        this.addWindow(this._paramWindow);
    };

    /**
     * アクター装備一覧表示ウィンドウを作成する。
     */
    Scene_Status.prototype.createStatusEquipWindow = function() {
        var x = 0;
        var y = Math.max(this._categoryWindow.height, this._actorWindow.height);
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight - y;
        this._equipWindow = new Window_StatusEquip(x, y, width, height);
        this._equipWindow.hide();
        this.addWindow(this._equipWindow);
    };

    /**
     * スキルウィンドウを作成する。 
     */
    Scene_Status.prototype.createStatusSkillWindow = function() {
        var x = 0;
        var y = Math.max(this._categoryWindow.height, this._actorWindow.height);
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight - y;

        var yHelp = Graphics.boxHeight - 140;
        this._skillHelpWindow = new Window_Help(3, x, yHelp, width, 140);
        this._skillHelpWindow.hide();
        this.addWindow(this._skillHelpWindow);

        var selHeight = height - 140;
        this._skillTypeWindow = new Window_StatusSkillType(x, y, 240, selHeight);
        this._skillTypeWindow.setHandler('ok', this.onSkillTypeWindowOk.bind(this));
        this._skillTypeWindow.setHandler('cancel', this.onSkillTypeWindowCancel.bind(this));
        this._skillTypeWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._skillTypeWindow.setHandler('pageup', this.previousActor.bind(this));
        this._skillTypeWindow.deactivate();
        this._skillTypeWindow.hide();
        this.addWindow(this._skillTypeWindow);

        this._skillListWindow = new Window_StatusSkillList(x + 240, y, width - 240, selHeight);
        this._skillListWindow.setHandler('ok', this.onSkillListWindowOk.bind(this));
        this._skillListWindow.setHandler('cancel', this.onSkillListWindowCancel.bind(this));
        this._skillListWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._skillListWindow.setHandler('pageup', this.previousActor.bind(this));
        this._skillListWindow.deactivate();
        this._skillListWindow.hide();
        this.addWindow(this._skillListWindow);

        this._skillTypeWindow.setSkillWindow(this._skillListWindow);
        this._skillListWindow.setHelpWindow(this._skillHelpWindow);
    };

    /**
     * スキルタイプ選択画面で、OKボタンが押された時に通知を受け取る。
     */
    Scene_Status.prototype.onSkillTypeWindowOk = function() {
        this._skillListWindow.activate();
        this._skillListWindow.select(0);
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
        var index = this._skillListWindow.index();
        var pendingIndex = this._skillListWindow.getPendingIndex();
        if (pendingIndex === -1) {
            // 現在のインデックスをペンディングインデックスに設定する。
            this._skillListWindow.setPendingIndex(index);
        } else {
            this._skillListWindow.setPendingIndex(-1);
            if (index !== pendingIndex) {
                // スキルを入れ替える。
                var srcSkill = this._skillListWindow.getItem(pendingIndex);
                var dstSkill = this._skillListWindow.getItem(index);
                if ((srcSkill !== null) && (dstSkill !== null)) {
                    this.actor().swapSkillOrder(srcSkill.id, dstSkill.id);
                    this._skillListWindow.refresh();
                }
            }
        }
        // スキルリスト画面を引き続きアクティブ状態にする。
        this._skillListWindow.activate();
    };

    /**
     * スキルリスト画面でキャンセルボタンが押された時に通知を受け取る。
     */
    Scene_Status.prototype.onSkillListWindowCancel = function() {
        this._skillListWindow.setPendingIndex(-1);
        this._skillHelpWindow.clear();
        this._skillTypeWindow.activate();
    };


    /**
     * アクタープロフィールウィンドウを作成する。
     */
    Scene_Status.prototype.createStatusProfileWindow = function() {
        var x = 0;
        var y = Math.max(this._categoryWindow.height, this._actorWindow.height);
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight - y;
        this._profileWindow = new Window_StatusProfile(x, y, width, height);
        this._profileWindow.hide();
        this.addWindow(this._profileWindow);
    };



    /**
     * ステータス種類ウィンドウで更新要求があったときに通知を受け取る。
     */
    Scene_Status.prototype.onStatusCategoryWindowItemChange = function() {
        // 表示するステータス画面の切り替え。
        this.hideDetailWindows();
        switch (this._categoryWindow.currentSymbol()) {
            case 'status':
                this._paramWindow.show();
                break;
            case 'equip':
                this._equipWindow.show();
                break;
            case 'profile':
                this._profileWindow.show();
                break;
            case 'skill':
                this._skillTypeWindow.show();
                this._skillListWindow.show();
                this._skillHelpWindow.show();
                break;
        }
    };

    /**
     * 詳細ウィンドウを全て隠す
     */
    Scene_Status.prototype.hideDetailWindows = function() {
        this._paramWindow.hide();
        this._equipWindow.hide();
        this._skillTypeWindow.hide();
        this._skillListWindow.hide();
        this._skillHelpWindow.hide();
        this._profileWindow.hide();
    };

    /**
     * ステータス種類ウィンドウでOK操作がされたときに通知を受け取る。
     */
    Scene_Status.prototype.onStatusCategoryWindowOk = function() {
        switch (this._categoryWindow.currentSymbol()) {
            case 'skill':
                this._skillTypeWindow.activate();
                break;
            case 'equip':
                // 装備画面でOKが押されたら、装備シーンに移る
                SceneManager.push(Scene_Equip);
                break;
            case 'profile':
                this._profileWindow.setTextEnable(!this._profileWindow.isTextEnable());
                this._categoryWindow.activate();
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
        this._actorWindow.show();
        this._categoryWindow.select(0);
        this._categoryWindow.show();
        this._categoryWindow.activate();
        this._paramWindow.show();

        this.refreshActor();
    };

    Scene_Status.prototype.terminate = function() {
        Scene_MenuBase.prototype.terminate.call(this);
        this._profileWindow.releaseReservation();
    };
    /**
     * 表示するアクターの情報を更新する。
     */
    Scene_Status.prototype.refreshActor = function() {
        var actor = this.actor();
        this._actorWindow.setActor(actor);
        this._paramWindow.setActor(actor);
        this._equipWindow.setActor(actor);
        this._skillTypeWindow.setActor(actor);
        this._skillListWindow.setActor(actor);
        this._skillHelpWindow.setActor(actor);
        this._profileWindow.setActor(actor);
        if (this._skillListWindow.active) {
            this._skillListWindow.deactivate();
        }
        if (this._skillTypeWindow.active) {
            this._skillTypeWIndow.deactivate();
        }
        this._categoryWindow.activate();
    };

    /**
     * アクターが変更されたときの処理をおこなう。
     * _statusWindowにアクセスしないようにするため、オーバーライドする。
     */
    Scene_Status.prototype.onActorChange = function() {
        this.refreshActor();
        this._categoryWindow.activate();
    };


})();