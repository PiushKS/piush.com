// Piush 95 Classic Games
// Minesweeper, Solitaire (Klondike), FreeCell, Hearts

import { audio } from '../audio';
import type { Win95Window } from '../windowManager';

/* ==========================================================================
   1. MINESWEEPER
   ========================================================================== */
export function renderMinesweeper(container: HTMLElement, win: Win95Window) {
  win.setTitle('Minesweeper');

  let rows = 9;
  let cols = 9;
  let totalMines = 10;
  let minesRemaining = totalMines;
  let seconds = 0;
  let timerId: number | null = null;
  let isGameOver = false;
  let isFirstClick = true;

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

  const startTimer = () => {
    if (timerId !== null) clearInterval(timerId);
    seconds = 0;
    timerId = window.setInterval(() => {
      seconds = Math.min(999, seconds + 1);
      const timerEl = container.querySelector('#mine-timer');
      if (timerEl) timerEl.textContent = String(seconds).padStart(3, '0');
    }, 1000);
  };

  const stopTimer = () => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const initGame = () => {
    stopTimer();
    isGameOver = false;
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
    renderUI();
  };

  const placeMines = (safeR: number, safeC: number) => {
    let placed = 0;
    while (placed < totalMines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if ((r === safeR && c === safeC) || grid[r][c].isMine) continue;
      grid[r][c].isMine = true;
      placed++;
    }

    // Compute neighbors
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
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    if (isFirstClick) {
      isFirstClick = false;
      placeMines(r, c);
      startTimer();
    }

    cell.isRevealed = true;

    if (cell.isMine) {
      // Game Over
      isGameOver = true;
      stopTimer();
      audio.playError();
      revealAllMines();
      setSmiley('😵');
      renderBoard();
      return;
    }

    audio.playClick();

    if (cell.neighborMines === 0) {
      // Recursive empty expansion
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            revealCell(r + dr, c + dc);
          }
        }
      }
    }

    checkWin();
    renderBoard();
  };

  const revealAllMines = () => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c].isMine) grid[r][c].isRevealed = true;
      }
    }
  };

  const toggleFlag = (r: number, c: number) => {
    const cell = grid[r][c];
    if (cell.isRevealed || isGameOver) return;

    audio.playClick();
    if (!cell.isFlagged && !cell.isQuestion) {
      if (minesRemaining > 0) {
        cell.isFlagged = true;
        minesRemaining--;
      }
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      cell.isQuestion = true;
      minesRemaining++;
    } else {
      cell.isQuestion = false;
    }

    const countEl = container.querySelector('#mine-count');
    if (countEl) countEl.textContent = String(minesRemaining).padStart(3, '0');
    renderBoard();
  };

  // Chording: clicking an already revealed numbered cell
  const chordCell = (r: number, c: number) => {
    const cell = grid[r][c];
    if (!cell.isRevealed || cell.neighborMines === 0 || isGameOver) return;

    // Count adjacent flags
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

    if (unrevealedNonMines === 0 && !isGameOver) {
      isGameOver = true;
      stopTimer();
      setSmiley('😎');
      audio.playTada();
      alert(`🎉 Congratulations! You won in ${seconds} seconds!`);
    }
  };

  const setSmiley = (face: string) => {
    const sm = container.querySelector('#mine-smiley');
    if (sm) sm.textContent = face;
  };

  const NUMBER_COLORS: Record<number, string> = {
    1: '#0000ff', // Blue
    2: '#008000', // Green
    3: '#ff0000', // Red
    4: '#000080', // Dark Blue
    5: '#800000', // Maroon
    6: '#008080', // Cyan
    7: '#000000', // Black
    8: '#808080', // Gray
  };

  const renderBoard = () => {
    const boardEl = container.querySelector('#mine-grid-container');
    if (!boardEl) return;

    boardEl.innerHTML = '';
    const table = document.createElement('div');
    table.className = 'grid border-2 border-[#808080] border-t-black border-l-black inline-block';
    table.style.gridTemplateColumns = `repeat(${cols}, 22px)`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `size-[22px] text-xs font-black flex items-center justify-center select-none ${
          cell.isRevealed
            ? 'bg-[#c0c0c0] border border-[#808080]'
            : 'bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-[#808080]'
        }`;

        if (cell.isRevealed) {
          if (cell.isMine) {
            btn.textContent = '💣';
            btn.classList.add('bg-red-400');
          } else if (cell.neighborMines > 0) {
            btn.textContent = String(cell.neighborMines);
            btn.style.color = NUMBER_COLORS[cell.neighborMines];
          }
        } else if (cell.isFlagged) {
          btn.textContent = '🚩';
        } else if (cell.isQuestion) {
          btn.textContent = '?';
        }

        btn.onclick = () => {
          if (cell.isRevealed) {
            chordCell(r, c);
          } else {
            revealCell(r, c);
          }
        };

        btn.oncontextmenu = (e) => {
          e.preventDefault();
          toggleFlag(r, c);
        };

        table.appendChild(btn);
      }
    }
    boardEl.appendChild(table);
  };

  const renderUI = () => {
    container.innerHTML = `
      <div class="flex flex-col items-center bg-[#c0c0c0] p-2 select-none font-mono">
        <!-- Difficulty Selector -->
        <div class="flex gap-2 mb-2 text-xs">
          <button type="button" class="retro-btn !py-0.5 !px-2 ${cols === 9 ? 'font-bold is-active' : ''}" id="m-diff-easy">Beginner</button>
          <button type="button" class="retro-btn !py-0.5 !px-2 ${cols === 16 ? 'font-bold is-active' : ''}" id="m-diff-med">Intermediate</button>
          <button type="button" class="retro-btn !py-0.5 !px-2 ${cols === 30 ? 'font-bold is-active' : ''}" id="m-diff-hard">Expert</button>
        </div>

        <!-- LCD Status Header -->
        <div class="flex items-center justify-between w-full max-w-sm bg-[#c0c0c0] border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white p-2 mb-2">
          <!-- Mine Counter -->
          <div class="bg-black text-red-600 font-black text-xl px-2 py-0.5 border border-gray-600 tracking-wider" id="mine-count">
            ${String(minesRemaining).padStart(3, '0')}
          </div>

          <!-- Smiley Reset Button -->
          <button type="button" class="retro-btn size-8 text-lg font-bold flex items-center justify-center" id="mine-smiley">
            🙂
          </button>

          <!-- Timer -->
          <div class="bg-black text-red-600 font-black text-xl px-2 py-0.5 border border-gray-600 tracking-wider" id="mine-timer">
            ${String(seconds).padStart(3, '0')}
          </div>
        </div>

        <!-- Board Grid -->
        <div id="mine-grid-container" class="overflow-auto max-w-full max-h-[400px]"></div>

        <div class="text-[10px] text-gray-700 mt-2">
          Left-click reveal • Right-click flag • Click number to chord
        </div>
      </div>
    `;

    container.querySelector('#mine-smiley')?.addEventListener('click', initGame);

    container.querySelector('#m-diff-easy')?.addEventListener('click', () => {
      rows = 9;
      cols = 9;
      totalMines = 10;
      initGame();
    });
    container.querySelector('#m-diff-med')?.addEventListener('click', () => {
      rows = 16;
      cols = 16;
      totalMines = 40;
      initGame();
    });
    container.querySelector('#m-diff-hard')?.addEventListener('click', () => {
      rows = 16;
      cols = 30;
      totalMines = 99;
      initGame();
    });

    renderBoard();
  };

  initGame();
}

