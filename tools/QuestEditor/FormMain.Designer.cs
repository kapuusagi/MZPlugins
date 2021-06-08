namespace QEditor
{
    partial class FormMain
    {
        /// <summary>
        /// 必要なデザイナー変数です。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 使用中のリソースをすべてクリーンアップします。
        /// </summary>
        /// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows フォーム デザイナーで生成されたコード

        /// <summary>
        /// デザイナー サポートに必要なメソッドです。このメソッドの内容を
        /// コード エディターで変更しないでください。
        /// </summary>
        private void InitializeComponent()
        {
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle3 = new System.Windows.Forms.DataGridViewCellStyle();
            this.panel1 = new System.Windows.Forms.Panel();
            this.dataGridViewQuests = new System.Windows.Forms.DataGridView();
            this.flowLayoutPanel1 = new System.Windows.Forms.FlowLayoutPanel();
            this.buttonChangeItemCount = new System.Windows.Forms.Button();
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuItemOpen = new System.Windows.Forms.ToolStripMenuItem();
            this.menuItemSave = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStripSeparator1 = new System.Windows.Forms.ToolStripSeparator();
            this.menuItemExit = new System.Windows.Forms.ToolStripMenuItem();
            this.panelEdit = new System.Windows.Forms.Panel();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.tableLayoutPanel6 = new System.Windows.Forms.TableLayoutPanel();
            this.label8 = new System.Windows.Forms.Label();
            this.buttonAddItem = new System.Windows.Forms.Button();
            this.dataGridViewRewardItems = new System.Windows.Forms.DataGridView();
            this.tableLayoutPanel5 = new System.Windows.Forms.TableLayoutPanel();
            this.numericUpDownRewardGold = new System.Windows.Forms.NumericUpDown();
            this.label4 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.textBoxRewardMsg = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.numericUpDownGuildExp = new System.Windows.Forms.NumericUpDown();
            this.buttonGenerateRewardMessage = new System.Windows.Forms.Button();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.textBoxNote = new System.Windows.Forms.TextBox();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.textBoxDescription = new System.Windows.Forms.TextBox();
            this.flowLayoutPanel2 = new System.Windows.Forms.FlowLayoutPanel();
            this.buttonGenerateDescription = new System.Windows.Forms.Button();
            this.tableLayoutPanel1 = new System.Windows.Forms.TableLayoutPanel();
            this.buttonGenerateAchieveMessage = new System.Windows.Forms.Button();
            this.textBoxAchieveMsg = new System.Windows.Forms.TextBox();
            this.label10 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.dataGridViewAchieves = new System.Windows.Forms.DataGridView();
            this.buttonAddAchieve = new System.Windows.Forms.Button();
            this.tableLayoutPanel3 = new System.Windows.Forms.TableLayoutPanel();
            this.label5 = new System.Windows.Forms.Label();
            this.textBoxEntrustCondition = new System.Windows.Forms.TextBox();
            this.panel2 = new System.Windows.Forms.Panel();
            this.tableLayoutPanel2 = new System.Windows.Forms.TableLayoutPanel();
            this.label1 = new System.Windows.Forms.Label();
            this.textBoxName = new System.Windows.Forms.TextBox();
            this.buttonGenerateName = new System.Windows.Forms.Button();
            this.tableLayoutPanel4 = new System.Windows.Forms.TableLayoutPanel();
            this.label2 = new System.Windows.Forms.Label();
            this.comboBoxGuildRank = new System.Windows.Forms.ComboBox();
            this.panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridViewQuests)).BeginInit();
            this.flowLayoutPanel1.SuspendLayout();
            this.menuStrip1.SuspendLayout();
            this.panelEdit.SuspendLayout();
            this.groupBox1.SuspendLayout();
            this.tableLayoutPanel6.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridViewRewardItems)).BeginInit();
            this.tableLayoutPanel5.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDownRewardGold)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDownGuildExp)).BeginInit();
            this.groupBox3.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.flowLayoutPanel2.SuspendLayout();
            this.tableLayoutPanel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridViewAchieves)).BeginInit();
            this.tableLayoutPanel3.SuspendLayout();
            this.panel2.SuspendLayout();
            this.tableLayoutPanel2.SuspendLayout();
            this.tableLayoutPanel4.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.dataGridViewQuests);
            this.panel1.Controls.Add(this.flowLayoutPanel1);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Left;
            this.panel1.Location = new System.Drawing.Point(0, 24);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(200, 547);
            this.panel1.TabIndex = 0;
            // 
            // dataGridViewQuests
            // 
            this.dataGridViewQuests.AllowUserToAddRows = false;
            this.dataGridViewQuests.AllowUserToDeleteRows = false;
            this.dataGridViewQuests.AllowUserToResizeRows = false;
            dataGridViewCellStyle3.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
            this.dataGridViewQuests.AlternatingRowsDefaultCellStyle = dataGridViewCellStyle3;
            this.dataGridViewQuests.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridViewQuests.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dataGridViewQuests.Location = new System.Drawing.Point(0, 0);
            this.dataGridViewQuests.MultiSelect = false;
            this.dataGridViewQuests.Name = "dataGridViewQuests";
            this.dataGridViewQuests.ReadOnly = true;
            this.dataGridViewQuests.RowHeadersVisible = false;
            this.dataGridViewQuests.RowTemplate.Height = 21;
            this.dataGridViewQuests.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dataGridViewQuests.Size = new System.Drawing.Size(200, 518);
            this.dataGridViewQuests.TabIndex = 0;
            this.dataGridViewQuests.SelectionChanged += new System.EventHandler(this.OnDataGridViewQuestsSelectionChanged);
            // 
            // flowLayoutPanel1
            // 
            this.flowLayoutPanel1.AutoSize = true;
            this.flowLayoutPanel1.Controls.Add(this.buttonChangeItemCount);
            this.flowLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.flowLayoutPanel1.Location = new System.Drawing.Point(0, 518);
            this.flowLayoutPanel1.Name = "flowLayoutPanel1";
            this.flowLayoutPanel1.Size = new System.Drawing.Size(200, 29);
            this.flowLayoutPanel1.TabIndex = 0;
            // 
            // buttonChangeItemCount
            // 
            this.buttonChangeItemCount.Location = new System.Drawing.Point(3, 3);
            this.buttonChangeItemCount.Name = "buttonChangeItemCount";
            this.buttonChangeItemCount.Size = new System.Drawing.Size(121, 23);
            this.buttonChangeItemCount.TabIndex = 0;
            this.buttonChangeItemCount.Text = "Change item count";
            this.buttonChangeItemCount.UseVisualStyleBackColor = true;
            this.buttonChangeItemCount.Click += new System.EventHandler(this.OnButtonChangeItemCountClick);
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(800, 24);
            this.menuStrip1.TabIndex = 0;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.menuItemOpen,
            this.menuItemSave,
            this.toolStripSeparator1,
            this.menuItemExit});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(37, 20);
            this.fileToolStripMenuItem.Text = "File";
            // 
            // menuItemOpen
            // 
            this.menuItemOpen.Name = "menuItemOpen";
            this.menuItemOpen.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.O)));
            this.menuItemOpen.Size = new System.Drawing.Size(145, 22);
            this.menuItemOpen.Text = "Open";
            this.menuItemOpen.Click += new System.EventHandler(this.OnMenuItemOpenClick);
            // 
            // menuItemSave
            // 
            this.menuItemSave.Name = "menuItemSave";
            this.menuItemSave.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.S)));
            this.menuItemSave.Size = new System.Drawing.Size(145, 22);
            this.menuItemSave.Text = "Save";
            this.menuItemSave.Click += new System.EventHandler(this.OnMenuItemSaveClick);
            // 
            // toolStripSeparator1
            // 
            this.toolStripSeparator1.Name = "toolStripSeparator1";
            this.toolStripSeparator1.Size = new System.Drawing.Size(142, 6);
            // 
            // menuItemExit
            // 
            this.menuItemExit.Name = "menuItemExit";
            this.menuItemExit.Size = new System.Drawing.Size(145, 22);
            this.menuItemExit.Text = "Exit";
            this.menuItemExit.Click += new System.EventHandler(this.OnMenuItemExitClick);
            // 
            // panelEdit
            // 
            this.panelEdit.Controls.Add(this.groupBox1);
            this.panelEdit.Controls.Add(this.groupBox3);
            this.panelEdit.Controls.Add(this.groupBox2);
            this.panelEdit.Controls.Add(this.tableLayoutPanel1);
            this.panelEdit.Controls.Add(this.tableLayoutPanel3);
            this.panelEdit.Controls.Add(this.panel2);
            this.panelEdit.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panelEdit.Location = new System.Drawing.Point(200, 24);
            this.panelEdit.Name = "panelEdit";
            this.panelEdit.Size = new System.Drawing.Size(600, 547);
            this.panelEdit.TabIndex = 2;
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.tableLayoutPanel6);
            this.groupBox1.Controls.Add(this.tableLayoutPanel5);
            this.groupBox1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.groupBox1.Location = new System.Drawing.Point(0, 295);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(371, 252);
            this.groupBox1.TabIndex = 2;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Rewards";
            // 
            // tableLayoutPanel6
            // 
            this.tableLayoutPanel6.ColumnCount = 3;
            this.tableLayoutPanel6.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel6.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel6.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel6.Controls.Add(this.label8, 0, 0);
            this.tableLayoutPanel6.Controls.Add(this.buttonAddItem, 2, 0);
            this.tableLayoutPanel6.Controls.Add(this.dataGridViewRewardItems, 1, 0);
            this.tableLayoutPanel6.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tableLayoutPanel6.Location = new System.Drawing.Point(3, 136);
            this.tableLayoutPanel6.Name = "tableLayoutPanel6";
            this.tableLayoutPanel6.RowCount = 1;
            this.tableLayoutPanel6.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 50F));
            this.tableLayoutPanel6.Size = new System.Drawing.Size(365, 113);
            this.tableLayoutPanel6.TabIndex = 1;
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(3, 0);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(33, 12);
            this.label8.TabIndex = 0;
            this.label8.Text = "Items";
            // 
            // buttonAddItem
            // 
            this.buttonAddItem.Location = new System.Drawing.Point(287, 3);
            this.buttonAddItem.Name = "buttonAddItem";
            this.buttonAddItem.Size = new System.Drawing.Size(75, 23);
            this.buttonAddItem.TabIndex = 2;
            this.buttonAddItem.Text = "Add";
            this.buttonAddItem.UseVisualStyleBackColor = true;
            this.buttonAddItem.Click += new System.EventHandler(this.OnButtonAddItemClick);
            // 
            // dataGridViewRewardItems
            // 
            this.dataGridViewRewardItems.AllowUserToAddRows = false;
            this.dataGridViewRewardItems.AllowUserToResizeRows = false;
            this.dataGridViewRewardItems.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridViewRewardItems.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dataGridViewRewardItems.Location = new System.Drawing.Point(42, 3);
            this.dataGridViewRewardItems.MultiSelect = false;
            this.dataGridViewRewardItems.Name = "dataGridViewRewardItems";
            this.dataGridViewRewardItems.RowHeadersVisible = false;
            this.dataGridViewRewardItems.RowTemplate.Height = 21;
            this.dataGridViewRewardItems.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dataGridViewRewardItems.Size = new System.Drawing.Size(239, 107);
            this.dataGridViewRewardItems.TabIndex = 1;
            this.dataGridViewRewardItems.CellValueChanged += new System.Windows.Forms.DataGridViewCellEventHandler(this.OnDataGridViewRewardItemsCellValueChanged);
            this.dataGridViewRewardItems.RowsRemoved += new System.Windows.Forms.DataGridViewRowsRemovedEventHandler(this.OnDataGridViewRewardItemsRowsRemoved);
            // 
            // tableLayoutPanel5
            // 
            this.tableLayoutPanel5.ColumnCount = 3;
            this.tableLayoutPanel5.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel5.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel5.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel5.Controls.Add(this.numericUpDownRewardGold, 1, 2);
            this.tableLayoutPanel5.Controls.Add(this.label4, 0, 0);
            this.tableLayoutPanel5.Controls.Add(this.label3, 0, 1);
            this.tableLayoutPanel5.Controls.Add(this.textBoxRewardMsg, 1, 0);
            this.tableLayoutPanel5.Controls.Add(this.label7, 0, 2);
            this.tableLayoutPanel5.Controls.Add(this.numericUpDownGuildExp, 1, 1);
            this.tableLayoutPanel5.Controls.Add(this.buttonGenerateRewardMessage, 2, 0);
            this.tableLayoutPanel5.Dock = System.Windows.Forms.DockStyle.Top;
            this.tableLayoutPanel5.Location = new System.Drawing.Point(3, 15);
            this.tableLayoutPanel5.Name = "tableLayoutPanel5";
            this.tableLayoutPanel5.RowCount = 3;
            this.tableLayoutPanel5.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 60F));
            this.tableLayoutPanel5.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 20F));
            this.tableLayoutPanel5.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 20F));
            this.tableLayoutPanel5.Size = new System.Drawing.Size(365, 121);
            this.tableLayoutPanel5.TabIndex = 0;
            // 
            // numericUpDownRewardGold
            // 
            this.numericUpDownRewardGold.Location = new System.Drawing.Point(63, 99);
            this.numericUpDownRewardGold.Maximum = new decimal(new int[] {
            1000000,
            0,
            0,
            0});
            this.numericUpDownRewardGold.Name = "numericUpDownRewardGold";
            this.numericUpDownRewardGold.Size = new System.Drawing.Size(120, 19);
            this.numericUpDownRewardGold.TabIndex = 5;
            this.numericUpDownRewardGold.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            this.numericUpDownRewardGold.ValueChanged += new System.EventHandler(this.OnNumericUpDownRewardGoldValueChanged);
            // 
            // label4
            // 
            this.label4.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(3, 30);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(50, 12);
            this.label4.TabIndex = 17;
            this.label4.Text = "Message";
            // 
            // label3
            // 
            this.label3.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(3, 78);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(54, 12);
            this.label3.TabIndex = 2;
            this.label3.Text = "Guild Exp";
            // 
            // textBoxRewardMsg
            // 
            this.textBoxRewardMsg.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxRewardMsg.Location = new System.Drawing.Point(63, 3);
            this.textBoxRewardMsg.Multiline = true;
            this.textBoxRewardMsg.Name = "textBoxRewardMsg";
            this.textBoxRewardMsg.Size = new System.Drawing.Size(218, 66);
            this.textBoxRewardMsg.TabIndex = 0;
            this.textBoxRewardMsg.TextChanged += new System.EventHandler(this.OnTextBoxRewardMsgTextChanged);
            // 
            // label7
            // 
            this.label7.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(3, 102);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(28, 12);
            this.label7.TabIndex = 4;
            this.label7.Text = "Gold";
            // 
            // numericUpDownGuildExp
            // 
            this.numericUpDownGuildExp.Location = new System.Drawing.Point(63, 75);
            this.numericUpDownGuildExp.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.numericUpDownGuildExp.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.numericUpDownGuildExp.Name = "numericUpDownGuildExp";
            this.numericUpDownGuildExp.Size = new System.Drawing.Size(120, 19);
            this.numericUpDownGuildExp.TabIndex = 3;
            this.numericUpDownGuildExp.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            this.numericUpDownGuildExp.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.numericUpDownGuildExp.ValueChanged += new System.EventHandler(this.OnNumericUpDownGuildExpValueChanged);
            // 
            // buttonGenerateRewardMessage
            // 
            this.buttonGenerateRewardMessage.Location = new System.Drawing.Point(287, 3);
            this.buttonGenerateRewardMessage.Name = "buttonGenerateRewardMessage";
            this.buttonGenerateRewardMessage.Size = new System.Drawing.Size(75, 23);
            this.buttonGenerateRewardMessage.TabIndex = 1;
            this.buttonGenerateRewardMessage.Text = "Generate";
            this.buttonGenerateRewardMessage.UseVisualStyleBackColor = true;
            this.buttonGenerateRewardMessage.Click += new System.EventHandler(this.OnButtonGenerateRewardMessage);
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.textBoxNote);
            this.groupBox3.Dock = System.Windows.Forms.DockStyle.Right;
            this.groupBox3.Location = new System.Drawing.Point(371, 295);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(229, 252);
            this.groupBox3.TabIndex = 16;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Note";
            this.groupBox3.TextChanged += new System.EventHandler(this.OnTextBoxNoteTextChanged);
            // 
            // textBoxNote
            // 
            this.textBoxNote.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxNote.Location = new System.Drawing.Point(3, 15);
            this.textBoxNote.Multiline = true;
            this.textBoxNote.Name = "textBoxNote";
            this.textBoxNote.Size = new System.Drawing.Size(223, 234);
            this.textBoxNote.TabIndex = 0;
            this.textBoxNote.TextChanged += new System.EventHandler(this.OnTextBoxNoteTextChanged);
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.textBoxDescription);
            this.groupBox2.Controls.Add(this.flowLayoutPanel2);
            this.groupBox2.Dock = System.Windows.Forms.DockStyle.Top;
            this.groupBox2.Location = new System.Drawing.Point(0, 196);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(600, 99);
            this.groupBox2.TabIndex = 1;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Description";
            // 
            // textBoxDescription
            // 
            this.textBoxDescription.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxDescription.Location = new System.Drawing.Point(3, 44);
            this.textBoxDescription.Multiline = true;
            this.textBoxDescription.Name = "textBoxDescription";
            this.textBoxDescription.Size = new System.Drawing.Size(594, 52);
            this.textBoxDescription.TabIndex = 1;
            this.textBoxDescription.TextChanged += new System.EventHandler(this.OnTextBoxDescriptionTextChanged);
            // 
            // flowLayoutPanel2
            // 
            this.flowLayoutPanel2.AutoSize = true;
            this.flowLayoutPanel2.Controls.Add(this.buttonGenerateDescription);
            this.flowLayoutPanel2.Dock = System.Windows.Forms.DockStyle.Top;
            this.flowLayoutPanel2.FlowDirection = System.Windows.Forms.FlowDirection.RightToLeft;
            this.flowLayoutPanel2.Location = new System.Drawing.Point(3, 15);
            this.flowLayoutPanel2.Name = "flowLayoutPanel2";
            this.flowLayoutPanel2.Size = new System.Drawing.Size(594, 29);
            this.flowLayoutPanel2.TabIndex = 0;
            // 
            // buttonGenerateDescription
            // 
            this.buttonGenerateDescription.Location = new System.Drawing.Point(516, 3);
            this.buttonGenerateDescription.Name = "buttonGenerateDescription";
            this.buttonGenerateDescription.Size = new System.Drawing.Size(75, 23);
            this.buttonGenerateDescription.TabIndex = 0;
            this.buttonGenerateDescription.Text = "Generate";
            this.buttonGenerateDescription.UseVisualStyleBackColor = true;
            this.buttonGenerateDescription.Click += new System.EventHandler(this.OnButtonGenerateDescriptionClick);
            // 
            // tableLayoutPanel1
            // 
            this.tableLayoutPanel1.ColumnCount = 3;
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel1.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel1.Controls.Add(this.buttonGenerateAchieveMessage, 2, 1);
            this.tableLayoutPanel1.Controls.Add(this.textBoxAchieveMsg, 1, 1);
            this.tableLayoutPanel1.Controls.Add(this.label10, 0, 1);
            this.tableLayoutPanel1.Controls.Add(this.label6, 0, 0);
            this.tableLayoutPanel1.Controls.Add(this.dataGridViewAchieves, 1, 0);
            this.tableLayoutPanel1.Controls.Add(this.buttonAddAchieve, 2, 0);
            this.tableLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.tableLayoutPanel1.Location = new System.Drawing.Point(0, 76);
            this.tableLayoutPanel1.Name = "tableLayoutPanel1";
            this.tableLayoutPanel1.RowCount = 2;
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel1.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 32F));
            this.tableLayoutPanel1.Size = new System.Drawing.Size(600, 120);
            this.tableLayoutPanel1.TabIndex = 15;
            // 
            // buttonGenerateAchieveMessage
            // 
            this.buttonGenerateAchieveMessage.Location = new System.Drawing.Point(522, 91);
            this.buttonGenerateAchieveMessage.Name = "buttonGenerateAchieveMessage";
            this.buttonGenerateAchieveMessage.Size = new System.Drawing.Size(75, 18);
            this.buttonGenerateAchieveMessage.TabIndex = 2;
            this.buttonGenerateAchieveMessage.Text = "Generate";
            this.buttonGenerateAchieveMessage.UseVisualStyleBackColor = true;
            this.buttonGenerateAchieveMessage.Click += new System.EventHandler(this.OnButtonGenerateAchieveMessageClick);
            // 
            // textBoxAchieveMsg
            // 
            this.textBoxAchieveMsg.Dock = System.Windows.Forms.DockStyle.Fill;
            this.textBoxAchieveMsg.Location = new System.Drawing.Point(82, 91);
            this.textBoxAchieveMsg.Multiline = true;
            this.textBoxAchieveMsg.Name = "textBoxAchieveMsg";
            this.textBoxAchieveMsg.Size = new System.Drawing.Size(434, 26);
            this.textBoxAchieveMsg.TabIndex = 1;
            this.textBoxAchieveMsg.TextChanged += new System.EventHandler(this.OnTextBoxAchieveMsgTextChanged);
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(3, 88);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(73, 12);
            this.label10.TabIndex = 0;
            this.label10.Text = "Achieve Msg.";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(3, 0);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(52, 12);
            this.label6.TabIndex = 0;
            this.label6.Text = "Achieves";
            // 
            // dataGridViewAchieves
            // 
            this.dataGridViewAchieves.AllowUserToAddRows = false;
            this.dataGridViewAchieves.AllowUserToResizeRows = false;
            this.dataGridViewAchieves.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridViewAchieves.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dataGridViewAchieves.Location = new System.Drawing.Point(82, 3);
            this.dataGridViewAchieves.MultiSelect = false;
            this.dataGridViewAchieves.Name = "dataGridViewAchieves";
            this.dataGridViewAchieves.RowHeadersVisible = false;
            this.dataGridViewAchieves.RowTemplate.Height = 21;
            this.dataGridViewAchieves.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.dataGridViewAchieves.Size = new System.Drawing.Size(434, 82);
            this.dataGridViewAchieves.TabIndex = 19;
            this.dataGridViewAchieves.RowsRemoved += new System.Windows.Forms.DataGridViewRowsRemovedEventHandler(this.OnDataGridViewAchievesRowRemoved);
            // 
            // buttonAddAchieve
            // 
            this.buttonAddAchieve.Location = new System.Drawing.Point(522, 3);
            this.buttonAddAchieve.Name = "buttonAddAchieve";
            this.buttonAddAchieve.Size = new System.Drawing.Size(75, 23);
            this.buttonAddAchieve.TabIndex = 20;
            this.buttonAddAchieve.Text = "Add";
            this.buttonAddAchieve.UseVisualStyleBackColor = true;
            this.buttonAddAchieve.Click += new System.EventHandler(this.OnButtonAchieveAddClick);
            // 
            // tableLayoutPanel3
            // 
            this.tableLayoutPanel3.ColumnCount = 2;
            this.tableLayoutPanel3.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel3.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel3.Controls.Add(this.label5, 0, 0);
            this.tableLayoutPanel3.Controls.Add(this.textBoxEntrustCondition, 1, 0);
            this.tableLayoutPanel3.Dock = System.Windows.Forms.DockStyle.Top;
            this.tableLayoutPanel3.Location = new System.Drawing.Point(0, 38);
            this.tableLayoutPanel3.Name = "tableLayoutPanel3";
            this.tableLayoutPanel3.RowCount = 1;
            this.tableLayoutPanel3.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel3.Size = new System.Drawing.Size(600, 38);
            this.tableLayoutPanel3.TabIndex = 0;
            // 
            // label5
            // 
            this.label5.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(3, 13);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(124, 12);
            this.label5.TabIndex = 0;
            this.label5.Text = "Entrust Condition(Eval)";
            // 
            // textBoxEntrustCondition
            // 
            this.textBoxEntrustCondition.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right)));
            this.textBoxEntrustCondition.Location = new System.Drawing.Point(133, 9);
            this.textBoxEntrustCondition.Name = "textBoxEntrustCondition";
            this.textBoxEntrustCondition.Size = new System.Drawing.Size(464, 19);
            this.textBoxEntrustCondition.TabIndex = 1;
            this.textBoxEntrustCondition.TextChanged += new System.EventHandler(this.OnTextBoxEntrustConditionTextChanged);
            // 
            // panel2
            // 
            this.panel2.Controls.Add(this.tableLayoutPanel2);
            this.panel2.Controls.Add(this.tableLayoutPanel4);
            this.panel2.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel2.Location = new System.Drawing.Point(0, 0);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(600, 38);
            this.panel2.TabIndex = 10;
            // 
            // tableLayoutPanel2
            // 
            this.tableLayoutPanel2.ColumnCount = 3;
            this.tableLayoutPanel2.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel2.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel2.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel2.Controls.Add(this.label1, 0, 0);
            this.tableLayoutPanel2.Controls.Add(this.textBoxName, 1, 0);
            this.tableLayoutPanel2.Controls.Add(this.buttonGenerateName, 2, 0);
            this.tableLayoutPanel2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tableLayoutPanel2.Location = new System.Drawing.Point(0, 0);
            this.tableLayoutPanel2.Name = "tableLayoutPanel2";
            this.tableLayoutPanel2.RowCount = 1;
            this.tableLayoutPanel2.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel2.Size = new System.Drawing.Size(365, 38);
            this.tableLayoutPanel2.TabIndex = 0;
            // 
            // label1
            // 
            this.label1.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(3, 13);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(34, 12);
            this.label1.TabIndex = 0;
            this.label1.Text = "Name";
            // 
            // textBoxName
            // 
            this.textBoxName.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Left | System.Windows.Forms.AnchorStyles.Right)));
            this.textBoxName.Location = new System.Drawing.Point(43, 9);
            this.textBoxName.Name = "textBoxName";
            this.textBoxName.Size = new System.Drawing.Size(238, 19);
            this.textBoxName.TabIndex = 1;
            this.textBoxName.TextChanged += new System.EventHandler(this.OnTextBoxNameTextChanged);
            // 
            // buttonGenerateName
            // 
            this.buttonGenerateName.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.buttonGenerateName.Location = new System.Drawing.Point(287, 7);
            this.buttonGenerateName.Name = "buttonGenerateName";
            this.buttonGenerateName.Size = new System.Drawing.Size(75, 23);
            this.buttonGenerateName.TabIndex = 2;
            this.buttonGenerateName.Text = "Generate";
            this.buttonGenerateName.UseVisualStyleBackColor = true;
            this.buttonGenerateName.Click += new System.EventHandler(this.OnButtonGenerateNameClick);
            // 
            // tableLayoutPanel4
            // 
            this.tableLayoutPanel4.ColumnCount = 2;
            this.tableLayoutPanel4.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel4.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle());
            this.tableLayoutPanel4.Controls.Add(this.label2, 0, 0);
            this.tableLayoutPanel4.Controls.Add(this.comboBoxGuildRank, 1, 0);
            this.tableLayoutPanel4.Dock = System.Windows.Forms.DockStyle.Right;
            this.tableLayoutPanel4.Location = new System.Drawing.Point(365, 0);
            this.tableLayoutPanel4.Name = "tableLayoutPanel4";
            this.tableLayoutPanel4.RowCount = 1;
            this.tableLayoutPanel4.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.tableLayoutPanel4.Size = new System.Drawing.Size(235, 38);
            this.tableLayoutPanel4.TabIndex = 1;
            // 
            // label2
            // 
            this.label2.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(3, 13);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(98, 12);
            this.label2.TabIndex = 0;
            this.label2.Text = "Proper Guild Rank";
            // 
            // comboBoxGuildRank
            // 
            this.comboBoxGuildRank.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.comboBoxGuildRank.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.comboBoxGuildRank.FormattingEnabled = true;
            this.comboBoxGuildRank.Items.AddRange(new object[] {
            "Not specified",
            "F",
            "E",
            "D",
            "C",
            "B",
            "A",
            "S",
            "SS",
            "SSS"});
            this.comboBoxGuildRank.Location = new System.Drawing.Point(148, 9);
            this.comboBoxGuildRank.Name = "comboBoxGuildRank";
            this.comboBoxGuildRank.Size = new System.Drawing.Size(84, 20);
            this.comboBoxGuildRank.TabIndex = 1;
            this.comboBoxGuildRank.SelectedValueChanged += new System.EventHandler(this.OnComboBoxGuildRankSelectedValueChanged);
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 571);
            this.Controls.Add(this.panelEdit);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.menuStrip1);
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "FormMain";
            this.Text = "QEditor";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.OnFormClosing);
            this.Shown += new System.EventHandler(this.OnFormShown);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridViewQuests)).EndInit();
            this.flowLayoutPanel1.ResumeLayout(false);
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.panelEdit.ResumeLayout(false);
            this.groupBox1.ResumeLayout(false);
            this.tableLayoutPanel6.ResumeLayout(false);
            this.tableLayoutPanel6.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridViewRewardItems)).EndInit();
            this.tableLayoutPanel5.ResumeLayout(false);
            this.tableLayoutPanel5.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDownRewardGold)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDownGuildExp)).EndInit();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.flowLayoutPanel2.ResumeLayout(false);
            this.tableLayoutPanel1.ResumeLayout(false);
            this.tableLayoutPanel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridViewAchieves)).EndInit();
            this.tableLayoutPanel3.ResumeLayout(false);
            this.tableLayoutPanel3.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.tableLayoutPanel2.ResumeLayout(false);
            this.tableLayoutPanel2.PerformLayout();
            this.tableLayoutPanel4.ResumeLayout(false);
            this.tableLayoutPanel4.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.FlowLayoutPanel flowLayoutPanel1;
        private System.Windows.Forms.Button buttonChangeItemCount;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem menuItemOpen;
        private System.Windows.Forms.ToolStripMenuItem menuItemSave;
        private System.Windows.Forms.ToolStripSeparator toolStripSeparator1;
        private System.Windows.Forms.ToolStripMenuItem menuItemExit;
        private System.Windows.Forms.DataGridView dataGridViewQuests;
        private System.Windows.Forms.Panel panelEdit;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel6;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Button buttonAddItem;
        private System.Windows.Forms.DataGridView dataGridViewRewardItems;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel5;
        private System.Windows.Forms.NumericUpDown numericUpDownRewardGold;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox textBoxRewardMsg;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.NumericUpDown numericUpDownGuildExp;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel1;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel3;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox textBoxEntrustCondition;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.TextBox textBoxDescription;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox textBoxName;
        private System.Windows.Forms.TableLayoutPanel tableLayoutPanel4;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.ComboBox comboBoxGuildRank;
        private System.Windows.Forms.FlowLayoutPanel flowLayoutPanel2;
        private System.Windows.Forms.Button buttonGenerateDescription;
        private System.Windows.Forms.Button buttonGenerateName;
        private System.Windows.Forms.Button buttonGenerateRewardMessage;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.TextBox textBoxNote;
        private System.Windows.Forms.Button buttonGenerateAchieveMessage;
        private System.Windows.Forms.TextBox textBoxAchieveMsg;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.DataGridView dataGridViewAchieves;
        private System.Windows.Forms.Button buttonAddAchieve;
    }
}

