// Piush 95 - Productivity Collection
// Calendar, Clock & Alarms, Sticky Notes, To-Do List, File Search, Help, Run Dialog

import { audio } from '../audio';
import { vfs } from '../fs';
import { windowManager, type Win95Window } from '../windowManager';

/**
 * 1. Calendar - Interactive Event Planner & Scheduler
 */
export function renderCalendar(container: HTMLElement, win: Win95Window) {
  win.setTitle('Calendar 95');

  interface CalEvent {
    id: string;
    dateStr: string; // YYYY-MM-DD
    time: string;
    title: string;
  }

  let currentDate = new Date();
  let selectedDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  const defaultEvents: CalEvent[] = [
    { id: 'ev-1', dateStr: selectedDateStr, time: '09:00 AM', title: 'System Architecture Review' },
    { id: 'ev-2', dateStr: selectedDateStr, time: '02:00 PM', title: '550 Quiz Database Benchmark' },
    { id: 'ev-3', dateStr: selectedDateStr, time: '04:30 PM', title: 'Piush 95 Web Desktop Deployment' },
  ];

  let events: CalEvent[] = [];
  try {
    const saved = localStorage.getItem('win95_calendar_events');
    events = saved ? JSON.parse(saved) : defaultEvents;
  } catch (_) {
    events = defaultEvents;
  }

  function saveEvents() {
    try {
      localStorage.setItem('win95_calendar_events', JSON.stringify(events));
      const summary = events.map(e => `[${e.dateStr} ${e.time}] ${e.title}`).join('\n');
      vfs.writeFile('C:\\My Documents\\calendar.txt', summary);
    } catch (_) {}
  }

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
      <!-- Top Navigation & Jump -->
      <div class="flex items-center justify-between pb-1 border-b border-black/30">
        <div class="flex items-center gap-1">
          <button id="cal-prev" class="retro-btn !py-0.5 !px-2 text-xs font-bold" title="Previous Month">◀</button>
          <button id="cal-today" class="retro-btn !py-0.5 !px-2 text-xs font-bold" title="Jump to Today">Today</button>
          <button id="cal-next" class="retro-btn !py-0.5 !px-2 text-xs font-bold" title="Next Month">▶</button>
        </div>
        <span id="cal-month-year" class="text-xs font-bold text-blue-900 tracking-wide">...</span>
      </div>

      <!-- Main Layout: Calendar Grid on Left, Day Schedule on Right -->
      <div class="flex-1 flex gap-2 overflow-hidden">
        <!-- Left: Month Grid -->
        <div class="w-1/2 flex flex-col retro-inset p-2 bg-white">
          <div class="grid grid-cols-7 text-center font-bold text-[11px] border-b border-black pb-1">
            <span class="text-red-600">Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div id="cal-days" class="grid grid-cols-7 gap-1 text-center text-xs flex-1 pt-1.5 auto-rows-fr"></div>
        </div>

        <!-- Right: Day Agenda & Event Creator -->
        <div class="w-1/2 flex flex-col retro-inset p-2 bg-white overflow-hidden">
          <div class="flex items-center justify-between border-b border-black pb-1 mb-1">
            <span class="text-[11px] font-bold text-blue-900" id="cal-selected-day-title">Schedule</span>
            <span class="text-[10px] text-gray-500" id="cal-event-count">0 items</span>
          </div>

          <!-- Events List for Selected Day -->
          <div id="cal-events-list" class="flex-1 overflow-auto space-y-1 text-xs select-text"></div>

          <!-- Add Event Form -->
          <div class="pt-2 border-t border-gray-300 space-y-1">
            <div class="flex gap-1">
              <input type="text" id="cal-event-time" value="10:00 AM" class="retro-inset w-18 px-1 py-0.5 text-[11px]" />
              <input type="text" id="cal-event-title" placeholder="New event title..." class="retro-inset flex-1 px-1.5 py-0.5 text-[11px]" />
            </div>
            <button id="cal-add-event-btn" class="retro-btn !py-0.5 w-full font-bold text-xs">Add Event to Day</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const monthYearEl = container.querySelector('#cal-month-year') as HTMLElement;
  const daysEl = container.querySelector('#cal-days') as HTMLElement;
  const prevBtn = container.querySelector('#cal-prev');
  const nextBtn = container.querySelector('#cal-next');
  const todayBtn = container.querySelector('#cal-today');
  const selectedDayTitle = container.querySelector('#cal-selected-day-title') as HTMLElement;
  const eventCountEl = container.querySelector('#cal-event-count') as HTMLElement;
  const eventsListEl = container.querySelector('#cal-events-list') as HTMLElement;
  const timeInput = container.querySelector('#cal-event-time') as HTMLInputElement;
  const titleInput = container.querySelector('#cal-event-title') as HTMLInputElement;
  const addBtn = container.querySelector('#cal-add-event-btn');

  function renderDayEvents() {
    if (!eventsListEl) return;
    const dayEvs = events.filter(e => e.dateStr === selectedDateStr);
    if (selectedDayTitle) selectedDayTitle.textContent = `Schedule: ${selectedDateStr}`;
    if (eventCountEl) eventCountEl.textContent = `${dayEvs.length} events`;

    if (dayEvs.length === 0) {
      eventsListEl.innerHTML = '<div class="text-gray-400 italic text-[11px] p-2">No events scheduled for this day.</div>';
      return;
    }

    eventsListEl.innerHTML = dayEvs.map(e => `
      <div class="flex items-center justify-between p-1 bg-yellow-50 border border-yellow-200 rounded text-[11px]">
        <div class="truncate flex-1">
          <strong class="text-blue-900">${e.time}</strong>
          <span class="ml-1">${e.title}</span>
        </div>
        <button class="cal-del-event text-red-600 hover:text-red-900 font-bold px-1 ml-1" data-id="${e.id}">✕</button>
      </div>
    `).join('');

    eventsListEl.querySelectorAll('.cal-del-event').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        events = events.filter(ev => ev.id !== id);
        saveEvents();
        audio.playClick();
        renderDayEvents();
        renderCalendarGrid();
      });
    });
  }

  function renderCalendarGrid() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (monthYearEl) {
      monthYearEl.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    daysEl.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
      daysEl.innerHTML += '<div></div>';
    }

    const today = new Date();
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = dateStr === selectedDateStr;
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      const hasEvents = events.some(e => e.dateStr === dateStr);

      const cell = document.createElement('div');
      cell.className = `p-1 cursor-pointer flex flex-col items-center justify-center rounded text-xs relative ${
        isSelected ? 'bg-[#000080] text-white font-bold' : isToday ? 'bg-blue-100 font-bold' : 'hover:bg-gray-200'
      }`;
      cell.textContent = String(d);

      if (hasEvents) {
        const dot = document.createElement('span');
        dot.className = `size-1 rounded-full absolute bottom-0.5 ${isSelected ? 'bg-yellow-300' : 'bg-blue-600'}`;
        cell.appendChild(dot);
      }

      cell.onclick = () => {
        selectedDateStr = dateStr;
        audio.playClick();
        renderCalendarGrid();
        renderDayEvents();
      };
      daysEl.appendChild(cell);
    }
  }

  prevBtn?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendarGrid();
    audio.playClick();
  });

  nextBtn?.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendarGrid();
    audio.playClick();
  });

  todayBtn?.addEventListener('click', () => {
    currentDate = new Date();
    selectedDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    renderCalendarGrid();
    renderDayEvents();
    audio.playClick();
  });

  addBtn?.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const time = timeInput.value.trim() || '12:00 PM';
    if (!title) return;

    events.push({
      id: 'ev-' + Date.now(),
      dateStr: selectedDateStr,
      time,
      title,
    });
    saveEvents();
    titleInput.value = '';
    audio.playDing();
    renderDayEvents();
    renderCalendarGrid();
  });

  titleInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBtn?.dispatchEvent(new MouseEvent('click'));
  });

  renderCalendarGrid();
  renderDayEvents();
}

