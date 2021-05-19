/*:ja
 * @target MZ 
 * @plugindesc スキルコストプラグイン
 * @author kapuusagi
 * @url https://github.com/kapuusagi/MZPlugins/tree/master/plugins
 * @base Kapu_Utility
 * @orderAfter Kapu_Utility
 * @orderAfter Kapu_Base_ParamName
 * 
 * @param hpCostRateTraitSParamDid
 * @text HPコストレートデータID
 * @desc HPコストを増加減する特性に割り当てるデータID
 * @type number
 * @default 101
 * 
 * @param tpCostRateTraitSParamDid
 * @text TPコストレートデータID
 * @desc TPコストを増加減する特性に割り当てるデータID
 * @type number
 * @default 102
 * 
 * @param enableProperty
 * @text プロパティを使うかどうか。
 * @desc trueにすると、プロパティ hpcr 及び tpcrが定義されます。
 * @type boolean
 * @default true
 * 
 * @param enableUI
 * @text UI表示変更反映
 * @desc trueにするとUIにHP/MP/TPコストを表示するようにメソッドをオーバーライドする。
 * @type boolean
 * @default true
 * 
 * @param skillCostWidth
 * @text コスト表示欄の幅
 * @desc (UI表示する場合のみ)コスト表示欄の幅。使用するシステムフォントのサイズに合わせて、うまいこと調整してください。
 * @type number
 * @default 150
 * 
 * @param traitHpCostRate
 * @text HPコストレート特性名
 * @desc HPコストレート特性名
 * @type string
 * @default HPコストレート
 * 
 * @param traitTpCostRate
 * @text TPコストレート特性名
 * @desc TPコストレート特性名
 * @type string
 * @default TPコストレート
 * 
 * @help 
 * ベーシックシステムでのスキルコストは
 * シンプルにMPコスト(mpCost)及びTPコスト(tpCost)になっています。
 * これをちょっくら拡張します。
 * スキルのコストを
 *   HP/MP/TPコスト = 固定量 + 現在値 x レート + 最大HP x レート
 * にします。
 * 現在値のレートを1.0(100%)にすると、
 * 現在の残りHPを全て消費してちゅどーん、みたいなのができます。
 * 
 * ステートとコストレート特性を使えば、
 * 次のアクションだけコスト消費なし、みたいなのもできます。
 * 
 * ■ 使用時の注意
 * hpRateCost = 100% かつ、hpCost > 0にすると、現在HPを超えるため、
 * スキルは使用出来ません。(※HPコストレート特性により、消費HPが低減される場合は除く。)
 * 
 * ■ プラグイン開発者向け
 * DataSkillに以下のフィールドが追加されます。
 *    hpCost, hpRateCost, mhpRateCost
 *    mpRateCost, mhpRateCost,
 *    tpRateCost, mtpRateCost
 * 
 * HPコストレートを増減させる特性として、
 * Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE
 * が追加されます。
 * 
 * ============================================
 * プラグインコマンド
 * ============================================
 * プラグインコマンドはありません。
 * 
 * ============================================
 * ノートタグ
 * ============================================
 * アクター/クラス/ステート/武器/防具/エネミー
 *     <hpCostRate:rate#> 
 *        スキルのHPコストをrate#倍にする。(1で100%)
 *     <hpCostRate:rate%>
 *        スキルのHPコストをrate%にする。(100で100%)
 *     <tpCostRate:rate#> 
 *        スキルのTPコストをrate#倍にする。(1で100%)
 *     <tpCostRate:rate%>
 *        スキルのTPコストをrate%にする。(100で100%)
 * 
 * スキル
 *     <hpCost:value#>
 *        コスト固定値としてvalueを必要とします。
 *     <hpRateCost:value#>
 *        現在HPのvalueだけ必要とします。(1で100％)
 *     <mhpRatecost:value#>
 *        最大HPのvalueだけ必要とします。(1で100％)
 *     <mpRateCost:value#>
 *        現在MPのvalueだけ必要とします.(1で100％)
 *     <mmpRateCost:value#>
 *        最大MPのvalueだけ必要とします。(1で100％)
 *     <tpRateCost:value#>
 *        現在TPのvalueだけ必要とします。(1で100％)
 *     <mtpRateCost:value#>
 *        最大Tpのvalueだけ必要とします。(1で100％)
 *     <ignorehpcr>
 *        HPコストレート特性無効。
 *     <ignoremcr>
 *        MPコストレート特性無効。
 *     <ignoretpcr>
 *        TPコストレート特性無効。
 * ============================================
 * 変更履歴
 * ============================================
 * Version.0.3.0 Kapu_Base_ParamName に対応した。
 * Version.0.2.0 スキルコスト表示の変更機能を追加した。
 * Version.0.1.1 現在HP/MP/TPを元にしたコスト算出で、
 *               現在HP/MP/TPがゼロの場合、コストもゼロになる不具合を修正した。
 * Version.0.1.0 確認した。
 */
