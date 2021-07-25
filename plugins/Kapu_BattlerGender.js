/*:ja
 * @target MZ 
 * @plugindesc Game_Actor/Game_Enemyに性別を追加するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command changeActorGender
 * @text アクターの性別を変更する
 * @desc アクターの性別を変更する
 * 
 * @arg actorId
 * @text アクターID
 * @desc アクターID
 * @type actor
 * @default 0
 * 
 * @arg variableId
 * @text アクターを表す変数ID
 * @desc アクターを変数で指定する場合の変数番号。
 * @type variable
 * @default 0
 * 
 * @arg gender
 * @text 性別
 * @desc 変更する性別
 * @type select
 * @default 1
 * @option 男性
 * @value 1
 * @option 女性
 * @value 2
 * @option その他
 * @value 0
 * @option その他(両方ヒット)
 * @value 3
 * 
 * @param textGender
 * @text 性別を表すテキスト
 * @desc 性別を表すテキスト。TextManager.genderで提供される。
 * @type string
 * @default 性別
 * 
 * @param textGenderMale
 * @text 性別（男性）を表すテキスト
 * @desc 性別（男性）を表すテキスト。TextManager.genderMaleで提供される。
 * @type string
 * @default 男
 * 
 * @param textGenderFemale
 * @text 性別（女性）を表すテキスト
 * @desc 性別（女性）を表すテキスト。TextManager.genderFemaleで提供される。
 * @type string
 * @default 女
 * 
 * 
 * @param textGenderOther
 * @text 性別（その他）を表すテキスト
 * @desc 性別（その他）を表すテキスト。TextManager.genderOtherで提供される。
 * @type string
 * @default ？
 * 
 * @help 
 * アクター/エネミーに性別を追加します。
 * スクリプトでの利便性のために用意しています。
 * $gameParty.isMaleOnly() 
 *    全員男性の場合にtrue,
 * $gameParty.isFemaleOnly()
 *    全員女性の場合にtrue
 * 
 * 本プラグイン自体ではあまり意味を持ちません。
 * イベントでの判定処理や他のプラグインと組み合わせることを想定します。
 * 例) 男性だけ立ち入り禁止のメッセージを出す
 *     条件判定式で、「!$gameParty.isFemaleOnly()」の時にメッセージを出して通行不可にする。
 * 例） Kapu_EquipConditionと組み合わせる
 *     防具のノートタグに <equipCondition:!a.isMale()> とすると、
 *     男性以外が装備可能になります。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * Game_Actor/Game_Enemy
 *   gender プロパティ
 *      性別文字列を返します。ステータス画面での表示など用
 *   isMale() : boolean
 *      男性かどうかを判定して返します。
 *   isFemale() : boolean
 *      女性かどうかを判定して返します。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/エネミー
 *   <gender:str$>
 *     性別をstr$に設定する。
 *     strに指定できるのは
 *        "1", "male", 性別（男）を表すテキスト
 *           性別（男）に設定
 *        "2", "female", 性別（女）を表すテキスト
 *           性別（女）に設定
 *        "3", "both"
 *           その他(両方)に設定
 *        上記以外/未指定
 *           その他に設定
 *     プロパティgenderで文字列が取得出来る。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_BattlerGender";
    const parameters = PluginManager.parameters(pluginName);
    const textGender = parameters["textGender"] || "gender";
    const textGenderMale = parameters["textGenderMale"] || "Male";
    const textGenderFemale = parameters["textGenderFemale"] || "Female";
    const textGenderOther =  parameters["textGenderOther"] || "?";

    /**
     * 性別文字列をパースして性別値を得る。
     * 
     * @param {string} str 文字列
     * @returns {number} 性別を表す定数値
     */
    const _parseGender = function(str) {
        if ((str === "male") || (str === textGenderMale)) {
            return Game_BattlerBase.GENDER_MALE;
        } else if ((str === "female") || (str === textGenderFemale)) {
            return Game_BattlerBase.GENDER_FEMALE;
        } else if (str === "both") {
            return Game_BattlerBase.GENDER_BOTH;
        } else {
            const number = Number(str);
            if (number !== undefined) {
                if (number === Game_BattlerBase.GENDER_MALE) {
                    return Game_BattlerBase.GENDER_MALE;
                } else if (number === Game_BattlerBase.GENDER_FEMALE) {
                    return Game_BattlerBase.GENDER_FEMALE;
                } else if (number === Game_BattlerBase.GENDER_BOTH) {
                    return Game_BattlerBase.GENDER_BOTH;
                }
            }
        }
        return Game_BattlerBase.GENDER_OTHER;
    };

    PluginManager.registerCommand(pluginName, "changeActorGender", args => {
        let actor = null;
        const variableId = Number(args.variableId);
        if (variableid > 0) {
            const actorId = $gameVariables.value(variableId);
            actor = $gameActors.actor[actorId];
        } else {
            const actorId = Number(args.actorId);
            actor = $gameActors.actor[actorId];
        }
        if (actor !== null) {
            actor.changeGender(args.gender);
        }
    });

    //------------------------------------------------------------------------------
    // TextManager
    /**
     * 性別名を得る。
     * 
     * @param {number} genderNo 性別番号
     * @returns {string} 性別名
     */
    TextManager.genderText = function(genderNo) {
        switch (genderNo) {
            case Game_BattlerBase.GENDER_MALE:
                return textGenderMale;
            case Game_BattlerBase.GENDER_FEMALE:
                return textGenderFemale;
            default:
                return textGenderOther;
        }
    };

    // TextManagerプロパティ定義。
    // ちょっとわかりにくいが、getter(XXXX, id)は
    // $dataSystem.terms.XXXX[id]
    Object.defineProperties(TextManager, {
        /** 性別 */
        gender: { 
            get:function() { return textGender; }, 
        },
        /** 性別（男） */
        genderMale: {
            get:function() { return TextManager.genderText(Game_BattlerBase.GENDER_MALE); },
        },
        /** 性別（女） */
        genderFemale: {
            get:function() { return TextManager.genderText(Game_BattlerBase.GENDER_FEMALE); },
        },
        /** 性別（不明） */
        genderOther: {
            get:function() { return TextManager.genderText(Game_BattlerBase.GENDER_OTHER); },
        },
    });

    //------------------------------------------------------------------------------
    // Game_BattlerBase
    Game_BattlerBase.GENDER_OTHER = 0;
    Game_BattlerBase.GENDER_MALE = 1;
    Game_BattlerBase.GENDER_FEMALE = 2;
    Game_BattlerBase.GENDER_BOTH = 3;

    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    /**
     * Game_BattlerBaseのパラメータを初期化する。
     * Game_Enemy, Game_Battlerで独自パラメータを追加する場合、本メソッドをフックする。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._gender = Game_BattlerBase.GENDER_OTHER;
    };
    Object.defineProperty(Game_BattlerBase.prototype, "gender", {
        get: function() { return TextManager.genderText(this._gender); },
        configurable: true
    });

    /**
     * 男性かどうかを判定する。
     * 
     * @returns {boolean} 男性の場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.isMale = function() {
        // Note : ビット比較の方がパフォーマンスが良いけれど、変更されても良いように一致判定させる。
        return (this._gender === Game_BattlerBase.GENDER_MALE) || (this._gender === Game_BattlerBase.GENDER_BOTH);
    };

    /**
     * 女性かどうかを判定する。
     * 
     * @returns {boolean} 男性の場合にはtrue, それ以外はfalse.
     */
    Game_BattlerBase.prototype.isFemale = function() {
        // Note : ビット比較の方がパフォーマンスが良いけれど、変更されても良いように一致判定させる。
        return (this._gender === Game_BattlerBase.GENDER_FEMALE) || (this._gender === Game_BattlerBase.GENDER_BOTH);
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initEquips = Game_Actor.prototype.initEquips;
    /**
     * 装備を初期化する。
     * 
     * @param {Array<Number>} equips 装備品ID配列
     * 
     * Note: Game_Actor.setup()で実装する方がわかりやすいが、
     *       装備条件に含まれることを考慮してinitEquipsの前に行うようにした。
     */
    Game_Actor.prototype.initEquips = function(equips) {
        const dataActor = this.actor();
        if (dataActor.meta.gender) {
            this._gender = _parseGender(dataActor.meta.gender);
        }
        _Game_Actor_initEquips.call(this, equips);
    };

    /**
     * 性別を変更する。
     * 
     * @param {object} gender 性別文字列or性別番号
     */
    Game_Actor.prototype.changeGender = function(gender) {
        this._gender = _parseGender(gender);
        this.refresh();
    };
    //------------------------------------------------------------------------------
    // Game_Enemy
    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    /**
     * エネミーをセットアップする。
     * 
     * @param {number} enemyId エネミーID
     * @param {number} x X位置
     * @param {number} y Y位置
     */
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        const dataEnemy = this.enemy();
        if (dataEnemy.meta.gender) {
            this._gender = _parseGender(dataEnemy.meta.gender);
        }
    };

    //------------------------------------------------------------------------------
    // Game_Unit
    /**
     * 全員男性かどうかを判定する。
     * 
     * @returns {boolean} 全員男性の場合にはtrue, それ以外はfalse.
     */
    Game_Unit.prototype.isMaleOnly = function() {
        return this.allMembers().every(member => member.isMale());
    };

    /**
     * 全員女性かどうかを判定する。
     * 
     * @returns {boolean} 全員女性の場合にはtrue, それ以外はfalse
     */
    Game_Unit.prototype.isFemaleOnly = function() {
        return this.allMembers().every(member => member.isFemale());
    };

    /**
     * 男性メンバーを得る。
     * 
     * @returns {Array<Game_BattlerBase>} 男性メンバー
     */
    Game_Unit.prototype.maleMembers = function() {
        return this.allMembers().filter(member => member.isMale());
    };
    /**
     * 女性メンバー
     * 
     * @returns {Array<Game_BattlerBase>} 女性メンバー
     */
    Game_Unit.prototype.femaleMembers = function() {
        return this.allMembers().filter(member => member.isFemale());
    };


})();
