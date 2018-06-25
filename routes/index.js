const express = require('express');
const router  = express.Router();
const isAdmin = require("../middleware/isAdmin");
const {ensureLoggedIn, ensureLoggedOut} = require("connect-ensure-login");
const Term = require('../models/Term');
const User = require('../models/User');

/* GET index page */
router.get('/', (req, res, next) => {
  if (req.user)
    res.redirect('/home');
  else
    res.render('index', {layout: "layouts/landing"} );
});



/* GET home page */
router.get('/home', ensureLoggedIn(), (req, res, next) => {
  var reqUser = req.user.username
  Promise.all([
    Term.find(),
    User.find({username: reqUser})
    ])
  .then( results => {
    
    var dictionary = JSON.stringify(results[0]);
    var userk = JSON.stringify(results[1]);
    res.render('home', {dictionary, userk});
  })
  .catch(error => { next(error) })
});


router.patch('/knowledge/:username', function(req, res) {
  var username = req.params.username;
  var knowledge = req.body;

  User.findOneAndUpdate({username: username}, {knowledge: knowledge}, {upsert:true}, function(err, doc){
    if (err) return res.send(500, { error: err });
    return res.send("succesfully saved");
  });
});


/* GET settings page */
router.get('/settings', ensureLoggedIn(), (req, res, next) => {
  res.render('settings');
});

// /* GET profile page */
// router.get('/profile', ensureLoggedIn(), (req, res, next) => {
//   res.render('profile');
// });

/* GET admin page */
router.get('/admin', isAdmin(), (req, res, next) => {
  res.render('admin');
});

module.exports = router;
