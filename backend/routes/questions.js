const express = require("express");

const router = express.Router();

const questions = require("../data/questions.json");

function shuffle(array) {

  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {

    const j = Math.floor(

      Math.random() * (i + 1)

    );

    [shuffled[i], shuffled[j]] = [

      shuffled[j],

      shuffled[i],

    ];

  }

  return shuffled;

}

router.get("/", (req, res) => {
  const randomQuestions = shuffle(questions).slice(0, 33);

  res.json(randomQuestions);
});

module.exports = router;

console.log("Questions route loaded");

if (questions.length > 0) {
  console.log(questions.length);
  console.log("Sample question:", questions[0]);
}
else console.log("No questions found");