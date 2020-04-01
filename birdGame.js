// This script creates and runs a quiz game that plays bird sounds and asks the user to identify the bird

let checkAnswerButton = document.getElementById('check-answer')
let replayButton = document.getElementById('play-again')
let answerMessage = document.getElementById('answer-text')
let imageMatch  = document.getElementById('image-match')
let audio = document.getElementById('bird-sound')
let progress = 0
let recentAudio = []

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
    let audioSource = correctAnswerObject.sounds[Math.floor(Math.random()
        * correctAnswerObject.sounds.length)].src.valueOf()
    // If it wasn't one of the 4 most recent clips, set it up to play
    // Otherwise pick a new clip
    if(!recentAudio.includes(audioSource)){
        audio.src = audioSource
        trackRecentAudio(audioSource)
        return correctAnswerIndex
    } else selectBirdSound()
}

// Function that stores the last 4 audio clips
function trackRecentAudio(audioSource) {
    // Add the audio clip to the array
    if (recentAudio.length < 4) {
        recentAudio.push(audioSource)
    } else {
        recentAudio.push(audioSource)
        recentAudio.splice(0, 1)
    }
}


//Function to randomly select and display 3 potential answers, along with the correct answer, in a random order
function buildGame () {
    // Clear the answer message
    answerMessage.innerText = ''

    // Select an index to serve as the correct answer
    let correctAnswerIndex = selectBirdSound()

    // Create the rest of the potential answers
    let answerOptions = createAnswerOptions(correctAnswerIndex)

    // Pre load the images for faster swaps
    loadImages(answerOptions)

    // Select and assign answer radio buttons
    let answer1Label = document.getElementById('answer-1-label')
    let answer2Label = document.getElementById('answer-2-label')
    let answer3Label = document.getElementById('answer-3-label')
    let answer4Label = document.getElementById('answer-4-label')
    answer1Label.innerHTML = birds[answerOptions[0]].name
    answer2Label.innerHTML = birds[answerOptions[1]].name
    answer3Label.innerHTML = birds[answerOptions[2]].name
    answer4Label.innerHTML = birds[answerOptions[3]].name

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

// Function to create an array of 4 random answer options
function createAnswerOptions(correctAnswerIndex){
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

    return answerOptions
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
        imageMatch.src = birds[correctAnswerIndex].photos[0].src.valueOf()
        answerMessage.innerHTML = `Sorry, ${birds[correctAnswerIndex].name} is the right answer.`
        progress = 0
        trackProgress()
    }
}

// Function to update the image on the right of the page to correspond with the currently selected answer
function switchImage(n, answerOptions) {
    imageMatch.src = birds[answerOptions[n]].photos[0].src.valueOf()
    imageMatch.alt = `A ${birds[answerOptions[n]].name}`
}

// Function for updating progress bar
function trackProgress() {
    let progressBar = document.getElementById('progress-bar')
    if(progress === 0) {
        let progressCSS = `${progress * 4}%`
        progressBar.style.width = progressCSS
        progressBar.setAttribute('aria-ValueNow', progress)
        progressBar.innerHTML = `Streak: ${progress}`
    } else {
        let progressCSS = `${progress * 4}%`
        progressBar.style.width = progressCSS
        progressBar.setAttribute('aria-ValueNow', progress)
        progressBar.innerHTML = `Streak: ${progress}`
    }
}

/**
// Function for image preloading
function loadImagesLong(answerOptions) {
    // array for iteration
    let birdChoices = [
        birds[answerOptions[0]],
        birds[answerOptions[1]],
        birds[answerOptions[2]],
        birds[answerOptions[3]]
    ]

    birdChoices.forEach( bird => {
        let image = new Image()
        image.src = bird.photos[0].src.valueOf()
    })
}
**/

// Function for image preloading
function loadImages(answerOptions) {
    answerOptions.forEach( option => {
        let image = new Image()
        image.src = birds[option].photos[0].src.valueOf()
    })
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
