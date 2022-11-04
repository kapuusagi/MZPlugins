/*:ja
 * @target MZ 
 * @plugindesc 身代わり条件プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * 身代わり条件を拡張します。
 * ベースシステムでの身代わり発動条件は、
 * 「被対象が瀕死で、必中スキルが使われていない場合」
 * になっています。
 * 
 * 本プラグインでは以下のように拡張します。
 * ・身代わり発動条件を設定
 * ・スキルに身代わり対象への切り替えを禁止する設定を追加。
 *   <denySubstitute>ノートタグを参照。
 *   未指定時は身代わり許可。
 * 
 * 使用方法
 * 特徴に「特殊フラグ：かばう」をつけたアクター/クラス/武器/防具/ステートのノートタグに
 * <substituteCondition>ノートタグを付けます。
 * 
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
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * スキル/アイテム
 *   <denySubstitute>
 *     このスキルまたはアイテムの対象になったとき、身代わりを禁止します。
 * 
 * アクター/クラス/武器/防具/ステート/エネミー
 *   <substituteCondition:eval$>
 *     身代わり条件をeval$にする。
 *     未指定時はベースシステムの条件(b.isDying())と一致。
 *     別途特徴に「特殊フラグ：かばう」をセットしておく必要がある。
 *     
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    'use strict';
    // const pluginName = "Kapu_SubstituteCondition";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });

    //------------------------------------------------------------------------------
    // Game_BattlerBase

    const _isSubstituteTarget = function(traitObj, a, b) {
        if (traitObj.meta.substituteCondition) {
            try {
                return !!eval(traitObj.meta.substituteCondition);
            }
            catch (e) {
                console.error("isSubstituteTarget error : " + e);
                return false;
            }
        } else {
            return b.isDying(); // 既定の条件を適用
        }
    };

    /**
     * battlerで指定されるバトラーの代理になれるかどうかを判定する。
     * 
     * @param {Game_BattlerBase} battler バトラー
     * @returns {boolean} 代理になれる場合にはtrue, それ以外はfalse.
     */
    Game_BattlerBase.prototype.testSubstituteTarget = function(battler) {
        if (this.canMove()) {
            const traitObjects = this.traitObjects().filter(function(obj) {
                return obj.traits.some(function(trait) {
                    return (trait.code === Game_BattlerBase.TRAIT_SPECIAL_FLAG)
                        && (trait.dataId === Game_BattlerBase.FLAG_ID_SUBSTITUTE);
                });
            });

            if (traitObjects.length > 0) {
                for (const traitObj of traitObjects) {
                    if (_isSubstituteTarget(traitObj, this, battler)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    //------------------------------------------------------------------------------
    // BattleManager
    const _BattleManager_applySubstitute = BattleManager.applySubstitute;
    /**
     * （ダメージなどの）代理メンバーに入れ替える。
     * 
     * @param {Game_BattlerBase} target 交換するメンバー
     * @returns {Game_BattlerBase} 代理メンバー
     */
    BattleManager.applySubstitute = function(target) {
        if (this._action.item().meta.denySubstitute) { // 代理メンバー禁止？
            return target;
        } else {
            const substitutes = [];
            for (const member of target.friendsUnit().members()) {
                if ((member !== target) // targetでない。
                        && member.testSubstituteTarget(target)) { // 代理になることが可能なメンバー
                    substitutes.push(member);
                }
            }

            // 代理が可能になることが可能なメンバーで、最もHPが高いバトラーを返す。
            if (substitutes.length > 1) {
                let substitute = substitutes[0];
                for (let i = 1; i < substitutes.length; i++) {
                    if (substitutes[i].hp > substitute.hp) {
                        substitute = substitutes[i];
                    }
                }
                this._logWindow.displaySubstitute(substitute, target);
                return substitute;
            } else if (substitutes.length === 1) {
                const substitute = substitutes[0];
                this._logWindow.displaySubstitute(substitute, target);
                return substitute;
            } else {
                return _BattleManager_applySubstitute.call(this, target);
            }
        }
    };

    //------------------------------------------------------------------------------
    // TODO : メソッドフック・拡張


})();