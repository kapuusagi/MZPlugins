# イベント用スクリプトサンプル

## このファイルは何？

RPGMaker MZのイベントやらコモンイベントにて、直接スクリプトを記述して処理を行うサンプル。
変数とか駆使するのめんどい場合に使用する。

## アクター選択と処理

2つのスクリプトを分けて書く
まず、アクター選択。
setupChoicesのパラメータについては後述。

~~~javascript
const choices = [];
for (const actor of $gameParty.members()) {
    choices.push(actor.name());
}
choices.push(TextManager.cancel);
this.setupChoices([choices, $gameParty.size(), 0, 2]);
this.setWaitMode('message');
~~~

選択した結果の取得 (this._branch[this._indent]から得られる。)

~~~javascript
const choice = this._branch[this._indent];
if (choice < $gameParty.size()) {
    // TODO : 処理
    console.log("choice = " + $gameParty.members()[choice]);
    console.log("TODO ")
}
~~~

ちなみに選択されたアクターのIDを変数に格納するなら、

~~~javascript
const choice = this._branch[this._indent];
const variableId = 24; // 任意に設定する
if (choice < $gameParty.size()) {
    $gameVariables.setValue(variableId, $gameParty.members().actorId());
} else {
    $gameVariables.setValue(variableId, -1);
}
~~~

この場合選択されたかどうか(変数の値が0より大)で分岐を入れること。



__setupChoices()のパラメータ__

|引数番号|型|
|0|Array<String>(たぶん)|選択肢の配列|
|1|Number|キャンセル選択の番号|
|2|Number|デフォルト選択の番号|
|3|Number|位置(0:画面左端,1:中央,2:画面右端)|
|4|Number|背景(0:不透明。通常のウィンドウ背景。 1:調光した背景, 2:完全透過)|
