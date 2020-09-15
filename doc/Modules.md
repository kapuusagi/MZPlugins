# ■ モジュール一覧

多分MVのやつと大きく変わることはないはずとか思ってたら、
大分変わってた。うへぇ。

  libs以下のpixi.jsについては
    https://pixijs.download/dev/docs/index.html を参照。

~~~
    ** MZ/src/main.js ***
    *** MZ/src/plugins.js ***
    *** MZ/src/rmmz_core.js ***
        PIXI
        +- Point
        +- Rectangle
        +- Sprite
        +- Tilemap
        +- Tilemap
        +- Tilemap
        +- TilingSprite
        +- ScreenSprite
        +- Window
        +- WindowLayer
        +- Weather
        +- ColorFilter
        +- Stage
    *** MZ/src/rmmz_managers.js ***
    *** MZ/src/rmmz_objects.js ***
        Game_BattlerBase
        +- Game_Battler
        |   +- Game_Actor
        |   +- Game_Enemy
        Game_Unit
        +- Game_Party
        +- Game_Troop
        Game_CharacterBase
        +- Game_Character
            +- Game_Player
            +- Game_Follower
            +- Game_Vehicle
            +- Game_Event
    *** MZ/src/rmmz_scenes.js ***
        Stage
        +- Scene_Base
            +- Scene_Boot
            +- Scene_Title
            +- Scene_Message
            |   +- Scene_Map
            |   +- Scene_Battle
            +- Scene_MenuBase
            |   +- Scene_Menu
            |   +- Scene_ItemBase
            |   |   +- Scene_Item
            |   |   +- Scene_Skill
            |   +- Scene_Equip
            |   +- Scene_Status
            |   +- Scene_Options
            |   +- Scene_File
            |   |   +- Scene_Save
            |   |   +- Scene_Load
            |   +- Scene_GameEnd
            |   +- Scene_Shop
            |   +- Scene_Name
            |   +- Scene_Debug
            +- Scene_Gameover
    *** MZ/src/rmmz_sprites.js ***
        Sprite
        +- Sprite_Clickable
        |   +- Sprite_Button
        |   +- Sprite_Battler
        |   |   +- Sprite_Actor
        |   |   +- Sprite_Enemy
        |   +- Sprite_Picture
        +- Sprite_Character
        +- Sprite_Animation
        +- Sprite_AnimationMV
        +- Sprite_Damage
        +- Sprite_Gauge
        +- Sprite_Name
        +- Sprite_StateIcon
        +- Sprite_StateOverlay
        +- Sprite_Weapon
        +- Sprite_Balloon
        +- Sprite_Timer
        +- Sprite_Destination
        +- Spriteset_Base
            +- Spriteset_Map
            +- Spriteset_Battle
        TilingSprite
        +- Sprite_Battleback
    *** MZ/src/rmmz_windows.js ***
        Window
        +- Window_Base - 各ウィンドウの親クラス。
            +- Window_Scrollable - ウィンドウにスクロール機能を追加したもの。
            |   |                  マウスホイールやタッチによるスクロールをサポートしている。
            |   +- Window_Selectable - ウィンドウにカーソルや選択状態を追加したもの。
            |       +- Window_Command - コマンド選択の親クラス。垂直方向にコマンドを並べる。
            |       |   |               派生クラスではmakeCommandList()をインプリメントする。
            |       |   +- Window_HorzCommand - 水平方向に最大4つのコマンドを並べるウィンドウ。
            |       |   |   +- Window_ItemCategory - アイテムカテゴリウィンドウ。
            |       |   |   +- Window_EquipCommand - 装備選択ウィンドウ（個別装備変更だとか、全て外すだとか)。
            |       |   |   +- Window_ShopCommand - お店のコマンドウィンドウ。
            |       |   +- Window_MenuCommand - メニューでのコマンド選択ウィンドウ。
            |       |   |                       各プラグインにて、addOriginalCommandsを
            |       |   |                       フックして使用することを想定している。
            |       |   +- Window_SkillType - スキルタイプ選択ウィンドウ。（魔法だとか特技だとかのカテゴリ）
            |       |   +- Window_Options - オプション選択ウィンドウ
            |       |   +- Window_ChoiceList - 選択肢を表示するウィンドウ。
            |       |   +- Window_PartyCommand - 戦闘中、パーティーコマンドを表示するウィンドウ。
            |       |   |                        つまり、「戦う」だとか「逃げる」だとかね。
            |       |   +- Window_ActorCommand - 戦闘中、アクターのコマンドを表示するウィンドウ。
            |       |   +- Window_TitleCommand - タイトル画面のコマンドウィンドウ
            |       |   +- Window_GameEnd - タイトルに戻る操作時の確認ウィンドウ。
            |       +- Window_Gold - 所持金を表示するウィンドウ。
            |       |                refresh()呼び出し毎に更新される。
            |       +- Window_StatusBase - アクターのステータスを表示するウィンドウのベースクラス。
            |       |   +- Window_MenuStatus - メニュー画面のアクター一覧表示のウィンドウ。
            |       |   |   |                  隊列変更のためのUIも提供する。
            |       |   |   +- Window_MenuActor - スキル表示でのアクター選択を表示するウィンドウ
            |       |   +- Window_SkillStatus - スキル表示でのアクターステータスを表示するウィンドウ
            |       |   +- Window_EquipStatus - 装備画面でのアクターのステータス上昇を表示するウィンドウ
            |       |   +- Window_EquipSlot - 装備画面での装備スロットを表示するウィンドウ
            |       |   +- Window_Status - ステータス画面でのアクターステータスを表示するウィンドウ
            |       |   |                  名前だとか、LevelだとかEXPだとか、その辺を表示する。
            |       |   +- Window_StatusParams - ステータス画面でのアクターのパラメータを表示するウィンドウ。
            |       |   +- Window_StatusEquip - ステータス画面でのアクターの装備を表示するウィンドウ。
            |       |   +- Window_ShopStatus - ショップ画面でのステータスを表示するウィンドウ。
            |       |   +- Window_NameEdit - アクターの名前入力画面で、現在の編集値を表示するウィンドウ。
            |       |   +- Window_BattleStatus - 戦闘画面でのアクターステータスを表示するウィンドウ。
            |       |       +- Window_BattleActor - 戦闘画面でのアクター選択ウィンドウ。
            |       |                               スキルやアイテムの使用対象を選択する時に使う。
            |       +- Window_ItemList - アイテムを選択するウィンドウ。
            |       |   +- Window_EquipItem - 装備品選択ウィンドウ
            |       |   +- Window_ShopSell - ショップへの売却品選択ウィンドウ
            |       |   +- Window_EventItem - イベントコマンドでのアイテム選択ウィンドウ？
            |       |   +- Window_BattleItem
            |       +- Window_SkillList - スキル選択ウィンドウ（マップ）
            |       |   +- Window_BattleSkill - スキル選択ウィンドウ（戦闘中）
            |       +- Window_SavefileList - セーブ画面での選択ウィンドウ
            |       +- Window_ShopBuy - ショップ購入品選択ウィンドウ
            |       +- Window_ShopNumber - ショップでの数量入力ウィンドウ
            |       +- Window_NameInput - 名前入力の文字選択ウィンドウ
            |       +- Window_NumberInput - 数値入力ウィンドウ
            |       +- Window_BattleEnemy - 戦闘画面のエネミー選択ウィンドウ
            |       +- Window_DebugRange - デバッグ画面での変数/スイッチ選択ウィンドウ
            |       +- Window_DebugEdit - デバッグ画面での変数/スイッチ編集ウィンドウ
            +- Window_Help - ヘルプメッセージ表示ウィンドウ
            +- Window_NameBox - メッセージのところに表示する名前ウィンドウ。
            +- Window_Message - メッセージウィンドウ
            +- Window_ScrollText - スクロールテキストウィンドウ。
            +- Window_MapName - マップ名表示ウィンドウ
            +- Window_BattleLog - 戦闘画面でのメッセージ表示ウィンドウ。

