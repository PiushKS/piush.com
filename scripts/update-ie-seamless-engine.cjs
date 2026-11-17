const fs = require('fs');
const path = require('path');

const iePath = path.join(__dirname, '../src/lib/win95/apps/internetExplorer.ts');
let code = fs.readFileSync(iePath, 'utf8');

// 1. Update parseTargetUrl to route external sites to live: reader mode
const oldExternalBlock = `    // 3. Any external web site (Wikipedia, Hacker News, Google, Example, etc.)
    let fullUrl = raw;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }

    // Check if the target site blocks iframe embedding
    const isFrameBlocked = isBlockedByFrameSecurity(fullUrl);
    if (isFrameBlocked) {
      return {
        displayUrl: fullUrl,
        isRetro: true,
        retroKey: \`security:\${fullUrl}\`,
        isExternal: true,
      };
    }

    return {
      displayUrl: fullUrl,
      isRetro: false,
      iframeSrc: fullUrl,
      isExternal: true,
    };`;

const newExternalBlock = `    // 3. Any external web site (Wikipedia, Hacker News, GitHub, etc.)
    let fullUrl = raw;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }

    // Route all external web destinations through the seamless Live Web Reader
    // to prevent browser frame security blocks (X-Frame-Options / CSP frame-ancestors)
    return {
      displayUrl: fullUrl,
      isRetro: true,
      retroKey: \`live:\${fullUrl}\`,
      isExternal: true,
    };`;

if (code.includes(oldExternalBlock)) {
  code = code.replace(oldExternalBlock, newExternalBlock);
  console.log('Successfully updated parseTargetUrl for external sites!');
} else {
  console.error('Could not find oldExternalBlock');
}

// 2. Update navigateTo to handle live: target
const oldRouteABlock = `    // Route A: 1995 Cyberspace Retro Simulation
    if (target.isRetro && target.retroKey) {
      if (infoBar) infoBar.classList.add('hidden');
      if (webIframe) webIframe.classList.add('hidden');
      if (pageContainer) pageContainer.classList.remove('hidden');

      setTimeout(() => {
        const retroData = getRetroPageContent(target.retroKey!);
        win.setTitle(\`The Microsoft Internet Explorer - \${retroData.title}\`);
        if (pageContainer) {
          pageContainer.innerHTML = retroData.html;
          wireRetroPageInteractions();
          applyFontScale();
        }
        if (statusText) statusText.textContent = 'Done';
        if (globeSvg) globeSvg.classList.remove('animate-pulse');
        if (globeOrbit) globeOrbit.classList.add('hidden');
        if (progressFill) progressFill.style.width = '0%';
        isLoading = false;
      }, 250);
      return;
    }`;

const newRouteABlock = `    // Route A: 1995 Cyberspace Retro Simulation & Live Web Reader
    if (target.isRetro && target.retroKey) {
      if (infoBar) infoBar.classList.add('hidden');
      if (webIframe) webIframe.classList.add('hidden');
      if (pageContainer) pageContainer.classList.remove('hidden');

      // Live External Web Destination
      if (target.retroKey.startsWith('live:')) {
        const liveDest = target.retroKey.replace(/^live:/, '');
        openLiveWebPage(liveDest);
        return;
      }

      setTimeout(() => {
        const retroData = getRetroPageContent(target.retroKey!);
        win.setTitle(\`The Microsoft Internet Explorer - \${retroData.title}\`);
        if (pageContainer) {
          pageContainer.innerHTML = retroData.html;
          wireRetroPageInteractions();
          applyFontScale();
        }
        if (statusText) statusText.textContent = 'Done';
        if (globeSvg) globeSvg.classList.remove('animate-pulse');
        if (globeOrbit) globeOrbit.classList.add('hidden');
        if (progressFill) progressFill.style.width = '0%';
        isLoading = false;
      }, 250);
      return;
    }`;

if (code.includes(oldRouteABlock)) {
  code = code.replace(oldRouteABlock, newRouteABlock);
  console.log('Successfully updated Route A in navigateTo!');
} else {
  console.error('Could not find oldRouteABlock');
}

// 3. Update globeSvg query selector
const oldGlobeSelector = `  const globeSvg = container.querySelector('#ie-globe-svg') as HTMLElement;`;
const newGlobeSelector = `  const globeSvg = (container.querySelector('#ie-globe-img') || container.querySelector('#ie-globe-svg')) as HTMLElement;`;

if (code.includes(oldGlobeSelector)) {
  code = code.replace(oldGlobeSelector, newGlobeSelector);
  console.log('Successfully updated globe selector!');
} else {
  console.error('Could not find oldGlobeSelector');
}

// Ensure zero em-dashes
code = code.replace(/\u2014/g, '–');

fs.writeFileSync(iePath, code, 'utf8');
console.log('Wrote initial updates to internetExplorer.ts');
