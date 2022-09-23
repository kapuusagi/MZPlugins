調べたことを記載する。



## MZに同梱されてるプラグイン一覧


これらの素敵なプラグインはリファレンスになる。

|ファイル|概要|
|---|---|
|AddAutoToActorCommand.js|戦闘のアクターコマンドの先頭か後尾に「オート」を追加します|
|AdjustPictureGraphical.js|ピクチャのグラフィカルな位置調整プラグイン。|
|AltMenuScreen.js|メニュー画面のレイアウトを変更します。|
|AltMenuScreen2MZ.js|レイアウトの異なるメニュー画面|
|AltSaveScreen.js|セーブ／ロード画面のレイアウトを変更します。|
|AnimationMv.js|MVアニメーションプラグイン|
|BattleVoiceMZ.js|play voice SE at battle when actor does spcified action|
|BattleVoiceMZ.js|アクターの戦闘時の行動にボイスSEを設定します。|
|ButtonPicture.js|ピクチャをクリック可能にします。|
|ChangeEquipOnBattleMZ.js|戦闘コマンドに装備変更を追加|
|ChangeSelectItemWindowMZ.js|『アイテム選択の処理』のウィンドウ設定を変更します|
|CommonEventStepRegion.js|タイルを踏んだ時、リージョンIDに応じてコモンイベントを起動|
|CommonMoveRouteMZ.js|複数イベントの移動ルートをひとつのコモンイベントで制御可能|
|DevToolsManage.js|開発支援プラグイン|
|EventEffects.js|[Ver 1.1.2]イベントやプレイヤーに様々な効果をセットします|
|EventMovableLimitation.js|イベント移動範囲制限プラグイン|
|EventReSpawn.js|イベント動的生成プラグイン|
|Foreground.js|マップに合わせてスクロールする近景の設定(Ver1.1)|
|HPConsumeSkill.js|HP消費技|
|ItemCombineScene.js|メニューから呼び出し可能なアイテム合成シーンの作成|
|ItemNameMsg.js|メッセージウィンドウで \ITEM[] をアイテム名に置き換えます。|
|Levelupstate.js|レベルアップ時にステートを付与|
|MenuSubMembersMZ.js|メニュー画面と隊列の最後尾に同行者を表示します|
|MessageWindowPopup.js|フキダシウィンドウプラグイン|
|Minimum_encount.js|ランダムエンカウントの最低歩数の初期値を設定します。|
|NoGameover.js|戦闘で全滅してもゲームオーバーにならない。|
|NoGameover2.js|全滅してもゲームオーバーにならない。|
|Nostepacting.js|サイドビュー戦闘で行動時に一歩前に出ないようにする。|
|NumbState.js|一定確率で行動できないステート(Ver1.2)|
|OverpassTileEventAttach.js|立体交差プラグインのイベントアタッチメント|
|OverpassTileVehicleAttach.js|立体交差プラグインの乗り物考慮アタッチメント|
|PictureAnimation.js|ピクチャのアニメーションプラグイン|
|PlayMsgWndCharSeMZ.js|メッセージウィンドウで文字ごとにSEを演奏します。|
|PluginBaseFunction.js|プラグイン共通関数|
|ScreenZoom.js|プレイヤーや特定のイベントを中心に、画面をズームアップします。|
|SetFieldSkillIdMZ.js|戦闘スキルやアイテムをフィールドで使った時の効果を変更します。|
|ShakeOnDamage.js|ダメージ時の振動プラグイン|
|ShakingChange.js|画面シェイクを縦揺れに変更するよ|
|SimpleMsgSideViewMZ.js|サイドビューバトルでスキル/アイテムの名前のみ表示します。|
|SimplePassiveSkillMZ.js|能力値や特徴が付けられるパッシブスキルを作成します|
|SmartAutoBattle.js|戦闘時アクターの自動戦闘をカスタム/改善|
|SmoothTouchMove.js|タッチ移動で、プレイヤーの下のイベントを通過可能にします。|
|StartTPBactorcommand.js|タイムプログレス戦闘でアクターコマンドから開始します。|
|StateAutoBattle.js|パーティコマンドに1ターン自動戦闘を追加|
|SubMembersAttendBattle.js|同行者(NPC)を戦闘に参加させ、自動戦闘を行わせます|
|SVActorPositionMZ.js|サイドビュー戦闘においてアクター達の画面表示位置を設定します。|
|TemplateEvent.js|テンプレートイベントプラグイン|
|TextPicture.js|テキストをピクチャとして表示します。|
|TinyGetInfoWndMZ.js|アイテムの入手/消失を1行ウィンドウで表示します|
|TouchMoveForSymbolEncount.js|タッチ移動時イベントシンボルを避けないようにします。|
|wasdKeyMZ.js|wasd移動に対応させます。|
|WeatherOnBattle.js|戦闘中も天候アニメを表示します|
|Yami_8DirEx.js|8方向移動(タッチパネル対応版)

