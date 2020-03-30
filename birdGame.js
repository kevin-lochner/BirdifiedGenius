// This script creates and runs a quiz game that plays bird sounds and asks the user to identify the bird

let checkAnswerButton = document.getElementById('check-answer')
let replayButton = document.getElementById('play-again')
let answerMessage = document.getElementById('answer-text')
let buttonCheckedImage  = document.getElementById('image-match')
let progress = 0


playGame()

// Basic gameplay function
function playGame() {
    let correctBirdIndex = buildGame()
    buildButtons(correctBirdIndex)
}

//Function to select a random bird and a corresponding call
function selectBirdSound() {
    // Choose a random "correct answer" object from birds.js
    let correctBirdIndex = Math.floor(Math.random() * birds.length)
    let correctBirdObject = birds[correctBirdIndex]
    // Select sound element, and set its source to the selected birds' sound
    let birdSoundElement = document.getElementById('bird-sound')
    birdSoundElement.setAttribute('src', correctBirdObject.sounds[Math.floor(Math.random()
        * correctBirdObject.sounds.length)])
    return correctBirdIndex
}

//Function to randomly select and display 3 potential answers, along with the correct answer, in a random order
function buildGame () {
    // Select an index to serve as the correct answer
    let correctBirdIndex = selectBirdSound()
    // Create array of options that includes the "correct" index
    let answerOptions = [correctBirdIndex]
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

    // Set checked to false (not necessary on first play, but button otherwise remains checked on subsequent plays
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

    return correctBirdIndex
}

function buildButtons(correctBirdIndex) {
    // Create the buttons
    checkAnswerButton.addEventListener('click', function () {
        // Which button is checked?
        // Get the text associated with the answer for comparison
        let userAnswer = document.getElementById(document.querySelector('input[name = answer]:checked').id + '-label').innerHTML
        // Compare
        if (userAnswer === birds[correctBirdIndex].name) {
            answerMessage.innerHTML = 'Correct!'
            progress += 1
            console.log('progress: ' + progress)
            trackProgress()
        } else {
            answerMessage.innerHTML = `Sorry, ${birds[correctBirdIndex].name} is the right answer.`
            progress = 0
            console.log('progress: '+ progress)
            trackProgress()
        }

    })

    // Play again button
    replayButton.addEventListener('click', function () {
        answerMessage.innerText = ''
        correctBirdIndex = buildGame()
    })

}

// Function to update the image on the right of the page to correspond with the currently selected answer
function switchImage(n, answerOptions) {
    let checkedImageSource = birds[answerOptions[n]].photos[0]
    buttonCheckedImage.src = checkedImageSource
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
