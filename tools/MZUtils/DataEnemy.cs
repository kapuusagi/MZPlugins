using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils
{
    public class DataEnemy
    {
        public int Id { get; set; } = 0;
        public List<EnemyAction> Actions { get; private set; } = new List<EnemyAction>();
        public int BattlerHue { get; set; } = 0;
        public string BattlerName { get; set; } = string.Empty;
        public DropItem[] DropItems { get; private set; } = new DropItem[] { new DropItem(), new DropItem(), new DropItem() };
        public int Exp { get; set; } = 0;
        public List<Trait> Traits { get; private set; } = new List<Trait>();
        public int Gold { get; set; } = 0;
        public string Name { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public int[] Params { get; private set; } = new int[8];

        /// <summary>
        /// 値を設定する。
        /// </summary>
        /// <param name="paramName"></param>
        /// <param name="value"></param>
        public void SetValue(string paramName, object value)
        {
            switch (paramName)
            {
                case "id":
                    Id = (int)((double)(value));
                    break;
                case "actions":
                    Actions.Clear();
                    Actions.AddRange((List<EnemyAction>)(value));
                    break;
                case "battlerHue":
                    BattlerHue = (int)((double)(value));
                    break;
                case "battlerName":
                    BattlerName = (string)(value);
                    break;
                case "dropItems":
                    {
                        List<DropItem> dropItems = (List<DropItem>)(value);
                        for (int i = 0; i < 3; i++)
                        {
                            DropItem di = (i < dropItems.Count) ? dropItems[i] : null;
                            if (di != null)
                            {
                                DropItems[i].DataId = di.DataId;
                                DropItems[i].Denominator = di.Denominator;
                                DropItems[i].Kind = di.Kind;
                            }
                            else
                            {
                                DropItems[i] = new DropItem();
                            }
                        }
                    }
                    break;
                case "exp":
                    Exp = (int)((double)(value));
                    break;
                case "traits":
                    Traits.Clear();
                    Traits.AddRange((List<Trait>)(value));
                    break;
                case "gold":
                    Gold = (int)((double)(value));
                    break;
                case "name":
                    Name = (string)(value);
                    break;
                case "note":
                    Note = (string)(value);
                    break;
                case "params":
                    {
                        List<int> paramList = (List<int>)(value);
                        for (int i = 0; i < 8; i ++)
                        {
                            if (i < paramList.Count)
                            {
                                Params[i] = paramList[i];
                            }
                            else
                            {
                                Params[i] = 0;
                            }
                        }
                    }
                    break;

            }

        }
        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            MZUtils.JsonData.JObjectBuilder job = new JsonData.JObjectBuilder();
            job.Append("id", Id);
            job.Append("actions", Actions);
            job.Append("battlerHue", BattlerHue);
            job.Append("battlerName", BattlerName);
            job.Append("dropItems", DropItems);
            job.Append("exp", Exp);
            job.Append("traits", Traits);
            job.Append("gold", Gold);
            job.Append("name", Name);
            job.Append("note", Note);
            job.Append("params", Params);

            return job.ToString();
        }
    }
}
