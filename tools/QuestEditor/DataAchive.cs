using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    /// <summary>
    /// 達成条件モデル
    /// </summary>
    public class DataAchive
    {
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
    }
}
