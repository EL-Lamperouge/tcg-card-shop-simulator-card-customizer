#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
from pathlib import Path

# English -> Japanese official names (Gen 1 set used in this repo)
EN_TO_JA = {
    "Bulbasaur": "フシギダネ",
    "Ivysaur": "フシギソウ",
    "Venusaur": "フシギバナ",
    "Charmander": "ヒトカゲ",
    "Charmeleon": "リザード",
    "Charizard": "リザードン",
    "Squirtle": "ゼニガメ",
    "Wartortle": "カメール",
    "Blastoise": "カメックス",
    "Caterpie": "キャタピー",
    "Metapod": "トランセル",
    "Butterfree": "バタフリー",
    "Weedle": "ビードル",
    "Kakuna": "コクーン",
    "Beedrill": "スピアー",
    "Pidgey": "ポッポ",
    "Pidgeotto": "ピジョン",
    "Pidgeot": "ピジョット",
    "Rattata": "コラッタ",
    "Raticate": "ラッタ",
    "Spearow": "オニスズメ",
    "Fearow": "オニドリル",
    "Ekans": "アーボ",
    "Arbok": "アーボック",
    "Pikachu": "ピカチュウ",
    "Raichu": "ライチュウ",
    "Sandshrew": "サンド",
    "Sandslash": "サンドパン",
    "Nidoran♀": "ニドラン♀",
    "Nidorina": "ニドリーナ",
    "Nidoqueen": "ニドクイン",
    "Nidoran♂": "ニドラン♂",
    "Nidorino": "ニドリーノ",
    "Nidoking": "ニドキング",
    "Clefairy": "ピッピ",
    "Clefable": "ピクシー",
    "Vulpix": "ロコン",
    "Ninetales": "キュウコン",
    "Jigglypuff": "プリン",
    "Wigglytuff": "プクリン",
    "Zubat": "ズバット",
    "Golbat": "ゴルバット",
    "Oddish": "ナゾノクサ",
    "Gloom": "クサイハナ",
    "Vileplume": "ラフレシア",
    "Paras": "パラス",
    "Parasect": "パラセクト",
    "Venonat": "コンパン",
    "Venomoth": "モルフォン",
    "Diglett": "ディグダ",
    "Dugtrio": "ダグトリオ",
    "Meowth": "ニャース",
    "Persian": "ペルシアン",
    "Psyduck": "コダック",
    "Golduck": "ゴルダック",
    "Mankey": "マンキー",
    "Primeape": "オコリザル",
    "Growlithe": "ガーディ",
    "Arcanine": "ウインディ",
    "Poliwag": "ニョロモ",
    "Poliwhirl": "ニョロゾ",
    "Poliwrath": "ニョロボン",
    "Abra": "ケーシィ",
    "Kadabra": "ユンゲラー",
    "Alakazam": "フーディン",
    "Machop": "ワンリキー",
    "Machoke": "ゴーリキー",
    "Machamp": "カイリキー",
    "Bellsprout": "マダツボミ",
    "Weepinbell": "ウツドン",
    "Victreebel": "ウツボット",
    "Tentacool": "メノクラゲ",
    "Tentacruel": "ドククラゲ",
    "Geodude": "イシツブテ",
    "Graveler": "ゴローン",
    "Golem": "ゴローニャ",
    "Ponyta": "ポニータ",
    "Rapidash": "ギャロップ",
    "Slowpoke": "ヤドン",
    "Slowbro": "ヤドラン",
    "Magnemite": "コイル",
    "Magneton": "レアコイル",
    "Farfetchd": "カモネギ",  # Files use 'Farfetchd' (no apostrophe)
    "Doduo": "ドードー",
    "Dodrio": "ドードリオ",
    "Seel": "パウワウ",
    "Dewgong": "ジュゴン",
    "Grimer": "ベトベター",
    "Muk": "ベトベトン",
    "Shellder": "シェルダー",
    "Cloyster": "パルシェン",
    "Gastly": "ゴース",
    "Haunter": "ゴースト",
    "Gengar": "ゲンガー",
    "Onix": "イワーク",
    "Drowzee": "スリープ",
    "Hypno": "スリーパー",
    "Krabby": "クラブ",
    "Kingler": "キングラー",
    "Voltorb": "ビリリダマ",
    "Electrode": "マルマイン",
    "Exeggcute": "タマタマ",
    "Exeggutor": "ナッシー",
    "Cubone": "カラカラ",
    "Marowak": "ガラガラ",
    "Hitmonlee": "サワムラー",
    "Hitmonchan": "エビワラー",
    "Lickitung": "ベロリンガ",
    "Koffing": "ドガース",
    "Weezing": "マタドガス",
    "Rhyhorn": "サイホーン",
    "Rhydon": "サイドン",
    "Chansey": "ラッキー",
    "Tangela": "モンジャラ",
    "Kangaskhan": "ガルーラ",
    "Horsea": "タッツー",
    "Seadra": "シードラ",
    "Goldeen": "トサキント",
    "Seaking": "アズマオウ",
    "Staryu": "ヒトデマン",
    "Starmie": "スターミー",
    "Mr. Mime": "バリヤード",  # ref; not present but harmless
    # Gen II and later commonly appearing in tag-team/VSTAR names
    "Mew": "ミュウ",
    "Mewtwo": "ミュウツー",
    "Celebi": "セレビィ",
    "Snivy": "ツタージャ",
    "Snivey": "ツタージャ",  # common misspelling seen in assets
    "Piplup": "ポッチャマ",
    "Lopunny": "ミミロップ",
    "Marshadow": "マーシャドー",
    # Eevee and evolutions
    "Eevee": "イーブイ",
    "Vaporeon": "シャワーズ",
    "Jolteon": "サンダース",
    "Flareon": "ブースター",
    "Espeon": "エーフィ",
    "Umbreon": "ブラッキー",
    "Leafeon": "リーフィア",
    "Glaceon": "グレイシア",
    "Sylveon": "ニンフィア",
    # Kanto legendaries/dragons not yet listed
    "Dratini": "ミニリュウ",
    "Dragonair": "ハクリュー",
    "Dragonite": "カイリュー",
    "Zapdos": "サンダー",
    "Articuno": "フリーザー",
    "Moltres": "ファイヤー",
    # Johto legendaries
    "Raikou": "ライコウ",
    "Entei": "エンテイ",
    "Suicune": "スイクン",
    "Lugia": "ルギア",
    "Ho-Oh": "ホウオウ",
    # Johto lines seen in configs
    "Houndour": "デルビル",
    "Houndoom": "ヘルガー",
    "Slugma": "マグマッグ",
    "Magcargo": "マグカルゴ",
    "Sneasel": "ニューラ",
    "Teddiursa": "ヒメグマ",
    "Ursaring": "リングマ",
    "Phanpy": "ゴマゾウ",
    "Donphan": "ドンファン",
    "Larvitar": "ヨーギラス",
    "Pupitar": "サナギラス",
    "Tyranitar": "バンギラス",
    "Mantine": "マンタイン",
    "Remoraid": "テッポウオ",
    "Octillery": "オクタン",
    "Heracross": "ヘラクロス",
    "Shuckle": "ツボツボ",
    "Qwilfish": "ハリーセン",
    "Kingdra": "キングドラ",
    "Smeargle": "ドーブル",
    "Stantler": "オドシシ",
    "Gligar": "グライガー",
    "Steelix": "ハガネール",
    "Pineco": "クヌギダマ",
    "Forretress": "フォレトス",
    "Snubbull": "ブルー",
    "Granbull": "グランブル",
    "Girafarig": "キリンリキ",
    "Delibird": "デリバード",
    "Miltank": "ミルタンク",
    "Swinub": "ウリムー",
    "Piloswine": "イノムー",
    "Tyrogue": "バルキー",
    "Hitmontop": "カポエラー",
    "Magby": "ブビィ",
    "Smoochum": "ムチュール",
    "Porygon2": "ポリゴン２",
    "Porygon 2": "ポリゴン２",
    # Remaining Gen1/2/3 seen
    "Aerodactyl": "プテラ",
    "Ditto": "メタモン",
    "Kabuto": "カブト",
    "Kabutops": "カブトプス",
    "Electabuzz": "エレブー",
    "Magmar": "ブーバー",
    "Lapras": "ラプラス",
    "Snorlax": "カビゴン",
    "Magikarp": "コイキング",
    "Gyarados": "ギャラドス",
    "Omanyte": "オムナイト",
    "Omastar": "オムスター",
    "Scyther": "ストライク",
    "Pinsir": "カイロス",
    "Porygon": "ポリゴン",
    "Tauros": "ケンタロス",
    "Jynx": "ルージュラ",
    "Wobbuffet": "ソーナンス",
    "Skarmory": "エアームド",
    "Scizor": "ハッサム",
    "Dunsparce": "ノコッチ",
    "Corsola": "サニーゴ",
    "Elekid": "エレキッド",
    "Blissey": "ハピナス",
    "Treecko": "キモリ",
    "Grovyle": "ジュプトル",
    "Zigzagoon": "ジグザグマ",
    "Zangoose": "ザングース",
}


