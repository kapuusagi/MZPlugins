/*:
 * @plugindesc TWLDの鑑定システム
 * TWLDでの運用を想定する。
 * @author kapuusagi
 * @help
 * 未鑑定アイテムを入手して、鑑定アイテムまたは鑑定ショップにて鑑定するまで
 * 実際のアイテムは入手できない機能を提供する。
 * ベーシックシステムでもたくさんのアイテムエントリとコモンイベントを駆使すればできるんだけど。
 * アイテムエントリがもったいないので自作した。
 * Yanfly氏のItemCoreエンジンと個別アイテムの有効化が必要。
 * 仕様
 *     ・TWLD.Appraisal.AddItemで追加したアイテムを未鑑定アイテムとして所持品に追加する。
 *     ・鑑定対象には鑑定レベルが設定されており、鑑定レベルが高いアイテム/スキル/ショップでのみ
 *       鑑定ができる。
 *     ・エネミードロップ品はノートタグを指定することで、未鑑定アイテムとして入手できる。
 * 
 * プラグインコマンド
 *     TWLD.Appraisal.OpenShop [level# [clerk-filename$]]
 *          鑑定屋さんを表示する。
 *          level# : 鑑定レベル。指定したレベル以下のものしか鑑定できない。
 *          clerk-filename : 店員画像ファイル(img/pictures以下のファイルを指定します。)
 *     TWLD.Appraisal.AddItem type$:actualItemId#
 *          actualItemIdを所持品に追加。
 *          type$は item / weapon / armor のいずれかを指定可能。
 *          荷物いっぱいだと追加できないよ。
 *          actualItemIdに指定する側には、<AppraisedItemをつけよう>
 *          AppraisedItem指定されたItemカテゴリのアイテムとして追加される。(ここ重要)
 *          ArmorとかでもItemカテゴリのやつで追加されるので注意してね。
 * ノートタグ
 *     アイテム/武器/防具
 *         <noAppraisal>
 *            このアイテムは入手時に未鑑定にならない。
 *         <AppraiseLevel:level#>
 *             鑑定可能レベルをeval$にする。
 *             未指定時はどんなものでも鑑定可。
 *         <AppraisePrice:value#>
 *             鑑定価格をvalue#にする。
 *         <AppraiseItem:id#>
 *             未鑑定状態だと、同カテゴリのid#のIDになる。
 *     アイテム/スキル
 *         <Appraise:level#>
 *            使用すると鑑定できる。
 *            level#を未指定にすると、鑑定レベル99以下のものを全て鑑定できる。
 *     エネミー
 *         <AppraiseDrop>
 *            ドロップアイテムのうち、ドロップアイテムにAppraiseItemが指定されている場合に、
 *            未鑑定品を取得する。
 *            つまり、未鑑定品をドロップさせるには、エネミーのノートタグに
 *            AppraiseDropをつけ、ドロップアイテムのノートタグに
 *            <AppraiseItem:id#>のタグをつける。
 *            すると、アイテムテーブルのid#のアイテムが入手するようになり、
 *            鑑定するとid#のアイテムが得られる。
 * @note 
 * TWLD_UIより後にいれる。
 * 動作仕様
 * ・個別アイテム入手時、ArraisalがONだと蜜柑亭状態で入手する。 
 * 
 * ・装備画面やアイテム一覧での表示名を「？？？」にする。
 * ・未鑑定品はヘルプメッセージを「未鑑定品」にする。
 * ・未鑑定品は使えない。
 * ・未鑑定品は装備できない。
 * ・アイテム保持条件に引っかからない。
 * 
 * ・鑑定操作は専用のシーンを用意して対応する。
 *   鑑定価格とかつける？
 * 
 * ・鑑定アイテムと鑑定ショップは別にする。
 * 
 * 分散して機能実装すると、何回も同じメソッドつけたり同じ判定したりでいやだなあ。
 */
var Imported = Imported || {};
Imported.TWLD_Appraisal = true;

var TWLD = TWLD || {};
TWLD.Core = TWLD.Core || {};

if (!Imported.TWLD_UI) {
    throw "This plugin must be import after TWLD_UI.js";
}


// for ESLint
if (typeof Window_ItemCategory === 'undefined') {
    var Game_Interpreter = {};
    var SceneManager = {};
    var DataManager = {};
    var TextManager = {};
    var Scene_MenuBase = {};
    var Scene_ItemBase = {};
    var SoundManager = {};

    var Window_Base = {};
    var Window_Gold = {};
    var GenericCommand = {};
    var Window_CommandGeneric = {};
    var Window_Selectable = {};
    var Window_Simple= {};
    var ImageManager = {};
    var Game_Party = {};
    var Game_Enemy = {};

    var $gameParty = {};
    var $dataWeapons = {};
    var $dataArmors = {};
    var $dataItems = {};
    var $gameSystem = {};

    var Graphics = {};
    var Sprite = {};
}


TWLD.Ap = TWLD.Ap || {};

// for ESLint
(function () {
    'use strict';








    //------------------------------------------------------------------------------
    // Game_Enemyの変更
    //


    //------------------------------------------------------------------------------
    // DataManagerの変更
    //



    //------------------------------------------------------------------------------
    // Game_Partyの変更
    //






    


})();