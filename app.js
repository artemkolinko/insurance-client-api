require('dotenv').config();
const express = require('express');
const fs = require('fs');
const logger = require('morgan');
const cors = require('cors');
const clientsRouter = require('./routes/clientRouter');
const catalogRouter = require('./routes/catalogRouter');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger('common', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }));
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1/catalog', catalogRouter);

app.use(function(req, res) {
  res.status(404).json({ error: 'Not found!' });
});

// ===========================================
// Srart server
// ============================================
app.listen(PORT, () => {
  console.warn(`Server has been started on port ${PORT}`);
});
