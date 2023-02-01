const $gameOverScreen = $('#game-over-screen')
const $gameOnScreen = $('#game-on-screen')
const $gameScreen = $('#game-screen')
const $alertMessage = $('#alert-message')
const $secondsLeft = $('#secondsLeft')
const $scoreMain = $('#score-main')
const $scoreGameOver = $('#score-game-over')
const $start = $('#start-btn')
const $restart = $('#restart-btn')

let $gameOffset = $gameScreen.offset()
let interval = null
let divInterval = null
let timer = 60;
let score = 0
let hideWord = null
let counter = [];
let activeWords = []
let winningWordsArray = []
let randomWord = ''

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition()

var transcriptNoSpaces = [];
var grammarList = [...words(50)]
let listening
// let noError

// if (SpeechGrammarList) {
// SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
// This code is provided as a demonstration of possible capability. You may choose not to use it.
var speechRecognitionList = new SpeechGrammarList()

var grammar = '#JSGF V1.0; grammar words; public <grammar> = ' + grammarList.join(' | ') + ' ;'
speechRecognitionList.addFromString(grammar, 1)
recognition.grammars = speechRecognitionList

recognition.continuous = false // default: false
recognition.lang = 'en-US'
recognition.interimResults = false // default: false
recognition.maxAlternatives = 1 // default: 1

$(window).on('load', function() {
  $('#my-modal').modal('show');
});

window.onunload = function () {
  window.speechSynthesis.cancel()
};

document.addEventListener('visibilitychange', function () {
  window.speechSynthesis.cancel(); // stop speaking if change tab
  // console.log('changed tab');
});

if ('speechSynthesis' in window) {
  console.log('Speech recognition is supported')
} else {
  alert('Speech recognition not supported')
}

const randomGrammarList = () => {
  let randNum = Math.floor(Math.random() * grammarList.length + 1); // index: 0 to 1 less than length
  return grammarList[randNum]
}

const randomRGB = () => {
  let r = Math.floor(Math.random() * 256)
  let g = Math.floor(Math.random() * 256)
  let b = Math.floor(Math.random() * 256)
  return "rgb(" + r + "," + g + "," + b + ")"
}

const randomTime = () => {
  let randomTime = Math.floor(Math.random() * (18000 - 5000 + 1) + 5000)
  console.log("RANDOM TIME: " + randomTime)
  return randomTime
}

const startTimer = () => {
  if (!interval) {
    interval = setInterval(() => {
      timer -= 1
      $secondsLeft.text(timer)
      if (timer === 0) {
        clearInterval(interval)
        gameOver()
      }
    }, 1000)
  }
}

const handleRestart = () => {
  interval = null
  timer = 60;
  score = 0
  activeWords = []
  winningWordsArray = []
  $gameOnScreen.show()
  $gameOverScreen.hide()
  $secondsLeft.text(timer)
  $scoreMain.text('')
}

const gameOver = () => {
  console.log("GAME OVER")
  // noError === false
  recognition.stop()
  // listening = false;
  console.log('stopped recognition')
  $('.word').remove()
  $scoreMain.text(score)
  $scoreGameOver.text(score)
  $gameOnScreen.hide()
  $gameOverScreen.show()
  clearInterval(divInterval)
  clearTimeout(hideWord)
}

  let unspokenExpiredWords = []
//let timerME = 5000;

function generateText(transcript) {
  let wordDiv = document.createElement('div');
  document.body.appendChild(wordDiv)
  wordDiv.id = transcript
  wordDiv.innerHTML = transcript
  wordDiv.classList.add('word')
  wordDiv.style.position = 'absolute'

  let realLeft = Math.floor(Math.random() * (($gameOffset.left + $gameScreen.outerWidth() - wordDiv.offsetWidth) - $gameOffset.left + 1) + $gameOffset.left)
  let realTop = Math.floor(Math.random() * (($gameOffset.top + $gameScreen.outerHeight() - wordDiv.offsetHeight) - $gameOffset.top + 1) + $gameOffset.top)

  // vanilla JS .offsetWidth same as jquery .outerWidth() (jquery .width is smaller)
  let leftMe = Math.random() * $gameScreen.outerWidth() + $gameOffset.left - wordDiv.offsetWidth // - wordDiv.offsetWidth  //offsetWidth includes border so bigger
  // let leftMe = Math.random() * document.getElementById("gameScreen").offsetWidth + $gameOffset.left - wordDiv.offsetWidth;
  // console.log("leftMe: " + leftMe)
  let topMe = Math.random() * $gameScreen.outerHeight() + $gameOffset.top - wordDiv.offsetHeight
  // let topMe = Math.random() * document.getElementById("gameScreen").offsetHeight + $gameOffset.top - wordDiv.offsetHeight;
  // console.log("topMe: " + topMe)

  // console.log("wordDiv width PETITO: " + wordDiv.offsetWidth) //cant get width of wordDiv unless append first. offsetWidth includes border so bigger

  wordDiv.style.left = realLeft + 'px'
  wordDiv.style.top = realTop + 'px'
  wordDiv.style.color = randomRGB()

  // let removedWords = []
  // wordDiv.classList.add("mynewmove")
  // wordDiv.style.animationName = 'mynewmove';
   // wordDiv.style.animationDelay = "5000s" //randomTime() + "ms";

   wordDiv.addEventListener("animationend", peacock)

  function peacock() {
    let indexTimeout = activeWords.indexOf(transcript)
    activeWords.splice(indexTimeout, 1) // that word. modifies original array
    console.log('POP: ' + transcript)
    console.log('POPPED activeWords: ' + activeWords)
    console.log('POPPED activeWords length: ' + activeWords.length)
    return activeWords
  }

  /* setTimeout(function hideWord() { // window.setTimeout(function hideWord() {
    wordDiv.classList.add("HOW")
    // setTimeout(() => {
    // wordDiv.classList.add('animate__animated', 'animate__fadeOut')
    // wordDiv.style.display = 'none'
    let indexTimeout = activeWords.indexOf(transcript)
    activeWords.splice(indexTimeout, 1) // that word. modifies original array
    console.log('POP: ' + transcript)
    console.log('POPPED activeWords: ' + activeWords)
    console.log('POPPED activeWords length: ' + activeWords.length)
    // console.log('unspokenExpired words: ' + unspokenExpiredWords)
    // trackWords(1)
  }, randomTime() )
  return activeWords */
 // timerME += 1000;
}

