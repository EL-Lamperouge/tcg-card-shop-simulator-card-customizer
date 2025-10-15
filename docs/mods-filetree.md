BepInEx
├── patchers
│   └── TCGShopNewCardsModPreloader
│       ├── Config.ini  ...カードパックごとのカード登録上限を設定するiniファイル
│       ├── MonsterConfigs  ...新規追加するカードのiniファイルを格納するフォルダ
│       │   └── PLACEHOLDER.txt
│       ├── MonsterImages  ...新規追加するカードの画像ファイルを格納するフォルダ
│       │   └── PLACEHOLDER.txt
│       └── TCGShopNewCardsModPreloader.dll
└── plugins
    ├── ArtExpander  ...配下のディレクトリに画像ファイルを格納すると、カードの画像を変更できる
    │   ├── ArtExpander.dll
    │   ├── animated
    │   │   ├── default
    │   │   │   └── Ghost
    │   │   │       ├── GhostBlack
    │   │   │       └── GhostWhite
    │   │   └── foil
    │   │       ├── GhostBlack
    │   │       └── GhostWhite
    │   └── cardart
    │       ├── default
    │       │   ├── Destiny  ...Destinyパックのカードの画像が格納されるフォルダ
    │       │   │   ├── Base
    │       │   │   │   └── foil
    │       │   │   ├── EX
    │       │   │   ├── FirstEdition
    │       │   │   ├── FullArt
    │       │   │   ├── Gold
    │       │   │   └── Silver
    │       │   ├── Ghost  ...Ghostレアリティのカードの画像が格納されるフォルダ
    │       │   │   ├── GhostBlack
    │       │   │   └── GhostWhite
    │       │   ├── Tetramon  ...Tetramonパックのカードの画像が格納されるフォルダ
    │       │   │   ├── Base
    │       │   │   ├── EX
    │       │   │   ├── FirstEdition
    │       │   │   ├── FullArt
    │       │   │   ├── Gold
    │       │   │   └── Silver
    │       │   └── all_expansions
    │       │       ├── Base
    │       │       ├── EX
    │       │       ├── FirstEdition
    │       │       ├── FullArt
    │       │       ├── Gold
    │       │       └── Silver
    │       └── foil
    │           ├── Destiny
    │           │   ├── Base
    │           │   │   └── foil
    │           │   ├── EX
    │           │   ├── FirstEdition
    │           │   ├── FullArt
    │           │   ├── Gold
    │           │   └── Silver
    │           ├── Ghost
    │           │   ├── GhostBlack
    │           │   └── GhostWhite
    │           ├── Tetramon
    │           │   ├── Base
    │           │   ├── EX
    │           │   ├── FirstEdition
    │           │   ├── FullArt
    │           │   ├── Gold
    │           │   └── Silver
    │           └── all_expansions
    │               ├── Base
    │               ├── EX
    │               ├── FirstEdition
    │               ├── FullArt
    │               ├── Gold
    │               └── Silver
    └── CustomExpansionPackImages  ...カード名・テキストの上書き設定を保持
        ├── CustomExpansionPackImages.dll
        └── Configs
            └── Custom
                ├── TetramonConfigs  ...Tetramon系カードの表示テキストを管理。直下の`.ini`のみ参照対象
                │   ├── PiggyA.ini
                │   ├── PiggyAFullArt.ini
                │   └── ...
                ├── DestinyConfigs  ...Destiny系カードの表示テキストを管理
                │   └── ...
                ├── GhostConfigs / CatJobConfigs / MegabotConfigs / FantasyRPGConfigs / NewMonstersConfigs など
                │   └── ...
                └── FullExpansionsConfigs  ...大容量セット。ツールでは探索対象外