~~~

# ■ デーベース内モジュール

オブジェクト名は未定義のため、ドキュメント内で識別するために勝手に命名した。

* SoundEffect サウンドエフェクト

$dataSystem.soundsにて定義。
音(SE)を鳴らす際に渡すデータ構造。
~~~javascript
se = {
    name: "",    // {String} SEファイル名
    pan:0,       // {Number} パン
    pitch:100,   // {Number}  ピッチ,
    volume:100,  // {Number} ボリューム,
};
~~~

* DataEffect

データベースおよびスクリプトで、スキル効果及びアイテム使用効果を表すデータとして使われる。

~~~javascript
effect = {
    code: 0,     // {Number} エフェクトコード。Game_Action.EFFECT_～）
    dataId:0,    // {Number} データID。code毎に意味は異なる。
    value1:0,    // {Number} 値1。dataId, code毎に意味は異なる。
    value2:0,    // {Number} 値2。dataId, code毎に意味は異なる。
};
~~~

* Trait

データベース及びスクリプトで、クラスや状態が持つ特性として扱われる。スクリプトの肝となるオブジェクト。
詳細は HowToCustomize.md に書いておいた。

~~~javascript
trait = {
    code : 0, // 特性コード。GameBattlerBase.TRAIT_xxx で定義されている。
    dataId : 0, // データID。TRAITによって持つ意味が異なる。
    value : 0 // 特性の値。TRAITによって持つ意味が異なる。
};
~~~

