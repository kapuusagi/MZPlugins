using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils
{
    public class DropItem
    {
        public int DataId { get; set; } = 1;
        public double Denominator { get; set; } = 1;
        public int Kind { get; set; } = 0;

        public void SetValue(string paramName, object value)
        {
            switch (paramName)
            {
                case "dataId":
                    DataId = (int)((double)(value));
                    break;
                case "denominator":
                    Denominator = (double)(value);
                    break;
                case "kind":
                    Kind = (int)((double)(value));
                    break;
            }
        }


        public override string ToString()
        {
            JsonData.JObjectBuilder job = new JsonData.JObjectBuilder();
            job.Append("dataId", DataId);
            job.Append("denominator", Denominator);
            job.Append("kind", Kind);
            return job.ToString();
        }
    }
}
