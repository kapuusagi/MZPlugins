# 本書について
基本システムについて調べたことを記載する。

## ■ ファイル一覧
    .
    │  main.js
    │  plugins.js
    │  rmmz_core.js
    │  rmmz_managers.js
    │  rmmz_objects.js
    │  rmmz_scenes.js
    │  rmmz_sprites.js
    │  rmmz_windows.js
    │
    ├─libs
    │      effekseer.min.js
    │      effekseer.wasm
    │      localforage.min.js
    │      pako.min.js
    │      pixi.js
    │      vorbisdecoder.js
    │
    └─plugins
            AltMenuScreen.js
            AltSaveScreen.js
            ButtonPicture.js
            TextPicture.js

# 1.基本構造

JavaScriptがベース。動作もJavaScriptのようだ。MVと同じ。
データベースはJython(PythonのJVM実装だったかな)で書かれていて、実行時に読み込み(JavaScriptのインスタンスに変換)して参照する。


* main.js

    SceneManager.runを実行するだけ。

* libs/

    基本ライブラリ
    
* plugins/

    プラグインフォルダ。plugins.jsに書かれたスクリプトがこの下から読み込まれるのだ。

* plugins.js

    追加で読み込むプラグインが記述されている。

* rpg_core.js

    コアライブラリ。rpg_managers.js 動作の制御を行うクラスが定義されている。

*  rpg_objects.js

    構成するオブジェクトのクラスが定義されている。

* rpg_scenes.js

    シーンが定義されている。

* rpg_sprites.js

    スプライトが定義されている。

* rpg_windows.js

    各種ウィンドウが定義されている。

* data/

 エディタで編集するデータ。
 以下のものがある。

    Actors.json アクターデータ
    Animations.json アニメーションデータ。Effectと音再生の組み合わせ。
    Armors.json 防具データ。
    Classes.json クラスデータ。
    CommonEvents.json コモンイベントデータ。
    Enemies.json エネミーデータ。
    Items.json アイテムデータ。
    MapXXX.json マップデータ。
    MapInfos.json マップ情報データ。マップの親子関係などの情報を持つ。
    Skills.json スキルデータ。
    States.json ステートデータ。
    System.json システムデータ。
    Tilesets.json タイルセットデータ。
    Troops.json トロフィーデータ。
    Weapons.json 武器データ。

## 2.定義している各クラスについて

  Modules.txtを参照。

## 3.保存されるデータ

__DataManager.makeSaveContents__ 及び __DataManager.extractSaveContents__ にて定義されている。

|保存データ|補足|
|---|---|
|$gameSystem|システムに関するデータ。|
|$gameScreen|スクリーンデータ。スクリーンエフェクトなどを表現するための状態等を持つ。|
|$gameTimer|タイマーデータ。イベントタイマー。|
|$gameSwitches|スイッチ（フラグ）に関するデータ。|
|$gameVariables|変数に関するデータ。|
|$gameSelfSwitches|セルフスイッチ（フラグ）に関するデータ。|
|$gameActors|アクターデータ。|
|$gameParty|パーティーデータ。所持品などのデータを含む。|
|$gameMap|マップデータ。|
|$gamePlayer|プレイヤーのオブジェクトデータ。所在などのデータを含む。|

## 4.パラメータ

### __アクター/エネミーのパラメータ__ 

パラメータはGame_BattlerBaseで定義されている。
defineProperties参照。

#### __hp/mp/tp__

それぞれ現在HP,現在MP,現在TP。
_hp, _mp, _tpメンバを返すだけ。これはダメージや回復で変化する。

#### __mhp/mmp/atk/def/mat/mdf/agi/luk__

__Game_BattlerBase.param__ で定義される。

|パラメータID|対応するプロパティ|説明|
|---|---|---|
|0|mhp|MaxHP|
|1|mmp|MaxMP|
|2|atk|Atk|
|3|def|Def|
|4|mat|Matk|
|5|mdf|Mdef|
|6|agi|Agi|
|7|luk|Luk|

値の計算式
    (値) = (基本値)×(パラメータレート)×(バフレート)

    但し、取り得る範囲(paramMin-paramMax)が定義されている。

    基本値：paramBasePlus()
            paramBase + paramPlus
            アクターの場合
                paramBase : アクターのクラスのパラメータテーブル上の、アクターのレベルに対応する値
                paramPlus : _paramPlusに装備品補正値を加算したもの。

            エネミーの場合
                paramBase : DataBaseのパラメータ値。
                paramPlus : _paramPlusの値。（設定されないので0）

    パラメータレート：paramRate()

        Trait TRAIT_PARAM の1.0に対する乗算合計

    バフレート：paramBuffRate()

        1.0 + _buffsの格納値に0.25を乗算した値。



#### __hit/eva/cri/cev/mev/mrf/cnt/hrg/mrg/trg__

実体は __Game_BattlerBase.xparam__ で定義されている。
Trait __TRAIT_XPARAM__ の 0に対する加算合成。

