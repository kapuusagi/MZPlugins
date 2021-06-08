using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// インタプリタのコマンド1つを表すモデル。
    /// </summary>
    public class DataCommand
    {
        /// <summary>
        /// イベントコード
        /// </summary>
        public InterpreterCommand Code { get; set; } = 0;
        /// <summary>
        /// インデント
        /// </summary>
        /// <remarks>
        /// ブランチスキップ処理(ループから抜けるときの処理)などで参照される。
        /// </remarks>
        public int Indent { get; set; } = 0;

        /// <summary>
        /// パラメータ
        /// </summary>
        public List<object> Parameters { get; set; } = new List<object>();
        /// <summary>
        /// このオブジェクトのフィールドを設定する。
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "code":
                    Code = (InterpreterCommand)((int)((double)(value)));
                    break;
                case "indent":
                    Indent = (int)((double)(value));
                    break;
                case "parameters":
                    Parameters = (List<object>)(value);
                    break;
            }
        }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            var job = new JObjectBuilder();
            job.Append("code", (int)(Code));
            job.Append("indent", Indent);
            job.Append("parameters", Parameters);
            return base.ToString();
        }
    }
}
