#
# 依存関係がよくわからなくなってきたので、整理するために作成。
# VisualStudio Codeなら、Graphviz Preview拡張を入れれば
# dotファイルのプレビューで図を確認できる。
#
import os
import pdb

rootdir = os.getcwd()
os.chdir("../plugins")

class ScriptEntry:
    def __init__(self, name):
        """
        ScriptEntryを初期化する。

        Parameters
        ----------
        name : string
            ファイル名
        """
        self._name = os.path.splitext(os.path.basename(name))[0]
        self._description = ''
        self._dependencies = []
        self._rank = 0

    def get_name(self):
        """
        ファイル名を得る

        Returns
        -------
        filename : string
            ファイル名
        """
        return self._name

    def add_depends(self, depend_file):
        """
        依存するエントリを追加する。

        Parameters
        ----------
        depend_file : string
            依存ファイル
        """
        if (not depend_file in self._dependencies):
            self._dependencies.append(depend_file)

    def get_dependencies(self):
        """
        依存するエントリ一覧を得る。

        Returns
        -------
        dependencies : Array<string>
            依存ファイル
        """
        return self._dependencies

    def set_description(self, desc):
        """
        概要を設定する。

        Parameters
        ----------
        desc : string
            概要文字列
        """
        self._description = desc

    def get_description(self):
        """
        概要を取得する。

        Returns
        -------
        description : string
            概要
        """
        return self._description

    def get_rank(self):
        """
        ランクを得る
        
        Returns
        -------
        rank : int
            ランク
        """
        return self._rank

    def set_rank(self, rank):
        """
        ランクを設定する。

        Parameters
        ----------
        rank : int
            ランク
        """
        self._rank = rank

        

    
    def parse(filename):
        """
        filename で指定されるファイルを読み、依存関係を調べてエントリを返す。

        Parameters
        ----------
        filename : string
            ファイル名

        Returns
        -------
        script_entry : ScriptEntry
            スクリプトエントリオブジェクト
        """
        try:
            obj = ScriptEntry(filename)
            with open(filename, encoding='utf-8') as f:
                for line in f:
                    if '@base' in line:
                        index = line.find('@base')
                        depends = line[(index + 5):].strip()
                        obj.add_depends(depends)
                    elif '@orderAfter' in line:
                        index = line.find('@orderAfter')
                        depends = line[(index + 11):].strip()
                        obj.add_depends(depends)
                    elif '@plugindesc' in line:
                        index = line.find('@plugindesc')
                        desc = line[(index + 11):].strip()
                        obj.set_description(desc)
            return obj
        except Exception as e:
            print(e)
            return None

def get_plugin_entries():
    """
    プラグインエントリを得る。

    Returns
    -------
    entry_list : Array<ScriptEntry>
        スクリプトエントリ
    """
    entrylist = os.listdir(".")
    ret = []
    for entry in entrylist:
        if os.path.isfile(entry):
            script_entry = ScriptEntry.parse(entry)
            if script_entry is not None:
                ret.append(script_entry)
    return ret

def find_entry(entries, name):
    """
    ScriptEntry配列から、nameで指定されるエントリを得る。

    Parameters
    ----------
    entries : Array<ScriptEntry>
        ScriptEntry配列
    name : string
        スクリプト名

    Returns
    -------
    index : int
            インデックス番号
    """
    for i in range(len(entries)):
        if entries[i].get_name() == name:
            return i
    return -1


def exists_dependencies(entries, entry):
    """
    entryの依存モジュールがentriesに含まれているかどうかを得る。

    Parameters
    ----------
    entries : Array<ScriptEntry>
        判定対象のScriptEntry配列
    entry : ScriptEntry
        依存関係を取得するScriptEntryオブジェクト

    Returns
    -------
    exists : bool
        依存関係が全て含まれている場合にはtrue, それ以外はfalse
    """
    for depends in entry.get_dependencies():
        if find_entry(entries, depends) < 0:
            return False
    return True

def get_insert_index(entries, entry):
    """
    挿入位置を得る。

    entries : Array<ScriptEntry>
        判定対象のScriptEntry配列
    entry : ScriptEntry
        依存関係を取得するScriptEntryオブジェクト

    Returns
    -------
    index : int
        インデックス番号
    """
    insert_index = -1
    for depends in entry.get_dependencies():
        index = find_entry(entries, depends)
        if index > insert_index:
            insert_index = index + 1
    return insert_index

