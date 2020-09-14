using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MZUtils.JsonData
{
    public static class Dumper
    {
        /// <summary>
        /// ダンプする。
        /// </summary>
        /// <param name="obj">出力するオブジェクト</param>
        /// <param name="output">出力先</param>
        public static void Dump(JObject obj, System.IO.Stream output)
        {
            System.IO.TextWriter writer = new System.IO.StreamWriter(output);
            Dump(obj, writer);
        }

        /// <summary>
        /// ダンプする。
        /// </summary>
        /// <param name="obj">ダンプするオブジェクト</param>
        /// <param name="writer">出力先</param>
        public static void Dump(JObject obj, System.IO.TextWriter writer)
        {
            IndentWriter mw = new IndentWriter(writer);
            DumpObject(mw, null, obj);
        }

        /// <summary>
        /// オブジェクトをダンプする。
        /// </summary>
        /// <param name="writer">出力先</param>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="obj">オブジェクト</param>
        private static void DumpObject(IndentWriter writer, string paramName, JObject obj)
        {
            if (obj == null)
            {
                if (string.IsNullOrEmpty(paramName))
                {
                    writer.WriteLine(null);
                }
                else
                {
                    writer.WriteLine($"{paramName} : null");
                }
            }
            else if (obj is JPrimitive p)
            {
                if (string.IsNullOrEmpty(paramName))
                {
                    writer.WriteLine(p.ToString());
                }
                else
                {
                    writer.WriteLine($"{paramName} : {p}");

                }
            }
            else if (obj is JArray array)
            {
                DumpArray(writer, paramName, array);
            }
            else if (obj is JDictionary dictionary)
            {
                DumpDictionary(writer, paramName, dictionary);
            }

        }

        /// <summary>
        /// 配列をダンプする。
        /// </summary>
        /// <param name="writer">出力先</param>
        /// <param name="array">配列</param>
        private static void DumpArray(IndentWriter writer, string paramName, JArray array)
        {
            if (string.IsNullOrEmpty(paramName))
            {
                writer.WriteLine("[");
            }
            else
            {
                writer.WriteLine($"{paramName} : [");
            }
            writer.Indent += 2;
            for (int i = 0; i < array.Count; i++)
            {
                JObject obj = array[i];
                if (obj == null)
                {
                    writer.WriteLine("null,");
                }
                else if (array[i] is JPrimitive p)
                {
                    writer.WriteLine($"{p},");
                }
                else
                {
                    DumpObject(writer, null, obj);
                }
            }
            writer.Indent -= 2;
            writer.WriteLine("]");
        }

        /// <summary>
        /// ディクショナリをダンプする。
        /// </summary>
        /// <param name="writer">出力先</param>
        /// <param name="dictionary">ディクショナリ</param>
        private static void DumpDictionary(IndentWriter writer, string paramName, JDictionary dictionary)
        {
            if (string.IsNullOrEmpty(paramName))
            {
                writer.WriteLine("{");
            }
            else
            {
                writer.WriteLine($"{paramName} : {{");
            }
            writer.Indent += 2;
            string[] keys = dictionary.Keys;
            for (int i = 0; i < keys.Length; i++)
            {
                string key = keys[i];
                JObject obj = dictionary[key];
                if (obj == null)
                {
                    writer.WriteLine($"{key}:null,");
                }
                else if (obj is JPrimitive p)
                {
                    writer.WriteLine($"{key}:{p},");
                }
                else
                {
                    DumpObject(writer, key, obj);
                }
            }
            writer.Indent -= 2;
            writer.WriteLine("}");
        }

    }
}
