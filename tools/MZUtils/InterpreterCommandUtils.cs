using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils
{
    /// <summary>
    /// インタプリタコマンドユーティリティ
    /// </summary>
    public static class InterpreterCommandUtils
    {
        /// <summary>
        /// このコマンドの文字列表現を得る。
        /// </summary>
        /// <param name="command">コマンド</param>
        /// <returns>文字列</returns>
        public static string GetString(DataCommand command)
        {
            try
            {
                switch (command.Code)
                {
                    case InterpreterCommand.ControlSwitch:
                        return GetStringControlSwitch(command);
                    default:
                        return $"command{(int)(command.Code)}";
                }
            }
            catch
            {
                return $"command{(int)(command.Code)}_ParameterError";
            }
        }

        /// <summary>
        /// 制御スイッチコマンドの文字列表現を得る。
        /// </summary>
        /// <param name="command">コマンド</param>
        /// <returns>文字列</returns>
        private static string GetStringControlSwitch(DataCommand command)
        {
            int startSwId = (int)((double)(command.Parameters[0]));
            int endSwId = (int)((double)(command.Parameters[1]));
            var controlText = (((int)((double)(command.Parameters[2]))) == 0) ? "ON" : "OFF";
            if (startSwId == endSwId)
            {
                return $"Set switch {controlText} number {startSwId}]";
            }
            else
            {
                return $"Set switches {controlText} between {startSwId} to {endSwId}";
            }
        }
    }
}
