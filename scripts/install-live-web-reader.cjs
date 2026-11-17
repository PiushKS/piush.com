const fs = require('fs');
const path = require('path');

const iePath = path.join(__dirname, '../src/lib/win95/apps/internetExplorer.ts');
let code = fs.readFileSync(iePath, 'utf8');

// Replace openReaderMode with openLiveWebPage implementation
const oldReaderModeStart = `  const openReaderMode = async (urlToRead?: string) => {`;
const oldReaderModeEnd = `  container.querySelector('#ie-info-bar-reader')?.addEventListener('click', () => openReaderMode());`;

const startIndex = code.indexOf(oldReaderModeStart);
const endIndex = code.indexOf(oldReaderModeEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find openReaderMode boundaries in internetExplorer.ts');
  process.exit(1);
}

const beforeReader = code.slice(0, startIndex);
const afterReader = code.slice(endIndex + oldReaderModeEnd.length);

const newLiveWebPageCode = `  const openLiveWebPage = async (urlToOpen?: string) => {
    const targetUrl = urlToOpen || currentUrl;
    if (targetUrl.startsWith('retro:') || !targetUrl.startsWith('http')) return;

    let hostname = targetUrl;
    try {
      hostname = new URL(targetUrl).hostname;
    } catch (_) {}

    if (pageContainer) {
      if (webIframe) webIframe.classList.add('hidden');
      pageContainer.classList.remove('hidden');
      if (statusText) statusText.textContent = \`Connecting to \${hostname}...\`;
      if (progressFill) progressFill.style.width = '35%';
      if (globeSvg) globeSvg.classList.add('animate-pulse');
      if (globeOrbit) globeOrbit.classList.remove('hidden');

      win.setTitle(\`The Microsoft Internet Explorer - \${hostname}\`);

      pageContainer.innerHTML = \`
        <div class="min-h-[300px] flex flex-col items-center justify-center p-6 text-black font-sans space-y-3 select-none">
          <img src="/images/win95-icons/globe.png?v=1995.2" class="size-8 animate-spin [image-rendering:pixelated]" alt="" />
          <div class="text-xs font-bold font-sans">Connecting to Web Server...</div>
          <div class="text-[11px] font-mono text-gray-600 bg-gray-100 px-3 py-1 border border-gray-400 max-w-md truncate">\${targetUrl}</div>
          <div class="text-[10px] text-gray-500 font-sans">Accessing live page content via Internet Explorer Gateway...</div>
        </div>
      \`;

      try {
        if (progressFill) progressFill.style.width = '60%';
        const res = await fetch(\`https://r.jina.ai/\${targetUrl}\`);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const text = await res.text();

        // Extract title if present in Jina Reader output (Title: ...)
        let pageTitle = hostname;
        const titleMatch = text.match(/^Title:\\s*([^\\n]+)/i);
        if (titleMatch && titleMatch[1]) {
          pageTitle = titleMatch[1].trim();
        }

        win.setTitle(\`The Microsoft Internet Explorer - \${pageTitle}\`);

        // Markdown to HTML conversion
        const bodyContent = text
          .replace(/^Title:[^\\n]*\\n+/i, '')
          .replace(/^URL Source:[^\\n]*\\n+/i, '')
          .replace(/^Markdown Content:[^\\n]*\\n+/i, '');

        let escaped = bodyContent
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        // Code blocks
        escaped = escaped.replace(/\`\`\`([a-z0-9_-]*)\\n([\\s\\S]*?)\`\`\`/gi, (_, lang, codeBlock) => {
          return \`<pre class="my-3 p-2.5 bg-gray-100 border border-gray-400 font-mono text-xs overflow-x-auto text-black"><code>\${codeBlock}</code></pre>\`;
        });

        // Inline code
        escaped = escaped.replace(/\`([^\`]+)\`/g, '<code class="bg-gray-100 px-1 border border-gray-300 font-mono text-[11px]">$1</code>');

        // Images
        escaped = escaped.replace(/!\\[([^\\]]*)\\]\\((https?:\\/\\/[^\\s\\)]+)\\)/g, (_, alt, src) => {
          return \`<div class="my-3 text-center"><img src="\${src}" alt="\${alt}" class="max-w-full max-h-96 mx-auto border border-gray-400 p-0.5 bg-white shadow-sm inline-block" loading="lazy" />\${alt ? \`<div class="text-[11px] text-gray-500 italic mt-1 font-sans">\${alt}</div>\` : ''}</div>\`;
        });

        // Markdown links: [text](url)
        escaped = escaped.replace(/\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s\\)]+|\\/[^\\s\\)]*)\\)/g, (_, label, href) => {
          let dest = href;
          if (dest.startsWith('/')) {
            try {
              dest = new URL(dest, targetUrl).href;
            } catch (_) {}
          }
          return \`<a href="\${dest}" class="ie-live-link text-blue-800 underline font-medium hover:text-red-700 cursor-pointer" data-dest="\${dest}">\${label}</a>\`;
        });

        // Paragraphs and Headings
        const blocks = escaped.split(/\\n\\n+/);
        const formatted = blocks
          .map((para) => {
            const trimmed = para.trim();
            if (!trimmed) return '';
            if (trimmed.startsWith('# ')) {
              return \`<h1 class="text-xl sm:text-2xl font-bold text-blue-900 border-b border-gray-300 pb-1 mt-4 mb-2 font-serif">\${trimmed.slice(2)}</h1>\`;
            }
            if (trimmed.startsWith('## ')) {
              return \`<h2 class="text-lg sm:text-xl font-bold text-blue-900 mt-3 mb-1 font-serif">\${trimmed.slice(3)}</h2>\`;
            }
            if (trimmed.startsWith('### ')) {
              return \`<h3 class="text-base font-bold text-gray-900 mt-2 mb-1 font-serif">\${trimmed.slice(4)}</h3>\`;
            }
            if (trimmed.startsWith('#### ')) {
              return \`<h4 class="text-sm font-bold text-gray-800 mt-2 mb-1 font-sans">\${trimmed.slice(5)}</h4>\`;
            }
            if (trimmed.startsWith('&gt; ')) {
              return \`<blockquote class="border-l-4 border-[#000080] pl-3 py-1 my-2 bg-gray-50 italic text-gray-800">\${trimmed.slice(5)}</blockquote>\`;
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const items = trimmed.split('\\n').map((li) => \`<li class="my-0.5">\${li.replace(/^[-*]\\s+/, '')}</li>\`).join('');
              return \`<ul class="list-disc pl-5 my-2 text-xs sm:text-sm text-gray-900 space-y-0.5 font-serif">\${items}</ul>\`;
            }
            if (/^\\d+\\.\\s/.test(trimmed)) {
              const items = trimmed.split('\\n').map((li) => \`<li class="my-0.5">\${li.replace(/^\\d+\\.\\s+/, '')}</li>\`).join('');
              return \`<ol class="list-decimal pl-5 my-2 text-xs sm:text-sm text-gray-900 space-y-0.5 font-serif">\${items}</ol>\`;
            }
            return \`<p class="my-2 leading-relaxed text-xs sm:text-sm text-gray-900 font-serif">\${trimmed.replace(/\\n/g, '<br/>')}</p>\`;
          })
          .join('');

        pageContainer.innerHTML = \`
          <div class="flex flex-col min-h-full bg-white text-black font-sans select-text">
            <!-- Windows 95 Information Bar -->
            <div class="bg-[#ffffcc] border-b border-[#808080] px-3 py-1.5 text-xs flex items-center justify-between font-sans shadow-sm text-black shrink-0 sticky top-0 z-20">
              <div class="flex items-center gap-2 truncate">
                <img src="/images/win95-icons/globe-16.png?v=1995.2" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />
                <span class="font-bold text-blue-900 truncate">Internet Explorer Live Web Reader</span>
                <span class="text-gray-500 font-mono text-[10px] truncate max-w-xs">\${targetUrl}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button type="button" class="ie-action-newtab retro-btn !py-0.5 !px-2 text-xs font-bold font-sans flex items-center gap-1" data-url="\${targetUrl}" title="Open original site in full external browser tab">
                  <span>Open in New Window</span>
                  <span class="text-blue-900 font-bold">↗</span>
                </button>
                <button type="button" class="ie-action-home retro-btn !py-0.5 !px-2 text-xs font-bold font-sans" title="Return to Piush KS Portfolio (Default Home)">
                  Home
                </button>
              </div>
            </div>

            <!-- Page Article Content -->
            <div class="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-3 font-serif leading-relaxed" style="color: #000000; background-color: #ffffff;">
              <h1 class="text-2xl font-bold text-blue-900 border-b border-gray-300 pb-2 mb-3 font-serif">\${pageTitle}</h1>
              <div class="text-[11px] text-gray-500 font-mono pb-2 border-b border-gray-100 flex justify-between">
                <span>Source: \${targetUrl}</span>
                <span class="text-green-800">Status: Verified 200 OK</span>
              </div>
              \${formatted}
            </div>
          </div>
        \`;

        // Wire link clicks
        pageContainer.querySelectorAll('.ie-live-link').forEach((link) => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const dest = (link as HTMLElement).getAttribute('data-dest');
            if (dest) navigateTo(dest);
          });
        });

        // Wire New Tab and Home buttons
        pageContainer.querySelectorAll('.ie-action-newtab').forEach((btn) => {
          btn.addEventListener('click', () => {
            const dest = (btn as HTMLElement).getAttribute('data-url') || targetUrl;
            openExternal(dest);
          });
        });

        pageContainer.querySelectorAll('.ie-action-home').forEach((btn) => {
          btn.addEventListener('click', () => {
            navigateTo('https://piush.com/');
          });
        });

        applyFontScale();
      } catch (_) {
        pageContainer.innerHTML = \`
          <div class="min-h-[300px] flex flex-col items-center justify-center p-6 text-black font-sans space-y-3 select-none">
            <div class="border-2 border-white shadow-[2px_2px_0px_#000000] bg-[#c0c0c0] p-4 max-w-md w-full space-y-3">
              <div class="flex items-center gap-2 border-b border-[#808080] pb-2 font-bold text-xs">
                <img src="/images/win95-icons/stop-16.png?v=1995.2" class="size-4 [image-rendering:pixelated]" alt="" />
                <span>Internet Explorer – Connection Error</span>
              </div>
              <p class="text-xs text-gray-900 leading-normal font-sans">
                Internet Explorer cannot open the Internet site <strong>\${targetUrl}</strong>.<br/>
                The server was not found or was unavailable.
              </p>
              <div class="flex justify-end gap-2 pt-2 border-t border-white">
                <button type="button" class="ie-action-retry retro-btn !py-1 !px-3 text-xs font-bold font-sans">Retry</button>
                <button type="button" class="ie-action-newtab retro-btn !py-1 !px-3 text-xs font-bold font-sans flex items-center gap-1" data-url="\${targetUrl}">
                  <span>Open Tab</span>
                  <span>↗</span>
                </button>
                <button type="button" class="ie-action-home retro-btn !py-1 !px-3 text-xs font-bold font-sans">Home</button>
              </div>
            </div>
          </div>
        \`;

        pageContainer.querySelector('.ie-action-retry')?.addEventListener('click', () => openLiveWebPage(targetUrl));
        pageContainer.querySelector('.ie-action-newtab')?.addEventListener('click', () => openExternal(targetUrl));
        pageContainer.querySelector('.ie-action-home')?.addEventListener('click', () => navigateTo('https://piush.com/'));
      } finally {
        if (statusText) statusText.textContent = 'Done';
        if (globeSvg) globeSvg.classList.remove('animate-pulse');
        if (globeOrbit) globeOrbit.classList.add('hidden');
        if (progressFill) progressFill.style.width = '0%';
        isLoading = false;
      }
    }
  };

  const openReaderMode = openLiveWebPage;
  container.querySelector('#ie-info-bar-reader')?.addEventListener('click', () => openLiveWebPage());`;

code = beforeReader + newLiveWebPageCode + afterReader;

// Ensure zero em-dashes
code = code.replace(/\u2014/g, '–');

fs.writeFileSync(iePath, code, 'utf8');
console.log('Successfully installed openLiveWebPage into internetExplorer.ts!');
