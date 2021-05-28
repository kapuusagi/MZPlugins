using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// $dataSystemに相当するデータに対応するモデル。
    /// </summary>
    public class DataSystem
    {
        /// <summary>
        /// 新しい空のDataSystemオブジェクトを構築する。
        /// </summary>
        public DataSystem()
        {

        }

        /// <summary>
        /// アドバンスドデータ
        /// </summary>
        public DataAdvanced Advanced { get; set; } = new DataAdvanced();
        /// <summary>
        /// 乗り物(空)データ
        /// </summary>
        public DataVehicle Airship { get; set; } = new DataVehicle();
        /// <summary>
        /// 防具タイプ
        /// </summary>
        public List<string> ArmorTypes { get; set; } = new List<string>();
        /// <summary>
        /// アタックモーションデータ
        /// </summary>
        public List<DataAttackMotion> AttackMotions { get; set; } = new List<DataAttackMotion>();
        /// <summary>
        /// 戦闘BGM
        /// </summary>
        public DataBgm BattleBgm { get; set; } = new DataBgm();
        /// <summary>
        /// 戦闘背景1
        /// </summary>
        public string Battleback1 { get; set; } = string.Empty;
        /// <summary>
        /// 戦闘背景2
        /// </summary>
        public string Battleback2 { get; set; } = string.Empty;
        /// <summary>
        /// 戦闘背景の色相
        /// </summary>
        public int BattlerHue { get; set; } = 0;
        /// <summary>
        /// 戦闘名
        /// </summary>
        public string BattlerName { get; set; } = string.Empty;
        /// <summary>
        /// 戦闘システム
        /// </summary>
        public int BattleSystem { get; set; } = 0;
        /// <summary>
        /// 船
        /// </summary>
        public DataVehicle Boat { get; set; } = new DataVehicle();
        /// <summary>
        /// 通貨単位
        /// </summary>
        public string CurrencyUnit { get; set; } = string.Empty;
        /// <summary>
        /// 敗北時のサウンドエフェクト？
        /// </summary>
        public DataBgm DefeatMe { get; set; } = new DataBgm();
        /// <summary>
        /// 編集中マップID
        /// </summary>
        public int EditMapId { get; set; } = 0;
        /// <summary>
        /// 属性名
        /// </summary>
        public List<string> Elements { get; set; } = new List<string>();
        /// <summary>
        /// 装備タイプ名
        /// </summary>
        public List<string> EquipTypes { get; set; } = new List<string>();
        /// <summary>
        /// タイトル
        /// </summary>
        public string GameTitle { get; set; } = string.Empty;
        /// <summary>
        /// ゲームオーバー曲
        /// </summary>
        public DataBgm GameoverMe { get; set; } = new DataBgm();
        /// <summary>
        /// アイテムカテゴリON/OFF
        /// </summary>
        public List<bool> ItemCategories { get; set; } = new List<bool>();

        /// <summary>
        /// 地域情報
        /// </summary>
        public System.Globalization.CultureInfo Locale { get; set; } = System.Globalization.CultureInfo.CurrentCulture;
        /// <summary>
        /// 魔法スキルタイプ番号
        /// </summary>
        public List<int> MagicSkills { get; set; } = new List<int>();
        /// <summary>
        /// メニューコマンド
        /// </summary>
        public List<bool> MenuCommands { get; set; } = new List<bool>();
        /// <summary>
        /// 自動保存するかどうか
        /// </summary>
        public bool OptAutosave { get; set; } = true;
        /// <summary>
        /// TP表示するかどうか
        /// </summary>
        public bool OptDisplayTp { get; set; } = true;
        /// <summary>
        /// タイトル描画するかどうか
        /// </summary>
        public bool OptDrawTitle { get; set; } = true;
        /// <summary>
        /// EXP展開するかどうか
        /// </summary>
        public bool OptExtraExp { get; set; } = false;
        /// <summary>
        /// 床ダメージでDeadするかどうか。
        /// </summary>
        public bool OptFloorDeath { get; set; } = false;
        /// <summary>
        /// パーティーメンバーを表示するかどうか。
        /// </summary>
        public bool OptFollowers { get; set; } = true;

        /// <summary>
        /// キーアイテム番号を表示するかどうか
        /// </summary>
        public bool OptKeyItemNumber { get; set; } = false;
        /// <summary>
        /// サイドビューにするかどうか
        /// </summary>
        public bool OptSideView { get; set; } = false;
        /// <summary>
        /// スリップで死亡させるかどうか。
        /// </summary>
        public bool OptSlipDeath { get; set; } = false;
        /// <summary>
        /// プレイヤーを透明状態で開始するかどうか。
        /// </summary>
        public bool OptTransparent { get; set; } = false;
        /// <summary>
        /// 初期パーティーメンバー
        /// </summary>
        public List<int> PartyMembers { get; set; } = new List<int>();
        /// <summary>
        /// 船
        /// </summary>
        public DataVehicle Ship { get; set; } = new DataVehicle();
        /// <summary>
        /// スキルタイプ
        /// </summary>
        public List<string> SkillTypes { get; set; } = new List<string>();
        /// <summary>
        /// 音リスト
        /// </summary>
        public List<DataBgm> Sounds { get; set; } = new List<DataBgm>();
        /// <summary>
        /// マップ開始位置
        /// </summary>
        public int StartMapId { get; set; } = 0;
        /// <summary>
        /// 開始位置X
        /// </summary>
        public int StartX { get; set; } = 0;
        /// <summary>
        /// 開始位置Y
        /// </summary>
        public int StartY { get; set; } = 0;
        /// <summary>
        /// スイッチ
        /// </summary>
        public List<string> Switches { get; set; } = new List<string>();
        /// <summary>
        /// 文字列リソース
        /// </summary>
        public DataTerms Terms { get; set; } = new DataTerms();
        /// <summary>
        /// 戦闘テスト参加者
        /// </summary>
        public List<DataTestBattler> TestBattlers { get; set; } = new List<DataTestBattler>();
        /// <summary>
        /// 戦闘テストエネミーグループID
        /// </summary>
        public int TestTroopId { get; set; } = 0;
        /// <summary>
        /// タイトル1名前
        /// </summary>
        public string Title1Name { get; set; } = string.Empty;
        /// <summary>
        /// タイトル2名前
        /// </summary>
        public string Title2Name { get; set; } = string.Empty;
        /// <summary>
        /// タイトル画面曲
        /// </summary>
        public DataBgm TitleBgm { get; set; } = new DataBgm();
        /// <summary>
        /// タイトルのコマンドウィンドウ設定
        /// </summary>
        public DataTitleCommandWindow TitleCommandWindow { get; set; } = new DataTitleCommandWindow();
        /// <summary>
        /// 変数エントリ
        /// </summary>
        public List<string> Variables { get; set; } = new List<string>();
        /// <summary>
        /// バージョンID
        /// </summary>
        public int VersionId { get; set; } = 0;
        /// <summary>
        /// 勝利時曲
        /// </summary>
        public DataBgm VictoryMe { get; set; } = new DataBgm();
        /// <summary>
        /// 武器タイプ
        /// </summary>
        public List<string> WeaponTypes { get; set; } = new List<string>();

        /// <summary>
        /// ウィンドウトーン
        /// </summary>
        public List<int> WindowTone { get; set; } = new List<int>();
        /// <summary>
        /// このオブジェクトのフィールドを設定する。
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "advanced":
                    Advanced = (DataAdvanced)(value);
                    break;
                case "airship":
                    Airship = (DataVehicle)(value);
                    break;
                case "armorTypes":
                    ArmorTypes = (List<string>)(value);
                    break;
                case "attackMotions":
                    AttackMotions = (List<DataAttackMotion>)(value);
                    break;
                case "battleBgm":
                    BattleBgm = (DataBgm)(value);
                    break;
                case "battleback1Name":
                    Battleback1 = (string)(value);
                    break;
                case "battleback2Name":
                    Battleback2 = (string)(value);
                    break;
                case "battlerHue":
                    BattlerHue = (int)((double)(value));
                    break;
                case "battlerName":
                    BattlerName = (string)(value);
                    break;
                case "battleSystem":
                    BattleSystem = (int)((double)(value));
                    break;
                case "boat":
                    Boat = (DataVehicle)(value);
                    break;
                case "currencyUnit":
                    CurrencyUnit = (string)(value);
                    break;
                case "defeatMe":
                    DefeatMe = (DataBgm)(value);
                    break;
                case "editMapId":
                    EditMapId = (int)((double)(value));
                    break;
                case "elements":
                    Elements = (List<string>)(value);
                    break;
                case "equipTypes":
                    EquipTypes = (List<string>)(value);
                    break;
                case "gameTitle":
                    GameTitle = (string)(value);
                    break;
                case "gameoverMe":
                    GameoverMe = (DataBgm)(value);
                    break;
                case "itemCategories":
                    ItemCategories = (List<bool>)(value);
                    break;
                case "locale":
                    Locale = new System.Globalization.CultureInfo((string)(value));
                    break;
                case "magicSkills":
                    MagicSkills = (List<int>)(value);
                    break;
                case "menuCommands":
                    MenuCommands = (List<bool>)(value);
                    break;
                case "optAutosave":
                    OptAutosave = (bool)(value);
                    break;
                case "optDisplayTp":
                    OptDisplayTp = (bool)(value);
                    break;
                case "optDrawTitle":
                    OptDrawTitle = (bool)(value);
                    break;
                case "optExtraExp":
                    OptExtraExp = (bool)(value);
                    break;
                case "optFloorDeath":
                    OptFloorDeath = (bool)(value);
                    break;
                case "optFollowers":
                    OptFollowers = (bool)(value);
                    break;
                case "optKeyItemNumber":
                    OptKeyItemNumber = (bool)(value);
                    break;
                case "optSideView":
                    OptSideView = (bool)(value);
                    break;
                case "optSlipDeath":
                    OptSlipDeath = (bool)(value);
                    break;
                case "optTransparent":
                    OptTransparent = (bool)(value);
                    break;
                case "partyMembers":
                    PartyMembers = (List<int>)(value);
                    break;
                case "ship":
                    Ship = (DataVehicle)(value);
                    break;
                case "skillTypes":
                    SkillTypes = (List<string>)(value);
                    break;
                case "sounds":
                    Sounds = (List<DataBgm>)(value);
                    break;
                case "startMapId":
                    StartMapId = (int)((double)(value));
                    break;
                case "startX":
                    StartX = (int)((double)(value));
                    break;
                case "startY":
                    StartY = (int)((double)(value));
                    break;
                case "switches":
                    Switches = (List<string>)(value);
                    break;
                case "terms":
                    Terms = (DataTerms)(value);
                    break;
                case "testBattlers":
                    TestBattlers = (List<DataTestBattler>)(value);
                    break;
                case "testTroopId":
                    TestTroopId = (int)((double)(value));
                    break;
                case "title1Name":
                    Title1Name = (string)(value);
                    break;
                case "title2Name":
                    Title2Name = (string)(value);
                    break;
                case "titleBgm":
                    TitleBgm = (DataBgm)(value);
                    break;
                case "titleCommandWindow":
                    TitleCommandWindow = (DataTitleCommandWindow)(value);
                    break;
                case "variables":
                    Variables = (List<string>)(value);
                    break;
                case "versionId":
                    VersionId = (int)((double)(value));
                    break;
                case "victoryMe":
                    VictoryMe = (DataBgm)(value);
                    break;
                case "weaponTypes":
                    WeaponTypes = (List<string>)(value);
                    break;
                case "windowTone":
                    WindowTone = (List<int>)(value);
                    break;
            }
        }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            JObjectBuilder job = new JObjectBuilder();
            job.Append("advanced", Advanced);
            job.Append("airship", Airship);
            job.Append("armorTypes", ArmorTypes);
            job.Append("attackMotions", AttackMotions);
            job.Append("battleBgm", BattleBgm);
            job.Append("battleback1Name", Battleback1);
            job.Append("battleback2Name", Battleback2);
            job.Append("battlerHue", BattlerHue);
            job.Append("battlerName", BattlerName);
            job.Append("battleSystem", BattleSystem);
            job.Append("boat", Boat);
            job.Append("currencyUnit", CurrencyUnit);
            job.Append("defeatMe", DefeatMe);
            job.Append("editMapId", EditMapId);
            job.Append("elements", Elements);
            job.Append("equipTypes", EquipTypes);
            job.Append("gameTitle", GameTitle);
            job.Append("gameoverMe", GameoverMe);
            job.Append("itemCategories", ItemCategories);
            job.Append("locale", Locale.ToString());
            job.Append("magicSkills", MagicSkills);
            job.Append("menuCommands", MenuCommands);
            job.Append("optAutosave", OptAutosave);
            job.Append("optDisplayTp", OptDisplayTp);
            job.Append("optDrawTitle", OptDrawTitle);
            job.Append("optExtraExp", OptExtraExp);
            job.Append("optFloorDeath", OptFloorDeath);
            job.Append("optFollowers", OptFollowers);
            job.Append("optKeyItemNumber", OptKeyItemNumber);
            job.Append("optSideView", OptSideView);
            job.Append("optSlipDeath", OptSlipDeath);
            job.Append("optTransparent", OptTransparent);
            job.Append("partyMembers", PartyMembers);
            job.Append("ship", Ship);
            job.Append("skillTypes", SkillTypes);
            job.Append("sounds", Sounds);
            job.Append("startMapId", StartMapId);
            job.Append("startX", StartX);
            job.Append("startY", StartY);
            job.Append("switches", Switches);
            job.Append("terms", Terms);
            job.Append("testBattlers", TestBattlers);
            job.Append("testTroopId", TestTroopId);
            job.Append("title1Name", Title1Name);
            job.Append("title2Name", Title2Name);
            job.Append("titleBgm", TitleBgm);
            job.Append("titleCommandWindow", TitleCommandWindow);
            job.Append("variables", Variables);
            job.Append("versionId", VersionId);
            job.Append("victoryMe", VictoryMe);
            job.Append("weaponTypes", WeaponTypes);
            job.Append("windowTone", WindowTone);

            return job.ToString();
        }
    }
}
