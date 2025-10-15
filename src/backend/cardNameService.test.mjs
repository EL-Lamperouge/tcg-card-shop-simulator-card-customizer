import fs from 'fs';
import os from 'os';
import path from 'path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getCardDisplayName, setCardDisplayName, listCardNameEntries, __testables } from './cardNameService.mjs';

const { getCustomConfigsRoot } = __testables;

function createTempStructure() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'card-name-service-'));
  const customRoot = getCustomConfigsRoot(tempDir);
  fs.mkdirSync(customRoot, { recursive: true });
  return { tempDir, customRoot };
}

function writeIni(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

describe('cardNameService', () => {
  let tempDir;

  beforeEach(() => {
    const info = createTempStructure();
    tempDir = info.tempDir;
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('updates Name in normal and FullArt ini files', () => {
    const tetramonDir = path.join(tempDir, 'BepInEx', 'plugins', 'CustomExpansionPackImages', 'Configs', 'Custom', 'TetramonConfigs');
    writeIni(path.join(tetramonDir, 'PiggyA.ini'), '[PiggyA]\nName = PiggyA\nDescription = desc\n');
    writeIni(path.join(tetramonDir, 'PiggyAFullArt.ini'), '[PiggyAFullArt]\nName = PiggyA FullArt\nDescription = desc\n');

    const updated = setCardDisplayName(tempDir, 'PiggyA', 'New Piggy', 'Tetramon');

    expect(updated).toHaveLength(2);
    const normalContent = fs.readFileSync(path.join(tetramonDir, 'PiggyA.ini'), 'utf-8');
    const fullArtContent = fs.readFileSync(path.join(tetramonDir, 'PiggyAFullArt.ini'), 'utf-8');
    expect(normalContent).toContain('Name = New Piggy');
    expect(fullArtContent).toContain('Name = New Piggy');
    expect(normalContent).toContain('Description = desc');
    expect(fullArtContent).toContain('Description = desc');
  });

  it('ignores configurations under excluded subdirectories', () => {
    const tetramonDir = path.join(tempDir, 'BepInEx', 'plugins', 'CustomExpansionPackImages', 'Configs', 'Custom', 'TetramonConfigs');
    writeIni(path.join(tetramonDir, 'PiggyA.ini'), '[PiggyA]\nName = PiggyA\n');
    const orgDir = path.join(tetramonDir, 'org');
    writeIni(path.join(orgDir, 'PiggyA.ini'), '[PiggyA]\nName = ShouldStay\n');

    setCardDisplayName(tempDir, 'PiggyA', 'Renamed', 'Tetramon');

    const ignoredContent = fs.readFileSync(path.join(orgDir, 'PiggyA.ini'), 'utf-8');
    expect(ignoredContent).toContain('Name = ShouldStay');
  });

  it('throws when candidate ini files are missing', () => {
    expect(() => setCardDisplayName(tempDir, 'UnknownCard', 'Name', 'Tetramon')).toThrow(/ini/);
  });

  it('returns display name from first matching ini', () => {
    const fantasyDir = path.join(tempDir, 'BepInEx', 'plugins', 'CustomExpansionPackImages', 'Configs', 'Custom', 'FantasyRPGConfigs');
    writeIni(path.join(fantasyDir, 'Hero.ini'), '[Hero]\nName = HeroName\n');

    const result = getCardDisplayName(tempDir, 'Hero');
    expect(result).toBe('HeroName');
  });

  it('lists entries with expansion names', () => {
    const tetramonDir = path.join(tempDir, 'BepInEx', 'plugins', 'CustomExpansionPackImages', 'Configs', 'Custom', 'TetramonConfigs');
    const destinyDir = path.join(tempDir, 'BepInEx', 'plugins', 'CustomExpansionPackImages', 'Configs', 'Custom', 'DestinyConfigs');
    writeIni(path.join(tetramonDir, 'PiggyA.ini'), '[PiggyA]\nName = TetramonPiggy\n');
    writeIni(path.join(destinyDir, 'PiggyA.ini'), '[PiggyA]\nName = DestinyPiggy\n');

    const entries = listCardNameEntries(tempDir, 'PiggyA');
    expect(entries).toHaveLength(2);
    const expansions = entries.map(entry => entry.expansion).sort();
    expect(expansions).toEqual(['Destiny', 'Tetramon']);
  });

  it('requires expansion when duplicates exist', () => {
    const tetramonDir = path.join(tempDir, 'BepInEx', 'plugins', 'CustomExpansionPackImages', 'Configs', 'Custom', 'TetramonConfigs');
    const destinyDir = path.join(tempDir, 'BepInEx', 'plugins', 'CustomExpansionPackImages', 'Configs', 'Custom', 'DestinyConfigs');
    writeIni(path.join(tetramonDir, 'Card.ini'), '[Card]\nName = Tetramon\n');
    writeIni(path.join(destinyDir, 'Card.ini'), '[Card]\nName = Destiny\n');

    expect(() => setCardDisplayName(tempDir, 'Card', 'NewName')).toThrow(/エクスパンション/);
    expect(() => setCardDisplayName(tempDir, 'Card', 'NewName', 'Destiny')).not.toThrow();
  });

  it('gets names for specified expansion when duplicates exist', () => {
    const tetramonDir = path.join(tempDir, 'BepInEx', 'plugins', 'CustomExpansionPackImages', 'Configs', 'Custom', 'TetramonConfigs');
    const destinyDir = path.join(tempDir, 'BepInEx', 'plugins', 'CustomExpansionPackImages', 'Configs', 'Custom', 'DestinyConfigs');
    writeIni(path.join(tetramonDir, 'Shared.ini'), '[Shared]\nName = TetramonShared\n');
    writeIni(path.join(destinyDir, 'Shared.ini'), '[Shared]\nName = DestinyShared\n');

    expect(getCardDisplayName(tempDir, 'Shared', 'Tetramon')).toBe('TetramonShared');
    expect(getCardDisplayName(tempDir, 'Shared', 'Destiny')).toBe('DestinyShared');
  });
});
