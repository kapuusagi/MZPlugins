using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Diagnostics;
using MZUtils;
using System.IO;

namespace MZUtilsTest
{
    /// <summary>
    /// DataActorListParserTest の概要の説明
    /// </summary>
    [TestClass]
    public class DataActorListParserTest : ParserTestBase
    {
        private const string sampleDataFile = "SampleData\\Actors.json";
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
            return DataActorListParser.Read(stream);
        }

    }
}
