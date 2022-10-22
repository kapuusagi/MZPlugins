/*:ja
 * @target MZ 
 * @plugindesc アクター間 友好度プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @command lockFriendlyPoint
 * @text 友好度固定
 * @desc 指定アクターの友好度変動を停止する。
 * 
 * @arg actorId
 * @text 対象のアクター
 * @desc 対象のアクター。
 * @type actor
 * @default 0
 * 
 * @arg actorVariableId
 * @text 対象のアクター(変数指定)
 * @desc 対象のアクターを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * @arg isLock
 * @text ロック状態
 * @desc 設定するロック状態。trueにするとロック、falseにするとロック解除
 * @type boolean
 * @default false
 * 
 * @command getFriendlyPoint
 * @text 友好度取得
 * @desc 指定アクターAの、指定アクターBに対する友好度を得る。
 * 
 * @arg variableId
 * @text 友好度を格納する変数
 * @desc 友好度を格納する変数
 * @type variable
 * @default 0
 * 
 * @arg srcActorId
 * @text 取得対象のアクターA
 * @desc 取得対象のアクターA。
 * @type actor
 * @default 0
 * 
 * @arg srcActorVariableId
 * @text 取得対象のアクターA(変数指定)
 * @desc 取得対象のアクターAを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * @arg dstActorId
 * @text 対象のアクターB
 * @desc 対象のアクターB。
 * @type actor
 * @default 0
 * 
 * @arg dstActorVariableId
 * @text 対象のアクターB(変数指定)
 * @desc 対象のアクターBを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * 
 *  
 * @command setFriendlyPoint
 * @text 友好度設定
 * @desc 指定アクターAの、指定アクターBに対する友好度を設定する。
 * 
 * @arg variableId
 * @text 友好度を格納する変数
 * @desc 友好度を格納する変数
 * @type variable
 * @default 0
 * 
 * @arg srcActorId
 * @text 取得対象のアクターA
 * @desc 取得対象のアクターA。
 * @type actor
 * @default 0
 * 
 * @arg srcActorVariableId
 * @text 取得対象のアクターA(変数指定)
 * @desc 取得対象のアクターAを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * @arg dstActorId
 * @text 対象のアクターB
 * @desc 対象のアクターB。
 * @type actor
 * @default 0
 * 
 * @arg dstActorVariableId
 * @text 対象のアクターB(変数指定)
 * @desc 対象のアクターBを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * 
 * @command gainFriendlyPoint
 * @text 友好度を加減する
 * @desc 指定アクターの、指定アクターに対する友好度を変更する。
 * 
 * @arg gainValue
 * @text 加減する値
 * @desc 加減する友好度を固定値で指定する場合の値
 * @type number
 * @min -100000
 * @max -100000
 * @default 0
 * 
 * @arg variableId
 * @text 加減友好度変数ID
 * @desc 加減する友好度を変数で値を指定する場合のID
 * @type variable
 * @default 0
 * 
 * @arg srcActorId
 * @text 取得対象のアクターA
 * @desc 取得対象のアクターA。
 * @type actor
 * @default 0
 * 
 * @arg srcActorVariableId
 * @text 取得対象のアクターA(変数指定)
 * @desc 取得対象のアクターAを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * @arg dstActorId
 * @text 対象のアクターB
 * @desc 対象のアクターB。
 * @type actor
 * @default 0
 * 
 * @arg dstActorVariableId
 * @text 対象のアクターB(変数指定)
 * @desc 対象のアクターBを変数で指定する。アクターの明示指定が無い場合のみ有効。
 * @type variable
 * @default 0
 * 
 * 
 * @param paramName
 * @text パラメータ名
 * @desc パラメータ名として扱う文字列。TextManager.friendlyPointで取得できる。
 * @type string
 * @default 友好度
 * 
 * @param paramNameA
 * @text パラメータ省略名
 * @desc パラメータ省略名として扱う文字列。TextManager.friendlyPointAで取得できる。
 * @type string
 * @default FP
 * 
 * @param friendlyPointMin
 * @text 最小友好度
 * @desc 最小友好度
 * @type number
 * @default -100
 * @min -100000
 * @max 100000
 * 
 * @param friendlyPointMax
 * @text 最大友好度
 * @desc 最大友好度。最小友好度以上に設定する必要がある。
 * @type number
 * @default 100
 * @min -100000
 * @max 100000
 * 
 * @param friendlyPointDefault
 * @text デフォルト友好度
 * @desc デフォルトの友好度。最小友好度以上、最大友好度以下に設定する必要がある。
 * @type number
 * @default 0
 * @min -100000
 * @max 100000
 * 
 * 
 * @help 
 * アクター間の友好度パラメータを持たせるプラグイン。
 * アクターごとに、他のアクターに対する友好度を持たせられるだけで、
 * これ自体に効果はない。
 * 
 * パーティーが険悪な状態かどうかを判定するために使用したりできる。
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * Game_Actor.FRIENDLY_POINT_MIN
 *   最小友好度
 * Game_Actor.FRIENDLY_POINT_MAX
 *   最大友好度
 * Game_Actor.FRIENDLY_POINT_DEFAULT
 *   標準友好度
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 友好度取得
 *   アクターAの、アクターBに対する友好度を、指定した変数に取得する。
 *   $gameActors.actor(srcActorId).friendlyPoint(dstActorId);
 *   スクリプトで書くなら
 * 
 * 友好度設定
 *   アクターAの、アクターBに対する友好度を、指定した変数の値に設定する。
 *   スクリプトで書くなら
 *   $gameActors.actor(dstActorId).setFriendlyPoint(dstActorId, friendlyPoint);
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * <friendlyPoint: actorId#=value#, actorId#=value#,...>
 * <friendlyPoint: actorName$=value#, actorName$=value#,...>
 *   actorId# または acotrName$ に対する初期友好度を、value#にする
 *   actorName$ で指定した場合に、複数の同名アクターが存在する場合、
 *   該当する全アクターのIDが対象になる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    'use strict';
    const pluginName = "Kapu_FriendlyPoint";
    const parameters = PluginManager.parameters(pluginName);

    const friendlyPointParamName = parameters["paramName"] || "FriendlyPoint";
    const friendlyPointParamNameA = parameters["paramNameA"] || "FP";


    Game_Actor.FRIENDLY_POINT_MIN = Math.floor(Number(parameters["friendlyPointMin"] || -100));
    Game_Actor.FRIENDLY_POINT_MAX = Math.max(Game_Actor.FRIENDLY_POINT_MIN,
        Math.floor(Number(parameters["friendlyPointMax"] || -100)));
    Game_Actor.FRIENDLY_POINT_DEFAULT = Math.min(Game_Actor.FRIENDLY_POINT_MAX, 
        Math.max(Game_Actor.FRIENDLY_POINT_MIN, 
            Math.floor(Number(parameters["friendlyPointDefault"] || 0))));

    /**
     * アクターIDを得る。
     * 
     * @param {number} actorId アクターID
     * @param {number} variableId 変数ID
     * @returns {number} アクターID。指定が無効な場合には0を返す。
     */
    const _getTargetActor = function(actorId, variableId) {
        if ((actorId > 0) && (actorId < $dataActors.length)) {
            return actorId;
        } else {
            const id = $gameVariables.value(variableId);
            if ((id > 0) && (id < $dataActors.length)) {
                return id;
            }
        }

        return 0;
    }
    PluginManager.registerCommand(pluginName, "lockFriendlyPoint", args => {
        const actorId = _getTargetActor(Number(args.actorId), Number(args.variableId));
        const isLock = (typeof args.isLock == "undefined") ? false : (args.isLock == "true");
        if ((actorId > 0) && $gameActors.isActorDataExists(actorId)) {
            $gameActors.actor(actorId).setFriendlyPointLock(isLock);
        }
    });
    
    PluginManager.registerCommand(pluginName, "getFriendlyPoint", args => {
        const srcActorId = _getTargetActor(Number(args.srcActorId), Number(args.srcActorVariableId));
        const dstActorId = _getTargetActor(Number(args.dstActorId), Number(args.dstActorVariableId));
        const variableId = Math.floor(Number(args.variableId) || 0);
        if ($gameActors.isActorDataExists(srcActorId) // 取得元のアクターデータがある？
                && (dstActorId > 0) // 対象のアクターIDは有効？
                && (variableId > 0)) { // 格納する変数IDは有効？
            const actor = $gameActors.actor(srcActorId);
            const fp = actor.friendlyPoint(dstActorId);
            $gameVariables.setValue(variableId, fp);
        }
    });
    PluginManager.registerCommand(pluginName, "setFriendlyPoint", args => {
        const srcActorId = _getTargetActor(Number(args.srcActorId), Number(args.srcActorVariableId));
        const dstActorId = _getTargetActor(Number(args.dstActorId), Number(args.dstActorVariableId));
        const variableId = Math.floor(Number(args.variableId) || 0);
        if ($gameActors.isActorDataExists(srcActorId) // 取得元のアクターデータがある？
                && (dstActorId > 0) // 対象のアクターIDは有効？
                && (variableId > 0)) { // 格納する変数IDは有効？
            const fp = $gameVariables.value(variableId);
            const actor = $gameActors.actor(srcActorId);
            actor.setFriendlyPoint(dstActorId, fp);
        }
    });
    PluginManager.registerCommand(pluginName, "gainFriendlyPoint", args => {
        const srcActorId = _getTargetActor(Number(args.srcActorId), Number(args.srcActorVariableId));
        const dstActorId = _getTargetActor(Number(args.dstActorId), Number(args.dstActorVariableId));
        const gainValue = Math.floor(Number(args.gainValue || 0));
        const variableId = Math.floor(Number(args.variableId) || 0);
        if ($gameActors.isActorDataExists(srcActorId) // 取得元のアクターデータがある？
                && (dstActorId > 0)) { // 対象のアクターIDは有効？
            const value = (variableId > 0) ? $gameVariables.value(variableId) : gainValue;
            if (value !== 0) {
                const actor = $gameActors.actor(srcActorId);
                const fp = actor.friendlyPoint(dstActorId);
                actor.setFriendlyPoint(dstActorId, fp + value);
            }
        }
    });
    //------------------------------------------------------------------------------
    // TextManager
    /**
     * 友好度パラメータ名を得る。
     * 
     * @param {number} isShort 短縮形の場合にはtrue, それ以外はfalse.
     * @returns {string} パラメータ名
     */
    TextManager.getFriendlyPoint = function(isShort) {
        return (isShort) ? friendlyPointParamNameA : friendlyPointParamName;
    };

    /** 
     * 友好度を表すテキスト
     * @constant {string} 
     */
    Object.defineProperty(TextManager, "friendlyPoint", {
        get: function() {
            return TextManager.getFriendlyPoint(false);
        },
        configurable: true
    });
    Object.defineProperty(TextManager, "friendlyPointA", {
        get: function() {
            return TextManager.getFriendlyPoint(true);
        },
        configurable: true
    });

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._friendlyPoints = [];
        this._lockFriendlyPoints = false;
    };

    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        this.setupFriendlyPoint();
    };

    /**
     * このGame_Actorオブジェクトの友好度をセットアップする。
     */
    Game_Actor.prototype.setupFriendlyPoint = function() {
        this._friendlyPoints = [];
        const dataActor = this.actor();
        if (dataActor.meta.friendlyPoint) {
            const settings = dataActor.meta.friendlyPoint.split(',');
            for (const setting of settings) {
                const tokens = setting.trim().split('=');
                if (tokens.length >= 2) {
                    const actorId = Number(tokens[0].trim());
                    const fp = Math.floor(Number(tokens[1].trim() || Game_Actor.FRIENDLY_POINT_DEFAULT)).clamp(
                        Game_Actor.FRIENDLY_POINT_MIN, Game_Actor.FRIENDLY_POINT_MAX);
                    if (Number.isNaN(actorId)) { // 名前指定？
                        for (let id = 1; id < $dataActors.length; id++) {
                            if ($dataActors[id].name == tokens[0]) {
                                this._friendlyPoints[id] = fp;
                            }
                        }
                    } else {
                        this._friendlyPoints[actorId] = fp;
                    }
                }
            }
        }
    };

    /**
     * 友好度ロック状態を変更する。
     * 
     * @param {boolean} isLock ロック状態
     */
    Game_Actor.prototype.setFriendlyPointLock = function(isLock) {
        this._lockFriendlyPoints = isLock;
    };
    /**
     * 友好度ロック状態を得る。
     * 
     * @returns {boolean} ロック状態
     */
    Game_Actor.prototype.isFriendlyPointsLocked = function() {
        return this._lockFriendlyPoints;
    };

    /**
     * actorIdで指定されるアクターに対する友好度を得る。
     * 
     * @param {number} actorId アクターID
     * @returns {number} 友好度
     */
    Game_Actor.prototype.friendlyPoint = function(actorId) {
        return (this._friendlyPoints[actorId] != undefined) 
                ? this._friendlyPoints[actorId] : Game_Actor.FRIENDLY_POINT_DEFAULT;
    };

    /**
     * 指定アクターへの友好度を設定する。
     * 
     * @param {number} actorId アクターID
     * @param {number} fp 友好度
     */
    Game_Actor.prototype.setFriendlyPoint = function(actorId, fp) {
        if ((actorId > 0) && !this._lockFriendlyPoints) {
            this._friendlyPoints[actorId] = fp.clamp(Game_Actor.FRIENDLY_POINT_MIN, Game_Actor.FRIENDLY_POINT_MAX);
        }
    };

    /**
     * 指定アクターへの友好度を増減する。
     * 
     * @param {number} actorId アクターID
     * @param {number} gainPoint 加減する量
     */
    Game_Actor.prototype.gainFriendlyPoint = function(actorId, gainPoint) {
        if (actorId > 0) {
            const newFp = this.friendlyPoint(actorId) + gainPoint;
            this.setFriendlyPoint(actorId, newFp);
        }
    };
    //------------------------------------------------------------------------------
    // Game_Actors
    if (!Game_Actors.prototype.isActorDataExists) { // isActorDataExistsが未定義なら追加。
        /**
         * アクターデータが存在するかどうかを取得する。
         * 
         * @param {number} actorId アクターID
         * @returns {boolean} アクターデータが存在する場合にはtrue, 存在しない場合にはfalse
         */
        Game_Actors.prototype.isActorDataExists = function(actorId) {
            return this._data[actorId] ? true : false;
        };
    }    
    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();