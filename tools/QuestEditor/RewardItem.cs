using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    /// <summary>
    /// 報酬アイテムデータを表すモデル。
    /// </summary>
    public class RewardItem
    {
        /// <summary>
        /// 種類
        /// </summary>
        public int Kind { get; set; } = 0;
        /// <summary>
        /// データID
        /// </summary>
        public int DataId { get; set; } = 0;
        /// <summary>
        /// 数量
        /// </summary>
        public int Value { get; set; } = 0;

        /// <summary>
        /// 値を設定する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="value">値</param>
        public void SetValue(string paramName, object value)
        {
            switch (paramName)
            {
                case "kind":
                    Kind = (int)((double)(value));
                    break;
                case "dataId":
                    DataId = (int)((double)(value));
                    break;
                case "value":
                    Value = (int)((double)(value));
                    break;
            }
        }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列表現</returns>
        public override string ToString()
        {
            var job = new MZUtils.JsonData.JObjectBuilder();
            job.Append("kind", Kind);
            job.Append("dataId", DataId);
            job.Append("value", Value);

            return job.ToString();
        }
    }
}
