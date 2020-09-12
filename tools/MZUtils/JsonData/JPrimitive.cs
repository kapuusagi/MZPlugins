using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MZUtils.JsonData
{ 
    /// <summary>
    /// プリミティブ型を表現するためのクラス。
    /// </summary>
    public class JPrimitive : JObject
    {
        private string value;
        private double d;
        private bool booleanValue;
        private bool isNumber;
        private bool isBoolean;

        /// <summary>
        /// 新しいJPrimitiveオブジェクトを構築する。
        /// </summary>
        /// <param name="value">値</param>
        public JPrimitive(string value)
        {
            this.value = value;
            this.isBoolean = bool.TryParse(this.value, out booleanValue);
            if (isBoolean)
            {
                isNumber = false;
                d = (booleanValue) ? 1 : 0;
            } 
            else
            {
                this.isNumber = double.TryParse(this.value.Trim(), out d);
                if (isNumber)
                {
                    booleanValue = (d != 0) ? true : false;
                }
                else
                {
                    booleanValue = value.Length > 0;
                }
            }
        }

        /// <summary>
        /// 真偽値を得る。
        /// </summary>
        /// <returns>真偽値</returns>
        public bool ToBoolean()
        {
            return booleanValue;
        }

        /// <summary>
        /// 数値を得る。
        /// </summary>
        /// <returns>数値</returns>
        public double ToNumber()
        {
            if (isNumber)
            {
                return d;
            }
            else
            {
                return Double.NaN;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            if (isNumber)
            {
                return d.ToString();
            }
            else if (isBoolean)
            {
                return (booleanValue) ? "true" : "false";
            }
            else
            {
                return $"\"{value}\"";
            }
        }
    }
}
