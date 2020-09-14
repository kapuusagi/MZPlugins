using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEditor
{
    /// <summary>
    /// 店売り品データエントリ
    /// </summary>
    public class ItemEntry
    {
        /// <summary>
        /// 販売条件
        /// </summary>
        public string Condition { get; set; } = "";

        /// <summary>
        /// ID番号
        /// </summary>
        public int Id { get; set; } = 0;
        /// <summary>
        /// 種類
        /// </summary>
        public int Kind { get; set; } = 0;
        /// <summary>
        /// 最大入荷数
        /// </summary>
        public int MaxCount { get; set; } = 0;
        /// <summary>
        /// 最小入荷数
        /// </summary>
        public int MinCount { get; set; } = 0;

        /// <summary>
        /// 購入価格
        /// </summary>
        public int BuyingPrice { get; set; } = 0;
        /// <summary>
        /// 販売価格
        /// </summary>
        public int SellingPrice { get; set; } = 0;

        /// <summary>
        /// 値を設定する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="value">値</param>
        public void SetValue(string paramName, object value)
        {
            switch (paramName)
            {
                case "id":
                    Id = (int)((double)(value));
                    break;
                case "kind":
                    Kind = (int)((double)(value));
                    break;
                case "maxCount":
                    MaxCount = (int)((double)(value));
                    break;
                case "minCount":
                    MinCount = (int)((double)(value));
                    break;
                case "buyingPrice":
                    BuyingPrice = (int)((double)(value));
                    break;
                case "sellingPrice":
                    SellingPrice = (int)((double)(value));
                    break;
                case "condition":
                    Condition = (string)(value);
                    break;
            }
        }
        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            MZUtils.JsonData.JObjectBuilder job = new MZUtils.JsonData.JObjectBuilder();
            job.Append("id", Id);
            job.Append("kind", Kind);
            job.Append("maxCount", MaxCount);
            job.Append("minCount", MinCount);
            job.Append("buyingPrice", BuyingPrice);
            job.Append("sellingPrice", SellingPrice);
            job.Append("condition", Condition);

            return job.ToString();
        }
    }
}
