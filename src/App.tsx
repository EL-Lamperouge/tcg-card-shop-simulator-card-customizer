import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Input,
  Select,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Text,
  Pagination,
  Container,
  HStack,
  Modal,
  useDisclosure,
  Grid,
  VStack,
  Option,
} from '@yamada-ui/react';
import ini from 'ini';

// ElectronのipcRendererを取得
const ipcRenderer = (window as any).require ? (window as any).require('electron').ipcRenderer : undefined;

type IniFile = { path: string; content: string };
type ImageInfo = { imgPath: string; pack: string; rarity: string; name: string };
type CardInfo = { name: string; id: string; pack: string; rarity: string; image: string; monsterType: string; displayName: string };

// バニラカード情報の型
interface VanillaCardInfo {
  name: string;
  id: string;
  attribute: string;
  adminName: string; // 管理名
  displayName: string; // 現在の表示名
}

const RARITIES = ['Base', 'FirstEdition', 'Silver', 'Gold', 'EX', 'FullArt'];
const PLACEHOLDER_IMG = 'https://placehold.jp/a8a8a8/ffffff/250x350.png?text=No%20Image';
const PAGE_SIZE = 120;

function guessPackFromIniPath(path: string): string {
  // 例: .../MonsterConfigs/Tetramon_Aron.ini → Tetramon
  const m = /MonsterConfigs[\\/]([^_]+)_/.exec(path);
  return m ? m[1] : '';
}

// バニラカード情報をパースし、displayNameも付与する関数
async function fetchVanillaCardsWithDisplayName(baseDir: string | null): Promise<VanillaCardInfo[]> {
  if (!ipcRenderer) return [];
  const mdPath = await ipcRenderer.invoke('get-vanilla-card-info-path');
  const content = await ipcRenderer.invoke('read-file', mdPath);
  const lines = content.split('\n');
  const tableLines = lines.filter((line: string) => line.startsWith('|'));
  const dataLines = tableLines.slice(2);
  const vanillaList = await Promise.all(dataLines.map(async (line: string) => {
    const [empty, name, id, attribute, adminName] = line.split('|').map((s: string) => s.trim());
    if (!name || !id || !attribute || !adminName) return null;
    let displayName = name;
    if (baseDir) {
      try {
        const customName = await ipcRenderer.invoke('get-vanilla-card-display-name', { baseDir, name, attribute });
        if (customName && customName.trim() !== '') displayName = customName.trim();
      } catch { }
    }
    return { name, id, attribute, adminName, displayName };
  }));
  return vanillaList.filter(Boolean) as VanillaCardInfo[];
}

