## ■ どうやって変更するの？
    
プラグインスクリプトをpluginsフォルダに放り込み、
MZのプラグイン管理画面で設定すれば良い。
作り方についてはここに書いておく。

情報元
https://tkool.jp/mz/plugin/make/annotation.html



## (a) アノテーション
__/*: ～ */__ で書く。わかりにくいけど。
/*ja ～ */とすると日本語環境用のコメントになるっぽいよ。
アノテーションにより、MZエディタからの設定が可能になるから、おろそかにするとまずいよ。


---
### ■ プラグイン全体

~~~javascript
/*:
 * @target MZ 
 * @plugindesc 概要
 * @author hogehoge
 * @url url
 * @help 
 *   hogehoge....
~~~

|アノテーション|説明|
|---|---|
|__@target MZ__|どうやらMZ用のプラグインであることを明示する必要があるようだ。MV,MZ両対応するなら、@target MV MZとするみたい。|
|__@plugindesc__ _概要_|プラグインの名前を簡潔に書く。1行が望ましいか。|
|__@author__ _制作者_|制作者を書く。|
|__@help__ _メッセージ_|プラグインの詳細な説明を書く|
|__@url__ _URL_|配布元URL|

---
### ■ パラメータ

プラグイン全体に対する動作をカスタマイズする機能を提供するためのもの。
このゲームでは～の動作させて、こっちのゲームでは～の動作させたい、みたいなのを実現するための方法だよ！
プラグインコメントでアノテーションを書けば良い。

~~~
 * @param paramName
 * @text パラメータ名
 * @desc 説明
 * @default デフォルト値
 * @param タイプ
~~~

|アノテーション|説明|
|---|---|
|__@param__ _パラメータ名_|プラグイン内で値を取得するときに使用する名前。|
|__@text__ _表示名_|MZの編集画面で表示される|
|__@desc__ _説明_|パラメータの説明|
|__@default__ _デフォルト値_|パラメータのデフォルト値|
|__@type__ _パラメータの型情報_|このパラメータの型。|
|__@parent__ _親パラメータ名_|階層構造で表現される|
|__@max__ _数値_|取り得る最大値(@type=number)|
|__@min__ _数値_|取り得る最小値(@type=number)|
|__@decimals__ _数値_|小数点以下の桁数(@type=number)|
|__@dir__ _サブフォルダ名_|ファイル選択対象フォルダ(@type=file)|
|__@on__ _文字列_|ONを選択したときにダイアログに表示する値(@type=boolean)|
|__@off__ _文字列_|OFFを選択したときにダイアログに表示する値(@type=boolean)|
|__@option__ _文字列_|プルダウンの表示項目。(@type=select,combo)|
|__@value__ _文字列_|プルダウンを選択したときに設定される値。optionとペアで使う。(@type=select,combo)|

プラグイン側で参照するときは __PluginManager.parameters()__ で取得できる。
Hoge.jsプラグインで定義された'hoge'というパラメータにアクセスするには

~~~javascript
    const pluginName = "Hoge";
    const parameters = PluginManager.parameters(pluginName);
    const setting = parameters['hoge'];
~~~

のようにすればいい。


@type で指定可能な型

｜型の種類|説明|設定値|
|---|---|---|
|string|文字列|入力した文字列|
|multiline_string|文字列(複数行)|入力した文字列|
|file|ファイル名|ファイル名(拡張子なし)|
|number|数値|入力した値|
|boolean|真偽値|true/false|
|select|プルダウンリスト|@valueの値(@value未指定時は@optionの値)|
|combo|コンボボックス|@optionの値|
|actor|アクター|アクターID|
|class|クラス|クラスID|
|skill|スキル|スキルID|
|item|アイテム|アイテムID|
|wepoon|武器|武器ID|
|armor|防具|防具ID|
|enemy|エネミー|エネミーID|
|troop|敵グループ|敵グループID|
|state|ステート|ステートID|
|animation|アニメーション|アニメーションID|
|tileset|タイルセット|タイルセットID|
|common_event|コモンイベント|コモンイベントID|
|switch|スイッチ選択|スイッチID|
|variable|変数|変数ID|
|string[]|複数文字列|配列|
|struct <型>|オブジェクト。|オブジェクト。{ aaa:"ほげ", bbb:"""}|

オブジェクトは別アノテーションで定義するらしい。

~~~javascript
/*~struct~型名:
*
* @param param
* @text パラメータ名称
* @desc パラメータの説明
* @default
* ......
*/
~~~
---


---
### ■ プラグイン依存関係

|アノテーション|説明|
|---|---|
|__@base__ _プラグイン名_|依存するプラグインを指定する。|
|__@orderAfter__ _プラグイン名_|先に登録する必要があるプラグイン名|
|__@orderBefore__ _プラグイン名_|後に登録する必要があるプラグイン名|


