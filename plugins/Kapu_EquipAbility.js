/*:ja
 * @target MZ 
 * @plugindesc アビリティ装備プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @orderAfter Kapu_IndependentItem
 * @orderAfter kapu_EquipSlot
 * 
 * @command changeAbility
 * @text アビリティを習得する/忘れる。
 * 
 * @arg operation
 * @text 操作
 * @desc 操作
 * @type select
 * @default learn
 * @option 習得する。
 * @value learn
 * @option 忘れる
 * @value forget
 * 
 * @arg abilityId
 * @text アビリティID
 * @desc アビリティID
 * @type armor
 * @default 0
 * 
 * @arg target
 * @text 対象
 * @desc 対象
 * @type select
 * @default actorId
 * @option 指定したアクター
 * @value actorId
 * @option 変数で指定したアクター
 * @value variableId
 * @option パーティーの所定の位置のアクター
 * @value partyPosition
 * @option パーティー全員
 * @value partyMembers
 * 
 * @arg actorId
 * @text アクターID
 * @desc アクターID(指定したアクターの場合のみ)
 * @type actor
 * @default 0
 * 
 * @arg variableId
 * @text アクター指定変数
 * @desc アクター指定変数(変数で指定したアクターの場合のみ)
 * @type variable
 * @default 0
 * 
 * @arg partyPosition
 * @text 位置指定
 * @desc 位置指定(パーティーの所定の位置のアクターの場合のみ)
 * @type number
 * @default 0
 * 
 * 
 * @param abilityEquipTypes
 * @text アビリティ装備スロットタイプ
 * @desc アビリティ装備スロットタイプとして扱う装備タイプ。2以上の装備タイプを指定する。(1は武器として扱われるため)
 * @type number[]
 * @default []
 * 
 * @help 
 * アクター毎にアビリティを装備可能とするプラグイン。
 * 一度習得したアビリティは、クラスチェンジしても継続して装備可能です。
 * 
 * 使用方法
 *   (1) 装備タイプを適当に作ります。
 *   (2) (1)で作成した、アビリティ装備スロットタイプをプラグインパラメータ「アビリティ装備スロットタイプ」に設定します。
 *   (2) アビリティデータの作成。
 *       防具データにアビリティデータを作成します。
 *       装備スロットタイプに(1)で指定した装備タイプを割り当てることで、自動的にアビリティとして扱われます。
 *   (3) プラグインコマンド or ノートタグで該当装備をアクターに追加します。
 * 
 * 
 * ■ 使用時の注意
 * 「アビリティ装備スロットタイプ」で指定したアイテムは、パーティーの所有するアイテムとして追加されません。
 * 
 * ■ プラグイン開発者向け
 * 当初スキルを装備させることで実現しようとしたが、スキルを装備する意味は殆ど無いため止めた。
 * (スキルは実行するアクションデータを定義するもので、使用可能なスキルを増やしたり、というデータではない。)
 * 構造としては防具のデータを使用して、所有権をアクターに持たせ、パーティのコンテナには加算されないようにした。
 * 
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし。
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * クラス
 *   <learnAbility:level#,abilityId#,abilityId#,...>
 *      level#に達したとき、abilityId#のアビリティを習得する。
 *      複数指定可
 * 
 * 防具
 *   <equipAbility>
 *     装備可能アビリティとして扱うデータであることを指定する。
 * 
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
(() => {
    const pluginName = "Kapu_EquipAbility";
    const parameters = PluginManager.parameters(pluginName);
    const abilityEquipTypes = [];
    try {
        const ids = JSON.parse(parameters["abilityEquipTypes"] || "[]").map(str => Number(str) || 0);
        for (const id of ids) {
            if ((id > 1) && !abilityEquipTypes.includes(id)) {
                abilityEquipTypes.push(id);
            }
        }

        if(abilityEquipTypes.length === 0) {
            console.error(pluginName + ":Ability equip type not specified.");
        }
    }
    catch (e) {
        console.error(e);
    }
    
    PluginManager.registerCommand(pluginName, "changeAbility", args => {
        const operation = args.operation || "";
        const abilityId = Number(args.abilityId) || 0;
        const target = args.target;

        let operationMethod = null;
        switch (operation) {
            case "learn":
                operationMethod = "learnAbility";
                break;
            case "forget":
                operationMethod = "forgetAbility";
                break;
        }

        if (DataManager.isAbilityId(abilityId) && operationMethod) {
            switch (target) {
                case "actorId":
                    {
                        const actorId = Number(args.actorId);
                        const actor = $gameActors.actor(actorId);
                        if (actor) {
                            actor[operationMethod](abilityId);
                        }
                    }
                    break;
                case "variableId":
                    {
                        const variableId = Number(args.variableId);
                        const actor = $gameActors($gameVariables.value(variableId));
                        if (actor) {
                            actor[operationMethod](abilityId);
                        }
                    }
                    break;
                case "partyPosition":
                    {
                        const partyPosition = Number(args.partyPosition) || 0;
                        const actor = $gameParty.allMembers()[partyPosition];
                        if (actor) {
                            actor[operationMethod](abilityId);
                        }
                    }
                    break;
                case "partyMembers":
                    {
                        $gameParty.allMembers().forEach(member => {
                            member[operationMethod](abilityId);
                        });
                    }
                    break;
            }
        }


    });
    //------------------------------------------------------------------------------
    // Scene_Boot
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    /**
     * Scene_Bootを開始する。
     */
    Scene_Boot.prototype.start = function () {
        DataManager.processEquipAbilityNotetag($dataClasses);
        _Scene_Boot_start.call(this);
    };

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * 装備アビリティノートタグを処理する。
     * 
     * @param {Array<DataClass>} data データ
     */
    DataManager.processEquipAbilityNotetag = function(data) {
        const regExp = /<learnAbility:([^>]*)>/g;
        for (obj of data) {
            if (!obj) {
                continue;
            }
            obj.learningAbilities = [];

            for (;;) {
                const match = regExp.exec(obj.note);
                if (match) {
                    const ids = match[1].split(",").map(token => Number(token) || 0);
                    if ((ids.length >= 2) && (ids[0] > 0)) {
                        const level = ids[0];
                        for (let i = 1; i < ids.length; i++) {
                            const id = ids[i];
                            if (DataManager.isAbilityId(id)) {
                                obj.learningAbilities.push({ level:level, abilityId:id });
                            }
                        }
                    }
                } else {
                    break;
                }
            }
        }
    };
    /**
     * idが有効なアビリティIDかどうかを得る。
     * 
     * @param {number} id アビリティID
     * @returns {boolean} 有効なアビリティIDの場合にはtrue, それ以外はfalse
     */
    DataManager.isAbilityId = function(id) {
        const item = $dataArmors[id];
        return (item && abilityEquipTypes.includes(item.etypeId));
    };

    //------------------------------------------------------------------------------
    // Game_Actor
    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._abilities = [];
    };

    const _Game_Actor_initSkills = Game_Actor.prototype.initSkills;
    /**
     * スキルを初期化する。
     */
    Game_Actor.prototype.initSkills = function() {
        _Game_Actor_initSkills.call(this);
        this.initAbilities();
    };    

    /**
     * アビリティを初期化する。
     */
    Game_Actor.prototype.initAbilities = function() {
        this._abilities = [];
        for (const learningAbility of this.currentClass().learningAbilities) {
            if (learningAbility.level <= this._level) {
                this.learnAbility(learningAbility.abilityId);
            }
        }
    };

    const _Game_Actor_initEquips = Game_Actor.prototype.initEquips;

    /**
     * 装備を初期化する。
     * 
     * @param {Array<number>} equips 装備品ID配列
     */
    Game_Actor.prototype.initEquips = function(equips) {
        // データベースでスキル装備スロットに指定されているところに装備しているものは
        // 習得済みとする。
        const equipAbilities = [];
        for (let slotNo = 0; slotNo < equips.length; slotNo++) {
            const id = equips[slotNo];
            if (id > 0) {
                const etypeId = ((slotNo === 1) && this.isDualWired())
                        ? 1 : (slotNo + 1);
                if (abilityEquipTypes.includes(etypeId)) {
                    const ability = $dataArmors[id];
                    if (ability) {
                        this.learnAbility(id);
                        equipAbilities.push($dataArmors[id]);
                    }
                }
            }
        }

        _Game_Actor_initEquips.call(this, equips);
    };

    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    /**
     * レベルアップ処理をする。
     */
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);
        for (const learningAbility of this.currentClass().learningAbilities) {
            if (learningAbility.level === this._level) {
                this.learnAbility(learningAbility.abilityId);
            }
        }
    };

    /**
     * アビリティを習得する。
     * 
     * @param {number} armorId アビリティID(防具ID）
     */
    Game_Actor.prototype.learnAbility = function(armorId) {
        if (!this.isLearnedAbility(armorId) && DataManager.isAbilityId(armorId)) {
            this._abilities.push(armorId);
            this._abilities.sort((a, b) => a - b);
        }
    };

    /**
     * アビリティを忘れる。
     * 
     * @param {number} armorId アビリティID（防具ID）
     */
    Game_Actor.prototype.forgetAbility = function(armorId) {
        if (this.isLearnedAbility(armorId) && DataManager.isAbilityId(armorId)) {
            this._abilities.remove(armorId);
        }
    };

    /**
     * 習得済みアビリティかどうかを判定する。
     * 
     * @param {number} armorId 防具ID
     * @returns {boolean} 習得済みの場合にはtrue, それ以外はfalse.
     */
    Game_Actor.prototype.isLearnedAbility = function(armorId) {
        return this._abilities.includes(armorId);
    };

    /**
     * 習得しているアビリティを得る。
     * 
     * @returns {Array<object>} アビリティデータ列
     */
    Game_Actor.prototype.abilities = function() {
        const abilities = [];
        for (const id of this._abilities) {
            const ability = $dataArmors[id];
            if (ability && !abilities.includes(ability)) {
                abilities.push(ability);
            }
        }
        return abilities;
    };

    const _Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    /**
     * 装備を変更する。
     * パーティーの所持品にitemが無い場合には変更できない。
     * 
     * @param {number} slotId スロットID
     * @param {DataItem} item 装備品(DataWeapon/DataArmor)
     */
    Game_Actor.prototype.changeEquip = function(slotId, item) {
        const slots = this.equipSlots();
        const etypeId = slots[slotId];
        if (abilityEquipTypes.includes(etypeId)) {
            // アビリティ装備スロット
            // tradeWithPartyは呼ばない。
            if ((!item || this.equipSlots()[slotId] === item.etypeId)) {
                this._equips[slotId].setObject(item);
                this.refresh();
            }
        } else {
            _Game_Actor_changeEquip.call(this, slotId, item);
        }
    };

    //------------------------------------------------------------------------------
    // Window_EquipItem
    const _Game_Party_gainItem = Game_Party.prototype.gainItem;
    /**
     * アイテムを加算/減算する。
     * 
     * @param {object} item アイテム(DataItem/DataWeapon/DataArmor)
     * @param {number} amount 増減する量。
     * @param {boolean} includeEquip 装備品を含めるかどうか。
     */
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        if (DataManager.isArmor(item) && abilityEquipTypes.includes(item.etypeId)) {
            /* このアイテムはアビリティデータなので増減させない */
        } else {
            _Game_Party_gainItem.call(this, item, amount, includeEquip);
        }
    };
    //------------------------------------------------------------------------------
    // Window_EquipItem
    const _Window_EquipItem_makeItemList = Window_EquipItem.prototype.makeItemList;
    /**
     * 表示するアイテムリストを構築する。
     * 
     * Note: 全てのアイテム($gameParty.allItems())に対して、includes(item)を呼び出してtrueを返すものをリストにする。
     *       派生クラスでは何のリストにしているのか、includes()のメソッドに注意すること。
     */
    Window_EquipItem.prototype.makeItemList = function() {
        if (this.isEquipAbilitySlot()) {
            if (this._actor) {
                this._data = this._actor.abilities().filter(ability => this.includes(ability));
                this._data.push(null);
            } else {
                this._data = [null];
            }
        } else {
            _Window_EquipItem_makeItemList.call(this);
        }
    };

    /**
     * アビリティ装備スロットかどうかを得る。ｓ
     * 
     * @returns {boolean} アビリティ装備スロットの場合にはtrue, それ以外はfalse.
     */
    Window_EquipItem.prototype.isEquipAbilitySlot = function() {
        return abilityEquipTypes.includes(this.etypeId());
    };

})();
