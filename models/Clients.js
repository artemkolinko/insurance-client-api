const path = require('path');
const { Client } = require('cassandra-driver');

class Clients {
  constructor() {
    this.clientTable = process.env.DB_CLIENT_TABLE;

    this.init();
  }

  init() {
    this.cli = new Client({
      cloud: {
        secureConnectBundle: path.resolve(
          __dirname,
          '../secure-connect-softinsurance.zip'
        ),
      },
      credentials: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
      keyspace: process.env.DB_KEYSPACE,
    });
  }

  async connectCloud() {
    try {
      await this.cli.connect();
      console.warn('Connected to DataStax Astra');
      await this.cli.execute(
        `CREATE TABLE IF NOT EXISTS ${this.clientTable} (id uuid PRIMARY KEY, name text, package uuid, balance float);`
      );
      console.warn('DB exist');
    } catch (error) {
      console.warn(error);
    }
  }

  selectById() {
    return `SELECT * FROM ${this.clientTable} WHERE id = ?;`;
  }

  selectAll() {
    return `SELECT * FROM ${this.clientTable};`;
  }

  selectByName(name) {
    return `SELECT * FROM ${this.clientTable} WHERE name = '${name}' ALLOW FILTERING`;
  }

  insert() {
    return `INSERT INTO ${this.clientTable} (id, name, balance) VALUES (?, ?, ?);`;
  }

  updateById(field) {
    return `UPDATE ${this.clientTable} SET ${field} = ? WHERE id = ?;`;
  }

  deleteById() {
    return `DELETE FROM ${this.clientTable} WHERE id = ?;`;
  }

  getClientById(id) {
    return this.cli.execute(this.selectById(), [id], { prepare: true });
  }

  updateClient(id, value, field) {
    return this.cli.execute(this.updateById(field), [value, id], {
      prepare: true,
    });
  }
}

const clients = new Clients();

clients.connectCloud();

module.exports = clients;
