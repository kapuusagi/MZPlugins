using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils
{
    /// <summary>
    /// ID番号と名前があるオブジェクト
    /// </summary>
    public interface INamedObject
    {
        /// <summary>
        /// ID番号
        /// </summary>
        int Id { get; }
        /// <summary>
        /// 名前
        /// </summary>
        string Name { get; }
    }
}
