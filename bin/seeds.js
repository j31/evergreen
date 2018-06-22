require('dotenv').config();

const mongoose = require('mongoose');
const User     = require('../models/User');
const bcrypt   = require("bcrypt");

// Connect to DB
mongoose
  .connection.openUri(process.env.MONGODB_URI)
  .then(() => {
    console.log('seeds.js: connected to Mongo!')
  }).catch(err => {
    console.error('seeds.js: problems connecting to mongo', err)
  });

// Set up Salt for bcrypt HASH
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);

// Create admin/admin user
const admin = new User({
  username: "admin",
  password: bcrypt.hashSync("admin", salt),
  isAdmin: true
});

// Delete all and save admin user
User.deleteMany()
  .then(() => User.create(admin))
  .then(userDocuments => {
    console.log("Successfully seeded MongoDB")
    mongoose.connection.close()
  })
  .catch(err => {throw(err)})