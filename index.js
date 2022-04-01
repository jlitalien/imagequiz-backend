let { flowers } = require("./flowers");
let { quizzes } = require("./data");
let { customers } = require("./customers");
let { scores } = require("./scores");
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
  res.status(200).json({
    done: true,
    result: flowers,
    message: "List of flowers returned!",
  });
});

app.get("/quiz/:id", function (req, res) {
  quizId = req.params.id;
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
});

app.get("/scores/:quiztaker/:quizid", function (req, res) {
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
});

app.post("/register", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var pwd = req.body.password;
  var newEntry = { name: name, email: email, password: pwd };
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
});

app.post("/login", (req, res) => {
  var email = req.body.email;
  var pwd = req.body.password;
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
});

app.post("/score", (req, res) => {
  var email = req.body.quizTaker;
  var id = req.body.quizId;
  var score = req.body.score;
  var date = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

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
});

app.listen(port, () => console.log("App listening on port 4002"));
