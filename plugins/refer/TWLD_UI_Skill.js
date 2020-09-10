/*:
 * @plugindesc TWLDのスキル並び替えを実現するためのプラグイン
 * @help
 *      TWLD_Core前提。
 *      たくさんのスキルを習得すると、よく使うスキルを探すのが大変だろうと思って用意した。
 * 
 *      なぜならGame_Actorに並び替え用のAPIが用意してあるから。
 *      並びかえして取得するスキルは、Game_Actor.skills()から取ってきたうえで並び替えしているので、
 *      大きな影響はでないはず。
 *      UI側(Scene_SkillやらWindow_Item)は書き換えしてる。
 *      
 *      戦闘中のスキル並び替えはサポートしていない。
 */
var Imported = Imported || {};
Imported.TWLD_UI_Skill = true;

var TWLD = TWLD || {};
TWLD.Core = TWLD.Core || {};

if (!Imported.TWLD_UI) {
    throw "This plugin must be import after TWLD_UI.js";
}



(function() {

    //-----------------------------------------------------------------------------
    // Window_SkillListの変更
















    /**
     * スキルコストを描画する。
     * @param {Data_Skill} skill スキル
     * @param {Number} x 描画位置x
     * @param {Number} y 描画位置y
     * @param {Number} width 幅
     */
    Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
        var actor = this._actor;
        var costStr = '';
        var hpCost = actor.skillHpCost(skill);
        if (hpCost > 0) {
            costStr += 'HP' + hpCost;
        }
        var mpCost = actor.skillMpCost(skill);
        if (mpCost > 0) {
            if (costStr) {
                costStr += '/';
            }
            costStr += 'MP' + mpCost;
        }
        var tpCost = actor.skillTpCost(skill);
        if (tpCost > 0) {
            if (costStr) {
                costStr += '/';
            }
            costStr += 'TP' + tpCost;
        }

        this.drawText(costStr, x, y, width, 'right');
    };
    //-----------------------------------------------------------------------------
    // Window_SkillStatusの変更
    //
    Window_SkillStatus.prototype.refresh = function() {
        this.contents.clear();
        if (this._actor) {
            var x = 16;
            this.changePaintOpacity(true);
            this.drawActorFace(this._actor, x, 0, 144, 144);
            this.changePaintOpacity(true);
            
            var y = 150;
            var lineHeight = this.lineHeight();
            this.drawActorName(this._actor, x, y);
            this.drawActorHp(this._actor, x, y + lineHeight, 144);
            this.drawActorMp(this._actor, x, y + lineHeight * 2, 144);
            this.drawActorTp(this._actor, x, y + lineHeight * 3, 144);
        }
    };
        
    //-----------------------------------------------------------------------------
    // Scene_Skillの変更
    // 
    Scene_Skill.prototype.create = function() {
        Scene_ItemBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createStatusWindow();
        this.createSkillTypeWindow();
        this.createItemWindow();
        this.createActorWindow(); // アクター選択用ウィンドウ。
    };
    Scene_Skill.prototype.createHelpWindow = function() {
        var width = Graphics.boxWidth;
        var height = 140;
        var x = 0;
        var y = Graphics.boxHeight - height;
        this._helpWindow = new Window_Help(3, x, y, width, height);
        this.addWindow(this._helpWindow);
    };

    Scene_Skill.prototype.createStatusWindow = function() {
        var x = 0;
        var y = 0;
        var width = 240; // Window_SkillType.WindowWidthからもってくる。
        var height = 340;
        this._statusWindow = new Window_SkillStatus(x, y, width, height);
        this._statusWindow.reserveFaceImages();
        this.addWindow(this._statusWindow);
    };

    Scene_Skill.prototype.createSkillTypeWindow = function() {
        var wy = this._statusWindow.height;
        this._skillTypeWindow = new Window_SkillType(0, wy);
        this._skillTypeWindow.setHelpWindow(this._helpWindow);
        this._skillTypeWindow.setHandler('skill',    this.commandSkill.bind(this));
        this._skillTypeWindow.setHandler('cancel',   this.popScene.bind(this));
        this._skillTypeWindow.setHandler('pagedown', this.nextActor.bind(this));
        this._skillTypeWindow.setHandler('pageup',   this.previousActor.bind(this));
        this.addWindow(this._skillTypeWindow);
    };




    


})();