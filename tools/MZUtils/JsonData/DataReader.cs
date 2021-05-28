using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils.JsonData
{
    /// <summary>
    /// データ読み出しクラス。
    /// パーサーを元に作ることにした。
    /// </summary>
    public class DataReader
    {
        /// <summary>
        /// 新しいDataReaderオブジェクトを構築する。
        /// </summary>
        public DataReader()
        {
            DataConstructor = new DataConstructorBase();
        }

        /// <summary>
        /// データコンストラクタ
        /// </summary>
        public IDataConstructor DataConstructor { get; set; }

        /// <summary>
        /// 指定したパスを読み込む。
        /// </summary>
        /// <param name="path">パス</param>
        /// <returns>読み込んだデータ</returns>
        public object Read(string path)
        {
            using (System.IO.FileStream fs = new System.IO.FileStream(path, System.IO.FileMode.Open, System.IO.FileAccess.Read))
            {
                return Read(fs);
            }
        }

        /// <summary>
        /// ストリームからデータを読み込んで解析する。
        /// </summary>
        /// <param name="stream">読み込み元</param>
        /// <returns>読み込んだデータ</returns>
        public object Read(System.IO.Stream stream)
        {
            LocalReader reader = new LocalReader(stream);
            return ReadObject(reader, null, null);
        }

        /// <summary>
        /// オブジェクトをストリームから読み込む。
        /// </summary>
        /// <param name="reader">読み込み元</param>
        /// <param name="parent">親オブジェクト(無い場合にはnull)</param>
        /// <param name="paramName">パラメータ名(無い場合にはnull)</param>
        /// <returns>オブジェクト</returns>
        private object ReadObject(LocalReader reader, object parent, string paramName)
        {
            while (!reader.EndOfStream)
            {
                char c = (char)(reader.Peek());
                if (IsSpace(c))
                {
                    reader.Consume();
                }
                if (c == '{')
                {
                    return ReadDictionary(reader, parent, paramName);
                }
                else if (c == '[')
                {
                    return ReadArray(reader, parent, paramName);
                }
                else if (!Char.IsControl((char)(c)))
                {
                    return ReadPrimitive(reader);
                }
                else
                {
                    // 読み捨て。
                    reader.Consume();
                }

            }
            return null;
        }

        /// <summary>
        /// 連想配列のデータを読み込む。
        /// </summary>
        /// <param name="reader">読み込み元</param>
        /// <param name="parent">親オブジェクト(無い場合はnull)</param>
        /// <param name="paramName">パラメータ名(無い場合はnull)</param>
        /// <returns>連想配列</returns>
        private object ReadDictionary(LocalReader reader, object parent, string paramName)
        {
            // 最初の1文字読み捨て。'{'
            reader.Consume();

            object dictionary = DataConstructor.CreateDictionary(parent, paramName);
            string key = null;
            object obj = null;
            while (!reader.EndOfStream)
            {
                char c = reader.Peek();
                if (IsSpace(c))
                {
                    reader.Consume(); // Consume.
                }
                else if (c == ',')
                {
                    reader.Consume(); // Consume
                    if (!string.IsNullOrEmpty(key))
                    {
                        DataConstructor.SetDictionaryData(dictionary, key, obj);
                    }
                    key = null;
                    obj = null;
                }
                else if (c == '}')
                {
                    reader.Consume(); // Consume.
                    if (!string.IsNullOrEmpty(key))
                    {
                        DataConstructor.SetDictionaryData(dictionary, key, obj);
                    }
                    break;
                }
                else if (c == ':')
                {
                    if (string.IsNullOrEmpty(key))
                    {
                        throw new Exception("key not specified.");
                    }
                    reader.Consume();
                }
                else
                {
                    if (key == null)
                    {
                        key = ReadKeyString(reader);
                    }
                    else
                    {
                        obj = ReadObject(reader, dictionary, key);
                    }
                }
            }

            return dictionary;
        }

        /// <summary>
        /// 配列を読み込む。
        /// </summary>
        /// <param name="reader">読み出しに使用するStreamReaderオブジェクト</param>
        /// <param name="parent">親オブジェクト</param>
        /// <param name="paramName">パラメータ名</param>
        /// <returns>配列を表すobjectが返る</returns>
        private object ReadArray(LocalReader reader, object parent, string paramName)
        {
            // 最初の1文字読み捨て。'['
            reader.Consume();

            object array = DataConstructor.CreateArray(parent, paramName);
            object obj = null;
            while (!reader.EndOfStream)
            {
                char c = (char)(reader.Peek());
                if (IsSpace(c))
                {
                    reader.Consume();
                }
                else if (c == ',')
                {
                    reader.Consume();
                    DataConstructor.AddArrayData(array, obj);
                    obj = null;
                }
                else if (c == ']')
                {
                    reader.Consume();
                    DataConstructor.AddArrayData(array, obj);
                    break;
                }
                else
                {
                    obj = ReadObject(reader, array, null);
                }
            }
            return array;
        }

        /// <summary>
        /// cが空白かどうかを判定する。
        /// </summary>
        /// <param name="c">文字</param>
        /// <returns>空白の場合にはtrue, それ以外はfalse</returns>
        private bool IsSpace(char c)
        {
            return " \t\r\n".IndexOf(c) >= 0;
        }

        /// <summary>
        /// プリミティブデータを読み出す。
        /// </summary>
        /// <param name="reader">読み込み元</param>
        /// <returns>プリミティブデータ</returns>
        private object ReadPrimitive(LocalReader reader)
        {
            char firstChar = (char)(reader.Peek());
            if ((firstChar == '\"') || (firstChar == '\''))
            {
                string strValue = ReadQuoatedString(reader, firstChar);
                return DataConstructor.CreatePrimitive(strValue, true);
            }
            else if (char.IsDigit(firstChar) || (firstChar == '-') || (firstChar == '+'))
            {
                string numValue = ReadNumberString(reader);
                return DataConstructor.CreatePrimitive(numValue, false);
            }
            else
            {
                // ここに来ること基本的にないよね。変数指定のときだけじゃ。
                string s = ReadString(reader);
                return DataConstructor.CreatePrimitive(s, false);
            }
        }

        /// <summary>
        /// くくられている/くくられていないにかかわらず、続く文字列を読み出す。
        /// </summary>
        /// <param name="reader">読み込み元</param>
        /// <returns>読み込んだ文字列</returns>
        private string ReadKeyString(LocalReader reader)
        {
            char firstChar = (char)(reader.Peek());
            if ((firstChar == '\"') || (firstChar == '\''))
            {
                return ReadQuoatedString(reader, firstChar);
            }
            else
            {
                return ReadKeyString(reader);
            }
        }

        /// <summary>
        /// 数字データを読み込む。
        /// </summary>
        /// <param name="reader">読み込み元</param>
        /// <returns>数字</returns>
        private static string ReadNumberString(LocalReader reader)
        {
            // 数値プリミティブ
            char c = reader.Read();
            StringBuilder sb = new StringBuilder();
            if (c != '+')
            {
                sb.Append(c);
            }
            // 数字か.が出る限り追加。
            string pattern = "0123456789.";
            while (!reader.EndOfStream)
            {
                c = reader.Peek();
                if (pattern.IndexOf(c) >= 0)
                {
                    reader.Consume();
                    sb.Append(c);
                    if (c == '.')
                    {
                        pattern = "0123456789";
                    }
                }
                else
                {
                    break;
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// ダブルクォーテーションまたはシングルクォーテーションでくくられた文字を読み出す。
        /// 返す文字列はダブルクォーテーション(またはシングルクォーテーション)を外した状態で返す。
        /// </summary>
        /// <param name="reader">読み込み元</param>
        /// <param name="quoatChar">くくり文字</param>
        /// <returns>読み込んだ文字列</returns>
        private string ReadQuoatedString(LocalReader reader, char quoatChar)
        {
            reader.Read();
            // 文字列型 次の'\"'が出てくるまで読む。
            StringBuilder sb = new StringBuilder();
            while (!reader.EndOfStream)
            {
                char c = (char)(reader.Read());
                if (c == quoatChar)
                {
                    break;
                }
                else if (c == '\\')
                {
                    // エスケープシーケンス
                    // 一応次の文字次第で処理を変更する。
                    char nextChar = reader.Peek();
                    switch (nextChar)
                    {
                        case '\'': // \' シングルクォーテーション
                            reader.Consume();
                            sb.Append('\'');
                            break;
                        case '\"': // \" ダブルクォーテーション
                            reader.Consume();
                            sb.Append('\"');
                            break;
                        case 'r': // \r 改行
                            reader.Consume();
                            sb.Append('\r');
                            break;
                        case 'n': // \n 改行
                            reader.Consume();
                            sb.Append('\n');
                            break;
                        case 't': // \t タブ
                            reader.Consume();
                            sb.Append('\t');
                            break;
                        case '\\': // エスケープコード
                            reader.Consume();
                            sb.Append('\\');
                            break;
                        default:
                            sb.Append(c);
                            break;
                    }
                }
                else
                {
                    sb.Append(c);
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// 文字列を読み出す。
        /// </summary>
        /// <param name="reader">読み込み元</param>
        /// <returns>文字列</returns>
        private string ReadString(LocalReader reader)
        {
            StringBuilder sb = new StringBuilder();
            while (!reader.EndOfStream)
            {
                char c = (char)(reader.Peek());
                if (char.IsControl(c) || (":,[]{} ".IndexOf(c) >= 0))
                {
                    break;
                }
                else
                {
                    reader.Consume();
                    sb.Append(c);
                }
            }
            return sb.ToString();
        }

    }
}
