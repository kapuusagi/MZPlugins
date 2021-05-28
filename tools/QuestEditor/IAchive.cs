using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    interface IAchive
    {
        /// <summary>
        /// 達成条件タイプ
        /// </summary>
        AchiveType Type { get; }
    }
}
