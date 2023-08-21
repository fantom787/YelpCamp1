const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../Schemas");

const reviews = require("../controllers/reviews");

router.post(
  "/",
  isLoggedin,
  validateReview,
  catchAsync(reviews.createNewReview)
);

router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