### ■ デプロイメント削除対象外

~~~javascript
* @requiredAssets img/pictures/image_1
* @requiredAssets img/system/image_2
* @requiredAssets img/example/image_3
~~~

|アノテーション|説明|
|---|---|
|__@requiredAssets__ _パス_|該当ファイルをデプロイメント時に削除しない。|
|__@noteParam__ _パス_|メモの名前|
|__@noteDir__ _ディレクトリ_|画像が格納されているフォルダ|
|__@noteType__ _ファイル_|ファイル|
|__@noteData__ _データベース_|対象のメモが使われているデータベース。maps/events/actors/classes/skills/items/weapons/armors/enemies/states/tilesets のいずれかを指定する|


## ■ 基本的な書き方

MVの時に比べて、若干エレガントな書き方してる。
かなあとか思ったけど、pixi.jsだけエレガントだった。


### インポートフラグ

インポートプラグを設定する。つまり、

    var Imported = Imported || {};
    Imported.プラグイン識別子 = true;

このプラグインのインポートを前提とするやつがいたら、このフラグを使用して判定できるようになる。

### 本体

プラグインの処理は匿名ファンクションを定義して実行する形にする。
つまり

    (() => {
        /* TODO : ここにプラグインの処理を書く */
    }());  

とする。

### メソッドのフック

既存の実装に機能を追加する場合にはフックを使用する。
既存の処理が残るので影響が小さい。
const 参照用変数 = オーバーロードするメソッド

    オーバーロードするメソッド = function() {
        // 必要な処理
        参照用変数.apply(this, arguments);
        // 必要な処理
    };
      
とする。

### メソッドのオーバーロード
完全に置きかえる場合。
他のプラグインとの競合に気をつけないといけないパターン。

~~~javascript
オーバーロードするメソッド = function() {
    // 必要な処理
};
~~~

とする。

## ■ プラグインコマンド

### アノテーション

~~~javascript
/*
 * @command COMMAND
 * @text コマンド名称
 * @desc コマンド説明
 *
 * @arg 引き数名
 * @text 引数の名称
 * @desc 引数の説明
~~~

|アノテーション|説明|
|---|---|
|__@command__ _コマンド名_|プラグインコマンド名|
|__@arg__ _引き数名_|引き数名|

よくわからん説明だが、MVと違ってかなり強化されてる。
__@arg 引き数名__ で指定すると、プラグインコマンドに渡されるオブジェクトに引き数名で指定したメンバとして渡される。
どういうことかというと、

    @arg arg1

とか渡すと、プラグインコマンド処理の引数.arg1というフィールドでデータが渡ってくるのだ。

### 登録

MVではプラグインコマンドで実現していた。
MZも同様だが、実現方法が違う。

__PluginManager.registerCommand(pluginName, commmand, func)__ を使用する。
例えば登録は
~~~javascript
PluginManager.registerCommand("Hoge", "sayHello", args => {
    
    console.log("Hello world");
});
~~~
とする。
MVのpluginCommandをフックして実装する設計より、MZの方が美しいね！
（間違って呼び出し忘れをして、他のプラグインが動かなくなる問題が発生しないのだ）

### 呼び出し側

設定がどうなってんのかわからんけど、プラグイン名、コマンド名、パラメータを渡すと呼び出せるっぽい。
Game_Interpreterのソースを見る限りだと、
それぞれ独立したパラメータになってるゾ。
だからデータベース上の設定もそれぞれ指定するのだと思う。

### プラグインパラメータ

MZエディタから設定したパラメータは、プラグインスクリプト側では下記でアクセスできる。

~~~javascript
const param = PluginManager.parameters(pluginName);
const value = param[パラメータ名]; // パラメータ名で設定した値。
~~~

## ■ データベースとの連携（ノートタグ）

### 標準のノートタグデコードを使用する場合

データベースのメモ欄に

    <ParamName:value>  : 数値
    <ParamName>        : Boolean型フラグ

みたいに書くと、$dataXXX のメンバにある、metaに格納される。metaは連想配列になっている。
アクセスする方法は
~~~javascript
const value = data.ParamName;
~~~
でアクセスできる。JavaScriptすげー。

### 独自のノートタグを実装する場合

__Scene_Boot.start__ をフックして処理を追加する。


~~~javascript
  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.call(this);

        /* TODO : ノートタグの処理 */
  };
~~~

ノートタグのパース処理はDataManagerにメソッドを用意し、コールする形にする。

