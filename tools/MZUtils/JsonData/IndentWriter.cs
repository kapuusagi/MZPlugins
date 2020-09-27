using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MZUtils.JsonData
{
    /// <summary>
    /// インデント付きで出力するためのラッパークラス。
    /// </summary>
    public class IndentWriter
    {
        private System.IO.TextWriter writer;

        /// <summary>
        /// 新しいIndentWriterオブジェクトを構築する。
        /// </summary>
        /// <param name="writer">出力先のライター</param>
        public IndentWriter(System.IO.TextWriter writer)
        {
            this.writer = writer;
        }

        /// <summary>
        /// インデント
        /// </summary>
        public int Indent { get; set; } = 0;

        /// <summary>
        /// 先頭にインデントを付けて行出力する。
        /// </summary>
        /// <param name="s">出力文字列</param>
        public void WriteLine(string s)
        {
            for (int i = 0; i < Indent; i++)
            {
                writer.Write(' ');
            }
            writer.WriteLine(s);
        }
    }
}
