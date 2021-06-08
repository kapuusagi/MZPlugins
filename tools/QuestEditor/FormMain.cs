using MZUtils;
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
    public partial class FormMain : Form
    {
        
        // アイテムリスト
        private FormSelectableItemList itemListForm;
        // 達成条件追加フォーム
        private FormAddAchieve addAchieveForm;
        // フォルダ選択ダイアログ
        private FolderSelectDialog folderSelectDialog;
        // 編集中フォルダ
        private string EditingDir { get; set; } = string.Empty;

        /// <summary>
        /// メイン画面
        /// </summary>
        public FormMain()
        {
            InitializeComponent();
            InitializeQuestDataTable();
            InitializeAchieveDataTable();
            InitializeRewardItemDataTable();
        }

        /// <summary>
        /// クエスト一覧を表示するデータテーブルを初期化する。
        /// </summary>
        private void InitializeQuestDataTable()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add(new DataColumn()
            {
                DataType = typeof(string),
                ColumnName = "id",
            });
            dataGridViewQuests.DataSource = dt;
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
            DataTable dt = new DataTable();
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
            dataGridViewRewardItems.Columns[1].Width = 48;
            dataGridViewRewardItems.Columns[1].DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleRight;
        }

        /// <summary>
        /// フォームが表示されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnFormShown(object sender, EventArgs e)
        {
            try
            {
                string dir = Properties.Settings.Default.LastOpenDirectory;
                if (!string.IsNullOrEmpty(dir))
                {
                    ProcessOpen(dir);
                    EditingDir = dir;
                }
                else
                {
                    ModelToUI();
                }
            }
            catch (Exception ex)
            {
                // フォルダが移動しているかもしれないね。
                System.Diagnostics.Debug.WriteLine(ex);
            }
        }

        /// <summary>
        /// フォームが閉じられた時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            try
            {
                Properties.Settings.Default.Save();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);
            }
        }

        /// <summary>
        /// オープンメニューが選択された時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnMenuItemOpenClick(object sender, EventArgs e)
        {
            try
            {
                FolderSelectDialog dialog = GetFolderSelectDialog();
                if (dialog.ShowDialog(this) != DialogResult.OK)
                {
                    return;
                }
                string dir = dialog.Path;
                ProcessOpen(dir);
                EditingDir = dir;
                Properties.Settings.Default.LastOpenDirectory = dir;
            }
            catch (Exception ex)
            {
                MessageBox.Show(this, ex.Message, "Error");
            }
        }

        /// <summary>
        /// 保存メニューがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnMenuItemSaveClick(object sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(EditingDir))
                {
                    FolderSelectDialog dialog = GetFolderSelectDialog();
                    if (dialog.ShowDialog(this) != DialogResult.OK)
                    {
                        return;
                    }
                    EditingDir = dialog.Path;
                    Properties.Settings.Default.LastOpenDirectory = EditingDir;
                }
                ProcessSave(EditingDir);
            }
            catch (Exception ex)
            {
                MessageBox.Show(this, ex.Message, "Error");
            }
        }

        /// <summary>
        /// 終了メニューが選択された時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnMenuItemExitClick(object sender, EventArgs e)
        {
            Close();
        }

        /// <summary>
        /// フォルダ選択ダイアログを取得する。
        /// </summary>
        /// <returns>フォルダ選択ダイアログ</returns>
        private FolderSelectDialog GetFolderSelectDialog()
        {
            if (folderSelectDialog == null)
            {
                folderSelectDialog = new FolderSelectDialog();
                folderSelectDialog.Path = Properties.Settings.Default.LastOpenDirectory;
            }
            return folderSelectDialog;
        }

        /// <summary>
        /// オープン処理を行う。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        private void ProcessOpen(string dir)
        {
            ProjectData.Load(dir);

            if (itemListForm != null)
            {
                itemListForm.SetItemList(ProjectData.SelectableItemList);
            }


            ModelToUI();
        }

        /// <summary>
        /// 保存処理を行う。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        private void ProcessSave(string dir)
        {
            DataQuestWriter.Write(dir, ProjectData.Quests);
        }

        /// <summary>
        /// 項目数変更ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonChangeItemCountClick(object sender, EventArgs e)
        {
            FormNumberInput form = new FormNumberInput();
            form.Number = ProjectData.Quests.Count - 1;
            if (form.ShowDialog(this) != DialogResult.OK)
            {
                return;
            }

            var quests = ProjectData.Quests;

            int newCount = form.Number + 1;
            if (newCount >= quests.Count)
            {
                while (quests.Count < newCount)
                {
                    int id = quests.Count;
                    quests.Add(new DataQuest() { Id = id });
                }
            }
            else if (newCount >= quests.Count)
            {
                while (quests.Count > newCount)
                {
                    quests.RemoveAt(quests.Count - 1);
                }
            }

            ModelToUI();
        }

        /// <summary>
        /// モデルをUIに反映させる。
        /// </summary>
        private void ModelToUI()
        {
            DataTable dt = (DataTable)(dataGridViewQuests.DataSource);
            dt.Clear();

            for (int i = 1; i < ProjectData.Quests.Count; i++)
            {
                var row = dt.NewRow();
                var quest = ProjectData.Quests[i];
                row[0] = string.Format("{0,4:0}:{1}", quest.Id, quest.Name);
                dt.Rows.Add(row);
            }
        }

        /// <summary>
        /// 編集対象のクエストが選択変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnDataGridViewQuestsSelectionChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            textBoxName.Text = quest?.Name ?? string.Empty;
            comboBoxGuildRank.SelectedIndex = quest?.GuildRank ?? 0;
            textBoxEntrustCondition.Text = quest?.EntrustCondition ?? string.Empty;
            ApplyAchievesToDataTable(quest);

            textBoxAchieveMsg.Text = quest?.AchieveMessage ?? string.Empty;
            textBoxDescription.Text = quest?.Description ?? string.Empty;
            textBoxRewardMsg.Text = quest?.RewardsMessage ?? string.Empty;
            if (quest != null)
            {
                quest.GuildExp = Math.Max(1, Math.Min(10000, quest.GuildExp));
                numericUpDownGuildExp.Value = quest.GuildExp;
                quest.RewardGold = Math.Max(0, Math.Min(1000000, quest?.RewardGold ?? 0));
                numericUpDownRewardGold.Value = quest.RewardGold;
            }
            else
            {
                numericUpDownGuildExp.Value = numericUpDownGuildExp.Minimum;
                numericUpDownRewardGold.Value = numericUpDownRewardGold.Minimum;
            }
            ApplyRewardItemToDataTable(quest);
            textBoxNote.Text = quest?.Note ?? string.Empty;

            panelEdit.Enabled = (quest != null);
        }

        /// <summary>
        /// クエストのデータを達成条件データテーブルに反映する。
        /// </summary>
        /// <param name="quest">クエストデータ</param>
        private void ApplyAchievesToDataTable(DataQuest quest)
        {
            DataTable dt = (DataTable)(dataGridViewAchieves.DataSource);
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
            var itemName = ProjectData.GetItemName(rewardItem.Kind, rewardItem.DataId);
            row[0] = itemName;
            row[1] = rewardItem.Value;
        }



        /// <summary>
        /// 現在編集中のクエストデータを取得する。
        /// </summary>
        /// <returns>クエストデータ</returns>
        private DataQuest GetCurrentQuest()
        {
            var rows = dataGridViewQuests.SelectedRows;
            if (rows.Count == 0)
            {
                return null;
            }
            int index = rows[0].Index + 1;
            if ((index >= 0) && (index < ProjectData.Quests.Count))
            {
                return ProjectData.Quests[index];
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// 名前テキストボックスの内容が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxNameTextChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest != null)
            {
                quest.Name = textBoxName.Text;

                var rows = dataGridViewQuests.SelectedRows;
                int index = rows[0].Index;

                DataTable dt = (DataTable)(dataGridViewQuests.DataSource);
                var row = dt.Rows[index];
                row.SetField(0, string.Format("{0,4:D}:{1}", quest.Id, quest.Name));
            }
        }

        /// <summary>
        /// コンボボックスの選択が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnComboBoxGuildRankSelectedValueChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest != null)
            {
                quest.GuildRank = comboBoxGuildRank.SelectedIndex;
            }
        }

        /// <summary>
        /// 委託条件テキストボックスの内容が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxEntrustConditionTextChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest != null)
            {
                quest.EntrustCondition = textBoxEntrustCondition.Text;
            }
        }

        /// <summary>
        /// 詳細情報入力欄のテキストが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxDescriptionTextChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest != null)
            {
                quest.Description = textBoxDescription.Text;
            }
        }

        /// <summary>
        /// 報酬テキスト欄の内容が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxRewardMsgTextChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest != null)
            {
                quest.RewardsMessage = textBoxRewardMsg.Text;
            }
        }

        /// <summary>
        /// ギルド経験値欄の入力値が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnNumericUpDownGuildExpValueChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest != null)
            {
                quest.GuildExp = (int)(numericUpDownGuildExp.Value);
            }
        }

        /// <summary>
        /// 数値入力欄の数値が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnNumericUpDownRewardGoldValueChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest != null)
            {
                quest.RewardGold = (int)(numericUpDownRewardGold.Value);
            }
        }

        /// <summary>
        /// 追加ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonAddItemClick(object sender, EventArgs e)
        {
            if (itemListForm == null)
            {
                itemListForm = new FormSelectableItemList();
                itemListForm.FormClosed += OnItemListFormClosed;
                itemListForm.ItemSelected += OnItemListItemSelected;
                itemListForm.SetItemList(ProjectData.SelectableItemList);
            }
            itemListForm.Show(this);
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
            IItem item = itemListForm.SelectedItem;
            DataQuest quest = GetCurrentQuest();
            if ((item == null) || (quest == null))
            {
                return;
            }

            RewardItem rewardItem = new RewardItem();
            rewardItem.DataId = item.Id;
            rewardItem.Kind = GetItemKind(item);
            rewardItem.Value = 1;
            quest.RewardItems.Add(rewardItem);

            DataTable dt = (DataTable)(dataGridViewRewardItems.DataSource);
            var row = dt.NewRow();
            SetRewardItemRow(row, rewardItem);
            dt.Rows.Add(row);
        }

        /// <summary>
        /// アイテムの種類を得る。
        /// </summary>
        /// <param name="item">アイテム</param>
        /// <returns>種類</returns>
        private int GetItemKind(IItem item)
        {
            if (item is DataItem)
            {
                return 1;
            }
            else if (item is DataWeapon)
            {
                return 2;
            }
            else if (item is DataArmor)
            {
                return 3;
            }
            else
            {
                return 0;
            }
        }

        /// <summary>
        /// 達成条件テキスト欄の内容が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxAchieveMsgTextChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest != null)
            {
                quest.AchieveMessage = textBoxAchieveMsg.Text;
            }
        }

        /// <summary>
        /// 報酬グリッドビューのセルが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnDataGridViewRewardItemsCellValueChanged(object sender, DataGridViewCellEventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest == null)
            {
                return;
            }

            var index = e.RowIndex;
            if ((index < 0) || (index >= quest.RewardItems.Count))
            {
                return;
            }
            RewardItem rewardItem = quest.RewardItems[e.RowIndex];
            DataRow row = ((DataTable)(dataGridViewRewardItems.DataSource)).Rows[index];
            switch (e.ColumnIndex)
            {
                case 1:
                    {
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
                    break;
            }
        }

        /// <summary>
        /// 報酬画面で行が削除されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnDataGridViewRewardItemsRowsRemoved(object sender, DataGridViewRowsRemovedEventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest == null)
            {
                return;
            }

            int index = e.RowIndex;
            for (int count = 0; count < e.RowCount; count++)
            {
                if (index < quest.RewardItems.Count)
                {
                    quest.RewardItems.RemoveAt(index);
                }
            }

        }

        /// <summary>
        /// 詳細生成ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonGenerateDescriptionClick(object sender, EventArgs e)
        {




            //if (radioButtonQtSubjugation.Checked)
            //{
            //    string name = comboBoxEnemy.SelectedItem.ToString() ?? "";
            //    textBoxDescription.Text = $"{name}を討伐してください。";
            //}
            //else if (radioButtonQtCollection.Checked)
            //{
            //    string name = comboBoxItem.SelectedItem.ToString() ?? "";
            //    textBoxDescription.Text = $"{name}を集めてきてください。";
            //}
            //else
            //{
            //    // 指定不可。
            //}
        }

        /// <summary>
        /// 名前生成ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonGenerateNameClick(object sender, EventArgs e)
        {
            //if (radioButtonQtSubjugation.Checked)
            //{
            //    string name = comboBoxEnemy.SelectedItem.ToString() ?? "";
            //    textBoxName.Text = $"{name}の討伐";
            //}
            //else if (radioButtonQtCollection.Checked)
            //{
            //    string name = comboBoxItem.SelectedItem.ToString() ?? "";
            //    textBoxName.Text = $"{name}の採取";
            //}
            //else
            //{
            //    // 指定不可。
            //}
        }

        /// <summary>
        /// 達成条件メッセージ生成ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonGenerateAchieveMessageClick(object sender, EventArgs e)
        {
            //if (radioButtonQtSubjugation.Checked)
            //{
            //    string name = comboBoxEnemy.SelectedItem.ToString() ?? "";
            //    int enemyCount = (int)(numericUpDownEnemyCount.Value);
            //    textBoxAchieveMsg.Text = $"{name}を{enemyCount}体討伐する。";
            //}
            //else if (radioButtonQtCollection.Checked)
            //{
            //    string name = comboBoxItem.SelectedItem.ToString() ?? "";
            //    int itemCount = (int)(numericUpDownItemCount.Value);
            //    textBoxAchieveMsg.Text = $"{name}を{itemCount}個集める。";
            //}
            //else
            //{
            //    // 指定不可。
            //}
        }

        /// <summary>
        /// 報酬メッセージ生成ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonGenerateRewardMessage(object sender, EventArgs e)
        {
            var sb = new StringBuilder();
            var quest = GetCurrentQuest();
            if (quest == null)
            {
                return;
            }

            if (quest.RewardGold > 0)
            {
                sb.Append(quest.RewardGold).Append("\\G");
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
            textBoxRewardMsg.Text = (sb.Length > 0) ? sb.ToString() : "なし";
        }

        /// <summary>
        /// ノートテキストボックスのテキストが変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxNoteTextChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest == null)
            {
                return;
            }
            quest.Note = textBoxNote.Text;
        }

        /// <summary>
        /// 達成条件追加ボタンがクリックされた時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonAchieveAddClick(object sender, EventArgs e)
        {
            if (addAchieveForm == null)
            {
                addAchieveForm = new FormAddAchieve();
                addAchieveForm.OkClick += OnButtonAddAchiveOkClick;
                addAchieveForm.FormClosed += OnFormAddAchieveClosed;
            }
            addAchieveForm.Show();
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
            DataQuest quest = GetCurrentQuest();
            if (quest == null)
            {
                return;
            }
            var achieve = addAchieveForm.Achieve;
            if (achieve == null)
            {
                return;
            }
            quest.Achieves.Add(achieve);

            DataTable dt = (DataTable)(dataGridViewAchieves.DataSource);
            var row = dt.NewRow();
            SetAchieveRow(row, achieve);
            dt.Rows.Add(row);
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
        /// 達成条件の行が削除されたときの処理を行う。
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnDataGridViewAchievesRowRemoved(object sender, DataGridViewRowsRemovedEventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if (quest == null)
            {
                return;
            }

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
}
