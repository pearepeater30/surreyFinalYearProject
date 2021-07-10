module.exports = {
    ensureBusinessOwner: function(req, res, next) {
        //errors buffer
        errors = []
        //if correct user type, move onto next middlware
        if ((req.user.usertype === true)) {
            return next();
        }
        //redirect if not
        errors.push({
            msg: "Error, your user type does not allow this action",
        });
        res.render("index", {errors, title: "Dashboard", currentUser: req.user})
    },
    ensureCustomer: function(req, res, next) {
        errors = []
        if ((req.user.usertype === false)) {
            return next(); 
        }
        errors.push({
            msg: "Error, your user type does not allow this action",
        });
        res.render("index", {errors, title: "Dashboard", currentUser: req.user})
    }
  }