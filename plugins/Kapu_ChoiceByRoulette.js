/*:ja
 * @target MZ 
 * @plugindesc ルーレットを止めて項目を選択するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command choice
 * @text ルーレットで選択する
 * @desc ルーレットで選択するシーンを開始します。
 * 
 * @arg speed
 * @text スピード
 * @desc 回転速度
 * @type number
 * @default 10
 * @min 0
 * @max 180
 * 
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 格納する変数ID
 * @type variable
 * @default 0
 * 
 * @arg choiceItems
 * @text 選択アイテム
 * @desc 選択アイテム。アイコン番号で指定する。
 * @type number[]
 * @default []
 * 
 * @arg canCancel
 * @text キャンセル可能かどうか
 * @desc キャンセル可能にする場合はtrue, それ以外はfalse.
 * @type boolean
 * @default true
 * 
 * 
 * 
 * @help 
 * これって他にありそう。既製品があるならそっちを使おう。
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
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
function Scene_RouletteChoice() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_ChoiceByRoulette";
    const parameters = PluginManager.parameters(pluginName);

    PluginManager.registerCommand(pluginName, "choice", args => {
        const variableId = Number(args.variableId);
        const canCancel = (typeof args.canCancel === "undefined")
                ? true : (args.canCancel === "true");
        const speed = Number(args.speed);
        try {
            const array = JSON.parse(args.choiceItems || "[]");
            const choiceItems = array.map(str => Number(str));

            if ((variableId > 0) && (choiceItems.length > 0)) {
                SceneManager.push(Scene_RouletteChoice);
                SceneManager.prepareNextScene(variableId, choiceItems, speed, canCancel);
            }
        }
        catch (e) {
            console.log(error);
        }
    });

    //------------------------------------------------------------------------------
    // Scene_RouletteChoice
    Scene_RouletteChoice.prototype = Object.create(Scene_Base.prototype);
    Scene_RouletteChoice.prototype.constructor = Scene_RouletteChoice;

    /**
     * Scene_RouletteChoiceを初期化する。
     */
    Scene_RouletteChoice.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this, ...arguments);
        this._isSelecting = true;
        this._isRotating = true;
        this._variableId = 0;
        this._rotationSpeed = 10;
        this._choiceItems = [];
        this._canCancel = true;
        this._choice = -1;
        this._brakePower = 4;
    };

    /**
     * シーンの準備をする。
     * 
     * @param {number} variableId 変数ID
     * @param {Array<number>} choiceItems 選択項目アイコンID配列
     * @param {number} speed 回転速度
     * @param {boolean} canCancel キャンセル可能な場合にはtrue, それ以外はfalse
     */
    Scene_RouletteChoice.prototype.prepare = function(variableId, choiceItems, speed, canCancel) {
        this._variableId = variableId;
        this._choiceItems = choiceItems;
        this._rotationSpeed = speed;
        this._canCancel = canCancel;
        this._brakePower = Math.floor(this._rotationSpeed / 5);
    };

    /**
     * シーンに必要なリソースを作成する。
     */
    Scene_RouletteChoice.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this, ...arguments);
    };

    /**
     * 背景を作成する。
     */
    Scene_RouletteChoice.prototype.createBackground = function() {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(255);
    };

    /**
     * 開始する。
     */
    Scene_RouletteChoice.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this, ...arguments);
        if (this._variableId > 0) {
            $gameVariables.setValue(this._variableid, -1);
        }
    };

    /**
     * 更新する。
     */
    Scene_RouletteChoice.prototype.update = function() {
        this.updateRotation();
        this.updateInput();
        this.updateSpeed();
        if (!this._isRotating) {
            this.popScene();
        }
    };

    /**
     * 入力を更新する。
     */
    Scene_RouletteChoice.prototype.updateInput = function() {
        if (this._isSelecting && (Input.isRepeated("ok") || TouchInput.isClicked())) {
            SoundManager.playOk();
            this._isSelecting = false;
        } else if (this._canCancel && (Input.isCancelled("cancel") || TouchInput.isCancelled())) {
            SoundManager.playCancel();
            this.popScene();
        }
    };

    /**
     * 回転制御する。
     */
    Scene_RouletteChoice.prototype.updateRotation = function() {
        this._isRotating = false;
    };

    /**
     * 回転速度を更新する。
     */
    Scene_RouletteChoice.prototype.updateSpeed = function() {
        if (!this._isSelecting) {
            // 選択が終わったら徐々に速度を落とす。
            if (this._rotationSpeed > 0) {
                if ((this._rotationSpeed === 1) && (this._choice != -1)) {
                    this._rotationSpeed = 0;
                }
            } else {
                rotationSpeed--;
            }
        }
    };

    /**
     * 終了する。
     */
    Scene_RouletteChoice.prototype.terminate = function() {
        Scene_MenuBase.prototype.terminate.call(this, ...arguments);
        if (this._variableId > 0) {
            $gameVariables.setValue(this._variableId, this._choice);
        }
    };

})();