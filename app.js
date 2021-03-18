require('dotenv').config();
const express = require('express');
// const bodyParser = require('body-parser');
const clientsRouter = require('./routes/clients');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/clients', clientsRouter);

module.exports = app;
