using MZUtils.JsonData;
using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils
{
    public class DamageEffect
    {
        public bool Critical { get; set; } = false;
        public int ElementId { get; set; } = 0;
        public string Formula { get; set; } = "0";
        public int Type { get; set; } = 0;
        public int Variance { get; set; } = 20;

        public void SetValue(string paramName, object value)
        {
            switch (paramName)
            {
                case "critical":
                    Critical = (bool)(value);
                    break;
                case "elementId":
                    ElementId = (int)((double)(value));
                    break;
                case "formula":
                    Formula = (string)(value);
                    break;
                case "type":
                    Type = (int)((double)(value));
                    break;
                case "variance":
                    Variance = (int)((double)(value));
                    break;

            }
        }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            JsonData.JObjectBuilder job = new JsonData.JObjectBuilder();
            job.Append("critical", Critical);
            job.Append("elementId", ElementId);
            job.Append("formula", Formula);
            job.Append("type", Type);
            job.Append("variance", Variance);
            return job.ToString();
        }
    }
}
