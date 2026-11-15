// Piush 95 - Developer Tools Collection
// Regex Tester, Base64 Tool, URL Tool, Hash Generator, UUID Generator,
// Timestamp Converter, Diff Checker, Markdown Editor, API Tester

import { audio } from '../audio';
import type { Win95Window } from '../windowManager';

/**
 * 1. Regex Tester
 */
export function renderRegexTester(container: HTMLElement, win: Win95Window) {
  win.setTitle('Regex Tester 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="space-y-1">
        <label class="text-xs font-bold">Regular Expression:</label>
        <div class="flex items-center gap-2">
          <span class="text-base">/</span>
          <input type="text" id="rgx-pattern" value="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" class="retro-inset flex-1 px-2 py-0.5 bg-white text-black font-mono text-xs" />
          <span class="text-base">/</span>
          <input type="text" id="rgx-flags" value="g" class="retro-inset w-12 px-1.5 py-0.5 bg-white text-black font-mono text-xs" />
        </div>
      </div>

      <div class="flex-1 flex flex-col space-y-1">
        <label class="text-xs font-bold">Test String:</label>
        <textarea id="rgx-text" class="retro-inset flex-1 p-2 bg-white text-black font-mono text-xs resize-none select-text">Contact me at engineer@piush.com or visit https://piush.com for more info! Another email: recruit@firm.org.</textarea>
      </div>

      <div class="h-28 flex flex-col space-y-1">
        <label class="text-xs font-bold">Matches Found (<span id="rgx-count">0</span>):</label>
        <div id="rgx-matches" class="retro-inset flex-1 p-2 bg-white text-blue-900 font-mono text-xs overflow-auto select-text"></div>
      </div>
    </div>
  `;

  const patInput = container.querySelector('#rgx-pattern') as HTMLInputElement;
  const flagsInput = container.querySelector('#rgx-flags') as HTMLInputElement;
  const textInput = container.querySelector('#rgx-text') as HTMLTextAreaElement;
  const matchesEl = container.querySelector('#rgx-matches') as HTMLElement;
  const countEl = container.querySelector('#rgx-count') as HTMLElement;

  function runRegex() {
    try {
      const reg = new RegExp(patInput.value, flagsInput.value);
      const str = textInput.value;
      const matches = [...str.matchAll(reg)];
      if (countEl) countEl.textContent = String(matches.length);

      if (matches.length === 0) {
        matchesEl.innerHTML = '<span class="text-gray-400 italic">No matches.</span>';
      } else {
        matchesEl.innerHTML = matches.map((m, i) => `
          <div class="border-b border-gray-200 py-0.5">
            <strong>Match ${i + 1}:</strong> "${m[0]}" <span class="text-gray-500 text-[10px]">(index: ${m.index})</span>
          </div>
        `).join('');
      }
    } catch (e) {
      if (matchesEl) matchesEl.innerHTML = `<span class="text-red-600 font-bold">Regex Error: ${(e as Error).message}</span>`;
    }
  }

  patInput?.addEventListener('input', runRegex);
  flagsInput?.addEventListener('input', runRegex);
  textInput?.addEventListener('input', runRegex);
  runRegex();
}

/**
 * 2. Base64 Encoder / Decoder
 */
export function renderBase64Tool(container: HTMLElement, win: Win95Window) {
  win.setTitle('Base64 Encoder / Decoder');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="flex-1 flex flex-col space-y-1">
        <label class="text-xs font-bold">Plain Text:</label>
        <textarea id="b64-plain" class="retro-inset flex-1 p-2 bg-white text-black font-mono text-xs resize-none select-text">Hello, Windows 95!</textarea>
      </div>

      <div class="flex items-center justify-center gap-3">
        <button id="b64-encode" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Encode ▼</button>
        <button id="b64-decode" class="retro-btn !py-0.5 !px-3 font-bold text-xs">▲ Decode</button>
      </div>

      <div class="flex-1 flex flex-col space-y-1">
        <label class="text-xs font-bold">Base64 Output:</label>
        <textarea id="b64-cipher" class="retro-inset flex-1 p-2 bg-white text-black font-mono text-xs resize-none select-text"></textarea>
      </div>
    </div>
  `;

  const plain = container.querySelector('#b64-plain') as HTMLTextAreaElement;
  const cipher = container.querySelector('#b64-cipher') as HTMLTextAreaElement;

  container.querySelector('#b64-encode')?.addEventListener('click', () => {
    try {
      cipher.value = btoa(unescape(encodeURIComponent(plain.value)));
      audio.playClick();
    } catch (e) {
      alert('Encode error: ' + (e as Error).message);
    }
  });

  container.querySelector('#b64-decode')?.addEventListener('click', () => {
    try {
      plain.value = decodeURIComponent(escape(atob(cipher.value)));
      audio.playClick();
    } catch (e) {
      alert('Decode error: Invalid Base64 string');
    }
  });
}

/**
 * 3. URL Encoder / Decoder
 */
export function renderUrlTool(container: HTMLElement, win: Win95Window) {
  win.setTitle('URL Encoder / Decoder');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="flex-1 flex flex-col space-y-1">
        <label class="text-xs font-bold">Standard Text / Decoded URL:</label>
        <textarea id="url-plain" class="retro-inset flex-1 p-2 bg-white text-black font-mono text-xs resize-none select-text">https://piush.com/search?q=windows 95&filter=apps & games</textarea>
      </div>

      <div class="flex items-center justify-center gap-3">
        <button id="url-encode" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Encode URI Component ▼</button>
        <button id="url-decode" class="retro-btn !py-0.5 !px-3 font-bold text-xs">▲ Decode</button>
      </div>

      <div class="flex-1 flex flex-col space-y-1">
        <label class="text-xs font-bold">Encoded URL:</label>
        <textarea id="url-cipher" class="retro-inset flex-1 p-2 bg-white text-black font-mono text-xs resize-none select-text"></textarea>
      </div>
    </div>
  `;

  const plain = container.querySelector('#url-plain') as HTMLTextAreaElement;
  const cipher = container.querySelector('#url-cipher') as HTMLTextAreaElement;

  container.querySelector('#url-encode')?.addEventListener('click', () => {
    cipher.value = encodeURIComponent(plain.value);
    audio.playClick();
  });

  container.querySelector('#url-decode')?.addEventListener('click', () => {
    try {
      plain.value = decodeURIComponent(cipher.value);
      audio.playClick();
    } catch (e) {
      alert('Malformed URL');
    }
  });
}

/**
 * 4. Cryptographic Hash Generator
 */
export function renderHashGenerator(container: HTMLElement, win: Win95Window) {
  win.setTitle('Hash Generator 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="space-y-1">
        <label class="text-xs font-bold">Input String:</label>
        <textarea id="hash-input" class="retro-inset w-full h-16 p-2 bg-white text-black font-mono text-xs resize-none select-text">Piush 95 Operating System</textarea>
      </div>

      <div class="flex-1 flex flex-col space-y-2 overflow-auto">
        <div class="space-y-0.5">
          <span class="text-[11px] font-bold">SHA-256:</span>
          <div id="h-sha256" class="retro-inset p-1.5 bg-white text-[11px] text-gray-800 break-all select-text">...</div>
        </div>
        <div class="space-y-0.5">
          <span class="text-[11px] font-bold">SHA-384:</span>
          <div id="h-sha384" class="retro-inset p-1.5 bg-white text-[11px] text-gray-800 break-all select-text">...</div>
        </div>
        <div class="space-y-0.5">
          <span class="text-[11px] font-bold">SHA-512:</span>
          <div id="h-sha512" class="retro-inset p-1.5 bg-white text-[11px] text-gray-800 break-all select-text">...</div>
        </div>
      </div>
    </div>
  `;

  const input = container.querySelector('#hash-input') as HTMLTextAreaElement;
  const sha256El = container.querySelector('#h-sha256') as HTMLElement;
  const sha384El = container.querySelector('#h-sha384') as HTMLElement;
  const sha512El = container.querySelector('#h-sha512') as HTMLElement;

  async function computeHashes() {
    const text = input.value;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    async function hash(algo: string) {
      const buffer = await crypto.subtle.digest(algo, data);
      return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    try {
      if (sha256El) sha256El.textContent = await hash('SHA-256');
      if (sha384El) sha384El.textContent = await hash('SHA-384');
      if (sha512El) sha512El.textContent = await hash('SHA-512');
    } catch (_) {}
  }

  input?.addEventListener('input', computeHashes);
  computeHashes();
}

/**
 * 5. UUID Generator
 */
export function renderUuidGenerator(container: HTMLElement, win: Win95Window) {
  win.setTitle('UUID / GUID Generator');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs">
          <label class="font-bold">Quantity:</label>
          <select id="uuid-qty" class="retro-inset px-2 py-0.5 bg-white text-xs">
            <option value="1">1</option>
            <option value="5" selected>5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <button id="uuid-gen-btn" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Generate</button>
      </div>

      <div class="flex-1 flex flex-col space-y-1">
        <label class="text-xs font-bold">Generated v4 UUIDs:</label>
        <textarea id="uuid-output" class="retro-inset flex-1 p-2 bg-white text-black font-mono text-xs resize-none select-text" readonly></textarea>
      </div>
    </div>
  `;

  const qty = container.querySelector('#uuid-qty') as HTMLSelectElement;
  const genBtn = container.querySelector('#uuid-gen-btn');
  const out = container.querySelector('#uuid-output') as HTMLTextAreaElement;

  function generate() {
    const n = parseInt(qty.value, 10);
    const list: string[] = [];
    for (let i = 0; i < n; i++) {
      list.push(crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      }));
    }
    if (out) out.value = list.join('\n');
    audio.playClick();
  }

  genBtn?.addEventListener('click', generate);
  generate();
}

/**
 * 6. Timestamp Converter
 */
export function renderTimestampConverter(container: HTMLElement, win: Win95Window) {
  win.setTitle('UNIX Timestamp Converter');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <div class="retro-inset p-2 bg-black text-green-400 text-xs">
        <span>CURRENT UNIX TIME: </span><strong id="ts-live" class="text-yellow-300">...</strong>
      </div>

      <div class="space-y-1">
        <label class="text-xs font-bold">Epoch Timestamp (Seconds):</label>
        <div class="flex gap-2">
          <input type="number" id="ts-epoch" value="${Math.floor(Date.now() / 1000)}" class="retro-inset flex-1 px-2 py-0.5 bg-white text-black font-mono text-xs" />
          <button id="ts-convert" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Convert</button>
        </div>
      </div>

      <div class="retro-inset p-2 bg-white space-y-1 text-xs">
        <div><strong>GMT / UTC:</strong> <span id="ts-utc">...</span></div>
        <div><strong>Local Time:</strong> <span id="ts-local">...</span></div>
        <div><strong>ISO 8601:</strong> <span id="ts-iso">...</span></div>
      </div>
    </div>
  `;

  const live = container.querySelector('#ts-live') as HTMLElement;
  const epoch = container.querySelector('#ts-epoch') as HTMLInputElement;
  const convertBtn = container.querySelector('#ts-convert');
  const utcEl = container.querySelector('#ts-utc') as HTMLElement;
  const localEl = container.querySelector('#ts-local') as HTMLElement;
  const isoEl = container.querySelector('#ts-iso') as HTMLElement;

  function update() {
    const sec = parseInt(epoch.value, 10);
    const date = new Date(sec * 1000);
    if (utcEl) utcEl.textContent = date.toUTCString();
    if (localEl) localEl.textContent = date.toString();
    if (isoEl) isoEl.textContent = date.toISOString();
  }

  convertBtn?.addEventListener('click', () => {
    update();
    audio.playClick();
  });

  const iv = setInterval(() => {
    if (live) live.textContent = String(Math.floor(Date.now() / 1000));
  }, 1000);

  update();

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    clearInterval(iv);
  });
}

