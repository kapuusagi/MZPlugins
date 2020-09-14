using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PEditor
{
    /// <summary>
    /// 1つのプロフィールデータを表すモデル。
    /// </summary>
    public class Profile
    {
        /// <summary>
        /// 表示条件
        /// </summary>
        public string Condition { get; set; } = "";

        /// <summary>
        /// 表示テキスト
        /// </summary>
        public string Text { get; set; } = "";

        /// <summary>
        /// 値をセットする。
        /// パーサー用のインタフェース
        /// </summary>
        /// <param name="key">キー</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "condition":
                    Condition = (string)(value);
                    break;
                case "text":
                    Text = (string)(value);
                    break;
                default:
                    throw new Exception("Unsupported key = " + key);
            }
        }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            var job = new MZUtils.JsonData.JObjectBuilder();
            job.Append("condition", Condition);
            job.Append("text", Text);
            return job.ToString();
        }
    }
}