def translate_value(value: str) -> str:
    """Translate Pokémon names within the value, preserving non-name elements.

    Rules:
    - If the entire value equals an English name, replace fully.
    - Otherwise, replace known English names when they appear as whole tokens
      possibly followed by non-letter suffix (e.g., "-GX", " ᴳˣ").
    - Preserve symbols like '&', 'ᴳˣ', hyphens and spacing.
    """
    v = value

    # Fast path: exact match
    if v in EN_TO_JA:
        return EN_TO_JA[v]

    # Replace base-name part when it is followed by optional non-letter suffixes
    # Build a regex that matches any English name at a word boundary
    # Sort by length desc to avoid partial matches (e.g., "Muk" before "M")
    names = sorted(EN_TO_JA.keys(), key=len, reverse=True)
    # Word boundary for ASCII + allow gender symbols
    pattern = r"(" + r"|".join(re.escape(n) for n in names) + r")"

    def _sub_name(m: re.Match) -> str:
        en = m.group(0)
        return EN_TO_JA.get(en, en)

    return re.sub(pattern, _sub_name, v)


def process_file(path: Path) -> bool:
    text = path.read_bytes()
    # Detect line endings per file
    has_crlf = b"\r\n" in text
    newline = "\r\n" if has_crlf else "\n"
    s = text.decode("utf-8")
    changed = False
    out_lines = []
    for line in s.splitlines():
        m = re.match(r"^(Name\s*=\s*)(.*)$", line)
        if m:
            prefix, value = m.group(1), m.group(2)
            new_value = translate_value(value)
            if new_value != value:
                changed = True
            out_lines.append(f"{prefix}{new_value}")
        else:
            out_lines.append(line)
    if changed:
        path.write_text(newline.join(out_lines) + newline, encoding="utf-8")
    return changed


def main():
    root = Path('.')
    total = 0
    changed_files = 0
    for p in sorted(root.rglob('*')):
        if not p.is_file():
            continue
        # Only process text-like files that contain 'Name ='
        try:
            with open(p, 'rb') as fh:
                head = fh.read(4096)
            if b'Name' not in head:
                # quick skip; not definitive but good enough here
                continue
        except Exception:
            continue
        try:
            changed = process_file(p)
            total += 1
            if changed:
                changed_files += 1
                print(f"updated: {p}")
        except UnicodeDecodeError:
            # skip binary
            continue
    print(f"processed_files={total} changed_files={changed_files}")


if __name__ == "__main__":
    main()
