using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils
{
    /// <summary>
    /// エフェクトを表すモデル。
    /// </summary>
    public class Effect
    {
        /// <summary>
        /// エフェクトID
        /// </summary>
        public int Code { get; set; } = 0;
        /// <summary>
        /// データID
        /// </summary>
        public int DataId { get; set; } = 0;
        /// <summary>
        /// 値1
        /// </summary>
        public double Value1 { get; set; } = 0;
        /// <summary>
        /// 値2
        /// </summary>
        public double Value2 { get; set; } = 0;

        /// <summary>
        /// 値を設定する。
        /// </summary>
        /// <param name="paramName"></param>
        /// <param name="value"></param>
        public void SetValue(string paramName, object value)
        {
            switch (paramName)
            {
                case "code":
                    Code = (int)((double)(value));
                    break;
                case "dataId":
                    DataId = (int)((double)(value));
                    break;
                case "value1":
                    Value1 = (double)(value);
                    break;
                case "value2":
                    Value2 = (double)(value);
                    break;
            }

        }

        public override string ToString()
        {
            JsonData.JObjectBuilder job = new JsonData.JObjectBuilder();
            job.Append("code", Code);
            job.Append("dataId", DataId);
            job.Append("Value1", Value1);
            job.Append("Value2", Value2);
            return job.ToString();
        }
    }
}