(() => {
    const pluginName = "Kapu_SkillCost";
    const parameters = PluginManager.parameters(pluginName);
    Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE = Number(parameters["hpCostRateTraitSParamDid"]) || 0;
    Game_BattlerBase.TRAIT_SPARAM_DID_TPCOST_RATE = Number(parameters["tpCostRateTraitSParamDid"]) || 0;
    const enableProperty = (typeof parameters["enableProperty"] === "undefined")
            ? false : (parameters["enableProperty"] === "true");
    const enableUI = (typeof parameters["enableUI"] === "undefined")
            ? true : (parameters["enableUI"] === "true");
    const skillCostWidth = Number(parameters["skillCostWidth"]) || 90;

    if (!Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE) {
        console.error(pluginName + ":TRAIT_SPARAM_DID_HPCOST_RATE is not valid.");
    }
    if (!Game_BattlerBase.TRAIT_SPARAM_DID_TPCOST_RATE) {
        console.error(pluginName + ":TRAIT_SPARAM_DID_TPCOST_RATE is not valid.");
    }

    //------------------------------------------------------------------------------
    // DataManager
    /**
     * 割合パラメータを計算する。
     * 
     * @param {String} valueStr 文字列
     */
    const _parseRate = function(valueStr) {
        if (valueStr.slice(-1) === "%") {
            return Number(valueStr.slice(0, valueStr.length - 1)) / 100.0;
        } else {
            return Number(valueStr);
        }
    };

    /**
     * ノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processNoteTag = function(obj) {
        if (Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE &&  obj.meta.hpCostRate) {
            const rate = _parseRate(obj.meta.hpCostRate);
            if (rate >= 0) {
                obj.traits.push({
                    code: Game_BattlerBase.TRAIT_SPARAM,
                    dataId: Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE,
                    value: rate
                });
            }
        }

        if (Game_BattlerBase.TRAIT_SPARAM_DID_TPCOST_RATE && obj.meta.tpCostRate) {
            const rate = _parseRate(obj.meta.hpCostRate);
            if (rate >= 0) {
                obj.traits.push({
                    code: Game_BattlerBase.TRAIT_SPARAM,
                    dataId: Game_BattlerBase.TRAIT_SPARAM_DID_TPCOST_RATE,
                    value: rate
                });
            }
        }
    };

    DataManager.addNotetagParserActors(_processNoteTag);
    DataManager.addNotetagParserClasses(_processNoteTag);
    DataManager.addNotetagParserWeapons(_processNoteTag);
    DataManager.addNotetagParserArmors(_processNoteTag);
    DataManager.addNotetagParserStates(_processNoteTag);
    DataManager.addNotetagParserEnemies(_processNoteTag);

    /**
     * アイテムのノートタグを処理する。
     * 
     * @param {Object} obj データオブジェクト
     */
    const _processSkillNotetag = function(obj) {
        obj.hpCost = 0;
        if (obj.meta.hpCost) {
            obj.hpCost = Math.max(0, Math.floor((Number(obj.meta.hpCost) || 0)));
        }
        obj.hpRateCost = 0;
        if (obj.meta.hpRateCost) {
            obj.hpRateCost = _parseRate(obj.meta.hpRateCost);
        }
        obj.mhpRateCost = 0;
        if (obj.meta.mhpRateCost) {
            obj.mhpRateCost = _parseRate(obj.meta.hpRateCost);
        }
        obj.mpRateCost = 0;
        if (obj.meta.mpRateCost) {
            obj.mpRateCost = _parseRate(obj.meta.mpRateCost);
        }
        obj.mmpRateCost = 0;
        if (obj.meta.mmpRateCost) {
            obj.mmpRateCost = _parseRate(obj.meta.mmpRateCost);
        }
        obj.tpRateCost = 0;
        if (obj.meta.tpRateCost) {
            obj.tpRateCost = _parseRate(obj.meta.tpRateCost);
        }
        obj.mtpRateCost = 0;
        if (obj.meta.mtpRateCost) {
            obj.mtpRateCost = _parseRate(obj.meta.mtpRateCost);
        }
    };


    DataManager.addNotetagParserSkills(_processSkillNotetag);

    //------------------------------------------------------------------------------
    // TextManager
    if (TextManager._sparam && Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE) {
        TextManager._sparam[Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE] = parameters["traitHpCostRate"] || "";
    }
    if (TextManager._sparam && Game_BattlerBase.TRAIT_SPARAM_DID_TPCOST_RATE) {
        TextManager._sparam[Game_BattlerBase.TRAIT_SPARAM_DID_TPCOST_RATE] = parameters["traitTpCostRate"] || "";
    }
    
    //------------------------------------------------------------------------------
    // Game_BattlerBase
    /**
     * スキルのHPコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * @returns {Number] HPコスト
     */
    Game_BattlerBase.prototype.skillHpCost = function(skill) {
        const cost = skill.hpCost
            + ((skill.hpRateCost === 0) ? 0 : Math.max(1, this.hp * skill.hpRateCost))
            + this.mhp * skill.mhpRateCost;
        if (skill.meta.ignorehpcr) {
            return Math.floor(cost);
        } else {
            return Math.floor(cost * this.hpCostRate());
        }
    };
    // Game_BattlerBase
    /**
     * スキルのMPコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * !!!overwrite!!! Game_BattlerBase.skillMpCost
     */
    Game_BattlerBase.prototype.skillMpCost = function(skill) {
        const cost = skill.mpCost
                + ((skill.mpRateCost === 0) ? 0 : Math.max(1, this.mp * skill.mpRateCost))
                + this.mmp * skill.mmpRateCost;
        if (skill.meta.ignorempcr) {
            return Math.floor(cost);
        } else {
            return Math.floor(cost * this.mcr);
        }
    };

    /**
     * スキルのTPコストを得る。
     * 
     * @param {DataSkill} skill スキル
     * !!!overwrite!!! Game_BattlerBase.skillTpCost()
     */
    Game_BattlerBase.prototype.skillTpCost = function(skill) {
        const cost = skill.tpCost
                + ((skill.tpRateCost === 0) ? 0 : (this.tp * skill.tpRateCost))
                + this.maxTp() * skill.mtpRateCost;
        if (skill.meta.ignoretpcr) {
            return Math.floor(cost);
        } else {
            return Math.floor(cost * this.tpCostRate());
        }
    };
    const _Game_BattlerBas_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
    /**
     * スキルの使用コストが支払える状態かどうかを得る。
     * 
     * @param {DataSkill} skill 
     * @returns {Boolean} スキルコストが支払える場合にはtrue, それ以外はfalse
     */
    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        return _Game_BattlerBas_canPaySkillCost.call(this, skill)
                && this._hp >= this.skillHpCost(skill);
    };

    const _Game_BattlerBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
    /**
     * スキルのコストを払う。
     * 
     * @param {DataSkill} skill スキル
     */
    Game_BattlerBase.prototype.paySkillCost = function(skill) {
        _Game_BattlerBase_paySkillCost.call(this, skill);
        const newHp = Math.max(0, this._hp - this.skillHpCost(skill));
        this.setHp(newHp);
    };

    if (Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE) {
        /**
         * HPコストレートを得る。
         * 
         * @returns {Number} HPコストレート
         */
        Game_BattlerBase.prototype.hpCostRate = function() {
            return Math.max(0, this.sparam(Game_BattlerBase.TRAIT_SPARAM_DID_HPCOST_RATE));
        };
    } else {
        /**
         * HPコストレートを得る。
         * 
         * @returns {Number} HPコストレート
         */
        Game_BattlerBase.prototype.hpCostRate = function() {
            return 1;
        };
    }
    if (Game_BattlerBase.TRAIT_SPARAM_DID_TPCOST_RATE) {
        /**
         * TPコストレートを得る。
         * 
         * @returns {Number} HPコストレート
         */
        Game_BattlerBase.prototype.tpCostRate = function() {
            return Math.max(0, this.sparam(Game_BattlerBase.TRAIT_SPARAM_DID_TPCOST_RATE));
        };
    } else {
        /**
         * TPコストレートを得る。
         * 
         * @returns {Number} HPコストレート
         */
        Game_BattlerBase.prototype.tpCostRate = function() {
            return 1;
        };
    }
    if (enableProperty) {
        /**
         * HPコストレート
         * 
         * @constant {Number}
         */
        Object.defineProperty(Game_BattlerBase.prototype, "hpcr", {
            /** @returns {Number} */
            get: function() { return this.hpCostRate(); },
            configurable:true
        });
        /**
         * TPコストレート
         * 
         * @constant {Number}
         */
        Object.defineProperty(Game_BattlerBase.prototype, "tpcr", {
            /** @returns {Number} */
            get: function() { return this.tpCostRate(); },
            configurable:true
        });
            
    }


    //------------------------------------------------------------------------------
    // Window_SkillCost
    if (enableUI) {
        if (!ColorManager.hpCostColor) {
            /**
             * HPコストカラーを得る。
             * 
             * @returns {String} HPコストカラー
             */
            ColorManager.hpCostColor = function() {
                return this.normalColor();
            };
        }

        /**
         * コスト描画幅を得る。
         * 
         * @returns {Number} コスト描画幅
         * !!!overwrite!!! Window_SkillList.drawSkillCost
         *     スキルコストの表示を変更するためにオーバーライドする。
         */
        Window_SkillList.prototype.costWidth = function() {
            return skillCostWidth;
        };
        /**
         * スキルコストを描画する。
         * 
         * @param {DataSkill} skill スキル
         * @param {Number} x 描画位置x(名前を含めた領域の左端が渡る)
         * @param {Number} y 描画位置y
         * @param {Number} width 幅(名前を含めた領域の幅が渡る)
         * !!!overwrite!!! Window_SkillList.drawSkillCost
         *     スキルコストの表示を変更するためにオーバーライドする。
         */
        Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
            const dispCosts = [];
            const hpCost = this._actor.skillHpCost(skill);
            if (hpCost > 0) {
                dispCosts.push({
                    label:TextManager.hpA,
                    cost:hpCost,
                    color:ColorManager.hpCostColor()
                });
            }
            const mpCost = this._actor.skillMpCost(skill);
            if (mpCost > 0) {
                dispCosts.push({
                    label:TextManager.mpA,
                    cost:mpCost,
                    color:ColorManager.mpCostColor()
                });
            }
            const tpCost = this._actor.skillTpCost(skill);
            if (tpCost > 0) {
                dispCosts.push({
                    label:TextManager.tpA,
                    cost:tpCost,
                    color:ColorManager.tpCostColor()
                });
            }

            if (dispCosts.length === 0) {
                // このスキルはコストが無い。
                return;
            }

            // XXhp/YYmp/ZZtpのような表示にする。
            // 左寄せだと楽だけど、逆だとめんどい。
            const slashCount = dispCosts.length - 1;
            const costWidth = this.costWidth();
            const singleCostWidth = Math.floor((costWidth - slashCount * 8) / dispCosts.length);
            const labelWidth = Math.floor(singleCostWidth * 0.3);
            const paramWidth = singleCostWidth - labelWidth;
            let drawX = x + width;
            for (let i = dispCosts.length - 1; i >= 0; i--) {
                const dispCost = dispCosts[i];
                this.resetFontSettings();
                this.changeTextColor(dispCost.color);
                this.contents.fontSize -= 8;
                drawX -= labelWidth;
                // ラベル描画
                this.drawText(dispCost.label, drawX, y + 4, labelWidth, "center");

                this.contents.fontSize += 8;
                drawX -= paramWidth;
                // コスト描画
                this.drawText(dispCost.cost, drawX, y, paramWidth, "right");

                // "/"描画
                if (i > 0) {
                    this.resetFontSettings();
                    drawX -= 8;
                    this.drawText("/", drawX, y, 8);
                }
            }
        };
    }
})();