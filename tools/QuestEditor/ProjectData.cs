using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MZUtils;

namespace QEditor
{
    /// <summary>
    /// プロジェクトデータ
    /// </summary>
    public static class ProjectData
    {
        // システムデータ
        private static DataSystem dataSystem = new DataSystem();
        // クエストデータ
        private static List<DataQuest> quests = new List<DataQuest>() { null, new DataQuest() { Id = 1 } };
        // アイテム
        private static List<DataItem> items = new List<DataItem>() { null };
        // 武器
        private static List<DataWeapon> weapons = new List<DataWeapon>() { null };
        // 防具
        private static List<DataArmor> armors = new List<DataArmor>() { null };
        // エネミー
        private static List<DataEnemy> enemies = new List<DataEnemy>() { null };
        // 選択可能アイテムリスト
        private static List<IItem> selectableItemList = new List<IItem>();

        /// <summary>
        /// スイッチリストを得る。
        /// </summary>
        public static List<string> Switches { get => dataSystem.Switches; }

        /// <summary>
        /// クエストデータリスト
        /// </summary>
        public static List<DataQuest> Quests { get => quests; }
        /// <summary>
        /// 選択可能アイテムリスト
        /// </summary>
        public static List<IItem> SelectableItemList { get => selectableItemList; }
        /// <summary>
        /// アイテムリスト
        /// </summary>
        public static List<DataItem> Items { get => items; }
        /// <summary>
        /// 武器リスト
        /// </summary>
        public static List<DataWeapon> Weapons { get => weapons; }
        /// <summary>
        /// 防具リスト
        /// </summary>
        public static List<DataArmor> Armors { get => armors; }
        /// <summary>
        /// エネミーデータリスト
        /// </summary>
        public static List<DataEnemy> Enemies { get => enemies; }

        /// <summary>
        /// データをロードする。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        public static void Load(string dir)
        {
            selectableItemList.Clear();
            ReadDataFiles(dir);

            AddSelectableItems(selectableItemList, items);
            AddSelectableItems(selectableItemList, weapons);
            AddSelectableItems(selectableItemList, armors);

        }
        /// <summary>
        /// データファイルを読み出す。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        private static void ReadDataFiles(string dir)
        {
            string systemPath = System.IO.Path.Combine(dir, "System.json");
            if (System.IO.File.Exists(systemPath))
            {
                dataSystem = DataSystemParser.Read(systemPath);
            }


            string itemsPath = System.IO.Path.Combine(dir, "Items.json");
            if (System.IO.File.Exists(itemsPath))
            {
                items = DataItemListParser.Read(itemsPath);
            }

            string weaponsPath = System.IO.Path.Combine(dir, "Weapons.json");
            if (System.IO.File.Exists(weaponsPath))
            {
                weapons = DataWeaponListParser.Read(weaponsPath);
            }

            string armorsPath = System.IO.Path.Combine(dir, "Armors.json");
            if (System.IO.File.Exists(armorsPath))
            {
                armors = DataArmorListParser.Read(armorsPath);
            }

            string enemiesPath = System.IO.Path.Combine(dir, "Enemies.json");
            if (System.IO.File.Exists(enemiesPath))
            {
                enemies = DataEnemyListParser.Read(enemiesPath);
            }

            ReadDataFileQuests(dir);
        }

        /// <summary>
        /// クエストデータを読み出す。
        /// </summary>
        /// <param name="dir">フォルダ</param>
        private static void ReadDataFileQuests(string dir)
        { 
            string questsPath = System.IO.Path.Combine(dir, "Quests.json");
            if (System.IO.File.Exists(questsPath))
            {
                // Quests.jsonがあれば、それを読み出す。
                quests = DataQuestListReader.Read(questsPath);

                quests.Sort((a, b) =>
                {
                    if (a == null)
                    {
                        return -1;
                    }
                    else if (b == null)
                    {
                        return 1;
                    }
                    else
                    {
                        return a.Id - b.Id;
                    }
                });
            }
            if (quests.Count == 0)
            {
                quests.Add(null);
            }
            if (quests.Count == 1)
            {
                quests.Add(new DataQuest() { Id = 1 });
            }
        }
        /// <summary>
        /// 選択アイテムを追加する。
        /// 名前未設定だとか、nullなエントリは表示しないようにする。
        /// </summary>
        /// <param name="list">追加するリスト</param>
        /// <param name="sourceList">追加元のリスト</param>
        private static void AddSelectableItems(List<IItem> list, System.Collections.IList sourceList)
        {
            foreach (IItem item in sourceList)
            {
                if (item == null)
                {
                    continue;
                }
                if (string.IsNullOrEmpty(item.Name))
                {
                    continue;
                }
                list.Add(item);
            }
        }

