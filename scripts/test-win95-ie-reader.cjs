const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9252;
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
  console.log('Testing Reader Mode in Internet Explorer...');
  const tmpProfile = `/tmp/chrome-test-ie-reader-${Date.now()}`;
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
    let version = null;
    for (let i = 0; i < 30; i++) {
      await sleep(300);
      try {
        version = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
        if (version) break;
      } catch (_) {}
    }

    if (!version) throw new Error('Could not connect to Chrome debugging port.');

    const targets = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json`);
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found.');

    const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    console.log('Connected to CDP websocket.');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    await sleep(2500);

    // Minimize to desktop if needed
    await cdp.evaluate(`
      (() => {
        if (window.minimizeToDesktop) window.minimizeToDesktop();
      })()
    `);
    await sleep(500);

    // Launch IE
    await cdp.evaluate(`
      (() => {
        if (window.launchWin95App) window.launchWin95App('ie');
      })()
    `);
    await sleep(1000);

    // Navigate to an external URL that displays info bar
    console.log('Navigating to external URL https://example.com/...');
    await cdp.evaluate(`
      (() => {
        const addressEl = document.getElementById('ie-address-input');
        const goBtn = document.getElementById('ie-go-btn');
        if (addressEl && goBtn) {
          addressEl.value = 'https://example.com/';
          goBtn.click();
        }
      })()
    `);
    await sleep(1000);

    const infoBarState = await cdp.evaluate(`
      (() => {
        const infoBar = document.getElementById('ie-info-bar');
        const readerBtn = document.getElementById('ie-info-bar-reader');
        const openBtn = document.getElementById('ie-info-bar-open');
        return {
          infoBarVisible: infoBar && !infoBar.classList.contains('hidden'),
          hasReaderBtn: !!readerBtn,
          hasOpenBtn: !!openBtn,
        };
      })()
    `);
    console.log('Info Bar State for external site:', infoBarState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_external_infobar.png`);

    console.log('Clicking Reader Mode button...');
    await cdp.evaluate(`
      (() => {
        const readerBtn = document.getElementById('ie-info-bar-reader');
        if (readerBtn) readerBtn.click();
      })()
    `);
    await sleep(2500);

    const readerState = await cdp.evaluate(`
      (() => {
        const pageContainer = document.getElementById('ie-page-container');
        const exitBtn = document.getElementById('ie-exit-reader-btn');
        return {
          pageContainerVisible: pageContainer && !pageContainer.classList.contains('hidden'),
          hasExitBtn: !!exitBtn,
        };
      })()
    `);
    console.log('Reader Mode State:', readerState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_reader_view.png`);

    console.log('Reader mode test finished cleanly!');
    cdp.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch((err) => {
  console.error('Reader test failed:', err);
  process.exit(1);
});
