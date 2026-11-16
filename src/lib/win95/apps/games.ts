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

  type Suit = '♠' | '♥' | '♦' | '♣';
  type Card = {
    id: string;
    suit: Suit;
    value: number; // 1 (Ace) to 13 (King)
    isRed: boolean;
    faceUp: boolean;
  };

  type CardBackId =
    | 'lattice_blue'
    | 'beach'
    | 'castle'
    | 'robot'
    | 'seashell'
    | 'dealer'
    | 'roses'
    | 'fish'
    | 'lattice_black'
    | 'win95'
    | 'mountain'
    | 'sun';

  const CARD_BACK_LABELS: Record<CardBackId, string> = {
    lattice_blue: 'Lattice Blue',
    beach: 'Beach Palms',
    castle: 'Haunted Castle',
    robot: 'Retro Robot',
    seashell: 'Emerald Shell',
    dealer: 'Card Dealer',
    roses: 'Vintage Roses',
    fish: 'Tropical Fish',
    lattice_black: 'Lattice Black',
    win95: 'Windows 95',
    mountain: 'Purple Mountain',
    sun: 'Sunburst',
  };

  type SolitaireOptions = {
    drawMode: 1 | 3;
    scoring: 'standard' | 'vegas' | 'none';
    timed: boolean;
    statusBar: boolean;
  };

  const DEFAULT_OPTIONS: SolitaireOptions = {
    drawMode: 3,
    scoring: 'standard',
    timed: true,
    statusBar: true,
  };

  const getSavedOptions = (): SolitaireOptions => {
    try {
      const saved = localStorage.getItem('win95_solitaire_options');
      if (saved) return { ...DEFAULT_OPTIONS, ...JSON.parse(saved) };
    } catch (_) {}
    return { ...DEFAULT_OPTIONS };
  };

  const saveOptions = (opts: SolitaireOptions) => {
    try {
      localStorage.setItem('win95_solitaire_options', JSON.stringify(opts));
    } catch (_) {}
  };

  const getSavedDeck = (): CardBackId => {
    try {
      const saved = localStorage.getItem('win95_solitaire_deck') as CardBackId;
      if (saved && CARD_BACK_LABELS[saved]) return saved;
    } catch (_) {}
    return 'lattice_blue';
  };

  const saveDeck = (deckId: CardBackId) => {
    try {
      localStorage.setItem('win95_solitaire_deck', deckId);
    } catch (_) {}
  };

  const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];

  let options: SolitaireOptions = getSavedOptions();
  let currentCardBack: CardBackId = getSavedDeck();

  let stock: Card[] = [];
  let waste: Card[] = [];
  let foundations: Card[][] = [[], [], [], []];
  let tableau: Card[][] = [[], [], [], [], [], [], []];

  let score = options.scoring === 'vegas' ? -52 : 0;
  let seconds = 0;
  let moves = 0;
  let timerId: number | null = null;
  let isGameStarted = false;
  let isGameOver = false;
  let isWon = false;
  let winCascadeActive = false;
  let cascadeAnimId: number | null = null;

  type UndoSnapshot = {
    stock: Card[];
    waste: Card[];
    foundations: Card[][];
    tableau: Card[][];
    score: number;
    seconds: number;
    moves: number;
  };

  const undoStack: UndoSnapshot[] = [];

  // Selection state for click-to-move
  let selection: {
    source: 'waste' | 'tableau' | 'foundation';
    col?: number;
    cardIndex: number;
    cards: Card[];
  } | null = null;

  // Active hint highlight coordinates
  let activeHint: {
    sourceCardId?: string;
    targetCol?: number;
    targetFidx?: number;
  } | null = null;

  const pushUndo = () => {
    undoStack.push({
      stock: stock.map((c) => ({ ...c })),
      waste: waste.map((c) => ({ ...c })),
      foundations: foundations.map((p) => p.map((c) => ({ ...c }))),
      tableau: tableau.map((col) => col.map((c) => ({ ...c }))),
      score,
      seconds,
      moves,
    });
    if (undoStack.length > 60) undoStack.shift();
  };

  const performUndo = () => {
    if (undoStack.length === 0 || isGameOver) {
      audio.playError();
      return;
    }
    const prev = undoStack.pop()!;
    stock = prev.stock;
    waste = prev.waste;
    foundations = prev.foundations;
    tableau = prev.tableau;
    score = prev.score;
    seconds = prev.seconds;
    moves = prev.moves;
    selection = null;
    activeHint = null;
    audio.playClick();
    renderUI();
  };

  const startTimer = () => {
    if (timerId !== null) clearInterval(timerId);
    timerId = window.setInterval(() => {
      seconds++;
      if (options.scoring === 'standard' && seconds % 10 === 0 && score > 2) {
        score -= 2;
      }
      updateStatusTime();
    }, 1000);
  };

  const stopTimer = () => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const createDeck = (): Card[] => {
    const cards: Card[] = [];
    for (const suit of SUITS) {
      const isRed = suit === '♥' || suit === '♦';
      for (let value = 1; value <= 13; value++) {
        cards.push({
          id: `${suit}${value}`,
          suit,
          value,
          isRed,
          faceUp: false,
        });
      }
    }
    // Fisher-Yates Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  };

  const initGame = () => {
    stopTimer();
    stopWinCascade();

    const deck = createDeck();
    stock = [];
    waste = [];
    foundations = [[], [], [], []];
    tableau = [[], [], [], [], [], [], []];
    selection = null;
    activeHint = null;
    undoStack.length = 0;
    isGameStarted = false;
    isGameOver = false;
    isWon = false;
    seconds = 0;
    moves = 0;
    score = options.scoring === 'vegas' ? -52 : 0;

    // Deal 28 cards to tableau (1 in col 0, 2 in col 1, ..., 7 in col 6)
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

  const getCardBackSvg = (backId: CardBackId): string => {
    switch (backId) {
      case 'lattice_black':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#181818" rx="3"/>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#c0c0c0" stroke-width="1.5" rx="2"/>
          <defs>
            <pattern id="pat_blk_${backId}" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M4 0 L8 4 L4 8 L0 4 Z" fill="none" stroke="#484848" stroke-width="0.8"/>
              <circle cx="4" cy="4" r="0.8" fill="#c0c0c0"/>
            </pattern>
          </defs>
          <rect x="5" y="5" width="62" height="86" fill="url(#pat_blk_${backId})" rx="2"/>
        </svg>`;
      case 'beach':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#004080" rx="3"/>
          <rect x="3" y="3" width="66" height="90" fill="#f87820" rx="2"/>
          <circle cx="36" cy="40" r="14" fill="#ffee44"/>
          <rect x="3" y="56" width="66" height="37" fill="#0077aa"/>
          <path d="M3 64 Q20 60 36 64 T70 64 L70 93 L3 93 Z" fill="#005588"/>
          <path d="M46 68 Q40 50 34 36 Q38 48 48 68 Z" fill="#442200"/>
          <path d="M34 36 Q22 30 14 36 Q24 35 34 38 Z" fill="#008822"/>
          <path d="M34 36 Q26 24 20 22 Q26 29 34 36 Z" fill="#00aa33"/>
          <path d="M34 36 Q42 22 52 24 Q44 29 34 37 Z" fill="#008822"/>
          <path d="M34 36 Q48 30 56 36 Q46 36 34 38 Z" fill="#00aa33"/>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
        </svg>`;
      case 'castle':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#180838" rx="3"/>
          <circle cx="50" cy="24" r="10" fill="#ffee66"/>
          <path d="M12 90 L12 52 L20 52 L20 46 L24 46 L24 52 L32 52 L32 38 L40 38 L40 52 L48 52 L48 46 L52 46 L52 52 L60 52 L60 90 Z" fill="#000000"/>
          <polygon points="36,26 31,38 41,38" fill="#000000"/>
          <path d="M22 28 Q26 24 28 27 Q30 24 34 28 Q30 29 28 28 Q26 29 22 28 Z" fill="#000000"/>
          <path d="M38 18 Q41 15 43 17 Q45 15 48 18 Q45 19 43 18 Q41 19 38 18 Z" fill="#000000"/>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
        </svg>`;
      case 'win95':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#d4d0c8" rx="3"/>
          <rect x="3" y="3" width="66" height="90" fill="#000080" rx="2"/>
          <g transform="translate(18, 28) scale(0.65)">
            <path d="M0 0 L20 -4 L20 16 L0 20 Z" fill="#ff0000"/>
            <path d="M24 -5 L46 -8 L46 12 L24 15 Z" fill="#00aa00"/>
            <path d="M0 24 L20 20 L20 40 L0 44 Z" fill="#0066ff"/>
            <path d="M24 19 L46 16 L46 36 L24 39 Z" fill="#ffcc00"/>
          </g>
          <text x="36" y="74" fill="#ffffff" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">WINDOWS 95</text>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
        </svg>`;
      case 'robot':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#202028" rx="3"/>
          <rect x="18" y="24" width="36" height="42" fill="#808090" stroke="#c0c0d0" stroke-width="1.5" rx="4"/>
          <rect x="24" y="32" width="24" height="8" fill="#00ff66" rx="2"/>
          <circle cx="28" cy="48" r="3" fill="#ff0044"/>
          <circle cx="44" cy="48" r="3" fill="#ff0044"/>
          <rect x="28" y="56" width="16" height="4" fill="#202028"/>
          <line x1="36" y1="24" x2="36" y2="14" stroke="#c0c0d0" stroke-width="2"/>
          <circle cx="36" cy="12" r="3" fill="#00ffcc"/>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
        </svg>`;
      case 'seashell':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#004d40" rx="3"/>
          <circle cx="36" cy="48" r="24" fill="#00695c"/>
          <path d="M36 28 C48 28 56 38 56 50 C56 60 48 68 36 68 C26 68 20 60 20 50 C20 42 26 36 34 36 C40 36 44 40 44 46 C44 50 40 54 36 54 C33 54 30 51 30 48" fill="none" stroke="#ffe082" stroke-width="2.5" stroke-linecap="round"/>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
        </svg>`;
      case 'dealer':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#660000" rx="3"/>
          <rect x="14" y="54" width="44" height="28" fill="#111111" rx="2"/>
          <rect x="18" y="50" width="36" height="6" fill="#ffffff" rx="1"/>
          <g transform="translate(24, 20) rotate(-15)">
            <rect width="18" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8" rx="1"/>
            <text x="3" y="9" font-size="7" font-weight="bold" fill="#ff0000">A♥</text>
          </g>
          <g transform="translate(34, 18) rotate(10)">
            <rect width="18" height="26" fill="#ffffff" stroke="#000000" stroke-width="0.8" rx="1"/>
            <text x="3" y="9" font-size="7" font-weight="bold" fill="#000000">A♠</text>
          </g>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
        </svg>`;
      case 'roses':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#1b381b" rx="3"/>
          <circle cx="36" cy="40" r="14" fill="#cc1133"/>
          <circle cx="36" cy="40" r="9" fill="#ee3355"/>
          <circle cx="36" cy="40" r="5" fill="#ff7799"/>
          <path d="M22 52 Q36 68 36 82 Q36 68 50 52 Z" fill="#2e7d32"/>
          <circle cx="24" cy="36" r="6" fill="#1e5822"/>
          <circle cx="48" cy="36" r="6" fill="#1e5822"/>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
        </svg>`;
      case 'fish':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#005080" rx="3"/>
          <path d="M20 48 Q36 32 50 48 Q36 64 20 48 Z" fill="#ff8800"/>
          <polygon points="14,38 22,48 14,58" fill="#ff8800"/>
          <circle cx="44" cy="45" r="2.5" fill="#000000"/>
          <circle cx="45" cy="44" r="0.8" fill="#ffffff"/>
          <path d="M32 37 L32 59" stroke="#ffffff" stroke-width="2"/>
          <path d="M40 40 L40 56" stroke="#ffffff" stroke-width="2"/>
          <circle cx="54" cy="36" r="2" fill="none" stroke="#ffffff" stroke-width="0.8"/>
          <circle cx="58" cy="28" r="1.5" fill="none" stroke="#ffffff" stroke-width="0.8"/>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
        </svg>`;
      case 'mountain':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#3a1c54" rx="3"/>
          <circle cx="36" cy="34" r="12" fill="#ffbb44"/>
          <polygon points="10,88 32,44 54,88" fill="#1e1030"/>
          <polygon points="30,88 48,52 66,88" fill="#2d1b44"/>
          <polygon points="32,44 28,52 32,50 36,52" fill="#ffffff"/>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
        </svg>`;
      case 'sun':
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#0a1a3a" rx="3"/>
          <g transform="translate(36, 48)">
            <circle cx="0" cy="0" r="10" fill="#ffcc00"/>
            <line x1="0" y1="-14" x2="0" y2="-22" stroke="#ffcc00" stroke-width="2"/>
            <line x1="10" y1="-10" x2="16" y2="-16" stroke="#ffcc00" stroke-width="2"/>
            <line x1="14" y1="0" x2="22" y2="0" stroke="#ffcc00" stroke-width="2"/>
            <line x1="10" y1="10" x2="16" y2="16" stroke="#ffcc00" stroke-width="2"/>
            <line x1="0" y1="14" x2="0" y2="22" stroke="#ffcc00" stroke-width="2"/>
            <line x1="-10" y1="10" x2="-16" y2="16" stroke="#ffcc00" stroke-width="2"/>
            <line x1="-14" y1="0" x2="-22" y2="0" stroke="#ffcc00" stroke-width="2"/>
            <line x1="-10" y1="-10" x2="-16" y2="-16" stroke="#ffcc00" stroke-width="2"/>
          </g>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
        </svg>`;
      case 'lattice_blue':
      default:
        return `<svg width="100%" height="100%" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="96" fill="#0000a8" rx="3"/>
          <rect x="3" y="3" width="66" height="90" fill="none" stroke="#ffffff" stroke-width="1.5" rx="2"/>
          <defs>
            <pattern id="pat_blue_${backId}" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M4 0 L8 4 L4 8 L0 4 Z" fill="none" stroke="#2a66ff" stroke-width="0.8"/>
              <circle cx="4" cy="4" r="0.8" fill="#ffffff"/>
            </pattern>
          </defs>
          <rect x="5" y="5" width="62" height="86" fill="url(#pat_blue_${backId})" rx="2"/>
        </svg>`;
    }
  };

  const drawCard = () => {
    if (!isGameStarted && options.timed) {
      isGameStarted = true;
      startTimer();
    }
    pushUndo();
    selection = null;
    activeHint = null;

    if (stock.length > 0) {
      const drawCount = Math.min(options.drawMode, stock.length);
      for (let i = 0; i < drawCount; i++) {
        const card = stock.pop()!;
        card.faceUp = true;
        waste.push(card);
      }
      moves++;
      audio.playClick();
    } else {
      if (waste.length > 0) {
        // Recycle waste back to stock
        while (waste.length > 0) {
          const c = waste.pop()!;
          c.faceUp = false;
          stock.push(c);
        }
        if (options.scoring === 'standard') {
          if (options.drawMode === 1) {
            score = Math.max(0, score - 100);
          } else {
            score = Math.max(0, score - 20);
          }
        }
        moves++;
        audio.playClick();
      } else {
        audio.playError();
      }
    }
    renderUI();
  };

  // Check if a single card can move to any foundation
  const tryAutoFoundation = (card: Card, colIndex?: number): boolean => {
    for (let fIdx = 0; fIdx < 4; fIdx++) {
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

      if (canMove) {
        pushUndo();
        if (!isGameStarted && options.timed) {
          isGameStarted = true;
          startTimer();
        }

        if (colIndex !== undefined) {
          tableau[colIndex].pop();
          if (tableau[colIndex].length > 0 && !tableau[colIndex][tableau[colIndex].length - 1].faceUp) {
            tableau[colIndex][tableau[colIndex].length - 1].faceUp = true;
            if (options.scoring === 'standard') score += 5;
          }
        } else {
          waste.pop();
        }

        fPile.push(card);
        if (options.scoring === 'standard') score += 10;
        else if (options.scoring === 'vegas') score += 5;

        moves++;
        selection = null;
        activeHint = null;
        audio.playClick();
        checkWin();
        renderUI();
        return true;
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
      if (movingLead.value === 13) canMove = true; // King only on empty column
    } else {
      const top = destCol[destCol.length - 1];
      if (top.faceUp && top.isRed !== movingLead.isRed && top.value === movingLead.value + 1) {
        canMove = true;
      }
    }

    if (!canMove) return false;

    pushUndo();
    if (!isGameStarted && options.timed) {
      isGameStarted = true;
      startTimer();
    }

    if (selection.source === 'waste') {
      waste.pop();
      if (options.scoring === 'standard') score += 5;
    } else if (selection.source === 'tableau' && selection.col !== undefined) {
      const srcCol = tableau[selection.col];
      srcCol.splice(selection.cardIndex, selection.cards.length);
      if (srcCol.length > 0 && !srcCol[srcCol.length - 1].faceUp) {
        srcCol[srcCol.length - 1].faceUp = true;
        if (options.scoring === 'standard') score += 5;
      }
    } else if (selection.source === 'foundation' && selection.col !== undefined) {
      foundations[selection.col].pop();
      if (options.scoring === 'standard') score = Math.max(0, score - 15);
      else if (options.scoring === 'vegas') score -= 5;
    }

    destCol.push(...selection.cards);
    moves++;
    selection = null;
    activeHint = null;
    audio.playClick();
    checkWin();
    renderUI();
    return true;
  };

  // Move selected card to foundation pile
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

    pushUndo();
    if (!isGameStarted && options.timed) {
      isGameStarted = true;
      startTimer();
    }

    if (selection.source === 'waste') {
      waste.pop();
    } else if (selection.source === 'tableau' && selection.col !== undefined) {
      const srcCol = tableau[selection.col];
      srcCol.pop();
      if (srcCol.length > 0 && !srcCol[srcCol.length - 1].faceUp) {
        srcCol[srcCol.length - 1].faceUp = true;
        if (options.scoring === 'standard') score += 5;
      }
    }

    fPile.push(card);
    if (options.scoring === 'standard') score += 10;
    else if (options.scoring === 'vegas') score += 5;

    moves++;
    selection = null;
    activeHint = null;
    audio.playClick();
    checkWin();
    renderUI();
    return true;
  };

  // Auto-finish solver: iteratively moves valid cards to foundations
  const performAutoFinish = () => {
    let movedAny = false;
    // Try waste
    if (waste.length > 0) {
      const topWaste = waste[waste.length - 1];
      if (tryAutoFoundation(topWaste)) {
        movedAny = true;
      }
    }
    // Try tableau
    if (!movedAny) {
      for (let c = 0; c < 7; c++) {
        const col = tableau[c];
        if (col.length > 0) {
          const topCard = col[col.length - 1];
          if (topCard.faceUp && tryAutoFoundation(topCard, c)) {
            movedAny = true;
            break;
          }
        }
      }
    }

    if (movedAny) {
      setTimeout(performAutoFinish, 90);
    } else {
      audio.playAsterisk();
    }
  };

  // Find a suggested move for Hint
  const provideHint = () => {
    // 1. Check waste to foundation
    if (waste.length > 0) {
      const wCard = waste[waste.length - 1];
      for (let f = 0; f < 4; f++) {
        const fPile = foundations[f];
        if ((fPile.length === 0 && wCard.value === 1) || (fPile.length > 0 && fPile[fPile.length - 1].suit === wCard.suit && fPile[fPile.length - 1].value + 1 === wCard.value)) {
          activeHint = { sourceCardId: wCard.id, targetFidx: f };
          audio.playAsterisk();
          renderUI();
          return;
        }
      }
    }

    // 2. Check tableau to foundation
    for (let c = 0; c < 7; c++) {
      const col = tableau[c];
      if (col.length > 0) {
        const card = col[col.length - 1];
        if (card.faceUp) {
          for (let f = 0; f < 4; f++) {
            const fPile = foundations[f];
            if ((fPile.length === 0 && card.value === 1) || (fPile.length > 0 && fPile[fPile.length - 1].suit === card.suit && fPile[fPile.length - 1].value + 1 === card.value)) {
              activeHint = { sourceCardId: card.id, targetFidx: f };
              audio.playAsterisk();
              renderUI();
              return;
            }
          }
        }
      }
    }

    // 3. Check waste to tableau
    if (waste.length > 0) {
      const wCard = waste[waste.length - 1];
      for (let c = 0; c < 7; c++) {
        const col = tableau[c];
        if (col.length === 0 && wCard.value === 13) {
          activeHint = { sourceCardId: wCard.id, targetCol: c };
          audio.playAsterisk();
          renderUI();
          return;
        } else if (col.length > 0) {
          const top = col[col.length - 1];
          if (top.faceUp && top.isRed !== wCard.isRed && top.value === wCard.value + 1) {
            activeHint = { sourceCardId: wCard.id, targetCol: c };
            audio.playAsterisk();
            renderUI();
            return;
          }
        }
      }
    }

    // 4. Check tableau to tableau
    for (let c1 = 0; c1 < 7; c1++) {
      const col1 = tableau[c1];
      for (let i = 0; i < col1.length; i++) {
        const lead = col1[i];
        if (!lead.faceUp) continue;
        if (i === 0 && lead.value === 13) continue; // Moving King from empty bottom to empty space is pointless

        for (let c2 = 0; c2 < 7; c2++) {
          if (c1 === c2) continue;
          const col2 = tableau[c2];
          if (col2.length === 0 && lead.value === 13 && i > 0) {
            activeHint = { sourceCardId: lead.id, targetCol: c2 };
            audio.playAsterisk();
            renderUI();
            return;
          } else if (col2.length > 0) {
            const top2 = col2[col2.length - 1];
            if (top2.faceUp && top2.isRed !== lead.isRed && top2.value === lead.value + 1) {
              activeHint = { sourceCardId: lead.id, targetCol: c2 };
              audio.playAsterisk();
              renderUI();
              return;
            }
          }
        }
      }
    }

    // No moves found
    audio.playDing();
    const tipEl = container.querySelector('#sol-status-tip');
    if (tipEl) {
      tipEl.textContent = 'No obvious moves. Click the Stock pile to draw cards!';
    }
  };

  const checkWin = () => {
    const totalFoundations = foundations.reduce((sum, p) => sum + p.length, 0);
    if (totalFoundations === 52 && !isWon) {
      isWon = true;
      isGameOver = true;
      stopTimer();

      if (options.scoring === 'standard') {
        const timeBonus = Math.floor(Math.max(0, 20000 / Math.max(10, seconds)));
        score += timeBonus;
      }

      audio.playTada();
      startWinCascade();
    }
  };

  // The iconic Windows 95 Solitaire bouncing cards waterfall cascade!
  const startWinCascade = () => {
    winCascadeActive = true;
    const canvas = container.querySelector('#sol-victory-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    canvas.style.display = 'block';
    canvas.width = canvas.parentElement?.clientWidth || 640;
    canvas.height = canvas.parentElement?.clientHeight || 440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill initial felt
    ctx.fillStyle = '#008000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    type BouncingCard = {
      suit: Suit;
      label: string;
      color: string;
      x: number;
      y: number;
      vx: number;
      vy: number;
      w: number;
      h: number;
    };

    const cardsToBounce: BouncingCard[] = [];
    const cardWidth = Math.min(72, Math.floor(canvas.width / 9));
    const cardHeight = Math.floor(cardWidth * 1.35);

    // Collect all 52 cards from foundations in reverse order (Kings down to Aces)
    for (let val = 13; val >= 1; val--) {
      for (let sIdx = 0; sIdx < 4; sIdx++) {
        const suit = SUITS[sIdx];
        const label = getCardLabel(val);
        const color = suit === '♥' || suit === '♦' ? '#cc0000' : '#000000';
        const startX = Math.floor(canvas.width * 0.45) + sIdx * (cardWidth + 10);
        cardsToBounce.push({
          suit,
          label,
          color,
          x: startX,
          y: 20,
          vx: (Math.random() - 0.45) * 6,
          vy: -Math.random() * 4,
          w: cardWidth,
          h: cardHeight,
        });
      }
    }

    let activeBouncer: BouncingCard | null = cardsToBounce.shift() || null;
    const gravity = 0.55;
    const floor = canvas.height - cardHeight;

    const drawCardSprite = (c: BouncingCard) => {
      // White body with border
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(c.x, c.y, c.w, c.h);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(c.x, c.y, c.w, c.h);

      // Shadow pixel bevel
      ctx.fillStyle = '#808080';
      ctx.fillRect(c.x + c.w, c.y + 1, 1, c.h);
      ctx.fillRect(c.x + 1, c.y + c.h, c.w, 1);

      // Indices
      ctx.fillStyle = c.color;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(c.label, c.x + 4, c.y + 14);
      ctx.fillText(c.suit, c.x + 4, c.y + 26);
      ctx.font = '16px serif';
      ctx.fillText(c.suit, c.x + c.w / 2 - 5, c.y + c.h / 2 + 5);
    };

    const step = () => {
      if (!winCascadeActive) return;

      if (activeBouncer) {
        activeBouncer.x += activeBouncer.vx;
        activeBouncer.vy += gravity;
        activeBouncer.y += activeBouncer.vy;

        if (activeBouncer.y >= floor) {
          activeBouncer.y = floor;
          activeBouncer.vy = -activeBouncer.vy * 0.82;
        }

        drawCardSprite(activeBouncer);

        // Next card if offscreen left/right
        if (activeBouncer.x < -activeBouncer.w || activeBouncer.x > canvas.width + 20) {
          activeBouncer = cardsToBounce.shift() || null;
        }
      }

      cascadeAnimId = requestAnimationFrame(step);
    };

    cascadeAnimId = requestAnimationFrame(step);
  };

  const stopWinCascade = () => {
    winCascadeActive = false;
    if (cascadeAnimId !== null) {
      cancelAnimationFrame(cascadeAnimId);
      cascadeAnimId = null;
    }
    const canvas = container.querySelector('#sol-victory-canvas') as HTMLCanvasElement;
    if (canvas) canvas.style.display = 'none';
  };

  const updateStatusTime = () => {
    const timeEl = container.querySelector('#sol-status-time');
    if (timeEl) timeEl.textContent = `Time: ${seconds}`;
  };

  // Dialog: Select Card Back (Deck...)
  const showDeckDialog = () => {
    const modal = document.createElement('div');
    modal.className = 'absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-2 select-none';
    let chosenBack = currentCardBack;

    modal.innerHTML = `
      <div class="retro-window p-1 w-[380px] max-w-[95vw] bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000]">
        <div class="retro-titlebar px-2 py-0.5 text-xs text-white font-bold flex justify-between items-center mb-2">
          <span>Select Card Back</span>
          <button type="button" class="retro-titlebar-btn !w-4 !h-4 text-[10px]" id="sol-deck-close">✕</button>
        </div>
        <div class="p-2 text-xs font-mono text-black space-y-3">
          <p class="font-bold text-[11px]">Click a card design to choose your deck:</p>
          <div class="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[260px] overflow-y-auto p-1 border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white bg-[#808080]/20">
            ${(Object.keys(CARD_BACK_LABELS) as CardBackId[])
              .map(
                (id) => `
              <div
                class="sol-deck-opt flex flex-col items-center p-1 cursor-pointer border-2 ${
                  id === chosenBack ? 'border-[#000080] bg-[#000080]/20' : 'border-transparent hover:border-white'
                }"
                data-back="${id}"
                title="${CARD_BACK_LABELS[id]}"
              >
                <div class="w-11 h-15 shadow-[2px_2px_0px_#000000]">
                  ${getCardBackSvg(id)}
                </div>
                <span class="text-[9px] truncate max-w-[50px] mt-1 text-center font-bold">${CARD_BACK_LABELS[id]}</span>
              </div>
            `
              )
              .join('')}
          </div>
          <div class="flex justify-end gap-2 pt-1">
            <button type="button" id="sol-deck-ok" class="retro-btn !px-4 !py-1 font-bold">OK</button>
            <button type="button" id="sol-deck-cancel" class="retro-btn !px-3 !py-1">Cancel</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(modal);

    modal.querySelectorAll('.sol-deck-opt').forEach((opt) => {
      opt.addEventListener('click', () => {
        const id = opt.getAttribute('data-back') as CardBackId;
        if (id) {
          chosenBack = id;
          modal.querySelectorAll('.sol-deck-opt').forEach((o) => {
            o.classList.remove('border-[#000080]', 'bg-[#000080]/20');
            o.classList.add('border-transparent');
          });
          opt.classList.add('border-[#000080]', 'bg-[#000080]/20');
          opt.classList.remove('border-transparent');
          audio.playClick();
        }
      });
    });

    const closeDeck = () => modal.remove();
    modal.querySelector('#sol-deck-close')?.addEventListener('click', closeDeck);
    modal.querySelector('#sol-deck-cancel')?.addEventListener('click', closeDeck);
    modal.querySelector('#sol-deck-ok')?.addEventListener('click', () => {
      currentCardBack = chosenBack;
      saveDeck(currentCardBack);
      audio.playClick();
      closeDeck();
      renderUI();
    });
  };

  // Dialog: Options...
  const showOptionsDialog = () => {
    const modal = document.createElement('div');
    modal.className = 'absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-2 select-none';
    modal.innerHTML = `
      <div class="retro-window p-1 w-[320px] max-w-[95vw] bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000]">
        <div class="retro-titlebar px-2 py-0.5 text-xs text-white font-bold flex justify-between items-center mb-2">
          <span>Options</span>
          <button type="button" class="retro-titlebar-btn !w-4 !h-4 text-[10px]" id="sol-opt-close">✕</button>
        </div>
        <div class="p-3 text-xs font-mono text-black space-y-3">
          <!-- Draw Group -->
          <fieldset class="border border-[#808080] p-2 space-y-1">
            <legend class="px-1 font-bold">Draw</legend>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sol-draw" value="1" ${options.drawMode === 1 ? 'checked' : ''} />
              <span>Draw One</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sol-draw" value="3" ${options.drawMode === 3 ? 'checked' : ''} />
              <span>Draw Three</span>
            </label>
          </fieldset>

          <!-- Scoring Group -->
          <fieldset class="border border-[#808080] p-2 space-y-1">
            <legend class="px-1 font-bold">Scoring</legend>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sol-scoring" value="standard" ${options.scoring === 'standard' ? 'checked' : ''} />
              <span>Standard</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sol-scoring" value="vegas" ${options.scoring === 'vegas' ? 'checked' : ''} />
              <span>Vegas</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sol-scoring" value="none" ${options.scoring === 'none' ? 'checked' : ''} />
              <span>None</span>
            </label>
          </fieldset>

          <!-- Checkboxes -->
          <div class="space-y-1.5 pl-1">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="sol-opt-timed" ${options.timed ? 'checked' : ''} />
              <span>Timed game</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="sol-opt-status" ${options.statusBar ? 'checked' : ''} />
              <span>Status bar</span>
            </label>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-[#808080]">
            <button type="button" id="sol-opt-ok" class="retro-btn !px-4 !py-1 font-bold">OK</button>
            <button type="button" id="sol-opt-cancel" class="retro-btn !px-3 !py-1">Cancel</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(modal);

    const closeOpt = () => modal.remove();
    modal.querySelector('#sol-opt-close')?.addEventListener('click', closeOpt);
    modal.querySelector('#sol-opt-cancel')?.addEventListener('click', closeOpt);
    modal.querySelector('#sol-opt-ok')?.addEventListener('click', () => {
      const drawVal = parseInt((modal.querySelector('input[name="sol-draw"]:checked') as HTMLInputElement)?.value || '3', 10) as 1 | 3;
      const scorVal = (modal.querySelector('input[name="sol-scoring"]:checked') as HTMLInputElement)?.value as 'standard' | 'vegas' | 'none';
      const timedVal = (modal.querySelector('#sol-opt-timed') as HTMLInputElement)?.checked ?? true;
      const statusVal = (modal.querySelector('#sol-opt-status') as HTMLInputElement)?.checked ?? true;

      const needsRestart = drawVal !== options.drawMode || scorVal !== options.scoring;
      options = {
        drawMode: drawVal,
        scoring: scorVal,
        timed: timedVal,
        statusBar: statusVal,
      };
      saveOptions(options);
      audio.playClick();
      closeOpt();

      if (needsRestart) {
        initGame();
      } else {
        renderUI();
      }
    });
  };

  // Dialog: Help Topics
  const showHelpDialog = () => {
    const modal = document.createElement('div');
    modal.className = 'absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-2 select-none';
    modal.innerHTML = `
      <div class="retro-window p-1 w-[380px] max-w-[95vw] bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000]">
        <div class="retro-titlebar px-2 py-0.5 text-xs text-white font-bold flex justify-between items-center mb-2">
          <span>Solitaire Help Topics</span>
          <button type="button" class="retro-titlebar-btn !w-4 !h-4 text-[10px]" id="sol-help-close">✕</button>
        </div>
        <div class="p-3 text-xs font-mono text-black space-y-2.5 leading-relaxed max-h-[300px] overflow-y-auto">
          <p class="font-bold text-[#000080]">How to Play Klondike Solitaire:</p>
          <ul class="list-disc pl-4 space-y-1 text-[11px]">
            <li><strong>Objective:</strong> Build 4 foundation piles from Ace up to King in each suit (♠, ♥, ♦, ♣).</li>
            <li><strong>Tableau:</strong> Build columns down in alternating colors (e.g. Red Queen on Black King, Black 7 on Red 8).</li>
            <li><strong>Empty Columns:</strong> Can only be filled with a King or a sequence beginning with a King.</li>
            <li><strong>Stock:</strong> Click to draw 1 or 3 cards. When empty, click to recycle waste cards back into stock.</li>
            <li><strong>Controls:</strong> Drag and drop cards, or click a card to select it and click its destination. Double-click or right-click to send directly to Foundation!</li>
            <li><strong>Shortcuts:</strong> Press <strong>F2</strong> to deal a new game, <strong>Ctrl+Z</strong> to undo, <strong>Space</strong> to draw, and <strong>H</strong> for hints.</li>
          </ul>
          <div class="flex justify-end pt-2">
            <button type="button" id="sol-help-ok" class="retro-btn !px-4 !py-1 font-bold">OK</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(modal);
    modal.querySelector('#sol-help-close')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#sol-help-ok')?.addEventListener('click', () => modal.remove());
  };

  // Dialog: About Solitaire
  const showAboutDialog = () => {
    const modal = document.createElement('div');
    modal.className = 'absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-2 select-none';
    modal.innerHTML = `
      <div class="retro-window p-1 w-[320px] max-w-[95vw] bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000000]">
        <div class="retro-titlebar px-2 py-0.5 text-xs text-white font-bold flex justify-between items-center mb-2">
          <span>About Solitaire</span>
          <button type="button" class="retro-titlebar-btn !w-4 !h-4 text-[10px]" id="sol-about-close">✕</button>
        </div>
        <div class="p-3 text-xs font-mono text-black space-y-3">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🃏</span>
            <div>
              <p class="font-bold text-sm">Windows 95 Solitaire</p>
              <p class="text-[11px] text-gray-700">Version 4.0 (Authentic Web Edition)</p>
            </div>
          </div>
          <div class="border-t border-[#808080] pt-2 text-[11px] space-y-1 text-gray-800">
            <p>Original program designed by <strong>Wes Cherry</strong>.</p>
            <p>Original 16-color card deck by <strong>Susan Kare</strong>.</p>
            <p>Crafted for the <strong>Piush 95</strong> interactive desktop.</p>
          </div>
          <div class="flex justify-end pt-1">
            <button type="button" id="sol-about-ok" class="retro-btn !px-4 !py-1 font-bold">OK</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(modal);
    modal.querySelector('#sol-about-close')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#sol-about-ok')?.addEventListener('click', () => modal.remove());
  };

  const renderCardHtml = (card: Card, pile: string, cardIndex: number, colIndex?: number): string => {
    if (!card.faceUp) {
      return `
        <div
          class="w-12 sm:w-16 h-17 sm:h-22 rounded-[3px] shadow-[2px_2px_0px_#000000] cursor-pointer sol-card-back select-none relative overflow-hidden"
          data-pile="${pile}"
          data-cidx="${cardIndex}"
          ${colIndex !== undefined ? `data-col="${colIndex}"` : ''}
        >
          ${getCardBackSvg(currentCardBack)}
        </div>
      `;
    }

    const isSelected =
      selection &&
      selection.source === pile &&
      selection.col === colIndex &&
      cardIndex >= selection.cardIndex;

    const isHinted = activeHint && activeHint.sourceCardId === card.id;

    const color = card.isRed ? 'text-[#d00000]' : 'text-black';
    const label = getCardLabel(card.value);

    // Center graphics for face cards vs numbers
    let centerGraphic = `<span class="text-xl sm:text-2xl leading-none">${card.suit}</span>`;
    if (card.value === 11) {
      centerGraphic = `<div class="flex flex-col items-center leading-none"><span class="text-[10px] font-black">JACK</span><span class="text-base">${card.suit}</span></div>`;
    } else if (card.value === 12) {
      centerGraphic = `<div class="flex flex-col items-center leading-none"><span class="text-[10px] font-black">QUEEN</span><span class="text-base">${card.suit}</span></div>`;
    } else if (card.value === 13) {
      centerGraphic = `<div class="flex flex-col items-center leading-none"><span class="text-[10px] font-black">KING</span><span class="text-base">${card.suit}</span></div>`;
    }

    return `
      <div
        class="w-12 sm:w-16 h-17 sm:h-22 rounded-[3px] bg-white border ${
          isSelected
            ? 'border-yellow-400 ring-2 ring-yellow-400 -translate-y-1'
            : isHinted
            ? 'border-[#0000ff] ring-2 ring-[#0000ff] animate-pulse'
            : 'border-black'
        } shadow-[2px_2px_0px_#000000] p-1 flex flex-col justify-between cursor-pointer sol-card select-none relative transition-transform"
        data-card-id="${card.id}"
        data-pile="${pile}"
        data-cidx="${cardIndex}"
        ${colIndex !== undefined ? `data-col="${colIndex}"` : ''}
        draggable="true"
      >
        <!-- Top-left corner index -->
        <div class="flex flex-col items-center leading-none self-start ${color}">
          <span class="font-black text-xs sm:text-sm leading-none">${label}</span>
          <span class="text-[11px] sm:text-xs leading-none mt-0.5">${card.suit}</span>
        </div>

        <!-- Center symbol -->
        <div class="self-center ${color} select-none">
          ${centerGraphic}
        </div>

        <!-- Bottom-right corner index (inverted) -->
        <div class="flex flex-col items-center leading-none self-end rotate-180 ${color}">
          <span class="font-black text-xs sm:text-sm leading-none">${label}</span>
          <span class="text-[11px] sm:text-xs leading-none mt-0.5">${card.suit}</span>
        </div>
      </div>
    `;
  };

  const renderUI = () => {
    // Check if auto-complete can be offered
    const allTableauFaceUp = tableau.every((col) => col.every((c) => c.faceUp));
    const canAutoComplete = allTableauFaceUp && stock.length === 0 && !isWon;

    // Waste visible cards fanning:
    // In Draw 3, show up to 3 cards fanned horizontally
    const visibleWaste = options.drawMode === 3 ? waste.slice(-3) : waste.slice(-1);

    container.innerHTML = `
      <div class="flex flex-col h-full bg-[#008000] select-none font-mono text-black relative overflow-hidden">
        <!-- Windows 95 Menu Bar -->
        <div class="flex items-center gap-1 px-1.5 py-0.5 border-b border-[#808080] bg-[#c0c0c0] text-xs relative z-30">
          <!-- Game Menu -->
          <div class="relative group" id="sol-menu-game-parent">
            <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="sol-menu-game-btn">
              <span class="underline">G</span>ame
            </button>
            <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[170px] z-50 text-black text-xs" id="sol-game-dropdown">
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="sol-menu-deal">
                <span>Deal</span>
                <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">F2</span>
              </button>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between items-center" id="sol-menu-undo">
                <span>Undo</span>
                <span class="text-gray-600 group-hover:text-gray-300 text-[10px]">Ctrl+Z</span>
              </button>
              <div class="border-b border-[#808080] border-t border-white my-1"></div>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="sol-menu-deck">
                <span>Deck...</span>
              </button>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="sol-menu-options">
                <span>Options...</span>
              </button>
              <div class="border-b border-[#808080] border-t border-white my-1"></div>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="sol-menu-exit">
                <span>Exit</span>
              </button>
            </div>
          </div>

          <!-- Help Menu -->
          <div class="relative group" id="sol-menu-help-parent">
            <button type="button" class="px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded-none cursor-default font-normal" id="sol-menu-help-btn">
              <span class="underline">H</span>elp
            </button>
            <div class="hidden absolute top-full left-0 bg-[#c0c0c0] border-2 border-white shadow-[2px_2px_0px_#000000] py-0.5 min-w-[150px] z-50 text-black text-xs" id="sol-help-dropdown">
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="sol-menu-how">
                <span>Help Topics</span>
              </button>
              <div class="border-b border-[#808080] border-t border-white my-1"></div>
              <button type="button" class="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" id="sol-menu-about">
                <span>About Solitaire</span>
              </button>
            </div>
          </div>

          <!-- Quick Action Buttons in toolbar -->
          <div class="ml-auto flex items-center gap-1.5">
            <button type="button" class="retro-btn !py-0 !px-2 text-[11px] font-bold" id="sol-quick-undo" title="Undo (Ctrl+Z)">↶ Undo</button>
            <button type="button" class="retro-btn !py-0 !px-2 text-[11px] font-bold hidden sm:inline-block" id="sol-quick-hint" title="Hint (H)">💡 Hint</button>
            ${
              canAutoComplete
                ? `<button type="button" class="retro-btn !py-0 !px-2 text-[11px] font-bold bg-[#ffff99]" id="sol-quick-auto" title="Auto-complete remaining cards">⚡ Auto Finish</button>`
                : ''
            }
          </div>
        </div>

        <!-- Main Felt Game Arena -->
        <div class="flex-1 p-2 sm:p-3 overflow-y-auto overflow-x-hidden flex flex-col relative z-10">
          <!-- Canvas Waterfall for Victory Animation -->
          <canvas id="sol-victory-canvas" class="absolute inset-0 w-full h-full z-40 cursor-pointer pointer-events-auto" style="display: none;"></canvas>

          <!-- Top Row: Stock, Waste, and 4 Foundations -->
          <div class="flex justify-between items-start mb-4 max-w-[620px] w-full mx-auto">
            <!-- Stock and Waste -->
            <div class="flex gap-2 sm:gap-3 items-start">
              <!-- Stock Pile -->
              <div
                id="sol-stock"
                class="w-12 sm:w-16 h-17 sm:h-22 rounded-[3px] border-2 border-white/80 bg-white/5 flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000000] relative"
                title="Draw Cards"
              >
                ${
                  stock.length > 0
                    ? `<div class="w-full h-full">${getCardBackSvg(currentCardBack)}</div>`
                    : `<span class="text-white/70 text-2xl font-black">↺</span>`
                }
              </div>

              <!-- Waste Pile (Fanned in Draw 3) -->
              <div id="sol-waste" class="relative w-24 sm:w-28 h-17 sm:h-22">
                ${
                  visibleWaste.length > 0
                    ? visibleWaste
                        .map((card, idx) => {
                          const originalIndex = waste.length - visibleWaste.length + idx;
                          const offsetPx = idx * (options.drawMode === 3 ? 14 : 0);
                          return `
                            <div class="absolute top-0" style="left: ${offsetPx}px;">
                              ${renderCardHtml(card, 'waste', originalIndex)}
                            </div>
                          `;
                        })
                        .join('')
                    : `<div class="w-12 sm:w-16 h-17 sm:h-22 rounded-[3px] border-2 border-dashed border-white/40 flex items-center justify-center text-white/30 text-xs">Waste</div>`
                }
              </div>
            </div>

            <!-- 4 Foundations -->
            <div class="flex gap-1.5 sm:gap-2">
              ${foundations
                .map((fPile, idx) => {
                  const isHintTarget = activeHint && activeHint.targetFidx === idx;
                  return `
                    <div
                      class="w-12 sm:w-16 h-17 sm:h-22 rounded-[3px] border-2 ${
                        isHintTarget ? 'border-[#0000ff] ring-2 ring-[#0000ff] animate-pulse' : 'border-white/80'
                      } bg-white/10 flex items-center justify-center sol-foundation cursor-pointer relative"
                      data-fidx="${idx}"
                    >
                      ${
                        fPile.length > 0
                          ? renderCardHtml(fPile[fPile.length - 1], 'foundation', fPile.length - 1, idx)
                          : `<span class="text-white/50 text-xl font-bold select-none">${SUITS[idx]}</span>`
                      }
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>

          <!-- Tableau (7 Cascades) -->
          <div class="grid grid-cols-7 gap-1 sm:gap-2 flex-1 items-start max-w-[620px] w-full mx-auto min-h-[260px]">
            ${tableau
              .map((col, colIdx) => {
                const isHintCol = activeHint && activeHint.targetCol === colIdx;
                return `
                  <div
                    class="sol-col flex flex-col items-center min-h-[220px] cursor-pointer relative rounded-[3px] ${
                      isHintCol ? 'ring-2 ring-[#0000ff] bg-white/10' : ''
                    }"
                    data-col="${colIdx}"
                  >
                    ${
                      col.length === 0
                        ? `<div class="w-12 sm:w-16 h-17 sm:h-22 border-2 border-dashed border-white/40 rounded-[3px] flex items-center justify-center text-white/40 font-bold text-sm">K</div>`
                        : col
                            .map((card, cIdx) => {
                              // Face-down cards overlap tighter (-mt-13), face-up cards show rank/suit (-mt-10)
                              const overlapClass = cIdx === 0 ? '' : card.faceUp ? '-mt-12 sm:-mt-15' : '-mt-14 sm:-mt-17';
                              return `
                                <div class="${overlapClass} transition-all">
                                  ${renderCardHtml(card, 'tableau', cIdx, colIdx)}
                                </div>
                              `;
                            })
                            .join('')
                    }
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- Windows 95 Status Bar -->
        ${
          options.statusBar
            ? `
          <div class="flex items-center justify-between px-2 py-0.5 border-t border-white bg-[#c0c0c0] text-[11px] font-mono text-black relative z-30">
            <div class="border-t border-l border-[#808080] border-b border-r border-white px-2 py-0.5 min-w-[95px]" id="sol-status-score">
              Score: ${options.scoring === 'vegas' ? `$${score}` : score}
            </div>
            <div class="border-t border-l border-[#808080] border-b border-r border-white px-2 py-0.5 min-w-[80px]" id="sol-status-time">
              Time: ${seconds}
            </div>
            <div class="border-t border-l border-[#808080] border-b border-r border-white px-2 py-0.5 flex-1 ml-1 text-gray-700 hidden sm:block truncate" id="sol-status-tip">
              Klondike (${options.drawMode === 3 ? 'Draw 3' : 'Draw 1'}) • Press F2 for New Deal
            </div>
          </div>
        `
            : ''
        }
      </div>
    `;

    // Dropdown toggles
    const gameBtn = container.querySelector('#sol-menu-game-btn');
    const gameDrop = container.querySelector('#sol-game-dropdown');
    const helpBtn = container.querySelector('#sol-menu-help-btn');
    const helpDrop = container.querySelector('#sol-help-dropdown');

    const closeAllDrops = () => {
      gameDrop?.classList.add('hidden');
      helpDrop?.classList.add('hidden');
    };

    gameBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = gameDrop?.classList.contains('hidden');
      closeAllDrops();
      if (isHidden) gameDrop?.classList.remove('hidden');
    });

    helpBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = helpDrop?.classList.contains('hidden');
      closeAllDrops();
      if (isHidden) helpDrop?.classList.remove('hidden');
    });

    container.addEventListener('click', closeAllDrops);

    // Menu Item Actions
    container.querySelector('#sol-menu-deal')?.addEventListener('click', () => {
      closeAllDrops();
      initGame();
    });
    container.querySelector('#sol-menu-undo')?.addEventListener('click', () => {
      closeAllDrops();
      performUndo();
    });
    container.querySelector('#sol-quick-undo')?.addEventListener('click', performUndo);
    container.querySelector('#sol-quick-hint')?.addEventListener('click', provideHint);
    container.querySelector('#sol-quick-auto')?.addEventListener('click', performAutoFinish);

    container.querySelector('#sol-menu-deck')?.addEventListener('click', () => {
      closeAllDrops();
      showDeckDialog();
    });
    container.querySelector('#sol-menu-options')?.addEventListener('click', () => {
      closeAllDrops();
      showOptionsDialog();
    });
    container.querySelector('#sol-menu-how')?.addEventListener('click', () => {
      closeAllDrops();
      showHelpDialog();
    });
    container.querySelector('#sol-menu-about')?.addEventListener('click', () => {
      closeAllDrops();
      showAboutDialog();
    });
    container.querySelector('#sol-menu-exit')?.addEventListener('click', () => {
      closeAllDrops();
      win.close();
    });

    // Stock pile click
    container.querySelector('#sol-stock')?.addEventListener('click', drawCard);

    // Foundation target clicks (move selected card to foundation)
    container.querySelectorAll('.sol-foundation').forEach((el) => {
      el.addEventListener('click', () => {
        const fIdx = parseInt(el.getAttribute('data-fidx') || '0', 10);
        if (selection) {
          tryMoveToFoundation(fIdx);
        }
      });
    });

    // Tableau column clicks (for placing cards in empty space or top of column)
    container.querySelectorAll('.sol-col').forEach((el) => {
      el.addEventListener('click', (e) => {
        const colIdx = parseInt(el.getAttribute('data-col') || '0', 10);
        const target = e.target as HTMLElement;
        const cardEl = target.closest('.sol-card, .sol-card-back') as HTMLElement;

        if (!cardEl && selection) {
          tryMoveToTableau(colIdx);
        }
      });
    });

    // Cards click and double-click handling
    container.querySelectorAll('.sol-card, .sol-card-back').forEach((el) => {
      // Single click: select or move
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const pile = el.getAttribute('data-pile') as 'waste' | 'tableau' | 'foundation';
        const cidx = parseInt(el.getAttribute('data-cidx') || '0', 10);
        const colAttr = el.getAttribute('data-col');
        const colIdx = colAttr !== null ? parseInt(colAttr, 10) : undefined;

        // If clicking a face-down card at the top of a column, reveal it
        if (pile === 'tableau' && colIdx !== undefined) {
          const col = tableau[colIdx];
          if (cidx === col.length - 1 && !col[cidx].faceUp) {
            pushUndo();
            col[cidx].faceUp = true;
            if (options.scoring === 'standard') score += 5;
            audio.playClick();
            renderUI();
            return;
          }
        }

        if (selection) {
          if (pile === 'tableau' && colIdx !== undefined) {
            // Attempt to move selection onto this tableau column
            if (!tryMoveToTableau(colIdx)) {
              // If failed, change selection to this card if faceUp
              const col = tableau[colIdx];
              if (col[cidx]?.faceUp) {
                selection = { source: 'tableau', col: colIdx, cardIndex: cidx, cards: col.slice(cidx) };
                activeHint = null;
                audio.playClick();
                renderUI();
              }
            }
          } else if (pile === 'foundation' && colIdx !== undefined) {
            tryMoveToFoundation(colIdx);
          } else {
            selection = null;
            renderUI();
          }
        } else {
          // Select this card if faceUp
          if (pile === 'waste' && waste.length > 0) {
            selection = { source: 'waste', cardIndex: waste.length - 1, cards: [waste[waste.length - 1]] };
            activeHint = null;
            audio.playClick();
            renderUI();
          } else if (pile === 'tableau' && colIdx !== undefined) {
            const col = tableau[colIdx];
            if (col[cidx]?.faceUp) {
              selection = { source: 'tableau', col: colIdx, cardIndex: cidx, cards: col.slice(cidx) };
              activeHint = null;
              audio.playClick();
              renderUI();
            }
          } else if (pile === 'foundation' && colIdx !== undefined) {
            const fPile = foundations[colIdx];
            if (fPile.length > 0) {
              selection = { source: 'foundation', col: colIdx, cardIndex: fPile.length - 1, cards: [fPile[fPile.length - 1]] };
              activeHint = null;
              audio.playClick();
              renderUI();
            }
          }
        }
      });

      // Double-click / Auto-foundation
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const pile = el.getAttribute('data-pile');
        const colAttr = el.getAttribute('data-col');
        const colIdx = colAttr !== null ? parseInt(colAttr, 10) : undefined;

        if (pile === 'waste' && waste.length > 0) {
          tryAutoFoundation(waste[waste.length - 1]);
        } else if (pile === 'tableau' && colIdx !== undefined) {
          const col = tableau[colIdx];
          if (col.length > 0) {
            const topCard = col[col.length - 1];
            if (topCard.faceUp) {
              tryAutoFoundation(topCard, colIdx);
            }
          }
        }
      });

      // Right-click also sends to foundation (Windows 95 power user feature)
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pile = el.getAttribute('data-pile');
        const colAttr = el.getAttribute('data-col');
        const colIdx = colAttr !== null ? parseInt(colAttr, 10) : undefined;

        if (pile === 'waste' && waste.length > 0) {
          tryAutoFoundation(waste[waste.length - 1]);
        } else if (pile === 'tableau' && colIdx !== undefined) {
          const col = tableau[colIdx];
          if (col.length > 0 && col[col.length - 1].faceUp) {
            tryAutoFoundation(col[col.length - 1], colIdx);
          }
        }
      });

      // HTML5 Drag and Drop handlers
      el.addEventListener('dragstart', (e) => {
        const dragEvt = e as DragEvent;
        const pile = el.getAttribute('data-pile') as 'waste' | 'tableau' | 'foundation';
        const cidx = parseInt(el.getAttribute('data-cidx') || '0', 10);
        const colAttr = el.getAttribute('data-col');
        const colIdx = colAttr !== null ? parseInt(colAttr, 10) : undefined;

        if (pile === 'waste' && waste.length > 0) {
          selection = { source: 'waste', cardIndex: waste.length - 1, cards: [waste[waste.length - 1]] };
        } else if (pile === 'tableau' && colIdx !== undefined) {
          const col = tableau[colIdx];
          if (col[cidx]?.faceUp) {
            selection = { source: 'tableau', col: colIdx, cardIndex: cidx, cards: col.slice(cidx) };
          } else {
            dragEvt.preventDefault();
            return;
          }
        } else if (pile === 'foundation' && colIdx !== undefined) {
          const fPile = foundations[colIdx];
          if (fPile.length > 0) {
            selection = { source: 'foundation', col: colIdx, cardIndex: fPile.length - 1, cards: [fPile[fPile.length - 1]] };
          } else {
            dragEvt.preventDefault();
            return;
          }
        }

        if (selection && dragEvt.dataTransfer) {
          dragEvt.dataTransfer.setData('text/plain', JSON.stringify({ source: selection.source, col: selection.col }));
          dragEvt.dataTransfer.effectAllowed = 'move';
        }
      });
    });

    // Drag-over and drop on tableau columns and foundations
    container.querySelectorAll('.sol-col').forEach((colEl) => {
      colEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragEvt = e as DragEvent;
        if (dragEvt.dataTransfer) dragEvt.dataTransfer.dropEffect = 'move';
      });
      colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        const colIdx = parseInt(colEl.getAttribute('data-col') || '0', 10);
        if (selection) {
          tryMoveToTableau(colIdx);
        }
      });
    });

    container.querySelectorAll('.sol-foundation').forEach((fEl) => {
      fEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragEvt = e as DragEvent;
        if (dragEvt.dataTransfer) dragEvt.dataTransfer.dropEffect = 'move';
      });
      fEl.addEventListener('drop', (e) => {
        e.preventDefault();
        const fIdx = parseInt(fEl.getAttribute('data-fidx') || '0', 10);
        if (selection) {
          tryMoveToFoundation(fIdx);
        }
      });
    });

    // Victory canvas click to dismiss and deal
    const victoryCanvas = container.querySelector('#sol-victory-canvas');
    victoryCanvas?.addEventListener('click', () => {
      stopWinCascade();
      initGame();
    });
  };

  // Keyboard shortcut handler
  const keyHandler = (e: KeyboardEvent) => {
    // Only handle if Solitaire window is active/focused
    if (!win.element || !win.element.classList.contains('active-window')) {
      const isWithin = win.element?.contains(document.activeElement);
      if (!isWithin) return;
    }

    if (e.key === 'F2') {
      e.preventDefault();
      initGame();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      performUndo();
    } else if (e.key.toLowerCase() === 'u') {
      e.preventDefault();
      performUndo();
    } else if (e.key === ' ' || e.key.toLowerCase() === 'd') {
      e.preventDefault();
      drawCard();
    } else if (e.key.toLowerCase() === 'h') {
      e.preventDefault();
      provideHint();
    } else if (e.key.toLowerCase() === 'a') {
      e.preventDefault();
      performAutoFinish();
    }
  };

  window.addEventListener('keydown', keyHandler);

  win.element?.addEventListener('DOMNodeRemovedFromDocument', () => {
    stopTimer();
    stopWinCascade();
    window.removeEventListener('keydown', keyHandler);
  });

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
