// ============================================================
// FILE: js/graph.js
// Graph Algorithm Visualizations:
//   BFS, DFS, Dijkstra
// Depends on: utils.js
// ============================================================


// ============================================================
// GRAPH DATA — shared between BFS and DFS
// ============================================================
const graphNodes = [
  { id: 0, x: 100, y: 80  },
  { id: 1, x: 240, y: 50  },
  { id: 2, x: 240, y: 160 },
  { id: 3, x: 380, y: 50  },
  { id: 4, x: 380, y: 160 },
  { id: 5, x: 130, y: 195 }
];

const graphEdges = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 5]
];

// Weighted directed graph for Dijkstra
const weightedEdges = [
  [0, 1, 4], [0, 2, 1], [1, 3, 1],
  [2, 1, 2], [2, 3, 5], [3, 4, 3],
  [4, 5, 2], [2, 5, 8]
];

const dijkNodes = [
  { id: 0, x: 80,  y: 100 },
  { id: 1, x: 240, y: 50  },
  { id: 2, x: 240, y: 170 },
  { id: 3, x: 400, y: 100 },
  { id: 4, x: 560, y: 50  },
  { id: 5, x: 560, y: 170 }
];

// Adjacency list for BFS/DFS
const bfsDfsGraph = {
  0: [1, 2], 1: [0, 3, 4],
  2: [0, 5], 3: [1],
  4: [1],    5: [2]
};

// Adjacency list for Dijkstra (neighbor, weight)
const dijkGraph = {
  0: [[1, 4], [2, 1]],
  1: [[3, 1]],
  2: [[1, 2], [3, 5]],
  3: [[4, 3]],
  4: [[5, 2]],
  5: []
};


// ============================================================
// SVG GRAPH DRAWING UTILITY
// visited  → array of node IDs already processed (purple)
// current  → node ID being processed right now (green)
// weighted → true shows edge weights and arrowheads
// ============================================================
function drawGraph(svgId, nodes, edges, visited = [], current = -1, weighted = false) {
  const svg = document.getElementById(svgId);
  svg.innerHTML = '';

  const ns = 'http://www.w3.org/2000/svg';

  // Arrow marker for directed (Dijkstra) edges
  const defs   = document.createElementNS(ns, 'defs');
  const marker = document.createElementNS(ns, 'marker');
  marker.setAttribute('id', 'arrow');
  marker.setAttribute('markerWidth', '8');
  marker.setAttribute('markerHeight', '8');
  marker.setAttribute('refX', '12');
  marker.setAttribute('refY', '3');
  marker.setAttribute('orient', 'auto');

  const arrowPath = document.createElementNS(ns, 'path');
  arrowPath.setAttribute('d', 'M0,0 L0,6 L9,3 z');
  arrowPath.setAttribute('fill', '#64748b');
  marker.appendChild(arrowPath);
  defs.appendChild(marker);
  svg.appendChild(defs);

  // Draw edges
  edges.forEach(e => {
    const [a, b, w] = e;
    const n1 = nodes[a];
    const n2 = nodes[b];

    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', n1.x); line.setAttribute('y1', n1.y);
    line.setAttribute('x2', n2.x); line.setAttribute('y2', n2.y);
    line.setAttribute('stroke', '#2a3044');
    line.setAttribute('stroke-width', '2');
    if (weighted) line.setAttribute('marker-end', 'url(#arrow)');
    svg.appendChild(line);

    // Draw weight label on weighted edges
    if (weighted && w !== undefined) {
      const mx = (n1.x + n2.x) / 2;
      const my = (n1.y + n2.y) / 2;
      const t  = document.createElementNS(ns, 'text');
      t.setAttribute('x', mx);
      t.setAttribute('y', my - 6);
      t.setAttribute('fill', '#fbbf24');
      t.setAttribute('font-size', '11');
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-family', 'JetBrains Mono');
      t.textContent = w;
      svg.appendChild(t);
    }
  });

  // Draw nodes
  nodes.forEach(n => {
    const isVisited = visited.includes(n.id);
    const isCurrent = n.id === current;

    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', n.x);
    circle.setAttribute('cy', n.y);
    circle.setAttribute('r', '22');
    circle.setAttribute('fill',   isCurrent ? '#6ee7b7' : isVisited ? '#818cf8' : '#1a1e2a');
    circle.setAttribute('stroke', isCurrent ? '#6ee7b7' : isVisited ? '#818cf8' : '#252a38');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', n.x);
    label.setAttribute('y', n.y + 5);
    label.setAttribute('fill', (isCurrent || isVisited) ? '#0d0f14' : '#e2e8f0');
    label.setAttribute('font-size', '13');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-weight', '700');
    label.setAttribute('font-family', 'JetBrains Mono');
    label.textContent = n.id;
    svg.appendChild(label);
  });
}

