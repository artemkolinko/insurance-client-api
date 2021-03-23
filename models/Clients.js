const path = require('path');
const { Client } = require('cassandra-driver');
const clientTable = process.env.DB_CLIENT_TABLE;

const clients = new Client({
  cloud: {
    secureConnectBundle: path.resolve(__dirname, '../secure-connect-softinsurance.zip')
  },
  credentials: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  keyspace: process.env.DB_KEYSPACE
});

clients
  .connect()
  .then(() => {
    console.warn('Connected to DataStax Astra');
    clients.execute(
          `CREATE TABLE IF NOT EXISTS ${clientTable} (id uuid PRIMARY KEY, name text, package int, balance float);`
    );
  })
  .then(() => {
    console.warn('Table exist');
  })
  .catch((err) => console.warn(err));

const selectById = (table = clientTable) => `SELECT * FROM ${table} WHERE id = ?;`;

const selectAll = (table = clientTable) => `SELECT * FROM ${table};`;

const selectByName = (name, table = clientTable) =>
  `SELECT * FROM ${table} WHERE name = '${name}' ALLOW FILTERING`;

const insert = (table = clientTable) =>
  `INSERT INTO ${table} (id, name, balance) VALUES (?, ?, ?);`;

const updateById = (table, field) =>
  `UPDATE ${table} SET ${field} = ? WHERE id = ?;`;

const deleteById = (table = clientTable) => `DELETE FROM ${table} WHERE id = ?;`;

const getClientById = (id, table = clientTable) =>
  clients.execute(selectById(table), [id], { prepare: true });

const updateClient = (id, balance, field, table = clientTable) =>
  clients.execute(updateById(table, field), [balance, id], { prepare: true });

module.exports = { clients, insert, selectAll, selectByName, getClientById, updateClient, deleteById };
