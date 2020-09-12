/*:
 * @plugindesc TWLD 向けにプラグインでの変更点を更にいじるためのもの。
 * @author Kapuusagi
 * 
 * 
 * @help
 * 他のプラグイン導入後に読み込むようにする。
 */
var Imported = Imported || {};
Imported.TWLD_ModifyPlugin = true;

var TWLD = TWLD || {};
TWLD.Core = TWLD.Core || {};

// for ESLint.
if (typeof Game_Temp === 'undefined') {
    //var Game_Action = {};
    //var Game_Item = {};
    var Game_BattlerBase = {};
    var Game_Actor = {};
    var Game_Enemy = {};
    //var Game_Interpreter = {};
    var Scene_Battle = {};
    var Sprite = {};
    var Graphics = {};
    var ItemManager = {};
    var ImageManager = {};
    var BattleManager = {};
    var DataManager = {};
    var Battle_Hud = {};
    var $gameTemp = {};
    var $gameParty = {};
    var $dataSkills = {};
    var $gameSystem = {};
    var Moghunter = {};

    // YEP_ExtraEnemyDrops plugin.
    var DropManager = {};
}


(function() {
    'use strict';

    if (Imported.YEP_CoreEngine) {
        //---------------------------------------------------------------------
        // YEP_CoreEngine.jsに対する変更
        //     何故かlearnSkillをオーバーライドしてるので更に上書きする。
        //
        TWLD.Core.Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;

        /**
         * skillIdで指定されるスキルを習得する。
         * @param {Number} skillId スキルID
         */
        Game_Actor.prototype.learnSkill = function(skillId) {
            TWLD.Core.Game_Actor_learnSkill.call(this, skillId);

            // スキル並び順に登録されてなかったら末尾に追加。
            if (!this._skillOrder.contains(skillId)) {
                this._skillOrder.push(skillId);
            }
            // スキルタイプが追加されていなかったら追加する。
            // 尚forget側では実装しない。
            var skill = $dataSkills[skillId];
            if (skill.stypeId > 0) {
                var stypeList = this.addedSkillTypes();
                if (!stypeList.contains(skill.stypeId)) {
                    // スキルタイプが無いので追加する。
                    this._uniqueTraits.push({
                        code:Game_BattlerBase.TRAIT_STYPE_ADD,
                        dataId:skill.stypeId,
                        value:1,
                    });
                }
            }
        };

    }

    if (Imported.YEP_ExtraEnemyDrops) {

        //---------------------------------------------------------------------
        // YEP_ExtraEnemyDrops.jsに対する変更
        //

        /**
         * ドロップアイテムを生成する。
         */
        DropManager.makeConditionalDropItems = function() {
            var length = this._data.length;
            if (length <= 0) {
                return;
            }
            for (var i = 0; i < length; ++i) {
                var data = this._data[i];
                var item = data[0];
                var conditions = data[1];
                if (Math.random() < (this.getConditionalRate(conditions) * this.dropItemRate())) {
                    this._drops.push(item);
                }
            }
        };

        /**
         * アイテムドロップ補正倍率を得る。
         * RTにデフォルトで用意されている倍率2倍フラグはそのまま使う。
         * それ以外は単純加算とする。
         * @return {Number}補正倍率
         */
        DropManager.dropItemRate = function() {
            return $gameParty.getDropRate();
        };
    } else {
    }

    //---------------------------------------------------------------------
    // MOG_ATB.jsに対する変更
    //
    if (Imported.MOG_ATB) { 
        /**
         * このアクターまたはエネミーのATB速度を取得する。
         * 既定の実装ではagiを返すが、agiが小さすぎると先頭スピードに支障をきたしたので変更する。
         * @return {Number} ATB速度
         */
        Game_BattlerBase.prototype.atbSpeed = function() {
            var rate = this.sparam(Game_BattlerBase.TRAIT_SPARAM_DID_ATB); // 乗算レート合計
            var speed = (this.agi + 50).clamp(0, 200) * rate;
            return Math.round(speed);
        };

        /**
         * キャストタイムを得る。
         * @param {Data_Item}} item アイテム(Skill/Item)
         * @return キャストタイム
         */
        Game_BattlerBase.prototype.castTime = function(item) {
            if (DataManager.isSkill(item)) {
                return this.skillCastTime(item);
            } else {
                return Math.abs(item.speed);
            }
        };

        /**
         * スキルのキャストタイムを得る。
         * @param {Data_Skill} skill スキル
         * @return キャストタイム
         */
        Game_BattlerBase.prototype.skillCastTime = function(skill) {
            return Math.round(skill.speed) * this.sparam(Game_BattlerBase.TRAIT_SPARAM_DID_CASTTIME);
        };

        /**
         * スキルのキャストタイムを得る。
         * @param {Data_Skill} skill スキル
         * @return キャストタイム
         */
        Game_Actor.prototype.castTime = function(skill) {
            var castTime = Game_BattlerBase.prototype.castTime.call(this, skill);
            if (castTime > 0) {
                var wmTypeId = skill.wmTypeId;
                if (wmTypeId <= 0) {
                    // 適用するウェポンマスタリータイプが指定されていない。
                    var weapons = this.weapons();
                    wmTypeId = (weapons.length > 0) ? weapons[0].wtypeId : 1;
                }
                var wmLevel = this.getWMLevel(wmTypeId);
                castTime *= (1 - wmLevel * 0.01); // 1レベル上がる毎に1%短縮。
            }

            return castTime;
        };
        

        /**
         * 行動を起こす際の前処理
         * @param {Game_BattlerBase} battler バトラー
         */
        BattleManager.prepareActionActor = function(battler) {
            var action = battler.currentAction();
            if (action && action.item() && battler.canUse(action.item())) {
                var castTime = battler.castTime(action.item());
                if (castTime > 0 && battler.guardSkillId() != action.item().id) {
                    battler._cast_atb = [action.item(),0,castTime];
                } else {
                    battler._atbItem = action.item();
                }
            } else {
                battler.clearATB();
            }
        };


        /**
         * 行動を起こす際の前処理
         * @param {Game_BattlerBase} battler バトラー
         */
        BattleManager.prepareActionEnemy = function(battler) {
            battler.makeActions();
            var action = battler.currentAction();
            if (action && action.item() && battler.canUse(action.item())) {
                battler._atbItem = action.item();
                var castTime = battler.castTime(action.item());
                if (castTime > 0 && battler.guardSkillId() != action.item().id) {
                    battler._cast_atb = [action.item(),0,castTime];
                } else {
                    this._atbBattler = battler;
                }
            } else {
                battler.clearATB();
            }
        };
        /**
         * 逃走できるかどうかを判定する。
         * @param {Boolean} active アクターのコマンド選択が可能な状態かどうか
         * @return {Boolean} 逃走可能な場合にtrue, それ以外はfalse
         */
        // eslint-disable-next-line no-unused-vars
        BattleManager.canEscape_ATB = function(active) {
            // ここで逃走操作許可判定しない。
            return false;
        };

        TWLD.Core.Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
        /**
         * アクターのコマンド選択用ウィンドウを作成する。
         */
        Scene_Battle.prototype.createActorCommandWindow = function() {
            TWLD.Core.Scene_Battle_createActorCommandWindow.call(this);
            // MOG_ATBにてcancel操作は無効にされるので、
            // キャンセル操作するとパーティーコマンドが表示されるように戻す。
            this._actorCommandWindow.setHandler('cancel', this.onActorCommandWindowCancel.bind(this));
        };

        /**
         * ATB状態を更新可能かどうか判定する。
         * @return {Boolean} ATB状態を更新可能な場合にはtrue、それ以外はfalse
         */
        Scene_Battle.prototype.canUpdateAtbMode = function() {
            if ($gameSystem._atbMode[0] === 0) {
                return !(this._partyCommandWindow.active
                    || this._actorCommandWindow.active
                    || this._actorWindow.active
                    || this._enemyWindow.active
                    || this._skillWindow.active
                    || this._itemWindow.active
                    || this._equipSlotWindow.active
                    || this._equipItemWindow.active);
            } else if ($gameSystem._atbMode[0] === 1) {
                return !(this._actorWindow.active
                    || this._enemyWindow.active
                    || this._skillWindow.active
                    || this._itemWindow.active);
            } else if ($gameSystem._atbMode[0] === 2) {
                return !(this._skillWindow.active
                    || this._itemWindow.active);
            } else {
                return true;
            }
        };

        /**
         * アクターのコマンド選択画面でcancel操作されたときに通知を受け取る。
         */
        Scene_Battle.prototype.onActorCommandWindowCancel = function() {
            // パーティーウィンドウをアクティブにして表示する。
            this._partyCommandWindow.open();
            this._partyCommandWindow.activate();
            this._actorCommandWindow.deactivate();
        };

        /**
         * パーティーコマンドで「たたかう」を選択したときに通知を受け取る。
         */
        Scene_Battle.prototype.commandFight = function() {
            // アクターのコマンド選択に戻す。
            this._partyCommandWindow.deactivate();
            this._partyCommandWindow.close();
            this._actorCommandWindow.activate();
        };

        /**
         * 逃走コマンドが選択されたときに通知を受け取る。
         */
        Scene_Battle.prototype.commandEscape = function() {
            // 逃走処理してこのアクターの手番をパスする。
            BattleManager.processEscape();
            var actor = BattleManager.actor();
            if (actor) {
                actor.clearATB();
            }
            BattleManager.selectionComAtbClear();
            this.endCommandSelection();
        };


    }

    //---------------------------------------------------------------------
    // MOG_BattleHud.jsに対する変更
    //
    if (Imported.MOG_BattleHud) {

        BattleManager.isSpritesetBusy = function() {
            return this._spriteset.isBusy();
        };


        TWLD.Core.Battle_Hud_update_face = Battle_Hud.prototype.update_face;
        /**
         * フェイスの描画を更新する。
         */
        Battle_Hud.prototype.update_face = function() {
            TWLD.Core.Battle_Hud_update_face.call();
            this.updateDeadAnimation();
        }

        /**
         * 倒れたときのアニメーションを更新する。
         * 
         * スプライトセットのアニメーション切れ目で_isDeadAnimationStartedをONにして、以降フェードアウトさせる。
         * リカバリーはすぐに復帰。
         */
        Battle_Hud.prototype.updateDeadAnimation = function() {
            if (this._battler.isDead()) {
                if (!BattleManager.isSpritesetBusy() || this._isDeadAnimationStarted) {
                    this._isDeadAnimationStarted = true;
                    if (this._face.alpha > 0.3) {
                        this._face.alpha -= 0.05;
                    }
                }
            } else {
                this._isDeadAnimationStarted = false;
                if (this._face.alpha < 1) {
                    this._face.alpha += 0.1;
                    if (this._face.alpha >= 1) {
                        this._face.alpha = 1;
                    }
                }
            }
        };

        /**
         * 表示する顔画像を作成する。
         * 既定の実装ではFace_1.pngとかを読み出す実装だったが、
         * アクターに設定されている顔データを使うように変更した。
         */
        Battle_Hud.prototype.create_face = function() {
            if (String(Moghunter.bhud_face_visible) != "true") {
                return
            }
            this.removeChild(this._face);
            if (!this._battler) {
                return
            }
            this._face = new Sprite(ImageManager.loadFace(this._battler.faceName()));
            var faceIndex = this._battler.faceIndex();
            var sx = (faceIndex % 4) * 144;
            var sy = (faceIndex / 4) * 144;
            this._face.setFrame(sx, sy, 144, 144);
            this._face.anchor.x = 0.5;
            this._face.anchor.y = 0.5;
            this._face_data = [0,0,false,false,false,-1];
            this._face.ph = 0;
            this._face.animation = [-1,0,0,0,0,0,0,0,0];
            this._face.breathEffect = this._battler._bhud.faceBreath;
            this._face.scaleY = 0;
            if (String(Moghunter.bhud_face_shake) === "true") {
                this._face_data[2] = true;
            }
            if (String(Moghunter.bhud_face_animated) === "true") {
                this._face_data[4] = true;
            }
            this._battler._bhud_face_data = [0,0,0,1]
            this.addChild(this._face);
        };

        /**
         * HUDの位置を設定する。
         * 既定の実装では、CustomPositionが設定されていればそれを使い、
         * CustomPositionが無い場合には計算した値を使用するようになっていた。
         */
        Battle_Hud.prototype.set_hud_position = function() {
                this._hud_size = [this._layout.bitmap.width,this._layout.bitmap.height];
            this._members_max = $gameParty.battleMembers().length;
           switch (this._members_max) {
               case 1:
                   this.setHudPosition1();
                   break;
               case 2:
                   this.setHudPosition2();
                   break;
               case 3:
                   this.setHudPosition3();
                   break;
               case 4:
                   this.setHudPosition4();
                   break;
               case 5:
                   this.setHudPosition5();
                   break;
               case 6:
               default:
                   this.setHudPosition6();
                   break;
            }

            $gameTemp._bhud_position[this._hud_id] = [this._pos_x,this._pos_y];     
        };

        // MOG_BattleHudでフェイス位置がHUD基準位置に対して72pixel左側に表示される。
        // そのため_pos_xを設定する際にこの値だけ加算する。
        TWLD.Core.BattleHudFaceOffset = 72; 
        
        /**
         * パーティー人数1人の時のHUD位置を設定する。
         */
        Battle_Hud.prototype.setHudPosition1 = function() {
            var x = Graphics.boxWidth / 2 - 160 + TWLD.Core.BattleHudFaceOffset;
            var y = Graphics.boxHeight - 200;
            this._pos_x = x;
            this._pos_y = y;
            this._paramOffsetY = 20;
        };
        /**
         * パーティー人数2人の時のHUD位置を設定する。
         */
        Battle_Hud.prototype.setHudPosition2 = function() {
            var xpos = this._hud_id;
            var x = Graphics.boxWidth / 2 - 330 + 340 * xpos + TWLD.Core.BattleHudFaceOffset;
            var y = Graphics.boxHeight - 200;
            this._pos_x = x;
            this._pos_y = y;
            this._paramOffsetY = 20;
        };
        /**
         * パーティー人数3人の時のHUD位置を設定する。
         */
        Battle_Hud.prototype.setHudPosition3 = function() {
            var xpos = this._hud_id;
            var x = Graphics.boxWidth / 2 - 500 + 340 * xpos + TWLD.Core.BattleHudFaceOffset;
            var y = Graphics.boxHeight - 200;
            this._pos_x = x;
            this._pos_y = y;
            this._paramOffsetY = 20;
        };
        /**
         * パーティー人数4人の時のHUD位置を設定する。
         */
        Battle_Hud.prototype.setHudPosition4 = function() {
            var xpos = this._hud_id % 2;
            var ypos = Math.floor(this._hud_id / 2);
            var x = Graphics.boxWidth / 2 - 340 + 330 * xpos + TWLD.Core.BattleHudFaceOffset;
            var y;
            switch (ypos) {
                case 0:
                    x -= 80;
                    y = Graphics.boxHeight - 150 - 100;
                    this._paramOffsetY = 0;
                    break;
                case 1:
                    x += 80;
                    y = Graphics.boxHeight - 150;
                    this._paramOffsetY = 50;
                    break;
            }
            this._pos_x = x;
            this._pos_y = y;
        };
        /**
         * パーティー人数5人の時のHUD位置を設定する。
         */
        Battle_Hud.prototype.setHudPosition5 = function() {
            var xpos = this._hud_id % 3;
            var ypos = Math.floor(this._hud_id / 3);
            var x = Graphics.boxWidth / 2 - 500 + 340 * xpos + TWLD.Core.BattleHudFaceOffset;
            var y;
            switch (ypos) {
                case 0:
                    y = Graphics.boxHeight - 150 - 100;
                    this._paramOffsetY = 0;
                    break;
                case 1:
                    x += 160;
                    y = Graphics.boxHeight - 150;
                    this._paramOffsetY = 50;
                    break;
            }
            this._pos_x = x;
            this._pos_y = y;
        };
        /**
         * パーティー人数6人の時のHUD位置を設定する。
         */
        Battle_Hud.prototype.setHudPosition6 = function() {
            var xpos = this._hud_id % 3;
            var ypos = Math.floor(this._hud_id / 3);
            var x = Graphics.boxWidth / 2 - 500 + 340 * xpos + TWLD.Core.BattleHudFaceOffset;
            var y;
            switch (ypos) {
                case 0:
                    x -= 80;
                    y = Graphics.boxHeight - 150 - 100;
                    this._paramOffsetY = 0;
                    break;
                case 1:
                    x += 80;
                    y = Graphics.boxHeight - 150;
                    this._paramOffsetY = 50;
                    break;
            }
            this._pos_x = x;
            this._pos_y = y;
        };

        /**
         * HUDの位置を更新する。
         */
        TWLD.Core.Battle_Hud_refresh_position = Battle_Hud.prototype.refresh_position;
        Battle_Hud.prototype.refresh_position = function() {
            TWLD.Core.Battle_Hud_refresh_position.call(this);
            var yoffs = this._paramOffsetY;
            this._layout.y += yoffs; // "Layout.png"
            this._layout2.y += yoffs; // "Layout2.png"
            this._turn.y += yoffs; // "Turn.png"
            this._name.y += yoffs; // 名前描画用。
            // HP
            this._hp_meter_red.y += yoffs; // "HP_Meter.png"
            this._hp_meter_blue.y += yoffs; // "HP_Meter.png"
            // MP
            this._mp_meter_red.y += yoffs; // "HP_Meter.png"
            this._mp_meter_blue.y += yoffs; // "HP_Meter.png"
            // TP
            this._tp_meter_red.y += yoffs; // "HP_Meter.png"
            this._tp_meter_blue.y += yoffs; // "HP_Meter.png"

            this._at_meter.y += yoffs; // AT Meter
        };
    
        TWLD.Core.Battle_Hud_refresh_number = Battle_Hud.prototype.refresh_number;
        /**
         * HP/MP/TPなどの表示を更新する。
         * @param {Array<Sprite>} sprites 数値を表示するためのスプライト配列。
         * @param {Number} value 数値
         * @param {Array<Number>} 画像データを格納した数値配列っぽい
         *                        0:画像の幅, 1:高さ, 2:1文字の幅, 3:1文字の高さ
         *                        4:数値の表示位置x, 5:数値の表示位置y
         * @param {Number} x 表示位置x
         * @param {Number} y 表示位置y
         * @param {Number} type 数値の種類(0:HP, 1:MP, 2:TP)
         * 
         */
        Battle_Hud.prototype.refresh_number = function(sprites,value,img_data,x,y,type) {
            TWLD.Core.Battle_Hud_refresh_number.call(this, sprites, value, img_data, x, y, type);
            for (var i = 0; i < sprites.length; i++) {
                sprites[i].y += this._paramOffsetY;
            }
        };

    }

    //---------------------------------------------------------------------
    // YEP_ItemCore.jsに対する変更
    //
    if (Imported.YEP_ItemCore) {

        TWLD.Core.ItemManager_randomizeInitialStats = ItemManager.randomizeInitialStats;
        /**
         * ベースアイテムを元にnewItemのパラメータに乱数を適用する。
         */
        ItemManager.randomizeInitialStats = function(baseItem, newItem) {
            TWLD.Core.ItemManager_randomizeInitialStats.call(this, baseItem, newItem);
            // もしSTR/DEX/VIT/INT/MEN/AGIのボーナスをランダム化するならここでやる。

            // 初期値を保存。強化量の算出に使う。
            newItem.initialParams = [];
            newItem.initialBasicParams = [];
            for (var i = 0; i < newItem.params.length; i++) {
                newItem.initialParams[i] = newItem.params[i]
            }
            for (var j = 0; j < newItem.basicParams.length; j++) {
                newItem.initialBasicParams[j] = newItem.basicParams[j];
            }
        };

    }

})();
