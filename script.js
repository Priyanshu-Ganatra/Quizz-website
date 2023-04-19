const quizContainer = document.getElementById("question-container");
const startButton = document.getElementById("start-button");
const scoreContainer = document.getElementById("score-container");
const scoreLabel = document.getElementById("score-label");
const scoreDisplay = document.getElementById("score");
const resetButton = document.getElementById("reset-button");
const resultContainer = document.getElementById("result-container");
const resultDisplay = document.getElementById("result");
const gifDisplay = document.getElementById("gif");

let currentQuestion = 0;
let score = 0;
let quizData = [];

async function fetchData() {
  const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
  const data = await response.json();
  quizData = data.results;
}

function startQuiz() {
  startButton.classList.add("hide");
  quizContainer.classList.remove("hide");
  showQuestion();
}

function showQuestion() {
  const question = quizData[currentQuestion];
  const answers = [...question.incorrect_answers, question.correct_answer];
  shuffleArray(answers);

  document.getElementById("question").innerHTML = question.question;

  for (let i = 0; i < answers.length; i++) {
    document.getElementsByClassName("answer")[i].innerHTML = answers[i];
    document.getElementsByClassName("answer")[i].classList.remove("correct");
    document.getElementsByClassName("answer")[i].classList.remove("incorrect");
    document.getElementsByClassName("answer")[i].addEventListener("click", selectAnswer);
  }
}

function selectAnswer() {
  const selectedAnswer = event.target.innerHTML;
  const question = quizData[currentQuestion];

  if (selectedAnswer === question.correct_answer) {
    event.target.classList.add("correct");
    score++;
  } else {
    event.target.classList.add("incorrect");
  }

  disableAnswers();
  currentQuestion++;

  if (currentQuestion >= quizData.length) {
    endQuiz();
  } else {
    setTimeout(showQuestion, 1000);
  }
}

function disableAnswers() {
  for (let i = 0; i < 4; i++) {
    document.getElementsByClassName("answer")[i].removeEventListener("click", selectAnswer);
  }
}

function endQuiz() {
  quizContainer.classList.add("hide");
  resultContainer.classList.remove("hide");
  gifDisplay.src = score >= 3 ? "img/winner.gif" : "img/loser.gif";
  resultDisplay.innerHTML = `You got ${score} out of ${quizData.length} questions correct!`;
  scoreLabel.innerHTML = "Final Score:";
  scoreDisplay.innerHTML = score;
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  quizContainer.classList.add("hide");
  resultContainer.classList.add("hide");
  startButton.classList.remove("hide");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

startButton.addEventListener("click", async () => {
  await fetchData();
  startQuiz();
});

resetButton.addEventListener("click", resetQuiz);
