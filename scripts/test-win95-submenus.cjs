const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9234;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
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
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--window-size=1280,800',
    '--disable-gpu',
    '--no-sandbox',
  ]);

  await sleep(1500);

  try {
    const targets = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
    let pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) pageTarget = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/new`);

    const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: 'http://localhost:4321/' });
    await sleep(2000);

    // Minimize to desktop
    await cdp.send('Runtime.evaluate', {
      expression: `window.minimizeToDesktop && window.minimizeToDesktop();`
    });
    await sleep(500);

    // Open Start Menu
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('win95-start-btn')?.click();`
    });
    await sleep(300);

    // Expand Programs and Accessories flyouts
    await cdp.send('Runtime.evaluate', {
      expression: `
        const parents = document.querySelectorAll('.win95-menu-parent');
        parents.forEach(p => p.classList.add('is-open'));
      `
    });
    await sleep(400);

    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2/win95_submenu_expanded.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved win95_submenu_expanded.png');

    // Now bring DOS to front and run Paint & Calculator
    await cdp.send('Runtime.evaluate', {
      expression: `
        document.getElementById('win95-start-menu')?.classList.add('hidden');
        window.launchWin95App('paint');
        window.launchWin95App('calc');
      `
    });
    await sleep(600);

    const shot2 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2/win95_paint_calc_opened.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved win95_paint_calc_opened.png');

    cdp.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch(console.error);
