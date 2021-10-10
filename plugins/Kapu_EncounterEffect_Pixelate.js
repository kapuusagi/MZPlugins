/*:ja
 * @target MZ 
 * @plugindesc エンカウントエフェクト(ピクセレート)
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
 * @command setupRandom
 * @text ランダム対象設定
 * 
 * @arg enabled
 * @text 対象にする
 * @desc trueにすると、エンカウントエフェクトランダム時に候補になる。
 * @type boolean
 * @default false
 * 
 * 
 * @param fadePeriod
 * @text フェード時間
 * @desc フェードの変化にかける時間[フレーム数]
 * @type number
 * @default 40
 * 
 * @param delayPlayBgm
 * @text BGM鳴らすまでのディレイ
 * @desc フェードアウト後、BGMを鳴らし始めるまでのディレイ[フレーム数]
 * @type number
 * @default 0
 * 
 * @param waitChangeScene
 * @text シーン変更までのディレイ
 * @desc BGMを鳴らし始めてから、シーンを変えるまでのディレイ[フレーム数]
 * @type number
 * @default 30
 * 
 * @param seFade1
 * @text フェード時SE1
 * @desc フェード時SE1
 * @type struct<SoundEffect>
 * @default {"name":"","volume":"90","pitch":"100","pan":"100"}
 *  
 * @param seFade2
 * @text フェード時SE2
 * @desc フェード時SE2
 * @type struct<SoundEffect>
 * @default {"name":"","volume":"90","pitch":"100","pan":"100"}
 * 
 * @help
 * エンカウントしたとき、以下のエフェクトを行います。
 * 1.フェードアウト + SE1鳴らす(未設定時は省略)
 * 2.フェードイン
 * 3.フェードアウト + SE2鳴らす(未設定時は省略)
 * 4.戦闘BGM再生
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
    const pluginName = "Kapu_EncounterEffect_Pixelate";
    const parameters = PluginManager.parameters(pluginName);

    const fadePeriod = Math.max(0, Math.floor(Number(parameters["fadePeriod"]) || 0));
    const delayPlayBgm = Math.max(0, Math.floor(Number(parameters["delayPlayBgm"]) || 0));
    const waitChangeScene = Math.max(0, Math.floor(Number(parameters["waitChangeScene"]) || 0));
    const seFade1 = JSON.parse(parameters["seFade1"] || "{}");
    const seFade2 = JSON.parse(parameters["seFade2"] || "{}");
    const fadeOutPeriod1 = Math.floor(fadePeriod * 0.5);
    const fadeInTiming = fadeOutPeriod1;
    const fadeInPeriod = Math.floor(fadePeriod * 0.5);
    const fadeOutTiming = fadeOutPeriod1 + fadeOutPeriod1;
    const plyBgmTiming = fadeOutPeriod1 + fadeInPeriod + fadePeriod + delayPlayBgm;

    EncounterEffectManager.ENCOUNTEFFECT_PIXELATE = "Pixelate";

    // eslint-disable-next-line no-unused-vars
    PluginManager.registerCommand(pluginName, "setupNext", args => {
        $gameSystem.setNextEncounterEffect(EncounterEffectManager.ENCOUNTEFFECT_PIXELATE);
    });

    PluginManager.registerCommand(pluginName, "setupRandom", args => {
        const enabled = (args.enabled === undefined) ? false : (args.enabled === "true");
        if (enabled) {
            $gameSystem.enableRandomEncounterEffect(EncounterEffectManager.ENCOUNTEFFECT_PIXELATE);
        } else {
            $gameSystem.disableRandomEncounterEffect(EncounterEffectManager.ENCOUNTEFFECT_PIXELATE);
        }
    });

    //------------------------------------------------------------------------------
    // エンカウントエフェクト処理
    const _onEncountEffectStartPixelate = function() {
        this._encounterEffectDuration = fadePeriod * 3 + delayPlayBgm + waitChangeScene;
        this._encounterEffectFrame = 0;
    };

    /**
     * エンカウントエフェクトを更新する。
     */
    const _onEncountEffectUpdatePixelate = function() {
        const frame = this._encounterEffectFrame;

        if (frame === 0) {
            $gameTemp.setupNextFadeOut({
                mode: Game_Screen.FADE_MODE_PIXELATE,
                pattern: "",
                duration: fadeOutPeriod1,
                color:[0,0,0,255],
                zoom:2
            });
            this.startFadeOut(fadeOutPeriod1);
            if (seFade1.name) {
                AudioManager.playSe(seFade1);
            }
        } else if (frame === fadeInTiming) {
            $gameTemp.setupNextFadeIn({
                mode: Game_Screen.FADE_MODE_PIXELATE,
                pattern: "",
                duration: fadeInPeriod,
                color:[0,0,0,255],
                zoom:1.4
            });
            this.startFadeIn(fadeInPeriod);
        } else if (frame === fadeOutTiming) {
            $gameTemp.setupNextFadeOut({
                mode: Game_Screen.FADE_MODE_PIXELATE,
                pattern: "",
                duration: fadePeriod,
                color:[0,0,0,255],
                zoom:1.4
            });
            this.startFadeOut(fadePeriod);
            if (seFade2.name) {
                AudioManager.playSe(seFade2);
            }
        } else if (frame === plyBgmTiming) {
            BattleManager.playBattleBgm();
        }



        this._encounterEffectFrame++;
    };

    /**
     * エンカウントエフェクトを完了する。
     */
    const _onEncountEffectEndPixelate = function() {
        /* do nohting */
    };
    //------------------------------------------------------------------------------
    // EncounterEffectmanager
    EncounterEffectManager.registerEffect(EncounterEffectManager.ENCOUNTEFFECT_PIXELATE, {
        start: _onEncountEffectStartPixelate,
        update: _onEncountEffectUpdatePixelate,
        end: _onEncountEffectEndPixelate
    });
})();