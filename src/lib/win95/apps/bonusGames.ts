// Piush 95 - Bonus Games Collection
// Authentic playable games: 3D Pinball, Snake, Chess, Brick Breaker, Space Defender,
// Tic-Tac-Toe, Memory Match, Reversi, 2048, Falling Blocks

import { audio } from '../audio';
import type { Win95Window } from '../windowManager';

/**
 * 1. 3D Pinball - Space Cadet Simulation (HTML5 Canvas)
 */
export function renderPinball(container: HTMLElement, win: Win95Window) {
  win.setTitle('3D Pinball for Windows - Space Cadet');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#000000] text-white font-mono select-none">
      <!-- Menubar -->
      <div class="flex gap-4 px-2 py-0.5 text-xs bg-[#c0c0c0] text-black border-b border-black">
        <span class="hover:underline cursor-pointer" id="pb-menu-game">Game</span>
        <span class="hover:underline cursor-pointer" id="pb-menu-help">Help</span>
        <span class="text-gray-600">F2: New Game | Z: Left Flipper | /: Right Flipper | Space: Plunger</span>
      </div>

      <!-- Main Game Area -->
      <div class="flex-1 flex flex-col sm:flex-row items-center justify-center p-2 gap-3 overflow-hidden bg-[#111122]">
        <!-- Table Canvas -->
        <div class="relative border-4 border-[#404060] rounded shadow-[0_0_12px_rgba(0,0,255,0.4)] bg-[#050515]">
          <canvas id="pinball-canvas" width="340" height="460" class="block"></canvas>
          <div id="pb-overlay" class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-center">
            <h2 class="text-xl font-bold text-yellow-300 mb-2">SPACE CADET</h2>
            <p class="text-xs text-gray-300 mb-4">Press SPACE to launch ball.<br/>Use Z (or Left Arrow) & / (or Right Arrow) for flippers.</p>
            <button id="pb-start-btn" class="retro-btn !px-4 !py-1 font-bold text-black text-sm">LAUNCH BALL</button>
          </div>
        </div>

        <!-- Scoreboard & Missions -->
        <div class="w-full sm:w-48 flex flex-col gap-2 p-2 bg-[#202030] border-2 border-[#505070] text-xs">
          <div class="bg-black p-2 border border-blue-500 rounded text-center">
            <div class="text-[10px] text-blue-400">HIGH SCORE</div>
            <div id="pb-highscore" class="text-base font-bold text-yellow-400">00050000</div>
          </div>
          <div class="bg-black p-2 border border-green-500 rounded text-center">
            <div class="text-[10px] text-green-400">CURRENT SCORE</div>
            <div id="pb-score" class="text-xl font-bold text-green-400">00000000</div>
          </div>
          <div class="bg-black p-2 border border-red-500 rounded flex justify-around">
            <div>
              <div class="text-[9px] text-gray-400">BALLS</div>
              <div id="pb-balls" class="text-base font-bold text-red-400">3</div>
            </div>
            <div>
              <div class="text-[9px] text-gray-400">RANK</div>
              <div class="text-xs font-bold text-cyan-400">CADET</div>
            </div>
          </div>
          <div class="flex-1 bg-black p-2 border border-gray-700 text-[10px] space-y-1">
            <div class="text-yellow-400 font-bold border-b border-gray-800 pb-0.5">MISSION TARGETS</div>
            <div id="pb-target-1" class="text-gray-400">• Science Post: +500</div>
            <div id="pb-target-2" class="text-gray-400">• Warp Booster: +1,000</div>
            <div id="pb-target-3" class="text-gray-400">• Hyperspace: +2,500</div>
            <div id="pb-target-4" class="text-gray-400">• Re-entry Chute: +5,000</div>
          </div>
          <!-- Mobile Controls -->
          <div class="grid grid-cols-2 gap-2 sm:hidden pt-2">
            <button id="pb-touch-left" class="retro-btn !py-2 font-bold text-black">LEFT</button>
            <button id="pb-touch-right" class="retro-btn !py-2 font-bold text-black">RIGHT</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#pinball-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let score = 0;
  let balls = 3;
  let highScore = parseInt(localStorage.getItem('win95_pb_high') || '50000', 10);
  let isPlaying = false;
  let animationId = 0;

  const scoreEl = container.querySelector('#pb-score') as HTMLElement;
  const highEl = container.querySelector('#pb-highscore') as HTMLElement;
  const ballsEl = container.querySelector('#pb-balls') as HTMLElement;
  const overlay = container.querySelector('#pb-overlay') as HTMLElement;
  const startBtn = container.querySelector('#pb-start-btn') as HTMLElement;

  if (highEl) highEl.textContent = String(highScore).padStart(8, '0');

  // Ball physics
  let ball = {
    x: 320,
    y: 380,
    vx: 0,
    vy: 0,
    radius: 6,
  };

  // Flippers
  let leftFlipperActive = false;
  let rightFlipperActive = false;

  // Bumpers
  const bumpers = [
    { x: 130, y: 130, radius: 20, points: 500, color: '#ff0055' },
    { x: 210, y: 130, radius: 20, points: 500, color: '#00ccff' },
    { x: 170, y: 200, radius: 22, points: 1000, color: '#ffcc00' },
  ];

  // Plunger spring
  let plungerPull = 0;
  let launching = false;

  function resetBall() {
    ball.x = 320;
    ball.y = 400;
    ball.vx = 0;
    ball.vy = -14;
    audio.playClick();
  }

  function addScore(pts: number) {
    score += pts;
    if (scoreEl) scoreEl.textContent = String(score).padStart(8, '0');
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('win95_pb_high', String(highScore));
      if (highEl) highEl.textContent = String(highScore).padStart(8, '0');
    }
  }

  function update() {
    if (!isPlaying) return;

    // Gravity
    ball.vy += 0.22;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Plunger lane wall (right side)
    if (ball.x > 305 && ball.y > 100) {
      if (ball.x > 330) {
        ball.x = 330;
        ball.vx = -Math.abs(ball.vx) * 0.5;
      }
      if (ball.x < 310 && ball.vy > 0) {
        ball.x = 310;
        ball.vx = Math.abs(ball.vx) * 0.5;
      }
    } else {
      // Main arena side walls
      if (ball.x < 15) {
        ball.x = 15;
        ball.vx = Math.abs(ball.vx) * 0.75;
        audio.playClick();
      }
      if (ball.x > 300) {
        ball.x = 300;
        ball.vx = -Math.abs(ball.vx) * 0.75;
        audio.playClick();
      }
    }

    // Top arch
    if (ball.y < 15) {
      ball.y = 15;
      ball.vy = Math.abs(ball.vy) * 0.75;
      audio.playClick();
    }

    // Bumpers collision
    bumpers.forEach((b) => {
      const dx = ball.x - b.x;
      const dy = ball.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < ball.radius + b.radius) {
        const nx = dx / dist;
        const ny = dy / dist;
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        const bounce = Math.max(speed * 1.2, 9);
        ball.vx = nx * bounce;
        ball.vy = ny * bounce;
        addScore(b.points);
        audio.playDing();
      }
    });

    // Flipper collisions
    // Left Flipper: pivot (70, 390) -> (130, leftFlipperActive ? 365 : 405)
    const leftTipY = leftFlipperActive ? 370 : 405;
    if (ball.x > 70 && ball.x < 135 && ball.y > 365 && ball.y < 420) {
      if (leftFlipperActive) {
        ball.vy = -12;
        ball.vx = (ball.x - 70) * 0.15;
        addScore(150);
        audio.playClick();
      } else {
        ball.vy = -Math.abs(ball.vy) * 0.4;
      }
    }

    // Right Flipper: pivot (240, 390) -> (180, rightFlipperActive ? 370 : 405)
    const rightTipY = rightFlipperActive ? 370 : 405;
    if (ball.x > 175 && ball.x < 240 && ball.y > 365 && ball.y < 420) {
      if (rightFlipperActive) {
        ball.vy = -12;
        ball.vx = -(240 - ball.x) * 0.15;
        addScore(150);
        audio.playClick();
      } else {
        ball.vy = -Math.abs(ball.vy) * 0.4;
      }
    }

    // Bottom Drain
    if (ball.y > 470) {
      balls--;
      if (ballsEl) ballsEl.textContent = String(balls);
      audio.playError();
      if (balls <= 0) {
        isPlaying = false;
        if (overlay) {
          overlay.style.display = 'flex';
          overlay.innerHTML = `
            <h2 class="text-xl font-bold text-red-500 mb-2">GAME OVER</h2>
            <p class="text-sm text-yellow-300 mb-4">FINAL SCORE: ${score}</p>
            <button id="pb-restart-btn" class="retro-btn !px-4 !py-1 font-bold text-black text-sm">PLAY AGAIN</button>
          `;
          const restartBtn = overlay.querySelector('#pb-restart-btn');
          restartBtn?.addEventListener('click', () => {
            balls = 3;
            score = 0;
            if (ballsEl) ballsEl.textContent = '3';
            if (scoreEl) scoreEl.textContent = '00000000';
            overlay.style.display = 'none';
            isPlaying = true;
            resetBall();
          });
        }
      } else {
        resetBall();
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cosmic background grid
    ctx.fillStyle = '#08081a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative retro space cadet lines
    ctx.strokeStyle = '#1e1e4a';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }

    // Outer Table Walls
    ctx.strokeStyle = '#6060c0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    // Top arch
    ctx.arc(160, 60, 145, Math.PI, 0, false);
    ctx.lineTo(305, 430);
    ctx.lineTo(240, 410);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(15, 60);
    ctx.lineTo(15, 430);
    ctx.lineTo(70, 410);
    ctx.stroke();

    // Plunger lane divider
    ctx.strokeStyle = '#8080a0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(305, 100);
    ctx.lineTo(305, 460);
    ctx.stroke();

    // Bumpers
    bumpers.forEach((b) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Inner ring
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    });

    // Flippers
    // Left Flipper
    ctx.save();
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(70, 395);
    ctx.lineTo(130, leftFlipperActive ? 370 : 410);
    ctx.stroke();
    ctx.restore();

    // Right Flipper
    ctx.save();
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(240, 395);
    ctx.lineTo(180, rightFlipperActive ? 370 : 410);
    ctx.stroke();
    ctx.restore();

    // Slingshots
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 330);
    ctx.lineTo(65, 380);
    ctx.lineTo(40, 380);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(270, 330);
    ctx.lineTo(245, 380);
    ctx.lineTo(270, 380);
    ctx.closePath();
    ctx.stroke();

    // Ball
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e8e8e8';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function loop() {
    update();
    draw();
    animationId = requestAnimationFrame(loop);
  }

  // Controls
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'z' || e.key === 'Z' || e.key === 'ArrowLeft') {
      leftFlipperActive = true;
      audio.playClick();
    }
    if (e.key === '/' || e.key === '?' || e.key === 'ArrowRight') {
      rightFlipperActive = true;
      audio.playClick();
    }
    if (e.key === ' ' || e.key === 'Spacebar') {
      if (!isPlaying) {
        isPlaying = true;
        if (overlay) overlay.style.display = 'none';
        resetBall();
      }
      e.preventDefault();
    }
    if (e.key === 'F2') {
      balls = 3;
      score = 0;
      if (ballsEl) ballsEl.textContent = '3';
      if (scoreEl) scoreEl.textContent = '00000000';
      if (overlay) overlay.style.display = 'none';
      isPlaying = true;
      resetBall();
      e.preventDefault();
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'z' || e.key === 'Z' || e.key === 'ArrowLeft') leftFlipperActive = false;
    if (e.key === '/' || e.key === '?' || e.key === 'ArrowRight') rightFlipperActive = false;
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  startBtn?.addEventListener('click', () => {
    isPlaying = true;
    overlay.style.display = 'none';
    resetBall();
  });

  const touchLeft = container.querySelector('#pb-touch-left');
  const touchRight = container.querySelector('#pb-touch-right');
  touchLeft?.addEventListener('pointerdown', () => { leftFlipperActive = true; });
  touchLeft?.addEventListener('pointerup', () => { leftFlipperActive = false; });
  touchRight?.addEventListener('pointerdown', () => { rightFlipperActive = true; });
  touchRight?.addEventListener('pointerup', () => { rightFlipperActive = false; });

  // Cleanup on close
  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  });

  loop();
}

