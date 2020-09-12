/*:
 * @plugindesc TWLDのUI
 * TWLD_ModifyPluginsより後に読み込むようにする。
 * @help
 *     このプラグインはTWLDのUIモジュールやら共通で使ったりしそうな機能を提供する。
 *     ・アイテムカラー(強化してるやつは色変える)
 *     ・ウェポンマスタリーの描画用メソッド
 *     ・追加した基本パラメータ(STR/DEX/VIT/INT/MEN/AGI)の描画パラメータ
 *     ・選択項目変更時、itemchangeハンドラを呼び出す機能の追加。
 *       ヘルプウィンドウへの表示をウィンドウ側で処理するんじゃなくて、
 *       シーン側で表示するようにしたかっただけ。
 *     ・ヘルプウィンドウの表示内容変更
 *     ・OK/Cancel入力を受けてハンドラを呼び出すWindow_Simpleの追加
 *     ・共通で使えるコマンドウィンドウを構築するためのWindow_CommandGenericの追加。
 */
var Imported = Imported || {};
Imported.TWLD_UI = true;

var TWLD = TWLD || {};
TWLD.Core = TWLD.Core || {};

if (!Imported.TWLD_Core) {
    throw 'this plugin need TWLD_Core plugin.'
}

// for ESLint
if (typeof $gameParty === 'undefined') {
    var $dataSystem = {};
    var $gameParty = {};
    var $dataSkills = {};
    var Game_Item = {};
    var Game_BattlerBase = {};

    var Window_Base = {};
    var Window_MenuStatus = {};
    var Window_Command = {};
    var Window_Selectable = {};
    var Window_Help = {};
    var DataManager = {};
    var SoundManager = {};
    var TouchInput = {};
    var Input = {};
}


