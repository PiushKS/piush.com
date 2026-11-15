// Piush 95 Virtual Filesystem (VFS)
// Provides real browser-based file storage across Notepad, WordPad, Paint, Explorer, and MS-DOS Prompt

export interface VFSItem {
  id: string;
  name: string;
  path: string;
  isFolder: boolean;
  content?: string; // Text or base64 data
  mimeType?: string;
  size: number;
  createdAt: number;
  modifiedAt: number;
}

const STORAGE_KEY = 'piush95_vfs_v1';

const DEFAULT_FILES: VFSItem[] = [
  // Root Folders
  { id: 'f-win', name: 'WINDOWS', path: 'C:\\WINDOWS', isFolder: true, size: 0, createdAt: 810000000000, modifiedAt: 810000000000 },
  { id: 'f-winsys', name: 'SYSTEM', path: 'C:\\WINDOWS\\SYSTEM', isFolder: true, size: 0, createdAt: 810000000000, modifiedAt: 810000000000 },
  { id: 'f-prog', name: 'Program Files', path: 'C:\\Program Files', isFolder: true, size: 0, createdAt: 810000000000, modifiedAt: 810000000000 },
  { id: 'f-docs', name: 'My Documents', path: 'C:\\My Documents', isFolder: true, size: 0, createdAt: 810000000000, modifiedAt: 810000000000 },
  { id: 'f-notes', name: 'Notes', path: 'C:\\My Documents\\Notes', isFolder: true, size: 0, createdAt: 810000000000, modifiedAt: 810000000000 },
  { id: 'f-pics', name: 'Pictures', path: 'C:\\My Documents\\Pictures', isFolder: true, size: 0, createdAt: 810000000000, modifiedAt: 810000000000 },
  { id: 'f-piush', name: 'PIUSH', path: 'C:\\PIUSH', isFolder: true, size: 0, createdAt: 810000000000, modifiedAt: 810000000000 },
  { id: 'f-temp', name: 'TEMP', path: 'C:\\TEMP', isFolder: true, size: 0, createdAt: 810000000000, modifiedAt: 810000000000 },

  // System Files
  {
    id: 'f-autoexec',
    name: 'AUTOEXEC.BAT',
    path: 'C:\\AUTOEXEC.BAT',
    isFolder: false,
    content: '@ECHO OFF\nPROMPT $P$G\nPATH C:\\WINDOWS;C:\\PIUSH;C:\\Program Files\nECHO Welcome to Piush 95 Operating Environment!\nECHO Type HELP for command list or launch apps directly.\n',
    mimeType: 'text/plain',
    size: 182,
    createdAt: 810000000000,
    modifiedAt: 810000000000,
  },
  {
    id: 'f-config',
    name: 'CONFIG.SYS',
    path: 'C:\\CONFIG.SYS',
    isFolder: false,
    content: 'DEVICE=C:\\WINDOWS\\HIMEM.SYS\nDOS=HIGH,UMB\nFILES=40\nBUFFERS=30\nSTACKS=9,256\n',
    mimeType: 'text/plain',
    size: 78,
    createdAt: 810000000000,
    modifiedAt: 810000000000,
  },
  {
    id: 'f-sysini',
    name: 'SYSTEM.INI',
    path: 'C:\\WINDOWS\\SYSTEM.INI',
    isFolder: false,
    content: '[boot]\nshell=Explorer.exe\nmouse.drv=mouse.drv\nnetwork.drv=net.drv\nlanguage.dll=\nsound.drv=mmsound.drv\n',
    mimeType: 'text/plain',
    size: 110,
    createdAt: 810000000000,
    modifiedAt: 810000000000,
  },

  // User Documents
  {
    id: 'f-readme',
    name: 'README.TXT',
    path: 'C:\\My Documents\\README.TXT',
    isFolder: false,
    content: `====================================================
PIUSH 95 DESKTOP ENVIRONMENT
====================================================

Welcome to the Windows 95 interactive software experience on Piush.com!

Explore fully functional applications via the Start Menu:
- Accessories: Notepad, WordPad, Paint, Calculator, Character Map
- Games: Minesweeper, Solitaire, FreeCell, Hearts, 3D Pinball, Snake, Chess
- Multimedia: Media Player, CD Player, Sound Recorder, Volume Control
- System Tools: MS-DOS Prompt, Explorer, Control Panel, Defrag, ScanDisk
- Developer Tools: JSON Toolkit, Code Playground, Regex, SVG, Hash, Base64

All files you create or modify are saved in this virtual drive!
====================================================`,
    mimeType: 'text/plain',
    size: 680,
    createdAt: 810000000000,
    modifiedAt: 810000000000,
  },
  {
    id: 'f-todo',
    name: 'TODO.TXT',
    path: 'C:\\My Documents\\Notes\\TODO.TXT',
    isFolder: false,
    content: `[✓] Master high-throughput mobile architecture (Swift, Kotlin)
[✓] Design cloud-native resilient distributed backends
[✓] Build 550 interactive developer quiz challenges
[✓] Launch Piush 95 retro OS experience
[ ] Continue exploring next-gen spatial & AI systems`,
    mimeType: 'text/plain',
    size: 260,
    createdAt: 810000000000,
    modifiedAt: 810000000000,
  },

  // Portfolio Content Files
  {
    id: 'f-about',
    name: 'ABOUT.TXT',
    path: 'C:\\PIUSH\\ABOUT.TXT',
    isFolder: false,
    content: `PIUSH KS – SENIOR MOBILE & CLOUD ARCHITECT
=============================================
Experience: 8+ Years Production Engineering
Scale: 10M+ Global Users Served Across Production Apps
Focus: High-Performance iOS (Swift/SwiftUI), Android (Kotlin/Compose),
       Cross-Platform (Flutter/React Native), Distributed Cloud Backends.

Official Website: https://piush.com
Available for Architecture Consulting & Select High-Impact Systems.`,
    mimeType: 'text/plain',
    size: 395,
    createdAt: 810000000000,
    modifiedAt: 810000000000,
  },
  {
    id: 'f-projects',
    name: 'PROJECTS.TXT',
    path: 'C:\\PIUSH\\PROJECTS.TXT',
    isFolder: false,
    content: `SELECTED PRODUCTION PROJECTS
============================
1. High-Throughput Fintech Trading Application (iOS & Android)
   - Real-time order book execution under 16ms tick latency.
2. Enterprise IoT Fleet Telemetry Platform
   - Stream processing 100k events/sec with fault-tolerant queuing.
3. Interactive Developer Quiz Platform (550 Questions)
   - Offline-first architecture with instant AST validation.
4. Piush.com Portfolio OS
   - 73 pre-rendered static edge pages with 100/100 Core Web Vitals.`,
    mimeType: 'text/plain',
    size: 510,
    createdAt: 810000000000,
    modifiedAt: 810000000000,
  },
  {
    id: 'f-skills',
    name: 'SKILLS.TXT',
    path: 'C:\\PIUSH\\SKILLS.TXT',
    isFolder: false,
    content: `CORE SPECIALIZATIONS & TECHNICAL STACK
=======================================
- Mobile: Swift, SwiftUI, Objective-C, Kotlin, Jetpack Compose, Flutter, React Native
- Cloud & Backend: Go, Node.js, TypeScript, Python, Docker, Kubernetes, AWS, GCP
- Database: PostgreSQL, Redis, DynamoDB, SQLite, Room, CoreData
- Architecture: Event-driven systems, Clean Architecture, CQRS, Offline-First Sync`,
    mimeType: 'text/plain',
    size: 420,
    createdAt: 810000000000,
    modifiedAt: 810000000000,
  },
  {
    id: 'f-contact',
    name: 'CONTACT.TXT',
    path: 'C:\\PIUSH\\CONTACT.TXT',
    isFolder: false,
    content: `CONTACT & DISPATCHES
====================
- Direct Email: hi@piush.com
- GitHub: https://github.com/piushks
- LinkedIn: https://linkedin.com/in/piushks
- X (Twitter): https://x.com/piushks
- YouTube: https://youtube.com/@PiushKS`,
    mimeType: 'text/plain',
    size: 230,
    createdAt: 810000000000,
    modifiedAt: 810000000000,
  },
];

