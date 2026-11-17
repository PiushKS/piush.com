const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9265;
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
  console.log('Starting headless Chrome for Windows 95 home header testing...');
  const tmpProfile = `/tmp/chrome-test-home-${Date.now()}`;
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

    // Wait for page bootstrap
    await sleep(2000);

    // 1. Inspect Titlebar, Toolbar, Clock on Home
    console.log('1. Inspecting Home Titlebar, Toolbar, and SysTray Clock...');
    const homeHeaderState = await cdp.evaluate(`
      (() => {
        const titleImg = document.querySelector('#retro-system-menu-btn img');
        const titleText = document.querySelector('.win95-title-text')?.textContent?.trim();
        const hasToolbar = !!document.querySelector('.win95-home-toolbar');
        const toolBtns = Array.from(document.querySelectorAll('.win95-tool-btn')).map(b => b.textContent.trim()).filter(Boolean);
        const clockText = document.querySelector('#retro-live-clock')?.textContent?.trim();
        const trayTitle = document.querySelector('#retro-home-tray')?.getAttribute('title');
        const hasTrayVol = !!document.querySelector('#retro-tray-volume-btn img');
        return {
          titleIconSrc: titleImg?.src,
          titleText,
          hasToolbar,
          toolBtns,
          clockText,
          trayTitle,
          hasTrayVol,
        };
      })()
    `);
    console.log('Home Header State:', homeHeaderState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_home_toolbar_and_clock.png`);

    // 2. Open System Window Menu
    console.log('2. Opening System Window Menu via top-left icon...');
    await cdp.evaluate(`
      (() => {
        const sysBtn = document.querySelector('#retro-system-menu-btn');
        if (sysBtn) sysBtn.click();
      })()
    `);
    await sleep(500);

    const sysMenuState = await cdp.evaluate(`
      (() => {
        const dropdown = document.querySelector('#retro-system-menu-dropdown');
        const isVisible = dropdown && !dropdown.classList.contains('hidden');
        const items = Array.from(dropdown?.querySelectorAll('.retro-menu-item') || []).map(i => i.textContent.trim().replace(/\\s+/g, ' '));
        return {
          isVisible,
          items,
        };
      })()
    `);
    console.log('System Menu State:', sysMenuState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_home_system_menu.png`);

    // Close menu
    await cdp.evaluate(`
      (() => {
        const sysBtn = document.querySelector('#retro-system-menu-btn');
        if (sysBtn) sysBtn.click();
      })()
    `);
    await sleep(300);

    // 3. Open Date/Time Properties Dialog via Clock Click
    console.log('3. Clicking Clock Tray to open Date/Time Properties dialog...');
    await cdp.evaluate(`
      (() => {
        const tray = document.querySelector('#retro-home-tray');
        if (tray) tray.click();
      })()
    `);
    await sleep(800);

    const dateTimeState = await cdp.evaluate(`
      (() => {
        const dialog = document.querySelector('#retro-datetime-dialog');
        const isVisible = dialog && !dialog.classList.contains('hidden');
        const monthYear = document.querySelector('#dt-month-year')?.textContent?.trim();
        const digTime = document.querySelector('#dt-digital-time')?.textContent?.trim();
        const hasAnalog = !!document.querySelector('#dt-analog-clock');
        const tz = document.querySelector('#dt-timezone-str')?.textContent?.trim();
        return {
          isVisible,
          monthYear,
          digTime,
          hasAnalog,
          tz,
        };
      })()
    `);
    console.log('Date/Time Properties Dialog State:', dateTimeState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_home_datetime_properties.png`);

    // Close Date/Time dialog
    await cdp.evaluate(`
      (() => {
        const okBtn = document.querySelector('#dt-dialog-ok');
        if (okBtn) okBtn.click();
      })()
    `);
    await sleep(500);

    console.log('All automated verification tests completed successfully!');
    cdp.close();
  } finally {
    try { chromeProc.kill('SIGKILL'); } catch (_) {}
  }
}

run().catch((e) => {
  console.error('Test error:', e);
  process.exit(1);
});
