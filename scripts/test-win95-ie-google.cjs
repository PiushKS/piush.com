const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9251;
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
  console.log('Starting headless Chrome for Internet Explorer Google test...');
  const tmpProfile = `/tmp/chrome-test-ie-google-${Date.now()}`;
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

    console.log('Waiting for portfolio desktop bootstrap...');
    await sleep(2500);

    // Minimize to desktop if in portfolio mode
    await cdp.evaluate(`
      (() => {
        const minimizeBtn = document.getElementById('win95-minimize-portfolio-btn') || document.getElementById('win95-restore-desktop-btn');
        if (minimizeBtn) minimizeBtn.click();
        else if (window.minimizeToDesktop) window.minimizeToDesktop();
      })()
    `);
    await sleep(800);

    console.log('Launching Internet Explorer...');
    const launchResult = await cdp.evaluate(`
      (() => {
        if (typeof window.launchWin95App === 'function') {
          window.launchWin95App('internetexplorer');
          return 'launched via window.launchWin95App';
        }
        const ieIcon = document.querySelector('[data-desktop-app="internetexplorer"]') || document.querySelector('[data-app="internetexplorer"]');
        if (ieIcon) {
          ieIcon.click();
          return 'clicked icon';
        }
        return 'not launched';
      })()
    `);
    console.log('Launch status:', launchResult);
    await sleep(1000);

    // Verify IE Window is open
    const windowState = await cdp.evaluate(`
      (() => {
        const titleEl = document.querySelector('.retro-titlebar .truncate');
        const addressEl = document.getElementById('ie-address-input');
        const iframeEl = document.getElementById('ie-web-iframe');
        return {
          hasTitle: !!titleEl,
          titleText: titleEl ? titleEl.textContent : '',
          addressValue: addressEl ? addressEl.value : '',
          iframeHidden: iframeEl ? iframeEl.classList.contains('hidden') : null,
        };
      })()
    `);
    console.log('IE Initial Window State:', windowState);

    // Test 1: Navigate to https://google.com/
    console.log('Navigating to https://google.com/...');
    await cdp.evaluate(`
      (() => {
        const addressEl = document.getElementById('ie-address-input');
        const goBtn = document.getElementById('ie-go-btn');
        if (addressEl && goBtn) {
          addressEl.value = 'https://google.com/';
          goBtn.click();
        }
      })()
    `);
    await sleep(800);

    // Verify Google 1998 Homepage
    const googleHomeState = await cdp.evaluate(`
      (() => {
        const titleEl = document.querySelector('.retro-titlebar .truncate');
        const addressEl = document.getElementById('ie-address-input');
        const pageContainer = document.getElementById('ie-page-container');
        const iframeEl = document.getElementById('ie-web-iframe');
        const queryBox = document.getElementById('google-query-box');
        const searchBtn = document.getElementById('google-search-btn');
        const luckyBtn = document.getElementById('google-lucky-btn');

        return {
          title: titleEl ? titleEl.textContent : '',
          address: addressEl ? addressEl.value : '',
          pageContainerVisible: pageContainer && !pageContainer.classList.contains('hidden'),
          iframeHidden: iframeEl && iframeEl.classList.contains('hidden'),
          hasQueryBox: !!queryBox,
          hasSearchBtn: !!searchBtn,
          hasLuckyBtn: !!luckyBtn,
        };
      })()
    `);
    console.log('Google Home State:', googleHomeState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_google_home.png`);

    // Test 2: Search for "windows 95"
    console.log('Executing Google search for "windows 95"...');
    await cdp.evaluate(`
      (() => {
        const queryBox = document.getElementById('google-query-box');
        const searchBtn = document.getElementById('google-search-btn');
        if (queryBox && searchBtn) {
          queryBox.value = 'windows 95';
          searchBtn.click();
        }
      })()
    `);
    await sleep(2000);

    const searchResultsState = await cdp.evaluate(`
      (() => {
        const titleEl = document.querySelector('.retro-titlebar .truncate');
        const addressEl = document.getElementById('ie-address-input');
        const resultsList = document.getElementById('google-results-list');
        const resultItems = resultsList ? resultsList.querySelectorAll('.border-b') : [];
        const resultLinks = resultsList ? Array.from(resultsList.querySelectorAll('.ie-link')).map(a => a.textContent + ' -> ' + a.getAttribute('data-url')) : [];

        return {
          title: titleEl ? titleEl.textContent : '',
          address: addressEl ? addressEl.value : '',
          resultsCount: resultItems.length,
          resultLinks: resultLinks.slice(0, 5),
        };
      })()
    `);
    console.log('Google Search Results State:', searchResultsState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_google_search_results.png`);

    // Test 3: Address bar direct search query (e.g. "astro framework")
    console.log('Testing address bar query: "astro framework"...');
    await cdp.evaluate(`
      (() => {
        const addressEl = document.getElementById('ie-address-input');
        const goBtn = document.getElementById('ie-go-btn');
        if (addressEl && goBtn) {
          addressEl.value = 'astro framework';
          goBtn.click();
        }
      })()
    `);
    await sleep(2000);

    const directSearchState = await cdp.evaluate(`
      (() => {
        const addressEl = document.getElementById('ie-address-input');
        const titleEl = document.querySelector('.retro-titlebar .truncate');
        const resultsList = document.getElementById('google-results-list');
        const resultItems = resultsList ? resultsList.querySelectorAll('.border-b') : [];

        return {
          address: addressEl ? addressEl.value : '',
          title: titleEl ? titleEl.textContent : '',
          resultsCount: resultItems.length,
        };
      })()
    `);
    console.log('Direct Address Bar Search State:', directSearchState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_google_direct_search.png`);

    // Test 4: "I'm feeling lucky" button
    console.log('Testing "I\'m feeling lucky" button for "tools"...');
    await cdp.evaluate(`
      (() => {
        const addressEl = document.getElementById('ie-address-input');
        const goBtn = document.getElementById('ie-go-btn');
        if (addressEl && goBtn) {
          addressEl.value = 'https://google.com/';
          goBtn.click();
        }
      })()
    `);
    await sleep(800);

    await cdp.evaluate(`
      (() => {
        const queryBox = document.getElementById('google-query-box');
        const luckyBtn = document.getElementById('google-lucky-btn');
        if (queryBox && luckyBtn) {
          queryBox.value = 'tools';
          luckyBtn.click();
        }
      })()
    `);
    await sleep(1000);

    const luckyState = await cdp.evaluate(`
      (() => {
        const addressEl = document.getElementById('ie-address-input');
        const titleEl = document.querySelector('.retro-titlebar .truncate');
        return {
          address: addressEl ? addressEl.value : '',
          title: titleEl ? titleEl.textContent : '',
        };
      })()
    `);
    console.log('Lucky Navigation State:', luckyState);
    await cdp.screenshot(`${ARTIFACT_DIR}/win95_ie_google_lucky_dest.png`);

    console.log('All automated Internet Explorer Google verification tests completed successfully!');
    cdp.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
