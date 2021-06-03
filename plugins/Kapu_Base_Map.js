/*:ja
 * @target MZ 
 * @plugindesc マップ関連のベース機能プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @param surpriseRateFast
 * @text 先制攻撃率（早）
 * @desc エネミーよりパーティーの速度が速い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.05
 * @min 0.00
 * @max 1.00
 * 
 * @param surpriseRateLate
 * @text 先制攻撃率（遅）
 * @desc エネミーよりパーティーの速度が遅い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.03
 * @min 0.00
 * @max 1.00
 *  
 * @param preemptiveRateFast
 * @text 先制攻撃率（早）
 * @desc エネミーよりパーティーの速度が速い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.05
 * @min 0.00
 * @max 1.00
 * 
 * @param preemptiveRateLate
 * @text 先制攻撃率（遅）
 * @desc エネミーよりパーティーの速度が遅い場合の先制攻撃率
 * @type number
 * @decimals 2
 * @default 0.03
 * @min 0.00
 * @max 1.00
 * 
 * @param encounterProgressValueNormal
 * @text エンカウント進捗度(通常)
 * @desc エンカウント進捗度(通常)。1歩毎にこの進捗度を元にした値に補正値がかかったものだけ進む。
 * @type number
 * @decimals 2
 * @default 1.00
 * @min 0
 * 
 * 
 * @param encounterProgressValueBush
 * @text エンカウント進捗度(茂み)
 * @desc エンカウント進捗度(茂み)。1歩毎にこの進捗度を元にした値に補正値がかかったものだけ進む。
 * @type number
 * @descimals 2
 * @default 2.00
 * @min 0
 * 
 * @help 
 * 本プラグイン自体にベーシックシステムからの拡張機能は無い。
 * 他のプラグインと競合を避けるために提供されます。
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
    const pluginName = "Kapu_Base_Map";
    const parameters = PluginManager.parameters(pluginName);
    const surpriseRateLate = Math.min(1, Math.max(0, (Number(parameters["surpriseRateLate"]) || 0.05)));
    const surpriseRateFast = Math.min(surpriseRateLate, Math.max(0, (Number(parameters["surpriseRateFast"]) || 0.03)));
    const preemptiveRateFast = Math.min(1, Math.max(0, (Number(parameters["preemptiveRateFast"]) || 0.05)));
    const preemptiveRateLate = Math.min(preemptiveRateFast, Math.max(0, (Number(parameters["preemptiveRateLate"]) || 0.03)));
    const encounterProgressValueNormal = Number(parameters["encounterProgressValueNormal"]) || 1;
    const encounterProgressValueBush = Number(parameters["encounterProgressValueBush"]) || 0;
    //------------------------------------------------------------------------------
    // Game_Map

    /**
     * マップの基本不意打ち率を得る。
     * 
     * @returns {number} 不意打ち率
     */
    Game_Map.prototype.rateSurprise = function() {
        return 0;
    };
    /**
     * マップの基本先制率を得る。
     * 
     * @returns {number} 先制率
     */
    Game_Map.prototype.ratePreemptive = function() {
        return 0;
    };

    /**
     * ランダムエンカウント進捗度を得る。
     * 
     * @param {number} x アクターのx位置
     * @param {number} y アクターのy位置
     * @returns {number} 進捗度
     */
    Game_Map.prototype.encounterProgressValue = function(x, y) {
        return this.encounterProgressValueOfPosition(x, y);
    };

    /**
     * 位置によるランダムエンカウント進捗度を得る。
     * 
     * @param {number} x アクターのx位置
     * @param {number} y アクターのy位置
     * @returns {number} 進捗度
     */
    Game_Map.prototype.encounterProgressValueOfPosition = function(x, y) {
        return this.isBush(x, y) ? encounterProgressValueBush : encounterProgressValueNormal;
    };

    /**
     * troopIdで指定するエネミーグループに接敵する可能性があるかどうかを得る。
     * 
     * @param {number} troopId エネミーグループID
     * @returns {boolean} 接敵する可能性がある場合にはtrue, それ以外はfalse.
     */
    Game_Map.prototype.testEncountCondition = function(troopId) {
        const dataTroop = $dataTroops[troopId];
        if (dataTroop) {
            for (let i = 0; i < dataTroop.members.length; i++) {
                const member = dataTroop.members[i];
                if (!member.hidden && this.isEncountToEnemy(member.enemyId)) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * enemyIdで指定されるエネミーと遭遇するかどうかを判定する。
     * 
     * @param {number} enemyId エネミーID
     * @returns {boolean} 遭遇する場合にはtrue, 遭遇しない場合にはfalse.
     */
    // eslint-disable-next-line no-unused-vars
    Game_Map.prototype.isEncountToEnemy = function(enemyId) {
        return true;
    };




    //------------------------------------------------------------------------------
    // Game_Player
    const _Game_Player_initMembers = Game_Player.prototype.initMembers;
    /**
     * メンバーを初期化する。
     * 
     * Note: 基底クラスのコンストラクタから呼び出される。
     */
    Game_Player.prototype.initMembers = function() {
        _Game_Player_initMembers.call(this);
        this._prevRegionId = 0;
        this._prevMapId = 0;
    };

    const _Game_Player_update = Game_Player.prototype.update;
    /**
     * Game_Playerオブジェクトを更新する。
     * 
     * @param {boolean} sceneActive シーンがアクティブな場合にはtrue, それ以外はfalse
     */
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        if (sceneActive) {
            const regionId = this.regionId();
            const mapId = $gameMap.mapId();
            if ((regionId !== this._prevRegionId) || (mapId !== this._prevMapId)) {
                this.onRegionChanged();
                this._prevRegionId = regionId;
                this._prevMapId = mapId;
            }
        }
    };

    /**
     * プレイヤーのリージョンが変わったときの処理を行う。
     */
    Game_Player.prototype.onRegionChanged = function() {

    };

    /**
     * エンカウント進捗度を得る。
     * Note: 歩行毎に _encounterCount を本カウントだけ減算し、0になったらエンカウントする。
     * 
     * @returns {number} エンカウント進捗度
     * !!!overwrite!!! Game_Player.encounterProgressValue()
     *     基本エンカウント率をマップから取得出来るように拡張するため、オーバーライトする。
     */
    Game_Player.prototype.encounterProgressValue = function() {
        value = $gameMap.encounterProgressValue(this.x, this.y);
        if ($gameParty.hasEncounterHalf()) {
            value *= 0.5;
        }
        if (this.isInShip()) {
            value *= 0.5;
        }
        return value;
    };

    const _Game_Player_meetsEncounterConditions = Game_Player.prototype.meetsEncounterConditions;
    /**
     * encounterで指定するうグループにエンカウントするかどうかを得る。
     * 
     * @param {object} encounter エンカウントデータ
     * @returns {boolean} エンカウントする場合にはtrue, エンカウントしない場合にはfalse.
     */
    Game_Player.prototype.meetsEncounterConditions = function(encounter) {
        return _Game_Player_meetsEncounterConditions.call(this, encounter)
            && $gameMap.testEncountCondition(encounter.troopId)
    };
    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * このパーティーの不意打ち率を得る。
     * 
     * @param {number} troopAgi 不意打ち率
     * @returns {number} 不意打ち率
     * !!!overwrite!!! Game_Party.rateSurprise
     */
    Game_Party.prototype.rateSurprise = function(troopAgi) {
        let rate = 0;
        if (!this.hasCancelSurprise()) {
            rate = this.agility() >= troopAgi ? surpriseRateFast : surpriseRateLate;
            rate += $gameMap.rateSurprise();
            rate += this.rateSurpriseOfParty();
        }
        return rate;
    };

    /**
     * パーティー特製による不意打ち率補正値を得る。
     * 
     * @returns {number} 不意打ち率補正値
     */
    Game_Party.prototype.rateSurpriseOfParty = function() {
        return 0;
    };

    /**
     * このパーティーの先制攻撃率を得る。
     * 
     * @param {number} troopAgi 的グループのAGI
     * @returns {number} 先制攻撃率
     * !!!overwrite!!! Game_Party.ratePreemptive
     */
    Game_Party.prototype.ratePreemptive = function(troopAgi) {
        let rate = this.agility() >= troopAgi ? preemptiveRateFast : preemptiveRateLate;
        rate += $gameMap.ratePreemptive();
        rate += this.ratePreemptiveOfParty();
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    };

    /**
     * パーティーの先制攻撃率補正値を得る。
     * 
     * @returns {number} 先制攻撃率補正値
     */
    Game_Party.prototype.ratePreemptiveOfParty = function() {
        return 0;
    };
})();