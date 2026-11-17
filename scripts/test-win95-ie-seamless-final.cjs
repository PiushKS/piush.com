const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9275;
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

  async screenshot(filePath, clip) {
    const params = { format: 'png' };
    if (clip) params.clip = clip;
    const res = await this.send('Page.captureScreenshot', params);
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${filePath}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('Starting Chrome for Internet Explorer & Desktop Icon verification...');
  const tmpProfile = `/tmp/chrome-test-seamless-${Date.now()}`;
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

    await sleep(2000);

    // 1. Minimize to desktop
    await cdp.evaluate(`window.minimizeToDesktop();`);
    await sleep(800);

    // Check desktop icon for The Internet
    const desktopIconInfo = await cdp.evaluate(`
      (() => {
        const btn = document.querySelector('#d-icon-ie');
        const img = btn?.querySelector('img');
        const label = btn?.querySelector('.win95-desktop-icon-label');
        const style = label ? window.getComputedStyle(label) : null;
        return {
          imgSrc: img?.getAttribute('src'),
          fontFamily: style?.fontFamily,
          fontSize: style?.fontSize,
          fontWeight: style?.fontWeight,
          textShadow: style?.textShadow,
          labelText: label?.textContent
        };
      })()
    `);
    console.log('Desktop Icon Verification:', desktopIconInfo);

    // Capture zoomed desktop icon screenshot
    const box = await cdp.evaluate(`
      (() => {
        const el = document.querySelector('#d-icon-ie');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, scale: 1 };
      })()
    `);
    if (box) {
      await cdp.screenshot(`${ARTIFACT_DIR}/win95_desktop_ie_icon_authentic.png`, {
        x: Math.max(0, box.x - 20),
        y: Math.max(0, box.y - 20),
        width: box.width + 40,
        height: box.height + 40,
        scale: 2,
      });
    }

    // 2. Launch Internet Explorer by double-clicking The Internet icon
    console.log('Launching Internet Explorer...');
    await cdp.evaluate(`
      (() => {
        const ieBtn = document.querySelector('#d-icon-ie');
        if (ieBtn) ieBtn.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      })()
    `);
    await sleep(1500);

    // Check default state (piush.com)
    const ieDefaultState = await cdp.evaluate(`
      (() => {
        const addr = document.querySelector('#ie-address-input')?.value;
        const iframe = document.querySelector('#ie-web-iframe');
        const pageContainer = document.querySelector('#ie-page-container');
        const toolbarIcons = Array.from(document.querySelectorAll('#ie-tb-back, #ie-tb-forward, #ie-tb-stop, #ie-tb-refresh, #ie-tb-home, #ie-tb-search, #ie-tb-favorites, #ie-tb-print, #ie-tb-font, #ie-tb-ext'))
          .map(b => ({ id: b.id, src: b.querySelector('img')?.getAttribute('src') }));
        const globeSrc = document.querySelector('#ie-globe-img')?.getAttribute('src');

        return {
          addr,
          iframeVisible: !iframe?.classList.contains('hidden'),
          iframeSrc: iframe?.getAttribute('src'),
          pageVisible: !pageContainer?.classList.contains('hidden'),
          toolbarIcons,
          globeSrc
        };
      })()
    `);
    console.log('Internet Explorer Default State:', ieDefaultState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_default_homepage_verified.png`);

    // 3. Navigate to https://google.com/
    console.log('Navigating to https://google.com/ in Internet Explorer...');
    await cdp.evaluate(`
      (() => {
        const addr = document.querySelector('#ie-address-input');
        const go = document.querySelector('#ie-go-btn');
        if (addr && go) {
          addr.value = 'https://google.com/';
          go.click();
        }
      })()
    `);
    await sleep(1200);

    const googlePageState = await cdp.evaluate(`
      (() => {
        const addr = document.querySelector('#ie-address-input')?.value;
        const isGoogleLogo = !!document.querySelector('#google-query-box');
        const title = document.querySelector('.retro-titlebar')?.textContent?.trim();
        return { addr, isGoogleLogo, title };
      })()
    `);
    console.log('Google 1998 Homepage State:', googlePageState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_google_home_verified.png`);

    // 4. Perform a search on Google 1998
    console.log('Searching "windows 95" on Google 1998...');
    await cdp.evaluate(`
      (() => {
        const box = document.querySelector('#google-query-box');
        const btn = document.querySelector('#google-search-btn');
        if (box && btn) {
          box.value = 'windows 95';
          btn.click();
        }
      })()
    `);
    await sleep(1200);

    const searchResultsState = await cdp.evaluate(`
      (() => {
        const addr = document.querySelector('#ie-address-input')?.value;
        const resultsCount = document.querySelectorAll('#google-results-list a').length;
        const firstResult = document.querySelector('#google-results-list a')?.textContent;
        return { addr, resultsCount, firstResult };
      })()
    `);
    console.log('Google Search Results State:', searchResultsState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_google_search_results_verified.png`);

    // 5. Navigate to an external website: https://example.com/ (Live Web Reader)
    console.log('Navigating to https://example.com/ in Live Web Reader...');
    await cdp.evaluate(`
      (() => {
        const addr = document.querySelector('#ie-address-input');
        const go = document.querySelector('#ie-go-btn');
        if (addr && go) {
          addr.value = 'https://example.com/';
          go.click();
        }
      })()
    `);
    await sleep(2500);

    const liveWebState = await cdp.evaluate(`
      (() => {
        const addr = document.querySelector('#ie-address-input')?.value;
        const iframeVisible = !document.querySelector('#ie-web-iframe')?.classList.contains('hidden');
        const pageVisible = !document.querySelector('#ie-page-container')?.classList.contains('hidden');
        const hasLiveBar = !!document.querySelector('.ie-action-newtab');
        const liveBarText = document.querySelector('#ie-page-container [class*="bg-"]')?.textContent?.trim();
        const pageHeading = document.querySelector('#ie-page-container h1')?.textContent?.trim();
        return { addr, iframeVisible, pageVisible, hasLiveBar, liveBarText, pageHeading };
      })()
    `);
    console.log('Live Web Reader State for example.com:', liveWebState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_live_web_reader_verified.png`);

    // 6. Test Home button (returns to piush.com)
    console.log('Clicking Home toolbar button...');
    await cdp.evaluate(`
      (() => {
        const homeBtn = document.querySelector('#ie-tb-home');
        if (homeBtn) homeBtn.click();
      })()
    `);
    await sleep(1000);

    const returnHomeState = await cdp.evaluate(`
      (() => {
        const addr = document.querySelector('#ie-address-input')?.value;
        const iframeVisible = !document.querySelector('#ie-web-iframe')?.classList.contains('hidden');
        return { addr, iframeVisible };
      })()
    `);
    console.log('Return Home State:', returnHomeState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_return_home_verified.png`);

    cdp.close();
    console.log('All verifications completed successfully!');
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
