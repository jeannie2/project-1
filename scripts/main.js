var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var recognition = new SpeechRecognition();

/* var colors = ['aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow']; */

var transcriptNoSpaces = [];
//var grammarList = [];
let listening;
let noError;

var grammarList = [...words(50)]

// if (SpeechGrammarList) {
// SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
// This code is provided as a demonstration of possible capability. You may choose not to use it.
var speechRecognitionList = new SpeechGrammarList();
//var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

//function initGrammar() {
  var grammar = '#JSGF V1.0; grammar words; public <grammar> = ' + grammarList.join(' | ') + ' ;'
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
 // return grammar
  // }
//}

recognition.continuous = false; // default: false
recognition.lang = 'en-US';
recognition.interimResults = false; // default: false
recognition.maxAlternatives = 1; // default: 1

$(window).on('load', function () {
  if ('speechSynthesis' in window) {
    console.log('Speech recognition is supported');
    $('#my-modal').modal('show');
    init();
    //initGrammar();
  } else {
    alert('Speech recognition not supported');
  }
});

window.onunload = function () {
  window.speechSynthesis.cancel();
};

document.addEventListener('visibilitychange', function () {
  window.speechSynthesis.cancel(); // stop speaking if change tab
  // console.log('changed tab');
});

const $gameOverScreen = $('#game-over-screen')
const $gameOnScreen = $('#game-on-screen')
const $scoreMain = $('#score-main')
const $scoreGameOver = $('#score-game-over')
const $points = $('#points')
const $restart = $('#restart-btn')
const $start = $('#start-btn')
const $secondsLeft = $('#secondsLeft')
const $myModal = $('#my-modal')
const $modalClose = $('.modal-close')
const $container = $('.container')
const $gameScreen = $('#game-screen')
const $alertMessage = $('#alert-message')
// const $words = $(".word");

let $containerOffset = $container.offset()
let $gameOffset = $gameScreen.offset()
let interval = null
let divInterval = null
let timer = 60;
let score = 0
let hideWord = null;
let counter = [];
let actualWords = [];
let winningWordsArray = []
let randomWord = '';

