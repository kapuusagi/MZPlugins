using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// ベーシックシステムのアクター情報を格納するためのモデル。
    /// </summary>
    public class DataActor : INamedObject
    {
        public DataActor()
        {

        }
        /// <summary>
        /// アクターID。有効値は1以上
        /// </summary>
        public int Id { get; set; } = 0;
        /// <summary>
        /// 先頭グラフィックファイル名
        /// </summary>
        public string BattlerName { get; set; } = string.Empty;
        /// <summary>
        /// 歩行グラフィックファイル中のキャラクターインデックス
        /// </summary>
        public int CharacterIndex { get; set; } = 0;
        /// <summary>
        /// 歩行グラフィックファイル名
        /// </summary>
        public string CharacterName { get; set; } = string.Empty;
        /// <summary>
        /// クラスID
        /// </summary>
        public int ClassId { get; set; } = 0;
        /// <summary>
        /// 装備リスト
        /// </summary>
        public List<int> Equips { get; private set; } = new List<int>();
        /// <summary>
        /// 顔グラフィックファイル中のインデックス番号
        /// </summary>
        public int FaceIndex { get; set; } = 0;
        /// <summary>
        /// 顔グラフィックファイル名
        /// </summary>
        public string FaceName { get; set; } = string.Empty;
        /// <summary>
        /// アクター自身の特性一覧。
        /// ベーシックシステムでは追加したり削除したりできない。
        /// </summary>
        public List<Trait> Traits { get; private set; } = new List<Trait>();
        /// <summary>
        /// 初期レベル
        /// </summary>
        public int InitialLevel { get; set; } = 1;
        /// <summary>
        /// 最大レベル
        /// </summary>
        public int MaxLevel { get; set; } = 99;
        /// <summary>
        /// 名前
        /// </summary>
        public string Name { get; set; } = string.Empty;
        /// <summary>
        /// 通り名
        /// </summary>
        public string Nickname { get; set; } = string.Empty;
        /// <summary>
        /// ノートタグ
        /// </summary>
        public string Note { get; set; } = string.Empty;
        /// <summary>
        /// プロフィールテキスト
        /// </summary>
        public string Profile { get; set; } = string.Empty;

        /// <summary>
        /// このオブジェクトのフィールドを設定する。
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "id":
                    Id = (int)((double)(value));
                    break;
                case "battlerName":
                    BattlerName = (string)(value);
                    break;
                case "characterIndex":
                    CharacterIndex = (int)((double)(value));
                    break;
                case "characterName":
                    CharacterName = (string)(value);
                    break;
                case "classId":
                    ClassId = (int)((double)(value));
                    break;
                case "equips":
                    Equips.Clear();
                    Equips.AddRange((List<int>)(value));
                    break;
                case "faceIndex":
                    FaceIndex = (int)((double)(value));
                    break;
                case "faceName":
                    FaceName = (string)(value);
                    break;
                case "traits":
                    Traits.Clear();
                    Traits.AddRange((List<Trait>)(value));
                    break;
                case "initialLevel":
                    InitialLevel = (int)((double)(value));
                    break;
                case "maxLevel":
                    MaxLevel = (int)((double)(value));
                    break;
                case "name":
                    Name = (string)(value);
                    break;
                case "nickname":
                    Nickname = (string)(value);
                    break;
                case "note":
                    Note = (string)(value);
                    break;
                case "profile":
                    Profile = (string)(value);
                    break;
                default:
                    throw new Exception($"Unknown key={key}");

            }
        }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列表現</returns>
        public override string ToString()
        {
            JObjectBuilder job = new JObjectBuilder();
            job.Append("id", Id);
            job.Append("battlerName", BattlerName);
            job.Append("characterIndex", CharacterIndex);
            job.Append("characterName", CharacterName);
            job.Append("classId", ClassId);
            job.Append("equips", Equips);
            job.Append("faceIndex", FaceIndex);
            job.Append("faceName", FaceName);
            job.Append("traits", Traits);
            job.Append("initialLevel", InitialLevel);
            job.Append("maxLevel", MaxLevel);
            job.Append("name", Name);
            job.Append("nickname", Nickname);
            job.Append("note", Note);
            job.Append("profile", Profile);

            return job.ToString();
        }

    }
}
