# CustomExpansionPackImages を利用したカード名管理設計

## 背景
- 旧仕様では TextureReplacer の`objects_data/card`配下のテキストファイルでバニラカードの名称を上書きしていた。
- 現在は CustomExpansionPackImages に一本化し、`Name = xxx` を持つ`.ini`でカード名を制御する運用に移行する。

## 要件整理
1. `BepInEx/plugins/CustomExpansionPackImages/Configs/Custom/<Expansion>Configs`直下にある`.ini`の`Name`を参照・更新する。
2. `<Expansion>Configs`の`<Expansion>`部分をエクスパンション名として扱い、カード情報と紐づける。
3. `<Expansion>Configs`より下のサブディレクトリ（`org`、`translated` など）は探索しない。
4. `FullExpansionsConfigs`ディレクトリは探索対象から除外する。
5. 同一カードの通常版・フルアート版など複数バリアントがある場合は、同じディレクトリ直下の対応ファイルをまとめて更新する。
6. エクスパンションが異なる同名カードは個別の設定として扱い、更新時には対象のエクスパンションを明示的に指定する。
7. 既存UI・API（`save-vanilla-card-name` 等）を継続利用しつつ、内部処理のみ CustomExpansionPackImages ベースに差し替える。

## 実装方針
- `electron-main.cjs` からは新たに `cardNameService` を利用してファイル探索・更新を行う。
- `resolveCardNameFiles(baseDir, adminName, expansion)` で対象`.ini`パスの配列を取得。
  - `readCardNameFromIni(filePath)` / `writeCardNameToIni(filePath, newName)` で`Name`行に限定した読み書きを行い、その他の設定値は保持する。
- 検索時は `<Expansion>Configs` 直下のみ `fs.existsSync` で確認し、サブディレクトリを再帰的に辿らない。
- エクスパンションを指定しない取得処理では、該当カードを持つすべてのエクスパンションとその表示名を返す。
- 更新処理では対象エクスパンションを必須とし、存在しない場合はエラーを返す。
- `FullExpansionsConfigs` は最初から候補リストから除外する。
- 保存処理では対象ファイルが1件も見つからない場合にエラーを返し、意図しない新規作成を防止する。
- フロントエンドは既存の `vanilla-card-info.md` で得られる管理名（例: `PiggyA`）をキーに API にアクセスする。API では同名の FullArt ファイルも同時に更新する。
- 画像パスは `cardart/default/<Expansion>/<Rarity>/<管理名>.png` に格納されるため、名前更新時と同じエクスパンション情報を用いて保存先を決定する。

## テスト方針
- Vitest を用いて `cardNameService` の単体テストを作成する。
- 正常系: 通常版と FullArt 版の`.ini`が存在する場合に双方が更新される。
- 重複系: 同名カードが複数エクスパンションに存在する場合、指定したエクスパンションのみ更新される。
- 探索制限: `org` ディレクトリなど探索対象外のファイルは無視される。
- エラー系: 対象ファイルが存在しない場合やエクスパンション指定が曖昧な場合に例外を投げる。
- テストでは一時ディレクトリにダミーの `.ini` を生成し、副作用がプロジェクト配下に残らないようにする。

## 移行時の考慮事項
- 旧来の`BepInEx/plugins/TextureReplacer/objects_data/card`に残っているテキストファイルは参照されなくなるため、必要に応じてバックアップする。
- 既存の名前変更データを引き継ぐ際は、対応する`.ini`の`Name`行に手動で反映する。
