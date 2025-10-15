# TCG Card Shop Simulator カスタムカードツール 仕様書

## 概要
TCG Card Shop SimulatorのMOD用カスタムカードを作成・編集・管理するElectronデスクトップアプリケーション。

---

## 画面設計

### 1. カード一覧画面

#### 概要
- カードパックごとにカードを一覧表示
- 検索・ページネーション・パック切り替えが可能

#### UI要素
- **パック選択ドロップダウン**
  - 例: `Tetramon ▼`
  - 他パック（Destiny）も選択可
- **検索ボックス**
  - カード名・IDでフィルタリング
- **カード追加ボタン**
  - カード追加ダイアログが開く
- **カードグリッド**
  - 1ページ最大12枚（6×2行）
  - 各カードに「画像」「カード名」「ID」
- **ページネーション**
  - 前後ページ移動ボタン
  - 現在ページのハイライト

#### 機能要件
- パック切り替え時、該当パックのカードのみ表示
- 検索ボックスで名前・ID部分一致検索
- ページ送り（1ページ12件）
- カードサムネイルクリックで詳細画面へ遷移
- カード追加ダイアログでカードを追加できる
  - カード名
  - パック(パックに登録されているIDの終端を自動指定)
  - カードレアリティ(Baseとかではなく、パックに登録されているレアリティを選択)
  - カード画像(ファイルダイアログで選択、Baseに設定)
  - 保存ボタン
  - キャンセルボタン
  - その他の情報はiniファイルのテンプレートから自動入力

### 7. カード一覧画面のUI統合

- カード一覧画面では、バニラカード・追加カードを区別せず、ID順で一括表示する。
- 各カード（バニラ・追加問わず）をクリックすると、共通の詳細・編集画面に遷移できる。
- 詳細・編集画面には「名前変更用のテキストボックス」を設置し、デフォルトで現在の名前を表示・編集可能とする。
- 画像やその他の編集項目も、バニラ・追加カードで共通のUIで操作できるようにする。
- 検索・フィルタ・ページネーションもバニラ・追加カードを横断して機能する。

---

### 2. カード詳細画面

#### 概要
- 1枚のカードの詳細情報・各レアリティ画像を表示
- 編集・削除・戻る操作が可能

#### UI要素
- **カード名（タイトル）**
- **閉じるボタン（右上・赤い×）**
- **レアリティごとの画像プレビュー（6種）**
  - Base, FirstEdition, Silver, Gold, EX, FullArt
  - 画像が存在しない場合は枠のみ表示

#### 機能要件
- 各レアリティ画像の有無を判定し、存在しない場合は枠のみ
- 閉じるボタンで一覧画面に戻る
- 各レアリティの枠をクリックすると、ファイルダイアログが開き、画像を選択できる
- 画像を選択すると、カードの該当レアリティの画像が差し替わり、プレビューが更新される

---

### 3. 画面遷移イメージ
- アプリ起動 → カード一覧画面
- カードクリック → カード詳細画面
- 詳細画面の×ボタン → 一覧画面に戻る

---

### 備考
- UIはMUI（Material-UI）を利用し、ワイヤーフレームのレイアウトを忠実に再現
- レアリティ種別は今後拡張可能な設計とする

---

## iniファイルのテンプレート
パックレアリティがCommonの場合のテンプレート
```ini
[CardName]
Artist Name = ArtistName
Description = Added card. 
Effect Amount = (1.5, 1.0, 0.7)
Element Index = Earth
Monster Type = CardName
Monster Type ID = 124
Name = CardName
Next Evolution = None
Previous Evolution = None
Rarity = Common
Roles = Defender, PhysicalAttacker
Skills = Earthquake, RockSmash, BoulderCrush

HP = 600
HP Level Add = 80
Magic = 150
Magic Level Add = 15
Speed = 70
Speed Level Add = 5
Sprit = 200
Sprit Level Add = 20
Strength = 450
Strength Level Add = 45
Vitality = 200
Vitality Level Add = 20
```

パックレアリティがRareの場合のテンプレート
```ini
[CardName]
Artist Name = ArtistName
Description = Added card. 
Effect Amount = (1.5, 1.0, 0.7)
Element Index = Earth
Monster Type = CardName
Monster Type ID = 124
Name = CardName
Next Evolution = None
Previous Evolution = None
Rarity = Rare
Roles = Defender, PhysicalAttacker
Skills = Earthquake, RockSmash, BoulderCrush

HP = 600
HP Level Add = 80
Magic = 150
Magic Level Add = 15
Speed = 70
Speed Level Add = 5
Sprit = 200
Sprit Level Add = 20
Strength = 450
Strength Level Add = 45
Vitality = 200
Vitality Level Add = 20
```

