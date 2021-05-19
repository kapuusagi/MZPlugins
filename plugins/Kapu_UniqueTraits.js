/*:ja
 * @target MZ 
 * @plugindesc アクター固有特性を追加/削除できるようにするプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @command addUniqueTrait
 * @text アクター特性追加
 * @desc アクターの特性を追加する。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 追加するアクターのID
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 追加するアクターIDを変数から取得する場合のID
 * @type variable
 * 
 * @arg name
 * @text 特性識別名
 * @desc 追加する特性の識別名。（削除で使用する）
 * @type string
 * 
 * @arg code
 * @text コード
 * @desc 追加する特性のコード。
 * @type number
 * @default 0
 * 
 * @arg dataId
 * @text データID
 * @desc 追加する特性のデータID。
 * @type number
 * @default 0
 * 
 * @arg number
 * @text 値
 * @desc 追加する特性の値。
 * @type number
 * @default 0
 * @decimals 3
 * 
 * ■ removeUniqueTrait
 * @command removeUniqueTrait
 * @text アクター特性削除
 * @desc アクターの特性を削除する。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 追加するアクターのID
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 追加するアクターIDを変数から取得する場合のID
 * @type variable
 * 
 * @arg name
 * @text 特性識別名
 * @desc 追加する特性の識別名。（削除で使用する）
 * @type string
 * 
 * @help 
 * アクター固有特性を追加/削除できるようにします。
 * 
 * ベーシックシステムではクラスや装備品、ステートにより特性を取り外しできますが、
 * アクターの特性はデータベースで指定したものだけで、追加・削除できません。
 * 
 * ■ 使用時の注意
 * 特にありません。
 * 
 * ■ プラグイン開発者向け
 * 特にありません。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * addUniqueTrait
 *     ユニーク特性を追加する。
 * 
 * removeUniqueTrait
 *     ユニーク特性を削除する。
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */
(() => {
    const pluginName = "Kapu_UniqueTraits";

    /**
     * 引数からアクターIDを得る。
     * 
     * @param {Object} arg 引数
     * @returns {Number} アクターID
     */
    const _getActorId = function(arg) {
        const id = Number(arg.actorId) || 0;
        if (id > 0) {
            return id;
        }
        const variableId = Number(arg.variableId) || 0;
        if (variableId > 0) {
            return $gameVariables[variableId];
        }
        return 0;
    };

    PluginManager.registerCommand(pluginName, "addUniqueTrait", args => {
        const actorId = _getActorId(args);
        const name = args.name;
        const code = Number(args.code);
        const dataId = Number(args.dataId);
        const value = Number(args.value) || 0;
        if (actorId > 0) {
            const actor = $gameActors.actor(actorId);
            if (actor) {
                if (name && !isNaN(code) && !isNaN(dataId) && !isNaN(value)) {
                    actor.addUniqueTrait(name, {
                        code:code,
                        dataId:dataId,
                        value:value
                    });
                }
            }
        }
    });

    PluginManager.registerCommand(pluginName, "removeUniqueTrait", args => {
        const actorId = _getActorId(args);
        const name = args.name;
        if (actorId > 0) {
            const actor = $gameActors.actor(actorId);
            if (actor) {
                actor.removeUniqueTraits(name);
            }
        }
    });

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._uniqueTraitObjects = [];
    };

    /**
     * 固有特性を追加する。
     * 既にnameで指定された特性が追加済みの場合には何もしない。
     * 
     * 固有特性はステートクリアで消去されない特性。
     * 
     * @param {String} name 識別名
     * @param {Trait} trait 特性オブジェクト
     */
    Game_BattlerBase.prototype.addUniqueTrait = function(name, trait) {
        const traitObject = this._uniqueTraitObjects.find(obj => obj.name === name);
        if (!traitObject) {
            this._uniqueTraitObjects.push({ 
                name:name,
                traits:[ trait ]
            });
            this.refresh();
        }
    };
    /**
     * 指定した名前の特性を削除する。
     * 
     * @param {String} name 特性識別名
     */
    Game_BattlerBase.prototype.removeUniqueTraits = function(name) {
        // 削除するとインデックスが繰り下がるので、後ろから一致判定する。
        for (let i = this._uniqueTraitObjects.length - 1; i >= 0; i--) {
            if (this._uniqueTraitObjects[i].name === name) {
                this._uniqueTraitObjects.splice(i, 0);
                this.refresh();
            }
        }
    };

    /**
     * 固有特性配列を得る。
     * 
     * @note このメソッドの返値を変更しても、Game_BattlerBaseのもつ固有特性は変化しない。
     * @returns {Array<Trait>} 特性配列。
     */
    Game_BattlerBase.prototype.uniqueTraitObjects = function() {
        return this._uniqueTraitObjects.slice(0);
    };

    const _Game_BattlerBase_traitObjects = Game_BattlerBase.prototype.traitObjects;
    /**
     * このGame_BattlerBaseの、全ての特性値を持つオブジェクトを取得する。
     * 
     * @returns {Array<TraitObject>} 特性(Trait)を持つオブジェクトの配列
     */
    Game_BattlerBase.prototype.traitObjects = function() {
        return _Game_BattlerBase_traitObjects.call(this).concat(this.uniqueTraitObjects());
    };
})();
