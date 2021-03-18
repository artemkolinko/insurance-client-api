const path = require('path');
const Cassandra = require('cassandra-driver');

class Clients {
  constructor(data) {
    if (Clients.exists) {
      return Clients.instance;
    }
    Clients.instance = this;
    Clients.exists = true;
    this.table = process.env.DB_CLIENT_TABLE;

    this.init();
  }

  init() {
    this.client = new Cassandra.Client({
      cloud: {
        secureConnectBundle: path.resolve(__dirname, '../secure-connect-softinsurance.zip')
      },
      credentials: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      },
      keyspace: process.env.DB_KEYSPACE
    });
    this.connect();
  }

  connect() {
    this.client
      .connect()
      .then(() => {
        console.warn('Connected to DataStax Astra');
        this.client.execute(
          `CREATE TABLE IF NOT EXISTS ${this.table} (id uuid PRIMARY KEY, name text, package int, balance float);`
        );
      })
      .then(() => {
        console.warn('Table exist');
      })
      .catch((err) => console.warn(err));
  }

  async getClientsList() {
    const query = `SELECT * FROM ${this.table}`;
    return new Promise((resolve, reject) => {
      this.client.execute(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      });
    });
  }

  async addClient(name) {
    const id = Cassandra.types.timeuuid();
    const balance = 0;
    const params = [id, name, balance];
    const clientInsert = `INSERT INTO ${this.table} (id, name, balance) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) => {
      this.client.execute(clientInsert, params, { prepare: true },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(id);
          }
        });
    });
  }
}

module.exports = Clients;

// /api/clients
// app
//   .route('/')
//   // Get all clients
//   .get((req, res) => {
//     const select = `SELECT * FROM ${clientTable}`;

// поиск по полю, которое не является ключом
// SELECT * FROM developers WHERE salary > 3500 ALLOW FILTERING;

//   client
//     .execute(select, [], { prepare: true })
//     .then((result) => {
//       res.status(200).json(result.rows);
//     })
//     .catch((err) => {
//       res.status(404).send({ msg: err });
//     });
// })
// Greate new client
// .post((req, res) => {
// get client name
// const { name } = req.body;
// создаем id клиента
//   const id = cassandra.types.timeuuid();
//   const balance = 0;

//   const addClient = `INSERT INTO ${clientTable} (id, name, balance) VALUES (?, ?, ?)`;
//   const params = [id, name, balance];
//   client
//     .execute(addClient, params, { prepare: true })
//     .then((result) => {
//       res.status(201).json({
//         id,
//         name,
//         balance
//       });
//       console.log('Client added!');
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// /api/clients/:id
// app
// .route('/:id')
// Get client by id
// .get((req, res) => {
//   const getClientById = `SELECT * FROM ${clientTable} WHERE id = ?`;

//   client
//     .execute(getClientById, [req.params.id], { prepare: true })
//     .then((result) => {
//       res.json(result.rows[0]);
//     })
//     .catch((err) => {
//       res.status(404).send({ msg: err });
//     });
// })
// Edit client name
// .patch((req, res) => {
//   const { id } = req.params;
// get client new name
//   const { name } = req.body;

//   const editClientName = `UPDATE ${clientTable} SET name = ? WHERE id = ?`;
//   const params = [name, id];
//   client
//     .execute(editClientName, params, { prepare: true })
//     .then(() => {
//       res.json({ msg: 'Client name changed!' });
//       console.log('Client name changed!');
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// })
// .delete((req, res) => {
//   const { id } = req.params;
//   const deleteClientById = `DELETE FROM ${clientTable} WHERE id = ?`;

//   client
//     .execute(deleteClientById, [id], { prepare: true })
//     .then(() => {
//       res.status(200).json({
//         msg: 'Client saccessfuly deleted!'
//       });
//     })
//     .catch((err) => console.log(err));
// });

// ============================================
// POST /api/clients/:id/buy-package
// ============================================
// app.post('/:id/buy-package', (req, res) => {
// принимаем массив с продуктами

// запрос цен продуктов, отправляем массив продуктов
// GET catalog/products/cost

// проверка хватает ли баланса

// если да, то создаем пакет у java-стов, отправляем массив продуктов, получаем id пакета
// POST catalog/package

// eslint-disable-next-line no-unused-vars
// const packageId = parseInt(Math.random() * 1000);
// });
