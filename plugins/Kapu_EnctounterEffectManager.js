/*:ja
 * @target MZ 
 * @plugindesc エンカウンターエフェクトマネージャプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * 
 * 
 * @help 
 * エンカウントエフェクトを複数扱うためのマネージャ。
 * エンカウントエフェクト自体は次の優先度で選定される。
 * 
 * 1. 明示的に指定されている場合にはそれを優先。
 *    $gameSystem.encounterEffect()
 * 2. マップで指定されている場合には、マップのエンカウントエフェクトを指定する。
 *    $gameMap.encounterEffect()
 * 3. システムで有効化されているランダムエンカウントエフェクト
 *    $gameSystem.randomEncounterEffects()
 * 4. 既定のランダムエンカウントエフェクト
 *    $gameSystem.encounterEffectDefault()
 *    既定のエンカウントエフェクト。
 * 
 * ■ 使用時の注意
 * 本プラグイン単独では動作しない。
 * 他のエンカウントエフェクトプラグインと競合します。
 * 
 * ■ プラグイン開発者向け
 * EncounterEffectManager.registerEffect(name:string, object:EncountEffect) : void
 *   エンカウントエフェクトを登録する。
 *   エンカウントエフェクトを追加するプラグインで1回だけ呼び出す。
 *   エンカウントエフェクトは enableRandomEncounterEffect() を呼び出すとランダム選定対象になる。
 *   nameがエンカウントエフェクト名、objectはエンカウントエフェクトメソッドオブジェクト。
 *   EncountEffect = {
 *     start: {function(void)}
 *            エンカウントエフェクト開始時処理。
 *            this._encounterEffectDuration にエンカウントエフェクトのフレーム数を設定すること。
 *            this._encounterEffectDurationは呼び出し元で1フレームずつデクリメントされるため、
 *            特に減算処理をする必要はない。
 *     update: {function(void)}
 *            エンカウントエフェクトの更新処理。
 *   }
 *   start, updateともに Scene_Mapからapply(this)で呼び出される。
 *   そのため、Scene_Mapのメンバとメソッドを使用/変更することができる。
 * 
 * $gameSystem.setNextEncounterEffect(name:string) : void
 *   戦闘開始時のシーン遷移エフェクトを name で指定したものにする。
 *   空文字列指定時は、有効化されているエフェクトからランダムで選択される。
 *   設定は保存される。
 * 
 * $gameSystem.enableRandomEncounterEffect(name:string) : void
 *   エンカウントエフェクトがランダムで選択される際、
 *   name 指定したエフェクトを選択候補に入れるようにする。
 *   設定は保存される。
 * 
 * $gameSystem.disableRandomEncounterEffect(name:string) : void
 *   エンカウントエフェクトがランダムで選択される際、
 *   name 指定したエフェクトを選択候補に入れないようにする。
 *   設定は保存される。
 * 
 * EncounterEffectManager.ENCOUNTEFFECT_DEFAULT
 *   デフォルトエンカウントエフェクト
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * なし。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * マップ
 *   <encounterEffects:name$,name$,name$,...>
 *     マップでの戦闘エンカウントエフェクトを name$ とする。
 *     カンマ区切りで複数指定した場合、ランダムで選択される。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.1.0 動作未確認。
 */



/**
 * エンカウンターエフェクトマネージャ
 */
function EncounterEffectManager() {
    throw new Error("This is a static class");
}

