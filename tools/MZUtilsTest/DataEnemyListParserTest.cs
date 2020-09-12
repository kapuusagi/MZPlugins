using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MZUtils;
using System.IO;

namespace MZUtilsTest
{
    [TestClass]
    public class DataEnemyListParserTest : ParserTestBase
    {
        private const string sampleDataFile = "SampleData\\Enemies.json";
        /// <summary>
        /// データ解析テスト。
        /// </summary>
        [TestMethod]
        public void TestParse()
        {
            RunParseTest(sampleDataFile);
        }

        /// <summary>
        /// ストリームからリストを読み出す。
        /// </summary>
        /// <param name="stream">ストリーム</param>
        /// <returns>リスト</returns>
        protected override System.Collections.IList ReadListFromStream(Stream stream)
        {
            return DataEnemyListParser.Read(stream);
        }
    }
}

