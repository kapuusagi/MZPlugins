using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO;
using MZUtils;

namespace MZUtilsTest
{
    [TestClass]
    public class DataArmorListParserTest : ParserTestBase
    {
        private const string sampleDataFile = "SampleData\\Armors.json";
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
            return DataArmorListParser.Read(stream);
        }
    }
}
