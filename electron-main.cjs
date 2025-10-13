const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const ini = require('ini');

const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // ディレクトリ選択ダイアログAPI
  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });

  // ディレクトリ配下のini/画像ファイル取得API
  ipcMain.handle('get-card-files', async (_event, baseDir) => {
    if (!baseDir) return { iniFiles: [], imageFiles: [] };
    // iniファイル: MonsterConfigs直下のみ
    const iniDir = path.join(baseDir, 'BepInEx', 'patchers', 'TCGShopNewCardsModPreloader', 'MonsterConfigs');
    let iniFiles = [];
    if (fs.existsSync(iniDir)) {
      iniFiles = fs.readdirSync(iniDir)
        .filter(f => f.endsWith('.ini'))
        .map(f => path.join(iniDir, f));
    }
    // 画像ファイル: cardart/default配下を再帰的に
    const imageBaseDir = path.join(baseDir, 'BepInEx', 'plugins', 'ArtExpander', 'cardart', 'default');
    function walkImages(dir) {
      let results = [];
      if (!fs.existsSync(dir)) return results;
      const list = fs.readdirSync(dir, { withFileTypes: true });
      for (const file of list) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
          results = results.concat(walkImages(filePath));
        } else if (/\.(png|jpg|jpeg)$/i.test(file.name)) {
          results.push(filePath);
        }
      }
      return results;
    }
    const imageFiles = walkImages(imageBaseDir);
    // iniファイルは内容も返す
    const iniData = iniFiles.map(f => ({
      path: f,
      content: fs.readFileSync(f, 'utf-8'),
    }));
    return { iniFiles: iniData, imageFiles };
  });

  // カード画像保存API（バニラカード対応: pack=Vanilla, name=管理名）
  ipcMain.handle('save-card-image', async (_event, { baseDir, pack, rarity, name, buffer }) => {
    try {
      if (!baseDir || !pack || !rarity || !name || !buffer) throw new Error('パラメータ不足');
      const saveDir = path.join(baseDir, 'BepInEx', 'plugins', 'ArtExpander', 'cardart', 'default', pack, rarity);
      if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
      const savePath = path.join(saveDir, name + '.png');
      fs.writeFileSync(savePath, Buffer.from(buffer));
      return { success: true, path: savePath };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  // vanilla-card-info.mdの絶対パスを返すAPI
  ipcMain.handle('get-vanilla-card-info-path', async () => {
    // プロジェクトルートからの相対パス
    return path.join(__dirname, 'docs', 'vanilla-card-info.md');
  });

  // 任意パスのテキストファイル内容を返すAPI
  ipcMain.handle('read-file', async (_event, filePath) => {
    if (!filePath || !fs.existsSync(filePath)) return '';
    return fs.readFileSync(filePath, 'utf-8');
  });

  // バニラカード名保存API
  ipcMain.handle('save-vanilla-card-name', async (_event, { baseDir, name, attribute, newName }) => {
    try {
      if (!baseDir || !name || !attribute || !newName) throw new Error('パラメータ不足');
      const saveDir = path.join(baseDir, 'BepInEx', 'plugins', 'TextureReplacer', 'objects_data', 'card');
      if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });
      const savePath = path.join(saveDir, `${name}_${attribute}_NAME.txt`);
      fs.writeFileSync(savePath, newName, 'utf-8');
      return { success: true, path: savePath };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  // 追加カード名保存API（iniファイルのNameのみ書き換え、他は変更しない）
  ipcMain.handle('save-ini-card-name', async (_event, { iniPath, section, newName, newRarity }) => {
    try {
      if (!iniPath || !section || !newName) throw new Error('パラメータ不足');
      if (!fs.existsSync(iniPath)) throw new Error('iniファイルが存在しません');
      const content = fs.readFileSync(iniPath, 'utf-8');
      const parsed = ini.parse(content);
      if (!parsed[section]) throw new Error('該当セクションがありません');
      // Nameのみ書き換え
      parsed[section].Name = newName;
      // newRarityが指定されていればRarityも書き換え
      if (newRarity) parsed[section].Rarity = newRarity;
      const newContent = ini.stringify(parsed);
      fs.writeFileSync(iniPath, newContent, 'utf-8');
      return { success: true, path: iniPath };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  // 画像選択ダイアログ（初期ディレクトリ固定）
  ipcMain.handle('select-image-file', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }],
      defaultPath: '/mnt/c/Users/luo03/Downloads/card',
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });

  // 複数画像ファイル選択ダイアログ
  ipcMain.handle('select-image-files', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }],
      defaultPath: '/mnt/c/Users/luo03/Downloads/card',
    });
    if (result.canceled || result.filePaths.length === 0) return [];
    return result.filePaths;
  });

  // バニラカードの現在の表示名（カスタム名）取得API
  ipcMain.handle('get-vanilla-card-display-name', async (_event, { baseDir, name, attribute }) => {
    try {
      if (!baseDir || !name || !attribute) throw new Error('パラメータ不足');
      const filePath = path.join(baseDir, 'BepInEx', 'plugins', 'TextureReplacer', 'objects_data', 'card', `${name}_${attribute}_NAME.txt`);
      if (!fs.existsSync(filePath)) return '';
      return fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
      return '';
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
}); 