/**
 * 2. Clock & Alarms - Real Analog Clock, Stopwatch, World Time & Alarm
 */
export function renderClockAlarms(container: HTMLElement, win: Win95Window) {
  win.setTitle('Clock & Alarms 95');

  let activeTab: 'clock' | 'world' | 'stopwatch' | 'alarm' = 'clock';
  let is24Hour = false;
  let alarmEnabled = false;
  let alarmTime = '08:00 AM';
  let alarmTriggered = false;

  // Stopwatch state
  let swInterval: number | null = null;
  let swElapsed = 0;
  let laps: string[] = [];

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Tabs -->
      <div class="flex gap-1 p-2 bg-[#c0c0c0] border-b border-black">
        <button class="retro-btn !py-0.5 !px-2.5 font-bold" id="clk-tab-clock">Clock</button>
        <button class="retro-btn !py-0.5 !px-2.5" id="clk-tab-world">World Time</button>
        <button class="retro-btn !py-0.5 !px-2.5" id="clk-tab-stopwatch">Stopwatch</button>
        <button class="retro-btn !py-0.5 !px-2.5" id="clk-tab-alarm">Alarm</button>
      </div>

      <!-- Tab Content Area -->
      <div class="flex-1 p-3 overflow-auto" id="clk-tab-content">
        <!-- 1. Analog & Digital Clock Tab -->
        <div id="clk-view-clock" class="flex flex-col items-center justify-center space-y-2 h-full">
          <canvas id="clk-analog-canvas" width="160" height="160" class="block"></canvas>
          <div class="retro-inset px-4 py-1.5 bg-black text-center border-2 border-white shadow-inner">
            <div id="clk-digital-time" class="text-2xl font-bold text-green-400 tracking-wider">00:00:00</div>
            <div id="clk-digital-date" class="text-[11px] text-green-300 mt-0.5">...</div>
          </div>
          <div class="flex items-center gap-2 pt-1 text-xs">
            <label class="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" id="clk-toggle-24h" />
              <span>24-Hour Format</span>
            </label>
          </div>
        </div>

        <!-- 2. World Time Tab -->
        <div id="clk-view-world" class="hidden space-y-2 text-xs">
          <div class="text-[11px] font-bold text-blue-900 border-b pb-1">Global Developer Hubs:</div>
          ${[
            { city: 'San Francisco (PST)', tz: 'America/Los_Angeles' },
            { city: 'New York (EST)', tz: 'America/New_York' },
            { city: 'London (GMT)', tz: 'Europe/London' },
            { city: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
            { city: 'New Delhi (IST)', tz: 'Asia/Kolkata' },
          ].map(loc => `
            <div class="flex items-center justify-between p-1.5 retro-inset bg-white">
              <span class="font-bold">${loc.city}</span>
              <span class="text-blue-900 font-mono font-bold world-clock-val" data-tz="${loc.tz}">...</span>
            </div>
          `).join('')}
        </div>

        <!-- 3. Stopwatch Tab -->
        <div id="clk-view-stopwatch" class="hidden flex flex-col h-full space-y-2">
          <div class="retro-inset p-3 bg-black text-center border-2 border-white">
            <span id="sw-display" class="font-bold text-3xl text-cyan-400">00:00.00</span>
          </div>
          <div class="flex justify-center gap-2">
            <button id="sw-start" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Start</button>
            <button id="sw-stop" class="retro-btn !py-0.5 !px-3 text-xs">Stop</button>
            <button id="sw-lap" class="retro-btn !py-0.5 !px-3 text-xs">Lap</button>
            <button id="sw-reset" class="retro-btn !py-0.5 !px-3 text-xs">Reset</button>
          </div>
          <div class="flex-1 retro-inset p-2 bg-white overflow-auto text-xs font-mono space-y-0.5">
            <div class="font-bold border-b pb-1">Lap Splits:</div>
            <div id="sw-laps-list" class="space-y-0.5 text-[11px]"></div>
          </div>
        </div>

        <!-- 4. Alarm Tab -->
        <div id="clk-view-alarm" class="hidden space-y-3 text-xs">
          <div class="retro-inset p-3 bg-[#d0d0d0] space-y-2">
            <div class="font-bold text-sm">System Audio Alarm:</div>
            <div class="flex items-center gap-2">
              <label class="font-bold">Set Time:</label>
              <input type="text" id="alarm-time-input" value="08:00 AM" class="retro-inset px-2 py-0.5 bg-white text-xs w-28 font-bold" />
              <label class="flex items-center gap-1.5 cursor-pointer ml-auto font-bold">
                <input type="checkbox" id="alarm-enable-chk" />
                <span>Alarm Enabled</span>
              </label>
            </div>
            <div class="text-[11px] text-gray-700">
              When triggered, an authentic 880Hz square buzzer alert sounds.
            </div>
            <button id="alarm-test-btn" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Test Alarm Buzzer</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#clk-analog-canvas') as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d');
  const digiTime = container.querySelector('#clk-digital-time') as HTMLElement;
  const digiDate = container.querySelector('#clk-digital-date') as HTMLElement;
  const chk24 = container.querySelector('#clk-toggle-24h') as HTMLInputElement;

  const tabClock = container.querySelector('#clk-tab-clock');
  const tabWorld = container.querySelector('#clk-tab-world');
  const tabStopwatch = container.querySelector('#clk-tab-stopwatch');
  const tabAlarm = container.querySelector('#clk-tab-alarm');

  const viewClock = container.querySelector('#clk-view-clock') as HTMLElement;
  const viewWorld = container.querySelector('#clk-view-world') as HTMLElement;
  const viewStopwatch = container.querySelector('#clk-view-stopwatch') as HTMLElement;
  const viewAlarm = container.querySelector('#clk-view-alarm') as HTMLElement;

  function switchTab(t: 'clock' | 'world' | 'stopwatch' | 'alarm') {
    activeTab = t;
    audio.playClick();
    [tabClock, tabWorld, tabStopwatch, tabAlarm].forEach(b => b?.classList.remove('font-bold', '!bg-[#c0c0c0]'));
    [viewClock, viewWorld, viewStopwatch, viewAlarm].forEach(v => v.classList.add('hidden'));

    if (t === 'clock') {
      tabClock?.classList.add('font-bold', '!bg-[#c0c0c0]');
      viewClock.classList.remove('hidden');
    } else if (t === 'world') {
      tabWorld?.classList.add('font-bold', '!bg-[#c0c0c0]');
      viewWorld.classList.remove('hidden');
      updateWorldTimes();
    } else if (t === 'stopwatch') {
      tabStopwatch?.classList.add('font-bold', '!bg-[#c0c0c0]');
      viewStopwatch.classList.remove('hidden');
    } else if (t === 'alarm') {
      tabAlarm?.classList.add('font-bold', '!bg-[#c0c0c0]');
      viewAlarm.classList.remove('hidden');
    }
  }

  tabClock?.addEventListener('click', () => switchTab('clock'));
  tabWorld?.addEventListener('click', () => switchTab('world'));
  tabStopwatch?.addEventListener('click', () => switchTab('stopwatch'));
  tabAlarm?.addEventListener('click', () => switchTab('alarm'));

  chk24?.addEventListener('change', () => {
    is24Hour = chk24.checked;
    updateClocks();
  });

  function drawAnalogClock(now: Date) {
    if (!ctx || !canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer Bezel
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 12 Hour ticks
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const x1 = cx + Math.sin(angle) * (radius - 8);
      const y1 = cy - Math.cos(angle) * (radius - 8);
      const x2 = cx + Math.sin(angle) * (radius - 2);
      const y2 = cy - Math.cos(angle) * (radius - 2);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = i % 3 === 0 ? 3 : 1.5;
      ctx.stroke();
    }

    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Hour Hand
    const hourAngle = (hours * Math.PI) / 6 + (minutes * Math.PI) / 360;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.sin(hourAngle) * (radius * 0.5), cy - Math.cos(hourAngle) * (radius * 0.5));
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Minute Hand
    const minAngle = (minutes * Math.PI) / 30 + (seconds * Math.PI) / 1800;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.sin(minAngle) * (radius * 0.72), cy - Math.cos(minAngle) * (radius * 0.72));
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Second Hand (Red)
    const secAngle = (seconds * Math.PI) / 30;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.sin(secAngle) * (radius * 0.85), cy - Math.cos(secAngle) * (radius * 0.85));
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center pivot
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
  }

  function updateClocks() {
    const now = new Date();
    drawAnalogClock(now);

    if (digiTime) {
      digiTime.textContent = now.toLocaleTimeString('en-US', { hour12: !is24Hour });
    }
    if (digiDate) {
      digiDate.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Check alarm
    if (alarmEnabled && !alarmTriggered) {
      const curAlarmStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      if (curAlarmStr.toLowerCase() === alarmTime.trim().toLowerCase()) {
        alarmTriggered = true;
        audio.playAlarmBuzzer();
        alert(`ALARM CLOCK 95!\n\nScheduled time reached: ${alarmTime}`);
      }
    }
  }

  function updateWorldTimes() {
    container.querySelectorAll('.world-clock-val').forEach(el => {
      const tz = el.getAttribute('data-tz');
      if (tz) {
        try {
          el.textContent = new Date().toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (_) {}
      }
    });
  }

  // Stopwatch controls
  const swDisplay = container.querySelector('#sw-display') as HTMLElement;
  const swStart = container.querySelector('#sw-start');
  const swStop = container.querySelector('#sw-stop');
  const swLap = container.querySelector('#sw-lap');
  const swReset = container.querySelector('#sw-reset');
  const swLapsList = container.querySelector('#sw-laps-list') as HTMLElement;

  swStart?.addEventListener('click', () => {
    if (swInterval) return;
    audio.playClick();
    const start = Date.now() - swElapsed;
    swInterval = window.setInterval(() => {
      swElapsed = Date.now() - start;
      const min = Math.floor(swElapsed / 60000);
      const sec = Math.floor((swElapsed % 60000) / 1000);
      const cs = Math.floor((swElapsed % 1000) / 10);
      if (swDisplay) swDisplay.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
    }, 20);
  });

  swStop?.addEventListener('click', () => {
    if (swInterval) {
      clearInterval(swInterval);
      swInterval = null;
      audio.playClick();
    }
  });

  swLap?.addEventListener('click', () => {
    if (!swDisplay) return;
    laps.unshift(`Lap ${laps.length + 1}: ${swDisplay.textContent}`);
    audio.playClick();
    if (swLapsList) {
      swLapsList.innerHTML = laps.map(l => `<div class="border-b border-gray-200 py-0.5">${l}</div>`).join('');
    }
  });

  swReset?.addEventListener('click', () => {
    if (swInterval) {
      clearInterval(swInterval);
      swInterval = null;
    }
    swElapsed = 0;
    laps = [];
    if (swDisplay) swDisplay.textContent = '00:00.00';
    if (swLapsList) swLapsList.innerHTML = '';
    audio.playClick();
  });

  // Alarm settings
  const alarmInput = container.querySelector('#alarm-time-input') as HTMLInputElement;
  const alarmChk = container.querySelector('#alarm-enable-chk') as HTMLInputElement;
  const alarmTestBtn = container.querySelector('#alarm-test-btn');

  alarmChk?.addEventListener('change', () => {
    alarmEnabled = alarmChk.checked;
    alarmTriggered = false;
    audio.playClick();
  });

  alarmInput?.addEventListener('change', () => {
    alarmTime = alarmInput.value.trim();
  });

  alarmTestBtn?.addEventListener('click', () => {
    audio.playAlarmBuzzer();
  });

  const clockInterval = setInterval(() => {
    updateClocks();
    if (activeTab === 'world') updateWorldTimes();
  }, 1000);

  updateClocks();

  win.element.addEventListener('DOMNodeRemovedFromDocument', () => {
    clearInterval(clockInterval);
    if (swInterval) clearInterval(swInterval);
  });
}

/**
 * 3. Sticky Notes - Multi-Note Desktop Memo System
 */
export function renderStickyNotes(container: HTMLElement, win: Win95Window) {
  win.setTitle('Sticky Note 95');

  interface Note {
    id: string;
    color: string;
    text: string;
  }

  const colors = [
    { name: 'Yellow', bg: '#ffff88', border: '#cccc55' },
    { name: 'Sky Blue', bg: '#cceeff', border: '#99ccee' },
    { name: 'Soft Pink', bg: '#ffccee', border: '#ee99cc' },
    { name: 'Mint Green', bg: '#ccffcc', border: '#99ee99' },
  ];

  let notes: Note[] = [
    { id: '1', color: '#ffff88', text: 'Production Systems Checklist:\n- iOS Swift concurrency migration\n- Distributed edge cache validation\n- 550 Quiz challenges passed (100%)\n- Windows 95 desktop fully interactive' },
  ];

  try {
    const saved = localStorage.getItem('win95_sticky_notes');
    if (saved) notes = JSON.parse(saved);
  } catch (_) {}

  let activeNoteIdx = 0;

  function save() {
    try {
      localStorage.setItem('win95_sticky_notes', JSON.stringify(notes));
      const cur = notes[activeNoteIdx];
      if (cur) {
        vfs.writeFile(`C:\\My Documents\\Notes\\sticky_${cur.id}.txt`, cur.text);
      }
    } catch (_) {}
  }

  function render() {
    const cur = notes[activeNoteIdx] || notes[0];
    container.innerHTML = `
      <div class="flex flex-col h-full text-black font-mono select-text p-2 transition-colors duration-150" style="background-color: ${cur.color};">
        <!-- Header Bar -->
        <div class="flex justify-between items-center pb-1 border-b border-black/20 text-[10px] select-none">
          <div class="flex items-center gap-1 font-bold">
            <span>📝 NOTE [${activeNoteIdx + 1}/${notes.length}]</span>
            <button id="note-prev-btn" class="retro-btn !py-0 !px-1.5 text-[9px]" title="Previous Note">◀</button>
            <button id="note-next-btn" class="retro-btn !py-0 !px-1.5 text-[9px]" title="Next Note">▶</button>
            <button id="note-new-btn" class="retro-btn !py-0 !px-1.5 text-[9px] font-bold text-blue-900" title="Add Note">+</button>
            <button id="note-del-btn" class="retro-btn !py-0 !px-1.5 text-[9px] text-red-700" title="Delete Note">✕</button>
          </div>
          <div class="flex items-center gap-1">
            ${colors.map(c => `
              <button class="size-3.5 border border-black/40 rounded-sm note-color-btn" style="background-color: ${c.bg};" data-color="${c.bg}" title="${c.name}"></button>
            `).join('')}
          </div>
        </div>

        <!-- Note Text Body -->
        <textarea id="note-body" class="flex-1 bg-transparent border-none outline-none resize-none p-1 text-xs font-mono leading-relaxed mt-1" placeholder="Type your thoughts, tasks, or code notes here...">${cur.text}</textarea>

        <!-- Footer -->
        <div class="flex justify-between items-center pt-1 border-t border-black/10 text-[9px] text-gray-700 select-none">
          <span id="note-char-count">${cur.text.length} chars</span>
          <span>Auto-saved to VFS & localStorage</span>
        </div>
      </div>
    `;

    const body = container.querySelector('#note-body') as HTMLTextAreaElement;
    const charCount = container.querySelector('#note-char-count') as HTMLElement;

    body?.addEventListener('input', () => {
      notes[activeNoteIdx].text = body.value;
      if (charCount) charCount.textContent = `${body.value.length} chars`;
      save();
    });

    container.querySelector('#note-prev-btn')?.addEventListener('click', () => {
      activeNoteIdx = (activeNoteIdx - 1 + notes.length) % notes.length;
      audio.playClick();
      render();
    });

    container.querySelector('#note-next-btn')?.addEventListener('click', () => {
      activeNoteIdx = (activeNoteIdx + 1) % notes.length;
      audio.playClick();
      render();
    });

    container.querySelector('#note-new-btn')?.addEventListener('click', () => {
      const newId = String(Date.now());
      notes.push({ id: newId, color: '#ffff88', text: 'New Note' });
      activeNoteIdx = notes.length - 1;
      save();
      audio.playDing();
      render();
    });

    container.querySelector('#note-del-btn')?.addEventListener('click', () => {
      if (notes.length > 1) {
        notes.splice(activeNoteIdx, 1);
        activeNoteIdx = Math.max(0, activeNoteIdx - 1);
        save();
        audio.playClick();
        render();
      } else {
        notes[0].text = '';
        save();
        audio.playClick();
        render();
      }
    });

    container.querySelectorAll('.note-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const col = btn.getAttribute('data-color') || '#ffff88';
        notes[activeNoteIdx].color = col;
        save();
        audio.playClick();
        render();
      });
    });
  }

  render();
}

