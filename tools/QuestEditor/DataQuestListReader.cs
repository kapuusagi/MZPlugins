using MZUtils;
using MZUtils.JsonData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    /// <summary>
    /// Quests.jsonを読み出してリストとして取得するためのリーダー
    /// </summary>
    public static class DataQuestListReader
    {
        /// <summary>
        /// pathで指定されたファイルを読み込み、Quests.jsonデータを構築して返す。
        /// </summary>
        /// <param name="path">パス</param>
        /// <returns>データ</returns>
        public static List<DataQuest> Read(string path)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataQuestConstructor()
            };
            return (List<DataQuest>)(reader.Read(path));
        }

        /// <summary>
        /// クエストデータリストを構築するためのデータコンストラクタ
        /// </summary>
        private class DataQuestConstructor : DataConstructorBase
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
                    return new List<DataQuest>();
                }
                else if (parent is DataQuest)
                {
                    if (paramName.Equals("achieves"))
                    {
                        return new List<DataAchieve>();
                    }
                    else if (paramName.Equals("rewardItems"))
                    {
                        return new List<RewardItem>();
                    }
                }

                throw new Exception("Parse error. : " + paramName);
            }

            /// <summary>
            /// 行列にデータを格納する
            /// </summary>
            /// <param name="array"行列></param>
            /// <param name="data">データ</param>
            public override void AddArrayData(object array, object data)
            {
                if (array is List<DataQuest> quests)
                {
                    quests.Add((DataQuest)(data));
                }
                else if (array is List<RewardItem> rewardItems)
                {
                    if (data != null)
                    {
                        rewardItems.Add((RewardItem)(data));
                    }
                }
                else if (array is List<DataAchieve> achieves)
                {
                    if (data != null)
                    {
                        achieves.Add((DataAchieve)(data));
                    }
                }
                else if (array is List<int> achieve)
                {
                    achieve.Add((int)((double)(data)));
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
                if (parent is List<DataQuest>)
                {
                    return new DataQuest();
                }
                else if (parent is List<RewardItem>)
                {
                    return new RewardItem();
                }
                else if (parent is List<DataAchieve>)
                {
                    return new DataAchieve();
                }

                throw new Exception("Parse error : " + paramName);
            }
            /// <summary>
            /// dictionaryにkey,dataをセットする。
            /// </summary>
            /// <param name="dictionary">ディクショナリオブジェクト。CreateDictionaryで構築したやつ</param>
            /// <param name="key">キー</param>
            /// <param name="data">データオブジェクト</param>
            public override void SetDictionaryData(object dictionary, string key, object data)
            {
                if (dictionary is DataQuest quest)
                {
                    quest.SetValue(key, data);
                }
                else if (dictionary is RewardItem reward)
                {
                    reward.SetValue(key, data);
                }
                else if (dictionary is DataAchieve achieve)
                {
                    achieve.SetValue(key, data);
                }
            }


        }


    }
}
