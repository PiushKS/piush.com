// Piush 95 - Central Application Registry
// Maps all Windows 95 applications, games, accessories, and tools to the Window Manager

import { windowManager, type Win95Window } from './windowManager';
import {
  renderNotepad,
  renderWordPad,
  renderPaint,
  renderCalculator,
  renderCharacterMap,
  renderClipboardViewer,
  renderAddressBook,
  renderPhoneDialer,
} from './apps/accessories';
import {
  renderMinesweeper,
  renderSolitaire,
  renderFreeCell,
  renderHearts,
} from './apps/games';
import {
  renderPinball,
  renderSnake,
  renderChess,
  renderBrickBreaker,
  renderSpaceDefender,
  renderTicTacToe,
  renderMemoryMatch,
  renderReversi,
  render2048,
  renderFallingBlocks,
} from './apps/bonusGames';
import {
  renderMediaPlayer,
  renderCDPlayer,
  renderSoundRecorder,
  renderVolumeControl,
  renderImageViewer,
  renderMIDIPlayer,
} from './apps/multimedia';
import {
  renderDosPrompt,
  renderExplorer,
  renderControlPanel,
  renderScanDisk,
  renderDefrag,
  renderTaskManager,
} from './apps/systemTools';
import {
  renderRegexTester,
  renderBase64Tool,
  renderUrlTool,
  renderHashGenerator,
  renderUuidGenerator,
  renderTimestampConverter,
  renderDiffChecker,
  renderMarkdownEditor,
  renderApiTester,
} from './apps/devTools';
import {
  renderHyperTerminal,
  renderDialUpNetworking,
  renderNetworkNeighborhood,
  renderGuestbook,
} from './apps/communications';
import {
  renderCalendar,
  renderClockAlarms,
  renderStickyNotes,
  renderTodoList,
  renderFileSearch,
  renderHelpSystem,
  renderRunDialog,
} from './apps/productivity';
import {
  renderAccessibilityOptions,
  renderMagnifier,
  renderOnScreenKeyboard,
  toggleHighContrast,
} from './apps/accessibility';

export interface AppDefinition {
  id: string;
  title: string;
  icon: string;
  width?: number;
  height?: number;
  category: string;
  render: (container: HTMLElement, win: Win95Window) => void;
}

