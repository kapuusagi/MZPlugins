/*:ja
 * @target MZ 
 * @plugindesc エスケープキャラクタ拡張
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * エスケープキャラクタに以下のものを追加します。
 * 
 * 文字列置換
 * \CLASSNAME[id#] - id#のクラス名に置換します。
 * \ITEM[id#] - id#のアイテム名に置換します。
 * \WEAPON[id#] - id#の武器名に置換します。
 * \ARMOR[id#] - id#の防具名に置換します。
 * \ENEMY[id#] - id#のエネミー名に置換します。
 * \TROOP[id#] - id#のエネミーグループ名に置換します。
 * \SKILL[id#] - id#のスキル名に置換します。
 * \MAPNAME - 現在のマップ名に置換します。
 * \EVAL[formula$] - formula$を評価した結果に置換します。例) $gameVariables.value(1)|
 * 
 * 制御
 * \PLAYME[file$,volume#,pitch#,pan#] - 指定したMEを鳴らす。待機はしない。必要なら\WAITを使うこと。
 * \PLAYSE[file$,volume#,pitch#,pan#] - 指定したSEを鳴らす。待機はしない。必要なら\WAITを使うこと。
 * \FADEOUTME[time#] - MEをフェードアウトさせる。
 * \FACE[name$,index#] - name$, index# で指定される顔グラフィックを表示する
 * \AFACE[id#] - アクター id# のアクター顔グラフィックを表示する。
 * \STOPME - MEを停止
 * \CWAIT[frame#] - 1文字出力する毎に、frame#で指定したウェイトを入れます。
 *                  (瞬間表示時はウェイトが入りません。)
 *                  メッセージ切り替わりでリセットされます。
 *                  \.や\|を毎文字挿入が必要になるような、ゆっくりしたメッセージ表示をしたい場合に使用します。
 * \WAIT[frame#] - frame#で指定した量だけウェイトを入れます。60で1秒に相当します。
 * 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * ベースのソースコードを見るとわかるが、エスケープキャラクタに使用できるのは基本的にアルファベットである。
 * アルファベット以外を使用したい場合には、Window_BaseまたはWindow_MessageのobtainEscapeCodeを
 * フックまたはオーバーライドして拡張する必要がある。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * なし。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 動作確認。
 */
