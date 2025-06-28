const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Add a station to a specific line
router.post('/lines/:line_id/stations', async (req, res) => {
  try {
    const { line_id } = req.params;
    const { name, station_order, distance_from_previous, is_interchange } = req.body;

    const result = await pool.query(
      `INSERT INTO stations (name, line_id, station_order, distance_from_previous, is_interchange)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, line_id, station_order, distance_from_previous, is_interchange]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all stations in a specific line
router.get('/lines/:line_id/stations', async (req, res) => {
  try {
    const { line_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM stations WHERE line_id = $1 ORDER BY station_order`,
      [line_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all stations in the network
router.get('/stations', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT stations.*, lines.name AS line_name
       FROM stations
       JOIN lines ON stations.line_id = lines.id
       ORDER BY stations.name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
