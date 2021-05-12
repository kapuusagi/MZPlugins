/*:ja
 * @target MZ 
 * @plugindesc ルーレットを止めて項目を選択するプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @command clearChoices
 * @text ルーレットアイテムクリア
 * @desc ルーレット選択候補アイテムをクリアします。
 * 
 * @command addChoice
 * @text ルーレットアイテム追加
 * @desc ルーレット選択候補アイテムを追加します。
 * 
 * @arg iconIndex
 * @text アイコンインデックス
 * @desc アイコンインデックス
 * @type number
 * @default 0
 * 
 * @arg itemId
 * @text 道具指定
 * @desc 道具指定（道具のアイコンが入ります）
 * @type item
 * @default 0
 * 
 * @arg weaponId
 * @text 武器指定
 * @desc 武器指定（武器のアイコンが入ります)
 * @type weapon
 * @default 0
 * 
 * @arg armorId
 * @text 防具指定
 * @desc 防具指定（防具のアイコンが入ります）
 * @type armor
 * @default 0
 * 
 * @arg skillId
 * @text スキル指定
 * @desc スキル指定（スキルのアイコンが入ります）
 * @type skill
 * @default 0
 * 
 * @command choice
 * @text ルーレットで選択する
 * @desc ルーレットで選択するシーンを開始します。
 * 
 * @arg centerPosition
 * @text ルーレットの中心
 * @desc ルーレットの中心をどこにするか。
 * @type select
 * @option 画面中央
 * @value 0
 * @option アクター
 * @value 1
 * @option イベント
 * @value 2
 * 
 * 
 * @arg speed
 * @text スピード
 * @desc 回転速度[°/sec]。1秒間に何°回転させるか。
 * @type number
 * @default 360
 * @min 0
 * @max 720
 * 
 * 
 * @arg variableId
 * @text 変数ID
 * @desc 格納する変数ID
 * @type variable
 * @default 0
 * 
 * @arg canCancel
 * @text キャンセル可能かどうか
 * @desc キャンセル可能にする場合はtrue, それ以外はfalse.
 * @type boolean
 * @default true
 * 
 * 
 * @param cursorIconIndex
 * @text カーソルアイコン番号
 * @desc カーソルとして使用するアイコン番号
 * @type number
 * @default 0
 *
 * @param radius
 * @text 回転半径
 * @desc 回転半径(ピクセル) 
 * @type number
 * @default 120
 * @min 60
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
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/**
 * 選択項目アイコンスプライト
 */
function Sprite_ChoiceIcon() {
    this.initialize(...arguments);
}
/**
 * ルーレット選択シーン
 */
