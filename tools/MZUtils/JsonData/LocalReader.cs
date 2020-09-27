using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MZUtils.JsonData
{
    /// <summary>
    /// このパッケージだけで使うローカルリーダー
    /// </summary>
    internal class LocalReader
    {
        private System.IO.StreamReader reader;

        /// <summary>
        /// 新しいLocalReaderオブジェクトを構築する。
        /// </summary>
        /// <param name="stream">入力ストリーム</param>
        internal LocalReader(System.IO.Stream stream)
        {
            reader = new System.IO.StreamReader(stream);
            DebugEnable = false;
        }

        /// <summary>
        /// デバッグモード。
        /// </summary>
        public bool DebugEnable { get; set; }

        /// <summary>
        /// ストリームの終わりに到達したかどうか
        /// </summary>
        public bool EndOfStream {
            get {
                return reader.EndOfStream;
            }
        }

        /// <summary>
        /// 1文字読む。位置は1文字分進む。
        /// </summary>
        /// <returns>文字</returns>
        public char Read()
        {
            char c = (char)(reader.Read());
            if (DebugEnable)
            {
                System.Diagnostics.Debug.Write(c);
            }
            return c;
        }

        /// <summary>
        /// 先頭の1文字を取得する。但し位置は進めない。
        /// </summary>
        /// <returns>文字</returns>
        public char Peek()
        {
            return (char)(reader.Peek());
        }

        /// <summary>
        /// 1文字分進める。
        /// </summary>
        public void Consume()
        {
            char c = (char)(reader.Read());
            if (DebugEnable)
            {
                System.Diagnostics.Debug.Write(c);
            }
        }
    }
}
