// Wait for DOM to load
$(document).ready(function() {


  // Get dictionary terms passed to view, and convert back to object
  var dataFromView = $('#countries_data').html();
  var countries = JSON.parse(dataFromView);

  var dataFromView = $('#username_data').html();
  var username = JSON.parse(dataFromView);

  var dataFromView = $('#userk_data').html();
  var userk = JSON.parse(dataFromView);
  var knowledge = userk[0].knowledge; 
  
  console.log("countries ", countries );
  console.log("knowledge ", knowledge );

  
  // User class
  class User {
    constructor (name, knowledge) {
    this.username = name;
    this.knowledge = knowledge;
    };
  };
 
  // Instantiate user
  var user = new User (username, knowledge );
 
  // Main application Class
  class GeoQuiz {
    constructor (user, countries) {
    this.user = user; 
    this.dict = countries;
    this.knowledgeTerm = {};
    this.questionNumber = 0;
    this.numberCorrect = 0;
    this.questions = [];
    this.answers = [];
    };

    initializeQuiz() {

      // Set features and listen on CLOSE button
      $('#close-btn').unbind('click');
      $('#close-btn').click(function(){
        $('#navigation').removeClass('d-none');
        $('.correct').addClass('d-none');
        $('.wrong').addClass('d-none');
        geo.showResults();
      });
        
    $('#navigation').addClass('d-none');
    geo.getQuestionOrder();
    }

    getQuestionOrder() {
      // create array of Terms in order

      var temp = []
      for ( let i=0; i < countries.length; i++ ) {
        
        // get user strength score or this term and square it
        var strength = geo.user.knowledge.find ( k => k._id = countries[i]._id ).strength

        var chance = Math.pow( strength, 2 )

        // add to chance factor the stage squared
        chance += Math.pow(countries[i].stage, 2)

        // add a random factor (adding 0-9 to weight)
        chance += Math.floor(Math.random() * 10 );

        temp.push( { "country" : countries[i], "weight" : chance } )
      }
      
      // sort the temp array and store in questions array
      geo.questions = temp.sort(function(obj1, obj2) {
        return obj1.weight - obj2.weight;
        });
      
      
      console.log("questions ", geo.questions);

      this.getNextQuestion();
    }


    getNextQuestion() {
      // get next country (term)

      if ( geo.questionNumber >= countries.length-1 )
        this.getQuestionOrder();
      else {
        geo.knowledgeTerm = geo.questions[geo.questionNumber].country
        this.questionNumber += 1
      }

      console.log("questionNumber ", this.questionNumber)
      console.log("knowledgeTerm ", this.knowledgeTerm)

      // for testing, put answer on page
      $('#country').html(this.knowledgeTerm.term)

      this.displayMap();
    };

    displayMap() {
      // display gif of country

      // make country name lowercase and add .gif
      var imgURL = (this.knowledgeTerm.term).toLowerCase() + ".gif"

      // replace spaces in filename with underscore
      imgURL = imgURL.replace(/\s/g, '_')
      

      // temporarily use this image
      imgURL = '<img src="/img/quiz/geo/countries/albania.gif" alt="albania.gif">'
      
      // display image on page
      $('#country-image').html(imgURL)

      this.getUserAnswer();
    };

    getUserAnswer() {
      // display answer box, get user answer

      $('#check-answer-btn').removeClass('d-none');

      // listen on "enter" key
      $(document).keypress(function(e) {
        if(e.which == 13 && !$("#game-check-btn").hasClass("disabled")) {
          var userAnswer = $('#answer').val();
          $(document).unbind('keypress');
          geo.checkUserAnswer(userAnswer);
        }
      });

      //  bind correction logic to check button
      $('#check-answer-btn').click(function(){
        var userAnswer = $('#answer').val();
        $('#check-answer-btn').unbind('click');
        geo.checkUserAnswer(userAnswer);
      });
    };

    checkUserAnswer(userAnswer) { 
      // check user answer, give feedback, conitnue... 

      // hide check-answer button
      $('#check-answer-btn').addClass('d-none');

      // add this term to uswer answer array
      this.answers.push(userAnswer);

      // if correct
      if ( userAnswer.toLowerCase() === geo.knowledgeTerm.term.toLowerCase() ) {
        console.log("Correct!")
        $('.correct').removeClass('d-none');
        this.numberCorrect += 1;
        $('#continue-btn').removeClass('d-none');
      }

      // if wrong
      else {
        $('.wrong').removeClass('d-none');
        $('#correct-answer').html(geo.knowledgeTerm.term)
        console.log("Wrong!")
        $('#continue-btn').removeClass('d-none');
      }


      // listen on "enter" key for CONTINUE BUTTON
      $(document).keypress(function(e) {
        if(e.which == 13 ) {
          $(document).unbind('keypress');
          onContinue();
        }
      });

      //  bind correction logic to CONTINUTE
      $('#continue-btn').click(function(){
        $('#check-answer-btn').unbind('click');
        onContinue();
      });

      function onContinue() {
        $('#answer').val("");
        $('#continue-btn').addClass('d-none');
        $('.wrong').addClass('d-none');
        $('.correct').addClass('d-none');
        geo.getNextQuestion();
      }

    };

    showResults() {
      // when game is ended, show user list of countries in strength order

      console.log("number correct ", this.numberCorrect)
    };

    showLeaderboard() {
      // show table of players, #countries known, overall strength score
    };

    showCountryKnowledge(){
      // show table of countries, ordered by average score
    };

  };
 
  // Instantiate Geo Quiz session object
  var geo = new GeoQuiz (user, countries );
  console.log("geo ", geo)


  geo.initializeQuiz()


// end of DOM ready
});