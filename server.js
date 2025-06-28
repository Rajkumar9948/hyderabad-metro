const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/db');
// Adjust path if needed

const app = express();
app.use(cors());
app.use(express.json());

// Mount route modules
const linesRouter = require('./routes/lines');
const stationsRouter = require('./routes/stations');
const connectionsRouter = require('./routes/connections');
const routeFinder = require('./routes/route');

app.use('/api/lines', linesRouter);
app.use('/api/stations', stationsRouter);
app.use('/api/connections', connectionsRouter);
app.use('/api/route', routeFinder);

// Root test route
app.get('/', (req, res) => {
  res.send('Hyderabad Metro Backend is Live!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚆 Server is running at http://localhost:${PORT}`);
});
