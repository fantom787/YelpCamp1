const user = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("user/register");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const newuser = new user({ email, username });
    const registeredUser = await user.register(newuser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campground");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/campground/new";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((e) => {
    if (e) {
      next(e);
    }
    req.flash("success", "Goodbye!");
    return res.redirect("/campground");
  });
};
