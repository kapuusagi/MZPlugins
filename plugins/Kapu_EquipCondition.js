/*:ja
 * @target MZ 
 * @plugindesc 装備条件プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * 
 * @help 
 * 装備条件の判定にカスタム式を指定するためのプラグイン。
 * 例えば、 a.actorId() === 3 とかすると、
 * アクターIDが3のアクターしか装備できなくなります。
 * クラスで装備可能品を分けるのは有効な手段ですが、
 * ベーシックシステムでのスキルの装備タイプ制限は2つまでしか指定出来ないので、
 * 武器タイプを分けたくない場合もあります。
 * 
 * 
 * ■ 使用時の注意
 * 式を多用しすぎると、装備画面を開こうとしたときに処理が重くなります。
 * 
 * ■ プラグイン開発者向け
 * ありません。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 武器/防具
 *      <equipCondition:eval$>
 *          evalを装備条件として使用します。
 *          複数指定した場合、or条件として使用されます。
 *          a がアクターになります。
 *          例）
 *            <equipCondition:a.agi>=20>
 *               AGIが20以上ある場合のみ装備可能
 *            <equipCondition:(a.def>=20)&&(a.agi>=20)>
 *               防御力が20以上、AGIが20以上ある場合のみ装備可能
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 TWLD向けに作ったものから抜粋。
 */
(() => {
    //const pluginName = "Kapu_EquipCondition";
    //const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * itemの特性にvalueStrのキャストタイム倍率を加減する特性を追加する。
     * 
     * @apram {TraitObject} obj Actor/Class/Weapon/Armor/State/Enemyのいずれか。traitsを持ってるデータ
     */
    const _processNotetag = function(obj) {
        obj.equipConditions = [];
        const pattern = /<equipCondition:(.*)+>/;
        const lines = obj.note.split(/[\r\n]+/);
        for (line of lines) {
            const re = line.match(pattern);
            if (re) {
                const cond = re[1].trim();
                if (cond) {
                    obj.equipConditions.push(cond);
                }
            }
        }
    };

    DataManager.addNotetagParserWeapons(_processNotetag);
    DataManager.addNotetagParserArmors(_processNotetag);



    //------------------------------------------------------------------------------
    // Game_BattlerBase

    const _Game_BattlerBase_canEquipWeapon = Game_BattlerBase.prototype.canEquipWeapon;
    /**
     * 武器が装備可能かどうかを取得する。
     * 
     * @param {Object} item DataWeaponオブジェクト
     * @return {Boolean} 装備可能な場合にはtrue, それ以外はfalseが返る。
     */
    Game_BattlerBase.prototype.canEquipWeapon = function(item) {
        return _Game_BattlerBase_canEquipWeapon.call(this, item)
                && this.meetsEquipCondition(item);
    };

    const _Game_BattlerBase_canEquipArmor = Game_BattlerBase.prototype.canEquipArmor;
    /**
     * 防具が装備可能かどうかを取得する。
     * 
     * @param {Object} item DataArmorオブジェクト
     * @return {Boolean} 装備可能な場合にはtrue, それ以外はfalseが返る。
     */
    Game_BattlerBase.prototype.canEquipArmor = function(item) {
        return _Game_BattlerBase_canEquipArmor.call(this, item)
                && this.meetsEquipCondition(item);
    };

    /**
     * itemが装備可能かどうかを取得する。
     * 
     * @param {Object} item アイテム
     * @return {Boolean} 装備可能な場合にはtrue, それ以外はfalseが返る。
     */
    Game_BattlerBase.prototype.meetsEquipCondition = function(item) {
        if (item.equipConditions && (item.equipConditions.length > 0)) {
            return this.testEquipCondition(item);
        } else {
            return true;
        }
    };

    /**
     * 装備可能条件をテストする。
     * 
     * @param {Object} item WeaponまたはArmor
     * @return {Boolean} 装備可能条件を1つでも満たす場合にはtrue, それ以外はfalse.
     */
    Game_BattlerBase.prototype.testEquipCondition = function(item) {
        const a = this;
        for (const cond of item.equipConditions) {
            try {
                if (eval(cond)) {
                    return true;
                }
            }
            catch (e) {
                console.error("testEquipCondition: item=" + item.name + ":" + e);
            }
        }

        return false;
    };

})();