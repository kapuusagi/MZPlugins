using System;
using System.Collections.Generic;
using System.Text;
using MZUtils.JsonData;
namespace MZUtils
{
    /// <summary>
    /// アドバンスドデータ
    /// DataSystem.Advancedに入る。
    /// </summary>
    public class DataAdvanced
    {
        /// <summary>
        /// 新しいアドバンスドデータを構築する。
        /// </summary>
        public DataAdvanced()
        {
        }

        /// <summary>
        /// ゲームID
        /// </summary>
        public int GameId { get; set; } = 0;

        /// <summary>
        /// スクリーン幅
        /// </summary>
        public int ScreenWidth { get; set; } = 816;
        /// <summary>
        /// スクリーン高さ
        /// </summary>
        public int ScreenHeight { get; set; } = 624;
        /// <summary>
        /// UI領域の幅
        /// </summary>
        public int UIAreaWidth { get; set; } = 816;
        /// <summary>
        /// UI領域の高さ
        /// </summary>
        public int UIAreaHeight { get; set; } = 624;
        /// <summary>
        /// 数値フォントファイル名
        /// </summary>
        public string NumberFontFilename { get; set; } = string.Empty;
        /// <summary>
        /// フォールバックフォント
        /// </summary>
        public string FallbackFonts { get; set; } = string.Empty;

        /// <summary>
        /// フォントサイズ
        /// </summary>
        public int FontSize { get; set; } = 26;
        /// <summary>
        /// メインフォントファイル名
        /// </summary>
        public string MainFontFilename { get; set; } = string.Empty;

        /// <summary>
        /// このオブジェクトのフィールドを設定する。
        /// </summary>
        /// <param name="key">キー文字列</param>
        /// <param name="value">値</param>
        internal void SetValue(string key, object value)
        {
            switch (key)
            {
                case "gameId":
                    GameId = (int)((double)(value));
                    break;
                case "screenWidth":
                    ScreenWidth = (int)((double)(value));
                    break;
                case "screenHeight":
                    ScreenHeight = (int)((double)(value));
                    break;
                case "uiAreaWidth":
                    UIAreaWidth = (int)((double)(value));
                    break;
                case "uiAreaHeight":
                    UIAreaHeight = (int)((double)(value));
                    break;
                case "numberFontFilename":
                    NumberFontFilename = (string)(value);
                    break;
                case "fallbackFonts":
                    FallbackFonts = (string)(value);
                    break;
                case "fontSize":
                    FontSize = (int)((double)(value));
                    break;
                case "mainFontFilename":
                    MainFontFilename = (string)(value);
                    break;
            }
        }
        /// <summary>
        /// このオブジェクトの文字列表現を得る。
        /// </summary>
        /// <returns>文字列</returns>
        public override string ToString()
        {
            JObjectBuilder job = new JObjectBuilder();
            job.Append("gameId", GameId);
            job.Append("screenWidth", ScreenWidth);
            job.Append("screenHeight", ScreenHeight);
            job.Append("uiAreaWidth", UIAreaWidth);
            job.Append("uiAreaHeight", UIAreaHeight);
            job.Append("numberFontFilename", NumberFontFilename);
            job.Append("fallbackFonts", FallbackFonts);
            job.Append("fontSize", FontSize);
            job.Append("mainFontFilename", MainFontFilename);

            return job.ToString();
        }
    }
}