### ■ Window_Base 

ウィンドウのベースクラス。スクロールとか選択とか入力検出がない、シンプルなウィンドウ。
情報を表示するだけのウィンドウならば、このクラスを派生させれば良い。
MVではインスタンス作成時に x, y, width, height を渡していたが、Rectangleを渡すように変更された。
エレガントになってるけどオブジェクト生成がめんどい。
ウィンドウ構築時はUIのサイズに関係するメソッドを使ってウィンドウを構築しておくと、
統一感のあるウィンドウになるっぽい。

__提供する機能__
* オープン時のウィンドウフェードイン処理。(既定では8フレームのアニメーションになっている)
処理は透過度を使用して実装されている。
* クローズ時のフェードアウト処理。(既定では8フレームのアニメーションになっている)
処理は透過度を使用して実装されている。
* 表示するかどうか(show/hide)
* アクティブ状態/ノンアクティブ状態。アクティブ状態の時のみ入力検出処理を行う、などに使われる。
* 各種描画用インタフェース。

|メソッド|説明|
|---|---|
|lineHeight() : number|1行あたりの高さを得る。|
|itemWidth() : number|項目の幅を得る。|
|itemHeight() : number|項目の高さを得る。|
|itemPadding() : number|項目間のスペースを得る。|
|baseTextRect() : Rectangle|テキストを描画する矩形領域を得る。|
|fittingHeight(numLines : number) : number|numLinesだけ表示するのに必要な高さを得る。|
|contentsWidth() : number|描画領域の幅を得る。|
|contentsHeight() : number|描画領域の高さを得る。|
|resetFontSettings() : void|描画する文字のフォント設定をリセットする。|
|resetTextColor() : void|描画する文字の色をリセットする。|
|update() : void|ウィンドウの更新処理を行う。update～()メソッドを呼び出して、様々な更新を行う。|
|open() : void|ウィンドウの表示処理を開始する。|
|close() : void|ウィンドウの非表示処理を開始する。|
|show() : void|ウィンドウを表示する。|
|hide() : void|ウィンドウを非表示にする。|
|activate() : void|ウィンドウをアクティブ状態にする。|
|deactivate() : void|ウィンドウをノンアクティブ状態にする。|
|systemColor() : string|システムカラー。CSSスタイル色表現。|
|translucentOpacity() : number|半透明を表すα値。|
|changeTextColor(color : string) : void|文字描画色を変更する。|
|changeOutlineColor(color : string) : void|文字描画時のアウトライン色を変更する。|
|changePaintOpacity(enabled : boolean) : void|描画時の透過度を設定する。設定される値はtranslucentOpacity()値。選択可能な項目を描画する際にtrueにし、選択不可な項目を描画する場合にfalseで描画する、といった使われ方をする。|
|drawRect(x:number, y:number, width:number, height:number) : void|矩形領域を描画する。中身は塗りつぶし。線の色はoutlineColorになる。|
|drawText(text:string, x:number, y:number, maxWidth:number, aligin:string) : void|文字を描画する。maxWidthを超えないように圧縮される。|
|textWidth(text:string) : number|文字を描画するのに必要な幅を得る。|
|drawTextEx(text:string, x:number, y:number, width:number) : void|テキストを描画する。改行コードやエスケープシーケンス文字も解釈して処理される|
|textSizeEx(text:string) : object|drawTextに必要な描画サイズを得る。返値はwidth, heightをメンバに持つオブジェクト|
|drawIcon(iconIndex:number, x:number, y:number):void|アイコンを描画する。|
|drawFace(faceName:string, faceIndex:number, x:number, y:number, width:number, height:number):void|顔を描画する。|
|drawCharacter(characterName:string, characterIndex:number, x:number, y:number) : void|キャラクターを描画する。|
|drawItemName(item:object, x:number, y:number, width:number) :void|アイテム名を描画する。nameフィールドを持つオブジェクトであれば全て描画できる。|
|drawCurrencyValue(value:number, unit:string, x:number, y:number, width:number) : void|所持金を描画する。|
|setBackgroundType(type:number):void|ウィンドウ背景タイプを設定する。|

