let { flowers } = require("./flowers");
let { quizzes } = require("./data");
let { customers } = require("./customers");
let { scores } = require("./scores");
let { store } = require("./store");
const express = require("express");
const e = require("express");
const { response } = require("express");
const app = express();
const port = process.env.PORT || 4002;

//dependencies
const cors = require("cors");

//middlewares
app.use(cors());

app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).json({
    done: true,
    message: "Welcome to imagequiz backend API",
  });
});

app.get("/flowers", function (req, res) {
  store
    .getFlowers()
    .then((x) => {
      res.status(200).json({
        done: true,
        result: x.rows,
        message: "Flowers found in database.",
      });
    })
    .catch((e) => {
      res.status(404).json({ done: false, message: "Something went wrong." });
    });
  /*
  res.status(200).json({
    done: true,
    result: flowers,
    message: "List of flowers returned!",
  });
  */
});

app.get("/quiz/:id", function (req, res) {
  store
    .getQuiz()
    .then((x) => {
      res.status(200).json({
        done: true,
        result: x.rows,
        message: "Quiz found.",
      });
    })
    .catch((e) => {
      res.status(404).json({ done: false, message: "Something went wrong." });
    });

  /*
  resultArray = undefined;
  for (let i = 0; i < quizzes.length; i++) {
    if (quizzes[i].id == quizId) {
      resultArray = quizzes[i];
    }
  }
  res.status(200).json({
    done: true,
    result: resultArray,
    message: "Specified quiz returned!",
  });
  */
});

app.get("/scores/:quiztaker/:quizid", function (req, res) {
  store
    .getQuiz()
    .then((x) => {
      res.status(200).json({
        done: true,
        result: x.rows,
        message: "Score(s) found.",
      });
    })
    .catch((e) => {
      res.status(404).json({ done: false, message: "Something went wrong." });
    });
  /*
  resultNum = "";
  for (let i = 0; i < scores.length; i++) {
    if (
      scores[i].quizId == req.params.quizid &&
      scores[i].quizTaker == req.params.quiztaker
    ) {
      resultNum = scores[i].score;
    }
  }
  res.status(200).json({
    done: true,
    result: resultNum,
    message: "Specified quiz scores returned!",
  });
  */
});

app.post("/register", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var pwd = req.body.password;
  var newEntry = { name: name, email: email, password: pwd };
  store
    .addCustomer(name, email, pwd)
    .then((x) =>
      res
        .status(200)
        .json({ done: true, message: "Customer added successfully" })
    )
    .catch((e) => {
      console.log(e);
      res.status(500).json({
        done: false,
        message: "Customer was not added due to an error.",
      });
    });
  /*
  if (customers.length === 0) {
    customers.push(newEntry);
    res
      .status(200)
      .json({ done: true, message: "User successfully added!" })
      .end();
  } else {
    for (var i = 0; i < customers.length; i++) {
      if (customers[i]["email"] === email) {
        res
          .status(403)
          .json({
            done: false,
            message: "Entry with same email already exists",
          })
          .end();
      }
    }
    customers.push(newEntry);
    res
      .status(200)
      .json({ done: true, message: "User successfully added!" })
      .end();
  }
  */
});

app.post("/login", (req, res) => {
  var email = req.body.email;
  var pwd = req.body.password;
  console.log(email);
  console.log(pwd);
  store
    .login(email, pwd)
    .then((x) => {
      if (x.valid) {
        res
          .status(200)
          .json({ done: true, message: "Customer logged in successfully." });
      } else {
        res.status(401).json({ done: false, message: x.message });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ done: false, message: "Something went wrong." });
    });
  /*
  if (customers.length === 0) {
    res
      .status(403)
      .json({ done: false, message: "Invalid login credentials" })
      .end();
  } else {
    for (var i = 0; i < customers.length; i++) {
      if (customers[i]["email"] === email && customers[i]["password"] === pwd) {
        res
          .status(200)
          .json({
            done: true,
            message: "Valid login credentials",
          })
          .end();
      }
    }
    res
      .status(403)
      .json({ done: false, message: "Invalid login credentials" })
      .end();
  }
  */
});

app.post("/score", (req, res) => {
  var quizTaker = req.body.quizTaker;
  var id = req.body.quizId;
  var score = req.body.score;
  var date = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
  var time = new Date(0);
  time.setSeconds(45); // specify value for SECONDS here
  var timeString = time.toISOString().substr(11, 8);
  store
    .addScore(quizTaker, id, score, date + " " + timeString)
    .then((x) => {
      console.log(x);
      res
        .status(200)
        .json({ done: true, message: "Score added successfully." });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ done: false, message: "Something went wrong." });
    });
  /*
  var newEntry = { quizTaker: email, quizId: id, score: score, date: date };
  if (scores.length === 0) {
    scores.push(newEntry);
    res.status(200).json({ done: true, message: "Score updated" }).end();
  } else {
    for (var i = 0; i < scores.length; i++) {
      if (scores[i]["quizTaker"] === email) {
        res
          .status(403)
          .json({
            done: false,
            message: "Entry with same email already exists",
          })
          .end();
      }
    }
    scores.push(newEntry);
    res.status(200).json({ done: true, message: "Score updated" }).end();
  }
  */
});

app.listen(port, () => console.log("App listening on port 4002"));
