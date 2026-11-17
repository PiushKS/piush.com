// Piush 95 Multi-Window Manager
// Manages draggable, resizable, focusable, minimizable Windows 95 application windows

import { audio } from './audio';

export interface WindowOptions {
  appId: string;
  title: string;
  icon?: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  x?: number;
  y?: number;
  resizable?: boolean;
  onClose?: () => void;
  render: (container: HTMLElement, win: Win95Window) => void;
}

function formatWindowIcon(icon: string): string {
  if (!icon) return '';
  if (icon.startsWith('<img') || icon.startsWith('<svg')) return icon;
  if (icon.startsWith('/') || icon.endsWith('.png') || icon.endsWith('.svg')) {
    return `<img src="${icon}" class="size-4 shrink-0 [image-rendering:pixelated]" alt="" />`;
  }
  return icon;
}

export class Win95Window {
  public id: string;
  public appId: string;
  public title: string;
  public icon: string;
  public element: HTMLElement;
  public contentElement: HTMLElement;
  public isMaximized = false;
  public isMinimized = false;
  public zIndex = 100;
  private prevBounds: { x: number; y: number; w: number; h: number } | null = null;
  private onCloseCallback?: () => void;
  private closeCallbacks: Array<() => void> = [];
  private isDestroyed = false;
  private manager: Win95WindowManager;

  constructor(options: WindowOptions, manager: Win95WindowManager) {
    this.manager = manager;
    this.id = 'win-' + Math.random().toString(36).substring(2, 9);
    this.appId = options.appId;
    this.title = options.title;
    this.icon = options.icon || '💻';
    this.onCloseCallback = options.onClose;

    // Viewport dimensions
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

    const isMobile = vw < 640;
    const w = isMobile ? Math.min(vw - 16, 500) : Math.min(vw - 60, options.width || 560);
    const h = isMobile ? Math.min(vh - 90, 520) : Math.min(vh - 120, options.height || 420);

    // Cascade position
    const offset = (manager.getAllWindows().length % 8) * 24;
    const x = isMobile ? 8 : (options.x !== undefined ? options.x : Math.max(20, Math.min(vw - w - 20, 120 + offset)));
    const y = isMobile ? 8 : (options.y !== undefined ? options.y : Math.max(20, Math.min(vh - h - 60, 40 + offset)));

    // Create DOM element
    const winEl = document.createElement('div');
    winEl.id = this.id;
    winEl.className = 'win95-app-window';
    winEl.style.position = 'absolute';
    winEl.style.left = `${x}px`;
    winEl.style.top = `${y}px`;
    winEl.style.width = `${w}px`;
    winEl.style.height = `${h}px`;
    winEl.style.zIndex = '100';

    // Titlebar
    const titlebar = document.createElement('div');
    titlebar.className = 'retro-titlebar !h-7 !min-h-[28px] !px-2 flex items-center justify-between cursor-move select-none';

    const titleLeft = document.createElement('div');
    titleLeft.className = 'win95-title-left flex items-center gap-1.5 text-xs text-white overflow-hidden pointer-events-none font-bold';
    titleLeft.innerHTML = `<span class="win95-title-icon size-4 shrink-0 flex items-center justify-center">${formatWindowIcon(this.icon)}</span><span class="win95-title-text truncate">${this.title}</span>`;

    const controls = document.createElement('div');
    controls.className = 'flex items-center gap-1 shrink-0 ml-2';

    const minBtn = document.createElement('button');
    minBtn.type = 'button';
    minBtn.className = 'retro-titlebar-btn !w-4 !h-4 text-[10px]';
    minBtn.title = 'Minimize';
    minBtn.textContent = '_';
    minBtn.onclick = (e) => {
      e.stopPropagation();
      this.minimize();
    };

    const maxBtn = document.createElement('button');
    maxBtn.type = 'button';
    maxBtn.className = 'retro-titlebar-btn !w-4 !h-4 text-[10px]';
    maxBtn.title = 'Maximize / Restore';
    maxBtn.innerHTML = '&#9633;';
    maxBtn.onclick = (e) => {
      e.stopPropagation();
      this.toggleMaximize();
    };

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'retro-titlebar-btn hover:bg-[#cc0000] hover:text-white !w-4 !h-4 text-[10px]';
    closeBtn.title = 'Close';
    closeBtn.innerHTML = '&#10005;';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      this.close();
    };

    controls.appendChild(minBtn);
    controls.appendChild(maxBtn);
    controls.appendChild(closeBtn);

    titlebar.appendChild(titleLeft);
    titlebar.appendChild(controls);

    // Content container
    const content = document.createElement('div');
    content.className = 'win95-window-content flex-1 overflow-auto flex flex-col bg-[#c0c0c0] text-black font-mono text-xs';
    this.contentElement = content;

