using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// BGM再生エントリモデル
    /// </summary>
    public class DataBgm
    {
        /// <summary>
        /// 新子インスタンスを構築する。
        /// </summary>
        public DataBgm()
        {
        }

        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// パン
        /// </summary>
        public int Pan { get; set; } = 0;
        /// <summary>
        /// ピッチ
        /// </summary>
        public int Pitch { get; set; } = 0;
        /// <summary>
        /// ボリューム
        /// </summary>
        public int Volume { get; set; } = 0;
        /// <summary>
        /// このオブジェクトのフィールドを設定する。
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "name":
                    Name = (string)(value);
                    break;
                case "pan":
                    Pan = (int)((double)(value));
                    break;
                case "pitch":
                    Pitch = (int)((double)(value));
                    break;
                case "volume":
                    Volume = (int)((double)(value));
                    break;
            }
        }


        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            JObjectBuilder job = new JObjectBuilder();
            job.Append("name", Name);
            job.Append("pan", Pan);
            job.Append("pitch", Pitch);
            job.Append("volume", Volume);

            return job.ToString();
        }
    }
}
