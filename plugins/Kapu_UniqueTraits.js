/*:ja
 * @target MZ 
 * @plugindesc アクター固有特性を追加/削除できるようにするプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * ■ addUniqueTrait
 * @command addUniqueTrait
 * @text アクター特性追加
 * @desc アクターの特性を追加する。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 追加するアクターのID
 * @type actor
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
 * @arg actorId
 * @text アクターID
 * @desc 追加するアクターのID
 * @type actor
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
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_UniqueTraits";

    PluginManager.registerCommand(pluginName, "addUniqueTrait", args => {
        const actorId = Number(arg.actorId);
        const name = arg.name;
        const code = Number(arg.code);
        const dataId = Number(arg.dataId);
        const value = Number(arg.value);
        if (actorId > 0) {
            const actor = $gameActors.actor(actorId);
            if (actor) {
                if (name && !IsNaN(code) && !IsNaN(dataId) && !isNaN(value)) {
                    actor.addUniqueTrait(name, {
                        code:code,
                        dataId:dataId,
                        value:value
                    });
                }
            }
        }
    });

    PluginManager.registerCommand(pluginName, "removeUniqueTrait", arg => {
        const actorId = Number(arg.actorId);
        const name = arg.name;
        if (actorId > 0) {
            const actor = $gameActors.actor(actorId);
            if (actor) {
                actor.removeUniqueTraits(name);
            }
        }
    });

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call();
        this._uniqueTraitObjects = [];
    };

    /**
     * 固有特性を追加する。
     * 既にnameで指定された特性が追加済みの場合には何もしない。
     * 
     * 固有特性はステートクリアで消去されない特性。
     */
    Game_BattlerBase.prototype.addUniqueTrait = function(name, trait) {
        const traitObject = this._uniqueTraitObjects.find(obj => obj.name === name);
        if (traitObject === null) {
            this._uniqueTraitObjects.push({ 
                name:name,
                traits:[ trait ]
            });
        }
    };
    /**
     * 指定した名前の特性を削除する。
     */
    Game_BattlerBase.prototype.removeUniqueTraits = function(name) {
        // 削除するとインデックスが繰り下がるので、後ろから一致判定する。
        for (let i = this._uniqueTraitObjects.length; i >= 0; i--) {
            if (this._uniqueTraitObjects[i].name === name) {
                this._uniqueTraitObjects.splice(i, 0);
            }
        }
    };

    /**
     * 固有特性配列を得る。
     * 
     * @note このメソッドの返値を変更しても、Game_BattlerBaseのもつ固有特性は変化しない。
     * @return {Array<Trait>} 特性配列。
     */
    Game_BattlerBase.prototype.uniqueTraitObjects = function() {
        return this._uniqueTraitObjects.slice(0);
    };

    const _Game_BattlerBase_traitObjects = Game_BattlerBase.prototype.traitObjects;
    /**
     * このGame_BattlerBaseの、全ての特性値を持つオブジェクトを取得する。
     * 
     * @return {Array<TraitObject>} 特性(Trait)を持つオブジェクトの配列
     */
    Game_BattlerBase.prototype.traitObjects = function() {
        return _Game_BattlerBase_traitObjects.call(this).concat(this.uniqueTraitObjects());
    };
})();