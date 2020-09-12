using MZUtils.JsonData;
using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils
{
    /// <summary>
    /// Enemies.jsonをパースするためのクラス。
    /// </summary>
    public static class DataEnemyListParser
    {
        /// <summary>
        /// pathで指定されるデータを読み出す。
        /// </summary>
        /// <param name="path">ファイルパス</param>
        /// <returns>エネミーリスト</returns>
        public static List<DataEnemy> Read(string path)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataEnemyConstructor()
            };
            return (List<DataEnemy>)(reader.Read(path));
        }

        /// <summary>
        /// streamからデータを読み出す。
        /// </summary>
        /// <param name="stream">ストリーム</param>
        /// <returns>エネミーリスト</returns>
        public static List<DataEnemy> Read(System.IO.Stream stream)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataEnemyConstructor()
            };
            return (List<DataEnemy>)(reader.Read(stream));
        }

        /// <summary>
        /// データコンストラクタ
        /// </summary>
        private class DataEnemyConstructor : DataConstructorBase
        {

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
                    return new List<DataEnemy>();
                }
                else if (parent is DataEnemy)
                {
                    if (paramName.Equals("actions"))
                    {
                        return new List<EnemyAction>();
                    }
                    else if (paramName.Equals("dropItems"))
                    {
                        return new List<DropItem>();
                    }
                    else if (paramName.Equals("traits"))
                    {
                        return new List<Trait>();
                    }
                    else if (paramName.Equals("params"))
                    {
                        return new List<int>();
                    }
                }

                throw new Exception("Parse error : " + paramName);
            }

            /// <summary>
            /// 行列にデータを格納する
            /// </summary>
            /// <param name="array"行列></param>
            /// <param name="data">データ</param>
            public override void AddArrayData(object array, object data)
            {
                if (array is List<DataEnemy> enemies)
                {
                    enemies.Add((DataEnemy)(data));
                }
                else if (array is List<EnemyAction> actions)
                {
                    actions.Add((EnemyAction)(data));
                }
                else if (array is List<DropItem> dropItems)
                {
                    dropItems.Add((DropItem)(data));
                }
                else if (array is List<Trait> traits)
                {
                    traits.Add((Trait)(data));
                }
                else if (array is List<int> paramList)
                {
                    paramList.Add((int)((double)(data)));
                }
            }

            /// <summary>
            /// 空のディクショナリデータを構築する。
            /// </summary>
            /// <param name="parent">親オブジェクト</param>
            /// <param name="paramName">名前(無い場合にはnull)</param>
            /// <returns>空のディクショナリデータ</returns>
            public override object CreateDictionary(object parent, string paramName)
            {
                if (parent is List<DataEnemy>)
                {
                    return new DataEnemy();
                }
                else if (parent is List<EnemyAction>)
                {
                    return new EnemyAction();
                }
                else if (parent is List<DropItem>)
                {
                    return new DropItem();
                }
                else if (parent is List<Trait>)
                {
                    return new Trait();
                }
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
                    if (dictionary is DataEnemy enemy)
                    {
                        enemy.SetValue(key, data);
                    }
                    else if (dictionary is EnemyAction action)
                    {
                        action.SetValue(key, data);
                    }
                    else if (dictionary is DropItem dropItem)
                    {
                        dropItem.SetValue(key, data);
                    }
                    else if (dictionary is Trait trait)
                    {
                        trait.SetValue(key, data);
                    }
                }
                catch (Exception e)
                {
                    throw new Exception($"{nameof(DataEnemyListParser)}: {dictionary.GetType().Name}'s {key} = {data} :.{e.Message}");
                }
            }
        }
    }
}