### ■ Window_Scrollable

ウィンドウのコンテンツエリアより大きなコンテンツを表示するための、スクロール機能を実装したウィンドウ。
スクロール可能な幅は overallWidth() - innterWidth()、つまり、全体のサイズからウィンドウコンテンツエリアの幅を引いた値になる。コードを見る限り、非アクティブウィンドウでもスクロールできるっぽい。

__提供する機能__
* ウィンドウ表示エリアより広大なコンテンツを表示するためのスクロール機能。
操作入力を含む。

|メソッド|説明|
|---|---|
|clearScrollStatus():void|スクロール状態をクリアする。|
|scrollX():number|スクロール水平位置を得る。|
|scrollY():number|スクロール垂直位置を得る。|
|scrollTo(x:number, y:number):void|指定した位置にスクロールする。|
|scroolBy(x:number, y:number):void|現在位置から、x,y移動した位置にスクロールする。|
|smoothScrollTo(x:number, y:number):void|指定した位置にスクロールする。(アニメーション)|
|smoothScrollBy(x:number, y:number):void|現在位置から、x,y移動した位置にスクロールする。(アニメーション)|
|setScrollAccel(x:number, y:number):void|スクロールの速度を設定する。タッチ操作によるスクロール処理に相当。|
|overallWidth():void|コンテンツ全体の幅を得る。水平スクロール可能なウィンドウは、このメソッドをオーバーライトする必要がある。|
|overallHeight():void|コンテンツ全体の高さを得る。垂直スクロール可能なウィンドウは、このメソッドをオーバーライトする必要がある。|

### ■ Window_Selectable

カーソルと選択状態を持つウィンドウ。
尚、派生クラスで_indexを直接操作してはいけない。index()とselect()を使おう。

__提供する機能__
* カーソル機能。項目選択機能。
* 基本的なハンドラのインタフェース。Window_Selectableでは'ok'と'cancel', 'pageup', 'pagedown' がサポートされる。

|メソッド|説明|
|---|---|
|index():number|現在選択中のインデックス番号|
|cursorFixed():boolean|カーソルが移動可能かどうか|
|setCursorFixed(cursorFixed:boolean) : void|カーソルを移動可能かどうかを設定する。|
|cursorAll():boolean|カーソルが全部かどうかを取得する。|
|setCursorAll(cursorAll:boolean) : void|カーソルが全部かどうかを設定する。|
|maxCols():number|最大カラム(列)数を得る。|
|maxItems():number|項目数を得る。|
|colSpacing():number|カラム間のスペースを得る。|
|rowSpacing():number|行間のスペースを得る。|
|maxRows():number|最大行数を得る。|
|select(index:number):void|指定したインデックスを選択する。|
|deslect():void|未選択状態にする。|
|reselect():void|現在選択中の項目を再選択し、表示更新を行う。|
|row():number|選択されている行を得る。|
|maxPageRows():number|1ページに表示可能な最大行数を得る。|
|maxPageItems():number|1ページに表示可能な最大項目数を得る。|
|itemRect(index:number):Rectangle|指定項目の描画領域を得る。|
|itemLineRect(index:number):Rectangle|項目の1行を描画する場合の矩形領域を得る。|
|itemRectWithPadding(index:number):Rectangle|パディングを考慮した、指定項目の描画領域を得る。|
|setHelpWindow(helpWindow:Window_Help):void|ヘルプウィンドウを設定する。|
|setHandler(symbol:string, method:function):void|シンボルに対応するハンドラを登録する。|
|drawitem(index:number):void|項目を描画する。|



