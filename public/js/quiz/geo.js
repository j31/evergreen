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

  var dataFromView = $('#leaderboard_data').html();
  var leaderboard = JSON.parse(dataFromView);

  var dataFromView = $('#countryScores_data').html();
  var countryScores = JSON.parse(dataFromView);


  // console.log("countries ", countries );
  console.log("knowledge ", knowledge );
  // console.log("leaderboard ", leaderboard );
  // console.log("countryScores ", countryScores );

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

      // Start Button
      $('#start-btn').unbind('click');
      $('#start-btn').click(function(){
        $('#continue-btn').addClass('d-none');
        $('#start').addClass('d-none');
        $('#quiz').removeClass('d-none');
 
        geo.initializeQuiz();
      });

      // Leaderboard Link
      $('#leaderboard-btn').unbind('click');
      $('#leaderboard-btn').click(function(){
        $('#continue-btn').addClass('d-none');
        $('#start').addClass('d-none');
 
        geo.showLeaderboard();
      });

      // Show Countries Link
      $('#countries-btn').unbind('click');
      $('#countries-btn').click(function(){
        $('#continue-btn').addClass('d-none');
        $('#start').addClass('d-none');
  
        geo.showCountryScores()
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

//     // Update progress (question number)
//     updateProgress () {
  
//       calculate percent done of 10 question set
//       var percentDone = (geo.questionNumber)*10;
      
// console.log(geo.questionNumber)

//       build HTML
//       var html = '<div class="progress-bar bg-success" role="progressbar" style="height: 10px;width: ' + percentDone +  '%"></div>'
      
//       update DOM
//       $('#progress').html(html);
//     }

    getQuestionOrder() {
      // create array of Terms in order

      var temp = []
      for ( let i=0; i < countries.length; i++ ) {
        
        // get user strength score or this term and square it
        var strength = knowledge.find( k => k._id == countries[i]._id ).strength
        
     
        // strength 0-5 --> 16, 81, 128 ... ?? not saving user scores
        if (strength == 1)
          var chance = 10
        else if (strength == 2)
          var chance = 15
        else
          var chance = ( strength * strength ) + 10;

        console.log ("******************* chance1 ", chance)

        // stage  1-9 
        chance += ( countries[i].stage * 2)
        console.log ("******************* chance2 ", chance)

        // add a random factor (adding 0-9 to weight)
        chance += Math.floor(Math.random() * 10 );
        console.log ("******************* chance3 ", chance)

        // subtact for community knowledge
        var c = countryScores.find( e => e.country == countries[i].term )
        chance -= c.score 

        console.log ("cscore ", c.score)
        console.log ("******************* chance4 ", chance)


        console.log ("******************* chance Final ", chance)

        temp.push( { "country" : countries[i], "weight" : chance } )
      }
      
      // sort the temp array and store in questions array
      geo.questions = temp.sort(function(obj1, obj2) {
        return obj1.weight - obj2.weight;
      });
      
      console.log("questions ", geo.questions);


      for (let i=0; i < geo.questions.length; i++) {

      // make country name lowercase and add .gif
      var imgFileName = (geo.questions[i].country.term).toLowerCase() + ".gif"

      // // replace spaces in filename with underscore
      imgFileName =  imgFileName.replace(/\s/g, '_')
      
      // temporarily use this image
      var imgURL = `https://evg.herokuapp.com/img/quiz/geo/countries/${imgFileName}`

      console.log("imgURL ", imgURL);
        let img1 = new Image();
        img1.src = imgURL;
      }
      
      



      this.getNextQuestion();
    }


    getNextQuestion() {
      // get next country (term)

      if ( geo.questionNumber >= 20 ) {
        $('#navigation').removeClass('d-none');
        $('footer').removeClass('d-none');
        $('#quiz').addClass('d-none');
        $('#close-btn').addClass('d-none');
        geo.showResults();
      };

      let html = `${geo.questionNumber+1} / 20`
      $('#question-num').html(html)

      if ( geo.questionNumber >= countries.length-1 )
        this.getQuestionOrder();
      else {
        geo.knowledgeTerm = geo.questions[geo.questionNumber].country
      }


      this.displayMap();
    };

    displayMap() {
      // display gif of country

      // make country name lowercase and add .gif
      var imgFileName = (this.knowledgeTerm.term).toLowerCase() + ".gif"

      // replace spaces in filename with underscore
      imgFileName =  imgFileName.replace(/\s/g, '_')
      
      // temporarily use this image
      var imgURL = '<img id="country-img" src="/img/quiz/geo/countries/' + imgFileName + '">'

    
      // display image on page
      $('#country-image').html(imgURL)

      this.getUserAnswer();
    };

    getUserAnswer() {
      // display answer box, get user answer

      $('#answer').focus()

      $('#check-answer-btn').removeClass('d-none');
  

      // working on disable answer button before answer feature
      // listen on change in answer box
      // $('#answer').on('change keyup paste', function() {
      //   $("#check-answer-btn").removeClass('disabled')
      // });
      // add to bind on enter key
      // && !$("#check-answer-btn").hasClass("disabled")


      // listen on "enter" key
      $(document).unbind('keypress');
      $(document).keypress(function(e) {
        if(e.which == 13) {
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
      this.questionNumber += 1

     
      let c1 = userAnswer.toUpperCase() === geo.knowledgeTerm.term.toUpperCase() 
      let c2 = ( geo.knowledgeTerm.altTerms ? geo.knowledgeTerm.altTerms.includes(userAnswer.toUpperCase()) : false )

      // if correct
      if ( c1 || c2 ) {
        console.log("Correct!")
        $('.correct').removeClass('d-none');
        this.numberCorrect += 1;
        $('#continue-btn').removeClass('d-none');

        var id = geo.knowledgeTerm._id

        var i = knowledge.findIndex(x => x._id === id);
        
        if ( knowledge[i].strength < 5 ) {
          knowledge[i].strength += 1; 
        }

        console.log("UPDATING THIS ONE ", knowledge[i])
        axios.patch(`/knowledge/${username}`, knowledge)
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
      $(document).unbind('keypress');
      $(document).keypress(function(e) {
        if(e.which == 13 ) {
          onContinue();
        }
      });

      //  bind correction logic to CONTINUTE
      $('#continue-btn').unbind('click');
      $('#continue-btn').click(function(){
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
      
      var percentageCorrect = (geo.numberCorrect / geo.questionNumber * 100).toFixed(0);
      var yourScores = knowledge.filter( k => k.cat === "Geography")
      var yourScore = yourScores.reduce((a,b) => a + b.strength, 0);

      var html =""
      if (geo.numberCorrect > 0 ) {
      html = `<h4>You got ${geo.numberCorrect} out of ${geo.questionNumber} correct.</h4><br><br>`
      }

      html += `<h2>Your score: ${yourScore}</h2><br>`
     
      if (geo.numberCorrect > 10 )
        html += `<h1>Amazing!</h1>`
      else if (geo.numberCorrect > 5 )
      html += `<h1>Great!</h1>`
      else if (geo.numberCorrect > 0 )
        html += `<h1>Well done!</h1>`

      $('#results-list').html(html);

    };

    showLeaderboard() {
      // show table of players, #countries known, overall strength score
      $('#leaderboard-section').removeClass('d-none');
 
      var html = "<table><tr><th style='width: 300px; font-weight: bold'>Username</th><th style='width: 100px; font-weight: bold'>Points</th></tr>"
      for (let i in leaderboard) {
        
        html += `<tr><td>${leaderboard[i].username}</td><td>${leaderboard[i].score}</td></tr>`
        console.log(html)
      }
      html += "</table>"

      $('#leaderboard-list').html(html);
    };

    showCountryScores(){
      // show table of countries, ordered by average score
      $('#countryScores-section').removeClass('d-none');
 
      var html = "<table><tr><th style='width: 300px; font-weight: bold'>Country</th><th style='width: 100px; font-weight: bold'>Weight</th></tr>"
      for (let i in countryScores) {
        if ( countryScores[i].score > 0 ) {
        html += `<tr><td>${countryScores[i].country}</td><td>${countryScores[i].score}</td></tr>`
         }
      }
      html += "</table>"

      $('#countryScores-list').html(html);
    };

  };
 

  // Instantiate user
  var user = new User (username, knowledge );

  // Instantiate Geo Quiz session object
  var geo = new GeoQuiz (user, countries );

  
  geo.startSection()


// end of DOM ready
});