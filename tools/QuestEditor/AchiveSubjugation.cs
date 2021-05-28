using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    public class AchiveSubjugation : IAchive
    {
        private DataAchive data;

        /// <summary>
        /// 討伐達成条件オブジェクトを構築する。
        /// </summary>
        /// <param name="data">データ</param>
        public AchiveSubjugation(DataAchive data)
        {
            this.data = data;
            this.data.Type = (int)(AchiveType.Subjugation);
        }

        /// <summary>
        /// タイプ
        /// </summary>
        public AchiveType Type {
            get => AchiveType.Subjugation;
        }
        /// <summary>
        /// エネミーID
        /// </summary>
        public int EnemyId { get => data.Value2; set => data.Value2 = value; }
        /// <summary>
        /// エネミー数
        /// </summary>
        public int EnemyCount { get => data.Value3; set => data.Value3 = value; }


    }
}
