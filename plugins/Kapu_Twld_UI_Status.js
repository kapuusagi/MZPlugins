/*:ja
 * @target MZ 
 * @plugindesc TWLD向けステータス画面UIプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Base_Twld
 * @orderAfter Kapu_Base_Twld
 * @orderAfter Kapu_UserSkillOrder
 * 
 * @param enableProfile
 * @text プロフィールを専用画面にする
 * @desc trueにすると、プロフィールを専用ウィンドウで提供する。
 * @type boolean
 * @default false
 * 
 * @param textPassiveSkill
 * @text パッシブスキルラベル
 * @desc 「パッシブスキル」として使用するラベル。
 * @type string
 * @default パッシブスキル
 * 
 * @param textStatus1
 * @text ステータスウィンドウ1ラベル
 * @desc 「基本ステータス表示1」として使用するラベル
 * @type string
 * @default ページ1
 * 
 * @param textStatus2
 * @text ステータスウィンドウ2ラベル
 * @desc 「基本ステータス表示2」として使用するラベル
 * @desc string
 * @default ページ2
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
 * @help 
 * TWLD向けステータス画面UIプラグイン。
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
/**
 * Window_StatusCategory
 * ステータスのカテゴリ選択を提供するウィンドウ
 */
function Window_StatusCategory() {
    this.initialize(...arguments);
}
/**
 * Window_StatusActor.
 * ステータス画面でアクター情報を表示する。
 */