|ID|プロパティ名|説明|
|---|---|---|
|0|hit|命中率|
|1|eva|回避率|
|2|cri|クリティカル率|
|3|cev|クリティカル回避率|
|4|mev|魔法回避率|
|5|mrf|魔法反射率|
|6|cnt|反撃率|
|7|hrg|HP回復率|
|8|mrg|MP回復率|
|9|trg|Tp回復率|

#### __tgr/grd/rec/pha/mcr/tcr/pdr/mdr/fdr/exr__

実体は __Game_BattlerBase.sparam__ で定義されている。
Trait __TRAIT_SPARAM__ の 1.0に対する乗算合成。

|ID|プロパティ名|説明|
|---|---|---|
|0|tgr|ターゲット率|
|1|grd|ガード時軽減率|
|2|rec|リカバリ率|
|3|pha|アイテム使用効果補正レート|
|4|mcr|MPコストレート|
|5|tcr|TPチャージレート|
|6|pdr|物理ダメージレート。被対象者の値が参照される。ダメージ計算時に処理される。pdrが低いと軽減になる。|
|7|mdr|魔法ダメージレート。被対象者の値が参照される。ダメージ計算時に処理される。mdrが低いと軽減になる。|
|8|fdr|Floor ダメージレート|
|9|exr|経験値レート|

#### 属性ダメージレート

実体は __Game_BattlerBase.elementRate__ で定義されている。
Trait __TRAIT_ELEMENT_RATE__ の1.0に対する乗算合成。

#### TPB速度

実体は __Game_BattlerBase.tpbSpeed__ で定義されている。
ここはちょっと計算が複雑だ。

行動実行は 0 からTPBチャージタイム(chargeTime)が
TPB加算量(tpbAcceleration)分加算され、
1.0以上になるとコマンド入力になる。
スキル発動時、ディレイ(速度補正のマイナス分)に
対応した時間だけキャストが行われる。



* __アクター基準速度(tpbBaseSpeed)__ = Sqrt(バフ/乗算補正なしAGI) + 1
* __アクターTPB速度(tpbSpeed)__ = Sqrt(AGI) + 1
* __パーティー基準速度(tpbBaseSpeed)__ = パーティーメンバーの基準速度(tpbBaseSpeed)で最大の値
* __アクターTPB相対速度(tpbRelativeSpeed)__ = アクターTPB速度(tpbSpeed) / パーティー基準速度(tpbBaseSpeed)
* __リファレンス速度__ = アクティブ時60, ノンアクティブ時240の固定量。
* __アクターTPB加算量__ = アクターTPB相対速度(tpbRelativeSpeed) / パーティーリファレンス時間(tpbReferenceTime)

* * AGI=100(係数1.0)のアクター1名の場合(TPB非アクティブ)

        アクター基準速度(tpbBaseSpeed) = Sqrt(100) + 1 = 11
        アクターTPB速度(tpbSpeed) = Sqrt(100) + 1 = 11
        パーティー基準速度(tpbBaseSpeed) = 11 (1名だけなので11)
        アクターTPB相対速度(tpbRelativeSpeed) = 11 / 11 = 1
        リファレンス速度=240
        アクターTPB加算量=1/240=0.0041
        たぶん、240フレーム時間で1回行動できる計算になる。

* __キャスト時間(tpbRequiredCastTime)__ 

        有効なアクションに対し、0以下のディレイを加算した結果にたいし、
        Sqrt(delay) / アクターTPB速度








### ステート

実際に付与されているのはGame_BattlerBaseで持っている。
持ってるステート(_statesメンバ)とターン数(_stateTurnsメンバ)を持っている。効果量などは全くない。
使用者のステータスを参照して降下量を変動させるなら、大きく変えないと無理かなあ。




### バフ/デバフ（パラメータ）

バフレベル（_buffs)とバフターン(_buffTurns)で管理されている。
既定では-2～2で、1段階あたり25％の増加量になる。
（バランス的にはこんなものかなあ)
戦闘開始時は0でスキルなどにより、1段階ずつ増減する仕様。
最大バフ量は __Game_BattlerBase.isMaxBuffAffected__ で定義され、最低バフ量は __Game_BattlerBase.isDebuffAffected__ で定義されている。




## 5.各機能の処理

### __ドロップ処理__ 

__Game_Enemy.makeDropItems__ メソッド内で処理されてる。計算式が逆説的な考え方でちょっとわかりにくいが、
~~~javascript
    denominator * (0.0 ～1.0) < dropItemRate
~~~
のときにドロップ品が生成される。
dropItemRateはデフォルトだと1.0。パーティーのドロップ率向上フラグがあると2倍になる。
倍率をカスタマイズしたいなら、新規Traitを追加する必要がある。
ベーシックシステムでは、「ドロップ率は2倍かそうでないか」しかない。








