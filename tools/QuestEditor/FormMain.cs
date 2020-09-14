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
        
        private List<DataQuest> Quests { get; set; } = new List<DataQuest>();

        private List<IItem> selectableItemList = new List<IItem>();
        private List<DataItem> items = new List<DataItem>();
        private List<DataWeapon> weapons = new List<DataWeapon>();
        private List<DataArmor> armors = new List<DataArmor>();
        private List<DataEnemy> enemies = new List<DataEnemy>();

        private FormSelectableItemList itemListForm;
        private FolderSelectDialog folderSelectDialog;

        private string EditingDir { get; set; } = string.Empty;

        /// <summary>
        /// メイン画面
        /// </summary>
        public FormMain()
        {
            InitializeComponent();
            InitializeQuestDataTable();
            InitializeItemDataTable();
        }

        /// <summary>
        /// データテーブル
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

            Quests.Add(null);
            Quests.Add(new DataQuest() { Id = 1 });
        }

        /// <summary>
        /// データテーブルを初期化する。
        /// </summary>
        private void InitializeItemDataTable()
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
            selectableItemList.Clear();
            items.Clear();
            weapons.Clear();
            armors.Clear();
            enemies.Clear();
            Quests.Clear();

            ReadDataFiles(dir);
            AddSelectableItems(selectableItemList, items);
            AddSelectableItems(selectableItemList, weapons);
            AddSelectableItems(selectableItemList, armors);
            if (itemListForm != null)
            {
                itemListForm.SetItemList(selectableItemList);
            }

            comboBoxEnemy.Items.Clear();
            foreach (var enemy in enemies)
            {
                comboBoxEnemy.Items.Add(enemy?.Name ?? string.Empty);
            }
            comboBoxItem.Items.Clear();
            foreach (var item in items)
            {
                comboBoxItem.Items.Add(item?.Name ?? string.Empty);
            }

            ModelToUI();
        }

        /// <summary>
        /// データファイルを読み出す。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        private void ReadDataFiles(string dir)
        {
            string itemsPath = System.IO.Path.Combine(dir, "Items.json");
            if (System.IO.File.Exists(itemsPath))
            {
                items = DataItemListParser.Read(itemsPath);
            }

            string weaponsPath = System.IO.Path.Combine(dir, "Weapons.json");
            if (System.IO.File.Exists(weaponsPath))
            {
                weapons = DataWeaponListParser.Read(weaponsPath);
            }

            string armorsPath = System.IO.Path.Combine(dir, "Armors.json");
            if (System.IO.File.Exists(armorsPath))
            {
                armors = DataArmorListParser.Read(armorsPath);
            }

            string enemiesPath = System.IO.Path.Combine(dir, "Enemies.json");
            if (System.IO.File.Exists(enemiesPath))
            {
                enemies = DataEnemyListParser.Read(enemiesPath);
            }


            string questsPath = System.IO.Path.Combine(dir, "Quests.json");
            if (System.IO.File.Exists(questsPath))
            {
                Quests = DataQuestListReader.Read(questsPath);
                if (!Quests.Contains(null))
                {
                    Quests.Add(null);
                }
                Quests.Sort((a, b) =>
                {
                    if (a == null)
                    {
                        return -1;
                    }
                    else if (b == null)
                    {
                        return 1;
                    }
                    else
                    {
                        return a.Id - b.Id;
                    }
                });

            }
        }

        /// <summary>
        /// 選択アイテムを追加する。
        /// 名前未設定だとか、nullなエントリは表示しないようにする。
        /// </summary>
        /// <param name="list">追加するリスト</param>
        /// <param name="sourceList">追加元のリスト</param>
        private void AddSelectableItems(List<IItem> list, System.Collections.IList sourceList)
        {
            foreach (IItem item in sourceList)
            {
                if (item == null)
                {
                    continue;
                }
                if (string.IsNullOrEmpty(item.Name))
                {
                    continue;
                }
                list.Add(item);
            }
        }

        /// <summary>
        /// 保存処理を行う。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        private void ProcessSave(string dir)
        {
            DataQuestWriter.Write(dir, Quests);
        }

        /// <summary>
        /// 項目数変更ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonChangeItemCountClick(object sender, EventArgs e)
        {
            FormNumberInput form = new FormNumberInput();
            form.Number = Quests.Count - 1;
            if (form.ShowDialog(this) != DialogResult.OK)
            {
                return;
            }

            int newCount = form.Number + 1;
            if (newCount >= Quests.Count)
            {
                while (Quests.Count < newCount)
                {
                    int id = Quests.Count;
                    Quests.Add(new DataQuest() { Id = id });
                }
            }
            else if (newCount >= Quests.Count)
            {
                while (Quests.Count > newCount)
                {
                    Quests.RemoveAt(Quests.Count - 1);
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

            for (int i = 1; i < Quests.Count; i++)
            {
                var row = dt.NewRow();
                var quest = Quests[i];
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
            if (quest != null)
            {
                radioButtonQtSubjugation.Checked = (quest.QuestType == 1);
                radioButtonQtCollection.Checked = (quest.QuestType == 2);
                radioButtonQtEvent.Checked = (quest.QuestType == 3);
                if (quest.QuestType == 1)
                {
                    comboBoxEnemy.SelectedIndex = quest.Achieve[0];
                    quest.Achieve[1] = Math.Max(1, Math.Min(100, quest.Achieve[1]));
                    numericUpDownEnemyCount.Value =quest.Achieve[1];
                }
                else if (quest.QuestType == 2)
                {
                    comboBoxItem.SelectedIndex = quest.Achieve[0];
                    quest.Achieve[1] = Math.Max(1, Math.Min(99, quest.Achieve[1]));
                    numericUpDownItemCount.Value = quest.Achieve[1];
                }
                else if (quest.QuestType == 3)
                {
                    quest.Achieve[0] = Math.Max(1, Math.Min(9999, quest.Achieve[0]));
                    numericUpDownSwitch.Value = quest.Achieve[0];
                }
            }
            else
            {
                radioButtonQtSubjugation.Checked = false;
                radioButtonQtCollection.Checked = false;
                radioButtonQtEvent.Checked = false;
            }
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
            DataTable dt = (DataTable)(dataGridViewRewardItems.DataSource);
            dt.Rows.Clear();
            if (quest != null)
            {
                foreach (var rewardItem in quest.RewardItems)
                {
                    var row = dt.NewRow();
                    SetRewardItemRow(row, rewardItem);
                    dt.Rows.Add(row);
                }
            }

            panelEdit.Enabled = (quest != null);
        }

        /// <summary>
        /// rowにrewardItemをを設定する。
        /// </summary>
        /// <param name="row">行</param>
        /// <param name="rewardItem">RewardItemオブジェクト</param>
        private void SetRewardItemRow(DataRow row, RewardItem rewardItem)
        {
            row[0] = GetItemName(rewardItem.Kind, rewardItem.DataId);
            row[1] = rewardItem.Value;
        }

        /// <summary>
        /// アイテム名を得る。
        /// </summary>
        /// <param name="kind">種類</param>
        /// <param name="id">ID番号</param>
        /// <returns>報酬アイテム名</returns>
        private string GetItemName(int kind, int id)
        {
            if ((kind == 1) && (id > 0) && (id < items.Count))
            {
                return "Item:" + items[id].Name;
            }
            else if ((kind == 2) && (id > 0) && (id < weapons.Count))
            {
                return "Weapon:" + weapons[id].Name;
            }
            else if ((kind == 3) && (id > 0) && (id < armors.Count))
            {
                return "Armor:" + armors[id].Name;
            }


            return $"type{kind}:{id}";
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
            if ((index >= 0) && (index < Quests.Count))
            {
                return Quests[index];
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
        /// クエストタイプのラジオボタン選択状態が変更されたときに通知を受け取る。
        /// 本メソッドはradioButtonQtSubjugation/radioButtonQtCollection/radioButtonQtEventの
        /// イベントを一括で処理する。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnRadioButtonQtCheckedChanged(object sender, EventArgs e)
        {
            RadioButton rb = (RadioButton)(sender);
            if (rb.Checked)
            {
                // OFF->ON時のみ処理する。
                DataQuest quest = GetCurrentQuest();
                if (quest != null)
                {
                    if (rb == radioButtonQtSubjugation)
                    {
                        quest.QuestType = 1;
                    }
                    else if (rb == radioButtonQtCollection)
                    {
                        quest.QuestType = 2;
                    }
                    else if (rb == radioButtonQtEvent)
                    {
                        quest.QuestType = 3;
                    }
                }
                radioButtonQtSubjugation.Checked = (rb == radioButtonQtSubjugation);
                radioButtonQtCollection.Checked = (rb == radioButtonQtCollection);
                radioButtonQtEvent.Checked = (rb == radioButtonQtEvent);
            }
            flowLayoutPanelQtSubjugation.Enabled = radioButtonQtSubjugation.Checked;
            flowLayoutPanelQtCollection.Enabled = radioButtonQtCollection.Checked;
            flowLayoutPanelQtEvent.Enabled = radioButtonQtEvent.Checked;
        }

        /// <summary>
        /// エネミーコンボボックスの選択が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnComboBoxEnemySelectedIndexChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if ((quest != null) && (quest.QuestType == 1))
            {
                quest.Achieve[0] = comboBoxEnemy.SelectedIndex;
            }
        }

        /// <summary>
        /// エネミー数入力欄の数値が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnNumericUpDownEnemyCountValueChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if ((quest != null) && (quest.QuestType == 1))
            {
                quest.Achieve[1] = (int)(numericUpDownEnemyCount.Value);
            }
        }

        /// <summary>
        /// アイテム選択コンボボックスの選択内容が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnComboBoxItemSelectedItemChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if ((quest != null) && (quest.QuestType == 2))
            {
                quest.Achieve[0] = comboBoxItem.SelectedIndex;
            }
        }

        /// <summary>
        /// アイテム数入力欄の選択内容が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnNumericUpDownItemCountValueChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if ((quest != null) && (quest.QuestType == 2))
            {
                quest.Achieve[1] = (int)(numericUpDownItemCount.Value);
            }
        }

        /// <summary>
        /// スイッチ番号入力欄の値が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnNumericUpDownSwitchValueChanged(object sender, EventArgs e)
        {
            DataQuest quest = GetCurrentQuest();
            if ((quest != null) && (quest.QuestType == 3))
            {
                quest.Achieve[0] = (int)(numericUpDownSwitch.Value);
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
                itemListForm.SetItemList(selectableItemList);
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
            if (radioButtonQtSubjugation.Checked)
            {
                string name = comboBoxEnemy.SelectedItem.ToString() ?? "";
                textBoxDescription.Text = $"{name}を討伐してください。";
            }
            else if (radioButtonQtCollection.Checked)
            {
                string name = comboBoxItem.SelectedItem.ToString() ?? "";
                textBoxDescription.Text = $"{name}を集めてきてください。";
            }
            else
            {
                // 指定不可。
            }
        }

        /// <summary>
        /// 名前生成ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonGenerateNameClick(object sender, EventArgs e)
        {
            if (radioButtonQtSubjugation.Checked)
            {
                string name = comboBoxEnemy.SelectedItem.ToString() ?? "";
                textBoxName.Text = $"{name}の討伐";
            }
            else if (radioButtonQtCollection.Checked)
            {
                string name = comboBoxItem.SelectedItem.ToString() ?? "";
                textBoxName.Text = $"{name}の採取";
            }
            else
            {
                // 指定不可。
            }
        }

        /// <summary>
        /// 達成条件メッセージ生成ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonGenerateAchieveMessageClick(object sender, EventArgs e)
        {
            if (radioButtonQtSubjugation.Checked)
            {
                string name = comboBoxEnemy.SelectedItem.ToString() ?? "";
                int enemyCount = (int)(numericUpDownEnemyCount.Value);
                textBoxAchieveMsg.Text = $"{name}を{enemyCount}体討伐する。";
            }
            else if (radioButtonQtCollection.Checked)
            {
                string name = comboBoxItem.SelectedItem.ToString() ?? "";
                int itemCount = (int)(numericUpDownItemCount.Value);
                textBoxAchieveMsg.Text = $"{name}を{itemCount}個集める。";
            }
            else
            {
                // 指定不可。
            }
        }

        /// <summary>
        /// 報酬メッセージ生成ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonGenerateRewardMessage(object sender, EventArgs e)
        {
            StringBuilder sb = new StringBuilder();
            DataQuest quest = GetCurrentQuest();
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
                string itemName = GetRewardItemName(rewardItem);
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
        /// アイテム名を得る。
        /// </summary>
        /// <param name="rewardItem">報酬アイテムエントリ</param>
        /// <returns>報酬アイテム名</returns>
        private string GetRewardItemName(RewardItem rewardItem)
        {
            int kind = rewardItem.Kind;
            int id = rewardItem.DataId;
            if ((kind == 1) && (id > 0) && (id < items.Count))
            {
                return items[id].Name;
            }
            else if ((kind == 2) && (id > 0) && (id < weapons.Count))
            {
                return weapons[id].Name;
            }
            else if ((kind == 3) && (id > 0) && (id < armors.Count))
            {
                return armors[id].Name;
            }

            return null;
        }
    }
}
