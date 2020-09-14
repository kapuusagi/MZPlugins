using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MZUtils.JsonData
{
    /// <summary>
    /// Jsonの配列データを表すクラス。
    /// </summary>
    public class JArray : JObject, IEnumerable<JObject>
    {
        // 配列データ
        private List<JObject> array;

        /// <summary>
        /// 新しいJArrayオブジェクトを構築する。
        /// </summary>
        public JArray()
        {
            array = new List<JObject>();
        }

        /// <summary>
        /// objを末尾に追加する。
        /// </summary>
        /// <param name="obj">オブジェクト</param>
        public void Add(JObject obj)
        {
            array.Add(obj);
        }

        /// <summary>
        /// 行列のデータ数
        /// </summary>
        public int Count {
            get => array.Count;
        }

        /// <summary>
        /// 行列要素へのアクセス
        /// </summary>
        /// <param name="index">インデックス</param>
        /// <returns>データ</returns>
        public JObject this[int index] {
            get {
                if ((index >= 0) && (index < array.Count))
                {
                    return array[index];
                }
                else
                {
                    return null;
                }
            }
            set {
                while (array.Count <= index)
                {
                    array.Add(null);
                }
                array[index] = value;
            }
        }

        /// <summary>
        /// 要素にアクセスするための列挙子を取得する。
        /// </summary>
        /// <returns>列挙子</returns>
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
            => GetEnumerator();

        /// <summary>
        /// 要素にアクセスするための列挙子を取得する。
        /// </summary>
        /// <returns>列挙子</returns>
        public IEnumerator<JObject> GetEnumerator()
            => array.GetEnumerator();

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列表現</returns>
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append('[');
            foreach (JObject obj in array)
            {
                sb.Append(obj.ToString()).Append(',');
            }
            sb.Append(']');

            return sb.ToString();
        }

    }
}
