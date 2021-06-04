using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    public interface IAchieve
    {
        /// <summary>
        /// 達成条件タイプ
        /// </summary>
        AchieveType Type { get; }
        /// <summary>
        /// データを得る
        /// </summary>
        DataAchieve Data { get; }
    }
}
