using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using MZUtils;
using System.Reflection;

namespace MZUtilsTest
{

    /// <summary>
    /// DataSystemParserのテスト
    /// </summary>
    [TestClass]
    public class DataSystemTest
    {
        private const string sampleDataFile = "SampleData\\System.json";
        /// <summary>
        /// データ解析テスト
        /// </summary>
        [TestMethod]
        public void TestParse()
        {
            try
            {
                var readSystem = DataSystemParser.Read(sampleDataFile);

                // メモリストリームを使って文字列化->復元をする。
                var bytes = System.Text.Encoding.UTF8.GetBytes(readSystem.ToString());
                DataSystem encodedSystem = null;
                using (var ms = new System.IO.MemoryStream(bytes))
                {
                    ms.Position = 0;
                    encodedSystem = DataSystemParser.Read(ms);
                }

                Assert.AreEqual(readSystem.ToString(), encodedSystem.ToString());

            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e);
                Assert.Fail(e.Message);
            }
        }

        private void CheckMembers(string paramName, object obj1, object obj2)
        {
            if ((obj1 == null) && (obj2 == null))
            {
                return;
            }
            else if ((obj1 == null) && (obj2 != null))
            {
                Assert.Fail($"{paramName}: value1 is null, however value2 is not null.");
            }
            else if ((obj1 != null) && (obj2 == null))
            {
                Assert.Fail($"{paramName}: value1 is not null, however value2 is null.");
            }


            Type type = obj1.GetType();
            if (type == typeof(int))
            {
                int value1 = (int)(obj1);
                int value2 = (int)(obj2);
                Assert.AreEqual(value1, value2, $"{paramName} incorrect.");
            }
            else if (type == typeof(double))
            {
                int nearInt1 = (int)((double)(obj1) * 1000);
                int nearInt2 = (int)((double)(obj2) * 1000);

                Assert.AreEqual(nearInt1, nearInt2, $"{paramName} incorrect.");
            }
            else if (type == typeof(string))
            {
                string str1 = (string)(obj1);
                string str2 = (string)(obj2);
                Assert.AreEqual(str1, str2, $"{paramName} incorrect");
            }
            else if (obj1 is System.Collections.IList)
            {
                var array1 = (System.Collections.IList)(obj1);
                var array2 = (System.Collections.IList)(obj2);
                Assert.AreEqual(array1.Count, array2.Count, $"{paramName} member count mismatch.");
                for (int i = 0; i < array1.Count; i++)
                {
                    var value1 = array1[i];
                    var value2 = array2[i];

                    CheckMembers($"{paramName}[{i}]", value1, value2);
                }
            }
            else if (obj2 is System.Collections.IDictionary)
            {
                // ディクショナリはちょっと面倒。
                var dictionary1 = (System.Collections.IDictionary)(obj1);
                var dictionary2 = (System.Collections.IDictionary)(obj2);
                Assert.AreEqual(dictionary1.Count, dictionary2.Count, $"{paramName} member count mismatch.");

                var keys = dictionary1.Keys;
                foreach (var key in keys)
                {
                    // どっちもキーがとれるはず。
                    var value1 = dictionary1[key];
                    var value2 = dictionary2[key];
                    CheckMembers($"{paramName}[{key}]", value1, value2);
                }
            }
            else
            {
                var properties = type.GetProperties();
                foreach (var prop in properties)
                {
                    if (prop.CanRead && prop.CanWrite)
                    {
                        string fieldName = $"{paramName}.{prop.Name}";

                        try
                        {
                            var value1 = prop.GetValue(obj1);
                            var value2 = prop.GetValue(obj2);
                            CheckMembers(fieldName, value1, value2);
                        }
                        catch (Exception ex)
                        {
                            throw new Exception($"{fieldName}:{ex.Message}", ex);
                        }
                    }
                }
            }

        }

    }
}
