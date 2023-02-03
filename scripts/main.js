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
let counter = [];
let activeWords = []
let winningWordsArray = []
let randomWord = ''
let gameOverStatus = false;

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition()

var transcriptNoSpaces = [];
var grammarList = [...words(100)]
var speechRecognitionList = new SpeechGrammarList()

var grammar = '#JSGF V1.0; grammar words; public <grammar> = ' + grammarList.join(' | ') + ' ;'
speechRecognitionList.addFromString(grammar, 1)
recognition.grammars = speechRecognitionList

recognition.continuous = false
recognition.lang = 'en-US'
recognition.interimResults = false
recognition.maxAlternatives = 1

if ('speechSynthesis' in window) {
  console.log('Speech recognition is supported')
} else {
  alert('Speech recognition not supported')
}

$(window).on('load', function() {
  $('#my-modal').modal('show'); // issues getting this to work if put inside init()
});

window.onunload = function () {
  window.speechSynthesis.cancel()
};

document.addEventListener('visibilitychange', function () {
  window.speechSynthesis.cancel(); // stop speaking if change tab
});

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
  // listening = false;
  interval = null
  timer = 60;
  score = 0
  activeWords = []
  winningWordsArray = []
  $gameOnScreen.show()
  $gameOverScreen.hide()
  $secondsLeft.text(timer)
  $scoreMain.text('0')
  location.reload(true);
}

const gameOver = () => {
  console.log("GAME OVER")
  gameOverStatus = true;
  recognition.stop()
  console.log('stopped recognition')
  // noError === false
  // listening = false;
  $('.word').remove()
  $scoreMain.text(score)
  $scoreGameOver.text(score)
  $gameOnScreen.hide()
  $gameOverScreen.show()
  clearInterval(divInterval)
  return gameOverStatus
}

function generateText(transcript) {
  let wordDiv = document.createElement('div');
  document.body.appendChild(wordDiv)
  wordDiv.id = transcript
  wordDiv.innerHTML = transcript
  wordDiv.classList.add('word')
  wordDiv.style.position = 'absolute'
  wordDiv.style.color = randomRGB()
  let realLeft = Math.floor(Math.random() * (($gameOffset.left + $gameScreen.outerWidth() - wordDiv.offsetWidth) - $gameOffset.left + 1) + $gameOffset.left)
  let realTop = Math.floor(Math.random() * (($gameOffset.top + $gameScreen.outerHeight() - wordDiv.offsetHeight) - $gameOffset.top + 1) + $gameOffset.top)
  wordDiv.style.left = realLeft + 'px'
  wordDiv.style.top = realTop + 'px'
  // vanilla JS .offsetWidth same as jquery .outerWidth() (jquery .width is smaller)
  // offsetWidth includes border so bigger
  // cant get width of wordDiv unless append first
}

function trackWords(num) { // counter always starts out empty when call function
  let counter = []
  while (counter.length < num) {
    randomWord = randomGrammarList();
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
  }
  console.log('counter final: ' + counter)
  console.log('counter final length: ' + counter.length)
  console.log('activeWords final: ' + activeWords)
  console.log('activeWords final length: ' + activeWords.length)
  return activeWords, counter;
}

function check(transcript) {
  if (activeWords.includes(transcript) ) {
    let index = activeWords.indexOf(transcript)
    console.log('index of word: ' + index)
    console.log('transcript: ' + transcript)
    $('#' + transcript).css('-webkit-text-stroke', randomRGB())
    $('#' + transcript).css('-webkit-text-fill-color', randomRGB())
    $('#' + transcript).addClass('animate__animated animate__fadeOut')
    document.getElementById('sound').play()
    activeWords.splice(index, 1); // modifies original
    console.log('activeWords: ' + activeWords)
    winningWordsArray.push(transcript)
    console.log('winningWordsArray: ' + winningWordsArray)
    score++
    console.log('score: ' + score)
    $scoreMain.text(score)
  } else {
    console.log("no match: " + transcript)
  }
}

function test(spokenTranscript) {
  transcriptNoSpaces = spokenTranscript.split(" ")
  console.log(transcriptNoSpaces); // will be uppercase, ignore. pay attention to the console.log msg beginning with transcriptNoSpaces[i
  for (let i = 0; i < transcriptNoSpaces.length; i++) {
    console.log(
      'transcriptNoSpaces[i]: ' +
      'i: ' +
      i +
      ' ' +
      transcriptNoSpaces[i].toLowerCase()
    );
    check(transcriptNoSpaces[i].toLowerCase())
  }
}

/* const runSpeechRecognition = () => {
  console.log('listening...')
} */

recognition.onresult = function (event) {
  let confidence = event.results[0][0].confidence;
  let spokenTranscript = event.results[0][0].transcript;
  console.log('confidence: ' + confidence * 100 + '%')
  console.log('transcript: ' + spokenTranscript)
  test(spokenTranscript)
  // window.speechSynthesis.resume
};

recognition.onend = function () {
  console.log('stopped recognition')
  if(gameOverStatus === false) {
    recognition.start()
  } else {
    recognition.stop();
  }
};

recognition.onnomatch = function (event) {
  console.log('Speech not recognized')
};

recognition.onerror = function (event) {
  console.log('error occurred in recognition: ' + event.error);
  if (event.error === 'no-speech') {
    $alertMessage.text('No speech detected, game ended')
    gameOver();
    // clearInterval(interval)
  }
};

const init = () => {
  $start.on('click', startTimer)
  // $start.on('click', runSpeechRecognition);
  $start.on('click', function() {
    recognition.start()
  })
  $start.on('click', function() {
    trackWords(10);
    divInterval = setInterval(() => {trackWords(5)}, 10000)
    // setInterval(function () { trackWords(5) }, 10000) //  always return 5 words
  })
  $restart.on('click', handleRestart)
  $('.modal-close').on('click', function() {
    $('#my-modal').modal('hide')
  })
}

init();
