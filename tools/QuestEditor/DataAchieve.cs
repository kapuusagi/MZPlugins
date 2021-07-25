using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MZUtils.JsonData;

namespace QEditor
{
    /// <summary>
    /// 達成条件モデル
    /// </summary>
    public class DataAchieve : ICloneable
    {
        /// <summary>
        /// DataAchieve
        /// </summary>
        public DataAchieve()
        {
        }

        /// <summary>
        /// 達成条件種別
        /// </summary>
        public int Type { get; set; } = 0;
        /// <summary>
        /// 値1
        /// </summary>
        public int Value1 { get; set; } = 0;
        /// <summary>
        /// 値2
        /// </summary>
        public int Value2 { get; set; } = 0;
        /// <summary>
        /// 値3
        /// </summary>
        public int Value3 { get; set; } = 0;

        /// <summary>
        /// オブジェクトを複製する。
        /// </summary>
        /// <returns>データ</returns>
        public DataAchieve Clone()
        {
            var achieve = new DataAchieve();
            achieve.Type = Type;
            achieve.Value1 = Value1;
            achieve.Value2 = Value2;
            achieve.Value3 = Value3;
            return achieve;
        }

        /// <summary>
        /// オブジェクトを複製する。
        /// </summary>
        /// <returns>データ</returns>
        object ICloneable.Clone() => Clone();

        /// <summary>
        /// 値を設定する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="value">値</param>
        public void SetValue(string paramName, object value)
        {
            switch (paramName)
            {
                case "type":
                    Type = (int)((double)(value));
                    break;
                case "value1":
                    Value1 = (int)((double)(value));
                    break;
                case "value2":
                    Value2 = (int)((double)(value));
                    break;
                case "value3":
                    Value3 = (int)((double)(value));
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
            job.Append("type", Type);
            job.Append("value1", Value1);
            job.Append("value2", Value2);
            job.Append("value3", Value3);

            return job.ToString();
        }
    }
}
