/*:ja
 * @target MZ 
 * @plugindesc エンカウントエフェクト(パターンフェード)
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_EncounterEffectManager
 * @orderAfter Kapu_EncounterEffectManager
 * @base Kapu_FadeExtends
 * @orderAfter Kapu_FadeExtends
 * 
 * @command setupNext
 * @text 次のエンカウントエフェクトに設定する。
 * 
 * @arg name
 * @text エフェクトエントリ名
 * @desc エフェクトエントリで登録した名前
 * @type string
 * 
 * @command setupRandom
 * @text ランダム対象設定
 * 
 * @arg name
 * @text エフェクトエントリ名
 * @desc エフェクトエントリで登録した名前
 * @type string
 * 
 * @arg enabled
 * @text 対象にする
 * @desc trueにすると、エンカウントエフェクトランダム時に候補になる。
 * @type boolean
 * @default false
 * 
 * 
 * @param effectEntries
 * @text エフェクトエントリ
 * @desc エフェクトエントリのテーブル
 * @type struct<EffectEntry>[]
 * @default {}
 * 
 * @help 
 * 
 * ■ 使用時の注意
 * 
 * ■ プラグイン開発者向け
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * 
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * 
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */
/*~struct~EffectEntry:
 *
 * @param name
 * @text エフェクトパターン名
 * @type string
 * @default 
 * 
 * @param pattern
 * @text 設定対象のフェードパターン
 * @desc フェードパターン名
 * @type file
 * @dir img/fadepatterns/
 * @default
 * 
 * @param se
 * @text SE
 * @desc 鳴らすSE
 * @type struct<SoundEffect>
 * 
 * @param duration
 * @text 期間
 * @desc フェードアウトにかける時間
 * @type number
 * @default 24
 */
/*~struct~SoundEffect:
 *
 * @param name
 * @type file
 * @dir audio/se/
 * @desc 効果音のファイル名
 * @default 
 * @require 1
 *
 * @param volume
 * @type number
 * @max 100
 * @desc 効果音の音量
 * 初期値: 90
 * @default 90
 *
 * @param pitch
 * @type number
 * @min 50
 * @max 150
 * @desc 効果音のピッチ
 * 初期値: 100
 * @default 100
 *
 * @param pan
 * @type number
 * @min -100
 * @max 100
 * @desc 効果音の位相
 * 初期値: 0
 * @default 0
 *
 */
(() => {
    const pluginName = "Kapu_EncounterEffect_Pattern";
    const parameters = PluginManager.parameters(pluginName);

    const PatternEncounterEffects = [];
    try {
        const entries = JSON.parse(parameters["effectEntries"]).map(token => JSON.parse(token));
        for (const entry of entries) {
            if (entry.name) {
                const se = JSON.parse(entry.se);
                se.volume = Number(se.volume) || 0;
                se.pitch = Number(se.pitch) || 0;
                se.pan = Number(se.pan) || 0;
                entry.se = se;
                entry.duration = Math.max(0, Math.floor(Number(entry.duration) || 0));
            }
            PatternEncounterEffects.push(entry);
        }
    }
    catch (e) {
        console.error(e);
    }

    PluginManager.registerCommand(pluginName, "setupNext", args => {
        const name = args.name || "";
        if (name) {
            $gameSystem.setNextEncounterEffect(name);
        }
    });

    PluginManager.registerCommand(pluginName, "setupRandom", args => {
        const name = args.name || "";
        const enabled = (args.enabled === undefined) ? false : (args.enabled === "true");
        if (name) {
            if (enabled) {
                $gameSystem.enableRandomEncounterEffect(name);
            } else {
                $gameSystem.disableRandomEncounterEffect(name);
            }
        }
    });
    //------------------------------------------------------------------------------
    // エンカウントエフェクト処理
    const _onEncountEffectStartPattern = function() {
        const effectEntry = PatternEncounterEffects.find(effect => effect.name == this._encounterEffectName);
        this._encounterEffectDuration = effectEntry.duration || 0;
        this._effectEntry = effectEntry;
        this._encounterEffectFrame = 0;
    };

    /**
     * エンカウントエフェクトを更新する。
     */
    const _onEncountEffectUpdatePattern = function() {
        if (this._encounterEffectFrame === 0) {
            const effectEntry = this._effectEntry;
            $gameTemp.setupNextFadeOut({
                mode: Game_Screen.FADE_MODE_PATTERN,
                pattern: effectEntry.pattern,
                duration: effectEntry.duration,
                color:[0,0,0,255],
                zoom:1
            });
            this.startFadeOut(effectEntry.duration);
            if (effectEntry.se.name) {
                AudioManager.playSe(effectEntry.se);
            }
        } else if (this._encounterEffectDuration === 0) {
            BattleManager.playBattleBgm();
        }
        this._encounterEffectFrame++;
    };

    /**
     * エンカウントエフェクトを完了する。
     */
    const _onEncountEffectEndPattern = function() {
        /* do nohting */
    };

    //------------------------------------------------------------------------------
    // EncounterEffectManager
    for (const entry of PatternEncounterEffects) {
        EncounterEffectManager.registerEffect(entry.name, {
            start: _onEncountEffectStartPattern,
            update: _onEncountEffectUpdatePattern,
            end: _onEncountEffectEndPattern
        });
    }

})();