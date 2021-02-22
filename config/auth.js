module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    console.log('Please log in to view this resource')
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');    
  }
}