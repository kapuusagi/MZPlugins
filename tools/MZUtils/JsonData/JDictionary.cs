using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MZUtils.JsonData
{
    /// <summary>
    /// Jsonの連想配列を表現するためのクラス。
    /// </summary>
    public class JDictionary : JObject, IEnumerable<KeyValuePair<string, JObject>>
    {
        // ディクショナリ
        private Dictionary<string, JObject> dictionary;

        /// <summary>
        /// 新しいJDictionaryオブジェクトを構築する。
        /// </summary>
        public JDictionary()
        {
            dictionary = new Dictionary<string, JObject>();
        }
        /// <summary>
        /// ディクショナリ要素へのアクセス
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <returns>データ</returns>
        public JObject this[string key] {
            get {
                if (dictionary.ContainsKey(key))
                {
                    return dictionary[key];
                }
                else
                {
                    return null;
                }
            }
            set {
                if (dictionary.ContainsKey(key))
                {
                    dictionary[key] = value;
                }
                else
                {
                    dictionary.Add(key, value);
                }
            }
        }

        /// <summary>
        /// この連想配列の要素にアクセスするためのキー
        /// </summary>
        public string[] Keys {
            get => dictionary.Keys.ToArray();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
            => GetEnumerator();

        /// <summary>
        /// この連想配列の要素にアクセスするための列挙子を得る。
        /// </summary>
        /// <returns>列挙子</returns>
        public IEnumerator<KeyValuePair<string, JObject>> GetEnumerator()
        {
            return dictionary.GetEnumerator();
        }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append('{');
            foreach (var pair in dictionary)
            {
                sb.Append('"').Append(pair.Key).Append("\":").Append(pair.Value.ToString()).Append(',');
            }
            sb.Append('}');
            return sb.ToString();
        }
    }
}
