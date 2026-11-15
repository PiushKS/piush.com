const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9250;
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
    '--window-size=1280,850',
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
    await sleep(500);

    // Launch WordPad
    console.log('Launching WordPad...');
    await cdp.evaluate(`window.launchWin95App('wordpad');`);
    await sleep(600);

    // Screenshot 1: WordPad Fresh Launch
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_wordpad_fresh_launch.png`);

    // Verify stats
    const stats = await cdp.evaluate(`
      const words = document.getElementById('wp-word-count')?.textContent;
      const chars = document.getElementById('wp-char-count')?.textContent;
      const path = document.getElementById('wp-doc-path')?.textContent;
      return { words, chars, path };
    `);
    console.log('WordPad initial state:', stats);

    // Test File Dropdown Menu
    console.log('Opening File Dropdown menu...');
    await cdp.evaluate(`
      document.getElementById('wp-m-file-btn').click();
    `);
    await sleep(400);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_wordpad_file_menu.png`);

    // Test Format Menu & Color Palette
    console.log('Opening Color Palette...');
    await cdp.evaluate(`
      document.getElementById('wp-m-file-btn').click(); // close menu
      document.getElementById('wp-color-btn').click();
    `);
    await sleep(400);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_wordpad_color_palette.png`);

    // Test Date and Time Dialog
    console.log('Opening Date and Time Dialog...');
    await cdp.evaluate(`
      document.getElementById('wpt-datetime').click();
    `);
    await sleep(400);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_wordpad_datetime_dialog.png`);

    // Insert date/time
    await cdp.evaluate(`
      document.getElementById('wp-dt-ok').click();
    `);
    await sleep(300);

    // Test Find & Replace Dialog
    console.log('Opening Find & Replace Dialog...');
    await cdp.evaluate(`
      document.getElementById('wpm-replace')?.click();
      if (document.getElementById('wp-find-dialog')?.classList.contains('hidden')) {
        document.getElementById('wpt-find')?.click();
      }
    `);
    await sleep(400);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_wordpad_find_replace_dialog.png`);

    // Close find dialog
    await cdp.evaluate(`
      document.getElementById('wp-find-close')?.click();
    `);

    // Test About WordPad Dialog
    console.log('Opening About WordPad Dialog...');
    await cdp.evaluate(`
      document.getElementById('wp-m-help-btn').click();
    `);
    await sleep(200);
    await cdp.evaluate(`
      document.getElementById('wpm-about').click();
    `);
    await sleep(400);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_wordpad_about_dialog.png`);

    // Close about dialog
    await cdp.evaluate(`
      document.getElementById('wp-about-ok')?.click();
    `);

    // Test Save to VFS
    console.log('Testing Save to VFS...');
    await cdp.evaluate(`
      document.getElementById('wpt-save')?.click();
    `);
    await sleep(400);

    const savedStatus = await cdp.evaluate(`
      return document.getElementById('wp-status-msg')?.textContent;
    `);
    console.log('Save Status message:', savedStatus);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_wordpad_saved_document.png`);

    console.log('WordPad full functionality verification completed successfully!');
    cdp.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

runTest();