def sort_plugin_entries(entries):
    """
    スクリプトエントリを依存関係を元にソートする。

    Parameters
    ----------
    entries : Array<ScriptEntry>
        スクリプトエントリ
    """
    i = 0
    while i < len(entries):
        entry = entries[i]
        insert_index = get_insert_index(entries, entry)
        if insert_index <= i:
            # 挿入するべき位置が今の位置より前、
            # つまり、この位置より前に依存するモジュールはない。
            #  => そのままの位置にして、次の要素を調べる。
            i += 1
        else:
            # 挿入するべき位置が今の位置より後、
            # つまり、この位置より後に依存するモジュールが出てくる。
            #  => 移動して次の要素を見る。
            entries.pop(i)
            entries.insert(insert_index, entry)

def has_reference(entries, entry):
    """
    参照されるものをもっているかどうかを得る。

    entries : Array<ScriptEntry>
        判定対象のScriptEntry配列
    entry : ScriptEntry
        依存関係を取得するScriptEntryオブジェクト

    Returns
    -------
    has_refrence : int
        参照を持っている場合にはTrue, それ以外はFalse
    """
    for e in entries:
        if entry.get_name() in e.get_dependencies():
            return True
    return False


def get_rank(entries, entry):
    """
    ランクを得る。

    entries : Array<ScriptEntry>
        判定対象のScriptEntry配列
    entry : ScriptEntry
        依存関係を取得するScriptEntryオブジェクト

    Returns
    -------
    rank : int
        このスクリプトのランク
    """
    rank = -1
    for depends in entry.get_dependencies():
        index = find_entry(entries, depends)
        if index >= 0:
            target_rank = entries[index].get_rank()
            if (target_rank + 1) > rank:
                rank = target_rank + 1
    if rank < 0:
        if has_reference(entries, entry):
            rank = 0
    return rank



def export_to_dot(output_filename, entries):
    """
    Dotファイルに出力する。

    Parameters
    ----------
    output_filename : string
        出力ファイル名
    entries : Array<ScriptEntry>
        スクリプトエントリ
    """
    with open(output_filename, mode="w", encoding='utf-8') as f:
        f.write('digraph PluginDependencies {\n')
        f.write('  graph [\n')
        f.write('    charset = "UTF-8";\n')
        f.write('    label = "Dependencies";\n')
        f.write('    rankdir = RL,\n')
        f.write('  ]\n')
        f.write('\n')
        f.write('  // node defines.\n')
        for entry in entries:
            f.write('  ' + entry.get_name() + '[shape = box];\n')
        f.write('  // edge defines.\n')
        for entry in entries:
            dependencies = entry.get_dependencies()
            for depends in dependencies:
                if len(depends) > 0:
                    f.write('  ' + entry.get_name() + ' -> ' + depends + ' [arrowhead = normal];\n')
        
        max_rank = 0
        for entry in entries:
            if entry.get_rank() > max_rank:
                max_rank = entry.get_rank()
        
        for rank in range(max_rank + 1):
            f.write('  { rank = same; ')
            for entry in entries:
                if entry.get_rank() == rank:
                    f.write(entry.get_name() + '; ')
            f.write(' }\n')
        
        '''
        # その他のエントリは適当にランク付けて置いておく。
        cnt = 0
        for entry in entries:
            if cnt == 0:
                f.write('  { rank = same; ')
            f.write(entry.get_name() + '; ')
            cnt += 1
            if cnt >= 8:
                cnt = 0
                f.write(' }\n')
        if cnt > 0:
            f.write(' }\n')
        '''

        f.write('}\n')

try:
    entries = get_plugin_entries()
    output_filename = rootdir + os.path.sep + "dependencies.dot"

    # 依存関係に応じてソートする
    sort_plugin_entries(entries)

    # ランクを設定する。
    for entry in entries:
        rank = get_rank(entries, entry)
        entry.set_rank(rank)

    # dotファイルに出力する。
    export_to_dot(output_filename, entries)



except Exception as e:
    print(e)
    input()
    
