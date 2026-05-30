// ============================================
// FILE: js/sorting.js
// Sorting Algorithm Visualizations:
//   Bubble Sort, Selection Sort,
//   Merge Sort,  Quick Sort
// Depends on: utils.js
// ============================================


// ============================================================
// BUBBLE SORT
// ============================================================
let bubbleRunning = false;

function resetBubble() {
  bubbleRunning = false;
  renderBars('bubble-bars', parseArr('bubble-input'));
  clearLog('bubble-log');
  log('bubble-log', 'Reset. Ready to visualize.');
}

async function startBubble() {
  if (bubbleRunning) return;
  bubbleRunning = true;
  clearLog('bubble-log');

  let arr = parseArr('bubble-input');
  const n = arr.length;

  log('bubble-log', `Starting Bubble Sort on [${arr.join(', ')}]`);
  renderBars('bubble-bars', arr);
  await sleep(400);

  let totalSwaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (!bubbleRunning) return;

      // Highlight the two elements being compared
      renderBars('bubble-bars', arr, [j, j + 1], [],
        Array.from({ length: i }, (_, k) => n - 1 - k));
      log('bubble-log',
        `Pass ${i + 1}: Comparing arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}`);
      await sleep(350);

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        totalSwaps++;
        swapped = true;
        log('bubble-log', `  ↕ Swapped! Array now: [${arr.join(', ')}]`, 'highlight');
        renderBars('bubble-bars', arr, [j, j + 1], [],
          Array.from({ length: i }, (_, k) => n - 1 - k));
        await sleep(350);
      }
    }

    if (!swapped) {
      log('bubble-log', 'No swaps in this pass — array is sorted!', 'done');
      break;
    }
    log('bubble-log', `Pass ${i + 1} done. Largest placed at index ${n - 1 - i}.`);
  }

  renderBars('bubble-bars', arr, [], [], arr.map((_, i) => i));
  log('bubble-log', `✅ Sorted: [${arr.join(', ')}] | Total swaps: ${totalSwaps}`, 'done');
  bubbleRunning = false;
}


// ============================================================
// SELECTION SORT
// ============================================================
let selRunning = false;

function resetSelection() {
  selRunning = false;
  renderBars('selection-bars', parseArr('selection-input'));
  clearLog('selection-log');
  log('selection-log', 'Reset.');
}

async function startSelection() {
  if (selRunning) return;
  selRunning = true;
  clearLog('selection-log');

  let arr = parseArr('selection-input');
  const n = arr.length;

  log('selection-log', `Starting Selection Sort on [${arr.join(', ')}]`);
  renderBars('selection-bars', arr);
  await sleep(400);

  for (let i = 0; i < n; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (!selRunning) return;

      renderBars('selection-bars', arr, [j], [minIdx],
        Array.from({ length: i }, (_, k) => k));
      log('selection-log',
        `Scan: arr[${j}]=${arr[j]} vs current min arr[${minIdx}]=${arr[minIdx]}`);
      await sleep(300);

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        log('selection-log', `  New min found: ${arr[j]} at index ${j}`, 'highlight');
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      log('selection-log',
        `Placed min ${arr[i]} at index ${i}. Array: [${arr.join(', ')}]`, 'highlight');
    }

    renderBars('selection-bars', arr, [], [],
      Array.from({ length: i + 1 }, (_, k) => k));
    await sleep(300);
  }

  renderBars('selection-bars', arr, [], [], arr.map((_, i) => i));
  log('selection-log', `✅ Sorted: [${arr.join(', ')}]`, 'done');
  selRunning = false;
}


// ============================================================
// MERGE SORT
// ============================================================
let mergeRunning = false;
let mergeSteps   = [];

function collectMergeSteps(arr, l, r) {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  collectMergeSteps(arr, l, m);
  collectMergeSteps(arr, m + 1, r);
  _doMergeStep(arr, l, m, r);
}

