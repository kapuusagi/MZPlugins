using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MZUtils;

namespace PEditor
{
    public static class DataActorProfileReader
    {
        /// <summary>
        /// プロフィールデータを読み出す。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        /// <returns>プロフィールデータ配列</returns>
        public static List<DataActorProfile> Read(string dir)
        {
            List<DataActorProfile> list = null;
            string actorsPath = System.IO.Path.Combine(dir, "Actors.json");
            string profilePath = System.IO.Path.Combine(dir, "ActorProfiles.json");
            if (!System.IO.File.Exists(actorsPath)
                && !System.IO.File.Exists(profilePath))
            {
                throw new System.IO.FileNotFoundException("Profile data not exists.");
            }

            List<DataActor> actorList = null;
            if (System.IO.File.Exists(actorsPath))
            {
                // 一覧があるので、こちらからインデックスデータを構築する。
                actorList = DataActorListParser.Read(actorsPath);
            }
            else
            {
                actorList = new List<DataActor>();
            }

            if (System.IO.File.Exists(profilePath))
            {
                var reader = new MZUtils.JsonData.DataReader()
                {
                    DataConstructor = new DataActorProfileConstructor()
                };
                list = (List<DataActorProfile>)(reader.Read(profilePath));
            }
            else
            {
                list = new List<DataActorProfile>();
            }

            // acotrListにあって、listにないエントリがあったらlistに追加する。
            // 逆はやらないでおく。
            foreach (DataActor actor in actorList)
            {
                if (actor == null)
                {
                    continue;
                }
                var actorProfile = list.Find((ap) => (ap != null) && (ap.Id == actor.Id));
                if (actorProfile != null)
                {
                    // 存在する。
                    actorProfile.Name = actor.Name;
                }
                else
                {
                    // 存在しない。
                    list.Add(new DataActorProfile() { Id = actor.Id, Name = actor.Name });
                }
            }
            if (!list.Contains(null))
            {
                // nullは1つは必要。
                list.Add(null);
            }

            // ID順にソート
            list.Sort((ap1, ap2) =>
            {
                if (ap1 == null)
                {
                    return -1;
                }
                else if (ap2 == null)
                {
                    return 1;
                }
                else
                {
                    return ap1.Id - ap2.Id;
                }
            });

            return list;
        }

        /// <summary>
        /// DataActorProfileリストを構築するためのコンストラクタ
        /// </summary>
        private class DataActorProfileConstructor : MZUtils.JsonData.DataConstructorBase
        {
            /// <summary>
            /// 空のディクショナリデータを構築する。
            /// </summary>
            /// <param name="parent">親オブジェクト</param>
            /// <param name="paramName">名前(無い場合にはnull)</param>
            /// <returns>空のディクショナリデータ</returns>
            public override object CreateDictionary(object parent, string paramName)
            {
                if (parent is List<DataActorProfile>)
                {
                    return new DataActorProfile();
                }
                else if (parent is List<Profile>)
                {
                    return new Profile();
                }

                throw new Exception("Parse error");                
            }
            /// <summary>
            /// dictionaryにkey,dataをセットする。
            /// </summary>
            /// <param name="dictionary">ディクショナリオブジェクト。CreateDictionaryで構築したやつ</param>
            /// <param name="key">キー</param>
            /// <param name="data">データオブジェクト</param>
            public override void SetDictionaryData(object dictionary, string key, object data)
            {
                if (dictionary is DataActorProfile actorProfile)
                {
                    actorProfile.SetValue(key, data);
                }
                else if (dictionary is Profile profile)
                {
                    profile.SetValue(key, data);
                }
                else
                {
                    throw new Exception("Parse error");
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
                    return new List<DataActorProfile>();
                }
                else if (parent is DataActorProfile)
                {
                    return new List<Profile>();
                }

                throw new Exception("Parse error. ");
            }
            /// <summary>
            /// 行列にデータを格納する
            /// </summary>
            /// <param name="array"行列></param>
            /// <param name="data">データ</param>
            public override void AddArrayData(object array, object data)
            {
                if (array is List<DataActorProfile> actorProfiles)
                {
                    actorProfiles.Add((DataActorProfile)(data));
                }
                else if (array is List<Profile> profiles)
                {
                    profiles.Add((Profile)(data));
                }
                else
                {
                    throw new Exception("Parse error. ");
                }
            }
        }
    }
}
