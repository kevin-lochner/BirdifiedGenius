

buildSoundGame()

function buildSoundGame () {
    buildAnswerOptions()
}

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
    console.log(birds[correctBirdIndex].name)
    let answer1 = document.getElementById('bird-1-label')
    let answer2 = document.getElementById('bird-2-label')
    let answer3 = document.getElementById('bird-3-label')
    let answer4 = document.getElementById('bird-4-label')
    answer1.innerHTML = birds[answerOptions[0]].name
    answer2.innerHTML = birds[answerOptions[1]].name
    answer3.innerHTML = birds[answerOptions[2]].name
    answer4.innerHTML = birds[answerOptions[3]].name

}

// This function is an adaptation of a Fisher-Yates algorithm found here:
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