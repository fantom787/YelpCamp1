const express = require("express");
const router = express.Router();
const user = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
router.get("/register", (req, res) => {
  res.render("user/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const newuser = new user({ email, username });
      const registeredUser = await user.register(newuser, password);
      console.log(registeredUser);
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
  })
);
router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/campground/new";
    console.log(req.session);
    res.redirect(redirectUrl);
  }
);
router.get("/logout", (req, res, next) => {
  req.logout((e) => {
    if (e) {
      next(e);
    }
    req.flash("success", "Goodbye!");
    return res.redirect("/campground");
  });
});
module.exports = router;
