/*function noOverlap() {
  if()
} */
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent =
      SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    var recognition = new SpeechRecognition();

    /* var colors = ['aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
    */

    if (SpeechGrammarList) {
        // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
        // This code is provided as a demonstration of possible capability. You may choose not to use it.
        var speechRecognitionList = new SpeechGrammarList();
        var grammar = ''
       //my idea: get 50 words, add all to grammar at first initialization. using the actualwords so no duplicate
       //   var grammar = '#JSGF V1.0; grammar words; public <word> = ' + words.join(' | ') + ' ;'

        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
      }

    /* from poemspeak: var grammar = '#JSGF V1.0; grammar spokenwords; public <spokenword> = the | lamp | once | out | cool | stars | enter | window | frame;' //no The
    // var words = [ 'bang' , 'pow' , 'boom', 'kersplat', 'pop'];
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList; */

    var transcriptNoSpaces = [];
    /* var speechRecognitionList = new SpeechGrammarList(); // poemspeak
      speechRecognitionList.addFromString(grammar, 1); // poemspeak
      recognition.grammars = speechRecognitionList; // poemspeak */

    recognition.continuous = false; // default: false
    recognition.lang = "en-US";
    recognition.interimResults = false; // default: false. poemspeak
    recognition.maxAlternatives = 1; // default: 1. poemspeak


  //added from here the stt part
  if ("speechSynthesis" in window) {
    console.log("Speech recognition is supported");
  } else {
    alert("Speech recognition not supported");
  }

    window.onunload = function () {
      window.speechSynthesis.cancel();
    };

    document.addEventListener("visibilitychange", function () {
      window.speechSynthesis.cancel();
      console.log("changed tab"); // stop speaking if change tab
    });

    let listening;
    let noError;

    // document.body.addEventListener("click", runSpeechRecognition, true);
    // runSpeechRecognition();

  const $gameOverBox = $('#game-over-box')
  const $gameOnBox = $('#game-on-box')
  const $scoreMain = $('#scoreMain')
  const $scoreGameOver = $('#scoreGameOver')
  const $points = $("#points")

  const $restart = $('#restart-btn')
  const $start = $("#start-btn")

  const $secondsLeft = $('#secondsLeft')
  const $sound = $("#sound");

  let $container = $(".container")
  let $containerOffset = $container.offset()

  let $gameScreen = $("#gameScreen")
  let $gameOffset = $gameScreen.offset()
  let $alertMessage = $("#alert-message")

  let $words = $(".word");

  let interval = null
  let timer = 60;
  let score = 0
  let winningWordsArray = []

  let oyster;
  let scooter = [];
  let bbgun = [];

  const gameOver = () => {
      $(".word").remove();
      $gameOnBox.hide()
      $gameOverBox.show()
      $scoreMain.text(score)
      $scoreGameOver.text(score)
    }

    const startTimer = () => {
      console.log("MAYDAY")
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

// var randomWords = require('random-words');
// import randomWords from "random-words";
// console.log(randomWords());

  $("button.close").on("click", function(event) {
    $('#myModal').modal('hide');
  });

function randomRGB() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return "rgb(" + r + "," + g + "," + b + ")";
}

