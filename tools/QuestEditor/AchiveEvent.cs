using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    /// <summary>
    /// イベント
    /// </summary>
    public class AchiveEvent : IAchive
    {
        private DataAchive data;

        /// <summary>
        /// AchiveEventを構築する。
        /// </summary>
        /// <param name="data"></param>
        public AchiveEvent(DataAchive data)
        {
            this.data = data;
        }

        /// <summary>
        /// 達成条件の種類を得る。
        /// </summary>
        public AchiveType Type { get => AchiveType.Event; }

        /// <summary>
        /// スイッチ番号
        /// </summary>
        public int SwitchNo { get => data.Value1; set => data.Value1 = value; }
        /// <summary>
        /// 達成条件としてのスイッチ状態
        /// true:ONの時, false:OFFの時
        /// </summary>
        public bool SwitchCondition {
            get => data.Value2 != 0;
            set => data.Value2 = (value) ? 1 : 0;
        }

        public override string ToString()
        {
            return $"";
        }
    }
}