パックレアリティがEpicの場合のテンプレート
```ini
[CardName]
Artist Name = ArtistName
Description = Added card. 
Effect Amount = (1.5, 1.0, 0.7)
Element Index = Earth
Monster Type = CardName
Monster Type ID = 124
Name = CardName
Next Evolution = None
Previous Evolution = None
Rarity = Epic
Roles = Defender, PhysicalAttacker
Skills = Earthquake, RockSmash, BoulderCrush

HP = 600
HP Level Add = 80
Magic = 150
Magic Level Add = 15
Speed = 70
Speed Level Add = 5
Sprit = 200
Sprit Level Add = 20
Strength = 450
Strength Level Add = 45
Vitality = 200
Vitality Level Add = 20
```

パックレアリティがLegendaryの場合のテンプレート
```ini
[CardName]
Artist Name = ArtistName
Description = Added card. 
Effect Amount = (1.5, 1.0, 0.7)
Element Index = Earth
Monster Type = CardName
Monster Type ID = 124
Name = CardName
Next Evolution = None
Previous Evolution = None
Rarity = Legendary
Roles = Defender, PhysicalAttacker
Skills = Earthquake, RockSmash, BoulderCrush

HP = 600
HP Level Add = 80
Magic = 150
Magic Level Add = 15
Speed = 70
Speed Level Add = 5
Sprit = 200
Sprit Level Add = 20
Strength = 450
Strength Level Add = 45
Vitality = 200
Vitality Level Add = 20
```

---

## バニラカード置き換え機能

### 概要
- ゲーム内のバニラ（公式デフォルト）カードの「名前」と「画像」をカスタムできる機能を提供する。
- 既存のAddNewCards modやArtExpander modと併用可能。

### 仕様
#### 1. カード名の置き換え
- ゲームディレクトリの`BepInEx/plugins/CustomExpansionPackImages/Configs/Custom/<Expansion>Configs/<CardId>.ini`に記載された`Name = xxx`を編集することで反映される。
- `<Expansion>Configs`直下の`.ini`のみを対象とし、`FullExpansionsConfigs`や`org`/`translated`などのサブディレクトリはツールの探索対象から除外する。
- `<Expansion>`の名称をエクスパンション名としてUIに渡し、同名カードでもエクスパンション単位で識別できるようにする。
- 基本形と`FullArt`などバリアントの`.ini`が同じディレクトリに存在する場合は、同じ`Name`に揃えて書き込む。
- 本ツールからバニラカード一覧を取得し、カードごとに新しい名前を設定・保存できるUIを提供する。

#### 2. カード画像の置き換え
- 画像は`{OriginalCardName}.png`としてArtExpanderのディレクトリに格納することで置き換えられる。
- 既存のArtExpander連携機能を流用し、バニラカード画像の差し替えをサポートする。
- 本ツールから画像ファイルを選択し、所定のディレクトリに出力できるUIを提供する。

#### 3. UI要件
- バニラカード一覧からカードを選択し、「名前」と「画像」をカスタムできる画面を追加する。
- 置き換えた名前・画像のプレビュー機能を提供する。
- 変更内容を保存すると、所定のファイルに出力される。

#### 4. テスト要件
- 置き換えた名前・画像が正しく出力されるかのテストを実施する。
- UIの動作テストを行う。

#### 5. 備考
- 画像置き換えの仕組みは既存のArtExpander連携処理を流用する。
- バニラカード一覧の取得方法は、サンプルディレクトリのファイル名から取得する。

### 6. バニラカードのID・属性管理とファイル命名規則
- バニラカードのID・名前・属性は `/docs/vanilla-card-info.md` で一元管理する。
- カード一覧やソート、ID管理はこの情報をもとに行う。
- 置き換えファイルの命名規則は `{名前}_{属性}_NAME.txt` とし、属性はvanilla-card-info.mdの値を用いる。
- 画像ファイルも同様にIDや属性で管理・ソートできるようにする。
- これにより、ArtExpander連携のカード一覧表示もID順で統一される。

---

## カード情報の更新方法

### バニラカードの情報更新
- **カード画像**
  - パス: `BepInEx/plugins/ArtExpander/cardart/default/Vanilla/{レアリティ}/{管理名}.png`
    - 例: `.../Vanilla/Base/PiggyA.png`
    - 管理名は`docs/vanilla-card-info.md`の「管理名」列を参照
  - 役割: ゲーム内のバニラカード画像をレアリティごとに差し替える
