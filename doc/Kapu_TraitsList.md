## 特性IDリスト

デフォルトで割り当てている特性IDリストを用意しておく。

|定義|code値|dataId値|説明|
|---|---|---|---|
||0～21|||ベーシックシステムで使用|
|TRAIT_XPARAM|22||効果値が全ての加算結果で得られるパラメータに対する効果。初期値0で効果エントリのvalue分加算される。|
|||0～9|ベーシックシステムで使用|
|||200|TRAIT_XPARAM_DID_CDR。クリティカルダメージレート。|
|||202|TRAIT_XPARAM_DID_CASTTIME_RATE。スキル発動時間率。|
|||203|TRAIT_XPARAM_DID_AUTOGUARD_RATE。自動防御率。|
|||204|TRAIT_XPARAM_DID_DEFPR 物理貫通レート。指定した割合だけDEFを減衰させる。|
|||205|TRAIT_XPARAM_DID_PDRPR 物理ダメージレート貫通。指定した割合だけPDRを減衰させる。|
|||206|TRAIT_XPARAM_DID_MDFPR 魔法貫通レート。指定した割合だけMDEFを減衰させる。|
|||207|TRAIT_XPARAM_DID_MDRPR 魔法ダメージレート貫通。指定した割合だけMDRを減衰させる。|
|TRAIT_SPARAM|23||効果値乗算が全ての乗算結果で生成されるパラメータに対する効果。初期値は1.0で効果エントリのrateが乗算される。|
|||0～9|ベーシックシステムで使用|
|TRAIT_SPECIAL_FLAG|62|フラグID|特別な機能を提供するためのフラグ。|
|TRAIT_PARTY_ABILITY|64||パーティーアビリティ。既定の実装はdataIdで指定された値の効果を持っているかどうか、だけの判定に使われる。dataIdはGame_Party.ABILITY_～で定義されてる。|
|||0～5|ベーシックシステムで使用|
|||100|ABILITY_DROP_GOLD_RATE。アイテムドロップ倍率。|
|||101|ABILITY_DROP_GOLD_RATE。取得ゴールド倍率。|
|TRAIT_ELEMENT_ABSORB|100|属性ID|指定した属性の攻撃を受けたとき、ダメージを急襲する特性|


### スペシャルフラグ

__TRAIT_SPECIAL_FLAG__ の __dataId__ として使用される。

|定義名|flag ID|説明|
|---|---|---|
||0～4|ベーシックシステムで使用|
|FLAG_ID_BLOCK_MOVE_BATTLEPOSITION|100|ノックバックなどの効果を防止する。|
|FLAG_ID_SKILLLONGRANGE|101|常にロングレンジになる。|
|FLAG_ID_FAST_ACTION|102|戦闘開始時TPGがたまった状態にする。|

## エフェクトコード

エフェクトコードリスト

|定義名|code|dataId|value1|value2|説明|
|---|---|---|---|---|---|
||0～44||||ベーシックシステムで使用|
|EFFECT_MOVE_BATTLE_POSITION|100|0|-|-|前に出る効果。|
|||1|-|-|後ろに下がる効果。|