(function() {
    'use strict';


    //------------------------------------------------------------------------------
    // Window_Baseの改変
    // 

    /**
     * アイテム名を描画する色を取得する。
     * @return {Game_item} アイテム
     * @return {} 描画色
     */
    Window_Base.prototype.itemNameColor = function(item) {
        if (item && (item.boostCount > 0)) {
            return this.textColor(1);
        } else {
            return this.normalColor();
        }
    }
    /**
     * アイテムを描画する。
     * 既定の実装では、item.iconIndexで指定されるアイコンと、iitem.nameの名前を描画する。
     * @param {Data_Item} item アイテム(null可)
     * @param {Number} x 描画領域左上x位置
     * @param {Number} y 描画領域左上y位置
     * @param {Number} width 描画領域の幅。
     */
    Window_Base.prototype.drawItemName = function(item, x, y, width) {
        width = width || 312;
        if (item) {
            var iconBoxWidth = Window_Base._iconWidth + 4;
            this.drawIcon(item.iconIndex, x + 2, y + 2);
            this.changeTextColor(this.itemNameColor(item));
            this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        }
    }

    /**
     * ウェポンマスタリー情報を描画する。
     * @param {Weapon_Mastery} wm ウェポンマスタリー
     * @param {Number} x 描画x位置
     * @param {Number} y 描画y位置
     */
    Window_Base.prototype.drawWeaponMastery = function(wm, x, y) {
        // アイコンを書く。
        if (TWLD.Core.WMIcons[wm.wmTypeId] >= 0) {
            // アイコンを描画
            this.drawIcon(TWLD.Core.WMIcons[wm.wmTypeId], x, y + 2);
        }

        // レベルを描画
        this.resetTextColor();
        this.drawText('Lv', x + 40, y, 24, 'left');
        this.drawText(wm.level, x + 68, y, 32, 'right');

        // ゲージを描画
        var expRate = wm.exp / wm.nextExp;
        var color1 = this.textColor(20);
        var color2 = this.textColor(21);
        this.drawGauge(x + 110, y, 80, expRate, color1, color2);
    };

    /**
     * 基本パラメータを描画する。
     * 最大で190ピクセル幅くらい描画する。
     * @param {String} name パラメータ名
     * @param {Number} current 現在値
     * @param {Number} append 加算値
     * @param {Number} x 表示x位置
     * @param {Number} y 表示y位置
     */
    Window_Base.prototype.drawBasicParameter = function(name, current, append, x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText(name, x, y, 60, 'left');
        this.resetTextColor();
        this.drawText(current, x + 64, y, 56, 'right');
        if (append !== 0) {
            var appendText = (append > 0) ? ('(+' + append + ')') : ('(' + append + ')');
            //this.changePaintOpacity(false);
            this.changeTextColor(this.paramchangeTextColor(append));
            this.drawText(appendText, x + 120, y, 80, 'left');
            //this.changePaintOpacity(true);
        }
    }

    /**
     * 率を描画する。
     * @param {String} name パラメータ名
     * @param {Number} current 割合
     * @param {Number} x 表示x位置
     * @param {Number} y 表示y位置
     */
    Window_Base.prototype.drawRate = function(name, rate, x, y) {
        this.changeTextColor(this.systemColor());
        this.drawText(name, x, y, 60, 'left');
        this.resetTextColor();
        var d = Math.floor(rate * 100);
        var rateText = (d >= 0) ? ('+' + d + '%') : (d + '%');
        this.drawText(rateText, x + 64, y, 56, 'right');
    };

    //------------------------------------------------------------------------------
    // Window_Selectableの改変
    //
    TWLD.Core.Window_Selectable_select = Window_Selectable.prototype.select;
    /**
     * 項目を選択する。
     * 項目が選択変更されたとき、itemchangeのハンドラが呼ばれるようにする。
     * @param {Number} index インデックス番号
     */
    Window_Selectable.prototype.select = function(index) {
        var prevIndex = this._index;
        TWLD.Core.Window_Selectable_select.call(this, index);
        if (this._index !== prevIndex) {
            this.callHandler('itemchange');
        }
    };


    //------------------------------------------------------------------------------
    // Window_Helpの改変
    //
    /**
     * スキルの説明を描画する。
     * @param {Game_Skill} スキル
     */
    Window_Help.prototype.refreshSkill = function(item) {
        if (item === null) {
            return;
        }
        var padding = this.standardPadding();
        var lineHeight = this.lineHeight();
        var x = padding;
        var y = 0;

        if (this._numLines >= 3) {
            if (item.stypeId != 0) {
                // アクティブスキル
                // 種類 マスタリタイプ コスト(HP,MP,TP) 属性 
                this.changeTextColor(this.systemColor());
                var typeStr = $dataSystem.skillTypes[item.stypeId];
                this.drawText(typeStr, x, y, 120, 'left');
                if (item.wmTypeId > 0) {
                    // ウェポンマスタリータイプ表示
                    if (TWLD.Core.WMIcons[item.wmTypeId] >= 0) {
                        this.drawIcon(TWLD.Core.WMIcons[item.wmTypeId], x + 130, y + 2);
                    }
                    var wmTypeStr = $dataSystem.weaponTypes[item.wmTypeId];
                    this.drawText(wmTypeStr, x + 170, y, 120, 'left');
                }
                // 属性表示
                var elementIds = item.elementIds || [];

                this.changeTextColor(this.systemColor());
                this.drawText('属性:', x + 300, y, 80, 'left');
                var elementStr = this.getElementName(item.stypeId, elementIds);
                this.drawText(elementStr, x + 384, y, 120);

                if (this._actor !== null) {
                    this.drawCost('HP', this._actor.skillHpCost(item), x + 520, y);
                    this.drawCost('MP', this._actor.skillMpCost(item), x + 610, y);
                    this.drawCost('TP', this._actor.skillTpCost(item), x + 700, y);
                }
            } else {
                // パッシブスキル。
                // 説明を描画して終わり。
                this.resetTextColor();
                this.drawText('パッシブスキル', x, y, this.contentsWidth(), 'left');
            }
            y += lineHeight;
        }
        var text = item.description || '';
        this.resetTextColor();
        this.drawTextEx(text, x, y, this.contentsWidth());
    };
    /**
     * スキルコストを描画する。
     * @param {String} name 名前
     * @param {Number} value 値
     * @param {Number} x X位置
     * @param {Number} y y位置
     */
    Window_Help.prototype.drawCost = function (name, value, x, y) {
        this.changePaintOpacity(value !== 0);
        this.changeTextColor(this.systemColor());
        this.drawText(name, x, y, 32);
        this.resetTextColor();
        this.drawText(value, x + 40, y, 40, 'right');
        this.changePaintOpacity(true);
    };
    /**
     * 属性名を取得する。
     * @param {Number} stypeId スキルタイプID
     * @param {Array<Number>} elmeentId 属性ID配列
     * @return {String} 属性名文字列
     */
    Window_Help.prototype.getElementName = function(stypeId, elementIds) {
        if (elementIds.length > 0) {
            return elementIds.reduce(function(prev, id) {
                return prev + $dataSystem.elements[id];
            }, '');
        } else if ($dataSystem.magicSkills.contains(stypeId)) {
            // Magic
            return "無";
        } else {
            // Skill
            return "武器依存";
        }
    };

    /**
     * 道具の説明を描画する。
     */
    Window_Help.prototype.refreshItem = function(item) {
        // もし使用回数とかあるならここで描画処理を実装する。今のところは予定無し。
        var padding = this.standardPadding();
        var x = padding;
        var y = 0;
        var text = item.description || '';
        this.drawTextEx(text, x, y, this.contentsWidth());
    };
    /**
     * 武器の説明を描画する。
     * 既定の実装は単純なdescription表示にする。
     * TWLD_UI側で必要に応じて書き換える。
     */
    Window_Help.prototype.refreshWeapon = function(item) {
        var padding = this.standardPadding();
        var x = padding;
        var y = 0;
        var ypos = y;
        if (this._numLines >= 3) {
            this.drawWeaponInfo(item, x, ypos);
            ypos += this.lineHeight();
        }
        if (this._numLines >= 4) {
            this.drawEquipPerformance(item, x, ypos);
            ypos += this.lineHeight();
        }
        if (this._numLines >= 5) {
            this.drawEquipPassive(item, x, ypos);
            ypos += this.lineHeight();
        }
        var text = item.description || '';
        this.drawTextEx(text, x, ypos, this.contentsWidth());
    }

    /**
     * 武器の説明1を描画する。
     * 種類、レンジまで。
     * @param {Data_Item} item アイテム
     * @param {Number} x x位置
     * @param {Number} y y位置
     */
    Window_Help.prototype.drawWeaponInfo = function(item, x, y) {
        var xpos = x;
        // 種類
        var wTypeStr = (item.wtypeId > 0) ? '(' + $dataSystem.weaponTypes[item.wtypeId] + ')' : '(その他)';
        this.changeTextColor(this.systemColor());
        this.drawText(wTypeStr, x, y, 110);
        xpos += 116;

        // skill_idが設定されている場合、successRateを見ないといけない。
        var elementIds = [];
        var hit;
        var skillId = Number(item.meta.skill_id);
        if (skillId && (skillId > 0)) {
            var skill = $dataSkills[skillId];
            if (skill.elementIds) {
                elementIds = skill.elementIds;
            }
            if (elementIds.length === 0) {
                if (skill.damage.elementId > 0) {
                    elementIds.push(skill.damage.elementId);
                } else {
                    elementIds.push(TWLD.Core.PhysicalElements[0]);
                }
            }
            hit = skill.successRate;
        } else {
            elementIds.push(TWLD.Core.PhysicalElements[0]);
            hit = Math.floor(TWLD.Core.traitsSum(item.traits, Game_BattlerBase.TRAIT_XPARAM, 0) * 100);
        }

        // 属性
        this.changeTextColor(this.systemColor());
        this.drawText('属性:', xpos, y, 56);
        this.resetTextColor();
        var elementStr = elementIds.reduce(function(prev, id) {
            return prev + $dataSystem.elements[id];
        }, '');
        this.drawText(elementStr, xpos + 60, y, 76);
        xpos += 140;

        // レンジ
        this.resetTextColor();
        if (skillId && (skillId > 0)) {
            this.drawText(this.itemRange(skill), xpos, y, 110);
        } else {
            this.drawText(this.itemRange(item), xpos, y, 110);
        }
        xpos += 116;

        this.changeTextColor(this.systemColor());
        this.drawText('基本命中率:', xpos, y, 100);
        this.resetTextColor();
        this.drawText(hit + '%', xpos + 100, y, 60);
        xpos += 164;

        if (item.boostCount > 0) {
            this.changeTextColor(this.systemColor());
            var boostText = '強化回数' + item.boostCount + '回';
            this.drawText(boostText, xpos, y, 170);
        }
    }

    /**
     * 装備品の性能を描画する。
     * 基本的には性能のみ。
     * @param {Data_Item} item アイテム
     * @param {Number} x x位置
     * @param {Number} y y位置
     */
    Window_Help.prototype.drawEquipPerformance = function(item, x, y) {
        var xpos = 0;
        var numParams = [
            { name:'HP', value:item.params[0], base:item.initialParams[0] },
            { name:'MP', value:item.params[1], base:item.initialParams[1] },
            { name:'ATK', value:item.params[2], base:item.initialParams[2] },
            { name:'DEF', value:item.params[3], base:item.initialParams[3] },
            { name:'STR', value:item.basicParams[0].add, base:item.initialBasicParams[0].add},
            { name:'DEX', value:item.basicParams[1].add, base:item.initialBasicParams[1].add},
            { name:'VIT', value:item.basicParams[2].add, base:item.initialBasicParams[2].add},
            { name:'INT', value:item.basicParams[3].add, base:item.initialBasicParams[3].add},
            { name:'MEN', value:item.basicParams[4].add, base:item.initialBasicParams[4].add},
            { name:'AGI', value:item.basicParams[5].add, base:item.initialBasicParams[5].add},
        ];
        for (var i = 0; i < numParams.length; i++) {
            var np = numParams[i];
            var value = np.value;
            var append = np.value - np.base;
            if ((value != 0) || (append != 0)) {
                xpos += this.drawPlusNum(np.name, value, append, xpos, y) + 4;
            }
        }

        var baseItem = DataManager.getBaseItem(item);
        var eva = TWLD.Core.traitsSum(item.traits, Game_BattlerBase.TRAIT_XPARAM, 1);
        var evaBase = TWLD.Core.traitsSum(baseItem.traits, Game_BattlerBase.TRAIT_XPARAM, 1);
        var mev = TWLD.Core.traitsSum(item.traits, Game_BattlerBase.TRAIT_XPARAM, 4);
        var mevBase = TWLD.Core.traitsSum(baseItem.traits, Game_BattlerBase.TRAIT_XPARAM, 4);
        var cri = TWLD.Core.traitsSum(item.traits, Game_BattlerBase.TRAIT_XPARAM, 2);
        var criBase = TWLD.Core.traitsSum(baseItem.traits, Game_BattlerBase.TRAIT_XPARAM, 2);
        var crr = TWLD.Core.traitsSum(item.traits, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_CRR);
        var crrBase = TWLD.Core.traitsSum(baseItem.traits, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_CRR);
        var ppr = TWLD.Core.traitsSum(item.traits, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_PPR);
        var pprBase = TWLD.Core.traitsSum(baseItem.traits, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_PPR);
        var mpr = TWLD.Core.traitsSum(item.traits, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_MPR);
        var mprBase = TWLD.Core.traitsSum(baseItem.traits, Game_BattlerBase.TRAIT_XPARAM, Game_BattlerBase.TRAIT_XPARAM_DID_MPR);
        var rateParams = [
            { name:'EVA', value:eva, base:evaBase },
            { name:'MEVA', value:mev, base:mevBase },
            { name:'CRI', value:cri, base:criBase },
            { name:'CRR', value:crr, base:crrBase },
            { name:'PPR', value:ppr, base:pprBase },
            { name:'MPR', value:mpr, base:mprBase }
        ];
        for (var j = 0; j < rateParams.length; j++) {
            var rp = rateParams[j];
            var rateValue = Math.floor(rp.value * 100);
            var appendRateValue = Math.floor((rp.value - rp.base) * 100);
            if ((rateValue !== 0) || (appendRateValue !== 0)) {
                xpos += this.drawPlusRate(np.name, rateValue, appendRateValue, xpos, y) + 4;
            }
        }
    };

    /**
     * パラメータ加算値を描画する。
     * @param {String} name パラメータ名
     * @param {Number} rateValue 値
     * @param {Number} appendRateValue ブースト値
     * @param {Number} x x描画位置
     * @param {Number} y y描画位置
     * @return {Number} テキスト幅
     */
    Window_Help.prototype.drawPlusNum = function(name, value, append, x, y) {
        var text = (value > 0) ? (name + '+' + value) : (name + value);
        var len1 = this.textWidth(text);
        this.drawText(text, x, y, len1);
        var len = len1;
        if (append != 0) {
            var appendText = (append > 0) ? ('(+' + append + ')') : ('(' + append + ')'); // 基本ブーストしてマイナスはないけどね。
            var len2 = this.textWidth(appendText);
            this.changePaintOpacity(false);
            this.drawText(appendText, x + len1, y, len2);
            this.changePaintOpacity(true);
            len += len2;
        }
        return len;
    };

    /**
     * 割合パラメータを描画する。
     * @param {String} name パラメータ名
     * @param {Number} rateValue 値(%表示する整数値)
     * @param {Number} appendRateValue ブースト値(%表示する整数値)
     * @param {Number} x x描画位置
     * @param {Number} y y描画位置
     * @return {Number} テキスト幅
     */
    Window_Help.prototype.drawPlusRate = function(name, rateValue, appendRateValue, x, y) {
        var text = (rateValue > 0) ? (name + '+' + rateValue + '%') : (name + rateValue + '%');
        var len1 = this.textWidth(text);
        this.drawText(text, x, y, len1);
        var len = len1;
        if (appendRateValue != 0) {
            var appendText = (appendRateValue > 0) ? ('(+' + appendRateValue + '%)') : ('(' + appendRateValue + '%)'); // 基本ブーストしてマイナスはないけどね。
            var len2 = this.textWidth(appendText);
            this.changePaintOpacity(false);
            this.drawText(text, x + len1, y, len2);
            this.changePaintOpacity(true);
            len += len2;
        }
        return len;
    };

    /**
     * 装備品のパッシブスキルを描画する。
     * @param {Data_Item} item アイテム
     * @param {Number} x x位置
     * @param {Number} y y位置
     */
    Window_Help.prototype.drawEquipPassive = function(item, x, y) {
        var xpos = x;
        this.changeTextColor(this.systemColor());
        var text = 'パッシブスキル:';
        xpos += this.textWidth(text);
        this.drawText(text, x, y);
        var addSkillIds = item.traits().filter(function(t) {
            return (t.code == Game_BattlerBase.TRAIT_SKILL_ADD);
        });
        if (addSkillIds.length == 0) {
            this.resetTextColor();
            this.drawText('なし', xpos, y);
        } else {
            this.resetTextColor();
            for (var i = 0; i < addSkillIds.length; i++) {
                var skill = $dataSkills[addSkillIds[i]];
                this.drawText(skill.name, xpos, y);
                xpos += (this.textWidth(skill.name) + 4);
            }
        }
    };

    /**
     * アイテムレンジ文字列を取得する。
     * @param {Data_Item} item アイテム
     * @return {String} 文字列
     */
    Window_Help.prototype.itemRange = function(item) {
        if (item.range === Game_Item.RANGE_LONG) {
            return '長距離';
        } else if (item.range === Game_Item.RANGE_MIDDLE) {
            return '中距離';
        } else {
            return '近距離';
        }
    };

    /**
     * 補正値文字列を生成する。
     * @param {Data_Item} アイテム
     * @return {String} 文字列
     */
    Window_Help.prototype.makeCorrectionString = function(item) {
        var str = '';
        for (var i = 0; i < 6; i++) {
            if (item.basicParams[i] != 0) {
                if (item.basicParams[i] > 0) {
                    str += (TWLD.Core.StatusNames[i] + '+' + item.basicParams[i]) + ' ';
                } else {
                    str += (TWLD.Core.StatusNames[i] + '' + item.basicParams[i]) + ' '; // 負数は符号が自動的につく。
                }
            }
        }
        return str.trim();
    };

    /**
     * 防具の説明を描画する。
     * 既定の実装は単純なdescription表示にする。
     * TWLD_UI側で必要に応じて書き換える。
     */
    Window_Help.prototype.refreshArmor = function(item) {
        var padding = this.standardPadding();
        var x = padding;
        var y = 0;
        var ypos = y;
        if (this._numLines >= 3) {
            this.drawArmorInfo(item, x, ypos);
            ypos += this.lineHeight();
        }
        if (this._numLines >= 4) {
            this.drawEquipPerformance(item, x, ypos);
            ypos += this.lineHeight();
        }
        if (this._numLines >= 5) {
            this.drawEquipPassive(item, x, ypos);
            ypos += this.lineHeight();
        }
        var text = item.description || '';
        this.drawTextEx(text, x, ypos, this.contentsWidth());
    };

    /**
     * 防具の情報を描画する。
     */
    Window_Help.prototype.drawArmorInfo = function(item, x, y) {
        var xpos = x;
        // 種類
        var aTypeStr = (item.atypeId > 0) ? '(' + $dataSystem.armorTypes[item.atypeId] + ')' : '(その他)';
        this.resetTextColor();
        this.drawText(aTypeStr, x, y, 110);
        xpos += 116;

        if (item.boostCount > 0) {
            var boostText = '強化回数' + item.boostCount + '回';
            this.drawText(boostText, xpos, y, 170);
        }
    };

    //------------------------------------------------------------------------------
    // Window_MenuStatusの改変
    //

    /**
     * カラム数を取得する。
     * @return {Number} カラム数
     */
    Window_MenuStatus.prototype.maxCols = function() {
        return 2;
    };

    /**
     * 行数を取得する。
     * @return {Number} 行数
     */
    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 3;
    };
    /**
     * 画像を描画する。
     */
    Window_MenuStatus.prototype.drawItemImage = function(index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRect(index);
        this.changePaintOpacity(actor.isBattleMember());
        this.drawActorFace(actor, rect.x + 20, rect.y + 40, Window_Base._faceWidth, Window_Base._faceHeight);
        this.changePaintOpacity(true);
    };
    
    /**
     * 項目を描画する。
     * @param {Number} index 表示項目のインデックス番号
     */
    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRect(index);
        var x0 = rect.x + 20;
        var y0 = rect.y;
        var width0 = rect.width - 40;
        var lineHeight = this.lineHeight();
        var x1 = x0;
        var y1 = y0;

        // |        | Name
        // |        | NicName
        // | Face   | Class      
        // |        | Lv     HP     
        // |        | GP     MP
        // StatusIcons ...   TP
        var x2 = x1 + Window_Base._faceWidth + this.standardPadding();
        var nameWidth = x0 + width0 - x2;
        this.drawActorName(actor, x2, y1, nameWidth);
        var y2 = y1 + lineHeight;
        this.drawActorNickname(actor, x2, y2, nameWidth);
        var y3 = y2 + lineHeight;
        this.drawActorClass(actor, x2, y3, nameWidth);

        // Lv HP
        var y4 = y3 + lineHeight;
        var lvWidth = 120; // YEP_CoreEngineが導入されているとここを変えないといけない。
        this.drawActorLevel
        this.drawActorLevel(actor, x2, y4);
        var x3 = x2 + lvWidth + this.standardPadding();
        var hpWidth = x0 + width0 - x3;
        this.drawActorHp(actor, x3, y4, hpWidth);

        // GPとMP
        var y5 = y4 + lineHeight;
        this.drawActorGrowPoint(actor, x2, y5, lvWidth);
        this.drawActorMp(actor, x3, y5, hpWidth);

        // TP
        var y6 = y5 + lineHeight;
        this.drawActorTp(actor, x3, y6, hpWidth);

        // 状態アイコン
        var iconWidth = Window_Base._faceWidth + this.standardPadding() + lvWidth;
        this.drawActorIcons(actor, x0, y6, iconWidth);
    };


})();

