const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const connectionString = `postgres://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}`;

const connection = {
  connectionString: process.env.DATABASEURL
    ? process.env.DATABASEURL
    : connectionString,
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool({
  ssl: { rejectUnauthorized: false },
  connectionString: `postgres://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}`,
});

let store = {
  getFlowers: () => {
    return pool
      .query("select * from imagequiz.flower")
      .then((x) => {
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
    return pool
      .query(
        "select name, email, password from imagequiz.customer where email = $1",
        [email]
      )
      .then((x) => {
        if (x.rows.length === 1) {
          let valid = bcrypt.compareSync(password, x.rows[0].password);
          console.log(valid);
          if (valid) {
            return { valid: true, message: "Logged in." };
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
  getQuiz: (quizId) => {
    return pool
      .query("select score from imagequiz.score where id = $1", [quizId])
      .then((x) => {
        return x;
      })
      .catch((e) => {
        return { valid: false, message: "Something went wrong." };
      });
  },

  getScores: (quizTaker, quizId) => {
    return pool
      .query(
        "select score from imagequiz.score where customerid = $1 and where quiz_id = $2",
        [quizTaker, quizId]
      )
      .then((x) => {
        return x;
      })
      .catch((e) => {
        return { valid: false, message: "Something went wrong." };
      });
  },

  addScore: (quizTaker, id, score, date) => {
    return pool
      .query("insert into imagequiz.score values (default, $1, $2, $3, $4)", [
        quizTaker,
        id,
        score,
        date,
      ])
      .then((x) => {
        return { done: true, message: "Score added successfully." };
      })
      .catch((e) => {
        console.log(e);
        return { valid: false, message: "Something went wrong." };
      });
  },
};
exports.store = store;
