const express = require('express');
const router = express.Router();
const pool = require('../db/db');


// Utility: Dijkstra’s algorithm to find shortest path
const buildGraph = (stations) => {
  const graph = {};

  stations.forEach((station) => {
    const { name, neighbors } = station;
    graph[name] = {};

    neighbors.forEach((neighbor) => {
      graph[name][neighbor.name] = {
        distance: 1, // can be adjusted to use actual distance if needed
        line: neighbor.line,
      };
    });
  });

  return graph;
};

const dijkstra = (graph, start, end) => {
  const distances = {};
  const previous = {};
  const queue = new Set(Object.keys(graph));

  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[start] = 0;

  while (queue.size) {
    const minNode = [...queue].reduce((a, b) => (distances[a] < distances[b] ? a : b));
    queue.delete(minNode);

    if (minNode === end) break;

    for (const neighbor in graph[minNode]) {
      const alt = distances[minNode] + graph[minNode][neighbor].distance;
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = minNode;
      }
    }
  }

  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
};

// Main route finder
router.post('/find', async (req, res) => {
  const { source, destination } = req.body;

  try {
    const stationResult = await pool.query(`
      SELECT s.name, s.line_id, l.name as line_name, s.station_order
      FROM stations s
      JOIN lines l ON s.line_id = l.id
    `);

    const stations = stationResult.rows;

    // Build neighbor map
    const neighborMap = {};
    for (const station of stations) {
      const key = station.name;

      if (!neighborMap[key]) neighborMap[key] = [];

      for (const candidate of stations) {
        if (station.line_id === candidate.line_id &&
            Math.abs(station.station_order - candidate.station_order) === 1) {
          neighborMap[key].push({
            name: candidate.name,
            line: station.line_name,
          });
        }
      }

      // Interchange logic
      const sameNameStations = stations.filter(s => s.name === station.name);
      if (sameNameStations.length > 1) {
        sameNameStations.forEach((s) => {
          if (s.line_name !== station.line_name) {
            neighborMap[key].push({
              name: s.name,
              line: s.line_name,
            });
          }
        });
      }
    }

    const graph = buildGraph(
      Object.keys(neighborMap).map((key) => ({
        name: key,
        neighbors: neighborMap[key],
      }))
    );

    const path = dijkstra(graph, source, destination);

    if (path.length === 0) {
      return res.status(404).json({ error: 'No path found' });
    }

    // Fare and time logic
    const numStations = path.length;
    const baseFare = 10;
    const extraStations = Math.max(0, numStations - 2);
    let totalFare = baseFare + extraStations * 5;

    const linesUsed = [];
    const interchanges = [];

    for (let i = 1; i < path.length; i++) {
      const prev = path[i - 1];
      const curr = path[i];

      const linePrev = neighborMap[prev].find(n => n.name === curr)?.line;
      const lineCurr = neighborMap[curr].find(n => n.name === prev)?.line;

      if (linePrev && linePrev !== linesUsed[linesUsed.length - 1]) {
        linesUsed.push(linePrev);

        if (linesUsed.length > 1) {
          interchanges.push(prev);
          totalFare += 2;
        }
      }
    }

    const estimatedTime = (numStations - 1) * 2.5 + interchanges.length * 5;

    res.json({
      route: path,
      totalStations: numStations,
      totalFare,
      interchanges,
      estimatedTime: `${Math.round(estimatedTime)} minutes`,
      lineChanges: interchanges.map((at, idx) => ({
        from: linesUsed[idx],
        to: linesUsed[idx + 1],
        at,
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
