using MZUtils.JsonData;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

namespace MZUtils
{
    /// <summary>
    /// アイテム一覧のパーサー
    /// </summary>
    public static class DataItemListParser
    {
        /// <summary>
        /// pathで指定されたファイルから読み出す。
        /// </summary>
        /// <param name="path">ファイルパス</param>
        /// <returns>DataItemのリスト</returns>
        public static List<DataItem> Read(string path)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataItemConstructor()
            };
            return (List<DataItem>)(reader.Read(path));
        }
        /// <summary>
        /// pathで指定されたファイルから読み出す。
        /// </summary>
        /// <param name="stream">ストリーム</param>
        /// <returns>DataItemのリスト</returns>
        public static List<DataItem> Read(System.IO.Stream stream)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataItemConstructor()
            };
            return (List<DataItem>)(reader.Read(stream));
        }
        /// <summary>
        /// アイテムデータを読み出して構築するクラス
        /// </summary>
        private class DataItemConstructor : DataConstructorBase
        {
            /// <summary>
            /// 空のディクショナリデータを構築する。
            /// </summary>
            /// <param name="parent">親オブジェクト</param>
            /// <param name="paramName">名前(無い場合にはnull)</param>
            /// <returns>空のディクショナリデータ</returns>
            public override object CreateDictionary(object parent, string paramName)
            {
                if (parent is List<DataItem>)
                {
                    return new DataItem();
                }
                if (parent is List<Effect>)
                {
                    return new Effect();
                }
                else if (parent is DataItem)
                {
                    if (paramName.Equals("damage"))
                    {
                        return new DamageEffect();
                    }
                }
                // ここに来ることはないはず。
                throw new Exception("Parse error.");
            }
            /// <summary>
            /// dictionaryにkey,dataをセットする。
            /// </summary>
            /// <param name="dictionary">ディクショナリオブジェクト。CreateDictionaryで構築したやつ</param>
            /// <param name="key">キー</param>
            /// <param name="data">データオブジェクト</param>
            public override void SetDictionaryData(object dictionary, string key, object data)
            {
                try
                {
                    if (dictionary is DataItem item)
                    {
                        item.SetValue(key, data);
                    }
                    else if (dictionary is DamageEffect damage)
                    {
                        damage.SetValue(key, data);
                    }
                    else if (dictionary is Effect effect)
                    {
                        effect.SetValue(key, data);
                    }
                    else
                    {
                        throw new Exception("Parse error");
                    }
                }
                catch (Exception e)
                {
                    throw new Exception($"{nameof(DataItemListParser)}: {dictionary.GetType().Name}'s {key} = {data} :.{e.Message}");
                }
            }

            /// <summary>
            /// 空の行列を作成する。
            /// </summary>
            /// <param name="parent">親オブジェクト</param>
            /// <param name="paramName">パラメータ名</param>
            /// <returns>空の配列データ</returns>
            public override object CreateArray(object parent, string paramName)
            {
                if (parent == null)
                {
                    return new List<DataItem>();
                }
                else if (parent is DataItem)
                {
                    if (paramName.Equals("effects"))
                    {
                        return new List<Effect>();
                    }
                }

                // ここに来ることはないはず。
                throw new Exception("Parse error.");
            }
            /// <summary>
            /// 行列にデータを格納する
            /// </summary>
            /// <param name="array"行列></param>
            /// <param name="data">データ</param>
            public override void AddArrayData(object array, object data)
            {
                if (array is List<DataItem> itemList)
                {
                    itemList.Add((DataItem)(data));
                }
                else if (array is List<Effect> effects)
                {
                    effects.Add((Effect)(data));
                }
                else
                {
                    throw new Exception("Parse error");
                }
            }
        }

    }
}
