/*:ja
 * @target MZ 
 * @plugindesc TWLD基本パラメータ育成プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @base Kapu_GrowupSystem
 * @orderAfter Kapu_GrowupSystem
 * @base Kapu_Twld_BasicParams
 * @orderAfter Kapu_Twld_BasicParams
 * 
 * @help 
 * TWLD向けに作成した、基本パラメータ(STR/DEX/VIT/INT/MEN/AGI)を成長システムと結合させるプラグイン。
 * 
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
 * アクター
 *     <basicParamsGrown:str#,dex#,vit#,int#,men#,agi#>
 * 
 *         アクターの割り振り済み育成値。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_Twld_BasicParams_Growup";
    const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
        // TODO : コマンドの処理。
        // パラメータメンバは @argで指定した名前でアクセスできる。
    });

    //------------------------------------------------------------------------------
    // Game_Actor

    // 1.Game_Actor.initMembersをフックして育成データを格納する場所を追加。
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._basicParamsGrown = [0, 0, 0, 0, 0, 0];
    };

    // 2.Game_Actor.setupをフックし、ノートタグを解析して初期値を設定する処理を追加。
    //   （必要な場合）
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {Number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        const actor = $dataActors[actorId];
        if (actor.meta.basicParamsGrown) {
            const tokens = obj.meta.basicParamsGrown.split(",");
            const count = Math.min(obj.basicParams.length, tokens.length);
            for (let i = 0; i < count; i++) {
                const value = Number(tokens[i]);
                if (!isNaN(value)) {
                    obj.basicParamsGrown[i] = value;
                }
            }
        }
    };

    // 3.Game_Actorの適切なメソッドをフックし、育成データを反映する場所を追加。
    // 　例えばMaxHPならGame_Actor.paramBaseかGame_Actor.paramPlusをフックする。
    // 4.Game_Actor.resetGrowsをフックし、育成リセットを追加。
    // 5.Game_Actor.growupItemsをフックし、育成項目を返す処理を追加
    // 6.Game_Actor.applyGrowupをフックし、育成適用処理を追加。
   

})();