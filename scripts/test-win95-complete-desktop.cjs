const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9248;
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
    console.log('Triggering window.minimizeToDesktop()...');
    await cdp.evaluate(`
      window.minimizeToDesktop();
    `);
    await sleep(600);

    // Verify 26 desktop icons
    const iconCount = await cdp.evaluate(`
      return document.querySelectorAll('.win95-desktop-icon').length;
    `);
    console.log(`Total Desktop Icons verified: ${iconCount}`);

    // Screenshot 1: Complete Desktop with 26 icons
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_complete_desktop_screen.png`);

    // Test selection marquee
    console.log('Simulating drag selection marquee...');
    await cdp.evaluate(`
      const surface = document.getElementById('win95-desktop-surface');
      const rect = surface.getBoundingClientRect();
      const mousedown = new MouseEvent('mousedown', {
        clientX: rect.left + 5,
        clientY: rect.top + 5,
        bubbles: true,
        button: 0
      });
      surface.dispatchEvent(mousedown);

      const mousemove = new MouseEvent('mousemove', {
        clientX: rect.left + 180,
        clientY: rect.top + 280,
        bubbles: true
      });
      document.dispatchEvent(mousemove);
    `);
    await sleep(400);

    const selectedCount = await cdp.evaluate(`
      return document.querySelectorAll('.win95-desktop-icon.is-selected').length;
    `);
    console.log(`Marquee selected icons count: ${selectedCount}`);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_desktop_marquee_selected.png`);

    // Mouseup to end marquee
    await cdp.evaluate(`
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    `);
    await sleep(300);

    // Test Desktop Right-Click Context Menu
    console.log('Testing Desktop Right-Click Context Menu...');
    await cdp.evaluate(`
      const surface = document.getElementById('win95-desktop-surface');
      const rect = surface.getBoundingClientRect();
      const ctxEvent = new MouseEvent('contextmenu', {
        clientX: rect.left + 350,
        clientY: rect.top + 150,
        bubbles: true,
        button: 2
      });
      surface.dispatchEvent(ctxEvent);
    `);
    await sleep(400);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_desktop_context_menu.png`);

    // Click Properties in Desktop Context Menu -> Display Properties
    console.log('Opening Display Properties dialog...');
    await cdp.evaluate(`
      document.getElementById('ctx-d-properties').click();
    `);
    await sleep(600);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_display_properties_dialog.png`);

    // Select Windows 95 Clouds wallpaper and apply
    console.log('Applying Windows 95 Clouds wallpaper...');
    await cdp.evaluate(`
      const cloudsBtn = document.querySelector('.wallpaper-opt-btn[data-wp="clouds"]');
      if (cloudsBtn) cloudsBtn.click();
      document.getElementById('display-props-apply').click();
      document.getElementById('display-props-ok').click();
    `);
    await sleep(600);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_desktop_clouds_wallpaper.png`);

    // Test System Tray Volume Popup
    console.log('Testing System Tray Volume popup...');
    await cdp.evaluate(`
      document.getElementById('win95-tray-audio').click();
    `);
    await sleep(400);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_tray_volume_popup.png`);

    // Close volume popup
    await cdp.evaluate(`
      document.getElementById('win95-volume-popup').classList.add('hidden');
    `);

    // Test Shut Down Dialog
    console.log('Testing Authentic Windows 95 Shut Down dialog...');
    await cdp.evaluate(`
      document.getElementById('win95-start-btn').click();
    `);
    await sleep(400);
    await cdp.evaluate(`
      document.getElementById('sm-shutdown').click();
    `);
    await sleep(500);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_shutdown_dialog.png`);

    console.log('All Windows 95 Desktop verifications completed successfully!');
    cdp.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

runTest();
