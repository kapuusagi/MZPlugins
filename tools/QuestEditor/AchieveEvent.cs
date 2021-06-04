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
    public class AchieveEvent : IAchieve
    {
        private DataAchieve data;

        /// <summary>
        /// AchiveEventを構築する。
        /// </summary>
        /// <param name="data"></param>
        public AchieveEvent(DataAchieve data)
        {
            this.data = data;
        }

        /// <summary>
        /// データを得る
        /// </summary>
        public DataAchieve Data { get => data; }

        /// <summary>
        /// 達成条件の種類を得る。
        /// </summary>
        public AchieveType Type { get => AchieveType.Event; }

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

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列表現</returns>
        public override string ToString()
        {
            return ProjectData.GetSwitchName(SwitchNo) + "=" + (SwitchCondition ? "ON" : "OFF");
        }
    }
}
