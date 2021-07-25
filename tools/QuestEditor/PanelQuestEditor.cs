using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace QEditor
{
    /// <summary>
    /// クエストエディタパネル
    /// </summary>
    public partial class PanelQuestEditor : UserControl
    {
        // アイテムリスト
        private FormSelectableItemList itemListForm;
        // 達成条件追加フォーム
        private FormAddAchieve addAchieveForm;
        // モデルからUI表示への設定処理中かどうか。
        private bool updatingModelToUI = false;

        // クエストデータ
        private DataQuest quest;
        /// <summary>
        /// 新しいインスタンスを構築する。
        /// </summary>
        public PanelQuestEditor()
        {
            InitializeComponent();
            InitializeAchieveDataTable();
            InitializeRewardItemDataTable();
        }

        /// <summary> 
        /// 使用中のリソースをすべてクリーンアップします。
        /// </summary>
        /// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            if (disposing && (itemListForm != null))
            {
                itemListForm.Close();
            }
            if (disposing && (addAchieveForm != null))
            {
                addAchieveForm.Close();
            }
            base.Dispose(disposing);
        }

        /// <summary>
        /// 達成条件データテーブルを初期化する。
        /// </summary>
        private void InitializeAchieveDataTable()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add(new DataColumn()
            {
                DataType = typeof(string),
                ColumnName = "achieve",
                ReadOnly = true
            });
            dataGridViewAchieves.DataSource = dt;
            dataGridViewAchieves.Columns[0].AutoSizeMode = DataGridViewAutoSizeColumnMode.Fill;
        }
        /// <summary>
        /// 報酬アイテムを表示するデータテーブルを初期化する。
        /// </summary>
        private void InitializeRewardItemDataTable()
        {
            var dt = new DataTable();
            dt.Columns.Add(new DataColumn()
            {
                DataType = typeof(string),
                ColumnName = "name",
                ReadOnly = true
            });
            dt.Columns.Add(new DataColumn()
            {
                DataType = typeof(int),
                ColumnName = "count"
            });
            dataGridViewRewardItems.DataSource = dt;
            dataGridViewRewardItems.Columns[0].Width = 240;
            dataGridViewRewardItems.Columns[0].AutoSizeMode = DataGridViewAutoSizeColumnMode.Fill;
            dataGridViewRewardItems.Columns[1].Width = 48;
            dataGridViewRewardItems.Columns[1].AutoSizeMode = DataGridViewAutoSizeColumnMode.None;
            dataGridViewRewardItems.Columns[1].DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleRight;
        }

        /// <summary>
        /// 名前が変更された
        /// </summary>
        public event EventHandler QuestNameChanged;

        /// <summary>
        /// クエストデータ
        /// </summary>
        [Browsable(false)]
        public DataQuest Quest { 
            get => quest;
            set {
                quest = value;
                UpdateView();
            }
        }

        /// <summary>
        /// 現在のモデルをUIに反映させる。
        /// </summary>
        private void UpdateView()
        {
            if (comboBoxGuildRank.Items.Count == 0)
            {
                var settingStr = Properties.Settings.Default.GuildRanks;
                if (!string.IsNullOrEmpty(settingStr))
                {
                    var items = settingStr.Split(',').Select(str => str.Trim());
                    foreach (var item in items)
                    {
                        comboBoxGuildRank.Items.Add(item);
                    }
                }
                if (comboBoxGuildRank.Items.Count == 0)
                {
                    var defaultItems = new string[]
                    {
                    "-", "G", "F", "E", "D", "C", "B", "A", "S", "SS", "SSS"
                    };
                    foreach (var item in defaultItems)
                    {
                        comboBoxGuildRank.Items.Add(item);
                    }
                }
            }


            updatingModelToUI = true;
            try
            {
                textBoxName.Text = quest?.Name ?? string.Empty;
                comboBoxGuildRank.SelectedIndex = quest?.GuildRank ?? 0;
                textBoxDescription.Text = quest?.Description ?? string.Empty;
                textBoxAchieveMsg.Text = quest?.AchieveMessage ?? string.Empty;
                textBoxRewardMsg.Text = quest?.RewardsMessage ?? string.Empty;
                textBoxEntrustCondition.Text = quest?.EntrustCondition ?? string.Empty;
                textBoxOnAccept.Text = quest?.OnAcceptScript ?? string.Empty;
                textBoxOnComplete.Text = quest?.OnCompleteScript ?? string.Empty;
                textBoxOnCancel.Text = quest?.OnCancelScript ?? string.Empty;

                int guildExp = quest?.GuildExp ?? 0;
                numericUpDownGuildExp.Value = Math.Max(numericUpDownGuildExp.Minimum, Math.Min(numericUpDownGuildExp.Maximum, guildExp));
                int rewardGold = quest?.RewardGold ?? 0;
                numericUpDownRewardGold.Value = Math.Max(numericUpDownRewardGold.Minimum, Math.Min(numericUpDownRewardGold.Maximum, rewardGold));
                int rewardExp = quest?.RewardExp ?? 0;
                numericUpDownRewardExp.Value = Math.Max(numericUpDownRewardExp.Minimum, Math.Min(numericUpDownRewardExp.Maximum, rewardExp));
                ApplyAchievesToDataTable(quest);
                ApplyRewardItemToDataTable(quest);
                textBoxNote.Text = quest?.Note ?? string.Empty;
            }
            finally
            {
                updatingModelToUI = false;
            }
        }
        /// <summary>
        /// クエストのデータを達成条件データテーブルに反映する。
        /// </summary>
        /// <param name="quest">クエストデータ</param>
        private void ApplyAchievesToDataTable(DataQuest quest)
        {
            var dt = (DataTable)(dataGridViewAchieves.DataSource);
            dt.Rows.Clear();
            if (quest != null)
            {
                foreach (var achieve in quest.Achieves)
                {
                    var row = dt.NewRow();
                    SetAchieveRow(row, achieve);
                    dt.Rows.Add(row);
                }
            }
        }
        /// <summary>
        /// 達成条件データを設定する。
        /// </summary>
        /// <param name="row">行</param>
        /// <param name="achieve">達成条件</param>
        private void SetAchieveRow(DataRow row, IAchieve achieve)
        {
            row[0] = achieve.ToString();
        }
        /// <summary>
        /// クエストデータを達成条件データテーブルに反映させる。
        /// </summary>
        /// <param name="quest">クエストデータ</param>
        private void ApplyRewardItemToDataTable(DataQuest quest)
        {
            DataTable dt = (DataTable)(dataGridViewRewardItems.DataSource);
            dt.Rows.Clear();
            if (quest != null)
            {
                foreach (var rewardItem in quest.RewardItems)
                {
                    if (rewardItem != null)
                    {
                        var row = dt.NewRow();
                        SetRewardItemRow(row, rewardItem);
                        dt.Rows.Add(row);
                    }
                }
            }
        }
        /// <summary>
        /// rowにrewardItemをを設定する。
        /// </summary>
        /// <param name="row">行</param>
        /// <param name="rewardItem">RewardItemオブジェクト</param>
        private void SetRewardItemRow(DataRow row, RewardItem rewardItem)
        {
            var itemName = $"{rewardItem.Kind}[{ProjectData.GetItemName(rewardItem.Kind, rewardItem.DataId)}]";
            row[0] = itemName;
            row[1] = rewardItem.Value;
        }
        /// <summary>
        /// 名前が変更された時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxNameChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.Name = textBoxName.Text;
                QuestNameChanged?.Invoke(this, new EventArgs());
            }
        }

        /// <summary>
        /// ギルドランクコンボボックスの選択が変更された時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnComboBoxGuildRankSelectedValueChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            var index = comboBoxGuildRank.SelectedIndex;
            if ((quest != null) && (index >= 0))
            {
                quest.GuildRank = comboBoxGuildRank.SelectedIndex;
            }
        }
        /// <summary>
        /// 詳細テキストボックスのテキストが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxDescriptionTextChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.Description = textBoxDescription.Text;
            }
        }

        /// <summary>
        /// 達成条件メッセージのテキストが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxAchieveMessageTextChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.AchieveMessage = textBoxAchieveMsg.Text;
            }
        }

        /// <summary>
        /// 報酬メッセージテキストボックスのテキストが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxRewardMessageTextChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.RewardsMessage = textBoxRewardMsg.Text;
            }
        }

        /// <summary>
        /// 達成条件テキストボックスのテキストが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxEntrusConditionTextChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.EntrustCondition = textBoxEntrustCondition.Text;
            }
        }

        /// <summary>
        /// ギルドEXP欄の値が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnNumericUpDownGuildExpValueChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.GuildExp = (int)(numericUpDownGuildExp.Value);
            }
        }

        /// <summary>
        /// 報酬金額の数値が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnNumericUpDownRewardGoldValueChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.RewardGold = (int)(numericUpDownRewardGold.Value);
            }
        }

        /// <summary>
        /// 報酬EXPの数値が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnNumericUpDownRewardExpValueChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.RewardExp = (int)(numericUpDownRewardExp.Value);
            }
        }
        /// <summary>
        /// 達成条件テーブルがクリックされた時の処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnDataGridViewAchievesMouseClick(object sender, MouseEventArgs e)
        {
            var hti = dataGridViewAchieves.HitTest(e.X, e.Y);
            if (hti.Type == DataGridViewHitTestType.None)
            {
                if (addAchieveForm == null)
                {
                    addAchieveForm = new FormAddAchieve();
                    addAchieveForm.OkClick += OnButtonAddAchiveOkClick;
                    addAchieveForm.FormClosed += OnFormAddAchieveClosed;
                }
                addAchieveForm.Show();
            }
        }
        /// <summary>
        /// 達成条件選択ウィンドウが閉じられたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnFormAddAchieveClosed(object sender, FormClosedEventArgs e)
        {
            addAchieveForm.OkClick -= OnButtonAddAchiveOkClick;
            addAchieveForm.FormClosed -= OnFormAddAchieveClosed;
            addAchieveForm.Dispose();
            addAchieveForm = null;
        }

        /// <summary>
        /// 達成条件選択ウィンドウでOKボタンがクリックされた時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonAddAchiveOkClick(object sender, EventArgs e)
        {
            var selectedAchieve = addAchieveForm.Achieve;
            if ((quest != null) && (selectedAchieve != null))
            {
                var achieve = selectedAchieve.Clone();
                quest.Achieves.Add(achieve.Clone());

                DataTable dt = (DataTable)(dataGridViewAchieves.DataSource);
                var row = dt.NewRow();
                SetAchieveRow(row, achieve);
                dt.Rows.Add(row);
            }
        }
        /// <summary>
        /// 達成条件の行が削除されたときの処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnDataGridViewAchievesRowRemoved(object sender, DataGridViewRowsRemovedEventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                int index = e.RowIndex;
                for (int count = 0; count < e.RowCount; count++)
                {
                    if (index < quest.Achieves.Count)
                    {
                        quest.Achieves.RemoveAt(index);
                    }
                }
            }
        }

        /// <summary>
        /// 報酬アイテム欄がクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnDataGridViewRewardItemsMouseClick(object sender, MouseEventArgs e)
        {
            var hti = dataGridViewRewardItems.HitTest(e.X, e.Y);
            if (hti.Type == DataGridViewHitTestType.None)
            {
                // セル以外がクリックされた
                if (itemListForm == null)
                {
                    itemListForm = new FormSelectableItemList();
                    itemListForm.FormClosed += OnItemListFormClosed;
                    itemListForm.ItemSelected += OnItemListItemSelected;
                    itemListForm.SetItemList(ProjectData.SelectableItemList);
                }
                itemListForm.Show(this);
            }
        }
        /// <summary>
        /// アイテム選択ウィンドウが閉じられたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnItemListFormClosed(object sender, FormClosedEventArgs e)
        {
            itemListForm.FormClosed -= OnItemListFormClosed;
            itemListForm.ItemSelected -= OnItemListItemSelected;
            itemListForm.Dispose();
            itemListForm = null;
        }

        /// <summary>
        /// アイテムが選択された時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnItemListItemSelected(object sender, EventArgs e)
        {
            var item = itemListForm.SelectedItem;
            if ((item != null) && (quest != null))
            {
                var rewardItem = new RewardItem();
                rewardItem.DataId = item.Id;
                rewardItem.Kind = (int)(item.Kind);
                rewardItem.Value = 1;
                quest.RewardItems.Add(rewardItem);

                var dt = (DataTable)(dataGridViewRewardItems.DataSource);
                var row = dt.NewRow();
                SetRewardItemRow(row, rewardItem);
                dt.Rows.Add(row);
            }

        }
        /// <summary>
        /// 報酬画面で行が削除されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnDataGridViewRewardItemsRowsRemoved(object sender, DataGridViewRowsRemovedEventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                int index = e.RowIndex;
                for (int count = 0; count < e.RowCount; count++)
                {
                    if (index < quest.RewardItems.Count)
                    {
                        quest.RewardItems.RemoveAt(index);
                    }
                }
            }
        }
        /// <summary>
        /// 報酬グリッドビューのセルが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnDataGridViewRewardItemsCellValueChanged(object sender, DataGridViewCellEventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            var index = e.RowIndex;
            if ((quest != null) && (index >= 0) && (index < quest.RewardItems.Count))
            {
                var rewardItem = quest.RewardItems[index];
                var row = ((DataTable)(dataGridViewRewardItems.DataSource)).Rows[index];
                if (e.ColumnIndex == 1)
                {
                    // 数量変更
                    if (DBNull.Value.Equals(row[1]))
                    {
                        row[1] = rewardItem.Value;
                    }
                    else
                    {
                        int value = (int)(row[1]);
                        rewardItem.Value = value;
                    }
                }
            }
        }
        /// <summary>
        /// コンテキストメニュー「生成」がクリックされた
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnContextMenuGenerateClick(object sender, EventArgs e)
        {
            var control = contextMenuStrip1.SourceControl;
            if (control == textBoxName)
            {
                GenerateQuestName();
            }
            else if (control == textBoxDescription)
            {
                GenerateQuestDescription();
            }
            else if (control == textBoxAchieveMsg)
            {
                GenerateAchieveText();
            }
            else if (control == textBoxRewardMsg)
            {
                GenerateRewardText();
            }
        }

        /// <summary>
        /// クエスト名を自動生成する。
        /// </summary>
        private void GenerateQuestName()
        {
            if ((quest != null) && (quest.Achieves.Count > 0)) 
            {
                textBoxName.Text = GetAchieveOverview(quest.Achieves[0]);
            }
        }

        /// <summary>
        /// 達成条件概要を得る。
        /// </summary>
        /// <param name="achieve">達成条件</param>
        /// <returns>達成条件概要文字列</returns>
        private string GetAchieveOverview(IAchieve achieve)
        {
            if (achieve is AchieveSubjugation achieveSubjugation)
            {
                var id = achieveSubjugation.EnemyId;
                var enemyName = ProjectData.GetEnemyName(id);
                return $"Slay {enemyName}";
            }
            else if (achieve is AchieveCollection achieveCollection)
            {
                var itemName = ProjectData.GetItemName(achieveCollection.ItemType, achieveCollection.ItemId);
                return $"Get {itemName}";
            }
            else if (achieve is AchieveEvent achieveEvent)
            {
                return ProjectData.GetSwitchName(achieveEvent.SwitchNo);
            }
            else
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// クエストの詳細を自動生成する。
        /// </summary>
        private void GenerateQuestDescription()
        {
            if ((quest != null) && (quest.Achieves.Count > 0))
            {
                var sb = new StringBuilder();

                // LINQでわかりにくいが、
                // Selectで achieveからGetAchieveOverview()によりで概要テキストを取得し、
                // WhereでNULLでないやつを抽出する。
                var achieveOverviews = quest.Achieves.Select(achieve => GetAchieveOverview(achieve)).Where(overViewText => !string.IsNullOrEmpty(overViewText)).ToArray();
                for (int i = 0; i < achieveOverviews.Length; i++)
                {
                    if (i > 0)
                    {
                        if (i < (achieveOverviews.Length - 1))
                        {
                            sb.Append(',');
                        }
                        else
                        {
                            sb.Append(" and ");
                        }
                    }
                    sb.Append(achieveOverviews[i]);
                }
                textBoxDescription.Text = sb.ToString();
            }
        }

        /// <summary>
        /// 達成条件テキストを自動生成する。
        /// </summary>
        private void GenerateAchieveText()
        {
            if ((quest != null) && (quest.Achieves.Count > 0))
            {
                var sb = new StringBuilder();

                // LINQでわかりにくいが、
                // Selectで achieveからToString()によりテキストを取得し、
                // Whereで NULLでないやつを抽出する。
                var achieveOverviews = quest.Achieves.Select(achieve => achieve.ToString()).Where(overViewText => !string.IsNullOrEmpty(overViewText)).ToArray();
                for (int i = 0; i < achieveOverviews.Length; i++)
                {
                    if (i > 0)
                    {
                        if (i < (achieveOverviews.Length - 1))
                        {
                            sb.Append(',');
                        }
                        else
                        {
                            sb.Append(" and ");
                        }
                    }
                    sb.Append(achieveOverviews[i]);
                }
                textBoxAchieveMsg.Text = sb.ToString();
            }
        }

        /// <summary>
        /// 報酬テキストを自動生成する。
        /// </summary>
        private void GenerateRewardText()
        {
            if (quest != null)
            {
                var sb = new StringBuilder();
                if (quest.RewardGold > 0)
                {
                    sb.Append(quest.RewardGold).Append(ProjectData.GetCurrencyUnit());
                }
                if (quest.RewardExp > 0)
                {
                    if (sb.Length > 0)
                    {
                        sb.Append("\r\n");
                    }
                    sb.Append(ProjectData.GetTextExpA()).Append(' ').Append(quest.RewardExp);
                }
                foreach (RewardItem rewardItem in quest.RewardItems)
                {
                    string itemName = ProjectData.GetItemName(rewardItem.Kind, rewardItem.DataId); ;
                    int itemCount = rewardItem.Value;
                    if (sb.Length > 0)
                    {
                        sb.Append("\r\n");
                    }
                    sb.Append(itemName).Append('×').Append(itemCount);
                }
                textBoxRewardMsg.Text = (sb.Length > 0) ? sb.ToString() : "None";
            }
        }

        /// <summary>
        /// ノートテキストボックスのテキストが変更された時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxNoteTextChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.Note = textBoxNote.Text;
            }
        }

        /// <summary>
        /// 受託時処理テキストボックスのテキストが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxOnAcceptTextChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.OnAcceptScript = textBoxOnAccept.Text;
            }
        }

        /// <summary>
        /// 完了時処理テキストボックスのテキストが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxOnCompleteTextChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.OnCompleteScript = textBoxOnComplete.Text;
            }
        }

        /// <summary>
        /// キャンセル時処理テキストボックスのテキストが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxOnCancelTextChanged(object sender, EventArgs e)
        {
            if (updatingModelToUI)
            {
                return;
            }
            if (quest != null)
            {
                quest.OnCancelScript = textBoxOnCancel.Text;
            }
        }

        /// <summary>
        /// スイッチ操作コンテキストメニューがクリックされた時の処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnContextMenuInsertSwitchControlClick(object sender, EventArgs e)
        {
            var control = contextMenuStripScript.SourceControl;
            if (control is TextBox textBox)
            {
                textBox.Text = textBox.Text + "\n$gameSwitches.setValue(SwId,true);";
            }
        }

        /// <summary>
        /// 変数操作コンテキストメニューがクリックされた時の処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnContextMenuInsertVariableControlClick(object sender, EventArgs e)
        {
            var control = contextMenuStripScript.SourceControl;
            if (control is TextBox textBox)
            {
                textBox.Text = textBox.Text + "\n$gameVariables.setValue(SwId,true);";
            }
        }

        /// <summary>
        /// GuildRank編集ボタンがクリックされた
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonEditGuildRank(object sender, EventArgs e)
        {
            var form = new FormEditGuildRank();

            string[] items = new string[comboBoxGuildRank.Items.Count];
            for (int i = 0; i < items.Length; i++)
            {
                items[i] = comboBoxGuildRank.Items[i].ToString();
            }

            form.Items = items;
            if (form.ShowDialog(FindForm()) != DialogResult.OK)
            {
                return;
            }

            var editItems = form.Items;
            updatingModelToUI = true;
            try
            {
                int current = comboBoxGuildRank.SelectedIndex;
                comboBoxGuildRank.Items.Clear();
                for (int i = 0; i < editItems.Length; i++)
                {
                    comboBoxGuildRank.Items.Add(editItems[i]);
                }
                if (current < comboBoxGuildRank.Items.Count)
                {
                    comboBoxGuildRank.SelectedIndex = current;
                }
            }
            finally
            {
                updatingModelToUI = false;
            }

            // 設定保存
            var sb = new StringBuilder();
            foreach (var item in editItems)
            {
                if (sb.Length > 0)
                {
                    sb.Append(',');
                }
                sb.Append(item);
            }
            Properties.Settings.Default.GuildRanks = sb.ToString();
            try
            {
                Properties.Settings.Default.Save();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);
            }
        }
    }
}