class VirtualFileSystem {
  private items: Map<string, VFSItem> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') {
      DEFAULT_FILES.forEach((f) => this.items.set(f.path.toUpperCase(), { ...f }));
      return;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as VFSItem[];
        parsed.forEach((f) => this.items.set(f.path.toUpperCase(), f));
      } else {
        DEFAULT_FILES.forEach((f) => this.items.set(f.path.toUpperCase(), { ...f }));
        this.saveToStorage();
      }
    } catch (_) {
      DEFAULT_FILES.forEach((f) => this.items.set(f.path.toUpperCase(), { ...f }));
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      const arr = Array.from(this.items.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (_) {}
  }

  public normalizePath(path: string): string {
    let p = path.replace(/\//g, '\\').trim();
    if (!p.toUpperCase().startsWith('C:')) {
      p = 'C:\\' + p.replace(/^\\+/, '');
    }
    // Remove duplicate slashes
    p = p.replace(/\\+/g, '\\');
    // Remove trailing slash unless root
    if (p.length > 3 && p.endsWith('\\')) {
      p = p.slice(0, -1);
    }
    return p;
  }

  public getItem(path: string): VFSItem | null {
    const norm = this.normalizePath(path).toUpperCase();
    return this.items.get(norm) || null;
  }

  public readFile(path: string): string | null {
    const item = this.getItem(path);
    if (!item || item.isFolder) return null;
    return item.content ?? '';
  }

  public writeFile(path: string, content: string, mimeType = 'text/plain'): boolean {
    const norm = this.normalizePath(path);
    const parts = norm.split('\\');
    const name = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join('\\');

    // Ensure parent folder exists
    if (parentPath.length >= 3 && !this.getItem(parentPath)) {
      this.createFolder(parentPath);
    }

    const existing = this.getItem(norm);
    const now = Date.now();
    const item: VFSItem = {
      id: existing ? existing.id : 'file-' + Math.random().toString(36).substring(2, 9),
      name,
      path: norm,
      isFolder: false,
      content,
      mimeType,
      size: content.length,
      createdAt: existing ? existing.createdAt : now,
      modifiedAt: now,
    };

    this.items.set(norm.toUpperCase(), item);
    this.saveToStorage();
    return true;
  }

  public createFolder(path: string): boolean {
    const norm = this.normalizePath(path);
    if (this.getItem(norm)) return true;

    const parts = norm.split('\\');
    // Recursively ensure parents exist
    if (parts.length > 2) {
      const parent = parts.slice(0, -1).join('\\');
      if (parent.length >= 3 && !this.getItem(parent)) {
        this.createFolder(parent);
      }
    }

    const name = parts[parts.length - 1];
    const now = Date.now();
    const item: VFSItem = {
      id: 'folder-' + Math.random().toString(36).substring(2, 9),
      name,
      path: norm,
      isFolder: true,
      size: 0,
      createdAt: now,
      modifiedAt: now,
    };

    this.items.set(norm.toUpperCase(), item);
    this.saveToStorage();
    return true;
  }

  public deleteItem(path: string): boolean {
    const norm = this.normalizePath(path).toUpperCase();
    if (norm === 'C:' || norm === 'C:\\') return false;

    // Delete item and any children if it's a folder
    let deleted = false;
    for (const [k, v] of this.items.entries()) {
      if (k === norm || k.startsWith(norm + '\\')) {
        this.items.delete(k);
        deleted = true;
      }
    }
    if (deleted) this.saveToStorage();
    return deleted;
  }

  public renameItem(oldPath: string, newName: string): boolean {
    const item = this.getItem(oldPath);
    if (!item) return false;

    const parts = item.path.split('\\');
    parts[parts.length - 1] = newName;
    const newPath = parts.join('\\');

    this.deleteItem(oldPath);
    if (item.isFolder) {
      return this.createFolder(newPath);
    } else {
      return this.writeFile(newPath, item.content || '', item.mimeType);
    }
  }

  public listDirectory(path: string): VFSItem[] {
    const norm = this.normalizePath(path).toUpperCase();
    const results: VFSItem[] = [];

    for (const item of this.items.values()) {
      const itemUpper = item.path.toUpperCase();
      if (itemUpper === norm) continue;

      const parts = item.path.split('\\');
      const itemParent = parts.slice(0, -1).join('\\').toUpperCase();

      if (itemParent === norm || (norm === 'C:' && itemParent === 'C:\\')) {
        results.push(item);
      }
    }

    // Sort folders first, then alphabetical
    return results.sort((a, b) => {
      if (a.isFolder === b.isFolder) {
        return a.name.localeCompare(b.name);
      }
      return a.isFolder ? -1 : 1;
    });
  }

  public searchFiles(query: string): VFSItem[] {
    const q = query.trim().toUpperCase();
    if (!q) return [];
    const results: VFSItem[] = [];
    for (const item of this.items.values()) {
      if (item.name.toUpperCase().includes(q) || (item.content && item.content.toUpperCase().includes(q))) {
        results.push(item);
      }
    }
    return results;
  }

  public exportBackup(): string {
    const arr = Array.from(this.items.values());
    return JSON.stringify({
      version: 1,
      timestamp: Date.now(),
      system: 'Piush 95 VFS',
      files: arr,
    }, null, 2);
  }

  public importBackup(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && Array.isArray(parsed.files)) {
        this.items.clear();
        parsed.files.forEach((f: VFSItem) => {
          this.items.set(f.path.toUpperCase(), f);
        });
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  public resetToDefaults(): void {
    this.items.clear();
    DEFAULT_FILES.forEach((f) => this.items.set(f.path.toUpperCase(), { ...f }));
    this.saveToStorage();
  }

  public getStats(): { totalFiles: number; totalFolders: number; totalBytes: number } {
    let files = 0;
    let folders = 0;
    let bytes = 0;
    for (const item of this.items.values()) {
      if (item.isFolder) {
        folders++;
      } else {
        files++;
        bytes += item.size;
      }
    }
    return { totalFiles: files, totalFolders: folders, totalBytes: bytes };
  }
}

export const vfs = new VirtualFileSystem();

