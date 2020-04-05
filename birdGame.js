// This script creates and runs a quiz game on bird calls

// Define variables used globally, mostly HTML elements
let checkAnswerButton = document.getElementById('check-answer')
let replayButton = document.getElementById('play-again')
let answerMessage = document.getElementById('answer-text')
let imageMatch = document.getElementById('image-match')
let audio = document.getElementById('bird-sound')
let imageCredit = document.getElementById('image-credit')
let audioCredit = document.getElementById('audio-credit')
let progress = 0
let recentAudio = []

// Play the game (main function)
playGame()

// Basic gameplay function, adds functionality to the (non-answer) buttons and sets the game up the first time
function playGame() {

    // Start by ensuring the world location selector is checked
    let worldChecked = document.getElementById('world')
    worldChecked.checked = true

    // For the first time, build the list of available indexes based on the World
    let currentIndexOptions = buildCurrentIndexOptions('World')

    // Run buildGame to define select the correct answer and build the game based on the available indexes
    let correctAnswerIndex = buildGame(currentIndexOptions)

    // Define check answer button functions
    checkAnswerButton.addEventListener('click', function () {
        if (correctAnswerIndex != null) {
            // Stop the audio
            audio.pause()
            // Find what answer the user selected
            let userAnswer = document.getElementById(document.querySelector('input[name = answer]:checked').id + '-label').innerHTML
            // Check the answer and respond accordingly
            if (userAnswer === birds[correctAnswerIndex].name) {
                // Display the message, update progress iterator and run the displayProgress function to update the bar
                answerMessage.innerHTML = `${birds[correctAnswerIndex].name} is correct!`
                progress += 1
                displayProgress()
                correctAnswerIndex = null
            } else {
                // Set the image to correspond with the correct answer, display message, update progress
                imageMatch.src = birds[correctAnswerIndex].photos[0].src
                answerMessage.innerHTML = `Sorry, ${birds[correctAnswerIndex].name} is the right answer.`
                progress = 0
                displayProgress()
            }
        } else answerMessage.innerHTML = 'You\'ve already made a guess this sound. Click Play again to try another.'
    })

    // Define play again button functions
    replayButton.addEventListener('click', function () {
        // Clear the answer message
        answerMessage.innerText = ''

        // Reset the game
        correctAnswerIndex = buildGame(currentIndexOptions)
    })

    // Create and define location selection buttons
    let locationIds = ['world-label', 'united-states-label', 'minnesota-label']
    let locationLabels = locationIds.map(function (id) {
        return document.getElementById(id)
    })

    locationLabels.forEach(function (locationLabel) {
        locationLabel.addEventListener('click', function () {
            currentIndexOptions = buildCurrentIndexOptions(locationLabel.innerHTML)
            replayButton.click()

        })
    })

}

// Function to build an array of options to correspond with the selected location
function buildCurrentIndexOptions(locationLabelText) {
    let locationArray = []
    for (let n = 0; n < birds.length; n++) {
        // everything goes into the array
        if (locationLabelText === 'World') {
            locationArray.push(n)
        }
        // Otherwise, make sure the location we are searching is in the file before adding
        else {
            if (birds[n].location.includes(locationLabelText)) {
                locationArray.push(n)
            }
        }
    }
    return locationArray
}

// Function to select a random bird as the correct answer
function selectCorrectAnswer(currentIndexOptions) {
    // Choose random index from birds.js based on the currentIndexOptions variable determined by location selector buttons
    let correctAnswerIndex = currentIndexOptions[Math.floor(Math.random() * currentIndexOptions.length)]
    return correctAnswerIndex
}

// Function to validate and load the audio connected to the selected bird
function setAudio(correctAnswerIndex) {
    // Select the correct answer's object from birds.js
    let correctAnswerObject = birds[correctAnswerIndex]

    // Select a random index from the correct object's sounds array
    let randomSoundIndex = Math.floor(Math.random() * correctAnswerObject.sounds.length)
    let audioSource = correctAnswerObject.sounds[randomSoundIndex].src

    // If selected audio is not one of the four most recently played calls, load it into the audio element, add its
    // credit below, add it to the recent audio array, and return true, otherwise, return false so we can try again
    if (!recentAudio.includes(audioSource)) {
        audio.src = audioSource
        audioCredit.innerHTML = `Audio: ${correctAnswerObject.sounds[randomSoundIndex].credit}`
        trackRecentAudio(audioSource)
        return true
    } else return false
}

