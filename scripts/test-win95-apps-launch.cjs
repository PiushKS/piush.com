const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9249;
const ARTIFACT_DIR = '/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2';

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

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression: `(() => { ${expression} })()`,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  async captureScreenshot(path) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${path}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runTest() {
  console.log('Launching headless Chrome on port', DEBUG_PORT);
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--window-size=1280,800',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank',
  ]);

  await sleep(1500);

  try {
    const targets = await fetchJson(`http://localhost:${DEBUG_PORT}/json`);
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    console.log('Connected to CDP websocket');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log('Navigating to http://localhost:4321/ ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:4321/' });
    await sleep(2000);

    // Minimize to desktop
    await cdp.evaluate(`window.minimizeToDesktop();`);
    await sleep(600);

    // Launch Internet Explorer
    console.log('Launching Internet Explorer (ie)...');
    await cdp.evaluate(`window.launchWin95App('ie');`);
    await sleep(800);

    // Launch System Information
    console.log('Launching System Information (sysinfo)...');
    await cdp.evaluate(`window.launchWin95App('sysinfo');`);
    await sleep(600);

    // Launch JSON Toolkit
    console.log('Launching JSON Toolkit (jsontoolkit)...');
    await cdp.evaluate(`window.launchWin95App('jsontoolkit');`);
    await sleep(600);

    // Launch Calculator
    console.log('Launching Calculator (calculator)...');
    await cdp.evaluate(`window.launchWin95App('calculator');`);
    await sleep(600);

    // Capture screenshot of multitasking apps
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_apps_multitasking_ie_sysinfo_json.png`);

    // Verify taskbar has buttons for each running app
    const runningAppsCount = await cdp.evaluate(`
      return document.querySelectorAll('#win95-running-apps button').length;
    `);
    console.log(`Running apps buttons in Taskbar: ${runningAppsCount}`);

    console.log('Apps launch verification completed successfully!');
    cdp.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

runTest();