function trackWords(num) { // counter always starts out empty when call function
  let counter = []
  while (counter.length < num) {
    randomWord = randomGrammarList(); // words(). generate random number
    console.log('randomWord: ' + randomWord)
    console.log('counter start: ' + counter)
    if (activeWords.indexOf(randomWord) === -1) {
      counter.push(randomWord)
      activeWords.push(randomWord)
      console.log('counter right now: ' + counter)
      console.log('activeWords right now: ' + activeWords)
      generateText(randomWord);
    } else {
      console.log('repeated no added')
      console.log('counter right now: ' + counter)
      console.log('activeWords right now: ' + activeWords)
    }
    // randomDelay += 50;
    // return randomDelay;
  }
  console.log('counter final: ' + counter)
  console.log('counter final length: ' + counter.length)
  console.log('activeWords final: ' + activeWords)
  console.log('activeWords final length: ' + activeWords.length)
  // counter = []
  return activeWords, counter;
}

function check(transcript) {
  if (activeWords.includes(transcript)) {
    let index = activeWords.indexOf(transcript)
    console.log('index of word: ' + index)
    console.log('transcript: ' + transcript)
    // $('#' + transcript).addClass('win')
    $('#' + transcript).css('-webkit-text-stroke', randomRGB())
    $('#' + transcript).css('-webkit-text-fill-color', randomRGB())
    $('#' + transcript).addClass('animate__animated animate__fadeOut')
    document.getElementById('sound').play()
    activeWords.splice(index, 1); // modifies original
    console.log('activeWords: ' + activeWords)
    winningWordsArray.push(transcript)
    console.log('winningWordsArray: ' + winningWordsArray)
    /* setTimeout(() => {
      $('#' + transcript).hide()
    }, 500) */
    score++
    console.log('score: ' + score)
    $scoreMain.text(score)
  } else {
    console.log("no match: " + transcript)
  }
}

function test(spokenTranscript) {
  transcriptNoSpaces = spokenTranscript.split(" ")
  console.log(transcriptNoSpaces); //will be uppercase, ignore. pay attention to the console.log msg beginning wittranscriptNoSpaces[i
  for (let i = 0; i < transcriptNoSpaces.length; i++) {
    console.log(
      'transcriptNoSpaces[i]: ' +
      'i: ' +
      i +
      ' ' +
      transcriptNoSpaces[i].toLowerCase() // transcriptNoSpaces[i]
    );
    check(transcriptNoSpaces[i].toLowerCase()) //hope working correctly
  }
}

const runSpeechRecognition = () => {
  // function runSpeechRecognition() {
  // recognition.start();
  // recognition.start()
  recognition.onstart = function () {
  listening = true
  noError = true
  console.log('listening...')
  // console.log("noError in recognition.onstart: " + noError);
  }

  if (!listening) {
    recognition.start()
  } else {
    console.log('already listening!')
    return; // or else throws error "failed to execute start on speechrecognition: recognition has already started"
  }
}

recognition.onresult = function (event) {
  // console.log("noError in recognition.onresult: " + noError);
  let confidence = event.results[0][0].confidence; // VAR let spokenTranscript = event.result[0][0].transcript. poemspeak
  let spokenTranscript = event.results[0][0].transcript; // VAR var transcript = event.results[0][0].transcript;
  console.log('confidence: ' + confidence * 100 + '%')
  console.log('transcript: ' + spokenTranscript)
  test(spokenTranscript)
};

recognition.onend = function () {
  recognition.stop();
  // listening = false;
  // console.log('stopped recognition')

  // recognition.onspeechend = function () {
  // console.log("noError in recognition.onend: " + noError);
  if (!noError) {
    // there is an error - no speech
    recognition.stop()
    listening = false;
    console.log('stopped recognition')
    $alertMessage.text('No speech detected, game ended')
    gameOver()
  } else {
    recognition.start()
  }
};

recognition.onnomatch = function (event) {
  console.log('Speech not recognized')
};

recognition.onerror = function (event) {
  console.log('error occurred in recognition: ' + event.error);
  /* */
  // recognition.stop();
  // console.log('error: ' + event.error);
  if (event.error === 'no-speech') {
    noError = false
    // console.log("noError in recognition.onerror: " + noError);
    recognition.stop()
    $alertMessage.text('No speech detected, game ended')
    // gameOver();
    // clearInterval(interval)
  }
};

const init = () => {
  $start.on('click', startTimer)
  $start.on('click', runSpeechRecognition);
  $start.on('click', function() {
    trackWords(10);
    divInterval = setInterval(() => {trackWords(5)}, 5000)
    // setInterval(function () { trackWords(5) }, 10000) //  always return 5 words
  })
  $restart.on('click', handleRestart)
  $('.modal-close').on('click', function() {
    $('#my-modal').modal('hide')
  })
}

init();
