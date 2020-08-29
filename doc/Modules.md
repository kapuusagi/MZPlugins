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
        +- Window_Base
            +- Window_Scrollable
            |   +- Window_Selectable
            |       +- Window_Command
            |       |   +- Window_HorzCommand
            |       |   |   +- Window_ItemCategory
            |       |   |   +- Window_EquipCommand
            |       |   |   +- Window_ShopCommand
            |       |   +- Window_MenuCommand
            |       |   +- Window_SkillType
            |       |   +- Window_Options
            |       |   +- Window_ChoiceList
            |       |   +- Window_PartyCommand
            |       |   +- Window_ActorCommand
            |       |   +- Window_TitleCommand
            |       |   +- Window_GameEnd
            |       +- Window_Gold
            |       +- Window_StatusBase
            |       |   +- Window_MenuStatus
            |       |   |   +- Window_MenuActor
            |       |   +- Window_SkillStatus
            |       |   +- Window_EquipStatus
            |       |   +- Window_EquipSlot
            |       |   +- Window_Status
            |       |   +- Window_StatusParams
            |       |   +- Window_StatusEquip
            |       |   +- Window_ShopStatus
            |       |   +- Window_NameEdit
            |       |   +- Window_BattleStatus
            |       |       +- Window_BattleActor
            |       +- Window_ItemList
            |       |   +- Window_EquipItem
            |       |   +- Window_ShopSell
            |       |   +- Window_EventItem
            |       |   +- Window_BattleItem
            |       +- Window_SkillList
            |       |   +- Window_BattleSkill
            |       +- Window_SavefileList
            |       +- Window_ShopBuy
            |       +- Window_ShopNumber
            |       +- Window_NameInput
            |       +- Window_NumberInput
            |       +- Window_BattleEnemy
            |       +- Window_DebugRange
            |       +- Window_DebugEdit
            +- Window_Help
            +- Window_NameBox
            +- Window_Message
            +- Window_ScrollText
            +- Window_MapName
            +- Window_BattleLog

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

