## 特性IDリスト

デフォルトで割り当てている特性IDリストを用意しておく。

|code値|定義|dataId値|説明|
|---|---|---|---|
|0～64||||ベーシックシステムで使用|
|100|__TRAIT_ELEMENT_ABSORB__|属性ID|指定した属性の攻撃を受けたとき、ダメージを吸収する特性。|
|101|__TRAIT_WEAPON_PERFORMANCE__|武器タイプ|指定した武器タイプの性能を向上させる特性|
|102|__TRAIT_ARMOR_PERFORMANCE__|防具タイプ|指定した防具タイプの性能を向上させる特性|
|103|__TRAIT_DAMAGE_LIMIT__|-|最大ダメージ制限を変更する特性。|
|104|__TRAIT_STATE_RATEBUFF__|パラメータID|ステートの特性として使用するバフ効果。ベーシックシステムの割合増減とは別のレートになる。|
|105|__TRAIT_STATE_FIXEDBUFF__|パラメータID|ステートの特性として使用するバフ効果。|
|106|__TRAIT_UNRECOVER__|ブロック効果対象|ブロック効果対象特性。|
|107|__TRAIT_PARAM_ADD__|パラメータID|単純にパラメータを加算する特性。|
|108|__TRAIT_MAXTP_ADD__|-|最大TP加算特性。|
|109|__TRAIT_ELEMENT_ATTACK_RATE__|属性ID|指定した属性の威力を変更する特性。乗算合計。|
||||
|1001|__TRAIT_BASIC_PARAM__|基本パラメータを加算する特性|
|1002|__TRAIT_BASIC_PARAM_RATE__|基本パラメータ乗算レート特性|
|1003|__TRAIT_PARAM_RATE_ALL__|パラメータ乗算レート（装備品含む全体にかかる）|
||||

### XPARAM

__Game_BattlerBase.TRAIT_XPARAM__(値=22)で定義される。
効果値が全ての加算結果で得られるパラメータに対する効果。初期値0で効果エントリのvalue分加算される。

|dataId|定義|説明|
|---|---|---|
|0～9|(未定義)|ベーシックシステムで使用|
|200|__TRAIT_XPARAM_DID_CDR__|クリティカルダメージレート。|
|202|__TRAIT_XPARAM_DID_CASTTIME_RATE__|スキル発動時間率(魔法以外)。|
|203|__TRAIT_XPARAM_DID_AUTOGUARD_RATE__|自動防御率。|
|204|__TRAIT_XPARAM_DID_DEFPR__|物理貫通レート。指定した割合だけDEFを減衰させる。|
|205|__TRAIT_XPARAM_DID_PDRPR__|物理ダメージレート貫通。指定した割合だけPDRを減衰させる。|
|206|__TRAIT_XPARAM_DID_MDFPR__|魔法貫通レート。指定した割合だけMDEFを減衰させる。|
|207|__TRAIT_XPARAM_DID_MDRPR__|魔法ダメージレート貫通。指定した割合だけMDRを減衰させる。|
|208|__TRAIT_XPARAM_DID_INITTP_RATE__|戦闘開始時のTPチャージ量を指定する。|
|209|__TRAIT_XPARAM_DID_MAGIC_CASTTIME_RATE__|スキル発動時間率(魔法)。|
|210|__TRAIT_XPARAM_DID_TPB_SPEED__|TPB速度倍率。TPBチャージ速度がこの倍率だけ加減される。|
|||

### SPARAM

__Game_BattlerBase.TRAIT_SPARAM__(値=23)で定義される。
効果値乗算が全ての乗算結果で生成されるパラメータに対する効果。初期値は1.0で効果エントリのrateが乗算される。

|dataId|定義|説明|
|---|---|---|
|0～9|-|ベーシックシステムで使用|
|100|__TRAIT_SPARAM_DID_MAXTP_RATE__|最大TPレート|
|101|__TRAIT_SPARAM_DID_HPCOST_RATE__|HPコストレート|
|102|__TRAIT_SPARAM_DID_TPCOST_RATE__|TPコストレート|
|103|__TRAIT_SPARAM_DID_VARIANCE_RATE__|ばらつきレート|
|||

### スペシャルフラグ

__Game_BattlerBase.TRAIT_SPECIAL_FLAG__(値=62)で定義される。
特別な機能を提供するためのフラグ。
基本的にvalueの値は使用されず、フラグがあるかどうかだけが参照される(Game_BattlerBase.specialFlag()メソッド)。

