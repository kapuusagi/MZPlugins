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
            dataGridViewQuests.Columns[0].AutoSizeMode = DataGridViewAutoSizeColumnMode.Fill;
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

            //if (itemListForm != null)
            //{
            //    itemListForm.SetItemList(ProjectData.SelectableItemList);
            //}


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
            panelQuestEditor.Quest = quest;
            panelQuestEditor.Enabled = (quest != null);
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
        /// クエストエディタでクエスト名が変更されたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnQuestEditorQuestNameChanged(object sender, EventArgs e)
        {
            var rows = dataGridViewQuests.SelectedRows;
            var quest = panelQuestEditor.Quest;
            int index = rows[0].Index;
            if ((index >= 0) && (quest != null))
            {
                DataTable dt = (DataTable)(dataGridViewQuests.DataSource);
                var row = dt.Rows[index];
                row.SetField(0, string.Format("{0,4:D}:{1}", quest.Id, quest.Name));
            }
        }
    }
}
