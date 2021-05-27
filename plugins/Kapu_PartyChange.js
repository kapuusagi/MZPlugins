/*:ja
 * @target MZ 
 * @plugindesc パーティー変更プラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command start
 * @text パーティー変更
 * @desc パーティー変更シーンを開始します。
 * 
 * @command setMenuEnable
 * @text メニューのパーティー編成ON/OFF
 * @desc パーティー編成の許可/不許可を設定します。
 * 
 * @arg enabled
 * @text 許可/禁止
 * @desc パーティー編成を許可する場合にはtrue, 禁止する場合はfalseを指定します。
 * @type boolean
 * 
 * @command addPartyChangeMember
 * @text パーティー編成メンバ追加
 * @desc パーティー編成メンバに指定アクターを追加します。
 * 
 * @arg actorId
 * @text アクターID
 * @desc アクターIDで指定する場合
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 指定変数の値でアクターを指定する場合。(アクター指定が優先されます。)
 * @type variable
 * 
 * 
 * @command removePartyChangeMember
 * @text パーティー編成メンバ削除
 * @desc パーティー編成メンバから指定アクターを削除します。
 * 
 * @arg actorId
 * @text アクターID
 * @desc アクターIDで指定する場合
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 指定変数の値でアクターを指定する場合。(アクター指定が優先されます。)
 * @type number
 * 
 * 
 * @command setPartyChangeEnable
 * @text パーティー変更可否設定
 * @desc パーティー変更の可否を設定します。
 * 
 * @arg actorId
 * @text アクターID
 * @desc アクターIDで指定する場合
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 指定変数の値で指定する場合。(アクター指定が優先されます。)
 * @type number
 * 
 * @arg enabled
 * @text パーティー変更可否
 * @desc パーティー変更可に設定する場合にはtrue, それ以外はfalseを指定します。
 * @type boolean
 * @default false
 * 
 *
 * @param debugEnable
 * @text デバッグ有効/無効
 * @desc trueにするとデバッグ出力を有効にします。
 * @type boolean
 * @default false
 *  
 * @param menuEnable
 * @text メニューに表示
 * @desc メニューに表示します。falseにするとメニューに表示されません。
 * @type boolean
 * @default true
 * 
 * @param menuCommandText
 * @text コマンド名
 * @desc メニューに表示するコマンド名を指定します。
 * @type string
 * @default パーティー編成
 * @parent menuEnable
 * 
 * 
 * @param partyMemberCount
 * @text パーティーメンバー数
 * @desc パーティーメンバー数の最大を指定します。
 * @type number
 * @default 4
 * 
 * 
 * @param motionPattern
 * @text モーションパターン
 * @desc 選択中に表示する歩行グラフィックのパターン
 * @type number[]
 * @default ["1","2","1","0"]
 * 
 * 
 * @param windowLayout
 * @text ウィンドウレイアウト
 * 
 * @param partyMemberWindowHeight
 * @text パーティーメンバーウィンドウの高さ
 * @desc パーティーメンバーウィンドウの高さを指定します。
 * @type number
 * @default 240
 * @parent windowLayout
 * 
 * @param statusAreaWidth
 * @text ステータス表示欄の幅
 * @desc ステータス表示欄の幅を指定します。
 * @type number
 * @default 480
 * @parent windowLayout
 * 
 * @param activeColor1
 * @text アクティブカラー1
 * @desc メンバー参加中のアクター背景色1。上側のグラディエーション色
 * @type string
 * @default rgb(0,64,64)
 * @parent windowLayout
 * 
 * @param activeColor2
 * @text アクティブカラー2
 * @desc メンバー参加中のアクター背景色2。下側のグラディエーション色
 * @type string
 * @default rgb(0,128,128)
 * @parent windowLayout
 * 
 * @param textEmptySlot
 * @text 空スロットテキスト
 * @desc 未装備スロットに表示する文字列。
 * @type string
 * @default 
 * @parent windowLayout
 * 
 * @param statusPictureMethod
 * @text ステータス画像メソッド名
 * @desc アクターのステータス画像を取得するメソッドまたはプロパティ名。
 * @type string
 * @parent windowLayout
 * 
 * @help 
 * パーティー編成画面を提供するプラグイン。
 * ・変更可能メンバーリストの保持
 *   プラグインコマンドにより追加/削除します。
 *   現在のパーティーメンバーが未登録の場合、
 *   外してシーンを切り替えると戻せなくなるため、
 *   変更/外す操作を禁止しています。
 *   
 * ・メニューにパーティー編成コマンドを追加。(プラグインパラメータでON/OFF可)
 *   パーティー編成コマンドはプラグインコマンドでEnable/Disableを設定できません。
 * 
 * ・アクター毎に変更可否状態を設定できます。
 *   一時的にイベントメンバーとして外せなくする場合などに使用します。
 * 
 * ■ 使用時の注意
 * 戦闘中に呼びだせません。
 * 
 * ■ プラグイン開発者向け
 * パーティー編成画面のステータス表示をカスタマイズしたい場合、
 * Window_PartyChangeStatus.paint()をオーバーライドするか、
 * drawBlock1(), drawBlock2(), drawBlock3() のいずれかをオーバーライドします。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * パーティー変更
 *   パーティー変更を開始します。
 *   戦闘中はコールしても動作しません。
 *   パーティー変更可否状態に依りません。
 * 
 * メニューのパーティー編成ON/OFF
 *   メニューに表示するパーティー編成コマンドを有効/無効設定します。
 *   一時的にメニューからパーティー編成を禁止にする場合に使用します。
 * 
 * パーティー編成メンバ追加
 *   指定アクターを編成可能メンバーに追加します。
 * 
 * パーティー編成メンバ削除
 *   指定アクターを編成可能メンバーから削除します。
 * 
 * パーティー変更可否設定
 *   指定アクターのパーティー編成可否を設定します。
 * 
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

/**
 * Window_PartyChangeMemberBase
 */
function Window_PartyChangeMemberBase() {
    this.initialize(...arguments);
}

/**
 * Window_PartyChangePartyMembers
 * 
 * 現在の選択パーティーメンバーを表示するウィンドウ。
 */
function Window_PartyChangePartyMembers() {
    this.initialize(...arguments);
}

/**
 * Window_PartyChangeCandidateMembers
 * 
 * パーティー変更での選択可能アクターを表示する。
 */
function Window_PartyChangeCandidateMembers() {
    this.initialize(...arguments);
}

/**
 * Window_PartyChangeStatus
 * 
 * パーティー変更でのアクターステータスを表示する。
 */
function Window_PartyChangeStatus() {
    this.initialize(...arguments);
}

/**
 * Scene_PartyChange
 * 
 * パーティー変更シーン
 */
function Scene_PartyChange() {
    this.initialize(...arguments);
}



