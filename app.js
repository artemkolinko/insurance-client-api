require('dotenv').config();
const express = require('express');
// const bodyParser = require('body-parser');
const clientsRouter = require('./routes/clients');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/clients', clientsRouter);

// ============================================
// Srart server
// ============================================
app.listen(PORT, () => {
  console.warn(`Server has been started on port ${PORT}`);
});
