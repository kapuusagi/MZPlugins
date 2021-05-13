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
 * @arg item
 * @text 項目
 * @desc 追加する項目
 * @type struct<ItemEntry>
 * 
 * 
 * @command choice
 * @text ルーレットで選択する
 * @desc ルーレットで選択するシーンを開始します。
 * 
 * @arg centerPosition
 * @text ルーレットの中心
 * @desc ルーレットの中心をどこにするか。
 * @type select
 * @default 0
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
 * ルーレットを表示させ、任意のタイミングで停止、決定させる機能を提供するプラグイン。
 * これって他にありそう。既製品があるならそっちを使おう。
 * 選択項目はアイテムオブジェクトでは管理していないので、
 * 呼び出し元のスクリプトで、1番目は～、2番目は～、と認識して処理させること。
 * 
 * ■ 使用時の注意
 * シーンの切り替えが入るので、戦闘中とかに呼び出すとおかしくなるかも。
 * 
 * ■ プラグイン開発者向け
 * Scene_RouletteChoiceを個別に呼び出すには
 *   const iconIds = [ ルーレットに表示するアイコン ];
 *   const centerX = Graphics.boxWidth / 2;
 *   const centerY = Graphics.boxHeight / 2;
 *   SceneManager.push(Scene_RouletteChoice);
 *   SceneManager.prepareNextScene(0, iconIds, centerx, centerY, speed, canCancel);
 * とする。シーンが完了したとき、
 *   $gameTemp.choiceRouletteSelected()
 * で値を取得出来る。もちろん変数を経由して取得しても良い。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * ルーレットアイテムクリア
 *    ルーレットで選択するアイテムを全てクリアする。
 * 
 * ルーレットアイテム追加
 *    1つの選択項目を追加する。必要な選択肢の数だけ呼び出す
 * 
 * ルーレットで選択する
 *    シーンを切り替えてルーレット選択させる。
 *    指定した変数に結果が格納される。
 *    未選択時、変数には-1が格納される。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * ノートタグはありません。
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.1.0.0 新規作成。
 */