function Scene_RouletteChoice() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_ChoiceByRoulette";
    const parameters = PluginManager.parameters(pluginName);

    const cursorIconIndex = Number(parameters["cursorIconIndex"]) || 0;
    const radius = Math.max(60, Math.floor(Number(parameters["radius"]) || 0));

    const minMoveAngle = 3 * Math.PI / 180;

    // Note: 匿名関数だと this に Game_Interpreter が渡らないことに注意。必ずfunctionオブジェクトを構築する。
    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "clearChoice", args => {
        $gameTemp.clearChoiceRouletteItems();
    });

    PluginManager.registerCommand(pluginName, "addChoice", args => {
        const itemId = Number(args.item);
        if ((itemId > 0) && (itemId < $dataItems.length)) {
            const item = $dataItems[itemId];
            $gameTemp.addChoiceRouletteItem(item.iconIndex);
            return ;
        }
        const weaponId = Number(args.weaponId);
        if ((weaponId > 0) && (weaponId < $dataWeapons.length)) {
            const weapon = $dataWeapons[weaponId];
            $gameTemp.addChoiceRouletteItem(weapon.iconIndex);
            return ;
        }
        const armorId = Number(args.armorId);
        if ((armorId > 0) && (armorId < $dataArmors.length)) {
            const armor = $dataArmors[armorId];
            $gameTemp.addChoiceRouletteItem(armor.iconIndex);
            return ;
        }
        const skillId = Number(args.skillId);
        if ((skillId > 0) && (skillId < $dataSkills.length)) {
            const skill = $dataSkills[skillId];
            $gameTemp.addChoiceRouletteItem(skill.iconIndex);
            return ;
        }
        const iconIndex = Number(args.iconIndex) || 0;
        $gameTemp.addChoiceRouletteItem(iconIndex);
    });


    // Note: 匿名関数だと this に Game_Interpreter が渡らないことに注意。必ずfunctionオブジェクトを構築する。
    PluginManager.registerCommand(pluginName, "choice", function(args) {
        const interpreter = this; // thisにbindされてコールされる。
        const variableId = Number(args.variableId);
        const canCancel = (typeof args.canCancel === "undefined")
                ? true : (args.canCancel === "true");
        const speed = Number(args.speed);
        const choiceItems = $gameTemp.choiceRouletteItems();
        if (choiceItems.length === 0) {
            return ;
        }
        const centerPosition = Number(args.centerPosition) || 0;
        let centerX = Graphics.boxWidth / 2;
        let centerY = Graphics.boxHeight / 2;
        if (centerPosition === 1) {
            centerX = $gamePlayer.screenX();
            centerY = $gamePlayer.screenY();
        } else if (centerPosition === 2) {
            const eventId = interpreter.eventId();
            const event = $gameMap.event(eventId);
            if (event) {
                centerX = event.screenX();
                centerY = event.screenY();
            }
        }

        if ((variableId > 0) && (choiceItems.length > 0)) {
            SceneManager.push(Scene_RouletteChoice);
            SceneManager.prepareNextScene(variableId, centerX, centerY, speed, canCancel);
        }
    });
    //------------------------------------------------------------------------------
    // Game_Temp
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    /**
     * 初期化する。
     */
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._choiceRouletteItems = [];
    };

    /**
     * ルーレットアイテムを得る。
     * 
     * @returns {Array<number>} 選択項目アイコンインデックス
     */
    Game_Temp.prototype.choiceRouletteItems = function() {
        return this._choiceRouletteItems;
    };

    /**
     * 選択項目アイテムをクリアする。
     */
    Game_Temp.prototype.clearChoiceRouletteItems = function() {
        this._choiceRouletteItems = [];
    };
    /**
     * 選択項目アイテムを追加する。
     * 
     * @param {number} id 選択項目アイコンインデックス
     */
    Game_Temp.prototype.addChoiceRouletteItem = function(id) {
        this._choiceRouletteItems.push(id);
    };

    //------------------------------------------------------------------------------
    // Sprite_ChoiceIcon

    Sprite_ChoiceIcon.prototype = Object.create(Sprite.prototype);
    Sprite_ChoiceIcon.prototype.constructor = Sprite_ChoiceIcon;

    /**
     * Sprite_ChoiceIconを初期化する。
     */
    Sprite_ChoiceIcon.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    };
    /**
     * メンバーを初期化する。
     */
    Sprite_ChoiceIcon.prototype.initMembers = function() {
        this._iconIndex = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    };

    /**
     * 画像リソースを読み込む。
     */
    Sprite_ChoiceIcon.prototype.loadBitmap = function() {
        this.bitmap = ImageManager.loadSystem("IconSet");
        this.setFrame(0, 0, 0, 0);
    };

    /**
     * スプライトをセットアップする。
     * 
     * @param {number} iconIndex アイコンインデックス
     */
    Sprite_ChoiceIcon.prototype.setup = function(iconIndex) {
        if (this._iconIndex !== iconIndex) {
            this._iconIndex = iconIndex;
        }
    };
    /**
     * スプライトを更新する。
     */
    Sprite_ChoiceIcon.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateFrame();
    };
    /**
     * スプライトに表示するbitmapの領域（フレーム）を更新する。
     */
    Sprite_ChoiceIcon.prototype.updateFrame = function() {
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = (this._iconIndex % 16) * pw;
        const sy = Math.floor(this._iconIndex / 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    };
    //------------------------------------------------------------------------------
    // Scene_RouletteChoice
    Scene_RouletteChoice.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_RouletteChoice.prototype.constructor = Scene_RouletteChoice;

    /**
     * Scene_RouletteChoiceを初期化する。
     */
    Scene_RouletteChoice.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this, ...arguments);
        this._isSelecting = true;
        this._variableId = 0;
        this._rotationSpeed = 360; // 1秒で1回転
        this._choiceItems = [];
        this._canCancel = true;
        this._choice = -1;
        this._centerX = Graphics.boxWidth / 2;
        this._centerY = Graphics.boxHeight / 2;
    };

    /**
     * シーンの準備をする。
     * 
     * @param {number} variableId 変数ID
     * @param {number} centerX 中央X
     * @param {number} centerY 中央Y
     * @param {number} speed 回転速度
     * @param {boolean} canCancel キャンセル可能な場合にはtrue, それ以外はfalse
     */
    Scene_RouletteChoice.prototype.prepare = function(variableId, centerX, centerY, speed, canCancel) {
        this._variableId = variableId;
        this._choiceItems = $gameTemp.choiceRouletteItems();
        this._rotationSpeed = speed;
        this._canCancel = canCancel;
        this._centerX = centerX;
        this._centerY = centerY;
    };

    /**
     * シーンに必要なリソースを作成する。
     */
    Scene_RouletteChoice.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this, ...arguments);
        this._items = $gameTemp.choiceRouletteItems().concat();
        this.createIconLayer();
        this.createCenterSprite();
        this.createChoiceSprite();
        this.createCursorSprite();
    };

    /**
     * アイコンレイヤーを作成する。
     */
    Scene_RouletteChoice.prototype.createIconLayer = function() {
        this._iconLayer = new Sprite();
        this._iconLayer.x = (Graphics.width - Graphics.boxWidth)  / 2;
        this._iconLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
        this.addChild(this._iconLayer);
    };

    /**
     * 回転中心のスプライトを作成する。
     * こいつをクルクル回せばいいはず。
     */
    Scene_RouletteChoice.prototype.createCenterSprite = function() {
        this._centerSprite = new Sprite();
        this._centerSprite.anchor.x = 0.5;
        this._centerSprite.anchor.y = 0.5;
        this._centerSprite.x = this._centerX;
        this._centerSprite.y = this._centerY;
        this._iconLayer.addChild(this._centerSprite);
    };

    /**
     * 選択項目のスプライトを作成する。
     */
    Scene_RouletteChoice.prototype.createChoiceSprite = function() {
        for (let i = 0; i < this._items.length; i++) {
            const iconIndex = this._items[i];
            const angle = (2 * Math.PI) * i / this._items.length;
            const sprite = new Sprite_ChoiceIcon();
            sprite.setup(iconIndex);
            sprite.x = Math.round(radius * Math.sin(angle));
            sprite.y = Math.round(radius * Math.cos(angle));
            this._centerSprite.addChild(sprite);
        }
    };

    /**
     * カーソルスプライトを作成する。
     */
    Scene_RouletteChoice.prototype.createCursorSprite = function() {
        const sprite = new Sprite_ChoiceIcon(cursorIconIndex);
        sprite.x = Graphics.box
        sprite.y = -radius;
        sprite.scale.x = 1.5;
        sprite.scale.y = 1.5;
        this._iconLayer.addChild(sprite);
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
        Scene_MenuBase.prototype.update.call(this);
        this.updateRotation();
        this.updateInput();
        this.updateSpeed();
        if (this.isRotationStopped()) {
            this.popScene();
        }
    };


    /**
     * 回転が停止しているかどうかを得る。
     * 
     * @returns {boolean} 回転が停止している場合にはtrue, それ以外はfalse
     */
    Scene_RouletteChoice.prototype.isRotationStopped = function() {
        return (this._rotationSpeed === 0);
    };

    /**
     * 入力を更新する。
     */
    Scene_RouletteChoice.prototype.updateInput = function() {
        if (this._isSelecting) {
            if (Input.isRepeated("ok") || TouchInput.isClicked()) {
                this._choice = this.choicedIndex();
                SoundManager.playOk();
                this._isSelecting = false;
            } else if (this._canCancel && (Input.isRepeated("cancel") || TouchInput.isCancelled())) {
                SoundManager.playCancel();
                this._isSelecting = false;
                this.popScene();
            }
        }
    };

    /**
     * カーソル位置に該当する選択番号を得る。
     * 
     * @returns {number} 選択番号
     */
    Scene_RouletteChoice.prototype.choicedIndex = function() {
        // angle = 360 / (2 * PI) = 180 / PI.
        const curAngle = this._centerSprite.rotation / Math.PI;
        const itemAngle = 360 / this._items.length;
        // カーソルは90°ずれた位置にある。また角度を中央よりにするためitemAngle/2を加算。
        const judgeAngle = curAngle + 90 + itemAngle / 2; 
        if (judgeAngle <= 360) {
            return judgeAngle / itemAngle;
        } else {
            return (judgeAngle - 360) / itemAngle;
        }
    };

    /**
     * 回転制御する。
     */
    Scene_RouletteChoice.prototype.updateRotation = function() {
        // 多分中央を回転させれば、周りも動くと期待。
        // だめだったら演算する。
        // Note: 1フレームあたりの移動角度 = 回転速度[°/s] * ((2 * Math.PI) / 360) / 60[frame]
        //                               = 回転速度[°/s] * Math.PI / 180 / 60
        //                               = 回転速度[°/s] * Math.PI / 10800

        // Note : センタースプライトのアングル調整ではダメだった。
        const moveAngle = Math.max(minMoveAngle, (this._rotationSpeed * Math.PI / 10800));

        this._centerSprite.angle += moveAngle;

    };

    /**
     * 回転速度を更新する。
     */
    Scene_RouletteChoice.prototype.updateSpeed = function() {
        if (!this._isSelecting) {
            // 選択が終わったら徐々に速度を落とす。
            if (this._rotationSpeed > 0) {
                if (this._rotationSpeed > 1) {
                    this._rotationSpeed--;
                } else {
                    if (this._choice === this.choicedIndex()) {
                        this._rotationSpeed = 0;
                    }
                }
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