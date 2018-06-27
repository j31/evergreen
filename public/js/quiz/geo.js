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
 
  // Main application Class
  class GeoQuiz {
    constructor (user, countries) {
    this.user = user; 
    this.dict = countries;
    this.knowledgeTerm = {};
    this.questionNumber = 0;
    this.numberCorrect = 0;
    this.questions = [];
    };


    startSection() {

      $('footer').addClass('d-none');

      // Show start section
      $('#start-btn').unbind('click');
      $('#start-btn').click(function(){
        $('#continue-btn').addClass('d-none');
        $('#start').addClass('d-none');
        $('#quiz').removeClass('d-none');
 
        geo.initializeQuiz();
      });
    }

    initializeQuiz() {
      // Hide nav and footer
      $('#navigation').addClass('d-none');

      // Get the list of questions
      geo.getQuestionOrder();

      // Listen on "Finished Game" button
      $('#close-btn').unbind('click');
      $('#close-btn').click(function(){
        $('#navigation').removeClass('d-none');
        $('footer').removeClass('d-none');
        $('#quiz').addClass('d-none');
        $('#close-btn').addClass('d-none');
        geo.showResults();
      });
    };

    

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
      var imgFileName = (this.knowledgeTerm.term).toLowerCase() + ".gif"

      // replace spaces in filename with underscore
      imgFileName =  imgFileName.replace(/\s/g, '_')
      

      // temporarily use this image
      var imgURL = '<img width="200" src="/img/quiz/geo/countries/' + imgFileName + '">'

      console.log(imgURL)
      
      // display image on page
      $('#country-image').html(imgURL)

      this.getUserAnswer();
    };

    getUserAnswer() {
      // display answer box, get user answer

      $('#answer').focus()

      $('#check-answer-btn').removeClass('d-none');

      // listen on "enter" key
      $(document).unbind('keypress');
      $(document).keypress(function(e) {
        if(e.which == 13 && !$("#game-check-btn").hasClass("disabled")) {
          var userAnswer = $('#answer').val();
          geo.checkUserAnswer(userAnswer);
        }
      });

      //  bind correction logic to check button
      $('#check-answer-btn').unbind('click');
      $('#check-answer-btn').click(function(){
        var userAnswer = $('#answer').val();
        geo.checkUserAnswer(userAnswer);
      });
    };

    checkUserAnswer(userAnswer) { 
      // check user answer, give feedback, conitnue... 

      // hide check-answer button
      $('#check-answer-btn').addClass('d-none');


      // if correct
      if ( userAnswer.toLowerCase() === geo.knowledgeTerm.term.toLowerCase() ) {
        console.log("Correct!")
        $('.correct').removeClass('d-none');
        this.numberCorrect += 1;
        $('#continue-btn').removeClass('d-none');

        var id = geo.knowledgeTerm._id

        console.log("DEBUG id, ", id)
        console.log("DEBUG geo.knowledgeTerm, ", geo.knowledgeTerm)
    
        var i = knowledge.findIndex(x => x._id === id);
        
        console.log("DEBUG i, ", i)

        if ( knowledge[i].strength <= 5 ) {
          knowledge[i].strength += 1; 
        }

        console.log("New strength is ", knowledge[i].strength )



        // update user knowledge in Database
        axios.patch(`http://localhost:3000/knowledge/${username}`, knowledge)
        .then(response => {
          console.log("User knowledge updated")
        })
        .catch(error => {
          console.log(error)
        })
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
      $('#results').removeClass('d-none');
      console.log("number correct ", this.numberCorrect)
      
      // var percentageCorrect = (geo.numberCorrect / geo.questionNumber * 100).toFixed(0);

      var html = `<h3>You got ${geo.numberCorrect} out of ${geo.questionNumber} correct.</h3><br><br>`
     
      html += `<h1>Well done!</h1>`

      $('#results-list').html(html);

    };

    showLeaderboard() {
      // show table of players, #countries known, overall strength score
    };

    showCountryKnowledge(){
      // show table of countries, ordered by average score
    };

  };
 

  // Instantiate user
  var user = new User (username, knowledge );

  // Instantiate Geo Quiz session object
  var geo = new GeoQuiz (user, countries );
  console.log("geo ", geo)
  
  geo.startSection()


// end of DOM ready
});