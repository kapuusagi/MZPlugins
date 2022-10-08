/*:ja
 * @target MZ 
 * @plugindesc FS向けカスタマイズ
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_Base_DisplayLevelChange
 * @orderAfter Kapu_Base_DisplayLevelChange
 * @base Kapu_Base_DamageCalculation
 * @orderAfter Kapu_Base_DamageCalculation
 * @base Kapu_FriendlyPoint
 * @orderAfter Kapu_FriendlyPoint
 * @base Kapu_ChoiceActor
 * @orderAfter Kapu_ChoiceActor
 * 
 * 
 * @command gainFriendlyPoint
 * @text 友好度増減
 * @desc 指定アクターの単純に友好度を増減する。
 * 
 * @param actorId
 * @text アクター
 * @desc 対象のアクター
 * @type actor
 * @default 0
 * 
 * @param value
 * @text 値
 * @desc 値
 * @type number
 * @default 0
 * @min 10000
 * @max 10000
 * 
 * @command gainFriendlyPointWithoutActor
 * @text 指定アクター以外の友好度を増減
 * @desc 指定アクターの友好度を上げ、それ以外にデータの存在するアクターの友好度を下げる。
 * 
 * @param actorId
 * @text アクター
 * @desc 対象のアクター
 * @type actor
 * @default 0
 * 
 * @param value
 * @text 値
 * @desc 値
 * @type number
 * @default 0
 * @min 10000
 * @max 10000
 * 
 * @command gainFriendlyPointAll
 * @text 全友好度増減
 * @desc 存在するアクターの友好度を増減する。
 * 
 * @param value
 * @text 値
 * @desc 値
 * @type number
 * @default 0
 * @min 10000
 * @max 10000
 * 
 * 
 * @param friendlyPointTpRate
 * @text 友好度TP変換レート
 * @desc 初期TP値の算出に使用する、友好度からTPへ変換するレート。友好度にこの値が乗算される。0.1だと友好度10毎に1上がる。
 * @type number
 * @decimals 3
 * @default 0.025
 * 
 * @param gainFriendlyPointOnBattleWin
 * @text 戦闘勝利時上昇友好度
 * @desc 戦闘に勝利した際、上昇させる友好度
 * @type number
 * @default 1
 * 
 * @param friendlyPointDamageRate
 * @text 友好度ダメージ補正レート[%]
 * @desc ダメージ計算にて、友好度1あたりに補正するダメージレート(割合)。1.0にすると、友好度1上がる毎にダメージ量が1％上昇する。
 * @type number
 * @decimals 2
 * @default 0.25
 * 
 * @param displayFriendlyPoint
 * @text 友好度表示
 * 
 * @param displayFriendlyPointMin
 * @text 表示友好度下限
 * @type number
 * @default -100
 * @min -100000
 * @max 100000
 * @parent displayFriendlyPoint
 *  
 * 
 * @param displayFriendlyPointMax
 * @text 表示友好度上限
 * @type number
 * @default 100
 * @min -100000
 * @max 100000
 * @parent displayFriendlyPoint
 * 
 * @param displayFriendlyPointIconTable
 * @text アイコンテーブル
 * @desc 友好度を表示するアイコンテーブル。(0番のインデックスがデフォルト友好度時のもの、最大のインデックスが表示最大友好度のもの。中央が標準)
 * @type number[]
 * @default []
 * @parent displayFriendlyPoint
 * 
 * @param displayNegativeFriendlyPointIconTable
 * @text ネガティブアイコンテーブル
 * @desc 友好度を表示するアイコンテーブル。(0番目のインデックスが表示最低友好度のもの、最大のインデックスがデフォルト以下のもの)
 * @type number[]
 * @default []
 * @parent displayFriendlyPoint
 * 
 * @help 
 * FS向けの変更
 *     大前提として、No.1番のアクターは主人公で固定。
 * 
 * ・友好度操作用コマンドを追加。
 * ・レベルアップ時はランダムに上昇
 * ・クラスチェンジ時はステータス半減
 * ・友好度補正
 *   1番のアクター：パーティーメンバーとの友好度で一番高いものを採用
 *   それ以外： 1番のアクターとの友好度を採用
 *   補正
 *     友好度が高いほど初期TP増加
 *     友好度が高いほどダメージ増加
 *     友好度が低いとダメージ低下(最低時-1)
 * 
 * ■ 使用時の注意
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 友好度増減
 *   指定アクターの友好度を加減する。
 * 
 * 指定アクター以外の友好度を増減
 *   指定アクターを除いた、アクターの友好度を加減する。
 *   
 * 全友好度増減
 *   全アクターの友好度を加減する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <paramGainRate:%d,%d,%d,%d,%d,%d,%d,%d>
 *      それぞれのパラメータの上昇レート。(0～500, 0で成長しない。500で5倍成長)
 *      省略した場合には全部100(1.0倍)になる。
 *      MaxHP, MaxMP, ATK, DEF, MAT,MDEF, AGI, LUK の順
 *   <initialParams:%d,%d,%d,%d,%d,%d,%d,%d>
 *      それぞれのパラメータの初期値
 *      MaxHP, MaxMP, ATK, DEF, MAT,MDEF, AGI, LUK の順
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    'use strict';
    const pluginName = "Kapu_FS";
    const parameters = PluginManager.parameters(pluginName);

    const friendlyPointTpRate = Math.abs(Number(parameters["friendlyPointTpRate"] || 0.0));
    const gainFriendlyPointOnBattleWin = Math.floor(Number(parameters["gainFriendlyPointOnBattleWin"] || 0));
    const friendlyPointDamageRate = Math.floor(Number(parameters["friendlyPointDamageRate"] || 0));

    const displayFriendlyPointMin = Number(parameters["displayFriendlyPointMin"] || 0).clamp(
        Game_Actor.FRIENDLY_POINT_MIN, Game_Actor.FRIENDLY_POINT_DEFAULT);
    const displayFriendlyPointMax = Number(parameters["displayFriendlyPointMax"] || 0).clamp(
        Game_Actor.FRIENDLY_POINT_DEFAULT, Game_Actor.FRIENDLY_POINT_MAX);
    /**
     * paramを解析して、アイコン番号テーブルを得る。
     * 
     * @param {string} param パラメータ
     * @returns {Array<number>} アイコンインデックス配列
     */
    const _parseFriendlyIconTable = function(param) {
        try {
            if (param) {
                return JSON.parse(param || "[]").map((token) => Number(token || 0) || 0);
            }
        }
        catch (e) {
            console.error("Parse displayFriendlyPointIconTable failure:" + e);
        }

        return [];
    };

    const displayFriendlyPointIconTable = _parseFriendlyIconTable(parameters["displayFriendlyPointIconTable"]);
    const displayNegativeFriendlyPointIconTable = _parseFriendlyIconTable(parameters["displayNegativeFriendlyPointIconTable"]);
    /**
     * 有効度に対応したアイコンIDを得る。
     * 
     * @param {number} fp 有効度
     * @returns {number} アイコンID
     */
    const _getFriendlyPointIconId = function(fp) {
        // デフォルトより上か？
        const iconTable = (fp >= Game_Actor.FRIENDLY_POINT_DEFAULT)
            ? displayFriendlyPointIconTable : displayNegativeFriendlyPointIconTable;
        const range = (fp >= Game_Actor.FRIENDLY_POINT_DEFAULT)
            ? displayFriendlyPointMax - Game_Actor.FRIENDLY_POINT_DEFAULT
            : Game_Actor.FRIENDLY_POINT_DEFAULT - displayFriendlyPointMin;
        const gaugeValue = (fp >= Game_Actor.FRIENDLY_POINT_DEFAULT)
            ? (fp - Game_Actor.FRIENDLY_POINT_DEFAULT)
            : (fp - Game_Actor.FRIENDLY_POINT_MIN);
        const limitIconIndex = (fp >= Game_Actor.FRIENDLY_POINT_DEFAULT)
            ? (iconTable.length - 1) : 0;
        const isOverRange = (fp >= Game_Actor.FRIENDLY_POINT_DEFAULT)
            ? (fp >= displayFriendlyPointMax) : (fp < displayFriendlyPointMin);

        if (iconTable.length == 0) { // 表示アイコンテーブルなし？
            return 0;
        } else {
            if (range == 0) { // 表示範囲なし？
                return iconTable[0];
            } else {
                if (isOverRange) {
                    return iconTable[limitIconIndex];
                } else {
                    const position = gaugeValue / range;
                    const iconIndex = Math.round((iconTable.length - 1) * position);
                    return iconTable[iconIndex];
                }
            }
        }
    };

    const mainActorId = 1;

    PluginManager.registerCommand(pluginName, "gainFriendlyPoint", args => {
        const actorId = Number(args.actorId);
        const value = Math.floor(Number(args.value));
        if ((actorId > 0) && (actorId != mainActorId) 
                && $gameActors.isActorDataExists(actorId) && (value != 0)) {
            const actor = $gameActors.actor(actorId);
            actor.gainFriendlyPoint(mainActorId, value);
        }
    });
    PluginManager.registerCommand(pluginName, "gainFriendlyPointWithoutActor", args => {
        const excludeActorId = Number(args.actorId);
        const value = Math.floor(Number(args.value));
        if ((actorId > 0) && (value != 0)) {
            for (let actorId = 1; actorId < $dataActors.length; actorId++) {
                if ((actorId != mainActorId) && (actorId != excludeActorId) && $gameActors.isActorDataExists(actorId)) {
                    const actor = $gameActors.actor(actorId);
                    actor.gainFriendlyPoint(mainActorId, value);
                }
            }
        }
    });
    PluginManager.registerCommand(pluginName, "gainFriendlyPointAll", args => {
        const value = Math.floor(Number(args.value));
        if (value != 0) {
            for (let actorId = 1; actorId < $dataActors.length; actorId++) {
                if ((actorId != mainActorId) && $gameActors.isActorDataExists(actorId)) {
                    const actor = $gameActors.actor(actorId);
                    actor.gainFriendlyPoint(1, value);
                }
            }
        }
    });

    /**
     * ノートタグを処理する。
     * 
     * @apram {TraitObject} obj DataActor。
     */
    const _processNotetag = function(obj) {
        obj.paramGainRate = [ 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
        obj.initialParams = [0, 0, 0, 0, 0, 0, 0, 0];

        // gainRate
        if (obj.meta.paramGainRate) {
            const tokens = obj.meta.paramGainRate.split(',');
            for (let index = 0; index < tokens.length; index++) {
                const value = Math.max(0, Math.min(500, Number(tokens[index]) || 0));
                obj.paramGainRate[index] = value / 100.0;
            }
        }

        // initialValue
        if (obj.meta.initialParams) {
            const tokens = obj.meta.initialParams.split(',');
            for (let index = 0; index < tokens.length; index++) {
                const value = Math.floor(Number(tokens[index] || 0));
                obj.initialParams[index] = value;
            }
        }
    };

    DataManager.addNotetagParserActors(_processNotetag);

    /**
     * 友好度を得る。
     * メインアクターの場合、パーティーメンバーとの友好度の平均値を返す。
     * それ以外のアクターの場合、メインアクターとの友好度を返す。
     * 
     * @param {Game_Actor} actor アクター
     * @returns {number} 友好度
     */
    const _getFriendlyPoint = function(actor) {
        if (actor.isActor()) {
            if (actor.actorId() == mainActorId) { // メインアクターか？
                const maxFp = $gameParty.allMembers().reduce((prev, actor) => Math.max(prev, actor.friendlyPoint(1)), 0);
                return maxFp;
            } else {
                return actor.friendlyPoint(1);
            }
        } else {
            return 0;
        }
    };    


    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const dataActor = this.actor();
        for (let paramId = 0; paramId < this._paramPlus.length; paramId++) {
            this._paramPlus[paramId] = dataActor.initialParams[paramId];
        }
        this.refresh();
    };

    const _Game_Actor_changeClass = Game_Actor.prototype.changeClass;
    /**
     * クラスを変更する。
     * 
     * @param {number} classId クラスID
     * @param {boolean} keepExp 経験値を保持するか。
     *                          保持する場合、クラス毎に経験値が保持される。つまりジョブレベルね。
     */
    Game_Actor.prototype.changeClass = function(classId, keepExp) {
        _Game_Actor_changeClass.call(this, classId, keepExp);
        if (!keepExp) {
            const newExp = Math.floor(this.currentExp() / 2);
            this.changeExp(newExp, false);
            for (let paramId = 0; paramId < this._paramPlus.length; paramId++) {
                this._paramPlus[paramId] = Math.floor(this._paramPlus[paramId] / 2);
            }
            this.refresh();
        }
    };
    /**
     * 基本パラメータベース値を得る。
     * 
     * @param paramId {number} パラメータID
     * @return {number} パラメータ値
     * !!!overwrite!!! Game_Actor.paramBase()
     *     常にレベル1でのパラメータを返すように変更する。
     */
    Game_Actor.prototype.paramBase = function(paramId) {
        return this.currentClass().params[paramId][1];
    };
    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    /**
     * レベルアップ処理をする。
     */
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);

        // 種加算値を成長曲線を元にランダムで増やす。

        const dataClass = this.currentClass();
        for (let paramId = 0; paramId < dataClass.params.length; paramId++) {
            const table = dataClass.params[paramId];
            const prevValue = table[this._level - 1];
            const curValue = table[this._level];
            const gainBase = curValue - prevValue;
            const gainMaxValue = Math.floor(gainBase * this.paramGainRate(paramId) * 2.0);
            const gainValue = Math.randomInt(gainMaxValue);
            if (gainValue > 0) {
                this.addParam(paramId, gainValue);
            }
        }
    };

    /**
     * パラメータ上昇レート(0～5.0)を得る。
     * 
     * @param {number} paramId パラメータID
     */
    Game_Actor.prototype.paramGainRate = function(paramId) {
        const dataActor = this.actor();
        return dataActor.paramGainRate[paramId];
    };
    /**
     * レベル変更の表示をする。
     * 
     * @param {object} prevInfo レベルアップ前のステータス 
     * @param {object} curInfo レベルアップ後のステータス
     * !!!overwrite!!! Game_Actor.displayLevelChange()
     *     レベル変更時の表示をカスタマイズするため変更する。
     */
     Game_Actor.prototype.displayLevelChange = function(prevInfo, curInfo) {
        const newSkills = this.findNewSkills(prevInfo.skills);

        const text = TextManager.levelUp.format(
            this._name,
            TextManager.level,
            this._level
        );
        $gameMessage.newPage();
        $gameMessage.add(text);
        for (let paramId = 0; paramId < 8; paramId++) {
            const prevVal = prevInfo.params[paramId];
            const newVal = curInfo.params[paramId];
            if (newVal > prevVal) {
                $gameMessage.add(TextManager.param(paramId) + " +" + (newVal - prevVal));
            }
        }
        for (const skill of newSkills) {
            $gameMessage.add(TextManager.obtainSkill.format(skill.name));
        }        
    };
    /**
     * TPを初期化する。
     * 既定の実装では、0～25の間の乱数値がセットされる。
     * 
     * !!!overwrite!!! Game_Battler.initTp
     *     初期TPを乱数でなく、ゼロとするためオーバーライドする。
     */
    Game_Actor.prototype.initTp = function() {
        this.clearTp();
        const fp = _getFriendlyPoint(this);
        const initialTp = Math.max(0, Math.floor(fp * friendlyPointTpRate));
        this.setTp(Math.randomInt(initialTp));
    };

    const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    /**
     * 基本パラメータベース値を得る。
     * 
     * @param paramId {number} パラメータID
     * @returns {number} パラメータ値
     */
    Game_Actor.prototype.paramPlus = function(paramId) {
        const value = _Game_Actor_paramPlus.call(this, paramId);
        switch (paramId) {
            case 0: // MaxHP
                {
                    return value + this.vit * 3 + (this.vit >> 3) * 10;
                }
            case 1: // MaxMP
                {
                    const intmen = this.int + this.men;
                    return value + (intmen >> 2) + (intmen >> 3) * 4;
                }
            case 2: // ATK
                {
                    return value + this.str + (this.str >> 3) * 5;
                }
            case 3: // DEF
                {
                    return value + this.vit + (this.vit >> 3) * 3;
                }
            case 4: // MAT
                {
                    return value + this.int + (this.int >> 3) * 5;
                }
            case 5: // MDF
                {
                    return value + this.men + (this.men >> 3) * 3;
                }
            case 6: // AGI
                return value;
            case 7: // LUK
                return value; // LUKを返す。
        }
        return 0;
    };

    //------------------------------------------------------------------------------
    // BattleManager
    const _BattleManager_endBattle = BattleManager.endBattle;
    /**
     * 戦闘を終了させる。
     * 本メソッドを呼ぶと、フェーズが"battleEnd"に遷移し、次のupdate()でSceneManager.pop()がコールされる。
     * 
     * @param {number} result 戦闘結果(0:勝利 , 1:中断(逃走を含む), 2:敗北)
     */
    BattleManager.endBattle = function(result) {
        if (result == 0) { // 勝利時？
            for (const actor of $gameParty.allMembers()) {
                if (!actor.isDead() && (actor.actorId() != 1)) {
                    actor.gainFriendlyPoint(1, gainFriendlyPointOnBattleWin);
                }
            }
        }
        _BattleManager_endBattle.call(this, result);
    };
    //------------------------------------------------------------------------------
    // Game_Action

    const _Game_Action_multiplyDamageRate = Game_Action.prototype.multiplyDamageRate;
    /**
     * ダメージ量の乗算ボーナスレートを得る。
     * (加算・乗算用)
     * 
     * @param {Game_Battler} target ターゲット。
     * @param {boolean} critical クリティカルの場合にはtrue, それ以外はfalse
     * @returns {number} 乗算ボーナスレート
     */
    // eslint-disable-next-line no-unused-vars
    Game_Action.prototype.multiplyDamageRate = function(target, critical) {
        let rate = _Game_Action_multiplyDamageRate.call(this, target, critical);
        const subject = this.subject();
        const fp = _getFriendlyPoint(subject);
        if (fp < Game_Actor.FRIENDLY_POINT_DEFAULT) {
            const minusFp = Game_Actor.FRIENDLY_POINT_DEFAULT - fp;
            const maxMinusFp = Game_Actor.FRIENDLY_POINT_DEFAULT - Game_Actor.FRIENDLY_POINT_MIN;
            if (maxMinusFp > 0) {
                rate *= Math.max(0.01, (1.0 - minusFp / maxMinusFp));
            }
        } else if (fp > Game_Actor.FRIENDLY_POINT_DEFAULT) {
            const plusFp = fp - Game_Actor.FRIENDLY_POINT_DEFAULT;
            rate *= (1.0 + plusFp * friendlyPointDamageRate / 100.0);
        }
        return rate;
    };
    //------------------------------------------------------------------------------
    // Window_ChoiceActorList
    const _Window_ChoiceActorList_drawActorDefaultCustom = Window_ChoiceActorList.prototype.drawActorDefaultCustom;
    /**
     * 単純なアクター情報の最終行を描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {string} informationType 表示情報タイプ
     * @param {number} x 描画位置X
     * @param {number} y 描画位置Y
     * @param {number} width 幅
     */
    Window_ChoiceActorList.prototype.drawActorDefaultCustom = function(actor , informationType, x, y, width) {
        _Window_ChoiceActorList_drawActorDefaultCustom.call(this, ...arguments);
        if (informationType == "fp") {
            if (actor.actorId() != 1) {

                const fp = _getFriendlyPoint(actor);

                const labelWidth = Math.min(48, (width - 40) * 0.3);
                const paramWidth = Math.min(120, width - 40 - labelWidth - 8);
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(TextManager.frindlyPointA, x, y, labelWidth);

                this.changeTextColor(ColorManager.paramchangeTextColor(fp - Game_Actor.FRIENDLY_POINT_DEFAULT));
                this.drawText(fp, x + labelWidth + 8, y, paramWidth, "right");

                const iconId = _getFriendlyPointIconId(fp);
                if (iconId >= 0) {
                    this.drawIcon(iconId, x + labelWidth + 16 + paramWidth, y + 2);
                }
            }
        }
    };

    //------------------------------------------------------------------------------
    // Window_Status
    if (Window_Status.prototype.drawActorGuildRank) {
        /**
         * ギルドランクの代わりに友好度を表示する。
         * 
         * @param {Game_Actor} actor アクター
         * @param {number} x 描画領域左上x
         * @param {number} y 描画領域左上y
         * @param {number} width 幅
         */
        Window_Status.prototype.drawActorGuildRank = function(actor, x, y, width) {
            if (actor.actorId() != 1) {
                const fp = _getFriendlyPoint(actor);

                const labelWidth = Math.min(48, (width - 40) * 0.3);
                const paramWidth = Math.min(120, width - 40 - labelWidth - 8);
                this.changeTextColor(ColorManager.systemColor());
                this.drawText(TextManager.frindlyPointA, x, y, labelWidth);

                this.changeTextColor(ColorManager.normalColor());
                this.drawText(fp, x + labelWidth + 8, y, paramWidth, "right");

                const iconId = _getFriendlyPointIconId(fp);
                if (iconId >= 0) {
                    this.drawIcon(iconId, x + labelWidth + 16 + paramWidth, y + 2);
                }
            }
        };
    }
    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張

})();