const express = require('express');
const router = express.Router();

// Example GET endpoint
router.get('/', (req, res) => {
  res.send('Connections API working!');
});

module.exports = router;
