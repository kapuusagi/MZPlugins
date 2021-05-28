using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// 1つのアタックモーションエントリ
    /// </summary>
    public class DataAttackMotion
    {
        /// <summary>
        /// アタックモーションエントリ
        /// </summary>
        public DataAttackMotion()
        {

        }

        /// <summary>
        /// タイプ
        /// </summary>
        public int Type { get; set; }
        /// <summary>
        /// 武器イメージID
        /// </summary>
        public int WeaponImageId { get; set; }

        /// <summary>
        /// このオブジェクトのフィールドを設定する。
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "type":
                    Type = (int)((double)(value));
                    break;
                case "weaponImageId":
                    WeaponImageId = (int)((double)(value));
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
            job.Append("type", Type);
            job.Append("weaponImageId", WeaponImageId);
            return job.ToString();
        }
    }
}
