using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;

namespace MZUtils
{
    /// <summary>
    /// $dataSystem タイトルコマンドウィンドウ
    /// </summary>
    public class DataTitleCommandWindow
    {
        public DataTitleCommandWindow()
        {
        }
        /// <summary>
        /// 背景
        /// </summary>
        public int Background { get; set; } = 0;
        /// <summary>
        /// オフセットX
        /// </summary>
        public int OffsetX { get; set; } = 0;
        /// <summary>
        /// オフセットY
        /// </summary>
        public int OffsetY { get; set; } = 0;

        /// <summary>
        /// このオブジェクトのフィールドを設定する。
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "background":
                    Background = (int)((double)(value));
                    break;
                case "offsetX":
                    OffsetX = (int)((double)(value));
                    break;
                case "offsetY":
                    OffsetY = (int)((double)(value));
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
            job.Append("background", Background);
            job.Append("offsetX", OffsetY);
            job.Append("offsetY", OffsetY);
            return job.ToString();
        }
    }
}
