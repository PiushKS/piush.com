const fs = require('fs');
const path = require('path');

const SRC_PKG = '/tmp/package';
const PNG_DIR = path.join(SRC_PKG, 'png');
const SVG_DIR = path.join(SRC_PKG, 'svg');

const DEST_WIN95_ICONS = path.join(__dirname, '..', 'public', 'images', 'win95-icons');
const DEST_IMAGES = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(DEST_WIN95_ICONS)) {
  fs.mkdirSync(DEST_WIN95_ICONS, { recursive: true });
}

// Icon mappings: [targetBaseName, src32Base, src16Base]
const mappings = [
  ['computer', 'Computer_32x32_4', 'Computer_16x16_4'],
  ['network', 'Network_32x32_4', 'Network_16x16_4'],
  ['ie', 'Ie_32x32_4', 'Ie_16x16_4'],
  ['recycle-empty', 'RecycleEmpty_32x32_4', 'RecycleEmpty_16x16_4'],
  ['recycle-full', 'RecycleFull_32x32_4', 'RecycleFull_16x16_4'],
  ['folder', 'Folder_32x32_4', 'Folder_16x16_4'],
  ['folder-open', 'FolderOpen_32x32_4', 'FolderOpen_16x16_4'],
  ['msn', 'MicrosoftNetwork_32x32_4', 'MicrosoftNetwork_16x16_4'],
  ['briefcase', 'Syncui120_32x32_4', 'Syncui120_16x16_4'],
  ['notepad', 'Notepad_32x32_4', 'Notepad_16x16_4'],
  ['document', 'FileText_32x32_4', 'FileText_16x16_4'],
  ['wordpad', 'Wordpad_32x32_4', 'Wordpad_16x16_4'],
  ['paint', 'Mspaint_32x32_4', 'Mspaint_16x16_4'],
  ['calc', 'Calculator_32x32_4', 'Calculator_16x16_4'],
  ['control-panel', 'Controls3000_32x32_4', 'Controls3000_16x16_4'],
  ['media-player', 'Mplayer10_32x32_4', 'Mplayer10_16x16_4'],
  ['pinball', 'PinballIcon1_32x32_4', 'PinballIcon1_16x16_4'],
  ['minesweeper', 'Winmine1_32x32_4', 'Winmine1_16x16_4'],
  ['solitaire', 'Sol1_32x32_4', 'Sol1_16x16_4'],
  ['freecell', 'Freecell1_32x32_4', 'Freecell1_32x32_4'],
  ['hearts', 'Mshearts1_32x32_4', 'Mshearts1_32x32_4'],
  ['dos', 'MsDos_32x32_32', 'MsDos_16x16_32'],
  ['cd-player', 'Cdplayer107_32x32_4', 'Cdplayer107_16x16_4'],
  ['sound-recorder', 'Sndrec3210_32x32_4', 'Sndrec3210_16x16_4'],
  ['volume', 'Sndvol32300_32x32_4', 'Sndvol32300_16x16_4'],
  ['task-manager', 'Taskman100_32x32_4', 'Taskman100_32x32_4'],
  ['defrag', 'Defrag1_32x32_4', 'Defrag1_16x16_4'],
  ['scandisk', 'Scandskw1_32x32_4', 'Scandskw1_16x16_4'],
  ['charmap', 'Charmap1_32x32_4', 'Charmap1_16x16_4'],
  ['dialer', 'Dialer1_32x32_4', 'Dialer1_16x16_4'],
  ['help', 'HelpBook_32x32_4', 'HelpBook_16x16_4'],
  ['find', 'FileFind_32x32_4', 'FileFind_16x16_4'],
  ['shutdown', 'PowerOff_32x32_4', 'PowerOff_16x16_4'],
  ['run', 'Progman24_32x32_4', 'Progman24_32x32_4'],
  ['clock', 'Timedate_32x32_4', 'Timedate_16x16_4'],
  ['portfolio', 'Progman1_32x32_4', 'Progman1_16x16_4'],
  ['quiz', 'HelpBook_32x32_4', 'HelpBook_16x16_4'],
  ['tools', 'HardwareDiag_32x32_4', 'Progman14_16x16_4'],
  ['start-logo', 'Logo_32x32_4', 'Logo_16x16_4'],
  ['game-chess', 'Moricons51_32x32_4', 'Moricons51_32x32_4'],
  ['game-cards', 'Moricons52_32x32_4', 'Moricons52_32x32_4'],
  ['game-dice', 'Moricons53_32x32_4', 'Moricons53_32x32_4'],
  ['game-alien', 'Moricons49_32x32_4', 'Moricons49_32x32_4'],
  ['game-blocks', 'Moricons41_32x32_4', 'Moricons41_32x32_4'],
  ['games-group', 'Progman5_32x32_4', 'Progman5_32x32_4'],
  ['accessories-group', 'Progman4_32x32_4', 'Progman4_32x32_4'],
  ['programs-group', 'Progman3_32x32_4', 'Progman3_32x32_4'],
];