## ■ MVとの互換性は？
ActorやWeaponなど、データベースのメンバは大体同じっぽい。
スクリプト側はアニメーション周りが大分変わってる。
pixi.jsは大分変わってるけど、こっちは変更することないから影響ない。
アニメーション周りや効果範囲とか、MZで改善対象になっている部分は要注意。
Window周りはカラー設定としてColorManagerが導入されていて、
Window_Baseのインタフェースを使う状態から変わっている。


## ■ アニメーションさせる仕組み
エフェクトの機構を変更したためか、
いろいろ複雑になってる。まあ仕方ないね。

アニメーションを再生させる仕組み
1. アニメーション要求


    $gameTemp.requestAnimation(targets, animationId, mirror);     
    ↓   
    Spriteset_Base.processAnimationRequests();     
    ↓  
    Spriteset_Base.createAnimation();      
    ↓   
    Spriteset_Base.createAnimationSprite();      
    ↓     
    アニメーション再生へ
        
2. アニメーション再生

    Spriteset_Base.update();    
    ↓   
    Spriteset_Base.updateAnimations()

## ■ SceneとWindowの親子関係及び参照関係
  
Sceneが0個以上のWindowを持つ。
入力イベントの伝達は

    1. 入力操作
    2. Window_Selectable.update()で操作検出
        Input.isRepeated('right')などで入力判定する。
    3. Wndowに登録されたハンドラ呼び出し
        (Window_Selectable.callHandler()など)
    4. Sceneが登録したハンドラが呼ばれる 
    5. Sceneで適切な処理

という仕組みになってる。
Window_Selectableの派生じゃないと、okハンドラが無いことに注意。

## ■ 効果適用処理

__Game_Action.apply(target)__ にて実装されている。
処理がわかりにくいが、適用判定・失敗判定・回避判定の3つを行っている。

1. 適用判定(used)

    このアクションをtargetに適用可能かどうかを判定しており、乱数の要素はない。
    ようは倒れてる対象にHPリカバリは適用できないよ、とかいう話。

2. 失敗判定(missed)

    乱数(0.0～1.0) >= 命中率    
    物理命中率はGame_ActionのsuccessRate*Game_BattlerBase.hit で計算
    魔法命中率はGame_ActionのsuccessRateのみ。

3. 回避判定(evaded)

    乱数(0.0～1.0) < 回避率    
    物理回避率 Game_BattlerBase.eva    
    魔法回避率 Game_BattlerBase.mev    

    命中率は失敗判定に入っていて、
    回避判定に命中率絡んでなかったりして直感的じゃない。

4. クリティカル判定

__Game_Action.itemCri__ にて判定
以下の計算でクリティカル判定される。

    cri * (1.0 - target.cev)

Note: 乗算より減算の方がいいかも。
これは物理魔法関係なく処理される。

5. 反射判定

__BattleManager.invokeAction__ 内で判定処理してる

    乱数(0.0～1.0) < 反射率    
    物理反射率 0.0固定    
    魔法反射率 Game_BattlerBase.mrf    

6. ガード時軽減率

Game_Action.applyGuardにて処理。
ガード判定されたときに軽減量補正として使用される。

    damage = 1 / (2.0 * grd)

grd=1.0だとダメージ半減。grdの算出は1.0に対する乗算合成なので、何も補正がなくてもgrd=1.0になる。
ガードしたときに初めて適用されることに注意。

7. リカバリ率
  
HP/MPの回復量に補正がかかる。
※使用対象(target)のものが参照される！

8. 狙われ率

__Game_Unit.randomTarget()__ にて判定
パーティーメンバーのtgr率の割合比で決まるようになってる。  (計算コスト考慮してるのか、判定式わかりにくいけど！)


9. LUKの効果

__Game_Action.lukEffectRate__ にて使用される。

    lukEffectRate値 = 1.0 + (対象のLUK - 使用者のLUK) * 0.001

但し負数にはならない。
対象のLUKが使用者のLUKより1高いと0.1%加算されるということ。使用対象が自身の場合(taget === subject)は補正値ゼロ。

どこに関係してくるの？

* 行動回数付与判定    

    Game_Action.itemEffectAddAttackState

* ステート付与判定

    Game_Action.itemEffectAddNormalState 

* デバフステート付与確率

    Game_Action.itemEffectAddDebuff

Note:
命中したとか、クリティカルとかには反映されないのね。残念。



## ■ 先制攻撃率

パーティーのAGIが敵グループのAGIと比較して、先制攻撃率が決まる。

* パーティーメンバーのAGI＞敵グループのAGI → 5%の確率
* パーティーメンバーのAGI＞的グループのAGI → 3%の確率

先制攻撃率向上スキルを持っている場合、これが4倍(20%または3%)になる。

## ■ 急襲発生率

パーティーのAGIが敵グループのAGIと比較して、急襲発生率が決まる。

* パーティーメンバーのAGI＞敵グループのAGI → 3%の確率
* パーティーメンバーのAGI＞的グループのAGI → 5%の確率

急襲防御のスキルを持っている場合、確率は0になる。
