using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QEditor
{
    /// <summary>
    /// クエストデータを表すモデル。
    /// </summary>
    public class DataQuest
    {
        /// <summary>
        /// ID番号
        /// </summary>
        public int Id { get; set; } = 0;
        /// <summary>
        /// 適正ギルドランク
        /// </summary>
        public int GuildRank { set; get; } = 0;
        /// <summary>
        /// 取得できるギルド経験値
        /// </summary>
        public int GuildExp { set; get; } = 0;
        /// <summary>
        /// 委託条件
        /// </summary>
        public string EntrustCondition { get; set; } = string.Empty;
        /// <summary>
        /// クエストタイプ。
        /// 1:討伐, 2:採取, 3:イベント
        /// </summary>
        public int QuestType { get; set; } = 0;
        /// <summary>
        /// 達成条件データ
        /// 内容はクエストタイプに依存。
        /// 討伐クエスト： 0:エネミーID   1:数量
        /// 採取クエスト： 0:アイテムID（Itemのみ指定可能） 1:数量
        /// イベント； 0:スイッチ番号 1:(未使用)
        /// </summary>
        public int[] Achieve { get; private set; } = new int[2];
        /// <summary>
        /// 報酬金額
        /// </summary>
        public int RewardGold { get; set; } = 0;
        /// <summary>
        /// 報酬アイテム
        /// </summary>
        public List<RewardItem> RewardItems { get; private set; } = new List<RewardItem>();
        /// <summary>
        /// クエスト名
        /// </summary>
        public string Name { get; set; } = string.Empty;
        /// <summary>
        /// 達成条件メッセージ（空可能）
        /// </summary>
        public string AchieveMessage { get; set; } = string.Empty;
        /// <summary>
        /// 報酬メッセージ（空可能）
        /// </summary>
        public string RewardsMessage { get; set; } = string.Empty;
        /// <summary>
        /// 詳細メッセージ
        /// </summary>
        public string Description { get; set; } = string.Empty;
        /// <summary>
        /// ノートタグ
        /// </summary>
        public string Note { get; set; } = string.Empty;

        /// <summary>
        /// 値を設定する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="value">値</param>
        public void SetValue(string paramName, object value)
        {
            switch (paramName)
            {
                case "id":
                    Id = (int)((double)(value));
                    break;
                case "guildRank":
                    GuildRank = (int)((double)(value));
                    break;
                case "guildExp":
                    GuildExp = (int)((double)(value));
                    break;
                case "entrustCondition":
                    EntrustCondition = (string)(value);
                    break;
                case "qtype":
                    QuestType = (int)((double)(value));
                    break;
                case "achieve":
                    {
                        List<int> array = (List<int>)(value);
                        for (int i = 0; i < 2; i++)
                        {
                            if (i < array.Count)
                            {
                                Achieve[i] = array[i];
                            }
                            else
                            {
                                Achieve[i] = 0;
                            }
                        }
                    }
                    break;
                case "rewardGold":
                    RewardGold = (int)((double)(value));
                    break;
                case "rewardItems":
                    RewardItems.Clear();
                    RewardItems.AddRange((List<RewardItem>)(value));
                    break;
                case "name":
                    Name = (string)(value);
                    break;
                case "achieveMsg":
                    AchieveMessage = (string)(value);
                    break;
                case "rewardMsg":
                    RewardsMessage = (string)(value);
                    break;
                case "description":
                    Description = (string)(value);
                    break;
                case "note":
                    Note = (string)(value);
                    break;
            }
        }

        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列表現</returns>
        public override string ToString()
        {
            var job = new MZUtils.JsonData.JObjectBuilder();
            job.Append("id", Id);
            job.Append("guildRank", GuildRank);
            job.Append("guildExp", GuildExp);
            job.Append("entrustCondition", EntrustCondition);
            job.Append("qtype", QuestType);
            job.Append("achieve", Achieve);
            job.Append("rewardGold", RewardGold);
            job.Append("rewardItems", RewardItems);
            job.Append("name", Name);
            job.Append("achieveMsg", AchieveMessage);
            job.Append("rewardMsg", RewardsMessage);
            job.Append("description", Description);
            job.Append("note", Note);
            return job.ToString();
        }

    }
}
