# Mods情報

## 使用mod
- [TCGShopNewCardsMod](https://www.nexusmods.com/tcgcardshopsimulator/mods/200): 新しいカードを追加するmod
- [ArtExpander](https://www.nexusmods.com/tcgcardshopsimulator/mods/417): カードの画像をレアリティごとに変更できるようにするmod
- [TextureReplacer](https://www.nexusmods.com/tcgcardshopsimulator/mods/69): カードの画像やデータを変更できるようにするmod

## ファイル構成
- [BepInEx/mod-filetree.md](./BepInEx/mod-filetree.md)

## TCGShopNewCardsModの設定
- このmodは、`BepInEx/patchers/TCGShopNewCardsModPreloader/MonsterConfigs`配下にカードの設定ファイルを格納することで、カードを追加できる。

## ArtExpanderの設定
- このmodは、`BepInEx/plugins/ArtExpander/cardart`配下の各パック、各レアリティのフォルダにカードの画像を格納することで、カードの画像を変更できる。
- TCGShopNewCardsModで追加したカードについても、このmodでカードの画像を変更できるので、主にこちらを使用する。

## TextureReplacerの設定
- このmodは、`BepInEx/plugins/TextureReplacer/objects_data`配下の設定ファイルを編集することで、バニラ状態で用意されているカードのデータを変更できる。
- バニラで用意されているカードについても名前を変えたりするため、このmodを使用する。

## 各modの説明(原文)
### TCGShopNewCardsMod
```
About this mod
This mod lets you add entirely new cards by creating .ini files for them with the data needed and by having a corresponding image for the "monster".
Example configs are images are included as well as a readme.

WORKING AS OF GAME VERSION V0.52
***There is now a version for use with VORTEX that should fix solve an issues that arose from trying to install it with Vortex previously. Either download and install the Manual version manually or use the Vortex version***

WARNING!! -- DO NOT use this on a save file you care about without making a backup, your save will no longer load without this mod if you have new cards from it either in your binder or on card stands since they would have non existing data

This mod lets you add entirely new cards by creating .ini files for them with the data needed and by having a corresponding image for the "monster".
Example configs are images are included as well as a readme.

I added 5 pokemon cards for my example, Aron, Lairon, Aggron and Entei
Aron, Lairon and Aggron are all apart of the base tetramon pack where as Entei is a part of the Megabot pack(You'll need another mod to access the 3 other expansions but using them is optional)
Aggron was also made to have ghost cards
```

### ArtExpander
```
About this mod
Allows different artwork for destiny cards, custom art for each border type, animated gif cards, custom art for black/white ghost cards, custom art for foil/nonfoil
12/26/2024

ALL MOD AUTHORS NOW HAVE PERMISSION TO RE-BUNDLE ARTEXPANDER.DLL INTO THEIR MODS. You still have to list ArtExpander in your requirements, make sure to credit me. other than that, you may redistribute on TesNexus or Thunderstore.

This mod probably wont receive any more bugfixes or features for a while. 

MERRY CHRISTMAS EVERYONE AND THANK YOU SO MUCH FOR THE 35,000 UNIQUE DOWNLOADS (that's insane). I love this community.

THIS MOD ADDS NO NEW ARTWORK - IT SIMPLY ALLOWS EVERY CARD TO HAVE UNIQUE ART, AND GHOST CARDS TO HAVE ANIMATIONS
Possible Things you can do with this mod:

- Use 2+ artwork mods at once, 1 for tetramon and 1 artwork mod installed for Destiny

- Add Animated gifs to ghost cards

- Add unique art for EVERY individual card in the game - 2600+ total art just for Tetramon + Destiny
﻿- Unique art for every border (silver/gold/ex/fullart)
﻿- unique art for foil/nonfoil
﻿- Or just separate the art for Tetramon vs Destiny versions
﻿- Different art for black ghost vs white ghost cards
﻿- Up to 48 unique artworks per Monster - have 48 different Piggy's! 

How to Install
Extract to TCG Card Shop Simulator/Bepinex

your folders should look like
- TCG Card Shop Simulator/BepInEx/plugins/ArtExpander/ArtExpander.dll
- TCG Card Shop Simulator/BepInEx/plugins/ArtExpander/cardart
- TCG Card Shop Simulator/BepInEx/plugins/ArtExpander/animated

You can now store an asset bundle for images in ArtExpander/cardart.assets
Animated bundles can be stored in ArtExpander/animated.assets

To build asset bundles (Mod Authors only):
1. Make sure your cardart and animated folders are correct, your mod should work without bundles.
2. Install Unity
3. Download "ArtExpanderAssetBuilder.zip"
4. Extract and Open this project in Unity
4. Drag & drop your animated and cardart folders to 'assets'
5. Tools=>"Process Textures and Create Bundles"
6. Move your cardart.assets and animated.assets files to BepinEx/plugins/ArtExpander

Asset Bundling will greatly improve performance for large numbers of cards.

Unity asset bundle detailed tutorial can be found at the bottom of this page.

How to Add Custom Artwork

Add your artwork to the 'cardart' folder. .png iles must have the correct assetname, you shouldn't need to rename png files from other art replacer mods. 

The plugin searches for the correct expansion, border, monster, and foil variant. It searches from most specific -> least specific, and uses the first image it finds. The order of the folders does not matter. The included folder structure is just a suggestion.

Artwork Priority Order:
Foil, Monster, expansion, border (cardart/Destiny/foil/Gold/PiggyA.png)
Foil, Monster, expansion (cardart/Foil/Destiny/PiggyA.png)
Foil, Monster, border (cardart/foil/all_expansions/Gold/PiggyA.png)
Foil, Monster (cardart/all_expansions/foil/PiggyA.png)

Monster, expansion, border (Destiny/Gold/PiggyA.png)
Monster, expansion (Destiny/PiggyA.png)
Monster, border (all_expansions/Gold/PiggyA.png)
Monster (all_expansions/PiggyA.png)

Then it defaults to the texture replacer if you have it installed, then to the base game after that.

The mod checks the name of each folder in the path to determine what art to replace.
This lets you somewhat organize folders to your preference.

Valid BorderType folder names:
    Base
    FirstEdition
    Silver
    Gold
    EX,
    FullArt
    GhostWhite
    GhostBlack

Valid Expansion Names:
﻿all_expansions
﻿Tetramon
﻿Destiny
﻿Megabot
﻿FantasyRPG
﻿CatJob
﻿Ghost
﻿
Example:
Destiny/FullArt/PiggyA.png
Destiny/PiggyA.png
all_expansions/EX/PiggyA.png

This would result in:
- Custom art for FullArt Destiny Pigni
- Different custom artwork for all OTHER Destiny piggies
- 3rd custom art for Tetramon EX Piggies
- The texturereplacer or default game Piggy for all other piggies. 


How to add Animated Cards

1. Number your cards as frames. Gifs run at 10fps. 1.png, 2.png, 3.png... place them into a folder
2. Place the frames into:
﻿* animated/PiggyD_white or GhostWhite/PiggyD for a white ghost only animation
﻿* or into a folder called PiggyA for an animation that replaces black and white ghost variants
﻿* or into foil/PiggyD to replace only foil variants of Piggy
﻿* foil/PiggyD_white or foil/GhostWhite/PiggyD or GhostWhite/foil/PiggyD for a foil-white-specific animation.

Example: TCG Card Shop Simulator\BepInEx\plugins\ArtExpander\cardart\Ghost\animated\PiggyD_white\1.png

gifs run at 10fps and take about 20mb of memory each. Suggest you use 512x256 or smaller resolution gifs.

Strongly recommended to test with loose .png files, then pack into a .assets bundle for better performance.

You must also put the first frame into cardart in the correct location (cardart/Ghost/GhostWhite  or cardart/ghost/GhostBlack or cardart/Ghost or cardart/foil/Ghost etc) exactly like you would normally do when using this mod for non-animated cards.

These cards work correctly with holofoil effects and transparencies just like regular ghost cards do. If your gifs have transparency, the white/black background will come through.

Known Issues
- 'evolves from' icons dont quite work right'. Unless you use a texture replacer, will use the base game 'evolves from'

Compatibility

- TextureReplacer

- Add Entirely New cards (in theory. someone test this please.)

- More Card Expansions expansions (in theory, someone please test)

- all future card expansions (hypothetically)

Credits

RoyalBae for help and inspiration.

Credit for the example artwork goes to: https://www.nexusmods.com/tcgcardshopsimulator/mods/269

and the amazing artist Kylix_lol
```
### TextureReplacer
```
About this mod
A simple mod with which you can easily replace textures, meshes and data
You need BepInEx


Download the mod, open it and drag&drop the folder 'TextureReplacer' to:
TCG Card Shop Simulator\BepInEx\plugins\
https://i.imgur.com/OpSaGv5.png
https://i.imgur.com/PlPaCVI.png


Optional you can download Examples for it (Under Files/Optional Files).


THE FOLDERS:
TCG Card Shop Simulator\BepInEx\plugins\TextureReplacer\TextureReplacer.dll

Names and/or descriptions (.txt files):
TCG Card Shop Simulator\BepInEx\plugins\TextureReplacer\objects_data\cards\
TCG Card Shop Simulator\BepInEx\plugins\TextureReplacer\objects_data\figurines\

Meshes (.obj files): (you can create subfolders for more organization)
TCG Card Shop Simulator\BepInEx\plugins\TextureReplacer\objects_meshes\*anyfolders*

Textures (.png files): (you can create subfolders for more organization)
TCG Card Shop Simulator\BepInEx\plugins\TextureReplacer\objects_textures\*anyfolders*

Short Tutorial for Modders:

1. Start AssetStudioGUI
2. Click on File=>Load folder and select the gamedata folder:
   TCG Card Shop Simulator\Card Shop Simulator_Data\
3. Click on Filter Type=> and select Texture2D and Mesh
4. Go to the Tab 'Asset List' and select everything
   (click on the first entry, scroll down and click with holding Shift-Key the last entry)
5. Rightclick on the selected list and choose 'Export selected assets'
6. Choose a folder to extract (not the game folders!). For example, create a new folder on the Desktop
7. This takes a while.. after you have then a Texture2D and Mesh Folder


How to change a Texture?
Copy any texture file (png) in to the folder:
TCG Card Shop Simulator\BepInEx\plugins\TextureReplacer\objects_textures\
(you can create subfolders for more organization)
and edit it as you want!

How to change a Mesh?
Copy any mesh file (obj) in to the folder:
TCG Card Shop Simulator\BepInEx\plugins\TextureReplacer\objects_meshes\
(you can create subfolders for more organization)
and edit it as you want!


In-game, you can reload the Textures with F5 (the Default).
But be careful and try not to click with your mouse while loading!



SOME HELP:
'Play Table' Template (Thanks to CXANEL﻿)
table template link
https://gofile.io/d/lp2yMY

card box template
https://gofile.io/d/q106pb

https://i.ibb.co/FYn455S/2024-10-25-021148.png
https://i.ibb.co/gyx0M9R/2024-10-25-023549.png﻿
https://i.ibb.co/KKxYn4c/147-1729103044-1208625468.png


Some .png have random functions:
-Main Menu background: GameStartBG_Blur.png (GameStartBG_Blur2.png, GameStartBG_Blur3.png)
-Smartphone background: PhoneBG.png (PhoneBG2.png, PhoneBG3.png)
-The Card in loading Screen: CardBack.png (CardBack2.png, CardBack3.png etc)
-The Customers play table: wood1.png (wood2.png, wood3.png) or PlayTable_wood (PlayTable_wood2, PlayTable_wood3 etc)
-The customers Credit Card: credit_card_D.png (credit_card_D2.png, credit_card_D3.png)
-The building billboard in the end of the main street: mcp_building_32_billboards_d.png (mcp_building_32_billboards_d2.png, mcp_building_32_billboards_d3.png)


Big Statues have their own meshes & textures now:
﻿MonsterStatue_BatD_Mesh
MonsterStatue_Bear_Mesh
MonsterStatue_Bear2_Mesh
MonsterStatue_Beetle_Mesh
MonsterStatue_Beetle2_Mesh
MonsterStatue_BugA_Mesh
MonsterStatue_BugB_Mesh
MonsterStatue_BugC_Mesh
MonsterStatue_BugD_Mesh
MonsterStatue_DragonEarth_Mesh
MonsterStatue_DragonFire_Mesh
MonsterStatue_DragonThunder_Mesh
MonsterStatue_DragonWater_Mesh
MonsterStatue_FireWolfA_Mesh
MonsterStatue_FireWolfB_Mesh
MonsterStatue_FireWolfC_Mesh
MonsterStatue_FireWolfC2_Mesh
MonsterStatue_FireWolfD_Mesh
MonsterStatue_FoxD_Mesh
MonsterStatue_GolemA_Mesh
MonsterStatue_PiggyA_Mesh
MonsterStatue_PiggyB_Mesh
MonsterStatue_PiggyC_Mesh
MonsterStatue_PiggyD_Mesh
MonsterStatue_PiggyD2_Mesh
MonsterStatue_ShellfishD_Mesh
MonsterStatue_ShinyBugA_Mesh
MonsterStatue_ShinyGolemA_Mesh
MonsterStatue_ShinyPiggyA_Mesh
MonsterStatue_ShinyStarfishA_Mesh
MonsterStatue_StarfishA_Mesh
MonsterStatue_StarfishD_Mesh
MonsterStatue_TreeD_Mesh
MonsterStatue_Wisp_Mesh
MonsterStatue_Wisp2_Mesh

Textures same names but without _Mesh, for example ﻿MonsterStatue_BatD.png

If the statue has a podium:
Mesh:
MonsterStatue_BatD_Podium_Mesh
﻿
If the statue has a second podium:
Mesh:
MonsterStatue_BatD_Podium_Mesh2

Texture:
Textures same names but without _Mesh, for example ﻿MonsterStatue_BatD_Podium.png
(you have to create your own texture; the vanilla podium has only colors and no texture)
Same for the second podium ﻿MonsterStatue_BatD_Podium2.png

If you are a modder and use reload (F5), you must replace the statue to see the effect.

The mod uses Runtime OBJ Importer:
https://assetstore.unity.com/packages/tools/modeling/runtime-obj-importer-49547
```