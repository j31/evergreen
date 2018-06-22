const express = require('express');
const router  = express.Router();
const isAdmin = require("../middleware/isAdmin");
const {ensureLoggedIn, ensureLoggedOut} = require("connect-ensure-login");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET admin page */
router.get('/admin', isAdmin(), (req, res, next) => {
  res.render('admin');
});

/* GET profile page */
router.get('/protected', ensureLoggedIn(), (req, res, next) => {
  res.render('protected');
});


module.exports = router;
