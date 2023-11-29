const Campground = require("./models/Campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./Schemas");
const ExpressError = require("./utils/ExpressError");
module.exports.isLoggedin = (req, res, next) => {
  console.log("here in logged in");
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be signed in first!");
    return res.redirect("/login");
  }
  console.log("here out of logged in");
  next();
};

module.exports.validateCampground = (req, res, next) => {
  console.log("in validateCampground");
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    console.log("out validateCampground");
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You donnot have permission to do that! ");
    return res.redirect(`/campground/${campground._id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You donnot have permission to do that! ");
    return res.redirect(`/campground/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
