using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils.JsonData
{
    /// <summary>
    /// JsonData形式の文字列を構築するためのビルダー。
    /// </summary>
    public class JObjectBuilder
    {
        /// <summary>
        /// nullを表す文字列
        /// </summary>
        private const string NullStr = "null";

        private StringBuilder sb;

        /// <summary>
        /// 新しいJObjectBuilderを構築する。
        /// </summary>
        public JObjectBuilder()
        {
            sb = new StringBuilder();
        }

        /// <summary>
        /// パラメータを追加する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="obj">データ</param>
        public void Append(string paramName, object obj)
        {
            if (obj == null)
            {
                if (sb.Length > 0)
                {
                    sb.Append(',');
                }
                sb.Append('\"').Append(paramName).Append("\":").Append(NullStr);
            }
            if (obj is System.Collections.IList list)
            {
                Append(paramName, list);
            }
            else if (obj is System.Collections.IDictionary dictionary)
            {
                Append(paramName, dictionary);
            }
            else if (obj is double d)
            {
                Append(paramName, d);
            }
            else if (obj is bool b)
            {
                Append(paramName, b);
            }
            else if (obj is string str)
            {
                Append(paramName, str);
            }
            else 
            {
                if (sb.Length > 0)
                {
                    sb.Append(',');
                }
                sb.Append('\"').Append(paramName).Append("\":").Append(obj.ToString());
            }
        }

        /// <summary>
        /// ディクショナリ型データを追加する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="data">データ</param>
        public void Append(string paramName, System.Collections.IDictionary data)
        {
            if (data == null)
            {
                if (sb.Length > 0)
                {
                    sb.Append(',');
                }
                sb.Append('\"').Append(paramName).Append("\":").Append(NullStr);
            }
            else
            {
                if (sb.Length > 0)
                {
                    sb.Append(',');
                }
                sb.Append('\"').Append(paramName).Append("\":{");
                int i = 0;
                foreach (System.Collections.DictionaryEntry entry in data)
                {
                    if (i > 0)
                    {
                        sb.Append(',');
                    }
                    Append(entry.Key.ToString(), entry.Value);
                    i++;
                }
                sb.Append("}");
            }
        }

        /// <summary>
        /// リスト型データを追加する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="list">リストデータ</param>
        public void Append(string paramName, System.Collections.IList list)
        {
            if (list == null)
            {
                if (sb.Length > 0)
                {
                    sb.Append(',');
                }
                sb.Append('\"').Append(paramName).Append("\":").Append(NullStr);
            }
            else
            {
                if (sb.Length > 0)
                {
                    sb.Append(',');
                }
                sb.Append('\"').Append(paramName).Append("\":[");
                int i = 0;
                foreach (object obj in list)
                {
                    if (i > 0)
                    {
                        sb.Append(',');
                    }
                    if (obj != null)
                    {
                        sb.Append(obj.ToString());
                    }
                    i++;
                }
                sb.Append("]");
            }
        }

        /// <summary>
        /// 数値パラメータを追加する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="i">数値</param>
        public void Append(string paramName, int i)
        {
            if (sb.Length > 0)
            {
                sb.Append(',');
            }
            sb.Append('\"').Append(paramName).Append("\":").Append(i);
        }

        /// <summary>
        /// 数値パラメータを追加する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="d">数値</param>
        public void Append(string paramName, double d)
        {
            if (sb.Length > 0)
            {
                sb.Append(',');
            }
            sb.Append('\"').Append(paramName).Append("\":").Append(d.ToString("0.####"));
        }

        /// <summary>
        /// 真偽値パラメータを追加する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="b">真偽値</param>
        public void Append(string paramName, bool b)
        {
            string boolStr = b ? "true" : "false";
            if (sb.Length > 0)
            {
                sb.Append(',');
            }
            sb.Append('\"').Append(paramName).Append("\":").Append(boolStr);
        }

        /// <summary>
        /// 文字列メンバを追加する。
        /// </summary>
        /// <param name="paramName">パラメータ名</param>
        /// <param name="str">文字列</param>
        public void Append(string paramName, string str)
        {
            if (str == null)
            {
                if (sb.Length > 0)
                {
                    sb.Append(',');
                }
                sb.Append('\"').Append(paramName).Append("\":").Append(NullStr);
            }
            else
            {
                if (sb.Length > 0)
                {
                    sb.Append(',');
                }
                // 文字置換しながら書き出しする。
                sb.Append('\"').Append(paramName).Append("\":\"");
                foreach (char c in str)
                {
                    // 多分シングルクォーテーションやら、ダブルクォーテーション、
                    // 改行コードは置換して入れてやらないとうまく読み出せないはず。
                    switch (c)
                    {
                        case '\'':
                            sb.Append("\\\'");
                            break;
                        case '\"':
                            sb.Append("\\\"");
                            break;
                        case '\n':
                            sb.Append("\\n");
                            break;
                        case '\r':
                            sb.Append("\\r");
                            break;
                        case '\t':
                            sb.Append("\\t");
                            break;
                        case '\\':
                            sb.Append("\\\\");
                            break;
                        default:
                            sb.Append(c);
                            break;
                    }

                }
                sb.Append('\"');
            }
        }



        /// <summary>
        /// 文字列を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            return $"{{{sb}}}";
        }
    }
}