/**
 * 4. To-Do List - Priority Task Manager with VFS Sync
 */
export function renderTodoList(container: HTMLElement, win: Win95Window) {
  win.setTitle('Task List 95');

  interface Todo {
    id: string;
    text: string;
    priority: 'high' | 'med' | 'low';
    done: boolean;
  }

  let todos: Todo[] = [
    { id: '1', text: 'Deploy resilient cloud microservice architecture', priority: 'high', done: true },
    { id: '2', text: 'Ship interactive Windows 95 desktop experience', priority: 'high', done: true },
    { id: '3', text: 'Verify 550 developer quiz questions (0 errors)', priority: 'high', done: true },
    { id: '4', text: 'Implement rich multimedia & retro games suite', priority: 'med', done: true },
    { id: '5', text: 'Explore Swift 6 strict concurrency migration', priority: 'low', done: false },
  ];

  try {
    const saved = localStorage.getItem('win95_todos');
    if (saved) todos = JSON.parse(saved);
  } catch (_) {}

  let filter: 'all' | 'pending' | 'completed' = 'all';

  function save() {
    try {
      localStorage.setItem('win95_todos', JSON.stringify(todos));
      const summary = todos.map(t => `[${t.done ? 'X' : ' '}] (${t.priority.toUpperCase()}) ${t.text}`).join('\n');
      vfs.writeFile('C:\\My Documents\\tasks.txt', summary);
    } catch (_) {}
  }

  function render() {
    container.innerHTML = `
      <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-2">
        <!-- New Task Bar -->
        <div class="flex gap-1.5">
          <select id="todo-prio" class="retro-select !py-0.5 !px-1 text-xs">
            <option value="high">🔴 High</option>
            <option value="med" selected>🟡 Med</option>
            <option value="low">🟢 Low</option>
          </select>
          <input type="text" id="todo-input" placeholder="Type new task..." class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs" />
          <button id="todo-add-btn" class="retro-btn !py-0.5 !px-3 font-bold text-xs">Add</button>
        </div>

        <!-- Filter Bar -->
        <div class="flex items-center justify-between text-xs pb-1 border-b border-black/30">
          <div class="flex gap-1">
            <button class="retro-btn !py-0 !px-2 text-[10px] ${filter === 'all' ? 'font-bold !bg-[#c0c0c0]' : ''}" id="todo-flt-all">All (${todos.length})</button>
            <button class="retro-btn !py-0 !px-2 text-[10px] ${filter === 'pending' ? 'font-bold !bg-[#c0c0c0]' : ''}" id="todo-flt-pending">Pending</button>
            <button class="retro-btn !py-0 !px-2 text-[10px] ${filter === 'completed' ? 'font-bold !bg-[#c0c0c0]' : ''}" id="todo-flt-comp">Completed</button>
          </div>
          <button id="todo-clear-done" class="retro-btn !py-0 !px-2 text-[10px] text-gray-700">Clear Done</button>
        </div>

        <!-- Items Container -->
        <div class="retro-inset bg-white p-2 flex-1 overflow-auto">
          <div id="todo-items" class="space-y-1 text-xs"></div>
        </div>

        <!-- Bottom Actions -->
        <div class="flex items-center justify-between pt-1 border-t border-white text-xs">
          <span class="text-[11px] text-gray-600">${todos.filter(t => !t.done).length} remaining</span>
          <button id="todo-export-vfs" class="retro-btn !py-0.5 !px-3 font-bold text-xs text-blue-900">💾 Export to VFS</button>
        </div>
      </div>
    `;

    const input = container.querySelector('#todo-input') as HTMLInputElement;
    const prio = container.querySelector('#todo-prio') as HTMLSelectElement;
    const addBtn = container.querySelector('#todo-add-btn');
    const itemsEl = container.querySelector('#todo-items') as HTMLElement;

    const filtered = todos.filter(t => {
      if (filter === 'pending') return !t.done;
      if (filter === 'completed') return t.done;
      return true;
    });

    itemsEl.innerHTML = '';
    if (filtered.length === 0) {
      itemsEl.innerHTML = '<div class="text-gray-400 italic text-[11px] p-2">No tasks in this category.</div>';
    } else {
      filtered.forEach((t) => {
        const pColor = t.priority === 'high' ? 'text-red-600' : t.priority === 'med' ? 'text-amber-600' : 'text-emerald-600';
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-1 hover:bg-gray-100 border-b border-gray-100';
        item.innerHTML = `
          <label class="flex items-center gap-2 cursor-pointer flex-1">
            <input type="checkbox" ${t.done ? 'checked' : ''} data-id="${t.id}" class="todo-chk" />
            <span class="text-[10px] font-bold ${pColor}">[${t.priority.toUpperCase()}]</span>
            <span class="${t.done ? 'line-through text-gray-400' : 'text-black'}">${t.text}</span>
          </label>
          <button class="text-red-600 hover:text-red-900 font-bold px-1 todo-del-btn" data-id="${t.id}">✕</button>
        `;
        itemsEl.appendChild(item);
      });
    }

    // Add task
    addBtn?.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;
      todos.push({
        id: String(Date.now()),
        text,
        priority: (prio.value as 'high' | 'med' | 'low') || 'med',
        done: false,
      });
      save();
      audio.playClick();
      render();
    });

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addBtn?.dispatchEvent(new MouseEvent('click'));
    });

    // Checkbox toggles
    itemsEl.querySelectorAll('.todo-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        const target = todos.find(t => t.id === id);
        if (target) {
          target.done = (e.target as HTMLInputElement).checked;
          save();
          audio.playClick();
          render();
        }
      });
    });

    // Delete buttons
    itemsEl.querySelectorAll('.todo-del-btn').forEach(del => {
      del.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        todos = todos.filter(t => t.id !== id);
        save();
        audio.playClick();
        render();
      });
    });

    // Filters
    container.querySelector('#todo-flt-all')?.addEventListener('click', () => { filter = 'all'; render(); });
    container.querySelector('#todo-flt-pending')?.addEventListener('click', () => { filter = 'pending'; render(); });
    container.querySelector('#todo-flt-comp')?.addEventListener('click', () => { filter = 'completed'; render(); });

    container.querySelector('#todo-clear-done')?.addEventListener('click', () => {
      todos = todos.filter(t => !t.done);
      save();
      audio.playClick();
      render();
    });

    container.querySelector('#todo-export-vfs')?.addEventListener('click', () => {
      save();
      audio.playTada();
      alert('Tasks successfully exported to "C:\\My Documents\\tasks.txt"!');
    });
  }

  render();
}

