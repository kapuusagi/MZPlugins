using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MZUtils;
using MZUtils.JsonData;

namespace SEditor
{
    public static class DataShopListReader
    {
        /// <summary>
        /// pathで指定されたファイルから読み出す。
        /// </summary>
        /// <param name="path">ファイルパス</param>
        /// <returns>DataActorのリスト</returns>
        public static List<DataShop> Read(string path)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataActorConstructor()
            };
            return (List<DataShop>)(reader.Read(path));
        }

        /// <summary>
        /// アクターデータを解析して構築するためのクラス。
        /// </summary>
        private class DataActorConstructor : DataConstructorBase
        {
            /// <summary>
            /// 空のディクショナリデータを構築する。
            /// </summary>
            /// <param name="parent">親オブジェクト</param>
            /// <param name="paramName">名前(無い場合にはnull)</param>
            /// <returns>空のディクショナリデータ</returns>
            public override object CreateDictionary(object parent, string paramName)
            {
                if (parent is List<DataShop>)
                {
                    return new DataShop();
                }
                else if (parent is List<ItemEntry>)
                {
                    return new ItemEntry();
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
                    if (dictionary is DataShop shop)
                    {
                        shop.SetValue(key, data);
                    }
                    else if (dictionary is ItemEntry itemEntry)
                    {
                        itemEntry.SetValue(key, data);
                    }
                    else
                    {
                        throw new Exception("Parse error");
                    }
                }
                catch (Exception e)
                {
                    throw new Exception($"{nameof(DataActorListParser)}: {dictionary.GetType().Name}'s {key} = {data} :.{e.Message}");
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
                    return new List<DataShop>();
                }
                else if (parent is DataShop)
                {
                    if (paramName.Equals("itemList"))
                    {
                        return new List<ItemEntry>();
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
                if (array is List<DataShop> shopList)
                {
                    shopList.Add((DataShop)(data));
                }
                else if (array is List<ItemEntry> items)
                {
                    items.Add((ItemEntry)(data));
                }
                else
                {
                    throw new Exception("Parse error");
                }
            }

        };
    }
}