ノートタグの処理は $dataXXX に対して逐次処理で調べる。
あんまりコストかかる処理書くと起動時間に関わってくるので注意。
あとメンバのインデックスは1からとする。0番目はnullが格納されている。
~~~javascript
for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    /* TODO :
     *  必要なら対象に空のフィールドを設ける。
     * ノートタグ未設定時でも参照するところで
     * undefined しないようにする。
     * undefinedにならないなら不要。 */

    for (var i = 0; i < notedata.length; i++) {
        /* TODO :ノートタグを調べ、対象のタグなら処理する。 */
    }
}

ノートタグを調べて処理する一般的な方法

var notePattern = /<正規表現>/;

var line = notedata[i];
if (line.match(notePattern)) {
    /* TODO: ノートタグから設定値を取り出して対象に設定する処理 */
}
~~~   
みたいにする。

## ■セーブデータの追加

### 既存のグローバルデータにメンバを新規追加する場合

既存のデータ$gameなんちゃらは、メンバを追加すれば勝手に保存される（はず）

### 新規にグローバルデータを追加する場合。

$gameなんちゃらのグローバルデータを新規追加した場合や、保存されないグローバルメンバに追加した場合に必要になる。
__DataManager.makeSaveContents__ および __DataManager.extractSaveContents__ をフックして
追加したデータを処理するようにしなければならない。
~~~javascript
Hoge.DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    var contents = Hoge.DataManager_makeSaveContents.call(this);
    contents.hoge = $gameHoge;
    return contents;
};

Hoge.DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    Hoge.DataManager_extractSaveContents.call(this, contents);
    if (contents.hoge) {
        $gameHoge = contents.hoge;
    } else {
        // セーブデータに無い場合の処理。(途中追加したときなど)
    }
};
~~~

## ■ 独自のJSONデータを読み出したい場合

MVから変更になってる。 __DataManager._databaseFiles__ に読み出すメンバとグローバル変数を追加する。たったこれだけ。何それかっこいい！
注意しないといけないのは、Scene_Boot前にやらないと読み出してくれないことくらいかな。

~~~javascript
    DataManager._databaseFiles.push({ name:"グローバル変数名", src: "JSONファイル名" });
~~~


## ■ UIデザインするときは

まず設計図を書こう。
だいたいのUIイメージを鉛筆で紙に書けばいい。
作ってから「やっぱりこうしよう」を直すのは結構大変なのだ。この時点である程度動きも見ておくべき。
HMIのデザインと一緒だね、というか一緒と考えた方がいい。
その後Sceneの状態遷移を考える。
キャンセルされたときに全部戻すのか、それとも1つ前に戻すのか、等。

次のシーンに遷移する場合
~~~javascript
SceneManager.push(遷移するシーン);
~~~
1つ前に戻す場合の遷移
~~~javascript
Scene_Base.popScene()を使う。
~~~
全部戻す場合の遷移
SceneManager.goto(遷移するシーン);

### ■ 選択する必要はないけど、OK/キャンセル操作を受け付けたい場合は？

Window_Seleactableを派生させたウィンドウを作成し、
refresh()をまるっとオーバーライドして描画コードを書けば良い。

### ■ Traitって何？

ステートやらなにやらが持ってるデータ。
付与する効果、を表すものと考えるのが適切か。
Game_BattlerBase.traitObjects()で取得できる。
Game_BattlerBaseではステートだけだが、アクターではアクターとクラス、装備品の特性が返る。
~~~javascript
    Game_BattlerBase.prototype.allTraits = function() {
        return this.traitObjects().reduce((r, obj) => r.concat(obj.traits), []);
    };
~~~
Traitの持ってるメンバ

|メンバ|型|説明|
|---|---|---|
|code|Number|TRAITT_XXXXが格納される。特性の種類ということ。Game_BattlerBase.traits(code)などで特定の種類の特性を取得できる。|
|dataid|Number|データID。データベース上のIDだったり、パラメータIDだったりする。|
|value|Number|値。加算したり(traitsSum)、乗算したり(traitsPi)したりするのに使う。|


定義済み特性(Game_BattlerBase.TRAIT_***)

