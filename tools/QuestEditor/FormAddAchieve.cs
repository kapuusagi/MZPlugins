using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MZUtils;

namespace QEditor
{
    public partial class FormAddAchieve : Form
    {
        /// <summary>
        /// 新しいインスタンスを構築する。
        /// </summary>
        public FormAddAchieve()
        {
            InitializeComponent();
        }

        /// <summary>
        /// OKボタンがクリックされた
        /// </summary>
        public event EventHandler OkClick;

        /// <summary>
        /// フォームが最初に表示されたときの処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnFormShown(object sender, EventArgs e)
        {
            comboBoxEnemies.Items.Clear();
            foreach (var enemy in ProjectData.Enemies)
            {
                if ((enemy != null) && !string.IsNullOrEmpty(enemy.Name))
                {
                    comboBoxEnemies.Items.Add(enemy);
                }
            }
            if (comboBoxEnemies.Items.Count > 0)
            {
                comboBoxEnemies.SelectedIndex = 0;
            }
            comboBoxEnemies.Enabled = (comboBoxEnemies.Items.Count > 0);
            numericUpDownSubjugationCount.Enabled = (comboBoxEnemies.Items.Count > 0);

            comboBoxItems.Items.Clear();
            foreach (var item in ProjectData.SelectableItemList)
            {
                comboBoxItems.Items.Add(item);
            }
            if (comboBoxItems.Items.Count > 0)
            {
                comboBoxItems.SelectedIndex = 0;
            }
            comboBoxItems.Enabled = (comboBoxItems.Items.Count > 0);
            numericUpDownItemCount.Enabled = (comboBoxItems.Items.Count > 0);

            comboBoxSwitches.Items.Clear();
            for (int i = 1; i < ProjectData.Switches.Count; i++)
            {
                comboBoxSwitches.Items.Add(ProjectData.GetSwitchName(i));
            }
            if (comboBoxSwitches.Items.Count > 0)
            {
                comboBoxSwitches.SelectedIndex = 0;
            }
            comboBoxSwitches.Enabled = (comboBoxSwitches.Items.Count > 0);
            comboBoxSwitchState.SelectedIndex = 0;
            comboBoxSwitchState.Enabled = (comboBoxSwitches.Items.Count > 0);
        }

        /// <summary>
        /// エネミー選択コンボボックスで項目を描画する時の処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnComboBoxEnemyDrawItem(object sender, DrawItemEventArgs e)
        {
            //背景を描画する
            //項目が選択されている時は強調表示される
            e.DrawBackground();

            var comboBox = (ComboBox)sender;
            //項目に表示する文字列
            var index = e.Index;
            var enemy = ((index >= 0) && (index < comboBox.Items.Count))
                ? (DataEnemy)(comboBox.Items[index]) : null;
            var text = (enemy != null) ? ProjectData.GetEnemyName(enemy.Id) : string.Empty;

            //使用するブラシ
            using (var brush = new SolidBrush(e.ForeColor))
            {
                float yoffs = (e.Bounds.Height - e.Graphics.MeasureString(text, e.Font).Height) / 2;
                e.Graphics.DrawString(text, e.Font, brush, e.Bounds.X, e.Bounds.Y + yoffs);
            }

            //フォーカスを示す四角形を描画
            e.DrawFocusRectangle();
        }

        private void OnComboBoxItemsDrawItem(object sender, DrawItemEventArgs e)
        {
            //背景を描画する
            //項目が選択されている時は強調表示される
            e.DrawBackground();

            var comboBox = (ComboBox)sender;
            //項目に表示する文字列
            var index = e.Index;
            var item = ((index >= 0) && (index < comboBox.Items.Count))
                ? (IItem)(comboBox.Items[index]) : null;
            var text = (item != null) ? ProjectData.GetItemName(item.Kind, item.Id) : string.Empty;

            //使用するブラシ
            using (var brush = new SolidBrush(e.ForeColor))
            {
                float yoffs = (e.Bounds.Height - e.Graphics.MeasureString(text, e.Font).Height) / 2;
                e.Graphics.DrawString(text, e.Font, brush, e.Bounds.X, e.Bounds.Y + yoffs);
            }

            //フォーカスを示す四角形を描画
            e.DrawFocusRectangle();
        }

        /// <summary>
        /// キャンセルボタンがクリックされた時に通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonCancelClick(object sender, EventArgs e)
        {
            SetResult(null);
            Close();
        }

        /// <summary>
        /// OKボタンがクリックされた時の処理を行う。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonOkClick(object sender, EventArgs e)
        {
            var achieveType = tabControl.SelectedIndex;
            if (achieveType == 0)
            {
                var enemy = (DataEnemy)(comboBoxEnemies.SelectedItem);
                if (enemy != null)
                {
                    var count = (int)(numericUpDownSubjugationCount.Value);
                    var achieve = new AchieveSubjugation(new DataAchieve())
                    {
                        EnemyId = enemy.Id,
                        EnemyCount = count
                    };
                    SetResult(achieve);
                }
            }
            else if (achieveType == 1)
            {
                var item = (IItem)(comboBoxItems.SelectedItem);
                if (item != null)
                {
                    var count = (int)(numericUpDownItemCount.Value);
                    var achieve = new AchieveCollection(new DataAchieve())
                    {
                        ItemType = item.Kind,
                        ItemId = item.Id,
                        Count = count
                    };
                    SetResult(achieve);
                }

            }
            else if (achieveType == 2)
            {
                int selectedIndex = comboBoxSwitches.SelectedIndex;
                if (selectedIndex >= 0)
                {
                    int switchId = selectedIndex + 1;
                    bool switchState = (comboBoxSwitchState.SelectedIndex) == 0;
                    var achieve = new AchieveEvent(new DataAchieve())
                    {
                        SwitchNo = switchId,
                        SwitchCondition = switchState
                    };
                    SetResult(achieve);
                }
            }
        }

        /// <summary>
        /// 選択結果を設定する。
        /// </summary>
        /// <param name="achieve">達成条件</param>
        private void SetResult(IAchieve achieve)
        {
            Achieve = achieve;
            DialogResult = (achieve != null) ? DialogResult.OK : DialogResult.Cancel;
            OkClick?.Invoke(this, new EventArgs());
        }

        /// <summary>
        /// 選択された達成条件
        /// </summary>
        public IAchieve Achieve { get; private set; } = null;
    }
}
