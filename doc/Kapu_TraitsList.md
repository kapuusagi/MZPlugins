## 特性IDリスト

デフォルトで割り当てている特性IDリストを用意しておく。

|定義|code値|dataId値|説明|
|---|---|---|---|
||0～21|||ベーシックシステムで使用|
|TRAIT_XPARAM|22||効果値が全ての加算結果で得られるパラメータに対する効果。初期値0で効果エントリのvalue分加算される。|
|||0～9|ベーシックシステムで使用|
|||200|__TRAIT_XPARAM_DID_CDR__ クリティカルダメージレート。|
|||202|__TRAIT_XPARAM_DID_CASTTIME_RATE__  スキル発動時間率。|
|||203|__TRAIT_XPARAM_DID_AUTOGUARD_RATE__ 自動防御率。|
|||204|__TRAIT_XPARAM_DID_DEFPR__ 物理貫通レート。指定した割合だけDEFを減衰させる。|
|||205|__TRAIT_XPARAM_DID_PDRPR__ 物理ダメージレート貫通。指定した割合だけPDRを減衰させる。|
|||206|__TRAIT_XPARAM_DID_MDFPR__ 魔法貫通レート。指定した割合だけMDEFを減衰させる。|
|||207|__TRAIT_XPARAM_DID_MDRPR__ 魔法ダメージレート貫通。指定した割合だけMDRを減衰させる。|
|||208|__TRAIT_XPARAM_DID_INITTP_RATE__ 戦闘開始時のTPチャージ量を指定する。|
|TRAIT_SPARAM|23||効果値乗算が全ての乗算結果で生成されるパラメータに対する効果。初期値は1.0で効果エントリのrateが乗算される。|
|||0～9|ベーシックシステムで使用|
|||100|__TRAIT_SPARAM_DID_MAXTP_RATE__ 最大TPレート|
|TRAIT_SPECIAL_FLAG|62|フラグID|特別な機能を提供するためのフラグ。|
|TRAIT_PARTY_ABILITY|64||パーティーアビリティ。既定の実装はdataIdで指定された値の効果を持っているかどうか、だけの判定に使われる。dataIdはGame_Party.ABILITY_～で定義されてる。|
|||0～5|ベーシックシステムで使用|
|||100|__ABILITY_DROP_GOLD_RATE__ アイテムドロップ倍率。|
|||101|__ABILITY_DROP_GOLD_RATE__ 取得ゴールド倍率。|
|__TRAIT_ELEMENT_ABSORB__|100|属性ID|指定した属性の攻撃を受けたとき、ダメージを急襲する特性|
|__TRAIT_WEAPON_PERFORMANCE__|101|武器タイプ|指定した武器タイプの性能を向上させる特性|
|__TRAIT_ARMOR_PERFORMANCE__|102|防具タイプ|指定した防具タイプの性能を向上させる特性|
||||
|__TRAIT_BASIC_PARAM__|1001|基本パラメータを加算する特性|
|__TRAIT_BASIC_PARAM_RATE__|1002|基本パラメータ乗算レート特性|


### スペシャルフラグ

__TRAIT_SPECIAL_FLAG__ の __dataId__ として使用される。

|定義名|flag ID|説明|
|---|---|---|
||0～4|ベーシックシステムで使用|
|__FLAG_ID_BLOCK_MOVE_BATTLEPOSITION__|100|ノックバックなどの効果を防止する。|
|__FLAG_ID_SKILLLONGRANGE__|101|常にロングレンジになる。|
|__FLAG_ID_FAST_ACTION__|102|戦闘開始時TPGがたまった状態にする。|
|__FLAG_ID_CERTAINLY_HIT_PHY__|103|CERTAINLY_EVAがある相手以外には確実にヒットする。|
|__FLAG_ID_CERTAINLY_HIT_MAG__|104|CERTAINLY_EVAがある相手以外には確実にヒットする。|
|__FLAG_ID_CERTAINLY_EVA_PHY__|105|必中スキル以外は確実に回避する。|
|__FLAG_ID_CERTAINLY_EVA_MAG__|106|必中スキル以外は確実に回避する。|

## エフェクトコード

エフェクトコードリスト

|定義名|code|dataId|value1|value2|説明|
|---|---|---|---|---|---|
||0～44||||ベーシックシステムで使用|
|__EFFECT_MOVE_BATTLE_POSITION__|100|0|-|-|前に出る効果。|
|__EFFECT_GAIN_GROWPOINT__|101|0|-|-|成長ポイントを加算する効果。|
|||1|-|-|後ろに下がる効果。|
|__EFFECT_ADD_GPLEARN_SKILL__|103|スキルID|-|-|GP習得可能スキルに追加する。|
|||||||
|__EFFECT_BASIC_PARAM_ADD__|1001|パラメータID|増減させる値|-|基本パラメータを指定した値だけ増減させる|
|__EFFECT_UPDATE_LUK__|1002|0|-|-|LUKを既定値でランダム変動させる。|
|||1|下限値|上限値|LUKをランダムで変動させる。|



