function Game(playersGuess=null, pastGuesses) {
  this.playersGuess = playersGuess;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();

}

function newGame() {
  return new Game();
}

Game.prototype.playersGuessSubmission = function(number) {

  if ((number < 1) || (number > 100) || (typeof number !== "number")) {
    $('#title').text("invalid guess");
    $('#subtitle').text("must be a number between 1-100");
    throw "That is an invalid guess.";

  }
  this.playersGuess = number;
  return this.checkGuess();

};


//reworked solution!!!
Game.prototype.checkGuess = function() {

  if (this.playersGuess === this.winningNumber) {
    $('#submit, #hint').prop('disabled', true);
    $('#subtitle').text('(hit reset to play again)');
    return "you win!";

  } else {
      if (this.pastGuesses.indexOf(this.playersGuess) !== -1) {
        return "already guessed that one";
      } else {
          this.pastGuesses.push(this.playersGuess);
          $('ul li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);

          if (this.pastGuesses.length === 5) {
            $('#submit, #hint').prop('disabled', true);
            $('#subtitle').text('(hit reset to play again)');
            return "you lose";
          } else {
            var diff = this.difference();

            if (this.isLower()) {
                $('#subtitle').text('(guess higher)');
            } else {
                $('#subtitle').text('(guess lower)');
            }


              if (diff < 10) {
                return "you're burning up!";
              } else if ( diff < 25) {
                return "you're lukewarm";
              } else if ( diff < 50) {
                return "you're a bit chilly";
              } else  {
                return "you're ice cold!";
              }

        }
      }
    }

};



Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {

  return (this.playersGuess < this.winningNumber);
};

Game.prototype.provideHint = function() {
  var hintArr = [];

    var num = generateWinningNumber();
    var number = generateWinningNumber();
    hintArr.push(this.winningNumber, num, number);


  return shuffle(hintArr);
};


function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}



function shuffle(arr) { //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
   for(var i = arr.length-1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
       var temp = arr[i];
       arr[i] = arr[randomIndex];
       arr[randomIndex] = temp;
    }
    return arr;
}




$(document).ready(function() {
  var game = new Game();

  function inputAndResponse() {
    var guess = +$('#player-input').val();
    $('#player-input').val("");
    var message = game.playersGuessSubmission(guess);
    $('#title').text(message);
  }


  $('#submit').on('click', function() {
    inputAndResponse(game);
  });

  $('#player-input').on('keypress', function(e) {
    if (e.which == 13) {
      inputAndResponse(game);
    }
  });

  $('#hint').on('click', function() {
    var hints = game.provideHint();
    $('#title').text('the winning number is one of these: ' + hints[0] + ', ' + hints[1] + ', ' + hints[2]);
  });

  $('#reset').on('click', function() {
    game = newGame();

    $('#title').text('play the guessing game!');
    $('#subtitle').text('guess a number between 1-100');
    $('.guess').text('...');
    $('#submit, #hint').prop('disabled', false);

  });


});