//------------------------------------------------------------------------------
// Window_Simple
// Window_Baseにハンドラとok,cancelだけ受けられるようにしたやつ。
// 
function Window_Simple() {
    this.initialize.apply(this, arguments);
}

Window_Simple.prototype = Object.create(Window_Base.prototype);
Window_Simple.prototype.constructor = Window_Simple;

/**
 * Window_Simpleを構築する
 * 
 * @param {Number} x ウィンドウ位置x
 * @param {Number} y ウィンドウ位置y
 * @param {Number} width ウィンドウ幅
 * @param {Number} height ウィンドウ高さ
 */
Window_Simple.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._handlers = {};
    this._touching = false;
    this.deactivate();
};

/**
 * symbolで指定されるイベントに対応するハンドラを設定する。
 * @param {String} symbol シンボル
 * @param {Method} method メソッド
 */
Window_Simple.prototype.setHandler = function(symbol, method) {
    this._handlers[symbol] = method;
};

/**
 * symbolで指定されるイベントにハンドラが設定されているかを取得する。
 * 
 * @param {String} symbol シンボル
 * @return {Boolean} ハンドラが設定されている場合にはtrue、それ以外はfalse
 */
Window_Simple.prototype.isHandled = function(symbol) {
    return !!this._handlers[symbol];
}