export const APPS: Record<string, AppDefinition> = {
  // Accessories
  notepad: { id: 'notepad', title: 'Notepad', icon: '📝', width: 560, height: 420, category: 'Accessories', render: renderNotepad },
  wordpad: { id: 'wordpad', title: 'WordPad', icon: '📄', width: 620, height: 460, category: 'Accessories', render: renderWordPad },
  paint: { id: 'paint', title: 'Paint', icon: '🎨', width: 640, height: 480, category: 'Accessories', render: renderPaint },
  calc: { id: 'calc', title: 'Calculator', icon: '🧮', width: 340, height: 380, category: 'Accessories', render: renderCalculator },
  charmap: { id: 'charmap', title: 'Character Map', icon: '🔤', width: 420, height: 360, category: 'Accessories', render: renderCharacterMap },
  clipbrd: { id: 'clipbrd', title: 'Clipboard Viewer', icon: '📋', width: 440, height: 360, category: 'Accessories', render: renderClipboardViewer },
  addressbook: { id: 'addressbook', title: 'Address Book', icon: '📇', width: 520, height: 420, category: 'Accessories', render: renderAddressBook },
  phonedialer: { id: 'phonedialer', title: 'Phone Dialer', icon: '☎️', width: 360, height: 380, category: 'Accessories', render: renderPhoneDialer },

  // Games
  minesweeper: { id: 'minesweeper', title: 'Minesweeper', icon: '💣', width: 360, height: 440, category: 'Games', render: renderMinesweeper },
  solitaire: { id: 'solitaire', title: 'Solitaire', icon: '🃏', width: 640, height: 480, category: 'Games', render: renderSolitaire },
  freecell: { id: 'freecell', title: 'FreeCell', icon: '🎴', width: 640, height: 480, category: 'Games', render: renderFreeCell },
  hearts: { id: 'hearts', title: 'Hearts', icon: '♥️', width: 580, height: 460, category: 'Games', render: renderHearts },

  // Bonus Games
  pinball: { id: 'pinball', title: '3D Pinball - Space Cadet', icon: '🚀', width: 620, height: 530, category: 'Bonus Games', render: renderPinball },
  snake: { id: 'snake', title: 'Snake 95', icon: '🐍', width: 380, height: 440, category: 'Bonus Games', render: renderSnake },
  chess: { id: 'chess', title: 'Chess 95', icon: '♟️', width: 460, height: 490, category: 'Bonus Games', render: renderChess },
  brickbreaker: { id: 'brickbreaker', title: 'Brick Breaker', icon: '🧱', width: 380, height: 460, category: 'Bonus Games', render: renderBrickBreaker },
  spacedefender: { id: 'spacedefender', title: 'Space Defender', icon: '👾', width: 420, height: 490, category: 'Bonus Games', render: renderSpaceDefender },
  tictactoe: { id: 'tictactoe', title: 'Tic-Tac-Toe', icon: '❌', width: 340, height: 380, category: 'Bonus Games', render: renderTicTacToe },
  memorymatch: { id: 'memorymatch', title: 'Memory Match', icon: '🧠', width: 420, height: 440, category: 'Bonus Games', render: renderMemoryMatch },
  reversi: { id: 'reversi', title: 'Reversi', icon: '⚪', width: 420, height: 460, category: 'Bonus Games', render: renderReversi },
  t2048: { id: 't2048', title: '2048', icon: '🔢', width: 380, height: 440, category: 'Bonus Games', render: render2048 },
  fallingblocks: { id: 'fallingblocks', title: 'Falling Blocks', icon: '🧊', width: 340, height: 480, category: 'Bonus Games', render: renderFallingBlocks },

  // Multimedia
  mediaplayer: { id: 'mediaplayer', title: 'Media Player', icon: '📼', width: 480, height: 360, category: 'Multimedia', render: renderMediaPlayer },
  cdplayer: { id: 'cdplayer', title: 'CD Player', icon: '💿', width: 460, height: 340, category: 'Multimedia', render: renderCDPlayer },
  soundrecorder: { id: 'soundrecorder', title: 'Sound Recorder', icon: '🎙️', width: 420, height: 260, category: 'Multimedia', render: renderSoundRecorder },
  volume: { id: 'volume', title: 'Volume Control', icon: '🔊', width: 490, height: 300, category: 'Multimedia', render: renderVolumeControl },
  imageviewer: { id: 'imageviewer', title: 'Image Viewer', icon: '🖼️', width: 540, height: 420, category: 'Multimedia', render: renderImageViewer },
  midiplayer: { id: 'midiplayer', title: 'MIDI Player', icon: '🎵', width: 420, height: 260, category: 'Multimedia', render: renderMIDIPlayer },

  // System Tools
  dos: { id: 'dos', title: 'MS-DOS Prompt', icon: '⬛', width: 620, height: 420, category: 'System Tools', render: renderDosPrompt },
  explorer: { id: 'explorer', title: 'Windows Explorer', icon: '🗂️', width: 640, height: 440, category: 'System Tools', render: renderExplorer },
  controlpanel: { id: 'controlpanel', title: 'Control Panel', icon: '⚙️', width: 560, height: 380, category: 'System Tools', render: renderControlPanel },
  scandisk: { id: 'scandisk', title: 'ScanDisk', icon: '🖴', width: 460, height: 380, category: 'System Tools', render: renderScanDisk },
  defrag: { id: 'defrag', title: 'Disk Defragmenter', icon: '📊', width: 500, height: 380, category: 'System Tools', render: renderDefrag },
  taskmanager: { id: 'taskmanager', title: 'Task Manager', icon: '📋', width: 420, height: 360, category: 'System Tools', render: renderTaskManager },

  // Communications
  hyperterminal: { id: 'hyperterminal', title: 'HyperTerminal', icon: '💻', width: 580, height: 400, category: 'Communications', render: renderHyperTerminal },
  dialup: { id: 'dialup', title: 'Dial-Up Networking', icon: '📠', width: 420, height: 340, category: 'Communications', render: renderDialUpNetworking },
  network: { id: 'network', title: 'Network Neighborhood', icon: '🌐', width: 520, height: 360, category: 'Communications', render: renderNetworkNeighborhood },
  guestbook: { id: 'guestbook', title: 'Guestbook', icon: '📖', width: 480, height: 400, category: 'Communications', render: renderGuestbook },

  // Productivity
  calendar: { id: 'calendar', title: 'Calendar', icon: '📅', width: 440, height: 420, category: 'Productivity', render: renderCalendar },
  clock: { id: 'clock', title: 'Clock & Alarms', icon: '⏰', width: 380, height: 300, category: 'Productivity', render: renderClockAlarms },
  stickynotes: { id: 'stickynotes', title: 'Sticky Note', icon: '📝', width: 320, height: 260, category: 'Productivity', render: renderStickyNotes },
  todolist: { id: 'todolist', title: 'Task List', icon: '☑️', width: 420, height: 380, category: 'Productivity', render: renderTodoList },
  filesearch: { id: 'filesearch', title: 'Find Files or Folders', icon: '🔍', width: 480, height: 380, category: 'Productivity', render: renderFileSearch },
  help: { id: 'help', title: 'Help Topics', icon: '❓', width: 580, height: 420, category: 'System', render: renderHelpSystem },
  run: { id: 'run', title: 'Run...', icon: '🏃', width: 420, height: 200, category: 'System', render: renderRunDialog },

  // Developer Tools
  regex: { id: 'regex', title: 'Regex Tester', icon: '🔣', width: 540, height: 420, category: 'Developer Tools', render: renderRegexTester },
  base64: { id: 'base64', title: 'Base64 Encoder / Decoder', icon: '🔐', width: 520, height: 420, category: 'Developer Tools', render: renderBase64Tool },
  url: { id: 'url', title: 'URL Encoder / Decoder', icon: '🔗', width: 520, height: 420, category: 'Developer Tools', render: renderUrlTool },
  hash: { id: 'hash', title: 'Hash Generator', icon: '🔑', width: 520, height: 400, category: 'Developer Tools', render: renderHashGenerator },
  uuid: { id: 'uuid', title: 'UUID Generator', icon: '🏷️', width: 460, height: 360, category: 'Developer Tools', render: renderUuidGenerator },
  timestamp: { id: 'timestamp', title: 'Timestamp Converter', icon: '⏱️', width: 460, height: 340, category: 'Developer Tools', render: renderTimestampConverter },
  diff: { id: 'diff', title: 'Diff Checker', icon: '⚖️', width: 560, height: 440, category: 'Developer Tools', render: renderDiffChecker },
  markdown: { id: 'markdown', title: 'Markdown Editor', icon: '📝', width: 620, height: 460, category: 'Developer Tools', render: renderMarkdownEditor },
  apitester: { id: 'apitester', title: 'API Tester', icon: '📡', width: 540, height: 440, category: 'Developer Tools', render: renderApiTester },

  // Accessibility
  accessibility: { id: 'accessibility', title: 'Accessibility Options', icon: '♿', width: 440, height: 380, category: 'Accessibility', render: renderAccessibilityOptions },
  magnifier: { id: 'magnifier', title: 'Magnifier', icon: '🔎', width: 380, height: 300, category: 'Accessibility', render: renderMagnifier },
  osk: { id: 'osk', title: 'On-Screen Keyboard', icon: '⌨️', width: 520, height: 260, category: 'Accessibility', render: renderOnScreenKeyboard },
};

/**
 * Launch an application by its registered ID
 */
export function launchApp(appId: string): Win95Window | null {
  if (appId === 'highcontrast') {
    toggleHighContrast();
    return null;
  }

  const app = APPS[appId];
  if (!app) {
    console.warn(`Application "${appId}" not found in registry.`);
    return null;
  }

  // If already open and minimized, restore it
  const existing = windowManager.getWindowByAppId(appId);
  if (existing) {
    if (existing.isMinimized) existing.restore();
    existing.focus();
    return existing;
  }

  return windowManager.openWindow({
    appId: app.id,
    title: app.title,
    icon: app.icon,
    width: app.width,
    height: app.height,
    render: app.render,
  });
}

// Expose launcher globally on window
if (typeof window !== 'undefined') {
  (window as unknown as { launchWin95App?: typeof launchApp }).launchWin95App = launchApp;
}