(() => {
    'use strict';
    /* eslint no-control-regex : 0 */
    // const pluginName = "Kapu_EscapeCharacterExtends";
    // const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "TODO:コマンド。@commsndで指定したやつ", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // TextManager

    /**
     * collection の id 要素に相当するデータの名前を得る。
     * 該当するものがなければ、空文字列を返す。
     * 
     * @param {string} collection コレクション
     * @param {number} id ID
     * @returns {string} 名前
     */
    TextManager.collectionName = function(collection, id) {
        if ((id > 0) && (collection.length)) {
            const obj = collection[id];
            if (obj) {
                return obj["name"] || "";
            } else {
                return "";
            }
        } else {
            return "";
        }
    };
    /**
     * クラス名を得る。
     * 
     * @param {number} id ID
     * @returns {string} クラス名
     */
    TextManager.className = function(id) {
        return TextManager.collectionName($dataClasses, id);
    };
    /**
     * スキル名を得る。
     * 
     * @param {number} id ID
     * @returns {string} スキル名
     */
    TextManager.skillName = function(id) {
        return TextManager.collectionName($dataSkills, id);
    };
    /**
     * アイテム名を得る。
     * 
     * @param {number} id ID
     * @returns {string} アイテム名
     */
    TextManager.itemName = function(id) {
        return TextManager.collectionName($dataItems, id);
    };

    /**
     * 武器名を得る。
     * 
     * @param {number} id ID
     * @returns {string} 武器名
     */
    TextManager.weaponName = function(id) {
        return TextManager.collectionName($dataWeapons, id);
    };

    /**
     * 防具名を得る。
     * 
     * @param {number} id ID
     * @returns {string} 武器名
     */
    TextManager.armorName = function(id) {
        return TextManager.collectionName($dataArmors, id);
    };
    /**
     * エネミー名を得る。
     * 
     * @param {number} id ID
     * @returns {string} エネミー名
     */
    TextManager.enemyName = function(id) {
        return TextManager.collectionName($dataEnemies, id);
    };
    /**
     * 敵グループ名を得る。
     * 
     * @param {number} id ID
     * @returns {string} 敵グループ名
     */
    TextManager.troopName = function(id) {
        return TextManager.collectionName($dataTroops, id);
    }

    //------------------------------------------------------------------------------
    // Window_Base
    const _Game_Message_clear = Game_Message.prototype.clear;
    /**
     * ゲームメッセージをクリアする。
     */
    Game_Message.prototype.clear = function() {
        _Game_Message_clear.call(this);
        this._renderFaceImageRequired = false;
    };

    const _Game_Message_setFaceImage = Game_Message.prototype.setFaceImage;
    /**
     * 顔グラフィックを設定する。
     * 
     * @param {string} faceName 顔グラフィックファイル名
     * @param {number} faceIndex 顔グラフィックインデックス
     */
    Game_Message.prototype.setFaceImage = function(faceName, faceIndex) {
        this._renderFaceImageRequired = (faceName != this._faceName) || (faceIndex != this._faceIndex);
        _Game_Message_setFaceImage.call(this, faceName, faceIndex);
    };
    /**
     * 顔グラフィックをレンダリングする必要があるかどうかを判定する。
     * 
     * @returns {boolean} レンダリングする必要がある場合にはtrue, それ以外はfalse.
     */
    Game_Message.prototype.renderFaceImageRequired = function() {
        return this._renderFaceImageRequired;
    };
    /**
     * 顔グラフィックをレンダリング必要性をクリアする。
     */
    Game_Message.prototype.clearRenderFaceImageRequired = function() {
        this._renderFaceImageRequired = false;
    };
    //------------------------------------------------------------------------------
    // Window_Base
    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    /**
     * エスケープキャラクタを処理する。
     * 
     * @param {string} code エスケープキャラクタ
     * @param {TextState} textState テキストステートオブジェクト
     */
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        switch (code) {
            default:
                _Window_Base_processEscapeCharacter.call(this, code, textState);
                break;
        }
    };

    /**
     * argを評価した結果の文字列を返す。
     * 
     * @param {string} arg パラメータとして検出した文字列
     * @returns 
     */
    const _evalString = function(arg) {
        try {
            return String(eval(arg)) || "";
        }
        catch (e) {
            console.error("eval(" + arg + ") failure. :" + e);
        }
        return "";
    };

    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    /**
     * エスケープキャラクタを変換する。
     * 
     * @param {string} text テキスト
     * @returns {string} 置換済みテキスト
     */
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        // \Vや\Nなどの処理
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        // eslint-disable-next-line no-unused-vars
        text = text.replace(/\x1bMAPNAME/gi, (_, p1) =>
            $gameMap.displayName()
        );
        text = text.replace(/\x1bCLASSNAME\[(\d+)\]/gi, (_, p1) =>
            TextManager.className(parseInt(p1))
        );
        text = text.replace(/\x1bSKILL\[(\d+)\]/gi, (_, p1) =>
            TextManager.skillName(parseInt(p1))
        );
        text = text.replace(/\x1bENEMY\[(\d+)\]/gi, (_, p1) =>
            TextManager.enemyName(parseInt(p1))
        );
        text = text.replace(/\x1bTROOP\[(\d+)\]/gi, (_, p1) =>
            TextManager.troopName(parseInt(p1))
        );
        text = text.replace(/\x1bITEM\[(\d+)\]/gi, (_, p1) =>
            TextManager.itemName(parseInt(p1))
        );
        text = text.replace(/\x1bWEAPON\[(\d+)\]/gi, (_, p1) =>
            TextManager.weaponName(parseInt(p1))
        );
        text = text.replace(/\x1bARMOR\[(\d+)\]/gi, (_, p1) =>
            TextManager.armorName(parseInt(p1))
        );
        text = text.replace(/\x1bEVAL\[([^\]]+)\]/gi, (_, p1) =>
            _evalString(p1)
        );

        return text;
    };
    const _Window_Message_processCharacter = Window_Base.prototype.processCharacter;
    /**
     * 文字を処理する。
     * 
     * @param {TextState} textState テキストステートオブジェクト
     */
    Window_Base.prototype.processCharacter = function(textState) {
        const prevLen = textState.buffer.length;
        _Window_Message_processCharacter.call(this, textState);
        if ((textState.buffer.length > prevLen) // 表示文字追加？
                && !this._showFast && !this._lineShowFast) { // 瞬間表示要求なし
            this._waitCount = this._characterWait;
        }
    };

    //------------------------------------------------------------------------------
    // Window_Message

    const _Window_message_initMembers = Window_Message.prototype.initMembers;
    /**
     * Window_Messageのメンバを初期化する。
     */
    Window_Message.prototype.initMembers = function() {
        _Window_message_initMembers.call(this);
        this._characterWait = 0;
    };

    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    /**
     * メッセージ表示を開始する。
     */
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.call(this);
        this._characterWait = 0; // reset.
    };

    /**
     * 新しい行の先頭x位置を得る。
     * 
     * @param {object} textState テキストステート
     * @returns {number} x位置
     * !!!overwrite!!! Window_Message.newLineX()
     *     \FACE, \AFACE機能を実現するためにオーバーライドする。
     */
    Window_Message.prototype.newLineX = function(textState) {
        const faceExists = this.isFaceExists(textState);
        const faceWidth = ImageManager.faceWidth;
        const spacing = 20;
        const margin = faceExists ? faceWidth + spacing : 4;
        return textState.rtl ? this.innerWidth - margin : margin;
    };

    /**
     * メッセージにテキストが含まれるかどうかを判定する。
     * 
     * @param {TextState} textState テキストステート
     * @returns {boolean} フェイス指定がある場合にはtrue, それ以外はfalse.
     */
    Window_Message.prototype.isFaceExists = function(textState) {
        return ($gameMessage.faceName() !== "")
                || textState.text.match(/\x1bFACE/)
                || textState.text.match(/\x1bAFACE/);
    };


    const _Window_Message_updateLoading = Window_Message.prototype.updateLoading;
    /**
     * ロード状態を更新する。
     * 
     * @returns {boolean} 待ち状態の場合にはtrue, それ以外はfalse.
     */
    Window_Message.prototype.updateLoading = function() {
        if ($gameMessage.renderFaceImageRequired()) {
            this.loadMessageFace();
        }
        return _Window_Message_updateLoading.call(this);
    };

    const _Window_Message_loadMessageFace = Window_Message.prototype.loadMessageFace;
    /**
     * メッセージの顔グラフィックをロード開始する。
     * 
     * @note 顔グラフィックがロード完了(_faceBitmap.isReady()がtrue)したら、
     *       updateLoading内で描画処理される。
     */
    Window_Message.prototype.loadMessageFace = function() {
        _Window_Message_loadMessageFace.call(this);
        $gameMessage.clearRenderFaceImageRequired();
    };

    const _Window_Message_processEscapeCharacter = Window_Message.prototype.processEscapeCharacter;
    /**
     * エスケープキャラクタを処理する。
     * 
     * @param {string} code コード
     * @param {object} textState TextStateオブジェクト
     */
    Window_Message.prototype.processEscapeCharacter = function(code, textState) {
        switch (code) {
            case "PLAYME":
                {
                    const audio = this.obtainAudioParam(textState);
                    if (audio && audio.name) { // 有効なデータがある？
                        AudioManager.playMe(audio);
                    }
                }
                break;
            case "FADEOUTME":
                {
                    const frames = this.obtainEscapeParam(textState) || 0;
                    AudioManager.fadeOutMe(frames / 60);
                }
                break;
            case "STOPME":
                AudioManager.stopMe();
                break;
            case "PLAYSE":
                {
                    const audio = this.obtainAudioParam(textState);
                    if (audio && audio.name) { // 有効なデータがある？
                        AudioManager.playSe(audio);
                    }
                }
                break;
            case "FACE":
                {
                    const faceParam = this.obtainFaceParam(textState);
                    if (faceParam) {
                        $gameMessage.setFaceImage(faceParam.faceName, faceParam.faceIndex);
                    } else {
                        $gameMessage.setFaceImage("", 0);
                    }
                }
                break;
            case "AFACE":
                {
                    const actorId = this.obtainEscapeParam(textState);
                    if (actorId > 0) {
                        const actor = $gameActors.actor(actorId);
                        $gameMessage.setFaceImage(actor.faceName(), actor.faceIndex());
                    } else {
                        $gameMessage.setFaceImage("", 0);
                    }
                }
                break;
            case "CWAIT":
                {
                    const waitFrames = this.obtainEscapeParam(textState);
                    this._characterWait = waitFrames;
                }
                break;
            case "WAIT":
                {
                    const waitFrames = this.obtainEscapeParam(textState);
                    if (waitFrames > 0) {
                        this.startWait(waitFrames);
                    }
                }
                break;
            default:
                _Window_Message_processEscapeCharacter.call(this, code, textState);
                break;
        }
    };

    /**
     * textStateから顔グラフィック表示パラメータを入手する。
     * 
     * @param {TextState} textState テキストステート
     * @returns {object} 顔グラフィック表示パラメータ。データがない場合にはnull.
     */
    Window_Message.prototype.obtainFaceParam = function(textState) {
        const regExp = /^\[([^\]]+)\]/; // 続く'['から']'までを取り出す。
        const match = regExp.exec(textState.text.slice(textState.index));
        if (match) {
            textState.index += match[0].length; // インデックスを進める
            const params = match[1].split(',');

            const faceName = params[0] || "";
            const faceIndex = Number(params[1]) || 0;

            return {
                faceName : faceName,
                faceIndex : faceIndex
            };
        } else {
            return null;
        }
    };
    /**
     * textStateからオーディオパラメータを入手する。
     * 
     * @param {TextState} textState テキストステート
     * @returns {object} オーディオパラメータ。データがない場合にはnull.
     */
     Window_Message.prototype.obtainAudioParam = function(textState) {
        const regExp = /^\[([^\]]+)\]/; // 続く'['から']'までを取り出す。
        const match = regExp.exec(textState.text.slice(textState.index));
        if (match) {
            textState.index += match[0].length; // インデックスを進める
            const params = match[1].split(',');

            let name = (params.length > 0) ? params[0] : "";
            if (name.startsWith("\"") && name.endsWith("\"")) {
                name = name.slice(1, name.length - 1);
            } else if (name.startsWith("'") && name.endsWith("'")) {
                name = name.slice(1, name.length - 1);
            }
            const volume = (params.length > 1) ? (Number(params[1]) || 100) : 100;
            const pitch = (params.length > 2) ? (Number(params[2]) || 100) : 100;
            const pan = (params.length > 3) ? (Number(params(3)) || 0) : 0;
            return {
                name : name,
                volume : volume,
                pitch : pitch,
                pan : pan
            };
        } else {
            return null;
        }
    };
})();