// Function that stores the last 4 audio clips
function trackRecentAudio(audioSource) {
    // Add the audio clip to the array, if the clip makes the array longer than 4 items, get rid of the oldest item
    recentAudio.push(audioSource)

    if (recentAudio.length > 4) {
        recentAudio.splice(0, 1)
    }
}

// Function to create an array of 4 random answer options
function createAnswerOptions(correctAnswerIndex, currentIndexOptions) {
    // Create array of options that includes the "correct" index
    let answerOptions = [correctAnswerIndex]

    // Add three more random indexes from the list of current options
    while (answerOptions.length < 4) {
        let newAnswerIndex = currentIndexOptions[Math.floor(Math.random() * currentIndexOptions.length)]
        if (!answerOptions.includes(newAnswerIndex)) {
            answerOptions.push(newAnswerIndex)
        }
    }
    // Randomly reorder the answer options
    shuffle(answerOptions)

    return answerOptions
}

// Function to build the game's unique elements
function buildGame(currentIndexOptions) {
    // Select an index to serve as the correct answer
    let correctAnswerIndex = selectCorrectAnswer(currentIndexOptions)

    // If the audio selected based on correctAnswerIndex wasn't used recently, go ahead and set up the game
    if (setAudio(correctAnswerIndex)) {

        // Create the rest of the potential answers
        let answerOptions = createAnswerOptions(correctAnswerIndex, currentIndexOptions)

        // Pre load the images for each answer option for faster swaps
        loadImages(answerOptions)

        // Select and assign the answer labels
        let answerIds = ['answer-1-label', 'answer-2-label', 'answer-3-label', 'answer-4-label']
        let answerLabels = answerIds.map(function (id) {
            return document.getElementById(id)
        })

        // Each answer label is a button (it looks better than radio buttons)
        // Each button has a click event listener calling a function to display the image of the
        // selected bird when it's clicked
        answerLabels.forEach(function (label, index) {
            let answerName = birds[answerOptions[index]].name
            label.innerHTML = answerName
            label.addEventListener('click', function () {
                switchImage([index], answerOptions)
            })
        })

        // Set the first answer to checked (tried just using .click() on the first answer label, but it had the cache
        // and flash issue loadImages was implemented to prevent--this seems to solve it
        let answer1Checked = document.getElementById('answer-1')
        answer1Checked.checked = true

        // Set the image on the right hand side of the page to match the first answer option
        switchImage(0, answerOptions)

    } else {
        // If the audio selected was played too recently, try again
        correctAnswerIndex = buildGame(currentIndexOptions)
    }

    return correctAnswerIndex
}

// Function to update the image on the right to correspond with the currently selected answer and display its credit below
function switchImage(n, answerOptions) {
    imageMatch.src = birds[answerOptions[n]].photos[0].src
    imageMatch.alt = `${birds[answerOptions[n]].name}`
    imageCredit.innerHTML = `Photo: ${birds[answerOptions[n]].photos[0].credit}`
}

// Function for updating progress bar
function displayProgress() {
    let progressBar = document.getElementById('progress-bar')
    // Set to allow 25 correct answers before full
    progressBar.style.width = `${progress * 4}%`
    // Update value
    progressBar.setAttribute('aria-ValueNow', progress)
    progressBar.innerHTML = `Streak: ${progress}`
}

// Function for image preloading
function loadImages(answerOptions) {
    answerOptions.forEach(option => {
        let image = new Image()
        image.src = birds[option].photos[0].src
    })
}

// This function is an adaptation of the Fisher-Yates algorithm found here:
// https://medium.com/@joshfoster_14132/best-javascript-shuffle-algorithm-c2c8057a3bc1
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }
}

