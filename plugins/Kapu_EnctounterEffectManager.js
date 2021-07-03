/*:ja
 * @target MZ 
 * @plugindesc エンカウンターエフェクトマネージャプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
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

/**
 * エンカウンターエフェクト
 */
function Game_EncounterEffect_Base() {
    this.initialize(...arguments);
}

/**
 * ベーシックシステムのエンカウンターエフェクト
 */
function Game_EncounterEffect_Default() {
    this.initialize(...arguments);
}

/**
 * エンカウンターエフェクトマネージャ
 */
function EncounterEffectManager() {
    throw new Error("This is a static class");
}

(() => {
    const pluginName = "Kapu_EncounterEffectManager";
    const parameters = PluginManager.parameters(pluginName);

    // PluginManager.registerCommand(pluginName, "こまんど", args => {
    //     // TODO : コマンドの処理。
    //     // パラメータメンバは @argで指定した名前でアクセスできる。
    // });
    //------------------------------------------------------------------------------
    // Game_EncounterEffect
    Game_EncounterEffect_Base.prototype.initialize = function() {

    };
    //------------------------------------------------------------------------------
    // Game_EncounterEffect_Default
    Game_EncounterEffect_Default.prototype = Object.create(Game_EncounterEffect_Base.prototype);
    Game_EncounterEffect_Default.prototype.constructor = Game_EncounterEffect_Default;

    /**
     * 
     */
    Game_EncounterEffect_Base.prototype.initialize = function() {

    };

    //------------------------------------------------------------------------------
    //

    //------------------------------------------------------------------------------
    // Scene_Map
    /**
     * エンカウントエフェクトを開始する。
     */
    Scene_Map.prototype.startEncounterEffect = function() {
        this._spriteset.hideCharacters();
        this._encounterEffectDuration = this.encounterEffectSpeed();
    };

    /**
     * エンカウントエフェクトを更新する。
     */
    Scene_Map.prototype.updateEncounterEffect = function() {
        if (this._encounterEffectDuration > 0) {
            this._encounterEffectDuration--;
            const speed = this.encounterEffectSpeed();
            const n = speed - this._encounterEffectDuration;
            const p = n / speed;
            const q = ((p - 1) * 20 * p + 5) * p + 1;
            const zoomX = $gamePlayer.screenX();
            const zoomY = $gamePlayer.screenY() - 24;
            if (n === 2) {
                $gameScreen.setZoom(zoomX, zoomY, 1);
                this.snapForBattleBackground();
                this.startFlashForEncounter(speed / 2);
            }
            $gameScreen.setZoom(zoomX, zoomY, q);
            if (n === Math.floor(speed / 6)) {
                this.startFlashForEncounter(speed / 2);
            }
            if (n === Math.floor(speed / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
        }
    };

    /**
     * 戦闘時のバックグラウンドをスナップする。
     */
    Scene_Map.prototype.snapForBattleBackground = function() {
        this._windowLayer.visible = false;
        SceneManager.snapForBackground();
        this._windowLayer.visible = true;
    };

    /**
     * エンカウントエフェクト用のフラッシュ処理を開始する。
     * 
     * @param {number} duration フラッシュ時間[フレーム数]
     */
    Scene_Map.prototype.startFlashForEncounter = function(duration) {
        const color = [255, 255, 255, 255];
        $gameScreen.startFlash(color, duration);
    };

    /**
     * エンカウントエフェクトに要する時間を得る。
     * 
     * @returns {number} エンカウントエフェクトにかける時間[秒]
     */
    Scene_Map.prototype.encounterEffectSpeed = function() {
        return 60;
    };

})();