// Reset either bfs/dfs graph or dijkstra graph
function resetGraph(type) {
  if (type === 'bfs' || type === 'dfs') {
    drawGraph(type + '-graph', graphNodes, graphEdges);
    clearLog(type + '-log');
    log(type + '-log', 'Reset.');
  } else {
    drawGraph('dijkstra-graph', dijkNodes, weightedEdges, [], -1, true);
    clearLog('dijkstra-log');
    log('dijkstra-log', 'Reset.');
  }
}


// ============================================================
// BFS — Breadth-First Search
// ============================================================
let bfsRunning = false;

async function startBFS() {
  if (bfsRunning) return;
  bfsRunning = true;
  clearLog('bfs-log');

  const start   = parseInt(document.getElementById('bfs-start').value);
  const visited = [];
  const queue   = [start];
  const seen    = new Set([start]);

  log('bfs-log', `BFS from node ${start}. Initial Queue: [${start}]`);

  while (queue.length > 0 && bfsRunning) {
    const node = queue.shift();       // dequeue from front (FIFO)
    visited.push(node);

    drawGraph('bfs-graph', graphNodes, graphEdges, visited, node);
    log('bfs-log',
      `Visiting node ${node}. Queue: [${queue.join(',') || 'empty'}]`, 'highlight');
    await sleep(700);

    for (const nb of bfsDfsGraph[node]) {
      if (!seen.has(nb)) {
        seen.add(nb);
        queue.push(nb);
        log('bfs-log', `  Enqueue neighbor ${nb}`);
      }
    }
  }

  drawGraph('bfs-graph', graphNodes, graphEdges, visited, -1);
  log('bfs-log', `✅ BFS complete. Order: [${visited.join(' → ')}]`, 'done');
  bfsRunning = false;
}


// ============================================================
// DFS — Depth-First Search
// ============================================================
let dfsRunning = false;

async function startDFS() {
  if (dfsRunning) return;
  dfsRunning = true;
  clearLog('dfs-log');

  const start   = parseInt(document.getElementById('dfs-start').value);
  const visited = [];
  const seen    = new Set();

  log('dfs-log', `DFS from node ${start}.`);

  // Recursive async DFS
  async function dfs(node) {
    if (!dfsRunning || seen.has(node)) return;
    seen.add(node);
    visited.push(node);

    drawGraph('dfs-graph', graphNodes, graphEdges, visited, node);
    log('dfs-log', `Visiting node ${node} (going deeper)`, 'highlight');
    await sleep(600);

    for (const nb of bfsDfsGraph[node]) {
      await dfs(nb);    // recurse deeper before moving to next neighbour
    }
  }

  await dfs(start);

  drawGraph('dfs-graph', graphNodes, graphEdges, visited, -1);
  log('dfs-log', `✅ DFS complete. Order: [${visited.join(' → ')}]`, 'done');
  dfsRunning = false;
}


// ============================================================
// DIJKSTRA — Shortest Path (Greedy + Min-Heap simulation)
// ============================================================
let dijkRunning = false;

async function startDijkstra() {
  if (dijkRunning) return;
  dijkRunning = true;
  clearLog('dijkstra-log');
  drawGraph('dijkstra-graph', dijkNodes, weightedEdges, [], -1, true);

  // Initialize all distances to Infinity except source = 0
  const dist    = { 0: 0, 1: Infinity, 2: Infinity, 3: Infinity, 4: Infinity, 5: Infinity };
  const visited = [];
  const allNodes = [0, 1, 2, 3, 4, 5];

  log('dijkstra-log', 'Init: dist[0]=0, all others=∞');

  // Get unvisited node with minimum distance (simple linear scan)
  function getMinNode() {
    return allNodes
      .filter(n => !visited.includes(n))
      .reduce((a, b) => dist[a] <= dist[b] ? a : b);
  }

  while (visited.length < 6 && dijkRunning) {
    const u = getMinNode();
    visited.push(u);

    drawGraph('dijkstra-graph', dijkNodes, weightedEdges, visited, u, true);
    log('dijkstra-log',
      `Process node ${u} (dist=${dist[u] === Infinity ? '∞' : dist[u]})`, 'highlight');
    await sleep(700);

    // Relax outgoing edges
    for (const [v, w] of (dijkGraph[u] || [])) {
      if (visited.includes(v)) continue;

      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        log('dijkstra-log', `  Relax edge ${u}→${v}: dist[${v}] = ${dist[v]}`);
      }
    }
    await sleep(300);
  }

  drawGraph('dijkstra-graph', dijkNodes, weightedEdges, visited, -1, true);
  const distStr = Object.entries(dist)
    .map(([k, v]) => `${k}:${v === Infinity ? '∞' : v}`)
    .join(', ');
  log('dijkstra-log', `✅ Shortest distances from 0: { ${distStr} }`, 'done');
  dijkRunning = false;
}
