/*:
 * @plugindesc プロフィールシステム
 * @help 
 *      Game_Actor.profile()で取得できるメッセージを別に用意したデータファイルから読み出して返すようにするだけのプラグイン。
 *      必要なもの
 *          data/ActorProfiles.json
 * 
 *      プロフィールデータはPEditorを使用して作成することを前提にしてる。
 *      返すメッセージは表示条件を付けてるので、条件により表示内容を変えられる。
 *      でも2行以上プロフィールデータを表示するUIをもっていないと、
 *      あんまり意味ないね。
 */

var Imported = Imported || {};
Imported.TWLD_Profile = true;


var TWLD = TWLD || {};
TWLD.Profile = TWLD.Profile || {};

// for ESLint
if (typeof DataManager === 'undefined') {
    var DataManager = {};
    var Game_Actor = {};
}

var $dataProfiles = null;

(function() {
    TWLD.Profile.DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        TWLD.Profile.DataManager_loadDatabase.call(this);
        try {
            this.loadDataFile("$dataProfiles","ActorProfiles.json");
        }
        catch (e) {
            console.error(e);
            $dataProfiles = null;
        }
    };

    //------------------------------------------------------------------------------
    // Game_Actorの変更
    // 

    TWLD.Profile.Game_Actor_profile = Game_Actor.prototype.profile;

    /**
     * プロフィールテキストを取得する。
     * @return {String} プロフィール文字列
     */
    Game_Actor.prototype.profile = function() {
        if ($dataProfiles) {
            var actorProfile = $dataProfiles[this._actorId];
            if (actorProfile) {
                for (var i = 0; i < actorProfile.profiles.length; i++) {
                    var prof = actorProfile.profiles[i];
                    if (!prof.condition || eval(prof.condition)) {
                        return prof.text;
                    }
                }
            }
        }
        // 該当するものが無い場合にはこれまで通りのプロフィールデータを返す。    
        return TWLD.Profile.Game_Actor_profile.call(this);
    };

})();