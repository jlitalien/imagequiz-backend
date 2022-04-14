const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const connectionString = `postgres://${process.env.USERNAME}${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}`;

const connection = {
  connectionString: process.env.DATABASEURL
    ? process.env.DATABASEURL
    : connectionString,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool({
  ssl: { rejectUnauthorized: false },
  connectionString:
    "postgres://dpknamcxkoouds:8840a2224e7628e2e106f00c6dece9759c87708a3424fa15cac5d28fc1031dae@ec2-52-54-212-232.compute-1.amazonaws.com:5432/d4lm95hjhv8mtn",
});

let store = {
  getFlowers: () => {
    return pool
      .query("select * from imagequiz.flower")
      .then((x) => {
        console.log(x.rows);
        return x;
      })
      .catch((e) => {
        console.log("getflowers err:" + e);
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