/**
 * 5. File Search - Find Files or Folders Across VFS
 */
export function renderFileSearch(container: HTMLElement, win: Win95Window) {
  win.setTitle('Find: All Files');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <!-- Search Fields -->
      <div class="space-y-2 text-xs">
        <div class="flex items-center gap-2">
          <label class="font-bold w-18">Named:</label>
          <input type="text" id="find-name" value="*.txt" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs" />
        </div>
        <div class="flex items-center gap-2">
          <label class="font-bold w-18">Containing:</label>
          <input type="text" id="find-content" placeholder="(Optional text within file...)" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs" />
        </div>
        <div class="flex items-center gap-2">
          <label class="font-bold w-18">Look in:</label>
          <select id="find-scope" class="retro-select flex-1 px-2 py-0.5 text-xs font-mono">
            <option value="C:\\">Drive C: (Local Hard Drive)</option>
            <option value="C:\\PIUSH">C:\\PIUSH (Engineering Documents)</option>
            <option value="C:\\My Documents">C:\\My Documents (User Files)</option>
            <option value="C:\\WINDOWS">C:\\WINDOWS (System Configuration)</option>
          </select>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-2 border-b border-black pb-2">
        <button id="find-now-btn" class="retro-btn !py-0.5 !px-4 font-bold text-xs">Find Now</button>
        <button id="find-new-btn" class="retro-btn !py-0.5 !px-3 text-xs">New Search</button>
      </div>

      <!-- Results Grid -->
      <div class="flex-1 flex flex-col space-y-1">
        <div class="flex justify-between items-center text-xs font-bold">
          <span>Search Results:</span>
          <span id="find-status" class="text-gray-600 font-normal">Ready</span>
        </div>
        <div class="retro-inset flex-1 bg-white p-2 overflow-auto">
          <div id="find-results" class="space-y-1 text-xs"></div>
        </div>
      </div>
    </div>
  `;

  const nameInput = container.querySelector('#find-name') as HTMLInputElement;
  const contentInput = container.querySelector('#find-content') as HTMLInputElement;
  const scopeSelect = container.querySelector('#find-scope') as HTMLSelectElement;
  const findBtn = container.querySelector('#find-now-btn');
  const newBtn = container.querySelector('#find-new-btn');
  const resultsEl = container.querySelector('#find-results') as HTMLElement;
  const statusEl = container.querySelector('#find-status') as HTMLElement;

  function doSearch() {
    audio.playClick();
    const pattern = nameInput.value.trim().toLowerCase().replace(/\*/g, '');
    const contentQuery = contentInput.value.trim().toLowerCase();
    const scope = scopeSelect.value.toUpperCase();

    if (statusEl) statusEl.textContent = 'Searching...';

    // Search through VFS
    const all = vfs.searchFiles('');
    const matches = all.filter(item => {
      // Scope match
      if (!item.path.toUpperCase().startsWith(scope)) return false;
      // Name match
      if (pattern && !item.name.toLowerCase().includes(pattern)) return false;
      // Content match
      if (contentQuery && (!item.content || !item.content.toLowerCase().includes(contentQuery))) return false;
      return true;
    });

    if (matches.length === 0) {
      resultsEl.innerHTML = '<span class="text-gray-400 italic">No files matching criteria found.</span>';
      if (statusEl) statusEl.textContent = '0 items found';
    } else {
      if (statusEl) statusEl.textContent = `${matches.length} file(s) found`;
      resultsEl.innerHTML = matches.map(m => `
        <div class="flex items-center justify-between p-1 hover:bg-[#000080] hover:text-white cursor-pointer border-b border-gray-100 find-item" data-path="${m.path}">
          <div class="flex items-center gap-1.5 truncate">
            <span>${m.name.endsWith('.txt') ? '📄' : m.name.endsWith('.bmp') ? '🖼️' : '💾'}</span>
            <span class="font-bold">${m.name}</span>
          </div>
          <span class="text-[10px] text-gray-500">${m.path} (${m.size || 0} B)</span>
        </div>
      `).join('');

      resultsEl.querySelectorAll('.find-item').forEach(row => {
        row.addEventListener('dblclick', () => {
          const p = row.getAttribute('data-path');
          if (!p) return;
          audio.playClick();
          const launcher = (window as unknown as { launchWin95App?: (id: string) => void }).launchWin95App;
          if (launcher) {
            if (p.endsWith('.txt') || p.endsWith('.bat') || p.endsWith('.sys') || p.endsWith('.ini')) {
              launcher('notepad');
            } else if (p.endsWith('.rtf') || p.endsWith('.doc')) {
              launcher('wordpad');
            } else if (p.endsWith('.bmp') || p.endsWith('.png')) {
              launcher('paint');
            } else {
              launcher('notepad');
            }
          }
        });
      });
    }
  }

  findBtn?.addEventListener('click', doSearch);
  nameInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
  contentInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  newBtn?.addEventListener('click', () => {
    nameInput.value = '*.*';
    contentInput.value = '';
    resultsEl.innerHTML = '';
    if (statusEl) statusEl.textContent = 'Ready';
    audio.playClick();
  });
}

/**
 * 6. Windows 95 Help System - Searchable Documentation
 */
export function renderHelpSystem(container: HTMLElement, win: Win95Window) {
  win.setTitle('Windows 95 Help Topics');

  const articles: Record<string, { title: string; category: string; body: string }> = {
    welcome: {
      category: 'General',
      title: 'Welcome to Piush 95',
      body: 'Piush 95 is a fully interactive, historically authentic Windows 95 operating environment running right in your web browser.\n\nEvery program in the Start Menu is interactive: Notepad, WordPad, Paint, Calculator, Minesweeper, Solitaire, 3D Pinball, Media Player, CD Player, Sound Recorder, and the MS-DOS prompt!',
    },
    multitasking: {
      category: 'Windows',
      title: 'Running Multiple Applications',
      body: 'You can open multiple windows simultaneously. Drag windows by their titlebars, resize them, maximize to fill the screen, or minimize them down to the Windows 95 taskbar at the bottom.',
    },
    vfs: {
      category: 'Storage',
      title: 'Virtual Filesystem (VFS)',
      body: 'Piush 95 contains a complete client-side Virtual Filesystem mapped to drive C:. Files saved in WordPad, Notepad, Paint, or Sound Recorder persist in localStorage and are accessible via Windows Explorer and MS-DOS.',
    },
    audio: {
      category: 'Multimedia',
      title: 'Web Audio Synthesis',
      body: 'All system sound effects (Click, Chord, Ding, Tada, Error, DTMF phone dialing, and the authentic 56K modem handshake) are synthesized on-the-fly using the Web Audio API with zero external audio assets.',
    },
    games: {
      category: 'Games',
      title: 'Playable Retro Games Suite',
      body: 'Enjoy full implementations of Minesweeper, Solitaire, FreeCell, Hearts, 3D Pinball Space Cadet, Snake, Chess, Brick Breaker, Space Defender, Tic-Tac-Toe, Memory Match, Reversi, 2048, and Falling Blocks!',
    },
    quiz: {
      category: 'Portfolio',
      title: '550 Developer Quiz Questions',
      body: 'Piush.com features 550 verified, categorized technical questions covering Swift, Kotlin, React, Python, Cloud Architecture, System Design, and more.',
    },
    portfolio: {
      category: 'Portfolio',
      title: 'Portfolio Engineering Bio',
      body: 'Crafted by Piush KS, Senior Mobile & Cloud Architect with 8+ years experience building mission-critical apps for 10M+ users globally.',
    },
  };

  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none">
      <!-- Tabs -->
      <div class="flex gap-1 p-2 bg-[#c0c0c0] border-b border-black">
        <button class="retro-btn !py-0.5 !px-3 font-bold !bg-[#c0c0c0]" id="help-tab-contents">Contents</button>
        <button class="retro-btn !py-0.5 !px-3" id="help-tab-find">Find</button>
      </div>

      <div class="flex-1 flex overflow-hidden">
        <!-- Topics list -->
        <div class="w-52 bg-white retro-inset m-2 p-2 overflow-auto text-xs space-y-1">
          <div class="font-bold border-b pb-1 text-blue-900">Help Topics:</div>
          <div id="help-topics-container" class="space-y-0.5">
            ${Object.keys(articles).map(key => `
              <div class="help-topic hover:bg-[#000080] hover:text-white p-1 cursor-pointer truncate" data-topic="${key}">
                📖 ${articles[key].title}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Topic body -->
        <div class="flex-1 bg-white retro-inset m-2 ml-0 p-3 overflow-auto text-xs select-text leading-relaxed">
          <div id="help-content">
            <h2 class="text-sm font-bold text-blue-900 border-b pb-1 mb-2">${articles.welcome.title}</h2>
            <p class="whitespace-pre-wrap">${articles.welcome.body}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const contentEl = container.querySelector('#help-content') as HTMLElement;
  container.querySelectorAll('.help-topic').forEach((el) => {
    el.addEventListener('click', () => {
      const topic = el.getAttribute('data-topic');
      if (topic && articles[topic]) {
        audio.playClick();
        contentEl.innerHTML = `
          <h2 class="text-sm font-bold text-blue-900 border-b pb-1 mb-2">${articles[topic].title}</h2>
          <p class="whitespace-pre-wrap">${articles[topic].body}</p>
        `;
      }
    });
  });
}