|定義|code値|dataId値|説明|
|---|---|---|---|
|TRAIT_ELEMENT_RATE|11|属性ID|dataIdで指定される属性のダメージレート。|
|TRAIT_DEBUFF_RATE|12|パラメータID|dataIdで指定されるパラメータのデバフ受付率。|
|TRAIT_STATE_RATE|13|ステートID|dataIdで指定されるパラメータのステート受付率。|
|TRAIT_STATE_RESIST|14|ステートID|指定したステートを受け付けない。|
|TRAIT_PARAM|21||基本パラメータ|
|||1|MaxHP|
|||1|MaxMP|
|||2|ATK|
|||3|DEF|
|||4|MAT|
|||5|MDEF|
|||6|AGI|
|||7|LUK|
|TRAIT_XPARAM|22||効果値が全ての加算結果で得られるパラメータに対する効果。初期値0で効果エントリのvalue分加算される。|
|||0|HIT|
|||1|EVA|
|||2|CRI|
|||3|CEV|
|||4|MEV|
|||5|MRF|
|||6|CNT(反撃率)|
|||7|HRG(HP再生率)|
|||8|MRG(MP再生率)|
|||9|TRG(TP再生率)|
|TRAIT_SPARAM|23||効果値乗算が全ての乗算結果で生成されるパラメータに対する効果。初期値は1.0で効果エントリのrateが乗算される。|
|||0|TGR(ターゲット率)|
|||1|GRD(ガード時軽減率)|
|||2|REC(回復率)|
|||3|PHA(アイテム効果量変動率)|
|||4|MCR(MPコスト変化率)|
|||5|TCR(TPチャージ量変化率)|
|||6|PDR(物理被ダメージ倍率)|
|||7|MDR(魔法被ダメージ倍率)|
|||8|FDR(床ダメージ倍率)|
|||9|EXR(経験値増加倍率)|
|TRAIT_ATTACK_ELEMENT|31|属性ID|dataIdで指定される属性を攻撃属性として追加する。|
|TRAIT_ATTACK_STATE|32|||
|TRAIT_ATTACK_SPEED|33|||
|TRAIT_ATTACK_TIMES|34|||
|TRAIT_ATTACK_SKILL|35|||
|TRAIT_STYPE_ADD|41|スキルタイプID|dataIdで指定したスキルタイプを追加する。valueは無視されるようだ。dataId=x: スキルタイプ x を追加する。|
|TRAIT_STYPE_SEAL|42|スキルタイプID|dataIdで指定したスキルタイプを封印する。|
|TRAIT_SKILL_ADD|43|スキルID|dataIdで指定したスキルを追加する。|
|TRAIT_SKILL_SEAL|44|スキルタイプID|dataIdで指定したスキルを封印する。|
|TRAIT_EQUIP_WTYPE|51|武器タイプID|dataIdで指定した武器タイプを装備可能にする。|
|TRAIT_EQUIP_ATYPE|52|防具タイプID|dataIdで指定した防具タイプを装備可能にする。|
|TRAIT_EQUIP_LOCK|53|装備スロットタイプ|dataIdで指定した装備をロックする。ロックは装備タイプの装備を変更できない状態。|
|TRAIT_EQUIP_SEAL|54|装備スロットタイプ|dataIdで指定した装備を封印する。封印は装備スロットに装備できない状態。|
|TRAIT_SLOT_TYPE|55|||
|TRAIT_ACTION_PLUS|61|||
|TRAIT_SPECIAL_FLAG|62|||
|TRAIT_COLLAPSE_TYPE|63|||
|TRAIT_PARTY_ABILITY|64||パーティーアビリティ。既定の実装はdataIdで指定された値の効果を持っているかどうか、だけの判定に使われる。dataIdはGame_Party.ABILITY_～で定義されてる。|
|||0|ABILITY_ENCOUNTER_HALF。ランダムエンカウント率半減。|
|||1|ABILITY_ENCOUNTER_NONE。ランダムエンカウントでエンカウントしない。|
|||2|ABILITY_CANCEL_SURPRISE|
|||3|ABILITY_RAISE_PREEMPTIVE|
|||4|ABILITY_GOLD_DOUBLE。戦闘でのゴールド倍率2倍|
|||5|ABILITY_DROP_ITEM_DOUBLE。戦闘でのアイテムドロップレート2倍|

### ■ damage.typeって何？

効果量の適用種類っぽい。
 __Game_Action.checkDamageType()__ メソッドで一致判定してる。
以下はコードから推測する値の意味。

|タイプ|名前|使用メソッド|
|---|---|---|
|1|HP ダメージ|Game_Action.isHpEffect(), Game_Action.isDamage()|
|2|MP ダメージ|Game_Action.isMpEffect(), Game_Action.isDamage()|
|3|HP 回復|Game_Action.isHpEffect(), Game_Action.isRecover(), Game_Action.isHpRecover()|
|4|MP 回復|Game_Action.isMpEffect(), Game_Action.isRecover(), Game_Action.isMpRecover()|
|5|HP 吸収|Game_Action.isHpEffect(), Game_Action.isDrain()|
|6|MP 吸収|Game_Action.isMpEffect(), Game_Action.isDrain()|
 
### ■ Effectって何？

道具やスキルを使用した時の効果をあらわすオブジェクト。

定義済み効果コード(codeパラメータ) (Game_Action.EFFECT_***)