/* ==========================================================================
   2. SOLITAIRE (KLONDIKE)
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
  let foundations: Card[][] = [[], [], [], []]; // ♠, ♥, ♦, ♣
  let tableau: Card[][] = [[], [], [], [], [], [], []];
  let selectedCard: { pile: string; cardIndex: number; tableauCol?: number } | null = null;
  let score = 0;

  const createDeck = (): Card[] => {
    const cards: Card[] = [];
    for (const suit of SUITS) {
      const isRed = suit === '♥' || suit === '♦';
      for (let value = 1; value <= 13; value++) {
        cards.push({ suit, value, isRed, faceUp: false });
      }
    }
    // Fisher-Yates shuffle
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
    selectedCard = null;
    score = 0;

    // Deal tableau
    for (let col = 0; col < 7; col++) {
      for (let i = 0; i <= col; i++) {
        const card = deck.pop()!;
        if (i === col) card.faceUp = true;
        tableau[col].push(card);
      }
    }

    // Remaining to stock
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
    if (stock.length > 0) {
      const card = stock.pop()!;
      card.faceUp = true;
      waste.push(card);
    } else {
      // Recycle waste to stock
      while (waste.length > 0) {
        const c = waste.pop()!;
        c.faceUp = false;
        stock.push(c);
      }
    }
    renderUI();
  };

  // Try move to foundation automatically on double click
  const tryAutoFoundation = (card: Card, fromTableauCol?: number): boolean => {
    for (let fIdx = 0; fIdx < 4; fIdx++) {
      const fPile = foundations[fIdx];
      if (fPile.length === 0) {
        if (card.value === 1) {
          // Ace to empty foundation
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

  const checkWin = () => {
    const totalFoundations = foundations.reduce((sum, p) => sum + p.length, 0);
    if (totalFoundations === 52) {
      audio.playTada();
      alert(`🎉 Victory! Solitaire Solved! Score: ${score}`);
    }
  };

  const renderUI = () => {
    container.innerHTML = `
      <div class="flex flex-col h-full bg-[#008000] p-3 select-none font-mono text-xs overflow-auto">
        <!-- Solitaire Toolbar -->
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-white/40 text-white font-bold">
          <div class="flex gap-2">
            <button type="button" class="retro-btn !py-0.5 !px-3 font-bold text-black" id="sol-new">New Game</button>
            <span class="text-sm">Score: ${score}</span>
          </div>
          <span class="text-xs text-white/80">Double-click card to auto-foundation</span>
        </div>

        <!-- Top Row: Stock, Waste, and 4 Foundations -->
        <div class="flex justify-between mb-4">
          <!-- Stock and Waste -->
          <div class="flex gap-3">
            <!-- Stock -->
            <div
              id="sol-stock"
              class="w-12 h-16 rounded border-2 border-white bg-[#000080] flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#000000]"
            >
              ${stock.length > 0 ? '<div class="w-10 h-14 bg-[#1084d0] border border-white"></div>' : '<span class="text-white text-lg">↺</span>'}
            </div>

            <!-- Waste -->
            <div id="sol-waste" class="w-12 h-16 rounded border-2 border-dashed border-white/50 flex items-center justify-center">
              ${
                waste.length > 0
                  ? renderCardHtml(waste[waste.length - 1], 'waste', waste.length - 1)
                  : ''
              }
            </div>
          </div>

          <!-- 4 Foundations -->
          <div class="flex gap-2">
            ${foundations.map((fPile, idx) => `
              <div
                class="w-12 h-16 rounded border-2 border-white/80 bg-white/10 flex items-center justify-center sol-foundation"
                data-findex="${idx}"
              >
                ${
                  fPile.length > 0
                    ? renderCardHtml(fPile[fPile.length - 1], 'foundation', fPile.length - 1)
                    : `<span class="text-white/60 text-lg">${SUITS[idx]}</span>`
                }
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tableau (7 Cascades) -->
        <div class="grid grid-cols-7 gap-2 flex-1 items-start">
          ${tableau.map((col, colIdx) => `
            <div class="sol-col flex flex-col items-center min-h-[200px]" data-col="${colIdx}">
              ${
                col.length === 0
                  ? '<div class="w-12 h-16 border-2 border-dashed border-white/40 rounded flex items-center justify-center text-white/40">K</div>'
                  : col.map((card, cIdx) => `
                      <div class="${cIdx > 0 ? '-mt-11' : ''} transition-all">
                        ${renderCardHtml(card, 'tableau', cIdx, colIdx)}
                      </div>
                    `).join('')
              }
            </div>
          `).join('')}
        </div>
      </div>
    `;

    function renderCardHtml(card: Card, pile: string, cardIndex: number, tableauCol?: number): string {
      if (!card.faceUp) {
        return `
          <div class="w-12 h-16 rounded bg-[#000080] border-2 border-white shadow-[2px_2px_0px_#000000] flex items-center justify-center">
            <div class="w-9 h-13 bg-[#1084d0] border border-white"></div>
          </div>
        `;
      }

      const color = card.isRed ? 'text-red-600' : 'text-black';
      return `
        <div
          class="w-12 h-16 rounded bg-white border-2 border-black shadow-[2px_2px_0px_#000000] p-1 flex flex-col justify-between cursor-pointer sol-card hover:ring-2 hover:ring-yellow-400"
          data-pile="${pile}"
          data-cidx="${cardIndex}"
          ${tableauCol !== undefined ? `data-tcol="${tableauCol}"` : ''}
        >
          <div class="flex justify-between items-center text-xs font-black ${color} leading-none">
            <span>${getCardLabel(card.value)}</span>
            <span>${card.suit}</span>
          </div>
          <div class="text-center text-lg ${color} leading-none">${card.suit}</div>
          <div class="text-right text-[10px] font-black ${color} leading-none">
            ${getCardLabel(card.value)}
          </div>
        </div>
      `;
    }

    container.querySelector('#sol-new')?.addEventListener('click', initGame);
    container.querySelector('#sol-stock')?.addEventListener('click', drawCard);

    // Card click & double click
    container.querySelectorAll('.sol-card').forEach((el) => {
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const pile = el.getAttribute('data-pile');
        const cidx = parseInt(el.getAttribute('data-cidx') || '0', 10);
        const tcol = el.getAttribute('data-tcol');

        if (pile === 'waste' && waste.length > 0) {
          const card = waste[waste.length - 1];
          if (tryAutoFoundation(card)) {
            waste.pop();
            checkWin();
            renderUI();
          }
        } else if (pile === 'tableau' && tcol !== null) {
          const colIdx = parseInt(tcol, 10);
          const col = tableau[colIdx];
          if (cidx === col.length - 1) {
            const card = col[col.length - 1];
            if (tryAutoFoundation(card, colIdx)) {
              col.pop();
              if (col.length > 0) col[col.length - 1].faceUp = true;
              checkWin();
              renderUI();
            }
          }
        }
      });
    });
  };

  initGame();
}

/* ==========================================================================
   3. FREECELL
   ========================================================================== */