/*~struct~ItemEntry:
 *
 * @param iconIndex
 * @text アイコンインデックス
 * @desc アイコンインデックス
 * @type number
 * @default 0
 * 
 * @param itemId
 * @text 道具指定
 * @desc 道具指定（道具のアイコンが入ります）
 * @type item
 * @default 0
 * 
 * @param weaponId
 * @text 武器指定
 * @desc 武器指定（武器のアイコンが入ります)
 * @type weapon
 * @default 0
 * 
 * @param armorId
 * @text 防具指定
 * @desc 防具指定（防具のアイコンが入ります）
 * @type armor
 * @default 0
 * 
 * @param skillId
 * @text スキル指定
 * @desc スキル指定（スキルのアイコンが入ります）
 * @type skill
 * @default 0
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

    const radian360 = 2 * Math.PI;
    const minMoveAnglePerFrame = 1; // 1フレームあたりの最小回転数[°]
    const minMoveRadian = minMoveAnglePerFrame * Math.PI / 180; // 1フレームあたりの最小回転数[rad]

    // Note: 匿名関数だと this に Game_Interpreter が渡らないことに注意。必ずfunctionオブジェクトを構築する。
    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "clearChoices", args => {
        $gameTemp.clearChoiceRouletteItems();
    });

    PluginManager.registerCommand(pluginName, "addChoice", args => {
        try {
            const addItem = JSON.parse(args.item || "{}");
            const itemId = Number(addItem.itemId);
            if ((itemId > 0) && (itemId < $dataItems.length)) {
                const item = $dataItems[itemId];
                $gameTemp.addChoiceRouletteItem(item.iconIndex);
                return ;
            }
            const weaponId = Number(addItem.weaponId);
            if ((weaponId > 0) && (weaponId < $dataWeapons.length)) {
                const weapon = $dataWeapons[weaponId];
                $gameTemp.addChoiceRouletteItem(weapon.iconIndex);
                return ;
            }
            const armorId = Number(addItem.armorId);
            if ((armorId > 0) && (armorId < $dataArmors.length)) {
                const armor = $dataArmors[armorId];
                $gameTemp.addChoiceRouletteItem(armor.iconIndex);
                return ;
            }
            const skillId = Number(addItem.skillId);
            if ((skillId > 0) && (skillId < $dataSkills.length)) {
                const skill = $dataSkills[skillId];
                $gameTemp.addChoiceRouletteItem(skill.iconIndex);
                return ;
            }
            const iconIndex = Number(addItem.iconIndex) || 0;
            $gameTemp.addChoiceRouletteItem(iconIndex);
        }
        catch (e) {
            console.log(e);
        }
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
            SceneManager.prepareNextScene(variableId, choiceItems, centerX, centerY, speed, canCancel);
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
        this._choiceRouletteSelected = -1;
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

    /**
     * ルーレットでの選択番号を設定する。
     * 
     * @param {number} no 番号
     */
    Game_Temp.prototype.setChoiceRouletteSelected = function(no) {
        this._choiceRouletteSelected = no;
    };

    /**
     * ルーレットで選択された番号を得る。
     * 
     * @returns {number} 番号
     */
    Game_Temp.prototype.choiceRouletteSelected = function() {
        return this._choiceRouletteSelected;
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
        this._iconIndex = iconIndex;
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
    //
    // _centerSprite : 回転の中央位置と、現在の回転角度をangleに持たせる。
    //                 最良は_centerSpriteのangleを調整すると、相対的に子スプライトの位置も更新されることだが、
    //                 そのようには動作しなかったので計算するようにした。
    // updateRotationの中で子スプライトの位置と、カーソルの選択対象を更新している。
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
        this._currentIndex = -1; // 現在のカーソル位置にあるインデックス。
        this._cursorAngleMin = 0;
        this._cursorAngleMax = radian360;
        this._centerX = Graphics.boxWidth / 2;
        this._centerY = Graphics.boxHeight / 2;
        this._itemAngle = radian360;
        this._waitCount = 0;
        this._rotationAngle = Math.random() * radian360;
    };

    /**
     * シーンの準備をする。
     * 
     * @param {number} variableId 変数ID
     * @param {Array<number>} choiceItems 選択対象アイテムアイコンID配列
     * @param {number} centerX 中央X
     * @param {number} centerY 中央Y
     * @param {number} speed 回転速度
     * @param {boolean} canCancel キャンセル可能な場合にはtrue, それ以外はfalse
     */
    Scene_RouletteChoice.prototype.prepare = function(variableId, choiceItems, centerX, centerY, speed, canCancel) {
        this._variableId = variableId;
        this._choiceItems = choiceItems.concat();
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
        this._itemAngle = radian360 / this._items.length;
        this._cursorAngleMin = (Math.PI / 2) - this._itemAngle / 2;
        this._cursorAngleMax = this._cursorAngleMin + this._itemAngle;
        this.createIconLayer();
        this.createCenterSprite();
        this.createChoiceSprite();
        this.createCursorSprite();
    };
    /**
     * キャンセルボタンが必要かどうかを取得する。
     * 
     * @return {Boolean} 必要な場合にはtrue, それ以外はfalse
     */
    Scene_RouletteChoice.prototype.needsCancelButton = function() {
        return this._canCancel;
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
        const offset = this._rotationAngle;
        this._itemSprites = [];
        for (let i = 0; i < this._items.length; i++) {
            const iconIndex = this._items[i];
            const radian = (this._itemAngle * i + offset) % radian360;
            const sprite = new Sprite_ChoiceIcon();
            sprite.setup(iconIndex);
            sprite.x = radius * Math.cos(radian);
            sprite.y = -radius * Math.sin(radian);

            this._centerSprite.addChild(sprite);
            this._itemSprites.push(sprite);

            if ((radian >= this._cursorAngleMin) && (radian < this._cursorAngleMax)) {
                // これが現在カーソル選択中のアイテム
                this._currentIndex = i;
            }
        }
    };

    /**
     * カーソルスプライトを作成する。
     */
    Scene_RouletteChoice.prototype.createCursorSprite = function() {
        const sprite = new Sprite_ChoiceIcon();
        sprite.setup(cursorIconIndex);
        sprite.scale.x = 1.0;
        sprite.scale.y = 1.0;
        sprite.x = this._centerX;
        sprite.y = this._centerY - radius + 32;
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
        $gameTemp.setChoiceRouletteSelected(-1);
        this._canDetectInput = false;
    };

    /**
     * 更新する。
     */
    Scene_RouletteChoice.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        this.updateRotation();
        this.updateInput();
        if (this.isRotationStopped()) {
            this._waitCount++;
            if (this._waitCount > 120) {
                this.popScene();
            }
        } else {
            this._waitCount = 0;
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
        if (!Input.isRepeated("ok") && !TouchInput.isClicked()) {
            // 一度離されているのを検出しないといけない。
            this._canDetectInput = true;
        } else if (this._isSelecting && this._canDetectInput) {
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
        return this._currentIndex;
    };

    /**
     * 回転制御する。
     * 
     * _centerSpriteの回転角度と、子スプライトの位置、
     * カーソルで選択されている項目の位置を更新している。
     */
    Scene_RouletteChoice.prototype.updateRotation = function() {
        if (this._rotationSpeed === 0) {
            return ; // 回転停止中
        }

        // Note: 1フレームあたりの移動角度 = 回転速度[°/s] * ((2 * Math.PI) / 360) / 60[frame]
        //                               = 回転速度[°/s] * Math.PI / 180 / 60
        //                               = 回転速度[°/s] * Math.PI / 10800
        let moveAngle = Math.max(minMoveRadian, (this._rotationSpeed * Math.PI / 10800));
        if (!this._isSelecting) {
            const targetAngle = (this._itemAngle * this._choice + this._rotationAngle) % radian360;
            const cursorAngle = Math.PI / 2;
            if ((moveAngle <= minMoveRadian) 
                    && ((targetAngle + moveAngle) >= cursorAngle) && (targetAngle < cursorAngle)) {
                // 停止条件を満たしたので、最後の移動をして止める。
                moveAngle = cursorAngle - targetAngle;
                this._rotationSpeed = 0; // 停止

            } else {
                // 選択中でないならば減速処理する。
                if (this._rotationSpeed > 1) {
                    this._rotationSpeed--;
                }
            }
        }
        this._rotationAngle = (this._rotationAngle + moveAngle) % radian360;
        const offset = this._rotationAngle;
        for (let i = 0; i < this._itemSprites.length; i++) {
            const sprite = this._itemSprites[i];
            const radian = (this._itemAngle * i + offset) % radian360;
            sprite.x = radius * Math.cos(radian);
            sprite.y = -radius * Math.sin(radian);
            if ((radian >= this._cursorAngleMin) && (radian < this._cursorAngleMax)) {
                // これが現在カーソル選択中のアイテム
                if(this._currentIndex !== i) {
                    this._currentIndex = i;
                    SoundManager.playCursor();
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
        $gameTemp.setChoiceRouletteSelected(this._choice);
    };

})();