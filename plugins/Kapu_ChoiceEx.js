/*:ja
 * @target MZ 
 * @plugindesc UIユーティリティコマンドプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command setChoicePosition
 * @text 選択肢の位置設定
 * 
 * @arg x
 * @text x
 * @desc x位置。(-1でデフォルトの位置)
 * @type number
 * @min -1
 * @default -1
 * 
 * @arg y
 * @text y
 * @desc y位置。(-1でデフォルトの位置)
 * @type number
 * @min -1
 * @default -1
 * 
 * @arg maxRow
 * @text 最大行数
 * @desc 最大行数。
 * @type number
 * @default 6
 * 
 * @command setChoiceVariableId
 * @text 選択肢格納変数ID
 * 
 * @arg variableId
 * @text 変数ID
 * @type variable
 * @default 1
 * 
 * @command setChoiceRect
 * @text 選択肢ウィンドウの矩形領域設定
 * 
 * @arg x
 * @text x
 * @desc x位置。(-1でデフォルトの位置)
 * @type number
 * @min -1
 * @default -1
 * 
 * @arg y
 * @text y
 * @desc y位置。(-1でデフォルトの位置)
 * @type number
 * @min -1
 * @default -1
 * 
 * @arg width
 * @text 幅
 * @desc 幅。(-1でデフォルトの幅)
 * @type number
 * @min -1
 * @default -1
 * 
 * @arg height
 * @text 高さ
 * @desc 高さ。(-1でデフォルトの高さ)
 * @type number
 * @min -1
 * @default -1
 * 
 * 
 * @command setupChoiceOption
 * @text 選択肢オプション
 * @desc 選択肢を選択したときのオプション処理有効・無効を設定する
 * 
 * @arg helpControl
 * @text 選択肢ヘルプを表示する
 * @desc 選択切り替え毎に、分岐直下にある「選択肢ヘルプキーワード」の説明をメッセージウィンドウに表示する。
 * @type boolean
 * @default false
 * 
 * @arg pictureControl
 * @text 選択毎にピクチャ操作する
 * @desc 分岐直下にあるピクチャ処理を有効にする。
 * @type boolean
 * @default false
 * 
 * 
 * @param maxPageRow
 * @text 1ページに表示される行数
 * @type number
 * @desc 1ページに表示される行数
 * @default 6
 * 
 * @param disabledIndex
 * @text デフォルト位置
 * @desc [デフォルト]となる選択肢が、条件指定により表示されない場合のデフォルト位置
 * @type select
 * @option なし
 * @value none
 * @option トップ
 * @value top
 * @default none
 * 
 * 
 * @param choiceHelpKeyword
 * @text 選択肢ヘルプキーワード
 * @desc 選択肢に対応する「キーワード注釈」として使用する文字列。
 * @type string
 * @default 選択肢ヘルプ
 * @parent command
 * 
 * 
 * @help
 * 木星ペンギン氏の選択肢拡張プラグインをMZ向けに移植・拡張。
 * 
 *   制作元：木星ペンギン氏
 *   選択肢拡張プラグイン
 *   URL : http://woodpenguin.blog.fc2.com/
 *   
 * 
 * 機能
 * ・条件分岐の連結
 *   連続して条件分岐が記述されたとき、
 *   それらの条件分岐を連結して表示する。
 *   デフォルト及びキャンセル分岐は、
 *   連結対象の条件分岐で最後に登場した選択肢が使用される。
 * 
 * ・選択肢表示条件付与
 *   選択肢欄に if(condition$) を記述すると、condition$を評価して
 *   trueになるとき表示する。
 *   選択肢欄に記述した condition$ は画面上には表示されない。
 *   未指定の場合には表示される。
 * 
 * ・選択可能条件付与
 *   選択肢欄に en(condition$) を記述すると、condition$を評価して
 *   trueになるとき選択可能になる。
 *   未指定の場合には選択可能となる。
 * 
 * ・選択肢ヘルプ機能
 *   選択肢ラベルの直後にある、「選択肢ヘルプキーワード」が１行目に書かれた「注釈」を
 *   選択肢にカーソルが当たったとき、ヘルプテキストとして使用する。
 *   ON/OFF可。デフォルトはOFF。
 * 
 * ・選択肢画像操作機能
 *   選択肢ラベルに記載されている、「ピクチャの処理（表示/移動/回転/色調変更/消去）」を
 *   選択肢にカーソルが当たったとき、実行する。
 *   ON/OFF可。デフォルトはOFF。
 * 
 * ■ 使用時の注意
 * 他の選択肢プラグインと競合すると思います。
 * 
 * ■ プラグイン開発者向け
 * 
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 選択肢の位置設定
 *   選択肢ウィンドウのx, y, 表示行数を指定する。
 *   選択肢前に呼び出すことで、次に表示する選択肢の
 *   位置を設定することができる。
 * 
 * 選択肢格納変数ID
 *   選択肢が切り替わったとき、選択肢番号を
 *   格納する変数を指定することができる。
 *   連結している場合、x10のオフセットが付く。
 *   例えば2つ連結していた場合、2つめの選択肢は10になる。
 * 
 * 選択肢ウィンドウの矩形領域設定
 *   選択肢ウィンドウの矩形領域を設定することができる。
 * 
 * 選択肢オプション
 *   選択肢ヘルプ、選択肢画像操作のON/OFFをすることができる。
 *   選択肢分岐の直前に呼び出して、各項目のON/OFFをすることを想定する。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノータグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 木星ペンギン氏のChoiceEX用プラグインを元に作成。
 */