|定義名|code|dataId|value1|value2|説明|
|---|---|---|---|---|---|
|EFFECT_RECOVER_HP|11|-|最大HPに対する割合|固定量|HP回復効果。|
|EFFECT_RECOVER_MP|12|-|最大MPに対する割合、|固定量|MP回復効果。|
|EFFECT_GAIN_TP|13|-|TP回復量|-|TP回復効果。|
|EFFECT_ADD_STATE|21|0|付与率(0.0～1.0)|-|攻撃ステート付与効果。使用者のattackStates()を付与効果。|
|||ステートID|付与率|-|通常ステート付与効果。dataIdで指定されたステートの付与効果。|
|EFFECT_REMOVE_STATE|22|||||
|EFFECT_ADD_BUFF|31|||||
|EFFECT_ADD_DEBUFF|32|||||
|EFFECT_REMOVE_BUFF|33|||||
|EFFECT_REMOVE_DEBUFF|34|||||
|EFFECT_SPECIAL|41|||||
|EFFECT_GROW|42|||||
|EFFECT_LEARN_SKILL|43|||||
|EFFECT_COMMON_EVENT|44|||||

独自の効果を追加するなら、以下はフックする必要があるかもしれない。

* __Game_Action.testItemEffect()__

        効果を指定された対象に適用可能かどうかを判定する処理。
        常に適用可能ならばフックする必要は無い。
        HPが減っていない対象には使用出来ないようにする判定などが含まれる。
 
* __Game_Action.applyItemEffect()__

        効果を指定された対象に適用する処理。
        switch - caseのお化け。

### ■ scopeって何？

効果範囲を表す整数値らしい。 __Game_Action.checkItemScope()__ メソッドで、一致判定してる。
以下はコードから推測する値の意味。

|値|説明|
|---|---|
|1|選択した敵対者1体|
|2|敵対者全体|
|3|ランダムな敵対者1体|
|4|ランダムな敵対者2体|
|5|ランダムな敵対者3体|
|6|ランダムな敵対者4体|
|7|選択した生存している味方1体|
|8|生存している味方全体|
|9|選択した死亡している味方1体|
|10|死亡している味方全体|
|11|使用者|
|12|選択した味方1体|
|13|味方全体|
|14|敵対者 生存している味方全体 敵味方全体|

判定に使用しているメソッド

|メソッド|概要|
|---|---|
|isForOpponent|敵対者が対象か|
|isForFriend|味方が対象か|
|isForEveryone|敵味方全体が対象か|
|isForAliveFriend|生存している味方が対象かどうか|
|isForDeadFriend|死亡している味方が対象かどうか|
|isForUser|使用者が対象かどうか|
|isForOne|単体を対象にしたものかどうか|
|isForRandom|ランダムな対象かどうか|
|isForAll|全体を対象にしたものかどうか|
|needsSelection|対象を選択する必要があるかどうか|

既定のシステムではscopeを直接参照せずに、メソッドを使用する。

~~~javascript
Scene_Battle.prototype.onSelectAction = function() {
    const action = BattleManager.inputtingAction();
    if (!action.needsSelection()) {
        // 選択する必要がない。
        this.selectNextCommand();
    } else if (action.isForOpponent()) {
        // エネミー選択を行う。
        this.startEnemySelection();
    } else {
        // アクター選択を行う。
        this.startActorSelection();
    }
};
~~~


### ■ Sceneの呼び出しシーケンス

1. initialize()

    コンストラクタから呼ばれる（呼ばれるように実装している)

2. prepare()

    一部のみ実装されている。
    シーンにデータを引き渡すため、create()の前に呼ばれる。
    シーン用のデータを引き渡したい場合に使用する。

    必要時のみ、SceneManager経由で明示的に呼び出す。

    SceneManager.push(Scene_Hoge);    
    SceneManager.prepareNextScene(args...);    

    argsで渡したものが、そのままScene_Hoge.prepareに渡される。


3. attachReservation() 

    リソースを予約するためのID初期化。

4. create()

    シーン変更時に呼ばれる。このメソッド内でウィンドウを作るのが作法っぽい。

5. start()

    シーンを開始する。

6. update() 

    シーン処理中、1/60sec毎に呼ばれる。
    1/60は既定の実装の場合。プラグイン等で変化されている可能性がある。

7. terminate()

    他のシーンに切り替わる前に呼ばれる。

8. detachReservation()

    リソースを破棄（たぶん）




### ■ 小ネタ
   
#### ・コモンイベントの呼び出し

__$gameTemp.reserveCommonEvent(id);__   

id#のコモンイベントを呼び出す。正確には呼び出し予約する。

#### ・SEを出したい場合

システムサウンドを鳴らす場合には __SoundManager__ を使おう。それ以外はAudioManagerを使うことになる。

例)
~~~javascript
    const se = {
        name:"SEファイル名",
        pan:0,
        pitch:100,
        volume:100,
    };
    AudioManager.playSe(se);
~~~

#### ・画像を表示させる場合

