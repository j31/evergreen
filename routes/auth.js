const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { 
    "message": req.flash("error"), 
    "layout": "layouts/auth" });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup", { 
    "layout": "layouts/auth" });
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const rol = req.body.role;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Please enter your username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    
    var initKnowledge = []
    for (i=1; i<54; i++) {
      initKnowledge.push({ _termId: i, strength: 0, cat:"Sayings"})
    }
    for (i=54; i<77; i++) {
      initKnowledge.push({ _termId: i, strength: 0, cat:"Business & Economics"})
    }

    const newUser = new User({
      username,
      password: hashPass,
      knowledge: initKnowledge
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/login");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