    winEl.appendChild(titlebar);
    winEl.appendChild(content);
    this.element = winEl;

    // Focus on mousedown / touchstart
    winEl.addEventListener('mousedown', () => this.focus());
    winEl.addEventListener('touchstart', () => this.focus(), { passive: true });

    // Dragging logic
    this.setupDragging(titlebar);

    // Render app content
    try {
      options.render(content, this);
    } catch (err) {
      console.error(`Error rendering app ${this.appId}:`, err);
      content.innerHTML = `<div class="p-4 text-red-700 font-bold">Error loading application ${this.title}.</div>`;
    }
  }

  private setupDragging(titlebar: HTMLElement) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'BUTTON') return;
      if (this.isMaximized) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = this.element.offsetLeft;
      initialTop = this.element.offsetTop;
      this.focus();
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const desktop = document.getElementById('win95-desktop-screen');
      const maxW = desktop ? desktop.clientWidth - 40 : 1200;
      const maxH = desktop ? desktop.clientHeight - 60 : 700;

      const newLeft = Math.max(0, Math.min(maxW, initialLeft + dx));
      const newTop = Math.max(0, Math.min(maxH, initialTop + dy));

      this.element.style.left = `${newLeft}px`;
      this.element.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    titlebar.addEventListener('mousedown', onMouseDown);

    // Touch support for dragging
    titlebar.addEventListener('touchstart', (e: TouchEvent) => {
      if ((e.target as HTMLElement).tagName === 'BUTTON') return;
      if (this.isMaximized || e.touches.length !== 1) return;
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      initialLeft = this.element.offsetLeft;
      initialTop = this.element.offsetTop;
      this.focus();
    }, { passive: true });

    titlebar.addEventListener('touchmove', (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      this.element.style.left = `${Math.max(0, initialLeft + dx)}px`;
      this.element.style.top = `${Math.max(0, initialTop + dy)}px`;
    }, { passive: true });

    titlebar.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  public focus() {
    this.manager.bringToFront(this.id);
  }

  public minimize() {
    audio.playMinimize();
    this.isMinimized = true;
    this.element.style.display = 'none';
    this.manager.updateTaskbar();
  }

  public restore() {
    audio.playRestore();
    this.isMinimized = false;
    this.element.style.display = 'flex';
    this.focus();
    this.manager.updateTaskbar();
  }

  public toggleMaximize() {
    audio.playClick();
    if (this.isMaximized) {
      // Restore previous bounds
      if (this.prevBounds) {
        this.element.style.left = `${this.prevBounds.x}px`;
        this.element.style.top = `${this.prevBounds.y}px`;
        this.element.style.width = `${this.prevBounds.w}px`;
        this.element.style.height = `${this.prevBounds.h}px`;
      }
      this.isMaximized = false;
    } else {
      // Save current bounds
      this.prevBounds = {
        x: this.element.offsetLeft,
        y: this.element.offsetTop,
        w: this.element.offsetWidth,
        h: this.element.offsetHeight,
      };
      this.element.style.left = '0px';
      this.element.style.top = '0px';
      this.element.style.width = '100%';
      this.element.style.height = 'calc(100% - 36px)'; // Leave taskbar visible
      this.isMaximized = true;
    }
  }

  public onClose(callback: () => void): () => void {
    this.closeCallbacks.push(callback);
    return () => {
      this.closeCallbacks = this.closeCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onDestroy(callback: () => void): () => void {
    return this.onClose(callback);
  }

  public cleanup() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    // Dispatch legacy removal events for backward compatibility
    try {
      this.element.dispatchEvent(new CustomEvent('win95:close'));
      this.element.dispatchEvent(new CustomEvent('DOMNodeRemovedFromDocument'));
    } catch (_) { }

    // Execute registered lifecycle handlers
    while (this.closeCallbacks.length > 0) {
      const cb = this.closeCallbacks.shift();
      try {
        cb?.();
      } catch (err) {
        console.error('Error executing window close callback:', err);
      }
    }

    if (this.onCloseCallback) {
      try {
        this.onCloseCallback();
      } catch (err) {
        console.error('Error in window onCloseCallback:', err);
      }
      this.onCloseCallback = undefined;
    }
  }

  public close() {
    audio.playClick();
    this.cleanup();
    this.manager.destroyWindow(this.id);
  }

  public setTitle(newTitle: string) {
    this.title = newTitle;
    const titleSpan = this.element.querySelector('.retro-titlebar .win95-title-text');
    if (titleSpan) {
      titleSpan.textContent = newTitle;
    } else {
      const fallback = this.element.querySelector('.retro-titlebar span.truncate');
      if (fallback) fallback.textContent = newTitle;
    }
    this.manager.updateTaskbar();
  }
}

export class Win95WindowManager {
  private windows: Map<string, Win95Window> = new Map();
  private topZIndex = 100;
  private activeWindowId: string | null = null;
  private container: HTMLElement | null = null;

