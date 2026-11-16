const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9254;
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
  console.log('Starting headless Chrome for Internet Explorer verification...');
  const tmpProfile = `/tmp/chrome-test-ie-${Date.now()}`;
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

    // Wait for page load
    await sleep(2000);

    // Minimize website to desktop
    await cdp.evaluate(`window.minimizeToDesktop();`);
    await sleep(800);

    // Launch Internet Explorer by double-clicking The Internet icon
    console.log('Launching Internet Explorer from desktop...');
    await cdp.evaluate(`
      (() => {
        const ieBtn = document.querySelector('#d-icon-ie');
        if (ieBtn) ieBtn.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      })()
    `);
    await sleep(1500);

    // Check IE titlebar icon and taskbar button icon
    const ieIcons = await cdp.evaluate(`
      (() => {
        const ieWindow = Array.from(document.querySelectorAll('.win95-window')).find(w => w.textContent.includes('Internet Explorer'));
        const titleImg = ieWindow?.querySelector('.retro-titlebar img')?.getAttribute('src');
        const taskbarBtn = Array.from(document.querySelectorAll('.win95-taskbar-item')).find(b => b.textContent.includes('Internet Explorer'));
        const taskbarImg = taskbarBtn?.querySelector('img')?.getAttribute('src');
        return { titleImg, taskbarImg };
      })()
    `);
    console.log('Internet Explorer Window & Taskbar Icons:', ieIcons);

    // Capture screenshot of Internet Explorer at default start page (piush.com)
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_default_homepage_authentic.png`);

    // Navigate to google.com
    console.log('Navigating to google.com in Internet Explorer...');
    await cdp.evaluate(`
      (() => {
        const addrInput = document.querySelector('#ie-address-input');
        const goBtn = document.querySelector('#ie-go-btn');
        if (addrInput && goBtn) {
          addrInput.value = 'https://google.com/';
          goBtn.click();
        }
      })()
    `);
    await sleep(1000);

    // Capture screenshot of Google 1998 search page in Internet Explorer
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_google_search_authentic.png`);

    cdp.close();
    console.log('Internet Explorer test completed successfully!');
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
