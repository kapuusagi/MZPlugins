using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// Actors.jsonデータをパースするためのクラス。
    /// </summary>
    public static class DataActorListParser
    {
        /// <summary>
        /// pathで指定されたファイルから読み出す。
        /// </summary>
        /// <param name="path">ファイルパス</param>
        /// <returns>DataActorのリスト</returns>
        public static List<DataActor> Read(string path)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataActorConstructor()
            };
            return (List<DataActor>)(reader.Read(path));
        }

        /// <summary>
        /// streamで指定されたファイルから読み出す。
        /// </summary>
        /// <param name="stream">ストリーム</param>
        /// <returns>DataActorのリスト</returns>
        public static List<DataActor> Read(System.IO.Stream stream)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataActorConstructor()
            };
            return (List<DataActor>)(reader.Read(stream));
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
                if (parent is List<Trait>)
                {
                    return new Trait();
                }
                else if (parent is List<DataActor>)
                {
                    return new DataActor();
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
                    if (dictionary is Trait trait)
                    {
                        trait.SetValue(key, data);
                    }
                    else if (dictionary is DataActor dataActor)
                    {
                        dataActor.SetValue(key, data);
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
                    return new List<DataActor>();
                }
                else if (parent is DataActor)
                {
                    if (paramName.Equals("equips"))
                    {
                        return new List<int>();
                    }
                    else if (paramName.Equals("traits"))
                    {
                        return new List<Trait>();
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
                if (array is List<DataActor> actorList)
                {
                    actorList.Add((DataActor)(data));
                }
                else if (array is List<int> equips)
                {
                    equips.Add((int)((double)(data)));
                }
                else if (array is List<Trait> traits)
                {
                    traits.Add((Trait)(data));
                }
                else
                {
                    throw new Exception("Parse error");
                }
            }

        };


    }
}
