/*:ja
 * @target MZ 
 * @plugindesc FS向けに作成した戦闘システムの変更
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * @base Kapu_TargetManager
 * @orderAfter Kapu_TargetManager
 * 
 * @command setBattlePicture
 * @text アクター戦闘画像設定
 * @desc 戦闘中にコマンド入力欄脇に表示するグラフィックを設定する。
 * 
 * @arg actorId
 * @text アクターID
 * @desc 変更するアクターのID
 * @type actor
 * 
 * @arg variableId
 * @text 変数ID
 * @desc アクターを変数の値で指定する場合に指定する変数ID
 * @type number
 * 
 * @arg fileName
 * @text ファイル名
 * @desc 設定する画像ファイル
 * @type file
 * @dir img/pictures/
 * 
 * @param maxBattleMembers
 * @text 最大戦闘参加人数
 * @desc 戦闘に参加可能な人数の最大値。
 * @default 6
 * @type number
 * @min 1
 * @max 6
 * 
 * @param ui
 * @text UI
 * 
 * @param layout
 * @text レイアウト設定
 * 
 * @param listWindowWidth
 * @text リストウィンドウ幅
 * @desc リストウィンドウ(アイテムやスキルの選択ウィンドウ)の幅。
 * @default 816
 * @type number
 * @parent layout
 * 
 * @param commandWindowX
 * @text コマンドウィンドウ位置X
 * @desc コマンドウィンドウの水平位置
 * @default 1068
 * @type number
 * @parent layout
 * 
 * @param commandWindowWidth
 * @text コマンドウィンドウ幅
 * @desc コマンドウィンドウの幅
 * @default 192
 * @type number
 * @parent layout
 * 
 * @param commandWindowRowCount
 * @text コマンドウィンドウの行数
 * @desc コマンドウィンドウの行数。画面を超えるようなサイズを指定した場合、表示可能範囲に制限される。
 * @type number
 * @default 4
 * @parent layout
 * 
 * @param commandHudPictureDisplayX
 * @text コマンドウィンドウピクチャ表示開始位置x
 * @desc コマンド入力中のアクター画像を表示する画面右端基準での表示開始位置。これより左側には表示させない。
 * @type number
 * @default 900
 * @parent layout
 * 
 * @param commandHudPictureFadeWidth
 * @text コマンドウィンドウピクチャ水平フェード幅
 * @desc コマンド入力中のアクター画像を表示する際の、境界のぼかし幅
 * @type number
 * @default 40
 * @parent layout
 * 
 * @param commandHudPictureFadeHeight
 * @text コマンドウィンドウピクチャ垂直フェード幅
 * @desc コマンド入力中のアクター画像を表示する際の、境界のぼかし幅
 * @type number
 * @default 40
 * @parent layout
 * 
 * @param commandHudPictureOffsetX
 * @text コマンドウィンドウピクチャ表示オフセットX
 * @desc コマンド入力中のアクター画像を表示をずらすオフセット。負数で左に移動、正数で右に移動
 * @type number
 * @default 0
 * @min -1000
 * @max 1000
 * @parent layout
 * 
 * @param commandHudPictureOffsetY
 * @text コマンドウィンドウピクチャ表示オフセットY
 * @desc コマンド入力中のアクター画像を表示をずらすオフセット。負数で上に移動、正数で下に移動
 * @type number
 * @default 0
 * @min -1000
 * @max 1000
 * @parent layout
 * 
 * 
 * @param statusAreaWidth
 * @text ステータスエリア幅
 * @desc 1アクターのステータスエリアの幅
 * @default 160
 * @type number
 * @parent layout
 * 
 * @param statusAreaPadding
 * @text ステータスエリアのパディング
 * @desc アクターHUD間の幅
 * @default 16
 * @type number
 * @parent layout
 * 
 * @param statusAreaHeight
 * @text ステータスエリア高さ
 * @desc 1アクターのステータスエリアの高さ
 * @default 220
 * @type number
 * @parent layout
 * 
 * @param statusAreaOffsetX
 * @text ステータスエリア位置X
 * @desc ステータスエリアの水平位置
 * @default 60
 * @type number
 * @parent layout
 * 
 * @param enemyAreaOffsetX
 * @text エネミーエリア位置X
 * @desc エネミーエリアの水平位置X。エディタ上で設定した位置に対して、これだけオフセットした場所に配置する。
 * @default 0
 * @type number
 * @parent layout
 * 
 * @param displayEnemyGauge
 * @text エネミーゲージを表示する
 * @desc trueにするとエネミーのHP/TPBゲージを表示するようになります。
 * @type boolean
 * @default true
 *
 * @param useBattlePicture
 * @text アクターHUDにBattlePictureを使用する。
 * @desc アクターHUDにBattlePictureを使用する。falseにすると顔グラフィックを使用する。
 * @type boolean
 * @default false
 * 
 * @param pictureYOffset
 * @text Yオフセット
 * @desc アクターHUDに表示するBattlePicture上端からのオフセット。BattlePictureのうち、このオフセット分だけ下の位置から表示される。
 * @type number
 * @default 0
 * @parent useBattlePicture
 * 
 * @param pictureDisplayHeight
 * @text Y表示高
 * @desc アクターHUDに表示するBattlePictureの表示する高さ。
 * @type number
 * @default 400
 * @parent useBattlePicture
 * 
 * @param pictureDisplayYOffset
 * @text Y表示位置調整
 * @desc アクターHUDに表示するBattlePictureのY表示位置調整。＋で下に移動、ーで上に移動
 * @type number
 * @default 0
 * @min -4096
 * @max 4096
 * @parent useBattlePicture
 * 
 * @param pictureZoom
 * @text 表示倍率
 * @desc アクターHUDに表示するBattlePicutureの表示倍率
 * @type number
 * @decimals 2
 * @default 1.00
 * @parent useBattlePicture
 * 
 * @param pictureMethod
 * @text メソッド名
 * @desc 画像データ名をactorから取得するためのメソッド/プロパティ名
 * @type string
 * @default battlePicture
 * @parent useBattlePicture
 * 
 * 
 * @param enableInputtingZoom
 * @text 入力中ズーム動作
 * @desc コマンド入力中、対象アクターをズーム表示させる。
 * @type boolean
 * @default false
 * 
 * @param defaultUseSkillAnimationIds
 * @text スキル使用時アニメーション
 * @desc スキル使用時に、使用者のエフェクトとして表示するアニメーション。0で表示しない。0番目はタイプなし、1以降はスキルタイプに対応する。
 * @type animation[]
 * @default 0
 * 
 * @param defaultUseItemAnimationId
 * @text アイテム使用時アニメーション
 * @desc アイテム使用時に、使用者のエフェクトとして表示するアニメーション。0で表示しない。
 * @type animation
 * @default 0
 * 
 * @param damageEffect
 * @text ダメージエフェクト
 *  
 * @param damageMoveXRandom
 * @text ダメージポップアップ方向ランダム
 * @desc ダメージポップアップX方向移動をランダムにする。
 * @type boolean
 * @default false
 * @parent damageEffect
 * 
 * @param damageMoveX
 * @text ダメージポップアップX方向移動距離
 * @desc ダメージポップさせたとき、垂直方向の移動が止まるまで、毎フレームこの値だけ水平方向に移動する。
 * @type number
 * @decimals 2
 * @default 0.00
 * @min -5.00
 * @max 5.00
 * @parent damageEffect
 * 
 * @param multiplePopupOffsetX
 * @text 同時ポップアップオフセットX
 * @desc 連続してダメージポップアップさせるとき、前の表示からずらす水平ピクセル数。(正数で右にずれる)
 * @type number
 * @default 8
 * @min -255
 * @max 255
 * @parent damageEffect
 * 
 * @param multiplePopupOffsetY
 * @text 同時ポップアップオフセットY
 * @desc 連続してダメージポップアップさせるとき、前の表示からずらす垂直ピクセル数。(正数で上にずれる)
 * @type number
 * @default 16
 * @min -255
 * @max 255
 * @parent damageEffect
 * 
 * @param displayLimitY
 * @text ポップアップ表示させるYの最大値
 * @desc 連続ダメージポップアップさせるとき、表示可能なY位置上限(画面上端からのピクセル数)
 * @type number
 * @default 136
 * @parent damageEffect
 * 
 * @param noDispStateIds
 * @text 付与/解除を表示させないステートID
 * @desc 付与/解除を表示させないステートID
 * @type state[]
 * @default ["1"]
 * @parent damageEffect
 * 
 * @param fadeInDuration
 * @text フェードイン期間
 * @desc フェードイン期間
 * @type number
 * @default 30
 * @parent damageEffect
 * 
 * @param popupDuration
 * @text ダメージポップアップ期間
 * @desc ダメージポップアップさせる時間[フレーム数]
 * @type number
 * @default 60
 * @parent damageEffect
 * 
 * @param fadeOutDuration
 * @text フェードアウト期間
 * @desc フェードアウト期間
 * @type number
 * @default 30
 * @parent damageEffect
 * 
 * @param textAddedState
 * @text 追加されたステートポップアップテキスト
 * @desc 追加されたステートポップアップテキスト。%1にステート名。空にするとポップアップさせない。
 * @type string
 * @default +%1
 * @parent damageEffect
 * 
 * @param colorAddedState
 * @text 追加ステート文字色
 * @desc 追加ステート文字色
 * @type string
 * @default #ffffff
 * @parent textAddedState
 * 
 * 
 * @param textRemovedState
 * @text 解除されたステートポップアップテキスト
 * @desc 解除されたステートポップアップテキスト。%1にステート名。空にするとポップアップさせない。
 * @type string
 * @default #808080
 * @default -%1
 * @parent damageEffect
 * 
 * @param colorRemovedState
 * @text 解除ステート文字色
 * @desc 解除ステート文字色
 * @type string
 * @default #ffffff
 * @parent textRemovedState
 * 
 * @param statePopupDuration
 * @text ステートポップアップ長
 * @desc ステート追加/解除をポップアップさせる時間[フレーム数]
 * @type number
 * @default 80
 * @parent damageEffect
 * 
 * @param textAddedBuff
 * @text 追加されたバフポップアップテキスト
 * @desc 追加されたバフポップアップテキスト。%1にパラメータ名。空にするとポップアップさせない。
 * @type string
 * @default %1上昇
 * @parent damageEffect
 * 
 * @param colorAddedBuff
 * @text 追加バフ文字色
 * @desc 追加バフ文字色
 * @type string
 * @default #FFB000
 * @parent textAddedBuff
 * @parent damageEffect
 * 
 * @param textAddedDebuff
 * @text 追加されたデバフポップアップテキスト
 * @desc 追加されたデバフポップアップテキスト。%1にパラメータ名。カアにするとポップアップさせない。
 * @string
 * @default %1低下
 * @parent damageEffect
 * 
 * @param colorAddedDebuff
 * @text 追加デバフ文字色
 * @desc 追加デバフ文字色
 * @type string
 * @default #0080B0
 * @parent textAddedDebuff
 * 
 * @param textRemovedBuff
 * @text 解除されたバフ/デバフポップアップテキスト
 * @desc 解除されたバフ/デバフポップアップテキスト。%1にステート名。空にするとポップアップさせない。
 * @type string
 * @default #808080
 * @default %1通常
 * @parent damageEffect
 * 
 * @param colorRemovedBuff
 * @text 解除バフ/デバフ文字色
 * @desc 解除バフ/デバフ文字色
 * @type string
 * @default #ffffff
 * @parent textRemovedBuff
 * 
 * @param textEffective
 * @text 効果的メッセージ
 * @desc 効果が増加したときにポップアップさせるメッセージ。ポップアップさせない場合には空文字列
 * @type string
 * @default Effective!
 * @parent damageEffect
 * 
 * @param effectiveRate
 * @text 効果的判定レート
 * @desc 属性レートが定義されていて、この値より大きい場合に効果的メッセージをポップアップさせる。
 * @type number
 * @decimals 2
 * @default 1.50
 * @min 1.00
 * @parent textEffective
 * 
 * @param colorEffective
 * @text 効果有りメッセージカラー
 * @desc 効果的メッセージの色
 * @type string
 * @default #ff8000
 * @parent textEffective
 *
 * @param textIneffective
 * @text 効果なしメッセージ
 * @desc 効果が減衰したときにポップアップさせるメッセージ。ポップアップさせない場合には空文字列
 * @type string
 * @default Ineffective!
 * @parent damageEffect
 * 
 * @param colorIneffective
 * @text 効果なし文字カラー
 * @desc 効果なし文字の色
 * @type string
 * @default #0080ff
 * @parent textIneffective
 * 
 * @param ineffectiveRate
 * @text 効果なしレート
 * @desc 属性レートが定義されていて、0以上でこの値より小さい場合に効果無いメッセージをポップアップする
 * @type number
 * @decimals 2
 * @default 0.50
 * @min 0.00
 * @max 1.00
 * @parent textIneffective
 * 
 * @param textAbsorb
 * @text 吸収メッセージ
 * @desc 吸収効果が発動したときにポップアップさせるメッセージ。ポップアップさせない場合には空文字列
 * @type string
 * @default absorb
 * @parent damageEffect
 * 
 * @param colorAbsorb
 * @text 吸収文字カラー
 * @desc 吸収文字の色
 * @type string
 * @default #ff80ff
 * @parent textAbsorb 
 * 
 * @param textMiss
 * @text ミス時メッセージ
 * @desc アクションがミスしたときにポップアップさせるメッセージ。ポップアップさせない場合には空文字列
 * @type string
 * @defaut Miss!
 * @parent damageEffect
 * 
 * @param colorMiss
 * @text ミス時文字カラー
 * @desc ミス時メッセージの色
 * @type string
 * @default #ffffff
 * @parent textMiss
 * 
 * @param textCritical
 * @text クリティカル時メッセージ
 * @desc アクションがクリティカルしたときにポップアップさせるメッセージ。ポップアップさせない場合には空文字列
 * @type string
 * @default Critical!
 * @parent damageEffect
 * 
 * @param colorCritical
 * @text クリティカル時文字カラー
 * @desc クリティカル時メッセージの色
 * @type string
 * @default #ffffff
 * @parent textCritical
 * 
 * @param textReflection
 * @text 反射メッセージ
 * @desc 反射時メッセージ。空にするとポップアップさせない。
 * @type string
 * @default Reflect!!
 * @parent damageEffect
 * 
 * @param colorReflection
 * @text 反射文字カラー
 * @desc 反射メッセージの色
 * @type string
 * @default #ff80ff
 * @parent textReflection
 * 
 * @param textCounter
 * @text カウンターメッセージ
 * @desc カウンター時のメッセージ。空にするとポップアップさせない。
 * @type string
 * @default Counter!!
 * @parent damageEffect
 * 
 * @param colorCounter
 * @text カウンターカラー
 * @desc カウンターメッセージの色
 * @type string
 * @default #8080ff
 * @parent textCounter
 * 
 * 
 * @param textGuard
 * @text ガードメッセージ
 * @desc ガード時のメッセージ。空にするとポップアップさせない。
 * @type string
 * @default Guard!!
 * @parent damageEffect
 * 
 * @param colorGuard
 * @text ガードカラー
 * @desc ガードメッセージの色
 * @type string
 * @default #808080
 * @parent textGuard
 * 
 * @param seGuard
 * @text ガードSE
 * @desc ガード時のSE。ファイルを指定しないと鳴らさない。
 * @type struct<SoundEffect>
 * @default {"name":"","volume":"90","pitch":"100","pan":"100"}
 * @parent textGuard
 *  
 * @param colorHpDamage
 * @text HPダメージカラー
 * @desc HPダメージ数値の色
 * @type string
 * @default #ffffff
 * @parent damageEffect
 * 
 * @param colorHpRecover
 * @text HPリカバリーカラー
 * @desc HP回復数値の色
 * @type string
 * @default #80ff80
 * @parent damageEffect
 * 
 * @param colorHpNoDamage
 * @text HPノーダメージカラー
 * @desc HPノーダメージ数値の色
 * @type string
 * @default #ffffff
 * @parent damageEffect
 * 
 * @param colorMpDamage
 * @text MPダメージカラー
 * @desc MPダメージ数値の色
 * @type string
 * @default #ff8080
 * @parent damageEffect
 * 
 * @param colorMpRecover
 * @text MPリカバリーカラー
 * @desc MP回復数値の色
 * @type string
 * @default #ff80ff
 * @parent damageEffect
 * 
 * @param colorTpDamage
 * @text TPダメージカラー
 * @desc TPダメージ数値の色
 * @type string
 * @default #b4b440
 * @parent damageEffect
 * 
 * @param colorTpRecover
 * @text TP回復カラー
 * @desc TP回復数値の色
 * @type string
 * @default #ffff40
 * @parent damageEffect
 * 
 *  
 * @requiredAssets img/hud/ActiveHud
 * 
 * @help 
 * Twld向けに作成した戦闘シーンのUI処理プラグイン。
 * 
 * GLSLソースで使用しているRGB<->HSL変換は
 * 
 * img/hud/ActiveHud
 *     Active状態の時に表示するイメージ
 * img/hud/StatusBackground
 *     Status背景の表示
 *
 * ■ 注意事項 
 * フロントビュー固定になります。
 * 
 * ■ 開発者向け？
 * 以下のモジュールは、他のプラグインとの兼ね合いで変更できるよう、
 * 匿名メソッドから外に出している。
 * Sprite_BattleHudActorName
 *   UI上で、1アクターの名前を表示するスプライト。
 * Sprite_HudStateIcons
 *   UI上で、1アクターのステートを表示するスプライト。
 * Sprite_BattleHudActor
 *   UI上で、1アクターあたりの表示をするスプライト。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター
 *   <battlePicture:pictureName$>
 *     フロントビューで表示するアクターの画像。
 *     picturesフォルダの下から引っ張ってくる。
 * スキル/アイテム
 *   <useAnimationId:id#>
 *     スキル/アイテム使用時、使用者に表示するアニメーションID。
 *     魔法発動効果を表示させたい場合などに使用する。
 *     未指定時はプラグインパラメータで指定したアニメーションが表示される。
 * 
 * ステート
 *   <noPopup>
 *     ステートが付与/解除されたとき、ポップアップさせない場合に指定する。
 *     (ステートポップアップさせたくない場合、付与時メッセージを空にすることでも表示しなくなる)
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 FS向けに新規作成した。
 */
