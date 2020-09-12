using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils
{
    /// <summary>
    /// アイテム種別を表す定数。
    /// IDと組み合わせるとアイテムを構成する。
    /// </summary>
    public enum ItemType
    {
        /// <summary>
        /// アイテム
        /// </summary>
        Item = 1,
        /// <summary>
        /// ウェポン
        /// </summary>
        Weapon = 2,
        /// <summary>
        /// アーマー
        /// </summary>
        Armor = 3,
    }
}
