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
/*:ja
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
### ■ プラグインパラメータ

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
||@dir img/faces/ のように親フォルダを指定する。|
||パラメータ名には親フォルダを除いたファイル名が格納される。|
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

    フックするメソッド = function() {
        // 必要な処理
        参照用変数.apply(this, arguments);
        // 必要な処理
    };
      
とする。注意としては、フックでプラグイン処理と内部分岐させる場合、
インポート順によっては他のプラグインが正常に動作しなくなる。


### メソッドのオーバーライト
完全に置きかえる場合。
他のプラグインとの競合に気をつけないといけないパターン。
コメントに「!!!overwrite!!!」とか書いておくのが良いみたい。

~~~javascript
/**
 * 説明ごにょごにょ
 * 
 * !!!overwrite!!!
 */
オーバーライトするメソッド = function() {
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
尚、プラグイン呼び出し元のインタプリタ(Game_Interpreter)にアクセスするには、次のようにする。
~~~javascript
PluginManager.registerCommand("Hoge", "accessToInterpreter", function(args) {
    const interpreter = this;
    const params = [];
    interpreter.commandXXX(params)
});
~~~
ラムダ式で書くと、インスタンスの生成の関係なのか、thisでアクセスできないことに注意が必要。

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
ノートタグ処理はオリジナルのstartより先に処理する方がよさそう。
試した限りでは、オリジナルのstart中でアクターの装備初期化などが呼び出されるため、
後ろに実装するとノートタグを処理しないまま実行されることになってしまう。

~~~javascript
  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {

        /* TODO : ノートタグの処理 */

      _Scene_Boot_start.call(this);
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
既存のデータで、セーブファイル毎に呼び出されるものは以下の通り。

|グローバルシンボル|クラス|補足|
|---|---|---|
|$gameSystem|Game_System|システムデータ|
|$gameScreen|Game_Screen|カラートーンや、ピクチャをどういう状態で表示させているかといった情報|
|$gameTimer|Game_Timer|タイマー|
|$gameSwitches|Game_Switches|スイッチデータ|
|$gameVariables|Game_Variables|変数データ|
|$gameSelfSwitches|Game_SelfSwitches|セルフスイッチデータ|
|$gameActors|Game_Actors|アクターデータ。|
|$gameParty|Game_Party|パーティーデータ。構成するメンバーID、所持金、所持アイテムデータなど|
|$gameMap|Game_Map|現在いるマップのデータ。イベントの位置や一時消去状態など。|
|$gamePlayer|Game_Player|プレイヤーのマップ上の位置やフォロワーの状態など。|

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

尚、独自データに "note" メンバが含まれていると、ちゃんと展開してmetaフィールドに格納されるっぽい。覚えておくと便利。


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

あと、UIはプラグイン側で用意するべきじゃないと思ってる。
面倒でもプラグインを組み合わせて使う側でやる方がよい。
理由は以下の通り
* 複数のプラグインを組み合わせて使うとき、UIはどうしても競合してしまう。
* プラグイン毎のUIだと、統一感のあるUIが提供できない。

例外的に特定のプラグイン開発者のものだけ使うとか、競合しないものを組み合わせて使えばなんとかなる。

__MVからMZに移植する際の変更点__

* ウィンドウを作成する際、 __x,y,width,height__ じゃなくて __Rectangle__ を渡すようになった。


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
|dataId|Number|データID。データベース上のIDだったり、パラメータIDだったりする。|
|value|Number|値。加算したり(traitsSum)、乗算したり(traitsPi)したりするのに使う。|


定義済み特性(Game_BattlerBase.TRAIT_***)

|定義|code値|dataId値|説明|
|---|---|---|---|
|TRAIT_ELEMENT_RATE|11|属性ID|dataIdで指定される属性のダメージレート。|
|TRAIT_DEBUFF_RATE|12|パラメータID|dataIdで指定されるパラメータのデバフ受付率。|
|TRAIT_STATE_RATE|13|ステートID|dataIdで指定されるパラメータのステート受付率。|
|TRAIT_STATE_RESIST|14|ステートID|指定したステートを受け付けない。|
|TRAIT_PARAM|21||基本パラメータ|
|||0|MaxHP|
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
|TRAIT_ATTACK_STATE|32|ステートID|dataIdで指定されるステートを、攻撃時に付与する。|
|TRAIT_ATTACK_SPEED|33|-|value値の加算合計を、攻撃速度補正値として得る。|
|TRAIT_ATTACK_TIMES|34|-|value値の加算合計を、攻撃回数として加算する。単純にリピートされる値となる。|
|TRAIT_ATTACK_SKILL|35|スキルID|攻撃時のスキルIDをdataIdに変更する。複数持っていた場合には、最も高い値が採用される。(MZで新規追加。WeponMasteryプラグインに相当）|
|TRAIT_STYPE_ADD|41|スキルタイプID|dataIdで指定したスキルタイプを追加する。valueは無視されるようだ。dataId=x: スキルタイプ x を追加する。|
|TRAIT_STYPE_SEAL|42|スキルタイプID|dataIdで指定したスキルタイプを封印する。|
|TRAIT_SKILL_ADD|43|スキルID|dataIdで指定したスキルを追加する。|
|TRAIT_SKILL_SEAL|44|スキルタイプID|dataIdで指定したスキルを封印する。|
|TRAIT_EQUIP_WTYPE|51|武器タイプID|dataIdで指定した武器タイプを装備可能にする。|
|TRAIT_EQUIP_ATYPE|52|防具タイプID|dataIdで指定した防具タイプを装備可能にする。|
|TRAIT_EQUIP_LOCK|53|装備スロットタイプ|dataIdで指定した装備をロックする。ロックは装備タイプの装備を変更できない状態。|
|TRAIT_EQUIP_SEAL|54|装備スロットタイプ|dataIdで指定した装備を封印する。封印は装備スロットに装備できない状態。|
|TRAIT_SLOT_TYPE|55|装備タイプ|装備タイプ変更特性。(0:通常, 1:二刀流)|
|TRAIT_ACTION_PLUS|61|-|行動回数追加特性。valueは追加される確率を表す。加算合計じゃなくて、特性を持っている数だけ乱数判定されて、1つずつ加算される仕組み。|
|TRAIT_SPECIAL_FLAG|62|フラグID|特別な機能を提供するためのフラグ。|
|||0|自動戦闘。(Game_BattlerBase.FLAG_ID_AUTO_BATTLE)|
|||1|防御。(Game_BattlerBase.FLAG_GUARD)|
|||2|身代わり。敵対者のアクションに対して、身代わりになる。(Game_BattlerBase.FLAG_ID_SUBSTITUTE,isSubstitute()メソッド)|
|||3|TPが保存されるかどうか。(Game_BattlerBase.FLAG_ID_PRESERVE_TP。isPreserveTp()メソッド。)|
|TRAIT_COLLAPSE_TYPE|63|||
|TRAIT_PARTY_ABILITY|64||パーティーアビリティ。既定の実装はdataIdで指定された値の効果を持っているかどうか、だけの判定に使われる。dataIdはGame_Party.ABILITY_～で定義されてる。|
|||0|ABILITY_ENCOUNTER_HALF。ランダムエンカウント率半減。|
|||1|ABILITY_ENCOUNTER_NONE。ランダムエンカウントでエンカウントしない。|
|||2|ABILITY_CANCEL_SURPRISE|急襲でのエンカウントを防ぐ。|
|||3|ABILITY_RAISE_PREEMPTIVE|先制攻撃率向上。特性を持っていると、基本先制攻撃率に対して4倍になる。|
|||4|ABILITY_GOLD_DOUBLE。戦闘でのゴールド倍率2倍|
|||5|ABILITY_DROP_ITEM_DOUBLE。戦闘でのアイテムドロップレート2倍|

### ■ ダメージタイプ (damage.type) って何？

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

尚、動作を調べるときは値を直接見るのでは無く、Game_Action.isDamage()などのメソッドを使用すること。
 
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
|EFFECT_REMOVE_STATE|22|ステートID|解除率|-|指定されたステートを解除率の確率で解除する。|
|EFFECT_ADD_BUFF|31|パラメータID|適用ターン数|-|指定したパラメータのバフレベルを1段階向上させる。効果期間はvalue1ターン。|
|EFFECT_ADD_DEBUFF|32|パラメータID|適用ターン数|-|指定したパラメータのバフレベルを1段階低下させる。効果期間はvalue1ターン。|
|EFFECT_REMOVE_BUFF|33|パラメータID|-|-|指定したパラメータのバフを取り除く。|
|EFFECT_REMOVE_DEBUFF|34|パラメータID|-|-|指定したパラメータのデバフを取り除く。|
|EFFECT_SPECIAL|41|0|-|-|逃走効果。対象のescape()メソッドを呼び出す。|
|||上記以外|-|-|割り当てなし|
|EFFECT_GROW|42|パラメータID|効果量|-|指定したパラメータを効果量だけ増減させる。|
|EFFECT_LEARN_SKILL|43|スキルID|-|-|指定したスキルを習得させる。（アクターのみ）|
|EFFECT_COMMON_EVENT|44|コモンイベントID|-|-|指定したコモンイベントを実行欄に積む。|

独自の効果を追加するなら、以下はフックする必要があるかもしれない。
但し、下記のメソッドはいずれもアイテム/スキルを使用した結果を反映するものになる。
使用する前に使用対象を別途選択したい場合には不足である。

* __Game_Action.applyGlobal()__

        対象が無い/指定しない効果を適用する処理。
        コモンイベントの呼び出し予約はここでやっている。

* __Game_Action.testItemEffect()__

        効果を指定された対象に適用可能かどうかを判定する処理。
        常に適用可能ならばフックする必要は無い。
        HPが減っていない対象には使用出来ないようにする判定などが含まれる。
        アイテム/スキルの対象が「無し」の場合には呼び出されない。
 
* __Game_Action.applyItemEffect()__

        効果を指定された対象に適用する処理。
        switch - caseのお化け。
        独自の処理を実装したら、Game_Action.makeSuccess(target)をコールして、
        効果があったよ設定しておこう。
        やらないと、バトルログに「効果が無かった」と出力される。
        アイテム/スキルの対象が「無し」の場合には呼び出されない。

### 使用可否判定について

アイテムまたはスキルを使用可能かどうかを判定する処理は以下のようになっている。

Window_ItemList.prototype.isEnabled
-> Game_Party.canUse(item)
-> Game_BattlerBase.canUse(item)
-> Game_BattlerBase.meetsSkillConditions または Game_BattlerBase.meetsItemConditions

スキルの場合

    Game_BattlerBase.meetsUsableItemConditions(skill)
        使用可能な状態か。
    Game_BattlerBase.isSkillWtypeOk(skill)
        スキル使用に必要な武器タイプの条件は満たされているか
    Game_BattlerBase.canPaySkillCost(skill)
        スキルコストを支払える状態か。
    !Game_BattlerBase.isSkillSealed(skill.id)
        スキルは禁止されていない。
    !Game_BattlerBase.isSkillTypeSealed(skill.stypeId)
        スキルタイプは禁止されていない。


アイテムの場合
        
    Game_BattlerBase.meetsUsableItemConditions(item)
        使用可能な状態か
    $gameParty.hasItem(item)
        残数があるか。

共通の判定

    Game_BattlerBase.meetsUsableItemConditions
        使用者が動ける(canMove) かつ、 使用機会(メニュー画面/戦闘中/いつでも)が適合する(isOccasionOk)
        
なんかスペシャルな効果を判定したいならば？
    Game_Actorに実装されている、逃走アイテム/スキルの使用条件テストが参考になる。
    1つのアイテム/スキルに複数効果がある場合の判定には使えない点に注意。

    Game_Actor.prototype.meetsUsableItemConditions = function(item) {
        if ($gameParty.inBattle()) {
            if (!BattleManager.canEscape() && this.testEscape(item)) {
                return false;
            }
        }
        return Game_BattlerBase.prototype.meetsUsableItemConditions.call(
            this,
            item
        );
    };


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

SceneManager.pop (Scene_Base.popScene()) を呼ぶと、スタックから呼び出したScnee_Classに対してSceneManager.goto()が呼ばれる。
インスタンス化されているシーンは常に1つだけということに注意。
push()後、pop()したからといって、 __同じインスタンスに戻ってくることはない__ 。
だからシーンのメンバに状態を記録しておくことはできない！！！
prepareが必要なシーンに戻るとprepareはコールされないはずなので、問題が発生するかもしれない。
シーンからシーンの呼び出しをやろうとしていたら、この点に留意すること。
場合によっては $gameTemp などを介してデータの受け渡しをしなければならない。


### ■ 色

MZではColorManagerが色の管理をしている。文字の描画色などで使うのもこれ。
扱っている色はCSSの色文字列('#RRGGBB')でやりとりされる。

例えば白(255,255,255)は '#ffffff'、赤(255,0,0)は'#ff0000',緑(0,255,0)は '#00ff00', 青(0,0,255)は '#0000ff' になる。


### ■ BattleManager と Window_BattleLog

基本的にはBattleManagerが戦闘システムの全体の流れを制御して、
Window_BattleLogにその表示についての処理が実装されている形。
アニメーション再生をWndow_BattleLogに入れてるのは、
フロントエンド側はWindowクラス、という設計思想なのか？

BattleManagerは_logWindow（Window_BattleLogのインスタンス)を使用してメソッドを呼び出す。
ちょっと調べた限り、クリティカル時に表示するアニメーションを切り替えるには、
BattleManager側も変えないとむりぽだった。
(updateTurn()にて使用アニメーション、updateActionにて結果表示。applyはupdateActionにて使用されるため、使用アニメーションの段階ではクリティカルになるかどうかわからん。戦闘システムカスタマイズすればいいんだけど。)

### メニュー系

プラグインで独自のシーンを作る場合、まず、Scene_Baseを使うか、Scene_MenuBaseを使うかで分かれる。
Scene_Baseはタイトル画面など、背景に表示するスプライトから全部用意する場合に使用する。
Scene_MenuBaseは、シーンの背景として前のシーンのキャプチャ画像を使用し、かつ入力キャンセルボタンなど、
メニュー操作が絡んでくる場合に使用するときに使うと良い。

尚既定の実装では背景として、前のシーンにジャギーをかけたような画像を使用している。
これを止めるには、Scene_MenuBaseのcreateBackgroundの一部を変更すればいい。

~~~javascript
Scene_MenuBase.prototype.createBackground = function() {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    //this._backgroundSprite.filters = [this._backgroundFilter];
    this._backgroundSprite.filters = []; // フィルタなし。
    this.addChild(this._backgroundSprite);
    //this.setBackgroundOpacity(192);
    this.setBackgroundOpacity(255);
};
~~~
フックしてfiltersとsetBackgroundOpacity(255)として可。
見て分かるとおり、_backgroundSprite.bitmapに任意の画像を設定すれば、背景を変更することができる。
メニューの背景を可愛いうさぎさんにする事も出来るというわけだ。

尚、既定の実装ではScene_MenuBaseを使うとキャンセルボタンも作ってくれる。
派生した先で不要だと感じたら、 __needsCancelButton__ を実装してfalseを返せば良い。
~~~javascript
/**
 * キャンセルボタンが必要かどうかを取得する。
 * @return {Boolean} 必要な場合にはtrue, それ以外はfalse
 */
Scene_Hogehoge.prototype.needsCancelButton = function() {
    return false; // キャンセルボタンは要らない
};
~~~

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
    addLoadListener()はあまりよろしくないらしい。Spriteの読み出し処理が阻害されるっぽい。

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

### メッセージのエスケープシーケンスの処理

ベーシックシステムのエスケープシーケンスは以下の部分で処理されている。

* __Window_Base.convertEscapeCharacters(text)__   
__\\, \V, \N, \P, \G__ のエスケープキャラクタを処理する。
エスケープシーケンス自体は重ねることができる。例えば __\N[\V[12]]__ などとすると変数12番目に格納されている値のアクターIDの名前に展開される。ただし、展開優先順序が存在し、\\ -> \V -> \N -> \P -> \G の順番に展開される。
\V は2回まで展開される。変数の指す先の変数みたいなのはできるが、変数の指す先の変数の指す先の変数(\V[\V[\V[x]]]のようなもの)はできないということ。
メッセージ表示を開始する前に処理される。

* __Window_Base.processEscapeCharacter(code,textState)__    
__\C, \I, \PX, \PY, \FS, \{, \}__ のエスケープキャラクタを処理する。

* __Window_Message.processEscapeCharacter(code,textState)__    
__\$, \., \|, \!, \>, \<, \^__ のエスケープキャラクタを処理する。


拡張するなら、上記を拡張する。processEscapeCharacterは、基本的に文字への置き換えを伴わないものを処理する。
文字への置き換えが必要なものは、convertEscapeCharactersをフックして機能を実装する。

エスケープシーケンス一覧

|||
|---|---|
|\V[ __N__ ]|__N__ で指定される変数の値を挿入する。|
|\N[ __N__ ]|__N__ で指定されるアクターの名前を挿入する。 __N__ はアクターID。|
|\P[ __N__ ]|__N__ で指定される並び位置のパーティーメンバーの名前を挿入する。|
|\G|通貨単位を挿入する。|
|\C[ __N__ ]|__N__ で指定される色で描画するように指定する。|
|\I[ __N__ ]|__N__ で指定されるアイコンを描画する。|
|\{[ __N__ ]|文字サイズを1段階大きくする。|
|\}[ __N__ ]|文字サイズを1段階小さくする。|
|\FS[ __N__ ]|__N__ で指定される文字サイズに変更する。|
|\PX[ __N__ ]|ウィンドウの左上を原点として、水平方向描画位置を __N__ で指定される位置に変更する。|
|\PY[ __N__ ]|ウィンドウの左上を原点として、垂直咆哮描画位置を __N__ で指定される位置に変更する。|
|\\|バックスラッシュを挿入する。|
|\$|所持金のウィンドウを開く。|
|\.|0.25秒待つ。|
|\||1秒待つ。|
|\>|同じ行の残りの文字を一度に表示する。|
|\<|文字を一瞬で表示する効果を取り消す。\>と併せて使う。|
|\^|文字表示後、入力待ちをしない。|

* textState オブジェクト

~~~javascript
textState = {
    text : 'メッセージ', // {string} エディタで入力したメッセージ欄の文字列のうち、\Nなど文字列への置換が済んだもの。
    index : 0, // {number} text上の出力位置インデックス。次にindexで指定されたメッセージ文字を処理する。
    x : 0, // {number} 次の描画位置X。単位はピクセル。
    y : 0, // {number} 次の描画位置Y。単位はピクセル。
    width : 0, // {number} 描画可能範囲の幅。制限しない場合は0。オーバーした部分は見切れる。
    height : 36, //{number} テキストの高さ
    startX : 0, // {number} 現在の描画開始位置X。単位はピクセル。
    startY : 0, // {number} 現在の描画開始位置Y。単位はピクセル。
    rtl : false, // {boolean} テキストを右から左へ描画する場合はtrue, それ以外はfalse.
    buffer : '',// {string} 書き出す文字列。右から左への描画する場合、先頭に U+202B: RIGHT-TO-LEFT EMBEDDING が付与されている。
    drawing : true, //{boolean} 描画するかどうか
    outputWidth : 0, // {number} 出力幅。(テキスト出力処理で計算した値が格納される)
    outputHeight : 0, // {number} 出力高さ。(テキスト出力処理で計算した値が格納される)

};
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

### TPB処理について

    (1) 戦闘開始直後
    |   _tpbState は "charging" に設定される。
    |   _tpbChageTime は 有利な状態であれば 1.0 、それ以外は tpbRelativeSpeed()の
    |   0.0～0.5の範囲に設定される。
    |   _tpbIdleTime は0に設定される。
    |   
    (2) updateTpb()によるチャージ
    |   _tpbChargeTime は tpbAcceleration()だけ加算されていく。
    |   _tpbCastTimeは加算なし。
    |   _tpbChargeTime が 1.0 以上になると、_tpbState が "charged" に設定される。
    |   _tpbIdleTime は 0 に設定される。
    |   自動戦闘の場合には、ここでアクションが決定される。
    |   "charged"になると、TPBターン終了処理 (Game_Battler.onTpbTurnEnd) が行われ、
    |   ターン経過によるステート解除などが処理される。
    |
    (3) コマンド入力実施
    |   アクティブ設定の場合には スキル/アイテムウィンドウを開いている時以外はTPBの更新が進む。
    |   それ以外は、入力中TPBの更新は行われない。
    |   コマンド入力が完了すると、startTpbCasting() にて、
    |   _tpbState が "casting" に設定され、 _tpbCastTime が0にセットされる。
    |   
    (4) updateTpb()によるチャージ
    |   _tpbChargeTime は更新されない。
    |   _tpbCastTime は tpbAcceleration()だけ加算されていく。
    |   _tpbCastTime が tpbRequiredCastTime() 以上になると、_tpbState が "ready" に設定される。
    |
    (5) BattleManager.updateTpbBattlerにてアクション発動
    ｜  準備ができたアクションが順次実行される。
    |
    (6) アクション終了
    |   BattleManager.endBattlerActions() から Game_Battler.clearTpbChargeTime() が呼び出される。
    |   _tpbState は "charging" に設定される。
    |   _tpbChargeTime は 0 に設定される。
    |   次は(2)へ。

    動けない時
    (2) updateTpb()によるチャージ
    |   動けない状態でかつ _tpbState が "charged" の場合、
    |   _tpbIdleTime が tpbAcceleration()だけ加算されていく。
    |
    (3) 動けない状態での時間経過検出
    |   Game_Battler.isTpbTimeout() でタイムアウト(_tpbIdleTime が 1.0以上)を検出すると
    |   Game_Battler.onTpbTimeout()が呼び出され、行動後ステートの解除などが行われる。
    |   _tpbIdleTime は 0に設定される。
    |   続けてTPBターン終了処理 (Game_Battler.onTpbTurnEnd) が行われ、
    |   ターン経過によるステート解除などが処理される。
    



Game_Battler.updateTpb()で処理される。TPB関連のパラメータとしては以下3つが使用される。
* _tpbChageTime - TPBステートがchargingの時に更新される。
_tpbChageTimeが1.0以上になるとTPBステートがchangedになる。
加算量はTPB相対速度(tpbRelativeSpeed)。
* _tpbCastTime - TPBステートがcastingの時に更新される。
_tpbCastTimeがスキルなどの要求キャストタイム以上になると、TPBステートがreadyになる。
加算量はTPB相対速度(tpbRelativeSpeed)。
* _tpbIdleTime - TPBステートがcharging以外の時に更新される。
onTpbTimeout()がコールされて0になる。
加算量はTPB相対速度(tpbRelativeSpeed)。用途がよくわからん。

ベーシックシステムでのTPB計算

TPB速度(tpbSpeed) : Sqrt(AGI) + 1
TPBベース速度(tpbBaseSpeed) : 
パーティーのTPBベース速度 : パーティー中、TPBベース速度。
TPB相対速度(tpbRelativeSpeed) : TPB速度(tpbSpeed) / リファレンスタイム

リファレンスタイムはGame_Unit.tpbReferenceTimeで定義されている。
大きくすると、時間経過がゆっくりになる。
データベースで設定できないのはいかがなものか。
~~~javascript
Game_Unit.prototype.tpbReferenceTime = function() {
    return BattleManager.isActiveTpb() ? 240 : 60;
};
~~~

キャストタイム
アイテム/スキルで指定したSPEED(データベース上は負数)に対して以下の計算。
キャストタイム = Sqrt(Speed) / TPB速度

~~~javascript
Game_Battler.prototype.tpbRequiredCastTime = function() {
    const actions = this._actions.filter(action => action.isValid());
    const items = actions.map(action => action.item());
    const delay = items.reduce((r, item) => r + Math.max(0, -item.speed), 0);
    return Math.sqrt(delay) / this.tpbSpeed();
};
~~~
TPB速度の計算式にあるとおり、ベーシックシステムではAGIが高いほどキャスト時間が早くなる。

### BattleManagerのステート

戦闘処理はBattleManagerで流れを制御している。
まず __BattleManager.setup()__ がコールされ、処理の準備が開始される。
その後は Scene_Battle から __BattleManager.update()__ がコールされ、
戦闘のフローが動く仕組みになっている。

BattleManagerのインタフェース呼び出し順

1. BattleManager.setup() - 戦闘開始準備。Scene_Battleの外から呼ばれる。
2. BattleManager.onEncounter() - 必要時、エンカウント時の処理。Scene_Battleの外から呼ばれる。この後SceneManager.push(Scene_Battle)でScene_Battleが開始される。   
3. BattleManager.playBattleBgm() - Scene_Battle.start()から呼ばれる。
4. BattleManager.startBattle() - Scene_Battle.start()から呼ばれる。
5. 1. BattleManager.update() - Scene_Battle.updateBattleProcess()から呼ばれる。

5. 2. BattleManager.processEscape() - 逃走操作が行われたとき、Scene_Battleから呼ばれる。
5. 3. BattleManager.selectNextCommand() - コマンドが確定したとき、次のコマンド選択をするためにScene_Battleから呼ばれる。
5. 4. BattleManager.selectPreviousCommand() - コマンドをキャンセル操作したとき、前のコマンドを再選択するために、Scene_Battleから呼ばれる。

update()は複雑。処理を追うにはコールグラフを作らないとわからない。

    update()
      +- updateEvent()
      |   +- processForcedAction()
      |   +- updateEventMain() - イベント処理の更新と、実行可能イベントがあれば準備をする。
      |   +- checkAbort() - 中断終了確認
      |       +- processAbort() - 中断終了処理
      |            +- replayBgmAndBgs()
      |            +- endBattle(1)
      +- updatePhase() - フェーズ更新処理
      |   +- updaetStart() - "start"時の更新処理。TPB時は"turn"に遷移させる。
      |   |   +- startInput() - "input"フェーズをセットする。
      |   |       +- startTurn() - "turn"に遷移させる。
      |   |           +- makeActionOrders()
      |   +- updateTurn()
      |   +- updateAction()
      |   +- updateTurnEnd()
      |   +- updateBattleEnd()
      +- updateTpbInput()






#### TPB時のフェーズ遷移

BattleManager.startBattle() にて __start__ から開始

* __start__ - BattleManager.updateStart()

    __turn__ に遷移する。

* __turn__ - BattleManager.updateTurn()

* __action__ - BattleManager.updateAction()

* __turnEnd__ - BattleManager.updateTurnEnd()

* __battleEnd__ - BattleManager.updateBattleEnd()



#### 非TPB時のフェーズ遷移

BattleManager.startBattle() にて __start__ から開始

* __start__ - BattleManager.updateStart()

    __input__ に遷移させるが、コマンド入力可能なアクターがいない場合、すぐにstartTurn()をコールして __turn__ フェーズに遷移する。

* __turn__ - BattleManager.updateTurn()

* __action__ - BattleManager.updateAction()

* __turnEnd__ - BattleManager.updateTurnEnd()

* __battleEnd__ - BattleManager.updateBattleEnd()

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

### Sprite作って文字を描画したいなら？

まずSpriteを作る。このとき寸法に注意。

~~~javascript
const fontFace = フォント名;
const fontSize = フォントサイズ;
const width = 幅;
const height = 高さ;
const textColor = 色;
const sprite = new Sprite();
sprite.bitmap = new Bitmap(width, height);
sprite.bitmap.fontFace = fontFace;
sprite.bitmap.fontSize = fontSize;
sprite.bitmap.textColor = textColor;
sprite.x = 位置x;
sprite.y = 位置y;
~~~

作成したSpriteはシーンに追加しておくこと。
さもないとdestroyしてくれないはず。
あとは、 __bitmap.drawText()__ で描画して終わり。

### Spriteの大きさを変えるには？

__Sprite.scale.x__ と __Sprite.scle.y__ を変更すればいいみたい。
例えばエネミーをでっかくするなら．．．．。

~~~javascript
    Sprite_Enemy.prototype.updateBitmap = function() {
        Sprite_Enemy_updateBitmap.call(this, ...arguments);

        this.scale.x = 2;
        this.scale.y = 2;
    };    
~~~

とはいえ、ベーシックシステムでscaleを使ってるかもしれないから、安易にscaleパラメータを変えるのはまずい。

### 新しいパラメータを追加して挙動を制御したいんだけど？

例えばゴールド取得倍率を2倍固定じゃなくて、0.20％増しとか0.40％増しとかやりたい場合。
新しいTraitとコードを定義するしよう。
このとき、他のプラグインを使ってるならば、競合に注意すること。

### 属性の扱いについて

属性は基本的にID値だけで扱われます。
そこにはNotetagみたいな素敵要素はなく、例えば物理属性だとか魔法属性だとか識別するすべは用意されてない。プラグイン側でやりたかったら、プラグインパラメータとして指定して渡してもらう。

### 入力操作各種

#### ゲームパッド/キーボード入力操作

Input を使う。
Input.isRepatedで入力操作を受け取る。

|文字列|Keyboard|GamePad|補足|
|---|---|---|---|
|"tab"|TAB|||
|"ok"|Enter/Space/Z|Button A||
|"shift"|Shift|Button X||
|"control"|Control/Alt|||
|"escape"|ESC/INS/X/0|||
|"cancel"||Button B|||
|"pageup"|PageUp/Q|Button LB||
|"pagedown"|PageDown/W|Button RB||
|"left"|左矢印/4|Button Left||
|"up"|上矢印/8|Button Up||
|"right"|右矢印/6|Button Right||
|"down"|下矢印/2|Button Down||
|"menu"||Button Y|||
|"debug"|F9|||

#### タッチ操作

TouchInput を使う。
但しタッチ対象がどれか、とかはSprite_Clickable経由で取得する仕組みになっている。
TouchInput.isCanceled でキャンセル操作入力検出。
タッチ対象は Sprite_Clickable 経由で選択検出処理に渡るようになっている。

1. Sprite_Clickable でタッチ検出
2. $gameTemp.setTouchState でタッチ状態保存
3. 選択処理(Window_xxxxなど)のupdate()にて、タッチ対象を選択対象として取得

タッチ用のキャッシュデータは TouchInput.clearTouchState を使用する。

Sprite_Clickableを派生してボタンとか作るならば、setFrameでSpriteのタッチ領域を設定すること。

#### マウス操作
基本的にタッチ操作と同じ。

### 行動制限値

混乱や魅了、麻痺などの行動制限は Game_BattlerBase.restriction()で返す値により挙動を制御している。
基本的に DataState.ristriction の最大値を返すようになっている。

|値|意味|
|---|---|
|0|制限なし|
|1|敵を攻撃(バーサクなど)|
|2|誰かを攻撃(混乱など)|
|3|味方を攻撃(魅了など)|
|4|行動不能(麻痺など)|

### いろいろなGame_BattlerBaseの変化に対応するメソッド調査

全回復 -> recoverAll
アクター初期化 -> setup -> initEquips -> refresh
                       -> recoverAll
エネミー初期化 -> setup -> recoverAll

HPダメージやHP回復 -> gainHp -> setHp -> refresh
MPダメージやMP回復 -> gainMp -> setMp -> refresh
TP初期化 -> initTp -> setTp -> refresh
TP増減 -> gainTp -> setTp -> refresh
チャージによるTP増減 gainSilentTp -> setTp -> refresh
TPクリア -> clearTp -> setTp -> refresh
ステート付与 -> addState -> refresh
ステート削除 -> removeState -> refresh
装備変更 -> changeEquip -> refresh
クラス変更 -> changeClass -> refresh 
コマンドによるレベルアップ -> changeLevel -> changeExp -> refresh
経験値増減 -> changeExp -> refresh
バフ付与 -> addBuff -> refresh
デバフ付与 -> addDebuff -> refresh
アイテムによるパラメータ増減 -> addParam -> refresh


### 装備スロット管理はでんじゃらす

装備スロット管理はデンジャラス（危険）である。
ベーシックシステムでは __TRAIT_SLOT_TYPE__ で実現しているのだが、
これは武器にも持たせられる。
例えば武器に __TRAIT_SLOT_TYPE__ を持たせた状態で、
その武器を変更したらどうなるかを考えよう。とても複雑なことになる。

装備変更をすると、 __refresh()__ が呼び出され、その中で装備解除処理が発生する。




### PIXIのフィルタソースはどこにあるのか？

GitHubにある。

https://github.com/pixijs

### スナップショットを撮るには

SceneManager.snap()を呼ぶ。Bitmapオブジェクトが返る。
返ってきたBitmapオブジェクトは使い終わったらdestroy()をコールして破棄する事。

### 画像リソースの管理とかは？

ImageManagerのインタフェースで呼び出す分には、destroy()をコールしなくて良いみたい。
呼び出したシーンとセットで管理されていて、シーン完了時に不要リソースの破棄がうまいこと行われる。
それ以外は自分でdestroy()をコールしないといけない。


### エンカウントの処理は？

ランダムエンカウントはScene_Mapから __Game_Player.executeEncounter__ で準備されたあと、 __SceneManager.push(Scene_Battle)__ でシーンが切り替わる。
__Game_Player.executeEncounter__ 内で、 __BattleManager.setup()__ 及び 
__BattleManager.onEncounter()__ が実行され、 Preemptive(有利開始) と Surprise(不利開始） が設定される。
スクリプトからのイベント戦闘は __Game_Interpreter.command301__ から __BattleManager.setup()__ 及び __BattleManager.setEventCallback(__ が呼ばれた後、__SceneManager.push(Scene_Battle)__ でシーンが切り替わる。


### インタプリタの実行周り

※インタプリタを実行するには、少なくともSecene_Messageで定義されるようなメンバのウィンドウを用意する必要がある。
データの流れについては後で記載する。

一番簡単な実装例は __Game_CommonEvent__ の実装を見ると良い。
__Game_CommonEvent.refresh__ で　__Game_Interpreter__ のインスタンスを生成する。
生成したインスタンスに __Game_Interpreter.setup()__ を実行し、コモンイベントのリストを渡す。
その後 __Game_CommonEvent.update()__ によって __Game_Interpreter.update()__ が呼び出され、
スクリプトが実行更新される。

データの流れ： これは結構複雑。

メッセージ表示の場合

    1. Game_Interpreter → $gameMessage
    2. Window_Message.update() にて $gameMessageからデータを取り出す。
    3. Window_Messageで表示される。

選択肢の場合

    1. Game_Interpreter -> $gameMessage (__Game_Interpreter.setupChoices__ で $gameMessageのチョイスパラメータが設定される)
    2. ウェイトモードが"message"になる。
       "message"の場合、Game_Interpreterがビジーかどうかの判定にて、$gameMessage.isBusy()を使うようになる。
       $gameMessage.isBusyは、チョイスパラメータを持っている場合にbusyを返す(isChoice()メソッド, 他にもtrueを返すケースはある)。
    3. Window_Message.prototype.startInput()にて、$gameMessage.isChoice()判定がtrueを返すことにより、
       Window_ChoiceList.start()が呼び出され、選択肢ウィンドウが有効化される。
    4. OK操作されると、Window_ChoiceList.callOkHandler が呼び出され、
       この中で$gameMessage.onChoiceが呼び出される。
       ※キャンセル時は Window_ChoiceList.callCancelHandler が呼び出され、同様に$gameMessage.onChoiceが呼び出される。
       onChoice自体は、$gameMessageの_choiceCallbackを呼び出すだけである。
       そのあと、Window_ChoiceListに関連付けされたWindow_MessageのterminateMessage()が呼び出される。
       この中で$gameMessage.clear()が呼び出され、選択肢がクリアされる。
    5. Game_Interpreterにて、isChoice()を含め、ビジー要因がクリアされると、ウェイトモードはクリアされる。
    6. インタプリタが次のコマンドを実行する。

Scene_MessageとGame_Message、Game_Interpreterを使えば独自シーンでコモンイベントを処理することも出来そう。

### フェードイン/フェードアウトについて

フェードイン：黒から表示
フェードアウト：表示から黒
ベーシックシステムでは大別して2つのフェードがある。シーンを対象にしたフェードイン、フェードアウトと、画面の一部に対するフェードイン/フェードアウト処理である。
前者はシーンの切り替わり目（タイトル表示、場所移動、戦闘開始、戦闘終了）で行われるのに対し、後者はイベントコマンドによる操作で行われる。

__(a). 場所移動のフェードイン/フェードアウト__

Game_Interpreter.command201 (マップ移動)により実行されるもの。  

Scene_Map.fedeOutForTransfer と Scene_Map.fadeInTransfer により開始制御され、ColorFilter.blendcolor により動作する。Sceneの_colorFilter(カラーフィルタ)が対象になるため、全ての表示物が対象になる。

処理の流れ

(a-1) $gamePlayer.reserveTransfer() により、指定された場所移動処理がセットされる。
reserveTransfer() が呼ばれると、 $gamePlayer.isTransferring() が true を返すようになる。

(a-2) Scene_Map にて、 Scene_Map.updateTransferPlayer -> SceneManager.stop -> Scene_Map.stop() -> Scene_Map.fadeOutForTransfer -> Scene_Base.startFadeOut となり、フェードアウトがセットされる。

(a-3) フェードアウトするのを待つ。(Scene_Base.isBusy() -> Scene_Base.isFading()により遷移がブロックされる。)。画面をフェードアウトさせる処理は Scene_Base.updateColorFilter により、ColorFilter.blendColorの更新が行われることで実現する。

(a-4) Scene_Map.start -> Scene_Map.fadeInForTransfer によりフェードインする。

__(b). 戦闘開始時のフェードイン・フェードアウト__

Scene_Map で次のシーンが Scene_Battle であることを検出されたとき、Scene_Battleへの遷移の一環で実行されるもの。
Scene_Map.updateEncounterEffectで Scene_Map.startFadeOutによりフェードアウト開始制御される。つまり、フェード具合としては Scene_base..startFadeOutで、(a)と同じ。
Scene_Battle.startFadeInにより、フェードイン開始制御される。
そのため、フェードの表示は(a)と同じである。

処理の流れ

(b-1) Scene_Map.launchBattle から SceneMap.startEncounterEffectが呼ばれる。
(b-2) Scene_Map.updateEncounterEffect にて、エフェクト処理の半分が経過したとき、Scene_Map.startFadeOut が呼ばれて、フェードアウト処理が行われる。
※その他のエンカウントエフェクト(フラッシュとズーム)は Scene_Map.startEncounterEffect 及び SceneMap.updateEncounterEffect を参照。
(b-3) フェードアウトが完了するまで待つ。 (Scene_base.isBusy() がtrueを返すので待つ。)
(b-4) Scene_Battle.start にて Scene_Base.startFadeIn が呼び出され、フェードインする。

__(c). ユーザー(インタプリタのイベントコマンド)によるフェードイン/フェードアウト__

Game_Interpreter.command221 (フェードアウト)及び Game_Interpreter.command222 (フェードイン)により実行されるもの。
$gameScreen.startFadeOut() 及び $gameScreen.startFadeIn() により開始制御され、 ColorFilter.setBrightness() により動作する。Spritesetが対象になるため、Spritesetに含まれるものだけが対象にになる（メニューボタンなどは対象にならない）。
尚、戦闘開始時にフェード状態はクリアされる。
フェード対象はマップチップやキャラクターのスプライト。ウィンドウはフェードされない。
画面をフェードアウトさせて、「そして～はいなくなった」みたいなモノローグを出したい場合などに使う。
ベーシックシステムでは、Spriteset_Map, Spriteset_Battleでのみ使われている。

処理の流れ

(c-1) command221/command222から  $gameScreen.startFadeOut/$gameScreen.startFadeInが呼び出される。フェード完了待ち指定が入っている場合、ウェイトで指定フレーム数が実行される。

(c-2) $gameScreen.updateFadeOut/$gameScreen.updateFadeOutにより、フェード値としてのbrightnessが更新される（$gameScreen.brightness()が変わる） 。

(c-3) Spriteset.updateOverallFilters が$gameScreen.brightness() を参照し、Spritesetが持つ _overallColorFilter.setBrightness()が呼び出され、フェード具合が反映される。



### 場所移動処理について

タイムスライスされているのでわかりにくいが、少し整理すると次のようになっている。

    1. （マップの）インタプリタから場所移動処理が呼ばれる。
    2. $gamePlayerに場所移動要求が保存される。
    3. （マップの）インタプリタはtransferウェイト状態になり、次のコマンドは実行されない。
    4. Scene_Mapで$gamePlayerに保存された場所移動要求を検出する。
    5. Scene_Map.stop()にてフェードアウトが設定される
    6. フェードアウト処理中はビジーが継続するためマップ移動しない。
       ※Scene_Base.isBusy -> Scene_Base.isFade()
    7. Scene_Map.create()にて、$gamePlayerの転送情報がセットされていることにより、
       onTransfer()がコールされる。
    8. SceneManagerにより、Scene_Map.isReady()が呼ばれる。
       isReady()の中で$gamePlayerの転送要求フラグが立っている場合、
       $gamePlayer.performTransfer()を呼び出す。
    9. performTransfer内でマップのロード(マップが変わる場合)や$gamePlayerの場所移動が行われる。
    10．Scene_Map.start()にて、フェードイン要求及びonTransfeRend()がコールされる。
       startにフェードインが処理が入っているため、フェードアウト中はupdate()がコールされない(=インタプリタは止まっている)
       また、オートセーブ機能が有効だった場合、このタイミングでオートセーブ要求が発行される。
    11. transferウェイトが解除され、(マップの)インタプリタが処理を継続する。

そのため、フェードアウト中にコモンイベントを呼び出して実行しようとすると、結構厄介である。

マップがロードされたときの処理を追加・変更したい場合
    -> Game_Map.setupをフック。
アクターが移動しているときにフラグをクリアなど(同マップ/他のマップに関わらず)
    -> Game_Player.performTransferをフック。
    -> Scene_Map.onTransferをフック。(リソースの開放や設定のクリアなどはこちら？)
    

### プレイ時間を得るには？

Game_System.playtime()で秒数が得られる。
但し本メソッドで経過時間を得た場合、誤差が最大で±118フレーム発生する。

フレーム単位で正確な値を得たいならば、Graphics.frameCountを使用する。
カウンタのオーバーフローを心配したくなるが、
Javascriptの整数表現最大値(Number.MAX_SAFE_INTEGER)で表現されたとすると、
通算で285,616,414年以上持つみたいなので現実的な面で問題ない。
但しこのカウンタはシーンが非アクティブだろうと歩進する。

インタプリタで操作するタイマーは？
  所定の時間が経過するまで歩進するタイマー。
  Scene_MapとScene_Battleでのみ歩進する。
  ・シーン準備中は歩進しない。
  ・他のシーン(メニューを開いている間など)も歩進しません。

### グローバルオブジェクトへの参照関係調査



$gameParty 

    <- Game_BattlerBase
    <- Game_Battler
    <- Game_Action
    <- Game_Actor
    <- Game_Enemy
    <- Game_Follower
    <- Game_Followers
    <- Game_Event
    <- Game_Interpreter

    <- $gameTroop
    <- $gamePlayer
    <- $gameTemp
    <- $gameScreen

    -> $gameActors

# Spriteset_Battleの中身

  Spriteset_Base
    +- createLowerLayer()
    |   +- createBaseSprite
    +- createUpperLayer()
        +- createPictures
        +- createTimer
        +- createOverallFilters

  Spriteset_Battle
    +- _baseSprite
       +- _backgroundSprite 前のシーン（普通はMap)のキャプチャ画像
       +- _back1Sprite 背景1スプライト
       +- _back2Sprite 背景2スプライト
       +- _battleField === _effectsContainer
           +- Sprite_Enemy エネミー画像スプライト
           +- Sprite_Actor (SideViewのみ)サイドビューアクター
           +- Sprite_Animation アニメーション描画スプライト（アニメーション開始毎に追加）
    +- _backScreen

# ダメージポップアップの仕組みは？

    BattleManager.invoke～() // 通常攻撃、カウンター、魔法反射
        ↓
    Window_BattleLog.displayActionResults() // 行動結果を表示
        ↓
    Window_BattleLog.prototype.popupDamage()
        ↓
    Game_Battler.prototype.startDamagePopup() // ダメージポップアップ要求

        
    Sprite_Battler.updateDamagePopup()
    Game_Battler.isDamagePopupRequested() // trueを返すと、ポップアップ処理開始
        ↓
    Sprite_Battler.setupDamagePopup() // ダメージポップアップ準備する。
        ↓
    Sprite_Damage.create()
    Sprite_Damage.setup() // ダメージポップアップの準備
    Game_Battler.clearDamagePopup() // ダメージポップアップ要求クリア

    以後、
    Sprite_Damage.update() // 更新

    ダメージポップアップ要求を出すだけならば、Game_Battler.startDamagePopup()を呼べば良い。
 
    
    ターン終了・アクション終了時
    BattleManager.displayBattlerStatus()
        ↓
    Window_BattleLog.prototype.displayRegeneration()
        
# DataEnemyAction

~~~javascript

エネミーアクションのエントリは次のようになっている。
{
    conditionParam1; // {number} 条件パラメータ1
    conditionParam2; // {number} 条件パラメータ2
    conditionType; // {number} 条件タイプ
    rating // {number} レート(リスト上最も高いレートから3つ以上低いものは除外される。)
    skillId // {number} スキルID
}
~~~


|条件タイプ|名前|条件パラメータ1|条件パラメータ2|説明|
|---|---|---|---|---|
|0|条件なし|-|-|ratingを元に、常に選択候補になる。|
|1|ターン条件|経過ターン数|ターン間隔|経過ターン数後、ターン間隔毎に選択候補になる。|
|2|HP条件|下限割合|上限割合|現在HPの割合が下限～上限の範囲の時、選択候補になる。|
|3|MP条件|下限割合|上限割合|現在MPの割合が下限～上限の範囲の時、選択候補になる。|
|4|ステート条件|ステートID|-|ステートIDが付与されているとき、選択候補になる。|
|5|パーティーレベル条件|レベル|-|パーティーメンバーの最大レベルが指定値以上のとき、選択候補になる。|
|6|スイッチ条件|スイッチID|-|指定スイッチがONのとき、選択候補になる。|

# イベントのページ適用判定は？

__Game_Event.meetsConditions(page : DataPage)__ が適用判定。
__Game_Event.refresh()__ がコールされたとき、 __Game_Event.findProperPageIndex()__ にて一番最後のページから順にmeetsConditionsがコールされ、最初にtrueを返したページ(結果的に条件を満たす最後のページ)が表示される。
拡張するならこれをフックする。



















