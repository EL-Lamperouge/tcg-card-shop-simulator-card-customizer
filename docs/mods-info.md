# Mods情報

## 使用mod
- [TCGShopNewCardsMod](https://www.nexusmods.com/tcgcardshopsimulator/mods/200): 新しいカードを追加するmod。`MonsterConfigs`配下のiniでカード性能を定義する。
- [ArtExpander](https://www.nexusmods.com/tcgcardshopsimulator/mods/417): レアリティごとにカード画像を差し替えるmod。本ツールの画像出力先を提供する。
- CustomExpansionPackImages: カード面の文字情報（名前・説明など）をiniファイルで上書きするmod。カード名の参照・更新に使用する。

## リファレンスドキュメント
- [mods-filetree.md](./mods-filetree.md): BepInEx配下のディレクトリ構成と主要ファイルの位置を記載。
- [vanilla-card-info.md](./vanilla-card-info.md): バニラカードのID・属性・管理名一覧。CustomExpansionPackImagesで対象ファイルを特定する際のキーになる。

## 各modの設定

### TCGShopNewCardsMod
- 設定ファイルは `BepInEx/patchers/TCGShopNewCardsModPreloader/MonsterConfigs` に配置する。
- 追加カードの`Monster Type`や`Name`を変更することで、ArtExpander側の画像ファイルと紐付けられる。

### ArtExpander
- 画像は `BepInEx/plugins/ArtExpander/cardart/default/<Pack>/<Rarity>/<CardId>.png` に配置する。
- 本ツールでは保存時にディレクトリを自動生成し、PNGファイルを出力する。
- `<Pack>` は Tetramon、Destiny などエクスパンション名で分岐し、以下のレアリティ階層はどのエクスパンションでも共通となる。

### CustomExpansionPackImages
- カード名などの表示テキストは `BepInEx/plugins/CustomExpansionPackImages/Configs/Custom/<Expansion>Configs` 直下の`.ini`で管理される。
- `<Expansion>Configs`直下のファイルのみを処理対象とし、`FullExpansionsConfigs`や`org`/`translated`などのサブディレクトリは走査しない。
- `<Expansion>`（例: `Tetramon`, `Destiny`）をエクスパンション名として扱い、カードごとにどのエクスパンションの設定か判別できるようにする。
- 1枚のカードに対して通常版と`FullArt`版が存在する場合は、同じディレクトリ直下の双方を同じ`Name`に揃えるとゲーム内表示の不整合を防げる。
- 例:
  ```text
  TCG Card Shop Simulator/
    BepInEx/
      plugins/
        CustomExpansionPackImages/
          Configs/
            Custom/
              TetramonConfigs/
                PiggyA.ini        # 通常カード
                PiggyAFullArt.ini # フルアート版（必要に応じて同値を書き込む）
              DestinyConfigs/
                ...
  ```

## 運用メモ
- カード名の現在値を取得する際は、管理名（例: `PiggyA`）から上記iniファイルを特定し、`Name =` 行を参照する。
- 名前を更新する場合は、対象iniが存在しない場合にエラーを返し、意図しない新規作成を防ぐ。
- 参照・更新の実装は`vanilla-card-info.md`に記載された管理名をキーにして検索する設計とする。