/**
 * symbolに対応するハンドラを呼び出す。
 * 設定されていない場合には何もしない。
 * @param {String} symbol シンボル
 */
Window_Simple.prototype.callHandler = function(symbol) {
    if (this.isHandled(symbol)) {
        this._handlers[symbol]();
    }
};

/**
 * オープンしてアクティブ状態かどうかを取得する。
 * @return {Boolean} オープンかつアクティブな場合にはtrue。それ以外はfalse
 */
Window_Simple.prototype.isOpenAndActive = function() {
    return this.isOpen() && this.active;
};

/**
 * 更新する。
 */
Window_Simple.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.processHandling();
    this.processTouch();
};

/**
 * 入力の処理をする。
 */
Window_Simple.prototype.processHandling = function() {
    if (this.isOpenAndActive()) {
        if (this.isOkEnabled() && this.isOkTriggered()) {
            this.processOk();
        } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
            this.processCancel();
        }
    }
};

/**
 * タッチ処理をする。
 */
Window_Simple.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            this._touching = true;
            this.onTouch(true);
            if (this.isTouchOkEnabled()) {
                this.processOk();
            }
        } else if (TouchInput.isCancelled()) {
            if (this.isCancelEnabled()) {
                this.processCancel();
            }
        }
        if (this._touching) {
            if (TouchInput.isPressed()) {
                this.onTouch(false);
            } else {
                this._touching = false;
            }
        }
    } else {
        this._touching = false;
    }
};

