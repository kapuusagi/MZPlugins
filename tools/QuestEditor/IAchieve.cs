using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    /// <summary>
    /// 達成条件を表すクラス。
    /// </summary>
    public interface IAchieve : ICloneable
    {
        /// <summary>
        /// 達成条件タイプ
        /// </summary>
        AchieveType Type { get; }
        /// <summary>
        /// データを得る
        /// </summary>
        DataAchieve Data { get; }

        /// <summary>
        /// データを複製する
        /// </summary>
        /// <returns>複製した達成条件</returns>
        new IAchieve Clone();

    }
}