(() => {
    const pluginName = "Kapu_PartyChange";
    const parameters = PluginManager.parameters(pluginName);

    const partyMemberWindowHeight = Number(parameters["partyMemberWindowHeight"]) || 240;
    const statusAreaWidth = Number(parameters["statusAreaWidth"]) || 480;
    const activeColor1 = parameters["activeColor1"] || "rgb(0,64,64)";
    const activeColor2 = parameters["activeColor2"] || "rgb(0,128,128)";
    const textEmptySlot = parameters["textEmptySlot"] || "";
    const statusPictureMethod = String(parameters["statusPictureMethod"]) || "";

    const partyMemberCount = Number(parameters["partyMemberCount"]) || 4;

    const debugEnable = (typeof parameters["debugEnable"] === "undefined")
            ? false : (parameters["debugEnable"] === "true");
    const menuEnable = (typeof parameters["menuEnable"] === "undefined")
            ? true : (parameters["menuEnable"] === "true");
    const menuCommandText = parameters["menuCommandText"] || "Change party";

    const _parseMotionPattern = function(arg) {
        try {
            if (arg) {
                const array = JSON.parse(arg);
                for (let i = 0; i < array.length; i++) {
                    array[i] = Number(array[i]) || 0;
                }
                if (array.length > 0) {
                    return array;
                }
            }
        }
        catch (e) {
            console.error(e);
        }

        return [1, 2, 1, 0];
    };
    const motionPattern = _parseMotionPattern(parameters["motionPattern"]);

    /**
     * 真偽値を得る。
     * 
     * @param {object} valueStr 値文字列
     * @returns {boolean} 真偽値
     */
    const _parseBoolean = function(valueStr) {
        if (typeof valueStr === "undefined") {
            return undefined;
        } else if (typeof valueStr === "string") {
            if (valueStr) {
                return valueStr === "true";
            } else {
                return undefined;
            }
        } else {
            return Boolean(valueStr);
        }
    };

    // eslint-disable-next-line no-unused-vars 
    PluginManager.registerCommand(pluginName, "start", args => {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_PartyChange);
        } else {
            console.error(pluginName + ": Do not change scene in battle.");
        }
    });

    PluginManager.registerCommand(pluginName, "setMenuEnable", args => {
        const enabled = _parseBoolean(args.enabled);
        if (typeof enabled !== "undefined") {
            if (enabled) {
                $gameSystem.enablePartyChange();
            } else {
                $gameSystem.disablePartyChange();
            }
        }
    });

    /**
     * 対象のアクターを得る。
     * 
     * @param {object} args 引数
     * @returns {Game_Actor} アクター
     */
    const _getActor = function(args) {
        const actorId = Number(args.actorId) || 0;
        const variableId = Number(args.variableId) || 0;
        if ((actorId > 0) && (actorId < $dataActors.length)) {
            return $gameActors.actor(actorId);
        } else if ((variableId > 0) && (variableId < $dataSystem.variables.length)) {
            const id = $gameVariables.value(variableId);
            if ((id > 0) && (id < $dataActors.length)) {
                return $gameActors.actor(id);
            }
        }

        return null;
    };

    PluginManager.registerCommand(pluginName, "addPartyChangeMember", args => {
        const actor = _getActor(args);
        if (actor) {
            $gameParty.addChangeableMember(actor.actorId());
        }
    });
    PluginManager.registerCommand(pluginName, "removePartyChangeMember", args => {
        const actor = _getActor(args);
        if (actor) {
            $gameParty.removeChangeableMember(actor.actorId());
        }
    });
    PluginManager.registerCommand(pluginName, "setPartyChangeEnable", args => {
        const actor = _getActor(args);
        if (actor) {
            const enabled = _parseBoolean(args.enabled) || false;
            if (enabled) {
                actor.enablePartyChange();
            } else {
                actor.disablePartyChange();
            }
        }
    });
    //------------------------------------------------------------------------------
    // Game_System
    const _Game_System_initialize = Game_System.prototype.initialize;
    /**
     * Game_Systemを初期化する。
     */
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._partyChangeEnabled = true;
    };

    /**
     * パーティー編成が有効かどうかを取得する。
     * 
     * @returns {boolean} パーティー編成が有効な場合にはtrue, それ以外はfalseが返る。
     */
    Game_System.prototype.isPartyChangeEnabled = function() {
        return this._partyChangeEnabled;
    };

    /**
     * パーティー編成を有効にする。
     */
    Game_System.prototype.enablePartyChange = function() {
        this._partyChangeEnabled = true;
    };

    /**
     * パーティー編成を無効にする。
     */
    Game_System.prototype.disablePartyChange = function() {
        this._partyChangeEnabled = false;
    };
    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._partyChangeEnabled = true;
    };

    /**
     * パーティー変更が可能かどうかを得る。
     * 
     * @returns {boolean} パーティー変更が可能な場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isPartyChangeEnabled = function() {
        return this._partyChangeEnabled;
    };

    /**
     * パーティー変更可能に設定する。
     */
    Game_Actor.prototype.enablePartyChange = function() {
        this._partyChangeEnabled = true;
    };

    /**
     * パーティー変更禁止に設定する。
     */
    Game_Actor.prototype.disablePartyChange = function() {
        this._partyChangeEnabled = false;
    };
    //------------------------------------------------------------------------------
    // Game_Party
    const _Game_Party_initialize = Game_Party.prototype.initialize;
    /**
     * Game_Partyを初期化する。
     */
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.call(this);
        this._changeableMembers = [];
    };

    /**
     * 変更可能メンバーを得る。
     * 
     * @returns {number} 変更可能メンバー
     */
    Game_Party.prototype.changeableMembers = function() {
        const members = [];
        for (const id of this._changeableMembers) {
            const actor = $gameActors.actor(id);
            if (!members.includes(id) && actor) {
                members.push(id);
            }
        }

        return members;
    };


    /**
     * 変更可能メンバーを追加する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Party.prototype.addChangeableMember = function(actorId) {
        if (!this._changeableMembers.includes(actorId)) {
            this._changeableMembers.push(actorId);
        }
    };

    /**
     * 変更可能メンバーを削除する。
     * 
     * Note: 候補メンバー欄に表示はできるけれど、
     *       入れ替え禁止にする場合には Game_Actor.disablePartyChange() を使用すること。
     * 
     * @param {number} actorId アクターID
     */
    Game_Party.prototype.removeChangeableMember = function(actorId) {
        const index = this._changeableMembers.indexOf(actorId);
        if (index >= 0) {
            this._changeableMembers.splice(index, 1);
        }
    };


    //------------------------------------------------------------------------------
    // Window_PartyChangeMemberBase
    Window_PartyChangeMemberBase.prototype = Object.create(Window_Selectable.prototype);
    Window_PartyChangeMemberBase.prototype.constructor = Window_PartyChangeMemberBase;

    /**
     * Window_PartyChangeMemberBase を初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_PartyChangeMemberBase.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._prevIndex = -1;
        this._motionIndex = 0;
        this._frameCount = 0;
        this._pendingIndex = -1;
        this._motionPattern = motionPattern;
    };
    /**
     * 最大カラム数を得る。
     * 
     * @returns {number} カラム数
     */
    Window_PartyChangeMemberBase.prototype.maxCols = function() {
        const itemWidth = this.itemWidth();
        return Math.floor(this.innerWidth / itemWidth);
    };

    /**
     * 項目の描画幅を得る。
     * 
     * @returns {number} 描画幅
     */
    Window_PartyChangeMemberBase.prototype.itemWidth = function() {
        const spacing = this.colSpacing();
        return Math.max(this.innerWidth / partyMemberCount, 120 + spacing);
    };
    /**
     * 項目の描画高を得る。
     * 
     * @returns {number} 項目の描画高さ。
     */
    Window_PartyChangeMemberBase.prototype.itemHeight = function() {
        return Math.min(this.innerHeight, 160);
    };

    /**
     * 現在選択中のアクターを得る。
     * 
     * @returns {Game_Actor} Game_Actorオブジェクト。対応するものが無い場合にはnull。
     */
    Window_PartyChangeMemberBase.prototype.actor = function() {
        return this.actorAt(this.index());
    }

    /**
     * indexに対応するアクターを得る。
     * 
     * @param {number} index インデックス番号
     * @returns {Game_Actor} Game_Actorオブジェクト。対応するものが無い場合にはnull。
     */
    // eslint-disable-next-line no-unused-vars
    Window_PartyChangeMemberBase.prototype.actorAt = function(index) {
        return null;
    };

    /**
     * ステータスウィンドウを設定する。
     * 
     * @param {Window_PartyChangeStatus} window ステータスウィンドウ
     */
    Window_PartyChangeMemberBase.prototype.setStatusWindow = function(window) {
        this._statusWindow = window;
    };

    /**
     * ヘルプの更新処理を呼び出す。
     */
    Window_PartyChangeMemberBase.prototype.callUpdateHelp = function() {
        if (this.active && this._statusWindow) {
            this._statusWindow.setActor(this.actor());
        }
    };

    /**
     * 現在選択中の項目が選択可能かどうかを得る。
     * 
     * @returns {boolean} 選択可能である場合にはtrue, それ以外はfalse
     */
    Window_PartyChangeMemberBase.prototype.isCurrentItemEnabled = function() {
        const actor = this.actorAt(this.index());
        return this.isEnabled(actor);
    };

    /**
     * actor が選択可能かどうかを得る。
     * 
     * @param {number} index インデックス番号
     * @returns {boolean} 選択可能な場合にはtrue, それ以外はfalse
     */
    Window_PartyChangeMemberBase.prototype.isEnabled = function(actor) {
        return (actor === null) || (actor.isPartyChangeEnabled());
    };

    /**
     * 項目を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_PartyChangeMemberBase.prototype.drawItem = function(index) {
        this.drawPendingItemBackground(index);
        const actor = this.actorAt(index);
        if (actor) {
            this.drawActorEntry(index, actor);
        }
    };
    /**
     * ペンディングの背景を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_PartyChangeMemberBase.prototype.drawPendingItemBackground = function(index) {
        if (index === this._pendingIndex) {
            const rect = this.itemRect(index);
            const color = ColorManager.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
    };
    /**
     * アクターエントリを描画する。
     * 
     * @param {number} index インデックス番号
     * @param {Game_Actor} actor Game_Actorオブジェクト
     */
    Window_PartyChangeMemberBase.prototype.drawActorEntry = function(index, actor) {
        const rect = this.itemRect(index);
        const lineHeight = this.lineHeight();

        this.changePaintOpacity(this.isEnabled(actor));

        if (this.isActiveActorAt(index)) {
            this.contents.context.filter = "none";
        } else {
            this.contents.context.filter = "grayscale(100%)";
        }

        const frameNo = ((index === this.index()) && this.active)
                ? this._motionPattern[this._motionIndex] : 1;
        const characterX = rect.x + rect.width / 2;
        const characterY = rect.y + rect.height - lineHeight * 2 + 8;
        this.drawCharacterAt(actor.characterName(), actor.characterIndex(),
                frameNo, characterX, characterY);
        this.contents.context.filter = "none";

        const levelY = rect.y + rect.height - lineHeight - lineHeight + 8;
        this.contents.fontSize = $gameSystem.mainFontSize() - 8;
        const levelText = TextManager.levelA + " " + actor.level;
        this.drawText(levelText, rect.x + 8, levelY, rect.width - 16, "left");
        // this.resetFontSettings();
        const nameY = rect.y + rect.height - lineHeight;
        this.drawText(actor.name(), rect.x + 8, nameY, rect.width - 16, "center");
    };

    /**
     * indexで指定されるアクターがアクティブかどうかを得る。
     * 
     * Note：パーティー加入中アクターを識別するために使用する。
     * 
     * @param {number} index インデックス番号
     * @returns {boolean} アクティブな場合にはtrue、それ以外はfalse
     */
    Window_PartyChangeMemberBase.prototype.isActiveActorAt = function(index) {
        return this.index() === index;
    };

    /**
     * キャラクターを描画する。
     * 下向き中央のグラフィックを描画する。
     * 
     * @param {string} characterName キャラクターファイル名
     * @param {number} characterIndex キャラクターインデックス
     * @param {number} frameNo フレーム番号(センターが1)
     * @param {number} x 描画下端中央x位置
     * @param {number} y 描画下端y位置
     */
    // prettier-ignore
    Window_PartyChangeMemberBase.prototype.drawCharacterAt = function(
            characterName, characterIndex, frameNo, x, y) {
        const bitmap = ImageManager.loadCharacter(characterName);
        const big = ImageManager.isBigCharacter(characterName);
        const pw = bitmap.width / (big ? 3 : 12);
        const ph = bitmap.height / (big ? 4 : 8);
        const n = big ? 0: characterIndex;
        const sx = ((n % 4) * 3 + frameNo) * pw;
        const sy = Math.floor(n / 4) * 4 * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    };

    /**
     * 項目の背景を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_PartyChangeMemberBase.prototype.drawItemBackground = function(index) {
        const rect = this.itemRect(index);
        if (this.isActiveActorAt(index)) {
            this.drawActiveBackgroundRect(rect);
        } else {
            this.drawBackgroundRect(rect);
        }
    };
    /**
     * アイテム背景を描画する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_PartyChangeMemberBase.prototype.drawActiveBackgroundRect = function(rect) {
        const c1 = activeColor1;
        const c2 = activeColor2;
        const x = rect.x;
        const y = rect.y;
        const w = rect.width;
        const h = rect.height;
        this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
        this.contentsBack.strokeRect(x, y, w, h, c1);
    };
    /**
     * Window_PartyChangeMemberBase を更新する。
     */
    Window_PartyChangeMemberBase.prototype.update = function() {
        this.updateAnimationFrame();
        Window_Selectable.prototype.update.call(this);

        const index = this.index();
        if (index !== this._prevIndex) {
            this._motionPattern = this.motionPattern();
            if (index >= 0) {
                this.redrawItem(index);
            }
            if (this._prevIndex >= 0) {
                this.redrawItem(this._prevIndex);
            }
            this._prevIndex = index;
        } else if (this.active) {
            this.redrawItem(index);
        }
    };

    /**
     * モーションパターンを得る。
     * 
     * @returns {Array<Number>} モーションパターンの配列
     */
    Window_PartyChangeMemberBase.prototype.motionPattern = function() {
        return motionPattern;
    };

    /**
     * アニメーションフレームを更新する。
     */
    Window_PartyChangeMemberBase.prototype.updateAnimationFrame = function() {
        this._frameCount++;
        const frameThres = Math.floor(60 / this._motionPattern.length);
        if (this._frameCount >= frameThres) {
            this._frameCount = 0;
            this._motionIndex++;
            if (this._motionIndex >= this._motionPattern.length) {
                this._motionIndex = 0;
            }
        }
    };

    /**
     * ウィンドウをアクティブにする。
     */
    Window_PartyChangeMemberBase.prototype.activate = function() {
        Window_Selectable.prototype.activate.call(this);
        this._motionIndex = 0;
        this._frameCount = 0;
        this.paint();
    };

    /**
     * ウィンドウを非アクティブにする。
     */
    Window_PartyChangeMemberBase.prototype.deactivate = function() {
        Window_Selectable.prototype.deactivate.call(this);
        this._motionIndex = 0;
        this._frameCount = 0;
        this.paint();
    };

    /**
     * ペンディングインデックスを得る。
     * 
     * @returns {number} ペンディングインデックス
     */
    Window_PartyChangeMemberBase.prototype.pendingIndex = function() {
        return this._pendingIndex;
    };
    
    /**
     * ペンディングインデックスを設定する。
     * 
     * @param {number} index インデックス
     */
    Window_PartyChangeMemberBase.prototype.setPendingIndex = function(index) {
        const lastPendingIndex = this._pendingIndex;
        this._pendingIndex = index;
        this.redrawItem(this._pendingIndex);
        this.redrawItem(lastPendingIndex);
    };

    //------------------------------------------------------------------------------
    // Window_PartyChangePartyMembers
    Window_PartyChangePartyMembers.prototype = Object.create(Window_PartyChangeMemberBase.prototype);
    Window_PartyChangePartyMembers.prototype.constructor = Window_PartyChangePartyMembers;

    /**
     * Window_PartyChangePartyMembersを初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_PartyChangePartyMembers.prototype.initialize = function(rect) {
        Window_PartyChangeMemberBase.prototype.initialize.call(this, rect);
        this.loadCharacters();
        this.refresh();
    };

    /**
     * 歩行グラフィックデータをロードする。
     */
    Window_PartyChangePartyMembers.prototype.loadCharacters = function() {
        const members = $gameParty.members();
        for (const member of members) {
            ImageManager.loadCharacter(member.characterName());
        }
    };


    /**
     * 項目数を得る。
     * 
     * @returns {number} 項目数。
     */
    Window_PartyChangePartyMembers.prototype.maxItems = function() {
        return Math.min($gameParty.allMembers().length + 1, partyMemberCount);
    };

    /**
     * indexに対応するアクターを得る。
     * 
     * @param {number} index インデックス番号
     * @returns {Game_Actor} Game_Actorオブジェクト。対応するものが無い場合にはnull。
     */
    Window_PartyChangePartyMembers.prototype.actorAt = function(index) {
        const members = $gameParty.members();
        return (index < members.length) ? members[index] : null;
    };

    /**
     * indexで指定されるアクターがアクティブかどうかを得る。
     * 
     * @param {number} index インデックス番号
     * @returns {boolean} アクティブな場合にはtrue、それ以外はfalse
     */
    // eslint-disable-next-line no-unused-vars
    Window_PartyChangePartyMembers.prototype.isActiveActorAt = function(index) {
        const actor = this.actorAt(index);
        return (actor !== null);
    };

    //------------------------------------------------------------------------------
    // Window_PartyChangeCandidateMembers
    Window_PartyChangeCandidateMembers.prototype = Object.create(Window_PartyChangeMemberBase.prototype);
    Window_PartyChangeCandidateMembers.prototype.constructor = Window_PartyChangeCandidateMembers;

    /**
     * Window_PartyChangeCandidateMembers を初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_PartyChangeCandidateMembers.prototype.initialize = function(rect) {
        this._members = $gameParty.changeableMembers();
        for (const actor of $gameParty.members()) {
            const actorId = actor.actorId();
            if (!this._members.includes(actorId)) {
                this._members.push(actorId);
            }
        }
        this._changeablePartyMemberOnly = false;
        Window_PartyChangeMemberBase.prototype.initialize.call(this, rect);
        this.loadCharacters();
        this.loadFaces();
        this.refresh();
    };

    /**
     * 歩行グラフィックデータをロードする。
     */
    Window_PartyChangeCandidateMembers.prototype.loadCharacters = function() {
        const members = this._members.map(id => $gameActors.actor(id));
        for (const member of members) {
            ImageManager.loadCharacter(member.characterName());
        }
    };

    /**
     * 顔グラフィックデータをロードする。
     */
    Window_PartyChangeCandidateMembers.prototype.loadFaces = function() {
        const members = this._members.map(id => $gameActors.actor(id));
        for (const member of members) {
            ImageManager.loadFace(member.faceName());
        }
    };

    /**
     * 項目数を得る。
     * 
     * @returns {number} 項目数。
     */
    Window_PartyChangeCandidateMembers.prototype.maxItems = function() {
        return this._members.length + 1;
    };
    /**
     * indexに対応するアクターを得る。
     * 
     * @param {number} index インデックス番号
     * @returns {Game_Actor} Game_Actorオブジェクト。対応するものが無い場合にはnull。
     */
    Window_PartyChangeCandidateMembers.prototype.actorAt = function(index) {
        if (index < this._members.length) {
            const actorId = this._members[index];
            return $gameActors.actor(actorId);
        } else {
            return null;
        }
    };

    /**
     * 交換対象アクターを選択する。
     * 
     * @param {Game_Actor} actor Game_Actorオブジェクト
     */
    Window_PartyChangeCandidateMembers.prototype.setTradeTarget = function(actor) {
        if (actor !== null) {
            const index = this._members.indexOf(actor.actorId());
            if (index >= 0) {
                this.select(index);
            }
            // 選択されたアクターが変更可能メンバーリストに含まれない場合、
            // 選択可能メンバーはパーティーメンバーに絞る。
            this._changeablePartyMemberOnly = !$gameParty.changeableMembers().includes(actor.actorId());
        } else {
            this._changeablePartyMemberOnly = false;
        }
    };
    /**
     * actorが選択可能かどうかを取得する。
     * 
     * @param {Game_Actor} actor アクター
     */
    Window_PartyChangeCandidateMembers.prototype.isEnabled = function(actor) {
        if (this._changeablePartyMemberOnly) {
            if ((actor === null) || !$gameParty.allMembers().includes(actor)) {
                // actor がnull(外す)
                // actor がパーティーメンバーに含まれていない。
                return false;
            }
        }
        return Window_PartyChangeMemberBase.prototype.isEnabled.call(this, actor);
    };
    /**
     * indexで指定されるアクターがアクティブかどうかを得る。
     * 
     * @param {number} index インデックス番号
     * @returns {boolean} アクティブな場合にはtrue、それ以外はfalse
     */
    // eslint-disable-next-line no-unused-vars
    Window_PartyChangeCandidateMembers.prototype.isActiveActorAt = function(index) {
        if (Window_PartyChangeMemberBase.prototype.isActiveActorAt.call(this, index)) {
            return true;
        } else {
            const actor = this.actorAt(index);
            if (actor) {
                return $gameParty.allMembers().includes(actor);
            } else {
                return false;
            }
        }
    };

    /**
     * Window_PartyChangeCandidateMembers を更新する。
     */
    Window_PartyChangeCandidateMembers.prototype.refresh = function() {
        this.updateMemberOrder();
        Window_PartyChangeMemberBase.prototype.refresh.call(this);
    };

    /**
     * メンバー順を更新する。
     */
    Window_PartyChangeCandidateMembers.prototype.updateMemberOrder = function() {
        const members = this._members.map(id => $gameActors.actor(id));
        const sortedMembers = members.sort((a, b) => {
            const partyIndexA = $gameParty.allMembers().indexOf(a);
            const partyIndexB = $gameParty.allMembers().indexOf(b);
            if (partyIndexA >= 0) {
                if (partyIndexB >= 0) {
                    return partyIndexA - partyIndexB;
                } else {
                    return -1;
                }
            } else {
                if (partyIndexB >= 0) {
                    return 1;
                } else {
                    if (a.level !== b.level) {
                        return a.level - b.level;
                    } else {
                        return a.actorId() - b.actorId();
                    }
                }
            }
        });

        this._members = sortedMembers.map(member => member.actorId());
    };
    //------------------------------------------------------------------------------
    // Sprite_StatusBackgroundPicture
    /**
     * Sprite_StatusBackgroundPicture
     * 
     * ステータス画面背景用画像表示スプライト
     */
    function Sprite_StatusBackgroundPicture() {
        this.initialize(...arguments);
    }

    Sprite_StatusBackgroundPicture.prototype = Object.create(Sprite.prototype);
    Sprite_StatusBackgroundPicture.prototype.constructor = Sprite_StatusBackgroundPicture;

    /**
     * Sprite_StatusBackgroundPictureを初期化する。
     */
    Sprite_StatusBackgroundPicture.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._actor = null;
        this._pictureName = "";
        this._displayArea = new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.anchor.x = 0.5; // 右端基準
        this.anchor.y = 1.0; // 下基準
        this.update();
    };

    /**
     * アクターを設定する。
     * 
     * @param {Game_Actor} アクター
     */
    Sprite_StatusBackgroundPicture.prototype.setActor = function(actor) {
        this._actor = actor;
    };

    /**
     * このスプライトの画面に対する配置・表示可能領域を設定する。
     * 
     * @param {Rectangle} rect 表示領域
     */
    Sprite_StatusBackgroundPicture.prototype.setDisplayArea = function(rect) {
        this._displayArea = rect;
    };

    /**
     * 更新する。
     */
    Sprite_StatusBackgroundPicture.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        if (this.visible) {
            this.updatePosition();
        }
    };

    /**
     * アクターの画像ファイル名を得る。
     * 
     * @returns {string} 画像ファイル名。未設定または設定されていない場合には空文字列。
     */
    Sprite_StatusBackgroundPicture.prototype.pictureName = function() {
        const actor = this._actor;
        if (actor && statusPictureMethod) {
            const typeStr = typeof actor[statusPictureMethod];
            if (typeStr === "function") {
                const pictureName = actor[statusPictureMethod]();
                if (pictureName) {
                    return pictureName;
                }
            } else if (typeStr === "string" ) {
                const pictureName = actor[statusPictureMethod];
                if (pictureName) {
                    return pictureName;
                }
            }
        }
        return "";
    };

    /**
     * 画像を更新する。
     */
    Sprite_StatusBackgroundPicture.prototype.updateBitmap = function() {
        const pictureName = this.pictureName();
        if (pictureName) {
            if (this._pictureName !== pictureName) {
                this._pictureName = pictureName;
                this.bitmap = ImageManager.loadPicture(this._pictureName);
            }
            this.visible = true;
        } else {
            this._pictureName = "";
            this.bitmap = null;
            this.visible = false;
        }
    };

    /**
     * 位置を更新する。
     */
    Sprite_StatusBackgroundPicture.prototype.updatePosition = function() {
        if (!this.bitmap) {
            return;
        }

        // y は下基準
        const dispWidth = Math.min(this._displayArea.width, this.bitmap.width);
        const displayHeight = Math.min(this._displayArea.height, this.bitmap.height);
        const dispX = (this.bitmap.width - dispWidth) / 2;
        const dispY = 0;
        this.setFrame(dispX, dispY, dispWidth, displayHeight);

        // 下揃えで配置する。
        this.x = this._displayArea.x + this._displayArea.width - 80;
        this.y = this._displayArea.y + this._displayArea.height;
    };
    //------------------------------------------------------------------------------
    // Window_PartyChangeStatus

    Window_PartyChangeStatus.prototype = Object.create(Window_Selectable.prototype);
    Window_PartyChangeStatus.prototype.constructor = Window_PartyChangeStatus;

    /**
     * Window_PartyChangeStatus を初期化する。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_PartyChangeStatus.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._actor = null;
        this._imageSprite = new Sprite_StatusBackgroundPicture();
        this._imageSprite.setDisplayArea(new Rectangle(0, 0, rect.width, rect.height));
        this._imageSprite.alpha = 0.4;
        this.addChildToBack(this._imageSprite);
    };

    /**
     * アクターを設定する。
     * 
     * @param {Game_Actor} actor アクター
     */
    Window_PartyChangeStatus.prototype.setActor = function(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this._imageSprite.setActor(actor);
            this.refresh();
        }
    };

    /**
     * コンテンツを描画する。
     */
    Window_PartyChangeStatus.prototype.paint = function() {
        if (this.contents) {
            this.contents.clear();
            this.contentsBack.clear();

            if (this._actor) {
                this.drawBlock1();
                this.drawBlock2();
                this.drawBlock3();
            }
        }
    };
    /**
     * ブロック1を描画する。
     */
    Window_PartyChangeStatus.prototype.drawBlock1 = function() {
        const rect = this.block1Rect();
        const lineHeight = this.lineHeight();
        const actor = this._actor;
        const spacing = 16;

        const faceX = rect.x;
        const faceY = rect.y;
        const faceWidth = Math.max(ImageManager.faceWidth, Math.floor(rect.width * 0.4));
        const faceHeight = lineHeight * 4;
        this.drawFace(actor.faceName(), actor.faceIndex(), faceX, faceY, faceWidth, faceHeight);

        const paramX = rect.x + faceWidth + spacing;
        let y = rect.y;
        const paramWidth = rect.width - (paramX - rect.x);
        this.drawActorName(actor, paramX, y, paramWidth);
        y += lineHeight;
        this.drawActorLevel(actor, paramX, y, paramWidth);
        y += lineHeight;
        this.drawActorHp(actor, paramX, y, paramWidth);
        y += lineHeight;
        this.drawActorMp(actor, paramX, y, paramWidth);
        y += lineHeight;
        this.resetFontSettings();
        this.drawHorzLine(rect.x, y, rect.width);
    };

    /**
     * ブロック1の矩形領域を描画する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Window_PartyChangeStatus.prototype.block1Rect = function() {
        const x = 0;
        const y = 0;
        const w = this.innerWidth;
        const h = this.lineHeight() * 5;
        return new Rectangle(x, y, w, h);
    };
    /**
     * ブロック2を描画する。
     */
    Window_PartyChangeStatus.prototype.drawBlock2 = function() {
        const actor = this._actor;
        const rect = this.block2Rect();
        const lineHeight = this.lineHeight();

        const x = rect.x;
        let y = rect.y;
        const width = rect.width;
        this.drawParamValue(TextManager.param(2), actor.atk, x, y, width);
        y += lineHeight;
        this.drawParamValue(TextManager.param(3), actor.def, x, y, width);
        y += lineHeight;
        this.drawParamValue(TextManager.param(4), actor.mat, x, y, width);
        y += lineHeight;
        this.drawParamValue(TextManager.param(5), actor.mdf, x, y, width);
        y += lineHeight;

        const lineY = y;
        this.resetFontSettings();
        this.drawHorzLine(rect.x, lineY, rect.width);
    };
    /**
     * ブロック2の矩形領域を描画する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Window_PartyChangeStatus.prototype.block2Rect = function() {
        const rect = this.block1Rect();
        const x = rect.x;
        const y = rect.y + rect.height;
        const w = rect.width;
        const h = this.lineHeight() * 5;
        return new Rectangle(x, y, w, h);
    };
    /**
     * ブロック3を描画する。
     */
    Window_PartyChangeStatus.prototype.drawBlock3 = function() {
        const lineHeight = this.lineHeight();
        const rect = this.block3Rect();
        const actor = this._actor;
        if (actor) {
            // 装備一覧を描画する。
            const slots = actor.equipSlots();
            const equips = actor.equips();
            for (let i = 0; i < slots.length; i++) {
                const slotName = $dataSystem.equipTypes[slots[i]];
                this.drawEquipSlot(slotName, equips[i], rect.x, rect.y + lineHeight * i, rect.width);
            }
        }
    };
    /**
     * ブロック3の矩形領域を描画する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Window_PartyChangeStatus.prototype.block3Rect = function() {
        const rect = this.block2Rect();
        const x = rect.x;
        const y = rect.y + rect.height;
        const w = this.innerWidth;
        const h = this.innerHeight - y;
        return new Rectangle(x, y, w, h);
    };
    /**
     * アクター名を描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 幅
     */
    Window_PartyChangeStatus.prototype.drawActorName = function(actor, x, y, width) {
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
    };
    /**
     * アクターのレベルを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     */
    Window_PartyChangeStatus.prototype.drawActorLevel = function(actor, x, y) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x + 84, y, 36, "right");
    };

    /**
     * アクターのHPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画領域左上x
     * @param {number} y 描画領域左上y
     * @param {number} width 幅
     */
    Window_PartyChangeStatus.prototype.drawActorHp = function(actor, x, y, width) {
        // ゲージ描画
        const current = actor.hp;
        const max = actor.mhp;
        const gaugeData = {
            rate:((max > 0) ? current / max : 0),
            backColor:ColorManager.gaugeBackColor(),
            color1:ColorManager.hpGaugeColor1(),
            color2:ColorManager.hpGaugeColor2()
        };
        const spacing = 16;
        const labelWidth = Math.floor(width * 0.2);
        const gaugeX = x + labelWidth + spacing;
        const gaugeWidth = width - labelWidth - spacing;
        this.drawGaugeRect(gaugeData, gaugeX, y + 24, gaugeWidth, 12);
        
        // テキスト描画
        const data = {
            label:TextManager.hpA,
            color:ColorManager.hpColor(actor),
            current:current,
            max:max
        };
        this.drawGaugeText(data, x, y, width);
    };

    /**
     * アクターのMPを描画する。
     * 
     * @param {Game_Actor} actor アクター
     * @param {number} x 描画領域左上x
     * @param {number} y 描画領域左上y
     * @param {number} width 幅
     */
    Window_PartyChangeStatus.prototype.drawActorMp = function(actor, x, y, width) {
        // ゲージ描画
        const current = actor.mp;
        const max = actor.mmp;
        const gaugeData = {
            rate:((max > 0) ? current / max : 0),
            backColor:ColorManager.gaugeBackColor(),
            color1:ColorManager.mpGaugeColor1(),
            color2:ColorManager.mpGaugeColor2()
        };
        const spacing = 16;
        const labelWidth = Math.floor(width * 0.2);
        const gaugeX = x + labelWidth + spacing;
        const gaugeWidth = width - labelWidth - spacing;
        this.drawGaugeRect(gaugeData, gaugeX, y + 24, gaugeWidth, 12);
        // テキスト描画
        const data = {
            label:TextManager.mpA,
            color:ColorManager.mpColor(actor),
            current:current,
            max:max
        };
        this.drawGaugeText(data, x, y, width);
    };
    /**
     * ゲージを描画する。
     * 
     * @param {object} gaugeData ゲージデータ。rate, backColor, color1, color2メンバを持つ。
     * @param {number} x ゲージ左上位置x
     * @param {number} y ゲージ左上位置y
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    Window_PartyChangeStatus.prototype.drawGaugeRect = function(gaugeData, x, y, width, height) {
        const rate = gaugeData.rate;
        const fillW = Math.floor((width - 2) * rate);
        const fillH = height - 2;
        const color0 = gaugeData.backColor;
        const color1 = gaugeData.color1;
        const color2 = gaugeData.color2;
        this.contents.fillRect(x, y, width, height, color0);
        this.contents.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
    };

    /**
     * ゲージのテキストを描画する。
     * 
     * @param {object} data データ
     * @param {number} x ラベル左上位置 x
     * @param {number} y ラベル左上位置 y
     * @param {number} width 幅
     */
    // eslint-disable-next-line no-unused-vars
    Window_PartyChangeStatus.prototype.drawGaugeText = function(data, x, y, width) {
        const paramWidth = Math.floor(width * 0.2);
        const maxValueWidth = Math.floor(width * 0.3);
        const currentValueWidth = width - paramWidth - maxValueWidth - 16;

        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(data.label, x, y + 8, paramWidth, "left");
        x += paramWidth;
        this.changeTextColor(data.color);
        this.contents.fontSize = $gameSystem.mainFontSize() + 8;
        this.drawText(data.current, x, y, currentValueWidth, "right");
        x += currentValueWidth;
        this.contents.fontSize = $gameSystem.mainFontSize() - 2;
        this.drawText("/", x, y + 8, 16, "center");
        x += 16;
        this.contents.fontSize = $gameSystem.mainFontSize() + 8;
        this.drawText(data.max, x, y, maxValueWidth, "right");
    };

    /**
     * 整数値タイプのパラメータを描画する。
     * 
     * @param {string} paramName パラメータ名
     * @param {number} value 値
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 幅
     */
    Window_PartyChangeStatus.prototype.drawParamValue = function(paramName, value, x, y, width) {
        if (typeof value === "undefined") {
            return;
        }
        const spacing = 16;
        const labelWidth = Math.min(80, Math.floor(width * 0.3));
        const valueWidth = Math.min(120, width - labelWidth - spacing);

        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(paramName, x, y, labelWidth);
        this.resetTextColor();
        this.drawText(value, x + labelWidth + spacing, y, valueWidth, "right");
    };

    /**
     * 装備スロットを描画する。
     * 
     * @param {string} スロット名
     * @param {object} item 装備品(DataWeapon/DataArmor)
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 描画幅
     */
    Window_PartyChangeStatus.prototype.drawEquipSlot = function(slotName, item, x, y, width) {
        const spacing = 16;
        const labelWidth = Math.min(80, Math.floor(width * 0.3));
        const nameWidth = width - labelWidth - spacing;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(slotName, x, y, labelWidth, this.lineHeight());
        this.drawEquipItemName(item, x + labelWidth + spacing, y, nameWidth);
    };

    /**
     * 装備品名を描画する。
     * 
     * @param {object} item アイテム(DataWeapon/DataSKill)
     * @param {number} x 描画位置x
     * @param {number} y 描画位置y
     * @param {number} width 描画幅
     */
    Window_PartyChangeStatus.prototype.drawEquipItemName = function(item, x, y, width) {
        if (item) {
            this.drawItemName(item, x, y, width);
        } else {
            const textMargin = ImageManager.iconWidth + 4;
            const itemWidth = Math.max(0, width - textMargin);
            this.resetTextColor();
            this.drawText(textEmptySlot, x + textMargin, y, itemWidth);
        }
    };

    /**
     * 水平ラインを描画する。
     * 
     * @param {number} x 描画x位置
     * @param {number} y 描画y位置
     * @param {number} width 幅
     */
    Window_PartyChangeStatus.prototype.drawHorzLine = function(x, y, width) {
        const lineHeight = this.lineHeight();
        const lineY = y + Math.floor((lineHeight - 5) / 2);
        this.changePaintOpacity(false);
        this.drawRect(x, lineY, width, 5);
        this.changePaintOpacity(true);
    };



    //------------------------------------------------------------------------------
    // Scene_PartyChange
    Scene_PartyChange.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_PartyChange.prototype.constructor = Scene_PartyChange;

    /**
     * Scene_PartyChange を初期化する。
     */
    Scene_PartyChange.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    /**
     * ページボタンを作成する必要があるかどうかを取得する。
     * @returns {boolean} ページボタンが必要な場合にはtrue, それ以外はfalse
     */
    Scene_PartyChange.prototype.needsPageButtons = function() {
        return false;
    };

    /**
     * シーンを作成する。
     */
    Scene_PartyChange.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createPartyMemberWindow();
        this.createCandidateMembersWindow();
        this.createStatusWindow();
    };

    /**
     * パーティーメンバーウィンドウを作成する。
     */
    Scene_PartyChange.prototype.createPartyMemberWindow = function() {
        const rect = this.partyMemberWindowRect();
        this._partyMemberWindow = new Window_PartyChangePartyMembers(rect);
        this._partyMemberWindow.setHandler("ok", this.onPartyMemberWindowOk.bind(this));
        this._partyMemberWindow.setHandler("cancel", this.onPartyMemberWindowCancel.bind(this));
    
        this.addWindow(this._partyMemberWindow);
    };

    /**
     * パーティーメンバーウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     */
    Scene_PartyChange.prototype.partyMemberWindowRect = function() {
        const wx = this.statusAreaWidth();
        const wy = this.buttonAreaBottom();
        const ww = Graphics.boxWidth - wx;
        const wh = this.partyMemberWindowHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * 候補ウィンドウを作成する。
     */
    Scene_PartyChange.prototype.createCandidateMembersWindow = function() {
        const rect = this.candidateMembersWindowRect();
        this._candidateMembersWindow = new Window_PartyChangeCandidateMembers(rect);
        this._candidateMembersWindow.setHandler("ok", this.onCandidateMemberWindowOk.bind(this));
        this._candidateMembersWindow.setHandler("cancel", this.onCandidateMemberWindowCancel.bind(this));
        this.addWindow(this._candidateMembersWindow);
    };

    /**
     * メンバー候補ウィンドウの矩形領域を得る。
     * 
     * @returns {number} メンバー候補ウィンドウ矩形領域
     */
    Scene_PartyChange.prototype.candidateMembersWindowRect = function() {
        const rect = this.partyMemberWindowRect();
        const wx = rect.x;
        const wy = rect.y + rect.height;
        const ww = rect.width;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスウィンドウを作成する。
     */
    Scene_PartyChange.prototype.createStatusWindow = function() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_PartyChangeStatus(rect);
        this.addWindow(this._statusWindow);

        this._partyMemberWindow.setStatusWindow(this._statusWindow);
        this._candidateMembersWindow.setStatusWindow(this._statusWindow);
    };

    /**
     * ステータスウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域
     */
    Scene_PartyChange.prototype.statusWindowRect = function() {
        const rect = this.partyMemberWindowRect();
        const wx = 0;
        const wy = rect.y;
        const ww = this.statusAreaWidth();
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスエリアの幅を得る。
     * 
     * @returns {number} ステータスエリアの幅
     */
    Scene_PartyChange.prototype.statusAreaWidth = function() {
        return statusAreaWidth;
    };

    /**
     * パーティーメンバーウィンドウの高さを得る。
     * 
     * @returns {number} パーティーメンバーウィンドウの高さ
     */
    Scene_PartyChange.prototype.partyMemberWindowHeight = function() {
        return partyMemberWindowHeight;
    };

    /**
     * シーンを開始する。
     */
    Scene_PartyChange.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._candidateMembersWindow.refresh();
        this._partyMemberWindow.refresh();
        this._partyMemberWindow.activate();
    };

    /**
     * パーティーメンバー選択ウィンドウでOK操作されたときの処理を行う。
     */
    Scene_PartyChange.prototype.onPartyMemberWindowOk = function() {
        this._partyMemberWindow.deactivate();
        const actor = this._partyMemberWindow.actor();
        this._candidateMembersWindow.setTradeTarget(actor);
        this._candidateMembersWindow.activate();
    };


    /**
     * パーティーメンバー選択ウィンドウでキャンセル操作されたときの処理を行う。
     */
    Scene_PartyChange.prototype.onPartyMemberWindowCancel = function() {
        if ($gameParty.members().length === 0) {
            SoundManager.playBuzzer();
            this._partyMemberWindow.activate();
        } else {
            this.popScene();
        }
    };

    /**
     * 候補ウィンドウでOK操作されたときの処理を行う。
     */
    Scene_PartyChange.prototype.onCandidateMemberWindowOk = function() {
        this._candidateMembersWindow.deactivate();
        this.processChangeParty();
        this._candidateMembersWindow.select(-1);
        this._partyMemberWindow.refresh();
        this._candidateMembersWindow.refresh();
        this._partyMemberWindow.activate();

    };
    /**
     * 候補ウィンドウでキャンセル操作されたときの処理を行う。
     */
    Scene_PartyChange.prototype.onCandidateMemberWindowCancel = function() {
        this._candidateMembersWindow.deactivate();
        this._candidateMembersWindow.select(-1);
        this._partyMemberWindow.activate();
    };


    /**
     * メンバーを変更する。
     */
    Scene_PartyChange.prototype.processChangeParty = function() {
        // メンバー変更
        const srcActor = this._partyMemberWindow.actor();
        const dstActor = this._candidateMembersWindow.actor();

        if (debugEnable) {
            console.log((srcActor ? srcActor.name() : "(empty)")
                    + " -> " + (dstActor ? dstActor.name() : "(empty)"));
        }
        if (srcActor !== null) {
            if (dstActor !== null) {
                if (srcActor === dstActor) {
                    // Same actor -> Remove 
                    if ($gameParty.changeableMembers().includes(srcActor.actorId())) {
                        // 変更可能メンバーに含まれる場合のみ外す。
                        this.doRemoveActor(srcActor.actorId());
                    }
                } else if ($gameParty.allMembers().includes(dstActor)) {
                    // Swap order.
                    const srcIndex = $gameParty.allMembers().indexOf(srcActor);
                    const dstIndex = $gameParty.allMembers().indexOf(dstActor);
                    this.doSwapOrder(srcIndex, dstIndex);
                } else {
                    // Swap actor.
                    this.doChangeParty(srcActor, dstActor);
                }
            } else {
                // Remove srcActor member.
                this.doRemoveActor(srcActor.actorId());
            }
        } else {
            if (dstActor !== null) {
                // Add 
                if ($gameParty.allMembers().includes(dstActor)) {
                    const srcIndex = $gameParty.members().indexOf(dstActor);
                    this.doSwapOrder(srcIndex, $gameParty.members().length - 1);
                } else {
                    this.doAddActor(dstActor.actorId());
                }
            } else {
                // src & dst is null.
            }
        }
    };

    /**
     * パーティー変更する。
     * 
     * @param {Game_Actor} srcActor 入れ替えるアクター
     * @param {Game_Actor} dstActor 入れ替え先のアクター
     */
    Scene_PartyChange.prototype.doChangeParty = function(srcActor, dstActor) {
        const insertIndex = $gameParty.allMembers().indexOf(srcActor);
        $gameParty.removeActor(srcActor.actorId());
        $gameParty.addActor(dstActor.actorId());
        for (let id = $gameParty.allMembers().length - 1; id > insertIndex; id--) {
            $gameParty.swapOrder(id, id - 1);
        }
    };

    /**
     * アクターを外す
     * 
     * @param {number} actorId アクターID
     */
    Scene_PartyChange.prototype.doRemoveActor = function(actorId) {
        $gameParty.removeActor(actorId);
    };

    /**
     * 順序を入れ替える。
     * 移動元インデックスから移動先のインデックスに動く。挟まれるメンバーは1つずつずれる。
     * 
     * @param {number} srcIndex 移動元のインデックス
     * @param {number} dstIndex 移動先のインデックス
     */
    Scene_PartyChange.prototype.doSwapOrder = function(srcIndex, dstIndex) {
        if (srcIndex > dstIndex) {
            for (let id = srcIndex; id > dstIndex; id--) {
                $gameParty.swapOrder(id, id - 1);
            }
        } else {
            for (let id = srcIndex; id < dstIndex; id++) {
                $gameParty.swapOrder(id, id + 1);
            }
        }
    };

    /**
     * アクターを追加する。
     * 
     * @param {number} actorId アクターID
     */
    Scene_PartyChange.prototype.doAddActor = function(actorId) {
        $gameParty.addActor(actorId);
    };

    if (menuEnable) {
        //------------------------------------------------------------------------------
        // Window_MenuCommand
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        /**
         * メニューにオリジナルコマンドを追加する。
         */
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.call(this);
            this.addCommand(menuCommandText, "partyChange", $gameSystem.isPartyChangeEnabled());
        };
    
        //------------------------------------------------------------------------------
        // Scene_Menu
        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        /**
         * コマンドウィンドウを作成する。
         */
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.call(this);
            this._commandWindow.setHandler("partyChange", this.commandPartyChange.bind(this));
        };

        /**
         * メニューでPartyChangeが選択されたときの処理を行う。
         */
        Scene_Menu.prototype.commandPartyChange = function() {
            SceneManager.push(Scene_PartyChange);
        };
    }

})();