1. ImageManager.loadXXXを使ってBitmapを用意する。

    Bitmapが読み込み完了していない(isReady()がfalse)場合、 __addLoadListener__ で読み込み完了時のハンドラを追加して、読み込み完了時に表示処理する。

2. 表示処理自体はSpriteオブジェクトを構築し、bitmapメンバに読み込んだビットマップを設定する。

3. SceneのaddChildでSpriteを追加する。

    (背景なら、Scene_MenuBaseの_backgroundSpriteにaddChildする。)
    あとから追加したやつが上に表示されるっぽいね。尚、Sceneのcreate処理でisReady()がtrueになるまで待つとか、馬鹿なコードを書いちゃいけない。
    ImageManagerはupdate()か何かのタイミングで読み出しを行うようになっているので、
    create()処理でとめちゃうと永遠に戻ってこなくなる。

    例）img/picturesの下にある、x.pngを表示させるには、
~~~javascript
    this._bitmapX = ImageManager.loadPicture("x");
    if (this._bitmapX.isReady()) {
        // 表示処理
        this.createPictureSprite();
    } else {
        this._bitmapX.addLoadListener(
            this.createPictureSprite.bind());
    }
~~~
    の処理をして、更にcreatePictureSpriteを
~~~javascript
    function Scene_Hoge.prototype.createPictureSprite = function() {
        var bgSprite = new Sprite();
        bgSprite.bitmap = this._bitmapX;
        bgSprite.x = x座標;
        bgSprite.y = y座標;
        this._backgroundSprite.addChild(bgSprite);
};
~~~
    みたいに書く。

#### ・アニメーションさせる場合

MVから大きく変わってるので結構面倒。

##### SpriteとSprite_Animationを使う方法

1. シーンではアニメーションターゲットのスプライトを作成する。

    これは空でもよいようだ。
    中央に表示させるためのターゲット例。

~~~javascript
    Scene_RunAnimation2.prototype.createTargetSprite = function() {
        const width = 0;
        const height = 0;
        this._targetSprite = new Sprite();
        this._targetSprite.x = Graphics.boxWidth / 2;
        this._targetSprite.y = Graphics.boxHeight / 2;
        this._targetSprite.setFrame(0, 0, width, height);
        this.addChild(this._targetSprite);
    };
~~~

2. アニメーション開始時はSprite_Animationを構築して初期化する。

~~~javascript
        const sprite = new Sprite_Animation();
        const targetSprites = [ this._targetSprite ];
        sprite.targetObjects = targetSprites;
        const animation = $dataAnimations[this._animationId];
        sprite.setup(targetSprites, animation, this._mirror, 0, null);
        this._animationSprite = sprite;
        this.addChild(sprite); // 以降Scene.updateでアニメーションスプライトが更新される。
~~~

3. アニメーション完了待ち

    アニメーション完了を検出したら、場合によってはremoveChildやdestroyを使って解放すること。
~~~javascript
    if (!this._animationSprite.isPlaying()) {
        this.removeChild(this._animationSprite);
        this._animationSprite.destroy();
        this._animationSprite = null;
        // アニメーション再生終了。
        SceneManager.pop();
    }
~~~


##### Spritesetを使う方法

Game_TempとSpriteset_Baseの実装クラス、Sceneが複雑に絡んでいるので面倒。
準備が面倒だが、一度汎用的な Spriteset_Base の実装クラスを作ってしまえば、使いまわすことで開発効率は上がる。
あとSpriteset_Baseがリソース開放をしてくれるのが強み。


__$gameTemp.requestAnimation__ を呼ぶことになるが、これだけでは足りないのだ。
まず、 __$gameTemp.requestAnimation__ に渡すデータは

    * targets : {Object} 表示対象。
                   
        使用しているSpritesetに依存。
        Scene_Mapの場合にはGame_CharacterBase
        Scene_Battleの場合にはGame_BattlerBase
        それ以外は後述。

    * animationId : {Number} アニメーションID
    * mirror : {Boolean} 左右反転させるかどうか。(省略可。省略時はfalse)

となっている。

1. まずSpriteset_Baseの派生を定義する。
    
    実装するのは大きく2つ。createLowerLayerとfindTargetSprite。
    createLowerLayerはアニメーション対象のスプライトの作成と、コンテナ、背景などを設定する。
    findTargetSpriteはアニメーション対象のスプライトを返す。

