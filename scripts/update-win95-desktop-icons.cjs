const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/components/sections/Win95Desktop.astro');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Desktop Quiz.exe replacement
const oldQuiz = `      <!-- 13. Developer Quiz -->
      <a
        href="/quiz/"
        class="win95-desktop-icon no-underline"
        id="d-icon-quiz"
        title="Open Developer Quiz (550 Questions)"
        data-name="Quiz.exe"
      >
        <div class="size-9 bg-[#000080] border border-black flex items-center justify-center text-white text-lg font-bold drop-shadow-[1px_1px_0px_#000000]">
          ⚡
        </div>
        <span class="win95-desktop-icon-label">Quiz.exe</span>
      </a>`;

const newQuiz = `      <!-- 13. Developer Quiz -->
      <a
        href="/quiz/"
        class="win95-desktop-icon no-underline"
        id="d-icon-quiz"
        title="Open Developer Quiz (550 Questions)"
        data-name="Quiz.exe"
      >
        <img
          src="/images/win95-icons/quiz.png"
          alt="Quiz.exe"
          width="36"
          height="36"
          class="size-9 shrink-0 [image-rendering:pixelated] drop-shadow-[1px_1px_0px_#000000]"
        />
        <span class="win95-desktop-icon-label">Quiz.exe</span>
      </a>`;

if (content.includes(oldQuiz)) {
  content = content.replace(oldQuiz, newQuiz);
  console.log('Replaced Quiz.exe icon');
} else {
  console.warn('Could not find exact oldQuiz block');
}

// 2. Desktop Tools.exe replacement
const oldTools = `      <!-- 14. Dev Tools -->
      <a
        href="/tools/"
        class="win95-desktop-icon no-underline"
        id="d-icon-tools"
        title="Open Developer Tools"
        data-name="Tools.exe"
      >
        <div class="size-9 bg-[#800080] border border-black flex items-center justify-center text-white text-lg font-bold drop-shadow-[1px_1px_0px_#000000]">
          🛠️
        </div>
        <span class="win95-desktop-icon-label">Tools.exe</span>
      </a>`;

const newTools = `      <!-- 14. Dev Tools -->
      <a
        href="/tools/"
        class="win95-desktop-icon no-underline"
        id="d-icon-tools"
        title="Open Developer Tools"
        data-name="Tools.exe"
      >
        <img
          src="/images/win95-icons/tools.png"
          alt="Tools.exe"
          width="36"
          height="36"
          class="size-9 shrink-0 [image-rendering:pixelated] drop-shadow-[1px_1px_0px_#000000]"
        />
        <span class="win95-desktop-icon-label">Tools.exe</span>
      </a>`;

if (content.includes(oldTools)) {
  content = content.replace(oldTools, newTools);
  console.log('Replaced Tools.exe icon');
} else {
  console.warn('Could not find exact oldTools block');
}

// 3. Start button flag replacement
const oldStartFlag = `        <!-- 4-Color Windows Flag -->
        <span class="grid grid-cols-2 gap-0.5 p-0.5 bg-black/60">
          <span class="size-1.5 bg-[#e74c3c]"></span>
          <span class="size-1.5 bg-[#2ecc71]"></span>
          <span class="size-1.5 bg-[#3498db]"></span>
          <span class="size-1.5 bg-[#f1c40f]"></span>
        </span>`;

const newStartFlag = `        <img
          src="/images/win95-icons/start-logo-16.png"
          alt=""
          width="16"
          height="16"
          class="size-4 shrink-0 [image-rendering:pixelated]"
        />`;

if (content.includes(oldStartFlag)) {
  content = content.replace(oldStartFlag, newStartFlag);
  console.log('Replaced Start button flag');
} else {
  console.warn('Could not find exact oldStartFlag block');
}

