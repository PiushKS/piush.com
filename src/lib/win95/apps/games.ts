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

  let rows = 9;
  let cols = 9;
  let totalMines = 10;
  let minesRemaining = totalMines;
  let seconds = 0;
  let timerId: number | null = null;
  let isGameOver = false;
  let isFirstClick = true;
  let touchFlagMode = false; // For mobile devices

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
      // Safe first click zone (safeR, safeC)
      if ((Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) || grid[r][c].isMine) continue;
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
    if (r < 0 || r >= rows || c < 0 || c >= cols || isGameOver) return;
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
      audio.playError();
      revealAllMines();
      setSmiley('😵');
      renderBoard();
      return;
    }

    audio.playClick();

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
      cell.isFlagged = true;
      minesRemaining--;
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

  const chordCell = (r: number, c: number) => {
    const cell = grid[r][c];
    if (!cell.isRevealed || cell.neighborMines === 0 || isGameOver) return;

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
      alert(`🎉 Victory! Minesweeper cleared in ${seconds} seconds!`);
    }
  };

  const setSmiley = (face: string) => {
    const sm = container.querySelector('#mine-smiley');
    if (sm) sm.textContent = face;
  };

  const NUMBER_COLORS: Record<number, string> = {
    1: '#0000ff',
    2: '#008000',
    3: '#ff0000',
    4: '#000080',
    5: '#800000',
    6: '#008080',
    7: '#000000',
    8: '#808080',
  };

  const renderBoard = () => {
    const boardEl = container.querySelector('#mine-grid-container');
    if (!boardEl) return;

    boardEl.innerHTML = '';
    const table = document.createElement('div');
    table.className = 'grid border-2 border-[#808080] border-t-black border-l-black inline-block select-none';
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
          if (touchFlagMode) {
            toggleFlag(r, c);
          } else if (cell.isRevealed) {
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
        <div class="flex items-center justify-between w-full max-w-sm mb-2 text-xs">
          <div class="flex gap-1">
            <button type="button" class="retro-btn !py-0.5 !px-2 ${cols === 9 ? 'font-bold is-active' : ''}" id="m-diff-easy">Beginner</button>
            <button type="button" class="retro-btn !py-0.5 !px-2 ${cols === 16 ? 'font-bold is-active' : ''}" id="m-diff-med">Intermediate</button>
            <button type="button" class="retro-btn !py-0.5 !px-2 ${cols === 30 ? 'font-bold is-active' : ''}" id="m-diff-hard">Expert</button>
          </div>
          <!-- Mobile flag mode toggle -->
          <button type="button" class="retro-btn !py-0.5 !px-2 font-bold text-xs" id="m-toggle-mode">
            Mode: ${touchFlagMode ? '🚩 Flag' : '⛏️ Dig'}
          </button>
        </div>

        <!-- LCD Status Header -->
        <div class="flex items-center justify-between w-full max-w-sm bg-[#c0c0c0] border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white p-2 mb-2">
          <!-- Mine Counter -->
          <div class="bg-black text-red-600 font-black text-xl px-2 py-0.5 border border-gray-600 tracking-wider font-mono" id="mine-count">
            ${String(minesRemaining).padStart(3, '0')}
          </div>

          <!-- Smiley Reset Button -->
          <button type="button" class="retro-btn size-8 text-lg font-bold flex items-center justify-center" id="mine-smiley">
            🙂
          </button>

          <!-- Timer -->
          <div class="bg-black text-red-600 font-black text-xl px-2 py-0.5 border border-gray-600 tracking-wider font-mono" id="mine-timer">
            ${String(seconds).padStart(3, '0')}
          </div>
        </div>

        <!-- Board Grid -->
        <div id="mine-grid-container" class="overflow-auto max-w-full max-h-[380px]"></div>

        <div class="text-[10px] text-gray-700 mt-2 text-center">
          Left-click: Reveal • Right-click (or Mode): Flag • Click number: Chord
        </div>
      </div>
    `;

    container.querySelector('#mine-smiley')?.addEventListener('click', initGame);

    container.querySelector('#m-diff-easy')?.addEventListener('click', () => {
      rows = 9; cols = 9; totalMines = 10; initGame();
    });
    container.querySelector('#m-diff-med')?.addEventListener('click', () => {
      rows = 16; cols = 16; totalMines = 40; initGame();
    });
    container.querySelector('#m-diff-hard')?.addEventListener('click', () => {
      rows = 16; cols = 30; totalMines = 99; initGame();
    });

    container.querySelector('#m-toggle-mode')?.addEventListener('click', () => {
      touchFlagMode = !touchFlagMode;
      const btn = container.querySelector('#m-toggle-mode');
      if (btn) btn.textContent = `Mode: ${touchFlagMode ? '🚩 Flag' : '⛏️ Dig'}`;
      audio.playClick();
    });

    renderBoard();
  };

  initGame();

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    stopTimer();
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
                    ? renderCardHtml(card, 'freecell', idx, selected && selected.source === 'freecell' && selected.index === idx)
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
                      const isSel = isTop && selected && selected.source === 'cascade' && selected.index === colIdx;
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
