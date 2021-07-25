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
    /// GuildRank入力欄
    /// </summary>
    public partial class FormEditGuildRank : Form
    {
        private string[] items;

        /// <summary>
        /// 新しいインスタンスを構築する。
        /// </summary>
        public FormEditGuildRank()
        {
            items = new string[] { "" };
            InitializeComponent();
        }

        /// <summary>
        /// 選択項目
        /// </summary>
        [Browsable(false)]
        public string[] Items {
            get => items;
            set
            {
                items = value;
                ModelToUI();
            }
        }

        /// <summary>
        /// モデルをUIに反映させる。
        /// </summary>
        private void ModelToUI()
        {
            if (InvokeRequired)
            {
                Invoke((MethodInvoker)(ModelToUI));
                return;
            }

            using (var writer = new System.IO.StringWriter())
            {
                foreach (var str in items)
                {
                    writer.WriteLine(str);
                }
                writer.Flush();
                richTextBox.Text = writer.ToString();
            }
        }

        /// <summary>
        /// Closeボタンがクリックされたときに通知を受け取る。
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnButtonCloseClick(object sender, EventArgs e)
        {
            var array = richTextBox.Text.Split('\n').Select(line => line.Trim()).ToArray();
            var list = new List<string>();
            foreach (var str in array)
            {
                if (!string.IsNullOrEmpty(str))
                {
                    list.Add(str);
                }
            }

            items = list.ToArray();

            DialogResult = DialogResult.OK;
            Close();
        }
    }
}
