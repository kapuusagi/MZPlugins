using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MZUtils;

namespace SEditor
{
    public partial class ItemEntryControl : UserControl
    {
        private ItemEntry itemEntry = null;
        public ItemEntryControl()
        {
            
            InitializeComponent();
        }
        /// <summary>
        /// このコントロールに関連付けられるアイテムエントリ
        /// </summary>
        internal ItemEntry ItemEntry { 
            get {
                return itemEntry;
            } 
            set {
                this.itemEntry = value;
                ModelToUI();
            }
        }

        /// <summary>
        /// モデルのデータをUIに繁栄させる。
        /// </summary>
        private void ModelToUI()
        {
            if (InvokeRequired)
            {
                Invoke((MethodInvoker)(() => ModelToUI()));
            }
            else
            {
                labelName.Text = GetLabelName(ItemEntry);
                numericUpDownMin.Value = ItemEntry.MinCount;
                numericUpDownMax.Value = ItemEntry.MaxCount;
                textBoxCondition.Text = itemEntry.Condition;
            }
        }

        /// <summary>
        /// ラベルに表示する名前を取得する。
        /// </summary>
        /// <param name="entry">アイテムエントリ</param>
        /// <returns>ラベルに表示する名前</returns>
        private static string GetLabelName(ItemEntry entry)
        {
            switch (entry.Kind) {
                case (int)(ItemType.Item):
                    return $"Item:{entry.Id}";
                case (int)(ItemType.Weapon):
                    return $"Weapon:{entry.Id}";
                case (int)(ItemType.Armor):
                    return $"Armor:{entry.Id}";
                default:
                    return $"type{entry.Kind}/{entry.Id}";
            }

        }
    }
}
