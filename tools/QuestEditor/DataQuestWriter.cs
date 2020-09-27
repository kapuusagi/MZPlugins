using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    public static class DataQuestWriter
    {
        /// <summary>
        /// Questデータを出力する。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        /// <param name="quests">ショップデータ</param>
        internal static void Write(string dir, List<DataQuest> quests)
        {
            string path = System.IO.Path.Combine(dir, "Quests.json");

            // 出力側はToString()の結果をライトするだけなので楽なのです。
            using (System.IO.FileStream fs = new System.IO.FileStream(path,
                System.IO.FileMode.Create, System.IO.FileAccess.Write))
            {
                System.IO.StreamWriter writer = new System.IO.StreamWriter(fs);
                writer.WriteLine("[");
                for (int i = 0; i < quests.Count; i++)
                {
                    var quest = quests[i];
                    if (quest == null)
                    {
                        writer.Write("null");
                    }
                    else
                    {
                        writer.Write(quest.ToString());
                    }
                    if ((i + 1) < quests.Count)
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
