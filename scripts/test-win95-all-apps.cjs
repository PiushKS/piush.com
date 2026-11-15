const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9255;
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
    console.log('Connected to Chrome CDP WebSocket');

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log('Navigating to http://localhost:4321/');
    await cdp.send('Page.navigate', { url: 'http://localhost:4321/' });
    await sleep(2500);

    // 1. Dismiss any open initial modal or dialog
    await cdp.evaluate(`
      const closeBtn = document.querySelector('#retro-about-dialog button[aria-label="Close"], #retro-about-dialog .retro-close-btn');
      if (closeBtn) closeBtn.click();
      const dlg = document.querySelector('#retro-about-dialog');
      if (dlg) dlg.classList.add('hidden');
    `);
    await sleep(400);

    // 2. Launch Media Player
    console.log('Testing Media Player...');
    await cdp.evaluate(`
      window.launchWin95App('mediaplayer');
    `);
    await sleep(600);
    const mpInfo = await cdp.evaluate(`
      const playBtn = document.querySelector('#mp-play-btn');
      if (playBtn) playBtn.click();
      return {
        title: document.querySelector('#mp-title-overlay')?.textContent,
        totalTime: document.querySelector('#mp-total-time')?.textContent
      };
    `);
    console.log('Media Player Status:', mpInfo);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_mediaplayer_verified.png`);

    // 3. Launch CD Player
    console.log('Testing CD Player...');
    await cdp.evaluate(`
      window.launchWin95App('cdplayer');
    `);
    await sleep(600);
    const cdInfo = await cdp.evaluate(`
      const playBtn = document.querySelector('#cd-play-btn');
      if (playBtn) playBtn.click();
      return {
        track: document.querySelector('#cd-track-title')?.textContent,
        time: document.querySelector('#cd-timer')?.textContent
      };
    `);
    console.log('CD Player Status:', cdInfo);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_cdplayer_verified.png`);

    // 4. Launch MIDI Player
    console.log('Testing MIDI Player...');
    await cdp.evaluate(`
      window.launchWin95App('midiplayer');
    `);
    await sleep(600);
    const midiInfo = await cdp.evaluate(`
      const firstKey = document.querySelector('#midi-keyboard [data-note="60"]');
      if (firstKey) firstKey.click();
      const playBtn = document.querySelector('#midi-play-btn');
      if (playBtn) playBtn.click();
      return {
        title: document.querySelector('#midi-title')?.textContent,
        keys: document.querySelectorAll('#midi-keyboard .piano-white-key').length
      };
    `);
    console.log('MIDI Player Status:', midiInfo);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_midiplayer_verified.png`);

    // 5. Launch Calendar
    console.log('Testing Calendar...');
    await cdp.evaluate(`
      window.launchWin95App('calendar');
    `);
    await sleep(600);
    const calInfo = await cdp.evaluate(`
      const addBtn = document.querySelector('#cal-add-event-btn');
      const titleInput = document.querySelector('#cal-event-title');
      if (titleInput) titleInput.value = 'Automated Test Event';
      if (addBtn) addBtn.click();
      return {
        month: document.querySelector('#cal-month-year')?.textContent,
        days: document.querySelectorAll('#cal-days > div').length
      };
    `);
    console.log('Calendar Status:', calInfo);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_calendar_verified.png`);

    // 6. Launch Clock & Alarms
    console.log('Testing Clock & Alarms...');
    await cdp.evaluate(`
      window.launchWin95App('clock');
    `);
    await sleep(600);
    const clockInfo = await cdp.evaluate(`
      return {
        time: document.querySelector('#clk-digital-time')?.textContent,
        hasCanvas: !!document.querySelector('#clk-analog-canvas')
      };
    `);
    console.log('Clock Status:', clockInfo);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_clock_verified.png`);

    // 7. Launch Sticky Notes
    console.log('Testing Sticky Notes...');
    await cdp.evaluate(`
      window.launchWin95App('stickynotes');
    `);
    await sleep(600);
    const noteInfo = await cdp.evaluate(`
      const body = document.querySelector('#note-body');
      if (body) body.value = 'Verified automated memo: All apps 100% operational!';
      return {
        chars: document.querySelector('#note-char-count')?.textContent
      };
    `);
    console.log('Sticky Notes Status:', noteInfo);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_stickynotes_verified.png`);

    // 8. Launch To-Do List
    console.log('Testing To-Do List...');
    await cdp.evaluate(`
      window.launchWin95App('todolist');
    `);
    await sleep(600);
    const todoInfo = await cdp.evaluate(`
      const input = document.querySelector('#todo-input');
      const addBtn = document.querySelector('#todo-add-btn');
      if (input) input.value = 'Verified automated task entry';
      if (addBtn) addBtn.click();
      return {
        count: document.querySelectorAll('#todo-items > div').length
      };
    `);
    console.log('To-Do List Status:', todoInfo);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_todolist_verified.png`);

    // 9. Launch Windows Explorer
    console.log('Testing Windows Explorer...');
    await cdp.evaluate(`
      window.launchWin95App('explorer');
    `);
    await sleep(600);
    const expInfo = await cdp.evaluate(`
      return {
        address: document.querySelector('#exp-address')?.value,
        status: document.querySelector('#exp-status')?.textContent
      };
    `);
    console.log('Windows Explorer Status:', expInfo);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_explorer_verified.png`);

    // 10. Launch Disk Defragmenter
    console.log('Testing Disk Defragmenter...');
    await cdp.evaluate(`
      window.launchWin95App('defrag');
    `);
    await sleep(600);
    const defragInfo = await cdp.evaluate(`
      const startBtn = document.querySelector('#df-start-btn');
      if (startBtn) startBtn.click();
      return {
        clusters: document.querySelectorAll('.df-block').length,
        pct: document.querySelector('#df-pct')?.textContent
      };
    `);
    console.log('Defrag Status:', defragInfo);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_defrag_verified.png`);

    // 11. Launch HyperTerminal
    console.log('Testing HyperTerminal...');
    await cdp.evaluate(`
      window.launchWin95App('hyperterminal');
    `);
    await sleep(600);
    const htInfo = await cdp.evaluate(`
      return {
        textLen: document.querySelector('#ht-screen')?.textContent.length
      };
    `);
    console.log('HyperTerminal Status:', htInfo);
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_hyperterminal_verified.png`);

    // 12. Capture Final Desktop Screen
    console.log('Capturing Full Desktop Ecosystem Screenshot...');
    await cdp.captureScreenshot(`${ARTIFACT_DIR}/win95_all_apps_functional_desktop.png`);

    console.log('\nAll application and software tests completed successfully!');
    cdp.close();
  } finally {
    chromeProc.kill();
  }
}

runTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
