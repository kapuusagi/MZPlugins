using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MZUtils.JsonData
{
    /// <summary>
    /// Json形式で書かれたデータのパーサー
    /// 但し、ifとかfuncitonとかあの辺は解釈できん。
    /// </summary>
    /// 基本的な設計思想として、Readxxxに突入した時点で、
    /// そのオブジェクトを表現する先頭の文字はreaderの中に残っている状態とした。
    /// ([だとか{とか)
    /// Readxxxを抜ける時は、そのオブジェクトを表現する末尾文字まで読み出した状態とした。
    public class Parser
    {
        /// <summary>
        /// ストリームからデータを読み込んで解析する。
        /// </summary>
        /// <param name="stream">読み込み元</param>
        /// <returns>読み込んだデータ</returns>
        public JObject Parse(System.IO.Stream stream)
        {
            LocalReader reader = new LocalReader(stream);
            return ReadObject(reader);
        }

        /// <summary>
        /// オブジェクトをストリームから読み込む。
        /// </summary>
        /// <param name="reader">読み込み元</param>
        /// <returns>オブジェクト</returns>
        private static JObject ReadObject(LocalReader reader)
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
                    return ReadDictionary(reader);
                }
                else if (c == '[')
                {
                    return ReadArray(reader);
                }
                else if (!Char.IsControl((char)(c)))
                {
                    return ReadPrimitive(reader);
                }
                else
                {
                    reader.Consume();
                }

            }
            return null;
        }

        /// <summary>
        /// 連想配列のデータを読み込む。
        /// </summary>
        /// <param name="reader">読み込み元</param>
        /// <returns>連想配列</returns>
        private static JDictionary ReadDictionary(LocalReader reader)
        {
            // 最初の1文字読み捨て。'{'
            reader.Consume();

            JDictionary dictionary = new JDictionary();
            string key = null;
            JObject obj = null;
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
                        dictionary[key] = obj;
                    }
                    key = null;
                    obj = null;
                }
                else if (c == '}')
                {
                    reader.Consume(); // Consume.
                    if (!string.IsNullOrEmpty(key))
                    {
                        dictionary[key] = obj;
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
                        obj = ReadObject(reader);
                    }
                }
            }

            return dictionary;
        }

        /// <summary>
        /// 配列を読み込む。
        /// </summary>
        /// <param name="reader">読み出しに使用するStreamReaderオブジェクト</param>
        /// <returns>JArrayが返る</returns>
        private static JArray ReadArray(LocalReader reader)
        {
            // 最初の1文字読み捨て。'['
            reader.Consume();

            JArray array = new JArray();
            JObject obj = null;
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
                    array.Add(obj);
                    obj = null;
                }
                else if (c == ']')
                {
                    reader.Consume();
                    if (obj != null)
                    {
                        array.Add(obj);
                    }
                    break;
                }
                else
                {
                    obj = ReadObject(reader);
                }
            }
            return array;
        }
        
        /// <summary>
        /// cが空白かどうかを判定する。
        /// </summary>
        /// <param name="c">文字</param>
        /// <returns>空白の場合にはtrue, それ以外はfalse</returns>
        private static bool IsSpace(char c)
        {
            return " \t\r\n".Contains(c);
        }

        private static JObject ReadPrimitive(LocalReader reader)
        {
            char firstChar = (char)(reader.Peek());
            if ((firstChar == '\"') || (firstChar == '\''))
            {
                string strValue = ReadQuoatedString(reader, firstChar);
                return new JPrimitive(strValue);
            }
            else if (char.IsDigit(firstChar) || (firstChar == '-') || (firstChar == '+'))
            {
                string numValue = ReadNumberString(reader);
                return new JPrimitive(numValue);
            }
            else
            {
                // ここに来ること基本的にないよね。変数指定のときだけじゃ。
                string s = ReadString(reader);
                if (s.Equals("null"))
                {
                    return null;
                }
                else if (s.Length > 0)
                {
                    return new JPrimitive(s);
                }
                else
                {
                    throw new Exception("Parse error. [" + s + "]");
                }

            }
        }

        /// <summary>
        /// くくられている/くくられていないにかかわらず、続く文字列を読み出す。
        /// </summary>
        /// <param name="reader">読み込み元</param>
        /// <returns>読み込んだ文字列</returns>
        private static string ReadKeyString(LocalReader reader)
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
                if (pattern.Contains(c))
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
        private static string ReadQuoatedString(LocalReader reader, char quoatChar)
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
                    sb.Append(c);
                    sb.Append((char)(reader.Read()));
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
        private static string ReadString(LocalReader reader)
        {
            StringBuilder sb = new StringBuilder();
            while (!reader.EndOfStream)
            {
                char c = (char)(reader.Peek());
                if (char.IsControl(c) || ":,[]{} ".Contains(c))
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
