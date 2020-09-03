using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// Armors.jsonデータをパースするためのクラス。
    /// </summary>
    public static class DataArmorListParser
    {
        /// <summary>
        /// Armors.jsonを読み出してDataArmor配列を取得する。
        /// </summary>
        /// <param name="path">ファイルパス</param>
        /// <returns>DataArmorリスト</returns>
        public static List<DataArmor> Read(string path)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataArmorConstructor()
            };
            return (List<DataArmor>)(reader.Read(path));
        }

        /// <summary>
        /// Armors.jsonのデータを読み出してDataArmor配列を取得する。
        /// </summary>
        /// <param name="stream">ストリーム</param>
        /// <returns>DataArmorリスト</returns>
        public static List<DataArmor> Read(System.IO.Stream stream)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataArmorConstructor()
            };
            return (List<DataArmor>)(reader.Read(stream));
        }

        private class DataArmorConstructor : DataConstructorBase
        {
            /// <summary>
            /// 空のディクショナリデータを構築する。
            /// </summary>
            /// <param name="parent">親オブジェクト</param>
            /// <param name="paramName">名前(無い場合にはnull)</param>
            /// <returns>空のディクショナリデータ</returns>
            public override object CreateDictionary(object parent, string paramName)
            {
                if (parent is List<DataArmor>)
                {
                    return new DataArmor();
                }
                if (parent is List<Trait>)
                {
                    return new Trait();
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
                    if (dictionary is DataArmor armor)
                    {
                        armor.SetValue(key, data);
                    }
                    else if (dictionary is Trait trait)
                    {
                        trait.SetValue(key, data);
                    }
                    else
                    {
                        throw new Exception("Parse error");
                    }
                }
                catch (Exception e)
                {
                    throw new Exception($"{nameof(DataArmorListParser)}: {dictionary.GetType().Name}'s {key} = {data} :.{e.Message}");
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
                    return new List<DataArmor>();
                }
                else if (parent is DataArmor)
                {
                    if (paramName.Equals("traits"))
                    {
                        return new List<Trait>();
                    }
                    else if (paramName.Equals("params"))
                    {
                        return new List<int>();
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
                if (array is List<DataArmor> armorList)
                {
                    armorList.Add((DataArmor)(data));
                }
                else if (array is List<Trait> traits)
                {
                    traits.Add((Trait)(data));
                }
                else if (array is List<int> paramList)
                {
                    paramList.Add((int)((double)(data)));
                }
                else
                {
                    throw new Exception("Parse error");
                }
            }
        }
    }
}
