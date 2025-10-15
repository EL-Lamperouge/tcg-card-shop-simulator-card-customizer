import fs from 'fs';
import path from 'path';

const CUSTOM_CONFIG_RELATIVE = ['BepInEx', 'plugins', 'CustomExpansionPackImages', 'Configs', 'Custom'];
const IGNORED_DIRECTORIES = new Set(['FullExpansionsConfigs']);
const NAME_LINE_REGEX = /^Name\s*=\s*.*$/m;

function extractExpansionName(configDirName) {
  if (!configDirName) return '';
  return configDirName.replace(/Configs$/i, '');
}

function getCustomConfigsRoot(baseDir) {
  if (!baseDir) throw new Error('baseDir is required');
  return path.join(baseDir, ...CUSTOM_CONFIG_RELATIVE);
}

function listConfigDirectories(baseDir) {
  const root = getCustomConfigsRoot(baseDir);
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory() && entry.name.endsWith('Configs') && !IGNORED_DIRECTORIES.has(entry.name))
    .map(entry => ({
      name: entry.name,
      expansion: extractExpansionName(entry.name),
      dir: path.join(root, entry.name),
    }));
}

function resolveCandidateFiles(baseDir, adminName, expansion) {
  if (!adminName) return [];
  const normalized = adminName.trim();
  if (!normalized) return [];
  const requestedExpansion = expansion ? expansion.trim().toLowerCase() : null;
  const configDirs = listConfigDirectories(baseDir).filter(dirInfo => {
    if (!requestedExpansion) return true;
    return dirInfo.expansion.trim().toLowerCase() === requestedExpansion;
  });
  const candidates = [];
  for (const { dir, expansion: dirExpansion } of configDirs) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const matchingFiles = [];
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!entry.name.toLowerCase().endsWith('.ini')) continue;
      const baseName = entry.name.slice(0, -4); // remove .ini
      if (baseName === normalized || baseName === `${normalized}FullArt`) {
        matchingFiles.push(path.join(dir, entry.name));
      }
    }
    if (matchingFiles.length > 0) {
      candidates.push({ expansion: dirExpansion, files: matchingFiles });
    }
  }
  return candidates;
}

function readNameFromIni(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^Name\s*=\s*(.*)$/m);
  return match ? match[1].trim() : '';
}

function writeNameToIni(filePath, newName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!NAME_LINE_REGEX.test(content)) {
    throw new Error(`Name entry not found in ini: ${filePath}`);
  }
  const updated = content.replace(NAME_LINE_REGEX, `Name = ${newName}`);
  fs.writeFileSync(filePath, updated, 'utf-8');
}

function pickPrimaryFile(files) {
  if (!files || files.length === 0) return null;
  const normalFile = files.find(f => !f.toLowerCase().includes('fullart.ini'));
  return normalFile || files[0];
}

export function listCardNameEntries(baseDir, adminName) {
  const entries = resolveCandidateFiles(baseDir, adminName);
  return entries.map(entry => {
    const primaryFile = pickPrimaryFile(entry.files);
    const name = primaryFile ? readNameFromIni(primaryFile) : '';
    return {
      expansion: entry.expansion,
      files: entry.files,
      name,
    };
  });
}

export function getCardDisplayName(baseDir, adminName, expansion) {
  const entries = resolveCandidateFiles(baseDir, adminName, expansion);
  if (entries.length === 0) return '';
  const primaryFile = pickPrimaryFile(entries[0].files);
  return primaryFile ? readNameFromIni(primaryFile) : '';
}

export function setCardDisplayName(baseDir, adminName, newName, expansion) {
  const entries = resolveCandidateFiles(baseDir, adminName, expansion);
  if (entries.length === 0) {
    const hasAmbiguity = resolveCandidateFiles(baseDir, adminName).length > 0;
    if (hasAmbiguity && !expansion) {
      throw new Error('対象のエクスパンションを指定してください');
    }
    throw new Error('対象のiniファイルが見つかりません');
  }
  if (!expansion && entries.length > 1) {
    throw new Error('対象のエクスパンションを指定してください');
  }
  const targetEntry = expansion ? entries[0] : entries[0];
  for (const file of targetEntry.files) {
    writeNameToIni(file, newName);
  }
  return targetEntry.files;
}

export const __testables = {
  getCustomConfigsRoot,
  listConfigDirectories,
  resolveCandidateFiles,
  readNameFromIni,
  writeNameToIni,
  extractExpansionName,
  pickPrimaryFile,
};
