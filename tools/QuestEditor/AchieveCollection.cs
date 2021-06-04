using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MZUtils;

namespace QEditor
{
    /// <summary>
    /// 採取条件
    /// </summary>
    public class AchieveCollection : IAchieve
    {
        private DataAchieve data;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="data"></param>
        public AchieveCollection(DataAchieve data)
        {
            this.data = data;
            data.Type = (int)(AchieveType.Collection);
        }
        /// <summary>
        /// データを得る
        /// </summary>
        public DataAchieve Data { get => data; }

        /// <summary>
        /// 達成条件の種類を得る。
        /// </summary>
        public AchieveType Type { get => AchieveType.Collection; }

        /// <summary>
        /// アイテム種類(1:アイテム,2:武器,3:防具)
        /// </summary>
        public ItemType ItemType {
            get => (ItemType)(Enum.ToObject(typeof(ItemType), data.Value1));
            set => data.Value1 = (int)(value);
        }

        /// <summary>
        /// アイテムID
        /// </summary>
        public int ItemId {
            get => data.Value2;
            set => data.Value2 = value;
        }
        /// <summary>
        /// 収集数
        /// </summary>
        public int Count {
            get => data.Value3;
            set => data.Value3 = value;
        }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return $"Correct {ProjectData.GetItemName(data.Value1, ItemId)}x{Count}";
        }
    }
}