- **カード名**
  - パス: `BepInEx/plugins/CustomExpansionPackImages/Configs/Custom/<Expansion>Configs/{管理名}.ini`
    - 例: `.../Custom/TetramonConfigs/PiggyA.ini`
    - 必要に応じて同ディレクトリ内の`{管理名}FullArt.ini`なども同じ名前で更新する
    - 管理名はvanilla-card-info.mdの「管理名」列を参照
  - 役割: ゲーム内のバニラカード名を任意の名称に置き換える
  - エクスパンションが複数存在する場合は、対象エクスパンションを明示的に指定して更新する

> 画像保存時のディレクトリ構成
- `BepInEx/plugins/ArtExpander/cardart/default/<Expansion>/<Rarity>/<管理名>.png`
- `<Expansion>` は `Tetramon` や `Destiny` などパック名で分岐し、以下のレアリティ構成は全エクスパンション共通。
- バニラカードの画像を保存する際は、対応するエクスパンション（存在しない場合は `Vanilla`）を用いてディレクトリを切り替える。

### 追加カードの情報更新
- **カード画像**
  - パス: `BepInEx/plugins/ArtExpander/cardart/default/Tetramon/{レアリティ}/{追加カード名}.png`
    - 例: `.../Tetramon/Base/Aron.png`
  - 役割: 追加カードの画像をレアリティごとに差し替える
- **カード名**
  - iniファイル: `BepInEx/patchers/TCGShopNewCardsModPreloader/MonsterConfigs/{追加カード名}.ini`
    - セクション名・Name・Monster Typeを新しいカード名に変更
    - 例: `[Aron]` → `[NewName]`、`Name=NewName`、`Monster Type=NewName`
  - iniファイル自体も新しいカード名にリネーム
  - 画像ファイルも全レアリティ分リネーム（`.../Tetramon/{レアリティ}/{新しいカード名}.png`）
  - 役割: 追加カードの表示名・管理名・画像を一括で変更

---

### カード新規追加機能

#### 概要
- 複数のカード画像ファイルを一度に選択し、画像ベースで新規カードを追加できる。
- 画像ごとにiniファイルを自動生成し、画像・iniファイルを所定ディレクトリに保存する。

#### 詳細仕様
- 追加処理は「カード追加」ボタンから開始。
- 画像ファイルは複数選択可能。
- 画像ごとに、以下の処理を行う。
  1. **IDの自動割り当て**  
     - 既存のiniファイル・バニラカード情報から使用中IDを全て収集。
     - 空きIDのうち最小のものを割り当てる。
  2. **カード名の自動決定**  
     - カード名は「c」＋採番したID（例：c101, c102, ...）とする。
  3. **画像ファイルの保存**  
     - `BepInEx/plugins/ArtExpander/cardart/default/Tetramon/Base/c{ID}.png` に保存。
  4. **iniファイルの生成・保存**  
     - テンプレートを用い、必須情報（ID・カード名など）を埋めて生成。
     - iniファイル名・セクション名・Name・Monster Typeはすべて `c{ID}`。
     - 必須以外の項目は固定値。
     - `BepInEx/patchers/TCGShopNewCardsModPreloader/MonsterConfigs/c{ID}.ini` に保存。

#### UI要件
- 「カード追加」ボタン押下でファイルダイアログを開き、複数画像選択を許可。
- 追加後は自動でカード一覧に反映。

#### 備考
- 画像ファイル名やiniファイル名の重複防止のため、ID割り当ては厳密に行う。
- 追加カードの初期表示名は `c{ID}` となるが、後から編集可能。

---

### 追加カードのリネーム仕様・ファイル名設計

#### 仕様変更点
- 追加カードのiniファイル名は「Monster Type」（例：c101）基準で生成・固定され、リネーム（Name変更）してもファイル名は変わらない。
- iniファイルの内容更新時は、`Name`のみ書き換え、セクション名・Monster Type・ファイル名は変更しない。
- 画像ファイル名もMonster Type基準で固定され、リネームしてもファイル名は変わらない。
- カード一覧や画像紐付け、保存処理など、これまでNameを参照していた箇所はMonster Typeを参照するように統一。

#### 具体的な動作例
- 追加カード生成時：
  - iniファイル名：`c101.ini`（Monster Type = c101）
  - 画像ファイル名：`c101.png`
  - iniのName, Monster Type, セクション名すべてc101
- リネーム後：
  - iniファイル名・画像ファイル名はc101のまま
  - iniのNameのみ新しい表示名に変更
  - カード一覧や画像紐付けはMonster Type（c101）で管理

#### 注意点
- NameとMonster Typeが異なる場合があるため、ファイル名や画像紐付け、検索・表示などはMonster Typeを基準にすること。
- iniファイルの探索・保存時もMonster Typeを使うこと。
- Nameはあくまで表示用・編集用の値として扱う。

---
