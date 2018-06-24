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

    const newUser = new User({
      username,
      password: hashPass,
      knowledge: [
        { termId: 1,   strength: 0 },
        { termId: 2,   strength: 0 },
        { termId: 3,   strength: 0 },
        { termId: 4,   strength: 0 },
        { termId: 5,   strength: 0 },
        { termId: 6,   strength: 0 },
        { termId: 7,   strength: 0 },
        { termId: 8,   strength: 0 },
        { termId: 9,   strength: 0 },
        { termId: 10,   strength: 0 },
        { termId: 11,   strength: 0 },
        { termId: 12,   strength: 0 },
        { termId: 13,   strength: 0 },
        { termId: 14,   strength: 0 },
        { termId: 15,   strength: 0 },
        { termId: 16,   strength: 0 },
        { termId: 17,   strength: 0 },
        { termId: 18,   strength: 0 },
        { termId: 19,   strength: 0 },
        { termId: 20,   strength: 0 },
        { termId: 21,   strength: 0 },
        { termId: 22,   strength: 0 },
        { termId: 23,   strength: 0 },
        { termId: 24,   strength: 0 },
        { termId: 25,   strength: 0 },
        { termId: 26,   strength: 0 },
        { termId: 27,   strength: 0 },
        { termId: 28,   strength: 0 },
        { termId: 29,   strength: 0 },
        { termId: 30,   strength: 0 },
        { termId: 31,   strength: 0 },
        { termId: 32,   strength: 0 },
        { termId: 33,   strength: 0 },
        { termId: 34,   strength: 0 },
        { termId: 35,   strength: 0 },
        { termId: 36,   strength: 0 },
        { termId: 37,   strength: 0 },
        { termId: 38,   strength: 0 },
        { termId: 39,   strength: 0 },
        { termId: 40,   strength: 0 },
        { termId: 41,   strength: 0 },
        { termId: 42,   strength: 0 },
        { termId: 43,   strength: 0 },
        { termId: 44,   strength: 0 },
        { termId: 45,   strength: 0 },
        { termId: 46,   strength: 0 },
        { termId: 47,   strength: 0 },
        { termId: 48,   strength: 0 },
        { termId: 49,   strength: 0 },
        { termId: 50,   strength: 0 },
        { termId: 51,   strength: 0 },
        { termId: 52,   strength: 0 },
        { termId: 53,   strength: 0 }
      ]  
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
