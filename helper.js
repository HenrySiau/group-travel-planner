// middleware that required a login
var requiresLogin = function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    req.flash('msg', 'Please login first');

    res.redirect('/login');
  }
};

var mid = {requiresLogin: requiresLogin};

export default mid;