const gameOver = () => {
  $('.word').remove();
  $scoreMain.text(score)
  $scoreGameOver.text(score)
  $gameOnScreen.hide()
  $gameOverScreen.show()
  clearInterval(divInterval);
  clearTimeout(hideWord)
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

const randomGrammarList = () => { // randomGrammarList(1);
  let randNum = Math.floor(Math.random() * grammarList.length + 1); // index: 0 to 1 less than length
  return grammarList[randNum];
}

const randomRGB = () => {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return "rgb(" + r + "," + g + "," + b + ")";
}

const randomTime = () => {
  let randomTime = Math.floor(Math.random() * (18000 - 5000 + 1) + 5000);
  return randomTime;
}

function generateText(transcript) {
  let wordDiv = document.createElement('div');
  document.body.appendChild(wordDiv);
  wordDiv.id = transcript;
  wordDiv.innerHTML = transcript;
  wordDiv.classList.add('word');
  wordDiv.style.position = 'absolute';

  // vanilla JS .offsetWidth same as jquery .outerWidth() (jquery .width is smaller)
  let leftMe = Math.random() * $gameScreen.outerWidth() + $gameOffset.left - wordDiv.offsetWidth; // - wordDiv.offsetWidth  //offsetWidth includes border so bigger
  // let leftMe = Math.random() * document.getElementById("gameScreen").offsetWidth + $gameOffset.left - wordDiv.offsetWidth;
  // console.log("leftMe: " + leftMe)
  let topMe = Math.random() * $gameScreen.outerHeight() + $gameOffset.top - wordDiv.offsetHeight;
  //let topMe = Math.random() * document.getElementById("gameScreen").offsetHeight + $gameOffset.top - wordDiv.offsetHeight;
  // console.log("topMe: " + topMe)

  // console.log("wordDiv width PETITO: " + wordDiv.offsetWidth) //cant get width of wordDiv unless append first. offsetWidth includes border so bigger

  wordDiv.style.left = leftMe + 'px';
  wordDiv.style.top = topMe + 'px';
  wordDiv.style.color = randomRGB()

  window.setTimeout(function hideWord() {
    // setTimeout(() => {
    wordDiv.style.display = 'none';
    let index = actualWords.indexOf(transcript);
    actualWords.splice(index, 1) // that word. modifies original array
    console.log('POP: ' + transcript);
    console.log('POPPED actualWords: ' + actualWords)
    console.log('POPPED actualWords length: ' + actualWords.length);
    trackWords(1)
  }, randomTime() )
  return actualWords;
}

function trackWords(num) { // counter always starts out empty when call function
  let counter = []
  while (counter.length < num) {
    randomWord = randomGrammarList(); // words(). generate random number
    console.log('randomWord: ' + randomWord)
    console.log('counter start: ' + counter)
    if (actualWords.indexOf(randomWord) === -1) {
      counter.push(randomWord)
      actualWords.push(randomWord)
      console.log('counter right now: ' + counter)
      console.log('actualWords right now: ' + actualWords)
      generateText(randomWord)
    } else {
      console.log('repeated no added')
      console.log('counter right now: ' + counter)
      console.log('actualWords right now: ' + actualWords)
    }
  }
  console.log('counter final: ' + counter);
  console.log('counter final length: ' + counter.length)
  console.log('actualWords final: ' + actualWords);
  console.log('actualWords final length: ' + actualWords.length)
  // counter = []
  return actualWords, counter;
}

function check(transcript) {
  if (actualWords.includes(transcript)) {
    let index = actualWords.indexOf(transcript);
    console.log('index of word: ' + index);
    console.log('transcript: ' + transcript);
    $('#' + transcript).addClass('win animate__animated animate__fadeOut')
    sound.src="pop.mp3"
    sound.currentTime = 0;
    sound.play();

    actualWords.splice(index, 1); // modifies original
    console.log('actualWords: ' + actualWords);
    winningWordsArray.push(transcript);
    console.log('winningWordsArray: ' + winningWordsArray);
    setTimeout(() => {
      $('#' + transcript).hide();
    }, 500)
    score++
    console.log('score: ' + score);
    $scoreMain.text(score);
  }
}

function test(spokenTranscript) {
  transcriptNoSpaces = spokenTranscript.split(" ");
  console.log(transcriptNoSpaces); //will be uppercase, ignore. pay attention to the console.log msg beginning wittranscriptNoSpaces[i
  for (let i = 0; i < transcriptNoSpaces.length; i++) {
    console.log(
      'transcriptNoSpaces[i]: ' +
      'i: ' +
      i +
      ' ' +
      transcriptNoSpaces[i].toLowerCase() //transcriptNoSpaces[i]
    );
    check(transcriptNoSpaces[i].toLowerCase()) //hope working correctly
  }
}

const runSpeechRecognition = () => {
  // function runSpeechRecognition() {
  // recognition.start();
  recognition.onstart = function () {
  listening = true;
  noError = true;
  console.log('listening...');
  // console.log("noError in recognition.onstart: " + noError);
  };

  if (!listening) {
    recognition.start();
  } else {
    console.log('already listening!');
    return; // or else throws error "failed to execute start on speechrecognition: recognition has already started"
  }
}

const handleRestart = () => {
  interval = null
  timer = 60;
  score = 0
  actualWords = []
  winningWordsArray = [];
  $gameOnScreen.show()
  $gameOverScreen.hide()
  $secondsLeft.text(timer)
  $scoreMain.text('');
}

recognition.onresult = function (event) {
  // console.log("noError in recognition.onresult: " + noError);
  let confidence = event.results[0][0].confidence; // VAR let spokenTranscript = event.result[0][0].transcript. poemspeak
  let spokenTranscript = event.results[0][0].transcript; // VAR var transcript = event.results[0][0].transcript;
  console.log('confidence: ' + confidence * 100 + '%');
  console.log('transcript: ' + spokenTranscript)
  test(spokenTranscript);
};

recognition.onend = function () {
  // recognition.onspeechend = function () {
  // console.log("noError in recognition.onend: " + noError);
  if (!noError) {
    // there is an error - no speech
    recognition.stop();
    listening = false;
    console.log('stopped recognition')
    $alertMessage.text('No speech detected, game ended')
    gameOver();
  } else {
    recognition.start();
  }
};

recognition.onnomatch = function (event) {
  console.log('Speech not recognized');
};

recognition.onerror = function (event) {
  // recognition.stop();
  console.log('error: ' + event.error);
  if (event.error === 'no-speech') {
    noError = false;
    // console.log("noError in recognition.onerror: " + noError);
    recognition.stop();
    // visibleDelay = 0; // reset visibleDelay and hiddenDelay to original values or else when start listening again, values of both continues accumulating from point stopped listening (so longer)
  }
};

const init = () => {
  //grammarList = [...words(50)] // grammarList.push(words(50));
  $start.on('click', startTimer);
  $start.on('click', runSpeechRecognition);
  $start.on('click', function() {
    trackWords(10);
    divInterval = setInterval(() => {trackWords(5)}, 10000)
    // setInterval(function () { trackWords(5) }, 10000) //  always return 5 words
  })
  $restart.on('click', handleRestart);
  $modalClose.on('click', function() {
    $('#my-modal').modal('hide');
  })
}

init();
