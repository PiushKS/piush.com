// Piush 95 Classic Games
// Minesweeper, Solitaire (Klondike), FreeCell, Hearts
// Full authentic implementations with 100% playable mechanics

import { audio } from '../audio';
import type { Win95Window } from '../windowManager';

/* ==========================================================================
   1. MINESWEEPER
   ========================================================================== */
export function renderMinesweeper(container: HTMLElement, win: Win95Window) {
  win.setTitle('Minesweeper');

  type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom';
  let difficulty: Difficulty = 'beginner';

  let rows = 9;
  let cols = 9;
  let totalMines = 10;
  let minesRemaining = totalMines;
  let seconds = 0;
  let timerId: number | null = null;
  let isGameOver = false;
  let isGameWon = false;
  let isFirstClick = true;
  let touchFlagMode = false;
  let marksEnabled = true;

  type Cell = {
    r: number;
    c: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    isQuestion: boolean;
    neighborMines: number;
  };

  let grid: Cell[][] = [];
  let cellButtons: HTMLButtonElement[][] = [];

  const NUMBER_COLORS: Record<number, string> = {
    1: '#0000ff', // Blue
    2: '#008000', // Green
    3: '#ff0000', // Red
    4: '#000080', // Dark Blue
    5: '#800000', // Maroon / Dark Red
    6: '#008080', // Teal
    7: '#000000', // Black
    8: '#808080', // Gray
  };

  type BestScores = Record<'beginner' | 'intermediate' | 'expert', { time: number; name: string }>;
  const DEFAULT_SCORES: BestScores = {
    beginner: { time: 99, name: 'Anonymous' },
    intermediate: { time: 999, name: 'Anonymous' },
    expert: { time: 999, name: 'Anonymous' },
  };

  const getBestScores = (): BestScores => {
    try {
      const saved = localStorage.getItem('win95_minesweeper_scores');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return { ...DEFAULT_SCORES };
  };

  const saveBestScores = (scores: BestScores) => {
    try {
      localStorage.setItem('win95_minesweeper_scores', JSON.stringify(scores));
    } catch (_) {}
  };

  const formatLCD = (val: number): string => {
    if (val < 0) {
      return '-' + String(Math.abs(val)).padStart(2, '0');
    }
    return String(Math.min(999, Math.max(0, val))).padStart(3, '0');
  };

  const updateMineCountLCD = () => {
    const countEl = container.querySelector('#mine-count');
    if (countEl) countEl.textContent = formatLCD(minesRemaining);
  };

  const updateTimerLCD = () => {
    const timerEl = container.querySelector('#mine-timer');
    if (timerEl) timerEl.textContent = formatLCD(seconds);
  };

  const setSmiley = (face: 'normal' | 'worried' | 'lost' | 'won') => {
    const sm = container.querySelector('#mine-smiley');
    if (!sm) return;
    const map = {
      normal: '🙂',
      worried: '😮',
      lost: '😵',
      won: '😎',
    };
    sm.textContent = map[face];
  };

  const adjustWindowSize = (c: number, r: number) => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 640;
    if (isMobile) return;

    const targetW = Math.max(270, c * 24 + 48);
    const targetH = Math.max(380, r * 24 + 180);

    if (win.element) {
      win.element.style.width = `${Math.min(window.innerWidth - 40, targetW)}px`;
      win.element.style.height = `${Math.min(window.innerHeight - 80, targetH)}px`;
    }
  };

  const startTimer = () => {
    if (timerId !== null) clearInterval(timerId);
    seconds = 0;
    updateTimerLCD();
    timerId = window.setInterval(() => {
      seconds = Math.min(999, seconds + 1);
      updateTimerLCD();
      audio.playTick();
    }, 1000);
  };

  const stopTimer = () => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const updateCellDOM = (r: number, c: number, pressed = false) => {
    const cell = grid[r][c];
    const btn = cellButtons[r]?.[c];
    if (!btn) return;

    if (cell.isRevealed) {
      btn.className = 'size-6 text-xs font-black flex items-center justify-center select-none bg-[#bdbdbd] border border-[#808080] p-0';
      if (cell.isMine) {
        btn.textContent = '💣';
      } else if (cell.neighborMines > 0) {
        btn.textContent = String(cell.neighborMines);
        btn.style.color = NUMBER_COLORS[cell.neighborMines] || '#000';
      } else {
        btn.textContent = '';
      }
    } else {
      if (pressed) {
        btn.className = 'size-6 text-xs font-black flex items-center justify-center select-none bg-[#bdbdbd] border border-[#808080] p-0';
      } else {
        btn.className = 'size-6 text-xs font-black flex items-center justify-center select-none bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#7b7b7b] active:border-[#808080] p-0';
      }

      if (cell.isFlagged) {
        btn.textContent = '🚩';
        btn.style.color = '#ff0000';
      } else if (cell.isQuestion) {
        btn.textContent = '?';
        btn.style.color = '#000080';
      } else {
        btn.textContent = '';
      }
    }
  };

  const initGame = () => {
    stopTimer();
    isGameOver = false;
    isGameWon = false;
    isFirstClick = true;
    minesRemaining = totalMines;
    seconds = 0;

    grid = [];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          isQuestion: false,
          neighborMines: 0,
        });
      }
      grid.push(row);
    }

    setSmiley('normal');
    updateMineCountLCD();
    updateTimerLCD();
    buildBoardDOM();
    adjustWindowSize(cols, rows);
  };

  const placeMines = (safeR: number, safeC: number) => {
    let placed = 0;
    while (placed < totalMines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      // Guarantee safe cell AND 3x3 surrounding zone has 0 mines on first click
      if ((Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) || grid[r][c].isMine) continue;
      grid[r][c].isMine = true;
      placed++;
    }

    // Compute neighbor counts
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isMine) {
              count++;
            }
          }
        }
        grid[r][c].neighborMines = count;
      }
    }
  };

  const revealCell = (r: number, c: number) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || isGameOver || isGameWon) return;
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    if (isFirstClick) {
      isFirstClick = false;
      placeMines(r, c);
      startTimer();
    }

    cell.isRevealed = true;

    if (cell.isMine) {
      isGameOver = true;
      stopTimer();
      audio.playExplosion();
      setSmiley('lost');

      // Reveal all mines and mark false flags
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < cols; cc++) {
          const item = grid[rr][cc];
          const btn = cellButtons[rr]?.[cc];
          if (!btn) continue;

          if (rr === r && cc === c) {
            // Detonated mine: bright red background
            btn.className = 'size-6 text-xs font-black flex items-center justify-center select-none bg-red-600 text-black border border-[#808080] p-0';
            btn.textContent = '💣';
          } else if (item.isMine && !item.isFlagged) {
            // Unflagged mine: show on gray
            btn.className = 'size-6 text-xs font-black flex items-center justify-center select-none bg-[#bdbdbd] border border-[#808080] p-0';
            btn.textContent = '💣';
          } else if (!item.isMine && item.isFlagged) {
            // False flag: crossed out
            btn.className = 'size-6 text-xs font-black flex items-center justify-center select-none bg-[#bdbdbd] border border-[#808080] p-0 text-red-600 font-bold';
            btn.textContent = '❌';
          }
        }
      }
      return;
    }

    audio.playClick();
    updateCellDOM(r, c);

    if (cell.neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            revealCell(r + dr, c + dc);
          }
        }
      }
    }

    checkWin();
  };

  const toggleFlag = (r: number, c: number) => {
    if (isGameOver || isGameWon) return;
    const cell = grid[r][c];
    if (cell.isRevealed) return;

    audio.playClick();
    if (!cell.isFlagged && !cell.isQuestion) {
      cell.isFlagged = true;
      minesRemaining--;
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      if (marksEnabled) {
        cell.isQuestion = true;
      }
      minesRemaining++;
    } else {
      cell.isQuestion = false;
    }

    updateMineCountLCD();
    updateCellDOM(r, c);
  };

  const chordCell = (r: number, c: number) => {
    const cell = grid[r][c];
    if (!cell.isRevealed || cell.neighborMines === 0 || isGameOver || isGameWon) return;

    let flagCount = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isFlagged) {
          flagCount++;
        }
      }
    }

    if (flagCount === cell.neighborMines) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc].isFlagged) {
            revealCell(nr, nc);
          }
        }
      }
    }
  };

  const checkWin = () => {
    let unrevealedNonMines = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!grid[r][c].isMine && !grid[r][c].isRevealed) {
          unrevealedNonMines++;
        }
      }
    }

    if (unrevealedNonMines === 0 && !isGameOver && !isGameWon) {
      isGameOver = true;
      isGameWon = true;
      stopTimer();
      setSmiley('won');
      audio.playTada();

      // Flag all remaining mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c].isMine && !grid[r][c].isFlagged) {
            grid[r][c].isFlagged = true;
            updateCellDOM(r, c);
          }
        }
      }
      minesRemaining = 0;
      updateMineCountLCD();

      if (difficulty !== 'custom') {
        const scores = getBestScores();
        const currentBest = scores[difficulty].time;
        if (seconds < currentBest) {
          showHighScorePrompt(difficulty, seconds);
        }
      }
    }
  };

  const showHighScorePrompt = (diff: 'beginner' | 'intermediate' | 'expert', time: number) => {
    const modal = document.createElement('div');
    modal.className = 'absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="retro-window p-1 w-72 bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000]">
        <div class="retro-titlebar px-2 py-0.5 text-xs text-white font-bold flex justify-between items-center mb-2">
          <span>Fastest Mine Sweepers</span>
        </div>
        <div class="p-3 text-xs font-mono space-y-2 text-black">
          <p class="font-bold text-[#002266]">You have the fastest time for ${diff} level!</p>
          <p>Please enter your name:</p>
          <input type="text" id="ms-player-name" class="w-full retro-inset px-2 py-1 bg-white text-black text-xs font-bold outline-none border border-[#808080]" value="Anonymous" maxlength="20" />
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" id="ms-save-score-btn" class="retro-btn !px-4 !py-1 font-bold">OK</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(modal);

    const input = modal.querySelector('#ms-player-name') as HTMLInputElement;
    input?.select();

    const saveAndClose = () => {
      const name = input?.value.trim() || 'Anonymous';
      const scores = getBestScores();
      scores[diff] = { time, name };
      saveBestScores(scores);
      modal.remove();
      showBestScoresDialog();
    };

    modal.querySelector('#ms-save-score-btn')?.addEventListener('click', saveAndClose);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveAndClose();
    });
  };

  const showBestScoresDialog = () => {
    const scores = getBestScores();
    const modal = document.createElement('div');
    modal.className = 'absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="retro-window p-1 w-80 bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000]">
        <div class="retro-titlebar px-2 py-0.5 text-xs text-white font-bold flex justify-between items-center mb-2">
          <span>Fastest Mine Sweepers</span>
          <button type="button" class="retro-titlebar-btn !w-4 !h-4 text-[10px]" id="ms-scores-close">✕</button>
        </div>
        <div class="p-3 text-xs font-mono space-y-3 text-black">
          <div class="space-y-1.5 border border-[#808080] p-2 bg-[#d4d0c8]">
            <div class="flex justify-between items-center">
              <span class="font-bold">Beginner:</span>
              <span>${scores.beginner.time} seconds</span>
              <span class="font-bold truncate max-w-[90px]">${scores.beginner.name}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-bold">Intermediate:</span>
              <span>${scores.intermediate.time} seconds</span>
              <span class="font-bold truncate max-w-[90px]">${scores.intermediate.name}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-bold">Expert:</span>
              <span>${scores.expert.time} seconds</span>
              <span class="font-bold truncate max-w-[90px]">${scores.expert.name}</span>
            </div>
          </div>
          <div class="flex justify-between items-center pt-1">
            <button type="button" id="ms-reset-scores-btn" class="retro-btn !px-3 !py-1 text-[11px]">Reset Scores</button>
            <button type="button" id="ms-ok-scores-btn" class="retro-btn !px-5 !py-1 font-bold">OK</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(modal);

    modal.querySelector('#ms-scores-close')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#ms-ok-scores-btn')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#ms-reset-scores-btn')?.addEventListener('click', () => {
      saveBestScores(DEFAULT_SCORES);
      modal.remove();
      showBestScoresDialog();
    });
  };

  const showCustomDialog = () => {
    const modal = document.createElement('div');
    modal.className = 'absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="retro-window p-1 w-72 bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000]">
        <div class="retro-titlebar px-2 py-0.5 text-xs text-white font-bold flex justify-between items-center mb-2">
          <span>Custom Field</span>
          <button type="button" class="retro-titlebar-btn !w-4 !h-4 text-[10px]" id="ms-custom-close">✕</button>
        </div>
        <div class="p-3 text-xs font-mono space-y-2.5 text-black">
          <div class="flex justify-between items-center">
            <label for="ms-cust-h">Height (9-24):</label>
            <input type="number" id="ms-cust-h" class="w-16 retro-inset px-1 py-0.5 text-center font-bold bg-white text-black" value="${rows}" min="9" max="24" />
          </div>
          <div class="flex justify-between items-center">
            <label for="ms-cust-w">Width (9-30):</label>
            <input type="number" id="ms-cust-w" class="w-16 retro-inset px-1 py-0.5 text-center font-bold bg-white text-black" value="${cols}" min="9" max="30" />
          </div>
          <div class="flex justify-between items-center">
            <label for="ms-cust-m">Mines (10-668):</label>
            <input type="number" id="ms-cust-m" class="w-16 retro-inset px-1 py-0.5 text-center font-bold bg-white text-black" value="${totalMines}" min="10" max="668" />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" id="ms-cust-ok" class="retro-btn !px-4 !py-1 font-bold">OK</button>
            <button type="button" id="ms-cust-cancel" class="retro-btn !px-3 !py-1">Cancel</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(modal);

    modal.querySelector('#ms-custom-close')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#ms-cust-cancel')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#ms-cust-ok')?.addEventListener('click', () => {
      const hInput = modal.querySelector('#ms-cust-h') as HTMLInputElement;
      const wInput = modal.querySelector('#ms-cust-w') as HTMLInputElement;
      const mInput = modal.querySelector('#ms-cust-m') as HTMLInputElement;

      const newH = Math.max(9, Math.min(24, parseInt(hInput.value) || 9));
      const newW = Math.max(9, Math.min(30, parseInt(wInput.value) || 9));
      const maxMines = Math.floor((newH - 1) * (newW - 1));
      const newM = Math.max(10, Math.min(maxMines, parseInt(mInput.value) || 10));

      rows = newH;
      cols = newW;
      totalMines = newM;
      difficulty = 'custom';
      modal.remove();
      renderUI();
      initGame();
    });
  };

  const showHelpDialog = () => {
    const modal = document.createElement('div');
    modal.className = 'absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="retro-window p-1 w-80 bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000]">
        <div class="retro-titlebar px-2 py-0.5 text-xs text-white font-bold flex justify-between items-center mb-2">
          <span>How to Play Minesweeper</span>
          <button type="button" class="retro-titlebar-btn !w-4 !h-4 text-[10px]" id="ms-help-close">✕</button>
        </div>
        <div class="p-3 text-xs font-mono space-y-2 text-black leading-relaxed">
          <p class="font-bold text-[#002266]">Game Rules:</p>
          <ul class="list-disc pl-4 space-y-1 text-[11px]">
            <li><strong>Dig:</strong> Left-click to reveal a covered square.</li>
            <li><strong>Flag:</strong> Right-click (or use Flag Mode / Long-press on mobile) to mark suspected mines.</li>
            <li><strong>Numbers:</strong> Tell how many mines are adjacent in the 8 neighboring squares.</li>
            <li><strong>Chording:</strong> Click an uncovered number when surrounding flags equal its value to uncover the rest!</li>
            <li><strong>Smiley:</strong> Click the smiley button anytime to restart.</li>
          </ul>
          <div class="flex justify-end pt-2">
            <button type="button" id="ms-help-ok" class="retro-btn !px-5 !py-1 font-bold">OK</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(modal);

    modal.querySelector('#ms-help-close')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#ms-help-ok')?.addEventListener('click', () => modal.remove());
  };

  const buildBoardDOM = () => {
    const boardEl = container.querySelector('#mine-grid-container');
    if (!boardEl) return;

    boardEl.innerHTML = '';
    cellButtons = [];

    const table = document.createElement('div');
    table.className = 'grid border-t-[3px] border-l-[3px] border-[#808080] border-b-[3px] border-r-[3px] border-white inline-block select-none bg-[#c0c0c0]';
    table.style.gridTemplateColumns = `repeat(${cols}, 24px)`;

    for (let r = 0; r < rows; r++) {
      const rowBtns: HTMLButtonElement[] = [];
      for (let c = 0; c < cols; c++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'size-6 text-xs font-black flex items-center justify-center select-none bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#7b7b7b] active:border-[#808080] p-0';
        btn.dataset.r = String(r);
        btn.dataset.c = String(c);

        let touchTimeout: number | null = null;
        let didLongPress = false;

        // Mouse Down: change smiley to worried face and show pressed cell
        btn.addEventListener('mousedown', (e) => {
          if (isGameOver || isGameWon) return;
          if (e.button === 0) {
            setSmiley('worried');
            const cell = grid[r][c];
            if (!cell.isRevealed && !cell.isFlagged) {
              btn.className = 'size-6 text-xs font-black flex items-center justify-center select-none bg-[#bdbdbd] border border-[#808080] p-0';
            } else if (cell.isRevealed && cell.neighborMines > 0) {
              // Highlight neighbors for chording
              for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                  const nr = r + dr;
                  const nc = c + dc;
                  if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    const nCell = grid[nr][nc];
                    if (!nCell.isRevealed && !nCell.isFlagged) {
                      const nBtn = cellButtons[nr]?.[nc];
                      if (nBtn) nBtn.className = 'size-6 text-xs font-black flex items-center justify-center select-none bg-[#bdbdbd] border border-[#808080] p-0';
                    }
                  }
                }
              }
            }
          }
        });

        // Mouse Up / Leave: restore normal smiley and revert unpressed cells
        const revertPressed = () => {
          if (!isGameOver && !isGameWon) setSmiley('normal');
          const cell = grid[r][c];
          if (!cell.isRevealed) updateCellDOM(r, c);
          if (cell.isRevealed && cell.neighborMines > 0) {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                  const nCell = grid[nr][nc];
                  if (!nCell.isRevealed) updateCellDOM(nr, nc);
                }
              }
            }
          }
        };

        btn.addEventListener('mouseup', revertPressed);
        btn.addEventListener('mouseleave', revertPressed);

        // Click handler
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (didLongPress) {
            didLongPress = false;
            return;
          }

          if (touchFlagMode) {
            toggleFlag(r, c);
            return;
          }

          const cell = grid[r][c];
          if (cell.isRevealed) {
            chordCell(r, c);
          } else {
            revealCell(r, c);
          }
        });

        // Context Menu (Right Click)
        btn.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          toggleFlag(r, c);
        });

        // Mobile Touch Events (Long Press for Flag)
        btn.addEventListener('touchstart', () => {
          didLongPress = false;
          touchTimeout = window.setTimeout(() => {
            didLongPress = true;
            toggleFlag(r, c);
            if (navigator.vibrate) navigator.vibrate(30);
          }, 260);
        }, { passive: true });

        btn.addEventListener('touchend', () => {
          if (touchTimeout) clearTimeout(touchTimeout);
        });

        btn.addEventListener('touchcancel', () => {
          if (touchTimeout) clearTimeout(touchTimeout);
        });

        rowBtns.push(btn);
        table.appendChild(btn);
      }
      cellButtons.push(rowBtns);
    }
    boardEl.appendChild(table);
  };

  const renderUI = () => {
    container.innerHTML = `
      <div class="flex flex-col h-full bg-[#c0c0c0] select-none font-mono text-black">
        <!-- Windows 95 Menu Bar -->
        <div class="flex items-center gap-1 px-1.5 py-0.5 border-b border-[#808080] bg-[#c0c0c0] text-xs relative">
          <!-- Game Menu -->
          <div class="relative group" id="ms-menu-game-parent">
            <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="ms-menu-game-btn">
              <span class="underline">G</span>ame
            </button>
            <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[170px] z-50 text-black text-xs" id="ms-game-dropdown">
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ms-menu-new">
                <span>New</span>
                <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">F2</span>
              </button>
              <div class="border-b border-[#808080] border-t border-white my-1"></div>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ms-menu-beginner">
                <span>Beginner</span>
                <span>${difficulty === 'beginner' ? '✓' : ''}</span>
              </button>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ms-menu-intermediate">
                <span>Intermediate</span>
                <span>${difficulty === 'intermediate' ? '✓' : ''}</span>
              </button>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ms-menu-expert">
                <span>Expert</span>
                <span>${difficulty === 'expert' ? '✓' : ''}</span>
              </button>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ms-menu-custom">
                <span>Custom...</span>
                <span>${difficulty === 'custom' ? '✓' : ''}</span>
              </button>
              <div class="border-b border-[#808080] border-t border-white my-1"></div>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="ms-menu-marks">
                <span>Marks (?)</span>
                <span>${marksEnabled ? '✓' : ''}</span>
              </button>
              <div class="border-b border-[#808080] border-t border-white my-1"></div>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ms-menu-best">
                <span>Best Times...</span>
              </button>
              <div class="border-b border-[#808080] border-t border-white my-1"></div>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ms-menu-exit">
                <span>Exit</span>
              </button>
            </div>
          </div>

          <!-- Help Menu -->
          <div class="relative group" id="ms-menu-help-parent">
            <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="ms-menu-help-btn">
              <span class="underline">H</span>elp
            </button>
            <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[150px] z-50 text-black text-xs" id="ms-help-dropdown">
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ms-menu-how">
                <span>How to Play</span>
              </button>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="ms-menu-about">
                <span>About Minesweeper</span>
              </button>
            </div>
          </div>

          <!-- Mobile Flag Mode Pill -->
          <div class="ml-auto sm:hidden">
            <button type="button" class="retro-btn !py-0 !px-2 font-bold text-[11px]" id="m-toggle-mode">
              Mode: ${touchFlagMode ? '🚩 Flag' : '⛏️ Dig'}
            </button>
          </div>
        </div>

        <!-- Main Content Area with 3D Border -->
        <div class="flex-1 flex flex-col items-center justify-start p-3 overflow-auto">
          <!-- Sunken Outer Frame Container -->
          <div class="border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] p-1.5 bg-[#c0c0c0] inline-block">
            <!-- Header Tray (Mine Count, Smiley, Timer) -->
            <div class="flex items-center justify-between bg-[#c0c0c0] border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white px-2 py-1 mb-2">
              <!-- Mine Counter LCD -->
              <div class="bg-black text-[#ff0000] font-black text-xl px-1.5 py-0.5 border border-[#808080] tracking-widest font-mono leading-none" id="mine-count">
                ${formatLCD(minesRemaining)}
              </div>

              <!-- Smiley Button -->
              <button
                type="button"
                id="mine-smiley"
                class="size-8 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#7b7b7b] active:border-t-2 active:border-l-2 active:border-[#7b7b7b] active:border-b-2 active:border-r-2 active:border-white text-lg flex items-center justify-center select-none cursor-pointer"
                title="Reset Game"
              >
                🙂
              </button>

              <!-- Timer LCD -->
              <div class="bg-black text-[#ff0000] font-black text-xl px-1.5 py-0.5 border border-[#808080] tracking-widest font-mono leading-none" id="mine-timer">
                ${formatLCD(seconds)}
              </div>
            </div>

            <!-- Board Grid Frame -->
            <div id="mine-grid-container" class="overflow-auto max-w-full"></div>
          </div>

          <!-- Difficulty Quick Switcher (Desktop) -->
          <div class="hidden sm:flex items-center gap-1 mt-2 text-xs">
            <button type="button" class="retro-btn !py-0.5 !px-2 ${difficulty === 'beginner' ? 'font-bold is-active' : ''}" id="m-diff-easy">Beginner</button>
            <button type="button" class="retro-btn !py-0.5 !px-2 ${difficulty === 'intermediate' ? 'font-bold is-active' : ''}" id="m-diff-med">Intermediate</button>
            <button type="button" class="retro-btn !py-0.5 !px-2 ${difficulty === 'expert' ? 'font-bold is-active' : ''}" id="m-diff-hard">Expert</button>
            <button type="button" class="retro-btn !py-0.5 !px-2 font-bold" id="m-desk-toggle-mode">
              Mode: ${touchFlagMode ? '🚩 Flag' : '⛏️ Dig'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Dropdown toggles
    const gameBtn = container.querySelector('#ms-menu-game-btn');
    const gameDropdown = container.querySelector('#ms-game-dropdown');
    const helpBtn = container.querySelector('#ms-menu-help-btn');
    const helpDropdown = container.querySelector('#ms-help-dropdown');

    const closeMenus = () => {
      gameDropdown?.classList.add('hidden');
      helpDropdown?.classList.add('hidden');
    };

    gameBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      helpDropdown?.classList.add('hidden');
      gameDropdown?.classList.toggle('hidden');
    });

    helpBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      gameDropdown?.classList.add('hidden');
      helpDropdown?.classList.toggle('hidden');
    });

    container.addEventListener('click', closeMenus);

    // Menu Actions
    container.querySelector('#ms-menu-new')?.addEventListener('click', () => {
      closeMenus();
      initGame();
    });

    container.querySelector('#ms-menu-beginner')?.addEventListener('click', () => {
      closeMenus();
      difficulty = 'beginner';
      rows = 9; cols = 9; totalMines = 10;
      renderUI();
      initGame();
    });

    container.querySelector('#ms-menu-intermediate')?.addEventListener('click', () => {
      closeMenus();
      difficulty = 'intermediate';
      rows = 16; cols = 16; totalMines = 40;
      renderUI();
      initGame();
    });

    container.querySelector('#ms-menu-expert')?.addEventListener('click', () => {
      closeMenus();
      difficulty = 'expert';
      rows = 16; cols = 30; totalMines = 99;
      renderUI();
      initGame();
    });

    container.querySelector('#ms-menu-custom')?.addEventListener('click', () => {
      closeMenus();
      showCustomDialog();
    });

    container.querySelector('#ms-menu-marks')?.addEventListener('click', () => {
      closeMenus();
      marksEnabled = !marksEnabled;
      renderUI();
      buildBoardDOM();
    });

    container.querySelector('#ms-menu-best')?.addEventListener('click', () => {
      closeMenus();
      showBestScoresDialog();
    });

    container.querySelector('#ms-menu-exit')?.addEventListener('click', () => {
      closeMenus();
      win.close();
    });

    container.querySelector('#ms-menu-how')?.addEventListener('click', () => {
      closeMenus();
      showHelpDialog();
    });

    container.querySelector('#ms-menu-about')?.addEventListener('click', () => {
      closeMenus();
      showHelpDialog();
    });

    // Quick Buttons
    container.querySelector('#m-diff-easy')?.addEventListener('click', () => {
      difficulty = 'beginner';
      rows = 9; cols = 9; totalMines = 10;
      renderUI();
      initGame();
    });

    container.querySelector('#m-diff-med')?.addEventListener('click', () => {
      difficulty = 'intermediate';
      rows = 16; cols = 16; totalMines = 40;
      renderUI();
      initGame();
    });

    container.querySelector('#m-diff-hard')?.addEventListener('click', () => {
      difficulty = 'expert';
      rows = 16; cols = 30; totalMines = 99;
      renderUI();
      initGame();
    });

    const toggleModeHandler = () => {
      touchFlagMode = !touchFlagMode;
      const b1 = container.querySelector('#m-toggle-mode');
      const b2 = container.querySelector('#m-desk-toggle-mode');
      const label = `Mode: ${touchFlagMode ? '🚩 Flag' : '⛏️ Dig'}`;
      if (b1) b1.textContent = label;
      if (b2) b2.textContent = label;
      audio.playClick();
    };

    container.querySelector('#m-toggle-mode')?.addEventListener('click', toggleModeHandler);
    container.querySelector('#m-desk-toggle-mode')?.addEventListener('click', toggleModeHandler);

    // Smiley Click
    container.querySelector('#mine-smiley')?.addEventListener('click', () => {
      audio.playClick();
      initGame();
    });

    buildBoardDOM();
  };

  // Keyboard F2 Shortcut for New Game
  const keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'F2') {
      e.preventDefault();
      initGame();
    }
  };
  window.addEventListener('keydown', keyHandler);

  renderUI();
  initGame();

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    stopTimer();
    window.removeEventListener('keydown', keyHandler);
  });
}

/* ==========================================================================
   2. SOLITAIRE (KLONDIKE) - 100% Fully Playable Interactive Version
   ========================================================================== */
export function renderSolitaire(container: HTMLElement, win: Win95Window) {
  win.setTitle('Solitaire');

  type Card = {
    suit: '♠' | '♥' | '♦' | '♣';
    value: number; // 1 (Ace) to 13 (King)
    isRed: boolean;
    faceUp: boolean;
  };

  const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];

  let deck: Card[] = [];
  let stock: Card[] = [];
  let waste: Card[] = [];
  let foundations: Card[][] = [[], [], [], []];
  let tableau: Card[][] = [[], [], [], [], [], [], []];
  let score = 0;

  // Selection state for moving cards between waste/tableau/foundations
  let selection: {
    source: 'waste' | 'tableau' | 'foundation';
    col?: number;
    cardIndex: number;
    cards: Card[];
  } | null = null;

  const createDeck = (): Card[] => {
    const cards: Card[] = [];
    for (const suit of SUITS) {
      const isRed = suit === '♥' || suit === '♦';
      for (let value = 1; value <= 13; value++) {
        cards.push({ suit, value, isRed, faceUp: false });
      }
    }
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  };

  const initGame = () => {
    deck = createDeck();
    stock = [];
    waste = [];
    foundations = [[], [], [], []];
    tableau = [[], [], [], [], [], [], []];
    selection = null;
    score = 0;

    for (let col = 0; col < 7; col++) {
      for (let i = 0; i <= col; i++) {
        const card = deck.pop()!;
        if (i === col) card.faceUp = true;
        tableau[col].push(card);
      }
    }

    stock = deck;
    renderUI();
  };

  const getCardLabel = (value: number) => {
    if (value === 1) return 'A';
    if (value === 11) return 'J';
    if (value === 12) return 'Q';
    if (value === 13) return 'K';
    return String(value);
  };

  const drawCard = () => {
    audio.playClick();
    selection = null;
    if (stock.length > 0) {
      const card = stock.pop()!;
      card.faceUp = true;
      waste.push(card);
    } else {
      while (waste.length > 0) {
        const c = waste.pop()!;
        c.faceUp = false;
        stock.push(c);
      }
    }
    renderUI();
  };

  // Double click auto-move to foundation
  const tryAutoFoundation = (card: Card, colIndex?: number): boolean => {
    for (let fIdx = 0; fIdx < 4; fIdx++) {
      const fPile = foundations[fIdx];
      if (fPile.length === 0) {
        if (card.value === 1) {
          fPile.push(card);
          score += 10;
          audio.playClick();
          return true;
        }
      } else {
        const top = fPile[fPile.length - 1];
        if (top.suit === card.suit && top.value + 1 === card.value) {
          fPile.push(card);
          score += 10;
          audio.playClick();
          return true;
        }
      }
    }
    return false;
  };

  // Move selected cards to tableau column
  const tryMoveToTableau = (targetCol: number): boolean => {
    if (!selection) return false;
    const movingLead = selection.cards[0];
    const destCol = tableau[targetCol];

    let canMove = false;
    if (destCol.length === 0) {
      // Empty column accepts King only
      if (movingLead.value === 13) canMove = true;
    } else {
      const top = destCol[destCol.length - 1];
      if (top.faceUp && top.isRed !== movingLead.isRed && top.value === movingLead.value + 1) {
        canMove = true;
      }
    }

    if (!canMove) return false;

    // Execute move
    if (selection.source === 'waste') {
      waste.pop();
      score += 5;
    } else if (selection.source === 'tableau' && selection.col !== undefined) {
      const srcCol = tableau[selection.col];
      srcCol.splice(selection.cardIndex, selection.cards.length);
      if (srcCol.length > 0 && !srcCol[srcCol.length - 1].faceUp) {
        srcCol[srcCol.length - 1].faceUp = true;
        score += 5;
      }
    } else if (selection.source === 'foundation' && selection.col !== undefined) {
      foundations[selection.col].pop();
      score = Math.max(0, score - 15);
    }

    destCol.push(...selection.cards);
    selection = null;
    audio.playClick();
    checkWin();
    renderUI();
    return true;
  };

  // Move selected card to foundation
  const tryMoveToFoundation = (fIdx: number): boolean => {
    if (!selection || selection.cards.length !== 1) return false;
    const card = selection.cards[0];
    const fPile = foundations[fIdx];

    let canMove = false;
    if (fPile.length === 0) {
      if (card.value === 1) canMove = true;
    } else {
      const top = fPile[fPile.length - 1];
      if (top.suit === card.suit && top.value + 1 === card.value) {
        canMove = true;
      }
    }

    if (!canMove) return false;

    if (selection.source === 'waste') {
      waste.pop();
    } else if (selection.source === 'tableau' && selection.col !== undefined) {
      const srcCol = tableau[selection.col];
      srcCol.pop();
      if (srcCol.length > 0 && !srcCol[srcCol.length - 1].faceUp) {
        srcCol[srcCol.length - 1].faceUp = true;
      }
    }

    fPile.push(card);
    score += 10;
    selection = null;
    audio.playClick();
    checkWin();
    renderUI();
    return true;
  };

  const checkWin = () => {
    const totalFoundations = foundations.reduce((sum, p) => sum + p.length, 0);
    if (totalFoundations === 52) {
      audio.playTada();
      alert(`🎉 Victory! Solitaire Solved! Final Score: ${score}`);
    }
  };

  const renderUI = () => {
    container.innerHTML = `
      <div class="flex flex-col h-full bg-[#008000] p-3 select-none font-mono text-xs overflow-auto">
        <!-- Toolbar -->
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-white/40 text-white font-bold">
          <div class="flex gap-2 items-center">
            <button type="button" class="retro-btn !py-0.5 !px-3 font-bold text-black" id="sol-new">New Game</button>
            <span class="text-sm">Score: ${score}</span>
          </div>
          <span class="text-[11px] text-white/90">Click to Select/Move • Double-Click to Foundation</span>
        </div>

        <!-- Top Row: Stock, Waste, and 4 Foundations -->
        <div class="flex justify-between mb-4">
          <!-- Stock and Waste -->
          <div class="flex gap-3">
            <div
              id="sol-stock"
              class="w-12 sm:w-14 h-16 sm:h-20 rounded border-2 border-white bg-[#000080] flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000000]"
              title="Draw Card"
            >
              ${stock.length > 0 ? '<div class="w-10 h-14 bg-[#1084d0] border border-white"></div>' : '<span class="text-white text-xl">↺</span>'}
            </div>

            <div
              id="sol-waste"
              class="w-12 sm:w-14 h-16 sm:h-20 rounded border-2 border-dashed border-white/50 flex items-center justify-center"
            >
              ${waste.length > 0 ? renderCardHtml(waste[waste.length - 1], 'waste', waste.length - 1) : ''}
            </div>
          </div>

          <!-- 4 Foundations -->
          <div class="flex gap-2">
            ${foundations.map((fPile, idx) => `
              <div
                class="w-12 sm:w-14 h-16 sm:h-20 rounded border-2 border-white/80 bg-white/10 flex items-center justify-center sol-foundation cursor-pointer"
                data-fidx="${idx}"
              >
                ${
                  fPile.length > 0
                    ? renderCardHtml(fPile[fPile.length - 1], 'foundation', fPile.length - 1, idx)
                    : `<span class="text-white/60 text-xl font-bold">${SUITS[idx]}</span>`
                }
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tableau (7 Cascades) -->
        <div class="grid grid-cols-7 gap-1.5 sm:gap-2 flex-1 items-start">
          ${tableau.map((col, colIdx) => `
            <div class="sol-col flex flex-col items-center min-h-[200px] cursor-pointer" data-col="${colIdx}">
              ${
                col.length === 0
                  ? '<div class="w-12 sm:w-14 h-16 sm:h-20 border-2 border-dashed border-white/40 rounded flex items-center justify-center text-white/40 font-bold text-sm">K</div>'
                  : col.map((card, cIdx) => `
                      <div class="${cIdx > 0 ? '-mt-11 sm:-mt-14' : ''} transition-all">
                        ${renderCardHtml(card, 'tableau', cIdx, colIdx)}
                      </div>
                    `).join('')
              }
            </div>
          `).join('')}
        </div>
      </div>
    `;

    function renderCardHtml(card: Card, pile: string, cardIndex: number, colIndex?: number): string {
      if (!card.faceUp) {
        return `
          <div class="w-12 sm:w-14 h-16 sm:h-20 rounded bg-[#000080] border-2 border-white shadow-[2px_2px_0px_#000000] flex items-center justify-center">
            <div class="w-9 sm:w-10 h-13 sm:h-16 bg-[#1084d0] border border-white"></div>
          </div>
        `;
      }

      const isSelected =
        selection &&
        selection.source === pile &&
        selection.col === colIndex &&
        cardIndex >= selection.cardIndex;

      const color = card.isRed ? 'text-red-600' : 'text-black';
      return `
        <div
          class="w-12 sm:w-14 h-16 sm:h-20 rounded bg-white border-2 ${
            isSelected ? 'border-yellow-400 ring-2 ring-yellow-400 -translate-y-1' : 'border-black'
          } shadow-[2px_2px_0px_#000000] p-1 flex flex-col justify-between cursor-pointer sol-card select-none"
          data-pile="${pile}"
          data-cidx="${cardIndex}"
          ${colIndex !== undefined ? `data-col="${colIndex}"` : ''}
        >
          <div class="flex justify-between items-center text-xs font-black ${color} leading-none">
            <span>${getCardLabel(card.value)}</span>
            <span>${card.suit}</span>
          </div>
          <div class="text-center text-base sm:text-lg ${color} leading-none">${card.suit}</div>
          <div class="text-right text-[10px] font-black ${color} leading-none">
            ${getCardLabel(card.value)}
          </div>
        </div>
      `;
    }

    container.querySelector('#sol-new')?.addEventListener('click', initGame);
    container.querySelector('#sol-stock')?.addEventListener('click', drawCard);

    // Foundation target click
    container.querySelectorAll('.sol-foundation').forEach((el) => {
      el.addEventListener('click', () => {
        const fIdx = parseInt(el.getAttribute('data-fidx') || '0', 10);
        if (selection) {
          tryMoveToFoundation(fIdx);
        }
      });
    });

    // Tableau column target click (for empty columns or moving cards)
    container.querySelectorAll('.sol-col').forEach((el) => {
      el.addEventListener('click', (e) => {
        const colIdx = parseInt(el.getAttribute('data-col') || '0', 10);
        const target = e.target as HTMLElement;
        const cardEl = target.closest('.sol-card') as HTMLElement;

        if (!cardEl && selection) {
          // Clicked empty space in column
          tryMoveToTableau(colIdx);
        }
      });
    });

    // Card click (select or move to) & double click (auto foundation)
    container.querySelectorAll('.sol-card').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const pile = el.getAttribute('data-pile') as 'waste' | 'tableau' | 'foundation';
        const cidx = parseInt(el.getAttribute('data-cidx') || '0', 10);
        const colAttr = el.getAttribute('data-col');
        const colIdx = colAttr !== null ? parseInt(colAttr, 10) : undefined;

        if (selection) {
          if (pile === 'tableau' && colIdx !== undefined) {
            // Attempt to move selected card(s) onto this card/column
            if (!tryMoveToTableau(colIdx)) {
              // Switch selection if clicked another tableau card
              const col = tableau[colIdx];
              selection = { source: 'tableau', col: colIdx, cardIndex: cidx, cards: col.slice(cidx) };
              audio.playClick();
              renderUI();
            }
          } else if (pile === 'foundation' && colIdx !== undefined) {
            tryMoveToFoundation(colIdx);
          } else {
            selection = null;
            renderUI();
          }
        } else {
          // Select this card
          if (pile === 'waste' && waste.length > 0) {
            selection = { source: 'waste', cardIndex: waste.length - 1, cards: [waste[waste.length - 1]] };
            audio.playClick();
            renderUI();
          } else if (pile === 'tableau' && colIdx !== undefined) {
            const col = tableau[colIdx];
            if (col[cidx].faceUp) {
              selection = { source: 'tableau', col: colIdx, cardIndex: cidx, cards: col.slice(cidx) };
              audio.playClick();
              renderUI();
            }
          } else if (pile === 'foundation' && colIdx !== undefined) {
            const fPile = foundations[colIdx];
            if (fPile.length > 0) {
              selection = { source: 'foundation', col: colIdx, cardIndex: fPile.length - 1, cards: [fPile[fPile.length - 1]] };
              audio.playClick();
              renderUI();
            }
          }
        }
      });

      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const pile = el.getAttribute('data-pile');
        const colAttr = el.getAttribute('data-col');
        const colIdx = colAttr !== null ? parseInt(colAttr, 10) : undefined;

        if (pile === 'waste' && waste.length > 0) {
          const card = waste[waste.length - 1];
          if (tryAutoFoundation(card)) {
            waste.pop();
            selection = null;
            checkWin();
            renderUI();
          }
        } else if (pile === 'tableau' && colIdx !== undefined) {
          const col = tableau[colIdx];
          const card = col[col.length - 1];
          if (tryAutoFoundation(card, colIdx)) {
            col.pop();
            if (col.length > 0) col[col.length - 1].faceUp = true;
            selection = null;
            checkWin();
            renderUI();
          }
        }
      });
    });
  };

  initGame();
}

