const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../Schemas");
const Campground = require("../models/Campground");
const Review = require("../models/review");

router.post(
  "/",
  isLoggedin,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    campground.reviews.push(newReview);
    await campground.save();
    req.flash("success", "Success! created new review! ");
    res.redirect(`/campground/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted ! ");
    res.redirect(`/campground/${id}`);
  })
);

module.exports = router;
