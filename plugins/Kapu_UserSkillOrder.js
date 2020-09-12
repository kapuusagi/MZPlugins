/*:ja
 * @target MZ 
 * @plugindesc ユーザーによるスキル並び替えを行えるようにするプラグイン。
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @help 
 * ユーザーによるスキル並び替えを行えるようにUIを改変する。
 * 
 * 仕様
 * ・以下のUIに表示されるスキルリストが、ユーザーによって
 *   カスタマイズ可能になります。
 *       マップでのスキルウィンドウ。
 *       戦闘中でのスキルウィンドウ。
 * 
 * ・操作を以下のように変更します。
 *       スキル画面で選択操作 スキルを選択状態にする。
 *       スキル画面で選択操作2回目
 *             選択中のスキルを再選択した場合は使用/対象選択へ。
 *             選択中のスキル以外を選択した場合には順序入れ替え。
 * ・スキル並び順はアクター毎に保存されます。
 * ・スキルリストでスキルを選択・実行する際は、同じスキルを
 *   2度選択する必要が出てきます。
 *   スマートフォンなどの環境では、スキル使用時に2回選択することになるため、
 *   操作のわずらわしさが発生するかもしれません。
 *   スキルの量が多くない場合に導入するのは操作性の悪化を招くでしょう。
 * ・スキル並び順は保存されます。スキルを忘れても順番は残ります。
 * 
 * 注意。
 * 本プラグインは以下の動作を変更する。
 * 他のプラグイン等で挙動を変更していたり、
 * 独自のスキルリスト画面を使っている場合には対応できない。
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
 * Version.0.1.0 TWLDで実装したのを移植。
 */
