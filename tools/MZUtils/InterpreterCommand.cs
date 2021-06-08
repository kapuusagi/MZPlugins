using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils
{
    /// <summary>
    /// インタプリタコマンド
    /// </summary>
    public enum InterpreterCommand
    {
        /// <summary>
        /// スイッチコントロール
        /// param[0];Number 操作開始スイッチ番号
        /// @aram[1]:Number 操作終了スイッチ番号
        /// param[2]:Number 操作(0:ON, 1:OFF)
        /// </summary>
        ControlSwitch = 121,
    }
}