function generateText(transcript) {
  console.log("LEFT: " + $gameOffset.left + " TOP: " + $gameOffset.top + " RIGHT: " + $gameOffset.right + " BOTTOM: " + $gameOffset.bottom)

  let wordDiv = document.createElement("div");
  document.body.appendChild(wordDiv);
  wordDiv.innerHTML = transcript; //JQUERY
  wordDiv.id = transcript;  //JQUERY
  wordDiv.classList.add("word"); //JQUERY
  //$wordDiv.html("HOWDY");
  //$wordDiv.addClass("word");
  wordDiv.style.position = "absolute"; //correct? JQUERY

  let leftMe = Math.random() * document.getElementById("gameScreen").offsetWidth + $gameOffset.left - wordDiv.offsetWidth; //- wordDiv.offsetWidth
  // let leftMe = Math.random() * document.getElementById("gameScreen").offsetWidth - wordDiv.offsetWidth;
  // console.log("gamescreen width: " + document.getElementById("gameScreen").offsetWidth )
  //let wordWidth = wordDiv.getBoundingClientRect()
  //console.log("wordDiv width: " + wordWidth.width) //offsetWidth includes border so biger
  console.log("leftMe: " + leftMe)

  let topMe = Math.random() * document.getElementById("gameScreen").offsetHeight + $gameOffset.top - wordDiv.offsetHeight;
  // let topMe = Math.random() * document.getElementById("gameScreen").offsetHeight - wordDiv.offsetHeight;
  console.log("topMe: " + topMe)
  // let left = 300;

  wordDiv.style.left = leftMe + "px"; //JQUERY?
  wordDiv.style.top = topMe + "px"; //JQUERY?
  //wordDiv.syle.left = leftMe;

  wordDiv.style.color = randomRGB() //JQUERY?

   setTimeout(() => {
    wordDiv.style.display = "none"; //jquery
    let index = actualWords.indexOf(transcript);
    actualWords.splice(index, 1) // that word. modifies original array
    console.log("POP: " + transcript);
    console.log("POPPED actualWords: " + actualWords)
    console.log("POPPED actualWords length: " + actualWords.length);
    batman(1)
  }, randomTime() )

  //wordDiv.css({top: top, left: left, position: 'absolute'})

  console.log("wordDiv width PETITO: " + wordDiv.offsetWidth) //cant get with of wordDiv unless append first. offsetWidth includes border so biger
  return actualWords;
}

function randomTime() {
  let randomTime = Math.floor(Math.random() * (18000 - 5000 + 1) + 5000);
  // console.log("randomTime: " + randomTime)
  return randomTime;
}

  $(window).on('load', function () {
    $('#myModal').modal('show');
  });

  let actualWords = [];
  let roar = [
    "boat", "car", "butter", "horse", "sheep", "cat", "tiger", "lion", "plane", "paper", "rock", "scissors", "camp", "school", "blanket", "underwear", "airplane", "noodles", "city", "street", "needle", "thread", "africa", "ocean", "computer", "pc", "mouse", "lizard", "desktop", "dress", "shirt", "golf", "tape", "shoes", "spaghetti", "glass", "beer", "water", "juice", "orange", "star", "moon", "sky", "sun", "planet", "whale", "tissue", "peanuts", "jelly", "bread", "rice", "bat", "bike", "batman", "batgirl", "robin", "hat", "cap", "elephant", "book", "library", "lamp", "mountain", "grass", "milk", "cow", "beef", "chicken", "pork", "corn", "chestnut", "banana", "mango", "lychee", "sea", "bell", "pan"
  ]

  function peacock() {
      let randNum = Math.floor(Math.random() * (roar.length - 0 + 1) + 0);
      return roar[randNum];
  }

function ironman(dog) {
  while (scooter.length < dog) {
    oyster = peacock(); // generate random number
    console.log("oyster: " + oyster)
    if(scooter.indexOf(oyster) === -1) {
      scooter.push(oyster)
      console.log("scooter right now: " + scooter)
    } else {
      console.log("repeated no added")
      console.log("scooter right now: " + scooter)
    }
  }
  console.log("scooter: " + scooter);
  return scooter;
}

//ironman(5)