## GLSL Editor

エディタはColorFilterを独自実装して動作確認したい場合に必須。
直接記述すると、どこがおかしいのかわかりにくいのだ。

https://github.com/patriciogonzalezvivo/glslEditor

がよさげ？cloneしてindex.htmlを開けば色々できそうな予感。
詳細は見て無いけど、rmmz_coreのColorFilterはフラグメントシェーダーを実装している。

ソースを読むときによく分からなかったら、

https://gist.github.com/gyohk/abf13dbcb5be750b3b021752b280ccd3

とか見ると、意味が分かるかもしれない。xyとか意味分からんよ！

ヒントを書いておく。

* gl_FragColor

    出力する（表示する）ピクセルの画素。

* gl_FragCoord

    出力するピクセルの座標が格納されている。こっちは普通に0,1,2,...とふえていくっぽい。

* 変数宣言の修飾子


    |修飾子|説明|例|
    |---|---|---|
    |なし/デフォルト|ローカル|float a;|
    |const|コンパイル時の定数|const float redScale   = 0.298912;|
    |attribute|どこでセットされる？ 頂点ごとに異なる情報を参照するために使用する。|attribute vec2 aTextureCoord;|
    |varying|バーテックスシェーダーで値を格納し、フラグメントシェーダーに渡すパラメータ。バーテックスシェーダーで書き込まれた同名の変数を参照するために使用する。|varying vec2 vTextureCoord;|
    |uniform|アプリケーションとシェーダー間で連関するパラメータ。||


* varying vec2 vTextureCoord

    Textureの座標が0.0～1.0で格納される。左上が0っぽいけど、座標系によるのかな？

* uniform sampler2D uSampler

    テクスチャ？ texture2D(uSampler, vTextureCoord); とすると、テクスチャの座標に対応するピクセルが得られる。



## フィルタでapply()を複数繰り返したときどうなるの？

基本的には最後に apply() したピクセルデータが描画される。
ピクセルデータのアルファ値(a)が1.0未満の場合、直前のapply()の結果とマージされる（っぽい）
MapFilter_Darknessを実現する際は、
    最初にバックグラウンドフィルタを適用
    その後光源毎にフィルタを適用
で実現している。
gl_FragColor に色を設定しない場合、下の画像の色が出力される。
これを使ってフェードができるよ、やったね。


## ブラウザ版セーブデータの場所

    イメージリソースを変更して起動に失敗するようになったとき用

    http://ktnhmv.jugem.jp/?eid=42

    Chrome（Windows10）
    (ユーザフォルダ)¥AppData¥Local¥Google¥Chrome¥User Data¥Default¥Local Storage

## コアスクリプト 1.3.2 <-> 1.5.0差分による影響を調べる

main.js
    Closeの処理の呼び出し方が変更になっている。
rmmz_core.js
    measureTextWidthが正数でなく実数を返すようになった。
    BitmapのstartLoadの処理が変更された。
    タイル幅が変数として格納された。
rmmz_manager.js
    BattleManager.endTurnがBattleManager.endTurnとBattleManager.updateTurnEndに分かれたなど、BattleManager周りが変更されている。（要注意）
rmmz_objects.js
    Game_PartyにhiddenBattleMembersとallBattleMembers関数が追加された。（かぶらないか要注意）
    Game_Partyに逃走したかどうかの判定が追加。
    Game_Mapにタイルサイズを取得するインタフェースが追加。
    Game_Mapで茂みの深さをマップデータから取得して設定するように変更。
    Game_Interpreterにskipが追加。
rmmz_scenes.js
    マップデータの読み出しは、必要時ではなく、常に行うように修正された
    Scene_Itemでアイテムウィンドウ作成時にcreateContentsがコールされるように変更された。
rmmz_sprites.js
    Sprite_Enemyで_battlerNameデフォルト値を""でなくnullがセットされるようになった。
    Spriteにviewportというのが追加になっている。
rmmz_windows.js
    ロジックの変更はなし。


    