function _doMergeStep(arr, l, m, r) {
  const left  = arr.slice(l, m + 1);
  const right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) arr[k++] = left[i++];
    else                      arr[k++] = right[j++];
  }
  while (i < left.length)  arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];

  mergeSteps.push({
    arr:  [...arr],
    l, r,
    desc: `Merged [${left.join(',')}] and [${right.join(',')}] → [${arr.slice(l, r + 1).join(',')}]`
  });
}

function resetMerge() {
  mergeRunning = false;
  renderBars('merge-bars', parseArr('merge-input'));
  clearLog('merge-log');
  log('merge-log', 'Reset.');
}

async function startMerge() {
  if (mergeRunning) return;
  mergeRunning = true;
  clearLog('merge-log');
  mergeSteps = [];

  let arr  = parseArr('merge-input');
  const orig = [...arr];

  log('merge-log', `Starting Merge Sort on [${arr.join(', ')}]`);
  renderBars('merge-bars', arr);
  await sleep(400);

  collectMergeSteps(arr, 0, arr.length - 1);

  for (const step of mergeSteps) {
    if (!mergeRunning) return;
    renderBars('merge-bars', step.arr,
      Array.from({ length: step.r - step.l + 1 }, (_, k) => step.l + k));
    log('merge-log', step.desc, 'highlight');
    await sleep(500);
  }

  const final = mergeSteps.length > 0
    ? mergeSteps[mergeSteps.length - 1].arr
    : orig;

  renderBars('merge-bars', final, [], [], final.map((_, i) => i));
  log('merge-log', `✅ Sorted: [${final.join(', ')}]`, 'done');
  mergeRunning = false;
}


// ============================================================
// QUICK SORT
// ============================================================
let quickRunning = false;
let quickSteps   = [];

function collectQuickSteps(arr, lo, hi) {
  if (lo >= hi) return;
  const pivotIdx = hi;
  let i = lo - 1;

  quickSteps.push({
    arr: [...arr], pivot: pivotIdx, active: [],
    desc: `Pivot = ${arr[pivotIdx]} (index ${pivotIdx})`
  });

  for (let j = lo; j < hi; j++) {
    quickSteps.push({
      arr: [...arr], pivot: pivotIdx, active: [j],
      desc: `Compare arr[${j}]=${arr[j]} with pivot ${arr[pivotIdx]}`
    });

    if (arr[j] <= arr[pivotIdx]) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      quickSteps.push({
        arr: [...arr], pivot: pivotIdx, active: [i, j],
        desc: `Swap arr[${i}]=${arr[i]} and arr[${j}]=${arr[j]}`
      });
    }
  }

  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  const pi = i + 1;
  quickSteps.push({
    arr: [...arr], pivot: pi, active: [], done: [pi],
    desc: `Pivot ${arr[pi]} placed at final position ${pi}`
  });

  collectQuickSteps(arr, lo, pi - 1);
  collectQuickSteps(arr, pi + 1, hi);
}

function resetQuick() {
  quickRunning = false;
  renderBars('quick-bars', parseArr('quick-input'));
  clearLog('quick-log');
  log('quick-log', 'Reset.');
}

async function startQuick() {
  if (quickRunning) return;
  quickRunning = true;
  clearLog('quick-log');
  quickSteps = [];

  let arr = parseArr('quick-input');

  log('quick-log', `Starting Quick Sort on [${arr.join(', ')}]`);
  renderBars('quick-bars', arr);
  await sleep(400);

  collectQuickSteps(arr, 0, arr.length - 1);

  const doneSoFar = [];
  for (const step of quickSteps) {
    if (!quickRunning) return;
    if (step.done) step.done.forEach(d => doneSoFar.push(d));
    renderBars('quick-bars', step.arr,
      step.active || [],
      step.pivot != null ? [step.pivot] : [],
      [...doneSoFar]);
    log('quick-log', step.desc, step.done ? 'done' : 'highlight');
    await sleep(450);
  }

  renderBars('quick-bars', arr, [], [], arr.map((_, i) => i));
  log('quick-log', `✅ Sorted: [${arr.join(', ')}]`, 'done');
  quickRunning = false;
}
