// ============================================================
// FILE: js/init.js
// App Initializer — runs on window.onload
// Initializes all visualizer panels with default values
// Must be loaded LAST (after all other JS files)
// ============================================================

window.onload = function () {
  // --- Sorting bars ---
  renderBars('bubble-bars',    parseArr('bubble-input'));
  renderBars('selection-bars', parseArr('selection-input'));
  renderBars('merge-bars',     parseArr('merge-input'));
  renderBars('quick-bars',     parseArr('quick-input'));

  // --- Search arrays ---
  renderSearchArr('linear-cells', parseArr('linear-input'));
  renderSearchArr('binary-cells', parseArr('binary-input'));

  // --- Graph SVGs ---
  drawGraph('bfs-graph',      graphNodes, graphEdges);
  drawGraph('dfs-graph',      graphNodes, graphEdges);
  drawGraph('dijkstra-graph', dijkNodes,  weightedEdges, [], -1, true);

  // --- Knapsack item cards ---
  renderKsItems();
};
