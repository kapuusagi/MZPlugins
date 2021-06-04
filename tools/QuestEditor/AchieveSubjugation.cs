using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    public class AchieveSubjugation : IAchieve
    {
        private DataAchieve data;

        /// <summary>
        /// 討伐達成条件オブジェクトを構築する。
        /// </summary>
        /// <param name="data">データ</param>
        public AchieveSubjugation(DataAchieve data)
        {
            this.data = data;
            this.data.Type = (int)(AchieveType.Subjugation);
        }

        /// <summary>
        /// データを得る
        /// </summary>
        public DataAchieve Data { get => data; }

        /// <summary>
        /// タイプ
        /// </summary>
        public AchieveType Type {
            get => AchieveType.Subjugation;
        }
        /// <summary>
        /// エネミーID
        /// </summary>
        public int EnemyId { get => data.Value2; set => data.Value2 = value; }
        /// <summary>
        /// エネミー数
        /// </summary>
        public int EnemyCount { get => data.Value3; set => data.Value3 = value; }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            return $"Kill {ProjectData.GetEnemyName(EnemyId)}x{EnemyCount}";
        }
    }
}