/**
 * タッチ操作されているときの処理を行う。
 * @param {Boolean} triggered トリガーされているかどうか。
 * @return {Boolean} ？？？
 */
Window_Simple.prototype.onTouch = function(triggered) {
    return triggered && this.isTouchOkEnabled();
};

/**
 * タッチ操作が、このウィンドウ内の座標かどうかを判定する。
 * @return {Boolean} このウィンドウ内の座標の場合にはtrue, それ以外はfalse
 */
Window_Simple.prototype.isTouchedInsideFrame = function() {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

/**
 * タッチによるOK処理が有効かどうかを取得する。
 * @return {Boolean} タッチによるOK処理が有効な場合にはtrue, それ以外はfalse
 */
Window_Simple.prototype.isTouchOkEnabled = function() {
    return this.isOkEnabled();
};

/**
 * OKに対する処理が有効かどうかを取得する。
 * @return {Boolean} OKに対する処理が有効な場合にはtrue, それ以外はfalse
 */
Window_Simple.prototype.isOkEnabled = function() {
    return this.isHandled('ok');
};

/**
 * キャンセルに対する処理が有効かどうかを取得する。
 * @return {Boolean} キャンセルに対する処理が有効な場合にはtrue、それ以外はfalse
 */
Window_Simple.prototype.isCancelEnabled = function() {
    return this.isHandled('cancel');
};

/**
 * OKがトリガーされているかどうかを判定する。
 * @return {Boolean} OKがトリガーされている場合にはtrue, それ以外はfalse
 */
Window_Simple.prototype.isOkTriggered = function() {
    return Input.isRepeated('ok');
};

/**
 * キャンセルがトリガーされているかを判定する。
 * @return {Boolean} キャンセルがトリガーされている場合にはtrue, それ以外はfalse
 */
Window_Simple.prototype.isCancelTriggered = function() {
    return Input.isRepeated('cancel');
};

/**
 * OK処理をする。
 */
Window_Simple.prototype.processOk = function() {
    this.playOkSound();
    this.updateInputData();
    this.deactivate();
    this.callOkHandler();
};

/**
 * OK音を鳴らす。
 */
Window_Simple.prototype.playOkSound = function() {
    SoundManager.playOk();
};

/**
 * ブザー音を鳴らす。
 */
Window_Simple.prototype.playBuzzerSound = function() {
    SoundManager.playBuzzer();
};

/**
 * OKハンドラを呼び出す
 */
Window_Simple.prototype.callOkHandler = function() {
    this.callHandler('ok');
};

/**
 * キャンセル処理する。
 */
Window_Simple.prototype.processCancel = function() {
    SoundManager.playCancel();
    this.updateInputData();
    this.deactivate();
    this.callCancelHandler();
};

/**
 * キャンセルハンドラを呼び出す
 */
Window_Simple.prototype.callCancelHandler = function() {
    this.callHandler('cancel');
};

/**
 * 入力状態を更新する。
 */
Window_Simple.prototype.updateInputData = function() {
    Input.update();
    TouchInput.update();
};

/**
 * 描画内容を更新する。
 */
Window_Simple.prototype.refresh = function() {
    if (this.contents) {
        this.contents.clear();
        this.drawAllItems();
    }
};

//------------------------------------------------------------------------------
// GenericCommand
// 
/**
 * 汎用コマンド
 * @param {String} text 表示するテキスト
 * @param {String} symbol 通知を受け取るシンボル
 * @param {Boolean} enabled 有効かどうか。
 */
// eslint-disable-next-line no-unused-vars
function GenericCommand(text, symbol, enabled) {
    this.text = text || '';
    this.symbol = symbol || '';
    this.enabled = enabled || false;
}

//------------------------------------------------------------------------------
// Window_ItemCommand
// 毎回コマンドウィンドウ実装するのめんどくさい。
//
function Window_CommandGeneric() {
    this.initialize.apply(this, arguments);
}

Window_CommandGeneric.prototype = Object.create(Window_Command.prototype);
Window_CommandGeneric.prototype.initialize = Window_CommandGeneric;

/**
 * Window_ItemCommandを初期化する。
 * 
 */
Window_CommandGeneric.prototype.initialize = function(x, y, commandList, width) {
    this._windowWidth = width || 240;
    this._commandList = commandList;
    Window_Command.prototype.initialize.call(this, x, y);
    this.select(0);
};

/**
 * ウィンドウ幅を取得する。
 * @return {Number} ウィンドウ幅
 */
Window_CommandGeneric.prototype.windowWidth = function() {
    return this._windowWidth;
};

/**
 * 有効な行数を取得する。
 * @return {Number} 有効な行数。
 */
Window_CommandGeneric.prototype.numVisibleRows = function() {
    return (this._commandList) ? this._commandList.length : 0;
};

/**
 * コマンドリストを作成する。
 */
Window_CommandGeneric.prototype.makeCommandList = function() {
    if (!this._commandList) {
        return;
    }
    for (var i = 0; i < this._commandList.length; i++) {
        var cmdEntry = this._commandList[i];
        this.addCommand(cmdEntry.text, cmdEntry.symbol, cmdEntry.enabled);
    }
};

/**
 * 指定したシンボルのコマンドを有効にする。
 * @param {String} symbol シンボル
 * @param {Boolean} enabled 有効かどうか。
 */
Window_CommandGeneric.prototype.setCommandEnable = function(symbol, enabled) {
    if (this._commandList) {
        var cmdEntry = this._commandList.find(function(cmd) {
            return cmd.symbol === symbol;
        });
        if (cmdEntry !== null) {
            cmdEntry.enabled = enabled;
            this.refresh();
        }
    }
};

/**
 * indexで指定されるインデックスのコマンドが有効かどうかを取得する。
 * @param {Number} index インデックス
 * @return {Boolean} 有効な場合にはtrue, それ以外はfalse
 */
Window_CommandGeneric.prototype.isCommandEnabled = function(index) {
    if (this._commandList && (index >= 0) && (index < this._commandList.length)) {
        return this._commandList[index].enabled;
    } else {
        return false;
    }
};