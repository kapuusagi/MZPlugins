■ モジュール一覧
  多分MVのやつと大きく変わることはないはずとか思ってたら、
  大分変わってた。うへぇ。

  libs以下のpixi.jsについては
    https://pixijs.download/dev/docs/index.html を参照。


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

■ デーベース内モジュール
  (名前は未定義である。)

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