// 4. Start Menu Items Replacements
const menuReplacements = [
  // Programs and Accessories headers
  { from: `<span>📁</span>\n                <span>Programs</span>`, to: `<img src="/images/win95-icons/programs-group-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />\n                <span>Programs</span>` },
  { from: `<span>📁</span><span>Accessories</span>`, to: `<img src="/images/win95-icons/accessories-group-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Accessories</span>` },
  
  // Accessories apps
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="notepad"><span>📝 Notepad</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="notepad"><img src="/images/win95-icons/notepad-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Notepad</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="wordpad"><span>📄 WordPad</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="wordpad"><img src="/images/win95-icons/wordpad-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>WordPad</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="paint"><span>🎨 Paint</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="paint"><img src="/images/win95-icons/paint-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Paint</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="calculator"><span>🔢 Calculator</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="calculator"><img src="/images/win95-icons/calc-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Calculator</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="charmap"><span>🔡 Character Map</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="charmap"><img src="/images/win95-icons/charmap-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Character Map</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="clipboard"><span>📋 Clipboard Viewer</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="clipboard"><img src="/images/win95-icons/document-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Clipboard Viewer</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="addressbook"><span>📇 Address Book</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="addressbook"><img src="/images/win95-icons/folder-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Address Book</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="dialer"><span>☎️ Phone Dialer</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="dialer"><img src="/images/win95-icons/dialer-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Phone Dialer</span></button>` },

  // Games header & items
  { from: `<span>🎮</span><span>Games</span>`, to: `<img src="/images/win95-icons/game-cards-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Games</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="minesweeper"><span>💣 Minesweeper</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="minesweeper"><img src="/images/win95-icons/minesweeper-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Minesweeper</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="solitaire"><span>🃏 Solitaire</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="solitaire"><img src="/images/win95-icons/solitaire-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Solitaire</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="freecell"><span>♠️ FreeCell</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="freecell"><img src="/images/win95-icons/freecell-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>FreeCell</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="hearts"><span>♥️ Hearts</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="hearts"><img src="/images/win95-icons/hearts-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Hearts</span></button>` },

  // Bonus games header & items
  { from: `<span>🕹️</span><span>Bonus Games</span>`, to: `<img src="/images/win95-icons/game-cards-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Bonus Games</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="pinball"><span>🚀 3D Pinball</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="pinball"><img src="/images/win95-icons/pinball-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>3D Pinball</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="snake"><span>🐍 Snake</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="snake"><img src="/images/win95-icons/game-alien-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Snake</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="chess"><span>♟️ Chess</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="chess"><img src="/images/win95-icons/game-chess.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Chess</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="brickbreaker"><span>🧱 Brick Breaker</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="brickbreaker"><img src="/images/win95-icons/game-blocks-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Brick Breaker</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="spacedefender"><span>👾 Space Defender</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="spacedefender"><img src="/images/win95-icons/game-alien-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Space Defender</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="tictactoe"><span>❌ Tic-Tac-Toe</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="tictactoe"><img src="/images/win95-icons/game-cards-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Tic-Tac-Toe</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="memorymatch"><span>🎴 Memory Match</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="memorymatch"><img src="/images/win95-icons/game-cards-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Memory Match</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="reversi"><span>⚪ Reversi</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="reversi"><img src="/images/win95-icons/game-cards-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Reversi</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="game2048"><span>🔢 2048</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="game2048"><img src="/images/win95-icons/calc-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>2048</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="fallingblocks"><span>🧩 Falling Blocks</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="fallingblocks"><img src="/images/win95-icons/game-blocks-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Falling Blocks</span></button>` },

  // Multimedia
  { from: `<span>📼</span><span>Multimedia</span>`, to: `<img src="/images/win95-icons/media-player-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Multimedia</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="mediaplayer"><span>📼 Media Player</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="mediaplayer"><img src="/images/win95-icons/media-player-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Media Player</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="cdplayer"><span>💿 CD Player</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="cdplayer"><img src="/images/win95-icons/cd-player-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>CD Player</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="soundrecorder"><span>🎙️ Sound Recorder</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="soundrecorder"><img src="/images/win95-icons/sound-recorder-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Sound Recorder</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="volumecontrol"><span>🔊 Volume Control</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="volumecontrol"><img src="/images/win95-icons/volume-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Volume Control</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="imageviewer"><span>🖼️ Image Viewer</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="imageviewer"><img src="/images/win95-icons/paint-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Image Viewer</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="midiplayer"><span>🎹 MIDI Player</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="midiplayer"><img src="/images/win95-icons/media-player-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>MIDI Player</span></button>` },

  // System Tools
  { from: `<span>🔧</span><span>System Tools</span>`, to: `<img src="/images/win95-icons/tools-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>System Tools</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="sysinfo"><span>ℹ️ System Information</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="sysinfo"><img src="/images/win95-icons/sysinfo-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>System Information</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="diskproperties"><span>💾 Disk Properties</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="diskproperties"><img src="/images/win95-icons/drive-harddisk-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Disk Properties</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="scandisk"><span>🩺 ScanDisk</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="scandisk"><img src="/images/win95-icons/scandisk-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>ScanDisk</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="defrag"><span>🗂️ Disk Defragmenter</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="defrag"><img src="/images/win95-icons/defrag-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Disk Defragmenter</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="backup"><span>📦 Backup</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="backup"><img src="/images/win95-icons/drive-harddisk-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Backup</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="restore"><span>📥 Restore</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="restore"><img src="/images/win95-icons/drive-harddisk-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Restore</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="resourcemonitor"><span>📊 Resource Monitor</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="resourcemonitor"><img src="/images/win95-icons/task-manager-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Resource Monitor</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="explorer"><span>🗂️ File Manager</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="explorer"><img src="/images/win95-icons/folder-open-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>File Manager</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="taskmanager"><span>⚡ Task Manager</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="taskmanager"><img src="/images/win95-icons/task-manager-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Task Manager</span></button>` },

  // Communications
  { from: `<span>📡</span><span>Communications</span>`, to: `<img src="/images/win95-icons/network-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Communications</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="hyperterminal"><span>📟 HyperTerminal</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="hyperterminal"><img src="/images/win95-icons/network-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>HyperTerminal</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="dialup"><span>📞 Dial-Up Networking</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="dialup"><img src="/images/win95-icons/network-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Dial-Up Networking</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="network"><span>🌐 Network Neighborhood</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="network"><img src="/images/win95-icons/network-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Network Neighborhood</span></button>` },

  // Accessibility
  { from: `<span>♿</span><span>Accessibility</span>`, to: `<img src="/images/win95-icons/control-panel-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Accessibility</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="a11yoptions"><span>⚙️ Accessibility Options</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="a11yoptions"><img src="/images/win95-icons/control-panel-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Accessibility Options</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="magnifier"><span>🔍 Magnifier</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="magnifier"><img src="/images/win95-icons/find-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Magnifier</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="osk"><span>⌨️ On-Screen Keyboard</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="osk"><img src="/images/win95-icons/document-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>On-Screen Keyboard</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="highcontrast"><span>👁️ High Contrast</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="highcontrast"><img src="/images/win95-icons/control-panel-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>High Contrast</span></button>` },

  // Developer Tools
  { from: `<span>🛠️</span><span>Developer Tools</span>`, to: `<img src="/images/win95-icons/tools-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Developer Tools</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="jsontoolkit"><span>{ } JSON Toolkit</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="jsontoolkit"><img src="/images/win95-icons/tools-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>JSON Toolkit</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="playground"><span>💻 Code Playground</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="playground"><img src="/images/win95-icons/computer-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Code Playground</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="svgstudio"><span>📐 SVG Studio</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="svgstudio"><img src="/images/win95-icons/paint-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>SVG Studio</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="uidesignlab"><span>🧪 UI Design Lab</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="uidesignlab"><img src="/images/win95-icons/tools-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>UI Design Lab</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="colorstudio"><span>🎨 Color Studio</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="colorstudio"><img src="/images/win95-icons/paint-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Color Studio</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="appiconcreator"><span>🖼️ App Icon Creator</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="appiconcreator"><img src="/images/win95-icons/paint-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>App Icon Creator</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="regextester"><span>.* Regex Tester</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="regextester"><img src="/images/win95-icons/tools-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Regex Tester</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="base64"><span>🔤 Base64 Encoder/Decoder</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="base64"><img src="/images/win95-icons/tools-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Base64 Encoder/Decoder</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="urlcodec"><span>🔗 URL Encoder/Decoder</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="urlcodec"><img src="/images/win95-icons/tools-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>URL Encoder/Decoder</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="hashgen"><span>🔑 Hash Generator</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="hashgen"><img src="/images/win95-icons/tools-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Hash Generator</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="uuidgen"><span>🆔 UUID Generator</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="uuidgen"><img src="/images/win95-icons/tools-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>UUID Generator</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="timestamp"><span>⏱️ Timestamp Converter</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="timestamp"><img src="/images/win95-icons/clock-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Timestamp Converter</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="diffchecker"><span>⚖️ Diff Checker</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="diffchecker"><img src="/images/win95-icons/tools-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Diff Checker</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="markdown"><span>📑 Markdown Editor</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="markdown"><img src="/images/win95-icons/document-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Markdown Editor</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="apitester"><span>🌐 API Tester</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="apitester"><img src="/images/win95-icons/network-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>API Tester</span></button>` },

  // Internet
  { from: `<span>🌐</span><span>Internet</span>`, to: `<img src="/images/win95-icons/ie-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Internet</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="ie"><span>🌐 Internet Explorer</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="ie"><img src="/images/win95-icons/ie-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Internet Explorer</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="network"><span>⭐ Favorites</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="network"><img src="/images/win95-icons/folder-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Favorites</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="network"><span>⚙️ Internet Options</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="network"><img src="/images/win95-icons/control-panel-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Internet Options</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="guestbook"><span>📖 Guestbook</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="guestbook"><img src="/images/win95-icons/document-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Guestbook</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" id="sm-internet-restore"><span>🗖 Restore Piush KS Portfolio</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" id="sm-internet-restore"><img src="/images/win95-icons/portfolio.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Restore Piush KS Portfolio</span></button>` },

  // Productivity
  { from: `<span>📅</span><span>Productivity</span>`, to: `<img src="/images/win95-icons/clock-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Productivity</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="calendar"><span>📅 Calendar</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="calendar"><img src="/images/win95-icons/clock-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Calendar</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="clock"><span>⏰ Clock & Alarms</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="clock"><img src="/images/win95-icons/clock-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Clock & Alarms</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="stickynotes"><span>📝 Sticky Notes</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="stickynotes"><img src="/images/win95-icons/document-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Sticky Notes</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="todolist"><span>☑️ To-Do List</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="todolist"><img src="/images/win95-icons/document-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>To-Do List</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="addressbook"><span>📇 Contact Manager</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="addressbook"><img src="/images/win95-icons/folder-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Contact Manager</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="filesearch"><span>🔍 File Search</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="filesearch"><img src="/images/win95-icons/find-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>File Search</span></button>` },

  // Base programs items
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="dos"><span>⬛ MS-DOS Prompt</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="dos"><img src="/images/win95-icons/dos-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>MS-DOS Prompt</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="explorer"><span>🗂️ Windows Explorer</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="explorer"><img src="/images/win95-icons/folder-open-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Windows Explorer</span></button>` },

  // Documents menu
  { from: `<span>📄</span>\n                <span>Documents</span>`, to: `<img src="/images/win95-icons/document-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />\n                <span>Documents</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" id="sm-doc-readme"><span>📝 README.TXT</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" id="sm-doc-readme"><img src="/images/win95-icons/notepad-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>README.TXT</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="notepad"><span>📝 ABOUT.TXT</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="notepad"><img src="/images/win95-icons/notepad-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>ABOUT.TXT</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="notepad"><span>📝 PROJECTS.TXT</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="notepad"><img src="/images/win95-icons/notepad-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>PROJECTS.TXT</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="notepad"><span>📝 SKILLS.TXT</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="notepad"><img src="/images/win95-icons/notepad-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>SKILLS.TXT</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="explorer"><span>📁 My Documents</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="explorer"><img src="/images/win95-icons/folder-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>My Documents</span></button>` },

  // Favorites menu
  { from: `<span>⭐</span>\n                <span>Favorites</span>`, to: `<img src="/images/win95-icons/folder-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />\n                <span>Favorites</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" id="sm-fav-portfolio"><span>🚀 My Portfolio</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" id="sm-fav-portfolio"><img src="/images/win95-icons/portfolio.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>My Portfolio</span></button>` },
  { from: `<a href="/work/" class="retro-menu-item !py-1 text-black no-underline"><span>💼 My Projects</span></a>`, to: `<a href="/work/" class="retro-menu-item !py-1 text-black no-underline flex items-center gap-2"><img src="/images/win95-icons/folder-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>My Projects</span></a>` },
  { from: `<a href="/blog/" class="retro-menu-item !py-1 text-black no-underline"><span>📰 My Blog</span></a>`, to: `<a href="/blog/" class="retro-menu-item !py-1 text-black no-underline flex items-center gap-2"><img src="/images/win95-icons/document-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>My Blog</span></a>` },
  { from: `<a href="/quiz/" class="retro-menu-item !py-1 text-black no-underline"><span>⚡ Developer Quiz</span></a>`, to: `<a href="/quiz/" class="retro-menu-item !py-1 text-black no-underline flex items-center gap-2"><img src="/images/win95-icons/quiz-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Developer Quiz</span></a>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="network"><span>🌐 My Links</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="network"><img src="/images/win95-icons/network-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>My Links</span></button>` },

  // Settings menu
  { from: `<span>⚙️</span>\n                <span>Settings</span>`, to: `<img src="/images/win95-icons/control-panel-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />\n                <span>Settings</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="controlpanel"><span>⚙️ Control Panel</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="controlpanel"><img src="/images/win95-icons/control-panel-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Control Panel</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" id="sm-settings-display"><span>🖥️ Display Properties</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" id="sm-settings-display"><img src="/images/win95-icons/computer-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Display Properties</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" id="sm-settings-sysinfo"><span>ℹ️ System Properties</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" id="sm-settings-sysinfo"><img src="/images/win95-icons/sysinfo-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>System Properties</span></button>` },

  // Find menu
  { from: `<span>🔍</span>\n                <span>Find</span>`, to: `<img src="/images/win95-icons/find-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />\n                <span>Find</span>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="filesearch"><span>📄 Files or Folders...</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="filesearch"><img src="/images/win95-icons/find-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Files or Folders...</span></button>` },
  { from: `<button type="button" class="retro-menu-item !py-1" data-app="network"><span>🖥️ Computer...</span></button>`, to: `<button type="button" class="retro-menu-item !py-1 flex items-center gap-2" data-app="network"><img src="/images/win95-icons/computer-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" /><span>Computer...</span></button>` },

  // Help, Run, Restore, Shut Down
  { from: `<span>❓</span>\n              <span>Help</span>`, to: `<img src="/images/win95-icons/help-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />\n              <span>Help</span>` },
  { from: `<span>🏃</span>\n              <span>Run...</span>`, to: `<img src="/images/win95-icons/run-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />\n              <span>Run...</span>` },
  { from: `<span>🗖</span>\n              <span>Restore Website</span>`, to: `<img src="/images/win95-icons/portfolio.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />\n              <span>Restore Website</span>` },
  { from: `<span>🛑</span>\n              <span>Shut Down...</span>`, to: `<img src="/images/win95-icons/shutdown-16.png" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />\n              <span>Shut Down...</span>` },
];

let replacedCount = 0;
for (const item of menuReplacements) {
  if (content.includes(item.from)) {
    content = content.replace(item.from, item.to);
    replacedCount++;
  } else {
    console.warn('Could not match menu item:', item.from.slice(0, 40));
  }
}

console.log(`Replaced ${replacedCount} of ${menuReplacements.length} menu items`);

// Verify no em-dash in content
if (content.includes('\u2014')) {
  console.warn('Found em-dash in content, replacing with en-dash');
  content = content.replace(/\u2014/g, '–');
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully updated Win95Desktop.astro with authentic Windows 95 icons!');
