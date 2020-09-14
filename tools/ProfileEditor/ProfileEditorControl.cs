using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace PEditor
{
    public partial class ProfileEditorControl : UserControl
    {
        private Profile profile = new Profile();
        public ProfileEditorControl()
        {
            InitializeComponent();
        }

        /// <summary>
        /// プロフィールデータ
        /// </summary>
        internal Profile Profile {
            get {
                return profile;
            }
            set {
                this.profile = value;
                UpdateUI();
            }
        }

        /// <summary>
        /// モデルののデータをUIに反映させる。
        /// </summary>
        private void UpdateUI()
        {
            if (InvokeRequired)
            {
                Invoke((MethodInvoker)(() => UpdateUI()));
            }
            else
            {
                textBoxCondition.Text = profile.Condition;
                textBoxProfile.Text = profile.Text;
            }
        }

        /// <summary>
        /// 条件欄の記述が変更された
        /// </summary>
        /// <param name="sender">送信元オブジェクト</param>
        /// <param name="e">イベントオブジェクト</param>
        private void OnTextBoxConditionTextChanged(object sender, EventArgs e)
        {
            profile.Condition = textBoxCondition.Text;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnTextBoxProfileTextChanged(object sender, EventArgs e)
        {
            profile.Text = textBoxProfile.Text;
        }
    }
}
