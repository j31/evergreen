const express = require('express');
const router  = express.Router();
const isAdmin = require("../middleware/isAdmin");
const {ensureLoggedIn, ensureLoggedOut} = require("connect-ensure-login");
const Term = require('../models/Term');
const User = require('../models/User');

/* GET landing (index) page */
router.get('/', (req, res, next) => {
  if (req.user)
    res.redirect('/home');
  else
    res.render('index', {layout: "layouts/landing"} );
});


/* GET home page */
router.get('/home', ensureLoggedIn(), (req, res, next) => {
  res.render('home');
});


/* GET geo quiz page */
router.get('/quiz/geo', ensureLoggedIn(), (req, res, next) => {
  var reqUser = req.user.username
  Promise.all([
    Term.find( {type: "country"} ),
    User.find( {username: reqUser} ),
    User.find()
    ])
  .then( results => {
    
    var scores = []
    for (var i in results[2]) {
      var countryScores = results[2][i].knowledge.filter( k => k.type === "country")
      var score = countryScores.reduce((a,b) => a + b.strength, 0);
      scores.push( {'username': results[2][i].username, 'score':score} )

      var sortedScores = scores.sort(function(obj1, obj2) {
        return obj2.score - obj1.score;
      });
    }

   
    // Find all user country scores
    var allUsersScores = [];
    for (var i in results[2]) {
      var countryScores = results[2][i].knowledge.filter( k => k.type === "country")
      allUsersScores.push(...countryScores)
    }

    var countries = results[0]
    var scoresByCountry = []

    for (var i = 0; i < countries.length; i++) {
      var oneCountryScores = allUsersScores.filter( e => e._id == countries[i]._id )
      oneCountryScore = oneCountryScores.reduce((a,b) => a + b.strength, 0);
    
      scoresByCountry.push( {'country': countries[i].term, 'score':oneCountryScore} )
    }

    var sum = scoresByCountry.reduce((a,b) => a + b.score, 0);

    console.log("sum ", sum)
    for (var i=0; i < scoresByCountry.length; i++) {
      scoresByCountry[i].score = Math.round( (scoresByCountry[i].score / sum) * 100)
      console.log("scoresByCountry ", scoresByCountry[i])
    }
    
    var sortedCountryScores = scoresByCountry.sort(function(obj1, obj2) {
      return obj2.score - obj1.score;
    });
    

    // console.log ("countries ", results[0])
    // console.log ("userk ", results[1])
    // console.log ("leaderboard ", leaderboard)
    // console.log ("countryScores", countryScores)

    var countries = JSON.stringify(results[0]);
    var userk = JSON.stringify(results[1]);
    var leaderboard = JSON.stringify(sortedScores);
    var countryScores = JSON.stringify(sortedCountryScores);

    res.render('quiz/geo', {countries, userk, leaderboard, countryScores});
  })
  .catch(error => { next(error) })
});




/* GET practice page */
router.get('/practice', ensureLoggedIn(), (req, res, next) => {
  var reqUser = req.user.username
  Promise.all([
    Term.find(),
    User.find({username: reqUser})
    ])
  .then( results => {
    
    var dictionary = JSON.stringify(results[0]);
    var userk = JSON.stringify(results[1]);
    res.render('practice', {dictionary, userk});
  })
  .catch(error => { next(error) })
});


router.patch('/knowledge/:username', function(req, res) {
  var username = req.params.username;
  var knowledge = req.body;
  console.log("incomming patch")
  User.findOneAndUpdate({username: username}, {knowledge: knowledge}, {upsert:true}, function(err, doc){
    if (err) return res.send(500, { error: err });
    return res.send("succesfully saved");
  });
});

/* GET explore page */
router.get('/explore', ensureLoggedIn(), (req, res, next) => {
  var reqUser = req.user.username
  Promise.all([
    Term.find(),
    User.find({username: reqUser})
    ])
  .then( results => {
    
    var dictionary = JSON.stringify(results[0]);
    var userk = JSON.stringify(results[1]);
    res.render('explore', {dictionary, userk});
  })
  .catch(error => { next(error) })
});

/* GET settings page */
router.get('/settings', ensureLoggedIn(), (req, res, next) => {
  res.render('settings');
});

/* GET profile page */
router.get('/profile/:id', ensureLoggedIn(), (req, res, next) => {
  User.findOne ({ username: req.params.id })
  .then( user => {
    res.render('profile', { user });
  })
  .catch(error => { next(error) })
});

router.post('/profile/:id', ensureLoggedIn(), (req, res, next) => {
  let { username } = req.body;
  User.findByIdAndUpdate({ _id: req.params.id }, { username })
  .then((user) => {
    res.redirect('/home')
  })
  .catch((error) => {
    console.log(error)
  })
});


/* GET progress page */
router.get('/progress', ensureLoggedIn(), (req, res, next) => {
  res.render('progress');
});

/* GET admin page */
router.get('/admin', isAdmin(), (req, res, next) => {
  res.render('admin');
});

module.exports = router;
