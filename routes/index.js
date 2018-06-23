const express = require('express');
const router  = express.Router();
const isAdmin = require("../middleware/isAdmin");
const {ensureLoggedIn, ensureLoggedOut} = require("connect-ensure-login");


/* GET index page */
router.get('/', (req, res, next) => {
  res.render('index', {layout: "layout_landing"} );
});

/* GET home page */
router.get('/home', (req, res, next) => {
  res.render('home');
});

/* GET settings page */
router.get('/settings', (req, res, next) => {
  res.render('settings');
});

/* GET admin page */
router.get('/admin', isAdmin(), (req, res, next) => {
  res.render('admin');
});

/* GET profile page */
router.get('/profile', ensureLoggedIn(), (req, res, next) => {
  res.render('profile');
});


module.exports = router;