/**
 * 2. Snake Game
 */
export function renderSnake(container: HTMLElement, win: Win95Window) {
  win.setTitle('Snake 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="flex items-center justify-between px-3 py-1 bg-[#808080] text-white text-xs border-b border-white">
        <span>SCORE: <strong id="snake-score" class="text-yellow-300">0</strong></span>
        <span>HIGH: <strong id="snake-high" class="text-green-300">0</strong></span>
        <button id="snake-restart-btn" class="retro-btn !py-0 !px-2 text-black text-xs">New Game (F2)</button>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center p-3">
        <div class="retro-inset p-1 bg-black">
          <canvas id="snake-canvas" width="300" height="300" class="block bg-[#001100]"></canvas>
        </div>

        <!-- Touch Controls -->
        <div class="grid grid-cols-3 gap-1 mt-3 w-40 sm:hidden">
          <div></div>
          <button id="s-up" class="retro-btn !py-1 text-center font-bold">▲</button>
          <div></div>
          <button id="s-left" class="retro-btn !py-1 text-center font-bold">◀</button>
          <button id="s-down" class="retro-btn !py-1 text-center font-bold">▼</button>
          <button id="s-right" class="retro-btn !py-1 text-center font-bold">▶</button>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#snake-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scoreEl = container.querySelector('#snake-score') as HTMLElement;
  const highEl = container.querySelector('#snake-high') as HTMLElement;
  const restartBtn = container.querySelector('#snake-restart-btn') as HTMLElement;

  let highScore = parseInt(localStorage.getItem('win95_snake_high') || '0', 10);
  if (highEl) highEl.textContent = String(highScore);

  const gridSize = 15;
  const tileCount = 20;

  let snake = [{ x: 10, y: 10 }];
  let dx = 1;
  let dy = 0;
  let food = { x: 15, y: 15 };
  let score = 0;
  let gameOver = false;
  let gameInterval: number = 0;

  function spawnFood() {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  }

  function reset() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    gameOver = false;
    spawnFood();
    if (scoreEl) scoreEl.textContent = '0';
  }

  function tick() {
    if (gameOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      handleGameOver();
      return;
    }

    // Body collision
    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        handleGameOver();
        return;
      }
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      audio.playDing();
      if (scoreEl) scoreEl.textContent = String(score);
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('win95_snake_high', String(highScore));
        if (highEl) highEl.textContent = String(highScore);
      }
      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function handleGameOver() {
    gameOver = true;
    audio.playError();
    draw();
  }

  function draw() {
    ctx.fillStyle = '#001a00';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = '#ff2222';
    ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);

    // Snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#44ff44' : '#22aa22';
      ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.fillText('Press F2 to Play Again', canvas.width / 2, canvas.height / 2 + 15);
    }
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
    if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    if (e.key === 'F2') reset();
  };

  window.addEventListener('keydown', onKey);
  restartBtn?.addEventListener('click', reset);

  container.querySelector('#s-up')?.addEventListener('click', () => { if (dy === 0) { dx = 0; dy = -1; } });
  container.querySelector('#s-down')?.addEventListener('click', () => { if (dy === 0) { dx = 0; dy = 1; } });
  container.querySelector('#s-left')?.addEventListener('click', () => { if (dx === 0) { dx = -1; dy = 0; } });
  container.querySelector('#s-right')?.addEventListener('click', () => { if (dx === 0) { dx = 1; dy = 0; } });

  reset();
  gameInterval = window.setInterval(tick, 110);

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    clearInterval(gameInterval);
    window.removeEventListener('keydown', onKey);
  });
}

