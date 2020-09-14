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
    public partial class FormNumberInput : Form
    {
        public FormNumberInput()
        {
            InitializeComponent();
        }

        private void OnButtonCancelClick(object sender, EventArgs e)
        {
            DialogResult = DialogResult.Cancel;
            Close();
        }

        public int Number {
            get {
                return (int)(numericUpDownValue.Value);
            }
            set {
                if (InvokeRequired)
                {
                    Invoke((MethodInvoker)(() => Number = value));
                }
                else
                {
                    int min = (int)(numericUpDownValue.Minimum);
                    int max = (int)(numericUpDownValue.Maximum);
                    if (value < min)
                    {
                        numericUpDownValue.Value = min;
                    }
                    else if (value > max)
                    {
                        numericUpDownValue.Value = max;
                    }
                    else
                    {
                        numericUpDownValue.Value = value;
                    }
                }
            }
        }

        private void OnButtonOKClick(object sender, EventArgs e)
        {
            DialogResult = DialogResult.OK;
            Close();
        }
    }
}
