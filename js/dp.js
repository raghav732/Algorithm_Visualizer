// ============================================================
// FILE: js/dp.js
// Dynamic Programming Visualizations:
//   Fibonacci (Bottom-up DP), 0/1 Knapsack
// Depends on: utils.js
// ============================================================


// ============================================================
// FIBONACCI — Bottom-Up Dynamic Programming
// ============================================================
let fibRunning = false;

function resetFib() {
  fibRunning = false;
  document.getElementById('fib-cells').innerHTML = '';
  clearLog('fib-log');
  log('fib-log', 'Reset.');
}

async function startFib() {
  if (fibRunning) return;
  fibRunning = true;
  clearLog('fib-log');

  const n  = parseInt(document.getElementById('fib-n').value) || 10;
  const dp = Array(n + 1).fill(0);
  dp[0] = 0;
  if (n >= 1) dp[1] = 1;

  log('fib-log', `Computing Fibonacci(${n}) using DP...`);

  // Create placeholder cells
  const container = document.getElementById('fib-cells');
  container.innerHTML = '';
  for (let i = 0; i <= n; i++) {
    const cell = document.createElement('div');
    cell.className = 'fib-cell';
    cell.innerHTML = `<div class="fi">F(${i})</div>?`;
    container.appendChild(cell);
  }
  await sleep(400);

  const cells = container.querySelectorAll('.fib-cell');

  // Set base cases immediately
  cells[0].innerHTML = `<div class="fi">F(0)</div>0`;
  cells[0].classList.add('done');
  if (n >= 1) {
    cells[1].innerHTML = `<div class="fi">F(1)</div>1`;
    cells[1].classList.add('done');
  }

  // Fill DP table bottom-up, animating each step
  for (let i = 2; i <= n; i++) {
    if (!fibRunning) return;

    cells[i].classList.add('active');    // highlight current cell
    dp[i] = dp[i - 1] + dp[i - 2];
    await sleep(350);

    cells[i].innerHTML = `<div class="fi">F(${i})</div>${dp[i]}`;
    cells[i].classList.remove('active');
    cells[i].classList.add('done');

    log('fib-log',
      `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`);
  }

  log('fib-log', `✅ F(${n}) = ${dp[n]}`, 'done');
  fibRunning = false;
}


// ============================================================
// 0/1 KNAPSACK — Dynamic Programming with animated DP table
// ============================================================
let ksRunning = false;

// Default items for the knapsack demo
const ksItems = [
  { name: 'Laptop', weight: 3, value: 4 },
  { name: 'Phone',  weight: 1, value: 3 },
  { name: 'Book',   weight: 2, value: 2 },
  { name: 'Tablet', weight: 4, value: 5 }
];

// Render the item cards above the DP table
function renderKsItems() {
  const c = document.getElementById('ks-items');
  c.innerHTML = ksItems.map(it => `
    <div class="card" style="padding:10px 14px; min-width:100px; text-align:center">
      <div style="font-size:0.65rem; color:var(--muted); text-transform:uppercase; letter-spacing:1px">
        ${it.name}
      </div>
      <div style="color:var(--accent); font-weight:700; font-size:1rem; margin:4px 0">
        ₹${it.value * 1000}
      </div>
      <div style="color:var(--muted); font-size:0.75rem">${it.weight} kg</div>
    </div>
  `).join('');
}

function resetKnapsack() {
  ksRunning = false;
  renderKsItems();
  document.getElementById('ks-table').innerHTML = '';
  clearLog('ks-log');
  log('ks-log', 'Reset.');
}

async function startKnapsack() {
  if (ksRunning) return;
  ksRunning = true;
  clearLog('ks-log');
  renderKsItems();

  const W       = parseInt(document.getElementById('ks-cap').value) || 7;
  const n       = ksItems.length;
  const weights = ksItems.map(it => it.weight);
  const values  = ksItems.map(it => it.value);

  // Build empty 2D DP table in DOM
  const tbl = document.getElementById('ks-table');
  let head = '<tr><th>Item \\ W</th>';
  for (let w = 0; w <= W; w++) head += `<th>${w}</th>`;
  head += '</tr>';

  let body = '';
  for (let i = 0; i <= n; i++) {
    const label = i === 0 ? '∅' : ksItems[i - 1].name;
    const wlabel = i === 0 ? '-' : weights[i - 1];
    body += `<tr><th>${label}(${wlabel}kg)</th>`;
    for (let w = 0; w <= W; w++) {
      body += `<td id="ks-${i}-${w}">0</td>`;
    }
    body += '</tr>';
  }
  tbl.innerHTML = head + body;

  log('ks-log', `Solving 0/1 Knapsack: ${n} items, capacity W=${W}`);
  await sleep(400);

  // 2D DP array
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  for (let i = 1; i <= n && ksRunning; i++) {
    for (let w = 0; w <= W; w++) {
      const cell = document.getElementById(`ks-${i}-${w}`);
      cell.classList.add('active');

      // Option 1: exclude item i
      dp[i][w] = dp[i - 1][w];

      // Option 2: include item i (if it fits)
      if (weights[i - 1] <= w) {
        const includeVal = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        if (includeVal > dp[i][w]) dp[i][w] = includeVal;
      }

      cell.textContent = dp[i][w];
      await sleep(80);
      cell.classList.remove('active');
      cell.classList.add('done');
    }

    log('ks-log', `Row ${i} (${ksItems[i - 1].name}, ${weights[i - 1]}kg): filled ✓`);
    await sleep(200);
  }

  log('ks-log',
    `✅ Max value with W=${W}: ${dp[n][W]} (= ₹${dp[n][W] * 1000})`, 'done');
  ksRunning = false;
}
