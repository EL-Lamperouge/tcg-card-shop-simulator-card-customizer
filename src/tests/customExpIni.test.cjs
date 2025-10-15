const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');
const ini = require('ini');
const mod = require('../main/customExpIni.cjs');

function setupTmp() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'cepi-'));
  const root = mod.getCustomConfigsRoot(base);
  const tDir = path.join(root, 'TetramonConfigs');
  const dDir = path.join(root, 'DestinyConfigs');
  const skipDir = path.join(root, 'FullExpansionsConfigs');
  fs.mkdirSync(tDir, { recursive: true });
  fs.mkdirSync(dDir, { recursive: true });
  fs.mkdirSync(skipDir, { recursive: true });
  // files
  fs.writeFileSync(path.join(tDir, 'Piggy.ini'), ini.stringify({
    PiggyA: { Name: 'Pigni', 'Monster Type': 'PiggyA' },
  }));
  fs.writeFileSync(path.join(dDir, 'Aron.ini'), ini.stringify({
    Aron: { Name: 'Aron', 'Monster Type': 'Aron' },
  }));
  // nested should be ignored
  const nested = path.join(tDir, 'org');
  fs.mkdirSync(nested);
  fs.writeFileSync(path.join(nested, 'Ignore.ini'), '[X]\nName=X\n');
  return base;
}

function run() {
  const base = setupTmp();
  const files = mod.listCustomIniFiles(base);
  assert(files.every(p => !/FullExpansionsConfigs/.test(p)), 'should skip FullExpansionsConfigs');
  assert(files.length === 2, 'should list only direct ini files under *Configs');

  const name1 = mod.getDisplayName(base, { adminName: 'PiggyA', name: 'Pigni' });
  assert.strictEqual(name1, 'Pigni');

  mod.saveDisplayName(base, { adminName: 'PiggyA', name: 'Pigni' }, 'Piggy-NEW');
  const name2 = mod.getDisplayName(base, { adminName: 'PiggyA', name: 'Pigni' });
  assert.strictEqual(name2, 'Piggy-NEW');

  console.log('customExpIni tests passed');
}

if (require.main === module) {
  run();
}