function App() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [iniCards, setIniCards] = useState<CardInfo[]>([]);
  const [vanillaCards, setVanillaCards] = useState<VanillaCardInfo[]>([]);
  const [imageInfoList, setImageInfoList] = useState<ImageInfo[]>([]);
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardInfo | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [baseDir, setBaseDir] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingRarity, setPendingRarity] = useState<string | null>(null);
  // 名前編集用のローカルステート
  const [editName, setEditName] = useState<string>('');
  // レアリティ編集用のローカルステート
  const [editRarity, setEditRarity] = useState<string>('Common');
  // ドラッグ中のレアリティを管理
  const [dragOverRarity, setDragOverRarity] = useState<string | null>(null);

  // 起動時にLocalStorageからbaseDirを取得し、自動ロード
  useEffect(() => {
    const savedDir = localStorage.getItem('baseDir');
    if (savedDir) {
      setBaseDir(savedDir);
      refreshCardData(savedDir);
    } else {
      // baseDir未設定なら自動でディレクトリ選択を促す
      handleSelectDirectory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // モーダルを開くたびに名前・レアリティ初期化
  useEffect(() => {
    if (isOpen && selectedCard) {
      setEditName(selectedCard.name);
      setEditRarity(selectedCard.rarity || 'Common');
    }
  }, [isOpen, selectedCard]);

  // 検索キーワード変更時はページを1にリセット
  useEffect(() => {
    setPage(1);
  }, [search]);

  // データ再取得用（baseDirを使う）
  const refreshCardData = async (dir: string) => {
    if (!ipcRenderer) return;
    const files = await ipcRenderer.invoke('get-card-files', dir);
    // iniファイルをパース
    const iniCards: CardInfo[] = files.iniFiles.flatMap((f: IniFile) => {
      const parsed = ini.parse(f.content) as Record<string, any>;
      return Object.entries(parsed).map(([section, data]) => {
        let pack = data['Pack'] || '';
        if (!pack) pack = guessPackFromIniPath(f.path);
        if (!pack) pack = 'Tetramon';
        return {
          name: data.Name || section,
          id: data['Monster Type ID'] || '',
          pack,
          rarity: data['Rarity'] || '',
          image: '', // 後で紐付け
          monsterType: data['Monster Type'] || section,
          displayName: data.Name || section, // 追加カードはNameをそのまま
        };
      });
    });
    setIniCards(iniCards);
    // バニラカード取得
    const vanilla = await fetchVanillaCardsWithDisplayName(dir);
    setVanillaCards(vanilla);
    // 画像ファイルのパスからパック・レアリティ・カード名を抽出
    const imageInfo: ImageInfo[] = files.imageFiles.map((imgPath: string) => {
      const parts = imgPath.split(/[/\\]/);
      const idx = parts.lastIndexOf('default');
      const pack = parts[idx + 1] || '';
      const rarity = parts[idx + 2] || '';
      const file = parts[idx + 3] || '';
      const name = file.replace(/\.(png|jpg|jpeg)$/i, '');
      return { imgPath, pack, rarity, name };
    });
    setImageInfoList(imageInfo);
  };

  // iniCards, vanillaCards, imageInfoListが揃ったらカード画像を紐付けてセット
  useEffect(() => {
    if (!iniCards || !vanillaCards || !imageInfoList) return;
    const attachImage = (card: CardInfo): CardInfo => {
      let key = card.monsterType;
      if (card.pack === 'Vanilla') {
        const vanilla = vanillaCards.find(v => v.name === card.name && v.id === card.id);
        if (vanilla) key = vanilla.adminName;
      }
      const found = imageInfoList.find(img => img.pack === card.pack && img.rarity === 'Base' && img.name === key);
      return { ...card, image: found ? found.imgPath : '' };
    };
    const mergedCards = [
      ...iniCards,
      ...vanillaCards.map(v => ({
        name: v.name,
        id: v.id,
        pack: 'Vanilla',
        rarity: '',
        image: '',
        monsterType: v.name,
        displayName: v.displayName,
      }))
    ]
      .map(attachImage)
      .sort((a, b) => Number(a.id) - Number(b.id));
    setCards(mergedCards);
  }, [iniCards, vanillaCards, imageInfoList]);

  // ディレクトリ選択時のみダイアログを出す
  const handleSelectDirectory = async () => {
    if (!ipcRenderer) {
      alert('Electron環境でのみ利用可能です');
      return;
    }
    const dir = await ipcRenderer.invoke('select-directory');
    if (dir) {
      setBaseDir(dir);
      localStorage.setItem('baseDir', dir);
      await refreshCardData(dir);
    }
  };

  // カードクリック時の詳細モーダル表示
  const handleCardClick = (card: CardInfo) => {
    setSelectedCard(card);
    onOpen();
  };

  // 画像選択ダイアログを開いて画像を保存する
  const handleImageClick = async (rarity: string) => {
    setPendingRarity(rarity);
    if (!ipcRenderer || !selectedCard || !baseDir) return;
    // Electronのselect-image-fileダイアログを開く
    const filePath = await ipcRenderer.invoke('select-image-file');
    if (!filePath) {
      setPendingRarity(null);
      return;
    }
    // ファイルを読み込んで保存処理へ
    const fs = (window as any).require ? (window as any).require('fs') : undefined;
    if (!fs) {
      alert('ファイル読み込みに失敗しました');
      setPendingRarity(null);
      return;
    }
    const buffer = Array.from(fs.readFileSync(filePath));
    const { pack, name } = getImageSaveParams(selectedCard, rarity);
    const res = await ipcRenderer.invoke('save-card-image', {
      baseDir,
      pack,
      rarity,
      name,
      buffer,
    });
    if (res.success) {
      await refreshCardData(baseDir);
    } else {
      alert('画像保存に失敗しました: ' + res.error);
    }
    setPendingRarity(null);
  };

  // 画像保存時のパラメータ決定
  const getImageSaveParams = (card: CardInfo, rarity: string): { pack: string; name: string } => {
    if (card.pack === 'Vanilla') {
      const vanilla = vanillaCards.find(v => v.name === card.name && v.id === card.id);
      return { pack: 'Vanilla', name: vanilla?.adminName || card.name };
    } else {
      return { pack: 'Tetramon', name: card.monsterType };
    }
  };

  // 名前保存処理
  const handleSaveName = async () => {
    if (!selectedCard || !baseDir) return;
    if (selectedCard.pack === 'Vanilla') {
      const vanilla = vanillaCards.find(v => v.name === selectedCard.name && v.id === selectedCard.id);
      if (!vanilla) {
        alert('バニラカード情報が見つかりません');
        return;
      }
      const res = await ipcRenderer.invoke('save-vanilla-card-name', {
        baseDir,
        name: selectedCard.name,
        attribute: vanilla.attribute,
        newName: editName,
      });
      if (!res.success) {
        alert('保存に失敗しました: ' + res.error);
        return;
      }
    } else {
      // 追加カード: iniファイルパス・セクション名を特定
      const iniDir = `${baseDir}/BepInEx/patchers/TCGShopNewCardsModPreloader/MonsterConfigs`;
      const iniFileName = `${selectedCard.monsterType}.ini`;
      const iniPath = `${iniDir}/${iniFileName}`;
      // iniファイルから実際のセクション名を取得
      let section = selectedCard.name;
      try {
        const iniContent = await ipcRenderer.invoke('read-file', iniPath);
        const parsed = ini.parse(iniContent);
        section = Object.keys(parsed)[0] || selectedCard.name;
      } catch (e) { }
      // NameとRarityを書き換え
      const res = await ipcRenderer.invoke('save-ini-card-name', {
        iniPath,
        section,
        newName: editName,
        newRarity: editRarity,
      });
      if (!res.success) {
        alert('保存に失敗しました: ' + res.error);
        return;
      }
    }
    await refreshCardData(baseDir);
    onClose();
  };

  // 詳細画面で画像名を取得する関数
  const getImageName = (card: CardInfo) => {
    if (card.pack === 'Vanilla') {
      const vanilla = vanillaCards.find(v => v.name === card.name && v.id === card.id);
      return vanilla?.adminName || card.name;
    }
    return card.monsterType;
  };

  // iniテンプレート生成関数
  function generateIniContent(cardName: string, id: number): string {
    return `[${cardName}]
Artist Name = ArtistName
Description = Added card.
Effect Amount = (1.5, 1.0, 0.7)
Element Index = Earth
Monster Type = ${cardName}
Monster Type ID = ${id}
Name = ${cardName}
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
`;
  }

  const handleAddCards = async () => {
    if (!ipcRenderer || !baseDir) {
      alert('ディレクトリを選択してください');
      return;
    }
    // 複数画像ファイル選択
    const filePaths: string[] = await ipcRenderer.invoke('select-image-files');
    if (!filePaths || filePaths.length === 0) return;

    // 既存IDリストを作成
    const usedIds = new Set<number>();
    iniCards.forEach(card => { if (card.id) usedIds.add(Number(card.id)); });
    vanillaCards.forEach(card => { if (card.id) usedIds.add(Number(card.id)); });

    // 空きIDを画像枚数分採番
    const getNextIds = (count: number) => {
      const ids: number[] = [];
      let id = 1;
      while (ids.length < count) {
        if (!usedIds.has(id)) ids.push(id);
        id++;
      }
      return ids;
    };
    const nextIds = getNextIds(filePaths.length);

    // fs取得
    const fs = (window as any).require ? (window as any).require('fs') : undefined;
    if (!fs) {
      alert('ファイル保存に失敗しました（fs取得失敗）');
      return;
    }

    // 画像・iniファイル保存
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i];
      const id = nextIds[i];
      const cardName = `c${id}`;
      // 画像保存
      const buffer = Array.from(fs.readFileSync(filePath));
      let saveError: string | null = null;
      for (const rarity of RARITIES) {
        const res = await ipcRenderer.invoke('save-card-image', {
          baseDir,
          pack: 'Tetramon',
          rarity,
          name: cardName,
          buffer,
        });
        if (!res.success) {
          saveError = res.error;
          break;
        }
      }
      if (saveError) {
        alert(`画像保存に失敗しました: ${saveError}`);
        continue;
      }
      // iniファイル保存
      const iniDir = `${baseDir}/BepInEx/patchers/TCGShopNewCardsModPreloader/MonsterConfigs`;
      if (!fs.existsSync(iniDir)) fs.mkdirSync(iniDir, { recursive: true });
      const iniPath = `${iniDir}/${cardName}.ini`;
      const iniContent = generateIniContent(cardName, id);
      fs.writeFileSync(iniPath, iniContent, 'utf-8');
    }

    // 一覧リフレッシュ
    await refreshCardData(baseDir);
    alert('カード追加が完了しました');
  };

  // ドロップ処理
  const handleImageDrop = async (e: React.DragEvent, rarity: string) => {
    e.preventDefault();
    setDragOverRarity(null);
    if (!ipcRenderer || !selectedCard || !baseDir) return;
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const { pack, name } = getImageSaveParams(selectedCard, rarity);
    const res = await ipcRenderer.invoke('save-card-image', {
      baseDir,
      pack,
      rarity,
      name,
      buffer: Array.from(new Uint8Array(buffer)),
    });
    if (res.success) {
      await refreshCardData(baseDir);
    } else {
      alert('画像保存に失敗しました: ' + res.error);
    }
  };

  return (
    <Box p="md">
      <Flex as="header" justify="space-between">
        <Heading size="sm">カード一覧</Heading>
        <Button colorScheme="primary" size="sm" onClick={handleSelectDirectory}>ディレクトリ選択</Button>
      </Flex>
      <Container maxW="container.lg" p="md">
        <Flex gap={4} mb={4} justify="space-between">
          <HStack>
            <Input
              placeholder="検索"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              w="200px"
            />
            <Button colorScheme="primary" size="sm" onClick={handleAddCards}>カード追加</Button>
          </HStack>
        </Flex>
        <SimpleGrid columns={6} gap={4}>
          {(() => {
            // 検索フィルタ処理
            const filteredCards = search.trim() === ''
              ? cards
              : cards.filter(card => {
                const keyword = search.trim().toLowerCase();
                return (
                  card.displayName.toLowerCase().includes(keyword) ||
                  card.id.toLowerCase().includes(keyword) ||
                  card.monsterType.toLowerCase().includes(keyword)
                );
              });
            const totalPages = Math.ceil(filteredCards.length / PAGE_SIZE);
            const pagedCards = filteredCards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
            return pagedCards.map(card => (
              <Card key={card.id || card.monsterType} onClick={() => handleCardClick(card)} cursor="pointer">
                <CardBody>
                  <Box>
                    <Image src={card.image ? `file://${encodeURI(card.image.replace(/\\/g, '/'))}` : PLACEHOLDER_IMG} alt={card.monsterType} borderRadius="md" objectFit="cover" w="100%" h="100%" />
                  </Box>
                  <Text fontWeight="bold">{card.displayName}</Text>
                  <Text fontSize="sm" color="gray.500">ID: {card.id}</Text>
                  <Text fontSize="sm" color="gray.400">レアリティ: {card.rarity}</Text>
                </CardBody>
              </Card>
            ));
          })()}
        </SimpleGrid>
        <Flex justify="center" mt={6}>
          {(() => {
            const filteredCards = search.trim() === ''
              ? cards
              : cards.filter(card => {
                const keyword = search.trim().toLowerCase();
                return (
                  card.displayName.toLowerCase().includes(keyword) ||
                  card.id.toLowerCase().includes(keyword) ||
                  card.monsterType.toLowerCase().includes(keyword)
                );
              });
            const totalPages = Math.ceil(filteredCards.length / PAGE_SIZE);
            return (
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                colorScheme="primary"
              />
            );
          })()}
        </Flex>
      </Container>

      {/* カード詳細モーダル */}
      <Modal open={isOpen} onClose={onClose} size="5xl">
        <Flex bg="white" borderRadius="md" p={6} gap={4}>
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="bold" fontSize="lg">
                {selectedCard?.displayName}（ID: {selectedCard?.id}）
              </Text>
            </Flex>
            {/* 名前編集ボックス */}
            <Box mb={4}>
              <Text fontSize="sm" color="gray.600" mb={1}>カード名</Text>
              <Input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                w="300px"
                onKeyDown={e => { if (e.key === 'Enter' && !(e as any).isComposing) handleSaveName(); }}
              />
            </Box>
            {/* レアリティ編集プルダウン（追加カードのみ） */}
            {selectedCard && Number(selectedCard.id) > 122 && (
              <Box mb={4}>
                <Text fontSize="sm" color="gray.600" mb={1}>レアリティ</Text>
                <Select w="200px" value={editRarity} onChange={setEditRarity}>
                  <Option value="Common">Common</Option>
                  <Option value="Rare">Rare</Option>
                  <Option value="Epic">Epic</Option>
                  <Option value="Legendary">Legendary</Option>
                </Select>
              </Box>
            )}
            <Grid templateColumns="repeat(3, 1fr)" gap="md">
              {RARITIES.map(rarity => {
                const img = selectedCard ? imageInfoList.find(img =>
                  img.name === getImageName(selectedCard) &&
                  img.rarity === rarity &&
                  img.pack === selectedCard.pack
                ) : undefined;
                return (
                  <VStack key={rarity} align="center" gap={4}>
                    <Text w="120px" textAlign="center">{rarity}</Text>
                    <Box
                      w="120px"
                      onClick={() => handleImageClick(rarity)}
                      onDragOver={e => { e.preventDefault(); setDragOverRarity(rarity); }}
                      onDragLeave={e => { e.preventDefault(); setDragOverRarity(null); }}
                      onDrop={e => handleImageDrop(e, rarity)}
                      cursor="pointer"
                      border={dragOverRarity === rarity ? '2px solid #3182ce' : '1px solid #e2e8f0'}
                      borderRadius="md"
                      transition="border 0.2s"
                    >
                      <Image
                        src={img ? `file://${encodeURI(img.imgPath.replace(/\\/g, '/'))}?t=${Date.now()}` : PLACEHOLDER_IMG}
                        alt={getImageName(selectedCard || { name: '', pack: '', id: '', rarity: '', image: '', monsterType: '', displayName: '' }) + ' ' + rarity}
                        boxSize="120px"
                        borderRadius="md"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                      />
                    </Box>
                  </VStack>
                );
              })}
            </Grid>
            {/* 保存ボタン */}
            <Flex justify="flex-end" mt={6}>
              <Button colorScheme="primary" onClick={handleSaveName}>保存</Button>
            </Flex>
          </Box>

          {/* 全レアリティ一括画像保存領域 */}
          <Box mt={8} p={4} border="1px solid #e2e8f0" borderRadius="md" bg="#f9fafb">
            <Text fontWeight="bold" mb={2}>全レアリティに同じ画像を一括保存</Text>
            <Text fontSize="sm" color="gray.600" mb={2}>下の領域に画像をドラッグ＆ドロップ、またはボタンから画像を選択すると、全レアリティに同じ画像が保存されます。</Text>
            <Flex align="center" gap={4}>
              <Box
                w="180px"
                h="120px"
                border={dragOverRarity === 'ALL' ? '2px solid #3182ce' : '1px dashed #a0aec0'}
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="#fff"
                onDragOver={e => { e.preventDefault(); setDragOverRarity('ALL'); }}
                onDragLeave={e => { e.preventDefault(); setDragOverRarity(null); }}
                onDrop={async e => {
                  e.preventDefault(); setDragOverRarity(null);
                  if (!ipcRenderer || !selectedCard || !baseDir) return;
                  const file = e.dataTransfer.files[0];
                  if (!file) return;
                  const buffer = await file.arrayBuffer();
                  for (const rarity of RARITIES) {
                    const { pack, name } = getImageSaveParams(selectedCard, rarity);
                    const res = await ipcRenderer.invoke('save-card-image', {
                      baseDir,
                      pack,
                      rarity,
                      name,
                      buffer: Array.from(new Uint8Array(buffer)),
                    });
                    if (!res.success) {
                      alert('画像保存に失敗しました: ' + res.error);
                      return;
                    }
                  }
                  await refreshCardData(baseDir);
                  alert('全レアリティに画像を保存しました');
                }}
                cursor="pointer"
                transition="border 0.2s"
              >
                <Text color="#a0aec0">画像をドロップ</Text>
              </Box>
              <Button
                colorScheme="primary"
                onClick={async () => {
                  if (!ipcRenderer || !selectedCard || !baseDir) return;
                  const filePath = await ipcRenderer.invoke('select-image-file');
                  if (!filePath) return;
                  const fs = (window as any).require ? (window as any).require('fs') : undefined;
                  if (!fs) { alert('ファイル読み込みに失敗しました'); return; }
                  const buffer = Array.from(fs.readFileSync(filePath));
                  for (const rarity of RARITIES) {
                    const { pack, name } = getImageSaveParams(selectedCard, rarity);
                    const res = await ipcRenderer.invoke('save-card-image', {
                      baseDir,
                      pack,
                      rarity,
                      name,
                      buffer,
                    });
                    if (!res.success) {
                      alert('画像保存に失敗しました: ' + res.error);
                      return;
                    }
                  }
                  await refreshCardData(baseDir);
                  alert('全レアリティに画像を保存しました');
                }}
              >画像を選択して一括保存</Button>
            </Flex>
          </Box>
        </Flex>
      </Modal>
    </Box>
  );
}

export default App;
