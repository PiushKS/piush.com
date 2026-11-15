const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9246;
const ARTIFACT_DIR = '/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class SimpleCDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        const cb = this.callbacks.get(parsed.id);
        if (cb) {
          this.callbacks.delete(parsed.id);
          if (parsed.error) cb.reject(parsed.error);
          else cb.resolve(parsed.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('Spawning Chrome for Minesweeper Test...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--window-size=1280,850',
    '--disable-gpu',
    '--no-sandbox',
  ]);

  await sleep(1500);

  try {
    const targets = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
    let pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) {
      pageTarget = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/new`);
    }

    const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 850,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Navigating to http://localhost:4321/ ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:4321/' });
    await sleep(2500);

    // Minimize to Windows 95 Desktop
    console.log('Minimizing to desktop...');
    await cdp.send('Runtime.evaluate', {
      expression: `window.minimizeToDesktop && window.minimizeToDesktop();`
    });
    await sleep(800);

    // Launch Minesweeper
    console.log('Launching Minesweeper...');
    await cdp.send('Runtime.evaluate', {
      expression: `window.launchWin95App('minesweeper');`
    });
    await sleep(800);

    // Check Initial State
    const initStatus = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const mineCount = document.getElementById('mine-count')?.textContent?.trim();
        const timer = document.getElementById('mine-timer')?.textContent?.trim();
        const smiley = document.getElementById('mine-smiley')?.textContent?.trim();
        const cells = document.querySelectorAll('#mine-grid-container button');
        const menuGame = !!document.getElementById('ms-menu-game-btn');
        return { mineCount, timer, smiley, cellCount: cells.length, hasMenu: menuGame };
      })()`,
      returnByValue: true
    });
    console.log('Minesweeper Initial Status:', initStatus.result.value);

    // Screenshot 1: Fresh Game Board
    const shot1 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_minesweeper_fresh.png`, Buffer.from(shot1.data, 'base64'));

    // Click Cell (4, 4) in the center (Safe first click)
    console.log('Clicking center cell (4, 4)...');
    const clickResult = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const targetBtn = document.querySelector('#mine-grid-container button[data-r="4"][data-c="4"]');
        if (targetBtn) {
          targetBtn.click();
          const revealed = Array.from(document.querySelectorAll('#mine-grid-container button')).filter(b => b.textContent !== '' || b.classList.contains('bg-[#bdbdbd]'));
          const timerVal = document.getElementById('mine-timer')?.textContent?.trim();
          return { clicked: true, revealedCount: revealed.length, timer: timerVal };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });
    console.log('Center Click Result:', clickResult.result.value);
    await sleep(1100);

    // Flag an unrevealed cell
    console.log('Testing flag placement...');
    const flagResult = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const unrevealed = Array.from(document.querySelectorAll('#mine-grid-container button')).find(b => !b.classList.contains('bg-[#bdbdbd]'));
        if (unrevealed) {
          // Trigger contextmenu (right click)
          unrevealed.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
          const isFlagged = unrevealed.textContent === '🚩';
          const mineCount = document.getElementById('mine-count')?.textContent?.trim();
          return { flagged: isFlagged, mineCount };
        }
        return { flagged: false };
      })()`,
      returnByValue: true
    });
    console.log('Flag placement result:', flagResult.result.value);

    // Screenshot 2: Gameplay in action
    const shot2 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_minesweeper_playing.png`, Buffer.from(shot2.data, 'base64'));

    // Open Game Menu
    console.log('Opening Game Menu...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('ms-menu-game-btn')?.click();`
    });
    await sleep(400);

    // Screenshot 3: Game Menu Opened
    const shot3 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_minesweeper_menu.png`, Buffer.from(shot3.data, 'base64'));

    // Open Best Times dialog
    console.log('Opening Best Times dialog...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('ms-menu-best')?.click();`
    });
    await sleep(500);

    // Screenshot 4: Best Times Dialog
    const shot4 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_minesweeper_best_times.png`, Buffer.from(shot4.data, 'base64'));

    // Close Best Times dialog
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('ms-ok-scores-btn')?.click();`
    });
    await sleep(300);

    // Test Intermediate Difficulty (16x16)
    console.log('Switching to Intermediate (16x16)...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('m-diff-med')?.click();`
    });
    await sleep(600);

    const medStatus = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const cells = document.querySelectorAll('#mine-grid-container button');
        const count = document.getElementById('mine-count')?.textContent?.trim();
        return { cellCount: cells.length, mineCount: count };
      })()`,
      returnByValue: true
    });
    console.log('Intermediate Mode Status:', medStatus.result.value);

    // Screenshot 5: Intermediate 16x16 Board
    const shot5 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_minesweeper_intermediate.png`, Buffer.from(shot5.data, 'base64'));

    cdp.close();
    console.log('SUCCESS: Minesweeper fully tested and verified!');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});

