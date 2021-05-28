using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// 乗り物エントリ
    /// Airshipなどのエントリとして格納される。
    /// </summary>
    public class DataVehicle
    {
        /// <summary>
        /// 新しいDataVahicleオブジェクトを構築する。
        /// </summary>
        public DataVehicle()
        {

        }

        /// <summary>
        /// BGM
        /// </summary>
        public DataBgm Bgm { get; set; } = new DataBgm();

        /// <summary>
        /// 歩行グラフィックインデックス
        /// </summary>
        public int CharacterIndex { get; set; } = 0;

        /// <summary>
        /// 歩行グラフィックファイル名
        /// </summary>
        public string CharacterName { get; set; } = string.Empty;
        /// <summary>
        /// 開始マップID
        /// </summary>
        public int StartMapId { get; set; } = 0;
        /// <summary>
        /// 開始X
        /// </summary>
        public int StartX { get; set; } = 0;
        /// <summary>
        /// 開始Y
        /// </summary>
        public int StartY { get; set; } = 0;


        /// <summary>
        /// このオブジェクトのフィールドを設定する。
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch(key)
            {
                case "bgm":
                    Bgm = (DataBgm)(value);
                    break;
                case "characterIndex":
                    CharacterIndex = (int)((double)(value));
                    break;
                case "characterName":
                    CharacterName = (string)(value);
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
            }
        }


        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            JObjectBuilder job = new JObjectBuilder();
            job.Append("bgm", Bgm);
            job.Append("characterIndex", CharacterIndex);
            job.Append("characterName", CharacterName);
            job.Append("startMapId", StartMapId);
            job.Append("startX", StartX);
            job.Append("startY", StartY);
            return job.ToString();
        }
    }


}