/* ==========================================================================
   3. FREECELL - 100% Fully Playable Interactive Version
   ========================================================================== */
export function renderFreeCell(container: HTMLElement, win: Win95Window) {
  win.setTitle('FreeCell');

  type Card = {
    suit: '♠' | '♥' | '♦' | '♣';
    value: number; // 1 (Ace) to 13 (King)
    isRed: boolean;
  };

  const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];

  let freeCells: (Card | null)[] = [null, null, null, null];
  let foundations: Card[][] = [[], [], [], []];
  let cascades: Card[][] = Array.from({ length: 8 }, () => []);
  let dealNumber = Math.floor(Math.random() * 32000) + 1;

  let selected: {
    source: 'freecell' | 'cascade';
    index: number; // freecell index (0-3) or cascade column index (0-7)
    card: Card;
  } | null = null;

  const createDeck = (): Card[] => {
    const cards: Card[] = [];
    for (const suit of SUITS) {
      const isRed = suit === '♥' || suit === '♦';
      for (let value = 1; value <= 13; value++) {
        cards.push({ suit, value, isRed });
      }
    }
    // Seeded shuffle based on dealNumber
    let seed = dealNumber;
    for (let i = cards.length - 1; i > 0; i--) {
      seed = (seed * 214013 + 2531011) % (1 << 31);
      const j = Math.abs(seed) % (i + 1);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  };

  const initGame = () => {
    const deck = createDeck();
    freeCells = [null, null, null, null];
    foundations = [[], [], [], []];
    cascades = Array.from({ length: 8 }, () => []);
    selected = null;

    // Deal all 52 cards into 8 cascades
    for (let i = 0; i < 52; i++) {
      cascades[i % 8].push(deck[i]);
    }

    win.setTitle(`FreeCell Game #${dealNumber}`);
    renderUI();
  };

  const getCardLabel = (value: number) => {
    if (value === 1) return 'A';
    if (value === 11) return 'J';
    if (value === 12) return 'Q';
    if (value === 13) return 'K';
    return String(value);
  };

  // Try move to foundation
  const tryMoveToFoundation = (fIdx: number): boolean => {
    if (!selected) return false;
    const card = selected.card;
    const fPile = foundations[fIdx];

    let canMove = false;
    if (fPile.length === 0) {
      if (card.value === 1 && card.suit === SUITS[fIdx]) canMove = true;
    } else {
      const top = fPile[fPile.length - 1];
      if (top.suit === card.suit && top.value + 1 === card.value) {
        canMove = true;
      }
    }

    if (!canMove) return false;

    // Remove from source
    if (selected.source === 'freecell') {
      freeCells[selected.index] = null;
    } else {
      cascades[selected.index].pop();
    }

    fPile.push(card);
    selected = null;
    audio.playClick();
    checkWin();
    renderUI();
    return true;
  };

  // Try move to free cell
  const tryMoveToFreeCell = (fcIdx: number): boolean => {
    if (!selected || freeCells[fcIdx] !== null) return false;

    if (selected.source === 'freecell') {
      freeCells[selected.index] = null;
    } else {
      cascades[selected.index].pop();
    }

    freeCells[fcIdx] = selected.card;
    selected = null;
    audio.playClick();
    renderUI();
    return true;
  };

  // Try move to cascade
  const tryMoveToCascade = (cIdx: number): boolean => {
    if (!selected) return false;
    const col = cascades[cIdx];
    const card = selected.card;

    let canMove = false;
    if (col.length === 0) {
      canMove = true; // Any card can go to empty column
    } else {
      const top = col[col.length - 1];
      if (top.isRed !== card.isRed && top.value === card.value + 1) {
        canMove = true;
      }
    }

    if (!canMove) return false;

    if (selected.source === 'freecell') {
      freeCells[selected.index] = null;
    } else {
      cascades[selected.index].pop();
    }

    col.push(card);
    selected = null;
    audio.playClick();
    renderUI();
    return true;
  };

  // Auto-move on double-click
  const autoMoveCard = (card: Card, source: 'freecell' | 'cascade', srcIdx: number) => {
    // 1. Try foundations first
    for (let f = 0; f < 4; f++) {
      const fPile = foundations[f];
      if ((fPile.length === 0 && card.value === 1 && card.suit === SUITS[f]) ||
          (fPile.length > 0 && fPile[fPile.length - 1].suit === card.suit && fPile[fPile.length - 1].value + 1 === card.value)) {
        if (source === 'freecell') freeCells[srcIdx] = null;
        else cascades[srcIdx].pop();
        fPile.push(card);
        selected = null;
        audio.playClick();
        checkWin();
        renderUI();
        return;
      }
    }

    // 2. If in cascade, try first empty free cell
    if (source === 'cascade') {
      for (let fc = 0; fc < 4; fc++) {
        if (freeCells[fc] === null) {
          cascades[srcIdx].pop();
          freeCells[fc] = card;
          selected = null;
          audio.playClick();
          renderUI();
          return;
        }
      }
    }
  };

  const checkWin = () => {
    const totalFoundations = foundations.reduce((s, p) => s + p.length, 0);
    if (totalFoundations === 52) {
      audio.playTada();
      alert(`🎉 Victory! FreeCell Game #${dealNumber} Completed!`);
    }
  };

  const renderUI = () => {
    container.innerHTML = `
      <div class="flex flex-col h-full bg-[#008000] p-3 select-none font-mono text-xs text-white overflow-auto">
        <!-- Toolbar -->
        <div class="flex justify-between items-center border-b border-white/40 pb-2 mb-3">
          <div class="flex gap-2 items-center">
            <button type="button" class="retro-btn !py-0.5 !px-3 font-bold text-black" id="fc-new">New Deal</button>
            <span class="font-bold text-sm">Game #${dealNumber}</span>
          </div>
          <span class="text-[11px] text-white/90">Click to Select/Move • Double-Click to Auto-Promote</span>
        </div>

        <!-- Top: 4 Free Cells (Left) & 4 Foundations (Right) -->
        <div class="flex justify-between mb-4">
          <!-- 4 Free Cells -->
          <div class="flex gap-2">
            ${freeCells.map((card, idx) => `
              <div
                class="w-12 sm:w-14 h-16 sm:h-20 rounded border-2 border-white/70 bg-white/10 flex items-center justify-center fc-cell cursor-pointer shadow-[2px_2px_0px_#000000]"
                data-fcidx="${idx}"
              >
                ${
                  card
                    ? renderCardHtml(card, 'freecell', idx, Boolean(selected && selected.source === 'freecell' && selected.index === idx))
                    : `<span class="text-white/40 text-[10px] font-bold">Cell ${idx + 1}</span>`
                }
              </div>
            `).join('')}
          </div>

          <!-- 4 Foundations -->
          <div class="flex gap-2">
            ${foundations.map((fPile, idx) => `
              <div
                class="w-12 sm:w-14 h-16 sm:h-20 rounded border-2 border-white/80 bg-white/20 flex items-center justify-center fc-foundation cursor-pointer shadow-[2px_2px_0px_#000000]"
                data-fidx="${idx}"
              >
                ${
                  fPile.length > 0
                    ? renderCardHtml(fPile[fPile.length - 1], 'foundation', idx, false)
                    : `<span class="text-white/70 text-xl font-bold">${SUITS[idx]}</span>`
                }
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 8 Cascades -->
        <div class="grid grid-cols-8 gap-1 flex-1 items-start bg-black/15 p-2 rounded">
          ${cascades.map((col, colIdx) => `
            <div class="fc-col flex flex-col items-center min-h-[220px] cursor-pointer" data-cidx="${colIdx}">
              ${
                col.length === 0
                  ? '<div class="w-11 sm:w-13 h-16 border-2 border-dashed border-white/30 rounded flex items-center justify-center text-white/30 text-[10px]">Empty</div>'
                  : col.map((card, cIdx) => {
                      const isTop = cIdx === col.length - 1;
                      const isSel = Boolean(isTop && selected && selected.source === 'cascade' && selected.index === colIdx);
                      return `
                        <div class="${cIdx > 0 ? '-mt-12 sm:-mt-14' : ''} transition-all">
                          ${renderCardHtml(card, 'cascade', colIdx, isSel)}
                        </div>
                      `;
                    }).join('')
              }
            </div>
          `).join('')}
        </div>
      </div>
    `;

    function renderCardHtml(card: Card, type: string, index: number, isSel: boolean): string {
      const color = card.isRed ? 'text-red-600' : 'text-black';
      return `
        <div
          class="w-11 sm:w-13 h-16 sm:h-20 bg-white border-2 ${
            isSel ? 'border-yellow-400 ring-2 ring-yellow-400 -translate-y-1' : 'border-black'
          } rounded p-1 flex flex-col justify-between shadow-[2px_2px_0px_#000000] cursor-pointer fc-card select-none"
          data-type="${type}"
          data-idx="${index}"
        >
          <div class="flex justify-between items-center text-[11px] font-black ${color} leading-none">
            <span>${getCardLabel(card.value)}</span>
            <span>${card.suit}</span>
          </div>
          <div class="text-center text-sm sm:text-base ${color} leading-none">${card.suit}</div>
          <div class="text-right text-[9px] font-black ${color} leading-none">
            ${getCardLabel(card.value)}
          </div>
        </div>
      `;
    }

    container.querySelector('#fc-new')?.addEventListener('click', () => {
      dealNumber = Math.floor(Math.random() * 32000) + 1;
      initGame();
      audio.playChord();
    });

    // Free cell clicks
    container.querySelectorAll('.fc-cell').forEach((el) => {
      el.addEventListener('click', () => {
        const fcIdx = parseInt(el.getAttribute('data-fcidx') || '0', 10);
        if (selected) {
          tryMoveToFreeCell(fcIdx);
        } else if (freeCells[fcIdx] !== null) {
          selected = { source: 'freecell', index: fcIdx, card: freeCells[fcIdx]! };
          audio.playClick();
          renderUI();
        }
      });
    });

    // Foundation clicks
    container.querySelectorAll('.fc-foundation').forEach((el) => {
      el.addEventListener('click', () => {
        const fIdx = parseInt(el.getAttribute('data-fidx') || '0', 10);
        if (selected) {
          tryMoveToFoundation(fIdx);
        }
      });
    });

    // Cascade column clicks
    container.querySelectorAll('.fc-col').forEach((el) => {
      el.addEventListener('click', (e) => {
        const colIdx = parseInt(el.getAttribute('data-cidx') || '0', 10);
        const col = cascades[colIdx];

        if (selected) {
          tryMoveToCascade(colIdx);
        } else if (col.length > 0) {
          selected = { source: 'cascade', index: colIdx, card: col[col.length - 1] };
          audio.playClick();
          renderUI();
        }
      });
    });

    // Double-click auto-move
    container.querySelectorAll('.fc-card').forEach((el) => {
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const type = el.getAttribute('data-type') as 'freecell' | 'cascade';
        const idx = parseInt(el.getAttribute('data-idx') || '0', 10);

        if (type === 'freecell' && freeCells[idx]) {
          autoMoveCard(freeCells[idx]!, 'freecell', idx);
        } else if (type === 'cascade' && cascades[idx].length > 0) {
          autoMoveCard(cascades[idx][cascades[idx].length - 1], 'cascade', idx);
        }
      });
    });
  };

  initGame();
}

/* ==========================================================================
   4. HEARTS - 100% Fully Playable Interactive 4-Player Card Game
   ========================================================================== */
export function renderHearts(container: HTMLElement, win: Win95Window) {
  win.setTitle('The Microsoft Hearts Network');

  type Card = {
    suit: '♠' | '♥' | '♦' | '♣';
    value: number; // 2 to 14 (Ace = 14)
    isRed: boolean;
  };

  const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];

  let hands: Card[][] = [[], [], [], []]; // 0: South (Player), 1: West, 2: North, 3: East
  let scores = [0, 0, 0, 0];
  let currentTrick: { player: number; card: Card }[] = [];
  let leadSuit: ('♠' | '♥' | '♦' | '♣') | null = null;
  let currentPlayer = 0; // 0 = South, 1 = West, 2 = North, 3 = East
  let heartsBroken = false;
  let isTrick1 = true;
  let statusMessage = 'Pass cards or start the game.';

  const PLAYER_NAMES = ['You (South)', 'West (CPU)', 'North (CPU)', 'East (CPU)'];

  const getCardLabel = (value: number) => {
    if (value === 14) return 'A';
    if (value === 13) return 'K';
    if (value === 12) return 'Q';
    if (value === 11) return 'J';
    return String(value);
  };

  const createDeck = (): Card[] => {
    const deck: Card[] = [];
    for (const suit of SUITS) {
      const isRed = suit === '♥' || suit === '♦';
      for (let value = 2; value <= 14; value++) {
        deck.push({ suit, value, isRed });
      }
    }
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const initRound = () => {
    const deck = createDeck();
    hands = [[], [], [], []];
    currentTrick = [];
    leadSuit = null;
    heartsBroken = false;
    isTrick1 = true;

    for (let i = 0; i < 52; i++) {
      hands[i % 4].push(deck[i]);
    }

    // Sort player hand by suit and value
    hands[0].sort((a, b) => {
      if (a.suit !== b.suit) return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
      return a.value - b.value;
    });

    // Find who has ♣ 2
    let starter = 0;
    for (let p = 0; p < 4; p++) {
      if (hands[p].some(c => c.suit === '♣' && c.value === 2)) {
        starter = p;
        break;
      }
    }

    currentPlayer = starter;
    statusMessage = starter === 0 ? 'Your turn! Lead with the 2 of Clubs (♣ 2).' : `${PLAYER_NAMES[starter]} holds ♣ 2 and leads.`;
    renderUI();

    if (currentPlayer !== 0) {
      setTimeout(playCpuTurn, 800);
    }
  };

  const isCardLegal = (card: Card, hand: Card[]): boolean => {
    if (isTrick1 && currentTrick.length === 0) {
      return card.suit === '♣' && card.value === 2;
    }

    if (currentTrick.length === 0) {
      // Leading trick
      if (card.suit === '♥' && !heartsBroken) {
        // Can only lead Hearts if all cards are Hearts
        return hand.every(c => c.suit === '♥');
      }
      return true;
    }

    // Following trick
    const hasLeadSuit = hand.some(c => c.suit === leadSuit);
    if (hasLeadSuit) {
      return card.suit === leadSuit;
    }

    // Cannot discard points on trick 1 if have other cards
    if (isTrick1) {
      const isPoint = card.suit === '♥' || (card.suit === '♠' && card.value === 12);
      const hasNonPoint = hand.some(c => c.suit !== '♥' && !(c.suit === '♠' && c.value === 12));
      if (isPoint && hasNonPoint) return false;
    }

    return true;
  };

  const playCard = (player: number, cardIndex: number) => {
    const card = hands[player].splice(cardIndex, 1)[0];
    if (card.suit === '♥') heartsBroken = true;

    if (currentTrick.length === 0) {
      leadSuit = card.suit;
    }

    currentTrick.push({ player, card });
    audio.playClick();

    if (currentTrick.length === 4) {
      renderUI();
      setTimeout(resolveTrick, 1200);
    } else {
      currentPlayer = (currentPlayer + 1) % 4;
      statusMessage = currentPlayer === 0 ? `Your turn! Lead suit is ${leadSuit}.` : `${PLAYER_NAMES[currentPlayer]} is playing...`;
      renderUI();
      if (currentPlayer !== 0) {
        setTimeout(playCpuTurn, 700);
      }
    }
  };

  const playCpuTurn = () => {
    const hand = hands[currentPlayer];
    if (hand.length === 0) return;

    const legals: number[] = [];
    hand.forEach((c, i) => {
      if (isCardLegal(c, hand)) legals.push(i);
    });

    const choiceIdx = legals.length > 0 ? legals[Math.floor(Math.random() * legals.length)] : 0;
    playCard(currentPlayer, choiceIdx);
  };

  const resolveTrick = () => {
    // Winner has highest card of lead suit
    let winningPlayer = currentTrick[0].player;
    let highestVal = -1;

    for (const item of currentTrick) {
      if (item.card.suit === leadSuit && item.card.value > highestVal) {
        highestVal = item.card.value;
        winningPlayer = item.player;
      }
    }

    // Calculate points
    let trickPoints = 0;
    for (const item of currentTrick) {
      if (item.card.suit === '♥') trickPoints += 1;
      if (item.card.suit === '♠' && item.card.value === 12) trickPoints += 13; // Queen of spades
    }

    scores[winningPlayer] += trickPoints;
    isTrick1 = false;
    leadSuit = null;
    currentTrick = [];
    currentPlayer = winningPlayer;

    if (trickPoints > 0) {
      audio.playDing();
      statusMessage = `${PLAYER_NAMES[winningPlayer]} takes the trick (${trickPoints} pts)! Leads next.`;
    } else {
      statusMessage = `${PLAYER_NAMES[winningPlayer]} wins the trick! Leads next.`;
    }

    if (hands[0].length === 0) {
      // Round over
      audio.playTada();
      alert(`Round Over!\n\nScores:\nYou: ${scores[0]}\nWest: ${scores[1]}\nNorth: ${scores[2]}\nEast: ${scores[3]}`);
      initRound();
      return;
    }

    renderUI();

    if (currentPlayer !== 0) {
      setTimeout(playCpuTurn, 800);
    }
  };

  const renderUI = () => {
    const southHand = hands[0];

    container.innerHTML = `
      <div class="flex flex-col h-full bg-[#008000] p-3 select-none font-mono text-xs text-white justify-between overflow-hidden">
        <!-- Top Opponent: North -->
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-2">
            <span class="font-bold">North (CPU)</span>
            <span class="text-[10px] text-yellow-300">Score: ${scores[2]}</span>
          </div>
          <div class="flex gap-0.5 mt-1">
            ${hands[2].map(() => '<div class="w-6 h-9 bg-[#000080] border border-white rounded shadow-sm"></div>').join('')}
          </div>
        </div>

        <!-- Middle Row: West, Trick Arena, East -->
        <div class="flex justify-between items-center px-2">
          <!-- West -->
          <div class="flex flex-col items-center w-20">
            <span class="font-bold text-[11px]">West</span>
            <span class="text-[10px] text-yellow-300">${scores[1]} pts</span>
            <div class="flex flex-col gap-0.5 mt-1">
              ${hands[1].slice(0, 7).map(() => '<div class="w-9 h-4 bg-[#000080] border border-white rounded shadow-sm"></div>').join('')}
            </div>
          </div>

          <!-- Trick Arena -->
          <div class="w-56 h-36 bg-black/30 border-2 border-white/50 rounded-lg flex flex-col items-center justify-between p-2 shadow-inner">
            <div class="text-[10px] text-yellow-300 font-bold truncate max-w-full text-center">
              ${statusMessage}
            </div>

            <!-- Trick Cards Cross -->
            <div class="flex gap-2 items-center justify-center my-auto">
              ${
                currentTrick.length === 0
                  ? '<span class="text-white/40 text-[11px] italic">Waiting for lead...</span>'
                  : currentTrick.map(t => {
                      const color = t.card.isRed ? 'text-red-600' : 'text-black';
                      return `
                        <div class="flex flex-col items-center">
                          <span class="text-[9px] text-white/80 mb-0.5">${PLAYER_NAMES[t.player].split(' ')[0]}</span>
                          <div class="w-9 h-13 bg-white ${color} border border-black rounded p-0.5 flex flex-col justify-between text-center shadow">
                            <span class="text-[10px] font-black leading-none">${getCardLabel(t.card.value)}</span>
                            <span class="text-sm leading-none">${t.card.suit}</span>
                          </div>
                        </div>
                      `;
                    }).join('')
              }
            </div>

            <div class="text-[9px] text-white/60">
              Hearts ${heartsBroken ? '💔 Broken' : '🔒 Not Broken'}
            </div>
          </div>

          <!-- East -->
          <div class="flex flex-col items-center w-20">
            <span class="font-bold text-[11px]">East</span>
            <span class="text-[10px] text-yellow-300">${scores[3]} pts</span>
            <div class="flex flex-col gap-0.5 mt-1">
              ${hands[3].slice(0, 7).map(() => '<div class="w-9 h-4 bg-[#000080] border border-white rounded shadow-sm"></div>').join('')}
            </div>
          </div>
        </div>

        <!-- Bottom: You (South Hand) -->
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-3 mb-1">
            <span class="font-bold">Your Hand (South)</span>
            <span class="text-yellow-300 font-bold">Your Score: ${scores[0]} pts</span>
            <button type="button" class="retro-btn !py-0 !px-2 text-black text-[10px] font-bold" id="hearts-new">New Hand</button>
          </div>

          <div class="flex gap-1 flex-wrap justify-center max-w-full">
            ${southHand.map((c, idx) => {
              const legal = currentPlayer === 0 && isCardLegal(c, southHand);
              const color = c.isRed ? 'text-red-600' : 'text-black';
              return `
                <button
                  type="button"
                  class="w-8 sm:w-9 h-13 sm:h-14 bg-white ${color} border-2 ${
                    legal ? 'border-yellow-300 hover:-translate-y-2 cursor-pointer shadow-md' : 'border-gray-500 opacity-70 cursor-not-allowed'
                  } rounded p-0.5 flex flex-col justify-between font-bold text-xs select-none transition-transform hearts-card"
                  data-cidx="${idx}"
                  ${!legal ? 'disabled' : ''}
                >
                  <div class="flex justify-between items-center text-[10px] leading-none">
                    <span>${getCardLabel(c.value)}</span>
                    <span>${c.suit}</span>
                  </div>
                  <div class="text-center text-sm leading-none">${c.suit}</div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    container.querySelector('#hearts-new')?.addEventListener('click', () => {
      initRound();
      audio.playChord();
    });

    container.querySelectorAll('.hearts-card:not([disabled])').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (currentPlayer !== 0) return;
        const cidx = parseInt(btn.getAttribute('data-cidx') || '0', 10);
        playCard(0, cidx);
      });
    });
  };

  initRound();
}
