using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils
{
    public class EnemyAction
    {
        public int ConditionParam1 { get; set; } = 0;
        public int ConditionParam2 { get; set; } = 0;
        public int ConditionType { get; set; } = 0;
        public int Rating { get; set; } = 0;
        public int SkillId { get; set; } = 0;

        /// <summary>
        /// 値を設定する。
        /// </summary>
        /// <param name="paramName"></param>
        /// <param name="value"></param>
        public void SetValue(string paramName, object value)
        {
            switch (paramName)
            {
                case "conditionParam1":
                    ConditionParam1 = (int)((double)(value));
                    break;
                case "conditionParam2":
                    ConditionParam2 = (int)((double)(value));
                    break;
                case "conditionType":
                    ConditionType = (int)((double)(value));
                    break;
                case "rating":
                    Rating = (int)((double)(value));
                    break;
                case "skillId":
                    SkillId = (int)((double)(value));
                    break;
            }

        }
        public override string ToString()
        {
            JsonData.JObjectBuilder job = new JsonData.JObjectBuilder();
            job.Append("conditionParam1", ConditionParam1);
            job.Append("conditionParam2", ConditionParam2);
            job.Append("conditionType", ConditionType);
            job.Append("rating", Rating);
            job.Append("skillId", SkillId);
            return job.ToString();
        }
    }
}
