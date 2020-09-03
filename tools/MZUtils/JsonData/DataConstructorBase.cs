using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils.JsonData
{
    /// <summary>
    /// IDataConstractorの基本実装
    /// 多分JObjectとか余計な実装しなくても、こっちでいけるはず。
    /// </summary>
    public class DataConstructorBase : IDataConstructor
    {
        /// <summary>
        /// 空のディクショナリデータを構築する。
        /// </summary>
        /// <param name="parent">親オブジェクト</param>
        /// <param name="paramName">名前(無い場合にはnull)</param>
        /// <returns>空のディクショナリデータ</returns>
        public virtual object CreateDictionary(object parent, string paramName)
        {
            return new Dictionary<string, object>();
        }
        /// <summary>
        /// dictionaryにkey,dataをセットする。
        /// </summary>
        /// <param name="dictionary">ディクショナリオブジェクト。CreateDictionaryで構築したやつ</param>
        /// <param name="key">キー</param>
        /// <param name="data">データオブジェクト</param>
        public virtual void SetDictionaryData(object dictionary, string key, object data)
        {
            Dictionary<string, object> dictionaryObj = (Dictionary<string, object>)(dictionary);
            if (dictionaryObj.ContainsKey(key))
            {
                dictionaryObj[key] = data;
            }
            else
            {
                dictionaryObj.Add(key, data);
            }
        }

        /// <summary>
        /// 空の行列を作成する。
        /// </summary>
        /// <param name="parent">親オブジェクト</param>
        /// <param name="paramName">パラメータ名</param>
        /// <returns>空の配列データ</returns>
        public virtual object CreateArray(object parent, string paramName)
        {
            return new List<object>();
        }
        /// <summary>
        /// 行列にデータを格納する
        /// </summary>
        /// <param name="array"行列></param>
        /// <param name="data">データ</param>
        public virtual void AddArrayData(object array, object data)
        {
            List<object> arrayObj = (List<object>)(array);
            arrayObj.Add(data);
        }
        /// <summary>
        /// プリミティブデータを作成する。
        /// </summary>
        /// <param name="valueStr">データ文字列</param>
        /// <param name="isString">文字列データとして指定されている場合にtrue</param>
        /// <returns>プリミティブデータ</returns>
        public virtual object CreatePrimitive(string valueStr, bool isString)
        {
            if (valueStr.Equals("null"))
            {
                return null;
            }
            else if (valueStr.Length == 0)
            {
                return string.Empty;
            }
            else if (!isString && double.TryParse(valueStr, out double d))
            {
                return d;
            }
            else if (!isString && bool.TryParse(valueStr, out bool b))
            {
                return b;
            }
            else
            {
                return valueStr;
            }
        }
    }
}
