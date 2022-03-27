const flowers = require("./flowers");
const quizzes = require("./data");
const scores = require("./scores");
const express = require("express");
const app = express();
const port = 4002;

app.get("/flowers", function (req, res) {
  res.status(200).json({ done: true, result: flowers, message: "message" });
});

app.get("/quiz/:id", function (req, res) {
  quizId = req.params.id;
  resultArray = undefined;
  for (let i = 0; i < quizzes.quizzes.length; i++) {
    if (quizzes.quizzes[i].id == quizId) {
      resultArray = quizzes.quizzes[i];
    }
  }
  res.status(200).json({ done: true, result: resultArray, message: "message" });
});

app.get("/scores/:quiztaker/:quizid", function (req, res) {
  resultNum = undefined;
  for (let i = 0; i < scores.scores.length; i++) {
    if (
      scores.scores[i].quizId == req.params.quizid &&
      scores.scores[i].quizTaker == req.params.quiztaker
    ) {
      resultNum = scores.scores[i].score;
    }
  }
  res.status(200).json({ done: true, result: resultNum, message: "message" });
});

app.listen(port, () => console.log("App listening on port 4002"));