(() => {
    const pluginName = "Kapu_ChoiceEx";
    const parameters = PluginManager.parameters(pluginName);

    const maxPageRow = Number(parameters["maxPageRow"]) || 6;
    const disabledIndex = parameters["disabledIndex"] || "none";
    const choiceHelpKeyword = parameters["choiceHelpKeyword"] || "ChoiceHelp";
    const CHOICE_OFFSET = 10;


    PluginManager.registerCommand(pluginName, "setChoicePosition", args => {
        let x = Number(args.x);
        if (!(x >= 0)) {
            x = -1;
        }
        let y = Number(args.y);
        if (!(y >= 0)) {
            y = -1;
        }
        let maxRow = Number(args.maxRow);
        if (!(maxRow >= 0)) {
            maxRow = 6;
        }
        $gameMessage.setChoicePos(x, y, maxRow);
    });

    PluginManager.registerCommand(pluginName, "setChoiceVariableId", args => {
        const id = Number(args.variableId) || 0;
        if (id > 0) {
            $gameMessage.setChoiceVariableId(id);
        }
    });

    PluginManager.registerCommand(pluginName, "setChoiceRect", args => {
        let x = Number(args.x);
        if (!(x >= 0)) {
            x = -1;
        }
        let y = Number(args.y);
        if (!(y >= 0)) {
            y = -1;
        }
        let width = Number(args.width);
        if (!(width >= 0)) {
            width = -1;
        }
        let height = Number(args.height);
        if (!(height >= 0)) {
            height = -1;
        }
        $gameMessage.setChoiceRect(x, y, width, height);
    });

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "setupChoiceOption", args => {
        const pictureControl = (typeof args.pictureControl === "undefined")
                ? false : (args.pictureControl === "true");
        const helpControl = (typeof args.helpControl === "undefined")
                ? false : (args.helpControl === "true");
        $gameMessage.setChoiceControlPicture(pictureControl);
        $gameMessage.setChoiceControlHelp(helpControl);
    });

    //------------------------------------------------------------------------------
    // Game_Message

    const _Game_Message_clear = Game_Message.prototype.clear;
    /**
     * ゲームメッセージをクリアする。
     */
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.call(this);
        this._choiceEnables = [];
        this._choiceResults = [];
        this._choiceIndices = [];
        this._choiceX = -1;
        this._choiceY = -1;
        this._choiceWidth = -1;
        this._choiceHeight = -1;
        this._choiceMaxRow = maxPageRow;
        this._choiceVariableId = 0;
        this._choiceSelectedIndex = -1;
        this._choiceSelectingCallback = null;
        this._choiceControlPicture = false;
        this._choiceControlHelp = false;
        this._choiceHelpTexts = [];
        this._choiceHelpText = [];
        this.choiceUnderMes = false;
    };

    /**
     * コールバック変数を設定する。
     * 
     * @param {function} callback コールバック関数
     */
    Game_Message.prototype.setChoiceSelectingCallback = function(callback) {
        this._choiceSelectingCallback = callback;
    };

    /**
     * 選択肢が切り替わったときの処理を行う。
     */
    Game_Message.prototype.onChoiceSelecting = function() {
        if (this._choiceSelectingCallback) {
            this._choiceSelectingCallback(this._choiceSelectedIndex);
        }
    };

    /**
     * 選択肢ウィンドウの選択が変わったときの処理を行う。
     * 
     * @param {Number} index 選択肢ウィンドウの選択インデックス番号
     */
    Game_Message.prototype.choiceSelectionChanged = function(index) {
        this._choiceSelectedIndex = index;
        this.onChoiceSelecting();
    };



    /**
     * 選択肢値を格納する変数IDを得る。
     * 
     * @returns {Number} 変数ID
     */
    Game_Message.prototype.choiceVariableId = function() {
        return this._choiceVariableId;
    };
    
    /**
     * 有効フラグ配列を設定する。
     * 
     * @param {Array<Boolean>} enables 有効フラグ配列
     */
    Game_Message.prototype.setChoiceEnables = function(enables) {
        this._choiceEnables = enables;
    };
    
    /**
     * 有効フラグ配列を取得する。
     * 
     * @returns {Array<Boolean>} 有効フラグ配列。
     */
    Game_Message.prototype.choiceEnables = function() {
        return this._choiceEnables;
    };

    /**
     * 選択結果配列を設定する。
     * 
     * @param {Array<Number>} results 選択結果配列
     */
    Game_Message.prototype.setChoiceResults = function(results) {
        this._choiceResults = results;
    };

    /**
     * 選択肢毎のスクリプト上のインデックス位置を設定する。
     * 
     * @param {Array<Number>} indices インデックス配列
     */
    Game_Message.prototype.setChoiceIndices = function(indices) {
        this._choiceIndices = indices;
    };

    /**
     * 選択肢毎のスクリプト上のインデックス位置を得る。
     * 
     * @returns {Array<Number>} インデックス位置配列
     */
    Game_Message.prototype.choiceIndices = function() {
        return this._choiceIndices;
    };

    /**
     * 選択結果配列を得る。
     * 
     * @returns {Array<Number>} 選択結果配列
     */
    Game_Message.prototype.choiceResults = function() {
        return this._choiceResults;
    };

    /**
     * ヘルプテキスト配列を設定する。
     * 
     * @param {Array<String>} texts テキスト配列
     */
    Game_Message.prototype.setChoiceHelpTexts = function(texts) {
        this._choiceHelpTexts = texts;
    };

    /**
     * ヘルプテキスト文字列を得る。
     * 
     * @param {Number} index インデックス番号
     * @returns {Array<String>} ヘルプテキスト配列
     */
    Game_Message.prototype.choiceHelpText = function(index) {
        const texts = this._choiceHelpTexts[index];
        return texts || [""];
    };

    /**
     * 選択肢ヘルプ文字列を更新する。
     * 
     * @param {Number} index 選択肢インデックス番号
     */
    Game_Message.prototype.updateChoiceHelp = function(index) {
        this._choiceHelpText = this.choiceHelpText(index)
        this._texts = this._choiceHelpText;
    }

    /**
     * ヘルプかどうかを得る。
     * 
     * @returns {Boolean} ヘルプの場合にはtrue, それ以外はfalse
     */
    Game_Message.prototype.isHelp = function() {
        return this._choiceHelpText.length > 0;
    };
    
    /**
     * 選択肢ウィンドウの位置を設定する。
     * 
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} row 行数
     */
    Game_Message.prototype.setChoicePos = function(x, y, row) {
        this._choiceX = x;
        this._choiceY = y;
        this._choiceWidth = -1;
        this._choiceHeight = -1;
        this._choiceMaxRow = row;
    };

    /**
     * 選択肢ウィンドウ位置とサイズを設定する。
     * 
     * @param {Number} x x位置
     * @param {Number} y y位置
     * @param {Number} width 幅
     * @param {Number} height 高さ
     */
    Game_Message.prototype.setChoiceRect = function(x, y, width, height) {
        this._choiceX = x;
        this._choiceY = y;
        this._choiceWidth = width;
        this._choiceHeight = height;
    };

    /**
     * 選択肢ウィンドウのx位置を得る。
     * 
     * @returns {Number} x位置
     */
    Game_Message.prototype.choiceX = function() {
        return this._choiceX;
    };

    /**
     * 選択肢ウィンドウのy位置を得る。
     * 
     * @returns {Number} y位置
     */
    Game_Message.prototype.choiceY = function() {
        return this._choiceY;
    };

    /**
     * 選択肢ウィンドウの幅を得る。
     * 
     * @returns {Number} 選択肢ウィンドウの幅
     */
    Game_Message.prototype.choiceWidth = function() {
        return this._choiceWidth;
    };

    /**
     * 選択肢ウィンドウの高さを得る。
     * 
     * @returns {Number} 選択肢ウィンドウの幅
     */
    Game_Message.prototype.choiceHeight = function() {
        return this._choiceHeight;
    };

    /**
     * 最大行数を得る。
     * 
     * @returns {Number} 最大行数
     */
    Game_Message.prototype.choiceMaxRow = function() {
        return this._choiceMaxRow;
    };

    /**
     * 選択肢変数IDを設定する。
     * 
     * @param {Number} id 変数ID
     */
    Game_Message.prototype.setChoiceVariableId = function(id) {
        this._choiceVariableId = id;
    };

    /**
     * heightだけ選択肢ウィンドウの位置をずらす。
     * 
     * @param {Number} height 高さ
     */
    Game_Message.prototype.shiftLine = function(height) {
        this._choiceY += height;
        this._choiceHeight -= height;
    };

    /**
     * 選択肢選択中に、画像の操作を行うかどうかを設定する。
     * 
     * @param {Boolean} enabled 有効にする場合にはtrue, それ以外はfalse
     */
    Game_Message.prototype.setChoiceControlPicture = function(enabled) {
        this._choiceControlPicture = enabled;
    };

    /**
     * 選択肢選択中に、画像の操作を行うかどうかを取得する。
     * 
     * @returns {Boolean} 有効な場合にはtrue, それ以外はfalse
     */
    Game_Message.prototype.choiceControlPicture = function() {
        return this._choiceControlPicture;
    };

    /**
     * ヘルプ操作を有効にするかどうかを設定する。
     * 
     * @param {Boolean} enabled ヘルプ操作を有効にする場合にはtrue、それ以外はfalse
     */
    Game_Message.prototype.setChoiceControlHelp = function(enabled) {
        this._choiceControlHelp = enabled;
    };

    /**
     * ヘルプ操作が有効かどうかを得る。
     * 
     * @returns {Boolean} ヘルプ操作が有効な場合にはtrue、それ以外はfalse
     */
    Game_Message.prototype.choiceControlHelp = function() {
        return this._choiceControlHelp;
    };

    //------------------------------------------------------------------------------
    // Game_Interpreter
    const _Game_Interpreter_clear = Game_Interpreter.prototype.clear;
    /**
     * Game_interpreterをクリアする。
     */
    Game_Interpreter.prototype.clear = function() {
        _Game_Interpreter_clear.call(this);
        this.clearChoiceData();
    };

    /**
     * 選択肢データをクリアする。
     */
    Game_Interpreter.prototype.clearChoiceData = function() {
        this._choiceData = {
            choices: [],
            enables: [],
            results: [],
            choiceIndices: [],
            helpTexts: [],
            cancelType: -1,
            defaultType: -1,
            positionType: 0,
            background: 0
        };
    };
    /**
     * 選択肢をセットアップする。
     * 
     * params[0] : {Array<String>} 選択肢の配列    
     * params[1] : {Number} キャンセル選択の番号    
     * params[2] : {Number} デフォルト選択の番号    
     * params[3] : {Number} 位置(0:画面左端,1:中央,2:画面右端)    
     * params[4] : {Number} 背景(0:不透明。通常のウィンドウ背景。 1:調光した背景, 2:完全透過)
     * 
     * @param {Array<Object>} params パラメータ。
     * 
     * !!!overwrite!!! Game_Interpreter.setupChoices()
     *     選択肢の位置などを設定できるようにするため、オーバーライドする。
     */
    Game_Interpreter.prototype.setupChoices = function(params) {
        this.clearChoiceData();
        this.addChoices(params, this._index, 0);
        if (this._choiceData.choices.length > 0) {
            const helpTexts = (this._choiceData.helpTexts.length > 0)
                    ? this._choiceData.results.map( i => this._choiceData.helpTexts[i]) : [];
            let cancelType = -1;
            if ((this._choiceData.cancelType.mod(CHOICE_OFFSET) === 8)
                    || this._choiceData.results.contains(this._choiceData.cancelType)) {
                this._choiceData.results.push(this._choiceData.cancelType);
                cancelType = this._choiceData.choices.length;
            }
            let index = this._choiceData.defaultType;
            if ($gameMessage._choiceVariableId > 0) {
                index = $gameVariables.value($gameMessage._choiceVariableId);
            }
            let defaultType = this._choiceData.results.indexOf(index);
            if ((index >= 0) && (defaultType < 0) && (disabledIndex === "top"))  {
                defaultType = 0;
            }
            $gameMessage.setChoices(this._choiceData.choices, defaultType, cancelType);
            $gameMessage.setChoiceEnables(this._choiceData.enables);
            $gameMessage.setChoiceIndices(this._choiceData.choiceIndices);
            $gameMessage.setChoiceResults(this._choiceData.results);
            $gameMessage.setChoiceHelpTexts(helpTexts);
            $gameMessage.setChoiceBackground(this._choiceData.background);
            $gameMessage.setChoicePositionType(this._choiceData.positionType);
            $gameMessage.setChoiceSelectingCallback(this.onChoicing.bind(this));
            $gameMessage.setChoiceCallback(this.onChoiced.bind(this));
        } else {
            this._branch[this._indent] = -1;
        }
    };

    /**
     * 選択肢が切り替わったときの処理を行う。
     * 
     * @param {Number} index インデックス番号
     */
    Game_Interpreter.prototype.onChoicing = function(index) {
        const choiceIndex = this._choiceData.results[index];
        // 分岐ラベルを探して、該当する分岐の下にある、ピクチャの処理があれば実行する。
        if ($gameMessage.choiceControlPicture()) {
            const scriptBranchIndex = this.findChoiceLabelIndex(choiceIndex);
            if (scriptBranchIndex >= 0) {
                this.processChoicePictureControl(scriptBranchIndex);
            }
        }
    };

    Game_Interpreter.prototype.processChoicePictureControl = function(scriptBranchIndex) {
        const indent = this._indent + 1;
        for (let scriptIndex = scriptBranchIndex + 1; scriptIndex < this._list.length; scriptIndex++) {
            const command = this._list[scriptIndex];
            if (!command || (command.code === 0) || (command.indent !== indent)) {
                // 異なる階層or空のコマンド
                break;
            }
            if ((command.code === 231) || (command.code === 232) || (command.code === 233)
                    || (command.code === 234) || (command.code === 235)) {
                const methodName = "command" + command.code;
                if (typeof this[methodName] === "function") {
                    this[methodName](command.parameters);
                }
            }
        }
    };

    Game_Interpreter.prototype.findChoiceLabelIndex = function(choiceIndex) {
        let choiceOffset = 0;
        for (let scriptIndex = this._index; scriptIndex < this._list.length; scriptIndex++) {
            const command = this._list[scriptIndex];
            if (command.code === 402) {
                // 条件分岐ラベル
                if ((command.parameters[0] + choiceOffset) === choiceIndex) {
                    // この条件分岐ラベルが選択肢と一致するやつ。
                    return scriptIndex;
                }
            } else if (command.code === 404) {
                choiceOffset += CHOICE_OFFSET;
            }
        }

        return -1;
    };

    /**
     * 選択肢で選択された時の処理を行う。
     * 
     * @param {Number} index インデックス番号
     */
    Game_Interpreter.prototype.onChoiced = function(index) {
        this._branch[this._indent] = this._choiceData.results[index];
        $gameMessage.setChoiceSelectingCallback(null);
    };

    /**
     * 選択肢を追加する。再起コール用のインタフェース。
     * 
     * @param {Array<Object>} params パラメータ。
     * @param {Number} scriptIndex スクリプトインデックス
     * @param {Number} choiceIndexOffs 選択肢インデックスオフセット
     */
    Game_Interpreter.prototype.addChoices = function(params, scriptIndex, choiceIndexOffs) {
        for (let n = 0; n < params[0].length; n++) {
            this.addChoice(n + choiceIndexOffs, params[0][n]);
        }
        const cancelType = params[1];
        if (cancelType !== -1) {
            this._choiceData.cancelType = cancelType + choiceIndexOffs;
        }
        const defaultType = params.length > 2 ? params[2] : 0;
        if (defaultType >= 0) {
            this._choiceData.defaultType = defaultType + choiceIndexOffs;
        }
        this._choiceData.positionType = (params.length > 3) ? params[3] : 2;
        this._choiceData.background = (params.length > 4) ? params[4] : 0;
        let command;
        for (;;) {
            scriptIndex++;
            command = this._list[scriptIndex];
            if (!command) {
                break; // command is null.
            }
            if (command.indent === this._indent) {
                if (command.code === 402) {
                    // 条件分岐ラベル
                    const choiceIndex = command.parameters[0] + choiceIndexOffs;
                    this._choiceData.helpTexts[choiceIndex] = this.getHelpText(scriptIndex);
                    this._choiceData.choiceIndices[choiceIndex] = scriptIndex;
                } else if (command.code === 404) {
                    // 分岐終了
                    break;
                }
            }
        }
        command = this._list[scriptIndex + 1];
        if (command && (command.code === 102)) {
            // 選択肢の表示があるときは、分岐を合成する。
            this.addChoices(command.parameters, scriptIndex + 1,
                    choiceIndexOffs + CHOICE_OFFSET, scriptIndex + 1);
        }
    };

    /**
     * 選択肢を追加する。
     * 
     * @param {Number} choiceIndex 選択肢に割り当てるインデックス番号。
     * @param {String} str 選択肢文字列
     */
    Game_Interpreter.prototype.addChoice = function(choiceIndex, str) {
        const patternCondition = /\s*if\((.+?)\)/;
        const patternEnable = /\s*en\((.+?)\)/;

        if (patternCondition.test(str)) {
            str = str.replace(patternCondition, ""); // 該当パターン部分を置き換えて非表示
            if (RegExp.$1 && !this.evalChoice(RegExp.$1)) {
                return ;
            }
        }
        let enable = true;
        if (patternEnable.test(str)) {
            str = str.replace(patternEnable, ""); // 該当パターン部分を置き換えて非表示
            enable = this.evalChoice(RegExp.$1);
        }
        this._choiceData.choices.push(str);
        this._choiceData.enables.push(enable);
        this._choiceData.results.push(choiceIndex);
    };
    
    /**
     * 選択肢のヘルプテキストを得る。
     * 
     * @param {Number} scriptIndex 分岐エントリのスクリプトインデックス
     * @returns {String} ヘルプテキスト
     */
    Game_Interpreter.prototype.getHelpText = function(scriptIndex) {
        const texts = [];
        const commentIndex = scriptIndex + 1;
        if ((this._list[commentIndex].code === 108)
                && (this._list[commentIndex].parameters[0] === choiceHelpKeyword)) {
            for (let index = commentIndex + 1; this._list[index].code === 408; index++) {
                texts.push(this._list[index].parameters[0]);
            }
        }
        return texts;
    };
    
    /**
     * 選択肢を評価する。
     * 
     * @param {String} formula 
     * @returns {Boolean} 選択肢が有効な場合にはtrue, それ以外はfalse.
     */
    Game_Interpreter.prototype.evalChoice = function(formula) {
        try {
            const s = $gameSwitches._data; // eslint-disable-line no-unused-vars
            const formula2 = formula.replace(/v\[(\d+)\]/g, (match, p1) => $gameVariables.value(parseInt(p1)) );
            return !!eval(formula2);
        } catch (e) {
            console.error(pluginName + "evalChoice error.:" + formula);
            return true;
        }
    };

    // When Cancel
    /**
     * キャンセルの時
     */
    Game_Interpreter.prototype.command403 = function() {
        if (this._branch[this._indent] !== -2) {
            // 選択された分岐コードが-2でない場合、
            // このキャンセル時の分岐ラベルは選択されていないので無視する。
            this.skipBranch();
        }
        return true;
    };

    /**
     * 分岐終了の時
     */
    Game_Interpreter.prototype.command404 = function() {
        if (this.nextEventCode() === 102) {
            // 分岐終了を検出したら、選択された分岐をオフセット分減算する。
            this._branch[this._indent] -= CHOICE_OFFSET;
            this._index++;
        }
        return true;
    };

    //------------------------------------------------------------------------------
    // Window_ChoiceList

    const _Window_ChoiceList_initialize = Window_ChoiceList.prototype.initialize;
    /**
     * Window_ChoiceListを初期化する。
     */
    Window_ChoiceList.prototype.initialize = function() {
        _Window_ChoiceList_initialize.call(this);
        this._prevIndex = -1;
    };

    const _Window_ChoiceList_windowX = Window_ChoiceList.prototype.windowX;
    /**
     * 選択肢ウィンドウのX位置を得る。
     * 
     * @returns {Number} x位置
     */
    Window_ChoiceList.prototype.windowX = function() {
        let x = $gameMessage.choiceX();
        if (!(x >= 0)) {
            x = _Window_ChoiceList_windowX.call(this);
        }
        const width = this.windowWidth();
        return Math.min(x, Graphics.boxWidth - width);
    };

    /**
     * 選択ウィンドウのY位置を得る。
     * 
     * @returns {Number} y位置
     */
    Window_ChoiceList.prototype.windowY = function() {
        let y = $gameMessage.choiceY();
        if (!(y >= 0)) {
            y = _Window_ChoiceList_windowX.call(this);
        }
        const height = this.windowHeight();
        return Math.min(y, Graphics.boxHeight - height);
    };

    const _Window_ChoiceList_windowWidth = Window_ChoiceList.prototype.windowWidth;
    /**
     * ウィンドウ幅を得る。
     * 
     * @returns {Number} ウィンドウ幅
     */
    Window_ChoiceList.prototype.windowWidth = function() {
        const width = $gameMessage.choiceWidth();
        if (width >= 0) {
            return Math.min(width, Graphics.boxWidth);
        } else {
            return _Window_ChoiceList_windowWidth.call(this);
        }
    };

    const _Window_ChoiceList_windowHeight = Window_ChoiceList.prototype.windowHeight;
    /**
     * ウィンドウ高さを得る。
     * 
     * @returns {Number} ウィンドウ高さ
     */
    Window_ChoiceList.prototype.windowHeight = function() {
        const height = $gameMessage.choiceHeight();
        if (height >= 0) {
            return Math.min(height, Graphics.boxHeight);
        } else {
            return _Window_ChoiceList_windowHeight.call(this);
        }
    };

    /**
     * ウィンドウの行数を得る。
     * 
     * @returns {Number} ウィンドウ行数
     * !!!overwrite!!! Window_ChoiceList.numVisibleRows()
     *     返す有効行数を変更するため、オーバーライドする。
     */
    Window_ChoiceList.prototype.numVisibleRows = function() {
        return Math.min($gameMessage.choices().length, $gameMessage.choiceMaxRow());
    };

    /**
     * コマンドリストを作成する。
     * 
     * !!!overwrite!!! Window_ChoiceList.makeCommandList()
     *     選択肢を作成するためオーバーライドする。
     */
    Window_ChoiceList.prototype.makeCommandList = function() {
        const choices = $gameMessage.choices();
        const enables = $gameMessage._choiceEnables;
        for (let i = 0; i < choices.length; i++) {
            this.addCommand(choices[i], 'choice', enables[i]);
        }
    };

    const _Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;
    /**
     * 選択肢の項目を描画する。
     * 
     * @param {Number} index インデックス番号
     */
    Window_ChoiceList.prototype.drawItem = function(index) {
        this.changePaintOpacity(this.isCommandEnabled(index));
        _Window_ChoiceList_drawItem.call(this, index);
    };

    const _Window_ChoiceList_callOkHandler = Window_ChoiceList.prototype.callOkHandler;
    /**
     * OKハンドラを呼ぶ
     */
    Window_ChoiceList.prototype.callOkHandler = function() {
        _Window_ChoiceList_callOkHandler.call(this);
        this._messageWindow.forceClear();
    };

    const _Window_ChoiceList_callCancelHandler = Window_ChoiceList.prototype.callCancelHandler;
    /**
     * キャンセルハンドラを呼ぶ
     */
    Window_ChoiceList.prototype.callCancelHandler = function() {
        _Window_ChoiceList_callCancelHandler.call(this);
        this._messageWindow.forceClear();
    };

    const _Window_ChoiceList_select = Window_ChoiceList.prototype.select;
    /**
     * 選択する
     * 
     * @param {Number} index インデックス番号
     */
    Window_ChoiceList.prototype.select = function(index) {
        _Window_ChoiceList_select.call(this, index);
        this.setIndexToVariable();
    };

    const _Window_ChoiceList_update = Window_ChoiceList.prototype.update;
    /**
     * 選択肢ウィンドウを更新する。
     */
    Window_ChoiceList.prototype.update = function() {
        _Window_ChoiceList_update.call(this);
        if (this._prevIndex !== this.index()) {
            this._prevIndex = this.index();
            this.setIndexToVariable();
        }
    };

    /**
     * 選択された値を変数に格納する。
     */
    Window_ChoiceList.prototype.setIndexToVariable = function() {
        const variableId = $gameMessage.choiceVariableId();
        if (variableId > 0) {
            const index = this.index();
            const results = $gameMessage.choiceResults();
            $gameVariables.setValue(variableId, results[index]);
        }
    };

    const _Window_ChoiceList_close = Window_ChoiceList.prototype.close;
    /**
     * 選択肢ウィンドウを閉じる。
     */
    Window_ChoiceList.prototype.close = function() {
        if ($gameMessage.isHelp()) {
            this._messageWindow.onShowFast();
        }
        _Window_ChoiceList_close.call(this);
    };

    const _Window_ChoiceList_processCancel = Window_ChoiceList.prototype.processCancel;
    /**
     * キャンセル処理する。
     */
    Window_ChoiceList.prototype.processCancel = function() {
        const type = $gameMessage.choiceCancelType();
        const results = $gameMessage.choiceResults();
        const index = results.indexOf(results[type]);
        if (this.isCancelEnabled() && (index !== type) && !this.isCommandEnabled(index)) {
            this.playBuzzerSound();
        } else {
            _Window_ChoiceList_processCancel.call(this, ...arguments);
        }
    };
    /**
     * ヘルプメッセージを更新する。
     */
    Window_ChoiceList.prototype.callUpdateHelp = function() {
        if (this.active && this._messageWindow) {
            this.updateHelp();
        }
    };

    /**
     * ヘルプを更新する。
     */
    Window_ChoiceList.prototype.updateHelp = function() {
        if ($gameMessage.choiceControlHelp()) {
            this._messageWindow.forceClear();
            $gameMessage.updateChoiceHelp(this.index());
            this._messageWindow.startMessage();
        }
        $gameMessage.choiceSelectionChanged(this.index());
    };
    //------------------------------------------------------------------------------
    // Window_Message
    const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    /**
     * 位置を更新する。
     */
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.call(this, ...arguments);
        this.clearUnderChoice();
    };

    /**
     * 
     */
    Window_Message.prototype.clearUnderChoice = function() {
        if ($gameMessage.choiceUnderMes) {
            let x = this.x + this.standardPadding();
            x += this._textState.left || 0;
            const y = this.y + 4;
            const height = this.windowHeight();
            $gameMessage.setChoiceRect(x, y, -1, height);
        }
    };

    const _Window_Message_processNewLine = Window_Message.prototype.processNewLine;
    /**
     * 改行を処理する。
     * 
     * @param {TextState} textState テキストステート
     */
    Window_Message.prototype.processNewLine = function(textState) {
        if ($gameMessage.choiceUnderMes) {
            $gameMessage.shiftLine(textState.height);
        }
        _Window_Message_processNewLine.call(this, ...arguments);
    };

    const _Window_Message_updateInput = Window_Message.prototype.updateInput;
    /**
     * 入力を更新する。
     */
    Window_Message.prototype.updateInput = function() {
        if ($gameMessage.isHelp() && this._textState) {
            return false;
        } else {
            return _Window_Message_updateInput.call(this);
        }
    };

    const _Window_Message_onEndOfText = Window_Message.prototype.onEndOfText;
    /**
     * テキスト表示が終了したときの処理を行う。
     */
    Window_Message.prototype.onEndOfText = function() {
        if ($gameMessage.isHelp() && !this._choiceListWindow.active) {
            this.startInput();
        } else {
            _Window_Message_onEndOfText.call(this);
        }    
    };

    const _Window_Message_startInput = Window_Message.prototype.startInput;
    /**
     * 入力を開始する。
     */
    Window_Message.prototype.startInput = function() {
        if (this._choiceListWindow.active) {
            return true;
        }
        if ($gameMessage.isChoice() && $gameMessage.choiceUnderMes
                && (this._textState.x !== this._textState.left)) {
            $gameMessage.shiftLine(this._textState.height);
        }
        return _Window_Message_startInput.call(this);
    };

    /**
     * 強制的にクリアする。
     */
    Window_Message.prototype.forceClear = function() {
        this._textState = null;
        this.close();
        this._goldWindow.close();
    };

    /**
     * (たぶん)素早く表示する
     */
    Window_Message.prototype.onShowFast = function() {
        this._showFast = true;
    };
    
    //243
    const _Window_Message_newPage = Window_Message.prototype.newPage;
    /**
     * メッセージ改ページする。
     * 
     * @param {TextState} textState テキストステート
     */
    Window_Message.prototype.newPage = function(textState) {
        _Window_Message_newPage.call(this, textState);
        this.clearUnderChoice();
    };
    //------------------------------------------------------------------------------
    // Window

})();