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
        /// 達成条件データ
        /// </summary>
        public List<IAchieve> Achieves { get; private set; } = new List<IAchieve>();
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
        /// 受託時処理
        /// </summary>
        public string OnAcceptScript { get; set; } = string.Empty;
        /// <summary>
        /// 完了時処理
        /// </summary>
        public string OnCompleteScript { get; set; } = string.Empty;
        /// <summary>
        /// キャンセル時処理
        /// </summary>
        public string OnCancelScript { get; set; } = string.Empty;
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
                case "achieves":
                    {
                        Achieves.Clear();
                        foreach (var dataAchieve in (List<DataAchieve>)(value))
                        {
                            IAchieve achieve = GetAchieveObject(dataAchieve);
                            if (achieve != null)
                            {
                                Achieves.Add(achieve);
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
                case "onAccept":
                    OnAcceptScript = (string)(value);
                    break;
                case "onComplete":
                    OnCompleteScript = (string)(value);
                    break;
                case "onCancel":
                    OnCancelScript = (string)(value);
                    break;
                case "note":
                    Note = (string)(value);
                    break;
            }
        }

        /// <summary>
        /// 達成条件オブジェクトを得る。
        /// </summary>
        /// <param name="dataAchieve">データ</param>
        /// <returns>達成条件オブジェクト。</returns>
        private IAchieve GetAchieveObject(DataAchieve dataAchieve)
        {
            var type = (AchieveType)(Enum.ToObject(typeof(AchieveType), dataAchieve.Type));
            switch (type)
            {
                case AchieveType.Subjugation:
                    return new AchieveSubjugation(dataAchieve);
                case AchieveType.Collection:
                    return new AchieveCollection(dataAchieve);
                case AchieveType.Event:
                    return new AchieveEvent(dataAchieve);
                default:
                    return null;
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
            var achieves = Achieves.Select(a => a.Data).ToArray();
            job.Append("achieves", achieves);
            job.Append("rewardGold", RewardGold);
            job.Append("rewardItems", RewardItems);
            job.Append("name", Name);
            job.Append("achieveMsg", AchieveMessage);
            job.Append("rewardMsg", RewardsMessage);
            job.Append("description", Description);
            job.Append("onAccept", OnAcceptScript);
            job.Append("onComplete", OnCompleteScript);
            job.Append("onCancel", OnCancelScript);
            job.Append("note", Note);
            return job.ToString();
        }

    }
}