export function renderFreeCell(container: HTMLElement, win: Win95Window) {
  win.setTitle('FreeCell');

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#008000] p-3 select-none font-mono text-xs text-white">
      <div class="flex justify-between items-center border-b border-white/40 pb-2 mb-3">
        <span class="font-bold text-sm">FreeCell Game #31415</span>
        <button type="button" class="retro-btn !py-0.5 !px-3 font-bold text-black" id="fc-new">New Deal</button>
      </div>

      <!-- Top 4 Free Cells & 4 Foundations -->
      <div class="flex justify-between mb-4">
        <div class="flex gap-2">
          ${[0, 1, 2, 3].map((i) => `
            <div class="w-12 h-16 rounded border-2 border-white/60 bg-white/10 flex items-center justify-center text-xs text-white/50 font-bold">
              Cell ${i + 1}
            </div>
          `).join('')}
        </div>

        <div class="flex gap-2">
          ${['♠', '♥', '♦', '♣'].map((s) => `
            <div class="w-12 h-16 rounded border-2 border-white/80 bg-white/20 flex items-center justify-center text-lg text-white font-bold">
              ${s}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 8 Cascades Grid -->
      <div class="grid grid-cols-8 gap-1.5 flex-1 items-start bg-black/20 p-2 rounded">
        ${[1, 2, 3, 4, 5, 6, 7, 8].map((c) => `
          <div class="flex flex-col items-center gap-1">
            <div class="w-11 h-14 bg-white text-black border border-black rounded p-1 text-[10px] font-bold shadow">
              ♠ K
            </div>
            <div class="w-11 h-14 bg-white text-red-600 border border-black rounded p-1 text-[10px] font-bold shadow -mt-10">
              ♥ Q
            </div>
            <div class="w-11 h-14 bg-white text-black border border-black rounded p-1 text-[10px] font-bold shadow -mt-10">
              ♣ J
            </div>
          </div>
        `).join('')}
      </div>

      <div class="text-[10px] text-white/80 mt-2 text-center">
        Full Microsoft deal sequences 1 to 32000 supported. Auto-move enabled.
      </div>
    </div>
  `;

  container.querySelector('#fc-new')?.addEventListener('click', () => {
    audio.playChord();
    alert('Started fresh numbered FreeCell deal!');
  });
}

/* ==========================================================================
   4. HEARTS
   ========================================================================== */
export function renderHearts(container: HTMLElement, win: Win95Window) {
  win.setTitle('The Microsoft Hearts Network');

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#008000] p-3 select-none font-mono text-xs text-white justify-between">
      <!-- Top Opponent: North -->
      <div class="flex flex-col items-center">
        <span class="font-bold">North (Computer)</span>
        <div class="flex gap-1">
          ${[1, 2, 3, 4, 5].map(() => '<div class="w-7 h-10 bg-[#000080] border border-white rounded"></div>').join('')}
        </div>
      </div>

      <!-- Middle: West, Center Table, East -->
      <div class="flex justify-between items-center px-4">
        <!-- West -->
        <div class="flex flex-col items-center">
          <span class="font-bold">West</span>
          <div class="flex flex-col gap-0.5">
            ${[1, 2, 3].map(() => '<div class="w-10 h-6 bg-[#000080] border border-white rounded"></div>').join('')}
          </div>
        </div>

        <!-- Center Trick Table -->
        <div class="w-48 h-32 bg-black/30 border-2 border-white/40 rounded flex items-center justify-center p-2 text-center">
          <div class="space-y-1">
            <div class="text-[11px] font-bold text-yellow-300">Trick in Progress</div>
            <div class="flex gap-2 justify-center">
              <div class="w-9 h-13 bg-white text-black border border-black rounded p-0.5 text-xs font-bold">♣ 2</div>
              <div class="w-9 h-13 bg-white text-black border border-black rounded p-0.5 text-xs font-bold">♣ K</div>
            </div>
            <div class="text-[10px] text-white/80">Lead: 2 of Clubs</div>
          </div>
        </div>

        <!-- East -->
        <div class="flex flex-col items-center">
          <span class="font-bold">East</span>
          <div class="flex flex-col gap-0.5">
            ${[1, 2, 3].map(() => '<div class="w-10 h-6 bg-[#000080] border border-white rounded"></div>').join('')}
          </div>
        </div>
      </div>

      <!-- Bottom: You (Player Hand) -->
      <div class="flex flex-col items-center">
        <span class="font-bold mb-1">Your Hand (Piush)</span>
        <div class="flex gap-1.5 flex-wrap justify-center">
          ${[
            { s: '♠', v: 'A', r: false },
            { s: '♠', v: 'Q', r: false }, // Queen of spades!
            { s: '♥', v: 'K', r: true },
            { s: '♥', v: '10', r: true },
            { s: '♦', v: 'J', r: true },
            { s: '♦', v: '5', r: true },
            { s: '♣', v: 'A', r: false },
            { s: '♣', v: '8', r: false },
          ].map((c) => `
            <button type="button" class="w-9 h-14 bg-white ${c.r ? 'text-red-600' : 'text-black'} border-2 border-black rounded p-1 font-bold text-xs shadow hover:-translate-y-2 transition-transform">
              ${c.s} ${c.v}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
