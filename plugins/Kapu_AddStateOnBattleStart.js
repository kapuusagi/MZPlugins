/*:ja
 * @target MZ 
 * @plugindesc 戦闘開始時ステート付与プラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @help 
 * 戦闘開始時に、ノートタグで指定されたステートを付与するプラグインです。
 * 通常のステート付与と同様、リジェクトや効果ターンが適用されます。
 * 付与ステートはステート自体にも設定できますが、付与判定されるのは、
 * 戦闘開始時に持っていたステートだけです。
 * 例）ステートAにステートBを戦闘開始時付与し、
 *     ステートBにステートCを戦闘開始時付与する場合。
 *     戦闘開始時ステートAを持っている
 *      -> ステートBを付与。ステートCは付与されない。
 *     戦闘開始時ステートA,ステートBを持っている
 *      -> ステートCを付与。ステートBは付与済み。
 *     
 * 
 * ■ 使用時の注意
 * なし。
 * 
 * ■ プラグイン開発者向け
 * なし。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具/エネミー
 *     <givenStatesOnBattleStart:id#,id#,id#,...>
 *          ステート開始時に付与するステートを設定する。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 新規作成。
 */
(() => {
    //------------------------------------------------------------------------------
    // DataManager
    /**
     * ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processNoteTag = function(obj) {
        obj.givenStatesOnBattleStart = [];
        if (obj.meta.givenStatesOnBattleStart) {
            const ids = obj.meta.givenStatesOnBattleStart.split(",").map(token => Number(token) || 0);
            for (const id of ids) {
                if ((id > 0) && (id < $dataStates.length) && !obj.givenStatesOnBattleStart.includes(id)) {
                    obj.givenStatesOnBattleStart.push(id);
                }
            }
        }
    };

    DataManager.addNotetagParserActors(_processNoteTag);
    DataManager.addNotetagParserClasses(_processNoteTag);
    DataManager.addNotetagParserWeapons(_processNoteTag);
    DataManager.addNotetagParserArmors(_processNoteTag);
    DataManager.addNotetagParserStates(_processNoteTag);
    DataManager.addNotetagParserEnemies(_processNoteTag);

    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    /**
     * 戦闘開始時の処理を行う。
     * 
     * Note:このメソッドがコールされたとき、$gameParty.inBattle()はfalseを返す事に注意。
     * 
     * @param {Boolean} advantageous 有利な状態かどうか
     */
    Game_Battler.prototype.onBattleStart = function(advantageous) {
        const traitObjects = this.traitObjects();
        for (const traitObject of traitObjects) {
            if (traitObject.givenStatesOnBattleStart && (traitObject.givenStatesOnBattleStart.length > 0)) {
                for (const id of traitObject.givenStatesOnBattleStart) {
                    this.addState(id);
                }
            }
        }

        _Game_Battler_onBattleStart.call(this, advantageous);
    };
})();
