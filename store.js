const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const connectionString = `postgres://${process.env.USERNAME}${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}`;

const connection = {
  connectionString: process.env.DATABASEURL
    ? process.env.DATABASEURL
    : connectionString,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(connection);

let store = {
  getFlowers: () => {
    pool
      .query("select * from imagequiz.flower")
      .then((x) => {
        console.log(x);
      })
      .catch((e) => {
        console.log(e);
        return { valid: false, message: "Something went wrong." };
      });
  },

  addCustomer: (name, email, password) => {
    const hash = bcrypt.hashSync(password, 10);
    return pool.query(
      "  insert into imagequiz.customer (name, email, password) values ($1, $2, $3)",
      [name, email, hash]
    );
  },
  login: (email, password) => {
    pool
      .query(
        "select name, email, password from imagequiz.customer where email = $1",
        [email]
      )
      .then((x) => {
        if (x.rows.length === 1) {
          let valid = bcrypt.compareSync(password, x.rows[0].password);
          if (valid) {
            return { valid: true };
          } else {
            return { valid: false, message: "Credentials are not valid." };
          }
        } else {
          return { valid: false, message: "Email not found." };
        }
      })
      .catch((e) => {
        console.log(e);
        return { valid: false, message: "Something went wrong." };
      });
  },
  getQuiz: (id) => {
    pool.query("select ");
  },
};
exports.store = store;
