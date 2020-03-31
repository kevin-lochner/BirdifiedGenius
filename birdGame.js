// This script creates and runs a quiz game that plays bird sounds and asks the user to identify the bird

let checkAnswerButton = document.getElementById('check-answer')
let replayButton = document.getElementById('play-again')
let answerMessage = document.getElementById('answer-text')
let imageMatch  = document.getElementById('image-match')
let audio = document.getElementById('bird-sound')
let progress = 0

// Play the game
playGame()

// Basic gameplay function
function playGame() {
    let correctAnswerIndex = buildGame()
    buildButtons(correctAnswerIndex)
}

//Function to select a random bird and load a corresponding call into the audio element
function selectBirdSound() {
    // Choose a random "correct answer" object from birds.js
    let correctAnswerIndex = Math.floor(Math.random() * birds.length)
    let correctAnswerObject = birds[correctAnswerIndex]
    // Select sound element, and set its source to the selected birds' call
    // Uses a random index from the sounds array to allow for a single bird to have multiple calls
    audio.setAttribute('src', correctAnswerObject.sounds[Math.floor(Math.random()
        * correctAnswerObject.sounds.length)])
    return correctAnswerIndex
}

//Function to randomly select and display 3 potential answers, along with the correct answer, in a random order
function buildGame () {
    // Clear the answer message
    answerMessage.innerText = ''
    // Select an index to serve as the correct answer
    let correctAnswerIndex = selectBirdSound()
    // Create array of options that includes the "correct" index
    let answerOptions = [correctAnswerIndex]
    // Add three more random indexes from birds.js
    while (answerOptions.length < 4) {
        let newAnswerIndex = Math.floor(Math.random() * birds.length)
        if (!answerOptions.includes(newAnswerIndex)) {
            answerOptions.push(newAnswerIndex)
        }
    }

    // Randomly reorder the answer options
    shuffle(answerOptions)

    // Select and assign answer radio buttons
    let answer1Label = document.getElementById('answer-1-label')
    let answer2Label = document.getElementById('answer-2-label')
    let answer3Label = document.getElementById('answer-3-label')
    let answer4Label = document.getElementById('answer-4-label')
    answer1Label.innerHTML = birds[answerOptions[0]].name
    answer2Label.innerHTML = birds[answerOptions[1]].name
    answer3Label.innerHTML = birds[answerOptions[2]].name
    answer4Label.innerHTML = birds[answerOptions[3]].name

    for (let bird = 0; bird < birds.length; bird++) {
        let image = new Image()
        image.src = birds[bird].photos[0]
    }

    // Set the first answer to checked
    let answer1Checked = document.getElementById('answer-1')
    answer1Checked.checked = true

    // Set the image on the right hand side of the page to match the first answer option
    switchImage(0, answerOptions)

    // Any time a potential answer is clicked, update the image to correspond
    answer1Label.addEventListener('click', function () {
        switchImage(0, answerOptions)
    })
    answer2Label.addEventListener('click', function () {
        switchImage(1, answerOptions)
    })
    answer3Label.addEventListener('click', function () {
        switchImage(2, answerOptions)
    })
    answer4Label.addEventListener('click', function () {
        switchImage(3, answerOptions)
    })

    return correctAnswerIndex
}


function assignAnswers(answerOptions) {

}

// Function to define buttons and their functions
function buildButtons(correctAnswerIndex) {
    checkAnswerButton.addEventListener('click', function () {
        // Stop the audio and run the check answer function
        audio.pause()
        checkAnswer(correctAnswerIndex)
    })

    // Play again button
    replayButton.addEventListener('click', function () {
        // Reset the game
        correctAnswerIndex = buildGame()
    })
}

// Answer checker function
function checkAnswer(correctAnswerIndex) {
    // Which button is checked?
    // Get the text associated with the answer for comparison
    let userAnswer = document.getElementById(document.querySelector('input[name = answer]:checked').id + '-label').innerHTML
    // Compare
    if (userAnswer === birds[correctAnswerIndex].name) {
        // Display the message, update progress iterator and run the trackProgress function to update the bar
        answerMessage.innerHTML = `${birds[correctAnswerIndex].name} is correct!`
        progress += 1
        trackProgress()
    } else {
        // Set the image to correspond with the correct answer, display message, update progress
        imageMatch.src = birds[correctAnswerIndex].photos[0]
        answerMessage.innerHTML = `Sorry, ${birds[correctAnswerIndex].name} is the right answer.`
        progress = 0
        trackProgress()
    }
}

// Function to update the image on the right of the page to correspond with the currently selected answer
function switchImage(n, answerOptions) {
    imageMatch.src = birds[answerOptions[n]].photos[0]
}

function trackProgress() {
    let progressBar = document.getElementById('progress-bar')
    if(progress === 0) {
        let progressCSS = `${progress * 10}%`
        progressBar.style.width = progressCSS
        progressBar.setAttribute('aria-ValueNow', progress)
        progressBar.innerHTML = ''
    } else {
        let progressCSS = `${progress * 10}%`
        progressBar.style.width = progressCSS
        progressBar.setAttribute('aria-ValueNow', progress)
        progressBar.innerHTML = `${progress} in a row`
    }
}


// This function is an adaptation of the Fisher-Yates algorithm found here:
// https://medium.com/@joshfoster_14132/best-javascript-shuffle-algorithm-c2c8057a3bc1
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex

    while(0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }
}