let copiedCount = 0;

for (const [targetName, src32, src16] of mappings) {
  // 32x32 PNG
  const p32Src = path.join(PNG_DIR, `${src32}.png`);
  if (fs.existsSync(p32Src)) {
    fs.copyFileSync(p32Src, path.join(DEST_WIN95_ICONS, `${targetName}.png`));
    copiedCount++;
  }

  // 32x32 SVG
  const s32Src = path.join(SVG_DIR, `${src32}.svg`);
  if (fs.existsSync(s32Src)) {
    fs.copyFileSync(s32Src, path.join(DEST_WIN95_ICONS, `${targetName}.svg`));
    copiedCount++;
  }

  // 16x16 PNG
  const p16Src = path.join(PNG_DIR, `${src16}.png`);
  if (fs.existsSync(p16Src)) {
    fs.copyFileSync(p16Src, path.join(DEST_WIN95_ICONS, `${targetName}-16.png`));
    copiedCount++;
  }

  // 16x16 SVG
  const s16Src = path.join(SVG_DIR, `${src16}.svg`);
  if (fs.existsSync(s16Src)) {
    fs.copyFileSync(s16Src, path.join(DEST_WIN95_ICONS, `${targetName}-16.svg`));
    copiedCount++;
  }
}

// Overwrite legacy SVG approximations in public/images/ with authentic real Windows 95 SVGs
const legacySvgReplacements = [
  ['windows-95-computer.svg', 'Computer_32x32_4.svg'],
  ['windows-95-computer.png', 'Computer_32x32_4.png'],
  ['windows-95-network.svg', 'Network_32x32_4.svg'],
  ['windows-95-ie.svg', 'Ie_32x32_4.svg'],
  ['windows-95-recycle-bin.svg', 'RecycleEmpty_32x32_4.svg'],
  ['windows-95-recycle-bin-full.svg', 'RecycleFull_32x32_4.svg'],
  ['windows-95-folder.svg', 'Folder_32x32_4.svg'],
  ['windows-95-msn.svg', 'MicrosoftNetwork_32x32_4.svg'],
  ['windows-95-briefcase.svg', 'Syncui120_32x32_4.svg'],
  ['windows-95-rocket.svg', 'Progman1_32x32_4.svg'],
  ['windows-95-rocket.png', 'Progman1_32x32_4.png'],
  ['windows-95-notepad.svg', 'Notepad_32x32_4.svg'],
  ['windows-95-wordpad.svg', 'Wordpad_32x32_4.svg'],
  ['windows-95-paint.svg', 'Mspaint_32x32_4.svg'],
  ['windows-95-calc.svg', 'Calculator_32x32_4.svg'],
  ['windows-95-control-panel.svg', 'Controls3000_32x32_4.svg'],
  ['windows-95-media-player.svg', 'Mplayer10_32x32_4.svg'],
  ['windows-95-pinball.svg', 'PinballIcon1_32x32_4.svg'],
  ['windows-95-mine.svg', 'Winmine1_32x32_4.svg'],
  ['windows-95-solitaire.svg', 'Sol1_32x32_4.svg'],
  ['windows-95-freecell.svg', 'Freecell1_32x32_4.svg'],
  ['windows-95-hearts.svg', 'Mshearts1_32x32_4.svg'],
  ['windows-95-dos.svg', 'MsDos_32x32_32.svg'],
];

for (const [destName, srcName] of legacySvgReplacements) {
  const isSvg = srcName.endsWith('.svg');
  const srcPath = path.join(isSvg ? SVG_DIR : PNG_DIR, srcName);
  const destPath = path.join(DEST_IMAGES, destName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Updated legacy asset: ${destName} <- ${srcName}`);
  } else {
    console.warn(`Source not found for legacy asset: ${srcName}`);
  }
}

// Also add windows-95-quiz.svg and windows-95-tools.svg to public/images/
fs.copyFileSync(path.join(SVG_DIR, 'HelpBook_32x32_4.svg'), path.join(DEST_IMAGES, 'windows-95-quiz.svg'));
fs.copyFileSync(path.join(PNG_DIR, 'HelpBook_32x32_4.png'), path.join(DEST_IMAGES, 'windows-95-quiz.png'));
fs.copyFileSync(path.join(SVG_DIR, 'HardwareDiag_32x32_4.svg'), path.join(DEST_IMAGES, 'windows-95-tools.svg'));
fs.copyFileSync(path.join(PNG_DIR, 'HardwareDiag_32x32_4.png'), path.join(DEST_IMAGES, 'windows-95-tools.png'));

console.log(`Successfully installed authentic Windows 95 icons: ${copiedCount} files in win95-icons/`);