/*~struct~SoundEffect:
 *
 * @param name
 * @type file
 * @dir audio/se/
 * @desc 効果音のファイル名
 * @default 
 * @require 1
 *
 * @param volume
 * @type number
 * @max 100
 * @desc 効果音の音量
 * 初期値: 90
 * @default 90
 *
 * @param pitch
 * @type number
 * @min 50
 * @max 150
 * @desc 効果音のピッチ
 * 初期値: 100
 * @default 100
 *
 * @param pan
 * @type number
 * @min -100
 * @max 100
 * @desc 効果音の位相
 * 初期値: 0
 * @default 0
 *
 */



/**
 * Sprite_BattleHudActorName。
 * @class
 * Sprite_Nameから表示を変更するために派生して使う。
 */
function Sprite_BattleHudActorName() {
    this.initialize(...arguments);
}


/**
 * Sprite_HudStateIcons。
 * @class
 * ステートアイコンを表示するためのスプライト。
 * 一度に4つずつ表示するために用意したが、
 * Sprite_StateIconを複数並べる方式の方がリソース節約になるかもしれない。
 */
function Sprite_HudStateIcons() {
    this.initialize(...arguments);
}


/**
 * Sprite_BattleHudActor
 * @class
 * アクター情報を表示するHUD。
 */
function Sprite_BattleHudActor() {
    this.initialize(...arguments);
}

/**
 * Sprite_BattleHudPicture。
 * @class
 * コマンド入力ウィンドウの脇に、でっかく表示するアクター画像のスプライト。
 */
function Sprite_BattleHudPicture() {
    this.initialize(...arguments);
}