(() => {
    // const pluginName = "Kapu_EncounterEffectManager";
    // const parameters = PluginManager.parameters(pluginName);

    //------------------------------------------------------------------------------
    // 既定のエンカウントエフェクト処理
    const _onEncountEffectStartDefault = function() {
        this._encounterEffectDuration = this.encounterEffectSpeed();
    };

    /**
     * エンカウントエフェクトを更新する。
     */
    const _onEncountEffectUpdateDefault = function() {
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
    };

    //------------------------------------------------------------------------------
    // EncounterEffectManager
    EncounterEffectManager.ENCOUNTEFFECT_DEFAULT = "default";
    EncounterEffectManager._encounterEffects = {};
    EncounterEffectManager._encounterEffects[EncounterEffectManager.ENCOUNTEFFECT_DEFAULT] = {
        start: _onEncountEffectStartDefault,
        update: _onEncountEffectUpdateDefault
    };

    /**
     * エフェクトを登録する。
     * 
     * @param {string} name 名前
     * @param {object} effect エフェクト
     */
    EncounterEffectManager.registerEffect = function(name, effect) {
        if (name) {
            this._encounterEffects[name] = effect;
        }
    };

    /**
     * エンカウントエフェクトを得る。
     * 
     * @param {string} name 名前
     * @returns {EncountEffect} エンカウントエフェクトオブジェクト
     */
    EncounterEffectManager.getEffect = function(name) {
        const effect = this._encounterEffects[name];
        if (effect) {
            return effect;
        } else {
            // 名前未指定時
            return this._encounterEffects[EncounterEffectManager.ENCOUNTEFFECT_DEFAULT];
        }
    };

    /**
     * エンカウントエフェクトが存在するかどうかを取得する。
     * 
     * @param {string} name エンカウントエフェクト名
     * @returns {boolean} 存在する場合にはtrue, それ以外はfalse.
     */
    EncounterEffectManager.isEffectExists = function(name) {
        return (this._encounterEffects[name]) ? true : false;
    };

    
    //------------------------------------------------------------------------------
    // Game_System
    const _Game_System_initialize = Game_System.prototype.initialize;
    /**
     * Game_Systemを初期化する。
     */
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._encounterEffect = "";
        this._nextEncounterEffect = "";
        this._randomEncounterEffects = [];
    };

    /**
     * 次のエンカウントエフェクトを設定する。
     * 
     * @param {string} name エンカウントエフェクト名
     */
    Game_System.prototype.setNextEncounterEffect = function(name) {
        if (!name || EncounterEffectManager.isEffectExists(name)) {
            this._nextEncounterEffect = name;
        }
    };

    /**
     * 次のエンカウントエフェクトを得る。
     * 
     * @returns {string} エンカウントエフェクト名
     */
    Game_System.prototype.nextEncounterEffect = function() {
        return this._nextEncounterEffect;
    };

    /**
     * エンカウントエフェクトを有効にする。
     * 
     * @param {string} name エンカウントエフェクト名
     */
    Game_System.prototype.enableRandomEncounterEffect = function(name) {
        if (EncounterEffectManager.isEffectExists(name)
                && !this._randomEncounterEffects.includes(name)) {
            this._randomEncounterEffects.push(name);
        }
    };

    /**
     * エンカウントエフェクトを無効にする。
     * 
     * @param {string} name エンカウントエフェクト名
     */
    Game_System.prototype.disableRandomEncounterEffect = function(name) {
        if (this._randomEncounterEffects.includes(name)) {
            const index = this._randomEncounterEffects.indexOf(name);
            this._randomEncounterEffects.splice(index, 1);
        }
    };

    /**
     * ランダムエンカウントエフェクトとして有効になっているエンカウントエフェクト名リストを得る。
     * 
     * @returns {Array<string>} エンカウントエフェクト名リスト
     */
    Game_System.prototype.randomEncounterEffects = function() {
        return this._randomEncounterEffects;
    };

    /**
     * エンカウントエフェクトのデフォルトを得る。
     * 
     * @returns {string} エンカウントエフェクト名
     */
    Game_System.prototype.encounterEffectDefault = function() {
        return EncounterEffectManager.ENCOUNTEFFECT_DEFAULT;        
    };
    //------------------------------------------------------------------------------
    // Game_Map

    /**
     * エンカウントエフェクトリストをセットアップする。
     */
    Game_Map.prototype.setupEncounterEffects = function() {
        $dataMap.encounterEffects = [];
        if ($dataMap.meta.encounterEffects) {
            const effectNames = $dataMap.meta.encounterEffects.split(",").map(token => token.trim());
            for (const effectName of effectNames) {
                if (EncounterEffectManager.isEffectExists(effectName)) {
                    $dataMap.encounterEffects.push(effectName)
                }
            }
        }
    };


    /**
     * マップで指定されているエンカウントエフェクト名を得る。
     * 
     * @returns {string} エンカウントエフェクト名。
     */
    Game_Map.prototype.encounterEffect = function() {
        if (!$dataMap.encounterEffects) {
            this.setupEncounterEffects();
        }
        if ($dataMap.encounterEffects.length > 0) {
            const index = Math.randomInt($dataMap.encounterEffects.length);
            return $dataMap.encounterEffects[index];
        } else {
            return "";
        }
    };

    //------------------------------------------------------------------------------
    // Scene_Map
    /**
     * エンカウントエフェクトを開始する。
     * 
     * !!!overwrite!!! Scene_Map.startEncounterEffect()
     *     エンカウントエフェクトを開始する。
     */
    Scene_Map.prototype.startEncounterEffect = function() {
        this._spriteset.hideCharacters();
        this._encounterEffectName = this.nextEncounterEffect();
        const effect = EncounterEffectManager.getEffect(this._encounterEffectName);
        effect.start.apply(this);
    };

    /**
     * 次の戦闘シーンへのエンカウントエフェクトを得る。
     * 
     * @returns {string} エンカウントエフェクト名
     */
    Scene_Map.prototype.nextEncounterEffect = function() {
        let encounterEffect = $gameSystem.nextEncounterEffect();
        if (encounterEffect) {
            // 戦闘シーンへのエンカウントエフェクトが指定されている。
            return encounterEffect;
        } else {
            encounterEffect = $gameMap.encounterEffect();
            if (encounterEffect) {
                // マップでエンカウントエフェクトが指定されている。
                return encounterEffect;
            } else {
                // 既定のエンカウントエフェクトを呼び出す。
                const encounterEffects = $gameSystem.randomEncounterEffects();
                if (encounterEffects.length > 0) {
                    const index = Math.randomInt(encounterEffects.length);
                    return encounterEffects[index];
                } else {
                    return $gameSystem.encounterEffectDefault();
                }
            }
        }
    };

    /**
     * エンカウントエフェクトを更新する。
     * 
     * !!!overwrite!!! Scene_Map.updateEncounterEffect()
     *     エンカウントエフェクト処理を変更するためオーバーライドする。
     */
    Scene_Map.prototype.updateEncounterEffect = function() {
        const effect = EncounterEffectManager.getEffect(this._encounterEffectName);
        if (this._encounterEffectDuration > 0) {
            this._encounterEffectDuration--;
            effect.update.apply(this);
        }
    };

})();