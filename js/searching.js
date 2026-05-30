// ============================================
// FILE: js/searching.js
// Searching Algorithm Visualizations:
//   Linear Search, Binary Search
// Depends on: utils.js
// ============================================


// ============================================================
// LINEAR SEARCH
// ============================================================
let linRunning = false;

function resetLinear() {
  linRunning = false;
  renderSearchArr('linear-cells', parseArr('linear-input'));
  clearLog('linear-log');
  log('linear-log', 'Reset.');
}

async function startLinear() {
  if (linRunning) return;
  linRunning = true;
  clearLog('linear-log');

  const arr    = parseArr('linear-input');
  const target = parseInt(document.getElementById('linear-target').value);

  log('linear-log', `Searching for ${target} in [${arr.join(', ')}]`);
  renderSearchArr('linear-cells', arr);
  await sleep(400);

  const checked = [];

  for (let i = 0; i < arr.length; i++) {
    if (!linRunning) return;

    // Highlight current cell being checked
    renderSearchArr('linear-cells', arr, [i], checked, []);
    log('linear-log',
      `Checking index ${i}: arr[${i}]=${arr[i]} — ${arr[i] === target ? 'MATCH! ✅' : '✗ no match'}`);
    await sleep(400);

    if (arr[i] === target) {
      renderSearchArr('linear-cells', arr, [], [], [i]);
      log('linear-log', `✅ Found ${target} at index ${i}!`, 'done');
      linRunning = false;
      return;
    }

    checked.push(i);
  }

  renderSearchArr('linear-cells', arr, [], checked, []);
  log('linear-log', `❌ ${target} not found in array.`, 'highlight');
  linRunning = false;
}


// ============================================================
// BINARY SEARCH
// ============================================================
let binRunning = false;

function resetBinary() {
  binRunning = false;
  renderSearchArr('binary-cells', parseArr('binary-input'));
  clearLog('binary-log');
  log('binary-log', 'Reset. (Array must be sorted)');
}

async function startBinary() {
  if (binRunning) return;
  binRunning = true;
  clearLog('binary-log');

  const arr    = parseArr('binary-input');
  const target = parseInt(document.getElementById('binary-target').value);

  log('binary-log', `Binary Search for ${target} in [${arr.join(', ')}]`);
  renderSearchArr('binary-cells', arr);
  await sleep(400);

  let low  = 0;
  let high = arr.length - 1;
  const eliminated = [];

  while (low <= high) {
    if (!binRunning) return;

    const mid = Math.floor((low + high) / 2);

    // Highlight middle, show eliminated cells
    renderSearchArr('binary-cells', arr, [mid], eliminated, []);
    log('binary-log', `low=${low}, high=${high}, mid=${mid} → arr[mid]=${arr[mid]}`);
    await sleep(500);

    if (arr[mid] === target) {
      renderSearchArr('binary-cells', arr, [], [mid], [mid]);
      log('binary-log', `✅ Found ${target} at index ${mid}!`, 'done');
      binRunning = false;
      return;

    } else if (arr[mid] < target) {
      // Eliminate left half
      for (let i = low; i <= mid; i++) eliminated.push(i);
      log('binary-log', `${arr[mid]} < ${target} → search RIGHT half`, 'highlight');
      low = mid + 1;

    } else {
      // Eliminate right half
      for (let i = mid; i <= high; i++) eliminated.push(i);
      log('binary-log', `${arr[mid]} > ${target} → search LEFT half`, 'highlight');
      high = mid - 1;
    }

    await sleep(300);
  }

  log('binary-log', `❌ ${target} not found.`, 'highlight');
  binRunning = false;
}
