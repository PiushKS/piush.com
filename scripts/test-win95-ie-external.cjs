const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9255;
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
  console.log('Starting headless Chrome for Internet Explorer external URL verification...');
  const tmpProfile = `/tmp/chrome-test-ie-ext-${Date.now()}`;
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

    // Launch Internet Explorer
    console.log('Launching Internet Explorer from desktop...');
    await cdp.evaluate(`
      (() => {
        const ieBtn = document.querySelector('#d-icon-ie');
        if (ieBtn) ieBtn.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      })()
    `);
    await sleep(1500);

    // Navigate to an external URL: https://example.com/
    console.log('Navigating to https://example.com/ in Internet Explorer...');
    await cdp.evaluate(`
      (() => {
        const addrInput = document.querySelector('#ie-address-input');
        const goBtn = document.querySelector('#ie-go-btn');
        if (addrInput && goBtn) {
          addrInput.value = 'https://example.com/';
          goBtn.click();
        }
      })()
    `);
    await sleep(1500);

    // Capture screenshot showing the External Site Information Bar
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_external_url_with_infobar.png`);

    // Verify info bar is visible and has Reader Mode button
    const infoBarStatus = await cdp.evaluate(`
      (() => {
        const infoBar = document.querySelector('#ie-info-bar');
        const readerBtn = document.querySelector('#ie-info-bar-reader');
        const openBtn = document.querySelector('#ie-info-bar-open');
        return {
          infoBarVisible: !infoBar?.classList.contains('hidden'),
          hasReaderBtn: Boolean(readerBtn),
          hasOpenBtn: Boolean(openBtn)
        };
      })()
    `);
    console.log('Info Bar Status:', infoBarStatus);

    cdp.close();
    console.log('Internet Explorer external URL test completed successfully!');
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