  public setContainer(container: HTMLElement) {
    this.container = container;
  }

  public openWindow(options: WindowOptions): Win95Window {
    audio.playChord();
    const win = new Win95Window(options, this);
    this.windows.set(win.id, win);

    if (this.container) {
      this.container.appendChild(win.element);
    } else {
      const desktop = document.getElementById('win95-desktop-screen');
      if (desktop) {
        const desktopArea = desktop.querySelector('.flex-1') || desktop;
        desktopArea.appendChild(win.element);
      }
    }

    this.bringToFront(win.id);
    this.updateTaskbar();
    return win;
  }

  public bringToFront(id: string) {
    const win = this.windows.get(id);
    if (!win) return;

    this.topZIndex += 2;
    win.zIndex = this.topZIndex;
    win.element.style.zIndex = String(this.topZIndex);
    this.activeWindowId = id;

    // Update titlebars (active = blue, inactive = gray)
    for (const other of this.windows.values()) {
      const tb = other.element.querySelector('.retro-titlebar');
      if (tb) {
        if (other.id === id) {
          tb.classList.remove('!bg-[#808080]');
          tb.classList.add('!bg-[#000080]');
        } else {
          tb.classList.remove('!bg-[#000080]');
          tb.classList.add('!bg-[#808080]');
        }
      }
    }

    this.updateTaskbar();
  }

  public destroyWindow(id: string) {
    const win = this.windows.get(id);
    if (!win) return;
    win.cleanup();
    if (win.element.parentNode) {
      win.element.parentNode.removeChild(win.element);
    }
    this.windows.delete(id);
    if (this.activeWindowId === id) {
      const remaining = Array.from(this.windows.values());
      if (remaining.length > 0) {
        this.bringToFront(remaining[remaining.length - 1].id);
      } else {
        this.activeWindowId = null;
      }
    }
    this.updateTaskbar();
  }

  public getWindow(id: string): Win95Window | null {
    return this.windows.get(id) || null;
  }

  public getWindowByAppId(appId: string): Win95Window | null {
    for (const win of this.windows.values()) {
      if (win.appId === appId && !win.isMinimized) return win;
    }
    return null;
  }

  public getAllWindows(): Win95Window[] {
    return Array.from(this.windows.values());
  }

  public updateTaskbar() {
    const taskbarContainer = document.getElementById('win95-running-apps');
    if (!taskbarContainer) return;

    taskbarContainer.innerHTML = '';
    for (const win of this.windows.values()) {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isActive = this.activeWindowId === win.id && !win.isMinimized;
      btn.className = `win95-taskbar-item ${isActive ? 'is-active bg-[#d0d0d0] shadow-[inset_1px_1px_0px_#000000]' : ''}`;
      btn.title = win.title;
      btn.innerHTML = `<span class="size-4 shrink-0 flex items-center justify-center">${formatWindowIcon(win.icon)}</span><span class="truncate">${win.title}</span>`;

      btn.onclick = () => {
        if (win.isMinimized) {
          win.restore();
        } else if (this.activeWindowId === win.id) {
          win.minimize();
        } else {
          win.focus();
        }
      };

      taskbarContainer.appendChild(btn);
    }
  }

  public closeAll() {
    for (const win of Array.from(this.windows.values())) {
      win.close();
    }
  }

  public minimizeAll() {
    for (const win of this.windows.values()) {
      if (!win.isMinimized) win.minimize();
    }
  }

  public cascadeWindows() {
    let offset = 24;
    const wins = Array.from(this.windows.values()).filter(w => !w.isMinimized);
    wins.forEach((w) => {
      w.restore();
      const el = w.element;
      el.style.left = `${offset}px`;
      el.style.top = `${offset}px`;
      w.focus();
      offset += 26;
      if (offset > 240) offset = 24;
    });
  }

  public tileWindows(horizontal = true) {
    const wins = Array.from(this.windows.values()).filter(w => !w.isMinimized);
    if (wins.length === 0) return;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight - 40;
    if (horizontal) {
      const tileH = Math.max(180, Math.floor(screenH / wins.length));
      wins.forEach((w, i) => {
        w.restore();
        const el = w.element;
        el.style.left = '4px';
        el.style.top = `${i * tileH + 4}px`;
        el.style.width = `${screenW - 8}px`;
        el.style.height = `${tileH - 8}px`;
      });
    } else {
      const tileW = Math.max(240, Math.floor(screenW / wins.length));
      wins.forEach((w, i) => {
        w.restore();
        const el = w.element;
        el.style.left = `${i * tileW + 4}px`;
        el.style.top = '4px';
        el.style.width = `${tileW - 8}px`;
        el.style.height = `${screenH - 8}px`;
      });
    }
  }
}

export const windowManager = new Win95WindowManager();

