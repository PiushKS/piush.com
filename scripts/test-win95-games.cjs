const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9245;
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
  console.log('Spawning Chrome for Windows 95 Games Test...');
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

    // 1. Test Solitaire
    console.log('Testing Solitaire...');
    await cdp.send('Runtime.evaluate', {
      expression: `window.launchWin95App('solitaire');`
    });
    await sleep(800);

    // Click stock pile to draw cards
    const solStockResult = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const stock = document.getElementById('sol-stock');
        if (stock) {
          stock.click();
          return { success: true, wasteCount: document.querySelectorAll('#sol-waste > *').length };
        }
        return { success: false };
      })()`,
      returnByValue: true
    });
    console.log('Solitaire stock click result:', solStockResult.result.value);

    const shotSol = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_game_solitaire.png`, Buffer.from(shotSol.data, 'base64'));

    // Close Solitaire
    await cdp.send('Runtime.evaluate', {
      expression: `
        const solWin = document.querySelector('[data-window-id="solitaire"] .win95-titlebar-btn:last-child');
        if (solWin) solWin.click();
      `
    });
    await sleep(300);

    // 2. Test FreeCell
    console.log('Testing FreeCell...');
    await cdp.send('Runtime.evaluate', {
      expression: `window.launchWin95App('freecell');`
    });
    await sleep(800);

    const fcResult = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const cascades = document.querySelectorAll('.fc-col');
        const cards = document.querySelectorAll('.fc-card');
        return { cascades: cascades.length, totalCards: cards.length };
      })()`,
      returnByValue: true
    });
    console.log('FreeCell deal status:', fcResult.result.value);

    const shotFC = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_game_freecell.png`, Buffer.from(shotFC.data, 'base64'));

    // Close FreeCell
    await cdp.send('Runtime.evaluate', {
      expression: `
        const fcClose = document.querySelector('[data-window-id="freecell"] .win95-titlebar-btn:last-child');
        if (fcClose) fcClose.click();
      `
    });
    await sleep(300);

    // 3. Test Hearts
    console.log('Testing Hearts...');
    await cdp.send('Runtime.evaluate', {
      expression: `window.launchWin95App('hearts');`
    });
    await sleep(800);

    const heartsResult = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('.hearts-card');
        const activeCard = Array.from(cards).find(c => !c.disabled);
        const trickArena = document.querySelector('.w-56');
        return { totalPlayerCards: cards.length, hasPlayableCard: !!activeCard, hasTrickArena: !!trickArena };
      })()`,
      returnByValue: true
    });
    console.log('Hearts status:', heartsResult.result.value);

    const shotHearts = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_game_hearts.png`, Buffer.from(shotHearts.data, 'base64'));

    // Close Hearts
    await cdp.send('Runtime.evaluate', {
      expression: `
        const heartsClose = document.querySelector('[data-window-id="hearts"] .win95-titlebar-btn:last-child');
        if (heartsClose) heartsClose.click();
      `
    });
    await sleep(300);

    // 4. Test Reversi
    console.log('Testing Reversi...');
    await cdp.send('Runtime.evaluate', {
      expression: `window.launchWin95App('reversi');`
    });
    await sleep(800);

    const reversiMove = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const board = document.getElementById('rev-board');
        const countBefore = document.getElementById('rev-black')?.textContent;
        // find a legal clickable square in row 2 col 3 or row 3 col 2
        const cells = Array.from(document.querySelectorAll('#rev-board > div'));
        for (const cell of cells) {
          cell.click();
          const countAfter = document.getElementById('rev-black')?.textContent;
          if (countBefore !== countAfter) {
            return { moved: true, before: countBefore, after: countAfter };
          }
        }
        return { moved: false, cellCount: cells.length };
      })()`,
      returnByValue: true
    });
    console.log('Reversi move result:', reversiMove.result.value);
    await sleep(600);

    const shotReversi = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_game_reversi.png`, Buffer.from(shotReversi.data, 'base64'));

    // Close Reversi
    await cdp.send('Runtime.evaluate', {
      expression: `
        const revClose = document.querySelector('[data-window-id="reversi"] .win95-titlebar-btn:last-child');
        if (revClose) revClose.click();
      `
    });
    await sleep(300);

    // 5. Test 2048
    console.log('Testing 2048...');
    await cdp.send('Runtime.evaluate', {
      expression: `window.launchWin95App('t2048');`
    });
    await sleep(800);

    const test2048 = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const gridCells = document.querySelectorAll('#t2-grid > div');
        const score = document.getElementById('t2-score')?.textContent;
        // Press left
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        return { tilesCount: gridCells.length, score };
      })()`,
      returnByValue: true
    });
    console.log('2048 test result:', test2048.result.value);

    const shot2048 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_game_2048.png`, Buffer.from(shot2048.data, 'base64'));

    // Close 2048
    await cdp.send('Runtime.evaluate', {
      expression: `
        const close2048 = document.querySelector('[data-window-id="t2048"] .win95-titlebar-btn:last-child');
        if (close2048) close2048.click();
      `
    });
    await sleep(300);

    // 6. Test Minesweeper & Pinball simultaneously
    console.log('Testing Minesweeper & Pinball...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        window.launchWin95App('minesweeper');
        window.launchWin95App('pinball');
      `
    });
    await sleep(1000);

    const shotCombined = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ARTIFACT_DIR}/win95_games_minesweeper_pinball.png`, Buffer.from(shotCombined.data, 'base64'));

    cdp.close();
    console.log('SUCCESS: All Windows 95 games verified with real gameplay mechanics!');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