        /// <summary>
        /// アイテム種類名を得る。
        /// </summary>
        /// <param name="kind">アイテム種類</param>
        /// <returns></returns>
        public static string GetItemKindName(ItemType kind)
        {
            switch (kind)
            {
                case ItemType.Item:
                    return "Item";
                case ItemType.Weapon:
                    return "Weapon";
                case ItemType.Armor:
                    return "Armor";
                default:
                    return $"???";
            }
        }
        /// <summary>
        /// アイテム名を得る。
        /// </summary>
        /// <param name="kind">種類</param>
        /// <param name="id">ID番号</param>
        /// <returns>報酬アイテム名</returns>
        public static string GetItemName(ItemType kind, int id)
        {
            switch (kind)
            {
                case ItemType.Item:
                    return GetItemName(id);
                case ItemType.Weapon:
                    return GetWeaponName(id);
                case ItemType.Armor:
                    return GetArmorName(id);
                default:
                    return $"???";
            }
        }
        /// <summary>
        /// アイテム名を得る。
        /// </summary>
        /// <param name="kind">種類</param>
        /// <param name="id">ID番号</param>
        /// <returns>報酬アイテム名</returns>
        public static string GetItemName(int kind, int id)
        {
            switch (kind)
            {
                case 1:
                    return GetItemName(id);
                case 2:
                    return GetWeaponName(id);
                case 3:
                    return GetArmorName(id);
                default:
                    return $"???";
            }
        }

        /// <summary>
        /// アイテム名を得る。
        /// </summary>
        /// <param name="id">ID</param>
        /// <returns>アイテム名</returns>
        public static string GetItemName(int id)
        {
            if ((id > 0) && (id < items.Count))
            {
                return items[id].Name;
            }
            else
            {
                return "???";
            }
        }

        /// <summary>
        /// 武器名を得る。
        /// </summary>
        /// <param name="id">ID</param>
        /// <returns>武器名</returns>
        public static string GetWeaponName(int id)
        {
            if ((id > 0) && (id < weapons.Count))
            {
                return weapons[id].Name;
            }
            else
            {
                return "???";
            }
        }

        /// <summary>
        /// 防具名を得る。
        /// </summary>
        /// <param name="id">ID</param>
        /// <returns>防具名</returns>
        public static string GetArmorName(int id)
        {
            if ((id > 0) && (id < armors.Count))
            {
                return armors[id].Name;
            }
            else
            {
                return "???";
            }

        }


        /// <summary>
        /// スイッチ名を得る。
        /// </summary>
        /// <param name="switchId"></param>
        /// <returns></returns>
        public static string GetSwitchName(int switchId)
        {
            if ((switchId > 0) && (switchId < dataSystem.Switches.Count))
            {
                var name = dataSystem.Switches[switchId];
                if (!string.IsNullOrEmpty(name))
                {
                    return name;
                }
            }
            return $"SW{switchId}";
        }

        /// <summary>
        /// エネミー名を得る。
        /// </summary>
        /// <param name="enemyId">エネミーID</param>
        /// <returns>エネミー名</returns>
        public static string GetEnemyName(int enemyId)
        {
            if ((enemyId > 0) && (enemyId < enemies.Count))
            {
                return enemies[enemyId].Name;
            }
            else
            {
                return "???";
            }
        }

        /// <summary>
        /// お金の単位文字列を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public static string GetCurrencyUnit()
        {
            return dataSystem.CurrencyUnit;
        }
    }
}
