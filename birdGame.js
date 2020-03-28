let checkAnswerButton = document.getElementById('check-answer')
let replayButton = document.getElementById('play-again')
let answerMessage = document.getElementById('answer-text')


playSoundGame()

function playSoundGame () {
    let correctBirdIndex = buildAnswerOptions()
    buildButtons(correctBirdIndex)
}

//Function to pick a the bird sound we'll play
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

//Function to randomly select and order 3 birds, along with the correct answer
function buildAnswerOptions () {
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
    let answer2Checked = document.getElementById('answer-2')
    let answer3Checked = document.getElementById('answer-3')
    let answer4Checked = document.getElementById('answer-4')
    answer1Checked.checked = false
    answer2Checked.checked = false
    answer3Checked.checked = false
    answer4Checked.checked = false

    return correctBirdIndex
}

//Function to define check answer and play again buttons
function buildButtons (correctBirdIndex) {
    checkAnswerButton.addEventListener('click', function () {
        // Which button is checked?
        // Get the text associated with the answer
        let userAnswer = document.getElementById(document.querySelector('input[name = answer]:checked').id + '-label').innerHTML
        // Compare
        if (userAnswer === birds[correctBirdIndex].name) {
            answerMessage.innerHTML = 'Correct!'
        } else answerMessage.innerHTML = `Sorry, ${birds[correctBirdIndex].name} is the right answer.`

    })

    replayButton.addEventListener('click', function () {
        answerMessage.innerText = ''
        playSoundGame()
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