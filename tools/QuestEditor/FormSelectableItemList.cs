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
    public partial class FormSelectableItemList : Form
    {
        /// <summary>
        /// 新しいインスタンスを構築する。
        /// </summary>
        public FormSelectableItemList()
        {
            InitializeComponent();
        }

        /// <summary>
        /// 選択可能な項目リストを設定する。
        /// </summary>
        /// <param name="items">項目リスト</param>
        public void SetItemList(List<IItem> items)
        {
            listBoxItems.Items.Clear();
            foreach (IItem item in items)
            {
                listBoxItems.Items.Add(item);
            }
        }

        /// <summary>
        /// アイテムが選択されたときに通知する。
        /// </summary>
        public event EventHandler ItemSelected;

        /// <summary>
        /// リストボックスの項目を描画するときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnListBoxDrawItem(object sender, DrawItemEventArgs e)
        {
            e.DrawBackground();

            ListBox listBox = (ListBox)(sender);
            if (e.Index >= 0)
            {
                IItem item = (IItem)(listBox.Items[e.Index]);
                string text = string.Empty;
                if (item is DataItem di)
                {
                    text = "Item:" + di.Id + ":" + di.Name;
                }
                else if (item is DataWeapon dw)
                {
                    text = "Weapon:" + dw.Id + ":" + dw.Name;
                }
                else if (item is DataArmor da)
                {
                    text = "Weapon:" + da.Id + ":" + da.Name;
                }
                using (Brush brush = new SolidBrush(e.ForeColor))
                {
                    e.Graphics.DrawString(text, e.Font, brush, e.Bounds);
                }
            }
            e.DrawFocusRectangle();
        }

        /// <summary>
        /// 追加ボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonAddClick(object sender, EventArgs e)
        {
            if (listBoxItems.SelectedIndex >= 0)
            {
                this.ItemSelected?.Invoke(this, new EventArgs());
            }
        }

        /// <summary>
        /// アイテムリストでダブルクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnItemListDoubleClick(object sender, EventArgs e)
        {
            if (listBoxItems.SelectedIndex >= 0)
            {
                this.ItemSelected?.Invoke(this, new EventArgs());
            }
        }

        /// <summary>
        /// 選択されている項目
        /// </summary>
        public IItem SelectedItem {
            get {
                return (IItem)(listBoxItems.SelectedItem);
            }
        }

        /// <summary>
        /// クローズボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonCancelClick(object sender, EventArgs e)
        {
            Close();
        }
    }
}