(() => {
    const pluginName = "Kapu_FS_BattleSystem";
    const parameters = PluginManager.parameters(pluginName);
    const maxBattleMembers = Number(parameters["maxBattleMembers"]) || 4;

    const displayEnemyGauge = (parameters["displayEnemyGauge"] === undefined)
            ? false : (parameters["displayEnemyGauge"] === "true");

    const listWindowWidth = Number(parameters["listWindowWidth"]) || 816;
    const commandWindowX = Number(parameters["commandWindowX"]) || 1068;
    const commandWindowWidth = Number(parameters["commandWindowWidth"]) || 192;
    const commandWindowRowCount = Number(parameters["commandWindowRowCount"]) || 4;
    const commandHudPictureDisplayX = Number(parameters["commandHudPictureDisplayX"]) || 280;
    const commandHudPictureOffsetX = Number(parameters["commandHudPictureOffsetX"]) || 0;
    const commandHudPictureOffsetY = Number(parameters["commandHudPictureOffsetY"]) || 0;
    const commandHudPictureX = (commandHudPictureDisplayX + commandWindowX) / 2 + commandHudPictureOffsetX; 
    const commandHudPictureFadeWidth = Number(parameters["commandHudPictureFadeWidth"]) || 0;
    const commandHudPictureFadeHeight = Number(parameters["commandHudPictureFadeHeight"]) || 0;
    
    const statusAreaWidth = Number(parameters["statusAreaWidth"]) || 160;
    const statusAreaPadding = Number(parameters["statusAreaPadding"]) || 16;
    const statusAreaHeight = Number(parameters["statusAreaHeight"]) || 220;
    const statusAreaOffsetX = Number(parameters["statusAreaOffsetX"]) || 192;
    const enemyAreaOffsetX = Number(parameters["enemyAreaOffsetX"]) || 0;
    const useBattlePicture = (parameters["useBattlePicture"] === undefined)
            ? false : (parameters["useBattlePicture"] === "true");
    const pictureYOffset = Number(parameters["pictureYOffset"]) || 0;
    const pictureDisplayHeight = Number(parameters["pictureDisplayHeight"]) || 400;
    const pictureDisplayYOffset = Number(parameters["pictureDisplayYOffset"]) || 0;
    const pictureZoom = Number(parameters["pictureZoom"]) || 1;
    const pictureMethod = parameters["pictureMethod"] || "battlePicture";
    const enableInputtingZoom = (parameters["enableInputtingZoom"] === undefined)
            ? false : (parameters["enableInputtingZoom"] === "true");

    const _parseDefaultUseSkillAnimationIds = function() {
        try {
            var paramStr = parameters["defaultUseSkillAnimationIds"] || "[]";
            var array = JSON.parse(paramStr);
            return array.map(token => {
                return Math.max(0, Math.round(Number(token)) || 0);
            });
        }
        catch (e) {
            console.error("defaultUseSkillAnimationIds parse failure. : " + e);
            return [];
        }

    }

    const defaultUseSkillAnimationIds = _parseDefaultUseSkillAnimationIds();
    const defaultUseItemAnimationId = Math.round(Number(parameters["defaultUseItemAnimationId"]) || 0);

    const fadeInDuration = Math.max(0, Math.round(Number(parameters["fadeInDuration"]) || 30));
    const popupDuration = Math.max(30, Math.round(Number(parameters["popupDuration"]) || 60));
    const fadeOutDuration = Math.max(0, Math.round(Number(parameters["fadeOutDuration"]) || 30));

    const multiplePopupOffsetX = (parameters["multiplePopupOffsetX"] === undefined)
            ? 8
            : Math.max(0, Math.round(Number(parameters["multiplePopupOffsetX"]) || 0));
    const multiplePopupOffsetY = (parameters["multiplePopupOffsetY"] === undefined)
            ? 16
            : Math.max(0, Math.round(Number(parameters["multiplePopupOffsetY"]) || 0));
    const displayLimitY = Math.max(0, Math.round(Number(parameters["displayLimitY"])) || 136)

    const colorHpDamage = parameters["colorHpDamage"] || "#ffffff";
    const colorHpRecover = parameters["colorHpRecover"] || "#80ff80";
    const colorHpNoDamage = parameters["colorHpNoDamage"] || "#ffffff";
    const colorMpDamage = parameters["colorMpDamage"] || "#ff8080";
    const colorMpRecover = parameters["colorMpRecover"] || "#ff80ff";
    const colorTpDamage = parameters["colorTpDamage"] || "#b4b440";
    const colorTpRecover = parameters["colorTpRecover"] || "#ffff40";

    const textAddedState = parameters["textAddedState"] || "";
    const colorAddedState = parameters["colorAddedState"] || "#ffffff";
    const textRemovedState = parameters["textRemovedState"] || "";
    const colorRemovedState = parameters["colorRemovedState"] || "#808080";
    const statePopupDuration = Math.max(0, Number("statePopupDuration") || 90);

    const textAddedBuff = parameters["textAddedBuff"] || "";
    const colorAddedBuff = parameters["colorAddedBuff"] || "#ffb000";
    const textAddedDebuff = parameters["textAddedDebuff"] || "";
    const colorAddedDebuff = parameters["colorAddedDebuff"] || "#0080b0"
    const textRemovedBuff = parameters["textRemovedBuff"] || "";
    const colorRemovedBuff = parameters["colorRemovedBuff"] || "#808080";

    const textEffective = parameters["textEffective"] || "";
    const colorEffective = parameters["colorEffective"] || "#ff8000";
    const effectiveRate = Math.max((Number(parameters["effectiveRate"]) || 1.3), 1);
    const textIneffective = parameters["textIneffective"] || "";
    const colorIneffective = parameters["colorIneffective"] || "#0080ff";
    const ineffectiveRate = (Number(parameters["ineffectiveRate"]) || 0).clamp(0, 1);
    const textGuard = parameters["textGuard"] || "";
    const colorGuard = parameters["colorGuard"] || "#808080";
    const seGuard = JSON.parse(parameters["seGuard"] || "{}");
    const textAbsorb = parameters["textAbsorb"] || "";
    const colorAbsorb = parameters["colorAbsorb"] || "#ff80ff";
    const textMiss = parameters["textMiss"] || "";
    const colorMiss = parameters["colorMiss"] || "#ffffff";
    const textCritical = parameters["textCritical"] || "";
    const colorCritical = parameters["colorCritical"] || "#ffffff";
    const textReflection = parameters["textReflection"] || "";
    const colorReflection = parameters["colorReflection"] || "#ff80ff";
    const textCounter = parameters["textCounter"] || "";
    const colorCounter = parameters["colorCounter"] || "#8080ff"

    const damageMoveXRandom = (parameters["damageMoveXRandom"] === undefined)
            ? false : (parameters["damageMoveXRandom"] === "true");
    const damageMoveX = Number(parameters["damageMoveX"]) || 0.0;

    const noDispStateIds = [];
    try {
        const ids = JSON.parse(parameters["noDispStateIds"] || "[]").map(token => Number(token));
        for (const id of ids) {
            if (!noDispStateIds.includes(id)) {
                noDispStateIds.push(id);
            }
        }

    }
    catch (e) {
        console.error(e);
    }

    const baseY = 40;



    /**
     * アクターIDを得る。
     * 
     * @param {object} args 引数
     */
    const _getActorId = function(args) {
        const actorId = Number(args.actorId) || 0;
        const variableId = Number(args.variableId) || 0;
        if (actorId > 0) {
            return actorId;
        } else if (variableId > 0) {
            return $gameVariables.value(variableId);
        } else {
            return 0;
        }
    };

    PluginManager.registerCommand(pluginName, "setBattlePicture", args => {
        const actorId = _getActorId(args);
        let fileName = args.fileName;
        if (actorId) {
            $gameActors.actor(actorId).setBattlePicture(fileName);
        }
    });

    //------------------------------------------------------------------------------
    // ColorManager
    /**
     * TPBキャスト中ゲージ色1を得る。
     * 
     * @returns {string} CSSスタイルの色データ
     */
    ColorManager.tpbCastGaugeColor1 = function() {
        return ColorManager.mpGaugeColor2();
    };
    /**
     * TPBキャスト中ゲージ色2を得る。
     * 
     * @returns {string} CSSスタイルの色データ
     */
    ColorManager.tbpCastGaugeColor2 = function() {
        return ColorManager.mpGaugeColor2();
    };
    //------------------------------------------------------------------------------
    // SoundManager
    /**
     * ガード時のSEを鳴らす。
     */
     SoundManager.playGuard = function() {
        if (seGuard.name) {
            AudioManager.playStaticSe(seGuard);
        }
    };

    //------------------------------------------------------------------------------
    // Game_System
    /**
     * 戦闘システムがサイドビューかどうかを判定する。
     * TwldBattleSystemはフロントビュー固定。
     * 
     * @returns {boolean} サイドビューの場合にはtrue, それ以外はfalse
     */
    Game_System.prototype.isSideView = function() {
        return false;
    };
    //------------------------------------------------------------------------------
    // Game_Battler
    const _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
    /**
     * メンバーを初期化する。
     */
    Game_Battler.prototype.initMembers = function() {
        _Game_Battler_initMembers.call(this);
        this._counterPopup = false; // カウンターポップアップ
        this._reflectionPopup = false; // リフレクションポップアップ
    };

    /**
     * カウンターポップアップフラグをクリアする。
     */
    Game_Battler.prototype.clearCounterPopup = function() {
        this._counterPopup = false;
    };

    /**
     * カウンターポップアップ要求が出ているかどうかを得る。
     * 
     * @returns {boolean} 要求が出ている場合にはtrue, それ以外はfalse.
     */
    Game_Battler.prototype.isCounterPopupRequested = function() {
        return this._counterPopup || false;
    };

    /**
     * カウンターポップアップを開始する。
     */
    Game_Battler.prototype.startCounterPopup = function() {
        this._counterPopup = true;
    };

    /**
     * 反射ポップアップフラグをクリアする。
     */
    Game_Battler.prototype.clearReflectionPopup = function() {
        this._reflectionPopup = false;
    };

    /**
     * 反射ポップアップ要求が出ているかどうかを得る。
     * 
     * @returns {boolean} 反射ポップアップ要求が出ている場合にはtrue, それ以外はfalse.
     */
    Game_Battler.prototype.isReflectionPopupRequested = function() {
        return this._reflectionPopup || false;
    };

    /**
     * 反射ポップアップを開始する。
     */
    Game_Battler.prototype.startReflectionPopup = function() {
        this._reflectionPopup = true;
    };

    /**
     * ガードを行う。
     */
    Game_Battler.prototype.performGuard = function() {
        SoundManager.playGuard();
    };

    /**
     * TPBキャスト中かどうかを判定する。
     * 
     * @returns {boolean} TPBキャスト中の場合にはtrue, それ以外はfalse
     */
    Game_Battler.prototype.isTpbCasting = function() {
        return (this._tpbState === "casting");
    };

    /**
     * TPBキャストタイムを得る。
     * 
     * @returns {number} TPBキャストタイム
     */
    Game_Battler.prototype.tpbCastTime = function() {
        return this._tpbCastTime;
    };

    //------------------------------------------------------------------------------
    // Game_Actor

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;

    /**
     * Game_Actorのパラメータを初期化する。
     */
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this, ...arguments);
        this._battlePicture = "";
    };
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    /**
     * このGame_Actorオブジェクトを、actorIdで指定されるアクターのデータで初期化する。
     * 
     * @param {number} actorId アクターID
     */
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, ...arguments);
        const actor = $dataActors[actorId];
        if (actor.meta.battlePicture) {
            this.setBattlePicture(actor.meta.battlePicture);
        }
    };

    /**
     * フロントビュー画像ファイル名を取得する。
     * 
     * @returns {string} フロントビュー戦闘グラフィックファイル名。
     */
    Game_Actor.prototype.battlePicture = function() {
        return this._battlePicture;
    };

    /**
     * フロントビュー戦画像ファイル名を設定する。
     * 
     * @param {string} pictureName フロントビュー戦闘グラフィックファイル名。
     */
    Game_Actor.prototype.setBattlePicture = function(pictureName) {
        this._battlePicture = pictureName;
        $gameTemp.requestBattleRefresh();
    };

    /**
     * 戦闘グラフィックのスプライトを表示するかどうかを取得する。
     * isSpriteVisibleがtrueになっていないと、ダメージポップアップは表示されない。
     * 
     * @returns {boolean} スプライトを表示する場合にはtrue, それ以外はfalse
     */
    Game_Actor.prototype.isSpriteVisible = function() {
        return true;
    };

    //------------------------------------------------------------------------------
    // Game_Party
    /**
     * 最大戦闘参加メンバー数を得る。
     * @returns {number} 最大戦闘参加メンバー数が返る。
     */
    Game_Party.prototype.maxBattleMembers = function() {
        return maxBattleMembers;
    };

    //------------------------------------------------------------------------------
    // Window_HudItemName
    /**
     * Window_HudItemName。
     * 
     * @class
     * スキル/アイテム名表示用ウィンドウ。
     * 用意しないと何の対象を選択しているのかわからん。
     */
    function Window_HudItemName() {
        this.initialize(...arguments);
    }

    Window_HudItemName.prototype = Object.create(Window_Base.prototype);
    Window_HudItemName.prototype.constructor = Window_HudItemName;

    /**
     * Window_HudItemName を初期化する。
     * 
     * @param {Rectangle} rect Rectangleオブジェクト
     */
    Window_HudItemName.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._item = null;
    };

    /**
     * アイテムを設定する。
     * 
     * @param {object} item アイテム。(DataItem/DataWeapon/DataArmor/DataSkill)
     */
    Window_HudItemName.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };

    /**
     * 表示をクリアする。
     */
    Window_HudItemName.prototype.clear = function() {
        this._item = null;
        this.refresh();
    };

    /**
     * コンテンツを再描画する。
     */
    Window_HudItemName.prototype.refresh = function() {
        const rect = this.baseTextRect();
        this.contents.clear();
        if (this._item) {
            this.drawItemName(this._item, rect.x, rect.y, rect.width);
        }
    };
    //------------------------------------------------------------------------------
    // Window_BattleActor の変更
    // 基本的に表示させないのにオーバーライドしてゴニョゴニョしてるのはなんでだ。
    const _Window_BattleActor_initialize = Window_BattleActor.prototype.initialize;

    /**
     * Window_BattleActorを初期化する。
     * 
     * Note: フレームとウィンドウ背景を表示するためにフックする。
     * 
     * @param {Rectangle} rect ウィンドウ矩形領域
     */
    Window_BattleActor.prototype.initialize = function(rect) {
        _Window_BattleActor_initialize.call(this, rect);
        this.frameVisible = true;
        this._bitmapsReady = 255;
    };
    
    /**
     * 項目を描画する。
     * 
     * @param {number} index インデックス番号
     */
    Window_BattleActor.prototype.drawItem = function(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        this.drawActorName(actor, rect.x, rect.y, rect.width);
    };

    /**
     * 最大カラム数を得る。
     * 
     * @returns {number} 最大カラム数
     */
    Window_BattleActor.prototype.maxCols = function() {
        return 1;
    };

    /**
     * 1項目の高さを得る。
     * 
     * @returns {number} 1項目の高さ。
     */
    Window_BattleActor.prototype.itemHeight = function() {
        return this.lineHeight();
    };

    /**
     * 最大行数を得る。
     * 
     * @returns {number} 最大行数。
     */
    Window_BattleActor.prototype.maxRows = function() {
        return this.innerHeight / this.itemHeight();
    };

    /**
     * 行スペースを得る。
     * 
     * @returns {number} 行スペース
     */
    Window_BattleActor.prototype.rowSpacing = function() {
        return 4;
    };

    const _Window_BattleActor_processCursorMove = Window_BattleActor.prototype.processCursorMove;
    /**
     * カーソルの移動を処理する。
     */
    Window_BattleActor.prototype.processCursorMove = function() {
        if (this.isCursorMovable()) {
            if (Input.isRepeated("right")) {
                this.cursorDown(Input.isTriggered("right"));
                return;
            } else if (Input.isRepeated("left")) {
                this.cursorUp(Input.isTriggered("left"));
                return;
            }
        } 
        return _Window_BattleActor_processCursorMove.call(this);
    };
    /**
     * 選択インデックスを設定する。
     * 
     * @param {number} index インデックス番号
     */
    // eslint-disable-next-line no-unused-vars
    Window_BattleActor.prototype.select = function(index) {
    };

    //------------------------------------------------------------------------------
    // Window_BattleEnemy の変更
    /**
     * 最大カラム数を得る。
     * 
     * @returns {number} 最大カラム数
     */
    Window_BattleEnemy.prototype.maxCols = function() {
        return 1;
    };

    const _Window_BattleEnemy_processCursorMove = Window_BattleEnemy.prototype.processCursorMove;

    /**
     * カーソルの移動を処理する。
     */
    Window_BattleEnemy.prototype.processCursorMove = function() {
        if (this.isCursorMovable()) {
            if (Input.isRepeated("right")) {
                this.cursorDown(Input.isTriggered("right"));
                return;
            } else if (Input.isRepeated("left")) {
                this.cursorUp(Input.isTriggered("left"));
                return;
            }
        } 
        return _Window_BattleEnemy_processCursorMove.call(this);
    };
    //------------------------------------------------------------------------------
    // Sprite_Damage
    const _Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
    /**
     * Sprite_Damageを初期化する。
     */
    Sprite_Damage.prototype.initialize = function() {
        _Sprite_Damage_initialize.call(this);
        this._displayWait = 0;
        this._stateDisplayNo = 0;
        this._duration = fadeInDuration + popupDuration + fadeOutDuration;
        this._frameCount = 0;
    };


    /**
     * Sprite_Damageを表示させるための準備をする。
     * 
     * @param {Game_Battler} target ポップアップ対象
     * !!!overwrite!!! Sprite_Damage.setup
     */
    Sprite_Damage.prototype.setup = function(target) {
        const result = target.result();
        this._critical = result.critical;
        if (this._critical && textCritical) {
            this._colorType = 0; // ColorManager.damageColor()の引数に渡る
                                 // Sprite_Damage.createBitmap()で
                                 // bitmap.textColor に ColorManager.damageColor(_colorType)として
                                 // 設定される。
            this.createCritical();
        }
        this._damageXMove = this.damageXMove(target.isAlive(), result);
        if ((result.missed || result.evaded) && textMiss) {
            this._colorType = 0;
            this.createMiss();
        } else {
            // 効果的かどうかをポップアップさせる。
            if ((result.hpAffected) && (result.hpDamage < 0) && (result.elementRate < 0) && textAbsorb) {
                this.createAbsorb();
            } else if ((result.elementRate > 0) && (result.elementRate < ineffectiveRate) && textIneffective) {
                this.createIneffective();
            } else if ((result.elementRate > effectiveRate) && textEffective) {
                this.createEffective();
            }
            if (textGuard && (result.hpDamage > 0) && result.isGuard) {
                this.createGuard();
            }
            if (result.hpDamage > 0) {
                this.createDigitsWithColor(result.hpDamage, colorHpDamage);
            } else if (result.hpDamage < 0) {
                this.createDigitsWithColor(result.hpDamage, colorHpRecover);
            } else {
                if (result.hpAffected) {
                    this.createDigitsWithColor(result.hpDamage, colorHpNoDamage);
                }
            }
            if (target.isAlive()) {
                if (result.mpDamage > 0) {
                    this.createDigitsWithColor(result.mpDamage, colorMpDamage);
                } else if (result.mpDamage < 0) {
                    this.createDigitsWithColor(result.mpDamage, colorMpRecover);
                }
                if (result.tpDamage > 0) {
                    this.createDigitsWithColor(result.tpDamage, colorTpDamage);
                } else if (result.tpDamage < 0) {
                    this.createDigitsWithColor(result.tpDamage, colorTpRecover);
                }
            }
            if (result.critical) {
                this.setupCriticalEffect();
            } else {
                this.setupNormalEffect();
            }
        }

        this.setupBufStatePopup(target);
    };

    /**
     * バフとステートの変化をポップアップさせる。
     * 
     * @param {Game_Battler} target 対象
     */
    Sprite_Damage.prototype.setupBufStatePopup = function(target) {
        const result = target.result();
        if (textRemovedState && (statePopupDuration > 0)) {
            for (const stateId of result.removedStates) {
                if (!target.isStateAffected(stateId)) {
                    this.createAddRemoveState(stateId, false);
                }
            }
        }
        if (textRemovedBuff && (statePopupDuration > 0)) {
            for (const paramId of result.addedBuffs) {
                if (!target.isBuffAffected(paramId)) {
                    this.createAddRemoveBuff(paramId, 0);
                }
            }
        }
        if (textAddedState && (statePopupDuration > 0)) {
            for (const stateId of result.addedStates) {
                if (target.isStateAffected(stateId)) {
                    this.createAddRemoveState(stateId, true);
                }
            }
        }
        if (textAddedDebuff && (statePopupDuration > 0)) {
            for (const paramId of result.addedDebuffs) {
                if (target.isDebuffAffected(paramId)) {
                    this.createAddRemoveBuff(paramId, -1);
                }
            }
        }
        if (textAddedBuff && (statePopupDuration > 0)) {
            for (const paramId of result.removedBuffs) {
                if (target.isBuffAffected(paramId)) {
                    this.createAddRemoveBuff(paramId, 1);
                }
            }
        }
    };

    /**
     * X方向移動量を得る。
     * 
     * @param {boolean} isAlive ターゲットが生存しているかどうか。
     * @param {object} result 結果
     * @returns {number} X方向移動量。
     */
    Sprite_Damage.prototype.damageXMove = function(isAlive, result) {
        // Note: 動かそうかと思ったけれど、
        //       なんか判定が上手くいかない。
        //       たぶん target.isAlive() && result.mpDamage に引っかかってる。
        if ((result.hpAffected && (result.hpDamage >= 0))
                || (isAlive && result.mpDamage >= 0)) {
            if (damageMoveXRandom) {
                return Math.random() * damageMoveX * 2 - damageMoveX;
            } else {
                return damageMoveX;
            }
        } else {
            return 0;
        }

    };

    /**
     * Missスプライトを作成する。
     * 
     * !!!overwrite!!! Sprite_Damage.createMiss
     */
    Sprite_Damage.prototype.createMiss = function() {
        const h = this.fontSize();
        const w = Math.floor(h * textMiss.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = colorMiss;
        sprite.bitmap.fontItalic = true;
        sprite.bitmap.drawText(textMiss, 0, 0, w, h, "center");
        sprite.anchor.y = 0.5;
        sprite.dy = 0;
        sprite.opacity = 0;
        sprite.x = -3 * fadeInDuration;
        sprite.y = -40;
        sprite.updatePosition = this.updateMiss.bind(this);
    };

    /**
     * クリティカル表示のスプライトを作成する。
     */
    Sprite_Damage.prototype.createCritical = function() {
        const h = this.fontSize();
        const w = Math.floor(h * textCritical.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.TextColor = colorCritical;
        sprite.bitmap.fontItalic = true;
        sprite.bitmap.drawText(textCritical, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -40;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateCritical.bind(this);
    };

    /**
     * 吸収表示のスプライトを作成する。
     */
    Sprite_Damage.prototype.createAbsorb = function() {
        const h = this.fontSize();
        const w = Math.floor(h * textAbsorb.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = colorAbsorb;
        sprite.bitmap.fontItalic = true;
        sprite.bitmap.drawText(textAbsorb, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -40;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateAbsorb.bind(this);
    };

    /**
     * 効果的表示のスプライトを作成する。
     */
    Sprite_Damage.prototype.createEffective = function() {
        const h = this.fontSize();
        const w = Math.floor(h * textEffective.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = colorEffective;
        sprite.bitmap.fontItalic = true;
        sprite.bitmap.drawText(textEffective, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -40;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateEffective.bind(this);
    };

    /**
     * 効果的表示のスプライトを作成する。
     */
    Sprite_Damage.prototype.createIneffective = function() {
        const h = this.fontSize();
        const w = Math.floor(h * textIneffective.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = colorIneffective;
        sprite.bitmap.fontItalic = true;
        sprite.bitmap.drawText(textIneffective, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -40;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateEffective.bind(this);
    };

    /**
     * ガード表示のスプライトを作成する。
     */
    Sprite_Damage.prototype.createGuard = function() {
        const h = this.fontSize();
        const w = Math.floor(h * textGuard.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = colorGuard;
        sprite.bitmap.fontItalic = true;
        sprite.bitmap.drawText(textGuard, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -40;
        sprite.y = -60;
        sprite.opacity = 0;
        sprite.dy = 0;
        sprite.updatePosition = this.updateGuard.bind(this);
    };

    /**
     * 数値スプライトを作成する。
     * 
     * @param {number} value 表示する値
     * @param {string} valueColor 値の色
     */
    Sprite_Damage.prototype.createDigitsWithColor = function(value, valueColor) {
        const string = Math.abs(value).toString();
        const h = this.fontSize();
        const w = Math.floor(h * 0.75);
        for (let i = 0; i < string.length; i++) {
            const sprite = this.createChildSprite(w, h);
            sprite.bitmap.textColor = valueColor;
            sprite.bitmap.drawText(string[i], 0, 0, w, h, "center");
            sprite.x = (i - (string.length - 1) / 2) * w;
            sprite.ry = baseY; // ry : 実数y
            sprite.dy = 10; // dy: 速度
            sprite.ay = 0.5; // ay: 加速度 
            sprite.rx = sprite.x; // rx : 実数x
            sprite.wait = this._displayWait + i * 8; // 左から順番に表示していく。
            sprite.visible = sprite.wait === 0;
            sprite.updatePosition = this.updateDigits.bind(this);
            sprite.scale.x = 0.8;
            sprite.scale.y = 0.8;
        }
        this._displayWait += 30;
        this._duration += 30;
    };

    /**
     * 表示文字サイズを取得する。
     * 
     * @returns {number} 文字サイズ
     * !!!overwrite!!! Sprite_Damage.fontSize()
     */
    Sprite_Damage.prototype.fontSize = function () {
        // クリティカル時はフォントサイズを大きくする。
        return $gameSystem.mainFontSize() + ((this._critical) ? 20 : 10);
    };

    /**
     * 通常ダメージのエフェクトを準備する。
     */
    Sprite_Damage.prototype.setupNormalEffect = function() {
        this._flashColor = [160, 160, 160, 200];
        this._flashDuration = 40;
    };

    /**
     * クリティカルによるスプライトの効果を設定する。
     * 
     * !!!overwrite!!! Sprite_Damage.setupCriticalEffect()
     */
    Sprite_Damage.prototype.setupCriticalEffect = function () {
        this._flashColor = [180, 0, 0, 200];
        this._flashDuration = 40;
    };

    const _Sprite_Damage_update = Sprite_Damage.prototype.update;
    /**
     * Sprite_Damageを更新する。
     */
    Sprite_Damage.prototype.update = function() {
        this._frameCount++;
        _Sprite_Damage_update.call(this);
    };

    /**
     * 子のスプライトを更新する。
     * 
     * @param {Sprite} sprite 子のスプライト
     * !!!overwrite!!! Sprite_Damage.updateChild()
     */
    Sprite_Damage.prototype.updateChild = function(sprite) {
        sprite.updatePosition(sprite);
    };

    /**
     * Miss表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。Missと書かれたスプライトが1つだけ。
     */
    Sprite_Damage.prototype.updateMiss = function(sprite) {
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + popupDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }

    };

    /**
     * Critical表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。Criticalと書かれたスプライトが1つだけ。
     */
    Sprite_Damage.prototype.updateCritical = function(sprite) {
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + popupDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };

    /**
     * 吸収表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。
     */
    Sprite_Damage.prototype.updateAbsorb = function(sprite) {
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + fadeOutDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };
    /**
     * 効果的表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。
     */
    Sprite_Damage.prototype.updateGuard = function(sprite) {
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + fadeOutDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };
    /**
     * 効果的表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。
     */
    Sprite_Damage.prototype.updateEffective = function(sprite) {
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + fadeOutDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };

    /**
     * 効果なし表示Spriteを更新する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。
     */
    Sprite_Damage.prototype.updateIneffective = function(sprite) {
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + popupDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };

    /**
     * 追加または解除されたステートのポップアップを作成する。
     * 
     * @param {number} stateId ステートID
     * @param {boolean} isAdded 追加された場合にはtrue, 解除された場合にはfalse.
     * @returns {boolean} 追加した場合にはtrue, 追加しない場合にはfalse.
     */
    Sprite_Damage.prototype.createAddRemoveState = function(stateId, isAdded) {
        const state = $dataStates[stateId];
        if (noDispStateIds.includes(stateId) || !state || !state.message1 || state.meta.noPopup) {
            return false;
        }

        const text = isAdded ? textAddedState.format(state.name) : textRemovedState.format(state.name);
        if (text.length === 0) {
            return false;
        }

        const textColor = isAdded ? colorAddedState : colorRemovedState;
        this.createBuffStateSprite(text, textColor);
        return true;
    };
    /**
     * 追加または解除されたバフのポップアップを作成する。
     * 
     * @param {number} paramId パラメータID
     * @param {number} type タイプ(>0:バフ, <0:デバフ, 0:解除)
     * @returns {boolean} 追加した場合にはtrue, 追加しない場合にはfalse.
     */
    Sprite_Damage.prototype.createAddRemoveBuff = function(paramId, type) {
        let text = "";
        let textColor = "";
        if (type > 0) {
            text = textAddedBuff.format(TextManager.param(paramId));
            textColor = colorAddedBuff;
        } else if (type < 0) {
            text = textAddedDebuff.format(TextManager.param(paramId));
            textColor = colorAddedDebuff;
        } else {
            text = textRemovedBuff.format(TextManager.param(paramId));
            textColor = colorRemovedBuff;
        }
        if (text.length === 0) {
            return false;
        }
        this.createBuffStateSprite(text, textColor)

        return true;
    };

    /**
     * バフ・デバフのポップアップスプライトを作成する。
     * 
     * @param {string} text 文字
     * @param {string} textColor 文字色
     */
    Sprite_Damage.prototype.createBuffStateSprite = function(text, textColor) {
        const fontSize = $gameSystem.mainFontSize();
        const displayableCount = Math.max(1, Math.floor(140 / (fontSize + 8)));
        const stateWaitOffset = popupDuration - fadeInDuration
                + Math.floor(this._stateDisplayNo / displayableCount) * (statePopupDuration - 10)
                + (this._stateDisplayNo % 4) * 10 + this._displayWait;

        const h = fontSize;
        const w = Math.floor(h * text.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = textColor;
        sprite.bitmap.fontSize = fontSize;
        sprite.bitmap.drawText(text, 0, 0, w, h, "center");
        sprite.anchor.y = 0;
        sprite.x = -10 + this._stateDisplayNo % displayableCount * 5;
        sprite.y = -140 + this._stateDisplayNo % displayableCount * (fontSize + 8);
        sprite.opacity = 0;
        sprite.ry = sprite.y;
        sprite.dy = 0;
        sprite.wait = stateWaitOffset;
        sprite.updatePosition = this.updateAddRemoveState.bind(this);
        sprite.frameCount = 0;

        this._duration += Math.max(0, statePopupDuration - fadeInDuration); // 表示長さだけ延長
        this._stateDisplayNo++;
    };

    /**
     * ステート付与/解除ポップアップ表示Spriteを更新する。
     * Y=-60から上に移動する。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。1つのSpriteが1桁の数値を表示している。
     */
    Sprite_Damage.prototype.updateAddRemoveState = function(sprite) {
        if (sprite.wait > 0) {
            sprite.wait--;
            return;
        }

        const frameCount = sprite.frameCount;
        sprite.frameCount++;

        // 上に移動
        if (frameCount < 10) {
            sprite.opacity = Math.min(255, sprite.opacity + 25);
            sprite.x += 1;
        } else if (frameCount > (statePopupDuration - 10)) { // 消す
            sprite.opacity = Math.max(0, sprite.opacity - 25);
            sprite.x += 1;
        }
    };

    /**
     * 数値ポップアップ表示Spriteを更新する。
     * Y=-40から上に移動して、Y=0を超えたらY=0に落ちてくる。
     * 
     * @param {Sprite} sprite Spriteオブジェクト。1つのSpriteが1桁の数値を表示している。
     */
    Sprite_Damage.prototype.updateDigits = function(sprite) {
        if (sprite.wait > 0) {
            sprite.wait--;
            return;
        }
        sprite.visible = true;

        sprite.ry -= sprite.dy;
        sprite.dy -= sprite.ay; // 減速するよ


        if ((sprite.ry > baseY) && (sprite.dy < 0)) {
            sprite.ry = baseY;
        } else {
            sprite.rx += this._damageXMove;
            sprite.scale.x += 0.01;
            sprite.scale.y += 0.01;
        }

        sprite.x = Math.round(sprite.rx);
        sprite.y = Math.round(sprite.ry);
        sprite.setBlendColor(this._flashColor);

        if (this._frameCount > (fadeInDuration + popupDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 25);
            }
            sprite.x += 3;
        }
    };

    /**
     * 点滅カラーを更新する
     * 点滅カラー配列のアルファ値を変更することで点滅を実現する。
     */
    Sprite_Damage.prototype.updateFlash = function() {
        if (this._flashDuration > 20) {
            this._flashColor[3] -= 10;
            this._flashDuration--;
        } else if (this._flashDuration > 0) {
            this._flashColor[3] += 10;
            this._flashDuration--;
        } else if (this._flashDuration == 0) {
            this._flashDuration = 40;
        }
    };
    //------------------------------------------------------------------------------
    // Sprite_BattlePopupText の変更
    /**
     * Sprite_BattlePopupText
     * ポップアップテキストを表示するためのスプライト。
     * Counter/Reflectionの表示を行う。
     */
     function Sprite_BattlePopupText() {
        this.initialize(...arguments);
    }

    Sprite_BattlePopupText.prototype = Object.create(Sprite.prototype);
    Sprite_BattlePopupText.prototype.constructor = Sprite_BattlePopupText;

    /**
     * Sprite_BattlePopupText を初期化する。
     */
    Sprite_BattlePopupText.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._duration = 90;
        this._frameCount = 0;
    };

    /**
     * Sprite_BattlePopupTextを破棄する。
     * 
     * @param {object} options 破棄オブション
     */
    Sprite_BattlePopupText.prototype.destroy = function(options) {
        for (const child of this.children) {
            if (child.bitmap) {
                child.bitmap.destroy();
            }
        }
        Sprite.prototype.destroy.call(this, options);
    };

    /**
     * このスプライトに描画するフォントのサイズを得る。
     * 
     * @returns {number} フォントサイズ
     */
    Sprite_BattlePopupText.prototype.fontSize = function() {
        return $gameSystem.mainFontSize() + 4;
    };

    /**
     * フォントフェースを得る。
     * 
     * @returns {string} フォントフェース
    */
     Sprite_BattlePopupText.prototype.fontFace = function() {
        return $gameSystem.numberFontFace();
    };

    /**
     * Sprite_BattlePopupTextを表示させるための準備をする。
     * 
     * @param {string} text ポップアップテキスト
     * @param {string} textColor テキストカラー
     */
    Sprite_BattlePopupText.prototype.setup = function(text, textColor) {
        const h = this.fontSize();
        const w = Math.floor(h * text.length);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.textColor = textColor;
        sprite.bitmap.fontItalic = true;
        sprite.bitmap.drawText(text, 0, 0, w, h, "center");
        sprite.anchor.y = 0.5;
        sprite.dy = 0;
        sprite.opacity = 0;
        sprite.x = -3 * fadeInDuration;
        sprite.y = -60;
    };

    /**
     * 子スプライトを作成する。
     * 既定の実装では、スプライト下端中央に原点、
     * 基準位置から(0,-40)の位置にスプライトを作成する。
     * 
     * @param {number} width 幅
     * @param {number} height 高さ
     */
    Sprite_BattlePopupText.prototype.createChildSprite = function(width, height) {
        const sprite = new Sprite();
        sprite.bitmap = this.createBitmap(width, height);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.y = -40;
        sprite.ry = sprite.y;
        sprite.opacity = 0;
        this.addChild(sprite);
        return sprite;
    };
    /**
     * Bitmapを作成する。
     * 
     * @param {number} width 幅
     * @param {number} height 高さ
     * @return {Bitmap} Bitmapオブジェクト
     */
    Sprite_BattlePopupText.prototype.createBitmap = function(width, height) {
        const bitmap = new Bitmap(width, height);
        bitmap.fontFace = this.fontFace();
        bitmap.fontSize = this.fontSize();
        bitmap.outlineColor = "rgba(0, 0, 0, 0.7)";
        bitmap.outlineWidth = 4;
        return bitmap;
    };

    /**
     * Sprite_Damageを更新する。
     */
    Sprite_BattlePopupText.prototype.update = function() {
        Sprite.prototype.update.call(this);
        if (this._duration > 0) {
            this._duration--;
            for (const child of this.children) {
                this.updateChild(child);
            }
            this.visible = (this._duration > 0);
        }
    };

    /**
     * このスプライトがアニメーション中かどうかを得る。
     *
     * @returns {boolean} アニメーション中の場合にはtrue, それ以外はfalse
     */
    Sprite_BattlePopupText.prototype.isPlaying = function() {
        return this._duration > 0;
    };

    /**
     * 子スプライトを更新する。
     * 
     * @param {Sprite} sprite 子スプライト
     */
    Sprite_BattlePopupText.prototype.updateChild = function(sprite) {
        if (this._frameCount < fadeInDuration) {
            if (sprite.x < 0) {
                sprite.x += 3;
            }
            let opacity = sprite.opacity;
            if (opacity < 255) {
                sprite.opacity = Math.min(255, opacity + 10);
            }
        }
        if (this._frameCount > (fadeInDuration + popupDuration)) {
            let opacity = sprite.opacity;
            if (opacity > 0) {
                sprite.opacity = Math.max(0, opacity -= 10);
            }
            sprite.x += 3;
        }
    };


    //------------------------------------------------------------------------------
    // Sprite_Gauge
    const _Sprite_Gauge_initMembers = Sprite_Gauge.prototype.initMembers;
    /**
     * メンバを初期化する。
     */
    Sprite_Gauge.prototype.initMembers = function() {
        _Sprite_Gauge_initMembers.call(this);
        this._isDrawValue = true;
        this._isDrawMaxValue = true;
    };

    /**
     * Bitmapの高さを得る。
     * 
     * @return {number} Bitmapの高さ。
     */
    Sprite_Gauge.prototype.bitmapHeight = function() {
        return 40;
    };    
    /**
     * Bitmapの幅を得る。
     * 
     * @return {number} Bitmapの幅。
     */
    Sprite_Gauge.prototype.bitmapWidth = function() {
        return 140;
    };
    /**
     * 値を描画するかどうかを設定する。
     * 
     * @param {boolean} isDraw 値を描画する場合にはtrue, それ以外はfalse.
     */
    Sprite_Gauge.prototype.setDrawValue = function(isDraw) {
        this._isDrawValue = isDraw;
        this.redraw();
    };
    /**
     * 最大値を描画するかどうかを設定する。
     * 
     * @param {boolean} isDraw 最大値を描画する場合にはtrue, それ以外はfalse.
     */
    Sprite_Gauge.prototype.setDrawMaxValue = function(isDraw) {
        this._isDrawMaxValue = isDraw;
        this.redraw();
    };

    /**
     * ラベルを描画する。
     */
    Sprite_Gauge.prototype.drawLabel = function() {
        const label = this.label();
        const x = this.labelOutlineWidth() / 2;
        const y = this.labelY();
        const height = this.bitmapHeight();
        this.setupLabelFont();

        const labelWidth = this.labelWidth();
        this.bitmap.paintOpacity = this.labelOpacity();
        this.bitmap.drawText(label, x, y, labelWidth, height, "left");
        this.bitmap.paintOpacity = 255;
    };

    /**
     * ラベルの幅を得る。
     * 
     * @returns {number} ラベルの幅
     */
    Sprite_Gauge.prototype.labelWidth = function() {
        const width = this.bitmapWidth();
        return width - this.gaugeX() - 2;
    };
    /**
     * ゲージ描画のY位置を取得する。
     * 
     * @return {number} Y位置
     */
    Sprite_Gauge.prototype.labelY = function() {
        return 8;
    };
    /**
     * ゲージを描画する。
     */
    Sprite_Gauge.prototype.drawGauge = function() {
        const gaugeX = this.gaugeX();
        const gaugeY = this.bitmapHeight() - this.gaugeHeight();
        const gaugewidth = this.bitmapWidth() - gaugeX;
        const gaugeHeight = this.gaugeHeight();
        this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
    };

    /**
     * 値を描画する。
     * 
     * !!!overwrite!!! Sprite_Gauge.drawValue()
     *     描画内容を変更するため、オーバーライドする。
     */
    Sprite_Gauge.prototype.drawValue = function() {
        if (!this._isDrawValue) {
            return ;
        }

        const currentValue = this.currentValue();
        const x = this.gaugeX();
        const width = this.bitmapWidth() - x;
        const height = this.bitmapHeight();

        if (this._isDrawMaxValue) {
            const currnetValueWidth = Math.floor(width * 0.6);
            const maxValueWidth = width - currnetValueWidth;


            const maxValue = this.currentMaxValue();
            const maxValueY = this.maxValueY();
            const maxValueHeight = height - maxValueY;
            
            this.setupValueFont();
            this.bitmap.drawText(currentValue, x, 0, currnetValueWidth, height, "right");
            this.setupMaxValueFont();
            this.bitmap.drawText("/", x + currnetValueWidth, maxValueY, maxValueWidth, maxValueHeight, "left");
            this.bitmap.drawText(maxValue, x + currnetValueWidth, maxValueY, maxValueWidth, maxValueHeight, "right");
        } else {
            this.setupValueFont();
            this.bitmap.drawText(currentValue, x, 0, width, height, "right");
        }
    };

    /**
     * 現在の最大値を得る。
     * 
     * @returns {number} 最大値
     */
    Sprite_Gauge.prototype.currentMaxValue = function() {
        if (this._battler) {
            switch (this._statusType) {
                case "hp":
                    return this._battler.mhp;
                case "mp":
                    return this._battler.mmp;
                case "tp":
                    return this._battler.maxTp();
                case "time":
                    return 1.0; // TPBゲージは最大値が1.0
            }
        }
        return NaN;
    };

    /**
     * 値のフォントサイズを得る。
     * 
     * @return {number} 値のフォントサイズ。
     */
    Sprite_Gauge.prototype.valueFontSize = function() {
        return $gameSystem.mainFontSize() + 4;
    };

    /**
     * 数値フォントをセットアップする。
     */
    Sprite_Gauge.prototype.setupMaxValueFont = function() {
        this.bitmap.fontFace = this.valueFontFace();
        this.bitmap.fontSize = this.maxValueFontSize();
        this.bitmap.textColor = this.valueColor();
        this.bitmap.outlineColor = this.valueOutlineColor();
        this.bitmap.outlineWidth = this.valueOutlineWidth();
    };
    /**
     * 最大値のY位置を取得する。
     * 
     * @return {number} Y位置
     */
    Sprite_Gauge.prototype.maxValueY = function() {
        return 12;
    };
    /**
     * 最大値のフォントサイズを取得する。
     * 
     * @returns {number} 最大値のフォントサイズ
     */
    Sprite_Gauge.prototype.maxValueFontSize = function() {
        return $gameSystem.mainFontSize() - 6;
    };


    //------------------------------------------------------------------------------
    // Sprite_BattleHudActorName
    Sprite_BattleHudActorName.prototype = Object.create(Sprite_Name.prototype);
    Sprite_BattleHudActorName.prototype.constructor = Sprite_BattleHudActorName;    

    /**
     * Sprite_BattleHudActorNameを初期化する。
     */
    Sprite_BattleHudActorName.prototype.initialize = function() {
        Sprite_Name.prototype.initialize.call(this);
    };

    /**
     * ビットマップの高さを得る。
     * 
     * @returns {number} Bitmapの高さ
     */
    Sprite_BattleHudActorName.prototype.bitmapHeight = function() {
        return 18;
    };    
    /**
     * Sprite_Nameの名前表示用フォントサイズを得る。
     * 
     * @returns {number} 名前表示用フォントサイズ。
     */
    Sprite_BattleHudActorName.prototype.fontSize = function() {
        return 16;
    };

    /**
     * テキスト描画色を取得する。
     * 
     * @returns {string} 描画色
     */
    Sprite_BattleHudActorName.prototype.textColor = function() {
        if (this._battler && (this._battler.isDead() || this._battler.isDying())) {
            return ColorManager.hpColor(this._battler);
        } else {
            return ColorManager.normalColor();
        }
    };

    //------------------------------------------------------------------------------
    // Sprite_HudStateIcons
    
    Sprite_HudStateIcons.prototype = Object.create(Sprite.prototype);
    Sprite_HudStateIcons.prototype.constructor = Sprite_HudStateIcons;
    
    /**
     * Sprite_HudStateIconsを初期化する。
     */
    Sprite_HudStateIcons.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    };

    /**
     * Sprite_HudStateIconsのメンバを初期化する。
     */
    Sprite_HudStateIcons.prototype.initMembers = function() {
        this._battler = null;
        this._animationCount = 0;
        this._iconIndex = 0;
        this.anchor.x = 0;
        this.anchor.y = 0.5;
    };

    /**
     * Sprite_HudStateIconsを破棄する。
     */
    Sprite_HudStateIcons.prototype.destroy = function() {
        Sprite.prototype.destroy.call(this);
        // bitmapはnewで構築しているので解放が必要。
        // iconBitmapはImageManager経由なのでそちらで上手いこと管理してくれる。
        if (this.bitmap) {
            this.bitmap.destroy();
        }
    };

    /**
     * IconSetのBitmapをロードする。
     */
    Sprite_HudStateIcons.prototype.loadBitmap = function() {
        const width = ImageManager.iconWidth * 4 + 6;
        const height = Math.floor(ImageManager.iconHeight * 1.25);
        this.bitmap = new Bitmap(width, height);
        this._iconBitmap = ImageManager.loadSystem("IconSet");
        this.bitmap.fontFace = $gameSystem.numberFontFace();
        this.bitmap.fontSize = ImageManager.iconHeight * 0.5;
    };

    /**
     * このスプライトに関連付けるGame_Battlerオブジェクトを設定する。
     * 
     * @param {Game_Battler} battler ステートを表示するGame_Battlerオブジェクト
     */
    Sprite_HudStateIcons.prototype.setup = function(battler) {
        if (this._battler !== battler) {
            this._battler = battler;
            this._animationCount = this.animationWait();
        }
    };

    /**
     * Sprite_HudStateIcons を更新する。
     */
    Sprite_HudStateIcons.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updateIcon();
            this._animationCount = 0;
        }
    };

    /**
     * アニメーションを表示するフレーム数。
     */
    Sprite_HudStateIcons.prototype.animationWait = function() {
        return 40;
    };

    /**
     * 表示するアイコンを切り替えて更新する。
     */
    Sprite_HudStateIcons.prototype.updateIcon = function() {
        const displayStates = this.displayStates();
        this.bitmap.clear();
        if (displayStates.length > 0) {
            this._iconIndex += 4;
            if (this._iconIndex >= displayStates.length) {
                this._iconIndex = 0;
            }
            for (let i = 0; i < 4; i++) {
                const displayState = displayStates[this._iconIndex + i];
                if (displayState) {
                    if (displayState.iconIndex) {
                        this.drawIcon(displayState.iconIndex, i);
                    }
                    if (displayState.turns) {
                        this.drawTurns(displayState.turns, i);
                    }
                }
            }
        } else {
            this._animationIndex = 0;
        }
    };

    /**
     * 表示するステートを得る。
     * 
     * @returns {Array<object>} 表示するステート情報
     */
    Sprite_HudStateIcons.prototype.displayStates = function() {
        if (this.shouldDisplay()) {
            if (this._battler.displayStates) {
                return this._battler.displayStates();
            } else {
                const icons = this._battler.allIcons();
                const displayStates = [];
                for (const iconIndex of icons) {
                    displayStates.push({
                        iconIndex:iconIndex,
                        turns:0
                    });
                }
                return displayStates;
            }
        } else {
            return [];
        }

    };

    /**
     * アイコンを描画する。
     * 
     * @param {number} iconIndex 描画するアイコンのインデックス
     * @param {number} drawIndex 書き込み先位置(0~3)
     */
    Sprite_HudStateIcons.prototype.drawIcon = function(iconIndex, drawIndex) {
        // 所定のアイコンをbltでコピーしていく。
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = (iconIndex % 16) * pw;
        const sy = Math.floor(iconIndex / 16) * ph;
        const dx = (pw + 2) * drawIndex;
        const dy = 0;
        this.bitmap.blt(this._iconBitmap, sx, sy, pw, ph, dx, dy);
    };

    /**
     * ターン数を描画する。
     * 
     * @param {number} turns ターン数
     * @param {number} drawIndex 描画位置(0-3)
     */
    Sprite_HudStateIcons.prototype.drawTurns = function(turns, drawIndex) {
        const dx = ImageManager.iconWidth * drawIndex + ImageManager.iconWidth / 2 - 2;
        const dy = Math.round(ImageManager.iconHeight * 0.75);
        this.bitmap.drawText(turns, dx, dy, (ImageManager.iconWidth / 2), ImageManager.iconHeight / 2, "right")
    };

    /**
     * このスプライトを表示するべきかどうかを取得する。
     * 
     * @returns {boolean} 表示するべき場合にはtrue, それ以外はfalse.
     */
    Sprite_HudStateIcons.prototype.shouldDisplay = function() {
        const battler = this._battler;
        return battler && (battler.isActor() || battler.isAlive());
    };
    //------------------------------------------------------------------------------
    // Sprite_Battler の変更
    const _Sprite_Battler_setupDamagePopup = Sprite_Battler.prototype.setupDamagePopup;
    /**
     * ダメージポップアップを準備する。
     * 
     * Note: 対象のバトラーにダメージポップアップ要求がセットされている場合に
     *       Sprite_Damageを作成して情報をポップさせるように動作する。
     */
    Sprite_Battler.prototype.setupDamagePopup = function() {
        this.setupCounterPopup();
        this.setupReflectionPopup();
        _Sprite_Battler_setupDamagePopup.call(this);
    };

    /**
     * ダメージスプライトを作成する。
     * 
     * Note: ベーシックシステムでは、連続して複数のダメージを表示する場合にはちょっとずつ左上にずらす。
     * 
     * !!!overwrite!!! Sprite_Battler.createDamageSprite()
     *     多重にダメージポップアップさせるときのオフセットを調整できるようにするため、オーバーライドする。
     */
    Sprite_Battler.prototype.createDamageSprite = function() {
        const last = this._damages[this._damages.length - 1];
        const sprite = new Sprite_Damage();
        this.adjustDamagePopupPosition(sprite, last);
        sprite.setup(this._battler);
        this._damages.push(sprite);
        this.parent.addChild(sprite);
    };

    /**
     * ダメージスプライトの初期位置を調整する。
     * 
     * @param {Sprite} sprite 調整対象のダメージポップアップスプライト
     * @param {Sprite} last 最後に表示したダメージポップアップスプライト
     */
    Sprite_Battler.prototype.adjustDamagePopupPosition = function(sprite, last) {
        if (last) {
            // 連続表示されているのでずらす。
            sprite.x = last.x + multiplePopupOffsetX;
            sprite.y = last.y - multiplePopupOffsetY;
            if (sprite.x >= (this.x + (this.width / 4))) {
                sprite.x = this.x + this.damageOffsetX();
            }
            if (sprite.y < displayLimitY) {
                sprite.y = this.y + this.damageOffsetY();
            }
        } else {
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
        }
    };

    /**
     * カウンターポップアップを準備する。
     */
    Sprite_Battler.prototype.setupCounterPopup = function() {
        if (this._battler.isCounterPopupRequested()) {
            this.createCounterSprite();
            this._battler.clearCounterPopup();
        }
    };

    /**
     * カウンター表示スプライトを作成する。
     */
    Sprite_Battler.prototype.createCounterSprite = function() {
        if (textCounter) {
            const last = this._damages[this._damages.length - 1];
            const sprite = new Sprite_BattlePopupText();
            this.adjustDamagePopupPosition(sprite, last);
            sprite.setup(textCounter, colorCounter);
            this._damages.push(sprite);
            this.parent.addChild(sprite);
        }
    };

    /**
     * リフレクションポップアップを準備する。
     */
    Sprite_Battler.prototype.setupReflectionPopup = function() {
        if (this._battler.isReflectionPopupRequested()) {
            this.createReflectionSprite();
            this._battler.clearReflectionPopup();
        }
    };

    /**
     * 反射ポップアップを準備する。
     */
    Sprite_Battler.prototype.createReflectionSprite = function() {
        if (textReflection) {
            const last = this._damages[this._damages.length - 1];
            const sprite = new Sprite_BattlePopupText();
            this.adjustDamagePopupPosition(sprite, last);
            sprite.setup(textReflection, colorReflection);
            this._damages.push(sprite);
            this.parent.addChild(sprite);
        }
    };

    //------------------------------------------------------------------------------
    // Sprite_Enemy
    const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
    /**
     * Sprite_Enemyのメンバーを初期化する。
     */
    Sprite_Enemy.prototype.initMembers = function() {
        _Sprite_Enemy_initMembers.call(this);
        this.createHpGaugeSprite();
        this.createTpbGaugeSprite();
    };
    /**
     * ステートアイコンスプライトを作成する。
     */
    Sprite_Enemy.prototype.createStateIconSprite = function() {
        this._stateIconSprite = new Sprite_HudStateIcons();
        this._stateIconSprite.anchor.x = 0.5;
        this._stateIconSprite.anchor.y = 0.5;
        this.addChild(this._stateIconSprite);
    };

    /**
     * HPゲージスプライトを作成する。
     */
    Sprite_Enemy.prototype.createHpGaugeSprite = function() {
        this._hpGaugeSprite = new Sprite_Gauge();
        this._hpGaugeSprite.setDrawValue(false);
        this._hpGaugeSprite.anchor.x = 0.5;
        this._hpGaugeSprite.anchor.y = 0.5;
        this._hpGaugeSprite.y = 0;
        this.addChild(this._hpGaugeSprite);
    };

    /**
     * TPBゲージスプライトを作成する。
     */
    Sprite_Enemy.prototype.createTpbGaugeSprite = function() {
        this._tpbGaugeSprite = new Sprite_Gauge();
        this._tpbGaugeSprite.anchor.x = 0.5;
        this._tpbGaugeSprite.anchor.y = 0.5;
        this._tpbGaugeSprite.y = 20;
        this.addChild(this._tpbGaugeSprite);
    };

    const _Sprite_Enemy_setHome = Sprite_Enemy.prototype.setHome;
    /**
     * ホーム位置を設定する。
     * 
     * @param {number} x X位置
     * @param {number} y Y位置
     */
    Sprite_Enemy.prototype.setHome = function(x, y) {
        _Sprite_Enemy_setHome.call(this, x + enemyAreaOffsetX, y);
    };

    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    /**
     * このSprite_Enemyが表現するエネミーを設定する。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     */
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        this._hpGaugeSprite.setup(battler, "hp");
        if (BattleManager.isTpb()) {
            this._tpbGaugeSprite.setup(battler, "time");
        }
    };

    const _Sprite_Enemy_updateVisibility = Sprite_Enemy.prototype.updateVisibility;
    /**
     * このSpriteの可視状態を更新する。
     */
    Sprite_Enemy.prototype.updateVisibility = function() {
        _Sprite_Enemy_updateVisibility.call(this);
        if (this.isGaugeVisible()) {
            if (BattleManager.isTpb()) {
                this._tpbGaugeSprite.visible = true;
            }
            this._hpGaugeSprite.visible = true;
        } else {
            if (BattleManager.isTpb()) {
                this._tpbGaugeSprite.visible = false;
            }
            this._hpGaugeSprite.visible = false;
        }
    };

    /**
     * ゲージが可視状態かどうかを取得する。
     * 
     * @returns {boolean} 可視状態の場合にはtrue, それ以外はfalse
     */
    Sprite_Enemy.prototype.isGaugeVisible = function() {
        return displayEnemyGauge && this._battler && this._battler.isSpriteVisible()
                && BattleManager.isInputting();
    };

    /**
     * ダメージスプライトを作成する。
     * 
     * !!!overwrite!!! Sprite_Enemy.createDamageSprite()
     *     Sprite_Battler.createDamageSprite()を明示的に呼び出すため、オーバーライドする。
     */
    Sprite_Enemy.prototype.createDamageSprite = function() {
        Sprite_Battler.prototype.createDamageSprite.call(this);
        if (this.isGaugeVisible() && this._hpGaugeSprite.startAnimation) {
            this._hpGaugeSprite.startAnimation();
        }
    };
    //------------------------------------------------------------------------------
    // Sprite_BattleHudActor
    // アクター情報を表示するHUD。
    Sprite_BattleHudActor.prototype = Object.create(Sprite_Battler.prototype);
    Sprite_BattleHudActor.prototype.constructor = Sprite_BattleHudActor;
    
    
    /**
     * Sprite_BattleHudActorを初期化する。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト。
     */
    Sprite_BattleHudActor.prototype.initialize = function(battler) {
        Sprite_Battler.prototype.initialize.call(this, battler);
        this._actor = null;
        this._faceName = "";
        this._faceIndex = -1;
        this._battlePictureName = "";
        this._activeSelAdd = 2;
        this._brightness = 255;
        this._scale = 1000; // 0.1%単位
        this._targetScale  = 1000; // 0.1%単位
        this.setFrame(0, 0, this.statusAreaWidth(), this.statusAreaHeight());
    };
    /**
     * ステータス領域の幅を得る。
     * 
     * @returns {number} ステータス領域の幅
     */
    Sprite_BattleHudActor.prototype.statusAreaWidth = function() {
        return statusAreaWidth;
    };

    /**
     * ステータス領域の高さを得る。
     * 
     * @returns {number} ステータスエリアの高さ
     */
    Sprite_BattleHudActor.prototype.statusAreaHeight = function() {
        return statusAreaHeight;
    };

    /**
     * メンバーを初期化する。
     */
    Sprite_BattleHudActor.prototype.initMembers = function() {
        Sprite_Battler.prototype.initMembers.call(this);
        this.createActiveSelSprite();
        this.createMainSprite();
        this.createStatusBackSprite();
        this.createNameSprite();
        this.createGaugeSprites();
        this.createStateIconSprite();
    };

    /**
     * 入力アクティブになったときに表示するスプライトをロードする。
     */
    Sprite_BattleHudActor.prototype.createActiveSelSprite = function() {
        this._activeSelSprite = new Sprite();
        try {
            this._activeSelSprite.bitmap = ImageManager.loadBitmap("img/hud/", "ActiveHud");
            this._activeSelSprite.x = 0;
            this._activeSelSprite.y = 6;
        }
        catch (e) {
            this._activeSelSprite.x = 0;
            this._activeSelSprite.y = 0;
        }
        this._activeSelSprite.anchor.x = 0.5;
        this._activeSelSprite.anchor.y = 1;
        this._activeSelSprite.opacity = 0;
        this.addChild(this._activeSelSprite);
    };

    /**
     * メインスプライトを作成する。
     * メインスプライトはHUDを構成する各スプライトを乗せる（addChild)する
     * ベースになるスプライト。
     */
    Sprite_BattleHudActor.prototype.createMainSprite = function() {
        this._mainSprite = new Sprite();
        this._mainSprite.baseScale = 1;
        this._mainSprite.anchor.x = 0.5; // 原点XはSprite中央
        this._mainSprite.anchor.y = 1; // 原点YはSprite下端
        if (!this._mainSprite.filters) {
            this._mainSprite.filters = [];
        }
        this._mainSpriteFilter = new BattleHudActorFilter();
        this._mainSprite.filters.push(this._mainSpriteFilter);
        this.addChild(this._mainSprite);
    };

    /**
     * ステータスの背景に表示するスプライトを作成する。
     */
    Sprite_BattleHudActor.prototype.createStatusBackSprite = function() {
        this._statusBackSprite = new Sprite();
        this._statusBackSprite.bitmap = ImageManager.loadBitmap("img/hud/", "StatusBackground")
        this._statusBackSprite.anchor.x = 0.5;
        this._statusBackSprite.anchor.y = 1;
        this._statusBackSprite.x = 0;
        this._statusBackSprite.y = 16;
        this._statusBackSprite.opacity = 128;
        this.addChild(this._statusBackSprite);
    };

    /**
     * アクター名スプライトを作成する。
     */
    Sprite_BattleHudActor.prototype.createNameSprite = function() {
        const sprite = new Sprite_BattleHudActorName();
        sprite.x = -statusAreaWidth / 2;
        sprite.y = -88;
        this._nameSprite = sprite;
        this.addChild(this._nameSprite);
    };

    /**
     * ゲージスプライトを作成する。
     */
    Sprite_BattleHudActor.prototype.createGaugeSprites = function() {
        // HPゲージ
        this._hpGaugeSprite = new Sprite_Gauge();
        this._hpGaugeSprite.x = -64;
        this._hpGaugeSprite.y = -80;
        this.addChild(this._hpGaugeSprite);

        // MPゲージ
        this._mpGaugeSprite = new Sprite_Gauge();
        this._mpGaugeSprite.setDrawMaxValue(false);
        this._mpGaugeSprite.x = -32;
        this._mpGaugeSprite.y = -40;
        this._mpGaugeSprite.scale.x = 0.75;
        this._mpGaugeSprite.scale.y = 0.50;
        this.addChild(this._mpGaugeSprite);

        // TPゲージ
        this._tpGaugeSprite = new Sprite_Gauge();
        this._tpGaugeSprite.setDrawMaxValue(false);
        this._tpGaugeSprite.x = -32;
        this._tpGaugeSprite.y = -24;
        this._tpGaugeSprite.scale.x = 0.75;
        this._tpGaugeSprite.scale.y = 0.50;
        this.addChild(this._tpGaugeSprite);

        // TPBゲージ
        this._tpbGaugeSprite = new Sprite_Gauge();
        this._tpbGaugeSprite.x = -32;
        this._tpbGaugeSprite.y = -8;
        this._tpbGaugeSprite.scale.x = 0.75;
        this._tpbGaugeSprite.scale.y = 0.50;
        this.addChild(this._tpbGaugeSprite);
        if (!BattleManager.isTpb()) {
            // ターン制の場合にはTPBゲージを表示しない。
            this._tpbGaugeSprite.visible = false;
        }
    };

    /**
     * ステータスアイコンスプライトを作成する。
     */
    Sprite_BattleHudActor.prototype.createStateIconSprite = function() {
        const sprite = new Sprite_HudStateIcons();
        sprite.x = -(statusAreaWidth / 2);
        sprite.y = -statusAreaHeight;
        this._stateIconSprite = sprite;
        this.addChild(sprite);
    };



    /**
     * メインのスプライトを取得する。
     * 
     * @returns {Sprite} メインのスプライト
     */
    Sprite_BattleHudActor.prototype.mainSprite = function() {
        return this._mainSprite;
    };

    /**
     * このスプライトに関連付けるGame_Battlerオブジェクトを構築する。
     * このメソッドは Spriteset_Battle.update()から、
     * 毎フレームコールされる実装になっている。
     * パフォーマンス低下を防ぐため、拡張する場合には onBattlerChangedをフックする。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト。
     */
    Sprite_BattleHudActor.prototype.setBattler = function(battler) {
        Sprite_Battler.prototype.setBattler.call(this, battler);
        if (battler !== this._actor) {
            this._actor = battler;
            this.onBattlerChanged(battler);
        }
    };

    /**
     * このスプライトに関連付けるGame_Battlerが変更されたときの処理を行う。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     */
    Sprite_BattleHudActor.prototype.onBattlerChanged = function(battler) {
        if (battler) {
            this.setHudPosition(battler.index());
            this._nameSprite.setup(battler);
            this._hpGaugeSprite.setup(battler, "hp");
            this._mpGaugeSprite.setup(battler, "mp");
            this._tpGaugeSprite.setup(battler, "tp");
            this._tpbGaugeSprite.setup(battler, "time");
            this._stateIconSprite.setup(battler);
            const condition = this.mainSpriteColorCondition();
            this._mainSpriteFilter.setSaturation(condition.saturation);
            this._mainSpriteFilter.setBrightness(condition.brightness);
            this._mainSprite.opacity = condition.opacity;
        } else {
            this._mainSprite.bitmap = null;
        }
    };

    /**
     * このスプライトに関連付けられているGame_Actorオブジェクトを取得する。
     * 
     * @returns {Game_Actor} Game_Actorオブジェクト。関連付けられていない場合にはnull.
     */
    Sprite_BattleHudActor.prototype.actor = function() {
        return this._actor;
    };

    /**
     * HUDの位置を得る。
     * 
     * @param {number} index 位置
     */
    Sprite_BattleHudActor.prototype.setHudPosition = function(index) {
        const battleMemberCount = $gameParty.battleMembers().length;
        const width = statusAreaWidth;
        const padding = statusAreaPadding;
        const maxStatusAreaWidth = (width + padding) * maxBattleMembers - statusAreaPadding;
        const totalStatusAreaWidth = (width + padding) * battleMemberCount - statusAreaPadding;
        const baseX = statusAreaOffsetX;
        const memberCountOffsetX = (maxStatusAreaWidth - totalStatusAreaWidth) / 2;
        const x = baseX + memberCountOffsetX + (width + padding) * index + width / 2;
        const y = Graphics.boxHeight;
        this.setHome(x, y);
    };

    /**
     * HUDを更新する。
     */
    Sprite_BattleHudActor.prototype.update = function() {
        Sprite_Battler.prototype.update.call(this);
        this.updateSelecting();
        this.updateColor();
    };

    /**
     * 選択状態表示を更新する。
     */
    Sprite_BattleHudActor.prototype.updateSelecting = function() {
        if (this._battler && this._battler.isInputting()) {
            this._activeSelSprite.opacity += this._activeSelAdd;
            if (this._activeSelSprite.opacity >= 128) {
                this._activeSelSprite.opacity = 128;
                this._activeSelAdd = -2;
            } else if (this._activeSelSprite.opacity <= 32) {
                this._activeSelSprite.opacity = 32;
                this._activeSelAdd = 2;
            }
        } else {
            this._activeSelCount = 0;
            this._activeSelSprite.opacity = 0;
        }

        if (enableInputtingZoom) {
            if (this._scale < this._targetScale) {
                this._scale = Math.min(this._targetScale, this._scale + 2);
            } else if (this._scale > this._targetScale) {
                this._scale = Math.max(this._targetScale, this._scale - 2);
            }
            if (this._scale === this._targetScale) {
                if (this._battler && (this._battler.isInputting() || this._battler.isSelected())) {
                    this._targetScale = (this._targetScale !== 1000) ? 1000 : 1100;
                } else {
                    this._targetScale = 1000;
                }
            }
            const scale = this._mainSprite.baseScale * this._scale / 1000.0;
            this._mainSprite.scale.x = scale;
            this._mainSprite.scale.y = scale;
        } else {
            const scale = this._mainSprite.baseScale * this._scale / 1000.0;
            this._mainSprite.scale.x = scale;
            this._mainSprite.scale.y = scale;
        }
    };

    /**
     * ステートに合わせて色を変更する。
     */
    Sprite_BattleHudActor.prototype.updateColor = function() {
        if (this._battler) {
            // 彩度
            const targetCondition = this.mainSpriteColorCondition();
            let saturation = this._mainSpriteFilter.saturation();
            if (saturation > targetCondition.saturation) {
                saturation = Math.max(saturation - 10, targetCondition.saturation);
            } else if (saturation < targetCondition.saturation) {
                saturation = Math.min(saturation + 50, targetCondition.saturation);
            }
            this._mainSpriteFilter.setSaturation(saturation);

            // 輝度
            let brightness = this._mainSpriteFilter.brightness();
            if (brightness > targetCondition.brightness) {
                brightness = Math.max(brightness - 10, targetCondition.brightness);
            } else if (brightness < targetCondition.brightness) {
                brightness = Math.min(brightness + 50, targetCondition.brightness);
            }
            this._mainSpriteFilter.setBrightness(brightness);

            // 不透明度
            const opacity = this._mainSprite.opacity;
            if (opacity > targetCondition.opacity) {
                this._mainSprite.opacity = Math.max(opacity - 10, targetCondition.opacity);
            } else if (opacity < targetCondition.opacity) {
                this._mainSprite.opacity = Math.min(opacity + 50, targetCondition.opacity);
            }
        }
    };

    /**
     * メインスプライトの色補正を得る。
     * 
     * @returns {object} 色補正
     */
    Sprite_BattleHudActor.prototype.mainSpriteColorCondition = function() {
        return {
            saturation : this.mainSpriteSaturation(),
            brightness : this.mainSpriteBrightness(),
            opacity : this.mainSpriteOpacity(),
        };
    };

    /**
     * メインスプライトの彩度補正値を得る。
     * 
     * @returns {number} 彩度補正値(0～255)
     */
    Sprite_BattleHudActor.prototype.mainSpriteSaturation = function() {
        return (this._actor.isDead()) ? 0 : 255;
    };

    /**
     * メインスプライトの輝度補正値を取得する。
     * 
     * @returns {number} 輝度(0～255)
     */
    Sprite_BattleHudActor.prototype.mainSpriteBrightness = function() {
        return (this._actor.isDead()) ? 128 : 255;
    };
    /**
     * メインスプライトの不透明度を得る。
     * 
     * @returns {number} 不透明度(0～255)
     */
    Sprite_BattleHudActor.prototype.mainSpriteOpacity = function() {
        return 255;
    };

    /**
     * このSpriteの可視状態を更新する。
     */
    Sprite_BattleHudActor.prototype.updateVisibility = function() {
        Sprite_Battler.prototype.updateVisibility.call(this);
        if (this._battler && this._battler.isInputting()) {
            this._activeSelSprite.visible = true;
        } else {
            this._activeSelSprite.visible = false;
        }
    };

    /**
     * Bitmapを更新する。
     * Sprite_Battler.update()からコールされる。
     */
    Sprite_BattleHudActor.prototype.updateBitmap = function() {
        Sprite_Battler.prototype.updateBitmap.call(this);
        if (useBattlePicture) {
            const battlePictureName = (typeof this._actor[pictureMethod] === "function") 
                    ? this._actor[pictureMethod]() : this._actor[pictureMethod];
            if (battlePictureName !== this._battlePictureName) {
                this.loadMainSpriteBitmapBattlePicture(battlePictureName);
            }
        } else {
            const faceName = this._actor.faceName();
            const faceIndex = this._actor.faceIndex();
            if ((faceName !== this._faceName) || (faceIndex !== this._faceIndex)) {
                this.loadMainSpriteBitmapFace(faceName, faceIndex);
            }
        }
    };

    /**
     * 戦闘ピクチャをメインスプライト画像として読み出す。
     * 
     * @param {string} battlePictureName 戦闘ピクチャ名
     */
    Sprite_BattleHudActor.prototype.loadMainSpriteBitmapBattlePicture = function(battlePictureName) {
        const bitmap = ImageManager.loadPicture(battlePictureName);
        this._mainSprite.bitmap = bitmap;
        if (bitmap.isReady()) {
            this.onBattlePictureLoaded();
        } else {
            bitmap.addLoadListener(this.onBattlePictureLoaded.bind(this));
        }
        this._battlePictureName = battlePictureName;
    }

    /**
     * 戦闘画像がロードされたときの処理を行う。
     */
    Sprite_BattleHudActor.prototype.onBattlePictureLoaded = function() {
        const pw = this._mainSprite.bitmap.width;

        // 表示可能最大幅
        const maxWidth = (statusAreaWidth + statusAreaPadding) / pictureZoom;

        const displayWidth = Math.min(pw, maxWidth);
        const displayOffsetX = (pw - displayWidth) / 2;
        this._mainSprite.setFrame(displayOffsetX, pictureYOffset, displayWidth, pictureDisplayHeight);
        this._mainSprite.baseScale = pictureZoom;

        const pos = this.mainSpritePosition();
        this._mainSprite.x = pos.x;
        this._mainSprite.y = pos.y;
    };


    /**
     * Faceをメインスプライト画像として読み出す。
     * 
     * @param {string} faceName 顔グラフィックファイル名
     * @param {number} faceIndex 顔グラフィックファイル中のインデックス番号
     */
    Sprite_BattleHudActor.prototype.loadMainSpriteBitmapFace = function(faceName, faceIndex) {
        this._mainSprite.bitmap = ImageManager.loadFace(faceName, faceIndex);
        const pw = ImageManager.faceWidth;
        const ph = ImageManager.faceHeight;
        const cw = Math.min(pw, this.statusAreaWidth());
        const ch = Math.min(ph, this.statusAreaHeight());
        const cx = (faceIndex % 4) * pw + Math.min(0, (this.statusAreaWidth() - cw) / 2);
        const cy = Math.floor(faceIndex / 4) * ph + Math.min(0, (this.statusAreaHeight() - ch) / 2);

        this._mainSprite.setFrame(cx, cy, cw, ch);
        this._faceName = faceName;
        this._faceIndex = faceIndex;
        this._mainSprite.baseScale = 1;

        const pos = this.mainSpritePosition();
        this._mainSprite.x = pos.x;
        this._mainSprite.y = pos.y;
    };


    /**
     * メインスプライトの位置を得る。
     * 
     * @returns {Point} スプライトの位置
     */
    Sprite_BattleHudActor.prototype.mainSpritePosition = function() {
        const x = 0;
        let y = -this.statusAreaHeight() + pictureDisplayYOffset;

        if (useBattlePicture && this._mainSprite.bitmap) {
            const displayHeight = pictureDisplayHeight * pictureZoom;
            y += Math.round(displayHeight).clamp(200, 400) - 60;
        } else {
            y += ImageManager.faceHeight;
        }

        return new Point(x, y);
    };

    /**
     * フレーム（表示領域）を更新する。
     */
    Sprite_BattleHudActor.prototype.updateFrame = function() {
        Sprite_Battler.prototype.updateFrame.call(this);
    };

    /**
     * ダメージポップアップ位置Yを取得する。
     * 
     * @returns {number} ポップアップ位置y
     */
    Sprite_BattleHudActor.prototype.damageOffsetY = function() {
        return ImageManager.faceHeight - this.statusAreaHeight() - 60;
    };

    /**
     * ダメージスプライトを構築する。
     */
    Sprite_BattleHudActor.prototype.createDamageSprite = function() {
        Sprite_Battler.prototype.createDamageSprite.call(this);

        // if (this._hpGaugeSprite.visible ) {
        //     this._hpGaugeSprite.startAnimation();
        // }
    };
    //------------------------------------------------------------------------------
    // DisplayBattlePictureFilter
    /**
     * DisplayBattlePictureFilter。
     * カラーフィルター。
     * 画面上の指定したX位置を境界として、左側を非表示、右側を表示させる。
     * 画面上の指定したY位置を境界として、上側を表示、下側を非表示にする。
     */
    function DisplayBattlePictureFilter() {
        this.initialize(...arguments);
    }

    DisplayBattlePictureFilter.prototype = Object.create(PIXI.Filter.prototype);
    DisplayBattlePictureFilter.prototype.constructor = DisplayBattlePictureFilter;

    /**
     * DisplayBattlePictureFilterを初期化する。
     */
    DisplayBattlePictureFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, null, this._fragmentSrc());
        this.uniforms.zeroX = commandHudPictureDisplayX;
        this.uniforms.dissolveWidth = commandHudPictureFadeWidth;
        this.uniforms.zeroY = Graphics.boxHeight - statusAreaHeight; // ステータスウィンドウの所にはかぶせない
        this.uniforms.dissolveHeight = commandHudPictureFadeHeight;
    };

    /**
     * 表示を行う水平方向位置を得る。
     * 
     * @param {number} x 画面上のX位置
     */
    DisplayBattlePictureFilter.prototype.setValidX = function(x) {
        this.uniforms.zeroX = Number(x) || 0;
    }

    /**
     * フラグメントシェーダーソースを得る。
     */
    DisplayBattlePictureFilter.prototype._fragmentSrc = function() {
        // GLSLよくわからん。
        // gl_FragCoordはピクセル毎に更新されるっぽい。
        const src =
            "varying vec2 vTextureCoord;" +
            "uniform sampler2D uSampler;" +
            "uniform float zeroX;" +
            "uniform float dissolveWidth;" +
            "uniform float zeroY;" +
            "uniform float dissolveHeight;" +
            "void main() {" +
            "  vec4 sample = texture2D(uSampler, vTextureCoord);" +
            "  float rateH = clamp((gl_FragCoord.x - zeroX) / dissolveWidth, 0.0, 1.0);" +
            "  float rateV = 1.0 - clamp((gl_FragCoord.y - zeroY) / dissolveHeight, 0.0, 1.0);" +
            "  float rate = min(rateH, rateV);" +
            "  vec3 rgb = sample.rgb * rate;" +
            "  float a = sample.a * rate;" +
            "  gl_FragColor = vec4(rgb, a);" +
            "}";
        return src;
    };

    //------------------------------------------------------------------------------
    // BattleHudActorFilter
    /**
     * BattleHudActorFilter
     * カラーフィルター。
     */
    function BattleHudActorFilter() {
        this.initialize(...arguments);
    }

    BattleHudActorFilter.prototype = Object.create(PIXI.Filter.prototype);
    BattleHudActorFilter.prototype.constructor = BattleHudActorFilter;

    /**
     * BattleHudActorFilterを初期化する。
     */
    BattleHudActorFilter.prototype.initialize = function() {
        PIXI.Filter.call(this, null, this._fragmentSrc());
        this.uniforms.saturation = 255;
        this.uniforms.brightness = 255;
    };

    /**
     * 色差を設定する。
     * 
     * @param {number} saturation 色差変更値
     */
    BattleHudActorFilter.prototype.setSaturation = function(saturation) {
        this.uniforms.saturation = saturation.clamp(0, +255.0);
    };

    /**
     * 色差を取得する。
     * 
     * @returns {number} 色差変更値
     */
    BattleHudActorFilter.prototype.saturation = function() {
        return this.uniforms.saturation;
    };

    /**
     * 輝度補正値を設定する。
     * 
     * @param {number} brightness 輝度
     */
    BattleHudActorFilter.prototype.setBrightness = function(brightness) {
        this.uniforms.brightness = brightness.clamp(0, 255.0);
    };

    /**
     * 輝度補正値を得る。
     * 
     * @returns {number} 輝度補正値
     */
    BattleHudActorFilter.prototype.brightness = function() {
        return this.uniforms.brightness;
    };

    /**
     * フラグメントシェーダーソースを得る。
     * 
     */
    BattleHudActorFilter.prototype._fragmentSrc = function() {
        // GLSLよくわからん。
        // gl_FragCoordはピクセル毎に更新されるっぽい。
        const src =
            "varying vec2 vTextureCoord;" +
            "uniform sampler2D uSampler;" +
            "uniform float saturation;" +
            "uniform float brightness;" +
            "vec3 rgbToHsl(vec3 rgb) {" +
            "  float r = rgb.r;" +
            "  float g = rgb.g;" +
            "  float b = rgb.b;" +
            "  float cmin = min(r, min(g, b));" +
            "  float cmax = max(r, max(g, b));" +
            "  float h = 0.0;" +
            "  float s = 0.0;" +
            "  float l = (cmin + cmax) / 2.0;" +
            "  float delta = cmax - cmin;" +
            "  if (delta > 0.0) {" +
            "    if (r == cmax) {" +
            "      h = mod((g - b) / delta + 6.0, 6.0) / 6.0;" +
            "    } else if (g == cmax) {" +
            "      h = ((b - r) / delta + 2.0) / 6.0;" +
            "    } else {" +
            "      h = ((r - g) / delta + 4.0) / 6.0;" +
            "    }" +
            "    if (l < 1.0) {" +
            "      s = delta / (1.0 - abs(2.0 * l - 1.0));" +
            "    }" +
            "  }" +
            "  return vec3(h, s, l);" +
            "}" +
            "vec3 hslToRgb(vec3 hsl) {" +
            "  float h = hsl.x;" +
            "  float s = hsl.y;" +
            "  float l = hsl.z;" +
            "  float c = (1.0 - abs(2.0 * l - 1.0)) * s;" +
            "  float x = c * (1.0 - abs((mod(h * 6.0, 2.0)) - 1.0));" +
            "  float m = l - c / 2.0;" +
            "  float cm = c + m;" +
            "  float xm = x + m;" +
            "  if (h < 1.0 / 6.0) {" +
            "    return vec3(cm, xm, m);" +
            "  } else if (h < 2.0 / 6.0) {" +
            "    return vec3(xm, cm, m);" +
            "  } else if (h < 3.0 / 6.0) {" +
            "    return vec3(m, cm, xm);" +
            "  } else if (h < 4.0 / 6.0) {" +
            "    return vec3(m, xm, cm);" +
            "  } else if (h < 5.0 / 6.0) {" +
            "    return vec3(xm, m, cm);" +
            "  } else {" +
            "    return vec3(cm, m, xm);" +
            "  }" +
            "}" +
            "void main() {" +
            "  vec4 sample = texture2D(uSampler, vTextureCoord);" +
            "  vec3 hsl = rgbToHsl(sample.rgb);" +
            "  hsl.y = clamp(hsl.y * saturation / 255.0, 0.0, 1.0);" +
            "  hsl.z = clamp(hsl.z * brightness / 255.0, 0.0, 1.0);" +
            "  vec3 rgb = hslToRgb(hsl);" +
            "  float r = rgb.r;" +
            "  float g = rgb.g;" +
            "  float b = rgb.b;" +
            "  float a = sample.a;" +
            "  gl_FragColor = vec4(r, g, b, a);" +
            "}";
        return src;
    };

    //------------------------------------------------------------------------------
    // Sprite_BattleHudPicture
    Sprite_BattleHudPicture.prototype = Object.create(Sprite.prototype);
    Sprite_BattleHudPicture.prototype.constructor = Sprite_BattleHudPicture;

    /**
     * Sprite_BattleHudPictureを初期化する。
     */
    Sprite_BattleHudPicture.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this, ...arguments);
        this.anchor.x = 0.5;
        this.anchor.y = 1.0; // 下基準
        this.x = Graphics.boxWidth; // 右端
        this.y = Graphics.boxHeight; // 下端を揃える。
        this._battler = null;
        this._pictureName = "";
        this._horizontalAlphaFilter = new DisplayBattlePictureFilter();
        this.filters = [];
        this.filters.push(this._horizontalAlphaFilter)
    };

    /**
     * このスプライトが表示するGame_Battlerを設定する。
     * 
     * @param {Game_Battler} battler Game_Battlerオブジェクト
     */
    Sprite_BattleHudPicture.prototype.setBattler = function(battler) {
        if (battler !== this._battler) {
            this._battler = battler;
        }
    };

    /**
     * Sprite_BattleHudPictureを更新する。
     */
    Sprite_BattleHudPicture.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updateVisibility();
        this.updateMovement();
    };

    /**
     * Bitmapを更新する。
     */
    Sprite_BattleHudPicture.prototype.updateBitmap = function() {
        if (this._battler) {
            const pictureName = (typeof this._battler[pictureMethod] === "function") 
                    ? this._battler[pictureMethod]() : this._battler[pictureMethod];
            if (this._pictureName !== pictureName) {
                this._pictureName = pictureName;
                this.bitmap = this.loadBattlePicture();
                // 画像が変更されたら透過状態にする。コマンド選択中に変更されてもふわっと出てくる（はず）
                this.opacity = 0;
            }
        } else {
            this.bitmap = null;
        }
    };

    /**
     * コマンド選択中に表示するがぞうをロードする。
     * 
     * @returns {Bitmap} Bitmapオブジェクト。表示する画像がない場合にはnull
     */
    Sprite_BattleHudPicture.prototype.loadBattlePicture = function() {
        if (this._pictureName) {
            try {
                return ImageManager.loadPicture(this._pictureName);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        } else {
            return null;
        }
    };

    /**
     * 表示状態を更新する。
     */
    Sprite_BattleHudPicture.prototype.updateVisibility = function() {
        if (this._battler) {
            if (this._battler.isInputting()) {
                // コマンド入力中は表示。
                this.visible = true;
            } else {
                // コマンド入力キャンセルor入力完了しても、
                // ふわっと消えるようにする。
                if ((this.opacity < 32) || (this.x >= Graphics.boxWidth)) {
                    this.visible = false;
                }
            }
        } else {
            this.visible = false;
        }
    };

    /**
     * 表示の移動を処理する。
     */
    Sprite_BattleHudPicture.prototype.updateMovement = function() {
        if (this._battler) {
            const distance = Graphics.boxWidth - commandHudPictureDisplayX;
            const movePos = commandHudPictureX;
            const addCount = Math.max(1, Math.floor(distance / 20));
            if (this._battler.isInputting()) {
                if (this.x > movePos) {
                    this.x -= addCount;
                }
                if (this.opacity < 255) {
                    this.opacity += 10;
                    if (this.opacity >= 255) {
                        this.opacity = 255;
                    }
                }
            } else {
                if (this.x < Graphics.boxWidth) {
                    this.x += addCount;
                }
                if (this.opacity > 0) {
                    this.opacity -= 25;
                    if (this.opacity < 0) {
                        this.opacity = 0;
                    }
                }
            }
            if (this.bitmap != null) {
                if (this.bitmap.height < (Graphics.boxHeight - 180)) {
                    this.y = 180 + this.bitmap.height + commandHudPictureOffsetY;
                } else {
                    this.y = Graphics.boxHeight + commandHudPictureOffsetY;
                }
            } else {
                this.y = Graphics.boxHeight + commandHudPictureOffsetY;
            }
        } else {
            this.x = Graphics.boxWidth;
            this.y = Graphics.boxHeight + commandHudPictureOffsetY;
            this.opacity = 0;
        }
    };



    //------------------------------------------------------------------------------
    // Spriteset_Battle

    const _Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors;

    /**
     * アクターのスプライトを作成する。
     */
    Spriteset_Battle.prototype.createActors = function() {
        _Spriteset_Battle_createActors.call(this, ...arguments);

        this._hudBaseSprite = new Sprite();
        this._battleField.addChild(this._hudBaseSprite);

        // battlePictureはHUDSpriteより後ろ、エネミーの前なので、
        // Sprite_BattleHudActorより先に追加する。
        // childAtでもいいけど、無駄に計算量増やす必要は無い。
        this._actorPictureSprites = [];
        for (let i = 0; i < maxBattleMembers; i++) {
            const sprite = new Sprite_BattleHudPicture();
            this._actorPictureSprites.push(sprite);
            this._hudBaseSprite.addChild(sprite);
        }
        this._actorHudSprites = [];
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            const sprite = new Sprite_BattleHudActor();
            this._actorHudSprites.push(sprite);
            this._hudBaseSprite.addChild(sprite);
        }
    };

    const _Spriteset_Battle_updateActors = Spriteset_Battle.prototype.updateActors;
    /**
     * アクターのスプライトを更新する。
     */
    Spriteset_Battle.prototype.updateActors = function() {
        _Spriteset_Battle_updateActors.call(this, ...arguments);

        const members = $gameParty.battleMembers();
        for (let i = 0; i < this._actorHudSprites.length; i++) {
            this._actorHudSprites[i].setBattler(members[i]);
        }
        for (let i = 0; i < this._actorPictureSprites.length; i++) {
            this._actorPictureSprites[i].setBattler(members[i]);
        }
    };

    const _Spriteset_Battle_findTargetSprite = Spriteset_Battle.prototype.findTargetSprite;
    /**
     * ターゲットに対応するSpriteを取得する。
     * 派生クラスにて実装する事。
     * 
     * @param {object} target ターゲット(Game_BattlerBaseオブジェクト)
     * @returns {Sprite} 対象のスプライト
     */
    Spriteset_Battle.prototype.findTargetSprite = function(target) {
        const targetSprite = _Spriteset_Battle_findTargetSprite.call(this, target);
        if (targetSprite) {
            return targetSprite;
        } else {
            const targetHud = this._actorHudSprites.find(sprite => sprite.checkBattler(target));
            if (targetHud) {
                return targetHud.mainSprite();
            } else {
                return undefined;
            }
        }
    };


    //------------------------------------------------------------------------------
    // Window_BattleLog
    /**
     * HPダメージを表示する。
     * 
     * @param {Game_Battler} target 表示対象
     * !!!overwrite!!! Window_BattleLog.displayHpDamage()
     *     メッセージウィンドウにダメージテキストを表示させないようにするため、オーバーライドする。
     */
    Window_BattleLog.prototype.displayHpDamage = function(target) {
        const result = target.result();
        if (result.hpAffected) {
            if (result.hpDamage > 0) {
                if (!result.drain) {
                    this.push("performDamage", target);
                }
                if (result.isGuard) {
                    this.push("performGuard", target);
                }
            }
            if (result.hpDamage < 0) {
                this.push("performRecovery", target);
            }
            //this.push("addText", this.makeHpDamageText(target));
        }
    };

    /**
     * MPダメージを表示する。
     * 
     * @param {Game_Battler} target 表示対象
     * !!!overwrite!!! Window_BattleLog.displayMpDamage()
     *     メッセージウィンドウにダメージテキストを表示させないようにするため、オーバーライドする。
     */
    Window_BattleLog.prototype.displayMpDamage = function(target) {
        if (target.isAlive() && target.result().mpDamage !== 0) {
            if (target.result().mpDamage < 0) {
                this.push("performRecovery", target);
            }
            //this.push("addText", this.makeMpDamageText(target));
        }
    };

    /**
     * TPダメージを表示する。
     * 
     * @param {Game_Battler} target 表示対象
     */
    Window_BattleLog.prototype.displayTpDamage = function(target) {
        if (target.isAlive() && target.result().tpDamage !== 0) {
            if (target.result().tpDamage < 0) {
                this.push("performRecovery", target);
            }
            //this.push("addText", this.makeTpDamageText(target));
        }
    };    
    /**
     * 対象にクリティカルを表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! Window_BattleLog.displayCritical(target)
     *     クリティカル発動テキストは表示しないため、オーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Window_BattleLog.prototype.displayCritical = function(target) {
        if (!textCritical) {
            if (target.result().critical) {
                if (target.isActor()) {
                    this.push("addText", TextManager.criticalToActor);
                } else {
                    this.push("addText", TextManager.criticalToEnemy);
                }
            }            
        }
    };

    /**
     * 変化したバフを表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!Window_BattleLog.displayChangedBuffs(target)
     *     バフ/デバフのテキストメッセージは表示しないため、オーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Window_BattleLog.prototype.displayChangedBuffs = function(target) {
        const result = target.result();
        if (!textAddedBuff) {
            this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
        }
        if (!textAddedDebuff) {
            this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
        }
        if (!textRemovedBuff) {
            this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
        }
    
    };
    /**
     * 対象のステートが変化されたのを表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!Window_BattleLog.displayChangedStates(target)
     *     ステート変更のメッセージは表示しないため、オーバーライドする。
     */
    // eslint-disable-next-line no-unused-vars
    Window_BattleLog.prototype.displayChangedStates = function(target) {
        if (textAddedState || textRemovedState) {
            const result = target.result();
            const states = result.addedStateObjects();
            if (states.some(state => state.id === target.deathStateId())) {
                this.push("performCollapse", target);
                this.push("waitForEffect");
            }
        } else {
            this.displayAddedStates(target);
            this.displayRemovedStates(target);
        }
    };

    /**
     * ミスした表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! Window_BattleLog.displayMiss(target)
     *     バトルログにミスした表示を出さないためオーバーライドする。
     */
    Window_BattleLog.prototype.displayMiss = function(target) {
        if (textMiss) {
            if (target.result().physical) {
                this.push("performMiss", target);
            }
        } else {
            let fmt;
            if (target.result().physical) {
                const isActor = target.isActor();
                fmt = isActor ? TextManager.actorNoHit : TextManager.enemyNoHit;
                this.push("performMiss", target);
            } else {
                fmt = TextManager.actionFailure;
            }
            this.push("addText", fmt.format(target.name()));
        }
    };

    /**
     * 回避された表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! Window_BattleLog.displayEvasion(target)
     *     メッセージログに回避したメッセージを表示させないため、オーバーライドする。
     */
    Window_BattleLog.prototype.displayEvasion = function(target) {
        if (textMiss) {
            if (target.result().physical) {
                this.push("performEvasion", target);
            } else {
                this.push("performMagicEvasion", target);
            }
        } else {
            let fmt;
            if (target.result().physical) {
                fmt = TextManager.evasion;
                this.push("performEvasion", target);
            } else {
                fmt = TextManager.magicEvasion;
                this.push("performMagicEvasion", target);
            }
            this.push("addText", fmt.format(target.name()));
        }
    };
    /**
     * カウンターを表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! Window_BattleLog.displaycounter()
     *     カウンター発生時にポップアップテキストでの表示を行うため、オーバーライドする。
     */
    Window_BattleLog.prototype.displayCounter = function(target) {
        this.push("performCounter", target);
        if (textCounter) {
            target.startCounterPopup();
        } else {
            this.push("addText", TextManager.counterAttack.format(target.name()));
        }
    };

    /**
     * 反射を表示する。
     * 
     * @param {Game_Battler} target 対象
     * !!!overwrite!!! Window_BattleLog.displayReflection()
     *     反射発生時、メッセージポップアップさせるため、オーバーライドする。
     */
    Window_BattleLog.prototype.displayReflection = function(target) {
        this.push("performReflection", target);
        if (textReflection) {
            target.startReflectionPopup();
        } else {
            this.push("addText", TextManager.magicReflection.format(target.name()));
        }
    };

    /**
     * ガードを表示する。
     * 
     * @param {Game_Battler} target 対象
     */
    Window_BattleLog.prototype.performGuard = function(target) {
        target.performGuard();
    };

    /**
     * アクションを開始する。
     * 
     * @param {Game_Battler} subject 使用者
     * @param {Game_Action} action アクション
     * @param {Array<Game_Battler>} targets 対象
     * !!!overwrite!!! Window_BattleLog.startAction()
     *   スキル使用時のアニメーションを表示するため、オーバーライドする。
     */
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        const item = action.item();
        this.push("performActionStart", subject, action); // アクション開始(所定の位置に移動など)
        this.push("waitForMovement"); // performActionStart完了待ち
        this.push("performAction", subject, action); // アクション開始
        this.push("showUseAnimation", subject, action)
        this.push("waitForAnimation");
        this.push("showAnimation", subject, targets.clone(), item.animationId); // アニメーション表示
        this.displayAction(subject, item);
    };    
    /**
     * エフェクトの表示が完了するのを待つ。
     */
    Window_BattleLog.prototype.waitForAnimation = function() {
        this.setWaitMode("animation");
    };

    /**
     * 待機モードを更新する。
     * 
     * @returns {boolean} 待機を継続する場合にはtrue, 終了する場合にはfalse.
     * !!!overwrite!!! Window_BattleLog.updateWaitMode()
     *   待機モードを追加するため、オーバーライドする。
     */
    Window_BattleLog.prototype.updateWaitMode = function() {
        let waiting = false;
        switch (this._waitMode) {
            case "effect":
                waiting = this._spriteset.isEffecting();
                break;
            case "movement":
                waiting = this._spriteset.isAnyoneMoving();
                break;
            case "animation":
                waiting = this._spriteset.isAnimationPlaying();
                break;
        }
        if (!waiting) {
            this._waitMode = "";
        }
        return waiting;
    };

    /**
     * 使用時アニメーションを表示する。
     * (表示要求を出す。)
     * 
     * @param {Game_Battler} subject 使用者
     * @param {Game_Action} action アクション
     */
    Window_BattleLog.prototype.showUseAnimation = function(subject, action) {
        const item = action.item();
        if (item) {
            const animationId = this.useAnimationId(item);
            if (animationId > 0) {
                $gameTemp.requestAnimation([subject], animationId, false);
            }
        }
    };

    /**
     * 使用時表示アニメーションIDを得る。
     * 
     * @param {object} item DataItem/DataSkill
     * @returns {number} アニメーションID(0はアニメーションなし)
     */
    Window_BattleLog.prototype.useAnimationId = function(item) {
        if (item.meta.useAnimationId !== undefined) {
            return Number(item.meta.useAnimationId) || 0;
        } else {
            if (DataManager.isSkill(item)) {
                return defaultUseSkillAnimationIds[item.stypeId] || 0;
            } else if (DataManager.isItem(item)) {
                return defaultUseItemAnimationId;
            }

            return 0;
        }
    };

    //------------------------------------------------------------------------------
    // Scene_Battle
    //     _statusWindow, _actorWindow は使用しない。

    const _Scene_Battle_create = Scene_Battle.prototype.create;

    /**
     * Scene_Battleを作成する。
     * 
     * 表示するオブジェクトの生成などを行う。
     */
    Scene_Battle.prototype.create = function() {
        _Scene_Battle_create.call(this);
        this.createHudItemNameWindow();
    };

    const _Scene_Battle_destroy = Scene_Battle.prototype.destroy;
    /**
     * シーンを破棄する。
     * 
     * Note: _statusWindowのインスタンスは Container.childrenから切り離しているため、
     *       個別に開放する。
     */
    Scene_Battle.prototype.destroy = function() {
        _Scene_Battle_destroy.call(this);
        if (this._statusWindow) {
            this._statusWindow.destroy();
        }
        if (this._actorWindow) {
            this._actorWindow.destroy();
        }
    };
    /**
     * スキル使用対象選択用のアクター選択ウィンドウを作成する。
     * 
     * !!!overwrite!!! Scene_Battle.createActorWindow()
     *     アイテム・スキル使用対象のアクターウィンドウを表示させないようにするため、オーバーライドする。
     */
    Scene_Battle.prototype.createActorWindow = function() {
        const rect = this.actorWindowRect();
        this._actorWindow = new Window_BattleActor(rect);
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        //this.addWindow(this._actorWindow);
    };
    /**
     * アイテム名表示ウィンドウを作成する。
     */
    Scene_Battle.prototype.createHudItemNameWindow = function() {
        const rect = this.itemNameWindowRect();
        this._itemNameWindow = new Window_HudItemName(rect);
        this._itemNameWindow.hide();
        this.addChild(this._itemNameWindow);
    };

    /**
     * ヘルプウィンドウの表示領域を取得する。
     * 
     * @returns {Rectangle} ヘルプウィンドウの表示領域を表すRectangle.
     * !!!overwrite!!! Game_Battle_helpWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.helpWindowRect = function() {
        const ww = Math.min(816, Graphics.boxWidth);
        const wh = this.helpAreaHeight();
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = this.helpAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * メッセージウィンドウの位置を取得する。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     */
    Scene_Message.prototype.messageWindowRect = function() {
        const ww = Math.min(816, Graphics.boxWidth);
        const wh = this.calcWindowHeight(4, false) + 8;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ステータスウィンドウ矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Game_Battle.statusWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.statusWindowRect = function() {
        const extra = 10;
        const ww = listWindowWidth;
        const wh = this.windowAreaHeight() + extra;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = Graphics.boxHeight - wh + extra - 4;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * パーティーコマンドの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.partyCommandWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.partyCommandWindowRect = function() {
        const itemNameRect = this.itemNameWindowRect();
        const ww = commandWindowWidth;
        const wh = this.windowAreaHeight();
        const wx = commandWindowX;
        const wy = itemNameRect.y + itemNameRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アクターコマンドの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.actorCommandWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.actorCommandWindowRect = function() {
        const itemWindowRect = this.itemNameWindowRect();
        const wx = commandWindowX;
        const wy = itemWindowRect.y + itemWindowRect.height;
        const ww = commandWindowWidth;
        const needsHeight = this.calcWindowHeight(commandWindowRowCount, true);
        const allowHeight = Graphics.boxHeight - wy;
        const wh = Math.min(needsHeight, allowHeight);
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Base_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    /**
     * アクターコマンドウィンドウ(_actorCommandWindow)を作成する。
     * 
     * Note: ベーシックシステムでは、ウィンドウ作成時にyが上書きされているため、
     *       レイアウトを変えるためにフックする。
     */
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Base_createActorCommandWindow.call(this);
        this._actorCommandWindow.y = this.actorCommandWindowRect().y;
    };

    /**
     * スキルウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.skillWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.skillWindowRect = function() {
        const itemNameRect = this.itemNameWindowRect();
        const ww = Math.min(Graphics.boxWidth, 816);
        const wh = this.windowAreaHeight();
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = itemNameRect.y + itemNameRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * ログウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.logWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.logWindowRect = function() {
        const ww = Math.min(816, Graphics.boxWidth);
        const wh = this.calcWindowHeight(10, false);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * アイテム名表示の矩形領域を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.itemNameWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.itemNameWindowRect = function() {
        const width = 240;
        const height = 64;
        const x = Graphics.boxWidth - width;
        const y = 180;
        return new Rectangle(x, y, width, height);
    };

    /**
     * ステータスウィンドウを作成する。
     * 
     * Note: _statusWindowにアクセスしないようにするためにオーバーライドする。
     * !!!overwrite!!! Scene_Battle.createStatusWindow
     *     ステータスウィンドウを表示しないようにするため、オーバーライドする。
     *     _statusWindowエントリを無くすとオーバーライドする箇所が増えるので
     *     作成だけして更新しないようにした。
     */
    Scene_Battle.prototype.createStatusWindow = function() {
        const rect = this.statusWindowRect();
        const statusWindow = new Window_BattleStatus(rect);
        //this.addWindow(statusWindow);
        this._statusWindow = statusWindow;
    };

    /**
     * アクター選択ウィンドウのウィンドウ位置を得る。
     * 
     * @returns {Rectangle} ウィンドウ矩形領域。
     * !!!overwrite!!! Scene_Battle.actorWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.actorWindowRect = function() {
        const itemNameWindowRect = this.itemNameWindowRect();
        const ww = commandWindowWidth;
        const wh = this.windowAreaHeight();
        const wx = commandWindowX;
        const wy = itemNameWindowRect.y + itemNameWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    /**
     * エネミーウィンドウの矩形領域を得る。
     * 
     * @returns {Rectangle} エネミーウィンドウの矩形領域。
     * !!!overwrite!!! Scene_Battle.enemyWindowRect
     *     レイアウト変更のため、オーバーライドする。
     */
    Scene_Battle.prototype.enemyWindowRect = function() {
        const itemNameWindowRect = this.itemNameWindowRect();
        const ww = commandWindowWidth;
        const wh = this.windowAreaHeight();
        const wx = commandWindowX;
        const wy = itemNameWindowRect.y + itemNameWindowRect.height;
        return new Rectangle(wx, wy, ww, wh);
    };


    const _Scene_Battle_update = Scene_Battle.prototype.update;
    /**
     * Scene_Battle の更新処理を行う。
     */
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        // Note: 何かしら更新処理が必要であればここでやる。
    };

    /**
     * ステータスウィンドウの表示状態を更新する。
     * 
     * !!!overwrite!!! Scene_Battle.updateStatusWindowVisibility
     *     _statusWindowは使用しないため、負荷低減のためオーバーライドする。
     */
    Scene_Battle.prototype.updateStatusWindowVisibility = function() {
    };



    const _Scene_Battle_hideSubInputWindows = Scene_Battle.prototype.hideSubInputWindows;
    /**
     * サブ入力ウィンドウを非表示にする。
     */
    Scene_Battle.prototype.hideSubInputWindows = function() {
        _Scene_Battle_hideSubInputWindows.call(this);
        // アイテム名ウィンドウを隠す
        this._itemNameWindow.hide();
    };

    const _Scene_Battle_startEnemySelection = Scene_Battle.prototype.startEnemySelection;
    /**
     * エネミー選択を開始する。
     */
    Scene_Battle.prototype.startEnemySelection = function() {
        _Scene_Battle_startEnemySelection.call(this);
        const action = BattleManager.inputtingAction();
        const item = action.item();
        if (item !== null) {
            this._itemNameWindow.setItem(item);
            this._itemNameWindow.show();
        }
    };

    const _Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
    /**
     * エネミー選択でOKされたときの処理を行う。
     */
    Scene_Battle.prototype.onEnemyOk = function() {
        _Scene_Battle_onEnemyOk.call(this);
        this._itemNameWindow.hide();
    };

    const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    /**
     * エネミー選択でキャンセル操作されたときの処理を行う。
     */
    Scene_Battle.prototype.onEnemyCancel = function() {
        _Scene_Battle_onEnemyCancel.call(this);
        this._itemNameWindow.hide();
    };

    const _Scene_Battle_startActorSelection = Scene_Battle.prototype.startActorSelection;

    /**
     * アクター選択を開始する。
     */
    Scene_Battle.prototype.startActorSelection = function() {
        _Scene_Battle_startActorSelection.call(this);
        this._skillWindow.hide();
        this._itemWindow.hide();
        const action = BattleManager.inputtingAction();
        const item = action.item();
        if (item !== null) {
            this._itemNameWindow.setItem(item);
            this._itemNameWindow.show();
        }
    };

    const _Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk;
    /**
     * アクター選択でOKが選択されたときの処理を行う。
     */
    Scene_Battle.prototype.onActorOk = function() {
        _Scene_Battle_onActorOk.call(this);
        $gameParty.select(null);
        this._actorSelecting = false;
        this._itemNameWindow.hide();
    };

    const _Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
    /**
     * アクター選択でキャンセルされたときの処理を行う。
     */
    Scene_Battle.prototype.onActorCancel = function() {
        this._itemNameWindow.hide();
        _Scene_Battle_onActorCancel.call(this);
    };

    const _Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;

    /**
     * いずれかの入力ウィンドウがアクティブ（選択中）かどうかを判定する。
     * 
     * @returns {boolean} いずれかの入力ウィンドウがアクティブな場合にはtrue, それ以外はfalse
     */
    Scene_Battle.prototype.isAnyInputWindowActive = function() {
        return _Scene_Battle_isAnyInputWindowActive.call(this);
    };
})();