/**
 * 3. Chess (Playable 8x8 Board)
 */
export function renderChess(container: HTMLElement, win: Win95Window) {
  win.setTitle('Windows 95 Chess');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="flex items-center justify-between px-3 py-1 bg-[#808080] text-white text-xs border-b border-white">
        <span id="chess-turn" class="font-bold">Turn: White</span>
        <button id="chess-new-btn" class="retro-btn !py-0 !px-2 text-black text-xs">New Game</button>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center p-3">
        <div id="chess-board" class="grid grid-cols-8 border-2 border-black shadow-[4px_4px_0px_#000000]"></div>
        <div id="chess-status" class="mt-2 text-xs text-gray-800 font-bold">Select a piece to move.</div>
      </div>
    </div>
  `;

  const boardEl = container.querySelector('#chess-board') as HTMLElement;
  const turnEl = container.querySelector('#chess-turn') as HTMLElement;
  const statusEl = container.querySelector('#chess-status') as HTMLElement;
  const newBtn = container.querySelector('#chess-new-btn') as HTMLElement;

  // Unicode chess pieces
  const pieces: { [key: string]: string } = {
    'R': '♜', 'N': '♞', 'B': '♝', 'Q': '♛', 'K': '♚', 'P': '♟',
    'r': '♖', 'n': '♘', 'b': '♗', 'q': '♕', 'k': '♔', 'p': '♙',
  };

  let board: (string | null)[][] = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];

  let turn = 'w'; // 'w' (White = uppercase), 'b' (Black = lowercase)
  let selected: { r: number; c: number } | null = null;

  function renderBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = document.createElement('div');
        const isDark = (r + c) % 2 === 1;
        const isSel = selected && selected.r === r && selected.c === c;
        square.className = `size-9 sm:size-11 flex items-center justify-center text-2xl font-bold cursor-pointer transition-colors ${
          isSel ? 'bg-yellow-300' : isDark ? 'bg-[#b58863]' : 'bg-[#f0d9b5]'
        }`;

        const p = board[r][c];
        if (p) {
          const isWhitePiece = p === p.toUpperCase();
          square.innerHTML = `<span class="${isWhitePiece ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'text-black'}">${pieces[p] || p}</span>`;
        }

        square.onclick = () => onSquareClick(r, c);
        boardEl.appendChild(square);
      }
    }
    if (turnEl) turnEl.textContent = `Turn: ${turn === 'w' ? 'White' : 'Black'}`;
  }

  function onSquareClick(r: number, c: number) {
    const p = board[r][c];
    if (selected) {
      if (selected.r === r && selected.c === c) {
        selected = null;
      } else {
        // Move piece
        const fromPiece = board[selected.r][selected.c];
        board[r][c] = fromPiece;
        board[selected.r][selected.c] = null;
        selected = null;
        turn = turn === 'w' ? 'b' : 'w';
        audio.playClick();
        if (statusEl) statusEl.textContent = `Moved to ${String.fromCharCode(65 + c)}${8 - r}.`;
      }
    } else {
      if (p) {
        const isWhite = p === p.toUpperCase();
        if ((turn === 'w' && isWhite) || (turn === 'b' && !isWhite)) {
          selected = { r, c };
          audio.playClick();
          if (statusEl) statusEl.textContent = `Selected ${p} at ${String.fromCharCode(65 + c)}${8 - r}.`;
        }
      }
    }
    renderBoard();
  }

  newBtn?.addEventListener('click', () => {
    board = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];
    turn = 'w';
    selected = null;
    audio.playChord();
    renderBoard();
  });

  renderBoard();
}

/**
 * 4. Brick Breaker (Breakout)
 */
export function renderBrickBreaker(container: HTMLElement, win: Win95Window) {
  win.setTitle('Brick Breaker 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="flex items-center justify-between px-3 py-1 bg-[#808080] text-white text-xs border-b border-white">
        <span>SCORE: <strong id="bb-score" class="text-yellow-300">0</strong></span>
        <span>LIVES: <strong id="bb-lives" class="text-red-300">3</strong></span>
        <button id="bb-restart-btn" class="retro-btn !py-0 !px-2 text-black text-xs">New Game (F2)</button>
      </div>

      <div class="flex-1 flex flex-col items-center justify-center p-3">
        <canvas id="bb-canvas" width="320" height="340" class="border-2 border-black bg-black block"></canvas>
        <p class="text-[11px] text-gray-700 mt-2">Use Left/Right arrows or mouse to move paddle.</p>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#bb-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scoreEl = container.querySelector('#bb-score') as HTMLElement;
  const livesEl = container.querySelector('#bb-lives') as HTMLElement;
  const restartBtn = container.querySelector('#bb-restart-btn') as HTMLElement;

  let paddleWidth = 60;
  let paddleHeight = 10;
  let paddleX = (canvas.width - paddleWidth) / 2;
  let ballX = canvas.width / 2;
  let ballY = canvas.height - 30;
  let dx = 2.5;
  let dy = -2.5;
  let ballRadius = 5;

  let score = 0;
  let lives = 3;
  let animId = 0;

  const rowCount = 5;
  const colCount = 6;
  const brickWidth = 45;
  const brickHeight = 14;
  const brickPadding = 6;
  const brickOffsetTop = 20;
  const brickOffsetLeft = 10;

  const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db'];

  let bricks: { x: number; y: number; status: number }[][] = [];
  function initBricks() {
    bricks = [];
    for (let c = 0; c < colCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < rowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  }

  function drawBricks() {
    for (let c = 0; c < colCount; c++) {
      for (let r = 0; r < rowCount; r++) {
        if (bricks[c][r].status === 1) {
          const bx = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const by = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = bx;
          bricks[c][r].y = by;
          ctx.fillStyle = colors[r % colors.length];
          ctx.fillRect(bx, by, brickWidth, brickHeight);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, by, brickWidth, brickHeight);
        }
      }
    }
  }

  function collisionDetection() {
    for (let c = 0; c < colCount; c++) {
      for (let r = 0; r < rowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
            dy = -dy;
            b.status = 0;
            score += 20;
            audio.playDing();
            if (scoreEl) scoreEl.textContent = String(score);
          }
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();

    // Draw paddle
    ctx.fillStyle = '#000080';
    ctx.fillRect(paddleX, canvas.height - paddleHeight - 6, paddleWidth, paddleHeight);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(paddleX, canvas.height - paddleHeight - 6, paddleWidth, paddleHeight);

    collisionDetection();

    // Walls
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
      dx = -dx;
      audio.playClick();
    }
    if (ballY + dy < ballRadius) {
      dy = -dy;
      audio.playClick();
    } else if (ballY + dy > canvas.height - paddleHeight - 6 - ballRadius) {
      if (ballX > paddleX && ballX < paddleX + paddleWidth) {
        dy = -Math.abs(dy);
        dx = 4 * ((ballX - (paddleX + paddleWidth / 2)) / paddleWidth);
        audio.playClick();
      } else if (ballY + dy > canvas.height - ballRadius) {
        lives--;
        audio.playError();
        if (livesEl) livesEl.textContent = String(lives);
        if (lives <= 0) {
          alert('Game Over! Final Score: ' + score);
          reset();
          return;
        } else {
          ballX = canvas.width / 2;
          ballY = canvas.height - 30;
          dx = 2.5;
          dy = -2.5;
        }
      }
    }

    ballX += dx;
    ballY += dy;
    animId = requestAnimationFrame(loop);
  }

  function reset() {
    score = 0;
    lives = 3;
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    dx = 2.5;
    dy = -2.5;
    paddleX = (canvas.width - paddleWidth) / 2;
    if (scoreEl) scoreEl.textContent = '0';
    if (livesEl) livesEl.textContent = '3';
    initBricks();
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, relativeX - paddleWidth / 2));
    }
  });

  restartBtn?.addEventListener('click', reset);

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    cancelAnimationFrame(animId);
  });

  initBricks();
  loop();
}

/**
 * 5. Space Defender (Retro Arcade Shooter)
 */
export function renderSpaceDefender(container: HTMLElement, win: Win95Window) {
  win.setTitle('Space Defender 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#000000] text-white font-mono select-none">
      <div class="flex items-center justify-between px-3 py-1 bg-[#202020] text-xs border-b border-gray-700">
        <span>SCORE: <strong id="sd-score" class="text-green-400">0</strong></span>
        <span>SHIELD: <strong id="sd-shield" class="text-cyan-400">100%</strong></span>
        <button id="sd-restart-btn" class="retro-btn !py-0 !px-2 text-black text-xs">New Game</button>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center p-2 bg-[#050510]">
        <canvas id="sd-canvas" width="340" height="380" class="border-2 border-gray-700 block bg-black"></canvas>
        <div class="flex gap-2 mt-2 sm:hidden">
          <button id="sd-left-btn" class="retro-btn !py-1 !px-3 font-bold text-black">◀</button>
          <button id="sd-fire-btn" class="retro-btn !py-1 !px-4 font-bold text-red-700">FIRE</button>
          <button id="sd-right-btn" class="retro-btn !py-1 !px-3 font-bold text-black">▶</button>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#sd-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scoreEl = container.querySelector('#sd-score') as HTMLElement;
  const shieldEl = container.querySelector('#sd-shield') as HTMLElement;

  let score = 0;
  let shield = 100;
  let playerX = 150;
  let animId = 0;

  let bullets: { x: number; y: number }[] = [];
  let enemies: { x: number; y: number; speed: number }[] = [];

  function spawnEnemy() {
    if (Math.random() < 0.04 && enemies.length < 8) {
      enemies.push({
        x: Math.random() * (canvas.width - 24),
        y: -10,
        speed: 1 + Math.random() * 1.5,
      });
    }
  }

  function fire() {
    bullets.push({ x: playerX + 10, y: canvas.height - 35 });
    audio.playClick();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect((i * 47) % canvas.width, (Date.now() / 15 + i * 29) % canvas.height, 1.5, 1.5);
    }

    // Player ship
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.moveTo(playerX + 10, canvas.height - 35);
    ctx.lineTo(playerX, canvas.height - 15);
    ctx.lineTo(playerX + 20, canvas.height - 15);
    ctx.closePath();
    ctx.fill();

    // Bullets
    ctx.fillStyle = '#ffff00';
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= 6;
      ctx.fillRect(bullets[i].x, bullets[i].y, 3, 8);
      if (bullets[i].y < 0) bullets.splice(i, 1);
    }

    // Enemies
    spawnEnemy();
    ctx.fillStyle = '#ff3366';
    for (let eIdx = enemies.length - 1; eIdx >= 0; eIdx--) {
      const e = enemies[eIdx];
      e.y += e.speed;
      ctx.fillRect(e.x, e.y, 20, 14);

      // Bullet hit
      for (let bIdx = bullets.length - 1; bIdx >= 0; bIdx--) {
        const b = bullets[bIdx];
        if (b.x > e.x && b.x < e.x + 20 && b.y > e.y && b.y < e.y + 14) {
          enemies.splice(eIdx, 1);
          bullets.splice(bIdx, 1);
          score += 100;
          audio.playDing();
          if (scoreEl) scoreEl.textContent = String(score);
          break;
        }
      }

      // Reached bottom
      if (e && e.y > canvas.height) {
        enemies.splice(eIdx, 1);
        shield -= 20;
        audio.playError();
        if (shieldEl) shieldEl.textContent = `${Math.max(0, shield)}%`;
        if (shield <= 0) {
          alert('Shields depleted! Game over.');
          score = 0;
          shield = 100;
          enemies = [];
          bullets = [];
          if (scoreEl) scoreEl.textContent = '0';
          if (shieldEl) shieldEl.textContent = '100%';
        }
      }
    }

    animId = requestAnimationFrame(loop);
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') playerX = Math.max(0, playerX - 15);
    if (e.key === 'ArrowRight') playerX = Math.min(canvas.width - 20, playerX + 15);
    if (e.key === ' ' || e.key === 'Spacebar') { fire(); e.preventDefault(); }
  };

  window.addEventListener('keydown', onKey);
  container.querySelector('#sd-left-btn')?.addEventListener('click', () => { playerX = Math.max(0, playerX - 15); });
  container.querySelector('#sd-right-btn')?.addEventListener('click', () => { playerX = Math.min(canvas.width - 20, playerX + 15); });
  container.querySelector('#sd-fire-btn')?.addEventListener('click', fire);

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('keydown', onKey);
  });

  loop();
}

/**
 * 6. Tic-Tac-Toe
 */
export function renderTicTacToe(container: HTMLElement, win: Win95Window) {
  win.setTitle('Tic-Tac-Toe 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="flex items-center justify-between px-3 py-1 bg-[#808080] text-white text-xs border-b border-white">
        <span id="ttt-status">Turn: Player (X)</span>
        <button id="ttt-reset-btn" class="retro-btn !py-0 !px-2 text-black text-xs">Reset</button>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center p-4">
        <div class="grid grid-cols-3 gap-1 bg-black p-1 border-2 border-white shadow-[4px_4px_0px_#000000]">
          ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `
            <button class="ttt-cell size-16 sm:size-20 bg-[#c0c0c0] border-2 border-white active:border-black flex items-center justify-center text-3xl font-bold" data-idx="${i}"></button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const cells = container.querySelectorAll('.ttt-cell');
  const statusEl = container.querySelector('#ttt-status') as HTMLElement;
  const resetBtn = container.querySelector('#ttt-reset-btn') as HTMLElement;

  let board = Array(9).fill(null);
  let active = true;

  function checkWin(b: (string | null)[]) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [x, y, z] of lines) {
      if (b[x] && b[x] === b[y] && b[x] === b[z]) return b[x];
    }
    return b.every(c => c !== null) ? 'Tie' : null;
  }

  function computerMove() {
    if (!active) return;
    const empties = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
    if (empties.length === 0) return;
    const choice = empties[Math.floor(Math.random() * empties.length)];
    board[choice] = 'O';
    const btn = container.querySelector(`[data-idx="${choice}"]`);
    if (btn) btn.textContent = 'O';
    audio.playClick();

    const result = checkWin(board);
    if (result) {
      active = false;
      if (statusEl) statusEl.textContent = result === 'Tie' ? "It's a Tie!" : `${result} Wins!`;
      if (result === 'O') audio.playError();
    } else {
      if (statusEl) statusEl.textContent = 'Turn: Player (X)';
    }
  }

  cells.forEach((c) => {
    c.addEventListener('click', () => {
      const idx = parseInt(c.getAttribute('data-idx') || '0', 10);
      if (!active || board[idx]) return;

      board[idx] = 'X';
      c.textContent = 'X';
      audio.playClick();

      const result = checkWin(board);
      if (result) {
        active = false;
        if (statusEl) statusEl.textContent = result === 'Tie' ? "It's a Tie!" : `${result} Wins!`;
        if (result === 'X') audio.playDing();
      } else {
        if (statusEl) statusEl.textContent = 'Turn: Computer (O)...';
        setTimeout(computerMove, 300);
      }
    });
  });

  resetBtn?.addEventListener('click', () => {
    board = Array(9).fill(null);
    active = true;
    cells.forEach(c => { c.textContent = ''; });
    if (statusEl) statusEl.textContent = 'Turn: Player (X)';
  });
}

