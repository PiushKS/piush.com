const fs = require('fs');
const path = require('path');

// 1. Update Win95Desktop.astro
const desktopPath = path.join(__dirname, '../src/components/sections/Win95Desktop.astro');
let desktopContent = fs.readFileSync(desktopPath, 'utf8');

const desktopReplacements = [
  ['src="/images/windows-95-computer.svg"', 'src="/images/win95-icons/computer.png?v=95"'],
  ['src="/images/windows-95-network.svg"', 'src="/images/win95-icons/network.png?v=95"'],
  ['src="/images/windows-95-ie.svg"', 'src="/images/win95-icons/ie.png?v=95"'],
  ['src="/images/windows-95-recycle-bin.svg"', 'src="/images/win95-icons/recycle-empty.png?v=95"'],
  ['src="/images/windows-95-folder.svg"', 'src="/images/win95-icons/folder.png?v=95"'],
  ['src="/images/windows-95-msn.svg"', 'src="/images/win95-icons/msn.png?v=95"'],
  ['src="/images/windows-95-briefcase.svg"', 'src="/images/win95-icons/briefcase.png?v=95"'],
  ['src="/images/windows-95-rocket.svg"', 'src="/images/win95-icons/portfolio.png?v=95"'],
  ['src="/images/windows-95-notepad.svg"', 'src="/images/win95-icons/notepad.png?v=95"'],
  ['src="/images/windows-95-wordpad.svg"', 'src="/images/win95-icons/wordpad.png?v=95"'],
  ['src="/images/windows-95-paint.svg"', 'src="/images/win95-icons/paint.png?v=95"'],
  ['src="/images/windows-95-calc.svg"', 'src="/images/win95-icons/calc.png?v=95"'],
  ['src="/images/windows-95-control-panel.svg"', 'src="/images/win95-icons/control-panel.png?v=95"'],
  ['src="/images/windows-95-media-player.svg"', 'src="/images/win95-icons/media-player.png?v=95"'],
  ['src="/images/windows-95-pinball.svg"', 'src="/images/win95-icons/pinball.png?v=95"'],
  ['src="/images/windows-95-mine.svg"', 'src="/images/win95-icons/minesweeper.png?v=95"'],
  ['src="/images/windows-95-solitaire.svg"', 'src="/images/win95-icons/solitaire.png?v=95"'],
  ['src="/images/windows-95-freecell.svg"', 'src="/images/win95-icons/freecell.png?v=95"'],
  ['src="/images/windows-95-hearts.svg"', 'src="/images/win95-icons/hearts.png?v=95"'],
  ['src="/images/windows-95-dos.svg"', 'src="/images/win95-icons/dos.png?v=95"'],
  ["'/images/windows-95-recycle-bin.svg'", "'/images/win95-icons/recycle-empty.png?v=95'"],
  ["'/images/windows-95-recycle-bin-full.svg'", "'/images/win95-icons/recycle-full.png?v=95'"],
  ["'/images/windows-95-folder.svg'", "'/images/win95-icons/folder.png?v=95'"],
];

for (const [from, to] of desktopReplacements) {
  while (desktopContent.includes(from)) {
    desktopContent = desktopContent.replace(from, to);
  }
}

// Ensure zero em-dashes
desktopContent = desktopContent.replace(/\u2014/g, '–');

fs.writeFileSync(desktopPath, desktopContent, 'utf8');
console.log('Updated Win95Desktop.astro');

// 2. Update Header.astro
const headerPath = path.join(__dirname, '../src/components/sections/Header.astro');
if (fs.existsSync(headerPath)) {
  let headerContent = fs.readFileSync(headerPath, 'utf8');
  headerContent = headerContent.replace(/\/images\/windows-95-computer\.svg/g, '/images/win95-icons/computer.png?v=95');
  headerContent = headerContent.replace(/\u2014/g, '–');
  fs.writeFileSync(headerPath, headerContent, 'utf8');
  console.log('Updated Header.astro');
}

// 3. Update Footer.astro
const footerPath = path.join(__dirname, '../src/components/sections/Footer.astro');
if (fs.existsSync(footerPath)) {
  let footerContent = fs.readFileSync(footerPath, 'utf8');
  footerContent = footerContent.replace(/\/images\/windows-95-rocket\.svg/g, '/images/win95-icons/portfolio.png?v=95');
  footerContent = footerContent.replace(/\u2014/g, '–');
  fs.writeFileSync(footerPath, footerContent, 'utf8');
  console.log('Updated Footer.astro');
}

// 4. Update accessories.ts
const accPath = path.join(__dirname, '../src/lib/win95/apps/accessories.ts');
if (fs.existsSync(accPath)) {
  let accContent = fs.readFileSync(accPath, 'utf8');
  accContent = accContent.replace(/\/images\/windows-95-wordpad\.svg/g, '/images/win95-icons/wordpad.png?v=95');
  accContent = accContent.replace(/\u2014/g, '–');
  fs.writeFileSync(accPath, accContent, 'utf8');
  console.log('Updated accessories.ts');
}

// 5. Update multimedia.ts
const mmPath = path.join(__dirname, '../src/lib/win95/apps/multimedia.ts');
if (fs.existsSync(mmPath)) {
  let mmContent = fs.readFileSync(mmPath, 'utf8');
  mmContent = mmContent.replace(/\/images\/windows-95-computer\.svg/g, '/images/win95-icons/computer.png?v=95');
  mmContent = mmContent.replace(/\/images\/windows-95-msn\.svg/g, '/images/win95-icons/msn.png?v=95');
  mmContent = mmContent.replace(/\u2014/g, '–');
  fs.writeFileSync(mmPath, mmContent, 'utf8');
  console.log('Updated multimedia.ts');
}

// 6. Overwrite legacy files in public/images/ with the PNGs or copy them to prevent any fallback failure
const legacyMappings = [
  ['windows-95-computer.png', 'computer.png'],
  ['windows-95-ie.png', 'ie.png'],
  ['windows-95-rocket.png', 'portfolio.png'],
  ['windows-95-quiz.png', 'quiz.png'],
  ['windows-95-tools.png', 'tools.png'],
  ['windows-95-calc.png', 'calc.png'],
  ['windows-95-paint.png', 'paint.png'],
  ['windows-95-notepad.png', 'notepad.png'],
  ['windows-95-wordpad.png', 'wordpad.png'],
  ['windows-95-recycle-bin.png', 'recycle-empty.png'],
  ['windows-95-recycle-bin-full.png', 'recycle-full.png'],
  ['windows-95-msn.png', 'msn.png'],
  ['windows-95-briefcase.png', 'briefcase.png'],
  ['windows-95-network.png', 'network.png'],
  ['windows-95-folder.png', 'folder.png'],
  ['windows-95-dos.png', 'dos.png'],
  ['windows-95-pinball.png', 'pinball.png'],
  ['windows-95-mine.png', 'minesweeper.png'],
  ['windows-95-solitaire.png', 'solitaire.png'],
  ['windows-95-freecell.png', 'freecell.png'],
  ['windows-95-hearts.png', 'hearts.png'],
  ['windows-95-control-panel.png', 'control-panel.png'],
  ['windows-95-media-player.png', 'media-player.png'],
];

const iconsDir = path.join(__dirname, '../public/images/win95-icons');
const imagesDir = path.join(__dirname, '../public/images');

for (const [legacyName, authenticName] of legacyMappings) {
  const src = path.join(iconsDir, authenticName);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(imagesDir, legacyName));
  }
}
console.log('Synchronized legacy PNGs with authentic PNGs');
