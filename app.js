require('dotenv').config();
const express = require('express');
const logger = require('morgan');
// const bodyParser = require('body-parser');
const clientsRouter = require('./routes/clients');
const productsRouter = require('./routes/products');
const packagesRouter = require('./routes/packages');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1/catalog/products', productsRouter);
app.use('/api/v1/catalog/packages', packagesRouter);

// ===========================================
// Srart server
// ============================================
app.listen(PORT, () => {
  console.warn(`Server has been started on port ${PORT}`);
});
