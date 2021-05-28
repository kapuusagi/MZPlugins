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
    public class AchiveCollection : IAchive
    {
        private DataAchive data;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="data"></param>
        public AchiveCollection(DataAchive data)
        {
            this.data = data;
            data.Type = (int)(AchiveType.Collection);
        }
        /// <summary>
        /// 達成条件の種類を得る。
        /// </summary>
        public AchiveType Type { get => AchiveType.Collection; }

        /// <summary>
        /// アイテム種類
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
    }
}
