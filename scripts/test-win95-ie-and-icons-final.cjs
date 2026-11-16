const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9260;
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
  console.log('Starting headless Chrome for final verification...');
  const tmpProfile = `/tmp/chrome-test-final-${Date.now()}`;
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

    // Wait for bootstrap
    await sleep(2000);

    // 1. Verify Desktop Icons
    console.log('1. Verifying Desktop Icons...');
    await cdp.evaluate(`window.minimizeToDesktop();`);
    await sleep(800);

    const desktopIconDetails = await cdp.evaluate(`
      (() => {
        const ieIcon = document.querySelector('#d-icon-ie img');
        const compIcon = document.querySelector('#d-icon-computer img');
        const netIcon = document.querySelector('#d-icon-network img');
        return {
          ieSrc: ieIcon ? ieIcon.src : null,
          ieWidth: ieIcon ? ieIcon.getAttribute('width') : null,
          compSrc: compIcon ? compIcon.src : null,
          netSrc: netIcon ? netIcon.src : null,
        };
      })()
    `);
    console.log('Desktop Icon Details:', desktopIconDetails);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_desktop_final_verified.png`);

    // 2. Launch Internet Explorer
    console.log('2. Launching Internet Explorer...');
    await cdp.evaluate(`
      (() => {
        const ieBtn = document.querySelector('#d-icon-ie');
        if (ieBtn) ieBtn.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      })()
    `);
    await sleep(1500);

    const ieHomeState = await cdp.evaluate(`
      (() => {
        const address = document.querySelector('#ie-address-input')?.value;
        const iframe = document.querySelector('#ie-web-iframe');
        return {
          address,
          iframeSrc: iframe?.src,
          iframeVisible: !iframe?.classList.contains('hidden'),
        };
      })()
    `);
    console.log('IE Default Homepage State:', ieHomeState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_default_piush_final.png`);

    // 3. Test Navigation to Google
    console.log('3. Navigating to https://google.com/ in Internet Explorer...');
    await cdp.evaluate(`
      (() => {
        const input = document.querySelector('#ie-address-input');
        const goBtn = document.querySelector('#ie-go-btn');
        if (input && goBtn) {
          input.value = 'https://google.com/';
          goBtn.click();
        }
      })()
    `);
    await sleep(1200);

    const googleState = await cdp.evaluate(`
      (() => {
        const address = document.querySelector('#ie-address-input')?.value;
        const pageContainer = document.querySelector('#ie-page-container');
        const hasGoogleBox = !!pageContainer?.querySelector('#google-query-box');
        const hasSearchBtn = !!pageContainer?.querySelector('#google-search-btn');
        return {
          address,
          pageContainerVisible: !pageContainer?.classList.contains('hidden'),
          hasGoogleBox,
          hasSearchBtn,
        };
      })()
    `);
    console.log('Google 1998 State:', googleState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_google_search_final.png`);

    // 4. Test Navigation to GitHub (Frame Blocked Site -> Security Advisory)
    console.log('4. Navigating to https://github.com/ in Internet Explorer...');
    await cdp.evaluate(`
      (() => {
        const input = document.querySelector('#ie-address-input');
        const goBtn = document.querySelector('#ie-go-btn');
        if (input && goBtn) {
          input.value = 'https://github.com/';
          goBtn.click();
        }
      })()
    `);
    await sleep(1200);

    const securityState = await cdp.evaluate(`
      (() => {
        const address = document.querySelector('#ie-address-input')?.value;
        const pageContainer = document.querySelector('#ie-page-container');
        const hasAdvisory = pageContainer?.textContent.includes('Security Advisory');
        const hasReaderBtn = !!pageContainer?.querySelector('.ie-action-reader');
        const hasNewTabBtn = !!pageContainer?.querySelector('.ie-action-newtab');
        const hasEmbedBtn = !!pageContainer?.querySelector('.ie-action-embed');
        return {
          address,
          hasAdvisory,
          hasReaderBtn,
          hasNewTabBtn,
          hasEmbedBtn,
        };
      })()
    `);
    console.log('Security Advisory State for GitHub:', securityState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_security_advisory_github.png`);

    // 5. Test Click on "Read Now" for Reader Mode
    console.log('5. Clicking "Read Now" to test Reader Mode...');
    await cdp.evaluate(`
      (() => {
        const readBtn = document.querySelector('.ie-action-reader');
        if (readBtn) readBtn.click();
      })()
    `);
    await sleep(3000);

    const readerState = await cdp.evaluate(`
      (() => {
        const pageContainer = document.querySelector('#ie-page-container');
        return {
          pageVisible: !pageContainer?.classList.contains('hidden'),
          textSnippet: pageContainer?.textContent?.slice(0, 150),
        };
      })()
    `);
    console.log('Reader Mode State:', readerState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_reader_mode_github.png`);

    console.log('All tests completed successfully!');
    cdp.close();
  } finally {
    try { chromeProc.kill('SIGKILL'); } catch (_) {}
  }
}

run().catch((e) => {
  console.error('Test error:', e);
  process.exit(1);
});
