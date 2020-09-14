using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PEditor
{
    /// <summary>
    /// アクターのプロフィールデータ
    /// </summary>
    public class DataActorProfile
    {

        /// <summary>
        /// 新しい空のプロフィールデータを作成する
        /// </summary>
        public DataActorProfile() : this(0, "")
        {
        }
        /// <summary>
        /// 新しい空のプロフィールデータを作成する。
        /// </summary>
        public DataActorProfile(int id, string name)
        {
            this.Id = id;
            this.Name = name;
        }

        public string Name { get; set; }
        /// <summary>
        /// ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// データ
        /// </summary>
        public List<Profile> Profiles { get; private set; } = new List<Profile>();

        /// <summary>
        /// 値をセットする。
        /// </summary>
        /// <param name="key">キー</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "id":
                    Id = (int)((double)(value));
                    break;
                case "profiles":
                    Profiles.Clear();
                    Profiles.AddRange((List<Profile>)(value));
                    break;
                default:
                    throw new Exception("Unsupported key = " + key);
            }
        }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            var job = new MZUtils.JsonData.JObjectBuilder();
            job.Append("id", Id);
            job.Append("profiles", Profiles);
            return job.ToString();
        }
    }
}
