const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = '/Users/mac/Documents/piush.com';
const ARTIFACTS_DIR = '/Users/mac/.gemini/antigravity/brain/304ace31-6265-476d-84a1-6973c89534e2';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

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
        if (parsed.id && this.callbacks.has(parsed.id)) {
          const cb = this.callbacks.get(parsed.id);
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
}

async function generateOGCard() {
  console.log('Reading assets for Windows 95 OG Card...');
  const portraitBase64 = fs.readFileSync(path.join(ROOT_DIR, 'public/images/portrait/piush.png')).toString('base64');
  const computerSvg = fs.readFileSync(path.join(ROOT_DIR, 'public/images/windows-95-computer.svg'), 'utf8');
  const rocketSvg = fs.readFileSync(path.join(ROOT_DIR, 'public/images/windows-95-rocket.svg'), 'utf8');
  const recycleSvg = fs.readFileSync(path.join(ROOT_DIR, 'public/images/windows-95-recycle-bin.svg'), 'utf8');
  const networkSvg = fs.readFileSync(path.join(ROOT_DIR, 'public/images/windows-95-network.svg'), 'utf8');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background-color: #008080; /* Windows 95 Teal */
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      user-select: none;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Left Desktop Icon Sidebar */
    .desktop-sidebar {
      position: absolute;
      top: 12px;
      left: 12px;
      width: 86px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      z-index: 5;
    }
    .desktop-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 86px;
      padding: 3px;
    }
    .desktop-icon .icon-img {
      width: 36px;
      height: 36px;
      filter: drop-shadow(1px 1px 0px rgba(0,0,0,0.8));
    }
    .desktop-icon span {
      color: #ffffff;
      font-size: 10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      margin-top: 4px;
      text-align: center;
      line-height: 1.15;
      text-shadow: 1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000;
    }

    /* Main Window Stage */
    .main-stage {
      position: absolute;
      top: 10px;
      bottom: 34px;
      left: 106px;
      right: 14px;
      z-index: 10;
      display: flex;
    }

    .win95-window {
      width: 100%;
      height: 100%;
      background-color: #c0c0c0;
      border-top: 2.5px solid #ffffff;
      border-left: 2.5px solid #ffffff;
      border-right: 2.5px solid #000000;
      border-bottom: 2.5px solid #000000;
      box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.45);
      display: flex;
      flex-direction: column;
    }

    .win95-inner-border {
      flex: 1;
      margin: 2px;
      border-top: 1px solid #dfdfdf;
      border-left: 1px solid #dfdfdf;
      border-right: 1px solid #808080;
      border-bottom: 1px solid #808080;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Window Titlebar */
    .win95-titlebar {
      height: 28px;
      background: linear-gradient(90deg, #000080 0%, #1084d0 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px 0 8px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.3px;
    }
    .titlebar-left {
      display: flex;
      align-items: center;
      gap: 7px;
      overflow: hidden;
      white-space: nowrap;
    }
    .titlebar-controls {
      display: flex;
      align-items: center;
      gap: 2.5px;
    }
    .win95-btn {
      width: 16px;
      height: 16px;
      background-color: #c0c0c0;
      border-top: 1.5px solid #ffffff;
      border-left: 1.5px solid #ffffff;
      border-right: 1.5px solid #000000;
      border-bottom: 1.5px solid #000000;
      color: #000000;
      font-size: 9px;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    /* Menubar */
    .win95-menubar {
      height: 22px;
      background-color: #c0c0c0;
      border-bottom: 1px solid #808080;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      font-family: ui-monospace, SFMono-Regular, monospace;
      font-size: 10.5px;
      color: #000000;
    }
    .menu-items {
      display: flex;
      gap: 12px;
    }
    .menu-item span {
      text-decoration: underline;
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      background: #ffffff;
      padding: 1px 6px;
      border-top: 1px solid #808080;
      border-left: 1px solid #808080;
      border-right: 1px solid #ffffff;
      border-bottom: 1px solid #ffffff;
      font-size: 9.5px;
      font-weight: 700;
      color: #000000;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #00a854;
      display: inline-block;
    }

    /* Window Client Surface */
    .win95-client {
      flex: 1;
      background-color: #ffffff;
      border-top: 2px solid #808080;
      border-left: 2px solid #808080;
      border-right: 2px solid #ffffff;
      border-bottom: 2px solid #ffffff;
      margin: 2px;
      padding: 14px 18px 12px 18px;
      display: flex;
      justify-content: space-between;
      gap: 20px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    /* Left Info Column */
    .info-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .top-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .meta-tag {
      background-color: #f0f0f0;
      border: 1px solid #000000;
      padding: 2px 7px;
      font-size: 10px;
      font-weight: 700;
      color: #000000;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      box-shadow: 1.5px 1.5px 0px #000000;
    }

    .main-heading {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 900;
      font-size: 38px;
      line-height: 1;
      color: #000000;
      letter-spacing: -0.5px;
      margin-top: 2px;
      margin-bottom: 2px;
    }
    .sub-heading {
      font-size: 16px;
      font-weight: 800;
      color: #0057cc;
      margin-bottom: 6px;
      letter-spacing: 0.2px;
    }
    .bio-text {
      font-size: 12px;
      line-height: 1.35;
      color: #333333;
      margin-bottom: 8px;
      max-width: 660px;
    }

    /* System Stats Inset Box */
    .stats-inset {
      background-color: #f7f7f7;
      border-top: 1.5px solid #808080;
      border-left: 1.5px solid #808080;
      border-right: 1.5px solid #ffffff;
      border-bottom: 1.5px solid #ffffff;
      padding: 6px 10px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 8px;
    }
    .stat-box {
      text-align: left;
      border-right: 1px solid #d4d4d4;
      padding-right: 6px;
    }
    .stat-box:last-child {
      border-right: none;
    }
    .stat-val {
      font-size: 20px;
      font-weight: 900;
      color: #0057cc;
      line-height: 1.1;
    }
    .stat-lbl {
      font-size: 9px;
      font-weight: 700;
      color: #444444;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* Tech Stack Button Row */
    .stack-section {
      margin-bottom: 8px;
    }
    .stack-lbl {
      font-size: 9px;
      font-weight: 800;
      color: #555555;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .stack-row {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .stack-btn {
      background-color: #c0c0c0;
      border-top: 1.5px solid #ffffff;
      border-left: 1.5px solid #ffffff;
      border-right: 1.5px solid #000000;
      border-bottom: 1.5px solid #000000;
      padding: 2.5px 7px;
      font-size: 10px;
      font-weight: 700;
      color: #000000;
      box-shadow: 1px 1px 0px rgba(0,0,0,0.4);
    }

    /* Bottom Specs Footer */
    .specs-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px dashed #808080;
      padding-top: 6px;
      font-size: 10px;
      color: #333333;
      font-weight: 600;
    }
    .specs-footer strong {
      color: #000080;
    }

    /* Right Avatar Column */
    .avatar-col {
      width: 270px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .avatar-window {
      width: 100%;
      background-color: #c0c0c0;
      border-top: 2px solid #ffffff;
      border-left: 2px solid #ffffff;
      border-right: 2px solid #000000;
      border-bottom: 2px solid #000000;
      box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
    }

    .avatar-titlebar {
      height: 22px;
      background-color: #0057cc;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px 0 6px;
      font-size: 10px;
      font-weight: 700;
      font-family: ui-monospace, SFMono-Regular, monospace;
    }

    .avatar-body {
      background-color: #dcdcdc;
      border-top: 1.5px solid #808080;
      border-left: 1.5px solid #808080;
      border-right: 1.5px solid #ffffff;
      border-bottom: 1.5px solid #ffffff;
      margin: 3px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .avatar-circle-frame {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background-color: #0057cc;
      border: 2.5px solid #000000;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
    }
    .avatar-circle-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-name-plate {
      margin-top: 6px;
      font-size: 10px;
      font-weight: 700;
      color: #000080;
      letter-spacing: 0.5px;
    }

    .avatar-status-bar {
      background-color: #c0c0c0;
      border-top: 1px solid #808080;
      padding: 2.5px 6px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5px;
      font-family: ui-monospace, SFMono-Regular, monospace;
      color: #222222;
      font-weight: 700;
    }

    /* Windows 95 Taskbar at Bottom of Screen */
    .win95-taskbar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 30px;
      background-color: #c0c0c0;
      border-top: 2px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px;
      z-index: 20;
      font-family: ui-monospace, SFMono-Regular, monospace;
      box-shadow: 0 -1px 0px #808080;
    }
    .taskbar-left {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .start-btn {
      height: 22px;
      padding: 0 6px;
      background-color: #c0c0c0;
      border-top: 1.5px solid #ffffff;
      border-left: 1.5px solid #ffffff;
      border-right: 1.5px solid #000000;
      border-bottom: 1.5px solid #000000;
      font-weight: 900;
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 5px;
      box-shadow: 1px 1px 0px #000000;
    }
    .win-flag {
      display: grid;
      grid-template-columns: repeat(2, 4px);
      gap: 1px;
      background: #000000;
      padding: 0.5px;
    }
    .win-flag span {
      width: 4px;
      height: 4px;
    }
    .taskbar-tab {
      height: 22px;
      padding: 0 8px;
      background-color: #d4d0c8;
      border-top: 1.5px solid #000000;
      border-left: 1.5px solid #000000;
      border-right: 1.5px solid #ffffff;
      border-bottom: 1.5px solid #ffffff;
      font-size: 10px;
      font-weight: 700;
      color: #000000;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .taskbar-tray {
      display: flex;
      align-items: center;
      gap: 6px;
      background-color: #c0c0c0;
      border-top: 1px solid #808080;
      border-left: 1px solid #808080;
      border-right: 1px solid #ffffff;
      border-bottom: 1px solid #ffffff;
      padding: 1.5px 8px;
      font-size: 10px;
      font-weight: 700;
    }
  </style>
</head>
<body>

  <!-- Desktop Icons on the left wallpaper margin -->
  <div class="desktop-sidebar">
    <div class="desktop-icon">
      <div class="icon-img">${computerSvg}</div>
      <span>My Computer</span>
    </div>
    <div class="desktop-icon">
      <div class="icon-img">${networkSvg}</div>
      <span>Network</span>
    </div>
    <div class="desktop-icon">
      <div class="icon-img">${recycleSvg}</div>
      <span>Recycle Bin</span>
    </div>
  </div>

  <!-- Main Window Stage -->
  <div class="main-stage">
    <div class="win95-window">
      <div class="win95-inner-border">
        <!-- Titlebar -->
        <div class="win95-titlebar">
          <div class="titlebar-left">
            <div style="width: 15px; height: 15px; display: flex; align-items: center;">${computerSvg}</div>
            <span>Piush KS – Mobile & Cloud Architect [C:\\PIUSH\\PORTFOLIO.EXE]</span>
          </div>
          <div class="titlebar-controls">
            <div class="win95-btn">_</div>
            <div class="win95-btn">&#9633;</div>
            <div class="win95-btn">&#10005;</div>
          </div>
        </div>

        <!-- Menubar -->
        <div class="win95-menubar">
          <div class="menu-items">
            <div class="menu-item"><span>F</span>ile</div>
            <div class="menu-item"><span>E</span>dit</div>
            <div class="menu-item"><span>V</span>iew</div>
            <div class="menu-item"><span>A</span>rchitecture</div>
            <div class="menu-item"><span>T</span>ools</div>
            <div class="menu-item"><span>H</span>elp</div>
          </div>
          <div class="status-badge">
            <span class="status-dot"></span>
            <span>SYSTEM ACTIVE • PRODUCTION ONLINE</span>
          </div>
        </div>

        <!-- Client Content -->
        <div class="win95-client">
          <!-- Left Info Column -->
          <div class="info-col">
            <div>
              <div class="top-meta">
                <div class="meta-tag">
                  <span style="color: #000080; font-weight: 900;">&gt;</span>
                  <span>AVAILABLE FOR ENGINEERING & ARCHITECTURE</span>
                </div>
                <div class="meta-tag" style="background: #e6f4ea; border-color: #137333; color: #137333;">
                  <span>✓</span>
                  <span>RELEASE 2026.11</span>
                </div>
              </div>

              <div class="main-heading">PIUSH KS</div>
              <div class="sub-heading">Senior Mobile Architect & Full-Stack Cloud Engineer</div>
              <div class="bio-text">
                Crafting high-throughput mobile platforms (iOS & Android), resilient distributed backends, and performance-obsessed web architecture with obsessive craft and zero bloat.
              </div>
            </div>

            <!-- 3 Stats Tiles -->
            <div class="stats-inset">
              <div class="stat-box">
                <div class="stat-val">8+ Years</div>
                <div class="stat-lbl">Production Exp</div>
              </div>
              <div class="stat-box">
                <div class="stat-val">10M+</div>
                <div class="stat-lbl">Users Served</div>
              </div>
              <div class="stat-box">
                <div class="stat-val">100%</div>
                <div class="stat-lbl">Craft & Arch</div>
              </div>
            </div>

            <!-- Tech Stack Chips -->
            <div class="stack-section">
              <div class="stack-lbl">Core Specializations & Stack:</div>
              <div class="stack-row">
                <div class="stack-btn">Swift / iOS</div>
                <div class="stack-btn">Kotlin / Android</div>
                <div class="stack-btn">React Native</div>
                <div class="stack-btn">Flutter / Dart</div>
                <div class="stack-btn">AWS & Cloud</div>
                <div class="stack-btn">TypeScript / Node</div>
                <div class="stack-btn">Distributed Systems</div>
              </div>
            </div>

            <!-- Specs Footer -->
            <div class="specs-footer">
              <div>HOST: <strong>piush.com</strong></div>
              <div>SPEC: <strong>73 Pre-rendered Routes</strong></div>
              <div>DATA: <strong>550 Verified Quizzes</strong></div>
              <div>AUDIT: <strong>100/100 Core Web Vitals</strong></div>
            </div>
          </div>

          <!-- Right Avatar Column -->
          <div class="avatar-col">
            <div class="avatar-window">
              <div class="avatar-titlebar">
                <span>piush_avatar.bmp</span>
                <div style="display: flex; gap: 2px;">
                  <div class="win95-btn" style="width: 13px; height: 13px; font-size: 8px;">_</div>
                  <div class="win95-btn" style="width: 13px; height: 13px; font-size: 8px;">&#9633;</div>
                  <div class="win95-btn" style="width: 13px; height: 13px; font-size: 8px;">&#10005;</div>
                </div>
              </div>

              <div class="avatar-body">
                <div class="avatar-circle-frame">
                  <img src="data:image/png;base64,${portraitBase64}" alt="Piush KS" />
                </div>
                <div class="avatar-name-plate">
                  PIUSH KUMAR SINGH
                </div>
              </div>

              <div class="avatar-status-bar">
                <span>READY • 420x420</span>
                <span>RGB 24-BIT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Windows 95 Taskbar -->
  <div class="win95-taskbar">
    <div class="taskbar-left">
      <div class="start-btn">
        <div class="win-flag">
          <span style="background: #e74c3c;"></span>
          <span style="background: #2ecc71;"></span>
          <span style="background: #3498db;"></span>
          <span style="background: #f1c40f;"></span>
        </div>
        <span>Start</span>
      </div>

      <div class="taskbar-tab">
        <div style="width: 13px; height: 13px; display: flex; align-items: center;">${rocketSvg}</div>
        <span>Piush KS – Mobile & Cloud Architect</span>
      </div>

      <div class="taskbar-tab" style="background-color: #c0c0c0; border-top: 1.5px solid #fff; border-left: 1.5px solid #fff; border-right: 1.5px solid #000; border-bottom: 1.5px solid #000;">
        <span>📝 README.TXT</span>
      </div>
    </div>

    <div class="taskbar-tray">
      <span>🔊</span>
      <span>⚡ ONLINE</span>
      <span>10:20 PM</span>
    </div>
  </div>

</body>
</html>`;

  console.log('Launching headless Chrome for 1200x630 capture...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--window-size=1200,630',
    '--disable-gpu',
    '--no-sandbox',
  ]);

  await sleep(1500);

  try {
    const targets = await fetchJson('http://127.0.0.1:9229/json/list');
    let pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) {
      pageTarget = await fetchJson('http://127.0.0.1:9229/json/new');
    }
    const cdp = new SimpleCDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const dataUri = 'data:text/html;base64,' + Buffer.from(htmlContent).toString('base64');
    await cdp.send('Page.navigate', { url: dataUri });
    await sleep(800);

    // Capture JPEG (quality 96) and PNG with exact 1200x630 clip
    const clip = { x: 0, y: 0, width: 1200, height: 630, scale: 1 };
    const jpgRes = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 96, clip });
    const pngRes = await cdp.send('Page.captureScreenshot', { format: 'png', clip });

    const jpgBuffer = Buffer.from(jpgRes.data, 'base64');
    const pngBuffer = Buffer.from(pngRes.data, 'base64');

    // Save to target paths
    fs.writeFileSync(path.join(ROOT_DIR, 'src/assets/images/og-card.jpg'), jpgBuffer);
    fs.writeFileSync(path.join(ROOT_DIR, 'public/og-image.jpg'), jpgBuffer);
    fs.writeFileSync(path.join(ROOT_DIR, 'public/og-image.png'), pngBuffer);
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'win95_og_card_redesign.jpg'), jpgBuffer);

    console.log('✓ Successfully generated and saved Open Graph card!');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

generateOGCard().catch(err => {
  console.error('Error generating OG card:', err);
  process.exit(1);
});
