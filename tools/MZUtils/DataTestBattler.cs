using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{

    /// <summary>
    /// $dataSystemにある、テストバトラーのデータモデル
    /// </summary>
    public class DataTestBattler
    {
        /// <summary>
        /// 新しいインスタンスを構築する。
        /// </summary>
        public DataTestBattler()
        {

        }

        /// <summary>
        /// アクターID
        /// </summary>
        public int ActorId { get; set; } = 0;
        /// <summary>
        /// レベル
        /// </summary>
        public int Level { get; set; } = 0;
        /// <summary>
        /// 装備
        /// </summary>
        public List<int> Equips { get; set; } = new List<int>();
 
        /// <summary>
        /// このオブジェクトのフィールドを設定する。
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "actorId":
                    ActorId = (int)((double)(value));
                    break;
                case "level":
                    Level = (int)((double)(value));
                    break;
                case "equips":
                    Equips = (List<int>)(value);
                    break;
            }
        }
        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            JObjectBuilder job = new JObjectBuilder();
            job.Append("actorId", ActorId);
            job.Append("level", Level);
            job.Append("equips", Equips);
            return job.ToString();
        }
    }
}