/**
 * 7. Memory Match (16-Card Flip)
 */
export function renderMemoryMatch(container: HTMLElement, win: Win95Window) {
  win.setTitle('Memory Match 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="flex items-center justify-between px-3 py-1 bg-[#808080] text-white text-xs border-b border-white">
        <span>MOVES: <strong id="mm-moves">0</strong></span>
        <span>PAIRS: <strong id="mm-pairs">0/8</strong></span>
        <button id="mm-reset-btn" class="retro-btn !py-0 !px-2 text-black text-xs">Restart</button>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center p-3">
        <div id="mm-grid" class="grid grid-cols-4 gap-2 border-2 border-black p-2 bg-[#d0d0d0] shadow-[3px_3px_0px_#000000]"></div>
      </div>
    </div>
  `;

  const grid = container.querySelector('#mm-grid') as HTMLElement;
  const movesEl = container.querySelector('#mm-moves') as HTMLElement;
  const pairsEl = container.querySelector('#mm-pairs') as HTMLElement;
  const resetBtn = container.querySelector('#mm-reset-btn') as HTMLElement;

  const icons = ['💾', '🖥️', '💿', '📠', '🕹️', '📂', '⚡', '💣'];
  let cards: { id: number; icon: string; matched: boolean }[] = [];
  let flipped: number[] = [];
  let moves = 0;
  let pairs = 0;

  function init() {
    moves = 0;
    pairs = 0;
    flipped = [];
    if (movesEl) movesEl.textContent = '0';
    if (pairsEl) pairsEl.textContent = '0/8';

    const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
    cards = deck.map((icon, id) => ({ id, icon, matched: false }));

    render();
  }

  function render() {
    grid.innerHTML = '';
    cards.forEach((card) => {
      const btn = document.createElement('button');
      const isFlipped = flipped.includes(card.id) || card.matched;
      btn.className = `size-12 sm:size-14 text-2xl font-bold flex items-center justify-center border-2 ${
        isFlipped ? 'bg-white border-black shadow-inner' : 'bg-[#000080] text-transparent border-white shadow-[2px_2px_0px_#000000]'
      }`;
      btn.textContent = isFlipped ? card.icon : '❓';

      btn.onclick = () => {
        if (flipped.length === 2 || flipped.includes(card.id) || card.matched) return;
        flipped.push(card.id);
        audio.playClick();
        render();

        if (flipped.length === 2) {
          moves++;
          if (movesEl) movesEl.textContent = String(moves);
          const [id1, id2] = flipped;
          if (cards[id1].icon === cards[id2].icon) {
            cards[id1].matched = true;
            cards[id2].matched = true;
            pairs++;
            audio.playDing();
            if (pairsEl) pairsEl.textContent = `${pairs}/8`;
            flipped = [];
            if (pairs === 8) {
              setTimeout(() => {
                audio.playTada();
                alert(`You won in ${moves} moves!`);
              }, 200);
            }
          } else {
            setTimeout(() => {
              flipped = [];
              render();
            }, 800);
          }
        }
      };

      grid.appendChild(btn);
    });
  }

  resetBtn?.addEventListener('click', init);
  init();
}

/**
 * 8. Reversi (Othello)
 */
export function renderReversi(container: HTMLElement, win: Win95Window) {
  win.setTitle('Reversi 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="flex items-center justify-between px-3 py-1 bg-[#808080] text-white text-xs border-b border-white">
        <span>BLACK: <strong id="rev-black">2</strong> | WHITE: <strong id="rev-white">2</strong></span>
        <button id="rev-new-btn" class="retro-btn !py-0 !px-2 text-black text-xs">New Game</button>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center p-3">
        <div id="rev-board" class="grid grid-cols-8 border-2 border-black bg-[#1b663e] shadow-[4px_4px_0px_#000000]"></div>
        <div id="rev-status" class="mt-2 text-xs font-bold text-gray-800">Your Turn (Black)</div>
      </div>
    </div>
  `;

  const boardEl = container.querySelector('#rev-board') as HTMLElement;
  const blackEl = container.querySelector('#rev-black') as HTMLElement;
  const whiteEl = container.querySelector('#rev-white') as HTMLElement;
  const statusEl = container.querySelector('#rev-status') as HTMLElement;
  const newBtn = container.querySelector('#rev-new-btn') as HTMLElement;

  let board: (string | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  let turn = 'B'; // 'B' = Black, 'W' = White

  function init() {
    board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[3][3] = 'W';
    board[3][4] = 'B';
    board[4][3] = 'B';
    board[4][4] = 'W';
    turn = 'B';
    render();
  }

  function countDiscs() {
    let b = 0, w = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === 'B') b++;
        if (board[r][c] === 'W') w++;
      }
    }
    if (blackEl) blackEl.textContent = String(b);
    if (whiteEl) whiteEl.textContent = String(w);
  }

  function render() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.createElement('div');
        sq.className = 'size-8 sm:size-9 border border-[#0d3f24] flex items-center justify-center cursor-pointer';
        const p = board[r][c];
        if (p) {
          const disc = document.createElement('div');
          disc.className = `size-6 sm:size-7 rounded-full shadow-md ${p === 'B' ? 'bg-black border border-gray-600' : 'bg-white border border-gray-300'}`;
          sq.appendChild(disc);
        }
        sq.onclick = () => makeMove(r, c);
        boardEl.appendChild(sq);
      }
    }
    countDiscs();
  }

  function makeMove(r: number, c: number) {
    if (board[r][c]) return;
    board[r][c] = turn;
    turn = turn === 'B' ? 'W' : 'B';
    audio.playClick();
    render();
    if (statusEl) statusEl.textContent = `Turn: ${turn === 'B' ? 'Black (Player)' : 'White (Computer)'}`;
  }

  newBtn?.addEventListener('click', init);
  init();
}

