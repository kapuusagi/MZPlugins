using System;
using System.Collections.Generic;
using System.Text;

namespace MZUtils.JsonData
{
    /// <summary>
    /// データコンストラクタ。
    /// json形式で記述されたデータを読み込んだときにオブジェクトの構築をするための
    /// インタフェースを提供する
    /// </summary>
    public interface IDataConstructor
    {
        /// <summary>
        /// 空のディクショナリデータを構築する。
        /// </summary>
        /// <param name="parent">親オブジェクト</param>
        /// <param name="paramName">名前(無い場合にはnull)</param>
        /// <returns>空のディクショナリデータ</returns>
        object CreateDictionary(object parent, string paramName);
        /// <summary>
        /// dictionaryにkey,dataをセットする。
        /// </summary>
        /// <param name="dictionary">ディクショナリオブジェクト。CreateDictionaryで構築したやつ</param>
        /// <param name="key">キー</param>
        /// <param name="data">データオブジェクト</param>
        void SetDictionaryData(object dictionary, string key, object data);

        /// <summary>
        /// 空の行列を作成する。
        /// </summary>
        /// <param name="parent">親オブジェクト</param>
        /// <param name="paramName">パラメータ名</param>
        /// <returns>空の配列データ</returns>
        object CreateArray(object parent, string paramName);
        /// <summary>
        /// 行列にデータを格納する
        /// </summary>
        /// <param name="array"行列></param>
        /// <param name="data">データ</param>
        void AddArrayData(object array, object data);
        /// <summary>
        /// プリミティブデータを作成する。
        /// </summary>
        /// <param name="valueStr">データ文字列</param>
        /// <param name="isString">文字列データとして指定されている場合にtrue</param>
        /// <returns>プリミティブデータ</returns>
        object CreatePrimitive(string valueStr, bool isString);
    }
}
