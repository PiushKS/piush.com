const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9233;

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
  console.log('Spawning Chrome for ecosystem test...');
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
    if (!pageTarget) {
      pageTarget = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/new`);
    }

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

    console.log('Navigating to http://localhost:4321/ ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:4321/' });
    await sleep(2500);

    // Minimize to Windows 95 Desktop
    console.log('Minimizing to desktop...');
    await cdp.send('Runtime.evaluate', {
      expression: `window.minimizeToDesktop && window.minimizeToDesktop();`
    });
    await sleep(800);

    // Screenshot 1: Desktop View
    const shot1 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2/win95_desktop_ecosystem.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved win95_desktop_ecosystem.png');

    // Screenshot 2: Start Menu opened
    console.log('Opening Start Menu...');
    await cdp.send('Runtime.evaluate', {
      expression: `document.getElementById('win95-start-btn')?.click();`
    });
    await sleep(500);

    const shot2 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2/win95_startmenu_ecosystem.png', Buffer.from(shot2.data, 'base64'));
    console.log('Saved win95_startmenu_ecosystem.png');

    // Screenshot 3: Launch multiple apps simultaneously
    console.log('Launching Minesweeper, Pinball, and MS-DOS...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        window.launchWin95App('minesweeper');
        window.launchWin95App('dos');
        window.launchWin95App('pinball');
      `
    });
    await sleep(1000);

    const shot3 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2/win95_multitasking_apps.png', Buffer.from(shot3.data, 'base64'));
    console.log('Saved win95_multitasking_apps.png');

    // Execute DIR in MS-DOS prompt
    console.log('Executing DIR command in MS-DOS...');
    await cdp.send('Runtime.evaluate', {
      expression: `
        const input = document.getElementById('dos-input');
        if (input) {
          input.value = 'DIR';
          input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13 }));
        }
      `
    });
    await sleep(500);

    const shot4 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2/win95_dos_dir_output.png', Buffer.from(shot4.data, 'base64'));
    console.log('Saved win95_dos_dir_output.png');

    cdp.close();
    console.log('SUCCESS: All ecosystem tests completed.');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