~~~javascript
    Spriteset_RunAnimation.prototype.createLowerLayer = function() {
        Spriteset_Base.prototype.createLowerLayer.call(this);
        this._blackScreen.visible = false; // ブラックスクリーンは使用しないので無効化。

        // アニメーション対象スプライトの作成。
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        this._centerSprite = new Sprite();
        this._centerSprite.x = Graphics.boxWidth / 2;
        this._centerSprite.y = Graphics.boxHeight / 2 + height / 2;
        this._centerSprite.bitmap = new Bitmap(width, height);
        this._centerSprite.setFrame(0, 0, width, height);
        this._baseSprite.addChild(this._centerSprite);

        // エフェクトコンテナの作成。
        this._effectsContainer = new Sprite();
        this._baseSprite.addChild(this._effectsContainer);
    };

    Spriteset_RunAnimation.prototype.findTargetSprite = function( /* target */ ) {
        // アニメーション対象スプライトを返す。
        return this._centerSprite;
    };
~~~

2. Sceneに作成した独自Spriteset_Baseを追加する。
            
    ※カスタマイズに使えるクラスくらい、
    フレームワークで用意して欲しいなあ。

3. $gameTemp.requestAnimation()をコールする。

~~~javascript
    $gameTemp.requestAnimation([this._spritesetRunAnimation], this._animationId, this._mirror);
~~~


4. アニメーション完了待ちするならば、Spriteset_Base.isAnimationPlaying()で判定を取得する。

    但し、Sceneのメソッドでforやらwhileで待たないこと。


Spriteset_Baseのインスタンスは、1つのシーンに1つだけ用意すること。
さもないとどちらかはアニメーション再生要求を取り出せない。

#### ・Window_Messageの使い方

実例はScene_Message参照。

1. シーンのウィンドウ作成時

MVと違い、名前表示欄が追加されている。そのため、Window_Messageだけでなく、Window_NameBoxのインスタンスを構築してセットする必要がある。
なんか簡単に使えるやつが欲しいのう。

~~~javascript
    const windowWidth = Graphics.boxWidth
    const windowHeight = Window_Base.prototype.fittingHeight(4);
    const rect = new Rectangle(0, 0, windowWidth, windowHeight);
    this._messageWindow = new Window_Message(rect);
    this._messageWindow.terminateMessage = this.onTerminateMessage.bind(this);
    this.addWindow(this._messageWindow);

    // メッセージボックス用サブウィンドウ
    // 所持金表示ウィンドウ
    this._goldWindow = new Window_Gold(rect);
    this._goldWindow.openness = 0;
    this.addWindow(this._goldWindow);
    this._messageWindow.setGoldWindow(this._goldWindow);
    // 名前欄ウィンドウ
    this._nameBoxWindow = new Window_NameBox();
    this._nameBoxWindow.setMessageWindow(this._messageWindow);
    this.addWindow(this._nameBoxWindow);
    this._messageWindow.setNameBoxWindow(this._nameBoxWindow);
    // 選択肢ウィンドウ
    this._choiceListWindow = new Window_ChoiceList();
    this._choiceListWindow.setMessageWindow(this._messageWindow);
    this.addWindow(this._choiceListWindow);
    this._messageWindow.setChoiceListWindow(this._choiceListWindow);
    // 番号入力ウィンドウ
    this._numberInputWindow = new Window_NumberInput();
    this._numberInputWindow.setMessageWindow(this._messageWindow);
    this.addWindow(this._numberInputWindow);
    this._messageWindow.setNumberInputWindow(this._numberInputWindow);
    // イベントアイテムウィンドウ
    this._eventItemWindow = new Window_EventItem(rect);
    this._eventItemWindow.setMessageWindow(this._messageWindow);
    this.addWindow(this._eventItemWindow);
    this._messageWindow.setEventItemWindow(this._eventItemWindow);
~~~
   
2. その他ウィンドウ制限の追加

    シーンのビジー判定に_messageWindowを追加する。
~~~javascript
    Scene_Hoge.prototype.isBusy = function() {
        return ((this._messageWindow && this._messageWindow.isClosing())
                || Scene_Base.prototype.isBusy.call(this));
    };
~~~

    表示位置とかは$gameMessage経由で上/真ん中/下に設定される。
~~~javascript
            $gameMessage.setFaceImage(faceName, faceIndex);
                // faceName : 顔グラフィックファイル名
                // faceIndex : 顔グラフィックインデックス
            $gameMessage.setBackground(type);
                // type : タイプ(0:不透明, 1:透過
                //       (DimmerON), 2:透過(DimmerOFF)
            $gameMessage.setPositionType(positionType));
                // positionType : 位置
                //               (0:上, 1:中央, 2:下)
~~~
3. メッセージの表示

    __$gameMessage.add(msg)__
    で追加する。
    そうするとWindow_Message.update()で上手いこと読み出して表示してくれる。