/* UPDATE TO THIS WHEN NPM DONE
let oyster;

function bat(num) {
    while (actualWords.length < num) {
      oyster = randomWords(); //generate random numer
      console.log("oyster: " + oyster)
      if (actualWords.indexOf(oyster) === -1) {
        actualWords.push(oyster)
        console.log("actualWords right now: " + actualWords)
        generateText(oyster)
      } else {
        console.log("repeated no added")
        console.log("actualWords right now: " + actualWords)
      }
    }
    console.log("actualWords final: " + actualWords);
    return actualWords;
  }
*/


  function batman(num) { // bbgun always starts out empty when call function
   // let bbgun = []
    while (bbgun.length < num) {
      oyster = peacock(); //generate random numer
      console.log("oyster: " + oyster)
      console.log("bbgun start: " + bbgun)
      if (actualWords.indexOf(oyster) === -1) {
        bbgun.push(oyster)
        actualWords.push(oyster)
        console.log("bbgun right now: " + bbgun)
        console.log("actualWords right now: " + actualWords)
        generateText(oyster)
      } else {
        console.log("repeated no added")
        console.log("bbgun right now: " + bbgun)
        console.log("actualWords right now: " + actualWords)
      }
    }
    console.log("bbgun final: " + bbgun);
    console.log("bbgun final length: " + bbgun.length)
    console.log("actualWords final: " + actualWords);
    console.log("actualWords final length: " + actualWords.length)
    bbgun = []
    return actualWords, bbgun;
  }

  function check(transcript) {
    if (actualWords.includes(transcript)) {
      let index = actualWords.indexOf(transcript);
      console.log("index of word: " + index);
      let search = "#" + transcript.toString();
      console.log("transcript: " + transcript);
      console.log("search: " + search)
      console.log("DOCDOC: " + document.getElementById(transcript))
      document.getElementById(transcript).classList.add("win"); // CONVERT TO JQUERY
      document.getElementById(transcript).classList.add("animate__animated", "animate__fadeOut"); //CONVERT TO JQUERY

      sound.src = "pop.mp3";
      sound.currentTime = 0;
      sound.play(); // bit delay b4 start

      actualWords.splice(index, 1); // modifies original
      console.log("actualWords: " + actualWords);

      winningWordsArray.push(transcript);
      console.log("winningWordsArray: " + winningWordsArray);

      setTimeout(() => {
        document.querySelector(search).style.display = "none" // CONVERT TO JQUERY
      }, 500)
      //grammarlist
      score++
      console.log("score: " + score);
      $scoreMain.text(score);
      return index;
    }
    //return wordsArray;
  }
//else no match

    function test(spokenTranscript) {
      transcriptNoSpaces = spokenTranscript.split(" ");
      console.log(transcriptNoSpaces); //will be uppercase, ignore. pay attention to the console.log msg beginning with transcriptNoSpaces[i]

      for (let i = 0; i < transcriptNoSpaces.length; i++) {
        console.log(
          "transcriptNoSpaces[i]: " +
          "i: " +
          i +
          " " +
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
        console.log("listening...");
        // console.log("noError in recognition.onstart: " + noError);
      };

      if (!listening) {
        recognition.start();
      } else {
        console.log("already listening!");
        return; // or else throws error "failed to execute start on speechrecognition: recognition has already started"
      }
    }

    const handleRestart = () => {
      interval = null
      timer = 60;
      score = 0
      actualWords = []
      winningWordsArray = [];

      $gameOnBox.show()
      $gameOverBox.hide()
      $secondsLeft.text(timer)

      $scoreMain.text('');
      //$input.val('')
      //$input.removeClass('error')

      //generateText()
    }


  const init = () => {
    // generateText("HOWDY");
    $start.on('click', startTimer);
    $start.on('click', runSpeechRecognition);
    $start.on('click', function() {
       batman(10);
       setInterval(function () { batman(5) }, 10000) //  always return 10 words
    })
    $restart.on('click', handleRestart);
  }

    init();

    // recognition.start();

    recognition.onresult = function (event) {
      // console.log("noError in recognition.onresult: " + noError);
      let confidence = event.results[0][0].confidence; // VAR let spokenTranscript = event.result[0][0].transcript. poemspeak
      let spokenTranscript = event.results[0][0].transcript; // VAR var transcript = event.results[0][0].transcript;
      console.log("confidence: " + confidence * 100 + "%");
      console.log("transcript: " + spokenTranscript);

      test(spokenTranscript);
    };

    recognition.onend = function () {
      // recognition.onspeechend = function () {
      // console.log("noError in recognition.onend: " + noError);
      if (!noError) {
        // there is an error - nospeech
        recognition.stop();
        listening = false;
        console.log("stopped recognition");

        $alertMessage.text('No speech detected, game ended')
        gameOver();
      } else {
        recognition.start();
      }
    };

    recognition.onnomatch = function (event) {
      console.log("Speech not recognised");
    };

    recognition.onerror = function (event) {
      // recognition.stop();
      console.log("error: " + event.error);
      if (event.error === "no-speech") {
        noError = false;
        // console.log("noError in recognition.onerror: " + noError);
        recognition.stop();

        //visibleDelay = 0; // reset visibleDelay and hiddenDelay to original values or else when start listening again, values of both continues accumulating from point stopped listening (so longer)
        // COMMENTED OUT STAYONPAGE hiddenDelay = 1600;
      }
    };
