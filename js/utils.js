// ============================================
// FILE: js/utils.js
// Shared utility functions used by ALL modules
// ============================================

// --- PAGE NAVIGATION ---
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.sidebar-item').forEach(item => {
    if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(`'${id}'`)) {
      item.classList.add('active');
    }
  });
}

// --- PARSE COMMA-SEPARATED INPUT INTO INT ARRAY ---
function parseArr(id) {
  return document.getElementById(id).value
    .split(',')
    .map(x => parseInt(x.trim()))
    .filter(x => !isNaN(x));
}

// --- PROMISE-BASED SLEEP (for animation delays) ---
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// --- APPEND A LINE TO STEP LOG ---
function log(logId, text, cls = '') {
  const el   = document.getElementById(logId);
  const line = document.createElement('div');
  line.className = 'log-line' + (cls ? ' ' + cls : '');
  line.textContent = text;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;   // auto-scroll to bottom
}

// --- CLEAR STEP LOG ---
function clearLog(logId) {
  document.getElementById(logId).innerHTML = '';
}

// --- RENDER BAR CHART ---
// activeIdxs  → green glowing bars (currently being compared)
// compareIdxs → pink bars (pivot / min marker)
// doneIdxs    → purple bars (sorted / finalized)
function renderBars(containerId, arr, activeIdxs = [], compareIdxs = [], doneIdxs = []) {
  const container = document.getElementById(containerId);
  const maxVal    = Math.max(...arr);
  container.innerHTML = arr.map((v, i) => {
    let cls = 'bar';
    if      (doneIdxs.includes(i))    cls += ' done';
    else if (activeIdxs.includes(i))  cls += ' active';
    else if (compareIdxs.includes(i)) cls += ' compare';
    const h = Math.max(10, Math.round((v / maxVal) * 140));
    return `<div class="bar-wrap">
              <div class="${cls}" style="height:${h}px"></div>
              <div class="bar-label">${v}</div>
            </div>`;
  }).join('');
}

// --- RENDER SEARCH ARRAY (for Linear & Binary Search) ---
// active  → currently being checked (green)
// checked → already checked and failed (pink tint)
// found   → target found (purple)
function renderSearchArr(containerId, arr, active = [], checked = [], found = []) {
  const c = document.getElementById(containerId);
  c.innerHTML = arr.map((v, i) => {
    let cls = 'search-cell';
    if      (found.includes(i))   cls += ' found';
    else if (active.includes(i))  cls += ' active';
    else if (checked.includes(i)) cls += ' checked';
    return `<div class="${cls}">
              <div class="idx">[${i}]</div>${v}
            </div>`;
  }).join('');
}
