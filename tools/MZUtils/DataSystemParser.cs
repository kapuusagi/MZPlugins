using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// System.jsonをパースして格納するためのクラス。
    /// </summary>
    public static class DataSystemParser
    {
        /// <summary>
        /// pathで指定されるデータを読み出す。
        /// </summary>
        /// <param name="path">ファイルパス</param>
        public static DataSystem Read(string path)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataSystemConstructor()
            };
            return (DataSystem)(reader.Read(path));
        }

        /// <summary>
        /// streamからデータを読み出す。
        /// </summary>
        /// <param name="stream">ストリーム</param>
        /// <returns>システムデータ</returns>
        public static DataSystem Read(System.IO.Stream stream)
        {
            DataReader reader = new DataReader()
            {
                DataConstructor = new DataSystemConstructor()
            };
            return (DataSystem)(reader.Read(stream));
        }

        /// <summary>
        /// システムデータコンストラクタ
        /// </summary>
        private class DataSystemConstructor : DataConstructorBase
        {
            /// <summary>
            /// 空のディクショナリデータを構築する。
            /// </summary>
            /// <param name="parent">親オブジェクト</param>
            /// <param name="paramName">名前(無い場合にはnull)</param>
            /// <returns>空のディクショナリデータ</returns>
            public override object CreateDictionary(object parent, string paramName)
            {
                if (parent == null)
                {
                    return new DataSystem();
                }
                else if (parent is DataSystem)
                {
                    switch (paramName)
                    {
                        case "advanced":
                            return new DataAdvanced();
                        case "airship":
                        case "boat":
                        case "ship":
                            return new DataVehicle();
                        case "battleBgm":
                        case "defeatMe":
                        case "gameoverMe":
                        case "titleBgm":
                        case "victoryMe":
                            return new DataBgm();
                        case "terms":
                            return new DataTerms();
                        case "titleCommandWindow":
                            return new DataTitleCommandWindow();
                    }
                }
                else if (parent is DataVehicle)
                {
                    switch (paramName)
                    {
                        case "bgm":
                            return new DataBgm();
                    }
                }
                else if (parent is DataTerms)
                {
                    switch (paramName)
                    {
                        case "messages":
                            return new Dictionary<string, string>();
                    }
                }
                else if (parent is List<DataAttackMotion>)
                {
                    return new DataAttackMotion();
                }
                else if (parent is List<DataBgm>)
                {
                    return new DataBgm();
                }
                else if (parent is List<DataTestBattler>)
                {
                    return new DataTestBattler();
                }

                throw new Exception(nameof(CreateDictionary) + ";Unknown field " + paramName);
            }
            /// <summary>
            /// dictionaryにkey,dataをセットする。
            /// </summary>
            /// <param name="dictionary">ディクショナリオブジェクト。CreateDictionaryで構築したやつ</param>
            /// <param name="key">キー</param>
            /// <param name="data">データオブジェクト</param>
            public override void SetDictionaryData(object dictionary, string key, object data)
            {
                if (dictionary is DataSystem dataSystem)
                {
                    dataSystem.SetValue(key, data);
                }
                else if (dictionary is DataAdvanced dataAdvanced)
                {
                    dataAdvanced.SetValue(key, data);
                }
                else if (dictionary is DataVehicle dataVehicle)
                {
                    dataVehicle.SetValue(key, data);
                }
                else if (dictionary is DataBgm dataBgm)
                {
                    dataBgm.SetValue(key, data);
                }
                else if (dictionary is DataAttackMotion dataAttackMotion)
                {
                    dataAttackMotion.SetValue(key, data);
                }
                else if (dictionary is DataTerms dataTerms)
                {
                    dataTerms.SetValue(key, data);
                }
                else if (dictionary is Dictionary<string, string> messageEntries)
                {
                    messageEntries[key] = (string)(data);
                }
                else if (dictionary is DataTestBattler dataTestBattler)
                {
                    dataTestBattler.SetValue(key, data);
                }
                else if (dictionary is DataTitleCommandWindow titleCommandWindow)
                {
                    titleCommandWindow.SetValue(key, data);
                }
                else
                {
                    throw new Exception(nameof(SetDictionaryData) + ":Unknown field. : " + key);
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
                if (parent is DataSystem)
                {
                    switch (paramName)
                    {
                        case "armorTypes":
                        case "elements":
                        case "equipTypes":
                        case "skillTypes":
                        case "switches":
                        case "variables":
                        case "weaponTypes":
                            return new List<string>();
                        case "attackMotions":
                            return new List<DataAttackMotion>();
                        case "itemCategories":
                        case "menuCommands":
                            return new List<bool>();
                        case "magicSkills":
                        case "partyMembers":
                        case "windowTone":
                            return new List<int>();
                        case "sounds":
                            return new List<DataBgm>();
                        case "testBattlers":
                            return new List<DataTestBattler>();
                    }
                }
                else if (parent is DataTerms)
                {
                    switch (paramName)
                    {
                        case "basic":
                        case "commands":
                        case "params":
                            return new List<string>();
                    }
                }
                else if (parent is DataTestBattler)
                {
                    switch (paramName)
                    {
                        case "equips":
                            return new List<int>();
                    }
                }

                throw new Exception(nameof(CreateArray) + ":Unknown array field. : " + paramName);
            }
            /// <summary>
            /// 行列にデータを格納する
            /// </summary>
            /// <param name="array"行列></param>
            /// <param name="data">データ</param>
            public override void AddArrayData(object array, object data)
            {
                if (array is List<string> strList)
                {
                    strList.Add((string)(data));
                }
                else if (array is List<DataAttackMotion> attackMotions)
                {
                    attackMotions.Add((DataAttackMotion)(data));
                }
                else if (array is List<bool> boolList)
                {
                    boolList.Add((bool)(data));
                }
                else if (array is List<int> intList)
                {
                    intList.Add((int)((double)(data)));
                }
                else if (array is List<DataBgm> sounds)
                {
                    sounds.Add((DataBgm)(data));
                }
                else if (array is List<DataTestBattler> testBattlers)
                {
                    testBattlers.Add((DataTestBattler)(data));
                }
                else
                {
                    throw new Exception(nameof(AddArrayData) + ":Unknown array.");
                }
            }
        }
    }
}
