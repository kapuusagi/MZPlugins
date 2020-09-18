/*:ja
 * @target MZ 
 * @plugindesc Twld向けに作成した戦闘システムの変更
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * ■ setFvBattler
 * @command setFvBattler
 * @text アクター戦闘グラフィック設定
 * @desc 戦闘中に表示するグラフィックを設定する。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 変更するアクターのID
 * @type actor
 * 
 * @arg fileName
 * @text ファイル名
 * @desc 設定する画像ファイル
 * @type file
 * @dir pictures
 * 
 * @param maxBattleMembers
 * @text 最大戦闘参加人数
 * @desc 戦闘に参加可能な人数の最大値。
 * @default 6
 * @type number
 * @min 1
 * @max 6
 * 
 * @help 
 * 
 * ■ 使用時の注意
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <fvBattlerName:pictureName$>
 *        フロントビューで表示するアクターの画像。picturesフォルダの下から引っ張ってくる。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = 'Kapu_TwldBattleSystem';
    const parameters = PluginManager.parameters(pluginName);
    const _maxBattleMembers = Number(parameters['maxBattleMembers']) || 4;

    PluginManager.registerCommand(pluginName, 'setFvBattler', args => {
        const actorId = args.actorId;
        const fileName = args.fileName;
        if (actorId) {
            $gameActors.actor(actorId).setFvBattlerName(fileName);
        }
    });

    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;

    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this, ...arguments);
        this._fvBattlerName = '';
    };
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        const actor = $dataActors[actorId];
        if (actor.meta.fvBattlerName) {
            this.setFvBattlerName(actor.meta.fvBattlerName);
        }
    };

    /**
     * フロントビュー戦闘グラフィックファイル名を取得する。
     * 
     * @return {String} フロントビュー戦闘グラフィックファイル名。
     */
    Game_Actor.prototype.fvBattlerName = function() {
        return this._fvBattlerName;
    };

    /**
     * フロントビュー戦闘グラフィックファイル名を設定する。
     * 
     * @param {String} pictureName フロントビュー戦闘グラフィックファイル名。
     */
    Game_Actor.prototype.setFvBattlerName = function(pictureName) {
        this._fvBattlerName = pictureName;
        $gameTemp.requestBattleRefresh();
    };

    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * 最大戦闘参加メンバー数を得る。
     * @return {Number} 最大戦闘参加メンバー数が返る。
     */
    Game_Party.prototype.maxBattleMembers = function() {
        return _maxBattleMembers;
    };

    //------------------------------------------------------------------------------
    // Sprite_ActorHud

    function Sprite_ActorHud() {
        this.initialize(...arguments);
    };

    Sprite_ActorHud.prototype = Object.create(Sprite_Battler.prototype);
    Sprite_ActorHud.prototype.constructor = Sprite_ActorHud;

    Sprite_ActorHud.prototype.initialize = function(battler) {
        Sprite_Battler.prototype.initialize.call(this, battler);
    };

    Sprite_ActorHud.prototype.initMembers = function() {
        Sprite_Battler.prototype.initMembers.call(this);
        this.createFvBattlerSprite();
    };

    Sprite_ActorHud.prototype.createFvBattlerSprite = function() {
        this._fvBattlerSprite = new Sprite();
        this.addChild(this._fvBattlerSprite);
    };

    Sprite_ActorHud.prototype.mainSprite = function() {
        return this._fvBattlerSprite;
    };

    Sprite_ActorHud.prototype.setBattler = function(battler) {
        Sprite_Battler.prototype.setBattler.call(this, battler);
        if (battler !== this._actor) {
            this._actor = actor;
            if (battler) {
                this.setHudPosition(battler.index());
            } else {
                this._fvBattlerName.bitmap = null;
            }
        }
    };

    
    Sprite_ActorHud.prototype.setHudPosition = function(index) {

    };

    Sprite_ActorHud.prototype.update = function() {
        Sprite_Battler.prototype.update.call(this);
        if (this._actor) {
            // 更新
        }
    };



    //------------------------------------------------------------------------------
    // Spriteset_Battle

    const _Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors;

    /**
     * アクターのスプライトを作成する。
     */
    Spriteset_Battle.prototype.createActors = function() {
        _Spriteset_Battle_createActors.call(this, ...arguments);
        this._actorHudSprites = [];
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            const sprite = new SpriteActorHud();
            this.push(sprite);
        }
    };

    const _Spriteset_Battle_updateActors = Spriteset_Battle.prototype.updateActors;
    /**
     * アクターのスプライトを更新する。
     */
    Spriteset_Battle.prototype.updateActors = function() {
        _Spriteset_Battle_updateActors.call(this, ...arguments);

        const members = $gameParty.maxBattleMembers();
        for (let i = 0; i < this._actorHudSprites.length; i++) {
            this._actorHudSprites[i].setBattler(members[i]);
        }
    };

    const _Spriteset_Battle_findTargetSprite = Spriteset_Battle.prototype.findTargetSprite;
    /**
     * ターゲットに対応するSpriteを取得する。
     * 派生クラスにて実装する事。
     * 
     * @param {Object} target ターゲット(Game_BattlerBaseオブジェクト)
     * @return {Sprite} 対象のスプライト
     */
    Spriteset_Battle.prototype.findTargetSprite = function(target) {
        const target = _Spriteset_Battle_findTargetSprite.call(this, target);
        if (target !== null) {
            return target;
        } else {
            return this._actorHudSprites.find(sprite => sprite.checkBattler(target));
        }
    };

    const _Spriteset_Battle_isEffecting = Spriteset_Battle.prototype.isEffecting;

    /**
     * エフェクト処理中かどうかを判定する。
     * 
     * @return {Boolean} エフェクト処理中の場合にはtrue, それ以外はfalse
     */
    Spriteset_Battle.prototype.isEffecting = function() {
        return _Spriteset_Battle_isEffecting.call(this) 
            || this._actorHudSprites.some(sprite => sprite.isEffecting());
    };

    // TODO : Window_BattleActorStatusか何かを削除。
    //        全部Spriteでやる。
})();