* 処理の流れ
~~~
    $gameMessage.add(msg)でメッセージデータがセットされる。
        ↓
    Window_Message.update()にて、$gameMessageにデータが入ってる(Window_Message.canStart())判定され、
    Window_Message.startMessage()がコールされる。
        ↓
    Window_Message.startMessage()にてウィンドウが可視化(open)される。
        ↓
    Window_Message.update()毎に処理して表示が行われる。
        ↓
    表示完了または入力受付でメッセージ表示が完了すると、
    Window_Message.terminateMessage()が呼び出されてウィンドウが隠(close())される。

    メッセージ表示完了は $gameMessage.isBusy()を参照する。
~~~

### ・スクリーンサイズの変更

MVだとプラグインでやる必要があったが、MZではデータベースで指定するとそのまま適用できる(らしい)。
やってる場所は下記の通り。いちいちプラグイン導入しなくてもいいね！
~~~javascript
Scene_Boot.prototype.resizeScreen = function() {
    // スクリーンサイズを得る。
    const screenWidth = $dataSystem.advanced.screenWidth;
    const screenHeight = $dataSystem.advanced.screenHeight;
    // 画面リサイズ
    Graphics.resize(screenWidth, screenHeight);
    this.adjustBoxSize();
    this.adjustWindow();
};
~~~

### ・アクターデータの参照方法

アクターIDで持っておいて、
~~~javascript
const actor = $gameActors.actor(id);
~~~
としてアクセスする。

### ・クリティカルエフェクト


* 設定可能なエフェクトは？

クリティカルエフェクトは次のところでやってる。
但しアニメーションは、表示の仕組みが変わってるのでここでやってはいけない。

~~~javascript
Sprite_Damage.prototype.setupCriticalEffect = function() {
    this._flashColor = [255, 0, 0, 160];
    this._flashDuration = 60;
};
~~~


* クリティカルエフェクトでアニメーションを再生するなら？

    MVではstartAnimation()メソッドとか使えたけど、
    MZでそれをやると親子関係が崩れるのでよろしくない。
    じゃあどこでやるのか？
    requestAnimationを使用しているクラスでやるのが望ましい。
    そうすると、Window_BattleLogになってくる。
    以下の場所が該当する。

~~~javascript
Window_BattleLog.prototype.displayCritical = function(target) {
    if (target.result().critical) {
        if (target.isActor()) {
            this.push("addText", TextManager.criticalToActor);
        } else {
            this.push("addText", TextManager.criticalToEnemy);
        }

        // ここでtargetに対してアニメーション表示させるようにすればいい。
    }
};
~~~

### TPを普通のパラメータにしたいなあという時は？

素直にMPみたいな別パラメータ追加した方がいいなあ。
でも容易にやるなら、次の方法が手っ取り早い。変更も少ないしね！

* MZのエディタにて、全てのキャラクターにTP保存のTraitを追加する。
* MZのエディタにて、TP上昇量は0にする。
* アクターの全回復処理にTPも含める。

~~~javascript
Game_BattlerBase.prototype.recoverAll = function() {
    this.clearStates();
    this._hp = this.mhp;
    this._mp = this.mmp;
    // ここにTP回復を追加。
    this._tp = this.maxTp();
};
~~~

* 最大TPを返す処理を追加。

Game_BattlerBase.maxTpのところ。
Game_Actorの場合とGame_Enemyの場合で記述する。
~~~javascript
Game_BattlerBase.prototype.maxTp = function() {
    return 100;
};
~~~

その他TPを扱ってるところ

* 戦闘開始時にTPランダム設定

~~~javascript
Game_Battler.prototype.onBattleStart = function(advantageous) {
    this.setActionState("undecided");
    this.clearMotion();
    this.initTpbChargeTime(advantageous);
    this.initTpbTurn();
    if (!this.isPreserveTp()) {
        this.initTp(); // TPをランダム設定
    }
};
~~~


* 戦闘終了時にTP0リセット

~~~javascript
Game_Battler.prototype.onBattleEnd = function() {
    this.clearResult();
    this.removeBattleStates();
    this.removeAllBuffs();
    this.clearActions();
    if (!this.isPreserveTp()) {
        this.clearTp(); // TPをクリア
    }
    this.appear();
};
~~~

### 新しいシーンにしたとき、前のシーンの画像がぼやけた表示になるのをやめるには？

Scene_MenuBase.createBackgroundでやってる、filtersを空の配列にし、
setBackgroundOpacityを255にする。

~~~javascript
Scene_MenuBase.prototype.createBackground = function() {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter]; // ここを空配列([])にする。
    this.addChild(this._backgroundSprite);
    this.setBackgroundOpacity(192); // これを255に設定する。
};
~~~

特定のシーンだけぼやけないようにするには、Scene_XXX.createの処理で、_backgroundSprite.filtersを空配列にし、setBackgroundOpacity(255)を呼び出すようにすればいい。

~~~javascript
    Scene_MenuBase.prototype.create.call(this);
    this._backgroundSprite.filters = [];
    this.setBackgroundOpacity(255);
~~~