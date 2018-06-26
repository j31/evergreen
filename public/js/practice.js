// Wait for DOM to load
$(document).ready(function() {
  

  // Get dictionary terms passed to view, and convert back to object
  var dataFromView = $('#dictionary_data').html();
  var dictionary = JSON.parse(dataFromView);
  
  var dataFromView = $('#username_data').html();
  var username = JSON.parse(dataFromView);
  
  var dataFromView = $('#userk_data').html();
  var userk = JSON.parse(dataFromView);
  var knowledge = userk[0].knowledge; 
  
  
  ///// START OF DATA
  
  // Seed data for categories
  var categoriesEnum = [
    { _id: 0, group: "Writings", category: "Sayings", imgFileName: "cat_proverbs.jpg"     },
    { _id: 1, group: "Writings", category: "Mythology", imgFileName: "cat_mythology.jpg"   },
    { _id: 2, group: "Writings", category: "Philosophy", imgFileName: "cat_philosophy.jpg"   },
    { _id: 3, group: "Writings", category: "Literature", imgFileName: "cat_literature.jpg"   },
    { _id: 4, group: "Writings", category: "Religion", imgFileName: "cat_religion.jpg"     },

    { _id: 5, group: "World", category: "Geography", imgFileName: "cat_geography.jpg"    },
    { _id: 6, group: "World", category: "Politics",  imgFileName: "cat_politics.jpg"     },
    { _id: 7, group: "World", category: "Modern History", imgFileName: "cat_mod_history.jpg"  },
    { _id: 8, group: "World", category: "Cont. History",   imgFileName: "cat_cont_history.jpg" },
    { _id: 9, group: "World", category: "Pre-modern History",  imgFileName: "cat_pre_mod_history.jpg" },

    { _id: 10, group: "Sciences", category: "Technology",  imgFileName: "cat_technology.jpg"   },
    { _id: 11, group: "Sciences", category: "Life Sciences",  imgFileName: "cat_life_science.jpg"    },
    { _id: 12, group: "Sciences", category: "Medicine and Health", imgFileName: "cat_medicine.png"        },
    { _id: 13, group: "Sciences", category: "Business & Economics", imgFileName: "cat_business.jpg"     },
    { _id: 14, group: "Sciences", category: "Physical Sciences", imgFileName: "cat_phys_science.jpg"    },
    { _id: 15, group: "Sciences", category: "Social Sciences", imgFileName: "cat_social_science.jpg"  },
    { _id: 16, group: "Sciences", category: "Earth Sciences", imgFileName: "cat_earth_science.jpg"   },

    { _id: 17, group: "Arts", category: "Fine Arts",  imgFileName: "cat_fine_arts.jpg"    },
    { _id: 18, group: "Arts", category: "Classical Music", imgFileName: "cat_clas_music.jpg"   }
  ]
  
  
  
  
  ///// END OF DATA
  
  
  // User class, to simulate multiple users...
  function User (name, knowledge) {
    this.username = name
    this.knowledge = knowledge
    this.currentCategory = categoriesEnum[0]
  };
  
  //  Instantiate user
  var user = new User (username, knowledge);
  
  
  // Main application Class
  function Evergreen (user, dictionary) {
    this.user = user; 
    this.dict = dictionary;
    this.knowledgeOutput = "";
    this.state = "home";
    this.score = 0;
    this.knowledgeTerm = {};
    this.question = "";
    this.answer = "";
    this.questionNum = 0;
    this.gameClock = 0;
    this.gameScore = 0;
    this.intervalId = 0;
  };
  
  
  //  Instantiate Evergreen session object
  var ev = new Evergreen (user, dictionary );
  console.log("ev ", ev)



  // Find unique categories in dictionary
    var flags = [], categoriesInDictionary = [], l = ev.dict.length, i;
    for( i=0; i<l; i++) {
        if( flags[ev.dict[i].cat]) continue;
        flags[ev.dict[i].cat] = true;
        var cat = categoriesEnum.find( cat => cat.category === ev.dict[i].cat )
        categoriesInDictionary.push(cat);
    }

    // INJECT CATEGORY CARDS ONTO HOME PAGE (when they have terms in dictinary)
    var html = '<div class="row justify-content-center">'
    for (i in categoriesInDictionary) {
      html += '<div class="col-xs-6"><div class="card cat-card" style="width: 9rem;"><img class="card-img-top" src="../img/categories/' + categoriesInDictionary[i].imgFileName + '" alt="Card image cap"><div class="card-body"><h6 class="card-title">' + categoriesInDictionary[i].category + '</h6><button type="button" class="btn btn-link cat-card-link" id="'+categoriesInDictionary[i]._id+'">Practice</button></div></div></div>'
    }
    html += '</div>'
    $('#cat-cards').html(html)

    
  
  //  Listen on home-menu buttons (Flashcards...)
  Evergreen.prototype.homeMenu = function () {
    ev.state = "home"
    ev.updateScore();
    $('#flash-cards-btn').unbind('click');
    $('#flash-cards-btn').click(function(){
      $('#home-menu').toggleClass('d-none')
      $('#navigation').toggleClass('d-none')
      ev.initFlashcards();
      ev.flashcards();
    });
    
    $('#quiz-btn').unbind('click');
    $('#quiz-btn').click(function(){
      $('#home-menu').toggleClass('d-none')
      $('#navigation').toggleClass('d-none')
      ev.initQuiz();
      ev.quiz();
    });
    
    $('#game-btn').unbind('click');
    $('#game-btn').click(function(){
      $('#home-menu').toggleClass('d-none')
      $('#navigation').toggleClass('d-none')
      ev.initGame();
      // game called from initGame
    });
    
  }
  
  
  //  Init Game
  Evergreen.prototype.initGame = function () {
    $('#game').toggleClass('d-none')
    ev.state = "game";
    ev.knowledgeTerm = {};
    ev.question = "";
    ev.answer = "";
    ev.questionNum = 0;
    ev.score = 0;
    ev.gameClock = 30;
    ev.gameScore = 0;
    
    
    // clear screen except for start button
    $('.question').addClass('d-none');
    $('.g-answer').addClass('d-none');
    $('#game-skip-btn').addClass('d-none');
    $('#game-check-btn').addClass('d-none');
    $('#game-start-btn').removeClass('d-none');
    ev.updateProgress();
    
    // Set features and listen on CLOSE button
    $('#game-close-btn').unbind('click');
    $('#game-close-btn').click(function(){
      clearInterval(ev.intervalId);
      $('#game').toggleClass('d-none');
      $('#home-menu').toggleClass('d-none');
      $('#navigation').toggleClass('d-none');
      $('.correct').addClass('d-none');
      $('.wrong').addClass('d-none');
      ev.updateScore();
    });
    
    // Set features and listen on START GAME button
    $('#game-start-btn').unbind('click');
    $('#game-start-btn').click(function(){
      $('#game-start-btn').addClass('d-none');
      $('.g-answer').removeClass('d-none');
      $('.question').removeClass('d-none');
      $('#game-skip-btn').removeClass('d-none');
      $('#game-check-btn').removeClass('d-none');
      ev.gameTimer();
      ev.game();
    });
  }
  
  //  Game 
  Evergreen.prototype.game = function () {
    
    if (ev.gameClock > 0) {
      $('#game-check-btn').removeClass('d-none');
      $("#game-check-btn").addClass('disabled');
      ev.getQuestion();
    } else {
      ev.showResults();
    }
  }
  
  Evergreen.prototype.gameTimer = function () {
    ev.intervalId = setInterval(function() { 
      ev.gameClock -= 1
      if (ev.gameClock <= 0) {
        clearInterval(ev.intervalId);
        ev.gameOver();
      }
      
      var display = (ev.gameClock < 10 ? ":0" + ev.gameClock : ":" + ev.gameClock)
      $('#game-clock').text(display);
      document.getElementById("click").play()
    }, 1000);
  }
  
  Evergreen.prototype.gameOver = function () {
    document.getElementById("buzzer").play()
    ev.showResults();
  }
  
  
  //  Init Quiz
  Evergreen.prototype.initQuiz = function () {
    $('#quiz').toggleClass('d-none')
    ev.state = "quiz";
    ev.knowledgeTerm = {};
    ev.question = "";
    ev.answer = "";
    ev.questionNum = 0;
    ev.score = 0;
    ev.gameScore = 0;
    
    // Turn on Quiz Features
    $('#quiz-close-btn').removeClass('d-none');
    $('.answer').removeClass('d-none');
    $('.progress').removeClass('d-none');
    
    // Bind features and listen on close button
    $('#quiz-close-btn').unbind('click');
    $('#quiz-close-btn').click(function(){
      $('#quiz').toggleClass('d-none');
      $('#home-menu').toggleClass('d-none');
      $('#navigation').toggleClass('d-none');
      ev.updateScore();
    });
  }
  
  //  Quiz 
  Evergreen.prototype.quiz = function () {
    if (ev.questionNum < 10) {
      $('#check-answer-btn').removeClass('d-none');
      $("#check-answer-btn").addClass('disabled');
      ev.getQuestion();
    } else {
      ev.showResults();
    }
  }
  
  
  //  Init Flashcards
  Evergreen.prototype.initFlashcards = function () {
    $('.check-btn').addClass('d-none');
    $('#flash-cards').toggleClass('d-none')
    ev.state = "flashcards";
    ev.knowledgeTerm = {};
    ev.question = "";
    ev.answer = "";
    ev.questionNum = 0;
    ev.score = 0;
    ev.gameScore = 0;
    
    $('#close-btn').removeClass('d-none');
    $('.answer').removeClass('d-none');
    $('.progress').removeClass('d-none');
    
    
    $('#close-btn').unbind('click');
    $('#close-btn').click(function(){
      $('#flash-cards').toggleClass('d-none');
      $('#home-menu').toggleClass('d-none');
      $('#navigation').toggleClass('d-none');
      ev.updateScore();
    });
  };
  
  //  Flashcards 
  Evergreen.prototype.flashcards = function () {
    if (ev.questionNum < 10) {
      
      ev.getQuestion();
    } else {
      ev.showResults();
    }
  }
  
  // Update score (on home page)
  Evergreen.prototype.updateScore = function () {
    
    
    //SAVE user knowledge to MongoDB
    
    axios.patch(`http://localhost:3000/knowledge/${username}`, knowledge)
    .then(response => {
      console.log("User knowledge successfully updated")
      console.log("knowledge ", knowledge)

        // current category score 

        // update Current Category  in DOM
        $('#current-category').text(ev.user.currentCategory.category);

        console.log("CURRENT CATEGORY ", ev.user.currentCategory)

        // get strength scores for current category
        var categoryStrengths = ev.user.knowledge.filter( t => t.cat === ev.user.currentCategory.category)

        console.log("DEBUG categoryStrengths ", categoryStrengths)

        // reduce to sum of strength scores
        var userStrength = categoryStrengths.reduce((a,b) => a + b.strength, 0);
        
        console.log("DEBUG userStrength ", userStrength)


        // calculate overall %
        ev.score = Math.round(userStrength / ( categoryStrengths.length * 5 )*100);
        
        // update Current Category score in DOM
        $('#category-score').text(ev.score);

        // overall score 

        // reduce to sum of strength scores
        var userStrength = ev.user.knowledge.reduce((a,b) => a + b.strength, 0);
        
        // calculate overall %
        ev.score = Math.round(userStrength / ( ev.user.knowledge.length * 5 )*100);
        
        // update Current Category score in DOM
        $('#overall-score').text(ev.score);
    })
    .catch(error => {
      console.log(error)
    })
    
  }
  
  
  // Update currently praticing on change
  
  
  $(".cat-card-link").click(function() {
    var catId = this.id
    var newCat = categoriesEnum.find( cat => cat._id == catId )
    ev.user.currentCategory = newCat
    console.log("NEW CARD PICKED", newCat);
    ev.updateScore();
  });
  

  
  
  // Get question 
  Evergreen.prototype.getQuestion = function () {
    console.log("GET QUESTION")
    // Find term with lower strength first
    var i = 0;
    var term = undefined;
    
    while (!term) {
      console.log("IN GET QUESTION currentCat ", ev.user.currentCategory)
      var term = ev.user.knowledge.find(function(t) {
      
        return (t.cat === ev.user.currentCategory.category && t.strength === i)
          
          // ( t.lastTime === undefined || t.lastTime > Date.now() + 1000 )
        });
        
        i++
        if (i>4) {
          console.log("NO TERM FOUND")
        }
      }
      console.log("TERM FOUND IN USER KNOWLEDGE, using ", term)


       //  store user knoweldge term into ev Class object
       ev.knowledgeTerm = term;


      // look up term in dictionary
      var t = ev.dict.find(function(t) {
        return t._id === term._id;
      });
      console.log("TERM FOUND IN DICT, using ", t)
      
     
        
      //  Store Q & A into ev Class object
      ev.question = t.term;
      ev.answer = t.def;


      // set timestamp on Knowledge object (for SKIP in game)
      // term.lastTime = Date.now();
    
      
      //  Increment count number
      ev.questionNum += 1;
      
      ev.updateProgress();
    }
    
    // Update progress (question number)
    Evergreen.prototype.updateProgress = function () {
      
      // calculate percent done of 10 question set
      var percentDone = (ev.questionNum-1)*10;
      
      if (ev.state === "game") {
        percentDone = 0;
      }
      
      // build HTML
      var html = '<div class="progress-bar bg-success" role="progressbar" style="height: 10px;width: ' + percentDone +  '%"></div>'
      
      // update DOM
      $('.progress').html(html);
      
      ev.displayQuestion();
    }
    
    
    // Display question
    Evergreen.prototype.displayQuestion = function () {
      
      if (ev.state === "flashcards") {
        $('.answer').html('');
      }
      var html = "<h3>" + ev.question + "</h3>"
      $('.question').html(html);
      
      ev.revealAnswer();
    }
    
    // Reveal Answer(s)
    Evergreen.prototype.revealAnswer = function () {
      
      // for FLASHCARDS display answer when show button is clicked
      if (ev.state === "flashcards") {
        $('#show-answer-btn').removeClass('d-none')
        
        
        // on [ENTER] ...
        $(document).unbind('keypress')
        $(document).keypress(function(e) {
          if(e.which == 13 && !$("#show-answer-btn").hasClass('d-none')) {
            $('#show-answer-btn').addClass('d-none');
            var html = '<p class="answer-text">' + ev.answer + '</p>'
            $('.answer').html(html);
            
            ev.getUserAnswer();
          }
        });
        
        // on CLICK ...
        $('#show-answer-btn').unbind('click')
        $('#show-answer-btn').click(function(){
          $('#show-answer-btn').addClass('d-none');
          var html = '<p class="answer-text">' + ev.answer + '</p>'
          $('.answer').html(html);
          
          ev.getUserAnswer();
        });
      } 
      
      // // Reveal Answer(s) for QUIZ display multiple choice answers
      if (ev.state === "quiz" ) {
        
        var html = '<div id="answer-box1" class="quiz-answer"><div class="form-check"><input class="form-check-input" type="radio" name="quiz-answer" id="quiz-answer1" value="option1"><label class="form-check-label" for="quiz-answer1">&nbsp; 1. <span id="answer1"></span></label></div></div><div id="answer-box2" class="quiz-answer"><div class="form-check"><input class="form-check-input" type="radio" name="quiz-answer" id="quiz-answer2" value="option2"><label class="form-check-label" for="quiz-answer2">&nbsp; 2. <span id="answer2"></span></label></div></div><div id="answer-box3" class="quiz-answer"><div class="form-check"><input class="form-check-input" type="radio" name="quiz-answer" id="quiz-answer3" value="option3"><label class="form-check-label" for="quiz-answer3">&nbsp; 3.  <span id="answer3"></span></label></div></div><div id="answer-box4" class="quiz-answer"><div class="form-check"><input class="form-check-input" type="radio" name="quiz-answer" id="quiz-answer4" value="option4"><label class="form-check-label" for="quiz-answer4">&nbsp; 4.  <span id="answer4"></span></label></div></div>'
        $('.answer').html(html);
        
        
        
        //uncheck all checkboxes, clear highighting
        $('input[type="radio"]').prop('checked', false);
        $(".quiz-answer").css("background-color", "");
        
        
        
        var answers = []
        
        // add correct answer to answer array
        answers.push(ev.answer)
        
        
        // for the three decoy answers
        for (var x=0; x<3; x++) {
          
          
          // pick a term iD at random from the dictionary, make sure it's not answer
          // also, make sure it's in the current category
          
          var termsInCategory = ev.dict.filter(function(t) {
            return (t.cat === ev.user.currentCategory.category) 
          });
          console.log("Terms in cat ", termsInCategory)
          var randomId = ev.knowledgeTerm._id
          while (randomId === ev.knowledgeTerm._id ) {
            randomIndex = Math.floor(Math.random() * termsInCategory.length)
            randomId = termsInCategory[randomIndex]._id
          }
          
          
          // look this random ID up in the dictionary
          var term = ev.dict.find(function(t) {
            return t._id === randomId;
          });
          
          // add decoy answer to answers array
          answers.push(term.def)
        }
        
        
        // FOR QUIZ display answers in random order on page
        for (var x=1; x<=4; x++) {
          var random = Math.floor(Math.random() * answers.length)
          $('#answer' + x).text(answers[random])
          answers.splice(random,1)
        }
        
        ev.getUserChoice();
      }
      
      
      // // Reveal Answer(s) for GAME display multiple choice answers
      if (ev.state === "game" ) {
        
        var html = '<div id="game-answer-box1" class="game-answer"><div class="form-check"><input class="form-check-input" type="radio" name="game-answer" id="game-answer1" value="option1"><label class="form-check-label" for="game-answer1">&nbsp; 1. <span id="g-answer1"></span></label></div></div><div id="game-answer-box2" class="game-answer"><div class="form-check"><input class="form-check-input" type="radio" name="game-answer" id="game-answer2" value="option2"><label class="form-check-label" for="game-answer2">&nbsp; 2. <span id="g-answer2"></span></label></div></div><div id="game-answer-box3" class="game-answer"><div class="form-check"><input class="form-check-input" type="radio" name="game-answer" id="game-answer3" value="option3"><label class="form-check-label" for="game-answer3">&nbsp; 3. <span id="g-answer3"></span></label></div></div><div id="game-answer-box4" class="game-answer"><div class="form-check"><input class="form-check-input" type="radio" name="game-answer" id="game-answer4" value="option4"><label class="form-check-label" for="game-answer4">&nbsp; 4. <span id="g-answer4"></span></label></div></div>'
        $('.g-answer').html(html);
        
        
        
        //uncheck all checkboxes, clear highighting
        $('input[type="radio"]').prop('checked', false);
        $(".game-answer").css("background-color", "");
        
        
        
        var answers = []
        
        // add correct answer to answer array
        answers.push(ev.answer)
        
        
        // for the three decoy answers
        for (var x=0; x<3; x++) {
          
          
          // pick a term iD at random from the dictionary, make sure it's not answer
          // also, make sure it's in the current category
          
          var termsInCategory = ev.dict.filter(function(t) {
            return (t.cat === ev.user.currentCategory.category) 
          });
          console.log("Terms in cat ", termsInCategory)
          var randomId = ev.knowledgeTerm._id
          while (randomId === ev.knowledgeTerm._id ) {
            randomIndex = Math.floor(Math.random() * termsInCategory.length)+1
            randomId = termsInCategory[randomIndex]._id
          }
          
          
          // look this random ID up in the dictionary
          var term = ev.dict.find(function(t) {
            return t._id === randomId;
          });
          
          // add decoy answer to answers array
          answers.push(term.def)
        }
        
        
        
        // FOR GAME display answers in random order on page
        for (var x=1; x<=4; x++) {
          var random = Math.floor(Math.random() * answers.length)
          $('#g-answer' + x).text(answers[random])
          answers.splice(random,1)
        }
        
        ev.getGameUserChoice();
      }
    }
    
    
    
    
    // Get User Answer on FLASHCARDS (wrong/correct buttons)
    Evergreen.prototype.getUserAnswer = function () {
      $('.check-btn').removeClass('d-none');
      
      // <==  "x" KEY 
      $(document).unbind('keypress')
      $(document).keypress(function(e) {
        if(e.which == 120 ) {
          if (ev.knowledgeTerm.strength === 0)
          ev.knowledgeTerm.strength = 1;
          else {
            ev.knowledgeTerm.strength -= 1;
          }
          
          $('.check-btn').addClass('d-none');
          ev.flashcards();
        }
      });
      
      // <==  "r" KEY 
      $(document).keypress(function(e) {
        if(e.which == 99 ) {
          if (ev.knowledgeTerm.strength === 0)
          ev.knowledgeTerm.strength = 2;
          else if (ev.knowledgeTerm.strength === 5)
          ev.knowledgeTerm.strength = 5;
          else {
            ev.knowledgeTerm.strength += 1;
          }
          
          $('.check-btn').addClass('d-none');
          ev.gameScore++;
          ev.flashcards();
        }
      });
      
      
      
      
      
      
      // WRONG button
      $('#wrong-btn').unbind('click');
      $('#wrong-btn').click(function(){
        if (ev.knowledgeTerm.strength === 0)
        ev.knowledgeTerm.strength = 1;
        else {
          ev.knowledgeTerm.strength -= 1;
        }
        $('.check-btn').addClass('d-none');
        ev.flashcards();
      });
      
      // CORRECT button
      $('#correct-btn').unbind('click');
      $('#correct-btn').click(function(){
        if (ev.knowledgeTerm.strength === 0)
        ev.knowledgeTerm.strength = 2;
        else if (ev.knowledgeTerm.strength === 5)
        ev.knowledgeTerm.strength = 5;
        else {
          ev.knowledgeTerm.strength += 1;
        }
        $('.check-btn').addClass('d-none');
        ev.gameScore++;
        
        ev.flashcards();
      }); 
    }
    
    
    
    
    // Get user Answer on QUIZ (multiple choice)
    Evergreen.prototype.getUserChoice = function () {
      
      //uncheck all checkboxes, clear highighting
      $('input[type="radio"]').prop('checked', false);
      $(".quiz-answer").css("background-color", "");
      
      // IF (#)then...
      
      $(document).unbind('keypress')
      $(document).keypress(function(e) {
        if(e.which == 49) {
          $('#quiz-answer1').prop('checked', true);
          $("#check-answer-btn").removeClass('disabled');
        }
        if(e.which == 50) {
          $('#quiz-answer2').prop('checked', true);
          $("#check-answer-btn").removeClass('disabled');
        }
        if(e.which == 51) {
          $('#quiz-answer3').prop('checked', true);
          $("#check-answer-btn").removeClass('disabled');
        }
        if(e.which == 52) {
          $('#quiz-answer4').prop('checked', true);
          $("#check-answer-btn").removeClass('disabled');
        }
        if(e.which == 13 && !$("#check-answer-btn").hasClass("disabled")) {
          ev.checkUserChoice();
        }
      });
      
      // enable check-answer-btn when radio selection made
      $("input:radio").change(function () {
        $("#check-answer-btn").removeClass('disabled');
      });
      
      
      //  bind correction logic to check button
      $('#check-answer-btn').unbind(click)
      $('#check-answer-btn').click(function(){
        ev.checkUserChoice(); 
      });
    }
    
    
    // Get GAME User Choice (multiple choice)
    Evergreen.prototype.getGameUserChoice = function () {
      
      //uncheck all checkboxes, clear highighting
      $('input[type="radio"]').prop('checked', false);
      $(".g-answer").css("background-color", "");
      
      
      // IF (#)then...
      $(document).unbind('keypress')
      $(document).keypress(function(e) {
        if(e.which == 49) {
          $('#game-answer1').prop('checked', true);
          $("#game-check-btn").removeClass('disabled');
        }
        if(e.which == 50) {
          $('#game-answer2').prop('checked', true);
          $("#game-check-btn").removeClass('disabled');
        }
        if(e.which == 51) {
          $('#game-answer3').prop('checked', true);
          $("#game-check-btn").removeClass('disabled');
        }
        if(e.which == 52) {
          $('#game-answer4').prop('checked', true);
          $("#game-check-btn").removeClass('disabled');
        }
        if(e.which == 13 && !$("#game-check-btn").hasClass("disabled")) {
          ev.checkGameUserChoice();
        }
      });
      
      // enable check-answer-btn when radio selection made
      $("input:radio").change(function () {
        $("#game-check-btn").removeClass('disabled');
      });
      
      
      //  bind correction logic to check button
      $('#game-check-btn').unbind('click')
      $('#game-check-btn').click(function(){
        ev.checkGameUserChoice(); 
      });
      
      //  listen on SKIP QUESTION button
      $('#game-skip-btn').unbind('click')
      $('#game-skip-btn').click(function(){
        ev.getQuestion();
      });
    }
    
    
    
    
    //  CHECK USER CHOICE FOR QUIZ
    Evergreen.prototype.checkUserChoice = function () {
      // determine which answer was selected
      if ($('input[name=quiz-answer]:checked').val() === 'option1'){
        var selection = $('#answer1').text()
        var selectionNum = 1;
      }
      
      if ($('input[name=quiz-answer]:checked').val() === 'option2'){
        var selection = $('#answer2').text()
        var selectionNum = 2;
      }
      
      if ($('input[name=quiz-answer]:checked').val() === 'option3'){
        var selection = $('#answer3').text()
        var selectionNum = 3;
      }
      
      if ($('input[name=quiz-answer]:checked').val() === 'option4'){
        var selection = $('#answer4').text()
        var selectionNum = 4;
      }
      
      
      //  Highlight correct answer
      if ( $('#answer1').text() === ev.answer )
      $("#answer-box1").css("background-color", "lightgreen");
      if ( $('#answer2').text() === ev.answer )
      $("#answer-box2").css("background-color", "lightgreen");
      if ( $('#answer3').text() === ev.answer )
      $("#answer-box3").css("background-color", "lightgreen");
      if ( $('#answer4').text() === ev.answer )
      $("#answer-box4").css("background-color", "lightgreen");
      
      
      // determine if selection matches answer
      var isCorrect = (selection === ev.answer)
      
      
      // IF SELECTION is WRONG
      if (!isCorrect) {
        
      
        
        if (ev.knowledgeTerm.strength === 0)
        ev.knowledgeTerm.strength = 1;
        else
        ev.knowledgeTerm.strength -= 1;
        $('#check-answer-btn').addClass('d-none');
        $('.incorrect').removeClass('d-none');
      };
      
      // IF SELECTION is CORRECT
      if (isCorrect) {
        
     
        // Increment Game Score
        ev.gameScore++;
        
        
        if (ev.knowledgeTerm.strength === 0)
        ev.knowledgeTerm.strength = 3;
        else if (ev.knowledgeTerm.strength === 5)
        ev.knowledgeTerm.strength = 5;
        else
        ev.knowledgeTerm.strength += 1;
        $('#check-answer-btn').addClass('d-none');
        $('.correct').removeClass('d-none');
      }; 
      
      
      //  bind correction logic to check button & to [ENTER]
      $('#continue-quiz-btn').removeClass('d-none');
      
      // IF [ENTER]  then...
      $(document).unbind('keypress')
      $(document).keypress(function(e) {
        if(e.which == 13 && !$("#continue-quiz-btn").hasClass("d-none")) {
          $('#continue-quiz-btn').addClass('d-none');
          $('.correct').addClass('d-none');
          $('.incorrect').addClass('d-none');
          ev.quiz();
        }
      });
      
      // IF CLICK  then...
      $('#continue-quiz-btn').unbind('click')
      $('#continue-quiz-btn').click(function(){
        
        $('#continue-quiz-btn').addClass('d-none');
        $('.correct').addClass('d-none');
        $('.incorrect').addClass('d-none');
        ev.quiz();
      })
    }
    
    
    //  *************************************************************
    //  CHECK USER CHOICE FOR GAME
    //  *************************************************************
    Evergreen.prototype.checkGameUserChoice = function () {
      
      
      // determine which answer was selected
      if ($('input[name=game-answer]:checked').val() === 'option1'){
        var selection = $('#g-answer1').text()
        var selectionNum = 1;
      }
      
      if ($('input[name=game-answer]:checked').val() === 'option2'){
        var selection = $('#g-answer2').text()
        var selectionNum = 2;
      }
      
      if ($('input[name=game-answer]:checked').val() === 'option3'){
        var selection = $('#g-answer3').text()
        var selectionNum = 3;
      }
      
      if ($('input[name=game-answer]:checked').val() === 'option4'){
        var selection = $('#g-answer4').text()
        var selectionNum = 4;
      }
      
      
      //  Highlight correct answer
      if ( $('#g-answer1').text() === ev.answer )
      $("#game-answer-box1").css("background-color", "lightgreen");
      if ( $('#g-answer2').text() === ev.answer )
      $("#game-answer-box2").css("background-color", "lightgreen");
      if ( $('#g-answer3').text() === ev.answer )
      $("#game-answer-box3").css("background-color", "lightgreen");
      if ( $('#g-answer4').text() === ev.answer )
      $("#game-answer-box4").css("background-color", "lightgreen");
      
      
      // determine if selection matches answer
      var isCorrect = (selection === ev.answer)
      
      
      // IF SELECTION is WRONG
      if (!isCorrect) {
        
        // PLAY "wrong" Sound
        document.getElementById("wrong").play()
        
        if (ev.knowledgeTerm.strength < 2)
        ev.knowledgeTerm.strength = 1;
        else {
          ev.knowledgeTerm.strength -= 1;
        }
        $('#game-check-btn').addClass('d-none');
        $('#game-skip-btn').addClass('d-none');
        $('.incorrect').removeClass('d-none');
      };
      
      // IF SELECTION is CORRECT
      if (isCorrect) {
        
        // Play "correct" sound
        document.getElementById("correct").play();
        
        // Update game score
        ev.gameScore += 1;
        console.log(ev.gameScore);
        $('#game-score').text(ev.gameScore);
        
        // Add Bonus Time to gameClock
        ev.gameClock += 5;
        
        // Adjust Strength Value
        if (ev.knowledgeTerm.strength === 0)
        ev.knowledgeTerm.strength = 3;
        else if (ev.knowledgeTerm.strength === 5)
        ev.knowledgeTerm.strength = 5;
        else {
          ev.knowledgeTerm.strength += 1;
        }
        
        //  Turn off buttons and show ""correct" icon
        $('#game-check-btn').addClass('d-none');
        $('#game-skip-btn').addClass('d-none');
        $('.correct').removeClass('d-none');
      }; 
      
      //  bind correction logic to check button & to [ENTER]
      $('#continue-game-btn').removeClass('d-none');
      
      // IF [ENTER]  then...
      $(document).unbind('keypress')
      $(document).keypress(function(e) {
        if(e.which == 13 && !$("#continue-game-btn").hasClass("d-none")) {
          $('#continue-game-btn').addClass('d-none');
          $('#game-skip-btn').removeClass('d-none');
          $('.correct').addClass('d-none');
          $('.incorrect').addClass('d-none');
          ev.game();
        }
      });
      
      // IF CLICK  then...
      $('#continue-game-btn').unbind('click')
      $('#continue-game-btn').click(function(){
        $('#continue-game-btn').addClass('d-none');
        $('#game-skip-btn').removeClass('d-none');
        $('.correct').addClass('d-none');
        $('.incorrect').addClass('d-none');
        ev.game();
      })
    }
    
    
    
    
    Evergreen.prototype.showResults = function () {
      
      if (ev.state === "flashcards" || ev.state === "quiz" ) {
        $('#close-btn').addClass('d-none');
        $('.correct').addClass('d-none')
        $('.wrong').addClass('d-none')
        $('.answer').addClass('d-none')
        $('.continue-game-btn').removeClass('d-none')
      }
      
      
      if (ev.state === "game") {
        $('#game-close-btn').addClass('d-none');
        $('#game-skip-btn').addClass('d-none')
        $('#game-check-btn').addClass('d-none')
        $('.correct').addClass('d-none')
        $('.wrong').addClass('d-none')
        $('.g-answer').addClass('d-none')
        $('.continue-game-btn').addClass('d-none')
      }
      
      
      $('.continue-btn').removeClass('d-none')
      $('.answer').html("");
      
      var percentDone = 100;
      var html = '<div class="progress-bar bg-success" role="progressbar" style="height: 10px;width: ' + percentDone +  '%"></div>'
      $('.progress').html(html);
      ev.updateScore()
      
      if (ev.state === "flashcards") {
        var html = '<h1>Results...</h1><br><h3>You answered ' + ev.gameScore + ' correctly.</h3>'
        $('.question').html(html);
      }
      
      if (ev.state === "quiz") {
        var html = '<h1>Quiz result</h1><br><h3>You answered ' + ev.gameScore + ' correctly.</h3>'
        $('.question').html(html);
      }
      
      if (ev.state === "game") {
        var html = '<h1>Game over</h1><br><h3>You answered ' + ev.gameScore + ' correctly.</h3>'
        $('.question').html(html);
      }
      
      
      // ON [ENTER]....
      $(document).unbind('keypress')
      $(document).keypress(function(e) {
        if(e.which == 13 ) {
          $('.continue-btn').addClass('d-none')
          $('#home-menu').toggleClass('d-none');
          $('#navigation').toggleClass('d-none');
          
          if (ev.state === "flashcards")
          $('#flash-cards').toggleClass('d-none');
          
          if (ev.state === "quiz")
          $('#quiz').toggleClass('d-none');
          
          if (ev.state === "game")
          $('#game').toggleClass('d-none');
          
          
          // ev.homeMenu()
          ev.updateScore();
        }
      });
      
      
      // ON BUTTON CLICK
      $('.continue-btn').unbind('click');
      $('.continue-btn').click(function(){
        $('.continue-btn').addClass('d-none')
        $('#home-menu').toggleClass('d-none');
        $('#navigation').toggleClass('d-none');
        
        if (ev.state === "flashcards")
        $('#flash-cards').toggleClass('d-none');
        
        if (ev.state === "quiz")
        $('#quiz').toggleClass('d-none');
        
        if (ev.state === "game")
        $('#game').toggleClass('d-none');
        
        // ev.homeMenu()
        ev.state = "home"
        ev.updateScore();
      });
    }
    
    
    
    // Start main app
    ev.homeMenu();
    
  
    
    //// END OF DOC READY!!
  });
  
  