/**
 * 7. Diff Checker
 */
export function renderDiffChecker(container: HTMLElement, win: Win95Window) {
  win.setTitle('Visual Diff Checker 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="flex-1 grid grid-cols-2 gap-2">
        <div class="flex flex-col space-y-1">
          <label class="text-xs font-bold">Original Text:</label>
          <textarea id="diff-orig" class="retro-inset flex-1 p-2 bg-white text-black font-mono text-xs resize-none select-text">const release = "1995";
const os = "Windows 95";
console.log(os);</textarea>
        </div>
        <div class="flex flex-col space-y-1">
          <label class="text-xs font-bold">Modified Text:</label>
          <textarea id="diff-mod" class="retro-inset flex-1 p-2 bg-white text-black font-mono text-xs resize-none select-text">const release = "2026";
const os = "Piush 95";
console.log(os);</textarea>
        </div>
      </div>

      <div class="flex justify-center">
        <button id="diff-btn" class="retro-btn !py-0.5 !px-4 font-bold text-xs">Compare Diffs</button>
      </div>

      <div class="h-28 flex flex-col space-y-1">
        <label class="text-xs font-bold">Diff Result:</label>
        <div id="diff-result" class="retro-inset flex-1 p-2 bg-white text-xs overflow-auto select-text font-mono"></div>
      </div>
    </div>
  `;

  const orig = container.querySelector('#diff-orig') as HTMLTextAreaElement;
  const mod = container.querySelector('#diff-mod') as HTMLTextAreaElement;
  const result = container.querySelector('#diff-result') as HTMLElement;
  const btn = container.querySelector('#diff-btn');

  function compare() {
    const lines1 = orig.value.split('\n');
    const lines2 = mod.value.split('\n');
    const max = Math.max(lines1.length, lines2.length);

    let html = '';
    for (let i = 0; i < max; i++) {
      const l1 = lines1[i];
      const l2 = lines2[i];
      if (l1 === l2) {
        html += `<div class="text-gray-700">  ${l1 || ''}</div>`;
      } else {
        if (l1 !== undefined) html += `<div class="bg-red-100 text-red-800">- ${l1}</div>`;
        if (l2 !== undefined) html += `<div class="bg-green-100 text-green-800">+ ${l2}</div>`;
      }
    }
    result.innerHTML = html;
    audio.playClick();
  }

  btn?.addEventListener('click', compare);
  compare();
}

/**
 * 8. Markdown Editor
 */
export function renderMarkdownEditor(container: HTMLElement, win: Win95Window) {
  win.setTitle('Markdown Editor 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="flex-1 grid grid-cols-2 gap-2">
        <div class="flex flex-col space-y-1">
          <label class="text-xs font-bold">Markdown Source:</label>
          <textarea id="md-source" class="retro-inset flex-1 p-2 bg-white text-black font-mono text-xs resize-none select-text"># Piush 95 OS
Welcome to the interactive retro desktop.

## Features
- **Accessories**: Notepad, Paint, Calculator
- *Games*: Minesweeper, Solitaire, Pinball
- \`code\`: Real Web Audio & VFS
</textarea>
        </div>
        <div class="flex flex-col space-y-1">
          <label class="text-xs font-bold">Rendered HTML Preview:</label>
          <div id="md-preview" class="retro-inset flex-1 p-2 bg-white text-black text-xs overflow-auto select-text prose"></div>
        </div>
      </div>
    </div>
  `;

  const src = container.querySelector('#md-source') as HTMLTextAreaElement;
  const prev = container.querySelector('#md-preview') as HTMLElement;

  function renderMd() {
    let md = src.value;
    // Simple markdown renderer
    md = md.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold my-1">$1</h3>');
    md = md.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold my-1">$1</h2>');
    md = md.replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold my-1 border-b pb-1">$1</h1>');
    md = md.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    md = md.replace(/\*(.*)\*/gim, '<em>$1</em>');
    md = md.replace(/`(.*)`/gim, '<code class="bg-gray-200 px-1 py-0.5">$1</code>');
    md = md.replace(/^\- (.*$)/gim, '<li>$1</li>');
    md = md.replace(/\n$/gim, '<br />');
    prev.innerHTML = md;
  }

  src?.addEventListener('input', renderMd);
  renderMd();
}

/**
 * 9. API Tester
 */
export function renderApiTester(container: HTMLElement, win: Win95Window) {
  win.setTitle('HTTP API Tester 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <div class="flex items-center gap-2">
        <select id="api-method" class="retro-inset px-2 py-0.5 bg-white text-xs font-bold">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
        <input type="text" id="api-url" value="https://api.github.com/users/piushks" class="retro-inset flex-1 px-2 py-0.5 bg-white text-black font-mono text-xs" />
        <button id="api-send-btn" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Send</button>
      </div>

      <div class="flex items-center justify-between text-[11px] px-1">
        <span>Status: <strong id="api-status">None</strong></span>
        <span>Time: <strong id="api-time">0 ms</strong></span>
      </div>

      <div class="flex-1 flex flex-col space-y-1">
        <label class="text-xs font-bold">Response Body:</label>
        <pre id="api-response" class="retro-inset flex-1 p-2 bg-black text-green-400 text-xs overflow-auto select-text font-mono leading-tight">Click "Send" to execute request...</pre>
      </div>
    </div>
  `;

  const methodEl = container.querySelector('#api-method') as HTMLSelectElement;
  const urlEl = container.querySelector('#api-url') as HTMLInputElement;
  const sendBtn = container.querySelector('#api-send-btn');
  const statusEl = container.querySelector('#api-status') as HTMLElement;
  const timeEl = container.querySelector('#api-time') as HTMLElement;
  const respEl = container.querySelector('#api-response') as HTMLElement;

  sendBtn?.addEventListener('click', async () => {
    audio.playClick();
    const start = performance.now();
    try {
      if (statusEl) statusEl.textContent = 'Connecting...';
      const res = await fetch(urlEl.value, { method: methodEl.value });
      const elapsed = Math.round(performance.now() - start);
      if (statusEl) statusEl.textContent = `${res.status} ${res.statusText}`;
      if (timeEl) timeEl.textContent = `${elapsed} ms`;
      const json = await res.json();
      respEl.textContent = JSON.stringify(json, null, 2);
      audio.playDing();
    } catch (e) {
      if (statusEl) statusEl.textContent = 'Error';
      respEl.textContent = `Fetch Failed: ${(e as Error).message}`;
      audio.playError();
    }
  });
}

/**
 * JSON Toolkit – Format, Validate, Minify & Inspect JSON
 */
export function renderJsonToolkit(container: HTMLElement, win: Win95Window) {
  win.setTitle('JSON Toolkit');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <!-- Toolbar -->
      <div class="flex items-center gap-1.5 pb-1 border-b border-white text-xs">
        <button id="json-format-btn" class="retro-btn !py-0.5 !px-3 font-bold">✨ Format</button>
        <button id="json-minify-btn" class="retro-btn !py-0.5 !px-3">📦 Minify</button>
        <button id="json-validate-btn" class="retro-btn !py-0.5 !px-3">🩺 Validate</button>
        <button id="json-sample-btn" class="retro-btn !py-0.5 !px-3">📋 Sample</button>
        <button id="json-copy-btn" class="retro-btn !py-0.5 !px-3">📄 Copy</button>
        <button id="json-clear-btn" class="retro-btn !py-0.5 !px-3 ml-auto">Clear</button>
      </div>

      <!-- Editor Textarea -->
      <div class="flex-1 flex flex-col space-y-1">
        <div class="flex justify-between items-center text-xs">
          <label class="font-bold">JSON Document Editor:</label>
          <span id="json-status" class="font-bold text-gray-700">Ready</span>
        </div>
        <textarea id="json-input" class="retro-inset flex-1 p-2 bg-white text-black font-mono text-xs whitespace-pre resize-none" spellcheck="false" placeholder="Paste or type JSON data here..."></textarea>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#json-input') as HTMLTextAreaElement;
  const statusEl = container.querySelector('#json-status') as HTMLElement;

  const sampleObj = {
    name: 'Piush KS',
    role: 'Senior Mobile & Cloud Engineer',
    system: 'Windows 95 Web Desktop',
    verifiedPages: 73,
    quizQuestions: 550,
    skills: ['Kotlin', 'Swift', 'Flutter', 'React', 'TypeScript', 'Astro', 'AWS'],
    stats: {
      experienceYears: 8,
      globalUsers: 10000000,
      craftPercentage: 100
    }
  };

  inputEl.value = JSON.stringify(sampleObj, null, 2);

  container.querySelector('#json-format-btn')?.addEventListener('click', () => {
    audio.playClick();
    try {
      const parsed = JSON.parse(inputEl.value);
      inputEl.value = JSON.stringify(parsed, null, 2);
      if (statusEl) {
        statusEl.textContent = 'Valid JSON (Formatted)';
        statusEl.className = 'font-bold text-emerald-700';
      }
    } catch (e) {
      audio.playError();
      if (statusEl) {
        statusEl.textContent = `Invalid: ${(e as Error).message}`;
        statusEl.className = 'font-bold text-red-700';
      }
    }
  });

  container.querySelector('#json-minify-btn')?.addEventListener('click', () => {
    audio.playClick();
    try {
      const parsed = JSON.parse(inputEl.value);
      inputEl.value = JSON.stringify(parsed);
      if (statusEl) {
        statusEl.textContent = 'Valid JSON (Minified)';
        statusEl.className = 'font-bold text-emerald-700';
      }
    } catch (e) {
      audio.playError();
      if (statusEl) {
        statusEl.textContent = `Invalid: ${(e as Error).message}`;
        statusEl.className = 'font-bold text-red-700';
      }
    }
  });

  container.querySelector('#json-validate-btn')?.addEventListener('click', () => {
    audio.playClick();
    try {
      JSON.parse(inputEl.value);
      audio.playDing();
      if (statusEl) {
        statusEl.textContent = 'Valid JSON Schema & Syntax!';
        statusEl.className = 'font-bold text-emerald-700';
      }
    } catch (e) {
      audio.playError();
      if (statusEl) {
        statusEl.textContent = `Error: ${(e as Error).message}`;
        statusEl.className = 'font-bold text-red-700';
      }
    }
  });

  container.querySelector('#json-sample-btn')?.addEventListener('click', () => {
    audio.playClick();
    inputEl.value = JSON.stringify(sampleObj, null, 2);
    if (statusEl) {
      statusEl.textContent = 'Sample Loaded';
      statusEl.className = 'font-bold text-gray-700';
    }
  });

  container.querySelector('#json-copy-btn')?.addEventListener('click', () => {
    audio.playClick();
    navigator.clipboard?.writeText(inputEl.value);
    if (statusEl) {
      statusEl.textContent = 'Copied to Clipboard!';
      statusEl.className = 'font-bold text-blue-800';
    }
  });

  container.querySelector('#json-clear-btn')?.addEventListener('click', () => {
    audio.playClick();
    inputEl.value = '';
    if (statusEl) {
      statusEl.textContent = 'Cleared';
      statusEl.className = 'font-bold text-gray-700';
    }
  });
}


