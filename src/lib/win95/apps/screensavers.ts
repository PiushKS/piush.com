// Piush 95 - Authentic Screen Savers Engine
// Starfield, 3D Pipes, Flying Windows, Mystify, Matrix

export type ScreenSaverType = 'starfield' | 'pipes' | 'windows' | 'mystify' | 'matrix';

export class ScreenSaverEngine {
  private active = false;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animId = 0;
  private overlay: HTMLElement | null = null;

  public start(type: ScreenSaverType = 'starfield') {
    if (this.active) return;
    this.active = true;

    // Create full screen overlay
    const overlay = document.createElement('div');
    overlay.className = 'win95-screensaver-overlay fixed inset-0 z-[99999] bg-black cursor-none select-none';
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.className = 'block w-full h-full';
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);

    this.overlay = overlay;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Dismiss listeners
    const dismiss = () => this.stop();
    window.addEventListener('mousemove', dismiss, { once: true });
    window.addEventListener('keydown', dismiss, { once: true });
    window.addEventListener('click', dismiss, { once: true });
    window.addEventListener('touchstart', dismiss, { once: true });

    if (type === 'starfield') this.runStarfield();
    else if (type === 'pipes') this.runPipes();
    else if (type === 'windows') this.runFlyingWindows();
    else if (type === 'mystify') this.runMystify();
    else if (type === 'matrix') this.runMatrix();
  }

  public stop() {
    if (!this.active) return;
    this.active = false;
    cancelAnimationFrame(this.animId);
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlay = null;
    this.canvas = null;
    this.ctx = null;
  }

  /**
   * 1. Starfield Simulation
   */
  private runStarfield() {
    const { canvas, ctx } = this;
    if (!canvas || !ctx) return;

    const stars: { x: number; y: number; z: number }[] = [];
    const count = 400;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * canvas.width,
      });
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const loop = () => {
      if (!this.active) return;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      for (const s of stars) {
        s.z -= 4;
        if (s.z <= 0) {
          s.z = canvas.width;
          s.x = (Math.random() - 0.5) * canvas.width * 2;
          s.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        const k = 128 / s.z;
        const px = s.x * k + cx;
        const py = s.y * k + cy;
        const size = Math.max(1, (1 - s.z / canvas.width) * 3);

        if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  /**
   * 2. 3D Pipes Simulation
   */
  private runPipes() {
    const { canvas, ctx } = this;
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = ['#00ffcc', '#ff0055', '#ffcc00', '#0099ff', '#33cc33', '#cc33ff'];
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let dir = Math.floor(Math.random() * 4); // 0: up, 1: right, 2: down, 3: left
    let color = colors[0];
    let step = 0;

    const loop = () => {
      if (!this.active) return;

      if (step % 20 === 0) {
        // Change direction or color
        dir = (dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
        if (Math.random() < 0.3) {
          color = colors[Math.floor(Math.random() * colors.length)];
        }
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);

      const len = 12;
      if (dir === 0) y -= len;
      else if (dir === 1) x += len;
      else if (dir === 2) y += len;
      else if (dir === 3) x -= len;

      ctx.lineTo(x, y);
      ctx.stroke();

      // Wrap around
      if (x < 0) x = canvas.width;
      if (x > canvas.width) x = 0;
      if (y < 0) y = canvas.height;
      if (y > canvas.height) y = 0;

      step++;
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  /**
   * 3. Flying Windows
   */
  private runFlyingWindows() {
    const { canvas, ctx } = this;
    if (!canvas || !ctx) return;

    const logos: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < 40; i++) {
      logos.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * canvas.width,
      });
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const loop = () => {
      if (!this.active) return;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const item of logos) {
        item.z -= 3;
        if (item.z <= 0) {
          item.z = canvas.width;
          item.x = (Math.random() - 0.5) * canvas.width * 2;
          item.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        const k = 140 / item.z;
        const px = item.x * k + cx;
        const py = item.y * k + cy;
        const s = Math.max(4, (1 - item.z / canvas.width) * 32);

        if (px >= -s && px < canvas.width + s && py >= -s && py < canvas.height + s) {
          const half = s / 2;
          // Windows 4-color flag
          ctx.fillStyle = '#e74c3c'; ctx.fillRect(px, py, half - 1, half - 1);
          ctx.fillStyle = '#2ecc71'; ctx.fillRect(px + half, py, half - 1, half - 1);
          ctx.fillStyle = '#3498db'; ctx.fillRect(px, py + half, half - 1, half - 1);
          ctx.fillStyle = '#f1c40f'; ctx.fillRect(px + half, py + half, half - 1, half - 1);
        }
      }

      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  /**
   * 4. Mystify
   */
  private runMystify() {
    const { canvas, ctx } = this;
    if (!canvas || !ctx) return;

    let pts = [
      { x: 100, y: 100, vx: 3, vy: 4 },
      { x: 300, y: 150, vx: -4, vy: 3 },
      { x: 400, y: 350, vx: 2, vy: -3 },
      { x: 200, y: 400, vx: -3, vy: -2 },
    ];

    const loop = () => {
      if (!this.active) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= canvas.width) p.vx = -p.vx;
        if (p.y <= 0 || p.y >= canvas.height) p.vy = -p.vy;
      }

      ctx.strokeStyle = `hsl(${(Date.now() / 25) % 360}, 100%, 60%)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  /**
   * 5. Matrix Digital Rain
   */
  private runMatrix() {
    const { canvas, ctx } = this;
    if (!canvas || !ctx) return;

    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*';

    const loop = () => {
      if (!this.active) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff44';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }
}

export const screensavers = new ScreenSaverEngine();
