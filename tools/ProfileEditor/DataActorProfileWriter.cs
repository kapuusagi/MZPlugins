using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PEditor
{
    internal static class DataActorProfileWriter
    {
        /// <summary>
        /// アクタープロフィールデータを出力する。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        /// <param name="actorProfiles">アクタープロフィールデータ</param>
        public static void Write(string dir, List<DataActorProfile> actorProfiles)
        {
            string path = System.IO.Path.Combine(dir, "ActorProfiles.json");

            // 出力側はToString()の結果をライトするだけなので楽なのです。
            using (System.IO.FileStream fs = new System.IO.FileStream(path,
                System.IO.FileMode.Create, System.IO.FileAccess.Write))
            {
                System.IO.StreamWriter writer = new System.IO.StreamWriter(fs);
                writer.WriteLine("[");
                for (int i = 0; i < actorProfiles.Count; i++)
                {
                    var actorProfile = actorProfiles[i];
                    if (actorProfile == null)
                    {
                        writer.Write("null");
                    }
                    else
                    {
                        writer.Write(actorProfile.ToString());
                    }
                    if ((i + 1) < actorProfiles.Count)
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