// function Window_StatusActor() {
//     this.initialize(...arguments);
// }

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
            ? false : (parameters["enableProfile"] == "true");
    const textPassiveSkill = parameters["textPassiveSkill"] || "PassiveSkill";
    const textStatus1 = parameters["textStatus1"] || "Page.1";
    const textStatus2 = parameters["textStatus2"] || "Page.2";
    const textStatus3 = parameters["textStatus3"] || "Page.3";
    const textProfile = parameters["textProfile"] || "Profile";
    const statusPictureMethod = String(parameters["statusPictureMethod"]) || "";
    const commandWindowWidth = Number(parameters["commandWindowWidth"]) || 240;

    
    // MVではステータス表示（一部）/スキル表示/装備表示/プロフィール表示だけであった。
    // これでいいのか？
    // 属性耐性は表示したい。1280x720レイアウトを考えると、左側or右側に表示内容選択させる方式がいいなあ。
    // レイアウトを先に決めないと作れない。

    // ベーシックシステムでは
    //   プロフィールウィンドウ (_statusProfileWindow : Window_Help)
    //       2行のプロフィールを表示するウィンドウ。
    //   ステータスウィンドウ (_statusWindow : Window_Status)
    //       顔グラフィックを始め、いくつかの項目を表示するウィンドウ。
    //   パラメータウィンドウ (_statusParamsWindow : Window_StatusParams)
    //       ATKやらなにやらのパラメータ詳細を表示するウィンドウ
    //   ステータス装備ウィンドウ (_statusEquipWindow : Window_StatusEquip)
    //       装備表示ウィンドウ
    // の4つが構築されていた。


    //
    // ・左側にステータスカテゴリ選択ウィンドウ。(ステータス1/ステータス2/装備/スキル/プロフィール)
    //   スキル選択時はスキルタイプ選択ウィンドウをオーバーラップさせる。
    //   スキル一覧は並び替えができるようにする。
    //   操作 up/down:項目切替、 ok:決定 cancel:シーン終了 pageDown:前のアクター, pageUp:次のアクター
    //   
    //  ステータス1とステータス2は切替式にする。
    //     (決定押下毎に切替する。ウィンドウ上に表示内容記載)
    //
    // ・ステータス1
    //   HP/MPやATK/DEF, STR/DEXなどの基本ステータス表示。
    //   HIT等の一部パラメータも表示できれば全部やりたいなあ。-> 表示項目を一覧にする。
    //     顔グラフィック
    //     Lv/クラス名/通り名/GP
    //     HP/MaxHP/Mp/MaxMP/MaxTP
    //     STR/DEX/VIT/INT/MEN/AGI/LUK (LUKはニコニコマークとかにしたい)
    //     ATK/DEF/DEF.Rate/MAT/MDF/MDF.Rate
    //     HIT/EVA/MEV/CRI/CEV/CDR/
    //     PEN/PDR/
    //     いっぱいあるけど全部はいらない。
    // ・ステータス2
    //     属性レート
    //     MRF/CNT/HRG/MRG/TRG/TGR/GRD/REC/PHA (0以外なら表示)
    //     ドロップレート/取得ゴールドレート/EXPレート
    // ・装備
    //     装備一覧表示
    //     ウェポンマスタリ
    // ・スキル
    //     並び替えサポート
    // コマンドウィンドウを持たせて選択させる。
    // 背景にSpriteを用意。

    //-----------------------------------------------------------------------------
    // Window_StatusCategory
    //

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
     * コマンドリストを作成する。
     */
    Window_StatusCategory.prototype.makeCommandList = function() {
        this.addCommand(textStatus1, "status1");
        this.addCommand(textStatus2, "status2");
        this.addCommand(textStatus3, "status3");
        this.addCommand(TextManager.skill, "skill");
        if (enableProfile) {
            this.addCommand(textProfile, "profile");
        }
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
    // Window_StatusActor
    //
    // Window_StatusActor.prototype = Object.create(Window_Base.prototype);
    // Window_StatusActor.prototype.constuctor = Window_StatusActor;

    // /**
    //  * Window_StatusActorを初期化する。
    //  */
    // Window_StatusActor.prototype.initialize = function(rect) {
    //     Window_Base.prototype.initialize.call(this, rect);
    //     this._actor = null;
    // };

    // /**
    //  * アクターを設定する。
    //  * @param {Game_Actor} actor アクター
    //  */
    // Window_StatusActor.prototype.setActor = function(actor) {
    //     if (this._actor !== actor) {
    //         this._actor = actor;
    //         this.refresh();
    //     }
    // };

    // /**
    //  * 表示を更新する。
    //  */
    // Window_StatusActor.prototype.refresh = function() {
    //     this.contents.clear();
        // const actor = this._actor;
        // const padding = this.itemPadding();
        // const lineHeight = this.lineHeight();
        // const x = 0;
        // const y = 0;
        // const faceOffsetY = 40;
        // this.drawFace(actor.faceName(), actor.faceIndex(),
        //         x, y + faceOffsetY, Window_Base._faceWidth, Window_Base.faceHeight);
        // const x1 = x + Window_Base._faceWidth + padding;
        // const nameWidth = 240;
        // this.drawText(actor, x1, y, nameWidth);
        // this.drawActorLevel(actor, x1, y + lineHeight);
        // var iconWidth = x + this.contentsWidth() - x1;
        // this.drawActorIcons(actor, x1, y + lineHeight * 2, iconWidth);
        // this.drawActorHp(actor, x1, y + lineHeight * 3, nameWidth);
        // this.drawActorMp(actor, x1, y + lineHeight * 4, nameWidth);
        // this.drawActorTp(actor, x1, y + lineHeight * 5, nameWidth);

        // var x2 = x1 + nameWidth + padding;
        // this.drawActorClass(actor, x2, y, nameWidth);
        // this.drawActorNickname(actor, x2, y + lineHeight, expWidth);
        // this.drawActorGrowPoint(actor, x2, y + lineHeight *3, 120);
        // var rcnt = actor.getReincarnationCount();
        // if (rcnt > 0) {
        //     var rcountText = "(再成長" + rcnt + "回)";
        //     this.changeTextColor(this.systemColor());
        //     this.drawText(rcountText, x2 + 120, y + lineHeight * 3, 120, "left");
        // }

        // this.changeTextColor(this.systemColor());
        // var expLabel = TextManager.expTotal.format(TextManager.exp);
        // var nextLabel = TextManager.expNext.format(TextManager.level);
        // this.drawText(expLabel, x2, y + lineHeight * 4);
        // this.drawText(nextLabel, x2, y + lineHeight * 5);
        // this.resetTextColor();

        // var x3 = x2 + nameWidth + padding;
        // var expWidth = Math.min(x + this.contentsWidth() - x3, 160);

        // var expText = actor.currentExp();
        // var nextText = actor.nextRequiredExp();
        // if (actor.isMaxLevel()) {
        //     expText = "------";
        //     nextText = "-------";
        // }
        // this.drawText(expText, x2 + 120, y + lineHeight * 4, expWidth, "right");
        // this.drawText(nextText, x2 + 120, y + lineHeight * 5, expWidth, "right");

        // // ギルドランク
        // var x3 = this.contentsWidth() - 240;
        // this.changeTextColor(this.systemColor());
        // this.drawText("ギルドランク:", x3, y, 180, "right");
        // this.resetTextColor();
        // this.drawText(actor.guildRankName(), x3 + 180, y, 60);
    // };

    //------------------------------------------------------------------------------
    // Window_Status
    /**
     * ウィンドウを更新する。
     */
    Window_Status.prototype.refresh = function() {
        Window_StatusBase.prototype.refresh.call(this);
        const itemRect = this.itemRect();
        this.drawText(textStatus1, itemRect.x, itemRect.y, itemRect.width, "right");
    };

    //------------------------------------------------------------------------------
    // Window_StatusParams
    Window_StatusParams.prototype.refresh = function() {
        if (this.contents) {
            this.contents.clear();
        }
        const itemRect = this.itemRect();
        this.drawText(textStatus2, itemRect.x, itemRect.y, itemRect.width, "right");
    };

    // /**
    //  * Window_StatusParam
    //  * パラメータ情報表示
    //  */
    // function Window_StatusParam() {
    //     this.initialize.apply(this, arguments);
    // }

    // Window_StatusParam.prototype = Object.create(Window_Base.prototype);
    // Window_StatusParam.prototype.constructor = Window_StatusParam;

    // /**
    //  * 新しいWindow_StatusParamを構築する。
    //  */
    // Window_StatusParam.initialize = function(x, y, width, height) {
    //     this._actor = null;
    //     Window_Base.prototype.initialize.call(this, x, y, width, height);
    // };
    // /**
    //  * アクターを設定する。
    //  * @param {Game_Actor} actor アクター
    //  */
    // Window_StatusParam.prototype.setActor = function(actor) {
    //     if (this._actor !== actor) {
    //         this._actor = actor;
    //         this.refresh();
    //     }
    // };

    // /**
    //  * 表示を更新する。
    //  */
    // Window_StatusParam.prototype.refresh = function() {
    //     var actor = this._actor;
    //     this.contents.clear();
        
    //     // 基本パラメータ                           熟練度 
    //     // STR   12(+2)   ATK    128 (+78)  HIT     (Icon)LvX ゲージ
    //     // DEX    7       DEF     43 (+22)  CRI     (Icon)LvX ゲージ
    //     // VIT    6       PDR     0%        CDR      :
    //     // INT    5(+1)                     
    //     // MEN    8(+2)   MATK    15        
    //     // AGI    9       MDEF    24        
    //     // LUK    7       MDR   -20%
    //     this.drawBasicParameters(actor);
    //     this.drawWeponMasteries(actor);
    // };

    // /**
    //  * 基本パラメータを描画する
    //  */
    // Window_StatusParam.prototype.drawBasicParameters = function(actor) {
    //     var padding = this.standardPadding();
    //     var lineHeight = this.lineHeight();
    //     var x = padding;
    //     var y = padding;
    //     this.changeTextColor(this.systemColor());
    //     this.drawText("ステータス", x, y, 320);

    //     var basicParamList = [
    //         { name:"STR", current:actor.str, base:actor.getBasicParamBase(0) },
    //         { name:"DEX", current:actor.dex, base:actor.getBasicParamBase(1) },
    //         { name:"VIT", current:actor.vit, base:actor.getBasicParamBase(2) },
    //         { name:"INT", current:actor.int, base:actor.getBasicParamBase(3) },
    //         { name:"MEN", current:actor.men, base:actor.getBasicParamBase(4) },
    //         { name:"AGI", current:actor.agi, base:actor.getBasicParamBase(5) },
    //         { name:"LUK", current:actor.getLuk(), base:actor.getLuk() }
    //     ];
    //     var y1 = y + lineHeight;
    //     for (var i = 0; i < basicParamList.length; i++) {
    //         var bp = basicParamList[i];
    //         var appendVal = bp.current - bp.base;
    //         this.drawBasicParameter(bp.name, bp.current, appendVal, x, y1 + lineHeight * i);
    //     }

    //     var x2 = x + 220;
    //     var atk = actor.param(2);
    //     var baseAtk = actor.paramBase(2);
    //     this.drawBasicParameter("ATK", atk, atk - baseAtk, x2, y1 + lineHeight * 0);
    //     this.drawRate("PPR", actor.ppr, x2, y1 + lineHeight * 1);
    //     var def = actor.param(3);
    //     var baseDef = actor.paramBase(3);
    //     this.drawBasicParameter("DEF", def, def - baseDef, x2, y1 + lineHeight * 2);
    //     this.drawRate("PDRR", 1 - actor.pdr, x2, y1 + lineHeight * 3);

    //     var matk = actor.param(4);
    //     var baseMatk = actor.paramBase(4);
    //     this.drawBasicParameter("MATK", matk, matk - baseMatk, x2, y1 + lineHeight * 5);
    //     this.drawRate("MPR", actor.mpr, x2, y1 + lineHeight * 6);
    //     var mdef = actor.param(5);
    //     var baseMdef = actor.paramBase(5);
    //     this.drawBasicParameter("MDEF", mdef, mdef - baseMdef, x2, y1 + lineHeight * 7);
    //     this.drawRate("MDRR", 1 - actor.mdr, x2, y1 + lineHeight * 8);

    //     var x3 = x2 + 220;
    //     var rParamList = [
    //         { name:"HIT", rate:actor.hit },
    //         { name:"EVA", rate:actor.eva },
    //         { name:"MEVA", rate:actor.mev },
    //         { name:"CRI", rate:actor.cri }, 
    //         { name:"CRR", rate:actor.pcr - TWLD.Core.BasicCriticalRate }, // 標準倍率は1.5なので差分を引く。
    //         { name:"MCRR", rate:actor.mcrr - TWLD.Core.BasicCriticalRate }, // 標準倍率は1.5なので差分を引く。
    //     ];
    //     for (var l = 0; l < rParamList.length; l++) {
    //         var rp = rParamList[l];
    //         this.drawRate(rp.name, rp.rate, x3, y1 + lineHeight * l);
    //     }
    // }

    // /**
    //  * ウェポンマスタリー欄を描画する。
    //  */
    // Window_StatusParam.prototype.drawWeponMasteries = function(actor) {
    //     var padding = this.standardPadding();
    //     var lineHeight = this.lineHeight();
    //     var x = padding + 680;
    //     var y = padding;

    //     // マスタリーの表示(こりゃ面倒だ)
    //     var wms = actor.getWeaponMasteries();
    //     this.changeTextColor(this.systemColor());
    //     this.drawText("ウェポンマスタリー", x, y, 320);
    //     var xpos = x;
    //     var ypos = y + lineHeight;
    //     for (var i = 0; i < wms.length; i++) {
    //         // ウェポンマスタリーを描画
    //         var wm = wms[i];
    //         this.drawWeaponMastery(wm, xpos, ypos);
    //         ypos += lineHeight;
    //         if ((ypos + lineHeight) > (this.height - padding)) {
    //             ypos = y + lineHeight;
    //             xpos += 220;
    //         }
    //     }
    // };




    //------------------------------------------------------------------------------
    // Window_StatusEquip
    Window_StatusEquip.prototype.refresh = function() {
        if (this.contents) {
            this.contents.clear();
        // TODO : 描画
        }
        const itemRect = this.itemRect();
        this.drawText(textStatus3, itemRect.x, itemRect.y, itemRect.width, "right");
    };
    // /**
    //  * Window_StatusEquip
    //  * 装備表示
    //  */
    // function Window_StatusEquip() {
    //     this.initialize.apply(this, arguments);
    // }

    // Window_StatusEquip.prototype = Object.create(Window_Base.prototype);
    // Window_StatusEquip.prototype.constructor = Window_StatusEquip;

    // /**
    //  * 新しいWindow_StatusEquipを構築する。
    //  */
    // Window_StatusEquip.initialize = function(x, y, width, height) {
    //     this._actor = null;
    //     Window_Base.prototype.initialize.call(this, x, y, width, height);
    // };
    // /**
    //  * アクターを設定する。
    //  * @param {Game_Actor} actor アクター
    //  */
    // Window_StatusEquip.prototype.setActor = function(actor) {
    //     if (this._actor !== actor) {
    //         this._actor = actor;
    //         this.refresh();
    //     }
    // };

    // /**
    //  * 表示を更新する。
    //  */
    // Window_StatusEquip.prototype.refresh = function() {
    //     var actor = this._actor;
    //     var padding = this.standardPadding();
    //     var lineHight = this.lineHeight();
    //     this.contents.clear();
        
    //     // 装備一覧を描画する。
    //     var equipSlots = actor.equipSlots();
    //     var equips = actor.equips();
    //     var x = padding;
    //     var y = padding;
    //     for (var i = 0; i < equipSlots.length; i++) {
    //         var slotName = $dataSystem.equipTypes[equipSlots[i]];
    //         this.drawEquipItem(slotName, equips[i], x, y + lineHight * i);
    //     }
    // };

    // /**
    //  * 装備品情報を描画する。
    //  * @param {String} slotName
    //  * @param {Game_item} equipItem 装備品(未装備の場合にはnull)
    //  * @param {Number} x 描画位置x
    //  * @param {Number} y 描画位置y
    //  */
    // Window_StatusEquip.prototype.drawEquipItem = function(slotName, equipItem, x, y) {
    //     // スロット名
    //     this.changeTextColor(this.systemColor());
    //     this.drawText(slotName, x, y, 120);
    //     this.drawText(":", x + 120, y, 16);

    //     // 装備品アイコン
    //     if (equipItem && (equipItem.iconIndex >= 0)) {
    //         var x2 = x + 140;
    //         if (equipItem.iconIndex >= 0) {
    //             this.drawIcon(equipItem.iconIndex, x2 + 2, y + 2);
    //         }
    //     }

    //     // 装備品名称
    //     var x3 = x + 180;
    //     if (equipItem) {
    //         this.changeTextColor(this.itemNameColor(equipItem));
    //         this.drawText(equipItem.name, x3, y, 320, "left");
    //     } else {
    //         this.resetTextColor();
    //         this.drawText("(なし)", x3, y, 320, "left");
    //     }

    //     // 装備品の情報テキトーに。
    //     if (equipItem) {
    //         // 装備効果を列挙する。
    //         // 差分でいいのかなあ。
    //         var paramNameTable = ["HP", "MP", "ATK", "DEF", "MAT", "MDEF"];
    //         var upgradeText = "";
    //         for (var i = 0; i < 6; i++) {
    //             var pup = equipItem.params[i] - equipItem.initialParams[i];
    //             if (pup > 0) {
    //                 upgradeText += paramNameTable[i] + "+" + pup + " ";
    //             } else if (pup < 0) {
    //                 upgradeText += paramNameTable[i] + "" + pup + " ";
    //             }
    //         }
    //         var bParamNameTable = ["STR", "DEX", "VIT", "INT", "MEN", "AGI"];
    //         for (var j = 0; j < 6; j++) {
    //             var bpup = equipItem.basicParams[j] - equipItem.initialBasicParams[j];
    //             if (bpup > 0) {
    //                 upgradeText += bParamNameTable[j] + "+" + pup + " ";
    //             } else if (bpup < 0) {
    //                 upgradeText += bParamNameTable[j] + "" + pup + " ";
    //             }
    //         }
    //         if (upgradeText.length > 0) {
    //             this.changeTextColor(this.itemNameColor(equipItem));
    //             var x4 = x3 + 330;
    //             var textWidth = x + this.contentsWidth() - x4;
    //             this.drawText(upgradeText, x4, y, textWidth, "left");
    //         }
    //     }
    // };

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

    //-----------------------------------------------------------------------------
    // Window_StatusSkillList
    //

    // /**
    //  * 選択されている種類のSkill一覧を表示する。
    //  * type=0はパッシブを表示する。
    //  */
    // function Window_StatusSkillList() {
    //     this.initialize.apply(this, arguments);
    // }

    // Window_StatusSkillList.prototype = Object.create(Window_Selectable.prototype);
    // Window_StatusSkillList.prototype.constructor = Window_StatusSkillList;

    // /**
    //  * Window_StatusSkillListを初期化する。
    //  */
    // Window_StatusSkillList.prototype.initialize = function(x, y, width, height) {
    //     Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    //     this._actor = null;
    //     this._stypeId = 0;
    //     this._data = [];
    //     this._pendingIndex = -1;
    // };

    // /**
    //  * ペンディングインデックスを設定する。
    //  * @param {Number} index ペンディングインデックス
    //  */
    // Window_StatusSkillList.prototype.setPendingIndex = function(index) {
    //     if (this._pendingIndex !== index) {
    //         this._pendingIndex = index;
    //         this.refresh();
    //     }
    // };

    // /**
    //  * ペンディングインデックスを取得する。
    //  */
    // Window_StatusSkillList.prototype.getPendingIndex = function() {
    //     return this._pendingIndex;
    // };


    // /**
    //  * indexに対応する項目を取得する。
    //  * @param {Number} index インデックス
    //  * @return {Game_Skill} スキル
    //  */
    // Window_StatusSkillList.prototype.getItem = function(index) {
    //     if (this._data) {
    //         if ((index >= 0) && (index < this._data.length)) {
    //             return this._data[index];
    //         }

    //     }
    //     return null;
    // };

    // /**
    //  * アクターを設定する。
    //  */
    // Window_StatusSkillList.prototype.setActor = function(actor) {
    //     if (this._actor !== actor) {
    //         this._actor = actor;
    //         this._pendingIndex = -1;
    //         this.refresh();
    //         this.resetScroll();
    //     }
    // };

    // /**
    //  * 表示するスキルタイプを設定する。
    //  */
    // Window_StatusSkillList.prototype.setStypeId = function(stypeId) {
    //     if (this._stypeId !== stypeId) {
    //         this._stypeId = stypeId;
    //         this.refresh();
    //         this.resetScroll();
    //     }
    // };

    // /**
    //  * 最大カラム数
    //  */
    // Window_StatusSkillList.prototype.maxCols = function() {
    //     return 2;
    // };

    // /**
    //  * スキル間のスペース
    //  */
    // Window_StatusSkillList.prototype.spacing = function() {
    //     return 48;
    // };

    // /**
    //  * 最大アイテム数を取得する。
    //  * @return {Number} 最大アイテム数
    //  */
    // Window_StatusSkillList.prototype.maxItems = function() {
    //     return this._data ? this._data.length : 1;
    // };

    // /**
    //  * 選択されている項目を取得する。
    //  * @return {Data_Item} スキル
    //  */
    // Window_StatusSkillList.prototype.item = function() {
    //     return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    // };

    // /**
    //  * 現在選択中の項目が有効かどうかを取得する。
    //  * @return {Boolean} 有効な場合にはtrue, それ以外はfalse
    //  */
    // Window_StatusSkillList.prototype.isCurrentItemEnabled = function() {
    //     return true;
    // };

    // /**
    //  * 項目一覧を作成する。
    //  */
    // Window_StatusSkillList.prototype.makeItemList = function() {
    //     if (this._actor) {
    //         var stypeId = this._stypeId;
    //         if (stypeId >= 0) {
    //             this._data = this._actor.skillsWithOrder().filter(function(item) {
    //                 return item && (item.stypeId == stypeId);
    //             });
    //         }
    //     }
    // };

    // /**
    //  * 最後に選択されていた項目を再選択する。
    //  */
    // Window_StatusSkillList.prototype.selectLast = function() {
    //     this.select(0);
    // };

    // /**
    //  * 項目を描画する。
    //  */
    // Window_StatusSkillList.prototype.drawItem = function(index) {
    //     var rect = this.itemRect(index);
    //     if (index == this._pendingIndex) {
    //         // 並び替え用の項目は背景色を設定
    //         var color = this.pendingColor();
    //         this.changePaintOpacity(false);
    //         this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    //         this.changePaintOpacity(true);
    //     }
    //     var skill = this._data[index];
    //     if (skill) {
    //         this.drawItemName(skill, rect.x, rect.y, rect.width);
    //     }
    // };

    // /**
    //  * ヘルプウィンドウに説明用項目を設定する。
    //  */
    // Window_StatusSkillList.prototype.updateHelp = function() {
    //     this.setHelpWindowItem(this.item());
    // };

    // /**
    //  * 表示を更新する。
    //  */
    // Window_StatusSkillList.prototype.refresh = function() {
    //     this.makeItemList();
    //     this.createContents();
    //     this.drawAllItems();
    // };

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
            const rect = this.baseTextRect();
            const actor = this._actor;
            this.drawTextEx(actor.profile(), rect.x, rect.y, rect.width);
        }
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
     * @return {String} 画像ファイル名。未設定または設定されていない場合には空文字列。
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
     * @return {Number} ヘルプウィンドウの高さ
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
     * @return {Rectangle} ウィンドウ矩形領域。
     */
    Scene_Status.prototype.statusCategoryWindowRect = function() {
        const lineCount = enableProfile ? 5 : 4;
        const ww = this.commandWindowWidth();
        const wh = this.calcWindowHeight(lineCount, true);
        const wx = 0;
        const wy = this.mainAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };
    /**
     * コマンドウィンドウ幅を得る。
     * 
     * @return {Number} コマンドウィンドウ幅。
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
     * @return {Rectangle} ウィンドウ矩形領域。
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
     * @return {Rectangle} ウィンドウ矩形領域。
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
     * @return {Rectangle} ウィンドウ矩形領域
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
     * @return {Rectangle} ウィンドウ矩形領域。
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
     * @return {Rectangle} ウィンドウ表示領域。
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
                //this._statusWindow.show();
                break;
            case "status2":
                //this._statusParamsWindow.show();
                break;
            case "status3":
                this._statusEquipWindow.show();
                break;
            case "profile":
                //this._statusProfileWindow.show();
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
     * @return {Rectangle} ウィンドウ矩形領域
     * !!!overwrite!!! Scene_Status.profileWindowRect()
     *     ステータス画面変更のため、オーバーライドする。
     */
    Scene_Status.prototype.profileWindowRect = function() {
        const rect = this.statusCategoryWindowRect();
        const wx = rect.x + rect.width;
        const wy = 0;
        const ww = Graphics.boxWidth - wx;
        const wh = Graphics.boxHeight;
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
     * @return {Rectangle} 表示領域。
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
        var actor = this.actor();
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