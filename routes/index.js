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

  User.findOneAndUpdate({username: username}, {knowledge: knowledge}, {upsert:true}, function(err, doc){
    if (err) return res.send(500, { error: err });
    return res.send("succesfully saved");
  });
});

/* GET explore page */
router.get('/explore', ensureLoggedIn(), (req, res, next) => {
  res.render('explore');
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
