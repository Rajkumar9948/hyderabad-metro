// utils/graph.js

class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addEdge(from, to, distance) {
    if (!this.adjacencyList[from]) this.adjacencyList[from] = [];
    if (!this.adjacencyList[to]) this.adjacencyList[to] = [];

    this.adjacencyList[from].push({ node: to, distance });
    this.adjacencyList[to].push({ node: from, distance }); // because it's bidirectional
  }

  dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const queue = [];

    for (let node in this.adjacencyList) {
      distances[node] = Infinity;
      previous[node] = null;
      queue.push(node);
    }

    distances[start] = 0;

    while (queue.length > 0) {
      queue.sort((a, b) => distances[a] - distances[b]);
      const current = queue.shift();

      if (current === end) break;

      for (let neighbor of this.adjacencyList[current]) {
        const alt = distances[current] + neighbor.distance;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = current;
        }
      }
    }

    // Reconstruct path
    const path = [];
    let current = end;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }

    return {
      path,
      totalDistance: distances[end]
    };
  }
}

module.exports = Graph;
