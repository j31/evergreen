

function isAdmin (){
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin === true) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = isAdmin;