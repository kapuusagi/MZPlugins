/*:ja
 * @target MZ 
 * @plugindesc イベントのページに、カスタムの適用条件を追加するプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * イベントのページに、カスタムの適用条件を追加します。
 * 使用する場合、各ページの一番最初に「注釈」を入れ、
 * CustomCondition: eval$
 * とします。ページ先頭に複数のCustomConditionを入れることができます。
 * 
 * ■ 使用時の注意
 * evalは重い処理なので、入れすぎるとゲーム自体が重くなります。
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
    'use strict';
    // const pluginName = "Kapu_EventCustomCondition";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    //------------------------------------------------------------------------------
    // Game_Event
    const _Game_Event_meetsConditions = Game_Event.prototype.meetsConditions;
    /**
     * このイベントのページ適用条件を満たしているかどうかを判定する。
     * 
     * @param {DataPage} page ページデータ
     * @returns {boolean} 適用条件を満たしている場合にはtrue, それ以外はfalse.
     */
    Game_Event.prototype.meetsConditions = function(page) {
        return _Game_Event_meetsConditions.call(this, page)
                && this.meetsCustomCondition(page);
    };

    /**
     * このイベントのカスタムページ適用条件を満たしているかどうかを判定する。
     * 
     * @param {DataPage} page ページデータ
     * @returns {boolean} 適用条件を満たしている場合にはtrue, それ以外はfalse.
     */
    Game_Event.prototype.meetsCustomCondition = function(page) {
        for (let index = 0; index < page.list.length; index++) {
            const command = page.list[index];
            if ((command.code === 108) || (command.code === 408)) { // 注釈行？
                if (command.parameters[0].startsWith("CustomCondition:")) {
                    try {
                        const evalStr = command.parameters[0].slice(16);
                        const meets = !!eval(evalStr);
                        if (!meets) { // カスタム条件不一致？
                            return false;
                        }
                    }
                    catch (e) {
                        console.error("meetsCustomConditon error:" + e);

                    }
                }
            } else {
                break;
            }
        }

        return true;
    };

})();