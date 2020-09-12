/*:
 * @plugindesc TWLD向けに構築した陣形に関するプラグイン
 * @author kapuusagi
 * 
 * @param FrontPositionIcon
 * @desc 前衛の時に表示するアイコン番号
 * @default -1
 * 
 * @param BackPositionIcon
 * @desc 後衛の時に表示するアイコン番号
 * @default -1
 * 
 * @help 
 *   仕様
 * 
 * 
 *   プラグインコマンド
 * 
 *   ノートタグ
 * 
 *          
 *   その他
 *     ・いろいろ考えたが、行動対象の拡張はscopeを使用することにした。
 *       こうすると既存システムとマッチしやすいかなあと思った。

 *     ・ウボァー、$dataTroopにノートタグがないから、グループに対して敵設定できんよ。
 */
var Imported = Imported || {};
Imported.TWLD_Formation = true;

var TWLD = TWLD || {};
TWLD.Fom = TWLD.Fom || {};

// for ESLint
if (typeof Game_Temp == 'undefined') {
    var BattleManager = {};
    var Scene_Menu = {};
    var DataManager = {};
    var PluginManager = {};
    var $dataSkills = {};
    var $gameParty = {};
    var Game_Item = {};
    var Game_Party = {};
    var Game_Actor = {};
    var Game_BattlerBase = {};
}

(function() {
    'use strict'

    TWLD.Fom.Parameters = PluginManager.parameters('TWLD_Formation');
    TWLD.Fom.FrontPositionIcon = TWLD.Fom.Parameters['FrontPositionIcon'];
    TWLD.Fom.BackPositionIcon = TWLD.Fom.Parameters['BackPositionIcon'];

    /**
     * レンジを表す文字列からレンジを得る。
     * @param {string} str レンジを表す文字列
     * @return {Number} レンジを表す数値
     */
    TWLD.Fom.getRange = function(str) {
        if (str.match(/long/i)) {
            return Game_Item.RANGE_LONG;
        } else if (str.match(/middle/i)) {
            return Game_Item.RANGE_MIDDLE;
        } else {
            return Game_Item.RANGE_SHORT;
        }
    };

    //------------------------------------------------------------------------------
    // DataManagerの変更
    TWLD.Fom.DatabaseLoaded = false;
    TWLD.Fom.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;

    DataManager.isDatabaseLoaded = function() {
        if (!TWLD.Fom.DataManager_isDatabaseLoaded.call(this)) {
            return false;
        }

        if (!TWLD.Fom.DatabaseLoaded) {
            DataManager.twldFomSkillNotetags($dataSkills);
        }
    };

    /**
     * スキルデータのノートタグを解釈する。
     * レンジやら対象範囲やらを解析する。
     * @param {Array<DataSkill>} skills スキルデータ
     */
    DataManager.twldFomSkillNotetags = function(skills) {
        var patternRange = /<Range[ :]+([a-zA-Z]+) *>/;
        for (var n = 1; n < skills.length; n++) {
            var skill = skills[n];
            skill.range = Game_Item.RANGE_SHORT;

            var noteLines = skill.note.split(/[\r\n]+/);
            noteLines.forEach(function(line) {
                var re;
                if ((re = line.match(patternRange)) !== null) {
                    skill.range = TWLD.Fom.getRange(re[1]);
                }
            });

        }
    };
    //------------------------------------------------------------------------------
    // Game_BattlerBaseの変更
    //

    TWLD.Fom.Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        TWLD.Fom.Game_BattlerBase_initMembers.call(this);
        this._position = 0;
    };

    /**
     * 奥行の位置を得る。
     * @return {Number} 位置番号
     */
    Game_BattlerBase.prototype.getPosition = function() {
        return this._position;
    }

    /**
     * 奥行の位置を設定する。
     * @param {Number} position 位置番号
     */
    Game_BattlerBase.prototype.setPosition = function(position) {
        this._position = position;
    };

    //------------------------------------------------------------------------------
    // Game_Actorの変更
    //


    /**
     * 位置を入れ替える。
     */
    Game_Actor.prototype.exchangePosition = function() {
        var newPosition = (this.getPosition() === 0) ? 1 : 0;
        this.setPosition(newPosition);
    };

    //------------------------------------------------------------------------------
    // Game_Partyの変更
    //
    /**
     * 前衛・後衛の位置を入れ替える。
     * 全員後列は許容する。その代わり、戦闘開始時にリフレッシュして更新する。
     * @param {Number} index パーティー中の隊列番号
     */
    Game_Party.prototype.exchangePosition = function(index) {
        this._actors[index].exchangePosition();
    };


    //------------------------------------------------------------------------------
    // Scene_Menuの変更
    //
    TWLD.Fom.Scene_Menu_onFormationOk = Scene_Menu.prototype.onFormationOk;
    /**
     * 隊列変更モード時、OK操作された時の処理を行う。
     */
    Scene_Menu.prototype.onFormationOk = function() {
        var index = this._statusWindow.index();
        var pendingIndex = this._statusWindow.pendingIndex();
        if ((pendingIndex >= 0) && (index === pendingIndex)) {
            // インデックスが同じなら選択アクターの前衛・後衛を入れ替える
            $gameParty.exchangePosition(index);
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.redrawItem(index);
            this._statusWindow.activate();
        } else {
            TWLD.Fom.Scene_Menu_onFormationOk.call(this);
        }
    };

    //------------------------------------------------------------------------------
    // BattleManagerの変更
    //



})();