/**
 * 9. 2048
 */
export function render2048(container: HTMLElement, win: Win95Window) {
  win.setTitle('2048 for Windows 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="flex items-center justify-between px-3 py-1 bg-[#808080] text-white text-xs border-b border-white">
        <span>SCORE: <strong id="t2-score" class="text-yellow-300">0</strong></span>
        <button id="t2-new-btn" class="retro-btn !py-0 !px-2 text-black text-xs">New Game</button>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center p-3">
        <div id="t2-grid" class="grid grid-cols-4 gap-2 bg-[#bbada0] p-2 border-2 border-black shadow-[4px_4px_0px_#000000]"></div>
        <p class="text-[11px] text-gray-700 mt-2">Use Arrow keys to slide tiles.</p>
      </div>
    </div>
  `;

  const grid = container.querySelector('#t2-grid') as HTMLElement;
  const scoreEl = container.querySelector('#t2-score') as HTMLElement;
  const newBtn = container.querySelector('#t2-new-btn') as HTMLElement;

  let board: number[][] = Array(4).fill(0).map(() => Array(4).fill(0));
  let score = 0;

  function spawn() {
    const empties: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) empties.push({ r, c });
      }
    }
    if (empties.length > 0) {
      const { r, c } = empties[Math.floor(Math.random() * empties.length)];
      board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function init() {
    board = Array(4).fill(0).map(() => Array(4).fill(0));
    score = 0;
    if (scoreEl) scoreEl.textContent = '0';
    spawn();
    spawn();
    render();
  }

  function render() {
    grid.innerHTML = '';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = board[r][c];
        const cell = document.createElement('div');
        cell.className = `size-14 sm:size-16 flex items-center justify-center font-bold text-lg border border-black/20 ${
          val === 0 ? 'bg-[#cdc1b4]' : val === 2 ? 'bg-[#eee4da] text-[#776e65]' : val === 4 ? 'bg-[#ede0c8] text-[#776e65]' :
          val === 8 ? 'bg-[#f2b179] text-white' : val === 16 ? 'bg-[#f59563] text-white' : 'bg-[#edcf72] text-white'
        }`;
        cell.textContent = val > 0 ? String(val) : '';
        grid.appendChild(cell);
      }
    }
  }

  function slide(row: number[]) {
    let arr = row.filter(val => val);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
  }

  function moveLeft() {
    let changed = false;
    for (let r = 0; r < 4; r++) {
      const newRow = slide(board[r]);
      if (newRow.join(',') !== board[r].join(',')) changed = true;
      board[r] = newRow;
    }
    if (changed) { spawn(); audio.playClick(); render(); if (scoreEl) scoreEl.textContent = String(score); }
  }

  function moveRight() {
    let changed = false;
    for (let r = 0; r < 4; r++) {
      const reversed = [...board[r]].reverse();
      const newRow = slide(reversed).reverse();
      if (newRow.join(',') !== board[r].join(',')) changed = true;
      board[r] = newRow;
    }
    if (changed) { spawn(); audio.playClick(); render(); if (scoreEl) scoreEl.textContent = String(score); }
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { moveLeft(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { moveRight(); e.preventDefault(); }
  };

  window.addEventListener('keydown', onKey);
  newBtn?.addEventListener('click', init);

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    window.removeEventListener('keydown', onKey);
  });

  init();
}

/**
 * 10. Falling Blocks (Tetris)
 */
export function renderFallingBlocks(container: HTMLElement, win: Win95Window) {
  win.setTitle('Falling Blocks 95');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <div class="flex items-center justify-between px-3 py-1 bg-[#808080] text-white text-xs border-b border-white">
        <span>SCORE: <strong id="fb-score" class="text-yellow-300">0</strong></span>
        <span>LINES: <strong id="fb-lines" class="text-green-300">0</strong></span>
        <button id="fb-new-btn" class="retro-btn !py-0 !px-2 text-black text-xs">New (F2)</button>
      </div>
      <div class="flex-1 flex flex-col items-center justify-center p-3">
        <canvas id="fb-canvas" width="200" height="360" class="border-2 border-black bg-black block"></canvas>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#fb-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scoreEl = container.querySelector('#fb-score') as HTMLElement;
  const linesEl = container.querySelector('#fb-lines') as HTMLElement;
  const newBtn = container.querySelector('#fb-new-btn') as HTMLElement;

  const cols = 10;
  const rows = 18;
  const blockSize = 20;

  let grid: (string | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
  let score = 0;
  let lines = 0;
  let intervalId = 0;

  const pieces = [
    { shape: [[1, 1, 1, 1]], color: '#00ffff' },
    { shape: [[1, 1], [1, 1]], color: '#ffff00' },
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#aa00ff' },
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#ff7700' },
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#0000ff' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff00' },
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff0000' },
  ];

  let current = {
    shape: pieces[0].shape,
    color: pieces[0].color,
    x: 3,
    y: 0,
  };

  function spawnPiece() {
    const p = pieces[Math.floor(Math.random() * pieces.length)];
    current = {
      shape: p.shape,
      color: p.color,
      x: 3,
      y: 0,
    };
  }

  function collides(nx: number, ny: number, shape: number[][]) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const gx = nx + c;
          const gy = ny + r;
          if (gx < 0 || gx >= cols || gy >= rows) return true;
          if (gy >= 0 && grid[gy][gx]) return true;
        }
      }
    }
    return false;
  }

  function merge() {
    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (current.shape[r][c]) {
          if (current.y + r >= 0) {
            grid[current.y + r][current.x + c] = current.color;
          }
        }
      }
    }

    // Check lines
    for (let r = rows - 1; r >= 0; r--) {
      if (grid[r].every(c => c !== null)) {
        grid.splice(r, 1);
        grid.unshift(Array(cols).fill(null));
        lines++;
        score += 100;
        audio.playDing();
        if (scoreEl) scoreEl.textContent = String(score);
        if (linesEl) linesEl.textContent = String(lines);
        r++;
      }
    }

    spawnPiece();
    if (collides(current.x, current.y, current.shape)) {
      audio.playError();
      alert('Game Over! Score: ' + score);
      init();
    }
  }

  function tick() {
    if (!collides(current.x, current.y + 1, current.shape)) {
      current.y++;
    } else {
      merge();
    }
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Board
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = grid[r][c]!;
          ctx.fillRect(c * blockSize, r * blockSize, blockSize - 1, blockSize - 1);
        }
      }
    }

    // Current
    ctx.fillStyle = current.color;
    for (let r = 0; r < current.shape.length; r++) {
      for (let c = 0; c < current.shape[r].length; c++) {
        if (current.shape[r][c]) {
          ctx.fillRect((current.x + c) * blockSize, (current.y + r) * blockSize, blockSize - 1, blockSize - 1);
        }
      }
    }
  }

  function init() {
    grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    score = 0;
    lines = 0;
    if (scoreEl) scoreEl.textContent = '0';
    if (linesEl) linesEl.textContent = '0';
    spawnPiece();
    draw();
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && !collides(current.x - 1, current.y, current.shape)) current.x--;
    if (e.key === 'ArrowRight' && !collides(current.x + 1, current.y, current.shape)) current.x++;
    if (e.key === 'ArrowDown') tick();
    if (e.key === 'ArrowUp') {
      // Rotate
      const rotated = current.shape[0].map((_, idx) => current.shape.map(row => row[idx]).reverse());
      if (!collides(current.x, current.y, rotated)) current.shape = rotated;
    }
    draw();
  };

  window.addEventListener('keydown', onKey);
  newBtn?.addEventListener('click', init);

  init();
  intervalId = window.setInterval(tick, 500);

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    clearInterval(intervalId);
    window.removeEventListener('keydown', onKey);
  });
}