(() => {
    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;

    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._skillOrder = [];
    };

    /**
     * 並び替えしたスキル一覧を返す。
     * 
     * @return {Array<DataSkill>} スキル配列。
     */
    Game_Actor.prototype.skillsWithOrder = function() {
        var skills = this.skills();
        // ソートして返す。
        skills.sort(function(a, b) {
            var ai = this.getSkillOrder(a.id);
            var bi = this.getSkillOrder(b.id);
            return ai - bi;
        }.bind(this));
        return skills;
    };

    /**
     * スキル並び順を得る。
     * 並び順リストにidの登録がなければ、末尾についかして並び順を返す。
     * 
     * @param {Number} id スキルID番号
     * @return {Number} スキル並び順が返る。
     */
    Game_Actor.prototype.getSkillOrder = function(id) {
        var index = this._skillOrder.indexOf(id);
        if (index >= 0) {
            return index;
        } else {
            index = this._skillOrder.length;
            this._skillOrder.push(id);
            return index;
        }
    };
    /**
     * スキルのaとbの並び順を入れ替える。
     * @param {Number} skillId1 スキルID1
     * @param {Number} skillId2 スキルID2
     */
    Game_Actor.prototype.swapSkillOrder = function(skillId1, skillId2) {
        var ai = this.getSkillOrder(skillId1);
        var bi = this.getSkillOrder(skillId2);
        this._skillOrder[bi] = skillId1;
        this._skillOrder[ai] = skillId2;
    };
    //-----------------------------------------------------------------------------
    // Window_SkillList
    const _WindowSkillList_initialize = Window_SkillList.prototype.initialize;

    /**
     * Window_SkillListを初期化する。
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_SkillList.prototype.initialize = function(rect) {
        _WindowSkillList_initialize.call(this, ...arguments);
        this._pendingIndex = -1;
        this._orderEditEnable = false;
    }


    const _Window_SkillList_setActor = Window_SkillList.prototype.setActor;
    /**
     * スキルリストに対応するアクターを設定する。
     * 
     * @param {Game_Actor} actor アクター
     */
    Window_SkillList.prototype.setActor = function(actor) {
        _Window_SkillList_setActor.call(this, actor);
        this._pendingIndex = -1;
    };
    /**
     * スキル順入れ替え機能を有効にするかどうかを設定する。
     * 
     * @param {Boolean} enabled スキル順入れ替えを有効にする場合にはtrue, それ以外はfalse
     */
    Window_SkillList.prototype.setOrderEditEnable = function(enabled) {
        if (this._orderEditEnable !== enabled) {
            this._orderEditEnable = enabled;
            if (!this._orderEditEnable) {
                this._pendingIndex = -1;
            }
        }
    }

    /**
     * ペンディングインデックスを設定する。
     * @param {Number} index インデックス番号
     */
    Window_SkillList.prototype.setPendingIndex = function(index) {
        if (this._pendingIndex !== index) {
            this._pendingIndex = index;
            this.refresh();
        }
    }

    /**
     * ペンディングインデックスを取得する。
     * @return {Number} ペンディングインデックス
     */
    Window_SkillList.prototype.getPendingIndex = function() {
        return this._pendingIndex;
    }
    /**
     * スキル一覧に表示するスキルリストを構築する。
     * 
     * !!!overwrite!!!
     */
    Window_SkillList.prototype.makeItemList = function() {
        if (this._actor) {
            this._data = this._actor.skillsWithOrder().filter(item =>
                this.includes(item), true);
        } else {
            this._data = [];
        }
    };


    const _Window_SkillList_isCurrentItemEnabled = Window_SkillList.prototype.isCurrentItemEnabled;

    /**
     * 現在の選択項目が有効かどうかを判定する。
     * 
     * @return {Boolean} 有効な場合にはtrue, それ以外はfalse
     */
    Window_SkillList.prototype.isCurrentItemEnabled = function() {
        if (this._orderEditEnable
                && ((this._pendingIndex == -1) || this._pendingIndex !== this.index())) {
            // 順序変更機能が有効な場合選択可能とする。
            return true;
        } else {
            return _Window_SkillList_isCurrentItemEnabled.call(this);
        }
    };

    const _Window_SkillList_drawItem = Window_SkillList.prototype.drawItem;

    /**
     * 項目を描画する
     * 
     * @param {Number} index 項目のインデックス番号
     */
    Window_SkillList.prototype.drawItem = function(index) {
        if ((this._orderEditEnable) && (index == this._pendingIndex)) {
            // 並び替え用の項目は背景色をペンディングカラーに設定
            var rect = this.itemRect(index);
            var color = ColorManager.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
        _Window_SkillList_drawItem.call(this, ...arguments);
    };

    //-----------------------------------------------------------------------------
    // Scene_Skillの変更
    // 

    const _Scene_Skill_createItemWindow = Scene_Skill.prototype.createItemWindow;

    /**
     * スキル選択ウィンドウを作成する。
     */
    Scene_Skill.prototype.createItemWindow = function() {
        _Scene_Skill_createItemWindow.call(this);
        this._itemWindow.setOrderEditEnable(true);
    };

    const _Scene_Skill_onItemOk = Scene_Skill.prototype.onItemOk;

    /**
     * スキル画面でOK操作された。
     */
    Scene_Skill.prototype.onItemOk = function() {
        const pendingIndex = this._itemWindow.getPendingIndex();
        if (pendingIndex === -1) {
            // 未選択。
            this._itemWindow.setPendingIndex(this._itemWindow.index());
            this._itemWindow.activate();
        } else {
            const index = this._itemWindow.index();
            if (index === pendingIndex) {
                // 同じスキルが選択された。
                this._itemWindow.setPendingIndex(-1);
                _Scene_Skill_onItemOk.call(this);
            } else {
                // スキル並び順入れ替え
                const srcItem = this._itemWindow.itemAt(pendingIndex);
                const dstItem = this._itemWindow.itemAt(index);
                if (srcItem && dstItem) {
                    this.actor().swapSkillOrder(srcItem.id, dstItem.id);
                }
                this._itemWindow.setPendingIndex(-1);
                this._itemWindow.refresh();
                this._itemWindow.activate();
            }
        }
    };

    const _Scene_Skill_onItemCancel = Scene_Skill.prototype.onItemCancel;
    
    /**
     * アイテム画面でキャンセル操作された
     */
    Scene_Skill.prototype.onItemCancel = function() {
        this._itemWindow.setPendingIndex(-1);
        _Scene_Skill_onItemCancel.call(this);
    };

    //-----------------------------------------------------------------------------
    // Scene_Battleの変更
    // 他のバトルシステム系プラグインとあわせて使うなら競合に注意すること。

    const _Scene_Battle_createSkillWindow = Scene_Battle.prototype.createSkillWindow;

    /**
     * スキルウィンドウを作成する。
     */
    Scene_Battle.prototype.createSkillWindow = function() {
        _Scene_Battle_createSkillWindow.call(this);
        this._skillWindow.setOrderEditEnable(true);
    };

    const _Scene_Battle_onSkillOk = Scene_Battle.prototype.onSkillOk;
    /**
     * スキル選択でOK操作された時の処理を行う。
     */
    Scene_Battle.prototype.onSkillOk = function() {
        const pendingIndex = this._skillWindow.getPendingIndex();
        if (pendingIndex === -1) {
            // 未選択。
            this._skillWindow.setPendingIndex(this._skillWindow.index());
            this._skillWindow.activate();
        } else {
            const index = this._skillWindow.index();
            if (index === pendingIndex) {
                // 同じスキルが選択された。
                this._skillWindow.setPendingIndex(-1);
                _Scene_Battle_onSkillOk.call(this);
            } else {
                // スキル並び順入れ替え
                const srcItem = this._skillWindow.itemAt(pendingIndex);
                const dstItem = this._skillWindow.itemAt(index);
                if (srcItem && dstItem) {
                    BattleManager.actor().swapSkillOrder(srcItem.id, dstItem.id);
                }
                this._skillWindow.setPendingIndex(-1);
                this._skillWindow.refresh();
                this._skillWindow.activate();
            }
        }
    };

    const _Scene_Battle_onSkillCancel = Scene_Battle.prototype.onSkillCancel;

    /**
     * スキル選択でキャンセル操作された時の処理を行う。
     */
    Scene_Battle.prototype.onSkillCancel = function() {
        this._skillWindow.setPendingIndex(-1);
        _Scene_Battle_onSkillCancel.call(this);
    };
})();