const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const scoreElement = document.getElementById('score');
const roundElement = document.getElementById('round');

const API_URL = 'https://api.npoint.io/eddef1e4d9af278a43a0'
const ANSWER_POINTS = 50
const START_SCORE = 0
const START_QUESTION_INDEX = 0

let currentQuestionIndex, score;
let quizData = [];

async function fetchQuizData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json()
        quizData = data.trainingSet;
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}

async function startQuiz() {
    if (quizData.length === 0) await fetchQuizData()
    setStartStats()
    showNextQuestion();
}

function updateStats(score) {
    scoreElement.innerText = score;
    roundElement.innerText = currentQuestionIndex + 1;
}

function setStartStats() {
    score = START_SCORE;
    currentQuestionIndex = START_QUESTION_INDEX;
    updateStats(score)
}

function showNextQuestion() {
    const { displaySet, matchSet, negativeSet } = quizData[currentQuestionIndex]
    const options = shuffleArray([...matchSet, ...negativeSet])

    resetState();
    questionElement.innerText = displaySet[0].text;

    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.classList.add('option-btn');
        button.addEventListener('click', selectOption);
        optionsContainer.appendChild(button);
    });
}

function resetState() {
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function selectOption(e) {
    const currentQuestion = quizData[currentQuestionIndex]
    const selectedButton = e.target;
    const correct = selectedButton.innerText === currentQuestion.matchSet[0].text;

    score += correct ? ANSWER_POINTS : -ANSWER_POINTS
    setStatusClass(selectedButton, correct);
    disableOptions();

    setTimeout(() => {
        resetOptionsStatus();
        enableOptions();
        if (correct) showNextQuestionOrEndQuiz()
        updateStats(score);
    }, 1000);
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    correct ? element.classList.add('correct') : element.classList.add('wrong')
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function disableOptions() {
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = true;
    });
}

function enableOptions() {
    Array.from(optionsContainer.children).forEach(button => {
        button.disabled = false;
    });
}

function resetOptionsStatus() {
    Array.from(optionsContainer.children).forEach(button => {
        clearStatusClass(button);
    });
}

function showNextQuestionOrEndQuiz() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        showNextQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    resetState();
    startQuiz();
}

function shuffleArray(array) {
    const arrayCopy = [...array]

    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }

    return arrayCopy;
}

startQuiz();
