const path = require('path');
const fs = require('fs');
const ini = require('ini');

// Root: <baseDir>/BepInEx/plugins/CustomExpansionPackImages/Configs/Custom
function getCustomConfigsRoot(baseDir) {
  return path.join(
    baseDir,
    'BepInEx',
    'plugins',
    'CustomExpansionPackImages',
    'Configs',
    'Custom'
  );
}

// Return INI file paths inside each "*Configs" directory directly under the Custom root.
// - Do not descend further (ignore nested dirs like org/translated)
// - Skip any directory named exactly "FullExpansionsConfigs"
function listCustomIniFiles(baseDir) {
  const root = getCustomConfigsRoot(baseDir);
  const results = [];
  if (!fs.existsSync(root)) return results;
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    if (ent.name === 'FullExpansionsConfigs') continue; // do not explore
    if (!/Configs$/i.test(ent.name)) continue; // only xxxConfigs directories
    const dir = path.join(root, ent.name);
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const f of files) {
      if (f.isFile() && f.name.toLowerCase().endsWith('.ini')) {
        results.push(path.join(dir, f.name));
      }
    }
  }
  return results;
}

// Find the most relevant section for a card identified by adminName/name.
// Returns { filePath, section, data } or null.
function findSectionForCard(baseDir, { adminName, name }) {
  const identifiers = [
    (adminName || '').trim(),
    (name || '').trim(),
  ].filter(Boolean);
  if (identifiers.length === 0) return null;

  const scoreSection = (sectionName, data) => {
    let score = 0;
    for (const id of identifiers) {
      if (sectionName === id) score += 4;
      if ((data['Monster Type'] || '') === id) score += 3;
      if ((data['Name'] || '') === id) score += 2;
    }
    return score;
  };

  const files = listCustomIniFiles(baseDir);
  let best = null;
  let bestScore = 0;
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = ini.parse(content);
      for (const section of Object.keys(parsed)) {
        const data = parsed[section] || {};
        const s = scoreSection(section, data);
        if (s > bestScore) {
          best = { filePath, section, data };
          bestScore = s;
        }
      }
    } catch (_) { /* ignore individual file errors */ }
  }
  return best;
}

function getDisplayName(baseDir, { adminName, name }) {
  const found = findSectionForCard(baseDir, { adminName, name });
  if (!found) return '';
  return (found.data && found.data.Name) ? String(found.data.Name) : String(found.section || '');
}

function saveDisplayName(baseDir, { adminName, name }, newName) {
  const found = findSectionForCard(baseDir, { adminName, name });
  if (!found) {
    throw new Error('対応するiniセクションが見つかりません');
  }
  const content = fs.readFileSync(found.filePath, 'utf-8');
  const parsed = ini.parse(content);
  if (!parsed[found.section]) {
    throw new Error('該当セクションがini内に存在しません');
  }
  parsed[found.section].Name = newName;
  const newContent = ini.stringify(parsed);
  fs.writeFileSync(found.filePath, newContent, 'utf-8');
  return { path: found.filePath, section: found.section };
}

module.exports = {
  listCustomIniFiles,
  getCustomConfigsRoot,
  findSectionForCard,
  getDisplayName,
  saveDisplayName,
};

