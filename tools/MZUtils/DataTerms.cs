using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// $dataSystem.termsフィールドを表すモデル。
    /// </summary>
    public class DataTerms
    {
        /// <summary>
        /// 新しいDataTermsオブジェクトを構築する。
        /// </summary>
        public DataTerms()
        {
        }
        /// <summary>
        /// ベーシック文字列リソース
        /// </summary>
        public List<string> Basic { get; set; } = new List<string>();
        /// <summary>
        /// コマンド文字列リソース
        /// </summary>
        public List<string> Commands { get; set; } = new List<string>();
        /// <summary>
        /// パラメータ文字列リソース
        /// </summary>
        public List<string> Params { get; set; } = new List<string>();
        /// <summary>
        /// メッセージ
        /// </summary>
        public Dictionary<string, string> Messages { get; set; } = new Dictionary<string, string>();
        /// <summary>
        /// このオブジェクトのフィールドを設定する。
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "basic":
                    Basic = (List<string>)(value);
                    break;
                case "commands":
                    Commands = (List<string>)(value);
                    break;
                case "params":
                    Params = (List<string>)(value);
                    break;
                case "messages":
                    Messages = (Dictionary<string, string>)(value);
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
            job.Append("basic", Basic);
            job.Append("commands", Commands);
            job.Append("params", Params);
            job.Append("messages", Messages);
            return job.ToString();
        }
    }
}
