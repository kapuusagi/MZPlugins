using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PEditor
{
    public partial class FormMain : Form
    {
        private FolderSelectDialog folderSelectDialog;
        private List<DataActorProfile> actorProfiles;

        public FormMain()
        {
            folderSelectDialog = null;
            actorProfiles = new List<DataActorProfile>();
            InitializeComponent();
            InitializeDataGridView();
        }

        /// <summary>
        /// データグリッドビューを初期化する。
        /// </summary>
        private void InitializeDataGridView()
        {
            // 空のモデルを作って設定するのと、カラムを1つ用意するだけ。
            DataTable dt = new DataTable();
            dt.Columns.Add(new DataColumn() { DataType = typeof(string), ColumnName = "id" });
            dataGridView.DataSource = dt;            
        }

        /// <summary>
        /// 編集中のファイルパス
        /// </summary>
        private string EditingFolder { get; set; } = null;

        /// <summary>
        /// クローズメニューが選択された時に処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnMenuItemExitClick(object sender, EventArgs e)
        {
            Close();
        }

        /// <summary>
        /// オープンメニューが選択された時の処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnMenuItemOpenClick(object sender, EventArgs e)
        {
            if (folderSelectDialog == null)
            {
                folderSelectDialog = new FolderSelectDialog();
            }
            folderSelectDialog.Path = Properties.Settings.Default.LastOpenDirectory;
            if (folderSelectDialog.ShowDialog(this) != DialogResult.OK)
            {
                return;
            } 
            try
            {
                string dir = folderSelectDialog.Path;

                // 読み出し処理
                ProcessOpen(dir);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex);
                MessageBox.Show(this, ex.Message, Properties.Resources.CaptionError);
            }


        }

        /// <summary>
        /// dirからファイルを読み出す。
        /// </summary>
        /// <param name="dir"></param>
        private void ProcessOpen(string dir)
        {
            this.EditingFolder = dir;
            Properties.Settings.Default.LastOpenDirectory = dir;
            actorProfiles = DataActorProfileReader.Read(dir);

            // データテーブルを初期化する。
            DataTable dt = (DataTable)(dataGridView.DataSource);
            dt.Rows.Clear();
            for (int i = 1; i < actorProfiles.Count; i++)
            {
                DataActorProfile actorProfile = actorProfiles[i];
                DataRow row = dt.NewRow();
                row[0] = string.Format("{0,4:D}:{1}", actorProfile.Id, actorProfile.Name);
                // 行にオブジェクト紐付けしたいなあ。
                dt.Rows.Add(row);
            }
        }

        /// <summary>
        /// 保存メニューが選択された時の処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnMenuItemSaveClick(object sender, EventArgs e)
        {
            try
            {
                if (string.IsNullOrEmpty(EditingFolder))
                {
                    ProcessSaveAs();
                }
                else
                {
                    ProcessSave(EditingFolder);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(this, ex.Message, Properties.Resources.CaptionError);
            }
        }



        /// <summary>
        /// 名前をつけて保存処理する。
        /// </summary>
        private void ProcessSaveAs()
        {
            // ファイル選択させる。
            if (folderSelectDialog == null)
            {
                folderSelectDialog = new FolderSelectDialog();
            }
            folderSelectDialog.Path = Properties.Settings.Default.LastOpenDirectory;
            if (folderSelectDialog.ShowDialog(this) != DialogResult.OK)
            {
                return;
            }

            string dir = folderSelectDialog.Path;
            Properties.Settings.Default.LastOpenDirectory = dir;
            EditingFolder = dir;
            ProcessSave(dir);
        }

        /// <summary>
        /// 保存処理する。
        /// </summary>
        /// <param name="dir">ファイルパス</param>
        private void ProcessSave(string dir)
        {
            // 保存する。
            DataActorProfileWriter.Write(dir, actorProfiles);
        }

        /// <summary>
        /// フォームがクローズされたときの処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            try
            {
                Properties.Settings.Default.Save();
            }
            catch
            {
                // Ignore.
            }
        }

        /// <summary>
        /// フォームが表示されたときの処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnFormShown(object sender, EventArgs e)
        {
            string dir = Properties.Settings.Default.LastOpenDirectory;
            if (!string.IsNullOrEmpty(dir) && System.IO.Directory.Exists(dir))
            {
                // 最後に暑かったフォルダがあるなら、再度よみこみを試す。
                try
                {
                    ProcessOpen(dir);
                }
                catch (Exception ex)
                {
                    // ファイルが移動された場合などはここに来る。無視。
                    System.Diagnostics.Debug.WriteLine(ex);
                }
            }
        }

        /// <summary>
        /// 追加ボタンがクリックされた時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonAddProfileClick(object sender, EventArgs e)
        {
            DataActorProfile actorProfile = GetSelectedActorProfile();
            if (actorProfile == null)
            {
                return;
            }
            Profile profile = new Profile();
            actorProfile.Profiles.Add(profile);

            TabPage tabPage = new TabPage();
            tabPage.Controls.Add(new ProfileEditorControl()
            {
                Profile = profile,
                Dock = DockStyle.Fill
            });

            tabControl.TabPages.Add(tabPage);

            // タブページ名変更
            UpdateTabPageNames();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnButtonDeleteProfileClick(object sender, EventArgs e)
        {
            DataActorProfile actorProfile = GetSelectedActorProfile();
            if (actorProfile == null)
            {
                return;
            }

            int index = tabControl.SelectedIndex;
            if ((index >= 0) && (index < tabControl.TabPages.Count))
            {
                actorProfile.Profiles.RemoveAt(index);
                tabControl.TabPages.Remove(tabControl.TabPages[index]);
                UpdateTabPageNames();
            }

        }

        /// <summary>
        /// タブページ名を更新する。
        /// </summary>
        private void UpdateTabPageNames()
        {
            for (int i = 0; i < tabControl.TabPages.Count; i++)
            {
                TabPage tabPage = tabControl.TabPages[i];
                tabPage.Text = $"Profile{(i + 1)}";
            }
        }

        /// <summary>
        /// データグリッドビューの選択状態が変わったときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnDataGridViewSelectionChanged(object sender, EventArgs e)
        {
            DataActorProfile actorProfile = GetSelectedActorProfile();
            if (actorProfile == null)
            {
                // タブページは全部クリア
                tabControl.TabPages.Clear();
            }
            else
            {
                for (int i = 0; i < actorProfile.Profiles.Count; i++)
                {
                    TabPage tabPage;
                    if (i < tabControl.TabPages.Count)
                    {
                        tabPage = tabControl.TabPages[i];
                        ProfileEditorControl editor = (ProfileEditorControl)(tabPage.Controls[0]);
                        editor.Profile = actorProfile.Profiles[i];
                    }
                    else
                    {
                        tabPage = new TabPage();
                        tabPage.Controls.Add(new ProfileEditorControl()
                        {
                            Profile = actorProfile.Profiles[i],
                            Dock = DockStyle.Fill
                        });
                        tabControl.TabPages.Add(tabPage);
                    }
                }

                // 余計なタブは削除(ちなみに途中を先に消すとIndex例外がでるので後ろから消す) 
                for (int i = tabControl.TabPages.Count - 1; i >= actorProfile.Profiles.Count; i--) 
                {
                    tabControl.TabPages.RemoveAt(i);
                }
                UpdateTabPageNames();
            }
        }

        /// <summary>
        /// 選択されているアクターのプロフィールデータを取得する。
        /// </summary>
        /// <returns>プロフィールデータ</returns>
        private DataActorProfile GetSelectedActorProfile()
        {
            var selectedRows = dataGridView.SelectedRows;
            if (selectedRows.Count == 0)
            {
                return null;
            }
            else
            {
                int index = selectedRows[0].Index;
                int actorIndex = index + 1; // 1つめスキップしてるからね。
                if ((actorIndex >= 0) && (actorIndex < actorProfiles.Count))
                {
                    return actorProfiles[actorIndex];
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
