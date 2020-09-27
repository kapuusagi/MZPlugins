using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SEditor
{
    public class DataShopListWriter
    {
        /// <summary>
        /// ショップデータを出力する。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        /// <param name="shops">ショップデータ</param>
        internal static void Write(string dir, List<DataShop> shops)
        {
            string path = System.IO.Path.Combine(dir, "Shops.json");

            // 出力側はToString()の結果をライトするだけなので楽なのです。
            using (System.IO.FileStream fs = new System.IO.FileStream(path,
                System.IO.FileMode.Create, System.IO.FileAccess.Write))
            {
                System.IO.StreamWriter writer = new System.IO.StreamWriter(fs);
                writer.WriteLine("[");
                for (int i = 0; i < shops.Count; i++)
                {
                    var shop = shops[i];
                    if (shop == null)
                    {
                        writer.Write("null");
                    }
                    else
                    {
                        writer.Write(shop.ToString());
                    }
                    if ((i + 1) < shops.Count)
                    {
                        writer.WriteLine(",");
                    }
                    else
                    {
                        writer.WriteLine("");
                    }
                }
                writer.WriteLine("]");
                writer.Flush();
            }
        }
    }
}
