const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9253;
const ARTIFACT_DIR = '/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
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

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${filePath}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('Starting headless Chrome for Authentic Windows 95 Icons verification...');
  const tmpProfile = `/tmp/chrome-test-icons-${Date.now()}`;
  fs.mkdirSync(tmpProfile, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tmpProfile}`,
    '--window-size=1280,800',
    'http://localhost:4321/',
  ]);

  chromeProc.stderr.on('data', (d) => {
    // console.error('chrome stderr:', d.toString());
  });

  try {
    let targets = null;
    for (let i = 0; i < 30; i++) {
      await sleep(300);
      try {
        targets = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json`);
        if (targets && targets.length > 0) break;
      } catch (_) {}
    }

    if (!targets || targets.length === 0) {
      throw new Error('Could not connect to Chrome debugging target');
    }

    const pageTarget = targets.find((t) => t.type === 'page');
    const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    console.log('Connected to Chrome CDP!');

    // Wait for page to load
    await sleep(2000);

    // 1. Minimize website to Windows 95 Desktop
    console.log('Minimizing website to desktop...');
    await cdp.evaluate(`
      window.minimizeToDesktop();
    `);
    await sleep(1000);

    // Verify desktop icons
    const desktopIconSources = await cdp.evaluate(`
      (() => {
        const quizImg = document.querySelector('#d-icon-quiz img')?.getAttribute('src');
        const toolsImg = document.querySelector('#d-icon-tools img')?.getAttribute('src');
        const calcImg = document.querySelector('#d-icon-calc img')?.getAttribute('src');
        const paintImg = document.querySelector('#d-icon-paint img')?.getAttribute('src');
        const startFlagImg = document.querySelector('#win95-start-btn img')?.getAttribute('src');
        return { quizImg, toolsImg, calcImg, paintImg, startFlagImg };
      })()
    `);
    console.log('Desktop Icon Sources:', desktopIconSources);

    // Capture Desktop screenshot
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_desktop_authentic_icons.png`);

    // 2. Open Start Menu
    console.log('Opening Start Menu...');
    await cdp.evaluate(`
      (() => {
        const startBtn = document.querySelector('#win95-start-btn');
        if (startBtn) startBtn.click();
      })()
    `);
    await sleep(800);

    // Capture Start Menu screenshot
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_start_menu_authentic_icons.png`);

    // 3. Launch Notepad and Calculator
    console.log('Launching Notepad and Calculator...');
    await cdp.evaluate(`
      (() => {
        const notepadBtn = document.querySelector('#d-icon-app-notepad');
        if (notepadBtn) {
          notepadBtn.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        }
      })()
    `);
    await sleep(600);

    await cdp.evaluate(`
      (() => {
        const calcBtn = document.querySelector('#d-icon-calc');
        if (calcBtn) {
          calcBtn.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        }
      })()
    `);
    await sleep(800);

    // Check titlebar and taskbar icon markup
    const windowIcons = await cdp.evaluate(`
      (() => {
        const titlebarImgs = Array.from(document.querySelectorAll('.retro-titlebar img')).map(img => img.getAttribute('src'));
        const taskbarImgs = Array.from(document.querySelectorAll('.win95-taskbar-item img')).map(img => img.getAttribute('src'));
        return { titlebarImgs, taskbarImgs };
      })()
    `);
    console.log('Active Window & Taskbar Icons:', windowIcons);

    // Capture Windows & Taskbar screenshot
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_windows_and_taskbar_authentic_icons.png`);

    // 4. Launch Solitaire and Minesweeper
    console.log('Launching Solitaire and Minesweeper...');
    await cdp.evaluate(`
      (() => {
        const solBtn = document.querySelector('#d-icon-solitaire');
        if (solBtn) solBtn.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      })()
    `);
    await sleep(600);

    await cdp.evaluate(`
      (() => {
        const mineBtn = document.querySelector('#d-icon-minesweeper');
        if (mineBtn) mineBtn.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      })()
    `);
    await sleep(800);

    // Capture Games screenshot
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_games_authentic_icons.png`);

    cdp.close();
    console.log('CDP test completed successfully!');
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
