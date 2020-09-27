using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// Traitを表すモデル。
    /// </summary>
    public class Trait
    {
        /// <summary>
        /// コード
        /// </summary>
        public int Code { get; set; }
        /// <summary>
        /// データID
        /// </summary>
        public int DataId { get; set; }
        /// <summary>
        /// 値
        /// </summary>
        public double Value { get; set; }

        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "code":
                    Code = (int)((double)(value));
                    break;
                case "dataId":
                    DataId = (int)((double)(value));
                    break;
                case "value":
                    Value = (double)(value);
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
            job.Append("code", Code);
            job.Append("dataId", DataId);
            job.Append("value", Value);
            return job.ToString();
        }
    }
}
