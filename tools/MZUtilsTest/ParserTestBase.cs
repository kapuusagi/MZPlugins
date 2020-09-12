using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using MZUtils.JsonData;
using System.Diagnostics;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace MZUtilsTest
{
    /// <summary>
    /// パーサーテストのベースクラス。
    /// </summary>
    public abstract class ParserTestBase
    {
        /// <summary>
        /// ストリームからリストを読み出す。
        /// </summary>
        /// <param name="stream">ストリーム</param>
        /// <returns>リスト</returns>
        protected abstract System.Collections.IList ReadListFromStream(Stream stream);

        /// <summary>
        /// 解析テストを行う。
        /// 本テストは以下のシーケンスで処理される。
        /// 1. dataFileNameで指定されたファイルを読み出す。
        /// 2. パースした結果とdataFileNameのデータを比較する。
        /// 3. 各ラインについて、一致判定を行う。
        /// </summary>
        /// <param name="dataFileName">データファイルパス</param>
        public void RunParseTest(string dataFileName)
        {
            string dataText = ReadSampleDataFile(dataFileName);
            System.Collections.IList list;
            using (Stream stream = CreateSourceDataStream(dataText))
            {
                list = ReadListFromStream(stream);
            }

            Assert.IsNotNull(list);

            string dstText = GetJsonDataText(list);
            using (var srcReader = new StringReader(dataText))
            using (var dstReader = new StringReader(dstText))
            {
                while (true)
                {
                    string srcLine = srcReader.ReadLine();
                    string dstLine = dstReader.ReadLine();
                    Assert.AreEqual(srcLine, dstLine);
                    if ((srcLine == null) || (dstLine == null))
                    {
                        break;
                    }
                }
            }
        }

        /// <summary>
        /// データファイルを読み出す。
        /// </summary>
        /// <param name="relativePath">相対パス</param>
        /// <returns>データファイルの文字列</returns>
        private string ReadSampleDataFile(string relativePath)
        {
            using (StreamReader reader = new StreamReader(
                new FileStream(relativePath, FileMode.Open, FileAccess.Read)))
            {
                return reader.ReadToEnd();
            }
        }

        /// <summary>
        /// データストリームを作成する。
        /// </summary>
        /// <param name="dataText">データ文字列</param>
        /// <returns>ストリームオブジェクト</returns>
        private Stream CreateSourceDataStream(string dataText)
        {
            byte[] data = Encoding.UTF8.GetBytes(dataText);

            MemoryStream ms = new MemoryStream(data);
            return ms;
        }

        /// <summary>
        /// listをJsonデータ表現のオブジェクトに変換する。
        /// </summary>
        /// <param name="list">リスト</param>
        /// <returns>データ文字列</returns>
        private string GetJsonDataText(System.Collections.IList list)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("[");
            for (int i = 0; i < list.Count; i++)
            {
                object obj = list[i];
                if (obj != null)
                {
                    sb.Append(obj.ToString()).AppendLine(",");
                }
                else
                {
                    sb.AppendLine("null,");
                }
            }
            sb.AppendLine("]");

            return sb.ToString();
        }
    }
}