/**
 * 7. Run Dialog - Windows 95 Command Dispatcher
 */
export function renderRunDialog(container: HTMLElement, win: Win95Window) {
  win.setTitle('Run');
  container.innerHTML = `
    <div class="flex flex-col h-full bg-[#c0c0c0] text-black font-mono select-none p-3 space-y-3">
      <div class="flex items-start gap-3">
        <span class="text-3xl">🏃</span>
        <p class="text-xs leading-tight">
          Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
        </p>
      </div>

      <div class="flex items-center gap-2 text-xs">
        <label class="font-bold">Open:</label>
        <input type="text" id="run-cmd" value="cmd" class="retro-inset flex-1 px-2 py-0.5 bg-white text-xs font-mono" autofocus />
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-white">
        <button id="run-ok-btn" class="retro-btn !py-0.5 !px-4 font-bold text-xs">OK</button>
        <button id="run-cancel-btn" class="retro-btn !py-0.5 !px-3 text-xs">Cancel</button>
      </div>
    </div>
  `;

  const cmdInput = container.querySelector('#run-cmd') as HTMLInputElement;
  const okBtn = container.querySelector('#run-ok-btn');
  const cancelBtn = container.querySelector('#run-cancel-btn');

  function execute() {
    const cmd = cmdInput.value.trim().toLowerCase();
    win.close();
    audio.playClick();

    const globalLauncher = (window as unknown as { launchWin95App?: (id: string) => void }).launchWin95App;
    if (globalLauncher) {
      const commandMap: Record<string, string> = {
        cmd: 'dos',
        dos: 'dos',
        command: 'dos',
        notepad: 'notepad',
        wordpad: 'wordpad',
        calc: 'calc',
        calculator: 'calc',
        paint: 'paint',
        pbrush: 'paint',
        pinball: 'pinball',
        minesweeper: 'minesweeper',
        winmine: 'minesweeper',
        sol: 'solitaire',
        solitaire: 'solitaire',
        freecell: 'freecell',
        hearts: 'hearts',
        snake: 'snake',
        chess: 'chess',
        explorer: 'explorer',
        control: 'controlpanel',
        scandisk: 'scandisk',
        defrag: 'defrag',
        taskmgr: 'taskmanager',
        sysinfo: 'sysinfo',
        calendar: 'calendar',
        clock: 'clock',
        stickynotes: 'stickynotes',
        tasks: 'todolist',
        filesearch: 'filesearch',
        help: 'help',
        iexplore: 'ie',
      };

      if (commandMap[cmd]) {
        globalLauncher(commandMap[cmd]);
      } else if (cmd.startsWith('http://') || cmd.startsWith('https://')) {
        window.open(cmd, '_blank');
      } else {
        alert(`Cannot find file "${cmd}" (or one of its components). Make sure the path and filename are correct.`);
      }
    }
  }

  okBtn?.addEventListener('click', execute);
  cancelBtn?.addEventListener('click', () => win.close());
  cmdInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') execute();
  });
}