|dataId|定義名|説明|
|---|---|---|
|0～4|-|ベーシックシステムで使用|
|100|__FLAG_ID_BLOCK_MOVE_BATTLEPOSITION__|ノックバックなどの効果を防止する。|
|101|__FLAG_ID_SKILLLONGRANGE__|常にロングレンジになる。|
|102|__FLAG_ID_FAST_ACTION__|戦闘開始時TPGがたまった状態にする。|
|103|__FLAG_ID_CERTAINLY_HIT_PHY__|CERTAINLY_EVAがある相手以外には確実にヒットする。|
|104|__FLAG_ID_CERTAINLY_HIT_MAG__|CERTAINLY_EVAがある相手以外には確実にヒットする。|
|105|__FLAG_ID_CERTAINLY_EVA_PHY__|必中スキル以外は確実に回避する。|
|106|__FLAG_ID_CERTAINLY_EVA_MAG__|必中スキル以外は確実に回避する。|
|107|__FLAG_ID_BLOCK_CAST_BREAK__|TPBキャストブレークを防ぐフラグ。|
|108|__FLAG_ID_BLOCK_TPB_LOSE__|TPB減少効果を防ぐフラグ。|
|109|__FLAG_ID_BUFFTURN_ADD__|特性保持者がバフを付与する場合、効果ターンを+1する。|
|110|__FLAG_ID_DEBUFFTURN_ADD__|特性保持者がデバフを付与する場合、効果ターンを+1する。|
|111|__FLAG_ID_ACPT_BUFFTURN_UP__|特性保持者がバフを受けた場合、効果ターンを+1する。|
|112|__FLAG_ID_ACPT_DEBUFFTURN_DOWN__|特性保持者がデバフを受けた場合、効果ターンを-1する。|
|113|__FLAG_ID_ENDURE_DYING__|ダメージを受けたとき、HP1で耐える特性。|

### パーティーアビリティ

__Game_BattlerBase.TRAIT_PARTY_ABILITY__(値=64)で定義される。
パーティーアビリティ。
既定の実装はdataIdで指定された値の効果を持っているかどうか、だけの判定に使われる。
Game_Party.ABILITY_～で定義される。

|dataId|定義|説明|
|---|---|---|
|0～5|Game_Party.ABILITY_～で定義される。|ベーシックシステムで使用|
|100|__ABILITY_DROP_ITEM_RATE__|アイテムドロップ倍率。|
|101|__ABILITY_DROP_GOLD_RATE__|取得ゴールド倍率。|
|102|__ABILITY_BUYING_PRICE_RATE__|売却価格レート倍率。|
|103|__ABILITY_SELLING_PRICE_RATE__|購入価格レート倍率。|
|104|__ABILITY_PREEMPTIVE_RATE__|先制攻撃率特性。|
|105|__ABILITY_TARGET_SEARCH__|ターゲットサーチ特性。|
|106|__ABILITY_LIGHT_BRIGHTNESS__|暗闇中の光源特性。|
|107|__ABILITY_SURPRISE_RATE__|不利率特性。|
|108|__ABILITY_RANDOMENCOUNT_RATE__|ランダムエンカウント率特性。|
|109|__ABILITY_DOUBLE_DROP__|2倍ドロップ特性|
|110|__ABILITY_TRIPLE_DROP__|3倍ドロップ特性|
||||




## エフェクトコード

エフェクトコードリスト

|code|定義名|dataId|value1|value2|説明|
|---|---|---|---|---|---|
|0～44|||||ベーシックシステムで使用|
|100|__EFFECT_MOVE_BATTLE_POSITION__|0|-|-|前に出る効果。|
|101|__EFFECT_GAIN_GROWPOINT__|0|-|-|成長ポイントを加算する効果。|
|||1|-|-|後ろに下がる効果。|
|102|__EFFECT_RESET_GROWS__|-|-|-|成長リセットする効果|
|103|__EFFECT_ADD_GPLEARN_SKILL__|スキルID|-|-|GP習得可能スキルに追加する。|
|104|__EFFECT_GAIN_TPB_CHARGE_TIME__|-|確率|効果量|チャージタイムを加減する効果。|
|105|__EFFECT_GAIN_TPB_CAST_TIME__|-|確率|効果量|キャストタイムを加減する効果。|
|106|__EFFECT_BREAK_TPB_CASTING__|-|確率|-|キャスト中のアクションをキャンセルさせる効果。|
|107|__EFFECT_ADD_BUFF_FIXED__|パラメータID|ターン数|値|固定量加算する効果。|
|108|__EFFECT_ADD_DEBUFF_FIXED__|パラメータID|ターン数|値|固定量減算する効果。|
|109|__EFFECT_APPRAISE__|-|鑑定レベル|-|鑑定効果。|
|110|__EFFECT_FASTTRAVEL__|コモンイベントID|-|-|ファストトラベル効果。|
|111|__EFFECT_DUNGEONESCAPE__|コモンイベントID|-|-|エスケープ効果。|
|||||||
|1001|__EFFECT_BASIC_PARAM_ADD__|パラメータID|増減させる値|-|基本パラメータを指定した値だけ増減させる|
|1002|__EFFECT_UPDATE_LUK__|0|-|-|LUKを既定値でランダム変動させる。|
|||1|下限値|上限値|LUKをランダムで変動させる。|
|1003|__EFFECT_GAIN_WM_EXP__|武器タイプID|固定量|割合|ウェポンマスタリーのEXPを上昇させる効果。|




## スコープID

|scope|説明|
|0-14|ベーシックシステムで使用|
|101-115|RangeDistanceのデフォルト値で使用|